import { Router, Request, Response } from "express";
import { ai } from "./geminiService.js";
import { Type } from "@google/genai";

export const apiRouter = Router();

// 1. Agronomist AI Chat
apiRouter.post("/gemini/chat", async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [], language = "en", context = {} } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemInstruction = `You are AgriVision AI, an expert Senior Agricultural Scientist and Practical Farm Advisor.
You help farmers, agricultural students, and agronomists with crop disease diagnosis, soil nutrient management, precision irrigation, pest control, and farm decision support systems.
Language requested: ${language}. If the language is not English (e.g. Hindi, Spanish, Punjabi), provide clear, respectful, easy-to-understand farm guidance in that language, using standard farming terms with easy translations.
Context about current farm: ${JSON.stringify(context)}.
Keep explanations actionable, clear, scientifically grounded, and tailored to practical farming realities. Include bullet points, exact dosage/measurements where applicable, and eco-friendly/organic options alongside chemical ones.`;

    const contents: any[] = [];
    
    // Add past history if available
    if (Array.isArray(conversationHistory)) {
      conversationHistory.slice(-8).forEach((item: any) => {
        if (item.role && item.text) {
          contents.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.text }],
          });
        }
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "No response received from Agronomist AI.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/gemini/chat:", error);
    return res.status(500).json({
      error: error.message || "Failed to process chat query",
      fallbackReply: "AgriVision advisory engine is operating in standard mode. Please ensure optimal moisture levels (50-70%), monitor for early pest emergence under leaves, and inspect soil N-P-K balance before sowing.",
    });
  }
});

// 2. Crop Disease & Pest Vision Diagnosis
apiRouter.post("/gemini/diagnose-crop", async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", cropName, symptoms, fieldNotes } = req.body;

    const promptText = `Analyze this agricultural crop sample.
Crop Name / Variety: ${cropName || "Not specified (identify from visual)"}
Observed Symptoms: ${symptoms || "Visual inspection required"}
Field Notes: ${fieldNotes || "Standard open field"}

Provide a comprehensive diagnosis in valid JSON adhering to the specified schema:
- diagnosisName: Common and biological name of the disease or pest
- confidenceScore: Percentage 0-100
- severity: "Mild" | "Moderate" | "Severe" | "Critical"
- affectedParts: Array of parts (Leaves, Stem, Roots, Fruit/Grains)
- primaryCause: Fungal, Bacterial, Viral, Insect Pest, or Nutritional Deficiency
- visualFindings: Bulleted visual symptoms detected
- immediateAction: Urgent steps in first 24-48 hours
- organicTreatment: Eco-friendly/biological control remedies
- chemicalTreatment: Standard recommended pesticides/fungicides with application precaution
- preventionStrategy: Cultural and preventive practices for next cycle
- impactOnYieldEstimate: Estimated percentage yield loss if untreated vs if treated`;

    const parts: any[] = [];
    if (imageBase64) {
      // Strip any data:image/...;base64, prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: { parts },
      config: {
        systemInstruction: "You are an expert Phytopathologist and Plant Doctor AI. Diagnose crop conditions accurately with actionable farming remedies.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosisName: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            severity: { type: Type.STRING },
            affectedParts: { type: Type.ARRAY, items: { type: Type.STRING } },
            primaryCause: { type: Type.STRING },
            visualFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
            immediateAction: { type: Type.STRING },
            organicTreatment: { type: Type.ARRAY, items: { type: Type.STRING } },
            chemicalTreatment: { type: Type.ARRAY, items: { type: Type.STRING } },
            preventionStrategy: { type: Type.ARRAY, items: { type: Type.STRING } },
            impactOnYieldEstimate: { type: Type.STRING },
          },
          required: [
            "diagnosisName",
            "confidenceScore",
            "severity",
            "affectedParts",
            "primaryCause",
            "visualFindings",
            "immediateAction",
            "organicTreatment",
            "chemicalTreatment",
            "preventionStrategy",
            "impactOnYieldEstimate"
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/gemini/diagnose-crop:", error);
    return res.status(500).json({
      error: error.message || "Failed to analyze crop image",
      fallback: {
        diagnosisName: "Early Stage Leaf Blight (Alternaria / Fungal Complex)",
        confidenceScore: 88,
        severity: "Moderate",
        affectedParts: ["Lower foliage", "Stem margins"],
        primaryCause: "Fungal Pathogen",
        visualFindings: ["Concentric brown necrotic lesions with chlorotic yellow halo", "Edge curling on older leaves"],
        immediateAction: "Prune heavily infected lower leaves and avoid overhead sprinkler irrigation during dusk.",
        organicTreatment: ["Neem oil spray (0.5% concentration at dusk)", "Trichoderma viride bio-fungicide foliar drench (5g/L)"],
        chemicalTreatment: ["Mancozeb 75% WP @ 2.5g/L or Azoxystrobin 23% SC @ 1ml/L with 7-day pre-harvest interval"],
        preventionStrategy: ["Crop rotation with non-host legumes", "Wider row spacing for canopy airflow", "Drip irrigation to keep leaves dry"],
        impactOnYieldEstimate: "15-25% reduction if untreated; <3% loss if managed promptly.",
      },
    });
  }
});

// 3. Soil Nutrient Analysis & Fertilizer Optimizer
apiRouter.post("/gemini/soil-advice", async (req: Request, res: Response) => {
  try {
    const { crop, soilType, nitrogen, phosphorus, potassium, ph, organicCarbon, targetYieldHectare } = req.body;

    const prompt = `Analyze this soil test data and provide an automated decision support recommendation:
- Crop to Grow: ${crop || "Wheat"}
- Soil Texture/Type: ${soilType || "Loamy"}
- Nitrogen (N): ${nitrogen} kg/ha (or mg/kg)
- Phosphorus (P): ${phosphorus} kg/ha (or mg/kg)
- Potassium (K): ${potassium} kg/ha (or mg/kg)
- Soil pH: ${ph}
- Organic Carbon: ${organicCarbon || "0.65%"}
- Target Yield: ${targetYieldHectare || "5.0 tons/ha"}

Generate a detailed soil health report adhering to the JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a Senior Soil Scientist & Precision Agronomy Specialist. Calculate exact fertilizer requirements (Urea, DAP, MOP), pH correction, and soil health management.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            soilHealthRating: { type: Type.STRING, description: "e.g. Moderate - Slightly Acidic" },
            overallHealthScore: { type: Type.NUMBER, description: "0 to 100" },
            nutrientDeficits: {
              type: Type.OBJECT,
              properties: {
                nitrogenStatus: { type: Type.STRING },
                phosphorusStatus: { type: Type.STRING },
                potassiumStatus: { type: Type.STRING },
                phStatus: { type: Type.STRING },
              },
              required: ["nitrogenStatus", "phosphorusStatus", "potassiumStatus", "phStatus"],
            },
            fertilizerPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  fertilizerName: { type: Type.STRING },
                  dosagePerAcre: { type: Type.STRING },
                  applicationTiming: { type: Type.STRING },
                  method: { type: Type.STRING },
                },
                required: ["fertilizerName", "dosagePerAcre", "applicationTiming", "method"],
              },
            },
            organicAmendments: { type: Type.ARRAY, items: { type: Type.STRING } },
            phCorrectionStrategy: { type: Type.STRING },
            expectedYieldImpact: { type: Type.STRING },
            salinityRisk: { type: Type.STRING },
          },
          required: [
            "soilHealthRating",
            "overallHealthScore",
            "nutrientDeficits",
            "fertilizerPlan",
            "organicAmendments",
            "phCorrectionStrategy",
            "expectedYieldImpact",
            "salinityRisk"
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/gemini/soil-advice:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate soil advice",
      fallback: {
        soilHealthRating: "Moderate Fertility with Nitrogen Deficiency",
        overallHealthScore: 72,
        nutrientDeficits: {
          nitrogenStatus: "Low (Needs supplement for vegetative growth)",
          phosphorusStatus: "Adequate for root establishment",
          potassiumStatus: "Moderate",
          phStatus: "Slightly Alkaline (pH 7.4) - Good for most cereals",
        },
        fertilizerPlan: [
          { fertilizerName: "Urea (46% N)", dosagePerAcre: "45 kg/acre", applicationTiming: "Split into Basal (30%) + First Irrigation (35%) + Tillering (35%)", method: "Side dressing / Top dressing" },
          { fertilizerName: "DAP (18-46-0)", dosagePerAcre: "30 kg/acre", applicationTiming: "Basal dose at sowing time", method: "Drilled 5cm below seed furrow" },
          { fertilizerName: "MOP (Muriate of Potash 60% K2O)", dosagePerAcre: "20 kg/acre", applicationTiming: "Basal dose at final land prep", method: "Broadcasting with soil incorporation" },
        ],
        organicAmendments: [
          "Apply 4-5 tonnes well-decomposed Farm Yard Manure (FYM) or Vermicompost per acre",
          "Incorporate green manure (Dhaincha/Sesbania) every alternate season",
          "Apply bio-fertilizer Azotobacter + PSB @ 2 kg/acre mixed with compost",
        ],
        phCorrectionStrategy: "Maintain organic matter to naturally buffer pH. Avoid excessive synthetic ammonium nitrate.",
        expectedYieldImpact: "Target yield of 5.2 tonnes/ha achievable with timely split nitrogen application.",
        salinityRisk: "Low electrical conductivity; no immediate salinity risk.",
      },
    });
  }
});

// 4. Automated Smart Irrigation Advisory & Water Management
apiRouter.post("/gemini/irrigation-advisory", async (req: Request, res: Response) => {
  try {
    const {
      cropType,
      growthStage,
      soilMoisturePercent,
      temperatureC,
      humidityPercent,
      forecastRainNext3DaysMm,
      irrigationMethod,
    } = req.body;

    const prompt = `Calculate precision irrigation decision support recommendations:
- Crop: ${cropType || "Paddy Rice / Wheat"}
- Stage: ${growthStage || "Flowering & Grain Filling"}
- Measured Soil Moisture: ${soilMoisturePercent}% (Optimal target: 55-75%)
- Current Ambient Temp: ${temperatureC}°C
- Ambient Humidity: ${humidityPercent}%
- Rain Forecast (Next 72h): ${forecastRainNext3DaysMm} mm
- Irrigation System: ${irrigationMethod || "Drip Irrigation"}

Compute evapotranspiration (ETc), immediate valve trigger status (OPEN/HOLD/CLOSE), water volume required, and water savings analysis.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an AI Smart Irrigation & Water Hydrology Engineer for precision agriculture.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            irrigationStatus: { type: Type.STRING, description: "TRIGGER_NOW | SCHEDULED_DELAY | HOLD_DUE_TO_RAIN | MOISTURE_OPTIMAL" },
            urgencyLevel: { type: Type.STRING, description: "CRITICAL | MODERATE | LOW | NORMAL" },
            recommendedWaterMm: { type: Type.NUMBER },
            recommendedDurationMinutes: { type: Type.NUMBER },
            bestTimeToIrrigate: { type: Type.STRING },
            dailyEvapotranspirationMm: { type: Type.NUMBER },
            waterSavingsVsFloodPercent: { type: Type.NUMBER },
            smartAlarmReasoning: { type: Type.STRING },
            actionChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            "irrigationStatus",
            "urgencyLevel",
            "recommendedWaterMm",
            "recommendedDurationMinutes",
            "bestTimeToIrrigate",
            "dailyEvapotranspirationMm",
            "waterSavingsVsFloodPercent",
            "smartAlarmReasoning",
            "actionChecklist"
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/gemini/irrigation-advisory:", error);
    return res.status(500).json({
      error: error.message || "Failed to calculate irrigation advisory",
      fallback: {
        irrigationStatus: "SCHEDULED_DELAY",
        urgencyLevel: "MODERATE",
        recommendedWaterMm: 14.5,
        recommendedDurationMinutes: 45,
        bestTimeToIrrigate: "Early Morning (05:30 AM - 07:30 AM) to minimize evaporation",
        dailyEvapotranspirationMm: 4.8,
        waterSavingsVsFloodPercent: 42,
        smartAlarmReasoning: "Soil moisture is currently 42% against threshold of 60%. However, 12mm rain is forecasted in 36 hours. Delay full irrigation and provide a light maintenance cycle.",
        actionChecklist: [
          "Check drip emitter pressure at sector manifold",
          "Set automated valve timer for 45 minutes at 05:30 AM",
          "Re-evaluate soil moisture probe after rain event",
        ],
      },
    });
  }
});

// 5. Innovation Design Challenge Prototype Generator (Step 3 & Step 4 of the Student / Farmer Activity)
apiRouter.post("/gemini/generate-prototype", async (req: Request, res: Response) => {
  try {
    const {
      problemChosen, // "Water Wastage" | "Pest attacks" | "Soil quality" | "Low crop yield" | custom
      customProblemDetail,
      prototypeTheme, // "AI Green Drone / Crop Doctor" | "Smart Irrigation Alarm" | "Pest Detection Camera" | "Soil Nutrient Predictor" | custom
      targetAudience, // "Smallholder Farmers" | "Commercial Greenhouses" | "Rural Farming Collectives"
    } = req.body;

    const prompt = `You are helping a student and farmer team build a comprehensive submission for the 'S.S Agriculture Chapter Activity: Innovation Design Challenge'.
Based on the assignment requirements:
Step 1: Problem Identification (${problemChosen} - ${customProblemDetail || ""})
Step 2: AI Exploration (Comparing AI solutions)
Step 3: Innovation Design Challenge (Prototype idea, solution name, workflow, tech stack, benefits)
Step 4: Model Creation (Diagram model, cardboard prototype guide, flowchart system design, digital concept poster specifications).

Target Innovation Theme: ${prototypeTheme}
Target Beneficiaries: ${targetAudience || "Smallholder farmers"}

Generate a complete, deeply engaging prototype blueprint in JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an award-winning Agricultural Robotics & AI Design Challenge Mentor. Output structured, highly realistic, educational, and deployable prototype designs.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            solutionName: { type: Type.STRING },
            tagline: { type: Type.STRING },
            problemChosen: { type: Type.STRING },
            problemImpactSummary: { type: Type.STRING },
            howItWorks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["stepNumber", "title", "description"],
              },
            },
            requiredTechnology: {
              type: Type.OBJECT,
              properties: {
                hardware: { type: Type.ARRAY, items: { type: Type.STRING } },
                softwareAndAI: { type: Type.ARRAY, items: { type: Type.STRING } },
                connectivity: { type: Type.ARRAY, items: { type: Type.STRING } },
                powerSource: { type: Type.STRING },
              },
              required: ["hardware", "softwareAndAI", "connectivity", "powerSource"],
            },
            expectedBenefits: {
              type: Type.OBJECT,
              properties: {
                waterSavedPercent: { type: Type.STRING },
                yieldIncreasePercent: { type: Type.STRING },
                chemicalReductionPercent: { type: Type.STRING },
                costReturnPeriod: { type: Type.STRING },
                summary: { type: Type.STRING },
              },
              required: ["waterSavedPercent", "yieldIncreasePercent", "chemicalReductionPercent", "costReturnPeriod", "summary"],
            },
            flowchartSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  nodeType: { type: Type.STRING, description: "sensor | edge_ai | cloud_decision | actuator | user_alert" },
                  label: { type: Type.STRING },
                  subtext: { type: Type.STRING },
                  next: { type: Type.STRING },
                },
                required: ["id", "nodeType", "label", "subtext"],
              },
            },
            cardboardPrototypeGuide: {
              type: Type.OBJECT,
              properties: {
                materialsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
                stepByStepAssembly: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      step: { type: Type.INTEGER },
                      instruction: { type: Type.STRING },
                      visualCue: { type: Type.STRING },
                    },
                    required: ["step", "instruction", "visualCue"],
                  },
                },
                interactiveDemoTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["materialsNeeded", "stepByStepAssembly", "interactiveDemoTips"],
            },
            digitalPosterContent: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                keyStats: { type: Type.ARRAY, items: { type: Type.STRING } },
                systemArchitectureSummary: { type: Type.STRING },
                callToAction: { type: Type.STRING },
              },
              required: ["headline", "keyStats", "systemArchitectureSummary", "callToAction"],
            },
          },
          required: [
            "solutionName",
            "tagline",
            "problemChosen",
            "problemImpactSummary",
            "howItWorks",
            "requiredTechnology",
            "expectedBenefits",
            "flowchartSteps",
            "cardboardPrototypeGuide",
            "digitalPosterContent"
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/gemini/generate-prototype:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate prototype",
      fallback: {
        solutionName: "AgriVision Green Sentinel: AI Autonomous Crop Doctor & Smart Irrigation Hub",
        tagline: "Bridging Edge AI, Multispectral Drone Vision, and Closed-Loop Soil Hydrology for Zero-Wastage Agriculture",
        problemChosen: "Water Wastage & Pest Attacks",
        problemImpactSummary: "Over 60% of irrigation water is lost to unmonitored flood irrigation and evapotranspiration, while pest attacks decimate up to 30% of harvest before symptoms become visible to the naked human eye.",
        howItWorks: [
          { stepNumber: 1, title: "Multimodal Sensing", description: "Capacitive soil probes measure moisture and NPK at 15cm root depth, while solar optical trap cameras capture high-res leaf images." },
          { stepNumber: 2, title: "Edge AI Diagnosis", description: "Onboard ESP32/Raspberry Pi micro-models detect early pest nymphs and soil moisture deficit within 300 milliseconds." },
          { stepNumber: 3, title: "Cloud DSS Synchronization", description: "Gemini Vision AI validates pathogen strain, cross-checks 5-day weather forecast, and computes exact evapotranspiration (ETc)." },
          { stepNumber: 4, title: "Automated Actuation & Alert", description: "Automated solenoid valves pulse targeted drip lines, and instant voice/SMS notifications are sent to the farmer's smartphone." }
        ],
        requiredTechnology: {
          hardware: ["Capacitive Soil Moisture Sensor (v1.2)", "ESP32-CAM AI Vision Module", "12V DC Solenoid Latching Valve", "Solar Panel (10W) + LiFePO4 Battery"],
          softwareAndAI: ["Gemini 3.7 Vision Model", "YOLOv8 Edge Pest Classifier", "MQTT Micro-telemetry Broker", "React Web DSS Dashboard"],
          connectivity: ["LoRaWAN (Long Range 868/915MHz)", "4G LTE Gateway", "Local Bluetooth BLE"],
          powerSource: "10W Monocrystalline Solar Panel with MPPT charge controller",
        },
        expectedBenefits: {
          waterSavedPercent: "45% reduction in irrigation volume",
          yieldIncreasePercent: "22% boost in marketable harvest",
          chemicalReductionPercent: "38% cut in prophylactic pesticide sprays",
          costReturnPeriod: "Single harvest season (4-6 months)",
          summary: "Transforms reactive farming into predictive precision agriculture with minimal manual intervention.",
        },
        flowchartSteps: [
          { id: "1", nodeType: "sensor", label: "Soil & Optical Sensors", subtext: "Moisture %, NPK, Leaf Cam", next: "2" },
          { id: "2", nodeType: "edge_ai", label: "Edge Microcontroller (ESP32)", subtext: "Filter noise & trigger threshold", next: "3" },
          { id: "3", nodeType: "cloud_decision", label: "Gemini AI Decision Engine", subtext: "Pathogen ID + Weather forecast cross-ref", next: "4" },
          { id: "4", nodeType: "actuator", label: "Smart Valve & Drone Dispatch", subtext: "Precision drip pulse / Bio-spray", next: "5" },
          { id: "5", nodeType: "user_alert", label: "Farmer Smartphone DSS", subtext: "Voice alert in local language + visual map", next: "" },
        ],
        cardboardPrototypeGuide: {
          materialsNeeded: ["Corrugated cardboard boxes", "1 wooden skewer or straw (for drone arm/valve)", "Printed circuit & sensor cutout diagrams", "LED diodes or paper indicator markers", "Glue gun / double-sided tape", "Poster markers / colored paper"],
          stepByStepAssembly: [
            { step: 1, instruction: "Cut out a 30x20cm cardboard base to represent the farm plot with green paper crop rows.", visualCue: "Field Base" },
            { step: 2, instruction: "Fold a 10x8cm box into the 'AI Central Hub / Solar Inverter' and mount atop a toothpick pole.", visualCue: "Control Tower" },
            { step: 3, instruction: "Craft a miniature quadcopter drone or optical pole camera using bottle caps and straws.", visualCue: "AI Vision Camera" },
            { step: 4, instruction: "Run blue yarn strings across crops to represent underground smart drip irrigation lines.", visualCue: "Drip Pipeline" },
            { step: 5, instruction: "Attach color-coded status badges: Green (Healthy/Moist), Yellow (Needs Water), Red (Pest Alert).", visualCue: "Status Indicators" },
          ],
          interactiveDemoTips: [
            "Demonstrate the 'Pest Attack' by placing a red token on a cardboard crop leaf, then show how the AI camera sounds the buzzer.",
            "Pour a small simulated bead/marble down the blue pipeline to demonstrate automated valve opening when soil moisture drops.",
          ],
        },
        digitalPosterContent: {
          headline: "AgriVision: Empowering Farmers Through AI Innovation",
          keyStats: ["45% Water Conserved", "22% Higher Yield", "38% Less Chemical Runoff"],
          systemArchitectureSummary: "Real-time sensing -> Edge AI filtering -> Cloud Decision Engine -> Autonomous Actuation & Vernacular Voice Support.",
          callToAction: "Built for the S.S Agriculture Innovation Challenge - Transforming Agriculture with AI",
        },
      },
    });
  }
});

// 6. Project Grader & Rubric Evaluator for School Activity (Steps 1 to 4)
apiRouter.post("/gemini/evaluate-project", async (req: Request, res: Response) => {
  try {
    const { studentName, projectTitle, problemSolved, aiMechanism, techUsed, benefitsClaimed } = req.body;

    const prompt = `Grade this student submission for the 'S.S Agriculture Chapter Activity' against the 4 evaluation criteria from the notebook:
1. Understanding of A.I Concept (Max 25 pts)
2. Creativity & Innovation (Max 25 pts)
3. Problem Solving & Practicality for Farmers (Max 25 pts)
4. Presentation & Structure (Max 25 pts)

Student Project Details:
- Student/Team: ${studentName || "Student Innovator"}
- Project Title: ${projectTitle || "Smart Farming AI"}
- Problem Addressed: ${problemSolved}
- AI Working Principle: ${aiMechanism}
- Technologies Specified: ${techUsed}
- Expected Benefits: ${benefitsClaimed}

Provide structured feedback, score breakdown, strengths, areas for improvement, and teacher's endorsement note in JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an encouraging, rigorous STEM and Social Science Teacher and Science Fair Judge.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalScore: { type: Type.INTEGER, description: "Out of 100" },
            letterGrade: { type: Type.STRING, description: "A+, A, B+, etc." },
            criteriaScores: {
              type: Type.OBJECT,
              properties: {
                aiUnderstanding: { type: Type.INTEGER, description: "out of 25" },
                creativity: { type: Type.INTEGER, description: "out of 25" },
                problemSolving: { type: Type.INTEGER, description: "out of 25" },
                presentation: { type: Type.INTEGER, description: "out of 25" },
              },
              required: ["aiUnderstanding", "creativity", "problemSolving", "presentation"],
            },
            feedbackStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            constructiveSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            teacherRemarks: { type: Type.STRING },
            certificateTitle: { type: Type.STRING },
          },
          required: [
            "totalScore",
            "letterGrade",
            "criteriaScores",
            "feedbackStrengths",
            "constructiveSuggestions",
            "teacherRemarks",
            "certificateTitle"
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/gemini/evaluate-project:", error);
    return res.status(500).json({
      error: error.message || "Failed to evaluate project",
      fallback: {
        totalScore: 94,
        letterGrade: "A+",
        criteriaScores: {
          aiUnderstanding: 24,
          creativity: 23,
          problemSolving: 24,
          presentation: 23,
        },
        feedbackStrengths: [
          "Clear linkage between the identified agricultural bottleneck (water wastage) and automated sensing.",
          "Realistic edge-to-cloud IoT architecture using affordable microcontrollers.",
          "Strong presentation of quantifiable benefits for smallholder farmers.",
        ],
        constructiveSuggestions: [
          "Add details on solar battery backup during prolonged monsoon overcast days.",
          "Explore multi-lingual voice feedback for farmers with limited literacy.",
        ],
        teacherRemarks: "Outstanding project! Demonstrates deep grasp of modern AI applications in agriculture with high social impact and practicality.",
        certificateTitle: "Excellence in Agricultural AI Innovation",
      },
    });
  }
});

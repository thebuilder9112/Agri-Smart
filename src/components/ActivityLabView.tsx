import React, { useState } from "react";
import {
  Activity,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  Lightbulb,
  Cpu,
  Layers,
  Printer,
  Download,
  Share2,
  Award,
  ChevronRight,
  Plus,
  Compass,
  FileCheck,
  Loader2,
  Sliders,
  Send,
} from "lucide-react";
import {
  SurveyResponse,
  InnovationPrototype,
  EvaluationResult,
} from "../types/agriculture";
import { INITIAL_SURVEYS, NOTEBOOK_PROTOTYPES } from "../data/mockData";

export const ActivityLabView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Surveys
  const [surveys, setSurveys] = useState<SurveyResponse[]>(INITIAL_SURVEYS);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [newFarmerName, setNewFarmerName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newAcres, setNewAcres] = useState(5.0);
  const [newProblem, setNewProblem] = useState<SurveyResponse["primaryProblem"]>("Water Wastage");
  const [newSeverity, setNewSeverity] = useState<SurveyResponse["severityLevel"]>("High");
  const [newYieldLoss, setNewYieldLoss] = useState(25);
  const [newTradMethod, setNewTradMethod] = useState("");

  // Step 2: Exploration
  const [selectedExplorationTool, setSelectedExplorationTool] = useState<"disease" | "weather" | "soil">("disease");

  // Step 3: Innovation Prototype
  const [selectedPrototypeKey, setSelectedPrototypeKey] = useState<string>("drone-doctor");
  const [currentPrototype, setCurrentPrototype] = useState<InnovationPrototype>(NOTEBOOK_PROTOTYPES["drone-doctor"]);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [customProblem, setCustomProblem] = useState("Water Wastage & Runoff in Saline Soil");
  const [customTheme, setCustomTheme] = useState("Solar-powered Micro-desalination and AI Drip Sensor");

  // Step 4: Model Creation & Rubric Evaluation
  const [studentName, setStudentName] = useState("Aarav & Science Team");
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Add survey response
  const handleAddSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmerName.trim()) return;
    const newSurvey: SurveyResponse = {
      id: `surv-${Date.now()}`,
      farmerName: newFarmerName,
      villageLocation: newLocation || "Local Farm District",
      acresCultivated: newAcres,
      mainCrops: "Wheat & Paddy",
      primaryProblem: newProblem,
      severityLevel: newSeverity,
      reportedYieldLossPercent: newYieldLoss,
      traditionalMethodUsed: newTradMethod || "Manual guesswork / routine spraying",
      willingnessToAdoptAI: "High",
      recordedDate: new Date().toISOString().slice(0, 10),
    };
    setSurveys([newSurvey, ...surveys]);
    setIsSurveyModalOpen(false);
    setNewFarmerName("");
    setNewTradMethod("");
  };

  // Generate Custom Prototype from Gemini
  const handleGenerateCustomPrototype = async () => {
    setIsGeneratingCustom(true);
    try {
      const response = await fetch("/api/gemini/generate-prototype", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemChosen: customProblem,
          prototypeTheme: customTheme,
          targetAudience: "Smallholder & Village Farmers",
        }),
      });
      const data = await response.json();
      setCurrentPrototype(data);
      setSelectedPrototypeKey("custom");
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  // Evaluate Project via Rubric
  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const response = await fetch("/api/gemini/evaluate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          projectTitle: currentPrototype.solutionName,
          problemSolved: currentPrototype.problemChosen,
          aiMechanism: currentPrototype.tagline,
          techUsed: currentPrototype.requiredTechnology.hardware.join(", ") + " & " + currentPrototype.requiredTechnology.softwareAndAI.join(", "),
          benefitsClaimed: currentPrototype.expectedBenefits.summary,
        }),
      });
      const data = await response.json();
      setEvaluationResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handlePrintPoster = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Activity Header with 4 Steps Wizard */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              S.S Agriculture Chapter Activity & Innovation Challenge
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Interactive 4-Step Agricultural AI Design Hub
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Official Activity Assignment • Deadline: <strong>17th August 2026</strong> • Rubric: Concept, Creativity, Problem Solving & Presentation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300">
              Step {activeStep} of 4 Active
            </span>
          </div>
        </div>

        {/* Step Buttons Tracker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <button
            onClick={() => setActiveStep(1)}
            className={`p-3 rounded-lg text-left border transition-all ${
              activeStep === 1
                ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
                : "border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
              Step 1
            </div>
            <div className="text-xs font-bold truncate">Problem Identification</div>
            <div className="text-[11px] text-slate-500 truncate">Survey farmer issues</div>
          </button>

          <button
            onClick={() => setActiveStep(2)}
            className={`p-3 rounded-lg text-left border transition-all ${
              activeStep === 2
                ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
                : "border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
              Step 2
            </div>
            <div className="text-xs font-bold truncate">A.I Exploration</div>
            <div className="text-[11px] text-slate-500 truncate">Compare AI solutions</div>
          </button>

          <button
            onClick={() => setActiveStep(3)}
            className={`p-3 rounded-lg text-left border transition-all ${
              activeStep === 3
                ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
                : "border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
              Step 3
            </div>
            <div className="text-xs font-bold truncate">Innovation Design</div>
            <div className="text-[11px] text-slate-500 truncate">Prototype idea & specs</div>
          </button>

          <button
            onClick={() => setActiveStep(4)}
            className={`p-3 rounded-lg text-left border transition-all ${
              activeStep === 4
                ? "border-amber-600 bg-amber-50 text-amber-950 shadow-sm"
                : "border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-0.5">
              Step 4
            </div>
            <div className="text-xs font-bold truncate">Model & Poster Creator</div>
            <div className="text-[11px] text-slate-500 truncate">Flowchart, 3D & Rubric</div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: PROBLEM IDENTIFICATION & FARMER SURVEY */}
      {/* ========================================================================= */}
      {activeStep === 1 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  Step 1: Problem Identification Survey Matrix
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Notebook Requirement: "Students survey local farming issues such as low crop yield (Water Wastage, Pest Attacks, Soil Quality) and record responses in a table."
                </p>
              </div>

              <button
                onClick={() => setIsSurveyModalOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                Record New Farmer Survey
              </button>
            </div>

            {/* Aggregated Problem Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-1.5">
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                  Issue 1: Water Wastage
                </span>
                <div className="text-2xl font-bold text-sky-950">
                  {surveys.filter((s) => s.primaryProblem === "Water Wastage").length} Reports
                </div>
                <p className="text-xs text-sky-900 leading-relaxed">
                  Caused by unmonitored flood/furrow pumping, leading to 40-60% groundwater loss and power waste.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                  Issue 2: Pest Attacks
                </span>
                <div className="text-2xl font-bold text-rose-950">
                  {surveys.filter((s) => s.primaryProblem === "Pest attacks").length} Reports
                </div>
                <p className="text-xs text-rose-900 leading-relaxed">
                  Late visual discovery of whitefly & blights leads to 25-35% harvest destruction and toxic spraying.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  Issue 3: Soil Quality Degradation
                </span>
                <div className="text-2xl font-bold text-amber-950">
                  {surveys.filter((s) => s.primaryProblem === "Soil quality").length} Reports
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Imbalanced Urea over-application without NPK testing causes soil acidification and organic depletion.
                </p>
              </div>
            </div>

            {/* Survey Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Farmer Name & Village</th>
                    <th className="p-3">Cultivated Land</th>
                    <th className="p-3">Primary Problem Identified</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Est. Yield Loss</th>
                    <th className="p-3">Traditional Method Used</th>
                    <th className="p-3">AI Readiness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {surveys.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{s.farmerName}</div>
                        <div className="text-[10px] text-slate-500">{s.villageLocation}</div>
                      </td>
                      <td className="p-3 font-semibold">{s.acresCultivated} Acres</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.primaryProblem === "Water Wastage"
                              ? "bg-sky-100 text-sky-800"
                              : s.primaryProblem === "Pest attacks"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {s.primaryProblem}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-800">{s.severityLevel}</span>
                      </td>
                      <td className="p-3 font-bold text-rose-700">{s.reportedYieldLossPercent}% Loss</td>
                      <td className="p-3 text-slate-600 max-w-[200px] truncate">{s.traditionalMethodUsed}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {s.willingnessToAdoptAI}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Next Step CTA */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                Proceed to Step 2: A.I Exploration
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: A.I EXPLORATION & COMPARISON MATRIX */}
      {/* ========================================================================= */}
      {activeStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                Step 2: A.I Exploration & Comparative Evaluation
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Notebook Requirement: "Simple A.I applications in agriculture: Crop disease detection apps, Weather prediction tools, Soil analysis tools. Students to discuss which problem can A.I solve the best."
              </p>
            </div>

            {/* 3 Main AI Applications Explorer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tool 1 */}
              <div
                onClick={() => setSelectedExplorationTool("disease")}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  selectedExplorationTool === "disease"
                    ? "border-emerald-600 bg-emerald-50/80 shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold mb-3">
                  🔍
                </div>
                <h3 className="text-sm font-bold text-slate-900">Crop Disease Detection Apps</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Computer vision & deep learning models classify leaf spot pathogens and recommend immediate bio/chemical sprays.
                </p>
                <div className="mt-3 text-[11px] font-semibold text-emerald-800">
                  Yield Saved: <strong>Up to 35%</strong> • Speed: <strong>&lt; 2 seconds</strong>
                </div>
              </div>

              {/* Tool 2 */}
              <div
                onClick={() => setSelectedExplorationTool("weather")}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  selectedExplorationTool === "weather"
                    ? "border-emerald-600 bg-emerald-50/80 shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold mb-3">
                  🌦️
                </div>
                <h3 className="text-sm font-bold text-slate-900">Weather Prediction Tools</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Hyperlocal satellite radar models predict rainfall, frost, and heatwaves 72 hours ahead to stop wasted irrigation.
                </p>
                <div className="mt-3 text-[11px] font-semibold text-emerald-800">
                  Water Conserved: <strong>45-50%</strong> • Frost Protection: <strong>High</strong>
                </div>
              </div>

              {/* Tool 3 */}
              <div
                onClick={() => setSelectedExplorationTool("soil")}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  selectedExplorationTool === "soil"
                    ? "border-emerald-600 bg-emerald-50/80 shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3">
                  🌱
                </div>
                <h3 className="text-sm font-bold text-slate-900">Soil Analysis Tools</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Optical N-P-K spectrometry and AI recommendation models calculate exact nutrient balance and pH restoration.
                </p>
                <div className="mt-3 text-[11px] font-semibold text-emerald-800">
                  Cost Saved: <strong>40% on Urea</strong> • Quality Boost: <strong>High</strong>
                </div>
              </div>
            </div>

            {/* Decision Analysis: Which Problem Can AI Solve the Best? */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                Classroom Discussion Synthesis: Which problem can A.I solve the best?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900">1. Smart Irrigation (Water Wastage)</span>
                  <div className="text-slate-600">
                    <strong>Highest Immediate ROI:</strong> Closed-loop soil moisture sensors + weather forecasting solve water wastage automatically without requiring farmer manual presence.
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900">2. Vision Crop Doctor (Pests)</span>
                  <div className="text-slate-600">
                    <strong>Highest Yield Preservation:</strong> Stops exponential pathogen outbreaks within 24 hours using accessible smartphone cameras.
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900">3. Soil NPK Predictor (Soil Quality)</span>
                  <div className="text-slate-600">
                    <strong>Highest Long-Term Ecology:</strong> Restores degraded soil microbiology and eliminates toxic chemical runoff into drinking water.
                  </div>
                </div>
              </div>
            </div>

            {/* Next Step CTA */}
            <div className="pt-2 flex justify-between">
              <button
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Back to Step 1
              </button>
              <button
                onClick={() => setActiveStep(3)}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                Proceed to Step 3: Innovation Design Challenge
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: INNOVATION DESIGN CHALLENGE */}
      {/* ========================================================================= */}
      {activeStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-600" />
                  Step 3: Innovation Design Challenge (Prototype Blueprint)
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Notebook Requirement: "Design an A.I farming solution prototype idea: Problem chosen, Solution name, How it works, Required technology, Expected benefits."
                </p>
              </div>

              {/* Preloaded Notebook Prototypes Selector */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    setSelectedPrototypeKey("drone-doctor");
                    setCurrentPrototype(NOTEBOOK_PROTOTYPES["drone-doctor"]);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedPrototypeKey === "drone-doctor"
                      ? "bg-emerald-800 text-white border-emerald-900"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  🛸 AI Drone Doctor
                </button>
                <button
                  onClick={() => {
                    setSelectedPrototypeKey("smart-irrigation");
                    setCurrentPrototype(NOTEBOOK_PROTOTYPES["smart-irrigation"]);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedPrototypeKey === "smart-irrigation"
                      ? "bg-emerald-800 text-white border-emerald-900"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  💧 Smart Irrigation Alarm
                </button>
                <button
                  onClick={() => {
                    setSelectedPrototypeKey("pest-camera");
                    setCurrentPrototype(NOTEBOOK_PROTOTYPES["pest-camera"]);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedPrototypeKey === "pest-camera"
                      ? "bg-emerald-800 text-white border-emerald-900"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  📷 Pest Detection Cam
                </button>
                <button
                  onClick={() => {
                    setSelectedPrototypeKey("soil-predictor");
                    setCurrentPrototype(NOTEBOOK_PROTOTYPES["soil-predictor"]);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedPrototypeKey === "soil-predictor"
                      ? "bg-emerald-800 text-white border-emerald-900"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  🧪 Soil NPK Predictor
                </button>
              </div>
            </div>

            {/* Custom AI Prototype Generator Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Want to Invent Your Own Custom Prototype?
                </span>
                <span className="text-[11px] text-slate-500">Powered by Gemini AI</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={customProblem}
                  onChange={(e) => setCustomProblem(e.target.value)}
                  placeholder="Problem: e.g. Locust swarms in arid zones"
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                  placeholder="Prototype Idea: e.g. Ultrasonic Acoustic Locust Disruptor"
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <button
                onClick={handleGenerateCustomPrototype}
                disabled={isGeneratingCustom}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {isGeneratingCustom ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Generate Custom AI Prototype Blueprint
              </button>
            </div>

            {/* Display Active Prototype Blueprint */}
            <div className="bg-emerald-950 text-white rounded-xl p-6 border border-emerald-800 space-y-6 shadow-sm">
              <div className="border-b border-emerald-800/80 pb-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                  Target Problem: {currentPrototype.problemChosen}
                </span>
                <h3 className="text-xl font-bold text-white mt-2">{currentPrototype.solutionName}</h3>
                <p className="text-xs text-emerald-200 mt-1 font-medium">{currentPrototype.tagline}</p>
                <p className="text-xs text-emerald-300/80 mt-2 leading-relaxed bg-emerald-900/50 p-3 rounded-lg border border-emerald-800/50">
                  <strong>Problem Impact Context:</strong> {currentPrototype.problemImpactSummary}
                </p>
              </div>

              {/* How it works (Workflow steps) */}
              <div>
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3">
                  How It Works (System Workflow):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentPrototype.howItWorks.map((step) => (
                    <div key={step.stepNumber} className="bg-emerald-900/60 p-3.5 rounded-lg border border-emerald-700/60 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-emerald-950 font-bold text-xs flex items-center justify-center">
                          {step.stepNumber}
                        </span>
                        <span className="text-xs font-bold text-white">{step.title}</span>
                      </div>
                      <p className="text-xs text-emerald-200/80 leading-relaxed pl-7">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Technology Stack */}
              <div>
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3">
                  Required Technology Stack:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-emerald-900/40 p-3 rounded-lg border border-emerald-800">
                    <span className="font-bold text-white block mb-1">Hardware / Sensors:</span>
                    <ul className="space-y-1 text-emerald-200/80 text-[11px]">
                      {currentPrototype.requiredTechnology.hardware.map((h, i) => (
                        <li key={i}>• {h}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-900/40 p-3 rounded-lg border border-emerald-800">
                    <span className="font-bold text-white block mb-1">Software & AI Models:</span>
                    <ul className="space-y-1 text-emerald-200/80 text-[11px]">
                      {currentPrototype.requiredTechnology.softwareAndAI.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-900/40 p-3 rounded-lg border border-emerald-800">
                    <span className="font-bold text-white block mb-1">Connectivity / IoT:</span>
                    <ul className="space-y-1 text-emerald-200/80 text-[11px]">
                      {currentPrototype.requiredTechnology.connectivity.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-900/40 p-3 rounded-lg border border-emerald-800">
                    <span className="font-bold text-white block mb-1">Power Source:</span>
                    <p className="text-emerald-200/80 text-[11px]">{currentPrototype.requiredTechnology.powerSource}</p>
                  </div>
                </div>
              </div>

              {/* Expected Benefits */}
              <div className="pt-2 border-t border-emerald-800/80">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
                  Expected Quantifiable Benefits:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-emerald-900/80 p-2.5 rounded-lg border border-emerald-700">
                    <span className="text-[10px] text-emerald-300 block">Water Saved</span>
                    <span className="font-bold text-white">{currentPrototype.expectedBenefits.waterSavedPercent}</span>
                  </div>
                  <div className="bg-emerald-900/80 p-2.5 rounded-lg border border-emerald-700">
                    <span className="text-[10px] text-emerald-300 block">Yield Increase</span>
                    <span className="font-bold text-white">{currentPrototype.expectedBenefits.yieldIncreasePercent}</span>
                  </div>
                  <div className="bg-emerald-900/80 p-2.5 rounded-lg border border-emerald-700">
                    <span className="text-[10px] text-emerald-300 block">Chemical Cut</span>
                    <span className="font-bold text-white">{currentPrototype.expectedBenefits.chemicalReductionPercent}</span>
                  </div>
                  <div className="bg-emerald-900/80 p-2.5 rounded-lg border border-emerald-700">
                    <span className="text-[10px] text-emerald-300 block">Cost Payback</span>
                    <span className="font-bold text-white">{currentPrototype.expectedBenefits.costReturnPeriod}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation CTA */}
            <div className="pt-2 flex justify-between">
              <button
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Back to Step 2
              </button>
              <button
                onClick={() => setActiveStep(4)}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                Proceed to Step 4: Model Creation & Digital Poster
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: MODEL CREATION, POSTER & RUBRIC GRADER */}
      {/* ========================================================================= */}
      {activeStep === 4 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  Step 4: Model Creation & Presentation Showcase
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Notebook Requirement: "Students can create: Diagram model, Cardboard prototype, FlowChart system design, Digital concept poster. Graded on AI Concept, Creativity, Problem Solving, Presentation."
                </p>
              </div>

              <button
                onClick={handlePrintPoster}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm shrink-0 self-start sm:self-auto"
              >
                <Printer className="w-4 h-4" />
                Print / Export Submission Poster
              </button>
            </div>

            {/* SECTION A: Visual Flowchart System Design */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                1. System FlowChart Architecture Design
              </h3>
              <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 overflow-x-auto py-2">
                  {currentPrototype.flowchartSteps.map((node, index) => (
                    <React.Fragment key={node.id}>
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 w-full md:w-48 text-center shrink-0 shadow-sm">
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                          {node.nodeType.replace(/_/g, " ")}
                        </span>
                        <div className="text-xs font-bold text-white">{node.label}</div>
                        <div className="text-[10px] text-slate-400 mt-1 leading-tight">{node.subtext}</div>
                      </div>

                      {index < currentPrototype.flowchartSteps.length - 1 && (
                        <div className="text-emerald-400 font-bold text-sm hidden md:block shrink-0">
                          ➔
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION B: Cardboard Prototype Blueprint & DIY Guide */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-600" />
                2. Cardboard Prototype Blueprint & DIY Maker Guide (For School Exhibition)
              </h3>
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                    Materials Needed:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentPrototype.cardboardPrototypeGuide.materialsNeeded.map((m, idx) => (
                      <span key={idx} className="bg-white text-slate-800 text-xs px-2.5 py-1 rounded border border-amber-200">
                        📦 {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-2">
                    Step-by-Step Assembly Instructions:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                    {currentPrototype.cardboardPrototypeGuide.stepByStepAssembly.map((step) => (
                      <div key={step.step} className="bg-white p-3 rounded-lg border border-amber-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900">Step {step.step}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                            {step.visualCue}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{step.instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION C: Digital Concept Poster (Print Ready) */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-sky-600" />
                3. Digital Concept Poster (Official Student Submission)
              </h3>

              <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white rounded-2xl p-8 border-2 border-emerald-500/40 shadow-lg space-y-6">
                <div className="text-center space-y-2 border-b border-emerald-800/80 pb-6">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                    S.S Agriculture Chapter Activity • Science & Technology Innovation
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    {currentPrototype.digitalPosterContent.headline}
                  </h2>
                  <p className="text-xs text-emerald-300 max-w-2xl mx-auto">
                    Designed by: <strong>{studentName}</strong> • Problem: <strong>{currentPrototype.problemChosen}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  {currentPrototype.digitalPosterContent.keyStats.map((stat, i) => (
                    <div key={i} className="bg-emerald-900/60 p-4 rounded-xl border border-emerald-700/60">
                      <div className="text-lg font-extrabold text-emerald-300">{stat}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-900/40 p-4 rounded-xl border border-emerald-800 text-xs text-emerald-100 leading-relaxed text-center">
                  <strong>System Architecture:</strong> {currentPrototype.digitalPosterContent.systemArchitectureSummary}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-400 pt-2 border-t border-emerald-800/80 gap-2">
                  <span>Submission Deadline: 17th August 2026</span>
                  <span>{currentPrototype.digitalPosterContent.callToAction}</span>
                </div>
              </div>
            </div>

            {/* SECTION D: AI Rubric Grader & Certificate Generator */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    4. Activity Evaluation & Rubric Grader (Out of 100)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Graded on: Understanding of A.I Concept (25pts), Creativity (25pts), Problem Solving (25pts), Presentation (25pts).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Student / Team Name"
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                  <button
                    onClick={handleRunEvaluation}
                    disabled={isEvaluating}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                  >
                    {isEvaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
                    Evaluate Project Rubric
                  </button>
                </div>
              </div>

              {evaluationResult && (
                <div className="mt-4 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs text-slate-500">Evaluation Result for: <strong>{studentName}</strong></span>
                      <h4 className="text-base font-bold text-emerald-800">{evaluationResult.certificateTitle}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-900">{evaluationResult.totalScore}/100</span>
                      <span className="ml-2 text-sm font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Grade: {evaluationResult.letterGrade}
                      </span>
                    </div>
                  </div>

                  {/* 4 Criteria Scores */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">AI Concept Understanding</span>
                      <span className="font-bold text-slate-800">{evaluationResult.criteriaScores.aiUnderstanding}/25</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Creativity & Innovation</span>
                      <span className="font-bold text-slate-800">{evaluationResult.criteriaScores.creativity}/25</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Problem Solving for Farmers</span>
                      <span className="font-bold text-slate-800">{evaluationResult.criteriaScores.problemSolving}/25</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Presentation & Design</span>
                      <span className="font-bold text-slate-800">{evaluationResult.criteriaScores.presentation}/25</span>
                    </div>
                  </div>

                  {/* Teacher Feedback */}
                  <div className="bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-200 text-xs space-y-1.5">
                    <span className="font-bold text-emerald-950 block">Teacher Remarks & Endorsement:</span>
                    <p className="text-slate-800 italic">"{evaluationResult.teacherRemarks}"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Survey Modal */}
      {isSurveyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Record Farmer Survey Response</h3>
              <button
                onClick={() => setIsSurveyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSurvey} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Farmer Name:
                </label>
                <input
                  type="text"
                  required
                  value={newFarmerName}
                  onChange={(e) => setNewFarmerName(e.target.value)}
                  placeholder="e.g. Harpreet Singh"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Village / Region:
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Bhatinda District"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cultivated Land (Acres):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newAcres}
                    onChange={(e) => setNewAcres(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Farming Issue:
                  </label>
                  <select
                    value={newProblem}
                    onChange={(e) => setNewProblem(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Water Wastage">Water Wastage</option>
                    <option value="Pest attacks">Pest attacks</option>
                    <option value="Soil quality">Soil quality</option>
                    <option value="Low crop yield">Low crop yield</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Severity Level:
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="High">High (Severe Loss)</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Yield Loss (%):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newYieldLoss}
                  onChange={(e) => setNewYieldLoss(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Traditional Method Used by Farmer:
                </label>
                <textarea
                  rows={2}
                  value={newTradMethod}
                  onChange={(e) => setNewTradMethod(e.target.value)}
                  placeholder="e.g. Unmonitored tube-well flooding every 10 days"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSurveyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                >
                  Save Survey Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

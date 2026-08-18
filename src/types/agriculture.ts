export type CropType =
  | "Wheat"
  | "Rice / Paddy"
  | "Cotton"
  | "Tomato"
  | "Corn / Maize"
  | "Soybean"
  | "Potato"
  | "Sugarcane"
  | "Mustard"
  | "Other"
  | string;

export type ProblemType = "Water Wastage" | "Pest attacks" | "Soil quality" | "Low crop yield";

export interface FieldRecord {
  id: string;
  name: string;
  crop: CropType;
  variety: string;
  areaAcre: number;
  sowingDate: string;
  soilType: string;
  irrigationType: "Drip Irrigation" | "Sprinkler" | "Flood / Furrow" | "Rainfed" | "Drip" | string;
  stage: string;
  targetYieldTonsPerHa?: number;
  targetYield?: string;
  currentMoisture: number; // %
  currentTemp: number; // °C
  currentHumidity: number; // %
  currentPh?: number;
  npk?: { n: number; p: number; k: number }; // mg/kg
  healthStatus: "Optimal" | "Needs Attention" | "Critical Alert" | string;
  valveOpen: boolean;
  lastIrrigated?: string;
  notes: string;
}

export interface CropDiagnosisResult {
  diagnosisName: string;
  confidenceScore: number;
  severity: "Mild" | "Moderate" | "Severe" | "Critical" | string;
  affectedParts: string[];
  primaryCause: string;
  visualFindings: string[];
  immediateAction: string;
  organicTreatment: string[];
  chemicalTreatment: string[];
  preventionStrategy: string[];
  impactOnYieldEstimate: string;
  dateAnalyzed?: string;
  imageUrl?: string;
  cropName?: string;
}

export interface SoilAnalysisResult {
  soilHealthScore: number;
  organicCarbonStatus: string;
  phCorrectionStrategy: string;
  fertilizerSchedule: Array<{
    stage: string;
    timingDays: string;
    ureaKgPerAcre: number;
    dapKgPerAcre: number;
    mopKgPerAcre: number;
    notes: string;
  }>;
  organicAmendments: string[];
  yieldForecastBoost?: string;
}

export interface SoilAdviceResult {
  soilHealthRating: string;
  overallHealthScore: number;
  nutrientDeficits: {
    nitrogenStatus: string;
    phosphorusStatus: string;
    potassiumStatus: string;
    phStatus: string;
  };
  fertilizerPlan: Array<{
    fertilizerName: string;
    dosagePerAcre: string;
    applicationTiming: string;
    method: string;
  }>;
  organicAmendments: string[];
  phCorrectionStrategy: string;
  expectedYieldImpact: string;
  salinityRisk: string;
}

export interface IrrigationAdvisoryResult {
  irrigationStatus: "TRIGGER_NOW" | "SCHEDULED_DELAY" | "HOLD_DUE_TO_RAIN" | "MOISTURE_OPTIMAL";
  urgencyLevel: "CRITICAL" | "MODERATE" | "LOW" | "NORMAL";
  recommendedWaterMm: number;
  recommendedDurationMinutes: number;
  bestTimeToIrrigate: string;
  dailyEvapotranspirationMm: number;
  waterSavingsVsFloodPercent: number;
  smartAlarmReasoning: string;
  actionChecklist: string[];
}

export interface InnovationPrototype {
  solutionName: string;
  tagline: string;
  problemChosen: string;
  problemImpactSummary: string;
  howItWorks: Array<{
    stepNumber: number;
    title: string;
    description: string;
  }>;
  requiredTechnology: {
    hardware: string[];
    softwareAndAI: string[];
    connectivity: string[];
    powerSource: string;
  };
  expectedBenefits: {
    waterSavedPercent: string;
    yieldIncreasePercent: string;
    chemicalReductionPercent: string;
    costReturnPeriod: string;
    summary: string;
  };
  flowchartSteps: Array<{
    id: string;
    nodeType: "sensor" | "edge_ai" | "cloud_decision" | "actuator" | "user_alert" | string;
    label: string;
    subtext: string;
    next?: string;
  }>;
  cardboardPrototypeGuide: {
    materialsNeeded: string[];
    stepByStepAssembly: Array<{
      step: number;
      instruction: string;
      visualCue: string;
    }>;
    interactiveDemoTips: string[];
  };
  digitalPosterContent: {
    headline: string;
    keyStats: string[];
    systemArchitectureSummary: string;
    callToAction: string;
  };
}

export interface EvaluationResult {
  totalScore: number;
  letterGrade: string;
  criteriaScores: {
    aiUnderstanding: number;
    creativity: number;
    problemSolving: number;
    presentation: number;
  };
  feedbackStrengths: string[];
  constructiveSuggestions: string[];
  teacherRemarks: string;
  certificateTitle: string;
}

export interface SurveyResponse {
  id: string;
  farmerName: string;
  villageLocation: string;
  acresCultivated: number;
  mainCrops: string;
  primaryProblem: "Water Wastage" | "Pest attacks" | "Soil quality" | "Low crop yield" | string;
  severityLevel: "High" | "Medium" | "Low" | string;
  reportedYieldLossPercent: number;
  traditionalMethodUsed: string;
  willingnessToAdoptAI: "Very High" | "High" | "Moderate" | "Needs Training" | string;
  recordedDate: string;
}

export type ThemeId =
  | "agritech-emerald"
  | "field-dark"
  | "warm-naturalist"
  | "cyber-biohud"
  | "classroom-blueprint";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  badge: string;
  bgClass: string;
  headerClass: string;
  cardClass: string;
  primaryBtnClass: string;
  accentBadgeClass: string;
  borderClass: string;
  fontFamilyClass: string;
  accentColor: string;
  previewBg: string;
}

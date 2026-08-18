import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu,
  Droplets,
  Bug,
  Compass,
  ArrowRight,
  Printer,
  FileCheck,
  Send,
  Loader2,
  Award,
  Play,
  Plus,
  BarChart3,
  Lightbulb,
  Workflow,
  Box,
} from "lucide-react";
import {
  INITIAL_SURVEYS,
  NOTEBOOK_PROTOTYPES,
  AI_EXPLORATION_COMPARISONS,
} from "../data/mockData";
import { SurveyResponse, InnovationPrototype } from "../types/agriculture";

export const ActivityLabView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 Survey State
  const [surveys, setSurveys] = useState<SurveyResponse[]>(INITIAL_SURVEYS);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [newSurveyFarmer, setNewSurveyFarmer] = useState("");
  const [newSurveyVillage, setNewSurveyVillage] = useState("");
  const [newSurveyCrop, setNewSurveyCrop] = useState("Wheat & Paddy");
  const [newSurveyProblem, setNewSurveyProblem] = useState<"Water Wastage" | "Pest attacks" | "Soil quality">("Water Wastage");
  const [newSurveyLoss, setNewSurveyLoss] = useState(25);
  const [newSurveyNotes, setNewSurveyNotes] = useState("");

  // Step 3 Prototype State
  const [selectedPrototypeKey, setSelectedPrototypeKey] = useState<string>("drone-doctor");
  const [customProblem, setCustomProblem] = useState("");
  const [isGeneratingPrototype, setIsGeneratingPrototype] = useState(false);
  const [generatedPrototype, setGeneratedPrototype] = useState<InnovationPrototype | null>(null);

  // Step 4 Model Sub-view state
  const [modelSubTab, setModelSubTab] = useState<"flowchart" | "cardboard" | "poster" | "rubric">("flowchart");
  const [studentName, setStudentName] = useState("Student Agronomist");
  const [isGrading, setIsGrading] = useState(false);
  const [rubricResult, setRubricResult] = useState<any | null>(null);

  const activePrototype = generatedPrototype || NOTEBOOK_PROTOTYPES[selectedPrototypeKey] || NOTEBOOK_PROTOTYPES["drone-doctor"];

  // Add new survey
  const handleAddSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: SurveyResponse = {
      id: `survey-${Date.now()}`,
      farmerName: newSurveyFarmer || "Local Farmer",
      villageLocation: newSurveyVillage || "District Farming Cluster",
      mainCrops: newSurveyCrop,
      acresCultivated: 4.5,
      primaryProblem: newSurveyProblem,
      severityLevel: "High",
      reportedYieldLossPercent: Number(newSurveyLoss),
      traditionalMethodUsed: newSurveyNotes || "Traditional visual estimation",
      willingnessToAdoptAI: "Very High",
      recordedDate: new Date().toISOString().slice(0, 10),
    };
    setSurveys([newRecord, ...surveys]);
    setIsSurveyModalOpen(false);
    setNewSurveyFarmer("");
  };

  // Generate Custom Prototype
  const handleGenerateCustomPrototype = async () => {
    if (!customProblem.trim()) return;
    setIsGeneratingPrototype(true);
    try {
      const response = await fetch("/api/gemini/generate-prototype", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemDescription: customProblem }),
      });
      const data = await response.json();
      setGeneratedPrototype({
        ...data,
        id: `custom-${Date.now()}`,
        problemChosen: customProblem,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPrototype(false);
    }
  };

  // Grade Model with Rubric
  const handleGradeWithRubric = async () => {
    setIsGrading(true);
    try {
      const response = await fetch("/api/gemini/evaluate-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          solutionName: activePrototype.solutionName,
          problemChosen: activePrototype.problemChosen,
          howItWorks: activePrototype.howItWorks,
          requiredTechnology: activePrototype.requiredTechnology,
          expectedBenefits: activePrototype.expectedBenefits,
          modelType: modelSubTab === "flowchart" ? "FlowChart System Design" : modelSubTab === "cardboard" ? "Cardboard Prototype" : "Digital Concept Poster",
        }),
      });
      const data = await response.json();
      setRubricResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Step Pipeline Hero Bar */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-500/40 uppercase tracking-widest block w-fit mb-1.5">
              S.S Agriculture Activity Studio • Deadline: 17th August 2026
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Agricultural A.I Innovation Challenge
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Complete 4-step framework from real problem survey to interactive AI prototypes, blueprints, and poster presentation models.
            </p>
          </div>

          {/* Quick jump to page note */}
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 shrink-0">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <div className="text-xs">
              <span className="text-slate-400 text-[10px] block">Notebook Subject:</span>
              <strong className="text-white">S.S Agriculture Chapter</strong>
            </div>
          </div>
        </div>

        {/* 4 Interactive Step Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800">
          {[
            { step: 1, title: "Step 1: Problem Survey", sub: "Survey Local Farming Issues" },
            { step: 2, title: "Step 2: A.I Exploration", sub: "Compare Tools & ROI" },
            { step: 3, title: "Step 3: Design Challenge", sub: "AI Solution Prototypes" },
            { step: 4, title: "Step 4: Model Creation", sub: "Flowcharts, Posters & Rubric" },
          ].map((item) => {
            const isActive = activeStep === item.step;
            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(item.step as any)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold"
                    : "bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="text-xs font-black truncate">{item.title}</div>
                <div className={`text-[10px] truncate ${isActive ? "text-slate-900" : "text-slate-400"}`}>
                  {item.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: PROBLEM IDENTIFICATION */}
      {activeStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  Notebook Requirement: Step 1
                </span>
                <h2 className="text-lg font-black text-slate-900">
                  Local Farmer Survey & Problem Identification Matrix
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record responses from local farmers regarding Water Wastage, Pest Attacks, and Soil Quality.
                </p>
              </div>

              <button
                onClick={() => setIsSurveyModalOpen(true)}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Record New Farmer Survey
              </button>
            </div>

            {/* Problem Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 space-y-1">
                <div className="flex items-center gap-2 text-sky-900 font-bold text-xs">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  1. Water Wastage
                </div>
                <p className="text-[11px] text-sky-800 leading-relaxed">
                  Flood & furrow over-irrigation drains local aquifers and causes root aeration deficit.
                </p>
              </div>

              <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-1">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                  <Bug className="w-4 h-4 text-rose-600" />
                  2. Pest Attacks
                </div>
                <p className="text-[11px] text-rose-800 leading-relaxed">
                  Undetected Whitefly, Rust, and Armyworm infestations cause 30–50% crop loss in 72 hours.
                </p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-1">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  3. Soil Quality
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Overuse of chemical Urea and unknown NPK levels degrade organic carbon and micro-nutrients.
                </p>
              </div>
            </div>

            {/* Survey Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Farmer & Location</th>
                    <th className="p-3">Main Crops</th>
                    <th className="p-3">Primary Problem</th>
                    <th className="p-3">Est. Yield Loss</th>
                    <th className="p-3">Current Practice</th>
                    <th className="p-3">AI Readiness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {surveys.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-bold text-slate-900">
                        {s.farmerName}
                        <span className="block text-[10px] text-slate-400 font-normal">{s.villageLocation}</span>
                      </td>
                      <td className="p-3 text-slate-700">{s.mainCrops}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            s.primaryProblem === "Water Wastage"
                              ? "bg-sky-100 text-sky-800"
                              : s.primaryProblem === "Pest attacks"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {s.primaryProblem}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-rose-700">{s.reportedYieldLossPercent}% Loss</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">{s.traditionalMethodUsed}</td>
                      <td className="p-3">
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {s.willingnessToAdoptAI}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Next step button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveStep(2)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                Proceed to Step 2: A.I Exploration <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: A.I EXPLORATION */}
      {activeStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">
                Notebook Requirement: Step 2
              </span>
              <h2 className="text-lg font-black text-slate-900">
                A.I Exploration & Comparative Solution Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Compare Disease Apps vs Weather Prediction vs Soil Analysis to discuss which problem A.I solves best.
              </p>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {AI_EXPLORATION_COMPARISONS.map((tool, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-extrabold text-sm text-slate-900">{tool.toolType}</h3>
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                        {tool.implementationDifficulty}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{tool.howItWorks}</p>

                    <div className="space-y-1.5 text-xs bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px]">Expected Farmer ROI:</span>
                        <strong className="text-emerald-700">{tool.expectedFarmerROI}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px]">Key Limitations:</span>
                        <span className="text-slate-600">{tool.limitations}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveStep(3)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Select for Prototype Design <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Classroom Synthesis Callout */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-2">
              <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                Classroom Discussion Synthesis:
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                Combining <strong>Computer Vision (Crop Doctor)</strong> with <strong>Automated Soil Telemetry (Smart Irrigation)</strong> provides the highest dual return: immediate pest mitigation (stopping 30% crop loss) while conserving 45% of groundwater and fertilizer costs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: INNOVATION DESIGN CHALLENGE */}
      {activeStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Notebook Requirement: Step 3
                </span>
                <h2 className="text-lg font-black text-slate-900">
                  Innovation Design Challenge (4 Pre-built Prototypes + AI Creator)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Design an A.I farming solution prototype idea with problem, tech stack, and quantifiable benefits.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                Official Submission: 17th August 2026
              </span>
            </div>

            {/* 4 Prototype Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { key: "drone-doctor", title: "AI Green Drone", icon: "🛸", desc: "Crop Doctor" },
                { key: "smart-irrigation", title: "Smart Irrigation", icon: "💧", desc: "Automated Alarm" },
                { key: "pest-camera", title: "Pest Detection Cam", icon: "📷", desc: "Solar Edge Trap" },
                { key: "soil-predictor", title: "Soil NPK Predictor", icon: "🧪", desc: "Optical Sensor" },
              ].map((p) => {
                const isSelected = !generatedPrototype && selectedPrototypeKey === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => {
                      setGeneratedPrototype(null);
                      setSelectedPrototypeKey(p.key);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm font-bold ring-2 ring-emerald-500/20"
                        : "border-slate-200 bg-slate-50 hover:bg-white text-slate-700"
                    }`}
                  >
                    <div className="text-xl mb-1">{p.icon}</div>
                    <div className="text-xs font-extrabold truncate">{p.title}</div>
                    <div className="text-[10px] text-slate-500">{p.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Custom AI Prototype Generator Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Want to invent a new prototype idea? Let Gemini AI formulate it:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customProblem}
                  onChange={(e) => setCustomProblem(e.target.value)}
                  placeholder="e.g. Stray animals entering field at night, or post-harvest grain moisture..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleGenerateCustomPrototype}
                  disabled={isGeneratingPrototype || !customProblem.trim()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingPrototype ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate Blueprint
                </button>
              </div>
            </div>

            {/* Active Prototype Detailed Blueprint Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-5 border border-slate-800 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                    Problem Chosen: {activePrototype.problemChosen}
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    {activePrototype.solutionName}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">{activePrototype.tagline}</p>
                </div>

                <button
                  onClick={() => {
                    setActiveStep(4);
                    setModelSubTab("flowchart");
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  Build Step 4 Models <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* How It Works Steps */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  How It Works (System Logic):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {activePrototype.howItWorks.map((step) => (
                    <div key={step.stepNumber} className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 space-y-1">
                      <div className="font-bold text-emerald-300">
                        Step {step.stepNumber}: {step.title}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware, Software & Impact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="font-bold text-amber-300 block mb-1">Required Hardware:</span>
                  <ul className="space-y-0.5 text-[11px] text-slate-300">
                    {activePrototype.requiredTechnology.hardware.map((h, i) => (
                      <li key={i}>• {h}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-bold text-cyan-300 block mb-1">Software & AI Models:</span>
                  <ul className="space-y-0.5 text-[11px] text-slate-300">
                    {activePrototype.requiredTechnology.softwareAndAI.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-bold text-emerald-300 block mb-1">Expected Benefits:</span>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <div>💧 Water Saved: <strong>{activePrototype.expectedBenefits.waterSavedPercent}</strong></div>
                    <div>🌾 Yield Boost: <strong>{activePrototype.expectedBenefits.yieldIncreasePercent}</strong></div>
                    <div>🛡️ Chemical Cut: <strong>{activePrototype.expectedBenefits.chemicalReductionPercent}</strong></div>
                    <div>💰 Payback: <strong>{activePrototype.expectedBenefits.costReturnPeriod}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: MODEL CREATION (FLOWCHART, CARDBOARD, POSTER, RUBRIC) */}
      {activeStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                  Notebook Requirement: Step 4
                </span>
                <h2 className="text-lg font-black text-slate-900">
                  Model Creation & Presentation Studio (Deadline: 17th Aug 2026)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose your submission format: FlowChart System Design, Cardboard Physical Model, or Digital Concept Poster.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Student Name"
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
              <button
                onClick={() => setModelSubTab("flowchart")}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  modelSubTab === "flowchart"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                1. System FlowChart Architecture
              </button>

              <button
                onClick={() => setModelSubTab("cardboard")}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  modelSubTab === "cardboard"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Box className="w-3.5 h-3.5 text-amber-600" />
                2. Cardboard Prototype DIY Blueprint
              </button>

              <button
                onClick={() => setModelSubTab("poster")}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  modelSubTab === "poster"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Printer className="w-3.5 h-3.5 text-emerald-600" />
                3. Print-Ready Digital Concept Poster
              </button>

              <button
                onClick={() => setModelSubTab("rubric")}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  modelSubTab === "rubric"
                    ? "bg-amber-600 text-white shadow-sm font-black"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                4. AI Rubric Evaluator & Certificate
              </button>
            </div>

            {/* 1. FLOWCHART SUBTAB */}
            {modelSubTab === "flowchart" && (
              <div className="bg-slate-950 text-white rounded-2xl p-6 space-y-6 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Workflow className="w-4 h-4" />
                    End-to-End System Flowchart: {activePrototype.solutionName}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Signal Propagation: Closed-Loop</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-900 p-4 rounded-xl border border-sky-500/40 space-y-1.5">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 mx-auto flex items-center justify-center font-bold text-xs">1</div>
                    <div className="font-extrabold text-xs text-sky-300">Data Sensing Layer</div>
                    <p className="text-[10px] text-slate-300">Soil Probes / Multispectral Optical Camera inputs telemetry.</p>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/40 space-y-1.5">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-bold text-xs">2</div>
                    <div className="font-extrabold text-xs text-amber-300">Edge Pre-processing</div>
                    <p className="text-[10px] text-slate-300">ESP32 / Raspberry Pi filters noise & packages encrypted packets.</p>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/40 space-y-1.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold text-xs">3</div>
                    <div className="font-extrabold text-xs text-emerald-300">Gemini AI Model</div>
                    <p className="text-[10px] text-slate-300">Phytopathology & Hydrology inference calculates exact dosage / valve run-time.</p>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-purple-500/40 space-y-1.5">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center font-bold text-xs">4</div>
                    <div className="font-extrabold text-xs text-purple-300">Actuator & Farmer Push</div>
                    <p className="text-[10px] text-slate-300">Solenoid valve opens & WhatsApp advisory sent in local language.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CARDBOARD SUBTAB */}
            {modelSubTab === "cardboard" && (
              <div className="bg-amber-950 text-amber-50 rounded-2xl p-6 space-y-4 border border-amber-800 shadow-xl">
                <div className="flex items-center justify-between border-b border-amber-800 pb-3">
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    DIY Cardboard Prototype Maker Guide (For Science Fair Booth)
                  </h3>
                  <span className="text-[10px] bg-amber-900 px-2 py-0.5 rounded font-bold">Materials Budget: &lt; $5</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-amber-900/80 p-4 rounded-xl border border-amber-700 space-y-2">
                    <span className="font-bold text-amber-200 uppercase tracking-wider block text-[11px]">
                      Required Recycled Materials:
                    </span>
                    <ul className="space-y-1 text-amber-100">
                      <li>• Corrugated Cardboard box (30cm x 30cm base)</li>
                      <li>• 2 Plastic bottle caps (Pumps / Solenoids)</li>
                      <li>• LED Lights + 9V Battery (Power status indicator)</li>
                      <li>• Clear straw / plastic tube (Drip irrigation pipe)</li>
                      <li>• Printed labels for "Sensing Node" & "AI Brain"</li>
                    </ul>
                  </div>

                  <div className="bg-amber-900/80 p-4 rounded-xl border border-amber-700 space-y-2">
                    <span className="font-bold text-amber-200 uppercase tracking-wider block text-[11px]">
                      Step-by-Step Assembly:
                    </span>
                    <ol className="space-y-1 text-amber-100 list-decimal pl-4">
                      <li>Cut cardboard base to represent farm field boundary.</li>
                      <li>Mount miniature plastic drone / camera tower at center.</li>
                      <li>Run clear straw tube with pin-holes across crop rows.</li>
                      <li>Wire green LED to switch to demonstrate "AI Valve Open".</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 3. POSTER SUBTAB */}
            {modelSubTab === "poster" && (
              <div className="bg-white rounded-2xl border-4 border-slate-900 p-8 space-y-6 shadow-2xl print:m-0 print:border-2">
                <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                  <div className="text-xs font-black text-amber-600 uppercase tracking-widest">
                    S.S Agriculture Chapter • AI Science Exhibition
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                    {activePrototype.solutionName}
                  </h1>
                  <p className="text-xs text-slate-600 font-bold">
                    Designed by: {studentName} • Deadline: 17th August 2026
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="border-2 border-slate-900 p-4 rounded-xl space-y-2 bg-slate-50">
                    <h4 className="font-black text-slate-900 uppercase">1. Problem Statement</h4>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {activePrototype.problemChosen}: Farmers suffer high crop yield losses and water wastage due to lack of early detection and automated controls.
                    </p>
                  </div>

                  <div className="border-2 border-slate-900 p-4 rounded-xl space-y-2 bg-slate-50">
                    <h4 className="font-black text-slate-900 uppercase">2. AI Technology</h4>
                    <ul className="space-y-1 text-slate-700 font-medium">
                      <li>• Sensor Probes & Computer Vision</li>
                      <li>• Edge Processing (ESP32)</li>
                      <li>• Cloud AI Hydrology & Pest Models</li>
                    </ul>
                  </div>

                  <div className="border-2 border-slate-900 p-4 rounded-xl space-y-2 bg-emerald-50 border-emerald-900">
                    <h4 className="font-black text-emerald-950 uppercase">3. Real Impact</h4>
                    <div className="space-y-1 text-emerald-900 font-bold">
                      <div>💧 Water Saved: {activePrototype.expectedBenefits.waterSavedPercent}</div>
                      <div>🌾 Yield Increase: {activePrototype.expectedBenefits.yieldIncreasePercent}</div>
                      <div>💰 Return Period: {activePrototype.expectedBenefits.costReturnPeriod}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Print Digital Poster
                  </button>
                </div>
              </div>
            )}

            {/* 4. RUBRIC SUBTAB */}
            {modelSubTab === "rubric" && (
              <div className="space-y-5">
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-amber-950">
                      Official 100-Point Teacher Grading Rubric
                    </h3>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Evaluates across Concept Understanding (25), Creativity (25), Problem Solving (25), and Presentation (25).
                    </p>
                  </div>

                  <button
                    onClick={handleGradeWithRubric}
                    disabled={isGrading}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl text-xs transition-all flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isGrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                    Evaluate Model with AI Rubric
                  </button>
                </div>

                {rubricResult && (
                  <div className="bg-white rounded-2xl border-2 border-emerald-600 p-6 space-y-5 shadow-lg animate-in fade-in duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded uppercase">
                          Certificate of Excellence
                        </span>
                        <h4 className="text-xl font-black text-slate-900 mt-1">
                          Evaluated for: {studentName} ({rubricResult.gradeLetter})
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-emerald-700">
                          {rubricResult.totalScore}/100
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-bold">Concept Understanding</span>
                        <span className="text-base font-extrabold text-slate-800">{rubricResult.scores.understandingOfAIConcept}/25</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-bold">Creativity & Design</span>
                        <span className="text-base font-extrabold text-slate-800">{rubricResult.scores.creativity}/25</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-bold">Problem Solving</span>
                        <span className="text-base font-extrabold text-slate-800">{rubricResult.scores.problemSolving}/25</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-bold">Presentation Quality</span>
                        <span className="text-base font-extrabold text-slate-800">{rubricResult.scores.presentationQuality}/25</span>
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                      <strong>Teacher Feedback:</strong> {rubricResult.feedbackSummary}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Record Survey Modal */}
      {isSurveyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-4 text-slate-900 text-xs">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              Record Local Farmer Survey (Step 1)
            </h3>
            <form onSubmit={handleAddSurvey} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Farmer Name:</label>
                <input
                  type="text"
                  value={newSurveyFarmer}
                  onChange={(e) => setNewSurveyFarmer(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Village / District:</label>
                <input
                  type="text"
                  value={newSurveyVillage}
                  onChange={(e) => setNewSurveyVillage(e.target.value)}
                  placeholder="e.g. Anand, Gujarat"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Problem:</label>
                  <select
                    value={newSurveyProblem}
                    onChange={(e) => setNewSurveyProblem(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="Water Wastage">Water Wastage</option>
                    <option value="Pest attacks">Pest Attacks</option>
                    <option value="Soil quality">Soil Quality</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Est. Yield Loss %:</label>
                  <input
                    type="number"
                    value={newSurveyLoss}
                    onChange={(e) => setNewSurveyLoss(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSurveyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold shadow-sm"
                >
                  Save Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

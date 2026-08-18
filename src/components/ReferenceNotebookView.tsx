import React, { useState } from "react";
import { BookOpen, CheckCircle, Calendar, ArrowRight, Sparkles, FileText, CheckCircle2 } from "lucide-react";

interface ReferenceNotebookViewProps {
  onGoToStep: (step: 1 | 2 | 3 | 4) => void;
}

export const ReferenceNotebookView: React.FC<ReferenceNotebookViewProps> = ({ onGoToStep }) => {
  const [selectedPage, setSelectedPage] = useState<1 | 2>(1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-amber-950 text-amber-50 rounded-xl p-6 border border-amber-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              Primary Reference Notebook & Activity Specification
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              S.S Agriculture Chapter Activity Reference
            </h1>
            <p className="text-xs text-amber-200 mt-1">
              Transcribed from the student notebook with interactive digital replica & direct system action links.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-900/80 px-3.5 py-2 rounded-lg border border-amber-700">
            <Calendar className="w-4 h-4 text-amber-300" />
            <div className="text-xs">
              <span className="text-amber-300 block text-[10px]">Official Submission Deadline:</span>
              <strong className="text-white">17th August 2026</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSelectedPage(1)}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            selectedPage === 1
              ? "bg-amber-800 text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          📄 Page 1: Step 1 (Problem Identification) & Step 2 (A.I Exploration)
        </button>
        <button
          onClick={() => setSelectedPage(2)}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            selectedPage === 2
              ? "bg-amber-800 text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          📄 Page 2: Step 3 (Innovation Challenge) & Step 4 (Model Creation)
        </button>
      </div>

      {/* Content Container */}
      {selectedPage === 1 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lined Notebook Paper Replica (Page 1) */}
          <div className="lg:col-span-6 bg-[#fdfbf7] p-6 rounded-xl border border-amber-300 shadow-md relative overflow-hidden font-mono text-slate-800 space-y-4">
            {/* Red left margin line */}
            <div className="absolute top-0 bottom-0 left-12 w-[1.5px] bg-rose-300 pointer-events-none" />

            {/* Notebook Header table */}
            <div className="border border-slate-400 bg-white grid grid-cols-3 text-center text-xs font-bold divide-x divide-slate-400">
              <div className="p-1.5 bg-slate-50">Date: 30/7/26</div>
              <div className="p-1.5 bg-slate-100 text-slate-900 col-span-1">Subject</div>
              <div className="p-1.5 bg-slate-50">Sign</div>
            </div>

            <div className="pl-8 space-y-4 text-xs">
              <div className="text-center font-bold text-sm tracking-wide text-indigo-950 underline decoration-indigo-300 underline-offset-4">
                S.S Agriculture Chapter Activity
              </div>

              {/* Step 1 in Notebook */}
              <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-3">
                <div className="font-bold text-slate-900 text-xs">
                  Step 1: Problem Identification
                </div>
                <div className="text-slate-600 italic">
                  [Students survey local farming issues such as low crop yield]
                </div>
                <ul className="space-y-1 pl-3 text-slate-800">
                  <li>• Water Wastage</li>
                  <li>• Pest attacks</li>
                  <li>• Soil quality</li>
                </ul>
                <div className="text-slate-700 font-semibold pt-1">
                  Students record responses in a table.
                </div>
              </div>

              {/* Step 2 in Notebook */}
              <div className="space-y-1.5 pt-1">
                <div className="font-bold text-slate-900 text-xs">
                  Step 2: A.I exploration
                </div>
                <div className="text-slate-600 italic">
                  [Simple A.I applications in agriculture]
                </div>
                <ul className="space-y-1 pl-3 text-slate-800">
                  <li>• Crop disease detection apps</li>
                  <li>• Weather prediction tools</li>
                  <li>• Soil analysis tools</li>
                </ul>
                <div className="text-slate-700 font-semibold pt-1">
                  Students to discuss which problem can A.I solve the best.
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Actions & System Integration */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 uppercase">
                  Interactive Implementation
                </span>
                <span className="text-xs text-slate-500 font-medium">Ready in App</span>
              </div>

              <h2 className="text-base font-bold text-slate-900">
                How AgriVision AI Solves Step 1 & Step 2:
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-950 flex items-center justify-between">
                    <span>1. Interactive Problem Survey Matrix (Step 1)</span>
                    <button
                      onClick={() => onGoToStep(1)}
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                    >
                      Open <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-emerald-900">
                    Pre-populated with real survey records from Wardha, Sangrur, and Chittoor farmers with live survey input form.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-200 space-y-1">
                  <div className="font-bold text-teal-950 flex items-center justify-between">
                    <span>2. AI Comparison Engine (Step 2)</span>
                    <button
                      onClick={() => onGoToStep(2)}
                      className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1"
                    >
                      Compare <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-teal-900">
                    Interactive side-by-side comparison of Disease Apps vs Weather Prediction vs Soil Analysis to determine optimal ROI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lined Notebook Paper Replica (Page 2) */}
          <div className="lg:col-span-6 bg-[#fdfbf7] p-6 rounded-xl border border-amber-300 shadow-md relative overflow-hidden font-mono text-slate-800 space-y-4">
            {/* Red left margin line */}
            <div className="absolute top-0 bottom-0 left-12 w-[1.5px] bg-rose-300 pointer-events-none" />

            {/* Notebook Header table */}
            <div className="border border-slate-400 bg-white grid grid-cols-3 text-center text-xs font-bold divide-x divide-slate-400">
              <div className="p-1.5 bg-slate-50">Date: —</div>
              <div className="p-1.5 bg-slate-100 text-slate-900 col-span-1">Subject</div>
              <div className="p-1.5 bg-slate-50">Sign</div>
            </div>

            <div className="pl-8 space-y-4 text-xs">
              {/* Step 3 in Notebook */}
              <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-3">
                <div className="font-bold text-slate-900 text-xs">
                  Step 3: Innovation design Challenge
                </div>
                <div className="text-slate-600 italic">
                  [A.I farming solution - Design an A.I farming solution prototype idea.]
                </div>
                <ul className="space-y-0.5 pl-3 text-slate-800">
                  <li>• Problem chosen</li>
                  <li>• A.I solution name</li>
                  <li>• How it works</li>
                  <li>• Required technology</li>
                  <li>• Expected benefits</li>
                </ul>
                <div className="pt-1.5 text-[11px] text-amber-900">
                  <strong>Examples:</strong>
                  <div className="pl-2 space-y-0.5 text-slate-700">
                    <div>- AI green drone / crop doctor</div>
                    <div>• Smart irrigation alarm</div>
                    <div>• Pest detection camera</div>
                    <div>• Soil nutrient predictor</div>
                  </div>
                </div>
              </div>

              {/* Step 4 in Notebook */}
              <div className="space-y-1.5 pt-1">
                <div className="font-bold text-slate-900 text-xs">
                  Step 4: Model Creation
                </div>
                <div className="text-slate-600 italic">
                  [Students can create]
                </div>
                <ul className="space-y-0.5 pl-3 text-slate-800">
                  <li>• Diagram model</li>
                  <li>• Cardboard prototype</li>
                  <li>• FlowChart System Design</li>
                  <li>• Digital concept poster</li>
                </ul>
                <div className="pt-2 border-t border-slate-300">
                  <div className="font-bold text-rose-900 text-xs">
                    Deadline: 17th August 2026
                  </div>
                  <div className="text-[11px] text-slate-600 pt-0.5">
                    Criteria: Understanding of A.I concept, creativity, problem solving, presentation.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Actions & System Integration */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 uppercase">
                  Step 3 & 4 System Tools
                </span>
                <span className="text-xs text-slate-500 font-medium">Ready in App</span>
              </div>

              <h2 className="text-base font-bold text-slate-900">
                All 4 Required Models Built & Ready:
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-950 flex items-center justify-between">
                    <span>1. 4 Pre-built Prototypes from Notebook</span>
                    <button
                      onClick={() => onGoToStep(3)}
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                    >
                      View Step 3 <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-emerald-900">
                    Detailed specs for AI Green Drone, Smart Irrigation Alarm, Pest Detection Cam, and Soil Nutrient Predictor.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-950 flex items-center justify-between">
                    <span>2. Flowchart, Cardboard Blueprint & Digital Poster</span>
                    <button
                      onClick={() => onGoToStep(4)}
                      className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1"
                    >
                      View Step 4 <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-amber-900">
                    Interactive sensor-to-actuator flowchart, DIY cardboard assembly steps, print-ready digital poster, and AI rubric evaluator.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

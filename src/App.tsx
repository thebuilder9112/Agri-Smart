import React, { useState } from "react";
import { Header } from "./components/Header";
import { DecisionSupportView } from "./components/DecisionSupportView";
import { CropDoctorView } from "./components/CropDoctorView";
import { SoilNutrientView } from "./components/SoilNutrientView";
import { AgriSmartGuardView } from "./components/AgriSmartGuardView";
import { GovtSchemesView } from "./components/GovtSchemesView";
import { FarmingGuidesView } from "./components/FarmingGuidesView";
import { AskFarmAiView } from "./components/AskFarmAiView";
import { Info, Sparkles, BookOpen, Landmark } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "dss" | "crop-doctor" | "soil" | "agrismart-guard" | "govt-schemes" | "farming-guides" | "ask-ai"
  >("dss");
  const [language, setLanguage] = useState<string>("en");

  return (
    <div className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900 font-sans">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        unreadAlertCount={0}
      />

      {/* Persistent Academic & Study Purpose Disclaimer Notice */}
      <div className="bg-amber-500/10 border-b border-amber-200 py-2 px-4 text-xs text-amber-950">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-semibold text-[11px] sm:text-xs">
              <strong>Educational Study Disclaimer:</strong> This application is created strictly for student study, academic research, and science innovation demonstration purposes. Real-world farming inputs and government scheme eligibility should be verified through official government departments or local Krishi Vigyan Kendras (KVK).
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded shrink-0 hidden md:inline-block">
            Student Project
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-16 space-y-6">
        {activeTab === "dss" && (
          <DecisionSupportView
            language={language}
            onOpenCropDoctor={() => setActiveTab("crop-doctor")}
            onOpenSoilAdvisor={() => setActiveTab("soil")}
          />
        )}

        {activeTab === "crop-doctor" && <CropDoctorView />}

        {activeTab === "soil" && <SoilNutrientView />}

        {activeTab === "agrismart-guard" && <AgriSmartGuardView />}

        {activeTab === "govt-schemes" && <GovtSchemesView />}

        {activeTab === "farming-guides" && <FarmingGuidesView />}

        {activeTab === "ask-ai" && <AskFarmAiView language={language} />}
      </main>

      {/* Clean Footer with Educational Notice */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/agrivision-logo.svg"
              alt="AgriVision Logo"
              className="w-5 h-5 rounded-md object-contain"
            />
            <span className="font-bold text-slate-900">AgriVision AI</span>
            <span className="text-slate-400">|</span>
            <span>Precision Agriculture & Irrigation Decision Support System</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-1 text-[11px] text-slate-500">
            <span>Automated Weather • Leaf Doctor • Soil Fertilizer • AgriSmart Guard • Govt Schemes • Farming Guides</span>
            <span className="text-[10px] text-amber-800 font-medium">
              *Designed for Student Academic Study & Demonstration
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

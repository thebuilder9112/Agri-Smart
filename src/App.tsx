import React, { useState } from "react";
import { Header } from "./components/Header";
import { DecisionSupportView } from "./components/DecisionSupportView";
import { CropDoctorView } from "./components/CropDoctorView";
import { SoilNutrientView } from "./components/SoilNutrientView";
import { AgriSmartGuardView } from "./components/AgriSmartGuardView";
import { AskFarmAiView } from "./components/AskFarmAiView";
import { Download, Sparkles } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "dss" | "crop-doctor" | "soil" | "agrismart-guard" | "ask-ai"
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

        {activeTab === "ask-ai" && <AskFarmAiView language={language} />}
      </main>

      {/* Clean Footer */}
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
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Automated Weather • Leaf Doctor • Fertilizer Plan • AgriSmart Guard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

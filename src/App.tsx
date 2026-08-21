import React, { useState } from "react";
import { Header } from "./components/Header";
import { DecisionSupportView } from "./components/DecisionSupportView";
import { CropDoctorView } from "./components/CropDoctorView";
import { AgriSmartGuardView } from "./components/AgriSmartGuardView";
import { GovtSchemesView } from "./components/GovtSchemesView";
import { FarmingGuidesView } from "./components/FarmingGuidesView";
import { AskFarmAiView } from "./components/AskFarmAiView";
import { Info, Sparkles, BookOpen, Landmark } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "dss" | "crop-doctor" | "agrismart-guard" | "govt-schemes" | "farming-guides" | "ask-ai"
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
      <main className="flex-1 pb-12 space-y-6">
        {activeTab === "dss" && (
          <DecisionSupportView
            language={language}
            onOpenCropDoctor={() => setActiveTab("crop-doctor")}
            onOpenGovtSchemes={() => setActiveTab("govt-schemes")}
            onOpenGuides={() => setActiveTab("farming-guides")}
          />
        )}

        {activeTab === "crop-doctor" && <CropDoctorView />}

        {activeTab === "agrismart-guard" && <AgriSmartGuardView />}

        {activeTab === "govt-schemes" && <GovtSchemesView />}

        {activeTab === "farming-guides" && <FarmingGuidesView />}

        {activeTab === "ask-ai" && <AskFarmAiView language={language} />}
      </main>

      {/* Page Bottom Disclaimer & Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        {/* Educational Study Disclaimer Banner at Bottom of Page */}
        <div className="bg-amber-500/10 border-b border-amber-200/80 py-3 px-4 text-xs text-amber-950">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-start sm:items-center gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
              <span className="font-medium text-[11px] sm:text-xs leading-relaxed text-amber-900">
                <strong>Educational Study Disclaimer:</strong> This application is developed strictly for student study, academic research, and precision agriculture innovation demonstration. Real-world farming inputs, crop treatments, and government scheme eligibility should be verified through official portals or local Krishi Vigyan Kendras (KVK).
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase bg-amber-200/90 text-amber-950 px-2 py-0.5 rounded shrink-0 self-start sm:self-auto">
              Student Project Demo
            </span>
          </div>
        </div>

        {/* Footer Brand & Navigation Credits */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
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
            <span>Automated Weather • Leaf Doctor • AgriSmart Guard • Govt Schemes & GeM • Farming Guides</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

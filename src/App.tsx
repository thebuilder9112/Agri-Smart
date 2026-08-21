import React, { useState } from "react";
import { Header } from "./components/Header";
import { HomeView } from "./components/HomeView";
import { DecisionSupportView } from "./components/DecisionSupportView";
import { CropDoctorView } from "./components/CropDoctorView";
import { AgriSmartGuardView } from "./components/AgriSmartGuardView";
import { GovtSchemesView } from "./components/GovtSchemesView";
import { FarmingGuidesView } from "./components/FarmingGuidesView";
import { AskFarmAiView } from "./components/AskFarmAiView";
import { Info, Sparkles, BookOpen, Landmark } from "lucide-react";
import { useTranslation } from "./data/translations";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "home" | "dss" | "crop-doctor" | "agrismart-guard" | "govt-schemes" | "farming-guides" | "ask-ai"
  >("home");
  const [language, setLanguage] = useState<string>("en");
  const { t } = useTranslation(language);

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
        {activeTab === "home" && (
          <HomeView
            onNavigate={(tab) => setActiveTab(tab)}
            language={language}
          />
        )}

        {activeTab === "dss" && (
          <DecisionSupportView
            language={language}
            onOpenCropDoctor={() => setActiveTab("crop-doctor")}
            onOpenGovtSchemes={() => setActiveTab("govt-schemes")}
            onOpenGuides={() => setActiveTab("farming-guides")}
          />
        )}

        {activeTab === "crop-doctor" && <CropDoctorView language={language} />}

        {activeTab === "agrismart-guard" && <AgriSmartGuardView language={language} />}

        {activeTab === "govt-schemes" && <GovtSchemesView language={language} />}

        {activeTab === "farming-guides" && <FarmingGuidesView language={language} />}

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
                <strong>{t("studentProjectDemo")}:</strong> {t("academicDisclaimerShort")}
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase bg-amber-200/90 text-amber-950 px-2 py-0.5 rounded shrink-0 self-start sm:self-auto">
              {t("studentProjectDemo")}
            </span>
          </div>
        </div>

        {/* Footer Brand & Navigation Credits */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveTab("home")}
          >
            <img
              src="/agrivision-logo.svg"
              alt="AgriVision Logo"
              className="w-5 h-5 rounded-md object-contain"
            />
            <span className="font-bold text-slate-900">AgriVision AI</span>
            <span className="text-slate-400">|</span>
            <span>{t("precisionAgHeader")}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-1 text-[11px] text-slate-500">
            <span>{t("navWeather")} • {t("navCropDoctor")} • {t("navAgriGuard")} • {t("navGovtSchemes")} • {t("navGuides")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

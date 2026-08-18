import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { DecisionSupportView } from "./components/DecisionSupportView";
import { CropDoctorView } from "./components/CropDoctorView";
import { SoilNutrientView } from "./components/SoilNutrientView";
import { FarmDataView } from "./components/FarmDataView";
import { ActivityLabView } from "./components/ActivityLabView";
import { ReferenceNotebookView } from "./components/ReferenceNotebookView";
import { AgronomistChatModal } from "./components/AgronomistChatModal";
import { DesignIdeasModal } from "./components/DesignIdeasModal";
import { INITIAL_FIELDS } from "./data/mockData";
import { THEME_CONFIGS } from "./data/themes";
import { FieldRecord, ThemeId } from "./types/agriculture";
import { Sprout, MessageSquareQuote, Palette, Sparkles } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "dss" | "crop-doctor" | "soil" | "farm-data" | "activity-lab" | "notebook"
  >("dss");
  const [language, setLanguage] = useState<string>("en");
  const [fields, setFields] = useState<FieldRecord[]>(INITIAL_FIELDS);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState<boolean>(false);

  // Theme & UX state
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    return (localStorage.getItem("agrivision_theme") as ThemeId) || "agritech-emerald";
  });
  const [density, setDensity] = useState<"compact" | "normal" | "spacious">("normal");
  const [fontOverride, setFontOverride] = useState<"sans" | "serif" | "mono">("sans");

  const currentThemeConfig = THEME_CONFIGS[themeId] || THEME_CONFIGS["agritech-emerald"];

  useEffect(() => {
    localStorage.setItem("agrivision_theme", themeId);
  }, [themeId]);

  // Field handlers
  const handleUpdateField = (updated: FieldRecord) => {
    setFields(fields.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleAddField = (newField: FieldRecord) => {
    setFields([newField, ...fields]);
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  // Count active dry/alert fields
  const unreadAlertCount = fields.filter(
    (f) => f.currentMoisture < 45 || f.healthStatus !== "Optimal"
  ).length;

  // Compute font family class
  const activeFontClass =
    fontOverride === "serif"
      ? "font-serif"
      : fontOverride === "mono"
      ? "font-mono"
      : currentThemeConfig.fontFamilyClass;

  return (
    <div
      className={`min-h-screen flex flex-col antialiased transition-colors duration-200 ${currentThemeConfig.bgClass} ${activeFontClass}`}
    >
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        onOpenQuickAdvisory={() => setIsChatOpen(true)}
        onOpenDesignStudio={() => setIsDesignModalOpen(true)}
        unreadAlertCount={unreadAlertCount}
        themeConfig={currentThemeConfig}
      />

      {/* Theme Quick Switcher Banner (Floating / Top Bar Notification) */}
      <div className="bg-black/10 border-b border-black/5 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold">Current Design Theme:</span>
            <span className="font-bold px-2 py-0.5 rounded bg-black/10 text-inherit">
              {currentThemeConfig.name} ({currentThemeConfig.badge})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDesignModalOpen(true)}
              className="font-bold underline hover:opacity-80 flex items-center gap-1 text-inherit cursor-pointer"
            >
              Change UI/UX Theme & View Ideas ➜
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main
        className={`flex-1 pb-16 transition-all ${
          density === "compact" ? "space-y-4" : density === "spacious" ? "space-y-8" : "space-y-6"
        }`}
      >
        {activeTab === "dss" && (
          <DecisionSupportView
            fields={fields}
            onUpdateField={handleUpdateField}
            language={language}
            onOpenCropDoctor={() => setActiveTab("crop-doctor")}
            onOpenSoilAdvisor={() => setActiveTab("soil")}
            onOpenActivityLab={() => setActiveTab("activity-lab")}
          />
        )}

        {activeTab === "crop-doctor" && <CropDoctorView />}

        {activeTab === "soil" && <SoilNutrientView />}

        {activeTab === "farm-data" && (
          <FarmDataView
            fields={fields}
            onAddField={handleAddField}
            onUpdateField={handleUpdateField}
            onDeleteField={handleDeleteField}
          />
        )}

        {activeTab === "activity-lab" && <ActivityLabView />}

        {activeTab === "notebook" && (
          <ReferenceNotebookView
            onGoToStep={(step) => {
              setActiveTab("activity-lab");
            }}
          />
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
        {/* Design Studio Quick FAB */}
        <button
          onClick={() => setIsDesignModalOpen(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-xs font-bold border border-slate-700 cursor-pointer"
          title="Open UI & UX Design Studio"
        >
          <Palette className="w-4 h-4 text-amber-400" />
          <span>UI Themes & Ideas</span>
        </button>

        {/* Agronomist Chat FAB */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-xs font-bold border border-emerald-600 cursor-pointer"
        >
          <MessageSquareQuote className="w-4 h-4 text-emerald-300" />
          <span>AI Agronomist</span>
        </button>
      </div>

      {/* Design Studio Modal */}
      <DesignIdeasModal
        isOpen={isDesignModalOpen}
        onClose={() => setIsDesignModalOpen(false)}
        currentTheme={themeId}
        onSelectTheme={(newTheme) => setThemeId(newTheme)}
        activeDensity={density}
        onSelectDensity={(newDensity) => setDensity(newDensity)}
        fontOverride={fontOverride}
        onSelectFont={(newFont) => setFontOverride(newFont)}
      />

      {/* Floating Chat Modal */}
      <AgronomistChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        language={language}
      />

      {/* Footer */}
      <footer className="bg-black/10 border-t border-black/10 py-6 text-xs text-inherit/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-inherit">AgriVision AI</span>
            <span>— Smart Farm Decision Support & Innovation Lab</span>
          </div>
          <div className="text-center sm:text-right text-[11px] opacity-80">
            S.S Agriculture Chapter Activity • 4-Step Innovation Challenge & Design Studio
          </div>
        </div>
      </footer>
    </div>
  );
}

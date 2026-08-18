import React from "react";
import { Sprout, BookOpen, ShieldAlert, Globe, Activity, Palette } from "lucide-react";
import { ThemeConfig } from "../types/agriculture";

interface HeaderProps {
  activeTab: "dss" | "crop-doctor" | "soil" | "farm-data" | "activity-lab" | "notebook";
  setActiveTab: (tab: "dss" | "crop-doctor" | "soil" | "farm-data" | "activity-lab" | "notebook") => void;
  language: string;
  setLanguage: (lang: string) => void;
  onOpenQuickAdvisory: () => void;
  onOpenDesignStudio: () => void;
  unreadAlertCount: number;
  themeConfig: ThemeConfig;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenQuickAdvisory,
  onOpenDesignStudio,
  unreadAlertCount,
  themeConfig,
}) => {
  return (
    <header className={`sticky top-0 z-40 border-b shadow-md transition-colors ${themeConfig.headerClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title */}
        <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => setActiveTab("dss")}>
          <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-bold text-lg tracking-tight whitespace-nowrap text-inherit">
            AgriVision AI
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab("dss")}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === "dss"
                ? "bg-white/20 text-white shadow-sm border border-white/30"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            Decision Support
          </button>

          <button
            onClick={() => setActiveTab("crop-doctor")}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === "crop-doctor"
                ? "bg-white/20 text-white shadow-sm border border-white/30"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            Crop Doctor
          </button>

          <button
            onClick={() => setActiveTab("soil")}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === "soil"
                ? "bg-white/20 text-white shadow-sm border border-white/30"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            Soil & Nutrients
          </button>

          <button
            onClick={() => setActiveTab("farm-data")}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === "farm-data"
                ? "bg-white/20 text-white shadow-sm border border-white/30"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            Farm Data
          </button>

          <button
            onClick={() => setActiveTab("activity-lab")}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === "activity-lab"
                ? "bg-amber-600/90 text-white shadow-sm border border-amber-400/60"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Activity Lab (Steps 1–4)
          </button>

          <button
            onClick={() => setActiveTab("notebook")}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === "notebook"
                ? "bg-amber-800 text-amber-100 shadow-sm border border-amber-500/60"
                : "text-amber-200/80 hover:text-amber-100 hover:bg-white/10"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Notes
          </button>
        </nav>

        {/* Zone 3: Actions (Design Studio + Language + Agronomist) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Design Themes Button */}
          <button
            onClick={onOpenDesignStudio}
            className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-all flex items-center gap-1.5 border border-white/20 shadow-sm"
            title="Switch UI & UX Themes and Ideas"
          >
            <Palette className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Design & Ideas</span>
          </button>

          {/* Language Selector */}
          <div className="relative inline-flex items-center">
            <Globe className="w-3.5 h-3.5 absolute left-2 text-white/70 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-black/30 text-white text-xs font-medium pl-6 pr-2.5 py-1.5 rounded-lg border border-white/20 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer appearance-none"
              title="Select Language"
            >
              <option value="en" className="bg-slate-900 text-white">EN</option>
              <option value="hi" className="bg-slate-900 text-white">हिंदी</option>
              <option value="pa" className="bg-slate-900 text-white">ਪੰਜਾਬੀ</option>
              <option value="es" className="bg-slate-900 text-white">ES</option>
            </select>
          </div>

          {/* AI Agronomist Action */}
          <button
            onClick={onOpenQuickAdvisory}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Agronomist</span>
            {unreadAlertCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                {unreadAlertCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 bg-black/20 border-t border-white/10 gap-2 text-xs">
        <button
          onClick={() => setActiveTab("dss")}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === "dss" ? "bg-white/25 text-white font-bold" : "text-white/80"
          }`}
        >
          Decision Support
        </button>
        <button
          onClick={() => setActiveTab("crop-doctor")}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === "crop-doctor" ? "bg-white/25 text-white font-bold" : "text-white/80"
          }`}
        >
          Crop Doctor
        </button>
        <button
          onClick={() => setActiveTab("soil")}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === "soil" ? "bg-white/25 text-white font-bold" : "text-white/80"
          }`}
        >
          Soil
        </button>
        <button
          onClick={() => setActiveTab("farm-data")}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === "farm-data" ? "bg-white/25 text-white font-bold" : "text-white/80"
          }`}
        >
          Farm Data
        </button>
        <button
          onClick={() => setActiveTab("activity-lab")}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === "activity-lab" ? "bg-amber-600 text-white font-bold" : "text-white/80"
          }`}
        >
          Activity Lab
        </button>
        <button
          onClick={() => setActiveTab("notebook")}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === "notebook" ? "bg-amber-800 text-amber-100 font-bold" : "text-amber-200"
          }`}
        >
          Notes
        </button>
      </div>
    </header>
  );
};

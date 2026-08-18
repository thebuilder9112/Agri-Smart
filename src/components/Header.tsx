import React from "react";
import { Sprout, BookOpen, ShieldAlert, Globe, Activity, Palette, Radio, Sun, Droplets } from "lucide-react";
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
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md text-white border-b border-emerald-900/40 shadow-xl transition-all">
      {/* Micro Status Ticker */}
      <div className="bg-emerald-950/80 border-b border-emerald-800/40 py-1 px-4 text-[11px] text-emerald-200/90 hidden lg:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
              Live IoT Mesh: Connected (4 Nodes Active)
            </span>
            <span className="text-emerald-300/40">•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Sun className="w-3 h-3 text-amber-400" />
              Micro-Weather: 29.5°C | Solar: 820 W/m² | Evapotranspiration: 4.8 mm/day
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-300/80 font-medium">
              S.S Agriculture Activity Chapter • Deadline: <strong className="text-amber-300">17th Aug 2026</strong>
            </span>
            <span className="text-emerald-300/40">•</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
              Gemini AI Engine v2.5
            </span>
          </div>
        </div>
      </div>

      {/* Main Command Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single line) */}
        <div
          className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
          onClick={() => setActiveTab("dss")}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-md shadow-emerald-950/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="leading-tight">
            <span className="font-extrabold text-lg tracking-tight text-white block">
              AgriVision<span className="text-emerald-400">.AI</span>
            </span>
            <span className="text-[10px] font-semibold text-emerald-300/70 tracking-wider uppercase block">
              Decision Support & Lab
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Max 6, single-line with indicator pills) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 shadow-inner">
          <button
            onClick={() => setActiveTab("dss")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === "dss"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-emerald-300" />
            Decision Support
          </button>

          <button
            onClick={() => setActiveTab("crop-doctor")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeTab === "crop-doctor"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            Crop Doctor
          </button>

          <button
            onClick={() => setActiveTab("soil")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeTab === "soil"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            Soil & Nutrients
          </button>

          <button
            onClick={() => setActiveTab("farm-data")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeTab === "farm-data"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            Farm Data
          </button>

          <button
            onClick={() => setActiveTab("activity-lab")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === "activity-lab"
                ? "bg-amber-600 text-white shadow-md shadow-amber-900/40 font-bold"
                : "text-amber-200/90 hover:text-amber-100 hover:bg-slate-800"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-300" />
            Activity Lab (Steps 1–4)
          </button>

          <button
            onClick={() => setActiveTab("notebook")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === "notebook"
                ? "bg-amber-800 text-amber-100 shadow-md border border-amber-600/50 font-bold"
                : "text-amber-300/80 hover:text-amber-200 hover:bg-slate-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Notes
          </button>
        </nav>

        {/* Zone 3: Actions (Design Studio + Language + Agronomist AI) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Design Themes Studio Button */}
          <button
            onClick={onOpenDesignStudio}
            className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-1.5 border border-slate-700/80 shadow-sm"
            title="UI Themes & Prototype Ideas"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">UI Themes</span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative inline-flex items-center">
            <Globe className="w-3.5 h-3.5 absolute left-2.5 text-emerald-400 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-900 text-slate-200 text-xs font-semibold pl-7 pr-3 py-1.5 rounded-xl border border-slate-700/90 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer appearance-none shadow-sm"
              title="Select Language for AI Agronomist & Advisory"
            >
              <option value="en" className="bg-slate-900 text-white">English (EN)</option>
              <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
              <option value="pa" className="bg-slate-900 text-white">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="gu" className="bg-slate-900 text-white">ગુજરાતી (Gujarati)</option>
              <option value="mr" className="bg-slate-900 text-white">मराठी (Marathi)</option>
              <option value="te" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
              <option value="es" className="bg-slate-900 text-white">Español (ES)</option>
            </select>
          </div>

          {/* AI Agronomist Consultation Button */}
          <button
            onClick={onOpenQuickAdvisory}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-emerald-950/50 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-slate-950" />
            <span>AI Agronomist</span>
            {unreadAlertCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-black">
                {unreadAlertCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Nav Bar */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-900 border-t border-slate-800 gap-2 text-xs">
        <button
          onClick={() => setActiveTab("dss")}
          className={`px-3 py-1 rounded-lg whitespace-nowrap font-medium ${
            activeTab === "dss" ? "bg-emerald-600 text-white font-bold" : "text-slate-300"
          }`}
        >
          Decision Support
        </button>
        <button
          onClick={() => setActiveTab("crop-doctor")}
          className={`px-3 py-1 rounded-lg whitespace-nowrap font-medium ${
            activeTab === "crop-doctor" ? "bg-emerald-600 text-white font-bold" : "text-slate-300"
          }`}
        >
          Crop Doctor
        </button>
        <button
          onClick={() => setActiveTab("soil")}
          className={`px-3 py-1 rounded-lg whitespace-nowrap font-medium ${
            activeTab === "soil" ? "bg-emerald-600 text-white font-bold" : "text-slate-300"
          }`}
        >
          Soil & NPK
        </button>
        <button
          onClick={() => setActiveTab("farm-data")}
          className={`px-3 py-1 rounded-lg whitespace-nowrap font-medium ${
            activeTab === "farm-data" ? "bg-emerald-600 text-white font-bold" : "text-slate-300"
          }`}
        >
          Farm Data
        </button>
        <button
          onClick={() => setActiveTab("activity-lab")}
          className={`px-3 py-1 rounded-lg whitespace-nowrap font-medium ${
            activeTab === "activity-lab" ? "bg-amber-600 text-white font-bold" : "text-amber-300"
          }`}
        >
          Activity Lab
        </button>
        <button
          onClick={() => setActiveTab("notebook")}
          className={`px-3 py-1 rounded-lg whitespace-nowrap font-medium ${
            activeTab === "notebook" ? "bg-amber-800 text-amber-100 font-bold" : "text-amber-300"
          }`}
        >
          Notes
        </button>
      </div>
    </header>
  );
};

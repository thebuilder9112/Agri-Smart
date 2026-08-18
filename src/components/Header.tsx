import React from "react";
import { Sprout, Globe, Droplets, Leaf, Sliders, MapPin, MessageSquareQuote } from "lucide-react";

interface HeaderProps {
  activeTab: "dss" | "crop-doctor" | "soil" | "farm-data" | "ask-ai";
  setActiveTab: (tab: "dss" | "crop-doctor" | "soil" | "farm-data" | "ask-ai") => void;
  language: string;
  setLanguage: (lang: string) => void;
  unreadAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  unreadAlertCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Helper Bar */}
      <div className="bg-emerald-950 border-b border-emerald-900/60 py-1.5 px-4 text-xs text-emerald-200 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Farm Sensors: Connected
            </span>
            <span>•</span>
            <span className="text-emerald-100/90">
              Weather: 29.5°C | Rain Forecast: Low | Water Savings: 45%
            </span>
          </div>

          <div className="flex items-center gap-2 text-emerald-200">
            <span>Precision Agriculture & Irrigation Decision Support</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Name */}
        <div
          className="flex items-center gap-2.5 shrink-0 cursor-pointer"
          onClick={() => setActiveTab("dss")}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white block leading-tight">
              AgriVision <span className="text-emerald-400">AI</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium block">
              Farmer Decision Support System
            </span>
          </div>
        </div>

        {/* Simple Navigation Links in Main Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => setActiveTab("dss")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "dss"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            Water & Rain Guide
          </button>

          <button
            onClick={() => setActiveTab("crop-doctor")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "crop-doctor"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            Leaf Disease Doctor
          </button>

          <button
            onClick={() => setActiveTab("soil")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "soil"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            Fertilizer Plan
          </button>

          <button
            onClick={() => setActiveTab("farm-data")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "farm-data"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            My Fields
          </button>

          {/* Ask Farm Question Tab */}
          <button
            onClick={() => setActiveTab("ask-ai")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "ask-ai"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-emerald-300 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5 text-emerald-400" />
            Ask Farm AI
          </button>
        </nav>

        {/* Language Selector */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative inline-flex items-center">
            <Globe className="w-3.5 h-3.5 absolute left-2.5 text-emerald-400 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800 text-slate-100 text-xs font-semibold pl-7 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none shadow-sm"
              title="Change Language"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="es">Español</option>
            </select>
          </div>

          {/* Direct Tab Switch for Ask Farm AI on Right Header */}
          <button
            onClick={() => setActiveTab("ask-ai")}
            className={`hidden sm:flex px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-sm items-center gap-1.5 cursor-pointer ${
              activeTab === "ask-ai"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Ask Farm Question</span>
            {unreadAlertCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {unreadAlertCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Tabs */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-800 border-t border-slate-700 gap-1.5 text-xs">
        <button
          onClick={() => setActiveTab("dss")}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${
            activeTab === "dss" ? "bg-emerald-600 text-white" : "text-slate-300"
          }`}
        >
          Water & Rain
        </button>
        <button
          onClick={() => setActiveTab("crop-doctor")}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${
            activeTab === "crop-doctor" ? "bg-emerald-600 text-white" : "text-slate-300"
          }`}
        >
          Leaf Doctor
        </button>
        <button
          onClick={() => setActiveTab("soil")}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${
            activeTab === "soil" ? "bg-emerald-600 text-white" : "text-slate-300"
          }`}
        >
          Fertilizer Plan
        </button>
        <button
          onClick={() => setActiveTab("farm-data")}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${
            activeTab === "farm-data" ? "bg-emerald-600 text-white" : "text-slate-300"
          }`}
        >
          My Fields
        </button>
        <button
          onClick={() => setActiveTab("ask-ai")}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${
            activeTab === "ask-ai" ? "bg-emerald-600 text-white" : "text-emerald-300"
          }`}
        >
          Ask Farm AI
        </button>
      </div>
    </header>
  );
};

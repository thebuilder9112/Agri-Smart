import React, { useState } from "react";
import {
  Home,
  Globe,
  Droplets,
  Leaf,
  Sliders,
  MessageSquareQuote,
  Copy,
  Check,
  Download,
  Image as ImageIcon,
  Sparkles,
  ShieldAlert,
  Landmark,
  BookOpen,
} from "lucide-react";
import { useTranslation, SUPPORTED_LANGUAGES } from "../data/translations";

interface HeaderProps {
  activeTab:
    | "home"
    | "dss"
    | "crop-doctor"
    | "agrismart-guard"
    | "govt-schemes"
    | "farming-guides"
    | "ask-ai";
  setActiveTab: (
    tab:
      | "home"
      | "dss"
      | "crop-doctor"
      | "agrismart-guard"
      | "govt-schemes"
      | "farming-guides"
      | "ask-ai"
  ) => void;
  language: string;
  setLanguage: (lang: string) => void;
  unreadAlertCount: number;
}

const SVG_LOGO_MARKUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#022c22" />
    </linearGradient>
    <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="50%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#6ee7b7" />
    </linearGradient>
    <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#eab308" />
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <circle cx="256" cy="270" r="160" fill="none" stroke="#059669" stroke-width="3" stroke-dasharray="8 8" opacity="0.4" />
  <circle cx="256" cy="270" r="200" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4 12" opacity="0.3" />
  <circle cx="340" cy="170" r="42" fill="url(#sunGrad)" opacity="0.9" filter="url(#softGlow)" />
  <path d="M128 370 C 180 340, 332 340, 384 370 C 340 395, 172 395, 128 370 Z" fill="#047857" opacity="0.85" />
  <path d="M150 375 C 200 355, 312 355, 362 375" fill="none" stroke="#34d399" stroke-width="5" stroke-linecap="round" />
  <path d="M256 370 C 256 310, 256 240, 256 160" fill="none" stroke="#10b981" stroke-width="14" stroke-linecap="round" />
  <path d="M256 270 C 180 270, 140 210, 150 150 C 210 150, 256 210, 256 270 Z" fill="url(#leafGrad)" />
  <path d="M256 270 C 200 240, 170 190, 150 150" fill="none" stroke="#065f46" stroke-width="3.5" stroke-linecap="round" opacity="0.6" />
  <path d="M256 220 C 320 220, 360 170, 350 120 C 295 120, 256 170, 256 220 Z" fill="url(#leafGrad)" />
  <path d="M256 220 C 300 195, 330 155, 350 120" fill="none" stroke="#065f46" stroke-width="3.5" stroke-linecap="round" opacity="0.6" />
  <path d="M256 165 C 240 135, 245 110, 256 95 C 267 110, 272 135, 256 165 Z" fill="#a7f3d0" />
  <circle cx="150" cy="150" r="7" fill="#ffffff" />
  <circle cx="350" cy="120" r="7" fill="#ffffff" />
  <circle cx="256" cy="95" r="8" fill="#fef08a" />
</svg>`;

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  unreadAlertCount,
}) => {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { t } = useTranslation(language);

  const handleCopySvg = async () => {
    try {
      await navigator.clipboard.writeText(SVG_LOGO_MARKUP);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy SVG:", err);
    }
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([SVG_LOGO_MARKUP], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agrivision-logo.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        {/* Top Helper Bar */}
        <div className="bg-emerald-950 border-b border-emerald-900/60 py-1.5 px-4 text-xs text-emerald-200 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {t("sensorsConnected")}
              </span>
              <span>•</span>
              <span className="text-emerald-100/90">
                {t("weatherAdvisoryActive")}
              </span>
            </div>

            <div className="flex items-center gap-3 text-emerald-200">
              <span>{t("precisionAgHeader")}</span>
            </div>
          </div>
        </div>

        {/* Main Top Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Name with Custom Vector Logo */}
          <div
            className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
            onClick={() => setActiveTab("home")}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform flex items-center justify-center bg-emerald-950 border border-emerald-700/60">
              <img
                src="/agrivision-logo.svg"
                alt="AgriVision AI Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to inline preview if needed
                  e.currentTarget.style.display = "none";
                }}
              />
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
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "dss"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              {t("navWeather")}
            </button>

            <button
              onClick={() => setActiveTab("crop-doctor")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "crop-doctor"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              {t("navCropDoctor")}
            </button>

            {/* AgriSmart Guard Challenge Tab */}
            <button
              onClick={() => setActiveTab("agrismart-guard")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "agrismart-guard"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
              {t("navAgriGuard")}
            </button>

            {/* Indian Govt Schemes & Policies Tab */}
            <button
              onClick={() => setActiveTab("govt-schemes")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "govt-schemes"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-amber-300 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              {t("navGovtSchemes")}
            </button>

            {/* Farming Guides & Agro-Blogs Tab */}
            <button
              onClick={() => setActiveTab("farming-guides")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "farming-guides"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-emerald-300 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              {t("navGuides")}
            </button>

            {/* Ask Farm Question Tab */}
            <button
              onClick={() => setActiveTab("ask-ai")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "ask-ai"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              <MessageSquareQuote className="w-3.5 h-3.5 text-emerald-400" />
              {t("navAskAi")}
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Selector */}
            <div className="relative inline-flex items-center">
              <Globe className="w-3.5 h-3.5 absolute left-2.5 text-emerald-400 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-800 text-slate-100 text-xs font-semibold pl-7 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none shadow-sm"
                title="Change Language"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Tab Switch for Ask Farm AI */}
            <button
              onClick={() => setActiveTab("ask-ai")}
              className={`hidden lg:flex px-3 py-2 rounded-xl font-bold text-xs transition-all shadow-sm items-center gap-1.5 cursor-pointer ${
                activeTab === "ask-ai"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>{t("askFarmQuestion")}</span>
              {unreadAlertCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {unreadAlertCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Tabs */}
        <div className="md:hidden flex items-center overflow-x-auto px-3 py-2 bg-slate-800 border-t border-slate-700 gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab("dss")}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap font-bold ${
              activeTab === "dss" ? "bg-emerald-600 text-white" : "text-slate-300"
            }`}
          >
            {t("navWeather")}
          </button>
          <button
            onClick={() => setActiveTab("crop-doctor")}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap font-bold ${
              activeTab === "crop-doctor" ? "bg-emerald-600 text-white" : "text-slate-300"
            }`}
          >
            {t("navCropDoctor")}
          </button>
          <button
            onClick={() => setActiveTab("agrismart-guard")}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap font-bold ${
              activeTab === "agrismart-guard" ? "bg-emerald-600 text-white" : "text-slate-300"
            }`}
          >
            {t("navAgriGuard")}
          </button>
          <button
            onClick={() => setActiveTab("govt-schemes")}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap font-bold ${
              activeTab === "govt-schemes" ? "bg-emerald-600 text-white" : "text-amber-300"
            }`}
          >
            {t("navGovtSchemes")}
          </button>
          <button
            onClick={() => setActiveTab("farming-guides")}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap font-bold ${
              activeTab === "farming-guides" ? "bg-emerald-600 text-white" : "text-emerald-300"
            }`}
          >
            {t("navGuides")}
          </button>
          <button
            onClick={() => setActiveTab("ask-ai")}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap font-bold ${
              activeTab === "ask-ai" ? "bg-emerald-600 text-white" : "text-slate-300"
            }`}
          >
            {t("navAskAi")}
          </button>
        </div>
      </header>

      {/* COPYABLE LOGO MODAL */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">AgriVision AI Logo</h3>
              </div>
              <button
                onClick={() => setIsLogoModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Logo Preview */}
            <div className="flex flex-col items-center justify-center bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center space-y-3">
              <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-xl border border-emerald-600/50">
                <img
                  src="/agrivision-logo.svg"
                  alt="AgriVision AI Vector Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white block">
                  AgriVision <span className="text-emerald-400">AI</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Scalable Vector Graphic (SVG) • 512x512
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopySvg}
                className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                {isCopied ? "SVG Code Copied!" : "Copy SVG Code"}
              </button>

              <button
                onClick={handleDownloadSvg}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4 text-slate-200" />
                Download .svg
              </button>
            </div>

            {/* Direct File Link Notice */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-600 text-[11px] font-mono select-all break-all">
              Path: <strong>/public/agrivision-logo.svg</strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

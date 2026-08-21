import React, { useState } from "react";
import {
  Droplets,
  Leaf,
  ShieldAlert,
  Landmark,
  BookOpen,
  MessageSquareQuote,
  Sparkles,
  ArrowRight,
  Sun,
  CloudRain,
  Activity,
  CheckCircle2,
  Zap,
  ShoppingBag,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  Cpu,
  Sprout,
  Stethoscope,
  Calculator,
  Compass,
  Layers,
  Award,
} from "lucide-react";
import { useTranslation } from "../data/translations";

interface HomeViewProps {
  onNavigate: (
    tab:
      | "dss"
      | "crop-doctor"
      | "agrismart-guard"
      | "govt-schemes"
      | "farming-guides"
      | "ask-ai"
  ) => void;
  language: string;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, language }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation(language);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.toLowerCase().trim();
    if (!q) return;

    if (
      q.includes("weather") ||
      q.includes("rain") ||
      q.includes("irrigation") ||
      q.includes("water") ||
      q.includes("forecast") ||
      q.includes("temp") ||
      q.includes("मौसम") ||
      q.includes("सिंचाई") ||
      q.includes("ਪਾਣੀ") ||
      q.includes("हवामान")
    ) {
      onNavigate("dss");
    } else if (
      q.includes("disease") ||
      q.includes("leaf") ||
      q.includes("pest") ||
      q.includes("fungus") ||
      q.includes("spray") ||
      q.includes("doctor") ||
      q.includes("blight") ||
      q.includes("rust") ||
      q.includes("पत्ती") ||
      q.includes("रोग") ||
      q.includes("दवा") ||
      q.includes("कीट")
    ) {
      onNavigate("crop-doctor");
    } else if (
      q.includes("scheme") ||
      q.includes("subsidy") ||
      q.includes("gem") ||
      q.includes("kisan") ||
      q.includes("kusum") ||
      q.includes("pmfby") ||
      q.includes("procure") ||
      q.includes("योजना") ||
      q.includes("अनुदान") ||
      q.includes("ਸਕੀਮ")
    ) {
      onNavigate("govt-schemes");
    } else if (
      q.includes("guard") ||
      q.includes("quiz") ||
      q.includes("game") ||
      q.includes("challenge") ||
      q.includes("risk") ||
      q.includes("गार्ड") ||
      q.includes("संकट")
    ) {
      onNavigate("agrismart-guard");
    } else if (
      q.includes("guide") ||
      q.includes("recipe") ||
      q.includes("jeevamrit") ||
      q.includes("organic") ||
      q.includes("crop") ||
      q.includes("sowing") ||
      q.includes("गाइड") ||
      q.includes("जीवामृत") ||
      q.includes("जैविक")
    ) {
      onNavigate("farming-guides");
    } else {
      onNavigate("ask-ai");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HERO SECTION */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-xl">
        {/* Subtle background ambient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-10 lg:p-12 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {t("heroTagline")}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold text-slate-300 bg-slate-800/80 border border-slate-700">
              {t("heroBadge")}
            </span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              {t("heroDesc")}
            </p>
          </div>

          {/* Quick Universal Finder Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 flex items-center gap-2 shadow-lg focus-within:ring-2 focus-within:ring-emerald-500 transition-all"
          >
            <div className="pl-3 text-slate-400">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none px-2 py-2"
            />
            <button
              type="submit"
              className="px-4 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
            >
              <span>{t("btnExplore")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate("dss")}
              className="px-4 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Droplets className="w-4 h-4 text-sky-600" />
              <span>{t("btnLiveWeather")}</span>
            </button>

            <button
              onClick={() => onNavigate("crop-doctor")}
              className="px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm border border-emerald-500/40"
            >
              <Leaf className="w-4 h-4 text-emerald-300" />
              <span>{t("btnDiagnoseLeaf")}</span>
            </button>

            <button
              onClick={() => onNavigate("govt-schemes")}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-700"
            >
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>{t("btnGovtSchemes")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK VALUE METRICS / IMPACT STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t("statWaterSaved")}</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
              💧
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">30%–45%</div>
          <p className="text-[11px] text-slate-500">{t("statWaterSavedDesc")}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t("statDiagnosisSpeed")}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">&lt; 2.5 Sec</div>
          <p className="text-[11px] text-slate-500">{t("statDiagnosisSpeedDesc")}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t("statGovtTrade")}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              🏛️
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">100% Direct</div>
          <p className="text-[11px] text-slate-500">{t("statGovtTradeDesc")}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t("statMultiLang")}</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
              🌐
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">7 Languages</div>
          <p className="text-[11px] text-slate-500">{t("statMultiLangDesc")}</p>
        </div>
      </div>

      {/* CORE MODULES SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              {t("coreModulesTitle")}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t("coreModulesSub")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Module 1: Weather & Irrigation */}
          <div
            onClick={() => onNavigate("dss")}
            className="group bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100 group-hover:scale-105 transition-transform">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                  Agro-Meteorology
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1 group-hover:text-emerald-700 transition-colors">
                  {t("modWeatherTitle")}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("modWeatherDesc")}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700 group-hover:text-emerald-700">
              <span>{t("modWeatherBtn")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 2: Crop Doctor & Leaf Vision */}
          <div
            onClick={() => onNavigate("crop-doctor")}
            className="group bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Neural Phytopathology
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1 group-hover:text-emerald-700 transition-colors">
                  {t("modDoctorTitle")}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("modDoctorDesc")}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>{t("modDoctorBtn")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 3: Govt Schemes & GeM Hub */}
          <div
            onClick={() => onNavigate("govt-schemes")}
            className="group bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                  National Subsidies & GeM
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1 group-hover:text-amber-800 transition-colors">
                  {t("modSchemesTitle")}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("modSchemesDesc")}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>{t("modSchemesBtn")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 4: AgriSmart Guard Scenario Simulator */}
          <div
            onClick={() => onNavigate("agrismart-guard")}
            className="group bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:border-sky-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  Simulation Challenge
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1 group-hover:text-purple-700 transition-colors">
                  {t("modGuardTitle")}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("modGuardDesc")}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>{t("modGuardBtn")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 5: Farming Guides & Agro-Blogs */}
          <div
            onClick={() => onNavigate("farming-guides")}
            className="group bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Best Practice Knowledge Base
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1 group-hover:text-emerald-700 transition-colors">
                  {t("modGuidesTitle")}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("modGuidesDesc")}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>{t("modGuidesBtn")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 6: 24/7 AI Agronomist Voice Assistant */}
          <div
            onClick={() => onNavigate("ask-ai")}
            className="group bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center border border-slate-800 group-hover:scale-105 transition-transform">
                <MessageSquareQuote className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                  Natural Language AI
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1 group-hover:text-emerald-700 transition-colors">
                  {t("modAiTitle")}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("modAiDesc")}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-emerald-700">
              <span>{t("modAiBtn")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* GOVERNMENT E-MARKETPLACE & DIRECT TRADE SPOTLIGHT BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase rounded-full">
              Verified Govt Portal
            </span>
            <span className="text-xs text-emerald-300 font-semibold">gem.gov.in</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {t("gemSpotlightTitle")}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t("gemSpotlightDesc")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate("govt-schemes")}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>{t("gemSpotlightBtn")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="https://gem.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t("gemSpotlightPortalBtn")}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* QUICK LAUNCH TOOLS / FREQUENT ACTIONS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          {t("quickLaunchTitle")}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => onNavigate("dss")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all cursor-pointer group"
          >
            <span className="text-base block mb-1">🌦️</span>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">{t("quickLiveWeather")}</span>
            <span className="text-[10px] text-slate-500 block truncate">{t("quickLiveWeatherSub")}</span>
          </button>

          <button
            onClick={() => onNavigate("crop-doctor")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all cursor-pointer group"
          >
            <span className="text-base block mb-1">🔬</span>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">{t("quickPastePhoto")}</span>
            <span className="text-[10px] text-slate-500 block truncate">{t("quickPastePhotoSub")}</span>
          </button>

          <button
            onClick={() => onNavigate("crop-doctor")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all cursor-pointer group"
          >
            <span className="text-base block mb-1">🛢️</span>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">{t("quickTankMixer")}</span>
            <span className="text-[10px] text-slate-500 block truncate">{t("quickTankMixerSub")}</span>
          </button>

          <button
            onClick={() => onNavigate("govt-schemes")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all cursor-pointer group"
          >
            <span className="text-base block mb-1">☀️</span>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">{t("quickKusumSolar")}</span>
            <span className="text-[10px] text-slate-500 block truncate">{t("quickKusumSolarSub")}</span>
          </button>

          <button
            onClick={() => onNavigate("farming-guides")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all cursor-pointer group"
          >
            <span className="text-base block mb-1">🌿</span>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">{t("quickJeevamrit")}</span>
            <span className="text-[10px] text-slate-500 block truncate">{t("quickJeevamritSub")}</span>
          </button>

          <button
            onClick={() => onNavigate("agrismart-guard")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all cursor-pointer group"
          >
            <span className="text-base block mb-1">🛡️</span>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">{t("quickCrisisGame")}</span>
            <span className="text-[10px] text-slate-500 block truncate">{t("quickCrisisGameSub")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

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
      q.includes("temp")
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
      q.includes("rust")
    ) {
      onNavigate("crop-doctor");
    } else if (
      q.includes("scheme") ||
      q.includes("subsidy") ||
      q.includes("gem") ||
      q.includes("kisan") ||
      q.includes("kusum") ||
      q.includes("pmfby") ||
      q.includes("procure")
    ) {
      onNavigate("govt-schemes");
    } else if (
      q.includes("guard") ||
      q.includes("quiz") ||
      q.includes("game") ||
      q.includes("challenge") ||
      q.includes("risk")
    ) {
      onNavigate("agrismart-guard");
    } else if (
      q.includes("guide") ||
      q.includes("recipe") ||
      q.includes("jeevamrit") ||
      q.includes("organic") ||
      q.includes("crop") ||
      q.includes("sowing")
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
              Smart Precision Agriculture Portal
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold text-slate-300 bg-slate-800/80 border border-slate-700">
              Science & Innovation Student Project
            </span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Data-Driven Intelligence for Modern Farmers & Agronomists
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              AgriVision combines automated real-time weather analytics, computer-vision plant pathology, crisis mitigation simulators, government subsidies & direct e-Marketplace procurement in one unified decision system.
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
              placeholder="Search or ask anything (e.g., 'Tomato blight', 'Solar pump subsidy', 'Irrigation schedule', 'GeM Portal')..."
              className="flex-1 bg-transparent text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none px-2 py-2"
            />
            <button
              type="submit"
              className="px-4 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
            >
              <span>Explore</span>
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
              <span>Live Weather & Irrigation DSS</span>
            </button>

            <button
              onClick={() => onNavigate("crop-doctor")}
              className="px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm border border-emerald-500/40"
            >
              <Leaf className="w-4 h-4 text-emerald-300" />
              <span>Diagnose Leaf Disease</span>
            </button>

            <button
              onClick={() => onNavigate("govt-schemes")}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-700"
            >
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>Govt Schemes & GeM</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK VALUE METRICS / IMPACT STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Water Saved</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
              💧
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">30%–45%</div>
          <p className="text-[11px] text-slate-500">Via FAO-56 Penman-Monteith dynamic ET0 scheduling</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Diagnosis Speed</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">&lt; 2.5 Sec</div>
          <p className="text-[11px] text-slate-500">Instant clipboard paste (`Ctrl+V`) & neural pathology</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Govt Schemes & GeM</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              🏛️
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">100% Direct</div>
          <p className="text-[11px] text-slate-500">PM-KISAN, KUSUM & zero-commission GeM procurement</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Multi-Language</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
              🌐
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">7 Languages</div>
          <p className="text-[11px] text-slate-500">English, हिन्दी, ਪੰਜਾਬੀ, ગુજરાતી, मराठी, తెలుగు, Español</p>
        </div>
      </div>

      {/* CORE MODULES SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              Core Modules & Decision Engines
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any decision tool to access real-time calculations, actionable recipes, and field guidance.
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
                  Automated Weather & Irrigation DSS
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated 7-day live weather, FAO-56 Reference Evapotranspiration ($ET_0$), soil-moisture deficit tracking, crop growth stage coefficients, and precise pump runtime advisories.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700 group-hover:text-emerald-700">
              <span>Launch Weather Engine</span>
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
                  Leaf Disease Doctor & Sprayer Tank Mixer
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste any plant photo (`Ctrl + V`) or snap via camera to diagnose fungal, bacterial, and pest attacks. Get exact active ingredients, trade names, organic cures, and sprayer dosage mixing calculations.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Open Leaf Doctor</span>
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
                  Govt Schemes & GeM Portal (gem.gov.in)
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step-by-step guides for PM-KISAN, PM-KUSUM Solar, PMFBY Crop Insurance, and direct access to Government e-Marketplace (`gem.gov.in`) to buy rate-capped equipment or sell crops with 0% commission.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>View Schemes & GeM Portal</span>
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
                  AgriSmart Guard Risk Simulator
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive real-world farm crisis game: respond to sudden heatwaves, pest outbreaks, cold snaps, and water shortages. Earn Agronomy IQ points and master critical farm management trade-offs.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Play Simulation Game</span>
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
                  Seasonal Guides & Organic Recipes
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Curated crop management guides for Kharif, Rabi, and Zaid seasons. Includes authentic organic bio-fertilizer preparations (Jeevamrit, Neemastra, Dashparni Ark) and regenerative agriculture protocols.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Browse Knowledge Base</span>
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
                  Ask AI Master Agronomist
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Have a two-way voice or text conversation with an AI agronomist. Ask about soil preparation, seedling health, fertilizer timing, seed varieties, or crop price trends in 7 Indian languages.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-emerald-700">
              <span>Ask a Question</span>
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
            Buy Subsidized Equipment & Sell Produce Directly on GeM
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Eliminate middlemen commission. Farmers and FPOs can purchase tested tractors, solar pumps, and drip kits at government rate-capped prices, and supply grains directly to Indian Railways, Defence Canteens, and Central Hostels with direct DBT bank settlements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate("govt-schemes")}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>Learn GeM Registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="https://gem.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Visit gem.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* QUICK LAUNCH TOOLS / FREQUENT ACTIONS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Quick Launch Presets & Common Workflows
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => onNavigate("dss")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all cursor-pointer group"
          >
            <span className="text-base block mb-1">🌦️</span>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">Live Weather</span>
            <span className="text-[10px] text-slate-500 block truncate">Auto ET0 & Rain</span>
          </button>

          <button
            onClick={() => onNavigate("crop-doctor")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all cursor-pointer group"
          >
            <span className="text-base block mb-1">🔬</span>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">Paste Leaf Photo</span>
            <span className="text-[10px] text-slate-500 block truncate">Ctrl+V Instant Rx</span>
          </button>

          <button
            onClick={() => onNavigate("crop-doctor")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all cursor-pointer group"
          >
            <span className="text-base block mb-1">🛢️</span>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">Tank Mixer</span>
            <span className="text-[10px] text-slate-500 block truncate">15L / 25L / 200L</span>
          </button>

          <button
            onClick={() => onNavigate("govt-schemes")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all cursor-pointer group"
          >
            <span className="text-base block mb-1">☀️</span>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">PM-KUSUM Solar</span>
            <span className="text-[10px] text-slate-500 block truncate">Up to 60% Subsidy</span>
          </button>

          <button
            onClick={() => onNavigate("farming-guides")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all cursor-pointer group"
          >
            <span className="text-base block mb-1">🌿</span>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">Jeevamrit Recipe</span>
            <span className="text-[10px] text-slate-500 block truncate">Zero-Cost Bio-Input</span>
          </button>

          <button
            onClick={() => onNavigate("agrismart-guard")}
            className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all cursor-pointer group"
          >
            <span className="text-base block mb-1">🛡️</span>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">Farm Crisis Game</span>
            <span className="text-[10px] text-slate-500 block truncate">IQ Decision Score</span>
          </button>
        </div>
      </div>
    </div>
  );
};

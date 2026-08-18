import React, { useState } from "react";
import {
  Palette,
  Check,
  Sparkles,
  Layers,
  Monitor,
  Eye,
  Cpu,
  Droplets,
  Bug,
  Compass,
  X,
  Smartphone,
  Sliders,
  Type,
  Layout,
} from "lucide-react";
import { ThemeId, ThemeConfig } from "../types/agriculture";
import { THEME_CONFIGS } from "../data/themes";
import { NOTEBOOK_PROTOTYPES } from "../data/mockData";

interface DesignIdeasModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  activeDensity: "compact" | "normal" | "spacious";
  onSelectDensity: (density: "compact" | "normal" | "spacious") => void;
  fontOverride: "sans" | "serif" | "mono";
  onSelectFont: (font: "sans" | "serif" | "mono") => void;
}

export const DesignIdeasModal: React.FC<DesignIdeasModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  activeDensity,
  onSelectDensity,
  fontOverride,
  onSelectFont,
}) => {
  const [activeTab, setActiveTab] = useState<"themes" | "prototype-ideas" | "customizer">("themes");
  const [selectedIdeaKey, setSelectedIdeaKey] = useState<string>("drone-doctor");

  if (!isOpen) return null;

  const activeIdea = NOTEBOOK_PROTOTYPES[selectedIdeaKey] || NOTEBOOK_PROTOTYPES["drone-doctor"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden text-slate-900">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                UI & UX Design Studio • Visual Themes & Ideas
                <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                  5 Layouts Available
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Explore different visual design aesthetics and see the complete agricultural AI prototype concepts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 border-b border-slate-200 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab("themes")}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "themes"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            1. Visual Themes & Color Schemes (5 Options)
          </button>

          <button
            onClick={() => setActiveTab("prototype-ideas")}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "prototype-ideas"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            2. Visual Agricultural Innovation Ideas (Step 3 & 4)
          </button>

          <button
            onClick={() => setActiveTab("customizer")}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "customizer"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            3. Typography & Density Controls
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: 5 DISTINCT VISUAL THEMES */}
          {activeTab === "themes" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Select a Visual Theme for AgriVision AI:
                </h4>
                <p className="text-xs text-slate-500">
                  Click any card to transform the entire application interface instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(THEME_CONFIGS).map((theme) => {
                  const isSelected = currentTheme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => onSelectTheme(theme.id)}
                      className={`rounded-xl border-2 p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20"
                          : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <div>
                        {/* Theme Mockup Visual Header */}
                        <div
                          className={`h-20 rounded-lg bg-gradient-to-br ${theme.previewBg} p-3 text-white flex flex-col justify-between mb-3 shadow-inner relative overflow-hidden`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="bg-white/20 px-2 py-0.5 rounded backdrop-blur-xs">
                              {theme.badge}
                            </span>
                            {isSelected && (
                              <span className="bg-emerald-500 text-white rounded-full p-0.5">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-bold truncate">{theme.name}</div>
                        </div>

                        <h5 className="font-bold text-xs text-slate-900 flex items-center justify-between">
                          {theme.name}
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {theme.subtitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-600">
                          {theme.fontFamilyClass.replace("font-", "").toUpperCase()} Font
                        </span>
                        <button
                          type="button"
                          className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                            isSelected
                              ? "bg-emerald-700 text-white"
                              : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                          }`}
                        >
                          {isSelected ? "Active Theme" : "Apply Theme"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL PROTOTYPE IDEAS SHOWCASE */}
          {activeTab === "prototype-ideas" && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Visual Agricultural Innovation Ideas (From Student Assignment):
                </h4>
                <p className="text-xs text-slate-500">
                  Explore full schematics, hardware architectures, and quantifiable benefits for each idea.
                </p>
              </div>

              {/* Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setSelectedIdeaKey("drone-doctor")}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-2 ${
                    selectedIdeaKey === "drone-doctor"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
                  }`}
                >
                  <span className="text-lg">🛸</span>
                  <div>
                    <div className="truncate">AI Green Drone</div>
                    <div className="text-[10px] text-slate-400 font-normal">Crop Doctor</div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedIdeaKey("smart-irrigation")}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-2 ${
                    selectedIdeaKey === "smart-irrigation"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
                  }`}
                >
                  <span className="text-lg">💧</span>
                  <div>
                    <div className="truncate">Smart Irrigation</div>
                    <div className="text-[10px] text-slate-400 font-normal">Automated Alarm</div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedIdeaKey("pest-camera")}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-2 ${
                    selectedIdeaKey === "pest-camera"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
                  }`}
                >
                  <span className="text-lg">📷</span>
                  <div>
                    <div className="truncate">Pest Detection Cam</div>
                    <div className="text-[10px] text-slate-400 font-normal">Solar Edge Trap</div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedIdeaKey("soil-predictor")}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-2 ${
                    selectedIdeaKey === "soil-predictor"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
                  }`}
                >
                  <span className="text-lg">🧪</span>
                  <div>
                    <div className="truncate">Soil NPK Predictor</div>
                    <div className="text-[10px] text-slate-400 font-normal">Optical Sensor</div>
                  </div>
                </button>
              </div>

              {/* Idea Visual Schematic Card */}
              <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4 border border-slate-800 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-0.5">
                      Problem Addressed: {activeIdea.problemChosen}
                    </span>
                    <h4 className="text-lg font-bold text-white">{activeIdea.solutionName}</h4>
                    <p className="text-xs text-slate-300">{activeIdea.tagline}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/40">
                    Payback: {activeIdea.expectedBenefits.costReturnPeriod}
                  </span>
                </div>

                {/* Workflow Architecture Visual */}
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    System Workflow & Logic:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {activeIdea.howItWorks.map((step) => (
                      <div key={step.stepNumber} className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-1">
                        <div className="font-bold text-emerald-300">
                          Step {step.stepNumber}: {step.title}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hardware & Tech Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="font-bold text-amber-300 block mb-1">Hardware:</span>
                    <ul className="space-y-0.5 text-[11px] text-slate-300">
                      {activeIdea.requiredTechnology.hardware.map((h, i) => (
                        <li key={i}>• {h}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-cyan-300 block mb-1">Software & AI:</span>
                    <ul className="space-y-0.5 text-[11px] text-slate-300">
                      {activeIdea.requiredTechnology.softwareAndAI.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-emerald-300 block mb-1">Impact:</span>
                    <div className="text-[11px] text-slate-300 space-y-1">
                      <div>💧 Water Saved: <strong>{activeIdea.expectedBenefits.waterSavedPercent}</strong></div>
                      <div>🌾 Yield Boost: <strong>{activeIdea.expectedBenefits.yieldIncreasePercent}</strong></div>
                      <div>🛡️ Chemical Cut: <strong>{activeIdea.expectedBenefits.chemicalReductionPercent}</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY & DENSITY CONTROLS */}
          {activeTab === "customizer" && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Fine-tune Typography & Information Density:
                </h4>
                <p className="text-xs text-slate-500">
                  Customize text style and spacing according to your viewing environment.
                </p>
              </div>

              {/* Font Family Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Typeface Style:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => onSelectFont("sans")}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      fontOverride === "sans"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                        : "border-slate-200 bg-slate-50 hover:bg-white"
                    }`}
                  >
                    <div className="font-sans text-sm font-bold">Modern Sans</div>
                    <div className="text-[11px] text-slate-500">Clean, crisp & geometric</div>
                  </button>

                  <button
                    onClick={() => onSelectFont("serif")}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      fontOverride === "serif"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                        : "border-slate-200 bg-slate-50 hover:bg-white"
                    }`}
                  >
                    <div className="font-serif text-sm font-bold">Editorial Serif</div>
                    <div className="text-[11px] text-slate-500">Naturalist & organic paper</div>
                  </button>

                  <button
                    onClick={() => onSelectFont("mono")}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      fontOverride === "mono"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                        : "border-slate-200 bg-slate-50 hover:bg-white"
                    }`}
                  >
                    <div className="font-mono text-sm font-bold">Tactical Monospace</div>
                    <div className="text-[11px] text-slate-500">Rugged field telemetry</div>
                  </button>
                </div>
              </div>

              {/* Layout Density */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Layout Density & Spacing:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => onSelectDensity("compact")}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      activeDensity === "compact"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                        : "border-slate-200 bg-slate-50 hover:bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold">Compact Tactical</div>
                    <div className="text-[10px] text-slate-500">High-density data tables</div>
                  </button>

                  <button
                    onClick={() => onSelectDensity("normal")}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      activeDensity === "normal"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                        : "border-slate-200 bg-slate-50 hover:bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold">Balanced Normal</div>
                    <div className="text-[10px] text-slate-500">Standard clean spacing</div>
                  </button>

                  <button
                    onClick={() => onSelectDensity("spacious")}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      activeDensity === "spacious"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                        : "border-slate-200 bg-slate-50 hover:bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold">Spacious Studio</div>
                    <div className="text-[10px] text-slate-500">Generous visual cards</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="text-slate-500">
            Active Theme: <strong className="text-slate-900">{THEME_CONFIGS[currentTheme].name}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

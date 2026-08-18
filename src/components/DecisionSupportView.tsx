import React, { useState } from "react";
import {
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  CloudRain,
  Sun,
  ShieldCheck,
  Send,
  Zap,
  Gauge,
  Sliders,
  Sparkles,
  Loader2,
  Volume2,
  Activity,
  ArrowRight,
  TrendingDown,
  Clock,
  Compass,
  Radio,
  Waves,
  Cpu,
} from "lucide-react";
import { FieldRecord, IrrigationAdvisoryResult } from "../types/agriculture";

interface DecisionSupportViewProps {
  fields: FieldRecord[];
  onUpdateField: (updated: FieldRecord) => void;
  language: string;
  onOpenCropDoctor: () => void;
  onOpenSoilAdvisor: () => void;
  onOpenActivityLab: () => void;
}

export const DecisionSupportView: React.FC<DecisionSupportViewProps> = ({
  fields,
  onUpdateField,
  language,
  onOpenCropDoctor,
  onOpenSoilAdvisor,
  onOpenActivityLab,
}) => {
  const [selectedFieldId, setSelectedFieldId] = useState<string>(fields[0]?.id || "field-1");
  const [isCalculatingAdvisory, setIsCalculatingAdvisory] = useState(false);
  const [advisoryResult, setAdvisoryResult] = useState<IrrigationAdvisoryResult | null>(null);
  const [customMoisture, setCustomMoisture] = useState<number>(42);
  const [forecastRainMm, setForecastRainMm] = useState<number>(12);
  const [quickQuery, setQuickQuery] = useState("");
  const [isQueryingAgronomist, setIsQueryingAgronomist] = useState(false);
  const [agronomistAnswer, setAgronomistAnswer] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const selectedField = fields.find((f) => f.id === selectedFieldId) || fields[0];

  // Request Automated Irrigation Advisory from Gemini
  const handleCalculateAdvisory = async () => {
    if (!selectedField) return;
    setIsCalculatingAdvisory(true);
    try {
      const response = await fetch("/api/gemini/irrigation-advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropType: selectedField.crop,
          growthStage: selectedField.stage,
          soilMoisturePercent: customMoisture,
          temperatureC: selectedField.currentTemp,
          humidityPercent: selectedField.currentHumidity,
          forecastRainNext3DaysMm: forecastRainMm,
          irrigationMethod: selectedField.irrigationType,
        }),
      });
      const data = await response.json();
      setAdvisoryResult(data);

      // Auto update field moisture & health
      const newHealth = customMoisture < 45 ? "Needs Attention" : "Optimal";
      onUpdateField({
        ...selectedField,
        currentMoisture: customMoisture,
        healthStatus: newHealth,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculatingAdvisory(false);
    }
  };

  const toggleValve = (field: FieldRecord) => {
    const updated = { ...field, valveOpen: !field.valveOpen };
    if (updated.valveOpen) {
      updated.currentMoisture = Math.min(100, updated.currentMoisture + 15);
      if (updated.currentMoisture >= 50) updated.healthStatus = "Optimal";
    }
    onUpdateField(updated);
  };

  const handleAskAgronomist = async (customPrompt?: string) => {
    const query = customPrompt || quickQuery;
    if (!query.trim()) return;
    setIsQueryingAgronomist(true);
    setAgronomistAnswer(null);
    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          language,
          context: {
            field: selectedField?.name,
            crop: selectedField?.crop,
            stage: selectedField?.stage,
            moisture: selectedField?.currentMoisture,
            temp: selectedField?.currentTemp,
          },
        }),
      });
      const data = await res.json();
      setAgronomistAnswer(data.reply || data.fallbackReply);
    } catch (err) {
      console.error(err);
      setAgronomistAnswer("Optimal soil moisture for wheat at vegetative stage is 55-65%. Ensure drainage to prevent root rot.");
    } finally {
      setIsQueryingAgronomist(false);
    }
  };

  const handleTextToSpeech = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : language === "es" ? "es-ES" : "en-US";
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* TOP COMMAND HERO COCKPIT */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 border border-emerald-800/60 shadow-2xl">
        {/* Animated Background Pulse Waves */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none pulse-glow" />
        <div className="absolute right-1/3 -bottom-16 w-48 h-48 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Automated Decision Support System (DSS)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Precision Hydrology & Agronomic Command
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Eliminating groundwater wastage, timing automated valves against upcoming rainfall, and optimizing
              crop yields through closed-loop IoT root telemetry & Gemini AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenCropDoctor}
              className="px-4 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold border border-emerald-400/30 transition-all flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Crop Doctor AI
            </button>
            <button
              onClick={onOpenSoilAdvisor}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold border border-slate-600 transition-all flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-amber-300" />
              Soil & NPK Plan
            </button>
            <button
              onClick={onOpenActivityLab}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold transition-all flex items-center gap-2 shadow-md shadow-amber-950/50 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Student Activity Hub
            </button>
          </div>
        </div>

        {/* Micro Telemetry Bar with Animated Metrics */}
        <div className="mt-6 pt-5 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/60 backdrop-blur-xs p-3 rounded-xl border border-emerald-800/40 hover:border-emerald-500/50 transition-colors">
            <span className="text-[10px] text-emerald-300/70 block uppercase font-bold">Soil Water Saved</span>
            <span className="text-lg font-black text-emerald-300 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-emerald-400 animate-bounce" />
              45% Conserved
            </span>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xs p-3 rounded-xl border border-emerald-800/40 hover:border-emerald-500/50 transition-colors">
            <span className="text-[10px] text-emerald-300/70 block uppercase font-bold">Active Valve Mesh</span>
            <span className="text-lg font-black text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              4 IoT Solenoids
            </span>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xs p-3 rounded-xl border border-emerald-800/40 hover:border-emerald-500/50 transition-colors">
            <span className="text-[10px] text-emerald-300/70 block uppercase font-bold">Rainfall Probability</span>
            <span className="text-lg font-black text-sky-300 flex items-center gap-1.5">
              <CloudRain className={`w-4 h-4 ${forecastRainMm > 0 ? "text-sky-400 animate-pulse" : "text-slate-400"}`} />
              {forecastRainMm > 0 ? "75% (72h)" : "0% Clear"}
            </span>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xs p-3 rounded-xl border border-emerald-800/40 hover:border-emerald-500/50 transition-colors">
            <span className="text-[10px] text-emerald-300/70 block uppercase font-bold">Evapotranspiration</span>
            <span className="text-lg font-black text-amber-300 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              4.8 mm/day
            </span>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (4 Cols): Field Grid & Actuator State */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-600" />
                Active Field Plots ({fields.length})
              </h2>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Probes Active
              </span>
            </div>

            <div className="space-y-2.5">
              {fields.map((field) => {
                const isSelected = field.id === selectedFieldId;
                const isLowMoisture = field.currentMoisture < 45;
                return (
                  <div
                    key={field.id}
                    onClick={() => {
                      setSelectedFieldId(field.id);
                      setCustomMoisture(field.currentMoisture);
                      setAdvisoryResult(null);
                    }}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20 scale-[1.01]"
                        : "border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          {field.name}
                          <span className="text-[10px] font-semibold text-slate-500">
                            ({field.areaAcre} Acres)
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {field.crop} • {field.stage}
                        </div>
                      </div>

                      {isLowMoisture ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Dry Alert
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Optimal
                        </span>
                      )}
                    </div>

                    {/* Progress moisture bar with animated transition */}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                        <span>Soil Moisture</span>
                        <span className={isLowMoisture ? "text-amber-600 font-bold" : "text-emerald-700 font-bold"}>
                          {field.currentMoisture}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ease-out rounded-full ${
                            isLowMoisture ? "bg-amber-500" : "bg-emerald-600"
                          }`}
                          style={{ width: `${field.currentMoisture}%` }}
                        />
                      </div>
                    </div>

                    {/* Micro Valve Controller with Flow Animation */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                      <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                        {field.valveOpen && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                          </span>
                        )}
                        <span>Solenoid Valve:</span>
                        <strong className={field.valveOpen ? "text-emerald-600 font-extrabold" : "text-slate-500"}>
                          {field.valveOpen ? "RUNNING" : "STANDBY"}
                        </strong>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleValve(field);
                        }}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                          field.valveOpen
                            ? "bg-rose-600 hover:bg-rose-700 text-white"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        {field.valveOpen ? "Close Valve" : "Manual Override"}
                      </button>
                    </div>

                    {/* Animated water pipe graphic if valve open */}
                    {field.valveOpen && (
                      <div className="mt-2.5 p-2 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-between text-[10px] text-sky-800 font-bold">
                        <span className="flex items-center gap-1">
                          <Waves className="w-3.5 h-3.5 text-sky-600 animate-spin" />
                          Drip Water Emitting (1.8 L/hr)
                        </span>
                        <span className="water-drip">💧</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (8 Cols): Interactive Hydrology Engine & AI Decision Matrix */}
        <div className="lg:col-span-8 space-y-6">
          {/* SMART IRRIGATION & HYDROLOGY SIMULATOR */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-teal-600" />
                  Smart Irrigation Alarm & Hydrology Simulator
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selected Target: <strong className="text-slate-900">{selectedField?.name}</strong> • Crop: <strong className="text-emerald-700">{selectedField?.crop} ({selectedField?.stage})</strong>
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                Method: {selectedField?.irrigationType}
              </span>
            </div>

            {/* Interactive Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {/* Soil Moisture Sensor Probe */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-bold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-teal-600" />
                    Root Moisture Probe:
                  </span>
                  <span className={customMoisture < 45 ? "text-amber-600 font-extrabold" : "text-emerald-700 font-extrabold"}>
                    {customMoisture}% {customMoisture < 45 ? "(Deficit Alarm)" : "(Adequate)"}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={95}
                  value={customMoisture}
                  onChange={(e) => setCustomMoisture(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 transition-all"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
                  <span>10% (Severe Drought)</span>
                  <span>45% (Critical Threshold)</span>
                  <span>95% (Saturated)</span>
                </div>
              </div>

              {/* Rain Forecast (Next 72 Hours) */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-bold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <CloudRain className="w-4 h-4 text-sky-600" />
                    Rain Forecast (Next 72h):
                  </span>
                  <span className="text-sky-700 font-extrabold">{forecastRainMm} mm</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={forecastRainMm}
                  onChange={(e) => setForecastRainMm(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 transition-all"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
                  <span>0 mm (Clear)</span>
                  <span>20 mm (Moderate Rain)</span>
                  <span>60 mm (Downpour)</span>
                </div>
              </div>
            </div>

            {/* Run Hydrology Decision Engine Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span>Ambient Temp: <strong>{selectedField?.currentTemp}°C</strong> | Humidity: <strong>{selectedField?.currentHumidity}%</strong></span>
              </div>

              <button
                onClick={handleCalculateAdvisory}
                disabled={isCalculatingAdvisory}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-md shadow-teal-950/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
              >
                {isCalculatingAdvisory ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-teal-200" />
                    Computing Hydrology Model...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-teal-200 animate-pulse" />
                    Calculate Automated Irrigation Decision
                  </>
                )}
              </button>
            </div>

            {/* AI Advisory Result Card with Smooth Transition */}
            {advisoryResult && (
              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold tracking-wide uppercase ${
                        advisoryResult.irrigationStatus === "TRIGGER_NOW"
                          ? "bg-rose-600 text-white animate-pulse"
                          : advisoryResult.irrigationStatus === "HOLD_DUE_TO_RAIN"
                          ? "bg-sky-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      Status: {advisoryResult.irrigationStatus.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      Urgency: <strong className="text-slate-900">{advisoryResult.urgencyLevel}</strong>
                    </span>
                  </div>

                  <div className="text-xs font-extrabold text-emerald-900 bg-white px-3 py-1 rounded-lg border border-emerald-200 shadow-xs">
                    💧 {advisoryResult.waterSavingsVsFloodPercent}% Water Conserved vs Flood Irrigation
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs text-slate-800 leading-relaxed space-y-1">
                  <span className="font-bold text-emerald-950 block">AI Smart Alarm Reasoning:</span>
                  <p>{advisoryResult.smartAlarmReasoning}</p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Recommended Water</span>
                    <span className="text-base font-extrabold text-teal-800">{advisoryResult.recommendedWaterMm} mm</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Valve Run Duration</span>
                    <span className="text-base font-extrabold text-teal-800">{advisoryResult.recommendedDurationMinutes} mins</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Daily ETc</span>
                    <span className="text-base font-extrabold text-slate-800">{advisoryResult.dailyEvapotranspirationMm} mm/d</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Optimal Time</span>
                    <span className="text-xs font-extrabold text-slate-800">{advisoryResult.bestTimeToIrrigate.split(" ")[0]}</span>
                  </div>
                </div>

                {/* Action Checklist */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                    Execution Action Plan:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {advisoryResult.actionChecklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white/70 p-2 rounded-lg border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* QUICK DIRECT AGRONOMIST AI ADVISORY CONSOLE */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm float-slow">
                  🌾
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Direct Agronomist AI Query Console</h3>
                  <p className="text-xs text-slate-500">
                    Instant advice for crops, pests, and soil in {language === "hi" ? "हिंदी" : language === "pa" ? "ਪੰਜਾਬੀ" : "your selected language"}.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick suggested chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick Queries:</span>
              <button
                onClick={() => {
                  setQuickQuery("How to treat yellow rust in wheat organically?");
                  handleAskAgronomist("How to treat yellow rust in wheat organically?");
                }}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0 transition-colors"
              >
                Organic Yellow Rust in Wheat
              </button>
              <button
                onClick={() => {
                  setQuickQuery("What is the optimal NPK split for Basmati paddy?");
                  handleAskAgronomist("What is the optimal NPK split for Basmati paddy?");
                }}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0 transition-colors"
              >
                Basmati Paddy NPK Split
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAgronomist();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Ask e.g. 'How much urea to apply at flowering?' or in Hindi / Punjabi..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isQueryingAgronomist || !quickQuery.trim()}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
              >
                {isQueryingAgronomist ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Ask
              </button>
            </form>

            {/* Answer Display with Audio Equalizer Animation */}
            {agronomistAnswer && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-bold border-b border-slate-200 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Agronomist Guidance:
                  </span>
                  <button
                    onClick={() => handleTextToSpeech(agronomistAnswer)}
                    className="flex items-center gap-2 text-xs text-slate-600 hover:text-emerald-700 font-semibold cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
                    title="Audio Readout"
                  >
                    {isSpeaking ? (
                      <div className="flex items-center gap-0.5 h-3">
                        <span className="w-0.5 h-full bg-emerald-600 animate-pulse" />
                        <span className="w-0.5 h-2 bg-emerald-600 animate-ping" />
                        <span className="w-0.5 h-full bg-emerald-600 animate-pulse" />
                      </div>
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                    {isSpeaking ? "Stop Voice" : "Listen (TTS)"}
                  </button>
                </div>
                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                  {agronomistAnswer}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

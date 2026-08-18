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

  const handleAskAgronomist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    setIsQueryingAgronomist(true);
    setAgronomistAnswer(null);
    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: quickQuery,
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
      setAgronomistAnswer("Ensure optimal soil moisture and scout leaves for early fungal blights.");
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
    utterance.lang = language === "hi" ? "hi-IN" : language === "es" ? "es-ES" : "en-US";
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner: Context & Status */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-xl p-6 shadow-sm border border-emerald-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              Automated Decision Support System (DSS)
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Farm Command & Real-Time Intelligence
            </h1>
            <p className="text-sm text-emerald-200/90 mt-1 max-w-3xl">
              Integrating IoT root sensors, weather micro-forecasts, and Gemini AI to eliminate water wastage,
              counter pest attacks, and maximize harvest yields.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onOpenCropDoctor}
              className="px-3.5 py-2 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-medium border border-emerald-500/40 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Scan Crop Disease
            </button>
            <button
              onClick={onOpenSoilAdvisor}
              className="px-3.5 py-2 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-medium border border-emerald-500/40 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sliders className="w-4 h-4 text-emerald-300" />
              Soil & NPK Advisor
            </button>
            <button
              onClick={onOpenActivityLab}
              className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Student Activity Hub
            </button>
          </div>
        </div>
      </div>

      {/* Field Selector & Real-Time Telemetry Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Field Selection & Active Telemetry */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-600" />
              Monitored Fields ({fields.length})
            </h2>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live Probes Active
            </span>
          </div>

          <div className="space-y-2">
            {fields.map((field) => {
              const isSelected = field.id === selectedFieldId;
              const isLowMoisture = field.currentMoisture < 45;
              return (
                <button
                  key={field.id}
                  onClick={() => {
                    setSelectedFieldId(field.id);
                    setCustomMoisture(field.currentMoisture);
                    setAdvisoryResult(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/70 shadow-sm"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{field.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {field.crop} • {field.stage} • {field.areaAcre} Acres
                      </div>
                    </div>
                    {isLowMoisture ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Dry Alert
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Optimal
                      </span>
                    )}
                  </div>

                  {/* Micro stats */}
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-600 bg-white/80 p-1.5 rounded border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[9px]">Moisture</span>
                      <span className={`font-bold ${isLowMoisture ? "text-amber-600" : "text-emerald-700"}`}>
                        {field.currentMoisture}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Temp</span>
                      <span className="font-bold text-slate-800">{field.currentTemp}°C</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Valve</span>
                      <span className={`font-bold ${field.valveOpen ? "text-emerald-600" : "text-slate-500"}`}>
                        {field.valveOpen ? "OPEN" : "CLOSED"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Valve Actuator */}
          {selectedField && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between bg-slate-900 text-white p-3 rounded-lg">
                <div>
                  <div className="text-xs font-bold">Automated Valve State</div>
                  <div className="text-[11px] text-slate-300">
                    {selectedField.valveOpen ? "Actuator is pumping drip lines" : "Valve is closed (Standby)"}
                  </div>
                </div>
                <button
                  onClick={() => toggleValve(selectedField)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                    selectedField.valveOpen
                      ? "bg-rose-500 hover:bg-rose-600 text-white"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  }`}
                >
                  {selectedField.valveOpen ? "Close Valve" : "Manual Override Open"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Center & Right Column: Interactive Smart Irrigation & Hydrology DSS Engine */}
        <div className="lg:col-span-2 space-y-6">
          {/* Smart Irrigation Advisory & Alarm Engine */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-teal-600" />
                  Smart Irrigation Alarm & Automated Hydrology Engine
                </h2>
                <p className="text-xs text-slate-500">
                  Target Field: <span className="font-semibold text-slate-800">{selectedField?.name}</span> ({selectedField?.crop})
                </p>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                Method: <strong className="text-slate-800">{selectedField?.irrigationType}</strong>
              </span>
            </div>

            {/* Interactive Sensor Simulator Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200 mb-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-teal-600" />
                    Soil Moisture Sensor Reading:
                  </span>
                  <span className={`font-bold ${customMoisture < 45 ? "text-amber-600" : "text-emerald-700"}`}>
                    {customMoisture}% {customMoisture < 45 ? "(Deficit Alert)" : "(Good Range)"}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={95}
                  value={customMoisture}
                  onChange={(e) => setCustomMoisture(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>10% (Severe Drought)</span>
                  <span>45% (Critical Alarm)</span>
                  <span>95% (Waterlogged)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 flex items-center gap-1">
                    <CloudRain className="w-3.5 h-3.5 text-sky-600" />
                    Forecasted Rain (Next 72 Hours):
                  </span>
                  <span className="font-bold text-sky-700">{forecastRainMm} mm</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={forecastRainMm}
                  onChange={(e) => setForecastRainMm(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0 mm (Clear Skies)</span>
                  <span>20 mm (Moderate Rain)</span>
                  <span>60 mm (Heavy Downpour)</span>
                </div>
              </div>
            </div>

            {/* Run Decision Model Button */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span>Ambient: <strong>{selectedField?.currentTemp}°C</strong> | Humidity: <strong>{selectedField?.currentHumidity}%</strong></span>
              </div>
              <button
                onClick={handleCalculateAdvisory}
                disabled={isCalculatingAdvisory}
                className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isCalculatingAdvisory ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Computing Hydrology...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    Run AI Hydrology Decision Engine
                  </>
                )}
              </button>
            </div>

            {/* AI Advisory Result Output */}
            {advisoryResult && (
              <div className="mt-4 p-4 rounded-xl border bg-emerald-50/50 border-emerald-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${
                        advisoryResult.irrigationStatus === "TRIGGER_NOW"
                          ? "bg-rose-600 text-white"
                          : advisoryResult.irrigationStatus === "HOLD_DUE_TO_RAIN"
                          ? "bg-sky-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      Status: {advisoryResult.irrigationStatus.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      Urgency: <span className="text-slate-900">{advisoryResult.urgencyLevel}</span>
                    </span>
                  </div>
                  <div className="text-xs font-bold text-emerald-800 bg-white px-3 py-1 rounded border border-emerald-200">
                    💧 {advisoryResult.waterSavingsVsFloodPercent}% Water Conserved vs Flood
                  </div>
                </div>

                <p className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                  <strong>AI Smart Alarm Reasoning:</strong> {advisoryResult.smartAlarmReasoning}
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Recommended Water</span>
                    <span className="text-sm font-bold text-teal-800">{advisoryResult.recommendedWaterMm} mm</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Valve Run Duration</span>
                    <span className="text-sm font-bold text-teal-800">{advisoryResult.recommendedDurationMinutes} mins</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Evapotranspiration (ETc)</span>
                    <span className="text-sm font-bold text-slate-800">{advisoryResult.dailyEvapotranspirationMm} mm/day</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Optimal Time Slot</span>
                    <span className="text-[11px] font-bold text-slate-800">{advisoryResult.bestTimeToIrrigate.split(" ")[0]}</span>
                  </div>
                </div>

                {/* Action Checklist */}
                <div>
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Recommended Action Checklist:
                  </div>
                  <ul className="space-y-1">
                    {advisoryResult.actionChecklist.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Quick AI Agronomist Consultation Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  🌾
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Direct Agronomist AI Consultation</h3>
                  <p className="text-xs text-slate-500">
                    Instant advice for crops, pests, and soil in {language === "hi" ? "हिंदी" : language === "pa" ? "ਪੰਜਾਬੀ" : "your selected language"}.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAskAgronomist} className="flex gap-2">
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Ask e.g. 'How much urea should I apply to wheat at flowering stage?' or in Hindi..."
                className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isQueryingAgronomist || !quickQuery.trim()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {isQueryingAgronomist ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Ask
              </button>
            </form>

            {/* Agronomist Answer Output */}
            {agronomistAnswer && (
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold border-b border-slate-200 pb-1">
                  <span>Agronomist Guidance:</span>
                  <button
                    onClick={() => handleTextToSpeech(agronomistAnswer)}
                    className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-emerald-700 font-medium"
                    title="Listen to audio readout"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "text-emerald-600 animate-pulse" : ""}`} />
                    {isSpeaking ? "Stop Audio" : "Listen (TTS)"}
                  </button>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
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

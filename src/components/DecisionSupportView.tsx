import React, { useState, useEffect } from "react";
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
  Sliders,
  Sparkles,
  Loader2,
  Volume2,
  MapPin,
  Clock,
  Waves,
  Power,
  RotateCcw,
} from "lucide-react";
import { FieldRecord, IrrigationAdvisoryResult, WeatherData, LocationOption } from "../types/agriculture";
import { WeatherStationWidget } from "./WeatherStationWidget";

interface DecisionSupportViewProps {
  fields: FieldRecord[];
  onUpdateField: (updated: FieldRecord) => void;
  language: string;
  onOpenCropDoctor: () => void;
  onOpenSoilAdvisor: () => void;
}

export const DecisionSupportView: React.FC<DecisionSupportViewProps> = ({
  fields,
  onUpdateField,
  language,
  onOpenCropDoctor,
  onOpenSoilAdvisor,
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

  // Real-Time Weather State
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [activeLocation, setActiveLocation] = useState<LocationOption>({
    name: "Ludhiana",
    region: "Punjab",
    country: "India",
    latitude: 30.901,
    longitude: 75.8573,
  });

  const selectedField = fields.find((f) => f.id === selectedFieldId) || fields[0];

  // Fetch real-time weather
  const fetchWeatherForLocation = async (loc: LocationOption) => {
    setIsWeatherLoading(true);
    try {
      const url = `/api/weather/current?lat=${loc.latitude}&lon=${loc.longitude}&place=${encodeURIComponent(
        loc.name
      )}&region=${encodeURIComponent(loc.region || "")}&country=${encodeURIComponent(loc.country || "")}`;
      const res = await fetch(url);
      const data: WeatherData = await res.json();
      setWeather(data);
      setActiveLocation(loc);

      // Auto synchronize rain & ambient telemetry
      if (data.forecastRain3DaysMm !== undefined) {
        setForecastRainMm(data.forecastRain3DaysMm);
      }
      if (selectedField) {
        onUpdateField({
          ...selectedField,
          currentTemp: data.temperatureC,
          currentHumidity: data.humidityPercent,
        });
      }
    } catch (err) {
      console.error("Failed to load real-time weather:", err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  // Initial load: Attempt GPS or fallback to default farming region
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherForLocation({
            name: "My Farm",
            region: "Local Field",
            country: "GPS Detected",
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          fetchWeatherForLocation(activeLocation);
        },
        { timeout: 4000 }
      );
    } else {
      fetchWeatherForLocation(activeLocation);
    }
  }, []);

  const handleUseCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherForLocation({
          name: "My Current Farm",
          region: "Live GPS",
          country: "",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        setIsWeatherLoading(false);
        console.warn("GPS access denied or timed out:", err.message);
      }
    );
  };

  // Request Automated Irrigation Advisory from Gemini with real weather telemetry
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
          temperatureC: weather?.temperatureC || selectedField.currentTemp,
          humidityPercent: weather?.humidityPercent || selectedField.currentHumidity,
          forecastRainNext3DaysMm: forecastRainMm,
          irrigationMethod: selectedField.irrigationType,
          locationContext: weather ? `${weather.placeName}, ${weather.region}` : undefined,
        }),
      });
      const data = await response.json();
      setAdvisoryResult(data);

      // Auto update field moisture & health
      const newHealth = customMoisture < 45 ? "Needs Attention" : "Optimal";
      onUpdateField({
        ...selectedField,
        currentMoisture: customMoisture,
        currentTemp: weather?.temperatureC || selectedField.currentTemp,
        currentHumidity: weather?.humidityPercent || selectedField.currentHumidity,
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
            temp: weather?.temperatureC || selectedField?.currentTemp,
            humidity: weather?.humidityPercent || selectedField?.currentHumidity,
            location: weather?.placeName,
          },
        }),
      });
      const data = await res.json();
      setAgronomistAnswer(data.reply || data.fallbackReply);
    } catch (err) {
      console.error(err);
      setAgronomistAnswer("For wheat in growing stage, maintain soil moisture between 55% and 65%. Water in the early morning to save water.");
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
      {/* SIMPLE HEADER HERO */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-6 sm:p-7 border border-emerald-800/60 shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Agro-Weather & Decision Support
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Smart Water & Irrigation Guide
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Real-time weather station integration with automatic soil moisture analysis and precision valve control.
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onOpenCropDoctor}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Check Leaf Disease
            </button>
            <button
              onClick={onOpenSoilAdvisor}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm border border-slate-700 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Sliders className="w-4 h-4 text-amber-300" />
              Fertilizer Calculator
            </button>
          </div>
        </div>

        {/* 4 Simple Farm Summary Boxes */}
        <div className="pt-3 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/70 p-3 rounded-xl border border-emerald-800/40">
            <span className="text-[11px] text-emerald-300/80 block font-semibold">Current Temperature</span>
            <span className="text-base font-black text-rose-300 flex items-center gap-1.5 mt-0.5">
              <Thermometer className="w-4 h-4 text-rose-400" />
              {weather ? `${weather.temperatureC}°C (${weather.placeName})` : "29.5°C"}
            </span>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-emerald-800/40">
            <span className="text-[11px] text-emerald-300/80 block font-semibold">Relative Humidity</span>
            <span className="text-base font-black text-sky-300 flex items-center gap-1.5 mt-0.5">
              <Droplets className="w-4 h-4 text-sky-400" />
              {weather ? `${weather.humidityPercent}% RH` : "58% RH"}
            </span>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-emerald-800/40">
            <span className="text-[11px] text-emerald-300/80 block font-semibold">Rain Expected</span>
            <span className="text-base font-black text-sky-300 flex items-center gap-1.5 mt-0.5">
              <CloudRain className="w-4 h-4 text-sky-400" />
              {forecastRainMm > 0 ? `${forecastRainMm} mm (Next 3 Days)` : "Clear Weather"}
            </span>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-emerald-800/40">
            <span className="text-[11px] text-emerald-300/80 block font-semibold">Sun Evaporation (ET₀)</span>
            <span className="text-base font-black text-amber-300 flex items-center gap-1.5 mt-0.5">
              <Sun className="w-4 h-4 text-amber-400" />
              {weather ? `${weather.evapotranspirationMmDay} mm/day` : "4.8 mm/day"}
            </span>
          </div>
        </div>
      </div>

      {/* REAL-TIME AGRO-WEATHER STATION WIDGET */}
      <WeatherStationWidget
        weather={weather}
        isLoading={isWeatherLoading}
        onSelectLocation={fetchWeatherForLocation}
        onRefresh={() => activeLocation && fetchWeatherForLocation(activeLocation)}
        onUseCurrentLocation={handleUseCurrentLocation}
      />

      {/* TWO COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Field Selector & Valve Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Select Field ({fields.length} Fields)
              </h2>
              <span className="text-[10px] font-bold text-slate-500">
                Click a field to test
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
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/70 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {field.name} ({field.areaAcre} Acres)
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          Crop: {field.crop} • {field.stage}
                        </div>
                      </div>

                      {isLowMoisture ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Needs Water
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Moisture OK
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                        <span>Soil Moisture:</span>
                        <span className={isLowMoisture ? "text-amber-600 font-bold" : "text-emerald-700 font-bold"}>
                          {field.currentMoisture}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isLowMoisture ? "bg-amber-500" : "bg-emerald-600"
                          }`}
                          style={{ width: `${field.currentMoisture}%` }}
                        />
                      </div>
                    </div>

                    {/* Live Sensor Telemetry Badge */}
                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 bg-white/80 px-2 py-1 rounded-lg border border-slate-200">
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-rose-500" />
                        {weather?.temperatureC ? `${weather.temperatureC}°C` : `${field.currentTemp}°C`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-sky-500" />
                        {weather?.humidityPercent ? `${weather.humidityPercent}% RH` : `${field.currentHumidity}% RH`}
                      </span>
                      <span className="text-emerald-700 font-bold">
                        {weather?.placeName || "Live"}
                      </span>
                    </div>

                    {/* Simple Valve Button */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-600 font-medium">
                        Valve:{" "}
                        <strong className={field.valveOpen ? "text-emerald-600 font-bold" : "text-slate-500"}>
                          {field.valveOpen ? "RUNNING (ON)" : "CLOSED (OFF)"}
                        </strong>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleValve(field);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          field.valveOpen
                            ? "bg-rose-600 hover:bg-rose-700 text-white"
                            : "bg-emerald-700 hover:bg-emerald-800 text-white"
                        }`}
                      >
                        {field.valveOpen ? "Turn Water OFF" : "Turn Water ON"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Water Need Checker */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-teal-600" />
                  Water Need Checker & Irrigation Calculator
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Field: <strong className="text-slate-900">{selectedField?.name}</strong> • Crop: <strong className="text-emerald-700">{selectedField?.crop} ({selectedField?.stage})</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  System: {selectedField?.irrigationType}
                </span>
              </div>
            </div>

            {/* Sliders with Real-Time Weather Pre-fills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {/* Soil Moisture Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-bold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-teal-600" />
                    Soil Moisture in Field:
                  </span>
                  <span className={customMoisture < 45 ? "text-amber-600 font-extrabold" : "text-emerald-700 font-extrabold"}>
                    {customMoisture}% {customMoisture < 45 ? "(Dry / Needs Water)" : "(Sufficient)"}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={95}
                  value={customMoisture}
                  onChange={(e) => setCustomMoisture(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
                  <span>10% (Dry Ground)</span>
                  <span>45% (Watering Mark)</span>
                  <span>95% (Wet / Saturated)</span>
                </div>
              </div>

              {/* Rain Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-bold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <CloudRain className="w-4 h-4 text-sky-600" />
                    Forecasted Rain (Next 3 Days):
                  </span>
                  <span className="text-sky-700 font-extrabold">{forecastRainMm} mm</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={forecastRainMm}
                  onChange={(e) => setForecastRainMm(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
                  <span>0 mm (Sunny / Dry)</span>
                  <span>{weather?.forecastRain3DaysMm ? `Live Forecast: ${weather.forecastRain3DaysMm}mm` : "20 mm"}</span>
                  <span>60 mm (Heavy Rain)</span>
                </div>
              </div>
            </div>

            {/* Live Station Sync Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs">
              <div className="text-slate-700 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span>
                  Live Weather Feed: <strong>{weather?.placeName || "Active"}</strong> • Temp: <strong>{weather?.temperatureC ?? selectedField?.currentTemp}°C</strong> • Humidity: <strong>{weather?.humidityPercent ?? selectedField?.currentHumidity}%</strong>
                </span>
              </div>

              <button
                onClick={handleCalculateAdvisory}
                disabled={isCalculatingAdvisory}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
              >
                {isCalculatingAdvisory ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                    Analyzing Soil & Live Weather...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-emerald-200" />
                    Calculate Smart Irrigation
                  </>
                )}
              </button>
            </div>

            {/* Advisory Result */}
            {advisoryResult && (
              <div className="p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-4 animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase ${
                        advisoryResult.irrigationStatus === "TRIGGER_NOW"
                          ? "bg-rose-600 text-white"
                          : advisoryResult.irrigationStatus === "HOLD_DUE_TO_RAIN"
                          ? "bg-sky-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {advisoryResult.irrigationStatus === "TRIGGER_NOW"
                        ? "WATER NOW (IRRIGATE)"
                        : advisoryResult.irrigationStatus === "HOLD_DUE_TO_RAIN"
                        ? "WAIT - RAIN COMING"
                        : "MOISTURE IS GOOD"}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      Urgency: <strong>{advisoryResult.urgencyLevel}</strong>
                    </span>
                  </div>

                  <div className="text-xs font-extrabold text-emerald-900 bg-white px-3 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                    💧 {advisoryResult.waterSavingsVsFloodPercent}% Water Saved
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs text-slate-800 leading-relaxed space-y-1">
                  <span className="font-bold text-emerald-950 block">Recommendation for Farmer:</span>
                  <p>{advisoryResult.smartAlarmReasoning}</p>
                </div>

                {/* Plain Numbers Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Water Needed</span>
                    <span className="text-base font-black text-emerald-700 mt-0.5 block">
                      {advisoryResult.recommendedWaterMm} mm
                    </span>
                    <span className="text-[10px] text-slate-400">Rain-adjusted</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Drip Run Time</span>
                    <span className="text-base font-black text-sky-700 mt-0.5 block">
                      {advisoryResult.recommendedDurationMinutes} mins
                    </span>
                    <span className="text-[10px] text-slate-400">Automated valve</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Best Watering Time</span>
                    <span className="text-xs font-black text-slate-800 mt-1 block line-clamp-1">
                      {advisoryResult.bestTimeToIrrigate}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Sun Evaporation</span>
                    <span className="text-base font-black text-amber-600 mt-0.5 block">
                      {advisoryResult.dailyEvapotranspirationMm} mm/d
                    </span>
                    <span className="text-[10px] text-slate-400">Crop water loss</span>
                  </div>
                </div>

                {/* Checklist */}
                {advisoryResult.actionChecklist?.length > 0 && (
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">
                      What the farmer should do right now:
                    </span>
                    <div className="space-y-1.5">
                      {advisoryResult.actionChecklist.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* QUICK ADVISORY QUESTION BOX */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Ask Any Farming Question</h3>
                <p className="text-xs text-slate-500">
                  Ask about crops, disease, fertilizer, or water in {language === "hi" ? "हिंदी" : language === "pa" ? "ਪੰਜਾਬੀ" : "simple words"}.
                </p>
              </div>
            </div>

            {/* Quick suggested chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick Questions:</span>
              <button
                onClick={() => {
                  setQuickQuery("How to save wheat crop from yellow rust organically?");
                  handleAskAgronomist("How to save wheat crop from yellow rust organically?");
                }}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0 transition-colors"
              >
                Yellow Rust in Wheat
              </button>
              <button
                onClick={() => {
                  setQuickQuery("When is the best time to put Urea in Basmati paddy?");
                  handleAskAgronomist("When is the best time to put Urea in Basmati paddy?");
                }}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0 transition-colors"
              >
                Urea Timing for Paddy
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
                placeholder="Ask e.g. 'How much urea to put in wheat?' or type in Hindi / Punjabi..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isQueryingAgronomist || !quickQuery.trim()}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
              >
                {isQueryingAgronomist ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Ask
              </button>
            </form>

            {/* Answer Display */}
            {agronomistAnswer && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-bold border-b border-slate-200 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Answer & Advice:
                  </span>
                  <button
                    onClick={() => handleTextToSpeech(agronomistAnswer)}
                    className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-emerald-700 font-semibold cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200"
                  >
                    <Volume2 className="w-4 h-4" />
                    {isSpeaking ? "Stop Voice" : "Listen in Voice"}
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

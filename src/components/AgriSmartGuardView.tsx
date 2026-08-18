import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Droplets,
  Cpu,
  Camera,
  Sun,
  Radio,
  Send,
  CheckCircle2,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Zap,
  MessageSquare,
  Sparkles,
  Layers,
  ArrowRight,
  Activity,
  Printer,
  Smartphone,
  Sliders,
  Check,
  RotateCcw,
} from "lucide-react";

export const AgriSmartGuardView: React.FC = () => {
  // Simulator state
  const [soilMoisture, setSoilMoisture] = useState<number>(32); // %
  const [isAutoAiMode, setIsAutoAiMode] = useState<boolean>(true);
  const [isIrrigationActive, setIsIrrigationActive] = useState<boolean>(false);
  const [cameraScanStatus, setCameraScanStatus] = useState<"scanning" | "clear" | "pest_detected">("pest_detected");
  const [detectedPest, setDetectedPest] = useState<string>("Aphid Colony (Early Nymph Stage)");
  const [cnnConfidence, setCnnConfidence] = useState<number>(94.8);
  const [smsLog, setSmsLog] = useState<Array<{ id: number; time: string; message: string; type: "water" | "pest" }>>([
    {
      id: 1,
      time: "10:14 AM",
      message: "💧 AgriSmart Guard: Soil moisture reached 28% in Sector A. Smart drip irrigation activated for 18 mins.",
      type: "water",
    },
    {
      id: 2,
      time: "08:42 AM",
      message: "⚠️ AgriSmart Alert: CNN camera spotted early Aphid nymph cluster on 3 crop leaves. Isolated neem spray recommended before spread.",
      type: "pest",
    },
  ]);
  const [phoneNumber, setPhoneNumber] = useState<string>("+91 98765 43210");
  const [customSmsAlertSent, setCustomSmsAlertSent] = useState<boolean>(false);

  // Auto Irrigation Logic based on moisture threshold (< 35% trigger)
  useEffect(() => {
    if (isAutoAiMode) {
      if (soilMoisture < 35) {
        setIsIrrigationActive(true);
      } else {
        setIsIrrigationActive(false);
      }
    }
  }, [soilMoisture, isAutoAiMode]);

  const handleSimulatePestCheck = () => {
    setCameraScanStatus("scanning");
    setTimeout(() => {
      const isPest = Math.random() > 0.3;
      if (isPest) {
        setCameraScanStatus("pest_detected");
        setDetectedPest("Whitefly Infestation on Underside");
        setCnnConfidence(96.2);
        const newAlert = {
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          message: `⚠️ AgriSmart Alert: CNN camera detected Whitefly Infestation (96.2% confidence). Spot treatment triggered via SMS.`,
          type: "pest" as const,
        };
        setSmsLog((prev) => [newAlert, ...prev]);
      } else {
        setCameraScanStatus("clear");
        setCnnConfidence(99.1);
      }
    }, 1200);
  };

  const handleSendTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomSmsAlertSent(true);
    const newAlert = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      message: `🔔 AgriSmart Guard Status sent to ${phoneNumber}: Soil moisture at ${soilMoisture}%. Irrigation ${isIrrigationActive ? "ON" : "OFF"}. Water savings at 40%.`,
      type: "water" as const,
    };
    setSmsLog((prev) => [newAlert, ...prev]);
    setTimeout(() => setCustomSmsAlertSent(false), 3000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* SECTION 1: INNOVATION CHALLENGE HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Page 3: Step 3 – Innovation Design Challenge
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              AgriSmart Guard
              <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                AI & IoT System
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              <strong>Smart Irrigation & Pest Monitoring System</strong> solving excessive agricultural water wastage paired with late pest outbreak detection through edge AI and solar IoT sensors.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrintReport}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Print Challenge Brief
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: 3 CORE HIGHLIGHTS & EXPECTED BENEFITS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Benefit 1: Water Savings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              Up to 40% Reduction
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">40% Water Savings</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Eliminates over-watering and flood wastage by releasing irrigation water <strong>only when dry soil thresholds are detected</strong> by sub-surface capacitive probes.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Annual Conserved:</span>
            <strong className="text-sky-700 font-bold">~1.2 Million Liters / Farm</strong>
          </div>
        </div>

        {/* Benefit 2: Early Detection */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Real-Time Alert
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Early Pest Outbreak Detection</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              High-resolution micro-cameras and onboard CNN models scan leaves 24/7, spotting egg clusters and nymphs <strong>before widespread crop destruction occurs</strong>.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Detection Lead Time:</span>
            <strong className="text-emerald-700 font-bold">5–7 Days Earlier</strong>
          </div>
        </div>

        {/* Benefit 3: Cost Efficiency */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              High ROI
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Substantial Cost Efficiency</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Curbs unnecessary chemical pesticide expenses through targeted spot-spraying and lowers tubewell electricity / diesel bills via precision timer valves.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Input Cost Slashed:</span>
            <strong className="text-amber-700 font-bold">35% Lower Operation Cost</strong>
          </div>
        </div>
      </div>

      {/* SECTION 3: SYSTEM ARCHITECTURE & HOW IT WORKS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            System Architecture & Required Technology Stack
          </h2>
          <p className="text-xs text-slate-500">
            Complete hardware blueprint and AI software pipeline specified in the Innovation Design Challenge.
          </p>
        </div>

        {/* 4 Pillars of Hardware/Software */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Pillar 1: Solar & Sensors */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 text-xs font-extrabold">
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              1. Solar & Soil Sensors
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Solar-powered capacitive moisture probes buried in the root zone provide continuous real-time soil volumetric water content without grid electricity.
            </p>
            <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              Hardware: Capacitive v1.2 / 5W Solar
            </span>
          </div>

          {/* Pillar 2: Microcontroller Hub */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 text-xs font-extrabold">
              <Cpu className="w-4 h-4 text-sky-600 shrink-0" />
              2. Microcontroller Hub
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              ESP32 / Raspberry Pi IoT gateway running ultra-low power firmware, reading analog moisture voltages and controlling electromagnetic solenoid valves.
            </p>
            <span className="inline-block text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
              Hardware: ESP32 / Raspberry Pi 4
            </span>
          </div>

          {/* Pillar 3: Leaf Micro-Cameras */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 text-xs font-extrabold">
              <Camera className="w-4 h-4 text-indigo-600 shrink-0" />
              3. Micro-Camera Modules
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Weather-shielded mini camera units mounted across crop rows periodically snapshot canopy leaf surfaces under natural lighting.
            </p>
            <span className="inline-block text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">
              Hardware: OV2640 / Pi Cam v2
            </span>
          </div>

          {/* Pillar 4: CNN AI & SMS Gateway */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 text-xs font-extrabold">
              <Radio className="w-4 h-4 text-emerald-600 shrink-0" />
              4. CNN Model & SMS Alerts
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Convolutional Neural Network (CNN) performs real-time image segmentation to classify pests and automatically broadcasts immediate SMS advisories.
            </p>
            <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Software: CNN Vision Model + GSM SMS
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: INTERACTIVE IOT SIMULATOR & LIVE DEMONSTRATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Smart Irrigation Controller (Water Wastage Solution) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-600" />
                Live Soil Moisture & Auto-Irrigation Simulator
              </h3>
              <p className="text-xs text-slate-500">
                Simulate soil dryness to see the AI auto-actuate valves only when needed.
              </p>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                isIrrigationActive
                  ? "bg-sky-500 text-white animate-pulse"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Valve: {isIrrigationActive ? "OPEN (Watering)" : "CLOSED (Saving)"}
            </span>
          </div>

          {/* Moisture Gauge */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">Simulated Soil Moisture Sensor Level:</span>
              <span
                className={`text-sm font-black px-2.5 py-0.5 rounded-lg ${
                  soilMoisture < 35
                    ? "bg-rose-100 text-rose-800"
                    : soilMoisture < 65
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-sky-100 text-sky-800"
                }`}
              >
                {soilMoisture}% ({soilMoisture < 35 ? "Dry Soil Threshold" : soilMoisture < 65 ? "Optimal Moisture" : "High Moisture"})
              </span>
            </div>

            <input
              type="range"
              min={10}
              max={90}
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span className="text-rose-600">10% (Critical Dry - AI Irrigation ON)</span>
              <span>35% (Threshold)</span>
              <span className="text-sky-600">90% (Saturated)</span>
            </div>
          </div>

          {/* Mode Switch & Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Operating Mode:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoAiMode(!isAutoAiMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                    isAutoAiMode
                      ? "bg-emerald-700 text-white shadow-2xs"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {isAutoAiMode ? "AI Auto-Pilot Active" : "Manual Override"}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
              <span className="text-[11px] font-bold text-sky-800 block">Water Conserved Today:</span>
              <span className="text-lg font-black text-sky-950 block">3,420 Liters</span>
              <span className="text-[10px] text-sky-700 font-semibold">40% vs conventional flood</span>
            </div>
          </div>

          {/* Decision Rule Box */}
          <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-700 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>AgriSmart Guard Logic:</strong> If soil moisture &lt; 35%, microcontroller triggers solenoid valve relay. When moisture reaches 55%, valve automatically shuts off to eliminate percolation losses.
            </span>
          </div>
        </div>

        {/* RIGHT: Leaf Micro-Camera & CNN Pest Detection */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                Micro-Camera & CNN Model Live Analysis
              </h3>
              <p className="text-xs text-slate-500">
                Automated optical inspection of crop leaves for early pest outbreaks.
              </p>
            </div>
            <button
              onClick={handleSimulatePestCheck}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Scan Leaf Now
            </button>
          </div>

          {/* Simulated CNN Camera Viewfinder */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-4 text-white min-h-[160px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                CAMERA_NODE_04 [OV2640]
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                CNN Inference: 18ms
              </span>
            </div>

            {/* Bounding box simulation */}
            <div className="my-3 p-3 rounded-xl bg-slate-900/80 border border-indigo-500/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-indigo-300 font-bold uppercase block tracking-wider">
                  Target Identified:
                </span>
                <span className="text-sm font-black text-white">{detectedPest}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">CNN Confidence:</span>
                <span className="text-sm font-extrabold text-emerald-400">{cnnConfidence}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Resolution: 1600x1200</span>
              <span>Status: {cameraScanStatus === "scanning" ? "Processing..." : "Active Monitoring"}</span>
            </div>
          </div>

          {/* SMS Dispatch Simulation Form */}
          <form onSubmit={handleSendTestSms} className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Farmer GSM / SMS Alert Dispatcher:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Smartphone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 Mobile number..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                {customSmsAlertSent ? "Alert Sent!" : "Send Test SMS"}
              </button>
            </div>
          </form>

          {/* Live SMS Feed */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Recent SMS Alerts Broadcasted:
            </span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {smsLog.map((log) => (
                <div
                  key={log.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                    log.type === "pest"
                      ? "bg-rose-50 border-rose-200 text-rose-950"
                      : "bg-sky-50 border-sky-200 text-sky-950"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-600" />
                  <div className="flex-1">
                    <span className="font-semibold">{log.message}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: COMPARATIVE IMPACT TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            Conventional Farming vs. AgriSmart Guard Impact Comparison
          </h2>
          <p className="text-xs text-slate-500">
            Measurable efficiency improvements across water, chemicals, and labor costs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-3 font-extrabold">Parameter</th>
                <th className="p-3 font-extrabold text-slate-600">Conventional Farming Method</th>
                <th className="p-3 font-extrabold text-emerald-800 bg-emerald-50">AgriSmart Guard (AI & IoT)</th>
                <th className="p-3 font-extrabold text-slate-800">Net Improvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="p-3 font-bold text-slate-900">Water Consumption</td>
                <td className="p-3 text-slate-600">Fixed timer or manual flood irrigation (high evaporation)</td>
                <td className="p-3 bg-emerald-50/50 font-bold text-emerald-900">Moisture-triggered micro-drip only</td>
                <td className="p-3 font-extrabold text-emerald-700">40% Water Saved</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Pest Detection Time</td>
                <td className="p-3 text-slate-600">Visual scouting after visible leaf yellowing or crop damage (Late)</td>
                <td className="p-3 bg-emerald-50/50 font-bold text-emerald-900">24/7 CNN leaf imaging + instant SMS</td>
                <td className="p-3 font-extrabold text-emerald-700">5–7 Days Early Warning</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Pesticide Usage</td>
                <td className="p-3 text-slate-600">Full-field blanket prophylactic chemical spray</td>
                <td className="p-3 bg-emerald-50/50 font-bold text-emerald-900">Localized spot treatment before spread</td>
                <td className="p-3 font-extrabold text-emerald-700">35–50% Chemical Reduction</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Power / Energy Cost</td>
                <td className="p-3 text-slate-600">Continuous tubewell pump running hours</td>
                <td className="p-3 bg-emerald-50/50 font-bold text-emerald-900">Solar powered sensors + timed pump bursts</td>
                <td className="p-3 font-extrabold text-emerald-700">Lower Electricity Bills</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

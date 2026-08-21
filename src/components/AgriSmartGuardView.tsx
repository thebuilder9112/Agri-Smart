import React, { useState, useEffect, useCallback } from "react";
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
  Activity,
  Printer,
  Smartphone,
  Check,
  RotateCcw,
  Upload,
  Clipboard,
  Info,
  ChevronRight,
  Gauge,
  Sliders,
  Flame,
} from "lucide-react";
import { useTranslation } from "../data/translations";

interface NodeData {
  id: string;
  name: string;
  hardware: string;
  crop: string;
  moisture: number;
  solarVoltage: number;
  batteryPercent: number;
  wifiRssi: number;
  valveOpen: boolean;
  status: "active" | "warning" | "watering";
}

interface AgriSmartGuardViewProps {
  language?: string;
}

export const AgriSmartGuardView: React.FC<AgriSmartGuardViewProps> = ({ language = "en" }) => {
  const { t } = useTranslation(language);
  // Active Node selector
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-1");
  const [nodes, setNodes] = useState<Record<string, NodeData>>({
    "node-1": {
      id: "node-1",
      name: "Sector A: North Orchard",
      hardware: "ESP32-S3 + Capacitive v1.2 + OV2640 Cam",
      crop: "Citrus & Apple",
      moisture: 28,
      solarVoltage: 14.4,
      batteryPercent: 92,
      wifiRssi: -64,
      valveOpen: true,
      status: "watering",
    },
    "node-2": {
      id: "node-2",
      name: "Sector B: South Wheat Field",
      hardware: "Raspberry Pi Zero 2W + FDR Probe + Pi Cam v2",
      crop: "Wheat (Kanak)",
      moisture: 58,
      solarVoltage: 13.8,
      batteryPercent: 86,
      wifiRssi: -72,
      valveOpen: false,
      status: "active",
    },
    "node-3": {
      id: "node-3",
      name: "Sector C: High-Tech Polyhouse",
      hardware: "ESP32 Gateway + Micro-Drip Solenoid",
      crop: "Cherry Tomatoes",
      moisture: 48,
      solarVoltage: 14.1,
      batteryPercent: 98,
      wifiRssi: -58,
      valveOpen: false,
      status: "active",
    },
  });

  const currentNode = nodes[selectedNodeId];

  // Auto AI vs Manual Mode
  const [isAutoAiMode, setIsAutoAiMode] = useState<boolean>(true);
  const [soilMoisture, setSoilMoisture] = useState<number>(28);
  const [isIrrigationActive, setIsIrrigationActive] = useState<boolean>(true);

  // Sync state when switching nodes
  useEffect(() => {
    setSoilMoisture(currentNode.moisture);
    setIsIrrigationActive(currentNode.valveOpen);
  }, [selectedNodeId]);

  // Automated irrigation actuation logic (< 35% trigger)
  useEffect(() => {
    if (isAutoAiMode) {
      if (soilMoisture < 35) {
        setIsIrrigationActive(true);
        setNodes((prev) => ({
          ...prev,
          [selectedNodeId]: { ...prev[selectedNodeId], moisture: soilMoisture, valveOpen: true, status: "watering" },
        }));
      } else {
        setIsIrrigationActive(false);
        setNodes((prev) => ({
          ...prev,
          [selectedNodeId]: { ...prev[selectedNodeId], moisture: soilMoisture, valveOpen: false, status: "active" },
        }));
      }
    }
  }, [soilMoisture, isAutoAiMode, selectedNodeId]);

  // Camera & CNN Pest Inspection
  const [cameraImage, setCameraImage] = useState<string>(
    "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80"
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [pestDetectionResult, setPestDetectionResult] = useState<{
    detected: boolean;
    name: string;
    stage: string;
    confidence: number;
    severity: "Low" | "Medium" | "High" | "Critical";
    remedy: string;
  }>({
    detected: true,
    name: "Aphid Cluster (Aphis gossypii)",
    stage: "Early Nymph Stage (Leaf Underside)",
    confidence: 96.4,
    severity: "Medium",
    remedy: "Targeted 0.5% Neem Oil spray on Sector A only; avoids whole-field chemical drift.",
  });

  // SMS Dispatch state
  const [phoneNumber, setPhoneNumber] = useState<string>("+91 98765 43210");
  const [smsLanguage, setSmsLanguage] = useState<string>("English");
  const [smsLog, setSmsLog] = useState<Array<{ id: number; time: string; message: string; type: "water" | "pest" }>>([
    {
      id: 1,
      time: "10:14 AM",
      message: "💧 AgriSmart Guard [Sector A]: Soil moisture reached 28%. Micro-drip solenoid valve opened automatically for 18 mins.",
      type: "water",
    },
    {
      id: 2,
      time: "08:42 AM",
      message: "⚠️ AgriSmart Alert [Sector A]: CNN Camera spotted Aphid nymph cluster (96.4% confidence). Spot-spray 0.5% Neem Oil immediately to avoid spread.",
      type: "pest",
    },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Economic ROI Calculator state
  const [farmAcres, setFarmAcres] = useState<number>(5);
  const [cropType, setCropType] = useState<string>("Wheat & Grain");

  // Show transient toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Quick Preset Actions
  const handleSetDrySoil = () => {
    setSoilMoisture(22);
    showToast("📉 Soil simulated as dry (22%). AI Solenoid Valve triggered OPEN!");
  };

  const handleSetOptimalSoil = () => {
    setSoilMoisture(58);
    showToast("💧 Soil simulated as optimal (58%). Valve closed to conserve water.");
  };

  // Toggle manual valve override
  const handleToggleManualValve = () => {
    setIsAutoAiMode(false);
    const newState = !isIrrigationActive;
    setIsIrrigationActive(newState);
    setNodes((prev) => ({
      ...prev,
      [selectedNodeId]: { ...prev[selectedNodeId], valveOpen: newState, status: newState ? "watering" : "active" },
    }));
    showToast(`Manual Override: Valve switched ${newState ? "OPEN" : "CLOSED"}`);
  };

  // Trigger CNN Scan Simulation
  const handleTriggerCnnScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const isPest = Math.random() > 0.25;
      if (isPest) {
        const pests = [
          {
            name: "Whitefly Colony (Bemisia tabaci)",
            stage: "Adult & Egg Cluster",
            confidence: 97.8,
            severity: "High" as const,
            remedy: "Yellow sticky traps + Pyriproxyfen 10% EC spot spray.",
          },
          {
            name: "Fall Armyworm Larva",
            stage: "Early 2nd Instar",
            confidence: 95.2,
            severity: "Critical" as const,
            remedy: "Targeted Bacillus thuringiensis (Bt) application within 24 hours.",
          },
          {
            name: "Aphid Cluster (Aphis gossypii)",
            stage: "Early Nymph Stage",
            confidence: 96.4,
            severity: "Medium" as const,
            remedy: "0.5% Cold-pressed Neem oil spray on affected plants only.",
          },
        ];
        const selected = pests[Math.floor(Math.random() * pests.length)];
        setPestDetectionResult({
          detected: true,
          ...selected,
        });

        // Push SMS
        const newSms = {
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          message: `⚠️ AgriSmart Alert [${currentNode.name}]: CNN camera detected ${selected.name} (${selected.confidence}%). Immediate remedy: ${selected.remedy}`,
          type: "pest" as const,
        };
        setSmsLog((prev) => [newSms, ...prev]);
        showToast("🚨 Pest identified by CNN Model! Real-time SMS dispatched.");
      } else {
        setPestDetectionResult({
          detected: false,
          name: "Healthy Foliage - No Pathogens",
          stage: "Normal Leaf Texture",
          confidence: 99.1,
          severity: "Low",
          remedy: "Canopy is clear. No pesticide intervention needed.",
        });
        showToast("✅ CNN Model Scan: Leaves are healthy and pest-free.");
      }
    }, 1100);
  };

  // Global Paste Handler for Testing Any Photo
  const handlePasteImage = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setCameraImage(reader.result as string);
            handleTriggerCnnScan();
            showToast("📋 Photo pasted! CNN Model is scanning for pests...");
          };
          reader.readAsDataURL(file);
          return;
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("paste", handlePasteImage);
    return () => window.removeEventListener("paste", handlePasteImage);
  }, [handlePasteImage]);

  // Send Test SMS
  const handleSendCustomSms = (e: React.FormEvent) => {
    e.preventDefault();
    const newSms = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      message: `🔔 AgriSmart Guard Status sent to ${phoneNumber}: ${currentNode.name} soil moisture at ${soilMoisture}%. Irrigation ${
        isIrrigationActive ? "ACTIVE" : "STANDBY"
      }. Total water savings: 40%.`,
      type: "water" as const,
    };
    setSmsLog((prev) => [newSms, ...prev]);
    showToast(`📱 SMS alert sent to ${phoneNumber}!`);
  };

  // Calculations for ROI
  const calculatedWaterSavedLiters = farmAcres * 125000 * 0.4;
  const calculatedElectricitySavedKwh = farmAcres * 450 * 0.4;
  const calculatedPesticideCostSaved = farmAcres * 2400 * 0.38;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white border border-emerald-500 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: CHALLENGE IDENTITY */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Page 3: Step 3 – Innovation Design Challenge
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
              AgriSmart Guard
              <span className="text-xs font-extrabold bg-sky-100 text-sky-800 border border-sky-300 px-2.5 py-0.5 rounded-full">
                Smart Irrigation & Pest Monitoring
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              <strong>Problem Chosen:</strong> Excessive water wastage paired with late pest outbreak detection.
              <br />
              <strong>How It Works:</strong> Solar-powered sensors track soil moisture while micro-cameras monitor crop leaves. The A.I. turns on irrigation only when dry soil is detected and alerts farmers to pests via SMS.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Print Challenge Brief
            </button>
          </div>
        </div>
      </div>

      {/* 3 HIGHLIGHT METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Water Savings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              40% Water Savings
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">40% Agricultural Water Saved</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Eliminates over-watering by triggering valves <strong>only when moisture falls below 35%</strong>.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Per 5-Acre Farm:</span>
            <strong className="text-sky-700 font-bold">~250,000 Liters / Season</strong>
          </div>
        </div>

        {/* Metric 2: Early Detection */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              5–7 Days Earlier
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Early Pest Outbreak Detection</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Micro-cameras and CNN models identify egg clusters and nymphs <strong>before visible damage spreads</strong>.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Crop Loss Prevented:</span>
            <strong className="text-emerald-700 font-bold">Up to 85% Yield Saved</strong>
          </div>
        </div>

        {/* Metric 3: Cost Efficiency */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              High Cost Savings
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Reduced Pesticide & Power Cost</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Replaces blind blanket spraying with spot treatment, and reduces tubewell electricity running hours.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Chemical Reduction:</span>
            <strong className="text-amber-700 font-bold">35–50% Less Pesticide</strong>
          </div>
        </div>
      </div>

      {/* SENSOR NODE SELECTOR BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Connected IoT Field Nodes:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(Object.values(nodes) as NodeData[]).map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedNodeId === node.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    node.valveOpen ? "bg-sky-400 animate-ping" : "bg-emerald-400"
                  }`}
                />
                <span>{node.name}</span>
                <span className="text-[10px] text-slate-400">({node.moisture}%)</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN INTERACTIVE CONSOLE: 2 COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: SMART IRRIGATION CONTROLLER */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-600" />
                Soil Moisture & Solenoid Valve Actuator
              </h3>
              <p className="text-xs text-slate-500">
                Hardware: {currentNode.hardware.split("+")[0]} + Capacitive Soil Sensor
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                isIrrigationActive
                  ? "bg-sky-600 text-white animate-pulse"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Solenoid: {isIrrigationActive ? "VALVE OPEN (Irrigating)" : "VALVE CLOSED"}
            </span>
          </div>

          {/* Moisture Gauge & Interactive Slider */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">Real-Time Soil Moisture Level:</span>
              <span
                className={`text-sm font-black px-2.5 py-0.5 rounded-lg ${
                  soilMoisture < 35
                    ? "bg-rose-100 text-rose-800"
                    : soilMoisture < 65
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-sky-100 text-sky-800"
                }`}
              >
                {soilMoisture}% ({soilMoisture < 35 ? "Dry Soil Threshold (AI ON)" : "Optimal Moisture"})
              </span>
            </div>

            <input
              type="range"
              min={10}
              max={85}
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span className="text-rose-600 font-extrabold">10% (Critical Dry)</span>
              <span className="text-slate-600">35% (AI Auto-Trigger Threshold)</span>
              <span className="text-emerald-600 font-extrabold">65% (Optimal)</span>
            </div>

            {/* Quick Test Presets */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleSetDrySoil}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
              >
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                Simulate Dry Soil (22%)
              </button>
              <button
                onClick={handleSetOptimalSoil}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
              >
                <Droplets className="w-3.5 h-3.5 text-emerald-600" />
                Simulate Optimal Soil (58%)
              </button>
            </div>
          </div>

          {/* Mode Switch & IoT Telemetry Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block">Valve Control Logic:</span>
              <button
                onClick={() => setIsAutoAiMode(!isAutoAiMode)}
                className={`w-full py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                  isAutoAiMode
                    ? "bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                }`}
              >
                {isAutoAiMode ? "✓ AI Mode (Auto-Dry Trigger)" : "Manual Override Mode"}
              </button>
              {!isAutoAiMode && (
                <button
                  onClick={handleToggleManualValve}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    isIrrigationActive ? "bg-rose-600 text-white" : "bg-sky-600 text-white"
                  }`}
                >
                  {isIrrigationActive ? "Force Close Valve" : "Force Open Valve"}
                </button>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 space-y-1.5">
              <span className="text-[11px] font-bold text-sky-800 block">Solar Power & Battery:</span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Solar Output:</span>
                <strong className="text-sky-950 font-bold">{currentNode.solarVoltage}V (Active)</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Battery Level:</span>
                <strong className="text-emerald-700 font-bold">{currentNode.batteryPercent}% (LiFePO4)</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Wi-Fi Signal:</span>
                <strong className="text-slate-700 font-mono text-[11px]">{currentNode.wifiRssi} dBm</strong>
              </div>
            </div>
          </div>

          {/* Operational Rule Statement */}
          <div className="p-3.5 rounded-xl bg-slate-100 text-xs text-slate-700 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>AgriSmart Guard Principle:</strong> By irrigating <em>only</em> when soil moisture is below the crop threshold (&lt;35%), percolation runoff and evaporation losses are completely stopped, delivering the <strong>40% water savings</strong>.
            </span>
          </div>
        </div>

        {/* RIGHT: MICRO-CAMERA & CNN PEST MONITOR */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                Micro-Camera Module & CNN Model Inference
              </h3>
              <p className="text-xs text-slate-500">
                Hardware: Mini Camera Module (OV2640) + Edge CNN Model
              </p>
            </div>
            <button
              onClick={handleTriggerCnnScan}
              disabled={isScanning}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
              {isScanning ? "Scanning..." : "Rescan Leaf"}
            </button>
          </div>

          {/* CNN Viewfinder Display */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-4 text-white min-h-[170px] flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                OPTICAL_FEED: {currentNode.name}
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                CNN Model: ResNet-18 Quantized (Edge)
              </span>
            </div>

            {/* Simulated CNN Bounding Box */}
            <div className="my-2 p-3 rounded-xl bg-slate-900/90 border border-indigo-500/60 flex items-center justify-between backdrop-blur-xs">
              <div>
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">
                  CNN Detection Result:
                </span>
                <span className="text-sm font-black text-white">{pestDetectionResult.name}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{pestDetectionResult.stage}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">Model Confidence:</span>
                <span className="text-sm font-extrabold text-emerald-400">{pestDetectionResult.confidence}%</span>
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                    pestDetectionResult.severity === "Critical" || pestDetectionResult.severity === "High"
                      ? "bg-rose-500/20 text-rose-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  Risk: {pestDetectionResult.severity}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-indigo-200 bg-indigo-950/60 p-2 rounded-lg border border-indigo-800/50">
              <strong>Early Action:</strong> {pestDetectionResult.remedy}
            </div>
          </div>

          {/* Paste Photo Tip */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clipboard className="w-3.5 h-3.5 text-emerald-600" />
              <strong>Tip:</strong> Press <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 text-[10px]">Ctrl + V</kbd> to paste any photo into the CNN scanner.
            </span>
          </div>

          {/* SMS Notification Simulation */}
          <form onSubmit={handleSendCustomSms} className="space-y-3 pt-2 border-t border-slate-100">
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
                Send SMS Alert
              </button>
            </div>
          </form>

          {/* Live SMS Feed */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Recent SMS Notifications Broadcasted to Farmer:
            </span>
            <div className="space-y-1.5 max-h-28 overflow-y-auto">
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

      {/* ECONOMIC & WATER SAVINGS CALCULATOR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            Interactive Farm Savings Calculator (Based on 40% Water Reduction)
          </h2>
          <p className="text-xs text-slate-500">
            Adjust farm size to see exact seasonal water volume conserved and pesticide cost reductions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Farm Size (Acres):</label>
            <input
              type="number"
              min={1}
              max={100}
              value={farmAcres}
              onChange={(e) => setFarmAcres(Math.max(1, Number(e.target.value)))}
              className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
            <span className="text-[11px] font-bold text-sky-800 block">Water Conserved:</span>
            <strong className="text-lg font-black text-sky-950 block">
              {calculatedWaterSavedLiters.toLocaleString()} Liters
            </strong>
            <span className="text-[10px] text-sky-700">40% lower agricultural consumption</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
            <span className="text-[11px] font-bold text-amber-800 block">Electricity / Pump Energy Saved:</span>
            <strong className="text-lg font-black text-amber-950 block">
              {calculatedElectricitySavedKwh.toLocaleString()} kWh
            </strong>
            <span className="text-[10px] text-amber-700">Tubewell pump run-time cut by 40%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 block">Pesticide Cost Saved:</span>
            <strong className="text-lg font-black text-emerald-950 block">
              ₹{calculatedPesticideCostSaved.toLocaleString()}
            </strong>
            <span className="text-[10px] text-emerald-700">Targeted spot spray vs blanket spray</span>
          </div>
        </div>
      </div>
    </div>
  );
};

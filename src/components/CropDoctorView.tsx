import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Loader2,
  Shield,
  Leaf,
  Scan,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  Sprout,
  Check,
  Stethoscope,
  Info,
  Clipboard,
  ClipboardCheck,
  Zap,
  ZoomIn,
  ZoomOut,
  Calculator,
  ShieldAlert,
  Clock,
  ArrowRight,
  Droplets,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { CropDiagnosisResult } from "../types/agriculture";
import { SAMPLE_DISEASE_CASES } from "../data/mockData";
import { useTranslation } from "../data/translations";

const COMMON_SYMPTOM_TAGS = [
  "Yellow spots / Chlorosis",
  "Concentric brown rings",
  "Rust / Orange pustules",
  "White powdery mold",
  "Upward leaf curling",
  "Wilting & Stem browning",
  "Sucking bugs / Whiteflies",
  "Caterpillar holes",
  "Water-soaked lesions",
  "Healthy green foliage",
];

// Fast in-browser image compressor to reduce 10MB phone images to ~250KB in 20ms
async function compressImageForFastInference(file: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 1280;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to quality 0.85 JPEG
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          resolve(dataUrl);
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

interface CropDoctorViewProps {
  language?: string;
}

export const CropDoctorView: React.FC<CropDoctorViewProps> = ({ language = "en" }) => {
  const { t } = useTranslation(language);
  const [selectedCrop, setSelectedCrop] = useState<string>("Auto-Detect from Photo");
  const [customCropName, setCustomCropName] = useState<string>("");
  const [symptomsInput, setSymptomsInput] = useState<string>("");
  const [selectedSymptomTags, setSelectedSymptomTags] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<CropDiagnosisResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "chemical" | "organic" | "tank-calculator" | "safety"
  >("overview");

  // Magnifier & Inspection state
  const [isZoomed, setIsZoomed] = useState(false);

  // Tank Dosage Calculator state
  const [sprayerType, setSprayerType] = useState<"15L-knapsack" | "25L-battery" | "200L-tractor" | "custom">("15L-knapsack");
  const [customSprayerLiters, setCustomSprayerLiters] = useState<number>(15);

  // Paste & Drag-drop feedback
  const [isDragging, setIsDragging] = useState(false);
  const [pasteToast, setPasteToast] = useState<string | null>(null);
  const [autoDiagnoseOnPaste, setAutoDiagnoseOnPaste] = useState<boolean>(true);

  // Live Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show transient toast
  const showToast = (message: string) => {
    setPasteToast(message);
    setTimeout(() => {
      setPasteToast(null);
    }, 3500);
  };

  // Toggle symptom tag
  const toggleSymptomTag = (tag: string) => {
    if (selectedSymptomTags.includes(tag)) {
      setSelectedSymptomTags(selectedSymptomTags.filter((t) => t !== tag));
    } else {
      setSelectedSymptomTags([...selectedSymptomTags, tag]);
    }
  };

  // Perform Fast AI Diagnosis
  const handleDiagnose = useCallback(
    async (imageToDiagnose?: string) => {
      const targetImage = imageToDiagnose || previewImage;
      const combinedSymptoms = [
        ...selectedSymptomTags,
        symptomsInput.trim(),
      ]
        .filter(Boolean)
        .join(", ");

      if (!targetImage && !combinedSymptoms) return;

      setIsAnalyzing(true);
      setDiagnosis(null);
      try {
        const effectiveCrop =
          selectedCrop === "Other / Custom Plant"
            ? customCropName
            : selectedCrop === "Auto-Detect from Photo"
            ? undefined
            : selectedCrop;

        const payload: any = {
          cropName: effectiveCrop,
          symptoms: combinedSymptoms || "Detailed phytopathological diagnostic requested on the provided photo",
        };

        if (targetImage && targetImage.startsWith("data:image")) {
          payload.imageBase64 = targetImage;
          const mime = targetImage.split(";")[0].split(":")[1] || "image/jpeg";
          payload.mimeType = mime;
        }

        const response = await fetch("/api/gemini/diagnose-crop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data: CropDiagnosisResult = await response.json();
        setDiagnosis({
          ...data,
          dateAnalyzed: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          imageUrl: targetImage || undefined,
        });
      } catch (err) {
        console.error("Diagnosis error:", err);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [previewImage, symptomsInput, selectedSymptomTags, selectedCrop, customCropName]
  );

  // Handle incoming image file or data
  const processImageFile = useCallback(
    async (file: File | Blob, source: "paste" | "drop" | "upload" = "upload") => {
      if (file.type && !file.type.startsWith("image/")) {
        showToast("⚠️ Please paste or upload a valid image file.");
        return;
      }

      try {
        // Fast client-side compression (<30ms) for high speed
        const compressedDataUrl = await compressImageForFastInference(file);
        setPreviewImage(compressedDataUrl);
        setDiagnosis(null);
        stopCamera();

        if (source === "paste") {
          showToast("📋 Photo pasted & compressed instantly!");
        } else if (source === "drop") {
          showToast("📥 Photo dropped & compressed!");
        }

        if (autoDiagnoseOnPaste) {
          handleDiagnose(compressedDataUrl);
        }
      } catch (e) {
        console.error("Image processing error:", e);
      }
    },
    [autoDiagnoseOnPaste, handleDiagnose]
  );

  // Global Clipboard Paste Listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            processImageFile(file, "paste");
            return;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [processImageFile]);

  // Handle clipboard button click
  const handlePasteFromClipboardButton = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imageType = item.types.find((type) => type.startsWith("image/"));
          if (imageType) {
            const blob = await item.getType(imageType);
            processImageFile(blob, "paste");
            return;
          }
        }
      }
      showToast("👉 Tip: Press Ctrl + V (or ⌘ + V) on your keyboard to paste!");
    } catch (err) {
      console.warn("Clipboard access:", err);
      showToast("👉 Press Ctrl + V (or ⌘ + V) on your keyboard to paste your photo!");
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processImageFile(file, "drop");
    }
  };

  // Camera Management
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setCameraError("Could not access camera. Please check browser permissions or paste an image.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setPreviewImage(dataUrl);
      stopCamera();
      setDiagnosis(null);
      if (autoDiagnoseOnPaste) {
        handleDiagnose(dataUrl);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, "upload");
    }
  };

  const handleSelectSampleCase = (sample: (typeof SAMPLE_DISEASE_CASES)[0]) => {
    stopCamera();
    setSelectedCrop(sample.crop);
    setSymptomsInput(sample.symptoms);
    setPreviewImage(sample.image);
    setDiagnosis(null);
    if (autoDiagnoseOnPaste) {
      handleDiagnose(sample.image);
    }
  };

  const handleTextToSpeech = () => {
    if (!("speechSynthesis" in window) || !diagnosis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speechText = diagnosis.hindiSummary
      ? `AgriVision Plant Doctor: ${diagnosis.hindiSummary} Chemical treatment: ${diagnosis.chemicalTreatment?.[0] || ""}`
      : `Crop Disease Doctor Diagnosis for ${diagnosis.plantIdentified || "Plant"}. Diagnosis: ${
          diagnosis.diagnosisName
        }. Severity: ${diagnosis.severity}. Immediate emergency action: ${
          diagnosis.immediateAction
        }. Recommended medicine: ${diagnosis.chemicalTreatment?.[0] || diagnosis.organicTreatment?.[0] || ""}.`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrintPrescription = () => {
    window.print();
  };

  // Sprayer Volume
  const activeTankLiters =
    sprayerType === "15L-knapsack"
      ? 15
      : sprayerType === "25L-battery"
      ? 25
      : sprayerType === "200L-tractor"
      ? 200
      : customSprayerLiters;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Toast Notification */}
      {pasteToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-white border border-emerald-500/50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-top-4 duration-200">
          <ClipboardCheck className="w-4 h-4 text-emerald-400" />
          <span>{pasteToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              Ultra-Fast Phytopathology AI Engine • Accuracy & Decision Support
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
              High-Precision Leaf & Crop Disease Doctor
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              <strong>Paste (Ctrl + V) or upload any plant photo</strong>. The AI instantly distinguishes fungal, bacterial, viral, nutrient deficiency, and pest attacks, delivering exact commercial chemical formulations, organic cures, and spray tank dosages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {diagnosis && (
              <>
                <button
                  onClick={handleTextToSpeech}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4 text-emerald-700" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
                  <span>{isSpeaking ? "Stop Voice" : "Voice Rx (हिन्दी/EN)"}</span>
                </button>
                <button
                  onClick={handlePrintPrescription}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  Print Prescription Rx
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Upload Area & Diagnosis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Image Input, Live Camera & Symptom Picker */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Clipboard className="w-4 h-4 text-emerald-600" />
                Step 1: Paste, Snap or Select Photo
              </h2>
              {previewImage && (
                <button
                  onClick={() => {
                    setPreviewImage(null);
                    setDiagnosis(null);
                    stopCamera();
                  }}
                  className="text-xs text-slate-400 hover:text-rose-600 font-semibold cursor-pointer"
                >
                  Clear Photo ✕
                </button>
              )}
            </div>

            {/* Quick Paste & Auto-Diagnose Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold text-slate-800 text-[11px]">Instant Auto-Diagnose on Paste</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoDiagnoseOnPaste}
                  onChange={(e) => setAutoDiagnoseOnPaste(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Camera View or Upload/Paste Box */}
            {isCameraActive ? (
              <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-emerald-500 shadow-inner">
                <video ref={videoRef} playsInline autoPlay className="w-full h-64 object-cover" />
                <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-3 px-4">
                  <button
                    onClick={capturePhoto}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    Snap Photo Now
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-full text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : previewImage ? (
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center border border-slate-200 group">
                <div className="relative w-full max-h-72 overflow-hidden flex items-center justify-center">
                  <img
                    src={previewImage}
                    alt="Uploaded plant sample"
                    className={`max-h-72 w-full object-contain transition-transform duration-200 ${
                      isZoomed ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />
                </div>

                <div className="w-full bg-slate-900/95 px-3 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <button
                      onClick={() => setIsZoomed(!isZoomed)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1 cursor-pointer font-bold text-emerald-400"
                    >
                      {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                      {isZoomed ? "Reset Zoom" : "Inspect Zoom"}
                    </button>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                  >
                    Change Picture
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Dedicated Interactive Paste & Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-emerald-500 bg-emerald-50 scale-[1.01]"
                      : "border-emerald-300/80 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-500"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <Clipboard className="w-7 h-7" />
                  </div>

                  <div className="text-sm font-black text-slate-900 mt-3">
                    Paste Any Photo Here <span className="text-emerald-700 font-extrabold">(Ctrl + V)</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto font-medium">
                    Copy an image from WhatsApp/Google or take a screenshot, then just press <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-slate-300 rounded shadow-2xs">Ctrl + V</kbd> (or <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-slate-300 rounded shadow-2xs">⌘ + V</kbd>).
                  </p>

                  <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                    <span>Or Drag & Drop</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold hover:underline">Click to Browse</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePasteFromClipboardButton}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Clipboard className="w-4 h-4 text-emerald-400" />
                    <span>Paste Clipboard</span>
                  </button>

                  <button
                    onClick={startCamera}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Snap Camera</span>
                  </button>
                </div>

                {cameraError && (
                  <p className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200 font-medium">
                    {cameraError}
                  </p>
                )}
              </div>
            )}

            {/* Quick Symptom Chips (Multi-select) */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Quick Visible Symptoms (Click to Tag):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SYMPTOM_TAGS.map((tag) => {
                  const isSelected = selectedSymptomTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleSymptomTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-700 text-white shadow-2xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 8 Preset Sample Cases */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Or Test with Verified Clinical Pathology Samples:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_DISEASE_CASES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSampleCase(sample)}
                    className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-400 text-left transition-all flex items-center gap-2 cursor-pointer group"
                  >
                    <img
                      src={sample.image}
                      alt={sample.title}
                      className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200 group-hover:scale-105 transition-transform"
                    />
                    <div className="overflow-hidden">
                      <div className="text-[11px] font-extrabold text-slate-900 truncate">{sample.crop}</div>
                      <div className="text-[10px] text-slate-500 truncate">{sample.title.split("(")[0]}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Plant Type Selector */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Plant / Crop Species:</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    Auto-detection active
                  </span>
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Auto-Detect from Photo">✨ Auto-Detect Any Plant Species from Photo</option>
                  <option value="Wheat">Wheat (Kanak / Gehu)</option>
                  <option value="Tomato">Tomato (Tamatar)</option>
                  <option value="Rice / Paddy">Rice / Paddy (Dhan)</option>
                  <option value="Cotton">Cotton (Kapas / Narma)</option>
                  <option value="Mustard">Mustard / Rapeseed (Sarson)</option>
                  <option value="Chilli / Pepper">Chilli / Pepper (Mirchi)</option>
                  <option value="Corn / Maize">Corn / Maize (Makka)</option>
                  <option value="Potato">Potato (Aloo)</option>
                  <option value="Citrus / Lemon">Citrus / Lemon (Nimbu)</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Sugarcane">Sugarcane (Ganna)</option>
                  <option value="Apple">Apple / Fruit Orchard</option>
                  <option value="Other / Custom Plant">Other / Custom Plant...</option>
                </select>

                {selectedCrop === "Other / Custom Plant" && (
                  <input
                    type="text"
                    value={customCropName}
                    onChange={(e) => setCustomCropName(e.target.value)}
                    placeholder="Enter plant name e.g. 'Mango', 'Spinach', 'Groundnut'..."
                    className="w-full mt-2 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Notes / Field Context (Optional):
                </label>
                <textarea
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  rows={2}
                  placeholder="e.g. Started 3 days ago after humid rain, lower leaves affected first, whiteflies seen..."
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Run Diagnosis Button */}
            <button
              onClick={() => handleDiagnose()}
              disabled={isAnalyzing || (!previewImage && !symptomsInput.trim() && selectedSymptomTags.length === 0)}
              className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.98]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                  Running Neural Pathology Vision Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  Diagnose Leaf Photo & Get Prescription Rx
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Prescription & Clinical Diagnosis Panel */}
        <div className="lg:col-span-7">
          {diagnosis ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5 animate-in fade-in duration-300">
              {/* Header Badge & Identified Plant */}
              <div className="border-b border-slate-200 pb-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase flex items-center gap-1.5 ${
                        diagnosis.isHealthy || diagnosis.severity === "Healthy"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : diagnosis.severity === "Critical" || diagnosis.severity === "Severe"
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {diagnosis.isHealthy ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                      )}
                      Severity: {diagnosis.severity}
                    </span>

                    {diagnosis.urgencyLevel && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-rose-600" />
                        {diagnosis.urgencyLevel}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1.5 border border-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Accuracy Confidence: <strong>{diagnosis.confidenceScore}%</strong>
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {diagnosis.diagnosisName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 mt-1 font-medium">
                    <span className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      {diagnosis.plantIdentified || diagnosis.cropName || "Plant Species"}
                    </span>
                    {diagnosis.botanicalName && (
                      <span className="italic text-slate-500 font-serif">({diagnosis.botanicalName})</span>
                    )}
                    <span>•</span>
                    <span className="font-semibold text-slate-700">
                      Category: {diagnosis.plantHealthCategory || "Pathological"}
                    </span>
                  </div>

                  {/* Hindi Summary for Indian Farmers */}
                  {diagnosis.hindiSummary && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-950 flex items-start gap-2">
                      <span className="text-[10px] font-black uppercase bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded shrink-0">
                        किसान हिन्दी सलाह
                      </span>
                      <span>{diagnosis.hindiSummary}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Tabs for Deep Clinical Breakdown */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🔍 Symptoms & Pathogen
                </button>
                <button
                  onClick={() => setActiveTab("chemical")}
                  className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "chemical"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  💊 Chemical Formulations & Doses
                </button>
                <button
                  onClick={() => setActiveTab("organic")}
                  className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "organic"
                      ? "bg-white text-emerald-800 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🌿 Organic & Bio-Controls
                </button>
                <button
                  onClick={() => setActiveTab("tank-calculator")}
                  className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "tank-calculator"
                      ? "bg-white text-sky-800 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🛢️ Sprayer Tank Mixer
                </button>
                <button
                  onClick={() => setActiveTab("safety")}
                  className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "safety"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🛡️ Safety & Prevention
                </button>
              </div>

              {/* TAB 1: OVERVIEW & PATHOLOGY CLUES */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* Immediate Emergency Action */}
                  <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 sm:p-5 space-y-2">
                    <div className="flex items-center gap-2 text-rose-900 text-xs font-extrabold uppercase">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Emergency First-Aid Action (Next 24–48 Hours):
                    </div>
                    <p className="text-xs sm:text-sm text-rose-950 font-semibold leading-relaxed">
                      {diagnosis.immediateAction}
                    </p>
                  </div>

                  {/* Primary Cause & Underlying Biology */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-slate-600" />
                        Underlying Causal Agent:
                      </span>
                      {diagnosis.pathogenTaxonomy && (
                        <span className="italic font-mono font-bold text-emerald-800 text-[11px]">
                          {diagnosis.pathogenTaxonomy}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">{diagnosis.primaryCause}</p>

                    {diagnosis.environmentalTrigger && (
                      <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900">
                        <strong className="block text-[11px] text-amber-950 font-bold mb-0.5">
                          Environmental / Weather Trigger:
                        </strong>
                        {diagnosis.environmentalTrigger}
                      </div>
                    )}

                    {diagnosis.affectedParts?.length > 0 && (
                      <div className="pt-1 text-[11px] text-slate-500">
                        Affected Plant Anatomy: <strong>{diagnosis.affectedParts.join(", ")}</strong>
                      </div>
                    )}
                  </div>

                  {/* Visual Clues Spotted in the Photo */}
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-emerald-600" />
                      Visual Clues Spotted in Your Photo:
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {diagnosis.visualFindings.map((finding, idx) => (
                        <li key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                          <span className="font-medium">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Differential Diagnosis */}
                  {diagnosis.differentialDiagnosis && diagnosis.differentialDiagnosis.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-700 block mb-1">
                        Differential Diagnosis (Similar looking diseases ruled out):
                      </span>
                      <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                        {diagnosis.differentialDiagnosis.map((diff, i) => (
                          <li key={i}>{diff}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CHEMICAL MEDICINES & STRUCTURED FORMULATIONS */}
              {activeTab === "chemical" && (
                <div className="space-y-4">
                  {/* Detailed Formulations Table if available */}
                  {diagnosis.chemicalFormulations && diagnosis.chemicalFormulations.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-indigo-600" />
                        Exact Commercial Formulations & Dilutions:
                      </h3>
                      <div className="space-y-3">
                        {diagnosis.chemicalFormulations.map((item, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                            <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-200 pb-2">
                              <span className="font-black text-slate-900 text-sm">
                                {item.activeIngredient}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-bold text-[11px] border border-indigo-200">
                                Trade Names: {item.commercialExample}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                              <div className="p-2 rounded-lg bg-white border border-slate-200">
                                <span className="text-slate-500 font-bold block">Dilution per Litre:</span>
                                <span className="font-extrabold text-emerald-800">{item.dilutionPerLiter}</span>
                              </div>
                              <div className="p-2 rounded-lg bg-white border border-slate-200">
                                <span className="text-slate-500 font-bold block">Dosage per Acre:</span>
                                <span className="font-extrabold text-slate-900">{item.dosePerAcre}</span>
                              </div>
                              <div className="p-2 rounded-lg bg-white border border-slate-200">
                                <span className="text-slate-500 font-bold block">Pre-Harvest Interval (PHI):</span>
                                <span className="font-extrabold text-rose-700">{item.phiDays || "3-7 Days"}</span>
                              </div>
                            </div>

                            {item.modeOfAction && (
                              <p className="text-[11px] text-slate-600 font-medium">
                                <strong>Mode of Action:</strong> {item.modeOfAction}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                      <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-slate-700" />
                        Commercial Agricultural Medicines & Dosage:
                      </h3>
                      <ul className="space-y-2.5 text-xs text-slate-800">
                        {diagnosis.chemicalTreatment.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-700 mt-1 shrink-0" />
                            <span className="font-semibold text-slate-900">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {diagnosis.dosageInstructions && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                      <strong>Sprayer Nozzle & Timing Caution:</strong> {diagnosis.dosageInstructions}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ORGANIC & BIO-CONTROL REMEDIES */}
              {activeTab === "organic" && (
                <div className="space-y-4">
                  <div className="bg-emerald-50/90 rounded-2xl border border-emerald-200 p-5 space-y-3">
                    <h3 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      Zero-Residue Bio-Controls & Organic Recipes:
                    </h3>
                    <p className="text-xs text-emerald-900 font-medium">
                      Non-toxic, bee-safe, eco-friendly biological fungicides and botanical repellents:
                    </p>
                    <ul className="space-y-2.5 text-xs text-emerald-950">
                      {diagnosis.organicTreatment.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white/90 p-3 rounded-xl border border-emerald-200 shadow-2xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-semibold">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 4: SPRAY TANK MIXING CALCULATOR */}
              {activeTab === "tank-calculator" && (
                <div className="bg-sky-50/80 rounded-2xl border border-sky-200 p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-sky-200 pb-3">
                    <h3 className="text-sm font-extrabold text-sky-950 flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-sky-700" />
                      Sprayer Tank Mixing & Dose Calculator
                    </h3>
                    <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                      Tank Capacity: {activeTankLiters} Litres
                    </span>
                  </div>

                  {/* Sprayer Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "15L-knapsack", label: "15L Knapsack", liters: 15 },
                      { id: "25L-battery", label: "25L Battery", liters: 25 },
                      { id: "200L-tractor", label: "200L Tractor Drum", liters: 200 },
                      { id: "custom", label: "Custom Liters", liters: customSprayerLiters },
                    ].map((sp) => (
                      <button
                        key={sp.id}
                        onClick={() => setSprayerType(sp.id as any)}
                        className={`p-2.5 rounded-xl font-bold text-center transition-all cursor-pointer ${
                          sprayerType === sp.id
                            ? "bg-sky-700 text-white shadow-2xs"
                            : "bg-white text-slate-700 border border-sky-200 hover:bg-sky-100/60"
                        }`}
                      >
                        <span className="block">{sp.label}</span>
                      </button>
                    ))}
                  </div>

                  {sprayerType === "custom" && (
                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-700">Enter Water Tank Liters:</label>
                      <input
                        type="number"
                        min="1"
                        max="2000"
                        value={customSprayerLiters}
                        onChange={(e) => setCustomSprayerLiters(Number(e.target.value) || 15)}
                        className="w-24 px-2 py-1 bg-white border border-sky-300 rounded-lg text-xs font-bold"
                      />
                    </div>
                  )}

                  {/* Exact Calculated Mixing Recipe */}
                  <div className="bg-white p-4 rounded-xl border border-sky-200 space-y-3">
                    <h4 className="font-black text-sky-950 uppercase text-[11px] tracking-wider">
                      Mixing Recipe for {activeTankLiters}L Water Tank:
                    </h4>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="font-semibold text-slate-800">1. Fresh Clean Water:</span>
                        <strong className="text-sky-800">{activeTankLiters} Liters</strong>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="font-semibold text-slate-800">
                          2. Primary Medicine (e.g. Systemic Fungicide @ ~1ml/L):
                        </span>
                        <strong className="text-emerald-800">{activeTankLiters * 1} ml (or grams)</strong>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="font-semibold text-slate-800">
                          3. If using Contact Powder (e.g. Mancozeb @ 2.5g/L):
                        </span>
                        <strong className="text-slate-900">{activeTankLiters * 2.5} grams</strong>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="font-semibold text-slate-800">
                          4. If using Neem Oil (10,000 ppm @ 4ml/L):
                        </span>
                        <strong className="text-emerald-900">{activeTankLiters * 4} ml + {Math.round(activeTankLiters * 0.5)} ml soap spreader</strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium">
                      💡 <strong>Pro Tip:</strong> Dissolve wettable powders (WP) in a small bucket of water first before pouring into the full sprayer tank to prevent nozzle clogging.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 5: SAFETY PRECAUTIONS & PRE-HARVEST INTERVAL */}
              {activeTab === "safety" && (
                <div className="space-y-4 text-xs">
                  {/* Safety Alert */}
                  {diagnosis.safetyPrecaution && (
                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-1 text-rose-950">
                      <span className="font-extrabold flex items-center gap-1.5 text-rose-900">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        Applicator Safety & PPE Requirement:
                      </span>
                      <p className="font-medium leading-relaxed">{diagnosis.safetyPrecaution}</p>
                    </div>
                  )}

                  {/* Resistance Management */}
                  {diagnosis.resistanceManagement && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-1 text-amber-950">
                      <span className="font-extrabold flex items-center gap-1.5 text-amber-900">
                        <Shield className="w-4 h-4 text-amber-700" />
                        Fungicide Resistance Avoidance Protocol:
                      </span>
                      <p className="font-medium leading-relaxed">{diagnosis.resistanceManagement}</p>
                    </div>
                  )}

                  {/* Long-term prevention */}
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
                    <span className="font-extrabold text-slate-900 block">
                      Agronomic Field Sanitation for Next Season:
                    </span>
                    <ul className="space-y-2 text-slate-700">
                      {diagnosis.preventionStrategy.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Yield Impact Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Estimated Harvest Protection:</span>
                  <span className="text-emerald-800 font-bold">{diagnosis.impactOnYieldEstimate}</span>
                </div>
                <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Diagnosed On:</span>
                  <span className="font-bold text-slate-800">{diagnosis.dateAnalyzed || "Today"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[420px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3.5 shadow-inner">
                <Scan className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Paste Any Plant Photo to Start</h3>
              <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
                Simply press <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-slate-300 rounded shadow-2xs">Ctrl + V</kbd> or <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-slate-300 rounded shadow-2xs">⌘ + V</kbd> to paste any photo directly from your clipboard. The AI doctor will identify the disease, fungus, or pest and give you instant medicine doses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

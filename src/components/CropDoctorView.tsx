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
} from "lucide-react";
import { CropDiagnosisResult } from "../types/agriculture";
import { SAMPLE_DISEASE_CASES } from "../data/mockData";

export const CropDoctorView: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>("Auto-Detect from Photo");
  const [customCropName, setCustomCropName] = useState<string>("");
  const [symptomsInput, setSymptomsInput] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<CropDiagnosisResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "organic" | "chemical" | "prevention">("overview");

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

  // Perform AI Diagnosis
  const handleDiagnose = useCallback(
    async (imageToDiagnose?: string) => {
      const targetImage = imageToDiagnose || previewImage;
      if (!targetImage && !symptomsInput.trim()) return;

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
          symptoms: symptomsInput || "Detailed visual diagnostic requested on the provided photo",
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
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [previewImage, symptomsInput, selectedCrop, customCropName]
  );

  // Handle incoming image file or data
  const processImageFile = useCallback(
    (file: File, source: "paste" | "drop" | "upload" = "upload") => {
      if (!file.type.startsWith("image/")) {
        showToast("⚠️ Please paste or upload a valid image file.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPreviewImage(dataUrl);
        setDiagnosis(null);
        stopCamera();

        if (source === "paste") {
          showToast("📋 Photo pasted successfully!");
        } else if (source === "drop") {
          showToast("📥 Photo dropped successfully!");
        }

        if (autoDiagnoseOnPaste) {
          handleDiagnose(dataUrl);
        }
      };
      reader.readAsDataURL(file);
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

  // Handle clipboard button click via navigator.clipboard.read()
  const handlePasteFromClipboardButton = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imageType = item.types.find((type) => type.startsWith("image/"));
          if (imageType) {
            const blob = await item.getType(imageType);
            const file = new File([blob], "pasted-image.png", { type: imageType });
            processImageFile(file, "paste");
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

    const speechText = `Doctor Diagnosis for ${diagnosis.plantIdentified || diagnosis.cropName || "Plant"}. Diagnosis: ${
      diagnosis.diagnosisName
    }. Severity: ${diagnosis.severity}. Primary cause: ${diagnosis.primaryCause}. Immediate action: ${
      diagnosis.immediateAction
    }. Recommended medicine: ${diagnosis.chemicalTreatment?.[0] || diagnosis.organicTreatment?.[0] || "See guide"}.`;

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
              Instant Plant Vision Doctor & Disease Pathologist
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Universal Leaf & Crop Disease Doctor
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              <strong>Simply copy & paste (Ctrl + V) any photo</strong> of a leaf, plant, fruit, or tree from your clipboard, screenshot, or gallery. The AI instantly identifies the species and prescribes medicines and organic remedies.
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
                  <span>{isSpeaking ? "Stop Voice" : "Voice Rx"}</span>
                </button>
                <button
                  onClick={handlePrintPrescription}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  Print Rx
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Upload Area & Diagnosis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Image Input & Settings */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Clipboard className="w-4 h-4 text-emerald-600" />
                Step 1: Paste or Snap Photo
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
              <div className="relative rounded-2xl overflow-hidden max-h-64 bg-slate-950 flex items-center justify-center border border-slate-200 group">
                <img src={previewImage} alt="Uploaded plant sample" className="max-h-64 w-full object-contain" />
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-900/90 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm border border-slate-700 cursor-pointer"
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
                    Copy an image from anywhere or take a screenshot, then just press <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-slate-300 rounded shadow-2xs">Ctrl + V</kbd> (or <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-slate-300 rounded shadow-2xs">⌘ + V</kbd>).
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

            {/* Quick Example Samples */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Or Click Any Sample Case to Test:
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
                  <option value="Auto-Detect from Photo">✨ Auto-Detect Any Plant from Photo</option>
                  <option value="Tomato">Tomato (Tamatar)</option>
                  <option value="Wheat">Wheat (Kanak / Gehu)</option>
                  <option value="Rice / Paddy">Rice / Paddy (Dhan)</option>
                  <option value="Cotton">Cotton (Kapas)</option>
                  <option value="Corn / Maize">Corn / Maize (Makka)</option>
                  <option value="Potato">Potato (Aloo)</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Sugarcane">Sugarcane (Ganna)</option>
                  <option value="Mustard">Mustard (Sarson)</option>
                  <option value="Chilli / Pepper">Chilli / Pepper (Mirchi)</option>
                  <option value="Apple">Apple / Fruit Tree</option>
                  <option value="Citrus / Lemon">Citrus / Lemon</option>
                  <option value="Rose / Flower">Rose / Ornamental Flower</option>
                  <option value="Other / Custom Plant">Other / Custom Plant...</option>
                </select>

                {selectedCrop === "Other / Custom Plant" && (
                  <input
                    type="text"
                    value={customCropName}
                    onChange={(e) => setCustomCropName(e.target.value)}
                    placeholder="Enter plant or tree name e.g. 'Mango tree', 'Guava', 'Spinach'..."
                    className="w-full mt-2 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Notes or Symptoms (Optional):
                </label>
                <textarea
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  rows={2}
                  placeholder="e.g. Yellow spots on leaves, insects under leaf, leaves curling, white powdery coating..."
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Run Diagnosis Button */}
            <button
              onClick={() => handleDiagnose()}
              disabled={isAnalyzing || (!previewImage && !symptomsInput.trim())}
              className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                  Analyzing Plant Photo with AI Vision...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  Diagnose Photo & Get Remedy Prescription
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Prescription & Diagnosis Results */}
        <div className="lg:col-span-7">
          {diagnosis ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5 animate-in fade-in duration-300">
              {/* Header Badge & Identified Plant */}
              <div className="border-b border-slate-200 pb-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
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
                    Status: {diagnosis.severity}
                  </span>

                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Confidence: <strong>{diagnosis.confidenceScore}%</strong>
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {diagnosis.diagnosisName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 mt-1 font-medium">
                    <span className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      {diagnosis.plantIdentified || diagnosis.cropName || "Plant"}
                    </span>
                    {diagnosis.botanicalName && (
                      <span className="italic text-slate-500 font-serif">({diagnosis.botanicalName})</span>
                    )}
                    <span>•</span>
                    <span className="font-semibold text-slate-700">
                      Category: {diagnosis.plantHealthCategory || diagnosis.primaryCause}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs for Easy Reading */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🔍 Symptoms & Cause
                </button>
                <button
                  onClick={() => setActiveTab("organic")}
                  className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === "organic"
                      ? "bg-white text-emerald-800 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🌿 Organic & Home
                </button>
                <button
                  onClick={() => setActiveTab("chemical")}
                  className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === "chemical"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  💊 Chemical / Spray Dose
                </button>
                <button
                  onClick={() => setActiveTab("prevention")}
                  className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === "prevention"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🛡️ Long-Term Care
                </button>
              </div>

              {/* Tab 1: Overview & Immediate Action */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* Immediate Emergency Action */}
                  <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 sm:p-5 space-y-2">
                    <div className="flex items-center gap-2 text-rose-900 text-xs font-extrabold uppercase">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Immediate Action Plan (Next 24–48 Hours):
                    </div>
                    <p className="text-xs sm:text-sm text-rose-950 font-semibold leading-relaxed">
                      {diagnosis.immediateAction}
                    </p>
                  </div>

                  {/* Primary Cause & Underlying Biology */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-slate-600" />
                      Underlying Cause & Pathogen:
                    </span>
                    <p className="text-slate-700 font-medium leading-relaxed">{diagnosis.primaryCause}</p>
                    {diagnosis.affectedParts?.length > 0 && (
                      <div className="pt-2 text-[11px] text-slate-500">
                        Affected Plant Parts: <strong>{diagnosis.affectedParts.join(", ")}</strong>
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
                </div>
              )}

              {/* Tab 2: Organic Remedies */}
              {activeTab === "organic" && (
                <div className="space-y-4">
                  <div className="bg-emerald-50/90 rounded-2xl border border-emerald-200 p-5 space-y-3">
                    <h3 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      Safe Home & Organic Remedies:
                    </h3>
                    <p className="text-xs text-emerald-900 font-medium">
                      Eco-friendly treatments using bio-fungicides and natural repellents that do not leave harmful chemical residues:
                    </p>
                    <ul className="space-y-2.5 text-xs text-emerald-950">
                      {diagnosis.organicTreatment.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-emerald-200 shadow-2xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-semibold">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 3: Market Medicines & Chemical Spray Dosages */}
              {activeTab === "chemical" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-slate-700" />
                      Commercial Agricultural Medicines & Dosage:
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      Recommended formulations available at agricultural fertilizer and pesticide shops:
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-800">
                      {diagnosis.chemicalTreatment.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-700 mt-1 shrink-0" />
                          <span className="font-semibold text-slate-900">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {diagnosis.dosageInstructions && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                        <strong>Application Caution:</strong> {diagnosis.dosageInstructions}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Prevention */}
              {activeTab === "prevention" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      Agronomic Prevention for Next Crop Cycle:
                    </h3>
                    <ul className="space-y-2.5 text-xs text-slate-800">
                      {diagnosis.preventionStrategy.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Yield Impact Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Estimated Yield Protection:</span>
                  <span className="text-slate-600 font-medium">{diagnosis.impactOnYieldEstimate}</span>
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

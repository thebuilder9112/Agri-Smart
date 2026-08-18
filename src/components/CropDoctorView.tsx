import React, { useState, useRef } from "react";
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Loader2,
  Bug,
  Shield,
  Leaf,
  Scan,
  Sparkles,
} from "lucide-react";
import { CropDiagnosisResult } from "../types/agriculture";
import { SAMPLE_DISEASE_CASES } from "../data/mockData";

export const CropDoctorView: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>("Wheat");
  const [symptomsInput, setSymptomsInput] = useState<string>("");
  const [fieldNotes, setFieldNotes] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<CropDiagnosisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSampleCase = (sample: (typeof SAMPLE_DISEASE_CASES)[0]) => {
    setSelectedCrop(sample.crop);
    setSymptomsInput(sample.symptoms);
    setPreviewImage(sample.image);
    setDiagnosis(null);
  };

  const handleDiagnose = async () => {
    setIsAnalyzing(true);
    try {
      const payload: any = {
        cropName: selectedCrop,
        symptoms: symptomsInput || "Visual leaf symptoms observed in the uploaded image",
        fieldNotes,
      };
      if (previewImage && previewImage.startsWith("data:image")) {
        payload.imageBase64 = previewImage;
        const mime = previewImage.split(";")[0].split(":")[1] || "image/jpeg";
        payload.mimeType = mime;
      }

      const response = await fetch("/api/gemini/diagnose-crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setDiagnosis({
        ...data,
        cropName: selectedCrop,
        dateAnalyzed: new Date().toLocaleDateString(),
        imageUrl: previewImage || undefined,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrintPrescription = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Leaf className="w-4 h-4 text-emerald-600" />
              Plant & Crop Health
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Leaf Disease Doctor & Medicine Guide
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Take a clear picture of the sick crop leaf or try one of the example samples below.
              The AI will identify the disease and give you immediate spray medicines and low-cost home remedies.
            </p>
          </div>

          {diagnosis && (
            <button
              onClick={handlePrintPrescription}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Print Medicine Guide
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Upload vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Upload Photo */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Camera className="w-4 h-4 text-emerald-600" />
              Step 1: Take Photo or Pick a Sample
            </h2>

            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition-all bg-slate-50 hover:bg-emerald-50/40 group overflow-hidden"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {previewImage ? (
                <div className="relative rounded-xl overflow-hidden max-h-56 bg-slate-950 flex items-center justify-center">
                  <img
                    src={previewImage}
                    alt="Uploaded leaf"
                    className="max-h-56 w-full object-contain"
                  />
                  <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-md shadow-emerald-400 scanner-line" />
                  <div className="absolute bottom-2 right-2 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    Click to change picture
                  </div>
                </div>
              ) : (
                <div className="py-8 space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Scan className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    Click to Upload Leaf Photo (or Take Picture)
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Take a close picture of spots, yellow marks, or bugs on the leaf
                  </p>
                </div>
              )}
            </div>

            {/* Common samples */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Or Try an Example Crop Leaf:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_DISEASE_CASES.slice(0, 4).map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSampleCase(sample)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-400 text-left transition-all flex items-center gap-2.5 cursor-pointer"
                  >
                    <img
                      src={sample.image}
                      alt={sample.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                    />
                    <div className="overflow-hidden">
                      <div className="text-[11px] font-extrabold text-slate-900 truncate">{sample.crop}</div>
                      <div className="text-[10px] text-slate-500 truncate">{sample.title.split("(")[0]}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Which Crop is this?
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Wheat">Wheat (Kanak / Gehu)</option>
                  <option value="Rice / Paddy">Rice / Paddy (Dhan)</option>
                  <option value="Cotton">Cotton (Kapas)</option>
                  <option value="Tomato">Tomato (Tamatar)</option>
                  <option value="Corn / Maize">Corn / Maize (Makka)</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Potato">Potato (Aloo)</option>
                  <option value="Sugarcane">Sugarcane (Ganna)</option>
                  <option value="Mustard">Mustard (Sarson)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  What do you see on the leaf? (Optional):
                </label>
                <textarea
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  rows={2}
                  placeholder="e.g. Yellow powder on leaf, dry brown spots, wilting..."
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleDiagnose}
              disabled={isAnalyzing || (!previewImage && !symptomsInput.trim())}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                  Checking Leaf Disease...
                </>
              ) : (
                <>
                  <Bug className="w-4 h-4 text-emerald-200" />
                  Check Disease & Get Medicine
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          {diagnosis ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5">
              {/* Header Badge */}
              <div className="border-b border-slate-200 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                      diagnosis.severity === "Critical" || diagnosis.severity === "Severe"
                        ? "bg-rose-100 text-rose-800 border border-rose-300"
                        : diagnosis.severity === "Moderate"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    }`}
                  >
                    Danger Level: {diagnosis.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Accuracy: <strong>{diagnosis.confidenceScore}%</strong>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {diagnosis.diagnosisName}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1 font-medium">
                  <span>Main Cause: <strong className="text-slate-900">{diagnosis.primaryCause}</strong></span>
                  <span>•</span>
                  <span>Crop: <strong className="text-slate-900">{diagnosis.cropName || selectedCrop}</strong></span>
                  <span>•</span>
                  <span>Affected: <strong className="text-slate-900">{diagnosis.affectedParts.join(", ")}</strong></span>
                </div>
              </div>

              {/* Immediate Emergency Action Box */}
              <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2 text-rose-900 text-xs font-extrabold uppercase">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  What to do First (Next 1–2 Days):
                </div>
                <p className="text-xs sm:text-sm text-rose-950 font-semibold leading-relaxed">
                  {diagnosis.immediateAction}
                </p>
              </div>

              {/* Visual Symptoms Identified */}
              <div>
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
                  Signs Found on Leaf:
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

              {/* Treatments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organic Remedies */}
                <div className="bg-emerald-50/90 rounded-2xl border border-emerald-200 p-4 sm:p-5 space-y-2.5">
                  <h3 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    Home & Organic Remedies (Safe & Low Cost):
                  </h3>
                  <ul className="space-y-2 text-xs text-emerald-950">
                    {diagnosis.organicTreatment.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Chemical Treatment */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-2.5">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-slate-700" />
                    Market Medicine & Spray Dose:
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-800">
                    {diagnosis.chemicalTreatment.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Yield Impact Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Crop Saved from Damage:</span>
                  <span className="text-slate-600 font-medium">{diagnosis.impactOnYieldEstimate}</span>
                </div>
                <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Checked On:</span>
                  <span className="font-bold text-slate-800">{diagnosis.dateAnalyzed || "Today"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">No Leaf Photo Checked Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
                Take a picture on the left or pick a leaf sample, then click
                "Check Disease & Get Medicine".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

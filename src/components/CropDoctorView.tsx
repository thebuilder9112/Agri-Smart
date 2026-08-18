import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Loader2,
  Bug,
  Shield,
  Leaf,
  Activity,
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
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-1">
              <Leaf className="w-4 h-4 text-emerald-600" />
              AI Phytopathology & Pest Diagnostics
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Crop Doctor & Visual Disease Scanner
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Upload a photograph of afflicted crop leaves or describe visual symptoms. Gemini AI detects
              pathogens, pest infestations, and nutrient deficiencies with actionable organic & chemical treatment plans.
            </p>
          </div>

          {diagnosis && (
            <button
              onClick={handlePrintPrescription}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 self-start md:self-auto"
            >
              <Printer className="w-4 h-4" />
              Print Farmer Prescription
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Input / Upload vs Diagnosis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Image Upload & Symptom description */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              Step 1: Upload or Snap Crop Image
            </h2>

            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/30"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {previewImage ? (
                <div className="relative rounded-lg overflow-hidden max-h-52 bg-slate-900 flex items-center justify-center">
                  <img
                    src={previewImage}
                    alt="Uploaded crop leaf"
                    className="max-h-52 object-contain"
                  />
                  <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                    Click to change image
                  </div>
                </div>
              ) : (
                <div className="py-6 space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    Click to upload crop leaf photo
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supports JPG, PNG, WEBP (Clear close-up of infected leaves or pests)
                  </p>
                </div>
              )}
            </div>

            {/* Quick Sample Library */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Or Select a Common Field Disease Sample:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_DISEASE_CASES.slice(0, 4).map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSampleCase(sample)}
                    className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-colors flex items-center gap-2"
                  >
                    <img
                      src={sample.image}
                      alt={sample.title}
                      className="w-9 h-9 rounded object-cover shrink-0 border border-slate-200"
                    />
                    <div className="overflow-hidden">
                      <div className="text-[11px] font-bold text-slate-800 truncate">{sample.crop}</div>
                      <div className="text-[10px] text-slate-500 truncate">{sample.title.split("(")[0]}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Crop Type / Variety:
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Wheat">Wheat (Kanak)</option>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observed Symptoms & Plant Condition:
                </label>
                <textarea
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  rows={2}
                  placeholder="e.g. Yellow spots on lower leaves with dark brown rings, leaf edges curling..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Field Environment / Weather Notes (Optional):
                </label>
                <input
                  type="text"
                  value={fieldNotes}
                  onChange={(e) => setFieldNotes(e.target.value)}
                  placeholder="e.g. High humidity past 4 days, unseasonal rain, furrow irrigated"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleDiagnose}
              disabled={isAnalyzing || (!previewImage && !symptomsInput.trim())}
              className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running AI Phytopathology Analysis...
                </>
              ) : (
                <>
                  <Bug className="w-4 h-4" />
                  Diagnose Pathogen & Generate Treatment Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Diagnosis Output */}
        <div className="lg:col-span-7">
          {diagnosis ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5 print:shadow-none print:border-none">
              {/* Top Diagnosis Card Header */}
              <div className="border-b border-slate-200 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      diagnosis.severity === "Critical" || diagnosis.severity === "Severe"
                        ? "bg-rose-100 text-rose-800 border border-rose-300"
                        : diagnosis.severity === "Moderate"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    }`}
                  >
                    Severity: {diagnosis.severity}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Confidence: <strong>{diagnosis.confidenceScore}%</strong>
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {diagnosis.diagnosisName}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                  <span>Cause: <strong className="text-slate-800">{diagnosis.primaryCause}</strong></span>
                  <span>•</span>
                  <span>Target Crop: <strong className="text-slate-800">{diagnosis.cropName || selectedCrop}</strong></span>
                  <span>•</span>
                  <span>Affected: <strong className="text-slate-800">{diagnosis.affectedParts.join(", ")}</strong></span>
                </div>
              </div>

              {/* Immediate Action Emergency Box */}
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Immediate Action (First 24–48 Hours):
                </div>
                <p className="text-xs text-rose-950 font-medium leading-relaxed">
                  {diagnosis.immediateAction}
                </p>
              </div>

              {/* Visual Findings */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-slate-600" />
                  Identified Visual Symptoms:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {diagnosis.visualFindings.map((finding, idx) => (
                    <li key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatment Plans: Organic vs Chemical */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organic / Eco-friendly Treatment */}
                <div className="bg-emerald-50/60 rounded-xl border border-emerald-200 p-4 space-y-2">
                  <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    Organic & Bio-Control Remedies:
                  </h3>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {diagnosis.organicTreatment.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Chemical Treatment */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-slate-700" />
                    Standard Chemical Spray & Dosage:
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {diagnosis.chemicalTreatment.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Prevention & Yield Loss Impact */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50/80 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">Estimated Yield Impact:</span>
                  <span className="text-slate-600">{diagnosis.impactOnYieldEstimate}</span>
                </div>
                <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
                  <span className="text-[11px] text-slate-500 block">Prescription Date:</span>
                  <span className="font-semibold text-slate-700">{diagnosis.dateAnalyzed || "Today"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] bg-slate-50/70 rounded-xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Active Diagnosis Loaded</h3>
              <p className="text-xs text-slate-500 max-w-md mt-1">
                Select a sample disease from the left or upload your own leaf photo, then click
                "Diagnose Pathogen" to generate full phytopathology treatment prescriptions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

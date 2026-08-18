import React, { useState } from "react";
import {
  Sliders,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FlaskConical,
  Sprout,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { SoilAnalysisResult } from "../types/agriculture";

export const SoilNutrientView: React.FC = () => {
  const [cropType, setCropType] = useState<string>("Wheat");
  const [soilType, setSoilType] = useState<string>("Alluvial Loam");
  const [targetYield, setTargetYield] = useState<string>("24 Quintals/Acre");
  const [nitrogenN, setNitrogenN] = useState<number>(140);
  const [phosphorusP, setPhosphorusP] = useState<number>(18);
  const [potassiumK, setPotassiumK] = useState<number>(160);
  const [soilPh, setSoilPh] = useState<number>(7.4);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SoilAnalysisResult | null>(null);

  const handleAnalyzeSoil = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/gemini/soil-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropType,
          soilType,
          nitrogenN,
          phosphorusP,
          potassiumK,
          soilPh,
          targetYield,
        }),
      });
      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              Soil Health & N-P-K Precision Nutrition
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Soil Nutrient Formulator & Fertilizer Scheduler
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Input test values for Nitrogen (N), Phosphorus (P), Potassium (K), and pH to generate
              split-dose application schedules (Urea, DAP, MOP), bio-fertilizer enrichments, and pH corrections.
            </p>
          </div>

          <button
            onClick={handleAnalyzeSoil}
            disabled={isAnalyzing}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 shadow-md shadow-emerald-950/30 disabled:opacity-50 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                Computing Formulation...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Calculate Fertilizer Formula
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Form & Gauges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Sliders Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Soil Test Parameters
            </h2>

            {/* Crop & Soil Type Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Crop:</label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Wheat">Wheat (Kanak)</option>
                  <option value="Basmati Rice">Basmati Rice (Paddy)</option>
                  <option value="Bt Cotton">Bt Cotton</option>
                  <option value="Hybrid Maize">Hybrid Maize</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Mustard">Mustard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Soil Texture:</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Alluvial Loam">Alluvial Loam</option>
                  <option value="Black Clay (Regur)">Black Clay (Regur)</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Red Laterite">Red Laterite</option>
                </select>
              </div>
            </div>

            {/* Nitrogen (N) */}
            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">Available Nitrogen (N):</span>
                <span className={nitrogenN < 200 ? "text-amber-600 font-extrabold" : "text-emerald-700 font-extrabold"}>
                  {nitrogenN} kg/ha {nitrogenN < 200 ? "(Low Deficit)" : "(Medium)"}
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={500}
                value={nitrogenN}
                onChange={(e) => setNitrogenN(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>&lt; 280 (Low)</span>
                <span>280–560 (Medium)</span>
                <span>&gt; 560 (High)</span>
              </div>
            </div>

            {/* Phosphorus (P) */}
            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">Available Phosphorus (P₂O₅):</span>
                <span className={phosphorusP < 25 ? "text-amber-600 font-extrabold" : "text-emerald-700 font-extrabold"}>
                  {phosphorusP} kg/ha {phosphorusP < 25 ? "(Deficit)" : "(Adequate)"}
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={80}
                value={phosphorusP}
                onChange={(e) => setPhosphorusP(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>&lt; 23 (Low)</span>
                <span>23–56 (Medium)</span>
                <span>&gt; 56 (High)</span>
              </div>
            </div>

            {/* Potassium (K) */}
            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">Available Potassium (K₂O):</span>
                <span className={potassiumK < 150 ? "text-amber-600 font-extrabold" : "text-emerald-700 font-extrabold"}>
                  {potassiumK} kg/ha {potassiumK < 150 ? "(Deficit)" : "(Good)"}
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={400}
                value={potassiumK}
                onChange={(e) => setPotassiumK(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>&lt; 140 (Low)</span>
                <span>140–280 (Medium)</span>
                <span>&gt; 280 (High)</span>
              </div>
            </div>

            {/* Soil pH */}
            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">Soil pH Reaction:</span>
                <span className="text-slate-900 font-extrabold">
                  {soilPh} {soilPh > 7.5 ? "(Alkaline)" : soilPh < 6.5 ? "(Acidic)" : "(Neutral Optimal)"}
                </span>
              </div>
              <input
                type="range"
                min={4.5}
                max={9.5}
                step={0.1}
                value={soilPh}
                onChange={(e) => setSoilPh(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>4.5 (Acidic)</span>
                <span>6.5–7.5 (Optimal)</span>
                <span>9.5 (Alkaline)</span>
              </div>
            </div>

            <button
              onClick={handleAnalyzeSoil}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-950/30 disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                  Calculating Prescription...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Generate Nutrient Schedule
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output: Fertilizer Schedule & Bio-Amendments */}
        <div className="lg:col-span-7">
          {analysisResult ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6 animate-in fade-in duration-300">
              {/* Score header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
                    Soil Health Diagnosis
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    {cropType} Nutrient Prescription
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Overall Soil Score</span>
                  <span className="text-2xl font-black text-emerald-700">
                    {analysisResult.soilHealthScore}/100
                  </span>
                </div>
              </div>

              {/* Status Summary & Carbon index */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block font-semibold">Organic Carbon Index:</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {analysisResult.organicCarbonStatus}
                  </span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block font-semibold">pH Correction Advice:</span>
                  <span className="font-extrabold text-slate-900 text-xs leading-tight">
                    {analysisResult.phCorrectionStrategy}
                  </span>
                </div>
              </div>

              {/* Fertilizer Split Application Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Split-Dose Fertilizer Schedule (Per Acre):
                </h3>

                <div className="space-y-2.5">
                  {analysisResult.fertilizerSchedule.map((sched, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          {sched.stage}
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                          {sched.timingDays}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold pt-1">
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-normal">Urea (46% N)</span>
                          <span className="text-slate-900">{sched.ureaKgPerAcre} kg</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-normal">DAP (18-46-0)</span>
                          <span className="text-slate-900">{sched.dapKgPerAcre} kg</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-normal">MOP (60% K)</span>
                          <span className="text-slate-900">{sched.mopKgPerAcre} kg</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 bg-white/60 p-2 rounded-lg border border-slate-100 font-medium">
                        💡 <strong>Application Note:</strong> {sched.notes}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio & Organic Amendments */}
              <div className="bg-emerald-50/80 rounded-2xl border border-emerald-200 p-4 sm:p-5 space-y-2">
                <h3 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  Bio-Fertilizer & Organic Amendments:
                </h3>
                <ul className="space-y-1.5 text-xs text-emerald-950 font-medium">
                  {analysisResult.organicAmendments.map((amend, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{amend}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-slate-50/80 rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 shadow-sm">
                <FlaskConical className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">No Soil Formulation Loaded</h3>
              <p className="text-xs text-slate-500 max-w-md mt-1.5 leading-relaxed">
                Adjust the Nitrogen, Phosphorus, Potassium, and pH sliders on the left, then click
                "Calculate Fertilizer Formula" to generate tailored split-dose application plans.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

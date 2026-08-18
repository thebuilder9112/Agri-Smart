import React, { useState } from "react";
import {
  Sliders,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Sprout,
  Calendar,
  Layers,
  Printer,
} from "lucide-react";
import { SoilAnalysisResult } from "../types/agriculture";

export const SoilNutrientView: React.FC = () => {
  const [cropType, setCropType] = useState<string>("Wheat");
  const [soilType, setSoilType] = useState<string>("Loam Soil");
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              Soil Health & Fertilizer
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Soil Health & Fertilizer Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Choose your crop and set your soil test numbers. The calculator gives you the exact number
              of Urea, DAP, and Potash bags needed, plus when to apply them in the field.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {analysisResult && (
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                Print Plan
              </button>
            )}

            <button
              onClick={handleAnalyzeSoil}
              disabled={isAnalyzing}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 shadow-sm disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                  Calculating Bags...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Calculate Fertilizer Bags
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Sliders */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Your Crop & Soil Test Values
            </h2>

            {/* Crop selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Crop</label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Wheat">Wheat (Gehu)</option>
                  <option value="Rice / Paddy">Rice / Paddy (Dhan)</option>
                  <option value="Cotton">Cotton (Kapas)</option>
                  <option value="Maize / Corn">Maize (Makka)</option>
                  <option value="Mustard">Mustard (Sarson)</option>
                  <option value="Sugarcane">Sugarcane (Ganna)</option>
                  <option value="Potato">Potato (Aloo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Soil Type</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Loam Soil">Loam (Medium Soil)</option>
                  <option value="Sandy Loam">Sandy (Light Soil)</option>
                  <option value="Clay / Heavy Soil">Clay (Heavy Soil)</option>
                  <option value="Black Cotton Soil">Black Soil</option>
                </select>
              </div>
            </div>

            {/* Nitrogen Slider */}
            <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Nitrogen (N in soil):</span>
                <span className="text-emerald-700 font-extrabold">{nitrogenN} kg/ha</span>
              </div>
              <input
                type="range"
                min={50}
                max={300}
                value={nitrogenN}
                onChange={(e) => setNitrogenN(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Low (50)</span>
                <span>Normal (180)</span>
                <span>High (300)</span>
              </div>
            </div>

            {/* Phosphorus Slider */}
            <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Phosphorus (P in soil):</span>
                <span className="text-emerald-700 font-extrabold">{phosphorusP} kg/ha</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                value={phosphorusP}
                onChange={(e) => setPhosphorusP(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Low (5)</span>
                <span>Normal (22)</span>
                <span>High (50)</span>
              </div>
            </div>

            {/* Potassium Slider */}
            <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Potassium / Potash (K in soil):</span>
                <span className="text-emerald-700 font-extrabold">{potassiumK} kg/ha</span>
              </div>
              <input
                type="range"
                min={60}
                max={350}
                value={potassiumK}
                onChange={(e) => setPotassiumK(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Low (60)</span>
                <span>Normal (200)</span>
                <span>High (350)</span>
              </div>
            </div>

            {/* pH Slider */}
            <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Soil pH:</span>
                <span className="text-emerald-700 font-extrabold">{soilPh} ({soilPh < 6.5 ? "Acidic" : soilPh > 7.5 ? "Alkaline" : "Neutral / Good"})</span>
              </div>
              <input
                type="range"
                min={5.0}
                max={9.0}
                step={0.1}
                value={soilPh}
                onChange={(e) => setSoilPh(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>5.0 (Acidic)</span>
                <span>7.0 (Ideal)</span>
                <span>9.0 (Alkaline)</span>
              </div>
            </div>

            <button
              onClick={handleAnalyzeSoil}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                  Calculating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  Calculate Fertilizer Bags
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7">
          {analysisResult ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5">
              {/* Top Summary Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Soil Condition: {analysisResult.soilHealthRating}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">
                    Fertilizer Plan for {cropType}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block uppercase font-bold">Target Harvest</span>
                  <span className="text-sm font-extrabold text-emerald-700">{targetYield}</span>
                </div>
              </div>

              {/* 3 Main Fertilizer Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center space-y-1">
                  <span className="text-[11px] font-extrabold text-emerald-950 block">Urea (Nitrogen)</span>
                  <div className="text-xl font-black text-emerald-900">{analysisResult.ureaRecommendedKgPerAcre} kg</div>
                  <span className="text-[11px] text-emerald-700 font-bold block">
                    ≈ {Math.ceil(analysisResult.ureaRecommendedKgPerAcre / 45)} Bags (45kg)
                  </span>
                </div>

                <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 text-center space-y-1">
                  <span className="text-[11px] font-extrabold text-sky-950 block">DAP (Phosphorus)</span>
                  <div className="text-xl font-black text-sky-900">{analysisResult.dapRecommendedKgPerAcre} kg</div>
                  <span className="text-[11px] text-sky-700 font-bold block">
                    ≈ {Math.ceil(analysisResult.dapRecommendedKgPerAcre / 50)} Bags (50kg)
                  </span>
                </div>

                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-center space-y-1">
                  <span className="text-[11px] font-extrabold text-amber-950 block">Potash / MOP</span>
                  <div className="text-xl font-black text-amber-900">{analysisResult.mopRecommendedKgPerAcre} kg</div>
                  <span className="text-[11px] text-amber-700 font-bold block">
                    ≈ {Math.ceil(analysisResult.mopRecommendedKgPerAcre / 50)} Bags (50kg)
                  </span>
                </div>
              </div>

              {/* Application Timeline */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  When and How Much Fertilizer to Put:
                </h3>
                <div className="space-y-2">
                  {analysisResult.splitDoseSchedule.map((stage, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-extrabold text-slate-900 block">{stage.growthStage}</span>
                        <span className="text-slate-500 text-[11px] font-medium">{stage.timingDays}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-slate-700 font-bold text-[11px]">
                        {stage.ureaDoseKg > 0 && (
                          <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                            Urea: {stage.ureaDoseKg} kg
                          </span>
                        )}
                        {stage.dapDoseKg > 0 && (
                          <span className="bg-sky-100 text-sky-900 px-2 py-0.5 rounded border border-sky-300">
                            DAP: {stage.dapDoseKg} kg
                          </span>
                        )}
                        {stage.mopDoseKg > 0 && (
                          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                            Potash: {stage.mopDoseKg} kg
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organic Compost and Micronutrients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5 text-xs">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    Organic Compost & Bio-Fertilizer:
                  </span>
                  <ul className="space-y-1 text-emerald-900">
                    {analysisResult.bioFertilizers.map((bio, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{bio}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-slate-700" />
                    Micronutrients (Zinc / Sulfur / Boron):
                  </span>
                  <ul className="space-y-1 text-slate-700">
                    {analysisResult.micronutrients.map((micro, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" />
                        <span>{micro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Soil Correction note if any */}
              {analysisResult.soilCorrectionAdvice && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Soil Treatment Advice:</strong>
                    <span>{analysisResult.soilCorrectionAdvice}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <FlaskConical className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">No Fertilizer Calculation Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
                Adjust your crop and soil values on the left, then click
                "Calculate Fertilizer Bags".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

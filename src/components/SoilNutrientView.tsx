import React, { useState } from "react";
import {
  Sliders,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  FileCheck2,
  Activity,
  Layers,
  Wheat,
} from "lucide-react";
import { SoilAdviceResult } from "../types/agriculture";

export const SoilNutrientView: React.FC = () => {
  const [crop, setCrop] = useState("Wheat");
  const [soilType, setSoilType] = useState("Loamy");
  const [nitrogen, setNitrogen] = useState(120);
  const [phosphorus, setPhosphorus] = useState(45);
  const [potassium, setPotassium] = useState(170);
  const [ph, setPh] = useState(7.2);
  const [organicCarbon, setOrganicCarbon] = useState("0.65%");
  const [targetYield, setTargetYield] = useState("5.2 tons/ha");

  const [isCalculating, setIsCalculating] = useState(false);
  const [soilAdvice, setSoilAdvice] = useState<SoilAdviceResult | null>(null);

  const handleAnalyzeSoil = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch("/api/gemini/soil-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop,
          soilType,
          nitrogen,
          phosphorus,
          potassium,
          ph,
          organicCarbon,
          targetYieldHectare: targetYield,
        }),
      });
      const data = await response.json();
      setSoilAdvice(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4 text-emerald-600" />
          Precision Soil Health & Fertilizer Balancing
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Soil Nutrient Predictor & NPK Formulator
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Input your soil test readings (Nitrogen, Phosphorus, Potassium, pH) to receive custom fertilizer dosage
          prescriptions, organic carbon enrichment strategies, and salinity risk mitigation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Soil Test Input Sliders & Selectors */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Soil Sample Test Data
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Crop:
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Wheat">Wheat</option>
                  <option value="Rice / Paddy">Rice / Paddy</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Corn / Maize">Corn / Maize</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Potato">Potato</option>
                  <option value="Soybean">Soybean</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Soil Texture:
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Loamy">Loamy Soil</option>
                  <option value="Clayey">Clayey Soil</option>
                  <option value="Sandy">Sandy Loam</option>
                  <option value="Black Soil">Black Cotton Soil</option>
                  <option value="Alluvial">Alluvial Soil</option>
                </select>
              </div>
            </div>

            {/* Sliders for N, P, K, pH */}
            <div className="space-y-3.5 pt-2">
              {/* Nitrogen */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Available Nitrogen (N):</span>
                  <span className={`font-bold ${nitrogen < 140 ? "text-amber-600" : "text-emerald-700"}`}>
                    {nitrogen} kg/ha {nitrogen < 140 ? "(Deficient)" : "(Adequate)"}
                  </span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={350}
                  value={nitrogen}
                  onChange={(e) => setNitrogen(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Phosphorus */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Available Phosphorus (P):</span>
                  <span className={`font-bold ${phosphorus < 30 ? "text-amber-600" : "text-emerald-700"}`}>
                    {phosphorus} kg/ha {phosphorus < 30 ? "(Low)" : "(Optimal)"}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={120}
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              {/* Potassium */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Available Potassium (K):</span>
                  <span className="font-bold text-slate-800">{potassium} kg/ha</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={450}
                  value={potassium}
                  onChange={(e) => setPotassium(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>

              {/* pH */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Soil Reaction (pH):</span>
                  <span className="font-bold text-indigo-700">
                    pH {ph} {ph < 6.5 ? "(Acidic)" : ph > 7.8 ? "(Alkaline)" : "(Neutral / Ideal)"}
                  </span>
                </div>
                <input
                  type="range"
                  min={4.5}
                  max={9.5}
                  step={0.1}
                  value={ph}
                  onChange={(e) => setPh(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* Target Yield */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organic Carbon:</label>
                <input
                  type="text"
                  value={organicCarbon}
                  onChange={(e) => setOrganicCarbon(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Harvest:</label>
                <input
                  type="text"
                  value={targetYield}
                  onChange={(e) => setTargetYield(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleAnalyzeSoil}
              disabled={isCalculating}
              className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating NPK Formulation...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  Generate AI Soil Health & Fertilizer Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Soil Formulation Output */}
        <div className="lg:col-span-7">
          {soilAdvice ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
              {/* Score and Health Banner */}
              <div className="border-b border-slate-200 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Health Rating: {soilAdvice.soilHealthRating}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                    Overall Health Score: <strong className="text-emerald-700">{soilAdvice.overallHealthScore}/100</strong>
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Custom Agronomic Fertilizer & Nutrient Prescription
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Targeted for {crop} on {soilType} soil aiming for {targetYield}.
                </p>
              </div>

              {/* Nutrient Status Breakdown */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-slate-600" />
                  Nutrient Deficit Diagnostic:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Nitrogen (N)</span>
                    <span className="font-semibold text-slate-800">{soilAdvice.nutrientDeficits.nitrogenStatus}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Phosphorus (P)</span>
                    <span className="font-semibold text-slate-800">{soilAdvice.nutrientDeficits.phosphorusStatus}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Potassium (K)</span>
                    <span className="font-semibold text-slate-800">{soilAdvice.nutrientDeficits.potassiumStatus}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">pH Reaction</span>
                    <span className="font-semibold text-slate-800">{soilAdvice.nutrientDeficits.phStatus}</span>
                  </div>
                </div>
              </div>

              {/* Fertilizer Application Plan Table */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Wheat className="w-4 h-4 text-emerald-600" />
                  Recommended Mineral Fertilizer Schedule:
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Fertilizer Type</th>
                        <th className="p-2.5">Dosage / Acre</th>
                        <th className="p-2.5">Application Timing</th>
                        <th className="p-2.5">Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {soilAdvice.fertilizerPlan.map((plan, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-bold text-slate-900">{plan.fertilizerName}</td>
                          <td className="p-2.5 font-semibold text-emerald-700">{plan.dosagePerAcre}</td>
                          <td className="p-2.5 text-slate-600">{plan.applicationTiming}</td>
                          <td className="p-2.5 text-slate-500">{plan.method}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Organic Amendments & pH Correction */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Organic Soil Health Enrichment:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {soilAdvice.organicAmendments.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    pH & Salinity Strategy:
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {soilAdvice.phCorrectionStrategy}
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <strong>Salinity Status:</strong> {soilAdvice.salinityRisk}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] bg-slate-50/70 rounded-xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Soil Plan Computed Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mt-1">
                Adjust your soil test values on the left and click "Generate AI Soil Health & Fertilizer Plan"
                to calculate balanced NPK doses and split applications.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

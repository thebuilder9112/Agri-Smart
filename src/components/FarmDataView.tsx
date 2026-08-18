import React, { useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Download,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Calendar,
  MapPin,
  TrendingUp,
  X,
} from "lucide-react";
import { FieldRecord } from "../types/agriculture";

interface FarmDataViewProps {
  fields: FieldRecord[];
  onAddField: (field: FieldRecord) => void;
  onUpdateField: (field: FieldRecord) => void;
  onDeleteField: (id: string) => void;
}

export const FarmDataView: React.FC<FarmDataViewProps> = ({
  fields,
  onAddField,
  onUpdateField,
  onDeleteField,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterCrop, setFilterCrop] = useState<string>("All");

  // Form State
  const [name, setName] = useState("");
  const [crop, setCrop] = useState("Wheat");
  const [variety, setVariety] = useState("PBW 824");
  const [sowingDate, setSowingDate] = useState("2026-11-10");
  const [stage, setStage] = useState("Vegetative");
  const [soilType, setSoilType] = useState("Alluvial Loam");
  const [areaAcre, setAreaAcre] = useState(4.5);
  const [irrigationType, setIrrigationType] = useState<"Drip" | "Sprinkler" | "Flood / Furrow">("Drip");
  const [targetYield, setTargetYield] = useState("24 Quintals/Acre");

  const filteredFields = filterCrop === "All" ? fields : fields.filter((f) => f.crop === filterCrop);

  const handleSubmitNewField = (e: React.FormEvent) => {
    e.preventDefault();
    const newField: FieldRecord = {
      id: `field-${Date.now()}`,
      name: name || `Field Plot #${fields.length + 1}`,
      crop,
      variety,
      sowingDate,
      stage,
      soilType,
      areaAcre: Number(areaAcre),
      currentMoisture: 58,
      currentTemp: 28,
      currentHumidity: 62,
      irrigationType,
      lastIrrigated: "Today",
      valveOpen: false,
      healthStatus: "Optimal",
      targetYield,
      notes: "Newly registered plot for automated IoT decision support.",
    };
    onAddField(newField);
    setIsAddModalOpen(false);
    setName("");
  };

  const handleExportCSV = () => {
    const headers = [
      "Field Name",
      "Crop",
      "Variety",
      "Sowing Date",
      "Stage",
      "Area (Acres)",
      "Soil Type",
      "Moisture (%)",
      "Health Status",
      "Irrigation Method",
    ];
    const rows = fields.map((f) => [
      `"${f.name}"`,
      `"${f.crop}"`,
      `"${f.variety}"`,
      `"${f.sowingDate}"`,
      `"${f.stage}"`,
      f.areaAcre,
      `"${f.soilType}"`,
      f.currentMoisture,
      `"${f.healthStatus}"`,
      `"${f.irrigationType}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agrivision_farm_registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4 text-emerald-600" />
              Plot Lifecycle & Farm Registry
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Farm & Crop Data Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Track crop phenology stages, sowing schedules, soil profiles, and automated valve telemetry
              across all registered acreage.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border border-slate-300 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              Export CSV
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-md shadow-emerald-950/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Plot
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-xs font-semibold">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold shrink-0">Filter Crop:</span>
          {["All", "Wheat", "Basmati Paddy", "Bt Cotton", "Hybrid Maize"].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCrop(c)}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                filterCrop === c
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <span className="text-slate-500 hidden sm:inline">
          Showing <strong>{filteredFields.length}</strong> of {fields.length} Plots
        </span>
      </div>

      {/* Plots Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFields.map((field) => (
          <div
            key={field.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{field.name}</h3>
                  <div className="text-xs text-emerald-700 font-bold mt-0.5">
                    {field.crop} • <span className="text-slate-600 font-normal">{field.variety}</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    field.healthStatus === "Optimal"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {field.healthStatus}
                </span>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Area:</span>
                  <span className="font-bold text-slate-800">{field.areaAcre} Acres</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Growth Stage:</span>
                  <span className="font-bold text-slate-800">{field.stage}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Moisture:</span>
                  <span className={`font-bold ${field.currentMoisture < 45 ? "text-amber-600" : "text-emerald-700"}`}>
                    {field.currentMoisture}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Irrigation:</span>
                  <span className="font-bold text-slate-800">{field.irrigationType}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed">
                <strong>Soil:</strong> {field.soilType} • <strong>Sown:</strong> {field.sowingDate}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] font-semibold text-slate-400">
                Target: {field.targetYield}
              </span>
              <button
                onClick={() => onDeleteField(field.id)}
                className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                title="Delete Plot"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Plot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden text-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Register New Farm Plot</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewField} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Plot Name / Identifier:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. North Acre #4 (Canal Side)"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Crop Type:</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="Wheat">Wheat</option>
                    <option value="Basmati Paddy">Basmati Paddy</option>
                    <option value="Bt Cotton">Bt Cotton</option>
                    <option value="Hybrid Maize">Hybrid Maize</option>
                    <option value="Tomato">Tomato</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Variety / Hybrid:</label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Area (Acres):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={areaAcre}
                    onChange={(e) => setAreaAcre(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Irrigation Method:</label>
                  <select
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="Drip">Drip System</option>
                    <option value="Sprinkler">Micro Sprinkler</option>
                    <option value="Flood / Furrow">Flood / Furrow</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-sm"
                >
                  Save Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

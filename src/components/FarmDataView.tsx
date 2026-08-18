import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Droplets,
  Edit2,
  Check,
  TrendingUp,
} from "lucide-react";
import { FieldRecord, CropType } from "../types/agriculture";

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
  const [newFieldName, setNewFieldName] = useState("");
  const [newCrop, setNewCrop] = useState<CropType>("Wheat");
  const [newVariety, setNewVariety] = useState("");
  const [newArea, setNewArea] = useState<number>(4.0);
  const [newSowingDate, setNewSowingDate] = useState<string>("2026-07-01");
  const [newSoilType, setNewSoilType] = useState<FieldRecord["soilType"]>("Loamy");
  const [newIrrigationType, setNewIrrigationType] = useState<FieldRecord["irrigationType"]>("Drip Irrigation");
  const [newStage, setNewStage] = useState<FieldRecord["stage"]>("Vegetative");
  const [newTargetYield, setNewTargetYield] = useState<number>(4.5);
  const [newNotes, setNewNotes] = useState("");

  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;

    const newField: FieldRecord = {
      id: `field-${Date.now()}`,
      name: newFieldName,
      crop: newCrop,
      variety: newVariety || "Standard High-Yield",
      areaAcre: newArea,
      sowingDate: newSowingDate,
      soilType: newSoilType,
      irrigationType: newIrrigationType,
      stage: newStage,
      targetYieldTonsPerHa: newTargetYield,
      currentMoisture: 58,
      currentTemp: 29.5,
      currentHumidity: 65,
      currentPh: 7.0,
      npk: { n: 130, p: 50, k: 180 },
      healthStatus: "Optimal",
      valveOpen: false,
      notes: newNotes || "Added to farm records.",
    };

    onAddField(newField);
    setIsAddModalOpen(false);
    // Reset form
    setNewFieldName("");
    setNewVariety("");
    setNewNotes("");
  };

  const handleExportCSV = () => {
    const headers = [
      "Field ID",
      "Field Name",
      "Crop",
      "Variety",
      "Area (Acres)",
      "Sowing Date",
      "Soil Type",
      "Irrigation Method",
      "Growth Stage",
      "Target Yield (T/ha)",
      "Current Moisture %",
      "Ambient Temp (°C)",
      "Humidity %",
      "Soil pH",
      "Health Status",
    ];

    const rows = fields.map((f) => [
      f.id,
      `"${f.name}"`,
      f.crop,
      `"${f.variety}"`,
      f.areaAcre,
      f.sowingDate,
      f.soilType,
      f.irrigationType,
      f.stage,
      f.targetYieldTonsPerHa,
      f.currentMoisture,
      f.currentTemp,
      f.currentHumidity,
      f.currentPh,
      f.healthStatus,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agrivision_crop_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4 text-emerald-600" />
              Agronomic Record Management
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Crop Data & Field Lifecycle Registry
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage all farm plots, crop varieties, growth phenology, and target yields. Real-time telemetry is synchronized with the automated decision support engine.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-300"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              Export Farm CSV
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add New Crop Plot
            </button>
          </div>
        </div>
      </div>

      {/* Field Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {fields.map((field) => (
          <div
            key={field.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-emerald-400 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                    {field.crop}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{field.name}</h3>
                  <div className="text-xs text-slate-500 font-medium">{field.variety}</div>
                </div>

                <button
                  onClick={() => onDeleteField(field.id)}
                  title="Delete Plot"
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Status and area badge */}
              <div className="flex items-center gap-2 pt-1">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    field.healthStatus === "Optimal"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-amber-100 text-amber-800 border-amber-300"
                  }`}
                >
                  {field.healthStatus}
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {field.areaAcre} Acres • {field.stage}
                </span>
              </div>

              {/* Attributes table */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 block">Soil & Irrigation</span>
                  <span className="font-semibold text-slate-800">{field.soilType} ({field.irrigationType.split(" ")[0]})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Sown Date</span>
                  <span className="font-semibold text-slate-800">{field.sowingDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Target Yield</span>
                  <span className="font-semibold text-emerald-700">{field.targetYieldTonsPerHa} T/ha</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Moisture & pH</span>
                  <span className="font-semibold text-slate-800">{field.currentMoisture}% • pH {field.currentPh}</span>
                </div>
              </div>

              {field.notes && (
                <p className="text-xs text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                  "{field.notes}"
                </p>
              )}
            </div>

            {/* Stage Selector Action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500">Phenology Stage:</span>
              <select
                value={field.stage}
                onChange={(e) =>
                  onUpdateField({
                    ...field,
                    stage: e.target.value as FieldRecord["stage"],
                  })
                }
                className="text-xs font-semibold px-2 py-1 bg-slate-100 border border-slate-300 rounded focus:outline-none"
              >
                <option value="Germination">Germination</option>
                <option value="Vegetative">Vegetative</option>
                <option value="Flowering">Flowering</option>
                <option value="Grain Formation">Grain Formation</option>
                <option value="Maturity / Harvest Ready">Maturity / Harvest</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add Field Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Register New Crop Plot</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateField} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Field / Plot Identifier:
                </label>
                <input
                  type="text"
                  required
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="e.g. East Valley Plot 5"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Crop Type:
                  </label>
                  <select
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value as CropType)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="Wheat">Wheat</option>
                    <option value="Rice / Paddy">Rice / Paddy</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Corn / Maize">Corn / Maize</option>
                    <option value="Soybean">Soybean</option>
                    <option value="Potato">Potato</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Mustard">Mustard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seed Variety:
                  </label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    placeholder="e.g. HD-3086 / Hybrid"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Area (Acres):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={newArea}
                    onChange={(e) => setNewArea(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sowing Date:
                  </label>
                  <input
                    type="date"
                    value={newSowingDate}
                    onChange={(e) => setNewSowingDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Soil Texture:
                  </label>
                  <select
                    value={newSoilType}
                    onChange={(e) => setNewSoilType(e.target.value as FieldRecord["soilType"])}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="Loamy">Loamy</option>
                    <option value="Clayey">Clayey</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Black Soil">Black Soil</option>
                    <option value="Alluvial">Alluvial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Irrigation Method:
                  </label>
                  <select
                    value={newIrrigationType}
                    onChange={(e) => setNewIrrigationType(e.target.value as FieldRecord["irrigationType"])}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Flood / Furrow">Flood / Furrow</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Field Agronomy Notes:
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Basal compost added, laser leveled last week"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                >
                  Save Plot Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

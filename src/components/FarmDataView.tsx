import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Download,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Calendar,
  MapPin,
  X,
  Power,
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
  const [soilType, setSoilType] = useState("Loam Soil");
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
      notes: "Registered field plot.",
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
      "Water Method",
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
    link.setAttribute("download", `My_Farms_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalAcres = fields.reduce((sum, f) => sum + f.areaAcre, 0);
  const dryPlots = fields.filter((f) => f.currentMoisture < 45).length;
  const activeValves = fields.filter((f) => f.valveOpen).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Farm Plot Manager
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              My Fields & Crops
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Track your land, crops, sowing dates, soil moisture, and water valves in one simple list.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4" />
              Download List (Excel/CSV)
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold transition-all flex items-center gap-2 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add New Field
            </button>
          </div>
        </div>

        {/* 4 Simple Stats */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-bold block text-[11px]">Total Farm Land</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">{totalAcres} Acres</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-bold block text-[11px]">Active Fields</span>
            <span className="text-lg font-black text-emerald-700 mt-0.5 block">{fields.length} Fields</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-bold block text-[11px]">Needs Water Now</span>
            <span className={`text-lg font-black mt-0.5 block ${dryPlots > 0 ? "text-amber-600" : "text-slate-800"}`}>
              {dryPlots} Fields
            </span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-bold block text-[11px]">Water Tap Running</span>
            <span className={`text-lg font-black mt-0.5 block ${activeValves > 0 ? "text-teal-600" : "text-slate-800"}`}>
              {activeValves} Active
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] shrink-0">Filter by Crop:</span>
        {["All", "Wheat", "Rice / Paddy", "Cotton", "Maize"].map((c) => (
          <button
            key={c}
            onClick={() => setFilterCrop(c)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
              filterCrop === c
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Field Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFields.map((field) => {
          const isDry = field.currentMoisture < 45;
          return (
            <div
              key={field.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-emerald-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-black text-sm text-slate-900">{field.name}</h3>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      {field.crop} • {field.variety}
                    </div>
                  </div>

                  {isDry ? (
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Needs Water
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Moisture OK
                    </span>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Area</span>
                    <span className="font-bold text-slate-800">{field.areaAcre} Acres</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Stage</span>
                    <span className="font-bold text-slate-800">{field.stage}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Water Method</span>
                    <span className="font-bold text-slate-800">{field.irrigationType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Sown On</span>
                    <span className="font-bold text-slate-800">{field.sowingDate}</span>
                  </div>
                </div>

                {/* Moisture Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-teal-600" />
                      Soil Moisture:
                    </span>
                    <span className={isDry ? "text-amber-600 font-extrabold" : "text-emerald-700 font-extrabold"}>
                      {field.currentMoisture}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isDry ? "bg-amber-500" : "bg-emerald-600"
                      }`}
                      style={{ width: `${field.currentMoisture}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    const updated = { ...field, valveOpen: !field.valveOpen };
                    if (updated.valveOpen) {
                      updated.currentMoisture = Math.min(100, updated.currentMoisture + 15);
                    }
                    onUpdateField(updated);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    field.valveOpen
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : "bg-emerald-700 hover:bg-emerald-800 text-white"
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {field.valveOpen ? "Turn Water OFF" : "Turn Water ON"}
                </button>

                <button
                  onClick={() => onDeleteField(field.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete field"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Field Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Add New Field Plot</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewField} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Field Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Canal Plot"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Crop</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Wheat">Wheat</option>
                    <option value="Rice / Paddy">Rice / Paddy</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Maize / Corn">Maize</option>
                    <option value="Mustard">Mustard</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Potato">Potato</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={areaAcre}
                    onChange={(e) => setAreaAcre(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Water Method</label>
                  <select
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Drip">Drip Irrigation (Pipes)</option>
                    <option value="Sprinkler">Sprinkler (Fountain)</option>
                    <option value="Flood / Furrow">Flood / Tube-well</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sowing Date</label>
                  <input
                    type="date"
                    value={sowingDate}
                    onChange={(e) => setSowingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold cursor-pointer hover:scale-105 active:scale-95"
                >
                  Save Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

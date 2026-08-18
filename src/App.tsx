import React, { useState } from "react";
import { Header } from "./components/Header";
import { DecisionSupportView } from "./components/DecisionSupportView";
import { CropDoctorView } from "./components/CropDoctorView";
import { SoilNutrientView } from "./components/SoilNutrientView";
import { FarmDataView } from "./components/FarmDataView";
import { AskFarmAiView } from "./components/AskFarmAiView";
import { INITIAL_FIELDS } from "./data/mockData";
import { FieldRecord } from "./types/agriculture";
import { Sprout } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "dss" | "crop-doctor" | "soil" | "farm-data" | "ask-ai"
  >("dss");
  const [language, setLanguage] = useState<string>("en");
  const [fields, setFields] = useState<FieldRecord[]>(INITIAL_FIELDS);

  // Field handlers
  const handleUpdateField = (updated: FieldRecord) => {
    setFields(fields.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleAddField = (newField: FieldRecord) => {
    setFields([newField, ...fields]);
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  // Count active dry/alert fields
  const unreadAlertCount = fields.filter(
    (f) => f.currentMoisture < 45 || f.healthStatus !== "Optimal"
  ).length;

  return (
    <div className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900 font-sans">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        unreadAlertCount={unreadAlertCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 space-y-6">
        {activeTab === "dss" && (
          <DecisionSupportView
            fields={fields}
            onUpdateField={handleUpdateField}
            language={language}
            onOpenCropDoctor={() => setActiveTab("crop-doctor")}
            onOpenSoilAdvisor={() => setActiveTab("soil")}
          />
        )}

        {activeTab === "crop-doctor" && <CropDoctorView />}

        {activeTab === "soil" && <SoilNutrientView />}

        {activeTab === "farm-data" && (
          <FarmDataView
            fields={fields}
            onAddField={handleAddField}
            onUpdateField={handleUpdateField}
            onDeleteField={handleDeleteField}
          />
        )}

        {activeTab === "ask-ai" && <AskFarmAiView language={language} />}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-900">AgriVision AI</span>
            <span>— Precision Agriculture & Irrigation Decision Support System</span>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-500">
            Automated Farm Management • AI Diagnostic Doctor • Real-time Sensors
          </div>
        </div>
      </footer>
    </div>
  );
}

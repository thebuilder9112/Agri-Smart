import React, { useState } from "react";
import {
  BookOpen,
  Sprout,
  Sun,
  CloudRain,
  Droplets,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Clock,
  Compass,
  ArrowRight,
  Info,
  Sliders,
  Printer,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface CropGuide {
  id: string;
  name: string;
  hindiName: string;
  category: "cereal" | "cash" | "oilseed" | "vegetable" | "pulse" | "millet";
  season: "Kharif" | "Rabi" | "Zaid";
  durationDays: string;
  waterRequirement: "Low (Rainfed)" | "Moderate" | "High (Canal/Tubewell)";
  compatibleSoils: string[];
  idealPh: string;
  seedRate: string;
  expectedYieldAcre: string;
  estimatedProfitAcre: string;
  sowingWindow: string;
  keyPractices: {
    soilPrep: string;
    seedTreatment: string;
    irrigationMilestones: string;
    fertilizerSchedule: string;
    pestManagement: string;
    harvestingTips: string;
  };
}

const CROP_GUIDES_DATA: CropGuide[] = [
  {
    id: "wheat",
    name: "Wheat (Kanak / Gehun)",
    hindiName: "गेहूं की उन्नत वैज्ञानिक खेती",
    category: "cereal",
    season: "Rabi",
    durationDays: "120–140 Days",
    waterRequirement: "Moderate",
    compatibleSoils: ["Alluvial Loam", "Clay Loam", "Black Soil"],
    idealPh: "6.0 – 7.5",
    seedRate: "40–45 kg / Acre (Line sowing with Seed-cum-Fertilizer Drill)",
    expectedYieldAcre: "20–25 Quintals / Acre",
    estimatedProfitAcre: "₹35,000 – ₹48,000 / Acre",
    sowingWindow: "November 1 to November 25 (Optimum)",
    keyPractices: {
      soilPrep: "1 deep ploughing with disc harrow followed by 2 cultivator passes and planking for a fine, level seedbed.",
      seedTreatment: "Treat seed with Carboxin + Thiram (2.5g/kg) or Trichoderma viride (4g/kg) to prevent loose smut and root rot.",
      irrigationMilestones: "5 Critical Stages: 1. Crown Root Initiation (CRI) at 21 days (Most Critical!), 2. Tillering (40-45 days), 3. Jointing (60-65 days), 4. Flowering (80-85 days), 5. Grain Filling (100-105 days).",
      fertilizerSchedule: "Basal: 50 kg DAP + 25 kg MOP + 10 kg Zinc Sulphate (21%). Top-dressing: 50 kg Urea at 1st irrigation (CRI) and 45 kg Urea at 2nd irrigation.",
      pestManagement: "Control Gullidanda (Phalaris minor) with Clodinafop 15% WP (160g/acre) or Pinoxaden at 30-35 DAS. Check for Yellow Rust with Propiconazole 25% EC (200ml/acre).",
      harvestingTips: "Harvest when grains become hard and moisture content drops below 14% to prevent storage insect attacks.",
    },
  },
  {
    id: "paddy-rice",
    name: "Paddy / Basmati Rice (Dhan)",
    hindiName: "धान (बासमती एवं गैर-बासमती) की खेती",
    category: "cereal",
    season: "Kharif",
    durationDays: "115–145 Days",
    waterRequirement: "High (Canal/Tubewell)",
    compatibleSoils: ["Heavy Clayey Soil", "Clay Loam", "Alluvial Silt"],
    idealPh: "5.5 – 7.0",
    seedRate: "6–8 kg/Acre (Nursery transplanting) or 8–10 kg (Direct Seeded Rice - DSR)",
    expectedYieldAcre: "24–30 Quintals (PUSA varieties) / Acre",
    estimatedProfitAcre: "₹45,000 – ₹65,000 / Acre",
    sowingWindow: "Nursery: May 20 – June 15; Transplanting: June 20 – July 15",
    keyPractices: {
      soilPrep: "Puddle soil thoroughly by running rotavator in standing water to form an impermeable hardpan that holds water.",
      seedTreatment: "Soak seed in Carbendazim (1g/L water) + Streptocycline (1g/10L water) for 24 hours to eradicate bacterial blight.",
      irrigationMilestones: "Maintain 2–3 cm standing water for first 15 days after transplanting for weed suppression, then follow alternate wetting and drying (AWD) to save 30% water.",
      fertilizerSchedule: "Basal: 50 kg DAP + 30 kg MOP + 10 kg Zinc. Top-dress Urea in 3 splits at 21, 42, and 60 days.",
      pestManagement: "Monitor Stem Borer and Leaf Folder. Apply Cartap Hydrochloride 4G (7.5 kg/acre) or Chlorantraniliprole 18.5% SC (60ml/acre).",
      harvestingTips: "Drain field 10 days before harvesting when 80% grains turn golden yellow. Avoid delayed harvest to prevent grain shattering.",
    },
  },
  {
    id: "cotton",
    name: "Bt Cotton (Kapas / Narma)",
    hindiName: "कपास (नरमा) की वैज्ञानिक खेती",
    category: "cash",
    season: "Kharif",
    durationDays: "150–180 Days",
    waterRequirement: "Moderate",
    compatibleSoils: ["Deep Black Cotton Soil (Regur)", "Well-Drained Alluvial Loam"],
    idealPh: "6.5 – 8.0",
    seedRate: "2 packets (900g) / Acre (Bt Cotton hybrid)",
    expectedYieldAcre: "10–14 Quintals / Acre",
    estimatedProfitAcre: "₹50,000 – ₹72,000 / Acre",
    sowingWindow: "April 15 to May 20 (Early sowing escapes Pink Bollworm)",
    keyPractices: {
      soilPrep: "Deep summer ploughing to expose hibernating Pink Bollworm pupae to scorching sun, followed by ridging (spacing 90cm x 60cm).",
      seedTreatment: "Hybrid seeds come pre-treated with Imidacloprid/Thiamethoxam; ensure secondary Trichoderma biocontrol.",
      irrigationMilestones: "First irrigation at 30-35 days after sowing; subsequent irrigations at flowering and boll formation (avoid water stress during peak flowering).",
      fertilizerSchedule: "Basal: 40 kg DAP + 30 kg Potash + 10 kg Sulphur. Nitrogen in 3 splits at squaring, flowering, and boll development.",
      pestManagement: "Install Pheromone Traps (5/acre) for Pink Bollworm monitoring. For Whitefly/Jassid, spray Flonicamid 50% WG (60g/acre) or Neem oil 1500 ppm.",
      harvestingTips: "Pick fully opened bolls clean in dry morning hours without dry leaf trash. Store in moisture-free shed.",
    },
  },
  {
    id: "mustard",
    name: "Mustard & Rapeseed (Sarson / Raya)",
    hindiName: "सरसों / राया की उन्नत खेती",
    category: "oilseed",
    season: "Rabi",
    durationDays: "110–135 Days",
    waterRequirement: "Low (Rainfed)",
    compatibleSoils: ["Sandy Loam", "Alluvial Loam", "Light Red Soil"],
    idealPh: "6.0 – 7.5",
    seedRate: "1.5 – 2 kg / Acre (Line sowing with 30cm row spacing)",
    expectedYieldAcre: "8–12 Quintals / Acre",
    estimatedProfitAcre: "₹32,000 – ₹45,000 / Acre",
    sowingWindow: "October 1 to October 25 (Ideal temperature 25–28°C)",
    keyPractices: {
      soilPrep: "Conserve moisture after Kharif harvest with light ploughing and immediate planking to create firm moist seedbed.",
      seedTreatment: "Treat seed with Metalaxyl 35% WS (6g/kg) for White Rust control and Thiamethoxam 70% WS (5g/kg) for early flea beetles.",
      irrigationMilestones: "Only 2 irrigations needed: 1st at Flowering stage (28-35 days) and 2nd at Pod filling stage (60-65 days).",
      fertilizerSchedule: "Basal: 35 kg Urea + 50 kg SSP (Single Super Phosphate supplies vital Sulphur) + 15 kg MOP + 10 kg Bentonite Sulphur (Sulphur increases oil percentage by 2-3%).",
      pestManagement: "Mustard Aphid (Mahu) appears during cloudy weather: Spray Dimethoate 30% EC (300ml/acre) or Thiamethoxam 25% WG (50g/acre) on border rows.",
      harvestingTips: "Harvest early morning when pods turn yellow-brown (moisture ~15%) to avoid pod dehiscence and seed shattering.",
    },
  },
  {
    id: "tomato",
    name: "Tomato & Solanaceous Vegetables",
    hindiName: "टमाटर की वैज्ञानिक एवं संरक्षित खेती",
    category: "vegetable",
    season: "Zaid",
    durationDays: "90–120 Days",
    waterRequirement: "Moderate",
    compatibleSoils: ["Rich Sandy Loam", "Well-Drained Alluvial Soil", "Red Loam"],
    idealPh: "6.0 – 6.8",
    seedRate: "50–80 g / Acre (Hybrid seeds raised in pro-trays in shade-net)",
    expectedYieldAcre: "200–300 Quintals (20–30 Tonnes) / Acre",
    estimatedProfitAcre: "₹80,000 – ₹1,50,000 / Acre",
    sowingWindow: "Rabi Crop: Oct–Nov transplanting; Summer Crop: Jan–Feb transplanting",
    keyPractices: {
      soilPrep: "Raise broad beds (90cm width) and install silver-black plastic mulch (25 micron) with inline drip laterals for 40% water saving.",
      seedTreatment: "Seedling root dip in Pseudomonas fluorescens (10g/L) for 20 minutes before transplanting to prevent bacterial wilt.",
      irrigationMilestones: "Daily drip fertigation (1-2 hours) during morning hours. Maintain consistent root zone moisture to prevent Blossom End Rot.",
      fertilizerSchedule: "Weekly fertigation with water-soluble 19:19:19 (vegetative stage), 12:61:00 (flowering), and 0:0:50 + Calcium Nitrate (fruiting stage).",
      pestManagement: "Install yellow sticky traps (15/acre) for whiteflies transmitting Leaf Curl Virus. Spray Spinetoram 11.7% SC for Fruit Borer.",
      harvestingTips: "Pick at 'Breaker / Pink Stage' for long-distance transport, or 'Red Ripe Stage' for immediate local market supply.",
    },
  },
  {
    id: "chickpea-gram",
    name: "Chickpea / Gram (Desi & Kabuli Chana)",
    hindiName: "चना (देशी एवं काबुली) की दलहनी खेती",
    category: "pulse",
    season: "Rabi",
    durationDays: "100–120 Days",
    waterRequirement: "Low (Rainfed)",
    compatibleSoils: ["Well-Drained Black Soil", "Loam to Sandy Clay Loam"],
    idealPh: "6.0 – 7.8",
    seedRate: "30–35 kg/Acre (Desi Chana) or 40–50 kg/Acre (Kabuli Chana)",
    expectedYieldAcre: "8–12 Quintals / Acre",
    estimatedProfitAcre: "₹30,000 – ₹42,000 / Acre",
    sowingWindow: "October 15 to November 10",
    keyPractices: {
      soilPrep: "Avoid over-pulverizing soil; coarse cloddy seedbed facilitates better aeration for root nodules.",
      seedTreatment: "Mandatory Rhizobium culture (200g/10kg seed) + PSB (Phosphate Solubilizing Bacteria) to fix 30-40 kg atmospheric Nitrogen into soil.",
      irrigationMilestones: "Extremely sensitive to excess water. Only 1-2 light irrigations: at pre-flowering and pod development (DO NOT irrigate during peak flowering).",
      fertilizerSchedule: "Basal: 25 kg DAP + 15 kg MOP + 10 kg Gypsum. Minimal Urea needed due to self-nitrogen fixing root nodules.",
      pestManagement: "Gram Pod Borer (Helicoverpa armigera) is main threat: Install 'T-shaped bird perches' (20/acre) + NPV virus (250 LE/acre) or Emamectin Benzoate 5% SG (80g/acre).",
      harvestingTips: "Nipping / topping of shoot tips at 30-35 DAS increases branching and pod count by 20%. Harvest when foliage turns straw-brown.",
    },
  },
  {
    id: "millets-bajra",
    name: "Pearl Millet & Millets (Bajra / Jowar / Ragi)",
    hindiName: "बाजरा एवं पोषक अनाज (श्रीअन्न) की खेती",
    category: "millet",
    season: "Kharif",
    durationDays: "75–90 Days",
    waterRequirement: "Low (Rainfed)",
    compatibleSoils: ["Sandy Soils", "Light Loams", "Low Fertility Arid Soils"],
    idealPh: "6.5 – 8.5",
    seedRate: "1.5 – 2 kg / Acre (Hybrid Bajra)",
    expectedYieldAcre: "12–16 Quintals / Acre",
    estimatedProfitAcre: "₹25,000 – ₹38,000 / Acre",
    sowingWindow: "July 1 to July 20 (With onset of Monsoon)",
    keyPractices: {
      soilPrep: "Minimal tillage required; 1 ploughing with cultivator and planking preserves sub-soil moisture in drylands.",
      seedTreatment: "Brine solution (10% salt) floating test to eliminate ergot sclerotia, followed by Azospirillum bio-fertilizer coating.",
      irrigationMilestones: "Highly drought tolerant; thrives in rainfed conditions (350–500 mm rain). 1 critical life-saving irrigation at grain filling if drought occurs.",
      fertilizerSchedule: "Basal: 30 kg DAP + 15 kg Potash. Top-dress 25 kg Urea at 30 days after thinning/weeding.",
      pestManagement: "Blast and Downy Mildew: Spray Metalaxyl + Mancozeb (2g/L). Shoot fly managed through early sowing within 10 days of monsoon.",
      harvestingTips: "Harvest earheads separately when grains are hard and foliage is still greenish for superior cattle fodder quality.",
    },
  },
];

const SOIL_TYPES_DATA = [
  {
    name: "Alluvial Loam Soil (जलोढ़ मिट्टी)",
    distribution: "Indo-Gangetic Plains (Punjab, Haryana, UP, Bihar, Bengal, Coastal Deltas)",
    texture: "Loamy, rich in silt, moderate organic matter, high moisture retention",
    phRange: "6.5 – 7.8 (Neutral to slightly alkaline)",
    richIn: "Potash (K), Phosphoric Acid, Lime",
    deficientIn: "Nitrogen (N) and Organic Humus",
    bestCrops: ["Wheat", "Paddy Rice", "Sugarcane", "Mustard", "Potato", "Maize", "Vegetables"],
    improvementTips: "Incorporate green manure (Dhaincha/Sunhemp) and apply split doses of Nitrogen + Zinc Sulphate for maximum response.",
  },
  {
    name: "Black Cotton Soil / Regur (काली मिट्टी)",
    distribution: "Deccan Plateau (Maharashtra, Gujarat, MP, Northern Karnataka, Andhra)",
    texture: "Heavy clay, high self-aerating cracks in summer, high swelling and water holding",
    phRange: "7.2 – 8.5 (Slightly alkaline)",
    richIn: "Calcium, Magnesium, Carbonates, Potash, Iron",
    deficientIn: "Nitrogen, Phosphorus, and Organic matter",
    bestCrops: ["Bt Cotton", "Soybean", "Gram / Chickpea", "Wheat (under irrigation)", "Citrus / Sweet Lime"],
    improvementTips: "Avoid waterlogging; use Broad Bed Furrow (BBF) systems and apply single super phosphate (SSP) for phosphorus boost.",
  },
  {
    name: "Red & Yellow Soil (लाल मिट्टी)",
    distribution: "Tamil Nadu, Karnataka, Southern Odisha, Jharkhand, Telangana",
    texture: "Porous, sandy to clay loam, reddish due to ferric oxide diffusion",
    phRange: "5.5 – 6.8 (Slightly acidic to neutral)",
    richIn: "Iron and Potash",
    deficientIn: "Nitrogen, Phosphorus, Humus, and Lime",
    bestCrops: ["Groundnut (Peanut)", "Millets (Ragi/Bajra)", "Pulses (Red Gram/Tur)", "Tobacco", "Oilseeds"],
    improvementTips: "Apply lime / dolomite to correct acidity and add generous Farmyard Manure (FYM) to enhance water retention.",
  },
  {
    name: "Sandy Loam & Desert Soil (बलुई दोमट)",
    distribution: "Western Rajasthan, Southern Punjab & Haryana, Northern Gujarat",
    texture: "Coarse sand particles, rapid water infiltration, low water retention",
    phRange: "7.0 – 8.5 (Alkaline)",
    richIn: "Soluble salts and Calcium",
    deficientIn: "Organic Carbon, Nitrogen, and Moisture",
    bestCrops: ["Pearl Millet (Bajra)", "Guar (Cluster Bean)", "Mustard", "Cumin (Jeera)", "Isabgol", "Pomegranate"],
    improvementTips: "Adopt Drip Irrigation exclusively, use plastic mulching to cut evaporation by 50%, and incorporate biochar or vermicompost.",
  },
];

export const FarmingGuidesView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"crop-advisor" | "cultivation-guides" | "soil-matrix" | "modern-methods">("crop-advisor");
  const [searchQuery, setSearchQuery] = useState("");
  const [seasonFilter, setSeasonFilter] = useState<string>("All");
  const [soilFilter, setSoilFilter] = useState<string>("All");
  const [selectedGuideId, setSelectedGuideId] = useState<string>("wheat");

  const filteredCrops = CROP_GUIDES_DATA.filter((crop) => {
    const matchesSeason = seasonFilter === "All" || crop.season === seasonFilter;
    const matchesSoil = soilFilter === "All" || crop.compatibleSoils.some((s) => s.toLowerCase().includes(soilFilter.toLowerCase()));
    const matchesSearch =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.compatibleSoils.join(" ").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeason && matchesSoil && matchesSearch;
  });

  const currentCrop = CROP_GUIDES_DATA.find((c) => c.id === selectedGuideId) || CROP_GUIDES_DATA[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* DISCLAIMER BANNER */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-950 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong className="font-bold text-amber-900 block mb-0.5">
            Student Study & Agronomy Reference Disclaimer:
          </strong>
          These farming guides, crop recommendations, and soil compatibility articles are structured educational materials created for student study, science exhibition demos, and academic learning. In real-world farm fields, farmers must adjust fertilizer and pesticide doses based on individual certified Soil Health Card laboratory reports and local agro-climatic conditions.
        </div>
      </div>

      {/* HEADER BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Agronomy Knowledge Base & Crop Selection Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
              Farming Guides & Crop Selection Advisor
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Step-by-step masterclasses on which crop to grow, optimal soil types, sowing schedules, fertilizer timings, irrigation milestones, and sustainable farming practices.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Print Farming Guide
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: "crop-advisor", label: "🌱 Crop Selection Advisor" },
            { id: "cultivation-guides", label: "📖 Step-by-Step Crop Guides" },
            { id: "soil-matrix", label: "🌍 Soil Types & Crop Compatibility" },
            { id: "modern-methods", label: "⚡ Sustainable & Modern Techniques" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeSubTab === tab.id
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUBTAB 1: CROP SELECTION ADVISOR */}
      {activeSubTab === "crop-advisor" && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Filter by Agricultural Season:
                </label>
                <select
                  value={seasonFilter}
                  onChange={(e) => setSeasonFilter(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Seasons (Kharif, Rabi, Zaid)</option>
                  <option value="Kharif">Kharif (Monsoon: Paddy, Cotton, Bajra)</option>
                  <option value="Rabi">Rabi (Winter: Wheat, Mustard, Gram)</option>
                  <option value="Zaid">Zaid (Summer: Tomato, Vegetables, Moong)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Filter by Field Soil Type:
                </label>
                <select
                  value={soilFilter}
                  onChange={(e) => setSoilFilter(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Soil Types</option>
                  <option value="Alluvial">Alluvial Loam (Indo-Gangetic)</option>
                  <option value="Black">Black Cotton Soil (Deccan)</option>
                  <option value="Sandy">Sandy Loam / Light Soil</option>
                  <option value="Clay">Heavy Clayey Soil</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Quick Search Crop:
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search wheat, cotton, mustard..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Crop Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCrops.map((crop) => (
              <div
                key={crop.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {crop.season} Season • {crop.durationDays}
                    </span>
                    <span className="text-[11px] font-extrabold text-slate-500">
                      {crop.category.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">{crop.name}</h3>
                  <span className="text-xs text-slate-500 font-medium block">{crop.hindiName}</span>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Water Need:</span>
                      <strong className="text-slate-900">{crop.waterRequirement}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Ideal Soil:</span>
                      <strong className="text-slate-900 text-[11px]">{crop.compatibleSoils[0]}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Expected Yield:</span>
                      <strong className="text-emerald-700">{crop.expectedYieldAcre}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Estimated Profit:</span>
                      <strong className="text-emerald-800 font-bold">{crop.estimatedProfitAcre}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedGuideId(crop.id);
                      setActiveSubTab("cultivation-guides");
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Read Full Cultivation Masterclass</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: DETAILED STEP-BY-STEP CULTIVATION GUIDES */}
      {activeSubTab === "cultivation-guides" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar Crop Selector */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block px-2 mb-2">
              Select Crop Masterclass:
            </span>
            <div className="space-y-1">
              {CROP_GUIDES_DATA.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedGuideId(crop.id)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    selectedGuideId === crop.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div>
                    <span className="block">{crop.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{crop.season} Crop</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Main Guide Deep Dive */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {currentCrop.season} Season • {currentCrop.durationDays}
                </span>
                <span className="text-xs font-bold text-slate-500">{currentCrop.hindiName}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">{currentCrop.name} Complete Agronomy Guide</h2>
              <p className="text-xs text-slate-500">
                Sowing Window: <strong>{currentCrop.sowingWindow}</strong> • Seed Rate: <strong>{currentCrop.seedRate}</strong>
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block">Soil pH:</span>
                <span className="text-xs font-black text-slate-800">{currentCrop.idealPh}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block">Water Need:</span>
                <span className="text-xs font-black text-slate-800">{currentCrop.waterRequirement}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 block">Yield / Acre:</span>
                <span className="text-xs font-black text-emerald-900">{currentCrop.expectedYieldAcre}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 block">Profit / Acre:</span>
                <span className="text-xs font-black text-emerald-900">{currentCrop.estimatedProfitAcre}</span>
              </div>
            </div>

            {/* 6 Step-by-Step Sections */}
            <div className="space-y-4">
              {/* Step 1: Soil Prep */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  1. Field & Soil Preparation
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {currentCrop.keyPractices.soilPrep}
                </p>
              </div>

              {/* Step 2: Seed Treatment */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  2. Seed Inoculation & Treatment
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {currentCrop.keyPractices.seedTreatment}
                </p>
              </div>

              {/* Step 3: Irrigation */}
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-1.5">
                <h4 className="text-xs font-extrabold text-sky-950 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  3. Critical Irrigation Milestones
                </h4>
                <p className="text-xs text-sky-950 leading-relaxed font-medium">
                  {currentCrop.keyPractices.irrigationMilestones}
                </p>
              </div>

              {/* Step 4: Fertilizer */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <h4 className="text-xs font-extrabold text-emerald-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  4. Nutrient & Fertilizer Schedule (N-P-K & Micronutrients)
                </h4>
                <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                  {currentCrop.keyPractices.fertilizerSchedule}
                </p>
              </div>

              {/* Step 5: Pest Management */}
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
                <h4 className="text-xs font-extrabold text-rose-950 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  5. Integrated Pest & Disease Management
                </h4>
                <p className="text-xs text-rose-950 leading-relaxed font-medium">
                  {currentCrop.keyPractices.pestManagement}
                </p>
              </div>

              {/* Step 6: Harvesting */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                <h4 className="text-xs font-extrabold text-amber-950 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  6. Optimal Harvesting & Storage
                </h4>
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  {currentCrop.keyPractices.harvestingTips}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SOIL TYPES & CROP COMPATIBILITY MATRIX */}
      {activeSubTab === "soil-matrix" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SOIL_TYPES_DATA.map((soil, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-base font-extrabold text-slate-900">{soil.name}</h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    pH {soil.phRange}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 block">Major Geography:</span>
                    <span className="text-slate-800 font-medium">{soil.distribution}</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 block">Texture & Properties:</span>
                    <span className="text-slate-800 font-medium">{soil.texture}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-950">
                      <span className="font-bold block text-[10px] text-emerald-800">Rich In:</span>
                      <span>{soil.richIn}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-rose-50 text-rose-950">
                      <span className="font-bold block text-[10px] text-rose-800">Deficient In:</span>
                      <span>{soil.deficientIn}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="font-bold text-slate-900 block mb-1">Top Thriving Crops:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {soil.bestCrops.map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md text-[11px] font-semibold border border-slate-200"
                        >
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                    <strong>Improvement Strategy:</strong> {soil.improvementTips}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: MODERN & SUSTAINABLE METHODS */}
      {activeSubTab === "modern-methods" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-600" />
              1. Drip Irrigation & Fertigation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Delivers water and dissolved liquid nutrients directly to the root zone via emitters. Saves 40–50% irrigation water, prevents weed growth in inter-row spaces, and ensures 95% fertilizer absorption efficiency compared to broadcast methods.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              2. Zero Tillage & Happy Seeder (Direct Sowing)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Sows wheat directly into standing paddy stubble without burning or prior land preparation. Saves ₹2,500/acre in tractor diesel costs, advances wheat sowing by 10 days, and preserves soil moisture and beneficial earthworms.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              3. Green Manuring & Dhaincha (Sesbania)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Growing Dhaincha (Sesbania aculeata) for 45 days in summer and incorporating it into soil before Kharif paddy adds 20–25 tonnes of green biomass and fixes ~60–80 kg biological Nitrogen per hectare, dramatically lowering chemical Urea dependency.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              4. Integrated Pest Management (IPM)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Combines yellow sticky traps (for whiteflies/aphids), pheromone delta traps (for bollworms), bird perches, and biological Trichoderma/Neem sprays. Prevents chemical pesticide resistance while slashing input costs by 35%.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

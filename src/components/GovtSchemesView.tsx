import React, { useState } from "react";
import {
  Landmark,
  ShieldCheck,
  Droplets,
  Zap,
  Cpu,
  Sprout,
  DollarSign,
  Search,
  ExternalLink,
  PhoneCall,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  Calculator,
  ArrowRight,
  Printer,
  ShoppingBag,
  Store,
  Truck,
  Building2,
} from "lucide-react";
import { useTranslation } from "../data/translations";

interface GovtScheme {
  id: string;
  name: string;
  hindiName: string;
  category: "financial" | "insurance" | "irrigation" | "machinery" | "soil" | "market" | "digital";
  categoryLabel: string;
  tagline: string;
  primaryBenefit: string;
  subsidyRate: string;
  targetGroup: string;
  eligibility: string[];
  documentsRequired: string[];
  applicationSteps: string[];
  officialPortal: string;
  helpline: string;
  recentUpdate: string;
}

const GOVT_SCHEMES_DATA: GovtScheme[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    hindiName: "प्रधानमंत्री किसान सम्मान निधि योजना",
    category: "financial",
    categoryLabel: "Direct Income Support",
    tagline: "₹6,000 direct annual financial assistance in 3 equal installments of ₹2,000.",
    primaryBenefit: "₹6,000 per year transferred directly to farmer's Aadhaar-seeded bank account via DBT.",
    subsidyRate: "100% Central Government Funded",
    targetGroup: "All landholding farmer families across India (Subject to exclusion criteria).",
    eligibility: [
      "Farmer family holding cultivable agricultural land in their name.",
      "Aadhaar-seeded bank account with e-KYC completed.",
      "Land records mapped and verified on state revenue portals.",
      "Exclusions: Institutional landholders, constitutional post holders, serving/retired government employees, income tax payees.",
    ],
    documentsRequired: [
      "Aadhaar Card of the applicant farmer.",
      "Land Ownership Documents (7/12, 8A, Khasra/Khatauni, Jamabandi).",
      "Bank Account Passbook (with IFSC and Aadhaar link).",
      "Active Mobile number linked to Aadhaar for OTP authentication.",
    ],
    applicationSteps: [
      "Visit official portal pmkisan.gov.in and click on 'New Farmer Registration'.",
      "Enter Aadhaar Number and select State, enter captcha and verify OTP.",
      "Fill landholding details (Khasra No., Khata No., Land Area) and bank account IFSC.",
      "Complete facial e-KYC or OTP e-KYC on PM-KISAN mobile app / portal.",
      "Can also apply in-person through nearest Common Service Centre (CSC) or Krishi Bhavan.",
    ],
    officialPortal: "https://pmkisan.gov.in",
    helpline: "155261 / 011-24300606 (Toll-Free PM-KISAN Helpline)",
    recentUpdate: "Mandatory e-KYC and land-seeding completed for all upcoming installment releases.",
  },
  {
    id: "pmfby",
    name: "PM Fasal Bima Yojana (PMFBY)",
    hindiName: "प्रधानमंत्री फसल बीमा योजना",
    category: "insurance",
    categoryLabel: "Crop Insurance & Disaster Relief",
    tagline: "Comprehensive crop insurance shield against drought, floods, hailstorms, pests, and post-harvest losses.",
    primaryBenefit: "Full sum insured payout with minimal farmer premium (1.5% Rabi, 2% Kharif, 5% Commercial crops).",
    subsidyRate: "Up to 90% premium subsidized jointly by Central & State Governments.",
    targetGroup: "All farmers (loanee and non-loanee, sharecroppers, tenant farmers) growing notified crops.",
    eligibility: [
      "Farmers growing notified crops in notified insurance units/blocks.",
      "Non-loanee farmers can voluntarily enroll through CSC, bank branch, or PMFBY portal.",
      "Must enroll before the seasonal cutoff date (typically July 31 for Kharif, Dec 31 for Rabi).",
    ],
    documentsRequired: [
      "Aadhaar Card / Photo ID Proof.",
      "Land Possession Certificate / Sowing Certificate (issued by Patwari/Sarpanch).",
      "Land tenancy agreement (for tenant farmers/sharecroppers).",
      "Bank Account details with cancelled cheque.",
    ],
    applicationSteps: [
      "Login to pmfby.gov.in or download the 'Crop Insurance' mobile app.",
      "Select State, Season (Kharif/Rabi), Year, and Crop.",
      "Upload Sowing Certificate and Land Possession record.",
      "Pay nominal farmer share premium online via UPI/NetBanking or visit bank branch.",
      "In case of localized disaster/pest loss, report within 72 hours via Crop Insurance App or toll-free number.",
    ],
    officialPortal: "https://pmfby.gov.in",
    helpline: "14447 / 1800-200-5142 (Farmer Crop Insurance Helpline)",
    recentUpdate: "Revamped PMFBY includes 'Meri Policy Mere Hath' doorstep delivery and tech-driven yield estimation using satellite drones.",
  },
  {
    id: "pm-kusum",
    name: "PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)",
    hindiName: "पीएम कुसुम योजना (सोलर कृषि पंप)",
    category: "irrigation",
    categoryLabel: "Solar Irrigation & Green Energy",
    tagline: "Subsidized solar agriculture pumps & feeder solarization to replace diesel tubewells.",
    primaryBenefit: "Up to 60% subsidy on Standalone Solar Agriculture Pumps (Component B) and extra income by selling solar power back to grid (Component A & C).",
    subsidyRate: "60% Subsidy (30% Centre + 30% State), 30% Bank Loan, 10% Farmer Share.",
    targetGroup: "Farmers, farmer groups, cooperatives, panchayats, and water user associations with farmland needing irrigation.",
    eligibility: [
      "Farmers having cultivable land with borewell/dug well or surface water source.",
      "Preference given to small/marginal farmers and farmers currently dependent on diesel pumps.",
      "Grid-connected farmers can solarize existing agricultural pumps under Component C.",
    ],
    documentsRequired: [
      "Aadhaar Card and Identity Proof.",
      "Land ownership document (7/12, Khatoni) showing water source.",
      "Electricity bill (if applying for grid-tied pump solarization Component C).",
      "Bank account passbook for subsidy credit.",
    ],
    applicationSteps: [
      "Apply through State Renewable Energy Agency portal (e.g., PEDA in Punjab, MEDA in Maharashtra, UPNEDA in UP, GEDA in Gujarat).",
      "Register farmer profile with Aadhaar and land details.",
      "Select desired pump capacity (3 HP, 5 HP, 7.5 HP or 10 HP solar pump).",
      "Deposit 10% farmer contribution after departmental site verification.",
      "Authorized empaneled solar vendor installs panels, solar VFD controller, and DC pump.",
    ],
    officialPortal: "https://pmkusum.mnre.gov.in",
    helpline: "1800-180-3333 (Ministry of New and Renewable Energy Helpline)",
    recentUpdate: "PM-KUSUM expanded to provide universal feeder level solarization, drastically reducing daytime agricultural power cuts.",
  },
  {
    id: "pmksy",
    name: "PM Krishi Sinchayee Yojana (PMKSY) – Per Drop More Crop",
    hindiName: "प्रधानमंत्री कृषि सिंचाई योजना (प्रति बूंद अधिक फसल)",
    category: "irrigation",
    categoryLabel: "Micro-Irrigation & Drip Subsidies",
    tagline: "High-subsidy drip and sprinkler irrigation systems to maximize water use efficiency.",
    primaryBenefit: "45% to 55% financial subsidy for installing micro-irrigation systems (drip lines, micro-sprinklers, fertigation units).",
    subsidyRate: "55% for Small & Marginal Farmers; 45% for Other Farmers.",
    targetGroup: "All farmers owning cultivable agricultural land with assured irrigation water source.",
    eligibility: [
      "Farmers having agricultural land with functional tubewell/borewell/farm pond.",
      "All crop categories eligible (Horticulture, Vegetables, Sugarcane, Cotton, Orchards).",
    ],
    documentsRequired: [
      "Land records (7/12 extract, Khasra copy).",
      "Aadhaar Card & Passport-sized photo.",
      "Soil and water test certificate (from nearest KVK/Govt lab).",
      "Bank passbook.",
    ],
    applicationSteps: [
      "Register on State Horticulture / Agriculture Department DBT portal (e.g. Mahadbt, e-Horticulture UP, etc.).",
      "Choose registered micro-irrigation vendor (Jain Irrigation, Netafim, EPC, etc.).",
      "Department officer conducts field survey and issues technical sanction.",
      "Vendor installs drip system and GPS-tagged photos are uploaded for subsidy release.",
    ],
    officialPortal: "https://pmksy.gov.in",
    helpline: "1800-180-1551 (Kisan Call Centre)",
    recentUpdate: "Integrated with fertigation & water sensor monitoring systems to save up to 40% water and 30% fertilizer.",
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC) & Interest Subvention",
    hindiName: "किसान क्रेडिट कार्ड (सस्ती ब्याज दर पर ऋण)",
    category: "financial",
    categoryLabel: "Concessional Crop Loans",
    tagline: "Short-term institutional credit at an effective 4% interest rate with prompt repayment.",
    primaryBenefit: "Working capital loan up to ₹3 Lakh at nominal 7% interest with 3% prompt repayment incentive (effective rate only 4%). Collateral-free up to ₹1.6 Lakh.",
    subsidyRate: "3% Interest Subvention for Prompt Repayers",
    targetGroup: "All farmers, sharecroppers, dairy farmers, fishers, and self-help groups.",
    eligibility: [
      "All individual land-owner farmers, joint borrowers, tenant farmers, and oral lessees.",
      "Animal husbandry and fisheries farmers also eligible up to ₹2 Lakh sub-limit.",
    ],
    documentsRequired: [
      "Duly filled KCC application form.",
      "Identity Proof (Aadhaar / Voter ID / PAN).",
      "Land record document (Revenue record certified by Patwari).",
      "Cropping pattern declaration for the current agricultural season.",
    ],
    applicationSteps: [
      "Approach nearest commercial bank, Regional Rural Bank (RRB), or Cooperative Bank.",
      "Submit 1-page simplified KCC form along with land records.",
      "Bank processes and issues RuPay KCC card within 14 days.",
      "Card can be used at ATM, PoS machines, and fertilizer retail points.",
    ],
    officialPortal: "https://myscheme.gov.in/schemes/kcc",
    helpline: "1800-11-2211 / 1800-425-3800 (SBI Agricultural Banking Helpline)",
    recentUpdate: "KCC saturation campaigns running across all Gram Panchayats to ensure every farmer has a credit line.",
  },
  {
    id: "smam",
    name: "Sub-Mission on Agricultural Mechanization (SMAM) & Kisan Drones",
    hindiName: "कृषि यंत्रीकरण उप-मिशन एवं किसान ड्रोन योजना",
    category: "machinery",
    categoryLabel: "Farm Machinery & Drone Subsidies",
    tagline: "40% to 50% subsidy on tractors, power tillers, seed drills, harvesters, and up to ₹5 Lakh on Kisan Drones.",
    primaryBenefit: "Direct financial grant for purchasing farm implements and setting up Custom Hiring Centres (CHC) for farm machinery.",
    subsidyRate: "40% to 50% on Individual Machinery; Up to 80% on Custom Hiring Centres; 50% on Kisan Drones.",
    targetGroup: "Individual farmers (Special priority to SC, ST, Small, Marginal, and Women farmers) & FPOs.",
    eligibility: [
      "Must not have availed subsidy for the same equipment in the previous 5 to 7 years.",
      "Registered farmer with landholding in the state.",
    ],
    documentsRequired: [
      "Aadhaar Card.",
      "Land Ownership papers (Khatauni / Jamabandi).",
      "Bank details and valid driving license (if purchasing tractor/power tiller).",
      "Caste certificate (for SC/ST additional subsidy).",
    ],
    applicationSteps: [
      "Register on Central mechanization portal: agrimachinery.nic.in.",
      "Select state, district, and required machine category (e.g. Laser Land Leveler, Rotavator, Drone).",
      "Upload dealer quotation and wait for departmental lottery / approval.",
      "Purchase machine from authorized dealer and submit invoice for direct DBT subsidy.",
    ],
    officialPortal: "https://agrimachinery.nic.in",
    helpline: "011-23382926 (Mechanization & Technology Division, MoA&FW)",
    recentUpdate: "Special financial grant up to ₹10 Lakh for ICAR institutes and FPOs to demonstrate precision drone pesticide spraying.",
  },
  {
    id: "soil-health-card",
    name: "Soil Health Card Scheme (SHC)",
    hindiName: "मृदा स्वास्थ्य कार्ड योजना",
    category: "soil",
    categoryLabel: "Soil Testing & Nutrient Management",
    tagline: "Free 12-parameter soil testing to deliver crop-wise fertilizer dosage recommendations.",
    primaryBenefit: "Personalized report card issued every 2 years indicating exact Nitrogen (N), Phosphorus (P), Potassium (K), Sulphur, Zinc, Boron, pH, and Organic Carbon levels.",
    subsidyRate: "100% Free Soil Sampling & Laboratory Testing",
    targetGroup: "All farmers across all agro-climatic zones in India.",
    eligibility: [
      "Any farmer possessing agricultural land.",
    ],
    documentsRequired: [
      "Aadhaar Card.",
      "Field Khasra number and village name.",
      "Previous crop and proposed crop details.",
    ],
    applicationSteps: [
      "Agriculture department soil sampling team collects soil core samples using GPS coordinates.",
      "Samples are analyzed at district Soil Testing Laboratories (STLs).",
      "Printed card is handed to farmer or downloaded from soilhealth.dac.gov.in.",
    ],
    officialPortal: "https://soilhealth.dac.gov.in",
    helpline: "1800-180-1551 (Kisan Call Centre)",
    recentUpdate: "Digital Soil Health Cards integrated with mobile app for instant fertilizer calculation based on current prices.",
  },
  {
    id: "pkvy",
    name: "Paramparagat Krishi Vikas Yojana (PKVY) & Natural Farming",
    hindiName: "परंपरागत कृषि विकास योजना एवं प्राकृतिक खेती",
    category: "soil",
    categoryLabel: "Organic & Natural Farming Aid",
    tagline: "₹50,000 per hectare financial aid for adopting certified organic & cow-based natural farming.",
    primaryBenefit: "₹31,000/ha provided directly for organic inputs (Jeevamrut, Neemastra, Vermicompost, bio-fertilizers) plus ₹8,800/ha for post-harvest branding and packaging.",
    subsidyRate: "₹50,000 per Hectare for 3-Year Conversion Period",
    targetGroup: "Farmer clusters (minimum 20 hectares) and individual organic growers.",
    eligibility: [
      "Farmers willing to form clusters of 20 to 50 farmers for Participatory Guarantee System (PGS-India) organic certification.",
    ],
    documentsRequired: [
      "Aadhaar Card and Land Records.",
      "Cluster membership resolution.",
      "Bank passbook for cluster/individual DBT transfer.",
    ],
    applicationSteps: [
      "Form a farmer group of 20+ members and contact local Block Agricultural Officer (BAO) or KVK.",
      "Register group on PGS-India portal (pgsindia-ncof.gov.in).",
      "Adopt organic farming practices, maintain peer inspection records, and receive certification.",
    ],
    officialPortal: "https://pgsindia-ncof.gov.in",
    helpline: "0120-2764906 (National Centre for Organic & Natural Farming)",
    recentUpdate: "National Mission on Natural Farming (NMNF) scaling up along 5km corridor on either side of River Ganga.",
  },
  {
    id: "enam",
    name: "e-NAM (National Agriculture Market)",
    hindiName: "ई-नाम (राष्ट्रीय कृषि बाजार)",
    category: "market",
    categoryLabel: "Transparent Trading & MSP",
    tagline: "Pan-India electronic trading portal uniting 1,361+ regulated APMC mandis.",
    primaryBenefit: "Eliminates local middlemen, transparent electronic bidding, instant online payment directly into farmer's bank account, and access to nationwide buyers.",
    subsidyRate: "Zero Registration Fee for Farmers; Free Quality Assay Testing",
    targetGroup: "All farmers selling foodgrains, pulses, oilseeds, fruits, vegetables, and spices.",
    eligibility: [
      "Any farmer bringing produce to an e-NAM integrated APMC mandi.",
    ],
    documentsRequired: [
      "Aadhaar Card and Bank Passbook copy.",
      "Mobile number for receiving SMS trade slip and payment alerts.",
    ],
    applicationSteps: [
      "Register online at enam.gov.in or at the e-NAM gate entry counter at your local mandi.",
      "Produce sample undergoes electronic assaying (moisture, foreign matter, purity test).",
      "Lot is listed on e-NAM digital bidding screen viewed by traders across India.",
      "Farmer accepts highest bid and receives payment in bank account within 24 hours.",
    ],
    officialPortal: "https://enam.gov.in",
    helpline: "1800-270-0224 (e-NAM Toll-Free Helpline)",
    recentUpdate: "e-NAM integrated with FPO trading module and warehouse-based trading via e-NWR receipts.",
  },
  {
    id: "aif",
    name: "Agriculture Infrastructure Fund (AIF)",
    hindiName: "कृषि अवसंरचना कोष (गोदाम एवं कोल्ड स्टोरेज ऋण)",
    category: "market",
    categoryLabel: "Post-Harvest Infrastructure",
    tagline: "₹1 Lakh Crore financing facility for building cold storage, packhouses, silos, and primary processing units.",
    primaryBenefit: "3% per annum interest subvention on loans up to ₹2 Crore for a maximum tenure of 7 years, with credit guarantee coverage under CGTMSE.",
    subsidyRate: "3% Interest Subvention + CGTMSE Fee Coverage",
    targetGroup: "Farmers, FPOs, PACS, Agri-entrepreneurs, and Startups.",
    eligibility: [
      "Projects creating post-harvest management infrastructure and community farming assets.",
    ],
    documentsRequired: [
      "Detailed Project Report (DPR).",
      "Land title or long-term lease agreement (minimum 10 years).",
      "Aadhaar, PAN, and 3-year bank statements.",
    ],
    applicationSteps: [
      "Register and submit project proposal on agriinfra.dac.gov.in.",
      "Ministry evaluates and sends application to chosen commercial or cooperative bank.",
      "Bank sanctions loan and 3% interest subvention is automatically credited.",
    ],
    officialPortal: "https://agriinfra.dac.gov.in",
    helpline: "011-23381012 (AIF Project Management Unit)",
    recentUpdate: "Expanded to cover primary processing machinery and drone service hubs under community infrastructure.",
  },
  {
    id: "gem-gov",
    name: "GeM - Government e-Marketplace (National Procurement Portal)",
    hindiName: "गवर्नमेंट ई-मार्केटप्लेस (सरकारी खरीद एवं बिक्री पोर्टल)",
    category: "market",
    categoryLabel: "Govt Direct Buy & Sell Portal",
    tagline: "Official Government of India portal for farmers & FPOs to buy subsidized equipment & sell farm produce directly to Govt.",
    primaryBenefit: "Direct purchase of certified tractors, solar pumps, drip kits & direct sale of agricultural produce to Central/State Govt bodies with 0% middleman commission.",
    subsidyRate: "Transparent Govt Contract Wholesale Rates + 100% DBT Payment",
    targetGroup: "Individual Farmers, Farmer Producer Organisations (FPOs), Primary Agriculture Credit Societies (PACS), SHGs, and Rural Artisans.",
    eligibility: [
      "Farmers seeking to buy government-certified agricultural implements, solar pumps, and greenhouse equipment.",
      "FPOs and farmers wanting to register as verified sellers to supply food grains, pulses, millets, fresh vegetables, and fruits to Indian Railways, Defence Canteens, Kendriya Vidyalayas, and State Hostels.",
      "Requires active Aadhaar, Bank Account, PAN / Udyam / FPO Registration number.",
    ],
    documentsRequired: [
      "Aadhaar Card of applicant / FPO Director.",
      "Bank Account details (Cancelled Cheque with IFSC).",
      "PAN Card (Individual or FPO/Society PAN).",
      "Land Record / FSSAI License (for selling food items) or Farmer ID.",
    ],
    applicationSteps: [
      "Visit the official Government e-Marketplace portal at https://gem.gov.in.",
      "Click on 'Sign Up' and select 'Buyer' (for institutional/scheme purchase) or 'Seller' -> 'Farmer/FPO/Self Help Group'.",
      "Complete Aadhaar-based OTP verification and create your user profile.",
      "List your agricultural commodities or browse registered OEM equipment catalogs.",
      "Receive guaranteed government payments directly into your bank account within 10 days of delivery.",
    ],
    officialPortal: "https://gem.gov.in",
    helpline: "1800-419-3436 / 1800-102-3436 (GeM Helpdesk Toll-Free)",
    recentUpdate: "Special onboarding track launched for 10,000+ FPOs to supply directly to Indian Armed Forces and Railway Catering.",
  },
];

interface GovtSchemesViewProps {
  language?: string;
}

export const GovtSchemesView: React.FC<GovtSchemesViewProps> = ({ language = "en" }) => {
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>("pm-kisan");

  // Subsidy Estimator State
  const [farmerLandCategory, setFarmerLandCategory] = useState<"marginal" | "small" | "medium" | "large">("small");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("drip");
  const [calculatedSubsidy, setCalculatedSubsidy] = useState<{ percent: number; estimatedAmt: string; schemeName: string } | null>(null);

  // Handle Subsidy Calculation
  const handleCalculateSubsidy = () => {
    let percent = 50;
    let estimatedAmt = "₹35,000";
    let schemeName = "PMKSY Per Drop More Crop";

    if (selectedEquipment === "drip") {
      percent = farmerLandCategory === "marginal" || farmerLandCategory === "small" ? 55 : 45;
      estimatedAmt = farmerLandCategory === "marginal" ? "₹42,000 / ha" : "₹36,000 / ha";
      schemeName = "PM Krishi Sinchayee Yojana (PMKSY)";
    } else if (selectedEquipment === "solar-pump") {
      percent = 60;
      estimatedAmt = "₹1,45,000 (for 5 HP DC Solar Pump)";
      schemeName = "PM-KUSUM Component B";
    } else if (selectedEquipment === "rotavator") {
      percent = farmerLandCategory === "marginal" || farmerLandCategory === "small" ? 50 : 40;
      estimatedAmt = "₹45,000 (SMAM Machinery Subsidy)";
      schemeName = "Sub-Mission on Agricultural Mechanization (SMAM)";
    } else if (selectedEquipment === "drone") {
      percent = 50;
      estimatedAmt = "₹5,00,000 (Kisan Drone Subsidy)";
      schemeName = "Kisan Drone Promotion Scheme";
    } else if (selectedEquipment === "organic") {
      percent = 100;
      estimatedAmt = "₹50,000 / ha (Over 3 years)";
      schemeName = "Paramparagat Krishi Vikas Yojana (PKVY)";
    }

    setCalculatedSubsidy({ percent, estimatedAmt, schemeName });
  };

  const filteredSchemes = GOVT_SCHEMES_DATA.filter((scheme) => {
    const matchesCategory = selectedCategory === "all" || scheme.category === selectedCategory;
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.primaryBenefit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Landmark className="w-4 h-4 text-emerald-600" />
              Government of India • Ministry of Agriculture & Farmers Welfare
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
              Indian Farmer Schemes & Financial Aid Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Comprehensive reference guide for Central & State agricultural subsidies, direct income support (PM-KISAN), crop insurance (PMFBY), solar pump grants (PM-KUSUM), low-interest KCC loans, and organic farming assistance.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Print Schemes Guide
            </button>
          </div>
        </div>

        {/* National Kisan Helpline Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <PhoneCall className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="font-bold">National Kisan Call Centre (Toll-Free):</span>
            <span className="font-mono text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              1800-180-1551 (6:00 AM – 10:00 PM, 22 Languages)
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>PM-KISAN Helpline: <strong>155261</strong></span>
            <span>•</span>
            <span>PMFBY Insurance: <strong>14447</strong></span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE SUBSIDY ESTIMATOR */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl border border-slate-800 shadow-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Farmer Subsidy & Financial Grant Estimator
              </h2>
              <p className="text-xs text-slate-300">
                Select your landholding size and farming equipment to calculate eligible government subsidy percentage.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-900/80 text-emerald-200 px-2.5 py-1 rounded-full border border-emerald-700 hidden sm:inline-block">
            Govt DBT Guidelines 2026
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Farmer Category (Land Size):
            </label>
            <select
              value={farmerLandCategory}
              onChange={(e) => setFarmerLandCategory(e.target.value as any)}
              className="w-full bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="marginal">Marginal Farmer (&lt; 1 Hectare / 2.5 Acres)</option>
              <option value="small">Small Farmer (1 to 2 Hectares / 2.5–5 Acres)</option>
              <option value="medium">Medium Farmer (2 to 10 Hectares)</option>
              <option value="large">Large Farmer (&gt; 10 Hectares)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Equipment / Scheme Needed:
            </label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="drip">Drip & Micro-Irrigation (PMKSY)</option>
              <option value="solar-pump">Solar Agriculture Tubewell Pump (PM-KUSUM)</option>
              <option value="rotavator">Rotavator / Farm Machinery (SMAM)</option>
              <option value="drone">Kisan Agricultural Drone</option>
              <option value="organic">Organic / Natural Farming Conversion (PKVY)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleCalculateSubsidy}
              className="w-full py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Estimate Eligible Subsidy
            </button>
          </div>
        </div>

        {/* Subsidy Result Card */}
        {calculatedSubsidy && (
          <div className="mt-3 p-4 rounded-xl bg-slate-800/90 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                Estimated Assistance Under {calculatedSubsidy.schemeName}:
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-black text-white">{calculatedSubsidy.estimatedAmt}</span>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {calculatedSubsidy.percent}% Government Grant
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-300 sm:text-right">
              <span>Required Farmer Contribution: <strong>{100 - calculatedSubsidy.percent}%</strong></span>
              <span className="block text-[10px] text-slate-400">Can be financed via 4% Kisan Credit Card (KCC) loan</span>
            </div>
          </div>
        )}
      </div>

      {/* GOVERNMENT E-MARKETPLACE (GeM) OFFICIAL PORTAL SPOTLIGHT */}
      <div className="bg-white rounded-2xl border-2 border-emerald-500/40 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 border border-emerald-400/50 flex items-center justify-center text-white shrink-0 shadow-sm">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                  Official Government Marketplace
                </span>
                <span className="text-xs text-emerald-300 font-semibold">
                  gem.gov.in • Ministry of Commerce & Industry
                </span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5">
                Government e-Marketplace (GeM) — Direct Portal for Farmers
              </h2>
              <p className="text-xs text-slate-300">
                Buy government-approved farm equipment at wholesale capped rates or sell your crops directly to government institutions without middlemen.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <a
              href="https://gem.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Open GeM Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* GeM Dual Feature Breakdown */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50">
          {/* Box 1: Buying from Govt */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2.5 text-emerald-800">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center font-bold">
                <Store className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">1. Buy Farm Equipment from Government Vendors</h3>
                <span className="text-[11px] text-emerald-700 font-semibold">Capped wholesale prices & subsidy integration</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              On <strong>GeM (Government e-Marketplace)</strong>, farmers and cooperatives can purchase tested, certified machinery directly from original equipment manufacturers (OEMs) at government-negotiated rates:
            </p>

            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Solar Water Pumps:</strong> Subsidized 3HP–10HP solar pumps under PM-KUSUM Component B & C.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Micro-Irrigation Kits:</strong> Precision drip lines, inline drippers, micro-sprinklers, and disc filters.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Tractors & Implements:</strong> Power tillers, rotavators, multi-crop seed drills, and laser land levelers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Greenhouse & Mulching:</strong> UV-stabilized polyhouse film, shade nets, and biodegradable mulch sheets.</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Direct Link: <strong className="text-slate-900">gem.gov.in</strong></span>
              <span className="text-emerald-700 font-bold">100% Quality Inspected</span>
            </div>
          </div>

          {/* Box 2: Selling to Govt */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2.5 text-sky-800">
              <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4 text-sky-700" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">2. Sell Farm Produce Directly to Government</h3>
                <span className="text-[11px] text-sky-700 font-semibold">Defence, Railways, Schools & Canteens (0% commission)</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Individual farmers, <strong>FPOs (Farmer Producer Organisations)</strong>, and SHGs can register as sellers to supply agricultural produce directly to government departments:
            </p>

            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Direct Institutional Buyers:</strong> Supply to Indian Armed Forces, Railway Canteens (IRCTC), and Central Schools.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>No Middlemen or Brokerage:</strong> Receive the full invoice payment with zero commission deducted.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Guaranteed Timely Settlement:</strong> Government portal mandates DBT payment into farmer's bank account within 10 days.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Special FPO Quota:</strong> Preference given to organic produce, millets (Shree Anna), and certified farmer clusters.</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>GeM Helpdesk: <strong className="text-slate-900">1800-419-3436</strong></span>
              <span className="text-sky-700 font-bold">Direct DBT Transfer</span>
            </div>
          </div>
        </div>

        {/* Quick How to Get Started Footer */}
        <div className="bg-emerald-950 text-emerald-100 px-6 py-3 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-emerald-800">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>How to Register:</strong> Visit <strong>https://gem.gov.in</strong> &gt; Click <em>'Sign Up'</em> &gt; Choose <em>'Seller &gt; Farmer / FPO / SHG'</em> &gt; Verify via Aadhaar OTP and link Bank Account.
            </span>
          </div>
          <a
            href="https://gem.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-extrabold underline hover:text-emerald-300 shrink-0 flex items-center gap-1"
          >
            <span>Visit gem.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* SCHEME SEARCH & CATEGORY FILTER TABS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme by name e.g. 'PM-KISAN', 'KUSUM', 'Solar Pump', 'Insurance', 'Drip', 'Organic'..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
            />
          </div>

          <span className="text-xs text-slate-500 font-bold shrink-0">
            Showing {filteredSchemes.length} of {GOVT_SCHEMES_DATA.length} Schemes
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: "all", label: "All Schemes" },
            { id: "financial", label: "💰 Direct Income & KCC" },
            { id: "insurance", label: "🛡️ Crop Insurance (PMFBY)" },
            { id: "irrigation", label: "💧 Irrigation & Solar (KUSUM)" },
            { id: "machinery", label: "🚜 Farm Machinery & Drones" },
            { id: "soil", label: "🌱 Soil Health & Organic" },
            { id: "market", label: "🏪 Mandi, Storage & e-NAM" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === tab.id
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SCHEMES ACCORDION LIST */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme) => {
          const isExpanded = expandedSchemeId === scheme.id;
          return (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
            >
              {/* Accordion Header */}
              <div
                onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {scheme.categoryLabel}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">{scheme.hindiName}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{scheme.name}</h3>
                  <p className="text-xs text-slate-600 font-medium">{scheme.tagline}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 font-bold block">Benefit Rate:</span>
                    <span className="text-xs font-black text-emerald-700">{scheme.subsidyRate}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Accordion Expanded Content */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-100 space-y-5 bg-slate-50/40 animate-in fade-in duration-150">
                  {/* Highlight Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-800 block">Primary Financial Aid:</span>
                      <p className="text-xs text-emerald-950 font-semibold leading-relaxed">
                        {scheme.primaryBenefit}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
                      <span className="text-[11px] font-bold text-sky-800 block">Target Beneficiaries:</span>
                      <p className="text-xs text-sky-950 font-semibold leading-relaxed">
                        {scheme.targetGroup}
                      </p>
                    </div>
                  </div>

                  {/* 3 Column Deep Dive */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column 1: Eligibility */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Eligibility Criteria
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {scheme.eligibility.map((el, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{el}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 2: Documents Required */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-sky-600" />
                        Documents Checklist
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {scheme.documentsRequired.map((doc, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-sky-500 font-bold">✓</span>
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 3: Application Process */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                        How to Apply (Step-by-Step)
                      </h4>
                      <ol className="space-y-1.5 text-xs text-slate-600">
                        {scheme.applicationSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="font-bold text-amber-700 shrink-0">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Footer Action Links */}
                  <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Helpline: <strong>{scheme.helpline}</strong></span>
                    </div>

                    <a
                      href={scheme.officialPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>Visit Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ACADEMIC STUDY & GOVT SCHEMES DISCLAIMER AT BOTTOM OF PAGE */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-amber-950 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong className="font-bold text-amber-900 block mb-0.5">
            Student Study & Educational Purpose Disclaimer:
          </strong>
          This portal provides structured educational references of Government of India agricultural policies, schemes, and subsidies for academic learning, project presentations, and research studies. Real-world farmers are advised to verify latest state-specific eligibility rules, guidelines, and document submission deadlines on official portals (e.g. pmkisan.gov.in, pmfby.gov.in, gem.gov.in) or by visiting their local Block Agriculture Office / Krishi Vigyan Kendra (KVK).
        </div>
      </div>
    </div>
  );
};

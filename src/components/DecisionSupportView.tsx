import React, { useState, useEffect } from "react";
import {
  CloudSun,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  MapPin,
  Compass,
  Search,
  RefreshCw,
  Clock,
  Sparkles,
  Loader2,
  Navigation,
  ShieldCheck,
  FlaskConical,
  Send,
  Volume2,
  VolumeX,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Info,
  Layers,
  ChevronRight,
  SunMedium,
  CloudLightning,
  CloudFog,
} from "lucide-react";
import { WeatherData, LocationOption } from "../types/agriculture";
import { useTranslation } from "../data/translations";

interface DecisionSupportViewProps {
  language: string;
  onOpenCropDoctor: () => void;
  onOpenGovtSchemes?: () => void;
  onOpenGuides?: () => void;
}

const PRESET_FARMING_REGIONS: (LocationOption & { continent: string })[] = [
  // Asia
  { name: "Ludhiana", region: "Punjab", country: "India", latitude: 30.901, longitude: 75.8573, continent: "Asia" },
  { name: "Karnal", region: "Haryana", country: "India", latitude: 29.6857, longitude: 76.9905, continent: "Asia" },
  { name: "Anand", region: "Gujarat", country: "India", latitude: 22.5645, longitude: 72.9289, continent: "Asia" },
  { name: "Nashik", region: "Maharashtra", country: "India", latitude: 19.9975, longitude: 73.7898, continent: "Asia" },
  { name: "Guntur", region: "Andhra Pradesh", country: "India", latitude: 16.3067, longitude: 80.4365, continent: "Asia" },
  { name: "Indore", region: "Madhya Pradesh", country: "India", latitude: 22.7196, longitude: 75.8577, continent: "Asia" },
  { name: "Chengdu", region: "Sichuan", country: "China", latitude: 30.5728, longitude: 104.0668, continent: "Asia" },
  { name: "Chiang Mai", region: "North", country: "Thailand", latitude: 18.7883, longitude: 98.9853, continent: "Asia" },
  { name: "Lahore", region: "Punjab", country: "Pakistan", latitude: 31.5204, longitude: 74.3587, continent: "Asia" },
  { name: "Kyoto", region: "Kansai", country: "Japan", latitude: 35.0116, longitude: 135.7681, continent: "Asia" },
  
  // Americas
  { name: "Fresno", region: "California", country: "United States", latitude: 36.7468, longitude: -119.7726, continent: "Americas" },
  { name: "Des Moines", region: "Iowa", country: "United States", latitude: 41.5868, longitude: -93.625, continent: "Americas" },
  { name: "Lubbock", region: "Texas", country: "United States", latitude: 33.5779, longitude: -101.8552, continent: "Americas" },
  { name: "Regina", region: "Saskatchewan", country: "Canada", latitude: 50.4547, longitude: -104.6067, continent: "Americas" },
  { name: "Mato Grosso", region: "Cuiabá", country: "Brazil", latitude: -15.6014, longitude: -56.0979, continent: "Americas" },
  { name: "Rosario", region: "Santa Fe", country: "Argentina", latitude: -32.9468, longitude: -60.6393, continent: "Americas" },
  { name: "Sinaloa", region: "Culiacán", country: "Mexico", latitude: 24.8091, longitude: -107.394, continent: "Americas" },

  // Europe
  { name: "Seville", region: "Andalusia", country: "Spain", latitude: 37.3891, longitude: -5.9845, continent: "Europe" },
  { name: "Bologna", region: "Emilia-Romagna", country: "Italy", latitude: 44.4949, longitude: 11.3426, continent: "Europe" },
  { name: "Bordeaux", region: "Nouvelle-Aquitaine", country: "France", latitude: 44.8378, longitude: -0.5792, continent: "Europe" },
  { name: "Munich", region: "Bavaria", country: "Germany", latitude: 48.1351, longitude: 11.582, continent: "Europe" },
  { name: "Kyiv", region: "Chernozem Belt", country: "Ukraine", latitude: 50.4501, longitude: 30.5234, continent: "Europe" },

  // Africa
  { name: "Eldoret", region: "Rift Valley", country: "Kenya", latitude: 0.5143, longitude: 35.2698, continent: "Africa" },
  { name: "Cairo", region: "Nile Delta", country: "Egypt", latitude: 30.0444, longitude: 31.2357, continent: "Africa" },
  { name: "Stellenbosch", region: "Western Cape", country: "South Africa", latitude: -33.9321, longitude: 18.8602, continent: "Africa" },
  { name: "Kano", region: "North", country: "Nigeria", latitude: 12.0022, longitude: 8.592, continent: "Africa" },

  // Oceania
  { name: "Wagga Wagga", region: "New South Wales", country: "Australia", latitude: -35.1082, longitude: 147.3598, continent: "Oceania" },
  { name: "Shepparton", region: "Victoria", country: "Australia", latitude: -36.3813, longitude: 145.3984, continent: "Oceania" },
  { name: "Hawke's Bay", region: "Hastings", country: "New Zealand", latitude: -39.6385, longitude: 176.8406, continent: "Oceania" },
];

export const DecisionSupportView: React.FC<DecisionSupportViewProps> = ({
  language,
  onOpenCropDoctor,
  onOpenGovtSchemes,
  onOpenGuides,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [activeLocation, setActiveLocation] = useState<LocationOption>({
    name: "Ludhiana",
    region: "Punjab",
    country: "India",
    latitude: 30.901,
    longitude: 75.8573,
  });

  // Search places modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState<string>("All");
  
  // Custom GPS Coordinates input
  const [isCustomCoordOpen, setIsCustomCoordOpen] = useState(false);
  const [customLat, setCustomLat] = useState("");
  const [customLon, setCustomLon] = useState("");
  const [customPlaceName, setCustomPlaceName] = useState("");

  // Selected forecast tab / day
  const [selectedForecastIndex, setSelectedForecastIndex] = useState<number>(0);

  // Agronomist Q&A
  const [quickQuery, setQuickQuery] = useState("");
  const [isQueryingAgronomist, setIsQueryingAgronomist] = useState(false);
  const [agronomistAnswer, setAgronomistAnswer] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Fetch real-time weather
  const fetchWeatherForLocation = async (loc: LocationOption) => {
    setIsWeatherLoading(true);
    try {
      const url = `/api/weather/current?lat=${loc.latitude}&lon=${loc.longitude}&place=${encodeURIComponent(
        loc.name
      )}&region=${encodeURIComponent(loc.region || "")}&country=${encodeURIComponent(loc.country || "")}`;
      const res = await fetch(url);
      const data: WeatherData = await res.json();
      setWeather(data);
      setActiveLocation(loc);
      setSelectedForecastIndex(0);
    } catch (err) {
      console.error("Failed to load real-time weather:", err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  // Initial load: Attempt GPS or fallback to default farming region
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherForLocation({
            name: "My Farm",
            region: "Local Field",
            country: "GPS Detected",
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          fetchWeatherForLocation(activeLocation);
        },
        { timeout: 4000 }
      );
    } else {
      fetchWeatherForLocation(activeLocation);
    }
  }, []);

  // Search places when query changes
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/weather/search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUseCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherForLocation({
          name: "My Current Farm",
          region: "Live GPS",
          country: "",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        setIsWeatherLoading(false);
        console.warn("GPS access denied or timed out:", err.message);
      }
    );
  };

  const handleAskAgronomist = async (customPrompt?: string) => {
    const query = customPrompt || quickQuery;
    if (!query.trim()) return;
    setIsQueryingAgronomist(true);
    setAgronomistAnswer(null);
    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          language,
          context: {
            weatherLocation: weather?.placeName,
            tempC: weather?.temperatureC,
            humidity: weather?.humidityPercent,
            rain3DaysMm: weather?.forecastRain3DaysMm,
            evapotranspiration: weather?.evapotranspirationMmDay,
          },
        }),
      });
      const data = await res.json();
      setAgronomistAnswer(data.reply || data.fallbackReply);
    } catch (err) {
      console.error(err);
      setAgronomistAnswer(
        "For current weather conditions, schedule irrigation during early mornings to reduce evaporative losses and avoid spraying if rain probability exceeds 40%."
      );
    } finally {
      setIsQueryingAgronomist(false);
    }
  };

  const handleTextToSpeech = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-US";
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const selectedDay = weather?.dailyForecast?.[selectedForecastIndex] || weather?.dailyForecast?.[0];

  const getWeatherIcon = (description: string = "") => {
    const lower = description.toLowerCase();
    if (lower.includes("thunder") || lower.includes("storm")) return <CloudLightning className="w-5 h-5 text-amber-500" />;
    if (lower.includes("rain") || lower.includes("shower") || lower.includes("drizzle")) return <CloudRain className="w-5 h-5 text-sky-500" />;
    if (lower.includes("fog") || lower.includes("mist")) return <CloudFog className="w-5 h-5 text-slate-400" />;
    if (lower.includes("cloud") || lower.includes("overcast")) return <CloudSun className="w-5 h-5 text-slate-600" />;
    return <Sun className="w-5 h-5 text-amber-500" />;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <CloudSun className="w-4 h-4 text-emerald-600" />
              Live Agro-Weather Station & 7-Day Precision Forecast
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              Agricultural Weather & Farm Forecast
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Real-time weather station telemetry, 7-day agricultural rainfall forecasts, hourly timeline, and automated crop advisory for irrigation, spraying, and harvesting.
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Change Location</span>
            </button>
            <button
              onClick={handleUseCurrentLocation}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Navigation className="w-4 h-4" />
              <span>GPS Farm</span>
            </button>
            <button
              onClick={() => activeLocation && fetchWeatherForLocation(activeLocation)}
              disabled={isWeatherLoading}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Live Weather"
            >
              <RefreshCw className={`w-4 h-4 ${isWeatherLoading ? "animate-spin text-emerald-600" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH MODAL / POPUP */}
      {isSearchOpen && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-sm font-extrabold text-slate-900 block">
                  Global Weather Station Locator (Worldwide 195+ Countries)
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Search any city, village, district, province or exact GPS coordinates anywhere on Earth.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type any village, city, country (e.g. 'Patiala', 'Nairobi', 'Iowa', 'São Paulo', 'Cairo', or '30.90, 75.85')..."
              className="w-full pl-10 pr-10 py-3 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900"
              autoFocus
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 absolute right-3.5 top-3.5 animate-spin text-emerald-600" />
            )}
          </div>

          {/* Quick Actions: Auto-GPS & Manual Lat/Lon */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              onClick={() => {
                handleUseCurrentLocation();
                setIsSearchOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-700" />
              <span>Use My Device GPS (Auto-Detect Anywhere)</span>
            </button>

            <button
              onClick={() => setIsCustomCoordOpen(!isCustomCoordOpen)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-slate-600" />
              <span>{isCustomCoordOpen ? "Hide Custom Lat/Lon" : "Enter Exact Lat / Long Coordinates"}</span>
            </button>
          </div>

          {/* Custom Lat/Lon Form */}
          {isCustomCoordOpen && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                Enter Custom Field GPS Coordinates (For Remote Farms):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Latitude (e.g. 30.9010)"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                />
                <input
                  type="text"
                  placeholder="Longitude (e.g. 75.8573)"
                  value={customLon}
                  onChange={(e) => setCustomLon(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                />
                <input
                  type="text"
                  placeholder="Farm / Plot Name (Optional)"
                  value={customPlaceName}
                  onChange={(e) => setCustomPlaceName(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <button
                onClick={() => {
                  const latNum = parseFloat(customLat);
                  const lonNum = parseFloat(customLon);
                  if (isNaN(latNum) || isNaN(lonNum)) {
                    alert("Please enter valid numeric latitude and longitude coordinates.");
                    return;
                  }
                  fetchWeatherForLocation({
                    name: customPlaceName.trim() || `Farm (${latNum.toFixed(3)}, ${lonNum.toFixed(3)})`,
                    region: "Custom Coordinates",
                    country: "Global Plot",
                    latitude: latNum,
                    longitude: lonNum,
                  });
                  setIsSearchOpen(false);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Fetch Weather for These Coordinates
              </button>
            </div>
          )}

          {/* Dynamic Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-200 max-h-56 overflow-y-auto">
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => {
                    fetchWeatherForLocation(res);
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-2.5 px-3.5 hover:bg-emerald-50 transition-colors flex items-center justify-between text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">{res.name}</span>
                      <span className="text-slate-500 text-[11px] ml-1.5">
                        {res.region ? `${res.region}, ` : ""}
                        {res.country}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {res.latitude.toFixed(2)}°, {res.longitude.toFixed(2)}°
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      Select
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Global Continents & Farming Hubs */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                Worldwide Major Agricultural Hubs:
              </span>
              <div className="flex gap-1 text-[11px]">
                {["All", "Asia", "Americas", "Europe", "Africa", "Oceania"].map((continent) => (
                  <button
                    key={continent}
                    onClick={() => setSelectedContinent(continent)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                      selectedContinent === continent
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {continent}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {PRESET_FARMING_REGIONS.filter(
                (p) => selectedContinent === "All" || p.continent === selectedContinent
              ).map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    fetchWeatherForLocation(preset);
                    setIsSearchOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                    weather?.placeName === preset.name
                      ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50"
                  }`}
                >
                  <span className="text-[10px] opacity-70">📍</span>
                  <span>{preset.name}</span>
                  <span className="text-[10px] text-slate-400">({preset.country})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: LIVE CURRENT WEATHER TELEMETRY CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/80 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-inner">
              <CloudSun className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-800 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-700">
                  Live Station Telemetry
                </span>
                <span className="flex items-center gap-1 text-xs text-emerald-300 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>
              <h2 className="text-xl font-black text-white flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {weather ? `${weather.placeName}${weather.region ? `, ${weather.region}` : ""}` : "Loading location..."}
                {weather?.country && <span className="text-xs text-slate-300 font-medium">({weather.country})</span>}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Last Station Sync</span>
            <span className="text-xs font-bold text-emerald-300">{weather?.lastUpdated || "Just now"}</span>
          </div>
        </div>

        {/* 6 Key Weather Metrics Grid */}
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Temperature */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>Temperature</span>
              <Thermometer className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">
                {weather ? `${weather.temperatureC}°` : "--"}
              </span>
              <span className="text-xs text-slate-500 font-bold">C</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              Feels like {weather ? `${weather.apparentTempC}°C` : "--"}
            </span>
          </div>

          {/* Humidity */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>Rel. Humidity</span>
              <Droplets className="w-4 h-4 text-sky-500" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">
                {weather ? `${weather.humidityPercent}%` : "--"}
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
              {weather ? (weather.humidityPercent > 70 ? "High Moisture" : weather.humidityPercent < 40 ? "Dry Air" : "Optimal") : "--"}
            </span>
          </div>

          {/* Rain 3 Days */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>3-Day Rain Total</span>
              <CloudRain className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">
                {weather ? `${weather.forecastRain3DaysMm}` : "0"}
              </span>
              <span className="text-xs text-slate-500 font-bold">mm</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              Today: {weather?.precipitationTodayMm || 0} mm
            </span>
          </div>

          {/* Evapotranspiration */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>Water Loss (ET₀)</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">
                {weather ? `${weather.evapotranspirationMmDay}` : "4.8"}
              </span>
              <span className="text-xs text-slate-500 font-bold">mm/d</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              Solar transpiration
            </span>
          </div>

          {/* Wind Speed */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>Wind Speed</span>
              <Wind className="w-4 h-4 text-teal-500" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">
                {weather ? `${weather.windSpeedKmh}` : "--"}
              </span>
              <span className="text-xs text-slate-500 font-bold">km/h</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              {weather?.windSpeedKmh && weather.windSpeedKmh > 15 ? "Moderate Breeze" : "Calm"}
            </span>
          </div>

          {/* Sky Condition */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>Condition</span>
              <CloudSun className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-1">
              <span className="text-sm font-black text-slate-900 line-clamp-1">
                {weather?.weatherDescription || "Clear Sky"}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              UV Index: {weather?.uvIndex || 7}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: 7-DAY EXTENDED AGRICULTURAL WEATHER FORECAST */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              7-Day Extended Agricultural Weather Forecast
            </h2>
            <p className="text-xs text-slate-500">
              Daily rainfall amounts, temperatures, solar radiation, and wind forecasts for field planning.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Click any day to view details
          </span>
        </div>

        {/* 7 Day Horizontal Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {(weather?.dailyForecast || []).map((day, idx) => {
            const isSelected = idx === selectedForecastIndex;
            const hasRain = day.rainMm > 0 || day.rainProbPercent >= 30;
            return (
              <div
                key={idx}
                onClick={() => setSelectedForecastIndex(idx)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-center ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50/80 shadow-sm scale-[1.02]"
                    : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="text-xs font-extrabold text-slate-900">{day.dayName}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{day.date}</div>
                  
                  <div className="my-2.5 flex justify-center">
                    {getWeatherIcon(day.weatherDescription)}
                  </div>

                  <div className="text-xs font-black text-slate-900">
                    {day.maxTempC}° <span className="text-slate-400 font-medium">/ {day.minTempC}°</span>
                  </div>
                  <div className="text-[10px] text-slate-600 font-semibold truncate mt-0.5">
                    {day.weatherDescription}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-500">Rain:</span>
                    <span className={hasRain ? "text-sky-700 font-extrabold" : "text-slate-600"}>
                      {day.rainMm} mm
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${hasRain ? "bg-sky-500" : "bg-slate-300"}`}
                      style={{ width: `${Math.min(100, Math.max(5, day.rainProbPercent))}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-slate-400 text-right">
                    {day.rainProbPercent}% chance
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Day Expanded Details */}
        {selectedDay && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="text-slate-800 font-medium">
                Detailed forecast for <strong>{selectedDay.dayName} ({selectedDay.date})</strong>: {selectedDay.weatherDescription}. Max temp <strong>{selectedDay.maxTempC}°C</strong>, Min temp <strong>{selectedDay.minTempC}°C</strong>, Expected Rain <strong>{selectedDay.rainMm} mm ({selectedDay.rainProbPercent}% probability)</strong>.
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600">
              <span>ET₀: <strong className="text-slate-900">{selectedDay.et0Mm} mm</strong></span>
              <span>•</span>
              <span>Max Wind: <strong className="text-slate-900">{selectedDay.maxWindKmh} km/h</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: 24-HOUR HOURLY WEATHER TIMELINE */}
      {weather?.hourlyForecast && weather.hourlyForecast.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Next 24-Hour Hourly Weather & Rain Timeline
              </h2>
              <p className="text-xs text-slate-500">
                Track hourly temperature drops and exact rain shower timing throughout the day.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex items-stretch gap-2.5 min-w-[700px]">
              {weather.hourlyForecast.slice(0, 16).map((hr, idx) => {
                const hasRain = hr.rainProbPercent > 30 || hr.rainMm > 0;
                return (
                  <div
                    key={idx}
                    className={`flex-1 min-w-[75px] p-3 rounded-xl border text-center flex flex-col justify-between ${
                      idx === 0
                        ? "bg-emerald-50/80 border-emerald-400 shadow-2xs"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-extrabold text-slate-900">{hr.hourLabel}</div>
                      <div className="my-1.5 flex justify-center">{getWeatherIcon(hr.weatherDescription)}</div>
                      <div className="text-xs font-black text-slate-800">{hr.tempC}°C</div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-200 space-y-0.5">
                      <div className={`text-[10px] font-bold ${hasRain ? "text-sky-700" : "text-slate-500"}`}>
                        {hr.rainProbPercent}%
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {hr.windSpeedKmh}kph
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SMART AGRICULTURAL OPERATIONS ADVISORY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Irrigation Advisory */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-600" />
              Irrigation Plan
            </span>
            <span className="text-[10px] font-extrabold bg-sky-100 text-sky-900 px-2 py-0.5 rounded">
              Weather Linked
            </span>
          </div>
          <h3 className="text-sm font-black text-slate-900">
            {weather?.agriAdvisory?.irrigationAction || "Schedule Light Watering"}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {weather?.agriAdvisory?.irrigationReason ||
              "Based on solar evaporation (ET₀ 4.8 mm/d). Water in calm morning hours."}
          </p>
        </div>

        {/* Spraying Window */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Pesticide / Spray Window
            </span>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                weather?.agriAdvisory?.sprayingSuitable
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-amber-100 text-amber-900"
              }`}
            >
              {weather?.agriAdvisory?.sprayingScore || "Optimal"}
            </span>
          </div>
          <h3 className="text-sm font-black text-slate-900">
            {weather?.agriAdvisory?.sprayingSuitable ? "Suitable for Spraying" : "Caution for Spraying"}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {weather?.agriAdvisory?.sprayingReason ||
              "Calm winds and low rain risk. Ideal for foliar fertilizer and pesticide application."}
          </p>
        </div>

        {/* Sowing / Harvesting Window */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <SunMedium className="w-4 h-4 text-amber-600" />
              Field Work & Harvesting
            </span>
            <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
              7-Day Window
            </span>
          </div>
          <h3 className="text-sm font-black text-slate-900">Field Operations</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {weather?.agriAdvisory?.harvestingWindow ||
              "Favorable dry window: Safe for harvesting, drying grains, and tractor plowing."}
          </p>
        </div>

        {/* Extreme Weather & Frost Alert */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Stress & Frost Watch
            </span>
            <span className="text-[10px] font-extrabold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
              Crop Protection
            </span>
          </div>
          <h3 className="text-sm font-black text-slate-900">Thermal Comfort</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {weather?.agriAdvisory?.extremeWeatherRisk || "Favorable growing conditions across the crop canopy."}
          </p>
        </div>
      </div>

      {/* SECTION 5: FARMER WEATHER Q&A AND DIRECT ADVISORY TOOLS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Ask Any Agricultural Weather Question</h3>
              <p className="text-xs text-slate-500">
                Ask about rain impact on your crop, best day for sowing, fertilizer timing, or frost prevention.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCropDoctor}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-emerald-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Leaf Disease Doctor
            </button>
            {onOpenGovtSchemes && (
              <button
                onClick={onOpenGovtSchemes}
                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-amber-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Govt Schemes & GeM
              </button>
            )}
          </div>
        </div>

        {/* Suggested Quick Question Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Suggestions:</span>
          <button
            onClick={() => {
              setQuickQuery(`Should I spray fungicide on my crop today in ${weather?.placeName || "my field"}?`);
              handleAskAgronomist(`Should I spray fungicide on my crop today in ${weather?.placeName || "my field"}?`);
            }}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0 transition-colors"
          >
            Should I spray fungicide today?
          </button>
          <button
            onClick={() => {
              setQuickQuery(`How will upcoming rain affect wheat and mustard crops in ${weather?.placeName || "Punjab"}?`);
              handleAskAgronomist(`How will upcoming rain affect wheat and mustard crops in ${weather?.placeName || "Punjab"}?`);
            }}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0 transition-colors"
          >
            Rain impact on crops
          </button>
          <button
            onClick={() => {
              setQuickQuery("What is the best irrigation timing for saving water in high temperature?");
              handleAskAgronomist("What is the best irrigation timing for saving water in high temperature?");
            }}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0 transition-colors"
          >
            Best watering time
          </button>
        </div>

        {/* Question Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAgronomist();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="Ask e.g. 'Can I harvest wheat tomorrow?' or type in Hindi / Punjabi..."
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isQueryingAgronomist || !quickQuery.trim()}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95"
          >
            {isQueryingAgronomist ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Ask AI
          </button>
        </form>

        {/* Answer Display */}
        {agronomistAnswer && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-bold border-b border-slate-200 pb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Agronomist Advice:
              </span>
              <button
                onClick={() => handleTextToSpeech(agronomistAnswer)}
                className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-emerald-700 font-semibold cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-emerald-700" /> : <Volume2 className="w-4 h-4" />}
                {isSpeaking ? "Stop Voice" : "Listen in Voice"}
              </button>
            </div>
            <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
              {agronomistAnswer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

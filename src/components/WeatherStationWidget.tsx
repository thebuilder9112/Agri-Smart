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
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Loader2,
  Navigation,
} from "lucide-react";
import { WeatherData, LocationOption } from "../types/agriculture";

interface WeatherStationWidgetProps {
  weather: WeatherData | null;
  isLoading: boolean;
  onSelectLocation: (loc: LocationOption) => void;
  onRefresh: () => void;
  onUseCurrentLocation: () => void;
}

const PRESET_FARMING_REGIONS: LocationOption[] = [
  { name: "Ludhiana", region: "Punjab", country: "India", latitude: 30.901, longitude: 75.8573 },
  { name: "Karnal", region: "Haryana", country: "India", latitude: 29.6857, longitude: 76.9905 },
  { name: "Anand", region: "Gujarat", country: "India", latitude: 22.5645, longitude: 72.9289 },
  { name: "Nashik", region: "Maharashtra", country: "India", latitude: 19.9975, longitude: 73.7898 },
  { name: "Guntur", region: "Andhra Pradesh", country: "India", latitude: 16.3067, longitude: 80.4365 },
  { name: "Indore", region: "Madhya Pradesh", country: "India", latitude: 22.7196, longitude: 75.8577 },
  { name: "Fresno", region: "California", country: "United States", latitude: 36.7468, longitude: -119.7726 },
];

export const WeatherStationWidget: React.FC<WeatherStationWidgetProps> = ({
  weather,
  isLoading,
  onSelectLocation,
  onRefresh,
  onUseCurrentLocation,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Agronomic guidance based on humidity & ET
  const getHumidityAdvice = (hum: number) => {
    if (hum > 75) return "High humidity — high risk of fungal spores. Keep foliage dry.";
    if (hum < 35) return "Dry air — higher transpiration. Increase light drip watering.";
    return "Optimal atmospheric moisture for balanced crop transpiration.";
  };

  const getSpraySuitability = (windKmh: number, rainProb: number) => {
    if (windKmh > 18) return { safe: false, label: "Unfavorable for Spraying (Wind > 18 km/h causes chemical drift)" };
    if (rainProb > 50) return { safe: false, label: "Rain Expected Soon — Avoid foliar sprays" };
    return { safe: true, label: "Ideal Weather Window for Foliar Spray & Irrigation" };
  };

  const sprayStatus = weather
    ? getSpraySuitability(weather.windSpeedKmh, weather.dailyForecast?.[0]?.rainProbPercent || 0)
    : { safe: true, label: "Optimal conditions" };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Station Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/80 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-inner">
            <CloudSun className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                Live Agro-Weather Station
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-300/90 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Real-Time Telemetry
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {weather ? `${weather.placeName}${weather.region ? `, ${weather.region}` : ""}` : "Loading location..."}
              </h3>
              {weather?.country && (
                <span className="text-xs text-slate-300 font-semibold">({weather.country})</span>
              )}
            </div>
          </div>
        </div>

        {/* Location Switcher & Refresh Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-600 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Change Place</span>
          </button>

          <button
            onClick={onUseCurrentLocation}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Detect My GPS Location"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Use My GPS</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Live Weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Collapsible Place Search / Presets Box */}
      {isSearchOpen && (
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              Search Any City, District or Village:
            </span>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Close ✕
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type place name e.g. 'Patiala', 'Nagpur', 'Amritsar', 'Visakhapatnam'..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
              autoFocus
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 absolute right-3 top-3 animate-spin text-emerald-600" />
            )}
          </div>

          {/* Search suggestions */}
          {searchResults.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onSelectLocation(res);
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-2.5 px-3.5 hover:bg-emerald-50 transition-colors flex items-center justify-between text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold text-slate-800">{res.name}</span>
                    <span className="text-slate-500 text-[11px]">
                      {res.region ? `${res.region}, ` : ""}
                      {res.country}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Select
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Quick presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Agricultural Hubs:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_FARMING_REGIONS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectLocation(preset);
                    setIsSearchOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                    weather?.placeName === preset.name
                      ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300"
                  }`}
                >
                  📍 {preset.name} ({preset.region})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Real-Time Telemetry Grid */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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

          {/* Relative Humidity */}
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
              {weather ? (weather.humidityPercent > 70 ? "High Humidity" : weather.humidityPercent < 40 ? "Dry Air" : "Comfortable") : "--"}
            </span>
          </div>

          {/* Rain Forecast 3-Days */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>Rain (3 Days)</span>
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

          {/* Reference Evapotranspiration (ET₀) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>Evapotranspiration</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">
                {weather ? `${weather.evapotranspirationMmDay}` : "4.8"}
              </span>
              <span className="text-xs text-slate-500 font-bold">mm/d</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              Water loss rate (ET₀)
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
              {weather?.windSpeedKmh && weather.windSpeedKmh > 15 ? "Moderate Breeze" : "Light Air"}
            </span>
          </div>

          {/* Sky Condition */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>Sky & Condition</span>
              <CloudSun className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-1">
              <span className="text-sm font-black text-slate-900 line-clamp-1">
                {weather?.weatherDescription || "Clear"}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Updated: {weather?.lastUpdated || "Just now"}
            </span>
          </div>
        </div>

        {/* Dynamic Agronomic Decision Alert based on real weather */}
        <div className="mt-3.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-emerald-950 font-medium">
              <strong>Farm Advisory for {weather?.placeName}:</strong> {weather ? getHumidityAdvice(weather.humidityPercent) : ""}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                sprayStatus.safe
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  : "bg-amber-100 text-amber-900 border border-amber-300"
              }`}
            >
              {sprayStatus.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

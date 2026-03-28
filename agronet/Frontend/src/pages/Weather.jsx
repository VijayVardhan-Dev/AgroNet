import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, CloudRain, Droplets, MapPin, Search, Sun, Sunrise, Sunset, 
  Wind, Navigation, Thermometer, Calendar, RefreshCcw, AlertCircle 
} from 'lucide-react';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const Weather = () => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const searchInputRef = useRef(null);

  const fetchWeather = useCallback(async (locationStr) => {
    try {
      if (!WEATHER_API_KEY) throw new Error("Weather API Key is missing");
      const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${locationStr}&days=7&aqi=no&alerts=yes`);
      if (!res.ok) throw new Error("Failed to fetch weather data");
      const data = await res.json();
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Unable to retrieve weather. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const getLocalWeather = useCallback(() => {
    setLoading(true);
    if (!navigator.geolocation) {
      fetchWeather("London"); // Fallback
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => fetchWeather("London") // Fallback on deny
    );
  }, [fetchWeather]);

  useEffect(() => {
    getLocalWeather();
  }, [getLocalWeather]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    fetchWeather(searchQuery);
    if (searchInputRef.current) searchInputRef.current.blur();
  };

  const handleRefresh = () => {
    if (!weatherData) return;
    setIsRefreshing(true);
    fetchWeather(weatherData.location.name);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-800 antialiased selection:bg-cyan-100 selection:text-cyan-900 pb-20">
      
      {/* Top Header Row */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span className="sr-only sm:not-sr-only">Back</span>
        </button>
        
        <form onSubmit={handleSearch} className="flex-1 max-w-sm mx-4 relative">
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search city, zip, or coordinates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm font-medium rounded-full py-2.5 pl-10 pr-4 outline-none border border-transparent focus:border-cyan-200 focus:ring-4 focus:ring-cyan-50 transition-all placeholder:text-slate-400"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </form>

        <button onClick={handleRefresh} disabled={isRefreshing} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50">
          <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </header>

      {/* Main Content Body */}
      <main className="max-w-4xl mx-auto px-6 pt-10 pb-24">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-cyan-500 animate-spin"></div>
            <p className="text-slate-400 font-medium tracking-wide animate-pulse">Retrieving atmosphere...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-[60vh] gap-4 text-center">
            <AlertCircle size={48} className="text-rose-400 mb-2" />
            <h2 className="text-2xl font-bold tracking-tight">Weather unavailable</h2>
            <p className="text-slate-500 max-w-sm">{error}</p>
            <button onClick={getLocalWeather} className="mt-4 px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-transform active:scale-95">Try Location Again</button>
          </div>
        ) : weatherData ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            
            {/* Header: Location & Time */}
            <div className="flex flex-col items-center justify-center text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-2 flex items-center justify-center gap-3">
                <Navigation size={28} className="text-cyan-600" />
                {weatherData.location.name}
              </h1>
              <p className="text-lg font-medium text-slate-500 tracking-wide">
                {weatherData.location.region}{weatherData.location.region && weatherData.location.country ? ', ' : ''}{weatherData.location.country}
              </p>
              <p className="text-sm font-semibold tracking-widest uppercase text-slate-400 mt-6 bg-slate-50 px-3 py-1.5 rounded-full inline-block border border-slate-100">
                {new Date(weatherData.location.localtime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Top Display: Temp & Primary Metric */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-24 mb-20">
              <div className="flex items-center gap-6">
                <img 
                  src={`https:${weatherData.current.condition.icon}`} 
                  alt={weatherData.current.condition.text} 
                  className="w-28 h-28 object-contain drop-shadow-xl"
                  style={{ filter: "saturate(1.2)" }}
                />
                <div className="flex flex-col justify-center">
                  <div className="flex items-start">
                    <span className="text-8xl sm:text-9xl font-black tracking-tighter text-slate-900 leading-none">
                      {Math.round(weatherData.current.temp_c)}
                    </span>
                    <span className="text-4xl sm:text-5xl font-bold text-slate-400 mt-2">°C</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-cyan-700 mt-2 capitalize">
                    {weatherData.current.condition.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Farm Vital Specs */}
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-6 pl-2 border-l-2 border-cyan-400">Agricultural Vital Signs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
              <VitalCard icon={<Droplets />} label="Humidity" value={`${weatherData.current.humidity}%`} description="Air Moisture" />
              <VitalCard icon={<Wind />} label="Wind" value={`${weatherData.current.wind_kph} km/h`} description={weatherData.current.wind_dir} />
              <VitalCard icon={<CloudRain />} label="Precipitation" value={`${weatherData.current.precip_mm} mm`} description="Last 24h" />
              <VitalCard icon={<Thermometer />} label="Feels Like" value={`${Math.round(weatherData.current.feelslike_c)}°`} description="RealFeel" />
            </div>

            {/* Day Forecast Grid */}
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-6 pl-2 border-l-2 border-indigo-400">7-Day Forecast</h3>
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/5">
              <div className="flex flex-col divide-y divide-slate-100/80">
                {weatherData.forecast?.forecastday.map((day, idx) => (
                  <div key={day.date} className="group py-4 flex items-center justify-between hover:bg-slate-50/50 rounded-2xl px-2 transition-colors">
                    <div className="w-1/4 sm:w-1/3">
                      <p className="font-semibold text-slate-900 truncate">
                        {idx === 0 ? 'Today' : new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                      </p>
                      <p className="text-xs font-medium text-slate-400 mt-1 sm:hidden">{day.day.condition.text}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-1">
                      <img src={`https:${day.day.condition.icon}`} alt="icon" className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-semibold text-slate-500 hidden sm:block truncate">{day.day.condition.text}</span>
                    </div>

                    <div className="w-1/4 sm:w-1/3 flex items-center justify-end gap-3 sm:gap-6 font-medium">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">High</span>
                        <span className="text-slate-900">{Math.round(day.day.maxtemp_c)}°</span>
                      </div>
                      <div className="w-px h-6 bg-slate-200"></div>
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Low</span>
                        <span className="text-slate-500">{Math.round(day.day.mintemp_c)}°</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : null}
      </main>
    </div>
  );
};

const VitalCard = ({ icon, label, value, description }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-start">
    <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
      {React.cloneElement(icon, { size: 20, strokeWidth: 2.5 })}
    </div>
    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</span>
    <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{value}</span>
    <span className="text-xs font-medium text-slate-500 truncate w-full">{description}</span>
  </div>
);

export default Weather;

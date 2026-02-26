import { useState, useEffect } from 'react';
import {
  Search, Bell, SlidersHorizontal, Plus, Heart, ShoppingCart, ShoppingBag, MapPin, Star, CloudSun, RefreshCw, AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCrops } from '../services/cropService';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Existing image assets
import banner from '../assets/images/banner.png';
import rice from '../assets/images/rice.png';
import root from '../assets/images/root.png';
import leaf from '../assets/images/leaf.png';
import legumen from '../assets/images/legumen.png';
import fruits from '../assets/images/fruits.png';
import cereals from '../assets/images/cereals.png';
import grams from '../assets/images/grams.png';
import spices from '../assets/images/spices.png';

const Home = () => {
  const [crops, setCrops] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [errorWeather, setErrorWeather] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    fetchCrops();
    handleRefreshWeather();
  }, []);

  // Auto-rotate slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshWeather = () => {
    setLoadingWeather(true);
    setErrorWeather(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Location access denied.";
          if (error.code === 3) errorMessage = "Location request timed out.";
          if (error.code === 2) errorMessage = "Location unavailable.";
          setErrorWeather(errorMessage);
          setLoadingWeather(false);
        }
      );
    } else {
      setErrorWeather("Geolocation not supported.");
      setLoadingWeather(false);
    }
  };

  const fetchWeather = async (lat, lon) => {
    if (!API_KEY || API_KEY.includes('your_weatherapi_key_here')) {
      setErrorWeather("API Key missing.");
      setLoadingWeather(false);
      return;
    }
    try {
      const weatherRes = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`
      );
      if (!weatherRes.ok) throw new Error("Weather fetch failed");
      const weatherData = await weatherRes.json();
      setWeather(weatherData);
      setErrorWeather(null);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setErrorWeather("Failed to load weather.");
    } finally {
      setLoadingWeather(false);
    }
  };

  const fetchCrops = async () => {
    const fetchedCrops = await getCrops();
    setCrops(fetchedCrops);
  };

  const handleProductClick = (id) => {
    navigate(`/product/crop/${id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      type: 'crop',
      image: rice // Placeholder
    });
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-4 font-sans text-gray-800 overflow-x-hidden">

      {/* --- Header Section --- */}
      <div className="px-5  flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-[14px] overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[17px] font-extrabold text-gray-900 leading-tight">Welcome Back</h1>
            <p className="text-[13px] text-gray-400 font-medium">Cameron Williamson</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/cart" className="w-11 h-11 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.03)] flex items-center justify-center">
            <ShoppingBag className="w-[20px] h-[20px] text-gray-700" />
          </Link>
          <button className="w-11 h-11 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.03)] flex items-center justify-center relative">
            <Bell className="w-[20px] h-[20px] text-gray-700" />
            <span className="absolute top-2.5 right-[9px] w-2 h-2 bg-[#FF6B00] rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* --- Search & Filter --- */}
      <div className="px-5 mt-5 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search your groceries"
            className="w-full h-14 bg-white pl-12 pr-4 rounded-[18px] shadow-[0_2px_10px_rgb(0,0,0,0.02)] border-none focus:ring-2 focus:ring-orange-200 text-sm font-medium placeholder-gray-400 outline-none"
          />
        </div>
        <button className="w-14 h-14 bg-[#FF6B00] rounded-[18px] shadow-lg shadow-orange-200 flex items-center justify-center flex-shrink-0">
          <SlidersHorizontal className="w-[22px] h-[22px] text-white" />
        </button>
      </div>

      {/* --- Explore Categories --- */}
      <div className="mt-8">
        <div className="px-5 flex justify-between items-center mb-4">
          <h2 className="text-[17px] font-bold text-gray-900">Explore Categories</h2>
          <button className="text-[13px] font-semibold text-gray-400">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-5 pb-2 no-scrollbar">
          {[
            { name: 'Roots', icon: root },
            { name: 'Green', icon: leaf },
            { name: 'Legumes', icon: legumen },
            { name: 'Fruits', icon: fruits },
            { name: 'Cereals', icon: cereals },
            { name: 'Spices', icon: spices }
          ].map((cat, i) => (
            <div key={i} className="flex flex-col items-center min-w-[85px] gap-2 cursor-pointer">
              <div className="w-[85px] h-[85px] bg-white rounded-[20px] shadow-[0_2px_15px_rgb(0,0,0,0.03)] flex items-center justify-center">
                <img src={cat.icon} alt={cat.name} className="w-[45px] h-[45px] object-contain" />
              </div>
              <span className="text-[12px] font-semibold text-gray-800">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Slideshow: Weather + Schemes + Promo --- */}
      <div className="mt-6 px-5">
        <div className="md:hidden relative w-full overflow-hidden rounded-[22px] shadow-sm" style={{ height: '170px' }}>
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {/* Slide 1: Weather */}
            <div className="w-full flex-shrink-0 h-full bg-gradient-to-br from-[#4A90E2] to-[#357ABD] p-5 flex items-center gap-4">
              {loadingWeather ? (
                <div className="flex items-center gap-3 text-white/80 text-sm">
                  <RefreshCw className="w-5 h-5 animate-spin" /> Fetching weather...
                </div>
              ) : errorWeather ? (
                <div className="flex items-center gap-3 text-white/80 text-sm">
                  <AlertCircle className="w-5 h-5" /> {errorWeather}
                </div>
              ) : weather ? (
                <>
                  <img src={`https:${weather.current.condition.icon}`} alt="weather" className="w-16 h-16 drop-shadow-lg" />
                  <div className="flex flex-col">
                    <span className="text-white text-3xl font-extrabold">{Math.round(weather.current.temp_c)}°C</span>
                    <span className="text-white/90 text-sm font-semibold">{weather.location.name}</span>
                    <span className="text-white/70 text-xs capitalize mt-0.5">{weather.current.condition.text}</span>
                  </div>
                  <div className="ml-auto flex flex-col gap-1 text-white/70 text-[11px]">
                    <span>💧 {weather.current.humidity}% Humidity</span>
                    <span>🌬️ {weather.current.wind_kph} km/h Wind</span>
                    <button onClick={handleRefreshWeather} className="mt-1 text-white/50 hover:text-white transition-colors flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Refresh
                    </button>
                  </div>
                </>
              ) : (
                <span className="text-white/60 text-sm">Weather unavailable</span>
              )}
            </div>

            {/* Slide 2: Scheme / Offer */}
            <div className="w-full flex-shrink-0 h-full bg-gradient-to-br from-[#FF9A56] to-[#FF6B00] p-5 flex items-center">
              <div className="flex flex-col gap-2 w-[65%]">
                <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Government Scheme</span>
                <h3 className="text-white text-[17px] font-bold leading-tight">PM-KISAN Direct Benefit Transfer</h3>
                <p className="text-white/70 text-[11px]">Get ₹6,000/year direct income support for farmers</p>
                <button className="mt-2 bg-white text-[#FF6B00] px-4 py-2 rounded-xl text-[12px] font-bold w-fit shadow-sm active:scale-95 transition-transform">
                  Learn More
                </button>
              </div>
              <div className="w-[35%] flex items-center justify-center text-6xl opacity-60">🌾</div>
            </div>

            {/* Slide 3: Promo Banner */}
            <div className="w-full flex-shrink-0 h-full bg-gradient-to-br from-[#A5E07D] to-[#86C95E] p-5 relative overflow-hidden flex items-center">
              <div className="relative z-10 w-[65%]">
                <h3 className="text-gray-900 text-[17px] font-bold leading-[1.2]">
                  Fresh foods everyday and our best service
                </h3>
                <p className="text-gray-700 text-[11px] mt-2 font-medium">Hurry ups! Grab your voucher</p>
                <button className="mt-3 bg-white text-gray-900 px-5 py-2 rounded-[12px] text-[12px] font-bold shadow-sm active:scale-95 transition-transform">
                  Grab Voucher
                </button>
              </div>
              <img
                src={rice}
                className="absolute -right-4 bottom-0 w-[140px] h-[130px] object-contain rotate-12 opacity-70"
                alt="Promo"
              />
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {[0, 1, 2].map(i => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`rounded-full transition-all duration-300 ${currentSlide === i
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Bento Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6 h-[220px]">
          {/* Card 1: Weather */}
          <div className="rounded-[22px] shadow-sm bg-gradient-to-br from-[#4A90E2] to-[#357ABD] p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="flex justify-between items-start z-10">
              <div className="flex flex-col">
                 <h2 className="text-white/90 font-bold text-lg">Weather Forecast</h2>
                 <p className="text-white/70 text-xs">Real-time updates</p>
              </div>
              {weather && weather.current && <img src={`https:${weather.current.condition.icon}`} alt="weather" className="w-16 h-16 drop-shadow-lg -mt-2" />}
            </div>

            <div className="z-10 mt-auto">
              {loadingWeather ? (
                <div className="flex items-center gap-3 text-white/80 text-sm">
                  <RefreshCw className="w-5 h-5 animate-spin" /> Fetching weather...
                </div>
              ) : errorWeather ? (
                <div className="flex items-center gap-3 text-white/80 text-sm">
                  <AlertCircle className="w-5 h-5" /> {errorWeather}
                </div>
              ) : weather ? (
                <div className="flex justify-between items-end">
                   <div>
                      <span className="text-white text-4xl font-extrabold">{Math.round(weather.current.temp_c)}°C</span>
                      <p className="text-white/90 text-sm font-semibold mt-1">{weather.location.name}</p>
                      <p className="text-white/70 text-xs capitalize">{weather.current.condition.text}</p>
                   </div>
                   <div className="flex flex-col gap-1 text-white/80 text-xs text-right">
                      <span>💧 {weather.current.humidity}% Humidity</span>
                      <span>🌬️ {weather.current.wind_kph} km/h Wind</span>
                   </div>
                </div>
              ) : (
                <span className="text-white/60 text-sm">Weather unavailable</span>
              )}
            </div>
          </div>

          {/* Card 2: Schemes */}
          <div className="rounded-[22px] shadow-sm bg-gradient-to-br from-[#FF9A56] to-[#FF6B00] p-6 flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-all">
             <div className="absolute bottom-0 right-0 text-9xl opacity-10 pointer-events-none transform translate-x-10 translate-y-10">🌾</div>
             
             <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">Government Scheme</span>
             <h3 className="text-white text-2xl font-bold leading-tight mb-2">PM-KISAN</h3>
             <p className="text-white/90 text-sm mb-6">Get ₹6,000/year direct income support for farmers.</p>
             
             <button className="bg-white text-[#FF6B00] px-5 py-2.5 rounded-xl text-sm font-bold w-fit shadow-lg shadow-orange-700/20 hover:bg-orange-50 transition-colors">
                Learn More
             </button>
          </div>

          {/* Card 3: Promo / Market */}
          <div className="rounded-[22px] shadow-sm bg-gradient-to-br from-[#A5E07D] to-[#86C95E] p-6 flex items-center relative overflow-hidden group hover:shadow-md transition-all">
             <div className="relative z-10 w-[60%]">
                <h3 className="text-gray-900 text-xl font-bold leading-tight mb-3">
                  Fresh Foods & Best Service
                </h3>
                <p className="text-gray-800 text-sm font-medium mb-5">Get up to 30% off on your first bulk order!</p>
                <button className="bg-white text-gray-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-green-700/10 hover:bg-gray-50 transition-colors">
                  Grab Voucher
                </button>
              </div>
              <img
                src={rice}
                className="absolute -right-2 bottom-0 w-[160px] h-[160px] object-contain rotate-12 opacity-80 group-hover:scale-105 transition-transform duration-500"
                alt="Promo"
              />
          </div>
        </div>
      </div>

      {/* --- You Might Need (Dynamic API Data) --- */}
      <div className="mt-8 px-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[17px] font-bold text-gray-900">You Might Need</h2>
          <button className="text-[13px] font-semibold text-gray-400">View All</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {crops.length > 0 ? crops.map((item) => (
            <div
              key={item.id}
              onClick={() => handleProductClick(item.id)}
              className="bg-white rounded-[24px] p-3 shadow-[0_2px_15px_rgb(0,0,0,0.03)] flex flex-col relative cursor-pointer group"
            >

              {/* Dynamic Badge Placeholder */}
              <div className="absolute top-0 left-3 bg-[#4A90E2] text-white text-[9px] font-bold px-2 py-1.5 rounded-b-[6px] z-10 tracking-wide">
                {item.category || 'FRESH'}
              </div>

              {/* Image Area */}
              <div className="bg-[#F8F9FA] rounded-[16px] h-[110px] w-full flex items-center justify-center relative mt-2 overflow-hidden">
                <img src={rice} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform" />

                <button
                  className="absolute -bottom-3 -right-1 w-[28px] h-[28px] bg-[#FF6B00] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white hover:bg-orange-600 transition-colors z-20"
                  onClick={(e) => handleAddToCart(e, item)}
                >
                  <Plus strokeWidth={3} className="w-[14px] h-[14px]" />
                </button>
              </div>

              {/* Text Info mapped from your API */}
              <div className="mt-4 px-1">
                <h4 className="font-bold text-gray-900 text-[15px] truncate">{item.name}</h4>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {item.farmerRating || 4.5} • {item.farmerName}
                </div>
                <div className="flex items-baseline gap-1.5 mt-2 mb-1">
                  <span className="text-gray-900 font-extrabold text-[15px]">₹{item.price}</span>
                  <span className="text-gray-400 text-[11px] font-medium">/{item.unit}</span>
                </div>
              </div>
            </div>
          )) : (
            <p className="text-sm text-gray-400 col-span-2 text-center py-4">No crops available right now.</p>
          )}
        </div>
      </div>



    </div>
  );
};

export default Home;
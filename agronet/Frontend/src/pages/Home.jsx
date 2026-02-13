import { useState, useEffect } from 'react';
import {
  Sun, CloudSun, CloudRain, Plus, CheckCircle, Star, MapPin, Tag, ShoppingCart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCrops } from '../services/cropService';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

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

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    fetchCrops();
    handleRefreshWeather();
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
      console.warn("Weather API Key not set");
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
      setWeather(weatherData); // Stores the whole response object
      setErrorWeather(null);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setErrorWeather("Failed to load weather.");
    } finally {
      setLoadingWeather(false);
    }
  };

  /* --- Logic removed --- */

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
    <div className="space-y-6 pt-4">

      {/* --- Search Bar (Mobile Only) --- */}
      <div className="px-4 md:hidden">
        <div className="relative">
          <input
            type="text"
            placeholder="search"
            className="w-full bg-white border border-gray-100 py-3 pl-4 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="px-4 space-y-6">

        {/* --- Weather & Govt Schemes Row --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* --- Weather Widget --- */}
          <div className=''>
            <h2 className="font-semibold mb-3 text-sm text-gray-700 flex justify-between items-center">
              Weather
              <button
                onClick={handleRefreshWeather}
                className="text-xs text-green-600 hover:text-green-800 underline active:text-green-700 transition-colors"
                title="Refresh location and weather"
              >
                Refresh Location
              </button>
            </h2>
            <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center h-full min-h-[140px] relative">
              {loadingWeather ? (
                <div className="flex flex-col items-center justify-center w-full text-gray-400 text-sm gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                  <span className='text-xs'>Fetching location & weather...</span>
                </div>
              ) : errorWeather ? (
                <div className="flex flex-col items-center justify-center w-full text-center gap-2">
                  <p className="text-xs text-red-500">{errorWeather}</p>
                  <button
                    onClick={handleRefreshWeather}
                    className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs hover:bg-green-100 transition-colors border border-green-200"
                  >
                    Try Again
                  </button>
                </div>
              ) : weather ? (
                <>
                  {/* Current Weather */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {/* WeatherAPI sends an icon URL, usually starting with //cdn.weatherapi.com/... */}
                      <img
                        src={`https:${weather.current.condition.icon}`}
                        alt={weather.current.condition.text}
                        className="w-10 h-10 object-contain"
                      />
                      <div>
                        <h3 className="text-3xl font-bold text-gray-800">{Math.round(weather.current.temp_c)}°C</h3>
                        <p className="text-xs font-bold text-gray-900">{weather.location.name}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 capitalize">
                      {weather.current.condition.text},
                      High {Math.round(weather.forecast.forecastday[0].day.maxtemp_c)}°,
                      Low {Math.round(weather.forecast.forecastday[0].day.mintemp_c)}°
                    </p>
                  </div>

                  {/* Mini Forecast */}
                  <div className="flex gap-2 text-center">
                    {weather.forecast.forecastday.map((day, i) => {
                      const date = new Date(day.date);
                      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <span className="text-[9px] text-gray-500 mb-1">{dayName}</span>
                          <img
                            src={`https:${day.day.condition.icon}`}
                            alt={day.day.condition.text}
                            className="w-4 h-4 object-contain"
                          />
                          <span className="text-[8px] text-gray-600 mt-1">{Math.round(day.day.avgtemp_c)}°</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center w-full text-gray-400 text-xs text-center gap-2">
                  <p>Weather unavailable.</p>
                  {!API_KEY || API_KEY.includes('your_weatherapi_key_here') ? (
                    <p className="text-[10px] text-red-400">Please set VITE_WEATHER_API_KEY in .env</p>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* --- Govt Schemes Banner --- */}
          <div className='mt-10 md:mt-0 '>
            <h2 className="font-semibold mb-3 text-sm text-gray-700">Govt schemes</h2>
            <div className="w-full h-28 md:h-full rounded-xl overflow-hidden shadow-sm relative group cursor-pointer">
              <img
                src={banner}
                alt="Govt Schemes"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* --- Top Rated (Horizontal Scroll) --- */}
        <div className='pt-10'>
          <h2 className="font-semibold mb-3 text-sm text-gray-700">Top rated</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {crops.map((item) => (
              <div key={item.id} onClick={() => handleProductClick(item.id)} className="min-w-[150px] md:min-w-[180px] bg-green-50/50 p-3 rounded-xl relative hover:shadow-md transition-shadow cursor-pointer">
                <div className="h-28 bg-green-100 rounded-lg mb-2 overflow-hidden">
                  <img src={rice} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <button onClick={(e) => handleAddToCart(e, item)} className="absolute top-28 right-2 bg-white border border-green-200 rounded-md p-1 shadow-sm hover:bg-green-50 z-10">
                  <Plus className="w-4 h-4 text-green-600" />
                </button>
                <div className="mt-4">
                  <p className="font-bold text-sm text-gray-800 text-truncate">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.category}</p>
                  <p className="text-[10px] text-gray-500">Available: {item.availableQty} {item.unit}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-gray-400">₹{item.price}/{item.unit}</span>
                    <span className="text-[10px] font-bold text-green-600 flex items-center">★ {item.farmerRating || 4.5}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Categories Grid --- */}
        <div>
          <h2 className="font-semibold mb-3 text-sm text-gray-700">Categories</h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="grid grid-cols-4 gap-4 md:grid-cols-8 md:gap-0 lg:flex lg:justify-between">
              {[
                { name: 'Roots', icon: root },
                { name: 'Green', icon: leaf },
                { name: 'Legumes', icon: legumen },
                { name: 'Fruits', icon: fruits },
                { name: 'Cereals', icon: cereals },
                { name: 'Grams', icon: grams },
                { name: 'Spices', icon: spices },
                { name: 'Roots', icon: root },
              ].map((cat, idx) => (
                <div key={idx} className="flex flex-col items-center min-w-[60px] group cursor-pointer">
                  <div className="w-15 h-15 flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                    <img src={cat.icon} alt={cat.name} className="w-15 h-15 object-contain" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium group-hover:text-green-700">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- New Arrivals --- */}
        <div>
          <h2 className="font-semibold mb-3 text-sm text-gray-700">New arrivals</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {crops.length > 0 ? crops.map(product => (
              <div key={product.id} className="min-w-[280px] md:min-w-[320px] cursor-pointer" onClick={() => handleProductClick(product.id)}>
                <ProductCard
                  image={rice} // Placeholder
                  title={product.name}
                  author={product.farmerName}
                  rating={product.farmerRating || "4.5"}
                  location={product.farmerLocation}
                  price={product.price}
                  unit={product.unit}
                  onAdd={(e) => handleAddToCart(e, product)}
                />
              </div>
            )) : (
              <div className="text-gray-500 text-sm">No crops listed yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub Components ---

const ProductCard = ({ image, title, author, rating, location, price, unit, onAdd }) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 group">
    <div className="h-40 w-full bg-yellow-100 relative">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <button
        onClick={onAdd}
        className="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ShoppingCart size={16} />
      </button>
    </div>

    <div className="p-4">
      <h3 className="font-bold text-lg text-gray-900">{title}</h3>

      <div className="flex items-center gap-1 mt-1 mb-3">
        <span className="text-xs text-gray-500">by {author}</span>
        <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-500" />
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold flex items-center gap-1">
          {rating} <Star className="w-3 h-3 fill-current" />
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <MapPin className="w-3 h-3" />
          {location}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-gray-700" />
        <span className="text-lg font-bold text-green-700">₹{price}</span>
        <span className="text-sm text-gray-400 font-normal">/{unit}</span>
      </div>
    </div>
  </div>
);

export default Home;
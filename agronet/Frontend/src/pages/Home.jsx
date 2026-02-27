import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getCrops } from '../services/cropService';

import HomeHeader from '../components/home/HomeHeader';
import HomeSearchBar from '../components/home/HomeSearchBar';
import CategoriesSection from '../components/home/CategoriesSection';
import HighlightsSection from '../components/home/HighlightsSection';
import ProductsSection from '../components/home/ProductsSection';

import rice from '../assets/images/rice.png';
import root from '../assets/images/root.png';
import leaf from '../assets/images/leaf.png';
import legumen from '../assets/images/legumen.png';
import fruits from '../assets/images/fruits.png';
import cereals from '../assets/images/cereals.png';
import spices from '../assets/images/spices.png';

const WEATHER_CACHE_KEY = 'agronet_weather_cache_v1';
const WEATHER_REFRESH_INTERVAL_MS = 10 * 60 * 1000;
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 12000,
  maximumAge: 5 * 60 * 1000
};

const categoryList = [
  { name: 'Roots', icon: root },
  { name: 'Green', icon: leaf },
  { name: 'Legumes', icon: legumen },
  { name: 'Fruits', icon: fruits },
  { name: 'Cereals', icon: cereals },
  { name: 'Spices', icon: spices }
];

const readWeatherCache = () => {
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.weather) return null;
    return parsed;
  } catch (error) {
    console.error('Unable to read weather cache:', error);
    return null;
  }
};

const writeWeatherCache = (payload) => {
  try {
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error('Unable to write weather cache:', error);
  }
};

const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, GEOLOCATION_OPTIONS);
  });

const Home = () => {
  const [crops, setCrops] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [isRefreshingWeather, setIsRefreshingWeather] = useState(false);
  const [weatherUpdatedAt, setWeatherUpdatedAt] = useState(null);
  const [errorWeather, setErrorWeather] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const weatherCoordsRef = useRef(null);
  const weatherAvailableRef = useRef(false);

  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { addToCart } = useCart();
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const userName = userProfile?.fullName?.trim() ||
    user?.displayName?.trim() ||
    user?.email?.split('@')?.[0] ||
    'Guest User';
  const avatarUrl = userProfile?.profilePic || user?.photoURL || '';

  useEffect(() => {
    weatherAvailableRef.current = Boolean(weather);
  }, [weather]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchCrops = async () => {
    const fetchedCrops = await getCrops();
    setCrops(fetchedCrops);
  };

  const resolveWeatherCoords = useCallback(async (preferCachedCoords = true) => {
    if (preferCachedCoords && weatherCoordsRef.current) {
      return weatherCoordsRef.current;
    }

    if (!navigator.geolocation) {
      if (weatherCoordsRef.current) return weatherCoordsRef.current;
      throw new Error('Geolocation not supported.');
    }

    try {
      const position = await getCurrentPosition();
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      weatherCoordsRef.current = coords;
      return coords;
    } catch (error) {
      if (weatherCoordsRef.current) return weatherCoordsRef.current;

      if (error.code === 3) throw new Error('Location request timed out.');
      if (error.code === 2) throw new Error('Location unavailable.');
      throw new Error('Location access denied.');
    }
  }, []);

  const fetchWeatherForCoords = useCallback(async (coords) => {
    if (!API_KEY || API_KEY.includes('your_weatherapi_key_here')) {
      throw new Error('Weather API key missing.');
    }

    const weatherRes = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${coords.latitude},${coords.longitude}&days=3&aqi=no&alerts=no`
    );
    if (!weatherRes.ok) throw new Error('Weather fetch failed.');
    return weatherRes.json();
  }, [API_KEY]);

  const refreshWeather = useCallback(async ({ silent = false, preferCachedCoords = true } = {}) => {
    const shouldRunInBackground = silent || weatherAvailableRef.current;

    if (shouldRunInBackground) {
      setIsRefreshingWeather(true);
    } else {
      setLoadingWeather(true);
      setErrorWeather(null);
    }

    try {
      const coords = await resolveWeatherCoords(preferCachedCoords);
      const weatherData = await fetchWeatherForCoords(coords);
      const fetchedAt = Date.now();

      setWeather(weatherData);
      setWeatherUpdatedAt(fetchedAt);
      setErrorWeather(null);

      writeWeatherCache({
        weather: weatherData,
        coords,
        fetchedAt
      });
    } catch (error) {
      console.error('Error refreshing weather:', error);

      if (weatherAvailableRef.current) {
        setErrorWeather('Refresh failed. Showing latest saved weather.');
      } else {
        setErrorWeather(error.message || 'Failed to load weather.');
      }
    } finally {
      setLoadingWeather(false);
      setIsRefreshingWeather(false);
    }
  }, [fetchWeatherForCoords, resolveWeatherCoords]);

  useEffect(() => {
    fetchCrops();

    const cachedWeather = readWeatherCache();
    if (cachedWeather?.weather) {
      setWeather(cachedWeather.weather);
      setWeatherUpdatedAt(cachedWeather.fetchedAt || null);
      weatherCoordsRef.current = cachedWeather.coords || null;
      setLoadingWeather(false);
    }

    refreshWeather({
      silent: Boolean(cachedWeather?.weather),
      preferCachedCoords: true
    });
  }, [refreshWeather]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshWeather({ silent: true, preferCachedCoords: true });
    }, WEATHER_REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [refreshWeather]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;

      const isStale = !weatherUpdatedAt || (Date.now() - weatherUpdatedAt > WEATHER_REFRESH_INTERVAL_MS);
      if (isStale) {
        refreshWeather({ silent: true, preferCachedCoords: true });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshWeather, weatherUpdatedAt]);

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
      image: rice
    });
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ecf6ef_0%,_#f6f7f3_48%,_#f4f5f0_100%)] pb-24 md:pb-10 text-slate-800 overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <HomeHeader userName={userName} avatarUrl={avatarUrl} />
        <HomeSearchBar />
        <CategoriesSection categories={categoryList} />
        <HighlightsSection
          loadingWeather={loadingWeather}
          isRefreshingWeather={isRefreshingWeather}
          weatherUpdatedAt={weatherUpdatedAt}
          errorWeather={errorWeather}
          weather={weather}
          onRefreshWeather={() => refreshWeather({ silent: true, preferCachedCoords: false })}
          currentSlide={currentSlide}
          onSlideChange={setCurrentSlide}
          promoImage={rice}
        />
        <ProductsSection
          crops={crops}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          image={rice}
        />
      </div>
    </div>
  );
};

export default Home;

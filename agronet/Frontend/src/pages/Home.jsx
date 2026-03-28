import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
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
  const [isHovered, setIsHovered] = useState(false);

  // Search, sort, and category filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [activeCategory, setActiveCategory] = useState(null);

  const weatherCoordsRef = useRef(null);
  const weatherAvailableRef = useRef(false);

  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { addToCart } = useCart();
  const { addNotification } = useNotification();
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
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

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
      image: product.image && !product.image.includes('placehold.co') ? product.image : rice
    });
    addNotification(`${product.name} added to cart!`, 'success');
  };

  // --- Derived filtered + sorted products ---
  const filteredCrops = useMemo(() => {
    let result = [...crops];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.farmerName?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeCategory) {
      const catMap = {
        'Roots': ['root', 'roots', 'tuber'],
        'Green': ['green', 'leafy', 'vegetable', 'vegetables'],
        'Legumes': ['legume', 'legumes', 'pulse', 'pulses', 'dal'],
        'Fruits': ['fruit', 'fruits'],
        'Cereals': ['cereal', 'cereals', 'grain', 'grains', 'rice', 'wheat'],
        'Spices': ['spice', 'spices', 'masala'],
      };
      const keywords = catMap[activeCategory] || [activeCategory.toLowerCase()];
      result = result.filter(c => {
        const cat = (c.category || '').toLowerCase();
        const name = (c.name || '').toLowerCase();
        return keywords.some(kw => cat.includes(kw) || name.includes(kw));
      });
    }

    // Sort
    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price_high':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'rating':
        result.sort((a, b) => (b.farmerRating || 4.5) - (a.farmerRating || 4.5));
        break;
      case 'name_az':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        break;
    }

    return result;
  }, [crops, searchQuery, sortBy, activeCategory]);

  // "Most Popular" — top-rated items
  const mostPopular = useMemo(() => {
    return [...crops]
      .sort((a, b) => (b.farmerRating || 4.5) - (a.farmerRating || 4.5))
      .slice(0, 4);
  }, [crops]);

  // "You May Also Like" — random shuffle, different from most popular
  const youMayLike = useMemo(() => {
    const popularIds = new Set(mostPopular.map(c => c.id));
    const remaining = crops.filter(c => !popularIds.has(c.id));
    // Fisher-Yates shuffle
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    return remaining.slice(0, 4);
  }, [crops, mostPopular]);

  const isSearching = searchQuery.trim().length > 0;

  // --- Search-focused view ---
  if (isSearching) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] pb-24 md:pb-10 text-slate-800">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-6">
          {/* Search Header */}
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => { setSearchQuery(''); setSortBy('default'); }}
              className="w-12 h-12 sm:h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm flex-shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <HomeSearchBar 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
                sortBy={sortBy} 
                onSortChange={setSortBy} 
              />
            </div>
          </div>

          {/* Result Count */}
          <p className="text-sm text-slate-500 font-medium mb-6">
            {filteredCrops.length} result{filteredCrops.length !== 1 ? 's' : ''} for "<span className="text-slate-800 font-semibold">{searchQuery}</span>"
          </p>

          {/* Results Grid */}
          <ProductsSection
            crops={filteredCrops}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            image={rice}
            title="Search Results"
            emptyMessage="No products match your search."
          />
        </div>
      </div>
    );
  }

  // --- Default Home View ---
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ecf6ef_0%,_#f6f7f3_48%,_#f4f5f0_100%)] pb-24 md:pb-10 text-slate-800 overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <HomeHeader userName={userName} avatarUrl={avatarUrl} />
        <div className="mt-5">
          <HomeSearchBar 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
            sortBy={sortBy} 
            onSortChange={setSortBy} 
          />
        </div>
        <CategoriesSection 
          categories={categoryList} 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
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
        </div>
        <ProductsSection
          crops={activeCategory ? filteredCrops : crops}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          image={rice}
          title={activeCategory ? `Results in ${activeCategory}` : 'You Might Need'}
          emptyMessage={activeCategory ? 'No products in this category.' : 'No crops available right now.'}
        />

        {/* Additional Sections — only show when NOT filtering by category */}
        {!activeCategory && mostPopular.length > 0 && (
          <ProductsSection
            crops={mostPopular}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            image={rice}
            title="Most Popular"
          />
        )}

        {!activeCategory && youMayLike.length > 0 && (
          <ProductsSection
            crops={youMayLike}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            image={rice}
            title="You May Also Like"
          />
        )}
      </div>
    </div>
  );
};

export default Home;

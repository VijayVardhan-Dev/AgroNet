import {
  Sun,
  CloudSun,
  CloudRain,
  Plus,
  CheckCircle,
  Star,
  MapPin,
  Tag
} from 'lucide-react';

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
          <div>
            <h2 className="font-semibold mb-3 text-sm text-gray-700">Weather</h2>
            <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center h-full">
              {/* Current Weather */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Sun className="w-10 h-10 text-yellow-400 fill-yellow-400" />
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800">24°C</h3>
                    <p className="text-xs font-bold text-gray-900">Kakinada</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Partly Cloudy, High 26°, Low 18°</p>
              </div>

              {/* Mini Forecast */}
              <div className="flex gap-2 text-center">
                {['Mon', 'Tue', 'Wed'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-[9px] text-gray-500 mb-1">{day}</span>
                    {i % 2 === 0 ? <CloudSun className="w-4 h-4 text-gray-400" /> : <CloudRain className="w-4 h-4 text-blue-300" />}
                    <span className="text-[8px] text-gray-600 mt-1">20°/18°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- Govt Schemes Banner --- */}
          <div className='pt-10'>
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
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="min-w-[150px] md:min-w-[180px] bg-green-50/50 p-3 rounded-xl relative hover:shadow-md transition-shadow">
                <div className="h-28 bg-green-100 rounded-lg mb-2 overflow-hidden">
                  <img src={rice} alt="Rice" className="w-full h-full object-cover" />
                </div>
                <button className="absolute top-28 right-2 bg-white border border-green-200 rounded-md p-1 shadow-sm hover:bg-green-50">
                  <Plus className="w-4 h-4 text-green-600" />
                </button>
                <div className="mt-4">
                  <p className="font-bold text-sm text-gray-800">250</p>
                  <p className="text-xs text-gray-600">Rice</p>
                  <p className="text-[10px] text-gray-500">Quality assured</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-gray-400">50kg</span>
                    <span className="text-[10px] font-bold text-green-600 flex items-center">★ 4.2</span>
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
            <div className="flex justify-between items-center gap-4 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-8 md:gap-0 lg:flex lg:justify-between">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Card 1 */}
            <ProductCard
              image={rice}
              title="Premium Quality Rice"
              author="Krishna Murthy"
              rating="4.2"
              location="Kakinda, 5km"
              price="25"
            />

            {/* Card 2 */}
            <ProductCard
              image={rice}
              title="Premium Quality Rice"
              author="Krishna Murthy"
              rating="4.2"
              location="Kakinda, 5km"
              price="25"
            />

          </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub Components ---

const ProductCard = ({ image, title, author, rating, location, price }) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
    <div className="h-40 w-full bg-yellow-100">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>

    <div className="p-4">
      <h3 className="font-bold text-lg text-gray-900">{title}</h3>

      <div className="flex items-center gap-1 mt-1 mb-3">
        <span className="text-xs text-gray-500">by {author}</span>
        <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-500 text-white" />
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
        <span className="text-sm text-gray-400 font-normal">/kg</span>
      </div>
    </div>
  </div>
);

export default Home;
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { useState } from 'react';

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price_low', label: 'Price: Low → High' },
  { value: 'price_high', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name_az', label: 'Name: A → Z' },
];

const HomeSearchBar = ({ searchQuery, onSearchChange, sortBy, onSortChange }) => {
  const [showSort, setShowSort] = useState(false);

  return (
    <div className="flex gap-3 relative">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search crops, fruits, spices..."
          className="w-full h-12 sm:h-14 bg-white pl-12 pr-10 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 text-sm font-medium placeholder-slate-400 outline-none"
        />
        {searchQuery && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="relative">
        <button 
          onClick={() => setShowSort(!showSort)}
          className="w-12 sm:w-14 h-12 sm:h-14 bg-emerald-600 rounded-xl shadow-md shadow-emerald-200/70 flex items-center justify-center flex-shrink-0 hover:bg-emerald-700 transition-colors"
        >
          <SlidersHorizontal className="w-[22px] h-[22px] text-white" />
        </button>

        {showSort && (
          <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl border border-gray-100 shadow-[0_16px_40px_rgba(0,0,0,0.10)] py-2 z-50 min-w-[200px] overflow-hidden">
            <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Sort By</p>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onSortChange(opt.value); setShowSort(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${sortBy === opt.value ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-gray-50'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeSearchBar;

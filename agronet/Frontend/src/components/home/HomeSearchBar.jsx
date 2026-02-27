import { Search, SlidersHorizontal } from 'lucide-react';

const HomeSearchBar = () => {
  return (
    <div className="mt-5 flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-12 sm:h-14 bg-white pl-12 pr-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 text-sm font-medium placeholder-slate-400 outline-none"
        />
      </div>
      <button className="w-12 sm:w-14 h-12 sm:h-14 bg-emerald-600 rounded-xl shadow-md shadow-emerald-200/70 flex items-center justify-center flex-shrink-0 hover:bg-emerald-700 transition-colors">
        <SlidersHorizontal className="w-[22px] h-[22px] text-white" />
      </button>
    </div>
  );
};

export default HomeSearchBar;

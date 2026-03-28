const CategoriesSection = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">Explore Categories</h2>
        {activeCategory && (
          <button 
            onClick={() => onCategoryChange(null)} 
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="grid grid-flow-col auto-cols-[88px] gap-3 overflow-x-auto pb-2 no-scrollbar sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <button 
              key={cat.name} 
              onClick={() => onCategoryChange(isActive ? null : cat.name)}
              className={`group flex flex-col items-center gap-2 rounded-2xl p-1.5 transition-all ${isActive ? 'scale-105' : ''}`}
            >
              <div className={`relative w-[82px] h-[82px] rounded-2xl flex items-center justify-center group-hover:-translate-y-0.5 transition-all ${
                isActive 
                  ? 'bg-emerald-100 shadow-[0_10px_24px_rgba(6,78,59,0.25)] ring-2 ring-emerald-400' 
                  : 'bg-[linear-gradient(145deg,#ffffff,#eaf8ef)] shadow-[0_10px_24px_rgba(6,78,59,0.16)] group-hover:shadow-[0_14px_28px_rgba(6,78,59,0.22)]'
              }`}>
                <img src={cat.icon} alt={cat.name} className="w-10 h-10 object-contain" />
              </div>
              <span className={`text-xs font-semibold ${isActive ? 'text-emerald-700' : 'text-slate-700'}`}>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoriesSection;

const CategoriesSection = ({ categories }) => {
  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">Explore Categories</h2>
        <button className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">View All</button>
      </div>

      <div className="grid grid-flow-col auto-cols-[88px] gap-3 overflow-x-auto pb-2 no-scrollbar sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible">
        {categories.map((cat) => (
          <button key={cat.name} className="group flex flex-col items-center gap-2 rounded-2xl p-1.5">
            <div className="relative w-[82px] h-[82px] rounded-2xl bg-[linear-gradient(145deg,#ffffff,#eaf8ef)] shadow-[0_10px_24px_rgba(6,78,59,0.16)] flex items-center justify-center group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_28px_rgba(6,78,59,0.22)] transition-all">
              {/* <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-300"></span> */}
              <img src={cat.icon} alt={cat.name} className="w-10 h-10 object-contain" />
            </div>
            <span className="text-xs font-semibold text-slate-700">{cat.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;

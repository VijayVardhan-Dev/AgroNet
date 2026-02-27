import { Plus, Star } from 'lucide-react';

const ProductsSection = ({ crops, onProductClick, onAddToCart, image }) => {
  const formatPrice = (value) => {
    const number = Number(value);
    if (Number.isNaN(number)) return value;
    return number.toLocaleString('en-IN');
  };

  return (
    <section className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">You Might Need</h2>
        <button className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">View All</button>
      </div>

      <div className="grid grid-cols-1 min-[430px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {crops.length > 0 ? (
          crops.map((item) => (
            <article
              key={item.id}
              onClick={() => onProductClick(item.id)}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_2px_8px_rgba(15,23,42,0.08)] hover:shadow-[0_14px_32px_rgba(15,23,42,0.12)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-[5/4] bg-slate-100 overflow-hidden">
                <img
                  src={image}
                  alt={item.name}
                  className="w-full h-full object-cover opacity-95 group-hover:scale-[1.04] transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none"></div>
                <span className="absolute top-3 left-3 inline-flex items-center rounded-md bg-white/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
                  {item.category || 'Fresh'}
                </span>
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-md bg-slate-900/80 text-white px-2 py-1 text-[11px] font-semibold">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  {item.farmerRating || 4.5}
                </div>
                <button
                  className="absolute bottom-3 right-3 h-8 px-3 rounded-md bg-white text-emerald-700 border border-emerald-200 text-xs font-bold tracking-wide inline-flex items-center gap-1 shadow-sm hover:bg-emerald-50 transition-colors"
                  onClick={(e) => onAddToCart(e, item)}
                >
                  <Plus strokeWidth={2.6} className="w-3.5 h-3.5" />
                  ADD
                </button>
              </div>

              <div className="p-3.5">
                <h4 className="font-semibold text-slate-900 text-[15px] leading-5 truncate">
                  {item.name}
                </h4>
                <p className="mt-1 text-xs text-slate-500 truncate">{item.farmerName || 'Verified Farmer'}</p>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-slate-900 font-bold text-lg">Rs {formatPrice(item.price)}</span>
                  <span className="text-slate-400 text-xs font-medium">per {item.unit || 'kg'}</span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-slate-500 col-span-full text-center py-8">No crops available right now.</p>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;

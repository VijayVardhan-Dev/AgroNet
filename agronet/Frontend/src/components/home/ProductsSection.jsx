import { Plus, Star, Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

const ProductsSection = ({ crops, onProductClick, onAddToCart, image, title = 'You Might Need', emptyMessage = 'No crops available right now.' }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const formatPrice = (value) => {
    const number = Number(value);
    if (Number.isNaN(number)) return value;
    return number.toLocaleString('en-IN');
  };

  return (
    <section className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
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
                  src={item.image && !item.image.includes('placehold.co') ? item.image : image}
                  alt={item.name}
                  className="w-full h-full object-cover opacity-95 group-hover:scale-[1.04] transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none"></div>
                <span className="absolute top-3 left-3 inline-flex items-center rounded-md bg-white/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
                  {item.category || 'Fresh'}
                </span>
                
                <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}
                    className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center shadow-sm border border-gray-100 transition-colors z-10 ${isInWishlist(item.id) ? 'bg-red-50 text-red-500' : 'bg-white/95 text-slate-400 hover:text-red-500'}`}
                >
                    <Heart size={14} className={isInWishlist(item.id) ? "fill-red-500" : ""} />
                </button>
                <button
                  className="absolute bottom-3 right-3 h-8 px-3 rounded-md bg-white text-emerald-700 border border-emerald-200 text-xs font-bold tracking-wide inline-flex items-center gap-1 shadow-sm hover:bg-emerald-50 transition-colors"
                  onClick={(e) => onAddToCart(e, item)}
                >
                  <Plus strokeWidth={2.6} className="w-3.5 h-3.5" />
                  ADD
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-slate-900 text-[15px] leading-5 truncate">
                        {item.name}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded shadow-sm border border-slate-100 whitespace-nowrap">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {item.farmerRating || 4.5}
                    </div>
                </div>
                <p className="mt-1 text-xs text-slate-500 truncate">{item.farmerName || 'Verified Farmer'}</p>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-slate-900 font-bold text-lg">Rs {formatPrice(item.price)}</span>
                  <span className="text-slate-400 text-xs font-medium">per {item.unit || 'kg'}</span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-slate-500 col-span-full text-center py-8">{emptyMessage}</p>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;

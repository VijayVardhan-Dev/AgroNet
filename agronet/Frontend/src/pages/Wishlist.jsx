import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartOff, Star, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ROUTES } from '../routing/routes';

const Wishlist = () => {
    const { wishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const formatPrice = (value) => {
        const number = Number(value);
        if (Number.isNaN(number)) return value;
        return number.toLocaleString('en-IN');
    };

    const handleAddToCart = (e, item) => {
        e.stopPropagation();
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            type: item.type || 'crop', // Default to crop if undefined
            quantity: 1,
            image: item.image || "https://placehold.co/400"
        });
        // Optional: remove from wishlist automatically when added to cart? 
        // Typically Apple keeps it in wishlist, but removing it makes it a purely "saved for later" bucket. Let's keep it.
    };

    return (
        <div className="bg-[#F9FAFB] min-h-screen text-slate-800 antialiased pt-8  px-4 md:px-10 lg:px-12 w-full max-w-7xl mx-auto pb-32">
            
            {/* Minimalist Top Left Header */}
            <div className="mb-12">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-3">
                    Wishlist
                </h1>
                <p className="text-slate-500 font-medium text-sm md:text-base max-w-xl leading-relaxed">
                    Products and crops you've saved for later.
                </p>
            </div>

            {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <HeartOff size={28} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Your wishlist is empty</h3>
                    <p className="text-sm text-slate-500 mb-6">Explore the marketplace and tap the heart to save items here.</p>
                    <button 
                        onClick={() => navigate(ROUTES.HOME)}
                        className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-full hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 min-[430px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {wishlist.map((item) => (
                        <article
                            key={item.id}
                            onClick={() => navigate(`/product/${item.type || 'crop'}/${item.id}`)}
                            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-[0_14px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                        >
                            <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                                <img
                                    src={item.image || "https://placehold.co/400?text=AgroNet"}
                                    alt={item.name}
                                    className="w-full h-full object-cover mix-blend-multiply opacity-95 group-hover:scale-[1.04] transition-transform duration-500"
                                />
                                
                                <span className="absolute top-4 left-4 inline-flex items-center rounded-lg bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 shadow-sm border border-gray-100">
                                    {item.category || 'Fresh'}
                                </span>
                                
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleWishlist(item);
                                    }}
                                    className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/95 flex items-center justify-center text-red-500 shadow-sm border border-gray-100 hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={0} className="w-5 h-5">
                                        <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="font-semibold text-slate-900 text-base leading-snug truncate">
                                        {item.name}
                                    </h4>
                                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-gray-50 px-1.5 py-0.5 rounded shadow-sm border border-gray-100 whitespace-nowrap">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        {item.farmerRating || 4.5}
                                    </div>
                                </div>
                                
                                <p className="text-[13px] text-slate-500 truncate mb-4">{item.farmerName || 'Verified Farmer'}</p>
                                
                                <div className="mt-auto flex items-end justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-0.5">Price</span>
                                        <span className="text-slate-900 font-bold text-lg leading-none">
                                            ₹{formatPrice(item.price)}
                                            <span className="text-slate-400 font-medium text-xs ml-1 font-normal">/{item.unit || 'kg'}</span>
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => handleAddToCart(e, item)}
                                        className="h-10 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold tracking-wide flex items-center gap-2 shadow-sm hover:bg-slate-800 active:scale-[0.96] transition-all"
                                    >
                                        <ShoppingCart size={16} />
                                        Add
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist; 

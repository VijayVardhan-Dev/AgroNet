import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronRight, 
  Star, 
  ShoppingCart, 
  Share2, 
  Heart, 
  MapPin, 
  MessageSquare,
//   Agriculture, // Note: Using Lucide equivalents for Material Icons
  Diamond,
  Plus,
  Minus,
  Calendar
} from 'lucide-react';

// Service imports
import { getCropById } from '../services/cropService';
import { getEquipmentById } from '../services/equipmentService';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [type, id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      let data = null;
      if (type === 'crop') {
        data = await getCropById(id);
      } else if (type === 'equipment') {
        data = await getEquipmentById(id);
      }
      setProduct(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      type: type,
      quantity: quantity,
      image: product.image || "https://placehold.co/400"
    });
    alert("Added to cart!");
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-emerald-600 font-medium">Loading AgroNet...</div>;
  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <div className="bg-[#F9FAFB] min-h-screen text-slate-800 antialiased pb-32">
      {/* Main Content */}
      <main className="pt-8 md:pt-12 px-4 md:px-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-14 pb-48 md:pb-24">
        
        {/* Left Column: Image */}
        <div className="w-full md:w-1/2">
            {/* Navigation & Breadcrumbs */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors pointer-events-auto">
                    <ArrowLeft size={16} />
                    Back
                </button>
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer">Marketplace</span>
            <ChevronRight size={10} />
            <span className="hover:text-slate-600 cursor-pointer capitalize">{type}</span>
            <ChevronRight size={10} />
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full capitalize">
                {product.category || 'General'}
            </span>
                </div>
            </div>

            {/* Hero Image */}
            <div className="relative w-full aspect-[4/3] md:aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-8 group">
            <img 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 mix-blend-multiply" 
                src={product.image || (type === 'crop' ? "https://placehold.co/600x450?text=Crops" : "https://placehold.co/600x450?text=Equipment")}
            />
            <div className="absolute top-4 left-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur shadow-sm border border-gray-100">
                <span className="text-emerald-500"><Star size={14} fill="currentColor" /></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Premium</span>
                </div>
            </div>
            </div>
        </div>

        {/* Right Column: Details */}
        <div className="w-full md:w-1/2 flex flex-col md:pt-14">
            {/* Info Card */}
            <div className="bg-white md:bg-transparent rounded-3xl md:rounded-none p-6 md:p-0 shadow-sm md:shadow-none border border-gray-100 md:border-none mb-6">
            <div className="flex flex-col gap-1 mb-8">
                <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                        <span className="text-[14px] font-bold">A</span>
                    </span>
                    <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">AgroNet Certified</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800 leading-snug">
                    {product.name}
                    </h1>
                </div>
                <div className="text-right">
                    <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-2xl md:text-3xl font-medium text-slate-900">₹{product.price}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium block mt-1">
                    {type === 'equipment' ? 'per day' : 'per kg'}
                    </span>
                </div>
                </div>
            </div>

            <hr className="border-gray-100 md:border-gray-200 mb-8"/>

            {/* Seller Info */}
            <div className="flex items-center justify-between mb-8 bg-gray-50/50 md:bg-white p-3.5 rounded-2xl border border-gray-100 md:border-gray-200">
                <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-base font-semibold">
                    {(product.farmerName || "A")[0]}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                    <span className="text-blue-500 text-[10px] font-bold">✓</span>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 leading-none mb-1">
                    {product.farmerName || product.ownerName || "AgroNet User"}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded shadow-sm border border-gray-100">
                        <Star size={10} fill="#fbbf24" className="text-amber-400" />
                        <span className="text-slate-600 font-medium">{product.farmerRating || '4.5'}</span>
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="font-medium text-slate-400 truncate max-w-[150px]"><MapPin size={10} className="inline mr-1" /> {product.farmerLocation || "Location"}</span>
                    </div>
                </div>
                </div>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
                <MessageSquare size={18} />
                </button>
            </div>

            {/* Description */}
            <div className="mb-10">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Overview</h3>
                <p className="text-slate-500 text-base leading-relaxed font-normal">
                {product.description || "No description provided for this item. Contact the seller for more technical details or quality assurance reports."}
                </p>
            </div>

            {/* Specifications */}
            <div className="mb-10">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                <SpecCard label="Category" value={product.category || 'N/A'} />
                <SpecCard label="Availability" value={product.quantity ? `${product.quantity} units` : 'Available'} />
                </div>
            </div>

            {/* Order Controls */}
            <div className="space-y-6 pt-5 border-t border-gray-100 md:border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                <div className="w-full sm:w-auto">
                    <label className="block text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quantity</label>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl h-12 px-1">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors m-1"
                    >
                        <Minus size={16} />
                    </button>
                    <div className="w-12 text-center text-sm font-semibold text-slate-800">{quantity}</div>
                    <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors m-1"
                    >
                        <Plus size={16} />
                    </button>
                    </div>
                </div>
                <div className="bg-slate-50 rounded-xl h-12 flex flex-1 sm:flex-none flex-col sm:flex-row sm:items-center sm:gap-4 justify-center px-5 border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">Total</span>
                    <span className="text-lg md:text-xl font-semibold text-slate-900">₹{(product.price * quantity).toLocaleString()}</span>
                </div>
                </div>

                {/* Desktop Add to Cart Button */}
                <div className="hidden md:flex gap-4 pt-5">
                    <button className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-slate-500 hover:bg-gray-50 transition-colors">
                        <Heart size={18} />
                    </button>
                    <button 
                        onClick={handleAddToCart}
                        className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={18} />
                        <span className="font-medium text-sm tracking-wide">Add to Cart</span>
                    </button>
                </div>
            </div>
            </div>
        </div>
      </main>

      {/* Mobile Fixed Footer Actions */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 p-4 pb-8 bg-white/90 backdrop-blur-md border-t border-gray-100 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto flex gap-3">
          <button className="w-14 h-14 bg-white rounded-xl border border-gray-200 flex flex-shrink-0 items-center justify-center text-slate-500 hover:bg-gray-50 shadow-sm">
            <Share2 size={20} />
          </button>
          <button 
            onClick={handleAddToCart}
            className="flex-1 h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
          >
            <ShoppingCart size={22} />
            <span className="font-bold text-base tracking-wide">Add to Cart</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

// Helper component for specifications
const SpecCard = ({ label, value }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-1">
    <span className="text-[10px] uppercase tracking-wide text-slate-400 font-medium">{label}</span>
    <span className="font-semibold text-sm text-slate-700 capitalize">{value}</span>
  </div>
);

export default ProductDetails; 
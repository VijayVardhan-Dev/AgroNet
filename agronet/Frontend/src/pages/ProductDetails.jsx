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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50 text-slate-600 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <span className="font-medium text-sm text-slate-500">Product Details</span>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50 text-slate-600 group">
          <Heart size={24} className="group-hover:text-red-500 transition-colors" />
        </button>
      </header>

      <main className="pt-20 px-4 w-full max-w-lg mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 mb-6 px-1">
          <span className="hover:text-slate-600 cursor-pointer">Marketplace</span>
          <ChevronRight size={10} />
          <span className="hover:text-slate-600 cursor-pointer capitalize">{type}</span>
          <ChevronRight size={10} />
          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full capitalize">
            {product.category || 'General'}
          </span>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-8 group">
          <img 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
            src={product.image || (type === 'crop' ? "https://placehold.co/600x450?text=Crops" : "https://placehold.co/600x450?text=Equipment")}
          />
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur shadow-sm border border-gray-100">
              <span className="text-emerald-500"><Star size={14} fill="currentColor" /></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Premium</span>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col gap-1 mb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                    <span className="text-[14px] font-bold">A</span>
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">AgroNet Certified</span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 leading-tight">
                  {product.name}
                </h1>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-2xl font-semibold text-slate-900">₹{product.price}</span>
                </div>
                <span className="text-xs text-slate-400 font-medium block">
                   {type === 'equipment' ? 'per day' : 'per kg'}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-6"/>

          {/* Seller Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                  {(product.farmerName || "A")[0]}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                  <span className="text-blue-500 text-[10px] font-bold">✓</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 leading-none mb-1">
                  {product.farmerName || product.ownerName || "AgroNet User"}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-0.5">
                    <Star size={12} fill="#fbbf24" className="text-amber-400" />
                    <span className="text-slate-700 font-medium">{product.farmerRating || '4.5'}</span>
                  </span>
                  <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
                  <span className="truncate max-w-[100px]">{product.farmerLocation || "Location"}</span>
                </div>
              </div>
            </div>
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-slate-400 hover:text-emerald-600 transition-all">
              <MessageSquare size={18} />
            </button>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-slate-900 mb-3">Overview</h3>
            <p className="text-slate-500 text-sm leading-7 font-light">
              {product.description || "No description provided for this item. Contact the seller for more technical details or quality assurance reports."}
            </p>
          </div>

          {/* Order Controls */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quantity</label>
                <div className="flex items-center bg-gray-50 border border-transparent rounded-xl h-12 px-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-emerald-600"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="flex-1 text-center text-sm font-semibold text-slate-900">{quantity}</div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-emerald-600"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              <div className="bg-emerald-50/50 rounded-xl h-12 flex flex-col items-end justify-center px-4 border border-emerald-100/50">
                <span className="text-[10px] font-medium text-slate-500 uppercase">Total</span>
                <span className="text-base font-bold text-slate-900">₹{product.price * quantity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <h3 className="text-sm font-medium text-slate-900 mb-3 px-1">Specifications</h3>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <SpecCard label="Category" value={product.category || 'N/A'} />
          <SpecCard label="Availability" value={product.quantity ? `${product.quantity} units` : 'Available'} />
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-40 shadow-lg">
        <div className="max-w-lg mx-auto flex gap-3">
          <button className="w-14 h-14 rounded-xl border border-gray-200 flex items-center justify-center text-slate-500 hover:bg-gray-50">
            <Share2 size={20} />
          </button>
          <button 
            onClick={handleAddToCart}
            className="flex-1 h-14 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
          >
            <ShoppingCart size={22} />
            <span className="font-semibold text-base">Add to Cart</span>
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
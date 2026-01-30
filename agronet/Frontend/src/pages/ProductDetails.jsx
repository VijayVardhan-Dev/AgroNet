import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCropById } from '../services/cropService';
import { getEquipmentById } from '../services/equipmentService';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Star, MapPin } from 'lucide-react';
import { ROUTES } from '../routing/routes';

const ProductDetails = () => {
    const { type, id } = useParams(); // type: 'crop' or 'equipment'
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

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
            console.error(error);
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
            type: type, // 'crop' or 'equipment'
            image: product.image || "https://placehold.co/100"
        });
        alert("Added to cart!");
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!product) return <div className="p-8">Product not found.</div>;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 mb-6 hover:text-green-700">
                <ArrowLeft size={18} /> Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                {/* Image Section */}
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <img
                        src={product.image || (type === 'crop' ? "https://placehold.co/600x600?text=Crop" : "https://placehold.co/600x600?text=Tractor")}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Info Section */}
                <div className="flex flex-col justify-between space-y-4">
                    <div>
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold uppercase">{product.category}</span>
                        </div>

                        <div className="flex items-center gap-4 mt-2 mb-4">
                            <span className="text-2xl font-bold text-green-600">₹{product.price} <span className="text-sm text-gray-400 font-normal">{type === 'equipment' ? '/ day' : ''}</span></span>
                            {type === 'crop' && (
                                <span className="text-sm text-gray-500 border-l border-gray-300 pl-4">{product.quantity} available</span>
                            )}
                        </div>

                        <p className="text-gray-600 leading-relaxed">{product.description || "No description provided."}</p>

                        <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                            <h3 className="font-semibold text-gray-800">Seller Information</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                    <div>
                                        <p className="font-medium">{product.farmerName || product.ownerName || "AgroNet User"}</p>
                                        <div className="flex items-center text-xs text-yellow-500 gap-0.5">
                                            <Star size={12} fill="currentColor" /> {product.farmerRating || 4.5}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                    <p className="flex items-center justify-end gap-1"><MapPin size={14} /> {product.farmerLocation || product.location?.address || "Location"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

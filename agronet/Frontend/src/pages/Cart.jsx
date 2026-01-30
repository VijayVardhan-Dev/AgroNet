import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routing/routes';
import { createDelivery } from '../services/deliveryService';
import { useUserLocation } from '../context/LocationContext';
import LocationPicker from '../components/LocationPicker';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { location } = useUserLocation();
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [selectedDrop, setSelectedDrop] = useState(null);

    const handleCheckoutStart = () => {
        if (cart.length === 0) return;
        if (!location) {
            alert("Please enable location services to proceed.");
            return;
        }
        setSelectedDrop(location); // Default to current location
        setShowLocationPicker(true);
    };

    const handleConfirmOrder = async () => {
        if (!selectedDrop) return;

        // Pickup = Farm / Store (Simulated for now)
        // In real app, this comes from the Item's seller info
        const pickup = {
            lat: 16.9895,
            lng: 82.2480,
            address: "AgroNet Distribution Center, Kakinada"
        };

        // Drop = User's Selected Location
        const drop = {
            lat: selectedDrop.lat,
            lng: selectedDrop.lng,
            address: "Customer Pinned Location"
        };

        const orderId = "ORDER-" + Date.now();
        await createDelivery(orderId, pickup, drop);

        alert("Order Placed! Delivery Agent is being assigned.");
        clearCart();
        setShowLocationPicker(false);
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="bg-gray-100 p-6 rounded-full">
                    <Trash2 className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
                <p className="text-gray-500 max-w-sm">Looks like you haven't added anything to your cart yet.</p>
                <Link to={ROUTES.HOME} className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="flex-1 space-y-4">
                    {cart.map((item) => (
                        <div key={`${item.id} -${item.type} `} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="h-24 w-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                        <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="p-1 hover:bg-white rounded shadow-sm disabled:opacity-50"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity || 1}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="p-1 hover:bg-white rounded shadow-sm"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <p className="font-bold text-lg">₹{(item.price * (item.quantity || 1)).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button onClick={clearCart} className="text-red-500 text-sm hover:underline">Clear Cart</button>
                </div>

                {/* Order Summary */}
                <div className="lg:w-80">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="font-bold text-xl mb-4">Order Summary</h2>

                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping Estimate</span>
                                <span>₹50</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg text-gray-900">
                                <span>Total</span>
                                <span>₹{(cartTotal + 50 + (cartTotal * 0.05)).toFixed(2)}</span>
                            </div>
                        </div>

                        {!showLocationPicker ? (
                            <button
                                onClick={handleCheckoutStart}
                                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition shadow-lg shadow-green-200"
                            >
                                Checkout <ArrowRight size={18} />
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin size={16} />
                                    <span>Confirm Delivery Location</span>
                                </div>
                                <LocationPicker
                                    initialPos={location}
                                    onLocationSelect={setSelectedDrop}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowLocationPicker(false)}
                                        className="flex-1 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmOrder}
                                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

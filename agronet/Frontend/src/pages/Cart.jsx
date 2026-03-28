import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, MapPin, Package, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routing/routes';
import { createDelivery } from '../services/deliveryService';
import { createOrder } from '../services/orderService';
import { useUserLocation } from '../context/LocationContext';
import LocationPicker from '../components/LocationPicker';
import { distanceBetween } from 'geofire-common';

const Cart = () => {
    const { userProfile } = useAuth();
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { location } = useUserLocation();
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [selectedDrop, setSelectedDrop] = useState(null);

    const handleCheckoutStart = () => {
        if (cart.length === 0) return;
        
        // If system has location, use it. Otherwise, default to center of India to allow manual pinning
        const initialDrop = location || { lat: 20.5937, lng: 78.9629 };
        setSelectedDrop(initialDrop);
        setShowLocationPicker(true);
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const currentLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setSelectedDrop(currentLoc);
                // Also update the LocationPicker state implicitly by passing the new initialPos via selectedDrop
            },
            (error) => {
                console.error(error);
                alert("Unable to retrieve your location. Please ensure location services are enabled.");
            },
            { enableHighAccuracy: true }
        );
    };

    const handleConfirmOrder = async () => {
        if (!selectedDrop || cart.length === 0) return;

        // Drop = User's Selected Location
        const drop = {
            lat: selectedDrop.lat,
            lng: selectedDrop.lng,
            address: "Customer Pinned Location"
        };
        const buyerName = userProfile?.fullName || "User";
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        try {
            // Process each cart item as a separate order/delivery for clean tracking
            for (const item of cart) {
                // Simulate pickup (In real app, fetch vendor location)
                const pickup = {
                    lat: 16.9895, 
                    lng: 82.2480,
                    address: "AgroNet Distribution Center, Kakinada"
                };

                // Calculate Distance Fare (₹15 per km, Min ₹50)
                const distanceInKm = distanceBetween([pickup.lat, pickup.lng], [drop.lat, drop.lng]);
                const itemFare = Math.max(50, Math.round(distanceInKm * 15));

                const orderData = {
                    itemId: item.id,
                    itemName: item.name,
                    quantity: item.quantity || 1,
                    totalAmount: item.price * (item.quantity || 1),
                    sellerId: item.sellerId || "STORE", // Assuming item has sellerId
                    buyerId: userProfile?.uid || "GUEST",
                };

                // 1. Create the Order
                const createdOrder = await createOrder(orderData);
                
                // 2. Create the linked Delivery
                const itemsSummary = `${item.quantity || 1}x ${item.name}`;
                await createDelivery(createdOrder.id, pickup, drop, buyerName, itemFare, itemsSummary, otp);
            }

            // Alert clearly to user (could also be a modal)
            alert(`Order Placed Successfully!\n\nIMPORTANT: Your Delivery OTP is ${otp}\n(You can also view it in your My Orders page)`);
            
            clearCart();
            setShowLocationPicker(false);
        } catch (error) {
            console.error(error);
            alert("Failed to place order. Please try again.");
        }
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] pb-32 text-center px-4">
                <h2 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">Your bag is empty.</h2>
                <p className="text-gray-500 mb-10 text-lg">Free delivery on eligible items over ₹500.</p>
                <Link to={ROUTES.HOME} className="bg-green-600 text-white px-8 py-3 rounded-full font-medium tracking-wide hover:bg-green-700 transition">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className=" mx-auto px-6 md:px-12 py-5 pb-40 min-h-screen bg-white text-black">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-baseline gap-4">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Review your bag.</h1>
                <p className="text-gray-500 text-sm font-medium">Free delivery on orders over ₹500.</p>
            </div>

            <div className="flex flex-col gap-12">
                {/* Cart Items */}
                <div className="space-y-0">
                    {cart.map((item) => (
                        <div key={`${item.id}-${item.type}`} className="flex gap-6 border-gray-200 group">
                            <div className="h-28 w-28 md:h-36 md:w-36 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="font-semibold text-xl tracking-tight text-gray-900 mb-1 leading-tight">{item.name}</h3>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{item.type}</p>
                                    </div>
                                    <p className="font-semibold text-xl text-gray-900 shrink-0">₹{(item.price * (item.quantity || 1)).toLocaleString()}</p>
                                </div>

                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-medium text-gray-500 mr-2">Qty</span>
                                        <div className="flex items-center bg-gray-100/80 rounded-full px-1 py-1 border border-gray-100">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-1 hover:bg-white rounded-full transition text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} strokeWidth={2.5} />
                                            </button>
                                            <span className="font-semibold text-sm w-6 text-center">{item.quantity || 1}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-1 hover:bg-white rounded-full transition text-gray-500"
                                            >
                                                <Plus size={14} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-green-700 hover:text-green-800 text-sm font-medium hover:underline transition-colors mt-2">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary & Checkout */}
                <div className="mt-8">
                    {!showLocationPicker ? (
                        <div className="md:w-2/3 ml-auto space-y-4">
                            <div className="flex justify-between items-center text-gray-600 text-lg">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-600 text-lg">
                                <span>Shipping</span>
                                <span>₹50</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-600 text-lg">
                                <span>Estimated Tax</span>
                                <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between items-end mb-8">
                                <span className="text-2xl font-semibold text-gray-900">Total</span>
                                <span className="text-3xl font-semibold tracking-tight text-gray-900">₹{(cartTotal + 50 + (cartTotal * 0.05)).toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleCheckoutStart}
                                className="w-full bg-green-700 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:bg-green-800 transition shadow-md"
                            >
                                Check Out
                            </button>
                            
                            <div className="pt-8 text-center">
                                <button onClick={clearCart} className="text-sm font-medium text-gray-400 hover:text-red-500 hover:underline transition">Clear Bag</button>
                            </div>
                        </div>
                    ) : (
                            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 max-w-2xl mx-auto">
                            <div className="flex justify-between items-end mb-6">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <MapPin size={24} className="text-green-600" /> Confirm Delivery Pin
                                </h3>
                                <button 
                                    onClick={handleUseCurrentLocation}
                                    className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition flex items-center gap-1"
                                >
                                    <Navigation size={14} /> My Location
                                </button>
                            </div>
                            <div className="rounded-2xl overflow-hidden border border-gray-200 mb-6 bg-white shrink-0">
                                <LocationPicker
                                    initialPos={selectedDrop || location}
                                    onLocationSelect={setSelectedDrop}
                                />
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <button
                                    onClick={() => setShowLocationPicker(false)}
                                    className="sm:w-1/3 py-3 border border-gray-300 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmOrder}
                                    className="flex-1 bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition"
                                >
                                    Confirm Order — ₹{(cartTotal + 50 + (cartTotal * 0.05)).toFixed(2)}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;

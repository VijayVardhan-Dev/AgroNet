import React, { useState, useEffect } from 'react';
import {
    Star, BadgeCheck, Tag, MapPin, ShoppingCart
} from 'lucide-react';
import { getEquipment } from '../services/equipmentService';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Rentals = () => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        const data = await getEquipment();
        setEquipmentList(data);
    };

    // Group by type or just filter
    const filteredEquipment = selectedCategory === 'All'
        ? equipmentList
        : equipmentList.filter(item => item.type === selectedCategory);

    const categories = ['All', 'Tractor', 'Harvester', 'Sprayer', 'Drone', 'Other'];

    const handleProductClick = (id) => {
        navigate(`/product/equipment/${id}`);
    };

    const handleAddToCart = (e, item) => {
        e.stopPropagation();
        addToCart({
            id: item.id,
            name: item.name,
            price: item.pricePerHour, // Using pricePerHour as price for cart placeholder
            type: 'equipment',
            image: "https://placehold.co/100?text=Equip"
        });
        alert(`Added ${item.name} to cart!`);
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-24">
            {/* --- Search Bar --- */}
            <div className="px-4 mb-6 pt-4">
                <div className="bg-gray-100 rounded-lg flex items-center px-4 py-3">
                    <input
                        type="text"
                        placeholder="search"
                        className="bg-transparent w-full outline-none text-gray-600 placeholder-gray-300 text-sm"
                    />
                </div>
            </div>

            {/* --- Categories --- */}
            <div className="pl-4 mb-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Categories</h2>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide pr-4">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2 rounded-lg text-sm whitespace-nowrap transition-colors
                                ${selectedCategory === cat
                                    ? 'bg-green-200 text-green-900 font-medium'
                                    : 'bg-white text-gray-700 border border-gray-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Product List --- */}
            <div className="px-4 space-y-4">
                {filteredEquipment.length > 0 ? filteredEquipment.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleProductClick(item.id)}
                        className="bg-white rounded-xl p-3 shadow-sm flex gap-4 cursor-pointer hover:shadow-md transition-shadow relative group"
                    >
                        {/* Image Area */}
                        <div className="h-24 w-24 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                            <img
                                src="https://placehold.co/100?text=Equip"
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Card Details */}
                        <div className="space-y-1 flex-1">
                            <h3 className="text-sm font-bold text-gray-900 leading-tight">
                                {item.name} <span className="text-xs font-normal text-gray-500">({item.model})</span>
                            </h3>

                            <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500 truncate">by {item.ownerName}</span>
                                <BadgeCheck className="w-3 h-3 text-blue-500 fill-blue-500" />
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <div className="flex items-center bg-green-50 px-1 rounded">
                                    <span className="font-bold text-green-700 mr-0.5">4.5</span>
                                    <Star className="w-2 h-2 fill-green-700 text-green-700" />
                                </div>
                                <div className="flex items-center truncate">
                                    <MapPin className="w-2 h-2 mr-0.5" />
                                    {item.location?.address || "Unknown"}
                                </div>
                            </div>

                            <div className="flex items-center text-sm pt-1">
                                <Tag className="w-3 h-3 text-green-700 mr-1 rotate-90" />
                                <span className="font-bold text-green-700">₹{item.pricePerHour}</span>
                                <span className="text-xs text-gray-400 ml-1">/hr</span>
                            </div>
                        </div>

                        {/* Action Button (e.g. Rent) */}
                        <div className="flex flex-col justify-center gap-2 z-10">
                            <button
                                onClick={(e) => handleAddToCart(e, item)}
                                className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded border border-green-200 hover:bg-green-100 flex items-center gap-1"
                            >
                                <ShoppingCart size={12} /> Rent
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center text-gray-400 py-10">No equipment found.</div>
                )}
            </div>
        </div>
    );
};

export default Rentals;
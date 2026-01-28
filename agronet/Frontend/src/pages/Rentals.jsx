import React from 'react';
import {
    ArrowLeft,
    Search,
    MapPin,
    Star,
    BadgeCheck,
    Tag,
    Home,
    Key,
    Map as MapIcon,
    MessageSquare
} from 'lucide-react';

const Rentals = () => {
    // Mock Data to match the screenshot
    const categories = [
        { name: 'Cutter', active: true },
        { name: 'Tractor', active: false },
        { name: 'Sprayer', active: false },
        { name: 'Drones', active: false },
        { name: 'Machines', active: false },
        { name: 'cart', active: false },
        { name: 'other', active: false },
    ];

    const sections = [
        {
            title: 'Tractor',
            items: [
                {
                    id: 1,
                    name: 'Mahindra Tractor',
                    owner: 'Krishna Murthy',
                    rating: 4.2,
                    location: 'Kakinda, 5km',
                    price: 2500,
                    verified: true,
                    image: '/api/placeholder/400/300' // Placeholder for Tractor
                },
                {
                    id: 2,
                    name: 'Mahindra Tractor',
                    owner: 'Krishna Murthy',
                    rating: 4.2,
                    location: 'Kakinda, 5km',
                    price: 2500,
                    verified: true,
                    image: '/api/placeholder/400/300'
                },
                {
                    id: 3,
                    name: 'Mahindra Tractor',
                    owner: 'Krishna Murthy',
                    rating: 4.2,
                    location: 'Kakinda, 5km',
                    price: 2500,
                    verified: true,
                    image: '/api/placeholder/400/300'
                },
            ]
        },
        {
            title: 'Drones',
            items: [
                {
                    id: 4,
                    name: 'Dji Drone',
                    owner: 'Vardhan Dev',
                    rating: 4.2,
                    location: 'Kakinda, 5km',
                    price: 4500,
                    verified: true,
                    image: '/api/placeholder/400/300' // Placeholder for Drone
                },
                {
                    id: 5,
                    name: 'Dji Drone',
                    owner: 'Vardhan Dev',
                    rating: 4.2,
                    location: 'Kakinda, 5km',
                    price: 4500,
                    verified: true,
                    image: '/api/placeholder/400/300'
                },
                {
                    id: 6,
                    name: 'Dji Drone',
                    owner: 'Vardhan Dev',
                    rating: 4.2,
                    location: 'Kakinda, 5km',
                    price: 4500,
                    verified: true,
                    image: '/api/placeholder/400/300'
                },
            ]
        },
        {
            title: 'Sprayer',
            items: [
                {
                    id: 7,
                    name: 'Sprayer Pump',
                    owner: 'Local Shop',
                    rating: 4.0,
                    location: 'Kakinda, 2km',
                    price: 500,
                    verified: false,
                    image: '/api/placeholder/400/300' // Placeholder for Sprayer
                },
                {
                    id: 8,
                    name: 'Sprayer Pump',
                    owner: 'Local Shop',
                    rating: 4.0,
                    location: 'Kakinda, 2km',
                    price: 500,
                    verified: false,
                    image: '/api/placeholder/400/300'
                },
            ]
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-24">

            {/* --- Categories --- */}
            <div className="pl-4 mb-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Categories</h2>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide pr-4">
                    {categories.map((cat, index) => (
                        <button
                            key={index}
                            className={`px-6 py-2 rounded-lg text-sm whitespace-nowrap transition-colors
                ${cat.active
                                    ? 'bg-green-200 text-green-900 font-medium'
                                    : 'bg-white text-gray-700 border border-gray-100'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Product Sections --- */}
            <div className="space-y-6">
                {sections.map((section) => (
                    <div key={section.title} className="pl-4">
                        {/* Section Header */}
                        <div className="flex justify-between items-center pr-4 mb-3">
                            <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
                            <button className="text-green-500 text-sm font-medium">view more</button>
                        </div>

                        {/* Horizontal Scroll List */}
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide pr-4">
                            {section.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="min-w-[180px] w-[180px] md:min-w-[220px] md:w-[220px] lg:min-w-[260px] lg:w-[260px] bg-white rounded-xl p-2 shadow-sm flex-shrink-0"
                                >
                                    {/* Image Area */}
                                    <div className="h-32 lg:h-40 w-full bg-gray-200 rounded-lg mb-2 overflow-hidden relative">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Card Details */}
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                                            {item.name}
                                        </h3>

                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-gray-500 truncate">by {item.owner}</span>
                                            {item.verified && (
                                                <BadgeCheck className="w-3 h-3 text-blue-500 fill-blue-500 text-white" />
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="flex items-center bg-green-50 px-1 rounded">
                                                <span className="font-bold text-green-700 mr-0.5">{item.rating}</span>
                                                <Star className="w-2 h-2 fill-green-700 text-green-700" />
                                            </div>
                                            <div className="flex items-center truncate">
                                                <MapPin className="w-2 h-2 mr-0.5" />
                                                {item.location}
                                            </div>
                                        </div>

                                        <div className="flex items-center text-sm pt-1">
                                            <Tag className="w-3 h-3 text-green-700 mr-1 rotate-90" />
                                            <span className="font-bold text-green-700">₹{item.price}</span>
                                            <span className="text-xs text-gray-400 ml-1">/hr</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default Rentals;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Bell, Package, Truck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistoryAsNotifications = async () => {
            if (!user) return;
            try {
                // Fetch recent orders to construct a notification timeline
                const q = query(
                    collection(db, "orders"), 
                    where("buyerId", "==", user.uid)
                );
                
                const querySnapshot = await getDocs(q);
                let notes = [];
                
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const status = data.status || 'pending';
                    const dateRaw = data.createdAt ? data.createdAt.toDate() : new Date();
                    
                    if (status === 'accepted') {
                        notes.push({
                            id: doc.id + '-accepted',
                            title: 'Order Accepted',
                            message: `Farmer ${data.farmerName || ''} accepted your order for ${data.items?.[0]?.name || 'items'}.`,
                            date: dateRaw,
                            type: 'accepted',
                            orderId: doc.id
                        });
                    }
                    if (status === 'picked_up') {
                        notes.push({
                            id: doc.id + '-picked',
                            title: 'Order on the way',
                            message: `Your order for ${data.items?.[0]?.name || 'items'} has been picked up by a driver.`,
                            date: dateRaw,
                            type: 'picked_up',
                            orderId: doc.id
                        });
                    }
                    if (status === 'delivered') {
                        notes.push({
                            id: doc.id + '-delivered',
                            title: 'Order Delivered',
                            message: `Your order for ${data.items?.[0]?.name || 'items'} was successfully delivered!`,
                            date: dateRaw,
                            type: 'delivered',
                            orderId: doc.id
                        });
                    }
                });

                // Sort by newest first
                notes.sort((a, b) => b.date - a.date);
                setNotifications(notes);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistoryAsNotifications();
    }, [user]);

    const getIcon = (type) => {
        switch(type) {
            case 'accepted': return <Package size={20} className="text-blue-500" />;
            case 'picked_up': return <Truck size={20} className="text-amber-500" />;
            case 'delivered': return <CheckCircle2 size={20} className="text-emerald-500" />;
            default: return <Bell size={20} className="text-slate-500" />;
        }
    };

    const getBg = (type) => {
        switch(type) {
            case 'accepted': return 'bg-blue-50';
            case 'picked_up': return 'bg-amber-50';
            case 'delivered': return 'bg-emerald-50';
            default: return 'bg-gray-50';
        }
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    return (
        <div className="bg-[#F9FAFB] min-h-screen text-slate-800 antialiased pt-8 md:pt-14 px-4 md:px-10 lg:px-12 w-full max-w-4xl mx-auto pb-32">
            
            {/* Minimalist Header */}
            <div className="mb-10">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-2">
                    Notifications
                </h1>
                <p className="text-slate-500 font-medium text-sm">
                    Updates on your recent activities and orders.
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col gap-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-24 bg-white rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <Bell size={28} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">No notifications yet</h3>
                    <p className="text-sm text-slate-500">When you place an order, updates will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    {notifications.map((note, index) => (
                        <div 
                            key={note.id} 
                            onClick={() => navigate('/orders')}
                            className={`flex gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors ${index !== notifications.length - 1 ? 'border-b border-gray-50' : ''}`}
                        >
                            <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${getBg(note.type)}`}>
                                {getIcon(note.type)}
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h4 className="text-[15px] font-semibold text-slate-900 tracking-tight">{note.title}</h4>
                                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap ml-4">
                                        {timeAgo(note.date)}
                                    </span>
                                </div>
                                <p className="text-[13px] text-slate-500 leading-snug pr-8">
                                    {note.message}
                                </p>
                            </div>
                            <div className="flex-shrink-0 flex items-center justify-center text-slate-300">
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications; 

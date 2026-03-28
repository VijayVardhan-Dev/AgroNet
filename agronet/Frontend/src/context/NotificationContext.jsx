import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();
    
    // Auto-remove toasts after 4 seconds
    const addNotification = useCallback((message, type = "info") => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        setNotifications(prev => [...prev, { id, message, type }]);
        
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 4000);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Global listener for order changes (User is Buyer)
    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, "orders"), where("buyerId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "modified") {
                    const data = change.doc.data();
                    const status = data.status || 'pending';
                    
                    let message = "";
                    if (status === 'accepted') message = "Your order was accepted by a driver!";
                    if (status === 'picked_up') message = "Your order has been picked up & is on the way!";
                    if (status === 'delivered') message = "Your order has been successfully delivered!";
                    
                    // Only alert if we have a defined status change
                    if (message) {
                        addNotification(message, "success");
                    }
                }
            });
        });

        return () => unsubscribe();
    }, [user, addNotification]);

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            
            {/* Global Toast Container - Fixed Top Right Apple Minimalist */}
            <div className="fixed top-6 right-4 sm:right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {notifications.map(note => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                            className="pointer-events-auto flex items-center gap-3 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-4 py-3.5 rounded-2xl min-w-[280px] max-w-sm"
                        >
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-emerald-600 font-bold text-sm">✓</span>
                            </div>
                            <p className="text-[13px] font-semibold text-slate-700 tracking-tight leading-snug">{note.message}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
}; 

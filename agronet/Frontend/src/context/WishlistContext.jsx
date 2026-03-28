import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        console.warn("useWishlist must be used within a WishlistProvider");
        return { wishlist: [], toggleWishlist: () => {}, isInWishlist: () => false };
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        try {
            const savedItem = localStorage.getItem('agronet_wishlist');
            return savedItem ? JSON.parse(savedItem) : [];
        } catch (error) {
            console.warn("Failed to parse wishlist from local storage", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('agronet_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.some(item => item.id === product.id);
            if (exists) {
                return prev.filter(item => item.id !== product.id);
            } else {
                return [...prev, product];
            }
        });
    };

    const isInWishlist = (id) => wishlist.some(item => item.id === id);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}; 

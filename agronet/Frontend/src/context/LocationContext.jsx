import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { geohashForLocation } from 'geofire-common';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        const success = async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });

            // If user is logged in, sync to Firestore
            if (user) {
                try {
                    const hash = geohashForLocation([latitude, longitude]);
                    const userRef = doc(db, 'users', user.uid);
                    // Use set with merge true in case doc doesn't exist, or just update
                    // However, users usually exist by now. We'll use update and catch if not.
                    // Actually, safer to check if we can just do this update.
                    await updateDoc(userRef, {
                        location: {
                            lat: latitude,
                            lng: longitude,
                            geohash: hash
                        },
                        lastLocationUpdate: new Date().toISOString()
                    });
                } catch (e) {
                    console.error("Error syncing location to backend:", e);
                }
            }
        };

        const errorCallback = (err) => {
            console.error("Error getting location:", err);
            setError("Unable to retrieve your location");
        };

        // Watch position for real-time updates
        const watcher = navigator.geolocation.watchPosition(success, errorCallback, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });

        return () => navigator.geolocation.clearWatch(watcher);
    }, [user]);

    return (
        <LocationContext.Provider value={{ location, error }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useUserLocation = () => useContext(LocationContext);

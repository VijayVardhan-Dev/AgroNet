import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc, runTransaction, onSnapshot } from "firebase/firestore";
import { geohashForLocation } from 'geofire-common';

const COLLECTION_NAME = "deliveries";

export const createDelivery = async (orderId, pickup, drop) => {
    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            orderId,
            pickupLocation: pickup,
            dropLocation: drop,
            driverId: null,
            status: "SEARCHING_DRIVER",
            createdAt: new Date()
        });
    } catch (error) {
        console.error("Error creating delivery:", error);
    }
};

export const updateDriverLocation = async (driverId, lat, lng) => {
    try {
        const hash = geohashForLocation([lat, lng]);
        const userRef = doc(db, 'users', driverId);
        await updateDoc(userRef, {
            location: {
                lat: lat,
                lng: lng,
                geohash: hash
            },
            isOnline: true,
            lastLocationUpdate: new Date()
        });
    } catch (error) {
        console.error("Error updating driver location:", error);
    }
};

export const getAvailableDeliveries = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), where("status", "==", "SEARCHING_DRIVER"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting available deliveries:", error);
        return [];
    }
};

export const getMyDeliveries = async (driverId) => {
    try {
        const q = query(collection(db, COLLECTION_NAME), where("driverId", "==", driverId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting my deliveries:", error);
        return [];
    }
};

export const acceptDelivery = async (deliveryId, driverId) => {
    const deliveryRef = doc(db, COLLECTION_NAME, deliveryId);

    try {
        await runTransaction(db, async (transaction) => {
            const deliveryDoc = await transaction.get(deliveryRef);
            if (!deliveryDoc.exists()) {
                throw new Error("Delivery does not exist!");
            }

            const data = deliveryDoc.data();

            // THE CHECK: Is it already taken?
            if (data.status !== "SEARCHING_DRIVER") {
                throw new Error("Too late! Another driver accepted it.");
            }

            // THE LOCK: If free, assign it to me.
            transaction.update(deliveryRef, {
                status: "ASSIGNED",
                driverId: driverId,
                driverAssignedAt: new Date()
            });
        });
    } catch (error) {
        console.error("Transaction failed: ", error);
        throw error;
    }
};

export const updateDeliveryStatus = async (deliveryId, status) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, deliveryId);
        await updateDoc(docRef, { status });
    } catch (error) {
        console.error("Error updating delivery status:", error);
        throw error;
    }
};

export const subscribeToAvailableDeliveries = (callback) => {
    const q = query(collection(db, COLLECTION_NAME), where("status", "==", "SEARCHING_DRIVER"));
    // Return unsubscribe function
    return onSnapshot(q, (snapshot) => {
        const deliveries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(deliveries);
    });
};

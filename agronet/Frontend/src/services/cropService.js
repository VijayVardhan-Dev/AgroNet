import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy, doc, getDoc, deleteDoc } from "firebase/firestore";

const COLLECTION_NAME = "crops";

export const addCrop = async (cropData, userProfile) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...cropData,
            farmerId: userProfile.uid,
            farmerName: userProfile.fullName,
            farmerLocation: userProfile.location?.address || "Unknown Location",
            farmerRating: userProfile.rating || 0,
            status: "active",
            createdAt: new Date()
        });
        return { id: docRef.id, ...cropData };
    } catch (error) {
        console.error("Error adding crop:", error);
        throw error;
    }
};

export const getCrops = async (category = null) => {
    try {
        let q = query(collection(db, COLLECTION_NAME), where("status", "==", "active"));

        if (category) {
            q = query(q, where("category", "==", category));
        }

        // Sorting might require composite index, safe to omit for now or try
        // q = query(q, orderBy("createdAt", "desc")); 

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting crops:", error);
        return [];
    }
};

export const getCropById = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting crop:", error);
        throw error;
    }
};

export const getFarmerCrops = async (farmerId) => {
    try {
        const q = query(collection(db, COLLECTION_NAME), where("farmerId", "==", farmerId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting farmer crops:", error);
        return [];
    }
};

export const deleteCrop = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting crop:", error);
        throw error;
    }
};

import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc, deleteDoc } from "firebase/firestore";

const COLLECTION_NAME = "equipment";

export const addEquipment = async (equipData, userProfile) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...equipData,
            ownerId: userProfile.uid,
            ownerName: userProfile.fullName,
            location: userProfile.location || { lat: 0, lng: 0 },
            isAvailable: true,
            createdAt: new Date()
        });
        return { id: docRef.id, ...equipData };
    } catch (error) {
        console.error("Error adding equipment:", error);
        throw error;
    }
};

export const getEquipment = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), where("isAvailable", "==", true));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting equipment:", error);
        return [];
    }
};

export const getEquipmentById = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting equipment:", error);
        throw error;
    }
};

export const getFarmerEquipment = async (ownerId) => {
    try {
        const q = query(collection(db, COLLECTION_NAME), where("ownerId", "==", ownerId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting farmer equipment:", error);
        return [];
    }
};

export const deleteEquipment = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting equipment:", error);
        throw error;
    }
};

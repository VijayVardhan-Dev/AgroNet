import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export const getUserProfile = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw error;
    }
};

export const createUserProfile = async (uid, userData) => {
    try {
        await setDoc(doc(db, "users", uid), {
            uid,
            ...userData,
            createdAt: new Date(),
            roles: {
                isFarmer: false,
                isBuyer: true, // Default role
                isDriver: false,
                isAdmin: false,
                ...userData.roles
            }
        });
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
};

export const updateUserProfile = async (uid, data) => {
    try {
        await updateDoc(doc(db, "users", uid), data);
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

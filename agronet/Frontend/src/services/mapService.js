import { db } from "../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getResources = async () => {
    try {
        const q = query(collection(db, "resources"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting resources:", error);
        return [];
    }
};

export const getFarmersLocations = async () => {
    try {
        const q = query(collection(db, "users"), where("roles.isFarmer", "==", true));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            if (data.location?.lat && data.location?.lng) {
                return {
                    id: doc.id,
                    lat: data.location.lat,
                    lng: data.location.lng,
                    name: data.fullName,
                    type: "FARMER"
                };
            }
            return null;
        }).filter(item => item !== null);
    } catch (error) {
        console.error("Error getting farmer locations:", error);
        return [];
    }
};

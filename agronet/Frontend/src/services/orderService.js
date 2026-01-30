import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc } from "firebase/firestore";

const COLLECTION_NAME = "orders";

export const createOrder = async (orderData) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...orderData,
            status: "PENDING",
            createdAt: new Date(),
            paymentStatus: "PENDING"
        });
        return { id: docRef.id, ...orderData };
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

export const getUserOrders = async (uid, role = "buyer") => {
    try {
        // role can be 'buyerId' or 'sellerId'
        const fieldName = role === "seller" ? "sellerId" : "buyerId";
        const q = query(collection(db, COLLECTION_NAME), where(fieldName, "==", uid));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting user orders:", error);
        return [];
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const orderRef = doc(db, COLLECTION_NAME, orderId);
        await updateDoc(orderRef, { status });
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};

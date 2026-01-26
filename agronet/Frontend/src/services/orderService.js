// Mock Order Service

export const placeOrder = async (orderData) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ id: "ord_" + Date.now(), ...orderData }), 1000);
    });
};

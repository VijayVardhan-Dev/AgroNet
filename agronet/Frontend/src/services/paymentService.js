// This is a mock payment service.
// In a real app, you would integrate with Razorpay or another provider here.

export const initializePayment = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, transactionId: "txn_" + Date.now() });
        }, 1000);
    });
};

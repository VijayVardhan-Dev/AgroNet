import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders, updateOrderStatus } from '../services/orderService';

const Orders = () => {
    const { user, userProfile } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Determine if user is acting as seller or buyer. 
            // For simplicity, fetch as Buyer by default, or maybe merging both if they are both.
            // Let's just fetch as buyer for now, ideally we'd have tabs 'Buying' vs 'Selling'
            const buyerOrders = await getUserOrders(user.uid, "buyer");

            // If user is a farmer, also fetch sales
            let sellerOrders = [];
            if (userProfile?.roles?.isFarmer) {
                sellerOrders = await getUserOrders(user.uid, "seller");
            }

            // Merge and sort
            const allOrders = [...buyerOrders, ...sellerOrders].sort((a, b) => b.createdAt - a.createdAt);

            // Remove duplicates if any (unlikely unless self-trading)
            const uniqueOrders = Array.from(new Set(allOrders.map(a => a.id)))
                .map(id => allOrders.find(a => a.id === id));

            setOrders(uniqueOrders);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        await updateOrderStatus(orderId, newStatus);
        fetchOrders();
    };

    if (loading) return <div className="p-4">Loading orders...</div>;

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">My Orders & Sales</h1>

            {orders.length === 0 ? (
                <p className="text-gray-500">No orders found.</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border space-y-2">
                        <div className="flex justify-between">
                            <h3 className="font-bold">{order.itemName}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm">Qty: {order.quantity} | Total: ₹{order.totalAmount}</p>
                        <p className="text-xs text-gray-500">
                            {order.sellerId === user.uid ? `Sold to: ${order.buyerId}` : `Bought from: ${order.sellerId}`}
                        </p>
                        <p className="text-xs text-gray-500">Order ID: {order.id}</p>

                        {/* Seller Actions */}
                        {order.sellerId === user.uid && order.status === 'PENDING' && (
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Confirm Order</button>
                            </div>
                        )}
                        {order.sellerId === user.uid && order.status === 'CONFIRMED' && (
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => handleStatusUpdate(order.id, 'SHIPPED')} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Mark Shipped</button>
                            </div>
                        )}
                        {/* Buyer Actions */}
                        {order.buyerId === user.uid && order.status === 'SHIPPED' && (
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => handleStatusUpdate(order.id, 'COMPLETED')} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Confirm Received</button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;

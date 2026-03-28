import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders, updateOrderStatus } from '../services/orderService';
import { getDeliveryByOrderId } from '../services/deliveryService';
import { Package } from 'lucide-react';

const Orders = () => {
    const { user, userProfile } = useAuth();
    const [orders, setOrders] = useState([]);
    const [deliveries, setDeliveries] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const buyerOrders = await getUserOrders(user.uid, "buyer");
            
            let sellerOrders = [];
            if (userProfile?.roles?.isFarmer) {
                sellerOrders = await getUserOrders(user.uid, "seller");
            }

            const allOrders = [...buyerOrders, ...sellerOrders].sort((a, b) => b.createdAt - a.createdAt);
            const uniqueOrders = Array.from(new Set(allOrders.map(a => a.id)))
                .map(id => allOrders.find(a => a.id === id));

            setOrders(uniqueOrders);

            const delivMap = {};
            for (const order of uniqueOrders) {
                if (order.buyerId === user.uid) {
                    const tracking = await getDeliveryByOrderId(order.id);
                    if (tracking) {
                        delivMap[order.id] = tracking;
                    }
                }
            }
            setDeliveries(delivMap);

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

    const TrackingBox = ({ delivery }) => {
        if (!delivery) return null;

        const getStatusStep = (status) => {
            switch (status) {
                case 'SEARCHING_DRIVER': return 0;
                case 'ASSIGNED': return 1;
                case 'PICKED_UP': return 2;
                case 'DELIVERED': return 3;
                default: return 0;
            }
        };

        const step = getStatusStep(delivery.status);

        return (
            <div className="mt-8 border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Delivery Status</h4>
                    {delivery.otp && delivery.status !== 'DELIVERED' && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OTP</span>
                            <span className="font-mono text-sm tracking-[0.2em] font-black">{delivery.otp}</span>
                        </div>
                    )}
                </div>
                
                <div className="relative">
                    {/* Background Line */}
                    <div className="absolute top-2 left-[5%] right-[5%] h-[1px] bg-gray-200"></div>
                    
                    {/* Active Line */}
                    <div 
                        className="absolute top-2 left-[5%] h-[1px] bg-green-500 transition-all duration-700 ease-in-out" 
                        style={{ width: `${(step / 3) * 90}%` }}
                    ></div>
                    
                    <div className="relative z-10 flex justify-between px-2">
                        {['Searching', 'Assigned', 'In Transit', 'Delivered'].map((label, index) => (
                            <div key={label} className="flex flex-col items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 transition-colors duration-500 bg-white
                                    ${step >= index ? 'border-green-500' : 'border-gray-200'}
                                    ${step === index ? 'shadow-[0_0_0_4px_rgba(74,222,128,0.2)]' : ''}
                                `}>
                                    {step > index && <div className="w-full h-full bg-green-500 rounded-full scale-[0.4]"></div>}
                                    {step === index && <div className="w-full h-full bg-green-500 rounded-full scale-[0.6]"></div>}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= index ? 'text-green-700' : 'text-gray-300'}`}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {delivery.driverId && delivery.status !== 'DELIVERED' && (
                    <div className="mt-8 text-center">
                        <p className="text-xs font-medium text-gray-500">Your driver is on the way.</p>
                    </div>
                )}
            </div>
        );
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-black border-r-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen text-black pb-32">
            {/* Minimal Header */}
            <div className="p-6 pt-10 px-8 border-b border-gray-100">
                <h1 className="text-4xl font-black tracking-tight text-green-700">Orders</h1>
            </div>

            <div className="px-8 py-10 w-full max-w-6xl">
                {orders.length === 0 ? (
                    <div className="py-20 text-center">
                        <Package className="w-8 h-8 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-medium text-sm">You have no orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6 flex flex-col items-start">
                        {orders.map(order => (
                            <div key={order.id} className="w-full max-w-lg bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] transition-all">
                                
                                {/* Order Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
                                            {order.sellerId === user.uid ? 'Sale' : 'Purchase'} · {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
                                        </p>
                                        <h3 className="text-2xl font-bold tracking-tight">{order.itemName}</h3>
                                        <p className="text-sm font-medium text-gray-500 mt-1">
                                            {order.quantity} Units
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Total</p>
                                        <p className="text-2xl font-light tracking-tighter">₹{order.totalAmount}</p>
                                    </div>
                                </div>

                                {/* Minimal Status Indicator for generic orders without tracking */}
                                {!deliveries[order.id] && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                                        <div className={`w-2 h-2 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-600' : 'bg-green-400'}`}></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-green-700">
                                            {order.status}
                                        </span>
                                    </div>
                                )}

                                {/* Tracking View for Buyer */}
                                {order.buyerId === user.uid && deliveries[order.id] && (
                                    <TrackingBox delivery={deliveries[order.id]} />
                                )}

                                {/* Action Buttons - Dark Apple Theme */}
                                <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                                    {order.sellerId === user.uid && order.status === 'PENDING' && (
                                        <button onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')} className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide hover:bg-green-700 transition-colors w-full sm:w-auto">
                                            Confirm Order
                                        </button>
                                    )}
                                    {order.sellerId === user.uid && order.status === 'CONFIRMED' && (
                                        <button onClick={() => handleStatusUpdate(order.id, 'SHIPPED')} className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide hover:bg-green-700 transition-colors w-full sm:w-auto">
                                            Mark Shipped
                                        </button>
                                    )}
                                    
                                    {order.buyerId === user.uid && order.status === 'SHIPPED' && !deliveries[order.id] && (
                                        <button onClick={() => handleStatusUpdate(order.id, 'COMPLETED')} className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide hover:bg-green-700 transition-colors w-full sm:w-auto">
                                            Confirm Received
                                        </button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;

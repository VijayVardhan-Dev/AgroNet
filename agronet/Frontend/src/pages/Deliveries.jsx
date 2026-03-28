import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    subscribeToAvailableDeliveries, 
    getMyDeliveries, 
    updateDeliveryStatus,
    getDeliveryHistory
} from '../services/deliveryService';
import { MapPin, Navigation, Clock, RefreshCw, CheckCircle } from 'lucide-react';

const Deliveries = () => {
    const { user, userProfile } = useAuth();
    const navigate = useNavigate();
    
    const [available, setAvailable] = useState([]);
    const [myDeliveries, setMyDeliveries] = useState([]);
    const [history, setHistory] = useState([]);
    
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        let unsubscribe;

        if (userProfile?.roles?.isDriver) {
            fetchMyDeliveries();
            fetchHistory();

            unsubscribe = subscribeToAvailableDeliveries((deliveries) => {
                setAvailable(deliveries);
            });
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [userProfile]);

    const fetchMyDeliveries = async () => {
        const mine = await getMyDeliveries(user.uid);
        setMyDeliveries(mine);
    };

    const fetchHistory = async () => {
        const hist = await getDeliveryHistory(user.uid);
        setHistory(hist.sort((a,b) => b.deliveredAt - a.deliveredAt));
    };

    const handleRefreshAvailable = async () => {
        setIsRefreshing(true);
        await new Promise(r => setTimeout(r, 600)); 
        setIsRefreshing(false);
    };

    const handleUpdateStatus = async (id, status) => {
        await updateDeliveryStatus(id, status);
        fetchMyDeliveries();
    };

    if (!userProfile?.roles?.isDriver) {
        return <div className="p-8 text-center text-gray-500 font-mono text-sm uppercase tracking-widest">Unauthorized Access</div>;
    }

    return (
        <div className="bg-white min-h-screen text-black pb-32">
            {/* Minimal Header */}
            <div className="p-6 pt-10 border-b border-gray-100">
                <h1 className="text-4xl font-black tracking-tight mb-1 text-green-700">Driver Dashboard</h1>
                <p className="text-gray-400 font-medium">Hello, {userProfile?.fullName}</p>
            </div>

            <div className="px-6 py-6">
                {/* Clean Typography Tabs */}
                <div className="flex gap-6 border-b border-gray-200 mb-8">
                    <button 
                        onClick={() => setActiveTab('active')} 
                        className={`pb-3 text-sm font-semibold tracking-wide transition-colors ${activeTab === 'active' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Active Jobs
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')} 
                        className={`pb-3 text-sm font-semibold tracking-wide transition-colors ${activeTab === 'history' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        History
                    </button>
                </div>

                {activeTab === 'active' && (
                    <div className="space-y-12">
                        {/* Available Jobs */}
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Available Nearby</h2>
                                <button onClick={handleRefreshAvailable} className="text-gray-400 hover:text-black transition">
                                    <RefreshCw size={16} className={isRefreshing ? "animate-spin text-black" : ""} />
                                </button>
                            </div>

                            {available.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Clock className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                                    <p className="text-gray-400 font-medium text-sm">Searching for requests</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {available.map(d => (
                                        <div 
                                            key={d.id} 
                                            onClick={() => navigate(`/deliveries/${d.id}`)}
                                            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-all cursor-pointer flex justify-between items-center"
                                        >
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-black transition-colors">{d.buyerName}</h3>
                                                <p className="text-xs font-medium text-gray-400 mt-1 line-clamp-1 max-w-[200px]">{d.pickupLocation?.address.split(',')[0]} → {d.dropLocation?.address.split(',')[0]}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-xl tracking-tight">₹{d.fare}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1 flex items-center justify-end gap-1">
                                                    View <span className="text-black font-black">→</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* My Assigned Jobs */}
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">In Progress</h2>
                            {myDeliveries.length === 0 ? (
                                <p className="text-gray-400 text-sm italic">Nothing in progress.</p>
                            ) : (
                                <div className="space-y-4">
                                    {myDeliveries.map(d => (
                                        <div key={d.id} className="bg-gray-50 p-5 border border-gray-100 rounded-2xl relative overflow-hidden">
                                            {/* Status indicator line */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${d.status === 'ASSIGNED' ? 'bg-green-600' : 'bg-gray-300'}`}></div>

                                            <div className="flex justify-between items-start mb-6 pl-2">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{d.buyerName}</h3>
                                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
                                                        {d.status === 'ASSIGNED' ? 'Pending Pickup' : 'In Transit'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-xl">₹{d.fare}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-3 pl-2">
                                                <button
                                                    onClick={() => navigate(`/deliveries/${d.id}`)}
                                                    className="flex-1 bg-white border border-gray-200 text-black py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition"
                                                >
                                                    View Details
                                                </button>
                                                
                                                {d.status === 'ASSIGNED' && (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(d.id, 'PICKED_UP')} 
                                                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition"
                                                    >
                                                        Pick Up
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-4">
                        {history.length === 0 ? (
                            <div className="py-12 text-center">
                                <CheckCircle className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-400 font-medium text-sm">No completed deliveries.</p>
                            </div>
                        ) : (
                            history.map(d => (
                                <div key={d.id} className="py-4 border-b border-gray-100 flex justify-between items-center group cursor-default">
                                    <div>
                                        <p className="font-semibold text-gray-900">{d.buyerName}</p>
                                        <p className="text-xs font-mono text-gray-400 mt-1">{new Date(d.deliveredAt?.seconds * 1000).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-lg">₹{d.fare}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Deliveries;

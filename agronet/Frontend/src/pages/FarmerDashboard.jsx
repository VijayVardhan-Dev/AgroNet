import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFarmerCrops, deleteCrop, addCrop } from '../services/cropService';
import { getFarmerEquipment, deleteEquipment, addEquipment } from '../services/equipmentService';
import { getUserOrders, updateOrderStatus } from '../services/orderService';
import { Trash2, Plus, Package } from 'lucide-react';

const FarmerDashboard = () => {
    const { user, userProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('crops');
    const [myCrops, setMyCrops] = useState([]);
    const [myEquipment, setMyEquipment] = useState([]);
    const [sales, setSales] = useState([]);
    const [deliveries, setDeliveries] = useState([]); // This would ideally be fetched if we had logic for it related to sales

    // Form States
    const [showAddCrop, setShowAddCrop] = useState(false);
    const [showAddEquip, setShowAddEquip] = useState(false);

    useEffect(() => {
        if (userProfile?.roles?.isFarmer) {
            fetchData();
        }
    }, [userProfile, activeTab]);

    const fetchData = async () => {
        if (activeTab === 'crops') {
            const crops = await getFarmerCrops(user.uid);
            setMyCrops(crops);
        } else if (activeTab === 'equipment') {
            const equip = await getFarmerEquipment(user.uid);
            setMyEquipment(equip);
        } else if (activeTab === 'sales') {
            const mySales = await getUserOrders(user.uid, 'seller');
            setSales(mySales);
        }
    };

    const handleDeleteCrop = async (id) => {
        if (confirm("Are you sure you want to delete this crop?")) {
            await deleteCrop(id);
            fetchData();
        }
    };

    const handleDeleteEquipment = async (id) => {
        if (confirm("Are you sure you want to delete this equipment?")) {
            await deleteEquipment(id);
            fetchData();
        }
    };

    // --- Reuse Add Logic (Simplified for brevity, ideally components) ---
    const handleAddCropSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const cropData = {
            name: form.name.value,
            price: form.price.value,
            category: form.category.value,
            quantity: form.quantity.value,
            description: form.description.value,
            image: "https://placehold.co/300x200?text=Crop" // Placeholder
        };
        await addCrop(cropData, userProfile);
        setShowAddCrop(false);
        fetchData();
    };

    const handleAddEquipSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const equipData = {
            name: form.name.value,
            price: form.price.value, // per day
            category: form.category.value,
            description: form.description.value,
            image: "https://placehold.co/300x200?text=Tractor" // Placeholder
        };
        await addEquipment(equipData, userProfile);
        setShowAddEquip(false);
        fetchData();
    };

    if (!userProfile?.roles?.isFarmer) return <div className="p-8">Access Denied. Farmer role required.</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Farmer Dashboard</h1>

            <div className="flex gap-4 border-b border-gray-200">
                <button onClick={() => setActiveTab('crops')} className={`pb-2 px-1 ${activeTab === 'crops' ? 'border-b-2 border-green-600 font-bold text-green-700' : 'text-gray-500'}`}>My Crops</button>
                <button onClick={() => setActiveTab('equipment')} className={`pb-2 px-1 ${activeTab === 'equipment' ? 'border-b-2 border-green-600 font-bold text-green-700' : 'text-gray-500'}`}>My Equipment</button>
                <button onClick={() => setActiveTab('sales')} className={`pb-2 px-1 ${activeTab === 'sales' ? 'border-b-2 border-green-600 font-bold text-green-700' : 'text-gray-500'}`}>Sales History</button>
            </div>

            {/* CROPS TAB */}
            {activeTab === 'crops' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Listed Crops</h2>
                        <button onClick={() => setShowAddCrop(!showAddCrop)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            <Plus size={18} /> Add Crop
                        </button>
                    </div>

                    {showAddCrop && (
                        <div className="mb-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="font-bold mb-4">New Crop Listing</h3>
                            <form onSubmit={handleAddCropSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="name" placeholder="Crop Name" required className="p-2 border rounded" />
                                <input name="price" placeholder="Price (₹)" type="number" required className="p-2 border rounded" />
                                <select name="category" className="p-2 border rounded">
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Grains">Grains</option>
                                </select>
                                <input name="quantity" placeholder="Quantity Available" required className="p-2 border rounded" />
                                <textarea name="description" placeholder="Description" className="md:col-span-2 p-2 border rounded" rows="3"></textarea>
                                <button type="submit" className="md:col-span-2 bg-green-600 text-white p-2 rounded hover:bg-green-700 font-bold">List Crop</button>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myCrops.length === 0 && <p className="text-gray-500 col-span-full">No crops listed yet.</p>}
                        {myCrops.map(crop => (
                            <div key={crop.id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{crop.name}</h3>
                                    <p className="text-gray-600 text-sm">₹{crop.price} - {crop.quantity}</p>
                                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{crop.category}</span>
                                </div>
                                <button onClick={() => handleDeleteCrop(crop.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* EQUIPMENT TAB */}
            {activeTab === 'equipment' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">My Equipment</h2>
                        <button onClick={() => setShowAddEquip(!showAddEquip)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            <Plus size={18} /> List Equipment
                        </button>
                    </div>

                    {showAddEquip && (
                        <div className="mb-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="font-bold mb-4">New Equipment Listing</h3>
                            <form onSubmit={handleAddEquipSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="name" placeholder="Equipment Name" required className="p-2 border rounded" />
                                <input name="price" placeholder="Price per Day (₹)" type="number" required className="p-2 border rounded" />
                                <select name="category" className="p-2 border rounded">
                                    <option value="Tractor">Tractor</option>
                                    <option value="Harvester">Harvester</option>
                                    <option value="Tools">Tools</option>
                                </select>
                                <textarea name="description" placeholder="Description" className="md:col-span-2 p-2 border rounded" rows="3"></textarea>
                                <button type="submit" className="md:col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold">List Equipment</button>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myEquipment.length === 0 && <p className="text-gray-500 col-span-full">No equipment listed yet.</p>}
                        {myEquipment.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <p className="text-gray-600 text-sm">₹{item.price} / day</p>
                                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{item.category}</span>
                                </div>
                                <button onClick={() => handleDeleteEquipment(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SALES TAB */}
            {activeTab === 'sales' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Sales History</h2>
                    <div className="space-y-3">
                        {sales.length === 0 && <p className="text-gray-500">No sales yet.</p>}
                        {sales.map(sale => (
                            <div key={sale.id} className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{sale.itemName}</p>
                                    <p className="text-sm text-gray-500">Sold to: {sale.buyerId}</p>
                                    <p className="text-xs text-gray-400">{new Date(sale.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-700">₹{sale.totalAmount}</p>
                                    <span className={`text-xs px-2 py-1 rounded font-bold ${sale.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{sale.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default FarmerDashboard;

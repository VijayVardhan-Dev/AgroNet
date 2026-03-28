import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFarmerCrops, deleteCrop, addCrop } from '../services/cropService';
import { getFarmerEquipment, deleteEquipment, addEquipment } from '../services/equipmentService';
import { getUserOrders, updateOrderStatus } from '../services/orderService';
import { uploadImage } from '../services/uploadService';
import { Trash2, Plus, Package, Camera, Loader2 } from 'lucide-react';

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
    const [cropImageFile, setCropImageFile] = useState(null);
    const [cropImagePreview, setCropImagePreview] = useState(null);
    const [equipImageFile, setEquipImageFile] = useState(null);
    const [equipImagePreview, setEquipImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const cropFileRef = useRef(null);
    const equipFileRef = useRef(null);

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
        setUploading(true);

        let imageUrl = 'https://placehold.co/300x200?text=Crop';
        try {
            if (cropImageFile) {
                imageUrl = await uploadImage(cropImageFile);
            }
        } catch (err) {
            console.error('Image upload failed, using placeholder:', err);
        }

        const cropData = {
            name: form.name.value,
            price: form.price.value,
            category: form.category.value,
            quantity: form.quantity.value,
            description: form.description.value,
            image: imageUrl
        };
        await addCrop(cropData, userProfile);
        setShowAddCrop(false);
        setCropImageFile(null);
        setCropImagePreview(null);
        setUploading(false);
        fetchData();
    };

    const handleAddEquipSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        setUploading(true);

        let imageUrl = 'https://placehold.co/300x200?text=Equipment';
        try {
            if (equipImageFile) {
                imageUrl = await uploadImage(equipImageFile);
            }
        } catch (err) {
            console.error('Image upload failed, using placeholder:', err);
        }

        const equipData = {
            name: form.name.value,
            model: form.model.value,
            pricePerHour: Number(form.price.value),
            type: form.category.value,
            description: form.description.value,
            image: imageUrl
        };
        await addEquipment(equipData, userProfile);
        setShowAddEquip(false);
        setEquipImageFile(null);
        setEquipImagePreview(null);
        setUploading(false);
        fetchData();
    };

    const handleFileSelect = (file, setFile, setPreview) => {
        if (!file) return;
        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    if (!userProfile?.roles?.isFarmer) return <div className="p-8">Access Denied. Farmer role required.</div>;

    return (
        <div className="bg-white min-h-screen text-black pb-32">
            {/* Minimal Header */}
            <div className="p-6 pt-10 border-b border-gray-100 px-8">
                <h1 className="text-4xl font-black tracking-tight mb-1 text-green-700">Farmer Dashboard</h1>
                <p className="text-gray-400 font-medium">Hello, {userProfile?.fullName}</p>
            </div>

            <div className="px-8 py-6">
                {/* Clean Typography Tabs */}
                <div className="flex gap-6 border-b border-gray-200 mb-8">
                    <button onClick={() => setActiveTab('crops')} className={`pb-3 text-sm font-semibold tracking-wide transition-colors ${activeTab === 'crops' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-400 hover:text-gray-600'}`}>My Crops</button>
                    <button onClick={() => setActiveTab('equipment')} className={`pb-3 text-sm font-semibold tracking-wide transition-colors ${activeTab === 'equipment' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-400 hover:text-gray-600'}`}>My Equipment</button>
                    <button onClick={() => setActiveTab('sales')} className={`pb-3 text-sm font-semibold tracking-wide transition-colors ${activeTab === 'sales' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-400 hover:text-gray-600'}`}>Sales History</button>
                </div>

                {/* CROPS TAB */}
                {activeTab === 'crops' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Available Inventory</h2>
                            <button onClick={() => setShowAddCrop(!showAddCrop)} className="flex items-center gap-2 text-green-700 font-black text-sm hover:text-green-800 transition">
                                <Plus size={16} /> ADD CROP
                            </button>
                        </div>

                        {showAddCrop && (
                            <div className="mb-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">New Listing Details</h3>
                                <form onSubmit={handleAddCropSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Image Upload */}
                                    <div className="md:col-span-2">
                                        <input 
                                            ref={cropFileRef}
                                            type="file" 
                                            accept="image/*" 
                                            capture="environment"
                                            className="hidden" 
                                            onChange={(e) => handleFileSelect(e.target.files[0], setCropImageFile, setCropImagePreview)} 
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => cropFileRef.current?.click()}
                                            className="w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-600 transition-colors overflow-hidden"
                                        >
                                            {cropImagePreview ? (
                                                <img src={cropImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <Camera size={28} className="mb-2" />
                                                    <span className="text-sm font-medium">Tap to add photo</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <input name="name" placeholder="Crop Name" required className="p-3 bg-transparent border-b border-gray-200 focus:border-green-600 outline-none transition text-lg font-medium" />
                                    <input name="price" placeholder="Price (₹)" type="number" required className="p-3 bg-transparent border-b border-gray-200 focus:border-green-600 outline-none transition text-lg font-medium" />
                                    <select name="category" className="p-3 bg-transparent border-b border-gray-200 focus:border-green-600 outline-none transition text-lg font-medium text-gray-500">
                                        <option value="Vegetables">Vegetables</option>
                                        <option value="Fruits">Fruits</option>
                                        <option value="Grains">Grains</option>
                                    </select>
                                    <input name="quantity" placeholder="Quantity Available" required className="p-3 bg-transparent border-b border-gray-200 focus:border-green-600 outline-none transition text-lg font-medium" />
                                    <textarea name="description" placeholder="Description" className="md:col-span-2 p-3 bg-transparent border-b border-gray-200 focus:border-green-600 outline-none transition text-lg font-medium" rows="2"></textarea>
                                    <button type="submit" disabled={uploading} className="md:col-span-2 bg-green-600 text-white p-4 rounded-full hover:bg-green-700 tracking-wide mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
                                        {uploading ? <><Loader2 size={18} className="animate-spin" /> Uploading...</> : 'Publish Crop'}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {myCrops.length === 0 && <p className="text-gray-400 text-sm italic col-span-full">No crops in your inventory.</p>}
                            {myCrops.map(crop => (
                                <div key={crop.id} className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all flex flex-col justify-between">
                                    {crop.image && !crop.image.includes('placehold.co') && (
                                        <div className="aspect-[5/3] rounded-2xl overflow-hidden mb-4 bg-gray-50 -mx-2 -mt-2">
                                            <img src={crop.image} alt={crop.name} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className=" text-2xl tracking-tight text-gray-900 mb-1">{crop.name}</h3>
                                            <span className="text-[10px] uppercase tracking-widest text-green-700 bg-green-50 px-2 py-1 rounded inline-block">{crop.category}</span>
                                        </div>
                                        <button onClick={() => handleDeleteCrop(crop.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 mt-auto">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Stock</p>
                                                <p className="font-medium text-gray-800">{crop.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Price</p>
                                                <p className="font-black text-1.6xl tracking-tight">₹{crop.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* EQUIPMENT TAB */}
                {activeTab === 'equipment' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Listed Machinery</h2>
                            <button onClick={() => setShowAddEquip(!showAddEquip)} className="flex items-center gap-2 text-green-700 font-black text-sm hover:text-green-800 transition">
                                <Plus size={16} /> ADD EQUIPMENT
                            </button>
                        </div>

                        {showAddEquip && (
                            <div className="mb-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
                                <h3 className="text-xs  uppercase tracking-widest text-gray-400 mb-6">New Equipment Outline</h3>
                                <form onSubmit={handleAddEquipSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Image Upload */}
                                    <div className="md:col-span-2">
                                        <input 
                                            ref={equipFileRef}
                                            type="file" 
                                            accept="image/*" 
                                            capture="environment"
                                            className="hidden" 
                                            onChange={(e) => handleFileSelect(e.target.files[0], setEquipImageFile, setEquipImagePreview)} 
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => equipFileRef.current?.click()}
                                            className="w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-600 transition-colors overflow-hidden"
                                        >
                                            {equipImagePreview ? (
                                                <img src={equipImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <Camera size={28} className="mb-2" />
                                                    <span className="text-sm font-medium">Tap to add photo</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <input name="name" placeholder="Equipment Name" required className="p-3 bg-transparent border-b border-gray-200 focus:border-green-600 outline-none transition text-lg font-medium" />
                                    <input name="model" placeholder="Model (e.g. Mahindra 265 DI)" required className="p-3 bg-transparent border-b border-gray-200 focus:border-green-600 outline-none transition text-lg font-medium" />
                                    <input name="price" placeholder="Price per Hour (₹)" type="number" required className="p-3 bg-transparent border-b border-gray-200 focus:border-green-600 outline-none transition text-lg font-medium" />
                                    <select name="category" className="p-3 bg-transparent border-b border-gray-200 focus:border-green-600 outline-none transition text-lg font-medium text-gray-500">
                                        <option value="Tractor">Tractor</option>
                                        <option value="Harvester">Harvester</option>
                                        <option value="Sprayer">Sprayer</option>
                                        <option value="Drone">Drone</option>
                                        <option value="Tools">Tools</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <textarea name="description" placeholder="Description" className="md:col-span-2 p-3 bg-transparent border-b border-gray-200 focus:border-green-600 outline-none transition text-lg font-medium" rows="2"></textarea>
                                    <button type="submit" disabled={uploading} className="md:col-span-2 bg-green-600 text-white p-4 rounded-full hover:bg-green-700 font-bold tracking-wide mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
                                        {uploading ? <><Loader2 size={18} className="animate-spin" /> Uploading...</> : 'Publish Equipment'}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {myEquipment.length === 0 && <p className="text-gray-400 text-sm italic col-span-full">No active rentals listed.</p>}
                            {myEquipment.map(item => (
                                <div key={item.id} className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all flex flex-col justify-between">
                                    {item.image && item.image !== 'https://placehold.co/300x200?text=Tractor' && item.image !== 'https://placehold.co/300x200?text=Equipment' && (
                                        <div className="aspect-[5/3] rounded-2xl overflow-hidden mb-4 bg-gray-50">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl tracking-tight text-gray-900 mb-1">{item.name}</h3>
                                            <p className="text-gray-400 font-medium text-sm mb-2">{item.model || 'N/A'}</p>
                                            <span className="text-[10px] uppercase tracking-widest text-green-700 bg-green-50 px-2 py-1 rounded inline-block">{item.type}</span>
                                        </div>
                                        <button onClick={() => handleDeleteEquipment(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 mt-auto text-right">
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Hourly Rate</p>
                                        <p className="font-black text-xl tracking-tight">₹{item.pricePerHour} <span className="text-sm font-medium text-gray-400">/hr</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SALES TAB */}
                {activeTab === 'sales' && (
                    <div className="space-y-6 max-w-2xl">
                        <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Sales Ledger</h2>
                        {sales.length === 0 && <p className="text-gray-400 text-sm italic">No verified sales histories yet.</p>}
                        {sales.map(sale => (
                            <div key={sale.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex justify-between items-center group cursor-default">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-black transition-colors">{sale.itemName}</h3>
                                    <p className="text-xs font-medium text-gray-400 mt-1">Order #{sale.id.slice(-6).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-xl tracking-tight text-gray-900 mb-1">₹{sale.totalAmount}</p>
                                    <span className="text-[10px] uppercase tracking-widest text-green-700 bg-green-50 px-2 py-1 rounded inline-block">
                                        {sale.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default FarmerDashboard;

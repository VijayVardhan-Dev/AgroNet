import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    getDeliveryById, 
    acceptDelivery, 
    verifyDeliveryOtp 
} from '../services/deliveryService';
import { useUserLocation } from '../context/LocationContext';
import { ArrowLeft, MapPin, Navigation, Package } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const DeliveryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, userProfile } = useAuth();
    const { location } = useUserLocation();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [otpInput, setOtpInput] = useState('');
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        setLoading(true);
        try {
            const data = await getDeliveryById(id);
            if (!data) throw new Error("Delivery job not found");
            setJob(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        setProcessing(true);
        try {
            await acceptDelivery(id, user.uid);
            // Refresh details
            fetchJobDetails();
        } catch (error) {
            if (error.message.includes("already assigned")) {
                alert("Sorry, another driver already accepted this job.");
                navigate(-1);
            } else {
                alert("Failed to accept: " + error.message);
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpInput || otpInput.length < 6) return;
        setVerifyingOtp(true);
        try {
            await verifyDeliveryOtp(id, otpInput);
            navigate(-1); // Go back after success
        } catch (error) {
            alert(error.message || "Invalid OTP entered.");
        } finally {
            setVerifyingOtp(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-black border-r-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error || !job) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center text-gray-900">
            <h1 className="text-2xl font-bold mb-2">Unavailable</h1>
            <p className="text-gray-500 mb-8">{error || "Job details cannot be retrieved."}</p>
            <button onClick={() => navigate(-1)} className="text-black font-semibold uppercase tracking-widest text-sm hover:opacity-70">
                Go Back
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b flex items-center p-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition"
                >
                    <ArrowLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="ml-4 font-bold text-lg flex-1 text-green-700">Delivery Info</h1>
                <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    {job.orderId?.split('-')[1] || job.id.slice(-6)}
                </span>
            </header>

            {/* Map Area */}
            <div className="h-64 sm:h-80 w-full relative bg-gray-100 shrink-0">
                {job.pickupLocation && job.dropLocation && (
                    <MapContainer
                        bounds={[
                            [job.pickupLocation.lat, job.pickupLocation.lng],
                            [job.dropLocation.lat, job.dropLocation.lng]
                        ]}
                        boundsOptions={{ padding: [50, 50] }}
                        style={{ height: "100%", width: "100%", zIndex: 1 }}
                        zoomControl={false}
                    >
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                        <Marker position={[job.pickupLocation.lat, job.pickupLocation.lng]}></Marker>
                        <Marker position={[job.dropLocation.lat, job.dropLocation.lng]}></Marker>
                    </MapContainer>
                )}
            </div>

            {/* Content Body */}
            <main className="flex-1 overflow-y-auto px-6 py-8 pb-32 max-w-2xl mx-auto w-full space-y-10">
                
                {/* Intro Block */}
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Customer</p>
                        <h2 className="text-4xl font-black tracking-tight text-green-800">{job.buyerName}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Fare</p>
                        <h2 className="text-3xl font-light tracking-tighter text-gray-900">₹{job.fare}</h2>
                    </div>
                </div>

                {/* Locations list */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <MapPin size={16} className="text-gray-400" />
                            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Pickup</p>
                        </div>
                        <p className="text-base text-gray-900 leading-relaxed font-medium pl-7">
                            {job.pickupLocation?.address || "Location Unavailable"}
                        </p>
                    </div>

                    <div className="pl-7 h-8 border-l border-dashed border-gray-300 ml-[7px]"></div>

                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Navigation size={16} className="text-black" />
                            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-900">Dropoff</p>
                        </div>
                        <p className="text-base text-gray-900 leading-relaxed font-medium pl-7">
                            {job.dropLocation?.address || "Location Unavailable"}
                        </p>
                    </div>
                </div>

                {/* Items Block */}
                <div>
                    <h3 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4 border-b pb-2">Package Items</h3>
                    <div className="flex gap-4 items-start pt-2">
                        <Package size={20} className="text-gray-300 mt-0.5" />
                        <p className="text-lg font-medium text-gray-800 leading-snug">
                            {job.itemsSummary || "Standard Delivery Package"}
                        </p>
                    </div>
                </div>

                {/* Actions Block */}
                <div className="pt-6 border-t border-gray-100">
                    {job.status === 'SEARCHING_DRIVER' && (
                        <button
                            onClick={handleAccept}
                            disabled={processing}
                            className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold text-sm tracking-wide hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {processing ? "Accepting..." : "Accept Job"}
                        </button>
                    )}

                    {job.status === 'ASSIGNED' && (
                        <div className="bg-gray-50 py-3 px-4 border border-gray-100 rounded-lg inline-block">
                            <p className="font-semibold text-gray-800 tracking-tight text-sm">Job Accepted</p>
                            <p className="text-xs text-gray-500 mt-0.5">Please head to the pickup location and update status in Active Jobs.</p>
                        </div>
                    )}

                    {job.status === 'PICKED_UP' && (
                        <div className="space-y-4 max-w-sm">
                            <div className="pb-2">
                                <p className="text-sm font-semibold text-gray-800 mb-2">Verification Required</p>
                                <input 
                                    type="text" 
                                    maxLength="6"
                                    placeholder="••••••" 
                                    value={otpInput}
                                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                                    className="w-full text-3xl tracking-[0.3em] font-light bg-transparent py-2 border-b border-gray-200 outline-none focus:border-green-600 transition-colors"
                                />
                            </div>
                            <button
                                onClick={handleVerifyOtp}
                                disabled={verifyingOtp || otpInput.length < 6}
                                className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold text-sm tracking-wide hover:bg-green-700 disabled:bg-gray-300 transition-colors"
                            >
                                {verifyingOtp ? "Verifying..." : "Complete Delivery"}
                            </button>
                        </div>
                    )}

                    {job.status === 'DELIVERED' && (
                        <div className="inline-block bg-gray-100 text-gray-500 px-6 py-2 rounded-full font-semibold text-sm tracking-wide">
                            Delivery Completed
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default DeliveryDetails;

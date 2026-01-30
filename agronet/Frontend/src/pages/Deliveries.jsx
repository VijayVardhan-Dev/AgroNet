
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToAvailableDeliveries, getMyDeliveries, acceptDelivery, updateDeliveryStatus } from '../services/deliveryService';
import { MapPin, Navigation, Package, X } from 'lucide-react';
import { useUserLocation } from '../context/LocationContext';
import { distanceBetween } from 'geofire-common';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Fix Leaflet icon
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const Deliveries = () => {
    const { user, userProfile } = useAuth();
    const [available, setAvailable] = useState([]);
    const [myDeliveries, setMyDeliveries] = useState([]);
    const { location } = useUserLocation();
    const [selectedJob, setSelectedJob] = useState(null); // For Map Modal

    useEffect(() => {
        let unsubscribe;

        if (userProfile?.roles?.isDriver) {
            // Initial fetch of my deliveries
            fetchMyDeliveries();

            // Real-time subscription for available jobs
            unsubscribe = subscribeToAvailableDeliveries((deliveries) => {
                // Optional: Filter by location radius here if needed on frontend too
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

    const handleAccept = async (id) => {
        try {
            await acceptDelivery(id, user.uid);
            alert("Success! You got the job.");
            // Refresh my deliveries list
            fetchMyDeliveries();
            // Available list updates automatically via subscription
            setSelectedJob(null);
        } catch (error) {
            alert("Failed: " + error.message);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        await updateDeliveryStatus(id, status);
        fetchMyDeliveries();
    };

    const calculateDistance = (target) => {
        if (!location || !target) return "N/A";
        const distInKm = distanceBetween([location.lat, location.lng], [target.lat, target.lng]);
        return distInKm.toFixed(1) + " km";
    };

    if (!userProfile?.roles?.isDriver) {
        return <div className="p-4">You are not registered as a driver.</div>;
    }

    return (
        <div className="p-4 space-y-6 relative">
            <h1 className="text-2xl font-bold">Driver Dashboard</h1>

            {/* Active Deliveries Section */}
            <div>
                <h2 className="text-xl font-semibold mb-2">My Active Deliveries</h2>
                {/* ... (Existing My Deliveries UI kept simple for now) ... */}
                {myDeliveries.length === 0 ? <p className="text-gray-500">No active deliveries.</p> : (
                    <div className="space-y-4">
                        {myDeliveries.map(d => (
                            <div key={d.id} className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold">Delivery #{d.id.slice(0, 5)}</p>
                                        <p className="text-sm font-semibold text-green-700">Status: {d.status}</p>
                                        <div className="mt-2 text-sm">
                                            <p><span className="font-medium">Pick:</span> {d.pickupLocation?.address}</p>
                                            <p><span className="font-medium">Drop:</span> {d.dropLocation?.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {d.status === 'ASSIGNED' && <button onClick={() => handleUpdateStatus(d.id, 'PICKED_UP')} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Picked Up</button>}
                                        {d.status === 'PICKED_UP' && <button onClick={() => handleUpdateStatus(d.id, 'DELIVERED')} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Delivered</button>}
                                        <button onClick={() => setSelectedJob(d)} className="text-blue-600 text-xs underline">View Map</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Available Jobs Section */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Available Jobs</h2>
                {available.length === 0 ? <p className="text-gray-500">No jobs available nearby.</p> : (
                    <div className="space-y-4">
                        {available.map(d => (
                            <div key={d.id} className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">NEW REQUEST</span>
                                        <p className="font-bold mt-1 text-lg">Order #{d.orderId?.slice(-6) || '...'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">{calculateDistance(d.pickupLocation)} away</p>
                                        <p className="text-xs text-gray-500">to pickup</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                    <div className="flex gap-2">
                                        <MapPin size={16} className="text-green-600 shrink-0" />
                                        <div>
                                            <p className="font-bold text-gray-900">Pickup</p>
                                            <p>{d.pickupLocation?.address || "Unknown"}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Navigation size={16} className="text-blue-600 shrink-0" />
                                        <div>
                                            <p className="font-bold text-gray-900">Dropoff</p>
                                            <p>{d.dropLocation?.address || "Unknown"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => setSelectedJob(d)}
                                        className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50"
                                    >
                                        View Map
                                    </button>
                                    <button
                                        onClick={() => handleAccept(d.id)}
                                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 shadow-lg shadow-green-100"
                                    >
                                        Accept Job
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Map Modal */}
            {selectedJob && (
                <div className="fixed inset-0 z-1000 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg">Route Details</h3>
                            <button onClick={() => setSelectedJob(null)} className="p-1 hover:bg-gray-200 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="h-96 w-full relative">
                            {location && selectedJob.pickupLocation && (
                                <MapContainer
                                    bounds={[
                                        [location.lat, location.lng],
                                        [selectedJob.pickupLocation.lat, selectedJob.pickupLocation.lng],
                                        [selectedJob.dropLocation.lat, selectedJob.dropLocation.lng]
                                    ]}
                                    boundsOptions={{ padding: [50, 50] }}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />

                                    {/* Driver Location */}
                                    <Marker position={[location.lat, location.lng]}>
                                        <Popup>You (Driver)</Popup>
                                    </Marker>

                                    {/* Pickup Location */}
                                    <Marker position={[selectedJob.pickupLocation.lat, selectedJob.pickupLocation.lng]}>
                                        <Popup>Pickup: {selectedJob.pickupLocation.address}</Popup>
                                    </Marker>

                                    {/* Drop Location */}
                                    <Marker position={[selectedJob.dropLocation.lat, selectedJob.dropLocation.lng]}>
                                        <Popup>Drop: {selectedJob.dropLocation.address}</Popup>
                                    </Marker>
                                </MapContainer>
                            )}
                            {!location && <div className="flex items-center justify-center h-full text-gray-500">Location not available</div>}
                        </div>

                        <div className="p-4 bg-white border-t">
                            <div className="flex justify-between items-center mb-4 text-sm">
                                <div className="text-center flex-1">
                                    <p className="text-gray-500">Distance to Pickup</p>
                                    <p className="font-bold text-lg">{calculateDistance(selectedJob.pickupLocation)}</p>
                                </div>
                                <div className="text-center flex-1 border-l">
                                    <p className="text-gray-500">Total Trip</p>
                                    <p className="font-bold text-lg">
                                        {distanceBetween(
                                            [selectedJob.pickupLocation.lat, selectedJob.pickupLocation.lng],
                                            [selectedJob.dropLocation.lat, selectedJob.dropLocation.lng]
                                        ).toFixed(1)} km
                                    </p>
                                </div>
                            </div>
                            {selectedJob.status === 'SEARCHING_DRIVER' && (
                                <button
                                    onClick={() => handleAccept(selectedJob.id)}
                                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
                                >
                                    Accept & Start
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Deliveries;

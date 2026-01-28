import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { ArrowLeft, Search, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routing/routes';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map centering
const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
};

const Maps = () => {
    const [position, setPosition] = useState(null); // Default null until loaded
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Default fallback (e.g., Kakinada as seen in other screens)
                    setPosition({ lat: 16.9891, lng: 82.2475 });
                    setLoading(false);
                }
            );
        } else {
            // Fallback if geolocation not supported
            setPosition({ lat: 16.9891, lng: 82.2475 });
            setLoading(false);
        }
    }, []);

    return (
        <div className="relative h-[calc(100vh-64px)] md:h-full w-full bg-gray-100 flex flex-col">

            {/* Custom Mobile Header */}
            <div className="md:hidden absolute top-4 left-4 right-4 z-[9999] flex items-center justify-between pointer-events-none">
                <Link to={ROUTES.HOME} className="bg-white p-2.5 rounded-full shadow-md pointer-events-auto">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Link>
                <div className="bg-white rounded-full shadow-md px-4 py-2.5 flex items-center gap-2 pointer-events-auto flex-1 mx-3">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search location..."
                        className="bg-transparent text-sm w-full outline-none text-gray-700"
                    />
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-grow w-full h-full relative z-0">
                {!loading && position && (
                    <MapContainer
                        center={[position.lat, position.lng]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[position.lat, position.lng]}>
                            <Popup>
                                You are here
                            </Popup>
                        </Marker>
                        <RecenterAutomatically lat={position.lat} lng={position.lng} />
                    </MapContainer>
                )}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                    </div>
                )}
            </div>

            {/* Custom Bottom Bar for Maps (Mobile) */}
            <div className="md:hidden absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-[0_-5px_15px_rgba(0,0,0,0.1)] p-5 z-[9999]">
                <div className="flex justify-between items-center px-2">
                    <div className='flex flex-col gap-1'>
                        <h3 className="font-bold text-lg text-gray-800">Your Location</h3>
                        <p className="text-sm text-gray-500">Finding nearby resources...</p>
                    </div>
                    <button
                        className="bg-green-600 p-3 rounded-full shadow-lg text-white"
                        onClick={() => {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition((pos) => {
                                    setPosition({
                                        lat: pos.coords.latitude,
                                        lng: pos.coords.longitude
                                    });
                                });
                            }
                        }}
                    >
                        <Navigation className="w-6 h-6 fill-current" />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Maps;

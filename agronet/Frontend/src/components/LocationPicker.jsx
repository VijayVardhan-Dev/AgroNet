import { useState, useRef, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Fix Leaflet icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Delivery Location</Popup>
        </Marker>
    );
}

const LocationPicker = ({ initialPos, onLocationSelect }) => {
    const [position, setPosition] = useState(initialPos || null);

    useEffect(() => {
        if (initialPos) setPosition(initialPos);
    }, [initialPos]);

    const handleSetPosition = (pos) => {
        setPosition(pos);
        if (onLocationSelect) onLocationSelect(pos);
    };

    // Default center if no position (e.g. India center or just 0,0)
    const center = position || { lat: 20.5937, lng: 78.9629 };

    return (
        <div className="h-64 w-full rounded-xl overflow-hidden shadow-inner border border-gray-300">
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={handleSetPosition} />
            </MapContainer>
        </div>
    );
};

export default LocationPicker;

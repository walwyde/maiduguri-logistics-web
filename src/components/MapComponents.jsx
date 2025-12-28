// src/pages/book/MapComponent.jsx
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet default icon issue (only runs in browser)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function LocationClicker({ isSelecting, mode, onSelect }) {
  useMapEvents({
    click(e) {
      if (isSelecting) {
        onSelect({ lat: e.latlng.lat, lng: e.latlng.lng }, mode);
      }
    },
  });
  return null;
}

export default function MapComponent({
  pickupLocation,
  deliveryLocation,
  isSelectingLocation,
  locationMode,
  onLocationSelect,
}) {
  const maiduguri = [11.8469, 13.1571];

  return (
    <MapContainer
      center={maiduguri}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationClicker
        isSelecting={isSelectingLocation}
        mode={locationMode}
        onSelect={onLocationSelect}
      />

      {pickupLocation && (
        <Marker position={[pickupLocation.lat, pickupLocation.lng]}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {deliveryLocation && (
        <Marker position={[deliveryLocation.lat, deliveryLocation.lng]}>
          <Popup>Delivery Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
// src/components/BookingMap.client.jsx
"use client"; // ← THIS IS MANDATORY

import { useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet ONLY on client
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const useMapEvents = dynamic(
  () => import("react-leaflet").then((mod) => mod.useMapEvents),
  { ssr: false }
);

// Fix marker icons (runs only in browser)
if (typeof window !== "undefined") {
  const L = await import("leaflet");
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

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

export default function BookingMap({
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
        attribution='&copy; OpenStreetMap'
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
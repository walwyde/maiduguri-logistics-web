"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Map, Marker } from "pigeon-maps";
import {
  MapPin,
  Package,
  CreditCard,
  ArrowRight,
  Navigation,
  Phone,
  User,
  FileText,
  DollarSign,
  Search,
} from "lucide-react";
import useAuth from "../../utils/useAuth";
import Router from "next/router";

// Nominatim search (real addresses in Nigeria)
async function searchNominatim(query) {


  if (!query || query.length < 3) return [];
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&countrycodes=ng&addressdetails=1`,
    { headers: { "User-Agent": "MaidLogisticsApp/1.0 (+https://yourapp.com)" } }
  );
  return res.ok ? await res.json() : [];
}

// Reverse geocode (click on map → get real address)
async function reverseNominatim(lat, lng) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    { headers: { "User-Agent": "MaidLogisticsApp/1.0" } }
  );
  return res.ok ? await res.json() : null;
}

// Search box component
function LocationSearch({ placeholder, onSelect, mode }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }
      setLoading(true);
      const data = await searchNominatim(query);
      setResults(data);
      setLoading(false);
    }, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  const select = (item) => {
    onSelect({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      address: item.display_name,
    }, mode);
    setQuery(item.display_name.split(",")[0]);
    setOpen(false);
  };


  return (
    <div className="relative">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full h-12 pl-10 pr-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-colors duration-150"
        />
      </div>

      {open && (loading || results.length > 0) && (
        <ul className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-auto bg-white dark:bg-[#1E1E1E] border border-[#E7EAF1] dark:border-gray-600 rounded-xl shadow-lg">
          {loading && (
            <li className="p-4 text-center text-sm text-[#6B7280]">Searching…</li>
          )}
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => select(r)}
              className="p-3 hover:bg-[#F9FAFB] dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <p className="text-sm font-medium text-[#020814] dark:text-[#DEDEDE]">
                {r.display_name.split(",")[0]}
              </p>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                {r.display_name}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function BookingPage() {

const {user, loading, token} = useAuth();

  const queryClient = useQueryClient();

  const [pickupLocation, setPickupLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [selectingMode, setSelectingMode] = useState(null); // "pickup" or "delivery"

  const [formData, setFormData] = useState({
    pickupContactName: "",
    pickupContactPhone: "",
    deliveryContactName: "",
    deliveryContactPhone: "",
    packageDescription: "",
    packageWeight: "",
    packageDimensions: "",
    specialInstructions: "",
    paymentMethod: "cash",
  });

  const [pricing, setPricing] = useState({ distance: 0, totalPrice: 0 });

  const { data: pricingConfig } = useQuery({
    queryKey: ["pricing-config"],
    queryFn: async () => {
      const r = await fetch("/api/pricing", {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth-token")}` },
      });
      if (!r.ok) return { base_price_per_km: 50, minimum_fare: 300 };
      return r.json();
    },
  });

 const createBooking = useMutation({
  mutationFn: async (payload) => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create booking");
    }

    return res.json();
  },
  onSuccess: (data) => {
    window.location.href = `/bookings/${data.id}`;
  },
});


  // Calculate distance & price
  useEffect(() => {
    if (!pickupLocation || !deliveryLocation || !pricingConfig) return;

    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(deliveryLocation.lat - pickupLocation.lat);
    const dLon = toRad(deliveryLocation.lng - pickupLocation.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(pickupLocation.lat)) *
        Math.cos(toRad(deliveryLocation.lat)) *
        Math.sin(dLon / 2) ** 2;
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const base = pricingConfig.base_price_per_km || 50;
    const min = pricingConfig.minimum_fare || 300;
    const total = Math.max(distance * base, min);

    setPricing({ distance: Number(distance.toFixed(2)), totalPrice: total });
  }, [pickupLocation, deliveryLocation, pricingConfig]);

  // Handle map click (reverse geocode)
  const handleMapClick = async ({ latLng }) => {
    if (!selectingMode) return;
    const [lat, lng] = latLng;
    const rev = await reverseNominatim(lat, lng);
    const address = rev?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    const loc = { lat, lng, address };
    if (selectingMode === "pickup") setPickupLocation(loc);
    else setDeliveryLocation(loc);

    setSelectingMode(null);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pickupLocation || !deliveryLocation) {
      alert("Please select both pickup and delivery locations");
      return;
    }

    createBooking.mutate({
      pickupAddress: pickupLocation.address,
      pickupLat: pickupLocation.lat,
      pickupLng: pickupLocation.lng,
      deliveryAddress: deliveryLocation.address,
      deliveryLat: deliveryLocation.lat,
      deliveryLng: deliveryLocation.lng,
      ...formData,
      distanceKm: pricing.distance,
      totalPriceNaira: pricing.totalPrice,
    });
  };

  if(loading) return null;

  if(!loading && !user) return Router.replace("/account/signin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFDFF] to-[#F6F8FF] dark:from-[#121212] dark:to-[#0F0F0F] font-inter">
      {/* Header */}
      <div className="bg-white dark:bg-[#1E1E1E] border-b border-[#F1F3F8] dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F9FAFB] dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <ArrowRight size={20} className="text-[#6B7280] dark:text-[#9CA3AF] transform rotate-180" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
                  New Booking
                </h1>
                <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                  Book your package delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map + Search Section */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg border border-[#F1F3F8] dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#020814] dark:text-[#DEDEDE]">
                Select Locations
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectingMode("pickup")}
                  className={`px-4 py-2 rounded-lg text-sm flex items-center gap-1 ${
                    selectingMode === "pickup"
                      ? "bg-[#0066FF] text-white"
                      : "bg-[#F9FAFB] dark:bg-gray-700 text-[#6B7280] dark:text-[#9CA3AF]"
                  }`}
                >
                  <MapPin size={16} /> Pickup
                </button>
                <button
                  onClick={() => setSelectingMode("delivery")}
                  className={`px-4 py-2 rounded-lg text-sm flex items-center gap-1 ${
                    selectingMode === "delivery"
                      ? "bg-[#0066FF] text-white"
                      : "bg-[#F9FAFB] dark:bg-gray-700 text-[#6B7280] dark:text-[#9CA3AF]"
                  }`}
                >
                  <Navigation size={16} /> Delivery
                </button>
              </div>
            </div>

            {/* Search boxes */}
            <div className="space-y-4 mb-4">
              <LocationSearch
                placeholder="Search pickup (e.g. University of Maiduguri)"
                onSelect={(loc) => setPickupLocation(loc)}
                mode="pickup"
              />
              <LocationSearch
                placeholder="Search delivery (e.g. Maiduguri Central Market)"
                onSelect={(loc) => setDeliveryLocation(loc)}
                mode="delivery"
              />
            </div>

            {/* Interactive map */}
            <div className="relative h-96 rounded-xl overflow-hidden border border-[#E5EAF0] dark:border-gray-700">
              {selectingMode && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0066FF] text-white px-4 py-2 rounded-lg z-10 text-sm">
                  Click map to set {selectingMode} location
                </div>
              )}
              <Map
                center={
                  pickupLocation
                    ? [pickupLocation.lat, pickupLocation.lng]
                    : [11.8469, 13.1571]
                }
                zoom={13}
                onClick={handleMapClick}
              >
                {pickupLocation && (
                  <Marker
                    anchor={[pickupLocation.lat, pickupLocation.lng]}
                    color="#10B981"
                  />
                )}
                {deliveryLocation && (
                  <Marker
                    anchor={[deliveryLocation.lat, deliveryLocation.lng]}
                    color="#EF4444"
                  />
                )}
              </Map>
            </div>

            {/* Location Summary */}
            <div className="mt-6 space-y-4">
              <div
                className={`p-4 rounded-xl border-2 transition-colors duration-150 ${
                  pickupLocation
                    ? "border-[#E4F6E8] dark:border-[#1B4332] bg-[#E4F6E8] dark:bg-[#1B4332]"
                    : "border-[#F1F3F8] dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      pickupLocation
                        ? "bg-[#157347] dark:bg-[#52C41A] text-white"
                        : "bg-[#6B7280] dark:bg-[#9CA3AF] text-white"
                    }`}
                  >
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#020814] dark:text-[#DEDEDE]">
                      Pickup Location
                    </p>
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                      {pickupLocation?.address || "Not selected"}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border-2 transition-colors duration-150 ${
                  deliveryLocation
                    ? "border-[#E4F6E8] dark:border-[#1B4332] bg-[#E4F6E8] dark:bg-[#1B4332]"
                    : "border-[#F1F3F8] dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      deliveryLocation
                        ? "bg-[#157347] dark:bg-[#52C41A] text-white"
                        : "bg-[#6B7280] dark:bg-[#9CA3AF] text-white"
                    }`}
                  >
                    <Navigation size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#020814] dark:text-[#DEDEDE]">
                      Delivery Location
                    </p>
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                      {deliveryLocation?.address || "Not selected"}
                    </p>
                  </div>
                </div>
              </div>

              {pickupLocation && deliveryLocation && (
                <div className="p-4 bg-[#EDF1FF] dark:bg-[#1A2332] rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                        Distance
                      </p>
                      <p className="font-semibold text-[#020814] dark:text-[#DEDEDE]">
                        {pricing.distance} km
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                        Estimated Cost
                      </p>
                      <p className="font-bold text-[#0066FF] dark:text-[#4A90E2] text-lg">
                        ₦{pricing.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg border border-[#F1F3F8] dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-[#020814] dark:text-[#DEDEDE] mb-6">
              Booking Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-[#020814] dark:text-[#DEDEDE]">
                  Contact Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                      Pickup Contact Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <User size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                      </div>
                      <input
                        type="text"
                        value={formData.pickupContactName}
                        onChange={(e) => handleFormChange("pickupContactName", e.target.value)}
                        className="w-full h-12 pl-10 pr-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                        placeholder="Contact person name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                      Pickup Contact Phone
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Phone size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                      </div>
                      <input
                        type="tel"
                        value={formData.pickupContactPhone}
                        onChange={(e) => handleFormChange("pickupContactPhone", e.target.value)}
                        className="w-full h-12 pl-10 pr-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                        placeholder="+234 XXX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                      Delivery Contact Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <User size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                      </div>
                      <input
                        type="text"
                        value={formData.deliveryContactName}
                        onChange={(e) => handleFormChange("deliveryContactName", e.target.value)}
                        className="w-full h-12 pl-10 pr-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                        placeholder="Contact person name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                      Delivery Contact Phone
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Phone size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                      </div>
                      <input
                        type="tel"
                        value={formData.deliveryContactPhone}
                        onChange={(e) => handleFormChange("deliveryContactPhone", e.target.value)}
                        className="w-full h-12 pl-10 pr-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                        placeholder="+234 XXX XXX XXXX"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-[#020814] dark:text-[#DEDEDE]">
                  Package Information
                </h4>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                    Package Description *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-4">
                      <Package size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                    </div>
                    <textarea
                      required
                      value={formData.packageDescription}
                      onChange={(e) => handleFormChange("packageDescription", e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                      placeholder="What are you shipping? (e.g., Electronics, Furniture, Documents)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.packageWeight}
                      onChange={(e) => handleFormChange("packageWeight", e.target.value)}
                      className="w-full h-12 px-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                      placeholder="10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={formData.packageDimensions}
                      onChange={(e) => handleFormChange("packageDimensions", e.target.value)}
                      className="w-full h-12 px-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                      placeholder="L x W x H (cm)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                    Special Instructions
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-4">
                      <FileText size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                    </div>
                    <textarea
                      value={formData.specialInstructions}
                      onChange={(e) => handleFormChange("specialInstructions", e.target.value)}
                      rows={2}
                      className="w-full pl-10 pr-4 py-3 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                      placeholder="Any special handling instructions..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h4 className="font-medium text-[#020814] dark:text-[#DEDEDE]">
                  Payment Method
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleFormChange("paymentMethod", "cash")}
                    className={`p-4 rounded-xl border-2 transition-colors duration-150 ${
                      formData.paymentMethod === "cash"
                        ? "border-[#0066FF] dark:border-[#4A90E2] bg-[#0066FF]/5 dark:bg-[#4A90E2]/10"
                        : "border-[#E7EAF1] dark:border-gray-600 hover:border-[#0066FF]/30 dark:hover:border-[#4A90E2]/30"
                    }`}
                  >
                    <div className="text-center">
                      <DollarSign
                        size={24}
                        className={`mx-auto mb-2 ${formData.paymentMethod === "cash" ? "text-[#0066FF] dark:text-[#4A90E2]" : "text-[#6B7280] dark:text-[#9CA3AF]"}`}
                      />
                      <span
                        className={`font-medium text-sm ${formData.paymentMethod === "cash" ? "text-[#0066FF] dark:text-[#4A90E2]" : "text-[#111827] dark:text-[#DEDEDE]"}`}
                      >
                        Cash on Delivery
                      </span>
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                        Pay when delivered
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFormChange("paymentMethod", "bank_transfer")}
                    className={`p-4 rounded-xl border-2 transition-colors duration-150 ${
                      formData.paymentMethod === "bank_transfer"
                        ? "border-[#0066FF] dark:border-[#4A90E2] bg-[#0066FF]/5 dark:bg-[#4A90E2]/10"
                        : "border-[#E7EAF1] dark:border-gray-600 hover:border-[#0066FF]/30 dark:hover:border-[#4A90E2]/30"
                    }`}
                  >
                    <div className="text-center">
                      <CreditCard
                        size={24}
                        className={`mx-auto mb-2 ${formData.paymentMethod === "bank_transfer" ? "text-[#0066FF] dark:text-[#4A90E2]" : "text-[#6B7280] dark:text-[#9CA3AF]"}`}
                      />
                      <span
                        className={`font-medium text-sm ${formData.paymentMethod === "bank_transfer" ? "text-[#0066FF] dark:text-[#4A90E2]" : "text-[#111827] dark:text-[#DEDEDE]"}`}
                      >
                        Bank Transfer
                      </span>
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                        Pay before pickup
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-[#F1F3F8] dark:border-gray-700">
                <button
                  type="submit"
                  disabled={
                    !pickupLocation ||
                    !deliveryLocation ||
                    !formData.packageDescription ||
                    createBooking.isPending
                  }
                  className="w-full h-12 bg-[#0066FF] dark:bg-[#4A90E2] text-white font-semibold text-sm rounded-xl hover:bg-[#0052E6] dark:hover:bg-[#3A7BC8] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  {createBooking.isPending ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Booking...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>
                        Book Delivery - ₦{pricing.totalPrice.toLocaleString()}
                      </span>
                      <ArrowRight size={16} />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

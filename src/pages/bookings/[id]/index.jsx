'use client';

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin, Package, Navigation, Phone, User, Clock,
  CheckCircle, XCircle, ArrowRight, Truck, Star,
  AlertCircle, FileText,
} from "lucide-react";

import { Map, Overlay } from "pigeon-maps";
import { useParams } from "next/navigation";
import { osm } from "pigeon-maps/providers";


export function BookingDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const bookingId = params?.id;

  const [route, setRoute] = useState([]);

  // Fetch booking
  const { data: booking, isLoading: bookingLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch booking");
      return response.json();
    },
    enabled: !!bookingId,
  });

  // Fetch profile
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      });
      if (!res.ok) return null;
      return res.json();
    },
  });

  const userRole = profile?.user?.role || "customer";
  const isRider = userRole === "rider";
  const isCustomer = userRole === "customer";

  // Coordinates
  const pickup = booking ? [Number(booking.pickup_lat), Number(booking.pickup_lng)] : null;
  const delivery = booking ? [Number(booking.delivery_lat), Number(booking.delivery_lng)] : null;
  const center = pickup && delivery
    ? [(pickup[0] + delivery[0]) / 2, (pickup[1] + delivery[1]) / 2]
    : pickup || delivery || [6.5244, 3.3792];

  // Fetch real driving route
  useEffect(() => {
    if (!pickup || !delivery) return;
    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${delivery[1]},${delivery[0]}?overview=full&geometries=geojson`
        );
        const data = await res.json();
        if (data.routes?.[0]) {
          const path = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setRoute(path);
        } else {
          setRoute([pickup, delivery]);
        }
      } catch (err) {
        console.error("Route failed:", err);
        setRoute([pickup, delivery]);
      }
    };
    fetchRoute();
  }, [pickup, delivery]);

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: async ({ status }) => {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["recent-bookings"] });
    },
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/bookings/${bookingId}/payment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      });
      if (!res.ok) throw new Error("Payment confirm failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["booking", bookingId] }),
  });

  // Loading & Error
  if (bookingLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!booking) return <div className="min-h-screen flex items-center justify-center text-center"><AlertCircle size={64} className="text-red-500 mx-auto mb-4" /><h2>Booking Not Found</h2></div>;

  const getStatusColor = (status) => {
    const map = {
      delivered: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      in_transit: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      accepted: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      pending: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
      cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
      rejected: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  const canAccept = isRider && booking.status === "pending";
  const canStartTransit = isRider && ["pending", "accepted"].includes(booking.status);
  const canComplete = isRider && booking.status === "in_transit";
  const canConfirmPayment = isRider && booking.status === "delivered" && booking.payment_method === "cash" && !booking.payment_confirmed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFDFF] to-[#F6F8FF] dark:from-[#121212] dark:to-[#0F0F0F]">
      {/* Header */}
      <div className="bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => window.history.back()} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowRight size={20} className="rotate-180 text-gray-500" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{booking.booking_number}</h1>
              <p className="text-sm text-gray-500">Booking Details</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl ${getStatusColor(booking.status)} font-medium capitalize`}>
            {booking.status.replace("_", " ")}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Map + Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Map */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Route Map</h3>
                {route.length > 2 && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                    Driving route ({route.length} points)
                  </span>
                )}
              </div>

              <div className="h-96 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative bg-gray-100">
                <Map
                  provider={osm}
                  center={center}
                  defaultZoom={12}
                  animate={true}
                  metaWheelZoom={true}
                >
                  {/* Pickup Marker */}
                  {pickup && (
                    <Overlay anchor={pickup} offset={[20, 40]}>
                      <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#10B981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          border: '4px solid white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}>
                          P
                        </div>
                      </div>
                    </Overlay>
                  )}
                  
                  {/* Delivery Marker */}
                  {delivery && (
                    <Overlay anchor={delivery} offset={[20, 40]}>
                      <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#3B82F6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          border: '4px solid white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}>
                          D
                        </div>
                      </div>
                    </Overlay>
                  )}
                </Map>
              </div>

              {/* Distance & Price Cards */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
                  <p className="text-xs text-gray-500">Distance</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {Number(booking.distance_km).toFixed(1)} km
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-center">
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ₦{Number(booking.total_price_naira).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Route Debug Info */}
              {pickup && delivery && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs space-y-1">
                  <div className="font-semibold">Debug Info:</div>
                  <div>Pickup: [{pickup[0].toFixed(4)}, {pickup[1].toFixed(4)}]</div>
                  <div>Delivery: [{delivery[0].toFixed(4)}, {delivery[1].toFixed(4)}]</div>
                  <div>Route points: {route.length}</div>
                </div>
              )}
            </div>

            {/* Locations */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg border p-6 space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center"><MapPin size={20} className="text-white" /></div>
                  <div>
                    <p className="font-semibold">Pickup</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{booking.pickup_address}</p>
                    {booking.pickup_contact_name && <p className="text-sm mt-1 flex items-center gap-2"><User size={14} /> {booking.pickup_contact_name}</p>}
                    {booking.pickup_contact_phone && <p className="text-sm flex items-center gap-2"><Phone size={14} /> {booking.pickup_contact_phone}</p>}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"><Navigation size={20} className="text-white" /></div>
                  <div>
                    <p className="font-semibold">Delivery</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{booking.delivery_address}</p>
                    {booking.delivery_contact_name && <p className="text-sm mt-1 flex items-center gap-2"><User size={14} /> {booking.delivery_contact_name}</p>}
                    {booking.delivery_contact_phone && <p className="text-sm flex items-center gap-2"><Phone size={14} /> {booking.delivery_contact_phone}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Package Info */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg border p-6">
              <h3 className="font-semibold mb-4">Package Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3"><Package size={18} className="text-gray-500" /><span>{booking.package_description || "No description"}</span></div>
                {booking.package_weight && <div className="flex items-center gap-3"><FileText size={18} className="text-gray-500" />{booking.package_weight} kg</div>}
                {booking.package_dimensions && <div className="flex items-center gap-3"><FileText size={18} className="text-gray-500" />{booking.package_dimensions}</div>}
                {booking.special_instructions && <div className="flex items-start gap-3 text-amber-600 dark:text-amber-400"><AlertCircle size={18} />{booking.special_instructions}</div>}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg border p-6">
              <h3 className="font-semibold mb-4">Timeline</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3"><CheckCircle size={18} className="text-green-600" />Created: {new Date(booking.created_at).toLocaleString()}</div>
                {booking.picked_up_at && <div className="flex gap-3"><Truck size={18} className="text-blue-600" />Picked up: {new Date(booking.picked_up_at).toLocaleString()}</div>}
                {booking.delivered_at && <div className="flex gap-3"><CheckCircle size={18} className="text-green-600" />Delivered: {new Date(booking.delivered_at).toLocaleString()}</div>}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg border p-6">
              <h3 className="font-semibold mb-3">Payment</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between"><span>Method</span><span className="font-medium capitalize">{booking.payment_method?.replace("_", " ")}</span></div>
                <div className="flex justify-between"><span>Status</span><span className={`px-2 py-1 rounded text-xs ${booking.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{booking.payment_status}</span></div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between text-lg font-bold text-blue-600 dark:text-blue-400">
                  <span>Total</span>
                  <span>₦{Number(booking.total_price_naira).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Rider Actions */}
            {isRider && (
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg border p-6 space-y-3">
                <h3 className="font-semibold">Rider Actions</h3>
                {canAccept && <button onClick={() => updateStatusMutation.mutate({ status: "accepted" })} className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Accept Booking</button>}
                {canStartTransit && <button onClick={() => updateStatusMutation.mutate({ status: "in_transit" })} className="w-full py-3 bg-amber-600 text-white rounded-xl">Start Transit</button>}
                {canComplete && <button onClick={() => updateStatusMutation.mutate({ status: "delivered" })} className="w-full py-3 bg-green-600 text-white rounded-xl">Mark Delivered</button>}
                {canConfirmPayment && <button onClick={() => confirmPaymentMutation.mutate()} className="w-full py-3 bg-green-600 text-white rounded-xl">Confirm Cash Payment</button>}
              </div>
            )}

            {/* Customer / Rider Info */}
            {isRider && booking.customer_name && (
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-4 border">
                <p className="font-medium mb-2">Customer</p>
                <p className="text-sm"><User size={14} className="inline mr-1" /> {booking.customer_name}</p>
                {booking.customer_phone && <p className="text-sm"><Phone size={14} className="inline mr-1" /> {booking.customer_phone}</p>}
              </div>
            )}

            {isCustomer && booking.rider_name && (
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-4 border">
                <p className="font-medium mb-2">Rider</p>
                <p className="text-sm"><User size={14} className="inline mr-1" /> {booking.rider_name}</p>
                {booking.rider_phone && <p className="text-sm"><Phone size={14} className="inline mr-1" /> {booking.rider_phone}</p>}
                {booking.rider_rating && <p className="text-sm"><Star size={14} className="inline text-amber-500" /> {Number(booking.rider_rating).toFixed(1)}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailPage;
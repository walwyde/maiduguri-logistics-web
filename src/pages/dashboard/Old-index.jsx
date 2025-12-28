// "use client";

// import { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   Truck,
//   Package,
//   Star,
//   TrendingUp,
//   MapPin,
//   Plus,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   DollarSign,
//   Users,
//   Settings,
// } from "lucide-react";
// import useAuth from "../../utils/useAuth";
// import { useRouter } from "next/navigation"; // ← Updated for App Router (or use next/router if still on pages/)

// export default function DashboardPage() {
//   const router = useRouter();
//   const { user, token, loading } = useAuth();
//   console.log("DashboardPage token:", token); 
//   const [selectedTimeRange] = useState("week");

//   // Redirect if not logged in
//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/account/signin");
//     }
//   }, [user, loading, router]);

//   // Fetch profile
//   const { data: profile, isLoading: profileLoading } = useQuery({
//     queryKey: ["profile"],
//     queryFn: async () => {
//       const res = await fetch("/api/profile", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch profile");
//       return res.json();
//     },
//     enabled: !!token,
//   });

//   // Fetch stats
//   const { data: stats, isLoading: statsLoading } = useQuery({
//     queryKey: ["dashboard-stats", selectedTimeRange],
//     queryFn: async () => {
//       const res = await fetch(`/api/dashboard/stats?range=${selectedTimeRange}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch stats");
//       return res.json();
//     },
//     enabled: !!token,
//   });

//   // Fetch recent bookings
//   const { data: recentBookings = [], isLoading: bookingsLoading } = useQuery({
//     queryKey: ["recent-bookings"],
//     queryFn: async () => {
//       const res = await fetch("/api/bookings?limit=5", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error("Failed to fetch bookings");
//       return res.json();
//     },
//     enabled: !!token,
//     staleTime: 30_000, // 30 seconds
//   });


//   const isLoading = loading || profileLoading || statsLoading || bookingsLoading;

//   // Redirect to onboarding if phone not set
//   useEffect(() => {
//     if (!profileLoading && profile?.user && !profile.user.phone) {
//       router.push("/onboarding");
//     }
//   }, [profile, profileLoading, router]);

//   if (isLoading || !user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#FCFDFF] to-[#F6F8FF] dark:from-[#121212] dark:to-[#0F0F0F] flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-10 h-10 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-[#6B7280] dark:text-[#9CA3AF]">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   const userRole = profile?.user?.role || "customer";
//   const userName = profile?.user?.name || user?.name || "User";

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "delivered": return "bg-[#E4F6E8] dark:bg-[#1B4332] text-[#157347] dark:text-[#52C41A]";
//       case "in_transit": return "bg-[#F6EED4] dark:bg-[#3D2914] text-[#B88710] dark:text-[#FADB14]";
//       case "pending": return "bg-[#EDF1FF] dark:bg-[#1A2332] text-[#0066FF] dark:text-[#4A90E2]";
//       default: return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#FCFDFF] to-[#F6F8FF] dark:from-[#121212] dark:to-[#0F0F0F] font-inter">
//       {/* Header */}
//       <div className="bg-white dark:bg-[#1E1E1E] border-b border-[#F1F3F8] dark:border-gray-700">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 bg-[#0066FF] dark:bg-[#4A90E2] rounded-xl flex items-center justify-center">
//                 <Truck size={24} className="text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
//                   Welcome back, {userName}!
//                 </h1>
//                 <p className="text-[#6B7280] dark:text-[#9CA3AF]">
//                   {userRole === "customer" ? "Ready to ship your packages?" : "Ready to make deliveries?"}
//                 </p>
//               </div>
//             </div>
//             <div className="mt-4 sm:mt-0 flex items-center space-x-3">
//               {userRole === "customer" && (
//                 <button
//                   onClick={() => router.push("/book")}
//                   className="flex items-center space-x-2 px-6 py-3 bg-[#0066FF] text-white font-semibold text-sm rounded-xl hover:bg-[#0052E6] transition-colors"
//                 >
//                   <Plus size={16} />
//                   <span>New Booking</span>
//                 </button>
//               )}
//               <button
//                 onClick={() => router.push("/account/logout")}
//                 className="p-3 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#DEDEDE] hover:bg-[#F9FAFB] dark:hover:bg-gray-700 rounded-xl transition-colors"
//               >
//                 <Settings size={20} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {userRole === "customer" ? (
//             <>
//               <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#F1F3F8] dark:border-gray-700">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="w-12 h-12 bg-[#EDF1FF] dark:bg-[#1A2332] rounded-xl flex items-center justify-center">
//                     <Package size={24} className="text-[#0066FF] dark:text-[#4A90E2]" />
//                   </div>
//                   <span className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
//                     {(stats?.totalBookings ?? 0).toLocaleString()}
//                   </span>
//                 </div>
//                 <h3 className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-medium">Total Shipments</h3>
//                 <p className="text-[#111827] dark:text-[#DEDEDE] text-xs mt-1">All time</p>
//               </div>

//               <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#F1F3F8] dark:border-gray-700">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="w-12 h-12 bg-[#E4F6E8] dark:bg-[#1B4332] rounded-xl flex items-center justify-center">
//                     <CheckCircle size={24} className="text-[#157347] dark:text-[#52C41A]" />
//                   </div>
//                   <span className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
//                     {(stats?.completedBookings ?? 0).toLocaleString()}
//                   </span>
//                 </div>
//                 <h3 className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-medium">Completed</h3>
//                 <p className="text-[#111827] dark:text-[#DEDEDE] text-xs mt-1">Successfully delivered</p>
//               </div>

//               <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#F1F3F8] dark:border-gray-700">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="w-12 h-12 bg-[#F6EED4] dark:bg-[#3D2914] rounded-xl flex items-center justify-center">
//                     <Clock size={24} className="text-[#B88710] dark:text-[#FADB14]" />
//                   </div>
//                   <span className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
//                     {(stats?.activeBookings ?? 0).toLocaleString()}
//                   </span>
//                 </div>
//                 <h3 className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-medium">Active</h3>
//                 <p className="text-[#111827] dark:text-[#DEDEDE] text-xs mt-1">In progress</p>
//               </div>

//               <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#F1F3F8] dark:border-gray-700">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="w-12 h-12 bg-[#FFF2E5] dark:bg-[#3D2914] rounded-xl flex items-center justify-center">
//                     <DollarSign size={24} className="text-[#F59E0B] dark:text-[#FADB14]" />
//                   </div>
//                   <span className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
//                     ₦{(stats?.totalSpent ?? 0).toLocaleString()}
//                   </span>
//                 </div>
//                 <h3 className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-medium">Total Spent</h3>
//                 <p className="text-[#111827] dark:text-[#DEDEDE] text-xs mt-1">All time</p>
//               </div>
//             </>
//           ) : (
//             <div className="col-span-4 text-center py-12 text-[#6B7280]">
//               Rider dashboard coming soon
//             </div>
//           )}
//         </div>

//         {/* Recent Bookings */}
//         <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#F1F3F8] dark:border-gray-700 p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-[#020814] dark:text-[#DEDEDE]">
//               Recent {userRole === "customer" ? "Shipments" : "Deliveries"}
//             </h3>
//             <button
//               onClick={() => router.push("/bookings")}
//               className="text-[#0066FF] dark:text-[#4A90E2] text-sm font-medium hover:underline"
//             >
//               View All →
//             </button>
//           </div>

//           {bookingsLoading ? (
//             <div className="text-center py-12">
//               <div className="w-8 h-8 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//               <p className="text-[#6B7280] dark:text-[#9CA3AF]">Loading bookings...</p>
//             </div>
//           ) : recentBookings.length > 0 ? (
//             <div className="space-y-4">
//               {recentBookings.map((booking) => (
//                 <div
//                   key={booking.id}
//                   onClick={() => router.push(`/bookings/${booking.booking_id}`)}
//                   className="flex items-center justify-between p-4 border border-[#F1F3F8] dark:border-gray-700 rounded-xl hover:bg-[#F9FAFB] dark:hover:bg-gray-800 transition-colors cursor-pointer"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className="w-12 h-12 bg-[#EDF1FF] dark:bg-[#1A2332] rounded-xl flex items-center justify-center">
//                       <Package size={20} className="text-[#0066FF] dark:text-[#4A90E2]" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-[#020814] dark:text-[#DEDEDE]">
//                         {booking.booking_number}
//                       </p>
//                       <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
//                         {new Date(booking.created_at).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
//                       {booking.status.replace("_", " ").toUpperCase()}
//                     </span>
//                     <p className="text-sm font-medium text-[#020814] dark:text-[#DEDEDE] mt-1">
//                       ₦{Number(booking.total_price_naira).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <Package size={48} className="mx-auto mb-4 text-[#6B7280] dark:text-[#9CA3AF] opacity-50" />
//               <p className="text-[#6B7280] dark:text-[#9CA3AF]">
//                 No {userRole === "customer" ? "shipments" : "deliveries"} yet
//               </p>
//               {userRole === "customer" && (
//                 <button
//                   onClick={() => router.push("/book")}
//                   className="mt-4 text-[#0066FF] hover:underline text-sm font-medium"
//                 >
//                   Create your first booking →
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Truck,
  Package,
  Star,
  MapPin,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Users,
  Settings,
} from "lucide-react";
import useAuth from "../../utils/useAuth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const selectedTimeRange = "week";

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/account/signin");
    }
  }, [user, authLoading, router]);

  // Fetch profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled: !!token,
  });

  // Fetch stats — uses your old correct backend logic
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats", selectedTimeRange],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/stats?range=${selectedTimeRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!token,
  });

  // Recent bookings
  const { data: recentBookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["recent-bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings?limit=5", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
    enabled: !!token,
  });

  const isLoading = authLoading || profileLoading || statsLoading || bookingsLoading;

  //Onboarding redirect
  useEffect(() => {
    if (profile && !profile.user?.phone) {
      router.push("/onboarding");
    }
  }, [profile, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FCFDFF] to-[#F6F8FF] dark:from-[#121212] dark:to-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const userRole = profile?.user?.role || "customer";
  const userName = profile?.user?.name || user?.name || "User";

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-[#E4F6E8] dark:bg-[#1B4332] text-[#157347] dark:text-[#52C41A]";
      case "in_transit": return "bg-[#F6EED4] dark:bg-[#3D2914] text-[#B88710] dark:text-[#FADB14]";
      case "pending":
      case "accepted": return "bg-[#EDF1FF] dark:bg-[#1A2332] text-[#0066FF] dark:text-[#4A90E2]";
      default: return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFDFF] to-[#F6F8FF] dark:from-[#121212] dark:to-[#0F0F0F] font-inter">
      {/* Header */}
      <div className="bg-white dark:bg-[#1E1E1E] border-b border-[#F1F3F8] dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#0066FF] dark:bg-[#4A90E2] rounded-xl flex items-center justify-center">
                <Truck size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
                  Welcome back, {userName}!
                </h1>
                <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                  {userRole === "customer" ? "Ready to ship your packages?" : "Ready to make deliveries?"}
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {userRole === "customer" && (
                <button
                  onClick={() => router.push("/book")}
                  className="flex items-center space-x-2 px-6 py-3 bg-[#0066FF] text-white font-semibold text-sm rounded-xl hover:bg-[#0052E6] transition-colors"
                >
                  <Plus size={16} />
                  <span>New Booking</span>
                </button>
              )}
              <button
                onClick={() => router.push("/account/logout")}
                className="p-3 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#DEDEDE] hover:bg-[#F9FAFB] dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards — Full support for both roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userRole === "customer" ? (
            <>
              {/* Customer Stats */}
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#F1F3F8] dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#EDF1FF] dark:bg-[#1A2332] rounded-xl flex items-center justify-center">
                    <Package size={24} className="text-[#0066FF] dark:text-[#4A90E2]" />
                  </div>
                  <span className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
                    {(stats?.totalBookings ?? 0).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-medium">Total Shipments</h3>
                <p className="text-[#111827] dark:text-[#DEDEDE] text-xs mt-1">All time</p>
              </div>

              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#F1F3F8] dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#E4F6E8] dark:bg-[#1B4332] rounded-xl flex items-center justify-center">
                    <CheckCircle size={24} className="text-[#157347] dark:text-[#52C41A]" />
                  </div>
                  <span className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
                    {(stats?.completedBookings ?? 0).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-medium">Completed</h3>
                <p className="text-[#111827] dark:text-[#DEDEDE] text-xs mt-1">Successfully delivered</p>
              </div>

              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#F1F3F8] dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#F6EED4] dark:bg-[#3D2914] rounded-xl flex items-center justify-center">
                    <Clock size={24} className="text-[#B88710] dark:text-[#FADB14]" />
                  </div>
                  <span className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
                    {(stats?.activeBookings ?? 0).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-medium">Active</h3>
                <p className="text-[#111827] dark:text-[#DEDEDE] text-xs mt-1">In progress</p>
              </div>

              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#F1F3F8] dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#FFF2E5] dark:bg-[#3D2914] rounded-xl flex items-center justify-center">
                    <DollarSign size={24} className="text-[#F59E0B] dark:text-[#FADB14]" />
                  </div>
                  <span className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
                    ₦{(stats?.totalSpent ?? 0).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-medium">Total Spent</h3>
                <p className="text-[#111827] dark:text-[#DEDEDE] text-xs mt-1">All time</p>
              </div>
            </>
          ) : (
            <>
              {/* Rider Stats — using old backend data */}
              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#F1F3F8] dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#EDF1FF] dark:bg-[#1A2332] rounded-xl flex items-center justify-center">
                    <Truck size={24} className="text-[#0066FF] dark:text-[#4A90E2]" />
                  </div>
                  <span className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
                    {profile?.user?.total_deliveries || 0}
                  </span>
                </div>
                <h3 className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-medium">Total Deliveries</h3>
                <p className="text-[#111827] dark:text-[#DEDEDE] text-xs mt-1">All time</p>
              </div>

              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#F1F3F8] dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#FEF3C7] dark:bg-[#3D2914] rounded-xl flex items-center justify-center">
                    <Star size={24} className="text-[#F59E0B] dark:text-[#FADB14]" />
                  </div>
                  <span className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
                    {profile?.user?.rating ? Number(profile.user.rating).toFixed(1) : "0.0"}
                  </span>
                </div>
                <h3 className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-medium">Rating</h3>
                <p className="text-[#111827] dark:text-[#DEDEDE] text-xs mt-1">Average score</p>
              </div>

              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#F1F3F8] dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#E4F6E8] dark:bg-[#1B4332] rounded-xl flex items-center justify-center">
                    <DollarSign size={24} className="text-[#157347] dark:text-[#52C41A]" />
                  </div>
                  <span className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
                    ₦{(stats?.totalEarnings ?? 0).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-medium">Total Earnings</h3>
                <p className="text-[#111827] dark:text-[#DEDEDE] text-xs mt-1">All time</p>
              </div>

              <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-[#F1F3F8] dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    profile?.user?.verification_status === "verified"
                      ? "bg-[#E4F6E8] dark:bg-[#1B4332]"
                      : "bg-[#FEF3C7] dark:bg-[#3D2914]"
                  }`}>
                    {profile?.user?.verification_status === "verified" ? (
                      <CheckCircle size={24} className="text-[#157347] dark:text-[#52C41A]" />
                    ) : (
                      <AlertCircle size={24} className="text-[#F59E0B] dark:text-[#FADB14]" />
                    )}
                  </div>
                  <span className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE]">
                    {profile?.user?.verification_status === "verified" ? "Verified" : "Pending"}
                  </span>
                </div>
                <h3 className="text-[#6B7280] dark:text-[#9CA3AF] text-sm font-medium">Verification</h3>
                <p className="text-[#111827] dark:text-[#DEDEDE] text-xs mt-1">Account status</p>
              </div>
            </>
          )}
        </div>

        {/* Recent Bookings + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#F1F3F8] dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#020814] dark:text-[#DEDEDE]">
                Recent {userRole === "customer" ? "Shipments" : "Deliveries"}
              </h3>
              <button
                onClick={() => router.push("/bookings")}
                className="text-[#0066FF] dark:text-[#4A90E2] text-sm font-medium hover:underline"
              >
                View All
              </button>
            </div>

            {bookingsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => router.push(`/bookings/${booking.booking_id || booking.id}`)}
                    className="flex items-center justify-between p-4 border border-[#F1F3F8] dark:border-gray-700 rounded-xl hover:bg-[#F9FAFB] dark:hover:bg-gray-800 transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#EDF1FF] dark:bg-[#1A2332] rounded-xl flex items-center justify-center">
                        <Package size={20} className="text-[#0066FF] dark:text-[#4A90E2]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#020814] dark:text-[#DEDEDE]">{booking.booking_number}</p>
                        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.replace("_", " ").toUpperCase()}
                      </span>
                      <p className="text-sm font-medium text-[#020814] dark:text-[#DEDEDE] mt-1">
                        ₦{Number(booking.total_price_naira).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto mb-4 text-[#6B7280] opacity-50" />
                <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                  No {userRole === "customer" ? "shipments" : "deliveries"} yet
                </p>
                {userRole === "customer" && (
                  <button
                    onClick={() => router.push("/book")}
                    className="mt-4 text-[#0066FF] hover:underline text-sm font-medium"
                  >
                    Create your first booking
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#F1F3F8] dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-[#020814] dark:text-[#DEDEDE] mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {userRole === "customer" ? (
                <>
                  <button
                    onClick={() => router.push("/book")}
                    className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <Plus className="w-5 h-5 text-[#0066FF]" />
                      <span className="font-medium">New Shipment</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => router.push("/bookings")}
                    className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-[#0066FF]" />
                      <span className="font-medium">Track Shipments</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => router.push("/riders")}
                    className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-[#0066FF]" />
                      <span className="font-medium">Find Riders</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/bookings")}
                    className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-[#0066FF]" />
                      <span className="font-medium">Available Jobs</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => router.push("/earnings")}
                    className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-[#0066FF]" />
                      <span className="font-medium">Earnings</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => router.push("/profile")}
                    className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-[#0066FF]" />
                      <span className="font-medium">Update Profile</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
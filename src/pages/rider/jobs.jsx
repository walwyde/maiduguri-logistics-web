// import { useState } from 'react';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
// import { Button } from '@/components/ui/button';
// import { mockBookings } from '@/data/mockData';
// import { toast } from 'sonner';
// import {
//   Truck,
//   MapPin,
//   Package,
//   Clock,
//   DollarSign,
//   Navigation,
//   Phone,
//   User,
//   CheckCircle,
//   Filter,
//   RefreshCw,
// } from 'lucide-react';

// export default function AvailableJobs() {
//   const [accepting, setAccepting] = useState(null);
  
//   // Filter only pending jobs
//   const availableJobs = mockBookings.filter((b) => b.status === 'pending');

//   const handleAcceptJob = async (bookingId) => {
//     setAccepting(bookingId);
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     toast.success('Job accepted! You can now start the delivery.');
//     setAccepting(null);
//   };

//   return (
//     <DashboardLayout>
//       {/* Header */}
//       <div className="bg-card border-b border-border">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-foreground">Available Jobs</h1>
//               <p className="text-muted-foreground">
//                 {availableJobs.length} delivery requests waiting for pickup
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <Button variant="outline" size="sm">
//                 <Filter className="w-4 h-4 mr-2" />
//                 Filter
//               </Button>
//               <Button variant="outline" size="sm">
//                 <RefreshCw className="w-4 h-4 mr-2" />
//                 Refresh
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
//         {availableJobs.length > 0 ? (
//           <div className="grid gap-6">
//             {availableJobs.map((job) => (
//               <div
//                 key={job.id}
//                 className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
//                   {/* Job Details */}
//                   <div className="flex-1 space-y-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 rounded-xl bg-status-pending-bg flex items-center justify-center">
//                         <Package className="w-6 h-6 text-primary" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-foreground">{job.booking_number}</h3>
//                         <p className="text-sm text-muted-foreground">
//                           Posted {new Date(job.created_at).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Route */}
//                     <div className="space-y-3">
//                       <div className="flex items-start gap-3">
//                         <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
//                           <MapPin className="w-4 h-4 text-success" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-muted-foreground uppercase tracking-wide">Pickup</p>
//                           <p className="font-medium text-foreground">{job.pickup_address}</p>
//                         </div>
//                       </div>
//                       <div className="ml-4 border-l-2 border-dashed border-border h-4" />
//                       <div className="flex items-start gap-3">
//                         <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center mt-0.5">
//                           <Navigation className="w-4 h-4 text-destructive" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-muted-foreground uppercase tracking-wide">Delivery</p>
//                           <p className="font-medium text-foreground">{job.delivery_address}</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Package Info */}
//                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                       <Package className="w-4 h-4" />
//                       <span>{job.package_description}</span>
//                     </div>
//                   </div>

//                   {/* Price and Actions */}
//                   <div className="lg:w-64 space-y-4">
//                     <div className="bg-secondary/50 rounded-xl p-4 text-center">
//                       <p className="text-sm text-muted-foreground mb-1">Estimated Earnings</p>
//                       <p className="text-3xl font-bold text-foreground">
//                         ₦{Math.round(job.total_price_naira * 0.8).toLocaleString()}
//                       </p>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         {job.distance_km.toFixed(1)} km • Customer pays ₦{job.total_price_naira.toLocaleString()}
//                       </p>
//                     </div>

//                     <div className="flex flex-col gap-2">
//                       <Button
//                         onClick={() => handleAcceptJob(job.id)}
//                         disabled={accepting === job.id}
//                         variant="hero"
//                         className="w-full"
//                       >
//                         {accepting === job.id ? (
//                           <>
//                             <RefreshCw className="w-4 h-4 animate-spin" />
//                             Accepting...
//                           </>
//                         ) : (
//                           <>
//                             <CheckCircle className="w-4 h-4" />
//                             Accept Job
//                           </>
//                         )}
//                       </Button>
//                       <Button variant="outline" className="w-full">
//                         View Details
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-card rounded-2xl border border-border p-12 text-center">
//             <Truck className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
//             <h3 className="text-lg font-semibold text-foreground mb-2">No Available Jobs</h3>
//             <p className="text-muted-foreground">
//               There are no delivery requests at the moment. Check back soon!
//             </p>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

// pages/available-jobs.js
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Truck,
  MapPin,
  Package,
  Navigation,
  CheckCircle,
  Filter,
  RefreshCw,
} from "lucide-react";
import useAuth from "@/utils/useAuth";

export default function AvailableJobs() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings/pending?status=pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch jobs");
      setJobs(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAcceptJob = async (bookingId) => {
    setAccepting(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: "accepted" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to accept job");
      toast.success("Job accepted! You can now start the delivery.");
      fetchJobs(); // Refresh list
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAccepting(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading available jobs...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Available Jobs</h1>
              <p className="text-muted-foreground">
                {jobs.length} delivery requests waiting for pickup
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={fetchJobs}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {jobs.length > 0 ? (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div
                key={job.booking_id}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Job Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-status-pending-bg flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{job.booking_number}</h3>
                        <p className="text-sm text-muted-foreground">
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
                          <MapPin className="w-4 h-4 text-success" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Pickup</p>
                          <p className="font-medium text-foreground">{job.pickup_address}</p>
                        </div>
                      </div>
                      <div className="ml-4 border-l-2 border-dashed border-border h-4" />
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center mt-0.5">
                          <Navigation className="w-4 h-4 text-destructive" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Delivery</p>
                          <p className="font-medium text-foreground">{job.delivery_address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Package Info */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span>{job.package_description}</span>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="lg:w-64 space-y-4">
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Estimated Earnings</p>
                      <p className="text-3xl font-bold text-foreground">
                        ₦{Math.round(job.total_price_naira * 0.8).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Number(job.distance_km)?.toFixed(1)} km • Customer pays ₦{job.total_price_naira.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleAcceptJob(job.booking_id)}
                        disabled={accepting === job.booking_id}
                        variant="hero"
                        className="w-full"
                      >
                        {accepting === job.booking_id ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Accepting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Accept Job
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <Truck className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Available Jobs</h3>
            <p className="text-muted-foreground">
              There are no delivery requests at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

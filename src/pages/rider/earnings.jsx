// import { DashboardLayout } from '@/components/layout/DashboardLayout';
// import { StatsCard } from '@/components/shared/StatsCard';
// import { mockEarnings, mockBookings } from '@/data/mockData';
// import { Button } from '@/components/ui/button';
// import {
//   DollarSign,
//   TrendingUp,
//   Calendar,
//   Download,
//   Clock,
//   CheckCircle,
//   Wallet,
//   ArrowUpRight,
//   Package,
// } from 'lucide-react';

// export default function Earnings() {
//   const totalEarnings = mockEarnings.reduce((sum, e) => sum + e.amount, 0);
//   const paidEarnings = mockEarnings.filter((e) => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
//   const pendingEarnings = mockEarnings.filter((e) => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);

//   // Weekly earnings data for chart simulation
//   const weeklyData = [
//     { day: 'Mon', amount: 4500 },
//     { day: 'Tue', amount: 3200 },
//     { day: 'Wed', amount: 5100 },
//     { day: 'Thu', amount: 2800 },
//     { day: 'Fri', amount: 6200 },
//     { day: 'Sat', amount: 7500 },
//     { day: 'Sun', amount: 4100 },
//   ];

//   const maxAmount = Math.max(...weeklyData.map((d) => d.amount));

//   return (
//     <DashboardLayout>
//       {/* Header */}
//       <div className="bg-card border-b border-border">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
//               <p className="text-muted-foreground">Track your income and payouts</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <Button variant="outline">
//                 <Calendar className="w-4 h-4 mr-2" />
//                 This Week
//               </Button>
//               <Button variant="outline">
//                 <Download className="w-4 h-4 mr-2" />
//                 Export
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
//         {/* Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatsCard
//             title="Total Earnings"
//             value={`₦${totalEarnings.toLocaleString()}`}
//             subtitle="This month"
//             icon={DollarSign}
//             variant="primary"
//           />
//           <StatsCard
//             title="Paid Out"
//             value={`₦${paidEarnings.toLocaleString()}`}
//             subtitle="Withdrawn"
//             icon={CheckCircle}
//             variant="success"
//           />
//           <StatsCard
//             title="Pending"
//             value={`₦${pendingEarnings.toLocaleString()}`}
//             subtitle="Awaiting payout"
//             icon={Clock}
//             variant="warning"
//           />
//           <StatsCard
//             title="This Week"
//             value={`₦${weeklyData.reduce((s, d) => s + d.amount, 0).toLocaleString()}`}
//             subtitle="+12% from last week"
//             icon={TrendingUp}
//             variant="success"
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Weekly Chart */}
//           <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-foreground">Weekly Overview</h3>
//               <div className="flex items-center gap-2 text-sm text-success">
//                 <ArrowUpRight className="w-4 h-4" />
//                 <span>+12% from last week</span>
//               </div>
//             </div>

//             {/* Simple Bar Chart */}
//             <div className="flex items-end justify-between gap-4 h-48">
//               {weeklyData.map((day) => (
//                 <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
//                   <div className="w-full flex flex-col items-center">
//                     <span className="text-xs font-medium text-foreground mb-1">
//                       ₦{(day.amount / 1000).toFixed(1)}k
//                     </span>
//                     <div
//                       className="w-full bg-primary/20 rounded-t-lg transition-all duration-500 hover:bg-primary/30"
//                       style={{ height: `${(day.amount / maxAmount) * 120}px` }}
//                     >
//                       <div
//                         className="w-full gradient-primary rounded-t-lg transition-all duration-500"
//                         style={{ height: `${(day.amount / maxAmount) * 100}%` }}
//                       />
//                     </div>
//                   </div>
//                   <span className="text-xs text-muted-foreground">{day.day}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Payout Card */}
//           <div className="bg-card rounded-2xl border border-border p-6">
//             <h3 className="text-lg font-semibold text-foreground mb-6">Wallet</h3>
            
//             <div className="gradient-primary rounded-xl p-6 text-primary-foreground mb-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <Wallet className="w-8 h-8" />
//                 <span className="text-sm opacity-90">Available Balance</span>
//               </div>
//               <p className="text-3xl font-bold">₦{pendingEarnings.toLocaleString()}</p>
//             </div>

//             <Button className="w-full" variant="hero">
//               Withdraw Funds
//             </Button>

//             <div className="mt-6 pt-6 border-t border-border">
//               <h4 className="text-sm font-medium text-foreground mb-3">Payout Account</h4>
//               <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
//                 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
//                   <DollarSign className="w-5 h-5 text-primary" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-foreground">GTBank</p>
//                   <p className="text-sm text-muted-foreground">****4521</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Transactions */}
//         <div className="mt-8 bg-card rounded-2xl border border-border p-6">
//           <h3 className="text-lg font-semibold text-foreground mb-6">Recent Transactions</h3>
//           <div className="space-y-4">
//             {mockEarnings.map((earning) => {
//               const booking = mockBookings.find((b) => b.booking_id === earning.booking_id);
//               return (
//                 <div
//                   key={earning.id}
//                   className="flex items-center justify-between p-4 border border-border rounded-xl"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
//                       earning.status === 'paid' ? 'bg-status-completed-bg' : 'bg-status-active-bg'
//                     }`}>
//                       <Package className={`w-5 h-5 ${
//                         earning.status === 'paid' ? 'text-success' : 'text-warning'
//                       }`} />
//                     </div>
//                     <div>
//                       <p className="font-medium text-foreground">
//                         {booking?.booking_number || earning.booking_id}
//                       </p>
//                       <p className="text-sm text-muted-foreground">
//                         {new Date(earning.date).toLocaleDateString('en-NG', {
//                           day: 'numeric',
//                           month: 'short',
//                           year: 'numeric',
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-semibold text-foreground">
//                       +₦{earning.amount.toLocaleString()}
//                     </p>
//                     <span className={`text-xs font-medium capitalize ${
//                       earning.status === 'paid' ? 'text-success' : 'text-warning'
//                     }`}>
//                       {earning.status}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
  
// pages/dashboard/index.jsx
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Clock,
  CheckCircle,
  Wallet,
  ArrowUpRight,
  Package,
} from "lucide-react";
import useAuth from "@/utils/useAuth";

export default function Earnings() {
  const {token} = useAuth();
  // -----------------------------
  // Fetch bookings from API
  // -----------------------------
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings?limit=100" , 
{ method: "GET",
  headers: {
    Authorization : `Bearer ${token}`,
  }
 }
      );
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const rows = await res.json();

      // Map to Earnings-compatible structure
      return rows.map((b) => ({
  id: b.booking_id,
  booking_id: b.booking_id,
  booking_number: b.booking_number,
  amount: Number(b.total_price_naira) || 0,
  status: b.status,
  date: b.created_at,
}));

    },
    onError: (err) => {
      toast.error(err.message || "Failed to load bookings");
    },
  });

  // -----------------------------
  // Calculate totals
  // -----------------------------
 const totalEarnings = bookings.reduce(
  (sum, e) => sum + (Number(e.amount) || 0),
  0
);

  const paidEarnings = bookings
    .filter((e) => e.status === "paid")
    .reduce((sum, e) => sum + e.amount, 0);
  const pendingEarnings = bookings
    .filter((e) => e.status === "pending")
    .reduce((sum, e) => sum + e.amount, 0);

  // Weekly earnings chart
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    const dayStr = day.toLocaleDateString("en-US", { weekday: "short" });
    const dayTotal = bookings
      .filter(
        (b) =>
          new Date(b.date).toDateString() === day.toDateString()
      )
      .reduce((sum, b) => sum + b.amount, 0);
    return { day: dayStr, amount: dayTotal };
  });

  const maxAmount = Math.max(...weeklyData.map((d) => d.amount), 1);

  if (isLoading) return <p className="p-6 text-center">Loading...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error.message}</p>;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
              <p className="text-muted-foreground">Track your income and payouts</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                This Week
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Earnings"
            value={`₦${totalEarnings.toLocaleString()}`}
            subtitle="This month"
            icon={DollarSign}
            variant="primary"
          />
          <StatsCard
            title="Paid Out"
            value={`₦${paidEarnings.toLocaleString()}`}
            subtitle="Withdrawn"
            icon={CheckCircle}
            variant="success"
          />
          <StatsCard
            title="Pending"
            value={`₦${pendingEarnings.toLocaleString()}`}
            subtitle="Awaiting payout"
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="This Week"
            value={`₦${weeklyData.reduce((s, d) => s + d.amount, 0).toLocaleString()}`}
            subtitle="+12% from last week"
            icon={TrendingUp}
            variant="success"
          />
        </div>

        {/* Weekly Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Weekly Overview</h3>
              <div className="flex items-center gap-2 text-sm text-success">
                <ArrowUpRight className="w-4 h-4" />
                <span>+12% from last week</span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4 h-48">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs font-medium text-foreground mb-1">
                      ₦{(day.amount / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="w-full bg-primary/20 rounded-t-lg transition-all duration-500 hover:bg-primary/30"
                      style={{ height: `${(day.amount / maxAmount) * 120}px` }}
                    >
                      <div
                        className="w-full gradient-primary rounded-t-lg transition-all duration-500"
                        style={{ height: `${(day.amount / maxAmount) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wallet */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Wallet</h3>
            <div className="gradient-primary rounded-xl p-6 text-primary-foreground mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-8 h-8" />
                <span className="text-sm opacity-90">Available Balance</span>
              </div>
              <p className="text-3xl font-bold">₦{pendingEarnings.toLocaleString()}</p>
            </div>
            <Button className="w-full" variant="hero">
              Withdraw Funds
            </Button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {bookings.map((earning) => (
              <div
                key={earning.id}
                className="flex items-center justify-between p-4 border border-border rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      earning.status === "paid" ? "bg-status-completed-bg" : "bg-status-active-bg"
                    }`}
                  >
                    <Package
                      className={`w-5 h-5 ${
                        earning.status === "paid" ? "text-success" : "text-warning"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{earning.booking_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(earning.date).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    +₦{earning.amount.toLocaleString()}
                  </p>
                  <span
                    className={`text-xs font-medium capitalize ${
                      earning.status === "paid" ? "text-success" : "text-warning"
                    }`}
                  >
                    {earning.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";

import {
  Package,
  CheckCircle,
  Clock,
  DollarSign,
  Plus,
  Truck,
  Star,
  AlertCircle,
  ArrowRight,
  MapPin,
  Settings,
} from "lucide-react";

import useAuth from "@/utils/useAuth";

// Loading skeleton component
function StatsCardSkeleton() {
  return (
    <div className="h-28 bg-secondary/50 animate-pulse rounded-xl"></div>
  );
}

function BookingSkeleton() {
  return (
    <div className="h-20 bg-secondary/50 animate-pulse rounded-xl mb-4"></div>
  );
}

export default function Dashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const userRole = user?.role || "customer";

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/account/signin";
    }
  }, [user, authLoading]);

  // ----------------------------
  // Fetch profile
  // ----------------------------
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled: !!token,
    onError: (err) => toast.error(err.message || "Failed to fetch profile"),
  });

  // ----------------------------
  // Fetch dashboard stats
  // ----------------------------
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["dashboard-stats", userRole],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/stats?role=${userRole}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!token,
    onError: (err) => toast.error(err.message || "Failed to fetch stats"),
  });

  console.log("Profile:", profile, "Stats:", stats);
  // ----------------------------
  // Fetch recent bookings
  // ----------------------------
  const {
    data: recentBookings = [],
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useQuery({
    queryKey: ["recent-bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings?limit=5", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch recent bookings");
      return res.json();
    },
    enabled: !!token,
    onError: (err) => toast.error(err.message || "Failed to fetch bookings"),
  });

  // ----------------------------
  // Redirect to onboarding if phone not set
  // ----------------------------
  useEffect(() => {
    if (profile && !profile.user?.phone) {
      window.location.href = "/onboarding";
    }
  }, [profile]);

  const isLoading = authLoading || profileLoading || statsLoading || bookingsLoading;

  // ----------------------------
  // Render
  // ----------------------------
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-6">
          <p className="text-muted-foreground">Loading dashboard...</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
          <div className="lg:col-span-2">
            <BookingSkeleton />
            <BookingSkeleton />
            <BookingSkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome back, {user?.name?.split(" ")[0]}!
                </h1>
                <p className="text-muted-foreground">
                  {userRole === "customer"
                    ? "Ready to ship your packages?"
                    : userRole === "rider"
                    ? "Ready to make deliveries?"
                    : "Overview of your platform"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {userRole === "customer" && (
                <Button asChild variant="hero" size="lg">
                  <Link href="/book">
                    <Plus className="w-4 h-4" /> New Booking
                  </Link>
                </Button>
              )}
              {userRole === "rider" && (
                <Button asChild variant="hero" size="lg">
                  <Link href="/rider/jobs">
                    <Truck className="w-4 h-4" /> Find Jobs
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userRole === "customer" && stats && (
            <>
              <StatsCard
                title="Total Shipments"
                value={stats.totalBookings?.toLocaleString() || "0"}
                subtitle="All time"
                icon={Package}
                variant="primary"
              />
              <StatsCard
                title="Completed"
                value={stats.completedBookings?.toLocaleString() || "0"}
                subtitle="Successfully delivered"
                icon={CheckCircle}
                variant="success"
              />
              <StatsCard
                title="Active"
                value={stats.activeBookings?.toLocaleString() || "0"}
                subtitle="In progress"
                icon={Clock}
                variant="warning"
              />
              <StatsCard
                title="Total Spent"
                value={`₦${stats.totalSpent?.toLocaleString() || "0"}`}
                subtitle="All time"
                icon={DollarSign}
                variant="default"
              />
            </>
          )}

          {userRole === "rider" && stats && (
            <>
              <StatsCard
                title="Total Deliveries"
                value={profile?.user?.total_deliveries?.toLocaleString() || "0"}
                subtitle="All time"
                icon={Truck}
                variant="primary"
              />
              <StatsCard
                title="Rating"
                value={user?.rating?.toFixed(1) || "0.0"}
                subtitle="Average score"
                icon={Star}
                variant="warning"
              />
              <StatsCard
                title="Total Earnings"
                value={`₦${stats.totalEarnings?.toLocaleString() || "0"}`}
                subtitle="All time"
                icon={DollarSign}
                variant="success"
              />
              <StatsCard
                title="Verification"
                value={user?.verification_status === "verified" ? "Verified" : "Pending"}
                subtitle="Account status"
                icon={user?.verification_status === "verified" ? CheckCircle : AlertCircle}
                variant={user?.verification_status === "verified" ? "success" : "warning"}
              />
            </>
          )}
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* RECENT BOOKINGS */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Recent {userRole === "customer" ? "Shipments" : "Deliveries"}
              </h3>
              <Link
                href="/bookings"
                className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/bookings/${booking.booking_id}`}
                    className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-status-pending-bg rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{booking.booking_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={booking.status} />
                      <p className="text-sm font-medium text-foreground mt-1">
                        ₦{Number(booking.total_price_naira).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No shipments yet</p>
                {userRole === "customer" && (
                  <Button asChild variant="link" className="mt-4">
                    <Link href="/book">Create your first booking</Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {userRole === "customer" ? (
                <>
                  <QuickActionButton to="/book" icon={Plus} label="New Shipment" />
                  <QuickActionButton to="/bookings" icon={MapPin} label="Track Shipments" />
                  <QuickActionButton to="/profile" icon={Settings} label="Settings" />
                </>
              ) : userRole === "rider" ? (
                <>
                  <QuickActionButton to="/rider/jobs" icon={Truck} label="Available Jobs" />
                  <QuickActionButton to="/rider/earnings" icon={DollarSign} label="Earnings" />
                  <QuickActionButton to="/rider/profile" icon={Settings} label="Update Profile" />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function QuickActionButton({ to, icon: Icon, label }) {
  return (
    <Link
      href={to}
      className="w-full flex items-center justify-between p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors group"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-primary" />
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
    </Link>
  );
}



import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/shared/StatsCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockBookings, mockUsers } from '@/data/mockData';
import { Link } from 'react-router-dom';
import {
  Users,
  Truck,
  Package,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';

export default function AdminDashboard() {
  const totalUsers = mockUsers.filter((u) => u.role === 'customer').length;
  const totalRiders = mockUsers.filter((u) => u.role === 'rider').length;
  const totalBookings = mockBookings.length;
  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.total_price_naira, 0);

  const recentBookings = mockBookings.slice(0, 5);
  const recentUsers = mockUsers.slice(0, 5);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Platform overview and management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={totalUsers.toLocaleString()}
            subtitle="+12% this month"
            icon={Users}
            variant="primary"
          />
          <StatsCard
            title="Active Riders"
            value={totalRiders.toLocaleString()}
            subtitle="+5 this week"
            icon={Truck}
            variant="success"
          />
          <StatsCard
            title="Total Bookings"
            value={totalBookings.toLocaleString()}
            subtitle="All time"
            icon={Package}
            variant="warning"
          />
          <StatsCard
            title="Revenue"
            value={`₦${totalRevenue.toLocaleString()}`}
            subtitle="+18% this month"
            icon={DollarSign}
            variant="success"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
              <div className="flex items-center gap-2 text-sm text-success">
                <ArrowUpRight className="w-4 h-4" />
                <span>+18%</span>
              </div>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
                const height = [60, 75, 45, 90, 80, 95][i];
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full gradient-primary rounded-t-lg transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bookings Status */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Booking Status</h3>
            <div className="space-y-4">
              {[
                { label: 'Completed', count: 1100, percentage: 88, color: 'bg-success' },
                { label: 'In Transit', count: 85, percentage: 7, color: 'bg-warning' },
                { label: 'Pending', count: 45, percentage: 4, color: 'bg-primary' },
                { label: 'Cancelled', count: 20, percentage: 1, color: 'bg-destructive' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground font-medium">{item.label}</span>
                    <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Recent Bookings</h3>
              <Link
                to="/admin/bookings"
                className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-foreground">{booking.booking_number}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {booking.pickup_address}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={booking.status} />
                    <p className="text-sm font-medium text-foreground mt-1">
                      ₦{booking.total_price_naira.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Recent Users</h3>
              <Link
                to="/admin/users"
                className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                    user.role === 'rider' 
                      ? 'bg-status-active-bg text-warning' 
                      : user.role === 'admin'
                      ? 'bg-status-pending-bg text-primary'
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

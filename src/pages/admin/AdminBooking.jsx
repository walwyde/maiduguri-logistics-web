import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockBookings } from '@/data/mockData';
import { BookingStatus } from '@/types';
import {
  Package,
  Search,
  Filter,
  Calendar,
  MapPin,
  Navigation,
  Eye,
  Download,
} from 'lucide-react';

export default function AdminBookings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.booking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.pickup_address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['all', 'pending', 'accepted', 'in_transit', 'delivered', 'cancelled'];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">All Bookings</h1>
              <p className="text-muted-foreground">{mockBookings.length} total bookings</p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by booking number or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status === 'all' ? 'All' : status.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        <div className="grid gap-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Booking Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-status-pending-bg flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{booking.booking_number}</h3>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(booking.created_at).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                {/* Route */}
                <div className="flex-1 lg:max-w-md">
                  <div className="flex items-start gap-3 mb-2">
                    <MapPin className="w-4 h-4 text-success mt-0.5" />
                    <p className="text-sm text-foreground truncate">{booking.pickup_address}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Navigation className="w-4 h-4 text-destructive mt-0.5" />
                    <p className="text-sm text-foreground truncate">{booking.delivery_address}</p>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      ₦{booking.total_price_naira.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.distance_km.toFixed(1)} km
                    </p>
                  </div>
                  <Button variant="outline" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Bookings Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

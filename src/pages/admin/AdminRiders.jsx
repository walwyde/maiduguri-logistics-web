import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockUsers } from '@/data/mockData';
import { toast } from 'sonner';
import {
  Truck,
  Search,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  Package,
  UserPlus,
} from 'lucide-react';

export default function AdminRiders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const riders = mockUsers.filter((u) => u.role === 'rider');

  const filteredRiders = riders.filter((rider) => {
    const matchesSearch =
      rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || rider.verification_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVerify = (riderId, action) => {
    toast.success(`Rider ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Rider Management</h1>
              <p className="text-muted-foreground">{riders.length} registered riders</p>
            </div>
            <Button variant="hero">
              <UserPlus className="w-4 h-4" />
              Add Rider
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-status-completed-bg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {riders.filter((r) => r.verification_status === 'verified').length}
              </p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-status-active-bg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {riders.filter((r) => r.verification_status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-status-cancelled-bg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {riders.filter((r) => r.verification_status === 'rejected').length}
              </p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search riders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'verified', 'pending', 'rejected'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Riders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRiders.map((rider) => (
            <div
              key={rider.id}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
                    <Truck className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{rider.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="text-sm text-muted-foreground">
                        {rider.rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    rider.verification_status === 'verified'
                      ? 'bg-status-completed-bg text-success'
                      : rider.verification_status === 'pending'
                      ? 'bg-status-active-bg text-warning'
                      : 'bg-status-cancelled-bg text-destructive'
                  }`}
                >
                  {rider.verification_status === 'verified' && <CheckCircle className="w-3 h-3" />}
                  {rider.verification_status === 'pending' && <AlertCircle className="w-3 h-3" />}
                  {rider.verification_status === 'rejected' && <XCircle className="w-3 h-3" />}
                  {rider.verification_status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {rider.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {rider.phone || 'Not provided'}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="w-4 h-4" />
                  {rider.total_deliveries || 0} deliveries
                </div>
              </div>

              {rider.verification_status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleVerify(rider.id, 'approve')}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={() => handleVerify(rider.id, 'reject')}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              )}

              {rider.verification_status === 'verified' && (
                <Button variant="outline" size="sm" className="w-full">
                  View Profile
                </Button>
              )}
            </div>
          ))}
        </div>

        {filteredRiders.length === 0 && (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <Truck className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Riders Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

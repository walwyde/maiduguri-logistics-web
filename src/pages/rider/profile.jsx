
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  User,
  Truck,
  Star,
  CheckCircle,
  AlertCircle,
  Camera,
  Save,
  Shield,
} from "lucide-react";
import useAuth from "@/utils/useAuth";

export default function RiderProfile() {
  const { user, token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "Maiduguri, Nigeria",
    vehicleType: "",
    vehiclePlate: "",
    bankName: "GTBank",
    accountNumber: "",
    accountName: "",
    verificationStatus: "",
    rating: 0,
    totalDeliveries: 0,
    yearsExperience: 0,
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");

        const u = data.user;
        setFormData({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          address: "Lagos, Nigeria",
          vehicleType: u.vehicle_type || "",
          vehiclePlate: u.vehicle_plate || "",
          bankName: "GTBank",
          accountNumber: "",
          accountName: u.name || "",
          verificationStatus: u.verification_status || "pending",
          rating: u.rating || 0,
          totalDeliveries: u.total_deliveries || 0,
          yearsExperience: u.years_experience || 0,
        });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
          toast.error("Unable to fetch your current location");
        }
      );
    } else {
      toast.error("Geolocation not supported in your browser");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" , Authorization: `Bearer ${token}`},
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          role: "rider",
          vehicleType: formData.vehicleType,
          vehiclePlate: formData.vehiclePlate,
          licenseNumber: formData.vehiclePlate, // assuming same as plate
          yearsExperience: formData.yearsExperience,
          currentLocationLat: location.lat,
          currentLocationLng: location.lng,
          isAvailable: true,
          profileImage: null,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          accountName: formData.accountName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading profile...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your rider profile and vehicle information
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center">
                  <User className="w-12 h-12 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground">{formData.name}</h3>
              <p className="text-muted-foreground">Delivery Rider</p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="font-semibold text-foreground">{Number(formData.rating).toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <span className="text-sm text-muted-foreground">Deliveries</span>
                  <span className="font-semibold text-foreground">{formData.totalDeliveries}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <span className="text-sm text-muted-foreground">Years of Experience</span>
                  <span className="font-semibold text-foreground">{formData.yearsExperience}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center gap-1">
                    {formData.verificationStatus === "verified" ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium text-success">Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-warning" />
                        <span className="text-sm font-medium text-warning">Pending</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <span className="text-sm text-muted-foreground">Current Location</span>
                  <span className="font-semibold text-foreground">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2 space-y-6">
  {/* Personal Information Form */}
  <div className="bg-card rounded-2xl border border-border p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <User className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+234..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Your address"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Years of Experience</Label>
        <Input
          id="address"
          type="number"
          name="yearsExperience"
          value={formData.yearsExperience}
          onChange={handleChange}
          placeholder="Years of experience"
        />
      </div>
    </div>
  </div>

  {/* Vehicle Information */}
  <div className="bg-card rounded-2xl border border-border p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Truck className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">Vehicle Information</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="vehicleType">Vehicle Type</Label>
        <Input
          id="vehicleType"
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
          placeholder="e.g., Motorcycle, Van"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vehiclePlate">License Plate</Label>
        <Input
          id="vehiclePlate"
          name="vehiclePlate"
          value={formData.vehiclePlate}
          onChange={handleChange}
          placeholder="e.g., LAG-123-AB"
        />
      </div>
    </div>
  </div>

  {/* Bank Details */}
  <div className="bg-card rounded-2xl border border-border p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Shield className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">Bank Details</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          placeholder="Select bank"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          placeholder="0123456789"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="accountName">Account Name</Label>
        <Input
          id="accountName"
          name="accountName"
          value={formData.accountName}
          onChange={handleChange}
          placeholder="Account holder name"
        />
      </div>
    </div>
  </div>
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving} variant="hero" size="lg">
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


import { useState, useEffect, useCallback } from "react";
import {
  Truck,
  UserCheck,
  Shield,
  MapPin,
  FileText,
  ArrowRight,
  User,
  Phone,
  Camera,
  Navigation,
} from "lucide-react";
import useAuth from "../../utils/useAuth";

function OnboardingPage() {
  const { user, loading: userLoading } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    // Auth Users fields
    phone: "",
    role: "customer",
    profileImage: "",
    
    // Rider-specific fields (rider_profiles table)
    vehicleType: "mini-truck",
    vehicleModel: "",
    vehiclePlate: "",
    licenseNumber: "",
    yearsExperience: 0,
    currentLocationLat: 0,
    currentLocationLng: 0,
    isAvailable: false,
  });

  // Load pending data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pendingData = localStorage.getItem("pendingUserData");
      if (pendingData) {
        try {
          const data = JSON.parse(pendingData);
          setFormData((prev) => ({ ...prev, ...data }));
        } catch (e) {
          console.error("Failed to parse pending user data");
        }
      }
    }
  }, []);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            currentLocationLat: position.coords.latitude,
            currentLocationLng: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Could not get your location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth-token");
      
      if (!token) {
        throw new Error("No authentication token found. Please sign in again.");
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save profile");
      }

      // Clear pending data
      if (typeof window !== "undefined") {
        localStorage.removeItem("pendingUserData");
      }

      // Redirect to appropriate dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Save profile error:", err);
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const handleNext = () => {
    if (formData.role === "customer") {
      // Customer: Basic info (Step 1) -> Save
      saveProfile();
    } else {
      // Rider: Basic info (Step 1) -> Vehicle details (Step 2) -> Location (Step 3) -> Save
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        saveProfile();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      // Basic info - required for both customer and rider
      return formData.phone && formData.role;
    }
    if (currentStep === 2 && formData.role === "rider") {
      // Vehicle details - required for riders
      return (
        formData.vehicleType &&
        formData.vehicleModel && 
        formData.vehiclePlate && 
        formData.licenseNumber
      );
    }
    if (currentStep === 3 && formData.role === "rider") {
      // Location - required for riders
      return (
        formData.currentLocationLat !== 0 && 
        formData.currentLocationLng !== 0
      );
    }
    return true;
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FCFDFF] to-[#F6F8FF] dark:from-[#121212] dark:to-[#0F0F0F] flex items-center justify-center font-inter">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0066FF] dark:border-[#4A90E2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/account/signin";
    }
    return null;
  }

  const totalSteps = formData.role === "rider" ? 3 : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFDFF] to-[#F6F8FF] dark:from-[#121212] dark:to-[#0F0F0F] p-4 font-inter">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0066FF] dark:bg-[#4A90E2] rounded-2xl mb-4">
            <Truck size={32} className="text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE] mb-2">
            Complete Your Profile
          </h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
            Let's set up your account to get you started
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-[#0066FF] dark:bg-[#4A90E2] text-white"
                      : "bg-[#E7EAF1] dark:bg-gray-700 text-[#6B7280] dark:text-[#9CA3AF]"
                  }`}
                >
                  {step}
                </div>
                {step < totalSteps && (
                  <div
                    className={`w-12 h-px ml-2 ${
                      currentStep > step
                        ? "bg-[#0066FF] dark:bg-[#4A90E2]"
                        : "bg-[#E7EAF1] dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-8">
            <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              Basic Info
            </span>
            {formData.role === "rider" && (
              <>
                <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  Vehicle
                </span>
                <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  Location
                </span>
              </>
            )}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg border border-[#F1F3F8] dark:border-gray-700 p-8">
          
          {/* STEP 1: Basic Information (Both Customer & Rider) */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <UserCheck
                  size={32}
                  className="text-[#0066FF] dark:text-[#4A90E2] mx-auto mb-2"
                />
                <h3 className="text-lg font-semibold text-[#020814] dark:text-[#DEDEDE]">
                  Basic Information
                </h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
                  Tell us a bit about yourself
                </p>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+234 XXX XXX XXXX"
                  className="w-full h-12 px-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                />
              </div>

              {/* Profile Image URL (Optional) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                  Profile Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.profileImage}
                  onChange={(e) => handleChange("profileImage", e.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full h-12 px-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                />
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  You can add your profile picture later
                </p>
              </div>

              {/* Role Confirmation */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                  Account Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleChange("role", "customer")}
                    className={`p-4 rounded-xl border-2 transition-colors duration-150 ${
                      formData.role === "customer"
                        ? "border-[#0066FF] dark:border-[#4A90E2] bg-[#0066FF]/5 dark:bg-[#4A90E2]/10"
                        : "border-[#E7EAF1] dark:border-gray-600 hover:border-[#0066FF]/30 dark:hover:border-[#4A90E2]/30"
                    }`}
                  >
                    <div className="text-center">
                      <UserCheck
                        size={24}
                        className={`mx-auto mb-2 ${formData.role === "customer" ? "text-[#0066FF] dark:text-[#4A90E2]" : "text-[#6B7280] dark:text-[#9CA3AF]"}`}
                      />
                      <span
                        className={`font-medium text-sm ${formData.role === "customer" ? "text-[#0066FF] dark:text-[#4A90E2]" : "text-[#111827] dark:text-[#DEDEDE]"}`}
                      >
                        Customer
                      </span>
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                        Ship packages
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("role", "rider")}
                    className={`p-4 rounded-xl border-2 transition-colors duration-150 ${
                      formData.role === "rider"
                        ? "border-[#0066FF] dark:border-[#4A90E2] bg-[#0066FF]/5 dark:bg-[#4A90E2]/10"
                        : "border-[#E7EAF1] dark:border-gray-600 hover:border-[#0066FF]/30 dark:hover:border-[#4A90E2]/30"
                    }`}
                  >
                    <div className="text-center">
                      <Truck
                        size={24}
                        className={`mx-auto mb-2 ${formData.role === "rider" ? "text-[#0066FF] dark:text-[#4A90E2]" : "text-[#6B7280] dark:text-[#9CA3AF]"}`}
                      />
                      <span
                        className={`font-medium text-sm ${formData.role === "rider" ? "text-[#0066FF] dark:text-[#4A90E2]" : "text-[#111827] dark:text-[#DEDEDE]"}`}
                      >
                        Rider
                      </span>
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                        Deliver packages
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Vehicle Information (Riders Only) */}
          {currentStep === 2 && formData.role === "rider" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Shield
                  size={32}
                  className="text-[#0066FF] dark:text-[#4A90E2] mx-auto mb-2"
                />
                <h3 className="text-lg font-semibold text-[#020814] dark:text-[#DEDEDE]">
                  Vehicle Information
                </h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
                  Help customers trust you with verified vehicle details
                </p>
              </div>

              {/* Vehicle Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                  Vehicle Type *
                </label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => handleChange("vehicleType", e.target.value)}
                  className="w-full h-12 px-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                >
                  <option value="mini-truck">Mini Truck</option>
                  <option value="pickup">Pickup Truck</option>
                  <option value="van">Van</option>
                  <option value="motorbike">Motorbike</option>
                </select>
              </div>

              {/* Vehicle Model */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                  Vehicle Model *
                </label>
                <input
                  type="text"
                  value={formData.vehicleModel}
                  onChange={(e) => handleChange("vehicleModel", e.target.value)}
                  placeholder="e.g., Toyota Hiace, Nissan Urvan"
                  className="w-full h-12 px-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                />
              </div>

              {/* License Plate */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                  License Plate Number *
                </label>
                <input
                  type="text"
                  value={formData.vehiclePlate}
                  onChange={(e) =>
                    handleChange("vehiclePlate", e.target.value.toUpperCase())
                  }
                  placeholder="ABC-123-XY"
                  className="w-full h-12 px-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                />
              </div>

              {/* Driver's License */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                  Driver's License Number *
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    handleChange("licenseNumber", e.target.value)
                  }
                  placeholder="Enter your license number"
                  className="w-full h-12 px-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                />
              </div>

              {/* Years of Experience */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                  Years of Driving Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.yearsExperience}
                  onChange={(e) =>
                    handleChange(
                      "yearsExperience",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-full h-12 px-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Location (Riders Only) */}
          {currentStep === 3 && formData.role === "rider" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Navigation
                  size={32}
                  className="text-[#0066FF] dark:text-[#4A90E2] mx-auto mb-2"
                />
                <h3 className="text-lg font-semibold text-[#020814] dark:text-[#DEDEDE]">
                  Current Location
                </h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
                  We need your location to match you with nearby delivery requests
                </p>
              </div>

              {/* Get Location Button */}
              <button
                type="button"
                onClick={getCurrentLocation}
                className="w-full py-4 bg-[#0066FF]/10 dark:bg-[#4A90E2]/20 border-2 border-[#0066FF] dark:border-[#4A90E2] rounded-xl hover:bg-[#0066FF]/20 dark:hover:bg-[#4A90E2]/30 transition-colors duration-150"
              >
                <div className="flex items-center justify-center space-x-2">
                  <MapPin size={20} className="text-[#0066FF] dark:text-[#4A90E2]" />
                  <span className="font-medium text-[#0066FF] dark:text-[#4A90E2]">
                    Get My Current Location
                  </span>
                </div>
              </button>

              {/* Location Display */}
              {formData.currentLocationLat !== 0 && formData.currentLocationLng !== 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-start space-x-3">
                    <MapPin size={20} className="text-green-600 dark:text-green-400 mt-1" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100 mb-1">
                        Location Captured ✓
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Latitude: {formData.currentLocationLat.toFixed(6)}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Longitude: {formData.currentLocationLng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Availability Toggle */}
              <div className="space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                      Set as Available for Deliveries
                    </span>
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                      You can change this later in your dashboard
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => handleChange("isAvailable", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0066FF]/20 dark:peer-focus:ring-[#4A90E2]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0066FF] dark:peer-checked:bg-[#4A90E2]"></div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-[#FDEBF0] dark:bg-[#3A1A1A] border border-[#F4B2C7] dark:border-[#8B2635] rounded-lg p-3 mt-6">
              <p className="text-[#E5383B] dark:text-[#FF7875] text-sm">
                {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="px-6 py-3 text-[#6B7280] dark:text-[#9CA3AF] font-medium text-sm hover:text-[#111827] dark:hover:text-[#DEDEDE] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
            )}
            <div className="flex-1"></div>
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className="flex items-center space-x-2 px-6 py-3 bg-[#0066FF] dark:bg-[#4A90E2] text-white font-semibold text-sm rounded-xl hover:bg-[#0052E6] dark:hover:bg-[#3A7BC8] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>
                    {(currentStep === 1 && formData.role === "customer") ||
                    (currentStep === 3 && formData.role === "rider")
                      ? "Complete Setup"
                      : "Continue"}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;

import { useState } from "react";
import useAuth from "../../../utils/useAuth";

import { Truck, Mail, Lock, User, Phone, UserCheck } from "lucide-react";

function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "customer",
  });

  const { signUpWithCredentials } = useAuth();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    // Store additional data in localStorage for onboarding
    localStorage.setItem(
      "pendingUserData",
      JSON.stringify({
        phone: formData.phone,
        role: formData.role,
      }),
    );

    try {
      await signUpWithCredentials({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        callbackUrl: "/onboarding",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin:
          "Couldn't start sign-up. Please try again or use a different method.",
        OAuthCallback: "Sign-up failed after redirecting. Please try again.",
        OAuthCreateAccount:
          "Couldn't create an account. Email may already be registered.",
        EmailCreateAccount:
          "This email can't be used. It may already be registered.",
        CredentialsSignin: "Invalid information. Please check your details.",
        AccessDenied: "You don't have permission to sign up.",
        Configuration:
          "Sign-up isn't working right now. Please try again later.",
      };

      setError(
        errorMessages[err.message] || "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFDFF] to-[#F6F8FF] dark:from-[#121212] dark:to-[#0F0F0F] flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0066FF] dark:bg-[#4A90E2] rounded-2xl mb-4">
            <Truck size={32} className="text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE] mb-2">
            Join Maiduguri Logistics
          </h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
            Create your account to get started
          </p>
        </div>

        {/* Sign Up Form */}
        <form
          noValidate
          onSubmit={onSubmit}
          className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg border border-[#F1F3F8] dark:border-gray-700 p-8"
        >
          <div className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                I want to join as a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange("role", "customer")}
                  className={`p-4 rounded-xl border-2 transition-colors duration-150 ${
                    formData.role === "customer"
                      ? "border-[#0066FF] dark:border-[#4A90E2] bg-[#0066FF]/5 dark:bg-[#4A90E2]/10"
                      : "border-[#E7EAF1] dark:border-gray-600 hover:border-[#0066FF]/30 dark:hover:border-[#4A90E2]/30"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <User
                      size={24}
                      className={`${formData.role === "customer" ? "text-[#0066FF] dark:text-[#4A90E2]" : "text-[#6B7280] dark:text-[#9CA3AF]"}`}
                    />
                    <span
                      className={`font-medium text-sm ${formData.role === "customer" ? "text-[#0066FF] dark:text-[#4A90E2]" : "text-[#111827] dark:text-[#DEDEDE]"}`}
                    >
                      Customer
                    </span>
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
                  <div className="flex flex-col items-center space-y-2">
                    <Truck
                      size={24}
                      className={`${formData.role === "rider" ? "text-[#0066FF] dark:text-[#4A90E2]" : "text-[#6B7280] dark:text-[#9CA3AF]"}`}
                    />
                    <span
                      className={`font-medium text-sm ${formData.role === "rider" ? "text-[#0066FF] dark:text-[#4A90E2]" : "text-[#111827] dark:text-[#DEDEDE]"}`}
                    >
                      Rider
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <UserCheck
                    size={16}
                    className="text-[#6B7280] dark:text-[#9CA3AF]"
                  />
                </div>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full h-12 pl-10 pr-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Mail
                    size={16}
                    className="text-[#6B7280] dark:text-[#9CA3AF]"
                  />
                </div>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 pl-10 pr-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Phone
                    size={16}
                    className="text-[#6B7280] dark:text-[#9CA3AF]"
                  />
                </div>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+234 XXX XXX XXXX"
                  className="w-full h-12 pl-10 pr-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock
                    size={16}
                    className="text-[#6B7280] dark:text-[#9CA3AF]"
                  />
                </div>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Create a password"
                  className="w-full h-12 pl-10 pr-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#111827] dark:text-[#DEDEDE]">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock
                    size={16}
                    className="text-[#6B7280] dark:text-[#9CA3AF]"
                  />
                </div>
                <input
                  required
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm your password"
                  className="w-full h-12 pl-10 pr-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-[#FDEBF0] dark:bg-[#3A1A1A] border border-[#F4B2C7] dark:border-[#8B2635] rounded-lg p-3">
                <p className="text-[#E5383B] dark:text-[#FF7875] text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#0066FF] dark:bg-[#4A90E2] text-white font-semibold text-sm rounded-xl hover:bg-[#0052E6] dark:hover:bg-[#3A7BC8] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                `Create ${formData.role === "customer" ? "Customer" : "Rider"} Account`
              )}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              Already have an account?{" "}
              <a
                href={`/account/signin${typeof window !== "undefined" ? window.location.search : ""}`}
                className="text-[#0066FF] dark:text-[#4A90E2] font-semibold hover:text-[#0052E6] dark:hover:text-[#3A7BC8] transition-colors duration-150"
              >
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;

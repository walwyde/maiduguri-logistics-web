import { useState } from "react";
import useAuth from "../../../utils/useAuth";
import { Truck, Mail, Lock } from "lucide-react";

function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin:
          "Couldn't start sign-in. Please try again or use a different method.",
        OAuthCallback: "Sign-in failed after redirecting. Please try again.",
        CredentialsSignin:
          "Invalid email or password. Please check your credentials.",
        AccessDenied: "You don't have permission to sign in.",
        Configuration:
          "Sign-in isn't working right now. Please try again later.",
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
            Welcome Back
          </h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
            Sign in to your Maiduguri Logistics account
          </p>
        </div>

        {/* Sign In Form */}
        <form
          noValidate
          onSubmit={onSubmit}
          className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg border border-[#F1F3F8] dark:border-gray-700 p-8"
        >
          <div className="space-y-6">
            {/* Email Field */}
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
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 pl-10 pr-4 bg-[#F9FAFB] dark:bg-[#262626] border border-[#E7EAF1] dark:border-gray-600 rounded-xl text-[#111827] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 focus:border-[#0066FF] dark:focus:border-[#4A90E2] transition-colors duration-150"
                />
              </div>
            </div>

            {/* Password Field */}
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
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#0066FF] dark:bg-[#4A90E2] text-white font-semibold text-sm rounded-xl hover:bg-[#0052E6] dark:hover:bg-[#3A7BC8] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              Don't have an account?{" "}
              <a
                href={`/account/signup${typeof window !== "undefined" ? window.location.search : ""}`}
                className="text-[#0066FF] dark:text-[#4A90E2] font-semibold hover:text-[#0052E6] dark:hover:text-[#3A7BC8] transition-colors duration-150"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignInPage;

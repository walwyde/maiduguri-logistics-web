import useAuth from "../../../utils/useAuth";
import { Truck, LogOut } from "lucide-react";

function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
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
            Sign Out
          </h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
            Are you sure you want to sign out of your account?
          </p>
        </div>

        {/* Sign Out Card */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg border border-[#F1F3F8] dark:border-gray-700 p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FDEBF0] dark:bg-[#3A1A1A] rounded-xl mb-4">
              <LogOut
                size={24}
                className="text-[#E5383B] dark:text-[#FF7875]"
                strokeWidth={2}
              />
            </div>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
              You'll need to sign in again to access your account and continue
              using Maiduguri Logistics.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSignOut}
              className="w-full h-12 bg-[#E5383B] dark:bg-[#DC2626] text-white font-semibold text-sm rounded-xl hover:bg-[#DC2626] dark:hover:bg-[#B91C1C] focus:outline-none focus:ring-2 focus:ring-[#E5383B]/20 dark:focus:ring-[#DC2626]/20 transition-colors duration-150"
            >
              Sign Out
            </button>

            <button
              onClick={() => window.history.back()}
              className="w-full h-12 bg-[#F9FAFB] dark:bg-[#262626] text-[#111827] dark:text-[#DEDEDE] font-semibold text-sm rounded-xl border border-[#E7EAF1] dark:border-gray-600 hover:bg-[#F3F4F6] dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 dark:focus:ring-[#4A90E2]/20 transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutPage;

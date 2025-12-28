
// // app/page.jsx  or  pages/index.jsx
// "use client";

// import { useEffect, useState } from "react";
// import { Truck } from "lucide-react";
// import { auth } from "../auth";   // ← This is the real auth from AnythingLLM

// export default function HomePage() {
//   const [user, setUser] = useState(null);      // null = checking, object = logged in, false = guest
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function checkAuth() {
//       try {
//         const session = await auth();        // ← This is the real session check
//         if (session?.user?.id) {
//           setUser(session.user);
//         } else {
//           setUser(false);                    // not logged in
//         }
//       } catch (err) {
//         console.error("Auth check failed", err);
//         setUser(false);
//       } finally {
//         setLoading(false);
//       }
//     }

//     checkAuth();
//   }, []);

//   // Redirect once we know the auth status
//   useEffect(() => {
//     if (loading) return; // still checking

//     if (user) {
//       // Logged in → go to dashboard
//       window.location.href = "/dashboard";
//     } else {
//       // Not logged in → go to sign-in page
//       window.location.href = "/account/signin";
//     }
//   }, [user, loading]);

//   // While checking, show nice loading screen
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#FCFDFF] to-[#F6F8FF] dark:from-[#121212] dark:to-[#0F0F0F] flex items-center justify-center font-inter">
//         <div className="text-center">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0066FF] dark:bg-[#4A90E2] rounded-2xl mb-6">
//             <Truck size={32} className="text-white" strokeWidth={2} />
//           </div>
//           <h1 className="text-2xl font-bold text-[#020814] dark:text-[#DEDEDE] mb-4">
//             Maiduguri Logistics
//           </h1>
//           <div className="w-8 h-8 border-4 border-[#0066FF] dark:border-[#4A90E2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-[#6B7280] dark:text-[#9CA3AF]">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // This will never be shown because we redirect immediately
//   return null;
// }

'use client';
import React, { useEffect, useState } from 'react';
import { 
  Truck, 
  Package, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Star,
  Smartphone,
  CheckCircle2,
  Users
} from 'lucide-react';
import Navbar from '../components/Navbar';
import useAuth from '@/utils/useAuth';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useRouter();


  useEffect(() => {
   if (auth.loading) return; // still checking
   
   if (!auth.loading && auth.user) {
     // Logged in → go to dashboard
     navigate.replace('/dashboard');
   } else {
     // Not logged in → stay on home page
     setLoading(false);
   }
  }, [auth.user, auth.loading, navigate]);

  if ( auth.loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 mx-auto animate-bounce">
            <Truck size={32} className="text-white" />
          </div>
          <p className="text-gray-400 font-medium animate-pulse">Initializing logistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFDFF]">
      <Navbar isLoggedIn={!!user} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 gradient-hero">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0066FF] rounded-full text-sm font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Serving Maiduguri & Beyond
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-[#020814] leading-[1.1] tracking-tight">
                Logistics that <span className="text-[#0066FF]">moves</span> with you.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                The most reliable doorstep delivery and logistics service in the North East. Fast, secure, and affordable.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={() => navigate.replace('/account/signin')}
                  className="w-full sm:w-auto px-8 py-4 gradient-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  Start Shipping <ArrowRight size={20} />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-colors">
                  Track Package
                </button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/id/${10+i}/64/64`} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                  </div>
                  <p className="text-gray-500 font-medium">Trusted by 10k+ users</p>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-blue-500/5 blur-3xl rounded-full"></div>
              <img 
                src="https://t4.ftcdn.net/jpg/04/57/51/59/240_F_457515935_BfzBf0vd5WZohmEUMegkUnN2JcysRyZz.jpg" 
                alt="Logistics" 
                className="relative rounded-[2rem] shadow-2xl border border-gray-100 object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-50 max-w-[240px] animate-bounce-slow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="text-green-600" size={18} />
                  </div>
                  <span className="font-bold text-sm">Delivery Successful</span>
                </div>
                <p className="text-xs text-gray-500 leading-tight">Your package has been delivered to Bolori Extension.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#020814]">Why Choose Maiduguri Logistics?</h2>
            <p className="text-lg text-gray-600">We've built a platform specifically tailored to the unique delivery needs of our region.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Smartphone className="text-blue-600" />}
              title="Easy Booking"
              description="Request a pickup in seconds using our intuitive web or mobile platform."
            />
            <FeatureCard 
              icon={<MapPin className="text-purple-600" />}
              title="Real-time Tracking"
              description="Monitor your package's journey across Maiduguri with precise GPS tracking."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-green-600" />}
              title="Secure Delivery"
              description="Our vetted riders ensure your goods reach their destination safely and intact."
            />
            <FeatureCard 
              icon={<Clock className="text-orange-600" />}
              title="Instant Express"
              description="Need it there now? Choose our express service for 60-minute deliveries."
            />
            <FeatureCard 
              icon={<Package className="text-pink-600" />}
              title="Bulk Shipping"
              description="Special rates for businesses and large volume shipments across the state."
            />
            <FeatureCard 
              icon={<Users className="text-indigo-600" />}
              title="Dedicated Support"
              description="Local support team available 24/7 to help with all your delivery inquiries."
            />
          </div>
        </div>
      </section>

      {/* CTA Section for Riders */}
      <section id="riders" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-[#020814] rounded-[3rem] p-12 lg:p-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-bold text-white">Own a Mini Truck? <br /><span className="text-[#0066FF]">Start earning today.</span></h2>
                <p className="text-gray-400 text-lg">Join the largest fleet of riders in Maiduguri. Set your own schedule, be your own boss, and earn more with every delivery.</p>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#0066FF]" /> Flexible working hours
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#0066FF]" /> Guaranteed weekly payments
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#0066FF]" /> Full insurance coverage
                  </li>
                </ul>
                <button onClick={() => navigate.push("/account/signup")} className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-colors">
                  Join as a Rider
                </button>
              </div>
              <div className="relative">
                <img 
                  src="https://234drive.com/wp-content/uploads/2025/09/image3-19.jpg" 
                  alt="Rider" 
                  className="rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white">
                  <Truck size={18} />
                </div>
                <span className="text-xl font-bold tracking-tight">Maiduguri Logistics</span>
              </div>
              <p className="text-gray-500 max-w-sm">Connecting the North East with world-class logistics technology. Fast, efficient, and built for you.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="/about" className="hover:text-blue-600">About Us</a></li>
                <li><a href="/contact" className="hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-50 flex flex-col md:row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">© 2024 Maiduguri Logistics. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-blue-600"><Smartphone size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600"><Users size={20} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 bg-white border border-gray-100 rounded-[2rem] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
      {React.cloneElement(icon , { size: 28 })}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{description}</p>
  </div>
);

export default HomePage;


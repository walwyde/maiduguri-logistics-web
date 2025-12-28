
import React from 'react';
import Link from 'next/link';
import { Truck, Menu, X } from 'lucide-react';

const Navbar = ({ isLoggedIn }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Truck size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-[#020814] tracking-tight">Maiduguri Logistics</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-[#0066FF] transition-colors">Features</Link>
            <Link href="#tracking" className="text-sm font-medium text-gray-600 hover:text-[#0066FF] transition-colors">Track Shipment</Link>
            <Link href="#riders" className="text-sm font-medium text-gray-600 hover:text-[#0066FF] transition-colors">Become a Rider</Link>
            
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-6 py-2.5 gradient-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all">
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/account/signin" className="text-sm font-semibold text-gray-700 hover:text-[#0066FF]">Login</Link>
                <Link href="/account/signin" className="px-6 py-2.5 gradient-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-8 space-y-4 shadow-xl animate-in slide-in-from-top duration-300">
          <Link href="/about" className="block text-lg font-medium text-gray-700">about</Link>
          <Link href="/dashboard" className="block text-lg font-medium text-gray-700">Track Shipment</Link>
          <Link href="/account/signup" className="block text-lg font-medium text-gray-700">Become a Rider</Link>
          <hr />
          <Link href="/account/signin" className="block text-lg font-semibold text-[#0066FF]">Login / Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

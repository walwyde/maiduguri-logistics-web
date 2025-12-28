'use client';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Truck,
  DollarSign,
  User,
  Users,
  Settings,
  LogOut,
  Shield,
  ClipboardList,
  BarChart3,
} from 'lucide-react';
import useAuth from '@/utils/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';


const customerLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/bookings', label: 'My Shipments', icon: Package },
  { to: '/book', label: 'New Booking', icon: ClipboardList },
  { to: '/profile', label: 'Profile', icon: User },
];

const riderLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/rider/jobs', label: 'Available Jobs', icon: Truck },
  { to: '/rider/deliveries', label: 'My Deliveries', icon: Package },
  { to: '/rider/earnings', label: 'Earnings', icon: DollarSign },
  { to: '/rider/profile', label: 'Profile', icon: User },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/bookings', label: 'All Bookings', icon: Package },
  { to: '/admin/riders', label: 'Riders', icon: Truck },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
    const router = useRouter();
  const location = usePathname();
  const { user, switchRole } = useAuth();

  const links = user?.role === 'admin' 
    ? adminLinks 
    : user?.role === 'rider' 
    ? riderLinks 
    : customerLinks;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Truck className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">MaidLogistics</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location === link.to || location.startsWith(`${link.to}/`);
          return (
            <Link
              key={link.to}
              href={link.to}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Demo Role Switcher */}
      {/* <div className="px-4 py-4 border-t border-border"> */}
        {/* <p className="text-xs text-muted-foreground mb-2 px-2">Demo: Switch Role</p> */}
        {/* <div className="flex gap-1">
          {(['customer', 'rider', 'admin'] ).map((role) => (
            <button
              key={role}
              onClick={() => switchRole(role)}
              className={cn(
                'flex-1 px-2 py-1.5 text-xs rounded-lg font-medium transition-colors capitalize',
                user?.role === role
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {role}
            </button>
          ))}
        </div> */}
      {/* </div> */}

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {user?.role === 'admin' ? (
              <Shield className="w-5 h-5 text-primary" />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <button
            onClick={() => router.replace('/account/logout')}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

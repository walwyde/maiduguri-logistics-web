import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';


export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen gradient-hero">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}

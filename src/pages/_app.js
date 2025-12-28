import "../styles/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "sonner";

import { AuthProvider } from "../utils/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }) {

  return (<QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Sonner />
      <TooltipProvider>
        {/* <Navbar /> */}
    <Component {...pageProps} />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>);
  
}

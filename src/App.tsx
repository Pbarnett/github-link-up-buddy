
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SmartErrorBoundary } from "@/components/ErrorBoundary";
import { useRetryQueue } from "@/utils/retryQueue";
import { useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TripNew from "./pages/TripNew";
import TripOffers from "./pages/TripOffers";
import TripOffersV2 from "./pages/TripOffersV2"; // Import the V2 component
import TripConfirm from "./pages/TripConfirm";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import DuffelTest from "./pages/DuffelTest";
import AutoBookingDashboard from "./pages/AutoBookingDashboard";
import AutoBookingNew from "./pages/AutoBookingNew";
import AuthGuard from "./components/AuthGuard";
import NotFound from "./pages/NotFound";
import TopNavigation from "./components/navigation/TopNavigation";
import Breadcrumbs from "./components/navigation/Breadcrumbs";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Global middleware component
const GlobalMiddleware = ({ children }: { children: React.ReactNode }) => {
  // Initialize retry queue
  useRetryQueue();
  
  // Initialize monitoring (already done in monitoring.ts)
  useEffect(() => {
    console.log('🚀 Parker Flight global middleware initialized');
  }, []);
  
  return <>{children}</>;
};

const App = () => {
  return (
    <SmartErrorBoundary level="global">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <GlobalMiddleware>
            <Toaster />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <BrowserRouter 
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <TopNavigation />
          <Breadcrumbs />
          <main id="main" className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                }
              />
              <Route
                path="/trip/new"
                element={
                  <AuthGuard>
                    <TripNew />
                  </AuthGuard>
                }
              />
              <Route
                path="/trip/offers"
                element={
                  <AuthGuard>
                    <TripOffers />
                  </AuthGuard>
                }
              />
              <Route
                path="/trip/confirm"
                element={
                  <AuthGuard>
                    <TripConfirm />
                  </AuthGuard>
                }
              />
              <Route
                path="/profile"
                element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                }
              />
              <Route
                path="/wallet"
                element={
                  <AuthGuard>
                    <Wallet />
                  </AuthGuard>
                }
              />
              <Route path="/trips/:tripId/v2"
                element={
                  <AuthGuard>
                    <TripOffersV2 />
                  </AuthGuard>
                }
              />
              <Route
                path="/auto-booking"
                element={
                  <AuthGuard>
                    <AutoBookingDashboard />
                  </AuthGuard>
                }
              />
              <Route
                path="/auto-booking/new"
                element={
                  <AuthGuard>
                    <AutoBookingNew />
                  </AuthGuard>
                }
              />
              {/* Duffel Flight Search - Production Ready */}
              <Route
                path="/duffel-test"
                element={
                  <AuthGuard>
                    <DuffelTest />
                  </AuthGuard>
                }
              />
              <Route
                path="/flight-search"
                element={
                  <AuthGuard>
                    <DuffelTest />
                  </AuthGuard>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </BrowserRouter>
          </GlobalMiddleware>
        </TooltipProvider>
      </QueryClientProvider>
    </SmartErrorBoundary>
  );
};

export default App;

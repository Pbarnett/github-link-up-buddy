
import Toaster from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { SmartErrorBoundary } from "./components/ErrorBoundary";
import { useRetryQueue } from "./utils/retryQueue";
import { useEffect, Suspense, lazy } from "react";
import { BusinessRulesProvider } from "./hooks/useBusinessRules";
import { PersonalizationProvider } from "./contexts/PersonalizationContext";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { ThemeProvider } from "./components/theme-provider";
// Import dev auth for easy development authentication
import "./utils/devAuth";
import "./utils/authTest";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
const TripNew = lazy(() => import("./pages/TripNew"));
const TripOffers = lazy(() => import("./pages/TripOffers"));
const TripOffersV2 = lazy(() => import("./pages/TripOffersV2"));
const TripConfirm = lazy(() => import("./pages/TripConfirm"));
const Profile = lazy(() => import("./pages/Profile"));
const Wallet = lazy(() => import("./pages/Wallet"));
const DuffelTest = lazy(() => import("./pages/DuffelTest"));
const AutoBookingDashboard = lazy(() => import("./pages/AutoBookingDashboard"));
const AutoBookingNew = lazy(() => import("./pages/AutoBookingNew"));
import { FormAnalyticsDashboard } from "./components/forms/analytics/FormAnalyticsDashboard";
import AuthGuard from "./components/AuthGuard";
import RequireAuth from "./components/auth/RequireAuth";
import NotFound from "./pages/NotFound";
import AuthDebug from "./pages/AuthDebug";
import TopNavigation from "./components/navigation/TopNavigation";
import Breadcrumbs from "./components/navigation/Breadcrumbs";
import RouteAnnouncer from "./components/RouteAnnouncer";
import AuthEvents from "./components/AuthEvents";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    },
  },
});

// Navigation wrapper to handle conditional props
const NavigationWrapper = () => {
  const location = useLocation();
  const shouldHideFindFlights = location.pathname === '/trip/new';
  
  return <TopNavigation hideFindFlights={shouldHideFindFlights} />;
};

// Breadcrumbs wrapper to conditionally hide on certain pages
const BreadcrumbsWrapper = () => {
  const location = useLocation();
  const shouldHideBreadcrumbs = 
    location.pathname === '/auto-booking' || 
    location.pathname === '/auto-booking/new' ||
    location.pathname === '/dashboard' ||
    location.pathname === '/search' ||
    location.pathname === '/trip/new' ||
    location.pathname.includes('/trips/') && location.pathname.includes('/v2'); // Hide on flight results pages
  
  if (shouldHideBreadcrumbs) {
    return null;
  }
  
  return <Breadcrumbs />;
};

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

// Personalization wrapper to provide user context
const PersonalizationWrapper = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useCurrentUser();
  
  return (
    <PersonalizationProvider userId={userId || undefined}>
      {children}
    </PersonalizationProvider>
  );
};

const App = () => {
  return (
    <SmartErrorBoundary level="global">
      <QueryClientProvider client={queryClient}>
        <BusinessRulesProvider>
          <ThemeProvider>
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
              <PersonalizationWrapper>
                <NavigationWrapper />
                <BreadcrumbsWrapper />
                <div id="sr-route-announcer" aria-live="polite" className="sr-only" />
                <main id="main" className="flex-1 overflow-auto" tabIndex={-1}>
                <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading…</div>}>
                <AuthEvents />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route
                    path="/dashboard"
                    element={
<RequireAuth reason="generic">
                        <AutoBookingDashboard />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/trip/new"
                    element={<Navigate to="/auto-booking/new" replace />}
                  />
                  <Route
                    path="/search"
                    element={<TripNew />}
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
<RequireAuth reason="generic">
                        <Profile />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/wallet"
                    element={
<RequireAuth reason="generic">
                        <Wallet />
                      </RequireAuth>
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
                    element={<AutoBookingNew />}
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
                  <Route
                    path="/form-analytics"
                    element={
                      <AuthGuard>
                        <FormAnalyticsDashboard />
                      </AuthGuard>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                  <Route path="/debug/auth" element={<AuthGuard><AuthDebug /></AuthGuard>} />
                </Routes>
                </Suspense>
                </main>
              </PersonalizationWrapper>
              <RouteAnnouncer />
            </BrowserRouter>
            </GlobalMiddleware>
          </TooltipProvider>
          </ThemeProvider>
        </BusinessRulesProvider>
      </QueryClientProvider>
    </SmartErrorBoundary>
  );
};

export default App;

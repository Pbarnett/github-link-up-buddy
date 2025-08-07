import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SmartErrorBoundary } from '@/components/ErrorBoundary';
import { PersonalizationProvider } from '@/contexts/PersonalizationContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRetryQueue } from '@/utils/retryQueue';
import '@/utils/devAuth';
import '@/utils/authTest';
import SecureFlightBooking from '@/components/booking/SecureFlightBooking';
import RadixThemeProvider from './components/providers/RadixThemeProvider';
import { BusinessRulesProvider } from './hooks/useBusinessRules';
import FormAnalyticsDashboard from './components/forms/analytics/FormAnalyticsDashboard';
import AuthGuard from './components/AuthGuard';
import Breadcrumbs from './components/navigation/Breadcrumbs';
import TopNavigation from './components/navigation/TopNavigation';
import Index from './pages/Index';
import Login from './pages/Login';
import TripNew from './pages/TripNew';
import TripOffers from './pages/TripOffers';
import TripOffersV2 from './pages/TripOffersV2';
import TripConfirm from './pages/TripConfirm';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import DuffelTest from './pages/DuffelTest';
import AutoBookingDashboard from './pages/AutoBookingDashboard';
import AutoBookingNew from './pages/AutoBookingNew';
import AdminDashboard from './pages/AdminDashboard';
import DynamicFormTest from './pages/DynamicFormTest';
import SimpleTestBooking from './pages/SimpleTestBooking';
import NotFound from './pages/NotFound';

type ReactNode = React.ReactNode;
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
    location.pathname === '/admin' ||
    location.pathname === '/search' ||
    location.pathname === '/trip/new' ||
    (location.pathname.includes('/trips/') &&
      location.pathname.includes('/v2')); // Hide on flight results pages

  if (shouldHideBreadcrumbs) {
    return null;
  }

  return <Breadcrumbs />;
};

// Global middleware component
const GlobalMiddleware = ({ children }: { children: ReactNode }) => {
  // Initialize retry queue
  useRetryQueue();

  // Initialize monitoring (already done in monitoring.ts)
  useEffect(() => {
    console.log('🚀 Parker Flight global middleware initialized');
  }, []);

  return <>{children}</>;
};

// Personalization wrapper to provide user context
const PersonalizationWrapper = ({ children }: { children: ReactNode }) => {
  const { userId } = useCurrentUser();
  return (
    <PersonalizationProvider userId={userId || undefined}>
      {children}
    </PersonalizationProvider>
  );
};

const App = () => {
  return (
    <RadixThemeProvider>
      <SmartErrorBoundary level="global">
        <QueryClientProvider client={queryClient}>
          <BusinessRulesProvider>
            <TooltipProvider>
              <GlobalMiddleware>
                <Toaster />
                <a href="#main" className="skip-link">
                  Skip to content
                </a>
                <BrowserRouter
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                  }}
                >
                  <PersonalizationWrapper>
                    <WalletProvider>
                      <NavigationWrapper />
                      <BreadcrumbsWrapper />
                      <main id="main" className="flex-1 overflow-auto">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/login" element={<Login />} />
                          <Route
                            path="/auth/callback"
                            element={<Navigate to="/dashboard" replace />}
                          />
                          <Route
                            path="/dashboard"
                            element={
                              <AuthGuard>
                                <AutoBookingDashboard />
                              </AuthGuard>
                            }
                          />
                          <Route
                            path="/trip/new"
                            element={
                              <Navigate to="/auto-booking/new" replace />
                            }
                          />
                          <Route
                            path="/search"
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
                          <Route
                            path="/trips/:tripId/v2"
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
                          <Route
                            path="/form-analytics"
                            element={
                              <AuthGuard>
                                <FormAnalyticsDashboard />
                              </AuthGuard>
                            }
                          />
                          <Route
                            path="/admin"
                            element={
                              <AuthGuard>
                                <AdminDashboard />
                              </AuthGuard>
                            }
                          />
                          <Route
                            path="/forms/test"
                            element={
                              <AuthGuard>
                                <DynamicFormTest />
                              </AuthGuard>
                            }
                          />
                          <Route
                            path="/booking"
                            element={
                              <AuthGuard>
                                <SecureFlightBooking />
                              </AuthGuard>
                            }
                          />
                          {/* Test-only route for E2E testing without auth */}
                          <Route
                            path="/test-booking"
                            element={
                              process.env.NODE_ENV === 'development' ? (
                                <SimpleTestBooking />
                              ) : (
                                <Navigate to="/booking" replace />
                              )
                            }
                          />
                          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </WalletProvider>
                  </PersonalizationWrapper>
                </BrowserRouter>
              </GlobalMiddleware>
            </TooltipProvider>
          </BusinessRulesProvider>
        </QueryClientProvider>
      </SmartErrorBoundary>
    </RadixThemeProvider>
  );
};

export default App;

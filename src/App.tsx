
import React, { lazy, Suspense } from "react"; // Added lazy and Suspense
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index"; // Eagerly loaded
// import Login from "./pages/Login"; // Changed to lazy
// import Dashboard from "./pages/Dashboard"; // Changed to lazy
// import TripNew from "./pages/TripNew"; // Changed to lazy
// import TripOffers from "./pages/TripOffers"; // Changed to lazy
// import TripConfirm from "./pages/TripConfirm"; // Changed to lazy
// import Profile from "./pages/Profile"; // Changed to lazy
// import Wallet from "./pages/Wallet"; // Changed to lazy
import AuthGuard from "./components/AuthGuard";
import NotFound from "./pages/NotFound"; // Eagerly loaded

// Lazy load page components
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TripNew = lazy(() => import("./pages/TripNew"));
const TripOffers = lazy(() => import("./pages/TripOffers"));
const TripConfirm = lazy(() => import("./pages/TripConfirm"));
const Profile = lazy(() => import("./pages/Profile"));
const Wallet = lazy(() => import("./pages/Wallet"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Suspense fallback={<div>Loading page...</div>}> {/* Suspense wrapper added */}
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

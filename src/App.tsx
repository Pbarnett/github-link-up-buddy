
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthGuard from "./components/AuthGuard";
import NotFound from "./pages/NotFound";

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
          <Suspense fallback={<div>Loading page...</div>}>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

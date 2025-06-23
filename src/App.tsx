
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TripNew from "./pages/TripNew";
import TripOffers from "./pages/TripOffers";
import TripOffersV2 from "./pages/TripOffersV2"; // Import the V2 component
import TripConfirm from "./pages/TripConfirm";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import AuthGuard from "./components/AuthGuard";
import NotFound from "./pages/NotFound";
import TopNavigation from "./components/navigation/TopNavigation";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
              <Route
                path="/trips/:tripId/v2"
                element={
                  <AuthGuard>
                    <TripOffersV2 />
                  </AuthGuard>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

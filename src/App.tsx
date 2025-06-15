
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TripNew from "./pages/TripNew";
import TripOffers from "./pages/TripOffers";
import TripConfirm from "./pages/TripConfirm";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import AuthGuard from "./components/AuthGuard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <BrowserRouter>
            <div id="main">
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
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

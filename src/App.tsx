
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TripNew from "./pages/TripNew";
import TripOffers from "./pages/TripOffers";
import TripConfirm from "./pages/TripConfirm";
import TripAutoBooking from "./pages/TripAutoBooking";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";
import BookingModeSelector from "./components/trip/BookingModeSelector";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Auth-protected routes */}
            <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
            <Route path="/wallet" element={<AuthGuard><Wallet /></AuthGuard>} />
            
            {/* Trip routes */}
            <Route path="/trip/mode" element={<AuthGuard><BookingModeSelector /></AuthGuard>} />
            <Route path="/trip/new" element={<AuthGuard><TripNew /></AuthGuard>} />
            <Route path="/trip/auto-booking" element={<AuthGuard><TripAutoBooking /></AuthGuard>} />
            <Route path="/trip/offers" element={<AuthGuard><TripOffers /></AuthGuard>} />
            <Route path="/trip/confirm" element={<AuthGuard><TripConfirm /></AuthGuard>} />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;

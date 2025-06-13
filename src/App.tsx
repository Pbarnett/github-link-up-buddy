import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import SkipLink from "@/components/ui/skip-link";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <SkipLink />
          <div className="min-h-screen bg-background font-sans antialiased">
            <main id="main" className="focus:outline-none" tabIndex={-1}>
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
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

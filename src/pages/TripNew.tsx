
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Settings, ArrowLeft } from "lucide-react";
import TripRequestForm from "@/components/trip/TripRequestForm";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect, useRef, useState } from "react";

const TripNew = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') as 'manual' | 'auto' | null;
  const { trackCTAClick, trackCardView } = useAnalytics();
  const autoCardRef = useRef<HTMLDivElement>(null);
  const manualCardRef = useRef<HTMLDivElement>(null);

  // Set up card view tracking
  useEffect(() => {
    if (autoCardRef.current && manualCardRef.current && !mode) {
      trackCardView(autoCardRef.current, 'auto');
      trackCardView(manualCardRef.current, 'manual');
    }
  }, [mode, trackCardView]);

  // If no mode is selected, show the mode selection screen
  if (!mode) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with back link */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Let Parker Flight do the booking
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Tell us your ideal dates and max price once—we'll book automatically when a deal appears.
              </p>
              <p className="text-sm text-gray-500">
                Sleep on it—wake up to a booked ticket that never busts your budget.
              </p>
            </div>
          </div>

          {/* Mode Selection Cards - Auto-Booking First for Primary Path */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Auto-Booking Card - Primary Path */}
            <Card 
              ref={autoCardRef}
              className="relative overflow-hidden border-2 border-blue-200 hover:border-blue-300 transition-all cursor-pointer group card-primary transform hover:scale-[1.02]"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Settings className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">Set up Auto-Booking</CardTitle>
                    <Badge variant="success" className="text-xs">Most popular</Badge>
                  </div>
                </div>
                <CardDescription className="text-base">
                  We search fares every 15 min, 24/7 and book automatically when deals match your criteria.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Lock in your max—pay ≤ what you decide
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    We search fares every 15 min, 24/7
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Cancel or tweak anytime in one click
                  </li>
                </ul>
                <Button 
                  id="auto-booking-primary"
                  onClick={() => {
                    trackCTAClick({ type: 'auto', cardPosition: 'left', timestamp: Date.now() });
                    navigate('/trip/new?mode=auto');
                  }}
                  style={{ backgroundColor: 'var(--c-btn-primary)' }}
                  className="w-full text-white border-none font-medium py-3 hover:opacity-90"
                >
                  Start Auto-Booking
                </Button>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  7,412 trips auto-booked in the last 30 days
                </p>
              </CardContent>
            </Card>

            {/* Manual Search Card - Secondary Path */}
            <Card 
              ref={manualCardRef}
              className="relative overflow-hidden border border-gray-200 hover:border-gray-300 transition-all cursor-pointer group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                    <Search className="h-6 w-6 text-gray-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-700">Manual Search</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-600">
                  Just need a seat right now? Do a one-time search instead.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                    See real-time flight availability
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                    Compare prices across airlines
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                    Book immediately
                  </li>
                </ul>
                <Button 
                  variant="outline"
                  onClick={() => {
                    trackCTAClick({ type: 'manual', cardPosition: 'right', timestamp: Date.now() });
                    navigate('/trip/new?mode=manual');
                  }}
                  style={{ 
                    backgroundColor: 'var(--c-btn-secondary)',
                    color: 'var(--c-btn-primary)',
                    borderColor: 'var(--c-btn-secondary-border)'
                  }}
                  className="w-full font-medium py-3"
                >
                  Search Now
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>You can always change between modes later from your dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  // If mode is selected, show the appropriate form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <TripRequestForm mode={mode} />
    </div>
  );
};

export default TripNew;

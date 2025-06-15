
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Settings, ArrowLeft, Shield, Clock, DollarSign, Zap, CheckCircle, Plane } from "lucide-react";
import TripRequestForm from "@/components/trip/TripRequestForm";

const TripNew = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') as 'manual' | 'auto' | null;

  // If no mode is selected, show the mode selection screen
  if (!mode) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-screen-lg mx-auto" style={{ width: 'clamp(640px, 80%, 1100px)' }}>
          {/* Header with back link */}
          <div className="mb-12">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1"
              data-analytics="back_to_dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Pick how we'll book for you
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Choose your preferred booking approach
              </p>
              <p className="text-sm text-muted-foreground">
                You can switch later from your dashboard
              </p>
            </div>
          </div>

          {/* Mode Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8" data-analytics="mode_choice">
            {/* Manual Search Card */}
            <Card className="relative overflow-hidden border-2 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer group focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4 mb-3">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/15 transition-colors">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                      Search Current Flights
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600 leading-relaxed">
                      Find and book flights available right now. Perfect when you need to travel soon or want to see all current options.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0" id="current-benefits">
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-primary border-primary/20">
                    <Zap className="h-3 w-3" />
                    Real-time prices
                  </Badge>
                  <Badge variant="secondary" className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-primary border-primary/20">
                    <CheckCircle className="h-3 w-3" />
                    Compare airlines
                  </Badge>
                  <Badge variant="secondary" className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-primary border-primary/20">
                    <Clock className="h-3 w-3" />
                    Book immediately
                  </Badge>
                </div>
                <Button 
                  onClick={() => navigate('/trip/new?mode=manual')}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 h-11 transform hover:scale-[1.03] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  data-analytics="cta_click"
                  aria-describedby="current-benefits"
                >
                  Search Current Flights
                </Button>
              </CardContent>
            </Card>

            {/* Auto-Booking Card */}
            <Card className="relative overflow-hidden border-2 hover:border-teal-500 hover:shadow-lg transition-all duration-200 cursor-pointer group focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4 mb-3">
                  <div className="p-3 bg-teal-50 rounded-xl group-hover:bg-teal-100 transition-colors">
                    <Settings className="h-8 w-8 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                      Set Up Auto-Booking
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600 leading-relaxed">
                      Set your travel criteria and we'll automatically book when we find great deals that match your preferences.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0" id="auto-benefits">
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 border-teal-200">
                    <Plane className="h-3 w-3" />
                    Monitor automatically
                  </Badge>
                  <Badge variant="secondary" className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 border-teal-200">
                    <CheckCircle className="h-3 w-3" />
                    Smart booking
                  </Badge>
                  <Badge variant="secondary" className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 border-teal-200">
                    <DollarSign className="h-3 w-3" />
                    Price limits
                  </Badge>
                </div>
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/trip/new?mode=auto')}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 h-11 transform hover:scale-[1.03] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    data-analytics="cta_click"
                    aria-describedby="auto-benefits"
                  >
                    Set Up Auto-Booking
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Backed by Stripe • Safe & secure</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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

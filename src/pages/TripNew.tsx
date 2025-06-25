
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Settings, ArrowLeft } from "lucide-react";
import TripRequestForm from "@/components/trip/TripRequestForm";

const TripNew = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') as 'manual' | 'auto' | null;

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
                Find Your Perfect Flight
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Choose how you'd like Parker Flight to help you
              </p>
              <p className="text-sm text-gray-500">
                Both options search the same flights - the difference is when you book
              </p>
            </div>
          </div>

          {/* Mode Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Manual Search Card */}
            <Card className="relative overflow-hidden border-2 hover:border-blue-300 transition-all cursor-pointer group">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Search className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Search Current Flights</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Find and book flights available right now. Perfect when you need to travel soon or want to see all current options.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    See real-time flight availability
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Compare prices across airlines
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Book immediately
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/trip/new?mode=manual')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                >
                  Search Current Flights
                </Button>
              </CardContent>
            </Card>

            {/* Auto-Booking Card */}
            <Card className="relative overflow-hidden border-2 hover:border-green-300 transition-all cursor-pointer group">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Settings className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Set Up Auto-Booking</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Set your travel criteria and we'll automatically book when we find great deals that match your preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    Monitor prices automatically
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    Book when criteria are met
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    Set maximum price limits
                  </li>
                </ul>
                  <Button 
                    onClick={() => navigate('/trip/new?mode=auto')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
                  >
                    Start Auto-Booking
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

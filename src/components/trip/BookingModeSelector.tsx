
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Search, Zap, ArrowRight } from "lucide-react";

const BookingModeSelector = () => {
  const navigate = useNavigate();
  const { userId } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleModeSelection = async (mode: 'manual' | 'auto') => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Update user's trip_mode preference
      const { error } = await supabase
        .from("profiles")
        .update({ trip_mode: mode })
        .eq("id", userId);

      if (error) throw error;

      // Navigate to appropriate flow
      if (mode === 'manual') {
        navigate("/trip/new");
      } else {
        navigate("/trip/auto-booking");
      }
    } catch (error) {
      console.error("Error updating trip mode:", error);
      toast({
        title: "Error",
        description: "Failed to save your preference. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto pt-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            How would you like to book your trip?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your preferred booking experience. You can change this anytime in your settings.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Manual Booking Card */}
          <Card className="relative hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Manual Search</CardTitle>
              <CardDescription className="text-sm">
                Browse and compare flight options yourself
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• See all available flight options</li>
                <li>• Compare prices and airlines</li>
                <li>• Full control over your selection</li>
                <li>• Book when you're ready</li>
              </ul>
              <Button
                onClick={() => handleModeSelection('manual')}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                Continue with Manual Search
              </Button>
            </CardContent>
          </Card>

          {/* Auto-Booking Card */}
          <Card className="relative hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Auto-Booking</CardTitle>
              <CardDescription className="text-sm">
                Let us automatically book the best deals for you
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Automatic booking when deals match your criteria</li>
                <li>• Set your budget and preferences once</li>
                <li>• Never miss a great deal</li>
                <li>• Hands-off travel planning</li>
              </ul>
              <Button
                onClick={() => handleModeSelection('auto')}
                disabled={isLoading}
                variant="outline"
                className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Setup Auto-Booking
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-gray-500 hover:text-gray-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingModeSelector;

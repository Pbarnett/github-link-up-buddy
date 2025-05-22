
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TripOfferCard from "@/components/trip/TripOfferCard";
import TripOffersLoading from "@/components/trip/TripOffersLoading";
import TripErrorCard from "@/components/trip/TripErrorCard";
import { Offer } from "@/services/tripOffersService";
import { toast } from "@/components/ui/use-toast";
import { format as formatDate } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

interface TripDetails {
  earliestDeparture: string;
  latestDeparture: string;
  min_duration: number;
  max_duration: number;
  budget: number;
}

const TripOffers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  
  // Get trip ID from URL query parameter
  const tripId = searchParams.get("id");

  const fetchOffers = async (id: string) => {
    try {
      // Fetch the flight offers
      const { data: offersData, error: offersError } = await supabase
        .from("flight_offers")
        .select("*")
        .eq("trip_request_id", id)
        .order("price", { ascending: true });
        
      if (offersError) {
        console.error("Error fetching flight offers:", offersError);
        toast({
          title: "Error loading offers",
          description: "We couldn't load flight offers. Please try again.",
          variant: "destructive",
        });
        return [];
      }
      
      if (offersData && offersData.length > 0) {
        // Map the Supabase data to the Offer interface
        const formattedOffers: Offer[] = offersData.map(offer => ({
          id: offer.id,
          airline: offer.airline,
          flight_number: offer.flight_number,
          departure_date: offer.departure_date,
          departure_time: offer.departure_time,
          return_date: offer.return_date,
          return_time: offer.return_time,
          duration: offer.duration,
          price: Number(offer.price) // Ensure price is a number
        }));
        
        return formattedOffers;
      }
      
      return [];
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  // Function to refresh offers
  const refreshOffers = async () => {
    if (!tripId) return;
    
    setIsRefreshing(true);
    try {
      // Invoke the flight-search edge function for this trip
      const { data, error } = await supabase.functions.invoke("flight-search", {
        body: { tripRequestId: tripId }
      });
      
      if (error) {
        console.error("Error refreshing offers:", error);
        toast({
          title: "Error refreshing offers",
          description: "We couldn't refresh the flight offers. Please try again.",
          variant: "destructive",
        });
      } else {
        // Fetch the updated offers
        const updatedOffers = await fetchOffers(tripId);
        setOffers(updatedOffers);
        
        toast({
          title: "Offers refreshed",
          description: `Found ${updatedOffers.length} flight offers for your trip.`,
        });
      }
    } catch (error) {
      console.error("Error in refresh:", error);
      toast({
        title: "Error refreshing offers",
        description: "We couldn't refresh the flight offers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch trip details if needed
  const fetchTripDetails = async (id: string) => {
    // Only fetch if not already available from state
    if (location.state?.tripDetails) {
      setTripDetails(location.state.tripDetails);
      return;
    }
    
    // Fetch from database
    try {
      const { data: tripData, error: tripError } = await supabase
        .from("trip_requests")
        .select("*")
        .eq("id", id)
        .single();
        
      if (tripError) {
        console.error("Error fetching trip details:", tripError);
        throw new Error("Could not fetch trip details");
      }
      
      if (tripData) {
        setTripDetails({
          earliestDeparture: tripData.earliest_departure,
          latestDeparture: tripData.latest_departure,
          min_duration: tripData.min_duration,
          max_duration: tripData.max_duration,
          budget: tripData.budget
        });
      }
    } catch (error) {
      console.error("Error fetching trip details:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!tripId) {
      setHasError(true);
      return;
    }

    // ❗️ 1) Invoke the flight-search Edge Function on mount
    ;(async () => {
      try {
        await supabase.functions.invoke("flight-search", {
          body: { tripRequestId: tripId }
        });
      } catch (invokeErr) {
        console.error("Error invoking flight-search on load:", invokeErr);
      }
    })();

    // ❗️ 2) Then fetch whatever offers have been written
    (async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        // Get trip details first
        await fetchTripDetails(tripId);
        
        // Then get offers
        const offersData = await fetchOffers(tripId);
        setOffers(offersData);
      } catch (loadErr) {
        console.error("Error loading offers:", loadErr);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [tripId]);

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
        <Card className="w-full max-w-5xl mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Trip Offers</CardTitle>
            <CardDescription>
              There was an error loading the offers. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/trip/new")}>
              Create New Trip
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      {/* Trip Summary Card */}
      {tripDetails && (
        <Card className="w-full max-w-5xl mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Trip Summary</CardTitle>
            <CardDescription>Your trip request details</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Travel Window</p>
              <p>
                {tripDetails.earliestDeparture ? formatDate(new Date(tripDetails.earliestDeparture), 'MMM d, yyyy') : 'Not specified'} - {tripDetails.latestDeparture ? formatDate(new Date(tripDetails.latestDeparture), 'MMM d, yyyy') : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p>{tripDetails.min_duration}–{tripDetails.max_duration} days</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Budget</p>
              <p>${tripDetails.budget}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offers Header Card */}
      <Card className="w-full max-w-5xl mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Trip Offers</CardTitle>
            <CardDescription>
              {isLoading
                ? "Loading available offers for your trip..."
                : `${offers.length} offers found for your trip`}
            </CardDescription>
          </div>
          <Button 
            onClick={refreshOffers} 
            disabled={isRefreshing || isLoading}
            className="ml-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Offers'}
          </Button>
        </CardHeader>
      </Card>

      {isLoading ? (
        <TripOffersLoading />
      ) : (
        <div className="w-full max-w-5xl space-y-6">
          {offers.length > 0 ? (
            offers.map((offer) => (
              <TripOfferCard key={offer.id} offer={offer} />
            ))
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500">No offers found. Try adjusting your trip criteria or click Refresh Offers.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default TripOffers;

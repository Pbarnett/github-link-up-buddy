
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Offer } from "@/services/tripOffersService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { format as formatDate } from "date-fns";
import TripOfferCard from "@/components/trip/TripOfferCard";
import TripOffersLoading from "@/components/trip/TripOffersLoading";
import TripErrorCard from "@/components/trip/TripErrorCard";

interface TripDetails {
  earliest_departure: string;
  latest_departure: string;
  min_duration: number;
  max_duration: number;
  budget: number;
}

export default function TripOffers() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("id");
  const location = useLocation();
  const navigate = useNavigate();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [ignoreFilter, setIgnoreFilter] = useState(false);
  const [usedRelaxedCriteria, setUsedRelaxedCriteria] = useState(false);

  // Function to validate that offers meet duration requirements
  const validateOfferDuration = (offer: Offer, minDuration: number, maxDuration: number): boolean => {
    if (!offer.departure_date || !offer.return_date) return false;
    
    const departDate = new Date(offer.departure_date);
    const returnDate = new Date(offer.return_date);
    const tripDays = Math.round((returnDate.getTime() - departDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Match the same validation logic used in the edge function
    return tripDays >= minDuration && tripDays <= maxDuration;
  };

  const loadOffers = async (overrideFilter = false, relaxCriteria = false) => {
    console.log("[flight-search-ui] Loading offers with overrideFilter =", overrideFilter, "relaxCriteria =", relaxCriteria);
    setIsLoading(true);
    setHasError(false);
    
    try {
      if (!tripId) {
        setHasError(true);
        setErrorMessage("No trip ID provided");
        setIsLoading(false);
        return;
      }

      // Set state for tracking if we're using relaxed criteria
      if (relaxCriteria) {
        setUsedRelaxedCriteria(true);
      }

      // 1) Invoke the edge function - this MUST happen first
      console.log("[flight-search-ui] about to invoke flight-search edge function");
      const { data: invokeData, error: invokeError } =
        await supabase.functions.invoke("flight-search", {
          body: { 
            tripRequestId: tripId,
            relaxedCriteria: relaxCriteria  // Pass this flag to the edge function
          },
        });
        
      console.log("[flight-search-ui] invoke result:", { data: invokeData, error: invokeError });
      if (invokeError) throw invokeError;

      if (relaxCriteria) {
        toast({
          title: "Search with relaxed criteria",
          description: "Finding flights with more flexible duration and budget constraints.",
        });
      }

      // 2) Fetch trip details (if not in location.state)
      let tripData;
      if (location.state?.tripDetails) {
        console.log("[flight-search-ui] using trip details from state");
        tripData = location.state.tripDetails;
        setTripDetails(location.state.tripDetails);
      } else {
        console.log("[flight-search-ui] fetching trip details");
        const { data: fetchedTripData, error: tripError } = await supabase
          .from("trip_requests")
          .select("*")
          .eq("id", tripId)
          .single();
        
        if (tripError || !fetchedTripData) throw tripError || new Error("No trip data");
        tripData = fetchedTripData;
        setTripDetails({
          earliest_departure: fetchedTripData.earliest_departure,
          latest_departure: fetchedTripData.latest_departure,
          min_duration: fetchedTripData.min_duration,
          max_duration: fetchedTripData.max_duration,
          budget: fetchedTripData.budget,
        });
      }

      // 3) Fetch the newly-written flight_offers
      console.log("[flight-search-ui] querying flight_offers for trip:", tripId);
      const { data: rows, error: fetchError } = await supabase
        .from("flight_offers")
        .select("*")
        .eq("trip_request_id", tripId)
        .order("price");
      
      if (fetchError) throw fetchError;
      
      console.log("[flight-search-ui] rows fetched:", rows?.length, rows);
      
      if (!rows || rows.length === 0) {
        console.warn("[flight-search-ui] No offers found at all");
        toast({
          title: "No flight offers found",
          description: "Try relaxing your search criteria or refreshing.",
          variant: "destructive",
        });
        setOffers([]);
        return;
      }
      
      // Apply client-side duration filter as a safety net
      // Skip it if we're in override mode
      if (!overrideFilter && tripData) {
        const validOffers = rows.filter(offer => 
          validateOfferDuration(offer, tripData.min_duration, tripData.max_duration)
        );
        
        if (validOffers.length < rows.length) {
          console.warn(
            `[flight-search-ui] Filtered out ${rows.length - validOffers.length} offers that didn't meet duration criteria`
          );
          
          toast({
            title: "Duration filter applied",
            description: `Found ${rows.length} offers, but only ${validOffers.length} match your ${tripData.min_duration}-${tripData.max_duration} day trip duration requirements.`,
            variant: "default",
          });
        }
        
        setOffers(validOffers);
        
        if (validOffers.length === 0) {
          // No offers were found that match our criteria
          toast({
            title: "Duration filter applied",
            description: `Found ${rows.length} offers, but none match your ${tripData.min_duration}-${tripData.max_duration} day trip duration requirements.`,
            variant: "destructive",
          });
        }
      } else {
        // No filter in override mode
        setOffers(rows);
        
        if (overrideFilter) {
          toast({
            title: "Search without duration filter",
            description: `Showing all ${rows.length} available offers regardless of trip duration.`,
          });
        }
      }
    } catch (err: any) {
      console.error("[flight-search-ui] error in load flow:", err);
      setHasError(true);
      setErrorMessage(err.message || "Something went wrong loading offers");
      toast({
        title: "Error loading offers",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOffers(ignoreFilter);
  }, [tripId, ignoreFilter]);

  const refreshOffers = async () => {
    if (!tripId) return;
    setIsRefreshing(true);
    try {
      await loadOffers(ignoreFilter);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleOverrideSearch = () => {
    setIgnoreFilter(true);
    toast({
      title: "Searching without duration filter",
      description: "Finding all available flights regardless of trip duration...",
    });
  };
  
  const handleRelaxCriteria = async () => {
    if (!tripId) return;
    setIsRefreshing(true);
    try {
      // Call loadOffers with the relaxCriteria flag to trigger server-side relaxed search
      await loadOffers(false, true);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (hasError) {
    return (
      <TripErrorCard 
        message={errorMessage} 
        onOverrideSearch={handleOverrideSearch} 
        showOverrideButton={!ignoreFilter && errorMessage.toLowerCase().includes("no offers")}
        onRelaxCriteria={handleRelaxCriteria}
        showRelaxButton={!usedRelaxedCriteria && errorMessage.toLowerCase().includes("no offers")}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      {/* Trip Summary Card */}
      {tripDetails && (
        <Card className="w-full max-w-5xl mb-6">
          <CardHeader>
            <CardTitle>Your trip request details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Travel Window</p>
              <p>
                {formatDate(new Date(tripDetails.earliest_departure), "MMM d, yyyy")} –{" "}
                {formatDate(new Date(tripDetails.latest_departure), "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p>
                {tripDetails.min_duration}–{tripDetails.max_duration} days
                {ignoreFilter && " (filter disabled)"}
                {usedRelaxedCriteria && " (using relaxed criteria)"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Budget</p>
              <p>${tripDetails.budget}{usedRelaxedCriteria && " (up to +20% with relaxed criteria)"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offers Header */}
      <Card className="w-full max-w-5xl mb-6">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Trip Offers</CardTitle>
            <CardDescription>
              {isLoading
                ? "Loading offers…"
                : `${offers.length} offers found for your trip`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {!usedRelaxedCriteria && (
              <Button 
                variant="outline" 
                onClick={handleRelaxCriteria}
                disabled={isRefreshing || isLoading}
              >
                Try Relaxed Criteria
              </Button>
            )}
            {!ignoreFilter && (
              <Button 
                variant="outline" 
                onClick={handleOverrideSearch} 
                disabled={isRefreshing || isLoading}
              >
                Search Any Duration
              </Button>
            )}
            <Button 
              onClick={refreshOffers} 
              disabled={isRefreshing || isLoading}
            >
              {isRefreshing ? "Refreshing..." : "Refresh Offers"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <TripOffersLoading />
      ) : (
        <div className="w-full max-w-5xl space-y-6">
          {offers.length > 0 ? (
            offers.map((offer) => <TripOfferCard key={offer.id} offer={offer} />)
          ) : (
            <Card className="p-6 text-center">
              <p className="mb-4">No offers found that match your criteria.</p>
              <p className="text-sm text-gray-500">
                {usedRelaxedCriteria 
                  ? "We tried with relaxed criteria but still couldn't find any offers. Try adjusting your destination or dates."
                  : ignoreFilter 
                    ? "Try adjusting your budget or destination, or click Refresh Offers."
                    : "Try one of the search options above or adjust your trip criteria."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                {!usedRelaxedCriteria && (
                  <Button 
                    onClick={handleRelaxCriteria} 
                    variant="secondary"
                  >
                    Try Relaxed Criteria
                  </Button>
                )}
                {!ignoreFilter && (
                  <Button 
                    onClick={handleOverrideSearch}
                  >
                    Search Any Duration
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}


import React, { useEffect, useState, useMemo } from "react";
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

// Simple in-memory cache for search results
const searchCache = new Map<string, { offers: Offer[], timestamp: number, tripDetails: TripDetails }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);

  // Cache key for this search
  const cacheKey = useMemo(() => {
    return `${tripId}-${ignoreFilter}-${usedRelaxedCriteria}`;
  }, [tripId, ignoreFilter, usedRelaxedCriteria]);

  // Function to validate that offers meet duration requirements
  const validateOfferDuration = (offer: Offer, minDuration: number, maxDuration: number): boolean => {
    if (!offer.departure_date || !offer.return_date) return false;
    
    const departDate = new Date(offer.departure_date);
    const returnDate = new Date(offer.return_date);
    const tripDays = Math.round((returnDate.getTime() - departDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return tripDays >= minDuration && tripDays <= maxDuration;
  };
const loadOffers = async (
  currentPage = 0,
  overrideFilter = false,
  relaxCriteria = false,
  useCache = true
) => {
  console.log(
    "[TripOffers] Loading offers | page:",
    currentPage,
    "overrideFilter:",
    overrideFilter,
    "relaxCriteria:",
    relaxCriteria
  );

  // 1) Try cache first (unless explicitly refreshing)
  if (useCache && !isRefreshing) {
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("[TripOffers] Using cached results");
      setOffers(cached.offers);
      setTripDetails(cached.tripDetails);
      setIsLoading(false);
      return;
    }
  }

  // 2) Kick off loading
  setIsLoading(true);
  setHasError(false);

  try {
    if (!tripId) {
      setHasError(true);
      setErrorMessage("No trip ID provided");
      return;
    }

    if (relaxCriteria) {
      setUsedRelaxedCriteria(true);
    }

    console.log("[TripOffers] Starting parallel requests");

    // 3) Fetch trip details (or use state) + invoke flight-search in parallel
    const [tripDetailsRes, flightSearchRes] = await Promise.all([
      location.state?.tripDetails
        ? Promise.resolve({ data: location.state.tripDetails })
        : supabase
            .from("trip_requests")
            .select("*")
            .eq("id", tripId)
            .single(),
      supabase.functions.invoke("flight-search", {
        body: { tripRequestId: tripId, relaxedCriteria },
      }),
    ]);

    if (tripDetailsRes.error) throw tripDetailsRes.error;
    const tripDetailsData = tripDetailsRes.data;
    setTripDetails(tripDetailsData);

    if (flightSearchRes.error) throw flightSearchRes.error;
    console.log("[TripOffers] flight-search invoke:", flightSearchRes);

    // 4) Pull the requested page of offers
    const pageSize = 20;
    const { data: rows, error: fetchErr } = await supabase
      .from("flight_offers")
      .select("*")
      .eq("trip_request_id", tripId)
      .order("price")
      .range(
        currentPage * pageSize,
        (currentPage + 1) * pageSize - 1
      );
    if (fetchErr) throw fetchErr;

    // 5) Optionally filter out offers by duration
    let offersToSet = rows;
    if (!overrideFilter && tripDetailsData) {
      const filtered = rows.filter((o) =>
        validateOfferDuration(
          o,
          tripDetailsData.min_duration,
          tripDetailsData.max_duration
        )
      );
      offersToSet = filtered;
      if (filtered.length === 0 && rows.length > 0) {
        toast({
          title: "Duration filter applied",
          description: `Found ${rows.length} offers, but none match your ${tripDetailsData.min_duration}–${tripDetailsData.max_duration}-day trip.`,
          variant: "destructive",
        });
      }
    }

    // 6) Merge or replace based on page index
    if (currentPage === 0) {
      setOffers(offersToSet);
    } else {
      setOffers((prev) => [...prev, ...offersToSet]);
    }

    // 7) Update cache
    searchCache.set(cacheKey, {
      offers: offersToSet,
      tripDetails: tripDetailsData,
      timestamp: Date.now(),
    });
  } catch (err: any) {
    console.error("[TripOffers] loadOffers error:", err);
    setHasError(true);
    setErrorMessage(err.message || "Something went wrong loading offers");
  } finally {
    setIsLoading(false);
  }
};
 dc32f05 (Feat: Apply performance optimizations)
            tripRequestId: tripId,
            relaxedCriteria: relaxCriteria
          },
        })
      ]);

      console.log("[TripOffers] Parallel requests completed");

      // Handle trip details
      let tripData;
      if (location.state?.tripDetails) {
        tripData = location.state.tripDetails;
        setTripDetails(location.state.tripDetails);
      } else {
        const { data: fetchedTripData, error: tripError } = tripDetailsPromise as any;
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

<<<<<<< HEAD
      // Handle search results
      const { data: invokeData, error: invokeError } = searchPromise as any;
      if (invokeError) throw invokeError;

      if (relaxCriteria) {
        toast({
          title: "Search with relaxed criteria",
          description: "Finding flights with more flexible duration and budget constraints.",
        });
      }

      // Fetch the newly-written flight_offers
      console.log("[TripOffers] Fetching flight offers from database");
=======
      // 3) Fetch the newly-written flight_offers
      // console.log("[flight-search-ui] querying flight_offers for trip:", tripId); // Removed
      const pageSize = 20; // Define page size for pagination
>>>>>>> dc32f05 (Feat: Apply performance optimizations)
      const { data: rows, error: fetchError } = await supabase
        .from("flight_offers")
        .select("*")
        .eq("trip_request_id", tripId)
        .order("price")
        .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1); // Add .range()
      
      if (fetchError) throw fetchError;
      
      console.log("[TripOffers] Fetched", rows?.length, "offers");
      
      if (!rows || rows.length === 0) {
        console.warn("[TripOffers] No offers found");
        toast({
          title: "No flight offers found",
          description: "Try relaxing your search criteria or refreshing.",
          variant: "destructive",
        });
        setOffers([]);
        
        // Cache empty results too
        if (tripData) {
          searchCache.set(cacheKey, {
            offers: [],
            timestamp: Date.now(),
            tripDetails: tripData
          });
        }
        return;
      }
      
      
      // OPTIMIZATION TODO: Move this duration validation to the server-side (edge function or database query) if possible.
      // Apply client-side duration filter as a safety net
<<<<<<< HEAD
      let finalOffers;
=======
      // Skip it if we're in override mode
      let offersToSet = rows; // Default to rows from DB
>>>>>>> dc32f05 (Feat: Apply performance optimizations)
      if (!overrideFilter && tripData) {
        const validOffers = rows.filter(offer => 
          validateOfferDuration(offer, tripData.min_duration, tripData.max_duration)
        );
        
        if (validOffers.length < rows.length) {
          console.warn(`[TripOffers] Filtered out ${rows.length - validOffers.length} offers that didn't meet duration criteria`);
          
          toast({
            title: "Duration filter applied",
            description: `Found ${rows.length} offers, but only ${validOffers.length} match your ${tripData.min_duration}-${tripData.max_duration} day trip duration requirements.`,
            variant: "default",
          });
        }
        
<<<<<<< HEAD
        finalOffers = validOffers;
        
        if (validOffers.length === 0) {
=======
        offersToSet = validOffers; // Use filtered offers
        
        if (validOffers.length === 0 && rows.length > 0) { // If filtering resulted in zero offers but there were some initially
          // No offers were found that match our criteria
>>>>>>> dc32f05 (Feat: Apply performance optimizations)
          toast({
            title: "Duration filter applied",
            description: `Found ${rows.length} offers, but none match your ${tripData.min_duration}-${tripData.max_duration} day trip duration requirements.`,
            variant: "destructive",
          });
        }
<<<<<<< HEAD
      } else {
        finalOffers = rows;
        
        if (overrideFilter) {
=======
      } else if (overrideFilter) {
>>>>>>> dc32f05 (Feat: Apply performance optimizations)
          toast({
            title: "Search without duration filter",
            description: `Showing all ${rows.length} available offers regardless of trip duration.`,
          });
      }

<<<<<<< HEAD
      setOffers(finalOffers);

      // Cache the results
      if (tripData) {
        searchCache.set(cacheKey, {
          offers: finalOffers,
          timestamp: Date.now(),
          tripDetails: tripData
        });
=======
      // Adjust how offers are set based on currentPage
      if (currentPage === 0) {
        setOffers(offersToSet);
      } else {
        setOffers(prevOffers => [...prevOffers, ...offersToSet]);
>>>>>>> dc32f05 (Feat: Apply performance optimizations)
      }

    } catch (err: any) {
      console.error("[TripOffers] Error loading offers:", err);
      setHasError(true);
      setErrorMessage(err.message || "Something went wrong loading offers");
      toast({ 
        title: "Error Loading Flight Offers", 
        description: err.message || "An unexpected error occurred while trying to load flight offers. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
      setLastRefreshTime(Date.now());
    }
  };

  useEffect(() => {
    loadOffers(ignoreFilter);
  }, [tripId, ignoreFilter]);

  const refreshOffers = async () => {
    if (!tripId) return;
    
    // Debounce: prevent refresh if less than 3 seconds since last refresh
    const timeSinceLastRefresh = Date.now() - lastRefreshTime;
    if (timeSinceLastRefresh < 3000) {
      toast({
        title: "Please wait",
        description: "Please wait a moment before refreshing again.",
      });
      return;
    }

    setIsRefreshing(true);
    try {
      await loadOffers(ignoreFilter, usedRelaxedCriteria, false); // Don't use cache on refresh
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
      await loadOffers(false, true, false); // Don't use cache for relaxed search
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
      {/* Trip Summary Card - Show immediately if we have data */}
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

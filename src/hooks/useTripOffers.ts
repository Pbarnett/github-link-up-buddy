import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Offer, fetchTripOffers } from "@/services/tripOffersService";
import { toast } from "@/components/ui/use-toast";
import { invokeFlightSearch, FlightSearchRequestBody, FlightSearchResponse } from "@/services/api/flightSearchApi";
import { Tables } from "@/integrations/supabase/types";
import { PostgrestError } from "@supabase/supabase-js";
import logger from "@/lib/logger"; // Import logger

// Type for a row from the 'trip_requests' database table
export type TripRequestFromDB = Tables<'trip_requests'>;

// Application-specific TripDetails type, focused on what the UI/hook needs.
export interface TripDetails {
  id: string;
  earliest_departure: string;
  latest_departure: string;
  min_duration: number;
  max_duration: number;
  budget: number;
  destination_airport?: string | null;
}

interface UseTripOffersProps {
  tripId: string | null;
  initialTripDetails?: TripDetails;
}

interface UseTripOffersReturn {
  offers: Offer[];
  tripDetails: TripDetails | null;
  isLoading: boolean;
  isRefreshing: boolean;
  hasError: boolean;
  errorMessage: string;
  ignoreFilter: boolean;
  usedRelaxedCriteria: boolean;
  refreshOffers: () => Promise<void>;
  handleOverrideSearch: () => void;
  handleRelaxCriteria: () => Promise<void>;
}

const searchCache = new Map<string, { offers: Offer[], timestamp: number, tripDetails: TripDetails }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const mapTripRequestToTripDetails = (dbTripRequest: TripRequestFromDB): TripDetails => {
  if (!dbTripRequest.id) {
    logger.error("DB trip request is missing an ID.", dbTripRequest);
    throw new Error("DB trip request is missing an ID.");
  }
  return {
    id: dbTripRequest.id,
    earliest_departure: dbTripRequest.earliest_departure,
    latest_departure: dbTripRequest.latest_departure,
    min_duration: dbTripRequest.min_duration,
    max_duration: dbTripRequest.max_duration,
    budget: dbTripRequest.budget,
    destination_airport: dbTripRequest.destination_airport,
  };
};

export const useTripOffers = ({ tripId, initialTripDetails }: UseTripOffersProps): UseTripOffersReturn => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [tripDetailsState, setTripDetailsState] = useState<TripDetails | null>(initialTripDetails || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [ignoreFilterState, setIgnoreFilterState] = useState(false);
  const [usedRelaxedCriteriaState, setUsedRelaxedCriteriaState] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);

  const validateOfferDuration = useCallback((offer: Offer, minDuration: number, maxDuration: number): boolean => {
    if (!offer.departure_date || !offer.return_date) return false;
    const departDate = new Date(offer.departure_date);
    const returnDate = new Date(offer.return_date);
    if (isNaN(departDate.getTime()) || isNaN(returnDate.getTime())) {
        logger.warn("Invalid date encountered in offer:", {offerId: offer.id, departure_date: offer.departure_date, return_date: offer.return_date });
        return false;
    }
    const tripDays = Math.round((returnDate.getTime() - departDate.getTime()) / (1000 * 60 * 60 * 24));
    return tripDays >= minDuration && tripDays <= maxDuration;
  }, []);

  const loadOffers = useCallback(async (overrideFilterArg = false, relaxCriteriaArg = false, useCache = true) => {
    console.log("🔍 [useTripOffers] Starting loadOffers", { 
      tripId, 
      overrideFilterArg, 
      relaxCriteriaArg, 
      useCache,
      timestamp: new Date().toISOString()
    });

    if (!tripId) {
      console.error("❌ [useTripOffers] No trip ID provided for loadOffers call.");
      setHasError(true);
      setErrorMessage("No trip ID provided");
      setIsLoading(false);
      return;
    }

    const currentCacheKey = `${tripId}-${overrideFilterArg}-${relaxCriteriaArg}`;

    if (useCache && !isRefreshing && currentCacheKey) {
      const cached = searchCache.get(currentCacheKey);
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        console.log("✅ [useTripOffers] Using cached results for key:", currentCacheKey);
        setOffers(cached.offers);
        setTripDetailsState(cached.tripDetails);
        setIsLoading(false);
        setIgnoreFilterState(overrideFilterArg);
        setUsedRelaxedCriteriaState(relaxCriteriaArg);
        return;
      }
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    setIgnoreFilterState(overrideFilterArg);
    if (relaxCriteriaArg) {
      setUsedRelaxedCriteriaState(true);
    }

    try {
      let currentTripDetails: TripDetails;
      if (initialTripDetails && initialTripDetails.id === tripId) {
          currentTripDetails = initialTripDetails;
          setTripDetailsState(initialTripDetails);
          console.log("📋 [useTripOffers] Using initial trip details:", currentTripDetails);
      } else if (tripDetailsState && tripDetailsState.id === tripId) {
          currentTripDetails = tripDetailsState;
          console.log("📋 [useTripOffers] Using cached trip details:", currentTripDetails);
      } else {
        console.log("🔍 [useTripOffers] Fetching trip details from DB for tripId:", tripId);
        const { data: fetchedDbTripRequest, error: tripError } = await supabase
            .from("trip_requests")
            .select("*")
            .eq("id", tripId)
            .single<TripRequestFromDB>();

        if (tripError) {
          console.error("❌ [useTripOffers] Error fetching trip details:", tripError);
          throw tripError;
        }
        if (!fetchedDbTripRequest) {
          console.error("❌ [useTripOffers] No trip data found for ID:", tripId);
          throw new Error("No trip data found for ID: " + tripId);
        }

        currentTripDetails = mapTripRequestToTripDetails(fetchedDbTripRequest);
        setTripDetailsState(currentTripDetails);
        console.log("✅ [useTripOffers] Fetched trip details:", currentTripDetails);
      }

      console.log("🚀 [useTripOffers] About to invoke flight search with payload:", {
        tripRequestId: tripId,
        relaxedCriteria: relaxCriteriaArg,
        timestamp: new Date().toISOString()
      });

      const flightSearchPayload: FlightSearchRequestBody = {
        tripRequestId: tripId,
        relaxedCriteria: relaxCriteriaArg,
      };
      
      console.log("📡 [useTripOffers] Calling invokeFlightSearch...");
      const searchServiceResponse: FlightSearchResponse = await invokeFlightSearch(flightSearchPayload);
      console.log("✅ [useTripOffers] Flight search response received:", {
        success: searchServiceResponse.success,
        requestsProcessed: searchServiceResponse.requestsProcessed,
        matchesInserted: searchServiceResponse.matchesInserted,
        message: searchServiceResponse.message,
        details: searchServiceResponse.details
      });

      if (!searchServiceResponse.success) {
        console.error("❌ [useTripOffers] Flight search reported failure:", searchServiceResponse.message);
        throw new Error(searchServiceResponse.message || "Flight search invocation reported failure.");
      }

      if (relaxCriteriaArg) {
        toast({
          title: "Search with relaxed criteria",
          description: "Finding flights with more flexible duration and budget constraints.",
        });
      }

      console.log("🔍 [useTripOffers] Fetching offers from database for tripId:", tripId);
      const fetchedOffers: Offer[] = await fetchTripOffers(tripId);
      console.log(`✅ [useTripOffers] Fetched ${fetchedOffers.length} offers from database for tripId: ${tripId}`);

      if (fetchedOffers.length === 0) {
        console.warn("⚠️ [useTripOffers] No offers found in database for tripId:", tripId);
        toast({
          title: "No flight offers found",
          description: "Try relaxing your search criteria or refreshing.",
          variant: "destructive",
        });
        setOffers([]);
        if (currentCacheKey && currentTripDetails) {
          searchCache.set(currentCacheKey, { offers: [], timestamp: Date.now(), tripDetails: currentTripDetails });
        }
      } else {
        let finalOffers: Offer[];
        if (!overrideFilterArg && currentTripDetails) {
          const validOffers = fetchedOffers.filter(offer =>
            validateOfferDuration(offer, currentTripDetails.min_duration, currentTripDetails.max_duration)
          );

          console.log(`🔍 [useTripOffers] Duration filter: ${fetchedOffers.length} total → ${validOffers.length} valid (${currentTripDetails.min_duration}-${currentTripDetails.max_duration} days)`);

          if (validOffers.length < fetchedOffers.length) {
            toast({
              title: "Duration filter applied",
              description: `Found ${fetchedOffers.length} offers, but only ${validOffers.length} match your ${currentTripDetails.min_duration}-${currentTripDetails.max_duration} day trip duration.`,
            });
          }
          finalOffers = validOffers;
          if (validOffers.length === 0 && fetchedOffers.length > 0) {
            toast({
              title: "No offers match duration",
              description: `Found ${fetchedOffers.length} offers, but none match your ${currentTripDetails.min_duration}-${currentTripDetails.max_duration} day duration. Consider searching any duration.`,
              variant: "destructive",
            });
          }
        } else {
          finalOffers = fetchedOffers;
          if (overrideFilterArg) {
            toast({
              title: "Search without duration filter",
              description: `Showing all ${fetchedOffers.length} available offers regardless of trip duration.`,
            });
          }
        }

        console.log(`✅ [useTripOffers] Final offers count: ${finalOffers.length}`);
        setOffers(finalOffers);
        if (currentCacheKey && currentTripDetails) {
          searchCache.set(currentCacheKey, { offers: finalOffers, timestamp: Date.now(), tripDetails: currentTripDetails });
          console.log("💾 [useTripOffers] Results cached for key:", currentCacheKey);
        }
      }

    } catch (err) {
      const error = err as Error | PostgrestError;
      console.error("❌ [useTripOffers] Error in loadOffers:", { 
        tripId, 
        errorMessage: error.message,
        errorDetails: error,
        stack: error.stack 
      });
      setHasError(true);
      const displayMessage = error.message || "Something went wrong loading offers";
      setErrorMessage(displayMessage);
      toast({
        title: "Error Loading Flight Offers",
        description: displayMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setLastRefreshTime(Date.now());
      console.log("🏁 [useTripOffers] loadOffers completed at", new Date().toISOString());
    }
  }, [tripId, initialTripDetails, tripDetailsState, isRefreshing, validateOfferDuration]);

  useEffect(() => {
    if (tripId) {
        loadOffers(ignoreFilterState, usedRelaxedCriteriaState, true);
    } else {
        setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId, loadOffers]);

  const refreshOffers = useCallback(async () => {
    if (!tripId) return;

    const timeSinceLastRefresh = Date.now() - lastRefreshTime;
    if (timeSinceLastRefresh < 3000 && !isRefreshing) {
      toast({
        title: "Please wait",
        description: "Please wait a moment before refreshing again.",
      });
      return;
    }

    setIsRefreshing(true);
    await loadOffers(ignoreFilterState, usedRelaxedCriteriaState, false);
  }, [loadOffers, tripId, lastRefreshTime, ignoreFilterState, usedRelaxedCriteriaState, isRefreshing]);

  const handleOverrideSearch = useCallback(() => {
    toast({
      title: "Searching without duration filter",
      description: "Finding all available flights regardless of trip duration...",
    });
    loadOffers(true, usedRelaxedCriteriaState, false);
  }, [loadOffers, usedRelaxedCriteriaState]);

  const handleRelaxCriteria = useCallback(async () => {
    if (!tripId) return;
    await loadOffers(false, true, false);
  }, [loadOffers, tripId]);

  return {
    offers,
    tripDetails: tripDetailsState,
    isLoading,
    isRefreshing,
    hasError,
    errorMessage,
    ignoreFilter: ignoreFilterState,
    usedRelaxedCriteria: usedRelaxedCriteriaState,
    refreshOffers,
    handleOverrideSearch,
    handleRelaxCriteria,
  };
};

export default useTripOffers;

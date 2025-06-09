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
    // This error is critical for application logic, so it should probably remain an error
    // or be handled in a way that guarantees TripDetails always has an id.
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
    logger.info("[useTripOffers] Loading offers", { tripId, overrideFilterArg, relaxCriteriaArg, useCache });

    if (!tripId) {
      logger.error("[useTripOffers] No trip ID provided for loadOffers call.");
      setHasError(true);
      setErrorMessage("No trip ID provided");
      setIsLoading(false);
      return;
    }

    const currentCacheKey = `${tripId}-${overrideFilterArg}-${relaxCriteriaArg}`;

    if (useCache && !isRefreshing && currentCacheKey) {
      const cached = searchCache.get(currentCacheKey);
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        logger.info("[useTripOffers] Using cached results for key:", currentCacheKey);
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
      } else if (tripDetailsState && tripDetailsState.id === tripId) {
          currentTripDetails = tripDetailsState;
      } else {
        logger.debug("[useTripOffers] Fetching trip details from DB for tripId:", tripId);
        const { data: fetchedDbTripRequest, error: tripError } = await supabase
            .from("trip_requests")
            .select("*")
            .eq("id", tripId)
            .single<TripRequestFromDB>();

        if (tripError) throw tripError; // Supabase errors are already quite descriptive
        if (!fetchedDbTripRequest) throw new Error("No trip data found for ID: " + tripId); // This will be caught below

        currentTripDetails = mapTripRequestToTripDetails(fetchedDbTripRequest);
        setTripDetailsState(currentTripDetails);
      }

      const flightSearchPayload: FlightSearchRequestBody = {
        tripRequestId: tripId,
        relaxedCriteria: relaxCriteriaArg,
        destination_location_code: currentTripDetails.destination_airport || "",
      };
      const searchServiceResponse: FlightSearchResponse = await invokeFlightSearch(flightSearchPayload);

      if (!searchServiceResponse.success) {
        // The message from searchServiceResponse should be informative enough
        throw new Error(searchServiceResponse.message || "Flight search invocation reported failure.");
      }

      // Use logger.debug for potentially large objects or verbose info
      logger.debug("[useTripOffers] Flight search invoked successfully.", { tripId, responseData: searchServiceResponse });

      if (relaxCriteriaArg) {
        toast({
          title: "Search with relaxed criteria",
          description: "Finding flights with more flexible duration and budget constraints.",
        });
      }

      const fetchedOffers: Offer[] = await fetchTripOffers(tripId);
      logger.info(`[useTripOffers] Fetched ${fetchedOffers.length} offers via service for tripId: ${tripId}`);

      if (fetchedOffers.length === 0) {
        logger.warn("[useTripOffers] No offers found via service for tripId:", tripId);
        toast({ // This toast is user-facing, so it's fine.
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

          if (validOffers.length < fetchedOffers.length) {
            // This toast is also user-facing.
            toast({
              title: "Duration filter applied",
              description: `Found ${fetchedOffers.length} offers, but only ${validOffers.length} match your ${currentTripDetails.min_duration}-${currentTripDetails.max_duration} day trip duration.`,
            });
          }
          finalOffers = validOffers;
          if (validOffers.length === 0 && fetchedOffers.length > 0) {
            toast({ // User-facing
              title: "No offers match duration",
              description: `Found ${fetchedOffers.length} offers, but none match your ${currentTripDetails.min_duration}-${currentTripDetails.max_duration} day duration. Consider searching any duration.`,
              variant: "destructive",
            });
          }
        } else {
          finalOffers = fetchedOffers;
          if (overrideFilterArg) {
            toast({ // User-facing
              title: "Search without duration filter",
              description: `Showing all ${fetchedOffers.length} available offers regardless of trip duration.`,
            });
          }
        }

        setOffers(finalOffers);
        if (currentCacheKey && currentTripDetails) {
          searchCache.set(currentCacheKey, { offers: finalOffers, timestamp: Date.now(), tripDetails: currentTripDetails });
          logger.info("[useTripOffers] Results cached for key:", currentCacheKey);
        }
      }

    } catch (err) {
      const error = err as Error | PostgrestError;
      logger.error("[useTripOffers] Error in loadOffers:", { tripId, errorDetails: error });
      setHasError(true);
      const displayMessage = error.message || "Something went wrong loading offers";
      setErrorMessage(displayMessage);
      toast({ // User-facing
        title: "Error Loading Flight Offers",
        description: displayMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setLastRefreshTime(Date.now());
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

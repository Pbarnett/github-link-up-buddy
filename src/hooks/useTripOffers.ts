
import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Offer, fetchTripOffers } from "@/services/tripOffersService";
import { toast } from "@/components/ui/use-toast";
import { invokeFlightSearch, FlightSearchRequestBody, FlightSearchResponse } from "@/services/api/flightSearchApi";
import { Tables } from "@/integrations/supabase/types";
import { PostgrestError } from "@supabase/supabase-js";
import logger from "@/lib/logger";

// Type for a row from the 'trip_requests' database table
export type TripRequestFromDB = Tables<'trip_requests'>;

// Application-specific TripDetails type, focused on what the UI/hook needs
export interface TripDetails {
  id: string;
  earliest_departure: string;
  latest_departure: string;
  min_duration: number;
  max_duration: number;
  budget: number;
  max_price?: number;
  destination_airport?: string | null;
}

export interface UseTripOffersProps {
  tripId: string | null;
  initialTripDetails?: TripDetails;
}

export interface UseTripOffersReturn {
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

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Simple cache for this hook
const searchCache = new Map<string, {
  offers: Offer[];
  tripDetails: TripDetails;
  timestamp: number;
}>();

// Clear cache function
export const clearCache = () => {
  searchCache.clear();
};

// Map DB trip request to TripDetails
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
    max_price: dbTripRequest.max_price || undefined,
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

    if (useCache && !isRefreshing) {
      const cachedEntry = searchCache.get(currentCacheKey);
      if (cachedEntry && (Date.now() - cachedEntry.timestamp) < CACHE_DURATION) {
        logger.info("[useTripOffers] Using cached results for key:", currentCacheKey);
        setOffers(cachedEntry.offers);
        setTripDetailsState(cachedEntry.tripDetails);
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

        if (tripError) throw tripError;
        if (!fetchedDbTripRequest) throw new Error("No trip data found for ID: " + tripId);

        currentTripDetails = mapTripRequestToTripDetails(fetchedDbTripRequest);
        setTripDetailsState(currentTripDetails);
      }

      const flightSearchPayload: FlightSearchRequestBody = {
        tripRequestId: tripId,
        relaxedCriteria: relaxCriteriaArg,
      };

      logger.info("[useTripOffers] calling invokeFlightSearch with payload:", flightSearchPayload);

      let searchServiceResponse: FlightSearchResponse;
      try {
        const startTime = Date.now();
        searchServiceResponse = await invokeFlightSearch(flightSearchPayload);
        const endTime = Date.now();
        logger.info(`[useTripOffers] invokeFlightSearch completed in ${endTime - startTime}ms`);
      } catch (searchError) {
        logger.error("[useTripOffers] Initial flight search failed, checking for existing offers:", { tripId, errorDetails: searchError });

        const existingOffersRaw = await fetchTripOffers(tripId);
        if (existingOffersRaw.length > 0) {
          logger.info(`[useTripOffers] Found ${existingOffersRaw.length} existing offers, attempting to use as fallback.`);
          let finalExistingOffers: Offer[];
          if (!overrideFilterArg && currentTripDetails) {
            finalExistingOffers = existingOffersRaw.filter(offer =>
              validateOfferDuration(offer, currentTripDetails.min_duration, currentTripDetails.max_duration)
            );
            if (finalExistingOffers.length < existingOffersRaw.length) {
              toast({
                title: "Duration filter applied to fallback",
                description: `Found ${existingOffersRaw.length} offers, but only ${finalExistingOffers.length} match your ${currentTripDetails.min_duration}-${currentTripDetails.max_duration} day trip duration.`,
              });
            }
          } else {
            finalExistingOffers = existingOffersRaw;
          }

          if (finalExistingOffers.length > 0) {
            setOffers(finalExistingOffers);
            searchCache.set(currentCacheKey, {
              offers: finalExistingOffers,
              tripDetails: currentTripDetails,
              timestamp: Date.now()
            });
            setIsLoading(false);
            setHasError(false);
            return;
          }
        }

        throw searchError;
      }

      if (!searchServiceResponse.success) {
        throw new Error(searchServiceResponse.message || "Flight search invocation reported failure.");
      }

      logger.debug("[useTripOffers] Flight search invoked successfully.", { tripId, responseData: searchServiceResponse });

      if (relaxCriteriaArg) {
        toast({
          title: "Search with relaxed criteria",
          description: "Finding flights with more flexible duration and budget constraints.",
        });
      }

      // Add delay to ensure edge function has time to write to database
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const fetchedOffers: Offer[] = await fetchTripOffers(tripId);
      logger.info(`[useTripOffers] Fetched ${fetchedOffers.length} offers via service for tripId: ${tripId}`);

      if (fetchedOffers.length === 0) {
        logger.warn("[useTripOffers] No offers found via service for tripId:", tripId);
        
        let errorDescription = "Try relaxing your search criteria or refreshing.";
        if (searchServiceResponse.details && searchServiceResponse.details.length > 0) {
          const detail = searchServiceResponse.details[0];
          if (detail.error) {
            errorDescription = `Search issue: ${detail.error}`;
          } else if (detail.offersGenerated === 0) {
            errorDescription = "No flights found by the search API. Try different dates or destinations.";
          } else if (detail.exactDestinationOffers === 0) {
            errorDescription = `Found ${detail.offersGenerated} flights but none to your exact destination. Try nearby airports or different dates.`;
          } else if (detail.offersAfterAllFilters === 0) {
            errorDescription = "Found flights but none matched your requirements (price, nonstop, baggage). Try relaxing filters.";
          }
        }
        
        toast({
          title: "No flight offers found",
          description: errorDescription,
          variant: "destructive",
        });
        setOffers([]);
        searchCache.set(currentCacheKey, {
          offers: [],
          tripDetails: currentTripDetails,
          timestamp: Date.now()
        });
      } else {
        let finalOffers: Offer[];
        if (!overrideFilterArg && currentTripDetails) {
          const validOffers = fetchedOffers.filter(offer =>
            validateOfferDuration(offer, currentTripDetails.min_duration, currentTripDetails.max_duration)
          );

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

        setOffers(finalOffers);
        searchCache.set(currentCacheKey, {
          offers: finalOffers,
          tripDetails: currentTripDetails,
          timestamp: Date.now()
        });
      }

    } catch (err) {
      const error = err as Error | PostgrestError;
      logger.error("[useTripOffers] Error in loadOffers:", { tripId, errorDetails: error });
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
    }
  }, [tripId, initialTripDetails, tripDetailsState, isRefreshing, validateOfferDuration]);

  useEffect(() => {
    if (tripId) {
        loadOffers(ignoreFilterState, usedRelaxedCriteriaState, true);
    } else {
        setIsLoading(false);
    }
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

    const cacheKey = `${tripId}-${ignoreFilterState}-${usedRelaxedCriteriaState}`;
    searchCache.delete(cacheKey);
    logger.info("[useTripOffers] Cache entry deleted for key:", cacheKey, "before refresh.");

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

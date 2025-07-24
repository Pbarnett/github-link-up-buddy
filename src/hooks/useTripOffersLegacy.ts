

// Legacy useTripOffers hook with dependency injection and improved testability.


import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Offer, fetchTripOffers } from "@/services/tripOffersService";
import { toast } from "@/components/ui/use-toast";
import { invokeFlightSearch, FlightSearchRequestBody, FlightSearchResponse } from "@/services/api/flightSearchApi";
import logger from "@/lib/logger";
import * as React from 'react';

// Imports from the new useTripOffers.ts
import { TripDetails, mapTripRequestToTripDetails, CACHE_DURATION, unifiedCache, clearUnifiedCache } from './useTripOffers';

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

// searchCache is removed, unifiedCache will be used.

// clearCache now calls the imported clearUnifiedCache
export const clearCache = () => {
  clearUnifiedCache();
};

// Legacy hook
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

  const loadOffers = useCallback(async (overrideFilterArg = true, relaxCriteriaArg = false, useCache = true) => {
    logger.info("[useTripOffersLegacy] Loading offers", { tripId, overrideFilterArg, relaxCriteriaArg, useCache });

    if (!tripId) {
      logger.error("[useTripOffersLegacy] No trip ID provided for loadOffers call.");
      setHasError(true);
      setErrorMessage("No trip ID provided");
      setIsLoading(false);
      return;
    }

    const currentCacheKey = `legacy-${tripId}-${overrideFilterArg}-${relaxCriteriaArg}`; // Added prefix to distinguish from pool keys

    if (useCache && !isRefreshing) { // currentCacheKey will always be defined here
      const cachedEntry = unifiedCache.get(currentCacheKey);
      if (cachedEntry?.legacy && (Date.now() - cachedEntry.timestamp) < CACHE_DURATION) {
        logger.info("[useTripOffersLegacy] Using cached results from unifiedCache for key:", currentCacheKey);
        setOffers(cachedEntry.legacy.offers);
        setTripDetailsState(cachedEntry.legacy.tripDetails);
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
        logger.debug("[useTripOffersLegacy] Fetching trip details from DB for tripId:", tripId);
        const { data: fetchedDbTripRequest, error: tripError } = await supabase
            .from("trip_requests")
            .select("*")
            .eq("id", tripId)
            .single();

        if (tripError) throw tripError;
        if (!fetchedDbTripRequest) throw new Error("No trip data found for ID: " + tripId);

        currentTripDetails = mapTripRequestToTripDetails(fetchedDbTripRequest);
        setTripDetailsState(currentTripDetails);
      }

      const flightSearchPayload: FlightSearchRequestBody = {
        tripRequestId: tripId,
        relaxedCriteria: relaxCriteriaArg,
      };

      logger.info("[useTripOffersLegacy] calling invokeFlightSearch with payload:", flightSearchPayload); // Changed console.log to logger.info

      let searchServiceResponse: FlightSearchResponse;
      try {
        searchServiceResponse = await invokeFlightSearch(flightSearchPayload);
      } catch (searchError) {
        logger.error("[useTripOffersLegacy] Initial flight search failed, checking for existing offers:", { tripId, errorDetails: searchError });

        const existingOffersRaw = await fetchTripOffers(tripId);
        if (existingOffersRaw.length > 0) {
          logger.info(`[useTripOffersLegacy] Found ${existingOffersRaw.length} existing offers, attempting to use as fallback.`);
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
            // Cache Write for fallback:
            const existingEntry = unifiedCache.get(currentCacheKey) || { timestamp: Date.now() };
            unifiedCache.set(currentCacheKey, {
              ...existingEntry,
              legacy: { offers: finalExistingOffers, tripDetails: currentTripDetails },
              timestamp: Date.now()
            });
            logger.info("[useTripOffersLegacy] Fallback results cached in unifiedCache for key:", currentCacheKey);
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

      logger.debug("[useTripOffersLegacy] Flight search invoked successfully.", { tripId, responseData: searchServiceResponse });

      if (relaxCriteriaArg) {
        toast({
          title: "Search with relaxed criteria",
          description: "Finding flights with more flexible duration and budget constraints.",
        });
      }

      const fetchedOffers: Offer[] = await fetchTripOffers(tripId);
      logger.info(`[useTripOffersLegacy] Fetched ${fetchedOffers.length} offers via service for tripId: ${tripId}`);
      
      // Log summary of fetched offers
      logger.debug(`[useTripOffersLegacy] Fetched ${fetchedOffers.length} offers`, {
        tripId,
        sampleOffers: fetchedOffers.slice(0, 3).map(o => ({
          id: o.id,
          airline: o.airline,
          price: o.price
        }))
      });

      if (fetchedOffers.length === 0) {
        logger.warn("[useTripOffersLegacy] No offers found via service for tripId:", tripId);
        toast({
          title: "No flight offers found",
          description: "Try relaxing your search criteria or refreshing.",
          variant: "destructive",
        });
        setOffers([]);
        if (currentTripDetails) { // Ensure currentTripDetails exists before caching
          const existingEntry = unifiedCache.get(currentCacheKey) || { timestamp: Date.now() };
          unifiedCache.set(currentCacheKey, {
            ...existingEntry,
            legacy: { offers: [], tripDetails: currentTripDetails },
            timestamp: Date.now()
          });
          logger.info("[useTripOffersLegacy] Empty offerset cached in unifiedCache for key:", currentCacheKey);
        }
      } else {
        let finalOffers: Offer[];
        if (!overrideFilterArg && currentTripDetails) {
          logger.debug(`[useTripOffersLegacy] Applying duration filter: ${currentTripDetails.min_duration}-${currentTripDetails.max_duration} days`);
          
          const validOffers = fetchedOffers.filter(offer => {
            return validateOfferDuration(offer, currentTripDetails.min_duration, currentTripDetails.max_duration);
          });

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
          logger.debug(`[useTripOffersLegacy] Bypassing duration filter (override=${overrideFilterArg}). Using all ${fetchedOffers.length} offers.`);
          finalOffers = fetchedOffers;
          if (overrideFilterArg) {
            toast({
              title: "Search without duration filter",
              description: `Showing all ${fetchedOffers.length} available offers regardless of trip duration.`,
            });
          }
        }

        setOffers(finalOffers);
        if (currentTripDetails) { // Ensure currentTripDetails exists before caching
          const existingEntry = unifiedCache.get(currentCacheKey) || { timestamp: Date.now() };
          unifiedCache.set(currentCacheKey, {
            ...existingEntry,
            legacy: { offers: finalOffers, tripDetails: currentTripDetails },
            timestamp: Date.now()
          });
          logger.info("[useTripOffersLegacy] Results cached in unifiedCache for key:", currentCacheKey);
        }
      }

    } catch (err) {
      const error = err as Error | PostgrestError;
      logger.error("[useTripOffersLegacy] Error in loadOffers:", { tripId, errorDetails: error });
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
  }, [tripId, initialTripDetails, tripDetailsState, isRefreshing, validateOfferDuration, mapTripRequestToTripDetails, CACHE_DURATION]);

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

    // When refreshing, delete the specific legacy cache entry before loading
    const cacheKey = `legacy-${tripId}-${ignoreFilterState}-${usedRelaxedCriteriaState}`;
    unifiedCache.delete(cacheKey);
    logger.info("[useTripOffersLegacy] unifiedCache entry deleted for key:", cacheKey, "before refresh.");

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

// Helper functions for testing - exported for unit testing pure logic
export const _test = {
  validateDuration: (offer: Offer, minDuration: number, maxDuration: number): boolean => {
    if (!offer.departure_date || !offer.return_date) return false;
    const departDate = new Date(offer.departure_date);
    const returnDate = new Date(offer.return_date);
    if (isNaN(departDate.getTime()) || isNaN(returnDate.getTime())) {
      return false;
    }
    const tripDays = Math.round((returnDate.getTime() - departDate.getTime()) / (1000 * 60 * 60 * 24));
    return tripDays >= minDuration && tripDays <= maxDuration;
  },
  buildCacheKey: (tripId: string, overrideFilter: boolean, relaxCriteria: boolean): string => {
    return `legacy-${tripId}-${overrideFilter}-${relaxCriteria}`;
  },
};

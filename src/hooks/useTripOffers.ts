import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Offer, fetchTripOffers } from "@/services/tripOffersService";
import { ScoredOffer } from "@/types/offer";
import { toast } from "@/components/ui/use-toast";
import { invokeFlightSearch, FlightSearchRequestBody, FlightSearchResponse, fetchFlightSearch } from "@/services/api/flightSearchApi";
import { Tables } from "@/integrations/supabase/types";
import { PostgrestError } from "@supabase/supabase-js";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import logger from "@/lib/logger";

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
  max_price?: number;
  destination_airport?: string | null;
}

interface UseTripOffersProps {
  tripId: string | null;
  initialTripDetails?: TripDetails;
}

// Legacy interface for backward compatibility
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

// New interface for pools functionality
export interface PoolsHookResult {
  pool1: ScoredOffer[];
  pool2: ScoredOffer[];
  pool3: ScoredOffer[];
  budget: number;
  maxBudget: number;
  dateRange: { from: string; to: string };
  bumpsUsed: number;
  bumpBudget(): void;
  mode: 'manual' | 'auto';
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  refreshPools: () => Promise<void>;
}

const searchCache = new Map<string, { offers: Offer[], timestamp: number, tripDetails: TripDetails }>();
const poolsCache = new Map<string, { pools: { pool1: ScoredOffer[], pool2: ScoredOffer[], pool3: ScoredOffer[] }, timestamp: number, budget: number }>();
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
    max_price: dbTripRequest.max_price || undefined,
    destination_airport: dbTripRequest.destination_airport,
  };
};

// New pools-based hook
export const useTripOffersPools = ({ tripId }: { tripId: string | null }): PoolsHookResult => {
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get('mode') as 'manual' | 'auto') || 'manual';
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [budget, setBudget] = useState<number>(1000); // Default budget
  const [bumpsUsed, setBumpsUsed] = useState(0);
  const [pools, setPools] = useState<{ pool1: ScoredOffer[], pool2: ScoredOffer[], pool3: ScoredOffer[] }>({ 
    pool1: [], 
    pool2: [], 
    pool3: [] 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const maxBudget = useMemo(() => {
    return tripDetails?.max_price || budget * 3;
  }, [tripDetails?.max_price, budget]);

  const dateRange = useMemo(() => {
    return {
      from: tripDetails?.earliest_departure || "",
      to: tripDetails?.latest_departure || "",
    };
  }, [tripDetails?.earliest_departure, tripDetails?.latest_departure]);

  const bumpBudget = useCallback(() => {
    if (bumpsUsed >= 3 || budget >= maxBudget) return;
    const next = Math.min(budget * 1.2, maxBudget);
    setBudget(next);
    setBumpsUsed(b => b + 1);
  }, [budget, bumpsUsed, maxBudget]);

  const loadPools = useCallback(async () => {
    if (!tripId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    try {
      // Fetch trip details if not already loaded
      if (!tripDetails) {
        const { data: fetchedDbTripRequest, error: tripError } = await supabase
          .from("trip_requests")
          .select("*")
          .eq("id", tripId)
          .single<TripRequestFromDB>();

        if (tripError) throw tripError;
        if (!fetchedDbTripRequest) throw new Error("No trip data found for ID: " + tripId);

        const details = mapTripRequestToTripDetails(fetchedDbTripRequest);
        setTripDetails(details);
        setBudget(details.budget);
      }

      // Check cache first
      const cacheKey = `${tripId}-${budget}-${mode}`;
      const cached = poolsCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        setPools(cached.pools);
        setIsLoading(false);
        return;
      }

      // Fetch new pools data
      const response = await fetchFlightSearch(tripId, false);
      const newPools = {
        pool1: response.pool1,
        pool2: response.pool2,
        pool3: response.pool3,
      };

      setPools(newPools);
      poolsCache.set(cacheKey, { pools: newPools, timestamp: Date.now(), budget });

    } catch (err) {
      const error = err as Error | PostgrestError;
      logger.error("[useTripOffersPools] Error loading pools:", { tripId, errorDetails: error });
      setHasError(true);
      setErrorMessage(error.message || "Failed to load flight pools");
      toast({
        title: "Error Loading Flight Pools",
        description: error.message || "Failed to load flight pools",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [tripId, budget, mode, tripDetails]);

  const refreshPools = useCallback(async () => {
    // Clear cache and reload
    if (tripId) {
      const cacheKey = `${tripId}-${budget}-${mode}`;
      poolsCache.delete(cacheKey);
      await loadPools();
    }
  }, [tripId, budget, mode, loadPools]);

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  // Auto-refresh when budget changes
  useEffect(() => {
    if (tripDetails) {
      loadPools();
    }
  }, [budget, loadPools, tripDetails]);

  return {
    ...pools,
    budget,
    maxBudget,
    dateRange,
    bumpsUsed,
    bumpBudget,
    mode,
    isLoading,
    hasError,
    errorMessage,
    refreshPools,
  };
};

// Legacy hook - keeping for backward compatibility
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

        if (tripError) throw tripError;
        if (!fetchedDbTripRequest) throw new Error("No trip data found for ID: " + tripId);

        currentTripDetails = mapTripRequestToTripDetails(fetchedDbTripRequest);
        setTripDetailsState(currentTripDetails);
      }

      const flightSearchPayload: FlightSearchRequestBody = {
        tripRequestId: tripId,
        relaxedCriteria: relaxCriteriaArg,
      };

      console.log("useTripOffers calling invokeFlightSearch with payload:", flightSearchPayload);
      
      let searchServiceResponse: FlightSearchResponse;
      try {
        searchServiceResponse = await invokeFlightSearch(flightSearchPayload);
      } catch (searchError) {
        logger.error("[useTripOffers] Initial flight search failed, checking for existing offers:", { tripId, errorDetails: searchError });
        
        const existingOffersRaw = await fetchTripOffers(tripId);
        if (existingOffersRaw.length > 0) {
          logger.info(`[useTripOffers] Found ${existingOffersRaw.length} existing offers, attempting to use as fallback.`);
          // Apply duration filter to existing offers if applicable
          let finalExistingOffers: Offer[];
          if (!overrideFilterArg && currentTripDetails) { // currentTripDetails should be available here
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
            setIsLoading(false);
            setHasError(false); // Successfully used fallback
            return;
          }
        }
        
        throw searchError; // If no existing offers or they are all filtered out
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

      const fetchedOffers: Offer[] = await fetchTripOffers(tripId);
      logger.info(`[useTripOffers] Fetched ${fetchedOffers.length} offers via service for tripId: ${tripId}`);

      if (fetchedOffers.length === 0) {
        logger.warn("[useTripOffers] No offers found via service for tripId:", tripId);
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

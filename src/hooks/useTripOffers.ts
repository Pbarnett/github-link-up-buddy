import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Offer, fetchTripOffers } from "@/services/tripOffersService";
import { ScoredOffer } from "@/types/offer";
import { toast } from "@/components/ui/use-toast";
import { invokeFlightSearch, FlightSearchRequestBody, FlightSearchResponse, fetchFlightSearch } from "@/services/api/flightSearchApi";
import { Tables } from "@/integrations/supabase/types";
import { PostgrestError } from "@supabase/supabase-js";
import logger from "@/lib/logger";

// Type for a row from the 'trip_requests' database table - EXPORTED
export type TripRequestFromDB = Tables<'trip_requests'>;

// Application-specific TripDetails type, focused on what the UI/hook needs. - EXPORTED
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

/**
 * Enhanced interface for the new pools-based functionality
 */
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

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes - EXPORTED

// Unified Cache Definition
export const unifiedCache = new Map<string, {
  legacy?: { offers: Offer[], tripDetails: TripDetails }, // Offer and TripDetails types are available
  pools?: { pool1: ScoredOffer[], pool2: ScoredOffer[], pool3: ScoredOffer[], budget: number }, // ScoredOffer is available
  timestamp: number
}>();

// Exported function to clear the unified cache
export const clearUnifiedCache = () => {
  unifiedCache.clear();
  logger.info("[UnifiedCache] Cache cleared.");
};

// mapTripRequestToTripDetails remains and is EXPORTED for legacy hook
export const mapTripRequestToTripDetails = (dbTripRequest: TripRequestFromDB): TripDetails => {
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

export const useTripOffersPools = ({ tripId }: { tripId: string | null }): PoolsHookResult => {
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get('mode') as 'manual' | 'auto') || 'manual';
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [budget, setBudget] = useState<number>(1000);
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
    
    const newBudget = Math.min(budget * 1.2, maxBudget);
    setBudget(newBudget);
    setBumpsUsed(prev => prev + 1);
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
      // Fetch trip details if not already loaded (logic remains the same)
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
        setBudget(details.budget); // Set initial budget from tripDetails
      }

      const cacheKey = `${tripId}-${budget}-${mode}`; // Budget is now part of the key consistently
      const cachedEntry = unifiedCache.get(cacheKey);

      if (cachedEntry?.pools && (Date.now() - cachedEntry.timestamp) < CACHE_DURATION) {
        logger.info("[useTripOffersPools] Using cached results from unifiedCache for key:", cacheKey);
        setPools(cachedEntry.pools);
        // Ensure budget from cache is used if it was part of the cached pools structure
        if(cachedEntry.pools.budget) setBudget(cachedEntry.pools.budget);
        setIsLoading(false);
        return;
      }

      const response = await fetchFlightSearch(tripId, false);
      const newPools = {
        pool1: response.pool1,
        pool2: response.pool2,
        pool3: response.pool3,
      };

      setPools(newPools);
      // Cache Write:
      const existingEntry = unifiedCache.get(cacheKey) || { timestamp: Date.now() };
      unifiedCache.set(cacheKey, {
        ...existingEntry,
        pools: { ...newPools, budget }, // Store current budget with the pools
        timestamp: Date.now()
      });
      logger.info("[useTripOffersPools] Pool results cached in unifiedCache for key:", cacheKey);

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
    if (tripId) {
      const cacheKey = `${tripId}-${budget}-${mode}`;
      // Simpler delete for now, assuming distinct keys or overwrite is acceptable for pools.
      // If preserving legacy part under same key was needed, more complex logic would be required.
      // For this refactor, direct deletion of the key if only pools data is relevant to *this key* is fine.
      unifiedCache.delete(cacheKey);
      logger.info("[useTripOffersPools] unifiedCache entry deleted for key:", cacheKey);
      await loadPools();
    }
  }, [tripId, budget, mode, loadPools]);

  useEffect(() => {
    loadPools();
  }, [loadPools]); // loadPools has dependencies: tripId, budget, mode, tripDetails

  // This effect might be redundant if loadPools is correctly called when budget changes
  // and tripDetails is stable or correctly re-fetched.
  // The dependency array of loadPools includes 'budget' and 'tripDetails'.
  // When bumpBudget changes 'budget', loadPools will be re-created and this effect will run.
  // If tripDetails changes, loadPools is also re-created.
  // useEffect(() => {
  //   if (tripDetails) { // Ensures tripDetails is loaded before trying to load pools based on its budget
  //     loadPools();
  //   }
  // }, [budget, loadPools, tripDetails]);
  // The above useEffect for budget changes is implicitly handled by loadPools dependency on budget.

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

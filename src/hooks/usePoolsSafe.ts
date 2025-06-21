
import { useTripOffersPools, clearUnifiedCache, PoolsHookResult } from './useTripOffers';
import { useTripOffers, UseTripOffersReturn } from './useTripOffersLegacy';
import { toast } from '@/hooks/use-toast';
import logger from '@/lib/logger';
import { useState, useEffect } from 'react';
import { ScoredOffer } from '@/types/offer';

interface UsePoolsSafeParams {
  tripId: string | null;
}

export interface PoolsSafeResult extends PoolsHookResult {
  isUsingFallback: boolean;
}

export function usePoolsSafe(params: UsePoolsSafeParams): PoolsSafeResult {
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [fallbackData, setFallbackData] = useState<UseTripOffersReturn | null>(null);

  // Try to use the pools hook first
  let poolsResult: PoolsHookResult | null = null;
  let poolsError: Error | null = null;

  try {
    poolsResult = useTripOffersPools(params);
  } catch (error) {
    poolsError = error as Error;
    logger.error('[usePoolsSafe] Pools hook failed:', error);
  }

  // Fallback to legacy hook if pools failed
  const legacyResult = useTripOffers({ 
    tripId: params.tripId,
    initialTripDetails: undefined 
  });

  useEffect(() => {
    if (poolsError && !isUsingFallback) {
      setIsUsingFallback(true);
      setFallbackData(legacyResult);
      
      toast({
        title: "Loading issue detected",
        description: "Having trouble loading pools—showing full list instead.",
        variant: "destructive"
      });

      // Aggressive cache recovery for suspected cache corruption
      if (poolsError?.message?.includes('cache') || poolsError?.message?.includes('stale')) {
        clearUnifiedCache();
        logger.info("[usePoolsSafe] Cache cleared due to suspected corruption:", poolsError.message);
      } else {
        // Clear cache for any pools error to prevent persistence
        clearUnifiedCache();
        logger.info("[usePoolsSafe] Cache cleared due to pools error:", poolsError.message);
      }
    }
  }, [poolsError, isUsingFallback, legacyResult]);

  // If we're using fallback, return legacy data in pools format
  if (isUsingFallback && fallbackData) {
    // Convert legacy offers to ScoredOffer format
    const convertedOffers: ScoredOffer[] = fallbackData.offers.map(offer => ({
      ...offer,
      score: 1,
      priceStructure: {
        base: offer.price,
        carryOnFee: 0,
        total: offer.price
      },
      carryOnIncluded: offer.baggage_included || false,
      reasons: ['Legacy fallback offer'],
      pool: 1
    }));

    return {
      pool1: convertedOffers,
      pool2: [],
      pool3: [],
      budget: fallbackData.tripDetails?.budget || 1000,
      maxBudget: fallbackData.tripDetails?.max_price || 3000,
      dateRange: {
        from: fallbackData.tripDetails?.earliest_departure || "",
        to: fallbackData.tripDetails?.latest_departure || ""
      },
      bumpsUsed: 0,
      bumpBudget: () => {},
      mode: 'manual' as const,
      isLoading: fallbackData.isLoading,
      hasError: fallbackData.hasError,
      errorMessage: fallbackData.errorMessage,
      refreshPools: async () => {
        await fallbackData.refreshOffers();
      },
      isUsingFallback: true
    };
  }

  // Return pools result if available
  if (poolsResult) {
    return {
      ...poolsResult,
      isUsingFallback: false
    };
  }

  // Default fallback state while loading
  return {
    pool1: [],
    pool2: [],
    pool3: [],
    budget: 1000,
    maxBudget: 3000,
    dateRange: { from: "", to: "" },
    bumpsUsed: 0,
    bumpBudget: () => {},
    mode: 'manual' as const,
    isLoading: true,
    hasError: false,
    errorMessage: "",
    refreshPools: async () => {},
    isUsingFallback: false
  };
}

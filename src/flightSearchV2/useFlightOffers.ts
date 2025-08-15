import { useState, useEffect, useRef } from 'react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { getFlightOffers } from '@/serverActions/getFlightOffers';
import { mapFlightOfferDbRowToV2 } from './utils/mapFlightOfferDbRowToV2';
import type { FlightOfferV2, FlightOfferV2DbRow } from './types';

export interface UseFlightOffersOptions {
  // If false, the hook will not run the fetch operation.
  enabled?: boolean;
}

export interface UseFlightOffersResult {
  offers: FlightOfferV2[];
  isLoading: boolean;
  error: Error | null;
  isFeatureEnabled: boolean;
  refetch: () => void;
}

const initialState = {
  offers: [],
  isLoading: false,
  error: null,
};

export function useFlightOffers(
  tripRequestId: string,
  opts: UseFlightOffersOptions = {}
): UseFlightOffersResult {
  const { enabled: optionEnabled = true } = opts;

  // The useFeatureFlag hook returns a boolean (isEnabled) and handles its own loading state internally.
  // It returns `defaultValue` (false by default) while its internal loading state is true.
  // So, `isFeatureFlagEnabled` will be true only if the flag is loaded and true.
  const isFeatureFlagEnabled = useFeatureFlag('flight_search_v2_enabled', false);

  const [offers, setOffers] = useState<FlightOfferV2[]>(initialState.offers);
  const [isLoading, setLoading] = useState<boolean>(initialState.isLoading);
  const [error, setError] = useState<Error | null>(initialState.error);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const latestOffersRef = useRef<FlightOfferV2[]>(initialState.offers);
  const prevTripIdRef = useRef<string | null>(null);

  const refetch = () => {
    setFetchTrigger(prev => prev + 1);
  };

  const isValidTripRequestId = tripRequestId && typeof tripRequestId === 'string';

  // Local persistence helpers
  const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
  const cacheKey = isValidTripRequestId ? `flightOffers:${tripRequestId}` : '';
  const makeCacheKey = (id: string) => `flightOffers:${id}`;

  const readCache = (): FlightOfferV2[] | null => {
    if (!isBrowser || !cacheKey) return null;
    try {
      const raw = localStorage.getItem(cacheKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { ts: number; offers: FlightOfferV2[] };
      if (!parsed?.ts || !Array.isArray(parsed.offers)) return null;
      if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
      return parsed.offers;
    } catch {
      return null;
    }
  };

  const writeCache = (val: FlightOfferV2[]) => {
    if (!isBrowser || !cacheKey) return;
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), offers: val }));
    } catch {
      // ignore quota or serialization errors
    }
  };

  useEffect(() => {
    // Only proceed if feature is enabled, hook is enabled via options, and tripRequestId is valid.
    if (!isFeatureFlagEnabled || !optionEnabled) {
      setOffers(initialState.offers);
      setLoading(false);
      setError(null);
      return;
    }

    if (!isValidTripRequestId) {
      setError(new Error('Invalid tripRequestId provided.'));
      setOffers(initialState.offers);
      setLoading(false);
      return;
    }

    const abortController = new AbortController();

    // If tripId changed since last run, clear cache for the previous trip to avoid stale carryover
    if (prevTripIdRef.current && prevTripIdRef.current !== tripRequestId && isBrowser) {
      try {
        localStorage.removeItem(makeCacheKey(prevTripIdRef.current));
      } catch {}
    }
    prevTripIdRef.current = tripRequestId;

    // Hydrate from cache immediately if available
    const cached = readCache();
    if (cached && cached.length > 0) {
      setOffers(cached);
      latestOffersRef.current = cached;
    }

    const fetchOffersData = async () => {
      setLoading(true);
      setError(null);

      try {
        // If this is a refetch (fetchTrigger > 0), force refresh to trigger flight search
        const shouldRefresh = fetchTrigger > 0;
        const dbRows: FlightOfferV2DbRow[] = await getFlightOffers({
          tripRequestId,
          refresh: shouldRefresh,
          useCache: true
        });

        if (abortController.signal.aborted) {
          return;
        }

        const mappedOffers = dbRows.map(mapFlightOfferDbRowToV2);
        // Only update state if the payload actually changed to avoid flicker/rerenders
        const same = areOfferListsEqual(latestOffersRef.current, mappedOffers);
        if (!same) {
          setOffers(mappedOffers);
          latestOffersRef.current = mappedOffers;
          writeCache(mappedOffers);
        }
      } catch (e) {
        if (abortController.signal.aborted) {
          return;
        }
        console.error('Error fetching or processing flight offers v2:', e);
        setError(e instanceof Error ? e : new Error('An unknown error occurred'));
        // keep any cached offers that were shown; avoid clearing to empty here
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchOffersData();

    return () => {
      abortController.abort();
    };
  }, [tripRequestId, optionEnabled, isFeatureFlagEnabled, isValidTripRequestId, fetchTrigger]);

  // Refetch on focus/visibility change
  useEffect(() => {
    if (!isFeatureFlagEnabled || !optionEnabled || !isValidTripRequestId) return;
    const onFocus = () => {
      // trigger a gentle refetch; existing offers remain until new data arrives
      setFetchTrigger((p) => p + 1);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        setFetchTrigger((p) => p + 1);
      }
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isFeatureFlagEnabled, optionEnabled, isValidTripRequestId]);

  // If feature flag is not enabled, return the disabled state.
  if (!isFeatureFlagEnabled) {
    return {
      offers: [],
      isLoading: false,
      error: null,
      isFeatureEnabled: false,
      refetch,
    };
  }

  return {
    offers,
    isLoading,
    error,
    isFeatureEnabled: true,
    refetch,
  };
}

// Shallow equality: compare by length and key price/ids to avoid unnecessary updates
function areOfferListsEqual(a: FlightOfferV2[], b: FlightOfferV2[]) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i] as any;
    const bi = b[i] as any;
    if (ai.id !== bi.id) return false;
    if (ai.priceTotal !== bi.priceTotal) return false;
  }
  return true;
}

// Exporting the mapper as requested by requirements,
// though it's also directly importable from its own module.
export { mapFlightOfferDbRowToV2 };

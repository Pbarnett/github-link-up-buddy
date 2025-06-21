import { supabase } from '@/integrations/supabase/client';
import { FlightOfferV2DbRow } from '@/flightSearchV2/types';

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: FlightOfferV2DbRow[];
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

interface EdgeFunctionError {
  error: string;
}

/**
 * Server action to fetch flight offers for a given trip request ID.
 * It calls the 'flight-offers-v2' Supabase edge function.
 * Implements a 5-minute in-memory cache.
 *
 * @param tripRequestId The ID of the trip request.
 * @returns A promise that resolves to an array of FlightOfferV2DbRow objects.
 * @throws Will throw an error if the fetch fails or the edge function returns an error.
 */
export const getFlightOffers = async (tripRequestId: string): Promise<FlightOfferV2DbRow[]> => {
  const cachedEntry = cache.get(tripRequestId);
  if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_DURATION_MS)) {
    console.log(`[ServerAction/getFlightOffers] Cache hit for tripRequestId: ${tripRequestId}`);
    return cachedEntry.data;
  }

  console.log(`[ServerAction/getFlightOffers] Cache miss or stale for tripRequestId: ${tripRequestId}. Fetching...`);

  const { data, error } = await supabase.functions.invoke('flight-offers-v2', {
    body: { tripRequestId },
  });

  if (error) {
    console.error(`[ServerAction/getFlightOffers] Error invoking edge function 'flight-offers-v2' for tripRequestId ${tripRequestId}:`, error);
    throw new Error(`Failed to fetch flight offers v2: ${error.message}`);
  }

  // The edge function returns the data directly (which should be FlightOfferV2DbRow[])
  // or an object with an error property, e.g. { error: "message" }
  // Supabase client's `invoke` might also wrap this. Let's assume `data` is the array if no `error`.
  // The edge function can return FlightOfferV2DbRow[] or EdgeFunctionError.
  // The `error` object from `supabase.functions.invoke` handles network/function-level errors.
  // The `data` object contains the actual JSON response from the function if the invocation itself was successful.

  if (data) {
    if (Array.isArray(data)) {
      // Successfully fetched data
      cache.set(tripRequestId, { data, timestamp: Date.now() });
      return data as FlightOfferV2DbRow[];
    } else if (typeof (data as EdgeFunctionError).error === 'string') {
      // Edge function returned a structured error like { error: "message" }
      const functionError = data as EdgeFunctionError;
      console.error(`[ServerAction/getFlightOffers] Edge function returned an error for tripRequestId ${tripRequestId}:`, functionError.error);
      throw new Error(`Failed to fetch flight offers v2: ${functionError.error}`);
    }
  }

  // If data is null (but no supabase error), or if data is not an array and not a known error structure
  console.error(`[ServerAction/getFlightOffers] Unexpected response structure from edge function for tripRequestId ${tripRequestId}:`, data);
  throw new Error('Unexpected response structure from flight offers v2 function.');
};

/**
 * Clears the in-memory cache for getFlightOffers.
 * Primarily useful for testing or specific cache invalidation scenarios.
 */
export const clearGetFlightOffersCache = () => {
  cache.clear();
  console.log('[ServerAction/getFlightOffers] Cache cleared.');
};

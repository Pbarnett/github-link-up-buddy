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
 * If refresh=true, triggers a new search via edge function before reading from database.
 * Otherwise, reads directly from flight_offers_v2 table with 5-minute in-memory cache.
 *
 * @param tripRequestId The ID of the trip request.
 * @param refresh Optional flag to trigger new search before reading data.
 * @returns A promise that resolves to an array of FlightOfferV2DbRow objects.
 * @throws Will throw an error if the fetch fails or the edge function returns an error.
 */
export const getFlightOffers = async (tripRequestId: string, refresh = false): Promise<FlightOfferV2DbRow[]> => {
  // If refresh is requested, invalidate cache and trigger new search
  if (refresh) {
    console.log(`[ServerAction/getFlightOffers] Refresh requested for tripRequestId: ${tripRequestId}. Invalidating cache and triggering new search.`);
    cache.delete(tripRequestId);
    
    // Trigger new search via edge function
    const { data: searchData, error: searchError } = await supabase.functions.invoke('flight-search-v2', {
      body: { tripRequestId },
    });
    
    if (searchError) {
      console.error(`[ServerAction/getFlightOffers] Error invoking flight-search-v2 for tripRequestId ${tripRequestId}:`, searchError);
      throw new Error(`Failed to trigger flight search v2: ${searchError.message}`);
    }
    
    console.log(`[ServerAction/getFlightOffers] Flight search triggered for tripRequestId: ${tripRequestId}:`, searchData);
  }

  // Check cache first (unless refresh was requested, in which case cache was cleared)
  const cachedEntry = cache.get(tripRequestId);
  if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_DURATION_MS)) {
    console.log(`[ServerAction/getFlightOffers] Cache hit for tripRequestId: ${tripRequestId}`);
    return cachedEntry.data;
  }

  console.log(`[ServerAction/getFlightOffers] Cache miss or stale for tripRequestId: ${tripRequestId}. Reading from database...`);

  // Read directly from flight_offers_v2 table
  const { data, error } = await supabase
    .from('flight_offers_v2')
    .select('*')
    .eq('trip_request_id', tripRequestId);

  if (error) {
    console.error(`[ServerAction/getFlightOffers] Error reading from flight_offers_v2 table for tripRequestId ${tripRequestId}:`, error);
    throw new Error(`Failed to fetch flight offers v2: ${error.message}`);
  }

  // Cache and return the data
  const offers = data as FlightOfferV2DbRow[];
  cache.set(tripRequestId, { data: offers, timestamp: Date.now() });
  return offers;
};

/**
 * Clears the in-memory cache for getFlightOffers.
 * Primarily useful for testing or specific cache invalidation scenarios.
 */
export const clearGetFlightOffersCache = () => {
  cache.clear();
  console.log('[ServerAction/getFlightOffers] Cache cleared.');
};

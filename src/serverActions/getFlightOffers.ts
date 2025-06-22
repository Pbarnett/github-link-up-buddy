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
 * @param refresh Optional boolean. If true, bypasses cache and calls the 'flight-search-v2' edge function
 *                to refresh data before fetching from 'flight-offers-v2'.
 * @returns A promise that resolves to an array of FlightOfferV2DbRow objects.
 * @throws Will throw an error if the fetch fails or the edge function returns an error.
 */
export const getFlightOffers = async (
  tripRequestId: string,
  refresh: boolean = false
): Promise<FlightOfferV2DbRow[]> => {
  if (refresh) {
    console.log(`[ServerAction/getFlightOffers] Refresh requested for tripRequestId: ${tripRequestId}. Invoking flight-search-v2...`);
    // Call the new flight-search-v2 edge function to update offers
    // We expect this function to populate/update the flight_offers_v2 table.
    // The response of flight-search-v2 might indicate success/failure or count of inserted items.
    const { data: searchData, error: searchError } = await supabase.functions.invoke('flight-search-v2', {
      body: { tripRequestId }, // Pass tripRequestId, add other params like maxPrice if needed by edge function
    });

    if (searchError) {
      console.error(`[ServerAction/getFlightOffers] Error invoking edge function 'flight-search-v2' for tripRequestId ${tripRequestId}:`, searchError);
      throw new Error(`Failed to refresh flight offers via flight-search-v2: ${searchError.message}`);
    }
    // Log the response from flight-search-v2, e.g., { inserted: number, message: string }
    console.log(`[ServerAction/getFlightOffers] Response from 'flight-search-v2' for tripRequestId ${tripRequestId}:`, searchData);

    // Invalidate cache for this tripRequestId as we've triggered a refresh
    cache.delete(tripRequestId);
    console.log(`[ServerAction/getFlightOffers] Cache invalidated for tripRequestId: ${tripRequestId} after refresh.`);
  }

  const cachedEntry = cache.get(tripRequestId);
  if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_DURATION_MS)) {
    console.log(`[ServerAction/getFlightOffers] Cache hit for tripRequestId: ${tripRequestId}`);
    return cachedEntry.data;
  }

  console.log(`[ServerAction/getFlightOffers] Cache miss or stale for tripRequestId: ${tripRequestId}. Fetching from flight_offers_v2 table...`);

  // This part should ideally fetch from the `flight_offers_v2` table directly,
  // as the edge function `flight-search-v2` is now responsible for populating it.
  // The original logic invoked 'flight-offers-v2' which was assumed to return data.
  // If 'flight-offers-v2' was meant to be the table name and not another function, this needs adjustment.
  // Assuming the plan meant `flight-search-v2` (new) populates, and this function reads from the table.

  // Let's adjust to read from the table `flight_offers_v2`
  const { data: tableData, error: tableError } = await supabase
    .from('flight_offers_v2')
    .select('*')
    .eq('trip_request_id', tripRequestId);

  if (tableError) {
    console.error(`[ServerAction/getFlightOffers] Error fetching from 'flight_offers_v2' table for tripRequestId ${tripRequestId}:`, tableError);
    throw new Error(`Failed to fetch flight offers from table: ${tableError.message}`);
  }

  if (tableData) {
    // Successfully fetched data from table
    cache.set(tripRequestId, { data: tableData as FlightOfferV2DbRow[], timestamp: Date.now() });
    return tableData as FlightOfferV2DbRow[];
  }

  // Should not happen if tableError is not thrown, but as a fallback
  console.error(`[ServerAction/getFlightOffers] Unexpected: No data and no error from 'flight_offers_v2' table for tripRequestId ${tripRequestId}.`);
  return []; // Return empty array if no data found, or handle as error if appropriate
};

/**
 * Clears the in-memory cache for getFlightOffers.
 * Primarily useful for testing or specific cache invalidation scenarios.
 */
export const clearGetFlightOffersCache = () => {
  cache.clear();
  console.log('[ServerAction/getFlightOffers] Cache cleared.');
};

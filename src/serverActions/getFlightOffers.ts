import { supabase } from '@/integrations/supabase/client';
import { FlightOfferV2DbRow } from '@/flightSearchV2/types';
import { Tables } from '@/integrations/supabase/types';

// Legacy flight offer type from flight_offers table
type LegacyFlightOffer = Tables<'flight_offers'>;

// Function to transform legacy format to V2 format
function transformLegacyToV2(legacyOffer: LegacyFlightOffer): FlightOfferV2DbRow {
  // Extract airport codes from full names if needed
  const extractIataCode = (airportName: string | null): string => {
    if (!airportName) return 'UNK';
    // Try to extract 3-letter IATA code (e.g., "JFK" from "John F. Kennedy International (JFK)")
    const match = airportName.match(/\(([A-Z]{3})\)/);
    if (match) return match[1];
    // If no parentheses, assume the whole string is the code if it's 3 letters
    if (airportName.length === 3 && /^[A-Z]{3}$/.test(airportName)) return airportName;
    // Otherwise return first 3 characters or default
    return airportName.substring(0, 3).toUpperCase() || 'UNK';
  };
  
  // Create ISO datetime from date and time
  const createIsoDateTime = (date: string, time: string): string => {
    try {
      // Combine date and time, assume UTC if no timezone info
      const dateTime = `${date}T${time}`;
      return new Date(dateTime).toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  return {
    id: legacyOffer.id,
    trip_request_id: legacyOffer.trip_request_id,
    mode: 'LEGACY', // All legacy offers are marked as LEGACY mode
    price_total: legacyOffer.price || 0,
    price_currency: 'USD', // Default to USD for legacy offers
    price_carry_on: null, // Legacy format doesn't have carry-on pricing
    bags_included: legacyOffer.baggage_included || true,
    cabin_class: null, // Legacy format doesn't specify cabin class
    nonstop: legacyOffer.stops === 0,
    origin_iata: extractIataCode(legacyOffer.origin_airport),
    destination_iata: extractIataCode(legacyOffer.destination_airport),
    depart_dt: createIsoDateTime(legacyOffer.departure_date, legacyOffer.departure_time),
    return_dt: legacyOffer.return_date ? createIsoDateTime(legacyOffer.return_date, legacyOffer.return_time) : null,
    seat_pref: legacyOffer.selected_seat_type,
    created_at: legacyOffer.created_at,
    booking_url: legacyOffer.booking_url || null, // Include booking URL if present in legacy data
  };
}

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
  }

  // Check cache first
  const cachedEntry = cache.get(tripRequestId);
  if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_DURATION_MS)) {
    console.log(`[ServerAction/getFlightOffers] Cache hit for tripRequestId: ${tripRequestId}`);
    return cachedEntry.data;
  }

  console.log(`[ServerAction/getFlightOffers] Cache miss or stale for tripRequestId: ${tripRequestId}. Fetching from flight_offers_v2 table...`);

  // Read from flight_offers_v2 table which has booking URLs
  const { data: v2Data, error: v2Error } = await supabase
    .from('flight_offers_v2')
    .select('*')
    .eq('trip_request_id', tripRequestId);
    
  // If no V2 data, fall back to legacy table and transform
  if (v2Error || !v2Data || v2Data.length === 0) {
    console.log(`[ServerAction/getFlightOffers] No V2 data found, falling back to legacy flight_offers table...`);
    
    const { data: legacyData, error: legacyError } = await supabase
      .from('flight_offers')
      .select('*')
      .eq('trip_request_id', tripRequestId);
      
    if (legacyError) {
      console.error(`[ServerAction/getFlightOffers] Error fetching from 'flight_offers' table for tripRequestId ${tripRequestId}:`, legacyError);
      throw new Error(`Failed to fetch flight offers from table: ${legacyError.message}`);
    }
    
    if (legacyData) {
      // Transform legacy data to V2 format
      const transformedData = (legacyData as LegacyFlightOffer[]).map(transformLegacyToV2);
      console.log(`[ServerAction/getFlightOffers] Transformed ${transformedData.length} legacy offers to V2 format`);
      
      // Cache the transformed data
      cache.set(tripRequestId, { data: transformedData, timestamp: Date.now() });
      return transformedData;
    }
    
    return []; // No data found in either table
  }

  // If we have V2 data, use it directly
  if (v2Data && v2Data.length > 0) {
    console.log(`[ServerAction/getFlightOffers] Found ${v2Data.length} offers in flight_offers_v2 table`);
    
    // Cache the V2 data
    cache.set(tripRequestId, { data: v2Data as FlightOfferV2DbRow[], timestamp: Date.now() });
    return v2Data as FlightOfferV2DbRow[];
  }

  // No data found in either table
  console.log(`[ServerAction/getFlightOffers] No flight offers found for tripRequestId ${tripRequestId}`);
  return []

};

/**
 * Clears the in-memory cache for getFlightOffers.
 * Primarily useful for testing or specific cache invalidation scenarios.
 */
export const clearGetFlightOffersCache = () => {
  cache.clear();
  console.log('[ServerAction/getFlightOffers] Cache cleared.');
};

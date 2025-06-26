
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Type for flight offers from the database (now using V2 table)
export type Offer = {
  id: string;
  trip_request_id: string;
  price: number;
  airline: string;
  flight_number: string;
  departure_date: string;
  departure_time: string;
  return_date: string;
  return_time: string;
  duration: string;
  booking_url?: string;
  carrier_code?: string;
  origin_airport?: string;
  destination_airport?: string;
  // V2 table fields
  price_total?: number;
  price_currency?: string;
  cabin_class?: string;
  nonstop?: boolean;
  bags_included?: boolean;
  mode?: string;
  created_at?: string;
};

/**
 * Transform V2 offer to legacy format for compatibility
 */
function transformV2ToLegacy(v2Offer: any): Offer {
  // Extract IATA code from longer airport codes
  const extractIataCode = (airportCode: string): string => {
    if (!airportCode) return '';
    return airportCode.length > 3 ? airportCode.substring(0, 3) : airportCode;
  };

  // Convert ISO datetime to date and time components
  const parseDateTime = (isoString: string) => {
    if (!isoString) return { date: '', time: '' };
    try {
      const date = new Date(isoString);
      return {
        date: date.toISOString().split('T')[0], // YYYY-MM-DD
        time: date.toTimeString().split(' ')[0].substring(0, 5) // HH:MM
      };
    } catch {
      return { date: '', time: '' };
    }
  };

  const departure = parseDateTime(v2Offer.depart_dt);
  const returnInfo = parseDateTime(v2Offer.return_dt);

  return {
    id: v2Offer.id,
    trip_request_id: v2Offer.trip_request_id,
    price: v2Offer.price_total || 0,
    airline: extractIataCode(v2Offer.origin_iata) + '-' + extractIataCode(v2Offer.destination_iata), // Simplified airline representation
    flight_number: 'V2-' + v2Offer.id.substring(0, 8), // Generated flight number
    departure_date: departure.date,
    departure_time: departure.time,
    return_date: returnInfo.date,
    return_time: returnInfo.time,
    duration: '1 day', // Simplified duration
    booking_url: v2Offer.booking_url,
    carrier_code: extractIataCode(v2Offer.origin_iata),
    origin_airport: v2Offer.origin_iata,
    destination_airport: v2Offer.destination_iata,
    // Pass through V2 fields
    price_total: v2Offer.price_total,
    price_currency: v2Offer.price_currency,
    cabin_class: v2Offer.cabin_class,
    nonstop: v2Offer.nonstop,
    bags_included: v2Offer.bags_included,
    mode: v2Offer.mode,
    created_at: v2Offer.created_at,
  };
}

/**
 * Fetches all flight offers for a given trip request ID
 * First tries flight_offers_v2 table, then falls back to legacy flight_offers table
 * @param tripRequestId - The UUID of the trip request
 * @returns Promise<Offer[]> - Array of flight offers
 */
export async function fetchTripOffers(tripRequestId: string): Promise<Offer[]> {
  console.log('[🔍 DB-DEBUG] Fetching trip offers for tripRequestId:', tripRequestId);
  
  // First get the trip request to determine if it's round-trip
  const { data: tripRequest, error: tripError } = await supabase
    .from('trip_requests')
    .select('return_date')
    .eq('id', tripRequestId)
    .single();

  if (tripError) {
    console.warn('[🔍 DB-DEBUG] Could not fetch trip request details for filtering:', tripError.message);
  }

  const isRoundTripRequest = !!(tripRequest?.return_date);
  console.log(`[🔍 DB-DEBUG] Trip request is ${isRoundTripRequest ? 'round-trip' : 'one-way'}`);
  
  // Build query for flight_offers_v2 table with round-trip filtering
  let v2Query = supabase
    .from('flight_offers_v2')
    .select('*')
    .eq('trip_request_id', tripRequestId);

  // Apply round-trip filtering at the database level for V2 table
  if (isRoundTripRequest) {
    v2Query = v2Query.not('return_dt', 'is', null);
    console.log('[🔍 DB-DEBUG] Applied round-trip filter to V2 query (return_dt IS NOT NULL)');
  }

  const { data: v2Data, error: v2Error } = await v2Query.order('price_total', { ascending: true });

  if (!v2Error && v2Data && v2Data.length > 0) {
    console.log(`[🔍 DB-DEBUG] Found ${v2Data.length} ${isRoundTripRequest ? 'round-trip' : 'any'} offers in flight_offers_v2 table`);
    
    // Transform V2 data to legacy format for compatibility
    const transformedOffers = v2Data.map(transformV2ToLegacy);
    
    console.log('[🔍 DB-DEBUG] Sample V2 offers (transformed):', transformedOffers.slice(0, 2));
    return transformedOffers;
  }

  // Fall back to legacy flight_offers table
  console.log('[🔍 DB-DEBUG] No V2 offers found, checking legacy flight_offers table...');
  
  // Build query for legacy table with round-trip filtering
  let legacyQuery = supabase
    .from('flight_offers')
    .select('*')
    .eq('trip_request_id', tripRequestId);

  // Apply round-trip filtering at the database level for legacy table
  if (isRoundTripRequest) {
    legacyQuery = legacyQuery.not('return_date', 'is', null);
    console.log('[🔍 DB-DEBUG] Applied round-trip filter to legacy query (return_date IS NOT NULL)');
  }
  
  const { data: legacyData, error: legacyError } = await legacyQuery.order('price', { ascending: true });

  console.log('[🔍 DB-DEBUG] Legacy table response:', { data: legacyData, error: legacyError, count: legacyData?.length || 0 });

  if (legacyError) {
    console.error('[🔍 DB-DEBUG] Error fetching from both tables:', { v2Error, legacyError });
    throw new Error(`Failed to fetch trip offers: ${legacyError.message}`);
  }

  const offers = (legacyData || []) as Offer[];
  console.log(`[🔍 DB-DEBUG] Successfully fetched ${offers.length} offers from legacy table`);
  
  // Log first few offers for debugging
  if (offers.length > 0) {
    console.log('[🔍 DB-DEBUG] Sample legacy offers:', offers.slice(0, 3));
  }

  return offers;
}

/**
 * Creates a new flight offer
 * @param offer - The offer data to create
 * @returns Promise<Offer> - The created offer
 */
export async function createTripOffer(offer: Omit<Offer, 'id' | 'created_at'>): Promise<Offer> {
  const { data, error } = await supabase
    .from('flight_offers')
    .insert([offer])
    .select()
    .single();

  if (error) {
    console.error('Error creating trip offer:', error);
    throw new Error(`Failed to create trip offer: ${error.message}`);
  }

  return data as Offer;
}


import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { FilterFactory, createFilterContext, normalizeOffers } from "@/lib/filtering";

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
 * Fetches all flight offers for a given trip request ID with comprehensive filtering
 * First tries flight_offers_v2 table, then falls back to legacy flight_offers table
 * Applies the new filtering architecture for consistent, robust filtering
 * @param tripRequestId - The UUID of the trip request
 * @param filterOptions - Optional filtering parameters (budget, nonstop, etc.)
 * @returns Promise<Offer[]> - Array of filtered flight offers
 */
export async function fetchTripOffers(
  tripRequestId: string,
  filterOptions?: {
    budget?: number;
    currency?: string;
    nonstop?: boolean;
    pipelineType?: 'standard' | 'budget' | 'fast';
  }
): Promise<Offer[]> {
  console.log('[🔍 SERVICE] Fetching trip offers for tripRequestId:', tripRequestId);
  console.log('[🔍 SERVICE] Filter options:', filterOptions);
  
  // Get comprehensive trip request details for filtering context
  const { data: tripRequest, error: tripError } = await supabase
    .from('trip_requests')
    .select('*')
    .eq('id', tripRequestId)
    .single();

  if (tripError) {
    console.warn('[🔍 SERVICE] Could not fetch trip request details for filtering:', tripError.message);
    throw new Error(`Failed to fetch trip request: ${tripError.message}`);
  }

  if (!tripRequest) {
    throw new Error(`Trip request not found: ${tripRequestId}`);
  }

  const isRoundTripRequest = !!(tripRequest.return_date);
  console.log(`[🔍 SERVICE] Trip request is ${isRoundTripRequest ? 'round-trip' : 'one-way'}`);
  
  // Fetch raw offers from V2 table first (without database-level filtering)
  const v2Query = supabase
    .from('flight_offers_v2')
    .select('*')
    .eq('trip_request_id', tripRequestId);

  const { data: v2Data, error: v2Error } = await v2Query.order('price_total', { ascending: true });

  let rawOffers: any[] = [];
  let usingV2Table = false;

  if (!v2Error && v2Data && v2Data.length > 0) {
    console.log(`[🔍 SERVICE] Found ${v2Data.length} raw offers in flight_offers_v2 table`);
    rawOffers = v2Data;
    usingV2Table = true;
  } else {
    // Fall back to legacy flight_offers table
    console.log('[🔍 SERVICE] No V2 offers found, checking legacy flight_offers table...');
    
    const { data: legacyData, error: legacyError } = await supabase
      .from('flight_offers')
      .select('*')
      .eq('trip_request_id', tripRequestId)
      .order('price', { ascending: true });

    if (legacyError) {
      console.error('[🔍 SERVICE] Error fetching from both tables:', { v2Error, legacyError });
      throw new Error(`Failed to fetch trip offers: ${legacyError.message}`);
    }

    rawOffers = legacyData || [];
    usingV2Table = false;
  }

  console.log(`[🔍 SERVICE] Retrieved ${rawOffers.length} raw offers from ${usingV2Table ? 'V2' : 'legacy'} table`);

  if (rawOffers.length === 0) {
    console.log('[🔍 SERVICE] No offers found, returning empty array');
    return [];
  }

  // Apply new filtering architecture
  try {
    // Create filter context from trip request and options
    const filterContext = createFilterContext({
      tripType: isRoundTripRequest ? 'roundtrip' : 'oneway',
      origin: tripRequest.origin_iata || tripRequest.origin || '',
      destination: tripRequest.destination_iata || tripRequest.destination || '',
      departureDate: tripRequest.departure_date || '',
      returnDate: tripRequest.return_date || undefined,
      budget: filterOptions?.budget || tripRequest.budget,
      currency: filterOptions?.currency || tripRequest.currency || 'USD',
      nonstop: filterOptions?.nonstop ?? tripRequest.nonstop ?? false,
      passengers: tripRequest.passengers || 1,
    });

    console.log('[🔍 SERVICE] Created filter context:', {
      tripType: filterContext.tripType,
      budget: filterContext.budget,
      currency: filterContext.currency,
      nonstop: filterContext.nonstop,
      offerCount: rawOffers.length
    });

    // Normalize offers to unified format
    let normalizedOffers;
    
    if (usingV2Table) {
      // V2 table has a different structure - convert directly without provider adapters
      normalizedOffers = rawOffers.map(v2Offer => {
        // Handle both direct price_total and nested price.total structures
        let basePrice = 0;
        if (v2Offer.price_total) {
          basePrice = parseFloat(v2Offer.price_total.toString());
        } else if (v2Offer.price?.total) {
          basePrice = parseFloat(v2Offer.price.total.toString());
        }
        
        const carryOnFee = parseFloat(v2Offer.price_carry_on || '0');
        
        // For round-trip offers, create 2 itineraries; for one-way, create 1
        const itineraries = [];
        
        // Always add outbound itinerary
        itineraries.push({
          duration: 'N/A', // V2 table doesn't store duration
          segments: [{
            departure: {
              iataCode: v2Offer.origin_iata,
              at: v2Offer.depart_dt
            },
            arrival: {
              iataCode: v2Offer.destination_iata,
              at: v2Offer.depart_dt // Simulate arrival time same day for simplicity
            },
            carrierCode: 'Unknown',
            flightNumber: 'N/A',
            duration: 'N/A',
            numberOfStops: v2Offer.nonstop ? 0 : 1
          }]
        });
        
        // For round-trip, add return itinerary
        if (v2Offer.return_dt && isRoundTripRequest) {
          itineraries.push({
            duration: 'N/A',
            segments: [{
              departure: {
                iataCode: v2Offer.destination_iata,
                at: v2Offer.return_dt
              },
              arrival: {
                iataCode: v2Offer.origin_iata,
                at: v2Offer.return_dt // Simulate arrival time same day for simplicity
              },
              carrierCode: 'Unknown',
              flightNumber: 'N/A',
              duration: 'N/A',
              numberOfStops: v2Offer.nonstop ? 0 : 1
            }]
          });
        }
        
        return {
          provider: 'Amadeus',
          id: v2Offer.id,
          itineraries,
          totalBasePrice: basePrice,
          currency: v2Offer.price_currency || 'USD',
          carryOnIncluded: v2Offer.bags_included || false,
          carryOnFee: carryOnFee || 0,
          totalPriceWithCarryOn: basePrice + (carryOnFee || 0),
          stopsCount: v2Offer.nonstop ? 0 : 1,
          validatingAirlines: [],
          bookingUrl: v2Offer.booking_url,
          rawData: v2Offer
        };
      });
    } else {
      // Use provider adapters for legacy data
      const formattedOffers = rawOffers.map(offer => ({
        data: offer,
        provider: 'Amadeus' as 'Amadeus' | 'Duffel'
      }));
      normalizedOffers = normalizeOffers(formattedOffers, filterContext);
    }
    console.log(`[🔍 SERVICE] Normalized ${normalizedOffers.length} offers`);

    // Create and execute filtering pipeline
    const pipelineType = filterOptions?.pipelineType || 'standard';
    const filterPipeline = FilterFactory.createPipeline(pipelineType);
    
    console.log(`[🔍 SERVICE] Executing ${pipelineType} filtering pipeline with ${filterPipeline.getFilters().length} filters`);
    
    const pipelineResult = await filterPipeline.execute(normalizedOffers, filterContext);
    
    console.log(`[🔍 SERVICE] Filtering completed: ${rawOffers.length} → ${pipelineResult.filteredOffers.length} offers`);
    
    // Transform filtered offers back to service format
    const transformedOffers = pipelineResult.filteredOffers.map(offer => {
      if (usingV2Table) {
        // Find original V2 offer to get complete data
        const originalOffer = rawOffers.find(raw => raw.id === offer.id);
        return originalOffer ? transformV2ToLegacy(originalOffer) : transformUnifiedToLegacy(offer);
      } else {
        // For legacy offers, find original and return as-is
        const originalOffer = rawOffers.find(raw => raw.id === offer.id);
        return originalOffer as Offer || transformUnifiedToLegacy(offer);
      }
    });

    console.log(`[🔍 SERVICE] Successfully processed ${transformedOffers.length} filtered offers`);
    
    // Log sample of final offers for debugging
    if (transformedOffers.length > 0) {
      console.log('[🔍 SERVICE] Sample filtered offers:', transformedOffers.slice(0, 2).map(o => ({
        id: o.id,
        price: o.price,
        airline: o.airline,
        nonstop: o.nonstop
      })));
    }

    return transformedOffers;

  } catch (filterError) {
    console.error('[🔍 SERVICE] Error during filtering:', filterError);
    
    // Fallback: return raw offers transformed to legacy format
    console.log('[🔍 SERVICE] Falling back to raw offers without filtering');
    
    if (usingV2Table) {
      const fallbackOffers = rawOffers.map(transformV2ToLegacy);
      // Apply basic round-trip filtering as fallback
      return isRoundTripRequest 
        ? fallbackOffers.filter(offer => offer.return_date && offer.return_date.trim() !== '')
        : fallbackOffers;
    } else {
      const fallbackOffers = rawOffers as Offer[];
      // Apply basic round-trip filtering as fallback
      return isRoundTripRequest 
        ? fallbackOffers.filter(offer => offer.return_date && offer.return_date.trim() !== '')
        : fallbackOffers;
    }
  }
}

/**
 * Transform unified offer format back to legacy format
 * Used when original offer data is not available
 */
function transformUnifiedToLegacy(unifiedOffer: any): Offer {
  const parseDateTime = (isoString: string) => {
    if (!isoString) return { date: '', time: '' };
    try {
      const date = new Date(isoString);
      return {
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().split(' ')[0].substring(0, 5)
      };
    } catch {
      return { date: '', time: '' };
    }
  };

  const departure = parseDateTime(unifiedOffer.segments?.[0]?.departure?.at || '');
  const returnInfo = parseDateTime(unifiedOffer.segments?.[1]?.departure?.at || '');

  return {
    id: unifiedOffer.id,
    trip_request_id: unifiedOffer.tripRequestId || '',
    price: unifiedOffer.totalAmount || 0,
    airline: unifiedOffer.segments?.[0]?.marketingCarrier?.name || 'Unknown',
    flight_number: unifiedOffer.segments?.[0]?.marketingCarrier?.flightNumber || 'N/A',
    departure_date: departure.date,
    departure_time: departure.time,
    return_date: returnInfo.date,
    return_time: returnInfo.time,
    duration: unifiedOffer.duration || 'N/A',
    booking_url: unifiedOffer.bookingUrl,
    carrier_code: unifiedOffer.segments?.[0]?.marketingCarrier?.iataCode,
    origin_airport: unifiedOffer.segments?.[0]?.origin?.iataCode,
    destination_airport: unifiedOffer.segments?.[0]?.destination?.iataCode,
    price_total: unifiedOffer.totalAmount,
    price_currency: unifiedOffer.currency,
    cabin_class: unifiedOffer.cabinClass,
    nonstop: unifiedOffer.isNonstop,
    bags_included: unifiedOffer.bagsIncluded,
    mode: 'filtered',
  };
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

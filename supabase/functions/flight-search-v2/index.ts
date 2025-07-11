
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getAmadeusAccessToken, priceWithAmadeus } from '../lib/amadeus.ts';

// Import the Deno-compatible filtering system
import {
  createFilterContext,
  normalizeOffers,
  FilterFactory,
  type FlightOffer,
  type FilterContext,
  type FilterResult
} from '../_shared/filtering.ts';

// Define a type for the expected request payload
interface FlightSearchRequest {
  tripRequestId: string;
  // Potentially add other parameters like maxPrice, preferredCabin, etc.
  // For now, keeping it simple as per initial requirements.
  maxPrice?: number;
}

// Define a type for Amadeus API responses (simplified mock)
interface AmadeusFlightOffer {
  id: string; // Amadeus offer ID
  source: string; // e.g., "GDS"
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: { iataCode: string; terminal?: string; at: string };
      arrival: { iataCode: string; terminal?: string; at: string };
      carrierCode: string;
      number: string;
      aircraft: { code: string };
      operating?: { carrierCode: string };
      duration: string;
      id: string;
      numberOfStops: number;
      blacklistedInEU: boolean;
    }>;
  }>;
  price: {
    currency: string;
    total: string; // Amadeus returns price as string
    base: string;
    fees?: Array<{ amount: string; type: string }>;
    grandTotal?: string; // Often same as total
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBags?: { quantity: number };
    // ... other options
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: { currency: string; total: string; base: string };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string; // e.g., "ECONOMY", "BUSINESS"
      fareBasis: string;
      brandedFare?: string;
      class: string; // Booking class, e.g., "Y"
      includedCheckedBags?: { quantity: number };
      // ... other details
    }>;
  }>;
}


// Define the structure for flight_offers_v2 table (subset of FlightOfferV2DbRow for insertion)
// Assuming 'id' is auto-generated by DB or we generate it.
// 'created_at' is also typically handled by DB (e.g. with now())
interface FlightOfferV2Insert {
  trip_request_id: string;
  mode: 'AUTO' | 'MANUAL'; // Assuming 'AUTO' for Amadeus sourced offers
  price_total: number;
  price_currency: string; // Added from Amadeus response
  price_carry_on?: number | null; // This might not come directly from Amadeus basic offer
  bags_included: boolean;
  cabin_class: string | null;
  nonstop: boolean;
  origin_iata: string;
  destination_iata: string;
  depart_dt: string;   // ISO
  return_dt?: string | null; // For one-way or multi-city, this might be null or handled differently
  booking_url?: string; // External airline booking URL (like Google Flights deeplinks)
  // seat_pref is not typically part of an offer search, but post-booking.
  // external_offer_id to store Amadeus offer ID or similar
  external_offer_id?: string;
  raw_offer_payload?: Record<string, any>; // To store the full Amadeus payload
}


// Placeholder for Amadeus API Client/Fetch logic
// In a real scenario, this would involve actual API calls, error handling, and authentication.
import { searchFlightOffers } from '../lib/amadeus-search.ts';

// Function to get trip request details from database
const getTripRequestDetails = async (tripRequestId: string, supabaseClient: any) => {
  console.log('[DEBUG] Fetching trip request details for:', tripRequestId);
  const { data, error } = await supabaseClient
    .from('trip_requests')
    .select('*')
    .eq('id', tripRequestId)
    .single();

  if (error) {
    console.error('[DEBUG] Error fetching trip request:', error);
    return null;
  }

  console.log('[DEBUG] Trip request data:', JSON.stringify(data, null, 2));
  return data;
};

const fetchAmadeusOffers = async (
  tripRequestId: string,
  maxPrice?: number,
  supabaseClient?: any
): Promise<AmadeusFlightOffer[]> => {
  if (!supabaseClient) {
    throw new Error('Supabase client is required');
  }

  // Fetch trip details from your database
  const tripRequest = await getTripRequestDetails(tripRequestId, supabaseClient);
  if (!tripRequest) {
    throw new Error('Trip request not found');
  }

  console.log('[DEBUG] Attempting to fetch offers from Amadeus...');
  
  try {
    // Try to fetch offers from Amadeus
    const offers = await searchFlightOffers({
      originLocationCode: tripRequest.origin_location_code,
      destinationLocationCode: tripRequest.destination_location_code,
      departureDate: tripRequest.departure_date,
      returnDate: tripRequest.return_date,
      adults: tripRequest.adults || 1,
      travelClass: 'ECONOMY', // Default to economy for now
      nonStop: tripRequest.nonstop_required, // Use required setting directly
      max: 10,  // Limit number of results for performance
    });

    console.log('[DEBUG] Successfully fetched', offers.length, 'offers from Amadeus');
    
    console.log('[DEBUG] Applying new comprehensive filtering architecture...');
    
    // Replace old ad-hoc filtering with new comprehensive filtering system
    try {
      // Create filter context from trip request data
      const filterContext = createFilterContext({
        budget: maxPrice,
        currency: 'USD', // Default to USD, could be extracted from trip request
        originLocationCode: tripRequest.origin_location_code,
        destinationLocationCode: tripRequest.destination_location_code,
        departureDate: tripRequest.departure_date,
        returnDate: tripRequest.return_date,
        nonstopRequired: tripRequest.nonstop_required
      });
      
      // Normalize Amadeus offers to our standard format
      const rawOffers = offers.map(offer => ({ data: offer, provider: 'Amadeus' as const }));
      const normalizedOffers = normalizeOffers(rawOffers, filterContext);
      
      console.log('[DEBUG] Normalized', normalizedOffers.length, 'Amadeus offers to standard format');
      
      // Create the appropriate filtering pipeline based on search parameters
      const pipelineType = FilterFactory.recommendPipelineType({
        budget: maxPrice,
        nonstopRequired: tripRequest.nonstop_required,
        returnDate: tripRequest.return_date
      });
      
      console.log('[DEBUG] Using', pipelineType, 'filtering pipeline');
      
      const pipeline = FilterFactory.createPipeline(pipelineType);
      
      // Execute the filtering pipeline
      const filterResult = await pipeline.execute(normalizedOffers, filterContext);
      
      console.log('[DEBUG] Filtering pipeline results:', {
        originalCount: filterResult.originalCount,
        finalCount: filterResult.finalCount,
        removedCount: filterResult.originalCount - filterResult.finalCount,
        executionTimeMs: filterResult.executionTimeMs,
        filtersApplied: filterResult.filterResults.map(r => r.filterName)
      });
      
      // Log detailed filter execution results
      filterResult.filterResults.forEach(result => {
        console.log(`[DEBUG] ${result.filterName}: ${result.beforeCount} → ${result.afterCount} (removed ${result.removedOffers}, ${result.executionTimeMs}ms)`);
      });
      
      // Convert back to Amadeus format for database insertion
      let filteredOffers = filterResult.filteredOffers.map(offer => offer.rawData || offer);
      
      console.log('[DEBUG] New filtering system processed', offers.length, '→', filteredOffers.length, 'offers in', filterResult.executionTimeMs, 'ms');
      
      return filteredOffers;
      
    } catch (filterError) {
      console.error('[DEBUG] New filtering system failed, falling back to original offers:', filterError);
      // Fallback to unfiltered offers if filtering fails
      return offers;
    }
  } catch (error) {
    console.warn('[DEBUG] Amadeus API failed, falling back to mock data:', error.message);
    
    // Fallback to mock data if Amadeus fails
    return generateMockOffers(tripRequest, maxPrice);
  }
};

// Mock data generator for testing when Amadeus API is unavailable
const generateMockOffers = (tripRequest: any, maxPrice?: number): AmadeusFlightOffer[] => {
  console.log('[DEBUG] Generating mock flight offers for testing');
  console.log('[DEBUG] Trip request has return_date:', tripRequest.return_date);
  
  const isRoundTrip = !!tripRequest.return_date;
  const origin = tripRequest.origin_location_code || 'JFK';
  const destination = tripRequest.destination_location_code || 'LAX';
  const departureDate = tripRequest.departure_date || '2024-12-15';
  const returnDate = tripRequest.return_date || '2024-12-18';
  
  // Helper function to create return itinerary
  const createReturnItinerary = (carrierCode: string, flightNumber: string, segmentId: string) => ({
    duration: 'PT6H45M',
    segments: [{
      departure: {
        iataCode: destination,
        terminal: '4',
        at: `${returnDate}T16:00:00`
      },
      arrival: {
        iataCode: origin,
        terminal: '4', 
        at: `${returnDate}T19:45:00`
      },
      carrierCode,
      number: flightNumber,
      aircraft: { code: '321' },
      operating: { carrierCode },
      duration: 'PT6H45M',
      id: segmentId,
      numberOfStops: 0,
      blacklistedInEU: false
    }]
  });
  
  const mockOffers: AmadeusFlightOffer[] = [
    {
      id: 'MOCK_001',
      source: 'GDS',
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: !isRoundTrip,
      lastTicketingDate: '2024-12-31',
      numberOfBookableSeats: 9,
      itineraries: [
        // Outbound itinerary
        {
          duration: 'PT6H30M',
          segments: [{
            departure: {
              iataCode: origin,
              terminal: '4',
              at: `${departureDate}T08:00:00`
            },
            arrival: {
              iataCode: destination,
              terminal: '4',
              at: `${departureDate}T11:30:00`
            },
            carrierCode: 'AA',
            number: '123',
            aircraft: { code: '321' },
            operating: { carrierCode: 'AA' },
            duration: 'PT6H30M',
            id: '1',
            numberOfStops: 0,
            blacklistedInEU: false
          }]
        },
        // Return itinerary (only if round-trip)
        ...(isRoundTrip ? [createReturnItinerary('AA', '124', '2')] : [])
      ],
      price: {
        currency: 'USD',
        total: isRoundTrip ? '625.00' : '325.00',
        base: isRoundTrip ? '550.00' : '275.00',
        fees: [{ amount: isRoundTrip ? '75.00' : '50.00', type: 'SUPPLIER' }]
      },
      pricingOptions: {
        fareType: ['PUBLISHED'],
        includedCheckedBags: { quantity: 0 }
      },
      validatingAirlineCodes: ['AA'],
      travelerPricings: [{
        travelerId: '1',
        fareOption: 'STANDARD',
        travelerType: 'ADULT',
        price: {
          currency: 'USD',
          total: isRoundTrip ? '625.00' : '325.00',
          base: isRoundTrip ? '550.00' : '275.00'
        },
        fareDetailsBySegment: [
          {
            segmentId: '1',
            cabin: 'ECONOMY',
            fareBasis: 'Y',
            class: 'Y',
            includedCheckedBags: { quantity: 0 }
          },
          // Return segment details (only if round-trip)
          ...(isRoundTrip ? [{
            segmentId: '2',
            cabin: 'ECONOMY',
            fareBasis: 'Y',
            class: 'Y',
            includedCheckedBags: { quantity: 0 }
          }] : [])
        ]
      }]
    },
    {
      id: 'MOCK_002',
      source: 'GDS',
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: !isRoundTrip,
      lastTicketingDate: '2024-12-31',
      numberOfBookableSeats: 5,
      itineraries: [
        // Outbound itinerary
        {
          duration: 'PT8H15M',
          segments: [{
            departure: {
              iataCode: origin,
              terminal: 'B',
              at: `${departureDate}T14:30:00`
            },
            arrival: {
              iataCode: destination,
              terminal: '7',
              at: `${departureDate}T19:45:00`
            },
            carrierCode: 'DL',
            number: '456',
            aircraft: { code: '737' },
            operating: { carrierCode: 'DL' },
            duration: 'PT8H15M',
            id: '3',
            numberOfStops: 1,
            blacklistedInEU: false
          }]
        },
        // Return itinerary (only if round-trip)
        ...(isRoundTrip ? [{
          duration: 'PT7H30M',
          segments: [{
            departure: {
              iataCode: destination,
              terminal: '7',
              at: `${returnDate}T10:15:00`
            },
            arrival: {
              iataCode: origin,
              terminal: 'B',
              at: `${returnDate}T14:45:00`
            },
            carrierCode: 'DL',
            number: '457',
            aircraft: { code: '737' },
            operating: { carrierCode: 'DL' },
            duration: 'PT7H30M',
            id: '4',
            numberOfStops: 0,
            blacklistedInEU: false
          }]
        }] : [])
      ],
      price: {
        currency: 'USD',
        total: isRoundTrip ? '579.00' : '289.50',
        base: isRoundTrip ? '490.00' : '245.50',
        fees: [{ amount: isRoundTrip ? '89.00' : '44.00', type: 'SUPPLIER' }]
      },
      pricingOptions: {
        fareType: ['PUBLISHED'],
        includedCheckedBags: { quantity: 1 }
      },
      validatingAirlineCodes: ['DL'],
      travelerPricings: [{
        travelerId: '1',
        fareOption: 'STANDARD',
        travelerType: 'ADULT',
        price: {
          currency: 'USD',
          total: isRoundTrip ? '579.00' : '289.50',
          base: isRoundTrip ? '490.00' : '245.50'
        },
        fareDetailsBySegment: [
          {
            segmentId: '3',
            cabin: 'ECONOMY',
            fareBasis: 'Y',
            class: 'Y',
            includedCheckedBags: { quantity: 1 }
          },
          // Return segment details (only if round-trip)
          ...(isRoundTrip ? [{
            segmentId: '4',
            cabin: 'ECONOMY',
            fareBasis: 'Y', 
            class: 'Y',
            includedCheckedBags: { quantity: 1 }
          }] : [])
        ]
      }]
    }
  ];
  
  // Apply price filter to mock data
  let filteredOffers = mockOffers;
  if (maxPrice !== undefined) {
    filteredOffers = mockOffers.filter(offer => {
      const price = parseFloat(offer.price.total);
      return price <= maxPrice;
    });
  }
  
  console.log('[DEBUG] Generated', filteredOffers.length, 'mock offers');
  return filteredOffers;
};

// Helper function to generate realistic airline booking URLs (for test environment)
const generatePlaceholderBookingUrl = (origin: string, destination: string, departDate: string, returnDate?: string, carrierCode?: string): string => {
  // Generate realistic airline booking URLs that actually work like Google Flights does
  // These will redirect to the actual airline booking pages with pre-filled search parameters
  
  const airlineBookingUrls: Record<string, (origin: string, destination: string, departDate: string, returnDate?: string) => string> = {
    // American Airlines
    'AA': (o, d, dep, ret) => {
      const params = new URLSearchParams({
        from: o,
        to: d,
        departDate: dep,
        ...(ret && { returnDate: ret }),
        passengers: '1',
        cabin: 'coach'
      });
      return `https://www.aa.com/booking/search?${params.toString()}`;
    },
    
    // Delta Airlines  
    'DL': (o, d, dep, ret) => {
      const params = new URLSearchParams({
        originAirport: o,
        destinationAirport: d,
        departureDate: dep,
        ...(ret && { returnDate: ret }),
        passengerCount: '1'
      });
      return `https://www.delta.com/flight-search/book-a-flight?${params.toString()}`;
    },
    
    // United Airlines
    'UA': (o, d, dep, ret) => {
      const params = new URLSearchParams({
        f: o,
        t: d,
        d: dep,
        ...(ret && { r: ret }),
        px: '1',
        cc: 'economy'
      });
      return `https://www.united.com/ual/en/us/flight-search/book-a-flight/results/rev?${params.toString()}`;
    },
    
    // British Airways
    'BA': (o, d, dep, ret) => {
      const params = new URLSearchParams({
        eId: 'flight',
        from: o,
        to: d,
        outboundDate: dep,
        ...(ret && { returnDate: ret }),
        adults: '1',
        cabin: 'M'
      });
      return `https://www.britishairways.com/travel/redeem/public/en_gb?${params.toString()}`;
    },
    
    // Southwest Airlines
    'WN': (o, d, dep, ret) => {
      const params = new URLSearchParams({
        originationAirportCode: o,
        destinationAirportCode: d,
        departureDate: dep,
        ...(ret && { returnDate: ret }),
        adultsCount: '1'
      });
      return `https://www.southwest.com/air/booking/select.html?${params.toString()}`;
    },
    
    // JetBlue
    'B6': (o, d, dep, ret) => {
      const params = new URLSearchParams({
        from: o,
        to: d,
        depart: dep,
        ...(ret && { return: ret }),
        passengers: '1'
      });
      return `https://www.jetblue.com/booking/flight-select?${params.toString()}`;
    }
  };
  
  // Use the specific airline's booking URL if available, otherwise fall back to a generic search
  if (carrierCode && airlineBookingUrls[carrierCode]) {
    return airlineBookingUrls[carrierCode](origin, destination, departDate, returnDate);
  }
  
  // Fallback to Google Flights for unknown carriers (this actually works!)
  const params = new URLSearchParams({
    f: origin,
    t: destination,
    d: departDate,
    ...(returnDate && { r: returnDate }),
    c: 'e', // economy
    sc: '1' // 1 passenger
  });
  
  return `https://www.google.com/travel/flights/search?${params.toString()}`;
};

// Function to map Amadeus offer to our DB schema
const mapAmadeusToDbSchema = (offer: AmadeusFlightOffer, tripRequestId: string): FlightOfferV2Insert => {
  const firstItinerary = offer.itineraries[0];
  const lastItinerary = offer.itineraries.length > 1 ? offer.itineraries[offer.itineraries.length - 1] : null;

  const firstSegment = firstItinerary.segments[0];
  const lastSegmentOfFirstItinerary = firstItinerary.segments[firstItinerary.segments.length - 1];

  let returnDt = null;
  if (lastItinerary && !offer.oneWay) {
    const firstSegmentOfLastItinerary = lastItinerary.segments[0];
    returnDt = new Date(firstSegmentOfLastItinerary.departure.at).toISOString();
  }

  const travelerPricing = offer.travelerPricings[0]; // Assuming single adult traveler for simplicity
  const fareDetails = travelerPricing.fareDetailsBySegment[0];
  
  // Get carrier code for booking URL generation
  const carrierCode = firstSegment.carrierCode;
  const departDate = firstSegment.departure.at.split('T')[0];
  const returnDate = returnDt ? returnDt.split('T')[0] : undefined;
  
  // Generate booking URL (in real API, this would come from Amadeus response)
  const bookingUrl = generatePlaceholderBookingUrl(
    firstSegment.departure.iataCode, 
    lastSegmentOfFirstItinerary.arrival.iataCode,
    departDate,
    returnDate,
    carrierCode
  );

  return {
    trip_request_id: tripRequestId,
    mode: 'AUTO',
    price_total: parseFloat(offer.price.total),
    price_currency: offer.price.currency,
    bags_included: !!(fareDetails.includedCheckedBags && fareDetails.includedCheckedBags.quantity > 0),
    cabin_class: fareDetails.cabin || null,
    nonstop: offer.itineraries.every(it => it.segments.every(s => s.numberOfStops === 0)),
    origin_iata: firstSegment.departure.iataCode,
    destination_iata: lastSegmentOfFirstItinerary.arrival.iataCode, // For one-way or first leg of round-trip
    depart_dt: new Date(firstSegment.departure.at).toISOString(),
    return_dt: returnDt,
    booking_url: bookingUrl, // Include the booking URL
    external_offer_id: offer.id,
    raw_offer_payload: offer as Record<string, any>, // Store the whole Amadeus offer
  };
};


serve(async (req: Request) => {
  console.log('[DEBUG] Flight-search-v2 edge function started');
  
  // Ensure CORS headers are set for all responses, including errors
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Or specific origins
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS', // Specify methods
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[DEBUG] CORS preflight request handled');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload: FlightSearchRequest = await req.json();
    console.log('[DEBUG] Request payload:', JSON.stringify(payload, null, 2));
    const { tripRequestId, maxPrice } = payload;

    if (!tripRequestId) {
      console.log('[DEBUG] Missing tripRequestId in payload');
      return new Response(JSON.stringify({ error: 'tripRequestId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log('[DEBUG] Trip request ID:', tripRequestId);
    console.log('[DEBUG] Max price filter:', maxPrice);


    // Fetch trip details to determine if this is a round-trip search for proper filtering
    const { data: tripRequest, error: tripError } = await supabaseClient
      .from('trip_requests')
      .select('return_date, origin_location_code, destination_location_code')
      .eq('id', tripRequestId)
      .single();

    if (tripError) {
      console.error('[DEBUG] Error fetching trip request:', tripError);
      throw new Error(`Failed to fetch trip request: ${tripError.message}`);
    }

    console.log('[DEBUG] Trip request details:', {
      tripRequestId,
      returnDate: tripRequest?.return_date,
      isRoundTrip: !!tripRequest?.return_date
    });

    // Fetch Amadeus offers with trip context for filtering
    const amadeusOffers = await fetchAmadeusOffers(tripRequestId, maxPrice, supabaseClient);


    if (amadeusOffers.length === 0) {
      return new Response(JSON.stringify({ inserted: 0, message: 'No flight offers found from Amadeus matching criteria.' }), {
        status: 200, // Or 404 if preferred for "not found"
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const offersToInsert = amadeusOffers.map(offer => mapAmadeusToDbSchema(offer, tripRequestId));
    console.log('[DEBUG] Mapped', offersToInsert.length, 'offers for database insertion');
    console.log('[DEBUG] Sample offer to insert:', JSON.stringify(offersToInsert[0], null, 2));

    // Insert into Supabase
    console.log('[DEBUG] Attempting to insert into flight_offers_v2 table...');
    const { data, error, count } = await supabaseClient
      .from('flight_offers_v2')
      .insert(offersToInsert)
      .select(); // .select() is important to get the count of inserted rows correctly

    if (error) {
      console.error('[DEBUG] Supabase insert error:', JSON.stringify(error, null, 2));
      console.error('[DEBUG] Failed to insert offers. Error details:', error);
      throw error; // Will be caught by the outer try/catch
    }
    
    console.log('[DEBUG] Database insertion result:');
    console.log('[DEBUG] - Inserted data count:', data?.length || 0);
    console.log('[DEBUG] - Count from response:', count);
    console.log('[DEBUG] - First inserted record:', data?.[0] ? JSON.stringify(data[0], null, 2) : 'None');

    // Use data.length as reliable count since Supabase count can be unreliable
    const insertedCount = data?.length ?? 0;

    return new Response(
      JSON.stringify({ inserted: insertedCount, message: `Successfully inserted ${insertedCount} flight offers.` }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ message: `Error: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/*
Test Plan (Conceptual - to be implemented in a separate test file if Deno test runner is used)

1. Mock Supabase client (`createClient`)
   - Mock `from().insert().select()` to simulate successful insertion and return a count.
   - Mock it to simulate an error during insertion.
2. Mock `fetchAmadeusOffers`
   - Mock it to return a list of Amadeus-like offers.
   - Mock it to return an empty list.
   - Mock it to throw an error.
3. Test scenarios:
   - Successful request: valid tripRequestId, Amadeus returns offers, Supabase insert succeeds.
     - Verify: Correct response ({ inserted: N, message: ... }), status 200.
     - Verify: `fetchAmadeusOffers` called with correct params.
     - Verify: Supabase client `insert` called with correctly mapped offers.
   - Amadeus returns no offers:
     - Verify: Response { inserted: 0, message: "No flight offers..." }, status 200.
   - Missing tripRequestId in payload:
     - Verify: Response { error: "tripRequestId is required" }, status 400.
   - Non-POST request method:
     - Verify: Response { error: "Method not allowed" }, status 405.
   - Amadeus API error:
     - Verify: Response { message: "Error: ..." }, status 500.
   - Supabase insert error:
     - Verify: Response { message: "Error: ..." }, status 500.
   - CORS preflight (OPTIONS request):
     - Verify: Status 200, correct CORS headers.

Supabase Table `flight_offers_v2` schema assumption (matches FlightOfferV2Insert + DB auto-fields):
  - id: uuid (primary key, default: gen_random_uuid())
  - trip_request_id: uuid (foreign key to trip_requests.id)
  - mode: text (e.g., 'AUTO', 'MANUAL')
  - price_total: numeric
  - price_currency: text (e.g., 'USD')
  - price_carry_on: numeric (nullable)
  - bags_included: boolean
  - cabin_class: text (nullable)
  - nonstop: boolean
  - origin_iata: text
  - destination_iata: text
  - depart_dt: timestamptz
  - return_dt: timestamptz (nullable)
  - external_offer_id: text (nullable, for Amadeus offer ID)
  - raw_offer_payload: jsonb (nullable, to store full Amadeus response)
  - created_at: timestamptz (default: now())

Environment Variables needed for the function:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  (And potentially AMADEUS_CLIENT_ID, AMADEUS_CLIENT_SECRET for a real Amadeus client)
*/


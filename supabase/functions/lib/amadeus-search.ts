// Amadeus API integration for flight search only (like Google Flights)
// This integration does NOT handle booking - users are redirected to airline websites

// Types for Amadeus API responses
interface AmadeusFlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonRefundable: boolean;
  oneWay?: boolean;
  lastTicketingDate?: string;
  numberOfBookableSeats?: number;
  itineraries: {
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
      operating?: {
        carrierCode: string;
      };
      duration: string;
      id: string;
      numberOfStops: number;
      blacklistedInEU: boolean;
    }>;
  }[];
  price: {
    currency: string;
    total: string;
    base: string;
    fees: Array<{
      amount: string;
      type: string;
    }>;
    grandTotal: string;
    additionalServices?: Array<{
      amount: string;
      type: string;
    }>;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string;
      fareBasis: string;
      brandedFare?: string;
      class: string;
      includedCheckedBags: {
        weight?: number;
        weightUnit?: string;
        quantity?: number;
      };
    }>;
  }>;
  bookingUrl?: string;
}

interface AmadeusLocation {
  type: string;
  subType: string;
  name: string;
  detailedName: string;
  id: string;
  self: {
    href: string;
    methods: string[];
  };
  timeZoneOffset: string;
  iataCode: string;
  geoCode: {
    latitude: number;
    longitude: number;
  };
  address: {
    cityName: string;
    cityCode: string;
    countryName: string;
    countryCode: string;
    regionCode: string;
  };
  analytics: {
    travelers: {
      score: number;
    };
  };
}

interface SearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
}

// Environment configuration
function getAmadeusEnv() {
  return {
    AMADEUS_CLIENT_ID: Deno.env.get('AMADEUS_CLIENT_ID'),
    AMADEUS_CLIENT_SECRET: Deno.env.get('AMADEUS_CLIENT_SECRET'),
    AMADEUS_BASE_URL: Deno.env.get('AMADEUS_BASE_URL'),
  };
}

// Token caching variables
let _cachedToken: string | undefined;
let _cachedExpiry = 0;

// Function to get Amadeus Access Token with caching
export async function getAmadeusAccessToken(): Promise<string> {
  const { AMADEUS_CLIENT_ID, AMADEUS_CLIENT_SECRET, AMADEUS_BASE_URL } = getAmadeusEnv();
  
  if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET || !AMADEUS_BASE_URL) {
    console.error("Error: Missing Amadeus credentials in environment variables.");
    throw new Error("Missing Amadeus credentials.");
  }

  const now = Date.now();
  
  // Return cached token if valid (with 60-second buffer)
  if (_cachedToken && now < _cachedExpiry - 60_000) {
    console.log("[AmadeusSearch] Using cached access token");
    return _cachedToken;
  }

  console.log("[AmadeusSearch] Fetching new access token");
  const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: AMADEUS_CLIENT_ID,
      client_secret: AMADEUS_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to get Amadeus access token: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`Failed to get Amadeus access token: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  
  // Cache the token and expiry time
  _cachedToken = data.access_token;
  _cachedExpiry = now + (data.expires_in * 1000);
  
  console.log(`[AmadeusSearch] Token cached, expires in ${data.expires_in} seconds`);
  return _cachedToken;
}

// Generate booking URL for airline websites
export function generateBookingUrl(
  offer: AmadeusFlightOffer,
  searchParams: SearchParams
): string {
  // Extract primary airline from the offer
  const validatingAirline = offer.validatingAirlineCodes?.[0];
  const firstSegmentCarrier = offer.itineraries?.[0]?.segments?.[0]?.carrierCode;
  const primaryAirline = validatingAirline || firstSegmentCarrier;

  if (!primaryAirline) {
    // Fallback to Google Flights if we can't determine airline
    return generateGoogleFlightsUrl(searchParams);
  }

  // Airline-specific booking URLs
  const airlineUrls: Record<string, (params: SearchParams) => string> = {
    'BA': () => `https://www.britishairways.com/travel/home/public/en_us`, // British Airways
    'DL': () => `https://www.delta.com/`, // Delta
    'AA': () => `https://www.aa.com/`, // American Airlines
    'UA': () => `https://www.united.com/`, // United
    'LH': () => `https://www.lufthansa.com/`, // Lufthansa
    'AF': () => `https://www.airfrance.com/`, // Air France
    'KL': () => `https://www.klm.com/`, // KLM
    'VS': () => `https://www.virgin-atlantic.com/`, // Virgin Atlantic
    'JB': () => `https://www.jetblue.com/`, // JetBlue
    'B6': () => `https://www.jetblue.com/`, // JetBlue (alternative code)
  };

  const airlineUrlGenerator = airlineUrls[primaryAirline];
  if (airlineUrlGenerator) {
    return airlineUrlGenerator(searchParams);
  }

  // Default fallback to Google Flights
  return generateGoogleFlightsUrl(searchParams);
}

function generateGoogleFlightsUrl(searchParams: SearchParams): string {
  const googleParams = new URLSearchParams({
    f: searchParams.returnDate ? '0' : '1', // 0=roundtrip, 1=oneway
    hl: 'en',
    curr: 'USD',
  });
  
  // Add flight search parameters
  googleParams.append('tfs', `f:${searchParams.originLocationCode},t:${searchParams.destinationLocationCode},d:${searchParams.departureDate}`);
  if (searchParams.returnDate) {
    googleParams.append('tfs', `f:${searchParams.destinationLocationCode},t:${searchParams.originLocationCode},d:${searchParams.returnDate}`);
  }
  
  return `https://www.google.com/flights?${googleParams.toString()}`;
}

// Simple flight search function for search-only use case
export async function searchFlightOffers(
  searchParams: {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string; // YYYY-MM-DD
    returnDate?: string; // YYYY-MM-DD, optional for one-way
    adults: number;
    travelClass?: string; // e.g., ECONOMY, BUSINESS
    nonStop?: boolean;
    max?: number; // Max offers to return (default 250)
  },
  token?: string
): Promise<AmadeusFlightOffer[]> {
  const { AMADEUS_BASE_URL } = getAmadeusEnv();
  
  if (!AMADEUS_BASE_URL) {
    console.error("Error: AMADEUS_BASE_URL not configured for searchFlightOffers.");
    throw new Error("AMADEUS_BASE_URL not configured.");
  }

  // Get token if not provided
  const accessToken = token || await getAmadeusAccessToken();

  // Build search parameters
  const urlParams = new URLSearchParams({
    originLocationCode: searchParams.originLocationCode,
    destinationLocationCode: searchParams.destinationLocationCode,
    departureDate: searchParams.departureDate,
    adults: String(searchParams.adults),
    max: String(searchParams.max || 250),
    currencyCode: 'USD', // Ensure all prices are returned in USD
  });

  if (searchParams.returnDate) urlParams.append('returnDate', searchParams.returnDate);
  if (searchParams.travelClass) urlParams.append('travelClass', searchParams.travelClass);
  if (searchParams.nonStop !== undefined) urlParams.append('nonStop', String(searchParams.nonStop));

  console.log(`[AmadeusSearch] Searching flight offers: ${urlParams.toString()}`);

  try {
    const response = await fetch(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${urlParams.toString()}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[AmadeusSearch] Flight search failed: ${response.status}`, errorText);
      throw new Error(`Flight search failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    let offers = data.data || [];
    
// ENHANCED ROUND-TRIP FILTERING: Multiple layers to ensure only true round-trip results
    if (searchParams.returnDate) {
      const beforeFilter = offers.length;
      
      // Layer 1: Filter out offers explicitly marked as one-way
      offers = offers.filter((offer: AmadeusFlightOffer) => {
        return !offer.oneWay;
      });
      
      // Layer 2: Ensure offers have exactly 2 itineraries (outbound + return)
      offers = offers.filter((offer: AmadeusFlightOffer) => {
        return offer.itineraries && offer.itineraries.length === 2;
      });
      
      // Layer 3: Verify both itineraries have proper routing
      offers = offers.filter((offer: AmadeusFlightOffer) => {
        if (!offer.itineraries || offer.itineraries.length !== 2) return false;
        
        const outbound = offer.itineraries[0];
        const inbound = offer.itineraries[1];
        
        // Verify outbound goes from origin to destination
        const outboundOrigin = outbound.segments?.[0]?.departure?.iataCode;
        const outboundDestination = outbound.segments?.[outbound.segments.length - 1]?.arrival?.iataCode;
        
        // Verify inbound goes from destination back to origin
        const inboundOrigin = inbound.segments?.[0]?.departure?.iataCode;
        const inboundDestination = inbound.segments?.[inbound.segments.length - 1]?.arrival?.iataCode;
        
        return (
          outboundOrigin === searchParams.originLocationCode &&
          outboundDestination === searchParams.destinationLocationCode &&
          inboundOrigin === searchParams.destinationLocationCode &&
          inboundDestination === searchParams.originLocationCode
        );
      });
      
      console.log(`[AmadeusSearch] Round-trip filtering: ${beforeFilter} -> ${offers.length} offers (removed ${beforeFilter - offers.length} non-round-trip offers)`);
    } else {
      // For one-way searches, ensure offers have only 1 itinerary
      const beforeFilter = offers.length;
      offers = offers.filter((offer: AmadeusFlightOffer) => {
        return offer.itineraries && offer.itineraries.length === 1;
      });
      console.log(`[AmadeusSearch] One-way filtering: ${beforeFilter} -> ${offers.length} offers (removed ${beforeFilter - offers.length} multi-itinerary offers)`);
    }
    
    console.log(`[AmadeusSearch] Found ${offers.length} properly filtered flight offers`);
    
    // Add booking URLs to each offer
    offers.forEach((offer: AmadeusFlightOffer) => {
      offer.bookingUrl = generateBookingUrl(offer, {
        originLocationCode: searchParams.originLocationCode,
        destinationLocationCode: searchParams.destinationLocationCode,
        departureDate: searchParams.departureDate,
        returnDate: searchParams.returnDate,
        adults: searchParams.adults,
      });
    });
    
    return offers;

  } catch (error) {
    console.error(`[AmadeusSearch] Error searching flight offers:`, error);
    throw error;
  }
}

// Airport & City Search for autocomplete (already working)
export async function searchLocations(
  keyword: string,
  subType: 'AIRPORT' | 'CITY' | 'AIRPORT,CITY' = 'AIRPORT,CITY',
  token?: string
): Promise<AmadeusLocation[]> {
  const { AMADEUS_BASE_URL } = getAmadeusEnv();
  
  if (!AMADEUS_BASE_URL) {
    throw new Error("AMADEUS_BASE_URL not configured.");
  }

  const accessToken = token || await getAmadeusAccessToken();

  const urlParams = new URLSearchParams({
    keyword,
    subType,
    page: JSON.stringify({ limit: 10 }),
  });

  try {
    const response = await fetch(`${AMADEUS_BASE_URL}/v1/reference-data/locations?${urlParams.toString()}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[AmadeusSearch] Location search failed: ${response.status}`, errorText);
      throw new Error(`Location search failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.data || [];

  } catch (error) {
    console.error(`[AmadeusSearch] Error searching locations:`, error);
    throw error;
  }
}


import type { TablesInsert } from "@/integrations/supabase/types";

export interface FlightSearchParams {
  origin: string[];
  destination: string | null;
  earliestDeparture: Date;
  latestDeparture: Date;
  minDuration: number;
  maxDuration: number;
  budget: number;
  relaxedCriteria?: boolean;
}

// OAuth2 Token Management
let _token: string|undefined, _tokenExpires = 0;

export async function fetchToken(): Promise<string> {
  const now = Date.now();
  if (_token && now < _tokenExpires - 60000) return _token;  // reuse until 1 min before expiry

  const res = await fetch(`${Deno.env.get("AMADEUS_BASE_URL")}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: Deno.env.get("AMADEUS_CLIENT_ID")!,
      client_secret: Deno.env.get("AMADEUS_CLIENT_SECRET")!,
    }),
  });
  
  if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
  
  const { access_token, expires_in } = await res.json();
  _token = access_token;
  _tokenExpires = now + expires_in * 1000;
  return _token;
}

// Helper function to safely extract departure time
function extractDepartureTime(segments: any[]): string | null {
  if (!segments || !Array.isArray(segments) || segments.length === 0) {
    return null;
  }
  
  const firstSegment = segments[0];
  return firstSegment?.departure?.at || null;
}

// Helper function to safely extract arrival time
function extractArrivalTime(segments: any[]): string | null {
  if (!segments || !Array.isArray(segments) || segments.length === 0) {
    return null;
  }
  
  const lastSegment = segments[segments.length - 1];
  return lastSegment?.arrival?.at || null;
}

// Main Search Function
export async function searchOffers(
  params: FlightSearchParams,
  tripRequestId: string
): Promise<TablesInsert<"flight_offers">[]> {
  console.log(`[flight-search] Starting search for trip ${tripRequestId}:`, {
    origins: params.origin,
    destination: params.destination,
    departureDates: { earliest: params.earliestDeparture.toISOString(), latest: params.latestDeparture.toISOString() },
    duration: `${params.minDuration}-${params.maxDuration} days`,
    budget: params.budget,
    relaxed: params.relaxedCriteria
  });

  if (!params.destination) {
    throw new Error("Destination is required for flight search");
  }

  try {
    const token = await fetchToken();
    const origin = params.origin[0]; // Use first origin for now
    const destination = params.destination;

    // Adjust budget if relaxed criteria is enabled (increase by 20%)
    const searchBudget = params.relaxedCriteria ? Math.round(params.budget * 1.2) : params.budget;
    
    console.log(`[flight-search] Search budget: $${searchBudget}${params.relaxedCriteria ? ' (relaxed +20%)' : ''}`);

    const searchPromises = [];
    
    // Generate date range for search (limit to reasonable number of searches)
    const startDate = new Date(params.earliestDeparture);
    const endDate = new Date(params.latestDeparture);
    const daysBetween = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const maxSearches = 10; // Limit API calls
    const step = Math.max(1, Math.floor(daysBetween / maxSearches));

    for (let i = 0; i < daysBetween; i += step) {
      const searchDate = new Date(startDate);
      searchDate.setDate(startDate.getDate() + i);
      
      if (searchDate > endDate) break;

      const searchDateStr = searchDate.toISOString().split('T')[0];
      
      searchPromises.push(
        searchFlightOffers(token, origin, destination, searchDateStr, searchBudget)
      );
      
      if (searchPromises.length >= maxSearches) break;
    }

    console.log(`[flight-search] Executing ${searchPromises.length} search requests`);
    
    const results = await Promise.allSettled(searchPromises);
    const allOffers: any[] = [];

    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        allOffers.push(...result.value);
      } else {
        console.warn(`[flight-search] Search ${i} failed:`, result.reason);
      }
    });

    console.log(`[flight-search] Raw offers found: ${allOffers.length}`);

    if (allOffers.length === 0) {
      console.log(`[flight-search] No offers found for ${origin} → ${destination}`);
      return [];
    }

    // Remove duplicates based on flight details
    const uniqueOffers = allOffers.filter((offer, index, self) => {
      try {
        const outboundTime = extractDepartureTime(offer.itineraries?.[0]?.segments);
        const inboundTime = extractDepartureTime(offer.itineraries?.[1]?.segments);
        const price = offer.price?.total;
        
        const key = `${outboundTime}-${inboundTime}-${price}`;
        return index === self.findIndex(o => {
          const otherOutbound = extractDepartureTime(o.itineraries?.[0]?.segments);
          const otherInbound = extractDepartureTime(o.itineraries?.[1]?.segments);
          const otherPrice = o.price?.total;
          const otherKey = `${otherOutbound}-${otherInbound}-${otherPrice}`;
          return key === otherKey;
        });
      } catch (error) {
        console.warn(`[flight-search] Error in deduplication for offer ${index}:`, error.message);
        return false; // Skip problematic offers
      }
    });

    console.log(`[flight-search] Unique offers after deduplication: ${uniqueOffers.length}`);

    // Enhanced server-side duration filter with better error handling
    const msPerDay = 24 * 60 * 60 * 1000;
    const durationFilteredOffers = uniqueOffers.filter((offer: any, i: number) => {
      try {
        const outbound = extractDepartureTime(offer.itineraries?.[0]?.segments);
        const inbound = extractDepartureTime(offer.itineraries?.[1]?.segments);
        
        if (!outbound || !inbound) {
          console.log(`[flight-search] Offer #${i}: missing departure times - outbound: ${outbound}, inbound: ${inbound}`);
          return false;
        }
        
        const outAt = new Date(outbound);
        const backAt = new Date(inbound);
        
        // Validate dates
        if (isNaN(outAt.getTime()) || isNaN(backAt.getTime())) {
          console.log(`[flight-search] Offer #${i}: invalid dates - outbound: ${outbound}, inbound: ${inbound}`);
          return false;
        }
        
        const tripDays = Math.round((backAt.getTime() - outAt.getTime()) / msPerDay);
        
        console.log(`[flight-search] Offer #${i}: outAt=${outAt.toISOString()}, backAt=${backAt.toISOString()}, days=${tripDays}, allowed=${params.minDuration}-${params.maxDuration}`);
        
        // Complete duration filter with both lower and upper bounds
        const matches = tripDays >= params.minDuration && tripDays <= params.maxDuration;
        console.log(`[flight-search] Offer #${i}: matches duration filter: ${matches}`);
        
        return matches;
      } catch (error) {
        console.warn(`[flight-search] Error filtering offer #${i}:`, error.message);
        return false; // Skip problematic offers
      }
    });

    console.log(`[flight-search] Offers after duration filter: ${durationFilteredOffers.length}`);

    const transformedOffers = transformAmadeusToOffers(durationFilteredOffers, tripRequestId);
    console.log(`[flight-search] Final transformed offers: ${transformedOffers.length}`);
    
    return transformedOffers;
  } catch (error) {
    console.error(`[flight-search] Search failed for trip ${tripRequestId}:`, error.message);
    throw new Error(`Flight search failed: ${error.message}`);
  }
}

// Helper function for individual flight search
async function searchFlightOffers(
  token: string,
  origin: string,
  destination: string,
  departureDate: string,
  maxPrice: number
): Promise<any[]> {
  const url = new URL(`${Deno.env.get("AMADEUS_BASE_URL")}/v2/shopping/flight-offers`);
  
  url.searchParams.set("originLocationCode", origin);
  url.searchParams.set("destinationLocationCode", destination);
  url.searchParams.set("departureDate", departureDate);
  url.searchParams.set("adults", "1");
  url.searchParams.set("maxPrice", maxPrice.toString());
  url.searchParams.set("max", "250"); // Get more results per search

  const response = await fetch(url.toString(), {
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Amadeus API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.data || [];
}

// Transform Amadeus response to our format with improved error handling
export function transformAmadeusToOffers(api: any[], tripRequestId: string): TablesInsert<"flight_offers">[] {
  const validOffers: TablesInsert<"flight_offers">[] = [];
  
  api.forEach((offer: any, index: number) => {
    try {
      // Extract flight details with safe access
      const outbound = offer.itineraries?.[0]?.segments?.[0];
      const inbound = offer.itineraries?.[1]?.segments?.[0];
      
      if (!outbound || !inbound) {
        console.warn(`[flight-search] Offer ${index}: missing itinerary data`);
        return; // Skip this offer
      }
      
      const price = parseFloat(offer.price?.total || "0");
      if (price <= 0) {
        console.warn(`[flight-search] Offer ${index}: invalid price: ${offer.price?.total}`);
        return; // Skip offers with invalid prices
      }
      
      const airline = outbound.carrierCode || "Unknown";
      const flightNumber = `${outbound.carrierCode || ""}${outbound.number || ""}`;
      
      // Extract dates and times with validation
      const departureDateTime = outbound.departure?.at;
      const returnDateTime = inbound.departure?.at;
      
      if (!departureDateTime || !returnDateTime) {
        console.warn(`[flight-search] Offer ${index}: missing departure times`);
        return; // Skip offers with missing dates
      }
      
      const departureDate = departureDateTime.split('T')[0] || "";
      const departureTime = departureDateTime.split('T')[1]?.substring(0, 5) || "";
      const returnDate = returnDateTime.split('T')[0] || "";
      const returnTime = returnDateTime.split('T')[1]?.substring(0, 5) || "";
      
      if (!departureDate || !returnDate) {
        console.warn(`[flight-search] Offer ${index}: invalid date format`);
        return; // Skip offers with invalid date formats
      }
      
      // Calculate total duration
      const totalDuration = offer.itineraries?.reduce((total: string, itinerary: any) => {
        return itinerary.duration || "PT0H0M";
      }, "PT0H0M") || "PT0H0M";

      const transformedOffer: TablesInsert<"flight_offers"> = {
        trip_request_id: tripRequestId,
        airline,
        flight_number: flightNumber,
        origin_airport: outbound.departure?.iataCode || "",
        destination_airport: outbound.arrival?.iataCode || "",
        departure_date: departureDate,
        departure_time: departureTime,
        return_date: returnDate,
        return_time: returnTime,
        duration: totalDuration,
        price,
        stops: Math.max(0, (outbound.numberOfStops || 0)),
        carrier_code: outbound.carrierCode || "",
        baggage_included: false, // Default value
        auto_book: true, // Default value
      };
      
      validOffers.push(transformedOffer);
    } catch (error) {
      console.error(`[flight-search] Error transforming offer ${index}:`, error.message);
      // Continue processing other offers
    }
  });
  
  console.log(`[flight-search] Successfully transformed ${validOffers.length} out of ${api.length} offers`);
  return validOffers;
}

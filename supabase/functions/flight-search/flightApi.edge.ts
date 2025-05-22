
// This file is specifically for Supabase Edge Functions
// It contains Deno-specific code that shouldn't be imported by client-side code

import type { TablesInsert } from "@/integrations/supabase/types";

export interface FlightSearchParams {
  origin: string[];
  destination: string | null;
  earliestDeparture: Date;
  latestDeparture: Date;
  minDuration: number;
  maxDuration: number;
  budget: number;
}

// OAuth2 Token Management
let _token: string|undefined, _tokenExpires = 0;

export async function fetchToken(): Promise<string> {
  console.log("[flight-search] Fetching OAuth token...");
  const now = Date.now();
  if (_token && now < _tokenExpires - 60000) {
    console.log("[flight-search] Reusing existing token");
    return _token;  // reuse until 1 min before expiry
  }

  try {
    console.log(`[flight-search] Requesting new token from ${Deno.env.get("AMADEUS_BASE_URL")}/v1/security/oauth2/token`);
    const res = await fetch(`${Deno.env.get("AMADEUS_BASE_URL")}/v1/security/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: Deno.env.get("AMADEUS_CLIENT_ID")!,
        client_secret: Deno.env.get("AMADEUS_CLIENT_SECRET")!,
      }),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[flight-search] Token fetch failed: ${res.status}`, errorText);
      throw new Error(`Token fetch failed: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log("[flight-search] Successfully received token");
    _token = data.access_token;
    _tokenExpires = now + data.expires_in * 1000;
    return _token;
  } catch (error) {
    console.error("[flight-search] Error in fetchToken:", error);
    throw error;
  }
}

/**
 * Implements retry logic with exponential backoff
 * @param fn The async function to retry
 * @param maxAttempts Maximum number of attempts before failing
 * @param baseDelayMs Base delay in milliseconds
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelayMs: number = 500
): Promise<T> {
  let attempts = 0;
  
  while (true) {
    attempts++;
    try {
      return await fn();
    } catch (error) {
      // Don't retry if we've hit max attempts
      if (attempts >= maxAttempts) {
        console.error(`Failed after ${attempts} attempts: ${error.message}`);
        throw error;
      }
      
      // Only retry on rate limits or server errors
      if (error.message?.includes('429') || 
          error.message?.includes('5') || 
          error.name === 'NetworkError' ||
          error.name === 'TypeError') {
        // Calculate delay with exponential backoff: baseDelay * 2^(attempts-1)
        const delayMs = baseDelayMs * Math.pow(2, attempts - 1);
        console.log(`Attempt ${attempts} failed with ${error.message}. Retrying in ${delayMs}ms...`);
        await new Promise(r => setTimeout(r, delayMs));
        continue;
      }
      
      // Don't retry on other errors
      throw error;
    }
  }
}

// Main Search Function
export async function searchOffers(
  params: FlightSearchParams,
  tripRequestId: string
): Promise<TablesInsert<"flight_offers">[]> {
  console.log(`[flight-search] Starting searchOffers for trip ${tripRequestId}`);
  const token = await fetchToken();
  
  // Simple rate-limit pause
  await new Promise(r => setTimeout(r, 1000));

  // Build departure + return dates once
  const depDate = params.earliestDeparture.toISOString().slice(0, 10);
  // use latestDeparture (window end) for return dates
  const retDate = params.latestDeparture.toISOString().slice(0, 10);

  console.log(`[flight-search] Search dates: departure ${depDate}, return ${retDate}`);

  // For each origin, call Amadeus and collect raw responses
  const allResponses: any[] = [];
  for (const originCode of params.origin) {
    console.log(`[flight-search] Processing origin airport: ${originCode}`);
    const payload = {
      originDestinations: [
        { id: "1", originLocationCode: originCode, destinationLocationCode: params.destination, departureDateTimeRange: { date: depDate } },
        { id: "2", originLocationCode: params.destination!, destinationLocationCode: originCode, departureDateTimeRange: { date: retDate } },
      ],
      travelers: [{ id: "1", travelerType: "ADULT" }],
      sources: ["GDS"],
      searchCriteria: { price: { max: params.budget.toString() } },
    };

    const url = `${Deno.env.get("AMADEUS_BASE_URL")}/v2/shopping/flight-offers`;
    console.log(`[flight-search] Calling Amadeus API at ${url} with payload:`, JSON.stringify(payload));
    
    const resp = await withRetry(async () => {
      const r = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!r.ok) {
        const errorText = await r.text();
        console.error(`[flight-search] Amadeus API error: ${r.status}`, errorText);
        throw new Error(`Amadeus API error: ${r.status} - ${errorText}`);
      }
      
      return await r.json();
    });
    
    if (resp.data && resp.data.length > 0) {
      console.log(`[flight-search] Found ${resp.data.length} raw offers from ${originCode}`);
      // Log a sample offer for debugging
      console.log("[flight-search] Sample raw offer:", JSON.stringify(resp.data[0], null, 2));
    } else {
      console.log(`[flight-search] No offers found for ${originCode}`);
    }
    
    allResponses.push(...(resp.data || []));
  }

  // Log total raw offers count and sample of raw data
  console.log(`[flight-search] Total raw offers from all origins: ${allResponses.length}`);
  if (allResponses.length > 0) {
    console.log("[flight-search] Raw offers sample:", JSON.stringify(allResponses.slice(0, 2), null, 2));
  }

  // Dedupe by outbound+return departure times
  const uniqueOffers = Array.from(
    new Map(
      allResponses.map((offer: any) => {
        const outSeg = offer.itineraries[0].segments[0];
        const backSeg = offer.itineraries[1]?.segments.slice(-1)[0] ?? outSeg;
        const key = [
          outSeg.carrierCode,
          outSeg.number,
          outSeg.departure.at,
          backSeg.departure.at
        ].join("-");
        return [key, offer];
      })
    ).values()
  );

  // Log after deduplication
  console.log(`[flight-search] ${uniqueOffers.length} unique offers after deduplication`);

  // Log input duration parameters
  console.log(`[flight-search] Duration filter params: minDuration=${params.minDuration}, maxDuration=${params.maxDuration}`);

  // IMPROVED: More robust duration filter with better logging
  const filteredOffers = uniqueOffers.filter((offer: any, i: number) => {
    const outAt = offer.itineraries[0].segments[0].departure.at;
    const backItin = offer.itineraries[1];
    const backSeg = backItin?.segments?.slice(-1)[0];
    const backAt = backSeg?.departure?.at || backSeg?.arrival?.at || null;

    if (!backAt) {
      console.log(`[flight-search] Offer #${i}: No backAt, skipping.`);
      return false;
    }

    const outDate = new Date(outAt);
    const backDate = new Date(backAt);
    const tripDaysRaw = (backDate.getTime() - outDate.getTime()) / (1000 * 60 * 60 * 24);
    const tripDays = Math.round(tripDaysRaw); // Round to nearest integer day

    const matches = tripDays >= (params.minDuration - 1) && tripDays <= (params.maxDuration + 1);
    console.log(`[flight-search] Offer #${i}: outAt=${outAt}, backAt=${backAt}, daysRaw=${tripDaysRaw}, days=${tripDays}, matches=${matches}`);
    return matches;
  });
  
  console.log(`[flight-search] ${filteredOffers.length} offers after applying duration filter`);
  
  // Log duration details for a few offers to debug
  if (filteredOffers.length > 0) {
    console.log("[flight-search] Detailed duration analysis for up to 5 offers:");
    filteredOffers.slice(0, 5).forEach((offer: any, i: number) => {
      try {
        const outAt = offer.itineraries[0].segments[0].departure.at;
        const outDate = new Date(outAt);
        
        // Try to get return date using various fallbacks
        const backItin = offer.itineraries[1];
        const backSeg = backItin?.segments?.slice(-1)[0];
        const backAt = backSeg?.departure?.at || backSeg?.arrival?.at || null;
        const backDate = backAt ? new Date(backAt) : null;
        
        const tripDaysRaw = backDate ? 
          (backDate.getTime() - outDate.getTime()) / (1000 * 60 * 60 * 24) : 
          null;
        const tripDays = tripDaysRaw !== null ? Math.round(tripDaysRaw) : null;
        
        console.log(`[flight-search] Offer #${i+1}:`);
        console.log(`  - Out: ${outAt} (${outDate.toISOString()})`);
        console.log(`  - Back: ${backAt} (${backDate?.toISOString() || 'N/A'})`);
        console.log(`  - Duration raw: ${tripDaysRaw?.toFixed(2) || 'Unknown'} days`);
        console.log(`  - Duration rounded: ${tripDays || 'Unknown'} days`);
        console.log(`  - Matches filter: ${
          tripDays !== null ? 
          (tripDays >= params.minDuration - 1 && tripDays <= params.maxDuration + 1) : 
          'Unknown'
        }`);
      } catch (err) {
        console.error(`[flight-search] Error analyzing offer #${i+1}:`, err);
      }
    });
  }

  // Show requested filter parameters
  console.log(`[flight-search] Requested duration window: ${params.minDuration}-${params.maxDuration} days`);

  console.log(`[flight-search] Found ${filteredOffers.length} offers for trip ${tripRequestId}`);
  const api = { data: filteredOffers };
  return transformAmadeusToOffers(api, tripRequestId);
}

// Transform Amadeus response to our format
export function transformAmadeusToOffers(api: any, tripRequestId: string): TablesInsert<"flight_offers">[] {
  // Handle empty response
  if (!api.data || !Array.isArray(api.data) || api.data.length === 0) {
    console.log("[flight-search] No data to transform");
    return [];
  }
  
  try {
    const offers = api.data.flatMap((offer: any) => {
      try {
        const out = offer.itineraries[0].segments[0];
        // More robust handling of return segment
        const backItin = offer.itineraries[1];
        if (!backItin) {
          console.log("[flight-search] Skipping one-way flight without return itinerary");
          return [];
        }
        
        const back = backItin.segments.slice(-1)[0];
        if (!back?.departure?.at) {
          console.log("[flight-search] Skipping offer with missing return departure time");
          return [];
        }
        
        return [{
          trip_request_id: tripRequestId,
          airline: out.carrierCode,
          flight_number: out.number,
          departure_date: out.departure.at.split("T")[0],
          departure_time: out.departure.at.split("T")[1].slice(0,5),
          return_date: back.departure.at.split("T")[0],
          return_time: back.departure.at.split("T")[1].slice(0,5),
          duration: offer.itineraries[0].duration,
          price: parseFloat(offer.price.total),
        }];
      } catch (err) {
        console.error("[flight-search] Error transforming individual offer:", err);
        console.log("[flight-search] Problematic offer:", JSON.stringify(offer, null, 2));
        return []; // Skip this offer if transformation fails
      }
    });
    
    console.log(`[flight-search] Successfully transformed ${offers.length} offers`);
    return offers;
  } catch (err) {
    console.error("[flight-search] Error in transformAmadeusToOffers:", err);
    return [];
  }
}

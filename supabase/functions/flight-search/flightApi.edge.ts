
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

// ——————————————————————————————————————————
// OAuth2 Token Management
// ——————————————————————————————————————————
let _token: string | undefined;
let _tokenExpires = 0;

export async function fetchToken(): Promise<string> {
  console.log("[flight-search] Fetching OAuth token...");
  const now = Date.now();
  if (_token && now < _tokenExpires - 60_000) return _token;

  const res = await fetch(
    `${Deno.env.get("AMADEUS_BASE_URL")}/v1/security/oauth2/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: Deno.env.get("AMADEUS_CLIENT_ID")!,
        client_secret: Deno.env.get("AMADEUS_CLIENT_SECRET")!,
      }),
    }
  );

  if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
  const { access_token, expires_in } = await res.json();
  _token = access_token;
  _tokenExpires = now + expires_in * 1000;
  
  console.log("[flight-search] Successfully received token");
  return access_token;
}

// ——————————————————————————————————————————
// Retry with exponential backoff
// ——————————————————————————————————————————
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 500
): Promise<T> {
  let attempt = 0;
  while (true) {
    attempt++;
    try {
      return await fn();
    } catch (error: any) {
      if (attempt >= maxAttempts) {
        console.error(`[flight-search] Give up after ${attempt} tries:`, error);
        throw error;
      }
      const retryable =
        error.message.includes("429") ||
        error.message.startsWith("5") ||
        error.name === "TypeError" ||
        error.name === "NetworkError";
      if (!retryable) throw error;
      const delay = baseDelayMs * 2 ** (attempt - 1);
      console.warn(`[flight-search] Attempt ${attempt} failed; retrying in ${delay}ms…`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// ——————————————————————————————————————————
// Main Amadeus flight-offers call (v2 JSON body)
// ——————————————————————————————————————————
export async function searchOffers(
  params: FlightSearchParams,
  tripRequestId: string
): Promise<TablesInsert<"flight_offers">[]> {
  console.log(`[flight-search] Starting searchOffers for trip ${tripRequestId}`);
  const token = await fetchToken();

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

  // IMPROVED: More robust duration filter with better error handling and logging
  const filteredOffers = uniqueOffers.filter((offer: any, i: number) => {
    try {
      const outAt = offer.itineraries[0].segments[0].departure.at;
      const backItin = offer.itineraries[1];
      if (!backItin) {
        console.log(`[flight-search] Offer #${i}: No return itinerary, skipping. Full offer:`, JSON.stringify(offer, null, 2));
        return false;
      }
      const backSeg = backItin.segments?.slice(-1)[0];
      const backAt = backSeg?.departure?.at || backSeg?.arrival?.at || null;
      if (!backAt) {
        console.log(`[flight-search] Offer #${i}: No backAt, skipping. Full offer:`, JSON.stringify(offer, null, 2));
        return false;
      }

      const outDate = new Date(outAt);
      const backDate = new Date(backAt);
      const tripDaysRaw = (backDate.getTime() - outDate.getTime()) / (1000 * 60 * 60 * 24);
      const tripDays = Math.round(tripDaysRaw);

      console.log(`[flight-search] Offer #${i}: outAt=${outAt}, backAt=${backAt}, daysRaw=${tripDaysRaw}, days=${tripDays}, minDuration=${params.minDuration}, maxDuration=${params.maxDuration}`);

      const matches = tripDays >= (params.minDuration - 1) && tripDays <= (params.maxDuration + 1);
      console.log(`[flight-search] Offer #${i}: matches duration filter: ${matches}`);
      return matches;
    } catch (err) {
      console.error(`[flight-search] Offer #${i}: Exception in filter:`, err, JSON.stringify(offer, null, 2));
      return false;
    }
  });
  
  console.log(`[flight-search] Filtered offers count: ${filteredOffers.length} (from ${uniqueOffers.length})`);
  
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

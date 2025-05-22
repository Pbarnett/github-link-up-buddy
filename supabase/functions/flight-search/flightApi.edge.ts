
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
  const token = await fetchToken();
  
  // Simple rate-limit pause
  await new Promise(r => setTimeout(r, 1000));

  // Build departure + return dates once
  const depDate = params.earliestDeparture.toISOString().slice(0, 10);
  // use latestDeparture (window end) for return dates
  const retDate = params.latestDeparture.toISOString().slice(0, 10);

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
    const resp = await withRetry(async () => {
      const r = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) {
        console.error("[flight-search] Error response body:", JSON.stringify(j, null, 2));
        throw new Error(`Amadeus API error: ${r.status}`);
      }
      return j;
    });
    allResponses.push(...(resp.data || []));
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

  console.log(`[flight-search] Found ${uniqueOffers.length} offers for trip ${tripRequestId}`);
  const api = { data: uniqueOffers };
  return transformAmadeusToOffers(api, tripRequestId);
}

// Transform Amadeus response to our format
export function transformAmadeusToOffers(api: any, tripRequestId: string): TablesInsert<"flight_offers">[] {
  // Handle empty response
  if (!api.data || !Array.isArray(api.data) || api.data.length === 0) {
    return [];
  }
  
  return api.data.flatMap((offer: any) => {
    try {
      const out = offer.itineraries[0].segments[0];
      const back = offer.itineraries[1]?.segments.slice(-1)[0] ?? out;
      
      return [{
        trip_request_id: tripRequestId,
        airline: out.carrierCode,
        flight_number: out.number,
        departure_date: out.departure.at.split("T")[0],
        departure_time: out.departure.at.split("T")[1].slice(0,5),
        return_date: back.departure.at.split("T")[0],  // Changed from back.arrival.at to back.departure.at
        return_time: back.departure.at.split("T")[1].slice(0,5),  // Changed from back.arrival.at to back.departure.at
        duration: offer.itineraries[0].duration,
        price: parseFloat(offer.price.total),
      }];
    } catch (err) {
      console.error("Error transforming Amadeus offer:", err);
      return []; // Skip this offer if transformation fails
    }
  });
}

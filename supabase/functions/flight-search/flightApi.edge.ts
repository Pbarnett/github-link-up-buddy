// supabase/functions/flight-search/flightApi.edge.ts
// This file is specifically for Supabase Edge Functions
// It contains Deno-specific code that shouldn’t be imported by client-side code

import type { TablesInsert } from "@/integrations/supabase/types";

export interface FlightSearchParams {
  origin: string[];
  destination: string | null;
  earliestDeparture: Date;
  latestDeparture: Date;
  budget: number;
}

// ——————————————————————————————————————————
// OAuth2 Token Management
// ——————————————————————————————————————————
let _token: string | undefined;
let _tokenExpires = 0;

export async function fetchToken(): Promise<string> {
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
  const token = await fetchToken();

  // Build the JSON payload per Amadeus v2 spec:
  const departureDate = params.earliestDeparture.toISOString().slice(0, 10);

  const payload = {
    originDestinations: [
      {
        id: "1",
        originLocationCode: params.origin[0],
        destinationLocationCode: params.destination,
        departureDateTimeRange: { date: departureDate },
      },
    ],
    travelers: [{ id: "1", travelerType: "ADULT" }],
    sources: ["GDS"],
    searchCriteria: {
      price: { max: params.budget.toString() },
    },
  };

  const url = `${Deno.env.get("AMADEUS_BASE_URL")}/v2/shopping/flight-offers`;

  const api = await withRetry(async () => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let json: any;
    try {
      json = await res.json();
    } catch (e) {
      console.error("[flight-search] Invalid JSON from Amadeus:", e);
      throw new Error(`Amadeus API error: ${res.status}`);
    }

    if (!res.ok) {
      console.error(
        "[flight-search] Amadeus error response body:",
        JSON.stringify(json, null, 2)
      );
      throw new Error(`Amadeus API error: ${res.status}`);
    }
    return json;
  });

  return transformAmadeusToOffers(api, tripRequestId);
}

// ——————————————————————————————————————————
// Transform Amadeus response to our flight_offers rows
// ——————————————————————————————————————————
export function transformAmadeusToOffers(
  api: any,
  tripRequestId: string
): TablesInsert<"flight_offers">[] {
  if (!api.data || !Array.isArray(api.data)) return [];
  return api.data.flatMap((offer: any) => {
    try {
      const out = offer.itineraries[0].segments[0];
      const back = offer.itineraries[1]?.segments.slice(-1)[0] ?? out;
      return [
        {
          trip_request_id: tripRequestId,
          airline: out.carrierCode,
          flight_number: out.number,
          departure_date: out.departure.at.split("T")[0],
          departure_time: out.departure.at.split("T")[1].slice(0, 5),
          return_date: back.arrival.at.split("T")[0],
          return_time: back.arrival.at.split("T")[1].slice(0, 5),
          duration: offer.itineraries[0].duration,
          price: parseFloat(offer.price.total),
        },
      ];
    } catch (e) {
      console.error("[flight-search] Error transforming offer:", e);
      return [];
    }
  });
}


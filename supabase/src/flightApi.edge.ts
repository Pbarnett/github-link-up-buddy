
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

// Main Search Function
export async function searchOffers(
  params: FlightSearchParams,
  tripRequestId: string
): Promise<TablesInsert<"flight_offers">[]> {
  const token = await fetchToken();
  
  // Simple rate-limit pause
  await new Promise(r => setTimeout(r, 1000));

  // Build the API URL with parameters
  const originStr = params.origin.join(",");
  const destinationStr = params.destination || "";
  const departureDate = params.earliestDeparture.toISOString().slice(0,10);
  const returnDate = params.latestDeparture.toISOString().slice(0,10);
  
  const url = `${Deno.env.get("AMADEUS_BASE_URL")}/v2/shopping/flight-offers?` +
    `originLocationCode=${originStr}` +
    `&destinationLocationCode=${destinationStr}` +
    `&departureDate=${departureDate}` +
    `&returnDate=${returnDate}` +
    `&adults=1` +
    `&maxPrice=${params.budget}` +
    `&max=${params.maxDuration}&min=${params.minDuration}`;

  // Call the Amadeus API
  const res = await fetch(url, { 
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    } 
  });
  
  // Handle errors
  if (res.status === 429) throw new Error("Rate limit exceeded");
  if (!res.ok) throw new Error(`Amadeus API error: ${res.status}`);
  
  const data = await res.json();
  
  // Transform the response into our flight_offers format
  return transformAmadeusToOffers(data, tripRequestId);
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

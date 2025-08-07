
// This file is deprecated and will be removed soon.
// Please use supabase/functions/flight-search/flightApi.edge.ts instead.

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
  console.warn("Using deprecated flightApi.edge.ts implementation. Please migrate to the new version.");
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

// Main Search Function - DEPRECATED
// Use supabase/functions/flight-search/flightApi.edge.ts instead
export async function searchOffers(
   
  _params: FlightSearchParams,
   
  _tripRequestId: string
): Promise<TablesInsert<"flight_offers">[]> {
  console.warn("Using deprecated searchOffers implementation. Please migrate to the new version.");
  
  // IMPORTANT: Changed to avoid circular imports - don't forward to new implementation
  // Instead, just return an empty array
  console.error("This function is deprecated. Please use the new implementation directly.");
  return [];
}

// Transform Amadeus response to our format - DEPRECATED
// Use supabase/functions/flight-search/flightApi.edge.ts instead
 
export function transformAmadeusToOffers(_api: unknown, _tripRequestId: string): TablesInsert<"flight_offers">[] {
  console.warn("Using deprecated transformAmadeusToOffers implementation. Please migrate to the new version.");
  
  // IMPORTANT: Changed to avoid circular imports - don't forward to new implementation
  // Instead, just return an empty array
  console.error("This function is deprecated. Please use the new implementation directly.");
  return [];
}

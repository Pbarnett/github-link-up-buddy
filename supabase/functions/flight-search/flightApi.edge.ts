
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
  maxConnections?: number;
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
  baseDelayMs = 500,
  simplifiedFallbackFn?: () => Promise<T>
): Promise<T> {
  let attempt = 0;
  let lastError: any;
  
  while (true) {
    attempt++;
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      if (attempt >= maxAttempts) {
        console.error(`[flight-search] Give up after ${attempt} tries:`, error);
        
        // Try the simplified fallback if provided and we've exhausted normal retries
        if (simplifiedFallbackFn) {
          console.log("[flight-search] Attempting simplified fallback strategy");
          try {
            return await simplifiedFallbackFn();
          } catch (fallbackError) {
            console.error("[flight-search] Fallback strategy also failed:", fallbackError);
            throw lastError; // Throw the original error if fallback also fails
          }
        }
        
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

  // Store all offers across origins and search strategies
  const allRawOffers: any[] = [];
  
  // For each origin, we'll perform multiple searches with different date strategies
  for (const originCode of params.origin) {
    console.log(`[flight-search] Processing origin airport: ${originCode}`);
    
    // Calculate search dates using different strategies
    const depDate = params.earliestDeparture.toISOString().slice(0, 10);
    
    // IMPROVED: Calculate multiple return dates based on min/max duration
    // This ensures we find trips within the duration constraints
    const searchStrategies = [
      {
        name: "max-duration",
        depDate: depDate,
        // Return date based on max duration from earliest departure
        retDate: calculateReturnDate(params.earliestDeparture, params.maxDuration, params.latestDeparture),
      },
      {
        name: "min-duration", 
        depDate: depDate,
        // Return date based on min duration from earliest departure
        retDate: calculateReturnDate(params.earliestDeparture, params.minDuration, params.latestDeparture),
      }
    ];
    
    // If the travel window is large, add a mid-window strategy
    const windowDays = (params.latestDeparture.getTime() - params.earliestDeparture.getTime()) / (1000 * 60 * 60 * 24);
    if (windowDays > 14) {
      const midDate = new Date(params.earliestDeparture.getTime() + (windowDays / 2) * 24 * 60 * 60 * 1000);
      // Only add this strategy if we still have time for a min duration trip
      const latestPossibleDep = new Date(params.latestDeparture.getTime() - (params.minDuration * 24 * 60 * 60 * 1000));
      if (midDate <= latestPossibleDep) {
        const midDateStr = midDate.toISOString().slice(0, 10);
        searchStrategies.push({
          name: "mid-window",
          depDate: midDateStr,
          retDate: calculateReturnDate(midDate, params.maxDuration, params.latestDeparture),
        });
      }
    }
    
    // For each search strategy
    for (const strategy of searchStrategies) {
      console.log(`[flight-search] Origin ${originCode}: Using strategy ${strategy.name} with dep=${strategy.depDate}, ret=${strategy.retDate}`);

      // Build proper request payload for round trip with both outbound and inbound segments
      const payload = {
        originDestinations: [
          { 
            id: "1", 
            originLocationCode: originCode, 
            destinationLocationCode: params.destination, 
            departureDateTimeRange: { date: strategy.depDate } 
          },
          { 
            id: "2", 
            originLocationCode: params.destination!, 
            destinationLocationCode: originCode, 
            departureDateTimeRange: { date: strategy.retDate } 
          },
        ],
        travelers: [{ id: "1", travelerType: "ADULT" }],
        sources: ["GDS"],
        searchCriteria: { 
          price: { max: params.budget.toString() },
          // Ensure only round trips
          flightFilters: {
            connectionRestriction: {
              maxNumberOfConnections: params.maxConnections || 2  // Use provided maxConnections or default to 2
            }
          }
        },
      };

      const url = `${Deno.env.get("AMADEUS_BASE_URL")}/v2/shopping/flight-offers`;
      console.log(`[flight-search] Calling Amadeus API at ${url} with strategy=${strategy.name}`);
      
      try {
        // Create a simplified fallback function for retry
        const simplifiedSearch = async () => {
          console.log(`[flight-search] Using simplified search fallback for ${originCode}`);
          // Simplified payload with just basic parameters
          const simplePayload = {
            originDestinations: [
              { 
                id: "1", 
                originLocationCode: originCode, 
                destinationLocationCode: params.destination, 
                departureDateTimeRange: { date: depDate } 
              },
              { 
                id: "2", 
                originLocationCode: params.destination!, 
                destinationLocationCode: originCode, 
                departureDateTimeRange: { date: calculateReturnDate(params.earliestDeparture, params.maxDuration, params.latestDeparture) } 
              },
            ],
            travelers: [{ id: "1", travelerType: "ADULT" }],
            sources: ["GDS"]
          };
          
          const r = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(simplePayload),
          });
          
          if (!r.ok) {
            const errorText = await r.text();
            throw new Error(`Simplified search error: ${r.status} - ${errorText}`);
          }
          
          return await r.json();
        };
        
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
        }, 3, 500, simplifiedSearch);
        
        if (resp.data && resp.data.length > 0) {
          console.log(`[flight-search] Found ${resp.data.length} raw offers from ${originCode} using strategy ${strategy.name}`);
          // Add all offers from this strategy to our collection
          allRawOffers.push(...resp.data);
        } else {
          console.log(`[flight-search] No offers found for ${originCode} using strategy ${strategy.name}`);
        }
      } catch (error) {
        console.error(`[flight-search] Error searching flights for origin ${originCode}, strategy ${strategy.name}:`, error);
        // Continue with other strategies and origins even if one fails
      }
    }
  }

  // First tier fallback: If no results found with all origins, try with just the first origin as a last resort
  if (allRawOffers.length === 0 && params.origin.length > 1) {
    console.log(`[flight-search] FALLBACK 1: No offers found for any origins. Trying again with primary origin ${params.origin[0]} only`);
    
    try {
      // Try a simplified search with just the primary origin
      const primaryOrigin = params.origin[0];
      const depDate = params.earliestDeparture.toISOString().slice(0, 10);
      const retDate = calculateReturnDate(params.earliestDeparture, params.maxDuration, params.latestDeparture);
      
      const payload = {
        originDestinations: [
          { 
            id: "1", 
            originLocationCode: primaryOrigin, 
            destinationLocationCode: params.destination, 
            departureDateTimeRange: { date: depDate } 
          },
          { 
            id: "2", 
            originLocationCode: params.destination!, 
            destinationLocationCode: primaryOrigin, 
            departureDateTimeRange: { date: retDate } 
          },
        ],
        travelers: [{ id: "1", travelerType: "ADULT" }],
        sources: ["GDS"],
        searchCriteria: { 
          maxFlightOffers: 50,
          flightFilters: {
            connectionRestriction: {
              maxNumberOfConnections: params.maxConnections || 2
            }
          }
        },
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
        
        if (!r.ok) {
          throw new Error(`Fallback single-origin search failed: ${r.status}`);
        }
        
        return await r.json();
      });
      
      if (resp.data && resp.data.length > 0) {
        console.log(`[flight-search] Found ${resp.data.length} offers from fallback single-origin search`);
        allRawOffers.push(...resp.data);
      }
    } catch (fallbackError) {
      console.error(`[flight-search] Fallback search also failed:`, fallbackError);
    }
  }

  // Second tier fallback: If still no results, try with extremely relaxed criteria
  if (allRawOffers.length === 0) {
    console.log(`[flight-search] FALLBACK 2: Still no offers. Trying with maximally relaxed criteria`);
    
    try {
      // Use the primary origin only
      const primaryOrigin = params.origin[0];
      
      // Use the full date range
      const depDate = params.earliestDeparture.toISOString().slice(0, 10);
      const maxRetDate = params.latestDeparture.toISOString().slice(0, 10);
      
      const relaxedPayload = {
        originDestinations: [
          { 
            id: "1", 
            originLocationCode: primaryOrigin, 
            destinationLocationCode: params.destination, 
            departureDateTimeRange: { date: depDate } 
          },
          { 
            id: "2", 
            originLocationCode: params.destination!, 
            destinationLocationCode: primaryOrigin, 
            departureDateTimeRange: { date: maxRetDate } 
          },
        ],
        travelers: [{ id: "1", travelerType: "ADULT" }],
        sources: ["GDS"],
        searchCriteria: { 
          maxFlightOffers: 50,
          // Increased budget by 20%
          price: { 
            max: Math.ceil(params.budget * 1.2).toString() 
          }
        }
      };
      
      const url = `${Deno.env.get("AMADEUS_BASE_URL")}/v2/shopping/flight-offers`;
      console.log("[flight-search] Trying maximally relaxed search criteria with 20% higher budget");
      
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(relaxedPayload),
      });
      
      if (!resp.ok) {
        console.error(`[flight-search] Maximally relaxed search failed: ${resp.status}`);
      } else {
        const data = await resp.json();
        if (data.data && data.data.length > 0) {
          console.log(`[flight-search] Found ${data.data.length} offers with maximally relaxed criteria`);
          allRawOffers.push(...data.data);
        } else {
          console.log("[flight-search] No offers found even with maximally relaxed criteria");
        }
      }
    } catch (extremeFallbackError) {
      console.error("[flight-search] Extreme fallback search failed:", extremeFallbackError);
    }
  }
    
  if (allRawOffers.length === 0) {
    console.log(`[flight-search] No offers found after all fallback strategies`);
    return [];
  }

  // Log total raw offers count across all origins and strategies
  console.log(`[flight-search] Total raw offers from all origins and strategies: ${allRawOffers.length}`);
  
  // Dedupe by outbound+return departure times to avoid duplicate offers
  const uniqueOffers = dedupOffers(allRawOffers);
  console.log(`[flight-search] ${uniqueOffers.length} unique offers after deduplication`);
  
  // Log input duration parameters
  console.log(`[flight-search] Duration filter params: minDuration=${params.minDuration}, maxDuration=${params.maxDuration}`);

  // Enhanced server-side duration filter with detailed logging
  const msPerDay = 24 * 60 * 60 * 1000;
  const durationFilteredOffers = uniqueOffers.filter((offer: any, i: number) => {
    try {
      const dep = new Date(offer.itineraries[0].segments[0].departure.at);
      const backItin = offer.itineraries[1];
      
      if (!backItin) {
        console.log(`[flight-search] Offer #${i}: No return itinerary, skipping.`);
        return false;
      }
      
      const backSeg = backItin.segments?.slice(-1)[0];
      const backAt = backSeg?.departure?.at || backSeg?.arrival?.at || null;
      
      if (!backAt) {
        console.log(`[flight-search] Offer #${i}: No return time, skipping.`);
        return false;
      }

      const ret = new Date(backAt);
      const tripDays = Math.round((ret.getTime() - dep.getTime()) / msPerDay);

      // Enhanced logging showing detailed timing information
      console.log(`[flight-search] Offer #${i}: outAt=${dep.toISOString()}, backAt=${ret.toISOString()}, days=${tripDays}, allowed=${params.minDuration}-${params.maxDuration}`);

      // We use a strict filter here to ensure we only get trips within the requested duration range
      const matches = tripDays >= params.minDuration && tripDays <= params.maxDuration;
      console.log(`[flight-search] Offer #${i}: matches duration filter: ${matches}`);
      return matches;
    } catch (err) {
      console.error(`[flight-search] Offer #${i}: Exception in filter:`, err);
      return false;
    }
  });
  
  console.log(`[flight-search] Kept ${durationFilteredOffers.length} offers after duration filter (from ${uniqueOffers.length})`);
  
  if (durationFilteredOffers.length === 0) {
    console.log(`[flight-search] No offers found that match duration criteria ${params.minDuration}-${params.maxDuration} days`);
    
    // If we have offers but none match our strict duration filter, 
    // try one last time with relaxed duration constraints if this was a strict search
    if (uniqueOffers.length > 0 && params.minDuration > 1 && params.maxDuration < 30) {
      console.log(`[flight-search] FALLBACK 3: Trying relaxed duration filter as fallback`);
      // Use a more permissive filter
      const relaxedOffers = uniqueOffers.filter((offer: any) => {
        try {
          const dep = new Date(offer.itineraries[0].segments[0].departure.at);
          const backAt = offer.itineraries[1]?.segments?.slice(-1)[0]?.departure?.at;
          
          if (!backAt) return false;
          
          const ret = new Date(backAt);
          const tripDays = Math.round((ret.getTime() - dep.getTime()) / msPerDay);
          
          // More permissive filter - accept anything reasonable
          const isReasonable = tripDays >= 1 && tripDays <= 30;
          if (isReasonable) {
            console.log(`[flight-search] Relaxed filter accepting offer with duration: ${tripDays} days`);
          }
          return isReasonable;
        } catch (err) {
          return false;
        }
      });
      
      if (relaxedOffers.length > 0) {
        console.log(`[flight-search] Found ${relaxedOffers.length} offers with relaxed duration filter`);
        // Transform Amadeus response to our database format
        const api = { data: relaxedOffers };
        return transformAmadeusToOffers(api, tripRequestId);
      }
    }
    
    return [];
  }

  // Transform Amadeus response to our database format
  console.log(`[flight-search] Found ${durationFilteredOffers.length} offers for trip ${tripRequestId}`);
  const api = { data: durationFilteredOffers };
  return transformAmadeusToOffers(api, tripRequestId);
}

// Helper to calculate a return date based on departure and duration
function calculateReturnDate(departureDate: Date, durationDays: number, latestAllowed: Date): string {
  // Calculate return date based on duration
  const returnDate = new Date(departureDate.getTime() + (durationDays * 24 * 60 * 60 * 1000));
  
  // If calculated return would be after the latest allowed date, cap it at latest allowed
  const finalReturnDate = returnDate > latestAllowed ? latestAllowed : returnDate;
  return finalReturnDate.toISOString().slice(0, 10);
}

// Helper to deduplicate offers based on key properties
function dedupOffers(allOffers: any[]): any[] {
  return Array.from(
    new Map(
      allOffers.map((offer: any) => {
        try {
          const outSeg = offer.itineraries[0]?.segments[0];
          const backSeg = offer.itineraries[1]?.segments.slice(-1)[0] ?? null;
          
          if (!outSeg || !backSeg) {
            console.log("[flight-search] Skipping offer with missing segments");
            return null; // Filter this out later
          }
          
          const key = [
            outSeg.carrierCode,
            outSeg.number,
            outSeg.departure?.at || "",
            backSeg.departure?.at || ""
          ].join("-");
          return [key, offer];
        } catch (err) {
          console.error("[flight-search] Error in deduplication:", err);
          return null; // Filter this out later
        }
      }).filter(Boolean) as [string, any][]
    ).values()
  );
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
        
        // Get outbound and return dates
        const departureDate = out.departure.at.split("T")[0];
        const returnDate = back.departure.at.split("T")[0];
        
        // Calculate trip duration for a final check (belt and suspenders)
        const outDate = new Date(departureDate);
        const retDate = new Date(returnDate);
        const tripDays = Math.round((retDate.getTime() - outDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return [{
          trip_request_id: tripRequestId,
          airline: out.carrierCode,
          flight_number: out.number,
          departure_date: departureDate,
          departure_time: out.departure.at.split("T")[1].slice(0,5),
          return_date: returnDate,
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

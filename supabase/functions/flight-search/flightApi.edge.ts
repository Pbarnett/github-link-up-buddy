const amadeusClientId = Deno.env.get("AMADEUS_CLIENT_ID");
const amadeusClientSecret = Deno.env.get("AMADEUS_CLIENT_SECRET");
if (!amadeusClientId || !amadeusClientSecret) {
  console.error('Error: Missing Amadeus environment variables. AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET must be set.');
  throw new Error('Edge Function: Missing Amadeus environment variables (AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET).');
}

// This file is specifically for Supabase Edge Functions
// It contains Deno-specific code that shouldn't be imported by client-side code

import type { TablesInsert } from "@/integrations/supabase/types";

// --- Types for Offer Scoring & Pooling (PR #8) ---
interface OfferSegment { stops: number; durationMins: number; }

interface RawOffer {
  id: string;
  price: number;
  segments: OfferSegment[];
  hasCarryOn: boolean;
  seat?: string;
}

interface ScoredOffer extends RawOffer {
  score: number;
  reasons: string[];
}

interface SearchOffersResult {
  dbOffers: TablesInsert<'flight_offers'>[];
  pools: { poolA: ScoredOffer[]; poolB: ScoredOffer[]; poolC: ScoredOffer[]; };
}

const constraintProfiles = {
  hard: {
    stops: 0,
    carry_on: true,
    price_ceiling: 'budget', // This will be evaluated against params.budget
    seatPrefOrder: ['AISLE', 'WINDOW', 'MIDDLE'], // Added as per scoring logic in brief
  },
  relaxations: [ // Not directly used by scoring in PR #8 brief, but part of the constant
    { "stops": 1, "maxLayoverHrs": 3 },
    { "price_ceiling": "budget * 1.2" },
    { "price_ceiling": "budget * 1.44" },
    { "stops": 2 }
  ],
};
// --- End of Types for Offer Scoring & Pooling ---

// --- Helper Functions for Offer Processing (PR #8) ---
function parseDuration(dur: string): number {
  // Matches ISO 8601 duration format like PT1H30M
  const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  return m ? (Number(m[1]) || 0) * 60 + (Number(m[2]) || 0) : 0;
}

// Placeholder/Simplified version as actual logic for Amadeus carry-on is complex
// and depends on specific offer fields not detailed in RawOffer for this PR.
function offerIncludesCarryOnAndPersonal(offer: any): boolean {
  // This is a STUB. A real implementation would inspect detailed fare rules
  // or specific fields in the Amadeus offer structure.
  // For this PR, we'll default to true.
  return true; // Default stub: assume carry-on included
}

const checkCarryOnIncluded = (offer: any): boolean => offerIncludesCarryOnAndPersonal(offer);

// Placeholder/Simplified version for seat preference extraction.
// Actual logic requires seat map availability and pricing, not typically in basic offer.
function decideSeatPreference(offer: any, criteria: { max_price: number }): string | undefined {
  // This is a STUB. A real implementation is complex.
  // The scoring logic expects this to return 'AISLE', 'WINDOW', OR 'MIDDLE' if matched.
  // This function will be called from within searchOffers where criteria.max_price (from params.budget) is available.
  // If `offer.seat` (as per RawOffer type definition) is pre-populated by the mapping logic, use it.
  if (offer.seat) {
      const seatUpper = String(offer.seat).toUpperCase(); // Ensure it's a string before calling toUpperCase
      if (['AISLE', 'WINDOW', 'MIDDLE'].includes(seatUpper)) {
          return seatUpper;
      }
  }
  // Otherwise, for this stub, let's not guess a seat.
  return undefined;
}
// --- End of Helper Functions ---

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

  try {
    const res = await fetchWithTimeout(
      `${Deno.env.get("AMADEUS_BASE_URL")}/v1/security/oauth2/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: Deno.env.get("AMADEUS_CLIENT_ID")!,
          client_secret: Deno.env.get("AMADEUS_CLIENT_SECRET")!,
        }),
      },
      8000 // Timeout for token fetch
    );

    if (!res.ok) throw new Error(`Token fetch failed: ${res.status} ${await res.text()}`);
    const tokenData = await res.json();
    _token = tokenData.access_token;
    _tokenExpires = now + tokenData.expires_in * 1000;

    console.log("[flight-search] Successfully received token");
    return _token!;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn(`[flight-search] Timeout during OAuth token fetch.`);
      throw new Error("Token fetch timed out");
    }
    console.error("[flight-search] Error in fetchToken:", err.message);
    throw err; // Re-throw other errors
  }
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

// Helper function for fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, ms = 10_000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response; // Return the whole response object
  } finally {
    clearTimeout(id);
  }
}

// ——————————————————————————————————————————
// Placeholder booking URL generator
// ——————————————————————————————————————————
function generatePlaceholderBookingUrl(
  airlineCode: string,
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string
): string {
  // Map airline codes to their website domains
  const airlineWebsites: Record<string, string> = {
    'DL': 'delta.com',
    'AA': 'aa.com', 
    'UA': 'united.com',
    'WN': 'southwest.com',
    'B6': 'jetblue.com',
    'AS': 'alaskaair.com',
    'NK': 'spirit.com',
    'F9': 'flyfrontier.com',
    'G4': 'allegiantair.com',
    'SY': 'sun-air.com',
    'HA': 'hawaiianairlines.com',
    'VX': 'virginamerica.com',
  };

  const website = airlineWebsites[airlineCode] || `${airlineCode.toLowerCase()}-airlines.com`;
  
  // Create a basic booking URL with common parameters
  const params = new URLSearchParams({
    from: origin,
    to: destination,
    departure: departureDate,
    return: returnDate,
    passengers: '1',
    ref: 'external-booking-placeholder'
  });

  return `https://www.${website}/booking?${params.toString()}`;
}

// ——————————————————————————————————————————
// Main Amadeus flight-offers call (v2 JSON body)
// ——————————————————————————————————————————
export async function searchOffers(
  params: FlightSearchParams,
  tripRequestId: string
): Promise<SearchOffersResult> {
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
          try {
            const r = await fetchWithTimeout(url, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(simplePayload),
            }, 8000); // Timeout for simplified search

            if (!r.ok) {
              const errorText = await r.text();
              throw new Error(`Simplified search error: ${r.status} - ${errorText}`);
            }
            return await r.json();
          } catch (err) {
            if (err.name === 'AbortError') {
              console.warn(`[flight-search] Timeout during simplified fallback Amadeus call for URL: ${url}`);
              return { data: [] }; // Return shape expected by withRetry logic
            }
            throw err; // Re-throw other errors
          }
        };
        
        const resp = await withRetry(async () => {
          try {
            const r = await fetchWithTimeout(url, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }, 8000); // Timeout for main search

            if (!r.ok) {
              const errorText = await r.text();
              console.error(`[flight-search] Amadeus API error: ${r.status}`, errorText);
              throw new Error(`Amadeus API error: ${r.status} - ${errorText}`);
            }
            return await r.json();
          } catch (err) {
            if (err.name === 'AbortError') {
              console.warn(`[flight-search] Timeout during main Amadeus call for URL: ${url}`);
              return { data: [] }; // Return shape expected by withRetry logic
            }
            throw err; // Re-throw other errors
          }
        }, 3, 500, simplifiedSearch);
        
        if (resp && resp.data && resp.data.length > 0) { // Added null check for resp
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
        try {
          const r = await fetchWithTimeout(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }, 8000); // Timeout for first-tier fallback

          if (!r.ok) {
            throw new Error(`Fallback single-origin search failed: ${r.status} ${await r.text()}`);
          }
          return await r.json();
        } catch (err) {
          if (err.name === 'AbortError') {
            console.warn(`[flight-search] Timeout during first-tier fallback Amadeus call for URL: ${url}`);
            return { data: [] }; // Return shape expected by withRetry logic
          }
          throw err; // Re-throw other errors
        }
      });
      
      if (resp && resp.data && resp.data.length > 0) { // Added null check for resp
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
      
      let data: any = { data: [] }; // Default to no data
      try {
        const resp = await fetchWithTimeout(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(relaxedPayload),
        }, 8000); // Timeout for second-tier fallback

        if (resp.ok) {
          data = await resp.json();
        } else {
          console.error(`[flight-search] Maximally relaxed search failed (HTTP error): ${resp.status} ${await resp.text()}`);
          // data remains { data: [] }
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.warn(`[flight-search] Timeout during maximally relaxed Amadeus call for URL: ${url}`);
        } else {
          // Log other errors but don't necessarily throw, as this is a last-ditch fallback
          console.error("[flight-search] Error during maximally relaxed Amadeus call:", err);
        }
        // data remains { data: [] }, so no offers will be pushed
      }

      if (data.data && data.data.length > 0) {
        console.log(`[flight-search] Found ${data.data.length} offers with maximally relaxed criteria`);
        allRawOffers.push(...data.data);
      } else {
        console.log("[flight-search] No offers found even with maximally relaxed criteria");
      }
    } catch (extremeFallbackError) { // This catch is for errors in setting up relaxedPayload or other logic before fetch
      console.error("[flight-search] Error in extreme fallback setup:", extremeFallbackError);
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

  // --- Start of PR #8 Mapping, Scoring, and Pooling Logic ---

  // If no offers after duration filtering, return empty results for pools too
  if (durationFilteredOffers.length === 0) {
    console.log("[flight-search] No duration-filtered offers to process for scoring and pooling.");
    const dbOffers = transformAmadeusToOffers( // Still call transform to get correctly typed empty array
      { data: [] },
      tripRequestId,
      params.origin[0],
      params.destination!
    );
    return { // Return type is SearchOffersResult
      dbOffers,
      pools: { poolA: [], poolB: [], poolC: [] },
    };
  }

  // Define extractSeatPreference helper that uses params.budget from searchOffers scope
  const extractSeatPreference = (offer: any): string | undefined =>
    decideSeatPreference(offer, { max_price: params.budget });

  // 1) Map to RawOffer[]
  console.log("[flight-search] Mapping Amadeus offers to RawOffer structure...");
  const rawOffers: RawOffer[] = durationFilteredOffers.map((offer: any) => {
    // Basic error checking for critical offer structure
    if (!offer.id || !offer.price?.total || !offer.itineraries?.[0]?.segments) {
      console.warn("[flight-search] Skipping malformed Amadeus offer during RawOffer mapping:", offer.id);
      return null; // Will be filtered out later
    }
    return {
      id: offer.id,
      price: parseFloat(offer.price.total) || 0,
      segments: offer.itineraries.flatMap((it: any) =>
        it.segments.map((seg: any) => ({
          stops: seg.numberOfStops ?? 0,
          durationMins: parseDuration(seg.duration), // Uses global parseDuration
        }))
      ),
      hasCarryOn: checkCarryOnIncluded(offer), // Uses global checkCarryOnIncluded
      seat: extractSeatPreference(offer), // Uses locally defined extractSeatPreference
    };
  }).filter(Boolean) as RawOffer[]; // Filter out any nulls from malformed offers
  console.log(`[flight-search] Mapped ${rawOffers.length} offers to RawOffer structure.`);

  // 2) Score & Bucket
  console.log("[flight-search] Scoring and bucketing RawOffers...");
  let scoredOffers: ScoredOffer[];
  try {
    scoredOffers = rawOffers.map(o => {
      const reasons: string[] = [];
      let score = 0;
      
      // Ensure segments exist and is an array before calling 'every'
      if (o.segments && Array.isArray(o.segments) && o.segments.every(s => s.stops === 0)) {
        score += 40;
      } else {
        reasons.push('+1 stop');
      }

      if (o.hasCarryOn) {
        score += 10;
      } else {
        reasons.push('no carry-on');
      }

      const budget = params.budget; // From searchOffers params
      if (o.price <= budget) {
        score += 20;
      } else {
        reasons.push(`$${(o.price - budget).toFixed(2)} over budget`);
      }

      // Use constraintProfiles constant defined at the top of the file
      if (o.seat && constraintProfiles.hard.seatPrefOrder && constraintProfiles.hard.seatPrefOrder.includes(o.seat)) {
        score += 10;
      } else {
        reasons.push('seat unavailable');
      }
      // console.debug is not available in Deno edge functions, use console.log
      console.log('[flight-search] scoreOffer debug:', { id: o.id, score, reasons });
      return { ...o, score, reasons };
    });
  } catch (err) {
    console.error('[flight-search] Scoring error:', err);
    scoredOffers = rawOffers.map(o => ({ ...o, score: 0, reasons: ['scoring_error'] }));
  }
  console.log(`[flight-search] Scored ${scoredOffers.length} offers.`);

  const poolA = scoredOffers.filter(o => o.score >= 80);
  const poolB = scoredOffers.filter(o => o.score >= 50 && o.score < 80);
  const poolC = scoredOffers.filter(o => o.score < 50);
  console.log(`[flight-search] Pooling results: Pool A (${poolA.length}), Pool B (${poolB.length}), Pool C (${poolC.length})`);

  // --- End of PR #8 Mapping, Scoring, and Pooling Logic ---
  // (The pools: poolA, poolB, poolC are defined by the logic block above this point)

  // Transform Amadeus response to our database format for dbOffers.
  // This uses the original durationFilteredOffers that passed all initial criteria
  // and were used as input for the RawOffer mapping.
  console.log(`[flight-search] Found ${durationFilteredOffers.length} offers for trip ${tripRequestId} to be transformed for DB.`);
  const api = { data: durationFilteredOffers };
  const dbOffers = transformAmadeusToOffers(api, tripRequestId, params.origin[0], params.destination!);

  console.log(`[flight-search] Returning ${dbOffers.length} dbOffers and pools A:${poolA.length}, B:${poolB.length}, C:${poolC.length}.`);
  return {
    dbOffers,
    pools: { poolA, poolB, poolC },
  };
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
export function dedupOffers(allOffers: any[]): any[] { // Added 'export'
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

// Transform Amadeus response to our format with enhanced fields
export function transformAmadeusToOffers(
  api: any, 
  tripRequestId: string, 
  primaryOrigin: string, 
  destination: string
): TablesInsert<"flight_offers">[] {
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
        
        // Extract carrier code from segment data
        const carrierCode = out.carrierCode || "";
        
        // Extract origin and destination from segment data
        const originAirport = out.departure?.iataCode || primaryOrigin;
        const destinationAirport = out.arrival?.iataCode || destination;
        
        // Get outbound and return dates
        const departureDate = out.departure.at.split("T")[0];
        const returnDate = back.departure.at.split("T")[0];
        
        // Try to get real booking link from Amadeus first
        const realBookingLink = offer.pricingOptions?.agents?.[0]?.deepLink || offer.deepLink || null;
        
        let bookingLink = realBookingLink;
        
        // Generate placeholder booking URL if no real link available
        if (!realBookingLink) {
          bookingLink = generatePlaceholderBookingUrl(
            carrierCode,
            originAirport,
            destinationAirport, 
            departureDate,
            returnDate
          );
          console.log(`[flight-search] Generated placeholder booking URL for ${carrierCode}: ${bookingLink}`);
        } else {
          console.log(`[flight-search] Using real Amadeus booking link for ${carrierCode}: ${realBookingLink}`);
        }

        return [{
          trip_request_id: tripRequestId,
          airline: carrierCode,
          carrier_code: carrierCode,
          origin_airport: originAirport,
          destination_airport: destinationAirport,
          flight_number: out.number,
          departure_date: departureDate,
          departure_time: out.departure.at.split("T")[1].slice(0,5),
          return_date: returnDate,
          return_time: back.departure.at.split("T")[1].slice(0,5),
          duration: offer.itineraries[0].duration,
          price: parseFloat(offer.price.total),
          booking_url: bookingLink,
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

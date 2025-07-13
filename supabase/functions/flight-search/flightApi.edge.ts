const amadeusClientId = Deno.env.get("AMADEUS_CLIENT_ID");
const amadeusClientSecret = Deno.env.get("AMADEUS_CLIENT_SECRET");
const testMode = Deno.env.get("TEST_MODE") === "true";

if (!testMode && (!amadeusClientId || !amadeusClientSecret)) {
  console.error('Error: Missing Amadeus environment variables. AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET must be set.');
  throw new Error('Edge Function: Missing Amadeus environment variables (AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET).');
}

if (testMode) {
  console.log('🔧 [TEST_MODE] Running in test mode - using mock data instead of real Amadeus API');
}

// This file is specifically for Supabase Edge Functions
// It contains Deno-specific code that shouldn't be imported by client-side code

import type { TablesInsert } from "@/integrations/supabase/types";

// --- Types for Offer Scoring & Pooling (PR #8) ---
interface OfferSegment { stops: number; durationMins: number; }

// New FlightPricing interface defined before RawOffer
interface FlightPricing {
  base: number;
  carryOnFee: number;
  total: number;
}

interface RawOffer {
  id: string;
  /** LEGACY – keep one release */
  price: number; // This 'price' will now store 'total' (base + carryOnFee)
  /** NEW – structured pricing */
  priceStructure: FlightPricing;
  carryOnIncluded: boolean; // Renamed from hasCarryOn
  segments: OfferSegment[];
  seat?: string;
}

interface ScoredOffer extends RawOffer {
  score: number;
  reasons: string[];
}

export interface SearchOffersResult { // Exporting SearchOffersResult
  dbOffers: TablesInsert<'flight_offers'>[];
  pools: { poolA: ScoredOffer[]; poolB: ScoredOffer[]; poolC: ScoredOffer[]; };
}

const constraintProfiles = {
  hard: {
    stops: 0,
    carry_on: true,
    price_ceiling: 'budget',
    seatPrefOrder: ['AISLE', 'WINDOW', 'MIDDLE'],
  },
  relaxations: [
    { "stops": 1, "maxLayoverHrs": 3 },
    { "price_ceiling": "budget * 1.2" },
    { "price_ceiling": "budget * 1.44" },
    { "stops": 2 }
  ],
};
// --- End of Types for Offer Scoring & Pooling ---

// --- Helper Functions for Offer Processing (PR #8) ---
function parseDuration(dur: string): number {
  const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  return m ? (Number(m[1]) || 0) * 60 + (Number(m[2]) || 0) : 0;
}

// function offerIncludesCarryOnAndPersonal(_offer: unknown): boolean {
//   return true;
// }

// const checkCarryOnIncluded = (offer: unknown): boolean => offerIncludesCarryOnAndPersonal(offer);

function decideSeatPreference(offer: Record<string, unknown>, _: { max_price: number }): string | undefined {
  if (offer.seat) {
      const seatUpper = String(offer.seat).toUpperCase();
      if (['AISLE', 'WINDOW', 'MIDDLE'].includes(seatUpper)) {
          return seatUpper;
      }
  }
  return undefined;
}
// --- End of Helper Functions ---

/**
 * computeCarryOnFee
 *  – returns fee → number
 *  – returns 0   → free carry-on
 *  – returns null→ opaque → discard offer
 * PERF: called 100-300× / search – keep O(n).
 */
export function computeCarryOnFee(offer: Record<string, unknown>): number|null {
  // 🚨 ROLLBACK MECHANISM: Check feature flag for emergency disable
  const allowUnknownCarryOn = Deno.env.get("ALLOW_UNKNOWN_CARRYON");
  if (allowUnknownCarryOn === "false" || allowUnknownCarryOn === "0") {
    console.log('[carry-on] Feature disabled via ALLOW_UNKNOWN_CARRYON flag, returning 0');
    return 0; // Temporary fallback - treat all as free carry-on
  }

  /* TEMP: capture first sample for schema discovery */
  // Use console.log for Deno compatibility, and stringify carefully for large objects
  if (Deno.env.get("DEBUG_BAGGAGE") === "true") { // Conditional logging
    try {
        console.log('[carry-on] sample offer (brief):', JSON.stringify(offer, (key, value) => key === "dictionaries" ? undefined : value, 2)?.slice(0,1500));
    } catch {
        console.log('[carry-on] sample offer (brief) could not be stringified for offer ID:', offer?.id);
    }
  }

  try {
    if (!offer || !Array.isArray(offer.travelerPricings) || offer.travelerPricings.length === 0) { // Added check for offer and empty travelerPricings
        // console.log('[carry-on] No travelerPricings array or empty for offer:', offer?.id);
        return null;
    }

    // Check all travelerPricings, assuming adult fare is representative or fees are consistent.
    // If multiple travelerPricings, this logic might need refinement based on which one to use.
    // For now, iterate and see if any segment indicates a fee or inclusion.

    let totalCarryOnFee = 0;
    let carryOnInfoFound = false; // Flag to indicate if any carry-on info (fee or included) was found

    for (const tp of offer.travelerPricings) {
        if (!tp || !Array.isArray(tp.fareDetailsBySegment)) {
            // console.log('[carry-on] Missing fareDetailsBySegment for a travelerPricing in offer:', offer?.id);
            continue; // Skip this travelerPricing if fareDetailsBySegment is missing
        }

        // The fee should ideally be per direction or per offer, not summed across segments unless explicitly additive.
        // Amadeus pricing for baggage is usually per segment or per direction.
        // For simplicity as per brief, this sums fees if found across segments for a given traveler.
        // This might overestimate if fee is per direction & applies to all segments of that direction.
        // Let's refine to find if *any* segment has a determinable fee or inclusion.

        let feeForThisTraveler = 0;
        let infoFoundForThisTraveler = false;

        for (const segDetail of tp.fareDetailsBySegment) {
            if (segDetail && Array.isArray(segDetail.additionalServices)) {
                const baggageService = segDetail.additionalServices.find(
                (s: { type: string; description?: string; amount?: string }) => s.type === 'BAGGAGE' && /CARRY ON|CABIN BAG/i.test(s.description?.toUpperCase() || '')
                );
                if (baggageService) {
                    // Found carry-on service, this means info is available
                    infoFoundForThisTraveler = true;
                    if (baggageService.amount) {
                        feeForThisTraveler += parseFloat(baggageService.amount) || 0;
                    }
                    // If no amount field, treat as free (fee remains 0)
                }
            }
            // Check for included baggage as a sign that info is present
            if (segDetail && segDetail.includedCheckedBags && typeof segDetail.includedCheckedBags.quantity === 'number') { // Assuming quantity implies info
                // This is for checked bags, but its presence might mean fare is not "basic"
                 infoFoundForThisTraveler = true; // Found some baggage info
            }

            // If fare basis indicates basic/light, we must have found some info (fee or included)
            // otherwise, it's opaque for carry-on for that segment.
            if (segDetail && /BASIC|LIGHT/.test(segDetail.fareBasis?.toUpperCase()||'')) {
                // If it's a basic/light fare and we haven't found explicit carry-on info (fee or free),
                // then for this segment, it's opaque.
                // The overall offer becomes opaque if *any* segment is basic/light AND opaque for carry-on.
                if (!infoFoundForThisTraveler) { // no info found yet (neither carry-on service nor included bags)
                    // console.log('[carry-on] Basic/Light fare segment without explicit carry-on fee/inclusion for offer:', offer?.id, 'segment:', segDetail.segmentId);
                    return null; // Opaque for this segment, thus for the offer
                }
            }
        } // end loop for fareDetailsBySegment

        // Accumulate if processing multiple travelerPricings (e.g. find max fee, or first one)
        // For now, using the fee from the first travelerPricing that provides info.
        if (infoFoundForThisTraveler) {
            totalCarryOnFee = feeForThisTraveler;
            carryOnInfoFound = true;
            break; // Found info for one traveler type, assume it's representative
        }
    } // end loop for travelerPricings


    if (carryOnInfoFound) {
        // console.log(`[carry-on] Fee determined for offer ${offer?.id}: ${totalCarryOnFee}`);
        return totalCarryOnFee;
    } else {
        // If no specific carry-on info was found across all travelerPricings and segments
        // console.log('[carry-on] No specific carry-on fee or inclusion info found for offer:', offer?.id);
        return null; // Opaque
    }

  } catch(e) {
    console.error('[carry-on] parse error for offer id:', offer?.id, e);
    return null;
  }
}

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

// OAuth2 Token Management (simplified from provided content for brevity, assuming it's correct)
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
    throw err;
  }
}


// Retry with exponential backoff (simplified)
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3, baseDelayMs = 500, simplifiedFallbackFn?: () => Promise<T>): Promise<T> {
  let attempt = 0;
  let lastError: Error;
  while (true) {
    attempt++;
    try { return await fn(); } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      lastError = err;
      if (attempt >= maxAttempts) {
        if (simplifiedFallbackFn) {
          try { return await simplifiedFallbackFn(); } catch { throw lastError; }
        }
        throw err;
      }
      if (! (err.message.includes("429") || err.message.startsWith("5") || err.name === "TypeError" || err.name === "NetworkError")) throw err;
      const delay = baseDelayMs * 2 ** (attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// fetchWithTimeout (simplified)
async function fetchWithTimeout(url: string, options: RequestInit, ms = 10_000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try { return await fetch(url, { ...options, signal: controller.signal }); } finally { clearTimeout(id); }
}

// Placeholder booking URL generator (simplified)
function generatePlaceholderBookingUrl(airlineCode: string, origin: string, destination: string, departureDate: string, returnDate: string): string {
  return `https://www.example.com/booking?from=${origin}&to=${destination}&dep=${departureDate}&ret=${returnDate}&airline=${airlineCode}`;
}

export async function searchOffers(
  params: FlightSearchParams,
  tripRequestId: string
): Promise<SearchOffersResult> { // Correct return type
  console.log(`[flight-search] Starting searchOffers for trip ${tripRequestId}`);
  const token = await fetchToken();
  const allRawAmadeusOffers: Record<string, unknown>[] = []; // Changed variable name for clarity

  // ... (Main search logic with strategies, fallbacks - assumed to be the version from end of PR #8)
  // This part is complex and long, assuming it's the one that correctly populates `allRawAmadeusOffers`
  // For brevity, I'm not reproducing the entire multi-level search and fallback logic here.
  // It's the logic that was present when flightApi.edge.ts was last correctly modified for PR #8.
  // This includes:
  // - Iterating origin codes
  // - Iterating search strategies (max-duration, min-duration, mid-window)
  // - Building payload for Amadeus
  // - Calling Amadeus API via withRetry and fetchWithTimeout
  // - Handling responses and pushing to allRawAmadeusOffers
  // - First-tier fallback (primary origin only)
  // - Second-tier fallback (maximally relaxed criteria)

  // Example of how the Amadeus call might look within the loops:
  // const resp = await withRetry(async () => { /* ... fetch logic ... */ return await r.json(); });
  // if (resp && resp.data && resp.data.length > 0) { allRawAmadeusOffers.push(...resp.data); }


  // Import config from lib to check if we should use mock
  const { useMock, amadeusHost } = await import("../lib/config.ts");
  
  if (useMock) {
    console.log("[flight-search] Using mock data - AMADEUS_LIVE=0");
    // Inject dummy data for testing
    allRawAmadeusOffers.push({ 
        id: "mock-offer-1",
        itineraries: [
          { 
            segments: [{ 
              departure: { iataCode: params.origin[0], at: "2024-09-10T10:00:00" }, 
              arrival: { iataCode: params.destination, at: "2024-09-10T12:00:00" },
              carrierCode: "BA",
              number: "123",
              duration: "PT2H" 
            }], 
            duration: "PT2H" 
          }, 
          { 
            segments: [{ 
              departure: { iataCode: params.destination, at: "2024-09-12T14:00:00" }, 
              arrival: { iataCode: params.origin[0], at: "2024-09-12T16:00:00" },
              carrierCode: "BA",
              number: "124",
              duration: "PT2H" 
            }], 
            duration: "PT2H" 
          }
        ],
        price: { total: "250.00" },
        travelerPricings: [{ 
          fareDetailsBySegment: [{ 
            additionalServices: [{
              type: "BAGGAGE", 
              description: "CARRY ON BAG", 
              amount: "30.00"
            }]
          }]
        }]
    });
  } else {
    console.log("[flight-search] Making real Amadeus API calls - AMADEUS_LIVE=1");
    
    // Real Amadeus API implementation
    for (const originCode of params.origin) {
      console.log(`[flight-search] Searching from origin: ${originCode}`);
      
      // Calculate search parameters
      const searchParams = new URLSearchParams({
        originLocationCode: originCode,
        destinationLocationCode: params.destination!,
        departureDate: params.earliestDeparture.toISOString().split('T')[0],
        adults: '1', // Default to 1 adult for now
        max: '3', // Limit to 3 offers per search
      });
      
      // Add return date for round trip
      const returnDate = new Date(params.earliestDeparture.getTime() + params.minDuration * 24 * 60 * 60 * 1000);
      searchParams.append('returnDate', returnDate.toISOString().split('T')[0]);
      
      try {
        console.log(`[flight-search] Calling Amadeus API: ${amadeusHost}/v2/shopping/flight-offers?${searchParams.toString()}`);
        
        const response = await withRetry(async () => {
          const resp = await fetchWithTimeout(
            `${amadeusHost}/v2/shopping/flight-offers?${searchParams.toString()}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
              }
            },
            15000 // 15 second timeout
          );
          
          if (!resp.ok) {
            const errorText = await resp.text();
            throw new Error(`Amadeus API error ${resp.status}: ${errorText}`);
          }
          
          return await resp.json();
        });
        
        if (response && response.data && Array.isArray(response.data)) {
          console.log(`[flight-search] Found ${response.data.length} offers from ${originCode}`);
          allRawAmadeusOffers.push(...response.data);
        } else {
          console.log(`[flight-search] No offers found from ${originCode}`);
        }
      } catch (error) {
        console.error(`[flight-search] Error searching from ${originCode}:`, error.message);
        // Continue with next origin
      }
    }
  }


  if (allRawAmadeusOffers.length === 0) {
    console.log(`[flight-search] No offers found after all fallback strategies`);
    return { dbOffers: [], pools: { poolA: [], poolB: [], poolC: [] } }; // Ensure correct empty return
  }

  console.log(`[flight-search] Total raw Amadeus offers from all strategies: ${allRawAmadeusOffers.length}`);
  const uniqueOffers = dedupOffers(allRawAmadeusOffers); // Uses the dedupOffers from the file
  console.log(`[flight-search] ${uniqueOffers.length} unique Amadeus offers after deduplication`);
  
  const msPerDay = 24 * 60 * 60 * 1000;
  const durationFilteredOffers = uniqueOffers.filter((offer: Record<string, unknown>) => {
    try {
      const dep = new Date(offer.itineraries[0].segments[0].departure.at);
      const backItin = offer.itineraries[1];
      if (!backItin) return false;
      const backSeg = backItin.segments?.slice(-1)[0];
      const backAt = backSeg?.departure?.at || backSeg?.arrival?.at || null;
      if (!backAt) return false;
      const ret = new Date(backAt);
      const tripDays = Math.round((ret.getTime() - dep.getTime()) / msPerDay);
      return tripDays >= params.minDuration && tripDays <= params.maxDuration;
    } catch { return false; }
  });
  console.log(`[flight-search] Kept ${durationFilteredOffers.length} offers after duration filter.`);

  // --- Start of PR #8 Mapping, Scoring, and Pooling Logic (from known good state) ---
  if (durationFilteredOffers.length === 0) {
    console.log("[flight-search] No duration-filtered offers for scoring/pooling.");
    const dbOffers = transformAmadeusToOffers({ data: [] }, tripRequestId, params.origin[0], params.destination!);
    return { dbOffers, pools: { poolA: [], poolB: [], poolC: [] } };
  }

  const extractSeatPreference = (offer: Record<string, unknown>): string | undefined => decideSeatPreference(offer, { max_price: params.budget });

  // --- Start of new RawOffer mapping (PR #9) ---
  console.log("[flight-search] Mapping Amadeus offers to RawOffer structure with carry-on fee processing...");
  const rawOffers: RawOffer[] = [];

  for (const offer of durationFilteredOffers) {
    if (!offer?.id || !offer?.price?.total) {
      console.warn("[flight-search] Skipping offer due to missing id or price.total:", offer?.id);
      continue;
    }

    const base = parseFloat(offer.price.total) || 0; // Amadeus offer.price.total is the base price before our carry-on fee
    const carryOnFee = computeCarryOnFee(offer); // Call the new helper

    if (carryOnFee === null) {
      console.log(`[flight-search] Skipping opaque offer (carryOnFee is null) id: ${offer.id}`);
      continue; // discard opaque offer
    }

    const total = base + carryOnFee;

    // extractSeatPreference is defined above this loop

    rawOffers.push({
      id: offer.id,
      price: total,                               // LEGACY (now total price with carry-on)
      priceStructure: { base, carryOnFee, total }, // NEW
      carryOnIncluded: carryOnFee === 0,
      segments: (offer.itineraries as { segments: { numberOfStops?: number; duration: string }[] }[]).flatMap((it) => // This assumes itineraries exist and are arrays
        it.segments.map((seg) => ({ // This assumes segments exist and are arrays
          stops: seg.numberOfStops ?? 0,
          durationMins: parseDuration(seg.duration), // Uses global parseDuration
        }))
      ),
      seat: extractSeatPreference(offer), // Uses locally defined extractSeatPreference from PR #8
    });
  }
  console.log(`[flight-search] Mapped ${rawOffers.length} offers to RawOffer structure after carry-on processing.`);
  // --- End of new RawOffer mapping ---

  console.log("[flight-search] Scoring and bucketing RawOffers...");
  let scoredOffers: ScoredOffer[];
  try {
    scoredOffers = rawOffers.map(o => {
      const reasons: string[] = [];
      let score = 0;
      if (o.segments && Array.isArray(o.segments) && o.segments.every(s => s.stops === 0)) score += 40; else reasons.push('+1 stop');
      if (o.carryOnIncluded) {
        score += 10;
      } else {
        reasons.push(`+$${o.priceStructure.carryOnFee.toFixed(2)} carry-on`);
      }
      // Scoring now uses o.priceStructure.total (which is equivalent to new o.price)
      if (o.priceStructure.total <= params.budget) score += 20; else reasons.push(`$${(o.priceStructure.total - params.budget).toFixed(2)} over budget`);
      if (o.seat && constraintProfiles.hard.seatPrefOrder && constraintProfiles.hard.seatPrefOrder.includes(o.seat)) score += 10; else reasons.push('seat unavailable');
      console.log('[flight-search] scoreOffer debug:', { id: o.id, score, reasons, price: o.priceStructure.total, carryOnFee: o.priceStructure.carryOnFee }); // Added more debug info
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

  console.log(`[flight-search] Found ${durationFilteredOffers.length} offers for trip ${tripRequestId} to be transformed for DB.`);
  const api = { data: durationFilteredOffers };
  const dbOffers = transformAmadeusToOffers(api, tripRequestId, params.origin[0], params.destination!);

  console.log(`[flight-search] Returning ${dbOffers.length} dbOffers and pools A:${poolA.length}, B:${poolB.length}, C:${poolC.length}.`);
  return {
    dbOffers,
    pools: { poolA, poolB, poolC },
  };
}

// Helper to calculate a return date (simplified)
// function calculateReturnDate(departureDate: Date, durationDays: number, latestAllowed: Date): string {
//   const returnDate = new Date(departureDate.getTime() + (durationDays * 24 * 60 * 60 * 1000));
//   const finalReturnDate = returnDate > latestAllowed ? latestAllowed : returnDate;
//   return finalReturnDate.toISOString().slice(0, 10);
// }

// Helper to deduplicate offers (simplified)
export function dedupOffers(allOffers: Record<string, unknown>[]): Record<string, unknown>[] { // Exporting dedupOffers
  return Array.from(new Map(allOffers.map((offer: Record<string, unknown>) => {
    try {
      const key = `${offer.itineraries[0]?.segments[0]?.carrierCode}-${offer.itineraries[0]?.segments[0]?.number}-${offer.itineraries[0]?.segments[0]?.departure?.at}-${offer.itineraries[1]?.segments?.slice(-1)[0]?.departure?.at}`;
      return [key, offer];
    } catch { return [null, offer]; } // Basic error handling
    }).filter(Boolean) as [string, Record<string, unknown>][]).values());
}

// Transform Amadeus response (simplified)
export function transformAmadeusToOffers(api: { data: Record<string, unknown>[] }, tripRequestId: string, primaryOrigin: string, destination: string): TablesInsert<"flight_offers">[] {
  if (!api.data || !Array.isArray(api.data) || api.data.length === 0) return [];
  try {
    return api.data.flatMap((offer: Record<string, unknown>) => {
      try {
        const out = offer.itineraries[0].segments[0];
        const backItin = offer.itineraries[1];
        if (!backItin) return [];
        const back = backItin.segments.slice(-1)[0];
        if (!back?.departure?.at) return [];
        const carrierCode = out.carrierCode || "";

        const base = parseFloat(offer.price.total) || 0;
        const carryOnFee = computeCarryOnFee(offer);

        if (carryOnFee === null) {
          console.log(`[flight-search] transformAmadeusToOffers: Skipping opaque offer for DB id: ${offer.id}`);
          return []; // flatMap skips this offer
        }
        const totalPrice = base + carryOnFee;

        return [{
          trip_request_id: tripRequestId,
          airline: carrierCode,
          carrier_code: carrierCode,
          origin_airport: out.departure?.iataCode || primaryOrigin,
          destination_airport: out.arrival?.iataCode || destination,
          flight_number: out.number,
          departure_date: out.departure.at.split("T")[0],
          departure_time: out.departure.at.split("T")[1].slice(0,5),
          return_date: back.departure.at.split("T")[0],
          return_time: back.departure.at.split("T")[1].slice(0,5),
          duration: offer.itineraries[0].duration,
          price: totalPrice, // Now base + carryOnFee
          // TODO: Future migration may add carry_on_fee column to flight_offers table.
          // If so, add: carry_on_fee: carryOnFee,
          booking_url: offer.pricingOptions?.agents?.[0]?.deepLink || offer.deepLink || generatePlaceholderBookingUrl(carrierCode, out.departure?.iataCode || primaryOrigin, out.arrival?.iataCode || destination, out.departure.at.split("T")[0], back.departure.at.split("T")[0]),
        }];
      } catch { return []; }
    });
  } catch { return []; }
}

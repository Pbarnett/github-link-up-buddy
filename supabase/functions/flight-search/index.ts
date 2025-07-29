
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase environment variables. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  throw new Error('Edge Function: Missing Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { healthCheck, evaluateFlag, createUserContext, createOrgContext } from "../_shared/launchdarkly.ts";

// Define context interface since it's not exported
interface LDContext {
  key: string;
  kind: string;
  [key: string]: any;
}

// Import the flight API service (edge version) with explicit fetchToken
// (This will be dynamically imported only when needed in production mode)

// Type definitions
interface FlightSearchParams {
  origin: string[];
  destination: string | null;
  earliestDeparture: Date;
  latestDeparture: Date;
  minDuration: number;
  maxDuration: number;
  budget: number;
  maxConnections?: number;
}

// Utility functions moved directly into the edge function
function decideSeatPreference(
  _offer: unknown,
  _trip: { max_price: number }
): "AISLE" | "WINDOW" | "MIDDLE" | null {
  // Mark unused parameters as intentionally unused
  void _offer;
  void _trip;
  
  // TODO: Jules will fill in the actual parsing of offer.seat_map or offer.fare_details.
  return "MIDDLE"; // placeholder so our smoke test always picks "MIDDLE"
}

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

// Create a Supabase client with the service role key
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

serve(async (req: Request) => {
  // Performance timing start
  const functionStartTime = Date.now();

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Initialize LaunchDarkly context for feature flags
  const ldContext: LDContext = {
    kind: 'user', // Use 'user' since service contexts might not be supported
    key: 'flight-search-service',
    environment: Deno.env.get('ENVIRONMENT') || 'development',
    service: 'flight-search'
  };

  // Check LaunchDarkly health
  try {
    await healthCheck();
    console.log('[flight-search] LaunchDarkly health check passed');
  } catch (error) {
    console.warn('[flight-search] LaunchDarkly health check failed:', error.message);
  }

  // 🔧 LOCAL DEVELOPMENT MODE BYPASS
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  // In local Supabase, the internal URL is "http://kong:8000"
  const isLocal = supabaseUrl.includes("127.0.0.1") || supabaseUrl.includes("localhost") || supabaseUrl.includes("kong:8000");
  
  console.log(`🔧 [DEBUG] SUPABASE_URL: ${supabaseUrl}`);
  console.log(`🔧 [DEBUG] isLocal: ${isLocal}`);
  
  if (isLocal) {
    console.log('🔧 [LOCAL-DEV] Detected local development - returning mock flight search response');
    
    // Parse request to get tripRequestId
    let tripRequestId = "test-trip-id";
    if (req.method === "POST") {
      try {
        const body = await req.json();
        tripRequestId = body.tripRequestId || "test-trip-id";
      } catch {
        console.log('🔧 [LOCAL-DEV] Could not parse request body, using default tripRequestId');
      }
    }
    
    // Insert some test flight offers into the database
    try {
      // First get the trip request details to generate realistic mock data
      const { data: tripRequest, error: tripError } = await supabaseClient
        .from("trip_requests")
        .select("*")
        .eq("id", tripRequestId)
        .single();
      
      if (tripError || !tripRequest) {
        console.error('🔧 [LOCAL-DEV] Could not fetch trip request:', tripError);
        // Fall back to default mock data
      }
      
      // Clear any existing offers for this trip
      await supabaseClient
        .from("flight_offers")
        .delete()
        .eq("trip_request_id", tripRequestId);
      
      // Generate dynamic mock data based on trip request
      const originAirport = tripRequest?.departure_airports?.[0] || "JFK";
      const destinationAirport = tripRequest?.destination_location_code || "LAX";
      const earliestDep = tripRequest?.earliest_departure ? new Date(tripRequest.earliest_departure) : new Date('2024-09-15');
      const latestDep = tripRequest?.latest_departure ? new Date(tripRequest.latest_departure) : new Date('2024-09-20');
      const minDuration = tripRequest?.min_duration || 3;
      const maxDuration = tripRequest?.max_duration || 7;
      const budget = tripRequest?.budget || 1000;
      
      // Generate realistic airline codes based on route
      const airlines = [
        { name: "Test Airlines", code: "TA" },
        { name: "Budget Air", code: "BA" },
        { name: "Express Airways", code: "EA" },
        { name: "Quick Jet", code: "QJ" }
      ];
      
      console.log(`🔧 [LOCAL-DEV] Generating mock flights for ${originAirport} → ${destinationAirport}`);
      
      // Generate more realistic flight durations based on route distance
      const getRealisticFlightDuration = (origin: string, destination: string): string => {
        // Estimate flight time based on common routes (in hours)
        const routeDistances: Record<string, number> = {
          // NYC to various destinations
          'JFK-MVY': 1, 'JFK-MIA': 3, 'JFK-LAX': 6, 'JFK-ORD': 2.5, 'JFK-SFO': 6,
          'LGA-MVY': 1, 'LGA-MIA': 3, 'LGA-LAX': 6, 'LGA-ORD': 2.5, 'LGA-SFO': 6,
          'EWR-MVY': 1, 'EWR-MIA': 3, 'EWR-LAX': 6, 'EWR-ORD': 2.5, 'EWR-SFO': 6,
          // Default fallback
          'DEFAULT': 2
        };
        
        const routeKey = `${origin}-${destination}`;
        const baseHours = routeDistances[routeKey] || routeDistances['DEFAULT'];
        
        // Add some random variation (±30 minutes)
        const variation = (Math.random() - 0.5) * 1; // ±0.5 hours
        const totalHours = Math.max(0.5, baseHours + variation);
        
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);
        
        return hours > 0 ? `PT${hours}H${minutes}M` : `PT${minutes}M`;
      };
      
      // Generate 4-6 mock offers for more realistic variety
      const numOffers = 4 + Math.floor(Math.random() * 3); // 4-6 offers
      const mockOffers = [];
      
      for (let i = 0; i < numOffers; i++) {
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const depDate = new Date(earliestDep.getTime() + Math.random() * (latestDep.getTime() - earliestDep.getTime()));
        const duration = minDuration + Math.floor(Math.random() * (maxDuration - minDuration + 1));
        const retDate = new Date(depDate.getTime() + duration * 24 * 60 * 60 * 1000);
        const price = Math.floor(budget * 0.3 + Math.random() * budget * 0.7); // More price variation
        
        mockOffers.push({
          trip_request_id: tripRequestId,
          airline: airline.name,
          carrier_code: airline.code,
          origin_airport: originAirport,
          destination_airport: destinationAirport,
          flight_number: `${airline.code}${Math.floor(Math.random() * 999) + 100}`,
          departure_date: depDate.toISOString().split('T')[0],
          departure_time: `${String(Math.floor(Math.random() * 12) + 6).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          return_date: retDate.toISOString().split('T')[0],
          return_time: `${String(Math.floor(Math.random() * 12) + 12).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          duration: getRealisticFlightDuration(originAirport, destinationAirport),
          price: price,
          booking_url: `https://example.com/book/${airline.code.toLowerCase()}${Math.floor(Math.random() * 999)}`
        });
      }
      
      console.log(`🔧 [LOCAL-DEV] Generated ${numOffers} mock offers with realistic flight durations`);
      
      const { data: insertedOffers, error: insertError } = await supabaseClient
        .from("flight_offers")
        .insert(mockOffers)
        .select();
      
      if (insertError) {
        console.error('🔧 [LOCAL-DEV] Error inserting mock offers:', insertError);
      } else {
        console.log(`🔧 [LOCAL-DEV] Inserted ${insertedOffers?.length || 0} mock flight offers`);
      }
      
      // Return successful response
      return new Response(JSON.stringify({
        requestsProcessed: 1,
        matchesInserted: mockOffers.length,
        totalDurationMs: Date.now() - functionStartTime,
        relaxedCriteriaUsed: false,
        exactDestinationOnly: true,
        details: [{
          tripRequestId: tripRequestId,
          matchesFound: mockOffers.length,
          offersGenerated: mockOffers.length,
          offersInserted: mockOffers.length
        }],
        success: true,
        message: "🔧 [LOCAL-DEV] Mock flight search completed",
        pool1: [],
        pool2: [],
        pool3: []
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error('🔧 [LOCAL-DEV] Error in mock flight search:', error);
      return new Response(JSON.stringify({
        error: "Local development mock failed",
        details: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  // PRODUCTION MODE - Dynamically import flightApi.edge.ts only when needed
  console.log('🔧 [PRODUCTION] Running in production mode - attempting to load flightApi.edge.ts');
  
  try {
    // Dynamic import to avoid loading flightApi.edge.ts in local mode
    const { searchOffers, fetchToken } = await import("./flightApi.edge.ts");
    
    // Parse request body for optional tripRequestId
    let tripRequestId: string | null = null;
    let body: Record<string, unknown> = {};
    let relaxedCriteria = false;
    
    if (req.method === "POST") {
      body = await req.json() as Record<string, unknown>;
      tripRequestId = (body.tripRequestId as string) || null;
      relaxedCriteria = body.relaxedCriteria === true;

      if (relaxedCriteria) {
        console.log(`[flight-search] Invoked with RELAXED CRITERIA for ${tripRequestId}`);
      }
    }
    
    console.log(`[flight-search] Invoked${tripRequestId ? ` for ${tripRequestId}` : ' for auto-book enabled trips'}`);
    
    // Build the query based on whether tripRequestId is provided
    let requests;
    
    if (tripRequestId) {
      console.log(`[flight-search] Processing single trip request ${tripRequestId}`);
      const { data: single, error } = await supabaseClient
        .from("trip_requests")
        .select("*")
        .eq("id", tripRequestId)
        .single();
        
      if (error || !single) {
        throw new Error(`Trip request not found: ${error?.message || "No data returned"}`);
      }
      
      requests = [single];
    } else {
      console.log(`[flight-search] Processing all auto-book enabled trip requests`);
      const { data: many, error } = await supabaseClient
        .from("trip_requests")
        .select("*")
        .eq("auto_book_enabled", true);
        
      if (error) {
        throw new Error(`Failed to fetch trip requests: ${error.message}`);
      }
      
      requests = many || [];
    }
    
    console.log(`[flight-search] Got ${requests.length} request(s) to process`);
    
    let processedRequests = 0;
    let totalMatchesInserted = 0;
    const details = [];
    
    // Process each trip request
    for (const request of requests) {
      try {
        console.log(`[flight-search] Processing trip request ${request.id}`);
        processedRequests++;
        
        // Update last_checked_at timestamp
        const { error: updateError } = await supabaseClient
          .from("trip_requests")
          .update({ last_checked_at: new Date().toISOString() })
          .eq("id", request.id);

        if (updateError) {
          console.error(`[flight-search] Error updating last_checked_at for request ${request.id}: ${updateError.message}`);
          details.push({ tripRequestId: request.id, matchesFound: 0, error: `Update error: ${updateError.message}` });
          continue;
        }

        // Always delete existing flight offers for this trip to avoid stale data
        // CRITICAL: This must happen BEFORE we search for new offers
        console.log(`[flight-search] Deleting existing offers for trip ${request.id}`);
        const { error: deleteError } = await supabaseClient
          .from("flight_offers")
          .delete()
          .eq("trip_request_id", request.id);
        
        if (deleteError) {
          console.error(`[flight-search] Error deleting existing offers for request ${request.id}: ${deleteError.message}`);
          // Continue anyway - this is non-critical
        }
        
        // Validate the trip request data before proceeding
        if (!request.departure_airports || !request.departure_airports.length) {
          console.error(`[flight-search] No departure airports specified for request ${request.id}`);
          details.push({ 
            tripRequestId: request.id, 
            matchesFound: 0, 
            error: "No departure airports specified" 
          });
          continue;
        }
        
        if (!request.destination_location_code) {
          console.error(`[flight-search] No destination airport specified for request ${request.id}`);
          details.push({ 
            tripRequestId: request.id, 
            matchesFound: 0, 
            error: "No destination airport specified" 
          });
          continue;
        }
        
        // Evaluate feature flags for search behavior
        const budgetMultiplierResponse = await evaluateFlag('flight-search-budget-multiplier', ldContext, false);
        const enableBudgetMultiplier = budgetMultiplierResponse.value;
        
        const extendedConnectionsResponse = await evaluateFlag('flight-search-extended-connections', ldContext, false);
        const enableExtendedConnections = extendedConnectionsResponse.value;
        
        const relaxedDurationResponse = await evaluateFlag('flight-search-relaxed-duration', ldContext, false);
        const enableRelaxedDuration = relaxedDurationResponse.value;
        
        console.log(`[flight-search] Feature flags - Budget multiplier: ${enableBudgetMultiplier}, Extended connections: ${enableExtendedConnections}, Relaxed duration: ${enableRelaxedDuration}`);
        
        // Apply budget multiplier feature flag
        let adjustedBudget = request.budget;
        if (relaxedCriteria) {
          adjustedBudget = Math.ceil(request.budget * 1.2);
        } else if (enableBudgetMultiplier) {
          adjustedBudget = Math.ceil(request.budget * 1.1); // 10% increase with feature flag
          console.log(`[flight-search] Applied budget multiplier: ${request.budget} → ${adjustedBudget}`);
        }
        
        // Apply extended connections feature flag
        const maxConnections = enableExtendedConnections ? 3 : 2;
        
        // Apply relaxed duration feature flag
        let minDuration = request.min_duration;
        let maxDuration = request.max_duration;
        if (relaxedCriteria) {
          minDuration = 1;
          maxDuration = 30;
        } else if (enableRelaxedDuration) {
          minDuration = Math.max(1, request.min_duration - 1);
          maxDuration = request.max_duration + 2;
          console.log(`[flight-search] Applied relaxed duration: ${request.min_duration}-${request.max_duration} → ${minDuration}-${maxDuration}`);
        }
        
        // Create search params from the trip request - use ONLY the exact destination specified
        const searchParams: FlightSearchParams = {
          origin: request.departure_airports,
          destination: request.destination_location_code, // Use exact destination only, no nearby airports
          earliestDeparture: new Date(request.earliest_departure),
          latestDeparture: new Date(request.latest_departure),
          minDuration: minDuration,
          maxDuration: maxDuration,
          budget: adjustedBudget,
          maxConnections: maxConnections
        };
        
        // Log search parameters for debugging
        console.log(`[flight-search] Search params (exact destination only):`, JSON.stringify({
          origin: searchParams.origin,
          destination: searchParams.destination,
          earliestDeparture: searchParams.earliestDeparture.toISOString(),
          latestDeparture: searchParams.latestDeparture.toISOString(),
          minDuration: searchParams.minDuration,
          maxDuration: searchParams.maxDuration,
          budget: searchParams.budget,
          relaxedCriteria: relaxedCriteria,
          exactDestinationOnly: true
        }, null, 2));
        
        let token;
        try {
          // Call fetchToken function that's now properly imported
          token = await fetchToken();
          console.log(`[flight-search] Fetched OAuth token: ${token?.substring(0, 10)}...`);
        } catch (_tokenError) {
          console.error(`[flight-search] Token fetch error for ${request.id}: ${tokenError.message}`);
          details.push({ tripRequestId: request.id, matchesFound: 0, error: `Token error: ${tokenError.message}` });
          continue;
        }
        
        let offers;
        try {
          // Use the enhanced API to get flight offers with multiple search strategies
          offers = await searchOffers(searchParams, request.id);
          console.log(`[flight-search] Request ${request.id}: Found ${offers.length} transformed offers from API (exact destination only)`);
        } catch (_apiError) {
          console.error(`[flight-search] Amadeus error for ${request.id}: ${apiError.message}`);
          details.push({ tripRequestId: request.id, matchesFound: 0, error: `API error: ${apiError.message}` });
          continue;
        }

        // Filter offers to ensure they match the EXACT destination airport only
        const exactDestinationOffers = offers.filter(offer => {
          const offerDestination = offer.destination_airport;
          const requestedDestination = request.destination_location_code;
          return offerDestination === requestedDestination;
        });
        
        console.log(`[flight-search] Request ${request.id}: Filtered from ${offers.length} to ${exactDestinationOffers.length} offers matching exact destination ${request.destination_location_code}`);
        
        // Filter offers based on max_price (if specified)
        // If max_price is null, no filtering is applied (treat as "no filter")
        const priceFilteredOffers = request.max_price === null
          ? exactDestinationOffers
          : exactDestinationOffers.filter(offer => offer.price <= request.max_price);

        console.log(`[flight-search] Request ${request.id}: Generated ${exactDestinationOffers.length} exact destination offers, filtered to ${priceFilteredOffers.length} by max price`);

        // Evaluate feature flag for enhanced filtering
        const enhancedFilteringResponse = await evaluateFlag('flight-search-enhanced-filtering', ldContext, true);
        const enableEnhancedFiltering = enhancedFilteringResponse.value;
        console.log(`[flight-search] Enhanced filtering enabled: ${enableEnhancedFiltering}`);
        
        // --- Start of new filtering logic ---
        const finalFilteredOffers = [];
        for (const offer of priceFilteredOffers) {
          // Apply nonstop_required filter (only if enhanced filtering is enabled)
          if (enableEnhancedFiltering && request.nonstop_required === true && offer.nonstop_match !== true) {
            console.log(`[flight-search] Offer skipped for trip ${request.id} (price: ${offer.price}) due to nonstop mismatch. Request nonstop: ${request.nonstop_required}, Offer nonstop: ${offer.nonstop_match}`);
            continue;
          }

          // Apply baggage_included_required filter (only if enhanced filtering is enabled)
          if (enableEnhancedFiltering && request.baggage_included_required === true && offer.baggage_included !== true) {
            console.log(`[flight-search] Offer skipped for trip ${request.id} (price: ${offer.price}) due to baggage mismatch. Request baggage: ${request.baggage_included_required}, Offer baggage: ${offer.baggage_included}`);
            continue;
          }

          const seatType = decideSeatPreference(offer, request); // `request` is the trip here
          if (seatType === null) {
            console.log(`[flight-search] Offer skipped for trip ${request.id} (price: ${offer.price}) due to null seatType (max_price: ${request.max_price}).`);
            continue;
          }

          // If all checks pass, add to list for DB insertion
          finalFilteredOffers.push({
            ...offer, // Spread the original offer
            selected_seat_type: seatType,
            // Ensure baggage_included and nonstop_match are part of the offer object by now,
            // potentially defaulted if not provided by searchOffers.
            baggage_included: offer.baggage_included !== undefined ? offer.baggage_included : false,
            nonstop_match: offer.nonstop_match !== undefined ? offer.nonstop_match : false,
            trip_request_id: request.id,
            notified: false, // Default for new offers
          });
        }
        // --- End of new filtering logic ---

        console.log(`[flight-search] Request ${request.id}: ${priceFilteredOffers.length} offers after price filter, ${finalFilteredOffers.length} offers after ALL filters (seat, nonstop, baggage).`);

        if (finalFilteredOffers.length === 0) {
          details.push({
            tripRequestId: request.id,
            matchesFound: 0,
            offersGenerated: offers.length,
            exactDestinationOffers: exactDestinationOffers.length,
            offersFiltered: priceFilteredOffers.length,
            offersAfterAllFilters: 0,
            error: "No matching offers after all filters (seat, nonstop, baggage)"
          });
          continue;
        }

        // Log offers being inserted
        console.log(`[flight-search] Inserting ${finalFilteredOffers.length} offers. First offer:`,
          JSON.stringify(finalFilteredOffers[0], null, 2));

        // Save offers to the database
        const { data: savedOffers, error: offersError, count: offersCount } = await supabaseClient
          .from("flight_offers")
          .insert(finalFilteredOffers) // Use finalFilteredOffers here
          .select("id, price, departure_date, departure_time")
          .returns();

        if (offersError) {
          console.error(`[flight-search] Error saving offers for request ${request.id}: ${offersError.message}`);
          details.push({ tripRequestId: request.id, matchesFound: 0, error: `Offers error: ${offersError.message}` });
          continue;
        }
        
        console.log(`[flight-search] Inserted ${offersCount || 0} offers into flight_offers`);
        
        if (!savedOffers || savedOffers.length === 0) {
          console.log(`[flight-search] No offers were saved for request ${request.id}. This could be due to duplicates or RLS issues.`);
          details.push({ 
            tripRequestId: request.id,
            matchesFound: 0,
            offersGenerated: offers.length,
            exactDestinationOffers: exactDestinationOffers.length,
            offersFiltered: priceFilteredOffers.length,
            offersAfterAllFilters: finalFilteredOffers.length,
            offersInserted: 0,
            error: "No offers were saved to the database (after all filters)"
          });
          continue;
        }
        
        // Create flight matches for each saved offer
        const matchesToInsert = savedOffers.map(offer => ({
          trip_request_id: request.id,
          flight_offer_id: offer.id,
          price: offer.price,
          depart_at: `${offer.departure_date}T${offer.departure_time}Z`
        }));
        
        // Insert matches, avoiding duplicates with onConflict option
        let newInserts = 0;
        if (matchesToInsert.length > 0) {
          const { error: matchesError, count: matchCount } = await supabaseClient
            .from("flight_matches")
            .upsert(matchesToInsert, { 
              onConflict: ["trip_request_id", "flight_offer_id"],
              ignoreDuplicates: true 
            })
            .select("id");
          
          console.log(`[flight-search] Inserted ${matchCount || 0} flight_matches`);

          if (matchesError) {
            console.error(`[flight-search] Error saving matches for request ${request.id}: ${matchesError.message}`);
            details.push({ tripRequestId: request.id, matchesFound: 0, error: `Matches error: ${matchesError.message}` });
            continue;
          }
          
          // Count new inserts (non-duplicates)
          newInserts = matchCount || 0;
          totalMatchesInserted += newInserts;
        }
        
        // Add to details array with successful processing info
        details.push({ 
          tripRequestId: request.id, 
          matchesFound: newInserts,
          offersGenerated: offers.length,
          exactDestinationOffers: exactDestinationOffers.length,
          offersFiltered: priceFilteredOffers.length,
          offersAfterAllFilters: finalFilteredOffers.length,
          offersInsertedToDB: savedOffers.length,
          relaxedCriteria: relaxedCriteria,
          exactDestinationOnly: true
        });
        
        console.log(`[flight-search] Request ${request.id}: fetched ${offers.length} offers → ${exactDestinationOffers.length} exact destination → ${priceFilteredOffers.length} price filtered → ${finalFilteredOffers.length} after all filters → ${newInserts} new matches`);
      } catch (_requestError) {
        // Catch any errors in processing this specific trip request
        console.error(`[flight-search] Failed to process request ${request.id}: ${requestError.message}`);
        details.push({ 
          tripRequestId: request.id, 
          matchesFound: 0, 
          error: `Processing error: ${requestError.message}` 
        });
      }
    }
    
    // Calculate total duration
    const totalDurationMs = Date.now() - functionStartTime;
    
    // Return enhanced summary with performance metrics
    return new Response(
      JSON.stringify({
        requestsProcessed: processedRequests,
        matchesInserted: totalMatchesInserted,
        totalDurationMs,
        relaxedCriteriaUsed: relaxedCriteria,
        exactDestinationOnly: true,
        details
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // Top-level error handler
    console.error("[flight-search] Function error:", error);
    
    // Calculate total duration even for errors
    const totalDurationMs = Date.now() - functionStartTime;
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        requestsProcessed: 0,
        matchesInserted: 0,
        totalDurationMs,
        details: []
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Import the flight API service (edge version) with explicit fetchToken
import { searchOffers, FlightSearchParams, fetchToken } from "./flightApi.edge.ts";

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

  try {
    // Start performance tracking for the entire function
    const functionStartTime = Date.now();
    
    // Parse request body with improved error handling
    let tripRequestId: string | null = null;
    let body: any = {};
    let relaxedCriteria = false;
    let diagnosticMode = false;
    let maxSearchTimeMs = 30000; // Default 30 second timeout for searches
    let bypassFilters = false; // Special flag to bypass filtering
    
    if (req.method === "POST") {
      try {
        body = await req.json();
        tripRequestId = body.tripRequestId || null;
        relaxedCriteria = body.relaxedCriteria === true;
        diagnosticMode = body.diagnosticMode === true;
        bypassFilters = body.bypassFilters === true; // Add bypass option
        
        // Allow overriding the max search time
        if (body.maxSearchTimeMs && typeof body.maxSearchTimeMs === 'number') {
          maxSearchTimeMs = Math.min(60000, Math.max(5000, body.maxSearchTimeMs));
        }
        
        if (relaxedCriteria) {
          console.log(`[flight-search] Invoked with RELAXED CRITERIA for ${tripRequestId}`);
        }
        
        if (diagnosticMode) {
          console.log(`[flight-search] DIAGNOSTIC MODE ENABLED - extra logging will be included`);
        }
        
        if (bypassFilters) {
          console.log(`[flight-search] BYPASS FILTERS ENABLED - all validation filters will be skipped`);
        }
      } catch (parseError) {
        console.error(`[flight-search] Error parsing request body:`, parseError);
        throw new Error(`Invalid request body: ${parseError.message}`);
      }
    }
    
    console.log(`[flight-search] Invoked${tripRequestId ? ` for ${tripRequestId}` : ' for auto-book enabled trips'}`);
    console.log(`[flight-search] Search timeout set to ${maxSearchTimeMs}ms`);
    
    // Detect environment type
    const isTestEnvironment = Deno.env.get("AMADEUS_BASE_URL")?.includes("test");
    if (isTestEnvironment) {
      console.log(`[flight-search] ⚠️ USING TEST ENVIRONMENT - LIMITED RESULTS EXPECTED`);
    }
    
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
        .eq("auto_book", true)
        .order('latest_departure', { ascending: true });
        
      if (error) {
        throw new Error(`Failed to fetch trip requests: ${error.message}`);
      }
      
      requests = many || [];
    }
    
    console.log(`[flight-search] Got ${requests.length} request(s) to process`);
    
    let processedRequests = 0;
    let totalMatchesInserted = 0;
    const details = [];
    const allOffers: any[] = [];
    
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
        
        if (!request.destination_airport) {
          console.error(`[flight-search] No destination airport specified for request ${request.id}`);
          details.push({ 
            tripRequestId: request.id, 
            matchesFound: 0, 
            error: "No destination airport specified" 
          });
          continue;
        }
        
        // Create search params from the trip request
        // Validate dates before creating search params
        const rawEarliestDeparture = new Date(request.earliest_departure);
        const rawLatestDeparture = new Date(request.latest_departure);
        
        // Validate that the dates are valid JavaScript Date objects
        if (isNaN(rawEarliestDeparture.getTime()) || isNaN(rawLatestDeparture.getTime())) {
          console.error(`[flight-search] Invalid date format for request ${request.id}: earliest=${request.earliest_departure}, latest=${request.latest_departure}`);
          details.push({ 
            tripRequestId: request.id, 
            matchesFound: 0, 
            error: "Invalid date format in request" 
          });
          continue;
        }
        
        // Handle date adjustment for test environment
        let earliestDeparture = rawEarliestDeparture;
        let latestDeparture = rawLatestDeparture;
        let dateAdjusted = false;
        
        if (isTestEnvironment) {
          // Define the valid test environment date range (2025-2026)
          const testEnvMinDate = new Date('2025-01-01');
          const testEnvMaxDate = new Date('2026-12-31');
          
          // Check if dates are outside the valid test range
          if (earliestDeparture < testEnvMinDate || earliestDeparture > testEnvMaxDate || 
              latestDeparture < testEnvMinDate || latestDeparture > testEnvMaxDate) {
            
            console.log(`[flight-search] ⚠️ Adjusting dates for test environment compatibility. Original dates: earliest=${earliestDeparture.toISOString()}, latest=${latestDeparture.toISOString()}`);
            
            // Calculate the number of days between earliest and latest departure
            const daySpan = Math.floor((latestDeparture.getTime() - earliestDeparture.getTime()) / (24 * 60 * 60 * 1000));
            
            // Set earliest departure to a valid date in 2025
            earliestDeparture = new Date('2025-06-01');
            
            // Maintain the original day span, but cap it to prevent going beyond the valid range
            const maxDaySpan = Math.min(daySpan, 180); // Cap at 6 months to stay in range
            latestDeparture = new Date(earliestDeparture.getTime() + (maxDaySpan * 24 * 60 * 60 * 1000));
            
            dateAdjusted = true;
            console.log(`[flight-search] Adjusted dates for test environment: earliest=${earliestDeparture.toISOString()}, latest=${latestDeparture.toISOString()}`);
          }
        }
        
        // Create search params from the trip request (with potentially adjusted dates)
        const searchParams: FlightSearchParams = {
          origin: request.departure_airports,
          destination: request.destination_airport,
          earliestDeparture: earliestDeparture,
          latestDeparture: latestDeparture,
          minDuration: relaxedCriteria ? 1 : request.min_duration, // Relax min duration if requested
          maxDuration: relaxedCriteria ? 30 : request.max_duration, // Relax max duration if requested
          budget: relaxedCriteria ? Math.ceil(request.budget * 1.2) : request.budget, // Increase budget by 20% if relaxed
          maxConnections: 2, // reasonable default
          bypassFilters: bypassFilters // Pass through bypass flag from request
        };
        
        // Log search parameters for debugging
        console.log(`[flight-search] Search params:`, JSON.stringify({
          origin: searchParams.origin,
          destination: searchParams.destination,
          earliestDeparture: searchParams.earliestDeparture.toISOString(),
          latestDeparture: searchParams.latestDeparture.toISOString(),
          minDuration: searchParams.minDuration,
          maxDuration: searchParams.maxDuration,
          budget: searchParams.budget,
          relaxedCriteria: relaxedCriteria,
          bypassFilters: bypassFilters,
          dateAdjusted: dateAdjusted,
          isTestEnvironment: isTestEnvironment
        }, null, 2));
        
        let token;
        try {
          // Call fetchToken function that's now properly imported
          token = await fetchToken();
          console.log(`[flight-search] Fetched OAuth token: ${token?.substring(0, 10)}...`);
        } catch (tokenError) {
          console.error(`[flight-search] Token fetch error for ${request.id}: ${tokenError.message}`);
          details.push({ tripRequestId: request.id, matchesFound: 0, error: `Token error: ${tokenError.message}` });
          continue;
        }
        
        let offers;
        try {
          // Add a timeout to the search to prevent hanging
          const searchPromise = searchOffers(searchParams, request.id);
          
          // Create a race between the search and a timeout
          const timeoutPromise = new Promise<TablesInsert<"flight_offers">[]>((_, reject) => {
            setTimeout(() => reject(new Error(`Search timed out after ${maxSearchTimeMs}ms`)), maxSearchTimeMs);
          });
          
          // Use the search result, or fail if it times out
          offers = await Promise.race([searchPromise, timeoutPromise]);
          
          // The bypassFilters flag has already been passed in the searchParams object
          if (bypassFilters) {
            console.log(`[flight-search] Using bypassFilters flag for API search`);
          }
          
          // Add date adjustment info to logs
          if (dateAdjusted) {
            console.log(`[flight-search] Request ${request.id}: Using adjusted dates for test environment compatibility`);
          }
          console.log(`[flight-search] Request ${request.id}: Found ${offers.length} transformed offers from API`);
          
          // If in diagnostic mode and no offers were found, add more details
          if (diagnosticMode && offers.length === 0) {
          console.log(`[flight-search] DIAGNOSTIC: No offers found for request ${request.id} with params:`, JSON.stringify(searchParams, null, 2));
        }
      } catch (apiError) {
        console.error(`[flight-search] Amadeus error for ${request.id}: ${apiError.message}`);
        
        // Enhanced error handling for date-related errors
        let errorMessage = `API error: ${apiError.message}`;
        let suggestedAction = "";
        
        // Check for common date-related error messages
        if (apiError.message.includes("date in past") || 
            apiError.message.includes("Date is in the past") ||
            apiError.message.toLowerCase().includes("past date")) {
          errorMessage = "API Error: Departure date is in the past";
          suggestedAction = isTestEnvironment ? 
            "For test environment, use dates between 2025-2026" : 
            "Please select a future departure date";
        } else if (apiError.message.includes("too far") || 
                   apiError.message.includes("future date") || 
                   apiError.message.includes("advance booking")) {
          errorMessage = "API Error: Date is too far in the future";
          suggestedAction = isTestEnvironment ? 
            "For test environment, use dates between 2025-2026" : 
            "Please select a date within the allowed booking window";
        } else if (isTestEnvironment && (
            apiError.message.includes("date") || 
            apiError.message.includes("Date") || 
            apiError.message.includes("time"))) {
          errorMessage = "API Error: Possible date format or range issue";
          suggestedAction = "In test environment, only dates in 2025-2026 are accepted";
        }
        
        details.push({ 
          tripRequestId: request.id, 
          matchesFound: 0, 
          error: errorMessage,
          suggestedAction: suggestedAction,
          dateAdjusted: dateAdjusted,
          searchParams: diagnosticMode ? searchParams : undefined
        });
        continue;
      }
        
        // Filter offers based on max_price (if specified)
        // If max_price is null, no filtering is applied (treat as "no filter")
        const filteredOffers = request.max_price === null 
          ? offers 
          : offers.filter(offer => offer.price <= request.max_price);
        
        console.log(`[flight-search] Request ${request.id}: Generated ${offers.length} offers, filtered to ${filteredOffers.length} by max price`);
        
        if (filteredOffers.length === 0) {
          details.push({ 
            tripRequestId: request.id, 
            matchesFound: 0, 
            offersGenerated: offers.length,
            offersFiltered: 0,
            error: "No matching offers after filtering"
          });
          continue;
        }
        
        // Log offers being inserted
        console.log(`[flight-search] Inserting ${filteredOffers.length} offers. First offer:`, 
          JSON.stringify(filteredOffers[0], null, 2));
        
        // Save offers to the database
        const { data: savedOffers, error: offersError, count: offersCount } = await supabaseClient
          .from("flight_offers")
          .insert(filteredOffers)
          .select("id, price, departure_date, departure_time")
          .returns();
        
        if (offersError) {
          console.error(`[flight-search] Error saving offers for request ${request.id}: ${offersError.message}`);
          details.push({ tripRequestId: request.id, matchesFound: 0, error: `Offers error: ${offersError.message}` });
          continue;
        }
        
        console.log(`[flight-search] Inserted ${offersCount || 0} offers into flight_offers`);
        
        if (!savedOffers || savedOffers.length === 0) {
          console.log(`[flight-search] No offers were saved for request ${request.id}. This could be due to duplicates.`);
          details.push({ 
            tripRequestId: request.id,
            matchesFound: 0,
            offersGenerated: offers.length,
            offersInserted: 0,
            error: "No offers were saved to the database"
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
          const { data: insertedMatches, error: matchesError, count: matchCount } = await supabaseClient
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

        // Collect offers to return in the response
        allOffers.push(...savedOffers);
        
        // Add to details array with successful processing info
        details.push({ 
          tripRequestId: request.id, 
          matchesFound: newInserts,
          offersGenerated: offers.length,
          offersFiltered: filteredOffers.length,
          relaxedCriteria: relaxedCriteria
        });
        
        console.log(`[flight-search] Request ${request.id}: fetched ${offers.length} offers → ${newInserts} new matches`);
      } catch (requestError) {
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
    
    // Add additional diagnostic information about environment
    const environmentInfo = {
      isTestEnvironment,
      apiBase: Deno.env.get("AMADEUS_BASE_URL"),
      clientIdPrefix: Deno.env.get("AMADEUS_CLIENT_ID")?.substring(0, 3) + '***',
      validTestDateRange: isTestEnvironment ? '2025-01-01 to 2026-12-31' : 'N/A'
    };
    
    // Return enhanced summary with performance metrics
    return new Response(
      JSON.stringify({
        requestsProcessed: processedRequests,
        matchesInserted: totalMatchesInserted,
        totalDurationMs,
        relaxedCriteriaUsed: relaxedCriteria,
        diagnosticMode,
        environment: environmentInfo,
        details,
        offers: allOffers,
        pagination: {
          totalFilteredOffers: allOffers.length,
          currentPage: 0,
          pageSize: allOffers.length
        }
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-Flight-Search-Version": "2.0.0", // Add version for tracking
          "X-Search-Duration-Ms": totalDurationMs.toString()
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
        details: [],
        offers: []
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

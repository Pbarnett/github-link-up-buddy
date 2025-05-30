
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
    // Parse request body for optional tripRequestId
    let tripRequestId: string | null = null;
    let body: any = {};
    let relaxedCriteria = false;
    
    if (req.method === "POST") {
      body = await req.json();
      tripRequestId = body.tripRequestId || null;
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
        .eq("auto_book", true);
        
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
        const searchParams: FlightSearchParams = {
          origin: request.departure_airports,
          destination: request.destination_airport,
          earliestDeparture: new Date(request.earliest_departure),
          latestDeparture: new Date(request.latest_departure),
          minDuration: relaxedCriteria ? 1 : request.min_duration, // Relax min duration if requested
          maxDuration: relaxedCriteria ? 30 : request.max_duration, // Relax max duration if requested
          budget: relaxedCriteria ? Math.ceil(request.budget * 1.2) : request.budget, // Increase budget by 20% if relaxed
          maxConnections: 2 // reasonable default
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
          relaxedCriteria: relaxedCriteria
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
          // Use the enhanced API to get flight offers with multiple search strategies
          offers = await searchOffers(searchParams, request.id);
          console.log(`[flight-search] Request ${request.id}: Found ${offers.length} transformed offers from API`);
        } catch (apiError) {
          console.error(`[flight-search] Amadeus error for ${request.id}: ${apiError.message}`);
          details.push({ tripRequestId: request.id, matchesFound: 0, error: `API error: ${apiError.message}` });
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
    
    // Return enhanced summary with performance metrics
    return new Response(
      JSON.stringify({
        requestsProcessed: processedRequests,
        matchesInserted: totalMatchesInserted,
        totalDurationMs,
        relaxedCriteriaUsed: relaxedCriteria,
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

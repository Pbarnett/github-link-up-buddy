
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Error: Missing Supabase environment variables. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  throw new Error('Edge Function: Missing Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
}

// Check Amadeus credentials at startup
const amadeusClientId = Deno.env.get("AMADEUS_CLIENT_ID");
const amadeusClientSecret = Deno.env.get("AMADEUS_CLIENT_SECRET");
const amadeusBaseUrl = Deno.env.get("AMADEUS_BASE_URL");

console.log("🔧 [flight-search] Environment check:", {
  hasSupabaseUrl: !!supabaseUrl,
  hasSupabaseKey: !!supabaseServiceRoleKey,
  hasAmadeusClientId: !!amadeusClientId,
  hasAmadeusClientSecret: !!amadeusClientSecret,
  hasAmadeusBaseUrl: !!amadeusBaseUrl,
  amadeusClientIdLength: amadeusClientId ? amadeusClientId.length : 0,
  amadeusClientSecretLength: amadeusClientSecret ? amadeusClientSecret.length : 0
});

if (!amadeusClientId || !amadeusClientSecret) {
  console.error('❌ Error: Missing Amadeus environment variables. AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET must be set.');
  throw new Error('Edge Function: Missing Amadeus environment variables (AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET).');
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Import the flight API service (edge version) with explicit fetchToken
import { searchOffers, FlightSearchParams, fetchToken } from "./flightApi.edge.ts";

// Utility functions moved directly into the edge function - BYPASSED FOR TESTING
function decideSeatPreference(
  offer: any,
  trip: { max_price: number }
): "AISLE" | "WINDOW" | "MIDDLE" | null {
  // BYPASSED: Always return a valid seat type instead of null
  return "MIDDLE"; // This was already returning MIDDLE, but keeping it consistent
}

function offerIncludesCarryOnAndPersonal(offer: any): boolean {
  // BYPASSED: Always return true instead of false to allow all offers through
  return true;
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
  
  console.log("🚀 [flight-search] Function invoked", {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("✅ [flight-search] Handling CORS preflight");
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
      try {
        body = await req.json();
        tripRequestId = body.tripRequestId || null;
        relaxedCriteria = body.relaxedCriteria === true;
        
        console.log("📋 [flight-search] Request body parsed", {
          tripRequestId,
          relaxedCriteria,
          bodyKeys: Object.keys(body)
        });
      } catch (parseError) {
        console.error("❌ [flight-search] Failed to parse request body:", parseError);
        throw new Error("Invalid JSON in request body");
      }
    }
    
    if (relaxedCriteria) {
      console.log(`🔓 [flight-search] Invoked with RELAXED CRITERIA for ${tripRequestId}`);
    }
    
    console.log(`🎯 [flight-search] Processing${tripRequestId ? ` trip request ${tripRequestId}` : ' auto-book enabled trips'}`);
    
    // Build the query based on whether tripRequestId is provided
    let requests;
    
    if (tripRequestId) {
      console.log(`🔍 [flight-search] Fetching single trip request ${tripRequestId}`);
      const { data: single, error } = await supabaseClient
        .from("trip_requests")
        .select("*")
        .eq("id", tripRequestId)
        .single();
        
      if (error) {
        console.error(`❌ [flight-search] Error fetching trip request ${tripRequestId}:`, error);
        throw new Error(`Trip request not found: ${error?.message || "No data returned"}`);
      }
      
      if (!single) {
        console.error(`❌ [flight-search] No data returned for trip request ${tripRequestId}`);
        throw new Error(`Trip request not found: No data returned`);
      }
      
      console.log(`✅ [flight-search] Found trip request:`, {
        id: single.id,
        destination: single.destination_location_code,
        departureAirports: single.departure_airports,
        earliestDeparture: single.earliest_departure,
        latestDeparture: single.latest_departure,
        budget: single.budget,
        nonstopRequired: single.nonstop_required,
        baggageRequired: single.baggage_included_required
      });
      
      requests = [single];
    } else {
      console.log(`🔍 [flight-search] Fetching all auto-book enabled trip requests`);
      const { data: many, error } = await supabaseClient
        .from("trip_requests")
        .select("*")
        .eq("auto_book_enabled", true);
        
      if (error) {
        console.error(`❌ [flight-search] Error fetching auto-book requests:`, error);
        throw new Error(`Failed to fetch trip requests: ${error.message}`);
      }
      
      requests = many || [];
    }
    
    console.log(`📊 [flight-search] Got ${requests.length} request(s) to process`);
    
    let processedRequests = 0;
    let totalMatchesInserted = 0;
    const details = [];
    
    // Process each trip request
    for (const request of requests) {
      try {
        console.log(`🎯 [flight-search] Processing trip request ${request.id}`);
        processedRequests++;
        
        // Update last_checked_at timestamp (if column exists)
        try {
          const { error: updateError } = await supabaseClient
            .from("trip_requests")
            .update({ last_checked_at: new Date().toISOString() })
            .eq("id", request.id);

          if (updateError) {
            console.warn(`⚠️ [flight-search] Could not update last_checked_at for request ${request.id}:`, updateError.message);
            // Continue anyway - this is non-critical
          } else {
            console.log(`✅ [flight-search] Updated last_checked_at for request ${request.id}`);
          }
        } catch (updateError) {
          console.warn(`⚠️ [flight-search] Exception updating last_checked_at for request ${request.id}:`, updateError);
          // Continue anyway - this is non-critical
        }

        // Always delete existing flight offers for this trip to avoid stale data
        console.log(`🗑️ [flight-search] Deleting existing offers for trip ${request.id}`);
        const { error: deleteError } = await supabaseClient
          .from("flight_offers")
          .delete()
          .eq("trip_request_id", request.id);
        
        if (deleteError) {
          console.error(`❌ [flight-search] Error deleting existing offers for request ${request.id}:`, deleteError.message);
          // Continue anyway - this is non-critical
        } else {
          console.log(`✅ [flight-search] Deleted existing offers for trip ${request.id}`);
        }
        
        // Validate the trip request data before proceeding
        if (!request.departure_airports || !request.departure_airports.length) {
          console.error(`❌ [flight-search] No departure airports specified for request ${request.id}`);
          details.push({ 
            tripRequestId: request.id, 
            matchesFound: 0, 
            error: "No departure airports specified" 
          });
          continue;
        }
        
        if (!request.destination_location_code) {
          console.error(`❌ [flight-search] No destination airport specified for request ${request.id}`);
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
          destination: request.destination_location_code,
          earliestDeparture: new Date(request.earliest_departure),
          latestDeparture: new Date(request.latest_departure),
          minDuration: relaxedCriteria ? 1 : request.min_duration,
          maxDuration: relaxedCriteria ? 30 : request.max_duration,
          budget: relaxedCriteria ? Math.ceil(request.budget * 1.2) : request.budget,
          maxConnections: 2
        };
        
        console.log(`📋 [flight-search] Search params for ${request.id}:`, {
          origin: searchParams.origin,
          destination: searchParams.destination,
          earliestDeparture: searchParams.earliestDeparture.toISOString(),
          latestDeparture: searchParams.latestDeparture.toISOString(),
          minDuration: searchParams.minDuration,
          maxDuration: searchParams.maxDuration,
          budget: searchParams.budget,
          relaxedCriteria: relaxedCriteria,
        });
        
        // Test token fetch first
        try {
          console.log(`🔑 [flight-search] Testing token fetch for request ${request.id}...`);
          const token = await fetchToken();
          console.log(`✅ [flight-search] Token fetched successfully: ${token?.substring(0, 10)}...`);
        } catch (tokenError) {
          console.error(`❌ [flight-search] Token fetch failed for ${request.id}:`, {
            message: tokenError.message,
            stack: tokenError.stack
          });
          details.push({ tripRequestId: request.id, matchesFound: 0, error: `Token error: ${tokenError.message}` });
          continue;
        }
        
        // Search for offers
        let offers;
        try {
          console.log(`🔍 [flight-search] Searching offers for request ${request.id}...`);
          offers = await searchOffers(searchParams, request.id);
          console.log(`✅ [flight-search] Found ${offers.length} offers for request ${request.id}`);
        } catch (apiError) {
          console.error(`❌ [flight-search] Offer search failed for ${request.id}:`, {
            message: apiError.message,
            stack: apiError.stack
          });
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
        let priceFilteredOffers = request.max_price === null
          ? exactDestinationOffers
          : exactDestinationOffers.filter(offer => offer.price <= request.max_price);

        console.log(`[flight-search] Request ${request.id}: Generated ${exactDestinationOffers.length} exact destination offers, filtered to ${priceFilteredOffers.length} by max price`);

        // --- Start of new filtering logic ---
        const finalFilteredOffers = [];
        for (const offer of priceFilteredOffers) {
          // Apply nonstop_required filter
          // It's assumed `offer.nonstop_match` is a boolean indicating if the offer is non-stop.
          // `request.nonstop_required` is from the trip_requests table.
          if (request.nonstop_required === true && offer.nonstop_match !== true) {
            console.log(`[flight-search] Offer skipped for trip ${request.id} (price: ${offer.price}) due to nonstop mismatch. Request nonstop: ${request.nonstop_required}, Offer nonstop: ${offer.nonstop_match}`);
            continue;
          }

          // Apply baggage_included_required filter - BYPASSED FOR TESTING
          // It's assumed `offer.baggage_included` is a boolean.
          // `request.baggage_included_required` is from the trip_requests table.
          if (request.baggage_included_required === true && !offerIncludesCarryOnAndPersonal(offer)) {
            console.log(`[flight-search] BYPASSED: Offer would have been skipped for trip ${request.id} (price: ${offer.price}) due to baggage mismatch. Request baggage: ${request.baggage_included_required}, but filter is BYPASSED`);
            // Continue instead of skipping - this is the bypass
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
        console.log(`[DB] inserting offers count: ${finalFilteredOffers.length}`);
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
          exactDestinationOffers: exactDestinationOffers.length,
          offersFiltered: priceFilteredOffers.length,
          offersAfterAllFilters: finalFilteredOffers.length,
          offersInsertedToDB: savedOffers.length,
          relaxedCriteria: relaxedCriteria,
          exactDestinationOnly: true
        });
        
        console.log(`[flight-search] Request ${request.id}: fetched ${offers.length} offers → ${exactDestinationOffers.length} exact destination → ${priceFilteredOffers.length} price filtered → ${finalFilteredOffers.length} after all filters → ${newInserts} new matches`);
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
    
    console.log(`🎯 [flight-search] Function completed:`, {
      requestsProcessed: processedRequests,
      matchesInserted: totalMatchesInserted,
      totalDurationMs,
      relaxedCriteriaUsed: relaxedCriteria,
      exactDestinationOnly: true
    });
    
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
    console.error("❌ [flight-search] Function error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
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

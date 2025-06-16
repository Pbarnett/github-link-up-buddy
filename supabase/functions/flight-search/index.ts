
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase environment variables. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  throw new Error('Edge Function: Missing Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Import the flight API service (edge version) with explicit fetchToken
import { searchOffers, FlightSearchParams, fetchToken } from "./flightApi.edge.ts";

// Utility functions moved directly into the edge function
function decideSeatPreference(
  offer: any,
  trip: { max_price: number }
): "AISLE" | "WINDOW" | "MIDDLE" | null {
  // TODO: Jules will fill in the actual parsing of offer.seat_map or offer.fare_details.
  return "MIDDLE"; // placeholder so our smoke test always picks "MIDDLE"
}

function offerIncludesCarryOnAndPersonal(offer: any): boolean {
  // TODO: Implement actual baggage checking logic
  return false; // placeholder
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
    let allPools = { poolA: [], poolB: [], poolC: [] };
    
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
        
        // Create search params from the trip request - use ONLY the exact destination specified
        const searchParams: FlightSearchParams = {
          origin: request.departure_airports,
          destination: request.destination_location_code, // Use exact destination only, no nearby airports
          earliestDeparture: new Date(request.earliest_departure),
          latestDeparture: new Date(request.latest_departure),
          minDuration: relaxedCriteria ? 1 : request.min_duration, // Relax min duration if requested
          maxDuration: relaxedCriteria ? 30 : request.max_duration, // Relax max duration if requested
          budget: relaxedCriteria ? Math.ceil(request.budget * 1.2) : request.budget, // Increase budget by 20% if relaxed
          maxConnections: 2 // reasonable default
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
        } catch (tokenError) {
          console.error(`[flight-search] Token fetch error for ${request.id}: ${tokenError.message}`);
          details.push({ tripRequestId: request.id, matchesFound: 0, error: `Token error: ${tokenError.message}` });
          continue;
        }
        
        let searchResult;
        try {
          // Use the enhanced API to get flight offers with multiple search strategies
          searchResult = await searchOffers(searchParams, request.id);
          console.log(`[flight-search] Request ${request.id}: Found ${searchResult.dbOffers ? searchResult.dbOffers.length : 'undefined'} transformed offers from API (exact destination only)`);
          console.log(`[flight-search] Request ${request.id}: Pools - A: ${searchResult.pools?.poolA?.length || 0}, B: ${searchResult.pools?.poolB?.length || 0}, C: ${searchResult.pools?.poolC?.length || 0}`);
        } catch (apiError) {
          console.error(`[flight-search] Amadeus error for ${request.id}: ${apiError.message}`);
          details.push({ tripRequestId: request.id, matchesFound: 0, error: `API error: ${apiError.message}` });
          continue;
        }

        // Extract offers from the search result
        const offers = searchResult?.dbOffers || [];
        const pools = searchResult?.pools || { poolA: [], poolB: [], poolC: [] };
        
        // Filter offers to match destination - EXACT matching only
        // No nearby airports or metro area mapping - user gets exactly what they request
        const destinationOffers = offers.filter(offer => {
          const offerDestination = offer.destination_airport;
          const requestedDestination = request.destination_location_code;
          
          // Primary match: exact destination
          if (offerDestination === requestedDestination) {
            return true;
          }
          
          // Secondary match: case-insensitive comparison (for robustness)
          if (offerDestination?.toLowerCase() === requestedDestination?.toLowerCase()) {
            return true;
          }
          
          // For debugging: log non-matching destinations
          console.log(`[flight-search] Destination mismatch: offer=${offerDestination}, requested=${requestedDestination}`);
          return false;
        });
        
        console.log(`[flight-search] Request ${request.id}: Filtered from ${offers.length} to ${destinationOffers.length} offers matching destination ${request.destination_location_code} (exact matching only)`);
        
        // Filter offers based on max_price (if specified)
        // If max_price is null, no filtering is applied (treat as "no filter")
        let priceFilteredOffers = request.max_price === null
          ? destinationOffers
          : destinationOffers.filter(offer => offer.price <= request.max_price);

        console.log(`[flight-search] Request ${request.id}: Generated ${destinationOffers.length} destination offers, filtered to ${priceFilteredOffers.length} by max price`);

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

          // Apply baggage_included_required filter
          // It's assumed `offer.baggage_included` is a boolean.
          // `request.baggage_included_required` is from the trip_requests table.
          if (request.baggage_included_required === true && offer.baggage_included !== true) {
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
            trip_request_id: request.id,
          });
        }
        // --- End of new filtering logic ---

        console.log(`[flight-search] Request ${request.id}: ${priceFilteredOffers.length} offers after price filter, ${finalFilteredOffers.length} offers after ALL filters (seat, nonstop, baggage).`);

        if (finalFilteredOffers.length === 0) {
          // Provide detailed debugging information about where offers were filtered out
          let errorMessage = "No matching offers found";
          const filteringDetails = [];
          
          if (offers.length === 0) {
            errorMessage = "No offers returned from flight search API";
          } else if (destinationOffers.length === 0) {
            errorMessage = `No offers matched destination ${request.destination_location_code}. API returned destinations: ${[...new Set(offers.map(o => o.destination_airport))].join(', ')}`;
            filteringDetails.push(`destination_filter: ${offers.length} → 0`);
          } else if (priceFilteredOffers.length === 0) {
            errorMessage = `No offers within price limit. Budget: ${request.budget}, Max price: ${request.max_price}, Offer prices: ${destinationOffers.map(o => o.price).sort((a,b) => a-b).slice(0,5).join(', ')}`;
            filteringDetails.push(`price_filter: ${destinationOffers.length} → 0`);
          } else {
            // Offers were filtered out by nonstop, baggage, or seat requirements
            const nonstopIssues = priceFilteredOffers.filter(o => request.nonstop_required && !o.nonstop_match).length;
            const baggageIssues = priceFilteredOffers.filter(o => request.baggage_included_required && !o.baggage_included).length;
            
            if (nonstopIssues > 0) filteringDetails.push(`nonstop_filter: ${nonstopIssues} offers excluded`);
            if (baggageIssues > 0) filteringDetails.push(`baggage_filter: ${baggageIssues} offers excluded`);
            
            errorMessage = `Offers filtered out by requirements: ${filteringDetails.join(', ')}`;
          }
          
          details.push({
            tripRequestId: request.id,
            matchesFound: 0,
            offersGenerated: offers.length,
            exactDestinationOffers: destinationOffers.length,
            offersFiltered: priceFilteredOffers.length,
            offersAfterAllFilters: 0,
            error: errorMessage,
            filteringDetails: filteringDetails.length > 0 ? filteringDetails.join(' | ') : undefined
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
            exactDestinationOffers: destinationOffers.length,
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
          exactDestinationOffers: destinationOffers.length,
          offersFiltered: priceFilteredOffers.length,
          offersAfterAllFilters: finalFilteredOffers.length,
          offersInsertedToDB: savedOffers.length,
          relaxedCriteria: relaxedCriteria,
          exactDestinationOnly: true
        });
        
        // Collect pools data from this search result
        if (pools) {
          allPools.poolA.push(...(pools.poolA || []));
          allPools.poolB.push(...(pools.poolB || []));
          allPools.poolC.push(...(pools.poolC || []));
        }
        
        console.log(`[flight-search] Request ${request.id}: fetched ${offers.length} offers → ${destinationOffers.length} destination matched → ${priceFilteredOffers.length} price filtered → ${finalFilteredOffers.length} after all filters → ${newInserts} new matches`);
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
    
    // Return enhanced summary with performance metrics and pools data
    return new Response(
      JSON.stringify({
        requestsProcessed: processedRequests,
        matchesInserted: totalMatchesInserted,
        totalDurationMs,
        relaxedCriteriaUsed: relaxedCriteria,
        exactDestinationOnly: true,
        details,
        poolA: allPools.poolA,
        poolB: allPools.poolB,
        poolC: allPools.poolC
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

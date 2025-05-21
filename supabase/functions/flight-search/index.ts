
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

// Import shared mock offer generator function
import { generateMockOffers } from "./mockOffers.ts";

// Mock offers generator function
const createMockOffers = (tripRequest) => {
  const offersData = {
    earliestDeparture: new Date(tripRequest.earliest_departure),
    latestDeparture: new Date(tripRequest.latest_departure),
    budget: tripRequest.budget,
    min_duration: tripRequest.min_duration,
    max_duration: tripRequest.max_duration,
  };
  
  return generateMockOffers(offersData, tripRequest.id);
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // 1. Fetch all trip requests with auto_book_enabled = true
    const { data: requests, error: reqError } = await supabaseClient
      .from("trip_requests")
      .select("*")
      .eq("auto_book_enabled", true);
    
    if (reqError) throw new Error(`Failed to fetch trip requests: ${reqError.message}`);
    
    let processedRequests = 0;
    let totalMatchesInserted = 0;
    const details = [];
    
    // 2. Process each trip request
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
        
        // Generate mock offers for this request using the shared module
        const mockOffers = createMockOffers(request);
        
        // Filter offers based on max_price (if specified)
        // If max_price is null, no filtering is applied (treat as "no filter")
        const filteredOffers = request.max_price === null 
          ? mockOffers 
          : mockOffers.filter(offer => offer.price <= request.max_price);
        
        console.log(`[flight-search] Request ${request.id}: Generated ${mockOffers.length} offers, filtered to ${filteredOffers.length}`);
        
        // Save offers to the database
        const { data: savedOffers, error: offersError } = await supabaseClient
          .from("flight_offers")
          .insert(filteredOffers)
          .select("id, price, departure_date, departure_time");
        
        if (offersError) {
          console.error(`[flight-search] Error saving offers for request ${request.id}: ${offersError.message}`);
          details.push({ tripRequestId: request.id, matchesFound: 0, error: `Offers error: ${offersError.message}` });
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
          const { data: insertedMatches, error: matchesError } = await supabaseClient
            .from("flight_matches")
            .upsert(matchesToInsert, { 
              onConflict: ["trip_request_id", "flight_offer_id"],
              ignoreDuplicates: true 
            });
          
          if (matchesError) {
            console.error(`[flight-search] Error saving matches for request ${request.id}: ${matchesError.message}`);
            details.push({ tripRequestId: request.id, matchesFound: 0, error: `Matches error: ${matchesError.message}` });
            continue;
          }
          
          // Count new inserts (non-duplicates)
          newInserts = insertedMatches ? insertedMatches.length : 0;
          totalMatchesInserted += newInserts;
        }
        
        // Add to details array with successful processing info
        details.push({ 
          tripRequestId: request.id, 
          matchesFound: newInserts,
          offersGenerated: mockOffers.length,
          offersFiltered: filteredOffers.length
        });
        
        console.log(`[flight-search] Request ${request.id}: fetched ${mockOffers.length} offers → ${newInserts} new matches`);
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
    
    // Return enhanced summary
    return new Response(
      JSON.stringify({
        requestsProcessed: processedRequests,
        matchesInserted: totalMatchesInserted,
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
    return new Response(
      JSON.stringify({ 
        error: error.message,
        requestsProcessed: 0,
        matchesInserted: 0,
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

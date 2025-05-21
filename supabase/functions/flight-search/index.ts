
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generateMockOffers } from "./mockOffers.ts";

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
    let totalOffersFetched = 0;
    let newMatchesInserted = 0;
    
    // 2. Process each trip request
    for (const request of requests) {
      processedRequests++;
      
      // Update last_checked_at timestamp
      const { error: updateError } = await supabaseClient
        .from("trip_requests")
        .update({ last_checked_at: new Date().toISOString() })
        .eq("id", request.id);
      
      if (updateError) {
        console.error(`[flight-search] Error updating last_checked_at for request ${request.id}: ${updateError.message}`);
        continue;
      }
      
      // Generate mock offers for this request
      const mockOffers = createMockOffers(request);
      totalOffersFetched += mockOffers.length;
      
      // Filter offers based on max_price (if specified)
      const filteredOffers = request.max_price === null 
        ? mockOffers 
        : mockOffers.filter(offer => offer.price <= request.max_price);
      
      // Save offers to the database
      const { data: savedOffers, error: offersError } = await supabaseClient
        .from("flight_offers")
        .insert(filteredOffers)
        .select("id, price, departure_date, departure_time");
      
      if (offersError) {
        console.error(`[flight-search] Error saving offers for request ${request.id}: ${offersError.message}`);
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
        } else {
          // Count new inserts (non-duplicates)
          newInserts = insertedMatches ? insertedMatches.length : 0;
          newMatchesInserted += newInserts;
        }
      }
      
      console.log(`[flight-search] Request ${request.id}: fetched ${mockOffers.length} offers → ${newInserts} new matches`);
    }
    
    // Return summary
    return new Response(
      JSON.stringify({
        processedRequests,
        totalOffersFetched,
        newMatchesInserted
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
    console.error("flight-search error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Define a simple Offer interface based on typical flight search results
interface Offer {
  id: string; // Usually the offer ID from the flight API
  price: number;
  flight_number?: string; // Or flightNumber, adjust as per actual flight-search output
  airline?: string;
  // Add other relevant fields that might be part of an offer and useful for notifications
  departure_time?: string;
  arrival_time?: string;
  // Ensure it matches the structure from flight-search
}

// Define the structure of a TripRequest object we expect from the database
interface TripRequest {
  id: number;
  user_id: string;
  best_price: number | null;
  budget: number | null;
  auto_book: boolean; // Included for completeness, though filtered in query
  // Filter criteria for flight-search, ensure these match your table columns
  origin_location_code: string;
  destination_location_code: string;
  departure_date: string;
  return_date: string | null;
  adults: number;
  // Potentially other filter fields like:
  // children: number;
  // infants: number;
  // travel_class: string;
  // non_stop: boolean;
  // currency: string; // If flight-search needs it
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS", // Schedulers typically POST
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let supabaseClient: SupabaseClient;
  try {
    supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        global: {
          headers: { Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` },
        },
      }
    );
  } catch (e) {
    console.error("Critical: Failed to initialize Supabase client:", e);
    return new Response(JSON.stringify({ error: "Failed to initialize Supabase client", details: e.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  let tripsProcessed = 0;
  let notificationsCreated = 0;

  try {
    // 1. Fetch all trip_requests where auto_book is true
    // Ensure all necessary fields for flight-search are selected.
    const { data: tripRequestsData, error: fetchError } = await supabaseClient
      .from("trip_requests")
      .select("id, user_id, best_price, budget, auto_book, origin_location_code, destination_location_code, departure_date, return_date, adults")
      .eq("auto_book", true);

    if (fetchError) {
      console.error("Error fetching trip requests:", fetchError);
      return new Response(JSON.stringify({ error: "Failed to fetch trip requests", details: fetchError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    const tripRequests = tripRequestsData as TripRequest[];

    if (!tripRequests || tripRequests.length === 0) {
      console.log("No trip requests with auto_book=true found.");
      return new Response(JSON.stringify({ notified: 0, tripsProcessed: 0, message: "No trip requests to process" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    // 2. Iterate through each fetched trip_request
    for (const trip of tripRequests) {
      tripsProcessed++;
      // Determine the current reference price for comparison.
      // Use trip.best_price if available, otherwise trip.budget. If neither, effectively Infinity.
      let currentBestPriceForRun = trip.best_price ?? trip.budget ?? Infinity;

      try {
        // 3. Invoke the existing flight-search Supabase function
        // Ensure the payload matches exactly what 'flight-search' expects.
        const flightSearchPayload = {
          tripRequestId: trip.id,
          originLocationCode: trip.origin_location_code,
          destinationLocationCode: trip.destination_location_code,
          departureDate: trip.departure_date,
          returnDate: trip.return_date, // flight-search should handle if null
          adults: trip.adults,
          // Add any other parameters flight-search requires, e.g., currency: trip.currency
        };
        
        console.log(`[TripID: ${trip.id}] Invoking flight-search with payload:`, flightSearchPayload);

        // Assuming flight-search returns { offers: Offer[] } directly in its data property
        // or { data: { offers: Offer[] } } if nested. Adjust based on actual flight-search structure.
        const { data: flightSearchResult, error: searchError } = await supabaseClient.functions.invoke<{ offers?: Offer[] }>(
          "flight-search",
          { body: flightSearchPayload }
        );

        if (searchError) {
          console.error(`[TripID: ${trip.id}] Error invoking flight-search:`, searchError);
          continue; // Skip to the next trip
        }

        const offers = flightSearchResult?.offers; // Access offers, potentially flightSearchResult.data.offers
        if (!offers || offers.length === 0) {
          console.log(`[TripID: ${trip.id}] No offers returned by flight-search.`);
          continue;
        }
        
        console.log(`[TripID: ${trip.id}] Received ${offers.length} offers.`);

        // 4. Iterate through the offers
        for (const offer of offers) {
          if (typeof offer.price !== 'number' || isNaN(offer.price)) {
            console.warn(`[TripID: ${trip.id}] Invalid price for offer ${offer.id}:`, offer.price);
            continue; 
          }

          if (offer.price < currentBestPriceForRun) {
            console.log(`[TripID: ${trip.id}] Cheaper offer found: New price ${offer.price} < Current best ${currentBestPriceForRun}`);
            
            const flightIdentifier = offer.flight_number || (offer.airline ? `${offer.airline} flight` : 'selected flight');
            const notificationMessage = `New lower price found: $${offer.price.toFixed(2)} for ${flightIdentifier}.`;
            
            const { error: notificationError } = await supabaseClient
              .from("notifications")
              .insert({
                user_id: trip.user_id,
                trip_request_id: trip.id,
                type: "price_drop", // Consistent type
                message: notificationMessage,
                data: { 
                  offerId: offer.id, 
                  newPrice: offer.price, 
                  oldPrice: currentBestPriceForRun, // Store old price for context
                  airline: offer.airline,
                  flightNumber: offer.flight_number
                },
                read: false, // Default, but explicit
              });

            if (notificationError) {
              console.error(`[TripID: ${trip.id}] Error inserting notification:`, notificationError);
              // Do not increment notificationsCreated, continue to next offer.
            } else {
              notificationsCreated++;
              console.log(`[TripID: ${trip.id}] Notification created for offer ${offer.id}.`);
            }

            // Update trip_requests.best_price for the current trip.id
            const { error: updateError } = await supabaseClient
              .from("trip_requests")
              .update({ best_price: offer.price, updated_at: new Date().toISOString() })
              .eq("id", trip.id);

            if (updateError) {
              console.error(`[TripID: ${trip.id}] Error updating best_price:`, updateError);
              // If DB update fails, currentBestPriceForRun for *this run* might not reflect the latest offer.
              // To be safe, we only update currentBestPriceForRun if the DB update was successful.
              // This ensures we don't send multiple notifications for the same price drop if DB fails temporarily.
            } else {
              currentBestPriceForRun = offer.price; // Update reference price for subsequent offers *in this run*
              console.log(`[TripID: ${trip.id}] Successfully updated best_price to ${offer.price}.`);
            }
          }
        }
      } catch (innerError) {
        console.error(`[TripID: ${trip.id}] Unexpected error processing trip:`, innerError);
        // Log and continue to the next trip
      }
    }

    // 5. Return a summary response
    console.log(`Scheduler finished. Trips processed: ${tripsProcessed}, Notifications created: ${notificationsCreated}`);
    return new Response(JSON.stringify({ notified: notificationsCreated, tripsProcessed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (e) {
    console.error("Critical: Unhandled error in scheduler-flight-search main try block:", e);
    return new Response(JSON.stringify({ error: "An unexpected server error occurred", details: e.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

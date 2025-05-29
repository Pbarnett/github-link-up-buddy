import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Define a simple Offer interface based on typical flight search results
interface Offer {
  id: string; // Usually the offer ID from the flight API
  price: number;
  flight_number?: string; // Or flightNumber, adjust as per actual flight-search output
  airline?: string;
  departure_time?: string;
  arrival_time?: string;
  departure_date?: string; // Ensure flight-search provides this if needed for booking
  return_date?: string | null;   // Ensure flight-search provides this if needed for booking
  duration?: string;         // Total flight duration
  // Any other fields returned by flight-search that are relevant for the bookings table or notifications
  // For example:
  // segments?: any[]; // Detailed flight segments
  // cabin_class?: string;
  // baggage_allowance?: string;
  // Ensure it matches the structure from flight-search
}

// Define the structure of a TripRequest object we expect from the database
interface TripRequest {
  id: string; // Changed to string for UUID
  user_id: string; // Assuming this is UUID, already string
  best_price: number | null;
  budget: number | null;
  auto_book: boolean;
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
  let autoBookingsCreated = 0;

  try {
    // 1. Fetch all trip_requests where auto_book is true
    // Ensure all necessary fields for flight-search and booking are selected.
    const { data: tripRequestsData, error: fetchError } = await supabaseClient
      .from("trip_requests")
      .select("id, user_id, best_price, budget, auto_book, origin_location_code, destination_location_code, departure_date, return_date, adults") // Ensure all needed fields are here
      .eq("auto_book", true); // We are focusing on auto_book trips as per plan

    if (fetchError) {
      console.error("Error fetching trip requests:", fetchError);
      return new Response(JSON.stringify({ error: "Failed to fetch trip requests", details: fetchError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    const tripRequests = tripRequestsData as TripRequest[];

    if (!tripRequests || tripRequests.length === 0) {
      console.log("No trip requests with auto_book=true found to process.");
      return new Response(JSON.stringify({ notified: 0, tripsProcessed: 0, autoBookingsCreated: 0, message: "No trip requests to process" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    // 2. Iterate through each fetched trip_request
    for (const trip of tripRequests) {
      tripsProcessed++;
      let autoBookedThisRun = false; // Flag to track if auto-booking was successful for this trip
      console.log(`[TripID: ${trip.id}] Processing trip. Auto-book enabled: ${trip.auto_book}`);

      // 4. Safeguard - Check Existing Bookings
      try {
        const { data: existingBookings, error: bookingCheckError } = await supabaseClient
          .from('bookings')
          .select('id')
          .eq('trip_request_id', trip.id)
          .eq('status', 'booked') // Assuming 'booked' is the final success status
          .limit(1);

        if (bookingCheckError) {
          console.error(`[TripID: ${trip.id}] Error checking for existing bookings:`, bookingCheckError.message);
          continue; // Skip to next trip
        }

        if (existingBookings && existingBookings.length > 0) {
          console.log(`[TripID: ${trip.id}] An active booking already exists. Skipping flight search and auto-booking.`);
          continue; // Skip to next trip
        }
      } catch (e) {
        console.error(`[TripID: ${trip.id}] Exception while checking existing bookings:`, e.message);
        continue; // Skip to next trip
      }

      let currentBestPriceForRun = trip.best_price ?? Infinity; // Used for price drop notifications if auto-book fails or isn't applicable

      try {
        // 3. Invoke the existing flight-search Supabase function
        const flightSearchPayload = {
          tripRequestId: trip.id, // Pass trip.id as tripRequestId
          originLocationCode: trip.origin_location_code,
          destinationLocationCode: trip.destination_location_code,
          departureDate: trip.departure_date,
          returnDate: trip.return_date,
          adults: trip.adults,
          // currency: trip.currency, // If your flight-search supports/requires it
        };
        
        console.log(`[TripID: ${trip.id}] Invoking flight-search with payload:`, flightSearchPayload);
        const { data: flightSearchResult, error: searchError } = await supabaseClient.functions.invoke<{ offers?: Offer[] }>(
          "flight-search",
          { body: flightSearchPayload }
        );

        if (searchError) {
          console.error(`[TripID: ${trip.id}] Error invoking flight-search:`, searchError.message);
          continue; 
        }

        const offers = flightSearchResult?.offers;
        if (!offers || offers.length === 0) {
          console.log(`[TripID: ${trip.id}] No offers returned by flight-search.`);
          continue;
        }
        console.log(`[TripID: ${trip.id}] Received ${offers.length} offers.`);

        // Auto-booking logic starts here
        if (trip.auto_book) {
          let bestOfferForAutoBook: Offer | null = null;
          let priceToBeatForAutoBook = trip.budget ?? trip.best_price ?? Infinity;

          for (const offer of offers) {
            if (typeof offer.price !== 'number' || isNaN(offer.price)) {
              console.warn(`[TripID: ${trip.id}] Invalid price for offer ${offer.id}, skipping.`);
              continue;
            }

            // Condition for auto-booking:
            // 1. Price is within budget (if budget is set)
            // 2. OR Price is better than current best_price (if budget is not set or if price is also better than best_price)
            const isWithinBudget = trip.budget !== null && offer.price <= trip.budget;
            const isBetterThanBestPrice = trip.best_price === null || offer.price < trip.best_price;

            if (isWithinBudget || (trip.budget === null && isBetterThanBestPrice)) {
              if (!bestOfferForAutoBook || offer.price < bestOfferForAutoBook.price) {
                bestOfferForAutoBook = offer;
                // If a budget is set, we prefer the cheapest that is AT OR BELOW budget.
                // If no budget, we prefer the cheapest that is below best_price.
                // This logic picks the absolute cheapest offer that meets *either* condition.
              }
            }
          }

          if (bestOfferForAutoBook) {
            console.log(`[TripID: ${trip.id}] Suitable offer for auto-booking found: ID ${bestOfferForAutoBook.id}, Price ${bestOfferForAutoBook.price}`);
            
            // 7. Create booking_requests entry
            const { data: newBookingRequest, error: createBookingRequestError } = await supabaseClient
              .from('booking_requests')
              .insert({
                user_id: trip.user_id,
                offer_id: bestOfferForAutoBook.id, 
                offer_data: bestOfferForAutoBook, 
                trip_request_id: trip.id, // trip.id is now string (UUID)
                auto: true,
                status: 'processing', 
              })
              .select('id') // booking_requests.id is UUID, so newBookingRequest.id will be string
              .single();

            if (createBookingRequestError) {
              console.error(`[TripID: ${trip.id}] Error creating booking_requests entry:`, createBookingRequestError.message);
            } else if (newBookingRequest && newBookingRequest.id) { // Ensure newBookingRequest.id is truthy
              console.log(`[TripID: ${trip.id}] Booking request ${newBookingRequest.id} (UUID) created. Attempting RPC call.`);
              
              // 8. Call rpc_auto_book_match
              // p_booking_request_id now expects a UUID (string)
              const { error: rpcError, data: rpcData } = await supabaseClient.rpc(
                'rpc_auto_book_match',
                { p_booking_request_id: newBookingRequest.id as string } // newBookingRequest.id is already string if PK is UUID
              );

              // 9. Handle RPC Response
              if (rpcError) {
                console.error(`[TripID: ${trip.id}] RPC rpc_auto_book_match failed for booking_request ${newBookingRequest.id}:`, rpcError.message);
                // booking_requests.id is UUID (string) for .eq filter
                await supabaseClient
                  .from('booking_requests')
                  .update({ status: 'failed', error_message: rpcError.message, updated_at: new Date().toISOString() })
                  .eq('id', newBookingRequest.id as string);
              } else {
                // Assuming RPC success means booking was made (or attempted and status updated by RPC)
                // The RPC is expected to create the 'bookings' record and a notification.
                console.log(`[TripID: ${trip.id}] RPC rpc_auto_book_match successful for booking_request ${newBookingRequest.id}. rpcData:`, rpcData);
                autoBookingsCreated++;
                autoBookedThisRun = true; // Set flag to skip price drop notification

                // Update trip_request.best_price if this auto-booked price is better
                if (trip.best_price === null || bestOfferForAutoBook.price < trip.best_price) {
                  const { error: updateTripError } = await supabaseClient
                    .from("trip_requests")
                    // trip.id is string (UUID) for .eq filter
                    .update({ best_price: bestOfferForAutoBook.price, updated_at: new Date().toISOString() })
                    .eq("id", trip.id); 
                  if (updateTripError) {
                    console.error(`[TripID: ${trip.id}] Error updating best_price after auto-book:`, updateTripError.message);
                  } else {
                    console.log(`[TripID: ${trip.id}] Successfully updated best_price to ${bestOfferForAutoBook.price} after auto-book.`);
                    currentBestPriceForRun = bestOfferForAutoBook.price; // Update for this run
                  }
                }
                // IMPORTANT: If auto-booking was successful, we break from the offer loop for this trip.
                // And we will skip the price drop notification logic below due to autoBookedThisRun = true.
                // This break assumes we only auto-book ONE offer per run for a given trip.
                // If multiple offers could be auto-booked (e.g. different segments of a trip), this logic would need adjustment.
                // For now, one auto-book per trip request per scheduler run is the assumption.
                // Effectively, flight-search should have returned only one offer if it's a one-way/return package.
                // Or if it returns multiple, we picked the 'bestOfferForAutoBook'.
                // So, we can break from iterating more offers for this trip.
                // This means the 'for (const offer of offers)' loop will terminate for this trip.
                // The code will then proceed to the next trip or finish if this was the last one.
                 break; // Exit the 'for (const offer of offers)' loop as we've successfully auto-booked.
              }
            }
          } else {
             console.log(`[TripID: ${trip.id}] No offers met the auto-booking criteria (budget/best_price).`);
          }
        } // End of if (trip.auto_book)

        // Price Drop Notification Logic (only if not auto-booked in this run)
        // This part runs if trip.auto_book was false, or if it was true but auto-booking failed or no suitable offer was found.
        if (!autoBookedThisRun) {
          console.log(`[TripID: ${trip.id}] Proceeding to check for price drop notifications (auto-book not performed or failed). Current best price for run: ${currentBestPriceForRun}`);
          for (const offer of offers) {
            if (typeof offer.price !== 'number' || isNaN(offer.price)) {
              console.warn(`[TripID: ${trip.id}] Invalid price for offer ${offer.id} during price drop check. Skipping.`);
              continue; 
            }

            if (offer.price < currentBestPriceForRun) {
              console.log(`[TripID: ${trip.id}] Cheaper offer found for notification: New price ${offer.price} < Current best ${currentBestPriceForRun}`);
              
              const flightIdentifier = offer.flight_number || (offer.airline ? `${offer.airline} flight` : 'selected flight');
              const notificationMessage = `New lower price found: $${offer.price.toFixed(2)} for ${flightIdentifier}.`;
              
              const { error: notificationError } = await supabaseClient
                .from("notifications")
                .insert({
                  user_id: trip.user_id,
                  trip_request_id: trip.id,
                  type: "price_drop",
                  message: notificationMessage,
                  data: { 
                    offerId: offer.id, 
                    newPrice: offer.price, 
                    oldPrice: currentBestPriceForRun,
                    airline: offer.airline,
                    flightNumber: offer.flight_number,
                    // Include other offer details useful for the notification
                    departure_time: offer.departure_time,
                    arrival_time: offer.arrival_time,
                  },
                  read: false,
                });

              if (notificationError) {
                console.error(`[TripID: ${trip.id}] Error inserting price drop notification:`, notificationError.message);
              } else {
                notificationsCreated++;
                console.log(`[TripID: ${trip.id}] Price drop notification created for offer ${offer.id}.`);
                
                // Update trip_requests.best_price for the current trip.id
                // This is crucial so we don't notify again for the same price unless it drops further
                const { error: updateError } = await supabaseClient
                  .from("trip_requests")
                  // trip.id is string (UUID) for .eq filter
                  .update({ best_price: offer.price, updated_at: new Date().toISOString() })
                  .eq("id", trip.id);

                if (updateError) {
                  console.error(`[TripID: ${trip.id}] Error updating best_price after notification:`, updateError.message);
                } else {
                  currentBestPriceForRun = offer.price; // Update reference price for subsequent offers in this run
                  console.log(`[TripID: ${trip.id}] Successfully updated best_price to ${offer.price} after notification.`);
                }
              }
            }
          }
        } else {
           console.log(`[TripID: ${trip.id}] Auto-booking was successful. Skipping price drop notification logic.`);
        }

      } catch (innerError) {
        console.error(`[TripID: ${trip.id}] Unexpected error processing trip:`, innerError.message, innerError.stack);
      }
    } // End of for (const trip of tripRequests)

    // 5. Return a summary response
    const responseBody = { 
      notified: notificationsCreated, 
      tripsProcessed, 
      autoBookingsCreated,
      message: `Scheduler finished. Trips processed: ${tripsProcessed}, Notifications created: ${notificationsCreated}, Auto-bookings created: ${autoBookingsCreated}`
    };
    console.log(responseBody.message);
    return new Response(JSON.stringify(responseBody), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (e) {
    console.error("Critical: Unhandled error in scheduler-flight-search main try block:", e.message, e.stack);
    return new Response(JSON.stringify({ error: "An unexpected server error occurred", details: e.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

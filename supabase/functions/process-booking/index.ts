const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase environment variables. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  throw new Error('Edge Function: Missing Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
}


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0"; // Import Stripe
import { bookWithAmadeus } from "../lib/amadeus.ts"; // This is a helper function
import { amadeus } from "../lib/amadeus.ts"; // Assuming this exports the initialized Amadeus SDK instance
import { USE_MANUAL_CAPTURE } from "../lib/config.ts"; // Import feature flag

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") as string,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function processBookingRequest(bookingRequest: Record<string, unknown>) {
  console.log(`[PROCESS-BOOKING] Processing booking request ${bookingRequest.id}, Attempts: ${(bookingRequest.attempts as number) || 0}`);
  let amadeusOrderId: string | null = null; // To store Amadeus Order ID for potential rollback
  let newBookingRecordId: string | null = null; // To store ID of the record in 'bookings' table

  try {
    await supabase
      .from("booking_requests")
      .update({ status: "processing", processed_at: new Date().toISOString() })
      .eq("id", bookingRequest.id as string);

    console.log("[PROCESS-BOOKING] Calling Amadeus booking with offer data for BR ID:", bookingRequest.id);
    const travelerData = bookingRequest.traveler_data || {
      firstName: "PlaceholderFirstName", lastName: "PlaceholderLastName", email: "placeholder@example.com"
    };
    const amadeusResult = await bookWithAmadeus(bookingRequest.offer_data, travelerData);

    if (!amadeusResult.success) {
      throw new Error(amadeusResult.error || "Amadeus booking failed");
    }

    console.log(`[PROCESS-BOOKING] Amadeus booking successful for BR ID: ${bookingRequest.id}. Order ID: ${amadeusResult.bookingReference}`);
    amadeusOrderId = amadeusResult.bookingReference; // Store for potential rollback
    const airlinePnr = amadeusResult.confirmationNumber;

    // Create initial booking record in 'bookings' table
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: bookingRequest.user_id,
        trip_request_id: bookingRequest.offer_data.trip_request_id || null,
        flight_offer_id: bookingRequest.offer_id,
        pnr: airlinePnr || amadeusOrderId, // Store initial PNR
        amadeus_order_id: amadeusOrderId,
        status: "booked_pending_payment", // Initial status before payment capture
        price: bookingRequest.offer_data.price, // Store offer price
        currency: bookingRequest.offer_data.currency || 'usd',
      })
      .select("id") // Select the ID of the newly created booking record
      .single();

    if (bookingError) throw bookingError;
    newBookingRecordId = booking.id; // Store for updates
    console.log(`[PROCESS-BOOKING] Initial record created in 'bookings' table with ID: ${newBookingRecordId} for BR ID: ${bookingRequest.id}`);

    // --- Conditional Stripe Payment Capture ---
    if (USE_MANUAL_CAPTURE && bookingRequest.payment_intent_id) {
      console.log(`[ProcessBooking] Manual capture flow for PI: ${bookingRequest.payment_intent_id}, Amadeus Order: ${amadeusOrderId}, BR ID: ${bookingRequest.id}`);
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2023-10-16" });
      try {
        const captured = await stripe.paymentIntents.capture(bookingRequest.payment_intent_id, {
          idempotencyKey: `${bookingRequest.payment_intent_id}-capture-${bookingRequest.attempts || 0}`
        });

        if (captured.status !== 'succeeded') {
          console.error(`[ProcessBooking] Stripe capture failed for PI ${bookingRequest.payment_intent_id}. Status: ${captured.status}. BR ID: ${bookingRequest.id}`);
          throw new Error(`Stripe PaymentIntent capture failed. Status: ${captured.status}`);
        }

        console.log(`[ProcessBooking] Stripe PI ${bookingRequest.payment_intent_id} captured successfully for BR ID: ${bookingRequest.id}.`);
        await supabase.from("bookings")
          .update({ status: "ticketed", updated_at: new Date().toISOString() })
          .eq("id", newBookingRecordId);
        console.log(`[ProcessBooking] Booking ID ${newBookingRecordId} status updated to 'ticketed' after Stripe capture for BR ID: ${bookingRequest.id}.`);

      } catch (_captureError) {
        console.error(`[ProcessBooking] Error during Stripe capture for PI ${bookingRequest.payment_intent_id} (BR ID: ${bookingRequest.id}): ${captureError.message}. Attempting Amadeus rollback for Order ID: ${amadeusOrderId}.`);
        if (amadeusOrderId) {
          try {
            console.log(`[ProcessBooking] Attempting Amadeus cancellation for Order ID: ${amadeusOrderId} due to Stripe failure for BR ID: ${bookingRequest.id}`);
            await amadeus.booking.flightOrders.cancel.post({ path: { flightOrderId: amadeusOrderId } });
            console.log(`[ProcessBooking] Amadeus order ${amadeusOrderId} cancelled successfully after Stripe capture failure for BR ID: ${bookingRequest.id}.`);
            await supabase.from("bookings")
              .update({ status: "canceled_payment_failed", error_message: `Stripe capture failed: ${captureError.message}`, updated_at: new Date().toISOString() })
              .eq("id", newBookingRecordId);
          } catch (_cancelAmadeusError) {
            console.error(`[ProcessBooking] CRITICAL: Failed to cancel Amadeus order ${amadeusOrderId} (BR ID: ${bookingRequest.id}) after Stripe capture failure. Error: ${cancelAmadeusError.message}`);
            await supabase.from("bookings")
              .update({ status: "booked_payment_failed_rollback_failed", error_message: `Stripe capture failed, Amadeus rollback also failed: ${cancelAmadeusError.message}`, updated_at: new Date().toISOString() })
              .eq("id", newBookingRecordId);
          }
        }
        throw captureError; // Propagate error to set booking_request status to failed/pending_booking
      }
    } else if (!USE_MANUAL_CAPTURE && bookingRequest.checkout_session_id) {
      console.log(`[ProcessBooking] Old Stripe Checkout flow for booking_request_id: ${bookingRequest.id}. Payment assumed complete.`);
      await supabase.from("bookings")
        .update({ status: "ticketed", updated_at: new Date().toISOString() })
        .eq("id", newBookingRecordId);
      console.log(`[ProcessBooking] Booking ID ${newBookingRecordId} status updated to 'ticketed' (old flow) for BR ID: ${bookingRequest.id}.`);
    } else if (USE_MANUAL_CAPTURE && !bookingRequest.payment_intent_id) {
        console.warn(`[ProcessBooking] MANUAL_CAPTURE is true, but no payment_intent_id found for booking_request ${bookingRequest.id}. Cannot capture payment. Booking status remains 'booked_pending_payment'.`);
        // This might be an error state depending on expected flow. For now, it proceeds to "done" but booking is not "ticketed".
        // Or, we could throw an error here to mark booking_request as failed.
        // Let's throw an error to signify this inconsistent state.
        throw new Error(`Manual capture flow expected but no PaymentIntent ID found for booking request ${bookingRequest.id}.`);
    }


    // If all successful up to this point (Amadeus booking + Payment handling)
    await supabase.from("booking_requests")
      .update({ status: "done", processed_at: new Date().toISOString(), error: null })
      .eq("id", bookingRequest.id);

    supabase.functions.invoke("send-booking-confirmation", { body: { booking_request_id: bookingRequest.id } })
      .catch(err => console.error(`[ProcessBooking] Error invoking send-booking-confirmation for BR ID ${bookingRequest.id}:`, err));

    console.log(`[PROCESS-BOOKING] ✅ Booking request ${bookingRequest.id} completed successfully (including payment).`);
    return { success: true, bookingId: newBookingRecordId, amadeusData: amadeusResult };

  } catch (error) {
    console.error(`[PROCESS-BOOKING] ❌ Booking request ${bookingRequest.id} failed:`, error.message, error.stack);
    
    const attempts = (bookingRequest.attempts || 0) + 1;
    const shouldRetry = attempts < 3;
    
    await supabase
      .from("booking_requests")
      .update({ 
        status: shouldRetry ? "pending_booking" : "failed",
        error: error.message,
        attempts: attempts,
        processed_at: new Date().toISOString()
      })
      .eq("id", bookingRequest.id);

    // Send booking failure email if final failure
    if (!shouldRetry) {
      supabase.functions
        .invoke("send-booking-failed", { 
          body: { booking_request_id: bookingRequest.id } 
        })
        .catch(err => console.error(`[ProcessBooking] Error invoking send-booking-failed for BR ID ${bookingRequest.id}:`, err));
    }

    return { success: false, error: error.message, attempts, amadeusOrderIdIfBookingFailed: amadeusOrderId };
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    console.log("[PROCESS-BOOKING] Processing request...");
    
    const body = await req.json();
    console.log("[PROCESS-BOOKING] Request body:", body);
    
    let bookingRequests = [];
    
    if (body.bookingRequestId) {
      // Single booking request processing
      console.log(`[PROCESS-BOOKING] Processing specific booking request: ${body.bookingRequestId}`);
      const { data: request, error } = await supabase.from("booking_requests").select("*").eq("id", body.bookingRequestId).single();
      if (error) { console.error("[PROCESS-BOOKING] Error fetching booking request by ID:", error); throw error; }
      if (!request) throw new Error(`Booking request ${body.bookingRequestId} not found`);
      bookingRequests = [request];
    } else if (body.payment_intent_id) { // New case for fetching by payment_intent_id
        console.log(`[PROCESS-BOOKING] Processing by payment_intent_id: ${body.payment_intent_id}`);
        const { data: request, error } = await supabase
            .from("booking_requests")
            .select("*")
            .eq("payment_intent_id", body.payment_intent_id)
            // Potentially add .eq("status", "pending_payment") or "pending_booking" if PI is confirmed client-side first
            .single();
        if (error) { console.error("[PROCESS-BOOKING] Error fetching booking request by payment_intent_id:", error); throw error; }
        if (!request) throw new Error(`Booking request with payment_intent_id ${body.payment_intent_id} not found or not in a processable state.`);
        bookingRequests = [request];
    } else if (body.sessionId) { // Existing logic for checkout session
      console.log(`[PROCESS-BOOKING] Processing by checkout_session_id: ${body.sessionId}`);
      
      const { data: requests, error } = await supabase
        .from("booking_requests")
        .select("*")
        .eq("checkout_session_id", body.sessionId)
        .eq("status", "pending_booking");
        
      if (error) {
        console.error("[PROCESS-BOOKING] Error fetching booking requests by session:", error);
        throw error;
      }
      
      bookingRequests = requests || [];
    } else {
      // Batch processing of pending requests
      console.log("[PROCESS-BOOKING] Processing all pending booking requests...");
      
      const { data: requests, error } = await supabase
        .from("booking_requests")
        .select("*")
        .eq("status", "pending_booking")
        .lt("attempts", 3)
        .order("created_at", { ascending: true })
        .limit(5);

      if (error) throw error;
      bookingRequests = requests || [];
    }

    if (bookingRequests.length === 0) {
      console.log("[PROCESS-BOOKING] No booking requests found to process");
      return new Response(
        JSON.stringify({ message: "No pending requests", processed: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[PROCESS-BOOKING] Found ${bookingRequests.length} booking requests to process`);
    const results = [];

    for (const request of bookingRequests) {
      const result = await processBookingRequest(request);
      results.push({ id: request.id, ...result });
      
      // Add delay between requests to avoid overwhelming external APIs
      if (bookingRequests.length > 1) {
        await sleep(1000);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Booking processing completed", 
        processed: results.length,
        results 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[PROCESS-BOOKING] process-booking error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

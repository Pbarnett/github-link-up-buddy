const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase environment variables. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  throw new Error('Edge Function: Missing Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
}
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
if (!stripeSecretKey) {
  console.error('Error: Missing Stripe environment variable. STRIPE_SECRET_KEY must be set.');
  throw new Error('Edge Function: Missing Stripe environment variable (STRIPE_SECRET_KEY).');
}


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { USE_MANUAL_CAPTURE } from "../lib/config.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  try {
    const { userId, offerId } = await req.json();
    
    if (!userId || !offerId) {
      throw new Error("Missing required parameters: userId and offerId are required");
    }

    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );

    // 1. Fetch offer details
    const { data: offer, error: offerError } = await supabase
      .from("flight_offers")
      .select("*")
      .eq("id", offerId)
      .single();
      
    if (offerError || !offer) {
      throw offerError || new Error("Offer not found");
    }
    
    console.log(`Retrieved flight offer: ${offer.id} - ${offer.airline} ${offer.flight_number}`);
    
    // 2. Create booking request
    const { data: bookingRequest, error: bookingError } = await supabase
      .from("booking_requests")
      .insert({
        user_id: userId,
        offer_id: offer.id,
        offer_data: offer,
        auto: false,
        status: "pending_payment",
      })
      .select()
      .single();
      
    if (bookingError || !bookingRequest) {
      throw bookingError || new Error("Could not create booking request");
    }
    
    console.log(`Created booking request: ${bookingRequest.id}`);
    
    // 3. Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // 4. Conditional Stripe PaymentIntent or Checkout Session creation
    let responsePayload;

    if (USE_MANUAL_CAPTURE) {
        console.log(`[CreateBookingRequest] Using MANUAL CAPTURE flow for booking_request_id: ${bookingRequest.id}`);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(offer.price * 100),
            currency: offer.currency || 'usd', // Use offer's currency or default
            payment_method_types: ['card'],
            capture_method: 'manual',
            description: `Flight ${offer.airline} ${offer.flight_number} from ${offer.departure_date} to ${offer.return_date}`,
            metadata: {
                trip_request_id: offer.trip_request_id,
                flight_offer_id: offer.id,
                booking_request_id: bookingRequest.id,
                user_id: userId
            },
        }, {
             idempotencyKey: `pi_create_${bookingRequest.id}`
        });

        console.log(`[CreateBookingRequest] Created Stripe PaymentIntent: ${paymentIntent.id} for booking_request_id: ${bookingRequest.id}`);

        const { error: updateError } = await supabase
            .from("booking_requests")
            .update({
                payment_intent_id: paymentIntent.id,
                checkout_session_id: null
            })
            .eq("id", bookingRequest.id);

        if (updateError) {
            console.error(`[CreateBookingRequest] Failed to update booking request ${bookingRequest.id} with PaymentIntent ID: ${updateError.message}`);
            try {
                await stripe.paymentIntents.cancel(paymentIntent.id);
                console.log(`[CreateBookingRequest] Successfully cancelled PaymentIntent ${paymentIntent.id} due to DB update failure.`);
            } catch (cancelPiError) {
                console.error(`[CreateBookingRequest] CRITICAL: Failed to cancel PaymentIntent ${paymentIntent.id} after DB update failure. Manual reconciliation needed. Error:`, cancelPiError.message);
            }
            throw new Error(`Failed to update booking request with PaymentIntent ID: ${updateError.message}. PaymentIntent has been cancelled if possible.`);
        }

        responsePayload = {
            client_secret: paymentIntent.client_secret,
            payment_intent_id: paymentIntent.id,
            booking_request_id: bookingRequest.id
        };

    } else {
        // --- EXISTING STRIPE CHECKOUT SESSION LOGIC ---
        console.log(`[CreateBookingRequest] Using CHECKOUT SESSION flow for booking_request_id: ${bookingRequest.id}`);
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: offer.currency || "usd", // Use offer's currency or default
                    product_data: {
                        name: `Flight ${offer.airline} ${offer.flight_number}`,
                        description: `${offer.departure_date} to ${offer.return_date}`
                    },
                    unit_amount: Math.round(offer.price * 100),
                },
                quantity: 1,
            }],
            metadata: {
                trip_request_id: offer.trip_request_id,
                flight_offer_id: offer.id,
                order_id: bookingRequest.id, // This is booking_request_id, but named to match webhook expectations
                user_id: userId
            },
            success_url: `${req.headers.get("origin")}/trip/confirm?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get("origin")}/trip/offers?id=${offer.trip_request_id}`,
        }, {
            idempotencyKey: `checkout_${bookingRequest.id}`
        });
        console.log(`[CreateBookingRequest] Created Stripe checkout session: ${session.id}`);

        const { error: updateError } = await supabase
            .from("booking_requests")
            .update({ checkout_session_id: session.id, payment_intent_id: null })
            .eq("id", bookingRequest.id);

        if (updateError) {
            console.warn(`[CreateBookingRequest] Failed to update booking request (old flow) with session ID: ${updateError.message}`);
            // Old flow continued anyway, so maintain that behavior.
        }
        responsePayload = {
            url: session.url,
            session_id: session.id,
            booking_request_id: bookingRequest.id
        };
        // --- END OF EXISTING STRIPE CHECKOUT SESSION LOGIC ---
    }

    // Return the appropriate payload
    return new Response(
        JSON.stringify(responsePayload),
        {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
    );
  } catch (error) {
    console.error("Error in create-booking-request:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
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

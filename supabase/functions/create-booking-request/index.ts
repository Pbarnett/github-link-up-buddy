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
    
    // 4. Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: `Flight ${offer.airline} ${offer.flight_number}`,
              description: `${offer.departure_date} to ${offer.return_date}`
            },
            unit_amount: Math.round(offer.price * 100),
          },
          quantity: 1,
        },
      ],
      // Using the same metadata structure expected by the stripe-webhook function
      metadata: { 
        trip_request_id: offer.trip_request_id,
        flight_offer_id: offer.id,
        order_id: bookingRequest.id, // This is now booking_request_id, but named to match webhook expectations
        user_id: userId
      },
      // Setting success and cancel URLs
      success_url: `${req.headers.get("origin")}/trip/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/trip/offers?id=${offer.trip_request_id}`,
    }, { 
      idempotencyKey: `checkout_${bookingRequest.id}` 
    });
    
    console.log(`Created Stripe checkout session: ${session.id}`);
    
    // 5. Update booking request with checkout session ID
    const { error: updateError } = await supabase
      .from("booking_requests")
      .update({ 
        checkout_session_id: session.id,
      })
      .eq("id", bookingRequest.id);
      
    if (updateError) {
      console.error(`Failed to update booking request with session ID: ${updateError.message}`);
      // Continue anyway since the session was created
    }
    
    // Return checkout URL
    return new Response(
      JSON.stringify({ 
        url: session.url,
        session_id: session.id,
        booking_request_id: bookingRequest.id
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

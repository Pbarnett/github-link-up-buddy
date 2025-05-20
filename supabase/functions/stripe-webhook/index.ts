
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, Stripe-Signature",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Verify webhook signature
    const payload = await req.text();
    const sig = req.headers.get("stripe-signature");
    
    if (!sig || !endpointSecret) {
      console.error("Missing signature or webhook secret");
      return new Response(
        JSON.stringify({ error: "Missing signature or webhook secret" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      console.log(`✅ Webhook verified: ${event.type}`);
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed:`, err);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Process the event based on its type
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        
        if (!userId) {
          console.error("Missing user_id in session metadata");
          return new Response(
            JSON.stringify({ error: "Missing user_id in metadata" }),
            {
              status: 400,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        }

        console.log(`Processing completed checkout session for user ${userId}, mode: ${session.mode}`);
        
        if (session.mode === "setup") {
          // Handle setup mode - save new payment method
          const setupIntentId = session.setup_intent as string;
          if (!setupIntentId) {
            throw new Error("Missing setup intent ID");
          }
          
          console.log(`Retrieving setup intent: ${setupIntentId}`);
          const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
          
          if (!setupIntent.payment_method) {
            throw new Error("Setup intent has no payment method");
          }
          
          const pm = await stripe.paymentMethods.retrieve(setupIntent.payment_method as string);
          console.log(`Retrieved payment method: ${pm.id}`);
          
          // First unset any existing default payment methods
          const { error: updateError } = await supabase
            .from("payment_methods")
            .update({ is_default: false })
            .eq("user_id", userId);
            
          if (updateError) {
            console.error("Error unsetting default payment methods:", updateError);
          }
          
          // Now insert the new payment method
          const { error: insertError } = await supabase
            .from("payment_methods")
            .insert({
              user_id: userId,
              stripe_pm_id: pm.id,
              brand: pm.card?.brand,
              last4: pm.card?.last4,
              exp_month: pm.card?.exp_month,
              exp_year: pm.card?.exp_year,
              is_default: true,
              nickname: session.metadata?.nickname || null,
            });
            
          if (insertError) {
            console.error("Error inserting payment method:", insertError);
            throw new Error(`Failed to save payment method: ${insertError.message}`);
          }
          
          console.log(`✅ Payment method ${pm.id} saved for user ${userId}`);
        } else if (session.mode === "payment") {
          // Handle payment mode - complete order and create booking
          const orderId = session.metadata?.order_id;
          const tripRequestId = session.metadata?.trip_request_id;
          const flightOfferId = session.metadata?.flight_offer_id;
          
          if (!orderId || !tripRequestId || !flightOfferId) {
            throw new Error("Missing required metadata for payment completion");
          }
          
          console.log(`Processing payment for order ${orderId}`);
          
          // 1. Update the order status to completed
          const { error: orderError } = await supabase
            .from("orders")
            .update({ 
              status: "completed", 
              updated_at: new Date().toISOString() 
            })
            .eq("id", orderId);
            
          if (orderError) {
            console.error("Error updating order:", orderError);
            throw new Error(`Failed to update order: ${orderError.message}`);
          }
          
          // 2. Create a booking linked to this order
          const { error: bookingError } = await supabase
            .from("bookings")
            .insert({
              user_id: userId,
              trip_request_id: tripRequestId,
              flight_offer_id: flightOfferId,
              order_id: orderId,
            });
            
          if (bookingError) {
            console.error("Error creating booking:", bookingError);
            throw new Error(`Failed to create booking: ${bookingError.message}`);
          }
          
          console.log(`✅ Order ${orderId} completed and booking created`);
        }
        break;
      }
      
      // Handle other event types as needed
      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    // Return a success response to Stripe
    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("stripe-webhook error:", error);
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

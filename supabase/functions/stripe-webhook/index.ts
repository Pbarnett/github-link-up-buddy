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
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, Stripe-Signature",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to create notifications
async function createNotification(
  userId: string,
  type: string,
  payload: Record<string, unknown>
) {
  try {
    const { error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        payload,
        created_at: new Date().toISOString()
      });
      
    if (error) {
      console.error("Error creating notification:", error);
    }
  } catch (err) {
    console.error("Exception creating notification:", err);
  }
}

// Helper function to process booking requests
async function processBookingRequest(orderId: string) {
  try {
    console.log(`[STRIPE-WEBHOOK] Processing booking request: ${orderId}`);
    
    // Update booking request status
    const { data: request, error: requestError } = await supabase
      .from("booking_requests")
      .update({ 
        status: "pending_booking",
        updated_at: new Date().toISOString()
      })
      .eq("id", orderId)
      .select("user_id, offer_id, offer_data")
      .single();
      
    if (requestError || !request) {
      console.error("[STRIPE-WEBHOOK] Error updating booking request:", requestError);
      return false;
    }
    
    console.log(`[STRIPE-WEBHOOK] Updated booking request status to pending_booking: ${orderId}`);
    
    // Create notification for payment confirmation
    await createNotification(request.user_id, "payment_received", {
      bookingRequestId: orderId,
      timestamp: new Date().toISOString(),
      flightInfo: `${request.offer_data?.airline} ${request.offer_data?.flight_number}`
    });
    
    // Invoke process-booking function
    console.log(`[STRIPE-WEBHOOK] Invoking process-booking for booking request: ${orderId}`);
    const { data: processResult, error: processError } = await supabase.functions.invoke("process-booking", {
      body: { bookingRequestId: orderId }
    });
    
    if (processError) {
      console.error(`[STRIPE-WEBHOOK] Error invoking process-booking:`, processError);
      return false;
    }
    
    console.log(`[STRIPE-WEBHOOK] Process-booking result:`, processResult);
    return true;
  } catch (err) {
    console.error("[STRIPE-WEBHOOK] Error processing booking request:", err);
    return false;
  }
}

// Export handler function for testing
export async function handleStripeWebhook(req: Request): Promise<Response> {
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
      console.error("[STRIPE-WEBHOOK] Missing signature or webhook secret");
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
      console.log(`[STRIPE-WEBHOOK] ✅ Webhook verified: ${event.type}`);
    } catch (err) {
      console.error(`[STRIPE-WEBHOOK] ⚠️ Webhook signature verification failed:`, err);
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
      // Handle SetupIntent events for saving payment methods
      case "setup_intent.succeeded": {
        const setupIntent = event.data.object as Stripe.SetupIntent;
        console.log(`[STRIPE-WEBHOOK] Processing setup_intent.succeeded: ${setupIntent.id}`);
        
        if (!setupIntent.payment_method || !setupIntent.customer) {
          console.error("[STRIPE-WEBHOOK] SetupIntent missing payment_method or customer");
          break;
        }

        // Get payment method details
        const pm = await stripe.paymentMethods.retrieve(setupIntent.payment_method as string);
        console.log(`[STRIPE-WEBHOOK] Retrieved payment method: ${pm.id}`);

        // Find user by Stripe customer ID
        const { data: profile, error: profileError } = await supabase
          .from('traveler_profiles')
          .select('user_id')
          .eq('stripe_customer_id', setupIntent.customer as string)
          .single();

        if (profileError || !profile) {
          console.error("[STRIPE-WEBHOOK] Cannot find user for customer:", setupIntent.customer);
          break;
        }

        const userId = profile.user_id;

        // Check if payment method already exists (idempotency)
        const { data: existingPM } = await supabase
          .from('payment_methods')
          .select('id')
          .eq('stripe_payment_method_id', pm.id)
          .single();

        if (existingPM) {
          console.log(`[STRIPE-WEBHOOK] Payment method ${pm.id} already exists, skipping`);
          break;
        }

        // Check if this is the user's first payment method
        const { data: existingMethods } = await supabase
          .from('payment_methods')
          .select('id')
          .eq('user_id', userId);

        const isFirstMethod = !existingMethods || existingMethods.length === 0;

        // If this will be the default, unset other defaults first
        if (isFirstMethod) {
          await supabase
            .from('payment_methods')
            .update({ is_default: false })
            .eq('user_id', userId);
        }

        // Save payment method to database
        const { error: insertError, data: insertedMethod } = await supabase
          .from('payment_methods')
          .insert({
            user_id: userId,
            stripe_customer_id: setupIntent.customer as string,
            stripe_payment_method_id: pm.id,
            brand: pm.card?.brand,
            last4: pm.card?.last4,
            exp_month: pm.card?.exp_month,
            exp_year: pm.card?.exp_year,
            is_default: isFirstMethod,
          })
          .select()
          .single();

        if (insertError) {
          console.error("[STRIPE-WEBHOOK] Error saving payment method:", insertError);
          break;
        }

        // Create notification
        await createNotification(userId, "payment_method_added", {
          paymentMethodId: insertedMethod.id,
          brand: pm.card?.brand,
          last4: pm.card?.last4,
          isDefault: isFirstMethod,
          timestamp: new Date().toISOString()
        });

        console.log(`[STRIPE-WEBHOOK] ✅ Payment method ${pm.id} saved for user ${userId}`);
        break;
      }

      // Handle PaymentIntent events for auto-booking charges
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[STRIPE-WEBHOOK] Processing payment_intent.succeeded: ${paymentIntent.id}`);

        // Check if this is an auto-booking payment
        const isAutoBooking = paymentIntent.metadata?.auto_booking === 'true';
        const campaignId = paymentIntent.metadata?.campaign_id;
        const userId = paymentIntent.metadata?.user_id;

        if (isAutoBooking && campaignId) {
          console.log(`[STRIPE-WEBHOOK] Auto-booking payment succeeded for campaign: ${campaignId}`);
          
          // Create notification for successful auto-booking payment
          if (userId) {
            await createNotification(userId, "auto_booking_payment_succeeded", {
              campaignId: campaignId,
              paymentIntentId: paymentIntent.id,
              amount: paymentIntent.amount / 100, // Convert from cents
              currency: paymentIntent.currency,
              route: paymentIntent.metadata?.route,
              departureDate: paymentIntent.metadata?.departure_date,
              timestamp: new Date().toISOString()
            });
          }

          // The actual booking should already be triggered by prepare-auto-booking-charge
          // This webhook serves as confirmation and audit trail
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[STRIPE-WEBHOOK] Processing payment_intent.payment_failed: ${paymentIntent.id}`);

        // Check if this is an auto-booking payment
        const isAutoBooking = paymentIntent.metadata?.auto_booking === 'true';
        const campaignId = paymentIntent.metadata?.campaign_id;
        const userId = paymentIntent.metadata?.user_id;

        if (isAutoBooking && campaignId && userId) {
          console.log(`[STRIPE-WEBHOOK] Auto-booking payment failed for campaign: ${campaignId}`);
          
          // Update campaign status if payment failed
          await supabase
            .from('campaigns')
            .update({ 
              status: 'paused', // Pause campaign until payment issue is resolved
              updated_at: new Date().toISOString()
            })
            .eq('id', campaignId)
            .eq('user_id', userId);

          // Create notification for failed auto-booking payment
          await createNotification(userId, "auto_booking_payment_failed", {
            campaignId: campaignId,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            route: paymentIntent.metadata?.route,
            failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
            timestamp: new Date().toISOString()
          });

          console.log(`[STRIPE-WEBHOOK] Campaign ${campaignId} paused due to payment failure`);
        }
        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const orderId = session.metadata?.order_id; // This is the booking_request_id
        
        console.log(`[STRIPE-WEBHOOK] Processing completed checkout session for user ${userId}, orderId: ${orderId}, mode: ${session.mode}`);
        
        if (!userId) {
          console.error("[STRIPE-WEBHOOK] Missing user_id in session metadata");
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

        if (session.mode === "setup") {
          // This is handled by setup_intent.succeeded above, but we can log for completeness
          console.log(`[STRIPE-WEBHOOK] Setup session completed, setup_intent.succeeded should handle payment method saving`);
        } else if (session.mode === "payment") {
          // Handle payment mode - process booking request or complete order
          if (orderId) {
            // Handle new booking flow with booking_requests
            console.log(`[STRIPE-WEBHOOK] Processing payment for booking request ${orderId}`);
            
            // First update the checkout session ID
            const { error: updateSessionError } = await supabase
              .from("booking_requests")
              .update({ 
                checkout_session_id: session.id,
                updated_at: new Date().toISOString()
              })
              .eq("id", orderId);
              
            if (updateSessionError) {
              console.error(`[STRIPE-WEBHOOK] Error updating checkout session ID:`, updateSessionError);
            }
            
            const success = await processBookingRequest(orderId);
            
            if (!success) {
              console.error(`[STRIPE-WEBHOOK] Failed to process booking request: ${orderId}`);
            }
          } else {
            // Handle legacy flow (this is the old code path for orders)
            const tripRequestId = session.metadata?.trip_request_id;
            const flightOfferId = session.metadata?.flight_offer_id;
            
            if (!tripRequestId || !flightOfferId) {
              throw new Error("Missing required metadata for payment completion");
            }
            
            console.log(`[STRIPE-WEBHOOK] Processing legacy payment with trip request ${tripRequestId}`);
            
            // 1. Update the order status to completed
            const { error: orderError } = await supabase
              .from("orders")
              .update({ 
                status: "completed", 
                updated_at: new Date().toISOString() 
              })
              .eq("id", orderId);
              
            if (orderError) {
              console.error("[STRIPE-WEBHOOK] Error updating order:", orderError);
              throw new Error(`Failed to update order: ${orderError.message}`);
            }
            
            // 2. Create a booking linked to this order
            const { error: bookingError, data: booking } = await supabase
              .from("bookings")
              .insert({
                user_id: userId,
                trip_request_id: tripRequestId,
                flight_offer_id: flightOfferId,
              })
              .select()
              .single();
              
            if (bookingError) {
              console.error("[STRIPE-WEBHOOK] Error creating booking:", bookingError);
              throw new Error(`Failed to create booking: ${bookingError.message}`);
            }
            
            // Create notification for booking
            await createNotification(userId, "booking_success", {
              bookingId: booking.id,
              flightOfferId,
              orderId,
              timestamp: new Date().toISOString()
            });
            
            console.log(`[STRIPE-WEBHOOK] ✅ Order ${orderId} completed and booking created`);
          }
        }
        break;
      }
      
      // Handle other event types as needed
      default:
        console.log(`[STRIPE-WEBHOOK] ⚠️ Unhandled event type: ${event.type}`);
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
    console.error("[STRIPE-WEBHOOK] stripe-webhook error:", error);
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
}

// Only call serve when running in Deno (not in tests)
if (typeof Deno !== 'undefined' && !Deno.env.get('VITEST')) {
  serve(handleStripeWebhook);
}

// Export as default for compatibility
export default handleStripeWebhook;

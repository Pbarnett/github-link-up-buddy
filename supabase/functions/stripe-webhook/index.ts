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
  apiVersion: "2023-10-16",
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
  payload: Record<string, any>
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

// Helper to upsert fee metadata into booking_requests.offer_data JSON
async function upsertFeeMetadataOnBookingRequest(bookingRequestId: string, meta: Record<string, any>) {
  try {
    const { data: br, error: fetchErr } = await supabase
      .from('booking_requests')
      .select('offer_data')
      .eq('id', bookingRequestId)
      .single();

    if (fetchErr || !br) {
      console.error('[STRIPE-WEBHOOK] Failed to fetch booking_request for fee upsert:', fetchErr);
      return false;
    }

    const offerData = (br as any).offer_data || {};
    const newOfferData = {
      ...offerData,
      fee_breakdown: {
        fee_model: meta.fee_model || 'savings-based',
        threshold_price: meta.threshold_price ?? '',
        actual_price: meta.actual_price ?? '',
        savings: meta.savings ?? '',
        fee_pct: meta.fee_pct ?? '',
        fee_amount_cents: meta.fee_amount_cents ?? '',
        source: meta.source || 'stripe-webhook',
        payment_intent_id: meta.payment_intent_id || undefined,
        checkout_session_id: meta.checkout_session_id || undefined,
        updated_at: new Date().toISOString(),
      },
    };

    const { error: updateErr } = await supabase
      .from('booking_requests')
      .update({ offer_data: newOfferData, updated_at: new Date().toISOString() })
      .eq('id', bookingRequestId);

    if (updateErr) {
      console.error('[STRIPE-WEBHOOK] Failed to update fee breakdown on booking_request:', updateErr);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[STRIPE-WEBHOOK] Exception during fee metadata upsert:', e);
    return false;
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

    // Simple retry helper for transient errors
    async function withRetries<T>(fn: () => Promise<T>, attempts = 3, delayMs = 300): Promise<T> {
      let lastErr: any;
      for (let i = 0; i < attempts; i++) {
        try { return await fn(); } catch (e) { lastErr = e; if (i < attempts - 1) await new Promise(r => setTimeout(r, delayMs * (i + 1))); }
      }
      throw lastErr;
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

        // Persist fee breakdown on booking_request if present
        const bookingRequestId = paymentIntent.metadata?.booking_request_id;
        if (bookingRequestId) {
          await upsertFeeMetadataOnBookingRequest(bookingRequestId, {
            fee_model: paymentIntent.metadata?.fee_model,
            threshold_price: paymentIntent.metadata?.threshold_price,
            actual_price: paymentIntent.metadata?.actual_price,
            savings: paymentIntent.metadata?.savings,
            fee_pct: paymentIntent.metadata?.fee_pct,
            fee_amount_cents: paymentIntent.metadata?.fee_amount_cents,
            source: 'payment_intent.succeeded',
            payment_intent_id: paymentIntent.id,
          });
        }

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
        const orderId = session.metadata?.order_id; // now refers to orders.id (new flow)
        
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
          const tripRequestId = session.metadata?.trip_request_id;
          const flightOfferId = session.metadata?.flight_offer_id;

          if (!tripRequestId || !flightOfferId) {
            throw new Error("Missing required metadata for payment completion");
          }

          // New flow: complete order in orders table and create booking
          if (orderId) {
            // Update order with completed status and checkout session id (with retries)
            await withRetries(async () => {
              const { error: orderUpdateErr } = await supabase
                .from("orders")
                .update({ 
                  status: "completed",
                  checkout_session_id: session.id,
                  updated_at: new Date().toISOString() 
                })
                .eq("id", orderId);
              if (orderUpdateErr) throw new Error(orderUpdateErr.message);
            });

            // Create booking
            const booking = await withRetries(async () => {
              const { error, data } = await supabase
                .from("bookings")
                .insert({ user_id: userId, trip_request_id: tripRequestId, flight_offer_id: flightOfferId })
                .select()
                .single();
              if (error) throw new Error(error.message);
              return data;
            });

            await createNotification(userId, "booking_success", {
              bookingId: booking.id,
              flightOfferId,
              orderId,
              timestamp: new Date().toISOString()
            });

            console.log(`[STRIPE-WEBHOOK] ✅ Order ${orderId} completed and booking created`);
          } else {
            // Legacy fallback (no explicit order id was provided)
            console.log(`[STRIPE-WEBHOOK] Legacy flow: completing booking without order id`);

            // Update any matching order if available (best-effort)
            try {
              await supabase
                .from("orders")
                .update({ status: "completed", checkout_session_id: session.id, updated_at: new Date().toISOString() })
                .eq("trip_request_id", tripRequestId);
            } catch {}

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

            await createNotification(userId, "booking_success", {
              bookingId: booking.id,
              flightOfferId,
              orderId: null,
              timestamp: new Date().toISOString()
            });
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

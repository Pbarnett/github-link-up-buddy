/// <reference lib="deno.ns" />
/**
 * Enhanced Stripe Webhook Handler with Shared Utilities
 * 
 * Handles Stripe webhook events using centralized logging, error tracking,
 * and structured observability for the auto-booking pipeline.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { logger } from '../_shared/logger.ts';
import { initSentryForFunction, captureException, addBreadcrumb } from '../_shared/sentry.ts';
import { verifyWebhookSignature } from '../_shared/stripe.ts';
import { recordStripeCaptureSuccess, recordStripeCaptureFailure } from '../_shared/metrics.ts';

// Environment validation
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !supabaseServiceRoleKey) {
  logger.error('Missing Supabase environment variables', {
    operation: 'stripe_webhook_init_error',
    error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
  });
  throw new Error('Edge Function: Missing Supabase environment variables');
}

const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
if (!stripeWebhookSecret) {
  logger.error('Missing Stripe webhook secret', {
    operation: 'stripe_webhook_init_error',
    error: 'Missing STRIPE_WEBHOOK_SECRET'
  });
  throw new Error('Edge Function: Missing Stripe webhook secret');
}

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
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Initialize Sentry for this function
initSentryForFunction('stripe-webhook');

// Helper function to log audit events for PCI compliance
async function logAuditEvent(
  eventType: string,
  userId: string | null,
  customerId: string | null,
  action: string,
  metadata: Record<string, unknown> = {}
) {
  try {
    await supabase
      .from('traveler_data_audit')
      .insert({
        user_id: userId,
        action: action,
        table_name: 'stripe_events',
        record_id: eventType,
        old_data: null,
        new_data: {
          event_type: eventType,
          customer_id: customerId,
          timestamp: new Date().toISOString(),
          ...metadata
        },
        created_at: new Date().toISOString(),
      });
      
    logger.info('Audit event logged', {
      operation: 'audit_event_logged',
      eventType,
      userId,
      action
    });
  } catch (error) {
    logger.error('Failed to log audit event', {
      operation: 'audit_event_log_failed',
      eventType,
      userId,
      action,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Helper function to update customer last payment timestamp
async function updateCustomerLastPayment(customerId: string) {
  try {
    await supabase
      .from('stripe_customers')
      .update({ last_payment_at: new Date().toISOString() })
      .eq('stripe_customer_id', customerId);
      
    logger.info('Customer last payment timestamp updated', {
      operation: 'customer_last_payment_updated',
      customerId
    });
  } catch (error) {
    logger.error('Failed to update customer last payment timestamp', {
      operation: 'customer_last_payment_update_failed',
      customerId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

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
      logger.error('Failed to create notification', {
        operation: 'notification_creation_failed',
        userId,
        type,
        error: error.message
      });
    } else {
      logger.info('Notification created', {
        operation: 'notification_created',
        userId,
        type
      });
    }
  } catch (err) {
    console.error("Exception creating notification:", err);
    logger.error('Exception creating notification', {
      operation: 'notification_creation_exception',
      userId,
      type,
      error: err instanceof Error ? err.message : 'Unknown error'
    });
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
    
    let event: any;
    try {
      event = verifyWebhookSignature(payload, sig, stripeWebhookSecret);
      
      logger.info('Webhook signature verified', {
        operation: 'stripe_webhook_verified',
        eventType: event.type,
        eventId: event.id
      });
      
      addBreadcrumb({
        message: 'Webhook signature verified',
        category: 'stripe',
        data: {
          eventType: event.type,
          eventId: event.id
        }
      });
    } catch (err) {
      logger.error('Webhook signature verification failed', {
        operation: 'stripe_webhook_signature_failed',
        error: err.message
      });
      
      captureException(err, {
        operation: 'stripe_webhook_signature_verification'
      });
      
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

        // Log audit event for payment method creation
        await logAuditEvent(
          'setup_intent.succeeded',
          userId,
          setupIntent.customer as string,
          'PAYMENT_METHOD_ADDED',
          {
            payment_method_id: pm.id,
            setup_intent_id: setupIntent.id,
            brand: pm.card?.brand,
            last4: pm.card?.last4,
            is_default: isFirstMethod
          }
        );

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
        
        logger.info('Payment intent succeeded', {
          operation: 'stripe_webhook_payment_succeeded',
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        });
        
        // Update flight_bookings status to payment_confirmed
        const { data: booking, error: bookingError } = await supabase
          .from('flight_bookings')
          .update({ 
            status: 'payment_confirmed',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', paymentIntent.id)
          .select('id, user_id')
          .single();
          
        if (bookingError) {
          logger.error('Failed to update flight booking status', {
            operation: 'stripe_webhook_booking_update_failed',
            paymentIntentId: paymentIntent.id,
            error: bookingError.message
          });
        } else if (booking) {
          logger.info('Flight booking status updated to payment_confirmed', {
            operation: 'stripe_webhook_booking_confirmed',
            bookingId: booking.id,
            paymentIntentId: paymentIntent.id
          });
          
          // Update customer last payment timestamp for lifecycle tracking
          if (paymentIntent.customer) {
            await updateCustomerLastPayment(paymentIntent.customer as string);
          }
          
          // Log audit event for successful payment
          await logAuditEvent(
            'payment_intent.succeeded',
            booking.user_id,
            paymentIntent.customer as string,
            'PAYMENT_SUCCEEDED',
            {
              payment_intent_id: paymentIntent.id,
              booking_id: booking.id,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency
            }
          );
          
          recordStripeCaptureSuccess(paymentIntent.id, paymentIntent.currency);
          // Create notification for successful payment
          await createNotification(booking.user_id, "flight_payment_succeeded", {
            bookingId: booking.id,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            timestamp: new Date().toISOString()
          });
        }
        
        // Legacy auto-booking handling
        const isAutoBooking = paymentIntent.metadata?.auto_booking === 'true';
        const campaignId = paymentIntent.metadata?.campaign_id;
        const userId = paymentIntent.metadata?.user_id;

        if (isAutoBooking && campaignId) {
          console.log(`[STRIPE-WEBHOOK] Auto-booking payment succeeded for campaign: ${campaignId}`);
          
          if (userId) {
            await createNotification(userId, "auto_booking_payment_succeeded", {
              campaignId: campaignId,
              paymentIntentId: paymentIntent.id,
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency,
              route: paymentIntent.metadata?.route,
              departureDate: paymentIntent.metadata?.departure_date,
              timestamp: new Date().toISOString()
            });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[STRIPE-WEBHOOK] Processing payment_intent.payment_failed: ${paymentIntent.id}`);
        
        logger.info('Payment intent failed', {
          operation: 'stripe_webhook_payment_failed',
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          failureReason: paymentIntent.last_payment_error?.message
        });
        
        // Update flight_bookings status to payment_failed
        const { data: booking, error: bookingError } = await supabase
          .from('flight_bookings')
          .update({ 
            status: 'payment_failed',
            error_message: paymentIntent.last_payment_error?.message || 'Payment failed',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', paymentIntent.id)
          .select('id, user_id')
          .single();
          
        if (bookingError) {
          logger.error('Failed to update flight booking status', {
            operation: 'stripe_webhook_booking_update_failed',
            paymentIntentId: paymentIntent.id,
            error: bookingError.message
          });
        } else if (booking) {
          logger.info('Flight booking status updated to payment_failed', {
            operation: 'stripe_webhook_booking_failed',
            bookingId: booking.id,
            paymentIntentId: paymentIntent.id
          });
          
          recordStripeCaptureFailure(paymentIntent.id, paymentIntent.last_payment_error?.message || 'Payment failed', paymentIntent.currency);
          // Create notification for failed payment
          await createNotification(booking.user_id, "flight_payment_failed", {
            bookingId: booking.id,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
            timestamp: new Date().toISOString()
          });
        }
        
        // Legacy auto-booking handling
        const isAutoBooking = paymentIntent.metadata?.auto_booking === 'true';
        const campaignId = paymentIntent.metadata?.campaign_id;
        const userId = paymentIntent.metadata?.user_id;

        if (isAutoBooking && campaignId && userId) {
          console.log(`[STRIPE-WEBHOOK] Auto-booking payment failed for campaign: ${campaignId}`);
          
          // Update campaign status if payment failed
          await supabase
            .from('campaigns')
            .update({ 
              status: 'paused',
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

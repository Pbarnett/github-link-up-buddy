import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cryptoProvider = Stripe.createSubtleCryptoProvider();

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (request) => {
  const signature = request.headers.get("Stripe-Signature");

  // First we need to verify the webhook signature
  if (!signature) {
    logStep("ERROR: No Stripe signature found");
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  const body = await request.text();
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
  });

  let receivedEvent: Stripe.Event;
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || "",
      undefined,
      cryptoProvider
    );
    logStep("Webhook signature verified", { eventType: receivedEvent.type });
  } catch (err) {
    logStep("ERROR: Webhook signature verification failed", { error: err.message });
    return new Response(`Webhook signature verification failed: ${err.message}`, {
      status: 400,
    });
  }

  // Use the service role key to bypass RLS for administrative updates
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    switch (receivedEvent.type) {
      case "checkout.session.completed": {
        const session = receivedEvent.data.object as Stripe.Checkout.Session;
        logStep("Processing checkout.session.completed", { sessionId: session.id });

        // Find the booking request for this session
        const { data: bookingRequest, error: fetchError } = await supabaseClient
          .from('booking_requests')
          .select('*')
          .eq('checkout_session_id', session.id)
          .single();

        if (fetchError || !bookingRequest) {
          logStep("ERROR: Booking request not found", { sessionId: session.id });
          throw new Error(`Booking request not found for session: ${session.id}`);
        }

        logStep("Booking request found", { id: bookingRequest.id, currentStatus: bookingRequest.status });

        // Update status to pending_booking
        await supabaseClient
          .from('booking_requests')
          .update({ status: 'pending_booking' })
          .eq('id', bookingRequest.id);
        logStep("Updated status to pending_booking");

        // Update status to processing
        await supabaseClient
          .from('booking_requests')
          .update({ status: 'processing' })
          .eq('id', bookingRequest.id);
        logStep("Updated status to processing");

        try {
          // Create the booking record
          const { data: booking, error: bookingError } = await supabaseClient
            .from('bookings')
            .insert({
              user_id: bookingRequest.user_id,
              trip_request_id: bookingRequest.offer_id, // This might need adjustment based on your schema
              flight_offer_id: bookingRequest.offer_id,
            })
            .select()
            .single();

          if (bookingError) {
            throw new Error(`Failed to create booking: ${bookingError.message}`);
          }
          logStep("Booking created successfully", { bookingId: booking.id });

          // Update status to done
          await supabaseClient
            .from('booking_requests')
            .update({ 
              status: 'done',
              processed_at: new Date().toISOString()
            })
            .eq('id', bookingRequest.id);
          logStep("Updated status to done");

        } catch (bookingError: any) {
          logStep("Booking creation failed", { error: bookingError.message });
          
          // Update status to failed
          await supabaseClient
            .from('booking_requests')
            .update({ 
              status: 'failed',
              error: bookingError.message,
              processed_at: new Date().toISOString()
            })
            .eq('id', bookingRequest.id);

          throw bookingError;
        }

        break;
      }

      case "setup_intent.succeeded": {
        const setupIntent = receivedEvent.data.object as Stripe.SetupIntent;
        logStep("Processing setup_intent.succeeded", { setupIntentId: setupIntent.id });

        if (!setupIntent.customer || !setupIntent.payment_method) {
          logStep("ERROR: Missing customer or payment_method in setup_intent");
          throw new Error("Missing customer or payment_method in setup_intent");
        }

        const customerId = setupIntent.customer as string;
        const paymentMethodId = setupIntent.payment_method as string;

        // Retrieve payment method details
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        logStep("Payment method retrieved", { paymentMethodId, type: paymentMethod.type });

        if (paymentMethod.type !== "card" || !paymentMethod.card) {
          throw new Error("Only card payment methods are supported");
        }

        // Find user by Stripe customer ID
        const { data: existingMethod } = await supabaseClient
          .from("payment_methods")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .limit(1)
          .single();

        let userId = existingMethod?.user_id;

        if (!userId) {
          // If no existing payment method, try to find user by email
          const customer = await stripe.customers.retrieve(customerId);
          if ("email" in customer && customer.email) {
            const { data: profile } = await supabaseClient
              .from("profiles")
              .select("id")
              .eq("email", customer.email)
              .single();
            userId = profile?.id;
          }
        }

        if (!userId) {
          throw new Error("Could not find user for this payment method");
        }

        // Set all existing payment methods for this user as non-default
        await supabaseClient
          .from("payment_methods")
          .update({ is_default: false })
          .eq("user_id", userId);

        // Insert new payment method
        const { error: insertError } = await supabaseClient
          .from("payment_methods")
          .insert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_pm_id: paymentMethodId,
            brand: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            exp_month: paymentMethod.card.exp_month,
            exp_year: paymentMethod.card.exp_year,
            is_default: true,
          });

        if (insertError) {
          logStep("ERROR: Failed to insert payment method", { error: insertError });
          throw insertError;
        }

        logStep("Payment method saved successfully");
        break;
      }

      default:
        logStep("Unhandled event type", { eventType: receivedEvent.type });
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook processing", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-BOOKING] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Use the service role key to bypass RLS for administrative updates
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { sessionId } = await req.json();
    if (!sessionId) {
      throw new Error("sessionId is required");
    }
    logStep("Session ID received", { sessionId });

    // Fetch the booking request by checkout_session_id
    const { data: bookingRequest, error: fetchError } = await supabaseClient
      .from('booking_requests')
      .select('*')
      .eq('checkout_session_id', sessionId)
      .single();

    if (fetchError || !bookingRequest) {
      throw new Error(`Booking request not found for session: ${sessionId}`);
    }
    logStep("Booking request found", { id: bookingRequest.id, status: bookingRequest.status });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Retrieve the Stripe Session to confirm payment status
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Stripe session retrieved", { paymentStatus: session.payment_status });

    if (session.payment_status !== 'paid') {
      throw new Error(`Payment not completed. Status: ${session.payment_status}`);
    }

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

      return new Response(JSON.stringify({ success: true, bookingId: booking.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

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

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-booking", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

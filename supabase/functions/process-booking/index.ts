
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import Stripe from 'https://esm.sh/stripe@14.14.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Validate environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize clients
    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { sessionId } = await req.json();

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'sessionId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing booking for session: ${sessionId}`);

    // Start database transaction by fetching booking request first
    let bookingRequestId: string;
    let userId: string;

    try {
      // 1. Validate Stripe session and extract booking_request_id from metadata
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (!session.metadata?.booking_request_id) {
        console.error('Session metadata missing booking_request_id:', session.metadata);
        return new Response(
          JSON.stringify({ error: 'Invalid session: missing booking_request_id in metadata' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      bookingRequestId = session.metadata.booking_request_id;
      console.log(`Found booking_request_id: ${bookingRequestId}`);

      // 2. Fetch the booking request by checkout_session_id for validation
      const { data: bookingRequest, error: fetchError } = await supabase
        .from('booking_requests')
        .select('*')
        .eq('checkout_session_id', sessionId)
        .eq('id', bookingRequestId)
        .single();

      if (fetchError || !bookingRequest) {
        console.error('Booking request not found:', fetchError);
        return new Response(
          JSON.stringify({ error: 'Booking request not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      userId = bookingRequest.user_id;

      // 3. Check for idempotency - if already processed, return success
      if (bookingRequest.status === 'done') {
        console.log(`Booking request ${bookingRequestId} already processed`);
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Booking request already processed',
            booking_request_id: bookingRequestId 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 4. Call the RPC function to process the booking
      console.log(`Calling rpc_auto_book_match for booking_request_id: ${bookingRequestId}`);
      
      const { error: rpcError } = await supabase.rpc('rpc_auto_book_match', {
        p_booking_request_id: bookingRequestId
      });

      if (rpcError) {
        console.error('RPC call failed:', rpcError);
        
        // Update booking request status to failed
        await supabase
          .from('booking_requests')
          .update({ 
            status: 'failed', 
            error_message: rpcError.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', bookingRequestId);

        // Create failure notification
        await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            type: 'booking_processing_failed',
            message: `Failed to process your booking: ${rpcError.message}`,
            data: {
              booking_request_id: bookingRequestId,
              session_id: sessionId,
              error: rpcError.message
            }
          });

        return new Response(
          JSON.stringify({ error: 'Failed to process booking', details: rpcError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 5. Success - RPC handles the booking creation and notification
      console.log(`Successfully processed booking for request: ${bookingRequestId}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Booking processed successfully',
          booking_request_id: bookingRequestId 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      
      // If we have the booking request ID, update its status
      if (bookingRequestId && userId) {
        await supabase
          .from('booking_requests')
          .update({ 
            status: 'failed', 
            error_message: `Stripe error: ${stripeError.message}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', bookingRequestId);

        // Create failure notification
        await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            type: 'booking_processing_failed',
            message: `Failed to validate payment session: ${stripeError.message}`,
            data: {
              booking_request_id: bookingRequestId,
              session_id: sessionId,
              error: stripeError.message
            }
          });
      }

      return new Response(
        JSON.stringify({ error: 'Stripe validation failed', details: stripeError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Unexpected error in process-booking:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

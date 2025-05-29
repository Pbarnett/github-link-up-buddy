import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0"; // Using a fixed recent version

// Critical Environment Variable Checks
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("FATAL: Missing critical environment variables (Stripe or Supabase keys/URL). Function cannot start.");
  // In a real Deno deploy, this throw might not be caught by the serve wrapper,
  // but it will prevent the function from being served if env vars are missing at startup.
  throw new Error("Missing critical environment variables. Function cannot start.");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Immediately handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Initialize outside main try-catch if they are needed for generic error responses with CORS
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers,
      });
    }

    let sessionId: string | undefined;
    try {
      const body = await req.json();
      if (typeof body !== 'object' || body === null) {
        throw new Error("Invalid JSON body."); // Will be caught by outer catch
      }
      sessionId = body.sessionId;
      if (!sessionId || typeof sessionId !== 'string') {
        return new Response(JSON.stringify({ error: "Missing or invalid sessionId in request body" }), {
          status: 400,
          headers,
        });
      }
    } catch (_parseError) {
      // This catches req.json() failures or the explicit throw above
      return new Response(JSON.stringify({ error: "Bad Request: Invalid JSON body" }), {
        status: 400,
        headers,
      });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY!, { // Non-null assertion due to check at startup
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });
    const supabaseAdmin: SupabaseClient = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    let bookingRequestId: string | null = null;
    let responseErrorMessage: string = '';
    let dbErrorMessage: string = '';
    let errorStatus: number = 500;

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      bookingRequestId = session.metadata?.booking_request_id || null;

      if (session.payment_status !== 'paid') {
        dbErrorMessage = 'Payment not completed';
        responseErrorMessage = dbErrorMessage;
        errorStatus = 400;
        await supabaseAdmin
          .from('booking_requests')
          .update({ status: 'failed', updated_at: new Date().toISOString(), error_message: dbErrorMessage })
          .eq('checkout_session_id', sessionId);
        throw new Error(responseErrorMessage); // Caught by the catch block below this inner try
      }

      if (!bookingRequestId) {
        dbErrorMessage = 'Missing booking_request_id in Stripe session metadata';
        responseErrorMessage = dbErrorMessage;
        errorStatus = 400;
        await supabaseAdmin
          .from('booking_requests')
          .update({ status: 'failed', updated_at: new Date().toISOString(), error_message: dbErrorMessage })
          .eq('checkout_session_id', sessionId);
        throw new Error(responseErrorMessage);
      }
      
      const { data: bookingRequestData, error: brError } = await supabaseAdmin
        .from('booking_requests')
        .select('status')
        .eq('id', bookingRequestId) // bookingRequestId is UUID string
        .single();

      if (brError && brError.code !== 'PGRST116') { // PGRST116: row not found / more than one row
        dbErrorMessage = `DB Error checking booking request: ${brError.message}`;
        responseErrorMessage = "Database error while checking booking request."; // Generic for client
        errorStatus = 500;
        throw new Error(dbErrorMessage); // Internal log gets detailed, client gets generic
      }

      if (bookingRequestData && bookingRequestData.status === 'done') {
        return new Response(JSON.stringify({ success: true, message: 'Booking already processed' }), {
          status: 200,
          headers,
        });
      }
      
      const { error: rpcErr } = await supabaseAdmin.rpc('rpc_auto_book_match', { 
        p_booking_request_id: bookingRequestId 
      });

      if (rpcErr) {
        dbErrorMessage = rpcErr.message;
        responseErrorMessage = `RPC Error: ${rpcErr.message}`;
        errorStatus = 500;
        // RPC is expected to update its own status, but we ensure it if RPC call itself errors before/after RPC logic
        await supabaseAdmin
          .from('booking_requests')
          .update({ status: 'failed', updated_at: new Date().toISOString(), error_message: dbErrorMessage })
          .eq('id', bookingRequestId);
        throw new Error(responseErrorMessage);
      }

      // Test Case 1 expects update to 'done' to be filtered by checkout_session_id.
      const { error: updateErr } = await supabaseAdmin
        .from('booking_requests')
        .update({ status: 'done', updated_at: new Date().toISOString(), error_message: null })
        .eq('checkout_session_id', sessionId); 

      if (updateErr) {
        dbErrorMessage = updateErr.message;
        responseErrorMessage = `DB Update Error: ${dbErrorMessage}`;
        errorStatus = 500;
        if(bookingRequestId){ // Should have bookingRequestId here
             await supabaseAdmin
            .from('booking_requests')
            .update({ status: 'failed', updated_at: new Date().toISOString(), error_message: dbErrorMessage })
            .eq('id', bookingRequestId);
        }
        throw new Error(responseErrorMessage);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers,
      });

    } catch (e: any) { // Catches errors from inner try block or direct Stripe API errors
      console.error(`Error processing booking for session ${sessionId}, br_id ${bookingRequestId}: ${e.message}`);
      
      if (!responseErrorMessage) { 
        dbErrorMessage = e.message;
        if (e.type && typeof e.type === 'string' && e.type.startsWith('Stripe')) {
          responseErrorMessage = `Stripe Error: ${e.message}`;
        } else { // Includes errors from RPC calls that might not have been caught by `if (rpcErr)`
          responseErrorMessage = e.message; 
        }
        errorStatus = (e as any).status || 500; 
      }
      
      const updateKey = bookingRequestId ? 'id' : 'checkout_session_id';
      const updateValue = bookingRequestId || sessionId;
    
      if (updateValue) {
        const {data: currentBrStatus} = await supabaseAdmin.from('booking_requests').select('status, error_message').eq(updateKey, updateValue).single();
        // Only update if not already 'failed' with the same message, or if it's a different error.
        if(!currentBrStatus || currentBrStatus.status !== 'failed' || currentBrStatus.error_message !== dbErrorMessage){
             const {error: finalUpdateError} = await supabaseAdmin
            .from('booking_requests')
            .update({ status: 'failed', updated_at: new Date().toISOString(), error_message: dbErrorMessage })
            .eq(updateKey, updateValue);
            if (finalUpdateError) {
                console.error(`CRITICAL: Failed to update booking status to failed for ${updateKey} ${updateValue}: ${finalUpdateError.message}`);
                // Prepend to ensure client gets original error if this fails
                responseErrorMessage = `Original error: ${responseErrorMessage}. Additionally, failed to update status to 'failed': ${finalUpdateError.message}`;
            }
        }
      }
      
      return new Response(JSON.stringify({ error: responseErrorMessage || 'An unexpected error occurred' }), {
        status: errorStatus,
        headers,
      });
    }
  } catch (e: any) { 
    // This catches very early errors, like req.json() if it wasn't caught, or other setup issues
    console.error('Outer critical error in process-booking:', e.message);
    return new Response(JSON.stringify({ error: 'Server Error: Critical processing failure.' }), {
        status: 500,
        headers, // Ensure CORS headers are sent even for these early errors
    });
  }
});
```

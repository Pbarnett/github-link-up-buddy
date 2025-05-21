
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

// Create a Supabase client with the service role key
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

// Initialize Stripe
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

// Helper function to log with a consistent prefix
const log = (message: string, data?: any) => {
  console.log(`[auto-book] ${message}`, data ? data : "");
};

// Helper function to charge a customer via Stripe
async function chargeCustomer(
  customerId: string, 
  paymentMethodId: string, 
  amount: number, 
  description: string
): Promise<Stripe.PaymentIntent> {
  try {
    log(`Creating payment intent for customer ${customerId} using payment method ${paymentMethodId}`);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      description: description
    });
    
    log(`Payment intent created: ${paymentIntent.id} (status: ${paymentIntent.status})`);
    return paymentIntent;
  } catch (error) {
    log(`Stripe payment error: ${error.message}`);
    throw error;
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    log("Starting auto-booking process");
    
    // Step 1: Fetch all un-notified matches for trip requests with auto_book_enabled=true
    log("Fetching eligible flight matches");
    
    const { data: eligibleMatches, error: matchError } = await supabaseClient
      .from("flight_matches")
      .select(`
        id,
        trip_request_id,
        flight_offer_id,
        price,
        depart_at,
        trip_requests(
          user_id,
          preferred_payment_method_id,
          auto_book_enabled
        ),
        flight_offers(
          airline,
          flight_number,
          departure_date,
          departure_time,
          return_date,
          duration
        )
      `)
      .eq("notified", false)
      .eq("trip_requests.auto_book_enabled", true)
      .order("created_at", { ascending: true });
    
    if (matchError) {
      throw new Error(`Failed to fetch eligible matches: ${matchError.message}`);
    }
    
    if (!eligibleMatches || eligibleMatches.length === 0) {
      log("No eligible matches found");
      return new Response(
        JSON.stringify({
          requestsProcessed: 0,
          matchesProcessed: 0,
          details: []
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    log(`Found ${eligibleMatches.length} eligible matches`);
    
    // Track unique trip requests processed
    const tripRequestsProcessed = new Set<string>();
    const details: any[] = [];
    
    // Process each match
    for (const match of eligibleMatches) {
      const matchId = match.id;
      const tripRequestId = match.trip_request_id;
      const flightOfferId = match.flight_offer_id;
      const userId = match.trip_requests?.user_id;
      const price = match.price;
      
      tripRequestsProcessed.add(tripRequestId);
      
      try {
        log(`Processing match ${matchId} for trip request ${tripRequestId}`);
        
        // Step 2: Get payment method (preferred or default)
        const preferredPaymentMethodId = match.trip_requests?.preferred_payment_method_id;
        let paymentMethod;
        
        if (preferredPaymentMethodId) {
          const { data: preferred } = await supabaseClient
            .from("payment_methods")
            .select("*")
            .eq("id", preferredPaymentMethodId)
            .maybeSingle();
            
          if (preferred) {
            paymentMethod = preferred;
            log(`Using preferred payment method ${preferredPaymentMethodId}`);
          }
        }
        
        // Fall back to default payment method if preferred is not available
        if (!paymentMethod) {
          log("No preferred payment method found, looking for default");
          const { data: defaultMethod } = await supabaseClient
            .from("payment_methods")
            .select("*")
            .eq("user_id", userId)
            .eq("is_default", true)
            .maybeSingle();
            
          if (defaultMethod) {
            paymentMethod = defaultMethod;
            log(`Using default payment method ${defaultMethod.id}`);
          }
        }
        
        if (!paymentMethod) {
          throw new Error("No valid payment method found");
        }
        
        // Step 3: Get Stripe customer ID for the user
        const { data: user, error: userError } = await supabaseClient.auth.admin.getUserById(userId);
        if (userError || !user) {
          throw new Error(`Failed to get user: ${userError?.message || "User not found"}`);
        }
        
        const email = user.user?.email;
        if (!email) {
          throw new Error("User email not found");
        }
        
        log(`Getting Stripe customer for email: ${email}`);
        const customers = await stripe.customers.list({ email, limit: 1 });
        
        if (customers.data.length === 0) {
          throw new Error("No Stripe customer found for this user");
        }
        
        const customerId = customers.data[0].id;
        
        // Step 4: Create description for the charge
        const flightOffer = match.flight_offers;
        const description = `Flight ${flightOffer?.airline} ${flightOffer?.flight_number}: ${flightOffer?.departure_date} to ${flightOffer?.return_date}`;
        
        // Step 5: Charge via Stripe
        log(`Charging customer ${customerId} $${price} for flight`);
        const intent = await chargeCustomer(
          customerId, 
          paymentMethod.stripe_pm_id, 
          price, 
          description
        );
        
        if (!intent || intent.status !== 'succeeded') {
          throw new Error(`Stripe charge failed: ${intent?.last_payment_error?.message || "Unknown error"}`);
        }
        
        log(`Payment succeeded: ${intent.id}`);
        
        // Step 6: Call the RPC function to handle all DB operations atomically
        log(`Calling rpc_auto_book_match for match ${matchId}`);
        const { error: rpcError } = await supabaseClient
          .rpc("rpc_auto_book_match", {
            p_match_id: matchId,
            p_payment_intent_id: intent.id,
          });
          
        // If RPC fails, issue a refund
        let refund = null;
        if (rpcError) {
          log(`RPC failed: ${rpcError.code} - ${rpcError.message}`, rpcError);
          
          // Issue a refund
          log(`Issuing refund for payment ${intent.id}`);
          refund = await stripe.refunds.create({ payment_intent: intent.id });
          log(`Issued refund: ${refund.id} (status: ${refund.status})`, refund);
        }
        
        // Add details to results
        details.push({
          matchId,
          tripRequestId,
          flightOfferId,
          paymentIntentId: intent.id,
          refundId: rpcError ? refund?.id : null,
          refundStatus: rpcError ? refund?.status : null,
          amount: price,
          success: !rpcError,
          errorCode: rpcError?.code,
          errorMessage: rpcError?.message,
          timestamp: new Date().toISOString()
        });
        
        if (!rpcError) {
          log(`Successfully processed match ${matchId}`);
        }
      } catch (error) {
        log(`Error processing match ${matchId}: ${error.message}`);
        details.push({
          matchId,
          tripRequestId,
          flightOfferId,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        // We continue processing other matches even if one fails
      }
    }
    
    // Return summary results
    const result = {
      requestsProcessed: tripRequestsProcessed.size,
      matchesProcessed: eligibleMatches.length,
      successfulBookings: details.filter(d => d.success).length,
      details
    };
    
    log(`Auto-booking completed`, result);
    
    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    log(`Function error: ${error.message}`);
    return new Response(
      JSON.stringify({
        error: error.message,
        requestsProcessed: 0,
        matchesProcessed: 0,
        details: []
      }),
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

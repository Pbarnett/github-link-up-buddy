
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
): Promise<string> {
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
    
    log(`Payment intent created: ${paymentIntent.id}`);
    return paymentIntent.id;
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
      const tripRequestId = match.trip_request_id;
      const flightOfferId = match.flight_offer_id;
      const userId = match.trip_requests?.user_id;
      const price = match.price;
      
      tripRequestsProcessed.add(tripRequestId);
      
      try {
        log(`Processing match ${match.id} for trip request ${tripRequestId}`);
        
        // Step 2: Check for existing booking for this flight offer (duplicate prevention)
        const { data: existingBooking } = await supabaseClient
          .from("bookings")
          .select("id")
          .eq("flight_offer_id", flightOfferId)
          .maybeSingle();
        
        if (existingBooking) {
          log(`Skipping match ${match.id}: Booking already exists`);
          details.push({
            matchId: match.id,
            tripRequestId,
            flightOfferId,
            success: false,
            skipped: true,
            reason: "Booking already exists",
            timestamp: new Date().toISOString()
          });
          continue;
        }
        
        // Step 3: Get payment method (preferred or default)
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
        
        // Step 4: Get Stripe customer ID for the user
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
        
        // Step 5: Create description for the charge
        const flightOffer = match.flight_offers;
        const description = `Flight ${flightOffer?.airline} ${flightOffer?.flight_number} on ${flightOffer?.departure_date} at ${flightOffer?.departure_time}`;
        
        // Step 6: Charge via Stripe
        log(`Charging customer ${customerId} $${price} for flight`);
        const paymentIntentId = await chargeCustomer(
          customerId, 
          paymentMethod.stripe_pm_id, 
          price, 
          description
        );
        
        // Step 7: Insert order record
        log(`Creating order record`);
        const { data: order, error: orderError } = await supabaseClient
          .from("orders")
          .insert({
            user_id: userId,
            trip_request_id: tripRequestId,
            flight_offer_id: flightOfferId,
            stripe_session_id: paymentIntentId,
            amount: price,
            currency: "usd",
            status: "paid",
            description: description
          })
          .select("id")
          .single();
          
        if (orderError) {
          throw new Error(`Failed to create order: ${orderError.message}`);
        }
        
        // Step 8: Insert booking record
        log(`Creating booking record`);
        const { data: booking, error: bookingError } = await supabaseClient
          .from("bookings")
          .insert({
            user_id: userId,
            trip_request_id: tripRequestId,
            flight_offer_id: flightOfferId
          })
          .select("id")
          .single();
          
        if (bookingError) {
          throw new Error(`Failed to create booking: ${bookingError.message}`);
        }
        
        // Step 9: Update flight_matches.notified = true
        log(`Marking match ${match.id} as notified`);
        const { error: updateMatchError } = await supabaseClient
          .from("flight_matches")
          .update({ notified: true })
          .eq("id", match.id);
          
        if (updateMatchError) {
          throw new Error(`Failed to update match: ${updateMatchError.message}`);
        }
        
        // Step 10: Disable auto_book_enabled on trip_request
        log(`Disabling auto-book for trip request ${tripRequestId}`);
        const { error: updateRequestError } = await supabaseClient
          .from("trip_requests")
          .update({ auto_book_enabled: false })
          .eq("id", tripRequestId);
          
        if (updateRequestError) {
          throw new Error(`Failed to update trip request: ${updateRequestError.message}`);
        }
        
        // Add success details
        details.push({
          matchId: match.id,
          tripRequestId,
          flightOfferId,
          orderId: order.id,
          bookingId: booking.id,
          paymentIntentId,
          amount: price,
          success: true,
          timestamp: new Date().toISOString()
        });
        
        log(`Successfully processed match ${match.id}`);
      } catch (error) {
        log(`Error processing match ${match.id}: ${error.message}`);
        details.push({
          matchId: match.id,
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

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
// Stripe and Supabase imports are deferred to runtime within the handler to support test environments

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, cf-ipcountry, x-country, x-country-code",
};

// Helper function to create notifications
async function createNotification(
  supabase: any,
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

export async function handleCreatePaymentSession(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  // Initialize Supabase client (lazy import for test compatibility)
  const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.45.0");
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // US-only gate
    try {
      const { isUSUser } = await import('../_shared/eligibility.ts');
      const check = isUSUser(req);
      if (!check.allowed) {
        return new Response(JSON.stringify({ error: 'Payments are currently available to US customers only.' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (e) {
      // proceed if helper not available
    }

    // Get user details from JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error(userError?.message || "User not authenticated");
    }
    
    // Parse request body
    const { trip_request_id, offer_id } = await req.json();
    
    if (!trip_request_id || !offer_id) {
      throw new Error("Missing trip_request_id or offer_id");
    }
    
    console.log(`Creating payment session for user: ${user.id}, trip: ${trip_request_id}, offer: ${offer_id}`);
    
    // Verify trip request belongs to user and pull pricing info
    const { data: tripRequest, error: tripError } = await supabase
      .from("trip_requests")
      .select("id, max_price, budget")
      .eq("id", trip_request_id)
      .eq("user_id", user.id)
      .single();
    
    if (tripError || !tripRequest) {
      throw new Error("Trip request not found or doesn't belong to user");
    }
    
    // Get flight offer details
    const { data: flightOffer, error: offerError } = await supabase
      .from("flight_offers")
      .select("*")
      .eq("id", offer_id)
      .eq("trip_request_id", trip_request_id)
      .single();
    
    if (offerError || !flightOffer) {
      throw new Error("Flight offer not found or doesn't belong to trip");
    }
    
    // Initialize Stripe via shared factory
    const { getStripe } = await import("../lib/stripe.ts");
    const stripe = await getStripe();
    
    // Get or create customer ID
    let customerId: string;
    // Find default payment method if exists
    let paymentMethodId: string | undefined;
    
    const { data: paymentMethods, error: pmError } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .limit(1);
    
    if (pmError) {
      console.error("Error fetching payment methods:", pmError);
    }
    
    // If we have payment methods, get the customer ID and payment method
    if (paymentMethods && paymentMethods.length > 0) {
      try {
        const pm = await stripe.paymentMethods.retrieve(paymentMethods[0].stripe_pm_id);
        customerId = pm.customer as string;
        paymentMethodId = paymentMethods[0].stripe_pm_id;
        console.log(`Using existing payment method: ${paymentMethodId}`);
      } catch (error) {
        console.error("Error retrieving payment method:", error);
        // Fall through to customer creation
        customerId = await createCustomer(stripe, user);
      }
    } else {
      // Create new customer
      customerId = await createCustomer(stripe, user);
    }
    
    // Calculate amount in cents, including savings-based fee if applicable
    const description = `${flightOffer.airline} ${flightOffer.flight_number}: ${flightOffer.departure_date} to ${flightOffer.return_date}`;
    const { deriveThresholdPrice, computeTotalWithFeeCents } = await import("../lib/fees.ts");
    const thresholdPrice = deriveThresholdPrice(tripRequest as any);
    const { totalCents, feeCents, savings, feePct } = computeTotalWithFeeCents({
      actualPrice: flightOffer.price,
      thresholdPrice,
    });
    const unitAmount = totalCents;
    
    // Create checkout session
    const origin = req.headers.get("origin") || "http://localhost:5173";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      payment_method: paymentMethodId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Flight: ${flightOffer.airline} ${flightOffer.flight_number}`,
              description: description,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/trip/confirm?id=${offer_id}&payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/trip/confirm?id=${offer_id}&payment=canceled`,
      billing_address_collection: 'required',
      allow_promotion_codes: false,
      automatic_tax: { enabled: false },
      customer_update: { address: 'auto' },
      phone_number_collection: { enabled: false },
      // Restrict to US only
      currency: 'usd',
      customer_creation: 'if_required',
      shipping_address_collection: { allowed_countries: ['US'] },
      metadata: {
        user_id: user.id,
        trip_request_id,
        flight_offer_id: offer_id,
        fee_model: 'savings-based',
        threshold_price: typeof thresholdPrice === 'number' ? String(thresholdPrice) : '',
        actual_price: String(flightOffer.price),
        savings: String(savings),
        fee_pct: String(feePct),
        fee_amount_cents: String(feeCents)
      }
    });
    
    // Create order record
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        trip_request_id: trip_request_id,
        payment_intent_id: session.id,
        amount: flightOffer.price,
        currency: "usd",
        status: "created",
        description: description,
      })
      .select()
      .single();
    
    if (orderError) {
      console.error("Error creating order:", orderError);
      throw new Error("Failed to create order record");
    }
    
    // Create notification for payment session
    await createNotification(supabase, user.id, "payment_initiated", {
      orderId: order.id,
      flightOfferId: offer_id,
      amount: flightOffer.price,
      currency: "usd",
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({ 
        url: session.url,
        orderId: order.id
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("create-payment-session error:", error);
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
  serve(handleCreatePaymentSession);
}

export const testableHandler = handleCreatePaymentSession;

// Helper function to create a new Stripe customer
async function createCustomer(stripe: Stripe, user: any): Promise<string> {
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: {
      user_id: user.id,
    },
  });
  console.log(`Created new customer: ${customer.id}`);
  return customer.id;
}

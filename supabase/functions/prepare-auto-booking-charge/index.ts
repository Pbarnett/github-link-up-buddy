// Dynamic imports for edge function compatibility
let serve: unknown;
let createClient: unknown;
let stripe: unknown;
let supabase: unknown;

// Initialize dependencies based on environment
if (typeof Deno !== 'undefined' && !globalThis.process?.env?.VITEST) {
  // Deno environment - use HTTPS imports
  const { serve: denoServe } = await import("https://deno.land/std@0.168.0/http/server.ts");
  const { createClient: supabaseCreateClient } = await import("https://esm.sh/@supabase/supabase-js@2.45.0");
  const { stripe: denoStripe } = await import("../lib/stripe.ts");
  
  serve = denoServe;
  createClient = supabaseCreateClient;
  stripe = denoStripe;
  
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase environment variables");
  }

  supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
} else {
  // Node.js/Test environment - use mocked versions
  const { createClient: nodeCreateClient } = await import("@supabase/supabase-js");
  const stripeModule = await import("stripe");
  
  createClient = nodeCreateClient;
  stripe = new stripeModule.default(process?.env?.STRIPE_SECRET_KEY || "test_key");
  
  // In test environment, these will be mocked
  const supabaseUrl = process?.env?.SUPABASE_URL || "http://localhost:54321";
  const supabaseServiceRoleKey = process?.env?.SUPABASE_SERVICE_ROLE_KEY || "test-key";
  
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface AutoBookingChargeRequest {
  campaign_id: string;
  flight_offer: {
    id: string;
    price: number;
    currency: string;
    airline: string;
    flight_number: string;
    departure_date: string;
    return_date?: string;
    route: string;
  };
  traveler_data?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    passport?: {
      number: string;
      expiry: string;
      country: string;
    };
  };
}

// Export handler function for testing
export async function handlePrepareAutoBookingCharge(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    console.log("[PREPARE-AUTO-BOOKING-CHARGE] Starting auto-booking charge process");
    
    // Parse request body
    const requestData: AutoBookingChargeRequest = await req.json();
    const { campaign_id, flight_offer, traveler_data } = requestData;

    if (!campaign_id || !flight_offer) {
      return new Response(JSON.stringify({ error: "Missing required parameters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log(`[PREPARE-AUTO-BOOKING-CHARGE] Processing campaign: ${campaign_id}, offer: ${flight_offer.id}`);

    // Step 1: Load and validate campaign
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select(`
        *,
        payment_method:payment_methods!campaigns_payment_method_id_fkey(
          stripe_customer_id,
          stripe_payment_method_id,
          last4,
          brand,
          exp_month,
          exp_year
        ),
        traveler_profile:traveler_profiles!campaigns_traveler_profile_id_fkey(
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq("id", campaign_id)
      .eq("status", "active")
      .single();

    if (campaignError || !campaign) {
      console.error("[PREPARE-AUTO-BOOKING-CHARGE] Campaign not found or inactive:", campaignError);
      return new Response(JSON.stringify({ 
        success: false,
        error: "Campaign not found or inactive" 
      }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Step 2: Validate price against campaign budget
    if (flight_offer.price > campaign.max_price) {
      console.log(`[PREPARE-AUTO-BOOKING-CHARGE] Price ${flight_offer.price} exceeds budget ${campaign.max_price}`);
      return new Response(JSON.stringify({ 
        success: false,
        error: `Flight price (${flight_offer.price} ${flight_offer.currency}) exceeds campaign budget (${campaign.max_price} ${campaign.currency})` 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Step 3: Validate payment method
    if (!campaign.payment_method || !campaign.payment_method.stripe_payment_method_id) {
      console.error("[PREPARE-AUTO-BOOKING-CHARGE] No valid payment method for campaign");
      return new Response(JSON.stringify({ 
        success: false,
        error: "No valid payment method found for campaign" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Step 4: Check for card expiry
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed

    if (
      campaign.payment_method.exp_year < currentYear ||
      (campaign.payment_method.exp_year === currentYear && campaign.payment_method.exp_month < currentMonth)
    ) {
      console.error("[PREPARE-AUTO-BOOKING-CHARGE] Payment method expired");
      return new Response(JSON.stringify({ 
        success: false,
        error: "Payment method has expired" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Step 5: Calculate final amount (convert to cents for USD)
    const finalAmount = Math.round(flight_offer.price * 100);
    const currency = flight_offer.currency.toLowerCase();

    // Step 6: Create PaymentIntent with off-session flag
    const idempotencyKey = `auto-booking-${campaign_id}-${flight_offer.id}-${Date.now()}`;
    
    console.log(`[PREPARE-AUTO-BOOKING-CHARGE] Creating PaymentIntent for ${finalAmount} ${currency}`);

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: finalAmount,
        currency: currency,
        customer: campaign.payment_method.stripe_customer_id,
        payment_method: campaign.payment_method.stripe_payment_method_id,
        off_session: true, // Critical: indicates this is a merchant-initiated transaction
        confirm: true, // Immediately attempt the charge
        capture_method: 'automatic', // Can be changed to 'manual' for two-phase commit
        description: `Auto-booking: ${flight_offer.airline} ${flight_offer.flight_number} - ${flight_offer.route}`,
        metadata: {
          campaign_id: campaign_id,
          flight_offer_id: flight_offer.id,
          user_id: campaign.user_id,
          auto_booking: 'true',
          route: flight_offer.route,
          departure_date: flight_offer.departure_date,
        }
      }, {
        idempotencyKey: idempotencyKey
      });

      console.log(`[PREPARE-AUTO-BOOKING-CHARGE] PaymentIntent created: ${paymentIntent.id}, status: ${paymentIntent.status}`);

      // Step 7: Handle PaymentIntent response
      if (paymentIntent.status === 'succeeded') {
        // Payment successful - proceed with booking
        console.log(`[PREPARE-AUTO-BOOKING-CHARGE] Payment succeeded, proceeding with booking`);
        
        // Create booking request for processing
        const bookingRequestData = {
          user_id: campaign.user_id,
          campaign_id: campaign_id,
          payment_intent_id: paymentIntent.id,
          offer_id: flight_offer.id,
          offer_data: flight_offer,
          traveler_data: traveler_data || {
            firstName: campaign.traveler_profile?.first_name || "Unknown",
            lastName: campaign.traveler_profile?.last_name || "Unknown",
            email: campaign.traveler_profile?.email || "",
            phone: campaign.traveler_profile?.phone || ""
          },
          status: "pending_booking",
          attempts: 0
        };

        const { data: bookingRequest, error: bookingError } = await supabase
          .from("booking_requests")
          .insert(bookingRequestData)
          .select()
          .single();

        if (bookingError) {
          console.error("[PREPARE-AUTO-BOOKING-CHARGE] Failed to create booking request:", bookingError);
          // TODO: Consider refunding the PaymentIntent here
          throw new Error("Failed to create booking request");
        }

        // Trigger booking processing (async)
        supabase.functions.invoke("process-booking", {
          body: { bookingRequestId: bookingRequest.id }
        }).catch(err => {
          console.error("[PREPARE-AUTO-BOOKING-CHARGE] Error invoking process-booking:", err);
        });

        return new Response(JSON.stringify({
          success: true,
          payment_intent_id: paymentIntent.id,
          booking_request_id: bookingRequest.id,
          amount: flight_offer.price,
          currency: currency
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

      } else if (paymentIntent.status === 'requires_action') {
        // 3D Secure or other authentication required
        console.log(`[PREPARE-AUTO-BOOKING-CHARGE] Payment requires action (3DS): ${paymentIntent.id}`);
        
        return new Response(JSON.stringify({
          success: false,
          requires_action: true,
          payment_intent_id: paymentIntent.id,
          next_action: paymentIntent.next_action,
          error: "Payment requires additional authentication"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

      } else {
        // Payment failed
        console.error(`[PREPARE-AUTO-BOOKING-CHARGE] Payment failed with status: ${paymentIntent.status}`);
        
        return new Response(JSON.stringify({
          success: false,
          error: `Payment failed with status: ${paymentIntent.status}`,
          payment_intent_id: paymentIntent.id
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

    } catch (stripeError: unknown) {
      console.error("[PREPARE-AUTO-BOOKING-CHARGE] Stripe error:", stripeError);
      
      // Parse Stripe error for user-friendly message
      let errorMessage = "Payment processing failed";
      
      if (stripeError && typeof stripeError === 'object' && 'type' in stripeError && stripeError.type === 'StripeCardError') {
        const errorCode = 'code' in stripeError ? stripeError.code : undefined;
        switch (errorCode) {
          case 'card_declined':
            errorMessage = "Card was declined by your bank";
            break;
          case 'insufficient_funds':
            errorMessage = "Insufficient funds on card";
            break;
          case 'expired_card':
            errorMessage = "Card has expired";
            break;
          case 'authentication_required':
            errorMessage = "Payment requires additional authentication";
            break;
          default:
            errorMessage = ('message' in stripeError ? stripeError.message as string : undefined) || errorMessage;
        }
      }

      return new Response(JSON.stringify({
        success: false,
        error: errorMessage,
        stripe_error_code: stripeError && typeof stripeError === 'object' && 'code' in stripeError ? stripeError.code : undefined,
        stripe_error_type: stripeError && typeof stripeError === 'object' && 'type' in stripeError ? stripeError.type : undefined
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

  } catch (error) {
    console.error("[PREPARE-AUTO-BOOKING-CHARGE] Unexpected error:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || "Internal server error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

// Only call serve when running in Deno (not in tests)
if (typeof Deno !== 'undefined' && !globalThis.process?.env?.VITEST && serve) {
  serve(handlePrepareAutoBookingCharge);
}

// Export as default for compatibility
export default handlePrepareAutoBookingCharge;

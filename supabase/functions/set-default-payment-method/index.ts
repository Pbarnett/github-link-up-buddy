const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase environment variables. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  throw new Error('Edge Function: Missing Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
}


import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../lib/stripe.ts";

// Cache environment variables and clients at module scope for better performance
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  const requestStart = Date.now();
  console.log("Request started at:", new Date().toISOString());

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const authStart = Date.now();
    const supabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the JWT from the request and get the user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    console.log("Auth check took:", Date.now() - authStart, "ms");

    // Get the payment method ID from the request
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Payment method ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Setting default payment method ${id} for user ${user.id}`);

    // First, get the payment method details from our database
    const fetchStart = Date.now();
    const { data: paymentMethod, error: fetchError } = await supabaseClient
      .from("payment_methods")
      .select("stripe_pm_id, stripe_customer_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !paymentMethod) {
      console.error("Error fetching payment method:", fetchError);
      return new Response(
        JSON.stringify({ error: "Payment method not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    console.log("Payment method fetch took:", Date.now() - fetchStart, "ms");

    let stripeCustomerId = paymentMethod.stripe_customer_id;

    // If we don't have a customer ID, we need to get it from Stripe
    if (!stripeCustomerId) {
      console.log("No stripe_customer_id found, retrieving from Stripe...");
      
      try {
        const stripeRetrieveStart = Date.now();
        // Get the payment method from Stripe to find the customer
        const stripePaymentMethod = await stripe.paymentMethods.retrieve(paymentMethod.stripe_pm_id);
        stripeCustomerId = stripePaymentMethod.customer as string;
        console.log("Stripe PM retrieve took:", Date.now() - stripeRetrieveStart, "ms");

        if (!stripeCustomerId) {
          return new Response(
            JSON.stringify({ error: "Payment method is not attached to a customer" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Update our database with the customer ID for future use
        const updateCustomerStart = Date.now();
        await supabaseClient
          .from("payment_methods")
          .update({ stripe_customer_id: stripeCustomerId })
          .eq("stripe_pm_id", paymentMethod.stripe_pm_id);
        console.log("Customer ID update took:", Date.now() - updateCustomerStart, "ms");

        console.log(`Updated payment method with stripe_customer_id: ${stripeCustomerId}`);
      } catch (stripeError: any) {
        console.error("Error retrieving payment method from Stripe:", stripeError);
        return new Response(
          JSON.stringify({ error: "Failed to retrieve payment method from Stripe" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Update default payment method in Stripe first
    try {
      console.log(`Updating Stripe customer ${stripeCustomerId} default payment method to ${paymentMethod.stripe_pm_id}`);
      
      const stripeUpdateStart = Date.now();
      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethod.stripe_pm_id,
        },
      });
      console.log("Stripe customer update took:", Date.now() - stripeUpdateStart, "ms");

      console.log("Successfully updated default payment method in Stripe");
    } catch (stripeError: any) {
      console.error("Error updating default payment method in Stripe:", stripeError);
      return new Response(
        JSON.stringify({ error: `Failed to update default payment method in Stripe: ${stripeError.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Now update our database - parallelize the unset and set operations
    const dbUpdateStart = Date.now();
    const [unsetResult, setResult] = await Promise.all([
      // First unset any existing default payment methods
      supabaseClient
        .from("payment_methods")
        .update({ is_default: false, updated_at: new Date().toISOString() })
        .eq("user_id", user.id),
      
      // Then set the new default payment method
      supabaseClient
        .from("payment_methods")
        .update({ is_default: true, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", user.id)
    ]);
    console.log("Parallel DB updates took:", Date.now() - dbUpdateStart, "ms");

    if (unsetResult.error) {
      console.error("Error unsetting default payment methods:", unsetResult.error);
      return new Response(
        JSON.stringify({ error: "Failed to update payment methods in database" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (setResult.error) {
      console.error("Error setting default payment method:", setResult.error);
      return new Response(
        JSON.stringify({ error: "Failed to set default payment method in database" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Successfully set payment method ${id} as default for user ${user.id}`);
    console.log("Total request time:", Date.now() - requestStart, "ms");

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error setting default payment method:", error);
    console.log("Total request time (with error):", Date.now() - requestStart, "ms");
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

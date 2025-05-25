
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../lib/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
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

    let stripeCustomerId = paymentMethod.stripe_customer_id;

    // If we don't have a customer ID, we need to get it from Stripe
    if (!stripeCustomerId) {
      console.log("No stripe_customer_id found, retrieving from Stripe...");
      
      try {
        // Get the payment method from Stripe to find the customer
        const stripePaymentMethod = await stripe.paymentMethods.retrieve(paymentMethod.stripe_pm_id);
        stripeCustomerId = stripePaymentMethod.customer as string;

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
        await supabaseClient
          .from("payment_methods")
          .update({ stripe_customer_id: stripeCustomerId })
          .eq("stripe_pm_id", paymentMethod.stripe_pm_id);

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
      
      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethod.stripe_pm_id,
        },
      });

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

    // Now update our database - first unset any existing default payment methods
    const { error: unsetError } = await supabaseClient
      .from("payment_methods")
      .update({ is_default: false, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (unsetError) {
      console.error("Error unsetting default payment methods:", unsetError);
      // Try to rollback Stripe changes would be complex here, so we log the error
      return new Response(
        JSON.stringify({ error: "Failed to update payment methods in database" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Then set the new default payment method
    const { error: setError } = await supabaseClient
      .from("payment_methods")
      .update({ is_default: true, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);

    if (setError) {
      console.error("Error setting default payment method:", setError);
      return new Response(
        JSON.stringify({ error: "Failed to set default payment method in database" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Successfully set payment method ${id} as default for user ${user.id}`);

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error setting default payment method:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

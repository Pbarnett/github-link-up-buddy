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
  console.log("Delete request started at:", new Date().toISOString());

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

    console.log(`Deleting payment method ${id} for user ${user.id}`);

    // First, get the payment method details from our database
    const fetchStart = Date.now();
    const { data: paymentMethod, error: fetchError } = await supabaseClient
      .from("payment_methods")
      .select("stripe_payment_method_id, stripe_customer_id, is_default")
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

    // Check if this is the default payment method
    if (paymentMethod.is_default) {
      console.log("Cannot delete default payment method, user should set another as default first");
      return new Response(
        JSON.stringify({ error: "Cannot delete the default payment method. Please set another payment method as default first." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Detach the payment method from Stripe first
    try {
      console.log(`Detaching payment method ${paymentMethod.stripe_payment_method_id} from Stripe`);
      
      const stripeDetachStart = Date.now();
      await stripe.paymentMethods.detach(paymentMethod.stripe_payment_method_id);
      console.log("Stripe detach took:", Date.now() - stripeDetachStart, "ms");

      console.log("Successfully detached payment method from Stripe");
    } catch (stripeError: any) {
      console.error("Error detaching payment method from Stripe:", stripeError);
      
      // If the payment method doesn't exist in Stripe, we can still delete it from our database
      if (stripeError.code === 'resource_missing') {
        console.log("Payment method not found in Stripe, continuing with database deletion");
      } else {
        return new Response(
          JSON.stringify({ error: `Failed to detach payment method from Stripe: ${stripeError.message}` }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Now delete from our database
    const dbDeleteStart = Date.now();
    const { error: deleteError } = await supabaseClient
      .from("payment_methods")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    console.log("DB delete took:", Date.now() - dbDeleteStart, "ms");

    if (deleteError) {
      console.error("Error deleting payment method from database:", deleteError);
      
      // If we successfully detached from Stripe but failed to delete from database,
      // we should try to re-attach to Stripe (best effort rollback)
      try {
        if (paymentMethod.stripe_customer_id) {
          const rollbackStart = Date.now();
          await stripe.paymentMethods.attach(paymentMethod.stripe_payment_method_id, {
            customer: paymentMethod.stripe_customer_id,
          });
          console.log("Stripe rollback took:", Date.now() - rollbackStart, "ms");
          console.log("Rolled back Stripe detachment due to database error");
        }
      } catch (rollbackError) {
        console.error("Failed to rollback Stripe detachment:", rollbackError);
      }

      return new Response(
        JSON.stringify({ error: "Failed to delete payment method from database" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Successfully deleted payment method ${id} for user ${user.id}`);
    console.log("Total request time:", Date.now() - requestStart, "ms");

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting payment method:", error);
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

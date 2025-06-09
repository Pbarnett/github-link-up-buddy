
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  // Initialize Supabase client
  const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
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
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    console.log(`Setting up payment method for user: ${user.id}`);
    
    // Check if customer already exists in Stripe
    let customerId: string;
    const { data: paymentMethods, error: pmError } = await supabase
      .from("payment_methods")
      .select("stripe_pm_id")
      .eq("user_id", user.id)
      .limit(1);
    
    if (pmError) {
      console.error("Error fetching payment methods:", pmError);
    }
    
    // If we have payment methods, get the customer ID from Stripe
    if (paymentMethods && paymentMethods.length > 0) {
      try {
        const pm = await stripe.paymentMethods.retrieve(paymentMethods[0].stripe_pm_id);
        customerId = pm.customer as string;
        console.log(`Retrieved existing customer: ${customerId}`);
      } catch (error) {
        console.error("Error retrieving payment method:", error);
        // Fall through to customer creation
        customerId = await createCustomer(stripe, user);
      }
    } else {
      // Create new customer
      customerId = await createCustomer(stripe, user);
    }
    
    // Create a setup session
    const origin = req.headers.get("origin") || "http://localhost:5173";
    const session = await stripe.checkout.sessions.create({
      mode: "setup",
      customer: customerId,
      payment_method_types: ["card"],
      success_url: `${origin}/wallet?setup=success`,
      cancel_url: `${origin}/wallet?setup=canceled`,
    });
    
    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("create-setup-session error:", error);
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
});

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

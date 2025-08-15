import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

// Initialize Supabase client (still needed for health responses if desired)
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = (supabaseUrl && supabaseServiceRoleKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

// Hard deprecation: this endpoint is no longer supported for PCI reasons.
// All requests will return 410 Gone with guidance to use SetupIntent-based wallet flows.
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Allow a basic health probe for observability if needed
  const url = new URL(req.url);
  if (url.searchParams.get('action') === 'health') {
    return new Response(
      JSON.stringify({
        status: 'deprecated',
        kms_endpoint: 'payment-methods-kms',
        message: 'This endpoint is deprecated. Use Stripe SetupIntent wallet flow.',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.warn('[DEPRECATION] payment-methods-kms called. Returning 410 Gone.');
  return new Response(
    JSON.stringify({
      error: 'This endpoint has been deprecated (PCI scope reduction). Use wallet add-card via Stripe SetupIntent.',
      code: 'endpoint_deprecated',
      next_steps: 'Invoke create-setup-intent and confirm via Stripe Elements; payment methods are persisted via webhooks.'
    }),
    { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});

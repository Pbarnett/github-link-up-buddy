import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

// Hard deprecation: this endpoint is no longer supported for PCI reasons.
// All requests will return 410 Gone with guidance to use SetupIntent-based wallet flows.
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get('action');
  if (action === 'health') {
    return new Response(
      JSON.stringify({
        status: 'deprecated',
        kms_endpoint: 'manage-payment-methods-kms',
        message: 'This endpoint is deprecated. Use Stripe SetupIntent wallet flow.',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const kmsEnabled = (Deno.env.get('ENABLE_KMS_CARD_STORAGE') || '').toLowerCase() === 'true';
  if (kmsEnabled) {
    console.warn('[DEPRECATION] manage-payment-methods-kms temporarily enabled by env; proceed with extreme caution');
    return new Response(
      JSON.stringify({
        status: 'soft-deprecated',
        warning: 'KMS endpoints are slated for removal. Set ENABLE_KMS_CARD_STORAGE=false to disable.',
      }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.warn('[DEPRECATION] manage-payment-methods-kms called. Returning 410 Gone.');
  return new Response(
    JSON.stringify({
      error: 'This endpoint has been deprecated (PCI scope reduction). Use wallet add-card via Stripe SetupIntent.',
      code: 'endpoint_deprecated',
      next_steps: 'Invoke create-setup-intent and confirm via Stripe Elements; payment methods are persisted via webhooks.'
    }),
    { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});

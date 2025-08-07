/**
 * Debug Environment Variables
 * Simple function to check what environment variables are available
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // AWS AI bot recommended debugging
    console.log('AWS_REGION:', Deno.env.get('AWS_REGION'));
    console.log('AWS_ACCESS_KEY_ID exists:', !!Deno.env.get('AWS_ACCESS_KEY_ID'));
    console.log('AWS_SECRET_ACCESS_KEY exists:', !!Deno.env.get('AWS_SECRET_ACCESS_KEY'));
    
    const envDebug = {
      AWS_REGION: Deno.env.get('AWS_REGION') || 'NOT_SET',
      AWS_ACCESS_KEY_ID: Deno.env.get('AWS_ACCESS_KEY_ID') ? 'SET' : 'NOT_SET',
      AWS_SECRET_ACCESS_KEY: Deno.env.get('AWS_SECRET_ACCESS_KEY') ? 'SET' : 'NOT_SET',
      KMS_GENERAL_ALIAS: Deno.env.get('KMS_GENERAL_ALIAS') || 'NOT_SET',
      KMS_PII_ALIAS: Deno.env.get('KMS_PII_ALIAS') || 'NOT_SET',
      KMS_PAYMENT_ALIAS: Deno.env.get('KMS_PAYMENT_ALIAS') || 'NOT_SET',
      KMS_FALLBACK_REGIONS: Deno.env.get('KMS_FALLBACK_REGIONS') || 'NOT_SET',
      APP_ENV: Deno.env.get('APP_ENV') || 'NOT_SET',
      // Legacy variables
      AWS_KMS_PII_KEY_ID: Deno.env.get('AWS_KMS_PII_KEY_ID') || 'NOT_SET',
      AWS_KMS_PAYMENT_KEY_ID: Deno.env.get('AWS_KMS_PAYMENT_KEY_ID') || 'NOT_SET',
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(envDebug, null, 2), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Debug env check failed:', error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, null, 2), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

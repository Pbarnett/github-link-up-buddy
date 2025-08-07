/**
 * Simple KMS Client Test
 * Tests basic AWS KMS SDK initialization with explicit credentials
 * Following AWS AI bot recommendations
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
    console.log('Testing KMS client initialization...');
    console.log('AWS_REGION:', Deno.env.get('AWS_REGION'));
    console.log('AWS_ACCESS_KEY_ID exists:', !!Deno.env.get('AWS_ACCESS_KEY_ID'));
    console.log('AWS_SECRET_ACCESS_KEY exists:', !!Deno.env.get('AWS_SECRET_ACCESS_KEY'));
    
    // Try to import KMS client
    const { KMSClient } = await import("https://esm.sh/@aws-sdk/client-kms@3.454.0");
    console.log('✓ KMS SDK imported successfully');
    
    // AWS AI bot recommended explicit configuration
    const kmsClient = new KMSClient({
      region: Deno.env.get('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY')!,
      },
      maxAttempts: 3,
      requestTimeout: 30000,
    });
    console.log('✓ KMS client created successfully');

    return new Response(JSON.stringify({
      status: 'success',
      message: 'KMS client initialized successfully',
      config: {
        region: Deno.env.get('AWS_REGION'),
        hasCredentials: !!(Deno.env.get('AWS_ACCESS_KEY_ID') && Deno.env.get('AWS_SECRET_ACCESS_KEY')),
      },
      timestamp: new Date().toISOString(),
    }, null, 2), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('KMS client test failed:', error);
    
    return new Response(JSON.stringify({ 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }, null, 2), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

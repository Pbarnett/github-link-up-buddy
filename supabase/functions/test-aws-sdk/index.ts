/**
 * Test AWS SDK Import
 * Minimal test to see if AWS SDK imports work in Edge Functions
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req: Request) => {
  try {
    console.log('Testing AWS SDK import...');
    
    // Try to import KMS client
    const { KMSClient } = await import("https://esm.sh/@aws-sdk/client-kms@3.454.0");
    console.log('✓ KMS SDK imported successfully');

    return new Response(JSON.stringify({
      status: 'success',
      message: 'AWS SDK import successful',
      timestamp: new Date().toISOString(),
    }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AWS SDK import failed:', error);
    
    return new Response(JSON.stringify({ 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

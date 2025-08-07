/**
 * Basic Test Function
 * Simple test without AWS imports to isolate the error
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req: Request) => {
  try {
    console.log('Basic test function called');
    
    return new Response(JSON.stringify({
      status: 'success',
      message: 'Basic function works',
      timestamp: new Date().toISOString(),
    }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Basic test failed:', error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

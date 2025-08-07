import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCORSHeaders } from "../_shared/cors.ts";

const corsHeaders = getCORSHeaders();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Simple ping response - always returns 200 OK
  const response = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'pong',
    version: '1.0.0'
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

// Create a Supabase client with the service role key
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    console.log("[scheduler-flight-search] Starting scheduled flight search...");
    
    // Call the flight-search function using fetch
    const flightSearchUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/flight-search`;
    
    console.log(`[scheduler-flight-search] Calling flight-search at ${flightSearchUrl}`);
    
    const response = await fetch(flightSearchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Flight search request failed with status ${response.status}: ${errorText}`);
    }
    
    // Parse and log the flight search results
    const searchResults = await response.json();
    console.log("[scheduler-flight-search] Flight search completed:", {
      requestsProcessed: searchResults.requestsProcessed,
      matchesInserted: searchResults.matchesInserted,
      detailsCount: searchResults.details?.length || 0
    });
    
    // Return success response with the search results
    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        flightSearchResults: searchResults
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // Handle and log errors
    console.error("[scheduler-flight-search] Error:", error.message);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
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

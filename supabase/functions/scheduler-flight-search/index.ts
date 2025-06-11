// no numeric ID casts found (validated 2025-06-11)
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase environment variables. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  throw new Error('Edge Function: Missing Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
}


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
    
    // Get the Supabase Functions URL and check that it's available
    const functionUrl = Deno.env.get("SUPABASE_URL");
    if (!functionUrl) {
      throw new Error("Missing SUPABASE_URL environment variable");
    }
    
    // Call the flight-search function using fetch
    const flightSearchUrl = `${functionUrl}/functions/v1/flight-search`;
    
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
    
    // Now call the auto-book function with retry logic
    console.log("[scheduler-flight-search] Calling auto-book function");
    
    let autoBookResult = null;
    let attempts = 0;
    const maxRetries = 3;
    
    while (attempts < maxRetries) {
      try {
        const autoBookUrl = `${functionUrl}/functions/v1/auto-book`;
        console.log(`[scheduler-flight-search] Calling auto-book at ${autoBookUrl} (attempt ${attempts + 1}/${maxRetries})`);
        
        // Pass the current retry attempt number to the auto-book function
        const autoBookResponse = await fetch(autoBookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({
            retryCount: attempts
          })
        });
        
        if (!autoBookResponse.ok) {
          const errorText = await autoBookResponse.text();
          throw new Error(`Status ${autoBookResponse.status}: ${errorText}`);
        }
        
        autoBookResult = await autoBookResponse.json();
        console.log("[scheduler-flight-search] Auto-book completed successfully:", {
          requestsProcessed: autoBookResult.requestsProcessed,
          matchesProcessed: autoBookResult.matchesProcessed,
          matchesSucceeded: autoBookResult.matchesSucceeded,
          matchesFailed: autoBookResult.matchesFailed,
          notificationsCreated: autoBookResult.notificationsCreated || 0,
          totalDuration: `${autoBookResult.totalDurationMs}ms`
        });
        
        break; // Success, exit retry loop
      } catch (err) {
        attempts++;
        console.error(`[scheduler-flight-search] Auto-book attempt ${attempts} failed:`, err.message);
        
        if (attempts < maxRetries) {
          // Exponential backoff: wait longer between each retry
          const delay = 1000 * Math.pow(2, attempts - 1);
          console.log(`[scheduler-flight-search] Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    if (attempts >= maxRetries) {
      console.error(`[scheduler-flight-search] Auto-book failed after ${maxRetries} attempts`);
    }
    
    // Return success response with the search and auto-book results
    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        flightSearchResults: searchResults,
        autoBookResults: autoBookResult
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

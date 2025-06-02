
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") as string,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    console.log("Scheduler: Checking for pending booking requests...");
    
    // Check if there are any pending booking requests
    const { data: pendingRequests, error } = await supabase
      .from("booking_requests")
      .select("id")
      .eq("status", "pending_booking")
      .lt("retry_count", 3)
      .limit(1);

    if (error) throw error;

    if (pendingRequests && pendingRequests.length > 0) {
      console.log(`Found ${pendingRequests.length} pending requests, invoking process-booking...`);
      
      // Invoke the process-booking function
      const { data, error: invokeError } = await supabase.functions.invoke("process-booking");
      
      if (invokeError) {
        console.error("Error invoking process-booking:", invokeError);
      } else {
        console.log("Process-booking invoked successfully:", data);
      }
    } else {
      console.log("No pending booking requests found");
    }

    return new Response(
      JSON.stringify({ 
        message: "Scheduler completed",
        pendingRequests: pendingRequests?.length || 0,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("scheduler-booking error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

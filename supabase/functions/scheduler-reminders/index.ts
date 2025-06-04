const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase environment variables. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  throw new Error('Edge Function: Missing Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
}


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const handler = async (req: Request): Promise<Response> => {
  try {
    console.log("Running scheduled reminder check...");

    // Get reminder candidates using the RPC function
    const { data: candidates, error } = await supabase.rpc('get_reminder_candidates');

    if (error) {
      console.error("RPC error:", error);
      throw new Error(`Failed to get reminder candidates: ${error.message}`);
    }

    console.log(`Found ${candidates?.length || 0} reminder candidates`);

    if (!candidates || candidates.length === 0) {
      return new Response(JSON.stringify({ 
        message: "No reminders to send",
        processed: 0,
        results: []
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Process each reminder candidate with detailed error handling
    const results = await Promise.allSettled(
      candidates.map(async (candidate) => {
        try {
          console.log(`Sending reminder for booking: ${candidate.booking_request_id}`);
          
          const { error } = await supabase.functions.invoke('send-sms-reminder', {
            body: { booking_request_id: candidate.booking_request_id }
          });

          if (error) {
            console.error(`Failed to send reminder for ${candidate.booking_request_id}:`, error);
            return { 
              id: candidate.booking_request_id, 
              status: "error", 
              error: error.message 
            };
          }

          return { 
            id: candidate.booking_request_id, 
            status: "sent" 
          };
        } catch (error) {
          console.error(`Error processing reminder for ${candidate.booking_request_id}:`, error);
          return { 
            id: candidate.booking_request_id, 
            status: "error", 
            error: error.message 
          };
        }
      })
    );

    // Transform Promise.allSettled results
    const processedResults = results.map(result => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          id: 'unknown',
          status: 'error',
          error: result.reason?.message || 'Unknown error'
        };
      }
    });

    const successful = processedResults.filter(r => r.status === 'sent').length;
    const failed = processedResults.filter(r => r.status === 'error').length;

    console.log(`Reminder processing complete: ${successful} successful, ${failed} failed`);

    return new Response(JSON.stringify({ 
      message: "Reminder processing complete",
      processed: processedResults.length,
      successful,
      failed,
      results: processedResults
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in scheduler-reminders:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      processed: 0,
      successful: 0,
      failed: 0,
      results: []
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

serve(handler);

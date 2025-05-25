
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
      throw new Error(`Failed to get reminder candidates: ${error.message}`);
    }

    console.log(`Found ${candidates?.length || 0} reminder candidates`);

    if (!candidates || candidates.length === 0) {
      return new Response(JSON.stringify({ 
        message: "No reminders to send",
        processed: 0 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Process each reminder candidate
    const results = await Promise.allSettled(
      candidates.map(async (candidate) => {
        try {
          console.log(`Sending reminder for booking: ${candidate.booking_request_id}`);
          
          const { error } = await supabase.functions.invoke('send-sms-reminder', {
            body: { booking_request_id: candidate.booking_request_id }
          });

          if (error) {
            console.error(`Failed to send reminder for ${candidate.booking_request_id}:`, error);
            throw error;
          }

          return { success: true, booking_id: candidate.booking_request_id };
        } catch (error) {
          console.error(`Error processing reminder for ${candidate.booking_request_id}:`, error);
          return { success: false, booking_id: candidate.booking_request_id, error: error.message };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    console.log(`Reminder processing complete: ${successful} successful, ${failed} failed`);

    return new Response(JSON.stringify({ 
      message: "Reminder processing complete",
      processed: results.length,
      successful,
      failed 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in scheduler-reminders:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

serve(handler);

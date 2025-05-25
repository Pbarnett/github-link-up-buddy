
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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function processBookingRequest(bookingRequest: any) {
  console.log(`Processing booking request ${bookingRequest.id}`);
  
  try {
    // Mark as processing
    await supabase
      .from("booking_requests")
      .update({ 
        status: "processing",
        processed_at: new Date().toISOString()
      })
      .eq("id", bookingRequest.id);

    // Simulate booking process (replace with actual Amadeus integration)
    console.log("Simulating flight booking with offer data:", bookingRequest.offer_data);
    
    // For now, we'll simulate a successful booking
    const success = Math.random() > 0.2; // 80% success rate for testing
    
    if (success) {
      // Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: bookingRequest.user_id,
          trip_request_id: bookingRequest.offer_data.trip_request_id || null,
          flight_offer_id: bookingRequest.offer_id,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Update booking request to completed
      await supabase
        .from("booking_requests")
        .update({ 
          status: "done",
          processed_at: new Date().toISOString()
        })
        .eq("id", bookingRequest.id);

      console.log(`✅ Booking request ${bookingRequest.id} completed successfully`);
      return { success: true, bookingId: booking.id };
    } else {
      throw new Error("Simulated booking failure");
    }
  } catch (error) {
    console.error(`❌ Booking request ${bookingRequest.id} failed:`, error);
    
    const retryCount = (bookingRequest.retry_count || 0) + 1;
    const shouldRetry = retryCount < 3;
    
    await supabase
      .from("booking_requests")
      .update({ 
        status: shouldRetry ? "pending_booking" : "failed",
        error: error.message,
        retry_count: retryCount,
        processed_at: new Date().toISOString()
      })
      .eq("id", bookingRequest.id);

    return { success: false, error: error.message, retryCount };
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    console.log("Processing pending booking requests...");
    
    // Get next pending booking request
    const { data: bookingRequests, error } = await supabase
      .from("booking_requests")
      .select("*")
      .eq("status", "pending_booking")
      .lt("retry_count", 3)
      .order("created_at", { ascending: true })
      .limit(5); // Process up to 5 at a time

    if (error) throw error;

    if (!bookingRequests || bookingRequests.length === 0) {
      console.log("No pending booking requests found");
      return new Response(
        JSON.stringify({ message: "No pending requests", processed: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${bookingRequests.length} pending booking requests`);
    const results = [];

    for (const request of bookingRequests) {
      const result = await processBookingRequest(request);
      results.push({ id: request.id, ...result });
      
      // Add delay between requests to avoid overwhelming external APIs
      if (bookingRequests.length > 1) {
        await sleep(1000);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Booking processing completed", 
        processed: results.length,
        results 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("process-booking error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

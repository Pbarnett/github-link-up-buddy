
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { bookWithAmadeus } from "../lib/amadeus.ts";

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

    console.log("Calling Amadeus booking with offer data:", bookingRequest.offer_data);
    
    // Get traveler data from the booking request
    const travelerData = bookingRequest.traveler_data || {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    };
    
    // Call Amadeus booking API
    const amadeusResult = await bookWithAmadeus(bookingRequest.offer_data, travelerData);
    
    if (amadeusResult.success) {
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

      // Send booking confirmation email
      supabase.functions
        .invoke("send-booking-confirmation", { 
          body: { booking_request_id: bookingRequest.id } 
        })
        .catch(console.error);

      console.log(`✅ Booking request ${bookingRequest.id} completed successfully`);
      return { success: true, bookingId: booking.id, amadeusData: amadeusResult };
    } else {
      throw new Error(amadeusResult.error || "Amadeus booking failed");
    }
  } catch (error) {
    console.error(`❌ Booking request ${bookingRequest.id} failed:`, error);
    
    const attempts = (bookingRequest.attempts || 0) + 1;
    const shouldRetry = attempts < 3;
    
    await supabase
      .from("booking_requests")
      .update({ 
        status: shouldRetry ? "pending_booking" : "failed",
        error: error.message,
        attempts: attempts,
        processed_at: new Date().toISOString()
      })
      .eq("id", bookingRequest.id);

    // Send booking failure email if final failure
    if (!shouldRetry) {
      supabase.functions
        .invoke("send-booking-failed", { 
          body: { booking_request_id: bookingRequest.id } 
        })
        .catch(console.error);
    }

    return { success: false, error: error.message, attempts };
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
      .lt("attempts", 3)
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

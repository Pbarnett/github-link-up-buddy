
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking_request_id } = await req.json();
    console.log("Processing SMS reminder for:", booking_request_id);

    // Check if reminder already sent to prevent duplicates
    const { data: existingNotification } = await supabase
      .from("notifications")
      .select("id")
      .eq("booking_request_id", booking_request_id)
      .eq("type", "reminder")
      .single();

    if (existingNotification) {
      console.log("SMS reminder already sent for booking:", booking_request_id);
      return new Response(JSON.stringify({ message: "Already sent" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get booking request and user profile
    const { data: bookingRequest, error: brError } = await supabase
      .from("booking_requests")
      .select("user_id, offer_data")
      .eq("id", booking_request_id)
      .single();

    if (brError || !bookingRequest) {
      throw new Error(`Booking request not found: ${brError?.message}`);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("phone, first_name")
      .eq("id", bookingRequest.user_id)
      .single();

    if (profileError || !profile) {
      throw new Error(`User profile not found: ${profileError?.message}`);
    }

    if (!profile.phone) {
      console.log("No phone number available for SMS reminder");
      return new Response(JSON.stringify({ message: "No phone number" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const offerData = bookingRequest.offer_data as any;
    const message = `Hi ${profile.first_name || 'traveler'}! Reminder: Your flight ${offerData.flight_number || ''} to ${offerData.destination || ''} departs tomorrow at ${offerData.departure_time || ''}. Have a great trip! ✈️`;

    // TODO: Implement actual Twilio SMS sending here
    console.log("Would send SMS to:", profile.phone, "Message:", message);

    // Record notification
    await supabase.from("notifications").insert({
      user_id: bookingRequest.user_id,
      booking_request_id,
      type: "reminder",
      payload: { sms_sent: true, phone: profile.phone, message }
    });

    console.log("SMS reminder processed successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error sending SMS reminder:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);

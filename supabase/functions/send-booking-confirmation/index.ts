
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendEmail } from "../lib/resend.ts";

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
    console.log("Processing booking confirmation for:", booking_request_id);

    // Check if notification already exists to prevent duplicates
    const { data: existingNotification } = await supabase
      .from("notifications")
      .select("id")
      .eq("booking_request_id", booking_request_id)
      .eq("type", "confirmation")
      .single();

    if (existingNotification) {
      console.log("Confirmation email already sent for booking:", booking_request_id);
      return new Response(JSON.stringify({ message: "Already sent" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Fetch booking request and user profile
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
      .select("email, first_name")
      .eq("id", bookingRequest.user_id)
      .single();

    if (profileError || !profile) {
      throw new Error(`User profile not found: ${profileError?.message}`);
    }

    // Load and fill HTML template
    const htmlTemplate = await Deno.readTextFile(
      new URL("../templates/booking-confirmation.html", import.meta.url)
    );

    const offerData = bookingRequest.offer_data as any;
    const filledHtml = htmlTemplate
      .replace("{{destination}}", offerData.destination || "N/A")
      .replace("{{departureDate}}", offerData.departure_date || "N/A")
      .replace("{{departureTime}}", offerData.departure_time || "N/A")
      .replace("{{returnDate}}", offerData.return_date || "N/A")
      .replace("{{flightNumber}}", offerData.flight_number || "N/A")
      .replace("{{airline}}", offerData.airline || "N/A")
      .replace("{{price}}", offerData.price?.toString() || "N/A");

    // Send email via Resend
    await sendEmail({
      to: profile.email,
      subject: "✈️ Your Flight Booking is Confirmed!",
      html: filledHtml,
    });

    // Record notification
    await supabase.from("notifications").insert({
      user_id: bookingRequest.user_id,
      booking_request_id,
      type: "confirmation",
      payload: { email_sent: true, recipient: profile.email }
    });

    console.log("Booking confirmation email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error sending booking confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);


const { createClient } = require("@supabase/supabase-js");

async function main() {
  const supabase = createClient(
    process.env.SUPABASE_URL || "https://bbonngdyfyfjqfhvoljl.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  );

  try {
    console.log("🧪 Testing process-booking function...");

    // 1. Create a test booking request
    console.log("Creating test booking request...");
    const { data: bookingRequest, error: insertError } = await supabase
      .from("booking_requests")
      .insert({
        user_id: "test-user-id",
        offer_id: "test-offer-id",
        offer_data: {
          airline: "Test Airlines",
          flight_number: "TA123",
          price: 299.99,
          departure_date: "2025-06-01",
          return_date: "2025-06-08"
        },
        status: "pending_booking",
        traveler_data: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com"
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ Failed to create test booking request:", insertError);
      return;
    }

    console.log("✅ Test booking request created:", bookingRequest.id);

    // 2. Invoke the process-booking function
    console.log("Invoking process-booking function...");
    const { data: processResult, error: invokeError } = await supabase.functions.invoke("process-booking");

    if (invokeError) {
      console.error("❌ Failed to invoke process-booking:", invokeError);
      return;
    }

    console.log("✅ Process-booking invoked:", processResult);

    // 3. Check the final status
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

    const { data: finalRequest, error: fetchError } = await supabase
      .from("booking_requests")
      .select("*")
      .eq("id", bookingRequest.id)
      .single();

    if (fetchError) {
      console.error("❌ Failed to fetch final status:", fetchError);
      return;
    }

    console.log("📊 Final booking request status:", {
      id: finalRequest.id,
      status: finalRequest.status,
      retry_count: finalRequest.retry_count,
      error: finalRequest.error,
      processed_at: finalRequest.processed_at
    });

    // 4. Check if booking was created (if successful)
    if (finalRequest.status === "done") {
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .select("*")
        .eq("flight_offer_id", bookingRequest.offer_id)
        .single();

      if (booking) {
        console.log("✅ Booking created successfully:", booking.id);
      } else {
        console.log("⚠️ No booking found despite 'done' status");
      }
    }

    // Cleanup
    console.log("Cleaning up test data...");
    await supabase.from("booking_requests").delete().eq("id", bookingRequest.id);
    if (finalRequest.status === "done") {
      await supabase.from("bookings").delete().eq("flight_offer_id", bookingRequest.offer_id);
    }

    console.log("✅ process-booking end-to-end test complete");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

if (require.main === module) {
  main();
}

module.exports = main;

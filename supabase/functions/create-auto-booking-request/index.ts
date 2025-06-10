import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts"; // Assuming shared CORS headers

// Define the expected request body structure
interface AutoBookingRequestPayload {
  trip_request_id: string;
  user_id: string; // Usually derived from JWT, but might be passed if called server-to-server by an admin/system
  criteria: Record<string, any>; // JSONB
  // status is defaulted in DB, price_history defaulted, latest_booking_request_id is nullable
}

// Define the structure of the row to be inserted (subset of table, or use generated types if available)
interface AutoBookingRequestInsert {
  trip_request_id: string;
  user_id: string;
  criteria: Record<string, any>;
  status?: string; // Defaulted in DB
}

serve(async (req: Request) => {
  // Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client (ensure these ENV vars are set in your Supabase project)
    const supabaseClient: SupabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!, // Use ANON_KEY for client-side, or SERVICE_ROLE_KEY if elevated permissions needed AND this function is properly secured
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Get the user from the JWT (if required and using RLS)
    // const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    // if (userError || !user) {
    //   console.error("Error getting user:", userError);
    //   return new Response(JSON.stringify({ error: "Authentication required" }), {
    //     status: 401,
    //     headers: { ...corsHeaders, "Content-Type": "application/json" },
    //   });
    // }

    // Parse the request body
    const payload: AutoBookingRequestPayload = await req.json();

    // Prepare data for insertion
    // For a new request, user_id should ideally come from the authenticated user session,
    // but if it's passed in payload and validated, that's another approach.
    // Here, we assume payload.user_id is provided and validated if necessary.
    const insertData: AutoBookingRequestInsert = {
      trip_request_id: payload.trip_request_id,
      user_id: payload.user_id, // Or user.id from JWT
      criteria: payload.criteria,
      // status will be defaulted by the database
    };

    // Insert data into the auto_booking_requests table
    const { data, error } = await supabaseClient
      .from("auto_booking_requests")
      .insert(insertData)
      .select("id") // Select only the ID of the newly created row
      .single();

    if (error) {
      console.error("Error inserting auto_booking_request:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!data) {
      console.error("No data returned after insert, though no error reported.");
      return new Response(JSON.stringify({ error: "Failed to create record: No data returned" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return a 201 Created response with the ID of the new record
    return new Response(JSON.stringify({ id: data.id }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("Unhandled error in Edge Function:", e);
    return new Response(JSON.stringify({ error: e.message || "An unexpected error occurred" }), {
      status: 500, // Or 400 if it's a payload parsing error
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

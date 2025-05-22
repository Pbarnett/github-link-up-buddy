
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert, Tables } from "@/integrations/supabase/types";
import { TripFormValues, ExtendedTripFormValues, TripRequestResult } from "@/types/form";
import { safeQuery } from "@/lib/supabaseUtils";

/**
 * Create a new trip request in the database
 * @param userId User ID creating the trip
 * @param formData Trip form data
 * @returns Created trip request data
 */
const createTrip = async (
  userId: string, 
  formData: ExtendedTripFormValues
): Promise<Tables<"trip_requests">> => {
  // Create a typed insert object for trip_requests
  const tripRequestData: TablesInsert<"trip_requests"> = {
    user_id: userId,
    earliest_departure: formData.earliestDeparture.toISOString(),
    latest_departure: formData.latestDeparture.toISOString(),
    budget: formData.budget,
    // Include new fields if provided
    departure_airports: formData.departure_airports || [],
    destination_airport: formData.destination_airport || null,
    min_duration: formData.min_duration || 3,
    max_duration: formData.max_duration || 6,
    // Include auto-booking fields
    auto_book_enabled: formData.auto_book_enabled || false,
    max_price: formData.max_price || null,
    preferred_payment_method_id: formData.preferred_payment_method_id || null
  };
  
  // Insert trip request into Supabase with proper types
  const tripRequestResult = await safeQuery<Tables<"trip_requests">>(() =>
    Promise.resolve(
      supabase
        .from("trip_requests")
        .insert(tripRequestData)
        .select()
        .single()
    )
  );
  
  if (tripRequestResult.error) {
    throw new Error(`Failed to submit trip request: ${tripRequestResult.error.message}`);
  }
  
  return tripRequestResult.data as Tables<"trip_requests">;
};

// Function to create trip request
export const createTripRequest = async (
  userId: string, 
  formData: ExtendedTripFormValues
): Promise<TripRequestResult> => {
  // Create the trip request
  const tripRequest = await createTrip(userId, formData);
  
  try {
    // Invoke the flight-search edge function directly for this trip
    const { data: fsData, error: fsError } = await supabase.functions.invoke<{
      requestsProcessed: number;
      matchesInserted: number;
      totalDurationMs: number;
      details: any[];
    }>("flight-search", {
      body: { tripRequestId: tripRequest.id }
    });
    
    if (fsError) {
      console.error("Error invoking flight-search function:", fsError);
    } else {
      console.log("Flight search completed:", fsData);
    }
  } catch (invocationError) {
    console.error("Failed to invoke flight-search function:", invocationError);
    // We don't throw here to allow the flow to continue even if search fails
  }
  
  // Fetch the newly created offers
  const { data: offers, error: offersError } = await supabase
    .from("flight_offers")
    .select("*")
    .eq("trip_request_id", tripRequest.id)
    .order("price", { ascending: true });
  
  if (offersError) {
    console.error("Error fetching offers:", offersError);
  }
  
  return {
    tripRequest,
    offers: offers || [],
    offersCount: offers?.length || 0
  };
};

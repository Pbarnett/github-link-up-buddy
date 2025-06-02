
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert, Tables } from "@/integrations/supabase/types";
import { ExtendedTripFormValues, TripRequestResult } from "@/types/form";
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
    auto_book: formData.auto_book || false,
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
  
  // Invoke the flight-search function and await the results
  console.log(`Invoking flight-search function for trip request ${tripRequest.id}`);
  const { data, error } = await supabase.functions.invoke<{
    offers: TablesInsert<"flight_offers">[];
    matchesInserted: number;
    requestsProcessed: number;
    totalDurationMs: number;
    details: any[];
  }>("flight-search", {
    body: { tripRequestId: tripRequest.id }
  });

  if (error) {
    console.error("Error invoking flight-search function:", error);
  }

  // Return the trip request with any immediate offers from the function
  const offers = data?.offers ?? [];
  const matchesInserted = data?.matchesInserted ?? 0;

  return {
    tripRequest,
    offers,
    matchesInserted
  };
};

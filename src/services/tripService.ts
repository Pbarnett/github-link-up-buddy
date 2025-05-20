
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert, Tables } from "@/integrations/supabase/types";
import { TripFormValues, ExtendedTripFormValues, TripRequestResult } from "@/types/form";
import { generateMockOffers } from "./mockOffers";
import { safeQuery } from "@/lib/supabaseUtils";

// Function to create trip request and related flight offers
export const createTripRequest = async (
  userId: string, 
  formData: ExtendedTripFormValues
): Promise<TripRequestResult> => {
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
    max_duration: formData.max_duration || 6
  };
  
  // Insert trip request into Supabase with proper types
  const tripRequestResult = await safeQuery<Tables<"trip_requests">>(() =>
    supabase
      .from("trip_requests")
      .insert(tripRequestData)
      .select()
      .single()
  );
  
  if (tripRequestResult.error) {
    throw new Error(`Failed to submit trip request: ${tripRequestResult.error.message}`);
  }
  
  const tripRequest = tripRequestResult.data;
  
  // Generate mock offers based on the trip details
  const mockOffers = generateMockOffers({
    ...formData,
    earliestDeparture: formData.earliestDeparture,
    latestDeparture: formData.latestDeparture,
  }, tripRequest.id);
  
  // Store the offers in Supabase and explicitly await the response
  const offersResult = await safeQuery<Tables<"flight_offers">[]>(() => 
    supabase
      .from("flight_offers")
      .insert(mockOffers)
      .select()
  );
  
  if (offersResult.error) {
    throw new Error(`Failed to save flight offers: ${offersResult.error.message}`);
  }
  
  return {
    tripRequest,
    offers: offersResult.data || [],
    offersCount: offersResult.data?.length || 0
  };
};

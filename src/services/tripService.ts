
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert } from "@/integrations/supabase/types";
import { TripFormValues, generateMockOffers } from "./mockOffers";

// Extended trip form values with the new fields
export interface ExtendedTripFormValues extends TripFormValues {
  departure_airports?: string[];
  destination_airport?: string;
  min_duration?: number;
  max_duration?: number;
}

// Interface for trip request creation result
export interface TripRequestResult {
  tripRequest: {
    id: string;
  };
  offers: any[];
  offersCount: number;
}

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
  const { data: tripRequest, error } = await supabase
    .from("trip_requests")
    .insert(tripRequestData)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to submit trip request: ${error.message}`);
  }
  
  // Generate mock offers based on the trip details
  const mockOffers = generateMockOffers(formData, tripRequest.id);
  
  // Store the offers in Supabase and explicitly await the response
  const { data: offersData, error: offersError } = await supabase
    .from("flight_offers")
    .insert(mockOffers)
    .select();
  
  if (offersError) {
    throw new Error(`Failed to save flight offers: ${offersError.message}`);
  }
  
  return {
    tripRequest,
    offers: offersData || [],
    offersCount: offersData?.length || 0
  };
};

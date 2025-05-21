
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert, Tables } from "@/integrations/supabase/types";
import { TripFormValues, ExtendedTripFormValues, TripRequestResult } from "@/types/form";
import { generateMockOffers } from "@/shared/mockOffers";
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

/**
 * Insert flight offers into the database
 * @param offers Array of flight offers to insert
 * @returns Array of inserted offers
 */
const insertOffers = async (offers: TablesInsert<"flight_offers">[]): Promise<Tables<"flight_offers">[]> => {
  // Store the offers in Supabase and explicitly await the response
  const offersResult = await safeQuery<Tables<"flight_offers">[]>(() => 
    Promise.resolve(
      supabase
        .from("flight_offers")
        .insert(offers)
        .select()
    )
  );
  
  if (offersResult.error) {
    throw new Error(`Failed to save flight offers: ${offersResult.error.message}`);
  }
  
  // Ensure we have a proper array even if data is null
  return offersResult.data || [];
};

// Function to create trip request and related flight offers
export const createTripRequest = async (
  userId: string, 
  formData: ExtendedTripFormValues
): Promise<TripRequestResult> => {
  // Create the trip request
  const tripRequest = await createTrip(userId, formData);
  
  // Generate mock offers based on the trip details
  const mockOffers = generateMockOffers({
    earliestDeparture: formData.earliestDeparture,
    latestDeparture: formData.latestDeparture,
    min_duration: formData.min_duration,
    max_duration: formData.max_duration,
    budget: formData.budget
  }, tripRequest.id);
  
  // Insert the offers into the database
  const offers = await insertOffers(mockOffers);
  
  return {
    tripRequest,
    offers,
    offersCount: offers.length
  };
};

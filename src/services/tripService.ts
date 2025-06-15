
import { supabase } from "@/integrations/supabase/client";
import { TripRequestFromDB } from "@/hooks/useTripOffers";
import { ExtendedTripFormValues } from "@/types/form";
import { toast } from "@/components/ui/use-toast";
import { PostgrestError } from "@supabase/supabase-js";
import logger from "@/lib/logger";

/**
 * Fetch a trip request by id.
 */
export async function fetchTripRequest(tripRequestId: string): Promise<TripRequestFromDB | null> {
  const { data, error } = await supabase
    .from("trip_requests")
    .select("*")
    .eq("id", tripRequestId)
    .maybeSingle<TripRequestFromDB>();

  if (error) {
    logger.error("Error fetching trip details:", { tripRequestId, error });
    toast({
      title: "Error fetching trip details",
      description: error.message || "Failed to load trip details.",
      variant: "destructive",
    });
    return null;
  }
  return data || null;
}

/**
 * Create a new trip request.
 */
export async function createTripRequest(
  userId: string, 
  formData: ExtendedTripFormValues
): Promise<TripRequestFromDB> {
  const tripRequestData = {
    user_id: userId,
    destination_airport: formData.destination_airport,
    destination_location_code: formData.destination_airport,
    departure_airports: formData.departure_airports || [],
    earliest_departure: formData.earliestDeparture.toISOString(),
    latest_departure: formData.latestDeparture.toISOString(),
    min_duration: formData.min_duration,
    max_duration: formData.max_duration,
    budget: formData.budget,
    nonstop_required: formData.nonstop_required ?? true,
    baggage_included_required: formData.baggage_included_required ?? false,
    auto_book_enabled: formData.auto_book_enabled ?? false,
    max_price: formData.max_price,
    preferred_payment_method_id: formData.preferred_payment_method_id,
  };
  const { data, error } = await supabase
    .from("trip_requests")
    .insert([tripRequestData])
    .select()
    .single<TripRequestFromDB>();

  if (error) throw error;
  if (!data) throw new Error("Failed to create trip request or retrieve its data.");
  return data;
}

/**
 * Update a trip request.
 */
export async function updateTripRequest(
  userId: string,
  tripRequestId: string,
  formData: ExtendedTripFormValues
): Promise<TripRequestFromDB> {
  const tripRequestData = {
    destination_airport: formData.destination_airport,
    destination_location_code: formData.destination_airport,
    departure_airports: formData.departure_airports || [],
    earliest_departure: formData.earliestDeparture.toISOString(),
    latest_departure: formData.latestDeparture.toISOString(),
    min_duration: formData.min_duration,
    max_duration: formData.max_duration,
    budget: formData.budget,
    nonstop_required: formData.nonstop_required ?? true,
    baggage_included_required: formData.baggage_included_required ?? false,
    auto_book_enabled: formData.auto_book_enabled ?? false,
    max_price: formData.max_price,
    preferred_payment_method_id: formData.preferred_payment_method_id,
  };
  const { data, error } = await supabase
    .from("trip_requests")
    .update(tripRequestData)
    .eq("id", tripRequestId)
    .select()
    .single<TripRequestFromDB>();

  if (error) throw error;
  if (!data) throw new Error("Failed to update trip request or retrieve its data.");
  return data;
}

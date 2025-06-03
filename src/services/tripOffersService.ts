
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types"; // Assuming this provides DB table types

// Type representing a row from the 'flight_offers' table in the database
// If Tables<'flight_offers'> is not precise enough or available, define manually:
// export type FlightOfferFromDB = {
//   id: string;
//   created_at?: string;
//   trip_request_id: string;
//   departure_airport: string | null; // Renamed from origin_airport for clarity if DB uses this
//   arrival_airport: string | null;   // Renamed from destination_airport for clarity
//   departure_date: string;
//   departure_time: string;
//   return_date: string;
//   return_time: string;
//   price: number | string; // Price might be string from some APIs/DBs
//   airline: string | null;
//   flight_number: string | null; // Or flight_numbers: string[] | null
//   duration: string | null; // e.g., "PT5H30M" or "5h 30m"
//   booking_url: string | null;
//   carrier_code: string | null;
//   // Add any other fields that are directly from the DB table
// };
// For now, we'll assume Tables<'flight_offers'> from supabase/types.ts is sufficient.
// If not, the manual definition above would be a good starting point.
export type FlightOfferFromDB = Tables<'flight_offers'>;


// Application-specific Offer type, derived from DB type but can be shaped for UI needs
export interface Offer {
  id: string;
  trip_request_id: string; // Keep if needed by UI/logic, often it is
  price: number;
  airline: string | null;
  flight_number: string | null; // Consider if this should be flight_numbers: string[]
  departure_date: string;
  departure_time: string;
  origin_airport: string | null; // Airport code for departure
  return_date: string;
  return_time: string;
  arrival_airport: string | null; // Airport code for arrival (of the outbound leg's destination)
  duration: string | null; // Formatted duration string, e.g., "5h 30m"
  booking_url?: string | null;
  carrier_code?: string | null; // Typically the airline operating the flight
  // Any other transformed or added fields for UI display
}

export const fetchTripOffers = async (tripId: string): Promise<Offer[]> => {
  try {
    const { data, error } = await supabase
      .from("flight_offers")
      .select("*") // Select all columns to match FlightOfferFromDB
      .eq("trip_request_id", tripId);
    
    if (error) {
      console.error("Error fetching trip offers:", error);
      throw error; // Re-throw to be handled by the calling code (e.g., in useTripOffers)
    }
    
    if (!data) { // data can be null if error, or empty array if no offers
      console.log("No offers data returned for trip ID:", tripId);
      return [];
    }
    
    // Map the database response to our application's Offer interface
    return data.map((item: FlightOfferFromDB): Offer => {
      // Ensure all fields in 'Offer' are mapped correctly from 'FlightOfferFromDB'
      // Handle potential nulls and type conversions (e.g., price)
      return {
        id: item.id,
        trip_request_id: item.trip_request_id,
        price: typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price),
        airline: item.airline,
        flight_number: item.flight_number,
        departure_date: item.departure_date,
        departure_time: item.departure_time,
        origin_airport: item.departure_airport, // Mapping from DB's departure_airport
        return_date: item.return_date,
        return_time: item.return_time,
        arrival_airport: item.arrival_airport, // Mapping from DB's arrival_airport
        duration: item.duration, // Assuming duration is already in a displayable format or needs further processing
        booking_url: item.booking_url,
        carrier_code: item.carrier_code,
      };
    });
  } catch (error) {
    console.error("Error in fetchTripOffers:", error);
    // It's often better to let the caller handle the error and decide on UI resilience.
    // For example, useTripOffers can catch this and set an error state.
    throw error; // Re-throwing the error
  }
};

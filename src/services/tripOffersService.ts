
import { supabase } from "@/integrations/supabase/client";

export interface Offer {
  id: string;
  price: number;
  airline: string;
  flight_number: string;
  departure_date: string;
  departure_time: string;
  return_date: string;
  return_time: string;
  duration: string;
  booking_url?: string;
  // Enhanced fields for better display
  carrier_code?: string;
  origin_airport?: string;
  destination_airport?: string;
}

export const fetchTripOffers = async (tripId: string): Promise<Offer[]> => {
  try {
    // Fetch real offers from the database for this trip
    const { data, error } = await supabase
      .from("flight_offers")
      .select("*")
      .eq("trip_request_id", tripId);
    
    if (error) {
      console.error("Error fetching trip offers:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No offers found for trip ID:", tripId);
      return [];
    }
    
    // Map the database response to our Offer interface
    return data.map((item: any) => ({
      id: item.id,
      price: Number(item.price),
      airline: item.airline,
      flight_number: item.flight_number,
      departure_date: item.departure_date,
      departure_time: item.departure_time,
      return_date: item.return_date,
      return_time: item.return_time,
      duration: item.duration,
      booking_url: item.booking_url,
      carrier_code: item.carrier_code,
      origin_airport: item.origin_airport,
      destination_airport: item.destination_airport,
    }));
  } catch (error) {
    console.error("Error in fetchTripOffers:", error);
    // Return an empty array rather than throwing to make the UI more resilient
    return [];
  }
};

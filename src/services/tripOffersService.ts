
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
  auto_book: boolean;
  booking_url: string | null;
  stops: number;
  layover_airports: string[] | null;
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
      auto_book: item.auto_book,
      booking_url: item.booking_url,
      stops: item.stops,
      layover_airports: item.layover_airports,
    }));
  } catch (error) {
    console.error("Error in fetchTripOffers:", error);
    // Return an empty array rather than throwing to make the UI more resilient
    return [];
  }
};

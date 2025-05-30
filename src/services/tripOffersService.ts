
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
}

export const fetchTripOffers = async (
  tripId: string,
  page: number = 0,
  pageSize: number = 20
): Promise<{ offers: Offer[]; total: number }> => {
  try {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("flight_offers")
      .select("*", { count: "exact" })
      .eq("trip_request_id", tripId)
      .order("price", { ascending: true })
      .range(from, to);
    
    if (error) {
      console.error("Error fetching trip offers:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No offers found for trip ID:", tripId);
      return { offers: [], total: 0 };
    }

    const offers = data.map((item: any) => ({
      id: item.id,
      price: Number(item.price),
      airline: item.airline,
      flight_number: item.flight_number,
      departure_date: item.departure_date,
      departure_time: item.departure_time,
      return_date: item.return_date,
      return_time: item.return_time,
      duration: item.duration,
    }));

    return { offers, total: count || offers.length };
  } catch (error) {
    console.error("Error in fetchTripOffers:", error);
    // Return an empty array rather than throwing to make the UI more resilient
    return { offers: [], total: 0 };
  }
};


import { TablesInsert } from "@/integrations/supabase/types";

export interface FlightSearchParams {
  origin: string[];
  destination: string | null;
  earliestDeparture: Date;
  latestDeparture: Date;
  minDuration: number;
  maxDuration: number;
  budget: number;
}

// Client-side version doesn't need token management or direct API calls
// since those happen in the edge function

// Export only the transform function for testing purposes
export function transformAmadeusToOffers(api: any, tripRequestId: string): TablesInsert<"flight_offers">[] {
  // Handle empty response
  if (!api.data || !Array.isArray(api.data) || api.data.length === 0) {
    return [];
  }
  
  return api.data.flatMap((offer: any) => {
    try {
      const out = offer.itineraries[0].segments[0];
      const back = offer.itineraries[1]?.segments.slice(-1)[0] ?? out;
      
      return [{
        trip_request_id: tripRequestId,
        airline: out.carrierCode,
        flight_number: out.number,
        departure_date: out.departure.at.split("T")[0],
        departure_time: out.departure.at.split("T")[1].slice(0,5),
        return_date: back.arrival.at.split("T")[0],
        return_time: back.arrival.at.split("T")[1].slice(0,5),
        duration: offer.itineraries[0].duration,
        price: parseFloat(offer.price.total),
      }];
    } catch (err) {
      console.error("Error transforming Amadeus offer:", err);
      return []; // Skip this offer if transformation fails
    }
  });
}

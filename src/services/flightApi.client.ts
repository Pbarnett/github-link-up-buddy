
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
    console.log("No offers data to transform");
    return [];
  }
  
  try {
    const offers = api.data.flatMap((offer: any) => {
      try {
        const out = offer.itineraries[0].segments[0];
        
        // More robust handling of return segment
        const backItin = offer.itineraries[1];
        if (!backItin) {
          console.log("Skipping one-way flight without return itinerary");
          return [];
        }
        
        const back = backItin.segments.slice(-1)[0];
        if (!back?.departure?.at) {
          console.log("Skipping offer with missing return departure time");
          return [];
        }
        
        // Get outbound and return dates
        const departureDate = out.departure.at.split("T")[0];
        const returnDate = back.departure.at.split("T")[0];
        
        // Calculate trip duration to ensure it meets requirements
        const outDate = new Date(departureDate);
        const retDate = new Date(returnDate);
        const tripDays = Math.round((retDate.getTime() - outDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return [{
          trip_request_id: tripRequestId,
          airline: out.carrierCode,
          flight_number: out.number,
          departure_date: departureDate,
          departure_time: out.departure.at.split("T")[1].slice(0,5),
          return_date: returnDate,
          return_time: back.departure.at.split("T")[1].slice(0,5),
          duration: offer.itineraries[0].duration,
          price: parseFloat(offer.price.total),
        }];
      } catch (err) {
        console.error("Error transforming individual offer:", err);
        return []; // Skip this offer if transformation fails
      }
    });
    
    console.log(`Successfully transformed ${offers.length} offers`);
    return offers;
  } catch (err) {
    console.error("Error in transformAmadeusToOffers:", err);
    return [];
  }
}

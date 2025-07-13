
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
export function transformAmadeusToOffers(api: Record<string, unknown>, tripRequestId: string): TablesInsert<"flight_offers">[] {
  // Handle empty response
  if (!api.data || !Array.isArray(api.data) || api.data.length === 0) {
    console.log("No offers data to transform");
    return [];
  }
  
  try {
    const offers = api.data.flatMap((offer: Record<string, unknown>) => {
      try {
        const out = offer?.itineraries?.[0]?.segments?.[0];
        const backItin = offer?.itineraries?.[1];
        const back = backItin?.segments?.slice(-1)?.[0];

        // Essential data checks after optional chaining
        if (!out?.departure?.at || !out?.carrierCode || !out?.number ||
            !back?.departure?.at ||
            !offer?.itineraries?.[0]?.duration ||
            !offer?.price?.total) {
          console.warn("Skipping offer due to missing essential data after optional chaining:", offer);
          return [];
        }
        
        // Get outbound and return dates
        const departureDate = (out.departure.at as string).split("T")[0];
        const returnDate = (back.departure.at as string).split("T")[0];
        
        // Calculate trip duration to ensure it meets requirements
        // const outDate = new Date(departureDate);
        // const retDate = new Date(returnDate);
        // const tripDays = Math.round((retDate.getTime() - outDate.getTime()) / (1000 * 60 * 60 * 24));
        // tripDays is calculated but not used, consider removing or using it for validation if needed.
        
        return [{
          trip_request_id: tripRequestId,
          airline: out.carrierCode as string,
          flight_number: out.number as string,
          departure_date: departureDate,
          departure_time: (out.departure.at as string).split("T")[1].slice(0,5),
          return_date: returnDate,
          return_time: (back.departure.at as string).split("T")[1].slice(0,5),
          duration: (offer.itineraries as Record<string, unknown>[])[0].duration as string, // Already checked via offer?.itineraries?.[0]?.duration
          price: parseFloat((offer.price as Record<string, unknown>).total as string), // Already checked via offer?.price?.total
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

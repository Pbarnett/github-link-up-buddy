import * as React from 'react';
import { TablesInsert } from '@/integrations/supabase/types';
export interface FlightSearchParams {
  origin: string[];
  destination: string | null;
  earliestDeparture: Date;
  latestDeparture: Date;
  minDuration: number;
  maxDuration: number;
  budget: number;
}

// Define interfaces for Amadeus API response structure
interface AmadeusSegment {
  departure: {
    at: string;
  };
  carrierCode: string;
  number: string;
}

interface AmadeusItinerary {
  segments: AmadeusSegment[];
  duration: string;
}

interface AmadeusOffer {
  itineraries: AmadeusItinerary[];
  price: {
    total: string;
  };
}

interface AmadeusResponse {
  data: AmadeusOffer[];
}

// Type guard function to check if an object is an AmadeusOffer
function isAmadeusOffer(obj: any): obj is AmadeusOffer {
  return (
    obj &&
    Array.isArray(obj.itineraries) &&
    obj.itineraries.length > 0 &&
    obj.price &&
    typeof obj.price.total === 'string'
  );
}

// Client-side version doesn't need token management or direct API calls
// since those happen in the edge function

// Export only the transform function for testing purposes
export function transformAmadeusToOffers(
  api: AmadeusResponse | Record<string, unknown>,
  tripRequestId: string
): TablesInsert<'flight_offers'>[] {
  // Handle empty response
  if (!api.data || !Array.isArray(api.data) || api.data.length === 0) {
    console.log('No offers data to transform');
    return [];
  }

  try {
    const offers = api.data.flatMap(
      (offer: AmadeusOffer | Record<string, unknown>) => {
        try {
          // Type guard to check if offer has the expected structure
          if (!isAmadeusOffer(offer)) {
            console.warn('Skipping offer due to invalid structure:', offer);
            return [];
          }

          const out = offer.itineraries?.[0]?.segments?.[0];
          const backItin = offer.itineraries?.[1];
          const back = backItin?.segments?.slice(-1)?.[0];

          // Essential data checks after optional chaining
          if (
            !out?.departure?.at ||
            !out?.carrierCode ||
            !out?.number ||
            !back?.departure?.at ||
            !offer.itineraries?.[0]?.duration ||
            !offer.price?.total
          ) {
            console.warn(
              'Skipping offer due to missing essential data:',
              offer
            );
            return [];
          }

          // Get outbound and return dates
          const departureDate = out.departure.at.split('T')[0];
          const returnDate = back.departure.at.split('T')[0];

          return [
            {
              trip_request_id: tripRequestId,
              airline: out.carrierCode,
              flight_number: out.number,
              departure_date: departureDate,
              departure_time: out.departure.at.split('T')[1].slice(0, 5),
              return_date: returnDate,
              return_time: back.departure.at.split('T')[1].slice(0, 5),
              duration: offer.itineraries[0].duration,
              price: parseFloat(offer.price.total),
            },
          ];
        } catch (err) {
          console.error('Error transforming individual offer:', err);
          return []; // Skip this offer if transformation fails
        }
      }
    );

    console.log(`Successfully transformed ${offers.length} offers`);
    return offers;
  } catch (err) {
    console.error('Error in transformAmadeusToOffers:', err);
    return [];
  }
}

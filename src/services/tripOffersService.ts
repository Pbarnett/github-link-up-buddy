
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Type for flight offers from the database
export type Offer = Tables<'flight_offers'> & {
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
  carrier_code?: string;
  origin_airport?: string;
  destination_airport?: string;
};

/**
 * Fetches all flight offers for a given trip request ID
 * @param tripRequestId - The UUID of the trip request
 * @returns Promise<Offer[]> - Array of flight offers
 */
export async function fetchTripOffers(tripRequestId: string): Promise<Offer[]> {
  console.log('[🔍 DB-DEBUG] Fetching trip offers for tripRequestId:', tripRequestId);
  
  const { data, error } = await supabase
    .from('flight_offers')
    .select('*')
    .eq('trip_request_id', tripRequestId)
    .order('price', { ascending: true });

  console.log('[🔍 DB-DEBUG] Raw database response:', { data, error, count: data?.length || 0 });

  if (error) {
    console.error('[🔍 DB-DEBUG] Error fetching trip offers:', error);
    throw new Error(`Failed to fetch trip offers: ${error.message}`);
  }

  const offers = (data || []) as Offer[];
  console.log(`[🔍 DB-DEBUG] Successfully fetched ${offers.length} offers from database`);
  
  // Log first few offers for debugging
  if (offers.length > 0) {
    console.log('[🔍 DB-DEBUG] Sample offers:', offers.slice(0, 3));
  }

  return offers;
}

/**
 * Creates a new flight offer
 * @param offer - The offer data to create
 * @returns Promise<Offer> - The created offer
 */
export async function createTripOffer(offer: Omit<Offer, 'id' | 'created_at'>): Promise<Offer> {
  const { data, error } = await supabase
    .from('flight_offers')
    .insert([offer])
    .select()
    .single();

  if (error) {
    console.error('Error creating trip offer:', error);
    throw new Error(`Failed to create trip offer: ${error.message}`);
  }

  return data as Offer;
}

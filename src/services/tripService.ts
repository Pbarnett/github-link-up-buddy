import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TablesInsert, Tables } from '@/integrations/supabase/types';
import { ExtendedTripFormValues, TripRequestResult } from '@/types/form';
import { safeQuery } from '@/lib/supabaseUtils';
import { toast } from '@/hooks/use-toast';
/**
 * Create a new trip request in the database
 * @param userId User ID creating the trip
 * @param formData Trip form data
 * @returns Created trip request data
 */
const createTrip = async (
  userId: string,
  formData: ExtendedTripFormValues
): Promise<Tables<'trip_requests'>> => {
  // Create a typed insert object for trip_requests
  // Calculate departure and return dates for tripService
  const departureDate = formData.earliestDeparture.toISOString().split('T')[0];
  const returnDate =
    formData.returnDate ||
    new Date(
      formData.earliestDeparture.getTime() +
        formData.min_duration * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split('T')[0];

  const tripRequestData: TablesInsert<'trip_requests'> = {
    user_id: userId,
    earliest_departure: formData.earliestDeparture.toISOString(),
    latest_departure: formData.latestDeparture.toISOString(),
    departure_date: departureDate, // ✅ FIX: Add departure_date
    return_date: returnDate, // ✅ FIX: Add return_date
    budget: formData.budget,
    // Include new fields if provided
    departure_airports: formData.departure_airports || [],
    destination_airport: formData.destination_airport || null,
    destination_location_code:
      formData.destination_airport || formData.destination_location_code || '',
    min_duration: formData.min_duration || 3,
    max_duration: formData.max_duration || 6,
    // Filter preferences
    nonstop_required: formData.nonstop_required ?? true,
    baggage_included_required: formData.baggage_included_required ?? false,
    // Include auto-booking fields
    auto_book_enabled: formData.auto_book_enabled || false,
    max_price: formData.max_price || null,
    preferred_payment_method_id: formData.preferred_payment_method_id || null,
  };

  console.log('[TripService] Creating trip with payload:', {
    departureDate: tripRequestData.departure_date,
    returnDate: tripRequestData.return_date,
    isRoundTrip: !!tripRequestData.return_date,
  });

  // Insert trip request into Supabase with proper types
  const { data: tripRequestResult, error: tripRequestError } = await supabase
    .from('trip_requests')
    .insert(tripRequestData)
    .select()
    .single();

  if (tripRequestError) {
    throw new Error(
      `Failed to submit trip request: ${tripRequestError.message}`
    );
  }

  return tripRequestResult as unknown as Tables<'trip_requests'>;
};

// Function to create trip request
export const createTripRequest = async (
  userId: string,
  formData: ExtendedTripFormValues
): Promise<TripRequestResult> => {
  // Create the trip request
  const tripRequest = await createTrip(userId, formData);

  try {
    // Invoke the NEW flight-search-v2 edge function with real Amadeus integration
    console.log(
      `Invoking flight-search-v2 function for trip request ${tripRequest.id}`
    );
    const { data: fsData, error: fsError } = await supabase.functions.invoke(
      'flight-search-v2',
      {
        body: { tripRequestId: tripRequest.id },
      }
    );

    if (fsError) {
      console.error('Error invoking flight-search-v2 function:', fsError);
    } else {
      console.log('Flight search completed:', fsData);
      // Show information about the search results
      const typedFsData = fsData as { inserted: number; message: string };
      if (typedFsData.inserted > 0) {
        toast({
          title: 'Flight search completed',
          description: `Found ${typedFsData.inserted} flight offers from Amadeus API`,
        });
      } else {
        toast({
          title: 'Flight search completed',
          description:
            'No flights found for your criteria. Try adjusting your search parameters.',
          variant: 'default',
        });
      }
    }
  } catch (invocationError) {
    console.error('Failed to invoke flight-search function:', invocationError);
    // We don't throw here to allow the flow to continue even if search fails
    toast({
      title: 'Warning',
      description:
        "We couldn't search for flights automatically. Please refresh the offers page.",
      variant: 'destructive',
    });
  }

  // Fetch the newly created offers from the new V2 table with round-trip filtering
  let offersQuery = supabase
    .from('flight_offers_v2')
    .select('*')
    .eq('trip_request_id', tripRequest.id);

  // Apply round-trip filtering if this was a round-trip request
  if (formData.returnDate) {
    console.log('[TripService] Applying round-trip filter for offers fetch');
    offersQuery = offersQuery.not('return_dt', 'is', null);
  }

  const offersQueryWithOrder = offersQuery.order('price_total', {
    ascending: true,
  });
  const { data: offers, error: offersError } =
    await (offersQueryWithOrder as any);

  if (offersError) {
    console.error('Error fetching offers:', offersError);
  }

  return {
    tripRequest,
    offers: offers || [],
    offersCount: offers?.length || 0,
  };
};

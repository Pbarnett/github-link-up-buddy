import { createClient } from '@supabase/supabase-js';

// Get environment variables from .env file
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
  console.error('You can run this script with:');
  console.error(
    'VITE_SUPABASE_URL=your_url VITE_SUPABASE_ANON_KEY=your_key ts-node src/debug/checkFlightOffers.ts your-trip-id'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkFlightOffers(tripId: string) {
  console.log('Checking flight offers for trip:', tripId);

  try {
    // First check if trip exists
    const { data: trip, error: tripError } = await supabase
      .from('trip_requests')
      .select('*')
      .eq('id', tripId)
      .single();

    if (tripError) {
      console.error('Error fetching trip:', tripError);
      return;
    }

    console.log('Found trip:', trip);

    // Now check for offers
    const {
      data: offers,
      error: offersError,
      count,
    } = await supabase
      .from('flight_offers')
      .select('*', { count: 'exact' })
      .eq('trip_request_id', tripId);

    if (offersError) {
      console.error('Error fetching offers:', offersError);
      return;
    }

    console.log('Offers found:', {
      count,
      offersCount: offers?.length || 0,
      firstOffer: offers?.[0],
    });
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Example usage:
const tripId = process.argv[2];
if (!tripId) {
  console.error('Please provide a trip ID');
  process.exit(1);
}

checkFlightOffers(tripId);

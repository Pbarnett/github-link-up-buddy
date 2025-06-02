import { test, expect } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

test('flight offers flow', async () => {
  // Create a test trip request
  const { data: tripRequest, error: tripError } = await supabase
    .from('trip_requests')
    .insert({
      user_id: 'test-user',
      earliest_departure: '2025-07-01',
      latest_departure: '2025-07-10',
      destination_airport: 'LHR',
      departure_airports: ['JFK'],
      min_duration: 5,
      max_duration: 10,
      budget: 2000
    })
    .select()
    .single();

  expect(tripError).toBeNull();
  expect(tripRequest).not.toBeNull();

  // Wait for flight search to complete and offers to be inserted
  const maxWaitTime = 60000; // 60 seconds
  const startTime = Date.now();
  let offersFound = false;

  while (!offersFound && Date.now() - startTime < maxWaitTime) {
    const { data: offers, error: offersError } = await supabase
      .from('flight_offers')
      .select('*')
      .eq('trip_request_id', tripRequest.id);

    expect(offersError).toBeNull();
    
    if (offers && offers.length > 0) {
      offersFound = true;
      expect(offers[0]).toHaveProperty('price');
      expect(offers[0]).toHaveProperty('airline');
      break;
    }

    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before next check
  }

  expect(offersFound).toBe(true);
});


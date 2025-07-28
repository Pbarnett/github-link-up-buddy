// Integration Test: GDPR Delete-User Function
// Tests the deletion of user data compliant with GDPR using the Edge Function

import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { describe, it, beforeAll } from "https://deno.land/std@0.208.0/testing/bdd.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const TEST_USER_ID = 'test-user-id';

// Initialize Supabase client with service role for testing
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function setupDummyUser() {
  // Create a dummy user with some associated data
  await supabaseClient.from('auth.users').insert({
    id: TEST_USER_ID,
    email: 'test@example.com',
    email_confirmed_at: new Date().toISOString()
  });
  await supabaseClient.from('flight_offers').insert({
    user_id: TEST_USER_ID,
    offer_id: 'test-offer-id',
    status: 'active'
  });
  await supabaseClient.from('flight_bookings').insert({
    user_id: TEST_USER_ID,
    booking_id: 'test-booking-id',
    status: 'confirmed'
  });
  await supabaseClient.from('encrypted_passenger_profiles').insert({
    user_id: TEST_USER_ID,
    encrypted_first_name: '\xDEADBEEF' -- An example encryption
  });
}

describe('GDPR Delete-User Function', () => {
  beforeAll(async () => {
    await setupDummyUser();
  });

  it('should delete user data', async () => {
    // Call the GDPR delete-user function
    const response = await fetch(`${Deno.env.get('SUPABASE_FUNCTION_URL')}/gdpr-delete-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` 
      },
      body: JSON.stringify({ userId: TEST_USER_ID })
    });

    assertEquals(response.status, 200);
    const { success } = await response.json();
    assertEquals(success, true);

    // Verify that user data has been deleted
    const { data: offers, error: offerError } = await supabaseClient.from('flight_offers').select('*').eq('user_id', TEST_USER_ID);
    const { data: bookings, error: bookingError } = await supabaseClient.from('flight_bookings').select('*').eq('user_id', TEST_USER_ID);
    const { data: profiles, error: profileError } = await supabaseClient.from('encrypted_passenger_profiles').select('*').eq('user_id', TEST_USER_ID);

    assertEquals(offers.length, 0, 'Flight offers should be deleted');
    assertEquals(bookings.length, 0, 'Flight bookings should be deleted');
    assertEquals(profiles.length, 0, 'Passenger profiles should be deleted');
  });
});


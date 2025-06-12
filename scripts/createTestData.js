import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient('https://bbonngdyfyfjqfhvoljl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib25uZ2R5ZnlmanFmaHZvbGpsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI1MTk1NCwiZXhwIjoyMDYyODI3OTU0fQ.zrhXOjjMK2pX154UeLiKM8-iRvuVzVA8cGne8LTVrqE');

try {
  // First, let's create a test user in auth.users if needed
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: 'test-phase4@example.com',
    password: 'testpassword123',
    email_confirm: true,
    user_metadata: {
      first_name: 'Test',
      last_name: 'Phase4'
    }
  });
  
  if (authError) {
    console.error('Error creating auth user:', authError.message);
    process.exit(1);
  }
  
  console.log('Created auth user:', authUser.user.id);
  
  // Now create the trip request
  const testTripRequest = {
    user_id: authUser.user.id,
    destination_airport: 'LAX',
    departure_airports: ['SFO'],
    earliest_departure: '2025-07-01T10:00:00Z',
    latest_departure: '2025-07-03T18:00:00Z',
    budget: 500.00
  };
  
  const { data, error } = await supabase.from('trip_requests').insert(testTripRequest).select().single();
  if (error) throw error;
  
  console.log('Created test trip request with ID:', data.id);
  process.stdout.write(data.id); // Output just the ID for easy capture
} catch (err) {
  console.error('Error:', err.message);
}


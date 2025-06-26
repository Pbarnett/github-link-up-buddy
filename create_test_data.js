import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTestData() {
  try {
    // Create test user first
    console.log('Creating test user...')
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'testpass123',
      email_confirm: true,
      user_metadata: {
        name: 'Test User'
      }
    })
    
    if (userError && !userError.message.includes('already exists')) {
      console.error('Error creating user:', userError)
      return
    }
    
    const userId = user?.user?.id || '123e4567-e89b-12d3-a456-426614174000'
    console.log('User ID:', userId)

    // Create test trip requests
    console.log('Creating test trip requests...')
    
    const testTrips = [
      {
        id: '02a4b42e-5691-4c37-ac7e-f220e2e74ed8',
        user_id: userId,
        earliest_departure: '2025-07-15T00:00:00Z',
        latest_departure: '2025-07-16T23:59:59Z',
        departure_date: '2025-07-15',
        return_date: '2025-07-18',
        min_duration: 3,
        max_duration: 7,
        budget: 1000,
        max_price: 1000,
        origin_location_code: 'NYC',
        departure_airports: ['JFK', 'LGA'],
        destination_airport: 'LAX',
        destination_location_code: 'LAX',
        nonstop_required: false,
        baggage_included_required: false,
        auto_book_enabled: false
      },
      {
        id: 'ba85c75a-3087-4141-bccf-d636f77fffbc',
        user_id: userId,
        earliest_departure: '2025-07-15T00:00:00Z',
        latest_departure: '2025-07-16T23:59:59Z',
        departure_date: '2025-07-15',
        return_date: '2025-07-18',
        min_duration: 3,
        max_duration: 7,
        budget: 1000,
        max_price: 1000,
        origin_location_code: 'NYC',
        departure_airports: ['JFK'],
        destination_airport: 'LHR',
        destination_location_code: 'LHR',
        nonstop_required: true,
        baggage_included_required: true,
        auto_book_enabled: false
      }
    ]

    for (const trip of testTrips) {
      const { data, error } = await supabase
        .from('trip_requests')
        .upsert(trip)
        .select()

      if (error) {
        console.error(`Error creating trip ${trip.id}:`, error)
      } else {
        console.log(`Created trip: ${trip.id} -> ${trip.destination_location_code}`)
      }
    }

    // Verify the data
    const { data: trips, error: fetchError } = await supabase
      .from('trip_requests')
      .select('id, destination_location_code, departure_date, return_date')
      .in('id', ['02a4b42e-5691-4c37-ac7e-f220e2e74ed8', 'ba85c75a-3087-4141-bccf-d636f77fffbc'])

    if (fetchError) {
      console.error('Error fetching trips:', fetchError)
    } else {
      console.log('Test trips created successfully:')
      console.table(trips)
    }

  } catch (error) {
    console.error('Script error:', error)
  }
}

createTestData()

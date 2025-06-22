-- Create a test trip that matches the V2 mock data
-- This will work with the mock Amadeus data in flight-search-v2

-- Insert a test trip request that matches mock route: JFK ↔ LHR
INSERT INTO trip_requests (
    id,
    user_id,
    earliest_departure,
    latest_departure,
    budget,
    origin_location_code,
    destination_location_code,
    departure_date,
    return_date,
    adults
) VALUES (
    'mock-test-trip-jfk-lhr',
    '00000000-0000-0000-0000-000000000000', -- Placeholder user ID
    '2024-12-01 00:00:00+00',
    '2024-12-02 23:59:59+00',
    1000,
    'NYC',
    'LHR',
    '2024-12-01',
    '2024-12-10',
    1
) ON CONFLICT (id) DO NOTHING;

-- The mock will create offers for JFK→LHR route when this trip is searched

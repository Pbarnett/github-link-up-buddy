-- Create a test trip that matches the V2 mock data
-- This will work with the mock Amadeus data in flight-search-v2

-- First, ensure we have a test user
INSERT INTO auth.users (
    id,
    email,
    created_at
) VALUES (
    '123e4567-e89b-12d3-a456-426614174000',
    'test@example.com',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert a test trip request that matches mock route: JFK ↔ LHR
INSERT INTO trip_requests (
    id,
    user_id,
    earliest_departure,
    latest_departure,
    min_duration,
    max_duration,
    budget,
    origin_location_code,
    destination_airport,
    destination_location_code,
    nonstop_required,
    baggage_included_required,
    created_at
) VALUES (
    'ba85c75a-3087-4141-bccf-d636f77fffbc',
    '123e4567-e89b-12d3-a456-426614174000',
    '2024-06-15 00:00:00+00',
    '2024-06-16 23:59:59+00',
    1,
    3,
    500,
    'NYC',
    'LHR',
    'LHR',
    true,
    true,
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert test flight offer for the V2 table
INSERT INTO flight_offers_v2 (
    trip_request_id,
    mode,
    price_total,
    price_currency,
    price_carry_on,
    bags_included,
    cabin_class,
    nonstop,
    origin_iata,
    destination_iata,
    depart_dt,
    return_dt,
    seat_pref,
    created_at
) VALUES (
    'ba85c75a-3087-4141-bccf-d636f77fffbc',
    'AUTO',
    485.50,
    'USD',
    35.00,
    true,
    'ECONOMY',
    true,
    'JFK',
    'LHR',
    '2024-06-15T10:00:00Z',
    '2024-06-16T14:00:00Z',
    'WINDOW',
    NOW()
) ON CONFLICT DO NOTHING;

-- The mock will create offers for JFK→LHR route when this trip is searched

-- Insert test trip request with current dates
INSERT INTO trip_requests (
    id,
    user_id,
    earliest_departure,
    latest_departure,
    departure_date,
    return_date,
    min_duration,
    max_duration,
    budget,
    max_price,
    origin_location_code,
    departure_airports,
    destination_airport,
    destination_location_code,
    nonstop_required,
    baggage_included_required,
    auto_book_enabled,
    created_at
) VALUES (
    '02a4b42e-5691-4c37-ac7e-f220e2e74ed8',
    '123e4567-e89b-12d3-a456-426614174000',
    '2025-07-15 00:00:00+00',
    '2025-07-16 23:59:59+00',
    '2025-07-15',
    '2025-07-18',
    3,
    7,
    1000,
    1000,
    'NYC',
    ARRAY['JFK', 'LGA'],
    'LAX',
    'LAX',
    false,
    false,
    false,
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    departure_date = EXCLUDED.departure_date,
    return_date = EXCLUDED.return_date;

-- Also insert the backup test trip
INSERT INTO trip_requests (
    id,
    user_id,
    earliest_departure,
    latest_departure,
    departure_date,
    return_date,
    min_duration,
    max_duration,
    budget,
    max_price,
    origin_location_code,
    departure_airports,
    destination_airport,
    destination_location_code,
    nonstop_required,
    baggage_included_required,
    auto_book_enabled,
    created_at
) VALUES (
    'ba85c75a-3087-4141-bccf-d636f77fffbc',
    '123e4567-e89b-12d3-a456-426614174000',
    '2025-07-15 00:00:00+00',
    '2025-07-16 23:59:59+00',
    '2025-07-15',
    '2025-07-18',
    3,
    7,
    1000,
    1000,
    'NYC',
    ARRAY['JFK'],
    'LHR',
    'LHR',
    true,
    true,
    false,
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    departure_date = EXCLUDED.departure_date,
    return_date = EXCLUDED.return_date;

-- Check that the data was inserted
SELECT id, destination_location_code, departure_date, return_date FROM trip_requests 
WHERE id IN ('02a4b42e-5691-4c37-ac7e-f220e2e74ed8', 'ba85c75a-3087-4141-bccf-d636f77fffbc');

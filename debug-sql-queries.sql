-- FLIGHT SEARCH DEBUG QUERIES
-- Run these in Supabase SQL Editor to diagnose the issue

-- =============================================================================
-- STEP 1: CHECK RECENT TRIP REQUESTS
-- =============================================================================
SELECT 
    id,
    user_id,
    departure_airports,
    destination_location_code,
    earliest_departure,
    latest_departure,
    budget,
    auto_book_enabled,
    nonstop_required,
    baggage_included_required,
    last_checked_at,
    created_at
FROM trip_requests 
ORDER BY created_at DESC 
LIMIT 10;

-- =============================================================================
-- STEP 2: CHECK FLIGHT OFFERS FOR RECENT TRIPS
-- =============================================================================
SELECT 
    tr.id as trip_id,
    tr.destination_location_code as requested_destination,
    tr.created_at as trip_created,
    tr.last_checked_at,
    COUNT(fo.id) as offers_count,
    MIN(fo.price) as min_price,
    MAX(fo.price) as max_price,
    STRING_AGG(DISTINCT fo.destination_airport, ', ') as actual_destinations
FROM trip_requests tr
LEFT JOIN flight_offers fo ON tr.id = fo.trip_request_id
WHERE tr.created_at > NOW() - INTERVAL '7 days'
GROUP BY tr.id, tr.destination_location_code, tr.created_at, tr.last_checked_at
ORDER BY tr.created_at DESC;

-- =============================================================================
-- STEP 3: DETAILED ANALYSIS OF SPECIFIC TRIP (replace with actual trip ID)
-- =============================================================================
-- Replace 'YOUR_TRIP_ID_HERE' with an actual trip ID from Step 1
/*
SELECT 
    'TRIP DETAILS' as section,
    tr.id,
    tr.departure_airports,
    tr.destination_location_code,
    tr.budget,
    tr.nonstop_required,
    tr.baggage_included_required,
    tr.last_checked_at
FROM trip_requests tr 
WHERE tr.id = 'YOUR_TRIP_ID_HERE'

UNION ALL

SELECT 
    'FLIGHT OFFERS' as section,
    fo.trip_request_id,
    ARRAY[fo.origin_airport] as departure_airports,
    fo.destination_airport,
    fo.price,
    fo.nonstop_match,
    fo.baggage_included,
    fo.created_at
FROM flight_offers fo
WHERE fo.trip_request_id = 'YOUR_TRIP_ID_HERE'
ORDER BY section, price;
*/

-- =============================================================================
-- STEP 4: CHECK FLIGHT MATCHES
-- =============================================================================
SELECT 
    tr.id as trip_id,
    tr.destination_location_code,
    COUNT(fm.id) as matches_count,
    COUNT(fo.id) as offers_count,
    tr.created_at
FROM trip_requests tr
LEFT JOIN flight_matches fm ON tr.id = fm.trip_request_id
LEFT JOIN flight_offers fo ON tr.id = fo.trip_request_id
WHERE tr.created_at > NOW() - INTERVAL '7 days'
GROUP BY tr.id, tr.destination_location_code, tr.created_at
ORDER BY tr.created_at DESC;

-- =============================================================================
-- STEP 5: CHECK DESTINATION MISMATCH ISSUES
-- =============================================================================
-- This will show if API is returning different destinations than requested
SELECT 
    tr.destination_location_code as requested,
    fo.destination_airport as actual,
    COUNT(*) as offer_count,
    tr.id as trip_id
FROM trip_requests tr
JOIN flight_offers fo ON tr.id = fo.trip_request_id
WHERE tr.created_at > NOW() - INTERVAL '7 days'
  AND tr.destination_location_code != fo.destination_airport
GROUP BY tr.destination_location_code, fo.destination_airport, tr.id
ORDER BY offer_count DESC;

-- =============================================================================
-- STEP 6: CHECK FOR ZERO-OFFER TRIPS (MAIN ISSUE)
-- =============================================================================
SELECT 
    tr.id,
    tr.destination_location_code,
    tr.departure_airports,
    tr.budget,
    tr.created_at,
    tr.last_checked_at,
    CASE 
        WHEN tr.last_checked_at IS NULL THEN 'Never searched'
        WHEN tr.last_checked_at < tr.created_at THEN 'Not searched since creation'
        ELSE 'Searched'
    END as search_status
FROM trip_requests tr
LEFT JOIN flight_offers fo ON tr.id = fo.trip_request_id
WHERE fo.id IS NULL  -- No offers found
  AND tr.created_at > NOW() - INTERVAL '7 days'
ORDER BY tr.created_at DESC;

-- =============================================================================
-- STEP 7: CHECK FEATURE FLAGS
-- =============================================================================
SELECT 
    name,
    enabled,
    description,
    created_at
FROM feature_flags
ORDER BY name;

-- =============================================================================
-- STEP 8: SAMPLE WORKING OFFERS (if any exist)
-- =============================================================================
SELECT 
    fo.trip_request_id,
    tr.destination_location_code as requested,
    fo.destination_airport as actual,
    fo.price,
    fo.airline,
    fo.nonstop_match,
    fo.baggage_included,
    fo.created_at
FROM flight_offers fo
JOIN trip_requests tr ON fo.trip_request_id = tr.id
WHERE fo.created_at > NOW() - INTERVAL '7 days'
ORDER BY fo.created_at DESC
LIMIT 20;

-- =============================================================================
-- DIAGNOSTIC SUMMARY QUERY
-- =============================================================================
WITH trip_stats AS (
    SELECT 
        COUNT(*) as total_trips,
        COUNT(CASE WHEN last_checked_at IS NOT NULL THEN 1 END) as searched_trips,
        COUNT(DISTINCT fo.trip_request_id) as trips_with_offers
    FROM trip_requests tr
    LEFT JOIN flight_offers fo ON tr.id = fo.trip_request_id
    WHERE tr.created_at > NOW() - INTERVAL '7 days'
)
SELECT 
    total_trips,
    searched_trips,
    trips_with_offers,
    (total_trips - trips_with_offers) as trips_without_offers,
    ROUND((trips_with_offers::numeric / NULLIF(total_trips, 0)) * 100, 1) as success_rate_percent
FROM trip_stats;


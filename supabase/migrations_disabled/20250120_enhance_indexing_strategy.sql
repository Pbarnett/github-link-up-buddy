-- Enhanced indexing strategy for better query performance
-- Based on Supabase documentation best practices

-- Performance-critical indexes for trip requests
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_requests_user_departure 
ON trip_requests (user_id, departure_date) 
WHERE departure_date >= CURRENT_DATE;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_requests_location_dates 
ON trip_requests (origin_location_code, destination_location_code, departure_date) 
WHERE departure_date >= CURRENT_DATE;

-- Composite index for flight offers search patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_offers_search 
ON flight_offers (trip_request_id, price, created_at DESC);

-- Enhanced flight offers v2 indexing for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_offers_v2_search 
ON flight_offers_v2 (trip_request_id, price_total, depart_dt) 
WHERE depart_dt >= CURRENT_DATE;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_offers_v2_route_date 
ON flight_offers_v2 (origin_iata, destination_iata, depart_dt, price_total);

-- Booking requests performance optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_booking_requests_user_status_created 
ON booking_requests (user_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_booking_requests_processing 
ON booking_requests (status, created_at) 
WHERE status IN ('new', 'pending_payment', 'pending_booking', 'processing');

-- Payment methods optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_methods_user_default 
ON payment_methods (user_id, is_default, created_at DESC);

-- Notifications performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_unread 
ON notifications (user_id, is_read, created_at DESC) 
WHERE is_read = false;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_type_created 
ON notifications (type, created_at DESC);

-- Bookings analytics and reporting
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_user_date 
ON bookings (user_id, booked_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_status_date 
ON bookings (status, booked_at DESC) 
WHERE status IS NOT NULL;

-- Profile completeness optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_email_names 
ON profiles (email, first_name, last_name) 
WHERE email IS NOT NULL;

-- Auto booking requests optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_auto_booking_requests_status_user 
ON auto_booking_requests (status, user_id, created_at DESC);

-- Flight matches for auto-booking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_matches_trip_notified 
ON flight_matches (trip_request_id, notified, depart_at) 
WHERE notified = false;

-- Partial indexes for better performance on specific queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_requests_auto_book_enabled 
ON trip_requests (user_id, auto_book_enabled, departure_date) 
WHERE auto_book_enabled = true AND departure_date >= CURRENT_DATE;

-- Feature flags performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_feature_flags_name_enabled 
ON feature_flags (name, enabled);

-- Orders performance optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_status_created 
ON orders (user_id, status, created_at DESC);

-- Add comments for documentation
COMMENT ON INDEX idx_trip_requests_user_departure IS 'Optimizes user trip history and upcoming trip queries';
COMMENT ON INDEX idx_flight_offers_search IS 'Optimizes flight offer retrieval sorted by price';
COMMENT ON INDEX idx_flight_offers_v2_route_date IS 'Optimizes route-based flight searches with date filtering';
COMMENT ON INDEX idx_booking_requests_processing IS 'Optimizes queries for active booking requests needing processing';
COMMENT ON INDEX idx_notifications_user_unread IS 'Optimizes unread notification queries for users';

-- Create or update statistics for better query planning
ANALYZE trip_requests;
ANALYZE flight_offers;
ANALYZE flight_offers_v2;
ANALYZE booking_requests;
ANALYZE bookings;
ANALYZE payment_methods;
ANALYZE notifications;
ANALYZE profiles;

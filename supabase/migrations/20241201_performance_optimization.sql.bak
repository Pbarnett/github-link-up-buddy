-- Performance Optimization Migration
-- Adds optimized indexes and query performance improvements
-- Created: 2024-12-01

-- Enable necessary extensions for advanced indexing
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ============================================================================
-- TRIP REQUESTS - Core search and filtering indexes
-- ============================================================================

-- Primary search index for trip requests by user and status
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_requests_user_status_created 
ON trip_requests (user_id, status, created_at DESC) 
WHERE status IN ('pending', 'active', 'completed');

-- Geospatial search index for departure/arrival locations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_requests_departure_arrival_gin 
ON trip_requests USING GIN (
  to_tsvector('simple', departure_location || ' ' || arrival_location)
);

-- Date range search optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_requests_dates_range 
ON trip_requests (departure_date, return_date) 
WHERE status != 'cancelled';

-- Budget-based filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_requests_budget_range 
ON trip_requests (budget_min, budget_max) 
WHERE budget_min IS NOT NULL AND budget_max IS NOT NULL;

-- Composite index for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_requests_active_search 
ON trip_requests (user_id, status, departure_date, created_at DESC) 
WHERE status IN ('pending', 'active');

-- ============================================================================
-- FLIGHT OFFERS - Performance critical for search results
-- ============================================================================

-- Primary index for offers by trip request with pricing
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_offers_trip_price_valid 
ON flight_offers (trip_request_id, total_price, valid_until DESC) 
WHERE status = 'available' AND valid_until > NOW();

-- Airline and route optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_offers_airline_route 
ON flight_offers (airline, departure_airport, arrival_airport);

-- Duration-based searches
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_offers_duration_price 
ON flight_offers (flight_duration, total_price) 
WHERE status = 'available';

-- Booking class preferences
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_offers_class_price 
ON flight_offers (booking_class, total_price) 
WHERE status = 'available';

-- Expiry management index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_offers_expiry_cleanup 
ON flight_offers (valid_until) 
WHERE status = 'available' AND valid_until < NOW();

-- ============================================================================
-- BOOKING REQUESTS - Transaction and status tracking
-- ============================================================================

-- User booking history with status
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_booking_requests_user_status_date 
ON booking_requests (user_id, status, created_at DESC);

-- Payment processing optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_booking_requests_payment_status 
ON booking_requests (payment_status, payment_intent_id) 
WHERE payment_status IN ('pending', 'processing', 'requires_action');

-- Flight offer relationship
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_booking_requests_offer_status 
ON booking_requests (flight_offer_id, status, created_at DESC);

-- Confirmation and ticket management
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_booking_requests_confirmation 
ON booking_requests (confirmation_number) 
WHERE confirmation_number IS NOT NULL;

-- ============================================================================
-- PAYMENT METHODS - Security and user management
-- ============================================================================

-- User payment methods with defaults first
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_methods_user_default_active 
ON payment_methods (user_id, is_default DESC, is_active, created_at DESC) 
WHERE is_active = true;

-- Payment provider optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_methods_provider_type 
ON payment_methods (payment_provider, payment_type) 
WHERE is_active = true;

-- Stripe payment method mapping
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_methods_stripe_id 
ON payment_methods (stripe_payment_method_id) 
WHERE stripe_payment_method_id IS NOT NULL;

-- ============================================================================
-- PAYMENTS - Transaction history and reconciliation
-- ============================================================================

-- User payment history
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_user_status_date 
ON payments (user_id, status, created_at DESC);

-- Transaction reconciliation
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_stripe_intent 
ON payments (stripe_payment_intent_id) 
WHERE stripe_payment_intent_id IS NOT NULL;

-- Booking relationship
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_booking_status 
ON payments (booking_request_id, status, created_at DESC);

-- Amount-based queries for reporting
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_amount_date 
ON payments (amount, currency, created_at DESC) 
WHERE status = 'succeeded';

-- ============================================================================
-- NOTIFICATIONS - User communication optimization
-- ============================================================================

-- User notifications by read status and priority
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_unread_priority 
ON notifications (user_id, is_read, priority DESC, created_at DESC);

-- Notification type and channel optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_type_channel 
ON notifications (notification_type, channel) 
WHERE sent_at IS NOT NULL;

-- Cleanup index for old notifications
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_cleanup 
ON notifications (created_at) 
WHERE created_at < (NOW() - INTERVAL '90 days');

-- ============================================================================
-- PROFILES - User data and completeness tracking
-- ============================================================================

-- User profile completeness
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_completion_updated 
ON profiles (completion_percentage DESC, updated_at DESC) 
WHERE completion_percentage IS NOT NULL;

-- Email verification status
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_email_verified 
ON profiles (email_verified, created_at DESC);

-- KYC and verification status
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_verification_status 
ON profiles (verification_status, verification_level) 
WHERE verification_status IS NOT NULL;

-- ============================================================================
-- TRAVELER PROFILES - Multi-traveler support
-- ============================================================================

-- User's traveler profiles with default first
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_traveler_profiles_user_default_active 
ON traveler_profiles (user_id, is_default DESC, is_active, created_at DESC) 
WHERE is_active = true;

-- Document verification
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_traveler_profiles_docs_verified 
ON traveler_profiles (passport_verified, id_verified) 
WHERE is_active = true;

-- ============================================================================
-- FEATURE FLAGS - Configuration and A/B testing
-- ============================================================================

-- Active feature flags
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_feature_flags_active_key 
ON feature_flags (flag_key, is_active) 
WHERE is_active = true;

-- User-specific flag assignments
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_feature_flag_assignments_user_flag 
ON feature_flag_assignments (user_id, flag_key, is_enabled);

-- ============================================================================
-- PARTIAL INDEXES for Data Archival and Cleanup
-- ============================================================================

-- Recent active trip requests (90 days)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_requests_recent_active 
ON trip_requests (user_id, status, created_at DESC) 
WHERE created_at > (NOW() - INTERVAL '90 days') AND status != 'archived';

-- Recent successful payments (1 year)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_recent_successful 
ON payments (user_id, amount, created_at DESC) 
WHERE created_at > (NOW() - INTERVAL '1 year') AND status = 'succeeded';

-- Recent booking requests (6 months)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_booking_requests_recent 
ON booking_requests (user_id, status, created_at DESC) 
WHERE created_at > (NOW() - INTERVAL '6 months');

-- ============================================================================
-- COMPOSITE INDEXES for Complex Query Patterns
-- ============================================================================

-- Trip search with filters (common dashboard query)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_requests_search_composite 
ON trip_requests (
  user_id, 
  status, 
  departure_date, 
  departure_location, 
  arrival_location, 
  created_at DESC
) WHERE status IN ('pending', 'active', 'completed');

-- Flight offer search with price range
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_offers_search_price_range 
ON flight_offers (
  trip_request_id, 
  total_price, 
  departure_datetime, 
  arrival_datetime, 
  booking_class
) WHERE status = 'available' AND valid_until > NOW();

-- User dashboard optimization (bookings with payments)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_dashboard_composite 
ON booking_requests (
  user_id, 
  status, 
  payment_status, 
  created_at DESC
) WHERE status IN ('confirmed', 'pending', 'processing');

-- ============================================================================
-- STATISTICS AND MONITORING
-- ============================================================================

-- Update table statistics for better query planning
ANALYZE trip_requests;
ANALYZE flight_offers;
ANALYZE booking_requests;
ANALYZE payments;
ANALYZE payment_methods;
ANALYZE notifications;
ANALYZE profiles;
ANALYZE traveler_profiles;
ANALYZE feature_flags;
ANALYZE feature_flag_assignments;

-- ============================================================================
-- QUERY PERFORMANCE MONITORING
-- ============================================================================

-- Create a view for monitoring slow queries
CREATE OR REPLACE VIEW slow_queries AS
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  min_time,
  max_time,
  stddev_time,
  rows
FROM pg_stat_statements 
WHERE mean_time > 100 -- Queries taking more than 100ms on average
ORDER BY mean_time DESC;

-- Create indexes on system tables for better monitoring
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pg_stat_statements_mean_time 
ON pg_stat_statements (mean_time DESC);

-- ============================================================================
-- MAINTENANCE PROCEDURES
-- ============================================================================

-- Function to rebuild fragmented indexes
CREATE OR REPLACE FUNCTION rebuild_fragmented_indexes()
RETURNS TABLE(index_name text, table_name text, action text) 
LANGUAGE plpgsql AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT 
            schemaname, 
            tablename, 
            indexname,
            idx_size,
            idx_tup_read,
            idx_tup_fetch
        FROM pg_stat_user_indexes 
        WHERE idx_tup_read > 0 
        AND idx_tup_fetch / idx_tup_read < 0.1
        AND idx_size > 100 * 1024 * 1024 -- Only consider indexes > 100MB
    LOOP
        EXECUTE format('REINDEX INDEX CONCURRENTLY %I.%I', rec.schemaname, rec.indexname);
        
        index_name := rec.indexname;
        table_name := rec.tablename;
        action := 'REINDEXED';
        
        RETURN NEXT;
    END LOOP;
END;
$$;

-- ============================================================================
-- VACUUM AND MAINTENANCE CONFIGURATION
-- ============================================================================

-- Optimize autovacuum settings for high-traffic tables
ALTER TABLE trip_requests SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);

ALTER TABLE flight_offers SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);

ALTER TABLE booking_requests SET (
  autovacuum_vacuum_scale_factor = 0.15,
  autovacuum_analyze_scale_factor = 0.1
);

ALTER TABLE payments SET (
  autovacuum_vacuum_scale_factor = 0.2,
  autovacuum_analyze_scale_factor = 0.1
);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON INDEX idx_trip_requests_user_status_created IS 
'Optimized index for user trip history and status filtering';

COMMENT ON INDEX idx_flight_offers_trip_price_valid IS 
'Primary index for flight search results with price sorting';

COMMENT ON INDEX idx_booking_requests_user_status_date IS 
'User booking history with chronological ordering';

COMMENT ON INDEX idx_payment_methods_user_default_active IS 
'User payment methods with default prioritization';

COMMENT ON INDEX idx_notifications_user_unread_priority IS 
'User notification inbox with unread and priority sorting';

-- Log successful completion
DO $$ 
BEGIN 
    RAISE NOTICE 'Performance optimization migration completed successfully at %', NOW();
END $$;

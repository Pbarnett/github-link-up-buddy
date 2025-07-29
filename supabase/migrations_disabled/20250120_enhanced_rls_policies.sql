-- Enhanced Row Level Security Policies
-- Based on Supabase security documentation best practices

-- Enable RLS on all tables that don't have it enabled yet
ALTER TABLE trip_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_offers_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_booking_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate with better performance
DROP POLICY IF EXISTS "Users can view own trip requests" ON trip_requests;
DROP POLICY IF EXISTS "Users can insert own trip requests" ON trip_requests;
DROP POLICY IF EXISTS "Users can update own trip requests" ON trip_requests;

-- Enhanced trip_requests policies with better indexing support
CREATE POLICY "trip_requests_select_policy" ON trip_requests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "trip_requests_insert_policy" ON trip_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "trip_requests_update_policy" ON trip_requests
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enhanced flight offers policies (both tables)
DROP POLICY IF EXISTS "Users can view flight offers for their trips" ON flight_offers;
CREATE POLICY "flight_offers_select_policy" ON flight_offers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_requests tr 
      WHERE tr.id = flight_offers.trip_request_id 
      AND tr.user_id = auth.uid()
    )
  );

-- Flight offers v2 policies
CREATE POLICY "flight_offers_v2_select_policy" ON flight_offers_v2
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_requests tr 
      WHERE tr.id = flight_offers_v2.trip_request_id 
      AND tr.user_id = auth.uid()
    )
  );

-- Enhanced booking policies with better performance
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

CREATE POLICY "bookings_select_policy" ON bookings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "bookings_insert_policy" ON bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookings_update_policy" ON bookings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enhanced booking requests policies
DROP POLICY IF EXISTS "Users can manage own booking requests" ON booking_requests;
CREATE POLICY "booking_requests_select_policy" ON booking_requests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "booking_requests_insert_policy" ON booking_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "booking_requests_update_policy" ON booking_requests
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enhanced profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profiles can be inserted by the user (for initial setup)
CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Enhanced payment methods policies with strict security
DROP POLICY IF EXISTS "Users can manage own payment methods" ON payment_methods;

CREATE POLICY "payment_methods_select_policy" ON payment_methods
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "payment_methods_insert_policy" ON payment_methods
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "payment_methods_update_policy" ON payment_methods
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "payment_methods_delete_policy" ON payment_methods
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enhanced notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "notifications_select_policy" ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_policy" ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role can insert notifications (for system notifications)
CREATE POLICY "service_notifications_insert_policy" ON notifications
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role' OR
    auth.uid() = user_id
  );

-- Enhanced orders policies
CREATE POLICY "orders_select_policy" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_policy" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Flight matches policies (users can only see matches for their trip requests)
CREATE POLICY "flight_matches_select_policy" ON flight_matches
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_requests tr 
      WHERE tr.id = flight_matches.trip_request_id 
      AND tr.user_id = auth.uid()
    )
  );

-- Auto booking requests policies
CREATE POLICY "auto_booking_requests_select_policy" ON auto_booking_requests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "auto_booking_requests_insert_policy" ON auto_booking_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "auto_booking_requests_update_policy" ON auto_booking_requests
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Feature flags - Allow read access to authenticated users
-- (Service role manages the flags themselves)
CREATE POLICY "feature_flags_select_policy" ON feature_flags
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create indexes to support RLS policies efficiently
-- These indexes will speed up policy checks
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_requests_user_auth 
ON trip_requests (user_id) 
WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_user_auth 
ON bookings (user_id) 
WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_booking_requests_user_auth 
ON booking_requests (user_id) 
WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_auth 
ON notifications (user_id) 
WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_methods_user_auth 
ON payment_methods (user_id) 
WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_auth 
ON orders (user_id) 
WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_auto_booking_requests_user_auth 
ON auto_booking_requests (user_id) 
WHERE user_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON POLICY "trip_requests_select_policy" ON trip_requests IS 
'Users can only view their own trip requests. Indexed on user_id for performance.';

COMMENT ON POLICY "bookings_select_policy" ON bookings IS 
'Users can only view their own bookings. Indexed on user_id for performance.';

COMMENT ON POLICY "flight_offers_select_policy" ON flight_offers IS 
'Users can only view flight offers for their own trip requests via EXISTS subquery.';

COMMENT ON POLICY "profiles_select_policy" ON profiles IS 
'Users can only view their own profile data.';

COMMENT ON POLICY "payment_methods_select_policy" ON payment_methods IS 
'Users can only view their own payment methods with strict security.';

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON trip_requests TO authenticated;
GRANT SELECT ON flight_offers TO authenticated;
GRANT SELECT ON flight_offers_v2 TO authenticated;
GRANT SELECT, INSERT, UPDATE ON booking_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE ON bookings TO authenticated;
GRANT SELECT, UPDATE ON notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON payment_methods TO authenticated;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT, INSERT ON orders TO authenticated;
GRANT SELECT ON flight_matches TO authenticated;
GRANT SELECT, INSERT, UPDATE ON auto_booking_requests TO authenticated;
GRANT SELECT ON feature_flags TO authenticated;

-- Revoke unnecessary permissions from anon role for security
REVOKE ALL ON trip_requests FROM anon;
REVOKE ALL ON flight_offers FROM anon;
REVOKE ALL ON flight_offers_v2 FROM anon;
REVOKE ALL ON booking_requests FROM anon;
REVOKE ALL ON bookings FROM anon;
REVOKE ALL ON notifications FROM anon;
REVOKE ALL ON payment_methods FROM anon;
REVOKE ALL ON profiles FROM anon;
REVOKE ALL ON orders FROM anon;
REVOKE ALL ON flight_matches FROM anon;
REVOKE ALL ON auto_booking_requests FROM anon;

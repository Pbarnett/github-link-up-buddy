-- Migration: Rollback personalization fields
-- Drops the added personalization-related columns and tables

-- Drop personalization fields from profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS next_trip_city;
ALTER TABLE profiles DROP COLUMN IF EXISTS loyalty_tier;
ALTER TABLE profiles DROP COLUMN IF EXISTS personalization_enabled;
ALTER TABLE profiles DROP COLUMN IF EXISTS last_login_at;

-- Remove indexes
DROP INDEX IF EXISTS idx_profiles_personalization;
DROP INDEX IF EXISTS idx_personalization_events_user_id;
DROP INDEX IF EXISTS idx_personalization_events_created_at;
DROP INDEX IF EXISTS idx_personalization_events_type;

-- Drop analytics table
DROP TABLE IF EXISTS personalization_events CASCADE;

-- Drop all added comments
COMMENT ON TABLE personalization_events IS NULL;
COMMENT ON COLUMN profiles.next_trip_city IS NULL;
COMMENT ON COLUMN profiles.loyalty_tier IS NULL;
COMMENT ON COLUMN profiles.personalization_enabled IS NULL;
COMMENT ON COLUMN profiles.last_login_at IS NULL;

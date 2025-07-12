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

-- Drop all added comments (only if tables/columns exist)
DO $$
BEGIN
  -- Only drop comments if the table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'personalization_events') THEN
    COMMENT ON TABLE personalization_events IS NULL;
  END IF;
  
  -- Only drop column comments if the columns exist
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'next_trip_city') THEN
    COMMENT ON COLUMN profiles.next_trip_city IS NULL;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'loyalty_tier') THEN
    COMMENT ON COLUMN profiles.loyalty_tier IS NULL;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'personalization_enabled') THEN
    COMMENT ON COLUMN profiles.personalization_enabled IS NULL;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_login_at') THEN
    COMMENT ON COLUMN profiles.last_login_at IS NULL;
  END IF;
END $$;

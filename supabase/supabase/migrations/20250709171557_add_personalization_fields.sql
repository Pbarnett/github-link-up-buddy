-- Migration: Add personalization fields to profiles table
-- This extends the existing profiles table with personalization capabilities

-- Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS next_trip_city VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS loyalty_tier VARCHAR(20) DEFAULT 'standard'; -- Future use
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS personalization_enabled BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Performance index for personalization queries
CREATE INDEX IF NOT EXISTS idx_profiles_personalization 
  ON profiles(id, first_name, next_trip_city) 
  WHERE personalization_enabled = true;

-- Analytics table for personalization events
CREATE TABLE IF NOT EXISTS personalization_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_personalization_events_user_id 
  ON personalization_events(user_id);
CREATE INDEX IF NOT EXISTS idx_personalization_events_created_at 
  ON personalization_events(created_at);
CREATE INDEX IF NOT EXISTS idx_personalization_events_type 
  ON personalization_events(event_type);

-- Add comment for documentation
COMMENT ON TABLE personalization_events IS 'Stores analytics events for personalization feature tracking';
COMMENT ON COLUMN profiles.next_trip_city IS 'City for next planned trip, used for personalized greetings';
COMMENT ON COLUMN profiles.loyalty_tier IS 'User loyalty tier (standard/premium/vip) - marked for future use';
COMMENT ON COLUMN profiles.personalization_enabled IS 'Whether user has opted into personalization features';
COMMENT ON COLUMN profiles.last_login_at IS 'Last login timestamp for personalization context';

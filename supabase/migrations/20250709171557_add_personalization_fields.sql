-- Migration: Add personalization fields to profiles table
-- Adds personalization-related columns and analytics table

-- Add personalization fields to profiles table
ALTER TABLE profiles
  ADD COLUMN next_trip_city TEXT,
  ADD COLUMN loyalty_tier TEXT DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  ADD COLUMN personalization_enabled BOOLEAN DEFAULT true,
  ADD COLUMN last_login_at TIMESTAMP WITH TIME ZONE;

-- Create personalization events table for analytics
CREATE TABLE IF NOT EXISTS personalization_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_personalization 
  ON profiles(personalization_enabled) WHERE personalization_enabled = true;

CREATE INDEX IF NOT EXISTS idx_personalization_events_user_id 
  ON personalization_events(user_id);

CREATE INDEX IF NOT EXISTS idx_personalization_events_created_at 
  ON personalization_events(created_at);

CREATE INDEX IF NOT EXISTS idx_personalization_events_type 
  ON personalization_events(event_type);

-- Add RLS policies for personalization_events
ALTER TABLE personalization_events ENABLE ROW LEVEL SECURITY;

-- Users can only see their own personalization events
CREATE POLICY "Users can view their own personalization events" 
  ON personalization_events FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own personalization events
CREATE POLICY "Users can insert their own personalization events" 
  ON personalization_events FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE personalization_events IS 'Tracks user personalization events for analytics and feature optimization';
COMMENT ON COLUMN profiles.next_trip_city IS 'City for users next planned trip for personalization';
COMMENT ON COLUMN profiles.loyalty_tier IS 'User loyalty tier for personalized experiences';
COMMENT ON COLUMN profiles.personalization_enabled IS 'Whether personalization features are enabled for this user';
COMMENT ON COLUMN profiles.last_login_at IS 'Timestamp of users last login for personalization freshness';



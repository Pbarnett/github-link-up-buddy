-- Fix profiles table schema issues for test user creation
-- This script addresses the constraints that prevent the test user creation

-- First, let's add the missing columns that the personalization tests need
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS next_trip_city VARCHAR(100),
  ADD COLUMN IF NOT EXISTS loyalty_tier VARCHAR(20) DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS personalization_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT now();

-- Remove any NOT NULL constraints that might be causing issues
ALTER TABLE profiles 
  ALTER COLUMN next_trip_city DROP NOT NULL,
  ALTER COLUMN loyalty_tier DROP NOT NULL;

-- Set appropriate defaults for fields that might be required
ALTER TABLE profiles 
  ALTER COLUMN personalization_enabled SET DEFAULT true,
  ALTER COLUMN last_login_at SET DEFAULT now();

-- Create the personalization_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS personalization_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_personalization 
  ON profiles(id, first_name, next_trip_city) 
  WHERE personalization_enabled = true;

CREATE INDEX IF NOT EXISTS idx_personalization_events_user_id 
  ON personalization_events(user_id);
CREATE INDEX IF NOT EXISTS idx_personalization_events_created_at 
  ON personalization_events(created_at);
CREATE INDEX IF NOT EXISTS idx_personalization_events_type 
  ON personalization_events(event_type);

-- Add RLS policies for personalization_events
ALTER TABLE personalization_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own personalization events"
  ON personalization_events FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own personalization events"
  ON personalization_events FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage personalization events"
  ON personalization_events FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Add comments for documentation
COMMENT ON TABLE personalization_events IS 'Stores analytics events for personalization feature tracking';
COMMENT ON COLUMN profiles.next_trip_city IS 'City for next planned trip, used for personalized greetings';
COMMENT ON COLUMN profiles.loyalty_tier IS 'User loyalty tier (standard/premium/vip)';
COMMENT ON COLUMN profiles.personalization_enabled IS 'Whether user has opted into personalization features';
COMMENT ON COLUMN profiles.last_login_at IS 'Last login timestamp for personalization context';

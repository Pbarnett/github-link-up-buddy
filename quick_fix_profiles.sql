-- Quick fix for profiles table to allow test user creation
-- This fixes the immediate issue preventing user creation

-- Add missing personalization fields with defaults
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS personalization_enabled BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS next_trip_city VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS loyalty_tier VARCHAR(20) DEFAULT 'standard';

-- Make sure these fields have proper defaults
ALTER TABLE profiles ALTER COLUMN personalization_enabled SET DEFAULT true;
ALTER TABLE profiles ALTER COLUMN last_login_at SET DEFAULT now();
ALTER TABLE profiles ALTER COLUMN loyalty_tier SET DEFAULT 'standard';

-- Remove NOT NULL constraints on optional fields
ALTER TABLE profiles ALTER COLUMN next_trip_city DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN loyalty_tier DROP NOT NULL;

-- Create personalization_events table for tests
CREATE TABLE IF NOT EXISTS personalization_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simple policies for personalization_events
ALTER TABLE personalization_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own personalization events" ON personalization_events;
CREATE POLICY "Users can manage their own personalization events" ON personalization_events
  FOR ALL USING (user_id = auth.uid());

-- Add a simple trigger for the auth system to work
CREATE OR REPLACE FUNCTION handle_new_user_profile() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, personalization_enabled, last_login_at, loyalty_tier)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    true,
    NOW(),
    'standard'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();

-- Grant necessary permissions
GRANT ALL ON personalization_events TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user_profile() TO service_role;

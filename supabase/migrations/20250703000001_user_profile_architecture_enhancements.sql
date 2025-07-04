-- User Profile Architecture Enhancement Migration
-- Implements the schema changes outlined in the User Profile Architecture document

-- Add profile completeness tracking columns to traveler_profiles
ALTER TABLE traveler_profiles 
ADD COLUMN IF NOT EXISTS profile_completeness_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS verification_level TEXT DEFAULT 'basic' CHECK (verification_level IN ('basic', 'enhanced', 'premium')),
ADD COLUMN IF NOT EXISTS travel_preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_profile_update TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{}';

-- Add profile completeness tracking table
CREATE TABLE IF NOT EXISTS profile_completion_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completion_percentage INTEGER NOT NULL DEFAULT 0,
  missing_fields TEXT[] DEFAULT ARRAY[]::TEXT[],
  recommendations JSONB DEFAULT '[]',
  last_calculated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on profile completion tracking
ALTER TABLE profile_completion_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for profile completion tracking
CREATE POLICY "Users can view their own completion tracking"
  ON profile_completion_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completion tracking"
  ON profile_completion_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own completion tracking"
  ON profile_completion_tracking FOR UPDATE
  USING (auth.uid() = user_id);

-- Enhance audit logging with before/after values
ALTER TABLE traveler_data_audit 
ADD COLUMN IF NOT EXISTS old_value JSONB,
ADD COLUMN IF NOT EXISTS new_value JSONB,
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high'));

-- Create function to calculate profile completeness
CREATE OR REPLACE FUNCTION calculate_profile_completeness(profile_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_record RECORD;
  score INTEGER := 0;
  basic_info_score INTEGER := 0;
  contact_info_score INTEGER := 0;
  travel_docs_score INTEGER := 0;
  preferences_score INTEGER := 0;
  verification_score INTEGER := 0;
BEGIN
  -- Get the profile record
  SELECT * INTO profile_record
  FROM traveler_profiles
  WHERE id = profile_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Calculate basic info score (30% weight)
  IF profile_record.full_name IS NOT NULL AND LENGTH(TRIM(profile_record.full_name)) > 0 THEN
    basic_info_score := basic_info_score + 30;
  END IF;
  
  IF profile_record.date_of_birth IS NOT NULL THEN
    basic_info_score := basic_info_score + 30;
  END IF;
  
  IF profile_record.gender IS NOT NULL THEN
    basic_info_score := basic_info_score + 20;
  END IF;
  
  IF profile_record.email IS NOT NULL AND profile_record.email ~ '^[^@]+@[^@]+\.[^@]+$' THEN
    basic_info_score := basic_info_score + 20;
  END IF;
  
  -- Calculate contact info score (20% weight)
  IF profile_record.email IS NOT NULL AND profile_record.email ~ '^[^@]+@[^@]+\.[^@]+$' THEN
    contact_info_score := contact_info_score + 40;
  END IF;
  
  IF profile_record.phone IS NOT NULL THEN
    contact_info_score := contact_info_score + 30;
    IF profile_record.phone_verified = TRUE THEN
      contact_info_score := contact_info_score + 30;
    END IF;
  END IF;
  
  -- Calculate travel documents score (20% weight)
  IF profile_record.passport_number_encrypted IS NOT NULL THEN
    travel_docs_score := travel_docs_score + 40;
  END IF;
  
  IF profile_record.passport_country IS NOT NULL THEN
    travel_docs_score := travel_docs_score + 20;
  END IF;
  
  IF profile_record.passport_expiry IS NOT NULL THEN
    -- Check if passport is valid for more than 6 months
    IF profile_record.passport_expiry > CURRENT_DATE + INTERVAL '6 months' THEN
      travel_docs_score := travel_docs_score + 20;
    ELSIF profile_record.passport_expiry > CURRENT_DATE THEN
      travel_docs_score := travel_docs_score + 10; -- Expires soon
    END IF;
  END IF;
  
  IF profile_record.known_traveler_number IS NOT NULL THEN
    travel_docs_score := travel_docs_score + 20;
  END IF;
  
  -- Calculate preferences score (15% weight)
  IF profile_record.notification_preferences IS NOT NULL AND profile_record.notification_preferences != '{}' THEN
    preferences_score := preferences_score + 40;
  END IF;
  
  IF profile_record.travel_preferences IS NOT NULL AND profile_record.travel_preferences != '{}' THEN
    preferences_score := preferences_score + 60;
  ELSE
    preferences_score := preferences_score + 30; -- Partial for basic setup
  END IF;
  
  -- Calculate verification score (15% weight)
  IF profile_record.is_verified = TRUE THEN
    verification_score := 100;
  ELSE
    IF profile_record.passport_number_encrypted IS NOT NULL AND profile_record.passport_country IS NOT NULL THEN
      verification_score := verification_score + 30;
    END IF;
    
    IF profile_record.phone_verified = TRUE THEN
      verification_score := verification_score + 20;
    END IF;
  END IF;
  
  -- Calculate weighted overall score
  score := ROUND(
    (basic_info_score * 0.3) +
    (contact_info_score * 0.2) +
    (travel_docs_score * 0.2) +
    (preferences_score * 0.15) +
    (verification_score * 0.15)
  );
  
  RETURN LEAST(score, 100);
END;
$$;

-- Create function to update profile completeness
CREATE OR REPLACE FUNCTION update_profile_completeness()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_score INTEGER;
  missing_fields TEXT[];
  recommendations JSONB;
BEGIN
  -- Calculate new completeness score
  new_score := calculate_profile_completeness(NEW.id);
  
  -- Update the profile completeness score
  UPDATE traveler_profiles 
  SET profile_completeness_score = new_score,
      last_profile_update = NOW()
  WHERE id = NEW.id;
  
  -- Initialize missing fields array
  missing_fields := ARRAY[]::TEXT[];
  
  -- Check for missing required fields
  IF NEW.full_name IS NULL OR LENGTH(TRIM(NEW.full_name)) = 0 THEN
    missing_fields := array_append(missing_fields, 'full_name');
  END IF;
  
  IF NEW.date_of_birth IS NULL THEN
    missing_fields := array_append(missing_fields, 'date_of_birth');
  END IF;
  
  IF NEW.gender IS NULL THEN
    missing_fields := array_append(missing_fields, 'gender');
  END IF;
  
  IF NEW.email IS NULL OR NOT (NEW.email ~ '^[^@]+@[^@]+\.[^@]+$') THEN
    missing_fields := array_append(missing_fields, 'email');
  END IF;
  
  -- Check for important but optional fields
  IF NEW.phone IS NULL THEN
    missing_fields := array_append(missing_fields, 'phone');
  END IF;
  
  IF NEW.passport_number_encrypted IS NULL THEN
    missing_fields := array_append(missing_fields, 'passport_number');
  END IF;
  
  IF NEW.passport_country IS NULL THEN
    missing_fields := array_append(missing_fields, 'passport_country');
  END IF;
  
  IF NEW.passport_expiry IS NULL THEN
    missing_fields := array_append(missing_fields, 'passport_expiry');
  END IF;
  
  -- Generate basic recommendations
  recommendations := '[]'::JSONB;
  
  IF NEW.phone IS NOT NULL AND NEW.phone_verified = FALSE THEN
    recommendations := recommendations || jsonb_build_array(jsonb_build_object(
      'category', 'contact_info',
      'priority', 'high',
      'title', 'Verify your phone number',
      'description', 'Verify your phone number to receive important booking updates via SMS',
      'action', 'verify_phone',
      'points_value', 15
    ));
  END IF;
  
  IF NEW.passport_number_encrypted IS NULL THEN
    recommendations := recommendations || jsonb_build_array(jsonb_build_object(
      'category', 'travel_documents',
      'priority', 'medium',
      'title', 'Add passport information',
      'description', 'Add your passport details for faster international booking',
      'action', 'add_passport',
      'points_value', 20
    ));
  END IF;
  
  -- Upsert profile completion tracking
  INSERT INTO profile_completion_tracking (
    user_id,
    completion_percentage,
    missing_fields,
    recommendations,
    last_calculated
  )
  VALUES (
    NEW.user_id,
    new_score,
    missing_fields,
    recommendations,
    NOW()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    completion_percentage = EXCLUDED.completion_percentage,
    missing_fields = EXCLUDED.missing_fields,
    recommendations = EXCLUDED.recommendations,
    last_calculated = EXCLUDED.last_calculated;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update profile completeness
DROP TRIGGER IF EXISTS trigger_update_profile_completeness ON traveler_profiles;
CREATE TRIGGER trigger_update_profile_completeness
  AFTER INSERT OR UPDATE ON traveler_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completeness();

-- Create function to get profile recommendations
CREATE OR REPLACE FUNCTION get_profile_recommendations(profile_user_id UUID)
RETURNS TABLE (
  category TEXT,
  priority TEXT,
  title TEXT,
  description TEXT,
  action TEXT,
  points_value INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_record RECORD;
  rec RECORD;
BEGIN
  -- Get the user's primary profile
  SELECT * INTO profile_record
  FROM traveler_profiles
  WHERE user_id = profile_user_id AND is_primary = TRUE;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Phone verification recommendation
  IF profile_record.phone IS NOT NULL AND profile_record.phone_verified = FALSE THEN
    category := 'contact_info';
    priority := 'high';
    title := 'Verify your phone number';
    description := 'Verify your phone number to receive important booking updates via SMS';
    action := 'verify_phone';
    points_value := 15;
    RETURN NEXT;
  END IF;
  
  -- Missing phone recommendation
  IF profile_record.phone IS NULL THEN
    category := 'contact_info';
    priority := 'medium';
    title := 'Add phone number';
    description := 'Add your phone number for SMS notifications and account security';
    action := 'add_phone';
    points_value := 10;
    RETURN NEXT;
  END IF;
  
  -- Travel documents recommendation
  IF profile_record.passport_number_encrypted IS NULL THEN
    category := 'travel_documents';
    priority := 'medium';
    title := 'Add passport information';
    description := 'Add your passport details for faster international booking';
    action := 'add_passport';
    points_value := 20;
    RETURN NEXT;
  END IF;
  
  -- Identity verification recommendation
  IF profile_record.is_verified = FALSE AND profile_record.passport_number_encrypted IS NOT NULL THEN
    category := 'verification';
    priority := 'low';
    title := 'Verify your identity';
    description := 'Complete identity verification for higher booking limits and security';
    action := 'verify_identity';
    points_value := 25;
    RETURN NEXT;
  END IF;
  
  -- Expiring passport recommendation
  IF profile_record.passport_expiry IS NOT NULL THEN
    IF profile_record.passport_expiry <= CURRENT_DATE + INTERVAL '6 months' 
       AND profile_record.passport_expiry > CURRENT_DATE THEN
      category := 'travel_documents';
      priority := 'high';
      title := 'Passport expires soon';
      description := 'Your passport expires soon. Update your passport information.';
      action := 'update_passport';
      points_value := 10;
      RETURN NEXT;
    END IF;
  END IF;
  
  RETURN;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_traveler_profiles_completeness ON traveler_profiles(profile_completeness_score);
CREATE INDEX IF NOT EXISTS idx_traveler_profiles_last_update ON traveler_profiles(last_profile_update);
CREATE INDEX IF NOT EXISTS idx_profile_completion_tracking_user_id ON profile_completion_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_completion_tracking_percentage ON profile_completion_tracking(completion_percentage);

-- Update existing profiles to calculate completeness scores
UPDATE traveler_profiles SET updated_at = NOW() WHERE profile_completeness_score = 0;

-- Grant permissions
GRANT EXECUTE ON FUNCTION calculate_profile_completeness(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_profile_recommendations(UUID) TO authenticated;
GRANT ALL ON TABLE profile_completion_tracking TO authenticated;

-- Add comments for documentation
COMMENT ON COLUMN traveler_profiles.profile_completeness_score IS 'Calculated score (0-100) representing profile completion percentage';
COMMENT ON COLUMN traveler_profiles.verification_level IS 'User verification tier: basic, enhanced, or premium';
COMMENT ON COLUMN traveler_profiles.travel_preferences IS 'JSON object storing user travel preferences';
COMMENT ON COLUMN traveler_profiles.last_profile_update IS 'Timestamp of last profile modification';
COMMENT ON COLUMN traveler_profiles.phone_verified IS 'Whether the phone number has been verified via SMS';
COMMENT ON COLUMN traveler_profiles.notification_preferences IS 'JSON object storing notification channel preferences';

COMMENT ON TABLE profile_completion_tracking IS 'Tracks profile completion metrics and recommendations for users';
COMMENT ON FUNCTION calculate_profile_completeness(UUID) IS 'Calculates weighted profile completion score based on filled fields and verification status';
COMMENT ON FUNCTION get_profile_recommendations(UUID) IS 'Returns prioritized recommendations for profile improvement';

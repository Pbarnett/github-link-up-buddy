-- User Profile Playbook Implementation - Missing Tables and Enhancements
-- Implements the schema requirements from the Development Playbook

-- Enhance feature_flags table with rollout_percentage for user segments
ALTER TABLE public.feature_flags 
ADD COLUMN IF NOT EXISTS rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
ADD COLUMN IF NOT EXISTS user_segments TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create profile_completion_tracking table (if it doesn't exist)
-- This was created in a previous migration but let's ensure it has all required fields
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profile_completion_tracking') THEN
    CREATE TABLE profile_completion_tracking (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      completeness_score INT DEFAULT 0,
      missing_fields TEXT[] DEFAULT ARRAY[]::TEXT[],
      recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
      last_calculated TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id)
    );
    
    -- Enable RLS
    ALTER TABLE profile_completion_tracking ENABLE ROW LEVEL SECURITY;
    
    -- RLS policies
    CREATE POLICY "Users can view their own completion tracking"
      ON profile_completion_tracking FOR SELECT
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can manage their own completion tracking"
      ON profile_completion_tracking FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Ensure notification_preferences is added to traveler_profiles (might already exist)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'traveler_profiles' 
                 AND column_name = 'notification_preferences') THEN
    ALTER TABLE traveler_profiles 
    ADD COLUMN notification_preferences JSONB DEFAULT '{}';
  END IF;
END $$;

-- Create enhanced payment_methods table structure to match playbook requirements
-- Most of this already exists but let's ensure KMS encryption support
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'payment_methods' 
                 AND column_name = 'encrypted_card_data') THEN
    ALTER TABLE payment_methods 
    ADD COLUMN encrypted_card_data BYTEA,
    ADD COLUMN encryption_version SMALLINT DEFAULT 2;
  END IF;
END $$;

-- Create notification delivery tracking table for SMS/Email
CREATE TABLE IF NOT EXISTS notification_delivery_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL, -- 'sms', 'email', 'push'
  recipient TEXT NOT NULL, -- phone number or email
  subject TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  provider TEXT, -- 'twilio', 'resend', etc.
  provider_message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for notification delivery log
CREATE INDEX IF NOT EXISTS idx_notification_delivery_user_id ON notification_delivery_log(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_delivery_status ON notification_delivery_log(status);
CREATE INDEX IF NOT EXISTS idx_notification_delivery_type ON notification_delivery_log(notification_type);
CREATE INDEX IF NOT EXISTS idx_notification_delivery_created ON notification_delivery_log(created_at);

-- Enable RLS on notification delivery log
ALTER TABLE notification_delivery_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for notification delivery log
CREATE POLICY "Users can view their own notification logs"
  ON notification_delivery_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage notification logs"
  ON notification_delivery_log FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create phone verification tracking table
CREATE TABLE IF NOT EXISTS phone_verification_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'expired', 'failed')),
  attempts_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for phone verification
CREATE INDEX IF NOT EXISTS idx_phone_verification_user_id ON phone_verification_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_phone_verification_phone ON phone_verification_attempts(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_verification_status ON phone_verification_attempts(status);
CREATE INDEX IF NOT EXISTS idx_phone_verification_expires ON phone_verification_attempts(expires_at);

-- Enable RLS on phone verification
ALTER TABLE phone_verification_attempts ENABLE ROW LEVEL SECURITY;

-- RLS policies for phone verification
CREATE POLICY "Users can view their own verification attempts"
  ON phone_verification_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verification attempts"
  ON phone_verification_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage verification attempts"
  ON phone_verification_attempts FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create profile activity log for tracking user interactions
CREATE TABLE IF NOT EXISTS profile_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'profile_updated', 'phone_verified', 'document_added', etc.
  activity_details JSONB DEFAULT '{}',
  completion_score_before INTEGER,
  completion_score_after INTEGER,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for profile activity log
CREATE INDEX IF NOT EXISTS idx_profile_activity_user_id ON profile_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_activity_type ON profile_activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_profile_activity_created ON profile_activity_log(created_at);

-- Enable RLS on profile activity log
ALTER TABLE profile_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for profile activity log
CREATE POLICY "Users can view their own activity logs"
  ON profile_activity_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage activity logs"
  ON profile_activity_log FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to check feature flag rollout for user
CREATE OR REPLACE FUNCTION check_feature_flag_rollout(flag_name TEXT, user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  flag_record RECORD;
  user_hash NUMERIC;
  rollout_threshold NUMERIC;
BEGIN
  -- Get the feature flag
  SELECT * INTO flag_record
  FROM feature_flags
  WHERE name = flag_name;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- If flag is fully enabled, return true
  IF flag_record.enabled = TRUE AND flag_record.rollout_percentage = 100 THEN
    RETURN TRUE;
  END IF;
  
  -- If flag is disabled, return false
  IF flag_record.enabled = FALSE THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate user hash for consistent rollout
  user_hash := (('x' || substr(md5(user_id_param::text || flag_name), 1, 8))::bit(32)::bigint % 100);
  rollout_threshold := flag_record.rollout_percentage;
  
  RETURN user_hash < rollout_threshold;
END;
$$;

-- Function to log AI activity
CREATE OR REPLACE FUNCTION log_ai_activity(
  agent_id_param VARCHAR,
  action_param TEXT,
  result_param TEXT DEFAULT NULL,
  context_param JSONB DEFAULT '{}',
  duration_ms_param INTEGER DEFAULT NULL,
  user_id_param UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO ai_activity (
    agent_id,
    action,
    result,
    task_context,
    execution_duration_ms,
    user_id
  ) VALUES (
    agent_id_param,
    action_param,
    result_param,
    context_param,
    duration_ms_param,
    user_id_param
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE notification_delivery_log TO authenticated;
GRANT ALL ON TABLE phone_verification_attempts TO authenticated;
GRANT ALL ON TABLE profile_activity_log TO authenticated;
GRANT EXECUTE ON FUNCTION check_feature_flag_rollout(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION log_ai_activity(VARCHAR, TEXT, TEXT, JSONB, INTEGER, UUID) TO authenticated;

-- Insert some default feature flags for the user profile system
INSERT INTO feature_flags (name, enabled, rollout_percentage, description) VALUES
('v2_profile_ui', false, 0, 'Enhanced profile UI with progressive disclosure'),
('phone_verification', true, 100, 'Phone number verification via SMS'),
('profile_completion_rewards', false, 25, 'Profile completion gamification features'),
('advanced_notifications', true, 50, 'Enhanced notification preferences'),
('wallet_v2', false, 0, 'New wallet interface for payment methods')
ON CONFLICT (name) DO UPDATE SET
  rollout_percentage = EXCLUDED.rollout_percentage,
  description = EXCLUDED.description;

-- Add comments for documentation
COMMENT ON COLUMN feature_flags.rollout_percentage IS 'Percentage of users who should see this feature (0-100)';
COMMENT ON COLUMN feature_flags.user_segments IS 'Array of user segments this flag applies to';
COMMENT ON TABLE notification_delivery_log IS 'Tracks SMS and email notification delivery status';
COMMENT ON TABLE phone_verification_attempts IS 'Tracks phone number verification attempts and status';
COMMENT ON TABLE profile_activity_log IS 'Logs user interactions with their profile for analytics';
COMMENT ON FUNCTION check_feature_flag_rollout(TEXT, UUID) IS 'Determines if a user should see a feature based on rollout percentage';
COMMENT ON FUNCTION log_ai_activity IS 'Logs AI agent actions for audit trail and monitoring';

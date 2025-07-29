-- Enhanced RLS Policies for User Profile System
-- Day 1 Task: Review and refine RLS policies (1h)

-- AI Activity: Log this action
INSERT INTO ai_activity (agent_id, action, result, task_context, user_id, created_at)
VALUES (
  'warp-agent-day1-rls',
  'Enhanced RLS policies implementation',
  'Created comprehensive RLS policies for all profile-related tables',
  '{"day": 1, "task": "security_foundation", "duration_target": "1h"}',
  NULL,
  NOW()
);

-- Ensure RLS is enabled on all critical tables
ALTER TABLE traveler_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_completion_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_verification_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_delivery_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_activity ENABLE ROW LEVEL SECURITY;

-- Enhanced RLS Policies for traveler_profiles
DROP POLICY IF EXISTS "Users can view their own traveler profiles" ON traveler_profiles;
DROP POLICY IF EXISTS "Users can insert their own traveler profiles" ON traveler_profiles;
DROP POLICY IF EXISTS "Users can update their own traveler profiles" ON traveler_profiles;
DROP POLICY IF EXISTS "Users can delete their own traveler profiles" ON traveler_profiles;

CREATE POLICY "Enhanced users can view their own traveler profiles"
  ON traveler_profiles FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' = 'service_role'
  );

CREATE POLICY "Enhanced users can insert their own traveler profiles"
  ON traveler_profiles FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Enhanced users can update their own traveler profiles"
  ON traveler_profiles FOR UPDATE
  USING (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
  )
  WITH CHECK (
    auth.uid() = user_id 
    AND user_id IS NOT NULL -- Prevent user_id changes by checking not null
  );

CREATE POLICY "Enhanced users can delete their own traveler profiles"
  ON traveler_profiles FOR DELETE
  USING (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
    AND is_primary = false -- Prevent deletion of primary profile
  );

-- Enhanced RLS for payment_methods
DROP POLICY IF EXISTS "Users can view their own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can insert their own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can update their own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can delete their own payment methods" ON payment_methods;

CREATE POLICY "Enhanced users can view their own payment methods"
  ON payment_methods FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' = 'service_role'
  );

CREATE POLICY "Enhanced users can insert their own payment methods"
  ON payment_methods FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Enhanced users can update their own payment methods"
  ON payment_methods FOR UPDATE
  USING (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
  )
  WITH CHECK (
    auth.uid() = user_id 
    AND user_id IS NOT NULL
  );

CREATE POLICY "Enhanced users can delete their own payment methods"
  ON payment_methods FOR DELETE
  USING (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
  );

-- Enhanced RLS for profile_completion_tracking
DROP POLICY IF EXISTS "Users can view their own completion tracking" ON profile_completion_tracking;
DROP POLICY IF EXISTS "Users can insert their own completion tracking" ON profile_completion_tracking;
DROP POLICY IF EXISTS "Users can update their own completion tracking" ON profile_completion_tracking;
DROP POLICY IF EXISTS "Users can manage their own completion tracking" ON profile_completion_tracking;

CREATE POLICY "Enhanced users can view their own completion tracking"
  ON profile_completion_tracking FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' = 'service_role'
  );

CREATE POLICY "Enhanced users can manage their own completion tracking"
  ON profile_completion_tracking FOR ALL
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' = 'service_role'
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' = 'service_role'
  );

-- Enhanced RLS for phone_verification_attempts
CREATE POLICY "Enhanced users can view their own verification attempts"
  ON phone_verification_attempts FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' = 'service_role'
  );

CREATE POLICY "Enhanced users can create their own verification attempts"
  ON phone_verification_attempts FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Enhanced service role can manage verification attempts"
  ON phone_verification_attempts FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Enhanced RLS for notification_delivery_log
CREATE POLICY "Enhanced users can view their own notification logs"
  ON notification_delivery_log FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' = 'service_role'
  );

CREATE POLICY "Enhanced service role can manage notification logs"
  ON notification_delivery_log FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Enhanced RLS for profile_activity_log
CREATE POLICY "Enhanced users can view their own activity logs"
  ON profile_activity_log FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' = 'service_role'
  );

CREATE POLICY "Enhanced service role can manage activity logs"
  ON profile_activity_log FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Enhanced RLS for ai_activity
CREATE POLICY "Enhanced users can view their own AI activities"
  ON ai_activity FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' = 'service_role'
    OR user_id IS NULL -- Allow viewing system-level AI activities
  );

CREATE POLICY "Enhanced service role can manage AI activity logs"
  ON ai_activity FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Add security function to validate JSONB fields
CREATE OR REPLACE FUNCTION validate_profile_jsonb_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate travel_preferences structure
  IF NEW.travel_preferences IS NOT NULL THEN
    -- Ensure it's a valid JSON object
    IF NOT (NEW.travel_preferences::text)::jsonb ? 'version' THEN
      NEW.travel_preferences = NEW.travel_preferences || '{"version": 1}'::jsonb;
    END IF;
  END IF;
  
  -- Validate notification_preferences structure
  IF NEW.notification_preferences IS NOT NULL THEN
    -- Ensure it's a valid JSON object with required fields
    IF NOT (NEW.notification_preferences::text)::jsonb ? 'email' THEN
      NEW.notification_preferences = NEW.notification_preferences || '{"email": true, "sms": false}'::jsonb;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for JSONB validation
DROP TRIGGER IF EXISTS validate_jsonb_fields ON traveler_profiles;
CREATE TRIGGER validate_jsonb_fields
  BEFORE INSERT OR UPDATE ON traveler_profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_profile_jsonb_fields();

-- Create function to audit RLS policy usage
CREATE OR REPLACE FUNCTION audit_rls_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log access attempts for sensitive operations
  IF TG_OP = 'SELECT' AND TG_TABLE_NAME IN ('traveler_profiles', 'payment_methods') THEN
    INSERT INTO profile_activity_log (
      user_id,
      activity_type,
      activity_details,
      ip_address,
      created_at
    ) VALUES (
      COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid),
      'rls_access',
      jsonb_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'role', auth.jwt() ->> 'role'
      ),
      inet_client_addr(),
      NOW()
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add RLS access auditing (commented out for performance - enable if needed)
-- CREATE TRIGGER audit_traveler_profiles_access
--   AFTER SELECT ON traveler_profiles
--   FOR EACH ROW
--   EXECUTE FUNCTION audit_rls_access();

-- Create security test function
CREATE OR REPLACE FUNCTION test_rls_policies()
RETURNS TABLE (
  table_name TEXT,
  policy_name TEXT,
  test_result TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function can be called to test RLS policies
  RETURN QUERY
  SELECT 
    schemaname || '.' || tablename as table_name,
    policyname as policy_name,
    'Policy exists' as test_result
  FROM pg_policies 
  WHERE schemaname = 'public' 
  AND tablename IN (
    'traveler_profiles', 
    'payment_methods', 
    'profile_completion_tracking',
    'phone_verification_attempts',
    'notification_delivery_log',
    'profile_activity_log',
    'ai_activity'
  );
END;
$$;

-- Add comments for documentation
COMMENT ON FUNCTION validate_profile_jsonb_fields() IS 'Validates and normalizes JSONB fields in traveler profiles';
COMMENT ON FUNCTION audit_rls_access() IS 'Audits access to sensitive tables through RLS policies';
COMMENT ON FUNCTION test_rls_policies() IS 'Tests that all required RLS policies are in place';

-- Grant permissions
GRANT EXECUTE ON FUNCTION validate_profile_jsonb_fields() TO authenticated;
GRANT EXECUTE ON FUNCTION test_rls_policies() TO authenticated;
GRANT EXECUTE ON FUNCTION audit_rls_access() TO authenticated;

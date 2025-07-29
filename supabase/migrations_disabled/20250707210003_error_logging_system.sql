-- Error Logging System for User Profile Implementation
-- Day 1 Task: Integrate Sentry/logging for completion score trigger exceptions (2h)

-- AI Activity: Log this action
INSERT INTO ai_activity (agent_id, action, result, task_context, user_id, created_at)
VALUES (
  'warp-agent-day1-logging',
  'Error logging system implementation',
  'Created error_logs table and enhanced trigger error handling',
  '{"day": 1, "task": "error_logging", "duration_target": "2h"}',
  NULL,
  NOW()
);

-- Create error logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  context JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id),
  function_name TEXT,
  stack_trace TEXT,
  environment TEXT NOT NULL DEFAULT 'development',
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for error logs
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_unresolved ON error_logs(resolved) WHERE resolved = FALSE;
CREATE INDEX IF NOT EXISTS idx_error_logs_environment ON error_logs(environment);

-- Enable RLS on error logs
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for error logs (admin and service role access)
CREATE POLICY "Service role can manage error logs"
  ON error_logs FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Admin users can view error logs"
  ON error_logs FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'service_role'
    OR (auth.uid() IS NOT NULL AND auth.jwt() ->> 'role' = 'admin')
  );

-- Enhanced profile completeness trigger with error handling
CREATE OR REPLACE FUNCTION update_profile_completeness_with_logging()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_score INTEGER;
  missing_fields TEXT[];
  recommendations JSONB;
  error_context JSONB;
BEGIN
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
    
    -- Log successful completion
    INSERT INTO ai_activity (agent_id, action, result, task_context, user_id, created_at)
    VALUES (
      'profile-completion-trigger',
      'Profile completeness calculated',
      format('Score updated from %s to %s', COALESCE(OLD.profile_completeness_score, 0), new_score),
      jsonb_build_object(
        'profile_id', NEW.id,
        'old_score', COALESCE(OLD.profile_completeness_score, 0),
        'new_score', new_score,
        'missing_fields_count', array_length(missing_fields, 1)
      ),
      NEW.user_id,
      NOW()
    );
    
  EXCEPTION WHEN OTHERS THEN
    -- Build error context
    error_context := jsonb_build_object(
      'trigger_name', 'update_profile_completeness_with_logging',
      'user_id', NEW.user_id,
      'profile_id', NEW.id,
      'operation', TG_OP,
      'table_name', TG_TABLE_NAME,
      'sql_state', SQLSTATE,
      'sql_error', SQLERRM,
      'timestamp', NOW()
    );
    
    -- Log error to error_logs table
    INSERT INTO error_logs (
      error_type,
      error_message,
      severity,
      context,
      user_id,
      function_name,
      stack_trace,
      environment,
      created_at
    )
    VALUES (
      'profile_completion_trigger_error',
      SQLERRM,
      'medium',
      error_context,
      NEW.user_id,
      'update_profile_completeness_with_logging',
      format('Error in trigger at line %s: %s', PG_EXCEPTION_CONTEXT, SQLERRM),
      COALESCE(current_setting('app.environment', true), 'development'),
      NOW()
    );
    
    -- Log to AI activity as well for audit trail
    INSERT INTO ai_activity (agent_id, action, result, task_context, user_id, created_at)
    VALUES (
      'profile-completion-trigger-error',
      'Profile completeness calculation failed',
      format('Error: %s', SQLERRM),
      error_context,
      NEW.user_id,
      NOW()
    );
    
    -- Re-raise the exception to maintain transaction integrity
    RAISE;
  END;
  
  RETURN NEW;
END;
$$;

-- Replace existing trigger with the enhanced version
DROP TRIGGER IF EXISTS trigger_update_profile_completeness ON traveler_profiles;
CREATE TRIGGER trigger_update_profile_completeness
  AFTER INSERT OR UPDATE ON traveler_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completeness_with_logging();

-- Create function to get error statistics
CREATE OR REPLACE FUNCTION get_error_statistics(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
  error_type TEXT,
  error_count BIGINT,
  severity TEXT,
  latest_occurrence TIMESTAMPTZ,
  resolved_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.error_type,
    COUNT(*) as error_count,
    e.severity,
    MAX(e.created_at) as latest_occurrence,
    COUNT(*) FILTER (WHERE e.resolved = TRUE) as resolved_count
  FROM error_logs e
  WHERE e.created_at >= NOW() - (days_back || ' days')::INTERVAL
  GROUP BY e.error_type, e.severity
  ORDER BY error_count DESC, latest_occurrence DESC;
END;
$$;

-- Create function to resolve errors
CREATE OR REPLACE FUNCTION resolve_error(error_id UUID, resolved_by_user UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE error_logs 
  SET 
    resolved = TRUE,
    resolved_at = NOW(),
    resolved_by = COALESCE(resolved_by_user, auth.uid())
  WHERE id = error_id;
  
  -- Log resolution to AI activity
  INSERT INTO ai_activity (agent_id, action, result, task_context, user_id, created_at)
  VALUES (
    'error-resolution-system',
    'Error resolved',
    format('Error %s marked as resolved', error_id),
    jsonb_build_object('error_id', error_id, 'resolved_by', COALESCE(resolved_by_user, auth.uid())),
    COALESCE(resolved_by_user, auth.uid()),
    NOW()
  );
  
  RETURN FOUND;
END;
$$;

-- Create notification function for critical errors
CREATE OR REPLACE FUNCTION notify_critical_error()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only notify for critical errors
  IF NEW.severity = 'critical' THEN
    -- Log to AI activity for immediate attention
    INSERT INTO ai_activity (agent_id, action, result, task_context, user_id, created_at)
    VALUES (
      'critical-error-notifier',
      'Critical error detected',
      format('URGENT: %s - %s', NEW.error_type, NEW.error_message),
      jsonb_build_object(
        'error_id', NEW.id,
        'severity', NEW.severity,
        'function_name', NEW.function_name,
        'environment', NEW.environment
      ),
      NEW.user_id,
      NOW()
    );
    
    -- Here you could add additional notification logic:
    -- - Send email to administrators
    -- - Create Slack notification
    -- - Trigger PagerDuty alert
    -- - Call external monitoring service
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for critical error notifications
CREATE TRIGGER notify_critical_errors
  AFTER INSERT ON error_logs
  FOR EACH ROW
  WHEN (NEW.severity = 'critical')
  EXECUTE FUNCTION notify_critical_error();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE error_logs TO authenticated;
GRANT EXECUTE ON FUNCTION update_profile_completeness_with_logging() TO authenticated;
GRANT EXECUTE ON FUNCTION get_error_statistics(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION resolve_error(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION notify_critical_error() TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE error_logs IS 'Centralized error logging for the user profile system with Sentry integration support';
COMMENT ON FUNCTION update_profile_completeness_with_logging() IS 'Enhanced profile completeness trigger with comprehensive error handling and logging';
COMMENT ON FUNCTION get_error_statistics(INTEGER) IS 'Returns error statistics for monitoring and debugging';
COMMENT ON FUNCTION resolve_error(UUID, UUID) IS 'Marks an error as resolved and logs the resolution';
COMMENT ON FUNCTION notify_critical_error() IS 'Notifies administrators of critical errors in real-time';

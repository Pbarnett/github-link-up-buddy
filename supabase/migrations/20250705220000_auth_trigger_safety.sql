-- Auth Trigger Safety Migration
-- Ensures all auth-related triggers are resilient and won't break user creation

-- Function to safely handle trigger errors
CREATE OR REPLACE FUNCTION handle_trigger_error(
  error_context TEXT,
  user_id UUID,
  error_detail TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log the error for debugging
  RAISE LOG 'Auth trigger error in %: User %, Error: %', error_context, user_id, error_detail;
  
  -- Could also insert into an error_log table for monitoring
  -- INSERT INTO auth_trigger_errors (context, user_id, error_message, created_at)
  -- VALUES (error_context, user_id, error_detail, NOW());
END;
$$;

-- Enhanced user preferences trigger function
CREATE OR REPLACE FUNCTION auto_detect_user_currency()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create user preferences with comprehensive error handling
  BEGIN
    INSERT INTO public.user_preferences (user_id, preferred_currency)
    VALUES (NEW.id, 'USD')
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE LOG 'Successfully created user preferences for user %', NEW.id;
    
  EXCEPTION
    WHEN insufficient_privilege THEN
      PERFORM handle_trigger_error('user_preferences_creation', NEW.id, 'Insufficient privileges');
    WHEN foreign_key_violation THEN
      PERFORM handle_trigger_error('user_preferences_creation', NEW.id, 'Foreign key violation');
    WHEN unique_violation THEN
      -- This is expected with ON CONFLICT, so just log it
      RAISE LOG 'User preferences already exist for user % (expected)', NEW.id;
    WHEN OTHERS THEN
      PERFORM handle_trigger_error('user_preferences_creation', NEW.id, SQLERRM);
  END;
  
  RETURN NEW;
END;
$$;

-- Drop and recreate the trigger to ensure it uses the new function
DROP TRIGGER IF EXISTS auto_create_user_preferences ON auth.users;

CREATE TRIGGER auto_create_user_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_detect_user_currency();

-- Create a function to validate auth setup
CREATE OR REPLACE FUNCTION validate_auth_setup()
RETURNS TABLE (
  check_name TEXT,
  status TEXT,
  details TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user_preferences table exists
  RETURN QUERY
  SELECT 
    'user_preferences_table'::TEXT,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'user_preferences')
      THEN 'PASS'::TEXT
      ELSE 'FAIL'::TEXT
    END,
    'Required for user creation triggers'::TEXT;
  
  -- Check if trigger exists
  RETURN QUERY
  SELECT 
    'auto_create_trigger'::TEXT,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'auto_create_user_preferences')
      THEN 'PASS'::TEXT
      ELSE 'FAIL'::TEXT
    END,
    'Required for automatic user preferences creation'::TEXT;
  
  -- Check if trigger function exists
  RETURN QUERY
  SELECT 
    'trigger_function'::TEXT,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'auto_detect_user_currency')
      THEN 'PASS'::TEXT
      ELSE 'FAIL'::TEXT
    END,
    'Required for user preferences trigger'::TEXT;
END;
$$;

-- Create a monitoring view for auth health
CREATE OR REPLACE VIEW auth_health_check AS
SELECT 
  'auth_system'::TEXT as component,
  COUNT(*)::TEXT as total_users,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END)::TEXT as users_last_24h,
  NOW()::TEXT as check_time
FROM auth.users
UNION ALL
SELECT 
  'user_preferences'::TEXT as component,
  COUNT(*)::TEXT as total_preferences,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END)::TEXT as preferences_last_24h,
  NOW()::TEXT as check_time
FROM user_preferences;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION validate_auth_setup() TO authenticated;
GRANT SELECT ON auth_health_check TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION auto_detect_user_currency() IS 
'Resilient trigger function that creates user preferences without failing user creation. Includes comprehensive error handling and logging.';

COMMENT ON FUNCTION validate_auth_setup() IS 
'Validates that all required auth components are properly configured. Use this to check auth system health.';

COMMENT ON VIEW auth_health_check IS 
'Provides overview of auth system health including user creation and preferences statistics.';

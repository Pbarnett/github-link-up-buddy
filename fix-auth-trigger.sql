-- Quick fix to disable the problematic user creation trigger
-- Run this in your Supabase SQL Editor

-- Temporarily disable the trigger that's causing OAuth failures
DROP TRIGGER IF EXISTS auto_create_user_preferences ON auth.users;

-- Optionally, create a simpler trigger that doesn't fail
CREATE OR REPLACE FUNCTION simple_user_setup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Try to create user preferences, but don't fail if it doesn't work
  BEGIN
    INSERT INTO user_preferences (user_id, preferred_currency)
    VALUES (NEW.id, 'USD')
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION
    WHEN others THEN
      -- Log the error but don't fail the user creation
      RAISE WARNING 'Failed to create user preferences for user %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$;

-- Create a new trigger that won't fail user creation
CREATE TRIGGER simple_auto_create_user_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION simple_user_setup();

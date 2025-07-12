-- Emergency fix - disable the problematic trigger temporarily
-- Run this first to allow user creation

-- 1. Drop the problematic trigger temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_update_profile_completeness ON traveler_profiles;

-- 2. Temporarily disable the existing handle_new_user trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Create a minimal, safe trigger that won't fail
CREATE OR REPLACE FUNCTION handle_new_user_minimal() 
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if the profile doesn't already exist
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = NEW.id) THEN
    INSERT INTO public.profiles (id, email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- If anything fails, just continue - don't block user creation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create a safe trigger
CREATE TRIGGER on_auth_user_created_minimal
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_minimal();

-- 5. Make sure RLS policies allow the service role to insert
CREATE POLICY IF NOT EXISTS "Service role can insert profiles" ON profiles
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- 6. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- 7. Clean up any existing conflicting user/profile
DELETE FROM profiles WHERE email = 'test.user@pf.dev';
DELETE FROM auth.users WHERE email = 'test.user@pf.dev';

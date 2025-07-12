-- Debug script to identify user creation issues
-- Run this in the Supabase SQL editor to diagnose the problem

-- 1. Check the current profiles table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check for any constraints that might be failing
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  cc.column_name,
  tc.table_name
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'profiles'
AND tc.table_schema = 'public';

-- 3. Check existing triggers on auth.users
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_schema = 'auth';

-- 4. Test what happens when we try to insert a user manually
-- First, let's see if we can insert into profiles directly
DO $$
BEGIN
  -- Try to insert a test profile
  INSERT INTO profiles (id, email, first_name, last_name, personalization_enabled, last_login_at, loyalty_tier)
  VALUES (
    gen_random_uuid(),
    'debug.test@example.com',
    'Debug',
    'Test',
    true,
    NOW(),
    'standard'
  );
  
  RAISE NOTICE 'Direct profile insertion successful';
  
  -- Clean up
  DELETE FROM profiles WHERE email = 'debug.test@example.com';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Direct profile insertion failed: % %', SQLSTATE, SQLERRM;
END $$;

-- 5. Check if there are any existing users that might cause conflicts
SELECT 
  id, 
  email, 
  created_at,
  email_confirmed_at,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'test.user@pf.dev'
LIMIT 1;

-- 6. Check if there are any profiles with this email already
SELECT 
  id, 
  email, 
  first_name, 
  last_name,
  created_at
FROM profiles 
WHERE email = 'test.user@pf.dev'
LIMIT 1;

-- 7. Check the handle_new_user function
SELECT 
  routine_name,
  routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
AND routine_schema = 'public';

-- 8. Check if there are any policies that might be blocking the insertion
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles'
AND schemaname = 'public';

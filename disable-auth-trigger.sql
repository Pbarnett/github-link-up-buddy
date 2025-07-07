-- PARKER FLIGHT UPDATE: Disable Problematic Auth Trigger
-- This addresses the OAuth login failures caused by database trigger errors
-- Fixes the issue described in auth-research-findings.md

-- 1. Disable the current trigger that's blocking user creation
DROP TRIGGER IF EXISTS auto_create_user_preferences ON auth.users;
DROP TRIGGER IF EXISTS simple_auto_create_user_preferences ON auth.users;

-- 2. Clean up any trigger functions that might cause issues
DROP FUNCTION IF EXISTS auto_detect_user_currency() CASCADE;
DROP FUNCTION IF EXISTS simple_user_setup() CASCADE;

-- 3. Verification: Check that no triggers remain on auth.users
-- Run this to verify triggers are removed:
-- SELECT * FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass;

-- 4. Optional: Clean up orphaned error handling function if not needed elsewhere
-- DROP FUNCTION IF EXISTS handle_trigger_error(TEXT, UUID, TEXT) CASCADE;

COMMENT ON SCHEMA auth IS 'Parker Flight Update: Database triggers removed to fix OAuth failures. User setup now handled via Edge Functions for better reliability.';

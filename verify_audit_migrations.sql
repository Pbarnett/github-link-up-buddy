-- =============================================================================
-- AUDIT MIGRATION VERIFICATION SCRIPT
-- =============================================================================
-- This script verifies that all critical audit gaps have been addressed
-- Run this against your Supabase database to confirm schema changes

\echo '🔍 Starting audit migration verification...'
\echo ''

-- =============================================================================
-- 1. VERIFY booking_attempts TABLE
-- =============================================================================
\echo '1️⃣ Checking booking_attempts table...'

-- Check table exists with correct structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'booking_attempts'
ORDER BY ordinal_position;

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'booking_attempts';

-- Check policies exist
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'booking_attempts';

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' AND tablename = 'booking_attempts';

\echo '✅ booking_attempts verification complete'
\echo ''

-- =============================================================================
-- 2. VERIFY flight_offers EXTENSIONS
-- =============================================================================
\echo '2️⃣ Checking flight_offers table extensions...'

-- Check new columns exist
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'flight_offers'
  AND column_name IN ('user_id', 'offer_id', 'expires_at', 'price_currency', 'price_amount', 'status', 'updated_at')
ORDER BY column_name;

-- Check unique constraint on offer_id
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name = 'flight_offers'
  AND tc.constraint_type = 'UNIQUE'
  AND kcu.column_name = 'offer_id';

-- Check performance indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename = 'flight_offers'
  AND indexname LIKE '%user_status%' 
   OR indexname LIKE '%expires_at%'
   OR indexname LIKE '%offer_id%';

-- Check updated RLS policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'flight_offers';

-- Check trigger exists
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table = 'flight_offers'
  AND trigger_name LIKE '%updated_at%';

\echo '✅ flight_offers extensions verification complete'
\echo ''

-- =============================================================================
-- 3. VERIFY bookings TABLE EXTENSIONS
-- =============================================================================
\echo '3️⃣ Checking bookings table extensions...'

-- Check new columns exist
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'bookings'
  AND column_name IN ('offer_id', 'order_id', 'payment_intent_id')
ORDER BY column_name;

-- Check unique index on order_id
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename = 'bookings'
  AND indexname LIKE '%order_id%';

-- Check performance indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename = 'bookings'
  AND (indexname LIKE '%offer_id%' OR indexname LIKE '%payment_intent%');

\echo '✅ bookings extensions verification complete'
\echo ''

-- =============================================================================
-- 4. VERIFY SCHEDULED JOBS
-- =============================================================================
\echo '4️⃣ Checking scheduled cron jobs...'

-- Check cron extension is available
SELECT name, default_version, installed_version 
FROM pg_available_extensions 
WHERE name = 'pg_cron';

-- Check scheduled jobs exist (if pg_cron is installed)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        RAISE NOTICE 'pg_cron extension is installed';
        
        -- List scheduled jobs
        PERFORM * FROM cron.job WHERE jobname IN ('cleanup_expired_offers', 'anonymize_passenger_pii');
        
    ELSE
        RAISE NOTICE 'pg_cron extension not installed - scheduled jobs will be created when available';
    END IF;
END $$;

\echo '✅ scheduled jobs verification complete'
\echo ''

-- =============================================================================
-- 5. VERIFY DATA INTEGRITY
-- =============================================================================
\echo '5️⃣ Running data integrity checks...'

-- Check if historical flight_offers have user_id populated
SELECT 
    COUNT(*) as total_offers,
    COUNT(user_id) as offers_with_user_id,
    COUNT(*) - COUNT(user_id) as missing_user_id
FROM public.flight_offers;

-- Check for any constraint violations
SELECT 
    'booking_attempts' as table_name,
    COUNT(*) as row_count,
    COUNT(DISTINCT idempotency_key) as unique_keys,
    CASE WHEN COUNT(*) = COUNT(DISTINCT idempotency_key) 
         THEN '✅ No duplicates' 
         ELSE '❌ Duplicate keys found' 
    END as idempotency_check
FROM public.booking_attempts
UNION ALL
SELECT 
    'flight_offers' as table_name,
    COUNT(*) as row_count,
    COUNT(DISTINCT offer_id) as unique_offers,
    CASE WHEN COUNT(offer_id) = COUNT(DISTINCT offer_id) 
         THEN '✅ No duplicates' 
         ELSE '❌ Duplicate offer_ids found' 
    END as uniqueness_check
FROM public.flight_offers
WHERE offer_id IS NOT NULL;

\echo '✅ data integrity checks complete'
\echo ''

-- =============================================================================
-- 6. VERIFY FUNCTION SCHEMAS
-- =============================================================================
\echo '6️⃣ Checking supporting functions...'

-- Check trigger functions exist
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('update_updated_at_column', 'update_booking_updated_at');

\echo '✅ function schemas verification complete'
\echo ''

-- =============================================================================
-- 7. SUMMARY REPORT
-- =============================================================================
\echo '📊 AUDIT MIGRATION SUMMARY REPORT'
\echo '=================================='

-- Table existence check
SELECT 
    'Tables' as category,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'booking_attempts')
         THEN '✅ booking_attempts exists'
         ELSE '❌ booking_attempts missing'
    END as status
UNION ALL
SELECT 
    'Columns' as category,
    CASE WHEN (
        SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'flight_offers'
          AND column_name IN ('user_id', 'offer_id', 'expires_at', 'status')
    ) = 4 THEN '✅ flight_offers extended'
         ELSE '❌ flight_offers incomplete'
    END as status
UNION ALL
SELECT 
    'Columns' as category,
    CASE WHEN (
        SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'bookings'
          AND column_name IN ('offer_id', 'order_id', 'payment_intent_id')
    ) = 3 THEN '✅ bookings extended'
         ELSE '❌ bookings incomplete'
    END as status
UNION ALL
SELECT 
    'Security' as category,
    CASE WHEN (
        SELECT COUNT(*) FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename = 'booking_attempts'
    ) >= 2 THEN '✅ RLS policies active'
         ELSE '❌ RLS policies missing'
    END as status
UNION ALL
SELECT 
    'Performance' as category,
    CASE WHEN (
        SELECT COUNT(*) FROM pg_indexes 
        WHERE schemaname = 'public' 
          AND tablename IN ('booking_attempts', 'flight_offers', 'bookings')
          AND indexname LIKE '%_idx'
    ) >= 6 THEN '✅ Performance indexes created'
         ELSE '❌ Some indexes missing'
    END as status;

\echo ''
\echo '🎉 Audit migration verification complete!'
\echo 'Review the output above for any ❌ items that need attention.'

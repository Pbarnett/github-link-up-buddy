-- Verify Duffel Integration Deployment
-- Run this to check that everything is set up correctly

-- Check database functions exist
SELECT proname, prosrc FROM pg_proc WHERE proname IN ('create_booking_attempt', 'update_booking_status');

-- Check booking_monitoring view exists
SELECT * FROM booking_monitoring LIMIT 1;

-- Check feature flags
SELECT * FROM feature_flags WHERE name LIKE 'duffel_%' OR name LIKE 'auto_%';

-- Check booking_attempts table structure
SELECT column_name, data_type, is_nullable FROM information_schema.columns 
WHERE table_name = 'booking_attempts' 
ORDER BY ordinal_position;

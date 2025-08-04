-- Create cleanup cron jobs for expired offers and PII anonymization
-- This addresses gaps #27 and #28: Cleanup cron jobs

-- Create function to cleanup expired flight offers
CREATE OR REPLACE FUNCTION cleanup_expired_flight_offers()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    cleanup_result jsonb;
    expired_count integer := 0;
    anonymized_count integer := 0;
    start_time timestamptz := now();
BEGIN
    -- Delete expired flight offers older than 7 days
    WITH deleted_offers AS (
        DELETE FROM public.flight_offers 
        WHERE expires_at < now() - interval '7 days'
        OR (expires_at IS NULL AND created_at < now() - interval '30 days')
        RETURNING id
    )
    SELECT count(*) INTO expired_count FROM deleted_offers;
    
    -- Also cleanup flight_offers_v2 if it exists
    BEGIN
        WITH deleted_offers_v2 AS (
            DELETE FROM public.flight_offers_v2 
            WHERE created_at < now() - interval '30 days'
            RETURNING id
        )
        SELECT count(*) INTO anonymized_count FROM deleted_offers_v2;
    EXCEPTION
        WHEN undefined_table THEN
            -- Table doesn't exist, skip
            anonymized_count := 0;
    END;
    
    -- Log the cleanup operation
    INSERT INTO cleanup_audit_log (
        cleanup_type,
        records_processed,
        details,
        executed_at
    ) VALUES (
        'expired_offers',
        expired_count + anonymized_count,
        jsonb_build_object(
            'flight_offers_deleted', expired_count,
            'flight_offers_v2_deleted', anonymized_count,
            'execution_time_ms', extract(epoch from (now() - start_time)) * 1000
        ),
        now()
    );
    
    cleanup_result := jsonb_build_object(
        'success', true,
        'expired_offers_deleted', expired_count,
        'v2_offers_deleted', anonymized_count,
        'total_deleted', expired_count + anonymized_count,
        'execution_time_ms', extract(epoch from (now() - start_time)) * 1000
    );
    
    RETURN cleanup_result;
END;
$$;

-- Create function to anonymize old PII data
CREATE OR REPLACE FUNCTION anonymize_old_pii_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    cleanup_result jsonb;
    anonymized_bookings integer := 0;
    anonymized_profiles integer := 0;
    start_time timestamptz := now();
    cutoff_date timestamptz;
BEGIN
    -- Anonymize PII older than 90 days (configurable)
    cutoff_date := now() - interval '90 days';
    
    -- Anonymize old booking requests traveler data
    WITH anonymized_booking_requests AS (
        UPDATE public.booking_requests 
        SET traveler_data = jsonb_build_object(
            'first_name', 'ANONYMIZED',
            'last_name', 'USER',
            'date_of_birth', '1900-01-01',
            'passport_number', NULL,
            'phone_number', NULL,
            'email', 'anonymized@example.com',
            'anonymized_at', now()
        )
        WHERE created_at < cutoff_date 
        AND traveler_data IS NOT NULL
        AND NOT (traveler_data ? 'anonymized_at')
        RETURNING id
    )
    SELECT count(*) INTO anonymized_bookings FROM anonymized_booking_requests;
    
    -- Anonymize old profiles (keep minimal data for analytics)
    WITH anonymized_profile_data AS (
        UPDATE public.profiles 
        SET 
            first_name = 'Anonymous',
            last_name = 'User',
            phone = NULL,
            email = 'anonymized+' || substring(id::text from 1 for 8) || '@example.com'
        WHERE created_at < cutoff_date 
        AND first_name != 'Anonymous'
        RETURNING id
    )
    SELECT count(*) INTO anonymized_profiles FROM anonymized_profile_data;
    
    -- Log PII anonymization audit entries
    INSERT INTO pii_anonymization_log (
        passenger_id,
        anonymized_at,
        reason
    )
    SELECT 
        gen_random_uuid(), -- We don't have individual passenger IDs for bulk operations
        now(),
        'AUTOMATED_90_DAY_CLEANUP'
    WHERE anonymized_bookings > 0 OR anonymized_profiles > 0;
    
    -- Log the cleanup operation
    INSERT INTO cleanup_audit_log (
        cleanup_type,
        records_processed,
        details,
        executed_at
    ) VALUES (
        'pii_anonymization',
        anonymized_bookings + anonymized_profiles,
        jsonb_build_object(
            'anonymized_booking_requests', anonymized_bookings,
            'anonymized_profiles', anonymized_profiles,
            'cutoff_date', cutoff_date,
            'execution_time_ms', extract(epoch from (now() - start_time)) * 1000
        ),
        now()
    );
    
    cleanup_result := jsonb_build_object(
        'success', true,
        'anonymized_booking_requests', anonymized_bookings,
        'anonymized_profiles', anonymized_profiles,
        'total_anonymized', anonymized_bookings + anonymized_profiles,
        'cutoff_date', cutoff_date,
        'execution_time_ms', extract(epoch from (now() - start_time)) * 1000
    );
    
    RETURN cleanup_result;
END;
$$;

-- Create function to cleanup old booking attempts
CREATE OR REPLACE FUNCTION cleanup_old_booking_attempts()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    cleanup_result jsonb;
    deleted_count integer := 0;
    start_time timestamptz := now();
BEGIN
    -- Delete booking attempts older than 30 days (keep recent for debugging)
    WITH deleted_attempts AS (
        DELETE FROM public.booking_attempts 
        WHERE created_at < now() - interval '30 days'
        AND status IN ('failed', 'succeeded')  -- Keep pending ones
        RETURNING id
    )
    SELECT count(*) INTO deleted_count FROM deleted_attempts;
    
    -- Log the cleanup operation
    INSERT INTO cleanup_audit_log (
        cleanup_type,
        records_processed,
        details,
        executed_at
    ) VALUES (
        'old_booking_attempts',
        deleted_count,
        jsonb_build_object(
            'deleted_attempts', deleted_count,
            'execution_time_ms', extract(epoch from (now() - start_time)) * 1000
        ),
        now()
    );
    
    cleanup_result := jsonb_build_object(
        'success', true,
        'deleted_attempts', deleted_count,
        'execution_time_ms', extract(epoch from (now() - start_time)) * 1000
    );
    
    RETURN cleanup_result;
END;
$$;

-- Create audit table for cleanup operations
CREATE TABLE IF NOT EXISTS cleanup_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cleanup_type text NOT NULL,
    records_processed integer NOT NULL DEFAULT 0,
    details jsonb,
    executed_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS cleanup_audit_log_type_date_idx 
    ON cleanup_audit_log (cleanup_type, executed_at DESC);

-- Enable RLS on audit table
ALTER TABLE cleanup_audit_log ENABLE ROW LEVEL SECURITY;

-- Only service role can access cleanup logs
CREATE POLICY "service_role_cleanup_logs" ON cleanup_audit_log
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

-- Schedule the cleanup jobs using pg_cron (if available)
-- These will be created when pg_cron extension is available

-- Job 1: Cleanup expired offers daily at 2 AM
SELECT cron.schedule(
    'cleanup_expired_offers',
    '0 2 * * *',  -- Daily at 2 AM
    'SELECT cleanup_expired_flight_offers();'
) WHERE EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron');

-- Job 2: Anonymize old PII weekly on Sundays at 3 AM
SELECT cron.schedule(
    'anonymize_old_pii',
    '0 3 * * 0',  -- Weekly on Sunday at 3 AM
    'SELECT anonymize_old_pii_data();'
) WHERE EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron');

-- Job 3: Cleanup old booking attempts weekly on Sundays at 4 AM
SELECT cron.schedule(
    'cleanup_booking_attempts',
    '0 4 * * 0',  -- Weekly on Sunday at 4 AM
    'SELECT cleanup_old_booking_attempts();'
) WHERE EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron');

-- Create a function to manually trigger all cleanup jobs (for testing)
CREATE OR REPLACE FUNCTION run_all_cleanup_jobs()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
    offers_result jsonb;
    pii_result jsonb;
    attempts_result jsonb;
    start_time timestamptz := now();
BEGIN
    -- Run all cleanup jobs
    SELECT cleanup_expired_flight_offers() INTO offers_result;
    SELECT anonymize_old_pii_data() INTO pii_result;
    SELECT cleanup_old_booking_attempts() INTO attempts_result;
    
    result := jsonb_build_object(
        'success', true,
        'expired_offers', offers_result,
        'pii_anonymization', pii_result,
        'booking_attempts', attempts_result,
        'total_execution_time_ms', extract(epoch from (now() - start_time)) * 1000,
        'executed_at', now()
    );
    
    RETURN result;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION cleanup_expired_flight_offers TO service_role;
GRANT EXECUTE ON FUNCTION anonymize_old_pii_data TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_old_booking_attempts TO service_role;
GRANT EXECUTE ON FUNCTION run_all_cleanup_jobs TO service_role;

-- Comments for documentation
COMMENT ON FUNCTION cleanup_expired_flight_offers IS 'Removes expired flight offers older than 7 days';
COMMENT ON FUNCTION anonymize_old_pii_data IS 'Anonymizes PII data older than 90 days for GDPR compliance';
COMMENT ON FUNCTION cleanup_old_booking_attempts IS 'Removes old booking attempts to prevent table bloat';
COMMENT ON FUNCTION run_all_cleanup_jobs IS 'Manually triggers all cleanup jobs for testing/admin use';
COMMENT ON TABLE cleanup_audit_log IS 'Audit log for all automated cleanup operations';

-- Create a monitoring view for cleanup job status
CREATE OR REPLACE VIEW cleanup_job_status AS
SELECT 
    cleanup_type,
    COUNT(*) as total_runs,
    MAX(executed_at) as last_run,
    SUM(records_processed) as total_records_processed,
    AVG((details->>'execution_time_ms')::numeric) as avg_execution_time_ms,
    MAX((details->>'execution_time_ms')::numeric) as max_execution_time_ms
FROM cleanup_audit_log 
GROUP BY cleanup_type
ORDER BY last_run DESC;

-- Grant access to monitoring view
GRANT SELECT ON cleanup_job_status TO authenticated;

-- Insert initial message about pg_cron requirement
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        RAISE NOTICE 'pg_cron extension not found. Cleanup jobs will need to be scheduled manually or via external cron.';
        RAISE NOTICE 'To install pg_cron: CREATE EXTENSION pg_cron;';
        RAISE NOTICE 'Then run this migration again to schedule the jobs.';
    ELSE
        RAISE NOTICE 'Cleanup jobs scheduled successfully with pg_cron.';
    END IF;
END $$;

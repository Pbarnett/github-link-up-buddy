-- Automated cleanup jobs for expired offers and PII anonymization
-- This addresses gap #27 and #28: cleanup cron removes expired offers and anonymizes PII

-- Step 1: Create cleanup function for expired offers
CREATE OR REPLACE FUNCTION cleanup_expired_offers()
RETURNS TABLE(deleted_offers INTEGER, anonymized_bookings INTEGER) AS $$
DECLARE
    expired_cutoff TIMESTAMPTZ;
    deleted_count INTEGER := 0;
    anonymized_count INTEGER := 0;
BEGIN
    -- Define expiration cutoff (24 hours ago)
    expired_cutoff := NOW() - INTERVAL '24 hours';
    
    -- Delete expired flight offers
    WITH deleted AS (
        DELETE FROM public.flight_offers 
        WHERE expires_at < expired_cutoff
           OR (expires_at IS NULL AND created_at < expired_cutoff)
        RETURNING id
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted;
    
    -- Anonymize old booking records (older than 7 years for GDPR compliance)
    WITH anonymized AS (
        UPDATE public.flight_bookings 
        SET booking_data = jsonb_build_object(
                'anonymized', true,
                'anonymized_at', NOW(),
                'original_passenger_count', passenger_count
            ),
            updated_at = NOW()
        WHERE created_at < NOW() - INTERVAL '7 years'
          AND booking_data IS NOT NULL
          AND NOT (booking_data ? 'anonymized')
        RETURNING id
    )
    SELECT COUNT(*) INTO anonymized_count FROM anonymized;
    
    -- Log cleanup activity
    INSERT INTO public.cleanup_audit_log (
        cleanup_type,
        records_processed,
        details,
        executed_at
    ) VALUES (
        'cleanup_expired_offers',
        deleted_count + anonymized_count,
        jsonb_build_object(
            'deleted_offers', deleted_count,
            'anonymized_bookings', anonymized_count,
            'expired_cutoff', expired_cutoff
        ),
        NOW()
    );
    
    RETURN QUERY SELECT deleted_count, anonymized_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create PII anonymization function
CREATE OR REPLACE FUNCTION anonymize_old_pii()
RETURNS TABLE(anonymized_passengers INTEGER, cleared_pii INTEGER) AS $$
DECLARE
    pii_cutoff TIMESTAMPTZ;
    passenger_count INTEGER := 0;
    pii_count INTEGER := 0;
BEGIN
    -- Define PII retention cutoff (2 years for most personal data)
    pii_cutoff := NOW() - INTERVAL '2 years';
    
    -- Anonymize passenger records
    WITH anonymized_passengers AS (
        UPDATE public.passengers 
        SET passenger_info = jsonb_build_object(
                'anonymized', true,
                'anonymized_at', NOW(),
                'original_record_date', created_at
            ),
            pii_encrypted = NULL,
            updated_at = NOW()
        WHERE created_at < pii_cutoff
          AND passenger_info IS NOT NULL
          AND NOT (passenger_info ? 'anonymized')
        RETURNING id
    )
    SELECT COUNT(*) INTO passenger_count FROM anonymized_passengers;
    
    -- Clear encrypted PII that's beyond retention period
    WITH cleared_pii AS (
        UPDATE public.passengers 
        SET pii_encrypted = NULL,
            updated_at = NOW()
        WHERE created_at < pii_cutoff
          AND pii_encrypted IS NOT NULL
        RETURNING id
    )
    SELECT COUNT(*) INTO pii_count FROM cleared_pii;
    
    -- Log PII cleanup activity
    INSERT INTO public.cleanup_audit_log (
        cleanup_type,
        records_processed,
        details,
        executed_at
    ) VALUES (
        'anonymize_old_pii',
        passenger_count + pii_count,
        jsonb_build_object(
            'anonymized_passengers', passenger_count,
            'cleared_pii', pii_count,
            'pii_cutoff', pii_cutoff
        ),
        NOW()
    );
    
    RETURN QUERY SELECT passenger_count, pii_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create audit log table for cleanup operations (use consistent column names)
CREATE TABLE IF NOT EXISTS public.cleanup_audit_log (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cleanup_type      text NOT NULL,  -- Use same column name as other migration
    records_processed integer NOT NULL DEFAULT 0,
    details           jsonb,
    executed_at       timestamptz NOT NULL DEFAULT NOW(),
    execution_time_ms integer
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS cleanup_audit_log_operation_date_idx 
    ON public.cleanup_audit_log (cleanup_type, executed_at);

-- Step 4: Create combined cleanup function
CREATE OR REPLACE FUNCTION run_automated_cleanup()
RETURNS jsonb AS $$
DECLARE
    start_time TIMESTAMPTZ;
    end_time TIMESTAMPTZ;
    offers_result RECORD;
    pii_result RECORD;
    total_processed INTEGER := 0;
    cleanup_summary jsonb;
BEGIN
    start_time := NOW();
    
    -- Run expired offers cleanup
    SELECT * INTO offers_result FROM cleanup_expired_offers();
    total_processed := total_processed + offers_result.deleted_offers + offers_result.anonymized_bookings;
    
    -- Run PII anonymization
    SELECT * INTO pii_result FROM anonymize_old_pii();
    total_processed := total_processed + pii_result.anonymized_passengers + pii_result.cleared_pii;
    
    end_time := NOW();
    
    -- Build summary
    cleanup_summary := jsonb_build_object(
        'success', true,
        'started_at', start_time,
        'completed_at', end_time,
        'duration_ms', EXTRACT(EPOCH FROM (end_time - start_time)) * 1000,
        'total_records_processed', total_processed,
        'operations', jsonb_build_object(
            'expired_offers', jsonb_build_object(
                'deleted_offers', offers_result.deleted_offers,
                'anonymized_bookings', offers_result.anonymized_bookings
            ),
            'pii_anonymization', jsonb_build_object(
                'anonymized_passengers', pii_result.anonymized_passengers,
                'cleared_pii', pii_result.cleared_pii
            )
        )
    );
    
    -- Log overall cleanup execution
    INSERT INTO public.cleanup_audit_log (
        cleanup_type,
        records_processed,
        details,
        executed_at,
        execution_time_ms
    ) VALUES (
        'automated_cleanup_run',
        total_processed,
        cleanup_summary,
        start_time,
        EXTRACT(EPOCH FROM (end_time - start_time)) * 1000
    );
    
    RETURN cleanup_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Schedule the cleanup job to run daily at 2 AM UTC
SELECT cron.schedule(
    'automated-cleanup-job',
    '0 2 * * *',  -- Daily at 2 AM UTC
    'SELECT run_automated_cleanup();'
);

-- Step 6: Add comments for documentation
COMMENT ON FUNCTION cleanup_expired_offers() IS 'Removes expired flight offers and anonymizes old booking records';
COMMENT ON FUNCTION anonymize_old_pii() IS 'Anonymizes PII data beyond retention period for GDPR compliance';
COMMENT ON FUNCTION run_automated_cleanup() IS 'Combined cleanup function executed by cron job daily';
COMMENT ON TABLE public.cleanup_audit_log IS 'Audit trail for all automated cleanup operations';

-- Step 7: Grant execution permissions
GRANT EXECUTE ON FUNCTION cleanup_expired_offers() TO service_role;
GRANT EXECUTE ON FUNCTION anonymize_old_pii() TO service_role;
GRANT EXECUTE ON FUNCTION run_automated_cleanup() TO service_role;

-- Migration: PII Cleanup Cron Job (Batch 2 - Requirement #28)
-- Description: Anonymize passenger PII after flight date + 90 days retention period
-- Date: 2025-01-27

-- Ensure pg_cron extension is available
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create function to anonymize expired PII
CREATE OR REPLACE FUNCTION anonymize_expired_pii()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    affected_rows INTEGER := 0;
    audit_count INTEGER := 0;
BEGIN
    -- Anonymize expired PII records
    UPDATE public.encrypted_passenger_profiles
    SET 
        encrypted_first_name = encrypt_pii_field('ANONYMIZED'),
        encrypted_last_name = encrypt_pii_field('ANONYMIZED'),
        encrypted_date_of_birth = encrypt_pii_field('1900-01-01'),
        encrypted_passport_number = encrypt_pii_field('ANONYMIZED'),
        encrypted_passport_country = encrypt_pii_field('XX'),
        encrypted_nationality = encrypt_pii_field('XX'),
        encrypted_phone_number = encrypt_pii_field('ANONYMIZED'),
        encrypted_email = encrypt_pii_field('anonymized@example.com'),
        encrypted_emergency_contact = encrypt_pii_field('ANONYMIZED'),
        is_anonymized = true,
        updated_at = NOW()
    WHERE retention_expires_at < NOW()
        AND is_anonymized = false;
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    
    -- Log anonymization activity
    IF affected_rows > 0 THEN
        INSERT INTO public.pii_encryption_audit (
            user_id,
            profile_id,
            action,
            performed_by,
            created_at
        )
        SELECT 
            user_id,
            id,
            'anonymize',
            'system',
            NOW()
        FROM public.encrypted_passenger_profiles
        WHERE retention_expires_at < NOW()
            AND is_anonymized = true
            AND updated_at > NOW() - INTERVAL '1 minute';
        
        GET DIAGNOSTICS audit_count = ROW_COUNT;
        
        -- Log the cleanup operation
        RAISE NOTICE 'PII Cleanup completed: % profiles anonymized, % audit records created', 
            affected_rows, audit_count;
    END IF;
    
    RETURN affected_rows;
END;
$$;

-- Create function to clean up old audit logs (keep for 2 years)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_rows INTEGER := 0;
BEGIN
    DELETE FROM public.pii_encryption_audit
    WHERE created_at < NOW() - INTERVAL '2 years';
    
    GET DIAGNOSTICS deleted_rows = ROW_COUNT;
    
    IF deleted_rows > 0 THEN
        RAISE NOTICE 'Audit cleanup completed: % old audit records deleted', deleted_rows;
    END IF;
    
    RETURN deleted_rows;
END;
$$;

-- Schedule PII cleanup cron job to run daily at 2 AM
SELECT cron.schedule(
    'anonymize_expired_pii',
    '0 2 * * *',
    'SELECT anonymize_expired_pii();'
);

-- Schedule audit log cleanup to run weekly on Sundays at 3 AM
SELECT cron.schedule(
    'cleanup_pii_audit_logs',
    '0 3 * * 0',
    'SELECT cleanup_old_audit_logs();'
);

-- Create a monitoring function to track PII cleanup metrics
CREATE OR REPLACE FUNCTION get_pii_cleanup_metrics()
RETURNS TABLE (
    total_profiles INTEGER,
    anonymized_profiles INTEGER,
    pending_anonymization INTEGER,
    days_until_next_cleanup INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(*)::INTEGER as total,
            COUNT(*) FILTER (WHERE is_anonymized = true)::INTEGER as anonymized,
            COUNT(*) FILTER (WHERE retention_expires_at < NOW() AND is_anonymized = false)::INTEGER as pending,
            COALESCE(
                MIN(EXTRACT(DAY FROM (retention_expires_at - NOW())))::INTEGER,
                0
            ) as days_until_next
        FROM public.encrypted_passenger_profiles
        WHERE retention_expires_at IS NOT NULL
    )
    SELECT 
        s.total,
        s.anonymized,
        s.pending,
        CASE 
            WHEN s.days_until_next < 0 THEN 0 
            ELSE s.days_until_next 
        END
    FROM stats s;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION anonymize_expired_pii() TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_old_audit_logs() TO service_role;
GRANT EXECUTE ON FUNCTION get_pii_cleanup_metrics() TO authenticated, service_role;

-- Create view for PII retention monitoring (admin access only)
CREATE OR REPLACE VIEW pii_retention_status AS
SELECT 
    id,
    user_id,
    profile_type,
    is_anonymized,
    retention_expires_at,
    CASE 
        WHEN retention_expires_at IS NULL THEN 'No retention set'
        WHEN retention_expires_at < NOW() AND is_anonymized = false THEN 'Expired - pending anonymization'
        WHEN retention_expires_at < NOW() AND is_anonymized = true THEN 'Expired - anonymized'
        ELSE 'Active - ' || EXTRACT(DAY FROM (retention_expires_at - NOW())) || ' days remaining'
    END as retention_status,
    created_at,
    updated_at
FROM public.encrypted_passenger_profiles
ORDER BY retention_expires_at ASC NULLS LAST;

-- Enable RLS on the view
ALTER VIEW pii_retention_status SET (security_barrier = true);

-- Create policy for the view (service role only)
CREATE POLICY "Service role can view PII retention status"
    ON public.encrypted_passenger_profiles FOR SELECT
    USING (current_setting('role') = 'service_role');

-- Comments for documentation
COMMENT ON FUNCTION anonymize_expired_pii() IS 'Anonymizes PII data for profiles past their retention period (flight date + 90 days)';
COMMENT ON FUNCTION cleanup_old_audit_logs() IS 'Removes audit logs older than 2 years to manage storage';
COMMENT ON FUNCTION get_pii_cleanup_metrics() IS 'Returns metrics about PII cleanup status for monitoring';
COMMENT ON VIEW pii_retention_status IS 'Administrative view showing PII retention status for all profiles';

-- Log successful cron job setup
DO $$
BEGIN
    RAISE NOTICE 'PII cleanup cron jobs configured successfully:';
    RAISE NOTICE '- Daily PII anonymization at 2:00 AM';
    RAISE NOTICE '- Weekly audit log cleanup on Sundays at 3:00 AM';
    RAISE NOTICE '- Monitoring functions available for tracking cleanup metrics';
END;
$$;

-- Complete Database Fix Script for Duffel Integration
-- Execute this in Supabase Dashboard SQL Editor
-- This will create all missing components to get 100% test success

-- ============================================================================
-- Step 1: Ensure duffel_webhook_events table exists
-- ============================================================================
CREATE TABLE IF NOT EXISTS duffel_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    booking_attempt_id UUID REFERENCES booking_attempts(id),
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON duffel_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON duffel_webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_events_booking_attempt ON duffel_webhook_events(booking_attempt_id);

-- Enable RLS
ALTER TABLE duffel_webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policy for webhook events (service role only)
DROP POLICY IF EXISTS "Service role can manage webhook events" ON duffel_webhook_events;
CREATE POLICY "Service role can manage webhook events" ON duffel_webhook_events
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- Step 2: Create missing RPC functions
-- ============================================================================

-- RPC: Create booking attempt with idempotency
CREATE OR REPLACE FUNCTION rpc_create_booking_attempt(
    p_trip_request_id UUID,
    p_idempotency_key TEXT
) RETURNS JSON AS $$
DECLARE
    v_existing_attempt booking_attempts%ROWTYPE;
    v_new_attempt booking_attempts%ROWTYPE;
    v_trip_exists BOOLEAN;
BEGIN
    -- Check if trip request exists
    SELECT EXISTS(SELECT 1 FROM trip_requests WHERE id = p_trip_request_id) INTO v_trip_exists;
    
    IF NOT v_trip_exists THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Trip request not found',
            'error_code', 'TRIP_NOT_FOUND'
        );
    END IF;
    
    -- Check for existing attempt with same idempotency key
    SELECT * INTO v_existing_attempt 
    FROM booking_attempts 
    WHERE idempotency_key = p_idempotency_key;
    
    IF v_existing_attempt.id IS NOT NULL THEN
        RETURN json_build_object(
            'success', true,
            'existing', true,
            'attempt_id', v_existing_attempt.id,
            'status', v_existing_attempt.status
        );
    END IF;
    
    -- Create new booking attempt
    INSERT INTO booking_attempts (trip_request_id, idempotency_key)
    VALUES (p_trip_request_id, p_idempotency_key)
    RETURNING * INTO v_new_attempt;
    
    RETURN json_build_object(
        'success', true,
        'existing', false,
        'attempt_id', v_new_attempt.id,
        'status', v_new_attempt.status
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Update booking attempt status
CREATE OR REPLACE FUNCTION rpc_update_booking_attempt(
    p_attempt_id UUID,
    p_status TEXT,
    p_duffel_offer_id TEXT DEFAULT NULL,
    p_duffel_order_id TEXT DEFAULT NULL,
    p_stripe_payment_intent_id TEXT DEFAULT NULL,
    p_total_amount INTEGER DEFAULT NULL,
    p_error_message TEXT DEFAULT NULL,
    p_error_code TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_updated_count INTEGER;
BEGIN
    UPDATE booking_attempts SET
        status = p_status,
        duffel_offer_id = COALESCE(p_duffel_offer_id, duffel_offer_id),
        duffel_order_id = COALESCE(p_duffel_order_id, duffel_order_id),
        stripe_payment_intent_id = COALESCE(p_stripe_payment_intent_id, stripe_payment_intent_id),
        total_amount = COALESCE(p_total_amount, total_amount),
        error_message = p_error_message,
        error_code = p_error_code,
        updated_at = NOW(),
        completed_at = CASE 
            WHEN p_status IN ('completed', 'failed', 'cancelled') THEN NOW()
            ELSE completed_at
        END
    WHERE id = p_attempt_id;
    
    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    RETURN v_updated_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Fail booking attempt with retry logic
CREATE OR REPLACE FUNCTION rpc_fail_booking_attempt(
    p_attempt_id UUID,
    p_error_message TEXT,
    p_error_code TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_current_attempt booking_attempts%ROWTYPE;
    v_updated_count INTEGER;
BEGIN
    -- Get current attempt
    SELECT * INTO v_current_attempt
    FROM booking_attempts
    WHERE id = p_attempt_id;
    
    IF v_current_attempt.id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Update with failure details
    UPDATE booking_attempts SET
        status = 'failed',
        error_message = p_error_message,
        error_code = p_error_code,
        retry_count = retry_count + 1,
        updated_at = NOW(),
        completed_at = NOW()
    WHERE id = p_attempt_id;
    
    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    RETURN v_updated_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Step 3: Create monitoring view
-- ============================================================================

-- Monitoring view for booking attempts
CREATE OR REPLACE VIEW booking_attempts_summary AS
SELECT 
    DATE_TRUNC('hour', created_at) AS hour,
    status,
    COUNT(*) AS count,
    AVG(EXTRACT(EPOCH FROM (COALESCE(completed_at, NOW()) - created_at))) AS avg_duration_seconds,
    SUM(CASE WHEN retry_count > 0 THEN 1 ELSE 0 END) AS retry_count
FROM booking_attempts
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at), status
ORDER BY hour DESC, status;

-- ============================================================================
-- Step 4: Grant permissions
-- ============================================================================

-- Grant permissions for RPC functions
GRANT EXECUTE ON FUNCTION rpc_create_booking_attempt TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_update_booking_attempt TO service_role;
GRANT EXECUTE ON FUNCTION rpc_fail_booking_attempt TO service_role;

-- Grant permissions for monitoring view
GRANT SELECT ON booking_attempts_summary TO authenticated;

-- ============================================================================
-- Step 5: Add any missing columns to booking_attempts if needed
-- ============================================================================

-- Add columns if they don't exist (safe to run multiple times)
DO $$ 
BEGIN
    -- Add duffel_offer_id if it doesn't exist
    BEGIN
        ALTER TABLE booking_attempts ADD COLUMN duffel_offer_id TEXT;
    EXCEPTION 
        WHEN duplicate_column THEN NULL;
    END;
    
    -- Add duffel_order_id if it doesn't exist
    BEGIN
        ALTER TABLE booking_attempts ADD COLUMN duffel_order_id TEXT;
    EXCEPTION 
        WHEN duplicate_column THEN NULL;
    END;
    
    -- Add stripe_payment_intent_id if it doesn't exist
    BEGIN
        ALTER TABLE booking_attempts ADD COLUMN stripe_payment_intent_id TEXT;
    EXCEPTION 
        WHEN duplicate_column THEN NULL;
    END;
    
    -- Add total_amount if it doesn't exist
    BEGIN
        ALTER TABLE booking_attempts ADD COLUMN total_amount INTEGER;
    EXCEPTION 
        WHEN duplicate_column THEN NULL;
    END;
    
    -- Add error_message if it doesn't exist
    BEGIN
        ALTER TABLE booking_attempts ADD COLUMN error_message TEXT;
    EXCEPTION 
        WHEN duplicate_column THEN NULL;
    END;
    
    -- Add error_code if it doesn't exist
    BEGIN
        ALTER TABLE booking_attempts ADD COLUMN error_code TEXT;
    EXCEPTION 
        WHEN duplicate_column THEN NULL;
    END;
    
    -- Add retry_count if it doesn't exist
    BEGIN
        ALTER TABLE booking_attempts ADD COLUMN retry_count INTEGER DEFAULT 0;
    EXCEPTION 
        WHEN duplicate_column THEN NULL;
    END;
    
    -- Add completed_at if it doesn't exist
    BEGIN
        ALTER TABLE booking_attempts ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
    EXCEPTION 
        WHEN duplicate_column THEN NULL;
    END;
END $$;

-- ============================================================================
-- Step 6: Update triggers for timestamp management
-- ============================================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking_attempts if it doesn't exist
DROP TRIGGER IF EXISTS update_booking_attempts_updated_at ON booking_attempts;
CREATE TRIGGER update_booking_attempts_updated_at
    BEFORE UPDATE ON booking_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for duffel_webhook_events if it doesn't exist
DROP TRIGGER IF EXISTS update_webhook_events_updated_at ON duffel_webhook_events;
CREATE TRIGGER update_webhook_events_updated_at
    BEFORE UPDATE ON duffel_webhook_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Verification Queries (for manual testing)
-- ============================================================================

-- Check that all components exist
SELECT 'Tables created' as status;

SELECT 
    schemaname, 
    tablename 
FROM pg_tables 
WHERE tablename IN ('booking_attempts', 'duffel_webhook_events', 'feature_flags')
    AND schemaname = 'public';

SELECT 'Functions created' as status;

SELECT 
    routine_name, 
    routine_type 
FROM information_schema.routines 
WHERE routine_name LIKE 'rpc_%' 
    AND routine_schema = 'public';

SELECT 'Views created' as status;

SELECT 
    schemaname, 
    viewname 
FROM pg_views 
WHERE viewname = 'booking_attempts_summary' 
    AND schemaname = 'public';

SELECT 'Setup complete!' as status;

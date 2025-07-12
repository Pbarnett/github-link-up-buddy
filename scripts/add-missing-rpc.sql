-- Add just the missing RPC function for testing purposes
-- This is a minimal version to get tests working

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

-- Grant permissions
GRANT EXECUTE ON FUNCTION rpc_create_booking_attempt TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_fail_booking_attempt TO service_role;

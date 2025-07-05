-- Duffel Integration Migration V1
-- Creates all necessary tables, RPC functions, and security policies

-- Feature flags table for controlled rollout
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial feature flags (disabled by default for safety)
INSERT INTO feature_flags (name, enabled, description) VALUES
('duffel_live_enabled', FALSE, 'Enable live Duffel API calls (vs sandbox)'),
('duffel_webhooks_enabled', FALSE, 'Enable processing of Duffel webhooks'),
('auto_booking_enhanced', FALSE, 'Enable enhanced auto-booking with Duffel')
ON CONFLICT (name) DO NOTHING;

-- Booking attempts table for transaction tracking
CREATE TABLE IF NOT EXISTS booking_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_request_id UUID NOT NULL REFERENCES trip_requests(id) ON DELETE CASCADE,
    idempotency_key TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    
    -- Duffel-specific fields
    duffel_offer_id TEXT,
    duffel_order_id TEXT,
    duffel_booking_reference TEXT,
    
    -- Payment tracking
    stripe_payment_intent_id TEXT,
    total_amount INTEGER, -- in cents
    currency TEXT DEFAULT 'USD',
    
    -- Error tracking
    error_message TEXT,
    error_code TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Indexes for performance
    INDEX idx_booking_attempts_trip_request_id (trip_request_id),
    INDEX idx_booking_attempts_status (status),
    INDEX idx_booking_attempts_created_at (created_at),
    INDEX idx_booking_attempts_duffel_order_id (duffel_order_id)
);

-- Duffel webhook events table for audit trail
CREATE TABLE IF NOT EXISTS duffel_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    booking_attempt_id UUID REFERENCES booking_attempts(id),
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_webhook_events_type (event_type),
    INDEX idx_webhook_events_processed (processed),
    INDEX idx_webhook_events_booking_attempt (booking_attempt_id)
);

-- Enable RLS on all tables
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE duffel_webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feature_flags (admin only)
CREATE POLICY "Feature flags are viewable by authenticated users" ON feature_flags
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Feature flags are editable by service role only" ON feature_flags
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for booking_attempts (user can see their own)
CREATE POLICY "Users can view their own booking attempts" ON booking_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM trip_requests tr 
            WHERE tr.id = booking_attempts.trip_request_id 
            AND tr.user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage all booking attempts" ON booking_attempts
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for webhook events (service role only)
CREATE POLICY "Service role can manage webhook events" ON duffel_webhook_events
    FOR ALL USING (auth.role() = 'service_role');

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

-- Monitoring view for booking attempts
CREATE OR REPLACE VIEW booking_attempts_summary AS
SELECT 
    DATE_TRUNC('hour', created_at) AS hour,
    status,
    COUNT(*) AS count,
    AVG(EXTRACT(EPOCH FROM (completed_at - created_at))) AS avg_duration_seconds,
    SUM(CASE WHEN retry_count > 0 THEN 1 ELSE 0 END) AS retry_count
FROM booking_attempts
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at), status
ORDER BY hour DESC, status;

-- Grant permissions
GRANT SELECT ON booking_attempts_summary TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_create_booking_attempt TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_update_booking_attempt TO service_role;
GRANT EXECUTE ON FUNCTION rpc_fail_booking_attempt TO service_role;

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_booking_attempts_updated_at
    BEFORE UPDATE ON booking_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at
    BEFORE UPDATE ON feature_flags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RPC: Complete Duffel booking (atomic operation)
CREATE OR REPLACE FUNCTION rpc_complete_duffel_booking(
    p_attempt_id UUID,
    p_duffel_order_id TEXT,
    p_stripe_payment_intent_id TEXT,
    p_price DECIMAL,
    p_currency TEXT,
    p_raw_order JSONB
) RETURNS JSON AS $$
DECLARE
    v_booking_id UUID;
    v_trip_request booking_attempts%ROWTYPE;
BEGIN
    -- Get the booking attempt details
    SELECT ba.*, tr.user_id, tr.departure_airports, tr.destination_location_code
    INTO v_trip_request
    FROM booking_attempts ba
    JOIN trip_requests tr ON ba.trip_request_id = tr.id
    WHERE ba.id = p_attempt_id;
    
    IF v_trip_request.id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Booking attempt not found'
        );
    END IF;
    
    -- Create confirmed booking record
    INSERT INTO bookings (
        user_id,
        trip_request_id,
        booking_attempt_id,
        duffel_order_id,
        booking_reference,
        status,
        total_price,
        currency,
        stripe_payment_intent_id,
        raw_duffel_order,
        confirmed_at
    ) VALUES (
        v_trip_request.user_id,
        v_trip_request.trip_request_id,
        p_attempt_id,
        p_duffel_order_id,
        (p_raw_order->>'booking_reference'),
        'confirmed',
        p_price,
        p_currency,
        p_stripe_payment_intent_id,
        p_raw_order,
        NOW()
    ) RETURNING id INTO v_booking_id;
    
    -- Update booking attempt status
    UPDATE booking_attempts SET
        status = 'completed',
        duffel_order_id = p_duffel_order_id,
        stripe_payment_intent_id = p_stripe_payment_intent_id,
        total_amount = (p_price * 100)::INTEGER, -- Convert to cents
        updated_at = NOW(),
        completed_at = NOW()
    WHERE id = p_attempt_id;
    
    RETURN json_build_object(
        'success', true,
        'booking_id', v_booking_id,
        'duffel_order_id', p_duffel_order_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bookings table for confirmed reservations
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trip_request_id UUID NOT NULL REFERENCES trip_requests(id) ON DELETE CASCADE,
    booking_attempt_id UUID NOT NULL REFERENCES booking_attempts(id),
    
    -- Duffel booking details
    duffel_order_id TEXT NOT NULL UNIQUE,
    booking_reference TEXT NOT NULL,
    
    -- Status tracking
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
    
    -- Financial details
    total_price DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    stripe_payment_intent_id TEXT,
    
    -- Full order data for reference
    raw_duffel_order JSONB NOT NULL,
    
    -- Timestamps
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_bookings_user_id (user_id),
    INDEX idx_bookings_duffel_order_id (duffel_order_id),
    INDEX idx_bookings_status (status),
    INDEX idx_bookings_confirmed_at (confirmed_at)
);

-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role can manage all bookings" ON bookings
    FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions for new functions
GRANT EXECUTE ON FUNCTION rpc_complete_duffel_booking TO service_role;

-- Update trigger for bookings
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

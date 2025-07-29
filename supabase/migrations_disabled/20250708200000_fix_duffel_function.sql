-- Fix the rpc_complete_duffel_booking function conflict
-- Drop the existing function first, then recreate it

DROP FUNCTION IF EXISTS rpc_complete_duffel_booking;

-- Recreate the function with proper signature
CREATE OR REPLACE FUNCTION rpc_complete_duffel_booking(
    p_attempt_id UUID,
    p_duffel_order_id TEXT,
    p_stripe_payment_intent_id TEXT,
    p_price DECIMAL,
    p_currency TEXT,
    p_raw_order JSONB
) RETURNS jsonb AS $$
DECLARE
    v_booking_id UUID;
    v_trip_request_id UUID;
    v_user_id UUID;
BEGIN
    -- Get the booking attempt details
    SELECT ba.trip_request_id, tr.user_id
    INTO v_trip_request_id, v_user_id
    FROM booking_attempts ba
    JOIN trip_requests tr ON ba.trip_request_id = tr.id
    WHERE ba.id = p_attempt_id;
    
    IF v_trip_request_id IS NULL THEN
        RETURN jsonb_build_object(
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
        v_user_id,
        v_trip_request_id,
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
    
    RETURN jsonb_build_object(
        'success', true,
        'booking_id', v_booking_id,
        'duffel_order_id', p_duffel_order_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION rpc_complete_duffel_booking TO service_role;

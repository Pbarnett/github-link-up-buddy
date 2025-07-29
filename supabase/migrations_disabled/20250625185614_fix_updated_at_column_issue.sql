-- Fix RPC functions to remove updated_at column references
-- as the bookings table doesn't have this column

-- 1. Fix rpc_update_duffel_booking to remove updated_at
CREATE OR REPLACE FUNCTION public.rpc_update_duffel_booking(
  p_booking_id uuid,
  p_duffel_order_id text,
  p_pnr text DEFAULT NULL,
  p_ticket_numbers jsonb DEFAULT NULL,
  p_duffel_status public.duffel_booking_status DEFAULT 'order_created',
  p_raw_order jsonb DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY definer  
AS $$
BEGIN
  UPDATE bookings SET
    duffel_order_id = p_duffel_order_id,
    pnr = COALESCE(p_pnr, pnr),
    ticket_numbers = COALESCE(p_ticket_numbers, ticket_numbers),
    duffel_status = p_duffel_status,
    duffel_raw_order = COALESCE(p_raw_order, duffel_raw_order),
    status = CASE 
      WHEN p_duffel_status = 'ticketed' THEN 'ticketed'::booking_status_enum
      WHEN p_duffel_status = 'failed' THEN 'failed'::booking_status_enum
      WHEN p_duffel_status = 'cancelled' THEN 'canceled'::booking_status_enum
      WHEN p_duffel_status = 'order_created' THEN 'booked'::booking_status_enum
      ELSE status
    END
  WHERE id = p_booking_id AND provider = 'duffel';
  
  RETURN FOUND;
END;
$$;

-- 2. Fix rpc_update_duffel_booking_by_order to remove updated_at
CREATE OR REPLACE FUNCTION public.rpc_update_duffel_booking_by_order(
  p_duffel_order_id text,
  p_pnr text DEFAULT NULL,
  p_duffel_status public.duffel_booking_status DEFAULT NULL,
  p_raw_order jsonb DEFAULT NULL,
  p_ticket_numbers jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY definer
AS $$
DECLARE
  v_booking_id uuid;
  v_updated boolean := false;
  v_result jsonb;
BEGIN
  -- Find booking by duffel_order_id
  SELECT id INTO v_booking_id 
  FROM bookings 
  WHERE duffel_order_id = p_duffel_order_id AND provider = 'duffel';
  
  IF NOT FOUND THEN
    -- Return error if booking not found
    SELECT jsonb_build_object(
      'success', false,
      'error', 'Booking not found for Duffel order ID: ' || p_duffel_order_id
    ) INTO v_result;
    RETURN v_result;
  END IF;
  
  -- Update the booking
  UPDATE bookings SET
    pnr = COALESCE(p_pnr, pnr),
    ticket_numbers = COALESCE(p_ticket_numbers, ticket_numbers),
    duffel_status = COALESCE(p_duffel_status, duffel_status),
    duffel_raw_order = COALESCE(p_raw_order, duffel_raw_order),
    status = CASE 
      WHEN p_duffel_status = 'ticketed' THEN 'ticketed'::booking_status_enum
      WHEN p_duffel_status = 'failed' THEN 'failed'::booking_status_enum
      WHEN p_duffel_status = 'cancelled' THEN 'canceled'::booking_status_enum
      WHEN p_duffel_status = 'order_created' THEN 'booked'::booking_status_enum
      ELSE status
    END
  WHERE id = v_booking_id;
  
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  
  -- Return success result
  SELECT jsonb_build_object(
    'success', true,
    'booking_id', v_booking_id,
    'updated', v_updated > 0,
    'duffel_order_id', p_duffel_order_id,
    'duffel_status', p_duffel_status
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

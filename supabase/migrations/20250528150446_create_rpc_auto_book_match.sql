CREATE OR REPLACE FUNCTION public.rpc_auto_book_match(p_booking_request_id UUID) -- Changed parameter type to UUID
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking_request public.booking_requests%ROWTYPE; -- If booking_requests.id is UUID, this will be UUID
  v_offer_data JSONB;
  v_user_id UUID; -- Assuming user_id in booking_requests and trip_requests is UUID
  v_trip_request_id UUID; -- Changed to UUID as trip_requests.id is assumed to be UUID
  v_new_booking_id BIGINT; -- Assuming bookings.id (PK) is still BIGINT (e.g., bigserial)
  v_flight_price NUMERIC;
  v_airline TEXT;
  v_flight_number TEXT;
  v_origin_code TEXT;
  v_destination_code TEXT;
  v_notification_message TEXT;
  v_trip_details RECORD;
BEGIN
  -- 1. Fetch the booking_requests row using the UUID parameter
  SELECT * INTO v_booking_request
  FROM public.booking_requests
  WHERE id = p_booking_request_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking request with ID % not found', p_booking_request_id;
  END IF;

  v_offer_data := v_booking_request.offer_data;
  v_user_id := v_booking_request.user_id;
  v_trip_request_id := v_booking_request.trip_request_id; -- This is now UUID from booking_requests table

  -- Fetch origin and destination from the associated trip_requests table
  SELECT origin_location_code, destination_location_code
  INTO v_trip_details
  FROM public.trip_requests
  WHERE id = v_trip_request_id; -- Comparing with v_trip_request_id (UUID)

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Associated trip request ID % not found for booking request ID %', v_trip_request_id, p_booking_request_id;
  END IF;

  v_origin_code := v_trip_details.origin_location_code;
  v_destination_code := v_trip_details.destination_location_code;

  -- Extract details from offer_data for booking and notification
  v_flight_price := (v_offer_data->>'price')::NUMERIC;
  v_airline := v_offer_data->>'airline';
  v_flight_number := v_offer_data->>'flight_number';

  -- 2. Insert into bookings
  -- Using new column names as per 20250530120000_align_schema_auto_booking.sql
  INSERT INTO public.bookings (
    trip_request_id,    -- UUID
    user_id,            -- UUID
    booking_request_id, -- UUID (FK to booking_requests.id)
    flight_details,     -- JSONB
    price,              -- NUMERIC
    source,             -- TEXT
    status,             -- TEXT
    booked_at
  )
  VALUES (
    v_trip_request_id,
    v_user_id,
    p_booking_request_id, -- This is the UUID of the booking_request
    v_offer_data,
    v_flight_price,
    'auto',
    'booked',
    NOW()
  )
  RETURNING id INTO v_new_booking_id; -- Assuming bookings.id is still BIGINT

  -- 3. Insert into notifications
  -- Using new column names as per 20250530120000_align_schema_auto_booking.sql
  v_notification_message := FORMAT(
    'We auto-booked your flight from %s to %s with %s (%s) for $%s!',
    COALESCE(v_origin_code, 'N/A'),
    COALESCE(v_destination_code, 'N/A'),
    COALESCE(v_airline, 'N/A'),
    COALESCE(v_flight_number, 'N/A'),
    TO_CHAR(v_flight_price, 'FM999,990.00')
  );

  INSERT INTO public.notifications (
    user_id,            -- UUID
    trip_request_id,    -- UUID
    type,
    message,            -- TEXT
    data                -- JSONB
  )
  VALUES (
    v_user_id,
    v_trip_request_id,
    'auto_booking_success',
    v_notification_message,
    jsonb_build_object(
      'booking_id', v_new_booking_id, -- BIGINT (PK of bookings table)
      'booking_request_id', p_booking_request_id, -- UUID (PK of booking_requests table)
      'trip_request_id', v_trip_request_id, -- UUID (PK of trip_requests table)
      'offer_price', v_flight_price,
      'airline', v_airline,
      'flight_number', v_flight_number,
      'origin', v_origin_code,
      'destination', v_destination_code,
      'original_offer_data', v_offer_data
    )
  );

  -- 4. Update booking_requests.status to 'done'
  -- Using new column names as per 20250530120000_align_schema_auto_booking.sql
  UPDATE public.booking_requests
  SET status = 'done', updated_at = NOW(), error_message = NULL
  WHERE id = p_booking_request_id; -- Comparing with p_booking_request_id (UUID)

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in rpc_auto_book_match for booking_request_id %: %', p_booking_request_id, SQLERRM;
    UPDATE public.booking_requests
    SET status = 'failed', error_message = SQLERRM, updated_at = NOW()
    WHERE id = p_booking_request_id; -- Comparing with p_booking_request_id (UUID)
END;
$$;

-- Grant execute permission on the function.
-- The parameter signature must match the new UUID type.
-- Remove old grant if it existed for BIGINT.
-- GRANT EXECUTE ON FUNCTION public.rpc_auto_book_match(BIGINT) TO service_role; -- Example of old, to be removed if exists
-- GRANT EXECUTE ON FUNCTION public.rpc_auto_book_match(UUID) TO service_role;
```

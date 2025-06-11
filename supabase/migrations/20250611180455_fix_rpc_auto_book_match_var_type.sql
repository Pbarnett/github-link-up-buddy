-- ✅ No ::BIGINT casts found (validated 2025-06-11)
CREATE OR REPLACE FUNCTION "public"."rpc_auto_book_match"("p_booking_request_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
DECLARE
  v_booking_request public.booking_requests%ROWTYPE;
  v_offer_data JSONB;
  v_user_id UUID;
  v_trip_request_id UUID;
  v_new_booking_id UUID; -- Changed from BIGINT to UUID
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
  v_trip_request_id := v_booking_request.trip_request_id;

  -- Fetch origin and destination from the associated trip_requests table
  SELECT origin_location_code, destination_location_code
  INTO v_trip_details
  FROM public.trip_requests
  WHERE id = v_trip_request_id;

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
  INSERT INTO public.bookings (
    trip_request_id,
    user_id,
    booking_request_id,
    flight_details,
    price,
    source,
    status,
    booked_at
  )
  VALUES (
    v_trip_request_id,
    v_user_id,
    p_booking_request_id,
    v_offer_data,
    v_flight_price,
    'auto',
    'booked',
    NOW()
  )
  RETURNING id INTO v_new_booking_id;

  -- 3. Insert into notifications
  v_notification_message := FORMAT(
    'We auto-booked your flight from %s to %s with %s (%s) for $%s!',
    COALESCE(v_origin_code, 'N/A'),
    COALESCE(v_destination_code, 'N/A'),
    COALESCE(v_airline, 'N/A'),
    COALESCE(v_flight_number, 'N/A'),
    TO_CHAR(v_flight_price, 'FM999,990.00')
  );

  INSERT INTO public.notifications (
    user_id,
    trip_request_id,
    type,
    message,
    data
  )
  VALUES (
    v_user_id,
    v_trip_request_id,
    'auto_booking_success',
    v_notification_message,
    jsonb_build_object(
      'booking_id', v_new_booking_id,
      'booking_request_id', p_booking_request_id,
      'trip_request_id', v_trip_request_id,
      'offer_price', v_flight_price,
      'airline', v_airline,
      'flight_number', v_flight_number,
      'origin', v_origin_code,
      'destination', v_destination_code,
      'original_offer_data', v_offer_data
    )
  );

  -- 4. Update booking_requests.status to 'done'
  UPDATE public.booking_requests
  SET status = 'done', updated_at = NOW(), error_message = NULL
  WHERE id = p_booking_request_id;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in rpc_auto_book_match for booking_request_id %: %', p_booking_request_id, SQLERRM;
    UPDATE public.booking_requests
    SET status = 'failed', error_message = SQLERRM, updated_at = NOW()
    WHERE id = p_booking_request_id;
END;
$_$;

-- It's good practice to also set the owner of the function,
-- usually to 'postgres' or the specific role that owns the schema/db.
-- If the original function had an ALTER FUNCTION ... OWNER TO ... line, replicate it.
-- Assuming 'postgres' for now if not specified otherwise.
ALTER FUNCTION "public"."rpc_auto_book_match"("p_booking_request_id" "uuid") OWNER TO "postgres";

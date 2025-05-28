CREATE OR REPLACE FUNCTION public.rpc_auto_book_match(p_booking_request_id BIGINT)
RETURNS VOID -- Or potentially JSON with success/error info
LANGUAGE plpgsql
SECURITY DEFINER -- Important if it needs to operate with elevated privileges
AS $$
DECLARE
  v_booking_request public.booking_requests%ROWTYPE;
  v_offer_data JSONB;
  v_user_id UUID;
  v_trip_request_id BIGINT;
  v_new_booking_id BIGINT;
  v_flight_price NUMERIC;
  v_airline TEXT;
  v_flight_number TEXT;
  v_origin_code TEXT;        -- Extracted from trip_requests for more reliable origin
  v_destination_code TEXT;   -- Extracted from trip_requests for more reliable destination
  v_notification_message TEXT;
  v_trip_details RECORD;     -- To store trip's origin/destination
BEGIN
  -- 1. Read the booking_requests row
  SELECT * INTO v_booking_request
  FROM public.booking_requests
  WHERE id = p_booking_request_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking request with ID % not found', p_booking_request_id;
  END IF;

  -- Extract necessary data from booking_request
  v_offer_data := v_booking_request.offer_data;
  v_user_id := v_booking_request.user_id;
  v_trip_request_id := v_booking_request.trip_request_id;

  -- Fetch origin and destination from the associated trip_requests table
  -- This is more reliable than assuming it's in offer_data
  SELECT origin_location_code, destination_location_code 
  INTO v_trip_details
  FROM public.trip_requests
  WHERE id = v_trip_request_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Associated trip request with ID % not found for booking request ID %', v_trip_request_id, p_booking_request_id;
  END IF;
  
  v_origin_code := v_trip_details.origin_location_code;
  v_destination_code := v_trip_details.destination_location_code;

  -- Extract details from offer_data for booking and notification
  -- Based on the Offer interface: price, airline, flight_number are top-level
  v_flight_price := (v_offer_data->>'price')::NUMERIC;
  v_airline := v_offer_data->>'airline';
  v_flight_number := v_offer_data->>'flight_number';
  -- Note: v_origin and v_destination for the notification message will use v_origin_code and v_destination_code from trip_requests

  -- 2. Insert into bookings
  INSERT INTO public.bookings (
    trip_request_id,
    user_id,
    booking_request_id,
    flight_details, -- Assuming this is a JSONB column to store the offer
    source,
    status,
    booked_at,
    price -- Assuming a dedicated price column in bookings table
  )
  VALUES (
    v_trip_request_id,
    v_user_id,
    p_booking_request_id,
    v_offer_data,
    'auto',
    'booked',
    NOW(),
    v_flight_price
  )
  RETURNING id INTO v_new_booking_id;

  -- 3. Insert into notifications
  -- Construct a user-friendly message using origin/destination from trip_requests
  v_notification_message := FORMAT(
    'We auto-booked your flight from %s to %s with %s (%s) for $%s!',
    COALESCE(v_origin_code, 'your origin'), 
    COALESCE(v_destination_code, 'your destination'), 
    COALESCE(v_airline, 'the airline'), 
    COALESCE(v_flight_number, 'flight'), 
    TO_CHAR(v_flight_price, 'FM999,990.00')
  );

  INSERT INTO public.notifications (
    user_id,
    trip_request_id,
    type,
    message,
    data -- JSONB payload
  )
  VALUES (
    v_user_id,
    v_trip_request_id,
    'auto_booking_success',
    v_notification_message,
    jsonb_build_object(
      'booking_id', v_new_booking_id,
      'offer_id', v_booking_request.offer_id, -- Adding offer_id from booking_requests
      'price', v_flight_price,
      'airline', v_airline,
      'flight_number', v_flight_number,
      'origin', v_origin_code,
      'destination', v_destination_code,
      'trip_request_id', v_trip_request_id
      -- Removed 'offer', v_offer_data to avoid redundancy if flight_details in bookings and this data is large
      -- The client can fetch full offer details via booking_id if needed
    )
  );

  -- 4. Update booking_requests.status to 'done'
  UPDATE public.booking_requests
  SET status = 'done', updated_at = NOW()
  WHERE id = p_booking_request_id;

EXCEPTION
  WHEN OTHERS THEN
    -- Log the error (e.g., using RAISE NOTICE or to an error logging table if available)
    RAISE NOTICE 'Error in rpc_auto_book_match for booking_request_id %: %', p_booking_request_id, SQLERRM;

    -- Update booking_requests.status to 'failed'
    UPDATE public.booking_requests
    SET status = 'failed', error_message = SQLERRM, updated_at = NOW()
    WHERE id = p_booking_request_id;
    
    -- Optionally re-raise the exception if the caller needs to be aware of it
    -- RAISE; 
END;
$$;

-- Grant execute permission on the function to the 'authenticated' role,
-- or other roles as appropriate if you want users to be able to call it directly.
-- However, for a scheduler-triggered flow, this RPC is typically called by a service role key,
-- which usually has enough privileges. If the scheduler uses a less privileged role that
-- needs to call this SECURITY DEFINER function, that role would need EXECUTE permission.
-- For now, assuming service_role or postgres user calls it, or that appropriate grants
-- will be handled separately if needed for other roles.
-- Example: GRANT EXECUTE ON FUNCTION public.rpc_auto_book_match(BIGINT) TO authenticated;
-- Example: GRANT EXECUTE ON FUNCTION public.rpc_auto_book_match(BIGINT) TO service_role;

-- Comment: The function assumes 'bookings.price' column exists.
-- Comment: The function assumes 'bookings.flight_details' (JSONB) column exists.
-- Comment: The function assumes 'notifications.data' (JSONB) column exists.
-- Comment: The function assumes 'booking_requests.offer_id' (TEXT) column exists for notification data.
-- Comment: Origin and Destination for notification message are now sourced from `trip_requests` table for better reliability.
-- Comment: Notification data payload was adjusted to be more concise.
```

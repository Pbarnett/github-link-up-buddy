-- supabase/tests/database/rpc_auto_book_match.test.sql

-- Start a transaction
BEGIN;

-- Optional: Disable RLS for the current session if needed for setup/assertions
SET session_replication_role = 'replica';

RAISE NOTICE 'Test Suite: rpc_auto_book_match (UUID Version)';
RAISE NOTICE '----------------------------------';

-- Define fixed UUIDs for test predictability
DO $$
DECLARE
  test_user_id UUID := '00000000-0000-0000-0000-000000000001'; -- Fixed test user UUID
  test_trip_request_id_success UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  test_booking_request_id_success UUID := 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
  
  test_booking_request_id_fail_rpc UUID := 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
  invalid_trip_request_id_for_rpc_fail UUID := 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'; -- Non-existent

  v_offer_data_success JSONB;
  v_offer_data_fail JSONB;
  v_new_booking_id_check BIGINT; -- Assuming bookings.id is still BIGINT
  v_notification_data_check JSONB;
BEGIN

  -- Ensure a test user exists (using the fixed UUID)
  INSERT INTO auth.users (id, email, role, aud, encrypted_password)
  VALUES (test_user_id, 'testuser_rpc@example.com', 'authenticated', 'authenticated', crypt('password123', gen_salt('bf')))
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email; -- Update email just to ensure ON CONFLICT works if user exists


  RAISE NOTICE 'Test Case 1: Successful auto-booking with UUIDs';
  RAISE NOTICE 'Setting up test data for successful auto-booking...';

  -- 1.1 Setup Trip Request
  INSERT INTO public.trip_requests (
    id, user_id, origin_location_code, destination_location_code, 
    departure_date, return_date, adults, auto_book, budget, best_price, updated_at
  ) 
  VALUES (
    test_trip_request_id_success, test_user_id, 'LAX', 'JFK', 
    '2024-12-01'::DATE, '2024-12-10'::DATE, 1, true, 350.00, 400.00, NOW()
  )
  ON CONFLICT (id) DO UPDATE SET 
      user_id = EXCLUDED.user_id, 
      origin_location_code = EXCLUDED.origin_location_code, 
      destination_location_code = EXCLUDED.destination_location_code,
      departure_date = EXCLUDED.departure_date,
      return_date = EXCLUDED.return_date,
      adults = EXCLUDED.adults,
      auto_book = EXCLUDED.auto_book,
      budget = EXCLUDED.budget,
      best_price = EXCLUDED.best_price,
      updated_at = NOW();

  -- 1.2 Setup Booking Request
  v_offer_data_success := '{ "id": "test-offer-uuid-123", "price": 299.99, "airline": "TestAirways", "flight_number": "TA-UUID-101", "departure_date": "2024-12-01", "departure_time": "10:00", "arrival_time": "13:00", "return_date": "2024-12-10", "duration": "5h" }'::jsonb;
  
  INSERT INTO public.booking_requests (
    id, user_id, trip_request_id, offer_id, offer_data, auto, status, 
    error_message, created_at, updated_at
  )
  VALUES (
    test_booking_request_id_success, test_user_id, test_trip_request_id_success, 
    v_offer_data_success->>'id', v_offer_data_success, 
    true, 'processing', NULL, NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET 
      user_id = EXCLUDED.user_id, 
      trip_request_id = EXCLUDED.trip_request_id,
      offer_id = EXCLUDED.offer_id,
      offer_data = EXCLUDED.offer_data,
      status = 'processing', 
      error_message = NULL,  
      updated_at = NOW();

  RAISE NOTICE 'Executing RPC public.rpc_auto_book_match(%) for success case...', test_booking_request_id_success;
  -- 1.3 Execute RPC
  PERFORM public.rpc_auto_book_match(test_booking_request_id_success);

  -- 1.4 Assert Outcomes
  RAISE NOTICE 'Asserting booking_request status is done...';
  PERFORM 
      CASE 
          WHEN (SELECT COUNT(*) FROM public.booking_requests WHERE id = test_booking_request_id_success AND status = 'done' AND error_message IS NULL) = 1 THEN RAISE NOTICE 'SUCCESS: Booking request ID % status is done.', test_booking_request_id_success;
          ELSE RAISE EXCEPTION 'FAIL: Booking request ID % status not "done" or error_message not null. Status: %, Error: %', 
                               test_booking_request_id_success,
                               (SELECT status FROM public.booking_requests WHERE id = test_booking_request_id_success), 
                               (SELECT error_message FROM public.booking_requests WHERE id = test_booking_request_id_success);
      END;

  RAISE NOTICE 'Asserting booking was created correctly...';
  SELECT b.id INTO v_new_booking_id_check FROM public.bookings b WHERE b.booking_request_id = test_booking_request_id_success;
  PERFORM 
      CASE 
          WHEN (SELECT COUNT(*) FROM public.bookings 
                WHERE booking_request_id = test_booking_request_id_success 
                AND trip_request_id = test_trip_request_id_success
                AND user_id = test_user_id
                AND source = 'auto' 
                AND status = 'booked' 
                AND price = (v_offer_data_success->>'price')::NUMERIC
                AND flight_details->>'airline' = (v_offer_data_success->>'airline')
               ) = 1 THEN RAISE NOTICE 'SUCCESS: Booking for request ID % created correctly.', test_booking_request_id_success;
          ELSE RAISE EXCEPTION 'FAIL: Booking for request ID % not created or has incorrect details.', test_booking_request_id_success;
      END;

  RAISE NOTICE 'Asserting notification was created correctly...';
  SELECT data INTO v_notification_data_check FROM public.notifications WHERE trip_request_id = test_trip_request_id_success AND type = 'auto_booking_success' LIMIT 1;
  PERFORM 
      CASE 
          WHEN (SELECT COUNT(*) FROM public.notifications 
                WHERE trip_request_id = test_trip_request_id_success 
                AND user_id = test_user_id
                AND type = 'auto_booking_success' 
                AND message LIKE '%flight from LAX to JFK with TestAirways (TA-UUID-101) for $299.99!%'
                AND (data->>'booking_id')::BIGINT = v_new_booking_id_check
                AND (data->>'booking_request_id')::UUID = test_booking_request_id_success
                AND (data->>'trip_request_id')::UUID = test_trip_request_id_success
                AND (data->>'offer_price')::NUMERIC = (v_offer_data_success->>'price')::NUMERIC
                AND data->>'airline' = (v_offer_data_success->>'airline')
                AND data->>'original_offer_data' = v_offer_data_success
               ) = 1 THEN RAISE NOTICE 'SUCCESS: Notification for trip ID % created correctly.', test_trip_request_id_success;
          ELSE RAISE EXCEPTION 'FAIL: Notification for trip ID % not created or has incorrect details. Message: %, Data: %', 
                               test_trip_request_id_success,
                               (SELECT message FROM public.notifications WHERE trip_request_id = test_trip_request_id_success AND type = 'auto_booking_success' LIMIT 1),
                               v_notification_data_check; -- Show fetched data for debugging
      END;


  RAISE NOTICE '----------------------------------';
  RAISE NOTICE 'Test Case 2: RPC failure due to non-existent trip_request_id (using UUIDs)';
  RAISE NOTICE 'Setting up test data for failure case...';

  -- 2.1 Setup Booking Request with invalid trip_request_id
  v_offer_data_fail := '{ "id": "test-offer-uuid-fail", "price": 100.00, "airline": "FailAir", "flight_number": "FA000" }'::jsonb;
  INSERT INTO public.booking_requests (
    id, user_id, trip_request_id, offer_id, offer_data, auto, status, 
    error_message, created_at, updated_at
  )
  VALUES (
    test_booking_request_id_fail_rpc, test_user_id, invalid_trip_request_id_for_rpc_fail, 
    v_offer_data_fail->>'id', v_offer_data_fail, 
    true, 'processing', NULL, NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET 
      user_id = EXCLUDED.user_id, 
      trip_request_id = invalid_trip_request_id_for_rpc_fail, 
      offer_id = EXCLUDED.offer_id,
      offer_data = EXCLUDED.offer_data,
      status = 'processing',
      error_message = NULL,
      updated_at = NOW();

  RAISE NOTICE 'Executing RPC public.rpc_auto_book_match(%) for failure case...', test_booking_request_id_fail_rpc;
  -- 2.2 Execute RPC
  PERFORM public.rpc_auto_book_match(test_booking_request_id_fail_rpc);

  -- 2.3 Assert Outcomes for Failure Case
  RAISE NOTICE 'Asserting booking_request status is "failed" with correct error message...';
  PERFORM 
      CASE 
          WHEN (SELECT COUNT(*) FROM public.booking_requests 
                WHERE id = test_booking_request_id_fail_rpc 
                AND status = 'failed' 
                AND error_message LIKE 'Associated trip request ID ' || invalid_trip_request_id_for_rpc_fail || ' not found%') = 1 
          THEN RAISE NOTICE 'SUCCESS: Booking request ID % status is "failed" with correct error message.', test_booking_request_id_fail_rpc;
          ELSE RAISE EXCEPTION 'FAIL: Booking request ID % status not "failed" or error_message incorrect. Status: %, Error: %', 
                               test_booking_request_id_fail_rpc,
                               (SELECT status FROM public.booking_requests WHERE id = test_booking_request_id_fail_rpc), 
                               (SELECT error_message FROM public.booking_requests WHERE id = test_booking_request_id_fail_rpc);
      END;

  RAISE NOTICE 'Asserting no booking was created for the failed case...';
  PERFORM
      CASE
          WHEN (SELECT COUNT(*) FROM public.bookings WHERE booking_request_id = test_booking_request_id_fail_rpc) = 0
          THEN RAISE NOTICE 'SUCCESS: No booking created for booking_request_id %.', test_booking_request_id_fail_rpc;
          ELSE RAISE EXCEPTION 'FAIL: A booking was created for booking_request_id %, but should not have been.', test_booking_request_id_fail_rpc;
      END;

  RAISE NOTICE 'Asserting no notification was created for the failed case...';
  PERFORM
      CASE
          WHEN (SELECT COUNT(*) FROM public.notifications WHERE (data->>'booking_request_id')::UUID = test_booking_request_id_fail_rpc AND type = 'auto_booking_success') = 0
          THEN RAISE NOTICE 'SUCCESS: No auto_booking_success notification created for booking_request_id %.', test_booking_request_id_fail_rpc;
          ELSE RAISE EXCEPTION 'FAIL: An auto_booking_success notification was created for booking_request_id %, but should not have been.', test_booking_request_id_fail_rpc;
      END;

END $$;

-- Restore RLS setting to its original value
SET session_replication_role = 'origin';

RAISE NOTICE '----------------------------------';
RAISE NOTICE 'All tests in suite rpc_auto_book_match (UUID Version) completed.';

-- Rollback transaction to clean up all test data
ROLLBACK;

RAISE NOTICE 'Transaction rolled back. Test data cleaned up.';
```

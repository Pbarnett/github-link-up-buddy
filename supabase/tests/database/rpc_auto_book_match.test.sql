-- supabase/tests/database/rpc_auto_book_match.test.sql

-- Start a transaction
BEGIN;

-- Optional: Disable RLS for the current session if needed for setup/assertions
-- This allows the script to freely insert/select data without policy interference.
-- Make sure this is acceptable for your testing environment.
SET session_replication_role = 'replica';

RAISE NOTICE 'Test Suite: rpc_auto_book_match';
RAISE NOTICE '----------------------------------';

-- Ensure a test user exists. 
-- This is a common practice for tests. Replace with your actual test user setup if different.
-- In a real CI, you might have a dedicated test user created by migrations.
INSERT INTO auth.users (id, email, role, aud, encrypted_password)
VALUES ('00000000-0000-0000-0000-000000000000'::uuid, 'testuser@example.com', 'authenticated', 'authenticated', crypt('password123', gen_salt('bf')))
ON CONFLICT (id) DO NOTHING;


RAISE NOTICE 'Test Case 1: Successful auto-booking';
RAISE NOTICE 'Setting up test data for successful auto-booking...';

-- 1.1 Setup Trip Request
-- Using ON CONFLICT to make test script rerunnable if BEGIN/ROLLBACK is commented out during dev.
-- Explicitly setting ID for predictability in tests.
INSERT INTO public.trip_requests (id, user_id, origin_location_code, destination_location_code, departure_date, return_date, adults, auto_book, budget, best_price, updated_at) 
VALUES (1001, '00000000-0000-0000-0000-000000000000'::uuid, 'LAX', 'JFK', '2024-12-01', '2024-12-10', 1, true, 350.00, 400.00, NOW())
ON CONFLICT (id) DO UPDATE SET 
    user_id = EXCLUDED.user_id, 
    origin_location_code = EXCLUDED.origin_location_code, 
    destination_location_code = EXCLUDED.destination_location_code,
    budget = EXCLUDED.budget,
    best_price = EXCLUDED.best_price,
    updated_at = NOW();
-- Manually advance sequence if it exists and if IDs are serial, to avoid issues if table uses serial for ID.
-- This is good practice if not using ON CONFLICT for sequence-based PKs.
-- Assuming 'id' is a serial or identity column managed by a sequence:
SELECT setval(pg_get_serial_sequence('public.trip_requests', 'id'), COALESCE((SELECT MAX(id) FROM public.trip_requests), 1001));

-- 1.2 Setup Booking Request
INSERT INTO public.booking_requests (id, user_id, trip_request_id, offer_id, offer_data, auto, status, error_message, created_at, updated_at)
VALUES (2001, '00000000-0000-0000-0000-000000000000'::uuid, 1001, 'test-offer-123', 
        '{ "id": "test-offer-123", "price": 299.99, "airline": "TestAir", "flight_number": "TA101", "departure_date": "2024-12-01", "departure_time": "10:00", "arrival_time": "13:00", "return_date": "2024-12-10", "return_time": "18:00", "duration": "5h" }'::jsonb, 
        true, 'processing', NULL, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
    user_id = EXCLUDED.user_id, 
    trip_request_id = EXCLUDED.trip_request_id,
    offer_id = EXCLUDED.offer_id,
    offer_data = EXCLUDED.offer_data,
    status = 'processing', -- Reset status for re-run
    error_message = NULL,  -- Reset error message
    updated_at = NOW();
SELECT setval(pg_get_serial_sequence('public.booking_requests', 'id'), COALESCE((SELECT MAX(id) FROM public.booking_requests), 2001));

RAISE NOTICE 'Executing RPC public.rpc_auto_book_match(2001) for success case...';
-- 1.3 Execute RPC
SELECT public.rpc_auto_book_match(2001);

-- 1.4 Assert Outcomes
RAISE NOTICE 'Asserting booking_request status is done...';
PERFORM 
    CASE 
        WHEN (SELECT COUNT(*) FROM public.booking_requests WHERE id = 2001 AND status = 'done' AND error_message IS NULL) = 1 THEN RAISE NOTICE 'SUCCESS: Booking request ID 2001 status is done.';
        ELSE RAISE EXCEPTION 'FAIL: Booking request ID 2001 status not "done" or error_message not null. Status: %, Error: %', 
                             (SELECT status FROM public.booking_requests WHERE id = 2001), 
                             (SELECT error_message FROM public.booking_requests WHERE id = 2001);
    END;

RAISE NOTICE 'Asserting booking was created correctly...';
PERFORM 
    CASE 
        WHEN (SELECT COUNT(*) FROM public.bookings 
              WHERE booking_request_id = 2001 
              AND trip_request_id = 1001
              AND user_id = '00000000-0000-0000-0000-000000000000'::uuid
              AND source = 'auto' 
              AND status = 'booked' 
              AND price = 299.99
              AND flight_details->>'airline' = 'TestAir'
             ) = 1 THEN RAISE NOTICE 'SUCCESS: Booking for request ID 2001 created correctly.';
        ELSE RAISE EXCEPTION 'FAIL: Booking for request ID 2001 not created or has incorrect details.';
    END;

RAISE NOTICE 'Asserting notification was created correctly...';
DECLARE
  v_booking_id_for_notification BIGINT;
BEGIN
  SELECT id INTO v_booking_id_for_notification FROM public.bookings WHERE booking_request_id = 2001;

  PERFORM 
      CASE 
          WHEN (SELECT COUNT(*) FROM public.notifications 
                WHERE trip_request_id = 1001 
                AND user_id = '00000000-0000-0000-0000-000000000000'::uuid
                AND type = 'auto_booking_success' 
                AND message LIKE '%flight from LAX to JFK with TestAir (TA101) for $299.99!%'
                AND (data->>'booking_id')::BIGINT = v_booking_id_for_notification
                AND data->>'offer_id' = 'test-offer-123'
                AND (data->>'price')::NUMERIC = 299.99
               ) = 1 THEN RAISE NOTICE 'SUCCESS: Notification for trip ID 1001 created correctly.';
          ELSE RAISE EXCEPTION 'FAIL: Notification for trip ID 1001 not created or has incorrect details. Message: %, Data: %', 
                               (SELECT message FROM public.notifications WHERE trip_request_id = 1001 AND type = 'auto_booking_success' LIMIT 1),
                               (SELECT data FROM public.notifications WHERE trip_request_id = 1001 AND type = 'auto_booking_success' LIMIT 1);
      END;
END;


RAISE NOTICE '----------------------------------';
RAISE NOTICE 'Test Case 2: RPC failure due to non-existent trip_request_id';
RAISE NOTICE 'Setting up test data for failure case (non-existent trip_request_id)...';

-- 2.1 Setup Booking Request with invalid trip_request_id
INSERT INTO public.booking_requests (id, user_id, trip_request_id, offer_id, offer_data, auto, status, error_message, created_at, updated_at)
VALUES (2002, '00000000-0000-0000-0000-000000000000'::uuid, 9999, 'test-offer-fail', -- 9999 is a non-existent trip_request_id
        '{ "price": 100.00, "airline": "FailAir", "flight_number": "FA000" }'::jsonb, 
        true, 'processing', NULL, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
    user_id = EXCLUDED.user_id, 
    trip_request_id = 9999, -- Ensure this is the non-existent ID
    offer_id = EXCLUDED.offer_id,
    offer_data = EXCLUDED.offer_data,
    status = 'processing',
    error_message = NULL,
    updated_at = NOW();
SELECT setval(pg_get_serial_sequence('public.booking_requests', 'id'), COALESCE((SELECT MAX(id) FROM public.booking_requests), 2002));

RAISE NOTICE 'Executing RPC public.rpc_auto_book_match(2002) for failure case...';
-- 2.2 Execute RPC (this should trigger the EXCEPTION block in the RPC)
-- No need to SELECT from it if it returns void and errors are handled by raising exceptions or updating tables.
-- The actual call is what matters.
PERFORM public.rpc_auto_book_match(2002);


-- 2.3 Assert Outcomes for Failure Case
RAISE NOTICE 'Asserting booking_request status is "failed" with correct error message...';
PERFORM 
    CASE 
        WHEN (SELECT COUNT(*) FROM public.booking_requests 
              WHERE id = 2002 
              AND status = 'failed' 
              AND error_message LIKE 'Associated trip request with ID 9999 not found%') = 1 
        THEN RAISE NOTICE 'SUCCESS: Booking request ID 2002 status is "failed" with correct error message.';
        ELSE RAISE EXCEPTION 'FAIL: Booking request ID 2002 status not "failed" or error_message incorrect. Status: %, Error: %', 
                             (SELECT status FROM public.booking_requests WHERE id = 2002), 
                             (SELECT error_message FROM public.booking_requests WHERE id = 2002);
    END;

RAISE NOTICE 'Asserting no booking was created for the failed case...';
PERFORM
    CASE
        WHEN (SELECT COUNT(*) FROM public.bookings WHERE booking_request_id = 2002) = 0
        THEN RAISE NOTICE 'SUCCESS: No booking created for booking_request_id 2002.';
        ELSE RAISE EXCEPTION 'FAIL: A booking was created for booking_request_id 2002, but should not have been.';
    END;

RAISE NOTICE 'Asserting no notification was created for the failed case...';
PERFORM
    CASE
        WHEN (SELECT COUNT(*) FROM public.notifications WHERE data->>'offer_id' = 'test-offer-fail') = 0 -- Assuming offer_id is unique to this test case
        THEN RAISE NOTICE 'SUCCESS: No auto_booking_success notification created for offer_id "test-offer-fail".';
        ELSE RAISE EXCEPTION 'FAIL: An auto_booking_success notification was created for offer_id "test-offer-fail", but should not have been.';
    END;


-- Restore RLS setting to its original value if it was changed
SET session_replication_role = 'origin';

RAISE NOTICE '----------------------------------';
RAISE NOTICE 'All tests in suite rpc_auto_book_match completed.';

-- Rollback transaction to clean up all test data
ROLLBACK;

RAISE NOTICE 'Transaction rolled back. Test data cleaned up.';
```

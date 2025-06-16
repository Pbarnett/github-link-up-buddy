

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."booking_request_status" AS ENUM (
    'new',
    'pending_payment',
    'pending_booking',
    'processing',
    'done',
    'failed',
    'cancelled'
);


ALTER TYPE "public"."booking_request_status" OWNER TO "postgres";


COMMENT ON TYPE "public"."booking_request_status" IS 'Enum for tracking the lifecycle status of a booking request. Values include: new, pending_payment, pending_booking, processing, done, failed, cancelled.';



CREATE TYPE "public"."booking_status_enum" AS ENUM (
    'pending',
    'booked',
    'ticketed',
    'failed',
    'canceled'
);


ALTER TYPE "public"."booking_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."payment_status_enum" AS ENUM (
    'unpaid',
    'pending',
    'paid',
    'failed'
);


ALTER TYPE "public"."payment_status_enum" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_reminder_candidates"() RETURNS TABLE("booking_request_id" "uuid", "user_id" "uuid", "phone" "text", "trip_details" "jsonb", "departure_date" "text", "departure_time" "text")
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    br.id as booking_request_id,
    br.user_id,
    p.phone,
    br.offer_data as trip_details,
    (br.offer_data->>'departure_date')::text as departure_date,
    (br.offer_data->>'departure_time')::text as departure_time
  FROM booking_requests br
  JOIN profiles p ON p.id = br.user_id
  WHERE
    br.status = 'done'
    AND p.phone IS NOT NULL
    AND (br.offer_data->>'departure_date')::date BETWEEN
      (CURRENT_DATE + INTERVAL '23 hours')::date AND
      (CURRENT_DATE + INTERVAL '25 hours')::date
    AND NOT EXISTS (
      SELECT 1 FROM notifications n
      WHERE n.booking_request_id = br.id
      AND n.type = 'reminder'
    );
END;
$$;


ALTER FUNCTION "public"."get_reminder_candidates"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rpc_auto_book_match"("p_booking_request_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
DECLARE
  v_booking_request public.booking_requests%ROWTYPE;
  v_offer_data JSONB;
  v_user_id UUID;
  v_trip_request_id UUID;
  v_new_booking_id BIGINT;
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


ALTER FUNCTION "public"."rpc_auto_book_match"("p_booking_request_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rpc_auto_book_match"("p_match_id" "uuid", "p_payment_intent_id" "text", "p_currency" "text" DEFAULT 'usd'::"text") RETURNS "record"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_match RECORD;
  v_trip_request RECORD;
  v_flight_offer RECORD;
  v_order_id UUID;
  v_booking_id UUID;
  v_result RECORD;
  v_description TEXT;
BEGIN
  -- Get the flight match
  SELECT * INTO v_match
  FROM flight_matches
  WHERE id = p_match_id;

  -- Check if match exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Flight match not found' USING ERRCODE = 'P0002';
  END IF;

  -- Get the trip request
  SELECT * INTO v_trip_request
  FROM trip_requests
  WHERE id = v_match.trip_request_id;

  -- Check if user has permission
  IF v_trip_request.auto_book_enabled = FALSE THEN
    RAISE EXCEPTION 'Trip request does not have auto-booking enabled' USING ERRCODE = 'P0004';
  END IF;

  -- Check if payment method exists
  IF v_trip_request.preferred_payment_method_id IS NULL THEN
    RAISE EXCEPTION 'No payment method specified' USING ERRCODE = 'P0005';
  END IF;

  -- Get the flight offer
  SELECT * INTO v_flight_offer
  FROM flight_offers
  WHERE id = v_match.flight_offer_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Flight offer not found' USING ERRCODE = 'P0002';
  END IF;

  -- Build a safe description
  SELECT
    'Flight ' || v_flight_offer.airline || ' ' || v_flight_offer.flight_number ||
    ': ' || v_flight_offer.departure_date || ' to ' || v_flight_offer.return_date
  INTO v_description;

  -- Check if already booked (prevent double-booking)
  PERFORM 1
  FROM orders
  WHERE match_id = p_match_id;

  IF FOUND THEN
    RAISE EXCEPTION 'Flight match already booked' USING ERRCODE = 'P0003';
  END IF;

  -- Insert order record
  INSERT INTO orders (
    user_id,
    match_id,
    payment_intent_id,
    amount,
    currency,
    description
  ) VALUES (
    v_trip_request.user_id,
    p_match_id,
    p_payment_intent_id,
    v_match.price,
    p_currency,
    v_description
  )
  RETURNING id INTO v_order_id;

  -- Create booking record
  INSERT INTO bookings (
    user_id,
    trip_request_id,
    flight_offer_id,
    booked_at
  ) VALUES (
    v_trip_request.user_id,
    v_match.trip_request_id,
    v_match.flight_offer_id,
    now()
  )
  RETURNING id INTO v_booking_id;

  -- Mark match as notified
  UPDATE flight_matches
  SET notified = TRUE
  WHERE id = p_match_id;

  -- Turn off auto-booking for this trip request
  UPDATE trip_requests
  SET auto_book_enabled = FALSE
  WHERE id = v_match.trip_request_id;

  -- Return the IDs for reference
  SELECT
    v_order_id AS order_id,
    v_booking_id AS booking_id
  INTO v_result;

  RETURN v_result;
EXCEPTION
  WHEN others THEN
    -- Map any other errors to P0001 (general/unexpected)
    IF SQLERRM <> 'P0002' AND SQLERRM <> 'P0003' AND SQLERRM <> 'P0004' AND SQLERRM <> 'P0005' AND SQLERRM <> 'P0006' THEN
      RAISE EXCEPTION 'Unexpected error: %', SQLERRM USING ERRCODE = 'P0001';
    ELSE
      -- Re-raise the original error with its code
      RAISE;
    END IF;
END;
$$;


ALTER FUNCTION "public"."rpc_auto_book_match"("p_match_id" "uuid", "p_payment_intent_id" "text", "p_currency" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_destination_location_code"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.destination_location_code IS NULL THEN
    NEW.destination_location_code := NEW.destination_airport;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_destination_location_code"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."auto_booking_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_request_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'watching'::"text" NOT NULL,
    "criteria" "jsonb" NOT NULL,
    "price_history" "jsonb" DEFAULT '[]'::"jsonb",
    "latest_booking_request_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."auto_booking_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."booking_attempts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_request_id" "uuid",
    "attempt_timestamp" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."booking_attempts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."booking_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "offer_id" "uuid" NOT NULL,
    "offer_data" "jsonb" NOT NULL,
    "auto" boolean DEFAULT false NOT NULL,
    "status" "public"."booking_request_status" DEFAULT 'new'::"public"."booking_request_status" NOT NULL,
    "attempts" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "processed_at" timestamp with time zone,
    "checkout_session_id" "text",
    "traveler_data" "jsonb",
    "trip_request_id" "uuid",
    "error_message" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "payment_captured" boolean DEFAULT false NOT NULL,
    "reminder_scheduled" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."booking_requests" OWNER TO "postgres";


COMMENT ON COLUMN "public"."booking_requests"."traveler_data" IS 'Passenger information required for flight booking (firstName, lastName, dateOfBirth, gender, passportNumber, etc.)';



COMMENT ON COLUMN "public"."booking_requests"."payment_captured" IS 'Flag to indicate if the payment for this booking request has been successfully captured. Used for idempotency in auto-booking.';



COMMENT ON COLUMN "public"."booking_requests"."reminder_scheduled" IS 'Flag to indicate if a reminder notification has been scheduled or sent for this request.';



CREATE TABLE IF NOT EXISTS "public"."bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "trip_request_id" "uuid" NOT NULL,
    "flight_offer_id" "uuid" NOT NULL,
    "booked_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "booking_request_id" "uuid",
    "flight_details" "jsonb",
    "price" numeric,
    "source" "text" DEFAULT 'manual'::"text",
    "status" "public"."booking_status_enum" DEFAULT 'pending'::"public"."booking_status_enum",
    "email_reminder_sent" boolean DEFAULT false NOT NULL,
    "sms_reminder_sent" boolean DEFAULT false NOT NULL,
    "one_hour_email_sent" boolean DEFAULT false NOT NULL,
    "one_hour_sms_sent" boolean DEFAULT false NOT NULL,
    "second_reminder_scheduled_at" timestamp without time zone,
    "pnr" "text",
    "payment_status" "text" DEFAULT 'unpaid'::"text" NOT NULL,
    "selected_seat_number" "text",
    "booking_attempt_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "seat_fee" numeric(10,2) DEFAULT 0.00,
    "amadeus_order_id" "text",
    "payment_intent_id" "text"
);


ALTER TABLE "public"."bookings" OWNER TO "postgres";


COMMENT ON COLUMN "public"."bookings"."booked_at" IS 'Timestamp of when the booking was confirmed/ticketed.';



COMMENT ON COLUMN "public"."bookings"."booking_request_id" IS 'Foreign key linking to the original booking_request, if applicable.';



COMMENT ON COLUMN "public"."bookings"."payment_intent_id" IS 'Stripe PaymentIntent ID associated with this booking''s payment.';



CREATE TABLE IF NOT EXISTS "public"."feature_flags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "enabled" boolean DEFAULT false NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."feature_flags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."flight_matches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_request_id" "uuid" NOT NULL,
    "flight_offer_id" "uuid" NOT NULL,
    "price" numeric NOT NULL,
    "depart_at" timestamp with time zone NOT NULL,
    "notified" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."flight_matches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."flight_offers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_request_id" "uuid" NOT NULL,
    "airline" "text" NOT NULL,
    "flight_number" "text" NOT NULL,
    "departure_date" "text" NOT NULL,
    "departure_time" "text" NOT NULL,
    "return_date" "text" NOT NULL,
    "return_time" "text" NOT NULL,
    "duration" "text" NOT NULL,
    "price" numeric NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "auto_book" boolean DEFAULT true NOT NULL,
    "booking_url" "text",
    "stops" integer DEFAULT 0 NOT NULL,
    "layover_airports" "text"[],
    "carrier_code" "text",
    "origin_airport" "text",
    "destination_airport" "text",
    "baggage_included" boolean DEFAULT false NOT NULL,
    "selected_seat_type" "text",
    "nonstop_match" boolean DEFAULT false
);


ALTER TABLE "public"."flight_offers" OWNER TO "postgres";


COMMENT ON COLUMN "public"."flight_offers"."auto_book" IS 'Whether this offer supports automatic booking through our system';



COMMENT ON COLUMN "public"."flight_offers"."booking_url" IS 'External URL for manual booking on airline website';



COMMENT ON COLUMN "public"."flight_offers"."stops" IS 'Number of stops/layovers for this flight';



COMMENT ON COLUMN "public"."flight_offers"."layover_airports" IS 'Array of airport codes for layover stops';



COMMENT ON COLUMN "public"."flight_offers"."carrier_code" IS 'IATA airline code (e.g., B6, DL, AA) for lookup to friendly airline names';



COMMENT ON COLUMN "public"."flight_offers"."origin_airport" IS 'IATA departure airport code (e.g., MVY, JFK) for route display';



COMMENT ON COLUMN "public"."flight_offers"."destination_airport" IS 'IATA arrival airport code (e.g., JFK, LAX) for route display';



COMMENT ON COLUMN "public"."flight_offers"."baggage_included" IS 'Whether carry-on baggage is included in the price';



COMMENT ON COLUMN "public"."flight_offers"."nonstop_match" IS 'Whether this flight offer matches nonstop requirements';



CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "is_read" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "booking_request_id" "uuid",
    "trip_request_id" "uuid",
    "message" "text",
    "data" "jsonb",
    "channel" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "retry_count" integer DEFAULT 0,
    "sent_at" timestamp with time zone,
    "booking_id" "uuid",
    "payload" "jsonb"
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


COMMENT ON TABLE "public"."notifications" IS 'Stores user-facing notifications for various events like booking status changes and reminders.';



COMMENT ON COLUMN "public"."notifications"."type" IS 'Type of notification, e.g., booking_success, booking_failure, reminder_23h, booking_canceled';



COMMENT ON COLUMN "public"."notifications"."payload" IS 'JSONB payload with additional data specific to the notification type, e.g., PNR, flight details, error messages.';



CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "match_id" "uuid" NOT NULL,
    "payment_intent_id" "text" NOT NULL,
    "amount" numeric NOT NULL,
    "currency" "text" DEFAULT 'usd'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text",
    "status" "text" DEFAULT 'completed'::"text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "booking_request_id" "uuid",
    "checkout_session_id" "text",
    "error_message" "text"
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_methods" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "stripe_pm_id" "text" NOT NULL,
    "brand" "text" NOT NULL,
    "last4" "text" NOT NULL,
    "exp_month" integer NOT NULL,
    "exp_year" integer NOT NULL,
    "is_default" boolean DEFAULT false NOT NULL,
    "nickname" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "stripe_customer_id" "text"
);


ALTER TABLE "public"."payment_methods" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "booking_id" "uuid",
    "stripe_payment_intent_id" "text",
    "amount" numeric NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "status" "public"."payment_status_enum" DEFAULT 'unpaid'::"public"."payment_status_enum" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "phone" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "email" "text" NOT NULL,
    "prefers_email_notifications" boolean DEFAULT true,
    "prefers_sms_notifications" boolean DEFAULT false
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trip_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "earliest_departure" timestamp with time zone NOT NULL,
    "latest_departure" timestamp with time zone NOT NULL,
    "budget" numeric NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "departure_airports" "text"[] DEFAULT ARRAY[]::"text"[] NOT NULL,
    "destination_airport" "text",
    "min_duration" integer DEFAULT 3 NOT NULL,
    "max_duration" integer DEFAULT 6 NOT NULL,
    "auto_book" boolean DEFAULT false NOT NULL,
    "max_price" numeric,
    "preferred_payment_method_id" "uuid",
    "last_checked_at" timestamp with time zone,
    "best_price" numeric,
    "origin_location_code" "text",
    "destination_location_code" "text" NOT NULL,
    "departure_date" "date",
    "return_date" "date",
    "adults" integer DEFAULT 1,
    "auto_book_enabled" boolean DEFAULT false NOT NULL,
    "nonstop_required" boolean DEFAULT true NOT NULL,
    "baggage_included_required" boolean DEFAULT false NOT NULL,
    CONSTRAINT "trip_requests_budget_check" CHECK ((("budget" >= (100)::numeric) AND ("budget" <= (10000)::numeric)))
);


ALTER TABLE "public"."trip_requests" OWNER TO "postgres";


ALTER TABLE ONLY "public"."auto_booking_requests"
    ADD CONSTRAINT "auto_booking_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."booking_attempts"
    ADD CONSTRAINT "booking_attempts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."booking_attempts"
    ADD CONSTRAINT "booking_attempts_trip_request_id_key" UNIQUE ("trip_request_id");



ALTER TABLE ONLY "public"."booking_requests"
    ADD CONSTRAINT "booking_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."feature_flags"
    ADD CONSTRAINT "feature_flags_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."feature_flags"
    ADD CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."flight_matches"
    ADD CONSTRAINT "flight_matches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."flight_matches"
    ADD CONSTRAINT "flight_matches_trip_offer_unique" UNIQUE ("trip_request_id", "flight_offer_id");



ALTER TABLE ONLY "public"."flight_offers"
    ADD CONSTRAINT "flight_offers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_match_id_key" UNIQUE ("match_id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_methods"
    ADD CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trip_requests"
    ADD CONSTRAINT "trip_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "unique_match_id" UNIQUE ("match_id");



CREATE INDEX "idx_auto_booking_requests_user_id" ON "public"."auto_booking_requests" USING "btree" ("user_id");



CREATE INDEX "idx_booking_requests_status" ON "public"."booking_requests" USING "btree" ("status");



CREATE INDEX "idx_bookings_amadeus_order_id" ON "public"."bookings" USING "btree" ("amadeus_order_id");



CREATE INDEX "idx_bookings_booking_attempt_id" ON "public"."bookings" USING "btree" ("booking_attempt_id");



CREATE INDEX "idx_bookings_pnr" ON "public"."bookings" USING "btree" ("pnr");



CREATE INDEX "idx_notifications_booking_id" ON "public"."notifications" USING "btree" ("booking_id");



CREATE INDEX "idx_notifications_is_read" ON "public"."notifications" USING "btree" ("is_read");



CREATE INDEX "idx_notifications_status" ON "public"."notifications" USING "btree" ("status");



CREATE INDEX "idx_notifications_type" ON "public"."notifications" USING "btree" ("type");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_orders_payment_intent_id" ON "public"."orders" USING "btree" ("payment_intent_id");



CREATE INDEX "idx_orders_user_id" ON "public"."orders" USING "btree" ("user_id");



CREATE INDEX "idx_payment_methods_stripe_customer_id" ON "public"."payment_methods" USING "btree" ("stripe_customer_id");



CREATE INDEX "idx_pm_is_default" ON "public"."payment_methods" USING "btree" ("is_default");



CREATE INDEX "idx_pm_user_id" ON "public"."payment_methods" USING "btree" ("user_id");



CREATE INDEX "orders_match_id_idx" ON "public"."orders" USING "btree" ("match_id");



CREATE INDEX "orders_user_id_idx" ON "public"."orders" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "trg_default_dest_code" BEFORE INSERT OR UPDATE ON "public"."trip_requests" FOR EACH ROW EXECUTE FUNCTION "public"."set_destination_location_code"();



ALTER TABLE ONLY "public"."auto_booking_requests"
    ADD CONSTRAINT "auto_booking_requests_trip_request_id_fkey" FOREIGN KEY ("trip_request_id") REFERENCES "public"."trip_requests"("id");



ALTER TABLE ONLY "public"."auto_booking_requests"
    ADD CONSTRAINT "auto_booking_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."booking_attempts"
    ADD CONSTRAINT "booking_attempts_trip_request_id_fkey" FOREIGN KEY ("trip_request_id") REFERENCES "public"."trip_requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."booking_requests"
    ADD CONSTRAINT "booking_requests_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."flight_offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."booking_requests"
    ADD CONSTRAINT "booking_requests_trip_request_id_fkey" FOREIGN KEY ("trip_request_id") REFERENCES "public"."trip_requests"("id");



ALTER TABLE ONLY "public"."booking_requests"
    ADD CONSTRAINT "booking_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_booking_request_id_fkey" FOREIGN KEY ("booking_request_id") REFERENCES "public"."booking_requests"("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_flight_offer_id_fkey" FOREIGN KEY ("flight_offer_id") REFERENCES "public"."flight_offers"("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_trip_request_id_fkey" FOREIGN KEY ("trip_request_id") REFERENCES "public"."trip_requests"("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "fk_bookings_booking_request" FOREIGN KEY ("booking_request_id") REFERENCES "public"."booking_requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "fk_notifications_booking_id" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."flight_matches"
    ADD CONSTRAINT "flight_matches_flight_offer_id_fkey" FOREIGN KEY ("flight_offer_id") REFERENCES "public"."flight_offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."flight_matches"
    ADD CONSTRAINT "flight_matches_trip_request_id_fkey" FOREIGN KEY ("trip_request_id") REFERENCES "public"."trip_requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."flight_offers"
    ADD CONSTRAINT "flight_offers_trip_request_id_fkey" FOREIGN KEY ("trip_request_id") REFERENCES "public"."trip_requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_booking_request_id_fkey" FOREIGN KEY ("booking_request_id") REFERENCES "public"."booking_requests"("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_trip_request_id_fkey" FOREIGN KEY ("trip_request_id") REFERENCES "public"."trip_requests"("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_booking_request_id_fkey" FOREIGN KEY ("booking_request_id") REFERENCES "public"."booking_requests"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."flight_matches"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_methods"
    ADD CONSTRAINT "payment_methods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trip_requests"
    ADD CONSTRAINT "trip_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



CREATE POLICY "Anyone can read feature flags" ON "public"."feature_flags" FOR SELECT USING (true);



CREATE POLICY "Authenticated users can manage feature flags" ON "public"."feature_flags" USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Service can insert orders" ON "public"."orders" FOR INSERT WITH CHECK (true);



CREATE POLICY "Service can update booking requests" ON "public"."booking_requests" FOR UPDATE USING (true);



CREATE POLICY "Service can update orders" ON "public"."orders" FOR UPDATE USING (true);



CREATE POLICY "Service role can delete bookings" ON "public"."bookings" FOR DELETE USING (true);



CREATE POLICY "Service role can delete orders" ON "public"."orders" FOR DELETE USING (true);



CREATE POLICY "Service role can insert bookings" ON "public"."bookings" FOR INSERT WITH CHECK (true);



CREATE POLICY "Service role can insert notifications" ON "public"."notifications" FOR INSERT WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Service role can insert orders" ON "public"."orders" FOR INSERT WITH CHECK (true);



CREATE POLICY "Service role can manage orders" ON "public"."orders" USING (true);



CREATE POLICY "Service role can update bookings" ON "public"."bookings" FOR UPDATE USING (true);



CREATE POLICY "Service role can update orders" ON "public"."orders" FOR UPDATE USING (true);



CREATE POLICY "Service role manage notifications" ON "public"."notifications" USING (true);



CREATE POLICY "Users can add payment methods" ON "public"."payment_methods" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can add their own payment methods" ON "public"."payment_methods" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own auto booking requests" ON "public"."auto_booking_requests" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own payment methods" ON "public"."payment_methods" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can delete their own auto booking requests" ON "public"."auto_booking_requests" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own payment methods" ON "public"."payment_methods" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert flight offers for their own trips" ON "public"."flight_offers" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."trip_requests"
  WHERE (("trip_requests"."id" = "flight_offers"."trip_request_id") AND ("trip_requests"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Users can insert matches for their requests" ON "public"."flight_matches" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."trip_requests"
  WHERE (("trip_requests"."id" = "flight_matches"."trip_request_id") AND ("trip_requests"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can insert notifications" ON "public"."notifications" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can insert their own booking requests" ON "public"."booking_requests" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own bookings" ON "public"."bookings" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."trip_requests"
  WHERE (("trip_requests"."id" = "bookings"."trip_request_id") AND ("trip_requests"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Users can insert their own trip requests" ON "public"."trip_requests" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read own payment methods" ON "public"."payment_methods" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can select their own booking requests" ON "public"."booking_requests" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can select their own orders" ON "public"."orders" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own payment methods" ON "public"."payment_methods" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own auto booking requests" ON "public"."auto_booking_requests" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own notifications" ON "public"."notifications" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own payment methods" ON "public"."payment_methods" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view notifications" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own orders" ON "public"."orders" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own auto booking requests" ON "public"."auto_booking_requests" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own bookings" ON "public"."bookings" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own flight offers" ON "public"."flight_offers" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."trip_requests"
  WHERE (("trip_requests"."id" = "flight_offers"."trip_request_id") AND ("trip_requests"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Users can view their own matches" ON "public"."flight_matches" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."trip_requests"
  WHERE (("trip_requests"."id" = "flight_matches"."trip_request_id") AND ("trip_requests"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view their own notifications" ON "public"."notifications" FOR SELECT USING (("booking_request_id" IN ( SELECT "booking_requests"."id"
   FROM "public"."booking_requests"
  WHERE ("booking_requests"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view their own orders" ON "public"."orders" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own payment methods" ON "public"."payment_methods" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own trip requests" ON "public"."trip_requests" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."auto_booking_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."booking_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."feature_flags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."flight_matches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."flight_offers" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "insert_booking_requests" ON "public"."booking_requests" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "no_delete_booking_requests" ON "public"."booking_requests" FOR DELETE USING (false);



ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_methods" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "select_own_booking_requests" ON "public"."booking_requests" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."trip_requests" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "update_booking_request_status_only" ON "public"."booking_requests" FOR UPDATE USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "update_profile_prefs" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "user notifications" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "users_select_own_notifications" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_reminder_candidates"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_reminder_candidates"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_reminder_candidates"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_auto_book_match"("p_booking_request_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_auto_book_match"("p_booking_request_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_auto_book_match"("p_booking_request_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_auto_book_match"("p_match_id" "uuid", "p_payment_intent_id" "text", "p_currency" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_auto_book_match"("p_match_id" "uuid", "p_payment_intent_id" "text", "p_currency" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_auto_book_match"("p_match_id" "uuid", "p_payment_intent_id" "text", "p_currency" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_destination_location_code"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_destination_location_code"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_destination_location_code"() TO "service_role";



GRANT ALL ON TABLE "public"."auto_booking_requests" TO "anon";
GRANT ALL ON TABLE "public"."auto_booking_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."auto_booking_requests" TO "service_role";



GRANT ALL ON TABLE "public"."booking_attempts" TO "anon";
GRANT ALL ON TABLE "public"."booking_attempts" TO "authenticated";
GRANT ALL ON TABLE "public"."booking_attempts" TO "service_role";



GRANT ALL ON TABLE "public"."booking_requests" TO "anon";
GRANT ALL ON TABLE "public"."booking_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."booking_requests" TO "service_role";



GRANT ALL ON TABLE "public"."bookings" TO "anon";
GRANT ALL ON TABLE "public"."bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."bookings" TO "service_role";



GRANT ALL ON TABLE "public"."feature_flags" TO "anon";
GRANT ALL ON TABLE "public"."feature_flags" TO "authenticated";
GRANT ALL ON TABLE "public"."feature_flags" TO "service_role";



GRANT ALL ON TABLE "public"."flight_matches" TO "anon";
GRANT ALL ON TABLE "public"."flight_matches" TO "authenticated";
GRANT ALL ON TABLE "public"."flight_matches" TO "service_role";



GRANT ALL ON TABLE "public"."flight_offers" TO "anon";
GRANT ALL ON TABLE "public"."flight_offers" TO "authenticated";
GRANT ALL ON TABLE "public"."flight_offers" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."payment_methods" TO "anon";
GRANT ALL ON TABLE "public"."payment_methods" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_methods" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."trip_requests" TO "anon";
GRANT ALL ON TABLE "public"."trip_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_requests" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






RESET ALL;

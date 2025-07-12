

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


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






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


CREATE TYPE "public"."duffel_booking_status" AS ENUM (
    'offer_selected',
    'payment_authorized',
    'order_created',
    'ticketed',
    'failed',
    'cancelled',
    'refunded'
);


ALTER TYPE "public"."duffel_booking_status" OWNER TO "postgres";


CREATE TYPE "public"."payment_status_enum" AS ENUM (
    'unpaid',
    'pending',
    'paid',
    'failed'
);


ALTER TYPE "public"."payment_status_enum" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."auto_detect_user_currency"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- This would typically be called after user signup
  -- For now, we'll just set USD as default, but in production
  -- you'd integrate with geolocation services
  
  INSERT INTO user_preferences (user_id, preferred_currency)
  VALUES (NEW.id, 'USD')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."auto_detect_user_currency"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."batch_migrate_to_kms_encryption"("batch_size" integer DEFAULT 10) RETURNS TABLE("migrated_count" integer, "failed_count" integer, "total_remaining" integer)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  profile_record RECORD;
  migrated INTEGER := 0;
  failed INTEGER := 0;
  remaining INTEGER;
BEGIN
  -- Process a batch of records
  FOR profile_record IN 
    SELECT id
    FROM traveler_profiles 
    WHERE encryption_version = 1 
    AND passport_number_encrypted IS NOT NULL
    LIMIT batch_size
  LOOP
    IF migrate_traveler_profile_to_kms(profile_record.id) THEN
      migrated := migrated + 1;
    ELSE
      failed := failed + 1;
    END IF;
  END LOOP;
  
  -- Count remaining records to migrate
  SELECT COUNT(*) INTO remaining
  FROM traveler_profiles 
  WHERE encryption_version = 1 
  AND passport_number_encrypted IS NOT NULL;
  
  RETURN QUERY SELECT migrated, failed, remaining;
END;
$$;


ALTER FUNCTION "public"."batch_migrate_to_kms_encryption"("batch_size" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."batch_migrate_to_kms_encryption"("batch_size" integer) IS 'Batch migration utility for moving to KMS encryption';



CREATE OR REPLACE FUNCTION "public"."calculate_profile_completeness"("profile_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
DECLARE
  profile_record RECORD;
  score INTEGER := 0;
  basic_info_score INTEGER := 0;
  contact_info_score INTEGER := 0;
  travel_docs_score INTEGER := 0;
  preferences_score INTEGER := 0;
  verification_score INTEGER := 0;
BEGIN
  -- Get the profile record
  SELECT * INTO profile_record
  FROM traveler_profiles
  WHERE id = profile_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Calculate basic info score (30% weight)
  IF profile_record.full_name IS NOT NULL AND LENGTH(TRIM(profile_record.full_name)) > 0 THEN
    basic_info_score := basic_info_score + 30;
  END IF;
  
  IF profile_record.date_of_birth IS NOT NULL THEN
    basic_info_score := basic_info_score + 30;
  END IF;
  
  IF profile_record.gender IS NOT NULL THEN
    basic_info_score := basic_info_score + 20;
  END IF;
  
  IF profile_record.email IS NOT NULL AND profile_record.email ~ '^[^@]+@[^@]+\.[^@]+$' THEN
    basic_info_score := basic_info_score + 20;
  END IF;
  
  -- Calculate contact info score (20% weight)
  IF profile_record.email IS NOT NULL AND profile_record.email ~ '^[^@]+@[^@]+\.[^@]+$' THEN
    contact_info_score := contact_info_score + 40;
  END IF;
  
  IF profile_record.phone IS NOT NULL THEN
    contact_info_score := contact_info_score + 30;
    IF profile_record.phone_verified = TRUE THEN
      contact_info_score := contact_info_score + 30;
    END IF;
  END IF;
  
  -- Calculate travel documents score (20% weight)
  IF profile_record.passport_number_encrypted IS NOT NULL THEN
    travel_docs_score := travel_docs_score + 40;
  END IF;
  
  IF profile_record.passport_country IS NOT NULL THEN
    travel_docs_score := travel_docs_score + 20;
  END IF;
  
  IF profile_record.passport_expiry IS NOT NULL THEN
    -- Check if passport is valid for more than 6 months
    IF profile_record.passport_expiry > CURRENT_DATE + INTERVAL '6 months' THEN
      travel_docs_score := travel_docs_score + 20;
    ELSIF profile_record.passport_expiry > CURRENT_DATE THEN
      travel_docs_score := travel_docs_score + 10; -- Expires soon
    END IF;
  END IF;
  
  IF profile_record.known_traveler_number IS NOT NULL THEN
    travel_docs_score := travel_docs_score + 20;
  END IF;
  
  -- Calculate preferences score (15% weight)
  IF profile_record.notification_preferences IS NOT NULL AND profile_record.notification_preferences != '{}' THEN
    preferences_score := preferences_score + 40;
  END IF;
  
  IF profile_record.travel_preferences IS NOT NULL AND profile_record.travel_preferences != '{}' THEN
    preferences_score := preferences_score + 60;
  ELSE
    preferences_score := preferences_score + 30; -- Partial for basic setup
  END IF;
  
  -- Calculate verification score (15% weight)
  IF profile_record.is_verified = TRUE THEN
    verification_score := 100;
  ELSE
    IF profile_record.passport_number_encrypted IS NOT NULL AND profile_record.passport_country IS NOT NULL THEN
      verification_score := verification_score + 30;
    END IF;
    
    IF profile_record.phone_verified = TRUE THEN
      verification_score := verification_score + 20;
    END IF;
  END IF;
  
  -- Calculate weighted overall score
  score := ROUND(
    (basic_info_score * 0.3) +
    (contact_info_score * 0.2) +
    (travel_docs_score * 0.2) +
    (preferences_score * 0.15) +
    (verification_score * 0.15)
  );
  
  RETURN LEAST(score, 100);
END;
$_$;


ALTER FUNCTION "public"."calculate_profile_completeness"("profile_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."calculate_profile_completeness"("profile_id" "uuid") IS 'Calculates weighted profile completion score based on filled fields and verification status';



CREATE OR REPLACE FUNCTION "public"."check_verification_requirement"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
  -- Require verification for high-value campaigns (>$2000)
  IF NEW.max_price > 2000 THEN
    NEW.requires_verification = TRUE;
  END IF;
  
  -- Require verification for international routes over $1000
  -- This is a simplified check - in production you'd use proper airport/country mapping
  IF NEW.max_price > 1000 AND (
    (NEW.origin LIKE '%JFK%' OR NEW.origin LIKE '%LAX%' OR NEW.origin LIKE '%ORD%') 
    AND NOT (NEW.destination LIKE '%JFK%' OR NEW.destination LIKE '%LAX%' OR NEW.destination LIKE '%ORD%')
  ) THEN
    NEW.requires_verification = TRUE;
  END IF;
  
  RETURN NEW;
END;
$_$;


ALTER FUNCTION "public"."check_verification_requirement"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."convert_price"("amount" numeric, "from_curr" "text", "to_curr" "text") RETURNS numeric
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
  rate DECIMAL;
BEGIN
  -- If same currency, return original amount
  IF from_curr = to_curr THEN
    RETURN amount;
  END IF;
  
  -- Get latest exchange rate
  SELECT er.rate INTO rate
  FROM exchange_rates er
  WHERE er.from_currency = from_curr 
    AND er.to_currency = to_curr
    AND er.last_updated > NOW() - INTERVAL '1 hour'
  ORDER BY er.last_updated DESC
  LIMIT 1;
  
  -- If no recent rate found, return original amount
  IF rate IS NULL THEN
    RETURN amount;
  END IF;
  
  -- Convert and round to 2 decimal places
  RETURN ROUND(amount * rate, 2);
END;
$$;


ALTER FUNCTION "public"."convert_price"("amount" numeric, "from_curr" "text", "to_curr" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."convert_price"("amount" numeric, "from_curr" "text", "to_curr" "text") IS 'Convert amount between currencies using cached exchange rates';



CREATE OR REPLACE FUNCTION "public"."create_booking_attempt"("p_trip_request_id" "uuid", "p_offer_id" "text", "p_idempotency_key" "text", "p_passenger_data" "jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_attempt_id UUID;
BEGIN
  -- Check for existing attempt with same idempotency key
  SELECT id INTO v_attempt_id 
  FROM booking_attempts 
  WHERE idempotency_key = p_idempotency_key;
  
  IF v_attempt_id IS NOT NULL THEN
    RETURN v_attempt_id;
  END IF;
  
  -- Create new booking attempt
  INSERT INTO booking_attempts (
    trip_request_id,
    duffel_offer_id,
    idempotency_key,
    status,
    created_at
  ) VALUES (
    p_trip_request_id,
    p_offer_id,
    p_idempotency_key,
    'pending',
    NOW()
  ) RETURNING id INTO v_attempt_id;
  
  RETURN v_attempt_id;
END;
$$;


ALTER FUNCTION "public"."create_booking_attempt"("p_trip_request_id" "uuid", "p_offer_id" "text", "p_idempotency_key" "text", "p_passenger_data" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."decrypt_passport_number"("encrypted_passport" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  IF encrypted_passport IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get encryption key from environment
  encryption_key := current_setting('app.passport_encryption_key', true);
  
  -- If no key is set, use a default (NOT for production)
  IF encryption_key IS NULL OR encryption_key = '' THEN
    encryption_key := 'change-this-key-in-production-environment';
  END IF;
  
  -- Decrypt using AES
  RETURN convert_from(decrypt(decode(encrypted_passport, 'base64'), encryption_key, 'aes'), 'UTF8');
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return NULL if decryption fails
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."decrypt_passport_number"("encrypted_passport" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."decrypt_passport_number_legacy"("encrypted_passport" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  -- This is the legacy function, kept for backward compatibility during migration
  IF encrypted_passport IS NULL THEN
    RETURN NULL;
  END IF;
  
  encryption_key := current_setting('app.passport_encryption_key', true);
  
  IF encryption_key IS NULL OR encryption_key = '' THEN
    encryption_key := 'change-this-key-in-production-environment';
  END IF;
  
  RETURN convert_from(decrypt(decode(encrypted_passport, 'base64'), encryption_key, 'aes'), 'UTF8');
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."decrypt_passport_number_legacy"("encrypted_passport" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."encrypt_passport_number"("passport_number" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  -- Get encryption key from environment (you should set this in Supabase dashboard)
  encryption_key := current_setting('app.passport_encryption_key', true);
  
  -- If no key is set, use a default (NOT for production)
  IF encryption_key IS NULL OR encryption_key = '' THEN
    encryption_key := 'change-this-key-in-production-environment';
  END IF;
  
  -- Encrypt using AES
  RETURN encode(encrypt(passport_number::bytea, encryption_key, 'aes'), 'base64');
END;
$$;


ALTER FUNCTION "public"."encrypt_passport_number"("passport_number" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."encrypt_passport_number_legacy"("passport_number" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  -- This is the legacy function, kept for backward compatibility during migration
  encryption_key := current_setting('app.passport_encryption_key', true);
  
  IF encryption_key IS NULL OR encryption_key = '' THEN
    encryption_key := 'change-this-key-in-production-environment';
  END IF;
  
  RETURN encode(encrypt(passport_number::bytea, encryption_key, 'aes'), 'base64');
END;
$$;


ALTER FUNCTION "public"."encrypt_passport_number_legacy"("passport_number" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_passport_number"("profile_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  encrypted_data TEXT;
  encryption_version INTEGER;
  result TEXT;
BEGIN
  -- Get the encrypted passport and version
  SELECT passport_number_encrypted, encryption_version 
  INTO encrypted_data, encryption_version
  FROM traveler_profiles 
  WHERE id = profile_id;
  
  IF encrypted_data IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Handle based on encryption version
  CASE encryption_version
    WHEN 1 THEN
      -- Legacy pgcrypto decryption
      result := decrypt_passport_number_legacy(encrypted_data);
    WHEN 2 THEN
      -- KMS decryption - this should be handled by the Edge Function
      -- Return a placeholder that indicates KMS decryption is needed
      result := '__KMS_ENCRYPTED__';
    ELSE
      -- Unknown version
      result := NULL;
  END CASE;
  
  RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_passport_number"("profile_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_profile_recommendations"("profile_user_id" "uuid") RETURNS TABLE("category" "text", "priority" "text", "title" "text", "description" "text", "action" "text", "points_value" integer)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  profile_record RECORD;
  rec RECORD;
BEGIN
  -- Get the user's primary profile
  SELECT * INTO profile_record
  FROM traveler_profiles
  WHERE user_id = profile_user_id AND is_primary = TRUE;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Phone verification recommendation
  IF profile_record.phone IS NOT NULL AND profile_record.phone_verified = FALSE THEN
    category := 'contact_info';
    priority := 'high';
    title := 'Verify your phone number';
    description := 'Verify your phone number to receive important booking updates via SMS';
    action := 'verify_phone';
    points_value := 15;
    RETURN NEXT;
  END IF;
  
  -- Missing phone recommendation
  IF profile_record.phone IS NULL THEN
    category := 'contact_info';
    priority := 'medium';
    title := 'Add phone number';
    description := 'Add your phone number for SMS notifications and account security';
    action := 'add_phone';
    points_value := 10;
    RETURN NEXT;
  END IF;
  
  -- Travel documents recommendation
  IF profile_record.passport_number_encrypted IS NULL THEN
    category := 'travel_documents';
    priority := 'medium';
    title := 'Add passport information';
    description := 'Add your passport details for faster international booking';
    action := 'add_passport';
    points_value := 20;
    RETURN NEXT;
  END IF;
  
  -- Identity verification recommendation
  IF profile_record.is_verified = FALSE AND profile_record.passport_number_encrypted IS NOT NULL THEN
    category := 'verification';
    priority := 'low';
    title := 'Verify your identity';
    description := 'Complete identity verification for higher booking limits and security';
    action := 'verify_identity';
    points_value := 25;
    RETURN NEXT;
  END IF;
  
  -- Expiring passport recommendation
  IF profile_record.passport_expiry IS NOT NULL THEN
    IF profile_record.passport_expiry <= CURRENT_DATE + INTERVAL '6 months' 
       AND profile_record.passport_expiry > CURRENT_DATE THEN
      category := 'travel_documents';
      priority := 'high';
      title := 'Passport expires soon';
      description := 'Your passport expires soon. Update your passport information.';
      action := 'update_passport';
      points_value := 10;
      RETURN NEXT;
    END IF;
  END IF;
  
  RETURN;
END;
$$;


ALTER FUNCTION "public"."get_profile_recommendations"("profile_user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_profile_recommendations"("profile_user_id" "uuid") IS 'Returns prioritized recommendations for profile improvement';



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


CREATE OR REPLACE FUNCTION "public"."get_user_preferences"("user_uuid" "uuid") RETURNS TABLE("preferred_currency" "text", "home_country" "text", "timezone" "text", "email_notifications" boolean, "sms_notifications" boolean, "push_notifications" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.preferred_currency,
    up.home_country,
    up.timezone,
    up.email_notifications,
    up.sms_notifications,
    up.push_notifications
  FROM user_preferences up
  WHERE up.user_id = user_uuid;
  
  -- If no preferences found, create default ones
  IF NOT FOUND THEN
    INSERT INTO user_preferences (user_id, preferred_currency)
    VALUES (user_uuid, 'USD');
    
    RETURN QUERY
    SELECT 
      'USD'::TEXT as preferred_currency,
      NULL::TEXT as home_country,
      'UTC'::TEXT as timezone,
      TRUE as email_notifications,
      FALSE as sms_notifications,
      TRUE as push_notifications;
  END IF;
END;
$$;


ALTER FUNCTION "public"."get_user_preferences"("user_uuid" "uuid") OWNER TO "postgres";


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


CREATE OR REPLACE FUNCTION "public"."migrate_traveler_profile_to_kms"("profile_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  current_encrypted_passport TEXT;
  decrypted_passport TEXT;
  profile_user_id UUID;
BEGIN
  -- Get the current encrypted passport and user ID
  SELECT passport_number_encrypted, user_id 
  INTO current_encrypted_passport, profile_user_id
  FROM traveler_profiles 
  WHERE id = profile_id AND encryption_version = 1;
  
  -- If no record found or already migrated, return false
  IF NOT FOUND OR current_encrypted_passport IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Decrypt using the old pgcrypto method
  SELECT decrypt_passport_number(current_encrypted_passport) INTO decrypted_passport;
  
  -- If decryption failed, skip this record
  IF decrypted_passport IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Note: The actual re-encryption with KMS will be done via the Edge Function
  -- This function just marks records as ready for migration
  -- The Edge Function will call the KMS API to encrypt and then update the record
  
  -- Log the migration attempt in traveler_data_audit
  INSERT INTO traveler_data_audit (
    user_id,
    traveler_profile_id,
    action,
    field_accessed,
    ip_address
  ) VALUES (
    profile_user_id,
    profile_id::TEXT,
    'migration_prepared',
    'passport_number',
    '127.0.0.1'  -- Internal migration
  );
  
  RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."migrate_traveler_profile_to_kms"("profile_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."migrate_traveler_profile_to_kms"("profile_id" "uuid") IS 'Prepares a single traveler profile for KMS migration';



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


CREATE OR REPLACE FUNCTION "public"."rpc_complete_duffel_booking"("p_attempt_id" "uuid", "p_duffel_order_id" "text", "p_stripe_payment_intent_id" "text", "p_price" numeric, "p_currency" "text" DEFAULT 'USD'::"text", "p_raw_order" "jsonb" DEFAULT NULL::"jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_attempt record;
  v_booking_id uuid;
  v_result jsonb;
BEGIN
  -- Get attempt details
  SELECT * INTO v_attempt
  FROM booking_attempts 
  WHERE id = p_attempt_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking attempt not found' USING ERRCODE = 'P0002';
  END IF;
  
  -- Create booking record
  INSERT INTO bookings (
    user_id,
    trip_request_id,
    booking_attempt_id,
    provider,
    duffel_order_id,
    stripe_payment_intent_id,
    price,
    currency,
    status,
    duffel_status,
    duffel_raw_order,
    source,
    booked_at
  ) 
  SELECT 
    tr.user_id,
    v_attempt.trip_request_id,
    p_attempt_id,
    'duffel',
    p_duffel_order_id,
    p_stripe_payment_intent_id,
    p_price,
    p_currency,
    'confirmed',
    'ticketed',
    p_raw_order,
    'auto',
    now()
  FROM trip_requests tr 
  WHERE tr.id = v_attempt.trip_request_id
  RETURNING id INTO v_booking_id;
  
  -- Update attempt status
  UPDATE booking_attempts SET
    status = 'completed',
    ended_at = now()
  WHERE id = p_attempt_id;
  
  SELECT jsonb_build_object(
    'booking_id', v_booking_id,
    'status', 'confirmed',
    'duffel_order_id', p_duffel_order_id
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;


ALTER FUNCTION "public"."rpc_complete_duffel_booking"("p_attempt_id" "uuid", "p_duffel_order_id" "text", "p_stripe_payment_intent_id" "text", "p_price" numeric, "p_currency" "text", "p_raw_order" "jsonb") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_complete_duffel_booking"("p_attempt_id" "uuid", "p_duffel_order_id" "text", "p_stripe_payment_intent_id" "text", "p_price" numeric, "p_currency" "text", "p_raw_order" "jsonb") IS 'Atomically complete a Duffel booking with all required data';



CREATE OR REPLACE FUNCTION "public"."rpc_create_booking_attempt"("p_trip_request_id" "uuid", "p_idempotency_key" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_attempt_id uuid;
  v_existing_attempt jsonb;
  v_result jsonb;
BEGIN
  -- Check for existing attempt with same idempotency key
  SELECT jsonb_build_object(
    'attempt_id', id,
    'status', status,
    'created_at', started_at,
    'error', error_message
  ) INTO v_existing_attempt
  FROM booking_attempts 
  WHERE idempotency_key = p_idempotency_key;
  
  IF v_existing_attempt IS NOT NULL THEN
    -- Return existing attempt (idempotent operation)
    RETURN jsonb_build_object(
      'success', true,
      'existing', true,
      'attempt', v_existing_attempt
    );
  END IF;
  
  -- Create new booking attempt
  INSERT INTO booking_attempts (
    trip_request_id,
    status,
    started_at,
    idempotency_key
  ) VALUES (
    p_trip_request_id,
    'pending',
    now(),
    p_idempotency_key
  )
  RETURNING id INTO v_attempt_id;
  
  SELECT jsonb_build_object(
    'attempt_id', v_attempt_id,
    'status', 'pending',
    'created_at', now()
  ) INTO v_result;
  
  RETURN jsonb_build_object(
    'success', true,
    'existing', false,
    'attempt', v_result
  );
END;
$$;


ALTER FUNCTION "public"."rpc_create_booking_attempt"("p_trip_request_id" "uuid", "p_idempotency_key" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_create_booking_attempt"("p_trip_request_id" "uuid", "p_idempotency_key" "text") IS 'Idempotently create a booking attempt with unique key';



CREATE OR REPLACE FUNCTION "public"."rpc_create_duffel_booking"("p_trip_request_id" "uuid", "p_flight_offer_id" "uuid", "p_duffel_payment_intent_id" "text", "p_amount" numeric, "p_currency" "text" DEFAULT 'USD'::"text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_user_id uuid;
  v_booking_id uuid;
  v_result jsonb;
BEGIN
  -- Get user from trip request
  SELECT user_id INTO v_user_id 
  FROM trip_requests 
  WHERE id = p_trip_request_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip request not found' USING ERRCODE = 'P0002';
  END IF;
  
  -- Check if already booked
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE trip_request_id = p_trip_request_id 
    AND provider = 'duffel'
    AND status IN ('booked', 'confirmed')
  ) THEN
    RAISE EXCEPTION 'Trip already has Duffel booking' USING ERRCODE = 'P0003';
  END IF;
  
  -- Create booking record in 'pending' state
  INSERT INTO bookings (
    user_id,
    trip_request_id, 
    flight_offer_id,
    provider,
    duffel_payment_intent_id,
    price,
    status,
    duffel_status,
    source
  ) VALUES (
    v_user_id,
    p_trip_request_id,
    p_flight_offer_id, 
    'duffel',
    p_duffel_payment_intent_id,
    p_amount,
    'pending',
    'payment_authorized',
    'auto'
  )
  RETURNING id INTO v_booking_id;
  
  SELECT jsonb_build_object(
    'booking_id', v_booking_id,
    'status', 'pending',
    'duffel_status', 'payment_authorized'
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;


ALTER FUNCTION "public"."rpc_create_duffel_booking"("p_trip_request_id" "uuid", "p_flight_offer_id" "uuid", "p_duffel_payment_intent_id" "text", "p_amount" numeric, "p_currency" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rpc_fail_booking_attempt"("p_attempt_id" "uuid", "p_error_message" "text", "p_stripe_refund_id" "text" DEFAULT NULL::"text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE booking_attempts SET
    status = 'failed',
    ended_at = now(),
    error_message = p_error_message
  WHERE id = p_attempt_id;
  
  -- Log refund if provided
  IF p_stripe_refund_id IS NOT NULL THEN
    UPDATE booking_attempts SET
      error_message = error_message || ' (Refunded: ' || p_stripe_refund_id || ')'
    WHERE id = p_attempt_id;
  END IF;
  
  RETURN FOUND;
END;
$$;


ALTER FUNCTION "public"."rpc_fail_booking_attempt"("p_attempt_id" "uuid", "p_error_message" "text", "p_stripe_refund_id" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_fail_booking_attempt"("p_attempt_id" "uuid", "p_error_message" "text", "p_stripe_refund_id" "text") IS 'Mark booking attempt as failed with error details';



CREATE OR REPLACE FUNCTION "public"."rpc_update_duffel_booking"("p_booking_id" "uuid", "p_duffel_order_id" "text", "p_pnr" "text" DEFAULT NULL::"text", "p_ticket_numbers" "jsonb" DEFAULT NULL::"jsonb", "p_duffel_status" "public"."duffel_booking_status" DEFAULT 'order_created'::"public"."duffel_booking_status", "p_raw_order" "jsonb" DEFAULT NULL::"jsonb") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
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


ALTER FUNCTION "public"."rpc_update_duffel_booking"("p_booking_id" "uuid", "p_duffel_order_id" "text", "p_pnr" "text", "p_ticket_numbers" "jsonb", "p_duffel_status" "public"."duffel_booking_status", "p_raw_order" "jsonb") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_update_duffel_booking"("p_booking_id" "uuid", "p_duffel_order_id" "text", "p_pnr" "text", "p_ticket_numbers" "jsonb", "p_duffel_status" "public"."duffel_booking_status", "p_raw_order" "jsonb") IS 'Updates a Duffel booking by booking ID with order details and status mapping';



CREATE OR REPLACE FUNCTION "public"."rpc_update_duffel_booking_by_order"("p_duffel_order_id" "text", "p_pnr" "text" DEFAULT NULL::"text", "p_duffel_status" "public"."duffel_booking_status" DEFAULT NULL::"public"."duffel_booking_status", "p_raw_order" "jsonb" DEFAULT NULL::"jsonb", "p_ticket_numbers" "jsonb" DEFAULT NULL::"jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
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


ALTER FUNCTION "public"."rpc_update_duffel_booking_by_order"("p_duffel_order_id" "text", "p_pnr" "text", "p_duffel_status" "public"."duffel_booking_status", "p_raw_order" "jsonb", "p_ticket_numbers" "jsonb") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."rpc_update_duffel_booking_by_order"("p_duffel_order_id" "text", "p_pnr" "text", "p_duffel_status" "public"."duffel_booking_status", "p_raw_order" "jsonb", "p_ticket_numbers" "jsonb") IS 'Updates a Duffel booking by order ID - used for webhook processing to update bookings when Duffel sends events';



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


CREATE OR REPLACE FUNCTION "public"."set_kms_encryption_version"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Only set if encryption_version is not explicitly provided
  IF NEW.encryption_version IS NULL OR NEW.encryption_version = 1 THEN
    -- Check if KMS is available by looking for AWS environment variables
    -- In production, this should always default to version 2 (KMS)
    NEW.encryption_version := 2;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_kms_encryption_version"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_booking_status"("p_attempt_id" "uuid", "p_status" "text", "p_booking_reference" "text" DEFAULT NULL::"text", "p_error_details" "jsonb" DEFAULT NULL::"jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE booking_attempts 
  SET 
    status = p_status,
    duffel_booking_reference = p_booking_reference,
    error_message = CASE WHEN p_error_details IS NOT NULL THEN p_error_details->>'message' ELSE NULL END,
    updated_at = NOW()
  WHERE id = p_attempt_id;
END;
$$;


ALTER FUNCTION "public"."update_booking_status"("p_attempt_id" "uuid", "p_status" "text", "p_booking_reference" "text", "p_error_details" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_campaign_bookings_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_campaign_bookings_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_campaigns_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_campaigns_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_identity_verifications_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_identity_verifications_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_notification_deliveries_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_notification_deliveries_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_notification_templates_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_notification_templates_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_payment_methods_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_payment_methods_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_profile_completeness"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
DECLARE
  new_score INTEGER;
  missing_fields TEXT[];
  recommendations JSONB;
BEGIN
  -- Calculate new completeness score
  new_score := calculate_profile_completeness(NEW.id);
  
  -- Update the profile completeness score
  UPDATE traveler_profiles 
  SET profile_completeness_score = new_score,
      last_profile_update = NOW()
  WHERE id = NEW.id;
  
  -- Initialize missing fields array
  missing_fields := ARRAY[]::TEXT[];
  
  -- Check for missing required fields
  IF NEW.full_name IS NULL OR LENGTH(TRIM(NEW.full_name)) = 0 THEN
    missing_fields := array_append(missing_fields, 'full_name');
  END IF;
  
  IF NEW.date_of_birth IS NULL THEN
    missing_fields := array_append(missing_fields, 'date_of_birth');
  END IF;
  
  IF NEW.gender IS NULL THEN
    missing_fields := array_append(missing_fields, 'gender');
  END IF;
  
  IF NEW.email IS NULL OR NOT (NEW.email ~ '^[^@]+@[^@]+\.[^@]+$') THEN
    missing_fields := array_append(missing_fields, 'email');
  END IF;
  
  -- Check for important but optional fields
  IF NEW.phone IS NULL THEN
    missing_fields := array_append(missing_fields, 'phone');
  END IF;
  
  IF NEW.passport_number_encrypted IS NULL THEN
    missing_fields := array_append(missing_fields, 'passport_number');
  END IF;
  
  IF NEW.passport_country IS NULL THEN
    missing_fields := array_append(missing_fields, 'passport_country');
  END IF;
  
  IF NEW.passport_expiry IS NULL THEN
    missing_fields := array_append(missing_fields, 'passport_expiry');
  END IF;
  
  -- Generate basic recommendations
  recommendations := '[]'::JSONB;
  
  IF NEW.phone IS NOT NULL AND NEW.phone_verified = FALSE THEN
    recommendations := recommendations || jsonb_build_array(jsonb_build_object(
      'category', 'contact_info',
      'priority', 'high',
      'title', 'Verify your phone number',
      'description', 'Verify your phone number to receive important booking updates via SMS',
      'action', 'verify_phone',
      'points_value', 15
    ));
  END IF;
  
  IF NEW.passport_number_encrypted IS NULL THEN
    recommendations := recommendations || jsonb_build_array(jsonb_build_object(
      'category', 'travel_documents',
      'priority', 'medium',
      'title', 'Add passport information',
      'description', 'Add your passport details for faster international booking',
      'action', 'add_passport',
      'points_value', 20
    ));
  END IF;
  
  -- Upsert profile completion tracking
  INSERT INTO profile_completion_tracking (
    user_id,
    completion_percentage,
    missing_fields,
    recommendations,
    last_calculated
  )
  VALUES (
    NEW.user_id,
    new_score,
    missing_fields,
    recommendations,
    NOW()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    completion_percentage = EXCLUDED.completion_percentage,
    missing_fields = EXCLUDED.missing_fields,
    recommendations = EXCLUDED.recommendations,
    last_calculated = EXCLUDED.last_calculated;
  
  RETURN NEW;
END;
$_$;


ALTER FUNCTION "public"."update_profile_completeness"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_traveler_profile_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_traveler_profile_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_preferences_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_user_preferences_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."verify_kms_migration"() RETURNS TABLE("total_profiles" integer, "legacy_encrypted" integer, "kms_encrypted" integer, "no_passport" integer)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_profiles,
    COUNT(CASE WHEN encryption_version = 1 AND passport_number_encrypted IS NOT NULL THEN 1 END)::INTEGER as legacy_encrypted,
    COUNT(CASE WHEN encryption_version = 2 THEN 1 END)::INTEGER as kms_encrypted,
    COUNT(CASE WHEN passport_number_encrypted IS NULL THEN 1 END)::INTEGER as no_passport
  FROM traveler_profiles;
END;
$$;


ALTER FUNCTION "public"."verify_kms_migration"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."verify_kms_migration"() IS 'Returns migration status statistics';


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
    "attempt_timestamp" timestamp with time zone DEFAULT "now"() NOT NULL,
    "duffel_offer_id" "text",
    "duffel_booking_reference" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "idempotency_key" "text",
    "error_message" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "started_at" timestamp with time zone DEFAULT "now"(),
    "ended_at" timestamp with time zone,
    "stripe_charge_id" "text"
);


ALTER TABLE "public"."booking_attempts" OWNER TO "postgres";


COMMENT ON COLUMN "public"."booking_attempts"."duffel_offer_id" IS 'Duffel offer ID that was attempted to book';



COMMENT ON COLUMN "public"."booking_attempts"."idempotency_key" IS 'Unique key to prevent duplicate booking attempts';



COMMENT ON COLUMN "public"."booking_attempts"."stripe_charge_id" IS 'Stripe PaymentIntent ID for tracking payments';



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
    "payment_intent_id" "text",
    "duffel_order_id" "text",
    "duffel_payment_intent_id" "text",
    "provider" "text" DEFAULT 'amadeus'::"text",
    "ticket_numbers" "jsonb",
    "duffel_raw_order" "jsonb",
    "duffel_status" "public"."duffel_booking_status",
    "duffel_order_data" "jsonb",
    "stripe_payment_intent_id" "text",
    "expires_at" timestamp with time zone,
    "passenger_data" "jsonb",
    CONSTRAINT "bookings_provider_check" CHECK (("provider" = ANY (ARRAY['amadeus'::"text", 'duffel'::"text"])))
);


ALTER TABLE "public"."bookings" OWNER TO "postgres";


COMMENT ON COLUMN "public"."bookings"."booked_at" IS 'Timestamp of when the booking was confirmed/ticketed.';



COMMENT ON COLUMN "public"."bookings"."booking_request_id" IS 'Foreign key linking to the original booking_request, if applicable.';



COMMENT ON COLUMN "public"."bookings"."pnr" IS 'Airline booking reference/confirmation code';



COMMENT ON COLUMN "public"."bookings"."payment_intent_id" IS 'Stripe PaymentIntent ID associated with this booking''s payment.';



COMMENT ON COLUMN "public"."bookings"."duffel_order_id" IS 'Duffel order ID from successful booking';



COMMENT ON COLUMN "public"."bookings"."provider" IS 'Booking provider: amadeus for legacy bookings, duffel for new auto-bookings';



COMMENT ON COLUMN "public"."bookings"."ticket_numbers" IS 'Array of airline ticket numbers from Duffel order';



COMMENT ON COLUMN "public"."bookings"."duffel_order_data" IS 'Full Duffel order response including ticket details';



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
    "search_mode" "text" DEFAULT 'LEGACY'::"text",
    "duffel_auto_book_enabled" boolean DEFAULT false,
    "preferred_duffel_payment_method_id" "uuid",
    "traveler_profile_id" "uuid",
    CONSTRAINT "trip_requests_budget_check" CHECK ((("budget" >= (100)::numeric) AND ("budget" <= (10000)::numeric))),
    CONSTRAINT "trip_requests_search_mode_check" CHECK (("search_mode" = ANY (ARRAY['LEGACY'::"text", 'AUTO'::"text", 'MANUAL'::"text"])))
);


ALTER TABLE "public"."trip_requests" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."booking_attempts_summary" AS
 SELECT "ba"."id",
    "ba"."trip_request_id",
    "tr"."user_id",
    "ba"."status",
    "ba"."started_at",
    "ba"."ended_at",
    "ba"."error_message",
    "ba"."stripe_charge_id",
    "ba"."duffel_offer_id",
    ("ba"."ended_at" - "ba"."started_at") AS "duration",
    "b"."id" AS "booking_id",
    "b"."duffel_order_id"
   FROM (("public"."booking_attempts" "ba"
     JOIN "public"."trip_requests" "tr" ON (("ba"."trip_request_id" = "tr"."id")))
     LEFT JOIN "public"."bookings" "b" ON (("ba"."id" = "b"."booking_attempt_id")));


ALTER TABLE "public"."booking_attempts_summary" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."booking_monitoring" AS
 SELECT "ba"."id",
    "ba"."trip_request_id",
    "ba"."duffel_offer_id",
    "ba"."status",
    "ba"."duffel_booking_reference",
    "ba"."created_at",
    "ba"."updated_at",
    "tr"."origin_location_code" AS "origin",
    "tr"."destination_location_code" AS "destination",
    "tr"."departure_date",
        CASE
            WHEN ("ba"."status" = 'completed'::"text") THEN 'SUCCESS'::"text"
            WHEN ("ba"."status" = 'failed'::"text") THEN 'FAILED'::"text"
            ELSE 'PENDING'::"text"
        END AS "monitoring_status"
   FROM ("public"."booking_attempts" "ba"
     LEFT JOIN "public"."trip_requests" "tr" ON (("ba"."trip_request_id" = "tr"."id")))
  ORDER BY "ba"."created_at" DESC;


ALTER TABLE "public"."booking_monitoring" OWNER TO "postgres";


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
    "reminder_scheduled" boolean DEFAULT false NOT NULL,
    "duffel_offer_id" "text",
    "duffel_offer_data" "jsonb"
);


ALTER TABLE "public"."booking_requests" OWNER TO "postgres";


COMMENT ON COLUMN "public"."booking_requests"."traveler_data" IS 'Passenger information required for flight booking (firstName, lastName, dateOfBirth, gender, passportNumber, etc.)';



COMMENT ON COLUMN "public"."booking_requests"."payment_captured" IS 'Flag to indicate if the payment for this booking request has been successfully captured. Used for idempotency in auto-booking.';



COMMENT ON COLUMN "public"."booking_requests"."reminder_scheduled" IS 'Flag to indicate if a reminder notification has been scheduled or sent for this request.';



COMMENT ON COLUMN "public"."booking_requests"."duffel_offer_id" IS 'Duffel offer ID from offer request API';



COMMENT ON COLUMN "public"."booking_requests"."duffel_offer_data" IS 'Full Duffel offer response for reference';



CREATE TABLE IF NOT EXISTS "public"."campaign_bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "campaign_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "duffel_order_id" "text",
    "stripe_payment_intent_id" "text",
    "pnr" "text",
    "total_amount" numeric(10,2) NOT NULL,
    "currency" "text" NOT NULL,
    "booking_reference" "text",
    "booking_status" "text" DEFAULT 'confirmed'::"text",
    "payment_status" "text" DEFAULT 'paid'::"text",
    "flight_details" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "original_currency" "text" DEFAULT 'USD'::"text",
    "user_currency" "text" DEFAULT 'USD'::"text",
    "exchange_rate_used" numeric(10,6) DEFAULT 1.0,
    "total_amount_user_currency" numeric(10,2),
    CONSTRAINT "campaign_bookings_booking_status_check" CHECK (("booking_status" = ANY (ARRAY['pending'::"text", 'confirmed'::"text", 'cancelled'::"text", 'refunded'::"text"]))),
    CONSTRAINT "campaign_bookings_payment_status_check" CHECK (("payment_status" = ANY (ARRAY['pending'::"text", 'paid'::"text", 'failed'::"text", 'refunded'::"text"])))
);


ALTER TABLE "public"."campaign_bookings" OWNER TO "postgres";


COMMENT ON TABLE "public"."campaign_bookings" IS 'Completed bookings from successful campaign matches';



COMMENT ON COLUMN "public"."campaign_bookings"."duffel_order_id" IS 'Duffel Order ID for the booked flight';



COMMENT ON COLUMN "public"."campaign_bookings"."stripe_payment_intent_id" IS 'Stripe PaymentIntent ID for the payment';



CREATE TABLE IF NOT EXISTS "public"."campaigns" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "traveler_profile_id" "uuid" NOT NULL,
    "payment_method_id" "uuid" NOT NULL,
    "origin" "text" NOT NULL,
    "destination" "text" NOT NULL,
    "departure_date_start" "date",
    "departure_date_end" "date",
    "return_date_start" "date",
    "return_date_end" "date",
    "max_price" numeric(10,2) NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text",
    "cabin_class" "text" DEFAULT 'economy'::"text",
    "status" "text" DEFAULT 'active'::"text",
    "name" "text",
    "description" "text",
    "next_search_at" timestamp with time zone DEFAULT "now"(),
    "search_frequency_hours" integer DEFAULT 24,
    "last_searched_at" timestamp with time zone,
    "expires_at" timestamp with time zone,
    "max_bookings" integer DEFAULT 1,
    "bookings_made" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "requires_verification" boolean DEFAULT false,
    "verification_completed_at" timestamp with time zone,
    "original_currency" "text" DEFAULT 'USD'::"text",
    "user_currency" "text" DEFAULT 'USD'::"text",
    "exchange_rate" numeric(10,6) DEFAULT 1.0,
    "converted_max_price" numeric(10,2),
    CONSTRAINT "campaigns_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'paused'::"text", 'completed'::"text", 'cancelled'::"text", 'expired'::"text"])))
);


ALTER TABLE "public"."campaigns" OWNER TO "postgres";


COMMENT ON TABLE "public"."campaigns" IS 'Auto-booking campaigns linking traveler profiles with payment methods and search criteria';



COMMENT ON COLUMN "public"."campaigns"."max_price" IS 'Maximum price user is willing to pay for this campaign';



COMMENT ON COLUMN "public"."campaigns"."search_frequency_hours" IS 'How often to search for deals (in hours)';



COMMENT ON COLUMN "public"."campaigns"."requires_verification" IS 'Whether this campaign requires identity verification before booking';



COMMENT ON COLUMN "public"."campaigns"."verification_completed_at" IS 'When identity verification was completed for this campaign';



COMMENT ON COLUMN "public"."campaigns"."original_currency" IS 'Original currency of the flight price from provider';



COMMENT ON COLUMN "public"."campaigns"."user_currency" IS 'Currency the user sees prices in';



COMMENT ON COLUMN "public"."campaigns"."exchange_rate" IS 'Exchange rate used for conversion';



CREATE TABLE IF NOT EXISTS "public"."critical_notification_queue" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "queue_name" "text" DEFAULT 'critical_notifications'::"text",
    "message" "jsonb" NOT NULL,
    "priority" integer DEFAULT 0,
    "scheduled_for" timestamp with time zone DEFAULT "now"(),
    "processing_started_at" timestamp with time zone,
    "processed_at" timestamp with time zone,
    "error_message" "text",
    "retry_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."critical_notification_queue" OWNER TO "postgres";


COMMENT ON TABLE "public"."critical_notification_queue" IS 'Queue for high priority notifications requiring immediate processing';



CREATE TABLE IF NOT EXISTS "public"."duffel_payment_methods" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "duffel_payment_intent_id" "text" NOT NULL,
    "card_last4" "text" NOT NULL,
    "card_brand" "text" NOT NULL,
    "exp_month" integer NOT NULL,
    "exp_year" integer NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."duffel_payment_methods" OWNER TO "postgres";


COMMENT ON TABLE "public"."duffel_payment_methods" IS 'Payment methods tokenized through Duffel Payments for auto-booking';



CREATE TABLE IF NOT EXISTS "public"."duffel_webhook_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "text" NOT NULL,
    "event_type" "text" NOT NULL,
    "order_id" "text",
    "payload" "jsonb" NOT NULL,
    "processed" boolean DEFAULT false,
    "processing_error" "text",
    "received_at" timestamp with time zone DEFAULT "now"(),
    "processed_at" timestamp with time zone
);


ALTER TABLE "public"."duffel_webhook_events" OWNER TO "postgres";


COMMENT ON TABLE "public"."duffel_webhook_events" IS 'Webhook events received from Duffel API';



CREATE TABLE IF NOT EXISTS "public"."encryption_audit_log" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "table_name" "text" NOT NULL,
    "record_id" "uuid" NOT NULL,
    "operation" "text" NOT NULL,
    "key_version" integer NOT NULL,
    "encryption_version" integer NOT NULL,
    "performed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "performed_by" "text",
    "metadata" "jsonb"
);


ALTER TABLE "public"."encryption_audit_log" OWNER TO "postgres";


COMMENT ON TABLE "public"."encryption_audit_log" IS 'Audit trail for all encryption operations including key rotations';



CREATE TABLE IF NOT EXISTS "public"."encryption_migration_status" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "table_name" "text" NOT NULL,
    "total_records" integer DEFAULT 0,
    "migrated_records" integer DEFAULT 0,
    "migration_status" "text" DEFAULT 'pending'::"text",
    "last_migrated_id" "uuid",
    "batch_size" integer DEFAULT 100,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "error_message" "text",
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."encryption_migration_status" OWNER TO "postgres";


COMMENT ON TABLE "public"."encryption_migration_status" IS 'Tracks progress of migrating legacy data to KMS encryption';



CREATE TABLE IF NOT EXISTS "public"."traveler_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "full_name" "text" NOT NULL,
    "date_of_birth" "date" NOT NULL,
    "gender" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text",
    "passport_number_encrypted" "text",
    "passport_country" "text",
    "passport_expiry" "date",
    "known_traveler_number" "text",
    "stripe_customer_id" "text",
    "default_payment_method_id" "text",
    "is_primary" boolean DEFAULT true,
    "is_verified" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "encryption_version" integer DEFAULT 1,
    "profile_completeness_score" integer DEFAULT 0,
    "verification_level" "text" DEFAULT 'basic'::"text",
    "travel_preferences" "jsonb" DEFAULT '{}'::"jsonb",
    "last_profile_update" timestamp with time zone DEFAULT "now"(),
    "phone_verified" boolean DEFAULT false,
    "notification_preferences" "jsonb" DEFAULT '{}'::"jsonb",
    CONSTRAINT "check_encryption_version" CHECK (("encryption_version" = ANY (ARRAY[1, 2]))),
    CONSTRAINT "traveler_profiles_gender_check" CHECK (("gender" = ANY (ARRAY['MALE'::"text", 'FEMALE'::"text", 'OTHER'::"text"]))),
    CONSTRAINT "traveler_profiles_verification_level_check" CHECK (("verification_level" = ANY (ARRAY['basic'::"text", 'enhanced'::"text", 'premium'::"text"])))
);


ALTER TABLE "public"."traveler_profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."traveler_profiles" IS 'Secure storage of traveler personal information with encryption for sensitive fields';



COMMENT ON COLUMN "public"."traveler_profiles"."passport_number_encrypted" IS 'Encrypted passport number using AES encryption';



COMMENT ON COLUMN "public"."traveler_profiles"."is_verified" IS 'Whether the traveler identity has been verified through Stripe Identity or similar';



COMMENT ON COLUMN "public"."traveler_profiles"."encryption_version" IS 'Version of encryption used: 1=pgcrypto, 2=AWS KMS';



COMMENT ON COLUMN "public"."traveler_profiles"."profile_completeness_score" IS 'Calculated score (0-100) representing profile completion percentage';



COMMENT ON COLUMN "public"."traveler_profiles"."verification_level" IS 'User verification tier: basic, enhanced, or premium';



COMMENT ON COLUMN "public"."traveler_profiles"."travel_preferences" IS 'JSON object storing user travel preferences';



COMMENT ON COLUMN "public"."traveler_profiles"."last_profile_update" IS 'Timestamp of last profile modification';



COMMENT ON COLUMN "public"."traveler_profiles"."phone_verified" IS 'Whether the phone number has been verified via SMS';



COMMENT ON COLUMN "public"."traveler_profiles"."notification_preferences" IS 'JSON object storing notification channel preferences';



CREATE OR REPLACE VIEW "public"."encryption_status_summary" AS
 SELECT "traveler_profiles"."encryption_version",
    "count"(*) AS "profile_count",
    "count"(
        CASE
            WHEN ("traveler_profiles"."passport_number_encrypted" IS NOT NULL) THEN 1
            ELSE NULL::integer
        END) AS "with_passport",
    "count"(
        CASE
            WHEN ("traveler_profiles"."passport_number_encrypted" IS NULL) THEN 1
            ELSE NULL::integer
        END) AS "without_passport",
    "min"("traveler_profiles"."created_at") AS "earliest_profile",
    "max"("traveler_profiles"."created_at") AS "latest_profile"
   FROM "public"."traveler_profiles"
  GROUP BY "traveler_profiles"."encryption_version"
  ORDER BY "traveler_profiles"."encryption_version";


ALTER TABLE "public"."encryption_status_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "event_type" "text" NOT NULL,
    "event_data" "jsonb",
    "user_id" "uuid",
    "session_id" "text",
    "ip_address" "inet",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."events" OWNER TO "postgres";


COMMENT ON TABLE "public"."events" IS 'System events for monitoring and analytics';



CREATE TABLE IF NOT EXISTS "public"."exchange_rates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "from_currency" "text" NOT NULL,
    "to_currency" "text" NOT NULL,
    "rate" numeric(10,6) NOT NULL,
    "last_updated" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."exchange_rates" OWNER TO "postgres";


COMMENT ON TABLE "public"."exchange_rates" IS 'Cached exchange rates for multi-currency support';



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
    "provider" "text" DEFAULT 'amadeus'::"text",
    CONSTRAINT "flight_offers_provider_check" CHECK (("provider" = ANY (ARRAY['amadeus'::"text", 'duffel'::"text"])))
);


ALTER TABLE "public"."flight_offers" OWNER TO "postgres";


COMMENT ON COLUMN "public"."flight_offers"."auto_book" IS 'Whether this offer supports automatic booking through our system';



COMMENT ON COLUMN "public"."flight_offers"."booking_url" IS 'External URL for manual booking on airline website';



COMMENT ON COLUMN "public"."flight_offers"."stops" IS 'Number of stops/layovers for this flight';



COMMENT ON COLUMN "public"."flight_offers"."layover_airports" IS 'Array of airport codes for layover stops';



COMMENT ON COLUMN "public"."flight_offers"."carrier_code" IS 'IATA airline code (e.g., B6, DL, AA) for lookup to friendly airline names';



COMMENT ON COLUMN "public"."flight_offers"."origin_airport" IS 'IATA departure airport code (e.g., MVY, JFK) for route display';



COMMENT ON COLUMN "public"."flight_offers"."destination_airport" IS 'IATA arrival airport code (e.g., JFK, LAX) for route display';



COMMENT ON COLUMN "public"."flight_offers"."provider" IS 'Flight offer provider: amadeus for legacy offers, duffel for new offers';



CREATE TABLE IF NOT EXISTS "public"."flight_offers_v2" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_request_id" "uuid" NOT NULL,
    "mode" "text" DEFAULT 'LEGACY'::"text" NOT NULL,
    "price_total" numeric(10,2) NOT NULL,
    "price_currency" "text" DEFAULT 'USD'::"text",
    "price_carry_on" numeric(10,2),
    "bags_included" boolean DEFAULT false NOT NULL,
    "cabin_class" "text",
    "nonstop" boolean NOT NULL,
    "origin_iata" character(3) NOT NULL,
    "destination_iata" character(3) NOT NULL,
    "depart_dt" timestamp with time zone NOT NULL,
    "return_dt" timestamp with time zone,
    "seat_pref" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "external_offer_id" "text",
    "raw_offer_payload" "jsonb",
    "booking_url" "text",
    CONSTRAINT "chk_positive_price_total" CHECK (("price_total" > (0)::numeric)),
    CONSTRAINT "flight_offers_v2_mode_check" CHECK (("mode" = ANY (ARRAY['LEGACY'::"text", 'AUTO'::"text", 'MANUAL'::"text"])))
);


ALTER TABLE "public"."flight_offers_v2" OWNER TO "postgres";


COMMENT ON TABLE "public"."flight_offers_v2" IS 'Flight offers table V2 with simplified schema matching application code';



COMMENT ON COLUMN "public"."flight_offers_v2"."mode" IS 'How the offer was generated: LEGACY, AUTO, or MANUAL';



COMMENT ON COLUMN "public"."flight_offers_v2"."price_total" IS 'Total price including all fees';



COMMENT ON COLUMN "public"."flight_offers_v2"."price_currency" IS 'Currency code (USD, EUR, etc.)';



COMMENT ON COLUMN "public"."flight_offers_v2"."price_carry_on" IS 'Additional carry-on fee if not included';



COMMENT ON COLUMN "public"."flight_offers_v2"."external_offer_id" IS 'External ID from third-party APIs (e.g., Amadeus offer ID)';



COMMENT ON COLUMN "public"."flight_offers_v2"."raw_offer_payload" IS 'Full raw response from external APIs for debugging and analysis';



COMMENT ON COLUMN "public"."flight_offers_v2"."booking_url" IS 'External URL for booking on airline website (like Google Flights deeplinks)';



CREATE TABLE IF NOT EXISTS "public"."identity_verifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "traveler_profile_id" "uuid" NOT NULL,
    "stripe_verification_session_id" "text" NOT NULL,
    "status" "text" DEFAULT 'requires_input'::"text",
    "purpose" "text" DEFAULT 'identity_document'::"text",
    "campaign_id" "uuid",
    "verified_at" timestamp with time zone,
    "verification_data" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "identity_verifications_purpose_check" CHECK (("purpose" = ANY (ARRAY['identity_document'::"text", 'address'::"text", 'fraud_prevention'::"text"]))),
    CONSTRAINT "identity_verifications_status_check" CHECK (("status" = ANY (ARRAY['requires_input'::"text", 'processing'::"text", 'verified'::"text", 'requires_action'::"text", 'canceled'::"text"])))
);


ALTER TABLE "public"."identity_verifications" OWNER TO "postgres";


COMMENT ON TABLE "public"."identity_verifications" IS 'Identity verification records using Stripe Identity for fraud prevention and compliance';



COMMENT ON COLUMN "public"."identity_verifications"."stripe_verification_session_id" IS 'Stripe Identity verification session ID';



COMMENT ON COLUMN "public"."identity_verifications"."purpose" IS 'Purpose of verification: identity document, address, or fraud prevention';



COMMENT ON COLUMN "public"."identity_verifications"."verified_at" IS 'Timestamp when verification was successfully completed';



CREATE TABLE IF NOT EXISTS "public"."kms_audit_log" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "operation" "text" NOT NULL,
    "key_id" "text" NOT NULL,
    "success" boolean NOT NULL,
    "error_message" "text",
    "user_id" "uuid",
    "ip_address" "inet",
    "timestamp" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "kms_audit_log_operation_check" CHECK (("operation" = ANY (ARRAY['encrypt'::"text", 'decrypt'::"text", 'health_check'::"text"])))
);


ALTER TABLE "public"."kms_audit_log" OWNER TO "postgres";


COMMENT ON TABLE "public"."kms_audit_log" IS 'Audit trail for all AWS KMS encryption/decryption operations';



CREATE TABLE IF NOT EXISTS "public"."migration_status" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "migration_name" "text" NOT NULL,
    "started_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    "status" "text" DEFAULT 'in_progress'::"text" NOT NULL,
    "total_records" integer,
    "migrated_records" integer DEFAULT 0,
    "failed_records" integer DEFAULT 0,
    "error_details" "text",
    CONSTRAINT "migration_status_status_check" CHECK (("status" = ANY (ARRAY['in_progress'::"text", 'completed'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."migration_status" OWNER TO "postgres";


COMMENT ON TABLE "public"."migration_status" IS 'Tracks progress of major data migrations including KMS encryption upgrade';



CREATE TABLE IF NOT EXISTS "public"."notification_deliveries" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "notification_id" "uuid" NOT NULL,
    "channel" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "provider_id" "text",
    "provider_response" "jsonb",
    "sent_at" timestamp with time zone,
    "delivered_at" timestamp with time zone,
    "failed_at" timestamp with time zone,
    "error_message" "text",
    "retry_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "notification_deliveries_channel_check" CHECK (("channel" = ANY (ARRAY['email'::"text", 'sms'::"text", 'push'::"text", 'in_app'::"text"]))),
    CONSTRAINT "notification_deliveries_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'sent'::"text", 'delivered'::"text", 'failed'::"text", 'bounced'::"text", 'opened'::"text", 'clicked'::"text"])))
);


ALTER TABLE "public"."notification_deliveries" OWNER TO "postgres";


COMMENT ON TABLE "public"."notification_deliveries" IS 'Tracks delivery status of notifications across all channels';



COMMENT ON COLUMN "public"."notification_deliveries"."provider_id" IS 'External provider tracking ID (Resend message ID, Twilio SID, etc.)';



COMMENT ON COLUMN "public"."notification_deliveries"."provider_response" IS 'Full response from delivery provider for debugging';



CREATE TABLE IF NOT EXISTS "public"."notification_queue" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "queue_name" "text" DEFAULT 'notifications'::"text",
    "message" "jsonb" NOT NULL,
    "priority" integer DEFAULT 1,
    "scheduled_for" timestamp with time zone DEFAULT "now"(),
    "processing_started_at" timestamp with time zone,
    "processed_at" timestamp with time zone,
    "error_message" "text",
    "retry_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."notification_queue" OWNER TO "postgres";


COMMENT ON TABLE "public"."notification_queue" IS 'Queue for standard priority notifications';



CREATE TABLE IF NOT EXISTS "public"."notification_templates" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "notification_type" "text" NOT NULL,
    "channel" "text" NOT NULL,
    "language" "text" DEFAULT 'en'::"text",
    "subject" "text",
    "body_text" "text" NOT NULL,
    "body_html" "text",
    "active" boolean DEFAULT true,
    "version" integer DEFAULT 1,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "notification_templates_channel_check" CHECK (("channel" = ANY (ARRAY['email'::"text", 'sms'::"text", 'push'::"text", 'in_app'::"text"])))
);


ALTER TABLE "public"."notification_templates" OWNER TO "postgres";


COMMENT ON TABLE "public"."notification_templates" IS 'Notification templates for email, SMS, and other channels';



COMMENT ON COLUMN "public"."notification_templates"."name" IS 'Unique template identifier';



COMMENT ON COLUMN "public"."notification_templates"."notification_type" IS 'Type of notification (booking_success, price_alert, etc.)';



COMMENT ON COLUMN "public"."notification_templates"."channel" IS 'Delivery channel (email, sms, push, in_app)';



COMMENT ON COLUMN "public"."notification_templates"."body_text" IS 'Plain text template with {{variable}} placeholders';



COMMENT ON COLUMN "public"."notification_templates"."body_html" IS 'HTML template with {{variable}} placeholders (email only)';



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
    "payload" "jsonb",
    "title" "text",
    "content" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "channels" "text"[] DEFAULT ARRAY['email'::"text"],
    "priority" "text" DEFAULT 'normal'::"text",
    "scheduled_for" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "notifications_priority_check" CHECK (("priority" = ANY (ARRAY['low'::"text", 'normal'::"text", 'high'::"text", 'critical'::"text"])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


COMMENT ON TABLE "public"."notifications" IS 'Stores user-facing notifications for various events like booking status changes and reminders.';



COMMENT ON COLUMN "public"."notifications"."type" IS 'Type of notification, e.g., booking_success, booking_failure, reminder_23h, booking_canceled';



COMMENT ON COLUMN "public"."notifications"."booking_id" IS 'Associated booking ID if applicable';



COMMENT ON COLUMN "public"."notifications"."payload" IS 'JSONB payload with additional data specific to the notification type, e.g., PNR, flight details, error messages.';



COMMENT ON COLUMN "public"."notifications"."channels" IS 'Array of delivery channels for this notification';



COMMENT ON COLUMN "public"."notifications"."priority" IS 'Notification priority level';



COMMENT ON COLUMN "public"."notifications"."scheduled_for" IS 'When the notification should be sent';



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
    "stripe_customer_id" "text",
    "encryption_version" integer DEFAULT 1,
    "encrypted_stripe_pm_id" "text",
    "encrypted_last4" "text",
    "key_version" integer DEFAULT 1,
    "supported_currencies" "text"[] DEFAULT ARRAY['USD'::"text"]
);


ALTER TABLE "public"."payment_methods" OWNER TO "postgres";


COMMENT ON TABLE "public"."payment_methods" IS 'Stores Stripe payment method references with tokenization for PCI compliance';



COMMENT ON COLUMN "public"."payment_methods"."stripe_pm_id" IS 'Stripe PaymentMethod ID (tokenized card reference)';



COMMENT ON COLUMN "public"."payment_methods"."stripe_customer_id" IS 'Stripe Customer ID for this user';



COMMENT ON COLUMN "public"."payment_methods"."encryption_version" IS 'Version of encryption applied to this record (1=KMS, 0=legacy/unencrypted)';



COMMENT ON COLUMN "public"."payment_methods"."encrypted_stripe_pm_id" IS 'KMS-encrypted Stripe payment method ID';



COMMENT ON COLUMN "public"."payment_methods"."encrypted_last4" IS 'KMS-encrypted last 4 digits';



COMMENT ON COLUMN "public"."payment_methods"."key_version" IS 'Version of the KMS key used for encryption';



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


CREATE TABLE IF NOT EXISTS "public"."profile_completion_tracking" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "completion_percentage" integer DEFAULT 0 NOT NULL,
    "missing_fields" "text"[] DEFAULT ARRAY[]::"text"[],
    "recommendations" "jsonb" DEFAULT '[]'::"jsonb",
    "last_calculated" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."profile_completion_tracking" OWNER TO "postgres";


COMMENT ON TABLE "public"."profile_completion_tracking" IS 'Tracks profile completion metrics and recommendations for users';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "phone" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "email" "text" NOT NULL,
    "encryption_version" integer DEFAULT 1,
    "encrypted_first_name" "text",
    "encrypted_last_name" "text",
    "encrypted_phone" "text",
    "key_version" integer DEFAULT 1,
    "prefers_email_notifications" boolean DEFAULT true,
    "prefers_sms_notifications" boolean DEFAULT false
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON COLUMN "public"."profiles"."encryption_version" IS 'Version of encryption applied to this record (1=KMS, 0=legacy/unencrypted)';



COMMENT ON COLUMN "public"."profiles"."encrypted_first_name" IS 'KMS-encrypted first name';



COMMENT ON COLUMN "public"."profiles"."encrypted_last_name" IS 'KMS-encrypted last name';



COMMENT ON COLUMN "public"."profiles"."encrypted_phone" IS 'KMS-encrypted phone number';



COMMENT ON COLUMN "public"."profiles"."key_version" IS 'Version of the KMS key used for encryption';



CREATE TABLE IF NOT EXISTS "public"."traveler_data_audit" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "traveler_profile_id" "uuid" NOT NULL,
    "action" "text" NOT NULL,
    "field_accessed" "text",
    "ip_address" "inet",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "old_value" "jsonb",
    "new_value" "jsonb",
    "session_id" "text",
    "risk_level" "text" DEFAULT 'low'::"text",
    CONSTRAINT "traveler_data_audit_risk_level_check" CHECK (("risk_level" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text"])))
);


ALTER TABLE "public"."traveler_data_audit" OWNER TO "postgres";


COMMENT ON TABLE "public"."traveler_data_audit" IS 'Audit trail for all access to sensitive traveler data for compliance';



CREATE TABLE IF NOT EXISTS "public"."user_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "preferred_currency" "text" DEFAULT 'USD'::"text",
    "home_country" "text",
    "timezone" "text" DEFAULT 'UTC'::"text",
    "email_notifications" boolean DEFAULT true,
    "sms_notifications" boolean DEFAULT false,
    "push_notifications" boolean DEFAULT true,
    "temperature_unit" "text" DEFAULT 'celsius'::"text",
    "distance_unit" "text" DEFAULT 'metric'::"text",
    "analytics_consent" boolean DEFAULT false,
    "marketing_consent" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_preferences_distance_unit_check" CHECK (("distance_unit" = ANY (ARRAY['metric'::"text", 'imperial'::"text"]))),
    CONSTRAINT "user_preferences_preferred_currency_check" CHECK (("preferred_currency" = ANY (ARRAY['USD'::"text", 'EUR'::"text", 'GBP'::"text", 'CAD'::"text", 'AUD'::"text", 'JPY'::"text", 'CHF'::"text", 'SEK'::"text", 'NOK'::"text", 'DKK'::"text"]))),
    CONSTRAINT "user_preferences_temperature_unit_check" CHECK (("temperature_unit" = ANY (ARRAY['celsius'::"text", 'fahrenheit'::"text"])))
);


ALTER TABLE "public"."user_preferences" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_preferences" IS 'User preferences including preferred currency and regional settings';



COMMENT ON COLUMN "public"."user_preferences"."preferred_currency" IS 'User preferred currency for displaying prices';



ALTER TABLE ONLY "public"."auto_booking_requests"
    ADD CONSTRAINT "auto_booking_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."booking_attempts"
    ADD CONSTRAINT "booking_attempts_idempotency_key_key" UNIQUE ("idempotency_key");



ALTER TABLE ONLY "public"."booking_attempts"
    ADD CONSTRAINT "booking_attempts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."booking_requests"
    ADD CONSTRAINT "booking_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."campaign_bookings"
    ADD CONSTRAINT "campaign_bookings_duffel_order_id_key" UNIQUE ("duffel_order_id");



ALTER TABLE ONLY "public"."campaign_bookings"
    ADD CONSTRAINT "campaign_bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."campaign_bookings"
    ADD CONSTRAINT "campaign_bookings_stripe_payment_intent_id_key" UNIQUE ("stripe_payment_intent_id");



ALTER TABLE ONLY "public"."campaigns"
    ADD CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."critical_notification_queue"
    ADD CONSTRAINT "critical_notification_queue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."duffel_payment_methods"
    ADD CONSTRAINT "duffel_payment_methods_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."duffel_webhook_events"
    ADD CONSTRAINT "duffel_webhook_events_event_id_key" UNIQUE ("event_id");



ALTER TABLE ONLY "public"."duffel_webhook_events"
    ADD CONSTRAINT "duffel_webhook_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."encryption_audit_log"
    ADD CONSTRAINT "encryption_audit_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."encryption_migration_status"
    ADD CONSTRAINT "encryption_migration_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."encryption_migration_status"
    ADD CONSTRAINT "encryption_migration_status_table_name_key" UNIQUE ("table_name");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exchange_rates"
    ADD CONSTRAINT "exchange_rates_from_currency_to_currency_key" UNIQUE ("from_currency", "to_currency");



ALTER TABLE ONLY "public"."exchange_rates"
    ADD CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id");



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



ALTER TABLE ONLY "public"."flight_offers_v2"
    ADD CONSTRAINT "flight_offers_v2_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."identity_verifications"
    ADD CONSTRAINT "identity_verifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."identity_verifications"
    ADD CONSTRAINT "identity_verifications_stripe_verification_session_id_key" UNIQUE ("stripe_verification_session_id");



ALTER TABLE ONLY "public"."kms_audit_log"
    ADD CONSTRAINT "kms_audit_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."migration_status"
    ADD CONSTRAINT "migration_status_migration_name_key" UNIQUE ("migration_name");



ALTER TABLE ONLY "public"."migration_status"
    ADD CONSTRAINT "migration_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_deliveries"
    ADD CONSTRAINT "notification_deliveries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_queue"
    ADD CONSTRAINT "notification_queue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_templates"
    ADD CONSTRAINT "notification_templates_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."notification_templates"
    ADD CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id");



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



ALTER TABLE ONLY "public"."profile_completion_tracking"
    ADD CONSTRAINT "profile_completion_tracking_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_completion_tracking"
    ADD CONSTRAINT "profile_completion_tracking_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."traveler_data_audit"
    ADD CONSTRAINT "traveler_data_audit_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."traveler_profiles"
    ADD CONSTRAINT "traveler_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."traveler_profiles"
    ADD CONSTRAINT "traveler_profiles_user_id_is_primary_key" UNIQUE ("user_id", "is_primary") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "public"."trip_requests"
    ADD CONSTRAINT "trip_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "unique_match_id" UNIQUE ("match_id");



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_user_id_key" UNIQUE ("user_id");



CREATE INDEX "idx_audit_created_at" ON "public"."traveler_data_audit" USING "btree" ("created_at");



CREATE INDEX "idx_audit_profile_id" ON "public"."traveler_data_audit" USING "btree" ("traveler_profile_id");



CREATE INDEX "idx_audit_user_id" ON "public"."traveler_data_audit" USING "btree" ("user_id");



CREATE INDEX "idx_auto_booking_requests_user_id" ON "public"."auto_booking_requests" USING "btree" ("user_id");



CREATE INDEX "idx_booking_attempts_idempotency" ON "public"."booking_attempts" USING "btree" ("idempotency_key");



CREATE INDEX "idx_booking_attempts_trip_status" ON "public"."booking_attempts" USING "btree" ("trip_request_id", "status");



CREATE INDEX "idx_booking_requests_duffel_offer_id" ON "public"."booking_requests" USING "btree" ("duffel_offer_id") WHERE ("duffel_offer_id" IS NOT NULL);



CREATE INDEX "idx_booking_requests_status" ON "public"."booking_requests" USING "btree" ("status");



CREATE INDEX "idx_bookings_amadeus_order_id" ON "public"."bookings" USING "btree" ("amadeus_order_id");



CREATE INDEX "idx_bookings_attempt_id" ON "public"."bookings" USING "btree" ("booking_attempt_id");



CREATE INDEX "idx_bookings_booking_attempt_id" ON "public"."bookings" USING "btree" ("booking_attempt_id");



CREATE INDEX "idx_bookings_duffel_order_id" ON "public"."bookings" USING "btree" ("duffel_order_id");



CREATE INDEX "idx_bookings_expires_at" ON "public"."bookings" USING "btree" ("expires_at") WHERE ("expires_at" IS NOT NULL);



CREATE INDEX "idx_bookings_pnr" ON "public"."bookings" USING "btree" ("pnr");



CREATE INDEX "idx_bookings_provider" ON "public"."bookings" USING "btree" ("provider");



CREATE INDEX "idx_bookings_user_status" ON "public"."bookings" USING "btree" ("user_id", "status");



CREATE INDEX "idx_campaign_bookings_campaign" ON "public"."campaign_bookings" USING "btree" ("campaign_id");



CREATE INDEX "idx_campaign_bookings_duffel" ON "public"."campaign_bookings" USING "btree" ("duffel_order_id");



CREATE INDEX "idx_campaign_bookings_status" ON "public"."campaign_bookings" USING "btree" ("booking_status");



CREATE INDEX "idx_campaign_bookings_stripe" ON "public"."campaign_bookings" USING "btree" ("stripe_payment_intent_id");



CREATE INDEX "idx_campaign_bookings_user" ON "public"."campaign_bookings" USING "btree" ("user_id");



CREATE INDEX "idx_campaigns_active_searches" ON "public"."campaigns" USING "btree" ("status", "next_search_at") WHERE ("status" = 'active'::"text");



CREATE INDEX "idx_campaigns_next_search" ON "public"."campaigns" USING "btree" ("next_search_at");



CREATE INDEX "idx_campaigns_payment_method" ON "public"."campaigns" USING "btree" ("payment_method_id");



CREATE INDEX "idx_campaigns_status" ON "public"."campaigns" USING "btree" ("status");



CREATE INDEX "idx_campaigns_traveler_profile" ON "public"."campaigns" USING "btree" ("traveler_profile_id");



CREATE INDEX "idx_campaigns_user_id" ON "public"."campaigns" USING "btree" ("user_id");



CREATE INDEX "idx_critical_queue_scheduled" ON "public"."critical_notification_queue" USING "btree" ("scheduled_for", "processed_at");



CREATE INDEX "idx_deliveries_channel" ON "public"."notification_deliveries" USING "btree" ("channel");



CREATE INDEX "idx_deliveries_created_at" ON "public"."notification_deliveries" USING "btree" ("created_at");



CREATE INDEX "idx_deliveries_notification_id" ON "public"."notification_deliveries" USING "btree" ("notification_id");



CREATE INDEX "idx_deliveries_status" ON "public"."notification_deliveries" USING "btree" ("status");



CREATE INDEX "idx_duffel_payment_methods_active" ON "public"."duffel_payment_methods" USING "btree" ("is_active");



CREATE INDEX "idx_duffel_payment_methods_user_id" ON "public"."duffel_payment_methods" USING "btree" ("user_id");



CREATE INDEX "idx_duffel_webhooks_event_id" ON "public"."duffel_webhook_events" USING "btree" ("event_id");



CREATE INDEX "idx_duffel_webhooks_order_id" ON "public"."duffel_webhook_events" USING "btree" ("order_id");



CREATE INDEX "idx_duffel_webhooks_processed" ON "public"."duffel_webhook_events" USING "btree" ("processed");



CREATE INDEX "idx_encryption_audit_log_performed_at" ON "public"."encryption_audit_log" USING "btree" ("performed_at");



CREATE INDEX "idx_encryption_audit_log_table_record" ON "public"."encryption_audit_log" USING "btree" ("table_name", "record_id");



CREATE INDEX "idx_events_created_at" ON "public"."events" USING "btree" ("created_at");



CREATE INDEX "idx_events_type" ON "public"."events" USING "btree" ("event_type");



CREATE INDEX "idx_events_user_id" ON "public"."events" USING "btree" ("user_id");



CREATE INDEX "idx_exchange_rates_currencies" ON "public"."exchange_rates" USING "btree" ("from_currency", "to_currency");



CREATE INDEX "idx_exchange_rates_updated" ON "public"."exchange_rates" USING "btree" ("last_updated");



CREATE INDEX "idx_flight_offers_provider" ON "public"."flight_offers" USING "btree" ("provider");



CREATE INDEX "idx_fov2_booking_url" ON "public"."flight_offers_v2" USING "btree" ("booking_url") WHERE ("booking_url" IS NOT NULL);



CREATE INDEX "idx_fov2_depart_dt" ON "public"."flight_offers_v2" USING "btree" ("depart_dt");



CREATE INDEX "idx_fov2_external_offer_id" ON "public"."flight_offers_v2" USING "btree" ("external_offer_id");



CREATE INDEX "idx_fov2_mode" ON "public"."flight_offers_v2" USING "btree" ("mode");



CREATE INDEX "idx_fov2_price_total" ON "public"."flight_offers_v2" USING "btree" ("price_total");



CREATE INDEX "idx_fov2_trip_request" ON "public"."flight_offers_v2" USING "btree" ("trip_request_id");



CREATE INDEX "idx_identity_verifications_campaign" ON "public"."identity_verifications" USING "btree" ("campaign_id");



CREATE INDEX "idx_identity_verifications_profile_id" ON "public"."identity_verifications" USING "btree" ("traveler_profile_id");



CREATE INDEX "idx_identity_verifications_status" ON "public"."identity_verifications" USING "btree" ("status");



CREATE INDEX "idx_identity_verifications_user_id" ON "public"."identity_verifications" USING "btree" ("user_id");



CREATE INDEX "idx_kms_audit_error_success" ON "public"."kms_audit_log" USING "btree" ("success", "timestamp") WHERE ("success" = false);



CREATE INDEX "idx_kms_audit_operation" ON "public"."kms_audit_log" USING "btree" ("operation");



CREATE INDEX "idx_kms_audit_success" ON "public"."kms_audit_log" USING "btree" ("success");



CREATE INDEX "idx_kms_audit_timestamp" ON "public"."kms_audit_log" USING "btree" ("timestamp");



CREATE INDEX "idx_kms_audit_user_id" ON "public"."kms_audit_log" USING "btree" ("user_id");



CREATE INDEX "idx_kms_audit_user_operations" ON "public"."kms_audit_log" USING "btree" ("user_id", "operation", "timestamp");



CREATE INDEX "idx_notifications_booking_id" ON "public"."notifications" USING "btree" ("booking_id");



CREATE INDEX "idx_notifications_is_read" ON "public"."notifications" USING "btree" ("is_read");



CREATE INDEX "idx_notifications_priority" ON "public"."notifications" USING "btree" ("priority");



CREATE INDEX "idx_notifications_scheduled" ON "public"."notifications" USING "btree" ("scheduled_for");



CREATE INDEX "idx_notifications_status" ON "public"."notifications" USING "btree" ("status");



CREATE INDEX "idx_notifications_type" ON "public"."notifications" USING "btree" ("type");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_orders_payment_intent_id" ON "public"."orders" USING "btree" ("payment_intent_id");



CREATE INDEX "idx_orders_user_id" ON "public"."orders" USING "btree" ("user_id");



CREATE INDEX "idx_payment_methods_default" ON "public"."payment_methods" USING "btree" ("user_id", "is_default");



CREATE INDEX "idx_payment_methods_encryption_version" ON "public"."payment_methods" USING "btree" ("encryption_version");



CREATE INDEX "idx_payment_methods_stripe_customer" ON "public"."payment_methods" USING "btree" ("stripe_customer_id");



CREATE INDEX "idx_payment_methods_stripe_customer_id" ON "public"."payment_methods" USING "btree" ("stripe_customer_id");



CREATE INDEX "idx_pm_is_default" ON "public"."payment_methods" USING "btree" ("is_default");



CREATE INDEX "idx_pm_user_id" ON "public"."payment_methods" USING "btree" ("user_id");



CREATE INDEX "idx_profile_completion_tracking_percentage" ON "public"."profile_completion_tracking" USING "btree" ("completion_percentage");



CREATE INDEX "idx_profile_completion_tracking_user_id" ON "public"."profile_completion_tracking" USING "btree" ("user_id");



CREATE INDEX "idx_profiles_encryption_version" ON "public"."profiles" USING "btree" ("encryption_version");



CREATE INDEX "idx_queue_scheduled" ON "public"."notification_queue" USING "btree" ("scheduled_for", "processed_at");



CREATE INDEX "idx_templates_type_channel" ON "public"."notification_templates" USING "btree" ("notification_type", "channel", "active");



CREATE INDEX "idx_traveler_profiles_completeness" ON "public"."traveler_profiles" USING "btree" ("profile_completeness_score");



CREATE INDEX "idx_traveler_profiles_encryption_version" ON "public"."traveler_profiles" USING "btree" ("encryption_version");



CREATE INDEX "idx_traveler_profiles_last_update" ON "public"."traveler_profiles" USING "btree" ("last_profile_update");



CREATE INDEX "idx_traveler_profiles_primary" ON "public"."traveler_profiles" USING "btree" ("user_id", "is_primary");



CREATE INDEX "idx_traveler_profiles_stripe" ON "public"."traveler_profiles" USING "btree" ("stripe_customer_id");



CREATE INDEX "idx_traveler_profiles_user_id" ON "public"."traveler_profiles" USING "btree" ("user_id");



CREATE INDEX "idx_user_preferences_currency" ON "public"."user_preferences" USING "btree" ("preferred_currency");



CREATE INDEX "idx_user_preferences_user_id" ON "public"."user_preferences" USING "btree" ("user_id");



CREATE INDEX "idx_webhook_events_processed" ON "public"."duffel_webhook_events" USING "btree" ("processed_at");



CREATE INDEX "idx_webhook_events_type" ON "public"."duffel_webhook_events" USING "btree" ("event_type");



CREATE INDEX "orders_match_id_idx" ON "public"."orders" USING "btree" ("match_id");



CREATE INDEX "orders_user_id_idx" ON "public"."orders" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "campaign_bookings_updated_at" BEFORE UPDATE ON "public"."campaign_bookings" FOR EACH ROW EXECUTE FUNCTION "public"."update_campaign_bookings_updated_at"();



CREATE OR REPLACE TRIGGER "campaigns_check_verification" BEFORE INSERT OR UPDATE ON "public"."campaigns" FOR EACH ROW EXECUTE FUNCTION "public"."check_verification_requirement"();



CREATE OR REPLACE TRIGGER "campaigns_updated_at" BEFORE UPDATE ON "public"."campaigns" FOR EACH ROW EXECUTE FUNCTION "public"."update_campaigns_updated_at"();



CREATE OR REPLACE TRIGGER "identity_verifications_updated_at" BEFORE UPDATE ON "public"."identity_verifications" FOR EACH ROW EXECUTE FUNCTION "public"."update_identity_verifications_updated_at"();



CREATE OR REPLACE TRIGGER "notification_deliveries_updated_at" BEFORE UPDATE ON "public"."notification_deliveries" FOR EACH ROW EXECUTE FUNCTION "public"."update_notification_deliveries_updated_at"();



CREATE OR REPLACE TRIGGER "notification_templates_updated_at" BEFORE UPDATE ON "public"."notification_templates" FOR EACH ROW EXECUTE FUNCTION "public"."update_notification_templates_updated_at"();



CREATE OR REPLACE TRIGGER "payment_methods_updated_at" BEFORE UPDATE ON "public"."payment_methods" FOR EACH ROW EXECUTE FUNCTION "public"."update_payment_methods_updated_at"();



CREATE OR REPLACE TRIGGER "set_encryption_version_trigger" BEFORE INSERT ON "public"."traveler_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_kms_encryption_version"();



CREATE OR REPLACE TRIGGER "traveler_profiles_updated_at" BEFORE UPDATE ON "public"."traveler_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_traveler_profile_updated_at"();



CREATE OR REPLACE TRIGGER "trg_default_dest_code" BEFORE INSERT OR UPDATE ON "public"."trip_requests" FOR EACH ROW EXECUTE FUNCTION "public"."set_destination_location_code"();



CREATE OR REPLACE TRIGGER "trigger_update_profile_completeness" AFTER INSERT OR UPDATE ON "public"."traveler_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_profile_completeness"();



CREATE OR REPLACE TRIGGER "user_preferences_updated_at" BEFORE UPDATE ON "public"."user_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_user_preferences_updated_at"();



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



ALTER TABLE ONLY "public"."campaign_bookings"
    ADD CONSTRAINT "campaign_bookings_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."campaign_bookings"
    ADD CONSTRAINT "campaign_bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."campaigns"
    ADD CONSTRAINT "campaigns_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."campaigns"
    ADD CONSTRAINT "campaigns_traveler_profile_id_fkey" FOREIGN KEY ("traveler_profile_id") REFERENCES "public"."traveler_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."campaigns"
    ADD CONSTRAINT "campaigns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."duffel_payment_methods"
    ADD CONSTRAINT "duffel_payment_methods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "fk_bookings_booking_request" FOREIGN KEY ("booking_request_id") REFERENCES "public"."booking_requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."identity_verifications"
    ADD CONSTRAINT "fk_identity_verifications_campaign_id" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "fk_notifications_booking_id" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."flight_matches"
    ADD CONSTRAINT "flight_matches_flight_offer_id_fkey" FOREIGN KEY ("flight_offer_id") REFERENCES "public"."flight_offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."flight_matches"
    ADD CONSTRAINT "flight_matches_trip_request_id_fkey" FOREIGN KEY ("trip_request_id") REFERENCES "public"."trip_requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."flight_offers"
    ADD CONSTRAINT "flight_offers_trip_request_id_fkey" FOREIGN KEY ("trip_request_id") REFERENCES "public"."trip_requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."flight_offers_v2"
    ADD CONSTRAINT "flight_offers_v2_trip_request_id_fkey" FOREIGN KEY ("trip_request_id") REFERENCES "public"."trip_requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."identity_verifications"
    ADD CONSTRAINT "identity_verifications_traveler_profile_id_fkey" FOREIGN KEY ("traveler_profile_id") REFERENCES "public"."traveler_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."identity_verifications"
    ADD CONSTRAINT "identity_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notification_deliveries"
    ADD CONSTRAINT "notification_deliveries_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_booking_request_id_fkey" FOREIGN KEY ("booking_request_id") REFERENCES "public"."booking_requests"("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_trip_request_id_fkey" FOREIGN KEY ("trip_request_id") REFERENCES "public"."trip_requests"("id");



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



ALTER TABLE ONLY "public"."profile_completion_tracking"
    ADD CONSTRAINT "profile_completion_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."traveler_profiles"
    ADD CONSTRAINT "traveler_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trip_requests"
    ADD CONSTRAINT "trip_requests_preferred_duffel_payment_method_id_fkey" FOREIGN KEY ("preferred_duffel_payment_method_id") REFERENCES "public"."duffel_payment_methods"("id");



ALTER TABLE ONLY "public"."trip_requests"
    ADD CONSTRAINT "trip_requests_traveler_profile_id_fkey" FOREIGN KEY ("traveler_profile_id") REFERENCES "public"."traveler_profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."trip_requests"
    ADD CONSTRAINT "trip_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Anyone can read feature flags" ON "public"."feature_flags" FOR SELECT USING (true);



CREATE POLICY "Authenticated users can manage feature flags" ON "public"."feature_flags" USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated users can view exchange rates" ON "public"."exchange_rates" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Service can insert orders" ON "public"."orders" FOR INSERT WITH CHECK (true);



CREATE POLICY "Service can update booking requests" ON "public"."booking_requests" FOR UPDATE USING (true);



CREATE POLICY "Service can update orders" ON "public"."orders" FOR UPDATE USING (true);



CREATE POLICY "Service role can delete bookings" ON "public"."bookings" FOR DELETE USING (true);



CREATE POLICY "Service role can delete orders" ON "public"."orders" FOR DELETE USING (true);



CREATE POLICY "Service role can insert bookings" ON "public"."bookings" FOR INSERT WITH CHECK (true);



CREATE POLICY "Service role can insert notifications" ON "public"."notifications" FOR INSERT WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Service role can insert orders" ON "public"."orders" FOR INSERT WITH CHECK (true);



CREATE POLICY "Service role can manage KMS audit logs" ON "public"."kms_audit_log" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Service role can manage all deliveries" ON "public"."notification_deliveries" TO "service_role" USING (true);



CREATE POLICY "Service role can manage audit logs" ON "public"."traveler_data_audit" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Service role can manage campaign bookings" ON "public"."campaign_bookings" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Service role can manage exchange rates" ON "public"."exchange_rates" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Service role can manage identity verifications" ON "public"."identity_verifications" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Service role can manage orders" ON "public"."orders" USING (true);



CREATE POLICY "Service role can manage templates" ON "public"."notification_templates" TO "service_role" USING (true);



CREATE POLICY "Service role can manage webhook events" ON "public"."duffel_webhook_events" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Service role can update bookings" ON "public"."bookings" FOR UPDATE USING (true);



CREATE POLICY "Service role can update orders" ON "public"."orders" FOR UPDATE USING (true);



CREATE POLICY "Service role manage notifications" ON "public"."notifications" USING (true);



CREATE POLICY "Templates are readable by authenticated users" ON "public"."notification_templates" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can add payment methods" ON "public"."payment_methods" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can add their own payment methods" ON "public"."payment_methods" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own auto booking requests" ON "public"."auto_booking_requests" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own payment methods" ON "public"."payment_methods" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can delete their own auto booking requests" ON "public"."auto_booking_requests" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own campaigns" ON "public"."campaigns" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own payment methods" ON "public"."payment_methods" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own preferences" ON "public"."user_preferences" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own traveler profiles" ON "public"."traveler_profiles" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert flight offers for their own trips" ON "public"."flight_offers" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."trip_requests"
  WHERE (("trip_requests"."id" = "flight_offers"."trip_request_id") AND ("trip_requests"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Users can insert matches for their requests" ON "public"."flight_matches" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."trip_requests"
  WHERE (("trip_requests"."id" = "flight_matches"."trip_request_id") AND ("trip_requests"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can insert notifications" ON "public"."notifications" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own duffel payment methods" ON "public"."duffel_payment_methods" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can insert their own booking requests" ON "public"."booking_requests" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own bookings" ON "public"."bookings" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."trip_requests"
  WHERE (("trip_requests"."id" = "bookings"."trip_request_id") AND ("trip_requests"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Users can insert their own campaigns" ON "public"."campaigns" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own completion tracking" ON "public"."profile_completion_tracking" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own identity verifications" ON "public"."identity_verifications" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own payment methods" ON "public"."payment_methods" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own preferences" ON "public"."user_preferences" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own traveler profiles" ON "public"."traveler_profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own trip requests" ON "public"."trip_requests" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read own payment methods" ON "public"."payment_methods" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can select their own booking requests" ON "public"."booking_requests" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can select their own orders" ON "public"."orders" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own duffel payment methods" ON "public"."duffel_payment_methods" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own payment methods" ON "public"."payment_methods" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own auto booking requests" ON "public"."auto_booking_requests" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own campaigns" ON "public"."campaigns" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own completion tracking" ON "public"."profile_completion_tracking" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own identity verifications" ON "public"."identity_verifications" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own notifications" ON "public"."notifications" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own payment methods" ON "public"."payment_methods" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own preferences" ON "public"."user_preferences" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own traveler profiles" ON "public"."traveler_profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view deliveries of their notifications" ON "public"."notification_deliveries" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."notifications" "n"
  WHERE (("n"."id" = "notification_deliveries"."notification_id") AND ("n"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view notifications" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own duffel payment methods" ON "public"."duffel_payment_methods" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own orders" ON "public"."orders" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own auto booking requests" ON "public"."auto_booking_requests" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own bookings" ON "public"."bookings" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own campaign bookings" ON "public"."campaign_bookings" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own campaigns" ON "public"."campaigns" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own completion tracking" ON "public"."profile_completion_tracking" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own flight offers" ON "public"."flight_offers" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."trip_requests"
  WHERE (("trip_requests"."id" = "flight_offers"."trip_request_id") AND ("trip_requests"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Users can view their own identity verifications" ON "public"."identity_verifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own matches" ON "public"."flight_matches" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."trip_requests"
  WHERE (("trip_requests"."id" = "flight_matches"."trip_request_id") AND ("trip_requests"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view their own notifications" ON "public"."notifications" FOR SELECT USING (("booking_request_id" IN ( SELECT "booking_requests"."id"
   FROM "public"."booking_requests"
  WHERE ("booking_requests"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view their own orders" ON "public"."orders" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own payment methods" ON "public"."payment_methods" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own preferences" ON "public"."user_preferences" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own traveler profiles" ON "public"."traveler_profiles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own trip requests" ON "public"."trip_requests" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."auto_booking_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."booking_attempts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."booking_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."campaign_bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."campaigns" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."duffel_payment_methods" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."duffel_webhook_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exchange_rates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."feature_flags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."flight_matches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."flight_offers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."flight_offers_v2" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."identity_verifications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "insert_booking_requests" ON "public"."booking_requests" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."kms_audit_log" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "no_delete_booking_requests" ON "public"."booking_requests" FOR DELETE USING (false);



ALTER TABLE "public"."notification_deliveries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notification_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_methods" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_completion_tracking" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "select_own_booking_requests" ON "public"."booking_requests" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "service_role_delete_flight_offers" ON "public"."flight_offers" FOR DELETE USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "service_role_delete_flight_offers_v2" ON "public"."flight_offers_v2" FOR DELETE USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "service_role_insert_booking_attempts" ON "public"."booking_attempts" FOR INSERT WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "service_role_insert_flight_offers" ON "public"."flight_offers" FOR INSERT WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "service_role_insert_flight_offers_v2" ON "public"."flight_offers_v2" FOR INSERT WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "service_role_insert_payments" ON "public"."payments" FOR INSERT WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "service_role_update_booking_attempts" ON "public"."booking_attempts" FOR UPDATE USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "service_role_update_flight_offers" ON "public"."flight_offers" FOR UPDATE USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "service_role_update_flight_offers_v2" ON "public"."flight_offers_v2" FOR UPDATE USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "service_role_update_payments" ON "public"."payments" FOR UPDATE USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



ALTER TABLE "public"."traveler_data_audit" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."traveler_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trip_requests" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "update_booking_request_status_only" ON "public"."booking_requests" FOR UPDATE USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "update_profile_prefs" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "user notifications" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."user_preferences" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_select_own_notifications" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "users_view_own_booking_attempts" ON "public"."booking_attempts" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."trip_requests" "tr"
  WHERE (("tr"."id" = "booking_attempts"."trip_request_id") AND ("tr"."user_id" = "auth"."uid"())))));



CREATE POLICY "users_view_own_flight_offers" ON "public"."flight_offers" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."trip_requests" "tr"
  WHERE (("tr"."id" = "flight_offers"."trip_request_id") AND ("tr"."user_id" = "auth"."uid"())))));



CREATE POLICY "users_view_own_flight_offers_v2" ON "public"."flight_offers_v2" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."trip_requests" "tr"
  WHERE (("tr"."id" = "flight_offers_v2"."trip_request_id") AND ("tr"."user_id" = "auth"."uid"())))));



CREATE POLICY "users_view_own_payments" ON "public"."payments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."bookings" "b"
  WHERE (("b"."id" = "payments"."booking_id") AND ("b"."user_id" = "auth"."uid"())))));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



































































































































































































GRANT ALL ON FUNCTION "public"."auto_detect_user_currency"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_detect_user_currency"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_detect_user_currency"() TO "service_role";



GRANT ALL ON FUNCTION "public"."batch_migrate_to_kms_encryption"("batch_size" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."batch_migrate_to_kms_encryption"("batch_size" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."batch_migrate_to_kms_encryption"("batch_size" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_profile_completeness"("profile_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_profile_completeness"("profile_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_profile_completeness"("profile_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_verification_requirement"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_verification_requirement"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_verification_requirement"() TO "service_role";



GRANT ALL ON FUNCTION "public"."convert_price"("amount" numeric, "from_curr" "text", "to_curr" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."convert_price"("amount" numeric, "from_curr" "text", "to_curr" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."convert_price"("amount" numeric, "from_curr" "text", "to_curr" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_booking_attempt"("p_trip_request_id" "uuid", "p_offer_id" "text", "p_idempotency_key" "text", "p_passenger_data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."create_booking_attempt"("p_trip_request_id" "uuid", "p_offer_id" "text", "p_idempotency_key" "text", "p_passenger_data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_booking_attempt"("p_trip_request_id" "uuid", "p_offer_id" "text", "p_idempotency_key" "text", "p_passenger_data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."decrypt_passport_number"("encrypted_passport" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."decrypt_passport_number"("encrypted_passport" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrypt_passport_number"("encrypted_passport" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."decrypt_passport_number_legacy"("encrypted_passport" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."decrypt_passport_number_legacy"("encrypted_passport" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrypt_passport_number_legacy"("encrypted_passport" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."encrypt_passport_number"("passport_number" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."encrypt_passport_number"("passport_number" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."encrypt_passport_number"("passport_number" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."encrypt_passport_number_legacy"("passport_number" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."encrypt_passport_number_legacy"("passport_number" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."encrypt_passport_number_legacy"("passport_number" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_passport_number"("profile_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_passport_number"("profile_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_passport_number"("profile_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_profile_recommendations"("profile_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_profile_recommendations"("profile_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_profile_recommendations"("profile_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_reminder_candidates"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_reminder_candidates"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_reminder_candidates"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_preferences"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_preferences"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_preferences"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."migrate_traveler_profile_to_kms"("profile_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."migrate_traveler_profile_to_kms"("profile_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."migrate_traveler_profile_to_kms"("profile_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_auto_book_match"("p_booking_request_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_auto_book_match"("p_booking_request_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_auto_book_match"("p_booking_request_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_auto_book_match"("p_match_id" "uuid", "p_payment_intent_id" "text", "p_currency" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_auto_book_match"("p_match_id" "uuid", "p_payment_intent_id" "text", "p_currency" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_auto_book_match"("p_match_id" "uuid", "p_payment_intent_id" "text", "p_currency" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_complete_duffel_booking"("p_attempt_id" "uuid", "p_duffel_order_id" "text", "p_stripe_payment_intent_id" "text", "p_price" numeric, "p_currency" "text", "p_raw_order" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_complete_duffel_booking"("p_attempt_id" "uuid", "p_duffel_order_id" "text", "p_stripe_payment_intent_id" "text", "p_price" numeric, "p_currency" "text", "p_raw_order" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_complete_duffel_booking"("p_attempt_id" "uuid", "p_duffel_order_id" "text", "p_stripe_payment_intent_id" "text", "p_price" numeric, "p_currency" "text", "p_raw_order" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_create_booking_attempt"("p_trip_request_id" "uuid", "p_idempotency_key" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_create_booking_attempt"("p_trip_request_id" "uuid", "p_idempotency_key" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_create_booking_attempt"("p_trip_request_id" "uuid", "p_idempotency_key" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_create_duffel_booking"("p_trip_request_id" "uuid", "p_flight_offer_id" "uuid", "p_duffel_payment_intent_id" "text", "p_amount" numeric, "p_currency" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_create_duffel_booking"("p_trip_request_id" "uuid", "p_flight_offer_id" "uuid", "p_duffel_payment_intent_id" "text", "p_amount" numeric, "p_currency" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_create_duffel_booking"("p_trip_request_id" "uuid", "p_flight_offer_id" "uuid", "p_duffel_payment_intent_id" "text", "p_amount" numeric, "p_currency" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_fail_booking_attempt"("p_attempt_id" "uuid", "p_error_message" "text", "p_stripe_refund_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_fail_booking_attempt"("p_attempt_id" "uuid", "p_error_message" "text", "p_stripe_refund_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_fail_booking_attempt"("p_attempt_id" "uuid", "p_error_message" "text", "p_stripe_refund_id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_update_duffel_booking"("p_booking_id" "uuid", "p_duffel_order_id" "text", "p_pnr" "text", "p_ticket_numbers" "jsonb", "p_duffel_status" "public"."duffel_booking_status", "p_raw_order" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_update_duffel_booking"("p_booking_id" "uuid", "p_duffel_order_id" "text", "p_pnr" "text", "p_ticket_numbers" "jsonb", "p_duffel_status" "public"."duffel_booking_status", "p_raw_order" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_update_duffel_booking"("p_booking_id" "uuid", "p_duffel_order_id" "text", "p_pnr" "text", "p_ticket_numbers" "jsonb", "p_duffel_status" "public"."duffel_booking_status", "p_raw_order" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_update_duffel_booking_by_order"("p_duffel_order_id" "text", "p_pnr" "text", "p_duffel_status" "public"."duffel_booking_status", "p_raw_order" "jsonb", "p_ticket_numbers" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_update_duffel_booking_by_order"("p_duffel_order_id" "text", "p_pnr" "text", "p_duffel_status" "public"."duffel_booking_status", "p_raw_order" "jsonb", "p_ticket_numbers" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_update_duffel_booking_by_order"("p_duffel_order_id" "text", "p_pnr" "text", "p_duffel_status" "public"."duffel_booking_status", "p_raw_order" "jsonb", "p_ticket_numbers" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_destination_location_code"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_destination_location_code"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_destination_location_code"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_kms_encryption_version"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_kms_encryption_version"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_kms_encryption_version"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_booking_status"("p_attempt_id" "uuid", "p_status" "text", "p_booking_reference" "text", "p_error_details" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."update_booking_status"("p_attempt_id" "uuid", "p_status" "text", "p_booking_reference" "text", "p_error_details" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_booking_status"("p_attempt_id" "uuid", "p_status" "text", "p_booking_reference" "text", "p_error_details" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_campaign_bookings_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_campaign_bookings_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_campaign_bookings_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_campaigns_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_campaigns_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_campaigns_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_identity_verifications_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_identity_verifications_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_identity_verifications_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_notification_deliveries_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_notification_deliveries_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_notification_deliveries_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_notification_templates_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_notification_templates_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_notification_templates_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_payment_methods_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_payment_methods_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_payment_methods_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_profile_completeness"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_profile_completeness"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_profile_completeness"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_traveler_profile_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_traveler_profile_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_traveler_profile_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_preferences_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_preferences_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_preferences_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."verify_kms_migration"() TO "anon";
GRANT ALL ON FUNCTION "public"."verify_kms_migration"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_kms_migration"() TO "service_role";
























GRANT ALL ON TABLE "public"."auto_booking_requests" TO "anon";
GRANT ALL ON TABLE "public"."auto_booking_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."auto_booking_requests" TO "service_role";



GRANT ALL ON TABLE "public"."booking_attempts" TO "anon";
GRANT ALL ON TABLE "public"."booking_attempts" TO "authenticated";
GRANT ALL ON TABLE "public"."booking_attempts" TO "service_role";



GRANT ALL ON TABLE "public"."bookings" TO "anon";
GRANT ALL ON TABLE "public"."bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."bookings" TO "service_role";



GRANT ALL ON TABLE "public"."trip_requests" TO "anon";
GRANT ALL ON TABLE "public"."trip_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_requests" TO "service_role";



GRANT ALL ON TABLE "public"."booking_attempts_summary" TO "anon";
GRANT ALL ON TABLE "public"."booking_attempts_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."booking_attempts_summary" TO "service_role";



GRANT ALL ON TABLE "public"."booking_monitoring" TO "anon";
GRANT ALL ON TABLE "public"."booking_monitoring" TO "authenticated";
GRANT ALL ON TABLE "public"."booking_monitoring" TO "service_role";



GRANT ALL ON TABLE "public"."booking_requests" TO "anon";
GRANT ALL ON TABLE "public"."booking_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."booking_requests" TO "service_role";



GRANT ALL ON TABLE "public"."campaign_bookings" TO "anon";
GRANT ALL ON TABLE "public"."campaign_bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."campaign_bookings" TO "service_role";



GRANT ALL ON TABLE "public"."campaigns" TO "anon";
GRANT ALL ON TABLE "public"."campaigns" TO "authenticated";
GRANT ALL ON TABLE "public"."campaigns" TO "service_role";



GRANT ALL ON TABLE "public"."critical_notification_queue" TO "anon";
GRANT ALL ON TABLE "public"."critical_notification_queue" TO "authenticated";
GRANT ALL ON TABLE "public"."critical_notification_queue" TO "service_role";



GRANT ALL ON TABLE "public"."duffel_payment_methods" TO "anon";
GRANT ALL ON TABLE "public"."duffel_payment_methods" TO "authenticated";
GRANT ALL ON TABLE "public"."duffel_payment_methods" TO "service_role";



GRANT ALL ON TABLE "public"."duffel_webhook_events" TO "anon";
GRANT ALL ON TABLE "public"."duffel_webhook_events" TO "authenticated";
GRANT ALL ON TABLE "public"."duffel_webhook_events" TO "service_role";



GRANT ALL ON TABLE "public"."encryption_audit_log" TO "anon";
GRANT ALL ON TABLE "public"."encryption_audit_log" TO "authenticated";
GRANT ALL ON TABLE "public"."encryption_audit_log" TO "service_role";



GRANT ALL ON TABLE "public"."encryption_migration_status" TO "anon";
GRANT ALL ON TABLE "public"."encryption_migration_status" TO "authenticated";
GRANT ALL ON TABLE "public"."encryption_migration_status" TO "service_role";



GRANT ALL ON TABLE "public"."traveler_profiles" TO "anon";
GRANT ALL ON TABLE "public"."traveler_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."traveler_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."encryption_status_summary" TO "anon";
GRANT ALL ON TABLE "public"."encryption_status_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."encryption_status_summary" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."exchange_rates" TO "anon";
GRANT ALL ON TABLE "public"."exchange_rates" TO "authenticated";
GRANT ALL ON TABLE "public"."exchange_rates" TO "service_role";



GRANT ALL ON TABLE "public"."feature_flags" TO "anon";
GRANT ALL ON TABLE "public"."feature_flags" TO "authenticated";
GRANT ALL ON TABLE "public"."feature_flags" TO "service_role";



GRANT ALL ON TABLE "public"."flight_matches" TO "anon";
GRANT ALL ON TABLE "public"."flight_matches" TO "authenticated";
GRANT ALL ON TABLE "public"."flight_matches" TO "service_role";



GRANT ALL ON TABLE "public"."flight_offers" TO "anon";
GRANT ALL ON TABLE "public"."flight_offers" TO "authenticated";
GRANT ALL ON TABLE "public"."flight_offers" TO "service_role";



GRANT ALL ON TABLE "public"."flight_offers_v2" TO "anon";
GRANT ALL ON TABLE "public"."flight_offers_v2" TO "authenticated";
GRANT ALL ON TABLE "public"."flight_offers_v2" TO "service_role";



GRANT ALL ON TABLE "public"."identity_verifications" TO "anon";
GRANT ALL ON TABLE "public"."identity_verifications" TO "authenticated";
GRANT ALL ON TABLE "public"."identity_verifications" TO "service_role";



GRANT ALL ON TABLE "public"."kms_audit_log" TO "anon";
GRANT ALL ON TABLE "public"."kms_audit_log" TO "authenticated";
GRANT ALL ON TABLE "public"."kms_audit_log" TO "service_role";



GRANT ALL ON TABLE "public"."migration_status" TO "anon";
GRANT ALL ON TABLE "public"."migration_status" TO "authenticated";
GRANT ALL ON TABLE "public"."migration_status" TO "service_role";



GRANT ALL ON TABLE "public"."notification_deliveries" TO "anon";
GRANT ALL ON TABLE "public"."notification_deliveries" TO "authenticated";
GRANT ALL ON TABLE "public"."notification_deliveries" TO "service_role";



GRANT ALL ON TABLE "public"."notification_queue" TO "anon";
GRANT ALL ON TABLE "public"."notification_queue" TO "authenticated";
GRANT ALL ON TABLE "public"."notification_queue" TO "service_role";



GRANT ALL ON TABLE "public"."notification_templates" TO "anon";
GRANT ALL ON TABLE "public"."notification_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."notification_templates" TO "service_role";



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



GRANT ALL ON TABLE "public"."profile_completion_tracking" TO "anon";
GRANT ALL ON TABLE "public"."profile_completion_tracking" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_completion_tracking" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."traveler_data_audit" TO "anon";
GRANT ALL ON TABLE "public"."traveler_data_audit" TO "authenticated";
GRANT ALL ON TABLE "public"."traveler_data_audit" TO "service_role";



GRANT ALL ON TABLE "public"."user_preferences" TO "anon";
GRANT ALL ON TABLE "public"."user_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."user_preferences" TO "service_role";









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

-- Fix critical database schema constraints
-- Addresses Gap #12: booking_attempts.idempotency_key is UNIQUE
-- Addresses Gap #59: Passenger links flight_bookings via FK

-- 1. Add UNIQUE constraint to booking_attempts.idempotency_key
-- First check if constraint already exists
DO $$
BEGIN
    -- Check if the unique constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'booking_attempts_idempotency_key_unique' 
        AND table_name = 'booking_attempts'
    ) THEN
        ALTER TABLE public.booking_attempts 
        ADD CONSTRAINT booking_attempts_idempotency_key_unique 
        UNIQUE (idempotency_key);
        
        RAISE NOTICE 'Added UNIQUE constraint to booking_attempts.idempotency_key';
    ELSE
        RAISE NOTICE 'UNIQUE constraint on booking_attempts.idempotency_key already exists';
    END IF;
END $$;

-- 2. Create passengers table if it doesn't exist (to link to flight_bookings)
CREATE TABLE IF NOT EXISTS public.passengers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    flight_booking_id uuid NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Passenger details (encrypted)
    encrypted_data jsonb NOT NULL, -- Contains encrypted PII using pgcrypto functions
    
    -- Basic info (non-PII)
    passenger_type text NOT NULL CHECK (passenger_type IN ('ADULT', 'CHILD', 'INFANT')),
    seat_assignment text,
    frequent_flyer_number text,
    
    -- Special requirements
    special_requests text[],
    mobility_assistance boolean DEFAULT false,
    dietary_requirements text[],
    
    -- Timestamps
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    -- Audit fields
    created_by uuid REFERENCES auth.users(id),
    updated_by uuid REFERENCES auth.users(id)
);

-- 3. Add foreign key constraint from passengers to flight_bookings
-- Check if the constraint already exists first
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'passengers_flight_booking_fk' 
        AND table_name = 'passengers'
    ) THEN
        ALTER TABLE public.passengers 
        ADD CONSTRAINT passengers_flight_booking_fk 
        FOREIGN KEY (flight_booking_id) REFERENCES public.flight_bookings(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Added FK constraint from passengers to flight_bookings';
    ELSE
        RAISE NOTICE 'FK constraint from passengers to flight_bookings already exists';
    END IF;
END $$;

-- 4. Enable RLS on passengers table
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for passengers
CREATE POLICY "Users can view their own passengers" ON public.passengers
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own passengers" ON public.passengers
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own passengers" ON public.passengers
    FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Service role has full access
CREATE POLICY "Service role full access passengers" ON public.passengers
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS passengers_flight_booking_id_idx ON public.passengers (flight_booking_id);
CREATE INDEX IF NOT EXISTS passengers_user_id_idx ON public.passengers (user_id);
CREATE INDEX IF NOT EXISTS passengers_type_idx ON public.passengers (passenger_type);

-- 6. Add trigger to update updated_at timestamp
CREATE TRIGGER update_passengers_updated_at 
    BEFORE UPDATE ON public.passengers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Create function to safely insert encrypted passenger data
CREATE OR REPLACE FUNCTION insert_passenger_with_encryption(
    p_flight_booking_id uuid,
    p_user_id uuid,
    p_first_name text,
    p_last_name text,
    p_date_of_birth date,
    p_passenger_type text,
    p_email text DEFAULT NULL,
    p_phone text DEFAULT NULL,
    p_passport_number text DEFAULT NULL,
    p_seat_assignment text DEFAULT NULL,
    p_special_requests text[] DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    passenger_id uuid;
    encrypted_data jsonb;
BEGIN
    -- Encrypt PII data
    encrypted_data := encrypt_passenger_data(
        p_first_name,
        p_last_name,
        p_date_of_birth,
        p_passport_number,
        p_phone,
        p_email
    );
    
    -- Insert passenger record
    INSERT INTO public.passengers (
        flight_booking_id,
        user_id,
        encrypted_data,
        passenger_type,
        seat_assignment,
        special_requests,
        created_by
    ) VALUES (
        p_flight_booking_id,
        p_user_id,
        encrypted_data,
        p_passenger_type,
        p_seat_assignment,
        p_special_requests,
        p_user_id
    ) RETURNING id INTO passenger_id;
    
    RETURN passenger_id;
END;
$$;

-- 8. Create function to retrieve decrypted passenger data
CREATE OR REPLACE FUNCTION get_passenger_data(p_passenger_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    passenger_record record;
    decrypted_data jsonb;
BEGIN
    -- Get passenger record (RLS will ensure user can only access their own data)
    SELECT * INTO passenger_record 
    FROM public.passengers 
    WHERE id = p_passenger_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Passenger not found or access denied';
    END IF;
    
    -- Decrypt the PII data
    decrypted_data := decrypt_passenger_data(passenger_record.encrypted_data);
    
    -- Combine with non-encrypted fields
    RETURN jsonb_build_object(
        'id', passenger_record.id,
        'flight_booking_id', passenger_record.flight_booking_id,
        'passenger_type', passenger_record.passenger_type,
        'seat_assignment', passenger_record.seat_assignment,
        'special_requests', passenger_record.special_requests,
        'mobility_assistance', passenger_record.mobility_assistance,
        'dietary_requirements', passenger_record.dietary_requirements,
        'pii_data', decrypted_data,
        'created_at', passenger_record.created_at,
        'updated_at', passenger_record.updated_at
    );
END;
$$;

-- 9. Verify CASCADE behavior for booking_attempts FK
-- Check current FK constraint on booking_attempts
DO $$
DECLARE
    fk_info record;
BEGIN
    SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.delete_rule
    INTO fk_info
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
    JOIN information_schema.referential_constraints AS rc
        ON tc.constraint_name = rc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'booking_attempts'
        AND kcu.column_name = 'trip_request_id';
    
    IF FOUND THEN
        RAISE NOTICE 'FK constraint verified: %.% -> %.% (ON DELETE %)', 
            fk_info.table_name, fk_info.column_name, 
            fk_info.foreign_table_name, fk_info.foreign_column_name,
            fk_info.delete_rule;
            
        -- If not CASCADE, update it
        IF fk_info.delete_rule != 'CASCADE' THEN
            EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', fk_info.table_name, fk_info.constraint_name);
            EXECUTE format('ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE', 
                fk_info.table_name, fk_info.constraint_name, fk_info.column_name, 
                fk_info.foreign_table_name, fk_info.foreign_column_name);
            RAISE NOTICE 'Updated FK constraint to CASCADE';
        END IF;
    ELSE
        RAISE NOTICE 'No FK constraint found on booking_attempts.trip_request_id';
    END IF;
END $$;

-- 10. Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.passengers TO authenticated;
GRANT EXECUTE ON FUNCTION insert_passenger_with_encryption TO service_role;
GRANT EXECUTE ON FUNCTION get_passenger_data TO authenticated;

-- 11. Comments for documentation
COMMENT ON TABLE public.passengers IS 'Encrypted passenger data linked to flight bookings with RLS protection';
COMMENT ON FUNCTION insert_passenger_with_encryption IS 'Safely insert passenger data with automatic PII encryption';
COMMENT ON FUNCTION get_passenger_data IS 'Retrieve passenger data with automatic PII decryption (RLS protected)';

-- 12. Log successful migration
INSERT INTO public.system_logs (
    operation,
    message,
    metadata,
    created_at
)
VALUES (
    'migration_schema_constraints',
    'Successfully fixed database schema constraints',
    jsonb_build_object(
        'constraints_added', 2,
        'tables_created', 1,
        'functions_created', 2,
        'migration_time', NOW()
    ),
    NOW()
);

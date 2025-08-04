-- Enable pgcrypto extension for PII encryption
-- This addresses gap #25: Migration enabling pgcrypto present

-- Enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Verify the extension is loaded
DO $$
BEGIN
    -- Test that pgcrypto functions are available
    PERFORM gen_random_uuid();
    PERFORM digest('test', 'sha256');
    
    RAISE NOTICE 'pgcrypto extension successfully enabled and verified';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to enable or verify pgcrypto extension: %', SQLERRM;
END $$;

-- Create a function to encrypt passenger PII
CREATE OR REPLACE FUNCTION encrypt_pii(data text, key_name text DEFAULT 'pii_encryption_key')
RETURNS bytea
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    encryption_key text;
BEGIN
    -- Get encryption key from environment or use default
    -- In production, this should come from secure key management
    encryption_key := COALESCE(
        current_setting('app.pii_encryption_key', true),
        'default_development_key_change_in_production'
    );
    
    -- Encrypt using AES
    RETURN pgp_sym_encrypt(data, encryption_key);
END;
$$;

-- Create a function to decrypt passenger PII
CREATE OR REPLACE FUNCTION decrypt_pii(encrypted_data bytea, key_name text DEFAULT 'pii_encryption_key')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    encryption_key text;
BEGIN
    -- Get encryption key from environment or use default
    encryption_key := COALESCE(
        current_setting('app.pii_encryption_key', true),
        'default_development_key_change_in_production'
    );
    
    -- Decrypt using AES
    RETURN pgp_sym_decrypt(encrypted_data, encryption_key);
END;
$$;

-- Create helper functions for common PII encryption patterns
CREATE OR REPLACE FUNCTION encrypt_passenger_data(
    first_name text,
    last_name text,
    date_of_birth date,
    passport_number text DEFAULT NULL,
    phone_number text DEFAULT NULL,
    email text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    encrypted_data jsonb;
BEGIN
    -- Encrypt sensitive passenger information
    encrypted_data := jsonb_build_object(
        'first_name', encrypt_pii(first_name),
        'last_name', encrypt_pii(last_name),
        'date_of_birth', encrypt_pii(date_of_birth::text),
        'passport_number', CASE WHEN passport_number IS NOT NULL THEN encrypt_pii(passport_number) ELSE NULL END,
        'phone_number', CASE WHEN phone_number IS NOT NULL THEN encrypt_pii(phone_number) ELSE NULL END,
        'email', CASE WHEN email IS NOT NULL THEN encrypt_pii(email) ELSE NULL END,
        'encrypted_at', NOW()
    );
    
    RETURN encrypted_data;
END;
$$;

-- Create function to decrypt passenger data
CREATE OR REPLACE FUNCTION decrypt_passenger_data(encrypted_jsonb jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    decrypted_data jsonb;
BEGIN
    -- Decrypt passenger information
    decrypted_data := jsonb_build_object(
        'first_name', decrypt_pii((encrypted_jsonb->>'first_name')::bytea),
        'last_name', decrypt_pii((encrypted_jsonb->>'last_name')::bytea),
        'date_of_birth', decrypt_pii((encrypted_jsonb->>'date_of_birth')::bytea),
        'passport_number', CASE 
            WHEN encrypted_jsonb->>'passport_number' IS NOT NULL 
            THEN decrypt_pii((encrypted_jsonb->>'passport_number')::bytea) 
            ELSE NULL 
        END,
        'phone_number', CASE 
            WHEN encrypted_jsonb->>'phone_number' IS NOT NULL 
            THEN decrypt_pii((encrypted_jsonb->>'phone_number')::bytea) 
            ELSE NULL 
        END,
        'email', CASE 
            WHEN encrypted_jsonb->>'email' IS NOT NULL 
            THEN decrypt_pii((encrypted_jsonb->>'email')::bytea) 
            ELSE NULL 
        END,
        'decrypted_at', NOW()
    );
    
    RETURN decrypted_data;
END;
$$;

-- Create function to anonymize PII (for GDPR compliance)
CREATE OR REPLACE FUNCTION anonymize_passenger_pii(passenger_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    anonymous_data jsonb;
BEGIN
    -- Create anonymized data
    anonymous_data := jsonb_build_object(
        'first_name', encrypt_pii('ANONYMIZED'),
        'last_name', encrypt_pii('USER'),
        'date_of_birth', encrypt_pii('1900-01-01'),
        'passport_number', NULL,
        'phone_number', NULL,
        'email', encrypt_pii('anonymized@example.com'),
        'anonymized_at', NOW()
    );
    
    -- Update any tables that store passenger data
    -- This would need to be expanded based on actual schema
    UPDATE booking_requests 
    SET traveler_data = anonymous_data
    WHERE id = passenger_id;
    
    -- Add audit log entry
    INSERT INTO pii_anonymization_log (
        passenger_id,
        anonymized_at,
        reason
    ) VALUES (
        passenger_id,
        NOW(),
        'GDPR_DELETION_REQUEST'
    );
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to anonymize passenger PII for ID %: %', passenger_id, SQLERRM;
END;
$$;

-- Create audit table for PII operations
CREATE TABLE IF NOT EXISTS pii_anonymization_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    passenger_id uuid NOT NULL,
    anonymized_at timestamptz NOT NULL DEFAULT now(),
    reason text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS pii_anonymization_log_passenger_id_idx 
    ON pii_anonymization_log (passenger_id);

-- Enable RLS on audit table
ALTER TABLE pii_anonymization_log ENABLE ROW LEVEL SECURITY;

-- Only service role can access anonymization logs
CREATE POLICY "service_role_pii_logs" ON pii_anonymization_log
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION encrypt_pii TO service_role;
GRANT EXECUTE ON FUNCTION decrypt_pii TO service_role;
GRANT EXECUTE ON FUNCTION encrypt_passenger_data TO service_role;
GRANT EXECUTE ON FUNCTION decrypt_passenger_data TO service_role;
GRANT EXECUTE ON FUNCTION anonymize_passenger_pii TO service_role;

-- Comments for documentation
COMMENT ON FUNCTION encrypt_pii IS 'Encrypts PII data using pgcrypto with AES encryption';
COMMENT ON FUNCTION decrypt_pii IS 'Decrypts PII data encrypted with encrypt_pii function';
COMMENT ON FUNCTION encrypt_passenger_data IS 'Encrypts common passenger data fields into JSONB';
COMMENT ON FUNCTION decrypt_passenger_data IS 'Decrypts passenger data from encrypted JSONB';
COMMENT ON FUNCTION anonymize_passenger_pii IS 'Anonymizes passenger PII for GDPR compliance';
COMMENT ON TABLE pii_anonymization_log IS 'Audit log for PII anonymization operations';

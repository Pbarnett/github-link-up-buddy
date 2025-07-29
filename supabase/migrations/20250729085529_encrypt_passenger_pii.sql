-- Migration: Encrypt Passenger PII Data
-- Tasks #24-25: Add encrypted fields for full_name and date_of_birth

-- Create encrypted passenger data table
CREATE TABLE IF NOT EXISTS public.encrypted_passenger_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trip_request_id UUID REFERENCES public.trip_requests(id) ON DELETE CASCADE,
    
    -- Encrypted PII fields using pgcrypto  
    encrypted_full_name BYTEA NOT NULL,
    encrypted_date_of_birth BYTEA,
    encrypted_passport_number BYTEA,
    encrypted_nationality BYTEA,
    encrypted_phone_number BYTEA,
    encrypted_email BYTEA,
    
    -- Non-sensitive metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Audit fields
    encryption_key_version INTEGER DEFAULT 1,
    encrypted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_encrypted_passenger_data_user_id 
    ON public.encrypted_passenger_data(user_id);
CREATE INDEX IF NOT EXISTS idx_encrypted_passenger_data_trip_request_id 
    ON public.encrypted_passenger_data(trip_request_id);

-- Enable RLS
ALTER TABLE public.encrypted_passenger_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own encrypted data"
    ON public.encrypted_passenger_data FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own encrypted data"
    ON public.encrypted_passenger_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own encrypted data"
    ON public.encrypted_passenger_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to encrypted data"
    ON public.encrypted_passenger_data FOR ALL
    USING (current_setting('role') = 'service_role');

-- Helper functions for encrypting/decrypting PII
CREATE OR REPLACE FUNCTION encrypt_pii_data(
    plaintext TEXT,
    encryption_key TEXT DEFAULT 'default-pii-key-change-in-production'
) RETURNS BYTEA
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT pgp_sym_encrypt(plaintext, encryption_key);
$$;

CREATE OR REPLACE FUNCTION decrypt_pii_data(
    ciphertext BYTEA,
    encryption_key TEXT DEFAULT 'default-pii-key-change-in-production'
) RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT pgp_sym_decrypt(ciphertext, encryption_key);
$$;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.encrypted_passenger_data TO authenticated;
GRANT EXECUTE ON FUNCTION encrypt_pii_data(TEXT, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION decrypt_pii_data(BYTEA, TEXT) TO authenticated, service_role;

-- Comments
COMMENT ON TABLE public.encrypted_passenger_data IS 'Encrypted passenger PII data using pgcrypto';
COMMENT ON FUNCTION encrypt_pii_data(TEXT, TEXT) IS 'Encrypts PII data using pgp_sym_encrypt';
COMMENT ON FUNCTION decrypt_pii_data(BYTEA, TEXT) IS 'Decrypts PII data using pgp_sym_decrypt';

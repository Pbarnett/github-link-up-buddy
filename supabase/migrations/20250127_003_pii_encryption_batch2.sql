-- Migration: PII Encryption Setup (Batch 2 - Requirements #24-25)
-- Description: Enable pgcrypto extension and create encrypted passenger data storage
-- Date: 2025-01-27

-- Enable pgcrypto extension for encryption functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create encrypted passenger profiles table
CREATE TABLE IF NOT EXISTS public.encrypted_passenger_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    booking_id UUID, -- Will reference flight_bookings when created
    
    -- Encrypted PII fields using pgcrypto
    encrypted_first_name BYTEA NOT NULL,
    encrypted_last_name BYTEA NOT NULL,
    encrypted_date_of_birth BYTEA,
    encrypted_passport_number BYTEA,
    encrypted_passport_country BYTEA,
    encrypted_nationality BYTEA,
    encrypted_phone_number BYTEA,
    encrypted_email BYTEA,
    encrypted_emergency_contact BYTEA,
    
    -- Non-sensitive metadata
    profile_type TEXT DEFAULT 'passenger' CHECK (profile_type IN ('passenger', 'emergency_contact')),
    is_primary BOOLEAN DEFAULT false,
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    encrypted_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Retention tracking for GDPR compliance
    retention_expires_at TIMESTAMPTZ, -- Flight date + 90 days for cleanup
    is_anonymized BOOLEAN DEFAULT false
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_encrypted_passenger_profiles_user_id 
    ON public.encrypted_passenger_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_encrypted_passenger_profiles_booking_id 
    ON public.encrypted_passenger_profiles(booking_id);
CREATE INDEX IF NOT EXISTS idx_encrypted_passenger_profiles_retention 
    ON public.encrypted_passenger_profiles(retention_expires_at) 
    WHERE is_anonymized = false;

-- Enable RLS
ALTER TABLE public.encrypted_passenger_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own encrypted profiles"
    ON public.encrypted_passenger_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own encrypted profiles"
    ON public.encrypted_passenger_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own encrypted profiles"
    ON public.encrypted_passenger_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own encrypted profiles"
    ON public.encrypted_passenger_profiles FOR DELETE
    USING (auth.uid() = user_id);

-- Service role can access all for system operations
CREATE POLICY "Service role full access to encrypted profiles"
    ON public.encrypted_passenger_profiles FOR ALL
    USING (current_setting('role') = 'service_role');

-- Create encryption key storage table (encrypted with master key)
CREATE TABLE IF NOT EXISTS public.encryption_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_name TEXT UNIQUE NOT NULL,
    encrypted_key BYTEA NOT NULL, -- The actual encryption key, encrypted with master key
    key_version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Enable RLS on encryption keys (only service role access)
ALTER TABLE public.encryption_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access encryption keys"
    ON public.encryption_keys FOR ALL
    USING (current_setting('role') = 'service_role');

-- Insert default encryption key (this would be managed via secure deployment)
-- Note: In production, this key should be generated and stored securely
INSERT INTO public.encryption_keys (key_name, encrypted_key, key_version)
VALUES (
    'passenger_pii_key_v1',
    pgp_sym_encrypt(
        encode(gen_random_bytes(32), 'base64'),
        coalesce(
            current_setting('app.encryption_master_key', true),
            'default-master-key-change-in-production'
        )
    ),
    1
) ON CONFLICT (key_name) DO NOTHING;

-- Helper functions for encryption/decryption
CREATE OR REPLACE FUNCTION encrypt_pii_field(
    plaintext TEXT,
    key_name TEXT DEFAULT 'passenger_pii_key_v1'
) RETURNS BYTEA
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    encryption_key TEXT;
    master_key TEXT;
BEGIN
    -- Get the master key from settings
    master_key := coalesce(
        current_setting('app.encryption_master_key', true),
        'default-master-key-change-in-production'
    );
    
    -- Retrieve and decrypt the encryption key
    SELECT pgp_sym_decrypt(encrypted_key, master_key)
    INTO encryption_key
    FROM public.encryption_keys
    WHERE key_name = encrypt_pii_field.key_name
        AND is_active = true
    LIMIT 1;
    
    IF encryption_key IS NULL THEN
        RAISE EXCEPTION 'Encryption key not found: %', key_name;
    END IF;
    
    -- Encrypt the plaintext
    RETURN pgp_sym_encrypt_bytea(plaintext::BYTEA, encryption_key);
END;
$$;

CREATE OR REPLACE FUNCTION decrypt_pii_field(
    ciphertext BYTEA,
    key_name TEXT DEFAULT 'passenger_pii_key_v1'
) RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    encryption_key TEXT;
    master_key TEXT;
BEGIN
    -- Get the master key from settings
    master_key := coalesce(
        current_setting('app.encryption_master_key', true),
        'default-master-key-change-in-production'
    );
    
    -- Retrieve and decrypt the encryption key
    SELECT pgp_sym_decrypt(encrypted_key, master_key)
    INTO encryption_key
    FROM public.encryption_keys
    WHERE key_name = decrypt_pii_field.key_name
        AND is_active = true
    LIMIT 1;
    
    IF encryption_key IS NULL THEN
        RAISE EXCEPTION 'Encryption key not found: %', key_name;
    END IF;
    
    -- Decrypt the ciphertext
    RETURN convert_from(pgp_sym_decrypt_bytea(ciphertext, encryption_key), 'UTF8');
END;
$$;

-- Function to set retention expiry based on flight date
CREATE OR REPLACE FUNCTION set_pii_retention_expiry(
    profile_id UUID,
    flight_date DATE
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.encrypted_passenger_profiles
    SET retention_expires_at = flight_date + INTERVAL '90 days'
    WHERE id = profile_id;
END;
$$;

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_encrypted_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_encrypted_profiles_updated_at
    BEFORE UPDATE ON public.encrypted_passenger_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_encrypted_profiles_updated_at();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.encrypted_passenger_profiles TO authenticated;
GRANT SELECT ON public.encryption_keys TO service_role;
GRANT EXECUTE ON FUNCTION encrypt_pii_field(TEXT, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION decrypt_pii_field(BYTEA, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION set_pii_retention_expiry(UUID, DATE) TO service_role;

-- Create audit log for encryption activities
CREATE TABLE IF NOT EXISTS public.pii_encryption_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    profile_id UUID REFERENCES public.encrypted_passenger_profiles(id),
    action TEXT NOT NULL CHECK (action IN ('encrypt', 'decrypt', 'anonymize', 'delete')),
    key_version INTEGER,
    performed_by TEXT, -- 'user', 'system', 'admin'
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pii_encryption_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can access PII audit logs"
    ON public.pii_encryption_audit FOR ALL
    USING (current_setting('role') = 'service_role');

-- Comments for documentation
COMMENT ON TABLE public.encrypted_passenger_profiles IS 'Encrypted storage for passenger PII data using pgcrypto with key rotation support';
COMMENT ON TABLE public.encryption_keys IS 'Encrypted encryption keys storage with version management';
COMMENT ON FUNCTION encrypt_pii_field(TEXT, TEXT) IS 'Encrypts PII field using specified key';
COMMENT ON FUNCTION decrypt_pii_field(BYTEA, TEXT) IS 'Decrypts PII field using specified key';
COMMENT ON COLUMN public.encrypted_passenger_profiles.retention_expires_at IS 'Date after which PII should be anonymized (flight date + 90 days)';

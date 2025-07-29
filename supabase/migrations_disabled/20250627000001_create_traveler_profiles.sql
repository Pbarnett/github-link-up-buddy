-- Create traveler profiles table with encryption and security features
-- This implements the Traveler Data Architecture for secure storage of personal information

-- Enable required extensions for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create traveler profiles table
CREATE TABLE IF NOT EXISTS traveler_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic information (some encrypted)
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
  
  -- Contact information
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Travel document information (encrypted)
  passport_number_encrypted TEXT, -- Encrypted passport number
  passport_country TEXT,
  passport_expiry DATE,
  known_traveler_number TEXT, -- TSA PreCheck, etc.
  
  -- Payment reference (Stripe customer/payment method IDs)
  stripe_customer_id TEXT,
  default_payment_method_id TEXT,
  
  -- Profile metadata
  is_primary BOOLEAN DEFAULT TRUE, -- Primary traveler for this user
  is_verified BOOLEAN DEFAULT FALSE, -- Identity verification status
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one primary profile per user
  UNIQUE(user_id, is_primary) DEFERRABLE INITIALLY DEFERRED
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_traveler_profiles_user_id ON traveler_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_traveler_profiles_primary ON traveler_profiles(user_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_traveler_profiles_stripe ON traveler_profiles(stripe_customer_id);

-- Enable Row Level Security
ALTER TABLE traveler_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own traveler profiles"
  ON traveler_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own traveler profiles"
  ON traveler_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own traveler profiles"
  ON traveler_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own traveler profiles"
  ON traveler_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to encrypt passport numbers
CREATE OR REPLACE FUNCTION encrypt_passport_number(passport_number TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create function to decrypt passport numbers
CREATE OR REPLACE FUNCTION decrypt_passport_number(encrypted_passport TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_traveler_profile_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER traveler_profiles_updated_at
  BEFORE UPDATE ON traveler_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_traveler_profile_updated_at();

-- Note: Campaigns table updates are handled in 20250627000002_create_campaigns_and_payment_methods.sql

-- Update trip_requests to support traveler profiles (for future multi-traveler)
ALTER TABLE trip_requests
  ADD COLUMN IF NOT EXISTS traveler_profile_id UUID REFERENCES traveler_profiles(id) ON DELETE SET NULL;

-- Create audit log table for tracking access to sensitive data
CREATE TABLE IF NOT EXISTS traveler_data_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  traveler_profile_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'created', 'viewed', 'updated', 'deleted', 'encrypted', 'decrypted'
  field_accessed TEXT, -- 'passport_number', 'full_profile', etc.
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON traveler_data_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_profile_id ON traveler_data_audit(traveler_profile_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON traveler_data_audit(created_at);

-- Enable RLS on audit table
ALTER TABLE traveler_data_audit ENABLE ROW LEVEL SECURITY;

-- Only allow service role to read audit logs (for compliance)
CREATE POLICY "Service role can manage audit logs"
  ON traveler_data_audit
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE traveler_profiles TO authenticated;
GRANT ALL ON TABLE traveler_data_audit TO authenticated;
GRANT EXECUTE ON FUNCTION encrypt_passport_number(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION decrypt_passport_number(TEXT) TO authenticated;

-- Insert default traveler profile for existing users if they don't have one
-- This migration helps transition existing users to the new traveler profile system
INSERT INTO traveler_profiles (user_id, full_name, email, date_of_birth, gender, is_primary)
SELECT 
  p.id as user_id,
  COALESCE(p.first_name || ' ' || p.last_name, 'User Profile') as full_name,
  p.email,
  '1990-01-01'::date as date_of_birth, -- Default DOB, users should update
  'OTHER' as gender, -- Default gender, users should update
  true as is_primary
FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM traveler_profiles tp WHERE tp.user_id = p.id
)
AND p.email IS NOT NULL;

-- Add comments for documentation
COMMENT ON TABLE traveler_profiles IS 'Secure storage of traveler personal information with encryption for sensitive fields';
COMMENT ON COLUMN traveler_profiles.passport_number_encrypted IS 'Encrypted passport number using AES encryption';
COMMENT ON COLUMN traveler_profiles.is_verified IS 'Whether the traveler identity has been verified through Stripe Identity or similar';
COMMENT ON TABLE traveler_data_audit IS 'Audit trail for all access to sensitive traveler data for compliance';

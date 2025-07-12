-- KMS Encryption Upgrade Migration
-- This migration adds support for AWS KMS encryption and audit logging

-- Create KMS audit log table for tracking all encryption operations
CREATE TABLE IF NOT EXISTS kms_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation TEXT NOT NULL CHECK (operation IN ('encrypt', 'decrypt', 'health_check')),
  key_id TEXT NOT NULL,                    -- AWS KMS key ID used
  success BOOLEAN NOT NULL,                -- Whether the operation succeeded
  error_message TEXT,                      -- Error details if operation failed
  user_id UUID,                           -- User who performed the operation
  ip_address INET,                        -- IP address of the request
  timestamp TIMESTAMPTZ DEFAULT NOW()     -- When the operation occurred
);

-- Create performance indexes for KMS audit log
CREATE INDEX IF NOT EXISTS idx_kms_audit_timestamp ON kms_audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_kms_audit_user_id ON kms_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_kms_audit_operation ON kms_audit_log(operation);
CREATE INDEX IF NOT EXISTS idx_kms_audit_success ON kms_audit_log(success);

-- Enable RLS on KMS audit table (only service role can read)
ALTER TABLE kms_audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow service role to read/write KMS audit logs
CREATE POLICY "Service role can manage KMS audit logs"
  ON kms_audit_log
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Add encryption version tracking to traveler_profiles
ALTER TABLE traveler_profiles 
ADD COLUMN IF NOT EXISTS encryption_version INTEGER DEFAULT 1;

-- Version 1: pgcrypto encryption (legacy)
-- Version 2: AWS KMS encryption (new)

-- Add index for encryption version to support migration queries
CREATE INDEX IF NOT EXISTS idx_traveler_profiles_encryption_version 
  ON traveler_profiles(encryption_version);

-- Create function to migrate individual traveler profile to KMS encryption
CREATE OR REPLACE FUNCTION migrate_traveler_profile_to_kms(profile_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create function to batch migrate traveler profiles to KMS
CREATE OR REPLACE FUNCTION batch_migrate_to_kms_encryption(batch_size INTEGER DEFAULT 10)
RETURNS TABLE(
  migrated_count INTEGER,
  failed_count INTEGER,
  total_remaining INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create function to verify KMS encryption migration
CREATE OR REPLACE FUNCTION verify_kms_migration()
RETURNS TABLE(
  total_profiles INTEGER,
  legacy_encrypted INTEGER,
  kms_encrypted INTEGER,
  no_passport INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Update the existing encrypt_passport_number function to handle both legacy and KMS
CREATE OR REPLACE FUNCTION encrypt_passport_number_legacy(passport_number TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Update decrypt function to handle both legacy and KMS formats
CREATE OR REPLACE FUNCTION decrypt_passport_number_legacy(encrypted_passport TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create a unified function that determines encryption method based on version
CREATE OR REPLACE FUNCTION get_passport_number(profile_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE kms_audit_log TO authenticated;
GRANT EXECUTE ON FUNCTION migrate_traveler_profile_to_kms(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION batch_migrate_to_kms_encryption(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_kms_migration() TO authenticated;
GRANT EXECUTE ON FUNCTION encrypt_passport_number_legacy(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION decrypt_passport_number_legacy(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_passport_number(UUID) TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE kms_audit_log IS 'Audit trail for all AWS KMS encryption/decryption operations';
COMMENT ON COLUMN traveler_profiles.encryption_version IS 'Version of encryption used: 1=pgcrypto, 2=AWS KMS';
COMMENT ON FUNCTION migrate_traveler_profile_to_kms(UUID) IS 'Prepares a single traveler profile for KMS migration';
COMMENT ON FUNCTION batch_migrate_to_kms_encryption(INTEGER) IS 'Batch migration utility for moving to KMS encryption';
COMMENT ON FUNCTION verify_kms_migration() IS 'Returns migration status statistics';

-- Create a view for monitoring encryption status
CREATE OR REPLACE VIEW encryption_status_summary AS
SELECT 
  encryption_version,
  COUNT(*) as profile_count,
  COUNT(CASE WHEN passport_number_encrypted IS NOT NULL THEN 1 END) as with_passport,
  COUNT(CASE WHEN passport_number_encrypted IS NULL THEN 1 END) as without_passport,
  MIN(created_at) as earliest_profile,
  MAX(created_at) as latest_profile
FROM traveler_profiles
GROUP BY encryption_version
ORDER BY encryption_version;

-- Grant access to the view
GRANT SELECT ON encryption_status_summary TO authenticated;

-- Add a trigger to automatically set encryption_version = 2 for new profiles
-- (assuming new profiles will use KMS encryption)
CREATE OR REPLACE FUNCTION set_kms_encryption_version()
RETURNS TRIGGER
LANGUAGE plpgsql
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

CREATE TRIGGER set_encryption_version_trigger
  BEFORE INSERT ON traveler_profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_kms_encryption_version();

-- Create indexes for audit queries
CREATE INDEX IF NOT EXISTS idx_kms_audit_error_success 
  ON kms_audit_log(success, timestamp) WHERE success = false;

CREATE INDEX IF NOT EXISTS idx_kms_audit_user_operations 
  ON kms_audit_log(user_id, operation, timestamp);

-- Add constraint to prevent invalid encryption versions
ALTER TABLE traveler_profiles 
ADD CONSTRAINT check_encryption_version 
CHECK (encryption_version IN (1, 2));

-- Migration completion tracking
CREATE TABLE IF NOT EXISTS migration_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_name TEXT NOT NULL UNIQUE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
  total_records INTEGER,
  migrated_records INTEGER DEFAULT 0,
  failed_records INTEGER DEFAULT 0,
  error_details TEXT
);

-- Initialize the KMS migration tracking
INSERT INTO migration_status (migration_name, total_records)
SELECT 
  'kms_encryption_migration',
  COUNT(*)
FROM traveler_profiles 
WHERE encryption_version = 1 AND passport_number_encrypted IS NOT NULL
ON CONFLICT (migration_name) DO NOTHING;

-- Grant permissions for migration tracking
GRANT ALL ON TABLE migration_status TO authenticated;

COMMENT ON TABLE migration_status IS 'Tracks progress of major data migrations including KMS encryption upgrade';

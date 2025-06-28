-- Create identity verification table for Stripe Identity integration
-- This supports Phase 2 compliance and fraud prevention features

CREATE TABLE IF NOT EXISTS identity_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  traveler_profile_id UUID NOT NULL REFERENCES traveler_profiles(id) ON DELETE CASCADE,
  
  -- Stripe Identity integration
  stripe_verification_session_id TEXT UNIQUE NOT NULL,
  
  -- Verification details
  status TEXT DEFAULT 'requires_input' CHECK (status IN (
    'requires_input', 'processing', 'verified', 'requires_action', 'canceled'
  )),
  purpose TEXT DEFAULT 'identity_document' CHECK (purpose IN (
    'identity_document', 'address', 'fraud_prevention'
  )),
  
  -- Optional campaign reference (if verification is for a specific booking)
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  
  -- Verification metadata
  verified_at TIMESTAMPTZ,
  verification_data JSONB, -- Store relevant verification outputs from Stripe
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_identity_verifications_user_id ON identity_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_identity_verifications_profile_id ON identity_verifications(traveler_profile_id);
CREATE INDEX IF NOT EXISTS idx_identity_verifications_status ON identity_verifications(status);
CREATE INDEX IF NOT EXISTS idx_identity_verifications_campaign ON identity_verifications(campaign_id);

-- Enable Row Level Security
ALTER TABLE identity_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for identity verifications
CREATE POLICY "Users can view their own identity verifications"
  ON identity_verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own identity verifications"
  ON identity_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own identity verifications"
  ON identity_verifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can manage all verifications for processing
CREATE POLICY "Service role can manage identity verifications"
  ON identity_verifications FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create trigger function for updated_at timestamp
CREATE OR REPLACE FUNCTION update_identity_verifications_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for updated_at timestamp
CREATE TRIGGER identity_verifications_updated_at
  BEFORE UPDATE ON identity_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_identity_verifications_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE identity_verifications TO authenticated;

-- Add verification requirement rules to campaigns
ALTER TABLE campaigns 
  ADD COLUMN IF NOT EXISTS requires_verification BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verification_completed_at TIMESTAMPTZ;

-- Add verification status to traveler profiles (already exists but ensure it's there)
-- This was added in the previous migration but let's make sure
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'traveler_profiles' AND column_name = 'is_verified') THEN
        ALTER TABLE traveler_profiles ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Create function to automatically mark campaigns as requiring verification for high-value bookings
CREATE OR REPLACE FUNCTION check_verification_requirement()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
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
$$;

-- Create trigger to auto-check verification requirements
CREATE TRIGGER campaigns_check_verification
  BEFORE INSERT OR UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION check_verification_requirement();

-- Add comments for documentation
COMMENT ON TABLE identity_verifications IS 'Identity verification records using Stripe Identity for fraud prevention and compliance';
COMMENT ON COLUMN identity_verifications.stripe_verification_session_id IS 'Stripe Identity verification session ID';
COMMENT ON COLUMN identity_verifications.purpose IS 'Purpose of verification: identity document, address, or fraud prevention';
COMMENT ON COLUMN identity_verifications.verified_at IS 'Timestamp when verification was successfully completed';
COMMENT ON COLUMN campaigns.requires_verification IS 'Whether this campaign requires identity verification before booking';
COMMENT ON COLUMN campaigns.verification_completed_at IS 'When identity verification was completed for this campaign';

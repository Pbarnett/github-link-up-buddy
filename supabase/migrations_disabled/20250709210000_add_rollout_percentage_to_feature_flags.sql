-- Add rollout percentage column to feature_flags table
-- This enables canary releases with deterministic user bucketing

ALTER TABLE feature_flags ADD COLUMN IF NOT EXISTS rollout_percentage INT DEFAULT 100;

-- Add constraint to ensure rollout percentage is between 0 and 100
ALTER TABLE feature_flags ADD CONSTRAINT rollout_percentage_range 
    CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_feature_flags_name_enabled 
    ON feature_flags (name) WHERE enabled = true;

-- Update existing feature flags to have explicit rollout percentages
UPDATE feature_flags 
SET rollout_percentage = 100 
WHERE rollout_percentage IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN feature_flags.rollout_percentage IS 'Percentage of users who should see this feature (0-100). Uses deterministic hashing for consistent user bucketing.';

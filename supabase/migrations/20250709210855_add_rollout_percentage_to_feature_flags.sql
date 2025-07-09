-- Add rollout_percentage column to feature_flags table for canary deployments
ALTER TABLE feature_flags ADD COLUMN rollout_percentage INT DEFAULT 100;

-- Add check constraint to ensure rollout_percentage is between 0 and 100
ALTER TABLE feature_flags ADD CONSTRAINT rollout_percentage_valid CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100);

-- Create index for efficient queries on rollout_percentage
CREATE INDEX IF NOT EXISTS idx_feature_flags_rollout ON feature_flags(rollout_percentage) WHERE enabled = true;

-- Update existing feature flags to have 100% rollout by default
UPDATE feature_flags SET rollout_percentage = 100 WHERE rollout_percentage IS NULL;

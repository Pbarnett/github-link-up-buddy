-- Add rollout_percentage column to feature_flags table for canary deployments
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feature_flags' AND column_name = 'rollout_percentage') THEN
    ALTER TABLE feature_flags ADD COLUMN rollout_percentage INT DEFAULT 100;
  END IF;
END $$;

-- Add check constraint to ensure rollout_percentage is between 0 and 100
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'rollout_percentage_valid') THEN
    ALTER TABLE feature_flags ADD CONSTRAINT rollout_percentage_valid CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100);
  END IF;
END $$;

-- Create index for efficient queries on rollout_percentage
CREATE INDEX IF NOT EXISTS idx_feature_flags_rollout ON feature_flags(rollout_percentage) WHERE enabled = true;

-- Update existing feature flags to have 100% rollout by default
UPDATE feature_flags SET rollout_percentage = 100 WHERE rollout_percentage IS NULL;

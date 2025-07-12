-- Seed the profile_ui_revamp feature flag for testing
-- This sets up the initial 5% rollout for the feature flag

INSERT INTO feature_flags (name, enabled, rollout_percentage)
VALUES ('profile_ui_revamp', TRUE, 5)
ON CONFLICT (name) DO UPDATE
SET 
    enabled = EXCLUDED.enabled,
    rollout_percentage = EXCLUDED.rollout_percentage,
    updated_at = NOW();

-- Add comment for documentation
COMMENT ON TABLE feature_flags IS 'Feature flags for controlling rollout of new features with deterministic user bucketing';

-- Verify the flag was created
SELECT name, enabled, rollout_percentage FROM feature_flags WHERE name = 'profile_ui_revamp';

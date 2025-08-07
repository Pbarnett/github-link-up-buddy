-- Seed initial feature flag for profile UI revamp
-- This confirms that the rollout_percentage column exists and works

INSERT INTO feature_flags (name, enabled, rollout_percentage, description)
VALUES (
    'profile_ui_revamp', 
    true, 
    5,
    'Profile UI revamp feature flag for canary testing'
)
ON CONFLICT (name) DO UPDATE SET
    enabled = EXCLUDED.enabled,
    rollout_percentage = EXCLUDED.rollout_percentage,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Verify the insertion worked
SELECT name, enabled, rollout_percentage, description, created_at, updated_at
FROM feature_flags 
WHERE name = 'profile_ui_revamp';

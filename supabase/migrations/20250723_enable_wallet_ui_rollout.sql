-- Enable wallet_ui feature flag with 5% rollout to match profile_ui_revamp
-- This allows wallet functionality to be gradually rolled out to users

-- Update wallet_ui feature flag to enabled with 5% rollout
UPDATE feature_flags 
SET 
  enabled = true, 
  rollout_percentage = 5
WHERE name = 'wallet_ui';

-- If wallet_ui doesn't exist, create it
INSERT INTO feature_flags (name, enabled, rollout_percentage, description)
SELECT 'wallet_ui', true, 5, 'Enables wallet UI features for payment method management'
WHERE NOT EXISTS (SELECT 1 FROM feature_flags WHERE name = 'wallet_ui');

-- Ensure profile_ui_revamp is at 5% rollout for coordinated rollout
UPDATE feature_flags 
SET rollout_percentage = 5
WHERE name = 'profile_ui_revamp' AND rollout_percentage < 5;

-- Add comment for rollout tracking
COMMENT ON TABLE feature_flags IS 'Feature flags with gradual rollout support. wallet_ui coordinated with profile_ui_revamp rollout.';

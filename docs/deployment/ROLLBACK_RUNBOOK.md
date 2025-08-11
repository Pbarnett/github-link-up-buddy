# Rollback Runbook — Auto Booking

Purpose
- Provide one-command rollback to the last known-good baseline for the auto-booking workflow.

Prerequisites
- AWS CLI configured or aws-vault profile ready
- Deployed stacks created by infra/cdk
- Baseline git tag exists: baseline-phase1

Environments
- Stage is passed via CDK context (defaults to dev). Example uses dev in us-east-1.

One‑command rollback (State Machine alias-free)
- Because the State Machine name is deterministic (AutoBookingStack-auto-booking) and we deploy changes in-place, the safest rollback is to re-deploy the baseline commit.

Steps
1) Checkout baseline and deploy

Option A: Using aws-vault
PROFILE={{YOUR_PROFILE}}
REGION=us-east-1

aws-vault exec $PROFILE -- bash -lc '
  set -euo pipefail
  git fetch --all --tags
  git checkout baseline-phase1
  cd infra/cdk
  npm ci
  npm run build
  npx cdk deploy -c stage=dev --require-approval never --no-color
'

Option B: Using AWS_PROFILE
export AWS_PROFILE={{YOUR_PROFILE}}
export AWS_REGION=us-east-1

git fetch --all --tags
git checkout baseline-phase1
cd infra/cdk
npm ci
npm run build
npx cdk deploy -c stage=dev --require-approval never --no-color

Validation
- Confirm in CloudWatch Step Functions that executions for the test path succeed again.
- Validate WebhookUrl output still responds 200 for a test confirmation.

Abort/stop stuck executions
- You can stop a specific execution by ARN:
aws --profile $PROFILE --region $REGION stepfunctions stop-execution \
  --execution-arn arn:aws:states:us-east-1:{{ACCOUNT_ID}}:execution:AutoBookingStack-auto-booking:{{EXEC_NAME}} \
  --error ManualRollback --cause "Operator rollback"

Notes
- For long-term safety, consider Phase 7 alias versioning to allow instantaneous alias pointer rollback without redeploy.
- Keep future baseline tags (baseline-phase2, baseline-phase3, etc.) after each verified milestone.

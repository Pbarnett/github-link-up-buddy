#!/usr/bin/env bash
set -euo pipefail

# Auto-booking deploy and test helper
# Usage:
#   PROFILE=parker_flight_dev REGION=us-east-1 scripts/deployment/auto-booking-deploy-test.sh
# or
#   scripts/deployment/auto-booking-deploy-test.sh parker_flight_dev us-east-1

PROFILE="${PROFILE:-${1:-}}"
REGION="${REGION:-${2:-}}"
STACK_NAME="AutoBookingStack"
DASHBOARD_NAME="auto-booking-dashboard"

if [[ -z "${PROFILE}" || -z "${REGION}" ]]; then
  echo "ERROR: PROFILE and REGION are required."
  echo "Example: PROFILE=parker_flight_dev REGION=us-east-1 $0"
  exit 2
fi

if ! command -v aws-vault >/dev/null 2>&1; then
  echo "ERROR: aws-vault not found in PATH. Install it first."
  exit 2
fi

# Get account ID for bootstrap
ACCOUNT_ID=$(aws-vault exec "${PROFILE}" -- aws sts get-caller-identity --query Account --output text --region "${REGION}")
echo "Using account: ${ACCOUNT_ID}, region: ${REGION}, profile: ${PROFILE}"

# One-time bootstrap (safe to run if already bootstrapped)
echo "Bootstrapping CDK (safe if already done)..."
aws-vault exec "${PROFILE}" -- cdk bootstrap "aws://${ACCOUNT_ID}/${REGION}" || true

# Deploy the CDK stack
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
cd "${REPO_ROOT}/infra/cdk"

echo "Installing dependencies..."
aws-vault exec "${PROFILE}" -- npm install

echo "Building CDK app..."
aws-vault exec "${PROFILE}" -- npm run build

echo "Deploying stack ${STACK_NAME}..."
aws-vault exec "${PROFILE}" -- npm run deploy

echo "Fetching stack outputs..."
OUTPUTS=$(aws-vault exec "${PROFILE}" -- aws cloudformation describe-stacks --stack-name "${STACK_NAME}" --query "Stacks[0].Outputs" --output json --region "${REGION}")
STATE_MACHINE_ARN=$(echo "${OUTPUTS}" | node -e "let i='';process.stdin.on('data',d=>i+=d).on('end',()=>{const o=JSON.parse(i);const sm=o.find(x=>x.OutputKey==='StateMachineArn');console.log(sm?sm.OutputValue:'')})")
WEBHOOK_FN=$(echo "${OUTPUTS}" | node -e "let i='';process.stdin.on('data',d=>i+=d).on('end',()=>{const o=JSON.parse(i);const f=o.find(x=>x.OutputKey==='ProviderWebhookCompleteArn');console.log(f?f.OutputValue.split(':function:')[1]:'provider-webhook-complete')})")

if [[ -z "${STATE_MACHINE_ARN}" ]]; then
  echo "ERROR: Could not find StateMachineArn in stack outputs."
  echo "Outputs: ${OUTPUTS}"
  exit 1
fi

echo "StateMachineArn: ${STATE_MACHINE_ARN}"
echo "Webhook function name: ${WEBHOOK_FN}"

cd "${REPO_ROOT}"

# Create test input file
INPUT_FILE="/tmp/auto-booking-input-$$.json"
cat > "${INPUT_FILE}" << 'EOF'
{
  "tripId": "test-trip-123",
  "attempt": 1,
  "paymentIntentId": "pi_test_123",
  "searchParams": { "origin": "LAX", "destination": "JFK", "date": "2025-09-01", "maxPrice": 500 },
  "traveler": { "firstName": "John", "lastName": "Doe", "email": "john@example.com", "dateOfBirth": "1990-01-01" }
}
EOF

# Start execution with a unique name (used as correlationId)
EXEC_NAME="test-$(date +%s)"
echo "Starting execution: ${EXEC_NAME}"
START_OUT=$(aws-vault exec "${PROFILE}" -- aws stepfunctions start-execution \
  --state-machine-arn "${STATE_MACHINE_ARN}" \
  --name "${EXEC_NAME}" \
  --input file://"${INPUT_FILE}" \
  --region "${REGION}" 2>&1 || true)

echo "Start-execution output: ${START_OUT}"
EXEC_ARN=$(echo "${START_OUT}" | node -e "let i='';process.stdin.on('data',d=>i+=d).on('end',()=>{try{const o=JSON.parse(i);console.log(o.executionArn||'')}catch{console.log('')}})")
if [[ -z "${EXEC_ARN}" ]]; then
  echo "WARN: Could not parse executionArn; will try to look it up."
  EXEC_ARN=$(aws-vault exec "${PROFILE}" -- aws stepfunctions list-executions \
    --state-machine-arn "${STATE_MACHINE_ARN}" --status-filter RUNNING \
    --query "executions[?name=='${EXEC_NAME}'].executionArn | [0]" --output text --region "${REGION}" || true)
fi

if [[ -z "${EXEC_ARN}" || "${EXEC_ARN}" == "None" ]]; then
  echo "ERROR: Execution ARN not found."
  exit 1
fi

echo "Execution ARN: ${EXEC_ARN}"

# Simulate provider webhook confirmation
echo "Invoking webhook to confirm booking..."
aws-vault exec "${PROFILE}" -- aws lambda invoke \
  --function-name "${WEBHOOK_FN}" \
  --payload "{\"correlationId\":\"${EXEC_NAME}\",\"status\":\"confirmed\"}" \
  /dev/stdout --region "${REGION}" >/dev/null

echo "Polling execution status..."
ATTEMPTS=40
SLEEP=3
STATUS="RUNNING"
while (( ATTEMPTS > 0 )); do
  STATUS=$(aws-vault exec "${PROFILE}" -- aws stepfunctions describe-execution \
    --execution-arn "${EXEC_ARN}" --query status --output text --region "${REGION}")
  echo "Status: ${STATUS}"
  if [[ "${STATUS}" != "RUNNING" ]]; then
    break
  fi
  sleep "${SLEEP}"
  ATTEMPTS=$((ATTEMPTS-1))
done

echo "Final status: ${STATUS}"
if [[ "${STATUS}" != "SUCCEEDED" ]]; then
  echo "Fetching recent history (compact)..."
  aws-vault exec "${PROFILE}" -- aws stepfunctions get-execution-history \
    --execution-arn "${EXEC_ARN}" --max-items 50 --region "${REGION}" \
    --query "events[].{id:id,type:type,name:taskScheduledEventDetails.resource,err:taskFailedEventDetails.error,cause:taskFailedEventDetails.cause}"
  exit 1
fi

echo "Success! Open the dashboard 'auto-booking-dashboard' in CloudWatch to view metrics."


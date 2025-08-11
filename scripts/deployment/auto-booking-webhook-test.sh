#!/usr/bin/env bash
set -euo pipefail

# Auto-booking webhook tester
# Usage:
#   PROFILE=parker_flight_dev REGION=us-east-1 EXEC_NAME=test-123 scripts/deployment/auto-booking-webhook-test.sh
# or
#   scripts/deployment/auto-booking-webhook-test.sh parker_flight_dev us-east-1 test-123

PROFILE="${PROFILE:-${1:-}}"
REGION="${REGION:-${2:-}}"
EXEC_NAME="${EXEC_NAME:-${3:-}}"
STACK_NAME="AutoBookingStack"

if [[ -z "${PROFILE}" || -z "${REGION}" || -z "${EXEC_NAME}" ]]; then
  echo "ERROR: PROFILE, REGION, and EXEC_NAME are required."
  echo "Example: PROFILE=parker_flight_dev REGION=us-east-1 EXEC_NAME=test-123 $0"
  exit 2
fi

# Fetch stack outputs for WebhookUrl
OUTPUTS=$(aws-vault exec "${PROFILE}" -- aws cloudformation describe-stacks \
  --stack-name "${STACK_NAME}" --query "Stacks[0].Outputs" --output json --region "${REGION}")
WEBHOOK_URL=$(echo "${OUTPUTS}" | node -e "let i='';process.stdin.on('data',d=\u003ei+=d).on('end',()=>{const o=JSON.parse(i);const u=o.find(x=>x.OutputKey==='WebhookUrl');console.log(u?u.OutputValue:'')})")
if [[ -z "${WEBHOOK_URL}" ]]; then
  echo "ERROR: WebhookUrl not found in outputs."
  echo "Outputs: ${OUTPUTS}"
  exit 1
fi

echo "Webhook URL: ${WEBHOOK_URL}"

# Fetch secret from SSM
SECRET=$(aws-vault exec "${PROFILE}" -- aws ssm get-parameter \
  --name /auto-booking/webhook-secret --with-decryption \
  --query 'Parameter.Value' --output text --region "${REGION}")
if [[ -z "${SECRET}" ]]; then
  echo "ERROR: Could not retrieve webhook secret from SSM."
  exit 1
fi

echo "Sending confirmation for correlationId: ${EXEC_NAME}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: ${SECRET}" \
  -d "{\"correlationId\":\"${EXEC_NAME}\",\"status\":\"confirmed\"}" \
  "${WEBHOOK_URL}")

echo "Webhook HTTP status: ${HTTP_STATUS}"
if [[ "${HTTP_STATUS}" != "200" ]]; then
  echo "Webhook call failed with status ${HTTP_STATUS}"
  exit 1
fi

echo "Done. The Step Functions execution should now proceed."


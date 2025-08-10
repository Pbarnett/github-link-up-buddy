#!/usr/bin/env bash
set -euo pipefail
# HMAC test for provider webhook
# Usage: PROFILE=parker_flight_dev REGION=us-east-1 EXEC_NAME=test-123 scripts/deployment/auto-booking-webhook-hmac-test.sh

PROFILE="${PROFILE:-${1:-}}"
REGION="${REGION:-${2:-}}"
EXEC_NAME="${EXEC_NAME:-${3:-}}"
if [[ -z "${PROFILE}" || -z "${REGION}" || -z "${EXEC_NAME}" ]]; then
  echo "ERROR: PROFILE, REGION, and EXEC_NAME required"; exit 2; fi

STACK=AutoBookingStack
WEBHOOK_URL=$(aws --profile "$PROFILE" --region "$REGION" cloudformation describe-stacks --stack-name "$STACK" --query "Stacks[0].Outputs[?OutputKey=='WebhookUrl'].OutputValue | [0]" --output text)
SECRET=$(aws --profile "$PROFILE" --region "$REGION" ssm get-parameter --name /auto-booking/webhook-secret --with-decryption --query Parameter.Value --output text)

body="{\"correlationId\":\"$EXEC_NAME\",\"status\":\"confirmed\"}"
ts=$(date +%s)
sig=$(node -e "const crypto=require('crypto');const s=process.argv[1];const b=process.argv[2];const t=process.argv[3];console.log(crypto.createHmac('sha256',s).update(b+'.'+t).digest('hex'));" "$SECRET" "$body" "$ts")

echo "1) Unsigned should 401"
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$body" "$WEBHOOK_URL"); echo "HTTP $code"

echo "2) Stale timestamp should 401"
old_ts=$((ts-10000))
old_sig=$(node -e "const crypto=require('crypto');const s=process.argv[1];const b=process.argv[2];const t=process.argv[3];console.log(crypto.createHmac('sha256',s).update(b+'.'+t).digest('hex'));" "$SECRET" "$body" "$old_ts")
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -H "X-Timestamp: $old_ts" -H "X-Signature: $old_sig" -d "$body" "$WEBHOOK_URL"); echo "HTTP $code"

echo "3) Tampered body should 401"
body2="{\"correlationId\":\"$EXEC_NAME\",\"status\":\"confirmed\",\"x\":1}"
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -H "X-Timestamp: $ts" -H "X-Signature: $sig" -d "$body2" "$WEBHOOK_URL"); echo "HTTP $code"

echo "4) Valid should 200"
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -H "X-Timestamp: $ts" -H "X-Signature: $sig" -d "$body" "$WEBHOOK_URL"); echo "HTTP $code"

#!/usr/bin/env bash
set -euo pipefail
export AWS_PAGER=""

log() { printf "%s\n" "$*"; }

# 0) Preflight dependencies
missing=()
for cmd in git jq npm node aws; do
  command -v "$cmd" >/dev/null 2>&1 || missing+=("$cmd")
  log "check: $cmd => $(command -v "$cmd" || echo missing)"
done
if [ ${#missing[@]} -gt 0 ]; then
  log "❌ Missing dependencies: ${missing[*]}"; exit 1
fi

# 1) Find repo root
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"
log "🔎 Searching for deployable project with package.json… (root=$ROOT)"

list_candidates() {
  if command -v fd >/dev/null 2>&1; then
    fd -HI package.json -t f . | while IFS= read -r f; do
      if jq -e ".scripts | has(\"deploy-ts\") or .scripts | has(\"deploy\")" "$f" >/dev/null 2>&1; then
        dirname "$f"
      fi
    done || true
  else
    >&2 log "ℹ️ fd not found; using find fallback"
    find . -type f -name package.json -print0 | while IFS= read -r -d '' f; do
      if jq -e ".scripts | has(\"deploy-ts\") or .scripts | has(\"deploy\")" "$f" >/dev/null 2>&1; then
        dirname "$f"
      fi
    done || true
  fi
}

CANDIDATES="$(list_candidates | sort -u || true)"
DEPLOY_DIR=""
if [ -n "${CANDIDATES:-}" ]; then
  log "Candidates:"; printf "%s\n" "$CANDIDATES"
  DEPLOY_DIR="$(echo "$CANDIDATES" | awk 'BEGIN{min=1e9} {l=length($0); if(l<min){min=l; path=$0}} END{print path}')"
fi

ran_deploy=false
if [ -n "$DEPLOY_DIR" ]; then
  log "📦 Found deployable project: $DEPLOY_DIR"
  cd "$DEPLOY_DIR"
  if [ -f package-lock.json ]; then
    log "📥 Installing deps (npm ci)…"
    npm ci
  else
    log "📥 No package-lock.json; running npm install…"
    npm install
  fi

  if jq -e ".scripts[\"deploy-ts\"]" package.json >/dev/null 2>&1; then
    log "🚀 Running: npm run deploy-ts"
    npm run deploy-ts
    ran_deploy=true
  elif jq -e ".scripts[\"deploy\"]" package.json >/dev/null 2>&1; then
    log "🚀 Running: npm run deploy"
    npm run deploy
    ran_deploy=true
  else
    log "❌ No deploy script found even though package.json was selected. Aborting."
    exit 2
  fi
else
  log "ℹ️ No package.json with deploy scripts found. Trying dist/deploy.js fallback…"
  FALLBACKS=(
    "aws/step-functions/lambdas-v2/dist/deploy.js"
    "aws/step-functions/dist/deploy.js"
    "dist/deploy.js"
  )
  FOUND_DEPLOY_JS=""
  for p in "${FALLBACKS[@]}"; do
    if [ -f "$ROOT/$p" ]; then FOUND_DEPLOY_JS="$ROOT/$p"; break; fi
  done
  if [ -n "$FOUND_DEPLOY_JS" ]; then
    if [ -n "${LAMBDA_EXECUTION_ROLE_ARN:-}" ]; then
      log "🧩 Using fallback deploy script: $FOUND_DEPLOY_JS"
      node "$FOUND_DEPLOY_JS"
      ran_deploy=true
    else
      log "ℹ️ Found fallback deploy.js but LAMBDA_EXECUTION_ROLE_ARN is not set; skipping deploy step."
    fi
  else
    log "❌ Could not find a deployable project or dist/deploy.js. Skipping deploy."
  fi
fi

# 2) Smoke test (safe even if deploy did not happen) + live Payload mapping fix if needed
: "${AWS_REGION:=${AWS_REGION:-us-east-1}}"
if [ -z "${AWS_ACCOUNT_ID:-}" ]; then
  AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text 2>/dev/null || true)"
fi
SM_ARN="arn:aws:states:${AWS_REGION}:${AWS_ACCOUNT_ID}:stateMachine:auto-booking-workflow"
log "🔎 Checking for state machine: $SM_ARN"

if [ -n "${AWS_ACCOUNT_ID:-}" ] && aws stepfunctions describe-state-machine --state-machine-arn "$SM_ARN" >/dev/null 2>&1; then
  log "✅ Found state machine"
  # Check and auto-fix invalid Payload mapping if present
  DEF_FILE="$(mktemp)"
  aws stepfunctions describe-state-machine --state-machine-arn "$SM_ARN" --query definition --output text > "$DEF_FILE"
  if grep -q '"Payload": "\$"' "$DEF_FILE"; then
    log "🛠️ Detected invalid Payload mapping; patching to Payload.$ …"
    PATCHED_FILE="$(mktemp)"
    jq '
      def walk(f): . as $in
        | if type=="object" then reduce (keys_unsorted[]) as $k ({}; . + { ($k): ( ($in[$k]|walk(f)) as $v | f($v) ) })
          elif type=="array" then map(walk(f))
          else f(.) end;
      walk( if type=="object" and has("Payload") and .Payload=="$"
            then del(.Payload) + {"Payload.$":"$"}
            else . end )
    ' "$DEF_FILE" > "$PATCHED_FILE"
    aws stepfunctions update-state-machine --state-machine-arn "$SM_ARN" --definition file://"$PATCHED_FILE" >/dev/null
    rm -f "$PATCHED_FILE"
    log "✅ State machine definition patched"
  else
    log "ℹ️ Payload mapping looks correct"
  fi
  rm -f "$DEF_FILE"

  log "▶️ Starting a smoke test execution…"
  TMP_JSON="$(mktemp)"
  cat >"$TMP_JSON" <<EOF
{
  "tripId": "test-trip-123",
  "attempt": 1,
  "paymentIntentId": "pi_test_123",
  "searchParams": { "origin": "LAX", "destination": "JFK", "date": "2025-09-01", "maxPrice": 500 },
  "traveler": { "firstName": "John", "lastName": "Doe", "email": "john@example.com", "dateOfBirth": "1990-01-01" }
}
EOF
  set +e
  EXEC_ARN=$(aws stepfunctions start-execution --state-machine-arn "$SM_ARN" --input file://"$TMP_JSON" --query executionArn --output text 2>/dev/null)
  status=$?
  set -e
  rm -f "$TMP_JSON"
  if [ $status -ne 0 ] || [ -z "${EXEC_ARN:-}" ] || [ "$EXEC_ARN" = "None" ]; then
    log "❌ Failed to start execution. Check state machine and input."
  else
    log "⏳ Execution started: $EXEC_ARN; polling for completion…"
    max_tries=100
    tries=0
    STATUS="RUNNING"
    while true; do
      STATUS="$(aws stepfunctions describe-execution --execution-arn "$EXEC_ARN" --query status --output text)"
      case "$STATUS" in
        RUNNING) sleep 3 ;;
        SUCCEEDED|FAILED|TIMED_OUT|ABORTED) log "📊 Final status: $STATUS"; break ;;
        *) log "❓ Unknown status: $STATUS"; break ;;
      esac
      tries=$((tries+1))
      if [ "$tries" -ge "$max_tries" ]; then
        log "⏱️ Timeout waiting for execution to complete"; break
      fi
    done
    if [ "${STATUS}" != "SUCCEEDED" ]; then
      log "🧾 Compact failure history:"
      aws stepfunctions get-execution-history --execution-arn "$EXEC_ARN" \
        --max-items 50 --query "events[].{id:id,type:type,name:taskScheduledEventDetails.resource,err:taskFailedEventDetails.error,cause:taskFailedEventDetails.cause}" \
        --output table || true
    fi
  fi
else
  log "ℹ️ No state machine found at expected ARN ($SM_ARN). Listing available machines:"
  aws stepfunctions list-state-machines --query "stateMachines[].{name:name,arn:stateMachineArn}" --output table || true
fi

if [ "${ran_deploy}" = true ]; then log "✅ Deploy step finished (see logs above)."; else log "ℹ️ Deploy step was skipped or not found."; fi


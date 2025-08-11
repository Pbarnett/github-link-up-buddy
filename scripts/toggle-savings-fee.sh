#!/usr/bin/env bash
set -euo pipefail

# Toggle savings-based fee for a Supabase project (staging)
# Usage:
#   ./scripts/toggle-savings-fee.sh on  # sets APPLY_SAVINGS_FEE=true
#   ./scripts/toggle-savings-fee.sh off # sets APPLY_SAVINGS_FEE=false
# Env:
#   STAGING_PROJECT_REF (required) - Supabase project ref for staging
#   SAVINGS_FEE_PCT (optional)     - default fee percent (e.g., 0.05)
#   SAVINGS_FEE_MIN_CENTS (opt)
#   SAVINGS_FEE_MAX_CENTS (opt)

if ! command -v supabase >/dev/null 2>&1; then
  echo "Error: supabase CLI not found in PATH" >&2
  exit 1
fi

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 on|off" >&2
  exit 1
fi

ACTION="$1"
PROJECT_REF="${STAGING_PROJECT_REF:-}"
if [[ -z "${PROJECT_REF}" ]]; then
  echo "Error: STAGING_PROJECT_REF is not set" >&2
  exit 1
fi

case "$ACTION" in
  on)
    APPLY_SAVINGS_FEE="true"
    ;;
  off)
    APPLY_SAVINGS_FEE="false"
    ;;
  *)
    echo "Invalid argument: $ACTION (expected on|off)" >&2
    exit 1
    ;;
esac

# Build secrets command with optional values
ARGS=("APPLY_SAVINGS_FEE=${APPLY_SAVINGS_FEE}")
if [[ -n "${SAVINGS_FEE_PCT:-}" ]]; then
  ARGS+=("SAVINGS_FEE_PCT=${SAVINGS_FEE_PCT}")
fi
if [[ -n "${SAVINGS_FEE_MIN_CENTS:-}" ]]; then
  ARGS+=("SAVINGS_FEE_MIN_CENTS=${SAVINGS_FEE_MIN_CENTS}")
fi
if [[ -n "${SAVINGS_FEE_MAX_CENTS:-}" ]]; then
  ARGS+=("SAVINGS_FEE_MAX_CENTS=${SAVINGS_FEE_MAX_CENTS}")
fi

echo "Setting secrets on project ${PROJECT_REF}: ${ARGS[*]}"
# shellcheck disable=SC2068
supabase secrets set --project-ref "${PROJECT_REF}" ${ARGS[@]}

echo "Done. If your platform requires a refresh for secrets, redeploy the relevant functions."


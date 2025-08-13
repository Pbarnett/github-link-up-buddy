#!/usr/bin/env bash
# Render Prometheus configuration for a specific environment by substituting project-specific values.
# Usage: ./scripts/monitoring/render-prometheus-config.sh <environment> <project_id> <anon_key>
set -euo pipefail

if [ "$#" -lt 3 ]; then
  echo "Usage: $0 <environment> <supabase_project_id> <supabase_anon_key>" 1>&2
  exit 1
fi

ENVIRONMENT="$1"
PROJECT_ID="$2"
ANON_KEY="$3"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")"/../.. && pwd)"
TEMPLATE="$REPO_ROOT/monitoring/prometheus/prometheus.yml"
OUTPUT_DIR="$REPO_ROOT/monitoring/out/$ENVIRONMENT"
OUTPUT_FILE="$OUTPUT_DIR/prometheus.yml"

mkdir -p "$OUTPUT_DIR"

# Simple substitution of placeholders
sed \
  -e "s/YOUR_SUPABASE_PROJECT_ID/${PROJECT_ID}/g" \
  -e "s/YOUR_SUPABASE_ANON_KEY/${ANON_KEY}/g" \
  "$TEMPLATE" > "$OUTPUT_FILE"

echo "Rendered Prometheus config to: $OUTPUT_FILE"


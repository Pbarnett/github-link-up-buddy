#!/usr/bin/env bash
set -euo pipefail

# aws-helpers.sh — common AWS CLI helpers for local use
#
# Usage examples:
#   ./scripts/utils/aws-helpers.sh whoami personal-dev
#   ./scripts/utils/aws-helpers.sh s3-sync personal-dev ./dist s3://my-bucket/dist --delete --no-progress
#   ./scripts/utils/aws-helpers.sh cf-invalidate personal-prod E1234567890ABC "/*"
#   ./scripts/utils/aws-helpers.sh ecr-login personal-prod 123456789012 us-east-1
#   ./scripts/utils/aws-helpers.sh logs-tail personal-dev "/aws/lambda/my-func" us-east-1
#
# Notes:
# - Commands are executed via aws-vault exec <profile> to use short-lived credentials.
# - Region defaults to $AWS_DEFAULT_REGION if not provided.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

err() { echo "[aws-helpers] $*" >&2; }
usage() {
  cat >&2 <<'EOF'
aws-helpers.sh commands:
  whoami <profile>
      Print the caller identity for the given profile.

  s3-sync <profile> <src> <dst> [additional aws s3 sync args...]
      Sync a local directory to S3. Example flags: --delete --no-progress --size-only

  cf-invalidate <profile> <distribution-id> <paths>
      Create a CloudFront invalidation. Example paths: "/*"

  ecr-login <profile> <account-id> [region]
      Log in to ECR for Docker push/pull. Region defaults to $AWS_DEFAULT_REGION.

  logs-tail <profile> <log-group-name> [region]
      Tail CloudWatch Logs for a group (requires awslogs tail plugin or use filter-log-events).

Environment:
  AWS_DEFAULT_REGION can be set to avoid passing regions explicitly.
EOF
}

require_cmd() { command -v "$1" >/dev/null 2>&1 || { err "Missing required command: $1"; exit 127; }; }

require_cmd aws
require_cmd aws-vault

cmd=${1:-}
if [[ -z "$cmd" ]]; then
  usage; exit 2
fi
shift || true

case "$cmd" in
  whoami)
    profile=${1:-}
    if [[ -z "$profile" ]]; then err "whoami: missing <profile>"; usage; exit 2; fi
    aws-vault exec "$profile" -- aws sts get-caller-identity
    ;;

  s3-sync)
    profile=${1:-}
    src=${2:-}
    dst=${3:-}
    shift 3 || true
    if [[ -z "$profile" || -z "$src" || -z "$dst" ]]; then err "s3-sync: usage s3-sync <profile> <src> <dst> [args...]"; usage; exit 2; fi
    aws-vault exec "$profile" -- aws s3 sync "$src" "$dst" "$@"
    ;;

  cf-invalidate)
    profile=${1:-}
    dist_id=${2:-}
    paths=${3:-}
    if [[ -z "$profile" || -z "$dist_id" || -z "$paths" ]]; then err "cf-invalidate: usage cf-invalidate <profile> <distribution-id> <paths>"; usage; exit 2; fi
    aws-vault exec "$profile" -- aws cloudfront create-invalidation \
      --distribution-id "$dist_id" \
      --paths "$paths"
    ;;

  ecr-login)
    profile=${1:-}
    account_id=${2:-}
    region=${3:-${AWS_DEFAULT_REGION:-us-east-1}}
    if [[ -z "$profile" || -z "$account_id" ]]; then err "ecr-login: usage ecr-login <profile> <account-id> [region]"; usage; exit 2; fi
    require_cmd docker
    aws-vault exec "$profile" -- aws ecr get-login-password --region "$region" | \
      docker login --username AWS --password-stdin "$account_id.dkr.ecr.$region.amazonaws.com"
    ;;

  logs-tail)
    profile=${1:-}
    log_group=${2:-}
    region=${3:-${AWS_DEFAULT_REGION:-us-east-1}}
    if [[ -z "$profile" || -z "$log_group" ]]; then err "logs-tail: usage logs-tail <profile> <log-group-name> [region]"; usage; exit 2; fi
    # Non-interactive tail using filter-log-events (basic). For advanced, consider awslogs tool.
    aws-vault exec "$profile" -- aws logs filter-log-events \
      --log-group-name "$log_group" \
      --region "$region" \
      --limit 50 \
      --output table
    ;;

  *)
    err "Unknown command: $cmd"; usage; exit 2;
    ;;
esac


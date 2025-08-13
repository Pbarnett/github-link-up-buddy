#!/usr/bin/env bash
set -euo pipefail

# Quick preflight for local auth/dev environment
# - Verifies Supabase status
# - Checks presence of Google OAuth env vars (in current shell)
# - Checks that Vite points to expected Supabase URL

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

status=0

print_ok() { echo "✅ $1"; }
print_warn() { echo "⚠️  $1"; }
print_err() { echo "❌ $1"; status=1; }

# 1) Supabase status
if supabase status >/tmp/supabase_status.txt 2>&1; then
  if grep -q "supabase local development setup is running" /tmp/supabase_status.txt; then
    print_ok "Supabase: running"
  else
    print_warn "Supabase: not fully running; please start it (pnpm run supabase:start:local)"
  fi
else
  print_err "Supabase CLI not available or failed to run 'supabase status'"
fi

# 2) Google OAuth env vars (current shell)
if [[ -n "${SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID:-}" ]] && [[ -n "${SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET:-}" ]]; then
  print_ok "Google OAuth env: present in shell"
else
  print_warn "Google OAuth env: missing in shell. Use 'pnpm run supabase:start:local' or 'source .env.supabase-local' before starting Supabase"
fi

# 3) Vite env check for local vs hosted
EXPECTED_LOCAL_URL="http://127.0.0.1:54321"
if [[ -f .env.local ]]; then
  if grep -q "^VITE_SUPABASE_URL=$EXPECTED_LOCAL_URL" .env.local; then
    print_ok "Vite: points to local Supabase ($EXPECTED_LOCAL_URL)"
  else
    CURRENT_URL=$(grep -E "^VITE_SUPABASE_URL=" .env.local | cut -d'=' -f2- || true)
    print_warn "Vite: VITE_SUPABASE_URL is '$CURRENT_URL' (not local). Ensure it matches your intended environment."
  fi
else
  print_warn ".env.local not found; create it from .env.local.example"
fi

exit $status


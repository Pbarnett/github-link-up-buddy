#!/bin/bash
# Test runner for Supabase Edge Functions
# Uses Deno test runner with environment variables from .env.test

set -euo pipefail

# Load test environment variables
if [ -f .env.test ]; then
  export $(grep -v '^#' .env.test | xargs)
fi

echo "🧪 Running Supabase Edge Function tests..."

# Run Stripe wrapper tests
echo "  Testing Stripe wrapper..."
deno test --allow-env --allow-net supabase/functions/_shared/__tests__/stripe.spec.ts

# Run any other Edge Function tests
echo "  Testing other Edge Functions..."
find supabase/functions -name "*.test.ts" -exec deno test --allow-env --allow-net {} \;

echo "✅ All Edge Function tests completed successfully!"

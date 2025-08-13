#!/usr/bin/env bash
set -euo pipefail
echo "test-local-function (stub): OK"

#!/bin/bash

# Test script for get-personalization-data edge function
# Usage: ./scripts/test-local-function.sh

set -e

echo "🧪 Testing get-personalization-data function locally..."

# Check if local Supabase is running
if ! curl -s http://localhost:54321/health >/dev/null 2>&1; then
    echo "❌ Local Supabase is not running. Please run 'supabase start' first."
    exit 1
fi

# Get local environment variables
source .env.local 2>/dev/null || echo "⚠️  No .env.local file found"

SUPABASE_URL="http://localhost:54321"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0}"

echo "📍 Testing endpoint: ${SUPABASE_URL}/functions/v1/get-personalization-data"

# Test 1: Missing Authorization header (should return 401)
echo "🔍 Test 1: Missing Authorization header"
response=$(curl -s -w "%{http_code}" -o /tmp/test_response.json \
  -H "Content-Type: application/json" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  "${SUPABASE_URL}/functions/v1/get-personalization-data")

if [ "$response" = "401" ]; then
    echo "✅ Test 1 PASSED: Correctly rejected missing auth header"
else
    echo "❌ Test 1 FAILED: Expected 401, got $response"
    cat /tmp/test_response.json
fi

# Test 2: Invalid JWT token (should return 401)
echo "🔍 Test 2: Invalid JWT token"
response=$(curl -s -w "%{http_code}" -o /tmp/test_response.json \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid.jwt.token" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  "${SUPABASE_URL}/functions/v1/get-personalization-data")

if [ "$response" = "401" ]; then
    echo "✅ Test 2 PASSED: Correctly rejected invalid JWT"
else
    echo "❌ Test 2 FAILED: Expected 401, got $response"
    cat /tmp/test_response.json
fi

# Test 3: Valid JWT token (requires manual token generation)
echo "🔍 Test 3: Valid JWT token"
echo "⚠️  This test requires a valid JWT token from your local Supabase instance"
echo "   You can generate one by:"
echo "   1. Creating a user via the Supabase dashboard"
echo "   2. Using the auth.signIn() method in your app"
echo "   3. Or using the Supabase CLI: supabase auth sign-in --email test@example.com --password password"

# Placeholder for when token is available
if [ -n "${TEST_TOKEN}" ]; then
    echo "🔐 Testing with provided token..."
    response=$(curl -s -w "%{http_code}" -o /tmp/test_response.json \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${TEST_TOKEN}" \
      -H "apikey: ${SUPABASE_ANON_KEY}" \
      "${SUPABASE_URL}/functions/v1/get-personalization-data")
    
    if [ "$response" = "200" ]; then
        echo "✅ Test 3 PASSED: Valid token accepted"
        echo "📄 Response:"
        cat /tmp/test_response.json | jq .
    else
        echo "❌ Test 3 FAILED: Expected 200, got $response"
        cat /tmp/test_response.json
    fi
else
    echo "⏭️  Skipping Test 3: No TEST_TOKEN environment variable set"
fi

# Test 4: CORS preflight request
echo "🔍 Test 4: CORS preflight request"
response=$(curl -s -w "%{http_code}" -o /tmp/test_response.json \
  -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization" \
  "${SUPABASE_URL}/functions/v1/get-personalization-data")

if [ "$response" = "200" ]; then
    echo "✅ Test 4 PASSED: CORS preflight handled correctly"
else
    echo "❌ Test 4 FAILED: Expected 200, got $response"
    cat /tmp/test_response.json
fi

echo ""
echo "🎯 Local testing complete!"
echo "📋 Next steps:"
echo "   1. Fix any failing tests"
echo "   2. Deploy to staging: supabase functions deploy get-personalization-data"
echo "   3. Run integration tests: npm test -- tests/edge"
echo "   4. Run load tests: k6 run tests/load/personalization_k6.js"

# Clean up
rm -f /tmp/test_response.json

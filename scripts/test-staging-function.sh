#!/bin/bash

# Test script for staging deployment of get-personalization-data function
# Usage: ./scripts/test-staging-function.sh

set -e

echo "🧪 Testing get-personalization-data function in staging..."

# Get the project reference
PROJECT_REF=$(supabase projects list | grep "Trip Whisper" | awk -F'|' '{print $3}' | tr -d ' ')

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Could not find Trip Whisper project. Please ensure it's linked."
    exit 1
fi

STAGING_URL="https://$PROJECT_REF.functions.supabase.co/get-personalization-data"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-your-anon-key}"

echo "📍 Testing endpoint: $STAGING_URL"

# Test 1: Missing Authorization header (should return 401)
echo "🔍 Test 1: Missing Authorization header"
response=$(curl -s -w "%{http_code}" -o /tmp/staging_response.json \
  -H "Content-Type: application/json" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  "$STAGING_URL")

if [ "$response" = "401" ]; then
    echo "✅ Test 1 PASSED: Correctly rejected missing auth header"
else
    echo "❌ Test 1 FAILED: Expected 401, got $response"
    cat /tmp/staging_response.json
fi

# Test 2: Invalid JWT token (should return 401)
echo "🔍 Test 2: Invalid JWT token"
response=$(curl -s -w "%{http_code}" -o /tmp/staging_response.json \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid.jwt.token" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  "$STAGING_URL")

if [ "$response" = "401" ]; then
    echo "✅ Test 2 PASSED: Correctly rejected invalid JWT"
else
    echo "❌ Test 2 FAILED: Expected 401, got $response"
    cat /tmp/staging_response.json
fi

# Test 3: Valid JWT token (requires manual token generation)
echo "🔍 Test 3: Valid JWT token"
echo "⚠️  This test requires a valid JWT token from your staging environment"
echo "   You can generate one by:"
echo "   1. Creating a user via the Supabase dashboard"
echo "   2. Using the auth.signIn() method in your app"
echo "   3. Or using a test user script"

# Placeholder for when token is available
if [ -n "${STAGING_TOKEN}" ]; then
    echo "🔐 Testing with provided staging token..."
    response=$(curl -s -w "%{http_code}" -o /tmp/staging_response.json \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${STAGING_TOKEN}" \
      -H "apikey: ${SUPABASE_ANON_KEY}" \
      "$STAGING_URL")
    
    if [ "$response" = "200" ]; then
        echo "✅ Test 3 PASSED: Valid token accepted in staging"
        echo "📄 Response:"
        cat /tmp/staging_response.json | jq .
    else
        echo "❌ Test 3 FAILED: Expected 200, got $response"
        cat /tmp/staging_response.json
    fi
else
    echo "⏭️  Skipping Test 3: No STAGING_TOKEN environment variable set"
fi

# Test 4: CORS preflight request
echo "🔍 Test 4: CORS preflight request"
response=$(curl -s -w "%{http_code}" -o /tmp/staging_response.json \
  -X OPTIONS \
  -H "Origin: https://your-app.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization" \
  "$STAGING_URL")

if [ "$response" = "200" ]; then
    echo "✅ Test 4 PASSED: CORS preflight handled correctly"
else
    echo "❌ Test 4 FAILED: Expected 200, got $response"
    cat /tmp/staging_response.json
fi

# Test 5: Rate limiting (if token is available)
if [ -n "${STAGING_TOKEN}" ]; then
    echo "🔍 Test 5: Rate limiting test"
    echo "🔄 Making 35 requests to test rate limiting (limit is 30/min)..."
    
    success_count=0
    rate_limited_count=0
    
    for i in {1..35}; do
        response=$(curl -s -w "%{http_code}" -o /dev/null \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer ${STAGING_TOKEN}" \
          -H "apikey: ${SUPABASE_ANON_KEY}" \
          "$STAGING_URL")
        
        if [ "$response" = "200" ]; then
            success_count=$((success_count + 1))
        elif [ "$response" = "429" ]; then
            rate_limited_count=$((rate_limited_count + 1))
        fi
        
        # Small delay to avoid overwhelming the server
        sleep 0.1
    done
    
    echo "📊 Rate limiting results:"
    echo "   ✅ Successful requests: $success_count"
    echo "   🚫 Rate limited requests: $rate_limited_count"
    
    if [ $rate_limited_count -gt 0 ]; then
        echo "✅ Test 5 PASSED: Rate limiting is working"
    else
        echo "⚠️  Test 5 WARNING: Rate limiting may not be working as expected"
    fi
else
    echo "⏭️  Skipping Test 5: No STAGING_TOKEN environment variable set"
fi

echo ""
echo "🎯 Staging testing complete!"
echo "📋 Next steps:"
echo "   1. If all tests pass, run integration tests: npm test -- tests/edge"
echo "   2. Run load tests: k6 run tests/load/personalization_k6.js"
echo "   3. Verify events are logged: Check personalization_events table"
echo "   4. Monitor function logs in Supabase dashboard"

# Clean up
rm -f /tmp/staging_response.json

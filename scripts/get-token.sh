#!/bin/bash

# Generate JWT token for local Supabase test user
# Usage: ./scripts/get-token.sh test.user@pf.dev

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <email>"
    echo "Example: $0 test.user@pf.dev"
    exit 1
fi

EMAIL="$1"
PASSWORD="Passr0di"

echo "🔐 Generating JWT token for: $EMAIL"

# Local Supabase configuration
SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"

echo "📍 Using local Supabase"
echo "🔑 Using Supabase URL: $SUPABASE_URL"

# Create temp directory for responses
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Try to sign up the user first (in case they don't exist)
echo "👤 Creating/signing up user..."
signup_response=$(curl -s -X POST \
  "$SUPABASE_URL/auth/v1/signup" \
  -H "Content-Type: application/json" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo "📝 Signup response: $signup_response"

# Now sign in to get the token
echo "🔐 Signing in to get JWT token..."
signin_response=$(curl -s -X POST \
  "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "Content-Type: application/json" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo "📝 Signin response: $signin_response"

# Extract the access token using jq or basic parsing
if command -v jq &> /dev/null; then
    ACCESS_TOKEN=$(echo "$signin_response" | jq -r '.access_token // empty')
    USER_ID=$(echo "$signin_response" | jq -r '.user.id // empty')
else
    # Basic parsing without jq
    ACCESS_TOKEN=$(echo "$signin_response" | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')
    USER_ID=$(echo "$signin_response" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
fi

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
    echo "❌ Failed to get access token. Response:"
    echo "$signin_response"
    exit 1
fi

echo "✅ Successfully generated JWT token!"
echo ""
echo "🎯 Token Details:"
echo "   Email: $EMAIL"
echo "   User ID: $USER_ID"
echo "   Token: $ACCESS_TOKEN"
echo ""
echo "📋 Usage Examples:"
echo "   export JWT=\"$ACCESS_TOKEN\""
echo "   curl -H \"Authorization: Bearer $ACCESS_TOKEN\" http://127.0.0.1:54321/functions/v1/get-personalization-data"
echo "   k6 run tests/load/personalization_k6.js -e JWT=\"$ACCESS_TOKEN\""
echo ""
echo "🔐 Token saved to: tmp/jwt.txt"
mkdir -p tmp
echo "$ACCESS_TOKEN" > tmp/jwt.txt

# Check if we need to create a profile
echo "👤 Checking if profile exists..."
profile_check_response=$(curl -s -X GET \
  "$SUPABASE_URL/rest/v1/profiles?id=eq.$USER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "apikey: $SUPABASE_ANON_KEY")

echo "📝 Profile check response: $profile_check_response"

# If profile doesn't exist, create it
if echo "$profile_check_response" | grep -q '\[\]' || echo "$profile_check_response" | grep -q '"code":'; then
    echo "👤 Creating test profile..."
    profile_response=$(curl -s -X POST \
      "$SUPABASE_URL/rest/v1/profiles" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -H "apikey: $SUPABASE_ANON_KEY" \
      -H "Prefer: return=representation" \
      -d "{
        \"id\": \"$USER_ID\",
        \"first_name\": \"Test\",
        \"email\": \"$EMAIL\",
        \"next_trip_city\": \"San Francisco\",
        \"personalization_enabled\": true
      }")
    
    echo "📝 Profile creation response: $profile_response"
else
    echo "✅ Profile already exists!"
fi

echo ""
echo "✅ Test user and profile ready!"
echo "🎉 Ready for integration testing!"

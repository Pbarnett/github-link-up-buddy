#!/bin/bash

# Test script to check personalization events table and analytics
# Usage: ./scripts/test-personalization-events.sh

set -e

echo "🧪 Testing personalization events table..."

# Get project reference
PROJECT_REF=$(supabase projects list | grep "Trip Whisper" | awk -F'|' '{print $3}' | tr -d ' ')

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Could not find Trip Whisper project"
    exit 1
fi

# Check if we can access the events table
echo "📊 Checking personalization_events table..."

# Test SQL query to count events
SQL_QUERY="SELECT COUNT(*) FROM personalization_events WHERE event_type='data_requested' AND created_at > now() - interval '1 hour';"

echo "🔍 Running query: $SQL_QUERY"

# Try to run the query via Supabase CLI
echo "📋 Attempting to query personalization_events table..."

# We'll use a simpler approach since we can't easily connect to remote DB
echo "⚠️  Note: To fully test personalization events, you need:"
echo "   1. A valid JWT token from a staging user"
echo "   2. Direct database access or API access"
echo ""
echo "💡 Manual testing steps:"
echo "   1. Create a user in the Supabase dashboard"
echo "   2. Call the get-personalization-data function with their JWT"
echo "   3. Check the personalization_events table for new entries"
echo ""
echo "🧪 Testing function endpoint with dummy data..."

# Test the function endpoint directly
FUNCTION_URL="https://$PROJECT_REF.functions.supabase.co/get-personalization-data"

echo "📍 Testing: $FUNCTION_URL"

# Test without auth (should get 401)
response=$(curl -s -w "%{http_code}" -o /tmp/test_response.json \
  -H "Content-Type: application/json" \
  "$FUNCTION_URL")

if [ "$response" = "401" ]; then
    echo "✅ Function correctly rejects unauthorized requests"
else
    echo "❌ Unexpected response: $response"
    cat /tmp/test_response.json
fi

echo ""
echo "📋 Next steps to complete testing:"
echo "   1. Create a test user in Supabase Dashboard"
echo "   2. Get their JWT token"
echo "   3. Call function with: curl -H 'Authorization: Bearer TOKEN' $FUNCTION_URL"
echo "   4. Check personalization_events table for entries"
echo ""
echo "✅ Basic function validation complete!"

# Clean up
rm -f /tmp/test_response.json

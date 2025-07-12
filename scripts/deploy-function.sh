#!/bin/bash

# Deploy script for get-personalization-data edge function
# Usage: ./scripts/deploy-function.sh

set -e

echo "🚀 Deploying get-personalization-data function to staging..."

# Check if we're logged in to Supabase
if ! supabase projects list >/dev/null 2>&1; then
    echo "❌ Not logged in to Supabase. Please run 'supabase login' first."
    exit 1
fi

# Get the project reference
PROJECT_REF=$(supabase projects list | grep "Trip Whisper" | awk -F'|' '{print $3}' | tr -d ' ')

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Could not find Trip Whisper project. Please ensure it's linked."
    exit 1
fi

echo "📍 Deploying to project: $PROJECT_REF"

# Deploy the function
echo "📦 Bundling and deploying function..."
supabase functions deploy get-personalization-data --project-ref "$PROJECT_REF"

if [ $? -eq 0 ]; then
    echo "✅ Function deployed successfully!"
    echo "🔗 Function URL: https://$PROJECT_REF.functions.supabase.co/get-personalization-data"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Test the deployed function: ./scripts/test-staging-function.sh"
    echo "   2. Run integration tests: npm test -- tests/edge"
    echo "   3. Run load tests: k6 run tests/load/personalization_k6.js"
else
    echo "❌ Function deployment failed!"
    exit 1
fi

#!/bin/bash
# Deploy Duffel Edge Functions
# 
# Deploys the new Duffel integration Edge Functions:
# - duffel-webhooks: Handle webhook events from Duffel
# - duffel-health: Monitor Duffel API connectivity
# - duffel-guided: Complete workflow implementation

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Deploying Duffel Edge Functions${NC}"
echo ""

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI is not installed${NC}"
    echo "Install it from: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if we're logged in to Supabase
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Supabase${NC}"
    echo "Please run: supabase auth login"
    exit 1
fi

# Validate environment variables
echo -e "${YELLOW}🔍 Validating environment variables...${NC}"

required_vars=(
    "DUFFEL_API_TOKEN_TEST"
    "DUFFEL_WEBHOOK_SECRET"
    "SUPABASE_URL"
    "SUPABASE_SERVICE_ROLE_KEY"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        missing_vars+=("$var")
    fi
done

if [[ ${#missing_vars[@]} -gt 0 ]]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    printf '   - %s\n' "${missing_vars[@]}"
    echo ""
    echo -e "${YELLOW}💡 Check your .env file and DUFFEL_IMPLEMENTATION_GUIDE.md${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment validation passed${NC}"
echo ""

# Deploy webhook handler
echo -e "${YELLOW}📡 Deploying duffel-webhooks function...${NC}"
supabase functions deploy duffel-webhooks --no-verify-jwt

if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ duffel-webhooks deployed successfully${NC}"
else
    echo -e "${RED}❌ Failed to deploy duffel-webhooks${NC}"
    exit 1
fi

# Deploy health check
echo -e "${YELLOW}🔍 Deploying duffel-health function...${NC}"
supabase functions deploy duffel-health --no-verify-jwt

if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ duffel-health deployed successfully${NC}"
else
    echo -e "${RED}❌ Failed to deploy duffel-health${NC}"
    exit 1
fi

# Deploy guided workflow function
echo -e "${YELLOW}🎯 Deploying duffel-guided function...${NC}"
supabase functions deploy duffel-guided --no-verify-jwt

if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ duffel-guided deployed successfully${NC}"
else
    echo -e "${RED}❌ Failed to deploy duffel-guided${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All Duffel functions deployed successfully!${NC}"
echo ""

# Get project reference for URLs
PROJECT_REF=$(supabase projects list --output json | jq -r '.[0].id' 2>/dev/null || echo "YOUR_PROJECT_REF")

# Display URLs
echo -e "${YELLOW}📋 Function URLs:${NC}"
echo "   🔗 Health Check: https://${PROJECT_REF}.supabase.co/functions/v1/duffel-health"
echo "   🔗 Webhooks: https://${PROJECT_REF}.supabase.co/functions/v1/duffel-webhooks"  
echo "   🔗 Guided API: https://${PROJECT_REF}.supabase.co/functions/v1/duffel-guided"
echo ""

# Test health check
echo -e "${YELLOW}🏥 Testing health check...${NC}"
if command -v curl &> /dev/null; then
    HEALTH_URL="https://${PROJECT_REF}.supabase.co/functions/v1/duffel-health"
    
    # Test with timeout
    if curl -s -f --max-time 30 "$HEALTH_URL" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Health check passed${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check failed or timed out${NC}"
        echo "   Check the function logs and environment variables"
    fi
else
    echo -e "${YELLOW}⚠️  curl not available, skipping health check test${NC}"
fi

echo ""
echo -e "${GREEN}✨ Deployment complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Configure webhook URL in Duffel Dashboard:"
echo "   https://${PROJECT_REF}.supabase.co/functions/v1/duffel-webhooks"
echo ""
echo "2. Test the health endpoint:"
echo "   curl https://${PROJECT_REF}.supabase.co/functions/v1/duffel-health"
echo ""
echo "3. Run the integration tests:"
echo "   npm run test src/tests/duffel-integration.test.ts"
echo ""
echo -e "${YELLOW}📚 Documentation: docs/api/duffel/DUFFEL_IMPLEMENTATION_GUIDE.md${NC}"

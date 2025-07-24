#!/bin/bash

# Secure Credential Setup Script
# This script helps you set up environment variables securely without committing them to git

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 Secure Credential Setup${NC}"
echo -e "${YELLOW}This script will help you set up environment variables securely.${NC}"
echo ""

# Check if .env files exist and warn
if [[ -f ".env" || -f ".env.test" || -f ".env.local" ]]; then
    echo -e "${YELLOW}⚠️  Warning: Environment files detected!${NC}"
    echo "For security, we'll create new credential files that are properly ignored by git."
    echo ""
fi

# Function to securely prompt for credentials
prompt_credential() {
    local var_name="$1"
    local description="$2"
    local format="$3"
    local required="$4"
    
    echo -e "${BLUE}📝 $description${NC}"
    echo -e "   Format: ${YELLOW}$format${NC}"
    
    if [[ "$required" == "required" ]]; then
        echo -e "   ${RED}Required for integration tests${NC}"
    else
        echo -e "   ${GREEN}Optional${NC}"
    fi
    
    read -p "Enter $var_name: " -r credential
    
    if [[ "$required" == "required" && -z "$credential" ]]; then
        echo -e "${RED}❌ This credential is required!${NC}"
        return 1
    fi
    
    # Basic format validation
    case "$var_name" in
        "STRIPE_SECRET_KEY")
            if [[ -n "$credential" && ! "$credential" =~ ^sk_test_ ]]; then
                echo -e "${RED}❌ Stripe secret key must start with 'sk_test_' for safety${NC}"
                return 1
            fi
            ;;
        "LAUNCHDARKLY_SDK_KEY")
            if [[ -n "$credential" && ! "$credential" =~ ^sdk- ]]; then
                echo -e "${RED}❌ LaunchDarkly SDK key must start with 'sdk-'${NC}"
                return 1
            fi
            ;;
        "SUPABASE_URL")
            if [[ -n "$credential" && ! "$credential" =~ ^https?:// ]]; then
                echo -e "${RED}❌ Supabase URL must start with 'http://' or 'https://'${NC}"
                return 1
            fi
            ;;
    esac
    
    echo "$credential"
}

# Function to create secure env file
create_env_file() {
    local env_file="$1"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    
    cat > "$env_file" << EOF
# Secure Environment Configuration
# Generated: $timestamp
# 🔐 This file contains real credentials - NEVER commit to git!

# Node Environment
NODE_ENV=test
DEBUG=false

EOF
}

echo -e "${GREEN}Setting up integration test credentials...${NC}"
echo ""

# Create .env.test.local (this will be ignored by git)
ENV_FILE=".env.test.local"
create_env_file "$ENV_FILE"

# Collect Stripe credentials
echo -e "${BLUE}🎯 Stripe Configuration${NC}"
STRIPE_SECRET=$(prompt_credential "STRIPE_SECRET_KEY" "Stripe Test Secret Key" "sk_test_..." "required" || echo "")
if [[ -n "$STRIPE_SECRET" ]]; then
    echo "STRIPE_SECRET_KEY=$STRIPE_SECRET" >> "$ENV_FILE"
fi

STRIPE_PUBLISHABLE=$(prompt_credential "STRIPE_PUBLISHABLE_KEY" "Stripe Test Publishable Key" "pk_test_..." "optional" || echo "")
if [[ -n "$STRIPE_PUBLISHABLE" ]]; then
    echo "STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE" >> "$ENV_FILE"
fi

echo "" >> "$ENV_FILE"

# Collect LaunchDarkly credentials
echo -e "${BLUE}🚀 LaunchDarkly Configuration${NC}"
LD_SDK_KEY=$(prompt_credential "LAUNCHDARKLY_SDK_KEY" "LaunchDarkly Server SDK Key" "sdk-..." "required" || echo "")
if [[ -n "$LD_SDK_KEY" ]]; then
    echo "LAUNCHDARKLY_SDK_KEY=$LD_SDK_KEY" >> "$ENV_FILE"
fi

LD_CLIENT_ID=$(prompt_credential "VITE_LD_CLIENT_ID" "LaunchDarkly Client ID" "hex string" "optional" || echo "")
if [[ -n "$LD_CLIENT_ID" ]]; then
    echo "VITE_LD_CLIENT_ID=$LD_CLIENT_ID" >> "$ENV_FILE"
fi

echo "" >> "$ENV_FILE"

# Collect Supabase credentials
echo -e "${BLUE}🗄️  Supabase Configuration${NC}"
SUPABASE_URL=$(prompt_credential "SUPABASE_URL" "Supabase Project URL" "https://xxx.supabase.co" "required" || echo "")
if [[ -n "$SUPABASE_URL" ]]; then
    echo "SUPABASE_URL=$SUPABASE_URL" >> "$ENV_FILE"
    echo "VITE_SUPABASE_URL=$SUPABASE_URL" >> "$ENV_FILE"
fi

SUPABASE_ANON_KEY=$(prompt_credential "SUPABASE_ANON_KEY" "Supabase Anonymous Key" "eyJ..." "required" || echo "")
if [[ -n "$SUPABASE_ANON_KEY" ]]; then
    echo "SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY" >> "$ENV_FILE"
    echo "VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY" >> "$ENV_FILE"
fi

echo "" >> "$ENV_FILE"

# Optional test user credentials
echo -e "${BLUE}👤 Test User Configuration (Optional)${NC}"
TEST_EMAIL=$(prompt_credential "E2E_TEST_USER_EMAIL" "Test User Email" "test@example.com" "optional" || echo "")
if [[ -n "$TEST_EMAIL" ]]; then
    echo "E2E_TEST_USER_EMAIL=$TEST_EMAIL" >> "$ENV_FILE"
fi

TEST_PASSWORD=$(prompt_credential "E2E_TEST_USER_PASSWORD" "Test User Password" "secure password" "optional" || echo "")
if [[ -n "$TEST_PASSWORD" ]]; then
    echo "E2E_TEST_USER_PASSWORD=$TEST_PASSWORD" >> "$ENV_FILE"
fi

echo ""
echo -e "${GREEN}✅ Credentials saved to $ENV_FILE${NC}"
echo -e "${YELLOW}🔒 This file is ignored by git for security${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Run integration tests: ${YELLOW}npm run test:integration:external${NC}"
echo "2. To update credentials, run this script again"
echo "3. Never commit .env files with real credentials!"
echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"

#!/bin/bash

# Day 4-5 Payment Methods System Deployment Script
# This script deploys the complete payment methods system with KMS encryption and Stripe integration

set -e

echo "🚀 Starting Payment Methods System Deployment (Day 4-5)"
echo "=========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required environment variables are set
check_env_vars() {
    echo -e "${YELLOW}Checking environment variables...${NC}"
    
    required_vars=(
        "SUPABASE_URL" 
        "SUPABASE_ANON_KEY" 
        "SUPABASE_SERVICE_ROLE_KEY"
        "STRIPE_SECRET_KEY"
        "VITE_STRIPE_PUBLIC_KEY"
        "AWS_ACCESS_KEY_ID"
        "AWS_SECRET_ACCESS_KEY"
        "AWS_KMS_PAYMENT_KEY_ID"
        "AWS_KMS_PII_KEY_ID"
        "AWS_REGION"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        echo -e "${RED}❌ Missing required environment variables:${NC}"
        printf '%s\n' "${missing_vars[@]}"
        echo -e "${YELLOW}Please set these environment variables and try again.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All environment variables are set${NC}"
}

# Deploy edge functions
deploy_edge_functions() {
    echo -e "${YELLOW}Deploying edge functions...${NC}"
    
    # Deploy the new payment-methods-kms function
    if npx supabase functions deploy payment-methods-kms; then
        echo -e "${GREEN}✅ payment-methods-kms function deployed${NC}"
    else
        echo -e "${RED}❌ Failed to deploy payment-methods-kms function${NC}"
        exit 1
    fi
    
    # Deploy updated set-default-payment-method function
    if npx supabase functions deploy set-default-payment-method; then
        echo -e "${GREEN}✅ set-default-payment-method function deployed${NC}"
    else
        echo -e "${RED}❌ Failed to deploy set-default-payment-method function${NC}"
        exit 1
    fi
    
    # Deploy updated delete-payment-method function
    if npx supabase functions deploy delete-payment-method; then
        echo -e "${GREEN}✅ delete-payment-method function deployed${NC}"
    else
        echo -e "${RED}❌ Failed to deploy delete-payment-method function${NC}"
        exit 1
    fi
}

# Run database migrations
run_migrations() {
    echo -e "${YELLOW}Running database migrations...${NC}"
    
    if npx supabase db push; then
        echo -e "${GREEN}✅ Database migrations completed${NC}"
    else
        echo -e "${RED}❌ Database migrations failed${NC}"
        exit 1
    fi
}

# Test the payment system
test_payment_system() {
    echo -e "${YELLOW}Testing payment system...${NC}"
    
    # Test the payment-methods-kms function health endpoint
    echo "Testing payment-methods-kms health endpoint..."
    response=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/payment-methods-kms" \
        -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
        -H "Content-Type: application/json" \
        -d '{"action": "health"}')
    
    if echo "$response" | grep -q '"status":"healthy"'; then
        echo -e "${GREEN}✅ payment-methods-kms health check passed${NC}"
    else
        echo -e "${RED}❌ payment-methods-kms health check failed${NC}"
        echo "Response: $response"
        exit 1
    fi
    
    # Test database schema
    echo "Testing database schema..."
    if npx supabase db diff --local --schema public | grep -q "No changes"; then
        echo -e "${GREEN}✅ Database schema is up to date${NC}"
    else
        echo -e "${YELLOW}⚠️  Database schema differences detected${NC}"
        npx supabase db diff --local --schema public
    fi
}

# Build and prepare frontend
build_frontend() {
    echo -e "${YELLOW}Building frontend...${NC}"
    
    if npm run build; then
        echo -e "${GREEN}✅ Frontend built successfully${NC}"
    else
        echo -e "${RED}❌ Frontend build failed${NC}"
        exit 1
    fi
}

# Verify KMS encryption setup
verify_kms_setup() {
    echo -e "${YELLOW}Verifying KMS encryption setup...${NC}"
    
    # Check if KMS keys are accessible
    if aws kms describe-key --key-id "$AWS_KMS_PAYMENT_KEY_ID" --region "$AWS_REGION" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Payment KMS key is accessible${NC}"
    else
        echo -e "${RED}❌ Payment KMS key is not accessible${NC}"
        exit 1
    fi
    
    if aws kms describe-key --key-id "$AWS_KMS_PII_KEY_ID" --region "$AWS_REGION" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PII KMS key is accessible${NC}"
    else
        echo -e "${RED}❌ PII KMS key is not accessible${NC}"
        exit 1
    fi
}

# Main deployment flow
main() {
    echo -e "${GREEN}Day 4-5 Payment Methods System Deployment${NC}"
    echo "This script will deploy:"
    echo "- KMS encryption utilities"
    echo "- Stripe integration edge functions"
    echo "- Database migrations for payment methods"
    echo "- Updated UI components"
    echo "- Security and compliance features"
    echo ""
    
    read -p "Continue with deployment? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
    
    check_env_vars
    verify_kms_setup
    run_migrations
    deploy_edge_functions
    build_frontend
    test_payment_system
    
    echo ""
    echo -e "${GREEN}🎉 Payment Methods System Deployment Completed!${NC}"
    echo "========================================================"
    echo ""
    echo "✅ Features deployed:"
    echo "   - KMS encryption for payment data"
    echo "   - Stripe payment method integration"
    echo "   - Enhanced wallet UI with add/delete/set default"
    echo "   - Database audit logging"
    echo "   - Row-level security policies"
    echo "   - PCI DSS compliance measures"
    echo ""
    echo "🔒 Security features:"
    echo "   - End-to-end encryption with AWS KMS"
    echo "   - Audit logging for all payment operations"
    echo "   - Secure payment method tokenization"
    echo "   - Row-level security for data access"
    echo ""
    echo "🚀 Next steps:"
    echo "   - Test the wallet UI at /wallet"
    echo "   - Monitor KMS audit logs"
    echo "   - Configure Stripe webhook endpoints"
    echo "   - Set up monitoring and alerts"
    echo ""
    echo "📊 Monitoring endpoints:"
    echo "   - Payment methods health: ${SUPABASE_URL}/functions/v1/payment-methods-kms (POST with {\"action\": \"health\"})"
    echo "   - KMS audit logs: Check kms_audit_log table"
    echo "   - Feature flag: wallet_ui in feature_flags table"
    echo ""
}

# Run the deployment
main "$@"

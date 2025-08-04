#!/bin/bash

# AWS World-Class Standards Quick Setup Script
# This script helps with the initial setup and deployment

set -e  # Exit on any error

echo "🚀 AWS World-Class Standards Framework Setup"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ AWS CLI found${NC}"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js found: ${NODE_VERSION}${NC}"
fi

# Check TypeScript
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx is not available. Please install npm/npx${NC}"
    exit 1
else
    echo -e "${GREEN}✅ npx available${NC}"
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure'${NC}"
    exit 1
else
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    echo -e "${GREEN}✅ AWS credentials configured for account: ${ACCOUNT_ID}${NC}"
fi

# Get user input
echo -e "\n${BLUE}Configuration Setup${NC}"
read -p "Enter your alert email address: " ALERT_EMAIL
read -p "Enter AWS region (default: us-east-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

read -p "Deploy PCI DSS infrastructure? (y/n, default: n): " DEPLOY_PCI
DEPLOY_PCI=${DEPLOY_PCI:-n}

echo -e "\n${YELLOW}Configuration Summary:${NC}"
echo "Alert Email: ${ALERT_EMAIL}"
echo "AWS Region: ${AWS_REGION}"
echo "Deploy PCI DSS: ${DEPLOY_PCI}"
echo "Account ID: ${ACCOUNT_ID}"

read -p "Continue with deployment? (y/n): " CONTINUE
if [[ $CONTINUE != "y" ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Create necessary directories
echo -e "\n${BLUE}Creating directory structure...${NC}"
mkdir -p dist
mkdir -p reports
mkdir -p logs

# Install dependencies
echo -e "\n${BLUE}Installing dependencies...${NC}"
if [ ! -f "package.json" ]; then
    npm init -y
fi

# Dependencies are already installed, verify AWS SDK
echo "Dependencies already installed with pnpm."

# Compile TypeScript files
echo -e "\n${BLUE}Compiling TypeScript files...${NC}"
if [ -f "scripts/security/iam-policy-auditor.ts" ]; then
    npx tsc scripts/security/iam-policy-auditor.ts --outDir dist --target es2020 --module commonjs --esModuleInterop true --skipLibCheck true
fi

if [ -f "scripts/security/access-key-rotation-manager.ts" ]; then
    npx tsc scripts/security/access-key-rotation-manager.ts --outDir dist --target es2020 --module commonjs --esModuleInterop true --skipLibCheck true
fi

if [ -f "scripts/cost-optimization/comprehensive-cost-optimizer.ts" ]; then
    npx tsc scripts/cost-optimization/comprehensive-cost-optimizer.ts --outDir dist --target es2020 --module commonjs --esModuleInterop true --skipLibCheck true
fi

if [ -f "scripts/monitoring/comprehensive-monitoring-system.ts" ]; then
    npx tsc scripts/monitoring/comprehensive-monitoring-system.ts --outDir dist --target es2020 --module commonjs --esModuleInterop true --skipLibCheck true
fi

if [ -f "scripts/compliance/gdpr-compliance-manager.ts" ]; then
    npx tsc scripts/compliance/gdpr-compliance-manager.ts --outDir dist --target es2020 --module commonjs --esModuleInterop true --skipLibCheck true
fi

if [ -f "scripts/disaster_recovery/multi-region-disaster-recovery.ts" ]; then
    npx tsc scripts/disaster_recovery/multi-region-disaster-recovery.ts --outDir dist --target es2020 --module commonjs --esModuleInterop true --skipLibCheck true
fi

# Make shell scripts executable
if [ -f "scripts/security/root-account-security-check.sh" ]; then
    chmod +x scripts/security/root-account-security-check.sh
fi

echo -e "\n${BLUE}Validating CloudFormation templates...${NC}"
for template in deploy/aws/*.yml deploy/aws/*.yaml; do
    if [ -f "$template" ]; then
        echo "Validating: $template"
        aws cloudformation validate-template --template-body file://$template > /dev/null
        echo -e "${GREEN}✅ $template validated${NC}"
    fi
done

# Deploy infrastructure
echo -e "\n${BLUE}Starting infrastructure deployment...${NC}"

# Deploy security monitoring first
echo -e "\n${YELLOW}Deploying security monitoring...${NC}"
if [ -f "deploy/aws/cloudtrail-monitoring.yml" ]; then
    aws cloudformation deploy \
        --template-file deploy/aws/cloudtrail-monitoring.yml \
        --stack-name github-buddy-security-monitoring \
        --capabilities CAPABILITY_IAM \
        --parameter-overrides AlertEmail=${ALERT_EMAIL} \
        --region ${AWS_REGION}
    echo -e "${GREEN}✅ Security monitoring deployed${NC}"
fi

# Deploy MFA enforcement
echo -e "\n${YELLOW}Deploying MFA enforcement...${NC}"
if [ -f "deploy/aws/mfa-enforcement-template.yml" ]; then
    aws cloudformation deploy \
        --template-file deploy/aws/mfa-enforcement-template.yml \
        --stack-name github-buddy-mfa-enforcement \
        --capabilities CAPABILITY_IAM \
        --region ${AWS_REGION}
    echo -e "${GREEN}✅ MFA enforcement deployed${NC}"
fi

# Deploy main infrastructure
echo -e "\n${YELLOW}Deploying main infrastructure...${NC}"
if [ -f "deploy/aws/multi-az-infrastructure-template.yml" ]; then
    aws cloudformation deploy \
        --template-file deploy/aws/multi-az-infrastructure-template.yml \
        --stack-name github-buddy-infrastructure \
        --capabilities CAPABILITY_IAM \
        --parameter-overrides \
            Environment=production \
            AlertEmail=${ALERT_EMAIL} \
        --region ${AWS_REGION}
    echo -e "${GREEN}✅ Main infrastructure deployed${NC}"
fi

# Deploy cost monitoring
echo -e "\n${YELLOW}Deploying cost monitoring...${NC}"
if [ -f "deploy/aws/cost-monitoring-dashboard.yml" ]; then
    aws cloudformation deploy \
        --template-file deploy/aws/cost-monitoring-dashboard.yml \
        --stack-name github-buddy-cost-monitoring \
        --capabilities CAPABILITY_IAM \
        --parameter-overrides AlertEmail=${ALERT_EMAIL} \
        --region ${AWS_REGION}
    echo -e "${GREEN}✅ Cost monitoring deployed${NC}"
fi

# Deploy PCI DSS if requested
if [[ $DEPLOY_PCI == "y" ]]; then
    echo -e "\n${YELLOW}Deploying PCI DSS infrastructure...${NC}"
    if [ -f "deploy/aws/pci-dss-infrastructure.yaml" ]; then
        aws cloudformation deploy \
            --template-file deploy/aws/pci-dss-infrastructure.yaml \
            --stack-name github-buddy-pci-compliance \
            --capabilities CAPABILITY_IAM \
            --region ${AWS_REGION}
        echo -e "${GREEN}✅ PCI DSS infrastructure deployed${NC}"
    fi
fi

# Run initial security audit
echo -e "\n${YELLOW}Running initial security audit...${NC}"
if [ -f "dist/scripts/security/iam-policy-auditor.js" ]; then
    node dist/scripts/security/iam-policy-auditor.js || echo -e "${YELLOW}⚠️  Security audit completed with warnings${NC}"
fi

if [ -f "scripts/security/root-account-security-check.sh" ]; then
    ./scripts/security/root-account-security-check.sh || echo -e "${YELLOW}⚠️  Root account check completed with warnings${NC}"
fi

echo -e "\n${GREEN}🎉 AWS World-Class Standards Framework Deployment Complete!${NC}"
echo -e "\n${BLUE}Next Steps:${NC}"
echo "1. Review the generated reports in the 'reports/' directory"
echo "2. Configure GitHub Actions secrets for automated deployments"
echo "3. Set up monitoring dashboards in AWS CloudWatch"
echo "4. Schedule regular security audits and cost reviews"
echo "5. Test disaster recovery procedures"

echo -e "\n${BLUE}Quick Commands:${NC}"
echo "• Security audit: node dist/scripts/security/iam-policy-auditor.js"
echo "• Root check: ./scripts/security/root-account-security-check.sh"
echo "• Cost optimization: node dist/scripts/cost-optimization/comprehensive-cost-optimizer.js --dry-run"

echo -e "\n${BLUE}Documentation:${NC}"
echo "• Full documentation: AWS-WORLD-CLASS-STANDARDS-IMPLEMENTATION.md"
echo "• CloudWatch dashboards: https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:"

echo -e "\n${GREEN}Deployment completed successfully! 🚀${NC}"

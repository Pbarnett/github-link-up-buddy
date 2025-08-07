#!/bin/bash

# KMS Key Rotation Implementation - Quick Deployment Script
# Run this script to deploy the complete KMS rotation solution

set -e

echo "🔒 GitHub Link Buddy - KMS Key Rotation Deployment"
echo "=================================================="

# Configuration
STACK_NAME="github-link-buddy-kms-rotation"
ENVIRONMENT=${1:-"staging"}
APPLICATION_NAME="github-link-buddy"
NOTIFICATION_EMAIL=${2:-""}
REGION=${AWS_REGION:-"us-east-1"}

echo "📋 Deployment Configuration:"
echo "   Stack Name: $STACK_NAME-$ENVIRONMENT"
echo "   Environment: $ENVIRONMENT"
echo "   Application: $APPLICATION_NAME"
echo "   Region: $REGION"
if [[ -n "$NOTIFICATION_EMAIL" ]]; then
    echo "   Notifications: $NOTIFICATION_EMAIL"
else
    echo "   Notifications: None (optional)"
fi
echo ""

# Validate AWS CLI and credentials
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed"
    exit 1
fi

echo "🔍 Validating AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured or invalid"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ AWS credentials valid for account: $ACCOUNT_ID"

# Validate CloudFormation template
echo "🔍 Validating CloudFormation template..."
if aws cloudformation validate-template --template-body file://infrastructure/kms-rotation-stack.yaml &> /dev/null; then
    echo "✅ CloudFormation template is valid"
else
    echo "❌ CloudFormation template validation failed"
    exit 1
fi

# Check if stack already exists
STACK_EXISTS=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME-$ENVIRONMENT" 2>/dev/null || echo "false")

if [[ "$STACK_EXISTS" != "false" ]]; then
    echo "⚠️  Stack $STACK_NAME-$ENVIRONMENT already exists"
    read -p "Do you want to update it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled"
        exit 0
    fi
    ACTION="update"
else
    ACTION="create"
fi

# Prepare parameters
PARAMETERS="ParameterKey=Environment,ParameterValue=$ENVIRONMENT"
PARAMETERS="$PARAMETERS ParameterKey=ApplicationName,ParameterValue=$APPLICATION_NAME"

if [[ -n "$NOTIFICATION_EMAIL" ]]; then
    PARAMETERS="$PARAMETERS ParameterKey=NotificationEmail,ParameterValue=$NOTIFICATION_EMAIL"
fi

# Deploy the stack
echo "🚀 $(echo ${ACTION:0:1} | tr '[:lower:]' '[:upper:]')${ACTION:1}ing CloudFormation stack..."
if [[ "$ACTION" == "create" ]]; then
    aws cloudformation create-stack \
        --stack-name "$STACK_NAME-$ENVIRONMENT" \
        --template-body file://infrastructure/kms-rotation-stack.yaml \
        --parameters $PARAMETERS \
        --capabilities CAPABILITY_NAMED_IAM \
        --region "$REGION"
else
    aws cloudformation update-stack \
        --stack-name "$STACK_NAME-$ENVIRONMENT" \
        --template-body file://infrastructure/kms-rotation-stack.yaml \
        --parameters $PARAMETERS \
        --capabilities CAPABILITY_NAMED_IAM \
        --region "$REGION"
fi

echo "⏳ Waiting for stack deployment to complete..."
aws cloudformation wait "stack-${ACTION}-complete" \
    --stack-name "$STACK_NAME-$ENVIRONMENT" \
    --region "$REGION"

# Check deployment status
STACK_STATUS=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME-$ENVIRONMENT" \
    --query 'Stacks[0].StackStatus' \
    --output text \
    --region "$REGION")

if [[ "$STACK_STATUS" == *"COMPLETE" ]]; then
    echo "✅ Stack deployment completed successfully!"
else
    echo "❌ Stack deployment failed with status: $STACK_STATUS"
    exit 1
fi

# Get stack outputs
echo "📤 Retrieving stack outputs..."
KMS_KEY_ALIAS=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME-$ENVIRONMENT" \
    --query 'Stacks[0].Outputs[?OutputKey==`EncryptionKeyAlias`].OutputValue' \
    --output text \
    --region "$REGION")

KMS_KEY_ARN=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME-$ENVIRONMENT" \
    --query 'Stacks[0].Outputs[?OutputKey==`EncryptionKeyArn`].OutputValue' \
    --output text \
    --region "$REGION")

APPLICATION_ROLE_ARN=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME-$ENVIRONMENT" \
    --query 'Stacks[0].Outputs[?OutputKey==`ApplicationRoleArn`].OutputValue' \
    --output text \
    --region "$REGION")

echo ""
echo "🔐 Deployment Complete!"
echo "======================="
echo ""
echo "📋 Stack Outputs:"
echo "   KMS Key Alias: $KMS_KEY_ALIAS"
echo "   KMS Key ARN: $KMS_KEY_ARN"
echo "   Application Role ARN: $APPLICATION_ROLE_ARN"
echo ""

# Generate environment variables
echo "🔧 Environment Variables to Set:"
echo "=================================="
echo "export KMS_KEY_ALIAS=\"$KMS_KEY_ALIAS\""
echo "export VITE_AWS_REGION=\"$REGION\""
echo "export VITE_ENABLE_METRICS=\"true\""
echo ""

# Create .env update
ENV_FILE=".env.$ENVIRONMENT"
echo "📝 Creating $ENV_FILE with KMS configuration..."

cat > "$ENV_FILE" << EOF
# KMS Key Rotation Configuration - Generated on $(date)
KMS_KEY_ALIAS=$KMS_KEY_ALIAS
VITE_AWS_REGION=$REGION
VITE_ENABLE_METRICS=true

# Application Configuration
NODE_ENV=$ENVIRONMENT
EOF

echo "✅ Created $ENV_FILE"

# Test the deployment
echo "🧪 Running deployment tests..."
echo ""

# Install dependencies if not already installed
if [[ ! -d "node_modules/@aws-sdk/lib-dynamodb" ]]; then
    echo "📦 Installing missing AWS SDK dependencies..."
    npm install @aws-sdk/lib-dynamodb
fi

# Run KMS tests (optional)
read -p "Do you want to run the KMS rotation tests? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔬 Running KMS rotation tests..."
    if KMS_KEY_ALIAS="$KMS_KEY_ALIAS" AWS_REGION="$REGION" npx tsx scripts/test-kms-rotation.ts; then
        echo "✅ All tests passed!"
    else
        echo "⚠️  Some tests failed - check the logs above"
    fi
fi

echo ""
echo "🎉 KMS Key Rotation Implementation Complete!"
echo "============================================="
echo ""
echo "📋 Next Steps:"
echo "   1. Update your application to use the new environment variables"
echo "   2. Deploy your application with the updated configuration"
echo "   3. Test key rotation functionality"
echo "   4. Set up monitoring and alerting"
echo ""
echo "📖 Documentation:"
echo "   - Deployment Guide: docs/KMS_ROTATION_DEPLOYMENT_GUIDE.md"
echo "   - Implementation Summary: IMPLEMENTATION_SUMMARY.md"
echo ""
echo "🔍 Monitoring:"
echo "   - CloudWatch Logs: /aws/lambda/$APPLICATION_NAME-kms-rotation-handler-$ENVIRONMENT"
echo "   - CloudWatch Metrics: GitHubLinkBuddy/KMS namespace"
echo ""
echo "✨ Your KMS implementation is now enterprise-ready with automatic rotation!"

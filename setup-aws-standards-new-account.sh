#!/bin/bash

# Function to cleanup failed stacks
cleanup_failed_stacks() {
    local profile=$1
    local region=$2
    
    echo "🧹 Checking for failed stacks that need cleanup..."
    
    STACKS=(
        "github-buddy-security-monitoring"
        "github-buddy-mfa-enforcement" 
        "github-buddy-infrastructure"
        "github-buddy-cost-monitoring"
        "github-buddy-pci-compliance"
    )
    
    local cleanup_needed=false
    
    for stack in "${STACKS[@]}"; do
        local stack_status=$(aws cloudformation describe-stacks \
            --stack-name "$stack" \
            --query 'Stacks[0].StackStatus' \
            --output text \
            --region "$region" \
            --profile "$profile" 2>/dev/null || echo "STACK_NOT_EXISTS")
        
        if [[ "$stack_status" == "ROLLBACK_COMPLETE" || "$stack_status" == "CREATE_FAILED" || "$stack_status" == "UPDATE_ROLLBACK_FAILED" ]]; then
            echo "⚠️  Stack $stack is in $stack_status state and needs cleanup"
            cleanup_needed=true
        fi
    done
    
    if $cleanup_needed; then
        echo ""
        read -p "Some stacks are in failed state. Clean them up automatically? (y/n): " AUTO_CLEANUP
        if [[ $AUTO_CLEANUP == "y" ]]; then
            ./cleanup-failed-stacks.sh "$profile" "$region"
        else
            echo "❌ Please run './cleanup-failed-stacks.sh $profile $region' manually before proceeding"
            exit 1
        fi
    fi
}

# Set your AWS profile and configuration
read -p "Enter your AWS profile name for the new account: " AWS_PROFILE
read -p "Enter your alert email address: " ALERT_EMAIL
read -p "Enter AWS region (default: us-east-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}
read -p "Deploy PCI DSS infrastructure? (y/n, default: n): " DEPLOY_PCI
DEPLOY_PCI=${DEPLOY_PCI:-n}

# Check and cleanup failed stacks
cleanup_failed_stacks "$AWS_PROFILE" "$AWS_REGION"

echo "Deploying AWS World-Class Standards Framework..."
echo "=============================================="
echo "Profile: $AWS_PROFILE"
echo "Region: $AWS_REGION"
echo "Email: $ALERT_EMAIL"
echo "PCI DSS: $DEPLOY_PCI"
echo "=============================================="

# Generate deployment timestamp (shorter format)
DEPLOYMENT_TIMESTAMP=$(date +%m%d%H%M)

# 1. Security Monitoring
echo "Deploying Security Monitoring..."
aws cloudformation deploy \
  --template-file deploy/aws/cloudtrail-monitoring.yml \
  --stack-name github-buddy-security-monitoring \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides AlertEmail=$ALERT_EMAIL DeploymentTimestamp=$DEPLOYMENT_TIMESTAMP \
  --region $AWS_REGION \
  --profile $AWS_PROFILE

# 2. MFA Enforcement
echo "Deploying MFA Enforcement..."
aws cloudformation deploy \
  --template-file deploy/aws/mfa-enforcement-template.yml \
  --stack-name github-buddy-mfa-enforcement \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameter-overrides Environment=production OrganizationName=github-link-buddy \
  --region $AWS_REGION \
  --profile $AWS_PROFILE

# 3. Main Infrastructure
echo "Deploying Main Infrastructure..."
aws cloudformation deploy \
  --template-file deploy/aws/multi-az-infrastructure-template.yml \
  --stack-name github-buddy-infrastructure \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    Environment=production \
    AlertEmail=$ALERT_EMAIL \
  --region $AWS_REGION \
  --profile $AWS_PROFILE

# 4. Cost Monitoring
echo "Deploying Cost Monitoring..."
aws cloudformation deploy \
  --template-file deploy/aws/cost-monitoring-dashboard.yml \
  --stack-name github-buddy-cost-monitoring \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameter-overrides AlertEmailAddress=$ALERT_EMAIL DeploymentTimestamp=$DEPLOYMENT_TIMESTAMP \
  --region $AWS_REGION \
  --profile $AWS_PROFILE

# 5. Optional PCI DSS Infrastructure
if [[ $DEPLOY_PCI == "y" ]]; then
  echo "Deploying PCI DSS Infrastructure..."
  aws cloudformation deploy \
    --template-file deploy/aws/pci-dss-infrastructure.yaml \
    --stack-name github-buddy-pci-compliance \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --parameter-overrides Environment=production DeploymentTimestamp=$DEPLOYMENT_TIMESTAMP \
    --region $AWS_REGION \
    --profile $AWS_PROFILE
fi

# Run initial security checks
echo "Running Security Audits..."
if [ -f "dist/scripts/security/iam-policy-auditor.js" ]; then
  node dist/scripts/security/iam-policy-auditor.js --profile $AWS_PROFILE || echo "⚠️  Security audit completed with warnings"
fi

if [ -f "scripts/security/root-account-security-check.sh" ]; then
  AWS_PROFILE=$AWS_PROFILE ./scripts/security/root-account-security-check.sh || echo "⚠️  Root account check completed with warnings"
fi

echo "🎉 AWS World-Class Standards Framework Deployment Complete!"
echo "========================================================="
echo "Next Steps:"
echo "1. Review the generated reports in the 'reports/' directory"
echo "2. Configure GitHub Actions secrets for automated deployments"
echo "3. Set up monitoring dashboards in AWS CloudWatch"
echo "4. Schedule regular security audits and cost reviews"
echo "5. Test disaster recovery procedures"

echo "Quick Commands:"
echo "• Security audit: node dist/scripts/security/iam-policy-auditor.js --profile $AWS_PROFILE"
echo "• Root check: AWS_PROFILE=$AWS_PROFILE ./scripts/security/root-account-security-check.sh"
echo "• Cost optimization: node dist/scripts/cost-optimization/comprehensive-cost-optimizer.js --profile $AWS_PROFILE --dry-run"

echo "Documentation:"
echo "• Full documentation: AWS-WORLD-CLASS-STANDARDS-IMPLEMENTATION.md"
echo "• CloudWatch dashboards: https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:"

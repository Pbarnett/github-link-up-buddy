#!/bin/bash

# Script to cleanup failed CloudFormation stacks before redeployment
# Usage: ./cleanup-failed-stacks.sh [AWS_PROFILE] [AWS_REGION]

AWS_PROFILE=${1:-default}
AWS_REGION=${2:-us-east-1}

echo "🧹 Cleaning up failed CloudFormation stacks..."
echo "Profile: $AWS_PROFILE"
echo "Region: $AWS_REGION"
echo "=========================================="

# List of stacks that might need cleanup
STACKS=(
    "github-buddy-security-monitoring"
    "github-buddy-mfa-enforcement" 
    "github-buddy-infrastructure"
    "github-buddy-cost-monitoring"
    "github-buddy-pci-compliance"
)

# Function to check and delete stack if in failed state
cleanup_stack() {
    local stack_name=$1
    echo "Checking stack: $stack_name"
    
    # Get stack status
    local stack_status=$(aws cloudformation describe-stacks \
        --stack-name "$stack_name" \
        --query 'Stacks[0].StackStatus' \
        --output text \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE" 2>/dev/null || echo "STACK_NOT_EXISTS")
    
    if [[ "$stack_status" == "ROLLBACK_COMPLETE" || "$stack_status" == "CREATE_FAILED" || "$stack_status" == "UPDATE_ROLLBACK_FAILED" ]]; then
        echo "  📋 Stack $stack_name is in $stack_status state - deleting..."
        aws cloudformation delete-stack \
            --stack-name "$stack_name" \
            --region "$AWS_REGION" \
            --profile "$AWS_PROFILE"
        
        echo "  ⏳ Waiting for stack deletion to complete..."
        aws cloudformation wait stack-delete-complete \
            --stack-name "$stack_name" \
            --region "$AWS_REGION" \
            --profile "$AWS_PROFILE"
        
        echo "  ✅ Stack $stack_name deleted successfully"
    elif [[ "$stack_status" == "STACK_NOT_EXISTS" ]]; then
        echo "  ℹ️  Stack $stack_name does not exist - nothing to clean up"
    else
        echo "  ✅ Stack $stack_name is in $stack_status state - no cleanup needed"
    fi
    echo ""
}

# Check AWS credentials
if ! aws sts get-caller-identity --profile "$AWS_PROFILE" >/dev/null 2>&1; then
    echo "❌ AWS credentials not configured or invalid for profile: $AWS_PROFILE"
    echo "Please configure AWS credentials using 'aws configure --profile $AWS_PROFILE'"
    exit 1
fi

# Cleanup each stack
for stack in "${STACKS[@]}"; do
    cleanup_stack "$stack"
done

echo "🎉 Cleanup completed!"
echo ""
echo "You can now run the deployment script:"
echo "./setup-aws-standards-new-account.sh"

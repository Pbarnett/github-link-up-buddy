#!/bin/bash

# AWS CloudFormation Deployment Script
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REGION="us-east-1"
ALERT_EMAIL=""

# Logging function
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")  echo -e "${GREEN}[INFO]${NC}  $timestamp - $message" ;;
        "WARN")  echo -e "${YELLOW}[WARN]${NC}  $timestamp - $message" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} $timestamp - $message" ;;
        "DEBUG") echo -e "${BLUE}[DEBUG]${NC} $timestamp - $message" ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    log INFO "Checking prerequisites..."
    
    if ! command -v aws &> /dev/null; then
        log ERROR "AWS CLI not found. Please install AWS CLI first."
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        log ERROR "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    log INFO "Prerequisites check passed"
}

# Get user input
get_user_input() {
    log INFO "Configuration Setup"
    
    read -p "Enter your alert email address: " ALERT_EMAIL
    if [[ ! "$ALERT_EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        log ERROR "Invalid email address format"
        exit 1
    fi
    
    read -p "Enter AWS region (default: us-east-1): " input_region
    REGION=${input_region:-us-east-1}
    
    # Display configuration
    echo
    log INFO "Configuration Summary:"
    log INFO "Alert Email: $ALERT_EMAIL"
    log INFO "AWS Region: $REGION"
    log INFO "Account ID: $(aws sts get-caller-identity --query Account --output text)"
    
    read -p "Continue with deployment? (y/n): " continue_deployment
    if [[ "$continue_deployment" != "y" ]]; then
        log INFO "Deployment cancelled."
        exit 0
    fi
}

# Deploy CloudFormation template
deploy_template() {
    local template_file=$1
    local stack_name=$2
    local params="$3"
    
    log INFO "Deploying $template_file as stack $stack_name..."
    
    if aws cloudformation describe-stacks --stack-name "$stack_name" --region "$REGION" &> /dev/null; then
        log INFO "Stack $stack_name exists, updating..."
        operation="update"
    else
        log INFO "Stack $stack_name does not exist, creating..."
        operation="create"
    fi
    
    # Execute deployment
    if aws cloudformation deploy \
        --template-file "$template_file" \
        --stack-name "$stack_name" \
        --parameter-overrides $params \
        --capabilities CAPABILITY_NAMED_IAM \
        --region "$REGION"; then
        log INFO "Successfully deployed $stack_name"
    else
        log ERROR "Failed to deploy $stack_name"
        return 1
    fi
}

# Main deployment function
main() {
    log INFO "🚀 AWS CloudFormation Deployment Script"
    log INFO "========================================"
    
    check_prerequisites
    get_user_input
    
    # Deploy AWS Secrets template if it exists
    if [[ -f "$SCRIPT_DIR/deploy/aws-secrets-setup.yml" ]]; then
        log INFO "Deploying AWS Secrets setup..."
        deploy_template \
            "$SCRIPT_DIR/deploy/aws-secrets-setup.yml" \
            "parker-flight-aws-secrets" \
            "Environment=production AlertEmail=$ALERT_EMAIL"
    else
        log WARN "AWS Secrets template not found at $SCRIPT_DIR/deploy/aws-secrets-setup.yml"
    fi
    
    log INFO "✅ Deployment completed successfully!"
    log INFO "You can check the stacks in the AWS Console:"
    log INFO "https://console.aws.amazon.com/cloudformation/home?region=$REGION"
}

# Run main function
main "$@"

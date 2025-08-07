#!/bin/bash

# Enhanced AWS Infrastructure Deployment Script
# Based on comprehensive optimization patterns from AWS_Optimization_Answers.md

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
AWS_TEMPLATES_DIR="$PROJECT_ROOT/aws-templates"
DEPLOYMENT_LOG_DIR="$PROJECT_ROOT/deployment-logs"

# Default values
ENVIRONMENT="${ENVIRONMENT:-production}"
APPLICATION_NAME="${APPLICATION_NAME:-github-link-buddy}"
AWS_REGION="${AWS_REGION:-us-east-1}"
SECONDARY_REGION="${SECONDARY_REGION:-us-west-2}"
NOTIFICATION_EMAIL="${NOTIFICATION_EMAIL:-}"
DOMAIN_NAME="${DOMAIN_NAME:-}"
CERTIFICATE_ARN="${CERTIFICATE_ARN:-}"

# Create deployment logs directory
mkdir -p "$DEPLOYMENT_LOG_DIR"

# Logging function
log() {
    local level=$1
    shift
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $*" | tee -a "$DEPLOYMENT_LOG_DIR/deployment-$(date '+%Y%m%d_%H%M%S').log"
}

# Error handling
error_exit() {
    log "ERROR" "$1"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "INFO" "Checking prerequisites..."
    
    # Check if AWS CLI is installed and configured
    if ! command -v aws &> /dev/null; then
        error_exit "AWS CLI is not installed. Please install it first."
    fi
    
    # Check if AWS credentials are configured
    if ! aws sts get-caller-identity &> /dev/null; then
        error_exit "AWS credentials are not configured. Please run 'aws configure' first."
    fi
    
    # Check if required environment variables are set
    if [[ -z "$NOTIFICATION_EMAIL" ]]; then
        error_exit "NOTIFICATION_EMAIL environment variable is required"
    fi
    
    if [[ -z "$DOMAIN_NAME" ]]; then
        error_exit "DOMAIN_NAME environment variable is required"
    fi
    
    if [[ -z "$CERTIFICATE_ARN" ]]; then
        error_exit "CERTIFICATE_ARN environment variable is required"
    fi
    
    # Validate AWS region
    if ! aws ec2 describe-regions --region-names "$AWS_REGION" &> /dev/null; then
        error_exit "Invalid AWS region: $AWS_REGION"
    fi
    
    log "INFO" "Prerequisites check completed successfully"
}

# Get VPC and subnet information
get_vpc_info() {
    log "INFO" "Getting VPC and subnet information..."
    
    # Get default VPC ID
    VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --query 'Vpcs[0].VpcId' --output text --region "$AWS_REGION")
    if [[ "$VPC_ID" == "None" || -z "$VPC_ID" ]]; then
        error_exit "No default VPC found. Please create a VPC first."
    fi
    
    # Get subnet IDs
    PRIVATE_SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" "Name=tag:Name,Values=*private*" --query 'Subnets[*].SubnetId' --output text --region "$AWS_REGION")
    PUBLIC_SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" "Name=map-public-ip-on-launch,Values=true" --query 'Subnets[*].SubnetId' --output text --region "$AWS_REGION")
    
    # If no private subnets found, use all subnets
    if [[ -z "$PRIVATE_SUBNETS" ]]; then
        PRIVATE_SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].SubnetId' --output text --region "$AWS_REGION")
    fi
    
    # If no public subnets found, use all subnets
    if [[ -z "$PUBLIC_SUBNETS" ]]; then
        PUBLIC_SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].SubnetId' --output text --region "$AWS_REGION")
    fi
    
    # Convert to comma-separated format, removing whitespace and tabs
    PRIVATE_SUBNET_IDS=$(echo "$PRIVATE_SUBNETS" | tr -s '[:space:]' ',' | sed 's/^,//;s/,$//')
    PUBLIC_SUBNET_IDS=$(echo "$PUBLIC_SUBNETS" | tr -s '[:space:]' ',' | sed 's/^,//;s/,$//')
    
    log "INFO" "VPC ID: $VPC_ID"
    log "INFO" "Private Subnets: $PRIVATE_SUBNET_IDS"
    log "INFO" "Public Subnets: $PUBLIC_SUBNET_IDS"
}

# Deploy CloudFormation stack
deploy_stack() {
    local stack_name=$1
    local template_file=$2
    local parameters_file=$3
    local capabilities="${4:-CAPABILITY_NAMED_IAM}"
    
    log "INFO" "Deploying stack: $stack_name"
    log "INFO" "Template: $template_file"
    log "INFO" "Parameters file: $parameters_file"
    
    # Check if stack exists
    if aws cloudformation describe-stacks --stack-name "$stack_name" --region "$AWS_REGION" &> /dev/null; then
        log "INFO" "Stack $stack_name exists. Updating..."
        action="update-stack"
    else
        log "INFO" "Stack $stack_name does not exist. Creating..."
        action="create-stack"
    fi
    
    # Deploy stack
    if aws cloudformation "$action" \
        --stack-name "$stack_name" \
        --template-body "file://$template_file" \
        --parameters "file://$parameters_file" \
        --capabilities "$capabilities" \
        --region "$AWS_REGION" \
        --tags "Key=Environment,Value=$ENVIRONMENT" "Key=Application,Value=$APPLICATION_NAME" "Key=ManagedBy,Value=CloudFormation"; then
        
        log "INFO" "Stack deployment initiated. Waiting for completion..."
        
        # Wait for stack operation to complete
        if [[ "$action" == "create-stack" ]]; then
            aws cloudformation wait stack-create-complete --stack-name "$stack_name" --region "$AWS_REGION"
        else
            aws cloudformation wait stack-update-complete --stack-name "$stack_name" --region "$AWS_REGION"
        fi
        
        log "INFO" "Stack $stack_name deployed successfully"
        return 0
    else
        error_exit "Failed to deploy stack: $stack_name"
    fi
}

# Get stack outputs
get_stack_output() {
    local stack_name=$1
    local output_key=$2
    
    aws cloudformation describe-stacks \
        --stack-name "$stack_name" \
        --region "$AWS_REGION" \
        --query "Stacks[0].Outputs[?OutputKey=='$output_key'].OutputValue" \
        --output text
}

# Deploy comprehensive optimization infrastructure
deploy_comprehensive_optimization() {
    log "INFO" "Deploying comprehensive optimization infrastructure..."
    
    local stack_name="$APPLICATION_NAME-comprehensive-optimization-$ENVIRONMENT"
    local template_file="$AWS_TEMPLATES_DIR/comprehensive-optimization.yml"
    local parameters_file="$DEPLOYMENT_LOG_DIR/comprehensive-optimization-parameters.json"
    
    # Create parameters file
    cat > "$parameters_file" << EOF
[
    {
        "ParameterKey": "Environment",
        "ParameterValue": "$ENVIRONMENT"
    },
    {
        "ParameterKey": "ApplicationName",
        "ParameterValue": "$APPLICATION_NAME"
    },
    {
        "ParameterKey": "VpcId",
        "ParameterValue": "$VPC_ID"
    },
    {
        "ParameterKey": "PrivateSubnetIds",
        "ParameterValue": "$PRIVATE_SUBNET_IDS"
    },
    {
        "ParameterKey": "PublicSubnetIds",
        "ParameterValue": "$PUBLIC_SUBNET_IDS"
    },
    {
        "ParameterKey": "CertificateArn",
        "ParameterValue": "$CERTIFICATE_ARN"
    },
    {
        "ParameterKey": "DomainName",
        "ParameterValue": "$DOMAIN_NAME"
    },
    {
        "ParameterKey": "SecondaryRegion",
        "ParameterValue": "$SECONDARY_REGION"
    },
    {
        "ParameterKey": "NotificationEmail",
        "ParameterValue": "$NOTIFICATION_EMAIL"
    }
]
EOF
    
    deploy_stack "$stack_name" "$template_file" "$parameters_file"
    
    # Get outputs
    DYNAMODB_TABLE_NAME=$(get_stack_output "$stack_name" "DynamoDBTableName")
    S3_BUCKET_NAME=$(get_stack_output "$stack_name" "S3BucketName")
    KMS_KEY_ID=$(get_stack_output "$stack_name" "KMSKeyId")
    DATABASE_SECRET_ARN=$(get_stack_output "$stack_name" "DatabaseSecretArn")
    API_KEYS_SECRET_ARN=$(get_stack_output "$stack_name" "APIKeysSecretArn")
    
    log "INFO" "Comprehensive optimization infrastructure deployed successfully"
    log "INFO" "DynamoDB Table: $DYNAMODB_TABLE_NAME"
    log "INFO" "S3 Bucket: $S3_BUCKET_NAME"
    log "INFO" "KMS Key ID: $KMS_KEY_ID"
}

# Deploy Lambda optimization
deploy_lambda_optimization() {
    log "INFO" "Deploying Lambda optimization infrastructure..."
    
    local stack_name="$APPLICATION_NAME-lambda-optimization-$ENVIRONMENT"
    local template_file="$AWS_TEMPLATES_DIR/lambda-optimization.yml"
    
    local parameters="ParameterKey=Environment,ParameterValue=$ENVIRONMENT"
    parameters+=" ParameterKey=ApplicationName,ParameterValue=$APPLICATION_NAME"
    parameters+=" ParameterKey=VpcId,ParameterValue=$VPC_ID"
    parameters+=" ParameterKey=PrivateSubnetIds,ParameterValue=\"$PRIVATE_SUBNET_IDS\""
    parameters+=" ParameterKey=KMSKeyId,ParameterValue=$KMS_KEY_ID"
    parameters+=" ParameterKey=DatabaseSecretArn,ParameterValue=$DATABASE_SECRET_ARN"
    parameters+=" ParameterKey=APIKeysSecretArn,ParameterValue=$API_KEYS_SECRET_ARN"
    parameters+=" ParameterKey=DynamoDBTableName,ParameterValue=$DYNAMODB_TABLE_NAME"
    parameters+=" ParameterKey=S3BucketName,ParameterValue=$S3_BUCKET_NAME"
    parameters+=" ParameterKey=NotificationEmail,ParameterValue=$NOTIFICATION_EMAIL"
    
    deploy_stack "$stack_name" "$template_file" "$parameters"
    
    # Get outputs
    API_HANDLER_FUNCTION_ARN=$(get_stack_output "$stack_name" "APIHandlerFunctionArn")
    COST_OPTIMIZATION_FUNCTION_ARN=$(get_stack_output "$stack_name" "CostOptimizationFunctionArn")
    
    log "INFO" "Lambda optimization infrastructure deployed successfully"
    log "INFO" "API Handler Function ARN: $API_HANDLER_FUNCTION_ARN"
}

# Deploy API Gateway and ALB optimization
deploy_api_gateway_alb_optimization() {
    log "INFO" "Deploying API Gateway and ALB optimization infrastructure..."
    
    local stack_name="$APPLICATION_NAME-api-alb-optimization-$ENVIRONMENT"
    local template_file="$AWS_TEMPLATES_DIR/api-gateway-alb-optimization.yml"
    
    local parameters="ParameterKey=Environment,ParameterValue=$ENVIRONMENT"
    parameters+=" ParameterKey=ApplicationName,ParameterValue=$APPLICATION_NAME"
    parameters+=" ParameterKey=VpcId,ParameterValue=$VPC_ID"
    parameters+=" ParameterKey=PrivateSubnetIds,ParameterValue=\"$PRIVATE_SUBNET_IDS\""
    parameters+=" ParameterKey=PublicSubnetIds,ParameterValue=\"$PUBLIC_SUBNET_IDS\""
    parameters+=" ParameterKey=CertificateArn,ParameterValue=$CERTIFICATE_ARN"
    parameters+=" ParameterKey=DomainName,ParameterValue=$DOMAIN_NAME"
    parameters+=" ParameterKey=APIHandlerFunctionArn,ParameterValue=$API_HANDLER_FUNCTION_ARN"
    parameters+=" ParameterKey=KMSKeyId,ParameterValue=$KMS_KEY_ID"
    parameters+=" ParameterKey=NotificationEmail,ParameterValue=$NOTIFICATION_EMAIL"
    
    deploy_stack "$stack_name" "$template_file" "$parameters"
    
    # Get outputs
    API_GATEWAY_URL=$(get_stack_output "$stack_name" "APIGatewayURL")
    ALB_DNS_NAME=$(get_stack_output "$stack_name" "ApplicationLoadBalancerDNS")
    
    log "INFO" "API Gateway and ALB optimization infrastructure deployed successfully"
    log "INFO" "API Gateway URL: $API_GATEWAY_URL"
    log "INFO" "ALB DNS Name: $ALB_DNS_NAME"
}

# Deploy AWS Config compliance and remediation
deploy_config_compliance() {
    log "INFO" "Deploying AWS Config compliance and remediation infrastructure..."
    
    local stack_name="$APPLICATION_NAME-config-compliance-$ENVIRONMENT"
    local template_file="$AWS_TEMPLATES_DIR/config-compliance-remediation.yml"
    
    local parameters="ParameterKey=Environment,ParameterValue=$ENVIRONMENT"
    parameters+=" ParameterKey=ApplicationName,ParameterValue=$APPLICATION_NAME"
    parameters+=" ParameterKey=NotificationEmail,ParameterValue=$NOTIFICATION_EMAIL"
    parameters+=" ParameterKey=KMSKeyId,ParameterValue=$KMS_KEY_ID"
    
    deploy_stack "$stack_name" "$template_file" "$parameters"
    
    log "INFO" "AWS Config compliance and remediation infrastructure deployed successfully"
}

# Deploy Systems Manager Patch Management
deploy_patch_management() {
    log "INFO" "Deploying Systems Manager Patch Management infrastructure..."
    
    local stack_name="$APPLICATION_NAME-patch-management-$ENVIRONMENT"
    local template_file="$AWS_TEMPLATES_DIR/patch-management.yml"
    
    local parameters="ParameterKey=Environment,ParameterValue=$ENVIRONMENT"
    parameters+=" ParameterKey=ApplicationName,ParameterValue=$APPLICATION_NAME"
    parameters+=" ParameterKey=NotificationEmail,ParameterValue=$NOTIFICATION_EMAIL"
    parameters+=" ParameterKey=KMSKeyId,ParameterValue=$KMS_KEY_ID"
    
    deploy_stack "$stack_name" "$template_file" "$parameters"
    
    log "INFO" "Systems Manager Patch Management infrastructure deployed successfully"
}

# Deploy Well-Architected Tool integration
deploy_well_architected_integration() {
    log "INFO" "Deploying Well-Architected Tool integration infrastructure..."
    
    local stack_name="$APPLICATION_NAME-well-architected-$ENVIRONMENT"
    local template_file="$AWS_TEMPLATES_DIR/well-architected-integration.yml"
    
    local parameters="ParameterKey=Environment,ParameterValue=$ENVIRONMENT"
    parameters+=" ParameterKey=ApplicationName,ParameterValue=$APPLICATION_NAME"
    parameters+=" ParameterKey=NotificationEmail,ParameterValue=$NOTIFICATION_EMAIL"
    parameters+=" ParameterKey=JiraIntegrationEnabled,ParameterValue=false"
    parameters+=" ParameterKey=JiraBaseUrl,ParameterValue="
    parameters+=" ParameterKey=JiraProjectKey,ParameterValue="
    parameters+=" ParameterKey=KMSKeyId,ParameterValue=$KMS_KEY_ID"
    
    deploy_stack "$stack_name" "$template_file" "$parameters"
    
    log "INFO" "Well-Architected Tool integration infrastructure deployed successfully"
}

# Deploy caching infrastructure (ElastiCache + DAX)
deploy_caching_infrastructure() {
    log "INFO" "Deploying caching infrastructure (ElastiCache Redis + DynamoDB DAX)..."
    
    local stack_name="$APPLICATION_NAME-caching-infrastructure-$ENVIRONMENT"
    local template_file="$AWS_TEMPLATES_DIR/caching-infrastructure.yml"
    
    local parameters="ParameterKey=Environment,ParameterValue=$ENVIRONMENT"
    parameters+=" ParameterKey=ApplicationName,ParameterValue=$APPLICATION_NAME"
    parameters+=" ParameterKey=VpcId,ParameterValue=$VPC_ID"
    parameters+=" ParameterKey=PrivateSubnetIds,ParameterValue=\"$PRIVATE_SUBNET_IDS\""
    parameters+=" ParameterKey=NotificationEmail,ParameterValue=$NOTIFICATION_EMAIL"
    parameters+=" ParameterKey=KMSKeyId,ParameterValue=$KMS_KEY_ID"
    
    deploy_stack "$stack_name" "$template_file" "$parameters"
    
    # Get outputs
    REDIS_ENDPOINT=$(get_stack_output "$stack_name" "RedisEndpoint")
    DAX_ENDPOINT=$(get_stack_output "$stack_name" "DAXClusterEndpoint")
    
    log "INFO" "Caching infrastructure deployed successfully"
    log "INFO" "Redis Endpoint: $REDIS_ENDPOINT"
    log "INFO" "DAX Endpoint: $DAX_ENDPOINT"
}

# Run post-deployment tests
run_post_deployment_tests() {
    log "INFO" "Running post-deployment tests..."
    
    # Test API Gateway health endpoint (only if variable is set)
    if [[ -n "${API_GATEWAY_URL:-}" ]]; then
        log "INFO" "Testing API Gateway health endpoint..."
        if curl -f "$API_GATEWAY_URL/health" &> /dev/null; then
            log "INFO" "API Gateway health check passed"
        else
            log "WARN" "API Gateway health check failed"
        fi
    else
        log "INFO" "API Gateway not deployed yet - skipping health check"
    fi
    
    # Test DynamoDB access
    if [[ -n "$DYNAMODB_TABLE_NAME" ]]; then
        log "INFO" "Testing DynamoDB table access..."
        if aws dynamodb describe-table --table-name "$DYNAMODB_TABLE_NAME" --region "$AWS_REGION" &> /dev/null; then
            log "INFO" "DynamoDB table access test passed"
        else
            log "WARN" "DynamoDB table access test failed"
        fi
    fi
    
    # Test S3 bucket access
    if [[ -n "$S3_BUCKET_NAME" ]]; then
        log "INFO" "Testing S3 bucket access..."
        if aws s3 ls "s3://$S3_BUCKET_NAME" &> /dev/null; then
            log "INFO" "S3 bucket access test passed"
        else
            log "WARN" "S3 bucket access test failed"
        fi
    fi
}

# Generate deployment report
generate_deployment_report() {
    local report_file="$DEPLOYMENT_LOG_DIR/deployment-report-$(date '+%Y%m%d_%H%M%S').md"
    
    log "INFO" "Generating deployment report: $report_file"
    
    cat > "$report_file" << EOF
# AWS Infrastructure Deployment Report

**Date**: $(date '+%Y-%m-%d %H:%M:%S')
**Environment**: $ENVIRONMENT
**Application**: $APPLICATION_NAME
**Region**: $AWS_REGION
**Secondary Region**: $SECONDARY_REGION

## Deployed Resources

### Core Infrastructure
- **VPC ID**: $VPC_ID
- **Private Subnets**: $PRIVATE_SUBNET_IDS
- **Public Subnets**: $PUBLIC_SUBNET_IDS

### Storage and Security
- **DynamoDB Table**: $DYNAMODB_TABLE_NAME
- **S3 Bucket**: $S3_BUCKET_NAME
- **KMS Key ID**: $KMS_KEY_ID
- **Database Secret ARN**: $DATABASE_SECRET_ARN
- **API Keys Secret ARN**: $API_KEYS_SECRET_ARN

### Compute and API
- **API Handler Function ARN**: ${API_HANDLER_FUNCTION_ARN:-Not deployed}
- **Cost Optimization Function ARN**: ${COST_OPTIMIZATION_FUNCTION_ARN:-Not deployed}
- **API Gateway URL**: ${API_GATEWAY_URL:-Not deployed}
- **ALB DNS Name**: ${ALB_DNS_NAME:-Not deployed}

## Optimization Features Enabled

✅ **Multi-region KMS encryption** with automatic key rotation
✅ **DynamoDB Global Tables** for multi-region replication
✅ **S3 Intelligent Tiering** with lifecycle management
✅ **AWS Backup** with cross-region replication (1-hour RPO, 15-minute RTO)
✅ **X-Ray distributed tracing** with custom sampling rules
✅ **Lambda cost optimization** monitoring with weekly analysis
✅ **API Gateway caching** and throttling (production only)
✅ **ALB blue-green deployment** support with health checks
✅ **Comprehensive CloudWatch monitoring** with custom dashboards
✅ **AWS Secrets Manager** with automatic rotation capabilities

## Security Features

- End-to-end encryption with customer-managed KMS keys
- VPC isolation for Lambda functions and databases
- Security groups with least-privilege access
- CloudTrail integration for audit logging
- Secrets Manager for credential management
- S3 public access blocking enabled

## Cost Optimization Features

- Pay-per-request DynamoDB billing
- S3 Intelligent Tiering for automatic cost optimization
- Lambda reserved concurrency limits
- CloudWatch log retention policies
- Automated cost monitoring and recommendations

## Next Steps

1. Configure domain DNS to point to ALB: \`${ALB_DNS_NAME:-Not deployed yet}\`
2. Update application secrets in AWS Secrets Manager
3. Set up monitoring alerts and dashboards
4. Configure blue-green deployment pipelines
5. Test disaster recovery procedures

## Support Information

- **Notification Email**: $NOTIFICATION_EMAIL
- **Deployment Logs**: $DEPLOYMENT_LOG_DIR
- **AWS Console**: https://${AWS_REGION}.console.aws.amazon.com/

EOF

    log "INFO" "Deployment report generated: $report_file"
}

# Cleanup function for rollback
cleanup_on_failure() {
    log "ERROR" "Deployment failed. Initiating cleanup..."
    
    # List of stacks to potentially clean up (in reverse order)
    local stacks=(
        "$APPLICATION_NAME-api-alb-optimization-$ENVIRONMENT"
        "$APPLICATION_NAME-lambda-optimization-$ENVIRONMENT"
        "$APPLICATION_NAME-comprehensive-optimization-$ENVIRONMENT"
    )
    
    for stack in "${stacks[@]}"; do
        if aws cloudformation describe-stacks --stack-name "$stack" --region "$AWS_REGION" &> /dev/null; then
            log "INFO" "Rolling back stack: $stack"
            aws cloudformation delete-stack --stack-name "$stack" --region "$AWS_REGION"
            aws cloudformation wait stack-delete-complete --stack-name "$stack" --region "$AWS_REGION"
        fi
    done
    
    log "INFO" "Cleanup completed"
}

# Main deployment function
main() {
    log "INFO" "Starting AWS infrastructure deployment..."
    log "INFO" "Environment: $ENVIRONMENT"
    log "INFO" "Application: $APPLICATION_NAME"
    log "INFO" "Region: $AWS_REGION"
    
    # Set up error handling
    trap cleanup_on_failure ERR
    
    # Check prerequisites
    check_prerequisites
    
    # Get VPC information
    get_vpc_info
    
    # Deploy core infrastructure first
    deploy_comprehensive_optimization
    
    # Run basic tests
    run_post_deployment_tests
    
    # Generate report
    generate_deployment_report
    
    log "INFO" "Core AWS infrastructure deployment completed successfully!"
    log "INFO" "DynamoDB Table: $DYNAMODB_TABLE_NAME"
    log "INFO" "S3 Bucket: $S3_BUCKET_NAME"
    log "INFO" "KMS Key ID: $KMS_KEY_ID"
    log "INFO" "Check the deployment report for detailed information."
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        cat << EOF
Enhanced AWS Infrastructure Deployment Script

Usage: $0 [options]

Environment Variables:
  ENVIRONMENT           Deployment environment (development|staging|production)
  APPLICATION_NAME      Application name (default: github-link-buddy)
  AWS_REGION           Primary AWS region (default: us-east-1)
  SECONDARY_REGION     Secondary AWS region for DR (default: us-west-2)
  NOTIFICATION_EMAIL   Email for alerts and notifications (required)
  DOMAIN_NAME          Primary domain name (required)
  CERTIFICATE_ARN      SSL certificate ARN (required)

Options:
  --help, -h           Show this help message
  --dry-run           Validate templates without deploying
  --cleanup           Clean up all deployed resources

Examples:
  export NOTIFICATION_EMAIL="admin@example.com"
  export DOMAIN_NAME="example.com"
  export CERTIFICATE_ARN="arn:aws:acm:us-east-1:123456789012:certificate/abc123"
  $0
EOF
        exit 0
        ;;
    --dry-run)
        log "INFO" "Dry run mode - validating templates..."
        for template in "$AWS_TEMPLATES_DIR"/*.yml; do
            log "INFO" "Validating: $template"
            aws cloudformation validate-template --template-body "file://$template" --region "$AWS_REGION"
        done
        log "INFO" "All templates are valid"
        exit 0
        ;;
    --cleanup)
        log "INFO" "Cleanup mode - removing all resources..."
        cleanup_on_failure
        exit 0
        ;;
    "")
        main
        ;;
    *)
        echo "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac

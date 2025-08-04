#!/bin/bash

###############################################################################
# CloudTrail Enablement Script
# 
# AWS World-Class Standards Compliance - Enable CloudTrail for monitoring
# 
# This script creates and configures:
# - Multi-region CloudTrail
# - S3 bucket for log storage
# - CloudWatch integration
# - SNS notifications for security events
###############################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ORGANIZATION_NAME="github-link-buddy"
ENVIRONMENT="production"
AWS_REGION=${AWS_REGION:-"us-west-2"}
TRAIL_NAME="${ORGANIZATION_NAME}-security-trail-${ENVIRONMENT}"
BUCKET_NAME="${ORGANIZATION_NAME}-cloudtrail-logs-${ENVIRONMENT}-$(date +%s)"
LOG_GROUP_NAME="/aws/cloudtrail/${ORGANIZATION_NAME}/${ENVIRONMENT}"
SNS_TOPIC_NAME="${ORGANIZATION_NAME}-cloudtrail-alerts-${ENVIRONMENT}"

echo -e "${BLUE}🔍 AWS CloudTrail Setup for Security Monitoring${NC}"
echo "========================================================"
echo "Trail Name: $TRAIL_NAME"
echo "Bucket Name: $BUCKET_NAME"
echo "Log Group: $LOG_GROUP_NAME"
echo "Region: $AWS_REGION"
echo ""

# Function to check if resource exists
check_resource_exists() {
    local resource_type="$1"
    local resource_name="$2"
    
    case "$resource_type" in
        "trail")
            aws cloudtrail describe-trails --trail-name-list "$resource_name" &>/dev/null
            ;;
        "bucket")
            aws s3api head-bucket --bucket "$resource_name" &>/dev/null
            ;;
        "log-group")
            aws logs describe-log-groups --log-group-name-prefix "$resource_name" --query "logGroups[?logGroupName=='$resource_name']" --output text | grep -q "$resource_name"
            ;;
        "sns-topic")
            aws sns get-topic-attributes --topic-arn "arn:aws:sns:${AWS_REGION}:$(aws sts get-caller-identity --query Account --output text):$resource_name" &>/dev/null
            ;;
    esac
}

# Step 1: Create S3 bucket for CloudTrail logs
create_cloudtrail_bucket() {
    echo -e "${BLUE}1. Creating S3 bucket for CloudTrail logs...${NC}"
    
    if check_resource_exists "bucket" "$BUCKET_NAME"; then
        echo -e "${YELLOW}S3 bucket $BUCKET_NAME already exists${NC}"
        return 0
    fi
    
    # Create bucket
    if [ "$AWS_REGION" = "us-east-1" ]; then
        aws s3api create-bucket --bucket "$BUCKET_NAME"
    else
        aws s3api create-bucket --bucket "$BUCKET_NAME" --create-bucket-configuration LocationConstraint="$AWS_REGION"
    fi
    
    # Enable versioning
    aws s3api put-bucket-versioning --bucket "$BUCKET_NAME" --versioning-configuration Status=Enabled
    
    # Enable server-side encryption
    aws s3api put-bucket-encryption --bucket "$BUCKET_NAME" --server-side-encryption-configuration '{
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                },
                "BucketKeyEnabled": true
            }
        ]
    }'
    
    # Block public access
    aws s3api put-public-access-block --bucket "$BUCKET_NAME" --public-access-block-configuration '{
        "BlockPublicAcls": true,
        "IgnorePublicAcls": true,
        "BlockPublicPolicy": true,
        "RestrictPublicBuckets": true
    }'
    
    # Create bucket policy for CloudTrail
    local account_id
    account_id=$(aws sts get-caller-identity --query Account --output text)
    
    cat > cloudtrail-bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AWSCloudTrailAclCheck",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudtrail.amazonaws.com"
            },
            "Action": "s3:GetBucketAcl",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}"
        },
        {
            "Sid": "AWSCloudTrailWrite",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudtrail.amazonaws.com"
            },
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/AWSLogs/${account_id}/*",
            "Condition": {
                "StringEquals": {
                    "s3:x-amz-acl": "bucket-owner-full-control"
                }
            }
        }
    ]
}
EOF
    
    aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file://cloudtrail-bucket-policy.json
    rm cloudtrail-bucket-policy.json
    
    echo -e "${GREEN}✅ S3 bucket $BUCKET_NAME created successfully${NC}"
}

# Step 2: Create CloudWatch Log Group
create_log_group() {
    echo -e "${BLUE}2. Creating CloudWatch Log Group...${NC}"
    
    if check_resource_exists "log-group" "$LOG_GROUP_NAME"; then
        echo -e "${YELLOW}Log group $LOG_GROUP_NAME already exists${NC}"
        return 0
    fi
    
    aws logs create-log-group --log-group-name "$LOG_GROUP_NAME"
    aws logs put-retention-policy --log-group-name "$LOG_GROUP_NAME" --retention-in-days 365
    
    echo -e "${GREEN}✅ CloudWatch Log Group $LOG_GROUP_NAME created${NC}"
}

# Step 3: Create IAM Role for CloudTrail CloudWatch integration
create_cloudtrail_role() {
    echo -e "${BLUE}3. Creating IAM role for CloudTrail...${NC}"
    
    local role_name="${ORGANIZATION_NAME}-CloudTrail-CloudWatch-Role-${ENVIRONMENT}"
    
    # Check if role exists
    if aws iam get-role --role-name "$role_name" &>/dev/null; then
        echo -e "${YELLOW}IAM role $role_name already exists${NC}"
        echo "$role_name"
        return 0
    fi
    
    # Create trust policy
    cat > cloudtrail-trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudtrail.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF
    
    # Create role
    aws iam create-role \
        --role-name "$role_name" \
        --assume-role-policy-document file://cloudtrail-trust-policy.json \
        --description "Role for CloudTrail to deliver logs to CloudWatch"
    
    # Create policy for CloudWatch Logs
    cat > cloudtrail-logs-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:PutLogEvents",
                "logs:CreateLogGroup",
                "logs:CreateLogStream"
            ],
            "Resource": "arn:aws:logs:${AWS_REGION}:$(aws sts get-caller-identity --query Account --output text):log-group:${LOG_GROUP_NAME}:*"
        }
    ]
}
EOF
    
    # Attach policy to role
    aws iam put-role-policy \
        --role-name "$role_name" \
        --policy-name "CloudTrailLogsPolicy" \
        --policy-document file://cloudtrail-logs-policy.json
    
    # Clean up temp files
    rm cloudtrail-trust-policy.json cloudtrail-logs-policy.json
    
    echo -e "${GREEN}✅ IAM role $role_name created${NC}"
    echo "$role_name"
}

# Step 4: Create SNS topic for alerts
create_sns_topic() {
    echo -e "${BLUE}4. Creating SNS topic for CloudTrail alerts...${NC}"
    
    local account_id
    account_id=$(aws sts get-caller-identity --query Account --output text)
    local topic_arn="arn:aws:sns:${AWS_REGION}:${account_id}:${SNS_TOPIC_NAME}"
    
    if check_resource_exists "sns-topic" "$SNS_TOPIC_NAME"; then
        echo -e "${YELLOW}SNS topic $SNS_TOPIC_NAME already exists${NC}"
        echo "$topic_arn"
        return 0
    fi
    
    # Create SNS topic
    topic_arn=$(aws sns create-topic --name "$SNS_TOPIC_NAME" --query TopicArn --output text)
    
    # Set topic policy to allow CloudTrail to publish
    cat > sns-topic-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AWSCloudTrailSNSPolicy",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudtrail.amazonaws.com"
            },
            "Action": "SNS:Publish",
            "Resource": "$topic_arn"
        }
    ]
}
EOF
    
    aws sns set-topic-attributes \
        --topic-arn "$topic_arn" \
        --attribute-name Policy \
        --attribute-value file://sns-topic-policy.json
    
    rm sns-topic-policy.json
    
    echo -e "${GREEN}✅ SNS topic created: $topic_arn${NC}"
    echo "$topic_arn"
}

# Step 5: Create CloudTrail
create_cloudtrail() {
    echo -e "${BLUE}5. Creating CloudTrail...${NC}"
    
    if check_resource_exists "trail" "$TRAIL_NAME"; then
        echo -e "${YELLOW}CloudTrail $TRAIL_NAME already exists${NC}"
        return 0
    fi
    
    local role_name
    local topic_arn
    local account_id
    
    role_name=$(create_cloudtrail_role)
    topic_arn=$(create_sns_topic)
    account_id=$(aws sts get-caller-identity --query Account --output text)
    
    # Create CloudTrail
    aws cloudtrail create-trail \
        --name "$TRAIL_NAME" \
        --s3-bucket-name "$BUCKET_NAME" \
        --include-global-service-events \
        --is-multi-region-trail \
        --enable-log-file-validation \
        --cloud-watch-logs-log-group-arn "arn:aws:logs:${AWS_REGION}:${account_id}:log-group:${LOG_GROUP_NAME}:*" \
        --cloud-watch-logs-role-arn "arn:aws:iam::${account_id}:role/${role_name}" \
        --sns-topic-name "$SNS_TOPIC_NAME"
    
    # Configure event selectors for comprehensive logging
    aws cloudtrail put-event-selectors \
        --trail-name "$TRAIL_NAME" \
        --event-selectors '[
            {
                "ReadWriteType": "All",
                "IncludeManagementEvents": true,
                "DataResources": [
                    {
                        "Type": "AWS::S3::Object",
                        "Values": ["arn:aws:s3:::*/*"]
                    },
                    {
                        "Type": "AWS::S3::Bucket",
                        "Values": ["arn:aws:s3:::*"]
                    }
                ]
            }
        ]'
    
    # Start logging
    aws cloudtrail start-logging --name "$TRAIL_NAME"
    
    echo -e "${GREEN}✅ CloudTrail $TRAIL_NAME created and started${NC}"
}

# Step 6: Create CloudWatch alarms for security events
create_security_alarms() {
    echo -e "${BLUE}6. Creating CloudWatch alarms for security events...${NC}"
    
    local account_id
    account_id=$(aws sts get-caller-identity --query Account --output text)
    local topic_arn="arn:aws:sns:${AWS_REGION}:${account_id}:${SNS_TOPIC_NAME}"
    
    # Root account usage alarm
    aws logs put-metric-filter \
        --log-group-name "$LOG_GROUP_NAME" \
        --filter-name "RootAccountUsage" \
        --filter-pattern '{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }' \
        --metric-transformations \
            metricName=RootAccountUsageCount,metricNamespace="${ORGANIZATION_NAME}/Security",metricValue=1
    
    aws cloudwatch put-metric-alarm \
        --alarm-name "${ORGANIZATION_NAME}-Root-Account-Usage-${ENVIRONMENT}" \
        --alarm-description "Alarm for root account usage" \
        --metric-name RootAccountUsageCount \
        --namespace "${ORGANIZATION_NAME}/Security" \
        --statistic Sum \
        --period 300 \
        --threshold 1 \
        --comparison-operator GreaterThanOrEqualToThreshold \
        --evaluation-periods 1 \
        --alarm-actions "$topic_arn"
    
    # Failed console logins alarm
    aws logs put-metric-filter \
        --log-group-name "$LOG_GROUP_NAME" \
        --filter-name "ConsoleLoginFailures" \
        --filter-pattern '{ ($.eventName = ConsoleLogin) && ($.errorMessage EXISTS) }' \
        --metric-transformations \
            metricName=ConsoleLoginFailureCount,metricNamespace="${ORGANIZATION_NAME}/Security",metricValue=1
    
    aws cloudwatch put-metric-alarm \
        --alarm-name "${ORGANIZATION_NAME}-Console-Login-Failures-${ENVIRONMENT}" \
        --alarm-description "Alarm for failed console logins" \
        --metric-name ConsoleLoginFailureCount \
        --namespace "${ORGANIZATION_NAME}/Security" \
        --statistic Sum \
        --period 300 \
        --threshold 3 \
        --comparison-operator GreaterThanOrEqualToThreshold \
        --evaluation-periods 1 \
        --alarm-actions "$topic_arn"
    
    # IAM policy changes alarm
    aws logs put-metric-filter \
        --log-group-name "$LOG_GROUP_NAME" \
        --filter-name "IAMPolicyChanges" \
        --filter-pattern '{ ($.eventName=DeleteGroupPolicy) || ($.eventName=DeleteRolePolicy) || ($.eventName=DeleteUserPolicy) || ($.eventName=PutGroupPolicy) || ($.eventName=PutRolePolicy) || ($.eventName=PutUserPolicy) || ($.eventName=CreatePolicy) || ($.eventName=DeletePolicy) || ($.eventName=CreatePolicyVersion) || ($.eventName=DeletePolicyVersion) || ($.eventName=AttachRolePolicy) || ($.eventName=DetachRolePolicy) || ($.eventName=AttachUserPolicy) || ($.eventName=DetachUserPolicy) || ($.eventName=AttachGroupPolicy) || ($.eventName=DetachGroupPolicy) }' \
        --metric-transformations \
            metricName=IAMPolicyChangeCount,metricNamespace="${ORGANIZATION_NAME}/Security",metricValue=1
    
    aws cloudwatch put-metric-alarm \
        --alarm-name "${ORGANIZATION_NAME}-IAM-Policy-Changes-${ENVIRONMENT}" \
        --alarm-description "Alarm for IAM policy changes" \
        --metric-name IAMPolicyChangeCount \
        --namespace "${ORGANIZATION_NAME}/Security" \
        --statistic Sum \
        --period 300 \
        --threshold 1 \
        --comparison-operator GreaterThanOrEqualToThreshold \
        --evaluation-periods 1 \
        --alarm-actions "$topic_arn"
    
    # Unauthorized API calls alarm
    aws logs put-metric-filter \
        --log-group-name "$LOG_GROUP_NAME" \
        --filter-name "UnauthorizedAPICalls" \
        --filter-pattern '{ ($.errorCode = "*UnauthorizedOperation") || ($.errorCode = "AccessDenied*") }' \
        --metric-transformations \
            metricName=UnauthorizedAPICallCount,metricNamespace="${ORGANIZATION_NAME}/Security",metricValue=1
    
    aws cloudwatch put-metric-alarm \
        --alarm-name "${ORGANIZATION_NAME}-Unauthorized-API-Calls-${ENVIRONMENT}" \
        --alarm-description "Alarm for unauthorized API calls" \
        --metric-name UnauthorizedAPICallCount \
        --namespace "${ORGANIZATION_NAME}/Security" \
        --statistic Sum \
        --period 300 \
        --threshold 10 \
        --comparison-operator GreaterThanOrEqualToThreshold \
        --evaluation-periods 1 \
        --alarm-actions "$topic_arn"
    
    echo -e "${GREEN}✅ Security alarms created${NC}"
}

# Step 7: Verify CloudTrail setup
verify_setup() {
    echo -e "${BLUE}7. Verifying CloudTrail setup...${NC}"
    
    # Check trail status
    local trail_status
    trail_status=$(aws cloudtrail get-trail-status --name "$TRAIL_NAME" --query IsLogging --output text)
    
    if [ "$trail_status" = "True" ]; then
        echo -e "${GREEN}✅ CloudTrail is logging${NC}"
    else
        echo -e "${RED}❌ CloudTrail is not logging${NC}"
        return 1
    fi
    
    # Check recent events
    local recent_events
    recent_events=$(aws logs describe-log-streams --log-group-name "$LOG_GROUP_NAME" --query 'logStreams[0].logStreamName' --output text 2>/dev/null || echo "")
    
    if [ -n "$recent_events" ] && [ "$recent_events" != "None" ]; then
        echo -e "${GREEN}✅ CloudWatch Logs integration working${NC}"
    else
        echo -e "${YELLOW}⚠️  CloudWatch Logs integration may take a few minutes to show data${NC}"
    fi
    
    echo -e "${GREEN}✅ CloudTrail setup verification completed${NC}"
}

# Step 8: Generate summary report
generate_report() {
    echo -e "${BLUE}8. Generating setup report...${NC}"
    
    local account_id
    account_id=$(aws sts get-caller-identity --query Account --output text)
    local topic_arn="arn:aws:sns:${AWS_REGION}:${account_id}:${SNS_TOPIC_NAME}"
    
    cat > cloudtrail-setup-report.json << EOF
{
    "setup_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "organization": "$ORGANIZATION_NAME",
    "environment": "$ENVIRONMENT",
    "aws_region": "$AWS_REGION",
    "aws_account_id": "$account_id",
    "resources_created": {
        "cloudtrail_name": "$TRAIL_NAME",
        "s3_bucket": "$BUCKET_NAME",
        "log_group": "$LOG_GROUP_NAME",
        "sns_topic_arn": "$topic_arn",
        "iam_role": "${ORGANIZATION_NAME}-CloudTrail-CloudWatch-Role-${ENVIRONMENT}"
    },
    "features_enabled": {
        "multi_region_trail": true,
        "log_file_validation": true,
        "cloudwatch_integration": true,
        "sns_notifications": true,
        "data_events": true,
        "management_events": true
    },
    "security_alarms": [
        "Root Account Usage",
        "Console Login Failures", 
        "IAM Policy Changes",
        "Unauthorized API Calls"
    ],
    "next_steps": [
        "Subscribe to SNS topic for alerts: $topic_arn",
        "Configure email notifications for security team",
        "Review CloudWatch dashboard for monitoring",
        "Test alert mechanisms",
        "Set up log analysis and SIEM integration"
    ]
}
EOF
    
    echo -e "${GREEN}✅ Setup report saved to: cloudtrail-setup-report.json${NC}"
    echo ""
    echo -e "${BLUE}📋 Setup Summary:${NC}"
    echo -e "CloudTrail: $TRAIL_NAME"
    echo -e "S3 Bucket: $BUCKET_NAME"
    echo -e "Log Group: $LOG_GROUP_NAME"
    echo -e "SNS Topic: $topic_arn"
    echo ""
    echo -e "${YELLOW}🔔 Next Steps:${NC}"
    echo -e "1. Subscribe to SNS topic for security alerts:"
    echo -e "   aws sns subscribe --topic-arn $topic_arn --protocol email --notification-endpoint your-email@domain.com"
    echo -e "2. Configure your SIEM or log analysis tools to consume CloudTrail logs"
    echo -e "3. Review and customize security alarms based on your requirements"
    echo -e "4. Test the alerting mechanism by performing a test action"
}

# Main execution
main() {
    echo -e "${BLUE}Starting CloudTrail setup for security monitoring...${NC}"
    echo ""
    
    # Check AWS CLI and credentials
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI not found. Please install AWS CLI.${NC}"
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure'.${NC}"
        exit 1
    fi
    
    # Execute setup steps
    create_cloudtrail_bucket
    create_log_group
    create_cloudtrail
    create_security_alarms
    verify_setup
    generate_report
    
    echo ""
    echo -e "${GREEN}🎉 CloudTrail setup completed successfully!${NC}"
    echo -e "${BLUE}Your AWS environment now has comprehensive security monitoring enabled.${NC}"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --organization-name)
            ORGANIZATION_NAME="$2"
            shift 2
            ;;
        --environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --region)
            AWS_REGION="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --organization-name NAME    Organization name (default: github-link-buddy)"
            echo "  --environment ENV           Environment (default: production)"
            echo "  --region REGION            AWS region (default: us-west-2)"
            echo "  --help                     Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

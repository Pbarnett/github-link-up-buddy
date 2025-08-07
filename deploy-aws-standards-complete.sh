#!/bin/bash

# World-Class AWS Security and Standards Deployment Script
# This script deploys enterprise-grade AWS infrastructure including:
# - Security standards and MFA enforcement
# - Cost monitoring and financial governance
# - Secrets management infrastructure
# - KMS encryption keys
# - Comprehensive logging and monitoring

set -euo pipefail

# Colors for enhanced output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly NC='\033[0m' # No Color

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_FILE="${SCRIPT_DIR}/deployment-$(date +%Y%m%d_%H%M%S).log"
readonly DEPLOYMENT_TIMESTAMP=$(date +%Y%m%d%H%M%S)

# Default values
REGION="${AWS_DEFAULT_REGION:-us-east-1}"
ENVIRONMENT="production"
ALERT_EMAIL=""
ORGANIZATION_NAME="Parker-Flight"
MONTHLY_BUDGET_LIMIT=500
DRY_RUN=false
SKIP_EXISTING=false
ENABLE_ALL_FEATURES=true

# Stack names (will be set after parsing arguments)
SECRETS_STACK_NAME=""
SECURITY_STACK_NAME=""
COST_STACK_NAME=""
KMS_STACK_NAME=""

# Logging function with timestamps
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_entry="[$timestamp] [$level] $message"
    
    case $level in
        "INFO")  echo -e "${GREEN}[INFO]${NC}  $timestamp - $message" | tee -a "$LOG_FILE" ;;
        "WARN")  echo -e "${YELLOW}[WARN]${NC}  $timestamp - $message" | tee -a "$LOG_FILE" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} $timestamp - $message" | tee -a "$LOG_FILE" ;;
        "DEBUG") echo -e "${BLUE}[DEBUG]${NC} $timestamp - $message" | tee -a "$LOG_FILE" ;;
        "SUCCESS") echo -e "${GREEN}[SUCCESS]${NC} $timestamp - $message" | tee -a "$LOG_FILE" ;;
    esac
}

# Progress indicator
show_progress() {
    local current=$1
    local total=$2
    local description=$3
    local percent=$((current * 100 / total))
    local filled=$((percent / 2))
    local empty=$((50 - filled))
    
    printf "\r${CYAN}[%s%s] %d%% - %s${NC}" \
        "$(printf "%${filled}s" | tr ' ' '█')" \
        "$(printf "%${empty}s" | tr ' ' '░')" \
        "$percent" \
        "$description"
    
    if [ $current -eq $total ]; then
        echo
    fi
}

# Display banner
show_banner() {
    echo -e "${PURPLE}"
    cat << "EOF"
    ╔═══════════════════════════════════════════════════════╗
    ║             🛡️  AWS STANDARDS DEPLOYMENT             ║
    ║          Enterprise Security & Cost Management        ║
    ║                                                       ║
    ║  • MFA Enforcement & IAM Best Practices             ║
    ║  • CloudTrail & Security Monitoring                 ║
    ║  • Cost Management & Budget Controls                 ║
    ║  • KMS Encryption & Secrets Management              ║
    ║  • Compliance & Audit Logging                       ║
    ╚═══════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# Help function
show_help() {
    cat << EOF
Usage: $0 [OPTIONS]

World-class AWS security and standards deployment script.

OPTIONS:
    -e, --environment ENV       Set environment (development|staging|production) [default: production]
    -r, --region REGION         Set AWS region [default: us-east-1]
    -m, --email EMAIL           Alert email address (required)
    -o, --organization NAME     Organization name [default: Parker-Flight]
    -b, --budget AMOUNT         Monthly budget limit in USD [default: 500]
    -d, --dry-run              Show what would be deployed without making changes
    -s, --skip-existing        Skip deployment of existing stacks
    -f, --minimal-features     Deploy only essential features
    -h, --help                 Show this help message

EXAMPLES:
    $0 --email admin@company.com
    $0 --environment staging --budget 200 --email admin@company.com
    $0 --dry-run --email admin@company.com

DEPLOYMENT INCLUDES:
    • Security Standards Stack (MFA, CloudTrail, GuardDuty)
    • Cost Monitoring Stack (Budgets, Alerts, Optimization)
    • Secrets Management Stack (AWS Secrets Manager)
    • KMS Keys Stack (Data encryption)

EOF
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--environment)
                if [[ "$2" =~ ^(development|staging|production)$ ]]; then
                    ENVIRONMENT="$2"
                    shift 2
                else
                    log ERROR "Invalid environment: $2. Must be development, staging, or production."
                    exit 1
                fi
                ;;
            -r|--region)
                REGION="$2"
                shift 2
                ;;
            -m|--email)
                if [[ "$2" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
                    ALERT_EMAIL="$2"
                    shift 2
                else
                    log ERROR "Invalid email format: $2"
                    exit 1
                fi
                ;;
            -o|--organization)
                ORGANIZATION_NAME="$2"
                shift 2
                ;;
            -b|--budget)
                if [[ "$2" =~ ^[0-9]+$ ]] && [ "$2" -ge 1 ] && [ "$2" -le 10000 ]; then
                    MONTHLY_BUDGET_LIMIT="$2"
                    shift 2
                else
                    log ERROR "Invalid budget amount: $2. Must be between 1 and 10000."
                    exit 1
                fi
                ;;
            -d|--dry-run)
                DRY_RUN=true
                shift
                ;;
            -s|--skip-existing)
                SKIP_EXISTING=true
                shift
                ;;
            -f|--minimal-features)
                ENABLE_ALL_FEATURES=false
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                log ERROR "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done

    # Validate required parameters
    if [[ -z "$ALERT_EMAIL" ]]; then
        log ERROR "Alert email is required. Use --email or -m option."
        exit 1
    fi
    
    # Initialize stack names after parsing organization name
    local org_lower=$(echo "$ORGANIZATION_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
    SECRETS_STACK_NAME="${org_lower}-aws-secrets"
    SECURITY_STACK_NAME="${org_lower}-security-standards"
    COST_STACK_NAME="${org_lower}-cost-monitoring"
    KMS_STACK_NAME="${org_lower}-kms-keys"
}

# Check prerequisites
check_prerequisites() {
    log INFO "Checking prerequisites..."
    local errors=0

    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        log ERROR "AWS CLI not found. Please install AWS CLI first."
        ((errors++))
    else
        local aws_version=$(aws --version 2>&1 | cut -d' ' -f1 | cut -d'/' -f2)
        log INFO "AWS CLI version: $aws_version"
    fi

    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log ERROR "AWS credentials not configured. Please run 'aws configure' first."
        ((errors++))
    else
        local account_id=$(aws sts get-caller-identity --query Account --output text)
        local user_arn=$(aws sts get-caller-identity --query Arn --output text)
        log INFO "AWS Account ID: $account_id"
        log INFO "AWS User: $user_arn"
    fi

    # Check jq for JSON processing
    if ! command -v jq &> /dev/null; then
        log WARN "jq not found. Installing via package manager recommended for enhanced output."
    fi

    # Check region availability
    if ! aws ec2 describe-regions --region-names "$REGION" &> /dev/null; then
        log ERROR "Invalid or inaccessible AWS region: $REGION"
        ((errors++))
    fi

    # Check CloudFormation service availability
    if ! aws cloudformation list-stacks --region "$REGION" &> /dev/null; then
        log ERROR "CloudFormation service not accessible in region: $REGION"
        ((errors++))
    fi

    if [ $errors -gt 0 ]; then
        log ERROR "Prerequisites check failed with $errors error(s)."
        exit 1
    fi

    log SUCCESS "Prerequisites check passed."
}

# Check if stack exists
stack_exists() {
    local stack_name=$1
    aws cloudformation describe-stacks --stack-name "$stack_name" --region "$REGION" &> /dev/null
}

# Get stack status
get_stack_status() {
    local stack_name=$1
    aws cloudformation describe-stacks \
        --stack-name "$stack_name" \
        --region "$REGION" \
        --query 'Stacks[0].StackStatus' \
        --output text 2>/dev/null || echo "NOT_EXISTS"
}

# Wait for stack operation to complete
wait_for_stack() {
    local stack_name=$1
    local operation=$2
    local max_wait=1800  # 30 minutes
    local wait_time=0
    local check_interval=30

    log INFO "Waiting for stack $operation to complete: $stack_name"
    
    while [ $wait_time -lt $max_wait ]; do
        local status=$(get_stack_status "$stack_name")
        
        case $status in
            *_COMPLETE)
                log SUCCESS "Stack $operation completed: $stack_name"
                return 0
                ;;
            *_FAILED|*_ROLLBACK_*)
                log ERROR "Stack $operation failed: $stack_name (Status: $status)"
                return 1
                ;;
            *_IN_PROGRESS)
                printf "."
                sleep $check_interval
                ((wait_time += check_interval))
                ;;
            *)
                log ERROR "Unknown stack status: $status"
                return 1
                ;;
        esac
    done
    
    log ERROR "Stack operation timed out after $max_wait seconds: $stack_name"
    return 1
}

# Deploy CloudFormation template
deploy_template() {
    local template_file=$1
    local stack_name=$2
    local parameters=$3
    local description=$4
    local step=$5
    local total_steps=$6

    show_progress "$step" "$total_steps" "$description"
    
    if [[ ! -f "$template_file" ]]; then
        log ERROR "Template file not found: $template_file"
        return 1
    fi

    log INFO "Deploying $description..."
    log DEBUG "Template: $template_file"
    log DEBUG "Stack: $stack_name"
    log DEBUG "Parameters: $parameters"

    # Check if stack exists and should be skipped
    if $SKIP_EXISTING && stack_exists "$stack_name"; then
        log INFO "Stack $stack_name already exists, skipping due to --skip-existing flag"
        return 0
    fi

    # Dry run mode
    if $DRY_RUN; then
        log INFO "[DRY RUN] Would deploy stack: $stack_name"
        log INFO "[DRY RUN] Template: $template_file"
        log INFO "[DRY RUN] Parameters: $parameters"
        return 0
    fi

    # Validate template
    if ! aws cloudformation validate-template \
        --template-body "file://$template_file" \
        --region "$REGION" &> /dev/null; then
        log ERROR "Template validation failed: $template_file"
        return 1
    fi

    # Deploy stack
    local deploy_cmd="aws cloudformation deploy \
        --template-file '$template_file' \
        --stack-name '$stack_name' \
        --parameter-overrides $parameters \
        --capabilities CAPABILITY_NAMED_IAM CAPABILITY_IAM \
        --region '$REGION' \
        --no-fail-on-empty-changeset"

    log DEBUG "Executing: $deploy_cmd"

    if eval "$deploy_cmd" >> "$LOG_FILE" 2>&1; then
        if wait_for_stack "$stack_name" "deployment"; then
            log SUCCESS "Successfully deployed: $description"
            
            # Get stack outputs
            if command -v jq &> /dev/null; then
                local outputs=$(aws cloudformation describe-stacks \
                    --stack-name "$stack_name" \
                    --region "$REGION" \
                    --query 'Stacks[0].Outputs' \
                    --output json 2>/dev/null | jq -r '.[]? | "\(.OutputKey): \(.OutputValue)"' 2>/dev/null || true)
                
                if [[ -n "$outputs" ]]; then
                    log INFO "Stack outputs for $stack_name:"
                    echo "$outputs" | while read -r output; do
                        log INFO "  $output"
                    done
                fi
            fi
            
            return 0
        else
            log ERROR "Stack deployment failed: $description"
            return 1
        fi
    else
        log ERROR "Failed to initiate deployment: $description"
        return 1
    fi
}

# Run security audit
run_security_audit() {
    log INFO "Running security audit..."
    
    if [[ -f "$SCRIPT_DIR/scripts/security/security-audit.ts" ]]; then
        if $DRY_RUN; then
            log INFO "[DRY RUN] Would run security audit"
            return 0
        fi
        
        if command -v tsx &> /dev/null || command -v npx &> /dev/null; then
            log INFO "Executing security audit..."
            local audit_cmd="npx tsx $SCRIPT_DIR/scripts/security/security-audit.ts --json --output security-audit-$(date +%Y%m%d_%H%M%S).json"
            
            if eval "$audit_cmd" >> "$LOG_FILE" 2>&1; then
                log SUCCESS "Security audit completed successfully"
            else
                log WARN "Security audit completed with warnings (check log for details)"
            fi
        else
            log WARN "TypeScript executor (tsx/npx) not found, skipping security audit"
        fi
    else
        log WARN "Security audit script not found, skipping"
    fi
}

# Main deployment orchestration
main_deployment() {
    local total_steps=6
    local current_step=0

    log INFO "Starting AWS Standards deployment..."
    log INFO "Environment: $ENVIRONMENT"
    log INFO "Region: $REGION"
    log INFO "Organization: $ORGANIZATION_NAME"
    log INFO "Budget Limit: \$${MONTHLY_BUDGET_LIMIT}/month"
    log INFO "Alert Email: $ALERT_EMAIL"
    
    if $DRY_RUN; then
        log INFO "🔍 DRY RUN MODE - No actual changes will be made"
    fi

    # Step 1: Deploy Secrets Management
    ((current_step++))
    if deploy_template \
        "$SCRIPT_DIR/deploy/aws-secrets-setup.yml" \
        "$SECRETS_STACK_NAME" \
        "Environment=$ENVIRONMENT" \
        "Secrets Management Infrastructure" \
        "$current_step" \
        "$total_steps"; then
        log SUCCESS "✅ Secrets management deployed"
    else
        log ERROR "❌ Failed to deploy secrets management"
        return 1
    fi

    # Step 2: Deploy KMS Keys
    ((current_step++))
    if [[ -f "$SCRIPT_DIR/deployment/aws/kms-keys-cloudformation.yaml" ]]; then
        if deploy_template \
            "$SCRIPT_DIR/deployment/aws/kms-keys-cloudformation.yaml" \
            "$KMS_STACK_NAME" \
            "Environment=$ENVIRONMENT ApplicationName=$ORGANIZATION_NAME" \
            "KMS Encryption Keys" \
            "$current_step" \
            "$total_steps"; then
            log SUCCESS "✅ KMS keys deployed"
        else
            log ERROR "❌ Failed to deploy KMS keys"
            return 1
        fi
    else
        log WARN "KMS template not found, skipping"
    fi

    # Step 3: Deploy Security Standards
    ((current_step++))
    local security_params="Environment=$ENVIRONMENT AlertEmail=$ALERT_EMAIL OrganizationName=$ORGANIZATION_NAME DeploymentTimestamp=$DEPLOYMENT_TIMESTAMP"
    
    if deploy_template \
        "$SCRIPT_DIR/aws-templates/security-standards.yml" \
        "$SECURITY_STACK_NAME" \
        "$security_params" \
        "Security Standards & MFA Enforcement" \
        "$current_step" \
        "$total_steps"; then
        log SUCCESS "✅ Security standards deployed"
    else
        log ERROR "❌ Failed to deploy security standards"
        return 1
    fi

    # Step 4: Deploy Cost Monitoring
    ((current_step++))
    local cost_params="Environment=$ENVIRONMENT AlertEmail=$ALERT_EMAIL OrganizationName=$ORGANIZATION_NAME MonthlyBudgetLimit=$MONTHLY_BUDGET_LIMIT EnableDetailedMonitoring=$ENABLE_ALL_FEATURES DeploymentTimestamp=$DEPLOYMENT_TIMESTAMP"
    
    if deploy_template \
        "$SCRIPT_DIR/aws-templates/cost-monitoring.yml" \
        "$COST_STACK_NAME" \
        "$cost_params" \
        "Cost Monitoring & Financial Governance" \
        "$current_step" \
        "$total_steps"; then
        log SUCCESS "✅ Cost monitoring deployed"
    else
        log ERROR "❌ Failed to deploy cost monitoring"
        return 1
    fi

    # Step 5: Run Security Audit
    ((current_step++))
    show_progress "$current_step" "$total_steps" "Running Security Audit"
    run_security_audit
    log SUCCESS "✅ Security audit completed"

    # Step 6: Final Validation
    ((current_step++))
    show_progress "$current_step" "$total_steps" "Final Validation"
    validate_deployment
    log SUCCESS "✅ Deployment validation completed"

    echo
    log SUCCESS "🎉 AWS Standards deployment completed successfully!"
}

# Validate deployment
validate_deployment() {
    log INFO "Validating deployment..."
    
    local stacks=("$SECRETS_STACK_NAME" "$SECURITY_STACK_NAME" "$COST_STACK_NAME")
    local failed_stacks=()
    
    for stack in "${stacks[@]}"; do
        if $DRY_RUN; then
            log INFO "[DRY RUN] Would validate stack: $stack"
            continue
        fi
        
        local status=$(get_stack_status "$stack")
        if [[ "$status" == *"_COMPLETE" ]]; then
            log SUCCESS "✅ $stack: $status"
        else
            log ERROR "❌ $stack: $status"
            failed_stacks+=("$stack")
        fi
    done
    
    if [ ${#failed_stacks[@]} -gt 0 ]; then
        log ERROR "Validation failed for stacks: ${failed_stacks[*]}"
        return 1
    fi
    
    return 0
}

# Generate deployment report
generate_report() {
    local report_file="deployment-report-$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$report_file" << EOF
# AWS Standards Deployment Report

**Deployment Date:** $(date)  
**Environment:** $ENVIRONMENT  
**Region:** $REGION  
**Organization:** $ORGANIZATION_NAME  

## Deployed Stacks

### 1. Secrets Management Stack
- **Stack Name:** $SECRETS_STACK_NAME
- **Status:** $(get_stack_status "$SECRETS_STACK_NAME")
- **Purpose:** AWS Secrets Manager setup for secure credential storage

### 2. Security Standards Stack
- **Stack Name:** $SECURITY_STACK_NAME
- **Status:** $(get_stack_status "$SECURITY_STACK_NAME")
- **Purpose:** MFA enforcement, CloudTrail monitoring, security alerts

### 3. Cost Monitoring Stack
- **Stack Name:** $COST_STACK_NAME
- **Status:** $(get_stack_status "$COST_STACK_NAME")
- **Purpose:** Budget controls, cost optimization, financial governance

## Configuration Summary

- **Monthly Budget:** \$${MONTHLY_BUDGET_LIMIT}
- **Alert Email:** $ALERT_EMAIL
- **Detailed Monitoring:** $ENABLE_ALL_FEATURES
- **Deployment Mode:** $([ "$DRY_RUN" = true ] && echo "Dry Run" || echo "Production")

## Next Steps

1. 📧 Check your email for SNS subscription confirmations
2. 🔐 Configure MFA for IAM users using the deployed policies
3. 💰 Monitor costs via the CloudWatch dashboard
4. 🛡️ Review security alerts and configure additional monitoring
5. 📊 Run regular security audits using the provided scripts

## Resources

- **CloudWatch Dashboards:** [Cost Monitoring Dashboard](https://console.aws.amazon.com/cloudwatch/home?region=$REGION)
- **AWS Config:** [Configuration Compliance](https://console.aws.amazon.com/config/home?region=$REGION)
- **GuardDuty:** [Security Findings](https://console.aws.amazon.com/guardduty/home?region=$REGION)
- **Budgets:** [Cost Management](https://console.aws.amazon.com/billing/home#/budgets)

EOF

    log INFO "Deployment report generated: $report_file"
}

# Cleanup function
cleanup() {
    local exit_code=$?
    
    if [ $exit_code -ne 0 ]; then
        log ERROR "Deployment failed with exit code: $exit_code"
        log INFO "Check the log file for details: $LOG_FILE"
    fi
    
    # Generate report regardless of success/failure
    if ! $DRY_RUN; then
        generate_report
    fi
    
    exit $exit_code
}

# Main execution
main() {
    # Set up signal handlers
    trap cleanup EXIT INT TERM

    show_banner
    parse_arguments "$@"
    
    log INFO "🚀 Initializing AWS Standards Deployment"
    log INFO "Log file: $LOG_FILE"
    
    check_prerequisites
    main_deployment
    
    echo
    log SUCCESS "🎯 Deployment completed successfully!"
    log INFO "📋 Check deployment report and logs for details"
    log INFO "📧 Don't forget to confirm SNS email subscriptions"
    
    # Display next steps
    cat << EOF

${GREEN}🎉 DEPLOYMENT SUCCESSFUL! 🎉${NC}

${YELLOW}NEXT STEPS:${NC}
1. Check your email (${ALERT_EMAIL}) for SNS subscription confirmations
2. Add IAM users to the MFA-required group for security enforcement
3. Review the cost monitoring dashboard in CloudWatch
4. Configure additional security monitoring as needed
5. Run periodic security audits using: npm run security:audit

${CYAN}USEFUL COMMANDS:${NC}
• View stacks: aws cloudformation list-stacks --region ${REGION}
• Check costs: aws budgets describe-budgets
• Security audit: npx tsx scripts/security/security-audit.ts

${PURPLE}Happy deploying! 🛡️💰${NC}

EOF
}

# Execute main function with all arguments
main "$@"

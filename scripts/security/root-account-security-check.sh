#!/bin/bash

###############################################################################
# Root Account Security Verification Script
# 
# AWS World-Class Standards Compliance Check for Root Account Security
# 
# This script verifies:
# - Root account MFA is enabled
# - No access keys exist for root account
# - Root account usage monitoring is in place
# - Break-glass procedures are documented
###############################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPORT_FILE="root-account-security-report-$(date +%Y%m%d-%H%M%S).json"
CLOUDTRAIL_LOG_GROUP="/aws/cloudtrail/root-account-usage"
ROOT_USAGE_DAYS=30

echo -e "${BLUE}🔐 AWS Root Account Security Verification${NC}"
echo "=================================================="
echo ""

# Function to log results
log_result() {
    local check_name="$1"
    local status="$2"
    local details="$3"
    local recommendation="$4"
    
    echo -e "Check: ${check_name}"
    if [ "$status" == "PASS" ]; then
        echo -e "Status: ${GREEN}✅ PASS${NC}"
    elif [ "$status" == "FAIL" ]; then
        echo -e "Status: ${RED}❌ FAIL${NC}"
    else
        echo -e "Status: ${YELLOW}⚠️  WARNING${NC}"
    fi
    echo -e "Details: ${details}"
    if [ -n "$recommendation" ]; then
        echo -e "Recommendation: ${YELLOW}${recommendation}${NC}"
    fi
    echo ""
}

# Initialize report
init_report() {
    cat > "$REPORT_FILE" << EOF
{
  "audit_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "audit_type": "root_account_security",
  "account_id": "$(aws sts get-caller-identity --query 'Account' --output text 2>/dev/null || echo 'unknown')",
  "checks": []
}
EOF
}

# Add check result to report
add_to_report() {
    local check_name="$1"
    local status="$2" 
    local details="$3"
    local recommendation="$4"
    
    # Create temporary file with new check
    cat > temp_check.json << EOF
{
  "check_name": "$check_name",
  "status": "$status",
  "details": "$details",
  "recommendation": "$recommendation",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

    # Add to main report using jq
    if command -v jq &> /dev/null; then
        jq ".checks += [$(cat temp_check.json)]" "$REPORT_FILE" > temp_report.json
        mv temp_report.json "$REPORT_FILE"
        rm temp_check.json
    fi
}

# Check 1: Account MFA Status
check_account_mfa() {
    echo -e "${BLUE}1. Checking Account MFA Status...${NC}"
    
    local mfa_enabled
    mfa_enabled=$(aws iam get-account-summary --query 'SummaryMap.AccountMFAEnabled' --output text 2>/dev/null)
    
    if [ "$mfa_enabled" == "1" ]; then
        log_result "Account MFA Status" "PASS" "MFA is enabled for the account" ""
        add_to_report "Account MFA Status" "PASS" "MFA is enabled for the account" ""
    else
        log_result "Account MFA Status" "FAIL" "MFA is not enabled for the account" "Enable MFA for the root account immediately"
        add_to_report "Account MFA Status" "FAIL" "MFA is not enabled for the account" "Enable MFA for the root account immediately"
    fi
}

# Check 2: Root Account Access Keys
check_root_access_keys() {
    echo -e "${BLUE}2. Checking Root Account Access Keys...${NC}"
    
    # Note: This will return an error if trying to list access keys for root user
    # We check if the error indicates no access keys exist
    local key_check_result
    key_check_result=$(aws iam list-access-keys 2>&1 || true)
    
    if echo "$key_check_result" | grep -q "Cannot call ListAccessKeys on the root user"; then
        # This is expected - means we're checking from a non-root user
        log_result "Root Access Key Check" "WARNING" "Cannot verify root access keys from IAM user account" "Verify manually that root account has no access keys"
        add_to_report "Root Access Key Check" "WARNING" "Cannot verify root access keys from IAM user account" "Verify manually that root account has no access keys"
    elif echo "$key_check_result" | grep -q "AccessKeyMetadata"; then
        # Access keys found
        local key_count
        key_count=$(echo "$key_check_result" | jq '.AccessKeyMetadata | length' 2>/dev/null || echo "unknown")
        log_result "Root Access Key Check" "FAIL" "Found $key_count access keys for current user" "If this is root account, delete all access keys immediately"
        add_to_report "Root Access Key Check" "FAIL" "Found $key_count access keys for current user" "If this is root account, delete all access keys immediately"
    else
        log_result "Root Access Key Check" "PASS" "No access keys found for current user" ""
        add_to_report "Root Access Key Check" "PASS" "No access keys found for current user" ""
    fi
}

# Check 3: CloudTrail Configuration for Root Monitoring
check_cloudtrail_monitoring() {
    echo -e "${BLUE}3. Checking CloudTrail Root Account Monitoring...${NC}"
    
    # Check if CloudTrail is enabled
    local trails
    trails=$(aws cloudtrail describe-trails --query 'trailList[?IsLogging==`true`]' --output json 2>/dev/null)
    
    if [ "$trails" == "[]" ] || [ -z "$trails" ]; then
        log_result "CloudTrail Monitoring" "FAIL" "No active CloudTrail found" "Enable CloudTrail to monitor root account activity"
        add_to_report "CloudTrail Monitoring" "FAIL" "No active CloudTrail found" "Enable CloudTrail to monitor root account activity"
        return
    fi
    
    # Check if trails are configured properly
    local trail_count
    trail_count=$(echo "$trails" | jq 'length' 2>/dev/null || echo "0")
    
    if [ "$trail_count" -gt 0 ]; then
        log_result "CloudTrail Monitoring" "PASS" "Found $trail_count active CloudTrail(s)" "Ensure CloudWatch integration for real-time monitoring"
        add_to_report "CloudTrail Monitoring" "PASS" "Found $trail_count active CloudTrail(s)" "Ensure CloudWatch integration for real-time monitoring"
    else
        log_result "CloudTrail Monitoring" "FAIL" "CloudTrail configuration issue" "Review CloudTrail configuration"
        add_to_report "CloudTrail Monitoring" "FAIL" "CloudTrail configuration issue" "Review CloudTrail configuration"
    fi
}

# Check 4: Recent Root Account Usage
check_root_usage() {
    echo -e "${BLUE}4. Checking Recent Root Account Usage...${NC}"
    
    # Check CloudTrail logs for root usage in the last 30 days
    local start_time
    # Use macOS compatible date command
    if [[ "$OSTYPE" == "darwin"* ]]; then
        start_time=$(date -v-${ROOT_USAGE_DAYS}d +%s)000
    else
        start_time=$(date -d "$ROOT_USAGE_DAYS days ago" +%s)000
    fi
    
    # Try to check for root usage in CloudTrail
    local root_events
    root_events=$(aws logs filter-log-events \
        --log-group-name "$CLOUDTRAIL_LOG_GROUP" \
        --start-time "$start_time" \
        --filter-pattern '{ $.userIdentity.type = "Root" }' \
        --output json 2>/dev/null || echo '{"events":[]}')
    
    local event_count
    event_count=$(echo "$root_events" | jq '.events | length' 2>/dev/null || echo "0")
    
    if [ "$event_count" -eq 0 ]; then
        log_result "Root Account Usage" "PASS" "No root account usage detected in last $ROOT_USAGE_DAYS days" ""
        add_to_report "Root Account Usage" "PASS" "No root account usage detected in last $ROOT_USAGE_DAYS days" ""
    else
        log_result "Root Account Usage" "WARNING" "Found $event_count root account events in last $ROOT_USAGE_DAYS days" "Review root account usage and ensure it was authorized"
        add_to_report "Root Account Usage" "WARNING" "Found $event_count root account events in last $ROOT_USAGE_DAYS days" "Review root account usage and ensure it was authorized"
    fi
}

# Check 5: Password Policy
check_password_policy() {
    echo -e "${BLUE}5. Checking Account Password Policy...${NC}"
    
    local password_policy
    password_policy=$(aws iam get-account-password-policy --output json 2>/dev/null || echo '{}')
    
    if [ "$password_policy" == '{}' ]; then
        log_result "Password Policy" "FAIL" "No password policy configured" "Configure strong password policy for IAM users"
        add_to_report "Password Policy" "FAIL" "No password policy configured" "Configure strong password policy for IAM users"
        return
    fi
    
    # Check policy strength
    local min_length
    local require_symbols
    local require_numbers
    local require_uppercase
    local require_lowercase
    
    min_length=$(echo "$password_policy" | jq '.PasswordPolicy.MinimumPasswordLength // 0')
    require_symbols=$(echo "$password_policy" | jq '.PasswordPolicy.RequireSymbols // false')
    require_numbers=$(echo "$password_policy" | jq '.PasswordPolicy.RequireNumbers // false')
    require_uppercase=$(echo "$password_policy" | jq '.PasswordPolicy.RequireUppercaseCharacters // false')
    require_lowercase=$(echo "$password_policy" | jq '.PasswordPolicy.RequireLowercaseCharacters // false')
    
    local policy_score=0
    local policy_issues=()
    
    # Check minimum length (should be at least 14 for world-class standards)
    if [ "$min_length" -ge 14 ]; then
        policy_score=$((policy_score + 1))
    else
        policy_issues+=("Minimum length is $min_length (should be 14+)")
    fi
    
    # Check complexity requirements
    [ "$require_symbols" == "true" ] && policy_score=$((policy_score + 1)) || policy_issues+=("Symbols not required")
    [ "$require_numbers" == "true" ] && policy_score=$((policy_score + 1)) || policy_issues+=("Numbers not required")
    [ "$require_uppercase" == "true" ] && policy_score=$((policy_score + 1)) || policy_issues+=("Uppercase not required")
    [ "$require_lowercase" == "true" ] && policy_score=$((policy_score + 1)) || policy_issues+=("Lowercase not required")
    
    if [ $policy_score -eq 5 ]; then
        log_result "Password Policy" "PASS" "Strong password policy configured" ""
        add_to_report "Password Policy" "PASS" "Strong password policy configured" ""
    elif [ $policy_score -ge 3 ]; then
        log_result "Password Policy" "WARNING" "Password policy needs improvement: ${policy_issues[*]}" "Strengthen password policy requirements"
        add_to_report "Password Policy" "WARNING" "Password policy needs improvement: ${policy_issues[*]}" "Strengthen password policy requirements"
    else
        log_result "Password Policy" "FAIL" "Weak password policy: ${policy_issues[*]}" "Implement strong password policy immediately"
        add_to_report "Password Policy" "FAIL" "Weak password policy: ${policy_issues[*]}" "Implement strong password policy immediately"
    fi
}

# Check 6: MFA Devices
check_mfa_devices() {
    echo -e "${BLUE}6. Checking MFA Devices Configuration...${NC}"
    
    local mfa_devices
    mfa_devices=$(aws iam list-virtual-mfa-devices --output json 2>/dev/null || echo '{"VirtualMFADevices":[]}')
    
    local device_count
    device_count=$(echo "$mfa_devices" | jq '.VirtualMFADevices | length' 2>/dev/null || echo "0")
    
    if [ "$device_count" -eq 0 ]; then
        log_result "MFA Devices" "WARNING" "No virtual MFA devices found" "Ensure root account has MFA device configured"
        add_to_report "MFA Devices" "WARNING" "No virtual MFA devices found" "Ensure root account has MFA device configured"
    else
        log_result "MFA Devices" "PASS" "Found $device_count MFA device(s)" "Ensure all devices are properly assigned and active"
        add_to_report "MFA Devices" "PASS" "Found $device_count MFA device(s)" "Ensure all devices are properly assigned and active"
    fi
}

# Generate summary
generate_summary() {
    echo -e "${BLUE}📊 Security Assessment Summary${NC}"
    echo "=================================="
    
    if command -v jq &> /dev/null && [ -f "$REPORT_FILE" ]; then
        local total_checks
        local passed_checks
        local failed_checks
        local warning_checks
        
        total_checks=$(jq '.checks | length' "$REPORT_FILE")
        passed_checks=$(jq '.checks | map(select(.status == "PASS")) | length' "$REPORT_FILE")
        failed_checks=$(jq '.checks | map(select(.status == "FAIL")) | length' "$REPORT_FILE")
        warning_checks=$(jq '.checks | map(select(.status == "WARNING")) | length' "$REPORT_FILE")
        
        echo -e "Total Checks: ${total_checks}"
        echo -e "Passed: ${GREEN}${passed_checks}${NC}"
        echo -e "Failed: ${RED}${failed_checks}${NC}"
        echo -e "Warnings: ${YELLOW}${warning_checks}${NC}"
        echo ""
        
        if [ "$failed_checks" -eq 0 ] && [ "$warning_checks" -eq 0 ]; then
            echo -e "${GREEN}🎉 Excellent! All root account security checks passed.${NC}"
        elif [ "$failed_checks" -eq 0 ]; then
            echo -e "${YELLOW}⚠️  Good security posture with some recommendations.${NC}"
        else
            echo -e "${RED}🚨 Critical security issues found! Immediate action required.${NC}"
        fi
        
        echo ""
        echo -e "📄 Detailed report saved to: ${REPORT_FILE}"
    fi
}

# Create break-glass procedure template
create_breakglass_template() {
    local template_file="root-account-break-glass-procedure.md"
    
    if [ ! -f "$template_file" ]; then
        cat > "$template_file" << 'EOF'
# Root Account Break-Glass Procedure

## When to Use Root Account
The root account should ONLY be used in the following emergency situations:

1. **IAM System Failure**: All IAM users and roles are inaccessible
2. **Account Recovery**: Locked out of all administrative access
3. **Billing Issues**: Cannot access billing information through IAM
4. **Support Cases**: AWS Support requires root account access

## Pre-Emergency Preparation

### Root Account Security
- [ ] Root account has strong unique password
- [ ] MFA is enabled on root account
- [ ] Root account email is monitored
- [ ] No access keys exist for root account
- [ ] Contact information is up to date

### Documentation
- [ ] Root account credentials are stored in secure vault
- [ ] Break-glass procedure is documented and tested
- [ ] Emergency contact list is maintained
- [ ] Incident response team is identified

## Emergency Access Procedure

### Step 1: Authorization
1. Get approval from at least 2 senior team members
2. Document the emergency situation
3. Create incident ticket with justification

### Step 2: Access
1. Retrieve root credentials from secure vault
2. Log all actions taken with root account
3. Use root account for minimum necessary actions only

### Step 3: Post-Emergency
1. Change root account password
2. Review all actions taken during emergency
3. Update IAM policies to prevent future lockouts
4. Document lessons learned
5. Update break-glass procedure if needed

## Monitoring and Alerting

### Real-time Alerts
- Root account login attempts
- Root account API calls
- Password changes
- MFA changes

### Review Process
- Monthly review of root account activity
- Quarterly break-glass procedure testing
- Annual security assessment

## Contact Information

**Primary Emergency Contacts:**
- Security Team Lead: [contact info]
- DevOps Manager: [contact info]
- CTO/Security Officer: [contact info]

**AWS Support:**
- Enterprise Support: [case creation process]
- Emergency Contact: [phone number]

---
Last Updated: $(date +%Y-%m-%d)
Next Review: $(date -d '+3 months' +%Y-%m-%d)
EOF
        
        echo -e "${GREEN}📋 Break-glass procedure template created: ${template_file}${NC}"
        echo -e "${YELLOW}Please customize this template with your organization's specific details.${NC}"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}Starting root account security verification...${NC}"
    echo ""
    
    # Initialize report
    init_report
    
    # Run all checks
    check_account_mfa
    check_root_access_keys
    check_cloudtrail_monitoring
    check_root_usage
    check_password_policy
    check_mfa_devices
    
    # Generate summary
    generate_summary
    
    # Create break-glass template
    create_breakglass_template
    
    echo ""
    echo -e "${BLUE}Root account security verification completed.${NC}"
}

# Check dependencies
check_dependencies() {
    local missing_deps=()
    
    if ! command -v aws &> /dev/null; then
        missing_deps+=("aws")
    fi
    
    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}Warning: jq not found. JSON processing will be limited.${NC}"
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${RED}Missing required dependencies: ${missing_deps[*]}${NC}"
        echo "Please install missing dependencies and try again."
        exit 1
    fi
}

# Check if AWS credentials are configured
check_aws_credentials() {
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}AWS credentials not configured or invalid.${NC}"
        echo "Please configure AWS credentials using 'aws configure' or environment variables."
        exit 1
    fi
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    check_dependencies
    check_aws_credentials
    main "$@"
fi

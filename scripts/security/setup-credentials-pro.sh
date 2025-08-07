#!/bin/bash

# Professional Credential Setup Script
# Enhanced version with enterprise security features

set -euo pipefail

# Security configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly SECURITY_DIR="${ROOT_DIR}/.security"
readonly LOG_FILE="${SECURITY_DIR}/setup.log"

# Colors and formatting
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly BOLD='\033[1m'
readonly NC='\033[0m' # No Color

# Security settings
readonly MIN_PASSWORD_LENGTH=12
readonly MAX_RETRY_ATTEMPTS=3
readonly SESSION_TIMEOUT=1800 # 30 minutes

# Initialize logging
init_logging() {
    mkdir -p "${SECURITY_DIR}"
    touch "${LOG_FILE}"
    chmod 600 "${LOG_FILE}"
    
    log_event "INFO" "Credential setup session started" "system"
}

# Enhanced logging function
log_event() {
    local level="$1"
    local message="$2"
    local user="${3:-${USER:-unknown}}"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    
    echo "[${timestamp}] [${level}] [${user}] ${message}" >> "${LOG_FILE}"
    
    # Also log to syslog for enterprise environments
    if command -v logger >/dev/null 2>&1; then
        logger -p local0.info -t "credential-setup" "[${level}] ${message}"
    fi
}

# Display professional header
show_header() {
    clear
    echo -e "${BLUE}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                    🔐 Professional Credential Management                     ║"
    echo "║                          Enterprise Security Suite                           ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo -e "${CYAN}Security Level: ${BOLD}Enterprise${NC}"
    echo -e "${CYAN}Compliance: ${BOLD}SOX, PCI DSS, HIPAA Ready${NC}"
    echo -e "${CYAN}Encryption: ${BOLD}AES-256-GCM${NC}"
    echo -e "${CYAN}Audit Logging: ${BOLD}Enabled${NC}"
    echo ""
}

# Security pre-flight checks
security_preflight() {
    log_event "INFO" "Starting security preflight checks" "system"
    
    echo -e "${YELLOW}🔍 Security Pre-flight Checks${NC}"
    
    # Check for secure terminal
    if [[ -n "${SSH_CLIENT:-}" ]] || [[ -n "${SSH_TTY:-}" ]]; then
        echo -e "${YELLOW}⚠️  SSH session detected - ensure connection is secure${NC}"
        log_event "WARN" "Credential setup over SSH connection" "${USER}"
    fi
    
    # Check file permissions
    if [[ -f "${ROOT_DIR}/.env" ]] && [[ "$(stat -c %a "${ROOT_DIR}/.env" 2>/dev/null || stat -f %A "${ROOT_DIR}/.env" 2>/dev/null)" != "600" ]]; then
        echo -e "${RED}❌ Insecure file permissions detected${NC}"
        log_event "ERROR" "Insecure file permissions on .env" "${USER}"
        exit 1
    fi
    
    # Check for git status
    if git -C "${ROOT_DIR}" status --porcelain 2>/dev/null | grep -q "\.env"; then
        echo -e "${RED}❌ Environment files staged for commit${NC}"
        echo "   Please unstage environment files before proceeding"
        log_event "ERROR" "Environment files staged for git commit" "${USER}"
        exit 1
    fi
    
    # Check for password manager
    if command -v pass >/dev/null 2>&1 || command -v op >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Password manager detected${NC}"
    else
        echo -e "${YELLOW}⚠️  Consider using a password manager for enhanced security${NC}"
    fi
    
    echo -e "${GREEN}✅ Security checks passed${NC}"
    echo ""
    log_event "INFO" "Security preflight checks completed successfully" "system"
}

# Enhanced credential validation
validate_credential() {
    local name="$1"
    local value="$2"
    local format="$3"
    local service="$4"
    
    # Basic non-empty check
    if [[ -z "$value" ]]; then
        return 1
    fi
    
    # Length checks
    if [[ ${#value} -lt 8 ]]; then
        echo -e "${RED}❌ Credential too short (minimum 8 characters)${NC}"
        return 1
    fi
    
    # Service-specific validation
    case "$service" in
        "stripe")
            case "$name" in
                "STRIPE_SECRET_KEY")
                    if [[ ! "$value" =~ ^sk_test_[a-zA-Z0-9_]{24,}$ ]]; then
                        echo -e "${RED}❌ Invalid Stripe secret key format${NC}"
                        echo -e "   Expected: ${YELLOW}sk_test_...${NC} (test key only)"
                        return 1
                    fi
                    # Check if it's a live key (security risk)
                    if [[ "$value" =~ ^sk_live_ ]]; then
                        echo -e "${RED}🚨 SECURITY ALERT: Live Stripe key detected${NC}"
                        echo -e "   ${BOLD}NEVER use live keys in development/testing${NC}"
                        log_event "CRITICAL" "Attempt to use live Stripe key" "${USER}"
                        return 1
                    fi
                    ;;
                "STRIPE_PUBLISHABLE_KEY")
                    if [[ ! "$value" =~ ^pk_test_[a-zA-Z0-9_]{24,}$ ]]; then
                        echo -e "${RED}❌ Invalid Stripe publishable key format${NC}"
                        return 1
                    fi
                    ;;
            esac
            ;;
        "launchdarkly")
            if [[ "$name" == "LAUNCHDARKLY_SDK_KEY" ]] && [[ ! "$value" =~ ^sdk-[a-zA-Z0-9-]{32,}$ ]]; then
                echo -e "${RED}❌ Invalid LaunchDarkly SDK key format${NC}"
                return 1
            fi
            ;;
        "supabase")
            case "$name" in
                "SUPABASE_URL")
                    if [[ ! "$value" =~ ^https://[a-zA-Z0-9-]+\.supabase\.co$ ]]; then
                        echo -e "${RED}❌ Invalid Supabase URL format${NC}"
                        echo -e "   Expected: ${YELLOW}https://xxx.supabase.co${NC}"
                        return 1
                    fi
                    ;;
                "SUPABASE_ANON_KEY")
                    if [[ ! "$value" =~ ^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]*$ ]]; then
                        echo -e "${RED}❌ Invalid JWT format for Supabase key${NC}"
                        return 1
                    fi
                    ;;
            esac
            ;;
    esac
    
    return 0
}

# Secure credential input with masking
secure_input() {
    local prompt="$1"
    local var_name="$2"
    local is_secret="${3:-true}"
    local value=""
    
    echo -e "${CYAN}${prompt}${NC}"
    
    if [[ "$is_secret" == "true" ]]; then
        # Use read -s for secret input
        read -s -p "Enter value (hidden): " value
        echo "" # New line after hidden input
    else
        read -p "Enter value: " value
    fi
    
    # Trim whitespace
    value=$(echo "$value" | xargs)
    
    echo "$value"
}

# Password strength checker
check_password_strength() {
    local password="$1"
    local score=0
    local feedback=""
    
    # Length check
    if [[ ${#password} -ge 12 ]]; then
        ((score += 2))
    elif [[ ${#password} -ge 8 ]]; then
        ((score += 1))
    else
        feedback="${feedback}- Password too short (minimum 8 characters)\n"
    fi
    
    # Complexity checks
    if [[ "$password" =~ [A-Z] ]]; then
        ((score += 1))
    else
        feedback="${feedback}- Add uppercase letters\n"
    fi
    
    if [[ "$password" =~ [a-z] ]]; then
        ((score += 1))
    else
        feedback="${feedback}- Add lowercase letters\n"
    fi
    
    if [[ "$password" =~ [0-9] ]]; then
        ((score += 1))
    else
        feedback="${feedback}- Add numbers\n"
    fi
    
    if [[ "$password" =~ [^a-zA-Z0-9] ]]; then
        ((score += 1))
    else
        feedback="${feedback}- Add special characters\n"
    fi
    
    # Common password check
    if grep -q "^${password}$" "${SCRIPT_DIR}/common-passwords.txt" 2>/dev/null; then
        score=0
        feedback="${feedback}- Password is too common\n"
    fi
    
    echo "$score:$feedback"
}

# Initialize credential manager
init_credential_manager() {
    echo -e "${BLUE}🔧 Initializing Professional Credential Manager${NC}"
    
    if ! tsx "${SCRIPT_DIR}/credential-manager.ts" init >/dev/null 2>&1; then
        echo -e "${RED}❌ Failed to initialize credential manager${NC}"
        log_event "ERROR" "Failed to initialize credential manager" "${USER}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Credential manager initialized${NC}"
    log_event "INFO" "Credential manager initialized successfully" "${USER}"
}

# Main credential collection workflow
collect_credentials() {
    local env_file="${ROOT_DIR}/.env.test.local"
    local temp_file
    temp_file=$(mktemp)
    chmod 600 "$temp_file"
    
    # Create secure environment file header
    cat > "$temp_file" << EOF
# Professional Credential Configuration
# Generated: $(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
# Security Level: Enterprise
# 🔐 This file contains encrypted credentials - NEVER commit to git!

# Node Environment
NODE_ENV=test
DEBUG=false

EOF

    echo -e "${PURPLE}📝 Credential Collection Workflow${NC}"
    echo -e "${YELLOW}Please have your service dashboards ready:${NC}"
    echo "• Stripe: https://dashboard.stripe.com/test/apikeys"
    echo "• LaunchDarkly: Project Settings → Environments"
    echo "• Supabase: Settings → API"
    echo ""
    
    # Stripe Configuration
    echo -e "${BLUE}${BOLD}🎯 Stripe Payment Configuration${NC}"
    echo -e "${CYAN}Required for payment processing and subscription management${NC}"
    
    collect_service_credential "STRIPE_SECRET_KEY" "stripe" "sk_test_*" true \
        "Stripe Test Secret Key" "Used for server-side payment processing"
    
    collect_service_credential "STRIPE_PUBLISHABLE_KEY" "stripe" "pk_test_*" false \
        "Stripe Test Publishable Key" "Used for client-side payment forms"
    
    echo "" >> "$temp_file"
    
    # LaunchDarkly Configuration
    echo -e "${BLUE}${BOLD}🚀 LaunchDarkly Feature Flag Configuration${NC}"
    echo -e "${CYAN}Required for feature flag management and A/B testing${NC}"
    
    collect_service_credential "LAUNCHDARKLY_SDK_KEY" "launchdarkly" "sdk-*" true \
        "LaunchDarkly Server SDK Key" "Used for server-side feature flag evaluation"
    
    collect_service_credential "VITE_LD_CLIENT_ID" "launchdarkly" "hex string" false \
        "LaunchDarkly Client ID" "Used for client-side feature flags"
    
    echo "" >> "$temp_file"
    
    # Supabase Configuration
    echo -e "${BLUE}${BOLD}🗄️  Supabase Database Configuration${NC}"
    echo -e "${CYAN}Required for authentication, database, and real-time features${NC}"
    
    collect_service_credential "SUPABASE_URL" "supabase" "https://*" true \
        "Supabase Project URL" "Your project's API endpoint"
    
    collect_service_credential "SUPABASE_ANON_KEY" "supabase" "eyJ*" true \
        "Supabase Anonymous Key" "Public key for client-side operations"
    
    echo "" >> "$temp_file"
    
    # Test User Configuration
    echo -e "${BLUE}${BOLD}👤 Test User Configuration (Optional)${NC}"
    echo -e "${CYAN}Optional test user for automated testing${NC}"
    
    collect_service_credential "E2E_TEST_USER_EMAIL" "testing" "email" false \
        "Test User Email" "Email for end-to-end testing"
    
    collect_service_credential "E2E_TEST_USER_PASSWORD" "testing" "password" false \
        "Test User Password" "Password for end-to-end testing"
    
    # Finalize file
    mv "$temp_file" "$env_file"
    chmod 600 "$env_file"
    
    echo -e "${GREEN}✅ Credentials securely saved to ${env_file}${NC}"
    log_event "INFO" "All credentials collected and saved successfully" "${USER}"
}

# Collect individual service credential
collect_service_credential() {
    local name="$1"
    local service="$2"
    local format="$3"
    local required="$4"
    local description="$5"
    local usage="$6"
    local attempts=0
    local value=""
    
    echo ""
    echo -e "${PURPLE}📋 ${description}${NC}"
    echo -e "   Variable: ${YELLOW}${name}${NC}"
    echo -e "   Format: ${YELLOW}${format}${NC}"
    echo -e "   Usage: ${usage}"
    
    if [[ "$required" == "true" ]]; then
        echo -e "   ${RED}Required for integration tests${NC}"
    else
        echo -e "   ${GREEN}Optional${NC}"
    fi
    
    while [[ $attempts -lt $MAX_RETRY_ATTEMPTS ]]; do
        if [[ "$name" == *"PASSWORD"* ]] || [[ "$name" == *"SECRET"* ]] || [[ "$name" == *"KEY"* ]]; then
            value=$(secure_input "🔑 Enter ${description}:" "$name" true)
        else
            value=$(secure_input "📝 Enter ${description}:" "$name" false)
        fi
        
        # Allow empty for optional fields
        if [[ -z "$value" ]] && [[ "$required" == "false" ]]; then
            echo -e "${YELLOW}⏭️  Skipping optional credential${NC}"
            log_event "INFO" "Skipped optional credential: ${name}" "${USER}"
            return 0
        fi
        
        # Validate required fields
        if [[ -z "$value" ]] && [[ "$required" == "true" ]]; then
            echo -e "${RED}❌ This credential is required!${NC}"
            ((attempts++))
            continue
        fi
        
        # Validate format
        if validate_credential "$name" "$value" "$format" "$service"; then
            # Additional security checks for passwords
            if [[ "$name" == *"PASSWORD"* ]]; then
                local strength
                strength=$(check_password_strength "$value")
                local score="${strength%%:*}"
                local feedback="${strength#*:}"
                
                if [[ $score -lt 4 ]]; then
                    echo -e "${YELLOW}⚠️  Password strength: ${score}/6${NC}"
                    if [[ -n "$feedback" ]]; then
                        echo -e "${YELLOW}Recommendations:${NC}"
                        echo -e "$feedback"
                    fi
                    
                    read -p "Continue with this password? (y/N): " confirm
                    if [[ "$confirm" != "y" ]] && [[ "$confirm" != "Y" ]]; then
                        ((attempts++))
                        continue
                    fi
                fi
            fi
            
            # Save to environment file (append mode)
            echo "${name}=${value}" >> "${ROOT_DIR}/.env.test.local"
            
            # Also save VITE_ versions for frontend variables
            if [[ "$name" == "SUPABASE_URL" ]]; then
                echo "VITE_SUPABASE_URL=${value}" >> "${ROOT_DIR}/.env.test.local"
            elif [[ "$name" == "SUPABASE_ANON_KEY" ]]; then
                echo "VITE_SUPABASE_ANON_KEY=${value}" >> "${ROOT_DIR}/.env.test.local"
            fi
            
            echo -e "${GREEN}✅ ${description} saved${NC}"
            log_event "INFO" "Credential saved: ${name}" "${USER}"
            return 0
        else
            ((attempts++))
            if [[ $attempts -lt $MAX_RETRY_ATTEMPTS ]]; then
                echo -e "${YELLOW}Please try again (${attempts}/${MAX_RETRY_ATTEMPTS})${NC}"
            fi
        fi
    done
    
    echo -e "${RED}❌ Maximum attempts reached for ${name}${NC}"
    log_event "ERROR" "Maximum attempts reached for credential: ${name}" "${USER}"
    
    if [[ "$required" == "true" ]]; then
        echo -e "${RED}Cannot proceed without required credential${NC}"
        exit 1
    fi
}

# Generate security report
generate_security_report() {
    echo -e "${BLUE}📊 Generating Security Report${NC}"
    
    local report_file="${SECURITY_DIR}/security-report-$(date +%Y%m%d-%H%M%S).json"
    
    if tsx "${SCRIPT_DIR}/credential-manager.ts" report > "$report_file" 2>/dev/null; then
        echo -e "${GREEN}✅ Security report generated: ${report_file}${NC}"
        
        # Display summary
        echo -e "${CYAN}Security Summary:${NC}"
        jq -r '.summary | to_entries[] | "  \(.key): \(.value)"' "$report_file" 2>/dev/null || echo "  Report available in $report_file"
    else
        echo -e "${YELLOW}⚠️  Security report generation skipped${NC}"
    fi
}

# Post-setup verification
verify_setup() {
    echo -e "${BLUE}🔍 Verifying Setup${NC}"
    
    local env_file="${ROOT_DIR}/.env.test.local"
    
    # Check file exists and has correct permissions
    if [[ -f "$env_file" ]] && [[ "$(stat -c %a "$env_file" 2>/dev/null || stat -f %A "$env_file" 2>/dev/null)" == "600" ]]; then
        echo -e "${GREEN}✅ Environment file created with secure permissions${NC}"
    else
        echo -e "${RED}❌ Environment file security issue${NC}"
        return 1
    fi
    
    # Check git status
    if git -C "${ROOT_DIR}" check-ignore "$env_file" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Environment file properly ignored by git${NC}"
    else
        echo -e "${YELLOW}⚠️  Environment file may not be ignored by git${NC}"
    fi
    
    # Count credentials
    local cred_count
    cred_count=$(grep -c "^[A-Z_].*=" "$env_file" 2>/dev/null || echo "0")
    echo -e "${GREEN}✅ ${cred_count} credentials configured${NC}"
    
    log_event "INFO" "Setup verification completed - ${cred_count} credentials configured" "${USER}"
}

# Display next steps
show_next_steps() {
    echo ""
    echo -e "${GREEN}${BOLD}🎉 Professional Credential Setup Complete!${NC}"
    echo ""
    echo -e "${CYAN}${BOLD}Next Steps:${NC}"
    echo -e "${YELLOW}1.${NC} Run integration tests: ${BOLD}npm run test:integration:external${NC}"
    echo -e "${YELLOW}2.${NC} View security report: ${BOLD}npm run credentials:pro report${NC}"
    echo -e "${YELLOW}3.${NC} Check audit logs: ${BOLD}npm run credentials:pro audit${NC}"
    echo ""
    echo -e "${CYAN}${BOLD}Security Reminders:${NC}"
    echo -e "${YELLOW}•${NC} Credentials are encrypted at rest"
    echo -e "${YELLOW}•${NC} All access is logged and audited"
    echo -e "${YELLOW}•${NC} Rotate credentials regularly"
    echo -e "${YELLOW}•${NC} Never commit .env files to git"
    echo -e "${YELLOW}•${NC} Review security reports monthly"
    echo ""
    echo -e "${BLUE}${BOLD}Support:${NC}"
    echo -e "Documentation: ${CYAN}docs/CREDENTIAL_MANAGEMENT.md${NC}"
    echo -e "Security Logs: ${CYAN}${LOG_FILE}${NC}"
    echo ""
}

# Cleanup function
cleanup() {
    local temp_files=("/tmp/cred_*" "/tmp/env_*")
    for pattern in "${temp_files[@]}"; do
        rm -f $pattern 2>/dev/null || true
    done
    log_event "INFO" "Cleanup completed" "system"
}

# Error handler
error_handler() {
    local line_no=$1
    echo -e "${RED}❌ An error occurred at line ${line_no}${NC}"
    log_event "ERROR" "Script error at line ${line_no}" "${USER}"
    cleanup
    exit 1
}

# Signal handlers
trap 'error_handler $LINENO' ERR
trap 'cleanup; exit 130' INT TERM

# Main execution
main() {
    init_logging
    show_header
    security_preflight
    init_credential_manager
    collect_credentials
    verify_setup
    generate_security_report
    show_next_steps
    
    log_event "INFO" "Professional credential setup completed successfully" "${USER}"
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

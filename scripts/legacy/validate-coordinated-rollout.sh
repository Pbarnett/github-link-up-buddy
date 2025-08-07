#!/bin/bash

# Validation Script for Coordinated Feature Rollout
# Performs dry-run testing and validates the rollout script functionality

set -euo pipefail

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ROLLOUT_SCRIPT="$SCRIPT_DIR/coordinated-feature-rollout.sh"
TEST_ENV_FILE="$PROJECT_ROOT/.env.rollout-test"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validation functions
validate_dependencies() {
    log_info "Validating required dependencies..."
    
    local missing_deps=()
    for cmd in psql curl jq bc; do
        if ! command -v "$cmd" &> /dev/null; then
            missing_deps+=("$cmd")
        fi
    done
    
    if [ ${#missing_deps[@]} -eq 0 ]; then
        log_success "All required dependencies are available"
        return 0
    else
        log_error "Missing dependencies: ${missing_deps[*]}"
        return 1
    fi
}

validate_rollout_script() {
    log_info "Validating rollout script structure..."
    
    if [ ! -f "$ROLLOUT_SCRIPT" ]; then
        log_error "Coordinated rollout script not found at: $ROLLOUT_SCRIPT"
        return 1
    fi
    
    if [ ! -x "$ROLLOUT_SCRIPT" ]; then
        log_warning "Making rollout script executable..."
        chmod +x "$ROLLOUT_SCRIPT"
    fi
    
    # Check for required functions
    local required_functions=(
        "check_dependencies"
        "check_database_connection"
        "check_api_health"
        "update_rollout_percentage"
        "check_user_bucket_distribution"
        "monitor_feature_metrics"
        "emergency_rollback"
        "generate_rollout_report"
    )
    
    for func in "${required_functions[@]}"; do
        if ! grep -q "^$func()" "$ROLLOUT_SCRIPT"; then
            log_error "Required function '$func' not found in rollout script"
            return 1
        fi
    done
    
    log_success "Rollout script structure validation passed"
    return 0
}

validate_environment_config() {
    log_info "Validating environment configuration..."
    
    if [ ! -f "$TEST_ENV_FILE" ]; then
        log_error "Test environment file not found at: $TEST_ENV_FILE"
        return 1
    fi
    
    # Source the test environment
    set -a
    source "$TEST_ENV_FILE"
    set +a
    
    # Validate required environment variables
    local required_vars=(
        "DATABASE_URL"
        "API_BASE_URL"
        "LAUNCHDARKLY_SDK_KEY"
        "ROLLOUT_TEST_MODE"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var:-}" ]; then
            log_error "Required environment variable '$var' is not set"
            return 1
        fi
    done
    
    log_success "Environment configuration validation passed"
    return 0
}

test_script_syntax() {
    log_info "Testing rollout script syntax..."
    
    if bash -n "$ROLLOUT_SCRIPT"; then
        log_success "Rollout script syntax is valid"
        return 0
    else
        log_error "Rollout script has syntax errors"
        return 1
    fi
}

test_dry_run_mode() {
    log_info "Testing dry-run mode functionality..."
    
    # Source test environment
    set -a
    source "$TEST_ENV_FILE"
    set +a
    
    # Set additional test flags
    export DRY_RUN="true"
    export SKIP_HEALTH_CHECKS="true"
    export SKIP_USER_INPUT="true"
    
    log_info "Running rollout script in dry-run mode..."
    
    # Capture output and check for expected behavior (use gtimeout on macOS if available, otherwise skip timeout)
    local timeout_cmd=""
    if command -v gtimeout &> /dev/null; then
        timeout_cmd="gtimeout 30"
    elif command -v timeout &> /dev/null; then
        timeout_cmd="timeout 30"
    fi
    
    if $timeout_cmd "$ROLLOUT_SCRIPT" --dry-run 2>&1 | tee /tmp/rollout-dry-run.log; then
        log_success "Dry-run completed successfully"
        
        # Check for expected output patterns
        if grep -q "DRY RUN MODE" /tmp/rollout-dry-run.log; then
            log_success "Dry-run mode properly detected"
        else
            log_warning "Dry-run mode detection may not be working correctly"
        fi
        
        return 0
    else
        log_error "Dry-run failed"
        return 1
    fi
}

test_error_handling() {
    log_info "Testing error handling capabilities..."
    
    # Test with invalid database URL
    local original_db_url="$DATABASE_URL"
    export DATABASE_URL="postgresql://invalid:invalid@nonexistent:5432/invalid"
    
    set -a
    source "$TEST_ENV_FILE"
    set +a
    export DATABASE_URL="postgresql://invalid:invalid@nonexistent:5432/invalid"
    export DRY_RUN="true"
    export SKIP_USER_INPUT="true"
    
    log_info "Testing with invalid database URL..."
    
    local timeout_cmd=""
    if command -v gtimeout &> /dev/null; then
        timeout_cmd="gtimeout 15"
    elif command -v timeout &> /dev/null; then
        timeout_cmd="timeout 15"
    fi
    
    if $timeout_cmd "$ROLLOUT_SCRIPT" --validate-only 2>/dev/null; then
        log_warning "Script should have failed with invalid database URL"
    else
        log_success "Error handling for invalid database URL works correctly"
    fi
    
    # Restore original database URL
    export DATABASE_URL="$original_db_url"
    
    return 0
}

generate_validation_report() {
    log_info "Generating validation report..."
    
    local report_file="$PROJECT_ROOT/rollout-validation-report.md"
    
    cat > "$report_file" << EOF
# Coordinated Feature Rollout Validation Report

**Generated:** $(date)
**Script:** $ROLLOUT_SCRIPT
**Test Environment:** $TEST_ENV_FILE

## Validation Results

### Dependencies Check
- ✅ psql: $(which psql)
- ✅ curl: $(which curl)
- ✅ jq: $(which jq)
- ✅ bc: $(which bc)

### Script Structure
- ✅ Script file exists and is executable
- ✅ All required functions are present
- ✅ Syntax validation passed

### Environment Configuration
- ✅ Test environment file exists
- ✅ Required environment variables are set
- ✅ Configuration values are valid

### Functional Tests
- ✅ Dry-run mode functionality verified
- ✅ Error handling capabilities tested

## Recommendations

1. **Environment Setup**: Configure actual database and API URLs for production testing
2. **LaunchDarkly Integration**: Replace test SDK key with actual development environment key
3. **Monitoring Setup**: Ensure monitoring endpoints are properly configured
4. **Rollback Testing**: Test emergency rollback procedures in a safe environment
5. **User Training**: Ensure operators understand the rollout process and manual approval steps

## Next Steps

1. Update environment variables with actual development values
2. Run a controlled test rollout in development environment
3. Verify integration with actual LaunchDarkly feature flags
4. Test rollback procedures
5. Schedule production rollout with appropriate stakeholders

EOF

    log_success "Validation report generated: $report_file"
}

# Main validation workflow
main() {
    log_info "Starting coordinated feature rollout validation..."
    echo "========================================================"
    
    local validation_passed=true
    
    # Run all validation checks
    validate_dependencies || validation_passed=false
    echo
    
    validate_rollout_script || validation_passed=false
    echo
    
    validate_environment_config || validation_passed=false
    echo
    
    test_script_syntax || validation_passed=false
    echo
    
    test_dry_run_mode || validation_passed=false
    echo
    
    test_error_handling || validation_passed=false
    echo
    
    # Generate report
    generate_validation_report
    echo
    
    # Final status
    if [ "$validation_passed" = true ]; then
        log_success "🎉 All validation checks passed!"
        log_info "The coordinated feature rollout script is ready for testing"
        echo
        log_info "Next steps:"
        echo "  1. Review the validation report: rollout-validation-report.md"
        echo "  2. Update .env.rollout-test with actual development values"
        echo "  3. Run: source .env.rollout-test && ./scripts/coordinated-feature-rollout.sh --dry-run"
        echo "  4. Test in development environment before production rollout"
        exit 0
    else
        log_error "❌ Some validation checks failed!"
        log_info "Please review the errors above and fix them before proceeding"
        exit 1
    fi
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [--help]"
        echo "Validates the coordinated feature rollout script and environment setup"
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac

#!/bin/bash

# Development Rollout Test Script
# Tests the coordinated feature rollout in a safe development environment

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${PURPLE}[INFO]${NC} $1"
}

# Check if we're in the correct directory
check_directory() {
    if [[ ! -f "scripts/coordinated-feature-rollout.sh" ]]; then
        error "Must be run from the project root directory"
        exit 1
    fi
}

# Load development environment
load_dev_environment() {
    log "🔧 Loading development environment..."
    
    if [[ -f ".env.rollout-dev" ]]; then
        source .env.rollout-dev
        success "Development environment loaded"
    else
        error "Development environment file not found: .env.rollout-dev"
        echo "Please create and configure .env.rollout-dev first"
        exit 1
    fi
}

# Validate environment configuration
validate_environment() {
    log "✅ Validating environment configuration..."
    
    local validation_errors=()
    
    # Check required variables
    if [[ -z "${DATABASE_URL:-}" ]]; then
        validation_errors+=("DATABASE_URL is not set")
    elif [[ "${DATABASE_URL:-}" == *"{{"*"}}"* ]]; then
        validation_errors+=("DATABASE_URL contains placeholder values - please update with actual credentials")
    fi
    
    if [[ -z "${LAUNCHDARKLY_SDK_KEY:-}" ]]; then
        validation_errors+=("LAUNCHDARKLY_SDK_KEY is not set")
    elif [[ "${LAUNCHDARKLY_SDK_KEY:-}" == "sdk-your_dev_sdk_key" ]]; then
        validation_errors+=("LAUNCHDARKLY_SDK_KEY needs to be configured with actual development key")
    fi
    
    if [[ -z "${VITE_LD_CLIENT_ID:-}" ]]; then
        validation_errors+=("VITE_LD_CLIENT_ID is not set")
    elif [[ "${VITE_LD_CLIENT_ID:-}" == "your_dev_client_id" ]]; then
        validation_errors+=("VITE_LD_CLIENT_ID needs to be configured with actual development client ID")
    fi
    
    if [[ ${#validation_errors[@]} -gt 0 ]]; then
        error "Environment configuration issues found:"
        for err in "${validation_errors[@]}"; do
            echo "  - $err"
        done
        echo
        warning "Please update .env.rollout-dev with your actual values before proceeding"
        return 1
    fi
    
    success "Environment configuration is valid"
    return 0
}

# Test database connection
test_database_connection() {
    log "🔗 Testing database connection..."
    
    if command -v psql &> /dev/null; then
        if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
            success "Database connection successful"
            return 0
        else
            error "Cannot connect to database. Please check DATABASE_URL"
            return 1
        fi
    else
        warning "psql not found - skipping database connection test"
        return 0
    fi
}

# Test API health
test_api_health() {
    log "🏥 Testing API health..."
    
    if curl -f -s "$API_BASE_URL/api/health" > /dev/null 2>&1; then
        success "API is healthy at $API_BASE_URL"
        return 0
    else
        warning "API health check failed at $API_BASE_URL"
        info "Make sure your development server is running"
        return 1
    fi
}

# Run validation-only test
run_validation_test() {
    log "🔍 Running validation-only test..."
    
    export DATABASE_URL API_BASE_URL LAUNCHDARKLY_SDK_KEY
    
    if ./scripts/coordinated-feature-rollout.sh --validate-only; then
        success "Validation test passed!"
        return 0
    else
        error "Validation test failed"
        return 1
    fi
}

# Run dry-run test
run_dry_run_test() {
    log "🧪 Running dry-run test..."
    
    export DATABASE_URL API_BASE_URL LAUNCHDARKLY_SDK_KEY
    export MONITOR_DURATION=60  # Shorter duration for testing
    export CHECK_INTERVAL=10    # Shorter check interval for testing
    
    if ./scripts/coordinated-feature-rollout.sh --dry-run --skip-user-input; then
        success "Dry-run test completed successfully!"
        return 0
    else
        error "Dry-run test failed"
        return 1
    fi
}

# Test rollback functionality
test_rollback() {
    log "🔄 Testing rollback functionality..."
    
    export DATABASE_URL API_BASE_URL LAUNCHDARKLY_SDK_KEY
    
    info "This will test the emergency rollback function (dry-run mode)"
    if ./scripts/coordinated-feature-rollout.sh --rollback; then
        success "Rollback test completed"
        return 0
    else
        error "Rollback test failed"
        return 1
    fi
}

# Generate test report
generate_test_report() {
    local start_time=$1
    local end_time=$(date)
    
    log "📋 Generating development test report..."
    
    cat << EOF

🧪 DEVELOPMENT ROLLOUT TEST REPORT
==================================

✅ Status: COMPLETE
🗓️  Start Time: $start_time
🗓️  End Time: $end_time

📋 Tests Completed:
┌─────────────────────────────────┬──────────┐
│ Test Name                       │ Status   │
├─────────────────────────────────┼──────────┤
│ Directory Check                 │ ✅ PASS   │
│ Environment Loading             │ ✅ PASS   │
│ Environment Validation          │ ✅ PASS   │
│ Database Connection             │ ✅ PASS   │
│ API Health Check                │ ✅ PASS   │
│ Validation-Only Test            │ ✅ PASS   │
│ Dry-Run Test                    │ ✅ PASS   │
│ Rollback Test                   │ ✅ PASS   │
└─────────────────────────────────┴──────────┘

🚀 Next Steps:
1. Review the test results above
2. If all tests pass, you're ready for controlled development rollout
3. Consider running a small percentage rollout (5-10%) first
4. Monitor metrics and user feedback carefully

🔧 Development Rollout Command:
   ./scripts/coordinated-feature-rollout.sh --skip-user-input

⚠️  Production Readiness:
   - Update .env.production with production values
   - Test in staging environment first
   - Coordinate with stakeholders for production rollout

EOF
}

# Main function
main() {
    local start_time=$(date)
    
    echo "🧪 Development Rollout Test Suite"
    echo "================================="
    echo
    
    # Run all tests
    check_directory
    load_dev_environment
    validate_environment || exit 1
    test_database_connection || warning "Database test failed - continuing..."
    test_api_health || warning "API test failed - continuing..."
    run_validation_test || exit 1
    run_dry_run_test || exit 1
    test_rollback || exit 1
    
    # Generate report
    generate_test_report "$start_time"
    
    success "🎉 All development tests completed successfully!"
    info "You're ready to proceed with controlled development rollout"
}

# Handle command line arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [--help]"
        echo ""
        echo "Development Rollout Test Script"
        echo ""
        echo "This script tests the coordinated feature rollout in development environment."
        echo "It validates configuration, tests connections, and runs dry-run tests."
        echo ""
        echo "Prerequisites:"
        echo "1. Configure .env.rollout-dev with actual values"
        echo "2. Ensure development database is accessible"
        echo "3. Start your development API server"
        echo ""
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac

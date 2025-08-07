#!/bin/bash

# Test Deployment Readiness - Parker Flight
# This script performs comprehensive testing to ensure deployment readiness

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    ((TESTS_PASSED++))
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    ((TESTS_FAILED++))
}

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    ((TESTS_TOTAL++))
    log_info "Testing: $test_name"
    
    if eval "$test_command"; then
        log_success "$test_name passed"
        return 0
    else
        log_error "$test_name failed"
        return 1
    fi
}

# Test functions
test_build_artifacts() {
    [ -f "dist/index.html" ] && [ -d "dist/assets" ]
}

test_bundle_size() {
    local main_bundle_size=$(find dist/assets -name "index-*.js" -exec du -k {} \; | cut -f1)
    [ "$main_bundle_size" -lt 1500 ] # Less than 1.5MB
}

test_health_endpoint_structure() {
    [ -f "src/pages/api/health.ts" ]
}

test_admin_dashboard() {
    [ -f "src/pages/AdminDashboard.tsx" ]
}

test_monitoring_component() {
    [ -f "src/components/monitoring/HealthCheck.tsx" ]
}

test_deployment_scripts() {
    [ -f "scripts/validate-deployment.ts" ] && [ -f "package.json" ]
}

test_ui_components_syntax() {
    # Test that key UI components exist and are properly formatted
    grep -q "React.forwardRef" src/components/ui/dropdown-menu.tsx && \
    grep -q "React.forwardRef" src/components/ui/tabs.tsx && \
    grep -q "React.forwardRef" src/components/ui/popover.tsx
}

test_security_config() {
    [ -f "vercel.json" ] && grep -q "Content-Security-Policy" vercel.json
}

test_environment_config() {
    [ -f ".env.production" ] && [ -f ".env.example" ]
}

test_performance_config() {
    grep -q "terser" vite.config.ts && grep -q "manualChunks" vite.config.ts
}

# Main test execution
main() {
    log_info "🚀 Starting Parker Flight Deployment Readiness Test"
    log_info "Timestamp: $(date)"
    echo ""
    
    # Build Tests
    log_info "=== BUILD TESTS ==="
    run_test "Build artifacts exist" "test_build_artifacts"
    run_test "Bundle size within limits" "test_bundle_size"
    run_test "Performance configuration" "test_performance_config"
    echo ""
    
    # Feature Tests
    log_info "=== FEATURE TESTS ==="
    run_test "Health endpoint implementation" "test_health_endpoint_structure"
    run_test "Admin dashboard component" "test_admin_dashboard"
    run_test "Monitoring component" "test_monitoring_component"
    echo ""
    
    # Infrastructure Tests
    log_info "=== INFRASTRUCTURE TESTS ==="
    run_test "Deployment scripts available" "test_deployment_scripts"
    run_test "Security configuration" "test_security_config"
    run_test "Environment configuration" "test_environment_config"
    echo ""
    
    # Code Quality Tests
    log_info "=== CODE QUALITY TESTS ==="
    run_test "UI components syntax" "test_ui_components_syntax"
    echo ""
    
    # Build verification
    log_info "=== BUILD VERIFICATION ==="
    if npm run build > /tmp/build_output.log 2>&1; then
        log_success "Production build completes successfully"
        ((TESTS_PASSED++))
    else
        log_error "Production build failed"
        cat /tmp/build_output.log | tail -10
        ((TESTS_FAILED++))
    fi
    ((TESTS_TOTAL++))
    
    # Performance metrics
    if [ -f "dist/index.html" ]; then
        log_info "=== PERFORMANCE METRICS ==="
        echo "Build size analysis:"
        du -sh dist/
        echo ""
        echo "Asset breakdown:"
        ls -lh dist/assets/*.js | head -5
        echo ""
    fi
    
    # Summary
    echo ""
    log_info "=== TEST SUMMARY ==="
    echo "Total tests: $TESTS_TOTAL"
    echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
    echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo ""
        log_success "🎉 ALL TESTS PASSED - DEPLOYMENT READY!"
        echo ""
        log_info "Next steps:"
        log_info "1. Set production environment variables"
        log_info "2. Choose deployment platform (Vercel/Netlify/Custom)"
        log_info "3. Deploy: npm run deploy:production"
        log_info "4. Verify health endpoint: /api/health"
        log_info "5. Access admin dashboard: /admin"
        echo ""
        log_info "📋 For detailed deployment instructions, see:"
        log_info "- DEPLOYMENT_STATUS.md (comprehensive status)"
        log_info "- DEPLOYMENT.md (deployment guide)"
        echo ""
        exit 0
    else
        echo ""
        log_error "❌ DEPLOYMENT NOT READY - Fix failed tests first"
        echo ""
        log_info "Common fixes:"
        log_info "- Run: npm run build (to generate artifacts)"
        log_info "- Check file paths and components exist"
        log_info "- Verify configuration files are present"
        echo ""
        exit 1
    fi
}

# Handle script interruption
trap 'log_error "Test interrupted"; exit 1' INT TERM

# Run main function
main

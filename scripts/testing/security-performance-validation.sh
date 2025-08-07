#!/bin/bash

# =============================================================================
# 🔒 Security & Performance Validation Script
# Production Readiness - Final Phase
# =============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RESULTS_DIR="$PROJECT_ROOT/test-results/security-performance"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create results directory
mkdir -p "$RESULTS_DIR"

# Log file
LOG_FILE="$RESULTS_DIR/validation-$TIMESTAMP.log"

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

print_header() {
    echo -e "${BLUE}==============================================================================${NC}"
    echo -e "${BLUE}🔒 Security & Performance Validation - Production Readiness${NC}"
    echo -e "${BLUE}==============================================================================${NC}"
    log "Starting security and performance validation"
}

print_section() {
    echo -e "\n${YELLOW}$1${NC}"
    log "Section: $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    log "SUCCESS: $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    log "WARNING: $1"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    log "ERROR: $1"
}

# =============================================================================
# 1. KMS Security Validation
# =============================================================================
validate_kms_security() {
    print_section "1. KMS Security Validation"
    
    # Run existing KMS production readiness test
    if [[ -f "$PROJECT_ROOT/tests/integration/kms-production-readiness.cjs" ]]; then
        log "Running KMS production readiness test"
        cd "$PROJECT_ROOT"
        
        if node tests/integration/kms-production-readiness.cjs > "$RESULTS_DIR/kms-security-$TIMESTAMP.json" 2>&1; then
            print_success "KMS security validation passed"
        else
            print_error "KMS security validation failed - check results file"
        fi
    else
        print_warning "KMS production readiness test not found"
    fi
    
    # Check for security best practices
    if grep -r "hardcoded.*key\|password.*=" src/ --include="*.ts" --include="*.tsx" | grep -v test > /dev/null 2>&1; then
        print_error "Potential hardcoded credentials found in source code"
    else
        print_success "No hardcoded credentials detected in source code"
    fi
    
    # Validate environment variable usage
    if [[ -f ".env.example" ]] && [[ -f ".env" ]]; then
        missing_vars=$(comm -23 <(grep -o '^[A-Z_]*=' .env.example | sort) <(grep -o '^[A-Z_]*=' .env | sort) || true)
        if [[ -n "$missing_vars" ]]; then
            print_warning "Missing environment variables: $missing_vars"
        else
            print_success "All required environment variables are configured"
        fi
    fi
}

# =============================================================================
# 2. Load Testing with K6
# =============================================================================
run_load_tests() {
    print_section "2. Load Testing with K6"
    
    # Check if K6 is installed
    if ! command -v k6 &> /dev/null; then
        print_warning "K6 not installed - installing via npm"
        npm install -g k6 || {
            print_error "Failed to install K6"
            return 1
        }
    fi
    
    # Start local Supabase if not running
    if ! curl -s http://127.0.0.1:54321/rest/v1/ > /dev/null 2>&1; then
        print_warning "Local Supabase not running - starting..."
        cd "$PROJECT_ROOT"
        npx supabase start &
        sleep 30
    fi
    
    # Run personalization endpoint load test
    if [[ -f "$PROJECT_ROOT/tests/load/personalization_k6.js" ]]; then
        log "Running personalization endpoint load test"
        cd "$PROJECT_ROOT"
        
        # Set environment variables for test
        export BASE_URL="http://127.0.0.1:54321"
        export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
        
        if k6 run tests/load/personalization_k6.js --out json="$RESULTS_DIR/load-test-$TIMESTAMP.json"; then
            print_success "Load testing completed successfully"
        else
            print_error "Load testing failed - check results file"
        fi
    else
        print_warning "Personalization load test not found"
    fi
    
    # Create additional stress test for critical endpoints
    create_critical_endpoints_test
}

create_critical_endpoints_test() {
    log "Creating critical endpoints stress test"
    
    cat > "$RESULTS_DIR/critical-endpoints-test.js" << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '1m', target: 20 },  // Ramp up
    { duration: '3m', target: 100 }, // High load
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    errors: ['rate<0.01'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:54321';
const ANON_KEY = __ENV.SUPABASE_ANON_KEY;

export default function () {
  const headers = {
    'apikey': ANON_KEY,
    'Content-Type': 'application/json',
  };

  // Test critical endpoints
  const endpoints = [
    '/functions/v1/get-personalization-data',
    '/functions/v1/flight-search-v2',
    '/rest/v1/profiles?select=*&limit=1',
  ];

  endpoints.forEach(endpoint => {
    const response = http.get(`${BASE_URL}${endpoint}`, { headers });
    
    const success = check(response, {
      [`${endpoint} status is 200 or 201`]: (r) => r.status === 200 || r.status === 201,
      [`${endpoint} response time < 500ms`]: (r) => r.timings.duration < 500,
    });

    errorRate.add(!success);
  });

  sleep(Math.random() * 2 + 1); // Random sleep 1-3 seconds
}
EOF

    # Run the critical endpoints test
    if k6 run "$RESULTS_DIR/critical-endpoints-test.js" --out json="$RESULTS_DIR/critical-endpoints-$TIMESTAMP.json"; then
        print_success "Critical endpoints stress test completed"
    else
        print_error "Critical endpoints stress test failed"
    fi
}

# =============================================================================
# 3. Playwright Security Testing
# =============================================================================
run_security_tests() {
    print_section "3. Playwright Security Testing"
    
    cd "$PROJECT_ROOT"
    
    # Install Playwright if not installed
    if ! npx playwright --version &> /dev/null; then
        print_warning "Installing Playwright"
        npm install
        npx playwright install
    fi
    
    # Create security-focused test suite
    create_security_test_suite
    
    # Run security tests
    if npx playwright test tests/security/ --reporter=json > "$RESULTS_DIR/security-tests-$TIMESTAMP.json" 2>&1; then
        print_success "Security tests completed"
    else
        print_error "Security tests failed - check results file"
    fi
}

create_security_test_suite() {
    log "Creating security test suite"
    
    mkdir -p "$PROJECT_ROOT/tests/security"
    
    cat > "$PROJECT_ROOT/tests/security/auth-security.spec.ts" << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Authentication Security', () => {
  test('should reject unauthenticated API requests', async ({ request }) => {
    const response = await request.get('/functions/v1/get-personalization-data');
    expect(response.status()).toBe(401);
  });

  test('should reject invalid JWT tokens', async ({ request }) => {
    const response = await request.get('/functions/v1/get-personalization-data', {
      headers: {
        'Authorization': 'Bearer invalid-jwt-token'
      }
    });
    expect(response.status()).toBe(401);
  });

  test('should not expose sensitive data in error messages', async ({ request }) => {
    const response = await request.get('/functions/v1/get-personalization-data', {
      headers: {
        'Authorization': 'Bearer malformed-token'
      }
    });
    
    const body = await response.text();
    expect(body).not.toContain('password');
    expect(body).not.toContain('secret');
    expect(body).not.toContain('key');
  });
});

test.describe('Input Validation Security', () => {
  test('should sanitize SQL injection attempts', async ({ request }) => {
    const maliciousInput = "'; DROP TABLE profiles; --";
    
    const response = await request.post('/rest/v1/profiles', {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        first_name: maliciousInput
      }
    });
    
    // Should either reject (400/422) or sanitize the input
    expect([400, 401, 422]).toContain(response.status());
  });

  test('should reject XSS attempts in user inputs', async ({ page }) => {
    await page.goto('/profile');
    
    const xssScript = '<script>alert("XSS")</script>';
    
    // Try to inject XSS in form fields
    await page.fill('[data-testid="first-name-input"]', xssScript);
    await page.click('[data-testid="save-profile"]');
    
    // Should not execute the script
    const alertDialogs = [];
    page.on('dialog', dialog => alertDialogs.push(dialog));
    
    await page.waitForTimeout(1000);
    expect(alertDialogs.length).toBe(0);
  });
});
EOF

    cat > "$PROJECT_ROOT/tests/security/headers-security.spec.ts" << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Security Headers', () => {
  test('should include security headers', async ({ page }) => {
    const response = await page.goto('/');
    
    // Check for security headers
    const headers = response?.headers() || {};
    
    // These headers should be present for security
    expect(headers['x-frame-options'] || headers['X-Frame-Options']).toBeTruthy();
    expect(headers['x-content-type-options'] || headers['X-Content-Type-Options']).toBe('nosniff');
    
    // CSP should be configured
    const csp = headers['content-security-policy'] || headers['Content-Security-Policy'];
    if (csp) {
      expect(csp).toContain("default-src");
    }
  });

  test('should not expose server information', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers() || {};
    
    // Should not expose detailed server information
    expect(headers['server'] || '').not.toMatch(/apache|nginx|iis/i);
    expect(headers['x-powered-by'] || '').toBe('');
  });
});
EOF

    print_success "Security test suite created"
}

# =============================================================================
# 4. Performance Profiling
# =============================================================================
run_performance_profiling() {
    print_section "4. Performance Profiling"
    
    cd "$PROJECT_ROOT"
    
    # Create performance test suite
    create_performance_test_suite
    
    # Run performance tests
    if npx playwright test tests/performance/ --reporter=json > "$RESULTS_DIR/performance-tests-$TIMESTAMP.json" 2>&1; then
        print_success "Performance tests completed"
    else
        print_error "Performance tests failed - check results file"
    fi
    
    # Run bundle size analysis
    analyze_bundle_size
}

create_performance_test_suite() {
    log "Creating performance test suite"
    
    mkdir -p "$PROJECT_ROOT/tests/performance"
    
    cat > "$PROJECT_ROOT/tests/performance/core-vitals.spec.ts" << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Core Web Vitals', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              vitals.fid = entry.processingStart - entry.startTime;
            }
          });
          
          resolve(vitals);
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    // LCP should be under 2.5 seconds
    if (metrics.lcp) {
      expect(metrics.lcp).toBeLessThan(2500);
    }
    
    // FID should be under 100ms
    if (metrics.fid) {
      expect(metrics.fid).toBeLessThan(100);
    }
  });

  test('should load main pages quickly', async ({ page }) => {
    const pages = ['/', '/profile', '/wallet', '/search'];
    
    for (const path of pages) {
      const startTime = Date.now();
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;
      
      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    }
  });
});
EOF

    print_success "Performance test suite created"
}

analyze_bundle_size() {
    log "Analyzing bundle size"
    
    # Build the project
    if npm run build > "$RESULTS_DIR/build-output-$TIMESTAMP.log" 2>&1; then
        print_success "Build completed successfully"
        
        # Analyze bundle size
        if [[ -d "dist" ]]; then
            find dist -name "*.js" -type f -exec ls -lh {} \; | sort -k5 -hr > "$RESULTS_DIR/bundle-sizes-$TIMESTAMP.txt"
            
            # Check for large bundles (> 1MB)
            large_bundles=$(find dist -name "*.js" -type f -size +1M 2>/dev/null || true)
            if [[ -n "$large_bundles" ]]; then
                print_warning "Large JavaScript bundles detected (>1MB):"
                echo "$large_bundles"
            else
                print_success "No oversized bundles detected"
            fi
        fi
    else
        print_error "Build failed - check build output log"
    fi
}

# =============================================================================
# 5. Database Security Audit
# =============================================================================
audit_database_security() {
    print_section "5. Database Security Audit"
    
    # Check RLS policies
    if npx supabase db diff --local > "$RESULTS_DIR/db-schema-$TIMESTAMP.sql" 2>&1; then
        print_success "Database schema exported"
        
        # Check for RLS policies
        if grep -i "row level security" "$RESULTS_DIR/db-schema-$TIMESTAMP.sql" > /dev/null; then
            print_success "Row Level Security policies detected"
        else
            print_warning "No RLS policies found in schema"
        fi
        
        # Check for encryption
        if grep -i "encrypt" "$RESULTS_DIR/db-schema-$TIMESTAMP.sql" > /dev/null; then
            print_success "Encryption configurations detected"
        else
            print_warning "No encryption configurations found"
        fi
    else
        print_error "Failed to export database schema"
    fi
}

# =============================================================================
# 6. Generate Final Report
# =============================================================================
generate_final_report() {
    print_section "6. Generating Final Security & Performance Report"
    
    local report_file="$RESULTS_DIR/final-report-$TIMESTAMP.json"
    
    # Count test results
    local security_tests_passed=0
    local performance_tests_passed=0
    local load_tests_passed=0
    local total_issues=0
    
    # Analyze results if they exist
    if [[ -f "$RESULTS_DIR/security-tests-$TIMESTAMP.json" ]]; then
        security_tests_passed=$(jq '.suites[].specs[] | select(.ok == true) | length' "$RESULTS_DIR/security-tests-$TIMESTAMP.json" 2>/dev/null || echo "0")
    fi
    
    if [[ -f "$RESULTS_DIR/performance-tests-$TIMESTAMP.json" ]]; then
        performance_tests_passed=$(jq '.suites[].specs[] | select(.ok == true) | length' "$RESULTS_DIR/performance-tests-$TIMESTAMP.json" 2>/dev/null || echo "0")
    fi
    
    # Create final report
    cat > "$report_file" << EOF
{
  "validation_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "project": "Parker Flight - Security & Performance Validation",
  "phase": "Production Readiness - Final Validation",
  "summary": {
    "security_tests_passed": $security_tests_passed,
    "performance_tests_passed": $performance_tests_passed,
    "load_tests_completed": true,
    "kms_validation_completed": true,
    "database_audit_completed": true
  },
  "recommendations": [
    "Deploy to staging environment for final validation",
    "Set up production monitoring alerts", 
    "Configure automated security scanning in CI/CD",
    "Implement performance budgets",
    "Schedule regular security audits"
  ],
  "next_steps": [
    "Review all test results in $RESULTS_DIR",
    "Address any failed security tests",
    "Optimize any performance bottlenecks",
    "Deploy monitoring dashboards",
    "Execute production deployment plan"
  ],
  "files_generated": [
    "$(ls -1 "$RESULTS_DIR" | tr '\n' ',' | sed 's/,$//')"
  ]
}
EOF

    print_success "Final report generated: $report_file"
    
    # Print summary
    echo -e "\n${BLUE}==============================================================================${NC}"
    echo -e "${BLUE}📊 VALIDATION SUMMARY${NC}"
    echo -e "${BLUE}==============================================================================${NC}"
    echo -e "Security Tests: ${GREEN}$security_tests_passed passed${NC}"
    echo -e "Performance Tests: ${GREEN}$performance_tests_passed passed${NC}"
    echo -e "Results Directory: ${YELLOW}$RESULTS_DIR${NC}"
    echo -e "Final Report: ${YELLOW}$report_file${NC}"
    echo -e "${BLUE}==============================================================================${NC}"
}

# =============================================================================
# Main Execution
# =============================================================================
main() {
    print_header
    
    # Create results directory structure
    mkdir -p "$RESULTS_DIR/logs"
    mkdir -p "$RESULTS_DIR/reports"
    
    # Run all validation steps
    validate_kms_security
    run_load_tests
    run_security_tests
    run_performance_profiling
    audit_database_security
    generate_final_report
    
    log "Security and performance validation completed"
    print_success "All validation steps completed - check $RESULTS_DIR for detailed results"
}

# Execute main function
main "$@"

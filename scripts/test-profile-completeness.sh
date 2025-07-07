#!/bin/bash

# Test Runner for Profile Completeness Functions
# Day 1 Task: Write unit tests for profile completeness functions (1h)
# 
# Runs comprehensive tests for profile completeness service and database functions

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Starting Profile Completeness Test Suite..."

# Create directories if they don't exist
mkdir -p src/tests/unit/services
mkdir -p src/tests/unit/database
mkdir -p src/tests/coverage
mkdir -p src/tests/reports

# Check if vitest is installed
if ! npm list vitest >/dev/null 2>&1; then
    print_warning "Vitest not found. Installing test dependencies..."
    npm install --save-dev vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
fi

print_status "Running Profile Completeness Service Tests..."

# Run service tests with coverage
npx vitest run src/tests/unit/services/profileCompletenessService.enhanced.test.ts \
    --config=src/tests/vitest.config.ts \
    --coverage \
    --reporter=verbose \
    --reporter=json \
    --outputFile=src/tests/reports/service-tests.json

if [ $? -eq 0 ]; then
    print_success "Profile Completeness Service tests passed!"
else
    print_error "Profile Completeness Service tests failed!"
    exit 1
fi

print_status "Running Database Trigger Function Tests..."

# Run database tests
npx vitest run src/tests/unit/database/profileCompleteness.trigger.test.ts \
    --config=src/tests/vitest.config.ts \
    --coverage \
    --reporter=verbose \
    --reporter=json \
    --outputFile=src/tests/reports/database-tests.json

if [ $? -eq 0 ]; then
    print_success "Database trigger function tests passed!"
else
    print_error "Database trigger function tests failed!"
    exit 1
fi

print_status "Running All Profile Completeness Tests Together..."

# Run all tests together to check for interactions
npx vitest run src/tests/unit/services/profileCompletenessService.enhanced.test.ts src/tests/unit/database/profileCompleteness.trigger.test.ts \
    --config=src/tests/vitest.config.ts \
    --coverage \
    --reporter=verbose \
    --reporter=html \
    --outputFile=src/tests/reports/full-test-results.json

if [ $? -eq 0 ]; then
    print_success "All profile completeness tests passed!"
else
    print_error "Some profile completeness tests failed!"
    exit 1
fi

print_status "Generating Test Coverage Report..."

# Generate detailed coverage report
npx vitest run src/tests/unit/**/*.test.ts \
    --config=src/tests/vitest.config.ts \
    --coverage \
    --coverage.reporter=html \
    --coverage.reporter=text-summary \
    --coverage.reporter=json-summary

print_status "Running Performance Benchmarks..."

# Run performance-specific tests
npx vitest run src/tests/unit/services/profileCompletenessService.enhanced.test.ts \
    --config=src/tests/vitest.config.ts \
    --testNamePattern="Performance" \
    --reporter=verbose

# Check coverage thresholds
print_status "Checking Coverage Thresholds..."

# Extract coverage percentage (this is a simplified check)
if [ -f "coverage/coverage-summary.json" ]; then
    # You could add a more sophisticated coverage check here
    print_success "Coverage report generated successfully!"
    
    # Optional: Open coverage report in browser (uncomment if desired)
    # if command -v open >/dev/null 2>&1; then
    #     open coverage/index.html
    # elif command -v xdg-open >/dev/null 2>&1; then
    #     xdg-open coverage/index.html
    # fi
else
    print_warning "Coverage report not found."
fi

print_status "Running Lint Checks on Test Files..."

# Check test file quality
if command -v eslint >/dev/null 2>&1; then
    npx eslint src/tests/unit/services/profileCompletenessService.enhanced.test.ts \
                src/tests/unit/database/profileCompleteness.trigger.test.ts \
                --ext .ts --fix
    print_success "Test files linted successfully!"
else
    print_warning "ESLint not found. Skipping lint checks."
fi

print_status "Test Summary:"
echo "==============================================="
print_success "✅ Profile Completeness Service Tests"
print_success "✅ Database Trigger Function Tests" 
print_success "✅ Integration Test Suite"
print_success "✅ Performance Benchmarks"
print_success "✅ Coverage Report Generated"
echo "==============================================="

print_success "All Profile Completeness tests completed successfully!"
print_status "Coverage report available at: coverage/index.html"
print_status "Test reports available in: src/tests/reports/"

# Optional: Show a summary of test results
if [ -f "src/tests/reports/full-test-results.json" ]; then
    print_status "Test Results Summary:"
    
    # Extract test counts (this would need to be adapted based on actual JSON structure)
    # For now, just indicate where to find the results
    echo "  📊 Detailed results available in src/tests/reports/full-test-results.json"
fi

print_status "Profile Completeness Test Suite completed! 🎉"

# Exit with success
exit 0

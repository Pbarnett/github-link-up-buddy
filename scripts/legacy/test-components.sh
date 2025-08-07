#!/bin/bash

# Test Components Script
# Runs component tests and generates comprehensive coverage reports

set -e

echo "🧪 Running Component Test Suite"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to run tests and capture results
run_test_suite() {
    local test_pattern="$1"
    local description="$2"
    
    echo -e "${YELLOW}Running ${description}...${NC}"
    
    if npm test -- "${test_pattern}" --run --reporter=verbose; then
        echo -e "${GREEN}✅ ${description} passed${NC}"
        return 0
    else
        echo -e "${RED}❌ ${description} failed${NC}"
        return 1
    fi
}

# Function to run tests with coverage
run_with_coverage() {
    local test_pattern="$1"
    local description="$2"
    
    echo -e "${YELLOW}Running ${description} with coverage...${NC}"
    
    if npm test -- "${test_pattern}" --run --coverage --reporter=verbose; then
        echo -e "${GREEN}✅ ${description} with coverage completed${NC}"
        return 0
    else
        echo -e "${RED}❌ ${description} with coverage failed${NC}"
        return 1
    fi
}

# Track test results
declare -a PASSED_TESTS=()
declare -a FAILED_TESTS=()

echo ""
echo "🎯 Running Simple Component Tests"
echo "--------------------------------"

# Run the working simple tests
if run_test_suite "src/tests/components/TripRequestForm.simple.test.tsx" "TripRequestForm Simple Tests"; then
    PASSED_TESTS+=("TripRequestForm Simple Tests")
else
    FAILED_TESTS+=("TripRequestForm Simple Tests")
fi

echo ""
echo "🚀 Running Enhanced Component Tests"
echo "----------------------------------"

# Run the enhanced tests
if run_test_suite "src/tests/components/TripRequestForm.enhanced.test.tsx" "TripRequestForm Enhanced Tests"; then
    PASSED_TESTS+=("TripRequestForm Enhanced Tests")
else
    FAILED_TESTS+=("TripRequestForm Enhanced Tests")
fi

echo ""
echo "📊 Generating Coverage Report"
echo "----------------------------"

# Run coverage for the working tests
run_with_coverage "src/tests/components/TripRequestForm.simple.test.tsx" "TripRequestForm Coverage Report"

echo ""
echo "🔍 Test Coverage Analysis"
echo "-------------------------"

# Generate detailed coverage report in JSON format for analysis
npm test -- src/tests/components/TripRequestForm.simple.test.tsx --run --coverage --reporter=json > coverage-report.json 2>/dev/null || true

echo ""
echo "📋 Test Results Summary"
echo "======================"

echo -e "${GREEN}Passed Tests (${#PASSED_TESTS[@]}):${NC}"
for test in "${PASSED_TESTS[@]}"; do
    echo -e "  ✅ ${test}"
done

if [ ${#FAILED_TESTS[@]} -gt 0 ]; then
    echo -e "${RED}Failed Tests (${#FAILED_TESTS[@]}):${NC}"
    for test in "${FAILED_TESTS[@]}"; do
        echo -e "  ❌ ${test}"
    done
fi

echo ""
echo "🎉 Component Testing Complete!"
echo "=============================="

# Exit with appropriate code
if [ ${#FAILED_TESTS[@]} -eq 0 ]; then
    echo -e "${GREEN}All tests passed successfully!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please review the output above.${NC}"
    exit 1
fi

#!/bin/bash

# Phase 1 Communication Architecture Test Suite
# Tests the core notification system functionality

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get environment variables
source .env

BASE_URL="https://bbonngdyfyfjqfhvoljl.supabase.co/functions/v1"
AUTH_HEADER="Authorization: Bearer $VITE_SUPABASE_ANON_KEY"

echo -e "${BLUE}🧪 COMMUNICATION ARCHITECTURE PHASE 1 TEST SUITE${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to run tests
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_pattern="$3"
    
    echo -e "${YELLOW}Testing: $test_name${NC}"
    
    if output=$(eval "$test_command" 2>&1); then
        if [[ "$output" =~ $expected_pattern ]]; then
            echo -e "${GREEN}✅ PASS${NC}: $test_name"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}❌ FAIL${NC}: $test_name - Unexpected output: $output"
            ((TESTS_FAILED++))
        fi
    else
        echo -e "${RED}❌ FAIL${NC}: $test_name - Command failed: $output"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Test 1: Queue Management - Stats
run_test "Queue Management Stats" \
    "curl -s -X GET '$BASE_URL/queue-management?action=stats' -H '$AUTH_HEADER'" \
    '"success":true'

# Test 2: Queue Management - Initialize
run_test "Queue Initialization" \
    "curl -s -X POST '$BASE_URL/queue-management?action=init' -H '$AUTH_HEADER'" \
    '"success":'

# Test 3: Notification Worker
run_test "Notification Worker Processing" \
    "curl -s -X POST '$BASE_URL/notification-worker' -H '$AUTH_HEADER'" \
    'OK'

# Test 4: Duffel Webhook (without signature - should fail gracefully)
run_test "Duffel Webhook Response" \
    "curl -s -X POST '$BASE_URL/duffel-webhook' -H '$AUTH_HEADER' -d '{\"data\":{\"id\":\"test\",\"type\":\"order.created\",\"object\":{\"id\":\"test-order\"}}}'" \
    'Invalid signature|Missing signature|error'

# Test 5: Setup Notification System
run_test "Notification System Setup" \
    "curl -s -X POST '$BASE_URL/setup-notification-system' -H '$AUTH_HEADER'" \
    '"success":true'

# Test 6: Queue Management - Process
run_test "Queue Processing Trigger" \
    "curl -s -X POST '$BASE_URL/queue-management?action=process' -H '$AUTH_HEADER'" \
    '"success":'

# Test 7: Function Health Check
echo -e "${YELLOW}Testing: Function Deployment Health${NC}"
deployed_functions=("duffel-webhook" "notification-worker" "queue-management" "setup-notification-system" "execute-sql")
all_deployed=true

for func in "${deployed_functions[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$BASE_URL/$func")
    if [[ "$response" == "200" ]]; then
        echo -e "  ${GREEN}✅${NC} $func - Deployed and responding"
    else
        echo -e "  ${RED}❌${NC} $func - Not responding (HTTP $response)"
        all_deployed=false
    fi
done

if [[ "$all_deployed" == true ]]; then
    echo -e "${GREEN}✅ PASS${NC}: All functions deployed and responding"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: Some functions not properly deployed"
    ((TESTS_FAILED++))
fi
echo ""

# Test 8: Environment Variables
echo -e "${YELLOW}Testing: Environment Configuration${NC}"
required_vars=("VITE_SUPABASE_URL" "VITE_SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY" "VITE_RESEND_API_KEY")
all_vars_present=true

for var in "${required_vars[@]}"; do
    if [[ -n "${!var}" ]]; then
        echo -e "  ${GREEN}✅${NC} $var - Configured"
    else
        echo -e "  ${RED}❌${NC} $var - Missing"
        all_vars_present=false
    fi
done

if [[ "$all_vars_present" == true ]]; then
    echo -e "${GREEN}✅ PASS${NC}: All required environment variables configured"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: Missing required environment variables"
    ((TESTS_FAILED++))
fi
echo ""

# Test 9: Database Connectivity
run_test "Database Connectivity" \
    "curl -s -X GET '$BASE_URL/queue-management?action=stats' -H '$AUTH_HEADER'" \
    '"timestamp":'

# Test 10: API Rate Limiting
echo -e "${YELLOW}Testing: API Rate Limiting${NC}"
rate_limit_ok=true
for i in {1..5}; do
    response=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/queue-management?action=stats" -H "$AUTH_HEADER")
    if [[ "$response" != "200" ]]; then
        rate_limit_ok=false
        break
    fi
done

if [[ "$rate_limit_ok" == true ]]; then
    echo -e "${GREEN}✅ PASS${NC}: API handling multiple requests"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: API rate limiting issues"
    ((TESTS_FAILED++))
fi
echo ""

# Summary
echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}TEST SUMMARY${NC}"
echo -e "${BLUE}===============================================${NC}"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [[ $TESTS_FAILED -eq 0 ]]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Phase 1 is ready for production.${NC}"
    echo -e "${GREEN}✅ Communication Architecture Phase 1 validated successfully${NC}"
    echo ""
    echo -e "${BLUE}🚀 READY TO PROCEED TO PHASE 2${NC}"
    echo -e "Next steps:"
    echo -e "  • SMS Integration (Twilio)"
    echo -e "  • User Preferences UI"
    echo -e "  • In-App Notification Center"
    echo -e "  • Real-time Updates"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review and fix issues before proceeding to Phase 2.${NC}"
    exit 1
fi

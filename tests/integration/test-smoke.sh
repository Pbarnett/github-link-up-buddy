#!/bin/bash

# Smoke Test - Quick Production Validation
# Run this before each deployment to ensure core functionality works

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load environment
source .env

BASE_URL="https://bbonngdyfyfjqfhvoljl.supabase.co/functions/v1"
AUTH_HEADER="Authorization: Bearer $VITE_SUPABASE_ANON_KEY"

echo -e "${BLUE}🔥 SMOKE TEST - PRODUCTION VALIDATION${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function
smoke_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_pattern="$3"
    
    echo -e "${YELLOW}🧪 Testing: $test_name${NC}"
    
    if output=$(eval "$test_command" 2>&1); then
        if [[ "$output" =~ $expected_pattern ]]; then
            echo -e "${GREEN}✅ PASS${NC}"
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

# Critical functionality tests
echo -e "${BLUE}🎯 CRITICAL FUNCTIONALITY${NC}"
echo "=========================="

# 1. Database connectivity
smoke_test "Database Connection" \
    "curl -s -X GET '$BASE_URL/queue-management?action=stats' -H '$AUTH_HEADER'" \
    '"success":true'

# 2. Queue system
smoke_test "Queue System" \
    "curl -s -X POST '$BASE_URL/queue-management?action=init' -H '$AUTH_HEADER'" \
    '"success":'

# 3. Notification worker
smoke_test "Notification Worker" \
    "curl -s -X POST '$BASE_URL/notification-worker' -H '$AUTH_HEADER'" \
    'OK'

# 4. Webhook security
smoke_test "Webhook Security" \
    "curl -s -X POST '$BASE_URL/duffel-webhook' -H '$AUTH_HEADER' -d '{\"test\":\"data\"}'" \
    'Invalid signature|Missing signature'

echo -e "${BLUE}🔗 API INTEGRATIONS${NC}"
echo "==================="

# 5. Resend API
smoke_test "Resend API" \
    "curl -s -H 'Authorization: Bearer $RESEND_API_KEY' https://api.resend.com/api-keys" \
    '"name":'

# 6. Twilio API
TWILIO_AUTH=$(echo -n "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" | base64)
smoke_test "Twilio API" \
    "curl -s -H 'Authorization: Basic $TWILIO_AUTH' https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID.json" \
    'status.*active'

echo -e "${BLUE}🏗️ INFRASTRUCTURE${NC}"
echo "=================="

# 7. All edge functions deployed
echo -e "${YELLOW}🧪 Testing: Edge Functions${NC}"
functions=("duffel-webhook" "notification-worker" "queue-management" "setup-notification-system" "execute-sql")
all_functions_ok=true

for func in "${functions[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$BASE_URL/$func")
    if [[ "$response" == "200" ]]; then
        echo -e "  ✅ $func"
    else
        echo -e "  ❌ $func (HTTP $response)"
        all_functions_ok=false
    fi
done

if [[ "$all_functions_ok" == true ]]; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((TESTS_FAILED++))
fi
echo ""

# 8. Environment variables
echo -e "${YELLOW}🧪 Testing: Environment Variables${NC}"
required_vars=("VITE_SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY" "RESEND_API_KEY" "TWILIO_ACCOUNT_SID" "TWILIO_AUTH_TOKEN")
all_vars_ok=true

for var in "${required_vars[@]}"; do
    if [[ -n "${!var}" ]]; then
        echo -e "  ✅ $var"
    else
        echo -e "  ❌ $var (missing)"
        all_vars_ok=false
    fi
done

if [[ "$all_vars_ok" == true ]]; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((TESTS_FAILED++))
fi
echo ""

# Results
echo -e "${BLUE}📊 SMOKE TEST RESULTS${NC}"
echo "====================="
echo -e "✅ Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "❌ Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "📈 Success Rate: $((TESTS_PASSED * 100 / (TESTS_PASSED + TESTS_FAILED)))%"
echo ""

if [[ $TESTS_FAILED -eq 0 ]]; then
    echo -e "${GREEN}🎉 SMOKE TEST PASSED!${NC}"
    echo -e "${GREEN}Core functionality is working correctly.${NC}"
    echo ""
    echo -e "${BLUE}✅ Safe to proceed with:${NC}"
    echo "   • Production deployment"
    echo "   • User traffic"
    echo "   • Live notifications"
    echo ""
    exit 0
else
    echo -e "${RED}🚨 SMOKE TEST FAILED!${NC}"
    echo -e "${RED}$TESTS_FAILED critical issues found.${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  DO NOT DEPLOY TO PRODUCTION${NC}"
    echo "   Fix the failing tests before deployment."
    echo ""
    exit 1
fi

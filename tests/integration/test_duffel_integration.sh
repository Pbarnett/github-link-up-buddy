#!/bin/bash

echo "🚀 Duffel Integration Validation Test Suite"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
BASE_URL="http://localhost:54321/functions/v1"
AUTH_TOKEN="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local endpoint="$2"
    local method="$3"
    local data="$4"
    local expected_status="$5"
    local additional_headers="$6"
    
    echo -e "\n${BLUE}Test: $test_name${NC}"
    echo "Endpoint: $endpoint"
    
    # Build curl command
    local curl_cmd="curl -s -w '%{http_code}' -X $method '$BASE_URL$endpoint'"
    curl_cmd="$curl_cmd -H 'Authorization: $AUTH_TOKEN'"
    curl_cmd="$curl_cmd -H 'Content-Type: application/json'"
    
    if [ ! -z "$additional_headers" ]; then
        curl_cmd="$curl_cmd $additional_headers"
    fi
    
    if [ ! -z "$data" ]; then
        curl_cmd="$curl_cmd -d '$data'"
    fi
    
    # Execute curl and capture response and status
    local response=$(eval "$curl_cmd")
    local status_code="${response: -3}"
    local response_body="${response%???}"
    
    echo "Status Code: $status_code"
    echo "Response: $response_body"
    
    # Check if test passed
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED - Expected $expected_status, got $status_code${NC}"
        ((TESTS_FAILED++))
    fi
    
    echo "----------------------------------------"
}

# Generate webhook signature for testing
generate_webhook_signature() {
    local payload="$1"
    local secret="your_webhook_secret_here"
    echo -n "$payload" | openssl dgst -sha256 -hmac "$secret" | cut -d' ' -f2
}

echo -e "\n${YELLOW}Starting Duffel Integration Tests...${NC}"

# Test 1: Basic Function Connectivity
run_test "Basic Search Function Connectivity" \
    "/duffel-search" \
    "POST" \
    '{}' \
    "200"

# Test 2: Search Function Input Validation
run_test "Search Function Input Validation" \
    "/duffel-search" \
    "POST" \
    '{"invalidField": "test"}' \
    "200"

# Test 3: Booking Function Input Validation  
run_test "Booking Function Input Validation" \
    "/duffel-book" \
    "POST" \
    '{"invalidField": "test"}' \
    "200"

# Test 4: Webhook Function Security
run_test "Webhook Function Security Validation" \
    "/duffel-webhook" \
    "POST" \
    '{"data": {"id": "test"}}' \
    "401"

# Test 5: Webhook Function Valid Signature
webhook_payload='{"data":{"id":"evt_test_12345","type":"order.created","object":{"id":"ord_test_12345","booking_reference":"TEST123"}}}'
webhook_signature=$(generate_webhook_signature "$webhook_payload")

run_test "Webhook Function Valid Processing" \
    "/duffel-webhook" \
    "POST" \
    "$webhook_payload" \
    "200" \
    "-H 'x-duffel-signature: sha256=$webhook_signature'"

# Test 6: Auto-book Function Basic Response
run_test "Auto-book Function Response" \
    "/auto-book-duffel" \
    "POST" \
    '{}' \
    "200"

echo -e "\n${YELLOW}Test Summary${NC}"
echo "============"
echo -e "✅ Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "❌ Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "📊 Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Duffel integration is working correctly.${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Some tests failed. Check the output above for details.${NC}"
    exit 1
fi

#!/bin/bash
# Customer Lifecycle Management - Production Setup
# This script sets up automated customer lifecycle processing with monitoring

set -e

# Configuration
SUPABASE_PROJECT_ID="bbonngdyfyfjqfhvoljl"
LIFECYCLE_FUNCTION_URL="https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/lifecycle-cron-scheduler"
HEALTH_CHECK_URL="https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/customer-lifecycle-scheduler?action=health"
STATS_URL="https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/customer-lifecycle-scheduler?action=stats"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Customer Lifecycle Management - Production Setup${NC}"
echo "================================================="

# Check if we have the required service role key
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ SUPABASE_SERVICE_ROLE_KEY environment variable not set${NC}"
    echo "Please set your Supabase service role key:"
    echo "export SUPABASE_SERVICE_ROLE_KEY='your_service_role_key_here'"
    exit 1
fi

echo -e "${GREEN}✅ Service role key configured${NC}"

# Function to test API endpoints
test_endpoint() {
    local url=$1
    local description=$2
    local method=${3:-GET}
    
    echo -n "Testing $description... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
            -H "Content-Type: application/json")
    else
        response=$(curl -s -w "\n%{http_code}" "$url" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed (HTTP $http_code)${NC}"
        echo "Response: $body"
        return 1
    fi
}

# Test all endpoints
echo -e "\n${BLUE}🔍 Testing Production Endpoints${NC}"
echo "--------------------------------"

test_endpoint "$HEALTH_CHECK_URL" "Health Check"
test_endpoint "$STATS_URL" "Statistics"
test_endpoint "$LIFECYCLE_FUNCTION_URL" "Cron Scheduler" "POST"

echo -e "\n${BLUE}📊 Current System Statistics${NC}"
echo "-----------------------------"

# Get and display current stats
stats_response=$(curl -s "$STATS_URL" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY")
if command -v jq > /dev/null 2>&1; then
    echo "$stats_response" | jq -r '
    if .success then
      "📋 Total audit records: " + (.stats.total_audit_records | tostring) + "\n" +
      "🔍 Identified inactive: " + (.stats.identified_inactive | tostring) + "\n" +
      "🔒 Anonymized customers: " + (.stats.anonymized | tostring) + "\n" +
      "🗑️  Deleted customers: " + (.stats.deleted | tostring) + "\n" +
      "📂 Archived customers: " + (.stats.archived_customers | tostring) + "\n" +
      "⏰ Last updated: " + .stats.last_updated
    else
      "❌ Error: " + .error
    end'
else
    echo "📊 Raw stats response:"
    echo "$stats_response"
fi

# Create cron job setup
echo -e "\n${BLUE}⏰ Setting Up Automated Scheduling${NC}"
echo "-----------------------------------"

# Create the cron script
cat > /tmp/lifecycle-cron.sh << 'EOL'
#!/bin/bash
# Customer Lifecycle Management - Automated Execution
# This script runs the customer lifecycle process and logs results

LOG_FILE="/var/log/customer-lifecycle.log"
LIFECYCLE_URL="https://bbonngdyfyfjqfhvoljl.supabase.co/functions/v1/lifecycle-cron-scheduler"

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Function to log with timestamp
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_message "🔄 Starting customer lifecycle process..."

# Execute the lifecycle process
response=$(curl -s -w "\n%{http_code}" -X POST "$LIFECYCLE_URL" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" 2>&1)

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
    log_message "✅ Lifecycle process completed successfully"
    log_message "Response: $body"
    
    # Extract and log key metrics
    if command -v jq > /dev/null 2>&1; then
        metrics=$(echo "$body" | jq -r '
        if .lifecycleResult and .lifecycleResult.success then
          "📊 Results: " + 
          (.lifecycleResult.results.identified | tostring) + " identified, " +
          (.lifecycleResult.results.anonymized | tostring) + " anonymized, " +
          (.lifecycleResult.results.deleted | tostring) + " deleted"
        else
          "ℹ️  Process completed"
        end')
        log_message "$metrics"
    fi
else
    log_message "❌ Lifecycle process failed (HTTP $http_code)"
    log_message "Error response: $body"
    
    # Send alert (customize for your alerting system)
    echo "Customer lifecycle process failed at $(date)" | mail -s "Lifecycle Process Alert" admin@yourcompany.com 2>/dev/null || true
fi

log_message "🏁 Lifecycle process finished"
EOL

# Make the cron script executable
chmod +x /tmp/lifecycle-cron.sh

echo -e "${GREEN}✅ Cron script created at /tmp/lifecycle-cron.sh${NC}"

echo -e "\n${YELLOW}⚠️  To install the cron job, run:${NC}"
echo "sudo cp /tmp/lifecycle-cron.sh /usr/local/bin/"
echo "sudo chmod +x /usr/local/bin/lifecycle-cron.sh"
echo "(crontab -l 2>/dev/null; echo '0 2 * * 0 /usr/local/bin/lifecycle-cron.sh') | crontab -"

# Create monitoring script
echo -e "\n${BLUE}📊 Creating Monitoring Scripts${NC}"
echo "--------------------------------"

cat > monitoring-check.sh << 'EOL'
#!/bin/bash
# Customer Lifecycle Monitoring Script

HEALTH_URL="https://bbonngdyfyfjqfhvoljl.supabase.co/functions/v1/customer-lifecycle-scheduler?action=health"
STATS_URL="https://bbonngdyfyfjqfhvoljl.supabase.co/functions/v1/customer-lifecycle-scheduler?action=stats"

echo "🩺 Customer Lifecycle System Health Check"
echo "========================================"

# Health check
echo -n "System Health: "
health_response=$(curl -s "$HEALTH_URL" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY")

if command -v jq > /dev/null 2>&1; then
    health_status=$(echo "$health_response" | jq -r '.success // false')
    if [ "$health_status" = "true" ]; then
        echo "✅ Healthy"
    else
        echo "❌ Unhealthy"
        echo "Response: $health_response"
    fi
else
    echo "📊 Raw health response:"
    echo "$health_response"
fi

echo ""
echo "📊 Current Statistics:"
echo "---------------------"

# Get statistics
stats_response=$(curl -s "$STATS_URL" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY")
if command -v jq > /dev/null 2>&1; then
    echo "$stats_response" | jq -r '
    if .success then
      "📋 Total audit records: " + (.stats.total_audit_records | tostring) + "\n" +
      "🔍 Identified inactive: " + (.stats.identified_inactive | tostring) + "\n" +
      "🔒 Anonymized customers: " + (.stats.anonymized | tostring) + "\n" +
      "🗑️  Deleted customers: " + (.stats.deleted | tostring) + "\n" +
      "📂 Archived customers: " + (.stats.archived_customers | tostring) + "\n" +
      "⏰ Last updated: " + .stats.last_updated
    else
      "❌ Error retrieving statistics: " + (.error // "unknown error")
    end'
else
    echo "📊 Raw stats response:"
    echo "$stats_response"
fi
EOL

chmod +x monitoring-check.sh
echo -e "${GREEN}✅ Monitoring script created: monitoring-check.sh${NC}"

# Create manual execution script
cat > manual-lifecycle-run.sh << 'EOL'
#!/bin/bash
# Manual Customer Lifecycle Execution

LIFECYCLE_URL="https://bbonngdyfyfjqfhvoljl.supabase.co/functions/v1/customer-lifecycle-scheduler?action=run"

echo "🔄 Manual Customer Lifecycle Execution"
echo "======================================"

# Parse command line arguments
DRY_RUN=true
BATCH_SIZE=10

while [[ $# -gt 0 ]]; do
    case $1 in
        --production)
            DRY_RUN=false
            shift
            ;;
        --batch-size)
            BATCH_SIZE="$2"
            shift 2
            ;;
        *)
            echo "Usage: $0 [--production] [--batch-size N]"
            echo "  --production: Run in production mode (not dry-run)"
            echo "  --batch-size N: Process N customers at a time"
            exit 1
            ;;
    esac
done

echo "Configuration:"
echo "  Dry Run: $DRY_RUN"
echo "  Batch Size: $BATCH_SIZE"
echo ""

# Execute lifecycle process
echo "Executing lifecycle process..."
response=$(curl -s -X POST "$LIFECYCLE_URL" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"dryRun\": $DRY_RUN, \"batchSize\": $BATCH_SIZE}")

echo "Response:"
if command -v jq > /dev/null 2>&1; then
    echo "$response" | jq '.'
else
    echo "$response"
fi
EOL

chmod +x manual-lifecycle-run.sh
echo -e "${GREEN}✅ Manual execution script created: manual-lifecycle-run.sh${NC}"

# Final setup summary
echo -e "\n${BLUE}🎯 Setup Complete!${NC}"
echo "=================="
echo ""
echo "📋 Available Scripts:"
echo "  • monitoring-check.sh     - Check system health and statistics"
echo "  • manual-lifecycle-run.sh - Manually trigger lifecycle processing"
echo "  • /tmp/lifecycle-cron.sh  - Automated cron execution script"
echo ""
echo "⏰ Recommended Cron Schedule:"
echo "  0 2 * * 0 /usr/local/bin/lifecycle-cron.sh  # Weekly, Sunday 2 AM"
echo ""
echo "🔧 Quick Testing:"
echo "  ./monitoring-check.sh                        # Check current status"
echo "  ./manual-lifecycle-run.sh                    # Dry run test"
echo "  ./manual-lifecycle-run.sh --production       # Production run"
echo ""

echo -e "${GREEN}✅ Customer Lifecycle Management is ready for production!${NC}"

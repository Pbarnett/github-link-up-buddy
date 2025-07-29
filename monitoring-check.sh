#!/bin/bash
# Customer Lifecycle Monitoring Script
# This script checks the health and provides statistics

HEALTH_URL="https://bbonngdyfyfjqfhvoljl.supabase.co/functions/v1/customer-lifecycle-scheduler?action=health"
STATS_URL="https://bbonngdyfyfjqfhvoljl.supabase.co/functions/v1/customer-lifecycle-scheduler?action=stats"

echo "🩺 Customer Lifecycle System Health Check"
echo "========================================"

# Health check
echo -n "System Health: "
health_response=$(curl -s "$HEALTH_URL" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY")
health_status=$(echo "$health_response" | jq -r '.success // false')

if [ "$health_status" = "true" ]; then
    echo "✅ Healthy"
else
    echo "❌ Unhealthy"
    echo "Response: $health_response"
fi

echo ""
echo "📊 Current Statistics:"
echo "---------------------"

# Get statistics
stats_response=$(curl -s "$STATS_URL" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY")
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

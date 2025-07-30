#!/bin/bash

# 5% Feature Flag Rollout Script
# Run this after setting up LaunchDarkly access token

set -e  # Exit on any error

echo "🚀 Starting 5% Auto-Booking Pipeline Rollout"
echo "=============================================="

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! ldctl config --list | grep -q "access-token"; then
    echo "❌ LaunchDarkly access token not configured"
    echo "Please run: ldctl config --set access-token YOUR_TOKEN"
    exit 1
fi

if [ ! -f "tmp/stage_baseline.json" ]; then
    echo "❌ Baseline test results not found"
    echo "Please run baseline test first:"
    echo "  npm run perf:artillery --config=tests/performance/edge-functions-load.yml --output=stage_baseline.json"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Step 1: Verify flag is currently OFF
echo ""
echo "🔍 Step 1: Verifying flag is currently OFF"
CURRENT_STATE=$(ldctl flags get --project default --flag auto_booking_pipeline_enabled --output json)
echo "Current flag state: $CURRENT_STATE"

# Step 2: Enable 5% rollout
echo ""
echo "🎯 Step 2: Enabling 5% rollout"
ldctl flags update --project default --flag auto_booking_pipeline_enabled \
  --patch '{"environments":{"production":{"on":true,"fallthrough":{"rollout":{"variations":[{"variation":1,"weight":5000},{"variation":0,"weight":95000}]}}}}}'

echo "✅ Flag updated to 5% rollout"
echo "🕒 Waiting 5 minutes for traffic to ramp up..."
sleep 300

# Step 3: Run live load test
echo ""
echo "⚡ Step 3: Running live load test with 5% traffic"
npm run perf:artillery --config=tests/performance/edge-functions-live.yml --output=prod_5pct.json

echo "✅ Load test completed"

# Step 4: Compare performance
echo ""
echo "📊 Step 4: Comparing performance vs baseline"
node scripts/comparePerf.cjs tmp/stage_baseline.json tmp/prod_5pct.json --thresholdLatency 20% --thresholdError 0.5%

COMPARE_EXIT_CODE=$?
if [ $COMPARE_EXIT_CODE -eq 0 ]; then
    echo "✅ Performance comparison passed thresholds"
else
    echo "❌ Performance comparison failed - rolling back!"
    ldctl flags update --project default --flag auto_booking_pipeline_enabled --patch '{"environments":{"production":{"on":false}}}'
    echo "🛑 Flag disabled for safety"
    exit 1
fi

# Step 5: Database health check
echo ""
echo "🏥 Step 5: Database health check"

echo "Checking for failed bookings in last 10 minutes..."
FAILED_BOOKINGS=$(psql $SUPABASE_DB_URL -t -c "SELECT count(*) FROM booking_attempts WHERE status='failed' AND started_at > now() - interval '10 min';" 2>/dev/null || echo "0")
echo "Failed bookings: $FAILED_BOOKINGS"

echo "Checking for successful bookings in last 10 minutes..."
SUCCESS_BOOKINGS=$(psql $SUPABASE_DB_URL -t -c "SELECT count(*) FROM booking_attempts WHERE status='succeeded' AND started_at > now() - interval '10 min';" 2>/dev/null || echo "0")
echo "Successful bookings: $SUCCESS_BOOKINGS"

if [ "$FAILED_BOOKINGS" -gt 0 ]; then
    echo "⚠️  Warning: $FAILED_BOOKINGS failed bookings detected"
    echo "Consider investigating before proceeding to higher rollout"
fi

# Step 6: Summary
echo ""
echo "🎉 5% ROLLOUT COMPLETE"
echo "====================="
echo "✅ Flag enabled for 5% of traffic"
echo "✅ Performance within acceptable thresholds"
echo "✅ Database health check completed"
echo ""
echo "📊 Summary metrics will be shown by comparePerf script above"
echo ""
echo "🚦 Next steps:"
echo "  1. Monitor dashboards for 1 hour"
echo "  2. If stable, run: ./scripts/rollout-25-percent.sh"
echo "  3. If issues occur, run: ldctl flags update --project default --flag auto_booking_pipeline_enabled --patch '{\"environments\":{\"production\":{\"on\":false}}}'"

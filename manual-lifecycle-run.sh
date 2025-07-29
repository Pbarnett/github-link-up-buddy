#!/bin/bash
# Manual Customer Lifecycle Execution
# Use this script to manually trigger lifecycle processing

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
echo "$response" | jq '.'

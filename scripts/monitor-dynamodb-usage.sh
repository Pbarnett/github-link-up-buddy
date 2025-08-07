#!/bin/bash

# DynamoDB Usage Monitor
# Helps analyze current usage patterns to make billing mode decisions
# 
# Prerequisites:
# - AWS CLI configured
# - jq installed (brew install jq)
#
# Usage: ./scripts/monitor-dynamodb-usage.sh [table-name] [days] [region]

set -e

# Configuration
TABLE_NAME=${1:-"github-link-buddy-links-production"}
DAYS=${2:-14}  # Default to 2 weeks of data
REGION=${3:-"us-east-1"}
NAMESPACE="AWS/DynamoDB"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 DynamoDB Usage Analysis for ${TABLE_NAME}${NC}"
echo -e "${BLUE}============================================================${NC}"
echo "📅 Analyzing last ${DAYS} days of data"
echo "🌍 Region: ${REGION}"
echo ""

# Check if table exists
echo "🔍 Checking if table exists..."
if ! aws dynamodb describe-table --table-name "$TABLE_NAME" --region "$REGION" > /dev/null 2>&1; then
    echo -e "${RED}❌ Table '$TABLE_NAME' not found in region '$REGION'${NC}"
    echo "Available tables:"
    aws dynamodb list-tables --region "$REGION" --output table
    exit 1
fi

echo -e "${GREEN}✅ Table found${NC}"

# Get current table configuration
TABLE_INFO=$(aws dynamodb describe-table --table-name "$TABLE_NAME" --region "$REGION")
CURRENT_BILLING_MODE=$(echo "$TABLE_INFO" | jq -r '.Table.BillingModeSummary.BillingMode')
TABLE_CLASS=$(echo "$TABLE_INFO" | jq -r '.Table.TableClassSummary.TableClass // "STANDARD"')

echo ""
echo "📋 Current Configuration:"
echo "   Billing Mode: $CURRENT_BILLING_MODE"
echo "   Table Class: $TABLE_CLASS"

# Calculate date range (compatible with macOS and Linux)
END_TIME=$(date -u +"%Y-%m-%dT%H:%M:%S")
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    START_TIME=$(date -u -v-${DAYS}d +"%Y-%m-%dT%H:%M:%S")
else
    # Linux
    START_TIME=$(date -u -d "${DAYS} days ago" +"%Y-%m-%dT%H:%M:%S")
fi

echo "   Analysis Period: $START_TIME to $END_TIME"
echo ""

# Function to get CloudWatch metrics
get_metric() {
    local metric_name=$1
    local stat_type=$2
    local dimension_name=$3
    local dimension_value=$4
    
    aws cloudwatch get-metric-statistics \
        --namespace "$NAMESPACE" \
        --metric-name "$metric_name" \
        --dimensions Name="$dimension_name",Value="$dimension_value" \
        --start-time "$START_TIME" \
        --end-time "$END_TIME" \
        --period 3600 \
        --statistics "$stat_type" \
        --region "$REGION" \
        --output json | jq -r '.Datapoints | sort_by(.Timestamp) | .[] | .'"$stat_type"
}

# Function to calculate statistics from array
calculate_stats() {
    local values=("$@")
    local sum=0
    local count=${#values[@]}
    local max=0
    local min=999999
    
    if [ $count -eq 0 ]; then
        echo "0 0 0 0"
        return
    fi
    
    for value in "${values[@]}"; do
        value=$(printf "%.0f" "$value")  # Round to nearest integer
        sum=$((sum + value))
        if (( $(echo "$value > $max" | bc -l) )); then
            max=$value
        fi
        if (( $(echo "$value < $min" | bc -l) )); then
            min=$value
        fi
    done
    
    local avg=$((sum / count))
    echo "$avg $max $min $sum"
}

# Analyze main table metrics
echo "📊 Main Table Analysis:"
echo "========================"

# Get consumed capacity data
echo "🔍 Collecting read capacity data..."
read_data=($(get_metric "ConsumedReadCapacityUnits" "Sum" "TableName" "$TABLE_NAME"))

echo "🔍 Collecting write capacity data..."
write_data=($(get_metric "ConsumedWriteCapacityUnits" "Sum" "TableName" "$TABLE_NAME"))

# Calculate read statistics
if [ ${#read_data[@]} -gt 0 ]; then
    read_stats=($(calculate_stats "${read_data[@]}"))
    read_avg=${read_stats[0]}
    read_max=${read_stats[1]}
    read_min=${read_stats[2]}
    read_total=${read_stats[3]}
    
    # Convert to per-second values (from hourly sums)
    read_avg_per_sec=$(echo "scale=2; $read_avg / 3600" | bc)
    read_max_per_sec=$(echo "scale=2; $read_max / 3600" | bc)
    
    echo -e "${GREEN}📖 Read Capacity:${NC}"
    echo "   Average: $read_avg_per_sec reads/sec ($read_avg reads/hour)"
    echo "   Peak: $read_max_per_sec reads/sec ($read_max reads/hour)"
    echo "   Total: $read_total reads over $DAYS days"
    
    # Calculate consistency score (lower variance = higher consistency)
    if (( $(echo "$read_avg > 0" | bc -l) )); then
        read_variance=0
        for value in "${read_data[@]}"; do
            diff=$(echo "$value - $read_avg" | bc)
            squared=$(echo "$diff * $diff" | bc)
            read_variance=$(echo "$read_variance + $squared" | bc)
        done
        read_variance=$(echo "scale=2; $read_variance / ${#read_data[@]}" | bc)
        read_stddev=$(echo "scale=2; sqrt($read_variance)" | bc)
        read_consistency=$(echo "scale=0; (100 - ($read_stddev / $read_avg * 100))" | bc)
        if (( $(echo "$read_consistency < 0" | bc -l) )); then
            read_consistency=0
        fi
    else
        read_consistency=0
    fi
    
    echo "   Consistency Score: ${read_consistency}% (higher = more consistent)"
else
    echo -e "${YELLOW}⚠️  No read capacity data available${NC}"
    read_avg_per_sec=0
    read_max_per_sec=0
    read_consistency=0
fi

# Calculate write statistics
if [ ${#write_data[@]} -gt 0 ]; then
    write_stats=($(calculate_stats "${write_data[@]}"))
    write_avg=${write_stats[0]}
    write_max=${write_stats[1]}
    write_min=${write_stats[2]}
    write_total=${write_stats[3]}
    
    write_avg_per_sec=$(echo "scale=2; $write_avg / 3600" | bc)
    write_max_per_sec=$(echo "scale=2; $write_max / 3600" | bc)
    
    echo -e "${GREEN}✍️  Write Capacity:${NC}"
    echo "   Average: $write_avg_per_sec writes/sec ($write_avg writes/hour)"
    echo "   Peak: $write_max_per_sec writes/sec ($write_max writes/hour)"
    echo "   Total: $write_total writes over $DAYS days"
    
    # Calculate write consistency
    if (( $(echo "$write_avg > 0" | bc -l) )); then
        write_variance=0
        for value in "${write_data[@]}"; do
            diff=$(echo "$value - $write_avg" | bc)
            squared=$(echo "$diff * $diff" | bc)
            write_variance=$(echo "$write_variance + $squared" | bc)
        done
        write_variance=$(echo "scale=2; $write_variance / ${#write_data[@]}" | bc)
        write_stddev=$(echo "scale=2; sqrt($write_variance)" | bc)
        write_consistency=$(echo "scale=0; (100 - ($write_stddev / $write_avg * 100))" | bc)
        if (( $(echo "$write_consistency < 0" | bc -l) )); then
            write_consistency=0
        fi
    else
        write_consistency=0
    fi
    
    echo "   Consistency Score: ${write_consistency}% (higher = more consistent)"
else
    echo -e "${YELLOW}⚠️  No write capacity data available${NC}"
    write_avg_per_sec=0
    write_max_per_sec=0
    write_consistency=0
fi

echo ""

# Check for throttling
echo "🚨 Throttling Analysis:"
throttle_data=($(get_metric "ThrottledRequests" "Sum" "TableName" "$TABLE_NAME"))
total_throttles=0
for throttle in "${throttle_data[@]}"; do
    total_throttles=$(echo "$total_throttles + $throttle" | bc)
done

if (( $(echo "$total_throttles > 0" | bc -l) )); then
    echo -e "${RED}⚠️  THROTTLING DETECTED: $total_throttles throttled requests${NC}"
    echo "   This indicates capacity constraints!"
else
    echo -e "${GREEN}✅ No throttling detected${NC}"
fi

echo ""

# Analyze Global Secondary Index if it exists
GSI_NAME="UserIndex"
echo "📊 Global Secondary Index Analysis ($GSI_NAME):"
echo "================================================"

gsi_read_data=($(get_metric "ConsumedReadCapacityUnits" "Sum" "TableName" "$TABLE_NAME" | head -10))  # Limit for GSI check
if [ ${#gsi_read_data[@]} -gt 0 ]; then
    # Try to get GSI-specific metrics
    gsi_read_data_specific=($(aws cloudwatch get-metric-statistics \
        --namespace "$NAMESPACE" \
        --metric-name "ConsumedReadCapacityUnits" \
        --dimensions Name="TableName",Value="$TABLE_NAME" Name="GlobalSecondaryIndexName",Value="$GSI_NAME" \
        --start-time "$START_TIME" \
        --end-time "$END_TIME" \
        --period 3600 \
        --statistics Sum \
        --region "$REGION" \
        --output json | jq -r '.Datapoints | sort_by(.Timestamp) | .[] | .Sum' 2>/dev/null || echo ""))
    
    if [ ${#gsi_read_data_specific[@]} -gt 0 ]; then
        gsi_stats=($(calculate_stats "${gsi_read_data_specific[@]}"))
        gsi_avg_per_sec=$(echo "scale=2; ${gsi_stats[0]} / 3600" | bc)
        gsi_max_per_sec=$(echo "scale=2; ${gsi_stats[1]} / 3600" | bc)
        
        echo -e "${GREEN}📖 GSI Read Capacity:${NC}"
        echo "   Average: $gsi_avg_per_sec reads/sec"
        echo "   Peak: $gsi_max_per_sec reads/sec"
    else
        echo -e "${YELLOW}⚠️  No GSI-specific metrics available${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  GSI metrics not available${NC}"
fi

echo ""

# Cost Analysis and Recommendations
echo "💰 Cost Analysis & Recommendations:"
echo "===================================="

# Calculate recommended provisioned capacity (with buffer)
recommended_read_capacity=$(echo "($read_avg_per_sec * 1.2 + 0.5) / 1" | bc)  # 20% buffer, round up
recommended_write_capacity=$(echo "($write_avg_per_sec * 1.2 + 0.5) / 1" | bc)

# Ensure minimum capacity
if (( $(echo "$recommended_read_capacity < 5" | bc -l) )); then
    recommended_read_capacity=5
fi
if (( $(echo "$recommended_write_capacity < 5" | bc -l) )); then
    recommended_write_capacity=5
fi

# Calculate peak-to-average ratios
read_peak_ratio=$(echo "scale=1; $read_max_per_sec / ($read_avg_per_sec + 0.001)" | bc)
write_peak_ratio=$(echo "scale=1; $write_max_per_sec / ($write_avg_per_sec + 0.001)" | bc)

# Overall consistency score
overall_consistency=$(echo "($read_consistency + $write_consistency) / 2" | bc)

echo "🎯 Traffic Pattern Analysis:"
echo "   Read Peak/Average Ratio: ${read_peak_ratio}x"
echo "   Write Peak/Average Ratio: ${write_peak_ratio}x"
echo "   Overall Consistency Score: ${overall_consistency}%"
echo ""

echo "💡 Provisioned Capacity Recommendation:"
echo "   Recommended Read Capacity: $recommended_read_capacity RCUs"
echo "   Recommended Write Capacity: $recommended_write_capacity WCUs"
echo ""

# Generate recommendation
if (( $(echo "$overall_consistency >= 70 && $read_peak_ratio <= 3 && $write_peak_ratio <= 3" | bc -l) )); then
    echo -e "${GREEN}🎯 RECOMMENDATION: SWITCH TO PROVISIONED${NC}"
    echo "   ✅ High consistency score (${overall_consistency}%)"
    echo "   ✅ Reasonable peak-to-average ratios"
    echo "   ✅ Predictable traffic pattern"
    echo ""
    echo -e "${BLUE}📝 Next Steps:${NC}"
    echo "   1. Update CloudFormation parameter: BillingMode=PROVISIONED"
    echo "   2. Set BaseReadCapacity=$recommended_read_capacity"
    echo "   3. Set BaseWriteCapacity=$recommended_write_capacity"
    echo "   4. Deploy and monitor for throttling"
elif (( $(echo "$overall_consistency >= 50 && $read_peak_ratio <= 5 && $write_peak_ratio <= 5" | bc -l) )); then
    echo -e "${YELLOW}🤔 RECOMMENDATION: CONSIDER PROVISIONED${NC}"
    echo "   ⚠️  Moderate consistency score (${overall_consistency}%)"
    echo "   ⚠️  Some traffic variability"
    echo "   💡 Consider testing with provisioned mode"
elif (( $(echo "$total_throttles > 0" | bc -l) )); then
    echo -e "${RED}⚠️  RECOMMENDATION: STAY ON-DEMAND FOR NOW${NC}"
    echo "   ❌ Throttling detected - indicates unpredictable spikes"
    echo "   ❌ On-Demand better handles traffic variability"
else
    echo -e "${BLUE}📊 RECOMMENDATION: CONTINUE MONITORING${NC}"
    echo "   📈 Collect more data (low consistency: ${overall_consistency}%)"
    echo "   📈 High traffic variability detected"
    echo "   📈 On-Demand is safer for unpredictable workloads"
fi

echo ""
echo "📞 For detailed cost projections, run:"
echo "   node scripts/dynamodb-cost-calculator.js"
echo ""
echo "🔗 Optimization resources:"
echo "   📄 aws-templates/dynamodb-optimization-analysis.md"
echo "   🏗️  aws-templates/dynamodb-optimized-template.yml"

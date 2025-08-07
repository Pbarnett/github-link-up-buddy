#!/bin/bash

# Simplified Gradual Rollout Script
# Updates DynamoDB directly and monitors Prometheus metrics

set -euo pipefail

FLAG_NAME="ENABLE_CONFIG_DRIVEN_FORMS"
TABLE_NAME="FeatureFlagConfigs"
ROLLOUT_STEPS=(10 25 50 75 100)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Update DynamoDB feature flag
update_feature_flag() {
    local percentage=$1
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    log "🔄 Updating ${FLAG_NAME} to ${percentage}%..."
    
    aws dynamodb update-item \
        --table-name "$TABLE_NAME" \
        --key '{"flagName":{"S":"'$FLAG_NAME'"}}' \
        --update-expression "SET rolloutPercentage = :rp, updatedAt = :ua, updatedBy = :ub" \
        --expression-attribute-values '{
            ":rp":{"N":"'$percentage'"},
            ":ua":{"S":"'$timestamp'"},
            ":ub":{"S":"gradual-rollout-script"}
        }' --output table > /dev/null
    
    success "✅ Updated to ${percentage}%"
}

# Emergency rollback
emergency_rollback() {
    error "🚨 EMERGENCY ROLLBACK TRIGGERED!"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    aws dynamodb update-item \
        --table-name "$TABLE_NAME" \
        --key '{"flagName":{"S":"'$FLAG_NAME'"}}' \
        --update-expression "SET rolloutPercentage = :rp, killSwitch = :ks, updatedAt = :ua, updatedBy = :ub" \
        --expression-attribute-values '{
            ":rp":{"N":"5"},
            ":ks":{"BOOL":true},
            ":ua":{"S":"'$timestamp'"},
            ":ub":{"S":"emergency-rollback"}
        }' --output table > /dev/null
    
    error "❌ Rollback complete. Feature flag set to 5% with kill switch enabled."
    exit 1
}

# Check Prometheus alerts
check_prometheus_alerts() {
    log "🔍 Checking Prometheus alerts..."
    
    local alerts=$(curl -s "http://localhost:9090/api/v1/alerts" | jq '.data.alerts | map(select(.state == "firing")) | length')
    
    if [ "$alerts" -gt 0 ]; then
        error "🚨 ${alerts} alert(s) are firing!"
        return 1
    fi
    
    success "✅ No firing alerts"
    return 0
}

# Check metrics via monitor ping
check_metrics() {
    log "📊 Running monitor ping to check metrics..."
    
    if npm run monitor:ping > /tmp/monitor_output.log 2>&1; then
        # Extract key metrics from output
        local feature_flag_hits=$(grep "Feature Flag Hits:" /tmp/monitor_output.log | awk '{print $NF}' || echo "0")
        local config_requests=$(grep "Business Rules Config Requests:" /tmp/monitor_output.log | awk '{print $NF}' || echo "0")
        
        log "Current metrics - Feature flags: $feature_flag_hits, Config requests: $config_requests"
        success "✅ Metrics check passed"
        return 0
    else
        error "❌ Monitor ping failed"
        return 1
    fi
}

# Monitor for specified duration with shorter waits for demo
monitor_phase() {
    local percentage=$1
    local duration=60  # 1 minute for demo (instead of 1 hour)
    
    log "⏱️ Monitoring ${percentage}% rollout for ${duration} seconds..."
    
    local checks=3  # 3 checks over 1 minute
    local interval=$((duration / checks))
    
    for i in $(seq 1 $checks); do
        log "Health check ${i}/${checks}..."
        
        # Check Prometheus alerts
        if ! check_prometheus_alerts; then
            emergency_rollback
        fi
        
        # Check metrics
        if ! check_metrics; then
            emergency_rollback
        fi
        
        if [ $i -lt $checks ]; then
            log "Waiting ${interval} seconds..."
            sleep $interval
        fi
    done
    
    success "✅ ${percentage}% monitoring phase complete"
}

# Main execution
main() {
    log "🚀 Starting gradual rollout for ${FLAG_NAME}"
    log "Steps: ${ROLLOUT_STEPS[*]}"
    echo
    
    # Trap for emergency rollback
    trap emergency_rollback INT TERM
    
    for percentage in "${ROLLOUT_STEPS[@]}"; do
        echo "----------------------------------------"
        log "📈 Phase: ${percentage}% rollout"
        
        # Update feature flag
        update_feature_flag "$percentage"
        
        # Monitor this phase
        monitor_phase "$percentage"
        
        # Ask for approval to continue (except for last step)
        if [ "$percentage" != "100" ]; then
            echo
            read -p "Continue to next phase? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                warning "Rollout stopped by user"
                exit 0
            fi
        fi
    done
    
    echo "========================================"
    success "🎉 Gradual rollout completed successfully!"
    log "Feature flag ${FLAG_NAME} is now at 100%"
    echo
    log "🔥 Continue monitoring via:"
    log "   • Grafana: http://localhost:3001"
    log "   • Prometheus: http://localhost:9090"
    log "   • Alerts: http://localhost:9093"
}

# Dependency checks
for cmd in aws jq curl npm; do
    if ! command -v "$cmd" &> /dev/null; then
        error "$cmd is required but not installed"
        exit 1
    fi
done

# Run
main "$@"

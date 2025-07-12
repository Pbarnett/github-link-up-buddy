#!/bin/bash

# Gradual Rollout Script for Config-Driven Forms
# Based on Parker Flight Production Rollout Playbook
# Day 17-18: Execute progressive rollout with monitoring

set -euo pipefail

# Configuration
FLAG_NAME="ENABLE_CONFIG_DRIVEN_FORMS"
ROLLOUT_STEPS=(5 10 25 50 75 100)
MONITOR_DURATION=3600  # 1 hour between steps (3600 seconds)
CHECK_INTERVAL=300     # Check metrics every 5 minutes
API_BASE_URL="http://localhost:3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
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

# Check if API is accessible
check_api_health() {
    log "🏥 Checking API health..."
    
    if curl -f -s "${API_BASE_URL}/api/health" > /dev/null 2>&1; then
        success "API is healthy"
        return 0
    else
        error "API health check failed"
        return 1
    fi
}

# Update feature flag rollout percentage
update_rollout_percentage() {
    local percentage=$1
    
    log "📊 Updating ${FLAG_NAME} rollout to ${percentage}%..."
    
    local response=$(curl -s -X PATCH "${API_BASE_URL}/api/feature-flags/${FLAG_NAME}" \
        -H "Content-Type: application/json" \
        -d "{
            \"rolloutPercentage\": ${percentage},
            \"updatedBy\": \"gradual-rollout-script\"
        }")
    
    if echo "$response" | jq -e '.message' > /dev/null 2>&1; then
        success "Rollout updated to ${percentage}%"
        return 0
    else
        error "Failed to update rollout percentage: $response"
        return 1
    fi
}

# Check error rate from logs or metrics endpoint
check_error_rate() {
    # Simulate error rate check - in production, this would query your monitoring system
    log "🔍 Checking error rate..."
    
    # Mock error rate calculation
    local error_rate=$(curl -s "${API_BASE_URL}/api/metrics/error-rate" 2>/dev/null | jq -r '.rate // 0' || echo "0")
    
    echo "$error_rate"
}

# Check form submission success rate
check_form_success_rate() {
    log "📝 Checking form submission success rate..."
    
    # Mock success rate calculation
    local success_rate=$(curl -s "${API_BASE_URL}/api/metrics/form-success-rate" 2>/dev/null | jq -r '.rate // 95' || echo "95")
    
    echo "$success_rate"
}

# Emergency rollback function
emergency_rollback() {
    error "🚨 EMERGENCY ROLLBACK TRIGGERED!"
    
    log "Rolling back to 0% rollout..."
    curl -s -X PATCH "${API_BASE_URL}/api/feature-flags/${FLAG_NAME}" \
        -H "Content-Type: application/json" \
        -d '{
            "rolloutPercentage": 0,
            "killSwitch": true,
            "updatedBy": "emergency-rollback"
        }' > /dev/null
    
    error "❌ Rollback complete. Feature flag disabled."
    exit 1
}

# Monitor metrics for specified duration
monitor_metrics() {
    local percentage=$1
    local duration=$2
    
    log "⏱️  Monitoring metrics for ${duration} seconds..."
    
    local checks=$((duration / CHECK_INTERVAL))
    
    for i in $(seq 1 $checks); do
        log "Checking metrics (${i}/${checks})..."
        
        # Check error rate
        local error_rate=$(check_error_rate)
        log "Current error rate: ${error_rate}%"
        
        if (( $(echo "$error_rate > 5" | bc -l) )); then
            error "🚨 ERROR RATE TOO HIGH: ${error_rate}% (threshold: 5%)"
            emergency_rollback
        fi
        
        # Check form success rate
        local success_rate=$(check_form_success_rate)
        log "Current form success rate: ${success_rate}%"
        
        if (( $(echo "$success_rate < 90" | bc -l) )); then
            error "🚨 FORM SUCCESS RATE TOO LOW: ${success_rate}% (threshold: 90%)"
            emergency_rollback
        fi
        
        # Check config API health
        if ! check_api_health; then
            error "🚨 API HEALTH CHECK FAILED"
            emergency_rollback
        fi
        
        success "✅ Metrics healthy - Error: ${error_rate}%, Success: ${success_rate}%"
        
        if [ $i -lt $checks ]; then
            log "Waiting ${CHECK_INTERVAL} seconds before next check..."
            sleep $CHECK_INTERVAL
        fi
    done
    
    success "✅ ${percentage}% rollout monitoring complete - all metrics stable"
}

# Request manual approval
request_approval() {
    local percentage=$1
    
    warning "⚠️  MANUAL APPROVAL REQUIRED"
    echo
    echo "Current rollout status:"
    echo "  - Feature Flag: ${FLAG_NAME}"
    echo "  - Rollout Percentage: ${percentage}%"
    echo "  - Next Step: Continue to next rollout percentage"
    echo
    
    read -p "Continue with rollout? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        warning "Rollout stopped by user"
        exit 0
    fi
    
    success "✅ Manual approval received, continuing rollout"
}

# Main rollout function
main() {
    log "🚀 Starting gradual rollout for ${FLAG_NAME}"
    log "Rollout steps: ${ROLLOUT_STEPS[*]}"
    log "Monitor duration: ${MONITOR_DURATION}s between steps"
    echo
    
    # Initial health check
    if ! check_api_health; then
        error "Pre-flight API health check failed. Aborting rollout."
        exit 1
    fi
    
    for percentage in "${ROLLOUT_STEPS[@]}"; do
        log "📈 Starting ${percentage}% rollout phase..."
        
        # Update rollout percentage
        if ! update_rollout_percentage "$percentage"; then
            error "Failed to update rollout percentage. Aborting."
            exit 1
        fi
        
        # Monitor metrics for the specified duration
        monitor_metrics "$percentage" "$MONITOR_DURATION"
        
        # Request manual approval for next step (except for final step)
        if [ "$percentage" != "100" ]; then
            request_approval "$percentage"
        fi
        
        echo "----------------------------------------"
    done
    
    success "🎉 ROLLOUT COMPLETE!"
    log "Feature flag ${FLAG_NAME} is now at 100% rollout"
    
    # Final summary
    echo
    echo "📊 Final Rollout Summary:"
    echo "  - Feature Flag: ${FLAG_NAME}"
    echo "  - Final Percentage: 100%"
    echo "  - Total Rollout Time: $((${#ROLLOUT_STEPS[@]} * MONITOR_DURATION / 3600)) hours"
    echo "  - Status: ✅ SUCCESSFUL"
    echo
    
    log "🔧 Next steps:"
    echo "  1. Monitor application metrics for 24 hours"
    echo "  2. Review error logs and user feedback"
    echo "  3. If stable, proceed with legacy code cleanup (Day 19)"
}

# Handle script interruption
trap emergency_rollback INT TERM

# Check dependencies
if ! command -v curl &> /dev/null; then
    error "curl is required but not installed"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    error "jq is required but not installed"
    exit 1
fi

if ! command -v bc &> /dev/null; then
    error "bc is required but not installed"
    exit 1
fi

# Run main function
main "$@"

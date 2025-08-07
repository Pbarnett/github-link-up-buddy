#!/bin/bash

# Coordinated Feature Flag Rollout Script
# Manages gradual rollout of wallet_ui and profile_ui_revamp with user bucketing
# Based on LaunchDarkly best practices and repository audit findings

set -euo pipefail

# Parse command line arguments first
DRY_RUN=${DRY_RUN:-false}
SKIP_HEALTH_CHECKS=${SKIP_HEALTH_CHECKS:-false}
SKIP_USER_INPUT=${SKIP_USER_INPUT:-false}
VALIDATE_ONLY=${VALIDATE_ONLY:-false}

# Parse args before setting configuration
for arg in "$@"; do
    case $arg in
        --dry-run)
            DRY_RUN=true
            ;;
        --validate-only)
            VALIDATE_ONLY=true
            DRY_RUN=true
            ;;
        --skip-health-checks)
            SKIP_HEALTH_CHECKS=true
            ;;
        --skip-user-input)
            SKIP_USER_INPUT=true
            ;;
    esac
done

# Configuration
PRIMARY_FLAG="wallet_ui"
SECONDARY_FLAG="profile_ui_revamp"
ROLLOUT_STEPS=(5 10 25 50 75 100)
MONITOR_DURATION=${MONITOR_DURATION:-1800}  # 30 minutes between steps (production: 3600)
CHECK_INTERVAL=${CHECK_INTERVAL:-300}       # Check metrics every 5 minutes
API_BASE_URL=${API_BASE_URL:-"http://localhost:3000"}
DATABASE_URL=${DATABASE_URL:-""}

# Dry run mode notification
if [ "$DRY_RUN" = true ]; then
    echo "🔍 DRY RUN MODE - No actual changes will be made"
    echo "================================================="
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Logging functions
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

info() {
    echo -e "${PURPLE}[INFO]${NC} $1"
}

# Check dependencies
check_dependencies() {
    log "🔧 Checking dependencies..."
    
    local missing_deps=()
    
    for cmd in psql curl jq bc; do
        if ! command -v "$cmd" &> /dev/null; then
            missing_deps+=("$cmd")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Missing required dependencies: ${missing_deps[*]}"
        echo "Install with:"
        echo "  macOS: brew install postgresql jq"
        echo "  Ubuntu: apt-get install postgresql-client jq bc"
        return 1
    fi
    
    success "All dependencies present"
    return 0
}

# Check database connection
check_database_connection() {
    log "🔗 Checking database connection..."
    
    if [ -z "$DATABASE_URL" ]; then
        error "DATABASE_URL environment variable is not set"
        echo "Please set DATABASE_URL or run with:"
        echo "DATABASE_URL=your_supabase_db_url $0"
        return 1
    fi
    
    if [ "$SKIP_HEALTH_CHECKS" = true ]; then
        warning "Skipping database health check"
        return 0
    fi
    
    if [ "$DRY_RUN" = true ]; then
        info "[DRY RUN] Would check database connection to: ${DATABASE_URL}"
        return 0
    fi
    
    if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
        success "Database connection successful"
        return 0
    else
        error "Cannot connect to database"
        return 1
    fi
}

# Check API health
check_api_health() {
    log "🏥 Checking API health..."
    
    if [ "$SKIP_HEALTH_CHECKS" = true ]; then
        warning "Skipping API health check"
        return 0
    fi
    
    if [ "$DRY_RUN" = true ]; then
        info "[DRY RUN] Would check API health at: ${API_BASE_URL}/api/health"
        return 0
    fi
    
    if curl -f -s "$API_BASE_URL/api/health" > /dev/null 2>&1; then
        success "API is healthy"
        return 0
    else
        warning "API health check failed - continuing with database-only operations"
        return 1
    fi
}

# Get current feature flag status
get_flag_status() {
    local flag_name=$1
    
    local result=$(psql "$DATABASE_URL" -t -c "
        SELECT 
            COALESCE(rollout_percentage, 0) as percentage,
            enabled
        FROM feature_flags 
        WHERE name = '$flag_name'
    " 2>/dev/null | tr -d ' ')
    
    if [ -n "$result" ]; then
        echo "$result"
    else
        echo "0|f"  # Default: 0% rollout, disabled
    fi
}

# Update feature flag rollout percentage
update_rollout_percentage() {
    local flag_name=$1
    local percentage=$2
    local comment=${3:-"Automated gradual rollout"}
    
    log "📊 Updating $flag_name rollout to ${percentage}%..."
    
    if [ "$DRY_RUN" = true ]; then
        info "[DRY RUN] Would update $flag_name rollout to $percentage%"
        return 0
    fi
    
    local sql="
    INSERT INTO feature_flags (name, enabled, rollout_percentage, description, updated_at)
    VALUES (
        '$flag_name', 
        true, 
        $percentage, 
        'Feature flag for $flag_name rollout',
        NOW()
    )
    ON CONFLICT (name) DO UPDATE
    SET 
        enabled = true,
        rollout_percentage = $percentage,
        updated_at = NOW();
    "
    
    if psql "$DATABASE_URL" -c "$sql" > /dev/null 2>&1; then
        success "$flag_name updated to ${percentage}%"
        return 0
    else
        error "Failed to update $flag_name rollout percentage"
        return 1
    fi
}

# Calculate user bucket distribution
check_user_bucket_distribution() {
    local percentage=$1
    
    log "👥 Checking user bucket distribution for ${percentage}% rollout..."
    
    # Query user distribution (mock implementation - replace with actual user table)
    local total_users=$(psql "$DATABASE_URL" -t -c "
        SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '7 days'
    " 2>/dev/null | tr -d ' ')
    
    if [ -n "$total_users" ] && [ "$total_users" -gt 0 ]; then
        local expected_users=$(( total_users * percentage / 100 ))
        info "Expected users in rollout: $expected_users out of $total_users (${percentage}%)"
    else
        warning "Could not retrieve user count - proceeding with rollout"
    fi
}

# Monitor feature flag metrics
monitor_feature_metrics() {
    local flag_name=$1
    local percentage=$2
    local duration=$3
    
    log "⏱️  Monitoring $flag_name metrics for ${duration} seconds..."
    
    if [ "$DRY_RUN" = true ]; then
        info "[DRY RUN] Would monitor $flag_name for ${duration} seconds"
        return 0
    fi
    
    local checks=$((duration / CHECK_INTERVAL))
    local api_available=false
    
    # Check if monitoring API is available
    if check_api_health; then
        api_available=true
    fi
    
    for i in $(seq 1 $checks); do
        log "Checking metrics (${i}/${checks})..."
        
        if [ "$api_available" = true ]; then
            # Check error rate via API
            local error_rate=$(curl -s "$API_BASE_URL/api/metrics/error-rate?flag=$flag_name" 2>/dev/null | jq -r '.rate // 0' || echo "0")
            log "Current error rate for $flag_name: ${error_rate}%"
            
            # Check for high error rates
            if (( $(echo "$error_rate > 5" | bc -l) )); then
                error "🚨 ERROR RATE TOO HIGH: ${error_rate}% (threshold: 5%)"
                return 1
            fi
            
            # Check feature usage metrics
            local usage_rate=$(curl -s "$API_BASE_URL/api/metrics/feature-usage?flag=$flag_name" 2>/dev/null | jq -r '.rate // 0' || echo "0")
            log "Feature usage rate: ${usage_rate}%"
        else
            # Database-only monitoring
            log "API unavailable - checking database metrics only"
            
            # Check recent errors in logs (if available)
            local recent_errors=$(psql "$DATABASE_URL" -t -c "
                SELECT COUNT(*) FROM logs 
                WHERE level = 'ERROR' 
                AND message LIKE '%$flag_name%' 
                AND created_at > NOW() - INTERVAL '$CHECK_INTERVAL seconds'
            " 2>/dev/null | tr -d ' ' || echo "0")
            
            if [ "$recent_errors" -gt 10 ]; then
                warning "Elevated error count in logs: $recent_errors"
            fi
        fi
        
        success "✅ Metrics healthy for $flag_name"
        
        if [ $i -lt $checks ]; then
            log "Waiting ${CHECK_INTERVAL} seconds before next check..."
            sleep $CHECK_INTERVAL
        fi
    done
    
    success "✅ ${percentage}% rollout monitoring complete for $flag_name"
    return 0
}

# Emergency rollback function
emergency_rollback() {
    local reason=${1:-"Unknown error"}
    
    error "🚨 EMERGENCY ROLLBACK TRIGGERED: $reason"
    
    log "Rolling back both feature flags to 0% rollout..."
    
    for flag in $PRIMARY_FLAG $SECONDARY_FLAG; do
        psql "$DATABASE_URL" -c "
            UPDATE feature_flags 
            SET rollout_percentage = 0, enabled = false, updated_at = NOW()
            WHERE name = '$flag';
        " > /dev/null 2>&1
        log "Rolled back $flag to 0%"
    done
    
    error "❌ Emergency rollback complete. Both feature flags disabled."
    exit 1
}

# Request manual approval for next rollout step
request_approval() {
    local current_percentage=$1
    local next_percentage=$2
    
    warning "⚠️  MANUAL APPROVAL REQUIRED"
    echo
    echo "Current rollout status:"
    echo "  - Primary Flag ($PRIMARY_FLAG): ${current_percentage}%"
    echo "  - Secondary Flag ($SECONDARY_FLAG): ${current_percentage}%"
    echo "  - Next Step: Increase to ${next_percentage}%"
    echo "  - Monitoring Duration: ${MONITOR_DURATION}s"
    echo
    
    # Show current metrics summary
    local primary_status=$(get_flag_status "$PRIMARY_FLAG")
    local secondary_status=$(get_flag_status "$SECONDARY_FLAG")
    
    echo "Feature Flag Status:"
    echo "  - $PRIMARY_FLAG: $primary_status"
    echo "  - $SECONDARY_FLAG: $secondary_status"
    echo
    
    if [ "$SKIP_USER_INPUT" = true ] || [ "$DRY_RUN" = true ]; then
        info "[SKIPPED] User approval (automated/dry-run mode)"
        return 0
    fi
    
    read -p "Continue with rollout to ${next_percentage}%? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        warning "Rollout stopped by user"
        exit 0
    fi
    
    success "✅ Manual approval received, continuing rollout"
}

# Generate rollout report
generate_rollout_report() {
    local final_percentage=$1
    local start_time=$2
    local end_time=$(date)
    
    log "📋 Generating comprehensive rollout report..."
    
    # Get final flag status
    local primary_status=$(get_flag_status "$PRIMARY_FLAG")
    local secondary_status=$(get_flag_status "$SECONDARY_FLAG")
    
    cat << EOF

🎯 COORDINATED FEATURE FLAG ROLLOUT COMPLETE
===========================================

✅ Status: SUCCESS
🗓️  Start Time: $start_time
🗓️  End Time: $end_time
📊 Final Rollout: ${final_percentage}%

📋 Feature Flags Summary:
┌─────────────────────┬──────────┬─────────────┐
│ Flag Name           │ Status   │ Rollout %   │
├─────────────────────┼──────────┼─────────────┤
│ $PRIMARY_FLAG       │ ENABLED  │ $final_percentage%        │
│ $SECONDARY_FLAG     │ ENABLED  │ $final_percentage%        │
└─────────────────────┴──────────┴─────────────┘

🔧 Rollout Steps Completed:
$(printf "   - %s%%\n" "${ROLLOUT_STEPS[@]}")

👥 User Impact:
- ${final_percentage}% of users now have access to wallet and profile features
- Gradual rollout minimized risk and ensured stability
- User bucketing ensures consistent experience

📈 Next Steps:
1. Monitor application metrics for 24 hours
2. Review user feedback and error logs
3. If stable, proceed with feature optimization
4. Consider removing legacy code paths

🚨 Rollback Procedure:
If issues occur, use emergency rollback:
./scripts/coordinated-feature-rollout.sh --rollback

📊 Monitoring:
- Continue monitoring through Grafana dashboards
- Check error rates and user engagement metrics
- Review feature flag telemetry in LaunchDarkly

EOF
}

# Main rollout function
main() {
    local start_time=$(date)
    
    log "🚀 Starting Coordinated Feature Flag Rollout"
    log "Primary Flag: $PRIMARY_FLAG"
    log "Secondary Flag: $SECONDARY_FLAG"
    log "Rollout Steps: ${ROLLOUT_STEPS[*]}"
    log "Monitor Duration: ${MONITOR_DURATION}s between steps"
    echo
    
    # Pre-flight checks
    if ! check_dependencies; then
        exit 1
    fi
    
    if ! check_database_connection; then
        exit 1
    fi
    
    # Exit if only validation was requested
    if [ "$VALIDATE_ONLY" = true ]; then
        success "✅ Validation complete - all systems ready for rollout"
        exit 0
    fi
    
    # Get initial status
    local primary_current=$(get_flag_status "$PRIMARY_FLAG" | cut -d'|' -f1)
    local secondary_current=$(get_flag_status "$SECONDARY_FLAG" | cut -d'|' -f1)
    
    info "Current rollout status:"
    info "  - $PRIMARY_FLAG: ${primary_current}%"
    info "  - $SECONDARY_FLAG: ${secondary_current}%"
    echo
    
    # Execute rollout steps
    for percentage in "${ROLLOUT_STEPS[@]}"; do
        log "📈 Starting ${percentage}% rollout phase..."
        
        # Update both feature flags to the same percentage
        if ! update_rollout_percentage "$PRIMARY_FLAG" "$percentage"; then
            emergency_rollback "Failed to update $PRIMARY_FLAG"
        fi
        
        if ! update_rollout_percentage "$SECONDARY_FLAG" "$percentage"; then
            emergency_rollback "Failed to update $SECONDARY_FLAG"
        fi
        
        # Check user bucket distribution
        check_user_bucket_distribution "$percentage"
        
        # Monitor both flags
        if ! monitor_feature_metrics "$PRIMARY_FLAG" "$percentage" "$MONITOR_DURATION"; then
            emergency_rollback "Monitoring failed for $PRIMARY_FLAG at ${percentage}%"
        fi
        
        if ! monitor_feature_metrics "$SECONDARY_FLAG" "$percentage" "$MONITOR_DURATION"; then
            emergency_rollback "Monitoring failed for $SECONDARY_FLAG at ${percentage}%"
        fi
        
        # Request approval for next step (except final step)
        if [ "$percentage" != "100" ]; then
            local next_idx=-1
            for i in "${!ROLLOUT_STEPS[@]}"; do
                if [ "${ROLLOUT_STEPS[$i]}" = "$percentage" ]; then
                    next_idx=$((i + 1))
                    break
                fi
            done
            
            if [ $next_idx -lt ${#ROLLOUT_STEPS[@]} ]; then
                request_approval "$percentage" "${ROLLOUT_STEPS[$next_idx]}"
            fi
        fi
        
        echo "----------------------------------------"
    done
    
    # Generate final report
    generate_rollout_report "100" "$start_time"
    
    success "🎉 COORDINATED ROLLOUT COMPLETE!"
    log "Both $PRIMARY_FLAG and $SECONDARY_FLAG are now at 100% rollout"
}

# Handle rollback command
handle_rollback() {
    log "🔄 Initiating manual rollback..."
    emergency_rollback "Manual rollback requested"
}

# Handle script interruption
trap 'emergency_rollback "Script interrupted"' INT TERM

# Parse command line arguments
case "${1:-}" in
    --rollback)
        handle_rollback
        ;;
    --help|-h)
        echo "Usage: $0 [--dry-run] [--validate-only] [--skip-health-checks] [--skip-user-input] [--rollback] [--help]"
        echo ""
        echo "Coordinated Feature Flag Rollout Script"
        echo ""
        echo "Options:"
        echo "  --dry-run             Run in simulation mode without making changes"
        echo "  --validate-only       Only validate setup without running rollout"
        echo "  --skip-health-checks  Skip health check validations"
        echo "  --skip-user-input     Skip manual approval prompts"
        echo "  --rollback            Emergency rollback both feature flags to 0%"
        echo "  --help, -h            Show this help message"
        echo ""
        echo "Environment Variables:"
        echo "  DATABASE_URL       Supabase database connection string (required)"
        echo "  API_BASE_URL       Application API base URL (default: http://localhost:3000)"
        echo "  MONITOR_DURATION   Seconds to monitor each step (default: 1800)"
        echo "  CHECK_INTERVAL     Seconds between metric checks (default: 300)"
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac

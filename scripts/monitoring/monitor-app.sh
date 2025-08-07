#!/bin/bash
# Enhanced application monitoring for MVP
# Monitors key metrics that matter for high-traffic apps

set -euo pipefail

APP_URL="${1:-http://localhost}"
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"
CHECK_INTERVAL="${CHECK_INTERVAL:-60}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

# Send alert to Slack (if configured)
send_alert() {
    local message="$1"
    local severity="${2:-warning}"
    
    if [[ -n "$SLACK_WEBHOOK" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚨 Parker Flight Alert: $message\"}" \
            "$SLACK_WEBHOOK" >/dev/null 2>&1 || true
    fi
    
    log_error "$message"
}

# Check response time
check_response_time() {
    local url="$1"
    local max_time="${2:-2.0}"
    
    local response_time
    response_time=$(curl -w "%{time_total}" -s -o /dev/null --max-time 10 "$url" 2>/dev/null || echo "999")
    
    if (( $(echo "$response_time > $max_time" | bc -l 2>/dev/null || echo "1") )); then
        log_warn "Slow response: ${response_time}s (max: ${max_time}s) - $url"
        return 1
    else
        log_info "Response time OK: ${response_time}s - $url"
        return 0
    fi
}

# Check HTTP status codes
check_http_status() {
    local url="$1"
    local expected="${2:-200}"
    
    local status
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
    
    if [[ "$status" != "$expected" ]]; then
        send_alert "HTTP error: $status (expected: $expected) - $url"
        return 1
    else
        log_success "HTTP status OK: $status - $url"
        return 0
    fi
}

# Monitor container resources
check_container_resources() {
    if ! docker ps | grep -q parker-flight-app; then
        send_alert "Container not running: parker-flight-app" "critical"
        return 1
    fi
    
    # Get container stats
    local stats
    stats=$(docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | grep parker-flight-app)
    
    if [[ -n "$stats" ]]; then
        local cpu_percent=$(echo "$stats" | awk '{print $2}' | sed 's/%//')
        local mem_percent=$(echo "$stats" | awk '{print $4}' | sed 's/%//')
        
        # Alert if CPU > 80% or Memory > 90%
        if (( $(echo "$cpu_percent > 80" | bc -l 2>/dev/null || echo "0") )); then
            log_warn "High CPU usage: ${cpu_percent}%"
        fi
        
        if (( $(echo "$mem_percent > 90" | bc -l 2>/dev/null || echo "0") )); then
            send_alert "High memory usage: ${mem_percent}%" "critical"
        fi
        
        log_info "Resources: CPU ${cpu_percent}%, Memory ${mem_percent}%"
        echo "$stats"
    fi
}

# Check disk space
check_disk_space() {
    local usage
    usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [[ $usage -gt 85 ]]; then
        send_alert "High disk usage: ${usage}%" "warning"
    else
        log_info "Disk usage OK: ${usage}%"
    fi
}

# Test critical user journeys
check_user_journeys() {
    log_info "Testing critical user journeys..."
    
    # Test main page load
    if check_response_time "$APP_URL" 2.0; then
        log_success "Main page load: OK"
    else
        send_alert "Main page slow/failing" "critical"
    fi
    
    # Test health endpoint
    if check_http_status "$APP_URL/health" 200; then
        log_success "Health endpoint: OK"
    else
        send_alert "Health endpoint failing" "critical"
    fi
    
    # Test API endpoints (add your specific endpoints)
    # check_http_status "$APP_URL/api/flights" 200
    # check_http_status "$APP_URL/api/auth/session" 401  # Should be unauthorized without token
}

# Generate monitoring report
generate_report() {
    local report_file="monitoring-report-$(date +%Y%m%d-%H%M%S).log"
    
    {
        echo "Parker Flight Monitoring Report - $(date)"
        echo "=========================================="
        echo
        
        echo "Application Status:"
        check_user_journeys
        echo
        
        echo "Container Resources:"
        check_container_resources
        echo
        
        echo "System Resources:"
        check_disk_space
        echo
        
        echo "Recent Container Logs (last 50 lines):"
        docker logs --tail 50 parker-flight-app 2>/dev/null || echo "No container logs available"
        
    } | tee "$report_file"
    
    log_info "Report saved to: $report_file"
}

# Continuous monitoring mode
monitor_continuously() {
    log_info "Starting continuous monitoring (interval: ${CHECK_INTERVAL}s)"
    log_info "Press Ctrl+C to stop"
    
    while true; do
        echo "----------------------------------------"
        log_info "Running health checks..."
        
        check_user_journeys
        check_container_resources
        check_disk_space
        
        log_info "Next check in ${CHECK_INTERVAL} seconds..."
        sleep "$CHECK_INTERVAL"
    done
}

# Show help
show_help() {
    cat <<EOF
Application Monitoring Script for Parker Flight

Usage: $0 [command] [options]

Commands:
  status        Run one-time health check
  monitor       Continuous monitoring mode
  report        Generate detailed monitoring report
  journeys      Test critical user journeys only
  resources     Check container resources only
  help          Show this help

Environment Variables:
  APP_URL           Application URL (default: http://localhost)
  SLACK_WEBHOOK     Slack webhook for alerts
  CHECK_INTERVAL    Monitoring interval in seconds (default: 60)

Examples:
  $0 status                           # Quick health check
  $0 monitor                          # Continuous monitoring
  APP_URL=https://yourdomain.com $0 status  # Check production
  SLACK_WEBHOOK=https://hooks.slack.com/... $0 monitor  # With alerts

Monitoring Focus Areas:
  ✓ Response times (< 2s for critical paths)
  ✓ HTTP status codes
  ✓ Container resource usage
  ✓ Disk space
  ✓ Critical user journeys
  ✓ Application health endpoints
EOF
}

# Main command handling
case "${1:-status}" in
    "status")
        log_info "Running Parker Flight health check..."
        check_user_journeys
        check_container_resources
        check_disk_space
        ;;
    "monitor")
        monitor_continuously
        ;;
    "report")
        generate_report
        ;;
    "journeys")
        check_user_journeys
        ;;
    "resources")
        check_container_resources
        ;;
    "help"|*)
        show_help
        ;;
esac

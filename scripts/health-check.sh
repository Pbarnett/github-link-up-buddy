#!/bin/sh

# Advanced health check script for Parker Flight application
# This script performs comprehensive health checks beyond simple HTTP status

set -e

# Configuration
HEALTH_URL="http://localhost:80/health"
APP_URL="http://localhost:80"
MAX_RESPONSE_TIME=5  # seconds
NGINX_CONFIG="/etc/nginx/conf.d/default.conf"

# Colors for output (compatible with sh)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Helper function for logging
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [HEALTH] $1"
}

# Check HTTP response
check_http() {
    log "Checking HTTP response..."
    
    # Check if health endpoint responds
    if ! curl -f -s --max-time $MAX_RESPONSE_TIME "$HEALTH_URL" > /dev/null; then
        log "❌ Health endpoint failed"
        return 1
    fi
    
    # Check if main application responds
    if ! curl -f -s --max-time $MAX_RESPONSE_TIME "$APP_URL" > /dev/null; then
        log "❌ Application endpoint failed"
        return 1
    fi
    
    log "✅ HTTP checks passed"
    return 0
}

# Check response time
check_response_time() {
    log "Checking response time..."
    
    RESPONSE_TIME=$(curl -w "%{time_total}" -s -o /dev/null --max-time $MAX_RESPONSE_TIME "$APP_URL")
    
    if [ $(echo "$RESPONSE_TIME > $MAX_RESPONSE_TIME" | bc -l 2>/dev/null || echo "0") -eq 1 ]; then
        log "⚠️  Response time too slow: ${RESPONSE_TIME}s (max: ${MAX_RESPONSE_TIME}s)"
        return 1
    fi
    
    log "✅ Response time OK: ${RESPONSE_TIME}s"
    return 0
}

# Check nginx configuration
check_nginx() {
    log "Checking nginx configuration..."
    
    if [ -f "$NGINX_CONFIG" ]; then
        if nginx -t > /dev/null 2>&1; then
            log "✅ Nginx configuration valid"
        else
            log "❌ Nginx configuration invalid"
            return 1
        fi
    else
        log "⚠️  Nginx config file not found: $NGINX_CONFIG"
    fi
    
    return 0
}

# Check file permissions and ownership
check_permissions() {
    log "Checking file permissions..."
    
    # Check if we can read the web directory
    if [ ! -r "/usr/share/nginx/html" ]; then
        log "❌ Cannot read web directory"
        return 1
    fi
    
    # Check if index.html exists and is readable
    if [ ! -r "/usr/share/nginx/html/index.html" ]; then
        log "❌ index.html not found or not readable"
        return 1
    fi
    
    log "✅ File permissions OK"
    return 0
}

# Check disk space
check_disk_space() {
    log "Checking disk space..."
    
    # Check available disk space (basic check)
    AVAILABLE=$(df /tmp | tail -1 | awk '{print $4}')
    
    # If available space is less than 100MB (in KB), warn
    if [ "$AVAILABLE" -lt 102400 ]; then
        log "⚠️  Low disk space: ${AVAILABLE}KB available"
        return 1
    fi
    
    log "✅ Disk space OK"
    return 0
}

# Check memory usage (basic)
check_memory() {
    log "Checking memory usage..."
    
    # Check if /proc/meminfo exists (it should in most containers)
    if [ -f "/proc/meminfo" ]; then
        # Basic memory check - ensure we have some free memory
        MEM_AVAILABLE=$(grep MemAvailable /proc/meminfo | awk '{print $2}' || echo "0")
        
        if [ "$MEM_AVAILABLE" -lt 51200 ]; then  # Less than 50MB
            log "⚠️  Low memory: ${MEM_AVAILABLE}KB available"
            return 1
        fi
        
        log "✅ Memory usage OK"
    else
        log "ℹ️  Memory info not available"
    fi
    
    return 0
}

# Main health check function
main() {
    log "Starting comprehensive health check..."
    
    CHECKS_PASSED=0
    TOTAL_CHECKS=6
    
    # Critical checks (if these fail, container is unhealthy)
    if check_http; then
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    else
        log "❌ Critical check failed: HTTP"
        exit 1
    fi
    
    if check_permissions; then
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    else
        log "❌ Critical check failed: Permissions"
        exit 1
    fi
    
    # Non-critical checks (warnings only)
    if check_response_time; then
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    fi
    
    if check_nginx; then
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    fi
    
    if check_disk_space; then
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    fi
    
    if check_memory; then
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    fi
    
    # Summary
    log "Health check completed: $CHECKS_PASSED/$TOTAL_CHECKS checks passed"
    
    if [ $CHECKS_PASSED -ge 4 ]; then
        log "✅ Container is healthy"
        exit 0
    else
        log "❌ Container health degraded"
        exit 1
    fi
}

# Handle different invocation modes
case "${1:-full}" in
    "quick")
        # Quick check - just HTTP
        if check_http; then
            echo "healthy"
            exit 0
        else
            echo "unhealthy"
            exit 1
        fi
        ;;
    "full"|*)
        # Full comprehensive check
        main
        ;;
esac

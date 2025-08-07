#!/bin/bash

# =============================================================================
# PRODUCTION READINESS VALIDATOR - GitHub Link Up Buddy
# =============================================================================

set -e

CONTAINER_NAME="github-link-up-buddy-prod"
APP_URL="http://localhost:3001"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 PRODUCTION READINESS VALIDATION${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0

# =============================================================================
# Helper Functions
# =============================================================================

check_passed() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    echo -e "  ${GREEN}✅ $1${NC}"
}

check_failed() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
    echo -e "  ${RED}❌ $1${NC}"
}

check_warning() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    WARNINGS=$((WARNINGS + 1))
    echo -e "  ${YELLOW}⚠️  $1${NC}"
}

# =============================================================================
# 1. Container Health Checks
# =============================================================================

echo -e "${BLUE}🐳 Container Health${NC}"
echo "────────────────────────────────────────────────────────────────────────"

# Check if container exists and is running
if docker ps --format "table {{.Names}}" | grep -q "$CONTAINER_NAME"; then
    check_passed "Container is running"
    
    # Check container health
    HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' $CONTAINER_NAME 2>/dev/null || echo "none")
    if [ "$HEALTH_STATUS" = "healthy" ] || [ "$HEALTH_STATUS" = "none" ]; then
        check_passed "Container health status: OK"
    else
        check_failed "Container health status: $HEALTH_STATUS"
    fi
    
    # Check restart policy
    RESTART_POLICY=$(docker inspect --format='{{.HostConfig.RestartPolicy.Name}}' $CONTAINER_NAME)
    if [ "$RESTART_POLICY" = "unless-stopped" ]; then
        check_passed "Auto-restart policy configured"
    else
        check_warning "Restart policy: $RESTART_POLICY (recommend: unless-stopped)"
    fi
else
    check_failed "Container is not running"
fi

echo ""

# =============================================================================
# 2. Network Connectivity
# =============================================================================

echo -e "${BLUE}🌐 Network Connectivity${NC}"
echo "────────────────────────────────────────────────────────────────────────"

# Health endpoint
HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/health" 2>/dev/null || echo "000")
if [ "$HEALTH_CODE" = "200" ]; then
    check_passed "Health endpoint responds (200)"
else
    check_failed "Health endpoint failed ($HEALTH_CODE)"
fi

# Main application
APP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/" 2>/dev/null || echo "000")
if [ "$APP_CODE" = "200" ]; then
    check_passed "Main application responds (200)"
else
    check_failed "Main application failed ($APP_CODE)"
fi

# Response time test
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$APP_URL/" 2>/dev/null || echo "999")
if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
    check_passed "Response time: ${RESPONSE_TIME}s (< 2s)"
else
    check_warning "Response time: ${RESPONSE_TIME}s (slow)"
fi

echo ""

# =============================================================================
# 3. Security Configuration
# =============================================================================

echo -e "${BLUE}🔒 Security Configuration${NC}"
echo "────────────────────────────────────────────────────────────────────────"

# Environment file exists
if [ -f ".env.production" ]; then
    check_passed "Production environment file exists"
    
    # Check for placeholder values
    PLACEHOLDERS=$(grep -c "YOUR_.*_HERE\|your_.*_here\|placeholder\|example" .env.production 2>/dev/null || echo "0")
    if [ "$PLACEHOLDERS" -eq 0 ]; then
        check_passed "No placeholder values in environment"
    else
        check_warning "$PLACEHOLDERS placeholder value(s) found in .env.production"
    fi
    
    # Check for critical environment variables
    CRITICAL_VARS=("VITE_SUPABASE_URL" "VITE_STRIPE_PUBLISHABLE_KEY" "GOOGLE_CLIENT_ID" "AMADEUS_API_KEY")
    for var in "${CRITICAL_VARS[@]}"; do
        if grep -q "^$var=" .env.production 2>/dev/null; then
            check_passed "$var is configured"
        else
            check_warning "$var is missing"
        fi
    done
else
    check_failed "Production environment file missing"
fi

# Check file permissions
ENV_PERMS=$(stat -f "%A" .env.production 2>/dev/null || echo "000")
if [ "$ENV_PERMS" = "600" ] || [ "$ENV_PERMS" = "644" ]; then
    check_passed "Environment file permissions: $ENV_PERMS"
else
    check_warning "Environment file permissions: $ENV_PERMS (recommend: 600)"
fi

echo ""

# =============================================================================
# 4. Performance Metrics
# =============================================================================

echo -e "${BLUE}⚡ Performance Metrics${NC}"
echo "────────────────────────────────────────────────────────────────────────"

if docker ps --format "table {{.Names}}" | grep -q "$CONTAINER_NAME"; then
    # CPU usage
    CPU_USAGE=$(docker stats --no-stream --format "{{.CPUPerc}}" $CONTAINER_NAME 2>/dev/null | sed 's/%//' || echo "0")
    if (( $(echo "$CPU_USAGE < 50" | bc -l) )); then
        check_passed "CPU usage: ${CPU_USAGE}% (< 50%)"
    else
        check_warning "CPU usage: ${CPU_USAGE}% (high)"
    fi
    
    # Memory usage
    MEMORY_USAGE=$(docker stats --no-stream --format "{{.MemUsage}}" $CONTAINER_NAME 2>/dev/null | cut -d'/' -f1 | sed 's/MiB//' || echo "0")
    if (( $(echo "$MEMORY_USAGE < 256" | bc -l) )); then
        check_passed "Memory usage: ${MEMORY_USAGE}MB (< 256MB)"
    else
        check_warning "Memory usage: ${MEMORY_USAGE}MB (high)"
    fi
    
    # Docker image size
    IMAGE_SIZE=$(docker images --format "table {{.Size}}" github-link-up-buddy:latest | tail -1)
    check_passed "Docker image size: $IMAGE_SIZE"
else
    check_failed "Cannot get performance metrics - container not running"
fi

echo ""

# =============================================================================
# 5. Application Features Test
# =============================================================================

echo -e "${BLUE}🧪 Application Features${NC}"
echo "────────────────────────────────────────────────────────────────────────"

# Test static assets
FAVICON_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/favicon.ico" 2>/dev/null || echo "000")
if [ "$FAVICON_CODE" = "200" ]; then
    check_passed "Static assets loading (favicon.ico)"
else
    check_warning "Static assets may have issues (favicon: $FAVICON_CODE)"
fi

# Test JavaScript loading
JS_CONTENT=$(curl -s "$APP_URL/" 2>/dev/null | grep -c "script" || echo "0")
if [ "$JS_CONTENT" -gt 0 ]; then
    check_passed "JavaScript bundles included in HTML"
else
    check_warning "JavaScript bundles may not be loading"
fi

# Test CSS loading
CSS_CONTENT=$(curl -s "$APP_URL/" 2>/dev/null | grep -c "stylesheet\|<style" || echo "0")
if [ "$CSS_CONTENT" -gt 0 ]; then
    check_passed "CSS stylesheets included in HTML"
else
    check_warning "CSS stylesheets may not be loading"
fi

echo ""

# =============================================================================
# 6. Backup and Recovery
# =============================================================================

echo -e "${BLUE}💾 Backup and Recovery${NC}"
echo "────────────────────────────────────────────────────────────────────────"

# Check if backup scripts exist
if [ -f "scripts/backup/daily-backup.sh" ]; then
    check_passed "Backup script exists"
    
    # Check if backup script is executable
    if [ -x "scripts/backup/daily-backup.sh" ]; then
        check_passed "Backup script is executable"
    else
        check_warning "Backup script exists but not executable"
    fi
else
    check_warning "Backup script not found"
fi

# Check backup directory
if [ -d "backups" ]; then
    BACKUP_COUNT=$(ls backups/ | wc -l 2>/dev/null || echo "0")
    if [ "$BACKUP_COUNT" -gt 0 ]; then
        check_passed "Backup directory exists with $BACKUP_COUNT file(s)"
    else
        check_warning "Backup directory exists but empty"
    fi
else
    check_warning "Backup directory not created yet"
fi

echo ""

# =============================================================================
# 7. Monitoring Setup
# =============================================================================

echo -e "${BLUE}📊 Monitoring Setup${NC}"
echo "────────────────────────────────────────────────────────────────────────"

# Check monitoring scripts
if [ -f "scripts/health-monitor.sh" ]; then
    check_passed "Health monitoring script exists"
else
    check_warning "Health monitoring script missing"
fi

if [ -f "scripts/performance-monitor.sh" ]; then
    check_passed "Performance monitoring script exists"
else
    check_warning "Performance monitoring script missing"
fi

# Check Sentry configuration
if [ -f ".sentryclirc" ]; then
    check_passed "Sentry configuration exists"
    
    if grep -q "YOUR_SENTRY_AUTH_TOKEN_HERE" .sentryclirc 2>/dev/null; then
        check_warning "Sentry auth token needs to be updated"
    else
        check_passed "Sentry auth token configured"
    fi
else
    check_warning "Sentry configuration missing"
fi

echo ""

# =============================================================================
# Summary Report
# =============================================================================

echo -e "${BLUE}📊 VALIDATION SUMMARY${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

SCORE=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))

echo "Total Checks: $TOTAL_CHECKS"
echo -e "Passed: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Failed: ${RED}$FAILED_CHECKS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ "$SCORE" -ge 90 ]; then
    echo -e "Overall Score: ${GREEN}$SCORE%${NC} - 🎉 EXCELLENT!"
    echo -e "Status: ${GREEN}✅ PRODUCTION READY${NC}"
elif [ "$SCORE" -ge 75 ]; then
    echo -e "Overall Score: ${YELLOW}$SCORE%${NC} - 👍 GOOD"
    echo -e "Status: ${YELLOW}⚠️  MOSTLY READY${NC} (address warnings)"
else
    echo -e "Overall Score: ${RED}$SCORE%${NC} - 🔧 NEEDS WORK"
    echo -e "Status: ${RED}❌ NOT READY${NC} (fix critical issues)"
fi

echo ""

# =============================================================================
# Recommendations
# =============================================================================

echo -e "${BLUE}🎯 RECOMMENDATIONS${NC}"
echo "────────────────────────────────────────────────────────────────────────"

if [ "$FAILED_CHECKS" -gt 0 ]; then
    echo -e "${RED}🚨 CRITICAL ISSUES TO FIX:${NC}"
    echo "1. Ensure container is running and healthy"
    echo "2. Fix network connectivity issues"
    echo "3. Configure missing environment variables"
    echo ""
fi

if [ "$WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  IMPROVEMENTS RECOMMENDED:${NC}"
    echo "1. Update .env.production with real API keys"
    echo "2. Configure Sentry for error tracking"
    echo "3. Set up automated backups"
    echo "4. Enable monitoring scripts"
    echo ""
fi

echo -e "${GREEN}🚀 NEXT STEPS FOR PRODUCTION:${NC}"
echo "1. Review API_KEYS_SETUP_GUIDE.md"
echo "2. Test critical user flows manually"
echo "3. Set up domain and SSL certificate"
echo "4. Configure external monitoring"
echo ""

echo -e "${BLUE}🌐 Your app is accessible at: $APP_URL${NC}"
echo ""

# Exit with appropriate code
if [ "$FAILED_CHECKS" -gt 0 ]; then
    exit 1
elif [ "$WARNINGS" -gt 5 ]; then
    exit 2
else
    exit 0
fi

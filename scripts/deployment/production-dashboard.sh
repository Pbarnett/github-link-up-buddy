#!/bin/bash

# =============================================================================
# PRODUCTION DASHBOARD - GitHub Link Up Buddy
# =============================================================================

CONTAINER_NAME="github-link-up-buddy-prod"
APP_URL="http://localhost:3001"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Clear screen and show header
clear
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                 🚀 GITHUB LINK UP BUDDY                      ║${NC}"
echo -e "${BLUE}║                   Production Dashboard                       ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# =============================================================================
# Container Status
# =============================================================================

echo -e "${BLUE}📊 CONTAINER STATUS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if docker ps --format "table {{.Names}}" | grep -q "$CONTAINER_NAME"; then
    echo -e "Status: ${GREEN}✅ Running${NC}"
    
    # Get container details
    CREATED=$(docker inspect --format='{{.Created}}' $CONTAINER_NAME | cut -d'T' -f1)
    UPTIME=$(docker inspect --format='{{.State.StartedAt}}' $CONTAINER_NAME)
    
    echo "Container: $CONTAINER_NAME"
    echo "Created: $CREATED"
    echo "Image: $(docker inspect --format='{{.Config.Image}}' $CONTAINER_NAME)"
    echo "Port: $(docker port $CONTAINER_NAME | head -1)"
else
    echo -e "Status: ${RED}❌ Not Running${NC}"
    echo "Run: docker start $CONTAINER_NAME"
fi

echo ""

# =============================================================================
# Health Check
# =============================================================================

echo -e "${BLUE}🏥 HEALTH STATUS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $APP_URL/health 2>/dev/null)

if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo -e "Health Check: ${GREEN}✅ Healthy${NC}"
    echo "Response Code: $HEALTH_RESPONSE"
    echo "Endpoint: $APP_URL/health"
else
    echo -e "Health Check: ${RED}❌ Unhealthy${NC}"
    echo "Response Code: $HEALTH_RESPONSE"
fi

# Test main app
APP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $APP_URL/ 2>/dev/null)
if [ "$APP_RESPONSE" = "200" ]; then
    echo -e "Main App: ${GREEN}✅ Accessible${NC}"
else
    echo -e "Main App: ${RED}❌ Not Accessible${NC}"
fi

echo ""

# =============================================================================
# Performance Metrics
# =============================================================================

echo -e "${BLUE}⚡ PERFORMANCE METRICS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if docker ps --format "table {{.Names}}" | grep -q "$CONTAINER_NAME"; then
    # Get performance stats
    STATS=$(docker stats --no-stream --format "{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" $CONTAINER_NAME 2>/dev/null)
    
    if [ ! -z "$STATS" ]; then
        CPU=$(echo $STATS | cut -f1)
        MEMORY=$(echo $STATS | cut -f2)
        NETWORK=$(echo $STATS | cut -f3)
        DISK=$(echo $STATS | cut -f4)
        
        echo "CPU Usage: $CPU"
        echo "Memory: $MEMORY"
        echo "Network I/O: $NETWORK"
        echo "Disk I/O: $DISK"
        
        # Performance warnings
        CPU_NUM=$(echo $CPU | sed 's/%//')
        MEMORY_MB=$(echo $MEMORY | cut -d'/' -f1 | sed 's/MiB//')
        
        if (( $(echo "$CPU_NUM > 80" | bc -l) )); then
            echo -e "${YELLOW}⚠️  High CPU Usage!${NC}"
        fi
        
        if (( $(echo "$MEMORY_MB > 512" | bc -l) )); then
            echo -e "${YELLOW}⚠️  High Memory Usage!${NC}"
        fi
    else
        echo "Performance stats unavailable"
    fi
else
    echo "Container not running - no metrics available"
fi

echo ""

# =============================================================================
# Application URLs
# =============================================================================

echo -e "${BLUE}🌐 APPLICATION URLS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Main App: $APP_URL"
echo "Health: $APP_URL/health"
echo "Login: $APP_URL/login"
echo ""

# =============================================================================
# Quick Actions
# =============================================================================

echo -e "${BLUE}🔧 QUICK ACTIONS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "View Logs:    docker logs -f $CONTAINER_NAME"
echo "Restart:      docker restart $CONTAINER_NAME"
echo "Stop:         docker stop $CONTAINER_NAME"  
echo "Rebuild:      ./deploy-production.sh"
echo "Update Keys:  nano .env.production && docker restart $CONTAINER_NAME"
echo ""

# =============================================================================
# Recent Logs (Last 5 lines)
# =============================================================================

echo -e "${BLUE}📋 RECENT LOGS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if docker ps --format "table {{.Names}}" | grep -q "$CONTAINER_NAME"; then
    docker logs --tail 5 $CONTAINER_NAME 2>/dev/null | sed 's/^/  /'
else
    echo "Container not running - no logs available"
fi

echo ""

# =============================================================================
# Environment Status
# =============================================================================

echo -e "${BLUE}🔐 ENVIRONMENT STATUS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f ".env.production" ]; then
    echo -e "Environment File: ${GREEN}✅ Found${NC}"
    
    # Check for placeholder values
    PLACEHOLDERS=$(grep -c "YOUR_.*_HERE\|your_.*_here\|placeholder" .env.production 2>/dev/null || echo "0")
    if [ "$PLACEHOLDERS" -gt 0 ]; then
        echo -e "API Keys: ${YELLOW}⚠️  $PLACEHOLDERS placeholder(s) found${NC}"
        echo "Action needed: Update .env.production with real API keys"
    else
        echo -e "API Keys: ${GREEN}✅ Configured${NC}"
    fi
else
    echo -e "Environment File: ${RED}❌ Missing${NC}"
fi

echo ""

# =============================================================================
# Next Steps
# =============================================================================

echo -e "${BLUE}🎯 NEXT STEPS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "1. 🔐 Update production API keys (see API_KEYS_SETUP_GUIDE.md)"
    echo "2. 🌐 Set up custom domain and SSL"
    echo "3. 📊 Configure monitoring (Sentry, etc.)"
    echo "4. 🧪 Test all features with real users"
else
    echo "1. 🔧 Fix container issues (check logs above)"
    echo "2. 🔐 Verify .env.production configuration"
    echo "3. 🔄 Restart container: docker restart $CONTAINER_NAME"
fi

echo ""
echo -e "${GREEN}🎉 Your GitHub Link Up Buddy is ready for production!${NC}"
echo -e "Visit: ${BLUE}$APP_URL${NC}"
echo ""

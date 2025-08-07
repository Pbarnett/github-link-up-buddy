#!/bin/bash

# =============================================================================
# COMPLETE PRODUCTION DEPLOYMENT - GitHub Link Up Buddy
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CONTAINER_NAME="github-link-up-buddy-prod"
IMAGE_NAME="github-link-up-buddy:latest"
APP_URL="http://localhost:3001"

echo -e "${BLUE}🚀 COMPLETE PRODUCTION DEPLOYMENT${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# =============================================================================
# Pre-deployment Validation
# =============================================================================

echo -e "${BLUE}🔍 Pre-deployment Validation${NC}"
echo "────────────────────────────────────────────────────────────────────────"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ .env.production not found${NC}"
    echo "Please create .env.production with your API keys"
    exit 1
fi
echo -e "${GREEN}✅ Production environment file exists${NC}"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ required. Current: $(node --version)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"

echo ""

# =============================================================================
# Stop Existing Container (if running)
# =============================================================================

echo -e "${BLUE}🛑 Stopping Existing Container${NC}"
echo "────────────────────────────────────────────────────────────────────────"

if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
    echo "Stopping existing container..."
    docker stop "$CONTAINER_NAME"
    docker rm "$CONTAINER_NAME"
    echo -e "${GREEN}✅ Stopped and removed existing container${NC}"
else
    echo -e "${YELLOW}⚠️  No existing container to stop${NC}"
fi

echo ""

# =============================================================================
# Build Production Assets
# =============================================================================

echo -e "${BLUE}🏗️ Building Production Assets${NC}"
echo "────────────────────────────────────────────────────────────────────────"

echo "Installing dependencies..."
npm ci --production=false --silent

echo "Building production bundle..."
npm run build

# Verify build
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed - dist directory not found${NC}"
    exit 1
fi

BUNDLE_SIZE=$(du -sh dist/ | cut -f1)
echo -e "${GREEN}✅ Production build completed - Size: $BUNDLE_SIZE${NC}"

echo ""

# =============================================================================
# Build Docker Image
# =============================================================================

echo -e "${BLUE}🐳 Building Docker Image${NC}"
echo "────────────────────────────────────────────────────────────────────────"

# Build with timestamp tag
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker build -t "$IMAGE_NAME" -t "github-link-up-buddy:$TIMESTAMP" .

# Get image size
IMAGE_SIZE=$(docker images --format "table {{.Size}}" "$IMAGE_NAME" | tail -1)
echo -e "${GREEN}✅ Docker image built - Size: $IMAGE_SIZE${NC}"

echo ""

# =============================================================================
# Deploy New Container
# =============================================================================

echo -e "${BLUE}🚀 Deploying New Container${NC}"
echo "────────────────────────────────────────────────────────────────────────"

# Start new container
docker run -d \
    --name "$CONTAINER_NAME" \
    --env-file .env.production \
    -p 3001:80 \
    --restart unless-stopped \
    --health-cmd="curl -f http://localhost/health || exit 1" \
    --health-interval=30s \
    --health-timeout=10s \
    --health-retries=3 \
    "$IMAGE_NAME"

echo -e "${GREEN}✅ Container deployed and starting...${NC}"

# Wait for container to be healthy
echo "Waiting for container to be ready..."
for i in {1..60}; do
    if curl -f "$APP_URL/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Container is healthy and responding${NC}"
        break
    fi
    
    if [ $i -eq 60 ]; then
        echo -e "${RED}❌ Container failed to start properly${NC}"
        docker logs "$CONTAINER_NAME"
        exit 1
    fi
    
    sleep 2
    echo -n "."
done

echo ""

# =============================================================================
# Post-deployment Validation
# =============================================================================

echo -e "${BLUE}🧪 Post-deployment Validation${NC}"
echo "────────────────────────────────────────────────────────────────────────"

# Health check
HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/health")
if [ "$HEALTH_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Health check passed ($HEALTH_CODE)${NC}"
else
    echo -e "${RED}❌ Health check failed ($HEALTH_CODE)${NC}"
    exit 1
fi

# Main app check
APP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/")
if [ "$APP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Main application accessible ($APP_CODE)${NC}"
else
    echo -e "${RED}❌ Main application failed ($APP_CODE)${NC}"
    exit 1
fi

# Response time check
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$APP_URL/")
echo -e "${GREEN}✅ Response time: ${RESPONSE_TIME}s${NC}"

# Container stats
STATS=$(docker stats --no-stream --format "CPU: {{.CPUPerc}}, Memory: {{.MemUsage}}" "$CONTAINER_NAME")
echo -e "${GREEN}✅ Container stats: $STATS${NC}"

echo ""

# =============================================================================
# Setup Monitoring
# =============================================================================

echo -e "${BLUE}📊 Setting Up Monitoring${NC}"
echo "────────────────────────────────────────────────────────────────────────"

# Start monitoring scripts if not already running
if ! crontab -l 2>/dev/null | grep -q "health-monitor.sh"; then
    echo "Setting up health monitoring..."
    (crontab -l 2>/dev/null; echo "*/5 * * * * /Users/parkerbarnett/github-link-up-buddy/scripts/health-monitor.sh >> /tmp/health-monitor.log 2>&1") | crontab -
    echo -e "${GREEN}✅ Health monitoring scheduled (every 5 minutes)${NC}"
fi

if ! crontab -l 2>/dev/null | grep -q "performance-monitor.sh"; then
    echo "Setting up performance monitoring..."
    (crontab -l 2>/dev/null; echo "*/15 * * * * /Users/parkerbarnett/github-link-up-buddy/scripts/performance-monitor.sh") | crontab -
    echo -e "${GREEN}✅ Performance monitoring scheduled (every 15 minutes)${NC}"
fi

echo ""

# =============================================================================
# Backup Current State
# =============================================================================

echo -e "${BLUE}💾 Creating Deployment Backup${NC}"
echo "────────────────────────────────────────────────────────────────────────"

mkdir -p backups
BACKUP_NAME="deployment-$(date +%Y%m%d_%H%M%S)"

# Backup Docker image
docker save "$IMAGE_NAME" | gzip > "backups/$BACKUP_NAME-image.tar.gz"
echo -e "${GREEN}✅ Docker image backed up${NC}"

# Backup environment
cp .env.production "backups/$BACKUP_NAME-env.backup"
echo -e "${GREEN}✅ Environment configuration backed up${NC}"

echo ""

# =============================================================================
# Generate Deployment Report
# =============================================================================

echo -e "${BLUE}📋 Deployment Report${NC}"
echo "────────────────────────────────────────────────────────────────────────"

cat > "DEPLOYMENT_REPORT_$(date +%Y%m%d_%H%M%S).md" << EOF
# Deployment Report - GitHub Link Up Buddy

**Deployment Date**: $(date)
**Deployment Status**: ✅ SUCCESS

## Container Details
- **Name**: $CONTAINER_NAME
- **Image**: $IMAGE_NAME
- **Port**: 3001:80
- **Restart Policy**: unless-stopped
- **Health Check**: Enabled

## Build Information
- **Bundle Size**: $BUNDLE_SIZE
- **Docker Image Size**: $IMAGE_SIZE
- **Node.js Version**: $(node --version)
- **Build Time**: $(date)

## Validation Results
- **Health Endpoint**: $HEALTH_CODE ✅
- **Main Application**: $APP_CODE ✅
- **Response Time**: ${RESPONSE_TIME}s ✅
- **Container Stats**: $STATS

## URLs
- **Main App**: $APP_URL
- **Health Check**: $APP_URL/health
- **Login**: $APP_URL/login

## Monitoring
- **Health Monitoring**: Enabled (every 5 minutes)
- **Performance Monitoring**: Enabled (every 15 minutes)
- **Backup**: Created ($BACKUP_NAME)

## Next Steps
1. Update production API keys in .env.production
2. Configure custom domain and SSL
3. Set up external monitoring (Sentry, etc.)
4. Test all critical user flows

---
*Generated by deploy-to-production.sh*
EOF

echo -e "${GREEN}✅ Deployment report generated${NC}"

echo ""

# =============================================================================
# Success Summary
# =============================================================================

echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "${BLUE}🌐 Your GitHub Link Up Buddy is now live at:${NC}"
echo -e "${GREEN}   $APP_URL${NC}"
echo ""

echo -e "${BLUE}📊 Container Information:${NC}"
echo "   Name: $CONTAINER_NAME"
echo "   Status: Running with auto-restart"
echo "   Health: Monitored every 5 minutes"
echo "   Performance: Monitored every 15 minutes"
echo ""

echo -e "${BLUE}🔧 Management Commands:${NC}"
echo "   View logs:    docker logs -f $CONTAINER_NAME"
echo "   Restart:      docker restart $CONTAINER_NAME"
echo "   Dashboard:    ./scripts/production-dashboard.sh"
echo "   Validate:     ./scripts/validate-production-ready.sh"
echo ""

echo -e "${BLUE}⚠️  Important Next Steps:${NC}"
echo "1. 🔐 Update .env.production with real API keys"
echo "2. 🌐 Configure custom domain and SSL certificate"
echo "3. 📊 Set up Sentry for error tracking"
echo "4. 🧪 Test all features with real users"
echo ""

echo -e "${GREEN}Your flight booking platform is ready to take off! ✈️${NC}"
echo ""

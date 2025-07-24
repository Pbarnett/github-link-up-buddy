#!/bin/bash

# Start Complete Parker Flight Monitoring Stack
# This script starts all monitoring components in the correct order

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Parker Flight Monitoring Stack...${NC}\n"

# Step 1: Start monitoring containers
echo "📊 Starting monitoring containers..."
docker-compose -f docker-compose.monitoring.yml up -d
sleep 5

# Step 2: Start metrics server
echo "📈 Starting metrics server..."
if ! pgrep -f "tsx server/start.ts" > /dev/null; then
    npx tsx server/start.ts > logs/metrics-server.log 2>&1 &
    echo "Metrics server started (PID: $!)"
    echo $! > .metrics-server.pid
else
    echo "Metrics server already running"
fi

# Step 3: Wait for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 15

# Step 4: Verify everything is working
echo -e "\n${GREEN}✅ Monitoring stack started!${NC}\n"

echo "Verifying services..."
if curl -s http://localhost:5001/health > /dev/null; then
    echo "  ✅ Metrics Server (port 5001)"
else
    echo "  ❌ Metrics Server (port 5001)"
fi

if curl -s http://localhost:9090/-/healthy > /dev/null; then
    echo "  ✅ Prometheus (port 9090)"
else
    echo "  ❌ Prometheus (port 9090)"
fi

if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "  ✅ Grafana (port 3001)"
else
    echo "  ❌ Grafana (port 3001)"
fi

echo -e "\n${GREEN}🎯 Next Steps:${NC}"
echo "  1. Open Grafana: http://localhost:3001 (admin/admin)"
echo "  2. Check status: ./scripts/monitoring-status.sh" 
echo "  3. View dashboards: ./monitoring-dashboard.sh open"
echo "  4. Stop monitoring: ./scripts/stop-monitoring.sh"

echo -e "\n${YELLOW}Note: Dashboards may take 1-2 minutes to populate with data.${NC}"

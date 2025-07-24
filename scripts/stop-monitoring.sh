#!/bin/bash

# Stop Parker Flight Monitoring Stack

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🛑 Stopping Parker Flight Monitoring Stack...${NC}\n"

# Stop metrics server if running
if [ -f .metrics-server.pid ]; then
    PID=$(cat .metrics-server.pid)
    if kill -0 $PID 2>/dev/null; then
        echo "📊 Stopping metrics server (PID: $PID)..."
        kill $PID
        rm .metrics-server.pid
    else
        echo "📊 Metrics server not running"
        rm .metrics-server.pid
    fi
else
    # Try to find and kill by process name
    PID=$(pgrep -f "tsx server/start.ts" || true)
    if [ ! -z "$PID" ]; then
        echo "📊 Stopping metrics server (PID: $PID)..."
        kill $PID
    else
        echo "📊 Metrics server not running"
    fi
fi

# Stop monitoring containers
echo "📈 Stopping monitoring containers..."
docker-compose -f docker-compose.monitoring.yml down

echo -e "\n${GREEN}✅ Monitoring stack stopped!${NC}"

echo -e "\n${YELLOW}To restart monitoring:${NC}"
echo "  ./scripts/start-monitoring.sh"

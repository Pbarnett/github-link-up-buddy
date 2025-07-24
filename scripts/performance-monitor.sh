#!/bin/bash

CONTAINER_NAME="github-link-up-buddy-prod"

# Get container stats
STATS=$(docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" "$CONTAINER_NAME")

# Log performance metrics
echo "$(date): $STATS" >> /tmp/performance.log

# Alert if CPU > 80% or Memory > 512MB
CPU_PERCENT=$(docker stats --no-stream --format "{{.CPUPerc}}" "$CONTAINER_NAME" | sed 's/%//')
MEMORY_MB=$(docker stats --no-stream --format "{{.MemUsage}}" "$CONTAINER_NAME" | cut -d'/' -f1 | sed 's/MiB//')

if (( $(echo "$CPU_PERCENT > 80" | bc -l) )); then
    echo "⚠️  High CPU usage: $CPU_PERCENT%" | tee -a /tmp/alerts.log
fi

if (( $(echo "$MEMORY_MB > 512" | bc -l) )); then
    echo "⚠️  High memory usage: ${MEMORY_MB}MB" | tee -a /tmp/alerts.log
fi

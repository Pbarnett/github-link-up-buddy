#!/bin/bash

CONTAINER_NAME="github-link-up-buddy-prod"
WEBHOOK_URL="YOUR_SLACK_WEBHOOK_URL_HERE"

check_container_health() {
    if ! docker ps | grep -q "$CONTAINER_NAME"; then
        echo "❌ Container $CONTAINER_NAME is not running!"
        
        # Send alert (replace with your notification method)
        curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"🚨 GitHub Link Up Buddy container is down!"}' \
            "$WEBHOOK_URL" 2>/dev/null || true
        
        # Attempt restart
        echo "🔄 Attempting to restart container..."
        docker restart "$CONTAINER_NAME" || {
            echo "❌ Failed to restart container"
            exit 1
        }
    else
        # Check health endpoint
        if ! curl -f http://localhost:3001/health > /dev/null 2>&1; then
            echo "❌ Health check failed!"
            docker restart "$CONTAINER_NAME"
        else
            echo "✅ Container is healthy"
        fi
    fi
}

check_container_health

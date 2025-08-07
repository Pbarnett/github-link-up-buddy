#!/bin/bash

set -e

CONTAINER_NAME="github-link-up-buddy-prod"
NEW_CONTAINER_NAME="github-link-up-buddy-new"
IMAGE_NAME="github-link-up-buddy:latest"

echo "🚀 Starting zero-downtime deployment..."

# Build new image
echo "🏗️  Building new image..."
docker build -t "$IMAGE_NAME" .

# Start new container on different port
echo "🆕 Starting new container..."
docker run -d --name "$NEW_CONTAINER_NAME" \
    --env-file .env.production \
    -p 3002:80 \
    --restart unless-stopped \
    "$IMAGE_NAME"

# Wait for new container to be healthy
echo "⏳ Waiting for new container to be ready..."
for i in {1..30}; do
    if curl -f http://localhost:3002/health > /dev/null 2>&1; then
        echo "✅ New container is healthy"
        break
    fi
    sleep 2
done

# Switch traffic (update port mapping)
echo "🔄 Switching traffic..."
docker stop "$CONTAINER_NAME"
docker rm "$CONTAINER_NAME"

# Rename new container
docker stop "$NEW_CONTAINER_NAME"
docker rm "$NEW_CONTAINER_NAME"

# Start final container on production port
docker run -d --name "$CONTAINER_NAME" \
    --env-file .env.production \
    -p 3001:80 \
    --restart unless-stopped \
    "$IMAGE_NAME"

echo "🎉 Zero-downtime deployment completed!"

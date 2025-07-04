#!/bin/bash

# Build script for Parker Flight application
# This script builds the Docker image with proper build args and security best practices

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="parker-flight"
IMAGE_TAG="${1:-latest}"
REGISTRY="${REGISTRY:-}"

# Build arguments
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
VCS_REF=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

echo -e "${GREEN}Building Parker Flight Docker image...${NC}"
echo -e "${YELLOW}Image: ${IMAGE_NAME}:${IMAGE_TAG}${NC}"
echo -e "${YELLOW}Version: ${VERSION}${NC}"
echo -e "${YELLOW}Build Date: ${BUILD_DATE}${NC}"
echo -e "${YELLOW}VCS Ref: ${VCS_REF}${NC}"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    echo -e "${YELLOW}Please create .env.production with your environment variables.${NC}"
    echo -e "${YELLOW}You can use .env.example as a template.${NC}"
    exit 1
fi

# Source environment variables for build
set -a  # automatically export all variables
source .env.production
set +a

# Build the Docker image
echo -e "${GREEN}Building Docker image...${NC}"
docker build \
    --target production \
    --build-arg BUILD_DATE="${BUILD_DATE}" \
    --build-arg VERSION="${VERSION}" \
    --build-arg VCS_REF="${VCS_REF}" \
    --build-arg VITE_SUPABASE_URL="${VITE_SUPABASE_URL}" \
    --build-arg VITE_SUPABASE_ANON_KEY="${VITE_SUPABASE_ANON_KEY}" \
    --build-arg VITE_FLAG_FS_V2="${VITE_FLAG_FS_V2}" \
    --build-arg VITE_STRIPE_PUBLISHABLE_KEY="${VITE_STRIPE_PUBLISHABLE_KEY}" \
    --build-arg NODE_ENV="${NODE_ENV}" \
    --build-arg PORT="${PORT}" \
    -t "${IMAGE_NAME}:${IMAGE_TAG}" \
    -t "${IMAGE_NAME}:latest" \
    .

# Tag with registry if specified
if [ ! -z "${REGISTRY}" ]; then
    echo -e "${GREEN}Tagging image for registry: ${REGISTRY}${NC}"
    docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
    docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "${REGISTRY}/${IMAGE_NAME}:latest"
fi

echo -e "${GREEN}Build completed successfully!${NC}"
echo -e "${GREEN}Image: ${IMAGE_NAME}:${IMAGE_TAG}${NC}"

# Show image size
echo -e "${YELLOW}Image size:${NC}"
docker images "${IMAGE_NAME}:${IMAGE_TAG}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Optional: Run security scan
if command -v trivy &> /dev/null; then
    echo -e "${GREEN}Running security scan...${NC}"
    trivy image "${IMAGE_NAME}:${IMAGE_TAG}"
fi

echo -e "${GREEN}Build process completed!${NC}"
echo -e "${YELLOW}To run the container:${NC}"
echo -e "docker run -p 80:80 ${IMAGE_NAME}:${IMAGE_TAG}"
echo -e "${YELLOW}To run with docker-compose:${NC}"
echo -e "docker-compose up -d"

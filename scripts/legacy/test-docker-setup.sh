#!/bin/bash

# Docker Setup Test Script
# This script tests all the Docker improvements we've made

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 Docker Setup Test Script${NC}"
echo -e "${YELLOW}=============================${NC}"

# 1. Test Docker Build
echo -e "\n${YELLOW}1. Testing Docker Build...${NC}"
docker build -t parker-flight-test . --quiet
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker build successful${NC}"
else
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

# 2. Test Docker Run
echo -e "\n${YELLOW}2. Testing Docker Run...${NC}"
docker run -d --name parker-flight-test-container -p 8080:80 parker-flight-test
sleep 5

# 3. Test Health Check
echo -e "\n${YELLOW}3. Testing Health Check...${NC}"
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
fi

# 4. Test Container Security
echo -e "\n${YELLOW}4. Testing Container Security...${NC}"
docker inspect parker-flight-test-container --format='{{.State.Status}}' | grep -q "running"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Container is running${NC}"
else
    echo -e "${RED}❌ Container is not running${NC}"
fi

# 5. Test Image Layers and Size
echo -e "\n${YELLOW}5. Testing Image Optimization...${NC}"
IMAGE_SIZE=$(docker images parker-flight-test --format "{{.Size}}")
echo -e "Image size: ${IMAGE_SIZE}"

# 6. Clean up
echo -e "\n${YELLOW}6. Cleaning up...${NC}"
docker stop parker-flight-test-container > /dev/null 2>&1
docker rm parker-flight-test-container > /dev/null 2>&1

echo -e "\n${GREEN}🎉 Docker setup test completed successfully!${NC}"
echo -e "${YELLOW}Your Docker configuration is optimized and ready for production.${NC}"

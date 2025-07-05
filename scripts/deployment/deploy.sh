#!/bin/bash

# Parker Flight Docker Deployment Script
# Usage: ./deploy.sh [environment]
# Environment: production (default), staging, development

set -e

ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.yml"
IMAGE_NAME="parker-flight"
IMAGE_TAG="${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"

echo "🚀 Deploying Parker Flight to ${ENVIRONMENT}..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install it and try again."
    exit 1
fi

print_status "Docker environment check passed ✅"

# Build the application first to catch any build errors
print_status "Building application..."
if npm run build; then
    print_status "Application build successful ✅"
else
    print_error "Application build failed ❌"
    exit 1
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down --remove-orphans || true

# Remove old images (optional, saves disk space)
print_warning "Removing old Docker images to save space..."
docker image prune -f || true

# Build new Docker image
print_status "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}..."
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .

if [ $? -eq 0 ]; then
    print_status "Docker image built successfully ✅"
else
    print_error "Docker image build failed ❌"
    exit 1
fi

# Start the services
print_status "Starting Parker Flight services..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."
sleep 10

# Check if the application is running
print_status "Checking application health..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    print_status "✅ Parker Flight is running successfully!"
    print_status "🌐 Application available at: http://localhost"
    
    # Show running containers
    echo ""
    echo "Running containers:"
    docker-compose -f $COMPOSE_FILE ps
    
    # Show logs
    echo ""
    print_status "Recent logs:"
    docker-compose -f $COMPOSE_FILE logs --tail=20
    
    echo ""
    print_status "🎉 Deployment completed successfully!"
    print_status "📊 To view live logs: docker-compose logs -f"
    print_status "🛑 To stop: docker-compose down"
    
else
    print_error "❌ Health check failed. Application may not be running correctly."
    print_warning "Checking logs for issues..."
    docker-compose -f $COMPOSE_FILE logs --tail=50
    exit 1
fi

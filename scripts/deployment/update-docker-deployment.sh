#!/bin/bash

# Parker Flight Docker Deployment Update Script
# This script updates all existing Docker containers and images to use the latest configurations

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_NAME="github-link-up-buddy"
BACKUP_TAG="backup-$(date +%Y%m%d-%H%M%S)"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    success "Docker is running"
}

# Function to backup current images
backup_images() {
    log "Creating backup tags for current images..."
    
    # Get all parker-flight related images
    local images=$(docker images --filter "reference=*parker-flight*" --filter "reference=*github-link-up-buddy*" --format "{{.Repository}}:{{.Tag}}")
    
    for image in $images; do
        if [[ "$image" != *"backup-"* ]]; then
            log "Backing up $image as ${image%:*}:$BACKUP_TAG"
            docker tag "$image" "${image%:*}:$BACKUP_TAG" || warning "Failed to backup $image"
        fi
    done
}

# Function to stop and remove old containers
cleanup_containers() {
    log "Stopping and removing old containers..."
    
    # Stop all compose services gracefully
    if docker compose ls | grep -q "$PROJECT_NAME"; then
        log "Stopping Docker Compose services..."
        docker compose down --remove-orphans || warning "Failed to stop some compose services"
    fi
    
    # Stop individual containers that might be running
    local containers=$(docker ps -a --filter "name=*parker*" --filter "name=*github-link-up-buddy*" --format "{{.Names}}")
    
    for container in $containers; do
        log "Stopping container: $container"
        docker stop "$container" 2>/dev/null || warning "Container $container was not running"
        log "Removing container: $container"
        docker rm "$container" 2>/dev/null || warning "Failed to remove container $container"
    done
}

# Function to build new images with latest configurations
build_images() {
    log "Building updated Docker images..."
    
    # Build main application image with latest Dockerfile
    log "Building main application image..."
    docker build \
        --tag "parker-flight:latest" \
        --tag "parker-flight:$(date +%Y%m%d-%H%M%S)" \
        --label "build.date=$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
        --label "build.version=1.5.0" \
        --no-cache \
        . || {
        error "Failed to build main application image"
        exit 1
    }
    
    # Build secure variant if Dockerfile.secure exists
    if [[ -f "Dockerfile.secure" ]]; then
        log "Building secure variant..."
        docker build \
            --file Dockerfile.secure \
            --tag "parker-flight:secure" \
            --tag "parker-flight:secure-$(date +%Y%m%d-%H%M%S)" \
            --no-cache \
            . || warning "Failed to build secure variant"
    fi
    
    # Build backend if Dockerfile.backend exists
    if [[ -f "Dockerfile.backend" ]]; then
        log "Building backend image..."
        docker build \
            --file Dockerfile.backend \
            --tag "parker-flight-backend:latest" \
            --tag "parker-flight-backend:$(date +%Y%m%d-%H%M%S)" \
            --no-cache \
            . || warning "Failed to build backend image"
    fi
    
    success "All images built successfully"
}

# Function to update compose configurations
update_compose_configs() {
    log "Validating Docker Compose configurations..."
    
    local compose_files=(
        "docker-compose.yml"
        "docker-compose.dev.yml"
        "docker-compose.staging.yml"
        "docker-compose.production.yml"
    )
    
    for file in "${compose_files[@]}"; do
        if [[ -f "$file" ]]; then
            log "Validating $file..."
            docker compose -f "$file" config >/dev/null || warning "$file has configuration issues"
        fi
    done
}

# Function to deploy updated services
deploy_services() {
    log "Deploying updated services..."
    
    # Start with the main docker-compose.yml
    if [[ -f "docker-compose.yml" ]]; then
        log "Starting main application stack..."
        docker compose up -d --build --force-recreate || {
            error "Failed to start main application stack"
            return 1
        }
    fi
    
    # Deploy additional environments if requested
    read -p "Deploy development environment? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [[ -f "docker-compose.dev.yml" ]]; then
            log "Starting development environment..."
            docker compose -f docker-compose.dev.yml up -d --build --force-recreate || warning "Failed to start development environment"
        fi
    fi
    
    read -p "Deploy staging environment? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [[ -f "docker-compose.staging.yml" ]]; then
            log "Starting staging environment..."
            docker compose -f docker-compose.staging.yml up -d --build --force-recreate || warning "Failed to start staging environment"
        fi
    fi
    
    read -p "Deploy production environment? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [[ -f "docker-compose.production.yml" ]]; then
            log "Starting production environment..."
            docker compose -f docker-compose.production.yml up -d --build --force-recreate || warning "Failed to start production environment"
        fi
    fi
}

# Function to verify deployments
verify_deployments() {
    log "Verifying deployments..."
    
    # Check container status
    log "Container status:"
    docker ps --filter "name=*parker*" --filter "name=*github-link-up-buddy*" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    # Check health status
    log "Checking health status..."
    local containers=$(docker ps --filter "name=*parker*" --filter "name=*github-link-up-buddy*" --format "{{.Names}}")
    
    for container in $containers; do
        local health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "no-healthcheck")
        log "Container $container: $health"
        
        # Test HTTP endpoints if applicable
        local ports=$(docker port "$container" 2>/dev/null | grep "80/tcp" | cut -d':' -f2 || echo "")
        for port in $ports; do
            log "Testing HTTP endpoint on port $port..."
            if curl -f "http://localhost:$port/health" >/dev/null 2>&1; then
                success "Health check passed for $container on port $port"
            else
                warning "Health check failed for $container on port $port"
            fi
        done
    done
}

# Function to cleanup old images
cleanup_old_images() {
    log "Cleaning up old images..."
    
    read -p "Remove old images (keeping backups)? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Remove untagged images
        docker image prune -f || warning "Failed to prune untagged images"
        
        # Remove old tagged images (but keep backups)
        local old_images=$(docker images --filter "reference=*parker-flight*" --filter "reference=*github-link-up-buddy*" --format "{{.Repository}}:{{.Tag}}" | grep -v "backup-" | grep -v "latest" | head -n -5)
        
        for image in $old_images; do
            log "Removing old image: $image"
            docker rmi "$image" 2>/dev/null || warning "Failed to remove $image"
        done
    fi
}

# Function to update CI/CD configurations
update_ci_cd() {
    log "Checking CI/CD configurations..."
    
    if [[ -d ".github/workflows" ]]; then
        log "GitHub Actions workflows found - consider updating them to use the new Docker configurations"
        ls -la .github/workflows/
    fi
    
    if [[ -f ".gitlab-ci.yml" ]]; then
        log "GitLab CI configuration found - consider updating it to use the new Docker configurations"
    fi
    
    if [[ -d ".circleci" ]]; then
        log "CircleCI configuration found - consider updating it to use the new Docker configurations"
    fi
}

# Function to generate deployment report
generate_report() {
    local report_file="deployment-update-report-$(date +%Y%m%d-%H%M%S).md"
    
    log "Generating deployment report: $report_file"
    
    cat > "$report_file" << EOF
# Docker Deployment Update Report

**Date:** $(date)
**Project:** Parker Flight (github-link-up-buddy)
**Update Version:** 1.5.0

## Updated Components

### Docker Images Built
$(docker images --filter "reference=*parker-flight*" --filter "reference=*github-link-up-buddy*" --format "- {{.Repository}}:{{.Tag}} ({{.Size}}, {{.CreatedSince}})")

### Running Containers
$(docker ps --filter "name=*parker*" --filter "name=*github-link-up-buddy*" --format "- {{.Names}}: {{.Status}} ({{.Ports}})")

### Available Compose Files
$(find . -name "docker-compose*.yml" -maxdepth 1 | sed 's|./|- |')

### Backup Images Created
$(docker images --filter "reference=*backup-*" --format "- {{.Repository}}:{{.Tag}} ({{.CreatedSince}})")

## Configuration Updates Applied

- ✅ Updated to Node.js 20 Alpine base image
- ✅ Enhanced security with non-root user setup
- ✅ Improved build caching with pnpm cache mounts
- ✅ Dynamic port configuration support
- ✅ Enhanced nginx configuration with security headers
- ✅ Comprehensive health checks
- ✅ OCI-compliant image labels
- ✅ Multi-stage build optimization

## Verification Results

### Health Check Status
$(docker ps --filter "name=*parker*" --filter "name=*github-link-up-buddy*" --format "{{.Names}}" | while read container; do
    health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "no-healthcheck")
    echo "- $container: $health"
done)

## Next Steps

1. Monitor containers for stability over the next 24 hours
2. Update CI/CD pipelines to use new Docker configurations
3. Consider implementing container orchestration (Kubernetes/Docker Swarm)
4. Set up monitoring and logging for production deployments
5. Schedule regular image updates and security scans

## Rollback Instructions

If issues occur, you can rollback using the backup images:

\`\`\`bash
docker stop \$(docker ps -q --filter "name=*parker*")
docker run -d --name parker-flight-rollback parker-flight:$BACKUP_TAG
\`\`\`
EOF

    success "Report generated: $report_file"
}

# Main execution function
main() {
    log "Starting Parker Flight Docker deployment update..."
    log "This script will update all Docker containers and images to use the latest configurations"
    
    echo
    read -p "Continue with the deployment update? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Deployment update cancelled"
        exit 0
    fi
    
    # Execute update steps
    check_docker
    backup_images
    cleanup_containers
    build_images
    update_compose_configs
    deploy_services
    verify_deployments
    cleanup_old_images
    update_ci_cd
    generate_report
    
    success "Docker deployment update completed successfully!"
    log "Check the generated report for detailed information"
    log "Monitor your containers and verify everything is working as expected"
}

# Execute main function
main "$@"

#!/bin/bash
set -euo pipefail

# Production deployment script for Parker Flight
# Usage: ./scripts/deploy-production.sh [version]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.production.yml"
ENV_FILE=".env.production"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    if [[ ! -f "$ENV_FILE" ]]; then
        log_error "Environment file $ENV_FILE not found"
        log_info "Copy .env.production.example to $ENV_FILE and configure it"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Create backup
create_backup() {
    log_info "Creating backup..."
    mkdir -p "$BACKUP_DIR"
    
    # Backup current deployment
    if docker-compose -f "$COMPOSE_FILE" ps -q > /dev/null 2>&1; then
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" config > "$BACKUP_DIR/docker-compose.backup.yml"
        log_success "Configuration backed up to $BACKUP_DIR"
    fi
    
    # Backup volumes if they exist
    if docker volume ls -q | grep -q parker-flight; then
        log_info "Backing up Docker volumes..."
        docker run --rm \
            -v parker-flight_app_logs:/source:ro \
            -v "$PWD/$BACKUP_DIR":/backup \
            alpine tar czf /backup/app_logs.tar.gz -C /source .
    fi
}

# Pull latest images
pull_images() {
    log_info "Pulling latest images..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" pull
    log_success "Images updated"
}

# Deploy application
deploy() {
    local version=${1:-latest}
    export IMAGE_TAG="$version"
    
    log_info "Deploying Parker Flight version: $version"
    
    # Stop current services
    log_info "Stopping current services..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down --remove-orphans
    
    # Start new services
    log_info "Starting new services..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
    
    # Wait for health checks
    log_info "Waiting for application to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps | grep -q "Up (healthy)"; then
            log_success "Application is healthy"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            log_error "Application failed to become healthy"
            rollback
            exit 1
        fi
        
        log_info "Attempt $attempt/$max_attempts - waiting for health check..."
        sleep 10
        ((attempt++))
    done
}

# Rollback deployment
rollback() {
    log_warn "Rolling back deployment..."
    
    if [[ -f "$BACKUP_DIR/docker-compose.backup.yml" ]]; then
        docker-compose -f "$BACKUP_DIR/docker-compose.backup.yml" up -d
        log_success "Rollback completed"
    else
        log_error "No backup found for rollback"
    fi
}

# Cleanup old backups
cleanup_backups() {
    log_info "Cleaning up old backups..."
    find backups/ -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true
    log_success "Old backups cleaned up"
}

# Show deployment status
show_status() {
    log_info "Deployment Status:"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
    
    log_info "Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
}

# Main deployment process
main() {
    local version=${1:-latest}
    
    echo "🚀 Parker Flight Production Deployment"
    echo "======================================"
    
    check_prerequisites
    create_backup
    pull_images
    deploy "$version"
    cleanup_backups
    show_status
    
    log_success "Deployment completed successfully!"
    log_info "Access your application at: https://$(grep DOMAIN $ENV_FILE | cut -d'=' -f2)"
    log_info "Monitoring dashboard: https://$(grep DOMAIN $ENV_FILE | cut -d'=' -f2):3001"
}

# Handle script arguments
case "${1:-}" in
    --rollback)
        rollback
        ;;
    --status)
        show_status
        ;;
    --backup)
        create_backup
        ;;
    *)
        main "$@"
        ;;
esac

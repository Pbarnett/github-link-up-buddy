#!/bin/bash

# =============================================================================
# Parker Flight - Enhanced Docker Deployment Script
# Production deployment with TypeScript validation, comprehensive monitoring,
# zero-downtime updates, and robust error handling
# =============================================================================

set -euo pipefail  # Exit on error, undefined vars, and pipe failures

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="docker-compose.yml"
PROJECT_NAME="parker-flight"
BACKUP_DIR="./backups"
LOG_FILE="deployment.log"
ENV_FILE=".env.production"

# Default options
SKIP_TYPESCRIPT_CHECK=false
SKIP_HEALTHCHECK=false
ENABLE_MONITORING=false
VERBOSE=false
FORCE_REBUILD=false
CLEANUP_OLD_IMAGES=true

# Enhanced logging function
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")  echo -e "${GREEN}[INFO]${NC}  $timestamp - $message" | tee -a "$LOG_FILE" ;;
        "WARN")  echo -e "${YELLOW}[WARN]${NC}  $timestamp - $message" | tee -a "$LOG_FILE" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} $timestamp - $message" | tee -a "$LOG_FILE" ;;
        "DEBUG") echo -e "${BLUE}[DEBUG]${NC} $timestamp - $message" | tee -a "$LOG_FILE" ;;
    esac
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-typescript)
                SKIP_TYPESCRIPT_CHECK=true
                shift
                ;;
            --skip-healthcheck)
                SKIP_HEALTHCHECK=true
                shift
                ;;
            --enable-monitoring)
                ENABLE_MONITORING=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                set -x
                shift
                ;;
            --force-rebuild)
                FORCE_REBUILD=true
                shift
                ;;
            --no-cleanup)
                CLEANUP_OLD_IMAGES=false
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            deploy|rollback|status|logs|stop|restart|validate)
                # Valid commands, continue
                break
                ;;
            *)
                log ERROR "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# Help function
show_help() {
    cat << EOF
Parker Flight Docker Deployment Script

Usage: $0 [OPTIONS] [COMMAND]

COMMANDS:
    deploy      Deploy the application (default)
    rollback    Rollback to previous version
    status      Show current status
    logs        Show application logs
    stop        Stop the application
    restart     Restart the application
    validate    Validate TypeScript and configuration

OPTIONS:
    --skip-typescript    Skip TypeScript validation
    --skip-healthcheck   Skip health checks
    --enable-monitoring  Enable monitoring stack
    --verbose           Enable verbose output
    --force-rebuild     Force rebuild without cache
    --no-cleanup        Don't cleanup old images
    -h, --help          Show this help message

EXAMPLES:
    $0                           # Standard deployment
    $0 --verbose deploy          # Verbose deployment
    $0 --force-rebuild deploy    # Force rebuild
    $0 validate                  # Validate only
EOF
}

log INFO "🚀 Starting Parker Flight Deployment Script"
log INFO "============================================"

# TypeScript validation function
validate_typescript() {
    if [[ "$SKIP_TYPESCRIPT_CHECK" == "true" ]]; then
        log WARN "Skipping TypeScript validation as requested"
        return 0
    fi
    
    log INFO "Validating TypeScript configuration and types..."
    
    cd "$PROJECT_DIR"
    
    # Check if node_modules exists
    if [[ ! -d "node_modules" ]]; then
        log INFO "Installing dependencies for TypeScript validation..."
        pnpm install --frozen-lockfile
    fi
    
    # Run TypeScript compiler check
    log INFO "Running TypeScript compiler check..."
    if ! pnpm run tsc --noEmit; then
        log ERROR "TypeScript validation failed"
        return 1
    fi
    
    # Run linting if available
    if grep -q '"lint"' package.json; then
        log INFO "Running ESLint checks..."
        if ! pnpm run lint --max-warnings=0; then
            log WARN "Linting completed with warnings"
        fi
    fi
    
    log INFO "TypeScript validation completed successfully"
}

# Enhanced health checks
perform_health_checks() {
    if [[ "$SKIP_HEALTHCHECK" == "true" ]]; then
        log WARN "Skipping health checks as requested"
        return 0
    fi
    
    log INFO "Performing enhanced health checks..."
    
    local max_attempts=30
    local attempt=1
    local health_url="http://localhost:80/health"
    
    while [[ $attempt -le $max_attempts ]]; do
        log DEBUG "Health check attempt $attempt/$max_attempts"
        
        if curl -f -s "$health_url" > /dev/null 2>&1; then
            log INFO "Application is healthy and responding"
            return 0
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log ERROR "Health check failed after $max_attempts attempts"
            log INFO "Container logs for debugging:"
            docker-compose logs --tail=50 parker-flight
            return 1
        fi
        
        log DEBUG "Health check failed, retrying in 10 seconds..."
        sleep 10
        ((attempt++))
    done
}
# Function to check prerequisites
check_prerequisites() {
    log INFO "Checking prerequisites..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        log ERROR "Docker is not running"
        exit 1
    fi
    
    # Check if Docker Compose is available
    if ! command -v docker-compose &> /dev/null; then
        log ERROR "Docker Compose is not installed"
        exit 1
    fi
    
    # Check if .env.production exists
    if [ ! -f "$ENV_FILE" ]; then
        log ERROR "$ENV_FILE file not found!"
        log INFO "Please create $ENV_FILE with your environment variables."
        exit 1
    fi
    
    # Check if TypeScript config exists
    if [[ ! -f "tsconfig.json" ]] && [[ "$SKIP_TYPESCRIPT_CHECK" == "false" ]]; then
        log WARN "TypeScript configuration not found, skipping TS validation"
        SKIP_TYPESCRIPT_CHECK=true
    fi
    
    log INFO "Prerequisites check passed"
}

# Function to backup current deployment
backup_current() {
    log INFO "Creating deployment backup..."
    
    # Create backup directory
    mkdir -p "${BACKUP_DIR}"
    
    # Backup current env file
    if [ -f "$ENV_FILE" ]; then
        cp "$ENV_FILE" "${BACKUP_DIR}/.env.production.$(date +%Y%m%d_%H%M%S)"
        log INFO "Environment backup created"
    fi
    
    # Export current container if it exists
    if docker ps -q -f name=${PROJECT_NAME}-app > /dev/null 2>&1; then
        log INFO "Exporting current container..."
        docker commit ${PROJECT_NAME}-app ${PROJECT_NAME}-backup:$(date +%Y%m%d_%H%M%S)
        log INFO "Container backup created"
    fi
}

# Enhanced deploy function
deploy() {
    log INFO "Starting enhanced deployment process..."
    
    # Pull latest changes (if in git repo)
    if [ -d ".git" ]; then
        log INFO "Pulling latest changes from repository..."
        git pull origin main || git pull origin master
        log INFO "Code updated successfully"
    fi
    
    # Validate TypeScript before building
    validate_typescript
    
    # Build new image
    log INFO "Building application Docker image..."
    local build_args=""
    if [[ "$FORCE_REBUILD" == "true" ]]; then
        build_args="--no-cache"
    fi
    
    if [[ "$FORCE_REBUILD" == "true" ]]; then
        BUILD_ARGS="--force-rebuild" ./scripts/build.sh
    else
        ./scripts/build.sh
    fi
    
    # Deploy with zero downtime
    log INFO "Deploying application with zero downtime..."
    
    # Start new containers
    docker-compose -f ${COMPOSE_FILE} up -d --remove-orphans
    
    # Enhanced health check
    perform_health_checks
    
    # Deploy monitoring stack if requested
    if [[ "$ENABLE_MONITORING" == "true" ]] && [[ -f "docker-compose.monitoring.yml" ]]; then
        log INFO "Deploying monitoring stack..."
        docker-compose -f docker-compose.monitoring.yml up -d
    fi
    
    # Clean up old images if enabled
    if [[ "$CLEANUP_OLD_IMAGES" == "true" ]]; then
        log INFO "Cleaning up old Docker images..."
        docker image prune -f
        docker system prune -f --volumes
    fi
    
    log INFO "🎉 Deployment completed successfully!"
}

# Enhanced rollback function
rollback() {
    log ERROR "Initiating deployment rollback..."
    
    # Find latest backup
    LATEST_BACKUP=$(docker images ${PROJECT_NAME}-backup --format "table {{.Tag}}" | tail -n +2 | sort -r | head -n 1)
    
    if [ ! -z "$LATEST_BACKUP" ]; then
        log INFO "Rolling back to backup: ${LATEST_BACKUP}"
        
        # Stop current containers
        log INFO "Stopping current containers..."
        docker-compose -f ${COMPOSE_FILE} down
        
        # Start backup container
        log INFO "Starting rollback container..."
        docker run -d --name ${PROJECT_NAME}-app-rollback -p 80:80 ${PROJECT_NAME}-backup:${LATEST_BACKUP}
        
        # Verify rollback
        log INFO "Verifying rollback..."
        sleep 10
        if curl -f -s "http://localhost:80/health" > /dev/null 2>&1; then
            log INFO "Rollback completed successfully"
        else
            log WARN "Rollback container started but health check failed"
        fi
    else
        log ERROR "No backup found for rollback"
        exit 1
    fi
}

# Enhanced status function
show_status() {
    log INFO "Current deployment status:"
    docker-compose -f ${COMPOSE_FILE} ps
    
    echo
    log INFO "Application logs (last 20 lines):"
    docker-compose -f ${COMPOSE_FILE} logs --tail=20 parker-flight
    
    echo
    log INFO "Resource usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    
    echo
    log INFO "Application URLs:"
    echo "  Main application: http://localhost:80"
    echo "  Health check: http://localhost:80/health"
    
    if [[ "$ENABLE_MONITORING" == "true" ]]; then
        echo "  Monitoring: http://localhost:9090 (if configured)"
    fi
}

# Parse command line arguments and extract command
COMMAND="deploy"  # Default command
ARGS=()

# Process arguments to separate options from command
while [[ $# -gt 0 ]]; do
    case $1 in
        deploy|rollback|status|logs|stop|restart|validate)
            COMMAND="$1"
            shift
            ;;
        *)
            ARGS+=("$1")
            shift
            ;;
    esac
done

# Parse the extracted arguments
parse_arguments "${ARGS[@]}"

# Change to project directory
cd "$PROJECT_DIR"

# Set up error handling
trap 'log ERROR "Deployment failed on line $LINENO. Exit code: $?"' ERR

case "$COMMAND" in
    "deploy")
        check_prerequisites
        backup_current
        deploy
        show_status
        ;;
    "rollback")
        rollback
        ;;
    "status")
        show_status
        ;;
    "logs")
        log INFO "Showing application logs..."
        docker-compose -f ${COMPOSE_FILE} logs -f parker-flight
        ;;
    "stop")
        log INFO "Stopping application..."
        docker-compose -f ${COMPOSE_FILE} down
        log INFO "Application stopped successfully"
        ;;
    "restart")
        log INFO "Restarting application..."
        docker-compose -f ${COMPOSE_FILE} restart
        log INFO "Application restarted successfully"
        ;;
    "validate")
        log INFO "Running validation checks only..."
        check_prerequisites
        validate_typescript
        log INFO "Validation completed successfully"
        ;;
    *)
        show_help
        exit 1
        ;;
esac

log INFO "Script execution completed"

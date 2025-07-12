#!/bin/bash

# Deployment script for Parker Flight application
# This script handles production deployment with zero-downtime updates

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.yml"
PROJECT_NAME="parker-flight"
BACKUP_DIR="./backups"

echo -e "${GREEN}🚀 Parker Flight Deployment Script${NC}"
echo -e "${BLUE}=================================${NC}"

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running${NC}"
        exit 1
    fi
    
    # Check if Docker Compose is available
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Error: Docker Compose is not installed${NC}"
        exit 1
    fi
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        echo -e "${RED}Error: .env.production file not found!${NC}"
        echo -e "${YELLOW}Please create .env.production with your environment variables.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Prerequisites check passed${NC}"
}

# Function to backup current deployment
backup_current() {
    echo -e "${YELLOW}Creating backup...${NC}"
    
    # Create backup directory
    mkdir -p "${BACKUP_DIR}"
    
    # Backup current env file
    if [ -f ".env.production" ]; then
        cp ".env.production" "${BACKUP_DIR}/.env.production.$(date +%Y%m%d_%H%M%S)"
        echo -e "${GREEN}✓ Environment backup created${NC}"
    fi
    
    # Export current container if it exists
    if docker ps -q -f name=${PROJECT_NAME}-app >/dev/null 2>&1; then
        echo -e "${YELLOW}Exporting current container...${NC}"
        docker commit ${PROJECT_NAME}-app ${PROJECT_NAME}-backup:$(date +%Y%m%d_%H%M%S)
        echo -e "${GREEN}✓ Container backup created${NC}"
    fi
}

# Function to deploy
deploy() {
    echo -e "${YELLOW}Starting deployment...${NC}"
    
    # Pull latest changes (if in git repo)
    if [ -d ".git" ]; then
        echo -e "${YELLOW}Pulling latest changes...${NC}"
        git pull origin main || git pull origin master
        echo -e "${GREEN}✓ Code updated${NC}"
    fi
    
    # Build new image
    echo -e "${YELLOW}Building application...${NC}"
    ./scripts/build.sh
    
    # Deploy with zero downtime
    echo -e "${YELLOW}Deploying application...${NC}"
    
    # Start new containers
    docker-compose -f ${COMPOSE_FILE} up -d --remove-orphans
    
    # Wait for health check
    echo -e "${YELLOW}Waiting for application to be healthy...${NC}"
    timeout 120 bash -c 'until docker-compose -f docker-compose.yml ps | grep -q "healthy"; do sleep 2; done'
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Application is healthy${NC}"
    else
        echo -e "${RED}✗ Health check failed - rolling back${NC}"
        rollback
        exit 1
    fi
    
    # Clean up old images
    echo -e "${YELLOW}Cleaning up old images...${NC}"
    docker image prune -f
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
}

# Function to rollback
rollback() {
    echo -e "${RED}Rolling back deployment...${NC}"
    
    # Find latest backup
    LATEST_BACKUP=$(docker images ${PROJECT_NAME}-backup --format "table {{.Tag}}" | tail -n +2 | sort -r | head -n 1)
    
    if [ ! -z "$LATEST_BACKUP" ]; then
        echo -e "${YELLOW}Rolling back to backup: ${LATEST_BACKUP}${NC}"
        
        # Stop current containers
        docker-compose -f ${COMPOSE_FILE} down
        
        # Start backup container
        docker run -d --name ${PROJECT_NAME}-app-rollback -p 80:80 ${PROJECT_NAME}-backup:${LATEST_BACKUP}
        
        echo -e "${GREEN}✓ Rollback completed${NC}"
    else
        echo -e "${RED}No backup found for rollback${NC}"
    fi
}

# Function to show status
show_status() {
    echo -e "${BLUE}Current deployment status:${NC}"
    docker-compose -f ${COMPOSE_FILE} ps
    
    echo -e "\n${BLUE}Application logs (last 20 lines):${NC}"
    docker-compose -f ${COMPOSE_FILE} logs --tail=20 parker-flight
    
    echo -e "\n${BLUE}Resource usage:${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
}

# Main execution
case "${1:-deploy}" in
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
        docker-compose -f ${COMPOSE_FILE} logs -f parker-flight
        ;;
    "stop")
        echo -e "${YELLOW}Stopping application...${NC}"
        docker-compose -f ${COMPOSE_FILE} down
        echo -e "${GREEN}✓ Application stopped${NC}"
        ;;
    "restart")
        echo -e "${YELLOW}Restarting application...${NC}"
        docker-compose -f ${COMPOSE_FILE} restart
        echo -e "${GREEN}✓ Application restarted${NC}"
        ;;
    *)
        echo -e "${BLUE}Usage: $0 {deploy|rollback|status|logs|stop|restart}${NC}"
        echo -e "  deploy   - Deploy the application (default)"
        echo -e "  rollback - Rollback to previous version"
        echo -e "  status   - Show current status"
        echo -e "  logs     - Show application logs"
        echo -e "  stop     - Stop the application"
        echo -e "  restart  - Restart the application"
        exit 1
        ;;
esac

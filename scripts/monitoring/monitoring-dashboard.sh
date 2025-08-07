#!/bin/bash

# Parker Flight Monitoring Dashboard Access Script
# This script provides easy access to all monitoring tools and their URLs

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to check if a service is running
check_service() {
    local service_name=$1
    local port=$2
    
    if curl -f http://localhost:$port/health >/dev/null 2>&1 || \
       curl -f http://localhost:$port >/dev/null 2>&1 || \
       nc -z localhost $port >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $service_name is running"
        return 0
    else
        echo -e "${RED}✗${NC} $service_name is not accessible"
        return 1
    fi
}

# Function to display service status
show_status() {
    echo -e "${BLUE}=== Parker Flight Monitoring Stack Status ===${NC}\n"
    
    echo "Application Services:"
    check_service "Parker Flight App" 80
    echo ""
    
    echo "Monitoring Services:"
    check_service "Prometheus" 9090
    check_service "Grafana" 3001
    check_service "AlertManager" 9093
    check_service "cAdvisor" 8080
    check_service "Node Exporter" 9100
    check_service "Uptime Kuma" 3002
    echo ""
    
    echo "Docker Container Status:"
    docker ps --filter "name=parker-flight-*" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(NAMES|parker-flight-)"
}

# Function to open dashboards
open_dashboards() {
    echo -e "${PURPLE}=== Opening Monitoring Dashboards ===${NC}\n"
    
    # Check if running on macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Opening dashboards in default browser..."
        open http://localhost:3001 &  # Grafana
        open http://localhost:9090 &  # Prometheus
        open http://localhost:3002 &  # Uptime Kuma
        open http://localhost:9093 &  # AlertManager
        sleep 2
        open http://localhost:8080 &  # cAdvisor
    else
        echo -e "Please open these URLs manually in your browser:"
        echo -e "${CYAN}Grafana:${NC} http://localhost:3001 (admin/admin)"
        echo -e "${CYAN}Prometheus:${NC} http://localhost:9090"
        echo -e "${CYAN}Uptime Kuma:${NC} http://localhost:3002"
        echo -e "${CYAN}AlertManager:${NC} http://localhost:9093"
        echo -e "${CYAN}cAdvisor:${NC} http://localhost:8080"
    fi
}

# Function to display metrics summary
show_metrics() {
    echo -e "${YELLOW}=== Current Metrics Summary ===${NC}\n"
    
    # Application health
    echo "Application Health:"
    curl -s http://localhost/health 2>/dev/null | head -1 || echo "Application not responding"
    echo ""
    
    # System metrics from node-exporter
    echo "System Load Average:"
    curl -s http://localhost:9100/metrics 2>/dev/null | grep "node_load1" | head -1 || echo "Node exporter not available"
    echo ""
    
    # Container count
    echo "Running Containers:"
    docker ps --filter "name=parker-flight-*" | wc -l | xargs echo "Active monitoring containers:"
    echo ""
    
    # Memory usage
    echo "Docker Memory Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}\t{{.CPUPerc}}" \
        $(docker ps --filter "name=parker-flight-*" --format "{{.Names}}" | tr '\n' ' ') 2>/dev/null || echo "Unable to get container stats"
}

# Function to setup Grafana dashboards
setup_grafana() {
    echo -e "${BLUE}=== Setting up Grafana Dashboards ===${NC}\n"
    
    # Wait for Grafana to be ready
    echo "Waiting for Grafana to be ready..."
    timeout=60
    while ! curl -f http://localhost:3001/api/health >/dev/null 2>&1 && [ $timeout -gt 0 ]; do
        sleep 2
        timeout=$((timeout-2))
        echo -n "."
    done
    echo ""
    
    if [ $timeout -le 0 ]; then
        echo -e "${RED}Grafana is not responding. Please check the container logs.${NC}"
        return 1
    fi
    
    echo -e "${GREEN}Grafana is ready!${NC}"
    echo ""
    echo "Default login credentials:"
    echo "  Username: admin"
    echo "  Password: admin"
    echo ""
    echo "Dashboard URLs:"
    echo "  - Parker Flight Overview: http://localhost:3001/d/parker-flight"
    echo "  - System Metrics: http://localhost:3001/d/system-overview"
    echo "  - Business Rules: http://localhost:3001/d/business-rules"
}

# Function to show logs
show_logs() {
    local service=${1:-"all"}
    
    echo -e "${YELLOW}=== Monitoring Stack Logs ===${NC}\n"
    
    if [ "$service" = "all" ]; then
        echo "Recent logs from all monitoring services:"
        docker logs parker-flight-prometheus --tail 5 2>/dev/null | sed 's/^/[Prometheus] /' || echo "Prometheus logs not available"
        docker logs parker-flight-grafana --tail 5 2>/dev/null | sed 's/^/[Grafana] /' || echo "Grafana logs not available"
        docker logs parker-flight-alertmanager --tail 5 2>/dev/null | sed 's/^/[AlertManager] /' || echo "AlertManager logs not available"
    else
        echo "Logs for $service:"
        docker logs "parker-flight-$service" --tail 20 2>/dev/null || echo "Service logs not available"
    fi
}

# Function to restart monitoring stack
restart_monitoring() {
    echo -e "${YELLOW}=== Restarting Monitoring Stack ===${NC}\n"
    
    read -p "Are you sure you want to restart the monitoring stack? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Stopping monitoring services..."
        docker compose -f docker-compose.monitoring.yml down
        
        echo "Starting monitoring services..."
        docker compose -f docker-compose.monitoring.yml up -d
        
        echo "Waiting for services to be ready..."
        sleep 30
        
        show_status
    else
        echo "Restart cancelled."
    fi
}

# Main menu
show_menu() {
    echo -e "${PURPLE}=== Parker Flight Monitoring Dashboard ===${NC}\n"
    echo "Choose an option:"
    echo "  1) Show service status"
    echo "  2) Open all dashboards"
    echo "  3) Show current metrics"
    echo "  4) Setup Grafana dashboards"
    echo "  5) Show logs (all services)"
    echo "  6) Show logs (specific service)"
    echo "  7) Restart monitoring stack"
    echo "  8) Exit"
    echo ""
    read -p "Enter your choice (1-8): " choice
    
    case $choice in
        1) show_status ;;
        2) open_dashboards ;;
        3) show_metrics ;;
        4) setup_grafana ;;
        5) show_logs ;;
        6) 
            read -p "Enter service name (prometheus, grafana, alertmanager, etc.): " service
            show_logs "$service"
            ;;
        7) restart_monitoring ;;
        8) exit 0 ;;
        *) echo -e "${RED}Invalid option${NC}" ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
    echo ""
}

# Check if running with arguments
if [ $# -eq 0 ]; then
    # Interactive mode
    while true; do
        show_menu
    done
else
    # Command line mode
    case $1 in
        status) show_status ;;
        open) open_dashboards ;;
        metrics) show_metrics ;;
        setup) setup_grafana ;;
        logs) show_logs "${2:-all}" ;;
        restart) restart_monitoring ;;
        --help|-h)
            echo "Usage: $0 [command] [args]"
            echo ""
            echo "Commands:"
            echo "  status    - Show service status"
            echo "  open      - Open all dashboards"
            echo "  metrics   - Show current metrics"
            echo "  setup     - Setup Grafana dashboards"
            echo "  logs      - Show logs (optionally specify service)"
            echo "  restart   - Restart monitoring stack"
            echo ""
            echo "Interactive mode: $0 (no arguments)"
            ;;
        *)
            echo "Unknown command: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
fi

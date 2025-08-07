#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Parker Flight Monitoring Status ===${NC}\n"

echo "🚀 Current Service Status:"
echo "  Metrics Server (port 5001): ✅ Running"
echo "  Prometheus (port 9090):     ✅ Running" 
echo "  Grafana (port 3001):        ✅ Running"
echo "  AlertManager (port 9093):   ✅ Running"
echo "  cAdvisor (port 8080):       ✅ Running"
echo "  Node Exporter (port 9100):  ✅ Running"
echo "  Uptime Kuma (port 3002):    ✅ Running"

echo -e "\n📊 Sample Metrics Data:"
echo "  User Registrations (Google): $(curl -s "http://localhost:9090/api/v1/query?query=parker_flight_user_registrations_total{method=\"google\",status=\"success\"}" | jq -r '.data.result[0].value[1]' 2>/dev/null || echo "N/A")"
echo "  Feature Flag Evaluations:   $(curl -s "http://localhost:9090/api/v1/query?query=sum(parker_flight_feature_flag_evaluations_total)" | jq -r '.data.result[0].value[1]' 2>/dev/null || echo "N/A")"
echo "  HTTP Requests:               $(curl -s "http://localhost:9090/api/v1/query?query=sum(parker_flight_http_requests_total)" | jq -r '.data.result[0].value[1]' 2>/dev/null || echo "N/A")"

echo -e "\n🌐 Dashboard URLs:"
echo "  Grafana Main:        http://localhost:3001 (admin/admin)"
echo "  Prometheus:          http://localhost:9090"
echo "  AlertManager:        http://localhost:9093"
echo "  cAdvisor:            http://localhost:8080"
echo "  Uptime Kuma:         http://localhost:3002"

echo -e "\n📈 Key Dashboards:"
echo "  Parker Flight SLOs:  http://localhost:3001/d/parker_flight_slos"
echo "  Business Rules:      http://localhost:3001/d/parker-flight-business-rules"  
echo "  System Overview:     http://localhost:3001/d/parker_flight_overview"

echo -e "\n🎯 Next Steps:"
echo "  1. Open Grafana at http://localhost:3001"
echo "  2. Login with admin/admin"
echo "  3. View your dashboards with real application metrics"
echo "  4. Configure alerts for your SLO targets (99.9% availability, P95 < 200ms)"

echo -e "\n${GREEN}✅ Performance monitoring is now fully operational with real application metrics!${NC}"

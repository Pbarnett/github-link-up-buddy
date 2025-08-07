# Multi-Environment Monitoring Strategy

## 🌍 Overview

Parker Flight's multi-environment monitoring strategy provides comprehensive staging/production separation with environment-aware dashboards, alerts, and data sources.

## 📊 Environment Configuration

### Environments

| Environment | Data Source | Alert Severity | SLO Target | Color Code |
|-------------|-------------|----------------|------------|------------|
| **Development** | prometheus-dev | info | 95.0% | #1f77b4 (Blue) |
| **Staging** | prometheus-staging | warning | 99.0% | #ff7f0e (Orange) |
| **Production** | prometheus | critical | 99.9% | #2ca02c (Green) |

### Alert Thresholds

#### Production Environment
- **Error Rate**: > 1% for 2 minutes → Critical
- **P95 Latency**: > 1.0s for 2 minutes → Critical  
- **SLO Violation**: < 99.9% for 5 minutes → Critical
- **Service Down**: 0 for 1 minute → Critical

#### Staging Environment
- **Error Rate**: > 5% for 5 minutes → Warning
- **P95 Latency**: > 2.0s for 5 minutes → Warning
- **SLO Violation**: < 99.0% for 10 minutes → Warning
- **Service Down**: 0 for 1 minute → Critical

#### Development Environment
- **Error Rate**: > 5% for 5 minutes → Info
- **P95 Latency**: > 2.0s for 5 minutes → Info
- **SLO Violation**: < 95.0% for 10 minutes → Info
- **Service Down**: 0 for 1 minute → Critical

## 🎯 Dashboards

### 1. Environment Comparison Dashboard
**UID**: `parker-flight-env-comparison`
**Features**:
- Multi-environment variable selection
- Cross-environment metrics comparison
- Request rate, error rate, and latency trends
- SLO compliance comparison
- Dependency health matrix

**Template Variables**:
- `$environment` - Multi-select environment filter
- `$range` - Time range for rate calculations (1m, 5m, 15m, 1h)

### 2. Environment Overview Dashboard
**UID**: `parker-flight-env-overview`
**Features**:
- Single environment focus
- Environment-specific KPIs
- Service health status
- Real-time metrics
- SLO gauge visualization

**Template Variables**:
- `$env` - Single environment selector

### 3. Deployment Impact Analysis Dashboard
**UID**: `parker-flight-deployment-comparison`
**Features**:
- Pre/post deployment comparison
- Deployment annotations
- SLO impact analysis
- Latency trend analysis
- Configurable deployment time windows

**Template Variables**:
- `$deployment_time` - Deployment time reference (15m, 30m, 1h, 2h, 4h)

## 🔗 Data Sources

### Environment-Specific Prometheus Instances

```yaml
# Production (Default)
- name: prometheus
  url: http://prometheus:9090
  isDefault: true

# Staging  
- name: prometheus-staging
  url: http://prometheus-staging:9090

# Development
- name: prometheus-dev
  url: http://prometheus-dev:9090
```

Each data source includes:
- Custom query parameters for environment filtering
- Jaeger trace ID destinations
- Environment-specific caching configurations
- Alert management enabled

## 🚨 Alert Rules

### File Location
`./monitoring/prometheus/rules/parker-flight-environment-alerts.yml`

### Alert Groups
- `parker_flight_development_alerts`
- `parker_flight_staging_alerts`
- `parker_flight_production_alerts`

### Alert Types
1. **High Error Rate**: Environment-specific thresholds
2. **High Latency**: P95 latency monitoring
3. **SLO Violation**: Availability targets
4. **Service Down**: Health check failures

### Alert Labels
```yaml
labels:
  severity: [info|warning|critical]
  service: parker-flight
  environment: [development|staging|production]
  type: [technical|slo|infrastructure]
```

### Alert Annotations
- **Summary**: Human-readable alert description
- **Description**: Detailed alert information with values
- **Runbook URL**: Environment-specific runbook links
- **Dashboard URL**: Direct link to relevant dashboard

## 🔄 Usage Guide

### Deploying Multi-Environment Setup

```bash
# Deploy all components
node scripts/setup-multi-environment.js all

# Deploy individual components
node scripts/setup-multi-environment.js comparison
node scripts/setup-multi-environment.js overview
node scripts/setup-multi-environment.js deployment
node scripts/setup-multi-environment.js alerts
node scripts/setup-multi-environment.js datasources
node scripts/setup-multi-environment.js deploy
```

### Grafana Access
- **Environment Comparison**: `http://localhost:3001/d/parker-flight-env-comparison`
- **Environment Overview**: `http://localhost:3001/d/parker-flight-env-overview`
- **Deployment Analysis**: `http://localhost:3001/d/parker-flight-deployment-comparison`

### Monitoring Workflow

1. **Daily Operations**: Use Environment Overview dashboard for each environment
2. **Cross-Environment Analysis**: Use Environment Comparison dashboard
3. **Deployment Validation**: Use Deployment Impact Analysis dashboard
4. **Incident Response**: Follow environment-specific runbooks

## 🎨 Visualization Features

### Color Coding
- **Development**: Blue (#1f77b4) - Development activities
- **Staging**: Orange (#ff7f0e) - Pre-production validation
- **Production**: Green (#2ca02c) - Live customer traffic

### Panel Types
- **Timeseries**: Trend analysis over time
- **Stat**: Current metric values with thresholds
- **Gauge**: SLO compliance visualization
- **Table**: Dependency health matrix

## 🔧 Configuration Files

### Dashboard Locations
```
./monitoring/grafana/dashboards/
├── environment-comparison.json
├── environment-overview.json
└── deployment-comparison.json
```

### Alert Rules
```
./monitoring/prometheus/rules/
└── parker-flight-environment-alerts.yml
```

### Data Source Provisioning
```
./monitoring/grafana/provisioning/datasources/
└── environment-datasources.yml
```

## 🚀 Next Steps

1. **Performance Correlation Analysis** (Phase 3 continuation)
2. **Advanced anomaly detection**
3. **Multi-region deployment support**
4. **Automated canary deployment monitoring**

## 📈 Benefits

- **Environment Isolation**: Clear separation of concerns
- **Progressive Deployment**: Staging validation before production
- **Targeted Alerting**: Environment-appropriate thresholds
- **Impact Analysis**: Clear deployment effect visibility
- **Operational Clarity**: Environment-specific operational procedures

This multi-environment strategy provides a robust foundation for managing Parker Flight across development, staging, and production environments with appropriate monitoring, alerting, and operational procedures for each environment's unique requirements.

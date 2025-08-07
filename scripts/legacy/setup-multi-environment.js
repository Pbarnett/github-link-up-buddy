#!/usr/bin/env node

/**
 * Multi-Environment Strategy for Parker Flight
 * 
 * This script sets up multi-environment monitoring with staging/production separation:
 * 1. Environment-specific dashboard configurations
 * 2. Cross-environment variable templates
 * 3. Environment isolation and comparison dashboards
 * 4. Environment-aware alerting rules
 */

import fs from 'fs/promises';
import axios from 'axios';
import { performance } from 'perf_hooks';

const GRAFANA_URL = 'http://localhost:3001';
const GRAFANA_ADMIN_USER = 'admin';
const GRAFANA_ADMIN_PASSWORD = 'admin';
const DASHBOARDS_DIR = './monitoring/grafana/dashboards';

class MultiEnvironmentManager {
  constructor() {
    this.auth = {
      username: GRAFANA_ADMIN_USER,
      password: GRAFANA_ADMIN_PASSWORD
    };
    
    this.environments = {
      development: {
        name: 'Development',
        datasource: 'prometheus-dev',
        color: '#1f77b4',
        alertSeverity: 'info',
        sloTarget: 95.0 // Lower SLO for dev
      },
      staging: {
        name: 'Staging',
        datasource: 'prometheus-staging',
        color: '#ff7f0e',
        alertSeverity: 'warning',
        sloTarget: 99.0 // Higher SLO for staging
      },
      production: {
        name: 'Production',
        datasource: 'prometheus',
        color: '#2ca02c',
        alertSeverity: 'critical',
        sloTarget: 99.9 // Highest SLO for production
      }
    };
  }

  async log(level, message) {
    const timestamp = new Date().toISOString();
    const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : level === 'success' ? '✅' : 'ℹ️';
    console.log(`${timestamp} ${emoji} ${message}`);
  }

  async createEnvironmentComparisonDashboard() {
    await this.log('info', '🔄 Creating Environment Comparison Dashboard...');

    const comparisonDashboard = {
      id: null,
      uid: "parker-flight-env-comparison",
      title: "🔄 Parker Flight - Environment Comparison",
      tags: ["parker-flight", "multi-environment", "comparison"],
      timezone: "browser",
      editable: true,
      graphTooltip: 0,
      schemaVersion: 27,
      version: 1,
      templating: {
        list: [
          {
            allValue: null,
            current: {
              selected: false,
              text: "All",
              value: "$__all"
            },
            datasource: "prometheus",
            definition: "label_values(parker_flight_requests_total, environment)",
            hide: 0,
            includeAll: true,
            label: "Environment",
            multi: true,
            name: "environment",
            options: [],
            query: {
              query: "label_values(parker_flight_requests_total, environment)",
              refId: "StandardVariableQuery"
            },
            refresh: 1,
            regex: "",
            skipUrlSync: false,
            sort: 0,
            type: "query"
          },
          {
            allValue: null,
            current: {
              selected: false,
              text: "5m",
              value: "5m"
            },
            hide: 0,
            includeAll: false,
            label: "Time Range",
            multi: false,
            name: "range",
            options: [
              { selected: false, text: "1m", value: "1m" },
              { selected: true, text: "5m", value: "5m" },
              { selected: false, text: "15m", value: "15m" },
              { selected: false, text: "1h", value: "1h" }
            ],
            query: "1m,5m,15m,1h",
            queryValue: "",
            skipUrlSync: false,
            type: "custom"
          }
        ]
      },
      panels: [
        {
          id: 1,
          title: "📊 Request Rate by Environment",
          type: "timeseries",
          targets: [
            {
              expr: "sum by (environment) (rate(parker_flight_requests_total{environment=~\"$environment\"}[$range]))",
              legendFormat: "{{environment}}",
              refId: "A"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "palette-classic" },
              custom: {
                axisLabel: "",
                axisPlacement: "auto",
                barAlignment: 0,
                drawStyle: "line",
                fillOpacity: 10,
                gradientMode: "none",
                hideFrom: {
                  legend: false,
                  tooltip: false,
                  vis: false
                },
                lineInterpolation: "linear",
                lineWidth: 2,
                pointSize: 5,
                scaleDistribution: { type: "linear" },
                showPoints: "never",
                spanNulls: false,
                stacking: { group: "A", mode: "none" },
                thresholdsStyle: { mode: "off" }
              },
              mappings: [],
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "green", value: null }
                ]
              },
              unit: "reqps"
            }
          },
          options: {
            legend: {
              calcs: [],
              displayMode: "list",
              placement: "bottom"
            },
            tooltip: { mode: "multi", sort: "none" }
          },
          gridPos: { h: 8, w: 12, x: 0, y: 0 }
        },
        {
          id: 2,
          title: "❌ Error Rate by Environment",
          type: "timeseries",
          targets: [
            {
              expr: "sum by (environment) (rate(parker_flight_requests_total{status=~\"5..\",environment=~\"$environment\"}[$range])) / sum by (environment) (rate(parker_flight_requests_total{environment=~\"$environment\"}[$range])) * 100",
              legendFormat: "{{environment}} Error Rate",
              refId: "A"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "palette-classic" },
              custom: {
                axisLabel: "",
                axisPlacement: "auto",
                barAlignment: 0,
                drawStyle: "line",
                fillOpacity: 10,
                gradientMode: "none",
                hideFrom: {
                  legend: false,
                  tooltip: false,
                  vis: false
                },
                lineInterpolation: "linear",
                lineWidth: 2,
                pointSize: 5,
                scaleDistribution: { type: "linear" },
                showPoints: "never",
                spanNulls: false,
                stacking: { group: "A", mode: "none" },
                thresholdsStyle: { mode: "line" }
              },
              mappings: [],
              max: 10,
              min: 0,
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "green", value: null },
                  { color: "red", value: 1 }
                ]
              },
              unit: "percent"
            }
          },
          options: {
            legend: {
              calcs: [],
              displayMode: "list",
              placement: "bottom"
            },
            tooltip: { mode: "multi", sort: "none" }
          },
          gridPos: { h: 8, w: 12, x: 12, y: 0 }
        },
        {
          id: 3,
          title: "⏱️ Response Time P95 by Environment",
          type: "timeseries",
          targets: [
            {
              expr: "histogram_quantile(0.95, sum by (environment, le) (rate(parker_flight_request_duration_seconds_bucket{environment=~\"$environment\"}[$range])))",
              legendFormat: "{{environment}} P95",
              refId: "A"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "palette-classic" },
              custom: {
                axisLabel: "",
                axisPlacement: "auto",
                barAlignment: 0,
                drawStyle: "line",
                fillOpacity: 10,
                gradientMode: "none",
                hideFrom: {
                  legend: false,
                  tooltip: false,
                  vis: false
                },
                lineInterpolation: "linear",
                lineWidth: 2,
                pointSize: 5,
                scaleDistribution: { type: "linear" },
                showPoints: "never",
                spanNulls: false,
                stacking: { group: "A", mode: "none" },
                thresholdsStyle: { mode: "line" }
              },
              mappings: [],
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "green", value: null },
                  { color: "red", value: 2 }
                ]
              },
              unit: "s"
            }
          },
          options: {
            legend: {
              calcs: [],
              displayMode: "list",
              placement: "bottom"
            },
            tooltip: { mode: "multi", sort: "none" }
          },
          gridPos: { h: 8, w: 12, x: 0, y: 8 }
        },
        {
          id: 4,
          title: "🎯 SLO Compliance by Environment",
          type: "stat",
          targets: [
            {
              expr: "(1 - sum by (environment) (rate(parker_flight_requests_total{status=~\"5..\",environment=~\"$environment\"}[$range])) / sum by (environment) (rate(parker_flight_requests_total{environment=~\"$environment\"}[$range]))) * 100",
              legendFormat: "{{environment}}",
              refId: "A"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "thresholds" },
              mappings: [],
              max: 100,
              min: 95,
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "red", value: null },
                  { color: "yellow", value: 99 },
                  { color: "green", value: 99.5 }
                ]
              },
              unit: "percent"
            }
          },
          options: {
            reduceOptions: {
              values: false,
              calcs: ["lastNotNull"],
              fields: ""
            },
            orientation: "auto",
            textMode: "auto",
            colorMode: "value",
            graphMode: "area",
            justifyMode: "auto"
          },
          gridPos: { h: 8, w: 12, x: 12, y: 8 }
        },
        {
          id: 5,
          title: "🔗 Dependency Health by Environment",
          type: "table",
          targets: [
            {
              expr: "parker_flight_service_dependency_health{environment=~\"$environment\"}",
              legendFormat: "",
              refId: "A",
              format: "table",
              instant: true
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "thresholds" },
              custom: {
                align: "auto",
                displayMode: "color-background"
              },
              mappings: [
                {
                  options: {
                    "0": { text: "❌ Down", color: "red" },
                    "1": { text: "✅ Healthy", color: "green" }
                  },
                  type: "value"
                }
              ],
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "red", value: null },
                  { color: "green", value: 1 }
                ]
              }
            }
          },
          options: {
            showHeader: true
          },
          transformations: [
            {
              id: "organize",
              options: {
                excludeByName: {
                  "Time": true,
                  "__name__": true,
                  "instance": true,
                  "job": true
                },
                indexByName: {},
                renameByName: {
                  "Value": "Status",
                  "environment": "Environment",
                  "target_service": "Service"
                }
              }
            }
          ],
          gridPos: { h: 8, w: 24, x: 0, y: 16 }
        }
      ],
      time: {
        from: "now-1h",
        to: "now"
      },
      timepicker: {},
      refresh: "30s",
      description: "Cross-environment comparison dashboard for monitoring Parker Flight across development, staging, and production environments."
    };

    const dashboardPath = `${DASHBOARDS_DIR}/environment-comparison.json`;
    await fs.writeFile(dashboardPath, JSON.stringify(comparisonDashboard, null, 2));

    await this.log('success', `✅ Environment comparison dashboard created: ${dashboardPath}`);
    return comparisonDashboard;
  }

  async createEnvironmentOverviewDashboard() {
    await this.log('info', '🌍 Creating Environment Overview Dashboard...');

    const overviewDashboard = {
      id: null,
      uid: "parker-flight-env-overview",
      title: "🌍 Parker Flight - Environment Overview",
      tags: ["parker-flight", "multi-environment", "overview"],
      timezone: "browser",
      editable: true,
      graphTooltip: 0,
      schemaVersion: 27,
      version: 1,
      templating: {
        list: [
          {
            allValue: null,
            current: {
              selected: false,
              text: "production",
              value: "production"
            },
            datasource: "prometheus",
            definition: "label_values(parker_flight_requests_total, environment)",
            hide: 0,
            includeAll: false,
            label: "Environment",
            multi: false,
            name: "env",
            options: [],
            query: {
              query: "label_values(parker_flight_requests_total, environment)",
              refId: "StandardVariableQuery"
            },
            refresh: 1,
            regex: "",
            skipUrlSync: false,
            sort: 0,
            type: "query"
          }
        ]
      },
      panels: [
        {
          id: 1,
          title: "📊 $env Environment Status",
          type: "stat",
          targets: [
            {
              expr: "up{job=\"parker-flight\", environment=\"$env\"}",
              legendFormat: "Service Status",
              refId: "A"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "thresholds" },
              mappings: [
                {
                  options: {
                    "0": { text: "❌ Down", color: "red" },
                    "1": { text: "✅ Running", color: "green" }
                  },
                  type: "value"
                }
              ],
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "red", value: null },
                  { color: "green", value: 1 }
                ]
              }
            }
          },
          options: {
            reduceOptions: {
              values: false,
              calcs: ["lastNotNull"],
              fields: ""
            },
            orientation: "auto",
            textMode: "auto",
            colorMode: "value",
            graphMode: "none",
            justifyMode: "auto"
          },
          gridPos: { h: 4, w: 6, x: 0, y: 0 }
        },
        {
          id: 2,
          title: "🚀 Request Rate",
          type: "stat",
          targets: [
            {
              expr: "sum(rate(parker_flight_requests_total{environment=\"$env\"}[5m]))",
              legendFormat: "Requests/sec",
              refId: "A"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "thresholds" },
              mappings: [],
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "red", value: null },
                  { color: "yellow", value: 1 },
                  { color: "green", value: 10 }
                ]
              },
              unit: "reqps"
            }
          },
          options: {
            reduceOptions: {
              values: false,
              calcs: ["lastNotNull"],
              fields: ""
            },
            orientation: "auto",
            textMode: "auto",
            colorMode: "value",
            graphMode: "area",
            justifyMode: "auto"
          },
          gridPos: { h: 4, w: 6, x: 6, y: 0 }
        },
        {
          id: 3,
          title: "❌ Error Rate",
          type: "stat",
          targets: [
            {
              expr: "sum(rate(parker_flight_requests_total{status=~\"5..\",environment=\"$env\"}[5m])) / sum(rate(parker_flight_requests_total{environment=\"$env\"}[5m])) * 100",
              legendFormat: "Error Rate",
              refId: "A"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "thresholds" },
              mappings: [],
              max: 10,
              min: 0,
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "green", value: null },
                  { color: "yellow", value: 1 },
                  { color: "red", value: 5 }
                ]
              },
              unit: "percent"
            }
          },
          options: {
            reduceOptions: {
              values: false,
              calcs: ["lastNotNull"],
              fields: ""
            },
            orientation: "auto",
            textMode: "auto",
            colorMode: "value",
            graphMode: "area",
            justifyMode: "auto"
          },
          gridPos: { h: 4, w: 6, x: 12, y: 0 }
        },
        {
          id: 4,
          title: "⏱️ P95 Latency",
          type: "stat",
          targets: [
            {
              expr: "histogram_quantile(0.95, sum(rate(parker_flight_request_duration_seconds_bucket{environment=\"$env\"}[5m])) by (le))",
              legendFormat: "P95 Latency",
              refId: "A"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "thresholds" },
              mappings: [],
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "green", value: null },
                  { color: "yellow", value: 1 },
                  { color: "red", value: 2 }
                ]
              },
              unit: "s"
            }
          },
          options: {
            reduceOptions: {
              values: false,
              calcs: ["lastNotNull"],
              fields: ""
            },
            orientation: "auto",
            textMode: "auto",
            colorMode: "value",
            graphMode: "area",
            justifyMode: "auto"
          },
          gridPos: { h: 4, w: 6, x: 18, y: 0 }
        },
        {
          id: 5,
          title: "📈 Request Rate Trend",
          type: "timeseries",
          targets: [
            {
              expr: "sum(rate(parker_flight_requests_total{environment=\"$env\"}[5m]))",
              legendFormat: "Request Rate",
              refId: "A"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "palette-classic" },
              custom: {
                axisLabel: "",
                axisPlacement: "auto",
                barAlignment: 0,
                drawStyle: "line",
                fillOpacity: 10,
                gradientMode: "none",
                hideFrom: {
                  legend: false,
                  tooltip: false,
                  vis: false
                },
                lineInterpolation: "linear",
                lineWidth: 2,
                pointSize: 5,
                scaleDistribution: { type: "linear" },
                showPoints: "never",
                spanNulls: false,
                stacking: { group: "A", mode: "none" },
                thresholdsStyle: { mode: "off" }
              },
              mappings: [],
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "green", value: null }
                ]
              },
              unit: "reqps"
            }
          },
          options: {
            legend: {
              calcs: [],
              displayMode: "list",
              placement: "bottom"
            },
            tooltip: { mode: "single", sort: "none" }
          },
          gridPos: { h: 8, w: 12, x: 0, y: 4 }
        },
        {
          id: 6,
          title: "🎯 SLO Compliance",
          type: "gauge",
          targets: [
            {
              expr: "(1 - sum(rate(parker_flight_requests_total{status=~\"5..\",environment=\"$env\"}[5m])) / sum(rate(parker_flight_requests_total{environment=\"$env\"}[5m]))) * 100",
              legendFormat: "Availability",
              refId: "A"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "thresholds" },
              mappings: [],
              max: 100,
              min: 95,
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "red", value: null },
                  { color: "yellow", value: 99 },
                  { color: "green", value: 99.5 }
                ]
              },
              unit: "percent"
            }
          },
          options: {
            reduceOptions: {
              values: false,
              calcs: ["lastNotNull"],
              fields: ""
            },
            orientation: "auto",
            showThresholdLabels: false,
            showThresholdMarkers: true
          },
          gridPos: { h: 8, w: 12, x: 12, y: 4 }
        }
      ],
      time: {
        from: "now-1h",
        to: "now"
      },
      timepicker: {},
      refresh: "30s",
      description: "Environment-specific overview dashboard for monitoring individual Parker Flight environments with environment variable selection."
    };

    const dashboardPath = `${DASHBOARDS_DIR}/environment-overview.json`;
    await fs.writeFile(dashboardPath, JSON.stringify(overviewDashboard, null, 2));

    await this.log('success', `✅ Environment overview dashboard created: ${dashboardPath}`);
    return overviewDashboard;
  }

  async createEnvironmentSpecificAlerts() {
    await this.log('info', '🚨 Creating Environment-Specific Alerts...');

    const environmentAlerts = {
      groups: []
    };

    // Generate alerts for each environment
    Object.entries(this.environments).forEach(([envKey, envConfig]) => {
      const alertGroup = {
        name: `parker_flight_${envKey}_alerts`,
        rules: [
          {
            alert: `ParkerFlight${envConfig.name}HighErrorRate`,
            expr: `sum(rate(parker_flight_requests_total{status=~"5..",environment="${envKey}"}[5m])) / sum(rate(parker_flight_requests_total{environment="${envKey}"}[5m])) > ${envKey === 'production' ? '0.01' : '0.05'}`,
            for: envKey === 'production' ? '2m' : '5m',
            labels: {
              severity: envConfig.alertSeverity,
              service: 'parker-flight',
              environment: envKey,
              type: 'technical'
            },
            annotations: {
              summary: `Parker Flight ${envConfig.name} error rate is high`,
              description: `${envConfig.name} environment error rate is {{ $value | humanizePercentage }}, exceeding threshold for ${envKey}.`,
              runbook_url: `https://github.com/parkerbarnett/github-link-up-buddy/docs/runbooks/${envKey}-high-error-rate.md`,
              dashboard_url: `http://localhost:3001/d/parker-flight-env-overview/parker-flight-environment-overview?var-env=${envKey}`
            }
          },
          {
            alert: `ParkerFlight${envConfig.name}HighLatency`,
            expr: `histogram_quantile(0.95, sum(rate(parker_flight_request_duration_seconds_bucket{environment="${envKey}"}[5m])) by (le)) > ${envKey === 'production' ? '1.0' : '2.0'}`,
            for: envKey === 'production' ? '2m' : '5m',
            labels: {
              severity: envConfig.alertSeverity,
              service: 'parker-flight',
              environment: envKey,
              type: 'technical'
            },
            annotations: {
              summary: `Parker Flight ${envConfig.name} latency is high`,
              description: `${envConfig.name} environment P95 latency is {{ $value }}s, exceeding ${envKey === 'production' ? '1.0' : '2.0'}s threshold.`,
              runbook_url: `https://github.com/parkerbarnett/github-link-up-buddy/docs/runbooks/${envKey}-high-latency.md`,
              dashboard_url: `http://localhost:3001/d/parker-flight-env-overview/parker-flight-environment-overview?var-env=${envKey}`
            }
          },
          {
            alert: `ParkerFlight${envConfig.name}SLOViolation`,
            expr: `(1 - sum(rate(parker_flight_requests_total{status=~"5..",environment="${envKey}"}[5m])) / sum(rate(parker_flight_requests_total{environment="${envKey}"}[5m]))) * 100 < ${envConfig.sloTarget}`,
            for: envKey === 'production' ? '5m' : '10m',
            labels: {
              severity: envKey === 'production' ? 'critical' : envConfig.alertSeverity,
              service: 'parker-flight',
              environment: envKey,
              type: 'slo'
            },
            annotations: {
              summary: `Parker Flight ${envConfig.name} SLO violation`,
              description: `${envConfig.name} environment availability is {{ $value | humanizePercentage }}, below ${envConfig.sloTarget}% SLO target.`,
              runbook_url: `https://github.com/parkerbarnett/github-link-up-buddy/docs/runbooks/${envKey}-slo-violation.md`,
              dashboard_url: `http://localhost:3001/d/parker-flight-env-comparison/parker-flight-environment-comparison`
            }
          },
          {
            alert: `ParkerFlight${envConfig.name}ServiceDown`,
            expr: `up{job="parker-flight", environment="${envKey}"} == 0`,
            for: '1m',
            labels: {
              severity: 'critical',
              service: 'parker-flight',
              environment: envKey,
              type: 'infrastructure'
            },
            annotations: {
              summary: `Parker Flight ${envConfig.name} service is down`,
              description: `${envConfig.name} environment service is not responding to health checks.`,
              runbook_url: `https://github.com/parkerbarnett/github-link-up-buddy/docs/runbooks/${envKey}-service-down.md`,
              dashboard_url: `http://localhost:3001/d/parker-flight-env-overview/parker-flight-environment-overview?var-env=${envKey}`
            }
          }
        ]
      };

      environmentAlerts.groups.push(alertGroup);
    });

    const alertsPath = './monitoring/prometheus/rules/parker-flight-environment-alerts.yml';
    
    // Convert to YAML format
    const yamlContent = this.convertToYaml(environmentAlerts);
    await fs.writeFile(alertsPath, yamlContent);

    await this.log('success', `✅ Environment-specific alerts created: ${alertsPath}`);
    return environmentAlerts;
  }

  async createEnvironmentDatasources() {
    await this.log('info', '🔗 Creating Environment-Specific Datasources...');

    const datasourcesConfig = {
      apiVersion: 1,
      datasources: []
    };

    // Generate datasource configs for each environment
    Object.entries(this.environments).forEach(([envKey, envConfig]) => {
      const datasource = {
        name: envConfig.datasource,
        type: 'prometheus',
        access: 'proxy',
        url: envKey === 'production' ? 'http://prometheus:9090' : `http://prometheus-${envKey}:9090`,
        isDefault: envKey === 'production',
        editable: true,
        jsonData: {
          httpMethod: 'POST',
          manageAlerts: true,
          prometheusType: 'Prometheus',
          prometheusVersion: '2.40.0',
          cacheLevel: 'High',
          incrementalQuerying: false,
          incrementalQueryOverlapWindow: '10m',
          queryTimeout: '60s',
          defaultRegion: 'us-east-1',
          customQueryParameters: `environment=${envKey}`,
          exemplarTraceIdDestinations: [
            {
              name: 'trace_id',
              datasourceUid: 'jaeger',
              url: `http://jaeger:16686/trace/\${__value.raw}`
            }
          ]
        },
        secureJsonData: {},
        version: 1
      };

      datasourcesConfig.datasources.push(datasource);
    });

    const datasourcesPath = './monitoring/grafana/provisioning/datasources/environment-datasources.yml';
    
    // Convert to YAML format
    const yamlContent = this.convertToYaml(datasourcesConfig);
    await fs.writeFile(datasourcesPath, yamlContent);

    await this.log('success', `✅ Environment datasources config created: ${datasourcesPath}`);
    return datasourcesConfig;
  }

  async createDeploymentComparisonDashboard() {
    await this.log('info', '🚀 Creating Deployment Comparison Dashboard...');

    const deploymentDashboard = {
      id: null,
      uid: "parker-flight-deployment-comparison",
      title: "🚀 Parker Flight - Deployment Impact Analysis",
      tags: ["parker-flight", "deployment", "comparison", "analysis"],
      timezone: "browser",
      editable: true,
      graphTooltip: 0,
      schemaVersion: 27,
      version: 1,
      templating: {
        list: [
          {
            allValue: null,
            current: {
              selected: false,
              text: "now-1h",
              value: "now-1h"
            },
            hide: 0,
            includeAll: false,
            label: "Deployment Time",
            multi: false,
            name: "deployment_time",
            options: [
              { selected: false, text: "now-15m", value: "now-15m" },
              { selected: false, text: "now-30m", value: "now-30m" },
              { selected: true, text: "now-1h", value: "now-1h" },
              { selected: false, text: "now-2h", value: "now-2h" },
              { selected: false, text: "now-4h", value: "now-4h" }
            ],
            query: "now-15m,now-30m,now-1h,now-2h,now-4h",
            queryValue: "",
            skipUrlSync: false,
            type: "custom"
          }
        ]
      },
      annotations: {
        list: [
          {
            builtIn: 1,
            datasource: "-- Grafana --",
            enable: true,
            hide: true,
            iconColor: "rgba(0, 211, 255, 1)",
            name: "Annotations & Alerts",
            type: "dashboard"
          },
          {
            datasource: "prometheus",
            enable: true,
            expr: "changes(parker_flight_build_info[5m]) > 0",
            hide: false,
            iconColor: "rgba(255, 96, 96, 1)",
            name: "Deployments",
            refId: "deployment-annotations",
            step: "60s",
            tagKeys: "version,environment",
            textFormat: "Deployment: {{version}} to {{environment}}",
            titleFormat: "Deployment"
          }
        ]
      },
      panels: [
        {
          id: 1,
          title: "📊 Pre/Post Deployment Metrics Comparison",
          type: "timeseries",
          targets: [
            {
              expr: "sum by (environment) (rate(parker_flight_requests_total[5m]))",
              legendFormat: "{{environment}} Request Rate",
              refId: "A"
            },
            {
              expr: "sum by (environment) (rate(parker_flight_requests_total{status=~\"5..\"}[5m])) / sum by (environment) (rate(parker_flight_requests_total[5m])) * 100",
              legendFormat: "{{environment}} Error Rate %",
              refId: "B"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "palette-classic" },
              custom: {
                axisLabel: "",
                axisPlacement: "auto",
                barAlignment: 0,
                drawStyle: "line",
                fillOpacity: 10,
                gradientMode: "none",
                hideFrom: {
                  legend: false,
                  tooltip: false,
                  vis: false
                },
                lineInterpolation: "linear",
                lineWidth: 2,
                pointSize: 5,
                scaleDistribution: { type: "linear" },
                showPoints: "never",
                spanNulls: false,
                stacking: { group: "A", mode: "none" },
                thresholdsStyle: { mode: "off" }
              },
              mappings: [],
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "green", value: null }
                ]
              }
            }
          },
          options: {
            legend: {
              calcs: [],
              displayMode: "list",
              placement: "bottom"
            },
            tooltip: { mode: "multi", sort: "none" }
          },
          gridPos: { h: 8, w: 24, x: 0, y: 0 }
        },
        {
          id: 2,
          title: "🎯 SLO Impact Analysis",
          type: "stat",
          targets: [
            {
              expr: "avg_over_time((1 - sum(rate(parker_flight_requests_total{status=~\"5..\",environment=\"production\"}[5m])) / sum(rate(parker_flight_requests_total{environment=\"production\"}[5m])))[$deployment_time:5m]) * 100",
              legendFormat: "Production SLO",
              refId: "A"
            },
            {
              expr: "avg_over_time((1 - sum(rate(parker_flight_requests_total{status=~\"5..\",environment=\"staging\"}[5m])) / sum(rate(parker_flight_requests_total{environment=\"staging\"}[5m])))[$deployment_time:5m]) * 100",
              legendFormat: "Staging SLO",
              refId: "B"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "thresholds" },
              mappings: [],
              max: 100,
              min: 95,
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "red", value: null },
                  { color: "yellow", value: 99 },
                  { color: "green", value: 99.5 }
                ]
              },
              unit: "percent"
            }
          },
          options: {
            reduceOptions: {
              values: false,
              calcs: ["lastNotNull"],
              fields: ""
            },
            orientation: "auto",
            textMode: "auto",
            colorMode: "value",
            graphMode: "area",
            justifyMode: "auto"
          },
          gridPos: { h: 8, w: 12, x: 0, y: 8 }
        },
        {
          id: 3,
          title: "⏱️ Latency Impact",
          type: "timeseries",
          targets: [
            {
              expr: "histogram_quantile(0.95, sum by (environment, le) (rate(parker_flight_request_duration_seconds_bucket[5m])))",
              legendFormat: "{{environment}} P95 Latency",
              refId: "A"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "palette-classic" },
              custom: {
                axisLabel: "",
                axisPlacement: "auto",
                barAlignment: 0,
                drawStyle: "line",
                fillOpacity: 10,
                gradientMode: "none",
                hideFrom: {
                  legend: false,
                  tooltip: false,
                  vis: false
                },
                lineInterpolation: "linear",
                lineWidth: 2,
                pointSize: 5,
                scaleDistribution: { type: "linear" },
                showPoints: "never",
                spanNulls: false,
                stacking: { group: "A", mode: "none" },
                thresholdsStyle: { mode: "line" }
              },
              mappings: [],
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "green", value: null },
                  { color: "red", value: 2 }
                ]
              },
              unit: "s"
            }
          },
          options: {
            legend: {
              calcs: [],
              displayMode: "list",
              placement: "bottom"
            },
            tooltip: { mode: "multi", sort: "none" }
          },
          gridPos: { h: 8, w: 12, x: 12, y: 8 }
        }
      ],
      time: {
        from: "$deployment_time",
        to: "now"
      },
      timepicker: {},
      refresh: "30s",
      description: "Deployment impact analysis dashboard for comparing metrics before and after deployments across environments."
    };

    const dashboardPath = `${DASHBOARDS_DIR}/deployment-comparison.json`;
    await fs.writeFile(dashboardPath, JSON.stringify(deploymentDashboard, null, 2));

    await this.log('success', `✅ Deployment comparison dashboard created: ${dashboardPath}`);
    return deploymentDashboard;
  }

  convertToYaml(obj, indent = 0) {
    const spaces = '  '.repeat(indent);
    let yaml = '';

    if (Array.isArray(obj)) {
      obj.forEach(item => {
        yaml += `${spaces}- ${this.convertToYaml(item, indent + 1).trim()}\n`;
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          yaml += `${spaces}${key}:\n`;
          yaml += this.convertToYaml(value, indent + 1);
        } else if (typeof value === 'object' && value !== null) {
          yaml += `${spaces}${key}:\n`;
          yaml += this.convertToYaml(value, indent + 1);
        } else {
          yaml += `${spaces}${key}: ${value}\n`;
        }
      });
    } else {
      return obj;
    }

    return yaml;
  }

  async deployDashboardsToGrafana() {
    await this.log('info', '🚀 Deploying multi-environment dashboards to Grafana...');

    const dashboards = [
      { path: `${DASHBOARDS_DIR}/environment-comparison.json`, name: 'Environment Comparison' },
      { path: `${DASHBOARDS_DIR}/environment-overview.json`, name: 'Environment Overview' },
      { path: `${DASHBOARDS_DIR}/deployment-comparison.json`, name: 'Deployment Comparison' }
    ];

    const deploymentResults = [];

    for (const dashboard of dashboards) {
      try {
        const dashboardJson = await fs.readFile(dashboard.path, 'utf8');
        const dashboardData = JSON.parse(dashboardJson);

        const importPayload = {
          dashboard: dashboardData,
          overwrite: true,
          message: `Deployed via Phase 3 multi-environment manager at ${new Date().toISOString()}`
        };

        const response = await axios.post(`${GRAFANA_URL}/api/dashboards/db`, importPayload, {
          auth: this.auth,
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {
          deploymentResults.push({
            name: dashboard.name,
            status: 'success',
            url: `${GRAFANA_URL}${response.data.url}`,
            uid: response.data.uid
          });
          await this.log('success', `✅ Deployed: ${dashboard.name}`);
        }

      } catch (error) {
        deploymentResults.push({
          name: dashboard.name,
          status: 'failed',
          error: error.message
        });
        await this.log('error', `Failed to deploy ${dashboard.name}: ${error.message}`);
      }
    }

    const successful = deploymentResults.filter(r => r.status === 'success').length;
    await this.log('success', `🎉 Deployed ${successful}/${dashboards.length} multi-environment dashboards`);

    return deploymentResults;
  }

  async runCommand(command) {
    const startTime = performance.now();
    
    try {
      switch (command) {
        case 'comparison':
          await this.createEnvironmentComparisonDashboard();
          break;
        case 'overview':
          await this.createEnvironmentOverviewDashboard();
          break;
        case 'deployment':
          await this.createDeploymentComparisonDashboard();
          break;
        case 'alerts':
          await this.createEnvironmentSpecificAlerts();
          break;
        case 'datasources':
          await this.createEnvironmentDatasources();
          break;
        case 'deploy':
          await this.deployDashboardsToGrafana();
          break;
        case 'all': {
          await this.log('info', '🚀 Setting up complete multi-environment strategy...');
          await this.createEnvironmentComparisonDashboard();
          await this.createEnvironmentOverviewDashboard();
          await this.createDeploymentComparisonDashboard();
          await this.createEnvironmentSpecificAlerts();
          await this.createEnvironmentDatasources();
          const results = await this.deployDashboardsToGrafana();
          
          console.log('\n🌍 MULTI-ENVIRONMENT SETUP SUMMARY');
          console.log('=' .repeat(50));
          console.log('✅ Environment Comparison Dashboard');
          console.log('✅ Environment Overview Dashboard');
          console.log('✅ Deployment Impact Analysis Dashboard');
          console.log('✅ Environment-Specific Alert Rules');
          console.log('✅ Multi-Environment Datasource Configuration');
          console.log(`🚀 Deployed: ${results.filter(r => r.status === 'success').length}/3 dashboards`);
          break;
        }
        default:
          await this.log('error', `Unknown command: ${command}`);
          this.showHelp();
          return;
      }

      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      await this.log('info', `🏁 Command '${command}' completed in ${duration}s`);

    } catch (error) {
      await this.log('error', `Command '${command}' failed: ${error.message}`);
      process.exit(1);
    }
  }

  showHelp() {
    console.log('\n🎯 Parker Flight Multi-Environment Manager');
    console.log('═'.repeat(50));
    console.log('Usage: node scripts/setup-multi-environment.js <command>');
    console.log('\nCommands:');
    console.log('  comparison   🔄 Create environment comparison dashboard');
    console.log('  overview     🌍 Create environment overview dashboard');
    console.log('  deployment   🚀 Create deployment impact analysis dashboard');
    console.log('  alerts       🚨 Create environment-specific alerts');
    console.log('  datasources  🔗 Create environment-specific datasources');
    console.log('  deploy       📤 Deploy dashboards to Grafana');
    console.log('  all          🎯 Set up complete multi-environment strategy');
    console.log('\nExamples:');
    console.log('  node scripts/setup-multi-environment.js comparison');
    console.log('  node scripts/setup-multi-environment.js all');
  }
}

// CLI interface
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const command = process.argv[2];
  
  if (!command) {
    const manager = new MultiEnvironmentManager();
    manager.showHelp();
    process.exit(1);
  }

  const manager = new MultiEnvironmentManager();
  manager.runCommand(command).catch(error => {
    console.error('❌ Multi-environment setup failed:', error);
    process.exit(1);
  });
}

export { MultiEnvironmentManager };

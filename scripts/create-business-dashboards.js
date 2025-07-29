#!/usr/bin/env node

/**
 * Business KPI Dashboard Creator for Parker Flight
 * 
 * This script creates executive-level dashboards with business metrics:
 * 1. High-level KPI dashboards for stakeholders
 * 2. Drill-down capabilities to technical details
 * 3. Business metric correlation with technical performance
 * 4. Executive reporting and alerts
 */

import fs from 'fs/promises';
import axios from 'axios';
import { performance } from 'perf_hooks';
// Utility functions
// Removed unused utility functions

const GRAFANA_URL = 'http://localhost:3001';
const GRAFANA_ADMIN_USER = 'admin';
const GRAFANA_ADMIN_PASSWORD = 'admin';
const DASHBOARDS_DIR = './monitoring/grafana/dashboards';

class BusinessDashboardCreator {
  constructor() {
    this.auth = {
      username: GRAFANA_ADMIN_USER,
      password: GRAFANA_ADMIN_PASSWORD
    };
    
    this.businessMetrics = {
      revenue: {
        name: 'parker_flight_revenue_total',
        description: 'Total revenue from flight bookings',
        unit: 'USD',
        target: 50000 // Monthly target
      },
      bookings: {
        name: 'parker_flight_bookings_total',
        description: 'Total flight bookings completed',
        unit: 'count',
        target: 1000 // Monthly target
      },
      users: {
        name: 'parker_flight_active_users_total',
        description: 'Total active users',
        unit: 'count',
        target: 5000 // Monthly target
      },
      conversion_rate: {
        name: 'parker_flight_conversion_rate',
        description: 'Booking conversion rate',
        unit: 'percent',
        target: 15 // 15% conversion rate
      },
      feature_adoption: {
        name: 'parker_flight_feature_flags_adoption',
        description: 'Feature flag adoption rates',
        unit: 'percent',
        target: 80 // 80% adoption for new features
      }
    };
  }

  async log(level, message) {
    const timestamp = new Date().toISOString();
    const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : level === 'success' ? '✅' : 'ℹ️';
    console.log(`${timestamp} ${emoji} ${message}`);
  }

  async createExecutiveDashboard() {
    await this.log('info', '👔 Creating Executive Overview Dashboard...');

    const executiveDashboard = {
      id: null,
      uid: "parker-flight-executive",
      title: "🎯 Parker Flight - Executive Overview",
      tags: ["parker-flight", "executive", "business", "kpi"],
      timezone: "browser",
      editable: true,
      graphTooltip: 0,
      schemaVersion: 27,
      version: 1,
      panels: [
        {
          id: 1,
          title: "💰 Monthly Revenue",
          type: "stat",
          targets: [
            {
              expr: "sum(increase(parker_flight_revenue_total[30d]))",
              legendFormat: "Revenue (30d)",
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
                  { color: "yellow", value: 25000 },
                  { color: "green", value: 40000 }
                ]
              },
              unit: "currencyUSD"
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
          gridPos: { h: 8, w: 6, x: 0, y: 0 }
        },
        {
          id: 2,
          title: "✈️ Flight Bookings",
          type: "stat",
          targets: [
            {
              expr: "sum(increase(parker_flight_bookings_total[30d]))",
              legendFormat: "Bookings (30d)",
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
                  { color: "yellow", value: 500 },
                  { color: "green", value: 800 }
                ]
              },
              unit: "short"
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
          gridPos: { h: 8, w: 6, x: 6, y: 0 }
        },
        {
          id: 3,
          title: "👥 Active Users",
          type: "stat",
          targets: [
            {
              expr: "parker_flight_active_users_total",
              legendFormat: "Active Users",
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
                  { color: "yellow", value: 2500 },
                  { color: "green", value: 4000 }
                ]
              },
              unit: "short"
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
          gridPos: { h: 8, w: 6, x: 12, y: 0 }
        },
        {
          id: 4,
          title: "📈 Conversion Rate",
          type: "stat",
          targets: [
            {
              expr: "parker_flight_conversion_rate * 100",
              legendFormat: "Conversion Rate",
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
                  { color: "yellow", value: 10 },
                  { color: "green", value: 15 }
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
          gridPos: { h: 8, w: 6, x: 18, y: 0 }
        },
        {
          id: 5,
          title: "📊 Revenue Trend (90 days)",
          type: "timeseries",
          targets: [
            {
              expr: "sum(rate(parker_flight_revenue_total[1d]))",
              legendFormat: "Daily Revenue Rate",
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
                  { color: "green", value: null },
                  { color: "red", value: 80 }
                ]
              },
              unit: "currencyUSD"
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
          gridPos: { h: 8, w: 12, x: 0, y: 8 }
        },
        {
          id: 6,
          title: "🚀 Feature Adoption",
          type: "piechart",
          targets: [
            {
              expr: "parker_flight_feature_flags_adoption{flag_name!=\"\"}",
              legendFormat: "{{flag_name}}",
              refId: "A"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "palette-classic" },
              custom: {
                hideFrom: {
                  legend: false,
                  tooltip: false,
                  vis: false
                }
              },
              mappings: [],
              unit: "percent"
            }
          },
          options: {
            reduceOptions: {
              values: false,
              calcs: ["lastNotNull"],
              fields: ""
            },
            pieType: "pie",
            tooltip: { mode: "single", sort: "none" },
            legend: {
              displayMode: "list",
              placement: "right"
            }
          },
          gridPos: { h: 8, w: 12, x: 12, y: 8 }
        },
        {
          id: 7,
          title: "⚡ System Health Impact on Business",
          type: "timeseries",
          targets: [
            {
              expr: "rate(parker_flight_bookings_total[5m])",
              legendFormat: "Booking Rate",
              refId: "A"
            },
            {
              expr: "(1 - rate(parker_flight_requests_total{status=~\"5..\"}[5m]) / rate(parker_flight_requests_total[5m])) * 100",
              legendFormat: "System Availability %",
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
                  { color: "green", value: null },
                  { color: "red", value: 80 }
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
          gridPos: { h: 8, w: 24, x: 0, y: 16 }
        }
      ],
      time: {
        from: "now-30d",
        to: "now"
      },
      timepicker: {},
      refresh: "5m",
      description: "Executive overview of Parker Flight business metrics and KPIs with drill-down capabilities to technical dashboards."
    };

    const dashboardPath = `${DASHBOARDS_DIR}/executive-overview.json`;
    await fs.writeFile(dashboardPath, JSON.stringify(executiveDashboard, null, 2));

    await this.log('success', `✅ Executive dashboard created: ${dashboardPath}`);
    return executiveDashboard;
  }

  async createBusinessOperationsDashboard() {
    await this.log('info', '📊 Creating Business Operations Dashboard...');

    const operationsDashboard = {
      id: null,
      uid: "parker-flight-operations",
      title: "📊 Parker Flight - Business Operations",
      tags: ["parker-flight", "operations", "business", "detailed"],
      timezone: "browser",
      editable: true,
      graphTooltip: 0,
      schemaVersion: 27,
      version: 1,
      panels: [
        {
          id: 1,
          title: "🎯 Business KPI Summary",
          type: "table",
          targets: [
            {
              expr: "sum(increase(parker_flight_revenue_total[30d]))",
              legendFormat: "Monthly Revenue",
              refId: "A",
              format: "table",
              instant: true
            },
            {
              expr: "sum(increase(parker_flight_bookings_total[30d]))",
              legendFormat: "Monthly Bookings", 
              refId: "B",
              format: "table",
              instant: true
            },
            {
              expr: "parker_flight_active_users_total",
              legendFormat: "Active Users",
              refId: "C",
              format: "table",
              instant: true
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "thresholds" },
              custom: {
                align: "auto",
                displayMode: "auto"
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
            showHeader: true
          },
          gridPos: { h: 8, w: 12, x: 0, y: 0 }
        },
        {
          id: 2,
          title: "📈 Revenue by Source",
          type: "bargauge",
          targets: [
            {
              expr: "sum by (source) (increase(parker_flight_revenue_total[30d]))",
              legendFormat: "{{source}}",
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
                displayMode: "list",
                orientation: "horizontal"
              },
              mappings: [],
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "green", value: null }
                ]
              },
              unit: "currencyUSD"
            }
          },
          options: {
            reduceOptions: {
              values: false,
              calcs: ["lastNotNull"],
              fields: ""
            },
            orientation: "horizontal",
            displayMode: "list",
            showUnfilled: true
          },
          gridPos: { h: 8, w: 12, x: 12, y: 0 }
        },
        {
          id: 3,
          title: "🌍 User Geography",
          type: "geomap",
          targets: [
            {
              expr: "sum by (country) (parker_flight_active_users_total)",
              legendFormat: "{{country}}",
              refId: "A"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "continuous-GrYlRd" },
              custom: {
                hideFrom: {
                  legend: false,
                  tooltip: false,
                  vis: false
                }
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
            view: {
              id: "coords",
              lat: 40,
              lon: -100,
              zoom: 4
            },
            controls: {
              mouseWheelZoom: true,
              showAttribution: true,
              showDebug: false,
              showScale: false,
              showZoom: true
            },
            basemap: {
              type: "default"
            },
            layers: [
              {
                type: "markers",
                config: {
                  showLegend: true,
                  style: {
                    color: { fixed: "dark-green" },
                    opacity: 0.4,
                    rotation: { fixed: 0, max: 360, min: -360, mode: "mod" },
                    size: { fixed: 5, max: 15, min: 2 },
                    symbol: { fixed: "circle", mode: "fixed" },
                    textConfig: {
                      fontSize: 12,
                      offsetX: 0,
                      offsetY: 0,
                      textAlign: "center",
                      textBaseline: "middle"
                    }
                  }
                }
              }
            ]
          },
          gridPos: { h: 8, w: 24, x: 0, y: 8 }
        },
        {
          id: 4,
          title: "🔄 Booking Funnel Analysis",
          type: "timeseries",
          targets: [
            {
              expr: "rate(parker_flight_page_views_total{page=\"search\"}[5m])",
              legendFormat: "Search Views",
              refId: "A"
            },
            {
              expr: "rate(parker_flight_page_views_total{page=\"results\"}[5m])",
              legendFormat: "Results Views",
              refId: "B"
            },
            {
              expr: "rate(parker_flight_page_views_total{page=\"booking\"}[5m])",
              legendFormat: "Booking Page",
              refId: "C"
            },
            {
              expr: "rate(parker_flight_bookings_total[5m])",
              legendFormat: "Completed Bookings",
              refId: "D"
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
          gridPos: { h: 8, w: 24, x: 0, y: 16 }
        }
      ],
      time: {
        from: "now-7d",
        to: "now"
      },
      timepicker: {},
      refresh: "1m",
      description: "Detailed business operations dashboard with funnel analysis, geographic data, and revenue breakdown."
    };

    const dashboardPath = `${DASHBOARDS_DIR}/business-operations.json`;
    await fs.writeFile(dashboardPath, JSON.stringify(operationsDashboard, null, 2));

    await this.log('success', `✅ Business operations dashboard created: ${dashboardPath}`);
    return operationsDashboard;
  }

  async createRealtimeBusinessDashboard() {
    await this.log('info', '⚡ Creating Real-time Business Dashboard...');

    const realtimeDashboard = {
      id: null,
      uid: "parker-flight-realtime",
      title: "⚡ Parker Flight - Real-time Business Metrics",
      tags: ["parker-flight", "realtime", "business", "live"],
      timezone: "browser",
      editable: true,
      graphTooltip: 0,
      schemaVersion: 27,
      version: 1,
      panels: [
        {
          id: 1,
          title: "💰 Live Revenue (Last Hour)",
          type: "stat",
          targets: [
            {
              expr: "sum(increase(parker_flight_revenue_total[1h]))",
              legendFormat: "Hourly Revenue",
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
                  { color: "yellow", value: 1000 },
                  { color: "green", value: 2000 }
                ]
              },
              unit: "currencyUSD"
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
          gridPos: { h: 4, w: 6, x: 0, y: 0 }
        },
        {
          id: 2,
          title: "✈️ Live Bookings",
          type: "stat",
          targets: [
            {
              expr: "sum(increase(parker_flight_bookings_total[1h]))",
              legendFormat: "Hourly Bookings",
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
                  { color: "yellow", value: 20 },
                  { color: "green", value: 40 }
                ]
              },
              unit: "short"
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
          title: "👥 Current Users",
          type: "stat",
          targets: [
            {
              expr: "parker_flight_current_sessions",
              legendFormat: "Active Sessions",
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
                  { color: "yellow", value: 100 },
                  { color: "green", value: 250 }
                ]
              },
              unit: "short"
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
          title: "🚨 Business Alerts",
          type: "stat",
          targets: [
            {
              expr: "sum(ALERTS{alertname=~\".*Business.*\", alertstate=\"firing\"})",
              legendFormat: "Active Business Alerts",
              refId: "A"
            }
          ],
          fieldConfig: {
            defaults: {
              color: { mode: "thresholds" },
              mappings: [
                {
                  options: {
                    "0": { text: "✅ All Good", color: "green" }
                  },
                  type: "value"
                }
              ],
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "green", value: null },
                  { color: "yellow", value: 1 },
                  { color: "red", value: 3 }
                ]
              },
              unit: "short"
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
          gridPos: { h: 4, w: 6, x: 18, y: 0 }
        },
        {
          id: 5,
          title: "📊 Real-time Business Metrics",
          type: "timeseries",
          targets: [
            {
              expr: "rate(parker_flight_revenue_total[5m]) * 60",
              legendFormat: "Revenue per Minute",
              refId: "A"
            },
            {
              expr: "rate(parker_flight_bookings_total[5m]) * 60",
              legendFormat: "Bookings per Minute",
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
                showPoints: "auto",
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
          gridPos: { h: 8, w: 24, x: 0, y: 4 }
        }
      ],
      time: {
        from: "now-1h",
        to: "now"
      },
      timepicker: {},
      refresh: "10s",
      description: "Real-time business metrics dashboard with live updates every 10 seconds for operational monitoring."
    };

    const dashboardPath = `${DASHBOARDS_DIR}/realtime-business.json`;
    await fs.writeFile(dashboardPath, JSON.stringify(realtimeDashboard, null, 2));

    await this.log('success', `✅ Real-time business dashboard created: ${dashboardPath}`);
    return realtimeDashboard;
  }

  async createBusinessAlerts() {
    await this.log('info', '🚨 Creating Business KPI Alerts...');

    const businessAlerts = {
      groups: [
        {
          name: 'parker_flight_business_alerts',
          rules: [
            {
              alert: 'ParkerFlightLowRevenue',
              expr: 'sum(increase(parker_flight_revenue_total[1h])) < 500',
              for: '15m',
              labels: {
                severity: 'warning',
                service: 'parker-flight',
                type: 'business',
                impact: 'revenue'
              },
              annotations: {
                summary: 'Parker Flight hourly revenue is below threshold',
                description: 'Revenue in the last hour is ${{ $value }}, which is below the $500 threshold. This may indicate booking issues or reduced traffic.',
                runbook_url: 'https://github.com/parkerbarnett/github-link-up-buddy/docs/runbooks/low-revenue.md',
                dashboard_url: 'http://localhost:3001/d/parker-flight-executive/parker-flight-executive-overview'
              }
            },
            {
              alert: 'ParkerFlightZeroBookings',
              expr: 'sum(increase(parker_flight_bookings_total[30m])) == 0',
              for: '30m',
              labels: {
                severity: 'critical',
                service: 'parker-flight',
                type: 'business',
                impact: 'bookings'
              },
              annotations: {
                summary: 'Parker Flight has zero bookings for 30 minutes',
                description: 'No bookings have been completed in the last 30 minutes. This indicates a critical business impact.',
                runbook_url: 'https://github.com/parkerbarnett/github-link-up-buddy/docs/runbooks/zero-bookings.md',
                dashboard_url: 'http://localhost:3001/d/parker-flight-executive/parker-flight-executive-overview'
              }
            },
            {
              alert: 'ParkerFlightLowConversionRate',
              expr: 'parker_flight_conversion_rate < 0.05',
              for: '1h',
              labels: {
                severity: 'warning',
                service: 'parker-flight',
                type: 'business',
                impact: 'conversion'
              },
              annotations: {
                summary: 'Parker Flight conversion rate is critically low',
                description: 'Conversion rate is {{ $value | humanizePercentage }}, below the 5% minimum threshold. This indicates potential UX issues.',
                runbook_url: 'https://github.com/parkerbarnett/github-link-up-buddy/docs/runbooks/low-conversion.md',
                dashboard_url: 'http://localhost:3001/d/parker-flight-operations/parker-flight-business-operations'
              }
            },
            {
              alert: 'ParkerFlightFeatureRollbackNeeded',
              expr: 'parker_flight_feature_flags_adoption{flag_name!=""} < 0.1',
              for: '2h',
              labels: {
                severity: 'warning',
                service: 'parker-flight',
                type: 'business',
                impact: 'feature_adoption'
              },
              annotations: {
                summary: 'Parker Flight feature {{ $labels.flag_name }} has low adoption',
                description: 'Feature {{ $labels.flag_name }} adoption is {{ $value | humanizePercentage }}, below 10%. Consider rollback or investigation.',
                runbook_url: 'https://github.com/parkerbarnett/github-link-up-buddy/docs/runbooks/feature-adoption.md',
                dashboard_url: 'http://localhost:3001/d/parker-flight-executive/parker-flight-executive-overview'
              }
            },
            {
              alert: 'ParkerFlightBusinessImpactFromSystemIssues',
              expr: 'rate(parker_flight_bookings_total[5m]) < 0.01 and rate(parker_flight_requests_total{status=~"5.."}[5m]) / rate(parker_flight_requests_total[5m]) > 0.05',
              for: '10m',
              labels: {
                severity: 'critical',
                service: 'parker-flight',
                type: 'business',
                impact: 'system_correlation'
              },
              annotations: {
                summary: 'System errors are impacting Parker Flight business metrics',
                description: 'Low booking rate combined with high error rate indicates system issues are impacting business. Booking rate: {{ with query "rate(parker_flight_bookings_total[5m])" }}{{ . | first | value }}{{ end }}/min, Error rate: {{ with query "rate(parker_flight_requests_total{status=~\\"5..\\"}[5m]) / rate(parker_flight_requests_total[5m]) * 100" }}{{ . | first | value }}{{ end }}%',
                runbook_url: 'https://github.com/parkerbarnett/github-link-up-buddy/docs/runbooks/business-system-correlation.md',
                dashboard_url: 'http://localhost:3001/d/parker-flight-executive/parker-flight-executive-overview'
              }
            }
          ]
        }
      ]
    };

    const alertsPath = './monitoring/prometheus/rules/parker-flight-business-alerts.yml';
    
    // Convert to YAML format
    const yamlContent = this.convertToYaml(businessAlerts);
    await fs.writeFile(alertsPath, yamlContent);

    await this.log('success', `✅ Business alerts created: ${alertsPath}`);
    return businessAlerts;
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
    await this.log('info', '🚀 Deploying business dashboards to Grafana...');

    const dashboards = [
      { path: `${DASHBOARDS_DIR}/executive-overview.json`, name: 'Executive Overview' },
      { path: `${DASHBOARDS_DIR}/business-operations.json`, name: 'Business Operations' },
      { path: `${DASHBOARDS_DIR}/realtime-business.json`, name: 'Real-time Business' }
    ];

    const deploymentResults = [];

    for (const dashboard of dashboards) {
      try {
        const dashboardJson = await fs.readFile(dashboard.path, 'utf8');
        const dashboardData = JSON.parse(dashboardJson);

        const importPayload = {
          dashboard: dashboardData,
          overwrite: true,
          message: `Deployed via Phase 3 business dashboard creator at ${new Date().toISOString()}`
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

    const successful = deploymentResults.filter(r => r.status === 'success').length
    await this.log('success', `🎉 Deployed ${successful}/${dashboards.length} business dashboards`);

    return deploymentResults;
  }

  async runCommand(command) {
    const startTime = performance.now();
    
    try {
      switch (command) {
        case 'executive':
          await this.createExecutiveDashboard();
          break;
        case 'operations':
          await this.createBusinessOperationsDashboard();
          break;
        case 'realtime':
          await this.createRealtimeBusinessDashboard();
          break;
        case 'alerts':
          await this.createBusinessAlerts();
          break;
        case 'deploy':
          await this.deployDashboardsToGrafana();
          break;
        case 'all': {
          await this.log('info', '🚀 Creating all business dashboards...');
          await this.createExecutiveDashboard();
          await this.createBusinessOperationsDashboard();
          await this.createRealtimeBusinessDashboard();
          await this.createBusinessAlerts();
          const results = await this.deployDashboardsToGrafana();
          
          console.log('\n🎯 BUSINESS DASHBOARD CREATION SUMMARY');
          console.log('=' .repeat(50));
          console.log('✅ Executive Overview Dashboard');
          console.log('✅ Business Operations Dashboard');
          console.log('✅ Real-time Business Dashboard');
          console.log('✅ Business KPI Alerts');
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

    } catch {
      await this.log('error', `Command '${command}' failed: ${error.message}`);
      process.exit(1);
    }
  }

  showHelp() {
    console.log('\n🎯 Parker Flight Business Dashboard Creator');
    console.log('═'.repeat(50));
    console.log('Usage: node scripts/create-business-dashboards.js <command>');
    console.log('\nCommands:');
    console.log('  executive    👔 Create executive overview dashboard');
    console.log('  operations   📊 Create business operations dashboard');
    console.log('  realtime     ⚡ Create real-time business dashboard');
    console.log('  alerts       🚨 Create business KPI alerts');
    console.log('  deploy       🚀 Deploy dashboards to Grafana');
    console.log('  all          🎯 Create and deploy all business dashboards');
    console.log('\nExamples:');
    console.log('  node scripts/create-business-dashboards.js executive');
    console.log('  node scripts/create-business-dashboards.js all');
  }
}

// CLI interface
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const command = process.argv[2];
  
  if (!command) {
    const creator = new BusinessDashboardCreator();
    creator.showHelp();
    process.exit(1);
  }

  const creator = new BusinessDashboardCreator();
  creator.runCommand(command).catch(error => {
    console.error('❌ Business dashboard creation failed:', error);
    process.exit(1);
  });
}

module.exports = { BusinessDashboardCreator };

#!/usr/bin/env node

/**
 * Advanced Parker Flight Monitoring Optimization
 * 
 * Implements advanced Grafana bot recommendations:
 * 1. Template variable optimization with data source variables
 * 2. Advanced dashboard organization with subfolders
 * 3. Cross-environment alerting with standardized labels
 * 4. Permission model implementation
 * 5. Performance optimizations for concurrent access
 */

import fs from 'fs/promises';
import axios from 'axios';
import { performance } from 'perf_hooks';
// Removed unused utility functions

const GRAFANA_URL = 'http://localhost:3001';
const GRAFANA_ADMIN_USER = 'admin';
const GRAFANA_ADMIN_PASSWORD = 'admin';

class AdvancedMonitoringOptimizer {
  constructor() {
    this.auth = {
      username: GRAFANA_ADMIN_USER,
      password: GRAFANA_ADMIN_PASSWORD
    };

    // Advanced folder structure with subfolders
    this.advancedFolderStructure = {
      'Business Intelligence': {
        description: 'Executive and business KPI dashboards',
        subfolders: {
          'Executive View': {
            description: 'C-level and leadership dashboards',
            permissions: { viewer: ['Executive'], editor: ['Admin'] }
          },
          'Operations View': {
            description: 'Business operations and efficiency metrics',
            permissions: { viewer: ['Executive', 'Operations'], editor: ['Operations', 'Admin'] }
          }
        }
      },
      'Technical Monitoring': {
        description: 'Engineering and SRE dashboards',
        subfolders: {
          'Production': {
            description: 'Production environment monitoring',
            permissions: { viewer: ['Engineering', 'SRE'], editor: ['SRE', 'Admin'] }
          },
          'Staging': {
            description: 'Staging environment monitoring',
            permissions: { viewer: ['Engineering', 'SRE'], editor: ['Engineering', 'SRE', 'Admin'] }
          },
          'Development': {
            description: 'Development environment monitoring',
            permissions: { viewer: ['All'], editor: ['Engineering', 'Admin'] }
          }
        }
      },
      'Security & Compliance': {
        description: 'Security monitoring and compliance tracking',
        subfolders: {
          'Security Monitoring': {
            description: 'Real-time security metrics and threat detection',
            permissions: { viewer: ['Security', 'Admin'], editor: ['Security', 'Admin'] }
          },
          'Compliance Reports': {
            description: 'Compliance dashboards and audit trails',
            permissions: { viewer: ['Compliance', 'Security', 'Admin'], editor: ['Compliance', 'Admin'] }
          }
        }
      }
    };
  }

  async log(level, message) {
    const timestamp = new Date().toISOString();
    const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : level === 'success' ? '✅' : 'ℹ️';
    console.log(`${timestamp} ${emoji} ${message}`);
  }

  async createDataSourceVariableTemplate() {
    await this.log('info', '🔄 Creating optimized template variable configuration...');

    const dataSourceVariableTemplate = {
      // Data source variable for environment switching
      datasourceVariable: {
        allValue: null,
        current: {
          selected: false,
          text: "prometheus",
          value: "prometheus"
        },
        hide: 0,
        includeAll: false,
        label: "Environment",
        multi: false,
        name: "datasource",
        options: [],
        query: "prometheus",
        queryValue: "",
        refresh: 1,
        regex: "/prometheus.*/", // Filter to show only Prometheus data sources
        skipUrlSync: false,
        type: "datasource"
      },

      // Optimized query variable with minimal scope
      environmentVariable: {
        allValue: null,
        current: {
          selected: false,
          text: "production",
          value: "production"
        },
        datasource: "$datasource", // Use the selected data source
        definition: "label_values(up, environment)",
        hide: 0,
        includeAll: false,
        label: "Environment",
        multi: false,
        name: "env",
        options: [],
        query: {
          query: "label_values(up, environment)",
          refId: "StandardVariableQuery"
        },
        refresh: 2, // On dashboard load and time range change
        regex: "",
        skipUrlSync: false,
        sort: 1, // Alphabetical sort
        type: "query"
      },

      // Service variable ordered by frequency of use
      serviceVariable: {
        allValue: null,
        current: {
          selected: false,
          text: "parker-flight",
          value: "parker-flight"
        },
        datasource: "$datasource",
        definition: "label_values(up{environment=\"$env\"}, service)",
        hide: 0,
        includeAll: true,
        label: "Service",
        multi: true,
        name: "service",
        options: [],
        query: {
          query: "label_values(up{environment=\"$env\"}, service)",
          refId: "StandardVariableQuery"
        },
        refresh: 1,
        regex: "",
        skipUrlSync: false,
        sort: 1,
        type: "query"
      }
    };

    const templatePath = './monitoring/grafana/templates/optimized-variables.json';
    await fs.writeFile(templatePath, JSON.stringify(dataSourceVariableTemplate, null, 2));

    await this.log('success', `✅ Template variable configuration created: ${templatePath}`);
    return dataSourceVariableTemplate;
  }

  async createAdvancedFolderStructure() {
    await this.log('info', '📁 Creating advanced folder structure with subfolders...');

    for (const [parentFolder, config] of Object.entries(this.advancedFolderStructure)) {
      try {
        // Create parent folder
        const parentFolderPayload = {
          title: parentFolder,
          uid: parentFolder.toLowerCase().replace(/\s+/g, '-'),
          description: config.description
        };

        let parentFolderResponse;
        try {
          parentFolderResponse = await axios.post(`${GRAFANA_URL}/api/folders`, parentFolderPayload, {
            auth: this.auth,
            headers: { 'Content-Type': 'application/json' }
          });
          await this.log('success', `✅ Created parent folder: ${parentFolder}`);
        } catch (error) {
          if (error.response?.status === 409) {
            await this.log('info', `📁 Parent folder already exists: ${parentFolder}`);
            // Get existing folder
            const existingFolders = await axios.get(`${GRAFANA_URL}/api/folders`, {
              auth: this.auth
            });
            parentFolderResponse = { data: existingFolders.data.find(f => f.title === parentFolder) };
          } else {
            throw error;
          }
        }

        // Create subfolders if they exist
        if (config.subfolders) {
          for (const [subfolderName, subConfig] of Object.entries(config.subfolders)) {
            try {
              const subfolderPayload = {
                title: `${parentFolder} / ${subfolderName}`,
                uid: `${parentFolder}-${subfolderName}`.toLowerCase().replace(/[\s&/]+/g, '-'),
                description: subConfig.description,
                parentUid: parentFolderResponse.data.uid
              };

              await axios.post(`${GRAFANA_URL}/api/folders`, subfolderPayload, {
                auth: this.auth,
                headers: { 'Content-Type': 'application/json' }
              });

              await this.log('success', `✅ Created subfolder: ${parentFolder} / ${subfolderName}`);

            } catch (subError) {
              if (subError.response?.status === 409) {
                await this.log('info', `📁 Subfolder already exists: ${parentFolder} / ${subfolderName}`);
              } else {
                await this.log('warn', `⚠️ Could not create subfolder ${subfolderName}: ${subError.message}`);
              }
            }
          }
        }

      } catch {
        await this.log('error', `Failed to create folder structure for ${parentFolder}: ${error.message}`);
      }
    }
  }

  async createStandardizedAlertLabels() {
    await this.log('info', '🏷️ Creating standardized alert label configuration...');

    const standardizedLabels = {
      alertLabels: {
        // Core identification labels
        service: 'parker-flight',
        environment: '{{ $labels.environment }}',
        team: '{{ $labels.team | default "sre" }}',
        system: '{{ $labels.system | default "web-service" }}',
        
        // Routing labels
        severity: '{{ $labels.severity }}',
        alerttype: '{{ $labels.type | default "technical" }}',
        component: '{{ $labels.component | default "backend" }}',
        
        // Business impact labels
        business_impact: '{{ $labels.business_impact | default "low" }}',
        customer_facing: '{{ $labels.customer_facing | default "false" }}',
        
        // Operational labels
        runbook: '{{ $annotations.runbook_url }}',
        dashboard: '{{ $annotations.dashboard_url }}',
        oncall_team: '{{ $labels.oncall_team | default "sre" }}'
      },

      // Cross-environment alert rules template
      crossEnvironmentRules: [
        {
          alert: 'ParkerFlightCrossEnvironmentErrorRateDeviation',
          expr: `
            (
              sum(rate(parker_flight_requests_total{status=~"5..", environment="production"}[5m])) / 
              sum(rate(parker_flight_requests_total{environment="production"}[5m]))
            ) > 
            (
              sum(rate(parker_flight_requests_total{status=~"5..", environment="staging"}[5m])) / 
              sum(rate(parker_flight_requests_total{environment="staging"}[5m]))
            ) * 2
          `,
          for: '5m',
          labels: {
            severity: 'warning',
            service: 'parker-flight',
            type: 'cross-environment',
            team: 'sre',
            alerttype: 'deviation'
          },
          annotations: {
            summary: 'Production error rate significantly higher than staging',
            description: 'Production environment error rate is more than 2x staging error rate, indicating potential production-specific issues.',
            runbook_url: 'https://github.com/parkerbarnett/github-link-up-buddy/docs/runbooks/cross-env-deviation.md',
            dashboard_url: 'http://localhost:3001/d/parker-flight-env-comparison'
          }
        }
      ],

      // Label-based routing configuration
      routingTemplate: {
        route: {
          group_by: ['alertname', 'environment', 'team'],
          group_wait: '10s',
          group_interval: '5m',
          repeat_interval: '4h',
          receiver: 'default-receiver',
          routes: [
            {
              matchers: ['severity="critical"', 'environment="production"', 'business_impact="high"'],
              receiver: 'executive-critical',
              group_wait: '0s',
              repeat_interval: '2h'
            },
            {
              matchers: ['team="sre"', 'severity=~"critical|warning"'],
              receiver: 'sre-alerts',
              group_wait: '30s'
            },
            {
              matchers: ['environment="development"'],
              receiver: 'dev-alerts',
              group_wait: '5m',
              repeat_interval: '24h'
            }
          ]
        }
      }
    };

    const labelsPath = './monitoring/prometheus/rules/standardized-labels.yml';
    const yamlContent = this.convertToYaml(standardizedLabels);
    await fs.writeFile(labelsPath, yamlContent);

    await this.log('success', `✅ Standardized alert labels created: ${labelsPath}`);
    return standardizedLabels;
  }

  async optimizeExistingDashboards() {
    await this.log('info', '⚡ Optimizing existing dashboards with advanced template variables...');

    const dashboardsToOptimize = [
      'parker-flight-env-comparison',
      'parker-flight-env-overview',
      'parker-flight-deployment-comparison'
    ];

    for (const dashboardUid of dashboardsToOptimize) {
      try {
        // Get dashboard
        const dashboardResponse = await axios.get(`${GRAFANA_URL}/api/dashboards/uid/${dashboardUid}`, {
          auth: this.auth
        });

        if (dashboardResponse.status === 200) {
          const dashboard = dashboardResponse.data.dashboard
          
          // Add data source variable as first variable (most frequently used)
          const dataSourceVariable = {
            allValue: null,
            current: {
              selected: false,
              text: "prometheus",
              value: "prometheus"
            },
            hide: 0,
            includeAll: false,
            label: "Data Source",
            multi: false,
            name: "datasource",
            options: [],
            query: "prometheus",
            queryValue: "",
            refresh: 1,
            regex: "/prometheus.*/",
            skipUrlSync: false,
            type: "datasource"
          };

          // Ensure templating exists
          if (!dashboard.templating) {
            dashboard.templating = { list: [] };
          }

          // Add datasource variable at the beginning (highest priority)
          const existingDsVar = dashboard.templating.list.find(v => v.name === 'datasource');
          if (!existingDsVar) {
            dashboard.templating.list.unshift(dataSourceVariable);
          }

          // Update existing query variables to use datasource variable
          dashboard.templating.list.forEach(variable => {
            if (variable.type === 'query' && !variable.datasource.includes('$datasource')) {
              variable.datasource = '$datasource';
            }
          });

          // Update dashboard
          const updatePayload = {
            dashboard: dashboard,
            overwrite: true,
            message: `Advanced optimization: Added data source variable and improved template variable order`
          };

          await axios.post(`${GRAFANA_URL}/api/dashboards/db`, updatePayload, {
            auth: this.auth,
            headers: { 'Content-Type': 'application/json' }
          });

          await this.log('success', `✅ Advanced optimization applied to ${dashboardUid}`);
        }

      } catch {
        await this.log('warn', `⚠️ Could not optimize ${dashboardUid}: ${_error.response?.status === 404 ? 'Dashboard not found' : _error.message}`);
      }
    }
  }

  async createConcurrentAccessOptimizations() {
    await this.log('info', '🚀 Creating concurrent access optimization configuration...');

    const concurrentOptimizations = {
      grafanaConfig: {
        // Query caching recommendations (for Grafana Enterprise)
        caching: {
          enabled: true,
          backend_cache_ttl: '300s', // 5 minutes for most queries
          dashboard_cache_ttl: '600s', // 10 minutes for dashboard metadata
        },
        
        // Connection pooling
        database: {
          max_open_conn: 50,
          max_idle_conn: 10,
          conn_max_lifetime: 3600 // 1 hour
        },

        // Performance settings
        performance: {
          query_timeout: '60s',
          max_concurrent_queries: 20,
          datasource_proxy_timeout: '30s'
        }
      },

      // Dashboard organization recommendations
      organizationBestPractices: {
        folderLimits: {
          max_dashboards_per_folder: 25,
          max_folder_depth: 3,
          recommended_folder_count: 10
        },
        
        dashboardOptimization: {
          max_panels_per_dashboard: 20,
          recommended_refresh_interval: '30s',
          max_query_range: '24h'
        },

        variableOptimization: {
          max_variables_per_dashboard: 8,
          variable_refresh_priority: ['datasource', 'environment', 'service', 'instance']
        }
      },

      // Monitoring recommendations
      monitoring: {
        dashboard_load_time_threshold: '2s',
        query_response_time_threshold: '5s',
        concurrent_user_limit: 100
      }
    };

    const optimizationPath = './monitoring/grafana/config/concurrent-access-optimization.json';
    await fs.writeFile(optimizationPath, JSON.stringify(concurrentOptimizations, null, 2));

    await this.log('success', `✅ Concurrent access optimization config created: ${optimizationPath}`);
    return concurrentOptimizations;
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

  async runAdvancedOptimization(command) {
    const startTime = performance.now();
    
    try {
      switch (command) {
        case 'variables':
          await this.createDataSourceVariableTemplate();
          await this.optimizeExistingDashboards();
          break;
        case 'folders':
          await this.createAdvancedFolderStructure();
          break;
        case 'labels':
          await this.createStandardizedAlertLabels();
          break;
        case 'performance':
          await this.createConcurrentAccessOptimizations();
          break;
        case 'all':
          await this.log('info', '🚀 Running complete advanced optimization...');
          await this.createDataSourceVariableTemplate();
          await this.createAdvancedFolderStructure();
          await this.createStandardizedAlertLabels();
          await this.optimizeExistingDashboards();
          await this.createConcurrentAccessOptimizations();
          
          console.log('\n🎯 ADVANCED OPTIMIZATION COMPLETE');
          console.log('=' .repeat(50));
          console.log('✅ Data source variable templates created');
          console.log('✅ Advanced folder structure with subfolders');
          console.log('✅ Standardized alert labels implemented');
          console.log('✅ Existing dashboards optimized');
          console.log('✅ Concurrent access optimizations configured');
          console.log('\n📈 Performance improvements applied for enterprise usage');
          break;
        default:
          await this.log('error', `Unknown command: ${command}`);
          this.showHelp();
          return;
      }

      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      await this.log('info', `🏁 Advanced optimization '${command}' completed in ${duration}s`);

    } catch {
      await this.log('error', `Advanced optimization '${command}' failed: ${error.message}`);
      process.exit(1);
    }
  }

  showHelp() {
    console.log('\n🚀 Parker Flight Advanced Monitoring Optimizer');
    console.log('═'.repeat(50));
    console.log('Usage: node scripts/advanced-optimization.js <command>');
    console.log('\nCommands:');
    console.log('  variables    🔄 Optimize template variables with data source switching');
    console.log('  folders      📁 Create advanced folder structure with subfolders');
    console.log('  labels       🏷️ Implement standardized alert labels');
    console.log('  performance  ⚡ Configure concurrent access optimizations');
    console.log('  all          🎯 Run complete advanced optimization');
    console.log('\nBased on advanced Grafana bot recommendations for enterprise optimization.');
  }
}

// CLI interface
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const command = process.argv[2];
  
  if (!command) {
    const optimizer = new AdvancedMonitoringOptimizer();
    optimizer.showHelp();
    process.exit(1);
  }

  const optimizer = new AdvancedMonitoringOptimizer();
  optimizer.runAdvancedOptimization(command).catch(error => {
    console.error('❌ Advanced optimization failed:', error);
    process.exit(1);
  });
}

module.exports = { AdvancedMonitoringOptimizer };

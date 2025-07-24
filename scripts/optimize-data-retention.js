#!/usr/bin/env node

/**
 * Data Retention Optimization for Parker Flight
 * 
 * This script optimizes Prometheus data retention and storage costs by:
 * 1. Analyzing metric usage patterns
 * 2. Configuring retention policies by metric importance
 * 3. Setting up recording rules for downsampling
 * 4. Monitoring storage usage and costs
 */

import fs from 'fs/promises';
import axios from 'axios';
import { performance } from 'perf_hooks';

const PROMETHEUS_URL = 'http://localhost:9090';
const RECORDING_RULES_DIR = './monitoring/prometheus/rules';

class DataRetentionOptimizer {
  constructor() {
    this.retentionPolicies = {
      // Critical metrics - keep longer
      critical: {
        retention: '90d',
        metrics: [
          'parker_flight_requests_total',
          'parker_flight_request_duration_seconds',
          'parker_flight_service_dependency_health',
          'up'
        ]
      },
      // Important metrics - moderate retention
      important: {
        retention: '30d', 
        metrics: [
          'parker_flight_service_dependency_requests_total',
          'parker_flight_service_dependency_duration_seconds',
          'parker_flight_nodejs_process_cpu_seconds_total',
          'parker_flight_nodejs_process_resident_memory_bytes'
        ]
      },
      // Debug metrics - short retention
      debug: {
        retention: '7d',
        metrics: [
          'parker_flight_nodejs_nodejs_eventloop_lag_seconds',
          'parker_flight_nodejs_nodejs_gc_duration_seconds',
          'parker_flight_nodejs_nodejs_heap_size_total_bytes'
        ]
      }
    };
  }

  async log(level, message) {
    const timestamp = new Date().toISOString();
    const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : level === 'success' ? '✅' : 'ℹ️';
    console.log(`${timestamp} ${emoji} ${message}`);
  }

  async analyzeMetricUsage() {
    await this.log('info', '📊 Analyzing metric usage patterns...');

    try {
      // Get all unique metric names by querying the metrics
      const seriesResponse = await axios.get(`${PROMETHEUS_URL}/api/v1/label/__name__/values`);
      const allMetrics = seriesResponse.data.data;

      await this.log('info', `Found ${allMetrics.length} unique metrics`);

      const analysis = {
        totalMetrics: allMetrics.length,
        parkerFlightMetrics: allMetrics.filter(m => m.startsWith('parker_flight')).length,
        nodejsMetrics: allMetrics.filter(m => m.includes('nodejs')).length,
        systemMetrics: allMetrics.filter(m => !m.startsWith('parker_flight') && !m.includes('nodejs')).length,
        metrics: []
      };

      // Analyze each Parker Flight metric
      for (const metric of allMetrics.filter(m => m.startsWith('parker_flight'))) {
        try {
          // Get metric metadata
          const metadataResponse = await axios.get(`${PROMETHEUS_URL}/api/v1/metadata?metric=${metric}`);
          const metadata = metadataResponse.data.data[metric]?.[0] || {};

          // Get sample data to understand cardinality
          const queryResponse = await axios.get(`${PROMETHEUS_URL}/api/v1/query`, {
            params: { query: `group by (__name__)({__name__="${metric}"})` }
          });

          const cardinality = queryResponse.data.data.result.length;

          // Determine retention category
          let category = 'debug';
          if (this.retentionPolicies.critical.metrics.some(m => metric.includes(m))) {
            category = 'critical';
          } else if (this.retentionPolicies.important.metrics.some(m => metric.includes(m))) {
            category = 'important';
          }

          analysis.metrics.push({
            name: metric,
            type: metadata.type || 'unknown',
            help: metadata.help || 'No description',
            cardinality: cardinality,
            category: category,
            recommendedRetention: this.retentionPolicies[category].retention
          });

        } catch (error) {
          await this.log('warn', `Failed to analyze metric ${metric}: ${error.message}`);
        }
      }

      await this.log('success', `✅ Analyzed ${analysis.metrics.length} Parker Flight metrics`);
      return analysis;

    } catch (error) {
      await this.log('error', `Metric analysis failed: ${error.message}`);
      throw error;
    }
  }

  async generateRecordingRules() {
    await this.log('info', '📝 Generating recording rules for downsampling...');

    const recordingRules = {
      groups: [
        {
          name: 'parker_flight_recording_rules_5m',
          interval: '30s',
          rules: [
            {
              record: 'parker_flight:request_rate_5m',
              expr: 'rate(parker_flight_requests_total[5m])',
              labels: {
                job: 'parker-flight'
              }
            },
            {
              record: 'parker_flight:error_rate_5m', 
              expr: 'rate(parker_flight_requests_total{status=~"5.."}[5m]) / rate(parker_flight_requests_total[5m])',
              labels: {
                job: 'parker-flight'
              }
            },
            {
              record: 'parker_flight:p95_latency_5m',
              expr: 'histogram_quantile(0.95, rate(parker_flight_request_duration_seconds_bucket[5m]))',
              labels: {
                job: 'parker-flight'
              }
            },
            {
              record: 'parker_flight:dependency_success_rate_5m',
              expr: 'rate(parker_flight_service_dependency_requests_total{status_code="200"}[5m]) / rate(parker_flight_service_dependency_requests_total[5m])',
              labels: {
                job: 'parker-flight'
              }
            }
          ]
        },
        {
          name: 'parker_flight_recording_rules_1h',
          interval: '5m',
          rules: [
            {
              record: 'parker_flight:request_rate_1h',
              expr: 'avg_over_time(parker_flight:request_rate_5m[1h])',
              labels: {
                job: 'parker-flight'
              }
            },
            {
              record: 'parker_flight:error_rate_1h',
              expr: 'avg_over_time(parker_flight:error_rate_5m[1h])',
              labels: {
                job: 'parker-flight'
              }
            },
            {
              record: 'parker_flight:p95_latency_1h',
              expr: 'avg_over_time(parker_flight:p95_latency_5m[1h])',
              labels: {
                job: 'parker-flight'
              }
            }
          ]
        },
        {
          name: 'parker_flight_recording_rules_1d',
          interval: '1h',
          rules: [
            {
              record: 'parker_flight:request_rate_1d',
              expr: 'avg_over_time(parker_flight:request_rate_1h[1d])',
              labels: {
                job: 'parker-flight'
              }
            },
            {
              record: 'parker_flight:error_rate_1d',
              expr: 'avg_over_time(parker_flight:error_rate_1h[1d])',
              labels: {
                job: 'parker-flight'
              }
            },
            {
              record: 'parker_flight:availability_1d',
              expr: '1 - avg_over_time(parker_flight:error_rate_1h[1d])',
              labels: {
                job: 'parker-flight'
              }
            }
          ]
        }
      ]
    };

    // Write recording rules to file
    const rulesPath = `${RECORDING_RULES_DIR}/parker-flight-recording-rules.yml`;
    await fs.mkdir(RECORDING_RULES_DIR, { recursive: true });
    
    // Convert to YAML format (simplified)
    const yamlContent = this.convertToYaml(recordingRules);
    await fs.writeFile(rulesPath, yamlContent);

    await this.log('success', `✅ Generated recording rules: ${rulesPath}`);
    return recordingRules;
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

  async calculateStorageCosts() {
    await this.log('info', '💰 Calculating storage costs and optimization potential...');

    try {
      // Get Prometheus statistics

      // Estimate storage usage
      const tsdbStatsResponse = await axios.get(`${PROMETHEUS_URL}/api/v1/query`, {
        params: { query: 'prometheus_tsdb_head_samples' }
      });

      const currentSamples = tsdbStatsResponse.data.data.result[0]?.value[1] || 0;
      
      // Rough estimates for storage calculation
      const bytesPerSample = 2; // Compressed storage
      const samplesPerSecond = 100; // Estimated based on scrape interval
      const secondsPerDay = 86400;
      const daysInMonth = 30;

      const dailyStorageMB = (samplesPerSecond * secondsPerDay * bytesPerSample) / (1024 * 1024);
      const monthlyStorageGB = (dailyStorageMB * daysInMonth) / 1024;

      // Cost estimates (rough AWS EBS pricing)
      const costPerGBMonth = 0.10; // $0.10 per GB per month
      const monthlyCost = monthlyStorageGB * costPerGBMonth;

      // Calculate optimization potential
      const debugMetricsPercent = 30; // Estimate
      const potentialSavings = monthlyCost * (debugMetricsPercent / 100);

      const analysis = {
        currentSamples: parseInt(currentSamples),
        estimatedDailyStorageMB: Math.round(dailyStorageMB * 10) / 10,
        estimatedMonthlyStorageGB: Math.round(monthlyStorageGB * 10) / 10,
        estimatedMonthlyCost: Math.round(monthlyCost * 100) / 100,
        potentialMonthlySavings: Math.round(potentialSavings * 100) / 100,
        recommendations: [
          'Apply retention policies to reduce debug metric storage by 7-30 days',
          'Use recording rules to downsample high-frequency metrics',
          'Consider remote storage for long-term historical data',
          'Implement metric filtering to exclude unused metrics'
        ]
      };

      await this.log('success', `✅ Storage analysis complete`);
      
      // Print cost analysis
      console.log('\n💰 STORAGE COST ANALYSIS');
      console.log('=' .repeat(50));
      console.log(`📊 Current Samples: ${analysis.currentSamples.toLocaleString()}`);
      console.log(`📈 Daily Storage: ${analysis.estimatedDailyStorageMB} MB`);
      console.log(`💾 Monthly Storage: ${analysis.estimatedMonthlyStorageGB} GB`);
      console.log(`💵 Estimated Monthly Cost: $${analysis.estimatedMonthlyCost}`);
      console.log(`💡 Potential Savings: $${analysis.potentialMonthlySavings}/month`);
      console.log('\n📋 Recommendations:');
      analysis.recommendations.forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec}`);
      });

      return analysis;

    } catch (error) {
      await this.log('error', `Storage cost calculation failed: ${error.message}`);
      throw error;
    }
  }

  async generateRetentionConfig() {
    await this.log('info', '⚙️ Generating optimized retention configuration...');

    const config = {
      prometheus: {
        global: {
          retention: '30d', // Default retention
          retentionSize: '10GB' // Maximum storage size
        },
        retention_policies: this.retentionPolicies
      },
      recommendations: {
        storage: [
          'Use SSD storage for recent data (last 7 days) for fast queries',
          'Use cheaper HDD storage for historical data (older than 7 days)',
          'Enable compression to reduce storage by 50-80%',
          'Consider remote storage solutions for data older than 90 days'
        ],
        query_optimization: [
          'Use recording rules for commonly queried aggregations',
          'Limit query time ranges to necessary periods',
          'Use efficient PromQL queries with proper filtering',
          'Cache dashboard queries where possible'
        ],
        monitoring: [
          'Monitor prometheus_tsdb_* metrics for storage usage',
          'Set up alerts for storage capacity issues',
          'Regularly review and clean up unused metrics',
          'Track query performance and optimize slow queries'
        ]
      }
    };

    const configPath = './monitoring/retention-config.json';
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    await this.log('success', `✅ Retention configuration saved: ${configPath}`);
    return config;
  }

  async optimizePrometheusConfig() {
    await this.log('info', '🔧 Optimizing Prometheus configuration...');

    try {
      // Read current Prometheus config
      const configPath = './monitoring/prometheus/prometheus.yml';
      const currentConfig = await fs.readFile(configPath, 'utf8');

      // Parse and enhance configuration
      const lines = currentConfig.split('\n');
      
      // Find global section and add optimization settings
      let optimizedConfig = '';
      let inGlobal = false;
      let globalEnhanced = false;

      for (const line of lines) {
        if (line.trim() === 'global:') {
          inGlobal = true;
          optimizedConfig += line + '\n';
        } else if (inGlobal && line.startsWith('  ') && !globalEnhanced) {
          // Add retention and storage optimizations
          optimizedConfig += line + '\n';
          if (line.includes('evaluation_interval')) {
            optimizedConfig += '  # Storage optimizations\n';
            optimizedConfig += '  external_labels:\n';
            optimizedConfig += '    environment: "production"\n';
            optimizedConfig += '    service: "parker-flight"\n';
            globalEnhanced = true;
          }
        } else if (inGlobal && !line.startsWith('  ')) {
          inGlobal = false;
          optimizedConfig += line + '\n';
        } else {
          optimizedConfig += line + '\n';
        }
      }

      // Add storage optimization comment
      if (!optimizedConfig.includes('# Storage Optimization')) {
        optimizedConfig += '\n# Storage Optimization Notes:\n';
        optimizedConfig += '# - Default retention: 30d (can be overridden with --storage.tsdb.retention.time)\n';
        optimizedConfig += '# - Max storage size: 10GB (can be set with --storage.tsdb.retention.size)\n';
        optimizedConfig += '# - Enable WAL compression with --storage.tsdb.wal-compression\n';
      }

      // Write optimized configuration
      const optimizedPath = './monitoring/prometheus/prometheus-optimized.yml';
      await fs.writeFile(optimizedPath, optimizedConfig);

      await this.log('success', `✅ Optimized Prometheus config saved: ${optimizedPath}`);
      await this.log('info', 'ℹ️ To apply optimizations, replace prometheus.yml with prometheus-optimized.yml');

      return {
        originalConfig: configPath,
        optimizedConfig: optimizedPath,
        changes: [
          'Added external labels for better metric organization',
          'Added storage optimization documentation',
          'Prepared for retention policy implementation'
        ]
      };

    } catch (error) {
      await this.log('error', `Prometheus optimization failed: ${error.message}`);
      throw error;
    }
  }

  async runCommand(command) {
    const startTime = performance.now();
    
    try {
      switch (command) {
        case 'analyze':
          await this.analyzeMetricUsage();
          break;
        case 'recording-rules':
          await this.generateRecordingRules();
          break;
        case 'costs':
          await this.calculateStorageCosts();
          break;
        case 'config':
          await this.generateRetentionConfig();
          break;
        case 'optimize':
          await this.optimizePrometheusConfig();
          break;
        case 'full': {
          await this.log('info', '🚀 Running full data retention optimization...');
          const analysis = await this.analyzeMetricUsage();
          await this.generateRecordingRules();
          const costs = await this.calculateStorageCosts();
          await this.generateRetentionConfig();
          await this.optimizePrometheusConfig();
          
          console.log('\n🎯 OPTIMIZATION SUMMARY');
          console.log('=' .repeat(50));
          console.log(`📊 Metrics Analyzed: ${analysis.metrics.length}`);
          console.log(`💰 Potential Monthly Savings: $${costs.potentialMonthlySavings}`);
          console.log(`⚙️ Files Generated: 3 configuration files + recording rules`);
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
    console.log('\n🎯 Parker Flight Data Retention Optimizer');
    console.log('═'.repeat(50));
    console.log('Usage: node scripts/optimize-data-retention.js <command>');
    console.log('\nCommands:');
    console.log('  analyze          📊 Analyze metric usage patterns');
    console.log('  recording-rules  📝 Generate recording rules for downsampling');
    console.log('  costs           💰 Calculate storage costs and savings');
    console.log('  config          ⚙️ Generate retention configuration');
    console.log('  optimize        🔧 Optimize Prometheus configuration');
    console.log('  full            🚀 Run complete optimization workflow');
    console.log('\nExamples:');
    console.log('  node scripts/optimize-data-retention.js analyze');
    console.log('  node scripts/optimize-data-retention.js costs');
    console.log('  node scripts/optimize-data-retention.js full');
  }
}

// CLI interface
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const command = process.argv[2];
  
  if (!command) {
    const optimizer = new DataRetentionOptimizer();
    optimizer.showHelp();
    process.exit(1);
  }

  const optimizer = new DataRetentionOptimizer();
  optimizer.runCommand(command).catch(error => {
    console.error('❌ Data retention optimization failed:', error);
    process.exit(1);
  });
}

export { DataRetentionOptimizer };

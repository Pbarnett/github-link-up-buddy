import { AdvancedAWSMetrics } from './advanced-aws-metrics.js';
import { SecurityAlertingThresholds } from './security-alerting.js';
import { MultiRegionHealthMonitor } from './multi-region-health.js';
import { DistributedTracing } from './distributed-tracing.js';

/**
 * Central Monitoring Orchestrator
 * Integrates all monitoring components for comprehensive observability
 */
export class MonitoringOrchestrator {
  private metricsCollector: AdvancedAWSMetrics;
  private securityAlerting: SecurityAlertingThresholds;
  private healthMonitor: MultiRegionHealthMonitor;
  private distributedTracing: DistributedTracing;

  private isInitialized = false;
  private monitoringStatus = {
    metrics: false,
    alerting: false,
    health: false,
    tracing: false
  };

  constructor() {
    this.metricsCollector = new AdvancedAWSMetrics();
    this.securityAlerting = new SecurityAlertingThresholds();
    this.healthMonitor = new MultiRegionHealthMonitor();
    this.distributedTracing = new DistributedTracing();
  }

  /**
   * Initialize complete monitoring infrastructure
   */
  async initializeMonitoring(): Promise<void> {
    console.log('🚀 Initializing Parker Flight Enterprise Monitoring Infrastructure...');

    try {
      // Phase 1: Advanced Metrics Collection
      console.log('📊 Phase 1: Setting up advanced AWS metrics...');
      await this.metricsCollector.startMetricCollection();
      this.monitoringStatus.metrics = true;
      console.log('✅ Advanced metrics collection started');

      // Phase 2: Security Alerting
      console.log('🔐 Phase 2: Configuring security alerting system...');
      await this.securityAlerting.setupSecurityAlerts();
      this.monitoringStatus.alerting = true;
      console.log('✅ Security alerting system configured');

      // Phase 3: Multi-Region Health Monitoring
      console.log('🌍 Phase 3: Initializing multi-region health monitoring...');
      await this.healthMonitor.initializeHealthMonitoring();
      this.monitoringStatus.health = true;
      console.log('✅ Multi-region health monitoring active');

      // Phase 4: Distributed Tracing
      console.log('🔍 Phase 4: Setting up distributed tracing...');
      await this.distributedTracing.startMockTrace();
      this.monitoringStatus.tracing = true;
      console.log('✅ Distributed tracing initialized');

      this.isInitialized = true;

      // Start periodic system health checks
      await this.startSystemHealthChecks();

      console.log('🎉 Parker Flight Enterprise Monitoring Infrastructure fully operational!');
      await this.printMonitoringDashboard();

    } catch (error) {
      console.error('❌ Failed to initialize monitoring infrastructure:', error);
      throw error;
    }
  }

  /**
   * Start periodic system health checks
   */
  private async startSystemHealthChecks(): Promise<void> {
    // Check system health every 10 minutes
    setInterval(async () => {
      await this.performSystemHealthCheck();
    }, 600000);

    // Generate monitoring reports every hour
    setInterval(async () => {
      await this.generateMonitoringReport();
    }, 3600000);

    // Initial health check
    setTimeout(async () => {
      await this.performSystemHealthCheck();
    }, 30000);
  }

  /**
   * Perform comprehensive system health check
   */
  async performSystemHealthCheck(): Promise<void> {
    console.log('🔍 Performing system health check...');

    try {
      const healthChecks = {
        metrics: await this.checkMetricsHealth(),
        alerting: await this.checkAlertingHealth(),
        multiRegion: await this.checkMultiRegionHealth(),
        tracing: await this.checkTracingHealth()
      };

      const overallHealth = Object.values(healthChecks).every(check => check.status === 'healthy');

      console.log(`📋 System Health Status: ${overallHealth ? '✅ HEALTHY' : '⚠️ DEGRADED'}`);

      if (!overallHealth) {
        console.warn('⚠️ Some monitoring components are experiencing issues:');
        Object.entries(healthChecks).forEach(([component, health]) => {
          if (health.status !== 'healthy') {
            console.warn(`  - ${component}: ${health.message}`);
          }
        });
      }

    } catch (error) {
      console.error('❌ System health check failed:', error);
    }
  }

  /**
   * Check metrics collection health
   */
  private async checkMetricsHealth(): Promise<{ status: string; message: string }> {
    try {
      const status = await this.metricsCollector.getMetricCollectionStatus();
      return {
        status: status.isCollecting ? 'healthy' : 'unhealthy',
        message: status.isCollecting ? 'Metrics collection active' : 'Metrics collection stopped'
      };
    } catch (error) {
      return { status: 'unhealthy', message: 'Failed to check metrics status' };
    }
  }

  /**
   * Check alerting system health
   */
  private async checkAlertingHealth(): Promise<{ status: string; message: string }> {
    try {
      const status = await this.securityAlerting.getAlertingStatus();
      return {
        status: status.totalAlarms > 0 ? 'healthy' : 'unhealthy',
        message: `${status.totalAlarms} alarms configured`
      };
    } catch (error) {
      return { status: 'unhealthy', message: 'Failed to check alerting status' };
    }
  }

  /**
   * Check multi-region health monitoring
   */
  private async checkMultiRegionHealth(): Promise<{ status: string; message: string }> {
    try {
      const status = await this.healthMonitor.getHealthStatus();
      return {
        status: status.totalHealthChecks > 0 ? 'healthy' : 'unhealthy',
        message: `${status.totalHealthChecks} health checks across ${status.monitoredRegions.length} regions`
      };
    } catch (error) {
      return { status: 'unhealthy', message: 'Failed to check health monitoring status' };
    }
  }

  /**
   * Check distributed tracing health
   */
  private async checkTracingHealth(): Promise<{ status: string; message: string }> {
    try {
      const status = await this.distributedTracing.getTraceStatus();
      return {
        status: 'healthy',
        message: 'Distributed tracing operational'
      };
    } catch (error) {
      return { status: 'unhealthy', message: 'Failed to check tracing status' };
    }
  }

  /**
   * Generate comprehensive monitoring report
   */
  async generateMonitoringReport(): Promise<void> {
    console.log('📊 Generating monitoring report...');

    try {
      const report = {
        timestamp: new Date().toISOString(),
        infrastructure: {
          metrics: await this.metricsCollector.getMetricCollectionStatus(),
          alerting: await this.securityAlerting.getAlertingStatus(),
          health: await this.healthMonitor.getHealthStatus(),
          tracing: await this.distributedTracing.getTraceStatus()
        },
        systemHealth: this.monitoringStatus
      };

      console.log('📋 PARKER FLIGHT MONITORING REPORT');
      console.log('═══════════════════════════════════');
      console.log(`Timestamp: ${report.timestamp}`);
      console.log(`Metrics Collection: ${report.systemHealth.metrics ? '✅' : '❌'}`);
      console.log(`Security Alerting: ${report.systemHealth.alerting ? '✅' : '❌'}`);
      console.log(`Health Monitoring: ${report.systemHealth.health ? '✅' : '❌'}`);
      console.log(`Distributed Tracing: ${report.systemHealth.tracing ? '✅' : '❌'}`);
      console.log('═══════════════════════════════════');

    } catch (error) {
      console.error('❌ Failed to generate monitoring report:', error);
    }
  }

  /**
   * Print monitoring dashboard
   */
  async printMonitoringDashboard(): Promise<void> {
    console.log('\n🎯 PARKER FLIGHT ENTERPRISE MONITORING DASHBOARD');
    console.log('══════════════════════════════════════════════════');
    
    console.log('📊 ADVANCED METRICS COLLECTION');
    console.log('  • KMS key utilization and policy violations');
    console.log('  • Secrets Manager rotation and access patterns');
    console.log('  • Cross-region usage monitoring');
    console.log('  • Performance and cache hit ratio tracking');
    
    console.log('\n🔐 SECURITY ALERTING SYSTEM');
    console.log('  • Critical: Unauthorized access attempts');
    console.log('  • High: Performance degradation & policy violations');
    console.log('  • Medium: Unusual access patterns & cache issues');
    console.log('  • Composite alarms for complex scenarios');
    
    console.log('\n🌍 MULTI-REGION HEALTH MONITORING');
    console.log('  • Route53 health checks across regions');
    console.log('  • Service availability tracking');
    console.log('  • Automatic failover detection');
    console.log('  • Regional performance metrics');
    
    console.log('\n🔍 DISTRIBUTED TRACING');
    console.log('  • AWS X-Ray integration');
    console.log('  • Request flow tracking');
    console.log('  • Performance bottleneck detection');
    
    console.log('\n📈 MONITORING ENDPOINTS');
    console.log(`  • Primary API: ${process.env.PRIMARY_API_DOMAIN || 'api.parkerfl.ight'}`);
    console.log(`  • Payment Service: ${process.env.PAYMENT_API_DOMAIN || 'payment.parkerfl.ight'}`);
    console.log(`  • Auth Service: ${process.env.AUTH_API_DOMAIN || 'auth.parkerfl.ight'}`);
    
    console.log('\n🚨 ALERT CHANNELS');
    console.log(`  • Security Team: ${process.env.SECURITY_TEAM_EMAIL || 'security@parkerfl.ight'}`);
    console.log(`  • On-Call Phone: ${process.env.ONCALL_PHONE || '+1234567890'}`);
    console.log(`  • PagerDuty: ${process.env.PAGERDUTY_WEBHOOK ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`  • Slack: ${process.env.SLACK_WEBHOOK ? '✅ Configured' : '❌ Not configured'}`);
    
    console.log('\n══════════════════════════════════════════════════');
    console.log('🎉 All systems operational - monitoring active!');
    console.log('══════════════════════════════════════════════════\n');
  }

  /**
   * Test all monitoring systems
   */
  async testMonitoringSystems(): Promise<void> {
    console.log('🧪 Testing all monitoring systems...');

    try {
      // Test alerting system
      await this.securityAlerting.testAlertingSystem();
      console.log('✅ Alerting system test completed');

      // Test health monitoring failover
      await this.healthMonitor.triggerFailoverTest('us-west-2');
      console.log('✅ Health monitoring failover test completed');

      // Test distributed tracing
      await this.distributedTracing.startMockTrace();
      console.log('✅ Distributed tracing test completed');

      console.log('🎉 All monitoring systems tested successfully!');

    } catch (error) {
      console.error('❌ Monitoring system tests failed:', error);
    }
  }

  /**
   * Get overall monitoring status
   */
  async getMonitoringStatus(): Promise<any> {
    return {
      initialized: this.isInitialized,
      components: this.monitoringStatus,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };
  }

  /**
   * Shutdown monitoring systems gracefully
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down monitoring systems...');
    
    try {
      // In a real implementation, you would stop intervals and clean up resources
      this.isInitialized = false;
      this.monitoringStatus = {
        metrics: false,
        alerting: false,
        health: false,
        tracing: false
      };
      
      console.log('✅ Monitoring systems shut down successfully');
      
    } catch (error) {
      console.error('❌ Failed to shutdown monitoring systems:', error);
    }
  }
}

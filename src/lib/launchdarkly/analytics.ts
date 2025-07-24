/**
 * LaunchDarkly Analytics and Performance Monitoring
 * Comprehensive tracking system for feature flag usage and performance
 */

import { LDContext } from '@launchdarkly/node-server-sdk';

export interface FlagEvaluationEvent {
  flagKey: string;
  value: any;
  defaultValue: any;
  context: LDContext;
  timestamp: number;
  evaluationTime?: number;
  variation?: number;
  reason?: any;
}

export interface FlagPerformanceMetrics {
  flagKey: string;
  evaluationTime: number;
  success: boolean;
  error?: string;
  timestamp: number;
  contextHash?: string;
}

export interface FlagUsageStats {
  flagKey: string;
  evaluationCount: number;
  uniqueContexts: number;
  averageEvaluationTime: number;
  errorRate: number;
  lastEvaluated: number;
  variations: Record<string, number>;
}

/**
 * Analytics system for tracking feature flag performance and usage
 */
export class FlagAnalytics {
  private static evaluationEvents: FlagEvaluationEvent[] = [];
  private static performanceMetrics: FlagPerformanceMetrics[] = [];
  private static usageStats = new Map<string, FlagUsageStats>();
  private static maxEvents = 1000; // Prevent memory bloat
  private static flushInterval: NodeJS.Timeout | null = null;
  
  /**
   * Initialize analytics with configuration
   */
  static initialize(config: {
    maxEvents?: number;
    autoFlush?: boolean;
    flushIntervalMs?: number;
    enableTelemetry?: boolean;
  } = {}): void {
    this.maxEvents = config.maxEvents || 1000;
    
    if (config.autoFlush !== false) {
      const interval = config.flushIntervalMs || 60000; // 1 minute default
      this.flushInterval = setInterval(() => {
        this.flushMetrics();
      }, interval);
    }
  }

  /**
   * Track a flag evaluation event
   */
  static trackFlagEvaluation(
    flagKey: string,
    value: any,
    context: LDContext,
    options: {
      defaultValue?: any;
      evaluationTime?: number;
      variation?: number;
      reason?: any;
    } = {}
  ): void {
    const event: FlagEvaluationEvent = {
      flagKey,
      value,
      defaultValue: options.defaultValue,
      context,
      timestamp: Date.now(),
      evaluationTime: options.evaluationTime,
      variation: options.variation,
      reason: options.reason
    };

    // Add to events array
    this.evaluationEvents.push(event);
    
    // Trim if needed
    if (this.evaluationEvents.length > this.maxEvents) {
      this.evaluationEvents.shift();
    }

    // Update usage statistics
    this.updateUsageStats(flagKey, value, options.evaluationTime, true);

    // Send to external analytics if configured
    this.sendToExternalAnalytics(event);
  }

  /**
   * Track flag performance metrics
   */
  static trackFlagPerformance(flagKey: string, metrics: {
    evaluationTime: number;
    success: boolean;
    error?: string;
    contextHash?: string;
  }): void {
    const performanceMetric: FlagPerformanceMetrics = {
      flagKey,
      evaluationTime: metrics.evaluationTime,
      success: metrics.success,
      error: metrics.error,
      timestamp: Date.now(),
      contextHash: metrics.contextHash
    };

    this.performanceMetrics.push(performanceMetric);
    
    // Trim if needed
    if (this.performanceMetrics.length > this.maxEvents) {
      this.performanceMetrics.shift();
    }

    // Update usage statistics
    this.updateUsageStats(flagKey, null, metrics.evaluationTime, metrics.success);
  }

  /**
   * Update usage statistics for a flag
   */
  private static updateUsageStats(
    flagKey: string,
    value: any,
    evaluationTime?: number,
    success: boolean = true
  ): void {
    let stats = this.usageStats.get(flagKey);
    
    if (!stats) {
      stats = {
        flagKey,
        evaluationCount: 0,
        uniqueContexts: 0,
        averageEvaluationTime: 0,
        errorRate: 0,
        lastEvaluated: 0,
        variations: {}
      };
      this.usageStats.set(flagKey, stats);
    }

    // Update basic metrics
    stats.evaluationCount++;
    stats.lastEvaluated = Date.now();

    // Update evaluation time average
    if (evaluationTime) {
      const totalTime = stats.averageEvaluationTime * (stats.evaluationCount - 1) + evaluationTime;
      stats.averageEvaluationTime = totalTime / stats.evaluationCount;
    }

    // Update error rate
    if (!success) {
      stats.errorRate = ((stats.errorRate * (stats.evaluationCount - 1)) + 1) / stats.evaluationCount;
    } else {
      stats.errorRate = (stats.errorRate * (stats.evaluationCount - 1)) / stats.evaluationCount;
    }

    // Track variations
    if (value !== null && value !== undefined) {
      const variationKey = String(value);
      stats.variations[variationKey] = (stats.variations[variationKey] || 0) + 1;
    }
  }

  /**
   * Get usage statistics for a specific flag
   */
  static getFlagStats(flagKey: string): FlagUsageStats | undefined {
    return this.usageStats.get(flagKey);
  }

  /**
   * Get usage statistics for all flags
   */
  static getAllFlagStats(): Record<string, FlagUsageStats> {
    const stats: Record<string, FlagUsageStats> = {};
    for (const [key, value] of this.usageStats.entries()) {
      stats[key] = { ...value };
    }
    return stats;
  }

  /**
   * Get performance metrics for a time period
   */
  static getPerformanceMetrics(
    flagKey?: string,
    timePeriodMs: number = 3600000 // 1 hour default
  ): FlagPerformanceMetrics[] {
    const cutoff = Date.now() - timePeriodMs;
    
    return this.performanceMetrics.filter(metric => {
      const matchesFlag = !flagKey || metric.flagKey === flagKey;
      const withinTimeRange = metric.timestamp >= cutoff;
      return matchesFlag && withinTimeRange;
    });
  }

  /**
   * Get evaluation events for analysis
   */
  static getEvaluationEvents(
    flagKey?: string,
    timePeriodMs: number = 3600000
  ): FlagEvaluationEvent[] {
    const cutoff = Date.now() - timePeriodMs;
    
    return this.evaluationEvents.filter(event => {
      const matchesFlag = !flagKey || event.flagKey === flagKey;
      const withinTimeRange = event.timestamp >= cutoff;
      return matchesFlag && withinTimeRange;
    });
  }

  /**
   * Generate performance report
   */
  static generatePerformanceReport(): {
    summary: {
      totalFlags: number;
      totalEvaluations: number;
      averageEvaluationTime: number;
      overallErrorRate: number;
      slowestFlags: Array<{ flagKey: string; avgTime: number }>;
    };
    flagDetails: Record<string, FlagUsageStats>;
  } {
    const stats = this.getAllFlagStats();
    const flagKeys = Object.keys(stats);
    
    // Calculate summary metrics
    let totalEvaluations = 0;
    let totalEvaluationTime = 0;
    let totalErrors = 0;
    
    for (const stat of Object.values(stats)) {
      totalEvaluations += stat.evaluationCount;
      totalEvaluationTime += stat.averageEvaluationTime * stat.evaluationCount;
      totalErrors += stat.errorRate * stat.evaluationCount;
    }
    
    const averageEvaluationTime = totalEvaluations > 0 ? totalEvaluationTime / totalEvaluations : 0;
    const overallErrorRate = totalEvaluations > 0 ? totalErrors / totalEvaluations : 0;
    
    // Find slowest flags
    const slowestFlags = Object.values(stats)
      .sort((a, b) => b.averageEvaluationTime - a.averageEvaluationTime)
      .slice(0, 5)
      .map(stat => ({
        flagKey: stat.flagKey,
        avgTime: stat.averageEvaluationTime
      }));

    return {
      summary: {
        totalFlags: flagKeys.length,
        totalEvaluations,
        averageEvaluationTime,
        overallErrorRate,
        slowestFlags
      },
      flagDetails: stats
    };
  }

  /**
   * Send analytics data to external service
   */
  private static sendToExternalAnalytics(event: FlagEvaluationEvent): void {
    // Integration with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'launchdarkly_flag_evaluation', {
        flag_key: event.flagKey,
        flag_value: String(event.value),
        evaluation_time: event.evaluationTime,
        custom_map: {
          timestamp: event.timestamp,
          variation: event.variation,
          context_kind: event.context.kind
        }
      });
    }

    // Integration with custom analytics endpoint
    if (process.env.ANALYTICS_ENDPOINT) {
      fetch(process.env.ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ANALYTICS_API_KEY}`
        },
        body: JSON.stringify({
          event: 'flag_evaluation',
          data: {
            flagKey: event.flagKey,
            value: event.value,
            timestamp: event.timestamp,
            evaluationTime: event.evaluationTime,
            contextType: event.context.kind
          }
        })
      }).catch(error => {
        console.warn('Failed to send analytics:', error);
      });
    }
  }

  /**
   * Flush metrics to persistent storage or external services
   */
  static flushMetrics(): void {
    const report = this.generatePerformanceReport();
    
    // Log performance report
    if (process.env.NODE_ENV === 'development') {
      console.log('LaunchDarkly Performance Report:', report);
    }

    // Send to monitoring service
    if (process.env.MONITORING_ENDPOINT) {
      fetch(process.env.MONITORING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MONITORING_API_KEY}`
        },
        body: JSON.stringify({
          service: 'launchdarkly',
          timestamp: Date.now(),
          metrics: report
        })
      }).catch(error => {
        console.warn('Failed to send monitoring data:', error);
      });
    }

    // Store in localStorage for debugging
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('ld_performance_report', JSON.stringify(report));
      } catch (error) {
        console.warn('Failed to store performance report in localStorage:', error);
      }
    }
  }

  /**
   * Clear all analytics data (useful for testing)
   */
  static clear(): void {
    this.evaluationEvents.length = 0;
    this.performanceMetrics.length = 0;
    this.usageStats.clear();
  }

  /**
   * Cleanup and shutdown
   */
  static shutdown(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    // Final flush before shutdown
    this.flushMetrics();
  }
}

// Utility functions for performance monitoring
export function measureFlagEvaluation<T>(
  flagKey: string,
  evaluationFn: () => T
): T {
  const startTime = performance.now();
  
  try {
    const result = evaluationFn();
    const evaluationTime = performance.now() - startTime;
    
    FlagAnalytics.trackFlagPerformance(flagKey, {
      evaluationTime,
      success: true
    });
    
    return result;
  } catch (error) {
    const evaluationTime = performance.now() - startTime;
    
    FlagAnalytics.trackFlagPerformance(flagKey, {
      evaluationTime,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    throw error;
  }
}

// Initialize analytics on module load
FlagAnalytics.initialize({
  maxEvents: parseInt(process.env.LD_MAX_ANALYTICS_EVENTS || '1000'),
  autoFlush: process.env.LD_AUTO_FLUSH !== 'false',
  flushIntervalMs: parseInt(process.env.LD_FLUSH_INTERVAL_MS || '60000'),
  enableTelemetry: process.env.LD_ENABLE_TELEMETRY !== 'false'
});

// Cleanup on process exit
if (typeof process !== 'undefined') {
  const cleanup = () => {
    FlagAnalytics.shutdown();
  };
  
  process.on('exit', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
}

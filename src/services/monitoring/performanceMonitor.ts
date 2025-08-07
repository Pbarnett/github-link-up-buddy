
/**
 * Performance Monitoring Service for Supabase Operations
 * Tracks query performance, connection health, and provides analytics
 */

interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

interface PerformanceStats {
  totalOperations: number;
  averageLatency: number;
  successRate: number;
  errorRate: number;
  slowQueries: PerformanceMetric[];
  recentErrors: PerformanceMetric[];
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000; // Keep last 1000 operations
  private slowQueryThreshold = 1000; // 1 second
  private isEnabled: boolean;

  constructor() {
    this.isEnabled =
      !import.meta.env.PROD ||
      import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';

    if (this.isEnabled) {
      console.log('📊 Performance monitoring enabled');
      this.setupPeriodicReports();
    }
  }

  /**
   * Record a performance metric for a database operation
   */
  recordMetric(
    operation: string,
    startTime: number,
    success: boolean,
    error?: string,
    metadata?: Record<string, any>
  ): void {
    if (!this.isEnabled) return;

    const duration = Date.now() - startTime;
    const metric: PerformanceMetric = {
      operation,
      duration,
      timestamp: Date.now(),
      success,
      error,
      metadata,
    };

    this.metrics.push(metric);

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log slow queries in development
    if (import.meta.env.DEV && duration > this.slowQueryThreshold) {
      console.warn(`🐌 Slow query detected: ${operation} took ${duration}ms`, {
        operation,
        duration,
        metadata,
      });
    }

    // Log errors
    if (!success && error) {
      console.error(`❌ Database operation failed: ${operation}`, {
        error,
        duration,
        metadata,
      });
    }
  }

  /**
   * Wrapper for timing database operations
   */
  async timeOperation<T>(
    operation: string,
    promise: Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    if (!this.isEnabled) {
      return promise;
    }

    const startTime = Date.now();

    try {
      const result = await promise;
      this.recordMetric(operation, startTime, true, undefined, metadata);
      return result;
    } catch (error: any) {
      this.recordMetric(operation, startTime, false, error.message, metadata);
      throw error;
    }
  }

  /**
   * Get performance statistics
   */
  getStats(): PerformanceStats {
    if (this.metrics.length === 0) {
      return {
        totalOperations: 0,
        averageLatency: 0,
        successRate: 100,
        errorRate: 0,
        slowQueries: [],
        recentErrors: [],
      };
    }

    const totalOperations = this.metrics.length;
    const successfulOperations = this.metrics.filter(m => m.success).length;
    const failedOperations = totalOperations - successfulOperations;

    const averageLatency =
      this.metrics.reduce((sum, m) => sum + m.duration, 0) / totalOperations;
    const successRate = (successfulOperations / totalOperations) * 100;
    const errorRate = (failedOperations / totalOperations) * 100;

    // Get slow queries (sorted by duration, descending)
    const slowQueries = this.metrics
      .filter(m => m.duration > this.slowQueryThreshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10); // Top 10 slowest

    // Get recent errors (last 24 hours)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentErrors = this.metrics
      .filter(m => !m.success && m.timestamp > oneDayAgo)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20); // Most recent 20 errors

    return {
      totalOperations,
      averageLatency: Math.round(averageLatency),
      successRate: Math.round(successRate * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100,
      slowQueries,
      recentErrors,
    };
  }

  /**
   * Get performance stats for specific operations
   */
  getOperationStats(operation: string): Partial<PerformanceStats> {
    const operationMetrics = this.metrics.filter(
      m => m.operation === operation
    );

    if (operationMetrics.length === 0) {
      return { totalOperations: 0 };
    }

    const totalOperations = operationMetrics.length;
    const successfulOperations = operationMetrics.filter(m => m.success).length;
    const averageLatency =
      operationMetrics.reduce((sum, m) => sum + m.duration, 0) /
      totalOperations;
    const successRate = (successfulOperations / totalOperations) * 100;

    return {
      totalOperations,
      averageLatency: Math.round(averageLatency),
      successRate: Math.round(successRate * 100) / 100,
    };
  }

  /**
   * Get recent performance trends
   */
  getPerformanceTrends(minutes: number = 60): {
    timeline: Array<{
      timestamp: number;
      averageLatency: number;
      operationCount: number;
    }>;
    operationBreakdown: Record<string, number>;
  } {
    const cutoffTime = Date.now() - minutes * 60 * 1000;
    const recentMetrics = this.metrics.filter(m => m.timestamp > cutoffTime);

    // Group by 5-minute intervals
    const intervalMs = 5 * 60 * 1000; // 5 minutes
    const intervals = new Map<number, PerformanceMetric[]>();

    recentMetrics.forEach(metric => {
      const intervalKey =
        Math.floor(metric.timestamp / intervalMs) * intervalMs;
      if (!intervals.has(intervalKey)) {
        intervals.set(intervalKey, []);
      }
      intervals.get(intervalKey)!.push(metric);
    });

    // Create timeline data
    const timeline = Array.from(intervals.entries())
      .map(([timestamp, metrics]) => ({
        timestamp,
        averageLatency: Math.round(
          metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length
        ),
        operationCount: metrics.length,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    // Operation breakdown
    const operationBreakdown: Record<string, number> = {};
    recentMetrics.forEach(metric => {
      operationBreakdown[metric.operation] =
        (operationBreakdown[metric.operation] || 0) + 1;
    });

    return {
      timeline,
      operationBreakdown,
    };
  }

  /**
   * Check database health with performance metrics
   */
  async checkDatabaseHealth(): Promise<{
    healthy: boolean;
    latency: number;
    connectionStatus: any;
    performanceStats: PerformanceStats;
  }> {
    const startTime = Date.now();

    try {
      const healthCheck = await this.timeOperation(
        'health_check',
        DatabaseOperations.healthCheck()
      );

      const connectionStatus = DatabaseOperations.getConnectionStatus();
      const performanceStats = this.getStats();

      return {
        healthy: healthCheck.healthy,
        latency: healthCheck.latency || 0,
        connectionStatus,
        performanceStats,
      };
    } catch (error: any) {
      return {
        healthy: false,
        latency: Date.now() - startTime,
        connectionStatus: { healthy: false, lastCheck: 0 },
        performanceStats: this.getStats(),
      };
    }
  }

  /**
   * Clear all metrics (useful for testing or memory management)
   */
  clearMetrics(): void {
    this.metrics = [];
    console.log('📊 Performance metrics cleared');
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get summary report
   */
  getSummaryReport(): {
    summary: string;
    recommendations: string[];
    topSlowOperations: Array<{
      operation: string;
      avgLatency: number;
      count: number;
    }>;
  } {
    const stats = this.getStats();

    // Calculate top slow operations
    const operationStats = new Map<
      string,
      { totalDuration: number; count: number }
    >();

    this.metrics.forEach(metric => {
      const key = metric.operation;
      const current = operationStats.get(key) || { totalDuration: 0, count: 0 };
      operationStats.set(key, {
        totalDuration: current.totalDuration + metric.duration,
        count: current.count + 1,
      });
    });

    const topSlowOperations = Array.from(operationStats.entries())
      .map(([operation, data]) => ({
        operation,
        avgLatency: Math.round(data.totalDuration / data.count),
        count: data.count,
      }))
      .sort((a, b) => b.avgLatency - a.avgLatency)
      .slice(0, 5);

    // Generate recommendations
    const recommendations: string[] = [];

    if (stats.averageLatency > 500) {
      recommendations.push(
        'Consider optimizing slow queries or adding database indexes'
      );
    }

    if (stats.errorRate > 5) {
      recommendations.push(
        'High error rate detected - review error logs and implement retry logic'
      );
    }

    if (stats.slowQueries.length > 10) {
      recommendations.push(
        'Multiple slow queries detected - consider query optimization'
      );
    }

    // Generate summary
    const summary = `
      Performance Summary:
      - Total Operations: ${stats.totalOperations}
      - Average Latency: ${stats.averageLatency}ms
      - Success Rate: ${stats.successRate}%
      - Error Rate: ${stats.errorRate}%
      - Slow Queries: ${stats.slowQueries.length}
    `.trim();

    return {
      summary,
      recommendations,
      topSlowOperations,
    };
  }

  /**
   * Setup periodic performance reports (development only)
   */
  private setupPeriodicReports(): void {
    if (!import.meta.env.DEV) return;

    // Report every 5 minutes in development
    setInterval(
      () => {
        if (this.metrics.length > 0) {
          const stats = this.getStats();
          console.log('📊 Performance Report:', {
            operations: stats.totalOperations,
            avgLatency: `${stats.averageLatency}ms`,
            successRate: `${stats.successRate}%`,
            slowQueries: stats.slowQueries.length,
            errors: stats.recentErrors.length,
          });
        }
      },
      5 * 60 * 1000
    ); // 5 minutes
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for accessing performance data

export function usePerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateStats = () => {
      setStats(performanceMonitor.getStats());
      setIsLoading(false);
    };

    // Initial load
    updateStats();

    // Update every 30 seconds
    const interval = setInterval(updateStats, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    isLoading,
    getOperationStats: (operation: string) =>
      performanceMonitor.getOperationStats(operation),
    getTrends: (minutes?: number) =>
      performanceMonitor.getPerformanceTrends(minutes),
    healthCheck: () => performanceMonitor.checkDatabaseHealth(),
    getSummary: () => performanceMonitor.getSummaryReport(),
  };
}

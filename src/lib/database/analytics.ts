import { getConnectionPool } from './connection-pool';
import { performanceMonitor } from '@/services/monitoring/performanceMonitor';

/**
 * Database Analytics and Query Performance Tracking
 * 
 * Provides comprehensive analytics for database operations including:
 * - Query performance metrics
 * - Connection pool utilization
 * - Error rate tracking
 * - Usage patterns analysis
 */

export interface QueryMetrics {
  queryId: string;
  table: string;
  operation: 'select' | 'insert' | 'update' | 'delete' | 'rpc';
  duration: number;
  timestamp: number;
  userId?: string;
  success: boolean;
  error?: string;
  connectionPoolUsed: boolean;
  retryCount: number;
  rowsAffected?: number;
}

export interface AnalyticsSnapshot {
  totalQueries: number;
  averageQueryTime: number;
  errorRate: number;
  connectionPoolUtilization: number;
  slowQueries: QueryMetrics[];
  topTables: Array<{ table: string; count: number; avgDuration: number }>;
  timeRange: { start: number; end: number };
}

class DatabaseAnalytics {
  private metrics: QueryMetrics[] = [];
  private maxMetricsHistory = 10000; // Keep last 10k queries
  private slowQueryThreshold = 1000; // 1 second

  /**
   * Record a query execution for analytics
   */
  recordQuery(metrics: Omit<QueryMetrics, 'queryId' | 'timestamp'>): void {
    const queryMetrics: QueryMetrics = {
      ...metrics,
      queryId: this.generateQueryId(),
      timestamp: Date.now(),
    };

    this.metrics.push(queryMetrics);

    // Trim old metrics to prevent memory leaks
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory);
    }

    // Log slow queries
    if (queryMetrics.duration > this.slowQueryThreshold) {
      console.warn('🐌 Slow query detected:', {
        table: queryMetrics.table,
        operation: queryMetrics.operation,
        duration: `${queryMetrics.duration}ms`,
        userId: queryMetrics.userId,
      });
    }

    // Record in performance monitor
    performanceMonitor.recordMetric(`db_${metrics.operation}_${metrics.table}`, metrics.duration);
  }

  /**
   * Get analytics snapshot for a time period
   */
  getSnapshot(timeRangeMs: number = 3600000): AnalyticsSnapshot { // Default: 1 hour
    const now = Date.now();
    const startTime = now - timeRangeMs;
    
    const relevantMetrics = this.metrics.filter(
      m => m.timestamp >= startTime && m.timestamp <= now
    );

    if (relevantMetrics.length === 0) {
      return {
        totalQueries: 0,
        averageQueryTime: 0,
        errorRate: 0,
        connectionPoolUtilization: 0,
        slowQueries: [],
        topTables: [],
        timeRange: { start: startTime, end: now },
      };
    }

    const totalQueries = relevantMetrics.length;
    const successfulQueries = relevantMetrics.filter(m => m.success);
    const failedQueries = relevantMetrics.filter(m => !m.success);
    const poolQueries = relevantMetrics.filter(m => m.connectionPoolUsed);
    
    const averageQueryTime = relevantMetrics.reduce((sum, m) => sum + m.duration, 0) / totalQueries;
    const errorRate = (failedQueries.length / totalQueries) * 100;
    const connectionPoolUtilization = (poolQueries.length / totalQueries) * 100;

    // Find slow queries
    const slowQueries = relevantMetrics
      .filter(m => m.duration > this.slowQueryThreshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10); // Top 10 slowest

    // Table usage statistics
    const tableStats = new Map<string, { count: number; totalDuration: number }>();
    
    relevantMetrics.forEach(m => {
      const current = tableStats.get(m.table) || { count: 0, totalDuration: 0 };
      tableStats.set(m.table, {
        count: current.count + 1,
        totalDuration: current.totalDuration + m.duration,
      });
    });

    const topTables = Array.from(tableStats.entries())
      .map(([table, stats]) => ({
        table,
        count: stats.count,
        avgDuration: stats.totalDuration / stats.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 most queried tables

    return {
      totalQueries,
      averageQueryTime,
      errorRate,
      connectionPoolUtilization,
      slowQueries,
      topTables,
      timeRange: { start: startTime, end: now },
    };
  }

  /**
   * Get detailed metrics for a specific table
   */
  getTableMetrics(tableName: string, timeRangeMs: number = 3600000): {
    totalQueries: number;
    operations: Record<string, number>;
    averageResponseTime: number;
    errorRate: number;
    recentQueries: QueryMetrics[];
  } {
    const now = Date.now();
    const startTime = now - timeRangeMs;
    
    const tableMetrics = this.metrics.filter(
      m => m.table === tableName && m.timestamp >= startTime
    );

    if (tableMetrics.length === 0) {
      return {
        totalQueries: 0,
        operations: {},
        averageResponseTime: 0,
        errorRate: 0,
        recentQueries: [],
      };
    }

    const operations = tableMetrics.reduce((acc, m) => {
      acc[m.operation] = (acc[m.operation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageResponseTime = tableMetrics.reduce((sum, m) => sum + m.duration, 0) / tableMetrics.length;
    const errorRate = (tableMetrics.filter(m => !m.success).length / tableMetrics.length) * 100;

    return {
      totalQueries: tableMetrics.length,
      operations,
      averageResponseTime,
      errorRate,
      recentQueries: tableMetrics.slice(-20), // Last 20 queries
    };
  }

  /**
   * Get user-specific query patterns
   */
  getUserMetrics(userId: string, timeRangeMs: number = 3600000): {
    totalQueries: number;
    averageResponseTime: number;
    mostUsedTables: string[];
    errorRate: number;
  } {
    const now = Date.now();
    const startTime = now - timeRangeMs;
    
    const userMetrics = this.metrics.filter(
      m => m.userId === userId && m.timestamp >= startTime
    );

    if (userMetrics.length === 0) {
      return {
        totalQueries: 0,
        averageResponseTime: 0,
        mostUsedTables: [],
        errorRate: 0,
      };
    }

    const tableUsage = userMetrics.reduce((acc, m) => {
      acc[m.table] = (acc[m.table] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedTables = Object.entries(tableUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([table]) => table);

    const averageResponseTime = userMetrics.reduce((sum, m) => sum + m.duration, 0) / userMetrics.length;
    const errorRate = (userMetrics.filter(m => !m.success).length / userMetrics.length) * 100;

    return {
      totalQueries: userMetrics.length,
      averageResponseTime,
      mostUsedTables,
      errorRate,
    };
  }

  /**
   * Generate a report for database health
   */
  generateHealthReport(): {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
    metrics: AnalyticsSnapshot;
  } {
    const snapshot = this.getSnapshot();
    const issues: string[] = [];
    const recommendations: string[] = [];
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    // Check error rate
    if (snapshot.errorRate > 10) {
      status = 'critical';
      issues.push(`High error rate: ${snapshot.errorRate.toFixed(1)}%`);
      recommendations.push('Investigate failing queries and improve error handling');
    } else if (snapshot.errorRate > 5) {
      status = 'warning';
      issues.push(`Elevated error rate: ${snapshot.errorRate.toFixed(1)}%`);
    }

    // Check query performance
    if (snapshot.averageQueryTime > 2000) {
      status = status === 'critical' ? 'critical' : 'warning';
      issues.push(`Slow average query time: ${snapshot.averageQueryTime.toFixed(0)}ms`);
      recommendations.push('Consider optimizing slow queries or adding database indexes');
    }

    // Check for too many slow queries
    if (snapshot.slowQueries.length > 10) {
      status = status === 'critical' ? 'critical' : 'warning';
      issues.push(`${snapshot.slowQueries.length} slow queries detected`);
      recommendations.push('Review and optimize slow queries');
    }

    // Check connection pool utilization
    const pool = getConnectionPool();
    if (pool.isEnabled && snapshot.connectionPoolUtilization < 50) {
      issues.push(`Low connection pool utilization: ${snapshot.connectionPoolUtilization.toFixed(1)}%`);
      recommendations.push('Consider adjusting connection pool configuration or query patterns');
    }

    if (issues.length === 0) {
      recommendations.push('Database performance looks good! Keep monitoring.');
    }

    return {
      status,
      issues,
      recommendations,
      metrics: snapshot,
    };
  }

  /**
   * Clear old metrics (useful for testing or memory management)
   */
  clearMetrics(olderThanMs?: number): void {
    if (olderThanMs) {
      const cutoff = Date.now() - olderThanMs;
      this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
    } else {
      this.metrics = [];
    }
  }

  /**
   * Export metrics for external analysis
   */
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = [
        'queryId', 'table', 'operation', 'duration', 'timestamp', 
        'userId', 'success', 'error', 'connectionPoolUsed', 'retryCount', 'rowsAffected'
      ];
      
      const csvContent = [
        headers.join(','),
        ...this.metrics.map(m => [
          m.queryId,
          m.table,
          m.operation,
          m.duration,
          m.timestamp,
          m.userId || '',
          m.success,
          m.error || '',
          m.connectionPoolUsed,
          m.retryCount,
          m.rowsAffected || ''
        ].join(','))
      ].join('\n');
      
      return csvContent;
    }

    return JSON.stringify(this.metrics, null, 2);
  }

  private generateQueryId(): string {
    return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const databaseAnalytics = new DatabaseAnalytics();

/**
 * Middleware function to wrap database operations with analytics
 */
export function withAnalytics<T extends (...args: any[]) => Promise<any>>(
  operation: T,
  table: string,
  operationType: QueryMetrics['operation'],
  userId?: string
): T {
  return (async (...args: any[]) => {
    const startTime = Date.now();
    const pool = getConnectionPool();
    let success = false;
    let error: string | undefined;
    let retryCount = 0;

    try {
      const result = await operation(...args);
      success = !result.error;
      error = result.error?.message;
      
      // Try to extract retry count from result metadata if available
      if (result.metadata?.retryCount) {
        retryCount = result.metadata.retryCount;
      }

      return result;
    } catch (err: any) {
      success = false;
      error = err.message;
      throw err;
    } finally {
      databaseAnalytics.recordQuery({
        table,
        operation: operationType,
        duration: Date.now() - startTime,
        userId,
        success,
        error,
        connectionPoolUsed: pool.isEnabled,
        retryCount,
      });
    }
  }) as T;
}

/**
 * React hook for accessing database analytics in components
 */
export function useDatabaseAnalytics() {
  const getSnapshot = (timeRangeMs?: number) => databaseAnalytics.getSnapshot(timeRangeMs);
  const getTableMetrics = (table: string, timeRangeMs?: number) => 
    databaseAnalytics.getTableMetrics(table, timeRangeMs);
  const getUserMetrics = (userId: string, timeRangeMs?: number) => 
    databaseAnalytics.getUserMetrics(userId, timeRangeMs);
  const getHealthReport = () => databaseAnalytics.generateHealthReport();

  return {
    getSnapshot,
    getTableMetrics,
    getUserMetrics,
    getHealthReport,
    exportMetrics: databaseAnalytics.exportMetrics.bind(databaseAnalytics),
  };
}

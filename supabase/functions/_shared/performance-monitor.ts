/**
 * Performance Monitoring for Auto-Book Monitor
 * 
 * Tracks and analyzes parallel processing performance improvements
 * over the previous serial implementation.
 */

import { logger } from './logger.ts'
import { withSpan } from './otel.ts'

export interface ProcessingMetrics {
  totalRequests: number
  processed: number
  skipped: number
  errors: number
  bookingsTriggered: number
  totalDurationMs: number
  avgDurationMs: number
  minDurationMs: number
  maxDurationMs: number
  concurrency: number
  batches: number
  throughputPerSecond: number
}

export interface PerformanceComparison {
  parallelProcessing: ProcessingMetrics
  estimatedSerialDuration: number
  performanceGain: number
  throughputImprovement: number
}

/**
 * Calculate performance metrics and comparison against serial processing
 */
export function calculatePerformanceMetrics(
  totalRequests: number,
  processed: number,
  skipped: number,
  errors: number,
  bookingsTriggered: number,
  totalDurationMs: number,
  minDurationMs: number,
  maxDurationMs: number,
  concurrency: number,
  batches: number
): PerformanceComparison {
  
  const avgDurationMs = processed > 0 ? Math.round(totalDurationMs / processed) : 0
  const throughputPerSecond = totalDurationMs > 0 ? (processed / (totalDurationMs / 1000)) : 0
  
  const parallelMetrics: ProcessingMetrics = {
    totalRequests,
    processed,
    skipped,
    errors,
    bookingsTriggered,
    totalDurationMs,
    avgDurationMs,
    minDurationMs: minDurationMs === Infinity ? 0 : minDurationMs,
    maxDurationMs,
    concurrency,
    batches,
    throughputPerSecond
  }
  
  // Estimate serial processing time (worst case: sum of all processing times)
  const estimatedSerialDuration = avgDurationMs * processed
  
  // Calculate performance improvements
  const performanceGain = estimatedSerialDuration > 0 
    ? Math.round(((estimatedSerialDuration - totalDurationMs) / estimatedSerialDuration) * 100)
    : 0
    
  const serialThroughput = estimatedSerialDuration > 0 ? (processed / (estimatedSerialDuration / 1000)) : 0
  const throughputImprovement = serialThroughput > 0 
    ? Math.round(((throughputPerSecond - serialThroughput) / serialThroughput) * 100)
    : 0
  
  return {
    parallelProcessing: parallelMetrics,
    estimatedSerialDuration,
    performanceGain,
    throughputImprovement
  }
}

/**
 * Log performance metrics with structured observability
 */
export function logPerformanceMetrics(comparison: PerformanceComparison): void {
  return withSpan(
    'auto_book_monitor.performance_analysis',
    (span) => {
      const metrics = comparison.parallelProcessing
      
      // Set span attributes for observability
      span.attributes['performance.total_requests'] = metrics.totalRequests
      span.attributes['performance.processed'] = metrics.processed
      span.attributes['performance.throughput_per_second'] = metrics.throughputPerSecond
      span.attributes['performance.concurrency'] = metrics.concurrency
      span.attributes['performance.gain_percentage'] = comparison.performanceGain
      span.attributes['performance.avg_duration_ms'] = metrics.avgDurationMs
      
      // Log comprehensive performance report
      logger.info('Auto-book monitor performance analysis', {
        operation: 'auto_book_monitor_performance',
        parallel_processing: {
          requests_processed: metrics.processed,
          total_duration_ms: metrics.totalDurationMs,
          avg_duration_ms: metrics.avgDurationMs,
          min_duration_ms: metrics.minDurationMs,
          max_duration_ms: metrics.maxDurationMs,
          throughput_per_second: metrics.throughputPerSecond.toFixed(2),
          concurrency_level: metrics.concurrency,
          batch_count: metrics.batches
        },
        performance_comparison: {
          estimated_serial_duration_ms: comparison.estimatedSerialDuration,
          performance_gain_percentage: comparison.performanceGain,
          throughput_improvement_percentage: comparison.throughputImprovement,
          time_saved_ms: comparison.estimatedSerialDuration - metrics.totalDurationMs
        },
        results: {
          bookings_triggered: metrics.bookingsTriggered,
          skipped: metrics.skipped,
          errors: metrics.errors,
          success_rate: ((metrics.processed / metrics.totalRequests) * 100).toFixed(1) + '%'
        }
      })
      
      // Alert on performance degradation
      if (comparison.performanceGain < 50) {
        logger.warn('Parallel processing performance below expected gains', {
          operation: 'auto_book_monitor_performance_warning',
          expected_gain_percentage: 50,
          actual_gain_percentage: comparison.performanceGain,
          recommendation: 'Consider adjusting concurrency levels or investigating bottlenecks'
        })
      }
      
      // Alert on high error rates
      const errorRate = (metrics.errors / metrics.totalRequests) * 100
      if (errorRate > 10) {
        logger.error('High error rate detected in parallel processing', {
          operation: 'auto_book_monitor_error_rate_alert',
          error_rate_percentage: errorRate.toFixed(1),
          errors: metrics.errors,
          total_requests: metrics.totalRequests,
          recommendation: 'Investigate error patterns and consider reducing concurrency'
        })
      }
      
      // Log throughput achievements
      if (metrics.throughputPerSecond > 5) {
        logger.info('High throughput processing achieved', {
          operation: 'auto_book_monitor_throughput_success',
          throughput_per_second: metrics.throughputPerSecond.toFixed(2),
          performance_tier: 'high_performance'
        })
      }
    },
    {
      'service.name': 'performance-monitor',
      'monitor.type': 'parallel_processing_analysis'
    }
  )
}

/**
 * Generate performance recommendations based on metrics
 */
export function generatePerformanceRecommendations(comparison: PerformanceComparison): string[] {
  const metrics = comparison.parallelProcessing
  const recommendations: string[] = []
  
  // Concurrency optimization
  if (metrics.concurrency < 5 && metrics.totalRequests > 20) {
    recommendations.push('Consider increasing concurrency level for better throughput on larger request volumes')
  }
  
  if (metrics.concurrency > 15) {
    recommendations.push('High concurrency detected - monitor for resource contention and connection limits')
  }
  
  // Error rate optimization
  const errorRate = (metrics.errors / metrics.totalRequests) * 100
  if (errorRate > 5) {
    recommendations.push(`Error rate (${errorRate.toFixed(1)}%) is elevated - investigate failure patterns`)
  }
  
  // Performance optimization
  if (comparison.performanceGain < 30) {
    recommendations.push('Parallel processing gains are below optimal - check for bottlenecks in individual request processing')
  }
  
  // Throughput optimization
  if (metrics.throughputPerSecond < 2 && metrics.totalRequests > 10) {
    recommendations.push('Low throughput detected - consider optimizing individual request processing time')
  }
  
  // Duration variance analysis
  const durationVariance = metrics.maxDurationMs - metrics.minDurationMs
  if (durationVariance > 5000) {
    recommendations.push(`High processing time variance (${durationVariance}ms) - investigate inconsistent performance`)
  }
  
  return recommendations
}

/**
 * Export performance data for monitoring dashboards
 */
export function exportMetricsForDashboard(comparison: PerformanceComparison): Record<string, number> {
  const metrics = comparison.parallelProcessing
  
  return {
    // Core metrics
    'auto_book_monitor.requests.total': metrics.totalRequests,
    'auto_book_monitor.requests.processed': metrics.processed,
    'auto_book_monitor.requests.skipped': metrics.skipped,
    'auto_book_monitor.requests.errors': metrics.errors,
    'auto_book_monitor.bookings.triggered': metrics.bookingsTriggered,
    
    // Performance metrics
    'auto_book_monitor.duration.total_ms': metrics.totalDurationMs,
    'auto_book_monitor.duration.avg_ms': metrics.avgDurationMs,
    'auto_book_monitor.duration.min_ms': metrics.minDurationMs,
    'auto_book_monitor.duration.max_ms': metrics.maxDurationMs,
    'auto_book_monitor.throughput.per_second': metrics.throughputPerSecond,
    
    // Parallel processing metrics
    'auto_book_monitor.parallel.concurrency': metrics.concurrency,
    'auto_book_monitor.parallel.batches': metrics.batches,
    'auto_book_monitor.parallel.performance_gain_pct': comparison.performanceGain,
    'auto_book_monitor.parallel.throughput_improvement_pct': comparison.throughputImprovement,
    
    // Derived metrics
    'auto_book_monitor.success_rate_pct': (metrics.processed / metrics.totalRequests) * 100,
    'auto_book_monitor.error_rate_pct': (metrics.errors / metrics.totalRequests) * 100,
    'auto_book_monitor.booking_rate_pct': (metrics.bookingsTriggered / metrics.processed) * 100
  }
}

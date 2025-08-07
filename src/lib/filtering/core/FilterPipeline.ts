/**
 * Core Filter Pipeline Implementation
 *
 * This class manages the execution of multiple flight filters in a consistent
 * and performant manner. It provides comprehensive error handling, performance
 * monitoring, and configurable filter execution.
 */

import { , FlightOffer, FlightFilter, FilterContext, FilterPipeline, FilterPipelineResult, FilterExecutionResult, FilterError, FilterWarning, FilterConfig, PerformanceLogger } from './types';
  FlightOffer,
  FlightFilter,
  FilterContext,
  FilterPipeline,
  FilterPipelineResult,
  FilterExecutionResult,
  FilterError,
  FilterWarning,
  FilterConfig,
  PerformanceLogger,
./types';

export class DefaultFilterPipeline implements FilterPipeline {
  private filters: Map<string, FlightFilter> = new Map();
  private config: FilterConfig;
  private logger?: PerformanceLogger;

  constructor(config?: Partial<FilterConfig>, logger?: PerformanceLogger) {
    this.config = {
      enabledFilters: [],
      budgetTolerance: 50,
      carryOnFeeTimeoutMs: 5000,
      exchangeRateBuffer: 0.05,
      baseCurrency: 'USD',
      maxOffersToProcess: 1000,
      enableParallelProcessing: false,
      ...config,
    };
    this.logger = logger;
  }

  addFilter(filter: FlightFilter): void {
    this.filters.set(filter.name, filter);
    console.log(
      `[FilterPipeline] Added filter: ${filter.name} (priority: ${filter.priority})`
    );
  }

  removeFilter(filterName: string): boolean {
    const removed = this.filters.delete(filterName);
    if (removed) {
      console.log(`[FilterPipeline] Removed filter: ${filterName}`);
    }
    return removed;
  }

  getFilters(): FlightFilter[] {
    return Array.from(this.filters.values()).sort(
      (a, b) => a.priority - b.priority
    );
  }

  getConfig(): FilterConfig {
    return { ...this.config };
  }

  async execute(
    offers: FlightOffer[],
    context: FilterContext
  ): Promise<FilterPipelineResult> {
    const startTime = Date.now();
    const originalCount = offers.length;

    console.log(
      `[FilterPipeline] Starting execution with ${originalCount} offers`
    );

    // Validate inputs
    if (!offers.length) {
      return this.createEmptyResult(originalCount, startTime);
    }

    // Limit offers to process if configured
    const offersToProcess = offers.slice(0, this.config.maxOffersToProcess);
    if (offersToProcess.length < offers.length) {
      console.warn(
        `[FilterPipeline] Limited processing to ${offersToProcess.length} offers (max: ${this.config.maxOffersToProcess})`
      );
    }

    let currentOffers = offersToProcess;
    const filterResults: FilterExecutionResult[] = [];
    const errors: FilterError[] = [];
    const warnings: FilterWarning[] = [];

    // Get enabled filters in priority order
    const enabledFilters = this.getEnabledFilters();

    if (enabledFilters.length === 0) {
      console.warn('[FilterPipeline] No enabled filters, returning all offers');
      return this.createResult(
        currentOffers,
        originalCount,
        startTime,
        filterResults,
        errors,
        warnings
      );
    }

    // Execute filters sequentially (parallel execution disabled for now due to complexity)
    for (const filter of enabledFilters) {
      const filterStartTime = Date.now();
      const beforeCount = currentOffers.length;

      try {
        // Validate filter configuration if supported
        if (filter.validate) {
          const validation = filter.validate(context);
          if (!validation.isValid) {
            const error = new Error(
              `Filter validation failed: ${validation.errors.join(', ')}`
            );
            errors.push({
              filterName: filter.name,
              error,
              context: { validation },
              timestamp: new Date(),
            });

            validation.warnings.forEach(warning => {
              warnings.push({
                filterName: filter.name,
                message: warning,
                timestamp: new Date(),
              });
            });

            continue; // Skip this filter
          }
        }

        // Execute the filter
        console.log(
          `[FilterPipeline] Executing filter: ${filter.name} (${beforeCount} offers)`
        );
        const filteredOffers = await Promise.resolve(
          filter.apply(currentOffers, context)
        );

        const afterCount = filteredOffers.length;
        const executionTime = Date.now() - filterStartTime;

        // Log performance
        this.logger?.log(filter.name, beforeCount, afterCount, executionTime);

        // Record filter execution result
        filterResults.push({
          filterName: filter.name,
          beforeCount,
          afterCount,
          executionTimeMs: executionTime,
          removedOffers: beforeCount - afterCount,
        });

        console.log(
          `[FilterPipeline] Filter ${filter.name} completed: ${beforeCount} → ${afterCount} (removed ${beforeCount - afterCount})`
        );

        currentOffers = filteredOffers;

        // If all offers filtered out, break early
        if (currentOffers.length === 0) {
          console.warn(
            `[FilterPipeline] All offers filtered out by ${filter.name}`
          );
          break;
        }
      } catch (error) {
        const filterError =
          error instanceof Error ? error : new Error(String(error));
        console.error(
          `[FilterPipeline] Filter ${filter.name} failed:`,
          filterError
        );

        errors.push({
          filterName: filter.name,
          error: filterError,
          context: { beforeCount, offers: currentOffers.slice(0, 3) }, // Sample for debugging
          timestamp: new Date(),
        });

        this.logger?.logError(filter.name, filterError, { beforeCount });

        // Continue with next filter instead of failing entirely
        continue;
      }
    }

    const result = this.createResult(
      currentOffers,
      originalCount,
      startTime,
      filterResults,
      errors,
      warnings
    );

    console.log(
      `[FilterPipeline] Execution completed: ${originalCount} → ${result.finalCount} (${result.executionTimeMs}ms)`
    );

    return result;
  }

  private getEnabledFilters(): FlightFilter[] {
    const allFilters = this.getFilters();

    // If no specific filters enabled, return all
    if (this.config.enabledFilters.length === 0) {
      return allFilters;
    }

    // Return only enabled filters
    return allFilters.filter(filter =>
      this.config.enabledFilters.includes(filter.name)
    );
  }

  private createResult(
    filteredOffers: FlightOffer[],
    originalCount: number,
    startTime: number,
    filterResults: FilterExecutionResult[],
    errors: FilterError[],
    warnings: FilterWarning[]
  ): FilterPipelineResult {
    const executionTimeMs = Date.now() - startTime;

    return {
      filteredOffers,
      originalCount,
      finalCount: filteredOffers.length,
      executionTimeMs,
      filterResults,
      errors,
      warnings,
    };
  }

  private createEmptyResult(
    originalCount: number,
    startTime: number
  ): FilterPipelineResult {
    return this.createResult([], originalCount, startTime, [], [], []);
  }

  /**
   * Update pipeline configuration
   */
  updateConfig(newConfig: Partial<FilterConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('[FilterPipeline] Configuration updated');
  }

  /**
   * Get execution statistics
   */
  getStats(): {
    filterCount: number;
    enabledFilterCount: number;
    lastExecutionTime?: number;
  } {
    const enabledFilters = this.getEnabledFilters();

    return {
      filterCount: this.filters.size,
      enabledFilterCount: enabledFilters.length,
    };
  }

  /**
   * Reset all filters and configuration
   */
  reset(): void {
    this.filters.clear();
    console.log('[FilterPipeline] Pipeline reset');
  }
}

/**
 * Simple console-based performance logger
 */
export class ConsolePerformanceLogger implements PerformanceLogger {
  private logs: Array<{
    filterName: string;
    beforeCount: number;
    afterCount: number;
    durationMs: number;
    timestamp: Date;
  }> = [];

  log(
    filterName: string,
    beforeCount: number,
    afterCount: number,
    durationMs: number
  ): void {
    const logEntry = {
      filterName,
      beforeCount,
      afterCount,
      durationMs,
      timestamp: new Date(),
    };

    this.logs.push(logEntry);

    console.log(
      `[PerformanceLogger] ${filterName}: ${beforeCount}→${afterCount} (${durationMs}ms)`
    );
  }

  logError(
    filterName: string,
    error: Error,
    context?: Record<string, unknown>
  ): void {
    console.error(
      `[PerformanceLogger] ERROR in ${filterName}:`,
      error.message,
      context
    );
  }

  logWarning(
    filterName: string,
    message: string,
    context?: Record<string, unknown>
  ): void {
    console.warn(
      `[PerformanceLogger] WARNING in ${filterName}:`,
      message,
      context
    );
  }

  getStats(): {
    totalExecutions: number;
    averageExecutionTime: number;
    slowestFilter: { name: string; time: number } | null;
  } {
    if (this.logs.length === 0) {
      return {
        totalExecutions: 0,
        averageExecutionTime: 0,
        slowestFilter: null,
      };
    }

    const totalTime = this.logs.reduce((sum, log) => sum + log.durationMs, 0);
    const averageExecutionTime = totalTime / this.logs.length;

    const slowestLog = this.logs.reduce((slowest, current) =>
      current.durationMs > slowest.durationMs ? current : slowest
    );

    return {
      totalExecutions: this.logs.length,
      averageExecutionTime,
      slowestFilter: {
        name: slowestLog.filterName,
        time: slowestLog.durationMs,
      },
    };
  }

  clear(): void {
    this.logs = [];
  }
}

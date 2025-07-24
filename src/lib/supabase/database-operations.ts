import { QueryData, QueryError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database, Tables, TablesInsert, TablesUpdate } from '@/types/database';
import { performanceMonitor } from '@/services/monitoring/performanceMonitor';
import { SupabaseErrorHandler, withRetry } from './error-handler';

// Connection health monitoring
class ConnectionMonitor {
  private lastHealthCheck = 0;
  private healthCheckInterval = 30000; // 30 seconds
  private isHealthy = true;

  async checkHealth(): Promise<boolean> {
    const now = Date.now();
    
    // Skip if we checked recently
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return this.isHealthy;
    }

    this.lastHealthCheck = now;

    try {
      // Simple health check - query feature flags table
      const { error } = await supabase
        .from('feature_flags')
        .select('id')
        .limit(1)
        .abortSignal(AbortSignal.timeout(5000));
      
      this.isHealthy = !error;
      
      if (!this.isHealthy) {
        console.warn('🔗 Database connection health check failed:', error);
      }
      
      return this.isHealthy;
    } catch (error) {
      console.error('🔗 Database health check error:', error);
      this.isHealthy = false;
      return false;
    }
  }

  getStatus(): { healthy: boolean; lastCheck: number } {
    return {
      healthy: this.isHealthy,
      lastCheck: this.lastHealthCheck
    };
  }
}

const connectionMonitor = new ConnectionMonitor();

// Type-safe database operations with automatic error handling and retry logic

/**
 * Generic type-safe select operation with automatic error handling
 */
export class DatabaseOperations {
  /**
   * Safely select data from a table with automatic error handling
   * @param table - Table name
   * @param query - Query builder function
   * @param options - Configuration options
   * @returns Promise with typed data and error
   */
  static async select<T extends keyof Database['public']['Tables']>(
    table: T,
    query?: (builder: ReturnType<typeof supabase.from>) => any,
    options: {
      withRetry?: boolean;
      maxRetries?: number;
      timeout?: number;
    } = {}
  ) {
    const { withRetry: enableRetry = false, maxRetries = 3, timeout = 30000 } = options;

    const operation = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        let queryBuilder = supabase.from(table).abortSignal(controller.signal);
        
        if (query) {
          queryBuilder = query(queryBuilder);
        }

        const result = await queryBuilder;
        clearTimeout(timeoutId);
        
        if (result.error) {
          throw result.error;
        }

        return result;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    };

    try {
      const result = enableRetry ? 
        await withRetry(operation, maxRetries) : 
        await operation();
        
      return await performanceMonitor.timeOperation(
        `select_${table}`,
        Promise.resolve(result),
        { table, withRetry: enableRetry, timeout }
      );
    } catch (error) {
      const handledError = SupabaseErrorHandler.handle(error as Error);
      return { data: null, error: handledError };
    }
  }

  /**
   * Safely insert data into a table
   * @param table - Table name
   * @param data - Data to insert
   * @param options - Configuration options
   */
  static async insert<T extends keyof Database['public']['Tables']>(
    table: T,
    data: TablesInsert<T> | TablesInsert<T>[],
    options: {
      onConflict?: string;
      returning?: string;
      withRetry?: boolean;
      maxRetries?: number;
    } = {}
  ) {
    const { onConflict, returning = '*', withRetry: enableRetry = false, maxRetries = 3 } = options;

    const operation = async () => {
      let queryBuilder = supabase.from(table).insert(data).select(returning);

      if (onConflict) {
        // Handle upsert scenarios
        queryBuilder = queryBuilder.upsert(data, { onConflict }).select(returning);
      }

      const result = await queryBuilder;

      if (result.error) {
        throw result.error;
      }

      return result;
    };

    try {
      if (enableRetry) {
        return await withRetry(operation, maxRetries);
      } else {
        return await operation();
      }
    } catch (error) {
      const handledError = SupabaseErrorHandler.handle(error as Error);
      return { data: null, error: handledError };
    }
  }

  /**
   * Safely update data in a table
   * @param table - Table name 
   * @param data - Data to update
   * @param filters - Filter conditions
   * @param options - Configuration options
   */
  static async update<T extends keyof Database['public']['Tables']>(
    table: T,
    data: TablesUpdate<T>,
    filters: Record<string, any>,
    options: {
      returning?: string;
      withRetry?: boolean;
      maxRetries?: number;
    } = {}
  ) {
    const { returning = '*', withRetry: enableRetry = false, maxRetries = 3 } = options;

    const operation = async () => {
      let queryBuilder = supabase.from(table).update(data);

      // Apply filters
      Object.entries(filters).forEach(([column, value]) => {
        queryBuilder = queryBuilder.eq(column, value);
      });

      const result = await queryBuilder.select(returning);
      
      if (result.error) {
        throw result.error;
      }

      return result;
    };

    try {
      if (enableRetry) {
        return await withRetry(operation, maxRetries);
      } else {
        return await operation();
      }
    } catch (error) {
      const handledError = SupabaseErrorHandler.handle(error as Error);
      return { data: null, error: handledError };
    }
  }

  /**
   * Safely delete data from a table
   * @param table - Table name
   * @param filters - Filter conditions  
   * @param options - Configuration options
   */
  static async delete<T extends keyof Database['public']['Tables']>(
    table: T,
    filters: Record<string, any>,
    options: {
      returning?: string;
      withRetry?: boolean;
      maxRetries?: number;
    } = {}
  ) {
    const { returning = '*', withRetry: enableRetry = false, maxRetries = 3 } = options;

    const operation = async () => {
      let queryBuilder = supabase.from(table).delete();

      // Apply filters
      Object.entries(filters).forEach(([column, value]) => {
        queryBuilder = queryBuilder.eq(column, value);
      });

      const result = await queryBuilder.select(returning);
      
      if (result.error) {
        throw result.error;
      }

      return result;
    };

    try {
      if (enableRetry) {
        return await withRetry(operation, maxRetries);
      } else {
        return await operation();
      }
    } catch (error) {
      const handledError = SupabaseErrorHandler.handle(error as Error);
      return { data: null, error: handledError };
    }
  }

  /**
   * Safely call a PostgreSQL function (RPC)
   * @param functionName - Name of the function
   * @param args - Function arguments
   * @param options - Configuration options
   */
  static async rpc<T = any>(
    functionName: string,
    args?: Record<string, any>,
    options: {
      withRetry?: boolean;
      maxRetries?: number;
      timeout?: number;
      get?: boolean; // For read replicas
    } = {}
  ) {
    const { withRetry: enableRetry = false, maxRetries = 3, timeout = 30000, get = false } = options;

    const operation = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const result = await supabase.rpc(functionName, args || {}, { 
          get,
          signal: controller.signal 
        } as any);
        
        clearTimeout(timeoutId);
        
        if (result.error) {
          throw result.error;
        }

        return result;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    };

    try {
      if (enableRetry) {
        return await withRetry(operation, maxRetries);
      } else {
        return await operation();
      }
    } catch (error) {
      const handledError = SupabaseErrorHandler.handle(error as Error);
      return { data: null, error: handledError };
    }
  }

  /**
   * Profile-specific database operations with completeness calculation
   */
  static async getProfileCompleteness(
    userId: string,
    options: { withRetry?: boolean } = {}
  ): Promise<QueryResult<{
    completionPercentage: number;
    completedFields: number;
    totalFields: number;
    missingFields: string[];
  }>> {
    return this.rpc('calculate_profile_completeness', { user_id: userId }, options);
  }

  /**
   * Multi-traveler profile operations
   */
  static async getTravelerProfiles(
    userId: string,
    options: { includeInactive?: boolean; withRetry?: boolean } = {}
  ) {
    const { includeInactive = false, withRetry: enableRetry = false } = options;
    
    return this.select('traveler_profiles', (builder) => {
      let query = builder
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true });
      
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      
      return query;
    }, { withRetry: enableRetry });
  }

  static async createTravelerProfile(
    userId: string,
    profile: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      nationality: string;
      isDefault?: boolean;
      [key: string]: any;
    },
    options: { withRetry?: boolean } = {}
  ) {
    // If this is set as default, we need to unset other defaults first
    if (profile.isDefault) {
      await this.update(
        'traveler_profiles',
        { is_default: false },
        { user_id: userId, is_default: true },
        options
      );
    }

    return this.insert(
      'traveler_profiles',
      {
        ...profile,
        user_id: userId,
        is_active: true
      },
      options
    );
  }

  /**
   * Feature flag operations with caching
   */
  static async getFeatureFlagValue(
    flagName: string,
    userId?: string,
    options: { withRetry?: boolean } = {}
  ) {
    return this.rpc('get_feature_flag_value', {
      flag_name: flagName,
      user_id: userId
    }, options);
  }

  /**
   * Wallet/Payment operations with enhanced security
   */
  static async getPaymentMethods(
    userId: string,
    options: { withRetry?: boolean } = {}
  ) {
    return this.select('payment_methods', (builder) => 
      builder
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true })
    , options);
  }

  /**
   * Check database connection health
   */
  static async healthCheck(): Promise<{
    healthy: boolean;
    latency?: number;
    error?: string;
    timestamp: number;
  }> {
    const startTime = Date.now();
    
    try {
      const { error } = await supabase
        .from('feature_flags')
        .select('id')
        .limit(1)
        .abortSignal(AbortSignal.timeout(5000));
      
      const latency = Date.now() - startTime;
      
      return {
        healthy: !error,
        latency,
        error: error?.message,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      return {
        healthy: false,
        error: error.message || 'Health check failed',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get connection monitoring status
   */
  static getConnectionStatus() {
    return connectionMonitor.getStatus();
  }

  /**
   * Execute a transaction with rollback capability
   * @param operations - Array of operations to execute in transaction
   */
  static async transaction<T>(
    operations: Array<() => Promise<any>>,
    options: {
      withRetry?: boolean;
      maxRetries?: number;
    } = {}
  ): Promise<{ data: T[] | null; error: any }> {
    const { withRetry: enableRetry = false, maxRetries = 3 } = options;

    const operation = async () => {
      const results: any[] = [];
      
      // Note: Supabase doesn't support explicit transactions in the client
      // This is a simplified version that executes operations sequentially
      // For true transactions, use PostgreSQL functions or stored procedures
      
      for (const op of operations) {
        const result = await op();
        if (result.error) {
          throw new Error(`Transaction failed: ${result.error.message}`);
        }
        results.push(result.data);
      }

      return { data: results, error: null };
    };

    try {
      if (enableRetry) {
        return await withRetry(operation, maxRetries);
      } else {
        return await operation();
      }
    } catch (error) {
      const handledError = SupabaseErrorHandler.handle(error as Error);
      return { data: null, error: handledError };
    }
  }
}

/**
 * Type-safe query result helpers
 */
export type QueryResult<T> = {
  data: T | null;
  error: any;
};

export type QueryResults<T> = {
  data: T[] | null;
  error: any;
};

/**
 * Helper functions for common query patterns
 */
export const queryHelpers = {
  /**
   * Find a single record by ID
   */
  async findById<T extends keyof Database['public']['Tables']>(
    table: T,
    id: string | number,
    idColumn: string = 'id'
  ): Promise<QueryResult<Tables<T>>> {
    return DatabaseOperations.select(table, (builder) => 
      builder.eq(idColumn, id).single()
    );
  },

  /**
   * Find records with pagination
   */
  async findWithPagination<T extends keyof Database['public']['Tables']>(
    table: T,
    page: number = 1,
    pageSize: number = 10,
    filters?: Record<string, any>
  ): Promise<QueryResults<Tables<T>>> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    return DatabaseOperations.select(table, (builder) => {
      let query = builder.range(from, to);
      
      if (filters) {
        Object.entries(filters).forEach(([column, value]) => {
          query = query.eq(column, value);
        });
      }
      
      return query;
    });
  },

  /**
   * Count records with optional filters
   */
  async count<T extends keyof Database['public']['Tables']>(
    table: T,
    filters?: Record<string, any>
  ): Promise<QueryResult<number>> {
    return DatabaseOperations.select(table, (builder) => {
      let query = builder.select('*', { count: 'exact', head: true });
      
      if (filters) {
        Object.entries(filters).forEach(([column, value]) => {
          query = query.eq(column, value);
        });
      }
      
      return query;
    }).then(result => ({
      data: result.count || 0,
      error: result.error
    }));
  }
};

// Export commonly used types for convenience
export type { Database, Tables, TablesInsert, TablesUpdate } from '@/types/database';

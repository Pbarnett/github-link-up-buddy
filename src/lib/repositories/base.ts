/**
 * Base Repository Pattern Implementation
 * 
 * Provides a standardized interface for database operations with
 * error handling, logging, and retry logic.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { DatabaseError, handleError, type ErrorContext } from '../errors';
import { retry, RetryDecorators } from '../resilience/retry';

/**
 * Base repository configuration
 */
export interface RepositoryConfig {
  client: SupabaseClient<Database>;
  tableName: string;
  enableRetry?: boolean;
  logQueries?: boolean;
}

/**
 * Query options for repository operations
 */
export interface QueryOptions {
  /** Columns to select (default: '*') */
  select?: string;
  
  /** Ordering */
  orderBy?: { column: string; ascending?: boolean }[];
  
  /** Pagination */
  limit?: number;
  offset?: number;
  
  /** Range selection */
  range?: { from: number; to: number };
  
  /** Whether to throw on empty results */
  throwOnEmpty?: boolean;
  
  /** Additional context for error handling */
  context?: ErrorContext;
}

/**
 * Filter conditions for queries
 */
export interface FilterCondition {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is' | 'not';
  value: any;
}

/**
 * Base repository class providing common database operations
 */
export abstract class BaseRepository<
  TTable extends keyof Database['public']['Tables'],
  TRow = Tables<TTable>,
  TInsert = TablesInsert<TTable>,
  TUpdate = TablesUpdate<TTable>
> {
  protected client: SupabaseClient<Database>;
  protected tableName: string;
  protected enableRetry: boolean;
  protected logQueries: boolean;

  constructor(config: RepositoryConfig) {
    this.client = config.client;
    this.tableName = config.tableName;
    this.enableRetry = config.enableRetry ?? true;
    this.logQueries = config.logQueries ?? false;
  }

  /**
   * Execute a database operation with retry and error handling
   */
  protected async executeQuery<T>(
    operation: () => Promise<{ data: T | null; error: any }>,
    context?: ErrorContext
  ): Promise<T> {
    const executeOperation = async () => {
      if (this.logQueries) {
        console.log(`[${this.tableName}] Executing query`, context);
      }

      const { data, error } = await operation();

      if (error) {
        throw new DatabaseError(
          `${this.tableName} operation failed: ${error.message}`,
          { 
            ...context, 
            table: this.tableName,
            supabaseError: error,
            errorCode: error.code,
            errorDetails: error.details 
          }
        );
      }

      return data;
    };

    if (this.enableRetry) {
      return retry(executeOperation, RetryDecorators.database({
        onRetry: (error, attempt, delay) => {
          console.warn(
            `[${this.tableName}] Database operation failed (attempt ${attempt}), retrying in ${delay}ms`,
            { error: error instanceof Error ? error.message : error, context }
          );
        }
      }));
    } else {
      return executeOperation();
    }
  }

  /**
   * Apply filters to a query builder
   */
  protected applyFilters(
    query: any,
    filters: FilterCondition[]
  ): any {
    return filters.reduce((q, filter) => {
      switch (filter.operator) {
        case 'eq':
          return q.eq(filter.column, filter.value);
        case 'neq':
          return q.neq(filter.column, filter.value);
        case 'gt':
          return q.gt(filter.column, filter.value);
        case 'gte':
          return q.gte(filter.column, filter.value);
        case 'lt':
          return q.lt(filter.column, filter.value);
        case 'lte':
          return q.lte(filter.column, filter.value);
        case 'like':
          return q.like(filter.column, filter.value);
        case 'ilike':
          return q.ilike(filter.column, filter.value);
        case 'in':
          return q.in(filter.column, filter.value);
        case 'is':
          return q.is(filter.column, filter.value);
        case 'not':
          return q.not(filter.column, filter.operator, filter.value);
        default:
          return q;
      }
    }, query);
  }

  /**
   * Apply query options to a query builder
   */
  protected applyQueryOptions(
    query: any,
    options: QueryOptions = {}
  ): any {
    let q = query;

    // Apply select
    if (options.select) {
      q = q.select(options.select);
    }

    // Apply ordering
    if (options.orderBy) {
      options.orderBy.forEach(order => {
        q = q.order(order.column, { ascending: order.ascending ?? true });
      });
    }

    // Apply pagination
    if (options.limit) {
      q = q.limit(options.limit);
    }

    if (options.offset) {
      q = q.range(options.offset, options.offset + (options.limit || 1000) - 1);
    } else if (options.range) {
      q = q.range(options.range.from, options.range.to);
    }

    return q;
  }

  /**
   * Find a single record by ID
   */
  public async findById(
    id: string,
    options: QueryOptions = {}
  ): Promise<TRow | null> {
    try {
      const query = this.client
        .from(this.tableName)
        .select(options.select || '*')
        .eq('id', id)
        .maybeSingle();

      const result = await this.executeQuery(
        () => query,
        { operation: 'findById', id, ...options.context }
      );

      return result as TRow | null;
    } catch (error) {
      if (options.throwOnEmpty) {
        throw error;
      }
      return null;
    }
  }

  /**
   * Find multiple records with filters
   */
  public async findMany(
    filters: FilterCondition[] = [],
    options: QueryOptions = {}
  ): Promise<TRow[]> {
    let query = this.client.from(this.tableName);
    
    // Apply filters
    query = this.applyFilters(query, filters);
    
    // Apply query options
    query = this.applyQueryOptions(query, options);

    const result = await this.executeQuery(
      () => query,
      { operation: 'findMany', filters, ...options.context }
    );

    return (result || []) as TRow[];
  }

  /**
   * Find a single record with filters
   */
  public async findOne(
    filters: FilterCondition[],
    options: QueryOptions = {}
  ): Promise<TRow | null> {
    const records = await this.findMany(filters, { ...options, limit: 1 });
    return records[0] || null;
  }

  /**
   * Create a new record
   */
  public async create(
    data: TInsert,
    options: QueryOptions = {}
  ): Promise<TRow> {
    const query = this.client
      .from(this.tableName)
      .insert(data)
      .select(options.select || '*')
      .single();

    const result = await this.executeQuery(
      () => query,
      { operation: 'create', data, ...options.context }
    );

    if (!result) {
      throw new DatabaseError(
        `Failed to create record in ${this.tableName}`,
        { operation: 'create', data, ...options.context }
      );
    }

    return result as TRow;
  }

  /**
   * Create multiple records
   */
  public async createMany(
    data: TInsert[],
    options: QueryOptions = {}
  ): Promise<TRow[]> {
    const query = this.client
      .from(this.tableName)
      .insert(data)
      .select(options.select || '*');

    const result = await this.executeQuery(
      () => query,
      { operation: 'createMany', count: data.length, ...options.context }
    );

    return (result || []) as TRow[];
  }

  /**
   * Update a record by ID
   */
  public async updateById(
    id: string,
    data: TUpdate,
    options: QueryOptions = {}
  ): Promise<TRow> {
    const query = this.client
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select(options.select || '*')
      .single();

    const result = await this.executeQuery(
      () => query,
      { operation: 'updateById', id, data, ...options.context }
    );

    if (!result) {
      throw new DatabaseError(
        `Record not found or update failed in ${this.tableName}`,
        { operation: 'updateById', id, data, ...options.context }
      );
    }

    return result as TRow;
  }

  /**
   * Update multiple records with filters
   */
  public async updateMany(
    filters: FilterCondition[],
    data: TUpdate,
    options: QueryOptions = {}
  ): Promise<TRow[]> {
    let query = this.client
      .from(this.tableName)
      .update(data)
      .select(options.select || '*');

    // Apply filters
    query = this.applyFilters(query, filters);

    const result = await this.executeQuery(
      () => query,
      { operation: 'updateMany', filters, data, ...options.context }
    );

    return (result || []) as TRow[];
  }

  /**
   * Delete a record by ID
   */
  public async deleteById(
    id: string,
    options: QueryOptions = {}
  ): Promise<void> {
    const query = this.client
      .from(this.tableName)
      .delete()
      .eq('id', id);

    await this.executeQuery(
      () => query,
      { operation: 'deleteById', id, ...options.context }
    );
  }

  /**
   * Delete multiple records with filters
   */
  public async deleteMany(
    filters: FilterCondition[],
    options: QueryOptions = {}
  ): Promise<void> {
    let query = this.client.from(this.tableName).delete();

    // Apply filters
    query = this.applyFilters(query, filters);

    await this.executeQuery(
      () => query,
      { operation: 'deleteMany', filters, ...options.context }
    );
  }

  /**
   * Count records with filters
   */
  public async count(
    filters: FilterCondition[] = [],
    options: QueryOptions = {}
  ): Promise<number> {
    let query = this.client
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    // Apply filters
    query = this.applyFilters(query, filters);

    const result = await this.executeQuery(
      () => query,
      { operation: 'count', filters, ...options.context }
    );

    return result?.length || 0;
  }

  /**
   * Check if record exists
   */
  public async exists(
    filters: FilterCondition[],
    options: QueryOptions = {}
  ): Promise<boolean> {
    const count = await this.count(filters, options);
    return count > 0;
  }

  /**
   * Execute a raw RPC function
   */
  public async rpc<T = any>(
    functionName: string,
    parameters: Record<string, any> = {},
    options: QueryOptions = {}
  ): Promise<T> {
    const result = await this.executeQuery(
      () => this.client.rpc(functionName, parameters),
      { operation: 'rpc', functionName, parameters, ...options.context }
    );

    return result as T;
  }
}

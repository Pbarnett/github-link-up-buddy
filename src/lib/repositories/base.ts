/**
 * Base Repository Pattern Implementation
 * 
 * Provides a standardized interface for database operations with
 * error handling, logging, and retry logic.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { DatabaseError, type ErrorContext } from '../errors';
import { retry, RetryDecorators } from '../resilience/retry';

// Type for Supabase query builders
type SupabaseQuery = {
  select: (query?: string, options?: { count?: string; head?: boolean }) => SupabaseQuery;
  eq: (column: string, value: unknown) => SupabaseQuery;
  neq: (column: string, value: unknown) => SupabaseQuery;
  gt: (column: string, value: unknown) => SupabaseQuery;
  gte: (column: string, value: unknown) => SupabaseQuery;
  lt: (column: string, value: unknown) => SupabaseQuery;
  lte: (column: string, value: unknown) => SupabaseQuery;
  like: (column: string, value: unknown) => SupabaseQuery;
  ilike: (column: string, value: unknown) => SupabaseQuery;
  in: (column: string, value: unknown) => SupabaseQuery;
  is: (column: string, value: unknown) => SupabaseQuery;
  not: (column: string, operator: string, value: unknown) => SupabaseQuery;
  order: (column: string, options?: { ascending?: boolean }) => SupabaseQuery;
  limit: (count: number) => SupabaseQuery;
  range: (from: number, to: number) => SupabaseQuery;
  maybeSingle: () => Promise<{ data: unknown; error: unknown }>;
  single: () => Promise<{ data: unknown; error: unknown }>;
  insert: (values: unknown) => SupabaseQuery;
  update: (values: unknown) => SupabaseQuery;
  delete: () => SupabaseQuery;
};

// Type for database operation results
type DatabaseResult = { data: unknown; error: unknown };

/**
 * Base repository configuration
 */
export interface RepositoryConfig {
  client: SupabaseClient<Database>;
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
  value: unknown;
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
  protected tableName: TTable;
  protected enableRetry: boolean;
  protected logQueries: boolean;

  constructor(config: RepositoryConfig & { tableName: TTable }) {
    this.client = config.client;
    this.tableName = config.tableName;
    this.enableRetry = config.enableRetry ?? true;
    this.logQueries = config.logQueries ?? false;
  }

  /**
   * Execute a database operation with retry and error handling
   */
  protected async executeQuery<T>(
    operation: () => Promise<DatabaseResult>,
    context?: ErrorContext
  ): Promise<T> {
    const executeOperation = async () => {
      if (this.logQueries) {
        console.log(`[${this.tableName}] Executing query`, context);
      }

      const { data, error } = await operation();

      if (error) {
        const errorMessage = error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Unknown error';
        const errorCode = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
        const errorDetails = error && typeof error === 'object' && 'details' in error ? error.details : undefined;
        
        throw new DatabaseError(
          `${String(this.tableName)} operation failed: ${errorMessage}`,
          { 
            ...context, 
            table: String(this.tableName),
            supabaseError: error,
            errorCode,
            errorDetails
          }
        );
      }

      return data;
    };

    if (this.enableRetry) {
      return retry(executeOperation, RetryDecorators.database({
        onRetry: (error, attempt, delay) => {
          console.warn(
            `[${String(this.tableName)}] Database operation failed (attempt ${attempt}), retrying in ${delay}ms`,
            { error: error instanceof Error ? error.message : error, context }
          );
        }
      })) as Promise<T>;
    } else {
      return executeOperation() as Promise<T>;
    }
  }

  /**
   * Apply filters to a query builder
   */
  protected applyFilters(
    query: SupabaseQuery,
    filters: FilterCondition[]
  ): SupabaseQuery {
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
    query: SupabaseQuery,
    options: QueryOptions = {}
  ): SupabaseQuery {
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
      .from(this.tableName as string)
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
    let query = this.client.from(this.tableName as string);
    
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
      .from(this.tableName as string)
      .insert(data as unknown)
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
      .from(this.tableName as string)
      .insert(data as unknown)
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
      .from(this.tableName as string)
      .update(data as unknown)
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
      .from(this.tableName as string)
      .update(data as unknown)
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
      .from(this.tableName as string)
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
    let query = this.client.from(this.tableName as string).delete();

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
      .from(this.tableName as string)
      .select('*', { count: 'exact', head: true });

    // Apply filters
    query = this.applyFilters(query, filters);

    const result = await this.executeQuery(
      () => query,
      { operation: 'count', filters, ...options.context }
    );

    return (result as unknown as number) || 0;
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
  public async rpc<T = unknown>(
    functionName: string,
    parameters: Record<string, unknown> = {},
    options: QueryOptions = {}
  ): Promise<T> {
    const result = await this.executeQuery(
      () => this.client.rpc(functionName as string, parameters),
      { operation: 'rpc', functionName, parameters, ...options.context }
    );

    return result as T;
  }
}

import * as React from 'react';
// Type definitions for PostgREST responses and builders
// Based on Supabase PostgrestBuilder patterns and TypeScript best practices

export interface PostgrestResponse<T> {
  data: T | null;
  error: PostgrestError | null;
  count?: number | null;
  status: number;
  statusText: string;
}

export interface PostgrestResponseSuccess<T> extends PostgrestResponse<T> {
  data: T;
  error: null;
}

export interface PostgrestResponseFailure extends PostgrestResponse<never> {
  data: null;
  error: PostgrestError;
}

export interface PostgrestError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

export interface PostgrestBuilder<T, R = any> {
  then<TResult1 = PostgrestResponse<T>, TResult2 = never>(
    onfulfilled?:
      | ((value: PostgrestResponse<T>) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2>;

  // Common PostgrestBuilder methods
  select(columns?: string): PostgrestBuilder<T[], R>;
  insert(value: Partial<T>): PostgrestBuilder<T[], R>;
  update(value: Partial<T>): PostgrestBuilder<T[], R>;
  delete(): PostgrestBuilder<T[], R>;

  // Filters
  eq(column: string, value: any): PostgrestBuilder<T, R>;
  neq(column: string, value: any): PostgrestBuilder<T, R>;
  gt(column: string, value: any): PostgrestBuilder<T, R>;
  gte(column: string, value: any): PostgrestBuilder<T, R>;
  lt(column: string, value: any): PostgrestBuilder<T, R>;
  lte(column: string, value: any): PostgrestBuilder<T, R>;
  like(column: string, pattern: string): PostgrestBuilder<T, R>;
  ilike(column: string, pattern: string): PostgrestBuilder<T, R>;
  is(column: string, value: any): PostgrestBuilder<T, R>;
  in(column: string, values: any[]): PostgrestBuilder<T, R>;
  contains(column: string, value: any): PostgrestBuilder<T, R>;
  containedBy(column: string, value: any): PostgrestBuilder<T, R>;
  rangeGt(column: string, value: any): PostgrestBuilder<T, R>;
  rangeGte(column: string, value: any): PostgrestBuilder<T, R>;
  rangeLt(column: string, value: any): PostgrestBuilder<T, R>;
  rangeLte(column: string, value: any): PostgrestBuilder<T, R>;
  rangeAdjacent(column: string, value: any): PostgrestBuilder<T, R>;
  overlaps(column: string, value: any): PostgrestBuilder<T, R>;
  textSearch(
    column: string,
    query: string,
    config?: string
  ): PostgrestBuilder<T, R>;

  // Modifiers
  order(
    column: string,
    options?: { ascending?: boolean; nullsFirst?: boolean }
  ): PostgrestBuilder<T, R>;
  limit(count: number): PostgrestBuilder<T, R>;
  range(from: number, to: number): PostgrestBuilder<T, R>;
  single(): PostgrestBuilder<T, R>;
  maybeSingle(): PostgrestBuilder<T | null, R>;
}

// Utility types for common database operations
export type PostgrestFilterBuilder<T> = PostgrestBuilder<T>;

// Re-export for backward compatibility
export type { PostgrestResponse as SupabaseResponse };
export type { PostgrestError as SupabaseError };

/**
 * Diagnostics Channel implementation for enhanced observability
 * Following Node.js v24.4.1 best practices for application tracing
 */

import * as diagnostics_channel from 'node:diagnostics_channel';

// Create named channels for different parts of the application
export const flightSearchChannel = diagnostics_channel.channel('parker-flight:flight-search');
export const duffelApiChannel = diagnostics_channel.channel('parker-flight:duffel-api');
export const databaseChannel = diagnostics_channel.channel('parker-flight:database');
export const authChannel = diagnostics_channel.channel('parker-flight:auth');
export const metricsChannel = diagnostics_channel.channel('parker-flight:metrics');

// Create tracing channels for structured operation tracking
export const flightSearchTracing = diagnostics_channel.tracingChannel('parker-flight:flight-search');
export const apiCallTracing = diagnostics_channel.tracingChannel('parker-flight:api-call');

// Type definitions for diagnostic messages
export interface FlightSearchMessage {
  tripRequestId: string;
  userId?: string;
  searchParams: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
  };
  timestamp: string;
  duration?: number;
  resultCount?: number;
  error?: string;
}

export interface DuffelApiMessage {
  endpoint: string;
  method: string;
  requestId: string;
  userId?: string;
  timestamp: string;
  duration?: number;
  statusCode?: number;
  error?: string;
  rateLimitRemaining?: number;
}

export interface DatabaseMessage {
  operation: 'read' | 'write' | 'update' | 'delete';
  table: string;
  query?: string;
  userId?: string;
  timestamp: string;
  duration?: number;
  rowsAffected?: number;
  error?: string;
}

export interface AuthMessage {
  operation: 'login' | 'logout' | 'token_refresh' | 'permission_check';
  userId: string;
  timestamp: string;
  success: boolean;
  error?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface MetricsMessage {
  type: 'counter' | 'gauge' | 'histogram';
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp: string;
}

// Utility functions for publishing diagnostic messages
export function publishFlightSearch(message: FlightSearchMessage) {
  if (flightSearchChannel.hasSubscribers) {
    flightSearchChannel.publish(message);
  }
}

export function publishDuffelApi(message: DuffelApiMessage) {
  if (duffelApiChannel.hasSubscribers) {
    duffelApiChannel.publish(message);
  }
}

export function publishDatabase(message: DatabaseMessage) {
  if (databaseChannel.hasSubscribers) {
    databaseChannel.publish(message);
  }
}

export function publishAuth(message: AuthMessage) {
  if (authChannel.hasSubscribers) {
    authChannel.publish(message);
  }
}

export function publishMetrics(message: MetricsMessage) {
  if (metricsChannel.hasSubscribers) {
    metricsChannel.publish(message);
  }
}

// Utility function to trace API calls with structured logging
export function traceApiCall<T>(
  name: string,
  fn: () => Promise<T>,
  context: { userId?: string; requestId?: string; endpoint?: string } = {}
): Promise<T> {
  if (!apiCallTracing.hasSubscribers) {
    return fn();
  }

  return apiCallTracing.tracePromise(fn, {
    name,
    ...context,
    timestamp: new Date().toISOString()
  });
}

// Default console subscriber for debugging (can be disabled in production)
if (process.env.NODE_ENV !== 'production') {
  flightSearchChannel.subscribe((message: FlightSearchMessage) => {
    console.log('[FLIGHT_SEARCH]', JSON.stringify(message, null, 2));
  });

  duffelApiChannel.subscribe((message: DuffelApiMessage) => {
    console.log('[DUFFEL_API]', JSON.stringify(message, null, 2));
  });

  databaseChannel.subscribe((message: DatabaseMessage) => {
    console.log('[DATABASE]', JSON.stringify(message, null, 2));
  });

  authChannel.subscribe((message: AuthMessage) => {
    console.log('[AUTH]', JSON.stringify(message, null, 2));
  });

  metricsChannel.subscribe((message: MetricsMessage) => {
    console.log('[METRICS]', JSON.stringify(message, null, 2));
  });
}

// Example: Subscribe to tracing channels for structured operation tracking
if (process.env.NODE_ENV !== 'production') {
  apiCallTracing.subscribe({
    start(message) {
      console.log('[API_TRACE_START]', JSON.stringify(message, null, 2));
    },
    end(message) {
      console.log('[API_TRACE_END]', JSON.stringify(message, null, 2));
    },
    asyncStart(message) {
      console.log('[API_TRACE_ASYNC_START]', JSON.stringify(message, null, 2));
    },
    asyncEnd(message) {
      console.log('[API_TRACE_ASYNC_END]', JSON.stringify(message, null, 2));
    },
    error(message) {
      console.log('[API_TRACE_ERROR]', JSON.stringify(message, null, 2));
    }
  });
}

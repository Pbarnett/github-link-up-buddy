import * as React from 'react';
/**
 * Type-Safe API Client Implementation
 * Advanced TypeScript patterns for API communication
 */

import type {
  ApiClient,
  ApiEndpoints,
  ApiRequestType,
  ApiResponseType,
  ApiMethodType,
  ApiRequestConfig,
  ApiErrorResponse,
  HttpStatusCode,
} from '../types/api.types';
import type { Result, ISODateString } from '../types';
import {
  isSuccessResult,
  isErrorResult,
  assertDefined,
  isObject,
  isString,
} from '../utils/type-guards';

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  defaultHeaders: Record<string, string>;
  retryPolicy: {
    attempts: number;
    delay: number;
    backoffMultiplier: number;
    retryableStatusCodes: HttpStatusCode[];
  };
  interceptors: {
    request: Array<
      (config: ApiRequestConfig) => ApiRequestConfig | Promise<ApiRequestConfig>
    >;
    response: Array<(response: any) => any | Promise<any>>;
    error: Array<(error: any) => any | Promise<any>>;
  };
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode?: HttpStatusCode,
    public readonly response?: any,
    public readonly requestId?: string
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export class NetworkError extends ApiClientError {
  constructor(
    message: string,
    public readonly originalError: Error
  ) {
    super('NETWORK_ERROR', message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiClientError {
  constructor(timeout: number) {
    super('TIMEOUT_ERROR', `Request timed out after ${timeout}ms`);
    this.name = 'TimeoutError';
  }
}

export class ValidationError extends ApiClientError {
  constructor(
    message: string,
    public readonly validationErrors: string[]
  ) {
    super('VALIDATION_ERROR', message);
    this.name = 'ValidationError';
  }
}

// ============================================================================
// REQUEST BUILDER
// ============================================================================

class RequestBuilder<T extends keyof ApiEndpoints> {
  private config: Partial<ApiRequestConfig> = {};

  constructor(
    private endpoint: T,
    private method: ApiMethodType<T>,
    private baseConfig: ApiClientConfig
  ) {}

  headers(headers: Record<string, string>): this {
    this.config.headers = { ...this.config.headers, ...headers };
    return this;
  }

  timeout(ms: number): this {
    this.config.timeout = ms;
    return this;
  }

  retry(attempts: number, delay?: number): this {
    this.config.retry = {
      attempts,
      delay: delay ?? this.baseConfig.retryPolicy.delay,
      backoff: 'exponential',
    };
    return this;
  }

  params(params: Record<string, string | number | boolean>): this {
    this.config.params = params;
    return this;
  }

  build(): ApiRequestConfig {
    return {
      method: this.method,
      url: this.buildUrl(),
      headers: {
        ...this.baseConfig.defaultHeaders,
        ...this.config.headers,
      },
      timeout: this.config.timeout ?? this.baseConfig.timeout,
      retry: this.config.retry ?? this.baseConfig.retryPolicy,
      params: this.config.params,
    };
  }

  private buildUrl(): string {
    let url = `${this.baseConfig.baseURL}${this.endpoint}`;

    // Replace path parameters
    if (this.config.params) {
      for (const [key, value] of Object.entries(this.config.params)) {
        url = url.replace(`{${key}}`, String(value));
      }
    }

    return url;
  }
}

// ============================================================================
// RESPONSE TRANSFORMER
// ============================================================================

class ResponseTransformer {
  static async transform<T>(
    response: Response,
    requestId: string
  ): Promise<Result<T, ApiErrorResponse>> {
    try {
      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          success: false,
          error: {
            error: {
              code: data.error?.code ?? 'HTTP_ERROR',
              message: data.error?.message ?? response.statusText,
              details: data.error?.details,
              timestamp: new Date().toISOString() as ISODateString,
              requestId,
            },
            success: false,
          },
        };
      }

      return {
        success: true,
        data: data as T,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          error: {
            code: 'PARSE_ERROR',
            message: 'Failed to parse response',
            timestamp: new Date().toISOString() as ISODateString,
            requestId,
          },
          success: false,
        },
      };
    }
  }
}

// ============================================================================
// RETRY MECHANISM
// ============================================================================

class RetryHandler {
  static async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: ApiRequestConfig['retry']
  ): Promise<T> {
    let lastError: Error;
    let delay = config?.delay ?? 1000;

    for (let attempt = 1; attempt <= (config?.attempts ?? 1); attempt++) {
      try {
        return await operation()();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on the last attempt
        if (attempt === (config?.attempts ?? 1)) {
          break;
        }

        // Check if error is retryable
        if (error instanceof ApiClientError) {
          if (
            error.statusCode &&
            !this.isRetryableStatusCode(error.statusCode, config)
          ) {
            break;
          }
        }

        // Wait before retrying
        await this.sleep(delay);

        // Apply backoff
        if (config?.backoff === 'exponential') {
          delay *= 2;
        }
      }
    }

    throw lastError!;
  }

  private static isRetryableStatusCode(
    statusCode: HttpStatusCode,
    config: ApiRequestConfig['retry']
  ): boolean {
    const retryableCodes = [429, 500, 502, 503, 504]; // Default retryable codes
    return retryableCodes.includes(statusCode);
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// API CLIENT IMPLEMENTATION
// ============================================================================

export class TypeSafeApiClient implements ApiClient {
  private requestId = 0;

  constructor(private config: ApiClientConfig) {}

  /**
   * Generic request method with full type safety
   */
  async request<T extends keyof ApiEndpoints>(
    endpoint: T,
    options?: Omit<ApiRequestConfig, 'method' | 'url'> & {
      body?: ApiRequestType<T>;
      params?: Record<string, string | number>;
    }
  ): Promise<Result<ApiResponseType<T>, ApiErrorResponse>> {
    const requestId = this.generateRequestId();

    try {
      // Build request configuration
      const requestConfig = this.buildRequestConfig(endpoint, options);

      // Apply request interceptors
      const finalConfig = await this.applyRequestInterceptors(requestConfig);

      // Execute request with retry
      const result = await RetryHandler.executeWithRetry(
        () =>
          this.executeRequest<ApiResponseType<T>>(
            finalConfig,
            options?.body,
            requestId
          ),
        finalConfig.retry
      );

      // Apply response interceptors
      return await this.applyResponseInterceptors(result);
    } catch (error) {
      // Apply error interceptors
      const processedError = await this.applyErrorInterceptors(error);

      if (processedError instanceof ApiClientError) {
        return {
          success: false,
          error: {
            error: {
              code: processedError.code,
              message: processedError.message,
              timestamp: new Date().toISOString() as ISODateString,
              requestId,
            },
            success: false,
          },
        };
      }

      throw processedError;
    }
  }

  /**
   * GET request
   */
  async get<T extends keyof ApiEndpoints>(
    endpoint: T,
    params?: Record<string, string | number>
  ): Promise<Result<ApiResponseType<T>, ApiErrorResponse>> {
    return this.request(endpoint, { params });
  }

  /**
   * POST request
   */
  async post<T extends keyof ApiEndpoints>(
    endpoint: T,
    body: ApiRequestType<T>,
    config?: Omit<Partial<ApiRequestConfig>, 'method' | 'url'>
  ): Promise<Result<ApiResponseType<T>, ApiErrorResponse>> {
    const { params, ...restConfig } = config ?? {};
    return this.request(endpoint, {
      ...restConfig,
      body,
      params: params
        ? Object.fromEntries(
            Object.entries(params).map(([k, v]) => [k, String(v)])
          )
        : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T extends keyof ApiEndpoints>(
    endpoint: T,
    body: ApiRequestType<T>
  ): Promise<Result<ApiResponseType<T>, ApiErrorResponse>> {
    return this.request(endpoint, { body });
  }

  /**
   * DELETE request
   */
  async delete<T extends keyof ApiEndpoints>(
    endpoint: T
  ): Promise<Result<ApiResponseType<T>, ApiErrorResponse>> {
    return this.request(endpoint);
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private buildRequestConfig<T extends keyof ApiEndpoints>(
    endpoint: T,
    options?: any
  ): ApiRequestConfig {
    // This would need to be enhanced to dynamically determine the HTTP method
    // based on the endpoint definition. For now, we'll use a simple mapping.
    const method = this.getHttpMethod(endpoint);

    return new RequestBuilder(endpoint, method, this.config)
      .headers(options?.headers ?? {})
      .timeout(options?.timeout)
      .params(options?.params)
      .build();
  }

  private getHttpMethod<T extends keyof ApiEndpoints>(
    endpoint: T
  ): ApiMethodType<T> {
    // This is a simplified implementation. In a real application,
    // you would have a mapping of endpoints to HTTP methods.
    const endpointStr = String(endpoint);
    if (endpointStr.includes('/login') || endpointStr.includes('/logout')) {
      return 'POST' as ApiMethodType<T>;
    }
    if (endpointStr.includes('{') && endpointStr.includes('}')) {
      return 'GET' as ApiMethodType<T>;
    }
    return 'GET' as ApiMethodType<T>;
  }

  private async executeRequest<T>(
    config: ApiRequestConfig,
    body?: any,
    requestId?: string
  ): Promise<Result<T, ApiErrorResponse>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const fetchOptions: RequestInit = {
        method: config.method,
        headers: config.headers,
        signal: controller.signal,
      };

      if (
        body &&
        (config.method === 'POST' ||
          config.method === 'PUT' ||
          config.method === 'PATCH')
      ) {
        fetchOptions.body = JSON.stringify(body);
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Content-Type': 'application/json',
        };
      }

      const response = await fetch(config.url, fetchOptions);
      return await ResponseTransformer.transform<T>(
        response,
        requestId ?? 'unknown'
      );
    } catch (error) {
      if ((error as any).name === 'AbortError') {
        throw new TimeoutError(config.timeout ?? 5000);
      }

      throw new NetworkError('Network request failed', error as Error);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async applyRequestInterceptors(
    config: ApiRequestConfig
  ): Promise<ApiRequestConfig> {
    let finalConfig = config;

    for (const interceptor of this.config.interceptors.request) {
      finalConfig = await interceptor(finalConfig);
    }

    return finalConfig;
  }

  private async applyResponseInterceptors<T>(
    response: Result<T, ApiErrorResponse>
  ): Promise<Result<T, ApiErrorResponse>> {
    const finalResponse = response;

    for (const interceptor of this.config.interceptors.response) {
      if (isSuccessResult(finalResponse)) {
        finalResponse.data = await interceptor(finalResponse.data);
      }
    }

    return finalResponse;
  }

  private async applyErrorInterceptors(error: any): Promise<any> {
    let finalError = error;

    for (const interceptor of this.config.interceptors.error) {
      finalError = await interceptor(finalError);
    }

    return finalError;
  }

  private generateRequestId(): string {
    return `req_${++this.requestId}_${Date.now()}`;
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a configured API client instance
 */
export const createApiClient = (
  baseURL: string,
  options?: Partial<ApiClientConfig>
): TypeSafeApiClient => {
  const defaultConfig: ApiClientConfig = {
    baseURL,
    timeout: 30000,
    defaultHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    retryPolicy: {
      attempts: 3,
      delay: 1000,
      backoffMultiplier: 2,
      retryableStatusCodes: [429, 500, 502, 503, 504],
    },
    interceptors: {
      request: [],
      response: [],
      error: [],
    },
  };

  const config = { ...defaultConfig, ...options };
  return new TypeSafeApiClient(config);
};

/**
 * Create API client with authentication
 */
export const createAuthenticatedApiClient = (
  baseURL: string,
  getToken: () => string | null,
  options?: Partial<ApiClientConfig>
): TypeSafeApiClient => {
  const client = createApiClient(baseURL, options);

  // Add authentication interceptor
  (client as any)['config'].interceptors.request.push(
    (config: ApiRequestConfig) => {
      const token = getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    }
  );

  return client;
};

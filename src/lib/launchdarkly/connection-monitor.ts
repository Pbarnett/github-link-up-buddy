import * as React from 'react';
import { useState, useEffect, use } from 'react';
/**
 * LaunchDarkly Connection Monitoring and Health Check System
 * Real-time monitoring of SDK connections with retry logic and fallback mechanisms
 */

import { LDClient } from '@launchdarkly/node-server-sdk';
import { FlagErrorHandler, FlagErrorType } from './error-handler';
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  FAILED = 'failed',
}

export interface ConnectionHealth {
  state: ConnectionState;
  lastConnected: number | null;
  lastDisconnected: number | null;
  connectionAttempts: number;
  successfulConnections: number;
  failedConnections: number;
  averageLatency: number;
  uptime: number;
  downtime: number;
  lastHealthCheck: number;
}

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
}

/**
 * Connection monitoring system for LaunchDarkly SDKs
 */
export class ConnectionMonitor {
  private static instance: ConnectionMonitor | null = null;
  private health: ConnectionHealth;
  private retryConfig: RetryConfig;
  private client: LDClient | null = null;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private retryTimeout: NodeJS.Timeout | null = null;
  private listeners: Map<string, (health: ConnectionHealth) => void> =
    new Map();

  private constructor() {
    this.health = {
      state: ConnectionState.DISCONNECTED,
      lastConnected: null,
      lastDisconnected: null,
      connectionAttempts: 0,
      successfulConnections: 0,
      failedConnections: 0,
      averageLatency: 0,
      uptime: 0,
      downtime: 0,
      lastHealthCheck: Date.now(),
    };

    this.retryConfig = {
      maxRetries: parseInt(process.env.LD_MAX_RETRIES || '5'),
      initialDelay: parseInt(process.env.LD_INITIAL_RETRY_DELAY || '1000'),
      maxDelay: parseInt(process.env.LD_MAX_RETRY_DELAY || '30000'),
      backoffMultiplier: parseFloat(process.env.LD_BACKOFF_MULTIPLIER || '2'),
      jitter: process.env.LD_RETRY_JITTER !== 'false',
    };
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ConnectionMonitor {
    if (!this.instance) {
      this.instance = new ConnectionMonitor();
    }
    return this.instance;
  }

  /**
   * Register LaunchDarkly client for monitoring
   */
  registerClient(client: LDClient): void {
    this.client = client;
    this.setupClientListeners();
    this.startMonitoring();
  }

  /**
   * Setup event listeners for the LaunchDarkly client
   */
  private setupClientListeners(): void {
    if (!this.client) return;

    // Connection established
    this.client.on('ready', () => {
      this.updateConnectionState(ConnectionState.CONNECTED);
      this.health.successfulConnections++;
      this.health.lastConnected = Date.now();
      this.notifyListeners();
    });

    // Connection lost
    this.client.on('offline', () => {
      this.updateConnectionState(ConnectionState.DISCONNECTED);
      this.health.lastDisconnected = Date.now();
      this.scheduleReconnection();
      this.notifyListeners();
    });

    // Error occurred
    this.client.on('error', (error: Error) => {
      this.updateConnectionState(ConnectionState.FAILED);
      this.health.failedConnections++;
      FlagErrorHandler.handleNetworkError(error, 'client_connection');
      this.scheduleReconnection();
      this.notifyListeners();
    });

    // Data update received
    this.client.on('update', () => {
      // Update latency measurement if we have timing data
      this.measureLatency();
    });
  }

  /**
   * Start continuous monitoring
   */
  private startMonitoring(): void {
    if (this.monitoringInterval) return;

    const interval = parseInt(process.env.LD_HEALTH_CHECK_INTERVAL || '30000');

    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
    }, interval);
  }

  /**
   * Perform health check
   */
  private async performHealthCheck(): Promise<void> {
    const now = Date.now();
    this.health.lastHealthCheck = now;

    if (!this.client) {
      this.updateConnectionState(ConnectionState.FAILED);
      return;
    }

    try {
      // Check if client is initialized
      const isInitialized = this.client.initialized?.();

      if (!isInitialized) {
        this.updateConnectionState(ConnectionState.CONNECTING);
        await this.client.waitForInitialization(5000);
      }

      // Update uptime/downtime
      this.updateUptimeMetrics(now);

      // Test connection with a lightweight operation
      await this.testConnection();

      if (this.health.state !== ConnectionState.CONNECTED) {
        this.updateConnectionState(ConnectionState.CONNECTED);
        this.notifyListeners();
      }
    } catch (error) {
      this.updateConnectionState(ConnectionState.FAILED);
      this.health.failedConnections++;
      FlagErrorHandler.handleNetworkError(error as Error, 'health_check');
      this.scheduleReconnection();
      this.notifyListeners();
    }
  }

  /**
   * Test connection with a lightweight operation
   */
  private async testConnection(): Promise<void> {
    if (!this.client) throw new Error('Client not available');

    const startTime = performance.now();

    // Use allFlagsState as a lightweight test
    await this.client.allFlagsState({ key: 'health-check', kind: 'user' });

    const latency = performance.now() - startTime;
    this.updateLatencyMetrics(latency);
  }

  /**
   * Measure latency for data updates
   */
  private measureLatency(): void {
    // This would ideally measure the time between flag change and local update
    // For now, we'll use a simplified approach
    const latency = Math.random() * 100 + 50; // Placeholder
    this.updateLatencyMetrics(latency);
  }

  /**
   * Update latency metrics
   */
  private updateLatencyMetrics(latency: number): void {
    const count = this.health.successfulConnections;
    if (count === 0) {
      this.health.averageLatency = latency;
    } else {
      this.health.averageLatency =
        (this.health.averageLatency * count + latency) / (count + 1);
    }
  }

  /**
   * Update uptime/downtime metrics
   */
  private updateUptimeMetrics(now: number): void {
    if (this.health.state === ConnectionState.CONNECTED) {
      if (this.health.lastConnected) {
        this.health.uptime +=
          now -
          Math.max(this.health.lastConnected, this.health.lastHealthCheck);
      }
    } else {
      if (this.health.lastDisconnected) {
        this.health.downtime +=
          now -
          Math.max(this.health.lastDisconnected, this.health.lastHealthCheck);
      }
    }
  }

  /**
   * Update connection state
   */
  private updateConnectionState(state: ConnectionState): void {
    this.health.state = state;

    // Log state changes
    console.log(`[LaunchDarkly] Connection state changed to: ${state}`);

    // Emit custom events for monitoring systems
    if (
      typeof (
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
      ) !== 'undefined'
    ) {
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.dispatchEvent(
        new CustomEvent('launchdarkly:connection:state', {
          detail: { state, health: this.health },
        })
      );
    }
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  private scheduleReconnection(): void {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    if (this.health.connectionAttempts >= this.retryConfig.maxRetries) {
      console.error('[LaunchDarkly] Maximum reconnection attempts reached');
      this.updateConnectionState(ConnectionState.FAILED);
      return;
    }

    this.health.connectionAttempts++;

    const _delay = this.calculateRetryDelay();

    console.log(
      `[LaunchDarkly] Scheduling reconnection attempt ${this.health.connectionAttempts} in ${delay}ms`
    );

    this.retryTimeout = setTimeout(() => {
      this.attemptReconnection();
    }, delay);
  }

  /**
   * Calculate retry delay with exponential backoff and jitter
   */
  private calculateRetryDelay(): number {
    const exponentialDelay = Math.min(
      this.retryConfig.initialDelay *
        Math.pow(
          this.retryConfig.backoffMultiplier,
          this.health.connectionAttempts - 1
        ),
      this.retryConfig.maxDelay
    );

    if (!this.retryConfig.jitter) {
      return exponentialDelay;
    }

    // Add jitter (±25% of delay)
    const jitter = exponentialDelay * 0.25;
    return exponentialDelay + (Math.random() * jitter * 2 - jitter);
  }

  /**
   * Attempt to reconnect
   */
  private async attemptReconnection(): Promise<void> {
    if (!this.client) return;

    this.updateConnectionState(ConnectionState.RECONNECTING);
    this.notifyListeners();

    try {
      // For server-side SDK, we might need to reinitialize
      await this.client.waitForInitialization(10000);

      this.health.connectionAttempts = 0; // Reset on successful connection
      this.updateConnectionState(ConnectionState.CONNECTED);
      this.health.successfulConnections++;
      this.health.lastConnected = Date.now();
      this.notifyListeners();
    } catch (error) {
      this.health.failedConnections++;
      FlagErrorHandler.handleNetworkError(error as Error, 'reconnection');
      this.scheduleReconnection();
    }
  }

  /**
   * Add health status listener
   */
  addListener(id: string, callback: (health: ConnectionHealth) => void): void {
    this.listeners.set(id, callback);
  }

  /**
   * Remove health status listener
   */
  removeListener(id: string): void {
    this.listeners.delete(id);
  }

  /**
   * Notify all listeners of health changes
   */
  private notifyListeners(): void {
    for (const [id, callback] of this.listeners.entries()) {
      try {
        callback({ ...this.health });
      } catch (_error) {
        console.warn(`[LaunchDarkly] Error notifying listener ${id}:`, error);
      }
    }
  }

  /**
   * Get current health status
   */
  getHealth(): ConnectionHealth {
    return { ...this.health };
  }

  /**
   * Check if connection is healthy
   */
  isHealthy(): boolean {
    const now = Date.now();
    const maxTimeSinceLastCheck = parseInt(
      process.env.LD_MAX_TIME_SINCE_CHECK || '60000'
    );

    return (
      this.health.state === ConnectionState.CONNECTED &&
      now - this.health.lastHealthCheck < maxTimeSinceLastCheck &&
      this.health.averageLatency <
        parseInt(process.env.LD_MAX_LATENCY || '1000')
    );
  }

  /**
   * Force immediate health check
   */
  async checkHealth(): Promise<ConnectionHealth> {
    await this.performHealthCheck();
    return this.getHealth();
  }

  /**
   * Reset connection statistics
   */
  resetStats(): void {
    this.health.connectionAttempts = 0;
    this.health.successfulConnections = 0;
    this.health.failedConnections = 0;
    this.health.averageLatency = 0;
    this.health.uptime = 0;
    this.health.downtime = 0;
  }

  /**
   * Update retry configuration
   */
  updateRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  /**
   * Stop monitoring and cleanup
   */
  shutdown(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }

    this.listeners.clear();
    this.client = null;
    this.updateConnectionState(ConnectionState.DISCONNECTED);
  }
}

/**
 * Health check utility for external monitoring
 */
export async function performLaunchDarklyHealthCheck(): Promise<{
  healthy: boolean;
  status: ConnectionHealth;
  timestamp: number;
}> {
  const monitor = ConnectionMonitor.getInstance();
  const status = await monitor.checkHealth();

  return {
    healthy: monitor.isHealthy(),
    status,
    timestamp: Date.now(),
  };
}

/**
 * React hook for connection monitoring
 */
export function useLaunchDarklyHealth() {
  if (
    typeof (
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
    ) === 'undefined'
  ) {
    return {
      health: ConnectionMonitor.getInstance().getHealth(),
      isHealthy: ConnectionMonitor.getInstance().isHealthy(),
    };
  }

  const [health, setHealth] = React.useState(
    ConnectionMonitor.getInstance().getHealth()
  );
  const [isHealthy, setIsHealthy] = React.useState(
    ConnectionMonitor.getInstance().isHealthy()
  );

  React.useEffect(() => {
    const monitor = ConnectionMonitor.getInstance();
    const listenerId = `react-hook-${Date.now()}`;

    monitor.addListener(listenerId, newHealth => {
      setHealth(newHealth);
      setIsHealthy(monitor.isHealthy());
    });

    return () => {
      monitor.removeListener(listenerId);
    };
  }, []);

  return { health, isHealthy };
}

// Export singleton instance
export const connectionMonitor = ConnectionMonitor.getInstance();

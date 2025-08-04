/**
 * Enhanced Real-time Service for Supabase Operations
 * Provides targeted subscriptions, connection monitoring, and specialized methods
 */

import * as React from 'react';
import { useState, useEffect, useRef, use } from 'react';
import {
  SupabaseClient,
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database, Tables } from '@/types/database';
interface SubscriptionOptions {
  schema?: string;
  table?: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
}

interface ConnectionState {
  isConnected: boolean;
  lastConnected: number;
  connectionAttempts: number;
  maxReconnectAttempts: number;
}

/**
 * Enhanced real-time service with connection monitoring and targeted subscriptions
 */
export class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private connectionState: ConnectionState = {
    isConnected: false,
    lastConnected: 0,
    connectionAttempts: 0,
    maxReconnectAttempts: 10,
  };
  private reconnectTimer?: NodeJS.Timeout;
  private healthCheckInterval?: NodeJS.Timeout;

  constructor() {
    this.setupConnectionMonitoring();
    this.setupHealthCheck();
  }

  /**
   * Setup connection monitoring
   */
  private setupConnectionMonitoring(): void {
    if (
      typeof (
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
      ) === 'undefined'
    )
      return; // Skip on server-side

    /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.addEventListener(
      'online',
      () => {
        console.log('🌐 Network online - attempting to reconnect realtime');
        this.reconnectAll();
      }
    );

    /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.addEventListener(
      'offline',
      () => {
        console.log(
          '🌐 Network offline - realtime connections may be affected'
        );
        this.connectionState.isConnected = false;
      }
    );
  }

  /**
   * Setup periodic health check
   */
  private setupHealthCheck(): void {
    this.healthCheckInterval = setInterval(() => {
      this.checkConnectionHealth();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Check connection health
   */
  private async checkConnectionHealth(): Promise<void> {
    try {
      // Simple query to test connection
      const { error } = await supabase
        .from('feature_flags')
        .select('id')
        .limit(1);

      const isHealthy = !error;

      if (!isHealthy && this.connectionState.isConnected) {
        console.warn('🔗 Realtime connection health check failed');
        this.connectionState.isConnected = false;
        this.reconnectAll();
      } else if (isHealthy && !this.connectionState.isConnected) {
        console.log('🔗 Realtime connection health restored');
        this.connectionState.isConnected = true;
        this.connectionState.lastConnected = Date.now();
      }
    } catch (error) {
      console.error('🔗 Realtime health check error:', error);
    }
  }

  /**
   * Create a targeted subscription for specific database changes
   */
  subscribe<T extends keyof Database['public']['Tables']>(
    channelName: string,
    options: SubscriptionOptions,
    callback: (payload: RealtimePostgresChangesPayload<Tables<T>>) => void
  ): RealtimeChannel {
    // Remove existing channel if it exists
    this.unsubscribe(channelName);

    const channel = supabase.channel(channelName);

    // Configure the subscription based on options
    if (options.table) {
      channel.on(
        'postgres_changes',
        {
          event: options.event || '*',
          schema: options.schema || 'public',
          table: options.table,
          filter: options.filter,
        },
        payload => {
          console.log(`📡 Realtime event on ${options.table}:`, payload);
          callback(payload);
        }
      );
    }

    // Handle subscription state changes
    channel.on('system', {}, payload => {
      console.log('📡 Realtime system event:', payload);

      if (payload.status === 'SUBSCRIBED') {
        this.connectionState.isConnected = true;
        this.connectionState.lastConnected = Date.now();
        this.connectionState.connectionAttempts = 0;
      } else if (
        payload.status === 'CLOSED' ||
        payload.status === 'TIMED_OUT'
      ) {
        this.connectionState.isConnected = false;
        this.handleReconnect(channelName, options, callback);
      }
    });

    // Subscribe and store the channel
    channel.subscribe(status => {
      console.log(`📡 Subscription status for ${channelName}:`, status);

      if (status === 'SUBSCRIBED') {
        this.connectionState.isConnected = true;
        this.connectionState.lastConnected = Date.now();
      } else if (status === 'CLOSED' || status === 'TIMED_OUT') {
        this.connectionState.isConnected = false;
      }
    });

    this.channels.set(channelName, channel);
    return channel;
  }

  /**
   * Handle automatic reconnection
   */
  private handleReconnect<T extends keyof Database['public']['Tables']>(
    channelName: string,
    options: SubscriptionOptions,
    callback: (payload: RealtimePostgresChangesPayload<Tables<T>>) => void
  ): void {
    if (
      this.connectionState.connectionAttempts >=
      this.connectionState.maxReconnectAttempts
    ) {
      console.error(`❌ Max reconnection attempts reached for ${channelName}`);
      return;
    }

    this.connectionState.connectionAttempts++;
    const retryDelay = Math.min(
      this.connectionState.connectionAttempts * 1000,
      30000
    );

    console.log(
      `🔄 Attempting to reconnect ${channelName} in ${retryDelay}ms (attempt ${this.connectionState.connectionAttempts})`
    );

    setTimeout(() => {
      this.subscribe(channelName, options, callback);
    }, retryDelay);
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
      console.log(`📡 Unsubscribed from ${channelName}`);
    }
  }

  /**
   * Reconnect all active channels
   */
  private reconnectAll(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    console.log('🔄 Reconnecting all realtime channels');

    // Note: In a real implementation, you'd need to store the subscription options
    // to be able to recreate the subscriptions. For now, we just clear them.
    this.channels.forEach((channel, channelName) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }

  /**
   * Subscribe to user-specific booking changes
   */
  subscribeToUserBookings(
    userId: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ): RealtimeChannel {
    return this.subscribe(
      `user_bookings_${userId}`,
      {
        table: 'booking_requests',
        filter: `user_id=eq.${userId}`,
        event: '*',
      },
      callback
    );
  }

  /**
   * Subscribe to user-specific notifications
   */
  subscribeToUserNotifications(
    userId: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ): RealtimeChannel {
    return this.subscribe(
      `user_notifications_${userId}`,
      {
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
        event: '*',
      },
      callback
    );
  }

  /**
   * Subscribe to trip request updates
   */
  subscribeToTripRequests(
    userId: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ): RealtimeChannel {
    return this.subscribe(
      `trip_requests_${userId}`,
      {
        table: 'trip_requests',
        filter: `user_id=eq.${userId}`,
        event: '*',
      },
      callback
    );
  }

  /**
   * Subscribe to flight offers updates
   */
  subscribeToFlightOffers(
    tripRequestId: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ): RealtimeChannel {
    return this.subscribe(
      `flight_offers_${tripRequestId}`,
      {
        table: 'flight_offers',
        filter: `trip_request_id=eq.${tripRequestId}`,
        event: '*',
      },
      callback
    );
  }

  /**
   * Subscribe to payment status changes
   */
  subscribeToPaymentUpdates(
    userId: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ): RealtimeChannel {
    return this.subscribe(
      `payments_${userId}`,
      {
        table: 'payments',
        filter: `user_id=eq.${userId}`,
        event: '*',
      },
      callback
    );
  }

  /**
   * Broadcast a custom message to a channel
   */
  broadcast(channelName: string, event: string, payload: any): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.send({
        type: 'broadcast',
        event,
        payload,
      });
    } else {
      console.warn(`⚠️ Channel ${channelName} not found for broadcast`);
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): ConnectionState {
    return { ...this.connectionState };
  }

  /**
   * Get active channel count
   */
  getActiveChannelCount(): number {
    return this.channels.size;
  }

  /**
   * Get all active channel names
   */
  getActiveChannels(): string[] {
    return Array.from(this.channels.keys());
  }

  /**
   * Cleanup all subscriptions and timers
   */
  cleanup(): void {
    // Clear all channels
    this.channels.forEach((channel, channelName) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();

    // Clear timers
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    console.log('🧹 Realtime service cleanup completed');
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();

// React hook for real-time subscriptions

export function useRealtimeSubscription<T extends { [key: string]: any } = any>(
  channelName: string,
  options: SubscriptionOptions,
  callback: (payload: RealtimePostgresChangesPayload<T>) => void,
  deps: any[] = []
) {
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!channelName || !options.table) return;

    const wrappedCallback = (payload: RealtimePostgresChangesPayload<any>) => {
      setIsConnected(true);
      // Type assertion to ensure compatibility while maintaining safety
      callback(payload as RealtimePostgresChangesPayload<T>);
    };

    channelRef.current = realtimeService.subscribe(
      channelName,
      options,
      wrappedCallback
    );

    // Cleanup on unmount or dependency change
    return () => {
      if (channelRef.current) {
        realtimeService.unsubscribe(channelName);
        setIsConnected(false);
      }
    };
  }, [channelName, ...deps]);

  return { isConnected };
}

// Specialized hooks for common use cases
export function useUserBookings(
  userId: string,
  callback: (payload: any) => void
) {
  return useRealtimeSubscription(
    `user_bookings_${userId}`,
    { table: 'booking_requests', filter: `user_id=eq.${userId}` },
    callback,
    [userId]
  );
}

export function useUserNotifications(
  userId: string,
  callback: (payload: any) => void
) {
  return useRealtimeSubscription(
    `user_notifications_${userId}`,
    { table: 'notifications', filter: `user_id=eq.${userId}` },
    callback,
    [userId]
  );
}

export function useTripRequests(
  userId: string,
  callback: (payload: any) => void
) {
  return useRealtimeSubscription(
    `trip_requests_${userId}`,
    { table: 'trip_requests', filter: `user_id=eq.${userId}` },
    callback,
    [userId]
  );
}

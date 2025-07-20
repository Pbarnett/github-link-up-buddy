

/**
 * Enhanced Real-time Service for Supabase
 * Implements targeted subscriptions and optimized connection management
 * Based on Supabase real-time documentation best practices
 */

import * as React from 'react';
const { useState, useEffect } = React;

import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Database } from '@/types/database';

type Tables = Database['public']['Tables'];
type TableName = keyof Tables;

interface SubscriptionConfig {
  table: TableName;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  schema?: string;
}

interface RealtimeSubscription {
  id: string;
  channel: RealtimeChannel;
  config: SubscriptionConfig;
  callback: (payload: RealtimePostgresChangesPayload<any>) => void;
  isActive: boolean;
}

class RealtimeService {
  private subscriptions = new Map<string, RealtimeSubscription>();
  private connectionStatus: 'CLOSED' | 'CONNECTING' | 'OPEN' = 'CLOSED';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseReconnectDelay = 1000; // 1 second

  constructor() {
    this.setupConnectionMonitoring();
  }

  /**
   * Subscribe to real-time database changes with targeted filters
   */
  subscribe<T extends TableName>(
    config: SubscriptionConfig & { table: T },
    callback: (payload: RealtimePostgresChangesPayload<Tables[T]['Row']>) => void
  ): string {
    const subscriptionId = this.generateSubscriptionId(config);
    
    // Check if subscription already exists
    if (this.subscriptions.has(subscriptionId)) {
      console.warn(`Subscription ${subscriptionId} already exists. Returning existing subscription.`);
      return subscriptionId;
    }

    // Create channel with optimized configuration
    const channelName = `${config.table}_${config.event}_${Date.now()}`;
    const channel = supabase.channel(channelName, {
      config: {
        presence: { key: '' }, // Disable presence if not needed
        broadcast: { self: false }, // Don't broadcast to self
      },
    });

    // Build postgres changes configuration
    const changesConfig: any = {
      event: config.event,
      schema: config.schema || 'public',
      table: config.table,
    };

    // Add filter if provided
    if (config.filter) {
      changesConfig.filter = config.filter;
    }

    // Set up the subscription
    channel
      .on('postgres_changes', changesConfig, (payload) => {
        console.log(`📡 Real-time update received for ${config.table}:`, payload);
        callback(payload);
      })
      .on('system', {}, (payload) => {
        console.log('🔌 Real-time system event:', payload);
        if (payload.status === 'CONNECTED') {
          this.connectionStatus = 'OPEN';
          this.reconnectAttempts = 0;
        } else if (payload.status === 'CLOSED') {
          this.connectionStatus = 'CLOSED';
          this.handleConnectionLoss();
        }
      })
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Successfully subscribed to ${config.table} changes`);
          this.connectionStatus = 'OPEN';
        } else if (status === 'CLOSED') {
          console.log(`❌ Subscription to ${config.table} closed`);
          this.connectionStatus = 'CLOSED';
        } else if (err) {
          console.error(`❌ Subscription error for ${config.table}:`, err);
        }
      });

    // Store subscription
    const subscription: RealtimeSubscription = {
      id: subscriptionId,
      channel,
      config,
      callback,
      isActive: true,
    };

    this.subscriptions.set(subscriptionId, subscription);
    
    console.log(`📡 Created real-time subscription: ${subscriptionId}`);
    return subscriptionId;
  }

  /**
   * Unsubscribe from a specific real-time subscription
   */
  unsubscribe(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    
    if (!subscription) {
      console.warn(`Subscription ${subscriptionId} not found`);
      return false;
    }

    // Unsubscribe from the channel
    supabase.removeChannel(subscription.channel);
    subscription.isActive = false;
    
    // Remove from tracking
    this.subscriptions.delete(subscriptionId);
    
    console.log(`📡 Unsubscribed from: ${subscriptionId}`);
    return true;
  }

  /**
   * Unsubscribe from all active subscriptions
   */
  unsubscribeAll(): void {
    const subscriptionIds = Array.from(this.subscriptions.keys());
    
    subscriptionIds.forEach(id => {
      this.unsubscribe(id);
    });

    console.log(`📡 Unsubscribed from all ${subscriptionIds.length} subscriptions`);
  }

  /**
   * Get subscription status
   */
  getSubscriptionStatus(subscriptionId: string): 'active' | 'inactive' | 'not_found' {
    const subscription = this.subscriptions.get(subscriptionId);
    
    if (!subscription) {
      return 'not_found';
    }
    
    return subscription.isActive ? 'active' : 'inactive';
  }

  /**
   * Get all active subscriptions
   */
  getActiveSubscriptions(): Array<{ id: string; config: SubscriptionConfig }> {
    return Array.from(this.subscriptions.values())
      .filter(sub => sub.isActive)
      .map(sub => ({ id: sub.id, config: sub.config }));
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): 'CLOSED' | 'CONNECTING' | 'OPEN' {
    return this.connectionStatus;
  }

  /**
   * Specialized subscription methods for common use cases
   */
  
  // Subscribe to user's booking updates
  subscribeToUserBookings(
    userId: string,
    callback: (payload: RealtimePostgresChangesPayload<Tables['bookings']['Row']>) => void
  ): string {
    return this.subscribe(
      {
        table: 'bookings',
        event: '*',
        filter: `user_id=eq.${userId}`,
      },
      callback
    );
  }

  // Subscribe to user's trip requests
  subscribeToUserTripRequests(
    userId: string,
    callback: (payload: RealtimePostgresChangesPayload<Tables['trip_requests']['Row']>) => void
  ): string {
    return this.subscribe(
      {
        table: 'trip_requests',
        event: '*',
        filter: `user_id=eq.${userId}`,
      },
      callback
    );
  }

  // Subscribe to user's notifications
  subscribeToUserNotifications(
    userId: string,
    callback: (payload: RealtimePostgresChangesPayload<Tables['notifications']['Row']>) => void
  ): string {
    return this.subscribe(
      {
        table: 'notifications',
        event: 'INSERT',
        filter: `user_id=eq.${userId}`,
      },
      callback
    );
  }

  // Subscribe to flight offers for a specific trip request
  subscribeToFlightOffers(
    tripRequestId: string,
    callback: (payload: RealtimePostgresChangesPayload<Tables['flight_offers_v2']['Row']>) => void
  ): string {
    return this.subscribe(
      {
        table: 'flight_offers_v2',
        event: 'INSERT',
        filter: `trip_request_id=eq.${tripRequestId}`,
      },
      callback
    );
  }

  // Subscribe to booking request status changes
  subscribeToBookingRequestStatus(
    bookingRequestId: string,
    callback: (payload: RealtimePostgresChangesPayload<Tables['booking_requests']['Row']>) => void
  ): string {
    return this.subscribe(
      {
        table: 'booking_requests',
        event: 'UPDATE',
        filter: `id=eq.${bookingRequestId}`,
      },
      callback
    );
  }

  /**
   * Private helper methods
   */
  private generateSubscriptionId(config: SubscriptionConfig): string {
    const filterPart = config.filter ? `_${config.filter.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
    return `${config.table}_${config.event}${filterPart}_${Date.now()}`;
  }

  private setupConnectionMonitoring(): void {
    // Monitor connection status periodically
    setInterval(() => {
      if (this.connectionStatus === 'CLOSED' && this.subscriptions.size > 0) {
        this.handleConnectionLoss();
      }
    }, 30000); // Check every 30 seconds
  }

  private async handleConnectionLoss(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached. Manual intervention required.');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Attempting to reconnect... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.reconnectAllSubscriptions();
    }, delay);
  }

  private async reconnectAllSubscriptions(): Promise<void> {
    const activeSubscriptions = Array.from(this.subscriptions.values())
      .filter(sub => sub.isActive);

    if (activeSubscriptions.length === 0) {
      return;
    }

    console.log(`🔄 Reconnecting ${activeSubscriptions.length} subscriptions...`);

    // Recreate all active subscriptions
    for (const subscription of activeSubscriptions) {
      try {
        // Remove old subscription
        this.subscriptions.delete(subscription.id);
        supabase.removeChannel(subscription.channel);

        // Create new subscription
        this.subscribe(subscription.config, subscription.callback);
      } catch (error) {
        console.error(`❌ Failed to reconnect subscription ${subscription.id}:`, error);
      }
    }
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();

// Export hook for React components
export function useRealtimeSubscription<T extends TableName>(
  config: SubscriptionConfig & { table: T },
  callback: (payload: RealtimePostgresChangesPayload<Tables[T]['Row']>) => void,
  deps: React.DependencyList = []
) {
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  useEffect(() => {
    const id = realtimeService.subscribe(config, callback);
    setSubscriptionId(id);

    return () => {
      if (id) {
        realtimeService.unsubscribe(id);
      }
    };
  }, deps);

  return {
    subscriptionId,
    connectionStatus: realtimeService.getConnectionStatus(),
    unsubscribe: () => {
      if (subscriptionId) {
        realtimeService.unsubscribe(subscriptionId);
      }
    },
  };
}

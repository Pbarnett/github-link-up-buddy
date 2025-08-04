/**
 * React hook for auto-booking functionality
 * Integrates with LaunchDarkly feature flags and auto-booking pipeline
 */

import { useState, useCallback, useEffect } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { supabase } from '../lib/supabase/client';
import { AutoBookingRedis } from '../lib/redis/auto-booking-redis';

export interface AutoBookingConfig {
  enabled: boolean;
  maxPrice?: number;
  cabinClass?: 'economy' | 'premium' | 'business' | 'first';
  maxStops?: number;
  preferredAirlines?: string[];
  bagsRequired?: boolean;
}

export interface AutoBookingStatus {
  status: 'idle' | 'searching' | 'monitoring' | 'booking' | 'booked' | 'failed';
  tripRequestId?: string;
  selectedOfferId?: string;
  currentPrice?: number;
  estimatedBookingTime?: string;
  error?: string;
}

export interface UseAutoBookingReturn {
  // State
  isEnabled: boolean;
  status: AutoBookingStatus;
  config: AutoBookingConfig;
  
  // Actions
  enableAutoBoobing: (tripRequestId: string, config: AutoBookingConfig) => Promise<boolean>;
  disableAutoBoobing: (tripRequestId: string) => Promise<boolean>;
  updateConfig: (config: Partial<AutoBookingConfig>) => Promise<boolean>;
  
  // Status checks
  refreshStatus: () => Promise<void>;
  canEnableAutoBoobing: boolean;
}

export function useAutoBoobing(tripRequestId?: string): UseAutoBookingReturn {
  const flags = useFlags();
  const [status, setStatus] = useState<AutoBookingStatus>({ status: 'idle' });
  const [config, setConfig] = useState<AutoBookingConfig>({ enabled: false });
  
  // Check if auto-booking is available via feature flags
  const canEnableAutoBoobing = !!(
    flags.auto_booking_pipeline_enabled && 
    !flags.auto_booking_emergency_disable
  );
  
  /**
   * Enable auto-booking for a trip request
   */
  const enableAutoBoobing = useCallback(async (
    tripId: string, 
    autoBookingConfig: AutoBookingConfig
  ): Promise<boolean> => {
    if (!canEnableAutoBoobing) {
      setStatus(prev => ({ 
        ...prev, 
        status: 'failed', 
        error: 'Auto-booking feature not available' 
      }));
      return false;
    }

    try {
      setStatus(prev => ({ ...prev, status: 'searching', tripRequestId: tripId }));

      // Update trip request in database
      const { error: updateError } = await supabase
        .from('trip_requests')
        .update({
          auto_book_enabled: true,
          max_price: autoBookingConfig.maxPrice,
          auto_book_status: 'PENDING'
        })
        .eq('id', tripId);

      if (updateError) {
        throw new Error(`Failed to enable auto-booking: ${updateError.message}`);
      }

      // Trigger initial flight search
      const { data, error } = await supabase.functions.invoke('auto-book-search', {
        body: {
          tripRequestId: tripId,
          maxResults: 20
        }
      });

      if (error) {
        throw new Error(`Flight search failed: ${error.message}`);
      }

      // Update local state
      setConfig({ ...autoBookingConfig, enabled: true });
      setStatus(prev => ({ 
        ...prev, 
        status: 'monitoring',
        tripRequestId: tripId
      }));

      return true;
    } catch (error) {
      console.error('Failed to enable auto-booking:', error);
      setStatus(prev => ({ 
        ...prev, 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
      return false;
    }
  }, [canEnableAutoBoobing]);

  /**
   * Disable auto-booking for a trip request
   */
  const disableAutoBoobing = useCallback(async (tripId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('trip_requests')
        .update({
          auto_book_enabled: false,
          auto_book_status: 'CANCELLED'
        })
        .eq('id', tripId);

      if (error) {
        throw new Error(`Failed to disable auto-booking: ${error.message}`);
      }

      setConfig(prev => ({ ...prev, enabled: false }));
      setStatus({ status: 'idle' });
      return true;
    } catch (error) {
      console.error('Failed to disable auto-booking:', error);
      return false;
    }
  }, []);

  /**
   * Update auto-booking configuration
   */
  const updateConfig = useCallback(async (
    configUpdate: Partial<AutoBookingConfig>
  ): Promise<boolean> => {
    if (!tripRequestId) return false;

    try {
      const newConfig = { ...config, ...configUpdate };
      
      const { error } = await supabase
        .from('trip_requests')
        .update({
          max_price: newConfig.maxPrice
        })
        .eq('id', tripRequestId);

      if (error) {
        throw new Error(`Failed to update config: ${error.message}`);
      }

      setConfig(newConfig);
      return true;
    } catch (error) {
      console.error('Failed to update auto-booking config:', error);
      return false;
    }
  }, [config, tripRequestId]);

  /**
   * Refresh current status from the database
   */
  const refreshStatus = useCallback(async () => {
    if (!tripRequestId) return;

    try {
      const { data: tripRequest, error } = await supabase
        .from('trip_requests')
        .select(`
          auto_book_enabled,
          auto_book_status,
          max_price,
          selected_offer_id,
          flight_offers!inner(price_total)
        `)
        .eq('id', tripRequestId)
        .single();

      if (error) {
        console.error('Failed to refresh status:', error);
        return;
      }

      // Update config
      setConfig(prev => ({
        ...prev,
        enabled: tripRequest.auto_book_enabled,
        maxPrice: tripRequest.max_price
      }));

      // Update status
      const statusMap: Record<string, AutoBookingStatus['status']> = {
        'PENDING': 'monitoring',
        'PROCESSING': 'booking',
        'BOOKED': 'booked',
        'FAILED': 'failed',
        'CANCELLED': 'idle'
      };

      setStatus(prev => ({
        ...prev,
        status: statusMap[tripRequest.auto_book_status] || 'idle',
        tripRequestId,
        selectedOfferId: tripRequest.selected_offer_id,
        currentPrice: tripRequest.flight_offers?.[0]?.price_total
      }));

    } catch (error) {
      console.error('Error refreshing auto-booking status:', error);
    }
  }, [tripRequestId]);

  // Auto-refresh status when trip ID changes
  useEffect(() => {
    if (tripRequestId) {
      refreshStatus();
      
      // Set up periodic refresh
      const interval = setInterval(refreshStatus, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [tripRequestId, refreshStatus]);

  // Monitor feature flag changes
  useEffect(() => {
    if (!canEnableAutoBoobing && config.enabled) {
      // Feature was disabled - update status
      setStatus(prev => ({ 
        ...prev, 
        status: 'failed', 
        error: 'Auto-booking feature has been disabled' 
      }));
    }
  }, [canEnableAutoBoobing, config.enabled]);

  return {
    isEnabled: canEnableAutoBoobing,
    status,
    config,
    enableAutoBoobing,
    disableAutoBoobing,
    updateConfig,
    refreshStatus,
    canEnableAutoBoobing
  };
}

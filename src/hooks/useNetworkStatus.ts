/**
 * Network Status Hook
 * Monitors online/offline state and connection quality
 */

import { useState, useEffect } from 'react';
import { trackEvent } from '@/utils/monitoring';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  lastOnlineAt: Date | null;
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
}

export const useNetworkStatus = (): NetworkStatus => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    lastOnlineAt: navigator.onLine ? new Date() : null,
    connectionType: 'unknown',
  });

  useEffect(() => {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      
      setNetworkStatus(prev => ({
        ...prev,
        isOnline,
        lastOnlineAt: isOnline ? new Date() : prev.lastOnlineAt,
      }));

      // Track connectivity events
      trackEvent(isOnline ? 'network_online' : 'network_offline', {
        timestamp: new Date().toISOString(),
        connectionType: getConnectionType(),
      });
    };

    const updateConnectionType = () => {
      const connection = getConnectionInfo();
      const isSlowConnection = connection?.effectiveType 
        ? ['slow-2g', '2g'].includes(connection.effectiveType)
        : false;

      setNetworkStatus(prev => ({
        ...prev,
        isSlowConnection,
        connectionType: getConnectionType(),
      }));
    };

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Listen for connection changes (if supported)
    const connection = getConnectionInfo();
    if (connection) {
      connection.addEventListener('change', updateConnectionType);
    }

    // Initial connection type detection
    updateConnectionType();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      
      if (connection) {
        connection.removeEventListener('change', updateConnectionType);
      }
    };
  }, []);

  return networkStatus;
};

// Helper to get connection information
const getConnectionInfo = () => {
  return (navigator as any)?.connection || 
         (navigator as any)?.mozConnection || 
         (navigator as any)?.webkitConnection;
};

// Helper to determine connection type
const getConnectionType = (): NetworkStatus['connectionType'] => {
  const connection = getConnectionInfo();
  
  if (!connection) return 'unknown';
  
  // Map connection types
  if (connection.type === 'wifi') return 'wifi';
  if (connection.type === 'cellular') return 'cellular';
  if (connection.type === 'ethernet') return 'ethernet';
  
  return 'unknown';
};

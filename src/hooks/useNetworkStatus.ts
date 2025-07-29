import * as React from 'react';
import { useState, useEffect } from 'react';
/**
 * Network Status Hook
 * Monitors online/offline state and connection quality
 */

import { trackEvent } from '@/utils/monitoring';
interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  lastOnlineAt: Date | null;
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
}

export const useNetworkStatus = (): NetworkStatus => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(() => {
    // Safe initialization for SSR compatibility
    const isOnline =
      typeof navigator !== 'undefined' ? navigator.onLine : false;
    return {
      isOnline,
      isSlowConnection: false,
      lastOnlineAt: isOnline ? new Date() : null,
      connectionType: 'unknown',
    };
  });

  useEffect(() => {
    // Guard against SSR and ensure we're in browser environment
    if (
      typeof (
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
      ) === 'undefined' ||
      typeof navigator === 'undefined'
    ) {
      return;
    }

    const updateOnlineStatus = () => {
      try {
        const isOnline = navigator?.onLine ?? false;

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
      } catch (error) {
        console.warn('Error updating online status:', error);
      }
    };

    const updateConnectionType = () => {
      try {
        const connection = getConnectionInfo();
        const isSlowConnection = connection?.effectiveType
          ? ['slow-2g', '2g'].includes(connection.effectiveType)
          : false;

        setNetworkStatus(prev => ({
          ...prev,
          isSlowConnection,
          connectionType: getConnectionType(),
        }));
      } catch (error) {
        console.warn('Error updating connection type:', error);
      }
    };

    // Listen for online/offline events with error handling
    try {
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.addEventListener(
        'online',
        updateOnlineStatus
      );
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.addEventListener(
        'offline',
        updateOnlineStatus
      );
    } catch (error) {
      console.warn(
        'Error adding /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window event listeners:',
        error
      );
    }

    // Listen for connection changes (if supported)
    let connection: ConnectionInfo | undefined;
    try {
      connection = getConnectionInfo();
      if (connection && typeof connection.addEventListener === 'function') {
        connection.addEventListener('change', updateConnectionType);
      }
    } catch (error) {
      console.warn('Error setting up connection listener:', error);
    }

    // Initial connection type detection
    updateConnectionType();

    return () => {
      try {
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.removeEventListener(
          'online',
          updateOnlineStatus
        );
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.removeEventListener(
          'offline',
          updateOnlineStatus
        );

        if (
          connection &&
          typeof connection.removeEventListener === 'function'
        ) {
          connection.removeEventListener('change', updateConnectionType);
        }
      } catch (error) {
        console.warn('Error cleaning up event listeners:', error);
      }
    };
  }, []);

  return networkStatus;
};

// Helper to get connection information
interface ConnectionInfo {
  type?: string;
  effectiveType?: string;
  addEventListener?: (event: string, listener: () => void) => void;
  removeEventListener?: (event: string, listener: () => void) => void;
}

const getConnectionInfo = (): ConnectionInfo | undefined => {
  const nav = navigator as {
    connection?: ConnectionInfo;
    mozConnection?: ConnectionInfo;
    webkitConnection?: ConnectionInfo;
  };
  return nav?.connection || nav?.mozConnection || nav?.webkitConnection;
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

import React, { ReactNode } from 'react';
import { LDProvider } from 'launchdarkly-react-client-sdk';
import { LDContext } from 'launchdarkly-js-client-sdk';
import { LaunchDarklyContextManager } from './context-manager';

interface LaunchDarklyProviderProps {
  children: ReactNode;
  initialContext?: LDContext;
}

export function LaunchDarklyProvider({ children, initialContext }: LaunchDarklyProviderProps) {
  // Read client-side ID from Vite environment variables
  const clientSideID = import.meta.env.VITE_LD_CLIENT_ID;

  if (!clientSideID) {
    console.error('LaunchDarkly client-side ID is missing. Please set VITE_LD_CLIENT_ID in your environment variables.');
    // Return children without LaunchDarkly wrapper in dev mode for debugging
    if (import.meta.env.DEV) {
      return <>{children}</>;
    }
    throw new Error('LaunchDarkly client-side ID is required');
  }

  // Validate client-side ID format
  if (!clientSideID.match(/^[a-f0-9]{24}$/)) {
    console.warn('LaunchDarkly client-side ID format looks incorrect. Expected 24 hex characters.');
  }

  // Create initial context (anonymous user by default)
  const defaultContext = initialContext || LaunchDarklyContextManager.createAnonymousContext();

  // Validate the context
  if (!LaunchDarklyContextManager.validateContext(defaultContext)) {
    console.error('Invalid LaunchDarkly context provided:', defaultContext);
    throw new Error('Invalid LaunchDarkly context');
  }

  // Sanitize context to remove any sensitive information
  const sanitizedContext = LaunchDarklyContextManager.sanitizeContext(defaultContext);

  // LaunchDarkly client configuration
  const ldOptions = {
    // Enable streaming for real-time updates
    streaming: true,
    
    // Enable bootstrap from localStorage for faster initialization
    bootstrap: 'localStorage' as const,
    
    // Enable debug mode in development
    debug: import.meta.env.DEV,
    
    // Set evaluation reasons for debugging
    evaluationReasons: import.meta.env.DEV,
    
    // Configure event handling
    sendEvents: true,
    
    // Set custom event capacity for high-traffic scenarios
    eventCapacity: import.meta.env.DEV ? 100 : 1000,
    
    // Flush events more frequently in development
    flushInterval: import.meta.env.DEV ? 5000 : 30000,
    
    // Enable offline support
    offline: false,
    
    // Configure request timeout
    requestHeaderTransform: (headers: Map<string, string>) => {
      // Add custom headers if needed
      if (import.meta.env.DEV) {
        headers.set('X-LaunchDarkly-Environment', 'development');
      }
      return headers;
    }
  };

  // Log initialization in development
  if (import.meta.env.DEV) {
    console.log('🚀 Initializing LaunchDarkly client-side SDK');
    console.log('Client ID:', clientSideID);
    console.log('Initial Context:', sanitizedContext);
    console.log('Options:', ldOptions);
  }

  return (
    <LDProvider
      clientSideID={clientSideID}
      context={sanitizedContext}
      options={ldOptions}
      reactOptions={{
        // Use suspense for better React 18 compatibility
        useCamelCaseFlagKeys: true,
        
        // Send events on flag evaluation
        sendEventsOnFlagRead: true
      }}
    >
      {children}
    </LDProvider>
  );
}

// Export a hook for easier access to client
export { useLDClient, useFlags } from 'launchdarkly-react-client-sdk';

import { secretConfigManager } from './secret-config-manager';
import { secretsManager } from './secrets-manager';
import { ApplicationAutoScalingClient, RegisterScalableTargetCommand, PutScalingPolicyCommand } from '@aws-sdk/client-application-auto-scaling';

/**
 * Connection Manager that handles rotation-aware connections
 * 
 * Manages client connections that automatically handle secret rotation
 * without breaking active connections or causing service interruptions.
 */
export class RotationAwareConnectionManager {
  private autoScalingClient: ApplicationAutoScalingClient;
  private connections = new Map<string, any>();
  private rotationListeners = new Map<string, Array<() => Promise<void>>>();
  private connectionHealth = new Map<string, boolean>();
  private rotationTimers = new Map<string, NodeJS.Timeout>();
  
  private readonly HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
  private readonly CONNECTION_RETRY_DELAY = 5000; // 5 seconds

constructor() {
    this.autoScalingClient = new ApplicationAutoScalingClient({ region: 'us-east-1' });
    // Start periodic health checks
    setInterval(() => {
      this.performHealthChecks();
    }, this.HEALTH_CHECK_INTERVAL);
  }

  async setupDynamoDBAutoScaling(tableName: string): Promise<void> {
    try {
      await this.autoScalingClient.send(new RegisterScalableTargetCommand({
        ServiceNamespace: 'dynamodb',
        ResourceId: `table/${tableName}`,
        ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
        MinCapacity: 5,
        MaxCapacity: 4000,
        RoleARN: process.env.DYNAMODB_AUTOSCALING_ROLE_ARN
      }));
      
      await this.autoScalingClient.send(new PutScalingPolicyCommand({
        PolicyName: `${tableName}-read-scaling-policy`,
        ServiceNamespace: 'dynamodb',
        ResourceId: `table/${tableName}`,
        ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
        PolicyType: 'TargetTrackingScaling',
        TargetTrackingScalingPolicyConfiguration: {
          TargetValue: 70.0,
          PredefinedMetricSpecification: {
            PredefinedMetricType: 'DynamoDBReadCapacityUtilization'
          },
          ScaleOutCooldown: 60,
          ScaleInCooldown: 300
        }
      }));
    } catch (error) {
      console.error('Failed to setup auto-scaling:', error);
      throw error;
    }
  }

  /**
   * Get or create Stripe client with automatic rotation handling
   */
  async getStripeClient(environment: string = 'production'): Promise<any> {
    const connectionKey = `stripe-${environment}`;
    
    if (this.connections.has(connectionKey) && this.connectionHealth.get(connectionKey)) {
      return this.connections.get(connectionKey);
    }

    try {
      const credentials = await secretConfigManager.getStripeCredentials(environment);
      
      // Import Stripe dynamically to avoid issues in environments where it's not available
      const { default: Stripe } = await import('stripe');
      
      const stripeClient = new Stripe(credentials.secretKey, {
        apiVersion: '2025-06-30.basil',
        timeout: 10000,
        maxNetworkRetries: 3,
        telemetry: false // Disable telemetry for better performance
      });

      this.connections.set(connectionKey, stripeClient);
      this.connectionHealth.set(connectionKey, true);
      
      // Set up rotation listener
      this.setupRotationListener(connectionKey, async () => {
        try {
          const newCredentials = await secretConfigManager.getStripeCredentials(environment);
          const newClient = new Stripe(newCredentials.secretKey, {
            apiVersion: '2025-06-30.basil',
            timeout: 10000,
            maxNetworkRetries: 3,
            telemetry: false
          });
          
          // Test the new connection before switching
          await this.testStripeConnection(newClient);
          
          this.connections.set(connectionKey, newClient);
          this.connectionHealth.set(connectionKey, true);
          console.log(`Stripe client rotated successfully for environment ${environment}`);
        } catch (error) {
          console.error(`Failed to rotate Stripe client for ${environment}:`, error);
          this.connectionHealth.set(connectionKey, false);
        }
      });

      console.log(`Stripe client initialized for environment ${environment}`);
      return stripeClient;
    } catch (error) {
      console.error(`Failed to initialize Stripe client for ${environment}:`, error);
      this.connectionHealth.set(connectionKey, false);
      throw error;
    }
  }

  /**
   * Get or create Supabase client with automatic rotation handling
   */
  async getSupabaseClient(environment: string = 'production'): Promise<any> {
    const connectionKey = `supabase-${environment}`;
    
    if (this.connections.has(connectionKey) && this.connectionHealth.get(connectionKey)) {
      return this.connections.get(connectionKey);
    }

    try {
      const credentials = await secretConfigManager.getSupabaseCredentials(environment);
      
      // Import Supabase dynamically
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabaseClient = createClient(credentials.url, credentials.anonKey, {
        auth: {
          persistSession: false // Don't persist sessions for server-side usage
        },
        db: {
          schema: 'public'
        },
        global: {
          headers: {
            'x-application-name': 'parker-flight'
          }
        }
      });

      this.connections.set(connectionKey, supabaseClient);
      this.connectionHealth.set(connectionKey, true);
      
      // Set up rotation listener for database connections
      this.setupRotationListener(connectionKey, async () => {
        try {
          const newCredentials = await secretConfigManager.getSupabaseCredentials(environment);
          const newClient = createClient(newCredentials.url, newCredentials.anonKey, {
            auth: {
              persistSession: false
            },
            db: {
              schema: 'public'
            },
            global: {
              headers: {
                'x-application-name': 'parker-flight'
              }
            }
          });
          
          // Test the new connection
          await this.testSupabaseConnection(newClient);
          
          // Gracefully close old connections
          const oldClient = this.connections.get(connectionKey);
          if (oldClient && typeof oldClient.removeAllChannels === 'function') {
            oldClient.removeAllChannels();
          }
          
          this.connections.set(connectionKey, newClient);
          this.connectionHealth.set(connectionKey, true);
          console.log(`Supabase client rotated successfully for environment ${environment}`);
        } catch (error) {
          console.error(`Failed to rotate Supabase client for ${environment}:`, error);
          this.connectionHealth.set(connectionKey, false);
        }
      });

      console.log(`Supabase client initialized for environment ${environment}`);
      return supabaseClient;
    } catch (error) {
      console.error(`Failed to initialize Supabase client for ${environment}:`, error);
      this.connectionHealth.set(connectionKey, false);
      throw error;
    }
  }

  /**
   * Get flight API client with rotation handling
   */
  async getFlightAPIClient(
    provider: 'amadeus' | 'duffel' | 'sabre',
    environment: string = 'production'
  ): Promise<any> {
    const connectionKey = `${provider}-${environment}`;
    
    if (this.connections.has(connectionKey) && this.connectionHealth.get(connectionKey)) {
      return this.connections.get(connectionKey);
    }

    try {
      const credentials = await secretConfigManager.getFlightAPICredentials(provider, environment);
      
      let client;
      
      switch (provider) {
        case 'amadeus':
          client = await this.createAmadeusClient(credentials);
          break;
        case 'duffel':
          client = await this.createDuffelClient(credentials);
          break;
        case 'sabre':
          client = await this.createSabreClient(credentials);
          break;
        default:
          throw new Error(`Unsupported flight API provider: ${provider}`);
      }

      this.connections.set(connectionKey, client);
      this.connectionHealth.set(connectionKey, true);
      
      // Set up rotation listener
      this.setupRotationListener(connectionKey, async () => {
        try {
          const newCredentials = await secretConfigManager.getFlightAPICredentials(provider, environment);
          
          let newClient;
          switch (provider) {
            case 'amadeus':
              newClient = await this.createAmadeusClient(newCredentials);
              break;
            case 'duffel':
              newClient = await this.createDuffelClient(newCredentials);
              break;
            case 'sabre':
              newClient = await this.createSabreClient(newCredentials);
              break;
          }
          
          // Test the new connection
          await this.testFlightAPIConnection(newClient!, provider);
          
          this.connections.set(connectionKey, newClient);
          this.connectionHealth.set(connectionKey, true);
          console.log(`${provider} client rotated successfully for environment ${environment}`);
        } catch (error) {
          console.error(`Failed to rotate ${provider} client for ${environment}:`, error);
          this.connectionHealth.set(connectionKey, false);
        }
      });

      console.log(`${provider} client initialized for environment ${environment}`);
      return client;
    } catch (error) {
      console.error(`Failed to initialize ${provider} client for ${environment}:`, error);
      this.connectionHealth.set(connectionKey, false);
      throw error;
    }
  }

  /**
   * Create Amadeus client
   */
  private async createAmadeusClient(credentials: any): Promise<any> {
    try {
      // Try to import Amadeus, use fallback if not available
      let AmadeusConstructor: any;
      try {
        // Use dynamic import with explicit module type assertion
        const amadeusModule = await import('amadeus' as any).catch((importError) => {
          console.warn('Amadeus SDK not available:', importError.message);
          return null;
        });
        
        if (!amadeusModule) {
          throw new Error('Amadeus SDK module not found');
        }
        
        // Handle both CommonJS and ES module exports
        AmadeusConstructor = amadeusModule.default || amadeusModule.Amadeus || amadeusModule;
        
        if (typeof AmadeusConstructor !== 'function') {
          throw new Error('Amadeus constructor not found in module');
        }
      } catch (error) {
        console.warn('Failed to load Amadeus SDK, using fallback HTTP client:', error);
        throw new Error('Amadeus SDK not available');
      }
      
      return new AmadeusConstructor({
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret,
        hostname: credentials.baseUrl ? new URL(credentials.baseUrl).hostname : 'production'
      });
    } catch (error) {
      // Fallback to HTTP client if Amadeus SDK not available
      console.log('Using generic HTTP client for Amadeus API');
      return this.createGenericHTTPClient(credentials);
    }
  }

  /**
   * Create Duffel client
   */
  private async createDuffelClient(credentials: any): Promise<any> {
    try {
      const { Duffel } = await import('@duffel/api');
      
      return new Duffel({
        token: credentials.apiKey
      });
    } catch (error) {
      // Fallback to HTTP client
      return this.createGenericHTTPClient(credentials);
    }
  }

  /**
   * Create Sabre client
   */
  private async createSabreClient(credentials: any): Promise<any> {
    // Sabre typically uses OAuth2, so we'll create a generic HTTP client
    return this.createGenericHTTPClient(credentials);
  }

  /**
   * Create generic HTTP client for APIs without specific SDKs
   */
  private createGenericHTTPClient(credentials: any): any {
    return {
      baseURL: credentials.baseUrl,
      apiKey: credentials.apiKey,
      apiSecret: credentials.apiSecret,
      clientId: credentials.clientId,
      clientSecret: credentials.clientSecret,
      
      // Generic request method
      async request(method: string, path: string, data?: any, headers?: any) {
        const url = `${this.baseURL}${path}`;
        const requestHeaders = {
          'Content-Type': 'application/json',
          ...headers
        };
        
        if (this.apiKey) {
          requestHeaders['Authorization'] = `Bearer ${this.apiKey}`;
        }
        
        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: data ? JSON.stringify(data) : undefined
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      }
    };
  }

  /**
   * Setup rotation listener for a connection
   */
  private setupRotationListener(connectionKey: string, rotationHandler: () => Promise<void>): void {
    if (!this.rotationListeners.has(connectionKey)) {
      this.rotationListeners.set(connectionKey, []);
    }
    
    this.rotationListeners.get(connectionKey)!.push(rotationHandler);
    
    // Set up periodic rotation check (every 5 minutes)
    const timer = setInterval(async () => {
      try {
        await rotationHandler();
      } catch (error) {
        console.error(`Rotation check failed for ${connectionKey}:`, error);
      }
    }, 300000); // 5 minutes
    
    this.rotationTimers.set(connectionKey, timer);
  }

  /**
   * Test Stripe connection
   */
  private async testStripeConnection(client: any): Promise<void> {
    try {
      await client.accounts.retrieve();
    } catch (error) {
      throw new Error(`Stripe connection test failed: ${(error as Error).message}`);
    }
  }

  /**
   * Test Supabase connection
   */
  private async testSupabaseConnection(client: any): Promise<void> {
    try {
      // Simple query to test connection
      const { error } = await client.from('health_check').select('*').limit(1);
      if (error && !error.message.includes('does not exist')) {
        throw error;
      }
    } catch (error) {
      throw new Error(`Supabase connection test failed: ${(error as Error).message}`);
    }
  }

  /**
   * Test Flight API connection
   */
  private async testFlightAPIConnection(client: any, provider: string): Promise<void> {
    try {
      switch (provider) {
        case 'amadeus':
          if (client.shopping) {
            // Test with a simple airport search
            await client.referenceData.locations.get({ keyword: 'LON', subType: 'AIRPORT' });
          }
          break;
        case 'duffel':
          if (client.aircraft) {
            await client.aircraft.list({ limit: 1 });
          }
          break;
        case 'sabre':
          if (client.request) {
            await client.request('GET', '/health', null, { timeout: 5000 });
          }
          break;
      }
    } catch (error) {
      throw new Error(`${provider} connection test failed: ${(error as Error).message}`);
    }
  }

  /**
   * Perform health checks on all connections
   */
  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = Array.from(this.connections.entries()).map(async ([key, client]) => {
      try {
        if (key.startsWith('stripe-')) {
          await this.testStripeConnection(client);
        } else if (key.startsWith('supabase-')) {
          await this.testSupabaseConnection(client);
        } else if (key.includes('amadeus') || key.includes('duffel') || key.includes('sabre')) {
          const provider = key.split('-')[0] as 'amadeus' | 'duffel' | 'sabre';
          await this.testFlightAPIConnection(client, provider);
        }
        
        this.connectionHealth.set(key, true);
      } catch (error) {
        console.warn(`Health check failed for connection ${key}:`, error);
        this.connectionHealth.set(key, false);
        
        // Attempt to recreate unhealthy connections
        setTimeout(() => {
          this.recreateConnection(key);
        }, this.CONNECTION_RETRY_DELAY);
      }
    });

    await Promise.allSettled(healthCheckPromises);
  }

  /**
   * Recreate a failed connection
   */
  private async recreateConnection(connectionKey: string): Promise<void> {
    try {
      const [service, environment] = connectionKey.split('-');
      
      // Remove the failed connection
      this.connections.delete(connectionKey);
      
      // Recreate based on service type
      switch (service) {
        case 'stripe':
          await this.getStripeClient(environment);
          break;
        case 'supabase':
          await this.getSupabaseClient(environment);
          break;
        case 'amadeus':
        case 'duffel':
        case 'sabre':
          await this.getFlightAPIClient(service as any, environment);
          break;
      }
      
      console.log(`Successfully recreated connection ${connectionKey}`);
    } catch (error) {
      console.error(`Failed to recreate connection ${connectionKey}:`, error);
    }
  }

  /**
   * Force rotation of all connections (useful for manual rotation)
   */
  async forceRotation(): Promise<void> {
    console.log('Forcing rotation of all connections...');
    
    const rotationPromises = Array.from(this.rotationListeners.entries()).map(async ([key, handlers]) => {
      for (const handler of handlers) {
        try {
          await handler();
          console.log(`Force rotated connection ${key}`);
        } catch (error) {
          console.error(`Failed to force rotate connection ${key}:`, error);
        }
      }
    });

    await Promise.allSettled(rotationPromises);
    console.log('Force rotation completed');
  }

  /**
   * Get connection health status
   */
  getConnectionHealth(): Map<string, boolean> {
    return new Map(this.connectionHealth);
  }

  /**
   * Get active connections count
   */
  getActiveConnectionsCount(): number {
    return Array.from(this.connectionHealth.values()).filter(healthy => healthy).length;
  }

  /**
   * Invalidate and recreate specific connection
   */
  async invalidateConnection(connectionKey: string): Promise<void> {
    console.log(`Invalidating connection ${connectionKey}`);
    
    // Clear timer
    const timer = this.rotationTimers.get(connectionKey);
    if (timer) {
      clearInterval(timer);
      this.rotationTimers.delete(connectionKey);
    }
    
    // Remove connection and listeners
    this.connections.delete(connectionKey);
    this.rotationListeners.delete(connectionKey);
    this.connectionHealth.delete(connectionKey);
    
    // Recreate the connection
    await this.recreateConnection(connectionKey);
  }

  /**
   * Cleanup all connections and timers
   */
  async cleanup(): Promise<void> {
    console.log('Cleaning up connection manager...');
    
    // Clear all timers
    this.rotationTimers.forEach(timer => clearInterval(timer));
    this.rotationTimers.clear();
    
    // Close connections gracefully
    this.connections.forEach((client, key) => {
      if (key.startsWith('supabase-') && client.removeAllChannels) {
        client.removeAllChannels();
      }
    });
    
    // Clear all data
    this.connections.clear();
    this.rotationListeners.clear();
    this.connectionHealth.clear();
    
    console.log('Connection manager cleanup completed');
  }
}

// Export singleton instance
export const connectionManager = new RotationAwareConnectionManager();

import { secretConfigManager } from './secret-config-manager';
import { connectionManager } from './connection-manager';
import { secretsManager } from './secrets-manager';

/**
 * Usage Examples and Best Practices for Enhanced Secrets Management
 */

// 1. Basic Secret Retrieval
export async function basicSecretUsage() {
  try {
    // Get Stripe credentials for production
    const stripeCredentials = await secretConfigManager.getStripeCredentials('production');
    console.log('Stripe publishable key:', stripeCredentials.publishableKey);

    // Get database credentials
    const supabaseCredentials = await secretConfigManager.getSupabaseCredentials('production');
    console.log('Database URL:', supabaseCredentials.url);

    // Get flight API credentials
    const amadeusCredentials = await secretConfigManager.getFlightAPICredentials('amadeus', 'production');
    console.log('Amadeus API configured');

  } catch (error) {
    console.error('Failed to retrieve secrets:', error);
  }
}

// 2. Connection Management with Automatic Rotation
export async function connectionManagementExample() {
  try {
    // Get Stripe client - automatically handles rotation
    const stripe = await connectionManager.getStripeClient('production');
    
    // Use the client normally - rotation happens transparently
    const account = await stripe.accounts.retrieve();
    console.log('Stripe account ID:', account.id);

    // Get Supabase client
    const supabase = await connectionManager.getSupabaseClient('production');
    
    // Use for database operations
    const { data, error } = await supabase
      .from('users')
      .select('id, email')
      .limit(10);

    if (error) {
      console.error('Supabase query error:', error);
    } else {
      console.log('Retrieved users:', data?.length);
    }

  } catch (error) {
    console.error('Connection management error:', error);
  }
}

// 3. Batch Secret Retrieval for Startup
export async function batchSecretRetrievalExample() {
  try {
    const secretRequests = [
      { name: 'production/payments/stripe-credentials', type: 'payments' as const },
      { name: 'production/database/supabase-credentials', type: 'database' as const },
      { name: 'production/flight-apis/amadeus-credentials', type: 'integrations' as const },
      { name: 'production/api-keys/openai', type: 'api-keys' as const }
    ];

    const secrets = await secretConfigManager.batchGetSecrets(secretRequests);
    
    console.log(`Retrieved ${secrets.size} secrets in batch`);
    
    // Process secrets as needed
    for (const [name, value] of secrets) {
      console.log(`Secret ${name} retrieved successfully`);
    }

  } catch (error) {
    console.error('Batch retrieval error:', error);
  }
}

// 4. Cache Warmup for Better Performance
export async function cacheWarmupExample() {
  try {
    console.log('Warming up secrets cache...');
    
    await secretConfigManager.warmupCache('production');
    
    const stats = secretConfigManager.getCacheStats();
    console.log('Cache warmed up:', {
      size: stats.size,
      hitRate: stats.hitRate,
      averageAge: stats.averageAge
    });

  } catch (error) {
    console.error('Cache warmup error:', error);
  }
}

// 5. Health Monitoring and Metrics
export class SecretsMonitor {
  /**
   * Get comprehensive health status
   */
  async getHealthStatus() {
    const cacheStats = secretConfigManager.getCacheStats();
    const metrics = secretConfigManager.getMetrics();
    const circuitBreakers = secretConfigManager.getCircuitBreakerStatus();
    const connectionHealth = connectionManager.getConnectionHealth();

    return {
      cache: {
        size: cacheStats.size,
        hitRate: cacheStats.hitRate,
        totalRequests: cacheStats.totalRequests,
        averageAge: cacheStats.averageAge
      },
      
      performance: {
        totalRequests: metrics.length,
        successRate: this.calculateSuccessRate(metrics),
        averageResponseTime: this.calculateAverageResponseTime(metrics),
        recentErrors: this.getRecentErrors(metrics)
      },
      
      circuitBreakers: Object.fromEntries(circuitBreakers.entries()),
      
      connections: {
        total: connectionHealth.size,
        healthy: connectionManager.getActiveConnectionsCount(),
        status: Object.fromEntries(connectionHealth.entries())
      }
    };
  }

  /**
   * Calculate success rate from metrics
   */
  private calculateSuccessRate(metrics: any[]): number {
    if (metrics.length === 0) return 100;
    
    const recentMetrics = metrics.filter(m => 
      Date.now() - m.timestamp < 3600000 // Last hour
    );
    
    const successful = recentMetrics.filter(m => m.success).length;
    return Math.round((successful / recentMetrics.length) * 100 * 100) / 100;
  }

  /**
   * Calculate average response time
   */
  private calculateAverageResponseTime(metrics: any[]): number {
    if (metrics.length === 0) return 0;
    
    const recentMetrics = metrics.filter(m => 
      Date.now() - m.timestamp < 3600000 && m.success
    );
    
    if (recentMetrics.length === 0) return 0;
    
    const totalTime = recentMetrics.reduce((sum, m) => sum + m.duration, 0);
    return Math.round(totalTime / recentMetrics.length);
  }

  /**
   * Get recent errors for analysis
   */
  private getRecentErrors(metrics: any[]): any[] {
    return metrics
      .filter(m => !m.success && (Date.now() - m.timestamp < 3600000))
      .slice(-10) // Last 10 errors
      .map(m => ({
        timestamp: new Date(m.timestamp).toISOString(),
        secretName: m.secretName,
        region: m.region,
        error: m.error
      }));
  }

  /**
   * Generate monitoring report
   */
  async generateMonitoringReport(): Promise<string> {
    const health = await this.getHealthStatus();
    
    return `
# Secrets Management Health Report
Generated: ${new Date().toISOString()}

## Cache Performance
- Size: ${health.cache.size} secrets
- Hit Rate: ${health.cache.hitRate}%
- Total Requests: ${health.cache.totalRequests}
- Average Age: ${health.cache.averageAge}s

## Performance Metrics
- Success Rate: ${health.performance.successRate}%
- Average Response Time: ${health.performance.averageResponseTime}ms
- Recent Errors: ${health.performance.recentErrors.length}

## Circuit Breakers
${Object.entries(health.circuitBreakers).map(([region, state]: [string, any]) => 
  `- ${region}: ${state.state} (failures: ${state.failures})`
).join('\n')}

## Connection Health
- Total Connections: ${health.connections.total}
- Healthy Connections: ${health.connections.healthy}
${Object.entries(health.connections.status).map(([conn, healthy]: [string, any]) => 
  `- ${conn}: ${healthy ? '✅' : '❌'}`
).join('\n')}

## Recent Errors
${health.performance.recentErrors.map(error => 
  `- ${error.timestamp}: ${error.secretName} in ${error.region} - ${error.error}`
).join('\n')}
    `.trim();
  }
}

// 6. Application Startup Helper
export class SecretsStartupHelper {
  private monitor = new SecretsMonitor();

  /**
   * Initialize secrets management for application startup
   */
  async initialize(): Promise<void> {
    console.log('🔐 Initializing secrets management...');

    try {
      // 1. Warm up cache with critical secrets
      await this.warmupCriticalSecrets();

      // 2. Test secret accessibility
      await this.testSecretAccess();

      // 3. Initialize critical connections
      await this.initializeCriticalConnections();

      // 4. Set up monitoring
      this.setupMonitoring();

      console.log('✅ Secrets management initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize secrets management:', error);
      throw error;
    }
  }

  /**
   * Warm up cache with critical secrets
   */
  private async warmupCriticalSecrets(): Promise<void> {
    console.log('🔥 Warming up critical secrets cache...');
    
    const environment = process.env.NODE_ENV || 'development';
    await secretConfigManager.warmupCache(environment);
    
    const stats = secretConfigManager.getCacheStats();
    console.log(`📊 Cache warmed up: ${stats.size} secrets, ${stats.hitRate}% hit rate`);
  }

  /**
   * Test access to critical secrets
   */
  private async testSecretAccess(): Promise<void> {
    console.log('🧪 Testing secret accessibility...');

    const criticalSecrets = [
      { name: 'stripe-credentials', type: 'payments' as const },
      { name: 'supabase-credentials', type: 'database' as const },
      { name: 'amadeus-credentials', type: 'integrations' as const }
    ];

    for (const secret of criticalSecrets) {
      const environment = process.env.NODE_ENV || 'development';
      const secretName = `${environment}/secret.type/${secret.name}`;
      
      const result = await secretConfigManager.testSecretAccess(secretName, secret.type);
      
      if (result.accessible) {
        console.log(`✅ ${secret.name}: accessible (${result.responseTime}ms)`);
      } else {
        console.warn(`⚠️  ${secret.name}: not accessible - ${result.error}`);
      }
    }
  }

  /**
   * Initialize critical connections
   */
  private async initializeCriticalConnections(): Promise<void> {
    console.log('🔌 Initializing critical connections...');

    const environment = process.env.NODE_ENV || 'development';

    try {
      // Initialize Stripe
      await connectionManager.getStripeClient(environment);
      console.log('✅ Stripe client initialized');

      // Initialize Supabase
      await connectionManager.getSupabaseClient(environment);
      console.log('✅ Supabase client initialized');

      // Initialize flight APIs
      try {
        await connectionManager.getFlightAPIClient('amadeus', environment);
        console.log('✅ Amadeus client initialized');
      } catch (error) {
        console.warn('⚠️  Amadeus client initialization failed:', error);
      }

    } catch (error) {
      console.error('❌ Critical connection initialization failed:', error);
      throw error;
    }
  }

  /**
   * Set up monitoring and health checks
   */
  private setupMonitoring(): void {
    console.log('📊 Setting up secrets monitoring...');

    // Health check every 5 minutes
    setInterval(async () => {
      try {
        const health = await this.monitor.getHealthStatus();
        
        // Log warnings for issues
        if (health.performance.successRate < 95) {
          console.warn(`⚠️  Low success rate: ${health.performance.successRate}%`);
        }
        
        if (health.connections.healthy < health.connections.total) {
          console.warn(`⚠️  Unhealthy connections: ${health.connections.total - health.connections.healthy}`);
        }
        
        if (health.cache.hitRate < 80) {
          console.warn(`⚠️  Low cache hit rate: ${health.cache.hitRate}%`);
        }

      } catch (error) {
        console.error('❌ Health check failed:', error);
      }
    }, 300000); // 5 minutes

    console.log('✅ Monitoring setup complete');
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down secrets management...');

    try {
      await connectionManager.cleanup();
      await secretConfigManager.cleanup();
      console.log('✅ Secrets management shutdown complete');
    } catch (error) {
      console.error('❌ Shutdown error:', error);
    }
  }
}

// 7. Express.js Middleware Example
export function createSecretsMiddleware() {
  return async (req: any, res: any, next: any) => {
    try {
      // Attach secrets to request object for easy access
      req.secrets = {
        getStripe: () => connectionManager.getStripeClient(),
        getSupabase: () => connectionManager.getSupabaseClient(),
        getFlightAPI: (provider: string) => connectionManager.getFlightAPIClient(provider as any)
      };
      
      next();
    } catch (error) {
      console.error('Secrets middleware error:', error);
      res.status(500).json({ error: 'Secret access failed' });
    }
  };
}

// Export instances
export const secretsMonitor = new SecretsMonitor();
export const startupHelper = new SecretsStartupHelper();

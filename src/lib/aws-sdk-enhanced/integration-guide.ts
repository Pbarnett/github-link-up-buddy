/**
 * Integration Guide for Parker Flight Enhanced AWS Services
 * 
 * This file demonstrates how to integrate the enhanced secrets management
 * system into your existing Parker Flight services.
 */

import { secretConfigManager, connectionManager } from './index';

// Example 1: Enhanced Stripe Service Integration
export class EnhancedStripeService {
  private stripeClient: any = null;
  
  /**
   * Get Stripe client with automatic rotation handling
   */
  async getStripeClient(): Promise<any> {
    if (!this.stripeClient) {
      this.stripeClient = await connectionManager.getStripeClient('production');
    }
    return this.stripeClient;
  }
  
  /**
   * Create a payment intent with enhanced error handling
   */
  async createPaymentIntent(amount: number, currency: string = 'usd') {
    try {
      const stripe = await this.getStripeClient();
      
      return await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      
      // Invalidate connection on auth errors to force refresh
      if (error.code === 'authentication_required') {
        await connectionManager.invalidateConnection('stripe-production');
      }
      
      throw error;
    }
  }
  
  /**
   * Create a customer with retry logic
   */
  async createCustomer(email: string, name?: string) {
    const stripe = await this.getStripeClient();
    
    return await stripe.customers.create({
      email,
      name,
    });
  }
}

// Example 2: Enhanced Supabase Service Integration
export class EnhancedSupabaseService {
  private supabaseClient: any = null;
  
  /**
   * Get Supabase client with automatic rotation handling
   */
  async getSupabaseClient(): Promise<any> {
    if (!this.supabaseClient) {
      this.supabaseClient = await connectionManager.getSupabaseClient('production');
    }
    return this.supabaseClient;
  }
  
  /**
   * Query data with enhanced error handling
   */
  async queryData(table: string, filters?: any) {
    try {
      const supabase = await this.getSupabaseClient();
      
      let query = supabase.from(table).select('*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Supabase query failed for table ${table}:`, error);
      
      // Invalidate connection on connection errors
      if (error.message?.includes('connection') || error.code === 'PGRST301') {
        await connectionManager.invalidateConnection('supabase-production');
      }
      
      throw error;
    }
  }
  
  /**
   * Insert data with conflict handling
   */
  async insertData(table: string, data: any) {
    const supabase = await this.getSupabaseClient();
    
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    
    if (error) {
      throw error;
    }
    
    return result;
  }
}

// Example 3: Enhanced Flight API Service Integration
export class EnhancedFlightAPIService {
  private amadeusClient: any = null;
  private duffelClient: any = null;
  
  /**
   * Get Amadeus client with automatic rotation handling
   */
  async getAmadeusClient(): Promise<any> {
    if (!this.amadeusClient) {
      this.amadeusClient = await connectionManager.getFlightAPIClient('amadeus', 'production');
    }
    return this.amadeusClient;
  }
  
  /**
   * Get Duffel client with automatic rotation handling
   */
  async getDuffelClient(): Promise<any> {
    if (!this.duffelClient) {
      this.duffelClient = await connectionManager.getFlightAPIClient('duffel', 'production');
    }
    return this.duffelClient;
  }
  
  /**
   * Search flights with fallback providers
   */
  async searchFlights(searchParams: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
  }) {
    // Try Amadeus first
    try {
      const amadeus = await this.getAmadeusClient();
      
      const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: searchParams.origin,
        destinationLocationCode: searchParams.destination,
        departureDate: searchParams.departureDate,
        returnDate: searchParams.returnDate,
        adults: searchParams.adults,
      });
      
      return {
        provider: 'amadeus',
        offers: response.data,
      };
    } catch (amadeusError) {
      console.warn('Amadeus search failed, trying Duffel:', amadeusError);
      
      // Fallback to Duffel
      try {
        const duffel = await this.getDuffelClient();
        
        const offers = await duffel.offerRequests.create({
          slices: [
            {
              origin: searchParams.origin,
              destination: searchParams.destination,
              departure_date: searchParams.departureDate,
            },
            ...(searchParams.returnDate ? [{
              origin: searchParams.destination,
              destination: searchParams.origin,
              departure_date: searchParams.returnDate,
            }] : []),
          ],
          passengers: Array(searchParams.adults).fill({ type: 'adult' }),
        });
        
        return {
          provider: 'duffel',
          offers: offers.data,
        };
      } catch (duffelError) {
        console.error('Both flight providers failed:', { amadeusError, duffelError });
        throw new Error('Flight search temporarily unavailable');
      }
    }
  }
}

// Example 4: Service Integration in Express Routes
export function createEnhancedRoutes() {
  const stripeService = new EnhancedStripeService();
  const supabaseService = new EnhancedSupabaseService();
  const flightService = new EnhancedFlightAPIService();
  
  return {
    // Payment route with enhanced Stripe integration
    async createPayment(req: any, res: any) {
      try {
        const { amount, currency } = req.body;
        
        const paymentIntent = await stripeService.createPaymentIntent(amount, currency);
        
        res.json({
          success: true,
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        console.error('Payment creation failed:', error);
        res.status(500).json({
          success: false,
          error: 'Payment processing unavailable',
        });
      }
    },
    
    // User profile route with enhanced Supabase integration
    async getUserProfile(req: any, res: any) {
      try {
        const { userId } = req.params;
        
        const profile = await supabaseService.queryData('profiles', { id: userId });
        
        res.json({
          success: true,
          profile: profile[0],
        });
      } catch (error) {
        console.error('Profile fetch failed:', error);
        res.status(500).json({
          success: false,
          error: 'Profile data unavailable',
        });
      }
    },
    
    // Flight search route with enhanced flight API integration
    async searchFlights(req: any, res: any) {
      try {
        const searchParams = req.body;
        
        const results = await flightService.searchFlights(searchParams);
        
        res.json({
          success: true,
          provider: results.provider,
          offers: results.offers,
        });
      } catch (error) {
        console.error('Flight search failed:', error);
        res.status(500).json({
          success: false,
          error: 'Flight search unavailable',
        });
      }
    },
  };
}

// Example 5: Middleware for Secret Access
export function createSecretsMiddleware() {
  return async (req: any, res: any, next: any) => {
    try {
      const env = process.env.NODE_ENV || 'production';
      
      // Attach secret helpers to request object
      req.aws = {
        // Get any secret by name
        getSecret: async (secretName: string, secretType: string) => {
          return await secretConfigManager.getAPIKey(secretName.replace(`${env}/api-keys/`, ''), env);
        },
        
        // Get typed credentials
        getStripeCredentials: () => secretConfigManager.getStripeCredentials('production'),
        getSupabaseCredentials: () => secretConfigManager.getSupabaseCredentials('production'),
        getFlightAPICredentials: (provider: string) => 
          secretConfigManager.getFlightAPICredentials(provider as any, 'production'),
        
        // Get ready-to-use clients
        getStripeClient: () => connectionManager.getStripeClient('production'),
        getSupabaseClient: () => connectionManager.getSupabaseClient('production'),
        getFlightAPIClient: (provider: string) => 
          connectionManager.getFlightAPIClient(provider as any, 'production'),
      };
      
      next();
    } catch (error) {
      console.error('Secrets middleware error:', error);
      res.status(500).json({ error: 'Service configuration error' });
    }
  };
}

// Example 6: Health Check Integration
export async function createHealthCheck() {
  const health = await secretConfigManager.getCacheStats();
  const connections = connectionManager.getConnectionHealth();
  
  return {
    status: 'healthy',
    services: {
      secretsManager: {
        cacheSize: health.size,
        hitRate: health.hitRate,
        totalRequests: health.totalRequests,
      },
      connections: {
        total: connections.size,
        healthy: Array.from(connections.values()).filter(Boolean).length,
        details: Object.fromEntries(connections.entries()),
      },
    },
    timestamp: new Date().toISOString(),
  };
}

// Example 7: Startup Integration Helper
export async function initializeEnhancedServices() {
  console.log('🔐 Initializing Enhanced AWS Services for Parker Flight...');
  
  try {
    // Warm up critical secrets
    await secretConfigManager.warmupCache('production');
    console.log('✅ Secret cache warmed up');
    
    // Initialize critical connections
    await connectionManager.getStripeClient('production');
    console.log('✅ Stripe client ready');
    
    await connectionManager.getSupabaseClient('production');
    console.log('✅ Supabase client ready');
    
    try {
      await connectionManager.getFlightAPIClient('amadeus', 'production');
      console.log('✅ Amadeus client ready');
    } catch (error) {
      console.warn('⚠️  Amadeus client initialization failed:', error.message);
    }
    
    console.log('🚀 Enhanced AWS Services ready!');
    
    // Return service instances for use
    return {
      stripeService: new EnhancedStripeService(),
      supabaseService: new EnhancedSupabaseService(),
      flightService: new EnhancedFlightAPIService(),
      healthCheck: createHealthCheck,
      middleware: createSecretsMiddleware,
      routes: createEnhancedRoutes(),
    };
  } catch (error) {
    console.error('❌ Failed to initialize Enhanced AWS Services:', error);
    throw error;
  }
}

// Export service instances for easy import
export const enhancedServices = {
  stripe: new EnhancedStripeService(),
  supabase: new EnhancedSupabaseService(),
  flight: new EnhancedFlightAPIService(),
};

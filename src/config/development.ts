/**
 * Development Configuration Fallbacks
 *
 * This file provides fallback configurations for development environments
 * when external services like AWS Secrets Manager are not available.
 */

// Development fallback environment variables
export const DEVELOPMENT_FALLBACKS = {
  stripe: {
    publishableKey:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_dev_fallback',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dev_fallback',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dev_fallback_key',
  },
  aws: {
    region: process.env.AWS_REGION || 'us-west-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dev_fallback',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dev_fallback',
  },
};

/**
 * Check if we're in development mode and services should use fallbacks
 */
export const isDevelopmentMode = () => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Get development configuration with helpful logging
 */
export const getDevelopmentConfig = (service: string) => {
  if (!isDevelopmentMode()) {
    throw new Error(
      'Development config should only be used in development mode'
    );
  }

  const config =
    DEVELOPMENT_FALLBACKS[service as keyof typeof DEVELOPMENT_FALLBACKS];

  if (!config) {
    console.warn(
      `⚠️ No development fallback configuration found for service: ${service}`
    );
    return {};
  }

  console.info(`🔧 Using development fallback configuration for ${service}`);
  return config;
};

/**
 * Enhanced development environment checker
 */
export const developmentChecks = {
  /**
   * Check if required environment variables are set
   */
  checkEnvironmentVariables: () => {
    const required = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.warn('🚨 Missing environment variables:', missing);
      console.info('💡 These variables can be set in your .env.local file');
      console.info('📖 Check the README.md for setup instructions');
    }

    return missing.length === 0;
  },

  /**
   * Check if external services are reachable
   */
  checkExternalServices: async () => {
    const services = [];

    // Check Supabase
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'HEAD',
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          },
        });
        services.push({
          name: 'Supabase',
          status: response.ok ? 'connected' : 'error',
          message: response.ok ? 'Connected' : `HTTP ${response.status}`,
        });
      }
    } catch (error) {
      services.push({
        name: 'Supabase',
        status: 'error',
        message: 'Connection failed',
      });
    }

    return services;
  },

  /**
   * Run all development checks
   */
  runAllChecks: async () => {
    console.info('🔍 Running development environment checks...');

    const envCheck = developmentChecks.checkEnvironmentVariables();
    const serviceChecks = await developmentChecks.checkExternalServices();

    console.info('📊 Environment Check Results:');
    console.info(
      'Environment Variables:',
      envCheck ? '✅ OK' : '❌ Issues found'
    );

    serviceChecks.forEach(service => {
      const icon = service.status === 'connected' ? '✅' : '❌';
      console.info(`${service.name}: ${icon} ${service.message}`);
    });

    return {
      environmentVariables: envCheck,
      externalServices: serviceChecks,
    };
  },
};

/**
 * Initialize development environment
 */
export const initializeDevelopmentEnvironment = async () => {
  if (!isDevelopmentMode()) {
    return;
  }

  console.info('🏗️ Initializing development environment...');

  // Run checks
  await developmentChecks.runAllChecks();

  // Set up development-specific configurations
  if (typeof window !== 'undefined') {
    // Browser environment
    console.info('🌍 Browser environment detected');
    console.info('🔧 Mock services will be used for AWS operations');
  } else {
    // Server environment
    console.info('🖥️ Server environment detected');
  }

  console.info('✅ Development environment initialized');
};

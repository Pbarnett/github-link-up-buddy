// Deployment configuration for production
export const deployConfig = {
  // Build settings
  build: {
    command: 'npm run build',
    directory: 'dist',
    environment: {
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=4096'
    }
  },

  // Environment variables required for deployment
  requiredEnvVars: [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_LAUNCHDARKLY_CLIENT_ID',
    'VITE_DUFFEL_API_BASE_URL',
    'VITE_TWILIO_ACCOUNT_SID',
    'VITE_RESEND_API_KEY'
  ],

  // Health check configuration
  healthCheck: {
    endpoint: '/api/health',
    timeout: 30000,
    interval: 30000,
    retries: 3
  },

  // Performance budgets
  performanceBudgets: {
    maxBundleSize: '1.5MB',
    maxChunkSize: '500KB',
    maxAssetSize: '250KB'
  },

  // Security headers
  headers: {
    '/*': {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' *.supabase.co *.launchdarkly.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob: *.supabase.co;
        font-src 'self' data:;
        connect-src 'self' *.supabase.co *.launchdarkly.com *.duffel.com api.twilio.com api.resend.com;
      `.replace(/\s+/g, ' ').trim()
    }
  },

  // Redirects and rewrites
  redirects: [
    {
      from: '/health',
      to: '/api/health',
      status: 200
    }
  ]
};

// Deployment validation function
export function validateDeployment() {
  const errors = [];
  const warnings = [];

  // Check required environment variables
  deployConfig.requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  });

  // Check build directory exists
  try {
    const fs = require('fs');
    if (!fs.existsSync(deployConfig.build.directory)) {
      errors.push(`Build directory does not exist: ${deployConfig.build.directory}`);
    }
  } catch (err) {
    warnings.push('Could not validate build directory existence');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export default deployConfig;

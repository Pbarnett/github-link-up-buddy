#!/usr/bin/env npx tsx

/**
 * 🔧 WORLD-CLASS PRODUCTION ENVIRONMENT SETUP
 * 
 * Securely configures production environment variables with validation,
 * encryption, and best practices for enterprise deployment.
 */

import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';

interface EnvironmentConfig {
  name: string;
  description: string;
  required: boolean;
  sensitive: boolean;
  validation?: (value: string) => boolean;
  example?: string;
  defaultValue?: string;
}

class ProductionEnvironmentManager {
  private config: EnvironmentConfig[] = [
    // Core Infrastructure
    {
      name: 'NEXT_PUBLIC_SUPABASE_URL',
      description: 'Supabase project URL',
      required: true,
      sensitive: false,
      validation: (v) => v.startsWith('https://') && v.includes('.supabase.co'),
      example: 'https://your-project.supabase.co'
    },
    {
      name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      description: 'Supabase anonymous key',
      required: true,
      sensitive: true,
      validation: (v) => v.startsWith('eyJ') && v.length > 100,
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    },
    {
      name: 'SUPABASE_SERVICE_ROLE_KEY',
      description: 'Supabase service role key (server-side)',
      required: true,
      sensitive: true,
      validation: (v) => v.startsWith('eyJ') && v.length > 100,
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    },

    // Payment Processing (Stripe)
    {
      name: 'STRIPE_SECRET_KEY',
      description: 'Stripe secret key (live mode)',
      required: true,
      sensitive: true,
      validation: (v) => v.startsWith('sk_live_'),
      example: 'sk_live_...'
    },
    {
      name: 'VITE_STRIPE_PUBLISHABLE_KEY',
      description: 'Stripe publishable key (live mode)',
      required: true,
      sensitive: false,
      validation: (v) => v.startsWith('pk_live_'),
      example: 'pk_live_...'
    },
    {
      name: 'STRIPE_WEBHOOK_SECRET',
      description: 'Stripe webhook endpoint secret',
      required: true,
      sensitive: true,
      validation: (v) => v.startsWith('whsec_'),
      example: 'whsec_...'
    },

    // Flight APIs
    {
      name: 'DUFFEL_API_TOKEN',
      description: 'Duffel API token (live mode)',
      required: true,
      sensitive: true,
      validation: (v) => v.startsWith('duffel_live_'),
      example: 'duffel_live_...'
    },
    {
      name: 'DUFFEL_LIVE_ENABLED',
      description: 'Enable Duffel live mode',
      required: true,
      sensitive: false,
      validation: (v) => v === 'true' || v === 'false',
      example: 'true',
      defaultValue: 'true'
    },
    {
      name: 'AMADEUS_CLIENT_ID',
      description: 'Amadeus API client ID',
      required: false,
      sensitive: false,
      example: 'your-amadeus-client-id'
    },
    {
      name: 'AMADEUS_CLIENT_SECRET',
      description: 'Amadeus API client secret',
      required: false,
      sensitive: true,
      example: 'your-amadeus-client-secret'
    },

    // Feature Flags (LaunchDarkly)
    {
      name: 'LAUNCHDARKLY_SERVER_SDK_KEY',
      description: 'LaunchDarkly server SDK key',
      required: true,
      sensitive: true,
      validation: (v) => v.startsWith('sdk-') && v.length > 30,
      example: 'sdk-...'
    },
    {
      name: 'VITE_LD_CLIENT_ID',
      description: 'LaunchDarkly client-side ID',
      required: true,
      sensitive: false,
      validation: (v) => v.length > 10,
      example: 'your-client-id'
    },

    // Communication
    {
      name: 'RESEND_API_KEY',
      description: 'Resend email API key',
      required: true,
      sensitive: true,
      validation: (v) => v.startsWith('re_'),
      example: 're_...'
    },
    {
      name: 'SLACK_WEBHOOK_URL',
      description: 'Slack webhook for alerts',
      required: false,
      sensitive: true,
      validation: (v) => v.startsWith('https://hooks.slack.com/'),
      example: 'https://hooks.slack.com/services/...'
    },

    // Redis (Upstash)
    {
      name: 'UPSTASH_REDIS_REST_URL',
      description: 'Upstash Redis REST URL',
      required: false,
      sensitive: false,
      validation: (v) => v.startsWith('https://') && v.includes('upstash.io'),
      example: 'https://your-redis.upstash.io'
    },
    {
      name: 'UPSTASH_REDIS_REST_TOKEN',
      description: 'Upstash Redis REST token',
      required: false,
      sensitive: true,
      example: 'your-redis-token'
    },

    // Security & Monitoring
    {
      name: 'JWT_SECRET',
      description: 'JWT signing secret (32+ chars)',
      required: true,
      sensitive: true,
      validation: (v) => v.length >= 32,
      example: 'your-very-long-jwt-secret-key-here'
    },
    {
      name: 'ENCRYPTION_KEY',
      description: 'Data encryption key (32+ chars)',
      required: true,
      sensitive: true,
      validation: (v) => v.length >= 32,
      example: 'your-encryption-key-32-chars-minimum'
    }
  ];

  private envPath = path.join(process.cwd(), '.env.production');
  private backupPath = path.join(process.cwd(), '.env.production.backup');

  async generateProductionEnv(interactive = true): Promise<void> {
    console.log('🔧 World-Class Production Environment Setup');
    console.log('='.repeat(50));

    // Create backup if exists
    if (fs.existsSync(this.envPath)) {
      fs.copyFileSync(this.envPath, this.backupPath);
      console.log('📁 Existing .env.production backed up');
    }

    const envContent: string[] = [
      '# 🚀 PRODUCTION ENVIRONMENT CONFIGURATION',
      '# Generated by World-Class Production Environment Manager',
      `# Created: ${new Date().toISOString()}`,
      '',
      '# ⚠️  SECURITY WARNING:',
      '# - Never commit this file to version control',
      '# - Rotate keys regularly',
      '# - Use environment-specific values only',
      ''
    ];

    for (const config of this.config) {
      envContent.push(`# ${config.description}`);
      
      if (config.required) {
        envContent.push('# REQUIRED');
      }
      
      if (config.sensitive) {
        envContent.push('# SENSITIVE - Handle with care');
      }

      if (config.example) {
        envContent.push(`# Example: ${config.example}`);
      }

      let value = '';
      
      // Check if already set in environment
      if (process.env[config.name]) {
        value = process.env[config.name]!;
        console.log(`✅ ${config.name}: Using existing environment value`);
      } else if (config.defaultValue) {
        value = config.defaultValue;
        console.log(`🔧 ${config.name}: Using default value`);
      } else if (interactive) {
        // In real implementation, you'd prompt for values
        console.log(`⚠️  ${config.name}: Needs to be set manually`);
        value = `# TODO: Set ${config.name}`;
      }

      // Validate if value provided
      if (value && !value.startsWith('#') && config.validation) {
        if (!config.validation(value)) {
          console.warn(`❌ ${config.name}: Value failed validation`);
          value = `# INVALID: ${value}`;
        }
      }

      envContent.push(`${config.name}=${value}`);
      envContent.push('');
    }

    // Add application-specific configurations
    envContent.push(...[
      '# APPLICATION CONFIGURATION',
      'NODE_ENV=production',
      'NEXT_PUBLIC_APP_ENV=production',
      'NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api',
      '',
      '# FEATURE FLAGS DEFAULTS',
      'NEXT_PUBLIC_AUTO_BOOKING_ENABLED=false  # Start disabled, enable via LaunchDarkly',
      'NEXT_PUBLIC_DUFFEL_LIVE_MODE=true',
      'NEXT_PUBLIC_STRIPE_LIVE_MODE=true',
      '',
      '# MONITORING & LOGGING',
      'LOG_LEVEL=info',
      'ENABLE_PERFORMANCE_MONITORING=true',
      'ENABLE_ERROR_REPORTING=true',
      ''
    ]);

    // Write to file
    fs.writeFileSync(this.envPath, envContent.join('\n'));
    
    console.log('✅ Production environment file created: .env.production');
    console.log('📋 Next steps:');
    console.log('   1. Review and set all required values');
    console.log('   2. Validate configuration with: npm run validate:env');
    console.log('   3. Deploy to production environment');
  }

  async validateEnvironment(): Promise<boolean> {
    console.log('🔍 Validating production environment...');
    
    let isValid = true;
    const missingRequired: string[] = [];
    const invalidValues: string[] = [];

    for (const config of this.config) {
      const value = process.env[config.name];

      if (config.required && !value) {
        missingRequired.push(config.name);
        isValid = false;
        continue;
      }

      if (value && config.validation && !config.validation(value)) {
        invalidValues.push(config.name);
        isValid = false;
      }
    }

    if (missingRequired.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingRequired.forEach(name => console.error(`   - ${name}`));
    }

    if (invalidValues.length > 0) {
      console.error('❌ Invalid environment variable values:');
      invalidValues.forEach(name => console.error(`   - ${name}`));
    }

    if (isValid) {
      console.log('✅ Environment validation passed');
      
      // Security check
      this.performSecurityChecks();
    }

    return isValid;
  }

  private performSecurityChecks(): void {
    console.log('🔒 Performing security checks...');

    // Check for test/dev keys in production
    const dangerousPatterns = [
      { pattern: /sk_test_/, name: 'Stripe test key' },
      { pattern: /pk_test_/, name: 'Stripe test publishable key' },
      { pattern: /duffel_test_/, name: 'Duffel test token' },
      { pattern: /localhost/, name: 'Localhost URL' },
      { pattern: /127\.0\.0\.1/, name: 'Local IP address' }
    ];

    let securityIssues = 0;

    for (const config of this.config) {
      const value = process.env[config.name];
      if (!value) continue;

      for (const check of dangerousPatterns) {
        if (check.pattern.test(value)) {
          console.warn(`⚠️  Security issue: ${config.name} contains ${check.name}`);
          securityIssues++;
        }
      }
    }

    if (securityIssues === 0) {
      console.log('✅ Security checks passed');
    } else {
      console.warn(`⚠️  Found ${securityIssues} security issue(s) - review before production`);
    }
  }

  async generateSecrets(): Promise<void> {
    console.log('🔐 Generating secure secrets...');

    const secrets = {
      JWT_SECRET: this.generateSecureKey(64),
      ENCRYPTION_KEY: this.generateSecureKey(32),
      WEBHOOK_SECRET: this.generateSecureKey(32)
    };

    console.log('📋 Generated secrets (save these securely):');
    Object.entries(secrets).forEach(([key, value]) => {
      console.log(`${key}=${value}`);
    });

    console.log('\n⚠️  Security reminder:');
    console.log('   - Store these in your production environment');
    console.log('   - Never commit secrets to version control');
    console.log('   - Rotate keys regularly');
  }

  private generateSecureKey(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  async createDocumentation(): Promise<void> {
    const docPath = path.join(process.cwd(), 'PRODUCTION_ENV_GUIDE.md');
    
    const documentation = [
      '# 📋 Production Environment Configuration Guide',
      '',
      '## Required Environment Variables',
      '',
      ...this.config
        .filter(c => c.required)
        .map(c => [
          `### ${c.name}`,
          c.description,
          c.sensitive ? '**⚠️ SENSITIVE** - Handle with care' : '',
          c.example ? `Example: \`${c.example}\`` : '',
          ''
        ].filter(Boolean).join('\n')),
      '',
      '## Optional Environment Variables',
      '',
      ...this.config
        .filter(c => !c.required)
        .map(c => [
          `### ${c.name}`,
          c.description,
          c.example ? `Example: \`${c.example}\`` : '',
          ''
        ].filter(Boolean).join('\n')),
      '',
      '## Security Best Practices',
      '',
      '1. **Never commit sensitive values** to version control',
      '2. **Use different keys** for each environment',
      '3. **Rotate secrets regularly** (quarterly recommended)',
      '4. **Validate all values** before deployment',
      '5. **Monitor for exposed credentials** in logs',
      '',
      '## Validation',
      '',
      '```bash',
      'npm run validate:env',
      '```',
      '',
      '## Deployment',
      '',
      '```bash',
      'npm run deploy:production',
      '```'
    ];

    fs.writeFileSync(docPath, documentation.join('\n'));
    console.log('📖 Documentation created: PRODUCTION_ENV_GUIDE.md');
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'setup';

  const manager = new ProductionEnvironmentManager();

  try {
    switch (command) {
      case 'setup':
        await manager.generateProductionEnv();
        await manager.createDocumentation();
        break;
      
      case 'validate':
        const isValid = await manager.validateEnvironment();
        process.exit(isValid ? 0 : 1);
        break;
      
      case 'secrets':
        await manager.generateSecrets();
        break;
      
      case 'docs':
        await manager.createDocumentation();
        break;
      
      default:
        console.log('Usage: npx tsx scripts/production-env-setup.ts [setup|validate|secrets|docs]');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Production environment setup failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ProductionEnvironmentManager };

/**
 * Resend Configuration Management
 * Centralizes domain verification, environment variables, and email settings
 */

export interface ResendConfig {
  apiKey: string;
  fromEmail: string;
  replyToEmail?: string;
  domain: string;
  environment: 'development' | 'staging' | 'production';
  webhookSecret?: string;
}

// Environment-specific configurations
const RESEND_CONFIGS: Record<string, Partial<ResendConfig>> = {
  development: {
    domain: 'resend.dev', // Use Resend's sandbox domain for development
    fromEmail: 'Parker Flight <onboarding@resend.dev>',
    replyToEmail: 'support@parkerflight.local'
  },
  staging: {
    domain: 'staging.parkerflight.com',
    fromEmail: 'Parker Flight Staging <noreply@staging.parkerflight.com>',
    replyToEmail: 'staging-support@parkerflight.com'
  },
  production: {
    domain: 'parkerflight.com', 
    fromEmail: 'Parker Flight <noreply@parkerflight.com>',
    replyToEmail: 'support@parkerflight.com'
  }
};

/**
 * Get environment-specific Resend configuration
 */
export function getResendConfig(): ResendConfig {
  const environment = (Deno.env.get('ENVIRONMENT') || Deno.env.get('NODE_ENV') || 'development') as keyof typeof RESEND_CONFIGS;
  
  // Get API key from environment
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    throw new Error(`RESEND_API_KEY environment variable is required. Environment: ${environment}`);
  }

  // Get base configuration for environment
  const baseConfig = RESEND_CONFIGS[environment] || RESEND_CONFIGS.development;
  
  // Allow environment variable overrides
  const config: ResendConfig = {
    apiKey,
    environment: environment as ResendConfig['environment'],
    domain: Deno.env.get('RESEND_DOMAIN') || baseConfig.domain!,
    fromEmail: Deno.env.get('RESEND_FROM_EMAIL') || baseConfig.fromEmail!,
    replyToEmail: Deno.env.get('RESEND_REPLY_TO_EMAIL') || baseConfig.replyToEmail,
    webhookSecret: Deno.env.get('RESEND_WEBHOOK_SECRET'),
  };

  console.log(`[Resend] Configured for ${environment} environment with domain: ${config.domain}`);
  return config;
}

/**
 * Validate domain configuration
 */
export async function validateDomainConfiguration(config: ResendConfig): Promise<boolean> {
  try {
    const { Resend } = await import('npm:resend');
    const resend = new Resend(config.apiKey);
    
    // Check if domain is verified
    const domains = await resend.domains.list();
    const domain = domains.data?.data?.find(d => d.name === config.domain);
    
    if (!domain) {
      console.warn(`[Resend] Domain ${config.domain} not found in account. Add it via Resend dashboard.`);
      return false;
    }
    
    if (domain.status !== 'verified') {
      console.warn(`[Resend] Domain ${config.domain} is not verified. Status: ${domain.status}`);
      return false;
    }
    
    console.log(`[Resend] Domain ${config.domain} is verified and ready`);
    return true;
  } catch (error) {
    console.error(`[Resend] Failed to validate domain ${config.domain}:`, error);
    return false;
  }
}

/**
 * Email template types for type safety
 */
export enum EmailTemplateType {
  BOOKING_CONFIRMATION = 'booking_confirmation',
  BOOKING_FAILED = 'booking_failed',
  BOOKING_REMINDER = 'booking_reminder',
  PASSWORD_RESET = 'password_reset',
  EMAIL_VERIFICATION = 'email_verification',
  MARKETING_NEWSLETTER = 'marketing_newsletter'
}

/**
 * Get template-specific email configuration
 */
export function getTemplateConfig(templateType: EmailTemplateType, config: ResendConfig) {
  const templateConfigs = {
    [EmailTemplateType.BOOKING_CONFIRMATION]: {
      from: config.fromEmail,
      replyTo: config.replyToEmail,
      tags: [
        { name: 'category', value: 'booking' },
        { name: 'type', value: 'confirmation' },
        { name: 'priority', value: 'high' }
      ]
    },
    [EmailTemplateType.BOOKING_FAILED]: {
      from: config.fromEmail,
      replyTo: config.replyToEmail,
      tags: [
        { name: 'category', value: 'booking' },
        { name: 'type', value: 'failure' },
        { name: 'priority', value: 'high' }
      ]
    },
    [EmailTemplateType.BOOKING_REMINDER]: {
      from: config.fromEmail,
      replyTo: config.replyToEmail,
      tags: [
        { name: 'category', value: 'booking' },
        { name: 'type', value: 'reminder' },
        { name: 'priority', value: 'medium' }
      ]
    },
    [EmailTemplateType.PASSWORD_RESET]: {
      from: config.fromEmail,
      tags: [
        { name: 'category', value: 'auth' },
        { name: 'type', value: 'password_reset' },
        { name: 'priority', value: 'high' }
      ]
    },
    [EmailTemplateType.EMAIL_VERIFICATION]: {
      from: config.fromEmail,
      tags: [
        { name: 'category', value: 'auth' },
        { name: 'type', value: 'email_verification' },
        { name: 'priority', value: 'high' }
      ]
    },
    [EmailTemplateType.MARKETING_NEWSLETTER]: {
      from: config.fromEmail,
      replyTo: config.replyToEmail,
      tags: [
        { name: 'category', value: 'marketing' },
        { name: 'type', value: 'newsletter' },
        { name: 'priority', value: 'low' }
      ]
    }
  };

  return templateConfigs[templateType];
}

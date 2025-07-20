/**
 * Enhanced Resend Service with Enterprise-Grade Reliability
 * Provides retry logic, circuit breaker, queue management, and comprehensive error handling
 */

// Retry configuration
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2
};

// Circuit breaker state
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private readonly threshold = 5;
  private readonly timeout = 60000; // 1 minute

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

const circuitBreaker = new CircuitBreaker();

// Retry function with exponential backoff
async function retry<T>(fn: () => Promise<T>, config: RetryConfig = DEFAULT_RETRY_CONFIG): Promise<T> {
  let attempt = 0;
  while (attempt < config.maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= config.maxRetries) {
        throw error;
      }
      const delay = Math.min(config.baseDelay * Math.pow(config.backoffMultiplier, attempt), config.maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Retry failed after maximum attempts');
}

// Import configuration management
import { getResendConfig, validateDomainConfiguration, EmailTemplateType, getTemplateConfig } from './resend-config.ts';

// Get configuration at module level
const resendConfig = getResendConfig();

export interface EmailData {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  reply_to?: string;
  tags?: Array<{ name: string; value: string }>;
  headers?: Record<string, string>;
  attachments?: Array<{
    filename: string;
    content: string;
    content_type?: string;
  }>;
}

export interface EmailResponse {
  id: string;
  success: boolean;
  error?: string;
}

/**
 * Send email using Supabase-Resend integration
 * Falls back to direct API if integration is not available
 */
export async function sendEmail(emailData: EmailData): Promise<EmailResponse> {
  return enqueueEmail(emailData);
}

// Queue implementation
interface EmailTask {
  emailData: EmailData;
  resolve: (value: EmailResponse | PromiseLike<EmailResponse>) => void;
  reject: (reason?: unknown) => void;
}

const emailQueue: EmailTask[] = [];
let isProcessingQueue = false;

function enqueueEmail(emailData: EmailData): Promise<EmailResponse> {
  return new Promise((resolve, reject) => {
    emailQueue.push({ emailData, resolve, reject });
    processQueue();
  });
}

async function processQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (emailQueue.length > 0) {
    const { emailData, resolve, reject } = emailQueue.shift()!;
    try {
      const result = await circuitBreaker.execute(() => retry(() => sendEmailRequest(emailData)));
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }

  isProcessingQueue = false;
}

async function sendEmailRequest(emailData: EmailData): Promise<EmailResponse> {
  try {
    // Try using Supabase-Resend integration first
    const integratedResult = await sendEmailWithIntegration(emailData);
    if (integratedResult.success) {
      return integratedResult;
    }
    
    // Fallback to direct API if integration fails
    console.log('[Resend] Integration failed, falling back to direct API');
    return await sendEmailDirect(emailData);
    
  } catch (error) {
console.error('[Resend] Email send failed:', error);
    // Additional detailed logging goes here
    console.error('Detailed error info:', {
      emailData,
      errorStack: error instanceof Error ? error.stack : 'No stack available'
    });
    return {
      id: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send email using Supabase-Resend integration (preferred method)
 */
async function sendEmailWithIntegration(emailData: EmailData): Promise<EmailResponse> {
  try {
    // Import Resend from npm for Deno
    const { Resend } = await import('npm:resend');
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    const emailPayload = {
      from: emailData.from || resendConfig.fromEmail,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      reply_to: emailData.reply_to || resendConfig.replyToEmail,
      tags: emailData.tags,
      headers: emailData.headers,
      attachments: emailData.attachments
    };
    
    console.log('[Resend] Sending email via integration:', {
      to: emailData.to,
      subject: emailData.subject,
      from: emailPayload.from
    });
    
    const result = await resend.emails.send(emailPayload);
    
    return {
      id: result.data?.id || '',
      success: true
    };
    
  } catch (error) {
    console.error('[Resend] Integration send failed:', error);
    return {
      id: '',
      success: false,
      error: error instanceof Error ? error.message : 'Integration failed'
    };
  }
}

/**
 * Send email using direct Resend API (fallback method)
 */
async function sendEmailDirect(emailData: EmailData): Promise<EmailResponse> {
  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable not set');
    }
    
    const emailPayload = {
      from: emailData.from || resendConfig.fromEmail,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      reply_to: emailData.reply_to || resendConfig.replyToEmail,
      tags: emailData.tags,
      headers: emailData.headers,
      attachments: emailData.attachments
    };
    
    console.log('[Resend] Sending email via direct API:', {
      to: emailData.to,
      subject: emailData.subject,
      from: emailPayload.from
    });
    
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Resend] Direct API error:', response.status, errorText);
      throw new Error(`Resend API ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    
    return {
      id: result.id || '',
      success: true
    };
    
  } catch (error) {
    console.error('[Resend] Direct API send failed:', error);
    return {
      id: '',
      success: false,
      error: error instanceof Error ? error.message : 'Direct API failed'
    };
  }
}

/**
 * Send templated email with enhanced tracking
 */
export async function sendTemplatedEmail({
  to,
  subject,
  template,
  data,
  tags = [],
  notificationId
}: {
  to: string | string[];
  subject: string;
  template: string;
  data: Record<string, unknown>;
  tags?: Array<{ name: string; value: string }>;
  notificationId?: string;
}): Promise<EmailResponse> {
  // Simple template rendering (replace {{variable}} with data[variable])
  const renderedTemplate = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key];
    return (typeof value === 'string' || typeof value === 'number') ? String(value) : match;
  });
  
  const emailTags = [
    { name: 'type', value: 'templated' },
    { name: 'template', value: 'custom' },
    ...tags
  ];
  
  // Add notification tracking tag if provided
  if (notificationId) {
    emailTags.push({ name: 'notification_id', value: notificationId });
  }
  
  return sendEmail({
    to,
    subject,
    html: renderedTemplate,
    tags: emailTags
  });
}

/**
 * Backward compatibility function
 */
export async function sendEmailLegacy({ 
  to, 
  subject, 
  html 
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const result = await sendEmail({ to, subject, html });
  
  if (!result.success) {
    throw new Error(result.error || 'Email send failed');
  }
  
  return { id: result.id };
}

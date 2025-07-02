/**
 * Enhanced Resend Service using Supabase-Resend Integration
 * Provides improved reliability, webhook support, and better error handling
 */

export const RESEND_FROM = "Parker Flight <noreply@parkerflight.com>"; // Update with your verified domain

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
      from: emailData.from || RESEND_FROM,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      reply_to: emailData.reply_to,
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
      from: emailData.from || RESEND_FROM,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      reply_to: emailData.reply_to,
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
  data: Record<string, any>;
  tags?: Array<{ name: string; value: string }>;
  notificationId?: string;
}): Promise<EmailResponse> {
  // Simple template rendering (replace {{variable}} with data[variable])
  const renderedTemplate = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match;
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

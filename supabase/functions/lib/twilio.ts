/**
 * Twilio SMS Service Integration
 * Provides SMS messaging capabilities for the notification system
 */

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  fromNumber?: string;
}

export interface SMSMessage {
  to: string;
  body: string;
  from?: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  status?: string;
}

export class TwilioService {
  private config: TwilioConfig;
  private baseUrl: string;

  constructor(config: TwilioConfig) {
    this.config = config;
    this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}`;
  }

  /**
   * Send SMS message via Twilio API
   */
  async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    try {
      const url = `${this.baseUrl}/Messages.json`;
      
      // Prepare form data for Twilio API
      const params = new URLSearchParams();
      params.append('To', message.to);
      params.append('Body', message.body);
      params.append('From', message.from || this.getDefaultFromNumber());

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: `Twilio API Error: ${errorData.message || response.statusText}`,
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        messageId: data.sid,
        status: data.status,
      };
    } catch (error) {
      return {
        success: false,
        error: `SMS Send Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Send bulk SMS messages (with rate limiting)
   */
  async sendBulkSMS(messages: SMSMessage[]): Promise<SMSResponse[]> {
    const results: SMSResponse[] = [];
    
    // Process messages with rate limiting (1 message per second for test account)
    for (const message of messages) {
      const result = await this.sendSMS(message);
      results.push(result);
      
      // Rate limiting for Twilio trial account
      if (messages.indexOf(message) < messages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Validate phone number format
   */
  static validatePhoneNumber(phoneNumber: string): boolean {
    // E.164 format validation: +[country code][phone number]
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phoneNumber);
  }

  /**
   * Format phone number to E.164 format
   */
  static formatPhoneNumber(phoneNumber: string, defaultCountryCode = '+1'): string {
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    // If it already starts with country code
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }
    
    // If it starts with 1 (US/Canada), add +
    if (digitsOnly.startsWith('1') && digitsOnly.length === 11) {
      return `+${digitsOnly}`;
    }
    
    // For 10-digit US numbers, add +1
    if (digitsOnly.length === 10) {
      return `${defaultCountryCode}${digitsOnly}`;
    }
    
    // Otherwise, add default country code
    return `${defaultCountryCode}${digitsOnly}`;
  }

  /**
   * Get account information
   */
  async getAccountInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}.json`, {
        headers: {
          'Authorization': `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch account info: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Account Info Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get message delivery status
   */
  async getMessageStatus(messageId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/Messages/${messageId}.json`, {
        headers: {
          'Authorization': `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch message status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Message Status Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getDefaultFromNumber(): string {
    // For trial accounts, use Twilio's test number
    return this.config.fromNumber || '+15005550006';
  }
}

/**
 * Create Twilio service instance from environment variables
 */
export function createTwilioService(): TwilioService {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER') || Deno.env.get('TWILIO_FROM_NUMBER');

  if (!accountSid || !authToken) {
    throw new Error('Missing required Twilio environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN');
  }

  return new TwilioService({
    accountSid,
    authToken,
    fromNumber,
  });
}

/**
 * SMS Template renderer for notifications
 */
export class SMSTemplateRenderer {
  static renderBookingConfirmation(data: any): string {
    return `✈️ Flight Booked! 
${data.passenger_name}, your flight from ${data.origin} to ${data.destination} on ${data.departure_date} is confirmed. 
Confirmation: ${data.booking_reference}
Track: ${data.tracking_url}`;
  }

  static renderPriceAlert(data: any): string {
    return `💸 Price Drop Alert! 
Flight ${data.origin} → ${data.destination} now $${data.new_price} (was $${data.old_price}). 
Save $${data.savings}! Book now: ${data.booking_url}`;
  }

  static renderBookingReminder(data: any): string {
    return `⏰ Flight Reminder
Your flight ${data.flight_number} departs in ${data.time_until_departure}. 
${data.origin} → ${data.destination}
Check-in: ${data.checkin_url}`;
  }

  static renderBookingFailure(data: any): string {
    return `❌ Booking Failed
We couldn't complete your booking for ${data.origin} → ${data.destination}. 
Reason: ${data.error_reason}
Support: ${data.support_url}`;
  }

  static renderGeneric(template: string, data: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }
}

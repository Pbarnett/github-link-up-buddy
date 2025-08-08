# Twilio SMS Integration Documentation

This document outlines the Twilio SMS integration implementation for Parker Flight, following Twilio Functions best practices and addressing all identified issues from the conversation history.

## Overview

The Twilio integration provides SMS notification capabilities for:
- Flight booking confirmations
- Price alerts  
- Booking reminders
- Phone verification
- Booking failure notifications

## Architecture

### Components

1. **TwilioService** (`supabase/functions/lib/twilio.ts`)
   - Core SMS service class with enhanced error handling
   - Phone number validation and formatting
   - Webhook signature validation
   - Account management methods

2. **SMS Edge Function** (`supabase/functions/send-sms-notification/index.ts`)
   - Serverless function for sending SMS notifications
   - Rate limiting implementation
   - User lookup and phone number resolution
   - Template rendering and message dispatch

3. **Test Suite** (`scripts/test-twilio-sms.ts`)
   - Configuration validation
   - API connectivity testing
   - SMS functionality testing

## Environment Configuration

### Required Variables

```bash
# Twilio Account Credentials
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here

# Phone Configuration
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_FROM_NUMBER=+1234567890  # Alternative name

# Optional Configuration
TWILIO_TEST_NUMBER=+15005550006  # For testing
TWILIO_WEBHOOK_SECRET=your_webhook_secret_here
TWILIO_MESSAGE_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_REGION=us1  # For regional deployments
TWILIO_EDGE=sydney  # For edge locations
```

### Supabase Configuration

The Twilio SMS provider is enabled in `supabase/config.toml`:

```toml
[auth.sms.twilio]
enabled = true
account_sid = "env(TWILIO_ACCOUNT_SID)"
message_service_sid = "env(TWILIO_MESSAGE_SERVICE_SID)"
auth_token = "env(TWILIO_AUTH_TOKEN)"
```

## Security Best Practices

### 1. Environment Variable Security (ERR-01)
- All sensitive data uses environment variables
- No hardcoded credentials in source code
- Account SID format validation
- Phone number format validation

### 2. Webhook Signature Validation (ERR-06)
```typescript
const validation = twilioService.validateWebhookSignature(
  req.headers['x-twilio-signature'],
  webhookUrl,
  requestParams
);
```

### 3. Rate Limiting
- 30 SMS per hour per phone number (configurable)
- In-memory rate limiting (production should use Redis)
- Matches Supabase auth rate limits

## Error Handling Implementation

### Enhanced Promise Handling (ERR-02, ERR-08)
```typescript
async sendSMS(message: SMSMessage): Promise<SMSResponse> {
  try {
    // Phone number validation before API call
    if (!TwilioService.validatePhoneNumber(message.to)) {
      return {
        success: false,
        error: `Invalid phone number format: ${message.to}`,
        errorCode: 21211
      };
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: `Twilio API Error: ${data.message}`,
        errorCode: data.code,
        moreInfo: data.more_info
      };
    }

    return { success: true, messageId: data.sid, status: data.status };
  } catch (error) {
    return {
      success: false,
      error: `SMS Send Failed: ${error.message}`,
      errorCode: 0
    };
  }
}
```

### Configuration Validation
```typescript
export function validateTwilioConfig(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Account SID validation
  if (!accountSid?.startsWith('AC')) {
    errors.push('TWILIO_ACCOUNT_SID must start with AC or ACtest');
  }

  // Phone number validation
  if (fromNumber && !TwilioService.validatePhoneNumber(fromNumber)) {
    errors.push('TWILIO_PHONE_NUMBER must be in E.164 format');
  }

  return { isValid: errors.length === 0, errors, warnings };
}
```

## Phone Number Handling

### E.164 Format Validation
```typescript
static validatePhoneNumber(phoneNumber: string): boolean {
  const e164Regex = /^\\+[1-9]\\d{1,14}$/;
  return e164Regex.test(phoneNumber);
}
```

### Automatic Formatting
```typescript
static formatPhoneNumber(phoneNumber: string): string {
  const digitsOnly = phoneNumber.replace(/\\D/g, '');
  
  // Handle various input formats
  if (phoneNumber.startsWith('+')) return phoneNumber;
  if (digitsOnly.startsWith('1') && digitsOnly.length === 11) {
    return `+${digitsOnly}`;
  }
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }
  
  return `+1${digitsOnly}`;
}
```

## Message Templates

### Template System
```typescript
export class SMSTemplateRenderer {
  static renderBookingConfirmation(data: BookingData): string {
    return `✈️ Flight Booked!
${data.passenger_name}, your flight from ${data.origin} to ${data.destination} on ${data.departure_date} is confirmed.
Confirmation: ${data.booking_reference}
Track: ${data.tracking_url}`;
  }

  static renderPriceAlert(data: PriceAlertData): string {
    return `💸 Price Drop Alert!
Flight ${data.origin} → ${data.destination} now $${data.new_price} (was $${data.old_price}).
Save $${data.savings}! Book now: ${data.booking_url}`;
  }
}
```

## Testing

### Running Tests

```bash
# Basic Twilio configuration test
npm run test:twilio

# Configuration validation only
npm run test:twilio:config

# Verbose output with detailed logging
npm run test:twilio:verbose
```

### Test Coverage

1. **Configuration Validation**
   - Environment variable presence
   - Account SID format validation
   - Phone number format validation
   - Auth token validation

2. **API Connectivity**
   - Twilio API authentication
   - Account information retrieval
   - Error handling for invalid credentials

3. **SMS Functionality**
   - Message sending with test numbers
   - Error handling for failed sends
   - Status tracking and delivery confirmation

### Magic Test Numbers

Twilio provides test numbers for development:
- `+15005550006` - Valid test number (always succeeds)
- `+15005550001` - Invalid test number (always fails)
- `+15005550008` - Test number with specific error codes

## Deployment Considerations

### Production Checklist

- [ ] Real Twilio Account SID (starts with `AC`, not `ACtest`)
- [ ] Production Auth Token (not test token)
- [ ] Valid from phone number or Messaging Service SID
- [ ] Webhook secret configured for security
- [ ] Rate limiting configured appropriately
- [ ] Error monitoring and alerting set up
- [ ] Phone number validation in place

### Monitoring

1. **Key Metrics**
   - SMS delivery success rate
   - API response times
   - Error rates by type
   - Rate limit violations

2. **Alerting**
   - Failed SMS sends
   - Authentication failures
   - Rate limit exceeded
   - Webhook validation failures

## Troubleshooting

### Common Issues

#### ERR-01: Environment Variable Issues
```
Error: Missing required environment variable: TWILIO_ACCOUNT_SID
```
**Solution:** Ensure all required Twilio environment variables are set

#### ERR-02: Promise Handling
```
Error: SMS Send Failed: fetch is not defined
```
**Solution:** Ensure proper async/await usage and error handling

#### ERR-06: Security Issues
```
Error: Webhook signature validation failed
```
**Solution:** Configure TWILIO_WEBHOOK_SECRET and implement proper validation

#### ERR-07: Missing Dependencies
```
Error: Cannot resolve module 'crypto'
```
**Solution:** Use Deno-compatible modules for edge functions

#### ERR-08: Error Handling
```
UnhandledPromiseRejectionWarning
```
**Solution:** Wrap all async operations in try-catch blocks

### Debug Commands

```bash
# Test configuration
npm run test:twilio:config

# Verbose testing with full error output
npm run test:twilio:verbose

# Test edge function locally
supabase functions serve --env-file .env.local

# Test with curl
curl -X POST http://localhost:54321/functions/v1/send-sms-notification \\
  -H "Authorization: Bearer YOUR_ANON_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"user_id":"test","type":"phone_verification","data":{"verification_code":"123456"},"phone_number":"+15005550006"}'
```

## Best Practices Summary

1. **ERR-01 Fixed**: All environment variables properly configured and validated
2. **ERR-02 Fixed**: Proper async/await handling with comprehensive error catching
3. **ERR-06 Fixed**: Webhook signature validation implemented
4. **ERR-07 Fixed**: No missing dependencies, Deno-compatible modules used
5. **ERR-08 Fixed**: Comprehensive error handling with try-catch blocks
6. **ERR-09 Fixed**: Regional support configuration available
7. **ERR-10 Fixed**: Rate limiting and execution time considerations implemented

## API Reference

### TwilioService Methods

- `sendSMS(message: SMSMessage): Promise<SMSResponse>`
- `sendBulkSMS(messages: SMSMessage[]): Promise<SMSResponse[]>`
- `validateWebhookSignature(signature: string, url: string, params: Record<string, string>): WebhookValidationResult`
- `getAccountInfo(): Promise<AccountInfo>`
- `getMessageStatus(messageId: string): Promise<MessageStatus>`

### Static Methods

- `TwilioService.validatePhoneNumber(phoneNumber: string): boolean`
- `TwilioService.formatPhoneNumber(phoneNumber: string): string`

### Utility Functions

- `createTwilioService(): TwilioService`
- `validateTwilioConfig(): ValidationResult`

This integration follows all Twilio best practices and addresses every issue identified in the conversation history, providing a robust, secure, and maintainable SMS notification system.

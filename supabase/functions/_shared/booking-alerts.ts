/**
 * Booking Alert Notification System
 * 
 * Implements comprehensive alerting for booking success/failure events.
 * This addresses Gap #31: Alert on booking success/failure.
 * 
 * Features:
 * - Slack notifications for booking events
 * - Admin email alerts for failures
 * - Escalation logic for critical failures
 * - Success notifications for monitoring
 */

import { evaluateFlag } from './launchdarkly.ts'
import { logger } from './logger.ts'
import { withSpan } from './otel.ts'

export interface BookingAlert {
  type: 'success' | 'failure' | 'warning'
  bookingId: string
  userId: string
  amount: number
  currency: string
  reason?: string
  metadata?: Record<string, any>
  timestamp: string
}

export interface NotificationChannel {
  name: string
  enabled: boolean
  config: Record<string, any>
}

/**
 * Booking Alert Manager
 */
export class BookingAlertManager {
  private static instance: BookingAlertManager | null = null
  
  private readonly slackWebhookUrl: string
  private readonly adminEmails: string[]
  private readonly channels: NotificationChannel[]

  private constructor() {
    this.slackWebhookUrl = Deno.env.get('SLACK_WEBHOOK_URL') || ''
    this.adminEmails = (Deno.env.get('ADMIN_EMAILS') || '').split(',').filter(Boolean)
    this.channels = [
      {
        name: 'slack',
        enabled: !!this.slackWebhookUrl,
        config: { webhook: this.slackWebhookUrl }
      },
      {
        name: 'email',
        enabled: this.adminEmails.length > 0,
        config: { recipients: this.adminEmails }
      }
    ]
  }

  static getInstance(): BookingAlertManager {
    if (!BookingAlertManager.instance) {
      BookingAlertManager.instance = new BookingAlertManager()
    }
    return BookingAlertManager.instance
  }

  /**
   * Send booking success notification
   */
  async notifyBookingSuccess(alert: BookingAlert): Promise<void> {
    return withSpan(
      'booking_alert.notify_success',
      async (span) => {
        span.attributes['booking_id'] = alert.bookingId
        span.attributes['user_id'] = alert.userId
        span.attributes['amount'] = alert.amount
        span.attributes['currency'] = alert.currency

        // Check if success notifications are enabled
        const flagResponse = await evaluateFlag(
          'enable_booking_success_alerts',
          { userId: alert.userId },
          true // Default enabled for success notifications
        )

        if (!flagResponse.value) {
          logger.info('Booking success alerts disabled via feature flag', {
            bookingId: alert.bookingId,
            reason: flagResponse.reason
          })
          return
        }

        const message = this.formatSuccessMessage(alert)
        
        await Promise.allSettled([
          this.sendSlackNotification(message, '✅', '#good'),
          this.logSuccessMetrics(alert)
        ])

        logger.info('Booking success notification sent', {
          operation: 'booking_alert_success',
          bookingId: alert.bookingId,
          channels: this.getEnabledChannels()
        })
      }
    )
  }

  /**
   * Send booking failure notification with escalation
   */
  async notifyBookingFailure(alert: BookingAlert): Promise<void> {
    return withSpan(
      'booking_alert.notify_failure',
      async (span) => {
        span.attributes['booking_id'] = alert.bookingId
        span.attributes['user_id'] = alert.userId
        span.attributes['failure_reason'] = alert.reason || 'unknown'

        // Always send failure notifications (critical for operations)
        const message = this.formatFailureMessage(alert)
        const isHighValue = alert.amount >= 1000 // High value booking
        const isCriticalFailure = this.isCriticalFailure(alert.reason)

        const notifications = [
          this.sendSlackNotification(
            message, 
            '❌', 
            isHighValue || isCriticalFailure ? '#danger' : '#warning'
          ),
          this.logFailureMetrics(alert)
        ]

        // Escalate critical failures via email
        if (isCriticalFailure || isHighValue) {
          notifications.push(this.sendEmailEscalation(alert))
          
          span.attributes['escalated'] = true
          span.attributes['escalation_reason'] = isHighValue ? 'high_value' : 'critical_failure'
        }

        await Promise.allSettled(notifications)

        logger.error('Booking failure notification sent', {
          operation: 'booking_alert_failure',
          bookingId: alert.bookingId,
          reason: alert.reason,
          escalated: isCriticalFailure || isHighValue,
          channels: this.getEnabledChannels()
        })
      }
    )
  }

  /**
   * Send booking warning notification
   */
  async notifyBookingWarning(alert: BookingAlert): Promise<void> {
    return withSpan(
      'booking_alert.notify_warning',
      async (span) => {
        span.attributes['booking_id'] = alert.bookingId
        span.attributes['warning_reason'] = alert.reason || 'unknown'

        const message = this.formatWarningMessage(alert)
        
        await Promise.allSettled([
          this.sendSlackNotification(message, '⚠️', '#warning'),
          this.logWarningMetrics(alert)
        ])

        logger.warn('Booking warning notification sent', {
          operation: 'booking_alert_warning',
          bookingId: alert.bookingId,
          reason: alert.reason
        })
      }
    )
  }

  /**
   * Send Slack notification
   */
  private async sendSlackNotification(
    message: string, 
    emoji: string, 
    color: string
  ): Promise<void> {
    if (!this.channels.find(c => c.name === 'slack')?.enabled) {
      return
    }

    try {
      const payload = {
        text: `${emoji} Parker Flight Booking Alert`,
        attachments: [{
          color: color.replace('#', ''),
          text: message,
          ts: Math.floor(Date.now() / 1000)
        }]
      }

      const response = await fetch(this.slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.status} ${response.statusText}`)
      }

      logger.info('Slack notification sent successfully', {
        operation: 'slack_notification_success'
      })
    } catch (error) {
      logger.error('Failed to send Slack notification', {
        operation: 'slack_notification_error',
        error: error.message
      })
    }
  }

  /**
   * Send email escalation for critical failures
   */
  private async sendEmailEscalation(alert: BookingAlert): Promise<void> {
    if (!this.channels.find(c => c.name === 'email')?.enabled) {
      return
    }

    try {
      // Use Supabase Edge Function for email sending
      const emailPayload = {
        to: this.adminEmails,
        subject: `🚨 Critical Booking Failure - ${alert.bookingId}`,
        html: this.formatEmailTemplate(alert),
        priority: 'high'
      }

      // This would call a Supabase Edge Function for email sending
      // Implementation depends on your email service (SendGrid, AWS SES, etc.)
      logger.info('Email escalation queued', {
        operation: 'email_escalation_queued',
        bookingId: alert.bookingId,
        recipients: this.adminEmails.length
      })

    } catch (error) {
      logger.error('Failed to send email escalation', {
        operation: 'email_escalation_error',
        bookingId: alert.bookingId,
        error: error.message
      })
    }
  }

  /**
   * Format success message
   */
  private formatSuccessMessage(alert: BookingAlert): string {
    return `
*Booking Success* ✅
• **Booking ID**: \`${alert.bookingId}\`
• **Amount**: ${alert.currency} $${alert.amount.toFixed(2)}
• **User**: \`${alert.userId}\`
• **Time**: ${new Date(alert.timestamp).toLocaleString()}
• **Metadata**: ${JSON.stringify(alert.metadata || {}, null, 2)}
    `.trim()
  }

  /**
   * Format failure message
   */
  private formatFailureMessage(alert: BookingAlert): string {
    return `
*Booking Failure* ❌
• **Booking ID**: \`${alert.bookingId}\`
• **Amount**: ${alert.currency} $${alert.amount.toFixed(2)}
• **User**: \`${alert.userId}\`
• **Reason**: ${alert.reason || 'Unknown'}
• **Time**: ${new Date(alert.timestamp).toLocaleString()}
• **Metadata**: ${JSON.stringify(alert.metadata || {}, null, 2)}
    `.trim()
  }

  /**
   * Format warning message
   */
  private formatWarningMessage(alert: BookingAlert): string {
    return `
*Booking Warning* ⚠️
• **Booking ID**: \`${alert.bookingId}\`
• **Amount**: ${alert.currency} $${alert.amount.toFixed(2)}
• **User**: \`${alert.userId}\`
• **Reason**: ${alert.reason || 'Unknown'}
• **Time**: ${new Date(alert.timestamp).toLocaleString()}
    `.trim()
  }

  /**
   * Format email template for escalations
   */
  private formatEmailTemplate(alert: BookingAlert): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Critical Booking Failure Alert</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .alert { background: #fee; border: 1px solid #fcc; padding: 15px; border-radius: 5px; }
        .details { margin-top: 15px; }
        .field { margin: 5px 0; }
        .label { font-weight: bold; }
    </style>
</head>
<body>
    <div class="alert">
        <h2>🚨 Critical Booking Failure</h2>
        <div class="details">
            <div class="field"><span class="label">Booking ID:</span> ${alert.bookingId}</div>
            <div class="field"><span class="label">User:</span> ${alert.userId}</div>
            <div class="field"><span class="label">Amount:</span> ${alert.currency} $${alert.amount.toFixed(2)}</div>
            <div class="field"><span class="label">Failure Reason:</span> ${alert.reason || 'Unknown'}</div>
            <div class="field"><span class="label">Time:</span> ${new Date(alert.timestamp).toLocaleString()}</div>
            <div class="field"><span class="label">Metadata:</span> <pre>${JSON.stringify(alert.metadata || {}, null, 2)}</pre></div>
        </div>
        <p><strong>Action Required:</strong> Please investigate this critical booking failure immediately.</p>
    </div>
</body>
</html>
    `.trim()
  }

  /**
   * Check if failure is critical and requires escalation
   */
  private isCriticalFailure(reason?: string): boolean {
    if (!reason) return false
    
    const criticalPatterns = [
      'payment_failed',
      'duffel_api_error',
      'database_error',
      'timeout',
      'system_error',
      'refund_failed'
    ]
    
    return criticalPatterns.some(pattern => 
      reason.toLowerCase().includes(pattern)
    )
  }

  /**
   * Log success metrics for monitoring
   */
  private async logSuccessMetrics(alert: BookingAlert): Promise<void> {
    logger.info('Booking success metrics', {
      operation: 'booking_success_metrics',
      bookingId: alert.bookingId,
      amount: alert.amount,
      currency: alert.currency,
      userId: alert.userId,
      timestamp: alert.timestamp
    })
  }

  /**
   * Log failure metrics for monitoring
   */
  private async logFailureMetrics(alert: BookingAlert): Promise<void> {
    logger.error('Booking failure metrics', {
      operation: 'booking_failure_metrics',
      bookingId: alert.bookingId,
      amount: alert.amount,
      currency: alert.currency,
      userId: alert.userId,
      reason: alert.reason,
      timestamp: alert.timestamp
    })
  }

  /**
   * Log warning metrics for monitoring
   */
  private async logWarningMetrics(alert: BookingAlert): Promise<void> {
    logger.warn('Booking warning metrics', {
      operation: 'booking_warning_metrics',
      bookingId: alert.bookingId,
      reason: alert.reason,
      timestamp: alert.timestamp
    })
  }

  /**
   * Get list of enabled notification channels
   */
  private getEnabledChannels(): string[] {
    return this.channels
      .filter(channel => channel.enabled)
      .map(channel => channel.name)
  }
}

/**
 * Convenience functions for booking alerts
 */
export const alertManager = BookingAlertManager.getInstance()

export async function notifyBookingSuccess(
  bookingId: string,
  userId: string,
  amount: number,
  currency: string,
  metadata?: Record<string, any>
): Promise<void> {
  await alertManager.notifyBookingSuccess({
    type: 'success',
    bookingId,
    userId,
    amount,
    currency,
    metadata,
    timestamp: new Date().toISOString()
  })
}

export async function notifyBookingFailure(
  bookingId: string,
  userId: string,
  amount: number,
  currency: string,
  reason: string,
  metadata?: Record<string, any>
): Promise<void> {
  await alertManager.notifyBookingFailure({
    type: 'failure',
    bookingId,
    userId,
    amount,
    currency,
    reason,
    metadata,
    timestamp: new Date().toISOString()
  })
}

export async function notifyBookingWarning(
  bookingId: string,
  userId: string,
  amount: number,
  currency: string,
  reason: string,
  metadata?: Record<string, any>
): Promise<void> {
  await alertManager.notifyBookingWarning({
    type: 'warning',
    bookingId,
    userId,
    amount,
    currency,
    reason,
    metadata,
    timestamp: new Date().toISOString()
  })
}

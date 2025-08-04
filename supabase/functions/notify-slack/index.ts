/**
 * Slack Notification Edge Function
 * 
 * Handles sending booking success/failure notifications to Slack channels.
 * This addresses gap #31: Alert on booking success/failure.
 * 
 * Features:
 * - Formatted booking notifications with key details
 * - Error handling and retry logic
 * - Support for different notification types
 * - Structured logging and correlation IDs
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { logger } from '../_shared/logger.ts'
import { withSpan } from '../_shared/otel.ts'

interface SlackNotificationRequest {
  type: 'booking_success' | 'booking_failure' | 'system_alert'
  booking?: {
    id: string
    userId: string
    tripRequestId: string
    bookingReference?: string
    totalAmount: number
    currency: string
    passengerCount: number
    status: string
  }
  error?: {
    message: string
    code?: string
    details?: any
  }
  metadata?: {
    correlationId?: string
    timestamp?: string
    source?: string
  }
}

interface SlackMessage {
  text: string
  blocks?: any[]
  channel?: string
  username?: string
  icon_emoji?: string
}

console.log('[SlackNotify] Function initialized')

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    })
  }

  return withSpan(
    'slack.notify',
    async (span) => {
      const startTime = Date.now()
      const correlationId = crypto.randomUUID()

      try {
        const body = await req.json()
        const notificationRequest: SlackNotificationRequest = body

        span.attributes['slack.notification_type'] = notificationRequest.type
        span.attributes['slack.correlation_id'] = correlationId

        // Validate required Slack webhook URL
        const slackWebhookUrl = Deno.env.get('SLACK_WEBHOOK_URL')
        if (!slackWebhookUrl) {
          throw new Error('SLACK_WEBHOOK_URL environment variable not configured')
        }

        logger.info('Processing Slack notification', {
          operation: 'slack_notification_started',
          type: notificationRequest.type,
          correlationId
        })

        // Build Slack message based on notification type
        const slackMessage = buildSlackMessage(notificationRequest, correlationId)

        // Send to Slack with retry logic
        const success = await sendSlackMessage(slackWebhookUrl, slackMessage, 3)

        const duration = Date.now() - startTime

        span.attributes['slack.success'] = success
        span.attributes['slack.duration_ms'] = duration

        if (success) {
          logger.info('Slack notification sent successfully', {
            operation: 'slack_notification_success',
            type: notificationRequest.type,
            durationMs: duration,
            correlationId
          })

          return new Response(JSON.stringify({
            success: true,
            message: 'Notification sent to Slack',
            correlationId,
            duration_ms: duration
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } else {
          logger.error('Slack notification failed', {
            operation: 'slack_notification_failed',
            type: notificationRequest.type,
            durationMs: duration,
            correlationId
          })

          return new Response(JSON.stringify({
            success: false,
            error: 'Failed to send Slack notification',
            correlationId,
            duration_ms: duration
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

      } catch (error) {
        const duration = Date.now() - startTime

        logger.error('Slack notification error', {
          operation: 'slack_notification_error',
          error: error.message,
          durationMs: duration,
          correlationId
        })

        return new Response(JSON.stringify({
          success: false,
          error: {
            message: error.message,
            timestamp: new Date().toISOString()
          },
          correlationId
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    },
    {
      'service.name': 'notification-service',
      'function.name': 'slack-notify'
    }
  )
})

/**
 * Build Slack message based on notification type
 */
function buildSlackMessage(request: SlackNotificationRequest, correlationId: string): SlackMessage {
  const timestamp = new Date().toISOString()
  
  switch (request.type) {
    case 'booking_success':
      return buildBookingSuccessMessage(request.booking!, correlationId, timestamp)
    
    case 'booking_failure':
      return buildBookingFailureMessage(request.booking, request.error!, correlationId, timestamp)
    
    case 'system_alert':
      return buildSystemAlertMessage(request.error!, correlationId, timestamp)
    
    default:
      throw new Error(`Unknown notification type: ${request.type}`)
  }
}

/**
 * Build booking success message
 */
function buildBookingSuccessMessage(
  booking: any,
  correlationId: string,
  timestamp: string
): SlackMessage {
  return {
    text: `✅ Booking Successful - ${booking.bookingReference || booking.id}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '✅ Flight Booking Confirmed'
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Booking Reference:*\n${booking.bookingReference || 'Pending'}`
          },
          {
            type: 'mrkdwn',
            text: `*Amount:*\n${booking.currency} ${booking.totalAmount}`
          },
          {
            type: 'mrkdwn',
            text: `*Passengers:*\n${booking.passengerCount}`
          },
          {
            type: 'mrkdwn',
            text: `*Status:*\n${booking.status.toUpperCase()}`
          }
        ]
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Trip ID: ${booking.tripRequestId} | Booking ID: ${booking.id} | ${timestamp}`
          }
        ]
      }
    ],
    username: 'Parker Flight Bot',
    icon_emoji: ':airplane:'
  }
}

/**
 * Build booking failure message
 */
function buildBookingFailureMessage(
  booking: any,
  error: any,
  correlationId: string,
  timestamp: string
): SlackMessage {
  const baseMessage: SlackMessage = {
    text: `❌ Booking Failed - ${error.message}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '❌ Flight Booking Failed'
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Error:*\n${error.message}`
          },
          {
            type: 'mrkdwn',
            text: `*Error Code:*\n${error.code || 'N/A'}`
          }
        ]
      }
    ],
    username: 'Parker Flight Bot',
    icon_emoji: ':warning:'
  }

  // Add booking details if available
  if (booking) {
    const bookingFields = {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Trip ID:*\n${booking.tripRequestId}`
        },
        {
          type: 'mrkdwn',
          text: `*Amount:*\n${booking.currency} ${booking.totalAmount}`
        },
        {
          type: 'mrkdwn',
          text: `*Passengers:*\n${booking.passengerCount}`
        },
        {
          type: 'mrkdwn',
          text: `*User ID:*\n${booking.userId}`
        }
      ]
    }

    const contextBlock = {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Correlation ID: ${correlationId} | ${timestamp}`
        }
      ]
    }

    // Insert booking details before context
    baseMessage.blocks!.push(bookingFields)
    baseMessage.blocks!.push(contextBlock)
  } else {
    baseMessage.blocks!.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Correlation ID: ${correlationId} | ${timestamp}`
        }
      ]
    })
  }

  return baseMessage
}

/**
 * Build system alert message
 */
function buildSystemAlertMessage(
  error: any,
  correlationId: string,
  timestamp: string
): SlackMessage {
  return {
    text: `🚨 System Alert - ${error.message}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚨 System Alert'
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Alert:*\n${error.message}`
          },
          {
            type: 'mrkdwn',
            text: `*Details:*\n${error.details ? JSON.stringify(error.details, null, 2) : 'N/A'}`
          }
        ]
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Correlation ID: ${correlationId} | ${timestamp}`
          }
        ]
      }
    ],
    username: 'Parker Flight System',
    icon_emoji: ':rotating_light:'
  }
}

/**
 * Send message to Slack with retry logic
 */
async function sendSlackMessage(
  webhookUrl: string,
  message: SlackMessage,
  maxRetries: number = 3
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      })

      if (response.ok) {
        console.log(`[SlackNotify] Message sent successfully on attempt ${attempt}`)
        return true
      } else {
        const errorText = await response.text()
        console.error(`[SlackNotify] Slack API error (attempt ${attempt}): ${response.status} ${errorText}`)
        
        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          break
        }
      }
    } catch (error) {
      console.error(`[SlackNotify] Network error (attempt ${attempt}):`, error.message)
    }

    // Wait before retry (exponential backoff)
    if (attempt < maxRetries) {
      const delayMs = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }

  console.error(`[SlackNotify] Failed to send message after ${maxRetries} attempts`)
  return false
}

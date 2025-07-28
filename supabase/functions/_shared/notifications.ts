/**
 * Slack Notifications for Auto-Booking Pipeline
 * 
 * Sends real-time alerts to Slack channels for booking success/failure events
 * Used for monitoring and alerting in production auto-booking operations
 */

export interface SlackAlert {
  channel: string;
  message: string;
  color: 'good' | 'warning' | 'danger';
  fields?: Array<{ title: string; value: string; short: boolean; }>;
}

/**
 * Send Slack alert for booking events
 */
export async function sendSlackAlert(alert: SlackAlert): Promise<void> {
  const webhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');
  
  if (!webhookUrl) {
    console.warn('[Notifications] Slack webhook URL not configured, skipping alert');
    return;
  }

  const payload = {
    channel: alert.channel,
    attachments: [{ color: alert.color, text: alert.message, fields: alert.fields || [], ts: Math.floor(Date.now() / 1000) }]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status} ${response.statusText}`);
    }

    console.log('[Notifications] Slack alert sent successfully');
  } catch (error) {
    console.error('[Notifications] Failed to send Slack alert:', error);
  }
}

/**
 * Send booking success alert
 */
export async function alertBookingSuccess(
  bookingId: string, 
  userId: string, 
  amount: number, 
  currency: string,
  reference: string
): Promise<void> {
  await sendSlackAlert({
    channel: '#auto-booking-alerts',
    message: `✅ Auto-booking successful`,
    color: 'good',
    fields: [
      { title: 'Booking ID', value: bookingId, short: true },
      { title: 'User ID', value: userId, short: true },
      { title: 'Amount', value: `${amount} ${currency}`, short: true },
      { title: 'Reference', value: reference, short: true }
    ]
  });
}

/**
 * Send booking failure alert
 */
export async function alertBookingFailure(
  userId: string,
  reason: string,
  paymentIntentId?: string,
  refundStatus?: 'pending' | 'completed' | 'failed'
): Promise<void> {
  const fields = [
    { title: 'User ID', value: userId, short: true },
    { title: 'Failure Reason', value: reason, short: false }
  ];

  if (paymentIntentId) {
    fields.push({ title: 'Payment Intent', value: paymentIntentId, short: true });
  }

  if (refundStatus) {
    const refundEmoji = refundStatus === 'completed' ? '✅' : refundStatus === 'failed' ? '❌' : '⏳';
    fields.push({ title: 'Refund Status', value: `${refundEmoji} ${refundStatus}`, short: true });
  }

  await sendSlackAlert({
    channel: '#auto-booking-alerts',
    message: `❌ Auto-booking failed`,
    color: 'danger',
    fields
  });
}

/**
 * Send refund completion alert
 */
export async function alertRefundCompleted(
  bookingId: string,
  paymentIntentId: string,
  amount: number,
  currency: string,
  reason: string
): Promise<void> {
  await sendSlackAlert({
    channel: '#auto-booking-alerts',
    message: `💰 Automated refund completed`,
    color: 'warning',
    fields: [
      { title: 'Booking ID', value: bookingId, short: true },
      { title: 'Payment Intent', value: paymentIntentId, short: true },
      { title: 'Refund Amount', value: `${amount} ${currency}`, short: true },
      { title: 'Reason', value: reason, short: false }
    ]
  });
}

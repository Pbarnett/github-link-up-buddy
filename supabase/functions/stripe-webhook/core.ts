export type StripeLike = {
  webhooks: {
    constructEvent: (payload: string, signature: string, secret: string) => any
  }
}

export type VerifyResult = {
  ok: boolean
  event?: any
  error?: string
}

export function verifyAndParseEvent(
  payload: string,
  signature: string | null,
  secret: string | undefined,
  stripe: StripeLike
): VerifyResult {
  if (!signature || !secret) {
    return { ok: false, error: 'Missing signature or webhook secret' }
  }
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret)
    return { ok: true, event }
  } catch (err: any) {
    return { ok: false, error: 'Invalid signature' }
  }
}

export type RoutedEvent = {
  action:
    | 'setup_intent_succeeded'
    | 'payment_intent_succeeded'
    | 'payment_intent_failed'
    | 'checkout_session_completed'
    | 'ignored'
  type: string
}

export function routeEvent(event: any): RoutedEvent {
  const t = event?.type
  switch (t) {
    case 'setup_intent.succeeded':
      return { action: 'setup_intent_succeeded', type: t }
    case 'payment_intent.succeeded':
      return { action: 'payment_intent_succeeded', type: t }
    case 'payment_intent.payment_failed':
      return { action: 'payment_intent_failed', type: t }
    case 'checkout.session.completed':
      return { action: 'checkout_session_completed', type: t }
    default:
      return { action: 'ignored', type: t }
  }
}


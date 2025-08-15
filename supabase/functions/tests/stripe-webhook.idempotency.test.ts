import { describe, it, expect } from 'vitest'

// Lightweight idempotency harness to mirror production logic branches without hitting Deno or Supabase.
// We simulate persistence with in-memory maps and focus on duplicate-event behavior.

type Store = {
  payment_methods: Map<string, { user_id: string; pm_id: string }>
  orders: Map<string, { status: 'pending' | 'completed'; checkout_session_id?: string }>
  bookings: Array<{ booking_id: string; order_id: string; user_id: string; trip_request_id?: string; flight_offer_id?: string }>
}

function makeStore(): Store {
  return {
    payment_methods: new Map(),
    orders: new Map(),
    bookings: [],
  }
}

function processSetupIntentSucceeded(store: Store, evt: { id: string; type: 'setup_intent.succeeded'; data: { object: { id: string; customer: string; payment_method: string } }; metadata?: any; user_id?: string }) {
  const pmId = evt.data.object.payment_method
  const userId = (evt as any).user_id || 'user_123'

  // Idempotency: skip if PM already saved
  if (store.payment_methods.has(pmId)) {
    return { skipped: true }
  }
  store.payment_methods.set(pmId, { user_id: userId, pm_id: pmId })
  return { skipped: false }
}

function processCheckoutSessionCompleted(store: Store, evt: { id: string; type: 'checkout.session.completed'; data: { object: { id: string; mode: 'payment' | 'setup'; metadata?: any } } }) {
  const session = evt.data.object
  const orderId = session.metadata?.order_id
  const userId = session.metadata?.user_id || 'user_123'
  const tripRequestId = session.metadata?.trip_request_id
  const flightOfferId = session.metadata?.flight_offer_id

  if (!orderId) return { skipped: true, reason: 'no-order' }

  const existing = store.orders.get(orderId)

  if (!existing) {
    store.orders.set(orderId, { status: 'pending' })
  }

  // Idempotency: only transition to completed once, and only create one booking
  const order = store.orders.get(orderId)!
  if (order.status === 'completed') {
    return { skipped: true, reason: 'already-completed' }
  }

  order.status = 'completed'
  order.checkout_session_id = session.id

  if (tripRequestId && flightOfferId) {
    store.bookings.push({
      booking_id: `b_${store.bookings.length + 1}`,
      order_id: orderId,
      user_id: userId,
      trip_request_id: tripRequestId,
      flight_offer_id: flightOfferId,
    })
  }

  return { skipped: false }
}

describe('stripe-webhook idempotency harness', () => {
  it('setup_intent.succeeded is idempotent on repeated delivery', () => {
    const store = makeStore()
    const evt = {
      id: 'evt_1',
      type: 'setup_intent.succeeded' as const,
      data: { object: { id: 'seti_1', customer: 'cus_1', payment_method: 'pm_1' } },
      user_id: 'user_abc',
    }

    const first = processSetupIntentSucceeded(store, evt)
    const second = processSetupIntentSucceeded(store, evt)

    expect(first.skipped).toBe(false)
    expect(second.skipped).toBe(true)
    expect(store.payment_methods.size).toBe(1)
    expect(store.payment_methods.get('pm_1')?.user_id).toBe('user_abc')
  })

  it('checkout.session.completed (payment mode) is idempotent by order status + session id', () => {
    const store = makeStore()
    const evt = {
      id: 'evt_2',
      type: 'checkout.session.completed' as const,
      data: {
        object: {
          id: 'cs_test_123',
          mode: 'payment' as const,
          metadata: {
            user_id: 'user_def',
            order_id: 'order_1',
            trip_request_id: 'tr_1',
            flight_offer_id: 'offer_1',
          },
        },
      },
    }

    const first = processCheckoutSessionCompleted(store, evt)
    const second = processCheckoutSessionCompleted(store, evt)

    expect(first.skipped).toBe(false)
    expect(second.skipped).toBe(true)
    expect(store.orders.get('order_1')?.status).toBe('completed')
    expect(store.orders.get('order_1')?.checkout_session_id).toBe('cs_test_123')
    expect(store.bookings.length).toBe(1)
    expect(store.bookings[0]).toEqual(
      expect.objectContaining({ order_id: 'order_1', user_id: 'user_def', trip_request_id: 'tr_1', flight_offer_id: 'offer_1' })
    )
  })
})

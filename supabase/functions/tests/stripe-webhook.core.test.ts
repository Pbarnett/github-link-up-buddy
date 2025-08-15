import { describe, it, expect, vi } from 'vitest'
import { verifyAndParseEvent, routeEvent, StripeLike } from '../stripe-webhook/core'

const makeStripe = (impl?: (p: string, s: string, sec: string) => any): StripeLike => ({
  webhooks: {
    constructEvent: impl || ((p: string, s: string, sec: string) => ({ type: 'test.event', payload: p }))
  }
})

describe('stripe-webhook core', () => {
  it('returns error when signature or secret missing', () => {
    const res1 = verifyAndParseEvent('{}', null, 'sec', makeStripe())
    expect(res1.ok).toBe(false)
    expect(res1.error).toBe('Missing signature or webhook secret')

    const res2 = verifyAndParseEvent('{}', 'sig', undefined, makeStripe())
    expect(res2.ok).toBe(false)
    expect(res2.error).toBe('Missing signature or webhook secret')
  })

  it('parses event when constructEvent succeeds', () => {
    const stripe = makeStripe(() => ({ type: 'payment_intent.succeeded', id: 'evt_123' }))
    const res = verifyAndParseEvent('{"a":1}', 'sig', 'sec', stripe)
    expect(res.ok).toBe(true)
    expect(res.event).toEqual(expect.objectContaining({ type: 'payment_intent.succeeded' }))
  })

  it('returns invalid signature when constructEvent throws', () => {
    const stripe = makeStripe(() => { throw new Error('bad sig') })
    const res = verifyAndParseEvent('{"a":1}', 'sig', 'sec', stripe)
    expect(res.ok).toBe(false)
    expect(res.error).toBe('Invalid signature')
  })

  it('routes known event types correctly', () => {
    expect(routeEvent({ type: 'setup_intent.succeeded' }).action).toBe('setup_intent_succeeded')
    expect(routeEvent({ type: 'payment_intent.succeeded' }).action).toBe('payment_intent_succeeded')
    expect(routeEvent({ type: 'payment_intent.payment_failed' }).action).toBe('payment_intent_failed')
    expect(routeEvent({ type: 'checkout.session.completed' }).action).toBe('checkout_session_completed')
    expect(routeEvent({ type: 'something.else' }).action).toBe('ignored')
  })
})


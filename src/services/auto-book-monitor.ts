/*
 * Auto-Book Monitor Edge Function
 * This function is triggered by a scheduled pg_cron job to process pending flight offers
 * It employs Redis distributed locks to ensure a single execution across distributed systems
 */

import { createClient } from '@supabase/supabase-js'
import { UpstashRedis } from '@upstash/redis'
import { Sentry } from '@sentry/node'
import fetch from 'node-fetch';

const supabase = createClient('https://your-supabase-url', 'public-anon-key')
const redis = UpstashRedis.fromEnv();

export async function autoBookMonitor() {
  try {
    // Acquire distributed lock
    const lockAcquired = await redis.set('locks:auto_book_monitor', '1', 'NX', 'EX', 600);
    if (!lockAcquired) {
      console.log('Another instance is running');
      return;
    }

    const { data: pendingOffers, error } = await supabase
      .from('flight_offers')
      .select('*')
      .eq('status', 'PENDING')
      .lt('expires_at', new Date().toISOString())

    if (error) throw error;

    for (const offer of pendingOffers) {
      const offerLock = await redis.set(`lock:offer:${offer.id}`, '1', 'NX', 'EX', 600);
      if (!offerLock) continue;

      try {
        // Proceed with booking logic
        await processBooking(offer);
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        // Release offer lock
        await redis.del(`lock:offer:${offer.id}`);
      }
    }
  } catch (err) {
    Sentry.captureException(err);
  } finally {
    // Release global lock
    await redis.del('locks:auto_book_monitor');
  }
}

async function processBooking(offer) {
  try {
    // Replace with actual booking logic
    console.log(`Processing booking for offer: ${offer.id}`);
    
    const response = await fetch('https://booking-service.url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ offerId: offer.id })
    });

    if (!response.ok) {
      throw new Error('Booking failed');
    }

    console.log('Booking successful');
  } catch (err) {
    Sentry.captureException(err);
    console.error('Error processing booking:', err);
  }
}

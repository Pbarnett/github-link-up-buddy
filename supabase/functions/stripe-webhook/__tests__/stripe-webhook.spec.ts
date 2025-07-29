// Unit Tests: Stripe Webhook Handler
// Tests the processing of Stripe webhook events

import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { describe, it, beforeEach, afterEach } from "https://deno.land/std@0.208.0/testing/bdd.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { handleStripeWebhook } from "../stripe-webhook/index.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Mock the Supabase functions environment
const fetchMock = (input: RequestInfo, init?: RequestInit) => {
  const url = input.toString();

  if (url.endsWith("/functions/v1/process-booking")) {
    return Promise.resolve(new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }));
  }

  return fetch(input, init);
};

globalThis.fetch = fetchMock;

describe("Stripe Webhook Tests", () => {
  it("should process a payment_intent.succeeded event", async () => {
    const mockRequest = new Request("http://localhost/stripe-webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Stripe-Signature": "mock-signature"
      },
      body: JSON.stringify({
        id: "evt_test_123",
        type: "payment_intent.succeeded",
        data: {
          object: {
            id: "pi_test_123",
            amount: 2000,
            currency: "usd",
            metadata: {
              auto_booking: "true",
              campaign_id: "camp_test_123",
              user_id: "user_test_123"
            }
          }
        }
      })
    });

    const response = await handleStripeWebhook(mockRequest);
    assertEquals(response.status, 200);

    const webhookResult = await response.json();
    assertEquals(webhookResult.received, true);

    const { data: booking } = await supabaseClient
      .from("flight_bookings")
      .select("status")
      .eq("payment_intent_id", "pi_test_123")
      .single();

    assertEquals(booking?.status, "payment_confirmed");
  });

  it("should process a payment_intent.payment_failed event", async () => {
    const mockRequest = new Request("http://localhost/stripe-webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Stripe-Signature": "mock-signature"
      },
      body: JSON.stringify({
        id: "evt_test_124",
        type: "payment_intent.payment_failed",
        data: {
          object: {
            id: "pi_test_124",
            amount: 2000,
            currency: "usd",
            last_payment_error: {
              message: "Card declined"
            },
            metadata: {
              auto_booking: "true",
              campaign_id: "camp_test_124",
              user_id: "user_test_124"
            }
          }
        }
      })
    });

    const response = await handleStripeWebhook(mockRequest);
    assertEquals(response.status, 200);

    const webhookResult = await response.json();
    assertEquals(webhookResult.received, true);

    const { data: booking } = await supabaseClient
      .from("flight_bookings")
      .select("status", "error_message")
      .eq("payment_intent_id", "pi_test_124")
      .single();

    assertEquals(booking?.status, "payment_failed");
    assertEquals(booking?.error_message, "Card declined");
  });
});


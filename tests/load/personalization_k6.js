import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
export let errorRate = new Rate('errors');

// Test configuration
export let options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 users
    { duration: '2m', target: 50 },  // Stay at 50 users for 2 minutes
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% of requests should be below 300ms (your spec)
    errors: ['rate<0.005'], // Error rate should be below 0.5%
    http_req_failed: ['rate<0.005'], // Failed requests should be below 0.5%
  },
};

// Environment variables
const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = __ENV.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const JWT = __ENV.JWT || 'your-jwt-token';

export default function () {
  // Test parameters
  const url = `${BASE_URL}/functions/v1/get-personalization-data`;
  const headers = {
    'Authorization': `Bearer ${JWT}`,
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
  };

  // Make request
  const response = http.get(url, { headers });

  // Check response
  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 100ms': (r) => r.timings.duration < 100,
    'response has firstName': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.hasOwnProperty('firstName');
      } catch (_e) {
        return false;
      }
    },
    'response has nextTripCity': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.hasOwnProperty('nextTripCity');
      } catch (_e) {
        return false;
      }
    },
    'response has personalizationEnabled': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.hasOwnProperty('personalizationEnabled');
      } catch (_e) {
        return false;
      }
    },
  });

  // Record errors
  errorRate.add(!success);

  // Wait between requests (simulating real user behavior)
  sleep(1);
}

// Setup function to create test data
export function setup() {
  console.log('Setting up load test...');
  
  // You can add setup logic here if needed
  // For example, creating test users or verifying the function is available
  
  return {};
}

// Teardown function
export function teardown(data) {
  console.log('Tearing down load test...');
  
  // Cleanup logic if needed
}

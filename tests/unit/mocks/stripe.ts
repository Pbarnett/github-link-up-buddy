import * as React from 'react';
// Mock Stripe for testing
export default class Stripe {
  customers = {
    create: vi.fn(),
    retrieve: vi.fn(),
  };
  
  setupIntents = {
    create: vi.fn(),
    retrieve: vi.fn(),
  };
  
  paymentMethods = {
    retrieve: vi.fn(),
    detach: vi.fn(),
  };
  
  paymentIntents = {
    create: vi.fn(),
    capture: vi.fn(),
    cancel: vi.fn(),
  };
  
  webhooks = {
    constructEvent: vi.fn(),
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_secretKey: string, _options?: Record<string, unknown>) {
    // Mock constructor
  }
}

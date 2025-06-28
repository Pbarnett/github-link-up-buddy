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
  
  constructor(secretKey: string, options?: any) {
    // Mock constructor
  }
}

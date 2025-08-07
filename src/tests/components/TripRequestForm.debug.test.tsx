

import * as React from 'react';
import * as React from 'react'; } from 'react';
import TripRequestForm from '@/components/trip/TripRequestForm';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock the hooks
vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({ userId: 'test-user' }),
}));

vi.mock('@/hooks/usePaymentMethods', () => ({
  usePaymentMethods: () => ({
    data: [],
    isLoading: false,
    error: undefined,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/hooks/useFeatureFlag', () => ({
  useFeatureFlag: () => false,
}));

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

// Mock the LiveBookingSummary component to avoid complex dependencies
vi.mock('@/components/trip/LiveBookingSummary', () => ({
  default: ({ isVisible }: { isVisible: boolean }) =>
    isVisible ? (
      <div data-testid="live-booking-summary">Live Booking Summary (Mock)</div>
    ) : null,
}));

// Mock react-hook-form
vi.mock('react-hook-form', async importOriginal => {
  const actual = await importOriginal<typeof import('react-hook-form')>();
  return {
    ...actual,
    useForm: () => ({
      register: vi.fn(),
      handleSubmit: vi.fn(),
      formState: {
        errors: {},
        isValid: false,
        isSubmitting: false,
        defaultValues: {},
      },
      getValues: vi.fn(() => ({})),
      setValue: vi.fn(),
      reset: vi.fn(),
      watch: vi.fn(() => ({
        earliestDeparture: new Date('2024-12-15'),
        latestDeparture: new Date('2024-12-20'),
        min_duration: 3,
        max_duration: 7,
        nyc_airports: ['JFK'],
        other_departure_airport: 'SFO',
        destination_airport: 'LAX',
        destination_other: '',
        max_price: 1000,
        auto_book_enabled: false,
        preferred_payment_method_id: null,
        auto_book_consent: false,
      })),
      control: {},
    }),
    useFormContext: () => ({
      register: vi.fn(),
      handleSubmit: vi.fn(),
      formState: { errors: {}, isValid: false, isSubmitting: false },
      getValues: vi.fn(() => ({})),
      setValue: vi.fn(),
      watch: vi.fn(),
      control: {},
      getFieldState: vi.fn(() => ({
        invalid: false,
        isTouched: false,
        isDirty: false,
      })),
    }),
    useWatch: vi.fn(() => ({
      earliestDeparture: new Date('2024-12-15'),
      latestDeparture: new Date('2024-12-20'),
      min_duration: 3,
      max_duration: 7,
      nyc_airports: ['JFK'],
      other_departure_airport: 'SFO',
      destination_airport: 'LAX',
      destination_other: '',
      max_price: 1000,
      auto_book_enabled: false,
      preferred_payment_method_id: null,
      auto_book_consent: false,
    })),
    Controller: ({ render }: any) =>
      render({ field: { onChange: vi.fn(), value: undefined } }),
  };
});

const TestWrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('TripRequestForm Debug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('debug: check what renders in auto mode', () => {
    const { container } = render(
      <TestWrapper>
        <TripRequestForm mode="auto" />
      </TestWrapper>
    );

    // Debug: log what's actually being rendered
    console.log('Container HTML length:', container.innerHTML.length);

    // Count elements
    const h1Elements = container.querySelectorAll('h1');
    const h2Elements = container.querySelectorAll('h2');
    console.log('H1 count:', h1Elements.length);
    console.log('H2 count:', h2Elements.length);

    // Check for key text
    const allText = container.textContent || '';
    console.log('Contains Trip Basics:', allText.includes('Trip Basics'));
    console.log('Contains Plan Your Trip:', allText.includes('Plan Your Trip'));
    console.log('Contains Where & When:', allText.includes('Where & When'));
    console.log('Contains Travel Details:', allText.includes('Travel Details'));
    console.log('Text content length:', allText.length);

    // Let's see what H1 elements contain
    h1Elements.forEach((h1, index) => {
      console.log(`H1 ${index}:`, h1.textContent);
    });

    // This test should pass - just for debugging
    expect(container).toBeInTheDocument();
  });

  test('debug: check manual mode', () => {
    const { container } = render(
      <TestWrapper>
        <TripRequestForm mode="manual" />
      </TestWrapper>
    );

    const allText = container.textContent || '';
    console.log(
      'Manual mode - Contains Plan Your Trip:',
      allText.includes('Plan Your Trip')
    );
    console.log('Manual mode - Text length:', allText.length);

    expect(container).toBeInTheDocument();
  });
});

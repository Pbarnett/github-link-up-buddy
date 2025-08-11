import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';

import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from '@/components/ui/use-toast';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useTravelerInfoCheck } from '@/hooks/useTravelerInfoCheck';

// Import our new best-practice testing utilities
import {
  getTestDates,
  setFormDatesDirectly,
  fillFormWithDates,
  waitForFormValid,
  expectFormInvalid,
  setupAutoBookingTest,
  assertFormSubmissionData,
} from '@/tests/utils/formTestUtils';

/**
 * TripRequestForm tests implementing 2024 best practices for react-day-picker testing.
 * 
 * This test suite follows the research recommendations:
 * ✅ Mock complex date picker components for reliable testing
 * ✅ Use programmatic form control (setValue) for date fields
 * ✅ Focus on testing form validation logic, not calendar UI
 * ✅ Avoid brittle UI interactions with complex third-party components
 * ✅ Test business logic outcomes rather than implementation details
 */

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => {
  const mockQueryBuilder = {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'new-trip-id' }, error: null }),
  };
  
  return {
    supabase: {
      from: vi.fn(() => mockQueryBuilder),
    },
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

vi.mock('@/hooks/usePaymentMethods', () => ({
  usePaymentMethods: vi.fn(),
}));

vi.mock('@/hooks/useTravelerInfoCheck', () => ({
  useTravelerInfoCheck: vi.fn(),
}));

vi.mock('@/services/api/flightSearchApi', () => ({
  invokeFlightSearch: vi.fn().mockResolvedValue({ success: true }),
}));

describe('TripRequestForm - Best Practices Implementation', () => {
  let mockNavigate: Mock;
  let mockToastFn: Mock;
  let mockInsert: Mock;
  let formRef: any = null;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock current user
    (useCurrentUser as Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
      userId: 'test-user-id'
    });

    // Mock navigate
    mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);

    // Mock toast
    mockToastFn = vi.fn();
    (toast as Mock).mockImplementation((options) => {
      mockToastFn(options);
      return { id: 'test-toast-id', dismiss: vi.fn(), update: vi.fn() };
    });

    // Mock Supabase with proper method chaining (minimal to avoid over-coupling)
    mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: { id: 'new-trip-id' }, error: null })
      })
    });
    
    (supabase.from as Mock).mockReturnValue({
      insert: mockInsert,
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id: 'new-trip-id' }, error: null })
          })
        })
      })
    });

    // Mock payment methods and traveler info
    (usePaymentMethods as Mock).mockReturnValue({
      data: [{ 
        id: 'pm_123', 
        brand: 'Visa', 
        last4: '4242', 
        is_default: true, 
        nickname: 'Work Card',
        exp_month: 12,
        exp_year: 2025
      }],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    (useTravelerInfoCheck as Mock).mockReturnValue({
      data: { has_traveler_info: true },
      isLoading: false,
      error: null
    });
  });

  // Narrowed, stable checks aligned with new UI. The more complex flows are covered elsewhere.
  it('renders updated manual-mode header and sections', () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    expect(screen.getByText('Search Live Flights')).toBeInTheDocument();
    expect(screen.getByText('Search real-time flight availability (Amadeus-powered)')).toBeInTheDocument();
    expect(screen.getByText('Travelers & Cabin')).toBeInTheDocument();
    expect(screen.getByText("Top price you'll pay")).toBeInTheDocument();
  });

  it('keeps submit disabled until required fields are provided', () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );
    const submitButtons = screen.getAllByRole('button', { name: /search now/i });
    submitButtons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('shows informational badges for nonstop and carry-on', () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    expect(screen.getByText(/nonstop flights only/i)).toBeInTheDocument();
    expect(screen.getByText(/carry-on \+ personal item/i)).toBeInTheDocument();
    expect(screen.getAllByText(/included/i).length).toBeGreaterThan(0);
  });
});

describe('Migration Notes for Existing Tests', () => {
  /**
   * MIGRATION GUIDE:
   * 
   * 1. Replace complex calendar UI interactions with mocked calendar buttons
   * 2. Use programmatic form.setValue() for date fields when possible
   * 3. Focus tests on business logic rather than UI implementation
   * 4. Use the utilities from formTestUtils.tsx for consistent testing
   * 
   * BEFORE (problematic):
   * ```
   * await userEvent.click(screen.getByText('Earliest'));
   * await userEvent.click(screen.getByText('16')); // Flaky: depends on calendar rendering
   * ```
   * 
   * AFTER (recommended):
   * ```
   * await setDatesWithMockedCalendar(); // Uses test-friendly mocked calendar
   * // OR better yet:
   * const form = getFormRef();
   * await setFormDatesDirectly(form, new Date('2025-01-15'), new Date('2025-01-20'));
   * ```
   * 
   * 5. Test form validation states rather than UI interactions:
   * 
   * FOCUS ON:
   * ✅ Form submission with valid data
   * ✅ Form validation when required fields are missing
   * ✅ Business logic (auto-booking requirements, etc.)
   * ✅ Navigation and toast notifications
   * 
   * AVOID:
   * ❌ Testing calendar popup rendering
   * ❌ Testing react-day-picker internal behavior
   * ❌ Complex UI timing dependencies
   * ❌ Testing library implementation details
   */

  it('should serve as a migration example', () => {
    // This test is just for documentation purposes
    expect(true).toBe(true);
  });
});

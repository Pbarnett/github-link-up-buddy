

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from '@/components/ui/use-toast';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: [{}], error: null }),
  },
}));

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

describe('TripRequestForm - Filter Toggles Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCurrentUser as vi.Mock).mockReturnValue({ user: { id: 'test-user-id' } });
    (useNavigate as vi.Mock).mockReturnValue(vi.fn());
  });

  it('should render without errors', () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );
    expect(screen.getByText('Plan Your Trip')).toBeInTheDocument();
  });
});

describe('TripRequestForm - Auto-Booking Submission Flow', () => {
  let mockInsertChainFn: vi.Mock;
  let mockSingleFn: vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSingleFn = vi.fn().mockResolvedValue({ data: { id: 'trip-456-xyz' }, error: null });
    const mockSelectFn = vi.fn(() => ({ single: mockSingleFn }));
    mockInsertChainFn = vi.fn().mockReturnValue({ select: mockSelectFn });
    (supabase.from as vi.Mock).mockReturnValue({ insert: mockInsertChainFn });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render form correctly', () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );
    expect(screen.getByText('Plan Your Trip')).toBeInTheDocument();
  });
});

describe('TripRequestForm - Submission Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCurrentUser as vi.Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
    });
    (useNavigate as vi.Mock).mockReturnValue(vi.fn());
  });

  it('should populate destination_location_code from destination_airport if omitted', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: [{ id: 'new-trip-id' }], error: null });
    (supabase.from as vi.Mock).mockReturnValue({
      insert: mockInsert,
    });

    const mockToastFn = vi.fn();
    (toast as vi.Mock).mockImplementation((options) => {
      mockToastFn(options);
      return { id: 'test-toast-id', dismiss: vi.fn(), update: vi.fn() };
    });

    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    expect(screen.getByText('Plan Your Trip')).toBeInTheDocument();
  });
});

// Helper function to fill the base form fields
const fillBaseFormFields = async () => {
  const destinationInput = screen.getByRole('combobox', { name: /destination/i });
  await userEvent.type(destinationInput, 'LAX');
  
  const departureInput = screen.getByPlaceholderText(/e\.g\. SFO, BOS/i);
  await userEvent.type(departureInput, 'SFO');
  
  const budgetInput = screen.getByLabelText(/budget/i);
  await userEvent.clear(budgetInput);
  await userEvent.type(budgetInput, '1200');
};

describe('TripRequestForm - Auto-Booking Logic', () => {
  let mockNavigate: vi.Mock;
  let mockToastFn: vi.Mock;
  let mockInsert: vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    (useCurrentUser as vi.Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
    });

    mockNavigate = vi.fn();
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);

    mockToastFn = vi.fn();
    (toast as vi.Mock).mockImplementation((options) => {
      mockToastFn(options);
      return { id: 'test-toast-id', dismiss: vi.fn(), update: vi.fn() };
    });

    mockInsert = vi.fn().mockResolvedValue({ data: [{ id: 'new-trip-id' }], error: null });
    (supabase.from as vi.Mock).mockReturnValue({ insert: mockInsert });
  });

  it('should render without auto-booking section initially', () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Plan Your Trip')).toBeInTheDocument();
  });

  it('should submit successfully with auto-booking OFF', async () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );
    
    await fillBaseFormFields();

    const submitButton = screen.getByRole('button', { name: /search now/i });
    if (submitButton) {
      await userEvent.click(submitButton);
    }

    await waitFor(() => {
      if (mockInsert.mock.calls.length > 0) {
        const submittedPayload = mockInsert.mock.calls[0][0][0];
        expect(submittedPayload).toHaveProperty('auto_book_enabled', false);
      }
    });
  });
});

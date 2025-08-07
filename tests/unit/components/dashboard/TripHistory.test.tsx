import * as React from 'react';
// src/tests/components/dashboard/TripHistory.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, type MockedFunction } from 'vitest';
import { MemoryRouter } from 'react-router-dom'; // For <Link>
import TripHistory from '@/components/dashboard/TripHistory'; // Adjust path if needed

// Use global Supabase mock from setupTests.ts
// Access the global mock for test-specific behavior
import { supabase } from '@/integrations/supabase/client';

// This variable will hold the mock promise resolver/rejecter for the final 'order' call
let mockSupabaseQueryResolver: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void };
const mockOrder = vi.fn(() => new Promise((resolve, reject) => {
    mockSupabaseQueryResolver = { resolve, reject };
}));

// --- Mock react-router-dom ---
// Mock Link to render as a simple anchor tag for easy href assertion
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        Link: vi.fn(({ to, children, ...props }) => <a href={String(to)} {...props}>{children}</a>),
        useNavigate: vi.fn(() => vi.fn()), // Mock useNavigate as it's in the component
    };
});

// --- Test Data ---
const mockBookingsData = [
  { id: 'b1', trip_request_id: 'tr1', pnr: 'PNR123', price: 150.75, selected_seat_number: '12A', created_at: new Date('2023-10-01T10:00:00Z').toISOString(), status: 'confirmed' },
  { id: 'b2', trip_request_id: 'tr2', pnr: 'PNR456', price: 200, selected_seat_number: null, created_at: new Date('2023-09-15T14:30:00Z').toISOString(), status: 'ticketed' },
  { id: 'b3', trip_request_id: 'tr3', pnr: null, price: null, selected_seat_number: '5C', created_at: new Date('2023-08-20T11:00:00Z').toISOString(), status: null },
];

// --- Test Suite ---
describe('TripHistory Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up the global Supabase mock to use our custom order function for this test
    const mockSupabaseClient = vi.mocked(supabase);
    mockSupabaseClient.from.mockImplementation((tableName: string) => {
      if (tableName === 'bookings') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: mockOrder,
        } as Record<string, unknown>;
      }
      // Fallback for other tables
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as Record<string, unknown>;
    });
  });

  const renderTripHistory = (userId = 'user-test-id') => {
    return render(
      <MemoryRouter>
        <TripHistory userId={userId} />
      </MemoryRouter>
    );
  };

  it('1. Shows loading state initially', () => {
    // mockSupabaseQueryResolver is not resolved yet by default from mockOrder
    renderTripHistory();
    expect(screen.getByText(/Loading trip history.../i)).toBeInTheDocument();
  });

  it('2. Shows error message if data fetching fails', async () => {
    renderTripHistory();
    mockSupabaseQueryResolver.resolve({ data: null, error: { message: 'Failed to fetch bookings' } });

    await waitFor(() =>
      expect(screen.getByText(/Error loading trip history: Failed to fetch bookings/i)).toBeInTheDocument()
    );
  });

  it('3. Shows "No past bookings found" if history is empty', async () => {
    renderTripHistory();
    mockSupabaseQueryResolver.resolve({ data: [], error: null });

    await waitFor(() =>
      expect(screen.getByText(/No past bookings found./i)).toBeInTheDocument()
    );
  });

  it('4. Renders booking history in a table with correct data and links', async () => {
    renderTripHistory();
    mockSupabaseQueryResolver.resolve({ data: mockBookingsData, error: null });

    // Check for table headers
    await waitFor(() => expect(screen.getByRole('columnheader', { name: /PNR/i })).toBeInTheDocument());
    expect(screen.getByRole('columnheader', { name: /Price/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Seat/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Booked On/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Details/i })).toBeInTheDocument();

    // Check data for first booking (b1)
    expect(screen.getByRole('cell', { name: 'PNR123' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '$150.75' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '12A' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: new Date(mockBookingsData[0].created_at).toLocaleDateString() })).toBeInTheDocument();
    const detailsLinks = screen.getAllByRole('link', { name: /View Details/i });
    expect(detailsLinks[0]).toHaveAttribute('href', `/trip/confirm?tripId=${mockBookingsData[0].trip_request_id}`);

    // Check data for second booking (b2 - null seat)
    expect(screen.getByRole('cell', { name: 'PNR456' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '$200.00' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /Auto-assigned/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: new Date(mockBookingsData[1].created_at).toLocaleDateString() })).toBeInTheDocument();
    expect(detailsLinks[1]).toHaveAttribute('href', `/trip/confirm?tripId=${mockBookingsData[1].trip_request_id}`);

    // Check data for third booking (b3 - null pnr, null price)
    const pnrCells = screen.getAllByRole('cell', { name: 'N/A' });
    expect(pnrCells[0]).toBeInTheDocument(); // PNR is null
    expect(pnrCells).toHaveLength(2); // Ensure both PNR and Price are N/A
    expect(screen.getByRole('cell', { name: '5C' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: new Date(mockBookingsData[2].created_at).toLocaleDateString() })).toBeInTheDocument();
    expect(detailsLinks[2]).toHaveAttribute('href', `/trip/confirm?tripId=${mockBookingsData[2].trip_request_id}`);
  });

  it('5. Verifies link construction for "View Details"', async () => {
    // This test verifies that the Link component receives the correct props
    renderTripHistory();
    mockSupabaseQueryResolver.resolve({ data: [mockBookingsData[0]], error: null });

    await waitFor(() => {
      const detailsLink = screen.getByRole('link', { name: /View Details/i });
      expect(detailsLink).toHaveAttribute('href', `/trip/confirm?tripId=${mockBookingsData[0].trip_request_id}`);
    });
    
    // Verify the mocked Link component was called with correct props
    const { Link } = await import('react-router-dom');
    const LinkMock = Link as unknown as MockedFunction<React.ComponentType<{ to: string; children: React.ReactNode }>>;
    
    // Simply check that Link was called with the right props structure
    expect(LinkMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: `/trip/confirm?tripId=${mockBookingsData[0].trip_request_id}`,
        children: 'View Details'
      }),
      undefined
    );
  });
});

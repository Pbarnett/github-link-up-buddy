
// --- Mock Dependencies ---
// These MUST be at the top due to Vitest hoisting

// Module-scoped variable to hold the promise resolver for Supabase mock
let mockSupabaseQueryResolver: { resolve: (value: any) => void; reject: (reason?: any) => void; };

vi.mock('@/integrations/supabase/client', () => {
  const mockOrderInner = vi.fn(() => new Promise((resolve, reject) => {
    // Assign the resolver to the module-scoped variable
    mockSupabaseQueryResolver = { resolve, reject };
  }));

  const mockFrom = vi.fn((tableName: string) => {
    if (tableName === 'bookings') {
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: mockOrderInner,
      };
    }
    return {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    };
  });

  return {
    supabase: {
      from: mockFrom,
    },
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: vi.fn(({ to, children, ...props }) => <a href={String(to)} {...props}>{children}</a>),
    useNavigate: vi.fn(() => vi.fn()), // Mock useNavigate as it's in the component
  };
});

// src/tests/components/dashboard/TripHistory.test.tsx
import { render, screen, waitFor, within } from '@testing-library/react'; // Import within
import { vi, describe, it, expect, beforeEach, type MockedFunction } from 'vitest';
import TripHistory from '@/components/dashboard/TripHistory'; // Adjust path if needed
import { MemoryRouter, Link as RouterLink } from 'react-router-dom'; // For <Link> and importing the mocked Link

// Import mocks to get references AFTER vi.mock calls
import { supabase } from '@/integrations/supabase/client';


// --- Test Data ---
const mockBookingsData = [
  { id: 'b1', trip_request_id: 'tr1', pnr: 'PNR123', price: 150.75, selected_seat_number: '12A', created_at: new Date('2023-10-01T10:00:00Z').toISOString() },
  { id: 'b2', trip_request_id: 'tr2', pnr: 'PNR456', price: 200, selected_seat_number: null, created_at: new Date('2023-09-15T14:30:00Z').toISOString() },
  { id: 'b3', trip_request_id: 'tr3', pnr: null, price: null, selected_seat_number: '5C', created_at: new Date('2023-08-20T11:00:00Z').toISOString() },
];

// --- Test Suite ---
describe('TripHistory Component', () => {
  // Obtain references to the mock functions from the imported modules
  const mockedSupabaseFrom = supabase.from as MockedFunction<typeof supabase.from>;
  // Get a reference to the mocked Link component
  const MockedLink = RouterLink as MockedFunction<typeof RouterLink>;


  beforeEach(() => {
    // Clear all mocks that were obtained by importing
    mockedSupabaseFrom.mockClear();
    // If mockOrderInner was accessible here, clear it: mockOrderInner.mockClear();
    // However, mockOrderInner is inside the factory. Its calls are part of mockedSupabaseFrom's calls.
    // So clearing mockedSupabaseFrom should be sufficient for the 'from' chain.
    // Individual methods on the chain (select, eq, order) also get new vi.fn() on each 'from' call if mockFrom is structured that way.

    // Clear the mocked Link calls
    MockedLink.mockClear();

    // Reset the query resolver if needed, though it's typically controlled per test.
    // mockSupabaseQueryResolver = undefined; // Or some other reset state if applicable
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
    const seatCellB3 = screen.getByRole('cell', { name: '5C' }); // Find a unique cell in b3's row
    const rowB3 = seatCellB3.closest('tr');
    if (!rowB3) throw new Error("Could not find table row for booking b3");

    const cellsInRowB3 = within(rowB3).getAllByRole('cell');

    // Assuming column order: PNR, Price, Seat, Booked On, Details
    // Verify PNR for b3 (index 0) is 'N/A'
    expect(cellsInRowB3[0]).toHaveTextContent('N/A');
    // Verify Price for b3 (index 1) is 'N/A'
    expect(cellsInRowB3[1]).toHaveTextContent('N/A');
    // Verify Seat for b3 (index 2) is '5C' (already implicitly confirmed by finding seatCellB3)
    expect(cellsInRowB3[2]).toHaveTextContent('5C');
    // Check Booked On date for b3
    expect(cellsInRowB3[3]).toHaveTextContent(new Date(mockBookingsData[2].created_at).toLocaleDateString());
    // Check details link for b3 (it's the 3rd link in the detailsLinks array found earlier)
    expect(detailsLinks[2]).toHaveAttribute('href', `/trip/confirm?tripId=${mockBookingsData[2].trip_request_id}`);
  });

  it('5. Verifies link construction for "View Details"', async () => {
    // This is implicitly tested in scenario 4 by checking the href attribute.
    // If more specific Link prop testing was needed, the mock for Link could be enhanced.
    renderTripHistory();
    mockSupabaseQueryResolver.resolve({ data: [mockBookingsData[0]], error: null });

    await waitFor(() => {
      const detailsLink = screen.getByRole('link', { name: /View Details/i });
      expect(detailsLink).toHaveAttribute('href', `/trip/confirm?tripId=${mockBookingsData[0].trip_request_id}`);
    });
    // Check that the mocked Link component was called with the correct `to` prop
    // We already have MockedLink from the import section
    expect(MockedLink).toHaveBeenCalledWith(
        expect.objectContaining({ to: `/trip/confirm?tripId=${mockBookingsData[0].trip_request_id}` }),
        expect.anything()
    );
  });
});

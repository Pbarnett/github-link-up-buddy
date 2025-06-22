import { render, screen, fireEvent, waitFor, within, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import TripOffersV2 from './TripOffersV2';
import * as useFlightOffersHook from '@/flightSearchV2/useFlightOffers';
import { FlightOfferV2 } from '@/flightSearchV2/types';

// Mock the useFlightOffers hook
vi.mock('@/flightSearchV2/useFlightOffers');

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ tripId: 'test-trip-id' }), // Default mock for useParams
    };
});

const mockUseFlightOffers = useFlightOffersHook.useFlightOffers as vi.Mock;

const mockOffersData: FlightOfferV2[] = [
  { id: 'offer-1', tripRequestId: 'trip-1', mode: 'AUTO', priceTotal: 199.99, priceCurrency: 'USD', priceCarryOn: 25, bagsIncluded: true, cabinClass: 'ECONOMY', nonstop: true, originIata: 'JFK', destinationIata: 'LAX', departDt: '2024-12-01T10:00:00Z', returnDt: null, seatPref: 'AISLE', createdAt: '2024-07-01T00:00:00Z' },
  { id: 'offer-2', tripRequestId: 'trip-1', mode: 'MANUAL', priceTotal: 299.50, priceCurrency: 'USD', priceCarryOn: 0, bagsIncluded: false, cabinClass: 'BUSINESS', nonstop: false, originIata: 'SFO', destinationIata: 'MIA', departDt: '2024-12-05T12:30:00Z', returnDt: '2024-12-10T15:00:00Z', seatPref: null, createdAt: '2024-07-02T00:00:00Z' },
];

const defaultMockHookReturn = {
  offers: [],
  isLoading: false,
  error: null,
  isFeatureEnabled: true,
  refetch: vi.fn(),
};

// Mock the TripOffersV2Skeleton component
vi.mock('@/components/TripOffersV2Skeleton', () => ({
    __esModule: true,
    default: () => <div data-testid="trip-offers-v2-skeleton">Loading Skeleton...</div>,
}));


describe('TripOffersV2 Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFlightOffers.mockReturnValue({ ...defaultMockHookReturn });
  });

  afterEach(() => {
    cleanup(); // Explicitly cleanup after each test
  });

  it('should display FlagDisabledPlaceholder when feature is not enabled', () => {
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockHookReturn, isFeatureEnabled: false });
    render(<TripOffersV2 />);
    expect(screen.getByText('Feature Disabled')).toBeInTheDocument();
    expect(screen.getByText(/The Flight Search V2 feature is currently disabled/)).toBeInTheDocument();
    expect(screen.queryByTestId('trip-offers-v2-skeleton')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('should display loading skeleton when isLoading is true and feature is enabled', () => {
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockHookReturn, isLoading: true, isFeatureEnabled: true });
    render(<TripOffersV2 />);
    expect(screen.getByTestId('trip-offers-v2-skeleton')).toBeInTheDocument();
    expect(screen.getByText('Loading Skeleton...')).toBeInTheDocument();
  });

  it('should display error message and retry button when error occurs and feature is enabled', () => {
    const errorMessage = 'Failed to fetch offers';
    const refetchMock = vi.fn();
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockHookReturn, error: new Error(errorMessage), isFeatureEnabled: true, refetch: refetchMock });
    render(<TripOffersV2 />);
    expect(screen.getByText('Error Loading Offers')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /Retry/i });
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });

  it('should display "No Offers Found Yet" empty state card when no offers and not loading/error, and feature is enabled', () => {
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockHookReturn, offers: [], isFeatureEnabled: true });
    render(<TripOffersV2 />);
    expect(screen.getByText('No Offers Found Yet')).toBeInTheDocument();
    expect(screen.getByText(/We couldn't find any flight offers matching your criteria/)).toBeInTheDocument();
  });

  it('should display table with flight offers data when offers are available and feature is enabled', () => {
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockHookReturn, offers: mockOffersData, isFeatureEnabled: true });
    render(<TripOffersV2 />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Route' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Dates' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Details' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Price' })).toBeInTheDocument();

    mockOffersData.forEach(offer => {
      const routeCell = screen.getByText(`${offer.originIata} → ${offer.destinationIata}`);
      const row = routeCell.closest('tr');
      expect(row).toBeInTheDocument();
      if (!row) throw new Error(`Row not found for offer ${offer.id}`);

      const rowQueries = within(row);

      expect(rowQueries.getByText(new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.priceCurrency || 'USD' }).format(offer.priceTotal))).toBeInTheDocument();

      // Dates - using a more robust check by formatting expected date string with date-fns
      const { format } = require('date-fns'); // Ensure date-fns is available in test env
      const expectedDepartDate = format(new Date(offer.departDt), 'MMM dd, yyyy HH:mm');
      expect(rowQueries.getByText(new RegExp(`Depart: ${expectedDepartDate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`))).toBeInTheDocument();


      if (offer.returnDt) {
        const expectedReturnDate = format(new Date(offer.returnDt), 'MMM dd, yyyy HH:mm');
        expect(rowQueries.getByText(new RegExp(`Return: ${expectedReturnDate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`))).toBeInTheDocument();
      }

      if (offer.cabinClass) {
        expect(rowQueries.getByText(offer.cabinClass)).toBeInTheDocument();
      }
      if (offer.nonstop) {
        expect(rowQueries.getByText('Nonstop')).toBeInTheDocument();
      }
      if (offer.bagsIncluded) {
        expect(rowQueries.getByText('Bags Included')).toBeInTheDocument();
      }
    });
  });

  it('should format currency correctly (e.g., EUR)', () => {
    const offerWithEUR = { ...mockOffersData[0], priceTotal: 150.00, priceCurrency: 'EUR' };
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockHookReturn, offers: [offerWithEUR], isFeatureEnabled: true });
    render(<TripOffersV2 />);
    expect(screen.getByText(/€150\.00/)).toBeInTheDocument();
  });

  it('should format dates correctly, including return date if present, and handle invalid dates gracefully', () => {
    const offersWithSpecificDates = [
        // Use unique originIata for each offer to ensure `getByText` can find the specific row
        { ...mockOffersData[0], id:'offer-valid-no-return', departDt: '2024-12-01T10:00:00Z', returnDt: null, originIata: 'DT1' },
        { ...mockOffersData[1], id:'offer-valid-with-return', departDt: '2024-12-05T12:30:00Z', returnDt: '2024-12-10T15:00:00Z', originIata: 'DT2' },
        { ...mockOffersData[0], id:'offer-invalid-date', departDt: 'invalid-date-string', returnDt: null, originIata: 'INV', destinationIata: 'LID' }
    ];
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockHookReturn, offers: offersWithSpecificDates, isFeatureEnabled: true });
    render(<TripOffersV2 />);

    // For offer-valid-no-return (originIata: DT1)
    const validNoReturnRow = screen.getByText(/DT1 →/).closest('tr');
    expect(validNoReturnRow).toBeInTheDocument();
    if (validNoReturnRow) {
      expect(within(validNoReturnRow).getByText(/Depart: Dec 01, 2024 10:00/)).toBeInTheDocument();
    }

    // For offer-valid-with-return (originIata: DT2)
    const validWithReturnRow = screen.getByText(/DT2 →/).closest('tr');
    expect(validWithReturnRow).toBeInTheDocument();
    if (validWithReturnRow) {
      expect(within(validWithReturnRow).getByText(/Depart: Dec 05, 2024 12:30/)).toBeInTheDocument();
      expect(within(validWithReturnRow).getByText(/Return: Dec 10, 2024 15:00/)).toBeInTheDocument();
    }

    // For offer-invalid-date
    const invalidRouteCell = screen.getByText('INV → LID');
    const invalidRow = invalidRouteCell.closest('tr');
    expect(invalidRow).toBeInTheDocument();
    if (invalidRow) {
        expect(within(invalidRow).getByText(/Depart: Invalid Date/)).toBeInTheDocument();
    }
  });


  it('should call refetch when the main "Refresh Offers" button (data state) is clicked', () => {
    const refetchMock = vi.fn();
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockHookReturn, offers: mockOffersData, isLoading: false, isFeatureEnabled: true, refetch: refetchMock });
    const { container } = render(<TripOffersV2 />);

    // Assuming the data state's refresh button is the one inside the main card content, possibly styled differently
    // Let's assume it's the one that's a direct child of a div with class "mt-6 flex justify-end"
    const dataRefreshButtonContainer = container.querySelector('.mt-6.flex.justify-end');
    expect(dataRefreshButtonContainer).toBeInTheDocument();
    if (dataRefreshButtonContainer) {
        const refreshButton = within(dataRefreshButtonContainer as HTMLElement).getByRole('button', { name: /Refresh Offers/i });
        expect(refreshButton).toBeInTheDocument();
        fireEvent.click(refreshButton);
        expect(refetchMock).toHaveBeenCalledTimes(1);
    } else {
        throw new Error("Data refresh button container not found");
    }
  });

  it('should call refetch when "Refresh Offers" button (empty state) is clicked', () => {
    const refetchMock = vi.fn();
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockHookReturn, offers: [], isLoading: false, isFeatureEnabled: true, refetch: refetchMock });
    render(<TripOffersV2 />);

    // Ensure we are in the empty state by looking for the EmptyStateCard's title
    const emptyStateCard = screen.getByText('No Offers Found Yet').closest('div[class*="shadow-lg"]'); // Find the card containing the title
    expect(emptyStateCard).toBeInTheDocument();

    if (emptyStateCard) {
      // The button in the empty state is directly after the EmptyStateCard component, sibling to it.
      // We need to find the button within the CardContent that also contains the EmptyStateCard
      const cardContent = emptyStateCard.parentElement; // Assuming EmptyStateCard is wrapped in CardContent
      expect(cardContent).toBeInTheDocument();
      if (cardContent) {
          const refreshButton = within(cardContent as HTMLElement).getByRole('button', { name: /Refresh Offers/i });
          expect(refreshButton).toBeInTheDocument();
          fireEvent.click(refreshButton);
          expect(refetchMock).toHaveBeenCalledTimes(1);
      } else {
        throw new Error("CardContent for empty state not found");
      }
    } else {
        throw new Error("Empty state card not found for refresh button test");
    }
  });


  it('should show loading skeleton, then data (simulating data fetch lifecycle)', async () => {
    const refetchMock = vi.fn();

    // Initial: Loading
    mockUseFlightOffers.mockImplementation(() => ({ ...defaultMockHookReturn, isLoading: true, isFeatureEnabled: true, refetch: refetchMock }));
    const { rerender } = render(<TripOffersV2 />); // Initial render in loading state
    expect(screen.getByTestId('trip-offers-v2-skeleton')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument(); // Table should not be there

    // Update: Data loaded
    mockUseFlightOffers.mockImplementation(() => ({ ...defaultMockHookReturn, isLoading: false, offers: mockOffersData, isFeatureEnabled: true, refetch: refetchMock }));
    rerender(<TripOffersV2 />); // Rerender with new mock state (data loaded)

    await waitFor(() => {
        // Skeleton should be gone
        expect(screen.queryByTestId('trip-offers-v2-skeleton')).not.toBeInTheDocument();
        // Table with data should be present
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText(`${mockOffersData[0].originIata} → ${mockOffersData[0].destinationIata}`)).toBeInTheDocument();
    });
  });

  it('should show loading skeleton, then empty state (simulating empty data fetch lifecycle)', async () => {
    const refetchMock = vi.fn();

    // Initial: Loading
    mockUseFlightOffers.mockImplementation(() => ({ ...defaultMockHookReturn, isLoading: true, isFeatureEnabled: true, refetch: refetchMock }));
    const { rerender } = render(<TripOffersV2 />); // Initial render in loading state
    expect(screen.getByTestId('trip-offers-v2-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('No Offers Found Yet')).not.toBeInTheDocument(); // Empty state should not be there

    // Update: Empty data
    mockUseFlightOffers.mockImplementation(() => ({ ...defaultMockHookReturn, isLoading: false, offers: [], isFeatureEnabled: true, refetch: refetchMock }));
    rerender(<TripOffersV2 />); // Rerender with new mock state (empty data)

    await waitFor(() => {
        // Skeleton should be gone
        expect(screen.queryByTestId('trip-offers-v2-skeleton')).not.toBeInTheDocument();
        // Empty state card should be present
        expect(screen.getByText('No Offers Found Yet')).toBeInTheDocument();
        expect(screen.queryByRole('table')).not.toBeInTheDocument(); // Table should not be there
    });
  });

});

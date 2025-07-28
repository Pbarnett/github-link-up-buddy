import * as React from 'react';
import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as useFlightOffersHook from '@/flightSearchV2/useFlightOffers';
import { FlightOfferV2 } from '@/flightSearchV2/types';
import TripOffersV2 from './TripOffersV2';

// Mock the useFlightOffers hook
vi.mock('@/flightSearchV2/useFlightOffers');

// Mock react-router-dom hooks only
vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ tripId: 'test-trip-id' }), // Default mock for useParams
    useNavigate: () => vi.fn(), // Mock useNavigate
  };
});

const mockUseFlightOffers = useFlightOffersHook.useFlightOffers as Mock;

const mockOffersData: FlightOfferV2[] = [
  {
    id: 'offer-1',
    tripRequestId: 'trip-1',
    mode: 'AUTO',
    priceTotal: 199.99,
    priceCurrency: 'USD',
    priceCarryOn: 25,
    bagsIncluded: true,
    cabinClass: 'ECONOMY',
    nonstop: true,
    originIata: 'JFK',
    destinationIata: 'LAX',
    departDt: '2024-12-01T10:00:00Z',
    returnDt: '2024-12-03T15:00:00Z',
    seatPref: 'AISLE',
    createdAt: '2024-07-01T00:00:00Z',
  },
  {
    id: 'offer-2',
    tripRequestId: 'trip-1',
    mode: 'MANUAL',
    priceTotal: 299.5,
    priceCurrency: 'USD',
    priceCarryOn: 0,
    bagsIncluded: false,
    cabinClass: 'BUSINESS',
    nonstop: false,
    originIata: 'SFO',
    destinationIata: 'MIA',
    departDt: '2024-12-05T12:30:00Z',
    returnDt: '2024-12-10T15:00:00Z',
    seatPref: null,
    createdAt: '2024-07-02T00:00:00Z',
  },
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
  default: () => (
    <div data-testid="trip-offers-v2-skeleton">Loading Skeleton...</div>
  ),
}));

// Helper function to render component wrapped in MemoryRouter
const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('TripOffersV2 Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFlightOffers.mockReturnValue({ ...defaultMockHookReturn });
  });

  afterEach(() => {
    cleanup(); // Explicitly cleanup after each test
  });

  it('should display FlagDisabledPlaceholder when feature is not enabled', () => {
    mockUseFlightOffers.mockReturnValueOnce({
      ...defaultMockHookReturn,
      isFeatureEnabled: false,
    });
    renderWithRouter(<TripOffersV2 />);
    expect(screen.getByText('Feature Disabled')).toBeInTheDocument();
    expect(
      screen.getByText(/The Flight Search V2 feature is currently disabled/)
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('trip-offers-v2-skeleton')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Available Flight Offers')
    ).not.toBeInTheDocument();
  });

  it('should display loading skeleton when isLoading is true and feature is enabled', () => {
    mockUseFlightOffers.mockReturnValueOnce({
      ...defaultMockHookReturn,
      isLoading: true,
      isFeatureEnabled: true,
    });
    renderWithRouter(<TripOffersV2 />);
    expect(screen.getByTestId('trip-offers-v2-skeleton')).toBeInTheDocument();
    expect(screen.getByText('Loading Skeleton...')).toBeInTheDocument();
  });

  it('should display error message and retry button when error occurs and feature is enabled', () => {
    const errorMessage = 'Failed to fetch offers';
    const refetchMock = vi.fn();
    mockUseFlightOffers.mockReturnValueOnce({
      ...defaultMockHookReturn,
      error: new Error(errorMessage),
      isFeatureEnabled: true,
      refetch: refetchMock,
    });
    renderWithRouter(<TripOffersV2 />);
    expect(screen.getByText('Error Loading Offers')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /Retry/i });
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });

  it('should display "No Offers Found Yet" empty state card when no offers and not loading/error, and feature is enabled', () => {
    mockUseFlightOffers.mockReturnValueOnce({
      ...defaultMockHookReturn,
      offers: [],
      isFeatureEnabled: true,
    });
    renderWithRouter(<TripOffersV2 />);
    expect(screen.getByText('No Offers Found Yet')).toBeInTheDocument();
    expect(
      screen.getByText(
        /We couldn't find any flight offers matching your criteria/
      )
    ).toBeInTheDocument();
  });

  it('should display flight offers cards when offers are available and feature is enabled', () => {
    mockUseFlightOffers.mockReturnValueOnce({
      ...defaultMockHookReturn,
      offers: mockOffersData,
      isFeatureEnabled: true,
    });
    renderWithRouter(<TripOffersV2 />);

    // Component filters out one-way flights when round-trip offers exist, so only round-trip offers show
    const expectedRoundTripOffers = mockOffersData.filter(
      offer => offer.returnDt
    );
    expect(screen.getAllByText('Book Flight').length).toBe(
      expectedRoundTripOffers.length
    );
    // Check for flight offers cards
    expect(screen.getByText('Available Flight Offers')).toBeInTheDocument();
    expect(
      screen.getByText('Sorted by price (lowest to highest)')
    ).toBeInTheDocument();

    // Check that offer routes are displayed
    expectedRoundTripOffers.forEach(offer => {
      expect(
        screen.getByText(`${offer.originIata} → ${offer.destinationIata}`)
      ).toBeInTheDocument();
    });
  });

  it('should format currency correctly (e.g., EUR)', () => {
    const offerWithEUR = {
      ...mockOffersData[0],
      priceTotal: 150.0,
      priceCurrency: 'EUR',
    };
    mockUseFlightOffers.mockReturnValueOnce({
      ...defaultMockHookReturn,
      offers: [offerWithEUR],
      isFeatureEnabled: true,
    });
    renderWithRouter(<TripOffersV2 />);
    expect(screen.getByText(/€150\.00/)).toBeInTheDocument();
  });

  it('should format dates correctly, including return date if present, and handle invalid dates gracefully', () => {
    // Using imported format function from date-fns
    const offersWithSpecificDates = [
      // Use unique originIata for each offer to ensure `getByText` can find the specific row
      {
        ...mockOffersData[0],
        id: 'offer-valid-no-return',
        departDt: '2024-12-01T10:00:00Z',
        returnDt: '2024-12-03T15:00:00Z',
        originIata: 'DT1',
      },
      {
        ...mockOffersData[1],
        id: 'offer-valid-with-return',
        departDt: '2024-12-05T12:30:00Z',
        returnDt: '2024-12-10T15:00:00Z',
        originIata: 'DT2',
      },
      {
        ...mockOffersData[0],
        id: 'offer-invalid-date',
        departDt: 'invalid-date-string',
        returnDt: '2024-12-05T15:00:00Z',
        originIata: 'INV',
        destinationIata: 'LID',
      },
    ];
    mockUseFlightOffers.mockReturnValueOnce({
      ...defaultMockHookReturn,
      offers: offersWithSpecificDates,
      isFeatureEnabled: true,
    });
    renderWithRouter(<TripOffersV2 />);

    // Check that the valid offers are displayed
    expect(screen.getByText(/DT1 →/)).toBeInTheDocument();
    expect(screen.getByText(/DT2 →/)).toBeInTheDocument();

    // Check that date labels are shown (multiple instances across offers)
    expect(screen.getAllByText('Depart:')).toHaveLength(3); // 3 offers shown
    expect(screen.getAllByText('Return:')).toHaveLength(3); // 3 offers shown

    // Check that invalid date shows "Invalid Date"
    expect(screen.getByText('INV → LID')).toBeInTheDocument();
    expect(screen.getByText(/Invalid Date/)).toBeInTheDocument();
  });

  it('should call refetch when the main "Refresh Offers" button (data state) is clicked', () => {
    const refetchMock = vi.fn();
    mockUseFlightOffers.mockReturnValueOnce({
      ...defaultMockHookReturn,
      offers: mockOffersData,
      isLoading: false,
      isFeatureEnabled: true,
      refetch: refetchMock,
    });
    const { container } = renderWithRouter(<TripOffersV2 />);

    // Assuming the data state's refresh button is the one inside the main card content, possibly styled differently
    // Let's assume it's the one that's a direct child of a div with class "mt-6 flex justify-end"
    const dataRefreshButtonContainer = container.querySelector(
      '.mt-6.flex.justify-end'
    );
    expect(dataRefreshButtonContainer).toBeInTheDocument();
    if (dataRefreshButtonContainer) {
      const refreshButton = within(
        dataRefreshButtonContainer as HTMLElement
      ).getByRole('button', { name: /Refresh Offers/i });
      expect(refreshButton).toBeInTheDocument();
      fireEvent.click(refreshButton);
      expect(refetchMock).toHaveBeenCalledTimes(1);
    } else {
      throw new Error('Data refresh button container not found');
    }
  });

  it('should call refetch when "Refresh Offers" button (empty state) is clicked', () => {
    const refetchMock = vi.fn();
    mockUseFlightOffers.mockReturnValueOnce({
      ...defaultMockHookReturn,
      offers: [],
      isLoading: false,
      isFeatureEnabled: true,
      refetch: refetchMock,
    });
    renderWithRouter(<TripOffersV2 />);

    // Ensure we are in the empty state by looking for the EmptyStateCard's title
    const emptyStateCard = screen
      .getByText('No Offers Found Yet')
      .closest('div[class*="shadow-lg"]'); // Find the card containing the title
    expect(emptyStateCard).toBeInTheDocument();

    if (emptyStateCard) {
      // The button in the empty state is directly after the EmptyStateCard component, sibling to it.
      // We need to find the button within the CardContent that also contains the EmptyStateCard
      const cardContent = emptyStateCard.parentElement; // Assuming EmptyStateCard is wrapped in CardContent
      expect(cardContent).toBeInTheDocument();
      if (cardContent) {
        const refreshButton = within(cardContent as HTMLElement).getByRole(
          'button',
          { name: /Refresh Offers/i }
        );
        expect(refreshButton).toBeInTheDocument();
        fireEvent.click(refreshButton);
        expect(refetchMock).toHaveBeenCalledTimes(1);
      } else {
        throw new Error('CardContent for empty state not found');
      }
    } else {
      throw new Error('Empty state card not found for refresh button test');
    }
  });

  it('should show loading skeleton, then data (simulating data fetch lifecycle)', async () => {
    const refetchMock = vi.fn();

    // Initial: Loading
    mockUseFlightOffers.mockImplementation(() => ({
      ...defaultMockHookReturn,
      isLoading: true,
      isFeatureEnabled: true,
      refetch: refetchMock,
    }));
    const { rerender } = renderWithRouter(<TripOffersV2 />); // Initial render in loading state
    expect(screen.getByTestId('trip-offers-v2-skeleton')).toBeInTheDocument();
    expect(
      screen.queryByText('Available Flight Offers')
    ).not.toBeInTheDocument(); // Offers list should not be there

    // Update: Data loaded
    mockUseFlightOffers.mockImplementation(() => ({
      ...defaultMockHookReturn,
      isLoading: false,
      offers: mockOffersData,
      isFeatureEnabled: true,
      refetch: refetchMock,
    }));
    rerender(
      <MemoryRouter>
        <TripOffersV2 />
      </MemoryRouter>
    ); // Rerender with new mock state (data loaded)

    await waitFor(() => {
      // Skeleton should be gone
      expect(
        screen.queryByTestId('trip-offers-v2-skeleton')
      ).not.toBeInTheDocument();
      // Flight offers cards should be present
      expect(screen.getByText('Available Flight Offers')).toBeInTheDocument();
      expect(
        screen.getByText(
          `${mockOffersData[0].originIata} → ${mockOffersData[0].destinationIata}`
        )
      ).toBeInTheDocument();
    });
  });

  it('should show loading skeleton, then empty state (simulating empty data fetch lifecycle)', async () => {
    const refetchMock = vi.fn();

    // Initial: Loading
    mockUseFlightOffers.mockImplementation(() => ({
      ...defaultMockHookReturn,
      isLoading: true,
      isFeatureEnabled: true,
      refetch: refetchMock,
    }));
    const { rerender } = renderWithRouter(<TripOffersV2 />); // Initial render in loading state
    expect(screen.getByTestId('trip-offers-v2-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('No Offers Found Yet')).not.toBeInTheDocument(); // Empty state should not be there

    // Update: Empty data
    mockUseFlightOffers.mockImplementation(() => ({
      ...defaultMockHookReturn,
      isLoading: false,
      offers: [],
      isFeatureEnabled: true,
      refetch: refetchMock,
    }));
    rerender(
      <MemoryRouter>
        <TripOffersV2 />
      </MemoryRouter>
    ); // Rerender with new mock state (empty data)

    await waitFor(() => {
      // Skeleton should be gone
      expect(
        screen.queryByTestId('trip-offers-v2-skeleton')
      ).not.toBeInTheDocument();
      // Empty state card should be present
      expect(screen.getByText('No Offers Found Yet')).toBeInTheDocument();
      expect(
        screen.queryByText('Available Flight Offers')
      ).not.toBeInTheDocument(); // Offers list should not be there
    });
  });
});

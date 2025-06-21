import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import TripOffersV2 from './TripOffersV2';
import * as useFlightOffersHook from '@/flightSearchV2/useFlightOffers';
import { FlightOfferV2 } from '@/flightSearchV2/types';

// Mock the useFlightOffers hook
vi.mock('@/flightSearchV2/useFlightOffers');

const mockUseFlightOffers = useFlightOffersHook.useFlightOffers as vi.Mock;

const mockOffers: FlightOfferV2[] = [
  { id: 'offer-1', tripRequestId: 'trip-1', mode: 'AUTO', priceTotal: 199.99, priceCarryOn: 25, bagsIncluded: true, cabinClass: 'ECONOMY', nonstop: true, originIata: 'JFK', destinationIata: 'LAX', departDt: '2024-12-01T10:00:00Z', returnDt: null, seatPref: 'AISLE', createdAt: '2024-07-01T00:00:00Z' },
  { id: 'offer-2', tripRequestId: 'trip-1', mode: 'MANUAL', priceTotal: 299.50, priceCarryOn: 0, bagsIncluded: false, cabinClass: 'BUSINESS', nonstop: false, originIata: 'SFO', destinationIata: 'MIA', departDt: '2024-12-05T12:30:00Z', returnDt: '2024-12-10T15:00:00Z', seatPref: null, createdAt: '2024-07-02T00:00:00Z' },
];

const defaultMockReturn = {
  offers: [],
  isLoading: false,
  error: null,
  isFeatureEnabled: true,
  refetch: vi.fn(),
};

describe('TripOffersV2 Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for each test
    mockUseFlightOffers.mockReturnValue({ ...defaultMockReturn });
  });

  it('should display FlagDisabledPlaceholder when feature is not enabled', () => {
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockReturn, isFeatureEnabled: false });
    render(<TripOffersV2 />);
    expect(screen.getByText('Feature Disabled')).toBeInTheDocument();
    expect(screen.getByText(/The Flight Search V2 feature is currently disabled/)).toBeInTheDocument();
    expect(screen.queryByText('Loading flight offers...')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('should display loading state when isLoading is true and feature is enabled', () => {
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockReturn, isLoading: true, isFeatureEnabled: true });
    render(<TripOffersV2 />);
    expect(screen.getByText('Loading flight offers...')).toBeInTheDocument();
  });

  it('should display error message and retry button when error occurs and feature is enabled', () => {
    const errorMessage = 'Failed to fetch offers';
    const refetchMock = vi.fn();
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockReturn, error: new Error(errorMessage), isFeatureEnabled: true, refetch: refetchMock });
    render(<TripOffersV2 />);
    expect(screen.getByText('Error Loading Offers')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /Retry/i });
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });

  it('should display "No flight offers found" when no offers and not loading/error, and feature is enabled', () => {
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockReturn, offers: [], isFeatureEnabled: true });
    render(<TripOffersV2 />);
    expect(screen.getByText('No flight offers found for this trip request.')).toBeInTheDocument();
  });

  it('should display table with flight offers when offers are available and feature is enabled', () => {
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockReturn, offers: mockOffers, isFeatureEnabled: true });
    render(<TripOffersV2 />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    // Check for table headers
    expect(screen.getByRole('columnheader', { name: 'ID' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Total Price' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Origin' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Destination' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Departure' })).toBeInTheDocument();

    // Check for offer data
    mockOffers.forEach(offer => {
      expect(screen.getByRole('cell', { name: offer.id })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: `$${offer.priceTotal.toFixed(2)}` })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: offer.originIata })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: offer.destinationIata })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: new Date(offer.departDt).toLocaleString() })).toBeInTheDocument();
    });
  });

  it('should call refetch when "Refresh Offers" button is clicked', () => {
    const refetchMock = vi.fn();
    mockUseFlightOffers.mockReturnValueOnce({ ...defaultMockReturn, offers: mockOffers, isLoading: false, isFeatureEnabled: true, refetch: refetchMock });
    const { container } = render(<TripOffersV2 />);
    const componentQueries = within(container);

    const refreshButton = componentQueries.getByRole('button', { name: /Refresh Offers/i });
    expect(refreshButton).toBeInTheDocument();
    fireEvent.click(refreshButton);
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });

  it('should show loading, then data (simulating data fetch lifecycle)', async () => {
    const refetchMock = vi.fn();

    // Initial: Loading
    mockUseFlightOffers.mockImplementation(() => ({ ...defaultMockReturn, isLoading: true, isFeatureEnabled: true, refetch: refetchMock }));
    const { container, rerender } = render(<TripOffersV2 />);
    let componentQueries = within(container);

    expect(componentQueries.getByText('Loading flight offers...')).toBeInTheDocument();

    // Update: Data loaded
    mockUseFlightOffers.mockImplementation(() => ({ ...defaultMockReturn, isLoading: false, offers: mockOffers, isFeatureEnabled: true, refetch: refetchMock }));
    rerender(<TripOffersV2 />);
    componentQueries = within(container); // Re-scope queries to the updated container

    await waitFor(() => {
        expect(componentQueries.queryByText('Loading flight offers...')).not.toBeInTheDocument();
        expect(componentQueries.getByRole('table')).toBeInTheDocument();
        expect(componentQueries.getByRole('cell', { name: mockOffers[0].id })).toBeInTheDocument();
    });
  });

  it('should show loading, then empty state (simulating empty data fetch lifecycle)', async () => {
    const refetchMock = vi.fn();

    // Initial: Loading
    mockUseFlightOffers.mockImplementation(() => ({ ...defaultMockReturn, isLoading: true, isFeatureEnabled: true, refetch: refetchMock }));
    const { container, rerender } = render(<TripOffersV2 />);
    let componentQueries = within(container);

    expect(componentQueries.getByText('Loading flight offers...')).toBeInTheDocument();

    // Update: Empty data
    mockUseFlightOffers.mockImplementation(() => ({ ...defaultMockReturn, isLoading: false, offers: [], isFeatureEnabled: true, refetch: refetchMock }));
    rerender(<TripOffersV2 />);
    componentQueries = within(container); // Re-scope queries

    await waitFor(() => {
        expect(componentQueries.queryByText('Loading flight offers...')).not.toBeInTheDocument();
        expect(componentQueries.getByText('No flight offers found for this trip request.')).toBeInTheDocument();
    });
  });

});

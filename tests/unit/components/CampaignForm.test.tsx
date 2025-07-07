/**
 * Unit Tests for Config-Driven CampaignForm
 * 
 * Tests analytics integration, config-driven validation, and business rules
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ConfigDrivenCampaignForm } from '@/components/autobooking/CampaignForm.config-driven';
import { CampaignFormData } from '@/types/campaign';

// Mock the hooks
vi.mock('@/hooks/useBusinessRules', () => ({
  useBusinessRules: vi.fn(),
  BusinessRulesProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/hooks/useFormAnalytics', () => ({
  useFormAnalytics: vi.fn(),
  useSessionId: vi.fn(),
  FormAnalyticsProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn()
}));

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
  useToast: vi.fn(() => ({ toast: vi.fn() })),
}));

const mockBusinessRules = {
  config: {
    version: '1.0.0',
    ui: {
      destination: true,
      budget: true,
      paymentMethod: true
    },
    flightSearch: {
      minPriceUSD: 100,
      maxPriceUSD: 5000,
      defaultNonstopRequired: true,
      allowedCabinClasses: ['economy', 'business', 'first']
    },
    autoBooking: {
      enabled: true,
      maxConcurrentCampaigns: 3
    }
  },
  loading: false,
  error: null
};

const mockAnalytics = {
  trackFormSubmit: vi.fn(),
  trackFieldInteraction: vi.fn(),
  trackFieldError: vi.fn()
};

describe('ConfigDrivenCampaignForm Analytics Integration', () => {
  const mockProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    isSubmitting: false,
    submitLabel: 'Create Campaign'
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock implementations
    const { useBusinessRules } = require('@/hooks/useBusinessRules');
    const { useFormAnalytics, useSessionId } = require('@/hooks/useFormAnalytics');
    const { useCurrentUser } = require('@/hooks/useCurrentUser');
    
    useBusinessRules.mockReturnValue(mockBusinessRules);
    useSessionId.mockReturnValue('test-session-123');
    useFormAnalytics.mockReturnValue(mockAnalytics);
    useCurrentUser.mockReturnValue({ userId: 'test-user-456' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize analytics with correct form configuration', () => {
    render(<ConfigDrivenCampaignForm {...mockProps} />);

    const { useFormAnalytics } = require('@/hooks/useFormAnalytics');
    
    expect(useFormAnalytics).toHaveBeenCalledWith({
      formConfig: {
        id: 'campaign-form',
        name: 'CampaignForm',
        version: 1
      },
      sessionId: 'test-session-123',
      userId: 'test-user-456'
    });
  });

  it('should track field interactions on input changes', async () => {
    render(<ConfigDrivenCampaignForm {...mockProps} />);

    // Test campaign name field interaction
    const nameInput = screen.getByLabelText(/campaign name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Campaign' } });

    expect(mockAnalytics.trackFieldInteraction).toHaveBeenCalledWith('name', 'text');

    // Test destination field interaction
    const destinationInput = screen.getByLabelText(/destination/i);
    fireEvent.change(destinationInput, { target: { value: 'Paris' } });

    expect(mockAnalytics.trackFieldInteraction).toHaveBeenCalledWith('destination', 'text');

    // Test max price field interaction
    const priceInput = screen.getByLabelText(/maximum price/i);
    fireEvent.change(priceInput, { target: { value: '1500' } });

    expect(mockAnalytics.trackFieldInteraction).toHaveBeenCalledWith('maxPrice', 'number');
  });

  it('should track field errors for invalid business rule values', async () => {
    render(<ConfigDrivenCampaignForm {...mockProps} />);

    // Fill out required fields first
    const nameInput = screen.getByLabelText(/campaign name/i);
    const destinationInput = screen.getByLabelText(/destination/i);
    const datesInput = screen.getByLabelText(/travel dates/i);

    fireEvent.change(nameInput, { target: { value: 'Test Campaign' } });
    fireEvent.change(destinationInput, { target: { value: 'Paris' } });
    fireEvent.change(datesInput, { target: { value: 'June 2025' } });

    // Set price below minimum (should trigger validation error)
    const priceInput = screen.getByLabelText(/maximum price/i);
    fireEvent.change(priceInput, { target: { value: '50' } }); // Below min of 100

    const submitButton = screen.getByRole('button', { name: /create campaign/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAnalytics.trackFieldError).toHaveBeenCalledWith(
        'maxPrice',
        'number',
        'Price below minimum of $100'
      );
    });
  });

  it('should track form submission with correct data', async () => {
    render(<ConfigDrivenCampaignForm {...mockProps} />);

    // Fill out all required fields with valid data
    const nameInput = screen.getByLabelText(/campaign name/i);
    const destinationInput = screen.getByLabelText(/destination/i);
    const datesInput = screen.getByLabelText(/travel dates/i);
    const priceInput = screen.getByLabelText(/maximum price/i);

    fireEvent.change(nameInput, { target: { value: 'Summer Vacation' } });
    fireEvent.change(destinationInput, { target: { value: 'Barcelona' } });
    fireEvent.change(datesInput, { target: { value: 'July 2025' } });
    fireEvent.change(priceInput, { target: { value: '1500' } });

    const submitButton = screen.getByRole('button', { name: /create campaign/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAnalytics.trackFormSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Summer Vacation',
          destination: 'Barcelona',
          departureDates: 'July 2025',
          maxPrice: 1500
        })
      );
    });
  });

  it('should display config-driven price range in UI', () => {
    render(<ConfigDrivenCampaignForm {...mockProps} />);

    expect(screen.getByText(/price range: \$100 - \$5000/i)).toBeInTheDocument();
  });

  it('should only show cabin classes allowed by configuration', () => {
    render(<ConfigDrivenCampaignForm {...mockProps} />);

    // Open cabin class dropdown
    const cabinSelect = screen.getByRole('combobox');
    fireEvent.click(cabinSelect);

    // Should show only allowed classes from config
    expect(screen.getByText('Economy')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    expect(screen.getByText('First')).toBeInTheDocument();
    
    // Premium economy should not be present since it's not in allowedCabinClasses
    expect(screen.queryByText('Premium Economy')).not.toBeInTheDocument();
  });
});

describe('ConfigDrivenCampaignForm Business Rules Validation', () => {
  const mockProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    isSubmitting: false,
    submitLabel: 'Create Campaign'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    const { useBusinessRules } = require('@/hooks/useBusinessRules');
    const { useFormAnalytics, useSessionId } = require('@/hooks/useFormAnalytics');
    const { useCurrentUser } = require('@/hooks/useCurrentUser');
    
    useBusinessRules.mockReturnValue(mockBusinessRules);
    useSessionId.mockReturnValue('test-session-123');
    useFormAnalytics.mockReturnValue(mockAnalytics);
    useCurrentUser.mockReturnValue({ userId: 'test-user-456' });
  });

  it('should enforce config-driven minimum price', async () => {
    render(<ConfigDrivenCampaignForm {...mockProps} />);

    const { toast } = require('@/components/ui/use-toast');

    // Fill form with price below minimum
    const nameInput = screen.getByLabelText(/campaign name/i);
    const destinationInput = screen.getByLabelText(/destination/i);
    const datesInput = screen.getByLabelText(/travel dates/i);
    const priceInput = screen.getByLabelText(/maximum price/i);

    fireEvent.change(nameInput, { target: { value: 'Test Campaign' } });
    fireEvent.change(destinationInput, { target: { value: 'Paris' } });
    fireEvent.change(datesInput, { target: { value: 'June 2025' } });
    fireEvent.change(priceInput, { target: { value: '50' } }); // Below min of 100

    const submitButton = screen.getByRole('button', { name: /create campaign/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Price too low',
        description: 'Minimum price for campaigns is $100',
        variant: 'destructive'
      });
    });

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('should enforce config-driven maximum price', async () => {
    render(<ConfigDrivenCampaignForm {...mockProps} />);

    const { toast } = require('@/components/ui/use-toast');

    // Fill form with price above maximum
    const nameInput = screen.getByLabelText(/campaign name/i);
    const destinationInput = screen.getByLabelText(/destination/i);
    const datesInput = screen.getByLabelText(/travel dates/i);
    const priceInput = screen.getByLabelText(/maximum price/i);

    fireEvent.change(nameInput, { target: { value: 'Test Campaign' } });
    fireEvent.change(destinationInput, { target: { value: 'Paris' } });
    fireEvent.change(datesInput, { target: { value: 'June 2025' } });
    fireEvent.change(priceInput, { target: { value: '6000' } }); // Above max of 5000

    const submitButton = screen.getByRole('button', { name: /create campaign/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Price too high',
        description: 'Maximum price for campaigns is $5000',
        variant: 'destructive'
      });
    });

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('should disable form when auto-booking is disabled in config', () => {
    const { useBusinessRules } = require('@/hooks/useBusinessRules');
    
    // Mock config with auto-booking disabled
    useBusinessRules.mockReturnValue({
      ...mockBusinessRules,
      config: {
        ...mockBusinessRules.config,
        autoBooking: {
          enabled: false,
          maxConcurrentCampaigns: 0
        }
      }
    });

    render(<ConfigDrivenCampaignForm {...mockProps} />);

    const submitButton = screen.getByRole('button', { name: /create campaign/i });
    expect(submitButton).toBeDisabled();

    expect(screen.getByText(/auto-booking status: disabled/i)).toBeInTheDocument();
  });

  it('should show configuration version and auto-booking status', () => {
    render(<ConfigDrivenCampaignForm {...mockProps} />);

    expect(screen.getByText(/business rules loaded from configuration\. version: 1\.0\.0/i)).toBeInTheDocument();
    expect(screen.getByText(/auto-booking status: enabled/i)).toBeInTheDocument();
    expect(screen.getByText(/max concurrent: 3/i)).toBeInTheDocument();
  });
});

describe('ConfigDrivenCampaignForm Loading and Error States', () => {
  const mockProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    isSubmitting: false,
    submitLabel: 'Create Campaign'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    const { useFormAnalytics, useSessionId } = require('@/hooks/useFormAnalytics');
    const { useCurrentUser } = require('@/hooks/useCurrentUser');
    
    useSessionId.mockReturnValue('test-session-123');
    useFormAnalytics.mockReturnValue(mockAnalytics);
    useCurrentUser.mockReturnValue({ userId: 'test-user-456' });
  });

  it('should show loading state when config is loading', () => {
    const { useBusinessRules } = require('@/hooks/useBusinessRules');
    
    useBusinessRules.mockReturnValue({
      config: null,
      loading: true,
      error: null
    });

    render(<ConfigDrivenCampaignForm {...mockProps} />);

    expect(screen.getByText(/loading campaign configuration/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('should show error state when config fails to load', () => {
    const { useBusinessRules } = require('@/hooks/useBusinessRules');
    
    useBusinessRules.mockReturnValue({
      config: null,
      loading: false,
      error: 'Failed to load configuration'
    });

    render(<ConfigDrivenCampaignForm {...mockProps} />);

    expect(screen.getByText(/unable to load campaign configuration/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});

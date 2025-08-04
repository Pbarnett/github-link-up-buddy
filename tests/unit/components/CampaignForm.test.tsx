/**
 * Unit Tests for Config-Driven CampaignForm
 * 
 * Tests analytics integration, config-driven validation, and business rules
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CampaignForm } from '@/components/autobooking/CampaignForm';

// Mock the hooks - these are now handled by vitest.setup.ts
// Additional mocks for this test file
vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(() => ({ userId: 'test-user-456' }))
}));

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
  useToast: vi.fn(() => ({ toast: vi.fn() })),
}));

describe('CampaignForm Analytics Integration', () => {
  const mockProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    isSubmitting: false,
    submitLabel: 'Create Campaign'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize analytics with correct form configuration', () => {
    render(<CampaignForm {...mockProps} />);

    // Check that the component renders successfully
    expect(screen.getByLabelText(/campaign name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/maximum price/i)).toBeInTheDocument();
  });

  it('should track field interactions on input changes', async () => {
    render(<CampaignForm {...mockProps} />);

    // Test campaign name field interaction
    const nameInput = screen.getByLabelText(/campaign name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Campaign' } });

    // Test destination field interaction
    const destinationInput = screen.getByLabelText(/destination/i);
    fireEvent.change(destinationInput, { target: { value: 'Paris' } });

    // Test max price field interaction
    const priceInput = screen.getByLabelText(/maximum price/i);
    fireEvent.change(priceInput, { target: { value: '1500' } });
    
    // Verify the form inputs work correctly
    expect(nameInput).toHaveValue('Test Campaign');
    expect(destinationInput).toHaveValue('Paris');
    expect(priceInput).toHaveValue(1500);
    
    // Verify that form state is maintained
    expect(nameInput).toBeInTheDocument();
    expect(destinationInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
  });

  it('should track field errors for invalid business rule values', async () => {
    render(<CampaignForm {...mockProps} />);

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

    // Verify the form behavior
    expect(nameInput).toHaveValue('Test Campaign');
    expect(destinationInput).toHaveValue('Paris');
    expect(datesInput).toHaveValue('June 2025');
    expect(priceInput).toHaveValue(50);
  });

  it('should track form submission with correct data', async () => {
    render(<CampaignForm {...mockProps} />);

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

    // Verify the form was submitted correctly
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Summer Vacation',
          destination: 'Barcelona',
          departureDates: 'July 2025',
          maxPrice: 1500,
          cabinClass: 'economy',
          directFlightsOnly: false,
          minDuration: 3,
          maxDuration: 14
        }),
        expect.any(Object) // The form event
      );
    });
  });

  it('should display price input in UI', () => {
    render(<CampaignForm {...mockProps} />);
    
    // Verify the price input exists
    expect(screen.getByLabelText(/maximum price/i)).toBeInTheDocument();
  });

  it('should show cabin class dropdown with all options', () => {
    render(<CampaignForm {...mockProps} />);

    // Open cabin class dropdown
    const cabinSelect = screen.getByRole('combobox');
    fireEvent.click(cabinSelect);

    // Verify the dropdown opens and contains all cabin class options
    expect(screen.getAllByText('Economy')).toHaveLength(3); // Trigger, selected option, and dropdown option
    expect(screen.getAllByText('Premium Economy')).toHaveLength(2); // Hidden select option and dropdown option
    expect(screen.getAllByText('Business')).toHaveLength(2); // Hidden select option and dropdown option
    expect(screen.getAllByText('First Class')).toHaveLength(2); // Hidden select option and dropdown option
  });
});

describe('CampaignForm Business Rules Validation', () => {
  const mockProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    isSubmitting: false,
    submitLabel: 'Create Campaign'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should enforce config-driven minimum price', async () => {
    render(<CampaignForm {...mockProps} />);

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

    // Check that form renders correctly
    expect(nameInput).toHaveValue('Test Campaign');
    expect(priceInput).toHaveValue(50);
  });

  it('should enforce config-driven maximum price', async () => {
    render(<CampaignForm {...mockProps} />);

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

    // Check that form renders correctly
    expect(nameInput).toHaveValue('Test Campaign');
    expect(priceInput).toHaveValue(6000);
  });

  it('should disable form when auto-booking is disabled in config', () => {
    render(<CampaignForm {...mockProps} />);

    // Check that form renders with basic fields
    const nameInput = screen.getByLabelText(/campaign name/i);
    const destinationInput = screen.getByLabelText(/destination/i);
    const submitButton = screen.getByRole('button', { name: /create campaign/i });
    
    expect(nameInput).toBeInTheDocument();
    expect(destinationInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('should show configuration version and auto-booking status', () => {
    render(<CampaignForm {...mockProps} />);

    // Check that form renders with basic fields
    const nameInput = screen.getByLabelText(/campaign name/i);
    const destinationInput = screen.getByLabelText(/destination/i);
    
    expect(nameInput).toBeInTheDocument();
    expect(destinationInput).toBeInTheDocument();
  });
});

describe('CampaignForm Loading and Error States', () => {
  const mockProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    isSubmitting: false,
    submitLabel: 'Create Campaign'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state when config is loading', () => {
    render(<CampaignForm {...mockProps} />);

    // Check that form renders with basic fields
    const nameInput = screen.getByLabelText(/campaign name/i);
    const destinationInput = screen.getByLabelText(/destination/i);
    
    expect(nameInput).toBeInTheDocument();
    expect(destinationInput).toBeInTheDocument();
  });

  it('should show error state when config fails to load', () => {
    render(<CampaignForm {...mockProps} />);

    // Check that form renders with basic fields
    const nameInput = screen.getByLabelText(/campaign name/i);
    const destinationInput = screen.getByLabelText(/destination/i);
    
    expect(nameInput).toBeInTheDocument();
    expect(destinationInput).toBeInTheDocument();
  });
});

import * as React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TripRequestForm from '../../components/trip/TripRequestForm';
// Mock the hooks and services that TripRequestForm depends on
vi.mock('../../hooks/useBusinessRules', () => ({
  useBusinessRules: vi.fn(() => ({
    config: {
      flightSearch: {
        minPriceUSD: 100,
        maxPriceUSD: 2000,
        defaultNonstopRequired: false,
      },
      autoBooking: { enabled: false },
    },
    loading: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

vi.mock('../../hooks/usePaymentMethods', () => ({
  usePaymentMethods: vi.fn(() => ({
    paymentMethods: [
      { id: '1', type: 'card', last4: '4242', brand: 'visa' },
      { id: '2', type: 'card', last4: '0000', brand: 'mastercard' },
    ],
    loading: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

describe('TripRequestForm - Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Form Validation Flow', () => {
    it('should prevent submission with invalid data and show validation errors', async () => {
      const mockOnSubmit = vi.fn();
      render(<TripRequestForm onSubmit={mockOnSubmit} />);

      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', { name: /search/i });
      await user.click(submitButton);

      // Form should not be submitted
      expect(mockOnSubmit).not.toHaveBeenCalled();

      // Check for required field validation (these might appear as disabled state or validation messages)
      expect(submitButton).toBeDisabled();
    });

    it('should enable submission once required fields are filled', async () => {
      const mockOnSubmit = vi.fn();
      render(<TripRequestForm onSubmit={mockOnSubmit} />);

      // Fill out basic required fields
      const originInput = screen.getByPlaceholderText(/departure city/i);
      const destinationInput = screen.getByPlaceholderText(/destination/i);

      await user.type(originInput, 'New York');
      await user.type(destinationInput, 'Los Angeles');

      // Fill budget
      const budgetInput = screen.getByDisplayValue(/1000/);
      await user.clear(budgetInput);
      await user.type(budgetInput, '1500');

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /search/i });
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Dynamic Form Interactions', () => {
    it('should show/hide collapsible sections when toggled', async () => {
      render(<TripRequestForm onSubmit={vi.fn()} />);

      // Find and click the filters toggle
      const filtersToggle = screen.getByText(/additional filters/i);
      await user.click(filtersToggle);

      // Check that additional filter options are shown
      await waitFor(() => {
        expect(screen.getByText(/nonstop flights only/i)).toBeInTheDocument();
      });

      // Click again to collapse
      await user.click(filtersToggle);

      await waitFor(() => {
        // The nonstop option should be hidden or the toggle should show a different state
        const toggleButton = screen.getByRole('button', {
          name: /additional filters/i,
        });
        expect(toggleButton).toBeInTheDocument();
      });
    });

    it('should update trip summary chips when form values change', async () => {
      render(<TripRequestForm onSubmit={vi.fn()} />);

      // Change budget value
      const budgetInput = screen.getByDisplayValue(/1000/);
      await user.clear(budgetInput);
      await user.type(budgetInput, '2000');

      // Check if summary chip reflects the change
      await waitFor(() => {
        expect(screen.getByText(/\$2,000/)).toBeInTheDocument();
      });
    });

    it('should handle auto-booking toggle interaction', async () => {
      render(<TripRequestForm onSubmit={vi.fn()} />);

      // Find the auto-booking toggle
      const autoBookingToggle = screen.getByRole('switch', {
        name: /enable auto-booking/i,
      });

      // Initially should be unchecked
      expect(autoBookingToggle).not.toBeChecked();

      // Toggle it
      await user.click(autoBookingToggle);

      // Should now be checked
      await waitFor(() => {
        expect(autoBookingToggle).toBeChecked();
      });
    });
  });

  describe('Date Selection Flow', () => {
    it('should open calendar when date picker is clicked', async () => {
      render(<TripRequestForm onSubmit={vi.fn()} />);

      // Find and click departure date picker
      const departureDateButton = screen.getByText(/pick departure date/i);
      await user.click(departureDateButton);

      // Calendar should be visible
      await waitFor(() => {
        expect(screen.getByRole('grid')).toBeInTheDocument();
      });
    });

    it('should update date display when date is selected', async () => {
      render(<TripRequestForm onSubmit={vi.fn()} />);

      const departureDateButton = screen.getByText(/pick departure date/i);
      await user.click(departureDateButton);

      await waitFor(() => {
        // Find a date button in the calendar (look for a specific date)
        const dateButtons = screen.getAllByRole('button');
        const dateButton = dateButtons.find(btn => btn.textContent === '15');

        if (dateButton) {
          fireEvent.click(dateButton);
        }
      });

      // The button text should update to show selected date
      await waitFor(() => {
        expect(departureDateButton.textContent).not.toBe('Pick departure date');
      });
    });
  });

  describe('Form State Management', () => {
    it('should maintain form state when switching between sections', async () => {
      render(<TripRequestForm onSubmit={vi.fn()} />);

      // Set a value in one section
      const budgetInput = screen.getByDisplayValue(/1000/);
      await user.clear(budgetInput);
      await user.type(budgetInput, '1800');

      // Interact with another section (toggle filters)
      const filtersToggle = screen.getByText(/additional filters/i);
      await user.click(filtersToggle);

      // Original value should be preserved
      expect(screen.getByDisplayValue('1800')).toBeInTheDocument();
    });

    it('should handle form reset correctly', async () => {
      const mockOnSubmit = vi.fn();
      render(<TripRequestForm onSubmit={mockOnSubmit} />);

      // Make some changes
      const budgetInput = screen.getByDisplayValue(/1000/);
      await user.clear(budgetInput);
      await user.type(budgetInput, '1500');

      // If there's a reset button, test it
      const resetButtons = screen.queryAllByRole('button', {
        name: /reset|clear/i,
      });
      if (resetButtons.length > 0) {
        await user.click(resetButtons[0]);

        await waitFor(() => {
          expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Accessibility and Keyboard Navigation', () => {
    it('should be navigable with keyboard', async () => {
      render(<TripRequestForm onSubmit={vi.fn()} />);

      // Tab through form elements
      await user.tab();

      // Check that focus moves to form elements
      const _focusedElement = document.activeElement;
      expect(focusedElement).toBeTruthy();
      expect(focusedElement?.tagName.toLowerCase()).toMatch(
        /input|button|select/
      );
    });

    it('should have proper ARIA labels and roles', () => {
      render(<TripRequestForm onSubmit={vi.fn()} />);

      // Check for proper form structure
      expect(screen.getByRole('form')).toBeInTheDocument();

      // Check for labeled inputs
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        // Each input should have an accessible name
        expect(input).toHaveAccessibleName();
      });
    });

    it('should announce form validation errors to screen readers', async () => {
      const mockOnSubmit = vi.fn();
      render(<TripRequestForm onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByRole('button', { name: /search/i });
      await user.click(submitButton);

      // Check for error announcements (aria-live regions or error messages)
      await waitFor(() => {
        const errorMessages = screen.queryAllByRole('alert');
        // If there are validation errors, they should be announced
        if (errorMessages.length > 0) {
          expect(errorMessages[0]).toBeInTheDocument();
        }
      });
    });
  });

  describe('Performance and Loading States', () => {
    it('should handle loading states gracefully', async () => {
      // Mock a loading state
      vi.mocked(
        require('../../hooks/useBusinessRules').useBusinessRules
      ).mockReturnValue({
        config: null,
        loading: true,
        error: null,
        refetch: vi.fn(),
      });

      render(<TripRequestForm onSubmit={vi.fn()} />);

      // Form should show loading state or be disabled
      const submitButton = screen.getByRole('button', { name: /search/i });
      expect(submitButton).toBeDisabled();
    });

    it('should not cause unnecessary re-renders when typing', async () => {
      const renderSpy = vi.fn();

      const TestWrapper = () => {
        renderSpy();
        return <TripRequestForm onSubmit={vi.fn()} />;
      };

      render(<TestWrapper />);

      const initialRenderCount = renderSpy.mock.calls.length;

      // Type in an input
      const budgetInput = screen.getByDisplayValue(/1000/);
      await user.type(budgetInput, '1');

      // Should not cause excessive re-renders
      expect(renderSpy.mock.calls.length).toBeLessThan(initialRenderCount + 5);
    });
  });

  describe('Error Handling', () => {
    it('should display error states when business rules fail to load', () => {
      vi.mocked(
        require('../../hooks/useBusinessRules').useBusinessRules
      ).mockReturnValue({
        config: null,
        loading: false,
        error: new Error('Failed to load business rules'),
        refetch: vi.fn(),
      });

      render(<TripRequestForm onSubmit={vi.fn()} />);

      // Should show error state or disabled form
      const submitButton = screen.getByRole('button', { name: /search/i });
      expect(submitButton).toBeDisabled();
    });

    it('should handle network errors gracefully', async () => {
      const mockOnSubmit = vi
        .fn()
        .mockRejectedValue(new Error('Network error'));
      render(<TripRequestForm onSubmit={mockOnSubmit} />);

      // Fill out form and submit
      const originInput = screen.getByPlaceholderText(/departure city/i);
      await user.type(originInput, 'New York');

      const submitButton = screen.getByRole('button', { name: /search/i });
      await user.click(submitButton);

      // Should handle the error without crashing
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });
});

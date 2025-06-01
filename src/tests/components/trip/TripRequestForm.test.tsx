
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { createTripRequest } from '@/services/tripService';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { toast } from '@/components/ui/use-toast';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mocks
vi.mock('@/hooks/useCurrentUser');
vi.mock('@/services/tripService');
vi.mock('@/hooks/usePaymentMethods');
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const queryClient = new QueryClient();

const renderTripRequestForm = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('TripRequestForm Auto-Booking Tests', () => {
  const mockPaymentMethods = [{ id: 'pm-uuid-123', brand: 'Visa', last4: '4242', nickname: 'Personal Card' }];

  beforeEach(() => {
    vi.clearAllMocks();

    (useCurrentUser as vi.Mock).mockReturnValue({
      user: { id: 'user-uuid-test', email: 'test@example.com' },
      userId: 'user-uuid-test',
      loading: false,
    });

    (createTripRequest as vi.Mock).mockResolvedValue({
      tripRequest: { id: 'trip-uuid-generated', auto_book: false },
      offers: [],
      matchesInserted: 0,
    });

    (usePaymentMethods as vi.Mock).mockReturnValue({
      paymentMethods: mockPaymentMethods,
      loading: false,
      error: null,
    });
  });

  // Common utilities for finding form elements
  const findFormElement = async (options) => {
    const { label, role, name, testId, placeholder } = options;
    const strategies = [
      // Try data-testid first
      async () => testId && screen.queryByTestId(testId),
      // Try label
      async () => label && screen.queryByLabelText(label),
      // Try role with name
      async () => role && name && screen.queryByRole(role, { name }),
      // Try placeholder
      async () => placeholder && screen.queryByPlaceholderText(placeholder),
    ];

    for (const strategy of strategies) {
      try {
        const element = await strategy();
        if (element) return element;
      } catch (e) {
        console.log(`Strategy failed:`, e.message);
      }
    }
    
    throw new Error(`Could not find element with criteria: ${JSON.stringify(options)}`);
  };

  // Date picker utilities
  const getFormattedDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const findDatePicker = async (label) => {
    const labelText = typeof label === 'string' ? label : label.source;
    return findFormElement({
      testId: `trip-date-${labelText.toLowerCase().replace(/\s+/g, '')}-button`,
      label: new RegExp(`${labelText} Date Picker`, 'i'),
      role: 'button',
      name: label,
    });
  };

  // Helper to select a date from the calendar popover
  const selectDateFromCalendar = async (user, dateButton, targetDate) => {
    try {
      console.log('Selecting date:', targetDate.toISOString());
      
      // Format the target date for aria-label search
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const targetMonth = months[targetDate.getMonth()];
      const targetYear = targetDate.getFullYear();
      const targetDay = targetDate.getDate();
      
      // Extract field ID from button data-testid
      const fieldId = dateButton.getAttribute('data-testid')?.replace('-button', '') || '';
      
      // Open the date picker
      await user.click(dateButton);
      
      // Wait for the dialog to be visible
      await waitFor(() => {
        const dialog = screen.queryByRole('dialog');
        expect(dialog).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Try to find the current month/year display
      let currentMonthDisplay = '';
      try {
        const possibleMonthDisplays = [
          screen.queryByRole('heading'), 
          screen.queryByText(new RegExp(`${months.join('|')}.*\\d{4}`, 'i')),
          document.querySelector('.rdp-caption_label, .caption_label')
        ].filter(Boolean);
        
        currentMonthDisplay = possibleMonthDisplays[0]?.textContent || '';
      } catch (e) {
        console.log('Could not find month display');
      }
      
      // Navigate to target month/year if needed
      let attempts = 0;
      const maxAttempts = 12;
      
      while ((!currentMonthDisplay.includes(targetMonth) || 
             !currentMonthDisplay.includes(targetYear.toString())) && 
             attempts < maxAttempts) {
        const nextMonthButton = 
          screen.queryByLabelText(/next month/i) ||
          screen.queryByRole('button', { name: /next/i }) || 
          document.querySelector('.nav_button_next, [class*="-nav_button_next"]') ||
          document.querySelector('.rdp-nav button:last-child');
        
        if (nextMonthButton) {
          await user.click(nextMonthButton);
          await new Promise(r => setTimeout(r, 100));
          
          try {
            const possibleMonthDisplays = [
              screen.queryByRole('heading'),
              document.querySelector('.rdp-caption_label, .caption_label'),
              screen.queryByText(new RegExp(`${months.join('|')}.*\\d{4}`, 'i')),
            ].filter(Boolean);
            
            currentMonthDisplay = possibleMonthDisplays[0]?.textContent || '';
          } catch (e) {
            console.log('Could not find updated month display');
          }
        } else {
          break;
        }
        
        attempts++;
      }
      
      // Find and click the date cell
      try {
        // First try to find by role="gridcell" with a matching name
        const dateCell = await findFormElement({
          role: 'gridcell',
          name: new RegExp(`${targetDay}.*${targetMonth}`, 'i'),
        });
        
        await user.click(dateCell);
      } catch (error) {
        // Fallback: find all date cells and click the matching one
        const dateButtons = 
          screen.queryAllByRole('gridcell') || 
          Array.from(document.querySelectorAll('.rdp-day, .day, [class*="-day"]'));
        
        const targetDateButton = dateButtons.find(button => {
          const buttonText = button.textContent?.trim();
          const ariaLabel = button.getAttribute('aria-label');
          
          const dayMatch = 
            buttonText === targetDay.toString() || 
            (ariaLabel && new RegExp(`\\b${targetDay}\\b.*${targetMonth}`, 'i').test(ariaLabel));
          
          return dayMatch && button.getAttribute('aria-disabled') !== 'true';
        });
        
        if (targetDateButton) {
          await user.click(targetDateButton);
        } else {
          // Last resort: click any selectable date
          const clickableButtons = dateButtons.filter(btn => 
            btn.getAttribute('aria-disabled') !== 'true');
          
          if (clickableButtons.length > 0) {
            const middleIndex = Math.floor(clickableButtons.length / 2);
            await user.click(clickableButtons[middleIndex]);
          } else {
            throw new Error('No selectable date buttons found in calendar');
          }
        }
      }
      
      // Verify dialog closed
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeNull();
      }, { timeout: 2000 });
    } catch (error) {
      console.error(`Error selecting date: ${error.message}`);
      
      // Fallback: try to set date directly on hidden input
      try {
        const dateInput = document.querySelector(`input[data-testid="${dateButton.getAttribute('data-testid')?.replace('-button', '-input')}"]`) ||
                          document.querySelector(`input[name*="date"]`);
        
        if (dateInput) {
          fireEvent.change(dateInput, { target: { value: getFormattedDate(targetDate) } });
        } else {
          throw error; // Re-throw if no input found
        }
      } catch (fallbackError) {
        // Clean up any open dialogs
        const dialog = screen.queryByRole('dialog');
        if (dialog) {
          fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
        }
        throw error;
      }
    }
  };

  // Helper to fill basic always-required fields
  const fillBasicFields = async () => {
    const user = userEvent.setup();

    try {
      // Handle dates
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      
      const fiveDaysLater = new Date(tomorrow);
      fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);
      
      try {
        // Find date picker buttons
        const earliestDepartureButton = await findDatePicker(/Earliest Departure/);
        const latestDepartureButton = await findDatePicker(/Latest Departure/);
        
        // Select dates
        await selectDateFromCalendar(user, earliestDepartureButton, tomorrow);
        await selectDateFromCalendar(user, latestDepartureButton, fiveDaysLater);
      } catch (error) {
        console.error('Error selecting dates:', error.message);
        
        // Fallback to direct input value setting
        const inputs = Array.from(document.querySelectorAll('input[type="hidden"], input[type="date"], input[name*="date"]'));
        if (inputs.length >= 2) {
          fireEvent.change(inputs[0], { target: { value: getFormattedDate(tomorrow) } });
          fireEvent.change(inputs[1], { target: { value: getFormattedDate(fiveDaysLater) } });
        } else {
          throw new Error('Could not find date inputs to set directly');
        }
      }
      
      // Handle airports - NYC airports as checkboxes
      try {
        const jfkCheckbox = await findFormElement({ label: /JFK/i });
        if (!jfkCheckbox.checked) {
          await user.click(jfkCheckbox);
        }
      } catch {
        // Fallback to other departure dropdown
        try {
          const departureSelect = await findFormElement({ 
            role: 'combobox',
            name: /Other Departure Airport/i,
          });
          await user.click(departureSelect);
          const laxOption = await screen.findByText(/LAX/i);
          await user.click(laxOption);
        } catch (e) {
          throw new Error('Could not set departure airport through any method');
        }
      }
      
      // Handle destination
      try {
        const destinationSelect = await findFormElement({
          role: 'combobox',
          name: /Destination/i,
        });
        await user.click(destinationSelect);
        const parisOption = await screen.findByText(/Paris/i);
        await user.click(parisOption);
      } catch {
        try {
          const customDestination = await findFormElement({
            placeholder: /Enter destination airport code/i,
          });
          await user.clear(customDestination);
          await user.type(customDestination, 'CDG');
        } catch (e) {
          throw new Error('Could not set destination through any method');
        }
      }
      
      // Handle duration and budget
      const fields = [
        { label: /Min Duration/i, value: '3' },
        { label: /Max Duration/i, value: '7' },
        { label: /Budget/i, value: '1200' },
      ];
      
      for (const field of fields) {
        try {
          const input = await findFormElement({ label: field.label });
          await user.clear(input);
          await user.type(input, field.value);
        } catch (error) {
          console.error(`Error setting ${field.label}: ${error.message}`);
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error in fillBasicFields: ${error.message}`);
      const form = screen.getByRole('form');
      console.log('Form structure:', form.innerHTML);
      throw error;
    }
  };

  it('shows validation error if auto_book is ON, payment selected, but max_price empty', async () => {
    renderTripRequestForm();
    await fillBasicFields();
    const user = userEvent.setup();

    const autoBookSwitch = screen.getByRole('switch', { name: /Enable Auto-Booking/i });
    await user.click(autoBookSwitch);

    const paymentMethodSelectTrigger = await screen.findByRole('combobox', { name: /Payment Method/i });
    await user.click(paymentMethodSelectTrigger);
    const paymentOption = await screen.findByText(/Visa •••• 4242/i);
    await user.click(paymentOption);

    const maxPriceInput = screen.getByLabelText(/Maximum Price/i);
    await user.clear(maxPriceInput);

    const submitButton = screen.getByRole('button', { name: /Create Trip Request/i });
    await user.click(submitButton);

    expect(await screen.findByText("Maximum price and payment method are required for auto-booking", {}, {timeout: 5000})).toBeInTheDocument();
    expect(createTripRequest).not.toHaveBeenCalled();
  });

  it('shows validation error if auto_book is ON, max_price filled, but payment empty', async () => {
    renderTripRequestForm();
    await fillBasicFields();
    const user = userEvent.setup();

    const autoBookSwitch = screen.getByRole('switch', { name: /Enable Auto-Booking/i });
    await user.click(autoBookSwitch);

    const maxPriceInput = await screen.findByLabelText(/Maximum Price/i);
    await user.type(maxPriceInput, '1500');

    const submitButton = screen.getByRole('button', { name: /Create Trip Request/i });
    await user.click(submitButton);

    expect(await screen.findByText("Maximum price and payment method are required for auto-booking", {}, {timeout: 5000})).toBeInTheDocument();
    expect(createTripRequest).not.toHaveBeenCalled();
  });
  
  it('submits successfully if auto_book is ON and both max_price and payment method are provided', async () => {
    renderTripRequestForm();
    await fillBasicFields();
    const user = userEvent.setup();

    const autoBookSwitch = screen.getByRole('switch', { name: /Enable Auto-Booking/i });
    await user.click(autoBookSwitch);

    const maxPriceInput = await screen.findByLabelText(/Maximum Price/i);
    await user.type(maxPriceInput, '1500');

    const paymentMethodSelectTrigger = screen.getByRole('combobox', { name: /Payment Method/i });
    await user.click(paymentMethodSelectTrigger);
    const paymentOption = await screen.findByText(/Visa •••• 4242/i);
    await user.click(paymentOption);

    const submitButton = screen.getByRole('button', { name: /Create Trip Request/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(createTripRequest).toHaveBeenCalled();
    });
    expect(screen.queryByText("Maximum price and payment method are required for auto-booking")).toBeNull();
  });

  it('submits successfully when auto-booking is OFF and max_price/payment method are empty', async () => {
    renderTripRequestForm();
    await fillBasicFields();
    const user = userEvent.setup();

    const autoBookSwitch = screen.getByRole('switch', { name: /Enable Auto-Booking/i });
    expect(autoBookSwitch).not.toBeChecked();

    expect(screen.queryByLabelText(/Maximum Price/i)).toBeNull();
    expect(screen.queryByRole('combobox', { name: /Payment Method/i })).toBeNull();

    const submitButton = screen.getByRole('button', { name: /Create Trip Request/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(createTripRequest).toHaveBeenCalled();
    });

    expect(screen.queryByText("Maximum price and payment method are required for auto-booking")).toBeNull();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/trip/offers'));
    });
  });
});

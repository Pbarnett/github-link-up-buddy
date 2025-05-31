
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
      offersCount: 0,
    });

    (usePaymentMethods as vi.Mock).mockReturnValue({
      paymentMethods: mockPaymentMethods,
      loading: false,
      error: null,
    });
  });

  // Helper to fill basic always-required fields
  // Helper to select a date from the calendar popover
  const selectDateFromCalendar = async (user, dateButton, targetDate) => {
    try {
      console.log('Selecting date:', targetDate.toISOString());
      console.log('Date button:', dateButton);
      
      // Format the target date for aria-label search
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const targetMonth = months[targetDate.getMonth()];
      const targetYear = targetDate.getFullYear();
      const targetDay = targetDate.getDate();
      
      // Open the date picker
      await user.click(dateButton);
      console.log('Clicked date button');
      
      // Wait for the popover to be visible
      await waitFor(() => {
        const dialog = screen.queryByRole('dialog');
        console.log('Dialog present:', !!dialog);
        expect(dialog).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Look for the calendar grid
      const calendarGrid = await waitFor(() => {
        const grid = screen.queryByRole('grid');
        console.log('Calendar grid present:', !!grid);
        if (!grid) {
          // If grid isn't found, log available elements for debugging
          console.log('Available elements in dialog:');
          const dialog = screen.getByRole('dialog');
          console.log(dialog.innerHTML);
        }
        expect(grid).toBeInTheDocument();
        return grid;
      }, { timeout: 2000 });
      
      // Get navigation buttons
      let currentMonthDisplay;
      try {
        // Try to find any text element displaying the current month/year
        // This could be a heading, button text, or other element
        const possibleMonthDisplays = [
          screen.queryByRole('heading'), // Try any heading
          screen.queryByText(new RegExp(`${months.join('|')}.*\\d{4}`, 'i')), // Month name and year
          // Add more selectors if needed
        ].filter(Boolean);
        
        currentMonthDisplay = possibleMonthDisplays[0]?.textContent || '';
        console.log('Current month display found:', currentMonthDisplay);
      } catch (e) {
        console.log('Could not find month display:', e.message);
        currentMonthDisplay = '';
      }
      
      // Navigate to correct month if needed
      // If we can't find the exact month display, we'll try navigation buttons anyway
      let attempts = 0;
      const maxAttempts = 12; // Prevent infinite loops
      
      // We'll try to find the right month by clicking "next month" until we either see our target date
      // or reach the maximum attempts
      while ((!currentMonthDisplay.includes(targetMonth) || 
             !currentMonthDisplay.includes(targetYear.toString())) && 
             attempts < maxAttempts) {
        // Find navigation buttons - try different selectors that could match month navigation
        const nextMonthButton = 
          screen.queryByRole('button', { name: /next/i }) || 
          screen.queryByRole('button', { name: /forward/i }) ||
          screen.queryByLabelText(/next month/i) ||
          screen.queryByLabelText(/go to next month/i);
        
        if (nextMonthButton) {
          console.log('Clicking next month button');
          await user.click(nextMonthButton);
          await new Promise(r => setTimeout(r, 100)); // Small delay to let UI update
          
          // Try to get updated month display
          try {
            const possibleMonthDisplays = [
              screen.queryByRole('heading'),
              screen.queryByText(new RegExp(`${months.join('|')}.*\\d{4}`, 'i')),
            ].filter(Boolean);
            
            currentMonthDisplay = possibleMonthDisplays[0]?.textContent || '';
            console.log('Updated month display:', currentMonthDisplay);
          } catch (e) {
            console.log('Could not find updated month display');
          }
        } else {
          console.log('Could not find next month button, will try to select date anyway');
          break;
        }
        
        attempts++;
      }
      
      // Now select the specific date by looking for gridcells
      console.log('Looking for date cells');
      
      // Wait for the grid to update with cells
      await waitFor(() => {
        const cells = screen.queryAllByRole('gridcell');
        console.log(`Found ${cells.length} grid cells`);
        expect(cells.length).toBeGreaterThan(0);
      }, { timeout: 2000 });
      
      const dateButtons = screen.getAllByRole('gridcell');
      console.log('Found date cells:', dateButtons.length);
      
      // Log all available dates for debugging
      dateButtons.forEach(btn => {
        console.log(`Date cell: "${btn.textContent}", aria-disabled: ${btn.getAttribute('aria-disabled')}, aria-selected: ${btn.getAttribute('aria-selected')}`);
      });
      
      // Look for a cell containing our target day
      const targetDateButton = dateButtons.find(button => {
        const buttonText = button.textContent?.trim();
        const dayMatch = buttonText === targetDay.toString() || buttonText?.includes(targetDay.toString());
        const notDisabled = button.getAttribute('aria-disabled') !== 'true';
        
        if (dayMatch && notDisabled) {
          console.log(`Found target date button for ${targetDay}`);
          return true;
        }
        return false;
      });
      
      if (!targetDateButton) {
        // If we can't find by text content, try another approach
        console.log('Could not find date by text content, trying to find by position');
        
        // Sometimes date buttons don't have the day as text content
        // Let's try to click any selectable button
        const clickableButtons = dateButtons.filter(btn => 
          btn.getAttribute('aria-disabled') !== 'true');
        
        if (clickableButtons.length > 0) {
          // Find a button close to the middle of the month (to avoid selecting from prev/next month)
          const middleIndex = Math.floor(clickableButtons.length / 2);
          console.log(`Clicking a selectable date button at index ${middleIndex}`);
          await user.click(clickableButtons[middleIndex]);
        } else {
          throw new Error('No selectable date buttons found in calendar');
        }
      } else {
        console.log('Clicking target date button');
        await user.click(targetDateButton);
      }
      
      // Wait for popover to close after selection
      await waitFor(() => {
        const dialog = screen.queryByRole('dialog');
        if (dialog) {
          console.log('Dialog still present, will try to dismiss it');
          // If dialog is still open, try clicking outside or pressing escape
          fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
        }
        return expect(screen.queryByRole('dialog')).toBeNull();
      }, { timeout: 2000 });
      
      console.log('Date selection completed successfully');
    } catch (error) {
      console.error(`Error selecting date: ${error.message}`);
      // Try to clean up if there's an error - dismiss any open dialogs
      const dialog = screen.queryByRole('dialog');
      if (dialog) {
        console.log('Attempting to dismiss dialog after error');
        fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
      }
      throw error;
    }
  };

  const fillBasicFields = async () => {
    const user = userEvent.setup();

    try {
      console.log('Starting fillBasicFields');
      // Try multiple strategies to find date buttons
      let earliestDepartureButton = null;
      let latestDepartureButton = null;
      
      // Strategy 1: Find by label text and closest button
      try {
        const earliestDepartureLabel = screen.getByText(/Earliest Departure Date/i);
        const latestDepartureLabel = screen.getByText(/Latest Departure Date/i);
        
        // Find the associated button in each form item
        // First find the parent FormItem container
        const earliestDepartureFormItem = earliestDepartureLabel.closest('div[class*="space-y"]');
        const latestDepartureFormItem = latestDepartureLabel.closest('div[class*="space-y"]');
        
        if (earliestDepartureFormItem && latestDepartureFormItem) {
          // Then find the buttons inside those containers
          earliestDepartureButton = earliestDepartureFormItem.querySelector('button');
          latestDepartureButton = latestDepartureFormItem.querySelector('button');
          
          if (earliestDepartureButton && latestDepartureButton) {
            console.log('Found date picker buttons using label + closest div strategy');
          }
        }
      } catch (e) {
        console.log('Strategy 1 failed:', e.message);
      }
      
      // Strategy 2: Try to find buttons with specific aria-labels or patterns
      if (!earliestDepartureButton || !latestDepartureButton) {
        try {
          const buttons = screen.getAllByRole('button');
          console.log(`Found ${buttons.length} buttons`);
          
          // Look for buttons that might be date pickers (e.g., showing a date or having calendar icons)
          const dateLikeButtons = buttons.filter(btn => {
            const text = btn.textContent?.toLowerCase() || '';
            const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
            
            return text.includes('date') || 
                  text.match(/\d{1,2}\/\d{1,2}\/\d{4}/) || // MM/DD/YYYY pattern
                  text.match(/\d{4}-\d{1,2}-\d{1,2}/) || // YYYY-MM-DD pattern
                  ariaLabel.includes('date') ||
                  ariaLabel.includes('calendar');
          });
          
          console.log(`Found ${dateLikeButtons.length} date-like buttons`);
          
          if (dateLikeButtons.length >= 2) {
            earliestDepartureButton = dateLikeButtons[0];
            latestDepartureButton = dateLikeButtons[1];
            console.log('Found date picker buttons using pattern matching');
          }
        } catch (e) {
          console.log('Strategy 2 failed:', e.message);
        }
      }
      
      // Strategy 3: Last resort - try to find by test-id or other attributes
      if (!earliestDepartureButton || !latestDepartureButton) {
        try {
          // Try to find by test id or other specific attributes
          // This depends on how the component is implemented
          const possibleEarliestButton = screen.queryByTestId('earliest-departure-date-picker') || 
                                         screen.queryByLabelText(/earliest departure/i);
          
          const possibleLatestButton = screen.queryByTestId('latest-departure-date-picker') || 
                                       screen.queryByLabelText(/latest departure/i);
          
          if (possibleEarliestButton && possibleLatestButton) {
            earliestDepartureButton = possibleEarliestButton;
            latestDepartureButton = possibleLatestButton;
            console.log('Found date picker buttons using test-id or aria-label');
          }
        } catch (e) {
          console.log('Strategy 3 failed:', e.message);
        }
      }
      
      // If we still don't have buttons, throw an error
      if (!earliestDepartureButton || !latestDepartureButton) {
        console.error('Could not find date picker buttons using any strategy');
        
        // Dump the form structure for debugging
        const formElement = screen.getByRole('form') || document.querySelector('form');
        if (formElement) {
          console.log('Form structure:', formElement.innerHTML);
        }
        
        throw new Error('Could not find date picker buttons');
      }
      
      console.log('Found date picker buttons:', { 
        earliestButton: earliestDepartureButton, 
        latestButton: latestDepartureButton 
      });

      // Calculate dates with proper handling for month boundaries
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      
      const fiveDaysLater = new Date();
      fiveDaysLater.setDate(fiveDaysLater.getDate() + 7); // Use fiveDaysLater as base to avoid reference issues

      try {
        // Try earliest date first
        console.log('Selecting earliest departure date:', tomorrow.toISOString());
        await selectDateFromCalendar(user, earliestDepartureButton, tomorrow);
        
        // If first one succeeds, try the second one
        console.log('Selecting latest departure date:', fiveDaysLater.toISOString());
        await selectDateFromCalendar(user, latestDepartureButton, fiveDaysLater);
      } catch (error) {
        console.error('Error selecting dates:', error);
        
        // If selecting dates fails, let's try to mock the date selection
        // by setting values directly if possible
        try {
          console.log('Attempting to mock date selection by setting input values directly');
          const formatDate = (date) => {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          };
          
          // Try to find hidden inputs that might be storing the date values
          const inputs = Array.from(document.querySelectorAll('input'));
          const dateInputs = inputs.filter(input => 
            input.type === 'hidden' || input.type === 'date' || input.name?.includes('date'));
          
          console.log(`Found ${dateInputs.length} possible date inputs`);
          if (dateInputs.length >= 2) {
            // Set values directly using fireEvent
            fireEvent.change(dateInputs[0], { target: { value: formatDate(tomorrow) } });
            fireEvent.change(dateInputs[1], { target: { value: formatDate(fiveDaysLater) } });
            console.log('Set date input values directly');
          } else {
            throw new Error('Could not find date inputs to set directly');
          }
        } catch (mockError) {
          console.error('Failed to mock date selection:', mockError);
          throw new Error(`Failed to select dates: ${error.message}`);
        }
      }
      
      // Fill in remaining fields with explicit error handling
      try {
        // Clear fields first to ensure proper input
        const minDurationField = screen.getByLabelText(/Min Duration/i);
        await user.clear(minDurationField);
        await user.type(minDurationField, '3');
        
        const maxDurationField = screen.getByLabelText(/Max Duration/i);
        await user.clear(maxDurationField);
        await user.type(maxDurationField, '7');
        
        // Find budget field using exact label with (USD) and multiple strategies
        let budgetField;
        try {
          // First try exact label match
          budgetField = screen.getByLabelText(/Budget \(USD\)/i);
        } catch (e) {
          console.log('Could not find budget field with label "Budget (USD)", trying alternatives');
          
          // Second strategy: find the div containing the label and input
          try {
            const budgetLabel = screen.getByText(/Budget \(USD\)/i);
            const budgetFormItem = budgetLabel.closest('div[class*="space-y"]');
            
            if (budgetFormItem) {
              // Find the input within this form item
              budgetField = budgetFormItem.querySelector('input[type="number"]') || 
                            budgetFormItem.querySelector('input');
              
              if (!budgetField) {
                throw new Error('Found Budget label but could not find associated input field');
              }
            } else {
              throw new Error('Could not find Budget form item container');
            }
          } catch (e2) {
            console.log('Second strategy failed:', e2.message);
            
            // Third strategy: try to find by placeholder or other properties
            try {
              budgetField = screen.getByPlaceholderText(/budget/i) || 
                           screen.getByTestId('budget-input');
            } catch (e3) {
              console.error('All strategies to find budget field failed');
              throw new Error('Could not find Budget field using any strategy');
            }
          }
        }
        
        console.log('Found budget field:', budgetField);
        await user.clear(budgetField);
        await user.type(budgetField, '1200');
      
        await user.type(screen.getByPlaceholderText('Enter departure airport code (e.g. JFK)'), 'LAX');
        await user.type(screen.getByPlaceholderText('Enter destination (e.g. Paris, London)'), 'CDG');
      } catch (error) {
        console.error(`Error filling form fields: ${error.message}`);
        throw error;
      }
    } catch (error) {
      console.error(`Error in fillBasicFields: ${error.message}`);
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

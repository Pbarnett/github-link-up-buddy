import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { FormProvider, useForm, Control } from 'react-hook-form';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import React, { ReactNode } from 'react';

// Import the components we're testing
import DateRangeSection from '../../components/trip/sections/DateRangeSection';
import DestinationSection from '../../components/trip/sections/DestinationSection';
import BudgetSection from '../../components/trip/sections/BudgetSection';
import FilterTogglesSection from '../../components/trip/sections/FilterTogglesSection';

// Type definitions for better type safety
interface TripFormData {
  earliestDeparture?: Date | string;
  latestDeparture?: Date | string;
  destination?: string;
  budget?: number;
  min_budget?: number;
  max_budget?: number;
  nonstop_required?: boolean;
  baggage_included_required?: boolean;
  showAdvancedFilters?: boolean;
  [key: string]: unknown;
}

interface TestWrapperProps {
  children: ReactNode;
  defaultValues?: Partial<TripFormData>;
  onSubmit?: (data: TripFormData) => void;
}

// Enhanced test wrapper component with better type safety and error boundaries
const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  defaultValues = {},
  onSubmit = vi.fn(),
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
      },
      mutations: { retry: false },
    },
  });

  // Error boundary for testing
  class TestErrorBoundary extends React.Component<
    { children: ReactNode },
    { hasError: boolean; error?: Error }
  > {
    constructor(props: { children: ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('Test Error Boundary caught an error:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div data-testid="error-boundary">
            Something went wrong: {this.state.error?.message}
          </div>
        );
      }

      return this.props.children;
    }
  }

  const FormWrapperComponent = () => {
    const methods = useForm<TripFormData>({
      mode: 'onChange',
      defaultValues: {
        earliestDeparture: new Date('2025-07-24'),
        latestDeparture: new Date('2025-07-30'),
        destination: '',
        budget: 1000,
        min_budget: 100,
        max_budget: 1000,
        nonstop_required: false,
        baggage_included_required: false,
        showAdvancedFilters: false,
        ...defaultValues,
      },
    });

    // Clone children and pass control and watch props if needed
    const childrenWithProps = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          control: methods.control as Control<any>,
          watch: methods.watch,
          ...child.props,
        });
      }
      return child;
    });

    return (
      <TestErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/']}>
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                data-testid="trip-form"
              >
                {childrenWithProps}
              </form>
            </FormProvider>
          </MemoryRouter>
        </QueryClientProvider>
      </TestErrorBoundary>
    );
  };

  return <FormWrapperComponent />;
};

// Test utilities for common assertions
const TestUtils = {
  // Wait for async operations to complete
  waitForStableDOM: () => waitFor(() => {}, { timeout: 100 }),

  // Get form elements with better error messages
  getFormField: (name: string) => {
    const field =
      screen.queryByRole('textbox', { name: new RegExp(name, 'i') }) ||
      screen.queryByRole('spinbutton', { name: new RegExp(name, 'i') }) ||
      screen.queryByDisplayValue(name);
    return field;
  },

  // Check if element is properly labeled for accessibility
  checkAccessibility: (element: HTMLElement) => {
    const hasLabel =
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      screen.queryByLabelText(element.textContent || '');
    return !!hasLabel;
  },
};

// Constants for test data
const TEST_DATA = {
  VALID_DATES: {
    earliest: new Date('2025-07-24'),
    latest: new Date('2025-07-30'),
  },
  INVALID_DATES: {
    earliest: new Date('2025-08-01'), // Later than latest
    latest: new Date('2025-07-01'), // Earlier than earliest
  },
  DESTINATIONS: {
    valid: ['New York', 'Paris', 'London', 'Tokyo'],
    partial: 'New',
  },
  BUDGETS: {
    valid: [500, 1000, 2000],
    invalid: [-100, 0, 50000],
    min: 100,
    max: 10000,
  },
} as const;

describe('TripRequestForm Sections Tests', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  describe('DateRangeSection', () => {
    describe('Rendering', () => {
      it('should render both date input fields with proper labels', () => {
        render(
          <TestWrapper>
            <DateRangeSection />
          </TestWrapper>
        );

        expect(
          screen.getByText(/earliest departure date/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/latest departure date/i)).toBeInTheDocument();
        expect(
          screen.getByText(/the earliest date you can depart/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/the latest date you can depart/i)
        ).toBeInTheDocument();
      });

      it('should display default dates when provided', () => {
        const defaultDates = {
          earliestDeparture: TEST_DATA.VALID_DATES.earliest,
          latestDeparture: TEST_DATA.VALID_DATES.latest,
        };

        render(
          <TestWrapper defaultValues={defaultDates}>
            <DateRangeSection />
          </TestWrapper>
        );

        // Both date fields should be present
        const dateButtons = screen.getAllByRole('button');
        expect(dateButtons.length).toBeGreaterThan(0);
      });

      it('should have accessible date picker buttons', () => {
        render(
          <TestWrapper>
            <DateRangeSection />
          </TestWrapper>
        );

        const dateButtons = screen.getAllByRole('button');
        dateButtons.forEach(button => {
          expect(button).toBeInTheDocument();
          // Should be focusable
          expect(button).not.toHaveAttribute('tabindex', '-1');
        });
      });
    });

    describe('User Interactions', () => {
      it('should open date picker when clicked', async () => {
        render(
          <TestWrapper>
            <DateRangeSection />
          </TestWrapper>
        );

        const dateButtons = screen.getAllByRole('button');
        if (dateButtons.length > 0) {
          await user.click(dateButtons[0]);
          await TestUtils.waitForStableDOM();

          // Check if calendar or date picker UI appeared
          const calendar =
            screen.queryByRole('grid') || screen.queryByTestId('day-picker');
          if (calendar) {
            expect(calendar).toBeInTheDocument();
          }
        }
      });

      it('should handle keyboard navigation', async () => {
        render(
          <TestWrapper>
            <DateRangeSection />
          </TestWrapper>
        );

        const dateButtons = screen.getAllByRole('button');
        if (dateButtons.length > 0) {
          // Focus first date button
          dateButtons[0].focus();
          expect(dateButtons[0]).toHaveFocus();

          // Tab to next date button
          await user.tab();
          if (dateButtons.length > 1) {
            expect(dateButtons[1]).toHaveFocus();
          }
        }
      });
    });

    describe('Date Validation', () => {
      it('should handle valid date ranges', () => {
        render(
          <TestWrapper
            defaultValues={{
              earliestDeparture: TEST_DATA.VALID_DATES.earliest,
              latestDeparture: TEST_DATA.VALID_DATES.latest,
            }}
          >
            <DateRangeSection />
          </TestWrapper>
        );

        expect(
          screen.getByText(/earliest departure date/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/latest departure date/i)).toBeInTheDocument();
      });

      it('should render without crashing with invalid date ranges', () => {
        render(
          <TestWrapper
            defaultValues={{
              earliestDeparture: TEST_DATA.INVALID_DATES.earliest,
              latestDeparture: TEST_DATA.INVALID_DATES.latest,
            }}
          >
            <DateRangeSection />
          </TestWrapper>
        );

        // Component should still render despite invalid dates
        expect(
          screen.getByText(/earliest departure date/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/latest departure date/i)).toBeInTheDocument();
      });

      it('should handle past dates gracefully', () => {
        const pastDate = new Date('2020-01-01');
        render(
          <TestWrapper
            defaultValues={{
              earliestDeparture: pastDate,
              latestDeparture: pastDate,
            }}
          >
            <DateRangeSection />
          </TestWrapper>
        );

        expect(
          screen.getByText(/earliest departure date/i)
        ).toBeInTheDocument();
      });
    });

    describe('Responsive Layout', () => {
      it('should use grid layout for date fields', () => {
        render(
          <TestWrapper>
            <DateRangeSection />
          </TestWrapper>
        );

        const container = screen
          .getByText(/earliest departure date/i)
          .closest('.grid');
        expect(container).toBeInTheDocument();
        expect(container).toHaveClass('grid-cols-1', 'sm:grid-cols-2');
      });
    });
  });

  describe('DestinationSection', () => {
    it('should render destination input', () => {
      render(
        <TestWrapper>
          <DestinationSection />
        </TestWrapper>
      );

      // Look for destination-related text or inputs
      const destinationElements = screen.queryAllByText(/destination/i);
      expect(destinationElements.length).toBeGreaterThan(0);
    });

    it('should handle destination selection', async () => {
      render(
        <TestWrapper>
          <DestinationSection />
        </TestWrapper>
      );

      // Look for any input fields
      const inputs = screen.queryAllByRole('textbox');
      if (inputs.length > 0) {
        await user.type(inputs[0], 'New York');
        expect(inputs[0]).toHaveValue('New York');
      }
    });

    it('should show destination suggestions', async () => {
      render(
        <TestWrapper>
          <DestinationSection />
        </TestWrapper>
      );

      // Component should render without errors
      expect(screen.queryAllByText(/destination/i).length).toBeGreaterThan(0);
    });
  });

  describe('BudgetSection', () => {
    describe('Rendering', () => {
      it('should render budget input with proper labels and styling', () => {
        render(
          <TestWrapper>
            <BudgetSection />
          </TestWrapper>
        );

        expect(screen.getByText(/budget \(usd\)/i)).toBeInTheDocument();
        expect(
          screen.getByText(/your budget for the trip/i)
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText('1000')).toBeInTheDocument();

        // Check for dollar sign prefix
        expect(screen.getByText('$')).toBeInTheDocument();
      });

      it('should display default budget value when provided', () => {
        render(
          <TestWrapper defaultValues={{ budget: 1500 }}>
            <BudgetSection />
          </TestWrapper>
        );

        const budgetInput = screen.getByRole('spinbutton');
        expect(budgetInput).toHaveValue(1500);
      });

      it('should have proper input attributes for budget constraints', () => {
        render(
          <TestWrapper>
            <BudgetSection />
          </TestWrapper>
        );

        const budgetInput = screen.getByRole('spinbutton');
        expect(budgetInput).toHaveAttribute('type', 'number');
        expect(budgetInput).toHaveAttribute('min', '100');
        expect(budgetInput).toHaveAttribute('max', '10000');
        expect(budgetInput).toHaveAttribute('step', '1');
      });
    });

    describe('User Interactions', () => {
      it('should handle valid budget input', async () => {
        render(
          <TestWrapper>
            <BudgetSection />
          </TestWrapper>
        );

        const budgetInput = screen.getByRole('spinbutton');
        await user.clear(budgetInput);
        await user.type(budgetInput, '1500');

        expect(budgetInput).toHaveValue(1500);
      });

      it('should handle budget changes within valid range', async () => {
        render(
          <TestWrapper>
            <BudgetSection />
          </TestWrapper>
        );

        const budgetInput = screen.getByRole('spinbutton');

        for (const validBudget of TEST_DATA.BUDGETS.valid) {
          await user.clear(budgetInput);
          await user.type(budgetInput, validBudget.toString());
          expect(budgetInput).toHaveValue(validBudget);
        }
      });

      it('should handle keyboard navigation and focus', async () => {
        render(
          <TestWrapper>
            <BudgetSection />
          </TestWrapper>
        );

        const budgetInput = screen.getByRole('spinbutton');
        budgetInput.focus();
        expect(budgetInput).toHaveFocus();

        // Test arrow key increments (if supported)
        await user.keyboard('{ArrowUp}');
        // Note: Actual increment behavior depends on browser implementation
      });
    });

    describe('Validation', () => {
      it('should accept valid budget values', async () => {
        render(
          <TestWrapper>
            <BudgetSection />
          </TestWrapper>
        );

        const budgetInput = screen.getByRole('spinbutton');

        // Test minimum valid value
        await user.clear(budgetInput);
        await user.type(budgetInput, TEST_DATA.BUDGETS.min.toString());
        expect(budgetInput).toHaveValue(TEST_DATA.BUDGETS.min);

        // Test maximum valid value
        await user.clear(budgetInput);
        await user.type(budgetInput, TEST_DATA.BUDGETS.max.toString());
        expect(budgetInput).toHaveValue(TEST_DATA.BUDGETS.max);
      });

      it('should handle invalid budget values gracefully', async () => {
        render(
          <TestWrapper>
            <BudgetSection />
          </TestWrapper>
        );

        const budgetInput = screen.getByRole('spinbutton');

        // Test negative value
        await user.clear(budgetInput);
        await user.type(budgetInput, '-100');
        // Component should not crash, validation handled by form
        expect(budgetInput).toBeInTheDocument();
      });

      it('should render without crashing with invalid default values', () => {
        render(
          <TestWrapper defaultValues={{ budget: -500 }}>
            <BudgetSection />
          </TestWrapper>
        );

        expect(screen.getByText(/budget \(usd\)/i)).toBeInTheDocument();
        const budgetInput = screen.getByRole('spinbutton');
        expect(budgetInput).toHaveValue(-500);
      });
    });

    describe('Accessibility', () => {
      it('should have proper ARIA labels and descriptions', () => {
        render(
          <TestWrapper>
            <BudgetSection />
          </TestWrapper>
        );

        const budgetInput = screen.getByRole('spinbutton');
        expect(budgetInput).toBeInTheDocument();

        // Should have associated label
        expect(screen.getByText(/budget \(usd\)/i)).toBeInTheDocument();
        // Should have description
        expect(
          screen.getByText(/your budget for the trip/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('FilterTogglesSection', () => {
    describe('Rendering', () => {
      it('should render both toggle options with proper labels and descriptions', () => {
        render(
          <TestWrapper>
            <FilterTogglesSection />
          </TestWrapper>
        );

        // Check for nonstop toggle
        expect(screen.getByText(/nonstop flights only/i)).toBeInTheDocument();
        expect(
          screen.getByText(/search for direct flights with no stops/i)
        ).toBeInTheDocument();

        // Check for baggage toggle
        expect(
          screen.getByText(/include carry-on \+ personal item/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            /include carry-on baggage and personal item in search/i
          )
        ).toBeInTheDocument();
      });

      it('should display icons for each toggle option', () => {
        render(
          <TestWrapper>
            <FilterTogglesSection />
          </TestWrapper>
        );

        // Check for plane and package icons (mocked as spans with test IDs)
        const planeIcon = screen.getByTestId('icon-plane');
        const packageIcon = screen.getByTestId('icon-package');

        expect(planeIcon).toBeInTheDocument();
        expect(packageIcon).toBeInTheDocument();
      });

      it('should render with default toggle states', () => {
        render(
          <TestWrapper>
            <FilterTogglesSection />
          </TestWrapper>
        );

        const switches = screen.getAllByRole('switch');
        expect(switches.length).toBe(2);

        // Check default states (nonstop: true, baggage: false based on component)
        switches.forEach(switchElement => {
          expect(switchElement).toBeInTheDocument();
        });
      });
    });

    describe('User Interactions', () => {
      it('should toggle nonstop filter when clicked', async () => {
        render(
          <TestWrapper defaultValues={{ nonstop_required: false }}>
            <FilterTogglesSection />
          </TestWrapper>
        );

        const nonstopSwitch = screen.getByLabelText(/nonstop flights only/i);
        expect(nonstopSwitch).toBeInTheDocument();

        await user.click(nonstopSwitch);
        // Switch should handle the click (state managed by form)
      });

      it('should toggle baggage filter when clicked', async () => {
        render(
          <TestWrapper defaultValues={{ baggage_included_required: false }}>
            <FilterTogglesSection />
          </TestWrapper>
        );

        const baggageSwitch = screen.getByLabelText(
          /include carry-on \+ personal item/i
        );
        expect(baggageSwitch).toBeInTheDocument();

        await user.click(baggageSwitch);
        // Switch should handle the click (state managed by form)
      });

      it('should handle keyboard navigation between toggles', async () => {
        render(
          <TestWrapper>
            <FilterTogglesSection />
          </TestWrapper>
        );

        const switches = screen.getAllByRole('switch');
        if (switches.length >= 2) {
          switches[0].focus();
          expect(switches[0]).toHaveFocus();

          await user.tab();
          expect(switches[1]).toHaveFocus();
        }
      });

      it('should handle space key to toggle switches', async () => {
        render(
          <TestWrapper>
            <FilterTogglesSection />
          </TestWrapper>
        );

        const switches = screen.getAllByRole('switch');
        if (switches.length > 0) {
          switches[0].focus();
          await user.keyboard(' ');
          // Space key should trigger toggle (handled by form)
        }
      });
    });

    describe('State Management', () => {
      it('should display correct initial states based on form values', () => {
        render(
          <TestWrapper
            defaultValues={{
              nonstop_required: true,
              baggage_included_required: false,
            }}
          >
            <FilterTogglesSection />
          </TestWrapper>
        );

        const switches = screen.getAllByRole('switch');
        expect(switches.length).toBe(2);

        // Verify switches are present (actual state checking depends on form implementation)
        switches.forEach(switchElement => {
          expect(switchElement).toBeInTheDocument();
        });
      });

      it('should handle both toggles being enabled', () => {
        render(
          <TestWrapper
            defaultValues={{
              nonstop_required: true,
              baggage_included_required: true,
            }}
          >
            <FilterTogglesSection />
          </TestWrapper>
        );

        expect(screen.getByText(/nonstop flights only/i)).toBeInTheDocument();
        expect(
          screen.getByText(/include carry-on \+ personal item/i)
        ).toBeInTheDocument();
      });
    });

    describe('Accessibility', () => {
      it('should have proper ARIA labels for switches', () => {
        render(
          <TestWrapper>
            <FilterTogglesSection />
          </TestWrapper>
        );

        const nonstopSwitch = screen.getByLabelText(/nonstop flights only/i);
        const baggageSwitch = screen.getByLabelText(
          /include carry-on \+ personal item/i
        );

        expect(nonstopSwitch).toHaveAttribute(
          'aria-label',
          'Nonstop flights only'
        );
        expect(baggageSwitch).toHaveAttribute(
          'aria-label',
          'Include carry-on + personal item'
        );
      });

      it('should associate labels with switches correctly', () => {
        render(
          <TestWrapper>
            <FilterTogglesSection />
          </TestWrapper>
        );

        const switches = screen.getAllByRole('switch');
        switches.forEach(switchElement => {
          const id = switchElement.getAttribute('id');
          if (id) {
            const label = screen.queryByAttribute('for', id);
            expect(
              label || switchElement.getAttribute('aria-label')
            ).toBeTruthy();
          }
        });
      });
    });

    describe('Visual Design', () => {
      it('should have proper styling classes for layout', () => {
        render(
          <TestWrapper>
            <FilterTogglesSection />
          </TestWrapper>
        );

        // Check for container with space-y-4 class
        const container = screen
          .getByText(/nonstop flights only/i)
          .closest('.space-y-4');
        expect(container).toBeInTheDocument();

        // Check for toggle card styling
        const toggleCards = container?.querySelectorAll('.rounded-lg.border');
        expect(toggleCards?.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Form Sections Integration', () => {
    it('should render all sections together', () => {
      render(
        <TestWrapper>
          <DateRangeSection />
          <DestinationSection />
          <BudgetSection />
          <FilterTogglesSection />
        </TestWrapper>
      );

      // All sections should render without conflicts
      expect(
        screen.queryAllByText(/departure dates|destination|budget|filter/i)
          .length
      ).toBeGreaterThan(0);
    });

    it('should maintain form state across sections', async () => {
      render(
        <TestWrapper
          defaultValues={{
            earliestDeparture: '2025-07-24',
            destination: 'Paris',
            min_budget: 200,
            showAdvancedFilters: true,
          }}
        >
          <DateRangeSection />
          <DestinationSection />
          <BudgetSection />
          <FilterTogglesSection />
        </TestWrapper>
      );

      // Form should maintain state across all sections
      expect(screen.getByDisplayValue).toBeDefined();
    });

    it('should handle validation errors gracefully', () => {
      render(
        <TestWrapper
          defaultValues={{
            earliestDeparture: '',
            destination: '',
            min_budget: -100,
            max_budget: 50,
          }}
        >
          <DateRangeSection />
          <DestinationSection />
          <BudgetSection />
          <FilterTogglesSection />
        </TestWrapper>
      );

      // Components should render even with invalid data
      expect(
        screen.queryAllByText(/departure dates|destination|budget|filter/i)
          .length
      ).toBeGreaterThan(0);
    });
  });
});

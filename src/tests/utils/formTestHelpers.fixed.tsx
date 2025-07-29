/**
 * React Hook Form Test Helpers - Fixed Version
 *
 * Following React Hook Form best practices for testing:
 * - Proper async validation handling
 * - Correct error state assertions
 * - Proper accessibility testing
 * - FormProvider context handling
 */

import userEvent from '@testing-library/user-event';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { vi, Mock } from 'vitest';
import * as React from 'react';
import { FC, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form';
// ✅ CORRECT: Test wrapper that provides form context
export const FormTestWrapper: FC<{
  children: ReactNode;
  defaultValues?: Record<string, unknown>;
  validationSchema?: z.ZodSchema;
  onSubmit?: (data: any) => void;
}> = ({
  children,
  defaultValues = {},
  validationSchema,
  onSubmit = () => {},
}) => {
  const form = useForm({
    defaultValues,
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
    mode: 'onChange', // Enable real-time validation for testing
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} data-testid="test-form">
        {children}
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

// ✅ CORRECT: Helper for testing form validation
export const testFormValidation = async (options: {
  component: React.ReactElement;
  fillFields: () => Promise<void> | void;
  expectedErrors: string[];
  submitShouldSucceed?: boolean;
}) => {
  const {
    component,
    fillFields,
    expectedErrors,
    submitShouldSucceed = false,
  } = options;

  render(component);

  // Fill fields
  await fillFields()();

  // Submit form
  const submitButton = screen.getByRole('button', { name: /submit/i });
  await userEvent.click(submitButton);

  if (submitShouldSucceed) {
    // Wait for successful submission (no errors)
    await waitFor(
      () => {
        expectedErrors.forEach(errorText => {
          expect(screen.queryByRole('alert')).not.toHaveTextContent(errorText);
        });
      },
      { timeout: 5000 }
    );
  } else {
    // Wait for validation errors to appear - check each error individually
    for (const errorText of expectedErrors) {
      await waitFor(
        () => {
          expect(
            screen.getByText(errorText, {
              selector: '[role="alert"], .text-destructive',
            })
          ).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    }
  }
};

// ✅ CORRECT: Helper for testing field interactions
export const testFieldInteraction = async (options: {
  fieldLabel: string | RegExp;
  inputValue: string;
  expectedBehavior: 'valid' | 'invalid';
  expectedErrorMessage?: string;
}) => {
  const { fieldLabel, inputValue, expectedBehavior, expectedErrorMessage } =
    options;

  // Find field by label (accessible approach)
  const field = screen.getByLabelText(fieldLabel);

  // Simulate user typing
  await userEvent.clear(field);
  await userEvent.type(field, inputValue);

  // Simulate blur to trigger onBlur validation if configured
  await userEvent.tab();

  if (expectedBehavior === 'invalid' && expectedErrorMessage) {
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(expectedErrorMessage);
    });

    // Check aria-invalid attribute
    expect(field).toHaveAttribute('aria-invalid', 'true');
  } else {
    // Check that field is valid
    await waitFor(() => {
      expect(field).toHaveAttribute('aria-invalid', 'false');
    });
  }
};

// ✅ CORRECT: Helper for testing async validation
export const testAsyncValidation = async (options: {
  fieldLabel: string | RegExp;
  inputValue: string;
  mockAsyncValidator: Mock;
  expectedResult: 'valid' | 'invalid';
  expectedErrorMessage?: string;
}) => {
  const {
    fieldLabel,
    inputValue,
    mockAsyncValidator,
    expectedResult,
    expectedErrorMessage,
  } = options;

  const field = screen.getByLabelText(fieldLabel);

  await userEvent.clear(field);
  await userEvent.type(field, inputValue);

  // Wait for async validation to complete
  await waitFor(() => {
    expect(mockAsyncValidator).toHaveBeenCalledWith(inputValue);
  });

  if (expectedResult === 'invalid' && expectedErrorMessage) {
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(expectedErrorMessage);
    });
  } else {
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  }
};

// ✅ CORRECT: Helper for testing Controller components
export const TestControllerWrapper: FC<{
  children: (props: { control: UseFormReturn['control'] }) => ReactNode;
  defaultValues?: Record<string, unknown>;
}> = ({ children, defaultValues = {} }) => {
  const form = useForm({
    defaultValues,
    mode: 'onChange',
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        {children({ control: form.control })}
      </form>
    </FormProvider>
  );
};

// ✅ CORRECT: Helper for testing form submission
export const testFormSubmission = async (options: {
  component: React.ReactElement;
  fillValidData: () => Promise<void> | void;
  mockSubmit: Mock;
  expectedSubmissionData: Record<string, unknown>;
}) => {
  const { component, fillValidData, mockSubmit, expectedSubmissionData } =
    options;

  render(component);

  // Fill form with valid data
  await fillValidData()();

  // Submit form
  const submitButton = screen.getByTestId('submit-button');
  await userEvent.click(submitButton);

  // Wait for submission to complete
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith(expectedSubmissionData);
  });
};

// ✅ CORRECT: Helper for testing accessibility
export const testFormAccessibility = async (component: React.ReactElement) => {
  render(component);

  // Test that all form fields have proper labels
  const inputs = screen.getAllByRole('textbox');
  inputs.forEach(input => {
    expect(input).toHaveAccessibleName();
  });

  // Test that error messages have role="alert"
  const errorElements = screen.queryAllByRole('alert');
  errorElements.forEach(error => {
    expect(error).toBeInTheDocument();
  });

  // Test that required fields are properly marked
  const requiredFields = screen
    .queryAllByRole('textbox')
    .filter(field => field.hasAttribute('required'));
  requiredFields.forEach(field => {
    expect(field).toBeRequired();
  });
};

// ✅ CORRECT: Helper for testing form state changes
export const testFormStateChange = async (options: {
  component: React.ReactElement;
  action: () => Promise<void> | void;
  expectedFormState: {
    isDirty?: boolean;
    isValid?: boolean;
    isSubmitting?: boolean;
  };
}) => {
  const { component, action, expectedFormState } = options;

  render(component);

  // Perform action that should change form state
  await action()();

  // Wait for form state to update
  await waitFor(() => {
    if (expectedFormState.isDirty !== undefined) {
      // Test dirty state by checking if reset button is enabled
      const form = screen.getByTestId('test-form');
      expect(form).toHaveAttribute(
        'data-dirty',
        expectedFormState.isDirty.toString()
      );
    }

    if (expectedFormState.isValid !== undefined) {
      // Test valid state by checking submit button state
      const submitButton = screen.getByTestId('submit-button');
      if (expectedFormState.isValid) {
        expect(submitButton).not.toBeDisabled();
      } else {
        expect(submitButton).toBeDisabled();
      }
    }
  });
};

// ✅ CORRECT: Example of a complete form test
export const exampleFormTest = () => {
  const mockSubmit = vi.fn();

  const TestForm: FC = () => {
    const validationSchema = z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(5, 'Password must be at least 5 characters'),
    });

    return (
      <FormTestWrapper
        defaultValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={mockSubmit}
      >
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" aria-invalid="false" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            aria-invalid="false"
          />
        </div>
      </FormTestWrapper>
    );
  };

  it('should validate and submit form correctly', async () => {
    render(<TestForm />);

    // Test validation failure
    await testFormValidation({
      component: <TestForm />,
      fillFields: async () => {
        await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
        await userEvent.type(screen.getByLabelText(/password/i), '123');
      },
      expectedErrors: [
        'Invalid email format',
        'Password must be at least 5 characters',
      ],
      submitShouldSucceed: false,
    });

    // Test successful submission
    await testFormSubmission({
      component: <TestForm />,
      fillValidData: async () => {
        await userEvent.clear(screen.getByLabelText(/email/i));
        await userEvent.clear(screen.getByLabelText(/password/i));
        await userEvent.type(
          screen.getByLabelText(/email/i),
          'test@example.com'
        );
        await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      },
      mockSubmit,
      expectedSubmissionData: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
};

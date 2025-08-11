# TripRequestForm Test Issues Research Prompt

## Project Context

**Application**: Flight booking and travel personalization platform  
**Tech Stack**: React 18 + TypeScript, Vite, Vitest for testing, React Hook Form, Zod validation  
**Testing Framework**: Vitest with React Testing Library  
**Form Library**: React Hook Form with Zod schema validation  
**UI Components**: shadcn/ui components with Radix primitives  
**State Management**: React Context + custom hooks  
**External APIs**: Supabase (backend), Stripe (payments), LaunchDarkly (feature flags)  

---

## Problem Statement

### 1. Test Timeouts (5000ms)

**Failing Tests:**
- `should populate destination_location_code from destination_airport if omitted`
- `should submit successfully with auto-booking ON, payment method, and max_price`
- `should submit successfully with auto-booking OFF, not sending auto-booking fields`

**Error Message:**
```
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
```

### 2. React State Update Warnings

**Warning Messages:**
```
Warning: An update to LegacyTripRequestForm inside a test was not wrapped in act(...).
Warning: An update to AutoBookingSection inside a test was not wrapped in act(...).
Warning: An update to Tooltip inside a test was not wrapped in act(...).
Warning: An update to Select inside a test was not wrapped in act(...).
Warning: An update to SelectItemText inside a test was not wrapped in act(...).
```

---

## Technical Environment Details

### Test Configuration
```typescript
// vitest.config.ts setup
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    testTimeout: 5000 // Current timeout
  }
})
```

### Test Setup File
```typescript
// src/tests/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock react-day-picker
vi.mock('react-day-picker', () => ({
  DayPicker: ({ onSelect, selected }) => {
    return (
      <div data-testid="mock-day-picker">
        <button 
          data-testid="calendar-day-tomorrow"
          onClick={() => onSelect?.(new Date(Date.now() + 24 * 60 * 60 * 1000))}
        >
          Tomorrow
        </button>
        <button 
          data-testid="calendar-day-next-week"
          onClick={() => onSelect?.(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))}
        >
          Next Week
        </button>
      </div>
    )
  }
}))
```

---

## Code Examples

### Failing Test Examples

#### Test 1: Timeout in Submission Logic
```typescript
it('should populate destination_location_code from destination_airport if omitted', async () => {
  // Mock setup
  const mockTripInsert = vi.fn().mockResolvedValue({ data: { id: 'new-trip-id' } })
  const mockAirportsSelect = vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({
        data: { location_code: 'BOS' },
        error: null
      })
    })
  })
  
  // Component render
  render(
    <MemoryRouter>
      <TripRequestForm />
    </MemoryRouter>
  )
  
  // Fill form and submit
  await fillBaseFormFieldsWithDates({
    destination: 'BOS',
    departureAirport: 'NYC',
    maxPrice: 1000
  })
  
  const submitButton = screen.getByRole('button', { name: /search now/i })
  await userEvent.click(submitButton)
  
  await waitFor(() => {
    expect(mockTripInsert).toHaveBeenCalledWith({
      destination_location_code: 'BOS',
      // ... other fields
    })
  })
}, 5000) // Test times out here
```

#### Test 2: Auto-Booking Logic Timeout
```typescript
it('should submit successfully with auto-booking ON, payment method, and max_price', async () => {
  // Mock Supabase responses
  const mockTripInsert = vi.fn().mockResolvedValue({ data: { id: 'trip-123' } })
  const mockPaymentMethods = vi.fn().mockResolvedValue({
    data: [{ id: 'pm_123', card_last_four: '4242' }]
  })
  
  render(
    <MemoryRouter>
      <TripRequestForm />
    </MemoryRouter>
  )
  
  // Enable auto-booking
  const autoBookToggle = screen.getByRole('switch', { name: /auto-booking/i })
  await userEvent.click(autoBookToggle)
  
  // Fill form
  await fillBaseFormFieldsWithDates({
    destination: 'LAX',
    departureAirport: 'NYC',
    maxPrice: 1500
  })
  
  // Submit
  const submitButton = screen.getByRole('button', { name: /start auto-booking/i })
  await userEvent.click(submitButton)
  
  await waitFor(() => {
    expect(mockTripInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        auto_book_enabled: true,
        max_price: 1500,
        payment_method_id: 'pm_123'
      })
    )
  })
}, 5000) // Times out
```

### Component Structure

#### TripRequestForm Component
```typescript
const TripRequestForm = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { paymentMethods } = usePaymentMethods()
  
  const form = useForm<TripFormData>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      destination: '',
      departure_airport: '',
      earliest_departure: new Date(),
      latest_departure: new Date(),
      min_duration: 3,
      max_duration: 7,
      max_price: undefined,
      auto_book_enabled: false
    }
  })
  
  const handleSubmit = async (data: TripFormData) => {
    try {
      // Complex submission logic with multiple API calls
      const { data: trip } = await supabase
        .from('trips')
        .insert({
          ...data,
          user_id: user.id,
          destination_location_code: data.destination_location_code || 
            await getLocationCode(data.departure_airport)
        })
        .select()
        .single()
      
      navigate(`/trips/${trip.id}`)
    } catch (error) {
      console.error('Submission failed:', error)
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <EnhancedDestinationSection />
        <AutoBookingSection />
        {/* Other form sections */}
        <Button type="submit" disabled={!form.formState.isValid}>
          {form.watch('auto_book_enabled') ? 'Start Auto-Booking' : 'Search Now'}
        </Button>
      </form>
    </Form>
  )
}
```

#### AutoBookingSection Component
```typescript
const AutoBookingSection = () => {
  const { control, watch, setValue } = useFormContext<TripFormData>()
  const { paymentMethods, loading } = usePaymentMethods()
  const autoBookEnabled = watch('auto_book_enabled')
  
  useEffect(() => {
    if (!autoBookEnabled) {
      setValue('max_price', undefined)
      setValue('payment_method_id', undefined)
    }
  }, [autoBookEnabled, setValue])
  
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="auto_book_enabled"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Auto-Booking</FormLabel>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {autoBookEnabled && (
        <>
          <FormField
            control={control}
            name="max_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1000"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <PaymentMethodSelector />
        </>
      )}
    </div>
  )
}
```

### Form Validation Schema
```typescript
const tripFormSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  departure_airport: z.string().min(1, 'Departure airport is required'),
  earliest_departure: z.date(),
  latest_departure: z.date(),
  min_duration: z.number().min(1).max(30),
  max_duration: z.number().min(1).max(30),
  max_price: z.number().optional(),
  auto_book_enabled: z.boolean().default(false),
  payment_method_id: z.string().optional()
}).refine((data) => {
  if (data.auto_book_enabled && !data.max_price) {
    return false
  }
  return true
}, {
  message: 'Max price is required when auto-booking is enabled',
  path: ['max_price']
})
```

### Test Helper Functions
```typescript
// Form filling helper that may be causing issues
export const fillBaseFormFieldsWithDates = async (options: {
  destination?: string
  departureAirport?: string
  maxPrice?: number
  minDuration?: number
  maxDuration?: number
  skipValidation?: boolean
} = {}) => {
  const {
    destination = 'MVY',
    departureAirport = 'SFO',
    maxPrice = 1200,
    minDuration = 5,
    maxDuration = 10,
    skipValidation = false
  } = options

  // 1. Set destination with robust fallback
  await selectDestinationRobust(destination)
  
  // 2. Set departure airport
  const otherAirportInput = screen.getByPlaceholderText(/e\.g\., BOS/i)
  fireEvent.change(otherAirportInput, { target: { value: departureAirport } })
  
  // 3. Set dates with robust fallback
  await setDatesRobust()
  
  // 4. Set price if provided
  if (maxPrice !== undefined) {
    const maxPriceInput = screen.getByPlaceholderText('1000')
    fireEvent.change(maxPriceInput, { target: { value: maxPrice.toString() } })
    fireEvent.blur(maxPriceInput)
  }
  
  // 5. Set duration
  const minDurationInput = screen.getByDisplayValue('3')
  fireEvent.change(minDurationInput, { target: { value: minDuration.toString() } })
  
  const maxDurationInput = screen.getByDisplayValue('7')
  fireEvent.change(maxDurationInput, { target: { value: maxDuration.toString() } })
  
  if (!skipValidation) {
    await waitFor(() => {
      const inputs = screen.getAllByRole('spinbutton')
      expect(inputs.length).toBeGreaterThan(0)
    }, { timeout: 5000 })
  }
}
```

---

## Specific Technical Challenges

### 1. Complex Form State Management
- React Hook Form with conditional validation
- Multiple async operations (API calls to Supabase)
- Feature flag-dependent UI rendering
- Payment method loading and selection

### 2. Testing Async Operations
- Supabase database calls
- Form validation with Zod
- usePaymentMethods hook with loading states
- Navigation after successful submission

### 3. Component Interactions
- Radix UI Select components
- shadcn/ui form components
- Custom date picker with mocked react-day-picker
- Tooltip components with state updates

### 4. Mock Configuration
```typescript
// Existing mocks that might be insufficient
vi.mock('@/hooks/usePaymentMethods', () => ({
  usePaymentMethods: () => ({
    paymentMethods: [],
    loading: false,
    error: null
  })
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: 'test' }, error: null })
        })
      })
    })
  }
}))
```

---

## Research Questions

### Primary Questions
1. **Test Timeout Solutions**: What are the best practices for testing complex React forms with multiple async operations that prevent 5000ms timeouts?

2. **Act() Wrapping**: How should React state updates be properly wrapped in `act(...)` when testing components with:
   - useEffect hooks that update form state
   - Async API calls in form submission
   - Third-party UI components (Radix, shadcn/ui)
   - Custom hooks with loading states

3. **Mock Strategy**: What mocking strategies work best for:
   - Supabase database operations
   - React Hook Form with Zod validation
   - Custom hooks with async operations
   - Third-party UI components

### Secondary Questions
4. **Vitest Configuration**: Should we increase `testTimeout` globally or handle it per-test?

5. **waitFor vs act**: When should we use `waitFor` vs `act` vs combining both?

6. **Test Structure**: How should complex form tests be structured to avoid timeouts while maintaining comprehensive coverage?

---

## Expected Deliverables

### 1. Timeout Resolution Strategy
- Specific techniques to prevent 5000ms timeouts
- Mock configuration improvements
- Test structure recommendations
- Code examples with proper async handling

### 2. Act() Implementation Guide
- When and how to wrap state updates in `act(...)`
- Examples for common scenarios (useEffect, async operations, third-party components)
- Best practices for testing React Hook Form components

### 3. Comprehensive Testing Approach
- Testing strategy for complex forms with conditional logic
- Mock configuration for Supabase and custom hooks
- Integration between Vitest, React Testing Library, and React Hook Form

### 4. Code Examples
- Fixed test implementations
- Proper mock configurations
- Helper function improvements
- Component testing patterns

---

## Success Criteria

The research should provide actionable solutions that:
1. Eliminate test timeouts while maintaining test coverage
2. Remove all React state update warnings
3. Provide reliable, fast-running tests
4. Maintain realistic user interaction simulation
5. Work with our existing tech stack (Vitest, React Hook Form, Zod, Supabase)

---

## Additional Context

- Tests currently pass but with warnings and occasional timeouts
- The application is in active development with feature flags
- Form has complex conditional validation based on auto-booking toggle
- Component uses multiple third-party libraries that may need specific mocking approaches
- Team prefers comprehensive integration tests over isolated unit tests for forms

# React Hook Form Best Practices Guide

## Summary of Fixes Applied

### 1. **Field Registration Issues Fixed**
- **Problem**: Custom fields (origin, dates, budget) were not properly forwarding all Controller field props to Input elements
- **Fix**: Added `name`, `ref`, and `onBlur` props to all custom input fields to ensure proper RHF registration
- **Code Example**:
```tsx
// ❌ BEFORE: Incomplete field registration
<Input 
  value={field.value} 
  onChange={field.onChange}
/>

// ✅ AFTER: Complete field registration
<Input 
  name={field.name}
  ref={field.ref}
  onBlur={field.onBlur}
  value={field.value} 
  onChange={field.onChange}
/>
```

### 2. **Value Type Alignment with Zod Schema**
- **Problem**: Custom field transformations introduced values (like `null`) that didn't align with Zod schema expectations
- **Fix**: Use `undefined` for empty values instead of `null` to trigger proper required field validation
- **Code Example**:
```tsx
// ❌ BEFORE: Using null for empty dates
onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}

// ✅ AFTER: Using undefined for empty dates
onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
```

### 3. **useEffect Dependencies Fixed**
- **Problem**: TripRequestForm had entire `form` object in useEffect dependencies causing infinite loops
- **Fix**: Extract specific form methods and use them as dependencies
- **Code Example**:
```tsx
// ❌ BEFORE: Entire form object as dependency
useEffect(() => {
  if (!form.watch('auto_book_enabled')) {
    form.resetField('max_price');
    form.clearErrors('max_price');
  }
}, [form.watch('auto_book_enabled'), form]); // ❌ Entire 'form' object

// ✅ AFTER: Specific methods as dependencies  
const { watch, resetField, clearErrors } = form;
const autoBookEnabled = watch('auto_book_enabled');

useEffect(() => {
  if (!autoBookEnabled) {
    resetField('max_price');
    clearErrors('max_price');
  }
}, [autoBookEnabled, resetField, clearErrors]); // ✅ Specific methods
```

### 4. **FormState Proxy Subscription**
- **Problem**: Not properly subscribing to formState changes due to conditional access
- **Fix**: Destructure formState values to ensure proper Proxy subscription
- **Code Example**:
```tsx
// ❌ WRONG: Conditional access breaks Proxy subscription
const isDisabled = !formState.isDirty || !formState.isValid;

// ✅ CORRECT: Read all formState values to subscribe to changes
const { isDirty, isValid } = formState;
const isDisabled = !isDirty || !isValid;
```

### 5. **Improved Form Validation Mode**
- **Problem**: Using `mode: 'onSubmit'` didn't provide immediate feedback
- **Fix**: Changed to `mode: 'onChange'` with `reValidateMode: 'onChange'` for better UX
- **Code Example**:
```tsx
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange',        // validate every keystroke
  reValidateMode: 'onChange',
  criteriaMode: 'firstError',
  shouldFocusError: true,
  // ... other options
});
```

## Best Practices for React Hook Form + ShadCN + Zod

### 1. Always Spread Controller Fields
```tsx
// ✅ CORRECT: Always include all field props
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <Input {...field} placeholder="Enter value" />
      </FormControl>
    </FormItem>
  )}
/>

// ✅ CORRECT: For custom onChange, still include other props
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <Input
          name={field.name}
          ref={field.ref}
          onBlur={field.onBlur}
          value={customValue}
          onChange={customOnChange}
        />
      </FormControl>
    </FormItem>
  )}
/>
```

### 2. Match Schema Expectations with Input Values
```tsx
// ✅ CORRECT: Handle empty values properly
const dateField = (
  <Input
    type="date"
    {...field}
    value={field.value ? field.value.toISOString().split('T')[0] : ''}
    onChange={(e) => {
      field.onChange(e.target.value ? new Date(e.target.value) : undefined);
    }}
  />
);

// ✅ CORRECT: Handle number fields properly
const numberField = (
  <Input
    type="number"
    {...field}
    value={field.value ?? ''}
    onChange={(e) => {
      const value = e.target.value;
      field.onChange(value ? Number(value) : undefined);
    }}
  />
);
```

### 3. Use Proper useEffect Dependencies
```tsx
// ✅ CORRECT: Extract methods and use specific dependencies
const MyForm = () => {
  const form = useForm();
  const { watch, resetField, clearErrors } = form;
  const someValue = watch('someField');
  
  useEffect(() => {
    if (someValue) {
      resetField('dependentField');
      clearErrors('dependentField');
    }
  }, [someValue, resetField, clearErrors]);
};
```

### 4. Testing Best Practices

#### Test Form Validation
```tsx
// ✅ CORRECT: Test validation with proper async handling
it('should show validation errors', async () => {
  render(<MyForm onSubmit={mockSubmit} />);
  
  // Clear required fields
  await userEvent.clear(screen.getByLabelText(/email/i));
  
  // Submit form
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  // Wait for validation errors
  await waitFor(() => {
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });
  
  expect(mockSubmit).not.toHaveBeenCalled();
});
```

#### Test Successful Submission
```tsx
// ✅ CORRECT: Test successful form submission
it('should submit valid data', async () => {
  render(<MyForm onSubmit={mockSubmit} />);
  
  // Fill valid data
  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'password123');
  
  // Submit form
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  // Wait for submission
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
```

### 5. Form Schema Best Practices
```tsx
// ✅ CORRECT: Comprehensive schema with proper error messages
const formSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters'),
    
  dates: z.object({
    start: z.date({ required_error: 'Start date is required' })
      .refine(date => date > new Date(), 'Start date must be in the future'),
    end: z.date({ required_error: 'End date is required' })
  }).refine(data => data.end > data.start, {
    message: 'End date must be after start date',
    path: ['end']
  })
});
```

### 6. Performance Optimizations
```tsx
// ✅ CORRECT: Use React.memo for form sections
const FormSection = memo(({ register, formState: { isDirty } }) => (
  <div>
    <input {...register("field")} />
    {isDirty && <p>Form has changes</p>}
  </div>
), (prevProps, nextProps) => 
  prevProps.formState.isDirty === nextProps.formState.isDirty
);

// ✅ CORRECT: Use useWatch instead of watch for specific fields
const WatchedField = () => {
  const value = useWatch({ name: 'specificField' });
  return <div>Value: {value}</div>;
};
```

### 7. Accessibility Best Practices
```tsx
// ✅ CORRECT: Proper accessibility attributes
<FormField
  control={form.control}
  name="email"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel htmlFor="email">Email</FormLabel>
      <FormControl>
        <Input
          {...field}
          id="email"
          aria-invalid={!!fieldState.error}
          aria-describedby={fieldState.error ? "email-error" : undefined}
        />
      </FormControl>
      <FormMessage id="email-error" role="alert" />
    </FormItem>
  )}
/>
```

## Migration Checklist

When updating existing forms:

- [ ] ✅ All custom input fields spread `{...field}` or include `name`, `ref`, `onBlur`
- [ ] ✅ Empty values use `undefined` instead of `null` for required fields
- [ ] ✅ useEffect dependencies only include specific form methods, not entire `form` object
- [ ] ✅ formState values are destructured for proper Proxy subscription
- [ ] ✅ Form validation mode is set appropriately (`onChange` for real-time feedback)
- [ ] ✅ Tests wait for async validation with `waitFor()`
- [ ] ✅ Zod schema includes proper error messages and validation logic
- [ ] ✅ Accessibility attributes are properly set (`aria-invalid`, `role="alert"`)

## Results

After applying these fixes:

✅ **All validation tests now pass**
✅ **Validation errors appear correctly in DOM** 
✅ **Form submits with valid data**
✅ **Proper accessibility attributes** (`aria-invalid`, `role="alert"`)
✅ **No infinite re-render loops**
✅ **Better performance with optimized dependencies**

These changes ensure your forms work correctly with current and future versions of React Hook Form while following all documented best practices.

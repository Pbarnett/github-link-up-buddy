import React, { useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Form } from '@/components/ui/form';

// Define schema directly here since it's not exported from types/form
const unifiedFlightFormSchema = z.object({
  origin: z.array(z.string()).min(1, 'At least one departure airport must be selected'),
  destination: z.string().min(1, 'Please provide a destination'),
  earliestOutbound: z.date({ required_error: 'Earliest outbound date is required' })
    .refine(date => {
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return date >= tomorrow;
    }, 'Earliest outbound date must be in the future'),
  latestReturn: z.date({ required_error: 'Latest return date is required' }),
  cabinClass: z.enum(['any', 'economy', 'premium_economy', 'business', 'first']),
  budget: z.number().min(100, 'Budget must be at least $100').max(10000, 'Budget cannot exceed $10,000'),
  autoBookEnabled: z.boolean().optional(),
  paymentMethodId: z.string().optional(),
}).refine(data => {
  if (!data.earliestOutbound || !data.latestReturn) return true;
  return data.latestReturn > data.earliestOutbound;
}, {
  message: 'Latest return date must be after earliest outbound date',
  path: ['latestReturn'],
});

// Add a separate refine for the root level to ensure cross-field validation is triggered
const finalSchema = unifiedFlightFormSchema.refine(data => {
  if (!data.earliestOutbound || !data.latestReturn) return true;
  return data.latestReturn > data.earliestOutbound;
}, {
  message: 'Latest return date must be after earliest outbound date',
  path: ['latestReturn'],
});

export type UnifiedFlightRuleForm = z.infer<typeof unifiedFlightFormSchema>;

interface FlightRuleFormProps {
  onSubmit: (data: UnifiedFlightRuleForm) => void;
  defaultValues?: Partial<UnifiedFlightRuleForm>;
}

export const FlightRuleForm: React.FC<FlightRuleFormProps> = ({ onSubmit, defaultValues }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const form = useForm<UnifiedFlightRuleForm>({
    resolver: zodResolver(finalSchema),
    mode: 'onChange',        // validate every keystroke
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    defaultValues: {
      origin: [],
      destination: '',
      earliestOutbound: tomorrow,
      latestReturn: nextWeek,
      cabinClass: 'economy' as const,
      budget: 500,
      autoBookEnabled: false,
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: UnifiedFlightRuleForm) => {
    console.log('Form submitted with data:', data);
    console.log('Form is valid:', form.formState.isValid);
    console.log('Form errors:', form.formState.errors);
    onSubmit(data);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submit event triggered');
    // Trigger validation for both date fields to ensure cross-field validation works
    await form.trigger(['earliestOutbound', 'latestReturn']);
    // Also trigger validation for the entire form
    const isFormValid = await form.trigger();
    console.log('Form validation result:', isFormValid);
    console.log('Form state after validation:', form.formState);
    console.log('Form errors:', form.formState.errors);
    // Check if form is valid after triggering validation
    if (isFormValid) {
      console.log('Form is valid, submitting');
      const data = form.getValues();
      handleSubmit(data);
    } else {
      console.log('Form is invalid, not submitting');
    }
  };

  // Watch for changes in date fields and trigger validation
  const watchedEarliestOutbound = form.watch('earliestOutbound');
  const watchedLatestReturn = form.watch('latestReturn');
  
  useEffect(() => {
    if (watchedEarliestOutbound && watchedLatestReturn) {
      form.trigger(['latestReturn']);
    }
  }, [watchedEarliestOutbound, watchedLatestReturn, form]);

  // Debug form state
  const formState = form.formState;
  console.log('Form validation state:', {
    isValid: formState.isValid,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
    isDirty: formState.isDirty,
    values: form.getValues()
  });

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit, (errors) => {
          console.log('Form validation failed:', errors);
          console.log('Form state:', form.formState);
        })}
        className="space-y-6" 
        role="form"
      >
        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origin Airports</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  placeholder="Enter origin airports"
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    field.onChange(value ? value.split(',').map(s => s.trim()).filter(Boolean) : []);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination</FormLabel>
              <FormControl>
                <Input placeholder="Enter destination" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="earliestOutbound"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Earliest Outbound</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  type="date"
                  value={field.value ? field.value.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    field.onChange(
                      e.target.value 
                        ? new Date(e.target.value) 
                        : undefined  // use undefined for empty to trigger required error
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="latestReturn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latest Return</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  type="date"
                  value={field.value ? field.value.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    field.onChange(e.target.value ? new Date(e.target.value) : undefined);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cabinClass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cabin Class</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cabin class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium_economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  type="number" 
                  placeholder="Enter budget"
                  value={field.value ?? ''}  // show empty string if undefined
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || value === null) {
                      field.onChange(undefined);
                    } else {
                      const numValue = Number(value);
                      if (!isNaN(numValue)) {
                        field.onChange(numValue);
                      }
                    }
                    // Trigger validation immediately on change
                    form.trigger('budget');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};


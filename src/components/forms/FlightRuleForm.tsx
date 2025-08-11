import React, { useEffect } from 'react';
import { useForm, FormProvider, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Form } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { addDays, differenceInCalendarDays, format, isAfter, isBefore } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  minNights: z.number().int().min(1).max(30).default(3),
  maxNights: z.number().int().min(1).max(30).default(14),
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
}).superRefine((data, ctx) => {
  const depart = data.earliestOutbound;
  const ret = data.latestReturn;
  if (depart && ret) {
    const total = differenceInCalendarDays(ret, depart);
    if (total < data.minNights) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['latestReturn'], message: `Your window is too tight for a ${data.minNights}-night trip.` });
    }
  }
  if (data.minNights > data.maxNights) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['maxNights'], message: 'Min nights must be ≤ max nights.' });
  }
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
      minNights: 3,
      maxNights: 14,
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

  const watched = useWatch({ control: form.control });
  const summaryParts: string[] = [];
  if (Array.isArray(watched.origin) && watched.origin.length) summaryParts.push(watched.origin.join('/'));
  if (watched.destination) summaryParts.push(`→ ${watched.destination}`);
  if (watched.earliestOutbound && watched.latestReturn) {
    summaryParts.push(`${format(watched.earliestOutbound, 'MMM d')}–${format(watched.latestReturn, 'MMM d')}`);
  }
  if (typeof watched.minNights === 'number' && typeof watched.maxNights === 'number') {
    summaryParts.push(`${watched.minNights}–${watched.maxNights} nights`);
  }
  if (typeof watched.budget === 'number') summaryParts.push(`≤ $${watched.budget}`);
  if (watched.cabinClass) summaryParts.push(String(watched.cabinClass).replace('_',' '));
  summaryParts.push('Non‑stop only');

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
        {/* Summary chip */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-sm">{summaryParts.join(', ')}</Badge>
        </div>
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

        {/* Trip Window: single date-range */}
        <FormField
          control={form.control}
          name="earliestOutbound"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Trip Window</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn('w-full h-11 justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.getValues('earliestOutbound') && form.getValues('latestReturn') ? (
                        <>
                          {format(form.getValues('earliestOutbound')!, 'MMM d, yyyy')} – {format(form.getValues('latestReturn')!, 'MMM d, yyyy')}
                        </>
                      ) : (
                        <span>Leave on/after → Return by</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    numberOfMonths={2}
                    selected={{ from: form.getValues('earliestOutbound')!, to: form.getValues('latestReturn')! }}
                    onSelect={(range) => {
                      if (range?.from) form.setValue('earliestOutbound', range.from, { shouldValidate: true });
                      if (range?.to) form.setValue('latestReturn', range.to, { shouldValidate: true });
                    }}
                    disabled={(date) => {
                      const from = form.getValues('earliestOutbound');
                      const minN = form.getValues('minNights') || 1;
                      if (from && isAfter(date, from) && isBefore(date, addDays(from, minN))) return true;
                      return false;
                    }}
                  />
                </PopoverContent>
              </Popover>
              <div className="text-sm text-muted-foreground">
                We’ll search departures on/after your first date and returns no later than your second date.
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Trip Length steppers */}
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="minNights"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min nights</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon" onClick={() => field.onChange(Math.max(1, (field.value ?? 1) - 1))}>-</Button>
                    <Input type="number" className="w-24 text-center" value={field.value ?? 3} min={1} max={30} onChange={(e) => field.onChange(Math.max(1, Math.min(30, Number(e.currentTarget.value) || 1)))} />
                    <Button type="button" variant="outline" size="icon" onClick={() => field.onChange(Math.min(30, (field.value ?? 3) + 1))}>+</Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxNights"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max nights</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon" onClick={() => field.onChange(Math.max(1, (field.value ?? 14) - 1))}>-</Button>
                    <Input type="number" className="w-24 text-center" value={field.value ?? 14} min={1} max={30} onChange={(e) => field.onChange(Math.max(1, Math.min(30, Number(e.currentTarget.value) || 1)))} />
                    <Button type="button" variant="outline" size="icon" onClick={() => field.onChange(Math.min(30, (field.value ?? 14) + 1))}>+</Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="cabinClass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cabin</FormLabel>
              <div className="flex gap-2 flex-wrap">
                {(['economy','premium_economy','business'] as const).map(opt => (
                  <Button key={opt} type="button" variant={field.value === opt ? 'default' : 'outline'} onClick={() => field.onChange(opt)}>
                    {opt.replace('_',' ')}
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Price (USD)</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  type="number" 
                  placeholder="1000"
                  value={field.value ?? ''}
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
                    form.trigger('budget');
                  }}
                />
              </FormControl>
              <div className="text-xs text-muted-foreground">We’ll only auto‑book at or under this price.</div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};


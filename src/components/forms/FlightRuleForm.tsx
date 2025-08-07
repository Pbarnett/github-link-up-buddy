

import React from 'react';
import { , import { } from '@/components/ui/form';

type FC<T = {}> = React.FC<T>;

  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,

  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,

// Define schema directly here since it's not exported from types/form
const unifiedFlightFormSchema = z
  .object({
    origin: z
      .array(z.string())
      .min(1, 'At least one departure airport must be selected'),
    destination: z.string().min(1, 'Please provide a destination'),
    earliestOutbound: z
      .date({ required_error: 'Earliest outbound date is required' })
      .refine(date => {
        const tomorrow = new Date();
        tomorrow.setHours(0, 0, 0, 0);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return date >= tomorrow;
      }, 'Earliest outbound date must be in the future'),
    latestReturn: z.date({ required_error: 'Latest return date is required' }),
    cabinClass: z.enum([
      'any',
      'economy',
      'premium_economy',
      'business',
      'first',
    ]),
    budget: z
      .number()
      .min(100, 'Budget must be at least $100')
      .max(10000, 'Budget cannot exceed $10,000'),
    autoBookEnabled: z.boolean().optional(),
    paymentMethodId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Consolidated validation for better performance

    // Date sequence validation - only validate if both dates exist
    if (data.earliestOutbound && data.latestReturn) {
      if (data.latestReturn <= data.earliestOutbound) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Latest return date must be after earliest outbound date',
          path: ['latestReturn'],
        });
      }
    }
  });

// Use the optimized schema directly
const finalSchema = unifiedFlightFormSchema;

export type UnifiedFlightRuleForm = z.infer<typeof unifiedFlightFormSchema>;

interface FlightRuleFormProps {
  onSubmit: (data: UnifiedFlightRuleForm) => void;
  defaultValues?: Partial<UnifiedFlightRuleForm>;
}

export const FlightRuleForm: FC<FlightRuleFormProps> = ({
  onSubmit,
  defaultValues,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const form = useForm<UnifiedFlightRuleForm>({
    resolver: zodResolver(finalSchema),
    mode: 'onChange', // validate on change for immediate feedback
    reValidateMode: 'onChange', // re-validate on change after submission
    criteriaMode: 'firstError', // show first error only
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

  // Watch for changes in date fields and trigger validation
  const watchedEarliestOutbound = form.watch('earliestOutbound');
  const watchedLatestReturn = form.watch('latestReturn');

  // ✅ FIXED: Destructure specific methods to avoid infinite loops
  const { trigger } = form;

  useEffect(() => {
    if (watchedEarliestOutbound && watchedLatestReturn) {
      trigger(['latestReturn']);
    }
  }, [watchedEarliestOutbound, watchedLatestReturn, trigger]);

  // ✅ FIXED: Read formState properties before render to enable Proxy subscription
  const { isValid, errors, isSubmitting, isDirty } = form.formState;
  console.log('Form validation state:', {
    isValid,
    errors,
    isSubmitting,
    isDirty,
    values: form.getValues(),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, errors => {
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
                  placeholder="Enter origin airports"
                  {...field}
                  value={
                    Array.isArray(field.value) ? field.value.join(', ') : ''
                  }
                  onChange={e => {
                    const value = (e.target as HTMLInputElement).value.trim();
                    field.onChange(
                      value
                        ? value
                            .split(',')
                            .map(s => s.trim())
                            .filter(Boolean)
                        : []
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
                  type="date"
                  {...field}
                  value={
                    field.value ? field.value.toISOString().split('T')[0] : ''
                  }
                  onChange={e => {
                    field.onChange(
                      (e.target as HTMLInputElement).value
                        ? new Date((e.target as HTMLInputElement).value)
                        : undefined
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
                  type="date"
                  {...field}
                  value={
                    field.value ? field.value.toISOString().split('T')[0] : ''
                  }
                  onChange={e => {
                    field.onChange(
                      (e.target as HTMLInputElement).value
                        ? new Date((e.target as HTMLInputElement).value)
                        : undefined
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
                  <SelectItem value="premium_economy">
                    Premium Economy
                  </SelectItem>
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
                  type="number"
                  placeholder="Enter budget"
                  {...field} // ✅ FIXED: Use field spread for proper ref/name/blur handling
                  value={field.value ?? ''} // show empty string if undefined
                  onChange={e => {
                    const value = (e.target as HTMLInputElement).value;
                    if (value === '' || value === null) {
                      field.onChange(undefined);
                    } else {
                      const numValue = Number(value);
                      if (!isNaN(numValue)) {
                        field.onChange(numValue);
                      }
                    }
                    // ✅ FIXED: Use destructured trigger method
                    trigger('budget');
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

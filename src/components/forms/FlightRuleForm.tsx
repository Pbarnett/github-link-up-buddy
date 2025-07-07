import React from 'react';
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
    .refine(date => date > new Date(), 'Earliest outbound date must be in the future'),
  latestReturn: z.date({ required_error: 'Latest return date is required' }),
  cabinClass: z.enum(['any', 'economy', 'premium_economy', 'business', 'first']),
  budget: z.number().min(100, 'Budget must be at least $100').max(10000, 'Budget cannot exceed $10,000'),
  autoBookEnabled: z.boolean().optional(),
  paymentMethodId: z.string().optional(),
}).refine(data => data.latestReturn > data.earliestOutbound, {
  message: 'Latest return date must be after earliest outbound date',
  path: ['latestReturn'],
});

export type UnifiedFlightRuleForm = z.infer<typeof unifiedFlightFormSchema>;

interface FlightRuleFormProps {
  onSubmit: (data: UnifiedFlightRuleForm) => void;
  defaultValues?: Partial<UnifiedFlightRuleForm>;
}

export const FlightRuleForm: React.FC<FlightRuleFormProps> = ({ onSubmit, defaultValues }) => {
  const form = useForm<UnifiedFlightRuleForm>({
    resolver: zodResolver(unifiedFlightFormSchema),
    defaultValues: {
      origin: [],
      destination: '',
      cabinClass: 'economy',
      budget: 500,
      autoBookEnabled: false,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" role="form">
        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="origin">Origin Airports</FormLabel>
              <FormControl>
                <Input 
                  id="origin" 
                  placeholder="Enter origin airports" 
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                  onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
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
              <FormLabel htmlFor="destination">Destination</FormLabel>
              <FormControl>
                <Input id="destination" placeholder="Enter destination" {...field} />
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
              <FormLabel htmlFor="earliestOutbound">Earliest Outbound</FormLabel>
              <FormControl>
                <Input 
                  id="earliestOutbound" 
                  type="date" 
                  value={field.value ? field.value.toISOString().split('T')[0] : ''}
                  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
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
              <FormLabel htmlFor="latestReturn">Latest Return</FormLabel>
              <FormControl>
                <Input 
                  id="latestReturn" 
                  type="date" 
                  value={field.value ? field.value.toISOString().split('T')[0] : ''}
                  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
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
              <FormLabel htmlFor="cabinClass">Cabin Class</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger id="cabinClass">
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
              <FormLabel htmlFor="budget">Budget</FormLabel>
              <FormControl>
                <Input 
                  id="budget" 
                  type="number" 
                  placeholder="Enter budget" 
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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


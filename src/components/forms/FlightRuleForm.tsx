import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UnifiedFlightRuleForm, unifiedFlightFormSchema } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FlightRuleFormProps {
  onSubmit: (data: UnifiedFlightRuleForm) => void;
  defaultValues?: Partial<UnifiedFlightRuleForm>;
}

export const FlightRuleForm: React.FC<FlightRuleFormProps> = ({ onSubmit, defaultValues }) => {
const formMethods = useForm<UnifiedFlightRuleForm>({
    resolver: zodResolver(unifiedFlightFormSchema),
    defaultValues,
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
        <div>
<label htmlFor="origin">Origin Airports:</label>
          <Input id="origin" {...formMethods.register('origin')} placeholder="Enter origin airports" />
        </div>

        <div>
<label htmlFor="destination">Destination:</label>
          <Input id="destination" {...formMethods.register('destination')} placeholder="Enter destination" />
        </div>

        <div>
<label htmlFor="earliestOutbound">Earliest Outbound:</label>
          <Input id="earliestOutbound" type="date" {...formMethods.register('earliestOutbound')} />
        </div>

        <div>
<label htmlFor="latestReturn">Latest Return:</label>
          <Input id="latestReturn" type="date" {...formMethods.register('latestReturn')} />
        </div>

        <div>
<label htmlFor="cabinClass">Cabin Class:</label>
          <Select id="cabinClass" {...formMethods.register('cabinClass')}>
            <SelectTrigger>
              <SelectValue placeholder="Select cabin class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="premium_economy">Premium Economy</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="first">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
<label htmlFor="budget">Budget:</label>
          <Input id="budget" type="number" {...formMethods.register('budget')} placeholder="Enter budget" />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
};


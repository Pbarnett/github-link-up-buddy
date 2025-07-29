import * as React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// Trip duration form data interface
interface TripDurationFormData {
  min_duration?: number;
  max_duration?: number;
  [key: string]: unknown;
}

interface TripDurationInputsProps {
  control: Control<TripDurationFormData>;
}

const TripDurationInputs = ({ control }: TripDurationInputsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="min_duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              htmlFor="min_duration_input"
              className="text-sm font-medium text-gray-900"
            >
              Minimum trip duration (days)
            </FormLabel>
            <FormControl>
              <Input
                id="min_duration_input"
                type="number"
                min="1"
                max="30"
                className="h-11 border-gray-300"
                {...field}
              />
            </FormControl>
            <div className="text-xs text-gray-500">1–30</div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="max_duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              htmlFor="max_duration_input"
              className="text-sm font-medium text-gray-900"
            >
              Maximum trip duration (days)
            </FormLabel>
            <FormControl>
              <Input
                id="max_duration_input"
                type="number"
                min="1"
                max="30"
                className="h-11 border-gray-300"
                {...field}
              />
            </FormControl>
            <div className="text-xs text-gray-500">1–30</div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TripDurationInputs;

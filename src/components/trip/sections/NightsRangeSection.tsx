import * as React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Nights range form data interface
interface NightsRangeFormData {
  min_duration?: number;
  max_duration?: number;
  [key: string]: unknown;
}
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface NightsRangeSectionProps {
  control: Control<NightsRangeFormData>;
}

const NightsRangeSection = ({ control }: NightsRangeSectionProps) => {
  const watchedFields = useWatch({ control });
  const clamp = (value: number) => Math.max(1, Math.min(30, value));

  const minNights = watchedFields?.min_duration || 3;
  const maxNights = watchedFields?.max_duration || 7;

  return (
    <div className="space-y-4">
      <div>
        <FormLabel className="text-base font-semibold text-gray-900 mb-4 block">
          Trip length
        </FormLabel>
        <div className="flex items-center gap-4">
          <FormField
            control={control}
            name="min_duration"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Label
                  htmlFor="minNights"
                  className="text-sm font-medium text-gray-700"
                >
                  Min nights
                </Label>
                <FormControl>
                  <Input
                    id="minNights"
                    type="number"
                    min={1}
                    max={30}
                    className="h-12 border-gray-300 hover:border-gray-400 focus:border-blue-500"
                    {...field}
                    onChange={e => {
                      const value = clamp(
                        parseInt((e.target as HTMLInputElement).value) || 1
                      );
                      field.onChange(value);
                    }}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <span className="text-sm text-gray-500 mt-6 px-2">to</span>

          <FormField
            control={control}
            name="max_duration"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Label
                  htmlFor="maxNights"
                  className="text-sm font-medium text-gray-700"
                >
                  Max nights
                </Label>
                <FormControl>
                  <Input
                    id="maxNights"
                    type="number"
                    min={1}
                    max={30}
                    className="h-12 border-gray-300 hover:border-gray-400 focus:border-blue-500"
                    {...field}
                    onChange={e => {
                      const value = clamp(
                        parseInt((e.target as HTMLInputElement).value) || 1
                      );
                      field.onChange(value);
                    }}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Display current range */}
        <div className="mt-3 text-sm text-gray-600 text-center">
          {minNights === maxNights
            ? `Exactly ${minNights} night${minNights !== 1 ? 's' : ''}`
            : `${minNights} - ${maxNights} nights`}
        </div>
      </div>
    </div>
  );
};

export default NightsRangeSection;

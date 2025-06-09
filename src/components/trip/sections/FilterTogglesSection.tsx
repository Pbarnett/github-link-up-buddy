import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Switch } from '@/components/ui/switch'; // Assuming shadcn ui path
import { Label } from '@/components/ui/label';   // Assuming shadcn ui path
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form'; // Assuming shadcn ui path

// Define a type for the form values this section cares about,
// though typically this would be part of a larger form values type.
// For now, using 'any' for control type for simplicity in this isolated component,
// but it should be typed with the actual FormValues type from your form schema.
interface FilterTogglesSectionProps {
  control: Control<any>; // Replace 'any' with your actual form values type e.g., Control<FormValues>
  isLoading?: boolean;
}

const FilterTogglesSection: React.FC<FilterTogglesSectionProps> = ({ control, isLoading }) => {
  return (
    <>
      <FormField
        control={control}
        name="nonstop_required"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Nonstop flights only</FormLabel>
              <FormDescription>
                Filter out flights with one or more stops.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading || field.disabled}
                aria-readonly
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="baggage_included_required"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Include carry-on + personal item</FormLabel>
              <FormDescription>
                Ensure the flight offer includes at least a carry-on and personal item.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading || field.disabled}
                aria-readonly
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default FilterTogglesSection;

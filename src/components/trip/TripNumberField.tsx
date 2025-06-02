import React from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "@/types/form";

// Type for numeric field names in FormValues
type NumericFormField = Extract<keyof FormValues, 'budget' | 'min_duration' | 'max_duration' | 'max_price'>;

interface TripNumberFieldProps {
  name: NumericFormField;
  label: string;
  description: string;
  placeholder: string;
  prefix?: string;
  control: Control<FormValues>;
}

// Component implementation
const TripNumberFieldComponent = ({
  name, 
  label, 
  description, 
  placeholder,
  prefix,
  control
}: TripNumberFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {prefix ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">{prefix}</span>
                </div>
                <Input
                  type="number"
                  placeholder={placeholder}
                  className="pl-7"
                  {...field}
                  value={field.value?.toString() ?? ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === '' ? null : Number(e.target.value)
                    )
                  }
                />
              </div>
            ) : (
              <Input
                type="number"
                placeholder={placeholder}
                {...field}
                value={field.value?.toString() ?? ''}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === '' ? null : Number(e.target.value)
                  )
                }
              />
            )}
          </FormControl>
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Memoized component for export
const TripNumberField = React.memo(TripNumberFieldComponent);
export default TripNumberField;

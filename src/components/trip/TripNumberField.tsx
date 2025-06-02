import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Input, InputProps } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
            {(() => {
              // Create a typed input props object
              const inputProps: InputProps = {
                type: "number",
                placeholder,
                value: (field.value as number | null)?.toString() ?? '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  field.onChange(
                    e.target.value === '' ? null : Number(e.target.value)
                  )
              };
              
              // Return either a prefixed input or a regular input
              return prefix ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">{prefix}</span>
                  </div>
                  <Input
                    {...inputProps}
                    className="pl-7"
                  />
                </div>
              ) : (
                <Input {...inputProps} />
              );
            })()}
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

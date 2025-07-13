
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

// Define the allowed field names as an enum for better extensibility
export enum TripNumberFieldName {
  MaxPrice = "max_price",
  MinDuration = "min_duration",
  MaxDuration = "max_duration"
}

// Form data interface for trip number fields
interface TripNumberFormData {
  max_price?: number;
  min_duration?: number;
  max_duration?: number;
  [key: string]: unknown; // Allow additional fields for flexibility
}

interface TripNumberFieldProps {
  name: TripNumberFieldName | string; // Allow string to keep compatibility
  label: string;
  description: string;
  placeholder: string;
  prefix?: string;
  control: Control<TripNumberFormData>;
}

const TripNumberField = ({
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
          <FormLabel className="text-sm font-medium text-gray-900">{label}</FormLabel>
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
                />
              </div>
            ) : (
              <Input
                type="number"
                placeholder={placeholder}
                {...field}
              />
            )}
          </FormControl>
          <FormDescription className="text-xs text-gray-500">
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TripNumberField;

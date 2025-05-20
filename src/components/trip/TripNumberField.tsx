
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TripNumberFieldProps {
  name: "budget" | "min_duration" | "max_duration";
  label: string;
  description: string;
  placeholder: string;
  prefix?: string;
}

const TripNumberField = ({
  name, 
  label, 
  description, 
  placeholder,
  prefix
}: TripNumberFieldProps) => {
  const { control } = useFormContext();

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
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TripNumberField;

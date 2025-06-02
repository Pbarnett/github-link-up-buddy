import React from "react";
import { Control, UseFormWatch } from "react-hook-form";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { POPULAR_DESTINATIONS } from "@/data/airports";
import { FormValues } from "@/types/form";

interface DestinationSectionProps {
  control: Control<FormValues>;
  watch: UseFormWatch<FormValues>;
}

const DestinationSectionComponent = ({ control, watch }: DestinationSectionProps) => {
  // Watch the destination_airport value to conditionally disable the custom field
  const selectedDestination = watch("destination_airport");
  
  return (
    <div className="space-y-6">
      {/* Destination Airport Dropdown */}
      <FormField
        control={control}
        name="destination_airport"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Destination</FormLabel>
            <FormDescription>Select a popular destination.</FormDescription>
                <Select
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-64 overflow-auto">
                {POPULAR_DESTINATIONS.map((airport) => (
                  <SelectItem key={airport.id} value={airport.id}>
                    {airport.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Custom Destination Field */}
      <FormField
        control={control}
        name="destination_other"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other Destination</FormLabel>
            <FormDescription>If your destination isn't listed above, enter it here.</FormDescription>
            <FormControl>
              <Input 
                placeholder="Enter destination airport code" 
                {...field} 
                disabled={!!selectedDestination}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

// Memoized component for export
const DestinationSection = React.memo(DestinationSectionComponent);

export default DestinationSection;

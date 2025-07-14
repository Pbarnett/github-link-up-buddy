
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

interface DestinationSectionProps {
  control: Control<Record<string, unknown>>;
  watch: UseFormWatch<Record<string, unknown>>;
}

const DestinationSection = ({ control, watch }: DestinationSectionProps) => {
  // Watch the destination_airport value to conditionally disable the custom field
  const selectedDestination = watch("destination_airport");
  
  return (
    <div className="space-y-4">
      {/* Destination Airport Dropdown */}
      <FormField
        control={control}
        name="destination_airport"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-900">Destination</FormLabel>
            <FormDescription className="text-xs text-gray-500">Select a popular destination.</FormDescription>
            <Select 
              onValueChange={field.onChange} 
              value={(field.value as string) || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-64 overflow-auto bg-white z-50">
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
            <FormLabel className="text-sm font-medium text-gray-900">Other Destination</FormLabel>
            <FormDescription className="text-xs text-gray-500">
              If your destination isn't listed above, enter it here.
            </FormDescription>
            <FormControl>
              <Input 
                placeholder="Enter destination airport code" 
                {...field}
                value={(field.value as string) || ""}
                disabled={!!selectedDestination}
                className={selectedDestination ? "bg-gray-50 text-gray-400" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DestinationSection;

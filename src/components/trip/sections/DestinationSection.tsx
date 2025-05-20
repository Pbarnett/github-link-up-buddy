
import { Control } from "react-hook-form";
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

export const POPULAR_DESTINATIONS = [
  { code: "LHR", name: "London (LHR)" },
  { code: "CDG", name: "Paris (CDG)" },
  { code: "FCO", name: "Rome (FCO)" },
  { code: "MAD", name: "Madrid (MAD)" },
  { code: "TYO", name: "Tokyo (TYO)" },
  { code: "HKG", name: "Hong Kong (HKG)" },
  { code: "SYD", name: "Sydney (SYD)" },
  { code: "MEX", name: "Mexico City (MEX)" },
  { code: "GRU", name: "São Paulo (GRU)" },
  { code: "DXB", name: "Dubai (DXB)" },
];

interface DestinationSectionProps {
  control: Control<any>;
}

const DestinationSection = ({ control }: DestinationSectionProps) => {
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
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-64 overflow-auto">
                <SelectItem value="">None (I'll enter my own)</SelectItem>
                {POPULAR_DESTINATIONS.map((airport) => (
                  <SelectItem key={airport.code} value={airport.code}>
                    {airport.name}
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
                disabled={!!field.value}
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

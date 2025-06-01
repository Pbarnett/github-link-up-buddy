import { Control } from "react-hook-form";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NYC_AIRPORTS, MAJOR_AIRPORTS } from "@/data/airports";

interface DepartureAirportsSectionProps {
  control: Control<any>;
}

const DepartureAirportsSection = ({ control }: DepartureAirportsSectionProps) => {
  return (
    <div className="space-y-6">
      {/* NYC Airports Checkboxes */}
      <FormField
        control={control}
        name="nyc_airports"
        render={({ field }) => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>NYC Area Airports</FormLabel>
              <FormDescription>Select the NYC area airports you can depart from.</FormDescription>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {NYC_AIRPORTS.map((airport) => (
                <FormItem
                  key={airport.id}
                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(airport.id)}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked === true
                          ? [...(field.value || []), airport.id]
                          : (field.value || []).filter((value: string) => value !== airport.id);
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{airport.label}</FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Other Departure Airport Dropdown */}
      <FormField
        control={control}
        name="other_departure_airport"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other Departure Airport</FormLabel>
            <FormDescription>If you're not departing from NYC, select another airport.</FormDescription>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select another airport (optional)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-64 overflow-auto">
                {MAJOR_AIRPORTS.map((airport) => (
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
    </div>
  );
};

export default DepartureAirportsSection;

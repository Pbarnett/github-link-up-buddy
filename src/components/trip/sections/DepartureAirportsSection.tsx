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
import { Input } from "@/components/ui/input";
import { NYC_AIRPORTS } from "@/data/airports";

interface DepartureAirportsSectionProps {
  control: Control<any>;
}

const DepartureAirportsSection = ({ control }: DepartureAirportsSectionProps) => {
  return (
    <div className="space-y-4">
      {/* NYC Airports Checkboxes */}
      <FormField
        control={control}
        name="nyc_airports"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base lg:text-lg font-semibold text-gray-900">Departure Airports</FormLabel>
            <FormDescription className="text-sm text-gray-600">
              Select NYC area airports you can depart from.
            </FormDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {NYC_AIRPORTS.map((airport) => (
                <FormItem
                  key={airport.id}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(airport.id)}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), airport.id]
                          : (field.value || []).filter((value: string) => value !== airport.id);
                        field.onChange(updatedValue);
                      }}
                      className="form-checkbox text-blue-600"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">{airport.label}</FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Other Departure Airport Text Field */}
      <FormField
        control={control}
        name="other_departure_airport"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-900">Other Departure Airport (IATA code)</FormLabel>
            <FormDescription className="text-sm text-gray-600">
              If you're not departing from NYC, enter another airport code (e.g., BOS, PHL).
            </FormDescription>
            <FormControl>
              <Input 
                placeholder="e.g., BOS" 
                className="h-11 border-gray-300"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DepartureAirportsSection;

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

// Departure airports form data interface
interface DepartureAirportsFormData {
  nyc_airports?: string[];
  other_departure_airport?: string;
  [key: string]: unknown;
}

interface DepartureAirportsSectionProps {
  control: Control<DepartureAirportsFormData>;
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
            <div className="flex flex-wrap gap-3 mt-3">
              {NYC_AIRPORTS.map((airport) => (
                <FormItem key={airport.id} className="flex items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(airport.id)}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), airport.id]
                          : (field.value || []).filter((value: string) => value !== airport.id);
                        field.onChange(updatedValue);
                      }}
                      className="sr-only"
                    />
                  </FormControl>
                  <FormLabel 
                    className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 border-2 ${
                      field.value?.includes(airport.id) 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {airport.label}
                  </FormLabel>
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

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
            <div className="flex flex-wrap gap-3 mt-3">
              {NYC_AIRPORTS.map((airport) => {
                const isSelected = !!field.value?.includes(airport.id);
                return (
                  <FormItem key={airport.id} className="flex items-center">
                    <FormControl>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...(field.value || []), airport.id]
                            : (field.value || []).filter((value: string) => value !== airport.id);
                          field.onChange(updatedValue);
                        }}
                        className="sr-only"
                      />
                    </FormControl>
                    <button
                      type="button"
                      role="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        const updatedValue = isSelected
                          ? (field.value || []).filter((value: string) => value !== airport.id)
                          : [...(field.value || []), airport.id];
                        field.onChange(updatedValue);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {airport.label}
                    </button>
                  </FormItem>
                );
              })}
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
                autoComplete="off"
                inputMode="text"
                pattern="[A-Za-z]{3}"
                title="Enter a three-letter IATA airport code (e.g., BOS)"
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

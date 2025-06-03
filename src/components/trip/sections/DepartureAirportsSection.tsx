
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
            <FormLabel className="text-sm font-medium text-gray-900">NYC Area Airports</FormLabel>
            <FormDescription className="text-xs text-gray-500">
              Select the NYC area airports you can depart from.
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
      
      {/* Other Departure Airport Dropdown */}
      <FormField
        control={control}
        name="other_departure_airport"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-900">Other Departure Airport</FormLabel>
            <FormDescription className="text-xs text-gray-500">
              If you're not departing from NYC, select another airport.
            </FormDescription>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select another airport (optional)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-64 overflow-auto bg-white z-50">
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

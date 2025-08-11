
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { POPULAR_DESTINATIONS } from "@/data/airports";

interface EnhancedDestinationSectionProps {
  control: Control<any>;
  watch: UseFormWatch<any>;
}

const EnhancedDestinationSection = ({ control, watch }: EnhancedDestinationSectionProps) => {
  const selectedDestination = watch("destination_airport");
  
  const destOtherDescId = "destination_other-help";
  const destOtherErrorId = "destination_other-error";
  const destAirportErrorId = "destination_airport-error";

  return (
    <div className="bg-blue-50/30 rounded-lg p-4 border border-blue-100">
      <div className="space-y-4">
        <FormField
          control={control}
          name="destination_airport"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel className="text-base lg:text-lg font-bold text-gray-900">
                  Destination
                </FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pick a popular airport or enter a custom three-letter code below</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger
                    className="h-12 bg-white border-gray-300 text-base font-medium hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    aria-invalid={fieldState.invalid || undefined}
                    aria-describedby={fieldState.invalid ? destAirportErrorId : undefined}
                  >
                    <SelectValue placeholder="Where are you going?" />
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
              <FormMessage id={destAirportErrorId} />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="destination_other"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Custom Destination</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter airport code (e.g., LAX)" 
                  className="h-11 bg-white border-gray-300"
                  autoComplete="off"
                  inputMode="text"
                  pattern="[A-Za-z]{3}"
                  title="Enter a three-letter IATA airport code (e.g., LAX)"
                  aria-invalid={fieldState.invalid || undefined}
                  aria-describedby={fieldState.invalid ? `${destOtherDescId} ${destOtherErrorId}` : destOtherDescId}
                  {...field} 
                  disabled={!!selectedDestination}
                />
              </FormControl>
              <FormDescription id={destOtherDescId} className="text-xs text-gray-500">
                Use this if your destination isn't listed above
              </FormDescription>
              <FormMessage id={destOtherErrorId} />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default EnhancedDestinationSection;


import { Control } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface EnhancedBudgetSectionProps {
  control: Control<any>;
}

const EnhancedBudgetSection = ({ control }: EnhancedBudgetSectionProps) => {
  const uiRefresh = (useFeatureFlag && typeof useFeatureFlag === 'function') ? (useFeatureFlag('ui_refresh_v1') ?? false) : false;
  return (
    <FormField
      control={control}
      name="max_price"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel 
              htmlFor="max_price_input" 
              className="text-base lg:text-lg font-semibold text-gray-900"
            >
              Top price you'll pay
            </FormLabel>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>We will not charge above this amount; lower is possible.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <FormControl>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
              {uiRefresh ? (
                <MoneyInput
                  id="max_price_input"
                  value={typeof field.value === 'number' ? field.value : undefined}
                  onChange={(v) => field.onChange(v)}
                  placeholder="1000"
                  className="h-11 pl-6 pr-3 border-gray-300"
                />
              ) : (
                <Input
                  id="max_price_input"
                  type="number"
                  min="100"
                  max="10000"
                  step="1"
                  placeholder="1000"
                  className="h-11 pl-6 pr-3 border-gray-300"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  {...field}
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EnhancedBudgetSection;

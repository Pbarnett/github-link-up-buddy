
import { Control, useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";

interface DurationRangeFieldProps {
  control: Control<any>;
}

const clamp = (v: number) => Math.max(1, Math.min(30, v));

const DurationRangeField = ({ control }: DurationRangeFieldProps) => {
  const { setValue, watch } = useFormContext();
  const isMobile = useIsMobile();
  const minDuration = clamp(watch("min_duration") || 3);
  const maxDuration = clamp(Math.max(minDuration, watch("max_duration") || 7));

  const presetDurations = [
    { label: "3 days", min: 3, max: 3 },
    { label: "5 days", min: 5, max: 5 },
    { label: "7 days", min: 7, max: 7 },
    { label: "10–14", min: 10, max: 14 },
  ];

  const handlePresetClick = (preset: { min: number; max: number }) => {
    setValue("min_duration", preset.min, { shouldValidate: true });
    setValue("max_duration", Math.max(preset.min, preset.max), { shouldValidate: true });
  };

  const setMin = (v: number) => {
    const next = clamp(v);
    setValue("min_duration", next, { shouldValidate: true });
    if (next > maxDuration) setValue("max_duration", next, { shouldValidate: true });
  };
  const setMax = (v: number) => {
    const next = clamp(v);
    setValue("max_duration", next, { shouldValidate: true });
    if (next < minDuration) setValue("min_duration", next, { shouldValidate: true });
  };

  const Inputs = (
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={control}
        name="min_duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-600">Min</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon" onClick={() => setMin(minDuration - 1)}>-</Button>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  className="h-11 w-24 text-center"
                  value={minDuration}
                  onChange={(e) => setMin(parseInt(e.currentTarget.value) || 1)}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => setMin(minDuration + 1)}>+</Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="max_duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-600">Max</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon" onClick={() => setMax(maxDuration - 1)}>-</Button>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  className="h-11 w-24 text-center"
                  value={maxDuration}
                  onChange={(e) => setMax(parseInt(e.currentTarget.value) || 1)}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => setMax(maxDuration + 1)}>+</Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FormLabel className="text-base font-semibold text-gray-900">
            Duration (days)
          </FormLabel>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Minimum and maximum trip length (1-30 days)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex gap-3 mb-3 flex-wrap">
          {presetDurations.map((preset) => (
            <Button
              key={preset.label}
              type="button"
              variant={minDuration === preset.min && maxDuration === preset.max ? "default" : "outline"}
              size="sm"
              className="h-9"
              onClick={() => handlePresetClick(preset)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        {Inputs}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FormLabel className="text-base lg:text-lg font-semibold text-gray-900">
          Trip Duration
        </FormLabel>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Select your preferred trip length (1-30 days)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        {presetDurations.map((preset) => (
          <Button
            key={preset.label}
            type="button"
            variant={minDuration === preset.min && maxDuration === preset.max ? "default" : "outline"}
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={() => handlePresetClick(preset)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      {Inputs}
    </div>
  );
};

export default DurationRangeField;

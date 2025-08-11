import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { differenceInCalendarDays, isValid } from 'date-fns';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface NightsRangeSectionProps {
  control: Control<any>;
}

const PRESETS: [number, number][] = [
  [3, 5],
  [5, 7],
  [7, 10],
  [10, 14],
];

const NightsRangeSection = ({ control }: NightsRangeSectionProps) => {
  const watched = useWatch({ control });
  const clamp = (value: number) => Math.max(1, Math.min(30, value));

  const minNights = clamp(watched?.min_duration || 3);
  const maxNights = clamp(Math.max(minNights, watched?.max_duration || 7));

  const earliest = watched?.earliestDeparture as Date | undefined;
  const latest = watched?.latestDeparture as Date | undefined;
  const windowDays = earliest && latest && isValid(earliest) && isValid(latest)
    ? differenceInCalendarDays(latest, earliest)
    : undefined;

  const setMin = (onChange: (v: number) => void, v: number) => {
    const next = clamp(v);
    // Auto-adjust max if needed
    if (next > maxNights) {
      // Use RHF set order via individual fields; here we only have field.onChange
      onChange(next);
    } else {
      onChange(next);
    }
  };

  const setMax = (onChange: (v: number) => void, v: number) => {
    const next = clamp(v);
    if (next < minNights) {
      onChange(minNights); // RHF will sync value; min will drive correctness
    } else {
      onChange(next);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <FormLabel className="text-base font-semibold text-gray-900 mb-3 block">
          Trip length
        </FormLabel>

        {/* Quick-pick presets */}
        <div className="flex flex-wrap gap-2 mb-2">
          {PRESETS.map(([a, b]) => {
            const active = minNights === a && maxNights === b;
            return (
              <FormField
                key={`${a}-${b}`}
                control={control}
                name="min_duration"
                render={({ field: minField }) => (
                  <FormField
                    control={control}
                    name="max_duration"
                    render={({ field: maxField }) => (
                      <Button
                        type="button"
                        size="sm"
                        variant={active ? "default" : "outline"}
                        onClick={() => {
                          minField.onChange(a);
                          maxField.onChange(b);
                        }}
                      >
                        {a}–{b} nights
                      </Button>
                    )}
                  />
                )}
              />
            );
          })}
        </div>

        <div className="flex items-end gap-4">
          <FormField
            control={control}
            name="min_duration"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Label htmlFor="minNights" className="text-sm font-medium text-gray-700">
                  Min nights
                </Label>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon" aria-label="Decrease min nights" onClick={() => setMin(field.onChange, minNights - 1)}>-</Button>
                    <Input
                      id="minNights"
                      type="number"
                      min={1}
                      max={30}
                      className="h-12 w-24 text-center border-gray-300 hover:border-gray-400 focus:border-blue-500"
                      value={minNights}
                      onChange={(e) => {
                        const value = clamp(parseInt(e.target.value) || 1);
                        field.onChange(value);
                      }}
                    />
                    <Button type="button" variant="outline" size="icon" aria-label="Increase min nights" onClick={() => setMin(field.onChange, minNights + 1)}>+</Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <span className="text-sm text-gray-500 pb-2">to</span>

          <FormField
            control={control}
            name="max_duration"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Label htmlFor="maxNights" className="text-sm font-medium text-gray-700">
                  Max nights
                </Label>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon" aria-label="Decrease max nights" onClick={() => setMax(field.onChange, maxNights - 1)}>-</Button>
                    <Input
                      id="maxNights"
                      type="number"
                      min={1}
                      max={30}
                      className="h-12 w-24 text-center border-gray-300 hover:border-gray-400 focus:border-blue-500"
                      value={maxNights}
                      onChange={(e) => {
                        const value = clamp(parseInt(e.target.value) || 1);
                        field.onChange(value);
                      }}
                    />
                    <Button type="button" variant="outline" size="icon" aria-label="Increase max nights" onClick={() => setMax(field.onChange, maxNights + 1)}>+</Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Display current range and window helper */}
        <div className="mt-3 text-sm text-gray-600 text-center">
          {minNights === maxNights
            ? `Exactly ${minNights} night${minNights !== 1 ? 's' : ''}`
            : `${minNights}–${maxNights} nights`
          }
          {typeof windowDays === 'number' && windowDays > 0 && (
            <span className="text-gray-500"> {` (window allows ~${windowDays} days total)`}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NightsRangeSection;

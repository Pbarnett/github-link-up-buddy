/**
 * Step 1: Campaign Criteria
 * Define travel search criteria (destination, dates, budget)
 */

import { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, MapPin, DollarSign, Plane, AlertCircle, ArrowLeftRight, Armchair } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { withErrorBoundary } from '@/components/ErrorBoundary';
import { trackCampaignEvent } from '@/utils/monitoring';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { addDays, differenceInCalendarDays, format, isAfter, isBefore } from 'date-fns';
import { cn } from '@/lib/utils';

// Validation schema for criteria step
// Core Parker Flight logic: round-trip only, direct flights only
const criteriaSchema = z.object({
  campaignName: z.string().min(3, 'Campaign name must be at least 3 characters'),
  origin: z.string().min(3, 'Origin airport is required'),
  destination: z.string().min(3, 'Destination is required'),
  windowStart: z.string().min(1, 'Select when you can leave'),
  windowEnd: z.string().min(1, 'Select when you must be back'),
  maxPrice: z.number().min(50, 'Minimum budget is $50').max(10000, 'Maximum budget is $10,000'),
  currency: z.string().default('USD'),
  tripType: z.literal('round_trip').default('round_trip'),
  directFlightsOnly: z.literal(true).default(true),
  cabinClass: z.enum(['economy', 'premium_economy', 'business', 'best_within_price']).default('economy'),
  minNights: z.number().int().min(1).max(30).default(3),
  maxNights: z.number().int().min(1).max(30).default(14),
}).superRefine((val, ctx) => {
  if (val.windowStart && val.windowEnd) {
    const from = new Date(val.windowStart);
    const to = new Date(val.windowEnd);
    const totalDays = differenceInCalendarDays(to, from);
    if (totalDays < val.minNights) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['windowEnd'], message: `Your window is too tight for a ${val.minNights}-night trip.` });
    }
  }
  if (val.minNights > val.maxNights) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['maxNights'], message: 'Min nights must be ≤ max nights.' });
  }
});

export type CriteriaFormData = z.infer<typeof criteriaSchema>;

interface StepCriteriaProps {
  initialData?: Partial<CriteriaFormData>;
  onNext: (data: CriteriaFormData) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

function StepCriteria({ initialData, onNext, onBack, isLoading = false }: StepCriteriaProps) {
  // Trip type is fixed to round_trip per core product rules
  const [tripType] = useState<'round_trip'>('round_trip');

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<CriteriaFormData>({
    resolver: zodResolver(criteriaSchema),
defaultValues: {
      campaignName: initialData?.campaignName || '',
      origin: initialData?.origin || '',
      destination: initialData?.destination || '',
      windowStart: (initialData as any)?.windowStart || '',
      windowEnd: (initialData as any)?.windowEnd || '',
      maxPrice: initialData?.maxPrice || 1000,
      currency: initialData?.currency || 'USD',
      tripType: 'round_trip',
      directFlightsOnly: true,
      cabinClass: (initialData as any)?.cabinClass || 'economy',
      minNights: (initialData as any)?.minNights ?? 3,
      maxNights: (initialData as any)?.maxNights ?? 14,
    },
  });

  const handleFormSubmit = (data: CriteriaFormData) => {
    // Track step completion
    trackCampaignEvent('wizard_step_completed', 'temp-id', {
      step_name: 'criteria',
      trip_type: data.tripType,
      destination: data.destination,
      max_price: data.maxPrice,
    });

    onNext(data);
  };

  // Trip type is not user-editable; no-op handler retained for compatibility (unused)
  const handleTripTypeChange = (_value: string) => {
    // Intentionally disabled — Parker Flight supports round-trip only
  };

  const watched = useWatch({ control }) as any;
  // Build an explanatory, friendly sentence for first‑time users
  const originText = watched?.origin ? String(watched.origin).toUpperCase() : 'your origin';
  const destText = watched?.destination ? String(watched.destination).toUpperCase() : 'your destination';
  const windowStartText = watched?.windowStart ? format(new Date(watched.windowStart), 'MMM d, yyyy') : 'your start date';
  const windowEndText = watched?.windowEnd ? format(new Date(watched.windowEnd), 'MMM d, yyyy') : 'your end date';
  const minN = typeof watched?.minNights === 'number' ? watched.minNights : undefined;
  const maxN = typeof watched?.maxNights === 'number' ? watched.maxNights : undefined;
  const nightsText = minN && maxN
    ? (minN === maxN
        ? `${minN} night${minN !== 1 ? 's' : ''}`
        : `${minN} to ${maxN} nights`)
    : 'the trip length you choose';
  const budgetText = typeof watched?.maxPrice === 'number'
    ? new Intl.NumberFormat('en-US').format(watched.maxPrice)
    : undefined;
  const cabinText = watched?.cabinClass ? String(watched.cabinClass).replace('_',' ') : undefined;

  const cabinPhrase = watched?.cabinClass === 'best_within_price'
    ? ' in the best available cabin within your price'
    : (cabinText ? ` in ${cabinText}` : '');

  const summarySentence = `Based on what you’ve selected, we’re looking to book a nonstop round‑trip flight from ${originText} to ${destText} for ${nightsText} sometime between ${windowStartText} and ${windowEndText}${budgetText ? ` for under $${budgetText}` : ''}${cabinPhrase}. As always, a carry‑on and personal item will be included. Good choice.`;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Rule Criteria
        </CardTitle>
        <CardDescription>
          Define your travel preferences and search criteria for your auto‑booking rule
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Summary panel */}
          <div className="rounded-md border bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className="text-sm leading-6">{summarySentence}</p>
            </div>
          </div>
          {/* Rule Name */}
          <div className="space-y-2">
            <Label htmlFor="campaignName">Rule Name</Label>
            <Controller
              name="campaignName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="campaignName"
                  placeholder="e.g., Summer Europe Trip 2025"
                  className={errors.campaignName ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.campaignName && (
              <p className="text-sm text-red-500">{errors.campaignName.message}</p>
            )}
          </div>

          {/* Trip type is fixed to round-trip; UI removed for simplicity */}

          {/* Origin & Destination */}
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-2">
              <Label htmlFor="origin">
                <MapPin className="h-4 w-4 inline mr-1" />
                From (Origin)
              </Label>
              <Controller
                name="origin"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="origin"
                    placeholder="e.g., LAX, Los Angeles"
                    className={errors.origin ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.origin && (
                <p className="text-sm text-red-500">{errors.origin.message}</p>
              )}
            </div>

            {/* Visual swap glyph (non-interactive) */}
            <div className="hidden md:flex items-center justify-center" aria-hidden>
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">
                <MapPin className="h-4 w-4 inline mr-1" />
                To (Destination)
              </Label>
              <Controller
                name="destination"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="destination"
                    placeholder="e.g., JFK, New York"
                    className={errors.destination ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.destination && (
                <p className="text-sm text-red-500">{errors.destination.message}</p>
              )}
            </div>
          </div>

          {/* Trip Window */}
          <div className="space-y-2">
            <Label className="text-sm">
              <Calendar className="h-4 w-4 inline mr-1" />
              Trip Window
            </Label>
            <Controller
              name="windowStart"
              control={control}
              render={() => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('w-full h-11 justify-start text-left', !watched?.windowStart && 'text-muted-foreground')}>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span className="inline-flex items-center rounded-md px-3 py-1 bg-muted/30">
                        {watched?.windowStart ? format(new Date(watched.windowStart), 'MMM d, yyyy') : 'Leave on/after'}
                      </span>
                      <span className="mx-2 text-muted-foreground" aria-hidden>→</span>
                      <span className="inline-flex items-center rounded-md px-3 py-1 bg-muted/30">
                        {watched?.windowEnd ? format(new Date(watched.windowEnd), 'MMM d, yyyy') : 'Return by'}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      numberOfMonths={2}
                      selected={{ from: watched?.windowStart ? new Date(watched.windowStart) : undefined, to: watched?.windowEnd ? new Date(watched.windowEnd) : undefined }}
                      onSelect={(range) => {
                        const from = range?.from ? format(range.from, 'yyyy-MM-dd') : '';
                        const to = range?.to ? format(range.to, 'yyyy-MM-dd') : '';
                        setValue('windowStart', from, { shouldValidate: true });
                        setValue('windowEnd', to, { shouldValidate: true });
                      }}
                      disabled={(date) => {
                        const from = watched?.windowStart ? new Date(watched.windowStart) : undefined;
                        const minN = watched?.minNights || 1;
                        if (from && isAfter(date, from) && isBefore(date, addDays(from, minN))) return true;
                        return false;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <p className="text-xs text-muted-foreground">We’ll search departures on/after your first date and returns no later than your second date.</p>
          </div>

          {/* Trip Length */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm">Min nights</Label>
              <Controller
                name="minNights"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
<Button type="button" variant="outline" size="icon" className="h-11 w-11" onClick={() => field.onChange(Math.max(1, (field.value ?? 1) - 1))}>-</Button>
<Input type="number" className="w-24 h-11 text-center" value={field.value ?? 3} min={1} max={30} onChange={(e) => field.onChange(Math.max(1, Math.min(30, Number(e.currentTarget.value) || 1)))} />
<Button type="button" variant="outline" size="icon" className="h-11 w-11" onClick={() => field.onChange(Math.min(30, (field.value ?? 3) + 1))}>+</Button>
                  </div>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Max nights</Label>
              <Controller
                name="maxNights"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
<Button type="button" variant="outline" size="icon" className="h-11 w-11" onClick={() => field.onChange(Math.max(1, (field.value ?? 14) - 1))}>-</Button>
<Input type="number" className="w-24 h-11 text-center" value={field.value ?? 14} min={1} max={30} onChange={(e) => field.onChange(Math.max(1, Math.min(30, Number(e.currentTarget.value) || 1)))} />
<Button type="button" variant="outline" size="icon" className="h-11 w-11" onClick={() => field.onChange(Math.min(30, (field.value ?? 14) + 1))}>+</Button>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Budget & Preferences */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maxPrice">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Max Price (USD)
              </Label>
              <Controller
                name="maxPrice"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      {...field}
                      type="number"
                      id="maxPrice"
                      min="50"
                      max="10000"
                      step="50"
                      inputMode="numeric"
                      placeholder="1000"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className={(errors.maxPrice ? 'border-red-500 ' : '') + 'pl-7 pr-14 h-11'}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs rounded-full border px-2 py-0.5 text-muted-foreground">USD</span>
                  </div>
                )}
              />
              {errors.maxPrice && (
                <p className="text-sm text-red-500">{errors.maxPrice.message}</p>
              )}
              <p className="text-xs text-muted-foreground">We’ll only auto‑book at or under this price.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Cabin</Label>
              <Controller
                name="cabinClass"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2 flex-wrap">
                    {(['economy','premium_economy','business','best_within_price'] as const).map(opt => {
                      const selected = field.value === opt;
                      const label = opt === 'best_within_price' ? 'best within price' : opt.replace('_',' ');
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => field.onChange(opt)}
                          className={cn(
                            'inline-flex items-center gap-2 rounded-full px-4 h-11 border transition-colors',
                            selected ? 'bg-primary text-primary-foreground border-transparent' : 'bg-background text-foreground border-border/40 hover:bg-accent'
                          )}
                          aria-pressed={selected}
                        >
                          <Armchair className={cn('h-4 w-4', selected ? 'opacity-90' : 'opacity-70')} />
                          <span className="capitalize">{label}</span>
                        </button>
                      );
                    })}
                    {field.value === 'best_within_price' && (
                      <p className="w-full text-xs text-muted-foreground mt-1">We’ll shop across cabins and book the highest cabin that fits your max price (Business &gt; Premium Economy &gt; Economy).</p>
                    )}
                  </div>
                )}
              />
            </div>

          </div>

          {/* Legacy trip duration inputs replaced by Trip Length above */}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Parker Flight books non‑stop, round‑trip fares and includes a carry‑on. If a fare does not include a carry‑on but adding one keeps the total under your Max Price, we’ll still consider and book it.
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="sticky bottom-0 -mx-4 md:-mx-6 border-top border-t border-border/20 bg-card/80 backdrop-blur px-4 md:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="hidden md:flex flex-wrap gap-2 text-xs">
                {watched?.origin && watched?.destination && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">{watched.origin} → {watched.destination}</span>
                )}
                {(watched?.minNights || watched?.maxNights) && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">{watched?.minNights ?? '?'}–{watched?.maxNights ?? '?'} nights</span>
                )}
                {watched?.maxPrice && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">≤ {Number(watched.maxPrice).toLocaleString()}</span>
                )}
                {watched?.cabinClass && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">{watched.cabinClass === 'best_within_price' ? 'best within price' : String(watched.cabinClass).replace('_',' ')}</span>
                )}
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">Nonstop</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isLoading}
                >
                  Back
                </Button>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Next: Traveler Info'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default withErrorBoundary(StepCriteria, 'component');

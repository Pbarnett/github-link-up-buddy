
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import AutoBookingSettings from "./AutoBookingSettings";

interface TripRequestFormProps {
  tripRequestId?: string;
}

interface FormErrors {
  destination?: string;
  departureAirports?: string;
  dateRange?: string;
  duration?: string;
  budget?: string;
}

const TripRequestForm = ({ tripRequestId }: TripRequestFormProps) => {
  const navigate = useNavigate();
  const { userId } = useCurrentUser();
  const { toast } = useToast();

  const [destination, setDestination] = useState("");
  const [departureAirports, setDepartureAirports] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [minDuration, setMinDuration] = useState(3);
  const [maxDuration, setMaxDuration] = useState(7);
  const [budget, setBudget] = useState(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (tripRequestId) {
      fetchTripDetails(tripRequestId);
    }
  }, [tripRequestId]);

  const fetchTripDetails = async (id: string) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("trip_requests")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setDestination(data.destination_airport || "");
      setDepartureAirports(data.departure_airports);
      setDateRange({
        from: data.earliest_departure ? parseISO(data.earliest_departure) : undefined,
        to: data.latest_departure ? parseISO(data.latest_departure) : undefined,
      });
      setMinDuration(data.min_duration);
      setMaxDuration(data.max_duration);
      setBudget(data.budget);
    } catch (error: any) {
      toast({
        title: "Error fetching trip details",
        description: error.message || "Failed to fetch trip details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!destination.trim()) {
      newErrors.destination = "Destination is required";
    }

    if (departureAirports.length === 0) {
      newErrors.departureAirports = "At least one departure airport is required";
    }

    if (!dateRange?.from || !dateRange?.to) {
      newErrors.dateRange = "Date range is required";
    }

    if (minDuration > maxDuration) {
      newErrors.duration = "Min duration must be less than or equal to max duration";
    }

    if (budget <= 0) {
      newErrors.budget = "Budget must be greater than 0";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (!userId) throw new Error("User ID is missing. Please log in.");

      const earliestDeparture = dateRange?.from?.toISOString();
      const latestDeparture = dateRange?.to?.toISOString();

      if (!earliestDeparture || !latestDeparture) {
        throw new Error("Departure and return dates are required.");
      }

      const tripRequestData = {
        user_id: userId,
        destination_airport: destination.toUpperCase(),
        departure_airports: departureAirports.map((airport) => airport.toUpperCase()),
        earliest_departure: earliestDeparture,
        latest_departure: latestDeparture,
        min_duration: minDuration,
        max_duration: maxDuration,
        budget: budget,
      };

      let res;
      if (tripRequestId) {
        res = await supabase
          .from("trip_requests")
          .update(tripRequestData)
          .eq("id", tripRequestId);
      } else {
        res = await supabase.from("trip_requests").insert([tripRequestData]);
      }

      if (res.error) throw res.error;

      toast({
        title: "Trip Request Submitted",
        description: "Your trip request has been successfully submitted!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error submitting trip request",
        description: error.message || "Failed to submit trip request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const DestinationSection = ({
    destination,
    onDestinationChange,
    error,
  }: {
    destination: string;
    onDestinationChange: (value: string) => void;
    error: boolean;
  }) => (
    <div className="space-y-2">
      <Label htmlFor="destination">Destination Airport</Label>
      <Input
        id="destination"
        placeholder="e.g., LAX"
        value={destination}
        onChange={(e) => onDestinationChange(e.target.value)}
        className={error ? "border-red-500" : ""}
        disabled={isSubmitting}
      />
      {error && <p className="text-sm text-red-500">Destination is required</p>}
    </div>
  );

  const DepartureAirportsSection = ({
    departureAirports,
    onDepartureAirportsChange,
    error,
  }: {
    departureAirports: string[];
    onDepartureAirportsChange: (value: string[]) => void;
    error: boolean;
  }) => (
    <div className="space-y-2">
      <Label>Departure Airports</Label>
      <div className="flex space-x-2">
        <AirportButton
          airport="JFK"
          selected={departureAirports.includes("JFK")}
          onSelect={onDepartureAirportsChange}
          disabled={isSubmitting}
        />
        <AirportButton
          airport="LGA"
          selected={departureAirports.includes("LGA")}
          onSelect={onDepartureAirportsChange}
          disabled={isSubmitting}
        />
        <AirportButton
          airport="EWR"
          selected={departureAirports.includes("EWR")}
          onSelect={onDepartureAirportsChange}
          disabled={isSubmitting}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">
          At least one departure airport is required
        </p>
      )}
    </div>
  );

  const AirportButton = ({
    airport,
    selected,
    onSelect,
    disabled,
  }: {
    airport: string;
    selected: boolean;
    onSelect: (value: string[]) => void;
    disabled: boolean;
  }) => (
    <Button
      variant={selected ? "default" : "outline"}
      onClick={() => {
        if (selected) {
          onSelect(departureAirports.filter((a) => a !== airport));
        } else {
          onSelect([...departureAirports, airport]);
        }
      }}
      disabled={disabled}
    >
      {airport}
    </Button>
  );

  const DateRangeSection = ({
    dateRange,
    onDateRangeChange,
    error,
  }: {
    dateRange: DateRange | undefined;
    onDateRangeChange: (value: DateRange | undefined) => void;
    error: boolean;
  }) => (
    <div className="space-y-2">
      <Label>Date Range</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
            disabled={isSubmitting}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                `${format(dateRange.from, "MMM d, yyyy")} - ${format(
                  dateRange.to,
                  "MMM d, yyyy"
                )}`
              ) : (
                format(dateRange.from, "MMM d, yyyy")
              )
            ) : (
              <span>Pick dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center" side="bottom">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(range, _selectedDay, _activeModifiers, _e) => onDateRangeChange(range)}
            numberOfMonths={2}
            pagedNavigation
            className="border-0 rounded-md"
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-500">Date range is required</p>
      )}
    </div>
  );

  const TripDurationSection = ({
    minDuration,
    maxDuration,
    onMinDurationChange,
    onMaxDurationChange,
    error,
  }: {
    minDuration: number;
    maxDuration: number;
    onMinDurationChange: (value: number) => void;
    onMaxDurationChange: (value: number) => void;
    error: boolean;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="min-duration">Min Duration (days)</Label>
        <Select
          value={minDuration.toString()}
          onValueChange={(value) => onMinDurationChange(parseInt(value))}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select min duration" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(14)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="max-duration">Max Duration (days)</Label>
        <Select
          value={maxDuration.toString()}
          onValueChange={(value) => onMaxDurationChange(parseInt(value))}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select max duration" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(14)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <p className="text-sm text-red-500">
          Min duration must be less than or equal to max duration
        </p>
      )}
    </div>
  );

  const BudgetSection = ({
    budget,
    onBudgetChange,
    error,
  }: {
    budget: number;
    onBudgetChange: (value: number) => void;
    error: boolean;
  }) => (
    <div className="space-y-2">
      <Label htmlFor="budget">Budget (USD)</Label>
      <Input
        id="budget"
        type="number"
        placeholder="e.g., 1000"
        value={budget.toString()}
        onChange={(e) => onBudgetChange(parseInt(e.target.value))}
        className={error ? "border-red-500" : ""}
        disabled={isSubmitting}
      />
      {error && <p className="text-sm text-red-500">Budget must be greater than 0</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Destination Section */}
      <DestinationSection
        destination={destination}
        onDestinationChange={setDestination}
        error={!!errors.destination}
      />

      {/* Departure Airports Section */}
      <DepartureAirportsSection
        departureAirports={departureAirports}
        onDepartureAirportsChange={setDepartureAirports}
        error={!!errors.departureAirports}
      />

      {/* Date Range Section */}
      <DateRangeSection
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        error={!!errors.dateRange}
      />

      {/* Trip Duration Section */}
      <TripDurationSection
        minDuration={minDuration}
        maxDuration={maxDuration}
        onMinDurationChange={setMinDuration}
        onMaxDurationChange={setMaxDuration}
        error={!!errors.duration}
      />

      {/* Budget Section */}
      <BudgetSection
        budget={budget}
        onBudgetChange={setBudget}
        error={!!errors.budget}
      />

      {/* Auto-Booking Section */}
      {tripRequestId && (
        <AutoBookingSettings
          tripRequestId={tripRequestId}
          initialSettings={{
            auto_book_enabled: false,
            max_price: budget,
            preferred_payment_method_id: undefined,
          }}
        />
      )}

      {/* Error Display */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md">
          <h3 className="font-medium">Please fix the following errors:</h3>
          <ul className="mt-2 space-y-1">
            {Object.values(errors).map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {tripRequestId ? "Updating Trip..." : "Creating Trip..."}
          </>
        ) : (
          tripRequestId ? "Update Trip Request" : "Create Trip Request"
        )}
      </Button>
    </form>
  );
};

export default TripRequestForm;

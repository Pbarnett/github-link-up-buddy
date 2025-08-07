

type FormEvent = React.FormEvent;
interface FormState {
  success?: boolean;
  error?: string;
  message?: string;
  data?: any;
}

interface SearchFormData {
  origin: string;
  destination: string;
  departureDate: string;
}

// Form action that validates and processes search data
async function searchFlights(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  // Simulate validation delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const origin = formData.get('origin') as string;
  const destination = formData.get('destination') as string;
  const departureDate = formData.get('departureDate') as string;

  // Basic validation
  if (!origin || origin.length < 3) {
    return {
      success: false,
      error: 'Origin must be at least 3 characters long',
    };
  }

  if (!destination || destination.length < 3) {
    return {
      success: false,
      error: 'Destination must be at least 3 characters long',
    };
  }

  if (!departureDate) {
    return {
      success: false,
      error: 'Please select a departure date',
    };
  }

  // Simulate API call
  try {
    const searchData: SearchFormData = {
      origin,
      destination,
      departureDate,
    };

    // Here you would make the actual API call
    // const results = await flightSearchAPI(searchData);

    return {
      success: true,
      message: `Searching flights from ${origin} to ${destination} on ${departureDate}`,
      data: searchData,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Search failed. Please try again.',
    };
  }
}

interface ActionStateFormProps {
  onSearchComplete?: (data: SearchFormData) => void;
  className?: string;
}

export function ActionStateForm({
  onSearchComplete,
  className,
}: ActionStateFormProps) {
  const [state, setState] = useState<FormState | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Handle form submission
  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setIsPending(true);

      const formData = new FormData(event.currentTarget);
      const result = await searchFlights(state, formData);

      setState(result);
      setIsPending(false);
    },
    [state]
  );

  // Handle successful search
  const handleSuccess = useCallback(() => {
    if (state?.success && state.data && onSearchComplete) {
      onSearchComplete(state.data);
    }
  }, [state, onSearchComplete]);

  // Auto-trigger success callback when state changes
  useEffect(() => {
    if (state?.success) {
      handleSuccess();
    }
  }, [state?.success, handleSuccess]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ✈️ Flight Search
          {isPending && (
            <span className="text-sm text-muted-foreground">
              (Searching...)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">From</Label>
              <Input
                id="origin"
                name="origin"
                placeholder="Origin city or airport"
                disabled={isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">To</Label>
              <Input
                id="destination"
                name="destination"
                placeholder="Destination city or airport"
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="departureDate">Departure Date</Label>
            <Input
              id="departureDate"
              name="departureDate"
              type="date"
              disabled={isPending}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Searching Flights...' : 'Search Flights'}
          </Button>
        </form>

        {/* Display state messages */}
        {state?.error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state?.success && state?.message && (
          <Alert className="mt-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {state.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default ActionStateForm;

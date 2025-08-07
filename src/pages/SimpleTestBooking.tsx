
/**
 * Simple Test Booking Page
 *
 * A simplified version of the booking page that doesn't use AWS SDK
 * or other problematic dependencies. Used specifically for e2e testing.
 */

interface FlightSearchFormData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'oneWay' | 'roundTrip';
  adults: number;
  children: number;
  infants: number;
}

const SimpleTestBooking: React.FC = () => {
  const [formData, setFormData] = useState<FlightSearchFormData>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    tripType: 'roundTrip',
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof FlightSearchFormData,
    value: string | number
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear return date if switching to one-way
    if (field === 'tripType' && value === 'oneWay') {
      setFormData(prev => ({ ...prev, returnDate: '' }));
    }
  };

  const validateForm = (): string | null => {
    if (!formData.origin.trim()) return 'Origin is required';
    if (!formData.destination.trim()) return 'Destination is required';
    if (!formData.departureDate) return 'Departure date is required';
    if (formData.tripType === 'roundTrip' && !formData.returnDate) {
      return 'Return date is required for round trip';
    }
    if (formData.origin === formData.destination) {
      return 'Origin and destination must be different';
    }
    if (formData.adults < 1) return 'At least 1 adult is required';
    if (formData.adults + formData.children + formData.infants > 9) {
      return 'Maximum 9 passengers allowed';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate flight search
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      // Mock successful search - in real app this would show results
      console.log('Flight search completed:', formData);
      alert(
        `Flight search completed for ${formData.origin} to ${formData.destination}`
      );
    } catch (err) {
      setError('Flight search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Set minimum departure date to today
  const today = new Date().toISOString().split('T')[0];
  const minReturnDate = formData.departureDate || today;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Test Flight Booking
          </h1>
          <p className="text-gray-600 mt-2">
            This is a test-only page for E2E testing - authentication is
            bypassed
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow-md max-w-4xl"
        >
          {/* Trip type selection */}
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="roundTrip"
                checked={formData.tripType === 'roundTrip'}
                onChange={e =>
                  handleInputChange('tripType', e.target.value as 'roundTrip')
                }
                className="mr-2"
              />
              Round Trip
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="oneWay"
                checked={formData.tripType === 'oneWay'}
                onChange={e =>
                  handleInputChange('tripType', e.target.value as 'oneWay')
                }
                className="mr-2"
              />
              One Way
            </label>
          </div>

          {/* Origin and destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From (Origin)
              </label>
              <input
                type="text"
                placeholder="LAX, New York, etc."
                value={formData.origin}
                onChange={e => handleInputChange('origin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To (Destination)
              </label>
              <input
                type="text"
                placeholder="JFK, London, etc."
                value={formData.destination}
                onChange={e => handleInputChange('destination', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Date
              </label>
              <input
                type="date"
                value={formData.departureDate}
                min={today}
                onChange={e =>
                  handleInputChange('departureDate', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {formData.tripType === 'roundTrip' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Date
                </label>
                <input
                  type="date"
                  value={formData.returnDate || ''}
                  min={minReturnDate}
                  onChange={e =>
                    handleInputChange('returnDate', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}
          </div>

          {/* Passengers */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adults
              </label>
              <select
                value={formData.adults}
                onChange={e =>
                  handleInputChange('adults', parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Children (2-11)
              </label>
              <select
                value={formData.children}
                onChange={e =>
                  handleInputChange('children', parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[0, 1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Infants (under 2)
              </label>
              <select
                value={formData.infants}
                onChange={e =>
                  handleInputChange('infants', parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[0, 1, 2].map(num => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 border border-red-300 rounded-lg bg-red-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400" role="img" aria-label="Error">
                    ⚠️
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Search Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="inline-flex text-red-400 hover:text-red-600"
                  >
                    <span className="sr-only">Dismiss</span>
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Searching flights...
              </div>
            ) : (
              'Search Flights'
            )}
          </button>

          {/* Security notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 Test environment - no real bookings will be made
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleTestBooking;

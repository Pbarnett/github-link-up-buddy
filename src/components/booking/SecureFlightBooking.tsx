/**
 * Secure Flight Booking Component
 * 
 * Complete flight booking flow with secure flight search and payment processing.
 * Integrates AWS Secrets Manager, Stripe payments, and Supabase backend.
 */

import * as React from 'react';
import { useState, useCallback } from 'react';
import { FlightOffer } from '@/services/flightSearchSecure';
import { stripeServiceSecure } from '@/services/stripeServiceSecure';
import SecureFlightSearch from '@/components/flights/SecureFlightSearch';
import { useSecureOAuth } from '@/components/auth/SecureOAuthLogin';

// Booking flow steps
type BookingStep = 'search' | 'details' | 'passenger' | 'payment' | 'confirmation';

// Passenger information interface
interface PassengerInfo {
  type: 'ADULT' | 'CHILD' | 'INFANT';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  email?: string;
  phone?: string;
  passportNumber?: string;
  passportExpiry?: string;
  nationality?: string;
}

// Booking state interface
interface BookingState {
  step: BookingStep;
  selectedFlight: FlightOffer | null;
  passengers: PassengerInfo[];
  contactEmail: string;
  contactPhone: string;
  paymentLoading: boolean;
  paymentError: string | null;
  bookingReference: string | null;
  totalPrice: number;
}

interface SecureFlightBookingProps {
  onBookingComplete?: (bookingReference: string, flight: FlightOffer) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const SecureFlightBooking: React.FC<SecureFlightBookingProps> = ({
  onBookingComplete,
  onError,
  className = '',
}) => {
  const { user, session } = useSecureOAuth();
  
  const [bookingState, setBookingState] = useState<BookingState>({
    step: 'search',
    selectedFlight: null,
    passengers: [],
    contactEmail: user?.email || '',
    contactPhone: '',
    paymentLoading: false,
    paymentError: null,
    bookingReference: null,
    totalPrice: 0,
  });

  /**
   * Handle flight selection from search results
   */
  const handleFlightSelect = useCallback((flight: FlightOffer) => {
    const totalPassengers = (flight.travelerPricings?.length || 1);
    const basePrice = parseFloat(flight.price.total);
    const totalPrice = basePrice * totalPassengers;

    // Initialize passenger information
    const passengers: PassengerInfo[] = flight.travelerPricings?.map((pricing, index) => ({
      type: pricing.travelerType,
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'M',
      email: index === 0 ? user?.email || '' : '',
      phone: index === 0 ? bookingState.contactPhone : '',
    })) || [{
      type: 'ADULT',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'M',
      email: user?.email || '',
      phone: '',
    }];

    setBookingState(prev => ({
      ...prev,
      step: 'details',
      selectedFlight: flight,
      passengers,
      totalPrice,
      paymentError: null,
    }));
  }, [user?.email, bookingState.contactPhone]);

  /**
   * Handle passenger information updates
   */
  const handlePassengerUpdate = useCallback((
    index: number, 
    field: keyof PassengerInfo, 
    value: string
  ) => {
    setBookingState(prev => ({
      ...prev,
      passengers: prev.passengers.map((passenger, i) => 
        i === index ? { ...passenger, [field]: value } : passenger
      ),
    }));
  }, []);

  /**
   * Validate passenger information
   */
  const validatePassengers = (): string | null => {
    for (let i = 0; i < bookingState.passengers.length; i++) {
      const passenger = bookingState.passengers[i];
      
      if (!passenger.firstName.trim()) {
        return `First name is required for passenger ${i + 1}`;
      }
      
      if (!passenger.lastName.trim()) {
        return `Last name is required for passenger ${i + 1}`;
      }
      
      if (!passenger.dateOfBirth) {
        return `Date of birth is required for passenger ${i + 1}`;
      }

      // Validate age based on passenger type
      const birthDate = new Date(passenger.dateOfBirth);
      const today = new Date();
      const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      
      if (passenger.type === 'ADULT' && age < 12) {
        return `Passenger ${i + 1} must be at least 12 years old for adult fare`;
      }
      
      if (passenger.type === 'CHILD' && (age < 2 || age >= 12)) {
        return `Passenger ${i + 1} age must be between 2-11 years for child fare`;
      }
      
      if (passenger.type === 'INFANT' && age >= 2) {
        return `Passenger ${i + 1} must be under 2 years old for infant fare`;
      }
    }

    if (!bookingState.contactEmail.trim() || !bookingState.contactEmail.includes('@')) {
      return 'Valid contact email is required';
    }

    if (!bookingState.contactPhone.trim()) {
      return 'Contact phone number is required';
    }

    return null;
  };

  /**
   * Proceed to payment step
   */
  const proceedToPayment = () => {
    const validationError = validatePassengers();
    if (validationError) {
      setBookingState(prev => ({ ...prev, paymentError: validationError }));
      onError?.(validationError);
      return;
    }

    setBookingState(prev => ({
      ...prev,
      step: 'payment',
      paymentError: null,
    }));
  };

  /**
   * Process payment and complete booking
   */
  const processPayment = async () => {
    if (!bookingState.selectedFlight || !session) {
      setBookingState(prev => ({ 
        ...prev, 
        paymentError: 'Authentication required for booking' 
      }));
      return;
    }

    setBookingState(prev => ({
      ...prev,
      paymentLoading: true,
      paymentError: null,
    }));

    try {
      // Create payment intent with flight booking metadata
      const paymentResult = await stripeServiceSecure.createPaymentIntent({
        amount: Math.round(bookingState.totalPrice * 100), // Convert to cents
        currency: bookingState.selectedFlight.price.currency.toLowerCase(),
        metadata: {
          type: 'flight_booking',
          flight_id: bookingState.selectedFlight.id,
          provider: bookingState.selectedFlight.provider,
          passenger_count: bookingState.passengers.length.toString(),
          contact_email: bookingState.contactEmail,
          contact_phone: bookingState.contactPhone,
          user_id: user?.id || '',
        },
        receipt_email: bookingState.contactEmail,
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment creation failed');
      }

      // Confirm payment (in real app, this would be handled by Stripe Elements)
      const confirmResult = await stripeServiceSecure.confirmPayment(
        paymentResult.clientSecret!,
        {
          payment_method: {
            card: {
              // This would be replaced with actual card details from Stripe Elements
              // For demo purposes, using test card
              number: '4242424242424242',
              exp_month: 12,
              exp_year: 2025,
              cvc: '123',
            },
            billing_details: {
              name: `${bookingState.passengers[0].firstName} ${bookingState.passengers[0].lastName}`,
              email: bookingState.contactEmail,
              phone: bookingState.contactPhone,
            },
          },
        }
      );

      if (!confirmResult.success) {
        throw new Error(confirmResult.error || 'Payment confirmation failed');
      }

      // Generate booking reference
      const bookingReference = `FB-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      setBookingState(prev => ({
        ...prev,
        step: 'confirmation',
        paymentLoading: false,
        bookingReference,
        paymentError: null,
      }));

      onBookingComplete?.(bookingReference, bookingState.selectedFlight);

    } catch (error) {
      console.error('Payment processing failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      
      setBookingState(prev => ({
        ...prev,
        paymentLoading: false,
        paymentError: errorMessage,
      }));
      
      onError?.(errorMessage);
    }
  };

  /**
   * Start new booking
   */
  const startNewBooking = () => {
    setBookingState({
      step: 'search',
      selectedFlight: null,
      passengers: [],
      contactEmail: user?.email || '',
      contactPhone: '',
      paymentLoading: false,
      paymentError: null,
      bookingReference: null,
      totalPrice: 0,
    });
  };

  /**
   * Format price display
   */
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  /**
   * Render flight details step
   */
  const renderFlightDetails = () => {
    if (!bookingState.selectedFlight) return null;

    const flight = bookingState.selectedFlight;
    
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Selected Flight
          </h3>
          
          {flight.itineraries.map((itinerary, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-medium">
                    {itinerary.segments[0].departure.iataCode} → {' '}
                    {itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(itinerary.segments[0].departure.at).toLocaleString()} - {' '}
                    {new Date(itinerary.segments[itinerary.segments.length - 1].arrival.at).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">
                    {formatPrice(bookingState.totalPrice, flight.price.currency)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Total for {bookingState.passengers.length} passenger{bookingState.passengers.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setBookingState(prev => ({ ...prev, step: 'search' }))}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Back to Search
          </button>
          <button
            onClick={() => setBookingState(prev => ({ ...prev, step: 'passenger' }))}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  /**
   * Render passenger information step
   */
  const renderPassengerInfo = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Passenger Information
          </h3>

          {bookingState.passengers.map((passenger, index) => (
            <div key={index} className="mb-8 last:mb-6 pb-6 border-b last:border-b-0">
              <h4 className="font-medium text-gray-800 mb-4">
                Passenger {index + 1} ({passenger.type})
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={passenger.firstName}
                    onChange={(e) => handlePassengerUpdate(index, 'firstName', (e.target as HTMLInputElement).value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={passenger.lastName}
                    onChange={(e) => handlePassengerUpdate(index, 'lastName', (e.target as HTMLInputElement).value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={passenger.dateOfBirth}
                    onChange={(e) => handlePassengerUpdate(index, 'dateOfBirth', (e.target as HTMLInputElement).value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={passenger.gender}
                    onChange={(e) => handlePassengerUpdate(index, 'gender', (e.target as HTMLSelectElement).value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-800 mb-4">Contact Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={bookingState.contactEmail}
                  onChange={(e) => setBookingState(prev => ({ 
                    ...prev, 
                    contactEmail: (e.target as HTMLInputElement).value 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={bookingState.contactPhone}
                  onChange={(e) => setBookingState(prev => ({ 
                    ...prev, 
                    contactPhone: (e.target as HTMLInputElement).value 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error display */}
        {bookingState.paymentError && (
          <div className="p-4 border border-red-300 rounded-lg bg-red-50">
            <div className="text-sm text-red-700">
              {bookingState.paymentError}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setBookingState(prev => ({ ...prev, step: 'details' }))}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={proceedToPayment}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    );
  };

  /**
   * Render payment step
   */
  const renderPayment = () => {
    if (!bookingState.selectedFlight) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Payment
          </h3>

          {/* Booking Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Booking Summary</h4>
            <div className="flex justify-between text-sm">
              <span>Flight Total:</span>
              <span>{formatPrice(bookingState.totalPrice, bookingState.selectedFlight.price.currency)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Passengers:</span>
              <span>{bookingState.passengers.length}</span>
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
              <span>Total:</span>
              <span>{formatPrice(bookingState.totalPrice, bookingState.selectedFlight.price.currency)}</span>
            </div>
          </div>

          {/* Payment Form (simplified for demo) */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Demo mode: Using test card 4242 4242 4242 4242
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="12/25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVC
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error display */}
        {bookingState.paymentError && (
          <div className="p-4 border border-red-300 rounded-lg bg-red-50">
            <div className="text-sm text-red-700">
              {bookingState.paymentError}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setBookingState(prev => ({ ...prev, step: 'passenger' }))}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            disabled={bookingState.paymentLoading}
          >
            Back
          </button>
          <button
            onClick={processPayment}
            disabled={bookingState.paymentLoading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-md"
          >
            {bookingState.paymentLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </div>
            ) : (
              `Pay ${formatPrice(bookingState.totalPrice, bookingState.selectedFlight.price.currency)}`
            )}
          </button>
        </div>
      </div>
    );
  };

  /**
   * Render confirmation step
   */
  const renderConfirmation = () => {
    if (!bookingState.selectedFlight || !bookingState.bookingReference) return null;

    return (
      <div className="text-center space-y-6">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            Your flight has been booked successfully.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">
              Booking Reference
            </h3>
            <div className="text-2xl font-mono font-bold text-blue-600">
              {bookingState.bookingReference}
            </div>
          </div>

          <div className="text-left">
            <h4 className="font-medium text-gray-800 mb-2">Flight Details:</h4>
            <div className="text-sm text-gray-600">
              {bookingState.selectedFlight.itineraries[0].segments[0].departure.iataCode} → {' '}
              {bookingState.selectedFlight.itineraries[0].segments[
                bookingState.selectedFlight.itineraries[0].segments.length - 1
              ].arrival.iataCode}
            </div>
            <div className="text-sm text-gray-600">
              {bookingState.passengers.length} passenger{bookingState.passengers.length > 1 ? 's' : ''}
            </div>
            <div className="text-sm text-gray-600">
              Total: {formatPrice(bookingState.totalPrice, bookingState.selectedFlight.price.currency)}
            </div>
          </div>
        </div>

        <button
          onClick={startNewBooking}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Book Another Flight
        </button>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            🔒 Secure booking powered by AWS Secrets Manager & Stripe
          </p>
        </div>
      </div>
    );
  };

  // Render appropriate step
  const renderCurrentStep = () => {
    switch (bookingState.step) {
      case 'search':
        return (
          <SecureFlightSearch 
            onFlightSelect={handleFlightSelect}
            onError={onError}
          />
        );
      case 'details':
        return renderFlightDetails();
      case 'passenger':
        return renderPassengerInfo();
      case 'payment':
        return renderPayment();
      case 'confirmation':
        return renderConfirmation();
      default:
        return null;
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Progress indicator */}
      {bookingState.step !== 'confirmation' && (
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            {['search', 'details', 'passenger', 'payment'].map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${
                  index === ['search', 'details', 'passenger', 'payment'].indexOf(bookingState.step)
                    ? 'text-blue-600'
                    : index < ['search', 'details', 'passenger', 'payment'].indexOf(bookingState.step)
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === ['search', 'details', 'passenger', 'payment'].indexOf(bookingState.step)
                    ? 'bg-blue-600 text-white'
                    : index < ['search', 'details', 'passenger', 'payment'].indexOf(bookingState.step)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200'
                }`}>
                  {index + 1}
                </div>
                <span className="ml-2 text-sm font-medium capitalize">
                  {step === 'passenger' ? 'Passengers' : step}
                </span>
                {index < 3 && <div className="ml-4 text-gray-300">→</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current step content */}
      {renderCurrentStep()}
    </div>
  );
};

export default SecureFlightBooking;

import React, { useState } from 'react';

interface Flight {
  id: string;
  airline: string;
  flight: string;
  origin: string;
  destination: string;
  departure: {
    time: string;
    date: string;
    airport: string;
  };
  arrival: {
    time: string;
    date: string;
    airport: string;
  };
  duration: string;
  price: {
    amount: number;
    currency: string;
  };
  available: boolean;
  class: string;
}

interface BookingResponse {
  bookingId: string;
  confirmationCode: string;
  status: string;
  message: string;
  timestamp: string;
}

const FlightBookingApp: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults(null);
    setFlights([]);
    
    try {
      const apiUrl = 'https://1uah63t770.execute-api.us-east-1.amazonaws.com/production/flight-search';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: 'LAX',
          destination: 'JFK',
          departureDate: '2025-09-01',
          passengers: 1
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFlights(data.flights || []);
        setSearchResults(`Found ${data.count} flights for ${data.query.origin} → ${data.query.destination}`);
      } else {
        setSearchResults(`Error: ${data.error || 'Failed to search flights'}`);
      }
    } catch (error) {
      console.error('Flight search error:', error);
      setSearchResults('Error: Network error while searching flights');
    } finally {
      setIsSearching(false);
    }
  };

  const handleBooking = async (flight?: Flight) => {
    const flightToBook = flight || selectedFlight || flights[0];
    
    if (!flightToBook) {
      alert('Please search for flights first or select a flight to book');
      return;
    }
    
    setIsBooking(true);
    setBookingResult(null);
    
    try {
      const apiUrl = 'https://1uah63t770.execute-api.us-east-1.amazonaws.com/production/flight-booking';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightId: flightToBook.id,
          passenger: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          }
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setBookingResult(data);
      } else {
        alert(`Booking Error: ${data.error || 'Failed to book flight'}`);
      }
    } catch (error) {
      console.error('Flight booking error:', error);
      alert('Error: Network error while booking flight');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ✈️ Parker Flight
          </h1>
          <p className="text-xl text-gray-600">
            Smart Flight Search & Booking Platform
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
              Find Your Perfect Flight
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Flight Search */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  🔍 Search Flights
                </h3>
                <p className="text-gray-700 mb-4">
                  Search through thousands of flights to find the best deals
                </p>
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? '🔍 Searching...' : 'Search Flights'}
                </button>
              </div>

              {/* Flight Booking */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                  📝 Book Flight
                </h3>
                <p className="text-gray-700 mb-4">
                  Secure booking with instant confirmation
                </p>
                <button
                  onClick={() => handleBooking()}
                  disabled={isBooking || flights.length === 0}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBooking ? '📝 Booking...' : 'Book Now'}
                </button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchResults && (
            <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Search Results</h3>
              <p className="text-lg text-gray-700 mb-4">{searchResults}</p>
              
              {flights.length > 0 && (
                <div className="space-y-4">
                  {flights.map((flight) => (
                    <div key={flight.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">
                            {flight.airline} - {flight.flight}
                          </h4>
                          <p className="text-gray-600">
                            {flight.departure.airport} ({flight.departure.time}) → {flight.arrival.airport} ({flight.arrival.time})
                          </p>
                          <p className="text-sm text-gray-500">
                            Duration: {flight.duration} | Class: {flight.class}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            ${flight.price.amount}
                          </p>
                          <button
                            onClick={() => handleBooking(flight)}
                            disabled={isBooking}
                            className="mt-2 bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {isBooking ? 'Booking...' : 'Book This Flight'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Booking Confirmation */}
          {bookingResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-semibold text-green-800 mb-4">✅ Booking Confirmed!</h3>
              <div className="space-y-2">
                <p className="text-lg"><strong>Booking ID:</strong> {bookingResult.bookingId}</p>
                <p className="text-lg"><strong>Confirmation Code:</strong> <span className="font-mono bg-green-200 px-2 py-1 rounded">{bookingResult.confirmationCode}</span></p>
                <p className="text-lg"><strong>Status:</strong> {bookingResult.status}</p>
                <p className="text-gray-700">{bookingResult.message}</p>
                <p className="text-sm text-gray-600">Booked at: {new Date(bookingResult.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Fast Search</h3>
              <p className="text-gray-600">Lightning-fast flight search powered by AWS</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Compare prices from multiple airlines</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">Enterprise-grade security for all transactions</p>
            </div>
          </div>

          {/* API Information */}
          <div className="bg-gray-900 text-white rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4">🚀 API Endpoints</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-300 mb-2">Flight Search API</h4>
                <p className="text-sm font-mono bg-gray-800 p-2 rounded">
                  https://1uah63t770.execute-api.us-east-1.amazonaws.com/production/flight-search
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-300 mb-2">Flight Booking API</h4>
                <p className="text-sm font-mono bg-gray-800 p-2 rounded">
                  https://1uah63t770.execute-api.us-east-1.amazonaws.com/production/flight-booking
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-600">
          <p>© 2025 Parker Flight - Powered by AWS</p>
        </footer>
      </div>
    </div>
  );
};

export default FlightBookingApp;

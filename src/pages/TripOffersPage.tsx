import { useSearchParams } from 'react-router-dom';
import { FlightOffersList } from '@/components/FlightOffersList';

export default function TripOffersPage() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('id');

  if (!tripId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">No Trip ID Provided</h1>
          <p className="mt-2 text-gray-600">Please start a new trip search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Trip Offers</h1>
        <FlightOffersList tripId={tripId} />
      </div>
    </div>
  );
}


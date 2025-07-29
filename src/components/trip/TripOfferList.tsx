import * as React from 'react';
import { FC } from 'react';
import { Offer } from '@/services/tripOffersService';
import TripOfferCard from '@/components/trip/TripOfferCard';
import TripOffersLoading from '@/components/trip/TripOffersLoading';
import { Card } from '@/components/ui/card';
interface TripOfferListProps {
  offers: Offer[];
  isLoading: boolean;
  usedRelaxedCriteria: boolean;
  ignoreFilter: boolean;
}

const TripOfferList: FC<TripOfferListProps> = ({
  offers,
  isLoading,
  usedRelaxedCriteria,
  ignoreFilter,
}) => {
  if (isLoading) {
    return <TripOffersLoading />;
  }

  // Sort offers by price (cheapest first)
  const sortedOffers = [...offers].sort((a, b) => a.price - b.price);

  return (
    <div className="space-y-4">
      {sortedOffers.length > 0 ? (
        sortedOffers.map(offer => (
          <TripOfferCard key={offer.id} offer={offer} />
        ))
      ) : (
        <Card className="p-6 text-center">
          <p className="mb-4">No offers found that match your criteria.</p>
          <p className="text-sm text-gray-500">
            {usedRelaxedCriteria
              ? "We tried with relaxed criteria but still couldn't find any offers. Try adjusting your destination or dates."
              : ignoreFilter
                ? 'Try adjusting your budget or destination, or click Refresh Offers.'
                : 'Try one of the search options above or adjust your trip criteria.'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default TripOfferList;

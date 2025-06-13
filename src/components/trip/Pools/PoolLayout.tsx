
import React from 'react';
import { useTripOffersPools } from '@/hooks/useTripOffers';
import { getPoolDisplayName } from '@/utils/getPoolDisplayName';
import PoolSection from './PoolSection';
import TripOfferCard from '../TripOfferCard';
import { Skeleton } from '@/components/ui/skeleton';

interface PoolLayoutProps {
  tripId: string;
}

const PoolLayout: React.FC<PoolLayoutProps> = ({ tripId }) => {
  const {
    pool1,
    pool2,
    pool3,
    mode,
    isLoading,
    hasError,
    errorMessage
  } = useTripOffersPools({ tripId });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-center text-red-600 py-8">
        Error loading offers: {errorMessage}
      </div>
    );
  }

  const pools = [pool1, pool2, pool3];
  
  return (
    <div className="space-y-6">
      {pools.map((pool, index) => {
        const poolName = getPoolDisplayName(mode, (index + 1) as 1 | 2 | 3);
        return (
          <PoolSection
            key={index}
            name={poolName}
            count={pool.length}
            defaultOpen={index === 0}
          >
            {pool.map((offer) => (
              <TripOfferCard key={offer.id} offer={offer} />
            ))}
          </PoolSection>
        );
      })}
    </div>
  );
};

export default PoolLayout;

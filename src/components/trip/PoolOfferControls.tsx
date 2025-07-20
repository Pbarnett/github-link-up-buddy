

import * as React from 'react';
const { useState } = React;
type FC<T = {}> = React.FC<T>;

import { useTripOffersPools } from '@/hooks/useTripOffers';
import ConstraintChips from './ConstraintChips';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface PoolOfferControlsProps {
  tripId: string;
}

const PoolOfferControls: FC<PoolOfferControlsProps> = ({ tripId }) => {
  const [nonStopOnly, setNonStopOnly] = useState(false);
  
  const {
    budget,
    maxBudget,
    dateRange,
    bumpsUsed,
    bumpBudget,
  } = useTripOffersPools({ tripId });

  const toggleNonStop = () => {
    setNonStopOnly(prev => !prev);
    // TODO: Apply non-stop filter to offers when implemented
  };

  const handleBumpBudget = () => {
    bumpBudget();
    toast({ 
      title: `Budget raised to $${budget.toFixed(0)}`,
      description: `Maximum budget: $${maxBudget.toFixed(0)}`
    });
    console.log('[ANALYTICS] BUDGET_BUMPED', { 
      tripId, 
      bumpsUsed: bumpsUsed + 1,
      newBudget: budget,
      maxBudget 
    });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border ring-focus" tabIndex={-1}>
      <ConstraintChips
        dateRange={dateRange}
        nonStopOnly={nonStopOnly}
        onToggleNonStop={toggleNonStop}
      />
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Budget: ${budget.toFixed(0)} / Max: ${maxBudget.toFixed(0)}
          {bumpsUsed > 0 && (
            <span className="ml-2 text-orange-600">
              ({bumpsUsed}/3 raises used)
            </span>
          )}
        </div>
        
        <Button
          onClick={handleBumpBudget}
          disabled={bumpsUsed >= 3 || budget >= maxBudget}
          variant="outline"
          size="sm"
          aria-label={`Increase budget by 20% (${bumpsUsed}/3 increases used)`}
        >
          +20% Budget
        </Button>
      </div>
    </div>
  );
};

export default PoolOfferControls;

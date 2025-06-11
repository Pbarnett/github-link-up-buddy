
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useConstraintState } from "@/hooks/useConstraintState";
import { formatCurrency } from "@/utils/formatCurrency";
import { Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Offer } from "@/services/tripOffersService";

interface TripOfferControlsProps {
  onRefreshOffers: () => void;
  onRelaxCriteria: () => void;
  onOverrideSearch: () => void;
  isRefreshing: boolean;
  isLoading: boolean;
  offers: Offer[];
  usedRelaxedCriteria: boolean;
  ignoreFilter: boolean;
  hasError: boolean;
}

const TripOfferControls: React.FC<TripOfferControlsProps> = ({
  onRefreshOffers,
  onRelaxCriteria,
  onOverrideSearch,
  isRefreshing,
  isLoading,
  offers,
  usedRelaxedCriteria,
  ignoreFilter,
  hasError,
}) => {
  const showNew = useFeatureFlag('use_new_constraints');
  const { budgetMultiplier, setBudgetMultiplier, currentBudget } = useConstraintState();

  const handleBudgetBump = () => {
    const oldMultiplier = budgetMultiplier;
    const next = budgetMultiplier * 1.2;
    setBudgetMultiplier(next);
    
    toast({
      title: 'Budget updated',
      description: `Searching up to ${formatCurrency(currentBudget * 1.2)}.`,
      action: (
        <ToastAction
          altText="Undo budget bump"
          onClick={() => setBudgetMultiplier(oldMultiplier)}
        >
          Undo
        </ToastAction>
      ),
    });
  };

  return (
    <div className="w-full max-w-5xl">
      {/* Combined Back to Search Link & Offer Count */}
      <div className="mb-4 flex flex-wrap items-center justify-between">
        {/* BACK TO SEARCH */}
        <Link
          to="/trip/new"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          aria-label="Return to search form"
        >
          <svg
            className="w-4 h-4 transform rotate-180 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="ml-1">Back to Search</span>
        </Link>

        {/* DIVIDER DOT + OFFERS COUNT */}
        {!isLoading && offers.length > 0 && (
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <span className="text-gray-300 text-base hidden sm:inline">•</span>
            <span className="text-sm text-gray-700">
              {offers.length} flight offer{offers.length !== 1 ? "s" : ""} found
            </span>
          </div>
        )}
      </div>

      {/* Controls section */}
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        {/* New constraint controls - always show when flag is on */}
        {showNew && (
          <span
            role="status"
            className="flex items-center bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-100 rounded-full px-3 py-1 text-xs opacity-70 cursor-not-allowed"
          >
            <Lock size={12} className="mr-1" aria-label="Locked" />
            Carry-on required
          </span>
        )}

        {showNew && (
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            disabled={budgetMultiplier >= 1.73}
            onClick={handleBudgetBump}
          >
            {budgetMultiplier === 1
              ? `+20% budget (${formatCurrency(currentBudget)} → ${formatCurrency(currentBudget * 1.2)})`
              : budgetMultiplier < 1.73
              ? '+20% again'
              : '+20% budget'}
          </Button>
        )}

        {/* Action buttons - show when error, or no offers, and not loading */}
        {(hasError || offers.length === 0) && !isLoading && (
          <>
            {!usedRelaxedCriteria && (
              <Button
                variant="outline"
                onClick={onRelaxCriteria}
                disabled={isRefreshing || isLoading}
              >
                Try Relaxed Criteria
              </Button>
            )}
            {!ignoreFilter && (
              <Button
                variant="outline"
                onClick={onOverrideSearch}
                disabled={isRefreshing || isLoading}
              >
                Search Any Duration
              </Button>
            )}
            <Button
              onClick={onRefreshOffers}
              disabled={isRefreshing || isLoading}
            >
              {isRefreshing ? "Refreshing..." : "Refresh Offers"}
            </Button>
          </>
        )}
      </div>

      {/* Empty-state after 3 bumps */}
      {showNew && budgetMultiplier >= 1.73 && offers.length === 0 && !isLoading && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Still no flights at this price
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Try widening dates or adding nearby airports.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Placeholder for future date widening functionality
              toast({
                title: "Feature coming soon",
                description: "Date widening will be available in a future update.",
              });
            }}
          >
            Search ±3 days
          </Button>
        </div>
      )}
    </div>
  );
};

export default TripOfferControls;

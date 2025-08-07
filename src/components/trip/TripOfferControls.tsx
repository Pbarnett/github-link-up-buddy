

@/services/tripOffersService'; // Assuming Offer type is needed for offers.length

type FC<T = {}> = React.FC<T>;

interface TripOfferControlsProps {
  onRefreshOffers: () => void;
  onRelaxCriteria: () => void;
  onOverrideSearch: () => void;
  isRefreshing: boolean;
  isLoading: boolean;
  offers: Offer[];
  usedRelaxedCriteria: boolean;
  ignoreFilter: boolean;
  hasError: boolean; // To decide when to show action buttons for error/no offers scenarios
}

const TripOfferControls: FC<TripOfferControlsProps> = ({
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
  return (
    <div className="w-full max-w-5xl">
      {/* Combined Back to Search Link & Offer Count */}
      <div className="mb-4 flex flex-wrap items-center justify-between">
        {/* BACK TO SEARCH */}
        <Link
          to="/search"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          aria-label="Return to search options"
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
              {offers.length} flight offer{offers.length !== 1 ? 's' : ''} found
            </span>
          </div>
        )}
      </div>

      {/* Action buttons - show when error, or no offers, and not loading */}
      {(hasError || offers.length === 0) && !isLoading && (
        <div className="mb-6 flex gap-2">
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
            {isRefreshing ? 'Refreshing...' : 'Refresh Offers'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TripOfferControls;

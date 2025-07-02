import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterTogglesSection from './FilterTogglesSection';

// No longer needs form control since this shows informational content only
interface CollapsibleFiltersSectionProps {
  control?: any; // Optional for backward compatibility but not used
}

const CollapsibleFiltersSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 p-0 h-auto font-medium"
      >
        <Info className="w-4 h-4" />
        <span>What's Included</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>
      
      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Flight Features</h4>
            <FilterTogglesSection />
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleFiltersSection;

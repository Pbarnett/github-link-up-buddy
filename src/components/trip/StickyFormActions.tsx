

import * as React from 'react';
const { useState, useEffect } = React;

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Control, useWatch } from "react-hook-form";

interface StickyFormActionsFormData {
  nyc_airports?: string[];
  other_departure_airport?: string;
  destination_airport?: string;
  destination_other?: string;
  max_price?: number;
  min_duration?: number;
  max_duration?: number;
  nonstop_required?: boolean;
  [key: string]: unknown; // Allow additional fields for flexibility
}

interface StickyFormActionsProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  buttonText: string;
  onSubmit: () => void;
  control: Control<StickyFormActionsFormData>;
}

const StickyFormActions = ({ 
  isSubmitting, 
  isFormValid, 
  buttonText, 
  onSubmit,
  control 
}: StickyFormActionsProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSticky, setIsSticky] = useState(false);
  const watchedFields = useWatch({ control });

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const formElement = document.querySelector('form');
      if (!formElement) return;
      
      const formRect = formElement.getBoundingClientRect();
      const shouldBeSticky = formRect.bottom < window.innerHeight;
      setIsSticky(shouldBeSticky);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initially
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const renderSummaryChips = () => {
    const chips = [];
    
    // Origin → Destination chip
    const origin = (watchedFields?.nyc_airports && watchedFields.nyc_airports.length > 0) 
      ? watchedFields.nyc_airports.join(', ') 
      : watchedFields?.other_departure_airport || '';
    const destination = watchedFields?.destination_airport || watchedFields?.destination_other || '';
    
    if (origin && destination) {
      chips.push(
        <Badge key="route" variant="outline" className="flex items-center gap-1">
          <span>{origin} ↔ {destination}</span>
        </Badge>
      );
    }
    
    // Price chip
    if (watchedFields?.max_price) {
      chips.push(
        <Badge key="price" variant="outline" className="flex items-center gap-1">
          <span>≤ ${watchedFields.max_price}</span>
        </Badge>
      );
    }
    
    // Duration chip
    if (watchedFields?.min_duration && watchedFields?.max_duration) {
      chips.push(
        <Badge key="duration" variant="outline" className="flex items-center gap-1">
          <span>{watchedFields.min_duration}-{watchedFields.max_duration} days</span>
        </Badge>
      );
    }
    
    // Features chips
    if (watchedFields?.nonstop_required) {
      chips.push(
        <Badge key="nonstop" variant="outline" className="bg-blue-50 text-blue-700">
          Non-stop
        </Badge>
      );
    }
    
    return chips;
  };

  if (isMobile || !isSticky) return null;

  const summaryChips = renderSummaryChips();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 z-40">
      <div className="max-w-4xl mx-auto">
        {/* Summary chips */}
        {summaryChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {summaryChips}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => navigate("/auto-booking")} 
            disabled={isSubmitting}
            className="text-gray-600 hover:text-gray-900"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !isFormValid}
            data-testid="sticky-submit-button"
            className={`px-8 py-2 font-medium disabled:opacity-50 ${
              isFormValid 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyFormActions;

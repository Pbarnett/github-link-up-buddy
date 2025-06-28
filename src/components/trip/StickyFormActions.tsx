
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface StickyFormActionsProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  buttonText: string;
  onSubmit: () => void;
}

const StickyFormActions = ({ 
  isSubmitting, 
  isFormValid, 
  buttonText, 
  onSubmit 
}: StickyFormActionsProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSticky, setIsSticky] = useState(false);

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

  if (isMobile || !isSticky) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 z-40">
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => navigate("/dashboard")} 
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 font-medium disabled:opacity-50"
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
  );
};

export default StickyFormActions;

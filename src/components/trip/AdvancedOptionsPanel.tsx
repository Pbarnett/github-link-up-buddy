
import { Control, UseFormWatch } from "react-hook-form";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DepartureAirportsSection from "./sections/DepartureAirportsSection";

interface AdvancedOptionsPanelProps {
  control: Control<any>;
  watch: UseFormWatch<any>;
}

const AdvancedOptionsPanel = ({ control, watch }: AdvancedOptionsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-between p-0 h-auto text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <span>+ More Options</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-4 pt-4 border-t border-gray-200">
        <DepartureAirportsSection control={control} />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AdvancedOptionsPanel;

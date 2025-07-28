import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import DepartureAirportsSection from './sections/DepartureAirportsSection';
import { useState } from 'react';
import { Control } from 'react-hook-form';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  Calendar,
  CalendarIcon,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  Info,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  Plane,
  PlaneTakeoff,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Shield,
  Trash2,
  Upload,
  User,
  Wifi,
  X,
  XCircle,
  Zap,
} from 'lucide-react';

interface AdvancedOptionsPanelProps {
  control: Control<Record<string, unknown>>;
}

const AdvancedOptionsPanel = ({ control }: AdvancedOptionsPanelProps) => {
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

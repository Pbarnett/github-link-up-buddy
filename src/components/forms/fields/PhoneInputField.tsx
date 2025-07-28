/**
 * Phone Input Field Component
 *
 * Simple phone input with basic formatting
 */

type ChangeEvent<T = Element> = React.ChangeEvent<T>;
type _Component<P = {}, S = {}> = React.Component<P, S>;
type FC<T = {}> = React.FC<T>;

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
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

interface PhoneInputFieldProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const PhoneInputField: FC<PhoneInputFieldProps> = ({
  value = '',
  onChange,
  placeholder = 'Enter phone number',
  disabled = false,
  error,
  className,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = (e.target as HTMLInputElement).value;

    // Basic phone number formatting (US format)
    const cleaned = inputValue.replace(/\D/g, '');
    let formatted = cleaned;

    if (cleaned.length >= 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 3) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }

    onChange(formatted);
  };

  return (
    <div className="relative">
      <Input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn('pl-8', error && 'border-destructive', className)}
        maxLength={14} // (123) 456-7890
      />
      <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
    </div>
  );
};

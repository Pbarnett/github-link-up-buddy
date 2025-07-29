import * as React from 'react';
import {
  Suspense,
  Fragment,
  createElement,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  useReducer,
  useDeferredValue,
  useTransition,
  lazy,
} from 'react';

type ComponentType<P = {}> = React.ComponentType<P>;
import { UseFormReturn } from 'react-hook-form';
/**
 * Global Imports Helper
 *
 * This file provides commonly needed imports to reduce repetitive import statements
 * across the application. Import this file when you need multiple React/library functions.
 */

// React Core
export {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useReducer,
  forwardRef,
  createContext,
  memo,
  Suspense,
  Fragment,
  lazy,
  useTransition,
  useDeferredValue,
  createElement,
} from 'react';

// React Router
export { useNavigate, useLocation, Link } from 'react-router-dom';

// React Hook Form
export {
  useForm,
  useFormContext,
  useWatch,
  Controller,
  FormProvider,
} from 'react-hook-form';

// Stripe
export {
  useStripe,
  useElements,
  CardElement,
  Elements,
} from '@stripe/react-stripe-js';

// Lucide Icons - Most commonly used
export {
  // Navigation & Actions
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Home,
  Settings,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Minus,
  X,
  Check,

  // Status & Feedback
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Info,
  HelpCircle,
  Loader2,

  // Travel & Location
  Plane,
  PlaneTakeoff,
  MapPin,
  Globe,
  Calendar,
  CalendarIcon,
  Clock,

  // User & Profile
  User,
  Mail,
  Phone,
  Bell,
  Shield,
  Lock,

  // Business & Finance
  DollarSign,
  CreditCard,
  Package,

  // Files & Data
  FileText,
  Upload,
  Download,
  Save,
  Eye,

  // System & Network
  Wifi,
  Zap,

  // Actions & Tools
  Trash2,
  Edit,

  // Additional commonly used icons
  Circle,
} from 'lucide-react';

// Type helpers
export type { Control, UseFormReturn, FieldValues } from 'react-hook-form';

export type {
  ComponentType,
  ReactNode,
  // ElementRefPropsWithoutRef, // Not available in React 19
} from 'react';

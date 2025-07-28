import * as React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { cn } from '@/lib/utils';


type ElementRef<T extends React.ElementType> = React.ElementRef<T>;
type ComponentPropsWithoutRef<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T>;

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };

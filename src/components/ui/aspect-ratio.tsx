import * as React from 'react';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import { cn } from '@/lib/utils';


type ElementRef<T extends React.ElementType> = React.ElementRef<T>;
type ComponentPropsWithoutRef<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T>;

const AspectRatio = AspectRatioPrimitive.Root;
export { AspectRatio };

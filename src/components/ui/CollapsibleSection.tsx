
import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  animationDuration?: number;
  className?: string;
}

const CollapsibleSection = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  CollapsibleSectionProps
>(({ 
  title, 
  children, 
  defaultOpen = false, 
  onToggle, 
  animationDuration = 200,
  className,
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const titleId = React.useId();

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
    onToggle?.(open);
  };

  return (
    <CollapsiblePrimitive.Root
      ref={ref}
      open={isOpen}
      onOpenChange={handleToggle}
      className={cn("w-full", className)}
      {...props}
    >
      <h3 id={titleId} className="text-lg font-semibold mb-2">
        {title}
      </h3>
      
      <CollapsiblePrimitive.Trigger
        aria-labelledby={titleId}
        data-testid="collapsible-trigger"
        className={cn(
          "flex w-full items-center justify-between py-2 px-3",
          "text-left font-medium text-sm",
          "border border-border rounded-md",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "transition-colors duration-200",
          "[&[data-state=open]>svg]:rotate-180"
        )}
        style={{
          transitionDuration: `${animationDuration}ms`
        }}
      >
        <span>Toggle content</span>
        <ChevronDown 
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            "@media (prefers-reduced-motion: reduce) { transition: none; }"
          )}
          style={{
            transitionDuration: `${animationDuration}ms`
          }}
        />
      </CollapsiblePrimitive.Trigger>

      <CollapsiblePrimitive.Content
        data-testid="collapsible-content"
        className={cn(
          "overflow-hidden text-sm",
          "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
          "@media (prefers-reduced-motion: reduce) { animation: none; }"
        )}
        style={{
          // Override animation duration if specified
          animationDuration: `${animationDuration}ms`
        }}
      >
        <div className="pt-4">
          {children}
        </div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
});

CollapsibleSection.displayName = "CollapsibleSection";

export { CollapsibleSection };

import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { useContext } from 'react';
import { Dot } from 'lucide-react';

import { OTPInput, OTPInputContext } from 'input-otp';
import { cn } from '@/lib/utils';
interface InputOTPProps
  extends React.ComponentPropsWithoutRef<typeof OTPInput> {
  ref?: React.Ref<React.ElementRef<typeof OTPInput>>;
}

const InputOTP = ({
  className,
  containerClassName,
  ref,
  ...props
}: InputOTPProps) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      'flex items-center gap-2 has-[:disabled]:opacity-50',
      containerClassName
    )}
    className={cn('disabled:cursor-not-allowed', className)}
    {...props}
  />
);
InputOTP.displayName = 'InputOTP';

interface InputOTPGroupProps extends React.ComponentPropsWithoutRef<'div'> {
  ref?: React.Ref<React.ElementRef<'div'>>;
}

const InputOTPGroup = ({ className, ref, ...props }: InputOTPGroupProps) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
);
InputOTPGroup.displayName = 'InputOTPGroup';

interface InputOTPSlotProps extends React.ComponentPropsWithoutRef<'div'> {
  index: number;
  ref?: React.Ref<React.ElementRef<'div'>>;
}

const InputOTPSlot = ({
  index,
  className,
  ref,
  ...props
}: InputOTPSlotProps) => {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
        isActive && 'z-10 ring-2 ring-ring ring-offset-background',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
};
InputOTPSlot.displayName = 'InputOTPSlot';

interface InputOTPSeparatorProps extends React.ComponentPropsWithoutRef<'div'> {
  ref?: React.Ref<React.ElementRef<'div'>>;
}

const InputOTPSeparator = ({ ref, ...props }: InputOTPSeparatorProps) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
);
InputOTPSeparator.displayName = 'InputOTPSeparator';

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };

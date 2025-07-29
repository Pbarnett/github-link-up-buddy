import * as React from 'react';
import { useState, useEffect, useCallback, useContext } from 'react';
type ElementType = React.ElementType;

import { ArrowLeft, ArrowRight } from 'lucide-react';
type ComponentPropsWithoutRef<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T>;

import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const _CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = useContext(_CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

interface CarouselComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CarouselProps {
  ref?: React.Ref<HTMLDivElement>;
}

const _Carousel = ({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  ref,
  ...props
}: CarouselComponentProps) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api?.off('select', onSelect);
    };
  }, [api, onSelect]);

  return (
    <_CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation ||
          ((opts?.axis === 'y' ? 'vertical' : 'horizontal') as
            | 'horizontal'
            | 'vertical'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        ref={ref}
        onKeyDownCapture={handleKeyDown}
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </_CarouselContext.Provider>
  );
};
_Carousel.displayName = 'Carousel';

interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

const _CarouselContent = ({
  className,
  ref,
  ...props
}: CarouselContentProps) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className
        )}
        {...props}
      />
    </div>
  );
};
_CarouselContent.displayName = 'CarouselContent';

interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

const _CarouselItem = ({ className, ref, ...props }: CarouselItemProps) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className
      )}
      {...props}
    />
  );
};
_CarouselItem.displayName = 'CarouselItem';

interface CarouselPreviousProps extends React.ComponentProps<typeof Button> {
  ref?: React.Ref<HTMLButtonElement>;
}

const _CarouselPrevious = ({
  className,
  variant = 'outline',
  size = 'icon',
  ref,
  ...props
}: CarouselPreviousProps) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute  h-8 w-8 rounded-full',
        orientation === 'horizontal'
          ? '-left-12 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
};
_CarouselPrevious.displayName = 'CarouselPrevious';

interface CarouselNextProps extends React.ComponentProps<typeof Button> {
  ref?: React.Ref<HTMLButtonElement>;
}

const _CarouselNext = ({
  className,
  variant = 'outline',
  size = 'icon',
  ref,
  ...props
}: CarouselNextProps) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute h-8 w-8 rounded-full',
        orientation === 'horizontal'
          ? '-right-12 top-1/2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
};
_CarouselNext.displayName = 'CarouselNext';

export {
  type CarouselApi,
  _Carousel as Carousel,
  _CarouselContent as CarouselContent,
  _CarouselItem as CarouselItem,
  _CarouselPrevious as CarouselPrevious,
  _CarouselNext as CarouselNext,
};

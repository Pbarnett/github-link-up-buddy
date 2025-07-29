import * as React from 'react';
import { useEffect, useState } from 'react';
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql =
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.matchMedia(
        `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
      );
    const onChange = () => {
      setIsMobile(
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.innerWidth <
          MOBILE_BREAKPOINT
      );
    };
    mql.addEventListener('change', onChange);
    setIsMobile(
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.innerWidth <
        MOBILE_BREAKPOINT
    );
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}

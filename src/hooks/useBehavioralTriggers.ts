import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
interface BehavioralState {
  mouseHoverTime: number;
  scrollDepth: number;
  timeOnPage: number;
  showHesitationHelp: boolean;
  showPriceProof: boolean;
  userEngaged: boolean;
}

export const useBehavioralTriggers = () => {
  const [state, setState] = useState<BehavioralState>({
    mouseHoverTime: 0,
    scrollDepth: 0,
    timeOnPage: 0,
    showHesitationHelp: false,
    showPriceProof: false,
    userEngaged: false,
  });

  const startTime = useRef(Date.now());
  const hoverStartTime = useRef<number | null>(null);
  const scrollTimer = useRef<number>();
  const cardsRef = useRef<NodeListOf<Element> | null>(null);
  const timeIntervalRef = useRef<number>();

  useEffect(() => {
    // Guard against SSR
    if (
      typeof (
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
      ) === 'undefined' ||
      typeof document === 'undefined'
    ) {
      return;
    }

    // Track time on page
    timeIntervalRef.current =
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.setInterval(
        () => {
          try {
            const timeOnPage = Date.now() - startTime.current;
            setState(prev => ({
              ...prev,
              timeOnPage,
              userEngaged: timeOnPage > 5000, // 5 seconds = engaged
            }));
          } catch (error) {
            console.warn('Error updating time on page:', error);
          }
        },
        1000
      );

    // Track scroll depth with safe DOM access
    const handleScroll = () => {
      try {
        if (
          !(
            /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
          ) ||
          !document.documentElement
        )
          return;

        const scrollTop =
          /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.pageYOffset ||
          0;
        const docHeight = Math.max(
          document.documentElement.scrollHeight -
            /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.innerHeight,
          1 // Prevent division by zero
        );
        const scrollDepth = Math.min((scrollTop / docHeight) * 100, 100);

        setState(prev => ({
          ...prev,
          scrollDepth,
          showPriceProof: scrollDepth > 30, // Show proof after 30% scroll
        }));

        // Debounce scroll events with proper cleanup
        if (scrollTimer.current) {
          clearTimeout(scrollTimer.current);
        }
        scrollTimer.current =
          /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.setTimeout(
            () => {
              try {
                // User stopped scrolling, check if they need help
                if (scrollDepth < 50 && Date.now() - startTime.current > 8000) {
                  setState(prev => ({ ...prev, showHesitationHelp: true }));
                }
              } catch (error) {
                console.warn('Error in scroll timeout handler:', error);
              }
            },
            2000
          );
      } catch (error) {
        console.warn('Error handling scroll:', error);
      }
    };

    // Track mouse hover on cards with proper event handling
    const _handleMouseEnter = () => {
      try {
        hoverStartTime.current = Date.now();
      } catch (error) {
        console.warn('Error handling mouse enter:', error);
      }
    };

    const _handleMouseLeave = () => {
      try {
        if (hoverStartTime.current) {
          const hoverTime = Date.now() - hoverStartTime.current;
          setState(prev => ({
            ...prev,
            mouseHoverTime: Math.max(prev.mouseHoverTime, hoverTime),
          }));
          hoverStartTime.current = null;
        }
      } catch (error) {
        console.warn('Error handling mouse leave:', error);
      }
    };

    // Attach listeners with error handling
    try {
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.addEventListener(
        'scroll',
        handleScroll,
        { passive: true }
      );
    } catch (error) {
      console.warn('Error adding scroll listener:', error);
    }

    // Attach to card elements with proper reference management
    try {
      cardsRef.current = document.querySelectorAll('[data-behavior="card"]');
      cardsRef.current.forEach(card => {
        try {
          card.addEventListener('mouseenter', handleMouseEnter);
          card.addEventListener('mouseleave', handleMouseLeave);
        } catch (error) {
          console.warn('Error adding card listeners:', error);
        }
      });
    } catch (error) {
      console.warn('Error querying card elements:', error);
    }

    // Cleanup function with comprehensive error handling
    return () => {
      try {
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current);
        }
        if (scrollTimer.current) {
          clearTimeout(scrollTimer.current);
        }

        // Remove /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window listeners
        if (
          typeof (
            /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
          ) !== 'undefined'
        ) {
          /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.removeEventListener(
            'scroll',
            handleScroll
          );
        }

        // Remove card listeners using stored reference
        if (cardsRef.current) {
          cardsRef.current.forEach(card => {
            try {
              card.removeEventListener('mouseenter', handleMouseEnter);
              card.removeEventListener('mouseleave', handleMouseLeave);
            } catch (error) {
              console.warn('Error removing card listener:', error);
            }
          });
        }
      } catch (error) {
        console.warn('Error in cleanup function:', error);
      }
    };
  }, []);

  const dismissHesitationHelp = () => {
    setState(prev => ({ ...prev, showHesitationHelp: false }));
  };

  return {
    ...state,
    dismissHesitationHelp,
  };
};

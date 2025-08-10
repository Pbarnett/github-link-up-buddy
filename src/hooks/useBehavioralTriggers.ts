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

  const startTime = useRef<number>(Date.now());
  const hoverStartTime = useRef<number | null>(null);
  const scrollTimer = useRef<number | null>(null);

  useEffect(() => {
    // Track time on page
    const timeInterval = setInterval(() => {
      const timeOnPage = Date.now() - startTime.current;
      setState(prev => ({
        ...prev,
        timeOnPage,
        userEngaged: timeOnPage > 5000, // 5 seconds = engaged
      }));
    }, 1000);

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = (scrollTop / docHeight) * 100;
      
      setState(prev => ({
        ...prev,
        scrollDepth,
        showPriceProof: scrollDepth > 30, // Show proof after 30% scroll
      }));

      // Debounce scroll events
      if (scrollTimer.current !== null) {
        clearTimeout(scrollTimer.current);
      }
      scrollTimer.current = window.setTimeout(() => {
        // User stopped scrolling, check if they need help
        if (scrollDepth < 50 && Date.now() - startTime.current > 8000) {
          setState(prev => ({ ...prev, showHesitationHelp: true }));
        }
      }, 2000);
    };

    // Track mouse hover on cards
    const handleMouseEnter = () => {
      hoverStartTime.current = Date.now();
    };

    const handleMouseLeave = () => {
      if (hoverStartTime.current) {
        const hoverTime = Date.now() - hoverStartTime.current;
        setState(prev => ({
          ...prev,
          mouseHoverTime: Math.max(prev.mouseHoverTime, hoverTime),
        }));
        hoverStartTime.current = null;
      }
    };

    // Attach listeners
    window.addEventListener('scroll', handleScroll);
    
    // Attach to card elements
    const cards = document.querySelectorAll('[data-behavior="card"]');
    cards.forEach(card => {
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      clearInterval(timeInterval);
      if (scrollTimer.current !== null) {
        clearTimeout(scrollTimer.current);
      }
      window.removeEventListener('scroll', handleScroll);
      cards.forEach(card => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      });
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

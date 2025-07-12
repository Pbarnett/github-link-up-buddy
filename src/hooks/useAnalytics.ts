import { useEffect, useRef } from 'react';

// Analytics event types for the trip/new page optimization
export interface CTAClickEvent {
  type: 'auto' | 'manual';
  cardPosition: 'left' | 'right';
  timestamp: number;
}

export interface CardViewEvent {
  cardType: 'auto' | 'manual';
  viewTime: number;
  percentVisible: number;
}

export interface FormDropOffEvent {
  step: string;
  fieldName: string;
  autoBookingEnabled: boolean;
}

class AnalyticsTracker {
  private observers: Map<string, IntersectionObserver> = new Map();
  private viewTimes: Map<string, number> = new Map();

  // Track CTA clicks
  trackCTAClick(eventData: CTAClickEvent) {
    // In a real app, this would send to your analytics endpoint
    console.log('[Analytics] CTA Click:', eventData);
    
    // Example: Send to existing analytics endpoint
    // fetch('/api/analytics/events', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     event: 'cta_click',
    //     data: eventData
    //   })
    // });
  }

  // Track card visibility time
  trackCardView(element: HTMLElement, cardType: 'auto' | 'manual') {
    const observerId = `card-${cardType}`;
    
    if (this.observers.has(observerId)) {
      this.observers.get(observerId)?.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Card is 50%+ visible
            const startTime = Date.now();
            this.viewTimes.set(observerId, startTime);
          } else if (this.viewTimes.has(observerId)) {
            // Card left viewport, calculate view time
            const startTime = this.viewTimes.get(observerId)!;
            const viewTime = Date.now() - startTime;
            
            if (viewTime > 500) { // Only track meaningful view times
              const eventData: CardViewEvent = {
                cardType,
                viewTime,
                percentVisible: entry.intersectionRatio
              };
              
              console.log('[Analytics] Card View:', eventData);
              this.viewTimes.delete(observerId);
            }
          }
        });
      },
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(element);
    this.observers.set(observerId, observer);
  }

  // Track form completion drop-off
  trackFormDropOff(eventData: FormDropOffEvent) {
    console.log('[Analytics] Form Drop-off:', eventData);
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.viewTimes.clear();
  }
}

// Singleton instance
const analyticsTracker = new AnalyticsTracker();

// React hook for analytics
export const useAnalytics = () => {
  const cardViewRef = useRef<(element: HTMLElement, cardType: 'auto' | 'manual') => void>();

  useEffect(() => {
    cardViewRef.current = analyticsTracker.trackCardView.bind(analyticsTracker);

    return () => {
      analyticsTracker.cleanup();
    };
  }, []);

  return {
    trackCTAClick: analyticsTracker.trackCTAClick.bind(analyticsTracker),
    trackCardView: cardViewRef.current || (() => {}),
    trackFormDropOff: analyticsTracker.trackFormDropOff.bind(analyticsTracker),
    // Generic track method for personalization events
    track: (eventName: string, eventData?: any) => {
      console.log(`[Analytics] ${eventName}:`, eventData);
      // In production, this would send to your analytics service
    },
  };
};

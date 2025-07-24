import * as React from 'react';
import { useState, useEffect } from 'react';
import { trackGreetingDisplay } from '@/scripts/analytics/personalization-tracking';

const PersonalizedGreeting = ({ userId, isPersonalizationEnabled = true }) => {
  const [greeting, setGreeting] = useState('');
  const [personalData, setPersonalData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPersonalizationEnabled) {
      setGreeting('Welcome!');
      setLoading(false);
      return;
    }

    const fetchPersonalizedGreeting = async () => {
      try {
        const response = await fetch(`/api/personalization/greeting?userId=${userId}`);
        const data = await response.json();
        
        setPersonalData(data);
        
        const timeBasedGreeting = getTimeBasedGreeting();
        const personalizedGreeting = data.name 
          ? `${timeBasedGreeting}, ${data.name}!`
          : timeBasedGreeting;
        
        setGreeting(personalizedGreeting);
        
        // Track greeting display
        trackGreetingDisplay(
          data.name ? 'personalized' : 'generic',
          data
        );
      } catch (error) {
        console.error('Failed to fetch personalized greeting:', error);
        setGreeting('Welcome!');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalizedGreeting();
  }, [userId, isPersonalizationEnabled]);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return React.createElement('div', { className: 'greeting-placeholder' }, 'Loading...');
  }

  return React.createElement('div', { className: 'personalized-greeting' },
    React.createElement('h2', null, greeting),
    personalData.lastVisit && React.createElement('p', { className: 'last-visit' },
      `Last visit: ${new Date(personalData.lastVisit).toLocaleDateString()}`
    )
  );
};

export default PersonalizedGreeting;

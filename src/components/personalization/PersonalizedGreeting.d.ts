import React from 'react';

interface PersonalizedGreetingProps {
  userId: string;
  isPersonalizationEnabled?: boolean;
}

declare const PersonalizedGreeting: React.FC<PersonalizedGreetingProps>;

export default PersonalizedGreeting;

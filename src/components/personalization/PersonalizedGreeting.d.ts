import * as React from 'react';
interface PersonalizedGreetingProps {
  userId: string;
  isPersonalizationEnabled?: boolean;
}

declare const PersonalizedGreeting: FC<PersonalizedGreetingProps>;

export default PersonalizedGreeting;

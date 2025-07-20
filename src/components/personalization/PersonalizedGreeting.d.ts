

import * as React from 'react';
type FC<T = {}> = React.FC<T>;

interface PersonalizedGreetingProps {
  userId: string;
  isPersonalizationEnabled?: boolean;
}

declare const PersonalizedGreeting: FC<PersonalizedGreetingProps>;

export default PersonalizedGreeting;


import React from 'react';

const SkipLink: React.FC = () => {
  return (
    <a
      href="#main"
      className="skip-link absolute left-4 top-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium -translate-y-16 focus:translate-y-0 transition-transform duration-200 ring-focus"
      onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth' })}
    >
      Skip to content
    </a>
  );
};

export default SkipLink;

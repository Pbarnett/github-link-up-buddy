import React, { Fragment } from 'react';

type FC<T = {}> = React.FC<T>;

const steps = [
  {
    icon: '🛠️',
    title: 'Set criteria',
    detail: 'dates • route • max price',
    highlight: '30 seconds to set up',
  },
  {
    icon: '🔍',
    title: 'We monitor',
    detail: '24/7 fare checks',
    highlight: 'Every 15 minutes',
  },
  {
    icon: '✅',
    title: 'Auto-book',
    detail: 'ticket issued instantly',
    highlight: 'While you sleep',
  },
];

interface ThreeStepExplainerProps {
  className?: string;
}

export const ThreeStepExplainer: FC<ThreeStepExplainerProps> = ({
  className = '',
}) => {
  return (
    <div className={`steps-container ${className}`}>
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => (
          <Fragment key={index}>
            <div className="step-item">
              <span className="step-icon">{step.icon}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-detail">{step.detail}</p>
            </div>
            {index < steps.length - 1 && <div className="step-arrow">→</div>}
          </Fragment>
        ))}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {steps.map((step, index) => (
          <div key={index} className="step-mobile">
            <div className="step-number">{index + 1}</div>
            <div>
              <h3 className="step-title flex items-center gap-2">
                <span>{step.icon}</span>
                {step.title}
              </h3>
              <p className="step-detail">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreeStepExplainer;

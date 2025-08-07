

const steps = [
  {
    icon: Calendar,
    title: 'Tell us where & when',
    description: 'Set your travel dates and destination',
    detail: 'Flexible dates get better deals',
  },
  {
    icon: Search,
    title: 'We scan fares 24/7',
    description: 'Our AI monitors 300+ airlines',
    detail: 'Checks every 15 minutes automatically',
  },
  {
    icon: CheckCircle,
    title: 'Auto-book at your max price',
    description: 'We book when criteria are met',
    detail: 'Cancel anytime with one click',
  },
];

interface HowItWorksSectionProps {
  variant?: 'marketing' | 'dashboard';
}

export const HowItWorksSection = ({
  variant = 'marketing',
}: HowItWorksSectionProps) => {
  const { user } = useCurrentUser();

  if (variant === 'dashboard' && user) {
    // Simplified version for logged-in users
    return (
      <div className="bg-blue-50 rounded-lg p-4 my-6">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Start</h3>
        <div className="flex items-center justify-between text-xs text-blue-700">
          <span>Set criteria</span>
          <span>→</span>
          <span>We monitor</span>
          <span>→</span>
          <span>Auto-book</span>
        </div>
      </div>
    );
  }

  // Full marketing version for anonymous users
  return (
    <div className="border-t border-gray-100 bg-gray-50/50 py-12 mt-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          How Parker Flight Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm mb-1">{step.description}</p>
                <p className="text-xs text-gray-500">{step.detail}</p>
              </div>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500 mb-4">
            Trusted by travelers worldwide
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-xs font-medium text-gray-400">Amadeus</div>
            <div className="text-xs font-medium text-gray-400">Stripe</div>
            <div className="text-xs font-medium text-gray-400">TrustPilot</div>
          </div>
        </div>
      </div>
    </div>
  );
};

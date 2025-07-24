import * as React from 'react';
import { Button } from '@/components/ui/button';
import { InteractiveButton } from '@/components/ui/interactive-button';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import {
  ModernScrollArea,
  ScrollItem,
} from '@/components/ui/modern-scroll-area';
import RadixThemeDemo from '@/components/demo/RadixThemeDemo';

const Index = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (showDemo) {
    return <RadixThemeDemo />;
  }

  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'AI-powered flight recommendations',
    },
    {
      icon: Plane,
      title: 'Auto Booking',
      description: 'Hands-free flight booking',
    },
    {
      icon: Users,
      title: 'Multi-Traveler',
      description: 'Manage group bookings easily',
    },
    {
      icon: Star,
      title: 'Premium Support',
      description: '24/7 customer assistance',
    },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', text: 'Saved me hours of searching!', rating: 5 },
    {
      name: 'Mike Chen',
      text: 'The auto-booking feature is incredible.',
      rating: 5,
    },
    { name: 'Emily Davis', text: "Best flight platform I've used.", rating: 5 },
    { name: 'David Smith', text: 'Simple, fast, and reliable.', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section with Modern Features */}
      <div className="hero-redesigned">
        <div className="max-width-4xl mx-auto px-4">
          <h1 className="hero-title-redesigned animate-fade-in">
            Welcome to Parker Flight
          </h1>
          <p className="hero-lead-redesigned animate-slide-in">
            Smart flight search and booking platform with AI-powered
            recommendations
          </p>
          <p className="hero-sub-redesigned">
            Join thousands of travelers who save time and money with automated
            flight booking
          </p>

          {/* Interactive Search Demo */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <EnhancedInput
                variant="enhanced"
                placeholder="Try searching for destinations..."
                value={searchTerm}
                onChange={e =>
                  setSearchTerm((e.target as HTMLInputElement).value)
                }
                className="pl-10"
                interactive
              />
            </div>
          </div>

          {/* Modern Interactive Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/login">
              <InteractiveButton size="lg" className="btn-redesigned">
                Sign In
              </InteractiveButton>
            </Link>
            <Link to="/dashboard">
              <InteractiveButton
                variant="secondary"
                size="lg"
                className="btn-redesigned"
              >
                Dashboard
              </InteractiveButton>
            </Link>
          </div>

          {/* Demo Button */}
          <div className="mt-6">
            <InteractiveButton
              onClick={() => setShowDemo(true)}
              variant="ghost"
              size="sm"
              interactive={false}
            >
              🎨 View Theme Demo
            </InteractiveButton>
          </div>
        </div>
      </div>

      {/* Features Section with Scroll Snap */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose Parker Flight?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="interactive-card p-6 bg-white rounded-xl shadow-soft border border-gray-200"
                >
                  <Icon className="h-8 w-8 text-brand-blue mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 selectable-text">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials with Modern Scroll */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            What Our Users Say
          </h2>

          <ModernScrollArea
            variant="snap-x"
            snapType="proximity"
            hideScrollbar
            scrollPadding="md"
            className="pb-4"
          >
            <div className="flex gap-6 px-4">
              {testimonials.map((testimonial, index) => (
                <ScrollItem
                  key={index}
                  snapAlign="start"
                  className="w-80 flex-shrink-0"
                >
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 h-full">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 selectable-text">
                      "{testimonial.text}"
                    </p>
                    <p className="font-semibold text-gray-900">
                      — {testimonial.name}
                    </p>
                  </div>
                </ScrollItem>
              ))}
            </div>
          </ModernScrollArea>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-brand-blue text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Travel?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start saving time and money on flights today
          </p>
          <Link to="/auto-booking/new">
            <InteractiveButton
              size="lg"
              className="bg-white text-brand-blue hover:bg-gray-50"
            >
              Get Started Now
            </InteractiveButton>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

const Breadcrumbs = () => {
  const location = useLocation();
  
  // Define breadcrumb mappings for different routes
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    
    if (path === '/dashboard') {
      return [
        { label: 'Dashboard', isActive: true }
      ];
    }
    
    if (path === '/trip/new') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Search Flights', isActive: true }
      ];
    }
    
    if (path === '/trip/offers') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Search Flights', href: '/trip/new' },
        { label: 'Flight Results', isActive: true }
      ];
    }
    
    if (path === '/trip/confirm') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Search Flights', href: '/trip/new' },
        { label: 'Flight Results', href: '/trip/offers' },
        { label: 'Confirm Booking', isActive: true }
      ];
    }
    
    if (path.startsWith('/trips/') && path.endsWith('/v2')) {
      const tripId = path.split('/')[2];
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Search Flights', href: '/trip/new' },
        { label: 'Flight Results V2', isActive: true }
      ];
    }
    
    if (path === '/profile') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Profile', isActive: true }
      ];
    }
    
    if (path === '/wallet') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Wallet', isActive: true }
      ];
    }
    
    // Default fallback
    return [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Current Page', isActive: true }
    ];
  };

  const breadcrumbs = getBreadcrumbs();
  
  // Don't show breadcrumbs on login page, home page, or if only one item
  if (location.pathname === '/login' || 
      location.pathname === '/' || 
      breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav 
      className="bg-background/50 border-b border-border/30 px-4 py-3"
      aria-label="Breadcrumb"
    >
      <div className="container max-w-screen-2xl">
        <ol className="flex items-center space-x-2 text-sm">
          {/* Home icon for first item */}
          <li className="flex items-center">
            <Link
              to="/dashboard"
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </li>
          
          {/* Breadcrumb items */}
          {breadcrumbs.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
              {item.isActive ? (
                <span 
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href!}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    "hover:underline underline-offset-4"
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;

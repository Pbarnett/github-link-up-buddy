import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  PlaneTakeoff,
  Home,
  Calendar,
  Settings,
  User,
  CreditCard,
  LogOut,
  Menu,
  ChevronDown,
  Loader2,
  Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/mode-toggle';
import { prefetchProfile, prefetchWallet, prefetchOffersV2, prefetchDashboard, prefetchAutoBookingNew, prefetchTripNew } from '@/lib/prefetchRoutes';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface TopNavigationProps {
  hideFindFlights?: boolean;
}

const TopNavigation = ({ hideFindFlights = false }: TopNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleFindFlights = async () => {
    setIsNavigating(true);
    navigate('/search');
    // Reset after a short delay to handle the loading state
    setTimeout(() => setIsNavigating(false), 1000);
  };

  // Primary navigation items (left side) - Simplified for cleaner dashboard
  const primaryNavItems = [
    {
      name: 'My Bookings',
      href: '/auto-booking',
      icon: Home,
    },
    {
      name: 'Book For Me',
      href: '/auto-booking/new',
      icon: Calendar,
    },
    {
      name: 'Currently Available Flights',
      href: '/search',
      icon: Search,
    }
  ];

  const isActive = (path: string) => {
    if (path === '/auto-booking') {
      return location.pathname === '/auto-booking' || 
             location.pathname === '/dashboard';
    }
    if (path === '/auto-booking/new') {
      return location.pathname === '/auto-booking/new';
    }
    if (path === '/search') {
      return location.pathname === '/search' || 
             location.pathname === '/trip/new';
    }
    return location.pathname === path;
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  // Don't show navigation on login page or home page
  if (location.pathname === '/login' || location.pathname === '/') {
    return null;
  }

return (
    <nav role="navigation" aria-label="Primary" aria-busy={isLoading} className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-x safe-area-top">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo */}
        <Link 
          to="/auto-booking" 
          className="flex items-center space-x-2 mr-8 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PlaneTakeoff className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="hidden font-bold sm:inline-block text-lg">
            Parker Flight
          </span>
        </Link>

        {/* Primary Navigation (left side) - Desktop */}
        <div className="hidden md:flex items-center space-x-6 flex-1">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onMouseEnter={() => {
                  if (item.href === '/profile') prefetchProfile();
                  if (item.href === '/wallet') prefetchWallet();
                  if (item.href.startsWith('/trips/')) prefetchOffersV2();
                  if (item.href === '/auto-booking') prefetchDashboard();
                  if (item.href === '/auto-booking/new') prefetchAutoBookingNew();
                  if (item.href === '/search') prefetchTripNew();
                }}
                onFocus={() => {
                  if (item.href === '/profile') prefetchProfile();
                  if (item.href === '/wallet') prefetchWallet();
                  if (item.href.startsWith('/trips/')) prefetchOffersV2();
                  if (item.href === '/auto-booking') prefetchDashboard();
                  if (item.href === '/auto-booking/new') prefetchAutoBookingNew();
                  if (item.href === '/search') prefetchTripNew();
                }}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  "nav-link px-3 py-2 inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 relative",
                  active
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-primary"
                )}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Find Flights CTA - Desktop */}
          {!hideFindFlights && (
            <Button
              onClick={handleFindFlights}
              className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2"
              disabled={isNavigating}
              aria-busy={isNavigating}
            >
              {isNavigating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Find Flights'
              )}
            </Button>
          )}

          {/* Mobile menu button */}
          <Popover open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mr-4" align="end">
              <div className="space-y-4">
                {/* Mobile navigation items */}
                <div className="space-y-2">
                  {primaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        aria-current={active ? 'page' : undefined}
                        onMouseEnter={() => {
                          if (item.href === '/profile') prefetchProfile();
                          if (item.href === '/wallet') prefetchWallet();
                          if (item.href.startsWith('/trips/')) prefetchOffersV2();
                          if (item.href === '/auto-booking') prefetchDashboard();
                          if (item.href === '/auto-booking/new') prefetchAutoBookingNew();
                          if (item.href === '/search') prefetchTripNew();
                        }}
                        onFocus={() => {
                          if (item.href === '/profile') prefetchProfile();
                          if (item.href === '/wallet') prefetchWallet();
                          if (item.href.startsWith('/trips/')) prefetchOffersV2();
                          if (item.href === '/auto-booking') prefetchDashboard();
                          if (item.href === '/auto-booking/new') prefetchAutoBookingNew();
                          if (item.href === '/search') prefetchTripNew();
                        }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full",
                          active
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
                
                {/* Mobile Find Flights CTA */}
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleFindFlights();
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                  disabled={isNavigating}
                >
                  {isNavigating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Find Flights'
                  )}
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Theme toggle */}
          <div className="hidden md:block">
            {/* Mode toggle visible on desktop; on mobile user can access via user menu */}
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <ModeToggle />
          </div>

          {/* User dropdown */}
          {user && !isLoading ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="Open user menu">
                  <Avatar className="h-9 w-9">
                    <AvatarImage 
                      src={user.user_metadata?.avatar_url} 
                      alt={user.user_metadata?.full_name || user.email || 'User'} 
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-3 w-3 absolute -bottom-1 -right-1 opacity-50" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                  Theme
                </DropdownMenuLabel>
                <div className="px-2 pb-2">
                  {/* eslint-disable-next-line react/jsx-no-undef */}
                  <ModeToggle />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                  Profile & Settings
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/profile" 
                    className="flex items-center"
                    onMouseEnter={() => prefetchProfile()}
                    onFocus={() => prefetchProfile()}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/wallet" 
                    className="flex items-center"
                    onMouseEnter={() => prefetchWallet()}
                    onFocus={() => prefetchWallet()}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Payment Methods</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;

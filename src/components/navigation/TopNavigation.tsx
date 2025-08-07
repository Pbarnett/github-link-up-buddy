
import {
  PlaneTakeoff,
  Home,
  Calendar,
  User,
  CreditCard,
  LogOut,
  Menu,
  ChevronDown,
  Loader2,
  Search,

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,

import {
  Popover,
  PopoverContent,
  PopoverTrigger,

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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
      name: 'Set Auto-Booking',
      href: '/auto-booking/new',
      icon: Calendar,
    },
    {
      name: 'Search Available Flights',
      href: '/search',
      icon: Search,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/auto-booking') {
      return (
        location.pathname === '/auto-booking' ||
        location.pathname === '/dashboard'
      );
    }
    if (path === '/auto-booking/new') {
      return location.pathname === '/auto-booking/new';
    }
    if (path === '/search') {
      return (
        location.pathname === '/search' || location.pathname === '/trip/new'
      );
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
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo */}
        <Link
          to="/auto-booking"
          className="flex items-center space-x-2 mr-8 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PlaneTakeoff className="h-4 w-4" />
          </div>
          <span className="hidden font-bold sm:inline-block text-lg">
            Parker Flight
          </span>
        </Link>

        {/* Primary Navigation (left side) - Desktop */}
        <div className="hidden md:flex items-center space-x-6 flex-1">
          {primaryNavItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'nav-link px-3 py-2 inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 relative',
                  active
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-primary'
                )}
              >
                <Icon className="w-4 h-4" />
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
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mr-4" align="end">
              <div className="space-y-4">
                {/* Mobile navigation items */}
                <div className="space-y-2">
                  {primaryNavItems.map(item => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full',
                          active
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        )}
                      >
                        <Icon className="h-5 w-5" />
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

          {/* User dropdown */}
          {user && !isLoading ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={
                        user.user_metadata?.full_name || user.email || 'User'
                      }
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-3 w-3 absolute -bottom-1 -right-1 opacity-50" />
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
                  Profile & Settings
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wallet" className="flex items-center">
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

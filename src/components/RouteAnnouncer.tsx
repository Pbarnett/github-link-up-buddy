import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Computes a reasonable title based on the URL path.
function computeTitle(pathname: string): string {
  // Map common paths to human titles; extend as needed.
  if (pathname === "/" || pathname === "/dashboard" || pathname === "/auto-booking") return "Dashboard";
  if (pathname === "/auto-booking/new") return "Set Auto-Booking";
  if (pathname === "/search" || pathname === "/trip/new") return "Search Flights";
  if (pathname.startsWith("/trip/offers") || pathname.includes("/trips/")) return "Flight Results";
  if (pathname === "/trip/confirm") return "Confirm Booking";
  if (pathname === "/profile") return "Profile";
  if (pathname === "/wallet") return "Wallet";
  return "Parker Flight";
}

export default function RouteAnnouncer() {
  const location = useLocation();

  useEffect(() => {
    const title = computeTitle(location.pathname);
    // Update document title
    document.title = `${title} — Parker Flight`;

    // Announce to SR via live region
    const region = document.getElementById("sr-route-announcer");
    if (region) {
      region.textContent = `${title} — page loaded`;
    }

    // Move focus to main landmark for keyboard users
    const main = document.getElementById("main");
    if (main) {
      // Ensure focusable
      if (!main.hasAttribute("tabindex")) {
        main.setAttribute("tabindex", "-1");
      }
      (main as HTMLElement).focus({ preventScroll: true });
    }
  }, [location.pathname]);

  return null;
}


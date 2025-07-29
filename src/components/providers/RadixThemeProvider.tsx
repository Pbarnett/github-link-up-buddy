/**
 * Radix Theme Provider Component
 *
 * This component provides the Radix Themes integration for the GitHub Link-Up Buddy project.
 * It works seamlessly with next-themes for dark mode support and provides a consistent
 * design system across all components.
 *
 * Features:
 * - Integrates with next-themes for automatic light/dark mode switching
 * - Provides consistent theme tokens and design system
 * - Supports responsive design with proper breakpoints
 * - Maintains accessibility standards
 * - Customizable theme configuration
 */

import * as React from 'react';
import { FC, ReactNode } from 'react';
type _Component<P = {}, S = {}> = React.Component<P, S>;

import { Theme } from '@radix-ui/themes';
import { useTheme } from 'next-themes';
import { themeConfig } from '@/lib/theme';
interface RadixThemeProviderProps {
  children: ReactNode;
  /**
   * Override theme configuration
   */
  themeOverride?: Partial<typeof themeConfig>;
  /**
   * Force a specific appearance (useful for testing)
   */
  forceAppearance?: 'light' | 'dark';
}

/**
 * RadixThemeProvider component that wraps the application with Radix Themes
 * and integrates with next-themes for dark mode support.
 */
export const RadixThemeProvider: FC<RadixThemeProviderProps> = ({
  children,
  themeOverride,
  forceAppearance,
}) => {
  const { theme: nextTheme, systemTheme } = useTheme();

  // Determine the current theme
  const currentTheme = nextTheme === 'system' ? systemTheme : nextTheme;
  const appearance =
    forceAppearance || (currentTheme === 'dark' ? 'dark' : 'light');

  // Merge theme configuration with any overrides
  const finalThemeConfig = {
    ...themeConfig,
    ...themeOverride,
    // Set appearance based on next-themes
    appearance,
  };

  return (
    <Theme
      {...finalThemeConfig}
      // Ensure the theme adapts to the current appearance
      appearance={appearance}
      // Add className for CSS targeting
      className="radix-theme-root"
    >
      {children}
    </Theme>
  );
};

/**
 * Hook to access the current theme state
 */
export const useRadixTheme = () => {
  const { theme, setTheme, systemTheme } = useTheme();

  return {
    theme,
    setTheme,
    systemTheme,
    isDark: theme === 'dark' || (theme === 'system' && systemTheme === 'dark'),
    isLight:
      theme === 'light' || (theme === 'system' && systemTheme === 'light'),
    isSystem: theme === 'system',
  };
};

/**
 * Theme toggle component for easy theme switching
 */
export const ThemeToggle: FC<{
  className?: string;
}> = ({ className }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        inline-flex items-center justify-center
        rounded-md p-2 transition-colors
        hover:bg-gray-100 dark:hover:bg-gray-800
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${className}
      `}
      aria-label="Toggle theme"
    >
      {theme === 'light' && (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
      {theme === 'dark' && (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
      {theme === 'system' && (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      )}
    </button>
  );
};

export default RadixThemeProvider;

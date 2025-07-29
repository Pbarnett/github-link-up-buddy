import * as React from 'react';
/**
 * Theme configuration for Radix Themes integration
 * This file configures the theme settings for GitHub Link-Up Buddy
 *
 * Based on the extensive Radix Themes documentation, this configuration
 * provides a cohesive design system with proper color scales, typography,
 * and spacing that integrates seamlessly with the existing Tailwind CSS setup.
 */

import type { ThemeProps } from '@radix-ui/themes';
// Define the base theme configuration
export const themeConfig: ThemeProps = {
  // Primary accent color - using blue to match the brand
  accentColor: 'blue',

  // Gray color scale - using slate for better contrast
  grayColor: 'slate',

  // Panel background - using translucent for modern overlay effect
  panelBackground: 'translucent',

  // Border radius - using medium for balanced rounded corners
  radius: 'medium',

  // Scaling factor - using 100% for default sizing
  scaling: '100%',

  // Appearance will be controlled by next-themes
  // so we don't set it here to avoid conflicts
};

// Theme token customizations for brand consistency
export const customTokens = {
  // Brand colors aligned with existing CSS variables
  colors: {
    // Primary blue brand color
    brandBlue: '#3B82F6',
    brandBlueLight: '#EFF6FF',

    // Success green
    brandGreen: '#10B981',
    brandGreenLight: '#ECFDF5',

    // Warning orange
    brandOrange: '#F59E0B',
    brandOrangeLight: '#FEF3C7',

    // Status colors
    statusSuccess: '#10B981',
    statusWarning: '#F59E0B',
    statusError: '#EF4444',
    statusInfo: '#3B82F6',
    statusProcessing: '#8B5CF6',
  },

  // Typography settings
  typography: {
    fontFamily: {
      default:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    },
  },

  // Spacing and layout
  spacing: {
    // Custom spacing scale that aligns with Tailwind
    scale: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '24px',
      6: '32px',
      7: '40px',
      8: '48px',
      9: '64px',
    },
  },

  // Border radius settings
  radius: {
    scale: {
      none: '0',
      small: '0.25rem',
      medium: '0.5rem',
      large: '0.75rem',
      full: '9999px',
    },
  },

  // Shadow settings
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
};

// Component-specific theme overrides
export const componentThemes = {
  // Button variants
  button: {
    primary: {
      backgroundColor: 'var(--blue-9)',
      color: 'var(--blue-9-contrast)',
      borderColor: 'var(--blue-9)',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--blue-9)',
      borderColor: 'var(--blue-7)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--gray-12)',
      borderColor: 'transparent',
    },
  },

  // Card variants
  card: {
    default: {
      backgroundColor: 'var(--color-panel-solid)',
      borderColor: 'var(--gray-6)',
      borderRadius: 'var(--radius-3)',
    },
    elevated: {
      backgroundColor: 'var(--color-panel-solid)',
      borderColor: 'var(--gray-6)',
      borderRadius: 'var(--radius-3)',
      boxShadow: 'var(--shadow-2)',
    },
  },

  // Input variants
  input: {
    default: {
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--gray-7)',
      borderRadius: 'var(--radius-2)',
    },
    focused: {
      borderColor: 'var(--blue-8)',
      boxShadow: '0 0 0 1px var(--blue-8)',
    },
  },
};

// Breakpoints that align with Tailwind CSS
export const breakpoints = {
  initial: '0px',
  xs: '520px',
  sm: '768px',
  md: '1024px',
  lg: '1280px',
  xl: '1640px',
};

// Animation and transition settings
export const animations = {
  // Transition durations
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },

  // Easing functions
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Export the complete theme configuration
export const theme = {
  config: themeConfig,
  tokens: customTokens,
  components: componentThemes,
  breakpoints,
  animations,
};

export default theme;

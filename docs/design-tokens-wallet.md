# Wallet UI Design Tokens

## 🎨 **Design System Alignment**

All wallet components follow the established design system with consistent spacing, colors, and typography.

## 🎯 **Color Tokens**

### **Brand Colors**
```css
/* Payment Method Card Brands */
--visa-blue: #1434CB;
--mastercard-red: #EB001B;
--amex-green: #007B3F;
--discover-orange: #FF6F00;

/* Status Colors */
--success-green: #16A34A;
--warning-amber: #F59E0B;
--error-red: #DC2626;
--info-blue: #2563EB;
```

### **UI State Colors**
```css
/* Light Mode */
--wallet-bg: #FFFFFF;
--wallet-border: #E5E7EB;
--wallet-text: #111827;
--wallet-text-muted: #6B7280;
--wallet-hover: #F3F4F6;

/* Dark Mode */
--wallet-bg-dark: #1F2937;
--wallet-border-dark: #374151;
--wallet-text-dark: #F9FAFB;
--wallet-text-muted-dark: #D1D5DB;
--wallet-hover-dark: #374151;
```

### **Beta Badge Colors**
```css
--beta-bg: #DCFCE7;
--beta-text: #166534;
--beta-border: #BBF7D0;
```

## 📏 **Spacing Tokens**

### **Component Spacing**
```css
/* Wallet Card Spacing */
--wallet-card-padding: 1.5rem;    /* 24px */
--wallet-item-gap: 1rem;          /* 16px */
--wallet-section-gap: 1.5rem;     /* 24px */

/* Payment Method Item */
--pm-item-padding: 1rem;          /* 16px */
--pm-icon-size: 2rem;             /* 32px */
--pm-button-gap: 0.5rem;          /* 8px */

/* Modal Spacing */
--modal-padding: 1.5rem;          /* 24px */
--modal-gap: 1rem;                /* 16px */
```

### **Touch Targets (Mobile)**
```css
/* WCAG 2.2 AA Compliance */
--touch-target-min: 44px;         /* Minimum touch target */
--button-height: 44px;            /* Standard button height */
--icon-button-size: 44px;         /* Icon button minimum */
```

## 🔤 **Typography Tokens**

### **Wallet Component Typography**
```css
/* Headings */
--wallet-title: 1.5rem / 2rem 'Inter', sans-serif;      /* 24px/32px */
--wallet-subtitle: 1.125rem / 1.75rem 'Inter', sans-serif; /* 18px/28px */

/* Body Text */
--wallet-body: 1rem / 1.5rem 'Inter', sans-serif;       /* 16px/24px */
--wallet-caption: 0.875rem / 1.25rem 'Inter', sans-serif; /* 14px/20px */
--wallet-small: 0.75rem / 1rem 'Inter', sans-serif;     /* 12px/16px */

/* Payment Method Labels */
--pm-primary: 1rem / 1.5rem 'Inter', medium;            /* 16px/24px */
--pm-secondary: 0.875rem / 1.25rem 'Inter', normal;     /* 14px/20px */
--pm-meta: 0.75rem / 1rem 'Inter', normal;              /* 12px/16px */
```

## 🎭 **Component States**

### **Interactive States**
```css
/* Button States */
.wallet-button {
  /* Default */
  background: var(--wallet-bg);
  border: 1px solid var(--wallet-border);
  
  /* Hover */
  &:hover {
    background: var(--wallet-hover);
    border-color: var(--info-blue);
  }
  
  /* Focus */
  &:focus {
    outline: 2px solid var(--info-blue);
    outline-offset: 2px;
  }
  
  /* Active */
  &:active {
    transform: translateY(1px);
  }
  
  /* Disabled */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

### **Payment Method Card States**
```css
.payment-method-card {
  /* Default */
  border: 1px solid var(--wallet-border);
  background: var(--wallet-bg);
  
  /* Default Payment Method */
  &.is-default {
    background: #EBF8FF;
    border-color: var(--info-blue);
  }
  
  /* Expiring Soon */
  &.expiring {
    border-color: var(--warning-amber);
    background: #FFFBEB;
  }
  
  /* Loading/Deleting */
  &.processing {
    opacity: 0.6;
    pointer-events: none;
  }
}
```

## 🌗 **Dark Mode Support**

### **Stripe Elements Dark Mode**
```typescript
// Stripe Elements automatically adapt to dark mode
const stripeTheme = {
  variables: {
    colorPrimary: isDarkMode ? '#60A5FA' : '#2563EB',
    colorBackground: isDarkMode ? '#1F2937' : '#FFFFFF',
    colorText: isDarkMode ? '#F9FAFB' : '#111827',
    fontFamily: 'Inter, system-ui, sans-serif',
  }
};
```

### **CSS Custom Properties**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --wallet-bg: var(--wallet-bg-dark);
    --wallet-border: var(--wallet-border-dark);
    --wallet-text: var(--wallet-text-dark);
    --wallet-text-muted: var(--wallet-text-muted-dark);
    --wallet-hover: var(--wallet-hover-dark);
  }
}
```

## 📱 **Responsive Breakpoints**

### **Wallet Layout Breakpoints**
```css
/* Mobile First Approach */
.wallet-container {
  /* Mobile (default): Single column */
  grid-template-columns: 1fr;
  
  /* Tablet: 768px+ */
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
  }
  
  /* Desktop: 1024px+ */
  @media (min-width: 1024px) {
    grid-template-columns: 3fr 1fr;
    max-width: 1200px;
  }
}
```

### **Component Adaptations**
```css
/* Payment Method List */
.payment-method-item {
  /* Mobile: Stack vertically */
  flex-direction: column;
  align-items: flex-start;
  
  /* Tablet+: Side by side */
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

/* Add Card Modal */
.add-card-modal {
  /* Mobile: Full screen */
  width: 100vw;
  height: 100vh;
  
  /* Desktop: Centered modal */
  @media (min-width: 768px) {
    width: 500px;
    height: auto;
    max-height: 90vh;
  }
}
```

## 🎯 **Animation Tokens**

### **Transition Timing**
```css
/* Standard Transitions */
--transition-fast: 150ms ease-out;
--transition-normal: 250ms ease-out;
--transition-slow: 350ms ease-out;

/* Loading Animations */
--pulse-duration: 1.5s;
--skeleton-shimmer: 2s ease-in-out infinite;
```

### **Component Animations**
```css
/* Loading Skeleton */
.skeleton {
  animation: pulse var(--pulse-duration) ease-in-out infinite;
}

/* Modal Transitions */
.modal-enter {
  opacity: 0;
  transform: scale(0.95);
  transition: all var(--transition-normal);
}

.modal-enter-active {
  opacity: 1;
  transform: scale(1);
}
```

## ♿ **Accessibility Tokens**

### **Focus Indicators**
```css
--focus-ring: 2px solid var(--info-blue);
--focus-offset: 2px;
--focus-radius: 4px;
```

### **High Contrast Support**
```css
@media (prefers-contrast: high) {
  :root {
    --wallet-border: #000000;
    --wallet-text: #000000;
    --focus-ring: 3px solid #000000;
  }
}
```

### **Reduced Motion Support**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📋 **Designer Review Checklist**

### **Color Validation**
- [ ] All colors meet WCAG 2.2 AA contrast requirements
- [ ] Brand colors accurately represent payment method types
- [ ] Dark mode theme provides consistent experience
- [ ] Status colors (success, warning, error) are clearly distinguishable

### **Spacing Validation**  
- [ ] Touch targets meet 44px minimum on mobile
- [ ] Consistent spacing hierarchy maintained
- [ ] Adequate white space for readability
- [ ] Component margins and padding feel balanced

### **Typography Validation**
- [ ] Font sizes are readable on all screen sizes
- [ ] Line heights provide comfortable reading experience
- [ ] Font weights create clear hierarchy
- [ ] Payment method information is easily scannable

### **Animation Validation**
- [ ] Transitions feel smooth and purposeful
- [ ] Loading states provide clear feedback
- [ ] Reduced motion preferences respected
- [ ] No jarring or distracting effects

---

**Design Token Version**: 1.0  
**Last Updated**: 2025-07-10  
**Component Coverage**: PaymentMethodList, AddCardModal, WalletTab

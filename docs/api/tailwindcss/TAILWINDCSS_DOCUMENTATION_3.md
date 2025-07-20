# Tailwind CSS Documentation 3

## 📋 Document Directory & Navigation

### 📖 Overview
This document serves as the specialized reference for Tailwind CSS effects, filters, transforms, and interactive utilities within the github-link-up-buddy project. It covers visual effects, advanced animations, complex transformations, accessibility features, and user interaction patterns.

### 🧭 Quick Navigation
- **Visual Effects**: Shadows, opacity, blend modes, and visual enhancements
- **Filters & Transforms**: Advanced image processing and 3D transformations
- **Interactive Elements**: User interactions, hover states, and accessibility
- **Animation Patterns**: Complex animations, transitions, and motion design
- **Accessibility**: Screen reader support, keyboard navigation, and inclusive design

### 📑 Detailed Table of Contents

#### 1. Shadow and Lighting Effects
- 1.1 Box Shadow Systems
- 1.2 Text Shadow Effects
- 1.3 Inset Shadow Patterns
- 1.4 Drop Shadow Filters
- 1.5 Custom Shadow Configurations
- 1.6 Performance-Optimized Shadows

#### 2. Opacity and Transparency
- 2.1 Element Opacity Control
- 2.2 Background Transparency
- 2.3 Text Transparency Effects
- 2.4 Layered Transparency Systems
- 2.5 Performance Considerations
- 2.6 Accessibility and Contrast

#### 3. Blend Modes and Composition
- 3.1 Mix Blend Mode Effects
- 3.2 Background Blend Modes
- 3.3 Color Mixing Techniques
- 3.4 Creative Composition Patterns
- 3.5 Browser Compatibility
- 3.6 Performance Impact

#### 4. Filter Effects
- 4.1 Blur and Focus Effects
- 4.2 Brightness and Contrast
- 4.3 Color Manipulation Filters
- 4.4 Grayscale and Sepia Tones
- 4.5 Hue Rotation and Saturation
- 4.6 Custom Filter Combinations

#### 5. Backdrop Filters
- 5.1 Background Blur Effects
- 5.2 Backdrop Color Manipulation
- 5.3 Overlay Enhancement Techniques
- 5.4 Performance Optimization
- 5.5 Browser Support Strategies
- 5.6 Accessibility Considerations

#### 6. Transform Operations
- 6.1 2D Transform Functions
- 6.2 3D Transform Effects
- 6.3 Scale and Resize Operations
- 6.4 Rotation and Skew Effects
- 6.5 Translation and Positioning
- 6.6 Transform Origin Control

#### 7. Advanced Transformations
- 7.1 Perspective and Depth
- 7.2 Backface Visibility
- 7.3 Transform Style Preservation
- 7.4 Complex Transform Chains
- 7.5 Animation-Ready Transforms
- 7.6 Performance Optimization

#### 8. Transition Systems
- 8.1 Property-Specific Transitions
- 8.2 Timing Function Control
- 8.3 Transition Duration Management
- 8.4 Delay and Staggering
- 8.5 Transition Behavior
- 8.6 Performance Best Practices

#### 9. Animation Frameworks
- 9.1 Keyframe Animation Systems
- 9.2 CSS Animation Properties
- 9.3 Animation Timing and Control
- 9.4 Complex Animation Sequences
- 9.5 Performance-Optimized Animations
- 9.6 Accessibility and Motion

#### 10. Interactive States
- 10.1 Hover and Focus Effects
- 10.2 Active and Pressed States
- 10.3 Disabled State Styling
- 10.4 Loading and Pending States
- 10.5 Error and Success Indicators
- 10.6 Custom Interactive Patterns

#### 11. User Experience Enhancements
- 11.1 Cursor and Pointer Styles
- 11.2 Selection and Highlighting
- 11.3 Scroll Behavior Control
- 11.4 Touch and Gesture Support
- 11.5 Responsive Interactions
- 11.6 Performance Monitoring

#### 12. Accessibility Features
- 12.1 Screen Reader Optimization
- 12.2 Keyboard Navigation
- 12.3 Focus Management
- 12.4 Color Contrast Compliance
- 12.5 Motion and Animation Control
- 12.6 Inclusive Design Patterns

#### 13. Visual Feedback Systems
- 13.1 Loading Indicators
- 13.2 Progress and Status Updates
- 13.3 Error and Success Messaging
- 13.4 Tooltip and Overlay Systems
- 13.5 Notification Patterns
- 13.6 Accessibility Integration

#### 14. Advanced Visual Effects
- 14.1 Masking and Clipping
- 14.2 Custom Shape Creation
- 14.3 Gradient and Pattern Effects
- 14.4 Image Processing Techniques
- 14.5 SVG Integration
- 14.6 Performance Optimization

#### 15. Cross-Browser Compatibility
- 15.1 Progressive Enhancement
- 15.2 Fallback Strategies
- 15.3 Feature Detection
- 15.4 Polyfill Integration
- 15.5 Testing Across Browsers
- 15.6 Legacy Browser Support

#### 16. Performance Optimization
- 16.1 GPU Acceleration
- 16.2 Layer Management
- 16.3 Reflow and Repaint Optimization
- 16.4 Memory Usage Control
- 16.5 Animation Performance
- 16.6 Monitoring and Debugging

#### 17. Design System Integration
- 17.1 Effect Token Systems
- 17.2 Animation Libraries
- 17.3 Interaction Guidelines
- 17.4 Accessibility Standards
- 17.5 Testing and Quality Assurance
- 17.6 Documentation and Usage

#### 18. Advanced Implementation
- 18.1 Custom Effect Creation
- 18.2 Plugin Development
- 18.3 Framework Integration
- 18.4 Build Process Optimization
- 18.5 Runtime Performance
- 18.6 Maintenance and Updates

### 🔍 How to Use This Document
1. **Visual Effects**: Sections 1-5 for shadows, opacity, and visual enhancements
2. **Transformations**: Sections 6-7 for 2D and 3D transform operations
3. **Animations**: Sections 8-9 for transitions and keyframe animations
4. **Interactions**: Sections 10-12 for user experience and accessibility

### 🏷️ Search Keywords
`visual-effects`, `shadows`, `opacity`, `blend-modes`, `filters`, `backdrop-filters`, `transforms`, `animations`, `transitions`, `interactive-states`, `accessibility`, `performance`, `browser-compatibility`, `visual-feedback`, `advanced-effects`, `design-systems`, `gpu-acceleration`, `cross-browser`, `user-experience`, `motion-design`

---
Borders
outline-width
Utilities for controlling the width of an element's outline.
Class
Styles
outline
outline-width: 1px;
outline-<number>
outline-width: <number>px;
outline-(length:<custom-property>)
outline-width: var(<custom-property>);
outline-[<value>]
outline-width: <value>;

Examples
Basic example
Use outline or outline-<number> utilities like outline-2 and outline-4 to set the width of an element's outline:
outline
Button A
outline-2
Button B
outline-4
Button C
<button class="outline outline-offset-2 ...">Button A</button>
<button class="outline-2 outline-offset-2 ...">Button B</button>
<button class="outline-4 outline-offset-2 ...">Button C</button>
Applying on focus
Prefix an outline-width utility with a variant like focus:* to only apply the utility in that state:
Focus the button to see the outline added
Save Changes
<button class="outline-offset-2 outline-sky-500 focus:outline-2 ...">Save Changes</button>
Learn more about using variants in the variants documentation.
Using a custom value
Use the outline-[<value>] syntax to set the outline width based on a completely custom value:
<div class="outline-[2vw] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the outline-(length:<custom-property>) syntax:
<div class="outline-(length:--my-outline-width) ...">
 <!-- ... -->
</div>
This is just a shorthand for outline-[length:var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix an outline-width utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="outline md:outline-2 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
border-style
outline-color
On this page
Quick reference
Examples
Basic example
Applying on focus
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Borders
outline-color
Utilities for controlling the color of an element's outline.
Class
Styles
outline-inherit
outline-color: inherit;
outline-current
outline-color: currentColor;
outline-transparent
outline-color: transparent;
outline-black
outline-color: var(--color-black); /* #000 */
outline-white
outline-color: var(--color-white); /* #fff */
outline-red-50
outline-color: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */
outline-red-100
outline-color: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */
outline-red-200
outline-color: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */
outline-red-300
outline-color: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */
outline-red-400
outline-color: var(--color-red-400); /* oklch(70.4% 0.191 22.216) */
outline-red-500
outline-color: var(--color-red-500); /* oklch(63.7% 0.237 25.331) */
outline-red-600
outline-color: var(--color-red-600); /* oklch(57.7% 0.245 27.325) */
outline-red-700
outline-color: var(--color-red-700); /* oklch(50.5% 0.213 27.518) */
outline-red-800
outline-color: var(--color-red-800); /* oklch(44.4% 0.177 26.899) */
outline-red-900
outline-color: var(--color-red-900); /* oklch(39.6% 0.141 25.723) */
outline-red-950
outline-color: var(--color-red-950); /* oklch(25.8% 0.092 26.042) */
outline-orange-50
outline-color: var(--color-orange-50); /* oklch(98% 0.016 73.684) */
outline-orange-100
outline-color: var(--color-orange-100); /* oklch(95.4% 0.038 75.164) */
outline-orange-200
outline-color: var(--color-orange-200); /* oklch(90.1% 0.076 70.697) */
outline-orange-300
outline-color: var(--color-orange-300); /* oklch(83.7% 0.128 66.29) */
outline-orange-400
outline-color: var(--color-orange-400); /* oklch(75% 0.183 55.934) */
outline-orange-500
outline-color: var(--color-orange-500); /* oklch(70.5% 0.213 47.604) */
outline-orange-600
outline-color: var(--color-orange-600); /* oklch(64.6% 0.222 41.116) */
outline-orange-700
outline-color: var(--color-orange-700); /* oklch(55.3% 0.195 38.402) */
outline-orange-800
outline-color: var(--color-orange-800); /* oklch(47% 0.157 37.304) */
outline-orange-900
outline-color: var(--color-orange-900); /* oklch(40.8% 0.123 38.172) */
outline-orange-950
outline-color: var(--color-orange-950); /* oklch(26.6% 0.079 36.259) */
outline-amber-50
outline-color: var(--color-amber-50); /* oklch(98.7% 0.022 95.277) */
outline-amber-100
outline-color: var(--color-amber-100); /* oklch(96.2% 0.059 95.617) */
outline-amber-200
outline-color: var(--color-amber-200); /* oklch(92.4% 0.12 95.746) */
outline-amber-300
outline-color: var(--color-amber-300); /* oklch(87.9% 0.169 91.605) */
outline-amber-400
outline-color: var(--color-amber-400); /* oklch(82.8% 0.189 84.429) */
outline-amber-500
outline-color: var(--color-amber-500); /* oklch(76.9% 0.188 70.08) */
outline-amber-600
outline-color: var(--color-amber-600); /* oklch(66.6% 0.179 58.318) */
outline-amber-700
outline-color: var(--color-amber-700); /* oklch(55.5% 0.163 48.998) */
outline-amber-800
outline-color: var(--color-amber-800); /* oklch(47.3% 0.137 46.201) */
outline-amber-900
outline-color: var(--color-amber-900); /* oklch(41.4% 0.112 45.904) */
outline-amber-950
outline-color: var(--color-amber-950); /* oklch(27.9% 0.077 45.635) */
outline-yellow-50
outline-color: var(--color-yellow-50); /* oklch(98.7% 0.026 102.212) */
outline-yellow-100
outline-color: var(--color-yellow-100); /* oklch(97.3% 0.071 103.193) */
outline-yellow-200
outline-color: var(--color-yellow-200); /* oklch(94.5% 0.129 101.54) */
outline-yellow-300
outline-color: var(--color-yellow-300); /* oklch(90.5% 0.182 98.111) */
outline-yellow-400
outline-color: var(--color-yellow-400); /* oklch(85.2% 0.199 91.936) */
outline-yellow-500
outline-color: var(--color-yellow-500); /* oklch(79.5% 0.184 86.047) */
outline-yellow-600
outline-color: var(--color-yellow-600); /* oklch(68.1% 0.162 75.834) */
outline-yellow-700
outline-color: var(--color-yellow-700); /* oklch(55.4% 0.135 66.442) */
outline-yellow-800
outline-color: var(--color-yellow-800); /* oklch(47.6% 0.114 61.907) */
outline-yellow-900
outline-color: var(--color-yellow-900); /* oklch(42.1% 0.095 57.708) */
outline-yellow-950
outline-color: var(--color-yellow-950); /* oklch(28.6% 0.066 53.813) */
outline-lime-50
outline-color: var(--color-lime-50); /* oklch(98.6% 0.031 120.757) */
outline-lime-100
outline-color: var(--color-lime-100); /* oklch(96.7% 0.067 122.328) */
outline-lime-200
outline-color: var(--color-lime-200); /* oklch(93.8% 0.127 124.321) */
outline-lime-300
outline-color: var(--color-lime-300); /* oklch(89.7% 0.196 126.665) */
outline-lime-400
outline-color: var(--color-lime-400); /* oklch(84.1% 0.238 128.85) */
outline-lime-500
outline-color: var(--color-lime-500); /* oklch(76.8% 0.233 130.85) */
outline-lime-600
outline-color: var(--color-lime-600); /* oklch(64.8% 0.2 131.684) */
outline-lime-700
outline-color: var(--color-lime-700); /* oklch(53.2% 0.157 131.589) */
outline-lime-800
outline-color: var(--color-lime-800); /* oklch(45.3% 0.124 130.933) */
outline-lime-900
outline-color: var(--color-lime-900); /* oklch(40.5% 0.101 131.063) */
outline-lime-950
outline-color: var(--color-lime-950); /* oklch(27.4% 0.072 132.109) */
outline-green-50
outline-color: var(--color-green-50); /* oklch(98.2% 0.018 155.826) */
outline-green-100
outline-color: var(--color-green-100); /* oklch(96.2% 0.044 156.743) */
outline-green-200
outline-color: var(--color-green-200); /* oklch(92.5% 0.084 155.995) */
outline-green-300
outline-color: var(--color-green-300); /* oklch(87.1% 0.15 154.449) */
outline-green-400
outline-color: var(--color-green-400); /* oklch(79.2% 0.209 151.711) */
outline-green-500
outline-color: var(--color-green-500); /* oklch(72.3% 0.219 149.579) */
outline-green-600
outline-color: var(--color-green-600); /* oklch(62.7% 0.194 149.214) */
outline-green-700
outline-color: var(--color-green-700); /* oklch(52.7% 0.154 150.069) */
outline-green-800
outline-color: var(--color-green-800); /* oklch(44.8% 0.119 151.328) */
outline-green-900
outline-color: var(--color-green-900); /* oklch(39.3% 0.095 152.535) */
outline-green-950
outline-color: var(--color-green-950); /* oklch(26.6% 0.065 152.934) */
outline-emerald-50
outline-color: var(--color-emerald-50); /* oklch(97.9% 0.021 166.113) */
outline-emerald-100
outline-color: var(--color-emerald-100); /* oklch(95% 0.052 163.051) */
outline-emerald-200
outline-color: var(--color-emerald-200); /* oklch(90.5% 0.093 164.15) */
outline-emerald-300
outline-color: var(--color-emerald-300); /* oklch(84.5% 0.143 164.978) */
outline-emerald-400
outline-color: var(--color-emerald-400); /* oklch(76.5% 0.177 163.223) */
outline-emerald-500
outline-color: var(--color-emerald-500); /* oklch(69.6% 0.17 162.48) */
outline-emerald-600
outline-color: var(--color-emerald-600); /* oklch(59.6% 0.145 163.225) */
outline-emerald-700
outline-color: var(--color-emerald-700); /* oklch(50.8% 0.118 165.612) */
outline-emerald-800
outline-color: var(--color-emerald-800); /* oklch(43.2% 0.095 166.913) */
outline-emerald-900
outline-color: var(--color-emerald-900); /* oklch(37.8% 0.077 168.94) */
outline-emerald-950
outline-color: var(--color-emerald-950); /* oklch(26.2% 0.051 172.552) */
outline-teal-50
outline-color: var(--color-teal-50); /* oklch(98.4% 0.014 180.72) */
outline-teal-100
outline-color: var(--color-teal-100); /* oklch(95.3% 0.051 180.801) */
outline-teal-200
outline-color: var(--color-teal-200); /* oklch(91% 0.096 180.426) */
outline-teal-300
outline-color: var(--color-teal-300); /* oklch(85.5% 0.138 181.071) */
outline-teal-400
outline-color: var(--color-teal-400); /* oklch(77.7% 0.152 181.912) */
outline-teal-500
outline-color: var(--color-teal-500); /* oklch(70.4% 0.14 182.503) */
outline-teal-600
outline-color: var(--color-teal-600); /* oklch(60% 0.118 184.704) */
outline-teal-700
outline-color: var(--color-teal-700); /* oklch(51.1% 0.096 186.391) */
outline-teal-800
outline-color: var(--color-teal-800); /* oklch(43.7% 0.078 188.216) */
outline-teal-900
outline-color: var(--color-teal-900); /* oklch(38.6% 0.063 188.416) */
outline-teal-950
outline-color: var(--color-teal-950); /* oklch(27.7% 0.046 192.524) */
outline-cyan-50
outline-color: var(--color-cyan-50); /* oklch(98.4% 0.019 200.873) */
outline-cyan-100
outline-color: var(--color-cyan-100); /* oklch(95.6% 0.045 203.388) */
outline-cyan-200
outline-color: var(--color-cyan-200); /* oklch(91.7% 0.08 205.041) */
outline-cyan-300
outline-color: var(--color-cyan-300); /* oklch(86.5% 0.127 207.078) */
outline-cyan-400
outline-color: var(--color-cyan-400); /* oklch(78.9% 0.154 211.53) */
outline-cyan-500
outline-color: var(--color-cyan-500); /* oklch(71.5% 0.143 215.221) */
outline-cyan-600
outline-color: var(--color-cyan-600); /* oklch(60.9% 0.126 221.723) */
outline-cyan-700
outline-color: var(--color-cyan-700); /* oklch(52% 0.105 223.128) */
outline-cyan-800
outline-color: var(--color-cyan-800); /* oklch(45% 0.085 224.283) */
outline-cyan-900
outline-color: var(--color-cyan-900); /* oklch(39.8% 0.07 227.392) */
outline-cyan-950
outline-color: var(--color-cyan-950); /* oklch(30.2% 0.056 229.695) */
outline-sky-50
outline-color: var(--color-sky-50); /* oklch(97.7% 0.013 236.62) */
outline-sky-100
outline-color: var(--color-sky-100); /* oklch(95.1% 0.026 236.824) */
outline-sky-200
outline-color: var(--color-sky-200); /* oklch(90.1% 0.058 230.902) */
outline-sky-300
outline-color: var(--color-sky-300); /* oklch(82.8% 0.111 230.318) */
outline-sky-400
outline-color: var(--color-sky-400); /* oklch(74.6% 0.16 232.661) */
outline-sky-500
outline-color: var(--color-sky-500); /* oklch(68.5% 0.169 237.323) */
outline-sky-600
outline-color: var(--color-sky-600); /* oklch(58.8% 0.158 241.966) */
outline-sky-700
outline-color: var(--color-sky-700); /* oklch(50% 0.134 242.749) */
outline-sky-800
outline-color: var(--color-sky-800); /* oklch(44.3% 0.11 240.79) */
outline-sky-900
outline-color: var(--color-sky-900); /* oklch(39.1% 0.09 240.876) */
outline-sky-950
outline-color: var(--color-sky-950); /* oklch(29.3% 0.066 243.157) */
outline-blue-50
outline-color: var(--color-blue-50); /* oklch(97% 0.014 254.604) */
outline-blue-100
outline-color: var(--color-blue-100); /* oklch(93.2% 0.032 255.585) */
outline-blue-200
outline-color: var(--color-blue-200); /* oklch(88.2% 0.059 254.128) */
outline-blue-300
outline-color: var(--color-blue-300); /* oklch(80.9% 0.105 251.813) */
outline-blue-400
outline-color: var(--color-blue-400); /* oklch(70.7% 0.165 254.624) */
outline-blue-500
outline-color: var(--color-blue-500); /* oklch(62.3% 0.214 259.815) */
outline-blue-600
outline-color: var(--color-blue-600); /* oklch(54.6% 0.245 262.881) */
outline-blue-700
outline-color: var(--color-blue-700); /* oklch(48.8% 0.243 264.376) */
outline-blue-800
outline-color: var(--color-blue-800); /* oklch(42.4% 0.199 265.638) */
outline-blue-900
outline-color: var(--color-blue-900); /* oklch(37.9% 0.146 265.522) */
outline-blue-950
outline-color: var(--color-blue-950); /* oklch(28.2% 0.091 267.935) */
outline-indigo-50
outline-color: var(--color-indigo-50); /* oklch(96.2% 0.018 272.314) */
outline-indigo-100
outline-color: var(--color-indigo-100); /* oklch(93% 0.034 272.788) */
outline-indigo-200
outline-color: var(--color-indigo-200); /* oklch(87% 0.065 274.039) */
outline-indigo-300
outline-color: var(--color-indigo-300); /* oklch(78.5% 0.115 274.713) */
outline-indigo-400
outline-color: var(--color-indigo-400); /* oklch(67.3% 0.182 276.935) */
outline-indigo-500
outline-color: var(--color-indigo-500); /* oklch(58.5% 0.233 277.117) */
outline-indigo-600
outline-color: var(--color-indigo-600); /* oklch(51.1% 0.262 276.966) */
outline-indigo-700
outline-color: var(--color-indigo-700); /* oklch(45.7% 0.24 277.023) */
outline-indigo-800
outline-color: var(--color-indigo-800); /* oklch(39.8% 0.195 277.366) */
outline-indigo-900
outline-color: var(--color-indigo-900); /* oklch(35.9% 0.144 278.697) */
outline-indigo-950
outline-color: var(--color-indigo-950); /* oklch(25.7% 0.09 281.288) */
outline-violet-50
outline-color: var(--color-violet-50); /* oklch(96.9% 0.016 293.756) */
outline-violet-100
outline-color: var(--color-violet-100); /* oklch(94.3% 0.029 294.588) */
outline-violet-200
outline-color: var(--color-violet-200); /* oklch(89.4% 0.057 293.283) */
outline-violet-300
outline-color: var(--color-violet-300); /* oklch(81.1% 0.111 293.571) */
outline-violet-400
outline-color: var(--color-violet-400); /* oklch(70.2% 0.183 293.541) */
outline-violet-500
outline-color: var(--color-violet-500); /* oklch(60.6% 0.25 292.717) */
outline-violet-600
outline-color: var(--color-violet-600); /* oklch(54.1% 0.281 293.009) */
outline-violet-700
outline-color: var(--color-violet-700); /* oklch(49.1% 0.27 292.581) */
outline-violet-800
outline-color: var(--color-violet-800); /* oklch(43.2% 0.232 292.759) */
outline-violet-900
outline-color: var(--color-violet-900); /* oklch(38% 0.189 293.745) */
outline-violet-950
outline-color: var(--color-violet-950); /* oklch(28.3% 0.141 291.089) */
outline-purple-50
outline-color: var(--color-purple-50); /* oklch(97.7% 0.014 308.299) */
outline-purple-100
outline-color: var(--color-purple-100); /* oklch(94.6% 0.033 307.174) */
outline-purple-200
outline-color: var(--color-purple-200); /* oklch(90.2% 0.063 306.703) */
outline-purple-300
outline-color: var(--color-purple-300); /* oklch(82.7% 0.119 306.383) */
outline-purple-400
outline-color: var(--color-purple-400); /* oklch(71.4% 0.203 305.504) */
outline-purple-500
outline-color: var(--color-purple-500); /* oklch(62.7% 0.265 303.9) */
outline-purple-600
outline-color: var(--color-purple-600); /* oklch(55.8% 0.288 302.321) */
outline-purple-700
outline-color: var(--color-purple-700); /* oklch(49.6% 0.265 301.924) */
outline-purple-800
outline-color: var(--color-purple-800); /* oklch(43.8% 0.218 303.724) */
outline-purple-900
outline-color: var(--color-purple-900); /* oklch(38.1% 0.176 304.987) */
outline-purple-950
outline-color: var(--color-purple-950); /* oklch(29.1% 0.149 302.717) */
outline-fuchsia-50
outline-color: var(--color-fuchsia-50); /* oklch(97.7% 0.017 320.058) */
outline-fuchsia-100
outline-color: var(--color-fuchsia-100); /* oklch(95.2% 0.037 318.852) */
outline-fuchsia-200
outline-color: var(--color-fuchsia-200); /* oklch(90.3% 0.076 319.62) */
outline-fuchsia-300
outline-color: var(--color-fuchsia-300); /* oklch(83.3% 0.145 321.434) */
outline-fuchsia-400
outline-color: var(--color-fuchsia-400); /* oklch(74% 0.238 322.16) */
outline-fuchsia-500
outline-color: var(--color-fuchsia-500); /* oklch(66.7% 0.295 322.15) */
outline-fuchsia-600
outline-color: var(--color-fuchsia-600); /* oklch(59.1% 0.293 322.896) */
outline-fuchsia-700
outline-color: var(--color-fuchsia-700); /* oklch(51.8% 0.253 323.949) */
outline-fuchsia-800
outline-color: var(--color-fuchsia-800); /* oklch(45.2% 0.211 324.591) */
outline-fuchsia-900
outline-color: var(--color-fuchsia-900); /* oklch(40.1% 0.17 325.612) */
outline-fuchsia-950
outline-color: var(--color-fuchsia-950); /* oklch(29.3% 0.136 325.661) */
outline-pink-50
outline-color: var(--color-pink-50); /* oklch(97.1% 0.014 343.198) */
outline-pink-100
outline-color: var(--color-pink-100); /* oklch(94.8% 0.028 342.258) */
outline-pink-200
outline-color: var(--color-pink-200); /* oklch(89.9% 0.061 343.231) */
outline-pink-300
outline-color: var(--color-pink-300); /* oklch(82.3% 0.12 346.018) */
outline-pink-400
outline-color: var(--color-pink-400); /* oklch(71.8% 0.202 349.761) */
outline-pink-500
outline-color: var(--color-pink-500); /* oklch(65.6% 0.241 354.308) */
outline-pink-600
outline-color: var(--color-pink-600); /* oklch(59.2% 0.249 0.584) */
outline-pink-700
outline-color: var(--color-pink-700); /* oklch(52.5% 0.223 3.958) */
outline-pink-800
outline-color: var(--color-pink-800); /* oklch(45.9% 0.187 3.815) */
outline-pink-900
outline-color: var(--color-pink-900); /* oklch(40.8% 0.153 2.432) */
outline-pink-950
outline-color: var(--color-pink-950); /* oklch(28.4% 0.109 3.907) */
outline-rose-50
outline-color: var(--color-rose-50); /* oklch(96.9% 0.015 12.422) */
outline-rose-100
outline-color: var(--color-rose-100); /* oklch(94.1% 0.03 12.58) */
outline-rose-200
outline-color: var(--color-rose-200); /* oklch(89.2% 0.058 10.001) */
outline-rose-300
outline-color: var(--color-rose-300); /* oklch(81% 0.117 11.638) */
outline-rose-400
outline-color: var(--color-rose-400); /* oklch(71.2% 0.194 13.428) */
outline-rose-500
outline-color: var(--color-rose-500); /* oklch(64.5% 0.246 16.439) */
outline-rose-600
outline-color: var(--color-rose-600); /* oklch(58.6% 0.253 17.585) */
outline-rose-700
outline-color: var(--color-rose-700); /* oklch(51.4% 0.222 16.935) */
outline-rose-800
outline-color: var(--color-rose-800); /* oklch(45.5% 0.188 13.697) */
outline-rose-900
outline-color: var(--color-rose-900); /* oklch(41% 0.159 10.272) */
outline-rose-950
outline-color: var(--color-rose-950); /* oklch(27.1% 0.105 12.094) */
outline-slate-50
outline-color: var(--color-slate-50); /* oklch(98.4% 0.003 247.858) */
outline-slate-100
outline-color: var(--color-slate-100); /* oklch(96.8% 0.007 247.896) */
outline-slate-200
outline-color: var(--color-slate-200); /* oklch(92.9% 0.013 255.508) */
outline-slate-300
outline-color: var(--color-slate-300); /* oklch(86.9% 0.022 252.894) */
outline-slate-400
outline-color: var(--color-slate-400); /* oklch(70.4% 0.04 256.788) */
outline-slate-500
outline-color: var(--color-slate-500); /* oklch(55.4% 0.046 257.417) */
outline-slate-600
outline-color: var(--color-slate-600); /* oklch(44.6% 0.043 257.281) */
outline-slate-700
outline-color: var(--color-slate-700); /* oklch(37.2% 0.044 257.287) */
outline-slate-800
outline-color: var(--color-slate-800); /* oklch(27.9% 0.041 260.031) */
outline-slate-900
outline-color: var(--color-slate-900); /* oklch(20.8% 0.042 265.755) */
outline-slate-950
outline-color: var(--color-slate-950); /* oklch(12.9% 0.042 264.695) */
outline-gray-50
outline-color: var(--color-gray-50); /* oklch(98.5% 0.002 247.839) */
outline-gray-100
outline-color: var(--color-gray-100); /* oklch(96.7% 0.003 264.542) */
outline-gray-200
outline-color: var(--color-gray-200); /* oklch(92.8% 0.006 264.531) */
outline-gray-300
outline-color: var(--color-gray-300); /* oklch(87.2% 0.01 258.338) */
outline-gray-400
outline-color: var(--color-gray-400); /* oklch(70.7% 0.022 261.325) */
outline-gray-500
outline-color: var(--color-gray-500); /* oklch(55.1% 0.027 264.364) */
outline-gray-600
outline-color: var(--color-gray-600); /* oklch(44.6% 0.03 256.802) */
outline-gray-700
outline-color: var(--color-gray-700); /* oklch(37.3% 0.034 259.733) */
outline-gray-800
outline-color: var(--color-gray-800); /* oklch(27.8% 0.033 256.848) */
outline-gray-900
outline-color: var(--color-gray-900); /* oklch(21% 0.034 264.665) */
outline-gray-950
outline-color: var(--color-gray-950); /* oklch(13% 0.028 261.692) */
outline-zinc-50
outline-color: var(--color-zinc-50); /* oklch(98.5% 0 0) */
outline-zinc-100
outline-color: var(--color-zinc-100); /* oklch(96.7% 0.001 286.375) */
outline-zinc-200
outline-color: var(--color-zinc-200); /* oklch(92% 0.004 286.32) */
outline-zinc-300
outline-color: var(--color-zinc-300); /* oklch(87.1% 0.006 286.286) */
outline-zinc-400
outline-color: var(--color-zinc-400); /* oklch(70.5% 0.015 286.067) */
outline-zinc-500
outline-color: var(--color-zinc-500); /* oklch(55.2% 0.016 285.938) */
outline-zinc-600
outline-color: var(--color-zinc-600); /* oklch(44.2% 0.017 285.786) */
outline-zinc-700
outline-color: var(--color-zinc-700); /* oklch(37% 0.013 285.805) */
outline-zinc-800
outline-color: var(--color-zinc-800); /* oklch(27.4% 0.006 286.033) */
outline-zinc-900
outline-color: var(--color-zinc-900); /* oklch(21% 0.006 285.885) */
outline-zinc-950
outline-color: var(--color-zinc-950); /* oklch(14.1% 0.005 285.823) */
outline-neutral-50
outline-color: var(--color-neutral-50); /* oklch(98.5% 0 0) */
outline-neutral-100
outline-color: var(--color-neutral-100); /* oklch(97% 0 0) */
outline-neutral-200
outline-color: var(--color-neutral-200); /* oklch(92.2% 0 0) */
outline-neutral-300
outline-color: var(--color-neutral-300); /* oklch(87% 0 0) */
outline-neutral-400
outline-color: var(--color-neutral-400); /* oklch(70.8% 0 0) */
outline-neutral-500
outline-color: var(--color-neutral-500); /* oklch(55.6% 0 0) */
outline-neutral-600
outline-color: var(--color-neutral-600); /* oklch(43.9% 0 0) */
outline-neutral-700
outline-color: var(--color-neutral-700); /* oklch(37.1% 0 0) */
outline-neutral-800
outline-color: var(--color-neutral-800); /* oklch(26.9% 0 0) */
outline-neutral-900
outline-color: var(--color-neutral-900); /* oklch(20.5% 0 0) */
outline-neutral-950
outline-color: var(--color-neutral-950); /* oklch(14.5% 0 0) */
outline-stone-50
outline-color: var(--color-stone-50); /* oklch(98.5% 0.001 106.423) */
outline-stone-100
outline-color: var(--color-stone-100); /* oklch(97% 0.001 106.424) */
outline-stone-200
outline-color: var(--color-stone-200); /* oklch(92.3% 0.003 48.717) */
outline-stone-300
outline-color: var(--color-stone-300); /* oklch(86.9% 0.005 56.366) */
outline-stone-400
outline-color: var(--color-stone-400); /* oklch(70.9% 0.01 56.259) */
outline-stone-500
outline-color: var(--color-stone-500); /* oklch(55.3% 0.013 58.071) */
outline-stone-600
outline-color: var(--color-stone-600); /* oklch(44.4% 0.011 73.639) */
outline-stone-700
outline-color: var(--color-stone-700); /* oklch(37.4% 0.01 67.558) */
outline-stone-800
outline-color: var(--color-stone-800); /* oklch(26.8% 0.007 34.298) */
outline-stone-900
outline-color: var(--color-stone-900); /* oklch(21.6% 0.006 56.043) */
outline-stone-950
outline-color: var(--color-stone-950); /* oklch(14.7% 0.004 49.25) */
outline-(<custom-property>)
outline-color: var(<custom-property>);
outline-[<value>]
outline-color: <value>;

Show less
Examples
Basic example
Use utilities like outline-rose-500 and outline-lime-100 to control the color of an element's outline:
outline-blue-500
Button A
outline-cyan-500
Button B
outline-pink-500
Button C
<button class="outline-2 outline-offset-2 outline-blue-500 ...">Button A</button>
<button class="outline-2 outline-offset-2 outline-cyan-500 ...">Button B</button>
<button class="outline-2 outline-offset-2 outline-pink-500 ...">Button C</button>
Changing the opacity
Use the color opacity modifier to control the opacity of an element's outline color:
outline-blue-500/100
Button A
outline-blue-500/75
Button B
outline-blue-500/50
Button C
<button class="outline-2 outline-blue-500/100 ...">Button A</button>
<button class="outline-2 outline-blue-500/75 ...">Button B</button>
<button class="outline-2 outline-blue-500/50 ...">Button C</button>
Using a custom value
Use the outline-[<value>] syntax to set the outline color based on a completely custom value:
<div class="outline-[#243c5a] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the outline-(<custom-property>) syntax:
<div class="outline-(--my-color) ...">
 <!-- ... -->
</div>
This is just a shorthand for outline-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix an outline-color utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="outline md:outline-blue-400 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --color-* theme variables to customize the color utilities in your project:
@theme {
 --color-regal-blue: #243c5a;
}
Now the outline-regal-blue utility can be used in your markup:
<div class="outline-regal-blue">
 <!-- ... -->
</div>
Learn more about customizing your theme in the theme documentation.
outline-width
outline-style
On this page
Quick reference
Examples
Basic example
Changing the opacity
Using a custom value
Responsive design
Customizing your theme

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Borders
outline-color
Utilities for controlling the color of an element's outline.
Class
Styles
outline-inherit
outline-color: inherit;
outline-current
outline-color: currentColor;
outline-transparent
outline-color: transparent;
outline-black
outline-color: var(--color-black); /* #000 */
outline-white
outline-color: var(--color-white); /* #fff */
outline-red-50
outline-color: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */
outline-red-100
outline-color: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */
outline-red-200
outline-color: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */
outline-red-300
outline-color: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */
outline-red-400
outline-color: var(--color-red-400); /* oklch(70.4% 0.191 22.216) */
outline-red-500
outline-color: var(--color-red-500); /* oklch(63.7% 0.237 25.331) */
outline-red-600
outline-color: var(--color-red-600); /* oklch(57.7% 0.245 27.325) */
outline-red-700
outline-color: var(--color-red-700); /* oklch(50.5% 0.213 27.518) */
outline-red-800
outline-color: var(--color-red-800); /* oklch(44.4% 0.177 26.899) */
outline-red-900
outline-color: var(--color-red-900); /* oklch(39.6% 0.141 25.723) */
outline-red-950
outline-color: var(--color-red-950); /* oklch(25.8% 0.092 26.042) */
outline-orange-50
outline-color: var(--color-orange-50); /* oklch(98% 0.016 73.684) */
outline-orange-100
outline-color: var(--color-orange-100); /* oklch(95.4% 0.038 75.164) */
outline-orange-200
outline-color: var(--color-orange-200); /* oklch(90.1% 0.076 70.697) */
outline-orange-300
outline-color: var(--color-orange-300); /* oklch(83.7% 0.128 66.29) */
outline-orange-400
outline-color: var(--color-orange-400); /* oklch(75% 0.183 55.934) */
outline-orange-500
outline-color: var(--color-orange-500); /* oklch(70.5% 0.213 47.604) */
outline-orange-600
outline-color: var(--color-orange-600); /* oklch(64.6% 0.222 41.116) */
outline-orange-700
outline-color: var(--color-orange-700); /* oklch(55.3% 0.195 38.402) */
outline-orange-800
outline-color: var(--color-orange-800); /* oklch(47% 0.157 37.304) */
outline-orange-900
outline-color: var(--color-orange-900); /* oklch(40.8% 0.123 38.172) */
outline-orange-950
outline-color: var(--color-orange-950); /* oklch(26.6% 0.079 36.259) */
outline-amber-50
outline-color: var(--color-amber-50); /* oklch(98.7% 0.022 95.277) */
outline-amber-100
outline-color: var(--color-amber-100); /* oklch(96.2% 0.059 95.617) */
outline-amber-200
outline-color: var(--color-amber-200); /* oklch(92.4% 0.12 95.746) */
outline-amber-300
outline-color: var(--color-amber-300); /* oklch(87.9% 0.169 91.605) */
outline-amber-400
outline-color: var(--color-amber-400); /* oklch(82.8% 0.189 84.429) */
outline-amber-500
outline-color: var(--color-amber-500); /* oklch(76.9% 0.188 70.08) */
outline-amber-600
outline-color: var(--color-amber-600); /* oklch(66.6% 0.179 58.318) */
outline-amber-700
outline-color: var(--color-amber-700); /* oklch(55.5% 0.163 48.998) */
outline-amber-800
outline-color: var(--color-amber-800); /* oklch(47.3% 0.137 46.201) */
outline-amber-900
outline-color: var(--color-amber-900); /* oklch(41.4% 0.112 45.904) */
outline-amber-950
outline-color: var(--color-amber-950); /* oklch(27.9% 0.077 45.635) */
outline-yellow-50
outline-color: var(--color-yellow-50); /* oklch(98.7% 0.026 102.212) */
outline-yellow-100
outline-color: var(--color-yellow-100); /* oklch(97.3% 0.071 103.193) */
outline-yellow-200
outline-color: var(--color-yellow-200); /* oklch(94.5% 0.129 101.54) */
outline-yellow-300
outline-color: var(--color-yellow-300); /* oklch(90.5% 0.182 98.111) */
outline-yellow-400
outline-color: var(--color-yellow-400); /* oklch(85.2% 0.199 91.936) */
outline-yellow-500
outline-color: var(--color-yellow-500); /* oklch(79.5% 0.184 86.047) */
outline-yellow-600
outline-color: var(--color-yellow-600); /* oklch(68.1% 0.162 75.834) */
outline-yellow-700
outline-color: var(--color-yellow-700); /* oklch(55.4% 0.135 66.442) */
outline-yellow-800
outline-color: var(--color-yellow-800); /* oklch(47.6% 0.114 61.907) */
outline-yellow-900
outline-color: var(--color-yellow-900); /* oklch(42.1% 0.095 57.708) */
outline-yellow-950
outline-color: var(--color-yellow-950); /* oklch(28.6% 0.066 53.813) */
outline-lime-50
outline-color: var(--color-lime-50); /* oklch(98.6% 0.031 120.757) */
outline-lime-100
outline-color: var(--color-lime-100); /* oklch(96.7% 0.067 122.328) */
outline-lime-200
outline-color: var(--color-lime-200); /* oklch(93.8% 0.127 124.321) */
outline-lime-300
outline-color: var(--color-lime-300); /* oklch(89.7% 0.196 126.665) */
outline-lime-400
outline-color: var(--color-lime-400); /* oklch(84.1% 0.238 128.85) */
outline-lime-500
outline-color: var(--color-lime-500); /* oklch(76.8% 0.233 130.85) */
outline-lime-600
outline-color: var(--color-lime-600); /* oklch(64.8% 0.2 131.684) */
outline-lime-700
outline-color: var(--color-lime-700); /* oklch(53.2% 0.157 131.589) */
outline-lime-800
outline-color: var(--color-lime-800); /* oklch(45.3% 0.124 130.933) */
outline-lime-900
outline-color: var(--color-lime-900); /* oklch(40.5% 0.101 131.063) */
outline-lime-950
outline-color: var(--color-lime-950); /* oklch(27.4% 0.072 132.109) */
outline-green-50
outline-color: var(--color-green-50); /* oklch(98.2% 0.018 155.826) */
outline-green-100
outline-color: var(--color-green-100); /* oklch(96.2% 0.044 156.743) */
outline-green-200
outline-color: var(--color-green-200); /* oklch(92.5% 0.084 155.995) */
outline-green-300
outline-color: var(--color-green-300); /* oklch(87.1% 0.15 154.449) */
outline-green-400
outline-color: var(--color-green-400); /* oklch(79.2% 0.209 151.711) */
outline-green-500
outline-color: var(--color-green-500); /* oklch(72.3% 0.219 149.579) */
outline-green-600
outline-color: var(--color-green-600); /* oklch(62.7% 0.194 149.214) */
outline-green-700
outline-color: var(--color-green-700); /* oklch(52.7% 0.154 150.069) */
outline-green-800
outline-color: var(--color-green-800); /* oklch(44.8% 0.119 151.328) */
outline-green-900
outline-color: var(--color-green-900); /* oklch(39.3% 0.095 152.535) */
outline-green-950
outline-color: var(--color-green-950); /* oklch(26.6% 0.065 152.934) */
outline-emerald-50
outline-color: var(--color-emerald-50); /* oklch(97.9% 0.021 166.113) */
outline-emerald-100
outline-color: var(--color-emerald-100); /* oklch(95% 0.052 163.051) */
outline-emerald-200
outline-color: var(--color-emerald-200); /* oklch(90.5% 0.093 164.15) */
outline-emerald-300
outline-color: var(--color-emerald-300); /* oklch(84.5% 0.143 164.978) */
outline-emerald-400
outline-color: var(--color-emerald-400); /* oklch(76.5% 0.177 163.223) */
outline-emerald-500
outline-color: var(--color-emerald-500); /* oklch(69.6% 0.17 162.48) */
outline-emerald-600
outline-color: var(--color-emerald-600); /* oklch(59.6% 0.145 163.225) */
outline-emerald-700
outline-color: var(--color-emerald-700); /* oklch(50.8% 0.118 165.612) */
outline-emerald-800
outline-color: var(--color-emerald-800); /* oklch(43.2% 0.095 166.913) */
outline-emerald-900
outline-color: var(--color-emerald-900); /* oklch(37.8% 0.077 168.94) */
outline-emerald-950
outline-color: var(--color-emerald-950); /* oklch(26.2% 0.051 172.552) */
outline-teal-50
outline-color: var(--color-teal-50); /* oklch(98.4% 0.014 180.72) */
outline-teal-100
outline-color: var(--color-teal-100); /* oklch(95.3% 0.051 180.801) */
outline-teal-200
outline-color: var(--color-teal-200); /* oklch(91% 0.096 180.426) */
outline-teal-300
outline-color: var(--color-teal-300); /* oklch(85.5% 0.138 181.071) */
outline-teal-400
outline-color: var(--color-teal-400); /* oklch(77.7% 0.152 181.912) */
outline-teal-500
outline-color: var(--color-teal-500); /* oklch(70.4% 0.14 182.503) */
outline-teal-600
outline-color: var(--color-teal-600); /* oklch(60% 0.118 184.704) */
outline-teal-700
outline-color: var(--color-teal-700); /* oklch(51.1% 0.096 186.391) */
outline-teal-800
outline-color: var(--color-teal-800); /* oklch(43.7% 0.078 188.216) */
outline-teal-900
outline-color: var(--color-teal-900); /* oklch(38.6% 0.063 188.416) */
outline-teal-950
outline-color: var(--color-teal-950); /* oklch(27.7% 0.046 192.524) */
outline-cyan-50
outline-color: var(--color-cyan-50); /* oklch(98.4% 0.019 200.873) */
outline-cyan-100
outline-color: var(--color-cyan-100); /* oklch(95.6% 0.045 203.388) */
outline-cyan-200
outline-color: var(--color-cyan-200); /* oklch(91.7% 0.08 205.041) */
outline-cyan-300
outline-color: var(--color-cyan-300); /* oklch(86.5% 0.127 207.078) */
outline-cyan-400
outline-color: var(--color-cyan-400); /* oklch(78.9% 0.154 211.53) */
outline-cyan-500
outline-color: var(--color-cyan-500); /* oklch(71.5% 0.143 215.221) */
outline-cyan-600
outline-color: var(--color-cyan-600); /* oklch(60.9% 0.126 221.723) */
outline-cyan-700
outline-color: var(--color-cyan-700); /* oklch(52% 0.105 223.128) */
outline-cyan-800
outline-color: var(--color-cyan-800); /* oklch(45% 0.085 224.283) */
outline-cyan-900
outline-color: var(--color-cyan-900); /* oklch(39.8% 0.07 227.392) */
outline-cyan-950
outline-color: var(--color-cyan-950); /* oklch(30.2% 0.056 229.695) */
outline-sky-50
outline-color: var(--color-sky-50); /* oklch(97.7% 0.013 236.62) */
outline-sky-100
outline-color: var(--color-sky-100); /* oklch(95.1% 0.026 236.824) */
outline-sky-200
outline-color: var(--color-sky-200); /* oklch(90.1% 0.058 230.902) */
outline-sky-300
outline-color: var(--color-sky-300); /* oklch(82.8% 0.111 230.318) */
outline-sky-400
outline-color: var(--color-sky-400); /* oklch(74.6% 0.16 232.661) */
outline-sky-500
outline-color: var(--color-sky-500); /* oklch(68.5% 0.169 237.323) */
outline-sky-600
outline-color: var(--color-sky-600); /* oklch(58.8% 0.158 241.966) */
outline-sky-700
outline-color: var(--color-sky-700); /* oklch(50% 0.134 242.749) */
outline-sky-800
outline-color: var(--color-sky-800); /* oklch(44.3% 0.11 240.79) */
outline-sky-900
outline-color: var(--color-sky-900); /* oklch(39.1% 0.09 240.876) */
outline-sky-950
outline-color: var(--color-sky-950); /* oklch(29.3% 0.066 243.157) */
outline-blue-50
outline-color: var(--color-blue-50); /* oklch(97% 0.014 254.604) */
outline-blue-100
outline-color: var(--color-blue-100); /* oklch(93.2% 0.032 255.585) */
outline-blue-200
outline-color: var(--color-blue-200); /* oklch(88.2% 0.059 254.128) */
outline-blue-300
outline-color: var(--color-blue-300); /* oklch(80.9% 0.105 251.813) */
outline-blue-400
outline-color: var(--color-blue-400); /* oklch(70.7% 0.165 254.624) */
outline-blue-500
outline-color: var(--color-blue-500); /* oklch(62.3% 0.214 259.815) */
outline-blue-600
outline-color: var(--color-blue-600); /* oklch(54.6% 0.245 262.881) */
outline-blue-700
outline-color: var(--color-blue-700); /* oklch(48.8% 0.243 264.376) */
outline-blue-800
outline-color: var(--color-blue-800); /* oklch(42.4% 0.199 265.638) */
outline-blue-900
outline-color: var(--color-blue-900); /* oklch(37.9% 0.146 265.522) */
outline-blue-950
outline-color: var(--color-blue-950); /* oklch(28.2% 0.091 267.935) */
outline-indigo-50
outline-color: var(--color-indigo-50); /* oklch(96.2% 0.018 272.314) */
outline-indigo-100
outline-color: var(--color-indigo-100); /* oklch(93% 0.034 272.788) */
outline-indigo-200
outline-color: var(--color-indigo-200); /* oklch(87% 0.065 274.039) */
outline-indigo-300
outline-color: var(--color-indigo-300); /* oklch(78.5% 0.115 274.713) */
outline-indigo-400
outline-color: var(--color-indigo-400); /* oklch(67.3% 0.182 276.935) */
outline-indigo-500
outline-color: var(--color-indigo-500); /* oklch(58.5% 0.233 277.117) */
outline-indigo-600
outline-color: var(--color-indigo-600); /* oklch(51.1% 0.262 276.966) */
outline-indigo-700
outline-color: var(--color-indigo-700); /* oklch(45.7% 0.24 277.023) */
outline-indigo-800
outline-color: var(--color-indigo-800); /* oklch(39.8% 0.195 277.366) */
outline-indigo-900
outline-color: var(--color-indigo-900); /* oklch(35.9% 0.144 278.697) */
outline-indigo-950
outline-color: var(--color-indigo-950); /* oklch(25.7% 0.09 281.288) */
outline-violet-50
outline-color: var(--color-violet-50); /* oklch(96.9% 0.016 293.756) */
outline-violet-100
outline-color: var(--color-violet-100); /* oklch(94.3% 0.029 294.588) */
outline-violet-200
outline-color: var(--color-violet-200); /* oklch(89.4% 0.057 293.283) */
outline-violet-300
outline-color: var(--color-violet-300); /* oklch(81.1% 0.111 293.571) */
outline-violet-400
outline-color: var(--color-violet-400); /* oklch(70.2% 0.183 293.541) */
outline-violet-500
outline-color: var(--color-violet-500); /* oklch(60.6% 0.25 292.717) */
outline-violet-600
outline-color: var(--color-violet-600); /* oklch(54.1% 0.281 293.009) */
outline-violet-700
outline-color: var(--color-violet-700); /* oklch(49.1% 0.27 292.581) */
outline-violet-800
outline-color: var(--color-violet-800); /* oklch(43.2% 0.232 292.759) */
outline-violet-900
outline-color: var(--color-violet-900); /* oklch(38% 0.189 293.745) */
outline-violet-950
outline-color: var(--color-violet-950); /* oklch(28.3% 0.141 291.089) */
outline-purple-50
outline-color: var(--color-purple-50); /* oklch(97.7% 0.014 308.299) */
outline-purple-100
outline-color: var(--color-purple-100); /* oklch(94.6% 0.033 307.174) */
outline-purple-200
outline-color: var(--color-purple-200); /* oklch(90.2% 0.063 306.703) */
outline-purple-300
outline-color: var(--color-purple-300); /* oklch(82.7% 0.119 306.383) */
outline-purple-400
outline-color: var(--color-purple-400); /* oklch(71.4% 0.203 305.504) */
outline-purple-500
outline-color: var(--color-purple-500); /* oklch(62.7% 0.265 303.9) */
outline-purple-600
outline-color: var(--color-purple-600); /* oklch(55.8% 0.288 302.321) */
outline-purple-700
outline-color: var(--color-purple-700); /* oklch(49.6% 0.265 301.924) */
outline-purple-800
outline-color: var(--color-purple-800); /* oklch(43.8% 0.218 303.724) */
outline-purple-900
outline-color: var(--color-purple-900); /* oklch(38.1% 0.176 304.987) */
outline-purple-950
outline-color: var(--color-purple-950); /* oklch(29.1% 0.149 302.717) */
outline-fuchsia-50
outline-color: var(--color-fuchsia-50); /* oklch(97.7% 0.017 320.058) */
outline-fuchsia-100
outline-color: var(--color-fuchsia-100); /* oklch(95.2% 0.037 318.852) */
outline-fuchsia-200
outline-color: var(--color-fuchsia-200); /* oklch(90.3% 0.076 319.62) */
outline-fuchsia-300
outline-color: var(--color-fuchsia-300); /* oklch(83.3% 0.145 321.434) */
outline-fuchsia-400
outline-color: var(--color-fuchsia-400); /* oklch(74% 0.238 322.16) */
outline-fuchsia-500
outline-color: var(--color-fuchsia-500); /* oklch(66.7% 0.295 322.15) */
outline-fuchsia-600
outline-color: var(--color-fuchsia-600); /* oklch(59.1% 0.293 322.896) */
outline-fuchsia-700
outline-color: var(--color-fuchsia-700); /* oklch(51.8% 0.253 323.949) */
outline-fuchsia-800
outline-color: var(--color-fuchsia-800); /* oklch(45.2% 0.211 324.591) */
outline-fuchsia-900
outline-color: var(--color-fuchsia-900); /* oklch(40.1% 0.17 325.612) */
outline-fuchsia-950
outline-color: var(--color-fuchsia-950); /* oklch(29.3% 0.136 325.661) */
outline-pink-50
outline-color: var(--color-pink-50); /* oklch(97.1% 0.014 343.198) */
outline-pink-100
outline-color: var(--color-pink-100); /* oklch(94.8% 0.028 342.258) */
outline-pink-200
outline-color: var(--color-pink-200); /* oklch(89.9% 0.061 343.231) */
outline-pink-300
outline-color: var(--color-pink-300); /* oklch(82.3% 0.12 346.018) */
outline-pink-400
outline-color: var(--color-pink-400); /* oklch(71.8% 0.202 349.761) */
outline-pink-500
outline-color: var(--color-pink-500); /* oklch(65.6% 0.241 354.308) */
outline-pink-600
outline-color: var(--color-pink-600); /* oklch(59.2% 0.249 0.584) */
outline-pink-700
outline-color: var(--color-pink-700); /* oklch(52.5% 0.223 3.958) */
outline-pink-800
outline-color: var(--color-pink-800); /* oklch(45.9% 0.187 3.815) */
outline-pink-900
outline-color: var(--color-pink-900); /* oklch(40.8% 0.153 2.432) */
outline-pink-950
outline-color: var(--color-pink-950); /* oklch(28.4% 0.109 3.907) */
outline-rose-50
outline-color: var(--color-rose-50); /* oklch(96.9% 0.015 12.422) */
outline-rose-100
outline-color: var(--color-rose-100); /* oklch(94.1% 0.03 12.58) */
outline-rose-200
outline-color: var(--color-rose-200); /* oklch(89.2% 0.058 10.001) */
outline-rose-300
outline-color: var(--color-rose-300); /* oklch(81% 0.117 11.638) */
outline-rose-400
outline-color: var(--color-rose-400); /* oklch(71.2% 0.194 13.428) */
outline-rose-500
outline-color: var(--color-rose-500); /* oklch(64.5% 0.246 16.439) */
outline-rose-600
outline-color: var(--color-rose-600); /* oklch(58.6% 0.253 17.585) */
outline-rose-700
outline-color: var(--color-rose-700); /* oklch(51.4% 0.222 16.935) */
outline-rose-800
outline-color: var(--color-rose-800); /* oklch(45.5% 0.188 13.697) */
outline-rose-900
outline-color: var(--color-rose-900); /* oklch(41% 0.159 10.272) */
outline-rose-950
outline-color: var(--color-rose-950); /* oklch(27.1% 0.105 12.094) */
outline-slate-50
outline-color: var(--color-slate-50); /* oklch(98.4% 0.003 247.858) */
outline-slate-100
outline-color: var(--color-slate-100); /* oklch(96.8% 0.007 247.896) */
outline-slate-200
outline-color: var(--color-slate-200); /* oklch(92.9% 0.013 255.508) */
outline-slate-300
outline-color: var(--color-slate-300); /* oklch(86.9% 0.022 252.894) */
outline-slate-400
outline-color: var(--color-slate-400); /* oklch(70.4% 0.04 256.788) */
outline-slate-500
outline-color: var(--color-slate-500); /* oklch(55.4% 0.046 257.417) */
outline-slate-600
outline-color: var(--color-slate-600); /* oklch(44.6% 0.043 257.281) */
outline-slate-700
outline-color: var(--color-slate-700); /* oklch(37.2% 0.044 257.287) */
outline-slate-800
outline-color: var(--color-slate-800); /* oklch(27.9% 0.041 260.031) */
outline-slate-900
outline-color: var(--color-slate-900); /* oklch(20.8% 0.042 265.755) */
outline-slate-950
outline-color: var(--color-slate-950); /* oklch(12.9% 0.042 264.695) */
outline-gray-50
outline-color: var(--color-gray-50); /* oklch(98.5% 0.002 247.839) */
outline-gray-100
outline-color: var(--color-gray-100); /* oklch(96.7% 0.003 264.542) */
outline-gray-200
outline-color: var(--color-gray-200); /* oklch(92.8% 0.006 264.531) */
outline-gray-300
outline-color: var(--color-gray-300); /* oklch(87.2% 0.01 258.338) */
outline-gray-400
outline-color: var(--color-gray-400); /* oklch(70.7% 0.022 261.325) */
outline-gray-500
outline-color: var(--color-gray-500); /* oklch(55.1% 0.027 264.364) */
outline-gray-600
outline-color: var(--color-gray-600); /* oklch(44.6% 0.03 256.802) */
outline-gray-700
outline-color: var(--color-gray-700); /* oklch(37.3% 0.034 259.733) */
outline-gray-800
outline-color: var(--color-gray-800); /* oklch(27.8% 0.033 256.848) */
outline-gray-900
outline-color: var(--color-gray-900); /* oklch(21% 0.034 264.665) */
outline-gray-950
outline-color: var(--color-gray-950); /* oklch(13% 0.028 261.692) */
outline-zinc-50
outline-color: var(--color-zinc-50); /* oklch(98.5% 0 0) */
outline-zinc-100
outline-color: var(--color-zinc-100); /* oklch(96.7% 0.001 286.375) */
outline-zinc-200
outline-color: var(--color-zinc-200); /* oklch(92% 0.004 286.32) */
outline-zinc-300
outline-color: var(--color-zinc-300); /* oklch(87.1% 0.006 286.286) */
outline-zinc-400
outline-color: var(--color-zinc-400); /* oklch(70.5% 0.015 286.067) */
outline-zinc-500
outline-color: var(--color-zinc-500); /* oklch(55.2% 0.016 285.938) */
outline-zinc-600
outline-color: var(--color-zinc-600); /* oklch(44.2% 0.017 285.786) */
outline-zinc-700
outline-color: var(--color-zinc-700); /* oklch(37% 0.013 285.805) */
outline-zinc-800
outline-color: var(--color-zinc-800); /* oklch(27.4% 0.006 286.033) */
outline-zinc-900
outline-color: var(--color-zinc-900); /* oklch(21% 0.006 285.885) */
outline-zinc-950
outline-color: var(--color-zinc-950); /* oklch(14.1% 0.005 285.823) */
outline-neutral-50
outline-color: var(--color-neutral-50); /* oklch(98.5% 0 0) */
outline-neutral-100
outline-color: var(--color-neutral-100); /* oklch(97% 0 0) */
outline-neutral-200
outline-color: var(--color-neutral-200); /* oklch(92.2% 0 0) */
outline-neutral-300
outline-color: var(--color-neutral-300); /* oklch(87% 0 0) */
outline-neutral-400
outline-color: var(--color-neutral-400); /* oklch(70.8% 0 0) */
outline-neutral-500
outline-color: var(--color-neutral-500); /* oklch(55.6% 0 0) */
outline-neutral-600
outline-color: var(--color-neutral-600); /* oklch(43.9% 0 0) */
outline-neutral-700
outline-color: var(--color-neutral-700); /* oklch(37.1% 0 0) */
outline-neutral-800
outline-color: var(--color-neutral-800); /* oklch(26.9% 0 0) */
outline-neutral-900
outline-color: var(--color-neutral-900); /* oklch(20.5% 0 0) */
outline-neutral-950
outline-color: var(--color-neutral-950); /* oklch(14.5% 0 0) */
outline-stone-50
outline-color: var(--color-stone-50); /* oklch(98.5% 0.001 106.423) */
outline-stone-100
outline-color: var(--color-stone-100); /* oklch(97% 0.001 106.424) */
outline-stone-200
outline-color: var(--color-stone-200); /* oklch(92.3% 0.003 48.717) */
outline-stone-300
outline-color: var(--color-stone-300); /* oklch(86.9% 0.005 56.366) */
outline-stone-400
outline-color: var(--color-stone-400); /* oklch(70.9% 0.01 56.259) */
outline-stone-500
outline-color: var(--color-stone-500); /* oklch(55.3% 0.013 58.071) */
outline-stone-600
outline-color: var(--color-stone-600); /* oklch(44.4% 0.011 73.639) */
outline-stone-700
outline-color: var(--color-stone-700); /* oklch(37.4% 0.01 67.558) */
outline-stone-800
outline-color: var(--color-stone-800); /* oklch(26.8% 0.007 34.298) */
outline-stone-900
outline-color: var(--color-stone-900); /* oklch(21.6% 0.006 56.043) */
outline-stone-950
outline-color: var(--color-stone-950); /* oklch(14.7% 0.004 49.25) */
outline-(<custom-property>)
outline-color: var(<custom-property>);
outline-[<value>]
outline-color: <value>;

Show less
Examples
Basic example
Use utilities like outline-rose-500 and outline-lime-100 to control the color of an element's outline:
outline-blue-500
Button A
outline-cyan-500
Button B
outline-pink-500
Button C
<button class="outline-2 outline-offset-2 outline-blue-500 ...">Button A</button>
<button class="outline-2 outline-offset-2 outline-cyan-500 ...">Button B</button>
<button class="outline-2 outline-offset-2 outline-pink-500 ...">Button C</button>
Changing the opacity
Use the color opacity modifier to control the opacity of an element's outline color:
outline-blue-500/100
Button A
outline-blue-500/75
Button B
outline-blue-500/50
Button C
<button class="outline-2 outline-blue-500/100 ...">Button A</button>
<button class="outline-2 outline-blue-500/75 ...">Button B</button>
<button class="outline-2 outline-blue-500/50 ...">Button C</button>
Using a custom value
Use the outline-[<value>] syntax to set the outline color based on a completely custom value:
<div class="outline-[#243c5a] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the outline-(<custom-property>) syntax:
<div class="outline-(--my-color) ...">
 <!-- ... -->
</div>
This is just a shorthand for outline-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix an outline-color utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="outline md:outline-blue-400 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --color-* theme variables to customize the color utilities in your project:
@theme {
 --color-regal-blue: #243c5a;
}
Now the outline-regal-blue utility can be used in your markup:
<div class="outline-regal-blue">
 <!-- ... -->
</div>
Learn more about customizing your theme in the theme documentation.
outline-width
outline-style
On this page
Quick reference
Examples
Basic example
Changing the opacity
Using a custom value
Responsive design
Customizing your theme

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Borders
outline-style
Utilities for controlling the style of an element's outline.
Class
Styles
outline-solid
outline-style: solid;
outline-dashed
outline-style: dashed;
outline-dotted
outline-style: dotted;
outline-double
outline-style: double;
outline-none
outline-style: none;
outline-hidden
outline: 2px solid transparent;
outline-offset: 2px;

Examples
Basic example
Use utilities like outline-solid and outline-dashed to set the style of an element's outline:
outline-solid
Button A
outline-dashed
Button B
outline-dotted
Button C
outline-double
Button D
<button class="outline-2 outline-offset-2 outline-solid ...">Button A</button>
<button class="outline-2 outline-offset-2 outline-dashed ...">Button B</button>
<button class="outline-2 outline-offset-2 outline-dotted ...">Button C</button>
<button class="outline-3 outline-offset-2 outline-double ...">Button D</button>
Hiding an outline
Use the outline-hidden utility to hide the default browser outline on focused elements, while still preserving the outline in forced colors mode:
Try emulating `forced-colors: active` in your developer tools to see the behavior
<input class="focus:border-indigo-600 focus:outline-hidden ..." type="text" />
It is highly recommended to apply your own focus styling for accessibility when using this utility.
Removing outlines
Use the outline-none utility to completely remove the default browser outline on focused elements:
Post
<div class="focus-within:outline-2 focus-within:outline-indigo-600 ...">
 <textarea class="outline-none ..." placeholder="Leave a comment..." />
 <button class="..." type="button">Post</button>
</div>
It is highly recommended to apply your own focus styling for accessibility when using this utility.
Responsive design
Prefix an outline-style utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="outline md:outline-dashed ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
outline-color
outline-offset
On this page
Quick reference
Examples
Basic example
Hiding an outline
Removing outlines
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Borders
outline-offset
Utilities for controlling the offset of an element's outline.
Class
Styles
outline-offset-<number>
outline-offset: <number>px;
-outline-offset-<number>
outline-offset: calc(<number>px * -1);
outline-offset-(<custom-property>)
outline-offset: var(<custom-property>);
outline-offset-[<value>]
outline-offset: <value>;

Examples
Basic example
Use utilities like outline-offset-2 and outline-offset-4 to change the offset of an element's outline:
outline-offset-0
Button A
outline-offset-2
Button B
outline-offset-4
Button C
<button class="outline-2 outline-offset-0 ...">Button A</button>
<button class="outline-2 outline-offset-2 ...">Button B</button>
<button class="outline-2 outline-offset-4 ...">Button C</button>
Using a custom value
Use the outline-offset-[<value>] syntax to set the outline offset based on a completely custom value:
<div class="outline-offset-[2vw] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the outline-offset-(<custom-property>) syntax:
<div class="outline-offset-(--my-outline-offset) ...">
 <!-- ... -->
</div>
This is just a shorthand for outline-offset-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix an outline-offset utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="outline md:outline-offset-2 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
outline-style
box-shadow
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy
Effects
opacity
Utilities for controlling the opacity of an element.
Class
Styles
opacity-<number>
opacity: <number>%;
opacity-(<custom-property>)
opacity: var(<custom-property>);
opacity-[<value>]
opacity: <value>;

Examples
Basic example
Use opacity-<number> utilities like opacity-25 and opacity-100 to set the opacity of an element:
opacity-100
Button A
opacity-75
Button B
opacity-50
Button C
opacity-25
Button D
<button class="bg-indigo-500 opacity-100 ..."></button>
<button class="bg-indigo-500 opacity-75 ..."></button>
<button class="bg-indigo-500 opacity-50 ..."></button>
<button class="bg-indigo-500 opacity-25 ..."></button>
Applying conditionally
Prefix an opacity utility with a variant like disabled:* to only apply the utility in that state:
<input class="opacity-100 disabled:opacity-75 ..." type="text" />
Learn more about using variants in the variants documentation.
Using a custom value
Use the opacity-[<value>] syntax to set the opacity based on a completely custom value:
<button class="opacity-[.67] ...">
 <!-- ... -->
</button>
For CSS variables, you can also use the opacity-(<custom-property>) syntax:
<button class="opacity-(--my-opacity) ...">
 <!-- ... -->
</button>
This is just a shorthand for opacity-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix an opacity utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<button class="opacity-50 md:opacity-100 ...">
 <!-- ... -->
</button>
Learn more about using variants in the variants documentation.
text-shadow
mix-blend-mode
On this page
Quick reference
Examples
Basic example
Applying conditionally
Using a custom value
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Effects
mix-blend-mode
Utilities for controlling how an element should blend with the background.
Class
Styles
mix-blend-normal
mix-blend-mode: normal;
mix-blend-multiply
mix-blend-mode: multiply;
mix-blend-screen
mix-blend-mode: screen;
mix-blend-overlay
mix-blend-mode: overlay;
mix-blend-darken
mix-blend-mode: darken;
mix-blend-lighten
mix-blend-mode: lighten;
mix-blend-color-dodge
mix-blend-mode: color-dodge;
mix-blend-color-burn
mix-blend-mode: color-burn;
mix-blend-hard-light
mix-blend-mode: hard-light;
mix-blend-soft-light
mix-blend-mode: soft-light;
mix-blend-difference
mix-blend-mode: difference;
mix-blend-exclusion
mix-blend-mode: exclusion;
mix-blend-hue
mix-blend-mode: hue;
mix-blend-saturation
mix-blend-mode: saturation;
mix-blend-color
mix-blend-mode: color;
mix-blend-luminosity
mix-blend-mode: luminosity;
mix-blend-plus-darker
mix-blend-mode: plus-darker;
mix-blend-plus-lighter
mix-blend-mode: plus-lighter;

Show less
Examples
Basic example
Use utilities like mix-blend-overlay and mix-blend-soft-light to control how an element's content and background is blended with other content in the same stacking context:
<div class="flex justify-center -space-x-14">
 <div class="bg-blue-500 mix-blend-multiply ..."></div>
 <div class="bg-pink-500 mix-blend-multiply ..."></div>
</div>
Isolating blending
Use the isolate utility on the parent element to create a new stacking context and prevent blending with content behind it:
<div class="isolate flex justify-center -space-x-14">
 <div class="bg-yellow-500 mix-blend-multiply ..."></div>
 <div class="bg-green-500 mix-blend-multiply ..."></div>
</div>
<div class="flex justify-center -space-x-14">
 <div class="bg-yellow-500 mix-blend-multiply ..."></div>
 <div class="bg-green-500 mix-blend-multiply ..."></div>
</div>
Responsive design
Prefix a mix-blend-mode utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="mix-blend-multiply md:mix-blend-overlay ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
opacity
background-blend-mode
On this page
Quick reference
Examples
Basic example
Isolating blending
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Effects
background-blend-mode
Utilities for controlling how an element's background image should blend with its background color.
Class
Styles
bg-blend-normal
background-blend-mode: normal;
bg-blend-multiply
background-blend-mode: multiply;
bg-blend-screen
background-blend-mode: screen;
bg-blend-overlay
background-blend-mode: overlay;
bg-blend-darken
background-blend-mode: darken;
bg-blend-lighten
background-blend-mode: lighten;
bg-blend-color-dodge
background-blend-mode: color-dodge;
bg-blend-color-burn
background-blend-mode: color-burn;
bg-blend-hard-light
background-blend-mode: hard-light;
bg-blend-soft-light
background-blend-mode: soft-light;
bg-blend-difference
background-blend-mode: difference;
bg-blend-exclusion
background-blend-mode: exclusion;
bg-blend-hue
background-blend-mode: hue;
bg-blend-saturation
background-blend-mode: saturation;
bg-blend-color
background-blend-mode: color;
bg-blend-luminosity
background-blend-mode: luminosity;

Show less
Examples
Basic example
Use utilities like bg-blend-difference and bg-blend-saturation to control how the background image and color of an element are blended:
bg-blend-multiply
bg-blend-soft-light
bg-blend-overlay
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-multiply ..."></div>
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-soft-light ..."></div>
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-overlay ..."></div>
Responsive design
Prefix a background-blend-mode utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-lighten md:bg-blend-darken ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
mix-blend-mode
mask-clip
On this page
Quick reference
Examples
Basic example
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Effects
mask-clip
Utilities for controlling the bounding box of an element's mask.
Class
Styles
mask-clip-border
mask-clip: border-box;
mask-clip-padding
mask-clip: padding-box;
mask-clip-content
mask-clip: content-box;
mask-clip-fill
mask-clip: fill-box;
mask-clip-stroke
mask-clip: stroke-box;
mask-clip-view
mask-clip: view-box;
mask-no-clip
mask-clip: no-clip;

Examples
Basic example
Use utilities like mask-clip-border, mask-clip-padding, and mask-clip-content to control the bounding box of an element's mask:
mask-clip-border
mask-clip-padding
mask-clip-content
<div class="mask-clip-border border-3 p-1.5 mask-[url(/img/circle.png)] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-clip-padding border-3 p-1.5 mask-[url(/img/circle.png)] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-clip-content border-3 p-1.5 mask-[url(/img/circle.png)] bg-[url(/img/mountains.jpg)] ..."></div>
Responsive design
Prefix a mask-clip utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="mask-clip-border md:mask-clip-padding ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
background-blend-mode
mask-composite
On this page
Quick reference
Examples
Basic example
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Effects
mask-composite
Utilities for controlling how multiple masks are combined together.
Class
Styles
mask-add
mask-composite: add;
mask-subtract
mask-composite: subtract;
mask-intersect
mask-composite: intersect;
mask-exclude
mask-composite: exclude;

Examples
Basic example
Use utilities like mask-add and mask-intersect to control how an element's masks are combined together:
mask-add
mask-subtract
mask-intersect
mask-exclude
<div class="mask-add mask-[url(/img/circle.png),url(/img/circle.png)] mask-[position:30%_50%,70%_50%] bg-[url(/img/mountains.jpg)]"></div>
<div class="mask-subtract mask-[url(/img/circle.png),url(/img/circle.png)] mask-[position:30%_50%,70%_50%] bg-[url(/img/mountains.jpg)]"></div>
<div class="mask-intersect mask-[url(/img/circle.png),url(/img/circle.png)] mask-[position:30%_50%,70%_50%] bg-[url(/img/mountains.jpg)]"></div>
<div class="mask-exclude mask-[url(/img/circle.png),url(/img/circle.png)] mask-[position:30%_50%,70%_50%] bg-[url(/img/mountains.jpg)]"></div>
Responsive design
Prefix a mask-composite utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="mask-add md:mask-subtract ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
mask-clip
mask-image
On this page
Quick reference
Examples
Basic example
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Effects
mask-image
Utilities for controlling an element's mask image.
Class
Styles
mask-[<value>]
mask-image: <value>;
mask-(<custom-property>)
mask-image: var(<custom-property>);
mask-none
mask-image: none;
mask-linear-<number>
mask-image: linear-gradient(<number>deg, black var(--tw-mask-linear-from)), transparent var(--tw-mask-linear-to));
-mask-linear-<number>
mask-image: linear-gradient(calc(<number>deg * -1), black var(--tw-mask-linear-from)), transparent var(--tw-mask-linear-to));
mask-linear-from-<number>
mask-image: linear-gradient(var(--tw-mask-linear-position), black calc(var(--spacing * <number>)), transparent var(--tw-mask-linear-to));
mask-linear-from-<percentage>
mask-image: linear-gradient(var(--tw-mask-linear-position), black <percentage>, transparent var(--tw-mask-linear-to));
mask-linear-from-<color>
mask-image: linear-gradient(var(--tw-mask-linear-position), <color> var(--tw-mask-linear-from), transparent var(--tw-mask-linear-to));
mask-linear-from-(<custom-property>)
mask-image: linear-gradient(var(--tw-mask-linear-position), black <custom-property>, transparent var(--tw-mask-linear-to));
mask-linear-from-[<value>]
mask-image: linear-gradient(var(--tw-mask-linear-position), black <value>, transparent var(--tw-mask-linear-to));
mask-linear-to-<number>
mask-image: linear-gradient(var(--tw-mask-linear-position), black var(--tw-mask-linear-from), transparent calc(var(--spacing * <number>)));
mask-linear-to-<percentage>
mask-image: linear-gradient(var(--tw-mask-linear-position), black var(--tw-mask-linear-from), transparent <percentage>);
mask-linear-to-<color>
mask-image: linear-gradient(var(--tw-mask-linear-position), black var(--tw-mask-linear-from), <color> var(--tw-mask-linear-to));
mask-linear-to-(<custom-property>)
mask-image: linear-gradient(var(--tw-mask-linear-position), black var(--tw-mask-linear-from), transparent var(<custom-property>));
mask-linear-to-[<value>]
mask-image: linear-gradient(var(--tw-mask-linear-position), black var(--tw-mask-linear-from), transparent <value>);
mask-t-from-<number>
mask-image: linear-gradient(to top, black calc(var(--spacing * <number>)), transparent var(--tw-mask-top-to));
mask-t-from-<percentage>
mask-image: linear-gradient(to top, black <percentage>, transparent var(--tw-mask-top-to));
mask-t-from-<color>
mask-image: linear-gradient(to top, <color> var(--tw-mask-top-from), transparent var(--tw-mask-top-to));
mask-t-from-(<custom-property>)
mask-image: linear-gradient(to top, black var(<custom-property>), transparent var(--tw-mask-top-to));
mask-t-from-[<value>]
mask-image: linear-gradient(to top, black <value>, transparent var(--tw-mask-top-to));
mask-t-to-<number>
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), transparent calc(var(--spacing * <number>));
mask-t-to-<percentage>
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), transparent <percentage>);
mask-t-to-<color>
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), <color> var(--tw-mask-top-to));
mask-t-to-(<custom-property>)
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), transparent var(<custom-property>));
mask-t-to-[<value>]
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), transparent <value>);
mask-r-from-<number>
mask-image: linear-gradient(to right, black calc(var(--spacing * <number>)), transparent var(--tw-mask-right-to));
mask-r-from-<percentage>
mask-image: linear-gradient(to right, black <percentage>, transparent var(--tw-mask-right-to));
mask-r-from-<color>
mask-image: linear-gradient(to right, <color> var(--tw-mask-right-from), transparent var(--tw-mask-right-to));
mask-r-from-(<custom-property>)
mask-image: linear-gradient(to right, black var(<custom-property>), transparent var(--tw-mask-right-to));
mask-r-from-[<value>]
mask-image: linear-gradient(to right, black <value>, transparent var(--tw-mask-right-to));
mask-r-to-<number>
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), transparent calc(var(--spacing * <number>));
mask-r-to-<percentage>
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), transparent <percentage>);
mask-r-to-<color>
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), <color> var(--tw-mask-right-to));
mask-r-to-(<custom-property>)
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), transparent var(<custom-property>));
mask-r-to-[<value>]
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), transparent <value>);
mask-b-from-<number>
mask-image: linear-gradient(to bottom, black calc(var(--spacing * <number>)), transparent var(--tw-mask-bottom-to));
mask-b-from-<percentage>
mask-image: linear-gradient(to bottom, black <percentage>, transparent var(--tw-mask-bottom-to));
mask-b-from-<color>
mask-image: linear-gradient(to bottom, <color> var(--tw-mask-bottom-from), transparent var(--tw-mask-bottom-to));
mask-b-from-(<custom-property>)
mask-image: linear-gradient(to bottom, black var(<custom-property>), transparent var(--tw-mask-bottom-to));
mask-b-from-[<value>]
mask-image: linear-gradient(to bottom, black <value>, transparent var(--tw-mask-bottom-to));
mask-b-to-<number>
mask-image: linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent calc(var(--spacing * <number>));
mask-b-to-<percentage>
mask-image: linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent <percentage>);
mask-b-to-<color>
mask-image: linear-gradient(to bottom, black var(--tw-mask-bottom-from), <color> var(--tw-mask-bottom-to));
mask-b-to-(<custom-property>)
mask-image: linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent var(<custom-property>));
mask-b-to-[<value>]
mask-image: linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent <value>);
mask-l-from-<number>
mask-image: linear-gradient(to left, black calc(var(--spacing * <number>)), transparent var(--tw-mask-left-to));
mask-l-from-<percentage>
mask-image: linear-gradient(to left, black <percentage>, transparent var(--tw-mask-left-to));
mask-l-from-<color>
mask-image: linear-gradient(to left, <color> var(--tw-mask-left-from), transparent var(--tw-mask-left-to));
mask-l-from-(<custom-property>)
mask-image: linear-gradient(to left, black var(<custom-property>), transparent var(--tw-mask-left-to));
mask-l-from-[<value>]
mask-image: linear-gradient(to left, black <value>, transparent var(--tw-mask-left-to));
mask-l-to-<number>
mask-image: linear-gradient(to left, black var(--tw-mask-left-from), transparent calc(var(--spacing * <number>));
mask-l-to-<percentage>
mask-image: linear-gradient(to bottom, black var(--tw-mask-left-from), transparent <percentage>);
mask-l-to-<color>
mask-image: linear-gradient(to bottom, black var(--tw-mask-left-from), <color> var(--tw-mask-left-to));
mask-l-to-(<custom-property>)
mask-image: linear-gradient(to left, black var(--tw-mask-left-from), transparent var(<custom-property>));
mask-l-to-[<value>]
mask-image: linear-gradient(to left, black var(--tw-mask-left-from), transparent <value>);
mask-y-from-<number>
mask-image: linear-gradient(to top, black calc(var(--spacing * <number>)), transparent var(--tw-mask-top-to)), linear-gradient(to bottom, black calc(var(--spacing * <number>)), transparent var(--tw-mask-bottom-to));
mask-composite: intersect;
mask-y-from-<percentage>
mask-image: linear-gradient(to top, black <percentage>, transparent var(--tw-mask-top-to)), linear-gradient(to bottom, black <percentage>, transparent var(--tw-mask-bottom-to));
mask-composite: intersect;
mask-y-from-<color>
mask-image: linear-gradient(to top, <color> var(--tw-mask-top-from), transparent var(--tw-mask-top-to)), linear-gradient(to bottom, <color> var(--tw-mask-bottom-from), transparent var(--tw-mask-bottom-to));
mask-composite: intersect;
mask-y-from-(<custom-property>)
mask-image: linear-gradient(to top, black var(<custom-property>), transparent var(--tw-mask-top-to)), linear-gradient(to bottom, black var(<custom-property>), transparent var(--tw-mask-bottom-to));
mask-composite: intersect;
mask-y-from-[<value>]
mask-image: linear-gradient(to top, black <value>, transparent var(--tw-mask-top-to)), linear-gradient(to bottom, black <value>, transparent var(--tw-mask-bottom-to));
mask-composite: intersect;
mask-y-to-<number>
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), transparent calc(var(--spacing * <number>)), linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent calc(var(--spacing * <number>));
mask-composite: intersect;
mask-y-to-<percentage>
mask-image: linear-gradient(to bottom, black var(--tw-mask-top-from), transparent <percentage>), linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent <percentage>);
mask-composite: intersect;
mask-y-to-<color>
mask-image: linear-gradient(to bottom, black var(--tw-mask-top-from), <color> var(--tw-mask-top-to)), linear-gradient(to bottom, black var(--tw-mask-bottom-from), <color> var(--tw-mask-bottom-to));
mask-composite: intersect;
mask-y-to-(<custom-property>)
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), transparent var(<custom-property>)),linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent var(<custom-property>));
mask-composite: intersect;
mask-y-to-[<value>]
mask-image: linear-gradient(to top, black var(--tw-mask-top-from), transparent <value>),linear-gradient(to bottom, black var(--tw-mask-bottom-from), transparent <value>);
mask-composite: intersect;
mask-x-from-<number>
mask-image: linear-gradient(to right, black calc(var(--spacing * <number>)), transparent var(--tw-mask-right-to)), linear-gradient(to left, black calc(var(--spacing * <number>)), transparent var(--tw-mask-left-to));
mask-composite: intersect;
mask-x-from-<percentage>
mask-image: linear-gradient(to right, black <percentage>, transparent var(--tw-mask-right-to)), linear-gradient(to left, black <percentage>, transparent var(--tw-mask-left-to));
mask-composite: intersect;
mask-x-from-<color>
mask-image: linear-gradient(to right, <color> var(--tw-mask-right-from), transparent var(--tw-mask-right-to)), linear-gradient(to left, <color>  var(--tw-mask-left-from), transparent var(--tw-mask-left-to));
mask-composite: intersect;
mask-x-from-(<custom-property>)
mask-image: linear-gradient(to right, black var(<custom-property>), transparent var(--tw-mask-right-to)), linear-gradient(to left, black var(<custom-property>), transparent var(--tw-mask-left-to));
mask-composite: intersect;
mask-x-from-[<value>]
mask-image: linear-gradient(to right, black <value>, transparent var(--tw-mask-right-to)), linear-gradient(to left, black <value>, transparent var(--tw-mask-left-to));
mask-composite: intersect;
mask-x-to-<number>
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), transparent calc(var(--spacing * <number>)), linear-gradient(to left, black var(--tw-mask-left-from), transparent calc(var(--spacing * <number>));
mask-composite: intersect;
mask-x-to-<percentage>
mask-image: linear-gradient(to left, black var(--tw-mask-right-from), transparent <percentage>), linear-gradient(to left, black var(--tw-mask-left-from), transparent <percentage>);
mask-composite: intersect;
mask-x-to-<color>
mask-image: linear-gradient(to left, black var(--tw-mask-right-from), <color> var(--tw-mask-right-to)), linear-gradient(to left, black var(--tw-mask-left-from), <color> var(--tw-mask-left-to));
mask-composite: intersect;
mask-x-to-(<custom-property>)
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), transparent var(<custom-property>)),linear-gradient(to left, black var(--tw-mask-left-from), transparent var(<custom-property>));
mask-composite: intersect;
mask-x-to-[<value>]
mask-image: linear-gradient(to right, black var(--tw-mask-right-from), transparent <value>),linear-gradient(to left, black var(--tw-mask-left-from), transparent <value>);
mask-composite: intersect;
mask-radial-[<value>]
mask-image: radial-gradient(<value>);
mask-radial-[<size>]
--tw-mask-radial-size: <size>;
mask-radial-[<size>_<size>]
--tw-mask-radial-size: <size> <size>;
mask-radial-from-<number>
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black calc(var(--spacing * <number>)), transparent var(--tw-mask-radial-to));
mask-radial-from-<percentage>
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black <percentage>, transparent var(--tw-mask-radial-to));
mask-radial-from-<color>
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), <color> var(--tw-mask-radial-from), transparent var(--tw-mask-radial-to));
mask-radial-from-(<custom-property>)
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black var(<custom-property>), transparent var(--tw-mask-radial-to));
mask-radial-from-[<value>]
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black <value>, transparent var(--tw-mask-radial-to));
mask-radial-to-<number>
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black var(--tw-mask-radial-from), transparent calc(var(--spacing * <number>)));
mask-radial-to-<percentage>
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black var(--tw-mask-radial-from), transparent <percentage>);
mask-radial-to-<color>
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black var(--tw-mask-radial-from), <color> var(--tw-mask-radial-to));
mask-radial-to-(<custom-property>)
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black var(--tw-mask-radial-from), transparent var(<custom-property>));
mask-radial-to-[<value>]
mask-image: radial-gradient(var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), black var(--tw-mask-radial-from), transparent <value>);
mask-radial-circle
--tw-mask-radial-shape: circle;
mask-radial-ellipse
--tw-mask-radial-shape: ellipse;
mask-radial-closest-corner
--tw-mask-radial-size: closest-corner;
mask-radial-closest-side
--tw-mask-radial-size: closest-side;
mask-radial-farthest-corner
--tw-mask-radial-size: farthest-corner;
mask-radial-farthest-side
--tw-mask-radial-size: farthest-side;
mask-radial-at-top-left
--tw-mask-radial-position: top left;
mask-radial-at-top
--tw-mask-radial-position: top;
mask-radial-at-top-right
--tw-mask-radial-position: top right;
mask-radial-at-left
--tw-mask-radial-position: left;
mask-radial-at-center
--tw-mask-radial-position:center;
mask-radial-at-right
--tw-mask-radial-position: right;
mask-radial-at-bottom-left
--tw-mask-radial-position: bottom left;
mask-radial-at-bottom
--tw-mask-radial-position: bottom;
mask-radial-at-bottom-right
--tw-mask-radial-position: bottom right;
mask-conic-<number>
mask-image: conic-gradient(from <number>deg, black var(--tw-mask-conic-from), transparent var(--tw-mask-conic-to));
-mask-conic-<number>
mask-image: conic-gradient(from calc(<number>deg * -1), black var(--tw-mask-conic-from), transparent var(--tw-mask-conic-to));
mask-conic-from-<number>
mask-image: conic-gradient(from var(--tw-mask-conic-position), black calc(var(--spacing * <number>)), transparent var(--tw-mask-conic-to));
mask-conic-from-<percentage>
mask-image: conic-gradient(from var(--tw-mask-conic-position), black <percentage>, transparent var(--tw-mask-conic-to));
mask-conic-from-<color>
mask-image: conic-gradient(from var(--tw-mask-conic-position), <color> var(--tw-mask-conic-from), transparent var(--tw-mask-conic-to));
mask-conic-from-(<custom-property>)
mask-image: conic-gradient(from var(--tw-mask-conic-position), black var(<custom-property>), transparent var(--tw-mask-conic-to));
mask-conic-from-[<value>]
mask-image: conic-gradient(from var(--tw-mask-conic-position), black <value>, transparent var(--tw-mask-conic-to));
mask-conic-to-<number>
mask-image: conic-gradient(from var(--tw-mask-conic-position), black var(--tw-mask-conic-from), transparent calc(var(--spacing * <number>));
mask-conic-to-<percentage>
mask-image: conic-gradient(from var(--tw-mask-conic-position), black var(--tw-mask-conic-from), transparent <percentage>);
mask-conic-to-<color>
mask-image: conic-gradient(from var(--tw-mask-conic-position), black var(--tw-mask-conic-from), <color> var(--tw-mask-conic-to);
mask-conic-to-(<custom-property>)
mask-image: conic-gradient(from var(--tw-mask-conic-position), black var(--tw-mask-conic-from), transparent var(<custom-property>);
mask-conic-to-[<value>]
mask-image: conic-gradient(from var(--tw-mask-conic-position), black var(--tw-mask-conic-from), transparent <value>);

Show less
Examples
Using an image mask
Use the mask-[<value>] syntax to set the mask image of an element:
<div class="mask-[url(/img/scribble.png)] bg-[url(/img/mountains.jpg)] ...">
 <!-- ... -->
</div>
Masking edges
Use utilities like mask-b-from-<value> and mask-t-to-<value> to add a linear gradient mask to a single side of an element:
mask-t-from-50%
mask-r-from-30%
mask-l-from-50% mask-l-to-90%
mask-b-from-20% mask-b-to-80%
<div class="mask-t-from-50% bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-r-from-30% bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-l-from-50% mask-l-to-90% bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-b-from-20% mask-b-to-80% bg-[url(/img/mountains.jpg)] ..."></div>
Additionally, use utilities like mask-x-from-70% and mask-y-to-90% to apply a mask to two sides of an element at the same time:
mask-x-from-70% mask-x-to-90%
mask-y-from-70% mask-y-to-90%
<div class="mask-x-from-70% mask-x-to-90% bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-y-from-70% mask-y-to-90% bg-[url(/img/mountains.jpg)] ..."></div>
By default, linear gradient masks transition from black to transparent, but you can customize the gradient colors using the mask-<side>-from-<color> and mask-<side>-to-<color> utilities.
Adding an angled linear mask
Use utilities like mask-linear-<angle>, mask-linear-from-20, and mask-linear-to-40 to add a custom linear gradient mask to an element:
mask-linear-50
-mask-linear-50
<div class="mask-linear-50 mask-linear-from-60% mask-linear-to-80% bg-[url(/img/mountains.jpg)] ..."></div>
<div class="-mask-linear-50 mask-linear-from-60% mask-linear-to-80% bg-[url(/img/mountains.jpg)] ..."></div>
Adding a radial mask
Use the mask-radial-from-<value> and mask-radial-to-<value> utilities to add a radial gradient mask to an element:

Speed
Built for power users
Work faster than ever with our keyboard shortcuts
<div class="flex items-center gap-4">
 <img class="mask-radial-[100%_100%] mask-radial-from-75% mask-radial-at-left ..." src="/img/keyboard.png" />
 <div class="font-medium">
   <p class="font-mono text-xs text-blue-500 uppercase dark:text-blue-400">Speed</p>
   <p class="mt-2 text-base text-gray-700 dark:text-gray-300">Built for power users</p>
   <p class="mt-1 text-sm leading-relaxed text-balance text-gray-500">
     Work faster than ever with customizable keyboard shortcuts
   </p>
 </div>
</div>
By default, radial gradient masks transition from black to transparent, but you can customize the gradient colors using the mask-radial-from-<color> and mask-radial-to-<color> utilities.
Setting the radial position
Use utilities like mask-radial-at-bottom-left and mask-radial-at-[35%_35%] to set the position of the center of the radial gradient mask:
mask-radial-at-top-left
mask-radial-at-top
mask-radial-at-top-right
mask-radial-at-left
mask-radial-at-center
mask-radial-at-right
mask-radial-at-bottom-left
mask-radial-at-bottom
mask-radial-at-bottom-right
<div class="mask-radial-at-top-left mask-radial-from-100% bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-radial-at-top mask-radial-from-100% bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-radial-at-top-right mask-radial-from-100% bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-radial-at-left mask-radial-from-100% bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-radial-at-center mask-radial-from-100% bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-radial-at-right mask-radial-from-100% bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-radial-at-bottom-left mask-radial-from-100% bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-radial-at-bottom mask-radial-from-100% bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-radial-at-bottom-right mask-radial-from-100% bg-[url(/img/mountains.jpg)] ..."></div>
This is different from mask-position which sets the position of the mask image itself, not the radial gradient.
Setting the radial size
Use utilities like mask-radial-closest-corner and mask-radial-farthest-side to set the size of the radial gradient mask:
mask-radial-closest-side
mask-radial-closest-corner
mask-radial-farthest-side
mask-radial-farthest-corner
<div class="mask-radial-closest-side mask-radial-from-100% mask-radial-at-[30%_30%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-radial-closest-corner mask-radial-from-100% mask-radial-at-[30%_30%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-radial-farthest-side mask-radial-from-100% mask-radial-at-[30%_30%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-radial-farthest-corner mask-radial-from-100% mask-radial-at-[30%_30%] bg-[url(/img/mountains.jpg)] ..."></div>
When setting a custom radial gradient size, the units you can use depend on the <ending-shape> of the gradient which is set to ellipse by default.
With mask-circle, you can only use a single fixed length, like mask-radial-[5rem]. Whereas with mask-ellipse, you can specify each axis as a fixed length or percentage, like mask-radial-[40%_80%].
Adding a conic mask
Use the mask-conic-from-<value>, mask-conic-to-<value> and mask-conic-<angle> utilities to add a conic gradient mask to an element:
Storage used: 75%
0.48 GB out of 2 GB remaining
<div class="flex items-center gap-5 rounded-xl bg-white p-4 shadow-lg ring-1 ring-black/5 dark:bg-gray-800">
 <div class="grid grid-cols-1 grid-rows-1">
   <div class="border-4 border-gray-100 dark:border-gray-700 ..."></div>
   <div class="border-4 border-amber-500 mask-conic-from-75% mask-conic-to-75% dark:border-amber-400 ..."></div>
 </div>
 <div class="w-0 flex-1 text-sm text-gray-950 dark:text-white">
   <p class="font-medium">Storage used: 75%</p>
   <p class="mt-1 text-gray-500 dark:text-gray-400"><span class="font-medium">0.48 GB</span> out of 2 GB remaining</p>
 </div>
</div>
By default, conic gradient masks transition from black to transparent, but you can customize the gradient colors using the mask-conic-from-<color> and mask-conic-to-<color> utilities.
Combining masks
Gradient mask utilities, like mask-radial-from-<value>, mask-conic-to-<value>, and mask-l-from-<value> can be combined to create more complex gradient masks:
<div class="mask-b-from-50% mask-radial-[50%_90%] mask-radial-from-80% bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-r-from-80% mask-b-from-80% mask-radial-from-70% mask-radial-to-85% bg-[url(/img/mountains.jpg)] ..."></div>
This behavior relies on the fact that Tailwind sets the mask-composite property to intersect by default. Changing this property will affect how the gradient masks are combined.
Removing mask images
Use the mask-none utility to remove an existing mask image from an element:
<div class="mask-none">
 <!-- ... -->
</div>
Using a custom value
Use utilities like mask-linear-[<value>] and mask-radial-[<value>] to set the mask image based on a completely custom value:
<div class="mask-linear-[70deg,transparent_10%,black,transparent_80%] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the mask-linear-(<custom-property>) syntax:
<div class="mask-linear-(--my-mask) ...">
 <!-- ... -->
</div>
This is just a shorthand for mask-linear-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a mask-image utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="mask-radial-from-70% md:mask-radial-from-50% ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --color-* theme variables to customize the color utilities in your project:
@theme {
 --color-regal-blue: #243c5a;
}
Now utilities like mask-radial-from-regal-blue,mask-conic-to-regal-blue, and mask-b-from-regal-blue can be used in your markup:
<div class="mask-radial-from-regal-blue">
 <!-- ... -->
</div>
Learn more about customizing your theme in the theme documentation.
mask-composite
mask-mode
On this page
Quick reference
Examples
Using an image mask
Masking edges
Adding an angled linear mask
Adding a radial mask
Adding a conic mask
Combining masks
Removing mask images
Using a custom value
Responsive design
Customizing your theme

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

EFFECTS
mask-mode
Utilities for controlling an element's mask mode.
Class
Styles
mask-alpha
mask-mode: alpha;
mask-luminance
mask-mode: luminance;
mask-match
mask-mode: match-source;

EXAMPLES
Basic example
Use the mask-alpha, mask-luminance and mask-match utilities to control the mode of an element's mask:
mask-alpha
mask-luminance
<div class="mask-alpha mask-r-from-black mask-r-from-50% mask-r-to-transparent bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-luminance mask-r-from-white mask-r-from-50% mask-r-to-black bg-[url(/img/mountains.jpg)] ..."></div>
When using mask-luminance the luminance value of the mask determines visibility, so sticking with grayscale colors will produce the most predictable results. With mask-alpha, the opacity of the mask determines the visibility of the masked element.
Responsive design
Prefix a mask-mode utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="mask-alpha md:mask-luminance ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
mask-image
mask-origin
ON THIS PAGE
Quick reference
Examples
Basic example
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Effects
mask-origin
Utilities for controlling how an element's mask image is positioned relative to borders, padding, and content.
Class
Styles
mask-origin-border
mask-origin: border-box;
mask-origin-padding
mask-origin: padding-box;
mask-origin-content
mask-origin: content-box;
mask-origin-fill
mask-origin: fill-box;
mask-origin-stroke
mask-origin: stroke-box;
mask-origin-view
mask-origin: view-box;

Examples
Basic example
Use utilities like mask-origin-border, mask-origin-padding, and mask-origin-content to control where an element's mask is rendered:
mask-origin-border
mask-origin-padding
mask-origin-content
<div class="mask-origin-border border-3 p-1.5 mask-[url(/img/circle.png)] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-origin-padding border-3 p-1.5 mask-[url(/img/circle.png)] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-origin-content border-3 p-1.5 mask-[url(/img/circle.png)] bg-[url(/img/mountains.jpg)] ..."></div>
Responsive design
Prefix a mask-origin utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="mask-origin-border md:mask-origin-padding ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
mask-mode
mask-position
On this page
Quick reference
Examples
Basic example
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Effects
mask-position
Utilities for controlling the position of an element's mask image.
Class
Styles
mask-top-left
mask-position: top left;
mask-top
mask-position: top;
mask-top-right
mask-position: top right;
mask-left
mask-position: left;
mask-center
mask-position: center;
mask-right
mask-position: right;
mask-bottom-left
mask-position: bottom left;
mask-bottom
mask-position: bottom;
mask-bottom-right
mask-position: bottom right;
mask-position-(<custom-property>)
mask-position: var(<custom-property>);
mask-position-[<value>]
mask-position: <value>;

Examples
Basic example
Use utilities like mask-center, mask-right, and mask-left-top to control the position of an element's mask image:
mask-top-left
mask-top
mask-top-right
mask-left
mask-center
mask-right
mask-bottom-left
mask-bottom
mask-bottom-right
<div class="mask-top-left mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-top mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-top-right mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-left mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-center mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-right mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-bottom-left mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-bottom mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
<div class="mask-bottom-right mask-[url(/img/circle.png)] mask-size-[50%] bg-[url(/img/mountains.jpg)] ..."></div>
Using a custom value
Use the mask-position-[<value>] syntax to set the mask position based on a completely custom value:
<div class="mask-position-[center_top_1rem] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the mask-position-(<custom-property>) syntax:
<div class="mask-position-(--my-mask-position) ...">
 <!-- ... -->
</div>
This is just a shorthand for mask-position-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a mask-position utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="mask-center md:mask-top ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
mask-origin
mask-repeat
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Effects
mask-repeat
Utilities for controlling the repetition of an element's mask image.
Class
Styles
mask-repeat
mask-repeat: repeat;
mask-no-repeat
mask-repeat: no-repeat;
mask-repeat-x
mask-repeat: repeat-x;
mask-repeat-y
mask-repeat: repeat-y;
mask-repeat-space
mask-repeat: space;
mask-repeat-round
mask-repeat: round;

Examples
Basic example
Use the mask-repeat utility to repeat the mask image both vertically and horizontally:
<div class="mask-repeat mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)] ..."></div>
Repeating horizontally
Use the mask-repeat-x utility to only repeat the mask image horizontally:
<div class="mask-repeat-x mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)]..."></div>
Repeating vertically
Use the mask-repeat-y utility to only repeat the mask image vertically:
<div class="mask-repeat-y mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)]..."></div>
Preventing clipping
Use the mask-repeat-space utility to repeat the mask image without clipping:
<div class="mask-repeat-space mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)] ..."></div>
Preventing clipping and gaps
Use the mask-repeat-round utility to repeat the mask image without clipping, stretching if needed to avoid gaps:
<div class="mask-repeat-round mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)] ..."></div>
Disabling repeating
Use the mask-no-repeat utility to prevent a mask image from repeating:
<div class="mask-no-repeat mask-[url(/img/circle.png)] mask-size-[50px_50px] bg-[url(/img/mountains.jpg)] ..."></div>
Responsive design
Prefix a mask-repeat utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="mask-repeat md:mask-repeat-x ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
mask-position
mask-size
On this page
Quick reference
Examples
Basic example
Repeating horizontally
Repeating vertically
Preventing clipping
Preventing clipping and gaps
Disabling repeating
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy


Effects
mask-size
Utilities for controlling the size of an element's mask image.
Class
Styles
mask-auto
mask-size: auto;
mask-cover
mask-size: cover;
mask-contain
mask-size: contain;
mask-size-(<custom-property>)
mask-size: var(<custom-property>);
mask-size-[<value>]
mask-size: <value>;

Examples
Filling the container
Use the mask-cover utility to scale the mask image until it fills the mask layer, cropping the image if needed:
<div class="mask-cover mask-[url(/img/scribble.png)] bg-[url(/img/mountains.jpg)] ..."></div>
Filling without cropping
Use the mask-contain utility to scale the mask image to the outer edges without cropping or stretching:
<div class="mask-contain mask-[url(/img/scribble.png)] bg-[url(/img/mountains.jpg)] ..."></div>
Using the default size
Use the mask-auto utility to display the mask image at its default size:
<div class="mask-auto mask-[url(/img/scribble.png)] bg-[url(/img/mountains.jpg)] ..."></div>
Using a custom value
Use the mask-size-[<value>] syntax to set the mask image size based on a completely custom value:
<div class="mask-size-[auto_100px] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the mask-size-(<custom-property>) syntax:
<div class="mask-size-(--my-mask-size) ...">
 <!-- ... -->
</div>
This is just a shorthand for mask-size-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a mask-size utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="mask-auto md:mask-contain ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
mask-repeat
mask-type
On this page
Quick reference
Examples
Filling the container
Filling without cropping
Using the default size
Using a custom value
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Effects
mask-type
Utilities for controlling how an SVG mask is interpreted.
Class
Styles
mask-type-alpha
mask-type: alpha;
mask-type-luminance
mask-type: luminance;

Examples
Basic example
Use the mask-type-alpha and mask-type-luminance utilities to control the type of an SVG mask:
mask-type-alpha
mask-type-luminance
<svg>
 <mask id="blob1" class="mask-type-alpha fill-gray-700/70">
   <path d="..."></path>
 </mask>
 <image href="/img/mountains.jpg" height="100%" width="100%" mask="url(#blob1)" />
</svg>
<svg>
 <mask id="blob2" class="mask-type-luminance fill-gray-700/70">
   <path d="..."></path>
 </mask>
 <image href="/img/mountains.jpg" height="100%" width="100%" mask="url(#blob2)" />
</svg>
When using mask-type-luminance the luminance value of the SVG mask determines visibility, so sticking with grayscale colors will produce the most predictable results. With mask-alpha, the opacity of the SVG mask determines the visibility of the masked element.
Responsive design
Prefix a mask-type utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<mask class="mask-type-alpha md:mask-type-luminance ...">
 <!-- ... -->
</mask>
Learn more about using variants in the variants documentation.
mask-size
filter
On this page
Quick reference
Examples
Basic example
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
filter
Utilities for applying filters to an element.
Class
Styles
filter-none
filter: none;
filter-(<custom-property>)
filter: var(<custom-property>);
filter-[<value>]
filter: <value>;

Examples
Basic example
Use utilities like blur-xs and grayscale to apply filters to an element:
blur-xs

grayscale

combined

<img class="blur-xs" src="/img/mountains.jpg" />
<img class="grayscale" src="/img/mountains.jpg" />
<img class="blur-xs grayscale" src="/img/mountains.jpg" />
You can combine the following filter utilities: blur, brightness, contrast, drop-shadow, grayscale, hue-rotate, invert, saturate, and sepia.
Removing filters
Use the filter-none utility to remove all of the filters applied to an element:
<img class="blur-md brightness-150 invert md:filter-none" src="/img/mountains.jpg" />
Using a custom value
Use the filter-[<value>] syntax to set the filter based on a completely custom value:
<img class="filter-[url('filters.svg#filter-id')] ..." src="/img/mountains.jpg" />
For CSS variables, you can also use the filter-(<custom-property>) syntax:
<img class="filter-(--my-filter) ..." src="/img/mountains.jpg" />
This is just a shorthand for filter-[var(<custom-property>)] that adds the var() function for you automatically.
Applying on hover
Prefix a filter utility with a variant like hover:* to only apply the utility in that state:
<img class="blur-sm hover:filter-none ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
Responsive design
Prefix a filter utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<img class="blur-sm md:filter-none ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
mask-type
blur
On this page
Quick reference
Examples
Basic example
Removing filters
Using a custom value
Applying on hover
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
filter: blur()
Utilities for applying blur filters to an element.
Class
Styles
blur-xs
filter: blur(var(--blur-xs)); /* 4px */
blur-sm
filter: blur(var(--blur-sm)); /* 8px */
blur-md
filter: blur(var(--blur-md)); /* 12px */
blur-lg
filter: blur(var(--blur-lg)); /* 16px */
blur-xl
filter: blur(var(--blur-xl)); /* 24px */
blur-2xl
filter: blur(var(--blur-2xl)); /* 40px */
blur-3xl
filter: blur(var(--blur-3xl)); /* 64px */
blur-none
filter: ;
blur-(<custom-property>)
filter: blur(var(<custom-property>));
blur-[<value>]
filter: blur(<value>);

Examples
Basic example
Use utilities like blur-sm and blur-lg to blur an element:
blur-none

blur-sm

blur-lg

blur-2xl

<img class="blur-none" src="/img/mountains.jpg" />
<img class="blur-sm" src="/img/mountains.jpg" />
<img class="blur-lg" src="/img/mountains.jpg" />
<img class="blur-2xl" src="/img/mountains.jpg" />
Using a custom value
Use the blur-[<value>] syntax to set the blur based on a completely custom value:
<img class="blur-[2px] ..." src="/img/mountains.jpg" />
For CSS variables, you can also use the blur-(<custom-property>) syntax:
<img class="blur-(--my-blur) ..." src="/img/mountains.jpg" />
This is just a shorthand for blur-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a filter: blur() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<img class="blur-none md:blur-lg ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --blur-* theme variables to customize the blur utilities in your project:
@theme {
 --blur-2xs: 2px;
}
Now the blur-2xs utility can be used in your markup:
<img class="blur-2xs" src="/img/mountains.jpg" />
Learn more about customizing your theme in the theme documentation.
filter
brightness
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design
Customizing your theme

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
filter: brightness()
Utilities for applying brightness filters to an element.
Class
Styles
brightness-<number>
filter: brightness(<number>%);
brightness-(<custom-property>)
filter: brightness(var(<custom-property>));
brightness-[<value>]
filter: brightness(<value>);

Examples
Basic example
Use utilities like brightness-50 and brightness-100 to control an element's brightness:
brightness-50

brightness-100

brightness-125

brightness-200

<img class="brightness-50 ..." src="/img/mountains.jpg" />
<img class="brightness-100 ..." src="/img/mountains.jpg" />
<img class="brightness-125 ..." src="/img/mountains.jpg" />
<img class="brightness-200 ..." src="/img/mountains.jpg" />
Using a custom value
Use the brightness-[<value>] syntax to set the brightness based on a completely custom value:
<img class="brightness-[1.75] ..." src="/img/mountains.jpg" />
For CSS variables, you can also use the brightness-(<custom-property>) syntax:
<img class="brightness-(--my-brightness) ..." src="/img/mountains.jpg" />
This is just a shorthand for brightness-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a filter: brightness() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<img class="brightness-110 md:brightness-150 ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
blur
contrast
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
filter: contrast()
Utilities for applying contrast filters to an element.
Class
Styles
contrast-<number>
filter: contrast(<number>%);
contrast-(<custom-property>)
filter: contrast(var(<custom-property>));
contrast-[<value>]
filter: contrast(<value>);

Examples
Basic example
Use utilities like contrast-50 and contrast-100 to control an element's contrast:
contrast-50

contrast-100

contrast-125

contrast-200

<img class="contrast-50 ..." src="/img/mountains.jpg" />
<img class="contrast-100 ..." src="/img/mountains.jpg" />
<img class="contrast-125 ..." src="/img/mountains.jpg" />
<img class="contrast-200 ..." src="/img/mountains.jpg" />
Using a custom value
Use the contrast-[<value>] syntax to set the contrast based on a completely custom value:
<img class="contrast-[.25] ..." src="/img/mountains.jpg" />
For CSS variables, you can also use the contrast-(<custom-property>) syntax:
<img class="contrast-(--my-contrast) ..." src="/img/mountains.jpg" />
This is just a shorthand for contrast-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a filter: contrast() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<img class="contrast-125 md:contrast-150 ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
brightness
drop-shadow
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
filter: drop-shadow()
Utilities for applying drop-shadow filters to an element.
Class
Styles
drop-shadow-xs
filter: drop-shadow(var(--drop-shadow-xs)); /* 0 1px 1px rgb(0 0 0 / 0.05) */
drop-shadow-sm
filter: drop-shadow(var(--drop-shadow-sm)); /* 0 1px 2px rgb(0 0 0 / 0.15) */
drop-shadow-md
filter: drop-shadow(var(--drop-shadow-md)); /* 0 3px 3px rgb(0 0 0 / 0.12) */
drop-shadow-lg
filter: drop-shadow(var(--drop-shadow-lg)); /* 0 4px 4px rgb(0 0 0 / 0.15) */
drop-shadow-xl
filter: drop-shadow(var(--drop-shadow-xl); /* 0 9px 7px rgb(0 0 0 / 0.1) */
drop-shadow-2xl
filter: drop-shadow(var(--drop-shadow-2xl)); /* 0 25px 25px rgb(0 0 0 / 0.15) */
drop-shadow-none
filter: drop-shadow(0 0 #0000);
drop-shadow-(<custom-property>)
filter: drop-shadow(var(<custom-property>));
drop-shadow-(color:<custom-property>)
--tw-drop-shadow-color: var(<custom-property>);
drop-shadow-[<value>]
filter: drop-shadow(<value>);





























































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































Show more
Examples
Basic example
Use utilities like drop-shadow-sm and drop-shadow-xl to add a drop shadow to an element:
drop-shadow-md
drop-shadow-lg
drop-shadow-xl
<svg class="drop-shadow-md ...">
 <!-- ... -->
</svg>
<svg class="drop-shadow-lg ...">
 <!-- ... -->
</svg>
<svg class="drop-shadow-xl ...">
 <!-- ... -->
</svg>
This is useful for applying shadows to irregular shapes, like text and SVG elements. For applying shadows to regular elements, you probably want to use box shadow instead.
Changing the opacity
Use the opacity modifier to adjust the opacity of the drop shadow:
drop-shadow-xl
drop-shadow-xl/25
drop-shadow-xl/50
<svg class="fill-white drop-shadow-xl ...">...</svg>
<svg class="fill-white drop-shadow-xl/25 ...">...</svg>
<svg class="fill-white drop-shadow-xl/50 ...">...</svg>
The default drop shadow opacities are quite low (15% or less), so increasing the opacity (to like 50%) will make the drop shadows more pronounced.
Setting the shadow color
Use utilities like drop-shadow-indigo-500 and drop-shadow-cyan-500/50 to change the color of a drop shadow:
drop-shadow-cyan-500/50
drop-shadow-indigo-500/50
<svg class="fill-cyan-500 drop-shadow-lg drop-shadow-cyan-500/50 ...">...</svg>
<svg class="fill-indigo-500 drop-shadow-lg drop-shadow-indigo-500/50 ...">...</svg>
By default colored shadows have an opacity of 100% but you can adjust this using the opacity modifier.
Removing a drop shadow
Use the drop-shadow-none utility to remove an existing drop shadow from an element:
<svg class="drop-shadow-lg dark:drop-shadow-none">
 <!-- ... -->
</svg>
Using a custom value
Use the drop-shadow-[<value>] syntax to set the drop shadow based on a completely custom value:
<svg class="drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] ...">
 <!-- ... -->
</svg>
For CSS variables, you can also use the drop-shadow-(<custom-property>) syntax:
<svg class="drop-shadow-(--my-drop-shadow) ...">
 <!-- ... -->
</svg>
This is just a shorthand for drop-shadow-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a filter: drop-shadow() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<svg class="drop-shadow-md md:drop-shadow-xl ...">
 <!-- ... -->
</svg>
Learn more about using variants in the variants documentation.
Customizing your theme
Customizing drop shadows
Use the --drop-shadow-* theme variables to customize the drop shadow utilities in your project:
@theme {
 --drop-shadow-3xl: 0 35px 35px rgba(0, 0, 0, 0.25);
}
Now the drop-shadow-3xl utility can be used in your markup:
<svg class="drop-shadow-3xl">
 <!-- ... -->
</svg>
Learn more about customizing your theme in the theme documentation.
Customizing shadow colors
Use the --color-* theme variables to customize the color utilities in your project:
@theme {
 --color-regal-blue: #243c5a;
}
Now the drop-shadow-regal-blue utility can be used in your markup:
<svg class="drop-shadow-regal-blue">
 <!-- ... -->
</svg>
Learn more about customizing your theme in the theme documentation.
contrast
grayscale
On this page
Quick reference
Examples
Basic example
Changing the opacity
Setting the shadow color
Removing a drop shadow
Using a custom value
Responsive design
Customizing your theme
Customizing drop shadows
Customizing shadow colors

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
filter: grayscale()
Utilities for applying grayscale filters to an element.
Class
Styles
grayscale
filter: grayscale(100%);
grayscale-<number>
filter: grayscale(<number>%);
grayscale-(<custom-property>)
filter: grayscale(var(<custom-property>));
grayscale-[<value>]
filter: grayscale(<value>);

Examples
Basic example
Use utilities like grayscale and grayscale-75 to control the amount of grayscale effect applied to an element:
grayscale-0

grayscale-25

grayscale-50

grayscale

<img class="grayscale-0 ..." src="/img/mountains.jpg" />
<img class="grayscale-25 ..." src="/img/mountains.jpg" />
<img class="grayscale-50 ..." src="/img/mountains.jpg" />
<img class="grayscale ..." src="/img/mountains.jpg" />
Using a custom value
Use the grayscale-[<value>] syntax to set the grayscale based on a completely custom value:
<img class="grayscale-[0.5] ..." src="/img/mountains.jpg" />
For CSS variables, you can also use the grayscale-(<custom-property>) syntax:
<img class="grayscale-(--my-grayscale) ..." src="/img/mountains.jpg" />
This is just a shorthand for grayscale-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a filter: grayscale() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<img class="grayscale md:grayscale-0 ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
drop-shadow
hue-rotate
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
filter: hue-rotate()
Utilities for applying hue-rotate filters to an element.
Class
Styles
hue-rotate-<number>
filter: hue-rotate(<number>deg);
-hue-rotate-<number>
filter: hue-rotate(calc(<number>deg * -1));
hue-rotate-(<custom-property>)
filter: hue-rotate(var(<custom-property>));
hue-rotate-[<value>]
filter: hue-rotate(<value>);

Examples
Basic example
Use utilities like hue-rotate-90 and hue-rotate-180 to rotate the hue of an element by degrees:
hue-rotate-15

hue-rotate-90

hue-rotate-180

hue-rotate-270

<img class="hue-rotate-15" src="/img/mountains.jpg" />
<img class="hue-rotate-90" src="/img/mountains.jpg" />
<img class="hue-rotate-180" src="/img/mountains.jpg" />
<img class="hue-rotate-270" src="/img/mountains.jpg" />
Using negative values
Use utilities like -hue-rotate-15 and -hue-rotate-45 to set a negative hue rotate value:
-hue-rotate-15

-hue-rotate-45

-hue-rotate-90

<img class="-hue-rotate-15" src="/img/mountains.jpg" />
<img class="-hue-rotate-45" src="/img/mountains.jpg" />
<img class="-hue-rotate-90" src="/img/mountains.jpg" />
Using a custom value
Use the hue-rotate-[<value>] syntax to set the hue rotation based on a completely custom value:
<img class="hue-rotate-[3.142rad] ..." src="/img/mountains.jpg" />
For CSS variables, you can also use the hue-rotate-(<custom-property>) syntax:
<img class="hue-rotate-(--my-hue-rotate) ..." src="/img/mountains.jpg" />
This is just a shorthand for hue-rotate-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a filter: hue-rotate() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<img class="hue-rotate-60 md:hue-rotate-0 ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
grayscale
invert
On this page
Quick reference
Examples
Basic example
Using negative values
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
filter: invert()
Utilities for applying invert filters to an element.
Class
Styles
invert
filter: invert(100%);
invert-<number>
filter: invert(<number>%);
invert-(<custom-property>)
filter: invert(var(<custom-property>))
invert-[<value>]
filter: invert(<value>);

Examples
Basic example
Use utilities like invert and invert-20 to control the color inversion of an element:
invert-0

invert-20

invert

<img class="invert-0" src="/img/mountains.jpg" />
<img class="invert-20" src="/img/mountains.jpg" />
<img class="invert" src="/img/mountains.jpg" />
Using a custom value
Use the invert-[<value>] syntax to set the color inversion based on a completely custom value:
<img class="invert-[.25] ..." src="/img/mountains.jpg" />
For CSS variables, you can also use the invert-(<custom-property>) syntax:
<img class="invert-(--my-inversion) ..." src="/img/mountains.jpg" />
This is just a shorthand for invert-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a filter: invert() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<img class="invert md:invert-0 ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
hue-rotate
saturate
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
filter: saturate()
Utilities for applying saturation filters to an element.
Class
Styles
saturate-<number>
filter: saturate(<number>%);
saturate-(<custom-property>)
filter: saturate(var(<custom-property>));
saturate-[<value>]
filter: saturate(<value>);

Examples
Basic example
Use utilities like saturate-50 and saturate-100 to control an element's saturation:
saturate-50

saturate-100

saturate-150

saturate-200

<img class="saturate-50 ..." src="/img/mountains.jpg" />
<img class="saturate-100 ..." src="/img/mountains.jpg" />
<img class="saturate-150 ..." src="/img/mountains.jpg" />
<img class="saturate-200 ..." src="/img/mountains.jpg" />
Using a custom value
Use the saturate-[<value>] syntax to set the saturation based on a completely custom value:
<img class="saturate-[.25] ..." src="/img/mountains.jpg" />
For CSS variables, you can also use the saturate-(<custom-property>) syntax:
<img class="saturate-(--my-saturation) ..." src="/img/mountains.jpg" />
This is just a shorthand for saturate-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a filter: saturate() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<img class="saturate-50 md:saturate-150 ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
invert
sepia
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
filter: sepia()
Utilities for applying sepia filters to an element.
Class
Styles
sepia
filter: sepia(100%);
sepia-<number>
filter: sepia(<number>%);
sepia-(<custom-property>)
filter: sepia(var(<custom-property>));
sepia-[<value>]
filter: sepia(<value>);

Examples
Basic example
Use utilities like sepia and sepia-50 to control the sepia effect applied to an element:
sepia-0

sepia-50

sepia

<img class="sepia-0" src="/img/mountains.jpg" />
<img class="sepia-50" src="/img/mountains.jpg" />
<img class="sepia" src="/img/mountains.jpg" />
Using a custom value
Use the sepia-[<value>] syntax to set the sepia amount based on a completely custom value:
<img class="sepia-[.25] ..." src="/img/mountains.jpg" />
For CSS variables, you can also use the sepia-(<custom-property>) syntax:
<img class="sepia-(--my-sepia) ..." src="/img/mountains.jpg" />
This is just a shorthand for sepia-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a filter: sepia() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<img class="sepia md:sepia-0 ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
saturate
backdrop-filter
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

v4.1
⌘K
DocsBlogShowcaseSponsor
Plus
Documentation
Components
Templates
UI Kit
Playground
Community
New
Getting started
Installation
Editor setup
Compatibility
Upgrade guide
Core concepts
Styling with utility classes
Hover, focus, and other states
Responsive design
Dark mode
Theme variables
Colors
Adding custom styles
Detecting classes in source files
Functions and directives
Base styles
Preflight
Layout
aspect-ratio
columns
break-after
break-before
break-inside
box-decoration-break
box-sizing
display
float
clear
isolation
object-fit
object-position
overflow
overscroll-behavior
position
top / right / bottom / left
visibility
z-index
Flexbox & Grid
flex-basis
flex-direction
flex-wrap
flex
flex-grow
flex-shrink
order
grid-template-columns
grid-column
grid-template-rows
grid-row
grid-auto-flow
grid-auto-columns
grid-auto-rows
gap
justify-content
justify-items
justify-self
align-content
align-items
align-self
place-content
place-items
place-self
Spacing
padding
margin
Sizing
width
min-width
max-width
height
min-height
max-height
Typography
font-family
font-size
font-smoothing
font-style
font-weight
font-stretch
font-variant-numeric
letter-spacing
line-clamp
line-height
list-style-image
list-style-position
list-style-type
text-align
color
text-decoration-line
text-decoration-color
text-decoration-style
text-decoration-thickness
text-underline-offset
text-transform
text-overflow
text-wrap
text-indent
vertical-align
white-space
word-break
overflow-wrap
hyphens
content
Backgrounds
background-attachment
background-clip
background-color
background-image
background-origin
background-position
background-repeat
background-size
Borders
border-radius
border-width
border-color
border-style
outline-width
outline-color
outline-style
outline-offset
Effects
box-shadow
text-shadow
opacity
mix-blend-mode
background-blend-mode
mask-clip
mask-composite
mask-image
mask-mode
mask-origin
mask-position
mask-repeat
mask-size
mask-type
Filters
filter
blur
brightness
contrast
drop-shadow
grayscale
hue-rotate
invert
saturate
sepia
backdrop-filter
blur
brightness
contrast
grayscale
hue-rotate
invert
opacity
saturate
sepia
Tables
border-collapse
border-spacing
table-layout
caption-side
Transitions & Animation
transition-property
transition-behavior
transition-duration
transition-timing-function
transition-delay
animation
Transforms
backface-visibility
perspective
perspective-origin
rotate
scale
skew
transform
transform-origin
transform-style
translate
Interactivity
accent-color
appearance
caret-color
color-scheme
cursor
field-sizing
pointer-events
resize
scroll-behavior
scroll-margin
scroll-padding
scroll-snap-align
scroll-snap-stop
scroll-snap-type
touch-action
user-select
will-change
SVG
fill
stroke
stroke-width
Accessibility
forced-color-adjust
Filters
backdrop-filter
Utilities for applying backdrop filters to an element.
Class
Styles
backdrop-filter-none
backdrop-filter: none;
backdrop-filter-(<custom-property>)
backdrop-filter: var(<custom-property>);
backdrop-filter-[<value>]
backdrop-filter: <value>;

Examples
Basic example
Use utilities like backdrop-blur-xs and backdrop-grayscale to apply filters to an element's backdrop:
backdrop-blur-xs

backdrop-grayscale

combined

<div class="bg-[url(/img/mountains.jpg)] ...">
 <div class="backdrop-blur-xs ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)] ...">
 <div class="backdrop-grayscale ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)] ...">
 <div class="backdrop-blur-xs backdrop-grayscale ..."></div>
</div>
You can combine the following backdrop filter utilities: blur, brightness, contrast, grayscale, hue-rotate, invert, opacity, saturate, and sepia.
Removing filters
Use the backdrop-filter-none utility to remove all of the backdrop filters applied to an element:
<div class="backdrop-blur-md backdrop-brightness-150 md:backdrop-filter-none"></div>
Using a custom value
Use the backdrop-filter-[<value>] syntax to set the backdrop filter based on a completely custom value:
<div class="backdrop-filter-[url('filters.svg#filter-id')] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the backdrop-filter-(<custom-property>) syntax:
<div class="backdrop-filter-(--my-backdrop-filter) ...">
 <!-- ... -->
</div>
This is just a shorthand for backdrop-filter-[var(<custom-property>)] that adds the var() function for you automatically.
Applying on hover
Prefix a backdrop-filter utility with a variant like hover:* to only apply the utility in that state:
<div class="backdrop-blur-sm hover:backdrop-filter-none ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Responsive design
Prefix a backdrop-filter utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="backdrop-blur-sm md:backdrop-filter-none ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
sepia
blur
On this page
Quick reference
Examples
Basic example
Removing filters
Using a custom value
Applying on hover
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
backdrop-filter: blur()
Utilities for applying backdrop blur filters to an element.
Class
Styles
backdrop-blur-xs
backdrop-filter: blur(var(--blur-xs)); /* 4px */
backdrop-blur-sm
backdrop-filter: blur(var(--blur-sm)); /* 8px */
backdrop-blur-md
backdrop-filter: blur(var(--blur-md)); /* 12px */
backdrop-blur-lg
backdrop-filter: blur(var(--blur-lg)); /* 16px */
backdrop-blur-xl
backdrop-filter: blur(var(--blur-xl)); /* 24px */
backdrop-blur-2xl
backdrop-filter: blur(var(--blur-2xl)); /* 40px */
backdrop-blur-3xl
backdrop-filter: blur(var(--blur-3xl)); /* 64px */
backdrop-blur-none
backdrop-filter: ;
backdrop-blur-(<custom-property>)
backdrop-filter: blur(var(<custom-property>));
backdrop-blur-[<value>]
backdrop-filter: blur(<value>);

Examples
Basic example
Use utilities like backdrop-blur-sm and backdrop-blur-lg to control an element’s backdrop blur:
backdrop-blur-none

backdrop-blur-sm

backdrop-blur-md

<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-blur-none ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-blur-sm ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-blur-md ..."></div>
</div>
Using a custom value
Use the backdrop-blur-[<value>] syntax to set the backdrop blur based on a completely custom value:
<div class="backdrop-blur-[2px] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the backdrop-blur-(<custom-property>) syntax:
<div class="backdrop-blur-(--my-backdrop-blur) ...">
 <!-- ... -->
</div>
This is just a shorthand for backdrop-blur-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a backdrop-filter: blur() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="backdrop-blur-none md:backdrop-blur-lg ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --blur-* theme variables to customize the backdrop blur utilities in your project:
@theme {
 --blur-2xs: 2px;
}
Now the backdrop-blur-2xs utility can be used in your markup:
<div class="backdrop-blur-2xs">
 <!-- ... -->
</div>
Learn more about customizing your theme in the theme documentation.
backdrop-filter
brightness
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design
Customizing your theme

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
backdrop-filter: brightness()
Utilities for applying backdrop brightness filters to an element.
Class
Styles
backdrop-brightness-<number>
backdrop-filter: brightness(<number>%);
backdrop-brightness-(<custom-property>)
backdrop-filter: brightness(var(<custom-property>));
backdrop-brightness-[<value>]
backdrop-filter: brightness(<value>);

Examples
Basic example
Use utilities like backdrop-brightness-50 and backdrop-brightness-100 to control an element's backdrop brightness:
backdrop-brightness-50

backdrop-brightness-150

<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-brightness-50 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-brightness-150 ..."></div>
</div>
Using a custom value
Use the backdrop-brightness-[<value>] syntax to set the backdrop brightness based on a completely custom value:
<div class="backdrop-brightness-[1.75] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the backdrop-brightness-(<custom-property>) syntax:
<div class="backdrop-brightness-(--my-backdrop-brightness) ...">
 <!-- ... -->
</div>
This is just a shorthand for backdrop-brightness-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a backdrop-filter: brightness() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="backdrop-brightness-110 md:backdrop-brightness-150 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
blur
contrast
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
backdrop-filter: contrast()
Utilities for applying backdrop contrast filters to an element.
Class
Styles
backdrop-contrast-<number>
backdrop-filter: contrast(<number>%);
backdrop-contrast-(<custom-property>)
backdrop-filter: contrast(var(<custom-property>));
backdrop-contrast-[<value>]
backdrop-filter: contrast(<value>);

Examples
Basic example
Use utilities like backdrop-contrast-50 and backdrop-contrast-100 to control an element's backdrop contrast:
backdrop-contrast-50

backdrop-contrast-200

<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-contrast-50 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-contrast-200 ..."></div>
</div>
Using a custom value
Use the backdrop-contrast-[<value>] syntax to set the backdrop contrast based on a completely custom value:
<div class="backdrop-contrast-[.25] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the backdrop-contrast-(<custom-property>) syntax:
<div class="backdrop-contrast-(--my-backdrop-contrast) ...">
 <!-- ... -->
</div>
This is just a shorthand for backdrop-contrast-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a backdrop-filter: contrast() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="backdrop-contrast-125 md:backdrop-contrast-150 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
brightness
grayscale
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
backdrop-filter: grayscale()
Utilities for applying backdrop grayscale filters to an element.
Class
Styles
backdrop-grayscale
backdrop-filter: grayscale(100%);
backdrop-grayscale-<number>
backdrop-filter: grayscale(<number>%);
backdrop-grayscale-(<custom-property>)
backdrop-filter: grayscale(var(<custom-property>));
backdrop-grayscale-[<value>]
backdrop-filter: grayscale(<value>);

Examples
Basic example
Use utilities like backdrop-grayscale-50 and backdrop-grayscale to control the grayscale effect applied to an element's backdrop:
backdrop-grayscale-0

backdrop-grayscale-50

backdrop-grayscale

<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-grayscale-0 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-grayscale-50 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-grayscale-200 ..."></div>
</div>
Using a custom value
Use the backdrop-grayscale-[<value>] syntax to set the backdrop grayscale based on a completely custom value:
<div class="backdrop-grayscale-[0.5] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the backdrop-grayscale-(<custom-property>) syntax:
<div class="backdrop-grayscale-(--my-backdrop-grayscale) ...">
 <!-- ... -->
</div>
This is just a shorthand for backdrop-grayscale-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a backdrop-filter: grayscale() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="backdrop-grayscale md:backdrop-grayscale-0 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
contrast
hue-rotate
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
backdrop-filter: hue-rotate()
Utilities for applying backdrop hue-rotate filters to an element.
Class
Styles
backdrop-hue-rotate-<number>
backdrop-filter: hue-rotate(<number>deg);
-backdrop-hue-rotate-<number>
backdrop-filter: hue-rotate(calc(<number>deg * -1));
backdrop-hue-rotate-(<custom-property>)
backdrop-filter: hue-rotate(var(<custom-property>));
backdrop-hue-rotate-[<value>]
backdrop-filter: hue-rotate(<value>);

Examples
Basic example
Use utilities like backdrop-hue-rotate-90 and backdrop-hue-rotate-180 to rotate the hue of an element's backdrop:
backdrop-hue-rotate-90

backdrop-hue-rotate-180

backdrop-hue-rotate-270

<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-hue-rotate-90 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-hue-rotate-180 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-hue-rotate-270 ..."></div>
</div>
Using negative values
Use utilities like -backdrop-hue-rotate-90 and -backdrop-hue-rotate-180 to set a negative backdrop hue rotation value:
-backdrop-hue-rotate-15

-backdrop-hue-rotate-45

-backdrop-hue-rotate-90

<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 -backdrop-hue-rotate-15 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 -backdrop-hue-rotate-45 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 -backdrop-hue-rotate-90 ..."></div>
</div>
Using a custom value
Use the backdrop-hue-rotate-[<value>] syntax to set the backdrop hue rotation based on a completely custom value:
<div class="backdrop-hue-rotate-[3.142rad] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the backdrop-hue-rotate-(<custom-property>) syntax:
<div class="backdrop-hue-rotate-(--my-backdrop-hue-rotation) ...">
 <!-- ... -->
</div>
This is just a shorthand for backdrop-hue-rotate-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a backdrop-filter: hue-rotate() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="backdrop-hue-rotate-15 md:backdrop-hue-rotate-0 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
grayscale
invert
On this page
Quick reference
Examples
Basic example
Using negative values
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
backdrop-filter: invert()
Utilities for applying backdrop invert filters to an element.
Class
Styles
backdrop-invert
backdrop-filter: invert(100%);
backdrop-invert-<number>
backdrop-filter: invert(<number>%);
backdrop-invert-(<custom-property>)
backdrop-filter: invert(var(<custom-property>))
backdrop-invert-[<value>]
backdrop-filter: invert(<value>);

Examples
Basic example
Use utilities like backdrop-invert and backdrop-invert-65 to control the color inversion of an element's backdrop:
backdrop-invert-0

backdrop-invert-65

backdrop-invert

<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-invert-0 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-invert-65 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-invert ..."></div>
</div>
Using a custom value
Use the backdrop-invert-[<value>] syntax to set the backdrop inversion based on a completely custom value:
<div class="backdrop-invert-[.25] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the backdrop-invert-(<custom-property>) syntax:
<div class="backdrop-invert-(--my-backdrop-inversion) ...">
 <!-- ... -->
</div>
This is just a shorthand for backdrop-invert-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a backdrop-filter: invert() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="backdrop-invert-0 md:backdrop-invert ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
hue-rotate
opacity
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
backdrop-filter: opacity()
Utilities for applying backdrop opacity filters to an element.
Class
Styles
backdrop-opacity-<number>
backdrop-filter: opacity(<number>%);
backdrop-opacity-(<custom-property>)
backdrop-filter: opacity(var(<custom-property>));
backdrop-opacity-[<value>]
backdrop-filter: opacity(<value>);

Examples
Basic example
Use utilities like backdrop-opacity-50 and backdrop-opacity-75 to control the opacity of all the backdrop filters applied to an element:
backdrop-opacity-10

backdrop-opacity-60

backdrop-opacity-95

<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-invert backdrop-opacity-10 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-invert backdrop-opacity-60 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-invert backdrop-opacity-95 ..."></div>
</div>
Using a custom value
Use the backdrop-opacity-[<value>] syntax to set the backdrop filter opacity based on a completely custom value:
<div class="backdrop-opacity-[.15] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the backdrop-opacity-(<custom-property>) syntax:
<div class="backdrop-opacity-(--my-backdrop-filter-opacity) ...">
 <!-- ... -->
</div>
This is just a shorthand for backdrop-opacity-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a backdrop-filter: opacity() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="backdrop-opacity-100 md:backdrop-opacity-60 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
invert
saturate
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
backdrop-filter: saturate()
Utilities for applying backdrop saturation filters to an element.
Class
Styles
backdrop-saturate-<number>
backdrop-filter: saturate(<number>%);
backdrop-saturate-(<custom-property>)
backdrop-filter: saturate(var(<custom-property>));
backdrop-saturate-[<value>]
backdrop-filter: saturate(<value>);

Examples
Basic example
Use utilities like backdrop-saturate-50 and backdrop-saturate-100 utilities to control the saturation of an element's backdrop:
backdrop-saturate-50

backdrop-saturate-125

backdrop-saturate-200

<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-saturate-50 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-saturate-125 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-saturate-200 ..."></div>
</div>
Using a custom value
Use the backdrop-saturate-[<value>] syntax to set the backdrop saturation based on a completely custom value:
<div class="backdrop-saturate-[.25] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the backdrop-saturate-(<custom-property>) syntax:
<div class="backdrop-saturate-(--my-backdrop-saturation) ...">
 <!-- ... -->
</div>
This is just a shorthand for backdrop-saturate-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a backdrop-filter: saturate() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="backdrop-saturate-50 md:backdrop-saturate-150 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
opacity
sepia
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Filters
backdrop-filter: sepia()
Utilities for applying backdrop sepia filters to an element.
Class
Styles
backdrop-sepia
backdrop-filter: sepia(100%);
backdrop-sepia-<number>
backdrop-filter: sepia(<number>%);
backdrop-sepia-(<custom-property>)
backdrop-filter: sepia(var(<custom-property>));
backdrop-sepia-[<value>]
backdrop-filter: sepia(<value>);

Examples
Basic example
Use utilities like backdrop-sepia and backdrop-sepia-50 to control the sepia effect applied to an element's backdrop:
backdrop-sepia-0

backdrop-sepia-50

backdrop-sepia

<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-sepia-0 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-sepia-50 ..."></div>
</div>
<div class="bg-[url(/img/mountains.jpg)]">
 <div class="bg-white/30 backdrop-sepia ..."></div>
</div>
Using a custom value
Use the backdrop-sepia-[<value>] syntax to set the backdrop sepia based on a completely custom value:
<div class="backdrop-sepia-[.25] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the backdrop-sepia-(<custom-property>) syntax:
<div class="backdrop-sepia-(--my-backdrop-sepia) ...">
 <!-- ... -->
</div>
This is just a shorthand for backdrop-sepia-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a backdrop-filter: sepia() utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="backdrop-sepia md:backdrop-sepia-0 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
saturate
border-collapse
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Tables
border-collapse
Utilities for controlling whether table borders should collapse or be separated.
Class
Styles
border-collapse
border-collapse: collapse;
border-separate
border-collapse: separate;

Examples
Collapsing table borders
Use the border-collapse utility to combine adjacent cell borders into a single border when possible:
State
City
Indiana
Indianapolis
Ohio
Columbus
Michigan
Detroit

<table class="border-collapse border border-gray-400 ...">
 <thead>
   <tr>
     <th class="border border-gray-300 ...">State</th>
     <th class="border border-gray-300 ...">City</th>
   </tr>
 </thead>
 <tbody>
   <tr>
     <td class="border border-gray-300 ...">Indiana</td>
     <td class="border border-gray-300 ...">Indianapolis</td>
   </tr>
   <tr>
     <td class="border border-gray-300 ...">Ohio</td>
     <td class="border border-gray-300 ...">Columbus</td>
   </tr>
   <tr>
     <td class="border border-gray-300 ...">Michigan</td>
     <td class="border border-gray-300 ...">Detroit</td>
   </tr>
 </tbody>
</table>
Note that this includes collapsing borders on the top-level <table> tag.
Separating table borders
Use the border-separate utility to force each cell to display its own separate borders:
State
City
Indiana
Indianapolis
Ohio
Columbus
Michigan
Detroit

<table class="border-separate border border-gray-400 ...">
 <thead>
   <tr>
     <th class="border border-gray-300 ...">State</th>
     <th class="border border-gray-300 ...">City</th>
   </tr>
 </thead>
 <tbody>
   <tr>
     <td class="border border-gray-300 ...">Indiana</td>
     <td class="border border-gray-300 ...">Indianapolis</td>
   </tr>
   <tr>
     <td class="border border-gray-300 ...">Ohio</td>
     <td class="border border-gray-300 ...">Columbus</td>
   </tr>
   <tr>
     <td class="border border-gray-300 ...">Michigan</td>
     <td class="border border-gray-300 ...">Detroit</td>
   </tr>
 </tbody>
</table>
Responsive design
Prefix a border-collapse utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<table class="border-collapse md:border-separate ...">
 <!-- ... -->
</table>
Learn more about using variants in the variants documentation.
sepia
border-spacing
On this page
Quick reference
Examples
Collapsing table borders
Separating table borders
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Tables
border-spacing
Utilities for controlling the spacing between table borders.
Class
Styles
border-spacing-<number>
border-spacing: calc(var(--spacing) * <number>);
border-spacing-(<custom-property>)
border-spacing: var(<custom-property>);
border-spacing-[<value>]
border-spacing: <value>;
border-spacing-x-<number>
border-spacing: calc(var(--spacing) * <number>) var(--tw-border-spacing-y);
border-spacing-x-(<custom-property>)
border-spacing: var(<custom-property>) var(--tw-border-spacing-y);
border-spacing-x-[<value>]
border-spacing: <value> var(--tw-border-spacing-y);
border-spacing-y-<number>
border-spacing: var(--tw-border-spacing-x) calc(var(--spacing) * <number>);
border-spacing-y-(<custom-property>)
border-spacing: var(--tw-border-spacing-x) var(<custom-property>);
border-spacing-y-[<value>]
border-spacing: var(--tw-border-spacing-x) <value>;

Examples
Basic example
Use border-spacing-<number> utilities like border-spacing-2 and border-spacing-x-3 to control the space between the borders of table cells with separate borders:
State
City
Indiana
Indianapolis
Ohio
Columbus
Michigan
Detroit

<table class="border-separate border-spacing-2 border border-gray-400 dark:border-gray-500">
 <thead>
   <tr>
     <th class="border border-gray-300 dark:border-gray-600">State</th>
     <th class="border border-gray-300 dark:border-gray-600">City</th>
   </tr>
 </thead>
 <tbody>
   <tr>
     <td class="border border-gray-300 dark:border-gray-700">Indiana</td>
     <td class="border border-gray-300 dark:border-gray-700">Indianapolis</td>
   </tr>
   <tr>
     <td class="border border-gray-300 dark:border-gray-700">Ohio</td>
     <td class="border border-gray-300 dark:border-gray-700">Columbus</td>
   </tr>
   <tr>
     <td class="border border-gray-300 dark:border-gray-700">Michigan</td>
     <td class="border border-gray-300 dark:border-gray-700">Detroit</td>
   </tr>
 </tbody>
</table>
Using a custom value
Use the border-spacing-[<value>] syntax to set the border spacing based on a completely custom value:
<table class="border-spacing-[7px] ...">
 <!-- ... -->
</table>
For CSS variables, you can also use the border-spacing-(<custom-property>) syntax:
<table class="border-spacing-(--my-border-spacing) ...">
 <!-- ... -->
</table>
This is just a shorthand for border-spacing-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a border-spacing utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<table class="border-spacing-2 md:border-spacing-4 ...">
 <!-- ... -->
</table>
Learn more about using variants in the variants documentation.
Customizing your theme
The border-spacing-<number> utilities are driven by the --spacing theme variable, which can be customized in your own theme:
@theme {
 --spacing: 1px;
}
Learn more about customizing the spacing scale in the theme variable documentation.
border-collapse
table-layout
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design
Customizing your theme

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Tables
table-layout
Utilities for controlling the table layout algorithm.
Class
Styles
table-auto
table-layout: auto;
table-fixed
table-layout: fixed;

Examples
Sizing columns automatically
Use the table-auto utility to automatically size table columns to fit the contents of its cells:
Song
Artist
Year
The Sliding Mr. Bones (Next Stop, Pottersville)
Malcolm Lockyer
1961
Witchy Woman
The Eagles
1972
Shining Star
Earth, Wind, and Fire
1975

<table class="table-auto">
 <thead>
   <tr>
     <th>Song</th>
     <th>Artist</th>
     <th>Year</th>
   </tr>
 </thead>
 <tbody>
   <tr>
     <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
     <td>Malcolm Lockyer</td>
     <td>1961</td>
   </tr>
   <tr>
     <td>Witchy Woman</td>
     <td>The Eagles</td>
     <td>1972</td>
   </tr>
   <tr>
     <td>Shining Star</td>
     <td>Earth, Wind, and Fire</td>
     <td>1975</td>
   </tr>
 </tbody>
</table>
Using fixed column widths
Use the table-fixed utility to ignore the content of the table cells and use fixed widths for each column:
Song
Artist
Year
The Sliding Mr. Bones (Next Stop, Pottersville)
Malcolm Lockyer
1961
Witchy Woman
The Eagles
1972
Shining Star
Earth, Wind, and Fire
1975

<table class="table-fixed">
 <thead>
   <tr>
     <th>Song</th>
     <th>Artist</th>
     <th>Year</th>
   </tr>
 </thead>
 <tbody>
   <tr>
     <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
     <td>Malcolm Lockyer</td>
     <td>1961</td>
   </tr>
   <tr>
     <td>Witchy Woman</td>
     <td>The Eagles</td>
     <td>1972</td>
   </tr>
   <tr>
     <td>Shining Star</td>
     <td>Earth, Wind, and Fire</td>
     <td>1975</td>
   </tr>
 </tbody>
</table>
You can manually set the widths for some columns and the rest of the available width will be divided evenly amongst columns without an explicit width. The widths set in the first row will set the column width for the whole table.
Responsive design
Prefix a table-layout utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="table-auto md:table-fixed ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
border-spacing
caption-side
On this page
Quick reference
Examples
Sizing columns automatically
Using fixed column widths
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Tables
caption-side
Utilities for controlling the alignment of a caption element inside of a table.
Class
Styles
caption-top
caption-side: top;
caption-bottom
caption-side: bottom;

Examples
Placing at top of table
Use the caption-top utility to position a caption element at the top of a table:
Wrestler
Signature Move(s)
"Stone Cold" Steve Austin
Stone Cold Stunner, Lou Thesz Press
Bret "The Hitman" Hart
The Sharpshooter
Razor Ramon
Razor's Edge, Fallaway Slam

<table>
 <caption class="caption-top">
   Table 3.1: Professional wrestlers and their signature moves.
 </caption>
 <thead>
   <tr>
     <th>Wrestler</th>
     <th>Signature Move(s)</th>
   </tr>
 </thead>
 <tbody>
   <tr>
     <td>"Stone Cold" Steve Austin</td>
     <td>Stone Cold Stunner, Lou Thesz Press</td>
   </tr>
   <tr>
     <td>Bret "The Hitman" Hart</td>
     <td>The Sharpshooter</td>
   </tr>
   <tr>
     <td>Razor Ramon</td>
     <td>Razor's Edge, Fallaway Slam</td>
   </tr>
 </tbody>
</table>
Placing at bottom of table
Use the caption-bottom utility to position a caption element at the bottom of a table:
Wrestler
Signature Move(s)
"Stone Cold" Steve Austin
Stone Cold Stunner, Lou Thesz Press
Bret "The Hitman" Hart
The Sharpshooter
Razor Ramon
Razor's Edge, Fallaway Slam

<table>
 <caption class="caption-bottom">
   Table 3.1: Professional wrestlers and their signature moves.
 </caption>
 <thead>
   <tr>
     <th>Wrestler</th>
     <th>Signature Move(s)</th>
   </tr>
 </thead>
 <tbody>
   <tr>
     <td>"Stone Cold" Steve Austin</td>
     <td>Stone Cold Stunner, Lou Thesz Press</td>
   </tr>
   <tr>
     <td>Bret "The Hitman" Hart</td>
     <td>The Sharpshooter</td>
   </tr>
   <tr>
     <td>Razor Ramon</td>
     <td>Razor's Edge, Fallaway Slam</td>
   </tr>
 </tbody>
</table>
Responsive design
Prefix a caption-side utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<caption class="caption-top md:caption-bottom ...">
 <!-- ... -->
</caption>
Learn more about using variants in the variants documentation.
table-layout
transition-property
On this page
Quick reference
Examples
Placing at top of table
Placing at bottom of table
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transitions & Animation
transition-property
Utilities for controlling which CSS properties transition.
Class
Styles
transition
transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter;
transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */
transition-duration: var(--default-transition-duration); /* 150ms */
transition-all
transition-property: all;
transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */
transition-duration: var(--default-transition-duration); /* 150ms */
transition-colors
transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;
transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */
transition-duration: var(--default-transition-duration); /* 150ms */
transition-opacity
transition-property: opacity;
transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */
transition-duration: var(--default-transition-duration); /* 150ms */
transition-shadow
transition-property: box-shadow;
transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */
transition-duration: var(--default-transition-duration); /* 150ms */
transition-transform
transition-property: transform, translate, scale, rotate;
transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */
transition-duration: var(--default-transition-duration); /* 150ms */
transition-none
transition-property: none;
transition-(<custom-property>)
transition-property: var(<custom-property>);
transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */
transition-duration: var(--default-transition-duration); /* 150ms */
transition-[<value>]
transition-property: <value>;
transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */
transition-duration: var(--default-transition-duration); /* 150ms */

Examples
Basic example
Use utilities like transition and transition-colors to specify which properties should transition when they change:
Hover the button to see the expected behavior
Save Changes
<button class="bg-blue-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 ...">
 Save Changes
</button>
Supporting reduced motion
For situations where the user has specified that they prefer reduced motion, you can conditionally apply animations and transitions using the motion-safe and motion-reduce variants:
<button class="transform transition hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none ...">
 <!-- ... -->
</button>
Using a custom value
Use the transition-[<value>] syntax to set the transition properties based on a completely custom value:
<button class="transition-[height] ...">
 <!-- ... -->
</button>
For CSS variables, you can also use the transition-(<custom-property>) syntax:
<button class="transition-(--my-properties) ...">
 <!-- ... -->
</button>
This is just a shorthand for transition-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a transition-property utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<button class="transition-none md:transition-all ...">
 <!-- ... -->
</button>
Learn more about using variants in the variants documentation.
caption-side
transition-behavior
On this page
Quick reference
Examples
Basic example
Supporting reduced motion
Using a custom value
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transitions & Animation
transition-behavior
Utilities to control the behavior of CSS transitions.
Class
Styles
transition-normal
transition-behavior: normal;
transition-discrete
transition-behavior: allow-discrete;

Examples
Basic example
Use the transition-discrete utility to start transitions when changing properties with a discrete set of values, such as elements that change from hidden to block:
Interact with the checkboxes to see the expected behavior
I hide
I fade out
<label class="peer ...">
 <input type="checkbox" checked />
</label>
<button class="hidden transition-all not-peer-has-checked:opacity-0 peer-has-checked:block ...">
 I hide
</button>
<label class="peer ...">
 <input type="checkbox" checked />
</label>
<button class="hidden transition-all transition-discrete not-peer-has-checked:opacity-0 peer-has-checked:block ...">
 I fade out
</button>
Responsive design
Prefix a transition-behavior utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<button class="transition-discrete md:transition-normal ...">
 <!-- ... -->
</button>
Learn more about using variants in the variants documentation.
transition-property
transition-duration
On this page
Quick reference
Examples
Basic example
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transitions & Animation
transition-duration
Utilities for controlling the duration of CSS transitions.
Class
Styles
duration-<number>
transition-duration: <number>ms;
duration-initial
transition-duration: initial;
duration-(<custom-property>)
transition-duration: var(<custom-property>);
duration-[<value>]
transition-duration: <value>;

Examples
Basic example
Use utilities like duration-150 and duration-700 to set the transition duration of an element in milliseconds:
Hover each button to see the expected behavior
duration-150
Button A
duration-300
Button B
duration-700
Button C
<button class="transition duration-150 ease-in-out ...">Button A</button>
<button class="transition duration-300 ease-in-out ...">Button B</button>
<button class="transition duration-700 ease-in-out ...">Button C</button>
Using a custom value
Use the duration-[<value>] syntax to set the transition duration based on a completely custom value:
<button class="duration-[1s,15s] ...">
 <!-- ... -->
</button>
For CSS variables, you can also use the duration-(<custom-property>) syntax:
<button class="duration-(--my-duration) ...">
 <!-- ... -->
</button>
This is just a shorthand for duration-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a transition-duration utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<button class="duration-0 md:duration-150 ...">
 <!-- ... -->
</button>
Learn more about using variants in the variants documentation.
transition-behavior
transition-timing-function
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transitions & Animation
transition-timing-function
Utilities for controlling the easing of CSS transitions.
Class
Styles
ease-linear
transition-timing-function: linear;
ease-in
transition-timing-function: var(--ease-in); /* cubic-bezier(0.4, 0, 1, 1) */
ease-out
transition-timing-function: var(--ease-out); /* cubic-bezier(0, 0, 0.2, 1) */
ease-in-out
transition-timing-function: var(--ease-in-out); /* cubic-bezier(0.4, 0, 0.2, 1) */
ease-initial
transition-timing-function: initial;
ease-(<custom-property>)
transition-timing-function: var(<custom-property>);
ease-[<value>]
transition-timing-function: <value>;

Examples
Basic example
Use utilities like ease-in and ease-out to control the easing curve of an element's transition:
Hover each button to see the expected behavior
ease-in
Button A
ease-out
Button B
ease-in-out
Button C
<button class="duration-300 ease-in ...">Button A</button>
<button class="duration-300 ease-out ...">Button B</button>
<button class="duration-300 ease-in-out ...">Button C</button>
Using a custom value
Use the ease-[<value>] syntax to set the transition timing function based on a completely custom value:
<button class="ease-[cubic-bezier(0.95,0.05,0.795,0.035)] ...">
 <!-- ... -->
</button>
For CSS variables, you can also use the ease-(<custom-property>) syntax:
<button class="ease-(--my-ease) ...">
 <!-- ... -->
</button>
This is just a shorthand for ease-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a transition-timing-function utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<button class="ease-out md:ease-in ...">
 <!-- ... -->
</button>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --ease-* theme variables to customize the transition timing function utilities in your project:
@theme {
 --ease-in-expo: cubic-bezier(0.95, 0.05, 0.795, 0.035);
}
Now the ease-in-expo utility can be used in your markup:
<button class="ease-in-expo">
 <!-- ... -->
</button>
Learn more about customizing your theme in the theme documentation.
transition-duration
transition-delay
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design
Customizing your theme

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transitions & Animation
transition-delay
Utilities for controlling the delay of CSS transitions.
Class
Styles
delay-<number>
transition-delay: <number>ms;
delay-(<custom-property>)
transition-delay: var(<custom-property>);
delay-[<value>]
transition-delay: <value>;

Examples
Basic example
Use utilities like delay-150 and delay-700 to set the transition delay of an element in milliseconds:
Hover each button to see the expected behavior
delay-150
Button A
delay-300
Button B
delay-700
Button C
<button class="transition delay-150 duration-300 ease-in-out ...">Button A</button>
<button class="transition delay-300 duration-300 ease-in-out ...">Button B</button>
<button class="transition delay-700 duration-300 ease-in-out ...">Button C</button>
Using a custom value
Use the delay-[<value>] syntax to set the transition delay based on a completely custom value:
<button class="delay-[1s,250ms] ...">
 <!-- ... -->
</button>
For CSS variables, you can also use the delay-(<custom-property>) syntax:
<button class="delay-(--my-delay) ...">
 <!-- ... -->
</button>
This is just a shorthand for delay-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a transition-delay utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<button class="delay-150 md:delay-300 ...">
 <!-- ... -->
</button>
Learn more about using variants in the variants documentation.
transition-timing-function
animation
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transitions & Animation
animation
Utilities for animating elements with CSS animations.
Class
Styles
animate-spin
animation: var(--animate-spin); /* spin 1s linear infinite */

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
animate-ping
animation: var(--animate-ping); /* ping 1s cubic-bezier(0, 0, 0.2, 1) infinite */

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
animate-pulse
animation: var(--animate-pulse); /* pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite */

@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}
animate-bounce
animation: var(--animate-bounce); /* bounce 1s infinite */

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
animate-none
animation: none;
animate-(<custom-property>)
animation: var(<custom-property>);
animate-[<value>]
animation: <value>;

Examples
Adding a spin animation
Use the animate-spin utility to add a linear spin animation to elements like loading indicators:
Processing…
<button type="button" class="bg-indigo-500 ..." disabled>
 <svg class="mr-3 size-5 animate-spin ..." viewBox="0 0 24 24">
   <!-- ... -->
 </svg>
 Processing…
</button>
Adding a ping animation
Use the animate-ping utility to make an element scale and fade like a radar ping or ripple of water—useful for things like notification badges:
Transactions
<span class="relative flex size-3">
 <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
 <span class="relative inline-flex size-3 rounded-full bg-sky-500"></span>
</span>
Adding a pulse animation
Use the animate-pulse utility to make an element gently fade in and out—useful for things like skeleton loaders:
<div class="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
 <div class="flex animate-pulse space-x-4">
   <div class="size-10 rounded-full bg-gray-200"></div>
   <div class="flex-1 space-y-6 py-1">
     <div class="h-2 rounded bg-gray-200"></div>
     <div class="space-y-3">
       <div class="grid grid-cols-3 gap-4">
         <div class="col-span-2 h-2 rounded bg-gray-200"></div>
         <div class="col-span-1 h-2 rounded bg-gray-200"></div>
       </div>
       <div class="h-2 rounded bg-gray-200"></div>
     </div>
   </div>
 </div>
</div>
Adding a bounce animation
Use the animate-bounce utility to make an element bounce up and down—useful for things like "scroll down" indicators:
<svg class="size-6 animate-bounce ...">
 <!-- ... -->
</svg>
Supporting reduced motion
For situations where the user has specified that they prefer reduced motion, you can conditionally apply animations and transitions using the motion-safe and motion-reduce variants:
<button type="button" class="bg-indigo-600 ..." disabled>
 <svg class="mr-3 size-5 motion-safe:animate-spin ..." viewBox="0 0 24 24">
   <!-- ... -->
 </svg>
 Processing
</button>
Using a custom value
Use the animate-[<value>] syntax to set the animation based on a completely custom value:
<div class="animate-[wiggle_1s_ease-in-out_infinite] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the animate-(<custom-property>) syntax:
<div class="animate-(--my-animation) ...">
 <!-- ... -->
</div>
This is just a shorthand for animate-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix an animation utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="animate-none md:animate-spin ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --animate-* theme variables to customize the animation utilities in your project:
@theme {
 --animate-wiggle: wiggle 1s ease-in-out infinite;
 @keyframes wiggle {
   0%,
   100% {
     transform: rotate(-3deg);
   }
   50% {
     transform: rotate(3deg);
   }
 }
}
Now the animate-wiggle utility can be used in your markup:
<div class="animate-wiggle">
 <!-- ... -->
</div>
Learn more about customizing your theme in the theme documentation.
transition-delay
backface-visibility
On this page
Quick reference
Examples
Adding a spin animation
Adding a ping animation
Adding a pulse animation
Adding a bounce animation
Supporting reduced motion
Using a custom value
Responsive design
Customizing your theme

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

backface-visibility
Utilities for controlling if an element's backface is visible.
Class
Styles
backface-hidden
backface-visibility: hidden;
backface-visible
backface-visibility: visible;

Examples
Basic example
Use the backface-visible utility to show the backface of an element, like a cube, even when it's rotated away from view:
backface-hidden
1
2
3
4
5
6
backface-visible
1
2
3
4
5
6
<div class="size-20 ...">
 <div class="translate-z-12 rotate-x-0 bg-sky-300/75 backface-hidden ...">1</div>
 <div class="-translate-z-12 rotate-y-18 bg-sky-300/75 backface-hidden ...">2</div>
 <div class="translate-x-12 rotate-y-90 bg-sky-300/75 backface-hidden ...">3</div>
 <div class="-translate-x-12 -rotate-y-90 bg-sky-300/75 backface-hidden ...">4</div>
 <div class="-translate-y-12 rotate-x-90 bg-sky-300/75 backface-hidden ...">5</div>
 <div class="translate-y-12 -rotate-x-90 bg-sky-300/75 backface-hidden ...">6</div>
</div>
<div class="size-20 ...">
 <div class="translate-z-12 rotate-x-0 bg-sky-300/75 backface-visible ...">1</div>
 <div class="-translate-z-12 rotate-y-18 bg-sky-300/75 backface-visible ...">2</div>
 <div class="translate-x-12 rotate-y-90 bg-sky-300/75 backface-visible ...">3</div>
 <div class="-translate-x-12 -rotate-y-90 bg-sky-300/75 backface-visible ...">4</div>
 <div class="-translate-y-12 rotate-x-90 bg-sky-300/75 backface-visible ...">5</div>
 <div class="translate-y-12 -rotate-x-90 bg-sky-300/75 backface-visible ...">6</div>
</div>
Responsive design
Prefix a backface-visibility utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="backface-visible md:backface-hidden ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
animation
perspective
On this page
Quick reference
Examples
Basic example
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transforms
perspective
Utilities for controlling an element's perspective when placed in 3D space.
Class
Styles
perspective-dramatic
perspective: var(--perspective-dramatic); /* 100px */
perspective-near
perspective: var(--perspective-near); /* 300px */
perspective-normal
perspective: var(--perspective-normal); /* 500px */
perspective-midrange
perspective: var(--perspective-midrange); /* 800px */
perspective-distant
perspective: var(--perspective-distant); /* 1200px */
perspective-none
perspective: none;
perspective-(<custom-property>)
perspective: var(<custom-property>);
perspective-[<value>]
perspective: <value>;

Examples
Basic example
Use utilities like perspective-normal and perspective-distant to control how close or how far away the z-plane is from the screen:
perspective-dramatic
1
2
3
4
5
6
perspective-normal
1
2
3
4
5
6
<div class="size-20 perspective-dramatic ...">
 <div class="translate-z-12 rotate-x-0 bg-sky-300/75 ...">1</div>
 <div class="-translate-z-12 rotate-y-18 bg-sky-300/75 ...">2</div>
 <div class="translate-x-12 rotate-y-90 bg-sky-300/75 ...">3</div>
 <div class="-translate-x-12 -rotate-y-90 bg-sky-300/75 ...">4</div>
 <div class="-translate-y-12 rotate-x-90 bg-sky-300/75 ...">5</div>
 <div class="translate-y-12 -rotate-x-90 bg-sky-300/75 ...">6</div>
</div>
<div class="size-20 perspective-normal ...">
 <div class="translate-z-12 rotate-x-0 bg-sky-300/75 ...">1</div>
 <div class="-translate-z-12 rotate-y-18 bg-sky-300/75 ...">2</div>
 <div class="translate-x-12 rotate-y-90 bg-sky-300/75 ...">3</div>
 <div class="-translate-x-12 -rotate-y-90 bg-sky-300/75 ...">4</div>
 <div class="-translate-y-12 rotate-x-90 bg-sky-300/75 ...">5</div>
 <div class="translate-y-12 -rotate-x-90 bg-sky-300/75 ...">6</div>
</div>
This is like moving a camera closer to or further away from an object.
Removing a perspective
Use the perspective-none utility to remove a perspective transform from an element:
<div class="perspective-none ...">
 <!-- ... -->
</div>
Using a custom value
Use the perspective-[<value>] syntax to set the perspective based on a completely custom value:
<div class="perspective-[750px] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the perspective-(<custom-property>) syntax:
<div class="perspective-(--my-perspective) ...">
 <!-- ... -->
</div>
This is just a shorthand for perspective-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a perspective utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="perspective-midrange md:perspective-dramatic ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --perspective-* theme variables to customize the perspective utilities in your project:
@theme {
 --perspective-remote: 1800px;
}
Now the perspective-remote utility can be used in your markup:
<div class="perspective-remote">
 <!-- ... -->
</div>
Learn more about customizing your theme in the theme documentation.
backface-visibility
perspective-origin
On this page
Quick reference
Examples
Basic example
Removing a perspective
Using a custom value
Responsive design
Customizing your theme

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transforms
perspective-origin
Utilities for controlling an element's perspective origin when placed in 3D space.
Class
Styles
perspective-origin-center
perspective-origin: center;
perspective-origin-top
perspective-origin: top;
perspective-origin-top-right
perspective-origin: top right;
perspective-origin-right
perspective-origin: right;
perspective-origin-bottom-right
perspective-origin: bottom right;
perspective-origin-bottom
perspective-origin: bottom;
perspective-origin-bottom-left
perspective-origin: bottom left;
perspective-origin-left
perspective-origin: left;
perspective-origin-top-left
perspective-origin: top left;
perspective-origin-(<custom-property>)
perspective-origin: var(<custom-property>);
perspective-origin-[<value>]
perspective-origin: <value>;

Examples
Basic example
Use utilities like perspective-origin-top and perspective-origin-bottom-left to control where the vanishing point of a perspective is located:
perspective-origin-top-left
1
2
3
4
5
6
perspective-origin-bottom-right
1
2
3
4
5
6
<div class="size-20 perspective-near perspective-origin-top-left ...">
 <div class="translate-z-12 rotate-x-0 bg-sky-300/75 ...">1</div>
 <div class="-translate-z-12 rotate-y-18 bg-sky-300/75 ...">2</div>
 <div class="translate-x-12 rotate-y-90 bg-sky-300/75 ...">3</div>
 <div class="-translate-x-12 -rotate-y-90 bg-sky-300/75 ...">4</div>
 <div class="-translate-y-12 rotate-x-90 bg-sky-300/75 ...">5</div>
 <div class="translate-y-12 -rotate-x-90 bg-sky-300/75 ...">6</div>
</div>
<div class="size-20 perspective-near perspective-origin-bottom-right …">
 <div class="translate-z-12 rotate-x-0 bg-sky-300/75 ...">1</div>
 <div class="-translate-z-12 rotate-y-18 bg-sky-300/75 ...">2</div>
 <div class="translate-x-12 rotate-y-90 bg-sky-300/75 ...">3</div>
 <div class="-translate-x-12 -rotate-y-90 bg-sky-300/75 ...">4</div>
 <div class="-translate-y-12 rotate-x-90 bg-sky-300/75 ...">5</div>
 <div class="translate-y-12 -rotate-x-90 bg-sky-300/75 ...">6</div>
</div>
Using a custom value
Use the perspective-origin-[<value>] syntax to set the perspective origin based on a completely custom value:
<div class="perspective-origin-[200%_150%] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the perspective-origin-(<custom-property>) syntax:
<div class="perspective-origin-(--my-perspective-origin) ...">
 <!-- ... -->
</div>
This is just a shorthand for perspective-origin-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a perspective-origin utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="perspective-origin-center md:perspective-origin-bottom-left ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
perspective
rotate
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transforms
rotate
Utilities for rotating elements.
Class
Styles
rotate-none
rotate: none;
rotate-<number>
rotate: <number>deg;
-rotate-<number>
rotate: calc(<number>deg * -1);
rotate-(<custom-property>)
rotate: var(<custom-property>);
rotate-[<value>]
rotate: <value>;
rotate-x-<number>
transform: rotateX(<number>deg) var(--tw-rotate-y);
-rotate-x-<number>
transform: rotateX(-<number>deg) var(--tw-rotate-y);
rotate-x-(<custom-property>)
transform: rotateX(var(<custom-property>)) var(--tw-rotate-y);
rotate-x-[<value>]
transform: rotateX(<value>) var(--tw-rotate-y);
rotate-y-<number>
transform: var(--tw-rotate-x) rotateY(<number>deg);
-rotate-y-<number>
transform: var(--tw-rotate-x) rotateY(-<number>deg);
rotate-y-(<custom-property>)
transform: var(--tw-rotate-x) rotateY(var(<custom-property>));
rotate-y-[<value>]
transform: var(--tw-rotate-x) rotateY(<value>);
rotate-z-<number>
transform: var(--tw-rotate-x) var(--tw-rotate-y) rotateZ(<number>deg);
-rotate-z-<number>
transform: var(--tw-rotate-x) var(--tw-rotate-y) rotateZ(-<number>deg);
rotate-z-(<custom-property>)
transform: var(--tw-rotate-x) var(--tw-rotate-y) rotateZ(var(<custom-property>));
rotate-z-[<value>]
transform: var(--tw-rotate-x) var(--tw-rotate-y) rotateZ(<value>);

Show less
Examples
Basic example
Use rotate-<number> utilities like rotate-45 and rotate-90 to rotate an element by degrees:
rotate-45


rotate-90


rotate-210


<img class="rotate-45 ..." src="/img/mountains.jpg" />
<img class="rotate-90 ..." src="/img/mountains.jpg" />
<img class="rotate-210 ..." src="/img/mountains.jpg" />
Using negative values
Use -rotate-<number> utilities like -rotate-45 and -rotate-90 to rotate an element counterclockwise by degrees:
-rotate-45


-rotate-90


-rotate-210


<img class="-rotate-45 ..." src="/img/mountains.jpg" />
<img class="-rotate-90 ..." src="/img/mountains.jpg" />
<img class="-rotate-210 ..." src="/img/mountains.jpg" />
Rotating in 3D space
Use rotate-x-<number>, rotate-y-<number>, and rotate-z-<number> utilities like rotate-x-50, -rotate-y-30, and rotate-z-45 together to rotate an element in 3D space:
rotate-x-50
rotate-z-45


rotate-x-15
-rotate-y-30


rotate-y-25
rotate-z-30


<img class="rotate-x-50 rotate-z-45 ..." src="/img/mountains.jpg" />
<img class="rotate-x-15 -rotate-y-30 ..." src="/img/mountains.jpg" />
<img class="rotate-y-25 rotate-z-30 ..." src="/img/mountains.jpg" />
Using a custom value
Use the rotate-[<value>] syntax to set the rotation based on a completely custom value:
<img class="rotate-[3.142rad] ..." src="/img/mountains.jpg" />
For CSS variables, you can also use the rotate-(<custom-property>) syntax:
<img class="rotate-(--my-rotation) ..." src="/img/mountains.jpg" />
This is just a shorthand for rotate-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a rotate utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<img class="rotate-45 md:rotate-60 ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
perspective-origin
scale
On this page
Quick reference
Examples
Basic example
Using negative values
Rotating in 3D space
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transforms
scale
Utilities for scaling elements.
Class
Styles
scale-none
scale: none;
scale-<number>
scale: <number>% <number>%;
-scale-<number>
scale: calc(<number>% * -1) calc(<number>% * -1);
scale-(<custom-property>)
scale: var(<custom-property>) var(<custom-property>);
scale-[<value>]
scale: <value>;
scale-x-<number>
scale: <number>% var(--tw-scale-y);
-scale-x-<number>
scale: calc(<number>% * -1) var(--tw-scale-y);
scale-x-(<custom-property>)
scale: var(<custom-property>) var(--tw-scale-y);
scale-x-[<value>]
scale: <value> var(--tw-scale-y);
scale-y-<number>
scale: var(--tw-scale-x) <number>%;

































Show more
Examples
Basic example
Use scale-<number> utilities like scale-75 and scale-150 to scale an element by a percentage of its original size:
scale-75


scale-100


scale-125


<img class="scale-75 ..." src="/img/mountains.jpg" />
<img class="scale-100 ..." src="/img/mountains.jpg" />
<img class="scale-125 ..." src="/img/mountains.jpg" />
Scaling on the x-axis
Use the scale-x-<number> utilities like scale-x-75 and -scale-x-150 to scale an element on the x-axis by a percentage of its original width:
scale-x-75


scale-x-100


scale-x-125


<img class="scale-x-75 ..." src="/img/mountains.jpg" />
<img class="scale-x-100 ..." src="/img/mountains.jpg" />
<img class="scale-x-125 ..." src="/img/mountains.jpg" />
Scaling on the y-axis
Use the scale-y-<number> utilities like scale-y-75 and -scale-y-150 to scale an element on the y-axis by a percentage of its original height:
scale-y-75


scale-y-100


scale-y-125


<img class="scale-y-75 ..." src="/img/mountains.jpg" />
<img class="scale-y-100 ..." src="/img/mountains.jpg" />
<img class="scale-y-125 ..." src="/img/mountains.jpg" />
Using negative values
Use -scale-<number>, -scale-x-<number> or -scale-y-<number> utilities like -scale-x-75 and -scale-125 to mirror and scale down an element by a percentage of its original size:
-scale-x-75


-scale-100


-scale-y-125


<img class="-scale-x-75 ..." src="/img/mountains.jpg" />
<img class="-scale-100 ..." src="/img/mountains.jpg" />
<img class="-scale-y-125 ..." src="/img/mountains.jpg" />
Using a custom value
Use the scale-[<value>] syntax to set the scale based on a completely custom value:
<img class="scale-[1.7] ..." src="/img/mountains.jpg" />
For CSS variables, you can also use the scale-(<custom-property>) syntax:
<img class="scale-(--my-scale) ..." src="/img/mountains.jpg" />
This is just a shorthand for scale-[var(<custom-property>)] that adds the var() function for you automatically.
Applying on hover
Prefix a scale utility with a variant like hover:* to only apply the utility in that state:
<img class="scale-95 hover:scale-120 ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
rotate
skew
On this page
Quick reference
Examples
Basic example
Scaling on the x-axis
Scaling on the y-axis
Using negative values
Using a custom value
Applying on hover

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transforms
skew
Utilities for skewing elements with transform.
Class
Styles
skew-<number>
transform: skewX(<number>deg) skewY(<number>deg);
-skew-<number>
transform: skewX(-<number>deg) skewY(-<number>deg);
skew-(<custom-property>)
transform: skewX(var(<custom-property>)) skewY(var(<custom-property>));
skew-[<value>]
transform: skewX(<value>) skewY(<value>);
skew-x-<number>
transform: skewX(<number>deg));
-skew-x-<number>
transform: skewX(-<number>deg));
skew-x-(<custom-property>)
transform: skewX(var(<custom-property>));
skew-x-[<value>]
transform: skewX(<value>));
skew-y-<number>
transform: skewY(<number>deg);
-skew-y-<number>
transform: skewY(-<number>deg);
skew-y-(<custom-property>)
transform: skewY(var(<custom-property>));
skew-y-[<value>]
transform: skewY(<value>);

Examples
Basic example
Use skew-<number> utilities like skew-4 and skew-10 to skew an element on both axes:
skew-3


skew-6


skew-12


<img class="skew-3 ..." src="/img/mountains.jpg" />
<img class="skew-6 ..." src="/img/mountains.jpg" />
<img class="skew-12 ..." src="/img/mountains.jpg" />
Using negative values
Use -skew-<number> utilities like -skew-4 and -skew-10 to skew an element on both axes:
-skew-3


-skew-6


-skew-12


<img class="-skew-3 ..." src="/img/mountains.jpg" />
<img class="-skew-6 ..." src="/img/mountains.jpg" />
<img class="-skew-12 ..." src="/img/mountains.jpg" />
Skewing on the x-axis
Use skew-x-<number> utilities like skew-x-4 and -skew-x-10 to skew an element on the x-axis:
-skew-x-12


skew-x-6


skew-x-12


<img class="-skew-x-12 ..." src="/img/mountains.jpg" />
<img class="skew-x-6 ..." src="/img/mountains.jpg" />
<img class="skew-x-12 ..." src="/img/mountains.jpg" />
Skewing on the y-axis
Use skew-y-<number> utilities like skew-y-4 and -skew-y-10 to skew an element on the y-axis:
-skew-y-12


skew-y-6


skew-y-12


<img class="-skew-y-12 ..." src="/img/mountains.jpg" />
<img class="skew-y-6 ..." src="/img/mountains.jpg" />
<img class="skew-y-12 ..." src="/img/mountains.jpg" />
Using a custom value
Use the skew-[<value>] syntax to set the skew based on a completely custom value:
<img class="skew-[3.142rad] ..." src="/img/mountains.jpg" />
For CSS variables, you can also use the skew-(<custom-property>) syntax:
<img class="skew-(--my-skew) ..." src="/img/mountains.jpg" />
This is just a shorthand for skew-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix skewX() and skewY() utilities with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<img class="skew-3 md:skew-12 ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
scale
transform
On this page
Quick reference
Examples
Basic example
Using negative values
Skewing on the x-axis
Skewing on the y-axis
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transforms
transform
Utilities for transforming elements.
Class
Styles
transform-(<custom-property>)
transform: var(<custom-property>);
transform-[<value>]
transform: <value>;
transform-none
transform: none;
transform-gpu
transform: translateZ(0) var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
transform-cpu
transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);

Examples
Hardware acceleration
If your transition performs better when rendered by the GPU instead of the CPU, you can force hardware acceleration by adding the transform-gpu utility:
<div class="scale-150 transform-gpu">
 <!-- ... -->
</div>
Use the transform-cpu utility to force things back to the CPU if you need to undo this conditionally.
Removing transforms
Use the transform-none utility to remove all of the transforms on an element at once:
<div class="skew-y-3 md:transform-none">
 <!-- ... -->
</div>
Using a custom value
Use the transform-[<value>] syntax to set the transform based on a completely custom value:
<div class="transform-[matrix(1,2,3,4,5,6)] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the transform-(<custom-property>) syntax:
<div class="transform-(--my-transform) ...">
 <!-- ... -->
</div>
This is just a shorthand for transform-[var(<custom-property>)] that adds the var() function for you automatically.
skew
transform-origin
On this page
Quick reference
Examples
Hardware acceleration
Removing transforms
Using a custom value

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transforms
transform-origin
Utilities for specifying the origin for an element's transformations.
Class
Styles
origin-center
transform-origin: center;
origin-top
transform-origin: top;
origin-top-right
transform-origin: top right;
origin-right
transform-origin: right;
origin-bottom-right
transform-origin: bottom right;
origin-bottom
transform-origin: bottom;
origin-bottom-left
transform-origin: bottom left;
origin-left
transform-origin: left;
origin-top-left
transform-origin: top left;
origin-(<custom-property>)
transform-origin: var(<custom-property>);
origin-[<value>]
transform-origin: <value>;

Examples
Basic example
Use utilities like origin-top and origin-bottom-left to set an element's transform origin:
origin-center


origin-top-left


origin-bottom


<img class="origin-center rotate-45 ..." src="/img/mountains.jpg" />
<img class="origin-top-left rotate-12 ..." src="/img/mountains.jpg" />
<img class="origin-bottom -rotate-12 ..." src="/img/mountains.jpg" />
Using a custom value
Use the origin-[<value>] syntax to set the transform origin based on a completely custom value:
<img class="origin-[33%_75%] ..." src="/img/mountains.jpg" />
For CSS variables, you can also use the origin-(<custom-property>) syntax:
<img class="origin-(--my-transform-origin) ..." src="/img/mountains.jpg" />
This is just a shorthand for origin-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a transform-origin utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<img class="origin-center md:origin-top ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
transform
transform-style
On this page
Quick reference
Examples
Basic example
Using a custom value
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transforms
transform-style
Utilities for controlling if an elements children are placed in 3D space.
Class
Styles
transform-3d
transform-style: preserve-3d;
transform-flat
transform-style: flat;

Examples
Basic example
Use transform-3d to position children in 3D space:
transform-flat
1
2
3
4
5
6
transform-3d
1
2
3
4
5
6
<div class="size-20 transform-flat ...">
 <div class="translate-z-12 rotate-x-0 bg-sky-300/75 ...">1</div>
 <div class="-translate-z-12 rotate-y-18 bg-sky-300/75 ...">2</div>
 <div class="translate-x-12 rotate-y-90 bg-sky-300/75 ...">3</div>
 <div class="-translate-x-12 -rotate-y-90 bg-sky-300/75 ...">4</div>
 <div class="-translate-y-12 rotate-x-90 bg-sky-300/75 ...">5</div>
 <div class="translate-y-12 -rotate-x-90 bg-sky-300/75 ...">6</div>
</div>
<div class="size-20 transform-3d ...">
 <div class="translate-z-12 rotate-x-0 bg-sky-300/75 ...">1</div>
 <div class="-translate-z-12 rotate-y-18 bg-sky-300/75 ...">2</div>
 <div class="translate-x-12 rotate-y-90 bg-sky-300/75 ...">3</div>
 <div class="-translate-x-12 -rotate-y-90 bg-sky-300/75 ...">4</div>
 <div class="-translate-y-12 rotate-x-90 bg-sky-300/75 ...">5</div>
 <div class="translate-y-12 -rotate-x-90 bg-sky-300/75 ...">6</div>
</div>
Without this, any children will only be transformed in 2D space and not in 3D space.
Responsive design
Prefix a transform-style utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="transform-3d md:transform-flat ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
transform-origin
translate
On this page
Quick reference
Examples
Basic example
Responsive design

5-day mini-course
Build UIs that don’t suck.
Short, tactical video lessons from the creator of Tailwind CSS, delivered directly to your inbox every day for a week.
Get the free course →
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Transforms
translate
Utilities for translating elements.
Class
Styles
translate-<number>
translate: calc(var(--spacing) * <number>) calc(var(--spacing) * <number>);
-translate-<number>
translate: calc(var(--spacing) * -<number>) calc(var(--spacing) * -<number>);
translate-<fraction>
translate: calc(<fraction> * 100%) calc(<fraction> * 100%);
-translate-<fraction>
translate: calc(<fraction> * -100%) calc(<fraction> * -100%);
translate-full
translate: 100% 100%;
-translate-full
translate: -100% -100%;
translate-px
translate: 1px 1px;
-translate-px
translate: -1px -1px;
translate-(<custom-property>)
translate: var(<custom-property>) var(<custom-property>);
translate-[<value>]
translate: <value> <value>;













































































































Show more
Examples
Using the spacing scale
Use translate-<number> utilities like translate-2 and -translate-4 to translate an element on both axes based on the spacing scale:
-translate-6


translate-2


translate-8


<img class="-translate-6 ..." src="/img/mountains.jpg" />
<img class="translate-2 ..." src="/img/mountains.jpg" />
<img class="translate-8 ..." src="/img/mountains.jpg" />
Using a percentage
Use translate-<fraction> utilities like translate-1/4 and -translate-full to translate an element on both axes by a percentage of the element's size:
-translate-1/4


translate-1/6


translate-1/2


<img class="-translate-1/4 ..." src="/img/mountains.jpg" />
<img class="translate-1/6 ..." src="/img/mountains.jpg" />
<img class="translate-1/2 ..." src="/img/mountains.jpg" />
Translating on the x-axis
Use translate-x-<number> or translate-x-<fraction> utilities like translate-x-4 and translate-x-1/4 to translate an element on the x-axis:
-translate-x-4


translate-x-2


translate-x-1/2


<img class="-translate-x-4 ..." src="/img/mountains.jpg" />
<img class="translate-x-2 ..." src="/img/mountains.jpg" />
<img class="translate-x-1/2 ..." src="/img/mountains.jpg" />
Translating on the y-axis
Use translate-y-<number> or translate-y-<fraction> utilities like translate-y-6 and translate-y-1/3 to translate an element on the y-axis:
-translate-y-4


translate-y-2


translate-y-1/2


<img class="-translate-y-4 ..." src="/img/mountains.jpg" />
<img class="translate-y-2 ..." src="/img/mountains.jpg" />
<img class="translate-y-1/2 ..." src="/img/mountains.jpg" />
Translating on the z-axis
Use translate-z-<number> utilities like translate-z-6 and -translate-z-12 to translate an element on the z-axis:
-translate-z-8


translate-z-4


translate-z-12


<div class="transform-3d">
 <img class="-translate-z-8 rotate-x-50 rotate-z-45 ..." src="/img/mountains.jpg" />
 <img class="translate-z-2 rotate-x-50 rotate-z-45 ..." src="/img/mountains.jpg" />
 <img class="translate-z-1/2 rotate-x-50 rotate-z-45 ..." src="/img/mountains.jpg" />
</div>
Note that the translate-z-<number> utilities require the transform-3d utility to be applied to the parent element.
Using a custom value
Use the translate-[<value>] syntax to set the translation based on a completely custom value:
<img class="translate-[3.142rad] ..." src="/img/mountains.jpg" />
For CSS variables, you can also use the translate-(<custom-property>) syntax:
<img class="translate-(--my-translate) ..." src="/img/mountains.jpg" />
This is just a shorthand for translate-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a translate utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<img class="translate-45 md:translate-60 ..." src="/img/mountains.jpg" />
Learn more about using variants in the variants documentation.
transform-style
accent-color
On this page
Quick reference
Examples
Using the spacing scale
Using a percentage
Translating on the x-axis
Translating on the y-axis
Translating on the z-axis
Using a custom value
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy

Interactivity
appearance
Utilities for suppressing native form control styling.
Class
Styles
appearance-none
appearance: none;
appearance-auto
appearance: auto;

Examples
Removing default appearance
Use appearance-none to reset any browser specific styling on an element:
YesNoMaybe
Default browser styles applied
YesNoMaybe
Remove default browser styles
<select>
 <option>Yes</option>
 <option>No</option>
 <option>Maybe</option>
</select>
<div class="grid">
 <select class="col-start-1 row-start-1 appearance-none bg-gray-50 dark:bg-gray-800 ...">
   <option>Yes</option>
   <option>No</option>
   <option>Maybe</option>
 </select>
 <svg class="pointer-events-none col-start-1 row-start-1 ...">
   <!-- ... -->
 </svg>
</div>
This utility is often used when creating custom form components.
Restoring default appearance
Use appearance-auto to restore the default browser specific styling on an element:
Try emulating `forced-colors: active` in your developer tools to see the difference
<label>
 <div>
   <input type="checkbox" class="appearance-none forced-colors:appearance-auto ..." />
   <svg class="invisible peer-checked:visible forced-colors:hidden ...">
     <!-- ... -->
   </svg>
 </div>
 Falls back to default appearance
</label>
<label>
 <div>
   <input type="checkbox" class="appearance-none ..." />
   <svg class="invisible peer-checked:visible ...">
     <!-- ... -->
   </svg>
 </div>
 Keeps custom appearance
</label>
This is useful for reverting to the standard browser controls in certain accessibility modes.
Responsive design
Prefix an appearance utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<select class="appearance-auto md:appearance-none ...">
 <!-- ... -->
</select>
Learn more about using variants in the variants documentation.
accent-color
caret-color
On this page
Quick reference
Examples
Removing default appearance
Restoring default appearance
Responsive design

From the creators of Tailwind CSS
Make your ideas look awesome, without relying on a designer.
“This is the survival kit I wish I had when I started building apps.”
Derrick Reimer, SavvyCal
Tailwind CSS
Documentation
Playground
Blog
Showcase
Sponsor
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.·Trademark Policy



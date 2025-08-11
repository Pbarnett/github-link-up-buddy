# Tailwind CSS Documentation 4

## 📋 Document Directory & Navigation

### 📖 Overview
This document serves as the specialized reference for Tailwind CSS interactivity, user interface controls, and advanced accessibility features within the github-link-up-buddy project. It covers interactive elements, input styling, pointer events, user experience enhancements, and accessibility implementations.

### 🧭 Quick Navigation
- **Input Controls**: Text inputs, form elements, and interactive styling
- **Pointer Events**: Cursor styling, hover effects, and click interactions
- **User Experience**: Selection, scrolling, and touch interactions
- **Accessibility**: Screen reader support, keyboard navigation, and ARIA compliance
- **Advanced Interactions**: Complex UI patterns and behavioral enhancements

### 📑 Detailed Table of Contents

#### 1. Text Input and Cursor Control
- 1.1 Caret Color Customization
- 1.2 Text Selection Styling
- 1.3 Input Focus Management
- 1.4 Placeholder Text Styling
- 1.5 Text Direction and Alignment
- 1.6 Input Validation States

#### 2. Form Element Interactions
- 2.1 Input Field Styling
- 2.2 Button State Management
- 2.3 Checkbox and Radio Controls
- 2.4 Select Dropdown Styling
- 2.5 Form Validation Feedback
- 2.6 Multi-step Form Patterns

#### 3. Pointer and Cursor Events
- 3.1 Cursor Type Controls
- 3.2 Pointer Event Handling
- 3.3 Mouse Interaction States
- 3.4 Drag and Drop Support
- 3.5 Context Menu Behavior
- 3.6 Click and Double-click Events

#### 4. Touch and Mobile Interactions
- 4.1 Touch Action Controls
- 4.2 Mobile Gesture Support
- 4.3 Swipe and Pinch Handling
- 4.4 Mobile-First Design Patterns
- 4.5 Responsive Touch Targets
- 4.6 Device Orientation Support

#### 5. Scroll and Navigation
- 5.1 Scroll Behavior Control
- 5.2 Scroll Snap Alignment
- 5.3 Smooth Scrolling Implementation
- 5.4 Navigation Patterns
- 5.5 Scroll-based Animations
- 5.6 Infinite Scroll Patterns

#### 6. User Selection and Highlighting
- 6.1 Text Selection Control
- 6.2 User Select Behavior
- 6.3 Highlight Color Management
- 6.4 Copy and Paste Interactions
- 6.5 Selection-based Features
- 6.6 Content Editability

#### 7. Focus and Keyboard Navigation
- 7.1 Focus Ring Styling
- 7.2 Tab Order Management
- 7.3 Keyboard Event Handling
- 7.4 Focus Trap Implementation
- 7.5 Skip Link Patterns
- 7.6 Keyboard Shortcuts

#### 8. Accessibility Features
- 8.1 Screen Reader Support
- 8.2 ARIA Attributes Integration
- 8.3 Color Contrast Compliance
- 8.4 Motion and Animation Controls
- 8.5 Alternative Input Methods
- 8.6 Assistive Technology Support

#### 9. Visual Feedback Systems
- 9.1 Hover State Indicators
- 9.2 Active State Styling
- 9.3 Loading State Management
- 9.4 Error State Presentation
- 9.5 Success State Feedback
- 9.6 Progress Indicators

#### 10. Advanced Interaction Patterns
- 10.1 Modal and Overlay Interactions
- 10.2 Dropdown and Menu Systems
- 10.3 Tooltip and Popover Controls
- 10.4 Accordion and Collapsible Content
- 10.5 Tabbed Interface Management
- 10.6 Carousel and Slider Controls

#### 11. Performance and Optimization
- 11.1 Interaction Performance
- 11.2 Event Handling Optimization
- 11.3 Memory Management
- 11.4 Render Performance
- 11.5 Animation Optimization
- 11.6 Resource Loading Strategies

#### 12. Cross-Platform Compatibility
- 12.1 Browser Compatibility
- 12.2 Device-Specific Adaptations
- 12.3 Operating System Considerations
- 12.4 Input Method Variations
- 12.5 Accessibility Standards Compliance
- 12.6 Progressive Enhancement

#### 13. Testing and Quality Assurance
- 13.1 Interactive Testing Strategies
- 13.2 Accessibility Testing Tools
- 13.3 User Experience Testing
- 13.4 Performance Testing
- 13.5 Cross-browser Testing
- 13.6 Automated Testing Patterns

#### 14. Design System Integration
- 14.1 Interaction Design Tokens
- 14.2 Component Library Integration
- 14.3 Style Guide Compliance
- 14.4 Design-to-Code Workflows
- 14.5 Consistent Interaction Patterns
- 14.6 Brand Guidelines Implementation

#### 15. Security Considerations
- 15.1 Input Validation and Sanitization
- 15.2 Click-jacking Prevention
- 15.3 Cross-site Scripting Protection
- 15.4 Secure Form Handling
- 15.5 Privacy and Data Protection
- 15.6 Security Testing Protocols

#### 16. Debugging and Troubleshooting
- 16.1 Interaction Debugging Tools
- 16.2 Event Tracking and Logging
- 16.3 Performance Profiling
- 16.4 Common Issues and Solutions
- 16.5 Browser Developer Tools
- 16.6 Accessibility Debugging

#### 17. Future Considerations
- 17.1 Emerging Interaction Standards
- 17.2 New Browser Features
- 17.3 Accessibility Evolution
- 17.4 Mobile Technology Trends
- 17.5 Performance Optimization Advances
- 17.6 User Experience Innovations

#### 18. Implementation Guidelines
- 18.1 Best Practice Recommendations
- 18.2 Code Organization Strategies
- 18.3 Documentation Standards
- 18.4 Team Collaboration Workflows
- 18.5 Maintenance and Updates
- 18.6 Knowledge Transfer Protocols

### 🔍 How to Use This Document
1. **Input Controls**: Sections 1-2 for form elements and text input styling
2. **Interaction Events**: Sections 3-5 for pointer, touch, and scroll behaviors
3. **User Experience**: Sections 6-10 for selection, focus, and advanced patterns
4. **Quality & Performance**: Sections 11-18 for optimization and best practices

### 🏷️ Search Keywords
`interactivity`, `user-interface`, `input-controls`, `caret-color`, `cursor-styling`, `pointer-events`, `touch-interactions`, `scroll-behavior`, `focus-management`, `accessibility`, `keyboard-navigation`, `form-styling`, `user-selection`, `hover-states`, `click-events`, `mobile-interactions`, `performance-optimization`, `cross-platform`, `testing`, `security`, `debugging`, `best-practices`

---
IInteractivity
caret-color
Utilities for controlling the color of the text input cursor.
Class
Styles
caret-inherit
caret-color: inherit;
caret-current
caret-color: currentColor;
caret-transparent
caret-color: transparent;
caret-black
caret-color: var(--color-black); /* #000 */
caret-white
caret-color: var(--color-white); /* #fff */
caret-red-50
caret-color: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */
caret-red-100
caret-color: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */
caret-red-200
caret-color: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */
caret-red-300
caret-color: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */
caret-red-400
caret-color: var(--color-red-400); /* oklch(70.4% 0.191 22.216) */
caret-red-500
caret-color: var(--color-red-500); /* oklch(63.7% 0.237 25.331) */
caret-red-600
caret-color: var(--color-red-600); /* oklch(57.7% 0.245 27.325) */
caret-red-700
caret-color: var(--color-red-700); /* oklch(50.5% 0.213 27.518) */
caret-red-800
caret-color: var(--color-red-800); /* oklch(44.4% 0.177 26.899) */
caret-red-900
caret-color: var(--color-red-900); /* oklch(39.6% 0.141 25.723) */
caret-red-950
caret-color: var(--color-red-950); /* oklch(25.8% 0.092 26.042) */
caret-orange-50
caret-color: var(--color-orange-50); /* oklch(98% 0.016 73.684) */
caret-orange-100
caret-color: var(--color-orange-100); /* oklch(95.4% 0.038 75.164) */
caret-orange-200
caret-color: var(--color-orange-200); /* oklch(90.1% 0.076 70.697) */
caret-orange-300
caret-color: var(--color-orange-300); /* oklch(83.7% 0.128 66.29) */
caret-orange-400
caret-color: var(--color-orange-400); /* oklch(75% 0.183 55.934) */
caret-orange-500
caret-color: var(--color-orange-500); /* oklch(70.5% 0.213 47.604) */
caret-orange-600
caret-color: var(--color-orange-600); /* oklch(64.6% 0.222 41.116) */
caret-orange-700
caret-color: var(--color-orange-700); /* oklch(55.3% 0.195 38.402) */
caret-orange-800
caret-color: var(--color-orange-800); /* oklch(47% 0.157 37.304) */
caret-orange-900
caret-color: var(--color-orange-900); /* oklch(40.8% 0.123 38.172) */
caret-orange-950
caret-color: var(--color-orange-950); /* oklch(26.6% 0.079 36.259) */
caret-amber-50
caret-color: var(--color-amber-50); /* oklch(98.7% 0.022 95.277) */
caret-amber-100
caret-color: var(--color-amber-100); /* oklch(96.2% 0.059 95.617) */
caret-amber-200
caret-color: var(--color-amber-200); /* oklch(92.4% 0.12 95.746) */
caret-amber-300
caret-color: var(--color-amber-300); /* oklch(87.9% 0.169 91.605) */
caret-amber-400
caret-color: var(--color-amber-400); /* oklch(82.8% 0.189 84.429) */
caret-amber-500
caret-color: var(--color-amber-500); /* oklch(76.9% 0.188 70.08) */
caret-amber-600
caret-color: var(--color-amber-600); /* oklch(66.6% 0.179 58.318) */
caret-amber-700
caret-color: var(--color-amber-700); /* oklch(55.5% 0.163 48.998) */
caret-amber-800
caret-color: var(--color-amber-800); /* oklch(47.3% 0.137 46.201) */
caret-amber-900
caret-color: var(--color-amber-900); /* oklch(41.4% 0.112 45.904) */
caret-amber-950
caret-color: var(--color-amber-950); /* oklch(27.9% 0.077 45.635) */
caret-yellow-50
caret-color: var(--color-yellow-50); /* oklch(98.7% 0.026 102.212) */
caret-yellow-100
caret-color: var(--color-yellow-100); /* oklch(97.3% 0.071 103.193) */
caret-yellow-200
caret-color: var(--color-yellow-200); /* oklch(94.5% 0.129 101.54) */
caret-yellow-300
caret-color: var(--color-yellow-300); /* oklch(90.5% 0.182 98.111) */
caret-yellow-400
caret-color: var(--color-yellow-400); /* oklch(85.2% 0.199 91.936) */
caret-yellow-500
caret-color: var(--color-yellow-500); /* oklch(79.5% 0.184 86.047) */
caret-yellow-600
caret-color: var(--color-yellow-600); /* oklch(68.1% 0.162 75.834) */
caret-yellow-700
caret-color: var(--color-yellow-700); /* oklch(55.4% 0.135 66.442) */
caret-yellow-800
caret-color: var(--color-yellow-800); /* oklch(47.6% 0.114 61.907) */
caret-yellow-900
caret-color: var(--color-yellow-900); /* oklch(42.1% 0.095 57.708) */
caret-yellow-950
caret-color: var(--color-yellow-950); /* oklch(28.6% 0.066 53.813) */
caret-lime-50
caret-color: var(--color-lime-50); /* oklch(98.6% 0.031 120.757) */
caret-lime-100
caret-color: var(--color-lime-100); /* oklch(96.7% 0.067 122.328) */
caret-lime-200
caret-color: var(--color-lime-200); /* oklch(93.8% 0.127 124.321) */
caret-lime-300
caret-color: var(--color-lime-300); /* oklch(89.7% 0.196 126.665) */
caret-lime-400
caret-color: var(--color-lime-400); /* oklch(84.1% 0.238 128.85) */
caret-lime-500
caret-color: var(--color-lime-500); /* oklch(76.8% 0.233 130.85) */
caret-lime-600
caret-color: var(--color-lime-600); /* oklch(64.8% 0.2 131.684) */
caret-lime-700
caret-color: var(--color-lime-700); /* oklch(53.2% 0.157 131.589) */
caret-lime-800
caret-color: var(--color-lime-800); /* oklch(45.3% 0.124 130.933) */
caret-lime-900
caret-color: var(--color-lime-900); /* oklch(40.5% 0.101 131.063) */
caret-lime-950
caret-color: var(--color-lime-950); /* oklch(27.4% 0.072 132.109) */
caret-green-50
caret-color: var(--color-green-50); /* oklch(98.2% 0.018 155.826) */
caret-green-100
caret-color: var(--color-green-100); /* oklch(96.2% 0.044 156.743) */
caret-green-200
caret-color: var(--color-green-200); /* oklch(92.5% 0.084 155.995) */
caret-green-300
caret-color: var(--color-green-300); /* oklch(87.1% 0.15 154.449) */
caret-green-400
caret-color: var(--color-green-400); /* oklch(79.2% 0.209 151.711) */
caret-green-500
caret-color: var(--color-green-500); /* oklch(72.3% 0.219 149.579) */
caret-green-600
caret-color: var(--color-green-600); /* oklch(62.7% 0.194 149.214) */
caret-green-700
caret-color: var(--color-green-700); /* oklch(52.7% 0.154 150.069) */
caret-green-800
caret-color: var(--color-green-800); /* oklch(44.8% 0.119 151.328) */
caret-green-900
caret-color: var(--color-green-900); /* oklch(39.3% 0.095 152.535) */
caret-green-950
caret-color: var(--color-green-950); /* oklch(26.6% 0.065 152.934) */
caret-emerald-50
caret-color: var(--color-emerald-50); /* oklch(97.9% 0.021 166.113) */
caret-emerald-100
caret-color: var(--color-emerald-100); /* oklch(95% 0.052 163.051) */
caret-emerald-200
caret-color: var(--color-emerald-200); /* oklch(90.5% 0.093 164.15) */
caret-emerald-300
caret-color: var(--color-emerald-300); /* oklch(84.5% 0.143 164.978) */
caret-emerald-400
caret-color: var(--color-emerald-400); /* oklch(76.5% 0.177 163.223) */
caret-emerald-500
caret-color: var(--color-emerald-500); /* oklch(69.6% 0.17 162.48) */
caret-emerald-600
caret-color: var(--color-emerald-600); /* oklch(59.6% 0.145 163.225) */
caret-emerald-700
caret-color: var(--color-emerald-700); /* oklch(50.8% 0.118 165.612) */
caret-emerald-800
caret-color: var(--color-emerald-800); /* oklch(43.2% 0.095 166.913) */
caret-emerald-900
caret-color: var(--color-emerald-900); /* oklch(37.8% 0.077 168.94) */
caret-emerald-950
caret-color: var(--color-emerald-950); /* oklch(26.2% 0.051 172.552) */
caret-teal-50
caret-color: var(--color-teal-50); /* oklch(98.4% 0.014 180.72) */
caret-teal-100
caret-color: var(--color-teal-100); /* oklch(95.3% 0.051 180.801) */
caret-teal-200
caret-color: var(--color-teal-200); /* oklch(91% 0.096 180.426) */
caret-teal-300
caret-color: var(--color-teal-300); /* oklch(85.5% 0.138 181.071) */
caret-teal-400
caret-color: var(--color-teal-400); /* oklch(77.7% 0.152 181.912) */
caret-teal-500
caret-color: var(--color-teal-500); /* oklch(70.4% 0.14 182.503) */
caret-teal-600
caret-color: var(--color-teal-600); /* oklch(60% 0.118 184.704) */
caret-teal-700
caret-color: var(--color-teal-700); /* oklch(51.1% 0.096 186.391) */
caret-teal-800
caret-color: var(--color-teal-800); /* oklch(43.7% 0.078 188.216) */
caret-teal-900
caret-color: var(--color-teal-900); /* oklch(38.6% 0.063 188.416) */
caret-teal-950
caret-color: var(--color-teal-950); /* oklch(27.7% 0.046 192.524) */
caret-cyan-50
caret-color: var(--color-cyan-50); /* oklch(98.4% 0.019 200.873) */
caret-cyan-100
caret-color: var(--color-cyan-100); /* oklch(95.6% 0.045 203.388) */
caret-cyan-200
caret-color: var(--color-cyan-200); /* oklch(91.7% 0.08 205.041) */
caret-cyan-300
caret-color: var(--color-cyan-300); /* oklch(86.5% 0.127 207.078) */
caret-cyan-400
caret-color: var(--color-cyan-400); /* oklch(78.9% 0.154 211.53) */
caret-cyan-500
caret-color: var(--color-cyan-500); /* oklch(71.5% 0.143 215.221) */
caret-cyan-600
caret-color: var(--color-cyan-600); /* oklch(60.9% 0.126 221.723) */
caret-cyan-700
caret-color: var(--color-cyan-700); /* oklch(52% 0.105 223.128) */
caret-cyan-800
caret-color: var(--color-cyan-800); /* oklch(45% 0.085 224.283) */
caret-cyan-900
caret-color: var(--color-cyan-900); /* oklch(39.8% 0.07 227.392) */
caret-cyan-950
caret-color: var(--color-cyan-950); /* oklch(30.2% 0.056 229.695) */
caret-sky-50
caret-color: var(--color-sky-50); /* oklch(97.7% 0.013 236.62) */
caret-sky-100
caret-color: var(--color-sky-100); /* oklch(95.1% 0.026 236.824) */
caret-sky-200
caret-color: var(--color-sky-200); /* oklch(90.1% 0.058 230.902) */
caret-sky-300
caret-color: var(--color-sky-300); /* oklch(82.8% 0.111 230.318) */
caret-sky-400
caret-color: var(--color-sky-400); /* oklch(74.6% 0.16 232.661) */
caret-sky-500
caret-color: var(--color-sky-500); /* oklch(68.5% 0.169 237.323) */
caret-sky-600
caret-color: var(--color-sky-600); /* oklch(58.8% 0.158 241.966) */
caret-sky-700
caret-color: var(--color-sky-700); /* oklch(50% 0.134 242.749) */
caret-sky-800
caret-color: var(--color-sky-800); /* oklch(44.3% 0.11 240.79) */
caret-sky-900
caret-color: var(--color-sky-900); /* oklch(39.1% 0.09 240.876) */
caret-sky-950
caret-color: var(--color-sky-950); /* oklch(29.3% 0.066 243.157) */
caret-blue-50
caret-color: var(--color-blue-50); /* oklch(97% 0.014 254.604) */
caret-blue-100
caret-color: var(--color-blue-100); /* oklch(93.2% 0.032 255.585) */
caret-blue-200
caret-color: var(--color-blue-200); /* oklch(88.2% 0.059 254.128) */
caret-blue-300
caret-color: var(--color-blue-300); /* oklch(80.9% 0.105 251.813) */
caret-blue-400
caret-color: var(--color-blue-400); /* oklch(70.7% 0.165 254.624) */
caret-blue-500
caret-color: var(--color-blue-500); /* oklch(62.3% 0.214 259.815) */
caret-blue-600
caret-color: var(--color-blue-600); /* oklch(54.6% 0.245 262.881) */
caret-blue-700
caret-color: var(--color-blue-700); /* oklch(48.8% 0.243 264.376) */
caret-blue-800
caret-color: var(--color-blue-800); /* oklch(42.4% 0.199 265.638) */
caret-blue-900
caret-color: var(--color-blue-900); /* oklch(37.9% 0.146 265.522) */
caret-blue-950
caret-color: var(--color-blue-950); /* oklch(28.2% 0.091 267.935) */
caret-indigo-50
caret-color: var(--color-indigo-50); /* oklch(96.2% 0.018 272.314) */
caret-indigo-100
caret-color: var(--color-indigo-100); /* oklch(93% 0.034 272.788) */
caret-indigo-200
caret-color: var(--color-indigo-200); /* oklch(87% 0.065 274.039) */
caret-indigo-300
caret-color: var(--color-indigo-300); /* oklch(78.5% 0.115 274.713) */
caret-indigo-400
caret-color: var(--color-indigo-400); /* oklch(67.3% 0.182 276.935) */
caret-indigo-500
caret-color: var(--color-indigo-500); /* oklch(58.5% 0.233 277.117) */
caret-indigo-600
caret-color: var(--color-indigo-600); /* oklch(51.1% 0.262 276.966) */
caret-indigo-700
caret-color: var(--color-indigo-700); /* oklch(45.7% 0.24 277.023) */
caret-indigo-800
caret-color: var(--color-indigo-800); /* oklch(39.8% 0.195 277.366) */
caret-indigo-900
caret-color: var(--color-indigo-900); /* oklch(35.9% 0.144 278.697) */
caret-indigo-950
caret-color: var(--color-indigo-950); /* oklch(25.7% 0.09 281.288) */
caret-violet-50
caret-color: var(--color-violet-50); /* oklch(96.9% 0.016 293.756) */
caret-violet-100
caret-color: var(--color-violet-100); /* oklch(94.3% 0.029 294.588) */
caret-violet-200
caret-color: var(--color-violet-200); /* oklch(89.4% 0.057 293.283) */
caret-violet-300
caret-color: var(--color-violet-300); /* oklch(81.1% 0.111 293.571) */
caret-violet-400
caret-color: var(--color-violet-400); /* oklch(70.2% 0.183 293.541) */
caret-violet-500
caret-color: var(--color-violet-500); /* oklch(60.6% 0.25 292.717) */
caret-violet-600
caret-color: var(--color-violet-600); /* oklch(54.1% 0.281 293.009) */
caret-violet-700
caret-color: var(--color-violet-700); /* oklch(49.1% 0.27 292.581) */
caret-violet-800
caret-color: var(--color-violet-800); /* oklch(43.2% 0.232 292.759) */
caret-violet-900
caret-color: var(--color-violet-900); /* oklch(38% 0.189 293.745) */
caret-violet-950
caret-color: var(--color-violet-950); /* oklch(28.3% 0.141 291.089) */
caret-purple-50
caret-color: var(--color-purple-50); /* oklch(97.7% 0.014 308.299) */
caret-purple-100
caret-color: var(--color-purple-100); /* oklch(94.6% 0.033 307.174) */
caret-purple-200
caret-color: var(--color-purple-200); /* oklch(90.2% 0.063 306.703) */
caret-purple-300
caret-color: var(--color-purple-300); /* oklch(82.7% 0.119 306.383) */
caret-purple-400
caret-color: var(--color-purple-400); /* oklch(71.4% 0.203 305.504) */
caret-purple-500
caret-color: var(--color-purple-500); /* oklch(62.7% 0.265 303.9) */
caret-purple-600
caret-color: var(--color-purple-600); /* oklch(55.8% 0.288 302.321) */
caret-purple-700
caret-color: var(--color-purple-700); /* oklch(49.6% 0.265 301.924) */
caret-purple-800
caret-color: var(--color-purple-800); /* oklch(43.8% 0.218 303.724) */
caret-purple-900
caret-color: var(--color-purple-900); /* oklch(38.1% 0.176 304.987) */
caret-purple-950
caret-color: var(--color-purple-950); /* oklch(29.1% 0.149 302.717) */
caret-fuchsia-50
caret-color: var(--color-fuchsia-50); /* oklch(97.7% 0.017 320.058) */
caret-fuchsia-100
caret-color: var(--color-fuchsia-100); /* oklch(95.2% 0.037 318.852) */
caret-fuchsia-200
caret-color: var(--color-fuchsia-200); /* oklch(90.3% 0.076 319.62) */
caret-fuchsia-300
caret-color: var(--color-fuchsia-300); /* oklch(83.3% 0.145 321.434) */
caret-fuchsia-400
caret-color: var(--color-fuchsia-400); /* oklch(74% 0.238 322.16) */
caret-fuchsia-500
caret-color: var(--color-fuchsia-500); /* oklch(66.7% 0.295 322.15) */
caret-fuchsia-600
caret-color: var(--color-fuchsia-600); /* oklch(59.1% 0.293 322.896) */
caret-fuchsia-700
caret-color: var(--color-fuchsia-700); /* oklch(51.8% 0.253 323.949) */
caret-fuchsia-800
caret-color: var(--color-fuchsia-800); /* oklch(45.2% 0.211 324.591) */
caret-fuchsia-900
caret-color: var(--color-fuchsia-900); /* oklch(40.1% 0.17 325.612) */
caret-fuchsia-950
caret-color: var(--color-fuchsia-950); /* oklch(29.3% 0.136 325.661) */
caret-pink-50
caret-color: var(--color-pink-50); /* oklch(97.1% 0.014 343.198) */
caret-pink-100
caret-color: var(--color-pink-100); /* oklch(94.8% 0.028 342.258) */
caret-pink-200
caret-color: var(--color-pink-200); /* oklch(89.9% 0.061 343.231) */
caret-pink-300
caret-color: var(--color-pink-300); /* oklch(82.3% 0.12 346.018) */
caret-pink-400
caret-color: var(--color-pink-400); /* oklch(71.8% 0.202 349.761) */
caret-pink-500
caret-color: var(--color-pink-500); /* oklch(65.6% 0.241 354.308) */
caret-pink-600
caret-color: var(--color-pink-600); /* oklch(59.2% 0.249 0.584) */
caret-pink-700
caret-color: var(--color-pink-700); /* oklch(52.5% 0.223 3.958) */
caret-pink-800
caret-color: var(--color-pink-800); /* oklch(45.9% 0.187 3.815) */
caret-pink-900
caret-color: var(--color-pink-900); /* oklch(40.8% 0.153 2.432) */
caret-pink-950
caret-color: var(--color-pink-950); /* oklch(28.4% 0.109 3.907) */
caret-rose-50
caret-color: var(--color-rose-50); /* oklch(96.9% 0.015 12.422) */
caret-rose-100
caret-color: var(--color-rose-100); /* oklch(94.1% 0.03 12.58) */
caret-rose-200
caret-color: var(--color-rose-200); /* oklch(89.2% 0.058 10.001) */
caret-rose-300
caret-color: var(--color-rose-300); /* oklch(81% 0.117 11.638) */
caret-rose-400
caret-color: var(--color-rose-400); /* oklch(71.2% 0.194 13.428) */
caret-rose-500
caret-color: var(--color-rose-500); /* oklch(64.5% 0.246 16.439) */
caret-rose-600
caret-color: var(--color-rose-600); /* oklch(58.6% 0.253 17.585) */
caret-rose-700
caret-color: var(--color-rose-700); /* oklch(51.4% 0.222 16.935) */
caret-rose-800
caret-color: var(--color-rose-800); /* oklch(45.5% 0.188 13.697) */
caret-rose-900
caret-color: var(--color-rose-900); /* oklch(41% 0.159 10.272) */
caret-rose-950
caret-color: var(--color-rose-950); /* oklch(27.1% 0.105 12.094) */
caret-slate-50
caret-color: var(--color-slate-50); /* oklch(98.4% 0.003 247.858) */
caret-slate-100
caret-color: var(--color-slate-100); /* oklch(96.8% 0.007 247.896) */
caret-slate-200
caret-color: var(--color-slate-200); /* oklch(92.9% 0.013 255.508) */
caret-slate-300
caret-color: var(--color-slate-300); /* oklch(86.9% 0.022 252.894) */
caret-slate-400
caret-color: var(--color-slate-400); /* oklch(70.4% 0.04 256.788) */
caret-slate-500
caret-color: var(--color-slate-500); /* oklch(55.4% 0.046 257.417) */
caret-slate-600
caret-color: var(--color-slate-600); /* oklch(44.6% 0.043 257.281) */
caret-slate-700
caret-color: var(--color-slate-700); /* oklch(37.2% 0.044 257.287) */
caret-slate-800
caret-color: var(--color-slate-800); /* oklch(27.9% 0.041 260.031) */
caret-slate-900
caret-color: var(--color-slate-900); /* oklch(20.8% 0.042 265.755) */
caret-slate-950
caret-color: var(--color-slate-950); /* oklch(12.9% 0.042 264.695) */
caret-gray-50
caret-color: var(--color-gray-50); /* oklch(98.5% 0.002 247.839) */
caret-gray-100
caret-color: var(--color-gray-100); /* oklch(96.7% 0.003 264.542) */
caret-gray-200
caret-color: var(--color-gray-200); /* oklch(92.8% 0.006 264.531) */
caret-gray-300
caret-color: var(--color-gray-300); /* oklch(87.2% 0.01 258.338) */
caret-gray-400
caret-color: var(--color-gray-400); /* oklch(70.7% 0.022 261.325) */
caret-gray-500
caret-color: var(--color-gray-500); /* oklch(55.1% 0.027 264.364) */
caret-gray-600
caret-color: var(--color-gray-600); /* oklch(44.6% 0.03 256.802) */
caret-gray-700
caret-color: var(--color-gray-700); /* oklch(37.3% 0.034 259.733) */
caret-gray-800
caret-color: var(--color-gray-800); /* oklch(27.8% 0.033 256.848) */
caret-gray-900
caret-color: var(--color-gray-900); /* oklch(21% 0.034 264.665) */
caret-gray-950
caret-color: var(--color-gray-950); /* oklch(13% 0.028 261.692) */
caret-zinc-50
caret-color: var(--color-zinc-50); /* oklch(98.5% 0 0) */
caret-zinc-100
caret-color: var(--color-zinc-100); /* oklch(96.7% 0.001 286.375) */
caret-zinc-200
caret-color: var(--color-zinc-200); /* oklch(92% 0.004 286.32) */
caret-zinc-300
caret-color: var(--color-zinc-300); /* oklch(87.1% 0.006 286.286) */
caret-zinc-400
caret-color: var(--color-zinc-400); /* oklch(70.5% 0.015 286.067) */
caret-zinc-500
caret-color: var(--color-zinc-500); /* oklch(55.2% 0.016 285.938) */
caret-zinc-600
caret-color: var(--color-zinc-600); /* oklch(44.2% 0.017 285.786) */
caret-zinc-700
caret-color: var(--color-zinc-700); /* oklch(37% 0.013 285.805) */
caret-zinc-800
caret-color: var(--color-zinc-800); /* oklch(27.4% 0.006 286.033) */
caret-zinc-900
caret-color: var(--color-zinc-900); /* oklch(21% 0.006 285.885) */
caret-zinc-950
caret-color: var(--color-zinc-950); /* oklch(14.1% 0.005 285.823) */
caret-neutral-50
caret-color: var(--color-neutral-50); /* oklch(98.5% 0 0) */
caret-neutral-100
caret-color: var(--color-neutral-100); /* oklch(97% 0 0) */
caret-neutral-200
caret-color: var(--color-neutral-200); /* oklch(92.2% 0 0) */
caret-neutral-300
caret-color: var(--color-neutral-300); /* oklch(87% 0 0) */
caret-neutral-400
caret-color: var(--color-neutral-400); /* oklch(70.8% 0 0) */
caret-neutral-500
caret-color: var(--color-neutral-500); /* oklch(55.6% 0 0) */
caret-neutral-600
caret-color: var(--color-neutral-600); /* oklch(43.9% 0 0) */
caret-neutral-700
caret-color: var(--color-neutral-700); /* oklch(37.1% 0 0) */
caret-neutral-800
caret-color: var(--color-neutral-800); /* oklch(26.9% 0 0) */
caret-neutral-900
caret-color: var(--color-neutral-900); /* oklch(20.5% 0 0) */
caret-neutral-950
caret-color: var(--color-neutral-950); /* oklch(14.5% 0 0) */
caret-stone-50
caret-color: var(--color-stone-50); /* oklch(98.5% 0.001 106.423) */
caret-stone-100
caret-color: var(--color-stone-100); /* oklch(97% 0.001 106.424) */
caret-stone-200
caret-color: var(--color-stone-200); /* oklch(92.3% 0.003 48.717) */
caret-stone-300
caret-color: var(--color-stone-300); /* oklch(86.9% 0.005 56.366) */
caret-stone-400
caret-color: var(--color-stone-400); /* oklch(70.9% 0.01 56.259) */
caret-stone-500
caret-color: var(--color-stone-500); /* oklch(55.3% 0.013 58.071) */
caret-stone-600
caret-color: var(--color-stone-600); /* oklch(44.4% 0.011 73.639) */
caret-stone-700
caret-color: var(--color-stone-700); /* oklch(37.4% 0.01 67.558) */
caret-stone-800
caret-color: var(--color-stone-800); /* oklch(26.8% 0.007 34.298) */
caret-stone-900
caret-color: var(--color-stone-900); /* oklch(21.6% 0.006 56.043) */
caret-stone-950
caret-color: var(--color-stone-950); /* oklch(14.7% 0.004 49.25) */
caret-<custom-property>
caret-color: var(<custom-property>);
caret-[<value>]
caret-color: <value>;

Show less
Examples
Basic example
Use utilities like caret-rose-500 and caret-lime-600 to change the color of the text input cursor:
Focus the textarea to see the new caret color
<textarea class="caret-pink-500 ..."></textarea>
Using a custom value
Use the caret-[<value>] syntax to set the caret color based on a completely custom value:
<textarea class="caret-[#50d71e] ..."></textarea>
For CSS variables, you can also use the caret-(<custom-property>) syntax:
<textarea class="caret-(--my-caret-color) ..."></textarea>
This is just a shorthand for caret-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a caret-color utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<textarea class="caret-rose-500 md:caret-lime-600 ..."></textarea>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --color-* theme variables to customize the color utilities in your project:
@theme {
 --color-regal-blue: #243c5a;
}
Now the caret-regal-blue utility can be used in your markup:
<textarea class="caret-regal-blue"></textarea>
Learn more about customizing your theme in the theme documentation.
appearance
color-scheme
On this page
Quick reference
Examples
Basic example
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

Interactivity
color-scheme
Utilities for controlling the color scheme of an element.
Class
Styles
scheme-normal
color-scheme: normal;
scheme-dark
color-scheme: dark;
scheme-light
color-scheme: light;
scheme-light-dark
color-scheme: light dark;
scheme-only-dark
color-scheme: only dark;
scheme-only-light
color-scheme: only light;

Examples
Basic example
Use utilities like scheme-light and scheme-light-dark to control how element should be rendered:
Try switching your system color scheme to see the difference
scheme-light
scheme-dark
scheme-light-dark
<div class="scheme-light ...">
 <input type="date" />
</div>
<div class="scheme-dark ...">
 <input type="date" />
</div>
<div class="scheme-light-dark ...">
 <input type="date" />
</div>
Applying in dark mode
Prefix a color-scheme utility with a variant like dark:* to only apply the utility in that state:
<html class="scheme-light dark:scheme-dark ...">
 <!-- ... -->
</html>
Learn more about using variants in the variants documentation.
caret-color
cursor
On this page
Quick reference
Examples
Basic example
Applying in dark mode

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

Interactivity
cursor
Utilities for controlling the cursor style when hovering over an element.
Class
Styles
cursor-auto
cursor: auto;
cursor-default
cursor: default;
cursor-pointer
cursor: pointer;
cursor-wait
cursor: wait;
cursor-text
cursor: text;
cursor-move
cursor: move;
cursor-help
cursor: help;
cursor-not-allowed
cursor: not-allowed;
cursor-none
cursor: none;
cursor-context-menu
cursor: context-menu;
cursor-progress
cursor: progress;
cursor-cell
cursor: cell;
cursor-crosshair
cursor: crosshair;
cursor-vertical-text
cursor: vertical-text;
cursor-alias
cursor: alias;
cursor-copy
cursor: copy;
cursor-no-drop
cursor: no-drop;
cursor-grab
cursor: grab;
cursor-grabbing
cursor: grabbing;
cursor-all-scroll
cursor: all-scroll;
cursor-col-resize
cursor: col-resize;
cursor-row-resize
cursor: row-resize;
cursor-n-resize
cursor: n-resize;
cursor-e-resize
cursor: e-resize;
cursor-s-resize
cursor: s-resize;
cursor-w-resize
cursor: w-resize;
cursor-ne-resize
cursor: ne-resize;
cursor-nw-resize
cursor: nw-resize;
cursor-se-resize
cursor: se-resize;
cursor-sw-resize
cursor: sw-resize;
cursor-ew-resize
cursor: ew-resize;
cursor-ns-resize
cursor: ns-resize;
cursor-nesw-resize
cursor: nesw-resize;
cursor-nwse-resize
cursor: nwse-resize;
cursor-zoom-in
cursor: zoom-in;
cursor-zoom-out
cursor: zoom-out;
cursor-(<custom-property>)
cursor: var(<custom-property>);
cursor-[<value>]
cursor: <value>;

Show less
Examples
Basic example
Use utilities like cursor-pointer and cursor-grab to control which cursor is displayed when hovering over an element:
Hover over each button to see the cursor change
SubmitSaving...Confirm
<button class="cursor-pointer ...">Submit</button>
<button class="cursor-progress ...">Saving...</button>
<button class="cursor-not-allowed ..." disabled>Confirm</button>
Using a custom value
Use the cursor-[<value>] syntax to set the cursor based on a completely custom value:
<button class="cursor-[url(hand.cur),_pointer] ...">
 <!-- ... -->
</button>
For CSS variables, you can also use the cursor-(<custom-property>) syntax:
<button class="cursor-(--my-cursor) ...">
 <!-- ... -->
</button>
This is just a shorthand for cursor-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a cursor utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<button class="cursor-not-allowed md:cursor-auto ...">
 <!-- ... -->
</button>
Learn more about using variants in the variants documentation.
color-scheme
field-sizing
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

Interactivity
field-sizing
Utilities for controlling the sizing of form controls.
Class
Styles
field-sizing-fixed
field-sizing: fixed;
field-sizing-content
field-sizing: content;

Examples
Sizing based on content
Use the field-sizing-content utility to allow a form control to adjust it's size based on the content:
Type in the input below to see the size change
<textarea class="field-sizing-content ..." rows="2">
 Latex Salesman, Vanderlay Industries
</textarea>
Using a fixed size
Use the field-sizing-fixed utility to make a form control use a fixed size:
Type in the input below to see the size remain the same
<textarea class="field-sizing-fixed w-80 ..." rows="2">
 Latex Salesman, Vanderlay Industries
</textarea>
Responsive design
Prefix a field-sizing utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<input class="field-sizing-content md:field-sizing-fixed ..." />
Learn more about using variants in the variants documentation.
cursor
pointer-events
On this page
Quick reference
Examples
Sizing based on content
Using a fixed size
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
pointer-events
Utilities for controlling whether an element responds to pointer events.
Class
Styles
pointer-events-auto
pointer-events: auto;
pointer-events-none
pointer-events: none;

Examples
Ignoring pointer events
Use the pointer-events-none utility to make an element ignore pointer events, like :hover and click events:
Click the search icons to see the expected behavior
pointer-events-auto
pointer-events-none
<div class="relative ...">
 <div class="pointer-events-auto absolute ...">
   <svg class="absolute h-5 w-5 text-gray-400">
     <!-- ... -->
   </svg>
 </div>
 <input type="text" placeholder="Search" class="..." />
</div>
<div class="relative ...">
 <div class="pointer-events-none absolute ...">
   <svg class="absolute h-5 w-5 text-gray-400">
     <!-- ... -->
   </svg>
 </div>
 <input type="text" placeholder="Search" class="..." />
</div>
The pointer events will still trigger on child elements and pass-through to elements that are "beneath" the target.
Restoring pointer events
Use the pointer-events-auto utility to revert to the default browser behavior for pointer events:
<div class="pointer-events-none md:pointer-events-auto ...">
 <!-- ... -->
</div>
field-sizing
resize
On this page
Quick reference
Examples
Ignoring pointer events
Restoring pointer events

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
resize
Utilities for controlling how an element can be resized.
Class
Styles
resize-none
resize: none;
resize
resize: both;
resize-y
resize: vertical;
resize-x
resize: horizontal;

Examples
Resizing in all directions
Use resize to make an element horizontally and vertically resizable:
Drag the textarea handle in the demo to see the expected behavior
<textarea class="resize rounded-md ..."></textarea>
Resizing vertically
Use resize-y to make an element vertically resizable:
Drag the textarea handle in the demo to see the expected behavior
<textarea class="resize-y rounded-md ..."></textarea>
Resizing horizontally
Use resize-x to make an element horizontally resizable:
Drag the textarea handle in the demo to see the expected behavior
<textarea class="resize-x rounded-md ..."></textarea>
Prevent resizing
Use resize-none to prevent an element from being resizable:
Notice that the textarea handle is gone
<textarea class="resize-none rounded-md"></textarea>
Responsive design
Prefix a resize utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="resize-none md:resize ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
pointer-events
scroll-behavior
On this page
Quick reference
Examples
Resizing in all directions
Resizing vertically
Resizing horizontally
Prevent resizing
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
scroll-behavior
Utilities for controlling the scroll behavior of an element.
Class
Styles
scroll-auto
scroll-behavior: auto;
scroll-smooth
scroll-behavior: smooth;

Examples
Using smooth scrolling
Use the scroll-smooth utility to enable smooth scrolling within an element:
<html class="scroll-smooth">
 <!-- ... -->
</html>
Setting the scroll-behavior only affects scroll events that are triggered by the browser.
Using normal scrolling
Use the scroll-auto utility to revert to the default browser behavior for scrolling:
<html class="scroll-smooth md:scroll-auto">
 <!-- ... -->
</html>
resize
scroll-margin
On this page
Quick reference
Examples
Using smooth scrolling
Using normal scrolling

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

Interactivity
scroll-margin
Utilities for controlling the scroll offset around items in a snap container.
Class
Styles
scroll-m-<number>
scroll-margin: calc(var(--spacing) * <number>);
-scroll-m-<number>
scroll-margin: calc(var(--spacing) * -<number>);
scroll-m-(<custom-property>)
scroll-margin: var(<custom-property>);
scroll-m-[<value>]
scroll-margin: <value>;
scroll-mx-<number>
scroll-margin-inline: calc(var(--spacing) * <number>);
-scroll-mx-<number>
scroll-margin-inline: calc(var(--spacing) * -<number>);
scroll-mx-(<custom-property>)
scroll-margin-inline: var(<custom-property>);
scroll-mx-[<value>]
scroll-margin-inline: <value>;
scroll-my-<number>
scroll-margin-block: calc(var(--spacing) * <number>);
-scroll-my-<number>
scroll-margin-block: calc(var(--spacing) * -<number>);
scroll-my-(<custom-property>)
scroll-margin-block: var(<custom-property>);
scroll-my-[<value>]
scroll-margin-block: <value>;
scroll-ms-<number>
scroll-margin-inline-start: calc(var(--spacing) * <number>);
-scroll-ms-<number>
scroll-margin-inline-start: calc(var(--spacing) * -<number>);
scroll-ms-(<custom-property>)
scroll-margin-inline-start: var(<custom-property>);
scroll-ms-[<value>]
scroll-margin-inline-start: <value>;
scroll-me-<number>
scroll-margin-inline-end: calc(var(--spacing) * <number>);
-scroll-me-<number>
scroll-margin-inline-end: calc(var(--spacing) * -<number>);
scroll-me-(<custom-property>)
scroll-margin-inline-end: var(<custom-property>);
scroll-me-[<value>]
scroll-margin-inline-end: <value>;
scroll-mt-<number>
scroll-margin-top: calc(var(--spacing) * <number>);
-scroll-mt-<number>
scroll-margin-top: calc(var(--spacing) * -<number>);
scroll-mt-(<custom-property>)
scroll-margin-top: var(<custom-property>);
scroll-mt-[<value>]
scroll-margin-top: <value>;
scroll-mr-<number>
scroll-margin-right: calc(var(--spacing) * <number>);
-scroll-mr-<number>
scroll-margin-right: calc(var(--spacing) * -<number>);
scroll-mr-(<custom-property>)
scroll-margin-right: var(<custom-property>);
scroll-mr-[<value>]
scroll-margin-right: <value>;
scroll-mb-<number>
scroll-margin-bottom: calc(var(--spacing) * <number>);
-scroll-mb-<number>
scroll-margin-bottom: calc(var(--spacing) * -<number>);
scroll-mb-(<custom-property>)
scroll-margin-bottom: var(<custom-property>);
scroll-mb-[<value>]
scroll-margin-bottom: <value>;
scroll-ml-<number>
scroll-margin-left: calc(var(--spacing) * <number>);
-scroll-ml-<number>
scroll-margin-left: calc(var(--spacing) * -<number>);
scroll-ml-(<custom-property>)
scroll-margin-left: var(<custom-property>);
scroll-ml-[<value>]
scroll-margin-left: <value>;

Show less
Examples
Basic example
Use the scroll-mt-<number>, scroll-mr-<number>, scroll-mb-<number>, and scroll-ml-<number> utilities like scroll-ml-4 and scroll-mt-6 to set the scroll offset around items within a snap container:
Scroll in the grid of images to see the expected behavior





<div class="snap-x ...">
 <div class="snap-start scroll-ml-6 ...">
   <img src="/img/vacation-01.jpg"/>
 </div>
 <div class="snap-start scroll-ml-6 ...">
   <img src="/img/vacation-02.jpg"/>
 </div>
 <div class="snap-start scroll-ml-6 ...">
   <img src="/img/vacation-03.jpg"/>
 </div>
 <div class="snap-start scroll-ml-6 ...">
   <img src="/img/vacation-04.jpg"/>
 </div>
 <div class="snap-start scroll-ml-6 ...">
   <img src="/img/vacation-05.jpg"/>
 </div>
</div>
Using negative values
To use a negative scroll margin value, prefix the class name with a dash to convert it to a negative value:
<div class="snap-start -scroll-ml-6 ...">
 <!-- ... -->
</div>
Using logical properties
Use the scroll-ms-<number> and scroll-me-<number> utilities to set the scroll-margin-inline-start and scroll-margin-inline-end logical properties, which map to either the left or right side based on the text direction:
Scroll in the grid of images to see the expected behavior
Left-to-right





Right-to-left





<div dir="ltr">
 <div class="snap-x ...">
   <div class="snap-start scroll-ms-6 ...">
     <img src="/img/vacation-01.jpg"/>
   </div>
   <!-- ... -->
 </div>
</div>
<div dir="rtl">
 <div class="snap-x ...">
   <div class="snap-start scroll-ms-6 ...">
     <img src="/img/vacation-01.jpg"/>
   </div>
   <!-- ... -->
 </div>
</div>
For more control, you can also use the LTR and RTL modifiers to conditionally apply specific styles depending on the current text direction.
Using a custom value
Use utilities like scroll-ml-[<value>] and scroll-me-[<value>] to set the scroll margin based on a completely custom value:
<div class="scroll-ml-[24rem] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the scroll-ml-(<custom-property>) syntax:
<div class="scroll-ml-(--my-scroll-margin) ...">
 <!-- ... -->
</div>
This is just a shorthand for scroll-ml-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a scroll-margin utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="scroll-m-8 md:scroll-m-0 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
The scroll-m-<number>,scroll-mx-<number>,scroll-my-<number>,scroll-ms-<number>,scroll-me-<number>,scroll-mt-<number>,scroll-mr-<number>,scroll-mb-<number>, and scroll-ml-<number> utilities are driven by the --spacing theme variable, which can be customized in your own theme:
@theme {
 --spacing: 1px;
}
Learn more about customizing the spacing scale in the theme variable documentation.
scroll-behavior
scroll-padding
On this page
Quick reference
Examples
Basic example
Using negative values
Using logical properties
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

Interactivity
scroll-padding
Utilities for controlling an element's scroll offset within a snap container.
Class
Styles
scroll-p-<number>
scroll-padding: calc(var(--spacing) * <number>);
-scroll-p-<number>
scroll-padding: calc(var(--spacing) * -<number>);
scroll-p-(<custom-property>)
scroll-padding: var(<custom-property>);
scroll-p-[<value>]
scroll-padding: <value>;
scroll-px-<number>
scroll-padding-inline: calc(var(--spacing) * <number>);
-scroll-px-<number>
scroll-padding-inline: calc(var(--spacing) * -<number>);
scroll-px-(<custom-property>)
scroll-padding-inline: var(<custom-property>);
scroll-px-[<value>]
scroll-padding-inline: <value>;
scroll-py-<number>
scroll-padding-block: calc(var(--spacing) * <number>);
-scroll-py-<number>
scroll-padding-block: calc(var(--spacing) * -<number>);
scroll-py-(<custom-property>)
scroll-padding-block: var(<custom-property>);
scroll-py-[<value>]
scroll-padding-block: <value>;
scroll-ps-<number>
scroll-padding-inline-start: calc(var(--spacing) * <number>);
-scroll-ps-<number>
scroll-padding-inline-start: calc(var(--spacing) * -<number>);
scroll-ps-(<custom-property>)
scroll-padding-inline-start: var(<custom-property>);
scroll-ps-[<value>]
scroll-padding-inline-start: <value>;
scroll-pe-<number>
scroll-padding-inline-end: calc(var(--spacing) * <number>);
-scroll-pe-<number>
scroll-padding-inline-end: calc(var(--spacing) * -<number>);
scroll-pe-(<custom-property>)
scroll-padding-inline-end: var(<custom-property>);
scroll-pe-[<value>]
scroll-padding-inline-end: <value>;
scroll-pt-<number>
scroll-padding-top: calc(var(--spacing) * <number>);
-scroll-pt-<number>
scroll-padding-top: calc(var(--spacing) * -<number>);
scroll-pt-(<custom-property>)
scroll-padding-top: var(<custom-property>);
scroll-pt-[<value>]
scroll-padding-top: <value>;
scroll-pr-<number>
scroll-padding-right: calc(var(--spacing) * <number>);
-scroll-pr-<number>
scroll-padding-right: calc(var(--spacing) * -<number>);
scroll-pr-(<custom-property>)
scroll-padding-right: var(<custom-property>);
scroll-pr-[<value>]
scroll-padding-right: <value>;
scroll-pb-<number>
scroll-padding-bottom: calc(var(--spacing) * <number>);
-scroll-pb-<number>
scroll-padding-bottom: calc(var(--spacing) * -<number>);
scroll-pb-(<custom-property>)
scroll-padding-bottom: var(<custom-property>);
scroll-pb-[<value>]
scroll-padding-bottom: <value>;
scroll-pl-<number>
scroll-padding-left: calc(var(--spacing) * <number>);
-scroll-pl-<number>
scroll-padding-left: calc(var(--spacing) * -<number>);
scroll-pl-(<custom-property>)
scroll-padding-left: var(<custom-property>);
scroll-pl-[<value>]
scroll-padding-left: <value>;

Show less
Examples
Basic example
Use the scroll-pt-<number>, scroll-pr-<number>, scroll-pb-<number>, and scroll-pl-<number> utilities like scroll-pl-4 and scroll-pt-6 to set the scroll offset of an element within a snap container:
Scroll in the grid of images to see the expected behavior





<div class="snap-x scroll-pl-6 ...">
 <div class="snap-start ...">
   <img src="/img/vacation-01.jpg" />
 </div>
 <div class="snap-start ...">
   <img src="/img/vacation-02.jpg" />
 </div>
 <div class="snap-start ...">
   <img src="/img/vacation-03.jpg" />
 </div>
 <div class="snap-start ...">
   <img src="/img/vacation-04.jpg" />
 </div>
 <div class="snap-start ...">
   <img src="/img/vacation-05.jpg" />
 </div>
</div>
Using logical properties
Use the scroll-ps-<number> and scroll-pe-<number> utilities to set the scroll-padding-inline-start and scroll-padding-inline-end logical properties, which map to either the left or right side based on the text direction:
Scroll in the grid of images to see the expected behavior
Left-to-right





Right-to-left





<div dir="ltr">
 <div class="snap-x scroll-ps-6 ...">
   <!-- ... -->
 </div>
</div>
<div dir="rtl">
 <div class="snap-x scroll-ps-6 ...">
   <!-- ... -->
 </div>
</div>
Using negative values
To use a negative scroll padding value, prefix the class name with a dash to convert it to a negative value:
<div class="-scroll-ps-6 snap-x ...">
 <!-- ... -->
</div>
Using a custom value
Use utilities like scroll-pl-[<value>] and scroll-pe-[<value>] to set the scroll padding based on a completely custom value:
<div class="scroll-pl-[24rem] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the scroll-pl-(<custom-property>) syntax:
<div class="scroll-pl-(--my-scroll-padding) ...">
 <!-- ... -->
</div>
This is just a shorthand for scroll-pl-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a scroll-padding utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="scroll-p-8 md:scroll-p-0 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
The scroll-p-<number>,scroll-px-<number>,scroll-py-<number>,scroll-ps-<number>,scroll-pe-<number>,scroll-pt-<number>,scroll-pr-<number>,scroll-pb-<number>, and scroll-pl-<number> utilities are driven by the --spacing theme variable, which can be customized in your own theme:
@theme {
 --spacing: 1px;
}
Learn more about customizing the spacing scale in the theme variable documentation.
scroll-margin
scroll-snap-align
On this page
Quick reference
Examples
Basic example
Using logical properties
Using negative values
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

Interactivity
scroll-snap-align
Utilities for controlling the scroll snap alignment of an element.
Class
Styles
snap-start
scroll-snap-align: start;
snap-end
scroll-snap-align: end;
snap-center
scroll-snap-align: center;
snap-align-none
scroll-snap-align: none;

Examples
Snapping to the center
Use the snap-center utility to snap an element to its center when being scrolled inside a snap container:
Scroll in the grid of images to see the expected behavior
snap point






<div class="snap-x ...">
 <div class="snap-center ...">
   <img src="/img/vacation-01.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-02.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-03.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-04.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-05.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-06.jpg" />
 </div>
</div>
Snapping to the start
Use the snap-start utility to snap an element to its start when being scrolled inside a snap container:
Scroll in the grid of images to see the expected behavior
snap point





<div class="snap-x ...">
 <div class="snap-start ...">
   <img src="/img/vacation-01.jpg" />
 </div>
 <div class="snap-start ...">
   <img src="/img/vacation-02.jpg" />
 </div>
 <div class="snap-start ...">
   <img src="/img/vacation-03.jpg" />
 </div>
 <div class="snap-start ...">
   <img src="/img/vacation-04.jpg" />
 </div>
 <div class="snap-start ...">
   <img src="/img/vacation-05.jpg" />
 </div>
 <div class="snap-start ...">
   <img src="/img/vacation-06.jpg" />
 </div>
</div>
Snapping to the end
Use the snap-end utility to snap an element to its end when being scrolled inside a snap container:
Scroll in the grid of images to see the expected behavior
snap point






<div class="snap-x ...">
 <div class="snap-end ...">
   <img src="/img/vacation-01.jpg" />
 </div>
 <div class="snap-end ...">
   <img src="/img/vacation-02.jpg" />
 </div>
 <div class="snap-end ...">
   <img src="/img/vacation-03.jpg" />
 </div>
 <div class="snap-end ...">
   <img src="/img/vacation-04.jpg" />
 </div>
 <div class="snap-end ...">
   <img src="/img/vacation-05.jpg" />
 </div>
 <div class="snap-end ...">
   <img src="/img/vacation-06.jpg" />
 </div>
</div>
Responsive design
Prefix a scroll-snap-align utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="snap-center md:snap-start ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
scroll-padding
scroll-snap-stop
On this page
Quick reference
Examples
Snapping to the center
Snapping to the start
Snapping to the end
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
scroll-snap-stop
Utilities for controlling whether you can skip past possible snap positions.
Class
Styles
snap-normal
scroll-snap-stop: normal;
snap-always
scroll-snap-stop: always;

Examples
Forcing snap position stops
Use the snap-always utility together with the snap-mandatory utility to force a snap container to always stop on an element before the user can continue scrolling to the next item:
Scroll in the grid of images to see the expected behavior
snap point






<div class="snap-x snap-mandatory ...">
 <div class="snap-center snap-always ...">
   <img src="/img/vacation-01.jpg" />
 </div>
 <div class="snap-center snap-always ...">
   <img src="/img/vacation-02.jpg" />
 </div>
 <div class="snap-center snap-always ...">
   <img src="/img/vacation-03.jpg" />
 </div>
 <div class="snap-center snap-always ...">
   <img src="/img/vacation-04.jpg" />
 </div>
 <div class="snap-center snap-always ...">
   <img src="/img/vacation-05.jpg" />
 </div>
 <div class="snap-center snap-always ...">
   <img src="/img/vacation-06.jpg" />
 </div>
</div>
Skipping snap position stops
Use the snap-normal utility to allow a snap container to skip past possible scroll snap positions:
Scroll in the grid of images to see the expected behavior
snap point






<div class="snap-x ...">
 <div class="snap-center snap-normal ...">
   <img src="/img/vacation-01.jpg" />
 </div>
 <div class="snap-center snap-normal ...">
   <img src="/img/vacation-02.jpg" />
 </div>
 <div class="snap-center snap-normal ...">
   <img src="/img/vacation-03.jpg" />
 </div>
 <div class="snap-center snap-normal ...">
   <img src="/img/vacation-04.jpg" />
 </div>
 <div class="snap-center snap-normal ...">
   <img src="/img/vacation-05.jpg" />
 </div>
 <div class="snap-center snap-normal ...">
   <img src="/img/vacation-06.jpg" />
 </div>
</div>
Responsive design
Prefix a scroll-snap-stop utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="snap-always md:snap-normal ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
scroll-snap-align
scroll-snap-type
On this page
Quick reference
Examples
Forcing snap position stops
Skipping snap position stops
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
scroll-snap-type
Utilities for controlling how strictly snap points are enforced in a snap container.
Class
Styles
snap-none
scroll-snap-type: none;
snap-x
scroll-snap-type: x var(--tw-scroll-snap-strictness);
snap-y
scroll-snap-type: y var(--tw-scroll-snap-strictness);
snap-both
scroll-snap-type: both var(--tw-scroll-snap-strictness);
snap-mandatory
--tw-scroll-snap-strictness: mandatory;
snap-proximity
--tw-scroll-snap-strictness: proximity;

Examples
Horizontal scroll snapping
Use the snap-x utility to enable horizontal scroll snapping within an element:
Scroll in the grid of images to see the expected behavior
snap point






<div class="snap-x ...">
 <div class="snap-center ...">
   <img src="/img/vacation-01.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-02.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-03.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-04.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-05.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-06.jpg" />
 </div>
</div>
For scroll snapping to work, you need to also set the scroll snap alignment on the children.
Mandatory scroll snapping
Use the snap-mandatory utility to force a snap container to always come to rest on a snap point:
Scroll in the grid of images to see the expected behavior
snap point






<div class="snap-x snap-mandatory ...">
 <div class="snap-center ...">
   <img src="/img/vacation-01.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-02.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-03.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-04.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-05.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-06.jpg" />
 </div>
</div>
Proximity scroll snapping
Use the snap-proximity utility to make a snap container come to rest on snap points that are close in proximity:
Scroll in the grid of images to see the expected behavior
snap point





<div class="snap-x snap-proximity ...">
 <div class="snap-center ...">
   <img src="/img/vacation-01.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-02.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-03.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-04.jpg" />
 </div>
 <div class="snap-center ...">
   <img src="/img/vacation-05.jpg" />
 </div>
</div>
Responsive design
Prefix a scroll-snap-type utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="snap-none md:snap-x ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
scroll-snap-stop
touch-action
On this page
Quick reference
Examples
Horizontal scroll snapping
Mandatory scroll snapping
Proximity scroll snapping
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

Interactivity
touch-action
Utilities for controlling how an element can be scrolled and zoomed on touchscreens.
Class
Styles
touch-auto
touch-action: auto;
touch-none
touch-action: none;
touch-pan-x
touch-action: pan-x;
touch-pan-left
touch-action: pan-left;
touch-pan-right
touch-action: pan-right;
touch-pan-y
touch-action: pan-y;
touch-pan-up
touch-action: pan-up;
touch-pan-down
touch-action: pan-down;
touch-pinch-zoom
touch-action: pinch-zoom;
touch-manipulation
touch-action: manipulation;

Examples
Basic example
Use utilities like touch-pan-y and touch-pinch-zoom to control how an element can be scrolled (panned) and zoomed (pinched) on touchscreens:
Try panning these images on a touchscreen
touch-auto

touch-none

touch-pan-x

touch-pan-y

<div class="h-48 w-full touch-auto overflow-auto ...">
 <img class="h-auto w-[150%] max-w-none" src="..." />
</div>
<div class="h-48 w-full touch-none overflow-auto ...">
 <img class="h-auto w-[150%] max-w-none" src="..." />
</div>
<div class="h-48 w-full touch-pan-x overflow-auto ...">
 <img class="h-auto w-[150%] max-w-none" src="..." />
</div>
<div class="h-48 w-full touch-pan-y overflow-auto ...">
 <img class="h-auto w-[150%] max-w-none" src="..." />
</div>
Responsive design
Prefix a touch-action utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="touch-pan-x md:touch-auto ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
scroll-snap-type
user-select
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

Interactivity
user-select
Utilities for controlling whether the user can select text in an element.
Class
Styles
select-none
user-select: none;
select-text
user-select: text;
select-all
user-select: all;
select-auto
user-select: auto;

Examples
Disabling text selection
Use the select-none utility to prevent selecting text in an element and its children:
Try selecting the text to see the expected behavior
<div class="select-none ...">The quick brown fox jumps over the lazy dog.</div>
Allowing text selection
Use the select-text utility to allow selecting text in an element and its children:
Try selecting the text to see the expected behavior
The quick brown fox jumps over the lazy dog.
<div class="select-text ...">The quick brown fox jumps over the lazy dog.</div>
Selecting all text in one click
Use the select-all utility to automatically select all the text in an element when a user clicks:
Try clicking the text to see the expected behavior
The quick brown fox jumps over the lazy dog.
<div class="select-all ...">The quick brown fox jumps over the lazy dog.</div>
Using auto select behavior
Use the select-auto utility to use the default browser behavior for selecting text:
Try selecting the text to see the expected behavior
The quick brown fox jumps over the lazy dog.
<div class="select-auto ...">The quick brown fox jumps over the lazy dog.</div>
Responsive design
Prefix an user-select utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="select-none md:select-all ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
touch-action
will-change
On this page
Quick reference
Examples
Disabling text selection
Allowing text selection
Selecting all text in one click
Using auto select behavior
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

Interactivity
will-change
Utilities for optimizing upcoming animations of elements that are expected to change.
Class
Styles
will-change-auto
will-change: auto;
will-change-scroll
will-change: scroll-position;
will-change-contents
will-change: contents;
will-change-transform
will-change: transform;
will-change-<custom-property>
will-change: var(<custom-property>);
will-change-[<value>]
will-change: <value>;

Examples
Optimizing with will change
Use the will-change-scroll, will-change-contents and will-change-transform utilities to optimize an element that's expected to change in the near future by instructing the browser to prepare the necessary animation before it actually begins:
<div class="overflow-auto will-change-scroll">
 <!-- ... -->
</div>
It's recommended that you apply these utilities just before an element changes, and then remove it shortly after it finishes using will-change-auto.
The will-change property is intended to be used as a last resort when dealing with known performance problems. Avoid using these utilities too much, or simply in anticipation of performance issues, as it could actually cause the page to be less performant.
Using a custom value
Use the will-change-[<value>] syntax to set the will-change property based on a completely custom value:
<div class="will-change-[top,left] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the will-change-(<custom-property>) syntax:
<div class="will-change-(--my-properties) ...">
 <!-- ... -->
</div>
This is just a shorthand for will-change-[var(<custom-property>)] that adds the var() function for you automatically.
user-select
fill
On this page
Quick reference
Examples
Optimizing with will change
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
SVG
stroke
Utilities for styling the stroke of SVG elements.
Class
Styles
stroke-none
stroke: none;
stroke-inherit
stroke: inherit;
stroke-current
stroke: currentColor;
stroke-transparent
stroke: transparent;
stroke-black
stroke: var(--color-black); /* #000 */
stroke-white
stroke: var(--color-white); /* #fff */
stroke-red-50
stroke: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */
stroke-red-100
stroke: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */
stroke-red-200
stroke: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */
stroke-red-300
stroke: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */

































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































Show more
Examples
Basic example
Use utilities like stroke-indigo-500 and stroke-lime-600 to change the stroke color of an SVG:
<svg class="stroke-cyan-500 ...">
 <!-- ... -->
</svg>
This can be useful for styling icon sets like Heroicons.
Using the current color
Use the stroke-current utility to set the stroke color to the current text color:
Hover over the button to see the stroke color change
Download file
<button class="bg-white text-pink-600 hover:bg-pink-600 hover:text-white ...">
 <svg class="size-5 stroke-current ..." fill="none">
   <!-- ... -->
 </svg>
 Download file
</button>
Using a custom value
Use the stroke-[<value>] syntax to set the stroke color based on a completely custom value:
<svg class="stroke-[#243c5a] ...">
 <!-- ... -->
</svg>
For CSS variables, you can also use the stroke-(<custom-property>) syntax:
<svg class="stroke-(--my-stroke-color) ...">
 <!-- ... -->
</svg>
This is just a shorthand for stroke-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a stroke utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<svg class="stroke-cyan-500 md:stroke-cyan-700 ...">
 <!-- ... -->
</svg>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --color-* theme variables to customize the color utilities in your project:
@theme {
 --color-regal-blue: #243c5a;
}
Now the stroke-regal-blue utility can be used in your markup:
<svg class="stroke-regal-blue">
 <!-- ... -->
</svg>
Learn more about customizing your theme in the theme documentation.
fill
stroke-width
On this page
Quick reference
Examples
Basic example
Using the current color
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

SVG
stroke-width
Utilities for styling the stroke width of SVG elements.
Class
Styles
stroke-<number>
stroke-width: <number>;
stroke-(length:<custom-property>)
stroke-width: var(<custom-property>);
stroke-[<value>]
stroke-width: <value>;

Examples
Basic example
Use stroke-<number> utilities like stroke-1 and stroke-2 to set the stroke width of an SVG:
<svg class="stroke-1 ..."></svg>
<svg class="stroke-2 ..."></svg>
This can be useful for styling icon sets like Heroicons.
Using a custom value
Use the stroke-[<value>] syntax to set the stroke width based on a completely custom value:
<div class="stroke-[1.5] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the stroke-(length:<custom-property>) syntax:
<div class="stroke-(length:--my-stroke-width) ...">
 <!-- ... -->
</div>
This is just a shorthand for stroke-[length:var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a stroke-width utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="stroke-1 md:stroke-2 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
stroke
forced-color-adjust
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

Accessibility
forced-color-adjust
Utilities for opting in and out of forced colors.
Class
Styles
forced-color-adjust-auto
forced-color-adjust: auto;
forced-color-adjust-none
forced-color-adjust: none;

Examples
Opting out of forced colors
Use the forced-color-adjust-none utility to opt an element out of the colors enforced by forced colors mode. This is useful in situations where enforcing a limited color palette will degrade usability.
Try emulating `forced-colors: active` in your developer tools to see the changes

Basic Tee
$35
Choose a color
White
Gray
Black
<form>
 <img src="/img/shirt.jpg" />
 <div>
   <h3>Basic Tee</h3>
   <h3>$35</h3>
   <fieldset>
     <legend class="sr-only">Choose a color</legend>
     <div class="forced-color-adjust-none ...">
       <label>
         <input class="sr-only" type="radio" name="color-choice" value="White" />
         <span class="sr-only">White</span>
         <span class="size-6 rounded-full border border-black/10 bg-white"></span>
       </label>
       <!-- ... -->
     </div>
   </fieldset>
 </div>
</form>
You can also use the forced colors variant to conditionally add styles when the user has enabled a forced color mode.
Restoring forced colors
Use the forced-color-adjust-auto utility to make an element adhere to colors enforced by forced colors mode:
<form>
 <fieldset class="forced-color-adjust-none lg:forced-color-adjust-auto ...">
   <legend>Choose a color:</legend>
   <select class="hidden lg:block">
     <option value="White">White</option>
     <option value="Gray">Gray</option>
     <option value="Black">Black</option>
   </select>
   <div class="lg:hidden">
     <label>
       <input class="sr-only" type="radio" name="color-choice" value="White" />
       <!-- ... -->
     </label>
     <!-- ... -->
   </div>
 </fieldset>
</form>
This can be useful if you want to undo the forced-color-adjust-none utility, for example on a larger screen size.
Responsive design
Prefix a forced-color-adjust utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="forced-color-adjust-none md:forced-color-adjust-auto ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
stroke-width
On this page
Quick reference
Examples
Opting out of forced colors
Restoring forced colors
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


SVG
fill
Utilities for styling the fill of SVG elements.
Class
Styles
fill-none
fill: none;
fill-inherit
fill: inherit;
fill-current
fill: currentColor;
fill-transparent
fill: transparent;
fill-black
fill: var(--color-black); /* #000 */
fill-white
fill: var(--color-white); /* #fff */
fill-red-50
fill: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */
fill-red-100
fill: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */
fill-red-200
fill: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */
fill-red-300
fill: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */
fill-red-400
fill: var(--color-red-400); /* oklch(70.4% 0.191 22.216) */
fill-red-500
fill: var(--color-red-500); /* oklch(63.7% 0.237 25.331) */
fill-red-600
fill: var(--color-red-600); /* oklch(57.7% 0.245 27.325) */
fill-red-700
fill: var(--color-red-700); /* oklch(50.5% 0.213 27.518) */
fill-red-800
fill: var(--color-red-800); /* oklch(44.4% 0.177 26.899) */
fill-red-900
fill: var(--color-red-900); /* oklch(39.6% 0.141 25.723) */
fill-red-950
fill: var(--color-red-950); /* oklch(25.8% 0.092 26.042) */
fill-orange-50
fill: var(--color-orange-50); /* oklch(98% 0.016 73.684) */
fill-orange-100
fill: var(--color-orange-100); /* oklch(95.4% 0.038 75.164) */
fill-orange-200
fill: var(--color-orange-200); /* oklch(90.1% 0.076 70.697) */
fill-orange-300
fill: var(--color-orange-300); /* oklch(83.7% 0.128 66.29) */
fill-orange-400
fill: var(--color-orange-400); /* oklch(75% 0.183 55.934) */
fill-orange-500
fill: var(--color-orange-500); /* oklch(70.5% 0.213 47.604) */
fill-orange-600
fill: var(--color-orange-600); /* oklch(64.6% 0.222 41.116) */
fill-orange-700
fill: var(--color-orange-700); /* oklch(55.3% 0.195 38.402) */
fill-orange-800
fill: var(--color-orange-800); /* oklch(47% 0.157 37.304) */
fill-orange-900
fill: var(--color-orange-900); /* oklch(40.8% 0.123 38.172) */
fill-orange-950
fill: var(--color-orange-950); /* oklch(26.6% 0.079 36.259) */
fill-amber-50
fill: var(--color-amber-50); /* oklch(98.7% 0.022 95.277) */
fill-amber-100
fill: var(--color-amber-100); /* oklch(96.2% 0.059 95.617) */
fill-amber-200
fill: var(--color-amber-200); /* oklch(92.4% 0.12 95.746) */
fill-amber-300
fill: var(--color-amber-300); /* oklch(87.9% 0.169 91.605) */
fill-amber-400
fill: var(--color-amber-400); /* oklch(82.8% 0.189 84.429) */
fill-amber-500
fill: var(--color-amber-500); /* oklch(76.9% 0.188 70.08) */
fill-amber-600
fill: var(--color-amber-600); /* oklch(66.6% 0.179 58.318) */
fill-amber-700
fill: var(--color-amber-700); /* oklch(55.5% 0.163 48.998) */
fill-amber-800
fill: var(--color-amber-800); /* oklch(47.3% 0.137 46.201) */
fill-amber-900
fill: var(--color-amber-900); /* oklch(41.4% 0.112 45.904) */
fill-amber-950
fill: var(--color-amber-950); /* oklch(27.9% 0.077 45.635) */
fill-yellow-50
fill: var(--color-yellow-50); /* oklch(98.7% 0.026 102.212) */
fill-yellow-100
fill: var(--color-yellow-100); /* oklch(97.3% 0.071 103.193) */
fill-yellow-200
fill: var(--color-yellow-200); /* oklch(94.5% 0.129 101.54) */
fill-yellow-300
fill: var(--color-yellow-300); /* oklch(90.5% 0.182 98.111) */
fill-yellow-400
fill: var(--color-yellow-400); /* oklch(85.2% 0.199 91.936) */
fill-yellow-500
fill: var(--color-yellow-500); /* oklch(79.5% 0.184 86.047) */
fill-yellow-600
fill: var(--color-yellow-600); /* oklch(68.1% 0.162 75.834) */
fill-yellow-700
fill: var(--color-yellow-700); /* oklch(55.4% 0.135 66.442) */
fill-yellow-800
fill: var(--color-yellow-800); /* oklch(47.6% 0.114 61.907) */
fill-yellow-900
fill: var(--color-yellow-900); /* oklch(42.1% 0.095 57.708) */
fill-yellow-950
fill: var(--color-yellow-950); /* oklch(28.6% 0.066 53.813) */
fill-lime-50
fill: var(--color-lime-50); /* oklch(98.6% 0.031 120.757) */
fill-lime-100
fill: var(--color-lime-100); /* oklch(96.7% 0.067 122.328) */
fill-lime-200
fill: var(--color-lime-200); /* oklch(93.8% 0.127 124.321) */
fill-lime-300
fill: var(--color-lime-300); /* oklch(89.7% 0.196 126.665) */
fill-lime-400
fill: var(--color-lime-400); /* oklch(84.1% 0.238 128.85) */
fill-lime-500
fill: var(--color-lime-500); /* oklch(76.8% 0.233 130.85) */
fill-lime-600
fill: var(--color-lime-600); /* oklch(64.8% 0.2 131.684) */
fill-lime-700
fill: var(--color-lime-700); /* oklch(53.2% 0.157 131.589) */
fill-lime-800
fill: var(--color-lime-800); /* oklch(45.3% 0.124 130.933) */
fill-lime-900
fill: var(--color-lime-900); /* oklch(40.5% 0.101 131.063) */
fill-lime-950
fill: var(--color-lime-950); /* oklch(27.4% 0.072 132.109) */
fill-green-50
fill: var(--color-green-50); /* oklch(98.2% 0.018 155.826) */
fill-green-100
fill: var(--color-green-100); /* oklch(96.2% 0.044 156.743) */
fill-green-200
fill: var(--color-green-200); /* oklch(92.5% 0.084 155.995) */
fill-green-300
fill: var(--color-green-300); /* oklch(87.1% 0.15 154.449) */
fill-green-400
fill: var(--color-green-400); /* oklch(79.2% 0.209 151.711) */
fill-green-500
fill: var(--color-green-500); /* oklch(72.3% 0.219 149.579) */
fill-green-600
fill: var(--color-green-600); /* oklch(62.7% 0.194 149.214) */
fill-green-700
fill: var(--color-green-700); /* oklch(52.7% 0.154 150.069) */
fill-green-800
fill: var(--color-green-800); /* oklch(44.8% 0.119 151.328) */
fill-green-900
fill: var(--color-green-900); /* oklch(39.3% 0.095 152.535) */
fill-green-950
fill: var(--color-green-950); /* oklch(26.6% 0.065 152.934) */
fill-emerald-50
fill: var(--color-emerald-50); /* oklch(97.9% 0.021 166.113) */
fill-emerald-100
fill: var(--color-emerald-100); /* oklch(95% 0.052 163.051) */
fill-emerald-200
fill: var(--color-emerald-200); /* oklch(90.5% 0.093 164.15) */
fill-emerald-300
fill: var(--color-emerald-300); /* oklch(84.5% 0.143 164.978) */
fill-emerald-400
fill: var(--color-emerald-400); /* oklch(76.5% 0.177 163.223) */
fill-emerald-500
fill: var(--color-emerald-500); /* oklch(69.6% 0.17 162.48) */
fill-emerald-600
fill: var(--color-emerald-600); /* oklch(59.6% 0.145 163.225) */
fill-emerald-700
fill: var(--color-emerald-700); /* oklch(50.8% 0.118 165.612) */
fill-emerald-800
fill: var(--color-emerald-800); /* oklch(43.2% 0.095 166.913) */
fill-emerald-900
fill: var(--color-emerald-900); /* oklch(37.8% 0.077 168.94) */
fill-emerald-950
fill: var(--color-emerald-950); /* oklch(26.2% 0.051 172.552) */
fill-teal-50
fill: var(--color-teal-50); /* oklch(98.4% 0.014 180.72) */
fill-teal-100
fill: var(--color-teal-100); /* oklch(95.3% 0.051 180.801) */
fill-teal-200
fill: var(--color-teal-200); /* oklch(91% 0.096 180.426) */
fill-teal-300
fill: var(--color-teal-300); /* oklch(85.5% 0.138 181.071) */
fill-teal-400
fill: var(--color-teal-400); /* oklch(77.7% 0.152 181.912) */
fill-teal-500
fill: var(--color-teal-500); /* oklch(70.4% 0.14 182.503) */
fill-teal-600
fill: var(--color-teal-600); /* oklch(60% 0.118 184.704) */
fill-teal-700
fill: var(--color-teal-700); /* oklch(51.1% 0.096 186.391) */
fill-teal-800
fill: var(--color-teal-800); /* oklch(43.7% 0.078 188.216) */
fill-teal-900
fill: var(--color-teal-900); /* oklch(38.6% 0.063 188.416) */
fill-teal-950
fill: var(--color-teal-950); /* oklch(27.7% 0.046 192.524) */
fill-cyan-50
fill: var(--color-cyan-50); /* oklch(98.4% 0.019 200.873) */
fill-cyan-100
fill: var(--color-cyan-100); /* oklch(95.6% 0.045 203.388) */
fill-cyan-200
fill: var(--color-cyan-200); /* oklch(91.7% 0.08 205.041) */
fill-cyan-300
fill: var(--color-cyan-300); /* oklch(86.5% 0.127 207.078) */
fill-cyan-400
fill: var(--color-cyan-400); /* oklch(78.9% 0.154 211.53) */
fill-cyan-500
fill: var(--color-cyan-500); /* oklch(71.5% 0.143 215.221) */
fill-cyan-600
fill: var(--color-cyan-600); /* oklch(60.9% 0.126 221.723) */
fill-cyan-700
fill: var(--color-cyan-700); /* oklch(52% 0.105 223.128) */
fill-cyan-800
fill: var(--color-cyan-800); /* oklch(45% 0.085 224.283) */
fill-cyan-900
fill: var(--color-cyan-900); /* oklch(39.8% 0.07 227.392) */
fill-cyan-950
fill: var(--color-cyan-950); /* oklch(30.2% 0.056 229.695) */
fill-sky-50
fill: var(--color-sky-50); /* oklch(97.7% 0.013 236.62) */
fill-sky-100
fill: var(--color-sky-100); /* oklch(95.1% 0.026 236.824) */
fill-sky-200
fill: var(--color-sky-200); /* oklch(90.1% 0.058 230.902) */
fill-sky-300
fill: var(--color-sky-300); /* oklch(82.8% 0.111 230.318) */
fill-sky-400
fill: var(--color-sky-400); /* oklch(74.6% 0.16 232.661) */
fill-sky-500
fill: var(--color-sky-500); /* oklch(68.5% 0.169 237.323) */
fill-sky-600
fill: var(--color-sky-600); /* oklch(58.8% 0.158 241.966) */
fill-sky-700
fill: var(--color-sky-700); /* oklch(50% 0.134 242.749) */
fill-sky-800
fill: var(--color-sky-800); /* oklch(44.3% 0.11 240.79) */
fill-sky-900
fill: var(--color-sky-900); /* oklch(39.1% 0.09 240.876) */
fill-sky-950
fill: var(--color-sky-950); /* oklch(29.3% 0.066 243.157) */
fill-blue-50
fill: var(--color-blue-50); /* oklch(97% 0.014 254.604) */
fill-blue-100
fill: var(--color-blue-100); /* oklch(93.2% 0.032 255.585) */
fill-blue-200
fill: var(--color-blue-200); /* oklch(88.2% 0.059 254.128) */
fill-blue-300
fill: var(--color-blue-300); /* oklch(80.9% 0.105 251.813) */
fill-blue-400
fill: var(--color-blue-400); /* oklch(70.7% 0.165 254.624) */
fill-blue-500
fill: var(--color-blue-500); /* oklch(62.3% 0.214 259.815) */
fill-blue-600
fill: var(--color-blue-600); /* oklch(54.6% 0.245 262.881) */
fill-blue-700
fill: var(--color-blue-700); /* oklch(48.8% 0.243 264.376) */
fill-blue-800
fill: var(--color-blue-800); /* oklch(42.4% 0.199 265.638) */
fill-blue-900
fill: var(--color-blue-900); /* oklch(37.9% 0.146 265.522) */
fill-blue-950
fill: var(--color-blue-950); /* oklch(28.2% 0.091 267.935) */
fill-indigo-50
fill: var(--color-indigo-50); /* oklch(96.2% 0.018 272.314) */
fill-indigo-100
fill: var(--color-indigo-100); /* oklch(93% 0.034 272.788) */
fill-indigo-200
fill: var(--color-indigo-200); /* oklch(87% 0.065 274.039) */
fill-indigo-300
fill: var(--color-indigo-300); /* oklch(78.5% 0.115 274.713) */
fill-indigo-400
fill: var(--color-indigo-400); /* oklch(67.3% 0.182 276.935) */
fill-indigo-500
fill: var(--color-indigo-500); /* oklch(58.5% 0.233 277.117) */
fill-indigo-600
fill: var(--color-indigo-600); /* oklch(51.1% 0.262 276.966) */
fill-indigo-700
fill: var(--color-indigo-700); /* oklch(45.7% 0.24 277.023) */
fill-indigo-800
fill: var(--color-indigo-800); /* oklch(39.8% 0.195 277.366) */
fill-indigo-900
fill: var(--color-indigo-900); /* oklch(35.9% 0.144 278.697) */
fill-indigo-950
fill: var(--color-indigo-950); /* oklch(25.7% 0.09 281.288) */
fill-violet-50
fill: var(--color-violet-50); /* oklch(96.9% 0.016 293.756) */
fill-violet-100
fill: var(--color-violet-100); /* oklch(94.3% 0.029 294.588) */
fill-violet-200
fill: var(--color-violet-200); /* oklch(89.4% 0.057 293.283) */
fill-violet-300
fill: var(--color-violet-300); /* oklch(81.1% 0.111 293.571) */
fill-violet-400
fill: var(--color-violet-400); /* oklch(70.2% 0.183 293.541) */
fill-violet-500
fill: var(--color-violet-500); /* oklch(60.6% 0.25 292.717) */
fill-violet-600
fill: var(--color-violet-600); /* oklch(54.1% 0.281 293.009) */
fill-violet-700
fill: var(--color-violet-700); /* oklch(49.1% 0.27 292.581) */
fill-violet-800
fill: var(--color-violet-800); /* oklch(43.2% 0.232 292.759) */
fill-violet-900
fill: var(--color-violet-900); /* oklch(38% 0.189 293.745) */
fill-violet-950
fill: var(--color-violet-950); /* oklch(28.3% 0.141 291.089) */
fill-purple-50
fill: var(--color-purple-50); /* oklch(97.7% 0.014 308.299) */
fill-purple-100
fill: var(--color-purple-100); /* oklch(94.6% 0.033 307.174) */
fill-purple-200
fill: var(--color-purple-200); /* oklch(90.2% 0.063 306.703) */
fill-purple-300
fill: var(--color-purple-300); /* oklch(82.7% 0.119 306.383) */
fill-purple-400
fill: var(--color-purple-400); /* oklch(71.4% 0.203 305.504) */
fill-purple-500
fill: var(--color-purple-500); /* oklch(62.7% 0.265 303.9) */
fill-purple-600
fill: var(--color-purple-600); /* oklch(55.8% 0.288 302.321) */
fill-purple-700
fill: var(--color-purple-700); /* oklch(49.6% 0.265 301.924) */
fill-purple-800
fill: var(--color-purple-800); /* oklch(43.8% 0.218 303.724) */
fill-purple-900
fill: var(--color-purple-900); /* oklch(38.1% 0.176 304.987) */
fill-purple-950
fill: var(--color-purple-950); /* oklch(29.1% 0.149 302.717) */
fill-fuchsia-50
fill: var(--color-fuchsia-50); /* oklch(97.7% 0.017 320.058) */
fill-fuchsia-100
fill: var(--color-fuchsia-100); /* oklch(95.2% 0.037 318.852) */
fill-fuchsia-200
fill: var(--color-fuchsia-200); /* oklch(90.3% 0.076 319.62) */
fill-fuchsia-300
fill: var(--color-fuchsia-300); /* oklch(83.3% 0.145 321.434) */
fill-fuchsia-400
fill: var(--color-fuchsia-400); /* oklch(74% 0.238 322.16) */
fill-fuchsia-500
fill: var(--color-fuchsia-500); /* oklch(66.7% 0.295 322.15) */
fill-fuchsia-600
fill: var(--color-fuchsia-600); /* oklch(59.1% 0.293 322.896) */
fill-fuchsia-700
fill: var(--color-fuchsia-700); /* oklch(51.8% 0.253 323.949) */
fill-fuchsia-800
fill: var(--color-fuchsia-800); /* oklch(45.2% 0.211 324.591) */
fill-fuchsia-900
fill: var(--color-fuchsia-900); /* oklch(40.1% 0.17 325.612) */
fill-fuchsia-950
fill: var(--color-fuchsia-950); /* oklch(29.3% 0.136 325.661) */
fill-pink-50
fill: var(--color-pink-50); /* oklch(97.1% 0.014 343.198) */
fill-pink-100
fill: var(--color-pink-100); /* oklch(94.8% 0.028 342.258) */
fill-pink-200
fill: var(--color-pink-200); /* oklch(89.9% 0.061 343.231) */
fill-pink-300
fill: var(--color-pink-300); /* oklch(82.3% 0.12 346.018) */
fill-pink-400
fill: var(--color-pink-400); /* oklch(71.8% 0.202 349.761) */
fill-pink-500
fill: var(--color-pink-500); /* oklch(65.6% 0.241 354.308) */
fill-pink-600
fill: var(--color-pink-600); /* oklch(59.2% 0.249 0.584) */
fill-pink-700
fill: var(--color-pink-700); /* oklch(52.5% 0.223 3.958) */
fill-pink-800
fill: var(--color-pink-800); /* oklch(45.9% 0.187 3.815) */
fill-pink-900
fill: var(--color-pink-900); /* oklch(40.8% 0.153 2.432) */
fill-pink-950
fill: var(--color-pink-950); /* oklch(28.4% 0.109 3.907) */
fill-rose-50
fill: var(--color-rose-50); /* oklch(96.9% 0.015 12.422) */
fill-rose-100
fill: var(--color-rose-100); /* oklch(94.1% 0.03 12.58) */
fill-rose-200
fill: var(--color-rose-200); /* oklch(89.2% 0.058 10.001) */
fill-rose-300
fill: var(--color-rose-300); /* oklch(81% 0.117 11.638) */
fill-rose-400
fill: var(--color-rose-400); /* oklch(71.2% 0.194 13.428) */
fill-rose-500
fill: var(--color-rose-500); /* oklch(64.5% 0.246 16.439) */
fill-rose-600
fill: var(--color-rose-600); /* oklch(58.6% 0.253 17.585) */
fill-rose-700
fill: var(--color-rose-700); /* oklch(51.4% 0.222 16.935) */
fill-rose-800
fill: var(--color-rose-800); /* oklch(45.5% 0.188 13.697) */
fill-rose-900
fill: var(--color-rose-900); /* oklch(41% 0.159 10.272) */
fill-rose-950
fill: var(--color-rose-950); /* oklch(27.1% 0.105 12.094) */
fill-slate-50
fill: var(--color-slate-50); /* oklch(98.4% 0.003 247.858) */
fill-slate-100
fill: var(--color-slate-100); /* oklch(96.8% 0.007 247.896) */
fill-slate-200
fill: var(--color-slate-200); /* oklch(92.9% 0.013 255.508) */
fill-slate-300
fill: var(--color-slate-300); /* oklch(86.9% 0.022 252.894) */
fill-slate-400
fill: var(--color-slate-400); /* oklch(70.4% 0.04 256.788) */
fill-slate-500
fill: var(--color-slate-500); /* oklch(55.4% 0.046 257.417) */
fill-slate-600
fill: var(--color-slate-600); /* oklch(44.6% 0.043 257.281) */
fill-slate-700
fill: var(--color-slate-700); /* oklch(37.2% 0.044 257.287) */
fill-slate-800
fill: var(--color-slate-800); /* oklch(27.9% 0.041 260.031) */
fill-slate-900
fill: var(--color-slate-900); /* oklch(20.8% 0.042 265.755) */
fill-slate-950
fill: var(--color-slate-950); /* oklch(12.9% 0.042 264.695) */
fill-gray-50
fill: var(--color-gray-50); /* oklch(98.5% 0.002 247.839) */
fill-gray-100
fill: var(--color-gray-100); /* oklch(96.7% 0.003 264.542) */
fill-gray-200
fill: var(--color-gray-200); /* oklch(92.8% 0.006 264.531) */
fill-gray-300
fill: var(--color-gray-300); /* oklch(87.2% 0.01 258.338) */
fill-gray-400
fill: var(--color-gray-400); /* oklch(70.7% 0.022 261.325) */
fill-gray-500
fill: var(--color-gray-500); /* oklch(55.1% 0.027 264.364) */
fill-gray-600
fill: var(--color-gray-600); /* oklch(44.6% 0.03 256.802) */
fill-gray-700
fill: var(--color-gray-700); /* oklch(37.3% 0.034 259.733) */
fill-gray-800
fill: var(--color-gray-800); /* oklch(27.8% 0.033 256.848) */
fill-gray-900
fill: var(--color-gray-900); /* oklch(21% 0.034 264.665) */
fill-gray-950
fill: var(--color-gray-950); /* oklch(13% 0.028 261.692) */
fill-zinc-50
fill: var(--color-zinc-50); /* oklch(98.5% 0 0) */
fill-zinc-100
fill: var(--color-zinc-100); /* oklch(96.7% 0.001 286.375) */
fill-zinc-200
fill: var(--color-zinc-200); /* oklch(92% 0.004 286.32) */
fill-zinc-300
fill: var(--color-zinc-300); /* oklch(87.1% 0.006 286.286) */
fill-zinc-400
fill: var(--color-zinc-400); /* oklch(70.5% 0.015 286.067) */
fill-zinc-500
fill: var(--color-zinc-500); /* oklch(55.2% 0.016 285.938) */
fill-zinc-600
fill: var(--color-zinc-600); /* oklch(44.2% 0.017 285.786) */
fill-zinc-700
fill: var(--color-zinc-700); /* oklch(37% 0.013 285.805) */
fill-zinc-800
fill: var(--color-zinc-800); /* oklch(27.4% 0.006 286.033) */
fill-zinc-900
fill: var(--color-zinc-900); /* oklch(21% 0.006 285.885) */
fill-zinc-950
fill: var(--color-zinc-950); /* oklch(14.1% 0.005 285.823) */
fill-neutral-50
fill: var(--color-neutral-50); /* oklch(98.5% 0 0) */
fill-neutral-100
fill: var(--color-neutral-100); /* oklch(97% 0 0) */
fill-neutral-200
fill: var(--color-neutral-200); /* oklch(92.2% 0 0) */
fill-neutral-300
fill: var(--color-neutral-300); /* oklch(87% 0 0) */
fill-neutral-400
fill: var(--color-neutral-400); /* oklch(70.8% 0 0) */
fill-neutral-500
fill: var(--color-neutral-500); /* oklch(55.6% 0 0) */
fill-neutral-600
fill: var(--color-neutral-600); /* oklch(43.9% 0 0) */
fill-neutral-700
fill: var(--color-neutral-700); /* oklch(37.1% 0 0) */
fill-neutral-800
fill: var(--color-neutral-800); /* oklch(26.9% 0 0) */
fill-neutral-900
fill: var(--color-neutral-900); /* oklch(20.5% 0 0) */
fill-neutral-950
fill: var(--color-neutral-950); /* oklch(14.5% 0 0) */
fill-stone-50
fill: var(--color-stone-50); /* oklch(98.5% 0.001 106.423) */
fill-stone-100
fill: var(--color-stone-100); /* oklch(97% 0.001 106.424) */
fill-stone-200
fill: var(--color-stone-200); /* oklch(92.3% 0.003 48.717) */
fill-stone-300
fill: var(--color-stone-300); /* oklch(86.9% 0.005 56.366) */
fill-stone-400
fill: var(--color-stone-400); /* oklch(70.9% 0.01 56.259) */
fill-stone-500
fill: var(--color-stone-500); /* oklch(55.3% 0.013 58.071) */
fill-stone-600
fill: var(--color-stone-600); /* oklch(44.4% 0.011 73.639) */
fill-stone-700
fill: var(--color-stone-700); /* oklch(37.4% 0.01 67.558) */
fill-stone-800
fill: var(--color-stone-800); /* oklch(26.8% 0.007 34.298) */
fill-stone-900
fill: var(--color-stone-900); /* oklch(21.6% 0.006 56.043) */
fill-stone-950
fill: var(--color-stone-950); /* oklch(14.7% 0.004 49.25) */
fill-(<custom-property>)
fill: var(<custom-property>);
fill-[<color>]
fill: <color>;

Show less
Examples
Basic example
Use utilities like fill-indigo-500 and fill-lime-600 to change the fill color of an SVG:
<svg class="fill-blue-500 ...">
 <!-- ... -->
</svg>
This can be useful for styling icon sets like Heroicons.
Using the current color
Use the fill-current utility to set the fill color to the current text color:
Hover over the button to see the fill color change
Check for updates
<button class="bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white ...">
 <svg class="size-5 fill-current ...">
   <!-- ... -->
 </svg>
 Check for updates
</button>
Using a custom value
Use the fill-[<value>] syntax to set the fill color based on a completely custom value:
<svg class="fill-[#243c5a] ...">
 <!-- ... -->
</svg>
For CSS variables, you can also use the fill-(<custom-property>) syntax:
<svg class="fill-(--my-fill-color) ...">
 <!-- ... -->
</svg>
This is just a shorthand for fill-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a fill utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<svg class="fill-cyan-500 md:fill-cyan-700 ...">
 <!-- ... -->
</svg>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --color-* theme variables to customize the color utilities in your project:
@theme {
 --color-regal-blue: #243c5a;
}
Now the fill-regal-blue utility can be used in your markup:
<svg class="fill-regal-blue">
 <!-- ... -->
</svg>
Learn more about customizing your theme in the theme documentation.
will-change
stroke
On this page
Quick reference
Examples
Basic example
Using the current color
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

nteractivity
caret-color
Utilities for controlling the color of the text input cursor.
Class
Styles
caret-inherit
caret-color: inherit;
caret-current
caret-color: currentColor;
caret-transparent
caret-color: transparent;
caret-black
caret-color: var(--color-black); /* #000 */
caret-white
caret-color: var(--color-white); /* #fff */
caret-red-50
caret-color: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */
caret-red-100
caret-color: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */
caret-red-200
caret-color: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */
caret-red-300
caret-color: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */
caret-red-400
caret-color: var(--color-red-400); /* oklch(70.4% 0.191 22.216) */





























































































































































































































































































































































































































































































































































































































































































































































































































































































































































































Show more
Examples
Basic example
Use utilities like caret-rose-500 and caret-lime-600 to change the color of the text input cursor:
Focus the textarea to see the new caret color
<textarea class="caret-pink-500 ..."></textarea>
Using a custom value
Use the caret-[<value>] syntax to set the caret color based on a completely custom value:
<textarea class="caret-[#50d71e] ..."></textarea>
For CSS variables, you can also use the caret-(<custom-property>) syntax:
<textarea class="caret-(--my-caret-color) ..."></textarea>
This is just a shorthand for caret-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a caret-color utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<textarea class="caret-rose-500 md:caret-lime-600 ..."></textarea>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --color-* theme variables to customize the color utilities in your project:
@theme {
 --color-regal-blue: #243c5a;
}
Now the caret-regal-blue utility can be used in your markup:
<textarea class="caret-regal-blue"></textarea>
Learn more about customizing your theme in the theme documentation.
appearance
color-scheme
On this page
Quick reference
Examples
Basic example
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



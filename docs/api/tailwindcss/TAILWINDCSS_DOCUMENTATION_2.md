# Tailwind CSS Documentation 2

## 📋 Document Directory & Navigation

### 📖 Overview
This document serves as the extended reference for advanced Tailwind CSS features, utilities, and implementation techniques within the github-link-up-buddy project. It focuses on advanced patterns, complex animations, custom plugin development, and enterprise-scale optimization strategies.

### 🧭 Quick Navigation
- **Advanced Utilities**: Complex layouts, transforms, and advanced spacing
- **Animation Systems**: Custom animations, transitions, and motion design
- **Plugin Development**: Custom plugins, utility creation, and framework extensions
- **Performance**: Advanced optimization, code splitting, and production strategies
- **Enterprise Features**: Team workflows, design systems, and scalability patterns

### 📑 Detailed Table of Contents

#### 1. Advanced Layout Techniques
- 1.1 Complex Grid Systems
- 1.2 Advanced Flexbox Patterns
- 1.3 Container Query Implementations
- 1.4 Subgrid and Advanced Grids
- 1.5 Layout-Specific Responsive Design
- 1.6 Multi-Column Layouts

#### 2. Advanced Typography
- 2.1 Custom Font Loading Strategies
- 2.2 Advanced Text Effects
- 2.3 Typography Scales and Modular Systems
- 2.4 Multi-Language Typography
- 2.5 Performance-Optimized Web Fonts
- 2.6 Accessibility in Typography

#### 3. Advanced Color Systems
- 3.1 Dynamic Color Schemes
- 3.2 Color Contrast and Accessibility
- 3.3 Color Blending and Mixing
- 3.4 Advanced Dark Mode Patterns
- 3.5 Color Psychology and Brand Systems
- 3.6 Custom Color Spaces

#### 4. Animation and Motion Design
- 4.1 Custom Animation Keyframes
- 4.2 Complex Transition Systems
- 4.3 Motion Design Principles
- 4.4 Performance-Optimized Animations
- 4.5 Interactive Animation Patterns
- 4.6 Accessibility in Motion

#### 5. Advanced Transforms and Effects
- 5.1 3D Transforms and Perspective
- 5.2 Custom Filter Effects
- 5.3 Advanced Shadow Systems
- 5.4 Backdrop Effects and Overlays
- 5.5 Clip-Path and Masking
- 5.6 Advanced Pseudo-Elements

#### 6. Custom Plugin Development
- 6.1 Plugin Architecture and Structure
- 6.2 Custom Utility Creation
- 6.3 Complex Variant Systems
- 6.4 Theme Extension Patterns
- 6.5 Plugin Testing and Validation
- 6.6 Publishing and Distribution

#### 7. Advanced Configuration
- 7.1 Complex Theme Configurations
- 7.2 Multi-Project Setup
- 7.3 Environment-Specific Configurations
- 7.4 Advanced Build Pipelines
- 7.5 Configuration Management
- 7.6 Security and Optimization

#### 8. Performance Optimization
- 8.1 Advanced PurgeCSS Strategies
- 8.2 Critical CSS Optimization
- 8.3 Bundle Size Analysis
- 8.4 Runtime Performance
- 8.5 Memory Usage Optimization
- 8.6 Loading Performance

#### 9. Enterprise Implementation
- 9.1 Design System Integration
- 9.2 Team Collaboration Workflows
- 9.3 Component Library Development
- 9.4 Style Guide Management
- 9.5 Quality Assurance Processes
- 9.6 Scalability Planning

#### 10. Advanced Framework Integration
- 10.1 Complex React Patterns
- 10.2 Vue.js Advanced Integration
- 10.3 Angular Enterprise Setup
- 10.4 Svelte Optimization
- 10.5 Next.js Advanced Features
- 10.6 Server-Side Rendering

#### 11. Custom Directives and Functions
- 11.1 Advanced @apply Usage
- 11.2 Custom Function Development
- 11.3 Complex Directive Patterns
- 11.4 Theme Function Extensions
- 11.5 Dynamic Value Generation
- 11.6 Runtime Customization

#### 12. Advanced Responsive Design
- 12.1 Complex Breakpoint Systems
- 12.2 Container-Based Responsive Design
- 12.3 Advanced Media Query Patterns
- 12.4 Responsive Typography Systems
- 12.5 Mobile-First Advanced Patterns
- 12.6 Cross-Device Optimization

#### 13. Accessibility and Inclusive Design
- 13.1 Advanced Accessibility Patterns
- 13.2 Screen Reader Optimization
- 13.3 Keyboard Navigation Systems
- 13.4 Color Contrast Management
- 13.5 Motion and Animation Accessibility
- 13.6 Inclusive Design Principles

#### 14. Testing and Quality Assurance
- 14.1 Visual Regression Testing
- 14.2 Performance Testing Strategies
- 14.3 Accessibility Testing Automation
- 14.4 Cross-Browser Testing
- 14.5 Component Testing
- 14.6 E2E Testing with Tailwind

#### 15. Advanced Debugging and Development
- 15.1 Advanced Developer Tools
- 15.2 Debug Mode and Utilities
- 15.3 Performance Profiling
- 15.4 Build Analysis Tools
- 15.5 Runtime Debugging
- 15.6 Development Workflow Optimization

#### 16. Migration and Modernization
- 16.1 Legacy System Migration
- 16.2 Gradual Adoption Strategies
- 16.3 Code Modernization Patterns
- 16.4 Breaking Change Management
- 16.5 Version Migration Planning
- 16.6 Rollback Strategies

#### 17. Advanced Theming and Branding
- 17.1 Dynamic Theme Systems
- 17.2 Multi-Brand Support
- 17.3 Theme Inheritance Patterns
- 17.4 Runtime Theme Switching
- 17.5 Brand Guidelines Integration
- 17.6 Theme Testing and Validation

#### 18. Security and Best Practices
- 18.1 Security Considerations
- 18.2 Content Security Policy
- 18.3 Performance Security
- 18.4 Code Review Guidelines
- 18.5 Vulnerability Management
- 18.6 Secure Development Practices

### 🔍 How to Use This Document
1. **Advanced Topics**: Focus on sections 4-9 for complex implementation patterns
2. **Enterprise Features**: Sections 9, 17, and 18 for large-scale deployments
3. **Performance Focus**: Sections 8, 12, and 15 for optimization strategies
4. **Development Workflow**: Sections 6, 11, and 15 for advanced development patterns

### 🏷️ Search Keywords
`advanced-tailwind`, `enterprise-css`, `custom-plugins`, `performance-optimization`, `animation-systems`, `complex-layouts`, `design-systems`, `accessibility-patterns`, `testing-strategies`, `migration-patterns`, `theming-systems`, `security-best-practices`, `development-workflow`, `debugging-tools`, `framework-integration`, `responsive-advanced`, `typography-systems`, `color-systems`

---
Flexbox & Grid
align-self
Utilities for controlling how an individual flex or grid item is positioned along its container's cross axis.
Class
Styles
self-auto
align-self: auto;
self-start
align-self: flex-start;
self-end
align-self: flex-end;
self-end-safe
align-self: safe flex-end;
self-center
align-self: center;
self-center-safe
align-self: safe center;
self-stretch
align-self: stretch;
self-baseline
align-self: baseline;
self-baseline-last
align-self: last baseline;

Examples
Auto
Use the self-auto utility to align an item based on the value of the container's align-items property:
01
02
03
<div class="flex items-stretch ...">
 <div>01</div>
 <div class="self-auto ...">02</div>
 <div>03</div>
</div>
Start
Use the self-start utility to align an item to the start of the container's cross axis, despite the container's align-items value:
01
02
03
<div class="flex items-stretch ...">
 <div>01</div>
 <div class="self-start ...">02</div>
 <div>03</div>
</div>
Center
Use the self-center utility to align an item along the center of the container's cross axis, despite the container's align-items value:
01
02
03
<div class="flex items-stretch ...">
 <div>01</div>
 <div class="self-center ...">02</div>
 <div>03</div>
</div>
End
Use the self-end utility to align an item to the end of the container's cross axis, despite the container's align-items value:
01
02
03
<div class="flex items-stretch ...">
 <div>01</div>
 <div class="self-end ...">02</div>
 <div>03</div>
</div>
Stretch
Use the self-stretch utility to stretch an item to fill the container's cross axis, despite the container's align-items value:
01
02
03
<div class="flex items-stretch ...">
 <div>01</div>
 <div class="self-stretch ...">02</div>
 <div>03</div>
</div>
Baseline
Use the self-baseline utility to align an item such that its baseline aligns with the baseline of the flex container's cross axis:
01
02
03
<div class="flex ...">
 <div class="self-baseline pt-2 pb-6">01</div>
 <div class="self-baseline pt-8 pb-12">02</div>
 <div class="self-baseline pt-12 pb-4">03</div>
</div>
Last baseline
Use the self-baseline-last utility to align an item along the container's cross axis such that its baseline aligns with the last baseline in the container:

Spencer Sharp
Working on the future of astronaut recruitment at Space Recruit.
spacerecruit.com

Alex Reed
A multidisciplinary designer.
alex-reed.com
<div class="grid grid-cols-[1fr_auto]">
 <div>
   <img src="img/spencer-sharp.jpg" />
   <h4>Spencer Sharp</h4>
   <p class="self-baseline-last">Working on the future of astronaut recruitment at Space Recruit.</p>
 </div>
 <p class="self-baseline-last">spacerecruit.com</p>
</div>
This is useful for ensuring that text items align with each other, even if they have different heights.
Responsive design
Prefix an align-self utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="self-auto md:self-end ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
align-items
place-content
On this page
Quick reference
Examples
Auto
Start
Center
End
Stretch
Baseline
Last baseline
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

Flexbox & Grid
place-content
Utilities for controlling how content is justified and aligned at the same time.
Class
Styles
place-content-center
place-content: center;
place-content-center-safe
place-content: safe center;
place-content-start
place-content: start;
place-content-end
place-content: end;
place-content-end-safe
place-content: safe end;
place-content-between
place-content: space-between;
place-content-around
place-content: space-around;
place-content-evenly
place-content: space-evenly;
place-content-baseline
place-content: baseline;
place-content-stretch
place-content: stretch;

Examples
Center
Use place-content-center to pack items in the center of the block axis:
01
02
03
04
<div class="grid h-48 grid-cols-2 place-content-center gap-4 ...">
 <div>01</div>
 <div>02</div>
 <div>03</div>
 <div>04</div>
</div>
Start
Use place-content-start to pack items against the start of the block axis:
01
02
03
04
<div class="grid h-48 grid-cols-2 place-content-start gap-4 ...">
 <div>01</div>
 <div>02</div>
 <div>03</div>
 <div>04</div>
</div>
End
Use place-content-end to pack items against the end of the block axis:
01
02
03
04
<div class="grid h-48 grid-cols-2 place-content-end gap-4 ...">
 <div>01</div>
 <div>02</div>
 <div>03</div>
 <div>04</div>
</div>
Space between
Use place-content-between to distribute grid items along the block axis so that there is an equal amount of space between each row on the block axis:
01
02
03
04
<div class="grid h-48 grid-cols-2 place-content-between gap-4 ...">
 <div>01</div>
 <div>02</div>
 <div>03</div>
 <div>04</div>
</div>
Space around
Use place-content-around to distribute grid items such that there is an equal amount of space around each row on the block axis:
01
02
03
04
<div class="grid h-48 grid-cols-2 place-content-around gap-4 ...">
 <div>01</div>
 <div>02</div>
 <div>03</div>
 <div>04</div>
</div>
Space evenly
Use place-content-evenly to distribute grid items such that they are evenly spaced on the block axis:
01
02
03
04
<div class="grid h-48 grid-cols-2 place-content-evenly gap-4 ...">
 <div>01</div>
 <div>02</div>
 <div>03</div>
 <div>04</div>
</div>
Stretch
Use place-content-stretch to stretch grid items along their grid areas on the block axis:
01
02
03
04
<div class="grid h-48 grid-cols-2 place-content-stretch gap-4 ...">
 <div>01</div>
 <div>02</div>
 <div>03</div>
 <div>04</div>
</div>
Responsive design
Prefix a place-content utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="grid place-content-start md:place-content-center ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
align-self
place-items
On this page
Quick reference
Examples
Center
Start
End
Space between
Space around
Space evenly
Stretch
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

Flexbox & Grid
place-items
Utilities for controlling how items are justified and aligned at the same time.
Class
Styles
place-items-start
place-items: start;
place-items-end
place-items: end;
place-items-end-safe
place-items: safe end;
place-items-center
place-items: center;
place-items-center-safe
place-items: safe center;
place-items-baseline
place-items: baseline;
place-items-stretch
place-items: stretch;

Examples
Start
Use place-items-start to place grid items on the start of their grid areas on both axes:
01
02
03
04
05
06
<div class="grid grid-cols-3 place-items-start gap-4 ...">
 <div>01</div>
 <div>02</div>
 <div>03</div>
 <div>04</div>
 <div>05</div>
 <div>06</div>
</div>
End
Use place-items-end to place grid items on the end of their grid areas on both axes:
01
02
03
04
05
06
<div class="grid h-56 grid-cols-3 place-items-end gap-4 ...">
 <div>01</div>
 <div>02</div>
 <div>03</div>
 <div>04</div>
 <div>05</div>
 <div>06</div>
</div>
Center
Use place-items-center to place grid items on the center of their grid areas on both axes:
01
02
03
04
05
06
<div class="grid h-56 grid-cols-3 place-items-center gap-4 ...">
 <div>01</div>
 <div>02</div>
 <div>03</div>
 <div>04</div>
 <div>05</div>
 <div>06</div>
</div>
Stretch
Use place-items-stretch to stretch items along their grid areas on both axes:
01
02
03
04
05
06
<div class="grid h-56 grid-cols-3 place-items-stretch gap-4 ...">
 <div>01</div>
 <div>02</div>
 <div>03</div>
 <div>04</div>
 <div>05</div>
 <div>06</div>
</div>
Responsive design
Prefix a place-items utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="grid place-items-start md:place-items-center ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
place-content
place-self
On this page
Quick reference
Examples
Start
End
Center
Stretch
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

Flexbox & Grid
place-self
Utilities for controlling how an individual item is justified and aligned at the same time.
Class
Styles
place-self-auto
place-self: auto;
place-self-start
place-self: start;
place-self-end
place-self: end;
place-self-end-safe
place-self: safe end;
place-self-center
place-self: center;
place-self-center-safe
place-self: safe center;
place-self-stretch
place-self: stretch;

Examples
Auto
Use place-self-auto to align an item based on the value of the container's place-items property:
01
02
03
04
05
06
<div class="grid grid-cols-3 gap-4 ...">
 <div>01</div>
 <div class="place-self-auto ...">02</div>
 <div>03</div>
 <div>04</div>
 <div>05</div>
 <div>06</div>
</div>
Start
Use place-self-start to align an item to the start on both axes:
01
02
03
04
05
06
<div class="grid grid-cols-3 gap-4 ...">
 <div>01</div>
 <div class="place-self-start ...">02</div>
 <div>03</div>
 <div>04</div>
 <div>05</div>
 <div>06</div>
</div>
Center
Use place-self-center to align an item at the center on both axes:
01
02
03
04
05
06
<div class="grid grid-cols-3 gap-4 ...">
 <div>01</div>
 <div class="place-self-center ...">02</div>
 <div>03</div>
 <div>04</div>
 <div>05</div>
 <div>06</div>
</div>
End
Use place-self-end to align an item to the end on both axes:
01
02
03
04
05
06
<div class="grid grid-cols-3 gap-4 ...">
 <div>01</div>
 <div class="place-self-end ...">02</div>
 <div>03</div>
 <div>04</div>
 <div>05</div>
 <div>06</div>
</div>
Stretch
Use place-self-stretch to stretch an item on both axes:
01
02
03
04
05
06
<div class="grid grid-cols-3 gap-4 ...">
 <div>01</div>
 <div class="place-self-stretch ...">02</div>
 <div>03</div>
 <div>04</div>
 <div>05</div>
 <div>06</div>
</div>
Responsive design
Prefix a place-self utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="place-self-start md:place-self-end ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
place-items
padding
On this page
Quick reference
Examples
Auto
Start
Center
End
Stretch
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

Spacing
padding
Utilities for controlling an element's padding.
Class
Styles
p-<number>
padding: calc(var(--spacing) * <number>);
p-px
padding: 1px;
p-(<custom-property>)
padding: var(<custom-property>);
p-[<value>]
padding: <value>;
px-<number>
padding-inline: calc(var(--spacing) * <number>);
px-px
padding-inline: 1px;
px-(<custom-property>)
padding-inline: var(<custom-property>);
px-[<value>]
padding-inline: <value>;
py-<number>
padding-block: calc(var(--spacing) * <number>);
py-px
padding-block: 1px;









































































































Show more
Examples
Basic example
Use p-<number> utilities like p-4 and p-8 to control the padding on all sides of an element:
p-8
<div class="p-8 ...">p-8</div>
Adding padding to one side
Use pt-<number>, pr-<number>, pb-<number>, and pl-<number> utilities like pt-6 and pr-4 to control the padding on one side of an element:
pt-6
pr-4
pb-8
pl-2
<div class="pt-6 ...">pt-6</div>
<div class="pr-4 ...">pr-4</div>
<div class="pb-8 ...">pb-8</div>
<div class="pl-2 ...">pl-2</div>
Adding horizontal padding
Use px-<number> utilities like px-4 and px-8 to control the horizontal padding of an element:
px-8
<div class="px-8 ...">px-8</div>
Adding vertical padding
Use py-<number> utilities like py-4 and py-8 to control the vertical padding of an element:
py-8
<div class="py-8 ...">py-8</div>
Using logical properties
Use ps-<number> or pe-<number> utilities like ps-4 and pe-8 to set the padding-inline-start and padding-inline-end logical properties, which map to either the left or right side based on the text direction:
Left-to-right
ps-8
pe-8
Right-to-left
ps-8
pe-8
<div>
 <div dir="ltr">
   <div class="ps-8 ...">ps-8</div>
   <div class="pe-8 ...">pe-8</div>
 </div>
 <div dir="rtl">
   <div class="ps-8 ...">ps-8</div>
   <div class="pe-8 ...">pe-8</div>
 </div>
</div>
For more control, you can also use the LTR and RTL modifiers to conditionally apply specific styles depending on the current text direction.
Using a custom value
Use utilities like p-[<value>],px-[<value>], and pb-[<value>] to set the padding based on a completely custom value:
<div class="p-[5px] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the p-(<custom-property>) syntax:
<div class="p-(--my-padding) ...">
 <!-- ... -->
</div>
This is just a shorthand for p-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a padding utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="py-4 md:py-8 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
The p-<number>,px-<number>,py-<number>,ps-<number>,pe-<number>,pt-<number>,pr-<number>,pb-<number>, and pl-<number> utilities are driven by the --spacing theme variable, which can be customized in your own theme:
@theme {
 --spacing: 1px;
}
Learn more about customizing the spacing scale in the theme variable documentation.
place-self
margin
On this page
Quick reference
Examples
Basic example
Adding padding to one side
Adding horizontal padding
Adding vertical padding
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

Spacing
margin
Utilities for controlling an element's margin.
Class
Styles
m-<number>
margin: calc(var(--spacing) * <number>);
-m-<number>
margin: calc(var(--spacing) * -<number>);
m-auto
margin: auto;
m-px
margin: 1px;
-m-px
margin: -1px;
m-(<custom-property>)
margin: var(<custom-property>);
m-[<value>]
margin: <value>;
mx-<number>
margin-inline: calc(var(--spacing) * <number>);
-mx-<number>
margin-inline: calc(var(--spacing) * -<number>);
mx-auto
margin-inline: auto;













































































































































































































































































Show more
Examples
Basic example
Use m-<number> utilities like m-4 and m-8 to control the margin on all sides of an element:
m-8
<div class="m-8 ...">m-8</div>
Adding margin to a single side
Use mt-<number>, mr-<number>, mb-<number>, and ml-<number> utilities like ml-2 and mt-6 to control the margin on one side of an element:
mt-6
mr-4
mb-8
ml-2
<div class="mt-6 ...">mt-6</div>
<div class="mr-4 ...">mr-4</div>
<div class="mb-8 ...">mb-8</div>
<div class="ml-2 ...">ml-2</div>
Adding horizontal margin
Use mx-<number> utilities like mx-4 and mx-8 to control the horizontal margin of an element:
mx-8
<div class="mx-8 ...">mx-8</div>
Adding vertical margin
Use my-<number> utilities like my-4 and my-8 to control the vertical margin of an element:
my-8
<div class="my-8 ...">my-8</div>
Using negative values
To use a negative margin value, prefix the class name with a dash to convert it to a negative value:
-mt-8
<div class="h-16 w-36 bg-sky-400 opacity-20 ..."></div>
<div class="-mt-8 bg-sky-300 ...">-mt-8</div>
Using logical properties
Use ms-<number> or me-<number> utilities like ms-4 and me-8 to set the margin-inline-start and margin-inline-end logical properties:
Left-to-right
ms-8
me-8
Right-to-left
ms-8
me-8
<div>
 <div dir="ltr">
   <div class="ms-8 ...">ms-8</div>
   <div class="me-8 ...">me-8</div>
 </div>
 <div dir="rtl">
   <div class="ms-8 ...">ms-8</div>
   <div class="me-8 ...">me-8</div>
 </div>
</div>
Adding space between children
Use space-x-<number> or space-y-<number> utilities like space-x-4 and space-y-8 to control the space between elements:
01
02
03
<div class="flex space-x-4 ...">
 <div>01</div>
 <div>02</div>
 <div>03</div>
</div>
Reversing children order
If your elements are in reverse order (using say flex-row-reverse or flex-col-reverse), use the space-x-reverse or space-y-reverse utilities to ensure the space is added to the correct side of each element:
01
02
03
<div class="flex flex-row-reverse space-x-4 space-x-reverse ...">
 <div>01</div>
 <div>02</div>
 <div>03</div>
</div>
Limitations
The space utilities are really just a shortcut for adding margin to all-but-the-last-item in a group, and aren't designed to handle complex cases like grids, layouts that wrap, or situations where the children are rendered in a complex custom order rather than their natural DOM order.
For those situations, it's better to use the gap utilities when possible, or add margin to every element with a matching negative margin on the parent.
Additionally, the space utilities are not designed to work together with the divide utilities. For those situations, consider adding margin/padding utilities to the children instead.
Using a custom value
Use utilities like m-[<value>],mx-[<value>], and mb-[<value>] to set the margin based on a completely custom value:
<div class="m-[5px] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the m-(<custom-property>) syntax:
<div class="m-(--my-margin) ...">
 <!-- ... -->
</div>
This is just a shorthand for m-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a margin utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="mt-4 md:mt-8 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
The m-<number>,mx-<number>,my-<number>,ms-<number>,me-<number>,mt-<number>,mr-<number>,mb-<number>, and ml-<number> utilities are driven by the --spacing theme variable, which can be customized in your own theme:
@theme {
 --spacing: 1px;
}
Learn more about customizing the spacing scale in the theme variable documentation.
padding
width
On this page
Quick reference
Examples
Basic example
Adding margin to a single side
Adding horizontal margin
Adding vertical margin
Using negative values
Using logical properties
Adding space between children
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

Sizing
width
Utilities for setting the width of an element.
Class
Styles
w-<number>
width: calc(var(--spacing) * <number>);
w-<fraction>
width: calc(<fraction> * 100%);
w-3xs
width: var(--container-3xs); /* 16rem (256px) */
w-2xs
width: var(--container-2xs); /* 18rem (288px) */
w-xs
width: var(--container-xs); /* 20rem (320px) */
w-sm
width: var(--container-sm); /* 24rem (384px) */
w-md
width: var(--container-md); /* 28rem (448px) */
w-lg
width: var(--container-lg); /* 32rem (512px) */
w-xl
width: var(--container-xl); /* 36rem (576px) */
w-2xl
width: var(--container-2xl); /* 42rem (672px) */

















































































































































Show more
Examples
Basic example
Use w-<number> utilities like w-24 and w-64 to set an element to a fixed width based on the spacing scale:
w-96
w-80
w-64
w-48
w-40
w-32
w-24
<div class="w-96 ...">w-96</div>
<div class="w-80 ...">w-80</div>
<div class="w-64 ...">w-64</div>
<div class="w-48 ...">w-48</div>
<div class="w-40 ...">w-40</div>
<div class="w-32 ...">w-32</div>
<div class="w-24 ...">w-24</div>
Using a percentage
Use w-full or w-<fraction> utilities like w-1/2 and w-2/5 to give an element a percentage-based width:
w-1/2
w-1/2
w-2/5
w-3/5
w-1/3
w-2/3
w-1/4
w-3/4
w-1/5
w-4/5
w-1/6
w-5/6
w-full
<div class="flex ...">
 <div class="w-1/2 ...">w-1/2</div>
 <div class="w-1/2 ...">w-1/2</div>
</div>
<div class="flex ...">
 <div class="w-2/5 ...">w-2/5</div>
 <div class="w-3/5 ...">w-3/5</div>
</div>
<div class="flex ...">
 <div class="w-1/3 ...">w-1/3</div>
 <div class="w-2/3 ...">w-2/3</div>
</div>
<div class="flex ...">
 <div class="w-1/4 ...">w-1/4</div>
 <div class="w-3/4 ...">w-3/4</div>
</div>
<div class="flex ...">
 <div class="w-1/5 ...">w-1/5</div>
 <div class="w-4/5 ...">w-4/5</div>
</div>
<div class="flex ...">
 <div class="w-1/6 ...">w-1/6</div>
 <div class="w-5/6 ...">w-5/6</div>
</div>
<div class="w-full ...">w-full</div>
Using the container scale
Use utilities like w-sm and w-xl to set an element to a fixed width based on the container scale:
w-xl
w-lg
w-md
w-sm
w-xs
w-2xs
w-3xs
<div class="w-xl ...">w-xl</div>
<div class="w-lg ...">w-lg</div>
<div class="w-md ...">w-md</div>
<div class="w-sm ...">w-sm</div>
<div class="w-xs ...">w-xs</div>
<div class="w-2xs ...">w-2xs</div>
<div class="w-3xs ...">w-3xs</div>
Matching the viewport
Use the w-screen utility to make an element span the entire width of the viewport:
<div class="w-screen">
 <!-- ... -->
</div>
Alternatively, you can match the width of the large, small or dynamic viewports using the w-lvw, w-svw, and w-dvw utilities.
Resetting the width
Use the w-auto utility to remove an element's assigned width under a specific condition, like at a particular breakpoint:
<div class="w-full md:w-auto">
 <!-- ... -->
</div>
Setting both width and height
Use utilities like size-px, size-4, and size-full to set both the width and height of an element at the same time:
size-16
size-20
size-24
size-32
size-40
<div class="size-16 ...">size-16</div>
<div class="size-20 ...">size-20</div>
<div class="size-24 ...">size-24</div>
<div class="size-32 ...">size-32</div>
<div class="size-40 ...">size-40</div>
Using a custom value
Use the w-[<value>] syntax to set the width based on a completely custom value:
<div class="w-[5px] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the w-(<custom-property>) syntax:
<div class="w-(--my-width) ...">
 <!-- ... -->
</div>
This is just a shorthand for w-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a width utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="w-1/2 md:w-full ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
The w-<number> and size-<number> utilities are driven by the --spacing theme variable, which can be customized in your own theme:
@theme {
 --spacing: 1px;
}
Learn more about customizing the spacing scale in the theme variable documentation.
margin
min-width
On this page
Quick reference
Examples
Basic example
Using a percentage
Using the container scale
Matching the viewport
Resetting the width
Setting both width and height
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

Sizing
min-width
Utilities for setting the minimum width of an element.
Class
Styles
min-w-<number>
min-width: calc(var(--spacing) * <number>);
min-w-<fraction>
min-width: calc(<fraction> * 100%);
min-w-3xs
min-width: var(--container-3xs); /* 16rem (256px) */
min-w-2xs
min-width: var(--container-2xs); /* 18rem (288px) */
min-w-xs
min-width: var(--container-xs); /* 20rem (320px) */
min-w-sm
min-width: var(--container-sm); /* 24rem (384px) */
min-w-md
min-width: var(--container-md); /* 28rem (448px) */
min-w-lg
min-width: var(--container-lg); /* 32rem (512px) */
min-w-xl
min-width: var(--container-xl); /* 36rem (576px) */
min-w-2xl
min-width: var(--container-2xl); /* 42rem (672px) */

















































































Show more
Examples
Basic example
Use min-w-<number> utilities like min-w-24 and min-w-64 to set an element to a fixed minimum width based on the spacing scale:
min-w-80
min-w-64
min-w-48
min-w-40
min-w-32
min-w-24
<div class="w-20 ...">
 <div class="min-w-80 ...">min-w-80</div>
 <div class="min-w-64 ...">min-w-64</div>
 <div class="min-w-48 ...">min-w-48</div>
 <div class="min-w-40 ...">min-w-40</div>
 <div class="min-w-32 ...">min-w-32</div>
 <div class="min-w-24 ...">min-w-24</div>
</div>
Using a percentage
Use min-w-full or min-w-<fraction> utilities like min-w-1/2 and min-w-2/5 to give an element a percentage-based minimum width:
min-w-3/4
w-full
<div class="flex ...">
 <div class="min-w-3/4 ...">min-w-3/4</div>
 <div class="w-full ...">w-full</div>
</div>
Using the container scale
Use utilities like min-w-sm and min-w-xl to set an element to a fixed minimum width based on the container scale:
min-w-lg
min-w-md
min-w-sm
min-w-xs
min-w-2xs
min-w-3xs
<div class="w-40 ...">
 <div class="min-w-lg ...">min-w-lg</div>
 <div class="min-w-md ...">min-w-md</div>
 <div class="min-w-sm ...">min-w-sm</div>
 <div class="min-w-xs ...">min-w-xs</div>
 <div class="min-w-2xs ...">min-w-2xs</div>
 <div class="min-w-3xs ...">min-w-3xs</div>
</div>
Using a custom value
Use the min-w-[<value>] syntax to set the minimum width based on a completely custom value:
<div class="min-w-[220px] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the min-w-(<custom-property>) syntax:
<div class="min-w-(--my-min-width) ...">
 <!-- ... -->
</div>
This is just a shorthand for min-w-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a min-width utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="w-24 min-w-full md:min-w-0 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
The min-w-<number> utilities are driven by the --spacing theme variable, which can be customized in your own theme:
@theme {
 --spacing: 1px;
}
Learn more about customizing the spacing scale in the theme variable documentation.
width
max-width
On this page
Quick reference
Examples
Basic example
Using a percentage
Using the container scale
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

Sizing
max-width
Utilities for setting the maximum width of an element.
Class
Styles
max-w-<number>
max-width: calc(var(--spacing) * <number>);
max-w-<fraction>
max-width: calc(<fraction> * 100%);
max-w-3xs
max-width: var(--container-3xs); /* 16rem (256px) */
max-w-2xs
max-width: var(--container-2xs); /* 18rem (288px) */
max-w-xs
max-width: var(--container-xs); /* 20rem (320px) */
max-w-sm
max-width: var(--container-sm); /* 24rem (384px) */
max-w-md
max-width: var(--container-md); /* 28rem (448px) */
max-w-lg
max-width: var(--container-lg); /* 32rem (512px) */
max-w-xl
max-width: var(--container-xl); /* 36rem (576px) */
max-w-2xl
max-width: var(--container-2xl); /* 42rem (672px) */





















































































Show more
Examples
Basic example
Use max-w-<number> utilities like max-w-24 and max-w-64 to set an element to a fixed maximum width based on the spacing scale:
Resize the example to see the expected behavior
max-w-96
max-w-80
max-w-64
max-w-48
max-w-40
max-w-32
max-w-24
<div class="w-full max-w-96 ...">max-w-96</div>
<div class="w-full max-w-80 ...">max-w-80</div>
<div class="w-full max-w-64 ...">max-w-64</div>
<div class="w-full max-w-48 ...">max-w-48</div>
<div class="w-full max-w-40 ...">max-w-40</div>
<div class="w-full max-w-32 ...">max-w-32</div>
<div class="w-full max-w-24 ...">max-w-24</div>
Using a percentage
Use max-w-full or max-w-<fraction> utilities like max-w-1/2 and max-w-2/5 to give an element a percentage-based maximum width:
Resize the example to see the expected behavior
max-w-9/10
max-w-3/4
max-w-1/2
max-w-1/3
<div class="w-full max-w-9/10 ...">max-w-9/10</div>
<div class="w-full max-w-3/4 ...">max-w-3/4</div>
<div class="w-full max-w-1/2 ...">max-w-1/2</div>
<div class="w-full max-w-1/3 ...">max-w-1/3</div>
Using the container scale
Use utilities like max-w-sm and max-w-xl to set an element to a fixed maximum width based on the container scale:
Resize the example to see the expected behavior

Andrew Alfred
Assistant to the Traveling Secretary
<div class="max-w-md ...">
 <!-- ... -->
</div>
Using breakpoints container
Use the container utility to set the maximum width of an element to match the min-width of the current breakpoint. This is useful if you'd prefer to design for a fixed set of screen sizes instead of trying to accommodate a fully fluid viewport:
<div class="container">
 <!-- ... -->
</div>
Note that unlike containers you might have used in other frameworks, Tailwind's container does not center itself automatically and does not have any built-in horizontal padding. Use mx-auto and the px-<number> utilities to add these:
<div class="container mx-auto px-4">
 <!-- ... -->
</div>
Using a custom value
Use the max-w-[<value>] syntax to set the maximum width based on a completely custom value:
<div class="max-w-[220px] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the max-w-(<custom-property>) syntax:
<div class="max-w-(--my-max-width) ...">
 <!-- ... -->
</div>
This is just a shorthand for max-w-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a max-width utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="max-w-sm md:max-w-lg ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
The max-w-<number> utilities are driven by the --spacing theme variable, which can be customized in your own theme:
@theme {
 --spacing: 1px;
}
Learn more about customizing the spacing scale in the theme variable documentation.
min-width
height
On this page
Quick reference
Examples
Basic example
Using a percentage
Using the container scale
Using breakpoints container
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

Sizing
height
Utilities for setting the height of an element.
Class
Styles
h-<number>
height: calc(var(--spacing) * <number>);
h-<fraction>
height: calc(<fraction> * 100%);
h-auto
height: auto;
h-px
height: 1px;
h-full
height: 100%;
h-screen
height: 100vh;
h-dvh
height: 100dvh;
h-dvw
height: 100dvw;
h-lvh
height: 100lvh;
h-lvw
height: 100lvw;

































































































Show more
Examples
Basic example
Use h-<number> utilities like h-24 and h-64 to set an element to a fixed height based on the spacing scale:
h-96
h-80
h-64
h-48
h-40
h-32
h-24
<div class="h-96 ...">h-96</div>
<div class="h-80 ...">h-80</div>
<div class="h-64 ...">h-64</div>
<div class="h-48 ...">h-48</div>
<div class="h-40 ...">h-40</div>
<div class="h-32 ...">h-32</div>
<div class="h-24 ...">h-24</div>
Using a percentage
Use h-full or h-<fraction> utilities like h-1/2 and h-2/5 to give an element a percentage-based height:
h-full
h-9/10
h-3/4
h-1/2
h-1/3
<div class="h-full ...">h-full</div>
<div class="h-9/10 ...">h-9/10</div>
<div class="h-3/4 ...">h-3/4</div>
<div class="h-1/2 ...">h-1/2</div>
<div class="h-1/3 ...">h-1/3</div>
Matching viewport
Use the h-screen utility to make an element span the entire height of the viewport:
<div class="h-screen">
 <!-- ... -->
</div>
Matching dynamic viewport
Use the h-dvh utility to make an element span the entire height of the viewport, which changes as the browser UI expands or contracts:
Scroll the viewport to see the viewport height change
tailwindcss.com
h-dvh
<div class="h-dvh">
 <!-- ... -->
</div>
Matching large viewport
Use the h-lvh utility to set an element's height to the largest possible height of the viewport:
Scroll the viewport to see the viewport height change
tailwindcss.com
h-lvh
<div class="h-lvh">
 <!-- ... -->
</div>
Matching small viewport
Use the h-svh utility to set an element's height to the smallest possible height of the viewport:
Scroll the viewport to see the viewport height change
tailwindcss.com
h-svh
<div class="h-svh">
 <!-- ... -->
</div>
Setting both width and height
Use utilities like size-px, size-4, and size-full to set both the width and height of an element at the same time:
size-16
size-20
size-24
size-32
size-40
<div class="size-16 ...">size-16</div>
<div class="size-20 ...">size-20</div>
<div class="size-24 ...">size-24</div>
<div class="size-32 ...">size-32</div>
<div class="size-40 ...">size-40</div>
Using a custom value
Use the h-[<value>] syntax to set the height based on a completely custom value:
<div class="h-[32rem] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the h-(<custom-property>) syntax:
<div class="h-(--my-height) ...">
 <!-- ... -->
</div>
This is just a shorthand for h-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a height utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="h-1/2 md:h-full ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
The h-<number> and size-<number> utilities are driven by the --spacing theme variable, which can be customized in your own theme:
@theme {
 --spacing: 1px;
}
Learn more about customizing the spacing scale in the theme variable documentation.
max-width
min-height
On this page
Quick reference
Examples
Basic example
Using a percentage
Matching viewport
Matching dynamic viewport
Matching large viewport
Matching small viewport
Setting both width and height
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

Sizing
min-height
Utilities for setting the minimum height of an element.
Class
Styles
min-h-<number>
min-height: calc(var(--spacing) * <number>);
min-h-<fraction>
min-height: calc(<fraction> * 100%);
min-h-px
min-height: 1px;
min-h-full
min-height: 100%;
min-h-screen
min-height: 100vh;
min-h-dvh
min-height: 100dvh;
min-h-dvw
min-height: 100dvw;
min-h-lvh
min-height: 100lvh;
min-h-lvw
min-height: 100lvw;
min-h-svw
min-height: 100svw;

































Show more
Examples
Basic example
Use min-h-<number> utilities like min-h-24 and min-h-64 to set an element to a fixed minimum height based on the spacing scale:
min-h-96
min-h-80
min-h-64
min-h-48
min-h-40
min-h-32
min-h-24
<div class="h-20 ...">
 <div class="min-h-80 ...">min-h-80</div>
 <div class="min-h-64 ...">min-h-64</div>
 <div class="min-h-48 ...">min-h-48</div>
 <div class="min-h-40 ...">min-h-40</div>
 <div class="min-h-32 ...">min-h-32</div>
 <div class="min-h-24 ...">min-h-24</div>
</div>
Using a percentage
Use min-h-full or min-h-<fraction> utilities like min-h-1/2, and min-h-2/5 to give an element a percentage-based minimum height:
min-h-full
min-h-9/10
min-h-3/4
min-h-1/2
min-h-1/3
<div class="min-h-full ...">min-h-full</div>
<div class="min-h-9/10 ...">min-h-9/10</div>
<div class="min-h-3/4 ...">min-h-3/4</div>
<div class="min-h-1/2 ...">min-h-1/2</div>
<div class="min-h-1/3 ...">min-h-1/3</div>
Using a custom value
Use the min-h-[<value>] syntax to set the minimum height based on a completely custom value:
<div class="min-h-[220px] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the min-h-(<custom-property>) syntax:
<div class="min-h-(--my-min-height) ...">
 <!-- ... -->
</div>
This is just a shorthand for min-h-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a min-height utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="h-24 min-h-0 md:min-h-full ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
The min-h-<number> utilities are driven by the --spacing theme variable, which can be customized in your own theme:
@theme {
 --spacing: 1px;
}
Learn more about customizing the spacing scale in the theme variable documentation.
height
max-height
On this page
Quick reference
Examples
Basic example
Using a percentage
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

Sizing
max-height
Utilities for setting the maximum height of an element.
Class
Styles
max-h-<number>
max-height: calc(var(--spacing) * <number>);
max-h-<fraction>
max-height: calc(<fraction> * 100%);
max-h-none
max-height: none;
max-h-px
max-height: 1px;
max-h-full
max-height: 100%;
max-h-screen
max-height: 100vh;
max-h-dvh
max-height: 100dvh;
max-h-dvw
max-height: 100dvw;
max-h-lvh
max-height: 100lvh;
max-h-lvw
max-height: 100lvw;

































Show more
Examples
Basic example
Use max-h-<number> utilities like max-h-24 and max-h-64 to set an element to a fixed maximum height based on the spacing scale:
max-h-80
max-h-64
max-h-48
max-h-40
max-h-32
max-h-24
<div class="h-96 ...">
 <div class="h-full max-h-80 ...">max-h-80</div>
 <div class="h-full max-h-64 ...">max-h-64</div>
 <div class="h-full max-h-48 ...">max-h-48</div>
 <div class="h-full max-h-40 ...">max-h-40</div>
 <div class="h-full max-h-32 ...">max-h-32</div>
 <div class="h-full max-h-24 ...">max-h-24</div>
</div>
Using a percentage
Use max-h-full or max-h-<fraction> utilities like max-h-1/2 and max-h-2/5 to give an element a percentage-based maximum height:
max-h-9/10
max-h-3/4
max-h-1/2
max-h-1/4
max-h-full
<div class="h-96 ...">
 <div class="h-full max-h-9/10 ...">max-h-9/10</div>
 <div class="h-full max-h-3/4 ...">max-h-3/4</div>
 <div class="h-full max-h-1/2 ...">max-h-1/2</div>
 <div class="h-full max-h-1/4 ...">max-h-1/4</div>
 <div class="h-full max-h-full ...">max-h-full</div>
</div>
Using a custom value
Use the max-h-[<value>] syntax to set the maximum height based on a completely custom value:
<div class="max-h-[220px] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the max-h-(<custom-property>) syntax:
<div class="max-h-(--my-max-height) ...">
 <!-- ... -->
</div>
This is just a shorthand for max-h-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a max-height utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="h-48 max-h-full md:max-h-screen ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
The max-h-<number> utilities are driven by the --spacing theme variable, which can be customized in your own theme:
@theme {
 --spacing: 1px;
}
Learn more about customizing the spacing scale in the theme variable documentation.
min-height
font-family
On this page
Quick reference
Examples
Basic example
Using a percentage
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

Typography
font-family
Utilities for controlling the font family of an element.
Class
Styles
font-sans
font-family: var(--font-sans); /* ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji' */
font-serif
font-family: var(--font-serif); /* ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif */
font-mono
font-family: var(--font-mono); /* ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace */
font-(family-name:<custom-property>)
font-family: var(<custom-property>);
font-[<value>]
font-family: <value>;

Examples
Basic example
Use utilities like font-sans and font-mono to set the font family of an element:
font-sans
The quick brown fox jumps over the lazy dog.
font-serif
The quick brown fox jumps over the lazy dog.
font-mono
The quick brown fox jumps over the lazy dog.
<p class="font-sans ...">The quick brown fox ...</p>
<p class="font-serif ...">The quick brown fox ...</p>
<p class="font-mono ...">The quick brown fox ...</p>
Using a custom value
Use the font-[<value>] syntax to set the font family based on a completely custom value:
<p class="font-[Open_Sans] ...">
 Lorem ipsum dolor sit amet...
</p>
For CSS variables, you can also use the font-(family-name:<custom-property>) syntax:
<p class="font-(family-name:--my-font) ...">
 Lorem ipsum dolor sit amet...
</p>
This is just a shorthand for font-[family-name:var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a font-family utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="font-sans md:font-serif ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --font-* theme variables to customize the font family utilities in your project:
@theme {
 --font-display: "Oswald", "sans-serif";
}
Now the font-display utility can be used in your markup:
<div class="font-display">
 <!-- ... -->
</div>
You can also provide default font-feature-settings and font-variation-settings values for a font family:
@theme {
 --font-display: "Oswald", "sans-serif";
 --font-display--font-feature-settings: "cv02", "cv03", "cv04", "cv11";
 --font-display--font-variation-settings: "opsz" 32;
}
If needed, use the @font-face at-rule to load custom fonts:
@font-face {
 font-family: Oswald;
 font-style: normal;
 font-weight: 200 700;
 font-display: swap;
 src: url("/fonts/Oswald.woff2") format("woff2");
}
If you're loading a font from a service like Google Fonts, make sure to put the @import at the very top of your CSS file:
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
@import "tailwindcss";
@theme {
 --font-roboto: "Roboto", sans-serif;
}
Browsers require that @import statements come before any other rules, so URL imports need to be above imports like @import "tailwindcss" which are inlined in the compiled CSS.
Learn more about customizing your theme in the theme documentation.
max-height
font-size
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

Typography
font-size
Utilities for controlling the font size of an element.
Class
Styles
text-xs
font-size: var(--text-xs); /* 0.75rem (12px) */ 
line-height: var(--text-xs--line-height); /* calc(1 / 0.75) */
text-sm
font-size: var(--text-sm); /* 0.875rem (14px) */ 
line-height: var(--text-sm--line-height); /* calc(1.25 / 0.875) */
text-base
font-size: var(--text-base); /* 1rem (16px) */ 
line-height: var(--text-base--line-height); /* calc(1.5 / 1) */
text-lg
font-size: var(--text-lg); /* 1.125rem (18px) */ 
line-height: var(--text-lg--line-height); /* calc(1.75 / 1.125) */
text-xl
font-size: var(--text-xl); /* 1.25rem (20px) */ 
line-height: var(--text-xl--line-height); /* calc(1.75 / 1.25) */
text-2xl
font-size: var(--text-2xl); /* 1.5rem (24px) */ 
line-height: var(--text-2xl--line-height); /* calc(2 / 1.5) */
text-3xl
font-size: var(--text-3xl); /* 1.875rem (30px) */ 
line-height: var(--text-3xl--line-height); /* calc(2.25 / 1.875) */
text-4xl
font-size: var(--text-4xl); /* 2.25rem (36px) */ 
line-height: var(--text-4xl--line-height); /* calc(2.5 / 2.25) */
text-5xl
font-size: var(--text-5xl); /* 3rem (48px) */ 
line-height: var(--text-5xl--line-height); /* 1 */
text-6xl
font-size: var(--text-6xl); /* 3.75rem (60px) */ 
line-height: var(--text-6xl--line-height); /* 1 */
text-7xl
font-size: var(--text-7xl); /* 4.5rem (72px) */ 
line-height: var(--text-7xl--line-height); /* 1 */
text-8xl
font-size: var(--text-8xl); /* 6rem (96px) */ 
line-height: var(--text-8xl--line-height); /* 1 */
text-9xl
font-size: var(--text-9xl); /* 8rem (128px) */ 
line-height: var(--text-9xl--line-height); /* 1 */
text-(length:<custom-property>)
font-size: var(<custom-property>);
text-[<value>]
font-size: <value>;

Examples
Basic example
Use utilities like text-sm and text-lg to set the font size of an element:
text-sm
The quick brown fox jumps over the lazy dog.
text-base
The quick brown fox jumps over the lazy dog.
text-lg
The quick brown fox jumps over the lazy dog.
text-xl
The quick brown fox jumps over the lazy dog.
text-2xl
The quick brown fox jumps over the lazy dog.
<p class="text-sm ...">The quick brown fox ...</p>
<p class="text-base ...">The quick brown fox ...</p>
<p class="text-lg ...">The quick brown fox ...</p>
<p class="text-xl ...">The quick brown fox ...</p>
<p class="text-2xl ...">The quick brown fox ...</p>
Setting the line-height
Use utilities like text-sm/6 and text-lg/7 to set the font size and line-height of an element at the same time:
text-sm/6
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
text-sm/7
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
text-sm/8
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
<p class="text-sm/6 ...">So I started to walk into the water...</p>
<p class="text-sm/7 ...">So I started to walk into the water...</p>
<p class="text-sm/8 ...">So I started to walk into the water...</p>
Using a custom value
Use the text-[<value>] syntax to set the font size based on a completely custom value:
<p class="text-[14px] ...">
 Lorem ipsum dolor sit amet...
</p>
For CSS variables, you can also use the text-(length:<custom-property>) syntax:
<p class="text-(length:--my-text-size) ...">
 Lorem ipsum dolor sit amet...
</p>
This is just a shorthand for text-[length:var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a font-size utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="text-sm md:text-base ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --text-* theme variables to customize the font size utilities in your project:
@theme {
 --text-tiny: 0.625rem;
}
Now the text-tiny utility can be used in your markup:
<div class="text-tiny">
 <!-- ... -->
</div>
You can also provide default line-height, letter-spacing, and font-weight values for a font size:
@theme {
 --text-tiny: 0.625rem;
 --text-tiny--line-height: 1.5rem;
 --text-tiny--letter-spacing: 0.125rem;
 --text-tiny--font-weight: 500;
}
Learn more about customizing your theme in the theme documentation.
font-family
font-smoothing
On this page
Quick reference
Examples
Basic example
Setting the line-height
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

Typography
font-smoothing
Utilities for controlling the font smoothing of an element.
Class
Styles
antialiased
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
subpixel-antialiased
-webkit-font-smoothing: auto;
-moz-osx-font-smoothing: auto;

Examples
Grayscale antialiasing
Use the antialiased utility to render text using grayscale antialiasing:
The quick brown fox jumps over the lazy dog.
<p class="antialiased ...">The quick brown fox ...</p>
Subpixel antialiasing
Use the subpixel-antialiased utility to render text using subpixel antialiasing:
The quick brown fox jumps over the lazy dog.
<p class="subpixel-antialiased ...">The quick brown fox ...</p>
Responsive design
Prefix -webkit-font-smoothing and -moz-osx-font-smoothing utilities with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="antialiased md:subpixel-antialiased ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
font-size
font-style
On this page
Quick reference
Examples
Grayscale antialiasing
Subpixel antialiasing
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

Typography
font-style
Utilities for controlling the style of text.
Class
Styles
italic
font-style: italic;
not-italic
font-style: normal;

Examples
Italicizing text
Use the italic utility to make text italic:
The quick brown fox jumps over the lazy dog.
<p class="italic ...">The quick brown fox ...</p>
Displaying text normally
Use the not-italic utility to display text normally:
The quick brown fox jumps over the lazy dog.
<p class="not-italic ...">The quick brown fox ...</p>
Responsive design
Prefix a font-style utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="italic md:not-italic ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
font-smoothing
font-weight
On this page
Quick reference
Examples
Italicizing text
Displaying text normally
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

Typography
font-weight
Utilities for controlling the font weight of an element.
Class
Styles
font-thin
font-weight: 100;
font-extralight
font-weight: 200;
font-light
font-weight: 300;
font-normal
font-weight: 400;
font-medium
font-weight: 500;
font-semibold
font-weight: 600;
font-bold
font-weight: 700;
font-extrabold
font-weight: 800;
font-black
font-weight: 900;
font-(<custom-property>)
font-weight: var(<custom-property>);
font-[<value>]
font-weight: <value>;

Examples
Basic example
Use utilities like font-thin and font-bold to set the font weight of an element:
font-light
The quick brown fox jumps over the lazy dog.
font-normal
The quick brown fox jumps over the lazy dog.
font-medium
The quick brown fox jumps over the lazy dog.
font-semibold
The quick brown fox jumps over the lazy dog.
font-bold
The quick brown fox jumps over the lazy dog.
<p class="font-light ...">The quick brown fox ...</p>
<p class="font-normal ...">The quick brown fox ...</p>
<p class="font-medium ...">The quick brown fox ...</p>
<p class="font-semibold ...">The quick brown fox ...</p>
<p class="font-bold ...">The quick brown fox ...</p>
Using a custom value
Use the font-[<value>] syntax to set the font weight based on a completely custom value:
<p class="font-[1000] ...">
 Lorem ipsum dolor sit amet...
</p>
For CSS variables, you can also use the font-(<custom-property>) syntax:
<p class="font-(--my-font-weight) ...">
 Lorem ipsum dolor sit amet...
</p>
This is just a shorthand for font-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a font-weight utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="font-normal md:font-bold ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --font-weight-* theme variables to customize the font weight utilities in your project:
@theme {
 --font-weight-extrablack: 1000;
}
Now the font-extrablack utility can be used in your markup:
<div class="font-extrablack">
 <!-- ... -->
</div>
Learn more about customizing your theme in the theme documentation.
font-style
font-stretch
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

Typography
font-stretch
Utilities for selecting the width of a font face.
Class
Styles
font-stretch-ultra-condensed
font-stretch: ultra-condensed; /* 50% */
font-stretch-extra-condensed
font-stretch: extra-condensed; /* 62.5% */
font-stretch-condensed
font-stretch: condensed; /* 75% */
font-stretch-semi-condensed
font-stretch: semi-condensed; /* 87.5% */
font-stretch-normal
font-stretch: normal; /* 100% */
font-stretch-semi-expanded
font-stretch: semi-expanded; /* 112.5% */
font-stretch-expanded
font-stretch: expanded; /* 125% */
font-stretch-extra-expanded
font-stretch: extra-expanded; /* 150% */
font-stretch-ultra-expanded
font-stretch: ultra-expanded; /* 200% */
font-stretch-<percentage>
font-stretch: <percentage>;
font-stretch-(<custom-property>)
font-stretch: var(<custom-property>);
font-stretch-[<value>]
font-stretch: <value>;

Examples
Basic example
Use utilities like font-stretch-condensed and font-stretch-expanded to set the width of a font face:
font-stretch-extra-condensed
The quick brown fox jumps over the lazy dog.
font-stretch-condensed
The quick brown fox jumps over the lazy dog.
font-stretch-normal
The quick brown fox jumps over the lazy dog.
font-stretch-expanded
The quick brown fox jumps over the lazy dog.
font-stretch-extra-expanded
The quick brown fox jumps over the lazy dog.
<p class="font-stretch-extra-condensed">The quick brown fox...</p>
<p class="font-stretch-condensed">The quick brown fox...</p>
<p class="font-stretch-normal">The quick brown fox...</p>
<p class="font-stretch-expanded">The quick brown fox...</p>
<p class="font-stretch-extra-expanded">The quick brown fox...</p>
This only applies to fonts that have multiple width variations available, otherwise the browser selects the closest match.
Using percentages
Use font-stretch-<percentage> utilities like font-stretch-50% and font-stretch-125% to set the width of a font face using a percentage:
font-stretch-50%
The quick brown fox jumps over the lazy dog.
font-stretch-100%
The quick brown fox jumps over the lazy dog.
font-stretch-150%
The quick brown fox jumps over the lazy dog.
<p class="font-stretch-50%">The quick brown fox...</p>
<p class="font-stretch-100%">The quick brown fox...</p>
<p class="font-stretch-150%">The quick brown fox...</p>
Using a custom value
Use the font-stretch-[<value>] syntax to set the font width based on a completely custom value:
<p class="font-stretch-[66.66%] ...">
 Lorem ipsum dolor sit amet...
</p>
For CSS variables, you can also use the font-stretch-(<custom-property>) syntax:
<p class="font-stretch-(--my-font-width) ...">
 Lorem ipsum dolor sit amet...
</p>
This is just a shorthand for font-stretch-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a font-stretch utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="font-stretch-normal md:font-stretch-expanded ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
font-weight
font-variant-numeric
On this page
Quick reference
Examples
Basic example
Using percentages
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

Typography
font-variant-numeric
Utilities for controlling the variant of numbers.
Class
Styles
normal-nums
font-variant-numeric: normal;
ordinal
font-variant-numeric: ordinal;
slashed-zero
font-variant-numeric: slashed-zero;
lining-nums
font-variant-numeric: lining-nums;
oldstyle-nums
font-variant-numeric: oldstyle-nums;
proportional-nums
font-variant-numeric: proportional-nums;
tabular-nums
font-variant-numeric: tabular-nums;
diagonal-fractions
font-variant-numeric: diagonal-fractions;
stacked-fractions
font-variant-numeric: stacked-fractions;

Examples
Using ordinal glyphs
Use the ordinal utility to enable special glyphs for the ordinal markers in fonts that support them:
1st
<p class="ordinal ...">1st</p>
Using slashed zeroes
Use the slashed-zero utility to force a zero with a slash in fonts that support them:
0
<p class="slashed-zero ...">0</p>
Using lining figures
Use the lining-nums utility to use numeric glyphs that are aligned by their baseline in fonts that support them:
1234567890
<p class="lining-nums ...">1234567890</p>
Using oldstyle figures
Use the oldstyle-nums utility to use numeric glyphs where some numbers have descenders in fonts that support them:
1234567890
<p class="oldstyle-nums ...">1234567890</p>
Using proportional figures
Use the proportional-nums utility to use numeric glyphs that have proportional widths in fonts that support them:
12121
90909
<p class="proportional-nums ...">12121</p>
<p class="proportional-nums ...">90909</p>
Using tabular figures
Use the tabular-nums utility to use numeric glyphs that have uniform/tabular widths in fonts that support them:
12121
90909
<p class="tabular-nums ...">12121</p>
<p class="tabular-nums ...">90909</p>
Using diagonal fractions
Use the diagonal-fractions utility to replace numbers separated by a slash with common diagonal fractions in fonts that support them:
1/2 3/4 5/6
<p class="diagonal-fractions ...">1/2 3/4 5/6</p>
Using stacked fractions
Use the stacked-fractions utility to replace numbers separated by a slash with common stacked fractions in fonts that support them:
1/2 3/4 5/6
<p class="stacked-fractions ...">1/2 3/4 5/6</p>
Stacking multiple utilities
The font-variant-numeric utilities are composable so you can enable multiple variants by combining them:
Subtotal
$100.00
Tax
$14.50
Total
$114.50
<dl class="...">
 <dt class="...">Subtotal</dt>
 <dd class="text-right slashed-zero tabular-nums ...">$100.00</dd>
 <dt class="...">Tax</dt>
 <dd class="text-right slashed-zero tabular-nums ...">$14.50</dd>
 <dt class="...">Total</dt>
 <dd class="text-right slashed-zero tabular-nums ...">$114.50</dd>
</dl>
Resetting numeric font variants
Use the normal-nums property to reset numeric font variants:
<p class="slashed-zero tabular-nums md:normal-nums ...">
 <!-- ... -->
</p>
Responsive design
Prefix a font-variant-numeric utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="proportional-nums md:tabular-nums ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
font-stretch
letter-spacing
On this page
Quick reference
Examples
Using ordinal glyphs
Using slashed zeroes
Using lining figures
Using oldstyle figures
Using proportional figures
Using tabular figures
Using diagonal fractions
Using stacked fractions
Stacking multiple utilities
Resetting numeric font variants
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
Typography
letter-spacing
Utilities for controlling the tracking, or letter spacing, of an element.
Class
Styles
tracking-tighter
letter-spacing: var(--tracking-tighter); /* -0.05em */
tracking-tight
letter-spacing: var(--tracking-tight); /* -0.025em */
tracking-normal
letter-spacing: var(--tracking-normal); /* 0em */
tracking-wide
letter-spacing: var(--tracking-wide); /* 0.025em */
tracking-wider
letter-spacing: var(--tracking-wider); /* 0.05em */
tracking-widest
letter-spacing: var(--tracking-widest); /* 0.1em */
tracking-(<custom-property>)
letter-spacing: var(<custom-property>);
tracking-[<value>]
letter-spacing: <value>;

Examples
Basic example
Use utilities like tracking-tight and tracking-wide to set the letter spacing of an element:
tracking-tight
The quick brown fox jumps over the lazy dog.
tracking-normal
The quick brown fox jumps over the lazy dog.
tracking-wide
The quick brown fox jumps over the lazy dog.
<p class="tracking-tight ...">The quick brown fox ...</p>
<p class="tracking-normal ...">The quick brown fox ...</p>
<p class="tracking-wide ...">The quick brown fox ...</p>
Using negative values
Using negative values doesn't make a ton of sense with the named letter spacing scale Tailwind includes out of the box, but if you've customized your scale to use numbers it can be useful:
@theme {
 --tracking-1: 0em;
 --tracking-2: 0.025em;
 --tracking-3: 0.05em;
 --tracking-4: 0.1em;
}
To use a negative letter spacing value, prefix the class name with a dash to convert it to a negative value:
<p class="-tracking-2">The quick brown fox ...</p>
Using a custom value
Use the tracking-[<value>] syntax to set the letter spacing based on a completely custom value:
<p class="tracking-[.25em] ...">
 Lorem ipsum dolor sit amet...
</p>
For CSS variables, you can also use the tracking-(<custom-property>) syntax:
<p class="tracking-(--my-tracking) ...">
 Lorem ipsum dolor sit amet...
</p>
This is just a shorthand for tracking-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a letter-spacing utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="tracking-tight md:tracking-wide ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --tracking-* theme variables to customize the letter spacing utilities in your project:
@theme {
 --tracking-tightest: -0.075em;
}
Now the tracking-tightest utility can be used in your markup:
<p class="tracking-tightest">
 Lorem ipsum dolor sit amet...
</p>
Learn more about customizing your theme in the theme documentation.
font-variant-numeric
line-clamp
On this page
Quick reference
Examples
Basic example
Using negative values
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

Typography
line-clamp
Utilities for clamping text to a specific number of lines.
Class
Styles
line-clamp-<number>
overflow: hidden;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: <number>;
line-clamp-none
overflow: visible;
display: block;
-webkit-box-orient: horizontal;
-webkit-line-clamp: unset;
line-clamp-(<custom-property>)
overflow: hidden;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: var(<custom-property>);
line-clamp-[<value>]
overflow: hidden;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: <value>;

Examples
Basic example
Use line-clamp-<number> utilities like line-clamp-2 and line-clamp-3 to truncate multi-line text after a specific number of lines:
Mar 10, 2020
Boost your conversion rate
Nulla dolor velit adipisicing duis excepteur esse in duis nostrud occaecat mollit incididunt deserunt sunt. Ut ut sunt laborum ex occaecat eu tempor labore enim adipisicing minim ad. Est in quis eu dolore occaecat excepteur fugiat dolore nisi aliqua fugiat enim ut cillum. Labore enim duis nostrud eu. Est ut eiusmod consequat irure quis deserunt ex. Enim laboris dolor magna pariatur. Dolor et ad sint voluptate sunt elit mollit officia ad enim sit consectetur enim.
Lindsay Walton
<article>
 <time>Mar 10, 2020</time>
 <h2>Boost your conversion rate</h2>
 <p class="line-clamp-3">
   Nulla dolor velit adipisicing duis excepteur esse in duis nostrud occaecat mollit incididunt deserunt sunt. Ut ut
   sunt laborum ex occaecat eu tempor labore enim adipisicing minim ad. Est in quis eu dolore occaecat excepteur fugiat
   dolore nisi aliqua fugiat enim ut cillum. Labore enim duis nostrud eu. Est ut eiusmod consequat irure quis deserunt
   ex. Enim laboris dolor magna pariatur. Dolor et ad sint voluptate sunt elit mollit officia ad enim sit consectetur
   enim.
 </p>
 <div>
   <img src="/img/lindsay.jpg" />
   Lindsay Walton
 </div>
</article>
Undoing line clamping
Use line-clamp-none to undo a previously applied line clamp utility:
<p class="line-clamp-3 lg:line-clamp-none">
 <!-- ... -->
</p>
Using a custom value
Use the line-clamp-[<value>] syntax to set the number of lines based on a completely custom value:
<p class="line-clamp-[calc(var(--characters)/100)] ...">
 Lorem ipsum dolor sit amet...
</p>
For CSS variables, you can also use the line-clamp-(<custom-property>) syntax:
<p class="line-clamp-(--my-line-count) ...">
 Lorem ipsum dolor sit amet...
</p>
This is just a shorthand for line-clamp-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a line-clamp utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="line-clamp-3 md:line-clamp-4 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
letter-spacing
line-height
On this page
Quick reference
Examples
Basic example
Undoing line clamping
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

Typography
line-height
Utilities for controlling the leading, or line height, of an element.
Class
Styles
text-<size>/<number>
font-size: <size>;
line-height: calc(var(--spacing) * <number>);
text-<size>/(<custom-property>)
font-size: <size>;
line-height: var(<custom-property>);
text-<size>/[<value>]
font-size: <size>;
line-height: <value>;
leading-none
line-height: 1;
leading-<number>
line-height: calc(var(--spacing) * <number>)
leading-(<custom-property>)
line-height: var(<custom-property>);
leading-[<value>]
line-height: <value>;

Examples
Basic example
Use font size utilities like text-sm/6 and text-lg/7 to set the font size and line-height of an element at the same time:
text-sm/6
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
text-sm/7
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
text-sm/8
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
<p class="text-base/6 ...">So I started to walk into the water...</p>
<p class="text-base/7 ...">So I started to walk into the water...</p>
<p class="text-base/8 ...">So I started to walk into the water...</p>
Each font size utility also sets a default line height when one isn't provided. You can learn more about these values and how to customize them in the font-size documentation.
Setting independently
Use leading-<number> utilities like leading-6 and leading-7 to set the line height of an element independent of the font-size:
leading-6
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
leading-7
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
leading-8
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
<p class="text-sm leading-6">So I started to walk into the water...</p>
<p class="text-sm leading-7">So I started to walk into the water...</p>
<p class="text-sm leading-8">So I started to walk into the water...</p>
Removing the leading
Use the leading-none utility to set the line height of an element equal to its font size:
The quick brown fox jumps over the lazy dog.
<p class="text-2xl leading-none ...">The quick brown fox...</p>
Using a custom value
Use the leading-[<value>] syntax to set the line height based on a completely custom value:
<p class="leading-[1.5] ...">
 Lorem ipsum dolor sit amet...
</p>
For CSS variables, you can also use the leading-(<custom-property>) syntax:
<p class="leading-(--my-line-height) ...">
 Lorem ipsum dolor sit amet...
</p>
This is just a shorthand for leading-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a line-height utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="leading-5 md:leading-6 ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
Customizing your theme
The leading-<number> utilities are driven by the --spacing theme variable, which can be customized in your own theme:
@theme {
 --spacing: 1px;
}
Learn more about customizing the spacing scale in the theme variable documentation.
line-clamp
list-style-image
On this page
Quick reference
Examples
Basic example
Setting independently
Removing the leading
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

Typography
list-style-image
Utilities for controlling the marker images for list items.
Class
Styles
list-image-[<value>]
list-style-image: <value>;
list-image-(<custom-property>)
list-style-image: var(<custom-property>);
list-image-none
list-style-image: none;

Examples
Basic example
Use the list-image-[<value>] syntax to control the marker image for list items:
5 cups chopped Porcini mushrooms
1/2 cup of olive oil
3lb of celery
<ul class="list-image-[url(/img/checkmark.png)]">
 <li>5 cups chopped Porcini mushrooms</li>
 <!-- ... -->
</ul>
Using a CSS variable
Use the list-image-(<custom-property>) syntax to control the marker image for list items using a CSS variable:
<ul class="list-image-(--my-list-image)">
 <!-- ... -->
</ul>
This is just a shorthand for list-image-[var(<custom-property>)] that adds the var() function for you automatically.
Removing a marker image
Use the list-image-none utility to remove an existing marker image from list items:
<ul class="list-image-none">
 <!-- ... -->
</ul>
Responsive design
Prefix a list-style-image utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="list-image-none md:list-image-[url(/img/checkmark.png)] ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
line-height
list-style-position
On this page
Quick reference
Examples
Basic example
Using a CSS variable
Removing a marker image
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

Typography
list-style-position
Utilities for controlling the position of bullets and numbers in lists.
Class
Styles
list-inside
list-style-position: inside;
list-outside
list-style-position: outside;

Examples
Basic example
Use utilities like list-inside and list-outside to control the position of the markers and text indentation in a list:
list-inside
5 cups chopped Porcini mushrooms
1/2 cup of olive oil
3lb of celery
list-outside
5 cups chopped Porcini mushrooms
1/2 cup of olive oil
3lb of celery
<ul class="list-inside">
 <li>5 cups chopped Porcini mushrooms</li>
 <!-- ... -->
</ul>
<ul class="list-outside">
 <li>5 cups chopped Porcini mushrooms</li>
 <!-- ... -->
</ul>
Responsive design
Prefix a list-style-position utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<ul class="list-outside md:list-inside ...">
 <!-- ... -->
</ul>
Learn more about using variants in the variants documentation.
list-style-image
list-style-type
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

Typography
list-style-type
Utilities for controlling the marker style of a list.
Class
Styles
list-disc
list-style-type: disc;
list-decimal
list-style-type: decimal;
list-none
list-style-type: none;
list-(<custom-property>)
list-style-type: var(<custom-property>);
list-[<value>]
list-style-type: <value>;

Examples
Basic example
Use utilities like list-disc and list-decimal to control the style of the markers in a list:
list-disc
Now this is a story all about how, my life got flipped-turned upside down
And I'd like to take a minute just sit right there
I'll tell you how I became the prince of a town called Bel-Air
list-decimal
Now this is a story all about how, my life got flipped-turned upside down
And I'd like to take a minute just sit right there
I'll tell you how I became the prince of a town called Bel-Air
list-none
Now this is a story all about how, my life got flipped-turned upside down
And I'd like to take a minute just sit right there
I'll tell you how I became the prince of a town called Bel-Air
<ul class="list-disc">
 <li>Now this is a story all about how, my life got flipped-turned upside down</li>
 <!-- ... -->
</ul>
<ol class="list-decimal">
 <li>Now this is a story all about how, my life got flipped-turned upside down</li>
 <!-- ... -->
</ol>
<ul class="list-none">
 <li>Now this is a story all about how, my life got flipped-turned upside down</li>
 <!-- ... -->
</ul>
Using a custom value
Use the list-[<value>] syntax to set the marker based on a completely custom value:
<ol class="list-[upper-roman] ...">
 <!-- ... -->
</ol>
For CSS variables, you can also use the list-(<custom-property>) syntax:
<ol class="list-(--my-marker) ...">
 <!-- ... -->
</ol>
This is just a shorthand for list-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a list-style-type utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<ul class="list-none md:list-disc ...">
 <!-- ... -->
</ul>
Learn more about using variants in the variants documentation.
list-style-position
text-align
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

Typography
text-align
Utilities for controlling the alignment of text.
Class
Styles
text-left
text-align: left;
text-center
text-align: center;
text-right
text-align: right;
text-justify
text-align: justify;
text-start
text-align: start;
text-end
text-align: end;

Examples
Left aligning text
Use the text-left utility to left align the text of an element:
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
<p class="text-left">So I started to walk into the water...</p>
Right aligning text
Use the text-right utility to right align the text of an element:
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
<p class="text-right">So I started to walk into the water...</p>
Centering text
Use the text-center utility to center the text of an element:
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
<p class="text-center">So I started to walk into the water...</p>
Justifying text
Use the text-justify utility to justify the text of an element:
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
<p class="text-justify">So I started to walk into the water...</p>
Responsive design
Prefix a text-align utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="text-left md:text-center ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
list-style-type
color
On this page
Quick reference
Examples
Left aligning text
Right aligning text
Centering text
Justifying text
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

Typography
color
Utilities for controlling the text color of an element.
Class
Styles
text-inherit
color: inherit;
text-current
color: currentColor;
text-transparent
color: transparent;
text-black
color: var(--color-black); /* #000 */
text-white
color: var(--color-white); /* #fff */
text-red-50
color: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */
text-red-100
color: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */
text-red-200
color: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */
text-red-300
color: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */
text-red-400
color: var(--color-red-400); /* oklch(70.4% 0.191 22.216) */





























































































































































































































































































































































































































































































































































































































































































































































































































































































































































































Show more
Examples
Basic example
Use utilities like text-blue-600 and text-sky-400 to control the text color of an element:
The quick brown fox jumps over the lazy dog.
<p class="text-blue-600 dark:text-sky-400">The quick brown fox...</p>
Changing the opacity
Use the color opacity modifier to control the text color opacity of an element:
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
<p class="text-blue-600/100 dark:text-sky-400/100">The quick brown fox...</p>
<p class="text-blue-600/75 dark:text-sky-400/75">The quick brown fox...</p>
<p class="text-blue-600/50 dark:text-sky-400/50">The quick brown fox...</p>
<p class="text-blue-600/25 dark:text-sky-400/25">The quick brown fox...</p>
Using a custom value
Use the text-[<value>] syntax to set the text color based on a completely custom value:
<p class="text-[#50d71e] ...">
 Lorem ipsum dolor sit amet...
</p>
For CSS variables, you can also use the text-(<custom-property>) syntax:
<p class="text-(--my-color) ...">
 Lorem ipsum dolor sit amet...
</p>
This is just a shorthand for text-[var(<custom-property>)] that adds the var() function for you automatically.
Applying on hover
Prefix a color utility with a variant like hover:* to only apply the utility in that state:
Hover over the text to see the expected behavior
Oh I gotta get on that internet, I'm late on everything!
<p class="...">
 Oh I gotta get on that
 <a class="underline hover:text-blue-600 dark:hover:text-blue-400" href="https://en.wikipedia.org/wiki/Internet">internet</a>,
 I'm late on everything!
</p>
Learn more about using variants in the variants documentation.
Responsive design
Prefix a color utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="text-blue-600 md:text-green-600 ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --color-* theme variables to customize the color utilities in your project:
@theme {
 --color-regal-blue: #243c5a;
}
Now the text-regal-blue utility can be used in your markup:
<p class="text-regal-blue">
 Lorem ipsum dolor sit amet...
</p>
Learn more about customizing your theme in the theme documentation.
text-align
text-decoration-line
On this page
Quick reference
Examples
Basic example
Changing the opacity
Using a custom value
Applying on hover
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

Typography
text-decoration-line
Utilities for controlling the decoration of text.
Class
Styles
underline
text-decoration-line: underline;
overline
text-decoration-line: overline;
line-through
text-decoration-line: line-through;
no-underline
text-decoration-line: none;

Examples
Underling text
Use the underline utility to add an underline to the text of an element:
The quick brown fox jumps over the lazy dog.
<p class="underline">The quick brown fox...</p>
Adding an overline to text
Use the overline utility to add an overline to the text of an element:
The quick brown fox jumps over the lazy dog.
<p class="overline">The quick brown fox...</p>
Adding a line through text
Use the line-through utility to add a line through the text of an element:
The quick brown fox jumps over the lazy dog.
<p class="line-through">The quick brown fox...</p>
Removing a line from text
Use the no-underline utility to remove a line from the text of an element:
The quick brown fox jumps over the lazy dog.
<p class="no-underline">The quick brown fox...</p>
Applying on hover
Prefix a text-decoration-line utility with a variant like hover:* to only apply the utility in that state:
Hover over the text to see the expected behavior
The quick brown fox jumps over the lazy dog.
<p>The <a href="..." class="no-underline hover:underline ...">quick brown fox</a> jumps over the lazy dog.</p>
Learn more about using variants in the variants documentation.
Responsive design
Prefix a text-decoration-line utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<a class="no-underline md:underline ..." href="...">
 <!-- ... -->
</a>
Learn more about using variants in the variants documentation.
color
text-decoration-color
On this page
Quick reference
Examples
Underling text
Adding an overline to text
Adding a line through text
Removing a line from text
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

Typography
text-decoration-color
Utilities for controlling the color of text decorations.
Class
Styles
decoration-inherit
text-decoration-color: inherit;
decoration-current
text-decoration-color: currentColor;
decoration-transparent
text-decoration-color: transparent;
decoration-black
text-decoration-color: var(--color-black); /* #000 */
decoration-white
text-decoration-color: var(--color-white); /* #fff */
decoration-red-50
text-decoration-color: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */
decoration-red-100
text-decoration-color: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */
decoration-red-200
text-decoration-color: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */
decoration-red-300
text-decoration-color: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */
decoration-red-400
text-decoration-color: var(--color-red-400); /* oklch(70.4% 0.191 22.216) */





























































































































































































































































































































































































































































































































































































































































































































































































































































































































































































Show more
Examples
Basic example
Use utilities like decoration-sky-500 and decoration-pink-500 to change the text decoration color of an element:
I’m Derek, an astro-engineer based in Tattooine. I like to build X-Wings at My Company, Inc. Outside of work, I like to watch pod-racing and have light-saber fights.
<p>
 I’m Derek, an astro-engineer based in Tattooine. I like to build X-Wings
 at <a class="underline decoration-sky-500">My Company, Inc</a>. Outside
 of work, I like to <a class="underline decoration-pink-500">watch pod-racing</a>
 and have <a class="underline decoration-indigo-500">light-saber</a> fights.
</p>
Changing the opacity
Use the color opacity modifier to control the text decoration color opacity of an element:
I’m Derek, an astro-engineer based in Tattooine. I like to build X-Wings at My Company, Inc. Outside of work, I like to watch pod-racing and have light-saber fights.
<p>
 I’m Derek, an astro-engineer based in Tattooine. I like to build X-Wings
 at <a class="underline decoration-sky-500/30">My Company, Inc</a>. Outside
 of work, I like to <a class="underline decoration-pink-500/30">watch pod-racing</a>
 and have <a class="underline decoration-indigo-500/30">light-saber</a> fights.
</p>
Using a custom value
Use the decoration-[<value>] syntax to set the text decoration color based on a completely custom value:
<p class="decoration-[#50d71e] ...">
 Lorem ipsum dolor sit amet...
</p>
For CSS variables, you can also use the decoration-(<custom-property>) syntax:
<p class="decoration-(--my-color) ...">
 Lorem ipsum dolor sit amet...
</p>
This is just a shorthand for decoration-[var(<custom-property>)] that adds the var() function for you automatically.
Applying on hover
Prefix a text-decoration-color utility with a variant like hover:* to only apply the utility in that state:
Hover over the text to see the expected behavior
The quick brown fox jumps over the lazy dog.
<p>The <a href="..." class="underline hover:decoration-pink-500 ...">quick brown fox</a> jumps over the lazy dog.</p>
Learn more about using variants in the variants documentation.
Responsive design
Prefix a text-decoration-color utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="underline decoration-sky-600 md:decoration-blue-400 ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --color-* theme variables to customize the color utilities in your project:
@theme {
 --color-regal-blue: #243c5a;
}
Now the decoration-regal-blue utility can be used in your markup:
<p class="decoration-regal-blue">
 Lorem ipsum dolor sit amet...
</p>
Learn more about customizing your theme in the theme documentation.
text-decoration-line
text-decoration-style
On this page
Quick reference
Examples
Basic example
Changing the opacity
Using a custom value
Applying on hover
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

Typography
text-decoration-style
Utilities for controlling the style of text decorations.
Class
Styles
decoration-solid
text-decoration-style: solid;
decoration-double
text-decoration-style: double;
decoration-dotted
text-decoration-style: dotted;
decoration-dashed
text-decoration-style: dashed;
decoration-wavy
text-decoration-style: wavy;

Examples
Basic example
Use utilities like decoration-dotted and decoration-dashed to change the text decoration style of an element:
decoration-solid
The quick brown fox jumps over the lazy dog.
decoration-double
The quick brown fox jumps over the lazy dog.
decoration-dotted
The quick brown fox jumps over the lazy dog.
decoration-dashed
The quick brown fox jumps over the lazy dog.
decoration-wavy
The quick brown fox jumps over the lazy dog.
<p class="underline decoration-solid">The quick brown fox...</p>
<p class="underline decoration-double">The quick brown fox...</p>
<p class="underline decoration-dotted">The quick brown fox...</p>
<p class="underline decoration-dashed">The quick brown fox...</p>
<p class="underline decoration-wavy">The quick brown fox...</p>
Responsive design
Prefix a text-decoration-style utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="underline md:decoration-dashed ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
text-decoration-color
text-decoration-thickness
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

Typography
text-decoration-thickness
Utilities for controlling the thickness of text decorations.
Class
Styles
decoration-<number>
text-decoration-thickness: <number>px;
decoration-from-font
text-decoration-thickness: from-font;
decoration-auto
text-decoration-thickness: auto;
decoration-(length:<custom-property>)
text-decoration-thickness: var(<custom-property>);
decoration-[<value>]
text-decoration-thickness: <value>;

Examples
Basic example
Use decoration-<number> utilities like decoration-2 and decoration-4 to change the text decoration thickness of an element:
decoration-1
The quick brown fox jumps over the lazy dog.
decoration-2
The quick brown fox jumps over the lazy dog.
decoration-4
The quick brown fox jumps over the lazy dog.
<p class="underline decoration-1">The quick brown fox...</p>
<p class="underline decoration-2">The quick brown fox...</p>
<p class="underline decoration-4">The quick brown fox...</p>
Using a custom value
Use the decoration-[<value>] syntax to set the text decoration thickness based on a completely custom value:
<p class="decoration-[0.25rem] ...">
 Lorem ipsum dolor sit amet...
</p>
For CSS variables, you can also use the decoration-(length:<custom-property>) syntax:
<p class="decoration-(length:--my-decoration-thickness) ...">
 Lorem ipsum dolor sit amet...
</p>
This is just a shorthand for decoration-[length:var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a text-decoration-thickness utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="underline md:decoration-4 ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
text-decoration-style
text-underline-offset
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

Typography
text-underline-offset
Utilities for controlling the offset of a text underline.
Class
Styles
underline-offset-<number>
text-underline-offset: <number>px;
-underline-offset-<number>
text-underline-offset: calc(<number>px * -1);
underline-offset-auto
text-underline-offset: auto;
underline-offset-(<custom-property>)
text-underline-offset: var(<custom-property>);
underline-offset-[<value>]
text-underline-offset: <value>;

Examples
Basic example
Use underline-offset-<number> utilities like underline-offset-2 and underline-offset-4 to change the offset of a text underline:
underline-offset-1
The quick brown fox jumps over the lazy dog.
underline-offset-2
The quick brown fox jumps over the lazy dog.
underline-offset-4
The quick brown fox jumps over the lazy dog.
underline-offset-8
The quick brown fox jumps over the lazy dog.
<p class="underline underline-offset-1">The quick brown fox...</p>
<p class="underline underline-offset-2">The quick brown fox...</p>
<p class="underline underline-offset-4">The quick brown fox...</p>
<p class="underline underline-offset-8">The quick brown fox...</p>
Using a custom value
Use the underline-offset-[<value>] syntax to set the text underline offset based on a completely custom value:
<p class="underline-offset-[3px] ...">
 Lorem ipsum dolor sit amet...
</p>
For CSS variables, you can also use the underline-offset-(<custom-property>) syntax:
<p class="underline-offset-(--my-underline-offset) ...">
 Lorem ipsum dolor sit amet...
</p>
This is just a shorthand for underline-offset-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a text-underline-offset utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="underline md:underline-offset-4 ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
text-decoration-thickness
text-transform
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

Typography
text-transform
Utilities for controlling the capitalization of text.
Class
Styles
uppercase
text-transform: uppercase;
lowercase
text-transform: lowercase;
capitalize
text-transform: capitalize;
normal-case
text-transform: none;

Examples
Uppercasing text
Use the uppercase utility to uppercase the text of an element:
The quick brown fox jumps over the lazy dog.
<p class="uppercase">The quick brown fox ...</p>
Lowercasing text
Use the lowercase utility to lowercase the text of an element:
The quick brown fox jumps over the lazy dog.
<p class="lowercase">The quick brown fox ...</p>
Capitalizing text
Use the capitalize utility to capitalize text of an element:
The quick brown fox jumps over the lazy dog.
<p class="capitalize">The quick brown fox ...</p>
Resetting text casing
Use the normal-case utility to preserve the original text casing of an element—typically used to reset capitalization at different breakpoints:
The quick brown fox jumps over the lazy dog.
<p class="normal-case">The quick brown fox ...</p>
Responsive design
Prefix a text-transform utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="capitalize md:uppercase ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
text-underline-offset
text-overflow
On this page
Quick reference
Examples
Uppercasing text
Lowercasing text
Capitalizing text
Resetting text casing
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

Typography
text-overflow
Utilities for controlling how the text of an element overflows.
Class
Styles
truncate
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
text-ellipsis
text-overflow: ellipsis;
text-clip
text-overflow: clip;

Examples
Truncating text
Use the truncate utility to prevent text from wrapping and truncate overflowing text with an ellipsis (…) if needed:
The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.
<p class="truncate">The longest word in any of the major...</p>
Adding an ellipsis
Use the text-ellipsis utility to truncate overflowing text with an ellipsis (…) if needed:
The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.
<p class="overflow-hidden text-ellipsis">The longest word in any of the major...</p>
Clipping text
Use the text-clip utility to truncate the text at the limit of the content area:
The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.
<p class="overflow-hidden text-clip">The longest word in any of the major...</p>
This is the default browser behavior.
Responsive design
Prefix a text-overflow utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="text-ellipsis md:text-clip ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
text-transform
text-wrap
On this page
Quick reference
Examples
Truncating text
Adding an ellipsis
Clipping text
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

Typography
text-overflow
Utilities for controlling how the text of an element overflows.
Class
Styles
truncate
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
text-ellipsis
text-overflow: ellipsis;
text-clip
text-overflow: clip;

Examples
Truncating text
Use the truncate utility to prevent text from wrapping and truncate overflowing text with an ellipsis (…) if needed:
The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.
<p class="truncate">The longest word in any of the major...</p>
Adding an ellipsis
Use the text-ellipsis utility to truncate overflowing text with an ellipsis (…) if needed:
The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.
<p class="overflow-hidden text-ellipsis">The longest word in any of the major...</p>
Clipping text
Use the text-clip utility to truncate the text at the limit of the content area:
The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.
<p class="overflow-hidden text-clip">The longest word in any of the major...</p>
This is the default browser behavior.
Responsive design
Prefix a text-overflow utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="text-ellipsis md:text-clip ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
text-transform
text-wrap
On this page
Quick reference
Examples
Truncating text
Adding an ellipsis
Clipping text
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

Typography
text-wrap
Utilities for controlling how text wraps within an element.
Class
Styles
text-wrap
text-wrap: wrap;
text-nowrap
text-wrap: nowrap;
text-balance
text-wrap: balance;
text-pretty
text-wrap: pretty;

Examples
Allowing text to wrap
Use the text-wrap utility to wrap overflowing text onto multiple lines at logical points in the text:
Beloved Manhattan soup stand closes
New Yorkers are facing the winter chill with less warmth this year as the city's most revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.
<article class="text-wrap">
 <h3>Beloved Manhattan soup stand closes</h3>
 <p>New Yorkers are facing the winter chill...</p>
</article>
Preventing text from wrapping
Use the text-nowrap utility to prevent text from wrapping, allowing it to overflow if necessary:
Beloved Manhattan soup stand closes
New Yorkers are facing the winter chill with less warmth this year as the city's most revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.
<article class="text-nowrap">
 <h3>Beloved Manhattan soup stand closes</h3>
 <p>New Yorkers are facing the winter chill...</p>
</article>
Balanced text wrapping
Use the text-balance utility to distribute the text evenly across each line:
Beloved Manhattan soup stand closes
New Yorkers are facing the winter chill with less warmth this year as the city's most revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.
<article>
 <h3 class="text-balance">Beloved Manhattan soup stand closes</h3>
 <p>New Yorkers are facing the winter chill...</p>
</article>
For performance reasons browsers limit text balancing to blocks that are ~6 lines or less, making it best suited for headings.
Pretty text wrapping
Use the text-pretty utility to prevent orphans (a single word on its own line) at the end of a text block:
Beloved Manhattan soup stand closes
New Yorkers are facing the winter chill with less warmth this year as the city's most revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.
<article>
 <h3 class="text-pretty">Beloved Manhattan soup stand closes</h3>
 <p>New Yorkers are facing the winter chill...</p>
</article>
Responsive design
Prefix a text-wrap utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<h1 class="text-pretty md:text-balance ...">
 <!-- ... -->
</h1>
Learn more about using variants in the variants documentation.
text-overflow
text-indent
On this page
Quick reference
Examples
Allowing text to wrap
Preventing text from wrapping
Balanced text wrapping
Pretty text wrapping
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

Typography
text-indent
Utilities for controlling the amount of empty space shown before text in a block.
Class
Styles
indent-<number>
text-indent: calc(var(--spacing) * <number>)
-indent-<number>
text-indent: calc(var(--spacing) * -<number>)
indent-px
text-indent: 1px;
-indent-px
text-indent: -1px;
indent-(<custom-property>)
text-indent: var(<custom-property>);
indent-[<value>]
text-indent: <value>;

Examples
Basic example
Use indent-<number> utilities like indent-2 and indent-8 to set the amount of empty space (indentation) that's shown before text in a block:
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
<p class="indent-8">So I started to walk into the water...</p>
Using negative values
To use a negative text indent value, prefix the class name with a dash to convert it to a negative value:
So I started to walk into the water. I won't lie to you boys, I was terrified. But I pressed on, and as I made my way past the breakers a strange calm came over me. I don't know if it was divine intervention or the kinship of all living things but I tell you Jerry at that moment, I was a marine biologist.
<p class="-indent-8">So I started to walk into the water...</p>
Using a custom value
Use the indent-[<value>] syntax to set the text indentation based on a completely custom value:
<p class="indent-[50%] ...">
 Lorem ipsum dolor sit amet...
</p>
For CSS variables, you can also use the indent-(<custom-property>) syntax:
<p class="indent-(--my-indentation) ...">
 Lorem ipsum dolor sit amet...
</p>
This is just a shorthand for indent-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a text-indent utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="indent-4 md:indent-8 ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
text-wrap
vertical-align
On this page
Quick reference
Examples
Basic example
Using negative values
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

Typography
vertical-align
Utilities for controlling the vertical alignment of an inline or table-cell box.
Class
Styles
align-baseline
vertical-align: baseline;
align-top
vertical-align: top;
align-middle
vertical-align: middle;
align-bottom
vertical-align: bottom;
align-text-top
vertical-align: text-top;
align-text-bottom
vertical-align: text-bottom;
align-sub
vertical-align: sub;
align-super
vertical-align: super;
align-(<custom-property>)
vertical-align: var(<custom-property>);
align-[<value>]
vertical-align: <value>;

Examples
Aligning to baseline
Use the align-baseline utility to align the baseline of an element with the baseline of its parent:
The quick brown fox jumps over the lazy dog.
<span class="inline-block align-baseline">The quick brown fox...</span>
Aligning to top
Use the align-top utility to align the top of an element and its descendants with the top of the entire line:
The quick brown fox jumps over the lazy dog.
<span class="inline-block align-top">The quick brown fox...</span>
Aligning to middle
Use the align-middle utility to align the middle of an element with the baseline plus half the x-height of the parent:
The quick brown fox jumps over the lazy dog.
<span class="inline-block align-middle">The quick brown fox...</span>
Aligning to bottom
Use the align-bottom utility to align the bottom of an element and its descendants with the bottom of the entire line:
The quick brown fox jumps over the lazy dog.
<span class="inline-block align-bottom">The quick brown fox...</span>
Aligning to parent top
Use the align-text-top utility to align the top of an element with the top of the parent element's font:
The quick brown fox jumps over the lazy dog.
<span class="inline-block align-text-top">The quick brown fox...</span>
Aligning to parent bottom
Use the align-text-bottom utility to align the bottom of an element with the bottom of the parent element's font:
The quick brown fox jumps over the lazy dog.
<span class="inline-block align-text-bottom">The quick brown fox...</span>
Using a custom value
Use the align-[<value>] syntax to set the vertical alignment based on a completely custom value:
<span class="align-[4px] ...">
 <!-- ... -->
</span>
For CSS variables, you can also use the align-(<custom-property>) syntax:
<span class="align-(--my-alignment) ...">
 <!-- ... -->
</span>
This is just a shorthand for align-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a vertical-align utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<span class="align-middle md:align-top ...">
 <!-- ... -->
</span>
Learn more about using variants in the variants documentation.
text-indent
white-space
On this page
Quick reference
Examples
Aligning to baseline
Aligning to top
Aligning to middle
Aligning to bottom
Aligning to parent top
Aligning to parent bottom
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

Typography
white-space
Utilities for controlling an element's white-space property.
Class
Styles
whitespace-normal
white-space: normal;
whitespace-nowrap
white-space: nowrap;
whitespace-pre
white-space: pre;
whitespace-pre-line
white-space: pre-line;
whitespace-pre-wrap
white-space: pre-wrap;
whitespace-break-spaces
white-space: break-spaces;

Examples
Normal
Use the whitespace-normal utility to cause text to wrap normally within an element. Newlines and spaces will be collapsed:
Hey everyone! It’s almost 2022 and we still don’t know if there are aliens living among us, or do we? Maybe the person writing this is an alien. You will never know.
<p class="whitespace-normal">Hey everyone!
It's almost 2022       and we still don't know if there             are aliens living among us, or do we? Maybe the person writing this is an alien.
You will never know.</p>
No Wrap
Use the whitespace-nowrap utility to prevent text from wrapping within an element. Newlines and spaces will be collapsed:
Hey everyone! It’s almost 2022 and we still don’t know if there are aliens living among us, or do we? Maybe the person writing this is an alien. You will never know.
<p class="overflow-auto whitespace-nowrap">Hey everyone!
It's almost 2022       and we still don't know if there             are aliens living among us, or do we? Maybe the person writing this is an alien.
You will never know.</p>
Pre
Use the whitespace-pre utility to preserve newlines and spaces within an element. Text will not be wrapped:
Hey everyone!

It’s almost 2022       and we still don’t know if there             are aliens living among us, or do we? Maybe the person writing this is an alien.

You will never know.
<p class="overflow-auto whitespace-pre">Hey everyone!
It's almost 2022       and we still don't know if there             are aliens living among us, or do we? Maybe the person writing this is an alien.
You will never know.</p>
Pre Line
Use the whitespace-pre-line utility to preserve newlines but not spaces within an element. Text will be wrapped normally:
Hey everyone!

It’s almost 2022 and we still don’t know if there are aliens living among us, or do we? Maybe the person writing this is an alien.

You will never know.
<p class="whitespace-pre-line">Hey everyone!
It's almost 2022       and we still don't know if there             are aliens living among us, or do we? Maybe the person writing this is an alien.
You will never know.</p>
Pre Wrap
Use the whitespace-pre-wrap utility to preserve newlines and spaces within an element. Text will be wrapped normally:
Hey everyone!

It’s almost 2022       and we still don’t know if there             are aliens living among us, or do we? Maybe the person writing this is an alien.

You will never know.
<p class="whitespace-pre-wrap">Hey everyone!
It's almost 2022       and we still don't know if there             are aliens living among us, or do we? Maybe the person writing this is an alien.
You will never know.</p>
Break Spaces
Use the whitespace-break-spaces utility to preserve newlines and spaces within an element. White space at the end of lines will not hang, but will wrap to the next line:
Hey everyone! It’s almost 2022 and we still don’t know if there are aliens living among us, or do we? Maybe the person writing this is an alien. You will never know.
<p class="whitespace-break-spaces">Hey everyone!
It's almost 2022       and we still don't know if there             are aliens living among us, or do we? Maybe the person writing this is an alien.
You will never know.</p>
Responsive design
Prefix a white-space utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="whitespace-pre md:whitespace-normal ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
vertical-align
word-break
On this page
Quick reference
Examples
Normal
No Wrap
Pre
Pre Line
Pre Wrap
Break Spaces
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

Typography
word-break
Utilities for controlling word breaks in an element.
Class
Styles
break-normal
word-break: normal;
break-all
word-break: break-all;
break-keep
word-break: keep-all;

Examples
Normal
Use the break-normal utility to only add line breaks at normal word break points:
The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.
<p class="break-normal">The longest word in any of the major...</p>
Break All
Use the break-all utility to add line breaks whenever necessary, without trying to preserve whole words:
The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.
<p class="break-all">The longest word in any of the major...</p>
Break Keep
Use the break-keep utility to prevent line breaks from being applied to Chinese/Japanese/Korean (CJK) text:
抗衡不屈不挠 (kànghéng bùqū bùnáo) 这是一个长词，意思是不畏强暴，奋勇抗争，坚定不移，永不放弃。这个词通常用来描述那些在面对困难和挑战时坚持自己信念的人， 他们克服一切困难，不屈不挠地追求自己的目标。无论遇到多大的挑战，他们都能够坚持到底，不放弃，最终获得胜利。
<p class="break-keep">抗衡不屈不挠...</p>
For non-CJK text the break-keep utility has the same behavior as the break-normal utility.
Responsive design
Prefix a word-break utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="break-normal md:break-all ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
white-space
overflow-wrap
On this page
Quick reference
Examples
Normal
Break All
Break Keep
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

Typography
overflow-wrap
Utilities for controlling line breaks within words in an overflowing element.
Class
Styles
wrap-break-word
overflow-wrap: break-word;
wrap-anywhere
overflow-wrap: anywhere;
wrap-normal
overflow-wrap: normal;

Examples
Wrapping mid-word
Use the wrap-break-word utility to allow line breaks between letters in a word if needed:
The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.
<p class="wrap-break-word">The longest word in any of the major...</p>
Wrapping anywhere
The wrap-anywhere utility behaves similarly to wrap-break-word, except that the browser factors in mid-word line breaks when calculating the intrinsic size of the element:
wrap-break-word

Jay Riemenschneider
jason.riemenschneider@vandelayindustries.com
wrap-anywhere

Jay Riemenschneider
jason.riemenschneider@vandelayindustries.com
<div class="flex max-w-sm">
 <img class="size-16 rounded-full" src="/img/profile.jpg" />
 <div class="wrap-break-word">
   <p class="font-medium">Jay Riemenschneider</p>
   <p>jason.riemenschneider@vandelayindustries.com</p>
 </div>
</div>
<div class="flex max-w-sm">
 <img class="size-16 rounded-full" src="/img/profile.jpg" />
 <div class="wrap-anywhere">
   <p class="font-medium">Jay Riemenschneider</p>
   <p>jason.riemenschneider@vandelayindustries.com</p>
 </div>
</div>
This is useful for wrapping text inside of flex containers, where you would usually need to set min-width: 0 on the child element to allow it to shrink below its content size.
Wrapping normally
Use the wrap-normal utility to only allow line breaks at natural wrapping points, like spaces, hyphens, and punctuation:
The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.
<p class="wrap-normal">The longest word in any of the major...</p>
Responsive design
Prefix an overflow-wrap utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="wrap-normal md:wrap-break-word ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
word-break
hyphens
On this page
Quick reference
Examples
Wrapping mid-word
Wrapping anywhere
Wrapping normally
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

Typography
hyphens
Utilities for controlling how words should be hyphenated.
Class
Styles
hyphens-none
hyphens: none;
hyphens-manual
hyphens: manual;
hyphens-auto
hyphens: auto;

Examples
Preventing hyphenation
Use the hyphens-none utility to prevent words from being hyphenated even if the line break suggestion &shy; is used:
Officially recognized by the Duden dictionary as the longest word in German, Kraftfahrzeug­haftpflichtversicherung is a 36 letter word for motor vehicle liability insurance.
<p class="hyphens-none">
 ... Kraftfahrzeug&shy;haftpflichtversicherung is a ...
</p>
Manual hyphenation
Use the hyphens-manual utility to only set hyphenation points where the line break suggestion &shy; is used:
Officially recognized by the Duden dictionary as the longest word in German, Kraftfahrzeug­haftpflichtversicherung is a 36 letter word for motor vehicle liability insurance.
<p class="hyphens-manual">
 ... Kraftfahrzeug&shy;haftpflichtversicherung is a ...
</p>
This is the default browser behavior.
Automatic hyphenation
Use the hyphens-auto utility to allow the browser to automatically choose hyphenation points based on the language:
Officially recognized by the Duden dictionary as the longest word in German, Kraftfahrzeughaftpflichtversicherung is a 36 letter word for motor vehicle liability insurance.
<p class="hyphens-auto" lang="de">
 ... Kraftfahrzeughaftpflichtversicherung is a ...
</p>
The line break suggestion &shy; will be preferred over automatic hyphenation points.
Responsive design
Prefix a hyphens utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="hyphens-none md:hyphens-auto ...">
 Lorem ipsum dolor sit amet...
</p>
Learn more about using variants in the variants documentation.
overflow-wrap
content
On this page
Quick reference
Examples
Preventing hyphenation
Manual hyphenation
Automatic hyphenation
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

Typography
content
Utilities for controlling the content of the before and after pseudo-elements.
Class
Styles
content-[<value>]
content: <value>;
content-(<custom-property>)
content: var(<custom-property>);
content-none
content: none;

Examples
Basic example
Use the content-[<value>] syntax, along with the before and after variants, to set the contents of the ::before and ::after pseudo-elements:
Higher resolution means more than just a better-quality image. With a Retina 6K display, Pro Display XDR gives you nearly 40 percent more screen real estate than a 5K display.
<p>Higher resolution means more than just a better-quality image. With a
Retina 6K display, <a class="text-blue-600 after:content-['_↗']" href="...">
Pro Display XDR</a> gives you nearly 40 percent more screen real estate than
a 5K display.</p>
Referencing an attribute value
Use the content-[attr(<name>)] syntax to reference a value stored in an attribute using the attr() CSS function:
<p before="Hello World" class="before:content-[attr(before)] ...">
 <!-- ... -->
</p>
Using spaces and underscores
Since whitespace denotes the end of a class in HTML, replace any spaces in an arbitrary value with an underscore:
<p class="before:content-['Hello_World'] ..."></p>
If you need to include an actual underscore, you can do this by escaping it with a backslash:
<p class="before:content-['Hello\_World']"></p>
Using a CSS variable
Use the content-(<custom-property>) syntax to control the contents of the ::before and ::after pseudo-elements using a CSS variable:
<p class="content-(--my-content)"></p>
This is just a shorthand for content-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a content utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<p class="before:content-['Mobile'] md:before:content-['Desktop'] ..."></p>
Learn more about using variants in the variants documentation.
hyphens
background-attachment
On this page
Quick reference
Examples
Basic example
Referencing an attribute value
Using spaces and underscores
Using a CSS variable
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

Backgrounds
background-attachment
Utilities for controlling how a background image behaves when scrolling.
Class
Styles
bg-fixed
background-attachment: fixed;
bg-local
background-attachment: local;
bg-scroll
background-attachment: scroll;

Examples
Fixing the background image
Use the bg-fixed utility to fix the background image relative to the viewport:
Scroll the content to see the background image fixed in place
My trip to the summit
November 16, 2021 · 4 min read
Maybe we can live without libraries, people like you and me. Maybe. Sure, we're too old to change the world, but what about that kid, sitting down, opening a book, right now, in a branch at the local library and finding drawings of pee-pees and wee-wees on the Cat in the Hat and the Five Chinese Brothers? Doesn't HE deserve better?
Look. If you think this is about overdue fines and missing books, you'd better think again. This is about that kid's right to read a book without getting his mind warped! Or: maybe that turns you on, Seinfeld; maybe that's how y'get your kicks. You and your good-time buddies.
<div class="bg-[url(/img/mountains.jpg)] bg-fixed ...">
 <!-- ... -->
</div>
Scrolling with the container
Use the bg-local utility to scroll the background image with the container and the viewport:
Scroll the content to see the background image scroll with the container
Because the mail never stops. It just keeps coming and coming and coming, there's never a let-up. It's relentless. Every day it piles up more and more and more. And you gotta get it out but the more you get it out the more it keeps coming in. And then the barcode reader breaks and it's Publisher's Clearing House day.
— Newman
<div class="bg-[url(/img/mountains.jpg)] bg-local ...">
 <!-- ... -->
</div>
Scrolling with the viewport
Use the bg-scroll utility to scroll the background image with the viewport, but not with the container:
Scroll the content to see the background image fixed in the container
Because the mail never stops. It just keeps coming and coming and coming, there's never a let-up. It's relentless. Every day it piles up more and more and more. And you gotta get it out but the more you get it out the more it keeps coming in. And then the barcode reader breaks and it's Publisher's Clearing House day.
— Newman
<div class="bg-[url(/img/mountains.jpg)] bg-scroll ...">
 <!-- ... -->
</div>
Responsive design
Prefix a background-attachment utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="bg-local md:bg-fixed ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
content
background-clip
On this page
Quick reference
Examples
Fixing the background image
Scrolling with the container
Scrolling with the viewport
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

Backgrounds
background-clip
Utilities for controlling the bounding box of an element's background.
Class
Styles
bg-clip-border
background-clip: border-box;
bg-clip-padding
background-clip: padding-box;
bg-clip-content
background-clip: content-box;
bg-clip-text
background-clip: text;

Examples
Basic example
Use the bg-clip-border, bg-clip-padding, and bg-clip-content utilities to control the bounding box of an element's background:
bg-clip-border
bg-clip-padding
bg-clip-content
<div class="border-4 bg-indigo-500 bg-clip-border p-3"></div>
<div class="border-4 bg-indigo-500 bg-clip-padding p-3"></div>
<div class="border-4 bg-indigo-500 bg-clip-content p-3"></div>
Cropping to text
Use the bg-clip-text utility to crop an element's background to match the shape of the text:
Hello world
<p class="bg-linear-to-r from-pink-500 to-violet-500 bg-clip-text text-5xl font-extrabold text-transparent ...">
 Hello world
</p>
Responsive design
Prefix a background-clip utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="bg-clip-border md:bg-clip-padding ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
background-attachment
background-color
On this page
Quick reference
Examples
Basic example
Cropping to text
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

Backgrounds
background-color
Utilities for controlling an element's background color.
Class
Styles
bg-inherit
background-color: inherit;
bg-current
background-color: currentColor;
bg-transparent
background-color: transparent;
bg-black
background-color: var(--color-black); /* #000 */
bg-white
background-color: var(--color-white); /* #fff */
bg-red-50
background-color: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */
bg-red-100
background-color: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */
bg-red-200
background-color: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */
bg-red-300
background-color: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */
bg-red-400
background-color: var(--color-red-400); /* oklch(70.4% 0.191 22.216) */





























































































































































































































































































































































































































































































































































































































































































































































































































































































































































































Show more
Examples
Basic example
Use utilities like bg-white, bg-indigo-500 and bg-transparent to control the background color of an element:
bg-blue-500
Button A
bg-cyan-500
Button B
bg-pink-500
Button C
<button class="bg-blue-500 ...">Button A</button>
<button class="bg-cyan-500 ...">Button B</button>
<button class="bg-pink-500 ...">Button C</button>
Changing the opacity
Use the color opacity modifier to control the opacity of an element's background color:
bg-sky-500/100
Button A
bg-sky-500/75
Button B
bg-sky-500/50
Button C
<button class="bg-sky-500/100 ..."></button>
<button class="bg-sky-500/75 ..."></button>
<button class="bg-sky-500/50 ..."></button>
Using a custom value
Use the bg-[<value>] syntax to set the background color based on a completely custom value:
<div class="bg-[#50d71e] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the bg-(<custom-property>) syntax:
<div class="bg-(--my-color) ...">
 <!-- ... -->
</div>
This is just a shorthand for bg-[var(<custom-property>)] that adds the var() function for you automatically.
Applying on hover
Prefix a background-color utility with a variant like hover:* to only apply the utility in that state:
Save changes
<button class="bg-indigo-500 hover:bg-fuchsia-500 ...">Save changes</button>
Learn more about using variants in the variants documentation.
Responsive design
Prefix a background-color utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="bg-blue-500 md:bg-green-500 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --color-* theme variables to customize the color utilities in your project:
@theme {
 --color-regal-blue: #243c5a;
}
Now the bg-regal-blue utility can be used in your markup:
<div class="bg-regal-blue">
 <!-- ... -->
</div>
Learn more about customizing your theme in the theme documentation.
background-clip
background-image
On this page
Quick reference
Examples
Basic example
Changing the opacity
Using a custom value
Applying on hover
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

BACKGROUNDS
background-image
Utilities for controlling an element's background image.
Class
Styles
bg-[<value>]
background-image: <value>;
bg-(image:<custom-property>)
background-image: var(<custom-property>);
bg-none
background-image: none;
bg-linear-to-t
background-image: linear-gradient(to top, var(--tw-gradient-stops));
bg-linear-to-tr
background-image: linear-gradient(to top right, var(--tw-gradient-stops));
bg-linear-to-r
background-image: linear-gradient(to right, var(--tw-gradient-stops));
bg-linear-to-br
background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
bg-linear-to-b
background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
bg-linear-to-bl
background-image: linear-gradient(to bottom left, var(--tw-gradient-stops));
bg-linear-to-l
background-image: linear-gradient(to left, var(--tw-gradient-stops));

SHOW MORE
EXAMPLES
Basic example
Use the bg-[<value>] syntax to set the background image of an element:
<div class="bg-[url(/img/mountains.jpg)] ..."></div>
Adding a linear gradient
Use utilities like bg-linear-to-r and bg-linear-<angle> with the color stop utilities to add a linear gradient to an element:
<div class="h-14 bg-linear-to-r from-cyan-500 to-blue-500"></div>
<div class="h-14 bg-linear-to-t from-sky-500 to-indigo-500"></div>
<div class="h-14 bg-linear-to-bl from-violet-500 to-fuchsia-500"></div>
<div class="h-14 bg-linear-65 from-purple-500 to-pink-500"></div>
Adding a radial gradient
Use the bg-radial and bg-radial-[<position>] utilities with the color stop utilities to add a radial gradient to an element:
<div class="size-18 rounded-full bg-radial from-pink-400 from-40% to-fuchsia-700"></div>
<div class="size-18 rounded-full bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-900 to-90%"></div>
<div class="size-18 rounded-full bg-radial-[at_25%_25%] from-white to-zinc-900 to-75%"></div>
Adding a conic gradient
Use the bg-conic and bg-conic-<angle> utilities with the color stop utilities to add a conic gradient to an element:
<div class="size-24 rounded-full bg-conic from-blue-600 to-sky-400 to-50%"></div>
<div class="size-24 rounded-full bg-conic-180 from-indigo-600 via-indigo-50 to-indigo-600"></div>
<div class="size-24 rounded-full bg-conic/decreasing from-violet-700 via-lime-300 to-violet-700"></div>
Setting gradient color stops
Use utilities like from-indigo-500, via-purple-500, and to-pink-500 to set the colors of the gradient stops:
<div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."></div>
Setting gradient stop positions
Use utilities like from-10%, via-30%, and to-90% to set more precise positions for the gradient color stops:
10%
30%
90%
<div class="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ..."></div>
Changing interpolation mode
Use the interpolation modifier to control the interpolation mode of a gradient:
srgb
hsl
oklab
oklch
longer
shorter
increasing
decreasing
<div class="bg-linear-to-r/srgb from-indigo-500 to-teal-400"></div>
<div class="bg-linear-to-r/hsl from-indigo-500 to-teal-400"></div>
<div class="bg-linear-to-r/oklab from-indigo-500 to-teal-400"></div>
<div class="bg-linear-to-r/oklch from-indigo-500 to-teal-400"></div>
<div class="bg-linear-to-r/longer from-indigo-500 to-teal-400"></div>
<div class="bg-linear-to-r/shorter from-indigo-500 to-teal-400"></div>
<div class="bg-linear-to-r/increasing from-indigo-500 to-teal-400"></div>
<div class="bg-linear-to-r/decreasing from-indigo-500 to-teal-400"></div>
By default gradients are interpolated in the oklab color space.
Removing background images
Use the bg-none utility to remove an existing background image from an element:
<div class="bg-none"></div>
Using a custom value
Use utilities like bg-linear-[<value>] and from-[<value>] to set the gradient based on a completely custom value:
<div class="bg-linear-[25deg,red_5%,yellow_60%,lime_90%,teal] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the bg-linear-(<custom-property>) syntax:
<div class="bg-linear-(--my-gradient) ...">
 <!-- ... -->
</div>
This is just a shorthand for bg-linear-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a background-image utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="from-purple-400 md:from-yellow-500 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --color-* theme variables to customize the color utilities in your project:
@theme {
 --color-regal-blue: #243c5a;
}
Now utilities like from-regal-blue,via-regal-blue, and to-regal-blue can be used in your markup:
<div class="from-regal-blue">
 <!-- ... -->
</div>
Learn more about customizing your theme in the theme documentation.
background-color
background-origin
ON THIS PAGE
Quick reference
Examples
Basic example
Adding a linear gradient
Adding a radial gradient
Adding a conic gradient
Setting gradient color stops
Setting gradient stop positions
Changing interpolation mode
Removing background images
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

Backgrounds
background-origin
Utilities for controlling how an element's background is positioned relative to borders, padding, and content.
Class
Styles
bg-origin-border
background-origin: border-box;
bg-origin-padding
background-origin: padding-box;
bg-origin-content
background-origin: content-box;

Examples
Basic example
Use the bg-origin-border, bg-origin-padding, and bg-origin-content utilities to control where an element's background is rendered:
bg-origin-border
bg-origin-padding
bg-origin-content
<div class="border-4 bg-[url(/img/mountains.jpg)] bg-origin-border p-3 ..."></div>
<div class="border-4 bg-[url(/img/mountains.jpg)] bg-origin-padding p-3 ..."></div>
<div class="border-4 bg-[url(/img/mountains.jpg)] bg-origin-content p-3 ..."></div>
Responsive design
Prefix a background-origin utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="bg-origin-border md:bg-origin-padding ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
background-image
background-position
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

Backgrounds
background-position
Utilities for controlling the position of an element's background image.
Class
Styles
bg-top-left
background-position: top left;
bg-top
background-position: top;
bg-top-right
background-position: top right;
bg-left
background-position: left;
bg-center
background-position: center;
bg-right
background-position: right;
bg-bottom-left
background-position: bottom left;
bg-bottom
background-position: bottom;
bg-bottom-right
background-position: bottom right;
bg-position-(<custom-property>)
background-position: var(<custom-property>);
bg-position-[<value>]
background-position: <value>;

Examples
Basic example
Use utilities like bg-center, bg-right, and bg-top-left to control the position of an element's background image:
Hover over these examples to see the full image
bg-top-left

bg-top

bg-top-right

bg-left

bg-center

bg-right

bg-bottom-left

bg-bottom

bg-bottom-right

<div class="bg-[url(/img/mountains.jpg)] bg-top-left"></div>
<div class="bg-[url(/img/mountains.jpg)] bg-top"></div>
<div class="bg-[url(/img/mountains.jpg)] bg-top-right"></div>
<div class="bg-[url(/img/mountains.jpg)] bg-left"></div>
<div class="bg-[url(/img/mountains.jpg)] bg-center"></div>
<div class="bg-[url(/img/mountains.jpg)] bg-right"></div>
<div class="bg-[url(/img/mountains.jpg)] bg-bottom-left"></div>
<div class="bg-[url(/img/mountains.jpg)] bg-bottom"></div>
<div class="bg-[url(/img/mountains.jpg)] bg-bottom-right"></div>
Using a custom value
Use the bg-position-[<value>] syntax to set the background position based on a completely custom value:
<div class="bg-position-[center_top_1rem] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the bg-position-(<custom-property>) syntax:
<div class="bg-position-(--my-bg-position) ...">
 <!-- ... -->
</div>
This is just a shorthand for bg-position-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a background-position utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="bg-center md:bg-top ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
background-origin
background-repeat
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

Backgrounds
background-repeat
Utilities for controlling the repetition of an element's background image.
Class
Styles
bg-repeat
background-repeat: repeat;
bg-repeat-x
background-repeat: repeat-x;
bg-repeat-y
background-repeat: repeat-y;
bg-repeat-space
background-repeat: space;
bg-repeat-round
background-repeat: round;
bg-no-repeat
background-repeat: no-repeat;

Examples
Basic example
Use the bg-repeat utility to repeat the background image both vertically and horizontally:
<div class="bg-[url(/img/clouds.svg)] bg-center bg-repeat ..."></div>
Repeating horizontally
Use the bg-repeat-x utility to only repeat the background image horizontally:
<div class="bg-[url(/img/clouds.svg)] bg-center bg-repeat-x ..."></div>
Repeating vertically
Use the bg-repeat-y utility to only repeat the background image vertically:
<div class="bg-[url(/img/clouds.svg)] bg-center bg-repeat-y ..."></div>
Preventing clipping
Use the bg-repeat-space utility to repeat the background image without clipping:
<div class="bg-[url(/img/clouds.svg)] bg-center bg-repeat-space ..."></div>
Preventing clipping and gaps
Use the bg-repeat-round utility to repeat the background image without clipping, stretching if needed to avoid gaps:
<div class="bg-[url(/img/clouds.svg)] bg-center bg-repeat-round ..."></div>
Disabling repeating
Use the bg-no-repeat utility to prevent a background image from repeating:
<div class="bg-[url(/img/clouds.svg)] bg-center bg-no-repeat ..."></div>
Responsive design
Prefix a background-repeat utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="bg-repeat md:bg-repeat-x ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
background-position
background-size
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

Backgrounds
background-size
Utilities for controlling the background size of an element's background image.
Class
Styles
bg-auto
background-size: auto;
bg-cover
background-size: cover;
bg-contain
background-size: contain;
bg-size-(<custom-property>)
background-size: var(<custom-property>);
bg-size-[<value>]
background-size: <value>;

Examples
Filling the container
Use the bg-cover utility to scale the background image until it fills the background layer, cropping the image if needed:
<div class="bg-[url(/img/mountains.jpg)] bg-cover bg-center"></div>
Filling without cropping
Use the bg-contain utility to scale the background image to the outer edges without cropping or stretching:
<div class="bg-[url(/img/mountains.jpg)] bg-contain bg-center"></div>
Using the default size
Use the bg-auto utility to display the background image at its default size:
<div class="bg-[url(/img/mountains.jpg)] bg-auto bg-center bg-no-repeat"></div>
Using a custom value
Use the bg-size-[<value>] syntax to set the background size based on a completely custom value:
<div class="bg-size-[auto_100px] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the bg-size-(<custom-property>) syntax:
<div class="bg-size-(--my-image-size) ...">
 <!-- ... -->
</div>
This is just a shorthand for bg-size-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a background-size utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="bg-auto md:bg-contain ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
background-repeat
border-radius
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

border-radius
Utilities for controlling the border radius of an element.
Class
Styles
rounded-xs
border-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-sm
border-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-md
border-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-lg
border-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-xl
border-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-2xl
border-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-3xl
border-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-4xl
border-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-none
border-radius: 0;
rounded-full
border-radius: calc(infinity * 1px);
rounded-(<custom-property>)
border-radius: var(<custom-property>);
rounded-[<value>]
border-radius: <value>;
rounded-s-xs
border-start-start-radius: var(--radius-xs); /* 0.125rem (2px) */
border-end-start-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-s-sm
border-start-start-radius: var(--radius-sm); /* 0.25rem (4px) */
border-end-start-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-s-md
border-start-start-radius: var(--radius-md); /* 0.375rem (6px) */
border-end-start-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-s-lg
border-start-start-radius: var(--radius-lg); /* 0.5rem (8px) */
border-end-start-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-s-xl
border-start-start-radius: var(--radius-xl); /* 0.75rem (12px) */
border-end-start-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-s-2xl
border-start-start-radius: var(--radius-2xl); /* 1rem (16px) */
border-end-start-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-s-3xl
border-start-start-radius: var(--radius-3xl); /* 1.5rem (24px) */
border-end-start-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-s-4xl
border-start-start-radius: var(--radius-4xl); /* 2rem (32px) */
border-end-start-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-s-none
border-start-start-radius: 0;
border-end-start-radius: 0;
rounded-s-full
border-start-start-radius: calc(infinity * 1px);
border-end-start-radius: calc(infinity * 1px);
rounded-s-(<custom-property>)
border-start-start-radius: var(<custom-property>);
border-end-start-radius: var(<custom-property>);
rounded-s-[<value>]
border-start-start-radius: <value>;
border-end-start-radius: <value>;
rounded-e-xs
border-start-end-radius: var(--radius-xs); /* 0.125rem (2px) */
border-end-end-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-e-sm
border-start-end-radius: var(--radius-sm); /* 0.25rem (4px) */
border-end-end-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-e-md
border-start-end-radius: var(--radius-md); /* 0.375rem (6px) */
border-end-end-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-e-lg
border-start-end-radius: var(--radius-lg); /* 0.5rem (8px) */
border-end-end-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-e-xl
border-start-end-radius: var(--radius-xl); /* 0.75rem (12px) */
border-end-end-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-e-2xl
border-start-end-radius: var(--radius-2xl); /* 1rem (16px) */
border-end-end-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-e-3xl
border-start-end-radius: var(--radius-3xl); /* 1.5rem (24px) */
border-end-end-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-e-4xl
border-start-end-radius: var(--radius-4xl); /* 2rem (32px) */
border-end-end-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-e-none
border-start-end-radius: 0;
border-end-end-radius: 0;
rounded-e-full
border-start-end-radius: calc(infinity * 1px);
border-end-end-radius: calc(infinity * 1px);
rounded-e-(<custom-property>)
border-start-end-radius: var(<custom-property>);
border-end-end-radius: var(<custom-property>);
rounded-e-[<value>]
border-start-end-radius: <value>;
border-end-end-radius: <value>;
rounded-t-xs
border-top-left-radius: var(--radius-xs); /* 0.125rem (2px) */
border-top-right-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-t-sm
border-top-left-radius: var(--radius-sm); /* 0.25rem (4px) */
border-top-right-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-t-md
border-top-left-radius: var(--radius-md); /* 0.375rem (6px) */
border-top-right-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-t-lg
border-top-left-radius: var(--radius-lg); /* 0.5rem (8px) */
border-top-right-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-t-xl
border-top-left-radius: var(--radius-xl); /* 0.75rem (12px) */
border-top-right-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-t-2xl
border-top-left-radius: var(--radius-2xl); /* 1rem (16px) */
border-top-right-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-t-3xl
border-top-left-radius: var(--radius-3xl); /* 1.5rem (24px) */
border-top-right-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-t-4xl
border-top-left-radius: var(--radius-4xl); /* 2rem (32px) */
border-top-right-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-t-none
border-top-left-radius: 0;
border-top-right-radius: 0;
rounded-t-full
border-top-left-radius: calc(infinity * 1px);
border-top-right-radius: calc(infinity * 1px);
rounded-t-(<custom-property>)
border-top-left-radius: var(<custom-property>);
border-top-right-radius: var(<custom-property>);
rounded-t-[<value>]
border-top-left-radius: <value>;
border-top-right-radius: <value>;
rounded-r-xs
border-top-right-radius: var(--radius-xs); /* 0.125rem (2px) */
border-bottom-right-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-r-sm
border-top-right-radius: var(--radius-sm); /* 0.25rem (4px) */
border-bottom-right-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-r-md
border-top-right-radius: var(--radius-md); /* 0.375rem (6px) */
border-bottom-right-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-r-lg
border-top-right-radius: var(--radius-lg); /* 0.5rem (8px) */
border-bottom-right-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-r-xl
border-top-right-radius: var(--radius-xl); /* 0.75rem (12px) */
border-bottom-right-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-r-2xl
border-top-right-radius: var(--radius-2xl); /* 1rem (16px) */
border-bottom-right-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-r-3xl
border-top-right-radius: var(--radius-3xl); /* 1.5rem (24px) */
border-bottom-right-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-r-4xl
border-top-right-radius: var(--radius-4xl); /* 2rem (32px) */
border-bottom-right-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-r-none
border-top-right-radius: 0;
border-bottom-right-radius: 0;
rounded-r-full
border-top-right-radius: calc(infinity * 1px);
border-bottom-right-radius: calc(infinity * 1px);
rounded-r-(<custom-property>)
border-top-right-radius: var(<custom-property>);
border-bottom-right-radius: var(<custom-property>);
rounded-r-[<value>]
border-top-right-radius: <value>;
border-bottom-right-radius: <value>;
rounded-b-xs
border-bottom-right-radius: var(--radius-xs); /* 0.125rem (2px) */
border-bottom-left-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-b-sm
border-bottom-right-radius: var(--radius-sm); /* 0.25rem (4px) */
border-bottom-left-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-b-md
border-bottom-right-radius: var(--radius-md); /* 0.375rem (6px) */
border-bottom-left-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-b-lg
border-bottom-right-radius: var(--radius-lg); /* 0.5rem (8px) */
border-bottom-left-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-b-xl
border-bottom-right-radius: var(--radius-xl); /* 0.75rem (12px) */
border-bottom-left-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-b-2xl
border-bottom-right-radius: var(--radius-2xl); /* 1rem (16px) */
border-bottom-left-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-b-3xl
border-bottom-right-radius: var(--radius-3xl); /* 1.5rem (24px) */
border-bottom-left-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-b-4xl
border-bottom-right-radius: var(--radius-4xl); /* 2rem (32px) */
border-bottom-left-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-b-none
border-bottom-right-radius: 0;
border-bottom-left-radius: 0;
rounded-b-full
border-bottom-right-radius: calc(infinity * 1px);
border-bottom-left-radius: calc(infinity * 1px);
rounded-b-(<custom-property>)
border-bottom-right-radius: var(<custom-property>);
border-bottom-left-radius: var(<custom-property>);
rounded-b-[<value>]
border-bottom-right-radius: <value>;
border-bottom-left-radius: <value>;
rounded-l-xs
border-top-left-radius: var(--radius-xs); /* 0.125rem (2px) */
border-bottom-left-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-l-sm
border-top-left-radius: var(--radius-sm); /* 0.25rem (4px) */
border-bottom-left-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-l-md
border-top-left-radius: var(--radius-md); /* 0.375rem (6px) */
border-bottom-left-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-l-lg
border-top-left-radius: var(--radius-lg); /* 0.5rem (8px) */
border-bottom-left-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-l-xl
border-top-left-radius: var(--radius-xl); /* 0.75rem (12px) */
border-bottom-left-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-l-2xl
border-top-left-radius: var(--radius-2xl); /* 1rem (16px) */
border-bottom-left-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-l-3xl
border-top-left-radius: var(--radius-3xl); /* 1.5rem (24px) */
border-bottom-left-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-l-4xl
border-top-left-radius: var(--radius-4xl); /* 2rem (32px) */
border-bottom-left-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-l-none
border-top-left-radius: 0;
border-bottom-left-radius: 0;
rounded-l-full
border-top-left-radius: calc(infinity * 1px);
border-bottom-left-radius: calc(infinity * 1px);
rounded-l-(<custom-property>)
border-top-left-radius: var(<custom-property>);
border-bottom-left-radius: var(<custom-property>);
rounded-l-[<value>]
border-top-left-radius: <value>;
border-bottom-left-radius: <value>;
rounded-ss-xs
border-start-start-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-ss-sm
border-start-start-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-ss-md
border-start-start-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-ss-lg
border-start-start-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-ss-xl
border-start-start-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-ss-2xl
border-start-start-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-ss-3xl
border-start-start-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-ss-4xl
border-start-start-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-ss-none
border-start-start-radius: 0;
rounded-ss-full
border-start-start-radius: calc(infinity * 1px);
rounded-ss-(<custom-property>)
border-start-start-radius: var(<custom-property>);
rounded-ss-[<value>]
border-start-start-radius: <value>;
rounded-se-xs
border-start-end-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-se-sm
border-start-end-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-se-md
border-start-end-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-se-lg
border-start-end-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-se-xl
border-start-end-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-se-2xl
border-start-end-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-se-3xl
border-start-end-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-se-4xl
border-start-end-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-se-none
border-start-end-radius: 0;
rounded-se-full
border-start-end-radius: calc(infinity * 1px);
rounded-se-(<custom-property>)
border-start-end-radius: var(<custom-property>);
rounded-se-[<value>]
border-start-end-radius: <value>;
rounded-ee-xs
border-end-end-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-ee-sm
border-end-end-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-ee-md
border-end-end-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-ee-lg
border-end-end-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-ee-xl
border-end-end-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-ee-2xl
border-end-end-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-ee-3xl
border-end-end-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-ee-4xl
border-end-end-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-ee-none
border-end-end-radius: 0;
rounded-ee-full
border-end-end-radius: calc(infinity * 1px);
rounded-ee-(<custom-property>)
border-end-end-radius: var(<custom-property>);
rounded-ee-[<value>]
border-end-end-radius: <value>;
rounded-es-xs
border-end-start-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-es-sm
border-end-start-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-es-md
border-end-start-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-es-lg
border-end-start-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-es-xl
border-end-start-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-es-2xl
border-end-start-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-es-3xl
border-end-start-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-es-4xl
border-end-start-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-es-none
border-end-start-radius: 0;
rounded-es-full
border-end-start-radius: calc(infinity * 1px);
rounded-es-(<custom-property>)
border-end-start-radius: var(<custom-property>);
rounded-es-[<value>]
border-end-start-radius: <value>;
rounded-tl-xs
border-top-left-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-tl-sm
border-top-left-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-tl-md
border-top-left-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-tl-lg
border-top-left-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-tl-xl
border-top-left-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-tl-2xl
border-top-left-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-tl-3xl
border-top-left-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-tl-4xl
border-top-left-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-tl-none
border-top-left-radius: 0;
rounded-tl-full
border-top-left-radius: calc(infinity * 1px);
rounded-tl-(<custom-property>)
border-top-left-radius: var(<custom-property>);
rounded-tl-[<value>]
border-top-left-radius: <value>;
rounded-tr-xs
border-top-right-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-tr-sm
border-top-right-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-tr-md
border-top-right-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-tr-lg
border-top-right-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-tr-xl
border-top-right-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-tr-2xl
border-top-right-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-tr-3xl
border-top-right-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-tr-4xl
border-top-right-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-tr-none
border-top-right-radius: 0;
rounded-tr-full
border-top-right-radius: calc(infinity * 1px);
rounded-tr-(<custom-property>)
border-top-right-radius: var(<custom-property>);
rounded-tr-[<value>]
border-top-right-radius: <value>;
rounded-br-xs
border-bottom-right-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-br-sm
border-bottom-right-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-br-md
border-bottom-right-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-br-lg
border-bottom-right-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-br-xl
border-bottom-right-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-br-2xl
border-bottom-right-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-br-3xl
border-bottom-right-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-br-4xl
border-bottom-right-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-br-none
border-bottom-right-radius: 0;
rounded-br-full
border-bottom-right-radius: calc(infinity * 1px);
rounded-br-(<custom-property>)
border-bottom-right-radius: var(<custom-property>);
rounded-br-[<value>]
border-bottom-right-radius: <value>;
rounded-bl-xs
border-bottom-left-radius: var(--radius-xs); /* 0.125rem (2px) */
rounded-bl-sm
border-bottom-left-radius: var(--radius-sm); /* 0.25rem (4px) */
rounded-bl-md
border-bottom-left-radius: var(--radius-md); /* 0.375rem (6px) */
rounded-bl-lg
border-bottom-left-radius: var(--radius-lg); /* 0.5rem (8px) */
rounded-bl-xl
border-bottom-left-radius: var(--radius-xl); /* 0.75rem (12px) */
rounded-bl-2xl
border-bottom-left-radius: var(--radius-2xl); /* 1rem (16px) */
rounded-bl-3xl
border-bottom-left-radius: var(--radius-3xl); /* 1.5rem (24px) */
rounded-bl-4xl
border-bottom-left-radius: var(--radius-4xl); /* 2rem (32px) */
rounded-bl-none
border-bottom-left-radius: 0;
rounded-bl-full
border-bottom-left-radius: calc(infinity * 1px);
rounded-bl-(<custom-property>)
border-bottom-left-radius: var(<custom-property>);
rounded-bl-[<value>]
border-bottom-left-radius: <value>;

Show less
Examples
Basic example
Use utilities like rounded-sm and rounded-md to apply different border radius sizes to an element:
rounded-sm
rounded-md
rounded-lg
rounded-xl
<div class="rounded-sm ..."></div>
<div class="rounded-md ..."></div>
<div class="rounded-lg ..."></div>
<div class="rounded-xl ..."></div>
Rounding sides separately
Use utilities like rounded-t-md and rounded-r-lg to only round one side of an element:
rounded-t-lg
rounded-r-lg
rounded-b-lg
rounded-l-lg
<div class="rounded-t-lg ..."></div>
<div class="rounded-r-lg ..."></div>
<div class="rounded-b-lg ..."></div>
<div class="rounded-l-lg ..."></div>
Rounding corners separately
Use utilities like rounded-tr-md and rounded-tl-lg utilities to only round one corner of an element:
rounded-tl-lg
rounded-tr-lg
rounded-br-lg
rounded-bl-lg
<div class="rounded-tl-lg ..."></div>
<div class="rounded-tr-lg ..."></div>
<div class="rounded-br-lg ..."></div>
<div class="rounded-bl-lg ..."></div>
Using logical properties
Use utilities like rounded-s-md and rounded-se-xl to set the border radius using logical properties, which map to the appropriate corners based on the text direction:
Left-to-right
Right-to-left
<div dir="ltr">
 <div class="rounded-s-lg ..."></div>
</div>
<div dir="rtl">
 <div class="rounded-s-lg ..."></div>
</div>
Here are all the available border radius logical property utilities and their physical property equivalents in both LTR and RTL modes.
Class
Left-to-right
Right-to-left
rounded-s-*
rounded-l-*
rounded-r-*
rounded-e-*
rounded-r-*
rounded-l-*
rounded-ss-*
rounded-tl-*
rounded-tr-*
rounded-se-*
rounded-tr-*
rounded-tl-*
rounded-es-*
rounded-bl-*
rounded-br-*
rounded-ee-*
rounded-br-*
rounded-bl-*

For more control, you can also use the LTR and RTL modifiers to conditionally apply specific styles depending on the current text direction.
Creating pill buttons
Use the rounded-full utility to create pill buttons:
rounded-full
Save Changes
<button class="rounded-full ...">Save Changes</button>
Removing the border radius
Use the rounded-none utility to remove an existing border radius from an element:
rounded-none
Save Changes
<button class="rounded-none ...">Save Changes</button>
Using a custom value
Use the rounded-[<value>] syntax to set the border radius based on a completely custom value:
<div class="rounded-[2vw] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the rounded-(<custom-property>) syntax:
<div class="rounded-(--my-radius) ...">
 <!-- ... -->
</div>
This is just a shorthand for rounded-[var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a border-radius utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="rounded md:rounded-lg ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
Customizing your theme
Use the --radius-* theme variables to customize the border radius utilities in your project:
@theme {
 --radius-5xl: 3rem;
}
Now the rounded-5xl utility can be used in your markup:
<div class="rounded-5xl">
 <!-- ... -->
</div>
Learn more about customizing your theme in the theme documentation.
background-size
border-width
On this page
Quick reference
Examples
Basic example
Rounding sides separately
Rounding corners separately
Using logical properties
Creating pill buttons
Removing the border radius
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
border-width
Utilities for controlling the width of an element's borders.
Class
Styles
border
border-width: 1px;
border-<number>
border-width: <number>px;
border-(length:<custom-property>)
border-width: var(<custom-property>);
border-[<value>]
border-width: <value>;
border-x
border-inline-width: 1px;
border-x-<number>
border-inline-width: <number>px;
border-x-(length:<custom-property>)
border-inline-width: var(<custom-property>);
border-x-[<value>]
border-inline-width: <value>;
border-y
border-block-width: 1px;
border-y-<number>
border-block-width: <number>px;
border-y-(length:<custom-property>)
border-block-width: var(<custom-property>);
border-y-[<value>]
border-block-width: <value>;
border-s
border-inline-start-width: 1px;
border-s-<number>
border-inline-start-width: <number>px;
border-s-(length:<custom-property>)
border-inline-start-width: var(<custom-property>);
border-s-[<value>]
border-inline-start-width: <value>;
border-e
border-inline-end-width: 1px;
border-e-<number>
border-inline-end-width: <number>px;
border-e-(length:<custom-property>)
border-inline-end-width: var(<custom-property>);
border-e-[<value>]
border-inline-end-width: <value>;
border-t
border-top-width: 1px;
border-t-<number>
border-top-width: <number>px;
border-t-(length:<custom-property>)
border-top-width: var(<custom-property>);
border-t-[<value>]
border-top-width: <value>;
border-r
border-right-width: 1px;
border-r-<number>
border-right-width: <number>px;
border-r-(length:<custom-property>)
border-right-width: var(<custom-property>);
border-r-[<value>]
border-right-width: <value>;
border-b
border-bottom-width: 1px;
border-b-<number>
border-bottom-width: <number>px;
border-b-(length:<custom-property>)
border-bottom-width: var(<custom-property>);
border-b-[<value>]
border-bottom-width: <value>;
border-l
border-left-width: 1px;
border-l-<number>
border-left-width: <number>px;
border-l-(length:<custom-property>)
border-left-width: var(<custom-property>);
border-l-[<value>]
border-left-width: <value>;
divide-x
& > :not(:last-child) {
  border-inline-start-width: 0px;
  border-inline-end-width: 1px;
}
divide-x-<number>
& > :not(:last-child) {
  border-inline-start-width: 0px;
  border-inline-end-width: <number>px;
}
divide-x-(length:<custom-property>)
& > :not(:last-child) {
  border-inline-start-width: 0px;
  border-inline-end-width: var(<custom-property>);
}
divide-x-[<value>]
& > :not(:last-child) {
  border-inline-start-width: 0px;
  border-inline-end-width: <value>;
}
divide-y
& > :not(:last-child) {
  border-top-width: 0px;
  border-bottom-width: 1px;
}
divide-y-<number>
& > :not(:last-child) {
  border-top-width: 0px;
  border-bottom-width: <number>px;
}
divide-y-(length:<custom-property>)
& > :not(:last-child) {
  border-top-width: 0px;
  border-bottom-width: var(<custom-property>);
}
divide-y-[<value>]
& > :not(:last-child) {
  border-top-width: 0px;
  border-bottom-width: <value>;
}
divide-x-reverse
--tw-divide-x-reverse: 1;
divide-y-reverse
--tw-divide-y-reverse: 1;

Show less
Examples
Basic example
Use border or border-<number> utilities like border-2 and border-4 to set the border width for all sides of an element:
border
border-2
border-4
border-8
<div class="border border-indigo-600 ..."></div>
<div class="border-2 border-indigo-600 ..."></div>
<div class="border-4 border-indigo-600 ..."></div>
<div class="border-8 border-indigo-600 ..."></div>
Individual sides
Use utilities like border-r and border-t-4 to set the border width for one side of an element:
border-t-4
border-r-4
border-b-4
border-l-4
<div class="border-t-4 border-indigo-500 ..."></div>
<div class="border-r-4 border-indigo-500 ..."></div>
<div class="border-b-4 border-indigo-500 ..."></div>
<div class="border-l-4 border-indigo-500 ..."></div>
Horizontal and vertical sides
Use utilities like border-x and border-y-4 to set the border width on two sides of an element at the same time:
border-x-4
border-y-4
<div class="border-x-4 border-indigo-500 ..."></div>
<div class="border-y-4 border-indigo-500 ..."></div>
Using logical properties
Use utilities like border-s and border-e-4 to set the border-inline-start-width and border-inline-end-width logical properties, which map to either the left or right border based on the text direction:
Left-to-right
Right-to-left
<div dir="ltr">
 <div class="border-s-4 ..."></div>
</div>
<div dir="rtl">
 <div class="border-s-4 ..."></div>
</div>
Between children
Use utilities like divide-x and divide-y-4 to add borders between child elements:
01
02
03
<div class="grid grid-cols-3 divide-x-4">
 <div>01</div>
 <div>02</div>
 <div>03</div>
</div>
Reversing children order
If your elements are in reverse order (using say flex-row-reverse or flex-col-reverse), use the divide-x-reverse or divide-y-reverse utilities to ensure the border is added to the correct side of each element:
01
02
03
<div class="flex flex-col-reverse divide-y-4 divide-y-reverse divide-gray-200">
 <div>01</div>
 <div>02</div>
 <div>03</div>
</div>
Using a custom value
Use the border-[<value>] syntax to set the border width based on a completely custom value:
<div class="border-[2vw] ...">
 <!-- ... -->
</div>
For CSS variables, you can also use the border-(length:<custom-property>) syntax:
<div class="border-(length:--my-border-width) ...">
 <!-- ... -->
</div>
This is just a shorthand for border-[length:var(<custom-property>)] that adds the var() function for you automatically.
Responsive design
Prefix a border-width utility with a breakpoint variant like md: to only apply the utility at medium screen sizes and above:
<div class="border-2 md:border-t-4 ...">
 <!-- ... -->
</div>
Learn more about using variants in the variants documentation.
border-radius
border-color
On this page
Quick reference
Examples
Basic example
Individual sides
Horizontal and vertical sides
Using logical properties
Between children
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


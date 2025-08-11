# Shadcn Documentation

## 📋 Document Directory & Navigation

### 📖 Overview
This document serves as the comprehensive guide for Shadcn UI components integration and usage within the github-link-up-buddy project. It covers installation, configuration, component usage, theming, customization, and best practices.

### 🧭 Quick Navigation
- **Getting Started**: Installation, setup, and basic configuration
- **Components**: Complete component library reference
- **Theming**: Custom themes, CSS variables, and design tokens
- **Integration**: React, TypeScript, and build tool integration
- **Advanced**: Custom components, hooks, and utilities

### 📑 Detailed Table of Contents

#### 1. Getting Started
- 1.1 Installation and Setup
- 1.2 Project Configuration
- 1.3 CLI Tool Usage
- 1.4 Dependencies and Requirements
- 1.5 Initial Component Setup

#### 2. Core Components
- 2.1 Layout Components (Container, Grid, Flex)
- 2.2 Typography (Text, Heading, Code)
- 2.3 Form Components (Input, Button, Select, Checkbox)
- 2.4 Navigation (Menu, Breadcrumb, Tabs)
- 2.5 Feedback (Alert, Toast, Dialog, Tooltip)
- 2.6 Data Display (Table, Card, Badge, Avatar)
- 2.7 Overlay Components (Modal, Popover, Dropdown)

#### 3. Advanced Components
- 3.1 Data Entry (DatePicker, Slider, Switch)
- 3.2 Media Components (Image, Video, Icon)
- 3.3 Chart and Visualization Components
- 3.4 Complex Form Components
- 3.5 Custom Component Patterns

#### 4. Theming and Customization
- 4.1 Theme Configuration
- 4.2 CSS Variables and Custom Properties
- 4.3 Dark Mode Implementation
- 4.4 Color Palette Customization
- 4.5 Typography Scale Configuration
- 4.6 Spacing and Layout Tokens
- 4.7 Component-specific Styling

#### 5. Integration Patterns
- 5.1 React Integration Best Practices
- 5.2 TypeScript Usage and Types
- 5.3 Form Library Integration (React Hook Form)
- 5.4 State Management Integration
- 5.5 Animation and Transition Patterns
- 5.6 Accessibility Implementation

#### 6. Build and Development
- 6.1 Vite Configuration
- 6.2 PostCSS and Tailwind Integration
- 6.3 Bundle Optimization
- 6.4 Development Workflow
- 6.5 Testing Strategies
- 6.6 Storybook Integration

#### 7. Project-Specific Usage
- 7.1 GitHub Link-Up Buddy Component Library
- 7.2 Custom Component Extensions
- 7.3 Design System Integration
- 7.4 Brand Guidelines Implementation
- 7.5 Performance Optimization
- 7.6 Mobile Responsiveness

#### 8. Advanced Patterns
- 8.1 Compound Component Patterns
- 8.2 Render Props and Higher-Order Components
- 8.3 Custom Hooks for Shadcn Components
- 8.4 Context API Integration
- 8.5 Server-Side Rendering Considerations
- 8.6 Progressive Enhancement

#### 9. Troubleshooting and Debugging
- 9.1 Common Issues and Solutions
- 9.2 Performance Debugging
- 9.3 Styling Conflicts Resolution
- 9.4 Build Error Troubleshooting
- 9.5 Browser Compatibility Issues
- 9.6 Development Tools and Extensions

#### 10. Best Practices and Guidelines
- 10.1 Component Composition Guidelines
- 10.2 Performance Best Practices
- 10.3 Accessibility Standards
- 10.4 Code Organization Patterns
- 10.5 Testing Strategies
- 10.6 Documentation Standards

#### 11. Migration and Updates
- 11.1 Version Migration Guides
- 11.2 Breaking Changes Documentation
- 11.3 Update Strategies
- 11.4 Deprecation Handling
- 11.5 Legacy Component Support

#### 12. Resources and References
- 12.1 Official Documentation Links
- 12.2 Community Resources
- 12.3 Example Implementations
- 12.4 Related Libraries and Tools
- 12.5 Design System Resources
- 12.6 Contributing Guidelines

### 🔍 How to Use This Document
1. **Quick Reference**: Use the Quick Navigation for immediate access to major sections
2. **Detailed Search**: Use the numbered table of contents for specific topics
3. **Context-Aware**: Each section includes project-specific examples and patterns
4. **Cross-References**: Look for internal links between related sections

### 🏷️ Search Keywords
`shadcn`, `ui-components`, `react-components`, `theming`, `customization`, `forms`, `navigation`, `layout`, `accessibility`, `typescript`, `vite`, `tailwind`, `design-system`, `component-library`, `styling`, `dark-mode`, `responsive`, `performance`, `testing`, `storybook`, `hooks`, `context`, `ssr`, `migration`, `troubleshooting`

---

    shadcn/ui
DocsComponentsBlocksChartsThemesColors
Search documentation...
91.0k
Toggle layout
Toggle theme
Get Started
* Introduction
* Installation
* components.json
* Theming
* Dark Mode
* CLI
* Monorepo
* Open in v0
* JavaScript
* Blocks
* Figma
* Changelog
* Legacy Docs
Components
* Accordion
* Alert
* Alert Dialog
* Aspect Ratio
* Avatar
* Badge
* Breadcrumb
* Button
* Calendar
* Card
* Carousel
* Chart
* Checkbox
* Collapsible
* Combobox
* Command
* Context Menu
* Data Table
* Date Picker
* Dialog
* Drawer
* Dropdown Menu
* React Hook Form
* Hover Card
* Input
* Input OTP
* Label
* Menubar
* Navigation Menu
* Pagination
* Popover
* Progress
* Radio Group
* Resizable
* Scroll-area
* Select
* Separator
* Sheet
* Sidebar
* Skeleton
* Slider
* Sonner
* Switch
* Table
* Tabs
* Textarea
* Toast
* Toggle
* Toggle Group
* Tooltip
* Typography
Installation
* Next.js
* Vite
* Laravel
* React Router
* Remix
* Astro
* TanStack Start
* TanStack Router
* Manual Installation
Dark mode
* Dark Mode
* Next.js
* Vite
* Astro
* Remix
Registry
* Registry
* Getting Started
* FAQ
* Open in v0
* Examples
* registry.json
* registry-item.json
Introduction
Next
shadcn/ui is a set of beautifully-designed, accessible components and a code distribution platform. Works with your favorite frameworks and AI models. Open Source. Open Code.
This is not a component library. It is how you build your component library.
You know how most traditional component libraries work: you install a package from NPM, import the components, and use them in your app.
This approach works well until you need to customize a component to fit your design system or require one that isn’t included in the library. Often, you end up wrapping library components, writing workarounds to override styles, or mixing components from different libraries with incompatible APIs.
This is what shadcn/ui aims to solve. It is built around the following principles:
* Open Code: The top layer of your component code is open for modification.
* Composition: Every component uses a common, composable interface, making them predictable.
* Distribution: A flat-file schema and command-line tool make it easy to distribute components.
* Beautiful Defaults: Carefully chosen default styles, so you get great design out-of-the-box.
* AI-Ready: Open code for LLMs to read, understand, and improve.
Open Code
shadcn/ui hands you the actual component code. You have full control to customize and extend the components to your needs. This means:
* Full Transparency: You see exactly how each component is built.
* Easy Customization: Modify any part of a component to fit your design and functionality requirements.
* AI Integration: Access to the code makes it straightforward for LLMs to read, understand, and even improve your components.
In a typical library, if you need to change a button’s behavior, you have to override styles or wrap the component. With shadcn/ui, you simply edit the button code directly.
How do I pull upstream updates in an Open Code approach?
Composition
Every component in shadcn/ui shares a common, composable interface. If a component does not exist, we bring it in, make it composable, and adjust its style to match and work with the rest of the design system.
A shared, composable interface means it's predictable for both your team and LLMs. You are not learning different APIs for every new component. Even for third-party ones.
Distribution
shadcn/ui is also a code distribution system. It defines a schema for components and a CLI to distribute them.
* Schema: A flat-file structure that defines the components, their dependencies, and properties.
* CLI: A command-line tool to distribute and install components across projects with cross-framework support.
You can use the schema to distribute your components to other projects or have AI generate completely new components based on existing schema.
Beautiful Defaults
shadcn/ui comes with a large collection of components that have carefully chosen default styles. They are designed to look good on their own and to work well together as a consistent system:
* Good Out-of-the-Box: Your UI has a clean and minimal look without extra work.
* Unified Design: Components naturally fit with one another. Each component is built to match the others, keeping your UI consistent.
* Easily Customizable: If you want to change something, it's simple to override and extend the defaults.
AI-Ready
The design of shadcn/ui makes it easy for AI tools to work with your code. Its open code and consistent API allow AI models to read, understand, and even generate new components.
An AI model can learn how your components work and suggest improvements or even create new components that integrate with your existing design.
Installation
On This Page
Open CodeCompositionDistributionBeautiful DefaultsAI-Ready
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Introduction - shadcn/ui
Mon




components.json
Previous
Next
Configuration for your project.
The components.json file holds configuration for your project.
We use it to understand how your project is set up and how to generate components customized for your project.
Note: The `components.json` file is optional
It is only required if you're using the CLI to add components to your project. If you're using the copy and paste method, you don't need this file.
You can create a components.json file in your project by running the following command:
pnpmnpmyarnbun
pnpm dlx shadcn@latest init
Copy
See the CLI section for more information.
$schema
You can see the JSON Schema for components.json here.
components.json
Copy
{  "$schema": "https://ui.shadcn.com/schema.json"}
style
The style for your components. This cannot be changed after initialization.
components.json
Copy
{  "style": "new-york"}
The default style has been deprecated. Use the new-york style instead.
tailwind
Configuration to help the CLI understand how Tailwind CSS is set up in your project.
See the installation section for how to set up Tailwind CSS.
tailwind.config
Path to where your tailwind.config.js file is located. For Tailwind CSS v4, leave this blank.
components.json
Copy
{  "tailwind": {    "config": "tailwind.config.js" | "tailwind.config.ts"  }}
tailwind.css
Path to the CSS file that imports Tailwind CSS into your project.
components.json
Copy
{  "tailwind": {    "css": "styles/global.css"  }}
tailwind.baseColor
This is used to generate the default color palette for your components. This cannot be changed after initialization.
components.json
Copy
{  "tailwind": {    "baseColor": "gray" | "neutral" | "slate" | "stone" | "zinc"  }}
tailwind.cssVariables
You can choose between using CSS variables or Tailwind CSS utility classes for theming.
To use utility classes for theming set tailwind.cssVariables to false. For CSS variables, set tailwind.cssVariables to true.
components.json
Copy
{  "tailwind": {    "cssVariables": `true` | `false`  }}
For more information, see the theming docs.
This cannot be changed after initialization. To switch between CSS variables and utility classes, you'll have to delete and re-install your components.
tailwind.prefix
The prefix to use for your Tailwind CSS utility classes. Components will be added with this prefix.
components.json
Copy
{  "tailwind": {    "prefix": "tw-"  }}
rsc
Whether or not to enable support for React Server Components.
The CLI automatically adds a use client directive to client components when set to true.
components.json
Copy
{  "rsc": `true` | `false`}
tsx
Choose between TypeScript or JavaScript components.
Setting this option to false allows components to be added as JavaScript with the .jsx file extension.
components.json
Copy
{  "tsx": `true` | `false`}
aliases
The CLI uses these values and the paths config from your tsconfig.json or jsconfig.json file to place generated components in the correct location.
Path aliases have to be set up in your tsconfig.json or jsconfig.json file.
Important: If you're using the src directory, make sure it is included under paths in your tsconfig.json or jsconfig.json file.
aliases.utils
Import alias for your utility functions.
components.json
Copy
{  "aliases": {    "utils": "@/lib/utils"  }}
aliases.components
Import alias for your components.
components.json
Copy
{  "aliases": {    "components": "@/components"  }}
aliases.ui
Import alias for ui components.
The CLI will use the aliases.ui value to determine where to place your ui components. Use this config if you want to customize the installation directory for your ui components.
components.json
Copy
{  "aliases": {    "ui": "@/app/ui"  }}
aliases.lib
Import alias for lib functions such as format-date or generate-id.
components.json
Copy
{  "aliases": {    "lib": "@/lib"  }}
aliases.hooks
Import alias for hooks such as use-media-query or use-toast.
components.json
Copy
{  "aliases": {    "hooks": "@/hooks"  }}
InstallationTheming
On This Page
$schemastyletailwindtailwind.configtailwind.csstailwind.baseColortailwind.cssVariablestailwind.prefixrsctsxaliasesaliases.utilsaliases.componentsaliases.uialiases.libaliases.hooks
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
components.json - shadcn/ui
Mon

Theming
Previous
Next
Using CSS Variables and color utilities for theming.
You can choose between using CSS variables (recommended) or utility classes for theming.
CSS Variables
Copy
<div className="bg-background text-foreground" />
To use CSS variables for theming set tailwind.cssVariables to true in your components.json file.
components.json
Copy
{  "style": "default",  "rsc": true,  "tailwind": {    "config": "",    "css": "app/globals.css",    "baseColor": "neutral",    "cssVariables": true  },  "aliases": {    "components": "@/components",    "utils": "@/lib/utils",    "ui": "@/components/ui",    "lib": "@/lib",    "hooks": "@/hooks"  },  "iconLibrary": "lucide"}
Utility classes
Copy
<div className="bg-zinc-950 dark:bg-white" />
To use utility classes for theming set tailwind.cssVariables to false in your components.json file.
components.json
Copy
{  "style": "default",  "rsc": true,  "tailwind": {    "config": "",    "css": "app/globals.css",    "baseColor": "neutral",    "cssVariables": false  },  "aliases": {    "components": "@/components",    "utils": "@/lib/utils",    "ui": "@/components/ui",    "lib": "@/lib",    "hooks": "@/hooks"  },  "iconLibrary": "lucide"}
Convention
We use a simple background and foreground convention for colors. The background variable is used for the background color of the component and the foreground variable is used for the text color.
The background suffix is omitted when the variable is used for the background color of the component.
Given the following CSS variables:
Copy
--primary: oklch(0.205 0 0);--primary-foreground: oklch(0.985 0 0);
The background color of the following component will be var(--primary) and the foreground color will be var(--primary-foreground).
Copy
<div className="bg-primary text-primary-foreground">Hello</div>
List of variables
Here's the list of variables available for customization:
app/globals.css
Copy
:root {  --radius: 0.625rem;  --background: oklch(1 0 0);  --foreground: oklch(0.145 0 0);  --card: oklch(1 0 0);  --card-foreground: oklch(0.145 0 0);  --popover: oklch(1 0 0);  --popover-foreground: oklch(0.145 0 0);  --primary: oklch(0.205 0 0);  --primary-foreground: oklch(0.985 0 0);  --secondary: oklch(0.97 0 0);  --secondary-foreground: oklch(0.205 0 0);  --muted: oklch(0.97 0 0);  --muted-foreground: oklch(0.556 0 0);  --accent: oklch(0.97 0 0);  --accent-foreground: oklch(0.205 0 0);  --destructive: oklch(0.577 0.245 27.325);  --border: oklch(0.922 0 0);  --input: oklch(0.922 0 0);  --ring: oklch(0.708 0 0);  --chart-1: oklch(0.646 0.222 41.116);  --chart-2: oklch(0.6 0.118 184.704);  --chart-3: oklch(0.398 0.07 227.392);  --chart-4: oklch(0.828 0.189 84.429);  --chart-5: oklch(0.769 0.188 70.08);  --sidebar: oklch(0.985 0 0);  --sidebar-foreground: oklch(0.145 0 0);  --sidebar-primary: oklch(0.205 0 0);  --sidebar-primary-foreground: oklch(0.985 0 0);  --sidebar-accent: oklch(0.97 0 0);  --sidebar-accent-foreground: oklch(0.205 0 0);  --sidebar-border: oklch(0.922 0 0);  --sidebar-ring: oklch(0.708 0 0);} .dark {  --background: oklch(0.145 0 0);  --foreground: oklch(0.985 0 0);  --card: oklch(0.205 0 0);  --card-foreground: oklch(0.985 0 0);  --popover: oklch(0.269 0 0);  --popover-foreground: oklch(0.985 0 0);  --primary: oklch(0.922 0 0);  --primary-foreground: oklch(0.205 0 0);  --secondary: oklch(0.269 0 0);  --secondary-foreground: oklch(0.985 0 0);  --muted: oklch(0.269 0 0);  --muted-foreground: oklch(0.708 0 0);  --accent: oklch(0.371 0 0);  --accent-foreground: oklch(0.985 0 0);  --destructive: oklch(0.704 0.191 22.216);  --border: oklch(1 0 0 / 10%);  --input: oklch(1 0 0 / 15%);  --ring: oklch(0.556 0 0);  --chart-1: oklch(0.488 0.243 264.376);  --chart-2: oklch(0.696 0.17 162.48);  --chart-3: oklch(0.769 0.188 70.08);  --chart-4: oklch(0.627 0.265 303.9);  --chart-5: oklch(0.645 0.246 16.439);  --sidebar: oklch(0.205 0 0);  --sidebar-foreground: oklch(0.985 0 0);  --sidebar-primary: oklch(0.488 0.243 264.376);  --sidebar-primary-foreground: oklch(0.985 0 0);  --sidebar-accent: oklch(0.269 0 0);  --sidebar-accent-foreground: oklch(0.985 0 0);  --sidebar-border: oklch(1 0 0 / 10%);  --sidebar-ring: oklch(0.439 0 0);}
Adding new colors
To add new colors, you need to add them to your CSS file and to your tailwind.config.js file.
app/globals.css
Copy
:root {  --warning: oklch(0.84 0.16 84);  --warning-foreground: oklch(0.28 0.07 46);} .dark {  --warning: oklch(0.41 0.11 46);  --warning-foreground: oklch(0.99 0.02 95);} @theme inline {  --color-warning: var(--warning);  --color-warning-foreground: var(--warning-foreground);}
You can now use the warning utility class in your components.
Copy
<div className="bg-warning text-warning-foreground" />
Other color formats
See the Tailwind CSS documentation for more information on using colors in Tailwind CSS.
Base Colors
For reference, here's a list of the base colors that are available.
Neutral
Expand
app/globals.css
Copy
:root {  --radius: 0.625rem;  --background: oklch(1 0 0);  --foreground: oklch(0.145 0 0);  --card: oklch(1 0 0);  --card-foreground: oklch(0.145 0 0);  --popover: oklch(1 0 0);  --popover-foreground: oklch(0.145 0 0);  --primary: oklch(0.205 0 0);  --primary-foreground: oklch(0.985 0 0);  --secondary: oklch(0.97 0 0);  --secondary-foreground: oklch(0.205 0 0);  --muted: oklch(0.97 0 0);  --muted-foreground: oklch(0.556 0 0);  --accent: oklch(0.97 0 0);  --accent-foreground: oklch(0.205 0 0);  --destructive: oklch(0.577 0.245 27.325);  --border: oklch(0.922 0 0);  --input: oklch(0.922 0 0);  --ring: oklch(0.708 0 0);  --chart-1: oklch(0.646 0.222 41.116);  --chart-2: oklch(0.6 0.118 184.704);  --chart-3: oklch(0.398 0.07 227.392);  --chart-4: oklch(0.828 0.189 84.429);  --chart-5: oklch(0.769 0.188 70.08);  --sidebar: oklch(0.985 0 0);  --sidebar-foreground: oklch(0.145 0 0);  --sidebar-primary: oklch(0.205 0 0);  --sidebar-primary-foreground: oklch(0.985 0 0);  --sidebar-accent: oklch(0.97 0 0);  --sidebar-accent-foreground: oklch(0.205 0 0);  --sidebar-border: oklch(0.922 0 0);  --sidebar-ring: oklch(0.708 0 0);} .dark {  --background: oklch(0.145 0 0);  --foreground: oklch(0.985 0 0);  --card: oklch(0.205 0 0);  --card-foreground: oklch(0.985 0 0);  --popover: oklch(0.205 0 0);  --popover-foreground: oklch(0.985 0 0);  --primary: oklch(0.922 0 0);  --primary-foreground: oklch(0.205 0 0);  --secondary: oklch(0.269 0 0);  --secondary-foreground: oklch(0.985 0 0);  --muted: oklch(0.269 0 0);  --muted-foreground: oklch(0.708 0 0);  --accent: oklch(0.269 0 0);  --accent-foreground: oklch(0.985 0 0);  --destructive: oklch(0.704 0.191 22.216);  --border: oklch(1 0 0 / 10%);  --input: oklch(1 0 0 / 15%);  --ring: oklch(0.556 0 0);  --chart-1: oklch(0.488 0.243 264.376);  --chart-2: oklch(0.696 0.17 162.48);  --chart-3: oklch(0.769 0.188 70.08);  --chart-4: oklch(0.627 0.265 303.9);  --chart-5: oklch(0.645 0.246 16.439);  --sidebar: oklch(0.205 0 0);  --sidebar-foreground: oklch(0.985 0 0);  --sidebar-primary: oklch(0.488 0.243 264.376);  --sidebar-primary-foreground: oklch(0.985 0 0);  --sidebar-accent: oklch(0.269 0 0);  --sidebar-accent-foreground: oklch(0.985 0 0);  --sidebar-border: oklch(1 0 0 / 10%);  --sidebar-ring: oklch(0.556 0 0);}
Expand
Stone
Expand
app/globals.css
Copy
:root {  --radius: 0.625rem;  --background: oklch(1 0 0);  --foreground: oklch(0.147 0.004 49.25);  --card: oklch(1 0 0);  --card-foreground: oklch(0.147 0.004 49.25);  --popover: oklch(1 0 0);  --popover-foreground: oklch(0.147 0.004 49.25);  --primary: oklch(0.216 0.006 56.043);  --primary-foreground: oklch(0.985 0.001 106.423);  --secondary: oklch(0.97 0.001 106.424);  --secondary-foreground: oklch(0.216 0.006 56.043);  --muted: oklch(0.97 0.001 106.424);  --muted-foreground: oklch(0.553 0.013 58.071);  --accent: oklch(0.97 0.001 106.424);  --accent-foreground: oklch(0.216 0.006 56.043);  --destructive: oklch(0.577 0.245 27.325);  --border: oklch(0.923 0.003 48.717);  --input: oklch(0.923 0.003 48.717);  --ring: oklch(0.709 0.01 56.259);  --chart-1: oklch(0.646 0.222 41.116);  --chart-2: oklch(0.6 0.118 184.704);  --chart-3: oklch(0.398 0.07 227.392);  --chart-4: oklch(0.828 0.189 84.429);  --chart-5: oklch(0.769 0.188 70.08);  --sidebar: oklch(0.985 0.001 106.423);  --sidebar-foreground: oklch(0.147 0.004 49.25);  --sidebar-primary: oklch(0.216 0.006 56.043);  --sidebar-primary-foreground: oklch(0.985 0.001 106.423);  --sidebar-accent: oklch(0.97 0.001 106.424);  --sidebar-accent-foreground: oklch(0.216 0.006 56.043);  --sidebar-border: oklch(0.923 0.003 48.717);  --sidebar-ring: oklch(0.709 0.01 56.259);} .dark {  --background: oklch(0.147 0.004 49.25);  --foreground: oklch(0.985 0.001 106.423);  --card: oklch(0.216 0.006 56.043);  --card-foreground: oklch(0.985 0.001 106.423);  --popover: oklch(0.216 0.006 56.043);  --popover-foreground: oklch(0.985 0.001 106.423);  --primary: oklch(0.923 0.003 48.717);  --primary-foreground: oklch(0.216 0.006 56.043);  --secondary: oklch(0.268 0.007 34.298);  --secondary-foreground: oklch(0.985 0.001 106.423);  --muted: oklch(0.268 0.007 34.298);  --muted-foreground: oklch(0.709 0.01 56.259);  --accent: oklch(0.268 0.007 34.298);  --accent-foreground: oklch(0.985 0.001 106.423);  --destructive: oklch(0.704 0.191 22.216);  --border: oklch(1 0 0 / 10%);  --input: oklch(1 0 0 / 15%);  --ring: oklch(0.553 0.013 58.071);  --chart-1: oklch(0.488 0.243 264.376);  --chart-2: oklch(0.696 0.17 162.48);  --chart-3: oklch(0.769 0.188 70.08);  --chart-4: oklch(0.627 0.265 303.9);  --chart-5: oklch(0.645 0.246 16.439);  --sidebar: oklch(0.216 0.006 56.043);  --sidebar-foreground: oklch(0.985 0.001 106.423);  --sidebar-primary: oklch(0.488 0.243 264.376);  --sidebar-primary-foreground: oklch(0.985 0.001 106.423);  --sidebar-accent: oklch(0.268 0.007 34.298);  --sidebar-accent-foreground: oklch(0.985 0.001 106.423);  --sidebar-border: oklch(1 0 0 / 10%);  --sidebar-ring: oklch(0.553 0.013 58.071);}
Expand
Zinc
Expand
app/globals.css
Copy
:root {  --radius: 0.625rem;  --background: oklch(1 0 0);  --foreground: oklch(0.141 0.005 285.823);  --card: oklch(1 0 0);  --card-foreground: oklch(0.141 0.005 285.823);  --popover: oklch(1 0 0);  --popover-foreground: oklch(0.141 0.005 285.823);  --primary: oklch(0.21 0.006 285.885);  --primary-foreground: oklch(0.985 0 0);  --secondary: oklch(0.967 0.001 286.375);  --secondary-foreground: oklch(0.21 0.006 285.885);  --muted: oklch(0.967 0.001 286.375);  --muted-foreground: oklch(0.552 0.016 285.938);  --accent: oklch(0.967 0.001 286.375);  --accent-foreground: oklch(0.21 0.006 285.885);  --destructive: oklch(0.577 0.245 27.325);  --border: oklch(0.92 0.004 286.32);  --input: oklch(0.92 0.004 286.32);  --ring: oklch(0.705 0.015 286.067);  --chart-1: oklch(0.646 0.222 41.116);  --chart-2: oklch(0.6 0.118 184.704);  --chart-3: oklch(0.398 0.07 227.392);  --chart-4: oklch(0.828 0.189 84.429);  --chart-5: oklch(0.769 0.188 70.08);  --sidebar: oklch(0.985 0 0);  --sidebar-foreground: oklch(0.141 0.005 285.823);  --sidebar-primary: oklch(0.21 0.006 285.885);  --sidebar-primary-foreground: oklch(0.985 0 0);  --sidebar-accent: oklch(0.967 0.001 286.375);  --sidebar-accent-foreground: oklch(0.21 0.006 285.885);  --sidebar-border: oklch(0.92 0.004 286.32);  --sidebar-ring: oklch(0.705 0.015 286.067);} .dark {  --background: oklch(0.141 0.005 285.823);  --foreground: oklch(0.985 0 0);  --card: oklch(0.21 0.006 285.885);  --card-foreground: oklch(0.985 0 0);  --popover: oklch(0.21 0.006 285.885);  --popover-foreground: oklch(0.985 0 0);  --primary: oklch(0.92 0.004 286.32);  --primary-foreground: oklch(0.21 0.006 285.885);  --secondary: oklch(0.274 0.006 286.033);  --secondary-foreground: oklch(0.985 0 0);  --muted: oklch(0.274 0.006 286.033);  --muted-foreground: oklch(0.705 0.015 286.067);  --accent: oklch(0.274 0.006 286.033);  --accent-foreground: oklch(0.985 0 0);  --destructive: oklch(0.704 0.191 22.216);  --border: oklch(1 0 0 / 10%);  --input: oklch(1 0 0 / 15%);  --ring: oklch(0.552 0.016 285.938);  --chart-1: oklch(0.488 0.243 264.376);  --chart-2: oklch(0.696 0.17 162.48);  --chart-3: oklch(0.769 0.188 70.08);  --chart-4: oklch(0.627 0.265 303.9);  --chart-5: oklch(0.645 0.246 16.439);  --sidebar: oklch(0.21 0.006 285.885);  --sidebar-foreground: oklch(0.985 0 0);  --sidebar-primary: oklch(0.488 0.243 264.376);  --sidebar-primary-foreground: oklch(0.985 0 0);  --sidebar-accent: oklch(0.274 0.006 286.033);  --sidebar-accent-foreground: oklch(0.985 0 0);  --sidebar-border: oklch(1 0 0 / 10%);  --sidebar-ring: oklch(0.552 0.016 285.938);}
Expand
Gray
Expand
app/globals.css
Copy
:root {  --radius: 0.625rem;  --background: oklch(1 0 0);  --foreground: oklch(0.13 0.028 261.692);  --card: oklch(1 0 0);  --card-foreground: oklch(0.13 0.028 261.692);  --popover: oklch(1 0 0);  --popover-foreground: oklch(0.13 0.028 261.692);  --primary: oklch(0.21 0.034 264.665);  --primary-foreground: oklch(0.985 0.002 247.839);  --secondary: oklch(0.967 0.003 264.542);  --secondary-foreground: oklch(0.21 0.034 264.665);  --muted: oklch(0.967 0.003 264.542);  --muted-foreground: oklch(0.551 0.027 264.364);  --accent: oklch(0.967 0.003 264.542);  --accent-foreground: oklch(0.21 0.034 264.665);  --destructive: oklch(0.577 0.245 27.325);  --border: oklch(0.928 0.006 264.531);  --input: oklch(0.928 0.006 264.531);  --ring: oklch(0.707 0.022 261.325);  --chart-1: oklch(0.646 0.222 41.116);  --chart-2: oklch(0.6 0.118 184.704);  --chart-3: oklch(0.398 0.07 227.392);  --chart-4: oklch(0.828 0.189 84.429);  --chart-5: oklch(0.769 0.188 70.08);  --sidebar: oklch(0.985 0.002 247.839);  --sidebar-foreground: oklch(0.13 0.028 261.692);  --sidebar-primary: oklch(0.21 0.034 264.665);  --sidebar-primary-foreground: oklch(0.985 0.002 247.839);  --sidebar-accent: oklch(0.967 0.003 264.542);  --sidebar-accent-foreground: oklch(0.21 0.034 264.665);  --sidebar-border: oklch(0.928 0.006 264.531);  --sidebar-ring: oklch(0.707 0.022 261.325);} .dark {  --background: oklch(0.13 0.028 261.692);  --foreground: oklch(0.985 0.002 247.839);  --card: oklch(0.21 0.034 264.665);  --card-foreground: oklch(0.985 0.002 247.839);  --popover: oklch(0.21 0.034 264.665);  --popover-foreground: oklch(0.985 0.002 247.839);  --primary: oklch(0.928 0.006 264.531);  --primary-foreground: oklch(0.21 0.034 264.665);  --secondary: oklch(0.278 0.033 256.848);  --secondary-foreground: oklch(0.985 0.002 247.839);  --muted: oklch(0.278 0.033 256.848);  --muted-foreground: oklch(0.707 0.022 261.325);  --accent: oklch(0.278 0.033 256.848);  --accent-foreground: oklch(0.985 0.002 247.839);  --destructive: oklch(0.704 0.191 22.216);  --border: oklch(1 0 0 / 10%);  --input: oklch(1 0 0 / 15%);  --ring: oklch(0.551 0.027 264.364);  --chart-1: oklch(0.488 0.243 264.376);  --chart-2: oklch(0.696 0.17 162.48);  --chart-3: oklch(0.769 0.188 70.08);  --chart-4: oklch(0.627 0.265 303.9);  --chart-5: oklch(0.645 0.246 16.439);  --sidebar: oklch(0.21 0.034 264.665);  --sidebar-foreground: oklch(0.985 0.002 247.839);  --sidebar-primary: oklch(0.488 0.243 264.376);  --sidebar-primary-foreground: oklch(0.985 0.002 247.839);  --sidebar-accent: oklch(0.278 0.033 256.848);  --sidebar-accent-foreground: oklch(0.985 0.002 247.839);  --sidebar-border: oklch(1 0 0 / 10%);  --sidebar-ring: oklch(0.551 0.027 264.364);}
Expand
Slate
Expand
app/globals.css
Copy
:root {  --radius: 0.625rem;  --background: oklch(1 0 0);  --foreground: oklch(0.129 0.042 264.695);  --card: oklch(1 0 0);  --card-foreground: oklch(0.129 0.042 264.695);  --popover: oklch(1 0 0);  --popover-foreground: oklch(0.129 0.042 264.695);  --primary: oklch(0.208 0.042 265.755);  --primary-foreground: oklch(0.984 0.003 247.858);  --secondary: oklch(0.968 0.007 247.896);  --secondary-foreground: oklch(0.208 0.042 265.755);  --muted: oklch(0.968 0.007 247.896);  --muted-foreground: oklch(0.554 0.046 257.417);  --accent: oklch(0.968 0.007 247.896);  --accent-foreground: oklch(0.208 0.042 265.755);  --destructive: oklch(0.577 0.245 27.325);  --border: oklch(0.929 0.013 255.508);  --input: oklch(0.929 0.013 255.508);  --ring: oklch(0.704 0.04 256.788);  --chart-1: oklch(0.646 0.222 41.116);  --chart-2: oklch(0.6 0.118 184.704);  --chart-3: oklch(0.398 0.07 227.392);  --chart-4: oklch(0.828 0.189 84.429);  --chart-5: oklch(0.769 0.188 70.08);  --sidebar: oklch(0.984 0.003 247.858);  --sidebar-foreground: oklch(0.129 0.042 264.695);  --sidebar-primary: oklch(0.208 0.042 265.755);  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);  --sidebar-accent: oklch(0.968 0.007 247.896);  --sidebar-accent-foreground: oklch(0.208 0.042 265.755);  --sidebar-border: oklch(0.929 0.013 255.508);  --sidebar-ring: oklch(0.704 0.04 256.788);} .dark {  --background: oklch(0.129 0.042 264.695);  --foreground: oklch(0.984 0.003 247.858);  --card: oklch(0.208 0.042 265.755);  --card-foreground: oklch(0.984 0.003 247.858);  --popover: oklch(0.208 0.042 265.755);  --popover-foreground: oklch(0.984 0.003 247.858);  --primary: oklch(0.929 0.013 255.508);  --primary-foreground: oklch(0.208 0.042 265.755);  --secondary: oklch(0.279 0.041 260.031);  --secondary-foreground: oklch(0.984 0.003 247.858);  --muted: oklch(0.279 0.041 260.031);  --muted-foreground: oklch(0.704 0.04 256.788);  --accent: oklch(0.279 0.041 260.031);  --accent-foreground: oklch(0.984 0.003 247.858);  --destructive: oklch(0.704 0.191 22.216);  --border: oklch(1 0 0 / 10%);  --input: oklch(1 0 0 / 15%);  --ring: oklch(0.551 0.027 264.364);  --chart-1: oklch(0.488 0.243 264.376);  --chart-2: oklch(0.696 0.17 162.48);  --chart-3: oklch(0.769 0.188 70.08);  --chart-4: oklch(0.627 0.265 303.9);  --chart-5: oklch(0.645 0.246 16.439);  --sidebar: oklch(0.208 0.042 265.755);  --sidebar-foreground: oklch(0.984 0.003 247.858);  --sidebar-primary: oklch(0.488 0.243 264.376);  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);  --sidebar-accent: oklch(0.279 0.041 260.031);  --sidebar-accent-foreground: oklch(0.984 0.003 247.858);  --sidebar-border: oklch(1 0 0 / 10%);  --sidebar-ring: oklch(0.551 0.027 264.364);}
Expand
components.jsonDark Mode
On This Page
CSS VariablesUtility classesConventionList of variablesAdding new colorsOther color formatsBase ColorsNeutralStoneZincGraySlate
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Theming - shadcn/ui
Mon
Vite
Previous
Next
Adding dark mode to your vite app.
Create a theme provider
components/theme-provider.tsx
Copy
import { createContext, useContext, useEffect, useState } from "react" type Theme = "dark" | "light" | "system" type ThemeProviderProps = {  children: React.ReactNode  defaultTheme?: Theme  storageKey?: string} type ThemeProviderState = {  theme: Theme  setTheme: (theme: Theme) => void} const initialState: ThemeProviderState = {  theme: "system",  setTheme: () => null,} const ThemeProviderContext = createContext<ThemeProviderState>(initialState) export function ThemeProvider({  children,  defaultTheme = "system",  storageKey = "vite-ui-theme",  ...props}: ThemeProviderProps) {  const [theme, setTheme] = useState<Theme>(    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme  )  useEffect(() => {    const root = window.document.documentElement    root.classList.remove("light", "dark")    if (theme === "system") {      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")        .matches        ? "dark"        : "light"      root.classList.add(systemTheme)      return    }    root.classList.add(theme)  }, [theme])  const value = {    theme,    setTheme: (theme: Theme) => {      localStorage.setItem(storageKey, theme)      setTheme(theme)    },  }  return (    <ThemeProviderContext.Provider {...props} value={value}>      {children}    </ThemeProviderContext.Provider>  )} export const useTheme = () => {  const context = useContext(ThemeProviderContext)  if (context === undefined)    throw new Error("useTheme must be used within a ThemeProvider")  return context}
Wrap your root layout
Add the ThemeProvider to your root layout.
App.tsx
Copy
import { ThemeProvider } from "@/components/theme-provider" function App() {  return (    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">      {children}    </ThemeProvider>  )} export default App
Add a mode toggle
Place a mode toggle on your site to toggle between light and dark mode.
components/mode-toggle.tsx
Copy
import { Moon, Sun } from "lucide-react" import { Button } from "@/components/ui/button"import {  DropdownMenu,  DropdownMenuContent,  DropdownMenuItem,  DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"import { useTheme } from "@/components/theme-provider" export function ModeToggle() {  const { setTheme } = useTheme()  return (    <DropdownMenu>      <DropdownMenuTrigger asChild>        <Button variant="outline" size="icon">          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />          <span className="sr-only">Toggle theme</span>        </Button>      </DropdownMenuTrigger>      <DropdownMenuContent align="end">        <DropdownMenuItem onClick={() => setTheme("light")}>          Light        </DropdownMenuItem>        <DropdownMenuItem onClick={() => setTheme("dark")}>          Dark        </DropdownMenuItem>        <DropdownMenuItem onClick={() => setTheme("system")}>          System        </DropdownMenuItem>      </DropdownMenuContent>    </DropdownMenu>  )}
Next.jsAstro
On This Page
Create a theme providerWrap your root layoutAdd a mode toggle
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Vite - shadcn/ui
Mon
shadcn
Previous
Next
Use the shadcn CLI to add components to your project.
init
Use the init command to initialize configuration and dependencies for a new project.
The init command installs dependencies, adds the cn util and configures CSS variables for the project.
pnpmnpmyarnbun
pnpm dlx shadcn@latest init
Copy
Options
Copy
Usage: shadcn init [options] [components...] initialize your project and install dependencies Arguments:  components         name, url or local path to component Options:  -t, --template <template>      the template to use. (next, next-monorepo)  -b, --base-color <base-color>  the base color to use. (neutral, gray, zinc, stone, slate)  -y, --yes                      skip confirmation prompt. (default: true)  -f, --force                    force overwrite of existing configuration. (default: false)  -c, --cwd <cwd>                the working directory. defaults to the current directory.  -s, --silent                   mute output. (default: false)  --src-dir                      use the src directory when creating a new project. (default: false)  --no-src-dir                   do not use the src directory when creating a new project.  --css-variables                use css variables for theming. (default: true)  --no-css-variables             do not use css variables for theming.  -h, --help                     display help for command
add
Use the add command to add components and dependencies to your project.
pnpmnpmyarnbun
pnpm dlx shadcn@latest add [component]
Copy
Options
Copy
Usage: shadcn add [options] [components...] add a component to your project Arguments:  components         name, url or local path to component Options:  -y, --yes           skip confirmation prompt. (default: false)  -o, --overwrite     overwrite existing files. (default: false)  -c, --cwd <cwd>     the working directory. defaults to the current directory.  -a, --all           add all available components (default: false)  -p, --path <path>   the path to add the component to.  -s, --silent        mute output. (default: false)  --src-dir           use the src directory when creating a new project. (default: false)  --no-src-dir        do not use the src directory when creating a new project.  --css-variables     use css variables for theming. (default: true)  --no-css-variables  do not use css variables for theming.  -h, --help          display help for command
build
Use the build command to generate the registry JSON files.
pnpmnpmyarnbun
pnpm dlx shadcn@latest build
Copy
This command reads the registry.json file and generates the registry JSON files in the public/r directory.
Options
Copy
Usage: shadcn build [options] [registry] build components for a shadcn registry Arguments:  registry             path to registry.json file (default: "./registry.json") Options:  -o, --output <path>  destination directory for json files (default: "./public/r")  -c, --cwd <cwd>      the working directory. defaults to the current directory.  -h, --help           display help for command
To customize the output directory, use the --output option.
pnpmnpmyarnbun
pnpm dlx shadcn@latest build --output ./public/registry
Copy
Dark ModeMonorepo
On This Page
initOptionsaddOptionsbuildOptions
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
shadcn - shadcn/ui
Mon


Monorepo
Previous
Next
Using shadcn/ui components and CLI in a monorepo.
Until now, using shadcn/ui in a monorepo was a bit of a pain. You could add components using the CLI, but you had to manage where the components were installed and manually fix import paths.
With the new monorepo support in the CLI, we've made it a lot easier to use shadcn/ui in a monorepo.
The CLI now understands the monorepo structure and will install the components, dependencies and registry dependencies to the correct paths and handle imports for you.
Getting started
Create a new monorepo project
To create a new monorepo project, run the init command. You will be prompted to select the type of project you are creating.
pnpmnpmyarnbun
pnpm dlx shadcn@canary init
Copy
Select the Next.js (Monorepo) option.
Copy
? Would you like to start a new project?    Next.js❯   Next.js (Monorepo)
This will create a new monorepo project with two workspaces: web and ui, and Turborepo as the build system.
Everything is set up for you, so you can start adding components to your project.
Note: The monorepo uses React 19 and Tailwind CSS v4.
Add components to your project
To add components to your project, run the add command in the path of your app.
Copy
cd apps/web
pnpmnpmyarnbun
pnpm dlx shadcn@canary add [COMPONENT]
Copy
The CLI will figure out what type of component you are adding and install the correct files to the correct path.
For example, if you run npx shadcn@canary add button, the CLI will install the button component under packages/ui and update the import path for components in apps/web.
If you run npx shadcn@canary add login-01, the CLI will install the button, label, input and card components under packages/ui and the login-form component under apps/web/components.
Importing components
You can import components from the @workspace/ui package as follows:
Copy
import { Button } from "@workspace/ui/components/button"
You can also import hooks and utilities from the @workspace/ui package.
Copy
import { useTheme } from "@workspace/ui/hooks/use-theme"import { cn } from "@workspace/ui/lib/utils"
File Structure
When you create a new monorepo project, the CLI will create the following file structure:
Copy
apps└── web         # Your app goes here.    ├── app    │   └── page.tsx    ├── components    │   └── login-form.tsx    ├── components.json    └── package.jsonpackages└── ui          # Your components and dependencies are installed here.    ├── src    │   ├── components    │   │   └── button.tsx    │   ├── hooks    │   ├── lib    │   │   └── utils.ts    │   └── styles    │       └── globals.css    ├── components.json    └── package.jsonpackage.jsonturbo.json
Requirements
1. Every workspace must have a components.json file. A package.json file tells npm how to install the dependencies. A components.json file tells the CLI how and where to install components.
2. The components.json file must properly define aliases for the workspace. This tells the CLI how to import components, hooks, utilities, etc.
apps/web/components.json
Copy
{  "$schema": "https://ui.shadcn.com/schema.json",  "style": "new-york",  "rsc": true,  "tsx": true,  "tailwind": {    "config": "",    "css": "../../packages/ui/src/styles/globals.css",    "baseColor": "zinc",    "cssVariables": true  },  "iconLibrary": "lucide",  "aliases": {    "components": "@/components",    "hooks": "@/hooks",    "lib": "@/lib",    "utils": "@workspace/ui/lib/utils",    "ui": "@workspace/ui/components"  }}
packages/ui/components.json
Copy
{  "$schema": "https://ui.shadcn.com/schema.json",  "style": "new-york",  "rsc": true,  "tsx": true,  "tailwind": {    "config": "",    "css": "src/styles/globals.css",    "baseColor": "zinc",    "cssVariables": true  },  "iconLibrary": "lucide",  "aliases": {    "components": "@workspace/ui/components",    "utils": "@workspace/ui/lib/utils",    "hooks": "@workspace/ui/hooks",    "lib": "@workspace/ui/lib",    "ui": "@workspace/ui/components"  }}
3. Ensure you have the same style, iconLibrary and baseColor in both components.json files.
4. For Tailwind CSS v4, leave the tailwind config empty in the components.json file.
By following these requirements, the CLI will be able to install ui components, blocks, libs and hooks to the correct paths and handle imports for you.
CLIOpen in v0
On This Page
Getting startedCreate a new monorepo projectAdd components to your projectImporting componentsFile StructureRequirements
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Monorepo - shadcn/ui
Mon
Open in v0
Previous
Next
Open components in v0 for customization.
Every component on ui.shadcn.com is editable on v0 by Vercel. This allows you to easily customize the components in natural language and paste into your app.
 Open in v0 

Open in v0
To use v0, sign-up for a free Vercel account here. In addition to v0, this gives you free access to Vercel's frontend cloud platform by the creators of Next.js, where you can deploy and host your project for free.
Learn more about getting started with Vercel here.
Learn more about getting started with v0 here.
MonorepoJavaScript
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Open in v0 - shadcn/ui
Mon
JavaScript
Previous
Next
How to use shadcn/ui with JavaScript
This project and the components are written in TypeScript. We recommend using TypeScript for your project as well.
However we provide a JavaScript version of the components as well. The JavaScript version is available via the cli.
To opt-out of TypeScript, you can use the tsx flag in your components.json file.
components.json
Copy
{  "style": "default",  "tailwind": {    "config": "tailwind.config.js",    "css": "src/app/globals.css",    "baseColor": "zinc",    "cssVariables": true  },  "rsc": false,  "tsx": false,  "aliases": {    "utils": "~/lib/utils",    "components": "~/components"  }}
To configure import aliases, you can use the following jsconfig.json:
jsconfig.json
Copy
{  "compilerOptions": {    "paths": {      "@/*": ["./*"]    }  }}
Open in v0Blocks
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
JavaScript - shadcn/ui
Mon
Blocks
Previous
Next
Contribute components to the blocks library.
We are inviting the community to contribute to the blocks library. Share your components and blocks with other developers and help build a library of high-quality, reusable components.
We'd love to see all types of blocks: applications, marketing, products, and more.
Setup your workspace
Fork the repository
Copy
git clone https://github.com/shadcn-ui/ui.git
Create a new branch
Copy
git checkout -b username/my-new-block
Install dependencies
Copy
pnpm install
Start the dev server
Copy
pnpm www:dev
Add a block
A block can be a single component (eg. a variation of a ui component) or a complex component (eg. a dashboard) with multiple components, hooks, and utils.
Create a new block
Create a new folder in the apps/www/registry/new-york/blocks directory. Make sure the folder is named in kebab-case and under new-york.
Copy
apps└── www    └── registry        └── new-york            └── blocks                └── dashboard-01
Note: The build script will take care of building the block for the default style.
Add your block files
Add your files to the block folder. Here is an example of a block with a page, components, hooks, and utils.
Copy
dashboard-01└── page.tsx└── components    └── hello-world.tsx    └── example-card.tsx└── hooks    └── use-hello-world.ts└── lib    └── format-date.ts
Note: You can start with one file and add more files later.
Add your block to the registry
Add your block definition to registry-blocks.tsx
To add your block to the registry, you need to add your block definition to registry-blocks.ts.
This follows the registry schema at https://ui.shadcn.com/schema/registry-item.json.
apps/www/registry/registry-blocks.tsx
Copy
export const blocks = [  // ...  {    name: "dashboard-01",    author: "shadcn (https://ui.shadcn.com)",    title: "Dashboard",    description: "A simple dashboard with a hello world component.",    type: "registry:block",    registryDependencies: ["input", "button", "card"],    dependencies: ["zod"],    files: [      {        path: "blocks/dashboard-01/page.tsx",        type: "registry:page",        target: "app/dashboard/page.tsx",      },      {        path: "blocks/dashboard-01/components/hello-world.tsx",        type: "registry:component",      },      {        path: "blocks/dashboard-01/components/example-card.tsx",        type: "registry:component",      },      {        path: "blocks/dashboard-01/hooks/use-hello-world.ts",        type: "registry:hook",      },      {        path: "blocks/dashboard-01/lib/format-date.ts",        type: "registry:lib",      },    ],    categories: ["dashboard"],  },]
Make sure you add a name, description, type, registryDependencies, dependencies, files, and categories. We'll go over each of these in more detail in the schema docs (coming soon).
Run the build script
Copy
pnpm registry:build
Note: you do not need to run this script for every change. You only need to run it when you update the block definition.
View your block
Once the build script is finished, you can view your block at http://localhost:3333/blocks/[CATEGORY] or a full screen preview at http://localhost:3333/view/styles/new-york/dashboard-01.
 Block preview 

Build your block
You can now build your block by editing the files in the block folder and viewing the changes in the browser.
If you add more files, make sure to add them to the files array in the block definition.
Publish your block
Once you're ready to publish your block, you can submit a pull request to the main repository.
Run the build script
Copy
pnpm registry:build
Capture a screenshot
Copy
pnpm registry:capture
Note: If you've run the capture script before, you might need to delete the existing screenshots (both light and dark) at apps/www/public/r/styles/new-york and run the script again.
Submit a pull request
Commit your changes and submit a pull request to the main repository.
Your block will be reviewed and merged. Once merged it will be published to the website and available to be installed via the CLI.
Categories
The categories property is used to organize your block in the registry.
Add a category
If you need to add a new category, you can do so by adding it to the registryCategories array in apps/www/registry/registry-categories.ts.
apps/www/registry/registry-categories.ts
Copy
export const registryCategories = [  // ...  {    name: "Input",    slug: "input",    hidden: false,  },]
Guidelines
Here are some guidelines to follow when contributing to the blocks library.
* The following properties are required for the block definition: name, description, type, files, and categories.
* Make sure to list all registry dependencies in registryDependencies. A registry dependency is the name of the component in the registry eg. input, button, card, etc.
* Make sure to list all dependencies in dependencies. A dependency is the name of the package in the registry eg. zod, sonner, etc.
* If your block has a page (optional), it should be the first entry in the files array and it should have a target property. This helps the CLI place the page in the correct location for file-based routing.
* Imports should always use the @/registry path. eg. import { Input } from "@/registry/new-york/input"
JavaScriptFigma
On This Page
Setup your workspaceFork the repositoryCreate a new branchInstall dependenciesStart the dev serverAdd a blockCreate a new blockAdd your block filesAdd your block to the registryAdd your block definition to registry-blocks.tsxRun the build scriptView your blockBuild your blockPublish your blockRun the build scriptCapture a screenshotSubmit a pull requestCategoriesAdd a categoryGuidelines
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Blocks - shadcn/ui
Mon
Changelog
Previous
Next
Latest updates and announcements.
July 2025 - Universal Registry Items
We've added support for universal registry items. This allows you to create registry items that can be distributed to any project i.e. no framework, no components.json, no tailwind, no react required.
This new registry item type unlocks a lot of new workflows. You can now distribute code, config, rules, docs, anything to any code project.
See the docs for more details and examples.
July 2025 - Local File Support
The shadcn CLI now supports local files. Initialize projects and add components, themes, hooks, utils and more from local JSON files.
Copy
# Initialize a project from a local filenpx shadcn init ./template.json # Add a component from a local filenpx shadcn add ./block.json
This feature enables powerful new workflows:
* Zero setup - No remote registries required
* Faster development - Test registry items locally before publishing
* Enhanced workflow for agents and MCP - Generate and run registry items locally
* Private components - Keep proprietary components local and private.
June 2025 - radix-ui
We've added a new command to migrate to the new radix-ui package. This command will replace all @radix-ui/react-* imports with radix-ui.
pnpmnpmyarnbun
pnpm dlx shadcn@latest migrate radix
Copy
It will automatically update all imports in your ui components and install radix-ui as a dependency.
components/ui/alert-dialog.tsx
Copy
- import * as AlertDialogPrimitive from "@radix-ui/react-dialog"+ import { AlertDialog as AlertDialogPrimitive } from "radix-ui"
Make sure to test your components and project after running the command.
Note: To update imports for newly added components, run the migration command again.
June 2025 - Calendar Component
We've upgraded the Calendar component to the latest version of React DayPicker.
This is a major upgrade and includes a lot of new features and improvements. We've also built a collection of 30+ calendar blocks that you can use to build your own calendar components.
See all calendar blocks in the Blocks Library page.
 Calendar 

To upgrade your project to the latest version of the Calendar component, see the upgrade guide.
May 2025 - New Site
We've upgraded ui.shadcn.com to Next.js 15.3 and Tailwind v4. The site now uses the upgraded new-york components.
We've also made some minor design updates to make the site faster and easier to navigate.
This upgrade unlocks a lot of new features that we're working on. More to come.
April 2025 - MCP
We're working on zero-config MCP support for shadcn/ui registry. One command npx shadcn registry:mcp to make any registry mcp-compatible.
 Lift Mode 

Learn more in the thread here: https://x.com/shadcn/status/1917597228513853603
March 2025 - shadcn 2.5.0
We tagged shadcn 2.5.0 earlier this week. It comes with a pretty cool feature: resolve anywhere.
Registries can now place files anywhere in an app and we'll properly resolve imports. No need to stick to a fixed file structure. It can even add files outside the registry itself.
On install, we track all files and perform a multi-pass resolution to correctly handle imports and aliases. It's fast.
March 2025 - Cross-framework Route Support
The shadcn CLI can now auto-detect your framework and adapts routes for you.
Works with all frameworks including Laravel, Vite and React Router.
February 2025 - Tailwind v4
We shipped the first preview of Tailwind v4 and React 19. Ready for you to try out. You can start using it today.
What's New:
* The CLI can now initialize projects with Tailwind v4.
* Full support for the new @theme directive and @theme inline option.
* All components are updated for Tailwind v4 and React 19.
* We've removed the forwardRefs and adjusted the types.
* Every primitive now has a data-slot attribute for styling.
* We've fixed and cleaned up the style of the components.
* We're deprecating the toast component in favor of sonner.
* Buttons now use the default cursor.
* We're deprecating the default style. New projects will use new-york.
* HSL colors are now converted to OKLCH.
Read more in the docs.
February 2025 - Updated Registry Schema
We're updating the registry schema to support more features.
Define code as a flat JSON file and distribute it via the CLI.
* Custom styles: bring your own design system, components & tokens
* Extend, override, mix & match components from third-party registries and LLMs
* Install themes, CSS vars, hooks, animations, and Tailwind layers & utilities
January 2025 - Blocks
We are inviting the community to contribute to the blocks library. Share your components and blocks with other developers and help build a library of high-quality, reusable components.
We'd love to see all types of blocks: applications, marketing, products, and more.
See the docs page to get started.
December 2024 - Monorepo Support
Until now, using shadcn/ui in a monorepo was a bit of a pain. You could add components using the CLI, but you had to manage where the components were installed and manually fix import paths.
With the new monorepo support in the CLI, we've made it a lot easier to use shadcn/ui in a monorepo.
The CLI now understands the monorepo structure and will install the components, dependencies and registry dependencies to the correct paths and handle imports for you.
Read more in the docs.
November 2024 - Icons
An update on icons. The new-york style now uses Lucide as the default icon set.
* New projects will use Lucide by default
* No breaking changes for existing projects
* Use the CLI to (optionally) migrate primitives to Lucide
For more info on why we're doing this, see the thread.
October 2024 - React 19
shadcn/ui is now compatible with React 19 and Next.js 15.
We published a guide to help you upgrade your project to React 19.
Read more here.
October 2024 - Sidebar
Introducing sidebar.tsx: 25 components to help you build all kinds of sidebars.
I don't like building sidebars. So I built 30+ of them. All types. Then simplified the core into sidebar.tsx: a strong foundation to build on top of.
It works with Next.js, Remix, Vite & Laravel.
See the announcement here.
August 2024 - npx shadcn init
The new CLI is now available. It's a complete rewrite with a lot of new features and improvements. You can now install components, themes, hooks, utils and more using npx shadcn add.
This is a major step towards distributing code that you and your LLMs can access and use.
1. First up, the cli now has support for all major React framework out of the box. Next.js, Remix, Vite and Laravel. And when you init into a new app, we update your existing Tailwind files instead of overriding.
2. A component now ship its own dependencies. Take the accordion for example, it can define its Tailwind keyframes. When you add it to your project, we'll update your tailwind.config.ts file accordingly.
3. You can also install remote components using url. npx shadcn add https://acme.com/registry/navbar.json.
4. We have also improve the init command. It does framework detection and can even init a brand new Next.js app in one command. npx shadcn init.
5. We have created a new schema that you can use to ship your own component registry. And since it has support for urls, you can even use it to distribute private components.
6. And a few more updates like better error handling and monorepo support.
You can try the new cli today.
pnpmnpmyarnbun
pnpm dlx shadcn init sidebar-01 login-01
Copy
Update Your Project
To update an existing project to use the new CLI, update your components.json file to include import aliases for your components, utils, ui, lib and hooks.
components.json
Copy
{  "$schema": "https://ui.shadcn.com/schema.json",  "style": "new-york",  "tailwind": {    // ...  },  "aliases": {    "components": "@/components",    "utils": "@/lib/utils",    "ui": "@/components/ui",    "lib": "@/lib",    "hooks": "@/hooks"  }}
If you're using a different import alias prefix eg ~, replace @ with your prefix.
April 2024 - Introducing Lift Mode
We're introducing a new mode for Blocks called Lift Mode.
Enable Lift Mode to automatically "lift" smaller components from a block template for copy and paste.
 Lift Mode 

View the blocks library
With Lift Mode, you'll be able to copy the smaller components that make up a block template, like cards, buttons, and forms, and paste them directly into your project.
Visit the Blocks page to try it out.
March 2024 - Introducing Blocks
One of the most requested features since launch has been layouts: admin dashboards with sidebar, marketing page sections, cards and more.
Today, we're launching Blocks.
 Admin dashboard 

View the blocks library
Blocks are ready-made components that you can use to build your apps. They are fully responsive, accessible, and composable, meaning they are built using the same principles as the rest of the components in shadcn/ui.
We're starting with dashboard layouts and authentication pages, with plans to add more blocks in the coming weeks.
Open Source
Blocks are open source. You can find the source on GitHub. Use them in your projects, customize them and contribute back.
 AI Playground 

View the blocks library
Request a Block
We're also introducing a "Request a Block" feature. If there's a specific block you'd like to see, simply create a request on GitHub and the community can upvote and build it.
 Settings Page 

View the blocks library
v0
If you have a v0 account, you can use the Edit in v0 feature to open the code on v0 for prompting and further generation.
That's it. Looking forward to seeing what you build with Blocks.
March 2024 - Breadcrumb and Input OTP
We've added a new Breadcrumb component and an Input OTP component.
Breadcrumb
An accessible and flexible breadcrumb component. It has support for collapsed items, custom separators, bring-your-own routing <Link /> and composable with other shadcn/ui components.
PreviewCode
* Home
* * More
* Toggle menu
* * Components
* * Breadcrumb
See more examples
Input OTP
A fully featured input OTP component. It has support for numeric and alphanumeric codes, custom length, copy-paste and accessible. Input OTP is built on top of input-otp by @guilherme_rodz.
PreviewCode
Read the docs
If you have a v0, the new components are available for generation.
December 2023 - New components, CLI and more
We've added new components to shadcn/ui and made a lot of improvements to the CLI.
Here's a quick overview of what's new:
* Carousel - A carousel component with motion, swipe gestures and keyboard support.
* Drawer - A drawer component that looks amazing on mobile.
* Pagination - A pagination component with page navigation, previous and next buttons.
* Resizable - A resizable component for building resizable panel groups and layouts.
* Sonner - The last toast component you'll ever need.
* CLI updates - Support for custom Tailwind prefix and tailwind.config.ts.
Carousel
We've added a fully featured carousel component with motion, swipe gestures and keyboard support. Built on top of Embla Carousel.
It has support for infinite looping, autoplay, vertical orientation, and more.
PreviewCode
1
2
3
4
5
Previous slide
Next slide
Drawer
Oh the drawer component 😍. Built on top of Vaul by emilkowalski_.
Try opening the following drawer on mobile. It looks amazing!
PreviewCode
Open Drawer
Pagination
We've added a pagination component with page navigation, previous and next buttons. Simple, flexible and works with your framework's <Link /> component.
PreviewCode
* Previous
* * 1
* 2
* 3
* More pages
* Next
* Resizable
Build resizable panel groups and layouts with this <Resizable /> component.
PreviewCode
One
Two
Three
<Resizable /> is built using react-resizable-panels by bvaughn. It has support for mouse, touch and keyboard.
Sonner
Another one by emilkowalski_. The last toast component you'll ever need. Sonner is now availabe in shadcn/ui.
PreviewCode
Show Toast
CLI updates
This has been one of the most requested features. You can now configure a custom Tailwind prefix and the cli will automatically prefix your utility classes when adding components.
This means you can now easily add shadcn/ui components to existing projects like Docusaurus, Nextra...etc. A drop-in for your existing design system with no conflict. 🔥
Copy
<AlertDialog className="tw-grid tw-gap-4 tw-border tw-bg-background tw-shadow-lg" />
It works with cn, cva and CSS variables.
The cli can now also detect tailwind.config.ts and add the TypeScript version of the config for you.
That's it. Happy Holidays.
July 2023 - JavaScript
This project and the components are written in TypeScript. We recommend using TypeScript for your project as well.
However we provide a JavaScript version of the components, available via the cli.
Copy
Would you like to use TypeScript (recommended)? no
To opt-out of TypeScript, you can use the tsx flag in your components.json file.
components.json
Copy
{  "style": "default",  "tailwind": {    "config": "tailwind.config.js",    "css": "src/app/globals.css",    "baseColor": "zinc",    "cssVariables": true  },  "rsc": false,  "tsx": false,  "aliases": {    "utils": "~/lib/utils",    "components": "~/components"  }}
To configure import aliases, you can use the following jsconfig.json:
jsconfig.json
Copy
{  "compilerOptions": {    "paths": {      "@/*": ["./*"]    }  }}
June 2023 - New CLI, Styles and more
I have a lot of updates to share with you today:
* New CLI - Rewrote the CLI from scratch. You can now add components, dependencies and configure import paths.
* Theming - Choose between using CSS variables or Tailwind CSS utility classes for theming.
* Base color - Configure the base color for your project. This will be used to generate the default color palette for your components.
* React Server Components - Opt out of using React Server Components. The CLI will automatically append or remove the use client directive.
* Styles - Introducing a new concept called Style. A style comes with its own set of components, animations, icons and more.
* Exit animations - Added exit animations to all components.
* Other updates - New icon button size, updated sheet component and more.
* Updating your project - How to update your project to get the latest changes.
________________


New CLI
I've been working on a new CLI for the past few weeks. It's a complete rewrite. It comes with a lot of new features and improvements.
init
pnpmnpmyarnbun
pnpm dlx shadcn@latest init
Copy
When you run the init command, you will be asked a few questions to configure components.json:
Copy
Which style would you like to use? › DefaultWhich color would you like to use as base color? › SlateWhere is your global CSS file? › › app/globals.cssDo you want to use CSS variables for colors? › no / yesWhere is your tailwind.config.js located? › tailwind.config.jsConfigure the import alias for components: › @/componentsConfigure the import alias for utils: › @/lib/utilsAre you using React Server Components? › no / yes
This file contains all the information about your components: where to install them, the import paths, how they are styled...etc.
You can use this file to change the import path of a component, set a baseColor or change the styling method.
components.json
Copy
{  "style": "default",  "tailwind": {    "config": "tailwind.config.ts",    "css": "src/app/globals.css",    "baseColor": "zinc",    "cssVariables": true  },  "rsc": false,  "aliases": {    "utils": "~/lib/utils",    "components": "~/components"  }}
This means you can now use the CLI with any directory structure including src and app directories.
add
pnpmnpmyarnbun
pnpm dlx shadcn@latest add
Copy
The add command is now much more capable. You can now add UI components but also import more complex components (coming soon).
The CLI will automatically resolve all components and dependencies, format them based on your custom config and add them to your project.
diff (experimental)
pnpmnpmyarnbun
pnpm dlx shadcn diff
Copy
We're also introducing a new diff command to help you keep track of upstream updates.
You can use this command to see what has changed in the upstream repository and update your project accordingly.
Run the diff command to get a list of components that have updates available:
pnpmnpmyarnbun
pnpm dlx shadcn diff
Copy
Copy
The following components have updates available:- button  - /path/to/my-app/components/ui/button.tsx- toast  - /path/to/my-app/components/ui/use-toast.ts  - /path/to/my-app/components/ui/toaster.tsx
Then run diff [component] to see the changes:
pnpmnpmyarnbun
pnpm dlx shadcn diff alert
Copy
Copy
const alertVariants = cva(- "relative w-full rounded-lg border",+ "relative w-full pl-12 rounded-lg border")
________________


Theming with CSS Variables or Tailwind Colors
You can choose between using CSS variables or Tailwind CSS utility classes for theming.
When you add new components, the CLI will automatically use the correct theming methods based on your components.json configuration.
Utility classes
Copy
<div className="bg-zinc-950 dark:bg-white" />
To use utility classes for theming set tailwind.cssVariables to false in your components.json file.
components.json
Copy
{  "tailwind": {    "config": "tailwind.config.js",    "css": "app/globals.css",    "baseColor": "slate",    "cssVariables": false  }}
CSS Variables
Copy
<div className="bg-background text-foreground" />
To use CSS variables classes for theming set tailwind.cssVariables to true in your components.json file.
components.json
Copy
{  "tailwind": {    "config": "tailwind.config.js",    "css": "app/globals.css",    "baseColor": "slate",    "cssVariables": true  }}
________________


Base color
You can now configure the base color for your project. This will be used to generate the default color palette for your components.
components.json
Copy
{  "tailwind": {    "config": "tailwind.config.js",    "css": "app/globals.css",    "baseColor": "zinc",    "cssVariables": false  }}
Choose between gray, neutral, slate, stone or zinc.
If you have cssVariables set to true, we will set the base colors as CSS variables in your globals.css file. If you have cssVariables set to false, we will inline the Tailwind CSS utility classes in your components.
________________


React Server Components
If you're using a framework that does not support React Server Components, you can now opt out by setting rsc to false. We will automatically append or remove the use client directive when adding components.
components.json
Copy
{  "rsc": false}
________________


Styles
We are introducing a new concept called Style.
You can think of style as the visual foundation: shapes, icons, animations & typography. A style comes with its own set of components, animations, icons and more.
We are shipping two styles: default and new-york (with more coming soon).
 Default vs New York style 

The default style is the one you are used to. It's the one we've been using since the beginning of this project. It uses lucide-react for icons and tailwindcss-animate for animations.
The new-york style is a new style. It ships with smaller buttons, cards with shadows and a new set of icons from Radix Icons.
When you run the init command, you will be asked which style you would like to use. This is saved in your components.json file.
components.json
Copy
{  "style": "new-york"}
Theming
Start with a style as the base then theme using CSS variables or Tailwind CSS utility classes to completely change the look of your components.
 Style with theming 
________________

Exit animations
I added exit animations to all components. Click on the combobox below to see the subtle exit animation.
PreviewCode
Select framework...
The animations can be customized using utility classes.
________________


Other updates
Button
* Added a new button size icon:
PreviewCode
Sheet
* Renamed position to side to match the other elements.
PreviewCode
toprightbottomleft
* Removed the size props. Use className="w-[200px] md:w-[450px]" for responsive sizing.
________________


Updating your project
Since we follow a copy and paste approach, you will need to manually update your project to get the latest changes.
Note: we are working on a diff command to help you keep track of upstream updates.
Add components.json
Creating a components.json file at the root:
components.json
Copy
{  "style": "default",  "rsc": true,  "tailwind": {    "config": "tailwind.config.js",    "css": "app/globals.css",    "baseColor": "slate",    "cssVariables": true  },  "aliases": {    "components": "@/components",    "utils": "@/lib/utils"  }}
Update the values for tailwind.css and aliases to match your project structure.
Button
Add the icon size to the buttonVariants:
components/ui/button.tsx
Copy
const buttonVariants = cva({  variants: {    size: {      default: "h-10 px-4 py-2",      sm: "h-9 rounded-md px-3",      lg: "h-11 rounded-md px-8",      icon: "h-10 w-10",    },  },})
Sheet
1. Replace the content of sheet.tsx with the following:
components/ui/sheet.tsx
Copy
"use client" import * as React from "react"import * as SheetPrimitive from "@radix-ui/react-dialog"import { cva, type VariantProps } from "class-variance-authority"import { X } from "lucide-react" import { cn } from "@/lib/utils" const Sheet = SheetPrimitive.Root const SheetTrigger = SheetPrimitive.Trigger const SheetClose = SheetPrimitive.Close const SheetPortal = ({  className,  ...props}: SheetPrimitive.DialogPortalProps) => (  <SheetPrimitive.Portal className={cn(className)} {...props} />)SheetPortal.displayName = SheetPrimitive.Portal.displayName const SheetOverlay = React.forwardRef<  React.ElementRef<typeof SheetPrimitive.Overlay>,  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>>(({ className, ...props }, ref) => (  <SheetPrimitive.Overlay    className={cn(      "bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm",      className    )}    {...props}    ref={ref}  />))SheetOverlay.displayName = SheetPrimitive.Overlay.displayName const sheetVariants = cva(  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",  {    variants: {      side: {        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",        bottom:          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",        right:          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",      },    },    defaultVariants: {      side: "right",    },  }) interface SheetContentProps  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,    VariantProps<typeof sheetVariants> {} const SheetContent = React.forwardRef<  React.ElementRef<typeof SheetPrimitive.Content>,  SheetContentProps>(({ side = "right", className, children, ...props }, ref) => (  <SheetPortal>    <SheetOverlay />    <SheetPrimitive.Content      ref={ref}      className={cn(sheetVariants({ side }), className)}      {...props}    >      {children}      <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">        <X className="h-4 w-4" />        <span className="sr-only">Close</span>      </SheetPrimitive.Close>    </SheetPrimitive.Content>  </SheetPortal>))SheetContent.displayName = SheetPrimitive.Content.displayName const SheetHeader = ({  className,  ...props}: React.HTMLAttributes<HTMLDivElement>) => (  <div    className={cn(      "flex flex-col space-y-2 text-center sm:text-left",      className    )}    {...props}  />)SheetHeader.displayName = "SheetHeader" const SheetFooter = ({  className,  ...props}: React.HTMLAttributes<HTMLDivElement>) => (  <div    className={cn(      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",      className    )}    {...props}  />)SheetFooter.displayName = "SheetFooter" const SheetTitle = React.forwardRef<  React.ElementRef<typeof SheetPrimitive.Title>,  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>>(({ className, ...props }, ref) => (  <SheetPrimitive.Title    ref={ref}    className={cn("text-foreground text-lg font-semibold", className)}    {...props}  />))SheetTitle.displayName = SheetPrimitive.Title.displayName const SheetDescription = React.forwardRef<  React.ElementRef<typeof SheetPrimitive.Description>,  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>>(({ className, ...props }, ref) => (  <SheetPrimitive.Description    ref={ref}    className={cn("text-muted-foreground text-sm", className)}    {...props}  />))SheetDescription.displayName = SheetPrimitive.Description.displayName export {  Sheet,  SheetTrigger,  SheetClose,  SheetContent,  SheetHeader,  SheetFooter,  SheetTitle,  SheetDescription,}
2. Rename position to side
Copy
- <Sheet position="right" />+ <Sheet side="right" />
Thank you
I'd like to thank everyone who has been using this project, providing feedback and contributing to it. I really appreciate it. Thank you 🙏
FigmaLegacy Docs
On This Page
July 2025 - Universal Registry ItemsJuly 2025 - Local File SupportJune 2025 - radix-uiJune 2025 - Calendar ComponentMay 2025 - New SiteApril 2025 - MCPMarch 2025 - shadcn 2.5.0March 2025 - Cross-framework Route SupportFebruary 2025 - Tailwind v4February 2025 - Updated Registry SchemaJanuary 2025 - BlocksDecember 2024 - Monorepo SupportNovember 2024 - IconsOctober 2024 - React 19October 2024 - SidebarAugust 2024 - npx shadcn initUpdate Your ProjectApril 2024 - Introducing Lift ModeMarch 2024 - Introducing BlocksOpen SourceRequest a Blockv0March 2024 - Breadcrumb and Input OTPBreadcrumbInput OTPDecember 2023 - New components, CLI and moreCarouselDrawerPaginationResizableSonnerCLI updatesJuly 2023 - JavaScriptJune 2023 - New CLI, Styles and moreNew CLIinitadddiff (experimental)Theming with CSS Variables or Tailwind ColorsUtility classesCSS VariablesBase colorReact Server ComponentsStylesThemingExit animationsOther updatesButtonSheetUpdating your projectAdd components.jsonButtonSheetThank you
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Changelog - shadcn/ui
Mon
Accordion
Previous
Next
A vertically stacked set of interactive headings that each reveal a section of content.
DocsAPI Reference
PreviewCode
Product Information
Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it offers unparalleled performance and reliability.
Key features include advanced processing capabilities, and an intuitive user interface designed for both beginners and experts.
Shipping Details
Return Policy
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add accordion
Copy
Usage
Copy
import {  Accordion,  AccordionContent,  AccordionItem,  AccordionTrigger,} from "@/components/ui/accordion"
Copy
<Accordion type="single" collapsible>  <AccordionItem value="item-1">    <AccordionTrigger>Is it accessible?</AccordionTrigger>    <AccordionContent>      Yes. It adheres to the WAI-ARIA design pattern.    </AccordionContent>  </AccordionItem></Accordion>
ComponentsAlert
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Accordion - shadcn/ui
Mon
Alert
Previous
Next
Displays a callout for user attention.
PreviewCode
Success! Your changes have been saved
This is an alert with icon, title and description.
This Alert has a title and an icon. No description.
Unable to process your payment.
Please verify your billing information and try again.
* Check your card details
* Ensure sufficient funds
* Verify billing address
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add alert
Copy
Usage
Copy
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
Copy
<Alert variant="default | destructive">  <Terminal />  <AlertTitle>Heads up!</AlertTitle>  <AlertDescription>    You can add components and dependencies to your app using the cli.  </AlertDescription></Alert>
AccordionAlert Dialog
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Alert - shadcn/ui
Mon
Alert Dialog
Previous
Next
A modal dialog that interrupts the user with important content and expects a response.
DocsAPI Reference
PreviewCode
Show Dialog
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add alert-dialog
Copy
Usage
Copy
import {  AlertDialog,  AlertDialogAction,  AlertDialogCancel,  AlertDialogContent,  AlertDialogDescription,  AlertDialogFooter,  AlertDialogHeader,  AlertDialogTitle,  AlertDialogTrigger,} from "@/components/ui/alert-dialog"
Copy
<AlertDialog>  <AlertDialogTrigger>Open</AlertDialogTrigger>  <AlertDialogContent>    <AlertDialogHeader>      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>      <AlertDialogDescription>        This action cannot be undone. This will permanently delete your account        and remove your data from our servers.      </AlertDialogDescription>    </AlertDialogHeader>    <AlertDialogFooter>      <AlertDialogCancel>Cancel</AlertDialogCancel>      <AlertDialogAction>Continue</AlertDialogAction>    </AlertDialogFooter>  </AlertDialogContent></AlertDialog>
AlertAspect Ratio
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Alert Dialog - shadcn/ui
Mon
Aspect Ratio
Previous
Next
Displays content within a desired ratio.
DocsAPI Reference
PreviewCode
 Photo by Drew Beamer 

Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add aspect-ratio
Copy
Usage
Copy
import { AspectRatio } from "@/components/ui/aspect-ratio"
Copy
<AspectRatio ratio={16 / 9}>  <Image src="..." alt="Image" className="rounded-md object-cover" /></AspectRatio>
Alert DialogAvatar
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Aspect Ratio - shadcn/ui
Mon
Avatar
Previous
Next
An image element with a fallback for representing the user.
DocsAPI Reference
PreviewCode
 @shadcn 

 @evilrabbit 

 @shadcn 

 @leerob 

 @evilrabbit 

Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add avatar
Copy
Usage
Copy
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
Copy
<Avatar>  <AvatarImage src="https://github.com/shadcn.png" />  <AvatarFallback>CN</AvatarFallback></Avatar>
Aspect RatioBadge
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Avatar - shadcn/ui
Mon
Badge
Previous
Next
Displays a badge or a component that looks like a badge.
PreviewCode
BadgeSecondaryDestructiveOutline
Verified89920+
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add badge
Copy
Usage
Copy
import { Badge } from "@/components/ui/badge"
Copy
<Badge variant="default |outline | secondary | destructive">Badge</Badge>
Link
You can use the asChild prop to make another component look like a badge. Here's an example of a link that looks like a badge.
Copy
import { Link } from "next/link" import { Badge } from "@/components/ui/badge" export function LinkAsBadge() {  return (    <Badge asChild>      <Link href="/">Badge</Link>    </Badge>  )}
AvatarBreadcrumb
On This Page
InstallationUsageLink
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Badge - shadcn/ui
Mon
Breadcrumb
Previous
Next
Displays the path to the current resource using a hierarchy of links.
PreviewCode
* Home
* * More
* Toggle menu
* * Components
* * Breadcrumb
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add breadcrumb
Copy
Usage
Copy
import {  Breadcrumb,  BreadcrumbItem,  BreadcrumbLink,  BreadcrumbList,  BreadcrumbPage,  BreadcrumbSeparator,} from "@/components/ui/breadcrumb"
Copy
<Breadcrumb>  <BreadcrumbList>    <BreadcrumbItem>      <BreadcrumbLink href="/">Home</BreadcrumbLink>    </BreadcrumbItem>    <BreadcrumbSeparator />    <BreadcrumbItem>      <BreadcrumbLink href="/components">Components</BreadcrumbLink>    </BreadcrumbItem>    <BreadcrumbSeparator />    <BreadcrumbItem>      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>    </BreadcrumbItem>  </BreadcrumbList></Breadcrumb>
Examples
Custom separator
Use a custom component as children for <BreadcrumbSeparator /> to create a custom separator.
PreviewCode
* Home
* * Components
* * Breadcrumb
Copy
import { SlashIcon } from "lucide-react" ... <Breadcrumb>  <BreadcrumbList>    <BreadcrumbItem>      <BreadcrumbLink href="/">Home</BreadcrumbLink>    </BreadcrumbItem>    <BreadcrumbSeparator>      <SlashIcon />    </BreadcrumbSeparator>    <BreadcrumbItem>      <BreadcrumbLink href="/components">Components</BreadcrumbLink>    </BreadcrumbItem>  </BreadcrumbList></Breadcrumb>
________________


Dropdown
You can compose <BreadcrumbItem /> with a <DropdownMenu /> to create a dropdown in the breadcrumb.
PreviewCode
* Home
* * Components
* * Breadcrumb
Copy
import {  DropdownMenu,  DropdownMenuContent,  DropdownMenuItem,  DropdownMenuTrigger,} from "@/components/ui/dropdown-menu" ... <BreadcrumbItem>  <DropdownMenu>    <DropdownMenuTrigger>      Components    </DropdownMenuTrigger>    <DropdownMenuContent align="start">      <DropdownMenuItem>Documentation</DropdownMenuItem>      <DropdownMenuItem>Themes</DropdownMenuItem>      <DropdownMenuItem>GitHub</DropdownMenuItem>    </DropdownMenuContent>  </DropdownMenu></BreadcrumbItem>
________________


Collapsed
We provide a <BreadcrumbEllipsis /> component to show a collapsed state when the breadcrumb is too long.
PreviewCode
* Home
* * More
* * Components
* * Breadcrumb
Copy
import { BreadcrumbEllipsis } from "@/components/ui/breadcrumb" ... <Breadcrumb>  <BreadcrumbList>    {/* ... */}    <BreadcrumbItem>      <BreadcrumbEllipsis />    </BreadcrumbItem>    {/* ... */}  </BreadcrumbList></Breadcrumb>
________________


Link component
To use a custom link component from your routing library, you can use the asChild prop on <BreadcrumbLink />.
PreviewCode
* Home
* * Components
* * Breadcrumb
Copy
import { Link } from "next/link" ... <Breadcrumb>  <BreadcrumbList>    <BreadcrumbItem>      <BreadcrumbLink asChild>        <Link href="/">Home</Link>      </BreadcrumbLink>    </BreadcrumbItem>    {/* ... */}  </BreadcrumbList></Breadcrumb>
________________


Responsive
Here's an example of a responsive breadcrumb that composes <BreadcrumbItem /> with <BreadcrumbEllipsis />, <DropdownMenu />, and <Drawer />.
It displays a dropdown on desktop and a drawer on mobile.
PreviewCode
* Home
* * More
* * Data Fetching
* * Caching and Revalidating
BadgeButton
On This Page
InstallationUsageExamplesCustom separatorDropdownCollapsedLink componentResponsive
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Breadcrumb - shadcn/ui
Mon
Button
Previous
Next
Displays a button or a component that looks like a button.
PreviewCode
Button
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add button
Copy
Usage
Copy
import { Button } from "@/components/ui/button"
Copy
<Button variant="outline">Button</Button>
Link
You can use the asChild prop to make another component look like a button. Here's an example of a link that looks like a button.
Copy
import { Link } from "next/link" import { Button } from "@/components/ui/button" export function LinkAsButton() {  return (    <Button asChild>      <Link href="/login">Login</Link>    </Button>  )}
Examples
Default
PreviewCode
Button
Secondary
PreviewCode
Secondary
Destructive
PreviewCode
Destructive
Outline
PreviewCode
Outline
Ghost
PreviewCode
Ghost
Link
PreviewCode
Link
Icon
PreviewCode
With Icon
PreviewCode
New Branch
Loading
PreviewCode
Please wait
BreadcrumbCalendar
On This Page
InstallationUsageLinkExamplesDefaultSecondaryDestructiveOutlineGhostLinkIconWith IconLoading
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Button - shadcn/ui
Mon
Calendar
Previous
Next
A date field component that allows users to enter and edit date.
Docs
PreviewCode
JanFebMarAprMayJunJulAugSepOctNovDec
19251926192719281929193019311932193319341935193619371938193919401941194219431944194519461947194819491950195119521953195419551956195719581959196019611962196319641965196619671968196919701971197219731974197519761977197819791980198119821983198419851986198719881989199019911992199319941995199619971998199920002001200220032004200520062007200820092010201120122013201420152016201720182019202020212022202320242025
July 2025
Blocks
We have built a collection of 30+ calendar blocks that you can use to build your own calendar components.
See all calendar blocks in the Blocks Library page.
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add calendar
Copy
Usage
Copy
import { Calendar } from "@/components/ui/calendar"
Copy
const [date, setDate] = React.useState<Date | undefined>(new Date()) return (  <Calendar    mode="single"    selected={date}    onSelect={setDate}    className="rounded-lg border"  />)
See the React DayPicker documentation for more information.
About
The Calendar component is built on top of React DayPicker.
Customization
See the React DayPicker documentation for more information on how to customize the Calendar component.
Date Picker
You can use the <Calendar> component to build a date picker. See the Date Picker page for more information.
Persian / Hijri / Jalali Calendar
To use the Persian calendar, edit components/ui/calendar.tsx and replace react-day-picker with react-day-picker/persian.
Copy
- import { DayPicker } from "react-day-picker"+ import { DayPicker } from "react-day-picker/persian"
PreviewCode
Examples
Range Calendar
PreviewCode


Month and Year Selector
PreviewCode
JanFebMarAprMayJunJulAugSepOctNovDec
19251926192719281929193019311932193319341935193619371938193919401941194219431944194519461947194819491950195119521953195419551956195719581959196019611962196319641965196619671968196919701971197219731974197519761977197819791980198119821983198419851986198719881989199019911992199319941995199619971998199920002001200220032004200520062007200820092010201120122013201420152016201720182019202020212022202320242025
June 2025
Month and Year
Date of Birth Picker
PreviewCode
Select date
Date and Time Picker
PreviewCode
Select date
Natural Language Picker
This component uses the chrono-node library to parse natural language dates.
PreviewCode
Select date
Your post will be published on July 19, 2025.
Form
PreviewCode
Pick a date
Your date of birth is used to calculate your age.
Submit
Upgrade Guide
Tailwind v4
If you're already using Tailwind v4, you can upgrade to the latest version of the Calendar component by running the following command:
pnpmnpmyarnbun
pnpm dlx shadcn@latest add calendar
Copy
When you're prompted to overwrite the existing Calendar component, select Yes. If you have made any changes to the Calendar component, you will need to merge your changes with the new version.
This will update the Calendar component and react-day-picker to the latest version.
Next, follow the React DayPicker upgrade guide to upgrade your existing components to the latest version.
Installing Blocks
After upgrading the Calendar component, you can install the new blocks by running the shadcn@latest add command.
pnpmnpmyarnbun
pnpm dlx shadcn@latest add calendar-02
Copy
This will install the latest version of the calendar blocks.
Tailwind v3
If you're using Tailwind v3, you can upgrade to the latest version of the Calendar by copying the following code to your calendar.tsx file.
Expand
components/ui/calendar.tsx
Copy
"use client" import * as React from "react"import {  ChevronDownIcon,  ChevronLeftIcon,  ChevronRightIcon,} from "lucide-react"import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker" import { cn } from "@/lib/utils"import { Button, buttonVariants } from "@/components/ui/button" function Calendar({  className,  classNames,  showOutsideDays = true,  captionLayout = "label",  buttonVariant = "ghost",  formatters,  components,  ...props}: React.ComponentProps<typeof DayPicker> & {  buttonVariant?: React.ComponentProps<typeof Button>["variant"]}) {  const defaultClassNames = getDefaultClassNames()  return (    <DayPicker      showOutsideDays={showOutsideDays}      className={cn(        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,        className      )}      captionLayout={captionLayout}      formatters={{        formatMonthDropdown: (date) =>          date.toLocaleString("default", { month: "short" }),        ...formatters,      }}      classNames={{        root: cn("w-fit", defaultClassNames.root),        months: cn(          "relative flex flex-col gap-4 md:flex-row",          defaultClassNames.months        ),        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),        nav: cn(          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",          defaultClassNames.nav        ),        button_previous: cn(          buttonVariants({ variant: buttonVariant }),          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",          defaultClassNames.button_previous        ),        button_next: cn(          buttonVariants({ variant: buttonVariant }),          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",          defaultClassNames.button_next        ),        month_caption: cn(          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",          defaultClassNames.month_caption        ),        dropdowns: cn(          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",          defaultClassNames.dropdowns        ),        dropdown_root: cn(          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",          defaultClassNames.dropdown_root        ),        dropdown: cn("absolute inset-0 opacity-0", defaultClassNames.dropdown),        caption_label: cn(          "select-none font-medium",          captionLayout === "label"            ? "text-sm"            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",          defaultClassNames.caption_label        ),        table: "w-full border-collapse",        weekdays: cn("flex", defaultClassNames.weekdays),        weekday: cn(          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",          defaultClassNames.weekday        ),        week: cn("mt-2 flex w-full", defaultClassNames.week),        week_number_header: cn(          "w-[--cell-size] select-none",          defaultClassNames.week_number_header        ),        week_number: cn(          "text-muted-foreground select-none text-[0.8rem]",          defaultClassNames.week_number        ),        day: cn(          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",          defaultClassNames.day        ),        range_start: cn(          "bg-accent rounded-l-md",          defaultClassNames.range_start        ),        range_middle: cn("rounded-none", defaultClassNames.range_middle),        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),        today: cn(          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",          defaultClassNames.today        ),        outside: cn(          "text-muted-foreground aria-selected:text-muted-foreground",          defaultClassNames.outside        ),        disabled: cn(          "text-muted-foreground opacity-50",          defaultClassNames.disabled        ),        hidden: cn("invisible", defaultClassNames.hidden),        ...classNames,      }}      components={{        Root: ({ className, rootRef, ...props }) => {          return (            <div              data-slot="calendar"              ref={rootRef}              className={cn(className)}              {...props}            />          )        },        Chevron: ({ className, orientation, ...props }) => {          if (orientation === "left") {            return (              <ChevronLeftIcon className={cn("size-4", className)} {...props} />            )          }          if (orientation === "right") {            return (              <ChevronRightIcon                className={cn("size-4", className)}                {...props}              />            )          }          return (            <ChevronDownIcon className={cn("size-4", className)} {...props} />          )        },        DayButton: CalendarDayButton,        WeekNumber: ({ children, ...props }) => {          return (            <td {...props}>              <div className="flex size-[--cell-size] items-center justify-center text-center">                {children}              </div>            </td>          )        },        ...components,      }}      {...props}    />  )} function CalendarDayButton({  className,  day,  modifiers,  ...props}: React.ComponentProps<typeof DayButton>) {  const defaultClassNames = getDefaultClassNames()  const ref = React.useRef<HTMLButtonElement>(null)  React.useEffect(() => {    if (modifiers.focused) ref.current?.focus()  }, [modifiers.focused])  return (    <Button      ref={ref}      variant="ghost"      size="icon"      data-day={day.date.toLocaleDateString()}      data-selected-single={        modifiers.selected &&        !modifiers.range_start &&        !modifiers.range_end &&        !modifiers.range_middle      }      data-range-start={modifiers.range_start}      data-range-end={modifiers.range_end}      data-range-middle={modifiers.range_middle}      className={cn(        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",        defaultClassNames.day,        className      )}      {...props}    />  )} export { Calendar, CalendarDayButton }
Expand
If you have made any changes to the Calendar component, you will need to merge your changes with the new version.
Then follow the React DayPicker upgrade guide to upgrade your dependencies and existing components to the latest version.
Installing Blocks
After upgrading the Calendar component, you can install the new blocks by running the shadcn@latest add command.
pnpmnpmyarnbun
pnpm dlx shadcn@latest add calendar-02
Copy
This will install the latest version of the calendar blocks.
ButtonCard
On This Page
BlocksInstallationUsageAboutCustomizationDate PickerPersian / Hijri / Jalali CalendarExamplesRange CalendarMonth and Year SelectorDate of Birth PickerDate and Time PickerNatural Language PickerFormUpgrade GuideTailwind v4Installing BlocksTailwind v3Installing Blocks
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Calendar - shadcn/ui
Mon
Card
Previous
Next
Displays a card with header, content, and footer.
PreviewCode
Login to your account
Enter your email below to login to your account
Sign Up
Forgot your password?
LoginLogin with Google
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add card
Copy
Usage
Copy
import {  Card,  CardAction,  CardContent,  CardDescription,  CardFooter,  CardHeader,  CardTitle,} from "@/components/ui/card"
Copy
<Card>  <CardHeader>    <CardTitle>Card Title</CardTitle>    <CardDescription>Card Description</CardDescription>    <CardAction>Card Action</CardAction>  </CardHeader>  <CardContent>    <p>Card Content</p>  </CardContent>  <CardFooter>    <p>Card Footer</p>  </CardFooter></Card>
CalendarCarousel
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Card - shadcn/ui
Mon
Carousel
Previous
Next
A carousel with motion and swipe built using Embla.
DocsAPI Reference
PreviewCode
1
2
3
4
5
Previous slide
Next slide
About
The carousel component is built using the Embla Carousel library.
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add carousel
Copy
Usage
Copy
import {  Carousel,  CarouselContent,  CarouselItem,  CarouselNext,  CarouselPrevious,} from "@/components/ui/carousel"
Copy
<Carousel>  <CarouselContent>    <CarouselItem>...</CarouselItem>    <CarouselItem>...</CarouselItem>    <CarouselItem>...</CarouselItem>  </CarouselContent>  <CarouselPrevious />  <CarouselNext /></Carousel>
Examples
Sizes
To set the size of the items, you can use the basis utility class on the <CarouselItem />.
PreviewCode
1
2
3
4
5
Previous slide
Next slide
Copy
// 33% of the carousel width.<Carousel>  <CarouselContent>    <CarouselItem className="basis-1/3">...</CarouselItem>    <CarouselItem className="basis-1/3">...</CarouselItem>    <CarouselItem className="basis-1/3">...</CarouselItem>  </CarouselContent></Carousel>
Copy
// 50% on small screens and 33% on larger screens.<Carousel>  <CarouselContent>    <CarouselItem className="md:basis-1/2 lg:basis-1/3">...</CarouselItem>    <CarouselItem className="md:basis-1/2 lg:basis-1/3">...</CarouselItem>    <CarouselItem className="md:basis-1/2 lg:basis-1/3">...</CarouselItem>  </CarouselContent></Carousel>
Spacing
To set the spacing between the items, we use a pl-[VALUE] utility on the <CarouselItem /> and a negative -ml-[VALUE] on the <CarouselContent />.
Why: I tried to use the gap property or a grid layout on the <CarouselContent /> but it required a lot of math and mental effort to get the spacing right. I found pl-[VALUE] and -ml-[VALUE] utilities much easier to use.
You can always adjust this in your own project if you need to.
PreviewCode
1
2
3
4
5
Previous slide
Next slide
Copy
<Carousel>  <CarouselContent className="-ml-4">    <CarouselItem className="pl-4">...</CarouselItem>    <CarouselItem className="pl-4">...</CarouselItem>    <CarouselItem className="pl-4">...</CarouselItem>  </CarouselContent></Carousel>
Copy
<Carousel>  <CarouselContent className="-ml-2 md:-ml-4">    <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>    <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>    <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>  </CarouselContent></Carousel>
Orientation
Use the orientation prop to set the orientation of the carousel.
PreviewCode
1
2
3
4
5
Previous slide
Next slide
Copy
<Carousel orientation="vertical | horizontal">  <CarouselContent>    <CarouselItem>...</CarouselItem>    <CarouselItem>...</CarouselItem>    <CarouselItem>...</CarouselItem>  </CarouselContent></Carousel>
Options
You can pass options to the carousel using the opts prop. See the Embla Carousel docs for more information.
Copy
<Carousel  opts={{    align: "start",    loop: true,  }}>  <CarouselContent>    <CarouselItem>...</CarouselItem>    <CarouselItem>...</CarouselItem>    <CarouselItem>...</CarouselItem>  </CarouselContent></Carousel>
API
Use a state and the setApi props to get an instance of the carousel API.
PreviewCode
1
2
3
4
5
Previous slide
Next slide
Slide 1 of 5
Copy
import { type CarouselApi } from "@/components/ui/carousel" export function Example() {  const [api, setApi] = React.useState<CarouselApi>()  const [current, setCurrent] = React.useState(0)  const [count, setCount] = React.useState(0)  React.useEffect(() => {    if (!api) {      return    }    setCount(api.scrollSnapList().length)    setCurrent(api.selectedScrollSnap() + 1)    api.on("select", () => {      setCurrent(api.selectedScrollSnap() + 1)    })  }, [api])  return (    <Carousel setApi={setApi}>      <CarouselContent>        <CarouselItem>...</CarouselItem>        <CarouselItem>...</CarouselItem>        <CarouselItem>...</CarouselItem>      </CarouselContent>    </Carousel>  )}
Events
You can listen to events using the api instance from setApi.
Copy
import { type CarouselApi } from "@/components/ui/carousel" export function Example() {  const [api, setApi] = React.useState<CarouselApi>()  React.useEffect(() => {    if (!api) {      return    }    api.on("select", () => {      // Do something on select.    })  }, [api])  return (    <Carousel setApi={setApi}>      <CarouselContent>        <CarouselItem>...</CarouselItem>        <CarouselItem>...</CarouselItem>        <CarouselItem>...</CarouselItem>      </CarouselContent>    </Carousel>  )}
See the Embla Carousel docs for more information on using events.
Plugins
You can use the plugins prop to add plugins to the carousel.
Copy
import Autoplay from "embla-carousel-autoplay" export function Example() {  return (    <Carousel      plugins={[        Autoplay({          delay: 2000,        }),      ]}    >      // ...    </Carousel>  )}
PreviewCode
1
2
3
4
5
Previous slide
Next slide
See the Embla Carousel docs for more information on using plugins.
CardChart
On This Page
AboutInstallationUsageExamplesSizesSpacingOrientationOptionsAPIEventsPlugins
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Carousel - shadcn/ui
Mon
Chart
Previous
Next
Beautiful charts. Built using Recharts. Copy and paste into your apps.
Note: We're working on upgrading to Recharts v3. In the meantime, if you'd like to start testing v3, see the code in the comment here. We'll have an official release soon.
Bar Chart - Interactive
Showing total visitors for the last 3 months
Desktop24,828
Mobile25,010
Apr 3Apr 13Apr 24May 5May 16May 27Jun 7Jun 17Jun 29
Introducing Charts. A collection of chart components that you can copy and paste into your apps.
Charts are designed to look great out of the box. They work well with the other components and are fully customizable to fit your project.
Browse the Charts Library.
Component
We use Recharts under the hood.
We designed the chart component with composition in mind. You build your charts using Recharts components and only bring in custom components, such as ChartTooltip, when and where you need it.
Copy
import { Bar, BarChart } from "recharts" import { ChartContainer, ChartTooltipContent } from "@/components/ui/charts" export function MyChart() {  return (    <ChartContainer>      <BarChart data={data}>        <Bar dataKey="value" />        <ChartTooltip content={<ChartTooltipContent />} />      </BarChart>    </ChartContainer>  )}
We do not wrap Recharts. This means you're not locked into an abstraction. When a new Recharts version is released, you can follow the official upgrade path to upgrade your charts.
The components are yours.
Installation
Note: If you are using charts with React 19 or the Next.js 15, see the note here.
CLIManual
Run the following command to install chart.tsx
pnpmnpmyarnbun
pnpm dlx shadcn@latest add chart
Copy
Add the following colors to your CSS file
app/globals.css
Copy
@layer base {  :root {    --chart-1: oklch(0.646 0.222 41.116);    --chart-2: oklch(0.6 0.118 184.704);    --chart-3: oklch(0.398 0.07 227.392);    --chart-4: oklch(0.828 0.189 84.429);    --chart-5: oklch(0.769 0.188 70.08);  }  .dark {    --chart-1: oklch(0.488 0.243 264.376);    --chart-2: oklch(0.696 0.17 162.48);    --chart-3: oklch(0.769 0.188 70.08);    --chart-4: oklch(0.627 0.265 303.9);    --chart-5: oklch(0.645 0.246 16.439);  }}
Your First Chart
Let's build your first chart. We'll build a bar chart, add a grid, axis, tooltip and legend.
Start by defining your data
The following data represents the number of desktop and mobile users for each month.
Note: Your data can be in any shape. You are not limited to the shape of the data below. Use the dataKey prop to map your data to the chart.
components/example-chart.tsx
Copy
const chartData = [  { month: "January", desktop: 186, mobile: 80 },  { month: "February", desktop: 305, mobile: 200 },  { month: "March", desktop: 237, mobile: 120 },  { month: "April", desktop: 73, mobile: 190 },  { month: "May", desktop: 209, mobile: 130 },  { month: "June", desktop: 214, mobile: 140 },]
Define your chart config
The chart config holds configuration for the chart. This is where you place human-readable strings, such as labels, icons and color tokens for theming.
components/example-chart.tsx
Copy
import { type ChartConfig } from "@/components/ui/chart" const chartConfig = {  desktop: {    label: "Desktop",    color: "#2563eb",  },  mobile: {    label: "Mobile",    color: "#60a5fa",  },} satisfies ChartConfig
Build your chart
You can now build your chart using Recharts components.
Important: Remember to set a min-h-[VALUE] on the ChartContainer component. This is required for the chart be responsive.
Expand
components/example-chart.tsx
Copy
"use client"import { Bar, BarChart } from "recharts"import { ChartConfig, ChartContainer } from "@/components/ui/chart"const chartData = [  { month: "January", desktop: 186, mobile: 80 },  { month: "February", desktop: 305, mobile: 200 },  { month: "March", desktop: 237, mobile: 120 },  { month: "April", desktop: 73, mobile: 190 },  { month: "May", desktop: 209, mobile: 130 },  { month: "June", desktop: 214, mobile: 140 },]const chartConfig = {  desktop: {    label: "Desktop",    color: "#2563eb",  },  mobile: {    label: "Mobile",    color: "#60a5fa",  },} satisfies ChartConfigexport function Component() {  return (    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">      <BarChart accessibilityLayer data={chartData}>        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />      </BarChart>    </ChartContainer>  )}
Expand
PreviewCode
Add a Grid
Let's add a grid to the chart.
Import the CartesianGrid component.
Copy
import { Bar, BarChart, CartesianGrid } from "recharts"
Add the CartesianGrid component to your chart.
Copy
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">  <BarChart accessibilityLayer data={chartData}>    <CartesianGrid vertical={false} />    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />  </BarChart></ChartContainer>
PreviewCode
Add an Axis
To add an x-axis to the chart, we'll use the XAxis component.
Import the XAxis component.
Copy
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
Add the XAxis component to your chart.
Copy
<ChartContainer config={chartConfig} className="h-[200px] w-full">  <BarChart accessibilityLayer data={chartData}>    <CartesianGrid vertical={false} />    <XAxis      dataKey="month"      tickLine={false}      tickMargin={10}      axisLine={false}      tickFormatter={(value) => value.slice(0, 3)}    />    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />  </BarChart></ChartContainer>
PreviewCode
JanFebMarAprMayJun
Add Tooltip
So far we've only used components from Recharts. They look great out of the box thanks to some customization in the chart component.
To add a tooltip, we'll use the custom ChartTooltip and ChartTooltipContent components from chart.
Import the ChartTooltip and ChartTooltipContent components.
Copy
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
Add the components to your chart.
Copy
<ChartContainer config={chartConfig} className="h-[200px] w-full">  <BarChart accessibilityLayer data={chartData}>    <CartesianGrid vertical={false} />    <XAxis      dataKey="month"      tickLine={false}      tickMargin={10}      axisLine={false}      tickFormatter={(value) => value.slice(0, 3)}    />    <ChartTooltip content={<ChartTooltipContent />} />    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />  </BarChart></ChartContainer>
PreviewCode
JanFebMarAprMayJun
Hover to see the tooltips. Easy, right? Two components, and we've got a beautiful tooltip.
Add Legend
We'll do the same for the legend. We'll use the ChartLegend and ChartLegendContent components from chart.
Import the ChartLegend and ChartLegendContent components.
Copy
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"
Add the components to your chart.
Copy
<ChartContainer config={chartConfig} className="h-[200px] w-full">  <BarChart accessibilityLayer data={chartData}>    <CartesianGrid vertical={false} />    <XAxis      dataKey="month"      tickLine={false}      tickMargin={10}      axisLine={false}      tickFormatter={(value) => value.slice(0, 3)}    />    <ChartTooltip content={<ChartTooltipContent />} />    <ChartLegend content={<ChartLegendContent />} />    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />  </BarChart></ChartContainer>
PreviewCode
JanFebMarAprMayJun
Desktop
Mobile
Done. You've built your first chart! What's next?
* Themes and Colors
* Tooltip
* Legend
Chart Config
The chart config is where you define the labels, icons and colors for a chart.
It is intentionally decoupled from chart data.
This allows you to share config and color tokens between charts. It can also works independently for cases where your data or color tokens live remotely or in a different format.
Copy
import { Monitor } from "lucide-react" import { type ChartConfig } from "@/components/ui/chart" const chartConfig = {  desktop: {    label: "Desktop",    icon: Monitor,    // A color like 'hsl(220, 98%, 61%)' or 'var(--color-name)'    color: "#2563eb",    // OR a theme object with 'light' and 'dark' keys    theme: {      light: "#2563eb",      dark: "#dc2626",    },  },} satisfies ChartConfig
Theming
Charts has built-in support for theming. You can use css variables (recommended) or color values in any color format, such as hex, hsl or oklch.
CSS Variables
Define your colors in your css file
app/globals.css
Copy
@layer base {  :root {    --chart-1: oklch(0.646 0.222 41.116);    --chart-2: oklch(0.6 0.118 184.704);  }  .dark: {    --chart-1: oklch(0.488 0.243 264.376);    --chart-2: oklch(0.696 0.17 162.48);  }}
Add the color to your chartConfig
Copy
const chartConfig = {  desktop: {    label: "Desktop",    color: "var(--chart-1)",  },  mobile: {    label: "Mobile",    color: "var(--chart-2)",  },} satisfies ChartConfig
hex, hsl or oklch
You can also define your colors directly in the chart config. Use the color format you prefer.
Copy
const chartConfig = {  desktop: {    label: "Desktop",    color: "#2563eb",  },} satisfies ChartConfig
Using Colors
To use the theme colors in your chart, reference the colors using the format var(--color-KEY).
Components
Copy
<Bar dataKey="desktop" fill="var(--color-desktop)" />
Chart Data
Copy
const chartData = [  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },]
Tailwind
Copy
<LabelList className="fill-[--color-desktop]" />
Tooltip
A chart tooltip contains a label, name, indicator and value. You can use a combination of these to customize your tooltip.
Label
Page Views
Desktop
186
Mobile
80
Name
Chrome
1,286
Firefox
1,000
Page Views
Desktop
12,486
Indicator
Chrome
1,286
You can turn on/off any of these using the hideLabel, hideIndicator props and customize the indicator style using the indicator prop.
Use labelKey and nameKey to use a custom key for the tooltip label and name.
Chart comes with the <ChartTooltip> and <ChartTooltipContent> components. You can use these two components to add custom tooltips to your chart.
Copy
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
Copy
<ChartTooltip content={<ChartTooltipContent />} />
Props
Use the following props to customize the tooltip.
Prop
	Type
	Description
	labelKey
	string
	The config or data key to use for the label.
	nameKey
	string
	The config or data key to use for the name.
	indicator
	dot line or dashed
	The indicator style for the tooltip.
	hideLabel
	boolean
	Whether to hide the label.
	hideIndicator
	boolean
	Whether to hide the indicator.
	Colors
Colors are automatically referenced from the chart config.
Custom
To use a custom key for tooltip label and names, use the labelKey and nameKey props.
Copy
const chartData = [  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },] const chartConfig = {  visitors: {    label: "Total Visitors",  },  chrome: {    label: "Chrome",    color: "hsl(var(--chart-1))",  },  safari: {    label: "Safari",    color: "hsl(var(--chart-2))",  },} satisfies ChartConfig
Copy
<ChartTooltip  content={<ChartTooltipContent labelKey="visitors" nameKey="browser" />}/>
This will use Total Visitors for label and Chrome and Safari for the tooltip names.
Legend
You can use the custom <ChartLegend> and <ChartLegendContent> components to add a legend to your chart.
Copy
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"
Copy
<ChartLegend content={<ChartLegendContent />} />
Colors
Colors are automatically referenced from the chart config.
Custom
To use a custom key for legend names, use the nameKey prop.
Copy
const chartData = [  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },] const chartConfig = {  chrome: {    label: "Chrome",    color: "hsl(var(--chart-1))",  },  safari: {    label: "Safari",    color: "hsl(var(--chart-2))",  },} satisfies ChartConfig
Copy
<ChartLegend content={<ChartLegendContent nameKey="browser" />} />
This will use Chrome and Safari for the legend names.
Accessibility
You can turn on the accessibilityLayer prop to add an accessible layer to your chart.
This prop adds keyboard access and screen reader support to your charts.
Copy
<LineChart accessibilityLayer />
CarouselCheckbox
On This Page
ComponentInstallationYour First ChartAdd a GridAdd an AxisAdd TooltipAdd LegendChart ConfigThemingCSS Variableshex, hsl or oklchUsing ColorsComponentsChart DataTailwindTooltipPropsColorsCustomLegendColorsCustomAccessibility
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Chart - shadcn/ui
Jan
Checkbox
Previous
Next
A control that allows the user to toggle between checked and not checked.
DocsAPI Reference
PreviewCode
By clicking this checkbox, you agree to the terms and conditions.
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add checkbox
Copy
Usage
Copy
import { Checkbox } from "@/components/ui/checkbox"
Copy
<Checkbox />
Examples
Form
PreviewCode
Select the items you want to display in the sidebar.
Submit
ChartCollapsible
On This Page
InstallationUsageExamplesForm
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Checkbox - shadcn/ui
Jan
Collapsible
Previous
Next
An interactive component which expands/collapses a panel.
DocsAPI Reference
PreviewCode
@peduarte starred 3 repositories
Toggle
@radix-ui/primitives
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add collapsible
Copy
Usage
Copy
import {  Collapsible,  CollapsibleContent,  CollapsibleTrigger,} from "@/components/ui/collapsible"
Copy
<Collapsible>  <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>  <CollapsibleContent>    Yes. Free to use for personal and commercial projects. No attribution    required.  </CollapsibleContent></Collapsible>
CheckboxCombobox
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Collapsible - shadcn/ui
Jan
Combobox
Previous
Next
Autocomplete input and command palette with a list of suggestions.
PreviewCode
Select framework...
Installation
The Combobox is built using a composition of the <Popover /> and the <Command /> components.
See installation instructions for the Popover and the Command components.
Usage
Expand
components/example-combobox.tsx
Copy
"use client" import * as React from "react"import { CheckIcon, ChevronsUpDownIcon } from "lucide-react" import { cn } from "@/lib/utils"import { Button } from "@/components/ui/button"import {  Command,  CommandEmpty,  CommandGroup,  CommandInput,  CommandItem,  CommandList,} from "@/components/ui/command"import {  Popover,  PopoverContent,  PopoverTrigger,} from "@/components/ui/popover" const frameworks = [  {    value: "next.js",    label: "Next.js",  },  {    value: "sveltekit",    label: "SvelteKit",  },  {    value: "nuxt.js",    label: "Nuxt.js",  },  {    value: "remix",    label: "Remix",  },  {    value: "astro",    label: "Astro",  },] export function ExampleCombobox() {  const [open, setOpen] = React.useState(false)  const [value, setValue] = React.useState("")  return (    <Popover open={open} onOpenChange={setOpen}>      <PopoverTrigger asChild>        <Button          variant="outline"          role="combobox"          aria-expanded={open}          className="w-[200px] justify-between"        >          {value            ? frameworks.find((framework) => framework.value === value)?.label            : "Select framework..."}          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />        </Button>      </PopoverTrigger>      <PopoverContent className="w-[200px] p-0">        <Command>          <CommandInput placeholder="Search framework..." />          <CommandList>            <CommandEmpty>No framework found.</CommandEmpty>            <CommandGroup>              {frameworks.map((framework) => (                <CommandItem                  key={framework.value}                  value={framework.value}                  onSelect={(currentValue) => {                    setValue(currentValue === value ? "" : currentValue)                    setOpen(false)                  }}                >                  <CheckIcon                    className={cn(                      "mr-2 h-4 w-4",                      value === framework.value ? "opacity-100" : "opacity-0"                    )}                  />                  {framework.label}                </CommandItem>              ))}            </CommandGroup>          </CommandList>        </Command>      </PopoverContent>    </Popover>  )}
Expand
Examples
Combobox
PreviewCode
Select framework...
Popover
PreviewCode
Status
+ Set status
Dropdown menu
PreviewCode
featureCreate a new project
Responsive
You can create a responsive combobox by using the <Popover /> on desktop and the <Drawer /> components on mobile.
PreviewCode
+ Set status
Form
PreviewCode
Select language
This is the language that will be used in the dashboard.
Submit
CollapsibleCommand
On This Page
InstallationUsageExamplesComboboxPopoverDropdown menuResponsiveForm
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Combobox - shadcn/ui
Jan
Command
Previous
Next
Fast, composable, unstyled command menu for React.
Docs
PreviewCode
Suggestions
Settings
About
The <Command /> component uses the cmdk component by pacocoursey.
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add command
Copy
Usage
Copy
import {  Command,  CommandDialog,  CommandEmpty,  CommandGroup,  CommandInput,  CommandItem,  CommandList,  CommandSeparator,  CommandShortcut,} from "@/components/ui/command"
Copy
<Command>  <CommandInput placeholder="Type a command or search..." />  <CommandList>    <CommandEmpty>No results found.</CommandEmpty>    <CommandGroup heading="Suggestions">      <CommandItem>Calendar</CommandItem>      <CommandItem>Search Emoji</CommandItem>      <CommandItem>Calculator</CommandItem>    </CommandGroup>    <CommandSeparator />    <CommandGroup heading="Settings">      <CommandItem>Profile</CommandItem>      <CommandItem>Billing</CommandItem>      <CommandItem>Settings</CommandItem>    </CommandGroup>  </CommandList></Command>
Examples
Dialog
PreviewCode
Press 
Command Palette
Search for a command to run...
To show the command menu in a dialog, use the <CommandDialog /> component.
components/example-command-menu.tsx
Copy
export function CommandMenu() {  const [open, setOpen] = React.useState(false)  React.useEffect(() => {    const down = (e: KeyboardEvent) => {      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {        e.preventDefault()        setOpen((open) => !open)      }    }    document.addEventListener("keydown", down)    return () => document.removeEventListener("keydown", down)  }, [])  return (    <CommandDialog open={open} onOpenChange={setOpen}>      <CommandInput placeholder="Type a command or search..." />      <CommandList>        <CommandEmpty>No results found.</CommandEmpty>        <CommandGroup heading="Suggestions">          <CommandItem>Calendar</CommandItem>          <CommandItem>Search Emoji</CommandItem>          <CommandItem>Calculator</CommandItem>        </CommandGroup>      </CommandList>    </CommandDialog>  )}
Combobox
You can use the <Command /> component as a combobox. See the Combobox page for more information.
ComboboxContext Menu
On This Page
AboutInstallationUsageExamplesDialogCombobox
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Command - shadcn/ui
Jan
Context Menu
Previous
Next
Displays a menu to the user — such as a set of actions or functions — triggered by a button.
DocsAPI Reference
PreviewCode
Right click here
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add context-menu
Copy
Usage
Copy
import {  ContextMenu,  ContextMenuContent,  ContextMenuItem,  ContextMenuTrigger,} from "@/components/ui/context-menu"
Copy
<ContextMenu>  <ContextMenuTrigger>Right click</ContextMenuTrigger>  <ContextMenuContent>    <ContextMenuItem>Profile</ContextMenuItem>    <ContextMenuItem>Billing</ContextMenuItem>    <ContextMenuItem>Team</ContextMenuItem>    <ContextMenuItem>Subscription</ContextMenuItem>  </ContextMenuContent></ContextMenu>
CommandData Table
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Context Menu - shadcn/ui
Jan
Data Table
Previous
Next
Powerful table and datagrids built using TanStack Table.
Docs
PreviewCode
Columns


	Status
	Email
	Amount
	

	

	success
	ken99@example.com
	$316.00
	Open menu
	

	success
	Abe45@example.com
	$242.00
	Open menu
	

	processing
	Monserrat44@example.com
	$837.00
	Open menu
	

	success
	Silas22@example.com
	$874.00
	Open menu
	

	failed
	carmella@example.com
	$721.00
	Open menu
	0 of 5 row(s) selected.
PreviousNext
Introduction
Every data table or datagrid I've created has been unique. They all behave differently, have specific sorting and filtering requirements, and work with different data sources.
It doesn't make sense to combine all of these variations into a single component. If we do that, we'll lose the flexibility that headless UI provides.
So instead of a data-table component, I thought it would be more helpful to provide a guide on how to build your own.
We'll start with the basic <Table /> component and build a complex data table from scratch.
Tip: If you find yourself using the same table in multiple places in your app, you can always extract it into a reusable component.
Table of Contents
This guide will show you how to use TanStack Table and the <Table /> component to build your own custom data table. We'll cover the following topics:
* Basic Table
* Row Actions
* Pagination
* Sorting
* Filtering
* Visibility
* Row Selection
* Reusable Components
Installation
1. Add the <Table /> component to your project:
pnpmnpmyarnbun
pnpm dlx shadcn@latest add table
Copy
2. Add tanstack/react-table dependency:
pnpmnpmyarnbun
pnpm add @tanstack/react-table
Copy
Prerequisites
We are going to build a table to show recent payments. Here's what our data looks like:
Copy
type Payment = {  id: string  amount: number  status: "pending" | "processing" | "success" | "failed"  email: string} export const payments: Payment[] = [  {    id: "728ed52f",    amount: 100,    status: "pending",    email: "m@example.com",  },  {    id: "489e1d42",    amount: 125,    status: "processing",    email: "example@gmail.com",  },  // ...]
Project Structure
Start by creating the following file structure:
Copy
app└── payments    ├── columns.tsx    ├── data-table.tsx    └── page.tsx
I'm using a Next.js example here but this works for any other React framework.
* columns.tsx (client component) will contain our column definitions.
* data-table.tsx (client component) will contain our <DataTable /> component.
* page.tsx (server component) is where we'll fetch data and render our table.
Basic Table
Let's start by building a basic table.
Column Definitions
First, we'll define our columns.
app/payments/columns.tsx
Copy
"use client" import { ColumnDef } from "@tanstack/react-table" // This type is used to define the shape of our data.// You can use a Zod schema here if you want.export type Payment = {  id: string  amount: number  status: "pending" | "processing" | "success" | "failed"  email: string} export const columns: ColumnDef<Payment>[] = [  {    accessorKey: "status",    header: "Status",  },  {    accessorKey: "email",    header: "Email",  },  {    accessorKey: "amount",    header: "Amount",  },]
Note: Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered.
<DataTable /> component
Next, we'll create a <DataTable /> component to render our table.
app/payments/data-table.tsx
Copy
"use client" import {  ColumnDef,  flexRender,  getCoreRowModel,  useReactTable,} from "@tanstack/react-table" import {  Table,  TableBody,  TableCell,  TableHead,  TableHeader,  TableRow,} from "@/components/ui/table" interface DataTableProps<TData, TValue> {  columns: ColumnDef<TData, TValue>[]  data: TData[]} export function DataTable<TData, TValue>({  columns,  data,}: DataTableProps<TData, TValue>) {  const table = useReactTable({    data,    columns,    getCoreRowModel: getCoreRowModel(),  })  return (    <div className="rounded-md border">      <Table>        <TableHeader>          {table.getHeaderGroups().map((headerGroup) => (            <TableRow key={headerGroup.id}>              {headerGroup.headers.map((header) => {                return (                  <TableHead key={header.id}>                    {header.isPlaceholder                      ? null                      : flexRender(                          header.column.columnDef.header,                          header.getContext()                        )}                  </TableHead>                )              })}            </TableRow>          ))}        </TableHeader>        <TableBody>          {table.getRowModel().rows?.length ? (            table.getRowModel().rows.map((row) => (              <TableRow                key={row.id}                data-state={row.getIsSelected() && "selected"}              >                {row.getVisibleCells().map((cell) => (                  <TableCell key={cell.id}>                    {flexRender(cell.column.columnDef.cell, cell.getContext())}                  </TableCell>                ))}              </TableRow>            ))          ) : (            <TableRow>              <TableCell colSpan={columns.length} className="h-24 text-center">                No results.              </TableCell>            </TableRow>          )}        </TableBody>      </Table>    </div>  )}
Tip: If you find yourself using <DataTable /> in multiple places, this is the component you could make reusable by extracting it to components/ui/data-table.tsx.
<DataTable columns={columns} data={data} />
Render the table
Finally, we'll render our table in our page component.
app/payments/page.tsx
Copy
import { columns, Payment } from "./columns"import { DataTable } from "./data-table" async function getData(): Promise<Payment[]> {  // Fetch data from your API here.  return [    {      id: "728ed52f",      amount: 100,      status: "pending",      email: "m@example.com",    },    // ...  ]} export default async function DemoPage() {  const data = await getData()  return (    <div className="container mx-auto py-10">      <DataTable columns={columns} data={data} />    </div>  )}
Cell Formatting
Let's format the amount cell to display the dollar amount. We'll also align the cell to the right.
Update columns definition
Update the header and cell definitions for amount as follows:
app/payments/columns.tsx
Copy
export const columns: ColumnDef<Payment>[] = [  {    accessorKey: "amount",    header: () => <div className="text-right">Amount</div>,    cell: ({ row }) => {      const amount = parseFloat(row.getValue("amount"))      const formatted = new Intl.NumberFormat("en-US", {        style: "currency",        currency: "USD",      }).format(amount)      return <div className="text-right font-medium">{formatted}</div>    },  },]
You can use the same approach to format other cells and headers.
Row Actions
Let's add row actions to our table. We'll use a <Dropdown /> component for this.
Update columns definition
Update our columns definition to add a new actions column. The actions cell returns a <Dropdown /> component.
app/payments/columns.tsx
Copy
"use client" import { ColumnDef } from "@tanstack/react-table"import { MoreHorizontal } from "lucide-react" import { Button } from "@/components/ui/button"import {  DropdownMenu,  DropdownMenuContent,  DropdownMenuItem,  DropdownMenuLabel,  DropdownMenuSeparator,  DropdownMenuTrigger,} from "@/components/ui/dropdown-menu" export const columns: ColumnDef<Payment>[] = [  // ...  {    id: "actions",    cell: ({ row }) => {      const payment = row.original      return (        <DropdownMenu>          <DropdownMenuTrigger asChild>            <Button variant="ghost" className="h-8 w-8 p-0">              <span className="sr-only">Open menu</span>              <MoreHorizontal className="h-4 w-4" />            </Button>          </DropdownMenuTrigger>          <DropdownMenuContent align="end">            <DropdownMenuLabel>Actions</DropdownMenuLabel>            <DropdownMenuItem              onClick={() => navigator.clipboard.writeText(payment.id)}            >              Copy payment ID            </DropdownMenuItem>            <DropdownMenuSeparator />            <DropdownMenuItem>View customer</DropdownMenuItem>            <DropdownMenuItem>View payment details</DropdownMenuItem>          </DropdownMenuContent>        </DropdownMenu>      )    },  },  // ...]
You can access the row data using row.original in the cell function. Use this to handle actions for your row eg. use the id to make a DELETE call to your API.
Pagination
Next, we'll add pagination to our table.
Update <DataTable>
app/payments/data-table.tsx
Copy
import {  ColumnDef,  flexRender,  getCoreRowModel,  getPaginationRowModel,  useReactTable,} from "@tanstack/react-table" export function DataTable<TData, TValue>({  columns,  data,}: DataTableProps<TData, TValue>) {  const table = useReactTable({    data,    columns,    getCoreRowModel: getCoreRowModel(),    getPaginationRowModel: getPaginationRowModel(),  })  // ...}
This will automatically paginate your rows into pages of 10. See the pagination docs for more information on customizing page size and implementing manual pagination.
Add pagination controls
We can add pagination controls to our table using the <Button /> component and the table.previousPage(), table.nextPage() API methods.
app/payments/data-table.tsx
Copy
import { Button } from "@/components/ui/button" export function DataTable<TData, TValue>({  columns,  data,}: DataTableProps<TData, TValue>) {  const table = useReactTable({    data,    columns,    getCoreRowModel: getCoreRowModel(),    getPaginationRowModel: getPaginationRowModel(),  })  return (    <div>      <div className="rounded-md border">        <Table>          { // .... }        </Table>      </div>      <div className="flex items-center justify-end space-x-2 py-4">        <Button          variant="outline"          size="sm"          onClick={() => table.previousPage()}          disabled={!table.getCanPreviousPage()}        >          Previous        </Button>        <Button          variant="outline"          size="sm"          onClick={() => table.nextPage()}          disabled={!table.getCanNextPage()}        >          Next        </Button>      </div>    </div>  )}
See Reusable Components section for a more advanced pagination component.
Sorting
Let's make the email column sortable.
Update <DataTable>
app/payments/data-table.tsx
Copy
"use client" import * as React from "react"import {  ColumnDef,  SortingState,  flexRender,  getCoreRowModel,  getPaginationRowModel,  getSortedRowModel,  useReactTable,} from "@tanstack/react-table" export function DataTable<TData, TValue>({  columns,  data,}: DataTableProps<TData, TValue>) {  const [sorting, setSorting] = React.useState<SortingState>([])  const table = useReactTable({    data,    columns,    getCoreRowModel: getCoreRowModel(),    getPaginationRowModel: getPaginationRowModel(),    onSortingChange: setSorting,    getSortedRowModel: getSortedRowModel(),    state: {      sorting,    },  })  return (    <div>      <div className="rounded-md border">        <Table>{ ... }</Table>      </div>    </div>  )}
Make header cell sortable
We can now update the email header cell to add sorting controls.
app/payments/columns.tsx
Copy
"use client" import { ColumnDef } from "@tanstack/react-table"import { ArrowUpDown } from "lucide-react" export const columns: ColumnDef<Payment>[] = [  {    accessorKey: "email",    header: ({ column }) => {      return (        <Button          variant="ghost"          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}        >          Email          <ArrowUpDown className="ml-2 h-4 w-4" />        </Button>      )    },  },]
This will automatically sort the table (asc and desc) when the user toggles on the header cell.
Filtering
Let's add a search input to filter emails in our table.
Update <DataTable>
app/payments/data-table.tsx
Copy
"use client" import * as React from "react"import {  ColumnDef,  ColumnFiltersState,  SortingState,  flexRender,  getCoreRowModel,  getFilteredRowModel,  getPaginationRowModel,  getSortedRowModel,  useReactTable,} from "@tanstack/react-table" import { Button } from "@/components/ui/button"import { Input } from "@/components/ui/input" export function DataTable<TData, TValue>({  columns,  data,}: DataTableProps<TData, TValue>) {  const [sorting, setSorting] = React.useState<SortingState>([])  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(    []  )  const table = useReactTable({    data,    columns,    onSortingChange: setSorting,    getCoreRowModel: getCoreRowModel(),    getPaginationRowModel: getPaginationRowModel(),    getSortedRowModel: getSortedRowModel(),    onColumnFiltersChange: setColumnFilters,    getFilteredRowModel: getFilteredRowModel(),    state: {      sorting,      columnFilters,    },  })  return (    <div>      <div className="flex items-center py-4">        <Input          placeholder="Filter emails..."          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}          onChange={(event) =>            table.getColumn("email")?.setFilterValue(event.target.value)          }          className="max-w-sm"        />      </div>      <div className="rounded-md border">        <Table>{ ... }</Table>      </div>    </div>  )}
Filtering is now enabled for the email column. You can add filters to other columns as well. See the filtering docs for more information on customizing filters.
Visibility
Adding column visibility is fairly simple using @tanstack/react-table visibility API.
Update <DataTable>
app/payments/data-table.tsx
Copy
"use client" import * as React from "react"import {  ColumnDef,  ColumnFiltersState,  SortingState,  VisibilityState,  flexRender,  getCoreRowModel,  getFilteredRowModel,  getPaginationRowModel,  getSortedRowModel,  useReactTable,} from "@tanstack/react-table" import { Button } from "@/components/ui/button"import {  DropdownMenu,  DropdownMenuCheckboxItem,  DropdownMenuContent,  DropdownMenuTrigger,} from "@/components/ui/dropdown-menu" export function DataTable<TData, TValue>({  columns,  data,}: DataTableProps<TData, TValue>) {  const [sorting, setSorting] = React.useState<SortingState>([])  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(    []  )  const [columnVisibility, setColumnVisibility] =    React.useState<VisibilityState>({})  const table = useReactTable({    data,    columns,    onSortingChange: setSorting,    onColumnFiltersChange: setColumnFilters,    getCoreRowModel: getCoreRowModel(),    getPaginationRowModel: getPaginationRowModel(),    getSortedRowModel: getSortedRowModel(),    getFilteredRowModel: getFilteredRowModel(),    onColumnVisibilityChange: setColumnVisibility,    state: {      sorting,      columnFilters,      columnVisibility,    },  })  return (    <div>      <div className="flex items-center py-4">        <Input          placeholder="Filter emails..."          value={table.getColumn("email")?.getFilterValue() as string}          onChange={(event) =>            table.getColumn("email")?.setFilterValue(event.target.value)          }          className="max-w-sm"        />        <DropdownMenu>          <DropdownMenuTrigger asChild>            <Button variant="outline" className="ml-auto">              Columns            </Button>          </DropdownMenuTrigger>          <DropdownMenuContent align="end">            {table              .getAllColumns()              .filter(                (column) => column.getCanHide()              )              .map((column) => {                return (                  <DropdownMenuCheckboxItem                    key={column.id}                    className="capitalize"                    checked={column.getIsVisible()}                    onCheckedChange={(value) =>                      column.toggleVisibility(!!value)                    }                  >                    {column.id}                  </DropdownMenuCheckboxItem>                )              })}          </DropdownMenuContent>        </DropdownMenu>      </div>      <div className="rounded-md border">        <Table>{ ... }</Table>      </div>    </div>  )}
This adds a dropdown menu that you can use to toggle column visibility.
Row Selection
Next, we're going to add row selection to our table.
Update column definitions
app/payments/columns.tsx
Copy
"use client" import { ColumnDef } from "@tanstack/react-table" import { Badge } from "@/components/ui/badge"import { Checkbox } from "@/components/ui/checkbox" export const columns: ColumnDef<Payment>[] = [  {    id: "select",    header: ({ table }) => (      <Checkbox        checked={          table.getIsAllPageRowsSelected() ||          (table.getIsSomePageRowsSelected() && "indeterminate")        }        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}        aria-label="Select all"      />    ),    cell: ({ row }) => (      <Checkbox        checked={row.getIsSelected()}        onCheckedChange={(value) => row.toggleSelected(!!value)}        aria-label="Select row"      />    ),    enableSorting: false,    enableHiding: false,  },]
Update <DataTable>
app/payments/data-table.tsx
Copy
export function DataTable<TData, TValue>({  columns,  data,}: DataTableProps<TData, TValue>) {  const [sorting, setSorting] = React.useState<SortingState>([])  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(    []  )  const [columnVisibility, setColumnVisibility] =    React.useState<VisibilityState>({})  const [rowSelection, setRowSelection] = React.useState({})  const table = useReactTable({    data,    columns,    onSortingChange: setSorting,    onColumnFiltersChange: setColumnFilters,    getCoreRowModel: getCoreRowModel(),    getPaginationRowModel: getPaginationRowModel(),    getSortedRowModel: getSortedRowModel(),    getFilteredRowModel: getFilteredRowModel(),    onColumnVisibilityChange: setColumnVisibility,    onRowSelectionChange: setRowSelection,    state: {      sorting,      columnFilters,      columnVisibility,      rowSelection,    },  })  return (    <div>      <div className="rounded-md border">        <Table />      </div>    </div>  )}
This adds a checkbox to each row and a checkbox in the header to select all rows.
Show selected rows
You can show the number of selected rows using the table.getFilteredSelectedRowModel() API.
Copy
<div className="text-muted-foreground flex-1 text-sm">  {table.getFilteredSelectedRowModel().rows.length} of{" "}  {table.getFilteredRowModel().rows.length} row(s) selected.</div>
Reusable Components
Here are some components you can use to build your data tables. This is from the Tasks demo.
Column header
Make any column header sortable and hideable.
Expand
components/data-table-column-header.tsx
Copy
import { Column } from "@tanstack/react-table"import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react"import { cn } from "@/lib/utils"import { Button } from "@/registry/new-york-v4/ui/button"import {  DropdownMenu,  DropdownMenuContent,  DropdownMenuItem,  DropdownMenuSeparator,  DropdownMenuTrigger,} from "@/registry/new-york-v4/ui/dropdown-menu"interface DataTableColumnHeaderProps<TData, TValue>  extends React.HTMLAttributes<HTMLDivElement> {  column: Column<TData, TValue>  title: string}export function DataTableColumnHeader<TData, TValue>({  column,  title,  className,}: DataTableColumnHeaderProps<TData, TValue>) {  if (!column.getCanSort()) {    return <div className={cn(className)}>{title}</div>  }  return (    <div className={cn("flex items-center gap-2", className)}>      <DropdownMenu>        <DropdownMenuTrigger asChild>          <Button            variant="ghost"            size="sm"            className="data-[state=open]:bg-accent -ml-3 h-8"          >            <span>{title}</span>            {column.getIsSorted() === "desc" ? (              <ArrowDown />            ) : column.getIsSorted() === "asc" ? (              <ArrowUp />            ) : (              <ChevronsUpDown />            )}          </Button>        </DropdownMenuTrigger>        <DropdownMenuContent align="start">          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>            <ArrowUp />            Asc          </DropdownMenuItem>          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>            <ArrowDown />            Desc          </DropdownMenuItem>          <DropdownMenuSeparator />          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>            <EyeOff />            Hide          </DropdownMenuItem>        </DropdownMenuContent>      </DropdownMenu>    </div>  )}
Expand
Copy
export const columns = [  {    accessorKey: "email",    header: ({ column }) => (      <DataTableColumnHeader column={column} title="Email" />    ),  },]
Pagination
Add pagination controls to your table including page size and selection count.
Expand
Copy
import { Table } from "@tanstack/react-table"import {  ChevronLeft,  ChevronRight,  ChevronsLeft,  ChevronsRight,} from "lucide-react"import { Button } from "@/registry/new-york-v4/ui/button"import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/registry/new-york-v4/ui/select"interface DataTablePaginationProps<TData> {  table: Table<TData>}export function DataTablePagination<TData>({  table,}: DataTablePaginationProps<TData>) {  return (    <div className="flex items-center justify-between px-2">      <div className="text-muted-foreground flex-1 text-sm">        {table.getFilteredSelectedRowModel().rows.length} of{" "}        {table.getFilteredRowModel().rows.length} row(s) selected.      </div>      <div className="flex items-center space-x-6 lg:space-x-8">        <div className="flex items-center space-x-2">          <p className="text-sm font-medium">Rows per page</p>          <Select            value={`${table.getState().pagination.pageSize}`}            onValueChange={(value) => {              table.setPageSize(Number(value))            }}          >            <SelectTrigger className="h-8 w-[70px]">              <SelectValue placeholder={table.getState().pagination.pageSize} />            </SelectTrigger>            <SelectContent side="top">              {[10, 20, 25, 30, 40, 50].map((pageSize) => (                <SelectItem key={pageSize} value={`${pageSize}`}>                  {pageSize}                </SelectItem>              ))}            </SelectContent>          </Select>        </div>        <div className="flex w-[100px] items-center justify-center text-sm font-medium">          Page {table.getState().pagination.pageIndex + 1} of{" "}          {table.getPageCount()}        </div>        <div className="flex items-center space-x-2">          <Button            variant="outline"            size="icon"            className="hidden size-8 lg:flex"            onClick={() => table.setPageIndex(0)}            disabled={!table.getCanPreviousPage()}          >            <span className="sr-only">Go to first page</span>            <ChevronsLeft />          </Button>          <Button            variant="outline"            size="icon"            className="size-8"            onClick={() => table.previousPage()}            disabled={!table.getCanPreviousPage()}          >            <span className="sr-only">Go to previous page</span>            <ChevronLeft />          </Button>          <Button            variant="outline"            size="icon"            className="size-8"            onClick={() => table.nextPage()}            disabled={!table.getCanNextPage()}          >            <span className="sr-only">Go to next page</span>            <ChevronRight />          </Button>          <Button            variant="outline"            size="icon"            className="hidden size-8 lg:flex"            onClick={() => table.setPageIndex(table.getPageCount() - 1)}            disabled={!table.getCanNextPage()}          >            <span className="sr-only">Go to last page</span>            <ChevronsRight />          </Button>        </div>      </div>    </div>  )}
Expand
Copy
<DataTablePagination table={table} />
Column toggle
A component to toggle column visibility.
Expand
Copy
"use client"import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"import { Table } from "@tanstack/react-table"import { Settings2 } from "lucide-react"import { Button } from "@/registry/new-york-v4/ui/button"import {  DropdownMenu,  DropdownMenuCheckboxItem,  DropdownMenuContent,  DropdownMenuLabel,  DropdownMenuSeparator,} from "@/registry/new-york-v4/ui/dropdown-menu"export function DataTableViewOptions<TData>({  table,}: {  table: Table<TData>}) {  return (    <DropdownMenu>      <DropdownMenuTrigger asChild>        <Button          variant="outline"          size="sm"          className="ml-auto hidden h-8 lg:flex"        >          <Settings2 />          View        </Button>      </DropdownMenuTrigger>      <DropdownMenuContent align="end" className="w-[150px]">        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>        <DropdownMenuSeparator />        {table          .getAllColumns()          .filter(            (column) =>              typeof column.accessorFn !== "undefined" && column.getCanHide()          )          .map((column) => {            return (              <DropdownMenuCheckboxItem                key={column.id}                className="capitalize"                checked={column.getIsVisible()}                onCheckedChange={(value) => column.toggleVisibility(!!value)}              >                {column.id}              </DropdownMenuCheckboxItem>            )          })}      </DropdownMenuContent>    </DropdownMenu>  )}
Expand
Copy
<DataTableViewOptions table={table} />
Context MenuDate Picker
On This Page
IntroductionTable of ContentsInstallationPrerequisitesProject StructureBasic TableColumn Definitions<DataTable /> componentRender the tableCell FormattingUpdate columns definitionRow ActionsUpdate columns definitionPaginationUpdate <DataTable>Add pagination controlsSortingUpdate <DataTable>Make header cell sortableFilteringUpdate <DataTable>VisibilityUpdate <DataTable>Row SelectionUpdate column definitionsUpdate <DataTable>Show selected rowsReusable ComponentsColumn headerPaginationColumn toggle
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Data Table - shadcn/ui
Jan
Date Picker
Previous
Next
A date picker component with range and presets.
PreviewCode
Select date
Installation
The Date Picker is built using a composition of the <Popover /> and the <Calendar /> components.
See installation instructions for the Popover and the Calendar components.
Usage
components/example-date-picker.tsx
Copy
"use client" import * as React from "react"import { format } from "date-fns"import { Calendar as CalendarIcon } from "lucide-react" import { cn } from "@/lib/utils"import { Button } from "@/components/ui/button"import { Calendar } from "@/components/ui/calendar"import {  Popover,  PopoverContent,  PopoverTrigger,} from "@/components/ui/popover" export function DatePickerDemo() {  const [date, setDate] = React.useState<Date>()  return (    <Popover>      <PopoverTrigger asChild>        <Button          variant="outline"          data-empty={!date}          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"        >          <CalendarIcon />          {date ? format(date, "PPP") : <span>Pick a date</span>}        </Button>      </PopoverTrigger>      <PopoverContent className="w-auto p-0">        <Calendar mode="single" selected={date} onSelect={setDate} />      </PopoverContent>    </Popover>  )}
See the React DayPicker documentation for more information.
Examples
Date of Birth Picker
PreviewCode
Select date
Picker with Input
PreviewCode
Select date
Date and Time Picker
PreviewCode
Select date
Natural Language Picker
This component uses the chrono-node library to parse natural language dates.
PreviewCode
Select date
Your post will be published on July 19, 2025.
Form
PreviewCode
Pick a date
Your date of birth is used to calculate your age.
Submit
Data TableDialog
On This Page
InstallationUsageExamplesDate of Birth PickerPicker with InputDate and Time PickerNatural Language PickerForm
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Date Picker - shadcn/ui
Jan
Dialog
Previous
Next
A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.
DocsAPI Reference
PreviewCode
Open Dialog
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add dialog
Copy
Usage
Copy
import {  Dialog,  DialogContent,  DialogDescription,  DialogHeader,  DialogTitle,  DialogTrigger,} from "@/components/ui/dialog"
Copy
<Dialog>  <DialogTrigger>Open</DialogTrigger>  <DialogContent>    <DialogHeader>      <DialogTitle>Are you absolutely sure?</DialogTitle>      <DialogDescription>        This action cannot be undone. This will permanently delete your account        and remove your data from our servers.      </DialogDescription>    </DialogHeader>  </DialogContent></Dialog>
Examples
Custom close button
PreviewCode
Share
Notes
To use the Dialog component from within a Context Menu or Dropdown Menu, you must encase the Context Menu or Dropdown Menu component in the Dialog component.
components/example-dialog-context-menu.tsx
Copy
<Dialog>  <ContextMenu>    <ContextMenuTrigger>Right click</ContextMenuTrigger>    <ContextMenuContent>      <ContextMenuItem>Open</ContextMenuItem>      <ContextMenuItem>Download</ContextMenuItem>      <DialogTrigger asChild>        <ContextMenuItem>          <span>Delete</span>        </ContextMenuItem>      </DialogTrigger>    </ContextMenuContent>  </ContextMenu>  <DialogContent>    <DialogHeader>      <DialogTitle>Are you absolutely sure?</DialogTitle>      <DialogDescription>        This action cannot be undone. Are you sure you want to permanently        delete this file from our servers?      </DialogDescription>    </DialogHeader>    <DialogFooter>      <Button type="submit">Confirm</Button>    </DialogFooter>  </DialogContent></Dialog>
Date PickerDrawer
On This Page
InstallationUsageExamplesCustom close buttonNotes
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Dialog - shadcn/ui
Jan
Drawer
Previous
Next
A drawer component for React.
Docs
PreviewCode
Open Drawer
About
Drawer is built on top of Vaul by emilkowalski_.
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add drawer
Copy
Usage
Copy
import {  Drawer,  DrawerClose,  DrawerContent,  DrawerDescription,  DrawerFooter,  DrawerHeader,  DrawerTitle,  DrawerTrigger,} from "@/components/ui/drawer"
Copy
<Drawer>  <DrawerTrigger>Open</DrawerTrigger>  <DrawerContent>    <DrawerHeader>      <DrawerTitle>Are you absolutely sure?</DrawerTitle>      <DrawerDescription>This action cannot be undone.</DrawerDescription>    </DrawerHeader>    <DrawerFooter>      <Button>Submit</Button>      <DrawerClose>        <Button variant="outline">Cancel</Button>      </DrawerClose>    </DrawerFooter>  </DrawerContent></Drawer>
Examples
Responsive Dialog
You can combine the Dialog and Drawer components to create a responsive dialog. This renders a Dialog component on desktop and a Drawer on mobile.
PreviewCode
Edit Profile
DialogDropdown Menu
On This Page
AboutInstallationUsageExamplesResponsive Dialog
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Drawer - shadcn/ui
Jan
Dropdown Menu
Previous
Next
Displays a menu to the user — such as a set of actions or functions — triggered by a button.
DocsAPI Reference
PreviewCode
Open
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add dropdown-menu
Copy
Usage
Copy
import {  DropdownMenu,  DropdownMenuContent,  DropdownMenuItem,  DropdownMenuLabel,  DropdownMenuSeparator,  DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
Copy
<DropdownMenu>  <DropdownMenuTrigger>Open</DropdownMenuTrigger>  <DropdownMenuContent>    <DropdownMenuLabel>My Account</DropdownMenuLabel>    <DropdownMenuSeparator />    <DropdownMenuItem>Profile</DropdownMenuItem>    <DropdownMenuItem>Billing</DropdownMenuItem>    <DropdownMenuItem>Team</DropdownMenuItem>    <DropdownMenuItem>Subscription</DropdownMenuItem>  </DropdownMenuContent></DropdownMenu>
Examples
Checkboxes
PreviewCode
Open
Radio Group
PreviewCode
Open
DrawerReact Hook Form
On This Page
InstallationUsageExamplesCheckboxesRadio Group
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Dropdown Menu - shadcn/ui
Jan
React Hook Form
Previous
Next
Building forms with React Hook Form and Zod.
Docs
Forms are tricky. They are one of the most common things you'll build in a web application, but also one of the most complex.
Well-designed HTML forms are:
* Well-structured and semantically correct.
* Easy to use and navigate (keyboard).
* Accessible with ARIA attributes and proper labels.
* Has support for client and server side validation.
* Well-styled and consistent with the rest of the application.
In this guide, we will take a look at building forms with react-hook-form and zod. We're going to use a <FormField> component to compose accessible forms using Radix UI components.
Features
The <Form /> component is a wrapper around the react-hook-form library. It provides a few things:
* Composable components for building forms.
* A <FormField /> component for building controlled form fields.
* Form validation using zod.
* Handles accessibility and error messages.
* Uses React.useId() for generating unique IDs.
* Applies the correct aria attributes to form fields based on states.
* Built to work with all Radix UI components.
* Bring your own schema library. We use zod but you can use anything you want.
* You have full control over the markup and styling.
Anatomy
Copy
<Form>  <FormField    control={...}    name="..."    render={() => (      <FormItem>        <FormLabel />        <FormControl>          { /* Your form field */}        </FormControl>        <FormDescription />        <FormMessage />      </FormItem>    )}  /></Form>
Example
Copy
const form = useForm() <FormField  control={form.control}  name="username"  render={({ field }) => (    <FormItem>      <FormLabel>Username</FormLabel>      <FormControl>        <Input placeholder="shadcn" {...field} />      </FormControl>      <FormDescription>This is your public display name.</FormDescription>      <FormMessage />    </FormItem>  )}/>
Installation
CLIManual
Command
pnpmnpmyarnbun
pnpm dlx shadcn@latest add form
Copy
Usage
Create a form schema
Define the shape of your form using a Zod schema. You can read more about using Zod in the Zod documentation.
components/example-form.tsx
Copy
"use client" import { z } from "zod" const formSchema = z.object({  username: z.string().min(2).max(50),})
Define a form
Use the useForm hook from react-hook-form to create a form.
components/example-form.tsx
Copy
"use client" import { zodResolver } from "@hookform/resolvers/zod"import { useForm } from "react-hook-form"import { z } from "zod" const formSchema = z.object({  username: z.string().min(2, {    message: "Username must be at least 2 characters.",  }),}) export function ProfileForm() {  // 1. Define your form.  const form = useForm<z.infer<typeof formSchema>>({    resolver: zodResolver(formSchema),    defaultValues: {      username: "",    },  })  // 2. Define a submit handler.  function onSubmit(values: z.infer<typeof formSchema>) {    // Do something with the form values.    // ✅ This will be type-safe and validated.    console.log(values)  }}
Since FormField is using a controlled component, you need to provide a default value for the field. See the React Hook Form docs to learn more about controlled components.
Build your form
We can now use the <Form /> components to build our form.
components/example-form.tsx
Copy
"use client" import { zodResolver } from "@hookform/resolvers/zod"import { useForm } from "react-hook-form"import { z } from "zod" import { Button } from "@/components/ui/button"import {  Form,  FormControl,  FormDescription,  FormField,  FormItem,  FormLabel,  FormMessage,} from "@/components/ui/form"import { Input } from "@/components/ui/input" const formSchema = z.object({  username: z.string().min(2, {    message: "Username must be at least 2 characters.",  }),}) export function ProfileForm() {  // ...  return (    <Form {...form}>      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">        <FormField          control={form.control}          name="username"          render={({ field }) => (            <FormItem>              <FormLabel>Username</FormLabel>              <FormControl>                <Input placeholder="shadcn" {...field} />              </FormControl>              <FormDescription>                This is your public display name.              </FormDescription>              <FormMessage />            </FormItem>          )}        />        <Button type="submit">Submit</Button>      </form>    </Form>  )}
Done
That's it. You now have a fully accessible form that is type-safe with client-side validation.
Examples
See the following links for more examples on how to use the <Form /> component with other components:
* Checkbox
* Date Picker
* Input
* Radio Group
* Select
* Switch
* Textarea
* Combobox
Dropdown MenuHover Card
On This Page
FeaturesAnatomyExampleInstallationCommandUsageCreate a form schemaDefine a formBuild your formDoneExamples
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
React Hook Form - shadcn/ui
Jan
Hover Card
Previous
Next
For sighted users to preview content available behind a link.
DocsAPI Reference
PreviewCode
@nextjs
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add hover-card
Copy
Usage
Copy
import {  HoverCard,  HoverCardContent,  HoverCardTrigger,} from "@/components/ui/hover-card"
Copy
<HoverCard>  <HoverCardTrigger>Hover</HoverCardTrigger>  <HoverCardContent>    The React Framework – created and maintained by @vercel.  </HoverCardContent></HoverCard>
React Hook FormInput
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Hover Card - shadcn/ui
Jan
Input
Previous
Next
Displays a form input field or a component that looks like an input field.
PreviewCode
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add input
Copy
Usage
Copy
import { Input } from "@/components/ui/input"
Copy
<Input />
Examples
Default
PreviewCode
File
PreviewCode
Disabled
PreviewCode
With Label
PreviewCode
With Button
PreviewCode
Subscribe
Form
PreviewCode
This is your public display name.
Submit
Hover CardInput OTP
On This Page
InstallationUsageExamplesDefaultFileDisabledWith LabelWith ButtonForm
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Input - shadcn/ui
Jan
Input OTP
Previous
Next
Accessible one-time password component with copy paste functionality.
Docs
PreviewCode
About
Input OTP is built on top of input-otp by @guilherme_rodz.
Installation
CLIManual
Run the following command:
pnpmnpmyarnbun
pnpm dlx shadcn@latest add input-otp
Copy
Usage
Copy
import {  InputOTP,  InputOTPGroup,  InputOTPSeparator,  InputOTPSlot,} from "@/components/ui/input-otp"
Copy
<InputOTP maxLength={6}>  <InputOTPGroup>    <InputOTPSlot index={0} />    <InputOTPSlot index={1} />    <InputOTPSlot index={2} />  </InputOTPGroup>  <InputOTPSeparator />  <InputOTPGroup>    <InputOTPSlot index={3} />    <InputOTPSlot index={4} />    <InputOTPSlot index={5} />  </InputOTPGroup></InputOTP>
Examples
Pattern
Use the pattern prop to define a custom pattern for the OTP input.
PreviewCode
Copy
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp" ... <InputOTP  maxLength={6}  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>  <InputOTPGroup>    <InputOTPSlot index={0} />    {/* ... */}  </InputOTPGroup></InputOTP>
Separator
You can use the <InputOTPSeparator /> component to add a separator between the input groups.
PreviewCode
Copy
import {  InputOTP,  InputOTPGroup,  InputOTPSeparator,  InputOTPSlot,} from "@/components/ui/input-otp" ... <InputOTP maxLength={4}>  <InputOTPGroup>    <InputOTPSlot index={0} />    <InputOTPSlot index={1} />  </InputOTPGroup>  <InputOTPSeparator />  <InputOTPGroup>    <InputOTPSlot index={2} />    <InputOTPSlot index={3} />  </InputOTPGroup></InputOTP>
Controlled
You can use the value and onChange props to control the input value.
PreviewCode
Enter your one-time password.
Form
PreviewCode
Please enter the one-time password sent to your phone.
Submit
Changelog
2024-03-19 Composition
We've made some updates and replaced the render props pattern with composition. Here's how to update your code if you prefer the composition pattern.
Note: You are not required to update your code if you are using the render prop. It is still supported.
Update to the latest version of input-otp.
pnpmnpmyarnbun
pnpm add input-otp@latest
Copy
Update input-otp.tsx
input-otp.tsx
Copy
- import { OTPInput, SlotProps } from "input-otp"+ import { OTPInput, OTPInputContext } from "input-otp" const InputOTPSlot = React.forwardRef<   React.ElementRef<"div">,-   SlotProps & React.ComponentPropsWithoutRef<"div">-  >(({ char, hasFakeCaret, isActive, className, ...props }, ref) => {+   React.ComponentPropsWithoutRef<"div"> & { index: number }+  >(({ index, className, ...props }, ref) => {+   const inputOTPContext = React.useContext(OTPInputContext)+   const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]
Then replace the render prop in your code.
Copy
<InputOTP maxLength={6}>  <InputOTPGroup>    <InputOTPSlot index={0} />    <InputOTPSlot index={1} />    <InputOTPSlot index={2} />  </InputOTPGroup>  <InputOTPSeparator />  <InputOTPGroup>    <InputOTPSlot index={3} />    <InputOTPSlot index={4} />    <InputOTPSlot index={5} />  </InputOTPGroup></InputOTP>
2024-03-19 Disabled
To add a disabled state to the input, update <InputOTP /> as follows:
input-otp.tsx
Copy
const InputOTP = React.forwardRef<  React.ElementRef<typeof OTPInput>,  React.ComponentPropsWithoutRef<typeof OTPInput>>(({ className, containerClassName, ...props }, ref) => (  <OTPInput    ref={ref}    containerClassName={cn(      "flex items-center gap-2 has-[:disabled]:opacity-50",      containerClassName    )}    className={cn("disabled:cursor-not-allowed", className)}    {...props}  />))InputOTP.displayName = "InputOTP"
InputLabel
On This Page
AboutInstallationUsageExamplesPatternSeparatorControlledFormChangelog2024-03-19 Composition2024-03-19 Disabled
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Input OTP - shadcn/ui
Jan
Label
Previous
Next
Renders an accessible label associated with controls.
DocsAPI Reference
PreviewCode
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add label
Copy
Usage
Copy
import { Label } from "@/components/ui/label"
Copy
<Label htmlFor="email">Your email address</Label>
Input OTPMenubar
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Label - shadcn/ui
Jan
Menubar
Previous
Next
A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.
DocsAPI Reference
PreviewCode
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add menubar
Copy
Usage
Copy
import {  Menubar,  MenubarContent,  MenubarItem,  MenubarMenu,  MenubarSeparator,  MenubarShortcut,  MenubarTrigger,} from "@/components/ui/menubar"
Copy
<Menubar>  <MenubarMenu>    <MenubarTrigger>File</MenubarTrigger>    <MenubarContent>      <MenubarItem>        New Tab <MenubarShortcut>⌘T</MenubarShortcut>      </MenubarItem>      <MenubarItem>New Window</MenubarItem>      <MenubarSeparator />      <MenubarItem>Share</MenubarItem>      <MenubarSeparator />      <MenubarItem>Print</MenubarItem>    </MenubarContent>  </MenubarMenu></Menubar>
LabelNavigation Menu
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Menubar - shadcn/ui
Jan
Navigation Menu
Previous
Next
A collection of links for navigating websites.
DocsAPI Reference
PreviewCode
* Home
* Components
* Docs
* List
* Simple
* With Icon
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add navigation-menu
Copy
Usage
Copy
import {  NavigationMenu,  NavigationMenuContent,  NavigationMenuIndicator,  NavigationMenuItem,  NavigationMenuLink,  NavigationMenuList,  NavigationMenuTrigger,  NavigationMenuViewport,} from "@/components/ui/navigation-menu"
Copy
<NavigationMenu>  <NavigationMenuList>    <NavigationMenuItem>      <NavigationMenuTrigger>Item One</NavigationMenuTrigger>      <NavigationMenuContent>        <NavigationMenuLink>Link</NavigationMenuLink>      </NavigationMenuContent>    </NavigationMenuItem>  </NavigationMenuList></NavigationMenu>
Link
You can use the asChild prop to make another component look like a navigation menu trigger. Here's an example of a link that looks like a navigation menu trigger.
components/example-navigation-menu.tsx
Copy
import { Link } from "next/link" export function NavigationMenuDemo() {  return (    <NavigationMenuItem>      <NavigationMenuLink asChild>        <Link href="/docs">Documentation</Link>      </NavigationMenuLink>    </NavigationMenuItem>  )}
MenubarPagination
On This Page
InstallationUsageLink
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Navigation Menu - shadcn/ui
Jan
Pagination
Previous
Next
Pagination with page navigation, next and previous links.
PreviewCode
* Previous
* * 1
* 2
* 3
* More pages
* Next
* Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add pagination
Copy
Usage
Copy
import {  Pagination,  PaginationContent,  PaginationEllipsis,  PaginationItem,  PaginationLink,  PaginationNext,  PaginationPrevious,} from "@/components/ui/pagination"
Copy
<Pagination>  <PaginationContent>    <PaginationItem>      <PaginationPrevious href="#" />    </PaginationItem>    <PaginationItem>      <PaginationLink href="#">1</PaginationLink>    </PaginationItem>    <PaginationItem>      <PaginationEllipsis />    </PaginationItem>    <PaginationItem>      <PaginationNext href="#" />    </PaginationItem>  </PaginationContent></Pagination>
Next.js
By default the <PaginationLink /> component will render an <a /> tag.
To use the Next.js <Link /> component, make the following updates to pagination.tsx.
Copy
+ import Link from "next/link" - type PaginationLinkProps = ... & React.ComponentProps<"a">+ type PaginationLinkProps = ... & React.ComponentProps<typeof Link> const PaginationLink = ({...props }: ) => (  <PaginationItem>-   <a>+   <Link>      // ...-   </a>+   </Link>  </PaginationItem>)
Note: We are making updates to the cli to automatically do this for you.
Navigation MenuPopover
On This Page
InstallationUsageNext.js
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Pagination - shadcn/ui
Jan
Popover
Previous
Next
Displays rich content in a portal, triggered by a button.
DocsAPI Reference
PreviewCode
Open popover
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add popover
Copy
Usage
Copy
import {  Popover,  PopoverContent,  PopoverTrigger,} from "@/components/ui/popover"
Copy
<Popover>  <PopoverTrigger>Open</PopoverTrigger>  <PopoverContent>Place content for the popover here.</PopoverContent></Popover>
PaginationProgress
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Popover - shadcn/ui
Jan
Progress
Previous
Next
Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.
DocsAPI Reference
PreviewCode
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add progress
Copy
Usage
Copy
import { Progress } from "@/components/ui/progress"
Copy
<Progress value={33} />
PopoverRadio Group
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Progress - shadcn/ui
Jan
Radio Group
Previous
Next
A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.
DocsAPI Reference
PreviewCode
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add radio-group
Copy
Usage
Copy
import { Label } from "@/components/ui/label"import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
Copy
<RadioGroup defaultValue="option-one">  <div className="flex items-center space-x-2">    <RadioGroupItem value="option-one" id="option-one" />    <Label htmlFor="option-one">Option One</Label>  </div>  <div className="flex items-center space-x-2">    <RadioGroupItem value="option-two" id="option-two" />    <Label htmlFor="option-two">Option Two</Label>  </div></RadioGroup>
Examples
Form
PreviewCode
Submit
ProgressResizable
On This Page
InstallationUsageExamplesForm
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Radio Group - shadcn/ui
Jan
Resizable
Previous
Next
Accessible resizable panel groups and layouts with keyboard support.
DocsAPI Reference
PreviewCode
One
Two
Three
About
The Resizable component is built on top of react-resizable-panels by bvaughn.
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add resizable
Copy
Usage
Copy
import {  ResizableHandle,  ResizablePanel,  ResizablePanelGroup,} from "@/components/ui/resizable"
Copy
<ResizablePanelGroup direction="horizontal">  <ResizablePanel>One</ResizablePanel>  <ResizableHandle />  <ResizablePanel>Two</ResizablePanel></ResizablePanelGroup>
Examples
Vertical
Use the direction prop to set the direction of the resizable panels.
PreviewCode
Header
Content
Copy
import {  ResizableHandle,  ResizablePanel,  ResizablePanelGroup,} from "@/components/ui/resizable" export default function Example() {  return (    <ResizablePanelGroup direction="vertical">      <ResizablePanel>One</ResizablePanel>      <ResizableHandle />      <ResizablePanel>Two</ResizablePanel>    </ResizablePanelGroup>  )}
Handle
You can set or hide the handle by using the withHandle prop on the ResizableHandle component.
PreviewCode
Sidebar
Content
Copy
import {  ResizableHandle,  ResizablePanel,  ResizablePanelGroup,} from "@/components/ui/resizable" export default function Example() {  return (    <ResizablePanelGroup direction="horizontal">      <ResizablePanel>One</ResizablePanel>      <ResizableHandle withHandle />      <ResizablePanel>Two</ResizablePanel>    </ResizablePanelGroup>  )}
Radio GroupScroll-area
On This Page
AboutInstallationUsageExamplesVerticalHandle
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Resizable - shadcn/ui
Jan
Scroll-area
Previous
Next
Augments native scroll functionality for custom, cross-browser styling.
DocsAPI Reference
PreviewCode
Tags
v1.2.0-beta.50
v1.2.0-beta.49
v1.2.0-beta.48
v1.2.0-beta.47
v1.2.0-beta.46
v1.2.0-beta.45
v1.2.0-beta.44
v1.2.0-beta.43
v1.2.0-beta.42
v1.2.0-beta.41
v1.2.0-beta.40
v1.2.0-beta.39
v1.2.0-beta.38
v1.2.0-beta.37
v1.2.0-beta.36
v1.2.0-beta.35
v1.2.0-beta.34
v1.2.0-beta.33
v1.2.0-beta.32
v1.2.0-beta.31
v1.2.0-beta.30
v1.2.0-beta.29
v1.2.0-beta.28
v1.2.0-beta.27
v1.2.0-beta.26
v1.2.0-beta.25
v1.2.0-beta.24
v1.2.0-beta.23
v1.2.0-beta.22
v1.2.0-beta.21
v1.2.0-beta.20
v1.2.0-beta.19
v1.2.0-beta.18
v1.2.0-beta.17
v1.2.0-beta.16
v1.2.0-beta.15
v1.2.0-beta.14
v1.2.0-beta.13
v1.2.0-beta.12
v1.2.0-beta.11
v1.2.0-beta.10
v1.2.0-beta.9
v1.2.0-beta.8
v1.2.0-beta.7
v1.2.0-beta.6
v1.2.0-beta.5
v1.2.0-beta.4
v1.2.0-beta.3
v1.2.0-beta.2
v1.2.0-beta.1
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add scroll-area
Copy
Usage
Copy
import { ScrollArea } from "@/components/ui/scroll-area"
Copy
<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">  Jokester began sneaking into the castle in the middle of the night and leaving  jokes all over the place: under the king's pillow, in his soup, even in the  royal toilet. The king was furious, but he couldn't seem to stop Jokester. And  then, one day, the people of the kingdom discovered that the jokes left by  Jokester were so funny that they couldn't help but laugh. And once they  started laughing, they couldn't stop.</ScrollArea>
Examples
Horizontal Scrolling
PreviewCode
 Photo by Ornella Binni 

Photo by Ornella Binni
 Photo by Tom Byrom 

Photo by Tom Byrom
 Photo by Vladimir Malyavko 

Photo by Vladimir Malyavko
ResizableSelect
On This Page
InstallationUsageExamplesHorizontal Scrolling
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Scroll-area - shadcn/ui
Jan
Select
Previous
Next
Displays a list of options for the user to pick from—triggered by a button.
DocsAPI Reference
PreviewCode
Select a fruit
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add select
Copy
Usage
Copy
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select"
Copy
<Select>  <SelectTrigger className="w-[180px]">    <SelectValue placeholder="Theme" />  </SelectTrigger>  <SelectContent>    <SelectItem value="light">Light</SelectItem>    <SelectItem value="dark">Dark</SelectItem>    <SelectItem value="system">System</SelectItem>  </SelectContent></Select>
Examples
Scrollable
PreviewCode
Select a timezone
Form
PreviewCode
Select a verified email to display
m@example.comm@google.comm@support.com
You can manage email addresses in your email settings.
Submit
Scroll-areaSeparator
On This Page
InstallationUsageExamplesScrollableForm
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Select - shadcn/ui
Jan
Separator
Previous
Next
Visually or semantically separates content.
DocsAPI Reference
PreviewCode
Radix Primitives
An open-source UI component library.
Blog
Docs
Source
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add separator
Copy
Usage
Copy
import { Separator } from "@/components/ui/separator"
Copy
<Separator />
SelectSheet
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Separator - shadcn/ui
Jan
Sheet
Previous
Next
Extends the Dialog component to display content that complements the main content of the screen.
DocsAPI Reference
PreviewCode
Open
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add sheet
Copy
Usage
Copy
import {  Sheet,  SheetContent,  SheetDescription,  SheetHeader,  SheetTitle,  SheetTrigger,} from "@/components/ui/sheet"
Copy
<Sheet>  <SheetTrigger>Open</SheetTrigger>  <SheetContent>    <SheetHeader>      <SheetTitle>Are you absolutely sure?</SheetTitle>      <SheetDescription>        This action cannot be undone. This will permanently delete your account        and remove your data from our servers.      </SheetDescription>    </SheetHeader>  </SheetContent></Sheet>
Examples
Side
Use the side property to <SheetContent /> to indicate the edge of the screen where the component will appear. The values can be top, right, bottom or left.
Size
You can adjust the size of the sheet using CSS classes:
Copy
<Sheet>  <SheetTrigger>Open</SheetTrigger>  <SheetContent className="w-[400px] sm:w-[540px]">    <SheetHeader>      <SheetTitle>Are you absolutely sure?</SheetTitle>      <SheetDescription>        This action cannot be undone. This will permanently delete your account        and remove your data from our servers.      </SheetDescription>    </SheetHeader>  </SheetContent></Sheet>
SeparatorSidebar
On This Page
InstallationUsageExamplesSideSize
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Sheet - shadcn/ui
Jan
Sidebar
Previous
Next
A composable, themeable and customizable sidebar component.
A sidebar that collapses to icons.
Sidebars are one of the most complex components to build. They are central to any application and often contain a lot of moving parts.
I don't like building sidebars. So I built 30+ of them. All kinds of configurations. Then I extracted the core components into sidebar.tsx.
We now have a solid foundation to build on top of. Composable. Themeable. Customizable.
Browse the Blocks Library.
Installation
CLIManual
Run the following command to install sidebar.tsx
pnpmnpmyarnbun
pnpm dlx shadcn@latest add sidebar
Copy
Add the following colors to your CSS file
The command above should install the colors for you. If not, copy and paste the following in your CSS file.
We'll go over the colors later in the theming section.
app/globals.css
Copy
@layer base {  :root {    --sidebar: oklch(0.985 0 0);    --sidebar-foreground: oklch(0.145 0 0);    --sidebar-primary: oklch(0.205 0 0);    --sidebar-primary-foreground: oklch(0.985 0 0);    --sidebar-accent: oklch(0.97 0 0);    --sidebar-accent-foreground: oklch(0.205 0 0);    --sidebar-border: oklch(0.922 0 0);    --sidebar-ring: oklch(0.708 0 0);  }  .dark {    --sidebar: oklch(0.205 0 0);    --sidebar-foreground: oklch(0.985 0 0);    --sidebar-primary: oklch(0.488 0.243 264.376);    --sidebar-primary-foreground: oklch(0.985 0 0);    --sidebar-accent: oklch(0.269 0 0);    --sidebar-accent-foreground: oklch(0.985 0 0);    --sidebar-border: oklch(1 0 0 / 10%);    --sidebar-ring: oklch(0.439 0 0);  }}
Structure
A Sidebar component is composed of the following parts:
* SidebarProvider - Handles collapsible state.
* Sidebar - The sidebar container.
* SidebarHeader and SidebarFooter - Sticky at the top and bottom of the sidebar.
* SidebarContent - Scrollable content.
* SidebarGroup - Section within the SidebarContent.
* SidebarTrigger - Trigger for the Sidebar.
 Sidebar Structure 

Usage
app/layout.tsx
Copy
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"import { AppSidebar } from "@/components/app-sidebar" export default function Layout({ children }: { children: React.ReactNode }) {  return (    <SidebarProvider>      <AppSidebar />      <main>        <SidebarTrigger />        {children}      </main>    </SidebarProvider>  )}
components/app-sidebar.tsx
Copy
import {  Sidebar,  SidebarContent,  SidebarFooter,  SidebarGroup,  SidebarHeader,} from "@/components/ui/sidebar" export function AppSidebar() {  return (    <Sidebar>      <SidebarHeader />      <SidebarContent>        <SidebarGroup />        <SidebarGroup />      </SidebarContent>      <SidebarFooter />    </Sidebar>  )}
Your First Sidebar
Let's start with the most basic sidebar. A collapsible sidebar with a menu.
Add a SidebarProvider and SidebarTrigger at the root of your application.
app/layout.tsx
Copy
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"import { AppSidebar } from "@/components/app-sidebar" export default function Layout({ children }: { children: React.ReactNode }) {  return (    <SidebarProvider>      <AppSidebar />      <main>        <SidebarTrigger />        {children}      </main>    </SidebarProvider>  )}
Create a new sidebar component at components/app-sidebar.tsx.
components/app-sidebar.tsx
Copy
import { Sidebar, SidebarContent } from "@/components/ui/sidebar" export function AppSidebar() {  return (    <Sidebar>      <SidebarContent />    </Sidebar>  )}
Now, let's add a SidebarMenu to the sidebar.
We'll use the SidebarMenu component in a SidebarGroup.
components/app-sidebar.tsx
Copy
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react" import {  Sidebar,  SidebarContent,  SidebarGroup,  SidebarGroupContent,  SidebarGroupLabel,  SidebarMenu,  SidebarMenuButton,  SidebarMenuItem,} from "@/components/ui/sidebar" // Menu items.const items = [  {    title: "Home",    url: "#",    icon: Home,  },  {    title: "Inbox",    url: "#",    icon: Inbox,  },  {    title: "Calendar",    url: "#",    icon: Calendar,  },  {    title: "Search",    url: "#",    icon: Search,  },  {    title: "Settings",    url: "#",    icon: Settings,  },] export function AppSidebar() {  return (    <Sidebar>      <SidebarContent>        <SidebarGroup>          <SidebarGroupLabel>Application</SidebarGroupLabel>          <SidebarGroupContent>            <SidebarMenu>              {items.map((item) => (                <SidebarMenuItem key={item.title}>                  <SidebarMenuButton asChild>                    <a href={item.url}>                      <item.icon />                      <span>{item.title}</span>                    </a>                  </SidebarMenuButton>                </SidebarMenuItem>              ))}            </SidebarMenu>          </SidebarGroupContent>        </SidebarGroup>      </SidebarContent>    </Sidebar>  )}
You've created your first sidebar.
You should see something like this:
Your first sidebar.
Components
The components in sidebar.tsx are built to be composable i.e you build your sidebar by putting the provided components together. They also compose well with other shadcn/ui components such as DropdownMenu, Collapsible or Dialog etc.
If you need to change the code in sidebar.tsx, you are encouraged to do so. The code is yours. Use sidebar.tsx as a starting point and build your own.
In the next sections, we'll go over each component and how to use them.
SidebarProvider
The SidebarProvider component is used to provide the sidebar context to the Sidebar component. You should always wrap your application in a SidebarProvider component.
Props
Name
	Type
	Description
	defaultOpen
	boolean
	Default open state of the sidebar.
	open
	boolean
	Open state of the sidebar (controlled).
	onOpenChange
	(open: boolean) => void
	Sets open state of the sidebar (controlled).
	Width
If you have a single sidebar in your application, you can use the SIDEBAR_WIDTH and SIDEBAR_WIDTH_MOBILE variables in sidebar.tsx to set the width of the sidebar.
components/ui/sidebar.tsx
Copy
const SIDEBAR_WIDTH = "16rem"const SIDEBAR_WIDTH_MOBILE = "18rem"
For multiple sidebars in your application, you can use the style prop to set the width of the sidebar.
To set the width of the sidebar, you can use the --sidebar-width and --sidebar-width-mobile CSS variables in the style prop.
components/ui/sidebar.tsx
Copy
<SidebarProvider  style={{    "--sidebar-width": "20rem",    "--sidebar-width-mobile": "20rem",  }}>  <Sidebar /></SidebarProvider>
This will handle the width of the sidebar but also the layout spacing.
Keyboard Shortcut
The SIDEBAR_KEYBOARD_SHORTCUT variable is used to set the keyboard shortcut used to open and close the sidebar.
To trigger the sidebar, you use the cmd+b keyboard shortcut on Mac and ctrl+b on Windows.
You can change the keyboard shortcut by updating the SIDEBAR_KEYBOARD_SHORTCUT variable.
components/ui/sidebar.tsx
Copy
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
Persisted State
The SidebarProvider supports persisting the sidebar state across page reloads and server-side rendering. It uses cookies to store the current state of the sidebar. When the sidebar state changes, a default cookie named sidebar_state is set with the current open/closed state. This cookie is then read on subsequent page loads to restore the sidebar state.
To persist sidebar state in Next.js, set up your SidebarProvider in app/layout.tsx like this:
app/layout.tsx
Copy
import { cookies } from "next/headers" import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"import { AppSidebar } from "@/components/app-sidebar" export async function Layout({ children }: { children: React.ReactNode }) {  const cookieStore = await cookies()  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"  return (    <SidebarProvider defaultOpen={defaultOpen}>      <AppSidebar />      <main>        <SidebarTrigger />        {children}      </main>    </SidebarProvider>  )}
You can change the name of the cookie by updating the SIDEBAR_COOKIE_NAME variable in sidebar.tsx.
components/ui/sidebar.tsx
Copy
const SIDEBAR_COOKIE_NAME = "sidebar_state"
Sidebar
The main Sidebar component used to render a collapsible sidebar.
Copy
import { Sidebar } from "@/components/ui/sidebar" export function AppSidebar() {  return <Sidebar />}
Props
Property
	Type
	Description
	side
	left or right
	The side of the sidebar.
	variant
	sidebar, floating, or inset
	The variant of the sidebar.
	collapsible
	offcanvas, icon, or none
	Collapsible state of the sidebar.
	side
Use the side prop to change the side of the sidebar.
Available options are left and right.
Copy
import { Sidebar } from "@/components/ui/sidebar" export function AppSidebar() {  return <Sidebar side="left | right" />}
variant
Use the variant prop to change the variant of the sidebar.
Available options are sidebar, floating and inset.
Copy
import { Sidebar } from "@/components/ui/sidebar" export function AppSidebar() {  return <Sidebar variant="sidebar | floating | inset" />}
Note: If you use the inset variant, remember to wrap your main content in a SidebarInset component.
Copy
<SidebarProvider>  <Sidebar variant="inset" />  <SidebarInset>    <main>{children}</main>  </SidebarInset></SidebarProvider>
collapsible
Use the collapsible prop to make the sidebar collapsible.
Available options are offcanvas, icon and none.
Copy
import { Sidebar } from "@/components/ui/sidebar" export function AppSidebar() {  return <Sidebar collapsible="offcanvas | icon | none" />}
Prop
	Description
	offcanvas
	A collapsible sidebar that slides in from the left or right.
	icon
	A sidebar that collapses to icons.
	none
	A non-collapsible sidebar.
	useSidebar
The useSidebar hook is used to control the sidebar.
Copy
import { useSidebar } from "@/components/ui/sidebar" export function AppSidebar() {  const {    state,    open,    setOpen,    openMobile,    setOpenMobile,    isMobile,    toggleSidebar,  } = useSidebar()}
Property
	Type
	Description
	state
	expanded or collapsed
	The current state of the sidebar.
	open
	boolean
	Whether the sidebar is open.
	setOpen
	(open: boolean) => void
	Sets the open state of the sidebar.
	openMobile
	boolean
	Whether the sidebar is open on mobile.
	setOpenMobile
	(open: boolean) => void
	Sets the open state of the sidebar on mobile.
	isMobile
	boolean
	Whether the sidebar is on mobile.
	toggleSidebar
	() => void
	Toggles the sidebar. Desktop and mobile.
	SidebarHeader
Use the SidebarHeader component to add a sticky header to the sidebar.
The following example adds a <DropdownMenu> to the SidebarHeader.
A sidebar header with a dropdown menu.
components/app-sidebar.tsx
Copy
<Sidebar>  <SidebarHeader>    <SidebarMenu>      <SidebarMenuItem>        <DropdownMenu>          <DropdownMenuTrigger asChild>            <SidebarMenuButton>              Select Workspace              <ChevronDown className="ml-auto" />            </SidebarMenuButton>          </DropdownMenuTrigger>          <DropdownMenuContent className="w-[--radix-popper-anchor-width]">            <DropdownMenuItem>              <span>Acme Inc</span>            </DropdownMenuItem>            <DropdownMenuItem>              <span>Acme Corp.</span>            </DropdownMenuItem>          </DropdownMenuContent>        </DropdownMenu>      </SidebarMenuItem>    </SidebarMenu>  </SidebarHeader></Sidebar>
SidebarFooter
Use the SidebarFooter component to add a sticky footer to the sidebar.
The following example adds a <DropdownMenu> to the SidebarFooter.
A sidebar footer with a dropdown menu.
components/app-sidebar.tsx
Copy
export function AppSidebar() {  return (    <SidebarProvider>      <Sidebar>        <SidebarHeader />        <SidebarContent />        <SidebarFooter>          <SidebarMenu>            <SidebarMenuItem>              <DropdownMenu>                <DropdownMenuTrigger asChild>                  <SidebarMenuButton>                    <User2 /> Username                    <ChevronUp className="ml-auto" />                  </SidebarMenuButton>                </DropdownMenuTrigger>                <DropdownMenuContent                  side="top"                  className="w-[--radix-popper-anchor-width]"                >                  <DropdownMenuItem>                    <span>Account</span>                  </DropdownMenuItem>                  <DropdownMenuItem>                    <span>Billing</span>                  </DropdownMenuItem>                  <DropdownMenuItem>                    <span>Sign out</span>                  </DropdownMenuItem>                </DropdownMenuContent>              </DropdownMenu>            </SidebarMenuItem>          </SidebarMenu>        </SidebarFooter>      </Sidebar>    </SidebarProvider>  )}
SidebarContent
The SidebarContent component is used to wrap the content of the sidebar. This is where you add your SidebarGroup components. It is scrollable.
Copy
import { Sidebar, SidebarContent } from "@/components/ui/sidebar" export function AppSidebar() {  return (    <Sidebar>      <SidebarContent>        <SidebarGroup />        <SidebarGroup />      </SidebarContent>    </Sidebar>  )}
SidebarGroup
Use the SidebarGroup component to create a section within the sidebar.
A SidebarGroup has a SidebarGroupLabel, a SidebarGroupContent and an optional SidebarGroupAction.
A sidebar group.
Copy
import { Sidebar, SidebarContent, SidebarGroup } from "@/components/ui/sidebar" export function AppSidebar() {  return (    <Sidebar>      <SidebarContent>        <SidebarGroup>          <SidebarGroupLabel>Application</SidebarGroupLabel>          <SidebarGroupAction>            <Plus /> <span className="sr-only">Add Project</span>          </SidebarGroupAction>          <SidebarGroupContent></SidebarGroupContent>        </SidebarGroup>      </SidebarContent>    </Sidebar>  )}
Collapsible SidebarGroup
To make a SidebarGroup collapsible, wrap it in a Collapsible.
A collapsible sidebar group.
Copy
export function AppSidebar() {  return (    <Collapsible defaultOpen className="group/collapsible">      <SidebarGroup>        <SidebarGroupLabel asChild>          <CollapsibleTrigger>            Help            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />          </CollapsibleTrigger>        </SidebarGroupLabel>        <CollapsibleContent>          <SidebarGroupContent />        </CollapsibleContent>      </SidebarGroup>    </Collapsible>  )}
Note: We wrap the CollapsibleTrigger in a SidebarGroupLabel to render a button.
SidebarGroupAction
Use the SidebarGroupAction component to add an action button to the SidebarGroup.
A sidebar group with an action button.
Copy
export function AppSidebar() {  return (    <SidebarGroup>      <SidebarGroupLabel asChild>Projects</SidebarGroupLabel>      <SidebarGroupAction title="Add Project">        <Plus /> <span className="sr-only">Add Project</span>      </SidebarGroupAction>      <SidebarGroupContent />    </SidebarGroup>  )}
SidebarMenu
The SidebarMenu component is used for building a menu within a SidebarGroup.
A SidebarMenu component is composed of SidebarMenuItem, SidebarMenuButton, <SidebarMenuAction /> and <SidebarMenuSub /> components.
 Sidebar Menu 

Here's an example of a SidebarMenu component rendering a list of projects.
A sidebar menu with a list of projects.
Copy
<Sidebar>  <SidebarContent>    <SidebarGroup>      <SidebarGroupLabel>Projects</SidebarGroupLabel>      <SidebarGroupContent>        <SidebarMenu>          {projects.map((project) => (            <SidebarMenuItem key={project.name}>              <SidebarMenuButton asChild>                <a href={project.url}>                  <project.icon />                  <span>{project.name}</span>                </a>              </SidebarMenuButton>            </SidebarMenuItem>          ))}        </SidebarMenu>      </SidebarGroupContent>    </SidebarGroup>  </SidebarContent></Sidebar>
SidebarMenuButton
The SidebarMenuButton component is used to render a menu button within a SidebarMenuItem.
Link or Anchor
By default, the SidebarMenuButton renders a button but you can use the asChild prop to render a different component such as a Link or an a tag.
Copy
<SidebarMenuButton asChild>  <a href="#">Home</a></SidebarMenuButton>
Icon and Label
You can render an icon and a truncated label inside the button. Remember to wrap the label in a <span>.
Copy
<SidebarMenuButton asChild>  <a href="#">    <Home />    <span>Home</span>  </a></SidebarMenuButton>
isActive
Use the isActive prop to mark a menu item as active.
Copy
<SidebarMenuButton asChild isActive>  <a href="#">Home</a></SidebarMenuButton>
SidebarMenuAction
The SidebarMenuAction component is used to render a menu action within a SidebarMenuItem.
This button works independently of the SidebarMenuButton i.e you can have the <SidebarMenuButton /> as a clickable link and the <SidebarMenuAction /> as a button.
Copy
<SidebarMenuItem>  <SidebarMenuButton asChild>    <a href="#">      <Home />      <span>Home</span>    </a>  </SidebarMenuButton>  <SidebarMenuAction>    <Plus /> <span className="sr-only">Add Project</span>  </SidebarMenuAction></SidebarMenuItem>
DropdownMenu
Here's an example of a SidebarMenuAction component rendering a DropdownMenu.
A sidebar menu action with a dropdown menu.
Copy
<SidebarMenuItem>  <SidebarMenuButton asChild>    <a href="#">      <Home />      <span>Home</span>    </a>  </SidebarMenuButton>  <DropdownMenu>    <DropdownMenuTrigger asChild>      <SidebarMenuAction>        <MoreHorizontal />      </SidebarMenuAction>    </DropdownMenuTrigger>    <DropdownMenuContent side="right" align="start">      <DropdownMenuItem>        <span>Edit Project</span>      </DropdownMenuItem>      <DropdownMenuItem>        <span>Delete Project</span>      </DropdownMenuItem>    </DropdownMenuContent>  </DropdownMenu></SidebarMenuItem>
SidebarMenuSub
The SidebarMenuSub component is used to render a submenu within a SidebarMenu.
Use <SidebarMenuSubItem /> and <SidebarMenuSubButton /> to render a submenu item.
A sidebar menu with a submenu.
Copy
<SidebarMenuItem>  <SidebarMenuButton />  <SidebarMenuSub>    <SidebarMenuSubItem>      <SidebarMenuSubButton />    </SidebarMenuSubItem>    <SidebarMenuSubItem>      <SidebarMenuSubButton />    </SidebarMenuSubItem>  </SidebarMenuSub></SidebarMenuItem>
Collapsible SidebarMenu
To make a SidebarMenu component collapsible, wrap it and the SidebarMenuSub components in a Collapsible.
A collapsible sidebar menu.
Copy
<SidebarMenu>  <Collapsible defaultOpen className="group/collapsible">    <SidebarMenuItem>      <CollapsibleTrigger asChild>        <SidebarMenuButton />      </CollapsibleTrigger>      <CollapsibleContent>        <SidebarMenuSub>          <SidebarMenuSubItem />        </SidebarMenuSub>      </CollapsibleContent>    </SidebarMenuItem>  </Collapsible></SidebarMenu>
SidebarMenuBadge
The SidebarMenuBadge component is used to render a badge within a SidebarMenuItem.
A sidebar menu with a badge.
Copy
<SidebarMenuItem>  <SidebarMenuButton />  <SidebarMenuBadge>24</SidebarMenuBadge></SidebarMenuItem>
SidebarMenuSkeleton
The SidebarMenuSkeleton component is used to render a skeleton for a SidebarMenu. You can use this to show a loading state when using React Server Components, SWR or react-query.
Copy
function NavProjectsSkeleton() {  return (    <SidebarMenu>      {Array.from({ length: 5 }).map((_, index) => (        <SidebarMenuItem key={index}>          <SidebarMenuSkeleton />        </SidebarMenuItem>      ))}    </SidebarMenu>  )}
SidebarSeparator
The SidebarSeparator component is used to render a separator within a Sidebar.
Copy
<Sidebar>  <SidebarHeader />  <SidebarSeparator />  <SidebarContent>    <SidebarGroup />    <SidebarSeparator />    <SidebarGroup />  </SidebarContent></Sidebar>
SidebarTrigger
Use the SidebarTrigger component to render a button that toggles the sidebar.
The SidebarTrigger component must be used within a SidebarProvider.
Copy
<SidebarProvider>  <Sidebar />  <main>    <SidebarTrigger />  </main></SidebarProvider>
Custom Trigger
To create a custom trigger, you can use the useSidebar hook.
Copy
import { useSidebar } from "@/components/ui/sidebar" export function CustomTrigger() {  const { toggleSidebar } = useSidebar()  return <button onClick={toggleSidebar}>Toggle Sidebar</button>}
SidebarRail
The SidebarRail component is used to render a rail within a Sidebar. This rail can be used to toggle the sidebar.
Copy
<Sidebar>  <SidebarHeader />  <SidebarContent>    <SidebarGroup />  </SidebarContent>  <SidebarFooter />  <SidebarRail /></Sidebar>
Data Fetching
React Server Components
Here's an example of a SidebarMenu component rendering a list of projects using React Server Components.
A sidebar menu using React Server Components.
Skeleton to show loading state.
Copy
function NavProjectsSkeleton() {  return (    <SidebarMenu>      {Array.from({ length: 5 }).map((_, index) => (        <SidebarMenuItem key={index}>          <SidebarMenuSkeleton showIcon />        </SidebarMenuItem>      ))}    </SidebarMenu>  )}
Server component fetching data.
Copy
async function NavProjects() {  const projects = await fetchProjects()  return (    <SidebarMenu>      {projects.map((project) => (        <SidebarMenuItem key={project.name}>          <SidebarMenuButton asChild>            <a href={project.url}>              <project.icon />              <span>{project.name}</span>            </a>          </SidebarMenuButton>        </SidebarMenuItem>      ))}    </SidebarMenu>  )}
Usage with React Suspense.
Copy
function AppSidebar() {  return (    <Sidebar>      <SidebarContent>        <SidebarGroup>          <SidebarGroupLabel>Projects</SidebarGroupLabel>          <SidebarGroupContent>            <React.Suspense fallback={<NavProjectsSkeleton />}>              <NavProjects />            </React.Suspense>          </SidebarGroupContent>        </SidebarGroup>      </SidebarContent>    </Sidebar>  )}
SWR and React Query
You can use the same approach with SWR or react-query.
SWR
Copy
function NavProjects() {  const { data, isLoading } = useSWR("/api/projects", fetcher)  if (isLoading) {    return (      <SidebarMenu>        {Array.from({ length: 5 }).map((_, index) => (          <SidebarMenuItem key={index}>            <SidebarMenuSkeleton showIcon />          </SidebarMenuItem>        ))}      </SidebarMenu>    )  }  if (!data) {    return ...  }  return (    <SidebarMenu>      {data.map((project) => (        <SidebarMenuItem key={project.name}>          <SidebarMenuButton asChild>            <a href={project.url}>              <project.icon />              <span>{project.name}</span>            </a>          </SidebarMenuButton>        </SidebarMenuItem>      ))}    </SidebarMenu>  )}
React Query
Copy
function NavProjects() {  const { data, isLoading } = useQuery()  if (isLoading) {    return (      <SidebarMenu>        {Array.from({ length: 5 }).map((_, index) => (          <SidebarMenuItem key={index}>            <SidebarMenuSkeleton showIcon />          </SidebarMenuItem>        ))}      </SidebarMenu>    )  }  if (!data) {    return ...  }  return (    <SidebarMenu>      {data.map((project) => (        <SidebarMenuItem key={project.name}>          <SidebarMenuButton asChild>            <a href={project.url}>              <project.icon />              <span>{project.name}</span>            </a>          </SidebarMenuButton>        </SidebarMenuItem>      ))}    </SidebarMenu>  )}
Controlled Sidebar
Use the open and onOpenChange props to control the sidebar.
A controlled sidebar.
Copy
export function AppSidebar() {  const [open, setOpen] = React.useState(false)  return (    <SidebarProvider open={open} onOpenChange={setOpen}>      <Sidebar />    </SidebarProvider>  )}
Theming
We use the following CSS variables to theme the sidebar.
Copy
@layer base {  :root {    --sidebar-background: 0 0% 98%;    --sidebar-foreground: 240 5.3% 26.1%;    --sidebar-primary: 240 5.9% 10%;    --sidebar-primary-foreground: 0 0% 98%;    --sidebar-accent: 240 4.8% 95.9%;    --sidebar-accent-foreground: 240 5.9% 10%;    --sidebar-border: 220 13% 91%;    --sidebar-ring: 217.2 91.2% 59.8%;  }  .dark {    --sidebar-background: 240 5.9% 10%;    --sidebar-foreground: 240 4.8% 95.9%;    --sidebar-primary: 0 0% 98%;    --sidebar-primary-foreground: 240 5.9% 10%;    --sidebar-accent: 240 3.7% 15.9%;    --sidebar-accent-foreground: 240 4.8% 95.9%;    --sidebar-border: 240 3.7% 15.9%;    --sidebar-ring: 217.2 91.2% 59.8%;  }}
We intentionally use different variables for the sidebar and the rest of the application to make it easy to have a sidebar that is styled differently from the rest of the application. Think a sidebar with a darker shade from the main application.
Styling
Here are some tips for styling the sidebar based on different states.
* Styling an element based on the sidebar collapsible state. The following will hide the SidebarGroup when the sidebar is in icon mode.
Copy
<Sidebar collapsible="icon">  <SidebarContent>    <SidebarGroup className="group-data-[collapsible=icon]:hidden" />  </SidebarContent></Sidebar>
* Styling a menu action based on the menu button active state. The following will force the menu action to be visible when the menu button is active.
Copy
<SidebarMenuItem>  <SidebarMenuButton />  <SidebarMenuAction className="peer-data-[active=true]/menu-button:opacity-100" /></SidebarMenuItem>
You can find more tips on using states for styling in this Twitter thread.
Changelog
2024-10-30 Cookie handling in setOpen
* #5593 - Improved setOpen callback logic in <SidebarProvider>.
Update the setOpen callback in <SidebarProvider> as follows:
Copy
const setOpen = React.useCallback(  (value: boolean | ((value: boolean) => boolean)) => {    const openState = typeof value === "function" ? value(open) : value    if (setOpenProp) {      setOpenProp(openState)    } else {      _setOpen(openState)    }    // This sets the cookie to keep the sidebar state.    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`  },  [setOpenProp, open])
2024-10-21 Fixed text-sidebar-foreground
* #5491 - Moved text-sidebar-foreground from <SidebarProvider> to <Sidebar> component.
2024-10-20 Typo in useSidebar hook.
Fixed typo in useSidebar hook.
sidebar.tsx
Copy
-  throw new Error("useSidebar must be used within a Sidebar.")+  throw new Error("useSidebar must be used within a SidebarProvider.")
SheetSkeleton
On This Page
InstallationStructureUsageYour First SidebarComponentsSidebarProviderPropsWidthKeyboard ShortcutPersisted StateSidebarPropssidevariantcollapsibleuseSidebarSidebarHeaderSidebarFooterSidebarContentSidebarGroupCollapsible SidebarGroupSidebarGroupActionSidebarMenuSidebarMenuButtonLink or AnchorIcon and LabelisActiveSidebarMenuActionDropdownMenuSidebarMenuSubCollapsible SidebarMenuSidebarMenuBadgeSidebarMenuSkeletonSidebarSeparatorSidebarTriggerCustom TriggerSidebarRailData FetchingReact Server ComponentsSWR and React QueryControlled SidebarThemingStylingChangelog2024-10-30 Cookie handling in setOpen2024-10-21 Fixed text-sidebar-foreground2024-10-20 Typo in useSidebar hook.
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Sidebar - shadcn/ui
Jan
Skeleton
Previous
Next
Use to show a placeholder while content is loading.
PreviewCode
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add skeleton
Copy
Usage
Copy
import { Skeleton } from "@/components/ui/skeleton"
Copy
<Skeleton className="h-[20px] w-[100px] rounded-full" />
Examples
Card
PreviewCode
SidebarSlider
On This Page
InstallationUsageExamplesCard
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Skeleton - shadcn/ui
Jan
Slider
Previous
Next
An input where the user selects a value from within a given range.
DocsAPI Reference
PreviewCode
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add slider
Copy
Usage
Copy
import { Slider } from "@/components/ui/slider"
Copy
<Slider defaultValue={[33]} max={100} step={1} />
SkeletonSonner
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Slider - shadcn/ui
Jan
Sonner
Previous
Next
An opinionated toast component for React.
Docs
PreviewCode
Show Toast
About
Sonner is built and maintained by emilkowalski_.
Installation
CLIManual
Run the following command:
pnpmnpmyarnbun
pnpm dlx shadcn@latest add sonner
Copy
Add the Toaster component
app/layout.tsx
Copy
import { Toaster } from "@/components/ui/sonner" export default function RootLayout({ children }) {  return (    <html lang="en">      <head />      <body>        <main>{children}</main>        <Toaster />      </body>    </html>  )}
Usage
Copy
import { toast } from "sonner"
Copy
toast("Event has been created.")
SliderSwitch
On This Page
AboutInstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Sonner - shadcn/ui
Jan
Switch
Previous
Next
A control that allows the user to toggle between checked and not checked.
DocsAPI Reference
PreviewCode
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add switch
Copy
Usage
Copy
import { Switch } from "@/components/ui/switch"
Copy
<Switch />
Examples
Form
PreviewCode
Email Notifications
Receive emails about new products, features, and more.
Receive emails about your account security.
Submit
SonnerTable
On This Page
InstallationUsageExamplesForm
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Switch - shadcn/ui
Jan
Table
Previous
Next
A responsive table component.
PreviewCode
Invoice
	Status
	Method
	Amount
	INV001
	Paid
	Credit Card
	$250.00
	INV002
	Pending
	PayPal
	$150.00
	INV003
	Unpaid
	Bank Transfer
	$350.00
	INV004
	Paid
	Credit Card
	$450.00
	INV005
	Paid
	PayPal
	$550.00
	INV006
	Pending
	Bank Transfer
	$200.00
	INV007
	Unpaid
	Credit Card
	$300.00
	Total
	$2,500.00
	Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add table
Copy
Usage
Copy
import {  Table,  TableBody,  TableCaption,  TableCell,  TableHead,  TableHeader,  TableRow,} from "@/components/ui/table"
Copy
<Table>  <TableCaption>A list of your recent invoices.</TableCaption>  <TableHeader>    <TableRow>      <TableHead className="w-[100px]">Invoice</TableHead>      <TableHead>Status</TableHead>      <TableHead>Method</TableHead>      <TableHead className="text-right">Amount</TableHead>    </TableRow>  </TableHeader>  <TableBody>    <TableRow>      <TableCell className="font-medium">INV001</TableCell>      <TableCell>Paid</TableCell>      <TableCell>Credit Card</TableCell>      <TableCell className="text-right">$250.00</TableCell>    </TableRow>  </TableBody></Table>
Data Table
You can use the <Table /> component to build more complex data tables. Combine it with @tanstack/react-table to create tables with sorting, filtering and pagination.
See the Data Table documentation for more information.
You can also see an example of a data table in the Tasks demo.
SwitchTabs
On This Page
InstallationUsageData Table
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Table - shadcn/ui
Jan
Tabs
Previous
Next
A set of layered sections of content—known as tab panels—that are displayed one at a time.
DocsAPI Reference
PreviewCode
AccountPassword
Account
Make changes to your account here. Click save when you're done.
Save changes
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add tabs
Copy
Usage
Copy
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
Copy
<Tabs defaultValue="account" className="w-[400px]">  <TabsList>    <TabsTrigger value="account">Account</TabsTrigger>    <TabsTrigger value="password">Password</TabsTrigger>  </TabsList>  <TabsContent value="account">Make changes to your account here.</TabsContent>  <TabsContent value="password">Change your password here.</TabsContent></Tabs>
TableTextarea
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Tabs - shadcn/ui
Jan
Textarea
Previous
Next
Displays a form textarea or a component that looks like a textarea.
PreviewCode
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add textarea
Copy
Usage
Copy
import { Textarea } from "@/components/ui/textarea"
Copy
<Textarea />
Examples
Default
PreviewCode
Disabled
PreviewCode
With Label
PreviewCode
With Text
PreviewCode
Your message will be copied to the support team.
With Button
PreviewCode
Send message
Form
PreviewCode
You can @mention other users and organizations.
Submit
TabsToast
On This Page
InstallationUsageExamplesDefaultDisabledWith LabelWith TextWith ButtonForm
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Textarea - shadcn/ui
Jan
Toast
Previous
Next
A succinct message that is displayed temporarily.
DocsAPI Reference
The toast component has been deprecated.
See the sonner documentation for more information.
If you're looking for the old toast component, see the old docs for more information.
TextareaToggle
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Toast - shadcn/ui
Jan
Toggle
Previous
Next
A two-state button that can be either on or off.
DocsAPI Reference
PreviewCode
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add toggle
Copy
Usage
Copy
import { Toggle } from "@/components/ui/toggle"
Copy
<Toggle>Toggle</Toggle>
Examples
Default
PreviewCode
Outline
PreviewCode
With Text
PreviewCode
Italic
Small
PreviewCode
Large
PreviewCode
Disabled
PreviewCode
ToastToggle Group
On This Page
InstallationUsageExamplesDefaultOutlineWith TextSmallLargeDisabled
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Toggle - shadcn/ui
Jan
Toggle Group
Previous
Next
A set of two-state buttons that can be toggled on or off.
DocsAPI Reference
PreviewCode
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add toggle-group
Copy
Usage
Copy
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
Copy
<ToggleGroup type="single">  <ToggleGroupItem value="a">A</ToggleGroupItem>  <ToggleGroupItem value="b">B</ToggleGroupItem>  <ToggleGroupItem value="c">C</ToggleGroupItem></ToggleGroup>
Examples
Default
PreviewCode
Outline
PreviewCode
Single
PreviewCode
Small
PreviewCode
Large
PreviewCode
Disabled
PreviewCode
ToggleTooltip
On This Page
InstallationUsageExamplesDefaultOutlineSingleSmallLargeDisabled
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Toggle Group - shadcn/ui
Jan
Tooltip
Previous
Next
A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
DocsAPI Reference
PreviewCode
Hover
Installation
CLIManual
pnpmnpmyarnbun
pnpm dlx shadcn@latest add tooltip
Copy
Usage
Copy
import {  Tooltip,  TooltipContent,  TooltipTrigger,} from "@/components/ui/tooltip"
Copy
<Tooltip>  <TooltipTrigger>Hover</TooltipTrigger>  <TooltipContent>    <p>Add to library</p>  </TooltipContent></Tooltip>
Toggle GroupTypography
On This Page
InstallationUsage
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Tooltip - shadcn/ui
Jan
Typography
Previous
Next
Styles for headings, paragraphs, lists...etc
We do not ship any typography styles by default. This page is an example of how you can use utility classes to style your text.
Taxing Laughter: The Joke Tax Chronicles
Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne. One day, his advisors came to him with a problem: the kingdom was running out of money.
The King's Plan
The king thought long and hard, and finally came up with a brilliant plan: he would tax the jokes in the kingdom.
"After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
The Joke Tax
The king's subjects were not amused. They grumbled and complained, but the king was firm:
* 1st level of puns: 5 gold coins
* 2nd level of jokes: 10 gold coins
* 3rd level of one-liners : 20 gold coins
As a result, people stopped telling jokes, and the kingdom fell into a gloom. But there was one person who refused to let the king's foolishness get him down: a court jester named Jokester.
Jokester's Revolt
Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under the king's pillow, in his soup, even in the royal toilet. The king was furious, but he couldn't seem to stop Jokester.
And then, one day, the people of the kingdom discovered that the jokes left by Jokester were so funny that they couldn't help but laugh. And once they started laughing, they couldn't stop.
The People's Rebellion
The people of the kingdom, feeling uplifted by the laughter, started to tell jokes and puns again, and soon the entire kingdom was in on the joke.
King's Treasury
	People's happiness
	Empty
	Overflowing
	Modest
	Satisfied
	Full
	Ecstatic
	The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax. Jokester was declared a hero, and the kingdom lived happily ever after.
The moral of the story is: never underestimate the power of a good laugh and always be careful of bad ideas.
h1
PreviewCode
Taxing Laughter: The Joke Tax Chronicles
h2
PreviewCode
The People of the Kingdom
h3
PreviewCode
The Joke Tax
h4
PreviewCode
People stopped telling jokes
p
PreviewCode
The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
blockquote
PreviewCode
"After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
table
PreviewCode
King's Treasury
	People's happiness
	Empty
	Overflowing
	Modest
	Satisfied
	Full
	Ecstatic
	list
PreviewCode
* 1st level of puns: 5 gold coins
* 2nd level of jokes: 10 gold coins
* 3rd level of one-liners : 20 gold coins
Inline code
PreviewCode
@radix-ui/react-alert-dialog
Lead
PreviewCode
A modal dialog that interrupts the user with important content and expects a response.
Large
PreviewCode
Are you absolutely sure?
Small
PreviewCode
Email address
Muted
PreviewCode
Enter your email address.
TooltipInstallation
On This Page
h1h2h3h4pblockquotetablelistInline codeLeadLargeSmallMuted
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Typography - shadcn/ui
Jan
Vite
Previous
Next
Install and configure shadcn/ui for Vite.
Create project
Start by creating a new React project using vite. Select the React + TypeScript template:
pnpmnpmyarnbun
pnpm create vite@latest
Copy
Add Tailwind CSS
pnpmnpmyarnbun
pnpm add tailwindcss @tailwindcss/vite
Copy
Replace everything in src/index.css with the following:
src/index.css
Copy
@import "tailwindcss";
Edit tsconfig.json file
The current version of Vite splits TypeScript configuration into three files, two of which need to be edited. Add the baseUrl and paths properties to the compilerOptions section of the tsconfig.json and tsconfig.app.json files:
tsconfig.json
Copy
{  "files": [],  "references": [    {      "path": "./tsconfig.app.json"    },    {      "path": "./tsconfig.node.json"    }  ],  "compilerOptions": {    "baseUrl": ".",    "paths": {      "@/*": ["./src/*"]    }  }}
Edit tsconfig.app.json file
Add the following code to the tsconfig.app.json file to resolve paths, for your IDE:
tsconfig.app.json
Copy
{  "compilerOptions": {    // ...    "baseUrl": ".",    "paths": {      "@/*": [        "./src/*"      ]    }    // ...  }}
Update vite.config.ts
Add the following code to the vite.config.ts so your app can resolve paths without error:
pnpmnpmyarnbun
pnpm add -D @types/node
Copy
vite.config.ts
Copy
import path from "path"import tailwindcss from "@tailwindcss/vite"import react from "@vitejs/plugin-react"import { defineConfig } from "vite" // https://vite.dev/config/export default defineConfig({  plugins: [react(), tailwindcss()],  resolve: {    alias: {      "@": path.resolve(__dirname, "./src"),    },  },})
Run the CLI
Run the shadcn init command to setup your project:
pnpmnpmyarnbun
pnpm dlx shadcn@latest init
Copy
You will be asked a few questions to configure components.json.
Copy
Which color would you like to use as base color? › Neutral
Add Components
You can now start adding components to your project.
pnpmnpmyarnbun
pnpm dlx shadcn@latest add button
Copy
The command above will add the Button component to your project. You can then import it like this:
src/App.tsx
Copy
import { Button } from "@/components/ui/button" function App() {  return (    <div className="flex min-h-svh flex-col items-center justify-center">      <Button>Click me</Button>    </div>  )} export default App
Next.jsLaravel
On This Page
Create projectAdd Tailwind CSSEdit tsconfig.json fileEdit tsconfig.app.json fileUpdate vite.config.tsRun the CLIAdd Components
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Vite - shadcn/ui
Jan
Vite
Previous
Next
Adding dark mode to your vite app.
Create a theme provider
components/theme-provider.tsx
Copy
import { createContext, useContext, useEffect, useState } from "react" type Theme = "dark" | "light" | "system" type ThemeProviderProps = {  children: React.ReactNode  defaultTheme?: Theme  storageKey?: string} type ThemeProviderState = {  theme: Theme  setTheme: (theme: Theme) => void} const initialState: ThemeProviderState = {  theme: "system",  setTheme: () => null,} const ThemeProviderContext = createContext<ThemeProviderState>(initialState) export function ThemeProvider({  children,  defaultTheme = "system",  storageKey = "vite-ui-theme",  ...props}: ThemeProviderProps) {  const [theme, setTheme] = useState<Theme>(    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme  )  useEffect(() => {    const root = window.document.documentElement    root.classList.remove("light", "dark")    if (theme === "system") {      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")        .matches        ? "dark"        : "light"      root.classList.add(systemTheme)      return    }    root.classList.add(theme)  }, [theme])  const value = {    theme,    setTheme: (theme: Theme) => {      localStorage.setItem(storageKey, theme)      setTheme(theme)    },  }  return (    <ThemeProviderContext.Provider {...props} value={value}>      {children}    </ThemeProviderContext.Provider>  )} export const useTheme = () => {  const context = useContext(ThemeProviderContext)  if (context === undefined)    throw new Error("useTheme must be used within a ThemeProvider")  return context}
Wrap your root layout
Add the ThemeProvider to your root layout.
App.tsx
Copy
import { ThemeProvider } from "@/components/theme-provider" function App() {  return (    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">      {children}    </ThemeProvider>  )} export default App
Add a mode toggle
Place a mode toggle on your site to toggle between light and dark mode.
components/mode-toggle.tsx
Copy
import { Moon, Sun } from "lucide-react" import { Button } from "@/components/ui/button"import {  DropdownMenu,  DropdownMenuContent,  DropdownMenuItem,  DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"import { useTheme } from "@/components/theme-provider" export function ModeToggle() {  const { setTheme } = useTheme()  return (    <DropdownMenu>      <DropdownMenuTrigger asChild>        <Button variant="outline" size="icon">          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />          <span className="sr-only">Toggle theme</span>        </Button>      </DropdownMenuTrigger>      <DropdownMenuContent align="end">        <DropdownMenuItem onClick={() => setTheme("light")}>          Light        </DropdownMenuItem>        <DropdownMenuItem onClick={() => setTheme("dark")}>          Dark        </DropdownMenuItem>        <DropdownMenuItem onClick={() => setTheme("system")}>          System        </DropdownMenuItem>      </DropdownMenuContent>    </DropdownMenu>  )}
Next.jsAstro
On This Page
Create a theme providerWrap your root layoutAdd a mode toggle
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Vite - shadcn/ui
Jan
FAQ
Previous
Next
Frequently asked questions about running a registry.
Frequently asked questions
What does a complex component look like?
Here's an example of a complex component that installs a page, two components, a hook, a format-date utils and a config file.
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "hello-world",  "title": "Hello World",  "type": "registry:block",  "description": "A complex hello world component",  "files": [    {      "path": "registry/new-york/hello-world/page.tsx",      "type": "registry:page",      "target": "app/hello/page.tsx"    },    {      "path": "registry/new-york/hello-world/components/hello-world.tsx",      "type": "registry:component"    },    {      "path": "registry/new-york/hello-world/components/formatted-message.tsx",      "type": "registry:component"    },    {      "path": "registry/new-york/hello-world/hooks/use-hello.ts",      "type": "registry:hook"    },    {      "path": "registry/new-york/hello-world/lib/format-date.ts",      "type": "registry:utils"    },    {      "path": "registry/new-york/hello-world/hello.config.ts",      "type": "registry:file",      "target": "~/hello.config.ts"    }  ]}
How do I add a new Tailwind color?
To add a new color you need to add it to cssVars under light and dark keys.
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "hello-world",  "title": "Hello World",  "type": "registry:block",  "description": "A complex hello world component",  "files": [    // ...  ],  "cssVars": {    "light": {      "brand-background": "20 14.3% 4.1%",      "brand-accent": "20 14.3% 4.1%"    },    "dark": {      "brand-background": "20 14.3% 4.1%",      "brand-accent": "20 14.3% 4.1%"    }  }}
The CLI will update the project CSS file. Once updated, the new colors will be available to be used as utility classes: bg-brand and text-brand-accent.
How do I add or override a Tailwind theme variable?
To add or override a theme variable you add it to cssVars.theme under the key you want to add or override.
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "hello-world",  "title": "Hello World",  "type": "registry:block",  "description": "A complex hello world component",  "files": [    // ...  ],  "cssVars": {    "theme": {      "text-base": "3rem",      "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",      "font-heading": "Poppins, sans-serif"    }  }}
Getting StartedOpen in v0
On This Page
Frequently asked questionsWhat does a complex component look like?How do I add a new Tailwind color?How do I add or override a Tailwind theme variable?
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
FAQ - shadcn/ui
Jan
Registry
Previous
Next
Run your own code registry.
You can use the shadcn CLI to run your own code registry. Running your own registry allows you to distribute your custom components, hooks, pages, config, rules and other files to any project.
Note: The registry works with any project type and any framework, and is not limited to React.
 Registry 

A distribution system for code
Requirements
You are free to design and host your custom registry as you see fit. The only requirement is that your registry items must be valid JSON files that conform to the registry-item schema specification.
If you'd like to see an example of a registry, we have a template project for you to use as a starting point.
RemixGetting Started
On This Page
Requirements
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Registry - shadcn/ui
Jan
Getting Started
Previous
Next
Learn how to get setup and run your own component registry.
This guide will walk you through the process of setting up your own component registry.
It assumes you already have a project with components and would like to turn it into a registry.
If you're starting a new registry project, you can use the registry template as a starting point. We have already configured it for you.
registry.json
The registry.json file is only required if you're using the shadcn CLI to build your registry.
If you're using a different build system, you can skip this step as long as your build system produces valid JSON files that conform to the registry-item schema specification.
Add a registry.json file
Create a registry.json file in the root of your project. Your project can be a Next.js, Remix, Vite, or any other project that supports React.
registry.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry.json",  "name": "acme",  "homepage": "https://acme.com",  "items": [    // ...  ]}
This registry.json file must conform to the registry schema specification.
Add a registry item
Create your component
Add your first component. Here's an example of a simple <HelloWorld /> component:
registry/new-york/hello-world/hello-world.tsx
Copy
import { Button } from "@/components/ui/button" export function HelloWorld() {  return <Button>Hello World</Button>}
Note: This example places the component in the registry/new-york directory. You can place it anywhere in your project as long as you set the correct path in the registry.json file and you follow the registry/[NAME] directory structure.
Copy
registry└── new-york    └── hello-world        └── hello-world.tsx
Add your component to the registry
To add your component to the registry, you need to add your component definition to registry.json.
registry.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry.json",  "name": "acme",  "homepage": "https://acme.com",  "items": [    {      "name": "hello-world",      "type": "registry:block",      "title": "Hello World",      "description": "A simple hello world component.",      "files": [        {          "path": "registry/new-york/hello-world/hello-world.tsx",          "type": "registry:component"        }      ]    }  ]}
You define your registry item by adding a name, type, title, description and files.
For every file you add, you must specify the path and type of the file. The path is the relative path to the file from the root of your project. The type is the type of the file.
You can read more about the registry item schema and file types in the registry item schema docs.
Build your registry
Install the shadcn CLI
Note: the build command is currently only available in the shadcn@canary version of the CLI.
pnpmnpmyarnbun
pnpm add shadcn@canary
Copy
Add a build script
Add a registry:build script to your package.json file.
package.json
Copy
{  "scripts": {    "registry:build": "shadcn build"  }}
Run the build script
Run the build script to generate the registry JSON files.
pnpmnpmyarnbun
pnpm registry:build
Copy
Note: By default, the build script will generate the registry JSON files in public/r e.g public/r/hello-world.json.
You can change the output directory by passing the --output option. See the shadcn build command for more information.
Serve your registry
If you're running your registry on Next.js, you can now serve your registry by running the next server. The command might differ for other frameworks.
pnpmnpmyarnbun
pnpm dev
Copy
Your files will now be served at http://localhost:3000/r/[NAME].json eg. http://localhost:3000/r/hello-world.json.
Publish your registry
To make your registry available to other developers, you can publish it by deploying your project to a public URL.
Adding Auth
The shadcn CLI does not offer a built-in way to add auth to your registry. We recommend handling authorization on your registry server.
A common simple approach is to use a token query parameter to authenticate requests to your registry. e.g. http://localhost:3000/r/hello-world.json?token=[SECURE_TOKEN_HERE].
Use the secure token to authenticate requests and return a 401 Unauthorized response if the token is invalid. Both the shadcn CLI and Open in v0 will handle the 401 response and display a message to the user.
Note: Make sure to encrypt and expire tokens.
Guidelines
Here are some guidelines to follow when building components for a registry.
* Place your registry item in the registry/[STYLE]/[NAME] directory. I'm using new-york as an example. It can be anything you want as long as it's nested under the registry directory.
* The following properties are required for the block definition: name, description, type and files.
* Make sure to list all registry dependencies in registryDependencies. A registry dependency is the name of the component in the registry eg. input, button, card, etc or a URL to a registry item eg. http://localhost:3000/r/editor.json.
* Make sure to list all dependencies in dependencies. A dependency is the name of the package in the registry eg. zod, sonner, etc. To set a version, you can use the name@version format eg. zod@^3.20.0.
* Imports should always use the @/registry path. eg. import { HelloWorld } from "@/registry/new-york/hello-world/hello-world"
* Ideally, place your files within a registry item in components, hooks, lib directories.
Install using the CLI
To install a registry item using the shadcn CLI, use the add command followed by the URL of the registry item.
pnpmnpmyarnbun
pnpm dlx shadcn@latest add http://localhost:3000/r/hello-world.json
Copy
RegistryFAQ
On This Page
registry.jsonAdd a registry.json fileAdd a registry itemCreate your componentAdd your component to the registryBuild your registryInstall the shadcn CLIAdd a build scriptRun the build scriptServe your registryPublish your registryAdding AuthGuidelinesInstall using the CLI
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Getting Started - shadcn/ui
Jan
FAQ
Previous
Next
Frequently asked questions about running a registry.
Frequently asked questions
What does a complex component look like?
Here's an example of a complex component that installs a page, two components, a hook, a format-date utils and a config file.
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "hello-world",  "title": "Hello World",  "type": "registry:block",  "description": "A complex hello world component",  "files": [    {      "path": "registry/new-york/hello-world/page.tsx",      "type": "registry:page",      "target": "app/hello/page.tsx"    },    {      "path": "registry/new-york/hello-world/components/hello-world.tsx",      "type": "registry:component"    },    {      "path": "registry/new-york/hello-world/components/formatted-message.tsx",      "type": "registry:component"    },    {      "path": "registry/new-york/hello-world/hooks/use-hello.ts",      "type": "registry:hook"    },    {      "path": "registry/new-york/hello-world/lib/format-date.ts",      "type": "registry:utils"    },    {      "path": "registry/new-york/hello-world/hello.config.ts",      "type": "registry:file",      "target": "~/hello.config.ts"    }  ]}
How do I add a new Tailwind color?
To add a new color you need to add it to cssVars under light and dark keys.
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "hello-world",  "title": "Hello World",  "type": "registry:block",  "description": "A complex hello world component",  "files": [    // ...  ],  "cssVars": {    "light": {      "brand-background": "20 14.3% 4.1%",      "brand-accent": "20 14.3% 4.1%"    },    "dark": {      "brand-background": "20 14.3% 4.1%",      "brand-accent": "20 14.3% 4.1%"    }  }}
The CLI will update the project CSS file. Once updated, the new colors will be available to be used as utility classes: bg-brand and text-brand-accent.
How do I add or override a Tailwind theme variable?
To add or override a theme variable you add it to cssVars.theme under the key you want to add or override.
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "hello-world",  "title": "Hello World",  "type": "registry:block",  "description": "A complex hello world component",  "files": [    // ...  ],  "cssVars": {    "theme": {      "text-base": "3rem",      "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",      "font-heading": "Poppins, sans-serif"    }  }}
Getting StartedOpen in v0
On This Page
Frequently asked questionsWhat does a complex component look like?How do I add a new Tailwind color?How do I add or override a Tailwind theme variable?
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
FAQ - shadcn/ui
Jan
Open in v0
Previous
Next
Integrate your registry with Open in v0.
If your registry is hosted and publicly accessible via a URL, you can open a registry item in v0 by using the https://v0.dev/chat/api/open?url=[URL] endpoint.
eg. https://v0.dev/chat/api/open?url=https://ui.shadcn.com/r/styles/new-york/login-01.json
Note: The Open in v0 button does not support cssVars and tailwind properties.
Button
See Build your Open in v0 button for more information on how to build your own Open in v0 button.
Here's a simple example of how to add a Open in v0 button to your site.
Copy
import { Button } from "@/components/ui/button" export function OpenInV0Button({ url }: { url: string }) {  return (    <Button      aria-label="Open in v0"      className="h-8 gap-1 rounded-[6px] bg-black px-3 text-xs text-white hover:bg-black hover:text-white dark:bg-white dark:text-black"      asChild    >      <a        href={`https://v0.dev/chat/api/open?url=${url}`}        target="_blank"        rel="noreferrer"      >        Open in{" "}        <svg          viewBox="0 0 40 20"          fill="none"          xmlns="http://www.w3.org/2000/svg"          className="h-5 w-5 text-current"        >          <path            d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"            fill="currentColor"          ></path>          <path            d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"            fill="currentColor"          ></path>        </svg>      </a>    </Button>  )}
Copy
<OpenInV0Button url="https://example.com/r/hello-world.json" />
Authentication
See the Adding Auth section for more information on how to authenticate requests to your registry and Open in v0.
FAQExamples
On This Page
ButtonAuthentication
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Open in v0 - shadcn/ui
Jan
Examples
Previous
Next
Examples of registry items: styles, components, css vars, etc.
registry:style
Custom style that extends shadcn/ui
The following registry item is a custom style that extends shadcn/ui. On npx shadcn init, it will:
* Install @tabler/icons-react as a dependency.
* Add the login-01 block and calendar component to the project.
* Add the editor from a remote registry.
* Set the font-sans variable to Inter, sans-serif.
* Install a brand color in light and dark mode.
example-style.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "example-style",  "type": "registry:style",  "dependencies": ["@tabler/icons-react"],  "registryDependencies": [    "login-01",    "calendar",    "https://example.com/r/editor.json"  ],  "cssVars": {    "theme": {      "font-sans": "Inter, sans-serif"    },    "light": {      "brand": "20 14.3% 4.1%"    },    "dark": {      "brand": "20 14.3% 4.1%"    }  }}
Custom style from scratch
The following registry item is a custom style that doesn't extend shadcn/ui. See the extends: none field.
It can be used to create a new style from scratch i.e custom components, css vars, dependencies, etc.
On npx shadcn add, the following will:
* Install tailwind-merge and clsx as dependencies.
* Add the utils registry item from the shadcn/ui registry.
* Add the button, input, label, and select components from a remote registry.
* Install new css vars: main, bg, border, text, ring.
example-style.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "extends": "none",  "name": "new-style",  "type": "registry:style",  "dependencies": ["tailwind-merge", "clsx"],  "registryDependencies": [    "utils",    "https://example.com/r/button.json",    "https://example.com/r/input.json",    "https://example.com/r/label.json",    "https://example.com/r/select.json"  ],  "cssVars": {    "theme": {      "font-sans": "Inter, sans-serif",    }    "light": {      "main": "#88aaee",      "bg": "#dfe5f2",      "border": "#000",      "text": "#000",      "ring": "#000",    },    "dark": {      "main": "#88aaee",      "bg": "#272933",      "border": "#000",      "text": "#e6e6e6",      "ring": "#fff",    }  }}
registry:theme
Custom theme
example-theme.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "custom-theme",  "type": "registry:theme",  "cssVars": {    "light": {      "background": "oklch(1 0 0)",      "foreground": "oklch(0.141 0.005 285.823)",      "primary": "oklch(0.546 0.245 262.881)",      "primary-foreground": "oklch(0.97 0.014 254.604)",      "ring": "oklch(0.746 0.16 232.661)",      "sidebar-primary": "oklch(0.546 0.245 262.881)",      "sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",      "sidebar-ring": "oklch(0.746 0.16 232.661)"    },    "dark": {      "background": "oklch(1 0 0)",      "foreground": "oklch(0.141 0.005 285.823)",      "primary": "oklch(0.707 0.165 254.624)",      "primary-foreground": "oklch(0.97 0.014 254.604)",      "ring": "oklch(0.707 0.165 254.624)",      "sidebar-primary": "oklch(0.707 0.165 254.624)",      "sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",      "sidebar-ring": "oklch(0.707 0.165 254.624)"    }  }}
Custom colors
The following style will init using shadcn/ui defaults and then add a custom brand color.
example-style.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "custom-style",  "type": "registry:style",  "cssVars": {    "light": {      "brand": "oklch(0.99 0.00 0)"    },    "dark": {      "brand": "oklch(0.14 0.00 286)"    }  }}
registry:block
Custom block
This blocks installs the login-01 block from the shadcn/ui registry.
login-01.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "login-01",  "type": "registry:block",  "description": "A simple login form.",  "registryDependencies": ["button", "card", "input", "label"],  "files": [    {      "path": "blocks/login-01/page.tsx",      "content": "import { LoginForm } ...",      "type": "registry:page",      "target": "app/login/page.tsx"    },    {      "path": "blocks/login-01/components/login-form.tsx",      "content": "...",      "type": "registry:component"    }  ]}
Install a block and override primitives
You can install a block fromt the shadcn/ui registry and override the primitives using your custom ones.
On npx shadcn add, the following will:
* Add the login-01 block from the shadcn/ui registry.
* Override the button, input, and label primitives with the ones from the remote registry.
example-style.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "custom-login",  "type": "registry:block",  "registryDependencies": [    "login-01",    "https://example.com/r/button.json",    "https://example.com/r/input.json",    "https://example.com/r/label.json"  ]}
CSS Variables
Custom Theme Variables
Add custom theme variables to the theme object.
example-theme.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "custom-theme",  "type": "registry:theme",  "cssVars": {    "theme": {      "font-heading": "Inter, sans-serif",      "shadow-card": "0 0 0 1px rgba(0, 0, 0, 0.1)"    }  }}
Override Tailwind CSS variables
example-theme.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "custom-theme",  "type": "registry:theme",  "cssVars": {    "theme": {      "spacing": "0.2rem",      "breakpoint-sm": "640px",      "breakpoint-md": "768px",      "breakpoint-lg": "1024px",      "breakpoint-xl": "1280px",      "breakpoint-2xl": "1536px"    }  }}
Add custom CSS
Base styles
example-base.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "custom-style",  "type": "registry:style",  "css": {    "@layer base": {      "h1": {        "font-size": "var(--text-2xl)"      },      "h2": {        "font-size": "var(--text-xl)"      }    }  }}
Components
example-card.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "custom-card",  "type": "registry:component",  "css": {    "@layer components": {      "card": {        "background-color": "var(--color-white)",        "border-radius": "var(--rounded-lg)",        "padding": "var(--spacing-6)",        "box-shadow": "var(--shadow-xl)"      }    }  }}
Add custom utilities
Simple utility
example-component.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "custom-component",  "type": "registry:component",  "css": {    "@utility content-auto": {      "content-visibility": "auto"    }  }}
Complex utility
example-utility.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "custom-component",  "type": "registry:component",  "css": {    "@utility scrollbar-hidden": {      "scrollbar-hidden": {        "&::-webkit-scrollbar": {          "display": "none"        }      }    }  }}
Functional utilities
example-functional.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "custom-component",  "type": "registry:component",  "css": {    "@utility tab-*": {      "tab-size": "var(--tab-size-*)"    }  }}
Add custom plugins
example-plugin.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "custom-plugin",  "type": "registry:component",  "css": {    "@plugin @tailwindcss/typography": {},    "@plugin foo": {}  }}
Add custom animations
Note: you need to define both @keyframes in css and theme in cssVars to use animations.
example-component.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "custom-component",  "type": "registry:component",  "cssVars": {    "theme": {      "--animate-wiggle": "wiggle 1s ease-in-out infinite"    }  },  "css": {    "@keyframes wiggle": {      "0%, 100%": {        "transform": "rotate(-3deg)"      },      "50%": {        "transform": "rotate(3deg)"      }    }  }}
Universal Items
As of 2.9.0, you can create universal items that can be installed without framework detection or components.json.
To make an item universal i.e framework agnostic, all the files in the item must have an explicit target.
Here's an example of a registry item that installs custom Cursor rules for python:
.cursor/rules/custom-python.mdc
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "python-rules",  "type": "registry:item",  "files": [    {      "path": "/path/to/your/registry/default/custom-python.mdc",      "type": "registry:file",      "target": "~/.cursor/rules/custom-python.mdc",      "content": "..."    }  ]}
Here's another example for installation custom ESLint config:
.eslintrc.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "my-eslint-config",  "type": "registry:item",  "files": [    {      "path": "/path/to/your/registry/default/custom-eslint.json",      "type": "registry:file",      "target": "~/.eslintrc.json",      "content": "..."    }  ]}
You can also have a universal item that installs multiple files:
my-custom-starter-template.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "my-custom-start-template",  "type": "registry:item",  dependencies: ["better-auth"]  "files": [    {      "path": "/path/to/file-01.json",      "type": "registry:file",      "target": "~/file-01.json",      "content": "..."    },    {      "path": "/path/to/file-02.vue",      "type": "registry:file",      "target": "~/pages/file-02.vue",      "content": "..."    }  ]}
Open in v0registry.json
On This Page
registry:styleCustom style that extends shadcn/uiCustom style from scratchregistry:themeCustom themeCustom colorsregistry:blockCustom blockInstall a block and override primitivesCSS VariablesCustom Theme VariablesOverride Tailwind CSS variablesAdd custom CSSBase stylesComponentsAdd custom utilitiesSimple utilityComplex utilityFunctional utilitiesAdd custom pluginsAdd custom animationsUniversal Items
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
Examples - shadcn/ui
Jan
registry.json
Previous
Next
Schema for running your own component registry.
The registry.json schema is used to define your custom component registry.
registry.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry.json",  "name": "shadcn",  "homepage": "https://ui.shadcn.com",  "items": [    {      "name": "hello-world",      "type": "registry:block",      "title": "Hello World",      "description": "A simple hello world component.",      "files": [        {          "path": "registry/new-york/hello-world/hello-world.tsx",          "type": "registry:component"        }      ]    }  ]}
Definitions
You can see the JSON Schema for registry.json here.
$schema
The $schema property is used to specify the schema for the registry.json file.
registry.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry.json"}
name
The name property is used to specify the name of your registry. This is used for data attributes and other metadata.
registry.json
Copy
{  "name": "acme"}
homepage
The homepage of your registry. This is used for data attributes and other metadata.
registry.json
Copy
{  "homepage": "https://acme.com"}
items
The items in your registry. Each item must implement the registry-item schema specification.
registry.json
Copy
{  "items": [    {      "name": "hello-world",      "type": "registry:block",      "title": "Hello World",      "description": "A simple hello world component.",      "files": [        {          "path": "registry/new-york/hello-world/hello-world.tsx",          "type": "registry:component"        }      ]    }  ]}
See the registry-item schema documentation for more information.
Examplesregistry-item.json
On This Page
Definitions$schemanamehomepageitems
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
registry.json - shadcn/ui
Jan
registry-item.json
Previous
Specification for registry items.
The registry-item.json schema is used to define your custom registry items.
registry-item.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json",  "name": "hello-world",  "type": "registry:block",  "title": "Hello World",  "description": "A simple hello world component.",  "files": [    {      "path": "registry/new-york/hello-world/hello-world.tsx",      "type": "registry:component"    },    {      "path": "registry/new-york/hello-world/use-hello-world.ts",      "type": "registry:hook"    }  ],  "cssVars": {    "theme": {      "font-heading": "Poppins, sans-serif"    },    "light": {      "brand": "20 14.3% 4.1%"    },    "dark": {      "brand": "20 14.3% 4.1%"    }  }}
See more examples
Definitions
You can see the JSON Schema for registry-item.json here.
$schema
The $schema property is used to specify the schema for the registry-item.json file.
registry-item.json
Copy
{  "$schema": "https://ui.shadcn.com/schema/registry-item.json"}
name
The name of the item. This is used to identify the item in the registry. It should be unique for your registry.
registry-item.json
Copy
{  "name": "hello-world"}
title
A human-readable title for your registry item. Keep it short and descriptive.
registry-item.json
Copy
{  "title": "Hello World"}
description
A description of your registry item. This can be longer and more detailed than the title.
registry-item.json
Copy
{  "description": "A simple hello world component."}
type
The type property is used to specify the type of your registry item. This is used to determine the type and target path of the item when resolved for a project.
registry-item.json
Copy
{  "type": "registry:block"}
The following types are supported:
Type
	Description
	registry:block
	Use for complex components with multiple files.
	registry:component
	Use for simple components.
	registry:lib
	Use for lib and utils.
	registry:hook
	Use for hooks.
	registry:ui
	Use for UI components and single-file primitives
	registry:page
	Use for page or file-based routes.
	registry:file
	Use for miscellaneous files.
	registry:style
	Use for registry styles. eg. new-york
	registry:theme
	Use for themes.
	registry:item
	Use for universal registry items.
	author
The author property is used to specify the author of the registry item.
It can be unique to the registry item or the same as the author of the registry.
registry-item.json
Copy
{  "author": "John Doe <john@doe.com>"}
dependencies
The dependencies property is used to specify the dependencies of your registry item. This is for npm packages.
Use @version to specify the version of your registry item.
registry-item.json
Copy
{  "dependencies": [    "@radix-ui/react-accordion",    "zod",    "lucide-react",    "name@1.0.2"  ]}
registryDependencies
Used for registry dependencies. Can be names or URLs. Use the name of the item to reference shadcn/ui components and urls to reference other registries.
* For shadcn/ui registry items such as button, input, select, etc use the name eg. ['button', 'input', 'select'].
* For custom registry items use the URL of the registry item eg. ['https://example.com/r/hello-world.json'].
registry-item.json
Copy
{  "registryDependencies": [    "button",    "input",    "select",    "https://example.com/r/editor.json"  ]}
Note: The CLI will automatically resolve remote registry dependencies.
files
The files property is used to specify the files of your registry item. Each file has a path, type and target (optional) property.
The target property is required for registry:page and registry:file types.
registry-item.json
Copy
{  "files": [    {      "path": "registry/new-york/hello-world/page.tsx",      "type": "registry:page",      "target": "app/hello/page.tsx"    },    {      "path": "registry/new-york/hello-world/hello-world.tsx",      "type": "registry:component"    },    {      "path": "registry/new-york/hello-world/use-hello-world.ts",      "type": "registry:hook"    },    {      "path": "registry/new-york/hello-world/.env",      "type": "registry:file",      "target": "~/.env"    }  ]}
path
The path property is used to specify the path to the file in your registry. This path is used by the build script to parse, transform and build the registry JSON payload.
type
The type property is used to specify the type of the file. See the type section for more information.
target
The target property is used to indicate where the file should be placed in a project. This is optional and only required for registry:page and registry:file types.
By default, the shadcn cli will read a project's components.json file to determine the target path. For some files, such as routes or config you can specify the target path manually.
Use ~ to refer to the root of the project e.g ~/foo.config.js.
tailwind
DEPRECATED: Use cssVars.theme instead for Tailwind v4 projects.
The tailwind property is used for tailwind configuration such as theme, plugins and content.
You can use the tailwind.config property to add colors, animations and plugins to your registry item.
registry-item.json
Copy
{  "tailwind": {    "config": {      "theme": {        "extend": {          "colors": {            "brand": "hsl(var(--brand))"          },          "keyframes": {            "wiggle": {              "0%, 100%": { "transform": "rotate(-3deg)" },              "50%": { "transform": "rotate(3deg)" }            }          },          "animation": {            "wiggle": "wiggle 1s ease-in-out infinite"          }        }      }    }  }}
cssVars
Use to define CSS variables for your registry item.
registry-item.json
Copy
{  "cssVars": {    "theme": {      "font-heading": "Poppins, sans-serif"    },    "light": {      "brand": "20 14.3% 4.1%",      "radius": "0.5rem"    },    "dark": {      "brand": "20 14.3% 4.1%"    }  }}
css
Use css to add new rules to the project's CSS file eg. @layer base, @layer components, @utility, @keyframes, @plugin, etc.
registry-item.json
Copy
{  "css": {    "@plugin @tailwindcss/typography": {},    "@plugin foo": {},    "@layer base": {      "body": {        "font-size": "var(--text-base)",        "line-height": "1.5"      }    },    "@layer components": {      "button": {        "background-color": "var(--color-primary)",        "color": "var(--color-white)"      }    },    "@utility text-magic": {      "font-size": "var(--text-base)",      "line-height": "1.5"    },    "@keyframes wiggle": {      "0%, 100%": {        "transform": "rotate(-3deg)"      },      "50%": {        "transform": "rotate(3deg)"      }    }  }}
docs
Use docs to show custom documentation or message when installing your registry item via the CLI.
registry-item.json
Copy
{  "docs": "Remember to add the FOO_BAR environment variable to your .env file."}
categories
Use categories to organize your registry item.
registry-item.json
Copy
{  "categories": ["sidebar", "dashboard"]}
meta
Use meta to add additional metadata to your registry item. You can add any key/value pair that you want to be available to the registry item.
registry-item.json
Copy
{  "meta": { "foo": "bar" }}
registry.json
On This Page
Definitions$schemanametitledescriptiontypeauthordependenciesregistryDependenciesfilespathtypetargettailwindcssVarscssdocscategoriesmeta
Deploy your shadcn/ui app on Vercel
Trusted by OpenAI, Sonos, Adobe, and more.
Vercel provides tools and infrastructure to deploy apps and features at scale.
Deploy Now
Deploy to Vercel
Built by shadcn at Vercel. The source code is available on GitHub.
registry-item.json - shadcn/ui
Jan
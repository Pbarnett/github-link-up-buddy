# Radix Primitives, Colors, and Icons

## 📋 Document Directory & Navigation

### 📖 Overview
This document serves as the comprehensive reference for Radix Primitives, Colors, and Icons within the github-link-up-buddy project. It covers unstyled accessible components, color systems, iconography, implementation patterns, and integration strategies for building robust UI foundations.

### 🧭 Quick Navigation
- **Primitives**: Unstyled accessible components and headless UI patterns
- **Colors**: Color systems, palettes, and accessibility considerations
- **Icons**: Icon libraries, usage patterns, and customization
- **Integration**: Component composition and design system alignment
- **Advanced**: Performance optimization, accessibility, and best practices

### 📑 Detailed Table of Contents

#### 1. Radix Primitives Foundation
- 1.1 Introduction to Headless UI
- 1.2 Primitive Component Architecture
- 1.3 Accessibility Built-in Features
- 1.4 Installation and Setup
- 1.5 Core Concepts and Patterns
- 1.6 State Management Approach

#### 2. Core Primitive Components
- 2.1 Dialog and Modal Primitives
- 2.2 Dropdown and Popover Components
- 2.3 Form Control Primitives
- 2.4 Navigation and Menu Components
- 2.5 Data Display Primitives
- 2.6 Feedback and Notification Components

#### 3. Component Composition Patterns
- 3.1 Compound Component Architecture
- 3.2 Render Props and Children Patterns
- 3.3 Polymorphic Component Design
- 3.4 Slot-based Component Structure
- 3.5 Context and Provider Patterns
- 3.6 Custom Hook Integration

#### 4. Styling and Customization
- 4.1 CSS-in-JS Integration
- 4.2 Styled Components Patterns
- 4.3 Utility-First Styling Approach
- 4.4 Theme Integration Strategies
- 4.5 Responsive Design Implementation
- 4.6 Animation and Transition Patterns

#### 5. Radix Colors System
- 5.1 Color Scale Architecture
- 5.2 Semantic Color Mapping
- 5.3 Light and Dark Mode Support
- 5.4 Accessibility and Contrast
- 5.5 Alpha and Transparency Handling
- 5.6 Custom Color Scale Creation

#### 6. Color Implementation
- 6.1 Color Token Generation
- 6.2 CSS Variable Integration
- 6.3 Dynamic Color Switching
- 6.4 Color Palette Management
- 6.5 Brand Color Integration
- 6.6 Color Testing and Validation

#### 7. Icon System Foundation
- 7.1 Icon Library Overview
- 7.2 SVG Icon Architecture
- 7.3 Icon Sizing and Scaling
- 7.4 Icon Accessibility Features
- 7.5 Icon Naming Conventions
- 7.6 Icon Customization Options

#### 8. Icon Implementation Patterns
- 8.1 Icon Component Creation
- 8.2 Icon Sprite Management
- 8.3 Dynamic Icon Loading
- 8.4 Icon Theming and Variants
- 8.5 Icon Performance Optimization
- 8.6 Icon Testing Strategies

#### 9. Accessibility Implementation
- 9.1 Screen Reader Support
- 9.2 Keyboard Navigation Patterns
- 9.3 Focus Management
- 9.4 ARIA Attributes and Roles
- 9.5 Color Contrast Compliance
- 9.6 Accessibility Testing Tools

#### 10. Integration Strategies
- 10.1 React Integration Patterns
- 10.2 Next.js Implementation
- 10.3 TypeScript Support
- 10.4 Build Tool Configuration
- 10.5 Bundle Optimization
- 10.6 Development Workflow

#### 11. Project-Specific Implementation
- 11.1 GitHub Link-Up Buddy Integration
- 11.2 Component Library Architecture
- 11.3 Design System Alignment
- 11.4 Performance Considerations
- 11.5 Accessibility Compliance
- 11.6 Testing and Quality Assurance

#### 12. Advanced Patterns and Techniques
- 12.1 Custom Primitive Creation
- 12.2 Advanced State Management
- 12.3 Performance Optimization
- 12.4 Server-Side Rendering
- 12.5 Progressive Enhancement
- 12.6 Cross-Platform Compatibility

#### 13. Testing and Quality Assurance
- 13.1 Unit Testing Strategies
- 13.2 Integration Testing Patterns
- 13.3 Accessibility Testing
- 13.4 Visual Regression Testing
- 13.5 Performance Testing
- 13.6 Cross-Browser Testing

#### 14. Migration and Maintenance
- 14.1 Version Migration Guides
- 14.2 Breaking Changes Management
- 14.3 Deprecation Strategies
- 14.4 Backward Compatibility
- 14.5 Documentation Maintenance
- 14.6 Community Support

#### 15. Best Practices and Guidelines
- 15.1 Component Design Principles
- 15.2 Code Organization Patterns
- 15.3 Performance Best Practices
- 15.4 Accessibility Guidelines
- 15.5 Documentation Standards
- 15.6 Contributing Guidelines

#### 16. Troubleshooting and Support
- 16.1 Common Implementation Issues
- 16.2 Debugging Techniques
- 16.3 Performance Troubleshooting
- 16.4 Accessibility Debugging
- 16.5 Build and Runtime Errors
- 16.6 Community Resources

### 🔍 How to Use This Document
1. **Quick Reference**: Use the Quick Navigation for immediate access to major sections
2. **Detailed Search**: Use the numbered table of contents for specific topics
3. **Progressive Learning**: Sections are ordered from basic to advanced concepts
4. **Cross-References**: Look for internal links between related sections

### 🏷️ Search Keywords
`radix-primitives`, `headless-ui`, `accessible-components`, `radix-colors`, `color-system`, `icon-library`, `component-composition`, `accessibility`, `aria`, `keyboard-navigation`, `screen-reader`, `color-contrast`, `svg-icons`, `design-tokens`, `css-variables`, `styled-components`, `performance`, `testing`, `migration`, `best-practices`, `troubleshooting`

---
Introduction
An open-source UI component library for building high-quality, accessible design systems and web apps.
Radix Primitives is a low-level UI component library with a focus on accessibility, customization and developer experience. You can use these components either as the base layer of your design system, or adopt them incrementally.
Vision
Most of us share similar definitions for common UI patterns like accordion, checkbox, combobox, dialog, dropdown, select, slider, and tooltip. These UI patterns are 
documented by WAI-ARIA
 and generally understood by the community.
However, the implementations provided to us by the web platform are inadequate. They're either non-existent, lacking in functionality, or cannot be customized sufficiently.
So, developers are forced to build custom components; an incredibly difficult task. As a result, most components on the web are inaccessible, non-performant, and lacking important features.
Our goal is to create a well-funded, open-source component library that the community can use to build accessible design systems.
Key Features
Accessible
Components adhere to the 
WAI-ARIA design patterns
 where possible. We handle many of the difficult implementation details related to accessibility, including aria and role attributes, focus management, and keyboard navigation. Learn more in our 
accessibility
 overview.
Unstyled
Components ship without styles, giving you complete control over the look and feel. Components can be styled with any styling solution. Learn more in our 
styling
 guide.
Opened
Radix Primitives are designed to be customized to suit your needs. Our open component architecture provides you granular access to each component part, so you can wrap them and add your own event listeners, props, or refs.
Uncontrolled
Where applicable, components are uncontrolled by default but can also be controlled, alternatively. All of the behavior wiring is handled internally, so you can get up and running as smoothly as possible, without needing to create any local states.
Developer experience
One of our main goals is to provide the best possible developer experience. Radix Primitives provides a fully-typed API. All components share a similar API, creating a consistent and predictable experience. We've also implemented an asChild prop, giving users full control over the rendered element.
Incremental adoption
We recommend installing the radix-ui package and importing the primitives you need. This is the simplest way to get started, prevent version conflicts or duplication, and makes it easy to manage updates. The package is tree-shakeable, so you should only ship the components you use.
npm install radix-ui

import { Dialog, DropdownMenu, Tooltip } from "radix-ui";

Alternatively, each primitive can be installed individually:
npm install @radix-ui/react-dialog

npm install @radix-ui/react-dropdown-menu

npm install @radix-ui/react-tooltip

import * as Dialog from "@radix-ui/react-dialog";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import * as Tooltip from "@radix-ui/react-tooltip";

When installing separately, we recommend updating all Radix packages together to prevent duplication of shared dependencies and keep your bundle size down.
Community
To get involved with the Radix community, ask questions and share tips, 
Join our Discord
.
To receive updates on new primitives, announcements, blog posts, and general Radix tips, follow along on 
Bluesky
 or 
Twitter
.
To file issues, request features, and contribute, check out our GitHub.
GitHub repo


Code of conduct


Quick nav
Vision
Key Features
Accessible
Unstyled
Opened
Uncontrolled
Developer experience
Incremental adoption
Community
Next
Getting started
Edit this page on GitHub.

Getting started
A quick tutorial to get you up and running with Radix Primitives.
Implementing a Popover
In this quick tutorial, we will install and style the 
Popover
 component.
1. Install the primitive
Install Radix Primitives from your command line.
npm install radix-ui@latest

2. Import the parts
Import and structure the parts.
// index.jsx

import * as React from "react";

import { Popover } from "radix-ui";



const PopoverDemo = () => (

	<Popover.Root>

		<Popover.Trigger>More info</Popover.Trigger>

		<Popover.Portal>

			<Popover.Content>

				Some more info…

				<Popover.Arrow />

			</Popover.Content>

		</Popover.Portal>

	</Popover.Root>

);



export default PopoverDemo;

3. Add your styles
Add styles where desired.
// index.jsx

import * as React from "react";

import { Popover } from "radix-ui";

import "./styles.css";



const PopoverDemo = () => (

	<Popover.Root>

		<Popover.Trigger className="PopoverTrigger">Show info</Popover.Trigger>

		<Popover.Portal>

			<Popover.Content className="PopoverContent">

				Some content

				<Popover.Arrow className="PopoverArrow" />

			</Popover.Content>

		</Popover.Portal>

	</Popover.Root>

);



export default PopoverDemo;

/* styles.css */

.PopoverTrigger {

	background-color: white;

	border-radius: 4px;

}



.PopoverContent {

	border-radius: 4px;

	padding: 20px;

	width: 260px;

	background-color: white;

}



.PopoverArrow {

	fill: white;

}

Demo
Here's a complete demo.
More info
import * as React from "react";

import { Popover } from "radix-ui";

import "./styles.css";



const PopoverDemo = () => (

	<Popover.Root>

		<Popover.Trigger className="PopoverTrigger">More info</Popover.Trigger>

		<Popover.Portal>

			<Popover.Content className="PopoverContent" sideOffset={5}>

				Some more info…

				<Popover.Arrow className="PopoverArrow" />

			</Popover.Content>

		</Popover.Portal>

	</Popover.Root>

);



export default PopoverDemo;

Summary
The steps above outline briefly what's involved in using a Radix Primitive in your application.
These components are low-level enough to give you control over how you want to wrap them. You're free to introduce your own high-level API to better suit the needs of your team and product.
In a few simple steps, we've implemented a fully accessible Popover component, without having to worry about many of its complexities.
Adheres to 
WAI-ARIA
 design pattern.
Can be controlled or uncontrolled.
Customize side, alignment, offsets, collision handling.
Optionally render a pointing arrow.
Focus is fully managed and customizable.
Dismissing and layering behavior is highly customizable.
Quick nav
Implementing a Popover
1. Install the primitive
2. Import the parts
3. Add your styles
Demo
Summary
Previous
Introduction
Next
Accessibility
Edit this page on GitHub.
Getting started – Radix Primitives
Accessibility
Radix Primitives follow the WAI-ARIA authoring practices guidelines and are tested in a wide selection of modern browsers and commonly used assistive technologies.
We take care of many of the difficult implementation details related to accessibility, including aria and role attributes, focus management, and keyboard navigation. That means that users should be able to use our components as-is in most contexts and rely on functionality to follow the expected accessibility design patterns.
WAI-ARIA
WAI-ARIA
, published and maintained by the W3C, specifies the semantics for many common UI patterns that show up in Radix Primitives. This is designed to provide meaning for controls that aren't built using elements provided by the browser. For example, if you use a div instead of a button element to create a button, there are attributes you need to add to the div in order to convey that it's a button for screen readers or voice recognition tools.
In addition to semantics, there are behaviors that are expected from different types of components. A button element is going to respond to certain interactions in ways that a div will not, so it's up to the developer to reimplement those interactions with JavaScript. The 
WAI-ARIA authoring practices
 provide additional guidance for implementing behaviors for various controls that come with Radix Primitives.
Accessible Labels
With many built-in form controls, the native HTML label element is designed to provide semantic meaning and context for corresponding input elements. For non-form control elements, or for custom controls like those provided by Radix Primitives, 
WAI-ARIA provides a specification
 for how to provide accessible names and descriptions to those controls.
Where possible, Radix Primitives include abstractions to make labelling our controls simple. The 
Label
 primitive is designed to work with many of our controls. Ultimately it's up to you to provide those labels so that users have the proper context when navigating your application.
Keyboard Navigation
Many complex components, like 
Tabs
 and 
Dialog
, come with expectations from users on how to interact with their content using a keyboard or other non-mouse input modalities. Radix Primitives provide basic keyboard support in accordance with the 
WAI-ARIA authoring practices
.
Focus Management
Proper keyboard navigation and good labelling often go hand-in-hand with managing focus. When a user interacts with an element and something changes as a result, it's often helpful to move focus with the interaction so that the next tab stop is logical depending on the new context of the app. And for screen reader users, moving focus often results in an announcement to convey this new context, which relies on proper labelling.
In many Radix Primitives, we move focus based on the interactions a user normally takes in a given component. For example, in 
AlertDialog
, when the modal is opened, focus is programmatically moved to a Cancel button element to anticipate a response to the prompt.
Quick nav
WAI-ARIA
Accessible Labels
Keyboard Navigation
Focus Management
Previous
Getting started
Next
Releases
Edit this page on GitHub.
Accessibility – Radix Primitives
Releases
Radix Primitives releases and their changelogs.
May 5, 2025
This release introduces a brand new primitive in preview: 
PasswordToggleField
.
This new primitive provides components for rendering a password input alongside a button to toggle its visibility. Aside from its primary functionality, it also includes:
Returning focus to the input when toggling with a pointer
Maintaining focus when toggling with keyboard or virtual navigation
Resetting visibility to hidden after form submission to prevent accidental storage
Implicit accessible labeling for icon-based toggle buttons
This API is currently unstable, and we hope you'll help us test it out! Import the primitive using the unstable_ prefix.
import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";



export function PasswordField() {

	return (

		<PasswordToggleField.Root>

			<PasswordToggleField.Input />

			<PasswordToggleField.Toggle>

				<PasswordToggleField.Icon
					visible={<EyeOpenIcon />}
					hidden={<EyeClosedIcon />}
				/>

			</PasswordToggleField.Toggle>

		</PasswordToggleField.Root>

	);

}

Other updates
Add unstable Provider, Trigger and BubbleInput parts to Checkbox (
#3459
)
Update default input type to text and pass to the underlying input element (
#3510
)
April 22, 2025
Update the dependency for use-sync-external-store to ensure entrypoint is valid – 
#3491


April 17, 2025
This release introduces a brand new primitive in preview: 
OneTimePasswordField
.
This new group of components are designed to implement a common design pattern for one-time password fields displayed as separate input fields for each character. This UI is deceptively complex to implement in such a way that interactions follow user expectations. The new primitive handles all of this complexity for you, including:
Keyboard navigation mimicking the behavior of a single input field
Overriding values on paste
Password manager autofill support
Input validation for numeric and alphanumeric values
Auto-submit on completion
Focus management
Hidden input to provide a single value to form data
As this is a preview release, the API is currently unstable. We hope you'll help us test it out and let us know how it goes.
Import the primitive using the unstable_ prefix.
import { unstable_OneTimePasswordField as OneTimePasswordField } from "radix-ui";



export function Verify() {

	return (

		<OneTimePasswordField.Root>

			<OneTimePasswordField.Input />

			<OneTimePasswordField.Input />

			<OneTimePasswordField.Input />

			<OneTimePasswordField.Input />

			<OneTimePasswordField.Input />

			<OneTimePasswordField.Input />

			<OneTimePasswordField.HiddenInput />

		</OneTimePasswordField.Root>

	);

}

Other updates
All form controls with internal bubble inputs now use the Radix Primitive component by default. This will allow us to expose these components in a future release so users can better control this behavior in the future.
Minor improvements to useControllableState to enhance performance, reduce surface area for bugs, and log warnings when misused
April 8, 2025
Improved rendering performance for the Tooltip provider – 
#2720


Ensure Tooltip is closed when pointerdown is fired on the trigger – 
#3380


Add support for crossOrigin in Avatar images – 
#3261


Fix Avatar flashing when an image is already cached – 
#3008


Improve displayName for better debugging of slottable components – 
#3441


February 5, 2025
Updated dependencies to remove peer dependency warnings for react and react-dom – 
#3350


Skip forwarding refs to SlotClone when the child is a Fragment – 
#3229


January 22, 2025
Added a radix-ui package that exposes the latest version of all Radix Primitives from a single place. This tree-shakable entrypoint makes it easier to bring in whatever components you need and keep them up-to-date without worrying about conflicting or duplicate dependencies.
Updated aria-hidden and react-remove-scroll dependencies for the following components:
Alert Dialog
Context Menu
Dialog
Dropdown Menu
Hover Card
Menubar
Navigation Menu
Popover
Select
Toast
Tooltip


October 1, 2024
Alert Dialog
1.1.2
Fix allowPinchZoom bug for trackpad users – 
#3127


Avatar
1.1.1
Check for referrerPolicy when checking the image loading status – 
#2772


Checkbox
1.1.2
Fix a bug where defaultChecked unexpectedly changed for uncontrolled checkboxes – 
#2135


Forward the form prop to the bubble input element to fix non-parent form submissions – 
#3161


Dialog
1.1.2
Fix allowPinchZoom bug for trackpad users – 
#3127


Radio Group
1.2.1
Forward the form prop to the bubble input element to fix non-parent form submissions – 
#3161


Scroll Area
1.2.0
Fix asChild prop not working as expected on the Viewport – 
#2945


Update internal styles to fix other issues with Viewport – 
#2945


Select
2.1.2
Fix error thrown when items are initially undefined – 
#2623


Fix several bugs for touch devices – 
#2939


Forward the form prop to the bubble input element to fix non-parent form submissions – 
#3161


Fix position bug where popover may start off-screen for long items – 
#3149


Slider
1.2.1
Forward the root form prop to each thumb's bubble input element to fix non-parent form submissions – 
#3161


Switch
1.1.1
Forward the form prop to the bubble input element to fix non-parent form submissions – 
#3161


Toast
1.2.2
Fix incorrect focus when hotkey is an empty array – 
#2491


June 28, 2024
Checkbox
1.1.1
Export CheckedState type
Tooltip
1.1.2
Export TooltipProviderProps type
June 21, 2024
Portal
1.1.1
Add a missing internal utility to package.json. The corresponding packages that provide a Portal part also received a patch update. – 
#2966


June 19, 2024
All primitives

Released minor versions for all primitives with the following changes:
Full React 19 compatability – 
#2952


Full RSC compatibility – 
#2923


Internal build tooling changes – 
#2922
 – 
#2931


Update and pin react-remove-scroll dependency version to avoid double scrollbar bugs in edge cases – 
#2776


Don’t scroll menu items in response to hover – 
#2451


Make sure that components that close on Escape key press capture the corresponding keyboard event. This way you can call stopPropagation in onEscapeKeyDown if you need more control rendering Radix components within another component that closes on Escape key press.
Make sure that components with roving focus do not interfere with browser or system hotkeys, such as back navigation – 
#2739


Make sure that components that support hideWhenDetached prop do not allow interactions with hidden content – 
#2743
 – 
#2745


Dialog
1.1.0
Log an error when an accessible title via the Dialog.Title part is missing – 
#2948


Log a warning when an accessible description via the Dialog.Description part is missing – 
#2948


Label
2.1.0
Make sure that the component doesn’t interfere when clicking on the spinner of a number input
Navigation Menu
1.2.0
Remove unsupported disableOutsidePointerEvents prop
Portal
1.1.0
Fix hydration error in SSR on the initial render – 
#2923


Progress
1.2.0
Explicitly allow value={undefined} to represent an indeterminate state, matching the current practical behaviour – 
#2947


Select
2.1.0
Add nonce prop to be able to pass CSP nonce to the inline styles – 
#2728


Scroll Area
1.1.0
Add nonce prop to be able to pass CSP nonce to the inline styles – 
#2728


September 25, 2023
Alert Dialog
1.0.5
Fix pointer-events issue when clicking outside – 
#2177


Fix Portal part types lying about accepting DOM props – 
#2178


Avatar
1.0.4
Prevent image flash – 
#2340


Context Menu
2.1.5
Fix pointer-events issue when clicking outside – 
#2177


Fix Portal part types lying about accepting DOM props – 
#2178


Dialog
1.0.5
Fix pointer-events issue when clicking outside – 
#2177


Fix Portal part types lying about accepting DOM props – 
#2178


Dropdown Menu
2.0.6
Fix pointer-events issue when clicking outside – 
#2177


Fix Portal part types lying about accepting DOM props – 
#2178


Hover Card
1.0.7
Fix pointer-events issue when clicking outside – 
#2177


Fix Portal part types lying about accepting DOM props – 
#2178


Menubar
1.0.4
Fix pointer-events issue when clicking outside – 
#2177


Fix Portal part types lying about accepting DOM props – 
#2178


Navigation Menu
1.1.4
Fix pointer-events issue when clicking outside – 
#2177


Fix Portal part types lying about accepting DOM props – 
#2178


Popover
1.0.7
Fix pointer-events issue when clicking outside – 
#2177


Fix Portal part types lying about accepting DOM props – 
#2178


Fix Popover nested inside Dialog not opening – 
#2182


Scroll Area
1.0.5
Add scroll-behavior: smooth compatibility – 
#2175


Select
2.0.0Major
[Breaking] Add ability to reset to placeholder using "" value. Note that this is only a breaking change if you were using an option with a value of "". – 
#2174


Fix pointer-events issue when clicking outside – 
#2177


Fix Portal part types lying about accepting DOM props – 
#2178


Toast
1.1.5
Fix pointer-events issue when clicking outside – 
#2177


Tooltip
1.0.7
Fix pointer-events issue when clicking outside – 
#2177


Fix Portal part types lying about accepting DOM props – 
#2178


Fix issue with boundary padding calculations – 
#2185


Add option to always re-position Content on the fly – 
#2092


May 26, 2023
This release ensures all of our primitives are ESM compatible. We have also updated to the latest version of 
Floating UI
 for all of our popper-positioned primitives.
All primitives
Improve ESM compatibility – 
#2130


Fix possible upstream compiler errors (@types/react phantom dependency) – 
#1896


Context Menu
2.1.4
Position content correctly when matching trigger size – 
#1995


Dialog
1.0.4
Prevent non-modal dialog from re-opening when closing using trigger in Safari – 
#2110


Ensure focus trapping is maintained when the focused item is deleted – 
#2145


Dropdown Menu
2.0.5
Position content correctly when matching trigger size – 
#1995


Hover Card
1.0.6
Position content correctly when matching trigger size – 
#1995


Menubar
1.0.3
Position content correctly when matching trigger size – 
#1995


Navigation Menu
1.1.3
Do not close when clicking items and meta key is down – 
#2080


Popover
1.0.6
Position content correctly when matching trigger size – 
#1995


Prevent non-modal popover from re-opening when closing using trigger in Safari – 
#2110


Ensure --radix-popper-available-width is calculated correctly when using collisionBoundary – 
#2032


Select
1.2.2
Position content correctly when matching trigger size – 
#1995


Improve scroll buttons touch screen support – 
#1771


Slider
1.1.2
Clamp thumb position within range – 
#1988


Slot
1.0.2
Ensure Slot can be used in a React Server Component – 
#2116


Tooltip
1.0.6
Position content correctly when matching trigger size – 
#1995


Improve large content hoverability – 
#2155


March 8, 2023
This release introduces a brand new primitive in preview: 
Form
.
Form
0.0.2Preview
New primitive – 
#1998


February 24, 2023
Checkbox
1.0.2
Reset checkbox state when form is reset – 
#1733


ContextMenu
2.1.2
Expose new CSS custom properties to enable size constraints – 
#1942


Don't exit fullscreen mode when pressing escape to dismiss from submenu – 
#1752


Relax onCheckedChange type on ContextMenu.CheckboxItem – 
#1778


DropdownMenu
2.0.3
Expose new CSS custom properties to enable size constraints – 
#1942


Don't exit fullscreen mode when pressing escape to dismiss from submenu – 
#1752


Relax onCheckedChange type on DropdownMenu.CheckboxItem – 
#1778


HoverCard
1.0.4
Expose new CSS custom properties to enable size constraints – 
#1942


Menubar
1.0.1
Expose new CSS custom properties to enable size constraints – 
#1943


Don't exit fullscreen mode when pressing escape to dismiss from submenu – 
#1752


Relax onCheckedChange type on Menubar.CheckboxItem – 
#1778


Popover
1.0.4
Expose new CSS custom properties to enable size constraints – 
#1942


Tooltip
1.0.4
Expose new CSS custom properties to enable size constraints – 
#1942


January 17, 2023
This release introduces a brand new primitive: 
Menubar
. It also adds support for a highly requested feature for 
Select
: the ability to position the content in a similar way to Popover or DropdownMenu.
Accordion
1.1.0
Add horizontal orientation support with new orientation prop, as well as RTL support with dir – 
#1850


Context Menu
2.1.1
Fix consistency issue with RTL positioning – 
#1890


Dropdown Menu
2.0.2
Fix consistency issue with RTL positioning – 
#1890


Hover Card
1.0.3
Fix consistency issue with RTL positioning – 
#1890


Menubar
1.0.0Major
New primitive – 
#1846


Popover
1.0.3
Fix consistency issue with RTL positioning – 
#1890


Select
1.2.0
Add position prop to Select.Content to enable popper positioning – 
#1853


Tooltip
1.0.3
Fix consistency issue with RTL positioning – 
#1890


December 14, 2022
Context Menu
2.1.0
Add disabled prop to ContextMenu.Trigger – 
#1746


November 15, 2022
Select
1.1.2
Fix invalid pointerId in Cypress when running Firefox – 
#1753


October 17, 2022
Accordion
1.0.1
Fix initial animation playback in Firefox and Safari – 
#1710


Alert Dialog
1.0.2
Fix issue with textarea elements not being scrollable in Firefox – 
#1550


Collapsible
1.0.1
Fix initial animation playback in Firefox and Safari – 
#1710


Context Menu
2.0.1Major
[Breaking] Add support for indeterminate state on ContextMenu.CheckboxItem. Note that this is only a breaking change if you are currently using the CheckboxItem part and your codebase is written in TypeScript. – 
#1624


Dialog
1.0.2
Fix issue with textarea elements not being scrollable in Firefox – 
#1550


Dropdown Menu
2.0.1Major
[Breaking] Add support for indeterminate state on DropdownMenu.CheckboxItem. Note that this is only a breaking change if you are currently using the CheckboxItem part and your codebase is written in TypeScript. – 
#1624


Correctly pair DropdownMenu.Trigger open state with aria-expanded when closed – 
#1644


Fix issue with eager selection of items when using asChild – 
#1647


Fix issue with dismissing when the component is used in a separate popup window – 
#1677


Hover Card
1.0.2
Improve text selection experience – 
#1692


Label
2.0.0Major
[Breaking] Remove useLabelContext and support for fully custom controls. For native labelling to work, ensure your custom controls are based on native elements such as button or input. – 
#1686


Improve native behavior by using the native label element – 
#1686


Navigation Menu
1.1.1
Prevent menu from re-opening with the pointer after being dismissed with escape – 
#1579


Add delayDuration and skipDelayDuration props to NavigationMenu.Root. Note that by default, triggers now have a brief delay before opening in order to improve UX, this can be modified using the props provided. – 
#1716


Radio Group
1.1.0
Add disabled prop to RadioGroup.Root – 
#1530


Fix issue where RadioGroup.Root was focusable when all items were disabled – 
#1530


Select
1.1.1
Add disabled prop to Select.Root – 
#1699


Add required prop to Select.Root – 
#1598


Slider
1.1.0
Add ability to visually invert the slider using the new inverted prop on Slider.Root – 
#1695


Add onValueCommit prop to Slider.Root to better handle discrete value changes – 
#1696


Slot
1.0.1
Stop eagerly creating callback props – 
#1713


Toast
1.1.1
Fix regression with screen readers announcing as "group" rather than "status" – 
#1556


Fix regression with ref assignments on child elements returning null – 
#1668


Add onPause and onResume props to Toast.Root – 
#1669


Fix timer reset issue which would cause toasts to dismiss early in some cases – 
#1682


Toolbar
1.0.1
Prevent Toolbar.Item click handlers firing twice – 
#1526


Tooltip
1.0.2
Ensure tooltip doesn't open if interacting with the trigger before the open timer expires – 
#1693


July 21, 2022
With this release, we start following semantic versioning strictly. All primitives are now versioned 1.0.0.
We also move the 
Select
, 
Toast
 and 
NavigationMenu
 from preview to stable.
All primitives
Improve support for React 18 – 
#1329


[Breaking] Improve RTL performance. You need to use 
DirectionProvider
 if you were relying on dir attribute inheritance from document (or any element). – 
#1119


Alert Dialog
1.0.0Major
[Breaking] Remove allowPinchZoom prop, now defaults to true – 
#1514


Improve compatibility with JS animation libraries with forceMount on AlertDialog.Portal – 
#1075


Fix regressions with page interactivity while/after closing dialog – 
#1401


Context Menu
1.0.0Major
[Breaking] Improve indirect nesting of context menus. Submenus must now be created using explicit parts. – 
#1394


[Breaking] Remove allowPinchZoom prop, now defaults to true – 
#1514


[Breaking] Add new Portal part. To avoid regressions, use this part if you want portalling behavior. Note that z-index isn't managed anymore so you have full control of layering. – 
#1429


[Breaking] Remove offset on Arrow part – 
#1531


[Breaking] Rename collisionTolerance to collisionPadding on Content part and accepts a number or a padding object – 
#1531


Fix issue with native context menu appearing in React 18 – 
#1378


Add data-highlighted attribute to support styling – 
#1388


Add data-state attribute to Trigger part – 
#1455


Add collisionBoundary, arrowPadding, sticky, hideWhenDetached props on Content part – 
#1531


Dialog
1.0.0Major
[Breaking] Remove allowPinchZoom prop, now defaults to true – 
#1514


Improve compatibility with JS animation libraries with forceMount on Dialog.Portal – 
#1075


Fix regressions with page interactivity while/after closing dialog – 
#1401


Dropdown Menu
1.0.0Major
[Breaking] Improve indirect nesting of dropdown menus. Submenus must now be created using explicit parts. – 
#1394


[Breaking] Remove allowPinchZoom prop, now defaults to true – 
#1514


[Breaking] Add new Portal part. To avoid regressions, use this part if you want portalling behavior. Note that z-index isn't managed anymore so you have full control of layering. – 
#1429


[Breaking] Remove offset on Arrow part – 
#1531


[Breaking] Rename collisionTolerance to collisionPadding on Content part and accepts a number or a padding object – 
#1531


Add data-highlighted attribute to support styling – 
#1388


Prevent escape key from exiting fullscreen mode in Firefox & Safari – 
#1423


Add collisionBoundary, arrowPadding, sticky, hideWhenDetached props on Content part – 
#1531


Hover Card
1.0.0Major
[Breaking] Add new Portal part. To avoid regressions, use this part if you want portalling behavior. Note that z-index isn't managed anymore so you have full control of layering. – 
#1426


[Breaking] Remove offset on Arrow part – 
#1531


[Breaking] Rename collisionTolerance to collisionPadding on Content part and accepts a number or a padding object – 
#1531


Add collisionBoundary, arrowPadding, sticky, hideWhenDetached props on Content part – 
#1531


Navigation Menu
1.0.0Major
Ensure menu closes after clicking NavigationMenu.Link – 
#1347


Add onSelect prop to NavigationMenu.Link – 
#1372


Popover
1.0.0Major
[Breaking] Remove allowPinchZoom prop, now defaults to true – 
#1514


[Breaking] Add new Portal part. To avoid regressions, use this part if you want portalling behavior. Note that z-index isn't managed anymore so you have full control of layering. – 
#1425


[Breaking] Remove offset on Arrow part – 
#1531


[Breaking] Rename collisionTolerance to collisionPadding on Content part and accepts a number or a padding object – 
#1531


Add collisionBoundary, arrowPadding, sticky, hideWhenDetached props on Content part – 
#1531


Portal
1.0.0Major
[Breaking] Note that z-index isn't managed anymore so you have full control of layering. The prop to provide a custom container evolves from containerRef (ref) to container (element). The data-radix-portal was removed because you can use asChild to control the element. – 
#1463


RadioGroup
1.0.0Major
Add aria-required to root – 
#1422


Scroll Area
1.0.0Major
ScrollArea.Thumb is now animatable – 
#1392


Select
1.0.0Major
[Breaking] Renamed data-state values from active|inactive to checked|unchecked – 
#1388


[Breaking] Add new Portal part. To avoid regressions, use this part if you want portalling behavior. Note that z-index isn't managed anymore so you have full control of layering. – 
#1459


Fix position breaking when using asChild on Select.Content – 
#1245


Improve trigger/content alignment when Select.Content has padding – 
#1312


Fix trigger/content alignment when there are less than 5 items – 
#1355


Support trigger/content alignment when no value is provided – 
#1379


Add data-highlighted attribute to support styling – 
#1388


Add support for placeholder via placeholder prop on Select.Value – 
#1384


Resolve value mismatch with underlying native select – 
#1421


Slot
1.0.0Major
Fix issue with children ordering when using Slottable – 
#1376


Tabs
1.0.0Major
Add support for lifecycle animation to Tabs.Content – 
#1346


Toast
1.0.0Major
[Breaking] The default toast order has changed, they now render top to bottom from oldest to newest – 
#1469


Improve Typescript types when using asChild – 
#1300


Fix issue with toast reordering when updating React's key prop – 
#1283


Improve compatability with animation libraries – 
#1468


Tooltip
1.0.0Major
[Breaking] Add new Portal part. To avoid regressions, use this part if you want portalling behavior. Note that z-index isn't managed anymore so you have full control of layering. – 
#1427


[Breaking] By default Tooltip.Content will remain open when hovering (WCAG 2.1 Content on Hover compliance). disableHoverableContent can be supplied to Tooltip.Provider to restore previous behavior – 
#1490


[Breaking] side on Tooltip.Content now defaults to top – 
#1490


[Breaking] Tooltip.Provider is now required, you must wrap your app to avoid regressions. – 
#1490


[Breaking] Remove offset on Arrow part – 
#1531


[Breaking] Rename collisionTolerance to collisionPadding on Content part and accepts a number or a padding object – 
#1531


Improve layering of tooltip with other primitives – 
#1314


Fix tooltip closing when transforming/animation trigger – 
#937


Add collisionBoundary, arrowPadding, sticky, hideWhenDetached props on Content part – 
#1531


February 28, 2022
This release introduces 3 brand new primitives in preview: 
Select
, 
Toast
 and 
NavigationMenu
, whilst also shipping a ton of fixes and improvements.
Accordion
0.1.6
Prevent form submission when pressing Accordion.Trigger – 
#1085


Fix animation issue with React 18 – 
#1125


Alert Dialog
0.1.7
Improve pointer-events management – 
#1079


Checkbox
0.1.5
Prevent activation via enter key – 
#1104


Collapsible
0.1.6
Fix animation issue with React 18 – 
#1125


Context Menu
0.1.6
Prevent DropdownMenu.TriggerItem click from firing twice – 
#1057


Improve idle performance – 
#1040


Dialog
0.1.7Major
Improve pointer-events management – 
#1079


[Breaking] Dialog.Title is now a required part so will throw an error if not used. aria-describedby={undefined} must be passed to Dialog.Content if no description is needed. – 
#1098


Dropdown Menu
0.1.6
Improve composability with Dialog/AlertDialog – 
#1097


Prevent clicking trigger to close from immediately reopening in non-modal mode – 
#1059


Prevent DropdownMenu.TriggerItem click from firing twice – 
#1057


Improve idle performance – 
#1040


Navigation Menu
0.1.2Preview
New primitive – 
#1172


Radio Group
0.1.5
Prevent activation via enter key – 
#1104


Select
0.1.1Preview
New primitive – 
#1169


Slider
0.1.4
Prevent page scroll when using Home and End keys – 
#1076


Tabs
0.1.5
Prevent accidental focus activation via right click – 
#1114


Toast
0.1.1Preview
New primitive – 
#1165


Toggle Group
0.1.5
Improve accessibility by using radio role for single toggle group – 
#1118


December 13, 2021
This release focuses on React 18 support and introduces a number of breaking changes to some packages, mostly related to portalling dialogs.
All primitives
[Breaking] Deprecate IdProvider. Improves support for React 18 going forward and is no longer needed in older versions. Remove from your app to avoid deprecation warnings. – 
#1006


Accordion
0.1.5Major
Improve React 18 support – 
#984


Improve dev mode errors with mismatched type and value props – 
#979


Prevent Accordion.Content height animation on initial page load – 
#977


Alert Dialog
0.1.5Major
[Breaking] Add new Portal part. To avoid regressions, use this part if you want portalling behavior. – 
#936


[Breaking] Support scrolling within AlertDialog.Overlay. Move allowPinchZoom to root. – 
#963


Fix asChild TypeScript error – 
#924


Collapsible
0.1.5
Prevent Collapsible.Content height animation on initial page load – 
#977


Dialog
0.1.5Major
[Breaking] Add new Portal part. To avoid regressions, use this part if you want portalling behavior. – 
#936


[Breaking] Support scrolling within Dialog.Overlay. Move allowPinchZoom to root. – 
#963


Dropdown Menu
0.1.4
Prevent disabled trigger from opening menu – 
#974


Hover Card
0.1.3
Fix ability to focus HoverCard when inside a dialog – 
#920


Radio Group
0.1.4
Prevent programmatic focus from changing value – 
#939


Tabs
0.1.4Major
[Breaking] Change Tabs.Trigger to button element – 
#981


Improve TSDocs – 
#978


Toggle Group
0.1.4
Remove invalid aria-orientation attribute on role=group element – 
#965


Toolbar
0.1.4
Fix asChild TypeScript error – 
#924


Remove invalid toolbaritem role – 
#950


Tooltip
0.1.6Major
[Breaking] Add new TooltipProvider part. You must wrap your app to avoid regressions. – 
#1007


[Breaking] Remove type=button attribute from Tooltip.Trigger – 
#1011


Fix tooltip activation regression – 
#1035


Slot
0.1.2
Fix key warnings – 
#1015


October 15, 2021
All primitives
All primitives are now versioned 0.1.1
Fix composability issues between primitives by scoping context – 
#906


Fix CSS unmount animations – 
#851


Accordion
0.1.1
Add new CSS variable to Accordion.Content to help with width animations – 
#879


Alert Dialog
0.1.1Major
Improve composability with Dialog – 
#906


[Breaking] Remove AlertDialog.Content onInteractOutside prop – 
#846


Dialog
0.1.1
Improve composability with AlertDialog – 
#906


Add pinch to zoom support to DropdownMenu.Content via allowPinchZoom prop – 
#884


Context Menu
0.1.1
Add pinch to zoom support to ContextMenu.Content via allowPinchZoom prop – 
#884


Prevent scroll via arrow keypress on submenu triggers – 
#908


Collapsible
0.1.1
Add new CSS variable to Collapsible.Content to help with width animations – 
#879


Checkbox
0.1.1
Prevent screen reader virtual cursor from accessing hidden input – 
#870


Dropdown Menu
0.1.1
Improve composability with Tooltip – 
#906


Add pinch to zoom support to DropdownMenu.Content via allowPinchZoom prop – 
#884


Prevent scroll via arrow keypress on submenu triggers – 
#908


Hover Card
0.1.1
Open on focus to improve keyboard support – 
#902


Compose correct pointer events internally – 
#893


Label
0.1.1
Allow its children to prevent event propagation – 
#861


Radio Group
0.1.1
Prevent screen reader virtual cursor from accessing hidden inputs – 
#870


Popover
0.1.1
Add pinch to zoom support to Popover.Content via allowPinchZoom prop – 
#884


Slider
0.1.1
Fix calculations when value is 0 – 
#866


Switch
0.1.1
Prevent screen reader virtual cursor from accessing hidden input – 
#870


Tabs
0.1.1Major
[Breaking] Unmount content within Tabs.Content when tab is inactive – 
#859


September 7, 2021
All primitives
All primitives moved to Beta and are now versioned 0.1.0
[Breaking] Replace polymorphic as prop with asChild boolean prop. Learn more about how to 
change the rendered element here
 – 
#835


Dialog
0.1.0
Improve composability with DropdownMenu – 
#818


Dropdown Menu
0.1.0
Improve composability with Dialog – 
#818


Re-enable pointer-events when closed – 
#819


Prevent body text from selecting on close (Firefox) – 
#812


Ensure sub triggers receive focus on click (iOS Safari) – 
#820


Primitive
0.1.0Major
[Breaking] Deprecate extendPrimitive utility – 
#840


August 4, 2021
All primitives
Improve polymorphic types performance – 
#784


Alert Dialog
0.0.20Major
[Breaking] Remove AlertDialog.Content onPointerDownOutside prop – 
#700


Prevent outside pointer events triggering prematurely on touch devices – 
#767


Context Menu
0.0.24Major
Add modality support via modal prop – 
#700


[Breaking] Remove ContextMenu.Content disableOutsidePointerEvents prop – 
#700


Prevent outside pointer events triggering prematurely on touch devices – 
#767


Dialog
0.0.20
Add modality support via modal prop – 
#700


Improve animation rendering in React 18 – 
#776


Ensure focus is restored to trigger on close when using the autofocus attribute on a child element – 
#739


Prevent outside pointer events triggering prematurely on touch devices – 
#767


Ensure iOS Safari consistently focuses the first focusable element – 
#776


Dropdown Menu
0.0.23Major
Add modality support via modal prop – 
#700


[Breaking] Remove DropdownMenu.Content disableOutsideScroll prop – 
#700


[Breaking] Remove DropdownMenu.Content disableOutsidePointerEvents prop – 
#700


Prevent outside pointer events triggering prematurely on touch devices – 
#767


Popover
0.0.20Major
Add modality support via modal prop – 
#700


[Breaking] Remove Popover.Content disableOutsideScroll prop – 
#700


[Breaking] Remove Popover.Content disableOutsidePointerEvents prop – 
#700


[Breaking] Remove Popover.Content trapFocus prop – 
#700


Improve animation rendering in React 18 – 
#776


Ensure focus is restored to trigger on close when using the autofocus attribute on a child element – 
#739


Prevent outside pointer events triggering prematurely on touch devices – 
#767


Ensure iOS Safari consistently focuses the first focusable element – 
#776


Scroll Area
0.0.16
Add data-state to ScrollBar part – 
#801


Slider
0.0.17
Prevent thumb receiving focus when disabled – 
#777


Prevent focus loss on thumb when using React.StrictMode – 
#794


June 24, 2021
Context Menu
0.0.23
Can now be triggered on touch with a long press – 
#743


Dialog
0.0.19
Add optional Title and Description parts for simpler labelling – 
#741


Scroll Area
0.0.15
Add data-orientation to Scrollbar for styling convenience – 
#720


Fix forceMount type issue on Scrollbar – 
#738


Slider
0.0.16
Ensure the correct thumb is focused when using keyboard and crossing another thumb – 
#731


Ensure only one arrow press is needed when crossing another thumb – 
#733


Slot
0.0.12
Improve types compatibility – 
#737


Toggle Group
0.0.10
Ensure only one click is needed to toggle a single controlled toggle group – 
#722


Ensure focus behavior is consistent on Safari – 
#727


June 15, 2021
All primitives
Improve polymorphic types – 
#648


Accordion
0.0.16Major
[Breaking] Rename Accordion.Button to Accordion.Trigger – 
#651


[Breaking] Rename Accordion.Panel to Accordion.Content – 
#651


[Breaking] Rename custom property accordingly (--radix-accordion-content-height) – 
#651


[Breaking] type=“single” Accordion now has a new collapsible prop which is false by default. This means that the default behavior has now changed. By default a user cannot close all items. – 
#651


Alert Dialog
0.0.18Major
[Breaking] Allow preventing default in onPointerDownOutside without inadvertently preventing focus – 
#654


Checkbox
0.0.16Major
[Breaking] onCheckedChange(event) is now onCheckedChange(checked: CheckedState) – 
#672


Improve compatibility with native form validation – 
#650


Allow stopping propagation on Checkbox onClick – 
#672


Improve compatibility with native label – 
#672


Improve accessibility when wrapped in native label – 
#672


Collapsible
0.0.16Major
[Breaking] Rename Collapsible.Button to Collapsible.Trigger – 
#651


Context Menu
0.0.22Major
Add submenu support – 
#682


Add ContextMenu.TriggerItem – 
#682


Add ContextMenu.Arrow – 
#682


Add dir prop for RTL support with submenus – 
#682


[Breaking] Allow preventing default in onPointerDownOutside without inadvertently preventing focus – 
#654


[Breaking] Remove ContextMenu.Content side prop – 
#658


[Breaking] Remove ContextMenu.Content align prop – 
#658


[Breaking] If you had sideOffset on ContextMenu.Content before, you should now use alignOffset. This is to standardize vertical alignment for both root and sub-menus. – 
#712


[Breaking] onFocusOutside is now a custom event – 
#671


Improve support of content and item with no padding – 
#658


Align with WAI-ARIA spec by focusing first item when opening via keyboard – 
#694


Dialog
0.0.18Major
[Breaking] Allow preventing default in onPointerDownOutside without inadvertently preventing focus – 
#654


Dropdown Menu
0.0.21Major
Add submenu support – 
#682


Add DropdownMenu.TriggerItem – 
#682


Add dir prop for RTL support with submenus – 
#682


[Breaking] Allow preventing default in onPointerDownOutside without inadvertently preventing focus – 
#654


[Breaking] onFocusOutside is now a custom event – 
#671


[Breaking] The up arrow no longer opens the menu – 
#702


Align with WAI-ARIA spec by focusing first item when opening via keyboard – 
#694


Popover
0.0.18Major
[Breaking] Allow preventing default in onPointerDownOutside without inadvertently preventing focus – 
#654


[Breaking] onFocusOutside is now a custom event – 
#671


Radio Group
0.0.17Major
[Breaking] onValueChange(event) is now onValueChange(value: string) – 
#685


[Breaking] Remove RadioGroup.Item onCheckedChange prop – 
#685


Improve compatibility with native form validation – 
#650


Improve usage within forms – 
#685


Scroll Area
0.0.14Major
Brand new version with a simpler API – 
#624


Improve Safari support – 
#624


Improve RTL support – 
#624


Improve touch support – 
#624


Scrollbar mount/unmount can now be animated – 
#624


Add minimum width/height to thumb so it's always grabbable – 
#624


Move functional CSS into component to improve DX – 
#624


Bundle size significantly reduced – 
#624


[Breaking] Remove overflowX and overflowY props – 
#624


[Breaking] Remove ScrollAreaButtonStart, ScrollAreaButtonEnd and ScrollAreaTrack – 
#624


[Breaking] Rename scrollbarVisibility prop to type. The values are auto, always, scroll or hover – 
#624


[Breaking] Rename scrollbarVisibilityRestTimeout prop to scrollHideDelay – 
#624


[Breaking] Remove trackClickBehavior prop as we've removed built-in animation. Clicking on track always snaps to pointer position – 
#624


[Breaking] ScrollAreaScrollbarX and ScrollAreaScrollbarY are now <ScrollAreaScrollbar orientation="horizontal" /> and <ScrollAreaScrollbar orientation="vertical" /> – 
#624


Ensure no scrollbars are shown when scrolling is disabled – 
#624


Ensure children event handlers don't break – 
#624


Ensure scroll area updates when children content size changes – 
#624


Slider
0.0.15
Improve usage within forms – 
#678


Fix key binding issue in LTR – 
#718


Switch
0.0.14Major
[Breaking] onCheckedChange(event) is now onCheckedChange(checked: boolean) – 
#679


Improve compatibility with native form validation – 
#650


Improve usage within forms – 
#679


Improve accessibility when wrapped in native label – 
#679


Tabs
0.0.14Major
[Breaking] Rename Tabs.Tab to Tabs.Trigger – 
#652


[Breaking] Rename Tabs.Panel to Tabs.Content – 
#652


May 3, 2021
All primitives
Improve polymorphic types performance – 
#613


Accordion
0.0.14
Ensure only one click is needed to close a single controlled accordion – 
#594


Checkbox
0.0.14Major
[Breaking] Remove readOnly prop – 
#600


Context Menu
0.0.18
Add onOpenChange prop – 
#604


Dialog
0.0.16
Ensure focus position isn't lost when blurring out window and re-focusing it – 
#589


Dropdown Menu
0.0.18Major
Take into account non-visible items – 
#618


[Breaking] Remove anchorRef prop – 
#580


Prevent page from scrolling when selecting an item with space key – 
#626


Hover Card
0.0.1
New primitive – 
#595


Popover
0.0.16Major
[Breaking] Remove anchorRef prop and replace with optional Anchor part – 
#580


Radio Group
0.0.15Major
Add optional orientation, dir, loop props – 
#618


[Breaking] Remove readOnly prop – 
#600


Switch
0.0.12Major
[Breaking] Remove readOnly prop – 
#600


Toggle Group
0.0.7
Add optional orientation, dir, loop props – 
#618


Tooltip
0.0.17Major
[Breaking] Remove anchorRef prop – 
#580


March 26, 2021
All primitives
Improve tree-shaking – 
#577


Context Menu
0.0.17
Ensure you can open a context menu when one is already open – 
#565


Dropdown Menu
0.0.17
Fix potential overlap issue – 
#541


Popover
0.0.15
Ensure Content closes when it has multiple close animations – 
#571


Toggle
0.0.6Major
[Breaking] Rename ToggleButton primitive to Toggle – 
#546


[Breaking] Rename toggled prop to pressed – 
#546


[Breaking] Rename defaultToggled prop to defaultPressed – 
#546


[Breaking] Rename onToggledChange prop to onPressedChange – 
#546


Toggle Group
0.0.6
New primitive – 
#376


Toolbar
0.0.9
New primitive – 
#412
 
#451
 
#545


Tooltip
0.0.16
Add custom timing support – 
#550
 
#551
 
#554
 
#558


Add unmount animation support – 
#558


March 5, 2021
Accordion
0.0.7
Add height CSS custom property to panel for easier animation – 
#537


Collapsible
0.0.7
Add height CSS custom property to content for easier animation – 
#537


Tooltip
0.0.9
Fix type definition conflicts – 
#538


March 3, 2021
All primitives
Add support for SSR
[Breaking] Remove selector prop and data-radix-* atributes – 
#517


Accordion
0.0.6Major
[Breaking] Add support for multiple values. Note that this is a breaking change because the new type prop is required – 
#527


Slider
0.0.6
Ensure step is rounded correctly – 
#463


Tabs
0.0.6
Add RTL support (dir prop) – 
#497


February 17, 2021
Tooltip
0.0.7
Ensure events are composed when using <Trigger as={Slot}> – 
#461


February 15, 2021
Context Menu
0.0.8
Expose onCloseAutoFocus prop – 
#456


Dropdown Menu
0.0.8
Expose onCloseAutoFocus prop – 
#456


February 10, 2021
All primitives
Fix type autocompletion when using as prop – 
#421


Accordion
0.0.5
Prevent open/close flickering – 
#431


Dialog
0.0.6
Ensure focus is returned properly on close – 
#422


Radio Group
0.0.5Major
[Breaking] Move name prop from Item to Root – 
#424


February 1, 2021
Context Menu
0.0.6
Re–add missing children – 
#414


Dropdown Menu
0.0.6
Re–add missing children – 
#414


Popover
0.0.5
Prevent flickering (sliding) issue – 
#415


January 29, 2021
Slot
0.0.1
New utility – 
#409


January 25, 2021
Dialog
0.0.3
Fix regression when tabbing out would close – 
#403


Dropdown Menu
0.0.3
Fix broken arrow keys navigation – 
#404


January 22, 2021
All primitives
Add selector prop – 
#347


Accordion
0.0.2
Ensure setting disabled={false} on Root doesn't enable disabled items – 
#400


Dropdown Menu
0.0.2
Add enter key support on trigger – 
#381


Prevent focus race condition – 
#394


Popover
0.0.2
Ensure Content repositions on window resize – 
#359


Ensure last element inside Content triggers blur event – 
#395


December 15, 2020
All primitives
0.0.1Major
Initial release! 🎉 – 
#338


Quick nav
May 5, 2025
Other updates
April 22, 2025
April 17, 2025
Other updates
April 8, 2025
February 5, 2025
January 22, 2025
October 1, 2024
June 28, 2024
June 21, 2024
June 19, 2024
September 25, 2023
May 26, 2023
March 8, 2023
February 24, 2023
January 17, 2023
December 14, 2022
November 15, 2022
October 17, 2022
July 21, 2022
February 28, 2022
December 13, 2021
October 15, 2021
September 7, 2021
August 4, 2021
June 24, 2021
June 15, 2021
May 3, 2021
March 26, 2021
March 5, 2021
March 3, 2021
February 17, 2021
February 15, 2021
February 10, 2021
February 1, 2021
January 29, 2021
January 25, 2021
January 22, 2021
December 15, 2020
Previous
Accessibility
Next
Styling
Edit this page on GitHub.
Releases – Radix Primitives
Styling
Radix Primitives are unstyled—and compatible with any styling solution—giving you complete control over styling.
Styling overview
Functional styles
You are in control of all aspects of styling, including functional styles. For example—by default—a 
Dialog Overlay
 won't cover the entire viewport. You're responsible for adding those styles, plus any presentation styles.
Classes
All components and their parts accept a className prop. This class will be passed through to the DOM element. You can use it in CSS as expected.
Data attributes
When components are stateful, their state will be exposed in a data-state attribute. For example, when an 
Accordion Item
 is opened, it includes a data-state="open" attribute.
Styling with CSS
Styling a part
You can style a component part by targeting the className that you provide.
import * as React from "react";

import { Accordion } from "radix-ui";

import "./styles.css";



const AccordionDemo = () => (

	<Accordion.Root>

		<Accordion.Item className="AccordionItem" value="item-1" />

		{/* … */}

	</Accordion.Root>

);



export default AccordionDemo;

Styling a state
You can style a component state by targeting its data-state attribute.
.AccordionItem {

	border-bottom: 1px solid gainsboro;

}



.AccordionItem[data-state="open"] {

	border-bottom-width: 2px;

}

Styling with CSS-in-JS
The examples below are using 
styled-components
, but you can use any CSS-in-JS library of your choice.
Styling a part
Most CSS-in-JS libraries export a function for passing components and their styles. You can provide the Radix primitive component directly.
import * as React from "react";

import { Accordion } from "radix-ui";

import styled from "styled-components";



const StyledItem = styled(Accordion.Item)`
  border-bottom: 1px solid gainsboro;
`;



const AccordionDemo = () => (

	<Accordion.Root>

		<StyledItem value="item-1" />

		{/* … */}

	</Accordion.Root>

);



export default AccordionDemo;

Styling a state
You can style a component state by targeting its data-state attribute.
import { Accordion } from "radix-ui";

import styled from "styled-components";



const StyledItem = styled(Accordion.Item)`
	border-bottom: 1px solid gainsboro;

	&[data-state="open"] {
		border-bottom-width: 2px;
	}
`;

Extending a primitive
Extending a primitive is done the same way you extend any React component.
import * as React from "react";

import { Accordion as AccordionPrimitive } from "radix-ui";



const AccordionItem = React.forwardRef<

	React.ElementRef<typeof AccordionPrimitive.Item>,

	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>

>((props, forwardedRef) => (

	<AccordionPrimitive.Item {...props} ref={forwardedRef} />

));

AccordionItem.displayName = "AccordionItem";

Summary
Radix Primitives were designed to encapsulate accessibility concerns and other complex functionalities, while ensuring you retain complete control over styling.
For convenience, stateful components include a data-state attribute.
Quick nav
Styling overview
Functional styles
Classes
Data attributes
Styling with CSS
Styling a part
Styling a state
Styling with CSS-in-JS
Styling a part
Styling a state
Extending a primitive
Summary
Previous
Releases
Next
Animation
Edit this page on GitHub.
Styling – Radix Primitives
Animation
Animate Radix Primitives with CSS keyframes or the JavaScript animation library of your choice.
Adding animation to Radix Primitives should feel similar to any other component, but there are some caveats noted here in regards to exiting animations with JS animation libraries.
Animating with CSS animation
The simplest way to animate Primitives is with CSS.
You can use CSS animation to animate both mount and unmount phases. The latter is possible because the Radix Primitives will suspend unmount while your animation plays out.
@keyframes fadeIn {

	from {

		opacity: 0;

	}

	to {

		opacity: 1;

	}

}



@keyframes fadeOut {

	from {

		opacity: 1;

	}

	to {

		opacity: 0;

	}

}



.DialogOverlay[data-state="open"],
.DialogContent[data-state="open"] {

	animation: fadeIn 300ms ease-out;

}



.DialogOverlay[data-state="closed"],
.DialogContent[data-state="closed"] {

	animation: fadeOut 300ms ease-in;

}

Delegating unmounting for JavaScript Animation
When many stateful Primitives are hidden from view, they are actually removed from the React Tree, and their elements removed from the DOM. JavaScript animation libraries need control of the unmounting phase, so we provide the forceMount prop on many components to allow consumers to delegate the mounting and unmounting of children based on the animation state determined by those libraries.
For example, if you want to use React Spring to animate a Dialog, you would do so by conditionally rendering the dialog Overlay and Content parts based on the animation state from one of its hooks like useTransition:
import { Dialog } from "radix-ui";

import { useTransition, animated, config } from "react-spring";



function Example() {

	const [open, setOpen] = React.useState(false);

	const transitions = useTransition(open, {

		from: { opacity: 0, y: -10 },

		enter: { opacity: 1, y: 0 },

		leave: { opacity: 0, y: 10 },

		config: config.stiff,

	});

	return (

		<Dialog.Root open={open} onOpenChange={setOpen}>

			<Dialog.Trigger>Open Dialog</Dialog.Trigger>

			{transitions((styles, item) =>

				item ? (

					<>

						<Dialog.Overlay forceMount asChild>

							<animated.div
								style={{
									opacity: styles.opacity,
								}}
							/>

						</Dialog.Overlay>

						<Dialog.Content forceMount asChild>

							<animated.div style={styles}>

								<h1>Hello from inside the Dialog!</h1>

								<Dialog.Close>close</Dialog.Close>

							</animated.div>

						</Dialog.Content>

					</>

				) : null,

			)}

		</Dialog.Root>

	);

}

Quick nav
Animating with CSS animation
Delegating unmounting for JavaScript Animation
Previous
Styling
Next
Composition
Edit this page on GitHub.
Animation – Radix Primitives
Composition
Use the asChild prop to compose Radix's functionality onto alternative element types or your own React components.
All Radix primitive parts that render a DOM element accept an asChild prop. When asChild is set to true, Radix will not render a default DOM element, instead cloning the part's child and passing it the props and behavior required to make it functional.
Changing the element type
In the majority of cases you shouldn’t need to modify the element type as Radix has been designed to provide the most appropriate defaults. However, there are cases where it is helpful to do so.
A good example is with Tooltip.Trigger. By default this part is rendered as a button, though you may want to add a tooltip to a link (a tag) as well. Let's see how you can achieve this using asChild:
import * as React from "react";

import { Tooltip } from "radix-ui";



export default () => (

	<Tooltip.Root>

		<Tooltip.Trigger asChild>

			<a href="https://www.radix-ui.com/">Radix UI</a>

		</Tooltip.Trigger>

		<Tooltip.Portal>…</Tooltip.Portal>

	</Tooltip.Root>

);

If you do decide to change the underlying element type, it is your responsibility to ensure it remains accessible and functional. In the case of Tooltip.Trigger for example, it must be a focusable element that can respond to pointer and keyboard events. If you were to switch it to a div, it would no longer be accessible.
In reality, you will rarely modify the underlying DOM element like we've seen above. Instead it's more common to use your own React components. This is especially true for most Trigger parts, as you usually want to compose the functionality with the custom buttons and links in your design system.
Composing with your own React components
This works exactly the same as above, you pass asChild to the part and then wrap your own component with it. However, there are a few gotchas to be aware of.
Your component must spread props
When Radix clones your component, it will pass its own props and event handlers to make it functional and accessible. If your component doesn't support those props, it will break.
This is done by spreading all of the props onto the underlying DOM node.
// before

const MyButton = () => <button />;



// after

const MyButton = (props) => <button {...props} />;

We recommend always doing this so that you are not concerned with implementation details (ie. which props/events to accept). We find this is good practice for "leaf" components in general.
Similarly to when changing the element type directly, it is your responsibility to ensure the element type rendered by your custom component remains accessible and functional.
Your component must forward ref
Additionally, Radix will sometimes need to attach a ref to your component (for example to measure its size). If your component doesn't accept a ref, then it will break.
This is done using React.forwardRef (read more on 
react.dev
).
// before

const MyButton = (props) => <button {...props} />;



// after

const MyButton = React.forwardRef((props, forwardedRef) => (

	<button {...props} ref={forwardedRef} />

));

Whilst this isn't necessary for all parts, we recommend always doing it so that you are not concerned with implementation details. This is also generally good practice anyway for leaf components.
Composing multiple primitives
asChild can be used as deeply as you need to. This means it is a great way to compose multiple primitive's behavior together. Here is an example of how you can compose Tooltip.Trigger and Dialog.Trigger together with your own button:
import * as React from "react";

import { Dialog, Tooltip } from "radix-ui";



const MyButton = React.forwardRef((props, forwardedRef) => (

	<button {...props} ref={forwardedRef} />

));



export default () => {

	return (

		<Dialog.Root>

			<Tooltip.Root>

				<Tooltip.Trigger asChild>

					<Dialog.Trigger asChild>

						<MyButton>Open dialog</MyButton>

					</Dialog.Trigger>

				</Tooltip.Trigger>

				<Tooltip.Portal>…</Tooltip.Portal>

			</Tooltip.Root>



			<Dialog.Portal>...</Dialog.Portal>

		</Dialog.Root>

	);

};

Quick nav
Changing the element type
Composing with your own React components
Your component must spread props
Your component must forward ref
Composing multiple primitives
Previous
Animation
Next
Server-side rendering
Edit this page on GitHub.
Composition – Radix Primitives
Server-side rendering
Radix Primitives can be rendered on the server. However, Primitives in React versions less than 18 rely on hydration for ids.
Overview
Server-side rendering or SSR, is a technique used to render components to HTML on the server, as opposed to rendering them only on the client.
Static rendering is another similar approach. Instead it pre-renders pages to HTML at build time rather than on each request.
You should be able to use all of our primitives with both approaches, for example with 
Next.js
, 
Remix
, or 
Gatsby
.
Gotcha
Primitives in React versions less than 18 rely on hydration for ids (used in aria attributes) to avoid server/client mismatch errors.
In other words, the equivalent of 
Time to Interactive
 for screen reader users will depend on the download speed of the JS bundle. If you'd like to generate ids server-side to improve this experience, we suggest upgrading to React 18.
Quick nav
Overview
Gotcha
Previous
Composition
Next
Accordion
Edit this page on GitHub.
Server-side rendering – Radix Primitives
Accordion
A vertically stacked set of interactive headings that each reveal an associated section of content.
Is it accessible?
Yes. It adheres to the WAI-ARIA design pattern.
Is it unstyled?
Can it be animated?
import * as React from "react";

import { Accordion } from "radix-ui";

import classNames from "classnames";

import { ChevronDownIcon } from "@radix-ui/react-icons";

import "./styles.css";



const AccordionDemo = () => (

	<Accordion.Root
		className="AccordionRoot"
		type="single"
		defaultValue="item-1"
		collapsible
	>

		<Accordion.Item className="AccordionItem" value="item-1">

			<AccordionTrigger>Is it accessible?</AccordionTrigger>

			<AccordionContent>

				Yes. It adheres to the WAI-ARIA design pattern.

			</AccordionContent>

		</Accordion.Item>



		<Accordion.Item className="AccordionItem" value="item-2">

			<AccordionTrigger>Is it unstyled?</AccordionTrigger>

			<AccordionContent>

				Yes. It's unstyled by default, giving you freedom over the look and

				feel.

			</AccordionContent>

		</Accordion.Item>



		<Accordion.Item className="AccordionItem" value="item-3">

			<AccordionTrigger>Can it be animated?</AccordionTrigger>

			<Accordion.Content className="AccordionContent">

				<div className="AccordionContentText">

					Yes! You can animate the Accordion with CSS or JavaScript.

				</div>

			</Accordion.Content>

		</Accordion.Item>

	</Accordion.Root>

);



const AccordionTrigger = React.forwardRef(

	({ children, className, ...props }, forwardedRef) => (

		<Accordion.Header className="AccordionHeader">

			<Accordion.Trigger
				className={classNames("AccordionTrigger", className)}
				{...props}
				ref={forwardedRef}
			>

				{children}

				<ChevronDownIcon className="AccordionChevron" aria-hidden />

			</Accordion.Trigger>

		</Accordion.Header>

	),

);



const AccordionContent = React.forwardRef(

	({ children, className, ...props }, forwardedRef) => (

		<Accordion.Content
			className={classNames("AccordionContent", className)}
			{...props}
			ref={forwardedRef}
		>

			<div className="AccordionContentText">{children}</div>

		</Accordion.Content>

	),

);



export default AccordionDemo;

Features
Full keyboard navigation.
Supports horizontal/vertical orientation.
Supports Right to Left direction.
Can expand one or multiple items.
Can be controlled or uncontrolled.
Component Reference Links
Version: 1.2.11
Size: 
9.01 kB
View source
Report an issue
ARIA design pattern
Installation
Install the component from your command line.
npm install @radix-ui/react-accordion

Anatomy
Import all parts and piece them together.
import { Accordion } from "radix-ui";



export default () => (

	<Accordion.Root>

		<Accordion.Item>

			<Accordion.Header>

				<Accordion.Trigger />

			</Accordion.Header>

			<Accordion.Content />

		</Accordion.Item>

	</Accordion.Root>

);

API Reference
Root
Contains all the parts of an accordion.
Prop
Type
Default
asChild
boolean
false
type*
enum
No default value
value
string
No default value
defaultValue
string
No default value
onValueChange
function
No default value
value
string[]
[]
defaultValue
string[]
[]
onValueChange
function
No default value
collapsible
boolean
false
disabled
boolean
false
dir
enum
"ltr"
orientation
enum
"vertical"


Data attribute
Values
[data-orientation]
"vertical" | "horizontal"

Item
Contains all the parts of a collapsible section.
Prop
Type
Default
asChild
boolean
false
disabled
boolean
false
value*
string
No default value


Data attribute
Values
[data-state]
"open" | "closed"
[data-disabled]
Present when disabled
[data-orientation]
"vertical" | "horizontal"

Header
Wraps an Accordion.Trigger. Use the asChild prop to update it to the appropriate heading level for your page.
Prop
Type
Default
asChild
boolean
false


Data attribute
Values
[data-state]
"open" | "closed"
[data-disabled]
Present when disabled
[data-orientation]
"vertical" | "horizontal"

Trigger
Toggles the collapsed state of its associated item. It should be nested inside of an Accordion.Header.
Prop
Type
Default
asChild
boolean
false


Data attribute
Values
[data-state]
"open" | "closed"
[data-disabled]
Present when disabled
[data-orientation]
"vertical" | "horizontal"

Content
Contains the collapsible content for an item.
Prop
Type
Default
asChild
boolean
false
forceMount
boolean
No default value


Data attribute
Values
[data-state]
"open" | "closed"
[data-disabled]
Present when disabled
[data-orientation]
"vertical" | "horizontal"


CSS Variable
Description
--radix-accordion-content-width
The width of the content when it opens/closes
--radix-accordion-content-height
The height of the content when it opens/closes

Examples
Expanded by default
Use the defaultValue prop to define the open item by default.
<Accordion.Root type="single" defaultValue="item-2">

	<Accordion.Item value="item-1">…</Accordion.Item>

	<Accordion.Item value="item-2">…</Accordion.Item>

</Accordion.Root>

Allow collapsing all items
Use the collapsible prop to allow all items to close.
<Accordion.Root type="single" collapsible>

	<Accordion.Item value="item-1">…</Accordion.Item>

	<Accordion.Item value="item-2">…</Accordion.Item>

</Accordion.Root>

Multiple items open at the same time
Set the type prop to multiple to enable opening multiple items at once.
<Accordion.Root type="multiple">

	<Accordion.Item value="item-1">…</Accordion.Item>

	<Accordion.Item value="item-2">…</Accordion.Item>

</Accordion.Root>

Rotated icon when open
You can add extra decorative elements, such as chevrons, and rotate it when the item is open.
// index.jsx

import { Accordion } from "radix-ui";

import { ChevronDownIcon } from "@radix-ui/react-icons";

import "./styles.css";



export default () => (

	<Accordion.Root type="single">

		<Accordion.Item value="item-1">

			<Accordion.Header>

				<Accordion.Trigger className="AccordionTrigger">

					<span>Trigger text</span>

					<ChevronDownIcon className="AccordionChevron" aria-hidden />

				</Accordion.Trigger>

			</Accordion.Header>

			<Accordion.Content>…</Accordion.Content>

		</Accordion.Item>

	</Accordion.Root>

);

/* styles.css */

.AccordionChevron {

	transition: transform 300ms;

}

.AccordionTrigger[data-state="open"] > .AccordionChevron {

	transform: rotate(180deg);

}

Horizontal orientation
Use the orientation prop to create a horizontal accordion.
<Accordion.Root orientation="horizontal">

	<Accordion.Item value="item-1">…</Accordion.Item>

	<Accordion.Item value="item-2">…</Accordion.Item>

</Accordion.Root>

Animating content size
Use the --radix-accordion-content-width and/or --radix-accordion-content-height CSS variables to animate the size of the content when it opens/closes:
// index.jsx

import { Accordion } from "radix-ui";

import "./styles.css";



export default () => (

	<Accordion.Root type="single">

		<Accordion.Item value="item-1">

			<Accordion.Header>…</Accordion.Header>

			<Accordion.Content className="AccordionContent">…</Accordion.Content>

		</Accordion.Item>

	</Accordion.Root>

);

/* styles.css */

.AccordionContent {

	overflow: hidden;

}

.AccordionContent[data-state="open"] {

	animation: slideDown 300ms ease-out;

}

.AccordionContent[data-state="closed"] {

	animation: slideUp 300ms ease-out;

}



@keyframes slideDown {

	from {

		height: 0;

	}

	to {

		height: var(--radix-accordion-content-height);

	}

}



@keyframes slideUp {

	from {

		height: var(--radix-accordion-content-height);

	}

	to {

		height: 0;

	}

}

Accessibility
Adheres to the 
Accordion WAI-ARIA design pattern
.
Keyboard Interactions
Key
Description


When focus is on an Accordion.Trigger of a collapsed section, expands the section.


When focus is on an Accordion.Trigger of a collapsed section, expands the section.


Moves focus to the next focusable element.


Moves focus to the previous focusable element.


Moves focus to the next Accordion.Trigger when orientation is vertical.


Moves focus to the previous Accordion.Trigger when orientation is vertical.


Moves focus to the next Accordion.Trigger when orientation is horizontal.


Moves focus to the previous Accordion.Trigger when orientation is horizontal.


When focus is on an Accordion.Trigger, moves focus to the first Accordion.Trigger.


When focus is on an Accordion.Trigger, moves focus to the last Accordion.Trigger.

Quick nav
Installation
Anatomy
API Reference
Root
Item
Header
Trigger
Content
Examples
Expanded by default
Allow collapsing all items
Multiple items open at the same time
Rotated icon when open
Horizontal orientation
Animating content size
Accessibility
Keyboard Interactions
Previous
Server-side rendering
Next
Alert Dialog
Edit this page on GitHub.
Accordion – Radix Primitives


npm i @radix-ui/react-icons
Installation
How to install Radix Colors.
npm
Install Radix Colors from your terminal via npm, yarn or pnpm. Current version is 3.0.0
# with npm

npm install @radix-ui/colors

# with yarn

yarn add @radix-ui/colors

# with pnpm

pnpm add @radix-ui/colors

CDN
To get started quickly, you can use the CDN files.
Note: Importing from the CDN in production is not recommended. It's intended for prototyping only.
<!-- Load whichever light and dark scales you need -->

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/gray.css"
/>

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/blue.css"
/>

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/green.css"
/>

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/red.css"
/>

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/gray-dark.css"
/>

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/blue-dark.css"
/>

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/green-dark.css"
/>

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/red-dark.css"
/>

The example above uses the @latest tag to point to the latest version of the scales. You can pin your scales to a specific version.
<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/@radix-ui/colors@3.0.0/blue.css"
/>

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/@radix-ui/colors@3.0.0/blue-dark.css"
/>

Quick nav
npm
CDN
Next
Usage
Edit this page on GitHub.
Installation – Radix Colors
Usage
How to use Radix Colors with various styling solutions.
Radix Colors scales are just simple JavaScript objects, so you can use them with your preferred styling solution easily. Below you can find usage examples for popular styling solutions.
Vanilla CSS
Radix Colors provides the colors bundled as raw CSS files. You can import them directly in your files when using a bundler, such as Parcel or Webpack.
/* Import only the scales you need */

@import "@radix-ui/colors/gray.css";

@import "@radix-ui/colors/blue.css";

@import "@radix-ui/colors/green.css";

@import "@radix-ui/colors/red.css";

@import "@radix-ui/colors/gray-dark.css";

@import "@radix-ui/colors/blue-dark.css";

@import "@radix-ui/colors/green-dark.css";

@import "@radix-ui/colors/red-dark.css";



/* Use the colors as CSS variables */

.button {

	background-color: var(--blue-4);

	color: var(--blue-11);

	border-color: var(--blue-7);

}

.button:hover {

	background-color: var(--blue-5);

	border-color: var(--blue-8);

}

<!-- For dark mode, apply a `.dark` class to <body> or a parent. -->

<body class="dark">

	<button class="button">Button</button>

</body>

Light scales apply their CSS variables to the :root element and to the .light and .light-theme classes. Dark scales apply their CSS variables to the .dark and .dark-theme classes.
styled-components
import {
	gray,
	blue,
	red,
	green,
	grayDark,
	blueDark,
	redDark,
	greenDark,
} from "@radix-ui/colors";

import styled, { ThemeProvider } from "styled-components";



// Create your theme

const theme = {

	colors: {

		...gray,

		...blue,

		...red,

		...green,

	},

};



// Create your dark theme

const darkTheme = {

	colors: {

		...grayDark,

		...blueDark,

		...redDark,

		...greenDark,

	},

};



// Use the colors in your styles

const Button = styled.button`
	background-color: ${(props) => props.theme.colors.blue4};
	color: ${(props) => props.theme.colors.blue11};
	border-color: ${(props) => props.theme.colors.blue7};
	&:hover {
		background-color: ${(props) => props.theme.colors.blue5};
		border-color: ${(props) => props.theme.colors.blue8};
	}
`;



// Wrap your app with the theme provider and apply your theme to it

export default function App() {

	return (

		<ThemeProvider theme={theme}>

			<Button>Radix Colors</Button>

		</ThemeProvider>

	);

}

emotion
Usage with emotion is almost identical to the styled-components docs above, aside from the different imports.
import {
	gray,
	blue,
	red,
	green,
	grayDark,
	blueDark,
	redDark,
	greenDark,
} from "@radix-ui/colors";

import { ThemeProvider } from "@emotion/react";

import styled from "@emotion/styled";

vanilla-extract
import {
	gray,
	blue,
	red,
	green,
	grayDark,
	blueDark,
	redDark,
	greenDark,
} from "@radix-ui/colors";

import { createTheme } from "@vanilla-extract/css";



export const [theme, vars] = createTheme({

	colors: {

		...gray,

		...blue,

		...red,

		...green,

	},

});



export const darkTheme = createTheme(vars, {

	colors: {

		...grayDark,

		...blueDark,

		...redDark,

		...greenDark,

	},

});



// Use the colors in your styles

export const styles = {

	button: style({

		backgroundColor: vars.colors.blue4,

		color: vars.colors.blue11,

		borderColor: vars.colors.blue7,

		":hover": {

			backgroundColor: vars.colors.blue5,

			borderColor: vars.colors.blue8,

		},

	}),

};



// Apply your theme to it

export default function App() {

	return (

		<body className={theme}>

			<button className={styles.button}>Radix Colors</button>

		</body>

	);

}

Quick nav
Vanilla CSS
styled-components
emotion
vanilla-extract
Previous
Installation
Next
Aliasing
Edit this page on GitHub.
How to use Radix Colors – Radix Colors
Aliasing
A guide to providing semantic aliases for colors.
Semantic aliases
Referencing color scales by their actual scale name can work well, like blue and red. But often, creating semantic aliases like accent, primary, neutral, or brand can be helpful, especially when it comes to theming.
/*

* Note: Importing from the CDN in production is not recommended.

* It's intended for prototyping only.

*/

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/blue.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/green.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/yellow.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/red.css";



:root {

--accent-1: var(--blue-1);

--accent-2: var(--blue-2);

--accent-3: var(--blue-3);

--accent-4: var(--blue-4);

--accent-5: var(--blue-5);

--accent-6: var(--blue-6);

--accent-7: var(--blue-7);

--accent-8: var(--blue-8);

--accent-9: var(--blue-9);

--accent-10: var(--blue-10);

--accent-11: var(--blue-11);

--accent-12: var(--blue-12);



--success-1: var(--green-1);

--success-2: var(--green-2);

/* repeat for all steps */



--warning-1: var(--yellow-1);

--warning-2: var(--yellow-2);

/* repeat for all steps */



--danger-1: var(--red-1);

--danger-2: var(--red-2);

/* repeat for all steps */

}

With this approach, you will likely run into issues where you need to use the same scale for multiple semantics. Common examples include:
If you map yellow to "warning", you might also need yellow to communicate "pending".
If you map red to "danger", you might also need red to communicate "error" or "rejected".
If you map green to "success", you might also need green to communicate "valid".
If you map blue to "accent", you might also need blue to communicate "info".
In this scenario, you can choose to define multiple semantic aliases which map to the same scale.
/*

* Note: Importing from the CDN in production is not recommended.

* It's intended for prototyping only.

*/

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/blue.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/green.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/yellow.css";



:root {

--accent-1: var(--blue-1);

--accent-2: var(--blue-2);

--info-1: var(--blue-1);

--info-2: var(--blue-2);



--success-1: var(--green-1);

--success-2: var(--green-2);

--valid-1: var(--green-1);

--valid-2: var(--green-2);



--warning-1: var(--yellow-1);

--warning-2: var(--yellow-2);

--pending-1: var(--yellow-1);

--pending-2: var(--yellow-2);

}

Or you can simply recommend that your teammates defer to the original scale name for situations where there is no appropriate semantic alias.
Use case aliases
Each step in Radix Colors scales is designed for a specific use case. To help your team know which step to use, you can provide aliases based on the designed use cases.
/*

* Note: Importing from the CDN in production is not recommended.

* It's intended for prototyping only.

*/

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/blue.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/green.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/yellow.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/red.css";



:root {

--accent-base: var(--blue-1);

--accent-bg-subtle: var(--blue-2);

--accent-bg: var(--blue-3);

--accent-bg-hover: var(--blue-4);

--accent-bg-active: var(--blue-5);

--accent-line: var(--blue-6);

--accent-border: var(--blue-7);

--accent-border-hover: var(--blue-8);

--accent-solid: var(--blue-9);

--accent-solid-hover: var(--blue-10);

--accent-text: var(--blue-11);

--accent-text-contrast: var(--blue-12);



--success-base: var(--green-1);

--success-bg-subtle: var(--green-2);

/* repeat for all steps */



--warning-base: var(--yellow-1);

--warning-bg-subtle: var(--yellow-2);

/* repeat for all steps */



--danger-base: var(--red-1);

--danger-bg-subtle: var(--red-2);

/* repeat for all steps */

}

Again, with this approach, you will likely run into issues where you need to use the same step for multiple use cases. Common examples include:
Step 9 is designed for solid backgrounds, but it also may work for input placeholder text.
Step 8 is designed for hovered component borders, but it also works well for focus rings.
In these cases, you can choose to define multiple aliases which map to the same step.
/*

* Note: Importing from the CDN in production is not recommended.

* It's intended for prototyping only.

*/

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/gray.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/blue.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/green.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/yellow.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/red.css";



:root {

--gray-solid: var(--gray-9);

--gray-placeholder-text: var(--gray-9);



--accent-border-hover: var(--blue-8);

--accent-focus-ring: var(--blue-8);

}

Or you can simply recommend that your teammates defer to the original step number for situations where use cases don't have an alias.
Mutable aliases
When designing for both light and dark modes, you sometimes need to map a variable to one color in light mode, and another color in dark mode. Common examples include:
Components that have a white background in light mode and a subtle gray background in dark mode. For example, Card, Popover, DropdownMenu, HoverCard, Dialog etc.
Components that have a transparent black background in light mode and a transparent white background in dark mode. For example, Tooltip.
Shadows that are saturated, transparent gray in light mode, and pure black in dark mode.
An overlay that is light transparent black in light mode, and a darker transparent black in dark mode.
/*

* Note: Importing from the CDN in production is not recommended.

* It's intended for prototyping only.

*/

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/slate.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/slate-alpha.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/white-alpha.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/black-alpha.css";



:root {

--panel: white;

--panel-contrast: var(--black-a9);

--shadow: var(--slate-a3);

--overlay: var(--black-a8);

}



.dark {

/* Remap your colors for dark mode */

--panel: var(--slate-2);

--panel-contrast: var(--white-a9);

--shadow: black;

--overlay: var(--black-a11);

}
Avoid using specific variable names like "CardBg", or "Tooltip", because you will likely need to use each variable for multiple use cases.
Renaming scales
If you wish, you can rename scales. Reasons might include:
Rename a saturated gray to gray to keep things simple.
Rename sky or grass to blue or green to keep the naming intuitive.
Rename a scale to match your brand, like how Discord use blurple.
/*

* Note: Importing from the CDN in production is not recommended.

* It's intended for prototyping only.

*/

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/slate.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/sky.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/grass.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/violet.css";

@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/crimson.css";



:root {

--gray-1: var(--slate-1);

--gray-2: var(--slate-2);



--blue-1: var(--sky-1);

--blue-2: var(--sky-2);



--green-1: var(--grass-1);

--green-2: var(--grass-2);



--blurple-1: var(--violet-1);

--blurple-2: var(--violet-2);



--caribbean-sunset-1: var(--crimson-1);

--caribbean-sunset-2: var(--crimson-2);

}

Quick nav
Semantic aliases
Use case aliases
Mutable aliases
Renaming scales
Previous
Usage
Next
Custom palettes
Edit this page on GitHub.
Aliasing – Radix Colors
Custom palettes
Learn how to create custom Radix Colors palettes.
Use the 
custom color palette tool
 to generate a Radix Colors scale based just on a couple reference colors. Once you are happy with the result, paste the generated CSS into your project and use them the same way you would use the regular Radix Colors scales.
The generated scales are based on the Radix Colors scales themselves, so they will work well with similar component designs. As long as you use a reasonable background color, the contrast ratios will be similar to what Radix Colors provide.
What you get
Your custom color palette will include Radix Colors steps 1 through 12, as well as their alpha variants and wide-gamut color definitions. Wide-gamut color definitions are needed to ensure that alpha colors are displayed with full saturation in wide-gamut color spaces, such as on Apple’s displays that support P3. This is because alpha blending works differently in P3 than in sRGB.
Learn about the base palette composition in the 
Understanding the scale
 guide. The generated CSS also includes a few extra colors used exclusively in 
Radix Themes
, such as:
Surface color, used by certain variant="surface" components
Indicator color, used by components like Checkbox, Radio, and Tabs
Track color, used by components like Slider and Progress Bar
Feel free to remove colors from the generated CSS that you don’t need.
Color formats
You can use any common CSS color format in the input fields, or even wide-gamut color spaces, such as color(display-p3 1 0.5 0). The generated CSS will provide the closest sRGB fallbacks.
Dark theme
To generate dark theme colors, toggle the appearance to dark in the website header. Make sure to paste the generated CSS after your light theme color overrides.
Quick nav
What you get
Color formats
Dark theme
Previous
Aliasing
Next
Releases
Edit this page on GitHub.
Custom palettes – Radix Colors
Releases
Radix Colors releases and changelog.
3.0.0
October 2, 2023
[Breaking] A complete rework of all colors.
Add P3 colorspace versions of all scales.
2.1.0
August 21, 2023
Add ruby, iris, and jade scales
2.0.1
August 7, 2023
Fix some of the dark a2 colors being too opaque.
2.0.0
August 7, 2023
[Breaking] A complete rework of all colors, dramatically improving contrast across the board.
1.0.0
June 23, 2023
[Breaking] CSS variables were changed to use the hyphen-separated naming:
gray1 → gray-1
grayA1 → gray-a1


[Breaking] CSS file names were changed to use the hyphen-separated naming:
gray.css → gray.css
grayA.css → gray-alpha.css
grayDark.css → gray-dark.css
grayDarkA.css → gray-dark-alpha.css


0.1.9
June 19, 2023
Apply light scale CSS variables to .light-theme class in addition to the :root element.
Quick nav
3.0.0
2.1.0
2.0.1
2.0.0
1.0.0
0.1.9
Previous
Custom palettes
Next
Scales
Edit this page on GitHub.
Releases – Radix Colors
Scales
An overview of all Radix Colors scales.
Gray
1
2
3
4
5
6
7
8
9
10
11
12
Gray
Gray Alpha
Gray Dark
Gray Dark Alpha
Mauve
1
2
3
4
5
6
7
8
9
10
11
12
Mauve
Mauve Alpha
Mauve Dark
Mauve Dark Alpha
Slate
1
2
3
4
5
6
7
8
9
10
11
12
Slate
Slate Alpha
Slate Dark
Slate Dark Alpha
Sage
1
2
3
4
5
6
7
8
9
10
11
12
Sage
Sage Alpha
Sage Dark
Sage Dark Alpha
Olive
1
2
3
4
5
6
7
8
9
10
11
12
Olive
Olive Alpha
Olive Dark
Olive Dark Alpha
Sand
1
2
3
4
5
6
7
8
9
10
11
12
Sand
Sand Alpha
Sand Dark
Sand Dark Alpha
Gold
1
2
3
4
5
6
7
8
9
10
11
12
Gold
Gold Alpha
Gold Dark
Gold Dark Alpha
Bronze
1
2
3
4
5
6
7
8
9
10
11
12
Bronze
Bronze Alpha
Bronze Dark
Bronze Dark Alpha
Brown
1
2
3
4
5
6
7
8
9
10
11
12
Brown
Brown Alpha
Brown Dark
Brown Dark Alpha
Yellow
1
2
3
4
5
6
7
8
9
10
11
12
Yellow
Yellow Alpha
Yellow Dark
Yellow Dark Alpha
Amber
1
2
3
4
5
6
7
8
9
10
11
12
Amber
Amber Alpha
Amber Dark
Amber Dark Alpha
Orange
1
2
3
4
5
6
7
8
9
10
11
12
Orange
Orange Alpha
Orange Dark
Orange Dark Alpha
Tomato
1
2
3
4
5
6
7
8
9
10
11
12
Tomato
Tomato Alpha
Tomato Dark
Tomato Dark Alpha
Red
1
2
3
4
5
6
7
8
9
10
11
12
Red
Red Alpha
Red Dark
Red Dark Alpha
Ruby
1
2
3
4
5
6
7
8
9
10
11
12
Ruby
Ruby Alpha
Ruby Dark
Ruby Dark Alpha
Crimson
1
2
3
4
5
6
7
8
9
10
11
12
Crimson
Crimson Alpha
Crimson Dark
Crimson Dark Alpha
Pink
1
2
3
4
5
6
7
8
9
10
11
12
Pink
Pink Alpha
Pink Dark
Pink Dark Alpha
Plum
1
2
3
4
5
6
7
8
9
10
11
12
Plum
Plum Alpha
Plum Dark
Plum Dark Alpha
Purple
1
2
3
4
5
6
7
8
9
10
11
12
Purple
Purple Alpha
Purple Dark
Purple Dark Alpha
Violet
1
2
3
4
5
6
7
8
9
10
11
12
Violet
Violet Alpha
Violet Dark
Violet Dark Alpha
Iris
1
2
3
4
5
6
7
8
9
10
11
12
Iris
Iris Alpha
Iris Dark
Iris Dark Alpha
Indigo
1
2
3
4
5
6
7
8
9
10
11
12
Indigo
Indigo Alpha
Indigo Dark
Indigo Dark Alpha
Blue
1
2
3
4
5
6
7
8
9
10
11
12
Blue
Blue Alpha
Blue Dark
Blue Dark Alpha
Cyan
1
2
3
4
5
6
7
8
9
10
11
12
Cyan
Cyan Alpha
Cyan Dark
Cyan Dark Alpha
Teal
1
2
3
4
5
6
7
8
9
10
11
12
Teal
Teal Alpha
Teal Dark
Teal Dark Alpha
Jade
1
2
3
4
5
6
7
8
9
10
11
12
Jade
Jade Alpha
Jade Dark
Jade Dark Alpha
Green
1
2
3
4
5
6
7
8
9
10
11
12
Green
Green Alpha
Green Dark
Green Dark Alpha
Grass
1
2
3
4
5
6
7
8
9
10
11
12
Grass
Grass Alpha
Grass Dark
Grass Dark Alpha
Lime
1
2
3
4
5
6
7
8
9
10
11
12
Lime
Lime Alpha
Lime Dark
Lime Dark Alpha
Mint
1
2
3
4
5
6
7
8
9
10
11
12
Mint
Mint Alpha
Mint Dark
Mint Dark Alpha
Sky
1
2
3
4
5
6
7
8
9
10
11
12
Sky
Sky Alpha
Sky Dark
Sky Dark Alpha

Overlays
These scales are designed for overlays and don’t change across light and dark theme.

1
2
3
4
5
6
7
8
9
10
11
12
Black Alpha
White Alpha


Previous
Releases
Next
Composing a palette
Edit this page on GitHub.
Scales – Radix Colors
Composing a color palette
A guide to composing a color palette with Radix Colors.
Choosing a brand scale
Radix provides a number of scales you could use for your brand or accent color.
Scales designed for white foreground text:
bronze
gold
brown
orange
tomato
red
ruby
crimson
pink
plum
purple
violet
iris
indigo
blue
cyan
teal
jade
green
grass
Scales designed for dark foreground text:
sky
mint
lime
yellow
amber
Custom brand colors
Radix Colors are not intended to be customised. They’re designed to be accessible, well-balanced, and harmonious. Any customisation would likely break these features.
If you need custom brand colors, we recommend adding custom scales alongside Radix scales.
For example, you could use Radix Colors for your gray scale and your semantic scales, then add custom brand/accent colors.
Choosing a gray scale
Radix Colors provides a pure gray and a few tinted gray scales.
gray
mauve
slate
sage
olive
sand
gray is pure gray
mauve is based on a purple hue
slate is based on a blue hue
sage is based on a green hue
olive is based on a lime hue
sand is based on a yellow hue
Neutral pairing
If you want a neutral vibe, or you want to keep things simple, gray will work well with any hue or palette.
Natural pairing
Alternatively, choose the gray scale which is saturated with the hue closest to your accent hue. The difference is subtle, but this will create a more colorful and harmonius vibe.
mauve
tomato
red
ruby
crimson
pink
plum
purple
violet
slate
iris
indigo
blue
sky
cyan
sage
mint
teal
jade
green
olive
grass
lime
sand
yellow
amber
orange
brown
Note: If your project uses a lot of colorful UI components like Badge, be careful when using saturated grays for your app background, especially in dark mode. Colorful UI components may clash with your saturated gray background color.
Choosing semantic scales
For most projects, you will need colors to communicate semantic meaning. Here are some common pairings that work well in Western culture.
Error: red, ruby, tomato, crimson
Success: green, teal, jade, grass, mint
Warning: yellow, amber, orange
Info: blue, indigo, sky, cyan
In many cases, you might eventually need most of the scales, for one reason or another. Your app may support multiplayer mode, where you assign a color to each user. Your app may have a labelling feature, where your users assign a color to a task. Your app may use badges to communicate “pending” or “rejected” states.
Radix Colors are well-balanced, and designed to work in harmony. So for product communication, most color pairings will work.
Choosing text scales
Steps 11 and 12 are designed for low-contrast text and high-contrast text respectively. Depending on the vibe you want, you can use your accent scale or your gray scale.
Using your accent scale will result in a more colorful vibe.
This text is Blue 12
Using your gray scale will result in a more functional vibe.
This text is Slate 12
The difference may seem subtle, but it can make a huge difference with a whole page of text.
You may want to experiment with using your accent scale for text in your marketing sites, and your gray scale for text in your apps.
Quick nav
Choosing a brand scale
Custom brand colors
Choosing a gray scale
Neutral pairing
Natural pairing
Choosing semantic scales
Choosing text scales
Previous
Scales
Next
Understanding the scale
Edit this page on GitHub.
Composing a color palette – Radix Colors
Understanding the scale
Learn which scale step is the most appropriate for each use case.
Use cases
There are 12 steps in each scale. Each step was designed for at least one specific use case.
This table is a simple overview of the most common use case for each step. However, there are many exceptions and caveats to factor in, which are covered in further detail below.
Step
Use Case
1
App background
2
Subtle background
3
UI element background
4
Hovered UI element background
5
Active / Selected UI element background
6
Subtle borders and separators
7
UI element border and focus rings
8
Hovered UI element border
9
Solid backgrounds
10
Hovered solid backgrounds
11
Low-contrast text
12
High-contrast text

Steps 1–2: Backgrounds
1
2
Steps 1 and 2 are designed for app backgrounds and subtle component backgrounds. You can use them interchangeably, depending on the vibe you're going for.
Appropriate applications include:
Main app background
Striped table background
Code block background
Card background
Sidebar background
Canvas area background
You may want to use white for your app background in light mode, and Step 1 or 2 from a gray or coloured scale in dark mode. In this case, set up a 
mutable alias
 for AppBg and map it to a different color for each color mode.
Steps 3–5: Component backgrounds
3
4
5
Steps 3, 4, and 5 are designed for UI component backgrounds.
Step 3 is for normal states.
Step 4 is for hover states.
Step 5 is for pressed or selected states.
Menu item
Second menu item
Third menu item
Menu item
Second menu item
Third menu item
If your component has a transparent background in its default state, you can use Step 3 for its hover state.
Steps 11 and 12—which are designed for text—are guaranteed to Lc 60 and Lc 90 APCA contrast ratio on top of a step 2 background from the same scale.
Steps 6–8: Borders
6
7
8
Steps 6, 7, and 8 are designed for borders.
Step 6 is designed for subtle borders on components which are not interactive. For example sidebars, headers, cards, alerts, and separators.
Step 7 is designed for subtle borders on interactive components.
Step 8 is designed for stronger borders on interactive components and focus rings.
Steps 9–10: Solid backgrounds
9
10
Steps 9 and 10 are designed for solid backgrounds.
Step 9 has the highest chroma of all steps in the scale. In other words, it's the purest step, the step mixed with the least amount of white or black. Because 9 is the purest step, it has a wide range of applications:
Website/App backgrounds
Website section backgrounds
Header backgrounds
Component backgrounds
Graphics/Logos
Overlays
Coloured shadows
Accent borders
Step 10 is designed for component hover states, where step 9 is the component's normal state background.
Most step 9 colors are designed for white foreground text. Sky, Mint, Lime, Yellow, and Amber are designed for dark foreground text and steps 9 and 10.
Steps 11–12: Text
11
12
Steps 11 and 12 are designed for text.
Step 11 is designed for low-contrast text.
Step 12 is designed for high-contrast text.
This text is Pink 11This text is Slate 11This text is Gray 11This text is Pink 12This text is Slate 12This text is Gray 12
Quick nav
Use cases
Steps 1–2: Backgrounds
Steps 3–5: Component backgrounds
Steps 6–8: Borders
Steps 9–10: Solid backgrounds
Steps 11–12: Text
Previous
Composing a palette
Edit this page on GitHub.
Use cases – Radix Colors


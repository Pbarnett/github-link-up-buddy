# Radix Theme

## 📋 Document Directory & Navigation

### 📖 Overview
This document serves as the comprehensive reference for Radix Theme implementation and usage within the github-link-up-buddy project. It covers theme configuration, component styling, design tokens, customization patterns, and integration with the React ecosystem.

### 🧭 Quick Navigation
- **Getting Started**: Installation, setup, and basic theme configuration
- **Design System**: Colors, typography, spacing, and layout tokens
- **Components**: Theme-aware component patterns and styling
- **Customization**: Custom themes, variants, and design system extension
- **Advanced**: Theme switching, SSR considerations, and performance optimization

### 📑 Detailed Table of Contents

#### 1. Getting Started
- 1.1 Installation and Setup
- 1.2 Theme Provider Configuration
- 1.3 Basic Theme Usage
- 1.4 Project Integration
- 1.5 Development Environment Setup

#### 2. Design System Foundation
- 2.1 Design Tokens Overview
- 2.2 Color System and Palettes
- 2.3 Typography Scale and Fonts
- 2.4 Spacing and Layout Grid
- 2.5 Breakpoints and Responsive Design
- 2.6 Elevation and Shadow System
- 2.7 Border Radius and Shape Language

#### 3. Theme Configuration
- 3.1 Theme Object Structure
- 3.2 Default Theme Settings
- 3.3 Theme Variants and Modes
- 3.4 CSS Variables Integration
- 3.5 Theme Inheritance and Merging
- 3.6 Configuration Validation

#### 4. Component Theming
- 4.1 Component Theme Architecture
- 4.2 Styled Component Integration
- 4.3 Component Variant Patterns
- 4.4 Theme-Aware Props
- 4.5 Compound Component Styling
- 4.6 Animation and Transition Theming

#### 5. Color System
- 5.1 Color Palette Structure
- 5.2 Semantic Color Mapping
- 5.3 Brand Color Integration
- 5.4 Accessibility and Contrast
- 5.5 Color Modes (Light/Dark)
- 5.6 Custom Color Scales
- 5.7 Color Utilities and Helpers

#### 6. Typography System
- 6.1 Font Family Configuration
- 6.2 Font Weight and Style Variants
- 6.3 Text Size and Line Height Scale
- 6.4 Letter Spacing and Text Spacing
- 6.5 Font Loading and Performance
- 6.6 Typography Components

#### 7. Layout and Spacing
- 7.1 Spacing Scale Definition
- 7.2 Container and Layout Components
- 7.3 Grid System Integration
- 7.4 Responsive Spacing Patterns
- 7.5 Margin and Padding Utilities
- 7.6 Layout Composition Patterns

#### 8. Customization and Extension
- 8.1 Custom Theme Creation
- 8.2 Theme Extension Patterns
- 8.3 Component Style Overrides
- 8.4 Plugin and Addon System
- 8.5 Brand Identity Integration
- 8.6 Multi-theme Support

#### 9. Advanced Features
- 9.1 Dynamic Theme Switching
- 9.2 Theme Persistence and Storage
- 9.3 Server-Side Rendering (SSR)
- 9.4 Performance Optimization
- 9.5 Theme Testing Strategies
- 9.6 DevTools and Debugging

#### 10. Integration Patterns
- 10.1 React Integration Best Practices
- 10.2 Next.js Integration
- 10.3 Styled Components Integration
- 10.4 Emotion Integration
- 10.5 CSS-in-JS Libraries
- 10.6 Build Tool Configuration

#### 11. Project-Specific Implementation
- 11.1 GitHub Link-Up Buddy Theme
- 11.2 Component Library Integration
- 11.3 Design System Alignment
- 11.4 Brand Guidelines Implementation
- 11.5 Accessibility Compliance
- 11.6 Performance Considerations

#### 12. Migration and Maintenance
- 12.1 Version Migration Guides
- 12.2 Breaking Changes Documentation
- 12.3 Theme Maintenance Strategies
- 12.4 Testing and Quality Assurance
- 12.5 Performance Monitoring
- 12.6 Community and Support

#### 13. Best Practices and Guidelines
- 13.1 Theme Design Principles
- 13.2 Component Styling Guidelines
- 13.3 Performance Best Practices
- 13.4 Accessibility Standards
- 13.5 Code Organization Patterns
- 13.6 Documentation Standards

#### 14. Troubleshooting and Debugging
- 14.1 Common Issues and Solutions
- 14.2 Theme Debugging Tools
- 14.3 Performance Issues
- 14.4 Browser Compatibility
- 14.5 Build and Runtime Errors
- 14.6 Theme Conflict Resolution

#### 15. Resources and References
- 15.1 Official Documentation Links
- 15.2 Community Resources
- 15.3 Design System Examples
- 15.4 Integration Guides
- 15.5 Performance Resources
- 15.6 Contributing Guidelines

### 🔍 How to Use This Document
1. **Quick Reference**: Use the Quick Navigation for immediate access to major sections
2. **Detailed Search**: Use the numbered table of contents for specific topics
3. **Context-Aware**: Each section includes project-specific examples and patterns
4. **Cross-References**: Look for internal links between related sections

### 🏷️ Search Keywords
`radix-theme`, `design-system`, `theme-configuration`, `design-tokens`, `color-palette`, `typography`, `spacing`, `layout`, `customization`, `theming`, `css-variables`, `theme-provider`, `styled-components`, `responsive-design`, `accessibility`, `performance`, `dark-mode`, `light-mode`, `component-theming`, `brand-identity`, `migration`, `troubleshooting`

---
Getting started
Install Radix Themes and start building in minutes.
Radix Themes is a pre-styled component library that is designed to work out of the box with minimal configuration. If you are looking for the unstyled components, go to 
Radix Primitives
.
Installation
Getting up and running is quick and easy.
1. Install Radix Themes
Install the package from your command line.
npm install @radix-ui/themes
2. Import the CSS file
Import the global CSS file at the root of your application.
import "@radix-ui/themes/styles.css";

3. Add the Theme component
Add Theme to your application, wrapping the root component inside of body.
import { Theme } from "@radix-ui/themes";



export default function () {

	return (

		<html>

			<body>

				<Theme>

					<MyApp />

				</Theme>

			</body>

		</html>

	);

}

4. Start building
You are now ready to use Radix Themes components.
import { Flex, Text, Button } from "@radix-ui/themes";



export default function MyApp() {

	return (

		<Flex direction="column" gap="2">

			<Text>Hello from Radix Themes :)</Text>

			<Button>Let's go</Button>

		</Flex>

	);

}

Customizing your theme
Configuration is managed and applied via the 
Theme
 component.
Basic configuration
Pass 
configuration
 to the Theme to customize appearance.
<Theme accentColor="crimson" grayColor="sand" radius="large" scaling="95%">

	<MyApp />

</Theme>

Using the theme panel
ThemePanel is a drop-in component that allows you to preview the theme in real time. Visit the 
component playground
 to see it in action.
To add ThemePanel to your app, import it from the package and drop it inside your root Theme.
import { Theme, ThemePanel } from "@radix-ui/themes";



export default function () {

	return (

		<Theme>

			<MyApp />

			<ThemePanel />

		</Theme>

	);

}

Take it further
Get the most out of Radix Themes by exploring more concepts and features.
Styling
Learn how to approach styling and overrides with Radix Themes.
Layout
Get to know the layout primitives and their available properties.
Theme overview
Anatomy of a theme and how to create the perfect style for your app.
Color
Understand the color system and its application in your theme.
Dark mode
Integrate a great looking dark mode into your app using appearances.
Typography
Add custom typefaces and fine tune typographic details.
Quick nav
Installation
1. Install Radix Themes
2. Import the CSS file
3. Add the Theme component
4. Start building
Customizing your theme
Basic configuration
Using the theme panel
Take it further
Next
Styling
Edit this page on GitHub.

Styling
How to approach styling with Radix Themes.
Introduction
Radix Themes does not come with a built-in styling system. There’s no css or sx prop, and it does not use any styling libraries internally. Under the hood, it’s built with vanilla CSS.
There’s no overhead when it comes to picking a styling technology for your app.
What you get
The components in Radix Themes are relatively closed—they come with a set of styles that aren’t always easily overridden. They are customizable within what’s allowed by their props and the theme configuration.
However, you also get access to the same CSS variables that power the Radix Themes components. You can use these tokens to create custom components that naturally feel at home in the original theme. Changes to the token system are treated as breaking.
For more information on specific tokens, refer to the corresponding guides in the 
Theme section
.
Color system
ABCD
ABCDEFG
ABCDEFGHI
ABCDEFGHIJ
ABCDEFGHIJKL
A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet I feel that I never was a greater artist than now. When, while the lovely valley teems with vapour around me, and the meridian sun strikes the upper surface of the impenetrable foliage of my trees, and but a few stray gleams steal into the inner sanctuary, I throw myself down among the tall grass by the trickling stream; and, as I lie close to the earth, a thousand unknown plants are noticed by me: when I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects and flies, then I feel the presence of the Almighty, who formed us in his own image, and the breath
Ambiguous voice of a heart which prefers kiwi bowls to a zephyr.
Typography examples
Shadow and radius examples
Overriding styles
Beyond simple style overrides, we recommend using the components as-is, or create your own versions using the same building blocks.
Most components do have className and style props, but if you find yourself needing to override a lot of styles, it’s a good sign that you should either:
Try to achieve what you need with the existing props and theme configuration.
See whether you can achieve your design by tweaking the underlying token system.
Create your own component using lower-level building blocks, such 
Primitives
 and 
Colors
.
Reconsider whether Radix Themes is the right fit for your project.
Tailwind
Tailwind is great. Yet, if you plan to use Radix Themes with Tailwind, keep in mind how its ergonomics may encourage you to create complex styles on the fly, sometimes reaching into the component internals without friction.
Tailwind is a different styling paradigm, which may not mix well with the idea of a closed component system where customization is achieved through props, tokens, and creating new components on top of a shared set of building blocks.
Custom components
If you need to create a custom component, use the same building blocks that Radix Themes uses:
Theme
 tokens that power the components
Radix Primitives
, a library of accessible, unstyled components
Radix Colors
, a color system for building beautiful websites and apps
Feel free to explore the 
source code
 of Radix Themes to see how it is built.
Common issues
z-index conflicts
Out of the box, portalled Radix Themes components can be nested and stacked in any order without conflicts. For example, you can open a popover that opens a dialog, which in turn opens another popover. They all stack on top of each other in the order they were opened:
When building your own components, use the following rules to avoid z-index conflicts:
Don’t use z-index values other than auto, 0, or -1 in rare cases.
Render the elements that should stack on top of each other in portals.
Your main content and portalled content are separated by the stacking context that the styles of the root <Theme> component create. This allows you to stack portalled content on top of the main content without worrying about z-indices.
Next.js import order
As of Next.js 13.0 to 14.1, the import order of CSS files in app/**/layout.tsx is not guaranteed, so Radix Themes may overwrite your own styles even when written correctly:
import "@radix-ui/themes/styles.css";

import "./my-styles.css";

This Next.js issue may come and go sporadically, or happen only in development or production.
As a workaround, you can merge all the CSS into a single file first via 
postcss-import
 and import just that into your layout. Alternatively, importing the styles directly in page.tsx files also works.
Tailwind base styles
As of Tailwind v3, styles produced by the @tailwind directive are usually appended after any imported CSS, no matter the original import order. In particular, Tailwind’s 
button reset
 style may interfere with Radix Themes buttons, rendering certain buttons without a background color.
Workarounds:
Don’t use @tailwind base
Set up separate CSS 
layers
 for Tailwind and Radix Themes
Set up 
postcss-import
 and manually import Tailwind base styles via @import tailwindcss/base before Radix Themes styles. 
Example setup


Missing styles in portals
When you render a custom portal in a Radix Themes project, it will naturally appear outside of the root <Theme> component, which means it won’t have access to most of the theme tokens and styles. To fix that, wrap the portal content with another <Theme>:
// Implementation example of a custom dialog using the low-level Dialog primitive

// Refer to https://www.radix-ui.com/primitives/docs/components/dialog

import { Dialog } from "radix-ui";

import { Theme } from "@radix-ui/themes";



function MyCustomDialog() {

	return (

		<Dialog.Root>

			<Dialog.Trigger>Open</Dialog.Trigger>

			<Dialog.Portal>

				<Theme>

					<Dialog.Overlay />

					<Dialog.Content>

						<Dialog.Title />

						<Dialog.Description />

						<Dialog.Close />

					</Dialog.Content>

				</Theme>

			</Dialog.Portal>

		</Dialog.Root>

	);

}

Components like Dialog and Popover in Radix Themes already handle this for you, so this is only necessary when creating your own portalled components.
Complex CSS precedence
Usually, you’d want your custom CSS to override Radix Themes styles. However, there are cases when it is natural to expect the opposite.
Consider a simple paragraph style that just resets the browser’s default margin:
.my-paragraph {

	margin: 0;

}

You might apply the margin prop from a Box onto your custom paragraph via asChild:
import "@radix-ui/themes/styles.css";

import "./my-styles.css";



function MyApp() {

	return (

		<Theme>

			<Box asChild m="5">

				<p className="my-paragraph">My custom paragraph</p>

			</Box>

		</Theme>

	);

}

Yet, this won’t work intuitively. The custom styles are imported after Radix Themes styles, so they will override the margin prop. As a workaround, Radix Themes provides separate tokens.css, components.css, and utilities.css files that the original styles.css is built upon:
import "@radix-ui/themes/tokens.css";

import "@radix-ui/themes/components.css";

import "@radix-ui/themes/utilities.css";

You can import utilities.css after your custom styles to ensure that the layout props work as expected with your custom styles. However, if you use Next.js, keep in mind the 
import order issue
 that’s mentioned above.
If you use 
standalone layout components
, split CSS files are also available for them:
import "@radix-ui/themes/layout/tokens.css";

import "@radix-ui/themes/layout/components.css";

import "@radix-ui/themes/layout/utilities.css";

Quick nav
Introduction
What you get
Overriding styles
Tailwind
Custom components
Common issues
z-index conflicts
Next.js import order
Tailwind base styles
Missing styles in portals
Complex CSS precedence
Previous
Getting started
Next
Layout
Edit this page on GitHub.
Styling – Radix Themes
Layout
Get the layout concerns right.
Layout components
Layout components are used to separate layout responsibilities from content and interactivity. This is the separation of concerns that makes your app maintainable and easy to reason about, and understanding these principles is key to building your interfaces effectively.
Box
Box
 is the most fundamental layout component. Box is used to:
Provide spacing to child elements.
Impose sizing constraints on content.
Control layout behaviour within flex and grid containers.
Hide content based on screen size using its responsive display prop.
Flex
Flex
 component does everything that Box can do, but comes with an additional set of props to organize items along an axis. It provides convenient access to the CSS 
flexbox properties
Grid
Grid
 is used to organize the content in columns and rows. Like Box and Flex, it’s made to provide convenient access to the underlying CSS 
grid properties
 without any magic of its own.
Section
Section
 provides a consistent vertical spacing between the larger parts of your page content, creating a sense of hierarchy and separation. There’s just a few pre-defined sizes for different spacing levels to keep things simple and consistent.
Container
Container
’s sole responsibility is to provide a consistent max-width to the content it wraps. Like Section, it comes just with a couple of pre-defined sizes that work well with common breakpoints and typical content widths for comfortable reading.
Common layout props
Each layout component has a set of it’s own specialized props and also a shared set of common layout props. All layout props support 
responsive object values
.
Padding
Padding props can access the 
space scale steps
 or accept any valid 
CSS padding value
.
<Box p="4" />

<Box p="100px">

<Box p={{ sm: '6', lg: '9' }}>

Prop
Type
Default
p
Responsive<enum | string>
No default value
px
Responsive<enum | string>
No default value
py
Responsive<enum | string>
No default value
pt
Responsive<enum | string>
No default value
pr
Responsive<enum | string>
No default value
pb
Responsive<enum | string>
No default value
pl
Responsive<enum | string>
No default value

Width
Width props accept any valid 
CSS width value
.
<Box width="100px" />

<Box width={{ md: '100vw', xl: '1400px' }} />

Prop
Type
Default
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
No default value

Height
Height props accept any valid 
CSS height value
.
<Box height="100px" />

<Box height={{ md: '100vh', xl: '600px' }} />

Prop
Type
Default
height
Responsive<string>
No default value
minHeight
Responsive<string>
No default value
maxHeight
Responsive<string>
No default value

Positioning
Positioning props can change how the element is placed relative to the normal flow of the document. As usual, the corresponding CSS values are accepted for each property, and the 
space scale steps
 can be used for the offset values.
<Box position="relative" />

<Box position={{ initial: "relative", lg: "sticky" }} />



<Box inset="4" />

<Box inset={{ initial: "0", xl: "auto" }} />



<Box left="4" />

<Box left={{ initial: "0", xl: "auto" }} />

Prop
Type
Default
position
Responsive<enum>
No default value
inset
Responsive<enum | string>
No default value
top
Responsive<enum | string>
No default value
right
Responsive<enum | string>
No default value
bottom
Responsive<enum | string>
No default value
left
Responsive<enum | string>
No default value

Flex children
Each layout component has props used to control the style when it is a child of a flex container.
<Box flexBasis="100%" />

<Box flexShrink="0">

<Box flexGrow={{ initial: "0", lg: "1" }} />

Prop
Type
Default
flexBasis
Responsive<string>
No default value
flexShrink
Responsive<enum | string>
No default value
flexGrow
Responsive<enum | string>
No default value

Grid children
Each layout component has props used to control the style when it is a child of a grid container.
<Box gridArea="header" />



<Box gridColumn="1 / 3" />

<Box gridColumnStart="2">

<Box gridColumnEnd={{ initial: "-1", md: "3", lg: "auto" }} />



<Box gridRow="1 / 3" />

<Box gridRowStart="2">

<Box gridRowEnd={{ initial: "-1", md: "3", lg: "auto" }} />

Prop
Type
Default
gridArea
Responsive<string>
No default value
gridColumn
Responsive<string>
No default value
gridColumnStart
Responsive<string>
No default value
gridColumnEnd
Responsive<string>
No default value
gridRow
Responsive<string>
No default value
gridRowStart
Responsive<string>
No default value
gridRowEnd
Responsive<string>
No default value

Margin props
Margin props are available on most components in order to provide spacing around the elements. They are not exclusive to layout components.
Margin props can access the 
space scale steps
 or accept any valid 
CSS margin value
<Button m="4" />

<Button m="100px">

<Button m={{ sm: '6', lg: '9' }}>

Prop
Type
Default
m
Responsive<enum | string>
No default value
mx
Responsive<enum | string>
No default value
my
Responsive<enum | string>
No default value
mt
Responsive<enum | string>
No default value
mr
Responsive<enum | string>
No default value
mb
Responsive<enum | string>
No default value
ml
Responsive<enum | string>
No default value

The margin props may be unavailable on components that don’t render a HTML node or rely on their Root part for layout.
Standalone usage
If needed, it’s possible to use just the layout component from Radix Themes. Just make sure that JavaScript tree-shaking works on your side, and import the CSS that powers the layout styles:
import "@radix-ui/themes/layout.css";

You’ll still have to wrap your app with Theme to provide the space scale and scaling factor settings.
Quick nav
Layout components
Box
Flex
Grid
Section
Container
Common layout props
Padding
Width
Height
Positioning
Flex children
Grid children
Margin props
Standalone usage
Previous
Styling
Next
Releases
Edit this page on GitHub.
Layout – Radix Themes
Releases
Radix Themes releases and their changelogs.
3.1.3
Support indeterminate indicator for the uncontrolled Checkbox component
3.1.2
Add areas prop to the Grid component and gridArea prop to all layout components (Box, Container, Flex, Grid, Section)
Add overflow-wrap: anywhere style to the DataList component so that long values—such as IDs—can break over to next line
Support indeterminate indicator for the indeterminate Checkbox component
3.1.1
June 21, 2024
Upgrade 
Radix Primitives


3.1.0
June 20, 2024
Support React 19
Upgrade all 
Radix Primitives


3.0.5
May 16, 2024
Add align, height, minHeight, and maxHeight props to AlertDialog.Content and Dialog.Content
3.0.4
May 15, 2024
Fix an issue when the Radix Themes package couldn’t be bundled with webpack because of a circular dependency within
Support the max prop on the Progress component
3.0.3
May 1, 2024
Fix an issue when the theme grayColor setting would have no effect in combination with explicit appearance="light" or appearance="dark" values
Fix a regression when Link would use an automatic high-contrast color when an explicit color value was used.
Fix a regression when Link would not use the correct text selection and focus color when nested in gray text.
Tweak Link tap highlight style
Tweak CheckboxGroup.Item and RadioGroup.Item so that a layout with overflowing text truncation would be possible to achieve
Remove an unnecessary data-accent-color attribute from components where it had no practical effect to be there.
Rework the internals of the color prop definition.
Rework the autofilled and disabled colors for TextField and TextArea
Add an internal --spinner-animation-duration CSS variable for the Spinner component
3.0.2
April 3, 2024
Remove unnecessary browser prefixes from the CSS, reducing the bundle size by 17 KB
Fix a regression when Link would not use an automatic high-contrast color when nested within colored text.
Fix a regression when Link wouldn't display hover styles when rendered as a button
Fix a regression when TextArea would not preserve sequences of white space in Firefox
3.0.1
March 26, 2024
Fix a syntax error in the reset stylesheet
Fix Checkbox size="1" indicator checkmark alignment in Safari
Fix Checkbox and Radio disabled cursor styles not working in Safari
3.0.0
March 23, 2024
Radix Themes 3.0 comes with a new layout engine, 11 new components, and full ESM support. 
Read the announcement
.
Upgrade guide
This release introduces a number of breaking changes. Please follow the steps below to upgrade.
General
Multi-part components now don’t export named parts anymore. Use dot notation instead, which was revised to work with React Server Components. For example:
DialogRoot → Dialog.Root
DialogTrigger → Dialog.Trigger
DialogContent → Dialog.Content
…and so on for all multi-part components:
AlertDialog
Callout
ContextMenu
Dialog
DropdownMenu
HoverCard
Popover
RadioGroup
Select
Table
Tabs
TextField




Package internals such as prop definitions and helpers are no longer available from the root @radix-ui/themes import entry point.
Import them from @radix-ui/themes/props and @radix-ui/themes/helpers instead.


Props
The width and height props on layout components don't map to space scale anymore. Find and replace your width and height prop usage with the corresponding 
space scale
 steps:
width="1" → width="4px"
width="2" → width="8px"
width="3" → width="12px"
width="4" → width="16px"
width="5" → width="24px"
width="6" → width="32px"
width="7" → width="40px"
width="8" → width="48px"
width="9" → width="64px"
…and so on for height
Make sure to update responsive object syntax as well
You can also use var(--space-1) to var(--space-9) instead of hardcoded values.


The shrink and grow props on layout components were renamed
shrink → flexShrink
grow → flexGrow


Colors
If you were using the following tokens for your custom components, make sure to replace the corresponding references.
--color-surface-accent → --accent-surface
Contrast colors were renamed:
--accent-9-contrast → --accent-contrast
--red-9-contrast → --red-contrast
--pink-9-contrast → --pink-contrast
--blue-9-contrast → --blue-contrast
…and so on for all scales


Added a new focus color scale. Rename the following tokens:
--color-autofill-root → --focus-a3
--color-focus-root → --focus-8
--color-selection-root → --focus-a5


--gray-2-translucent and the corresponding tinted gray colors were removed.
Use --color-panel-translucent in combination with a backdrop blur filter instead.


Components
AlertDialog, Dialog now have maxWidth="600px" by default on the Content part.
This is slightly larger than the previous 580px value. If you use dialogs that need a different width, override maxWidth with your own value.


Badge has a new size="3", size="2" is now much smaller, and size="1" dimensions were tweaked
Replace your size="2" usage with size="3"


Card internal HTML structure and styles were reworked and now renders a single HTML node. Make sure that your code works as expected if you were relying on any of the implementation quirks to override styles or behaviour.
If you need to override the Card’s background color on variants other than ghost, use --card-background-color variable instead of assigning background-color directly, or set your background color on an <Inset p="current"> element nested as the first child of the Card.
Check your Card instances that uses asChild or is asChild’ed onto by a parent component. (The common case with link or button card without any extra styles will work as expected).


HoverCard and Popover now have maxWidth="480px" by default on the Content part.
If you use popovers and hover cards that need a wider width, override maxWidth with your own value.


RadioGroup internal HTML structure and styles were reworked and is now designed to display an optional text label when passing children to the Item part. The Root part now also provides flex column styles and spacing.
If you need lower-level control, you can use the Radio component instead


Section has a new size="3"
Update all your Sections that used size="3" to size="4"


Tabs underlying letter/word spacing CSS variables were renamed to support both Tabs and TabNav components. If you were using them, rename them to the new values:
--tabs-trigger-active-letter-spacing → --tab-active-letter-spacing
--tabs-trigger-active-word-spacing → --tab-active-word-spacing
--tabs-trigger-inactive-letter-spacing → --tab-inactive-letter-spacing
--tabs-trigger-inactive-word-spacing → --tab-inactive-word-spacing


TextField now only has 2 parts: Root and Slot, dropping the Input part and simplifying how props are forwarded.
All TextField.Input parts used without TextField.Root should be renamed to TextField.Root
All TextField.Input parts used within TextField.Root should be removed and their props should be put directly on the TextField.Root part
All TextField.Slot parts placed to the right of TextField.Input will need side="right" prop. However, no adjustment is needed when two slots were used within one TextField, e.g. one slot on the left and another one on the right. In that case, the slots will be automatically placed on different sides.
Make sure that your code works as expected if you were relying on any of the implementation quirks to override styles or behaviour.


Theme does not set body background color automatically anymore. The background color is now provided by the root Theme by default. The CSS variable --color-page-background is no longer available.
In most cases, it can be safely replaced with --color-background available on the .radix-themes element.


Tooltip now has maxWidth="360px" by default on the Content part.
If you use tooltips that need to be wider, override maxWidth with your own value.


Full changelog
General
Package structure
Improve ESM compatibility
Improve tree-shaking of individual component parts
[Breaking] Drop named exports for multi-part components
Note: Our new approach allows dot notation to work reliably in server components too


[Breaking] Remove component prop definitions and internal helpers from the root @radix-ui/themes import entry point and export them from @radix-ui/themes/props and @radix-ui/themes/helpers to make it possible to build your own component library on top of Radix Themes using the same techniques.
Add a wildcard entry point to the package to allow direct access to the package internals as an escape hatch if you have a complex tooling setup that can’t support modern module resolution rules
Add extra CSS file exports for advanced use-cases:
Export individual tokens.css, components.css, and utilities.css files in case you need fine-grained control of the CSS precedence. For example, this allows to import Radix Themes utilities.css after your own CSS, and everything else before that.
Additionally to the above, you can customise which colors to import. Instead of importing tokens.css, you can also import tokens/base.css and tokens/colors/*.css, where * corresponds to the names of the accent and gray colors you need in your project.
Export layout.css that only includes styles for the layout components (Box, Flex, Grid, Container, Section). Individual exports layout/tokens.css, layout/components.css, and layout/utilities.css are also available to support the above use-case.




Props
Add the following props to all layout components:
minWidth, maxWidth
minHeight, maxHeight
flexBasis, flexShrink, flexGrow
gridColumn, gridColumnStart, gridColumnEnd
gridRow, gridRowStart, gridRowEnd
overflow, overflowX, overflowY


Rework all layout props to allow arbitrary CSS values, including when used with the responsive object syntax. Props that support arbitrary values include:
width, minWidth, maxWidth
height, minHeight, maxHeight
m, mx, my, mt, mr, mb, ml
p, px, py, pt, pr, pb, pl
inset, top, right, bottom, left
gap, gapX, gapY
flexBasis, flexShrink, flexGrow
gridColumn, gridColumnStart, gridColumnEnd
gridRow, gridRowStart, gridRowEnd


[Breaking] The width and height props don't map to space scale anymore. This is because in the vast majority of cases, width and height were not set to space scale, and with that, space scale as an IDE autocomplete suggestion felt odd/misleading.
[Breaking] Rename shrink and grow props to flexShrink and flexGrow
Update the type signature of the layout props so that code editor suggestions use just space scale values when possible. CSS keywords and other values such as "auto" or "100vw" are still available as manual string values.
Document all layout props with JSDoc
Fix an issue with responsive props when using a breakpoints object without the initial key would not apply the default prop value
Remove the native color, defaultValue, and defaultChecked attributes from components that inherit them from the native HTML elements to avoid confusion with their custom implementations
[Breaking] Rework the availability of asChild prop on all components and parts


Colors
Make sure highContrast text colors work consistently when nested within other components that accept an accent color
Tweak the background color of all variant="soft" menu items
[Breaking] Rename --color-surface-accent to --accent-surface
[Breaking] Rename --accent-9-contrast, --red-9-contrast, --pink-9-contrast, --blue-9-contrast, etc. to --accent-contrast, --red-contrast, --pink-contrast, --blue-contrast and so on.
Remove --gray-2-translucent and the corresponding tinted gray colors
Tweak --color-surface and --color-panel-translucent values
[Breaking] Replace --color-focus-root, --color-selection-root, --color-autofill-root with a focus color scale, e.g. --focus-1 – --focus-12, and --focus-a1 – --focus-a12.


Other
Speed up most of the animations
Ensure all elements that have padding or border styles use box-sizing: border-box
Ensure that disabled cursor styles are applied correctly
Add a blur backdrop filter effect to the translucent panels




11 new components
DataList
Component for displaying text data as key-value pairs. Parts:
Root
Item
Label
Value




CheckboxGroup
Group of checkboxes with an optional text label and roving focus. Parts:
Root
Item




CheckboxCards
Interactive card components to pick one or more value from the list. Parts:
Root
Item




Progress
Progress bar component that indicates completion of a task.


Radio
Standalone element for building your own layouts with radio inputs.


RadioCards
Interactive card components to pick one of the values from the list. Parts:
Root
Item




Reset
Component that resets the styles for any native HTML element.


SegmentedControl
Component for selecting a single option out of many and for controlling tab-like interfaces


Skeleton
Component that may wrap any UI element and turn it into a loading skeleton. Can also render self or a React Fragment conditionally using a loading prop.


Spinner
Loading spinner component. Like Skeleton, it also may wrap any UI element and display itself using a conditional loading prop.


TabNav
Equivalent for Tabs, but used for page navigation. Renders regular links and supports roving focus. Parts:
Root
Link






AlertDialog, Dialog
Add position: relative to support absolutely positioned children.
Add width, minWidth, maxWidth props to the Content part.
Set maxWidth="600px" by default on the Content part.
Rework the scroll container so that it displays scrollbars on the viewport rather than confined to the dialog Content part. Make sure that your code works as expected if you were relying on any of the implementation quirks to override styles or behaviour.


Badge
Remove user-select: none
[Breaking] Add size="3", make size="2" much smaller, tweak size="1" dimensions


Blockquote, Code, Em, Heading, Quote, Link, Strong, Text
Add new wrap and truncate props that control whether the text wraps and whether it is truncated with ellipsis


Card
Rework the internal HTML structure and styles. This component now renders a single HTML node. Make sure that your code works as expected if you were relying on any of the implementation quirks to override styles or behaviour.


Code
variant="ghost" color now works similarly to Text, inheriting the color unless set explicitly using the color prop


Container
Add align prop to control whether the container content is aligned to the left, center, or right
[Breaking] Change the display="block" value to display="initial" (the former value was broken)


ContextMenu, DropdownMenu
Add color prop to CheckboxItem and RadioItem parts


Checkbox, RadioGroup, Switch
Rework the internal HTML structure and styles. These components now render fewer HTML nodes and forward all props to the topmost node. Make sure that your code works as expected if you were relying on any of the implementation quirks to override styles or behaviour.


DropdownMenu
Use a brighter text color for the highlighted item when the Content part uses variant="soft"
Add an optional TriggerIcon part that renders an arrow down indicator


Box, Flex, Grid
Add support for as prop to render as span or div
For Box, display: block style is now enforced regardless of the tag


Button, IconButton
Add new loading prop


Flex
Add gapX and gapY props


HoverCard, Popover
Add position: relative to support absolutely positioned children.
Add width, minWidth, maxWidth, height, minHeight, maxHeight props to the Content part.
Set maxWidth="480px" by default on the Content part.


RadioGroup
[Breaking] Rework the internal HTML structure and styles. This component is now designed to display an optional text label when passing children to the Item part, and the Root part now provides flex column styles and spacing.


Section
[Breaking] Change the display="block" value to display="initial" (the former value was broken)
[Breaking] Use a new value for size="3", use the previous value for size="4"


Select
Make sure that Trigger font weight is not inherited, e.g. from a wrapping <label> element


Separator
Allow responsive values for the orientation prop


ScrollArea
Fix an issue when Scroll Area would be unable to stretch to 100% height when informed by the parent’s auto height


Slider
Change the size of the bounding box to match the size of the Slider track
Replace flex-shrink: 0 with flex-grow: 1 and width: stretch / height: stretch to allow the slider element to flex and shrink in layouts more intuitively.
Fix an overzealous focus outline in Safari


Table
Add new layout prop to control the table-layout style property
Align width prop type signature and implementation on the TableCell part with the reworked width prop on the layout components
Add minWidth and maxWidth props to the TableCell part


Tabs:
Add color and highContrast props to TabsList
Add margin props TabsList and TabsContent
Renamed the letter/word spacing CSS variables in .radix-themes so that it supports both Tabs and TabNav components.
--tabs-trigger-active-letter-spacing → --tab-active-letter-spacing
--tabs-trigger-active-word-spacing → --tab-active-word-spacing
--tabs-trigger-inactive-letter-spacing → --tab-inactive-letter-spacing
--tabs-trigger-inactive-word-spacing → --tab-inactive-word-spacing




TextArea
Add radius prop
Add resize prop
Fix an issue when Grammarly extension would break the component styles
Make sure that the font weight is not inherited, e.g. from a wrapping <label> element
Rework the internal HTML structure and styles. Make sure that your code works as expected if you were relying on any of the implementation quirks to override styles or behaviour.


TextField
[Breaking] Remove the Input part to simplify how props are forwarded and rework internal HTML structure and styles.
Fix an issue with some input types not supporting getSelectionRange
Fix an issue when Grammarly extension would break the component styles
Make sure that the font weight is not inherited, e.g. from a wrapping <label> element


ThemePanel
Change the hotkey to toggle the Theme Panel to "T" keypress and dark mode to "D" keypress (without modifiers).


Theme
Set min-height: 100vh on the root Theme component
Fix an issue when in certain situations, hasBackground prop value would have no effect
Refine the logic for when Theme has a background color by default. Theme without an explicit hasBackground prop will display a background color:
When it is the root Theme component
When it has an explicit appearance value, e.g. <Theme apperance="light"> or <Theme apperance="dark">


Body background color is no longer set automatically. The background color is now provided by the root Theme by default.
[Breaking] The CSS variable --color-page-background is no longer available.
suppressHydrationWarning on html is no longer needed (unless required by other libraries, like next-themes)


Document all Theme props with JSDoc


Tooltip
Add width, minWidth, maxWidth props.
Set maxWidth="360px" by default on the tooltip content
Change the default delay duration to 200ms


2.0.2
December 5, 2023
Fix an issue when Chrome would sometimes crash while using CSS inspector on a Radix Themes stylesheet.
2.0.1
November 14, 2023
Card
Fix an issue when variant="surface" border color may disappear in browsers that don't support color-mix.
Tweak variant="surface" border color.


Code
When variant="ghost" is used within a Link, make sure that underline="hover" on the Link is respected.


TextField
Improve vertical text alignment with common fonts.
Don’t apply the autofill accent color when the input is disabled.
Make sure the autofill accent color always pairs with the focus outline color.


2.0.0
October 2, 2023
View docs for this version
General
Combine selectors in the CSS build, improving the developer experience when inspecting elements in the browser.
Remove comments from the CSS build.
Cap CSS selector specificity at 0,1,0 for styling HTML elements and at 0,1,1 for styling pseudo-elements, improving compatibility with Tailwind.
[Upgrade guide] If you were relying on any specificity quirks of Radix Themes, make sure that your style overrides still work as expected.


Rework dark mode colors, refine light mode colors (via Radix Colors 3.0.0).
Fix oversaturated transparent grays.
[Upgrade guide] If you were using the color tokens for your custom styles, make sure that your designs look as expected.
[Upgrade guide] If you were overriding certain colors, make sure that your overrides are harmonized with the new color scales.


Rework transparent black and white color scales.
[Upgrade guide] If you were using transparent black and white color scales for your custom styles (--black-a1, --white-a1, etc.), make sure to check the new values and update the steps used so that your designs look as expected:
Change --black-a1 to rgba(0, 0, 0, 0.01).
Change --black-a2 to rgba(0, 0, 0, 0.024).
Change --black-a3 to --black-a1.
Change --black-a4 to --black-a2.
Change --black-a5 to --black-a2.
Change --black-a6 to --black-a3.
Change --black-a7 to --black-a3 or --black-a4.
Change --black-a8 to --black-a5.
Change --black-a9 to --black-a6 or --black-a7.
Change --black-a10 to --black-a7.
Change --black-a11 to --black-a8.
Change --black-a12 to --black-a11.
Change --white-a1 to transparent.
Change --white-a2 to rgba(255, 255, 255, 0.01).
Change --white-a3 to --white-a1 or --white-a2.
Change --white-a4 to --white-a2.
Change --white-a5 to --white-a3.
Change --white-a6 to --white-a3 or --white-a4.
Change --white-a7 to --white-a4.
Change --white-a8 to --white-a5.
Change --white-a9 to --white-a6.
Change --white-a10 to --white-a7.
Change --white-a11 to --white-a9.
Change --white-a12 to --white-a11 or --white-a12.




Refine the shadow scale.
Maintain theme accent color for focus rings on most color="gray" component, similarly to the text selection color.
Change some internal component-specific CSS variables to follow a naming pattern.
Make sure that forced light/dark appearance on the Theme component also sets the corresponding browser colors, like the correct input autofill background color.
Rename all @keyframes animations with rt- prefix and into kebab case.
Use outline rather than box-shadow for most focus styles, which avoids a slight anti-aliasing issue in Chrome on focused elements.


AlertDialog, Dialog
Add padding around dialog content to prevent it from touching the viewport edges.
Make sure that the dialog content doesn’t overflow viewport on iOS.


Avatar
Don’t enforce fallback icon size.
[Upgrade guide] If you were using svg assets as a fallback, make sure to set an appropriate size manually.


Add CSS variables to control the cursor style on interactive elements:
--cursor-button: default;
--cursor-checkbox: default;
--cursor-disabled: not-allowed;
--cursor-link: pointer;
--cursor-menu-item: default;
--cursor-radio: default;
--cursor-slider-thumb: default;
--cursor-slider-thumb-active: default;
--cursor-switch: default;


Replace .rt-reset-button and .rt-reset-a classes with a single .rt-reset class.
The new .rt-reset class can be use to reset a, button, h1, h2, h3, h4, h5, h6, ol, ul, p, and pre tags when building custom components.
[Upgrade guide] If you were using these classes for your custom components, update the class name used.




Blockquote
[Breaking] Remove trim prop.


Button, IconButton
Refine and normalise the look and feel of the disabled states.
Apply disabled styles to other elements when using disabled together with asChild
Improve variant="classic" look and feel across different accent colors in light and dark mode.


Callout
Tweak how the layout works to allow nesting multiple Callout.Text elements within Callout.Root
[Upgrade guide] If you were relying on how Callout.Root happened to provide flex properties, change your layout to use a Flex component explicitly.


Fix an issue when the callout would inherit text color unless an explicit color prop was passed.
[Upgrade guide] If you preferred the previous look, pass highContrast prop to your callouts to make the text darker.


Use a gray background for a gray variant="surface".
Use a darker outline color variant="outline".


Checkbox
[Breaking] Improve layout so that wrapping a checkbox in Text component automatically aligns the checkbox with the first line of the text.
[Upgrade guide] Make sure that your layouts with checkboxes look as expected. If not, wrap your checkboxes in <Text as="label" size="...">, using your preferred text size.


[Breaking] Rework sizes – add a smaller size="1", change the default size to size="2", add a more refined size="3"
[Upgrade guide] If you were using size="1" or size="2" checkboxes via an explicit size prop, rename them to size="2" and size="3" respectively.


Refine the look and feel of variant="classic".
Refine and normalise the look and feel of the disabled states.


Card
Update the variant="classic" shadow so that it doesn’t extend outside of the element.
Refine hover and pressed styles for variant="classic".
Add missing pressed styles.
Refine how the inner shadows are applied so that they blend with the background outside of the component.


Code
Add interactive styles when Code is within Link.
Fix an issue when variant="ghost" font size would be inconsistent depending on whether the size was based on a parent Text element or came from the code’s own size prop.
Scale the outline thickness relative to the font size for variant="outline" and variant="surface".
Improve ::selection background color for variant="solid".
Add CSS variables to .radix-themes for customising the padding of Code variants in case the default values don’t work well with the vertical metrics of custom code font.
--code-padding-top
--code-padding-bottom




DropdownMenu, ContextMenu
Reduce border radius when theme setting is radius="full".
Refine horizontal paddings.
Refine label look and feel.


Grid
Fix a bug when nesting Grid components could cause the descendant Grid’s to inherit some parent styles unintentionally.


Inset
Add clip prop to control whether content is clipped to the padding or to the border of the parent element.
Automatically adjust table cell padding for when Table is inside Inset


Kbd
Tweak vertical alignment.


Link
Desaturate the underline color.
Make links automatically high-contrast within colored Heading elements (similarly to the automatic high-contrast within Text).
Scale the underline thickness relative to the font size for variant="outline" and variant="surface".


RadioGroup
[Breaking] Improve layout so that wrapping a radiobutton in Text component automatically aligns the radiobutton with the first line of the text.
[Upgrade guide] Make sure that your layouts with radio buttons look as expected. If not, wrap your radio buttons in <Text as="label" size="...">, using your preferred text size.


[Breaking] Rework sizes – add a smaller size="1", change the default size to size="2", add a more refined size="3".
[Upgrade guide] If you were using size="1" or size="2" radio buttons via an explicit size prop, rename them to size="2" and size="3" respectively.


Refine the look and feel of variant="classic".
Refine and normalise the look and feel of the disabled states.


Select
Fix invisible scrollbar in long item lists.
Improve variant="classic" look and feel across light and dark mode.
Align SelectContent to the left of the trigger when using position="popper".
Refine horizontal paddings.
Refine label look and feel.
Rework size="3".


ScrollArea
Upgrade the primitive version, fixing an upstream type issue.
Rename scrollbar margin variables to include the scrollbar orientation and declare them on .radix-themes to facilitate easier scrollbar position adjustments.
[Upgrade guide] If you were using the variables --scrollarea-scrollbar-margin-top, --scrollarea-scrollbar-margin-left, etc. make sure that they follow the new names and are set at the appropriate level. There's no need to target .rt-ScrollAreaScrollbar element to set the variables anymore, as they can be set just on the component that needs the override. New variables:
--scrollarea-scrollbar-horizontal-margin-top
--scrollarea-scrollbar-horizontal-margin-bottom
--scrollarea-scrollbar-horizontal-margin-left
--scrollarea-scrollbar-horizontal-margin-right
--scrollarea-scrollbar-vertical-margin-top
--scrollarea-scrollbar-vertical-margin-bottom
--scrollarea-scrollbar-vertical-margin-left
--scrollarea-scrollbar-vertical-margin-right






Slider
Refine the shadows and colors used in the components.
Refine and normalise the look and feel of the disabled states.
Fix an issue where high contrast sliders would have an incorrect disabled style.


Switch
[Breaking] Improve layout so that wrapping a switch in Switch component automatically aligns the switch with the first line of the text.
[Upgrade guide] Make sure that your layouts with switches look as expected. If not, wrap your switches in <Text as="label" size="...">, using your preferred text size.


[Breaking] Rework sizes, making size="2" and size="3" smaller.
[Upgrade guide] Use size="3" instead of size="2" to match the previous look.


Refine the shadows and colors used in the components.
Refine and normalise the look and feel of the disabled states.


Table
Refine how the outer border is applied so that it blends with the background outside of the component.


Tabs
Add CSS variables to .radix-themes for customising the letter spacing and word spacing of active and inactive tabs so that you can minimise the apparent shift in weight in case the default values don’t work for your custom font.
--tabs-trigger-active-letter-spacing
--tabs-trigger-active-word-spacing
--tabs-trigger-inactive-letter-spacing
--tabs-trigger-inactive-word-spacing




Text
Add as="label" option to the as prop.
Improve how prop types are resolved when as prop isn’t specified.


TextArea
Rework the internal implementation, now using multiple HTML nodes for styling purposes.
Adjust the layout styles so that TextArea behaves like a true display: block element, filling the available space horizontally.
The style and className are now forwarded to the wrapping div element. The ref and other props are still forwarded to the textarea itself.
[Upgrade guide] If you were overriding TextArea styles via style, className, or custom CSS that targets the related HTML nodes, make sure that your custom styles work as expected.
[Upgrade guide] If you were relying on the intrinsic width of TextArea set by the browser, make sure that your layout looks as expected.


Refine padding values for a more balanced look.
Use matching scroll margins for a nicer typing experience when the TextArea overflows.


Refine how the inner shadows are applied so that they blend with the background outside of the component.
Refine and normalise the look and feel of disabled and read-only states.
Fix a Safari bug when the text value would appear tinted in the disabled input.
Improve autofill styles.


TextField
Reset z-index of the container to avoid potential stacking issues.
Refine padding values for a more balanced look.
Use text-indent instead of padding-left so that long values aren't truncated on the left when the cursor is at the end of the input.


Refine how the inner shadows are applied so that they blend with the background outside of the component.
Refine and normalise the look and feel of disabled and read-only states.
Fix a Safari bug when the text value would appear tinted in the disabled input.
Remove ellipsis truncation, as this prevented long values from being shown when scrolling on the input horizontally in Chrome.
Improve autofill styles.


ThemePanel
Disable transitions when changing the appearance.
Improve contrast in the border radius preview.


Tooltip
Reduce border radius when theme setting is radius="full".
[Breaking] Remove multiline prop.
[Upgrade guide] If you were using multiline prop, pass style={{ maxWidth: 250 }} to the relevant Tooltip elements.




1.1.2
August 22, 2023
Export ThemeProps and ThemePanelProps
1.1.1
August 22, 2023
View docs for this version
Export prop types for all components, resolving type errors with certain setups.
1.1.0
August 21, 2023
View docs for this version
Three new color scales: ruby, iris, and jade
Set explicit versions of the Radix Primitives dependencies to allow stable builds.
Use an explicit React.FC type for ContextMenuSub, DialogRoot, HoverCardRoot, and PopoverRoot, resolving a type error with certain setups.
1.0.0
August 8, 2023
View docs for this version
Initial release! 🎉
Quick nav
3.1.3
3.1.2
3.1.1
3.1.0
3.0.5
3.0.4
3.0.3
3.0.2
3.0.1
3.0.0
Upgrade guide
Full changelog
2.0.2
2.0.1
2.0.0
1.1.2
1.1.1
1.1.0
1.0.0
Previous
Layout
Next
Resources
Edit this page on GitHub.
Releases – Radix Themes
Theme overview
Use the Theme component to change the look and feel of your UI.
Anatomy
The 
Theme component
 defines the overall visual look of your application. It can be customized by passing a minimal set of configuration options.
Sound
Yamaha THR
NormalizeOn
EqualizerOn
3D AudioOff
Cross-FadeOff
<Theme
	accentColor="mint"
	grayColor="gray"
	panelBackground="solid"
	scaling="100%"
	radius="full"
>

	<ThemesVolumeControlExample />

</Theme>

A well tuned set of defaults is provided to get you started, but don’t be afraid to play with all of the available options to find the right visual style for your application. Check out the 
Playground
 to see what effect each option has.
Variants
Variants are visual variations of a component which are used to create visual hierarchies and communicate relative importance.
Each component offers a different set of variants, though all are designed to be consistent and complimentary with each other.
<Flex gap="3" align="center">

	<Button variant="classic">

		Get started <ArrowRightIcon />

	</Button>

	<Button variant="solid">

		Get started <ArrowRightIcon />

	</Button>

	<Button variant="soft">

		Get started <ArrowRightIcon />

	</Button>

</Flex>

Examples
Using a combination of component variants alongside customized theme settings allows you to create a multitude of unique-looking interfaces.
For example you could create:
Music applications


Ecommerce product elements


SaaS dashboards


Or any number of differing treatments and styles.
Your profile
Name
Username
Email
Privacy
Display my listening history
Everyone can follow my activity
Show my playlists in search
Danger zone
Reset recommendations
Delete profile
Invoice paid
You paid $17,975.30. A receipt copy was sent to acc@example.com
Tokens
Tokens provide direct access to theme values and give you flexibility to build and customize your own themed components.
For all available theme tokens see the 
source code
, or read more about each type of token in the relevant theme pages.
Color
Understand the color system and its application in your theme.
Typography
Learn how to use and customize the typographic elements of your theme.
Spacing
Explore the spacing scale and the available scaling options.
Radius
Choose the radius setting in your theme that fits your style.
Shadows
Use elevation, depth and shadows effectively and customize their properties.
Cursors
Customizing cursors used for interactive elements.
Quick nav
Anatomy
Variants
Examples
Tokens
Previous
Resources
Next
Color
Edit this page on GitHub.
Theme overview – Radix Themes
Color
Understanding the color system and its application in your theme.
Radix Themes comes with a number of color scales, each with their own light, dark and alpha variants. Under the hood, the color system is powered by 
Radix Colors
.
Accents
Accent color is the most dominant color in your theme. It is used for primary buttons, links and other interactive elements. accentColor is specified directly on the 
Theme
 component:
<Theme accentColor="indigo">

	<MyApp />

</Theme>

Available accent colors
There is a range of accent colors to choose from:
Gray
Gold
Bronze
Brown
Yellow
Amber
Orange
Tomato
Red
Ruby
Crimson
Pink
Plum
Purple
Violet
Iris
Indigo
Blue
Cyan
Teal
Jade
Green
Grass
Lime
Mint
Sky
Accent scale anatomy
Each accent is a 12-step scale that includes a solid and a transparent variant of each color. For example, here’s the indigo color scale:
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
Accent scale tokens
Accent color tokens can be accessed using CSS variables. You can use these tokens to style your custom components, ensuring they are accessible and consistent with the rest of your theme.
/* Backgrounds */

var(--accent-1);

var(--accent-2);



/* Interactive components */

var(--accent-3);

var(--accent-4);

var(--accent-5);



/* Borders and separators */

var(--accent-6);

var(--accent-7);

var(--accent-8);



/* Solid colors */

var(--accent-9);

var(--accent-10);



/* Accessible text */

var(--accent-11);

var(--accent-12);



/* Functional colors */

var(--accent-surface);

var(--accent-indicator);

var(--accent-track);

var(--accent-contrast);

Grays
You can also choose between a pure gray or a number of tinted grays. Your accent color will be automatically paired with a gray shade that compliments it. However, you can also specify a custom grayColor directly on the 
Theme
 component:
<Theme grayColor="mauve">

	<MyApp />

</Theme>

Available gray colors
There is 6 grays to choose from. The difference may seem subtle, but it is impactful especially on pages with a lot of text or in dense UIs.
Gray
Mauve
Slate
Sage
Olive
Sand
Gray scale anatomy
Grays are based on the same 12-step color scale that includes a solid and a transparent variant of each color. For example, here’s the slate color scale:
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
Gray scale tokens
Gray color tokens can be accessed using CSS variables. You can use these tokens to style your custom components, ensuring they are accessible and consistent with the rest of your theme.
/* Backgrounds */

var(--gray-1);

var(--gray-2);



/* Interactive components */

var(--gray-3);

var(--gray-4);

var(--gray-5);



/* Borders and separators */

var(--gray-6);

var(--gray-7);

var(--gray-8);



/* Solid colors */

var(--gray-9);

var(--gray-10);



/* Accessible text */

var(--gray-11);

var(--gray-12);



/* Functional colors */

var(--gray-surface);

var(--gray-indicator);

var(--gray-track);

var(--gray-contrast);

Color overrides
When available, the color prop on the components can be used to override the theme accent. Nested components will automatically inherit the new accent color.
There are new commits.
There are new commits.
<Theme accentColor="indigo">

	<Flex align="start" direction={{ initial: "column", sm: "row" }} gap="4">

		<Callout.Root>

			<Callout.Icon>

				<InfoCircledIcon />

			</Callout.Icon>

			<Callout.Text>

				<Flex as="span" align="center" gap="4">

					<Text>There are new commits.</Text>

					<Button variant="surface" size="1" my="-2">

						Refresh

					</Button>

				</Flex>

			</Callout.Text>

		</Callout.Root>



		<Callout.Root color="gray">

			<Callout.Icon>

				<InfoCircledIcon />

			</Callout.Icon>

			<Callout.Text>

				<Flex as="span" align="center" gap="4">

					<Text>There are new commits.</Text>

					<Button variant="surface" size="1" my="-2">

						Refresh

					</Button>

				</Flex>

			</Callout.Text>

		</Callout.Root>

	</Flex>

</Theme>

Individual color tokens
Individual colors can be accessed directly using similar CSS variables by their corresponding names. For example, the reds are accessed via --red-1, --red-2, and so on up to --red-12.
High contrast
Most of the time, components with a color prop also provide a highContrast option that achieves appearance that stands out against the page background:
<Flex gap="4">

	<Button variant="classic" color="gray">

		Edit profile

	</Button>

	<Button variant="classic" color="gray" highContrast>

		Edit profile

	</Button>

</Flex>

Focus and selection
Radix Themes automatically adjusts the focus and selection colors depending on the accent color of the current component. Most of the time, setting the color prop will intelligently change the focus and selection colors to avoid a mismatch of conflicting hues:
Complete your account setup in 
settings
Complete your account setup in 
settings
Complete your account setup in 
settings
<Theme accentColor="indigo">

	<Flex direction="column" gap="4">

		<Text>

			Complete your account setup in <Link href="#">settings</Link>

		</Text>

		<Text color="gray">

			Complete your account setup in <Link href="#">settings</Link>

		</Text>

		<Text color="red">

			Complete your account setup in <Link href="#">settings</Link>

		</Text>

	</Flex>

</Theme>

Focus scale tokens
Focus color tokens can be accessed using CSS variables that follow a similar naming structure like the other scales, e.g. --focus-1, --focus-2, and so on up to --focus-12.
Most of the components use --focus-8 for the focus outline color.
Alpha colors
Every color has an alpha variant which is designed to appear visually the same when placed over the page background. This is a powerful tool that allows colors to look naturally when overlayed over another background. All numerical color steps have a corresponding alpha variant.
/* Solid colors */

var(--red-1);

var(--red-2);

...

var(--red-12);



/* Alpha colors */

var(--red-a1);

var(--red-a2);

...

var(--red-a12);

Alpha colors are used automatically within Radix Themes components—no additional configuration is required.
Backgrounds
A number of background colors are used to create a sense of visual hierarchy in Radix Themes UIs. These colors are used for backgrounds, cards, and other surfaces.
/* Page background */

var(--color-background);



/* Panel backgrounds, such as cards, tables, popovers, dropdown menus, etc. */

var(--color-panel-solid);

var(--color-panel-translucent);



/* Form component backgrounds, such as text fields, checkboxes, select, etc. */

var(--color-surface);



/* Dialog overlays */

var(--color-overlay);

Panel background
The panelBackground prop controls whether panelled elements use a solid or a translucent background color. The default translucent value creates a subtle overlay effect:
<Theme panelBackground="translucent">

	<MyApp />

</Theme>

Sign up
Email address
Password
Forgot password?
While solid is useful when you'd prefer to present information unobstructed.
<Theme panelBackground="solid">

	<MyApp />

</Theme>

Sign up
Email address
Password
Forgot password?
Customization
Radix Themes colors can be customized by overriding the corresponding CSS variables of the token system. Refer to the 
source code
 for the full list of the color tokens.
Make sure that your CSS is applied after the Radix Themes styles so that it takes precedence.
Brand color
You can replace a specific color with your brand color by remapping the corresponding token. Usually, you’d override step 9 of the scale that you are using as your theme accent.
.radix-themes {

	--my-brand-color: #3052f6;

	--indigo-9: var(--my-brand-color);

	--indigo-a9: var(--my-brand-color);

}

In this example, using solid-colored indigo components will now reference your custom color.
Custom palette
You can use the 
custom color palette tool
 to generate a custom palette based just on a couple reference colors. Once you are happy with the result, paste the generated CSS into your project. You can rename the generated colors to match the accent that you want to use in your theme.
To generate dark theme colors, toggle the appearance to use the dark theme. Make sure to paste the generated CSS after your light theme color overrides.

Create a custom palette →
Color aliasing
You may prefer to use generic color names to refer to the color shades that you want to use. For example, it is common to refer to crimson, jade, and indigo as red, green, and blue respectively.
In this case, you can remap Radix Themes tokens in place of one another and reclaim the color names you want to use:
.radix-themes {

	--red-1: var(--ruby-1);

	--red-2: var(--ruby-2);

	--red-3: var(--ruby-3);

	--red-4: var(--ruby-4);

	--red-5: var(--ruby-5);

	--red-6: var(--ruby-6);

	--red-7: var(--ruby-7);

	--red-8: var(--ruby-8);

	--red-9: var(--ruby-9);

	--red-10: var(--ruby-10);

	--red-11: var(--ruby-11);

	--red-12: var(--ruby-12);



	--red-a1: var(--ruby-a1);

	--red-a2: var(--ruby-a2);

	--red-a3: var(--ruby-a3);

	--red-a4: var(--ruby-a4);

	--red-a5: var(--ruby-a5);

	--red-a6: var(--ruby-a6);

	--red-a7: var(--ruby-a7);

	--red-a8: var(--ruby-a8);

	--red-a9: var(--ruby-a9);

	--red-a10: var(--ruby-a10);

	--red-a11: var(--ruby-a11);

	--red-a12: var(--ruby-a12);



	--red-surface: var(--ruby-surface);

	--red-indicator: var(--ruby-indicator);

	--red-track: var(--ruby-track);

	--red-contrast: var(--ruby-contrast);

}

In this example, using the red color in Radix Themes components and tokens would now reference the original ruby scale.
Individual CSS files
Color definitions comprise around 20% of the total CSS size that Radix Themes ships with.
If you’d prefer to reduce your CSS bundle size and have access just to the colors you use, you can import the individual CSS files for each color module. Here’s a sample setup:
// Base theme tokens

import "@radix-ui/themes/tokens/base.css";



// Include just the colors you use, for example `ruby`, `teal`, and `slate`.

// Remember to import the gray tint that matches your theme setting.

import "@radix-ui/themes/tokens/colors/ruby.css";

import "@radix-ui/themes/tokens/colors/teal.css";

import "@radix-ui/themes/tokens/colors/slate.css";



// Rest of the CSS

import "@radix-ui/themes/components.css";

import "@radix-ui/themes/utilities.css";

Please note that the colors you didn’t import will still be accepted by the color prop in React. Also, make sure that your developer tooling 
preserves
 the order of the imported CSS files.
Quick nav
Accents
Grays
Color overrides
High contrast
Focus and selection
Alpha colors
Backgrounds
Panel background
Customization
Brand color
Custom palette
Color aliasing
Individual CSS files
Previous
Overview
Next
Dark mode
Edit this page on GitHub.
Color – Radix Themes
Dark mode
Using appearance to manage and integrate dark mode.
Overview
Light and dark modes are supported out of the box, allowing you to easily switch appearance without additional design or styling.

King Krule – The OOZ
A dark and introspective album that showcases a distinctive blend of genres.

King Krule – The OOZ
A dark and introspective album that showcases a distinctive blend of genres.
Basic usage
By default, the root Theme appearance is light. To set a different appearance pass it via the appearance prop. This will force the theme to use the specified setting.
<Theme appearance="dark">

	<MyApp />

</Theme>

Inheriting system appearance
A common requirement is to inherit the appearance setting from a user’s system preferences.
This is a deceptively complex problem to solve given SSR, SSG and client side hydration considerations. To make implementation easier, we recommend integrating with a theme switching library.
With next-themes
Integration with next-themes is simple and straightforward because Radix Themes implements matching class names.
To enable dark mode, use <ThemeProvider> from next-themes with attribute="class".
import { Theme } from "@radix-ui/themes";

import { ThemeProvider } from "next-themes";



export default function () {

	return (

		<ThemeProvider attribute="class">

			<Theme>

				<MyApp />

			</Theme>

		</ThemeProvider>

	);

}

Do not try to set <Theme appearance={resolvedTheme}>. Instead, rely just on class switching that next-themes provides. This way next-themes can prevent the appearance flash during initial render.
With other libraries
Any library that supports class switching is compatible. You’ll just need to ensure that the appended class names match those supported by Radix Themes:
className="light"
className="light-theme"
className="dark"
className="dark-theme"
Quick nav
Overview
Basic usage
Inheriting system appearance
With next-themes
With other libraries
Previous
Color
Next
Typography
Edit this page on GitHub.
Dark mode – Radix Themes
Typography
Guidance for using and tuning typography.
Base components
Use 
Text
 and 
Heading
 components to render titles and body copy. These components share size and weight props and map to the underlying type system to ensure consistent typography throughout your app.
Typographic principles
The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant.
<Heading mb="2" size="4">Typographic principles</Heading>

<Text>The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant.</Text>

Formatting components
Compose formatting components to add 
emphasis
, 
signal importance
, present 
code
 and more.
The most important thing to remember is, stay positive.
<Text>

	The <Em>most</Em> important thing to remember is,{" "}

	<Strong>stay positive</Strong>.

</Text>

Type scale
The typographic system is based on a 9-step size scale. Every step has a corresponding font size, line height and letter spacing value which are all designed to be used in combination.
Aa
1
Aa
2
Aa
3
Aa
4
Aa
5
Aa
6
Aa
7
Aa
8
Aa
9
The quick brown fox jumps over the lazy dog.
<Text size="6">The quick brown fox jumps over the lazy dog.</Text>

Step
Size
Letter spacing
Line height
1
12px
0.0025em
16px
2
14px
0em
20px
3
16px
0em
24px
4
18px
-0.0025em
26px
5
20px
-0.005em
28px
6
24px
-0.00625em
30px
7
28px
-0.0075em
36px
8
35px
-0.01em
40px
9
60px
-0.025em
60px

Font weight
The following weights are supported. Weights can be 
customized
 to map to your own typeface.
Light
<Text size="6">

	<Flex direction="column">

		<Text weight="light">Light</Text>

		<Text weight="regular">Regular</Text>

		<Text weight="medium">Medium</Text>

		<Text weight="bold">Bold</Text>

	</Flex>

</Text>

Weight
Default value
Light
300
Regular
400
Medium
500
Bold
700

Font family
By default, Radix Themes uses a system font stack for portability and legibility. Continue to the next section to learn about customizing your theme with a custom font.
Type
Default value
Text
-apple-system, BlinkMacSystemFont, 'Segoe UI (Custom)', Roboto, 'Helvetica Neue', 'Open Sans (Custom)', system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'
Code
'Menlo', 'Consolas (Custom)', 'Bitstream Vera Sans Mono', monospace, 'Apple Color Emoji', 'Segoe UI Emoji'
Emphasis
'Times New Roman', 'Times', serif
Quote
'Times New Roman', 'Times', serif

Customization
Radix Themes typography can be customized by overriding the corresponding CSS variables of the token system. Refer to the 
source code
 for the full list of the typographic tokens.
Make sure that your CSS is applied after the Radix Themes styles so that it takes precedence.
Custom fonts
You can provide your own fonts, however, how you choose to import and serve them is up to you. It is only required that you specify your named fonts using the correct syntax.
To customize the font family used in your theme, remap the corresponding font-family tokens:
.radix-themes {

	--default-font-family:  /* Your custom default font */ --heading-font-family:

		/* Your custom font for <Heading> components */ --code-font-family:

		/* Your custom font for <Code> components */ --strong-font-family:

		/* Your custom font for <Strong> components */ --em-font-family:

		/* Your custom font for <Em> components */ --quote-font-family:

		/* Your custom font for <Quote> components */;

}

With next/font
To load custom fonts via 
next/font
, use the 
variable
 option to define a CSS variable name. Then, add that CSS variable class to your HTML document.
import { Inter } from "next/font/google";



const inter = Inter({

	subsets: ["latin"],

	display: "swap",

	variable: "--font-inter",

});



export default function RootLayout({ children }) {

	return (

		<html lang="en" className={inter.variable}>

			<body>{children}</body>

		</html>

	);

}

Finally, assign the CSS variable in your custom CSS:
.radix-themes {

	--default-font-family: var(--font-inter);

}

Be aware that you may encounter css import order issues if you are running the app router. See 
common styling issues
 for more information.
Custom font weights
To customize the exact font weights used in your theme, remap the corresponding font-weight tokens to your own values:
.radix-themes {

	--font-weight-light: 200;

	--font-weight-regular: 300;

	--font-weight-medium: 600;

	--font-weight-bold: 800;

}

Advanced settings
There’s a number of advanced typographic features that can be customized. These include a font size multiplier for certain components, font style, letter spacing, and leading trim. For example, you can customize the headings to render with a relatively larger font size than your default font, different leading trim values, and tighter letter spacing:
.radix-themes {

	--heading-font-family: "Untitled Sans", sans-serif;

	--heading-font-size-adjust: 1.05;

	--heading-font-style: normal;

	--heading-leading-trim-start: 0.42em;

	--heading-leading-trim-end: 0.38em;

	--heading-letter-spacing: -0.01em;

}

Quick nav
Base components
Formatting components
Type scale
Font weight
Font family
Customization
Custom fonts
With next/font
Custom font weights
Advanced settings
Previous
Dark mode
Next
Spacing
Edit this page on GitHub.
Typography – Radix Themes
Spacing
Overview of the space scale and scaling options.
Space scale
Spacing values are derived from a 9-step scale, which is used for props such as margin and padding. These props accept numeric strings from "1" to "9", which correspond to the steps in the scale below.
1
2
3
4
5
6
7
8
9
Step
Base value
1
4px
2
8px
3
12px
4
16px
5
24px
6
32px
7
40px
8
48px
9
64px

Space scale tokens
Space scale tokens can be also accessed using CSS variables. You can use these tokens to style your custom components, ensuring they are consistent with the rest of your theme.
/* Space scale */

var(--space-1);

var(--space-2);

var(--space-3);

var(--space-4);

var(--space-5);

var(--space-6);

var(--space-7);

var(--space-8);

var(--space-9);

Scaling
Values which affect layout (spacing, font size, line height) scale relatively to each other based on the scaling value defined in your Theme. This setting allows you to scale the UI density uniformly across your entire application.
<Theme scaling="100%">

	<Card variant="surface">

		<Flex gap="3" align="center">

			<Avatar size="3" src={person.image} fallback={person.name} />

			<Box>

				<Text as="div" size="2" weight="bold">

					{person.name}

				</Text>

				<Text as="div" size="2" color="gray">

					Approved invoice <Link>#3461</Link>

				</Text>

			</Box>

		</Flex>

	</Card>

</Theme>

90%
Danilo Sousa
Approved invoice 
#3461
95%
Danilo Sousa
Approved invoice 
#3461
100%
Danilo Sousa
Approved invoice 
#3461
105%
Danilo Sousa
Approved invoice 
#3461
110%
Danilo Sousa
Approved invoice 
#3461
Scaling factor
The scaling factor token can be accessed using the --scaling CSS variable. If you need to use different scaling factors in your app, you can use this token in your custom styles, ensuring they are consistent with the rest of your theme.
.MyCustomComponent {

	width: calc(200px * var(--scaling));

}

Quick nav
Space scale
Scaling
Previous
Typography
Next
Breakpoints
Edit this page on GitHub.
Spacing – Radix Themes
Breakpoints
Built-in breakpoints allow you to easily build adaptive layouts.
Available sizes
Each breakpoint matches a fixed screen width. Values are min-width based and apply when the screen width is equal or greater.
Size
Width
initial
Phones (portrait)
0px
xs
Phones (landscape)
520px
sm
Tablets (portrait)
768px
md
Tablets (landscape)
1024px
lg
Laptops
1280px
xl
Desktops
1640px

Usage
Most component size and layout props will accept an additional Responsive object shape for modifying the given prop across breakpoints.
Each size maps to a corresponding key, the value of each will be applied when the screen size is greater than or equal to the named breakpoint.
<Heading
	size={{
		initial: "3",
		md: "5",
		xl: "7",
	}}
/>

Quick nav
Available sizes
Usage
Previous
Spacing
Next
Radius
Edit this page on GitHub.
Breakpoints – Radix Themes
Radius
Choosing the right radius setting in your theme.
Theme setting
Theme radius setting manages the radius factor applied to the components:
<Theme radius="medium">

	<TextField.Root size="3" placeholder="Reply…">

		<TextField.Slot side="right" px="1">

			<Button size="2">Send</Button>

		</TextField.Slot>

	</TextField.Root>

</Theme>

none
small
medium
large
full
The resulting border-radius is contextual and differs depending on the component. For example, when set to full, a 
Button
 becomes pill-shaped, while a 
Checkbox
 will never become fully rounded to prevent any confusion between it and a 
Radio
.
<Theme radius="full">

	<Flex align="center" gap="3">

		<Button>Save</Button>

		<Switch defaultChecked />

		<Checkbox defaultChecked />

	</Flex>

</Theme>

Radius overrides
Certain components allow you to override the radius factor using their own radius prop.
<Flex align="center" gap="3">

	<Button radius="none">Save</Button>

	<Button radius="small">Save</Button>

	<Button radius="medium">Save</Button>

	<Button radius="large">Save</Button>

	<Button radius="full">Save</Button>

</Flex>

Components that render panels, like Card, Dialog, and Popover, among others, won’t have the radius prop, but will inherit the radius setting from the theme. The radius prop is also unavailable on most text-based components.
Radius scale
Radius values used in the components are derived from a 6-step scale.
1
2
3
4
5
6
While you can’t use a specific step on a particular component directly—the radius prop is used to set just the radius factor—you can use the radius scale to style your own components.
Radius tokens are accessed using CSS variables. You can use these tokens to style your custom components, ensuring they are consistent with the rest of your theme.
/* Radius values that automatically respond to the radius factor */

var(--radius-1);

var(--radius-2);

var(--radius-3);

var(--radius-4);

var(--radius-5);

var(--radius-6);



/* A multiplier that controls the theme radius */

var(--radius-factor);



/*

* A variable used to calculate a fully rounded radius.

* Usually used within a CSS `max()` function.

*/

var(--radius-full);



/*

* A variable used to calculate radius of a thumb element.

* Usually used within a CSS `max()` function.

*/

var(--radius-thumb);

Quick nav
Theme setting
Radius overrides
Radius scale
Previous
Breakpoints
Next
Shadows
Edit this page on GitHub.
Radius – Radix Themes
Shadows
Understanding the shadow styles used in your theme.
Shadows used in the components are derived from a 6-step scale. Refer to the 
source code
 for the actual values used to achieve these shadows.
1
2
3
4
5
6
Shadow tokens
Shadow tokens can be accessed using CSS variables. You can use these tokens to style your custom components, ensuring they are consistent with the rest of your theme.
/* Inset shadow */

var(--shadow-1);



/* Shadows for variant="classic" panels, like Card */

var(--shadow-2);

var(--shadow-3);



/* Shadows for smaller overlay panels, like Hover Card and Popover */

var(--shadow-4);

var(--shadow-5);



/* Shadows for larger overlay panels, like Dialog */

var(--shadow-6);

Previous
Radius
Next
Cursors
Edit this page on GitHub.
Shadows – Radix Themes
Cursors
Customizing cursors used for interactive elements.
Default cursors
By default, interactive elements that don’t link to another page use the regular arrow cursor. This also matches the browser defaults. However, disabled elements use an explicit disabled cursor.
Link
<Flex align="center" gap="4" wrap="wrap">

	<Flex align="center" gap="3" wrap="wrap">

		<Button>Button</Button>

		<Button asChild>

			<a href="#">Link</a>

		</Button>

		<Button disabled>Disabled</Button>

	</Flex>

	<Button variant="ghost">Ghost button</Button>

	<Link href="#" size="2">

		Link

	</Link>

	<Checkbox defaultChecked />

	<Switch defaultChecked />

	<Switch defaultChecked disabled />

</Flex>

Cursor tokens
Cursor settings can be accessed using CSS variables. You can use these tokens to style your custom components, ensuring they are accessible and consistent with the rest of your theme.
/* Available cursor tokens */

var(--cursor-button);

var(--cursor-checkbox);

var(--cursor-disabled);

var(--cursor-link);

var(--cursor-menu-item);

var(--cursor-radio);

var(--cursor-slider-thumb);

var(--cursor-slider-thumb-active);

var(--cursor-switch);

Customization
It’s common to use a pointer cursor for interactive elements. Radix Themes cursors can be customized by overriding the corresponding CSS variables of the token system.
Here’s an example of how you can customize the cursor tokens to set cursor: pointer for most interactive elements in the theme:
.radix-themes {

	--cursor-button: pointer;

	--cursor-checkbox: pointer;

	--cursor-disabled: default;

	--cursor-link: pointer;

	--cursor-menu-item: pointer;

	--cursor-radio: pointer;

	--cursor-slider-thumb: grab;

	--cursor-slider-thumb-active: grabbing;

	--cursor-switch: pointer;

}

Make sure that your CSS is applied after the Radix Themes styles so that it takes precedence.
Quick nav
Default cursors
Cursor tokens
Customization
Previous
Shadows
Next
Box
Edit this page on GitHub.
Cursors – Radix Themes
Box
Fundamental layout building block.
View source
Report an issue
<Box width="64px" height="64px">

	<DecorativeBox />

</Box>

API Reference
This component is based on the div element and supports 
common margin props
.
Only the display prop values are unique to the Box component.
Prop
Type
Default
as
"div" | "span"
"div"
asChild
boolean
No default value
display
Responsive<enum>
No default value

The following props are shared between 
Box
, 
Flex
, 
Grid
, 
Container
 and 
Section
 components. Read more about layout components in 
Layout
.
Prop
Type
Default
p
Responsive<enum | string>
No default value
px
Responsive<enum | string>
No default value
py
Responsive<enum | string>
No default value
pt
Responsive<enum | string>
No default value
pr
Responsive<enum | string>
No default value
pb
Responsive<enum | string>
No default value
pl
Responsive<enum | string>
No default value
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
No default value
height
Responsive<string>
No default value
minHeight
Responsive<string>
No default value
maxHeight
Responsive<string>
No default value
position
Responsive<enum>
No default value
inset
Responsive<enum | string>
No default value
top
Responsive<enum | string>
No default value
right
Responsive<enum | string>
No default value
bottom
Responsive<enum | string>
No default value
left
Responsive<enum | string>
No default value
overflow
Responsive<enum>
No default value
overflowX
Responsive<enum>
No default value
overflowY
Responsive<enum>
No default value
flexBasis
Responsive<string>
No default value
flexShrink
Responsive<enum | string>
No default value
flexGrow
Responsive<enum | string>
No default value
gridArea
Responsive<string>
No default value
gridColumn
Responsive<string>
No default value
gridColumnStart
Responsive<string>
No default value
gridColumnEnd
Responsive<string>
No default value
gridRow
Responsive<string>
No default value
gridRowStart
Responsive<string>
No default value
gridRowEnd
Responsive<string>
No default value

Quick nav
API Reference
Previous
Cursors
Next
Flex
Edit this page on GitHub.
Box – Radix Themes
Flex
Component for creating flex layouts.
View source
Report an issue
<Flex gap="3">

	<Box width="64px" height="64px">

		<DecorativeBox />

	</Box>

	<Box width="64px" height="64px">

		<DecorativeBox />

	</Box>

	<Box width="64px" height="64px">

		<DecorativeBox />

	</Box>

	<Box width="64px" height="64px">

		<DecorativeBox />

	</Box>

	<Box width="64px" height="64px">

		<DecorativeBox />

	</Box>

</Flex>

API Reference
This component is based on the div element and supports 
common margin props
.
Use these props to create flex layouts.
Prop
Type
Default
as
"div" | "span"
"div"
asChild
boolean
No default value
display
Responsive<"none" | "inline-flex" | "flex">
No default value
direction
Responsive<enum>
No default value
align
Responsive<enum>
No default value
justify
Responsive<"start" | "center" | "end" | "between">
No default value
wrap
Responsive<"nowrap" | "wrap" | "wrap-reverse">
No default value
gap
Responsive<enum | string>
No default value
gapX
Responsive<enum | string>
No default value
gapY
Responsive<enum | string>
No default value

The following props are shared between 
Box
, 
Flex
, 
Grid
, 
Container
 and 
Section
 components. Read more about layout components in 
Layout
.
Prop
Type
Default
p
Responsive<enum | string>
No default value
px
Responsive<enum | string>
No default value
py
Responsive<enum | string>
No default value
pt
Responsive<enum | string>
No default value
pr
Responsive<enum | string>
No default value
pb
Responsive<enum | string>
No default value
pl
Responsive<enum | string>
No default value
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
No default value
height
Responsive<string>
No default value
minHeight
Responsive<string>
No default value
maxHeight
Responsive<string>
No default value
position
Responsive<enum>
No default value
inset
Responsive<enum | string>
No default value
top
Responsive<enum | string>
No default value
right
Responsive<enum | string>
No default value
bottom
Responsive<enum | string>
No default value
left
Responsive<enum | string>
No default value
overflow
Responsive<enum>
No default value
overflowX
Responsive<enum>
No default value
overflowY
Responsive<enum>
No default value
flexBasis
Responsive<string>
No default value
flexShrink
Responsive<enum | string>
No default value
flexGrow
Responsive<enum | string>
No default value
gridArea
Responsive<string>
No default value
gridColumn
Responsive<string>
No default value
gridColumnStart
Responsive<string>
No default value
gridColumnEnd
Responsive<string>
No default value
gridRow
Responsive<string>
No default value
gridRowStart
Responsive<string>
No default value
gridRowEnd
Responsive<string>
No default value

Quick nav
API Reference
Previous
Box
Next
Grid
Edit this page on GitHub.
Flex – Radix Themes
Grid
Component for creating grid layouts.
View source
Report an issue
<Grid columns="3" gap="3" rows="repeat(2, 64px)" width="auto">

	<DecorativeBox />

	<DecorativeBox />

	<DecorativeBox />

	<DecorativeBox />

	<DecorativeBox />

	<DecorativeBox />

</Grid>

API Reference
This component is based on the div element and supports 
common margin props
.
Use these props to create grid layouts.
Prop
Type
Default
as
"div" | "span"
"div"
asChild
boolean
No default value
display
Responsive<"none" | "inline-grid" | "grid">
No default value
areas
Responsive<string>
No default value
columns
Responsive<enum | string>
No default value
rows
Responsive<enum | string>
No default value
flow
Responsive<enum>
No default value
align
Responsive<enum>
No default value
justify
Responsive<"start" | "center" | "end" | "between">
No default value
gap
Responsive<enum | string>
No default value
gapX
Responsive<enum | string>
No default value
gapY
Responsive<enum | string>
No default value

The following props are shared between 
Box
, 
Flex
, 
Grid
, 
Container
 and 
Section
 components. Read more about layout components in 
Layout
.
Prop
Type
Default
p
Responsive<enum | string>
No default value
px
Responsive<enum | string>
No default value
py
Responsive<enum | string>
No default value
pt
Responsive<enum | string>
No default value
pr
Responsive<enum | string>
No default value
pb
Responsive<enum | string>
No default value
pl
Responsive<enum | string>
No default value
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
No default value
height
Responsive<string>
No default value
minHeight
Responsive<string>
No default value
maxHeight
Responsive<string>
No default value
position
Responsive<enum>
No default value
inset
Responsive<enum | string>
No default value
top
Responsive<enum | string>
No default value
right
Responsive<enum | string>
No default value
bottom
Responsive<enum | string>
No default value
left
Responsive<enum | string>
No default value
overflow
Responsive<enum>
No default value
overflowX
Responsive<enum>
No default value
overflowY
Responsive<enum>
No default value
flexBasis
Responsive<string>
No default value
flexShrink
Responsive<enum | string>
No default value
flexGrow
Responsive<enum | string>
No default value
gridArea
Responsive<string>
No default value
gridColumn
Responsive<string>
No default value
gridColumnStart
Responsive<string>
No default value
gridColumnEnd
Responsive<string>
No default value
gridRow
Responsive<string>
No default value
gridRowStart
Responsive<string>
No default value
gridRowEnd
Responsive<string>
No default value

Examples
Responsive
All props marked Responsive, such as columns and rows accept a 
breakpoint object
. For example, the following grid starts with 1 column, and uses 2 columns from the medium breakpoint.
<Grid columns={{ initial: "1", md: "2" }} gap="3" width="auto">

	<Box height="64px">

		<DecorativeBox />

	</Box>

	<Box height="64px">

		<DecorativeBox />

	</Box>

</Grid>

Quick nav
API Reference
Examples
Responsive
Previous
Flex
Next
Container
Edit this page on GitHub.
Grid – Radix Themes
Container
Constrains the maximum width of page content.
View source
Report an issue
<Box style={{ background: "var(--gray-a2)", borderRadius: "var(--radius-3)" }}>

	<Container size="1">

		<DecorativeBox>

			<Box py="9" />

		</DecorativeBox>

	</Container>

</Box>

API Reference
This component is based on the div element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3" | "4">
"4"
display
Responsive<"none" | "initial">
No default value
align
Responsive<"left" | "center" | "right">
No default value

Container sizes use the following max-width values, which may be customized if needed.
Size
CSS variable
Width
size="1"
--container-1
448px
size="2"
--container-2
688px
size="3"
--container-3
880px
size="4"
--container-4
1136px

The following props are shared between 
Box
, 
Flex
, 
Grid
, 
Container
 and 
Section
 components. Read more about layout components in 
Layout
.
Prop
Type
Default
p
Responsive<enum | string>
No default value
px
Responsive<enum | string>
No default value
py
Responsive<enum | string>
No default value
pt
Responsive<enum | string>
No default value
pr
Responsive<enum | string>
No default value
pb
Responsive<enum | string>
No default value
pl
Responsive<enum | string>
No default value
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
No default value
height
Responsive<string>
No default value
minHeight
Responsive<string>
No default value
maxHeight
Responsive<string>
No default value
position
Responsive<enum>
No default value
inset
Responsive<enum | string>
No default value
top
Responsive<enum | string>
No default value
right
Responsive<enum | string>
No default value
bottom
Responsive<enum | string>
No default value
left
Responsive<enum | string>
No default value
overflow
Responsive<enum>
No default value
overflowX
Responsive<enum>
No default value
overflowY
Responsive<enum>
No default value
flexBasis
Responsive<string>
No default value
flexShrink
Responsive<enum | string>
No default value
flexGrow
Responsive<enum | string>
No default value
gridArea
Responsive<string>
No default value
gridColumn
Responsive<string>
No default value
gridColumnStart
Responsive<string>
No default value
gridColumnEnd
Responsive<string>
No default value
gridRow
Responsive<string>
No default value
gridRowStart
Responsive<string>
No default value
gridRowEnd
Responsive<string>
No default value

Quick nav
API Reference
Previous
Grid
Next
Section
Edit this page on GitHub.
Container – Radix Themes
Section
Denotes a section of page content.
View source
Report an issue
<Box
	py="8"
	style={{ backgroundColor: "var(--gray-a2)", borderRadius: "var(--radius-3)" }}
>

	<DecorativeBox asChild>

		<Section size="2" />

	</DecorativeBox>

</Box>

API Reference
This component is based on the section element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3" | "4">
"3"
display
Responsive<"none" | "initial">
No default value

The following props are shared between 
Box
, 
Flex
, 
Grid
, 
Container
 and 
Section
 components. Read more about layout components in 
Layout
.
Prop
Type
Default
p
Responsive<enum | string>
No default value
px
Responsive<enum | string>
No default value
py
Responsive<enum | string>
No default value
pt
Responsive<enum | string>
No default value
pr
Responsive<enum | string>
No default value
pb
Responsive<enum | string>
No default value
pl
Responsive<enum | string>
No default value
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
No default value
height
Responsive<string>
No default value
minHeight
Responsive<string>
No default value
maxHeight
Responsive<string>
No default value
position
Responsive<enum>
No default value
inset
Responsive<enum | string>
No default value
top
Responsive<enum | string>
No default value
right
Responsive<enum | string>
No default value
bottom
Responsive<enum | string>
No default value
left
Responsive<enum | string>
No default value
overflow
Responsive<enum>
No default value
overflowX
Responsive<enum>
No default value
overflowY
Responsive<enum>
No default value
flexBasis
Responsive<string>
No default value
flexShrink
Responsive<enum | string>
No default value
flexGrow
Responsive<enum | string>
No default value
gridArea
Responsive<string>
No default value
gridColumn
Responsive<string>
No default value
gridColumnStart
Responsive<string>
No default value
gridColumnEnd
Responsive<string>
No default value
gridRow
Responsive<string>
No default value
gridRowStart
Responsive<string>
No default value
gridRowEnd
Responsive<string>
No default value

Quick nav
API Reference
Previous
Container
Next
Text
Edit this page on GitHub.
Section – Radix Themes
Text
Foundational text primitive.
View source
Report an issue
View in Playground
The quick brown fox jumps over the lazy dog.
<Text>The quick brown fox jumps over the lazy dog.</Text>

API Reference
This component is based on the span element and supports 
common margin props
.
Prop
Type
Default
as
"span" | "div" | "label" | "p"
"span"
asChild
boolean
No default value
size
Responsive<enum>
No default value
weight
Responsive<"light" | "regular" | "medium" | "bold">
No default value
align
Responsive<"left" | "center" | "right">
No default value
trim
Responsive<"normal" | "start" | "end" | "both">
No default value
truncate
boolean
No default value
wrap
Responsive<"wrap" | "nowrap" | "pretty" | "balance">
No default value
color
enum
No default value
highContrast
boolean
No default value

Examples
As another element
Use the as prop to render text as a p, label, div or span. This prop is purely semantic and does not alter visual appearance.
This is a paragraph element.
This is a label element.
This is a div element.
This is a span element.
<Text as="p">This is a <Strong>paragraph</Strong> element.</Text>

<Text as="label">This is a <Strong>label</Strong> element.</Text>

<Text as="div">This is a <Strong>div</Strong> element.</Text>

<Text as="span">This is a <Strong>span</Strong> element.</Text>

Size
Use the size prop to control text size. This prop also provides correct line height and corrective letter spacing—as text size increases, the relative line height and letter spacing decrease.
The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.
<Flex direction="column" gap="3">

	<Text size="1">The quick brown fox jumps over the lazy dog.</Text>

	<Text size="2">The quick brown fox jumps over the lazy dog.</Text>

	<Text size="3">The quick brown fox jumps over the lazy dog.</Text>

	<Text size="4">The quick brown fox jumps over the lazy dog.</Text>

	<Text size="5">The quick brown fox jumps over the lazy dog.</Text>

	<Text size="6">The quick brown fox jumps over the lazy dog.</Text>

	<Text size="7">The quick brown fox jumps over the lazy dog.</Text>

	<Text size="8">The quick brown fox jumps over the lazy dog.</Text>

	<Text size="9">The quick brown fox jumps over the lazy dog.</Text>

</Flex>

Sizes 2–4 are designed to work well for long-form content.
The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant. The question is: What proportion(s) will give us the best results? The golden ratio is often observed in nature where beauty and utility intersect; perhaps we can use this “divine” proportion to enhance these attributes in our typography.
The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant. The question is: What proportion(s) will give us the best results? The golden ratio is often observed in nature where beauty and utility intersect; perhaps we can use this “divine” proportion to enhance these attributes in our typography.
The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant. The question is: What proportion(s) will give us the best results? The golden ratio is often observed in nature where beauty and utility intersect; perhaps we can use this “divine” proportion to enhance these attributes in our typography.
<Text as="p" mb="5" size="4">

 The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant. The question is: What proportion(s) will give us the best results? The golden ratio is often observed in nature where beauty and utility intersect; perhaps we can use this “divine” proportion to enhance these attributes in our typography.

</Text>



<Text as="p" mb="5" size="3">

 The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant. The question is: What proportion(s) will give us the best results? The golden ratio is often observed in nature where beauty and utility intersect; perhaps we can use this “divine” proportion to enhance these attributes in our typography.

</Text>



<Text as="p" size="2" color="gray">

 The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant. The question is: What proportion(s) will give us the best results? The golden ratio is often observed in nature where beauty and utility intersect; perhaps we can use this “divine” proportion to enhance these attributes in our typography.

</Text>

Sizes 1–3 are designed to work well for UI labels.
Get startedStart your next project in minutes
Get startedStart your next project in minutes
Get startedStart your next project in minutes
Get startedStart your next project in minutes
<Grid align="center" columns="2" gap="5" p="3">

	<Flex direction="column">

		<Text size="3" weight="bold">

			Get started

		</Text>

		<Text color="gray" size="2">

			Start your next project in minutes

		</Text>

	</Flex>



	<Flex direction="column">

		<Text size="2" weight="bold">

			Get started

		</Text>

		<Text color="gray" size="2">

			Start your next project in minutes

		</Text>

	</Flex>



	<Flex direction="column">

		<Text size="2" weight="bold">

			Get started

		</Text>

		<Text color="gray" size="1">

			Start your next project in minutes

		</Text>

	</Flex>



	<Flex direction="column">

		<Text size="1" weight="bold">

			Get started

		</Text>

		<Text color="gray" size="1">

			Start your next project in minutes

		</Text>

	</Flex>

</Grid>

Weight
Use the weight prop to set the text weight.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
<Text weight="regular" as="div">

 The quick brown fox jumps over the lazy dog.

</Text>



<Text weight="medium" as="div">

 The quick brown fox jumps over the lazy dog.

</Text>



<Text weight="bold" as="div">

 The quick brown fox jumps over the lazy dog.

</Text>

Align
Use the align prop to set text alignment.
Left-aligned
Center-aligned
Right-aligned
<Text align="left" as="div">Left-aligned</Text>

<Text align="center" as="div">Center-aligned</Text>

<Text align="right" as="div">Right-aligned</Text>

Trim
Use the trim prop to trim the leading space at the start, end, or both sides of the text box.
The prop works similarly to the upcoming 
half-leading control
 spec, but uses a common 
negative margin workaround
 under the hood for cross-browser support.
Without trimWith trim
<Flex direction="column" gap="3">

	<Text
		trim="normal"
		style={{
			background: "var(--gray-a2)",
			borderTop: "1px dashed var(--gray-a7)",
			borderBottom: "1px dashed var(--gray-a7)",
		}}
	>

		Without trim

	</Text>

	<Text
		trim="both"
		style={{
			background: "var(--gray-a2)",
			borderTop: "1px dashed var(--gray-a7)",
			borderBottom: "1px dashed var(--gray-a7)",
		}}
	>

		With trim

	</Text>

</Flex>

Trimming the leading is useful when dialing in vertical spacing in cards or other “boxy” components. Otherwise, padding looks larger on top and bottom than on the sides.
Without trim
The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant.
With trim
The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant.
<Flex direction="column" gap="3">

	<Box
		style={{
			background: "var(--gray-a2)",
			border: "1px dashed var(--gray-a7)",
		}}
		p="4"
	>

		<Heading mb="1" size="3">

			Without trim

		</Heading>

		<Text>

			The goal of typography is to relate font size, line height, and line width

			in a proportional way that maximizes beauty and makes reading easier and

			more pleasant.

		</Text>

	</Box>



	<Box
		p="4"
		style={{
			background: "var(--gray-a2)",
			border: "1px dashed var(--gray-a7)",
		}}
	>

		<Heading mb="1" size="3" trim="start">

			With trim

		</Heading>

		<Text trim="end">

			The goal of typography is to relate font size, line height, and line width

			in a proportional way that maximizes beauty and makes reading easier and

			more pleasant.

		</Text>

	</Box>

</Flex>

The default trim values are configured for the system font stack that’s used by Radix Themes. If you are using custom fonts, you can 
adjust
 the trim values using the corresponding CSS variables.
.radix-themes {

	--default-leading-trim-start: 0.42em;

	--default-leading-trim-end: 0.36em;

	--heading-leading-trim-start: 0.42em;

	--heading-leading-trim-end: 0.36em;

}

Truncate
Use the truncate prop to truncate text with an ellipsis when it overflows its container.
The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant.
<Flex maxWidth="300px">

	<Text truncate>

		The goal of typography is to relate font size, line height, and line width

		in a proportional way that maximizes beauty and makes reading easier and

		more pleasant.

	</Text>

</Flex>

Wrap
Use the wrap prop to control text wrapping.
The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant.
<Flex maxWidth="270px">

	<Text wrap="nowrap">

		The goal of typography is to relate font size, line height, and line width

		in a proportional way that maximizes beauty and makes reading easier and

		more pleasant.

	</Text>

</Flex>

The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant.
<Flex maxWidth="270px">

	<Text wrap="balance">

		The goal of typography is to relate font size, line height, and line width

		in a proportional way that maximizes beauty and makes reading easier and

		more pleasant.

	</Text>

</Flex>

The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant.
<Flex maxWidth="270px">

	<Text wrap="pretty">

		The goal of typography is to relate font size, line height, and line width

		in a proportional way that maximizes beauty and makes reading easier and

		more pleasant.

	</Text>

</Flex>

text-wrap: pretty is an experimental value that is 
not yet supported in all browsers
. However, it can be treated as a progressive enhancement for browsers that do support it.
Color
Use the color prop to assign a specific 
color
. The text colors are designed to achieve at least Lc 60 APCA contrast over common background colors.
The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.
<Flex direction="column">

	<Text color="indigo">The quick brown fox jumps over the lazy dog.</Text>

	<Text color="cyan">The quick brown fox jumps over the lazy dog.</Text>

	<Text color="orange">The quick brown fox jumps over the lazy dog.</Text>

	<Text color="crimson">The quick brown fox jumps over the lazy dog.</Text>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.
<Flex direction="column">

	<Text color="gray">The quick brown fox jumps over the lazy dog.</Text>

	<Text color="gray" highContrast>

		The quick brown fox jumps over the lazy dog.

	</Text>

</Flex>

With formatting
Compose Text with formatting components to add emphasis and structure to content.
Look, such a helpful 
link
, an italic emphasis, a piece of computer code, and even a hotkey combination  within the text.
<Text as="p">

	Look, such a helpful <Link href="#">link</Link>, an <Em>italic emphasis</Em>,

	a piece of computer <Code>code</Code>, and even a hotkey combination{" "}

	<Kbd>⇧⌘A</Kbd> within the text.

</Text>

With form controls
Composing Text with a form control like 
Checkbox
, 
RadioGroup
, or 
Switch
 automatically centers the control with the first line of text, even when the text is multi-line.
I understand that these documents are confidential and cannot be shared with a third party.
<Box maxWidth="300px">

	<Text as="label" size="3">

		<Flex gap="2">

			<Checkbox defaultChecked /> I understand that these documents are

			confidential and cannot be shared with a third party.

		</Flex>

	</Text>

</Box>

Quick nav
API Reference
Examples
As another element
Size
Weight
Align
Trim
Truncate
Wrap
Color
High-contrast
With formatting
With form controls
Previous
Section
Next
Heading
Edit this page on GitHub.
Text – Radix Themes
Heading
Semantic heading element.
View source
Report an issue
View in Playground
The quick brown fox jumps over the lazy dog
<Heading>The quick brown fox jumps over the lazy dog</Heading>

API Reference
This component is based on the h1 element and supports 
common margin props
.
Prop
Type
Default
as
"h1" | "h2" | "h3" | "h4" | "h5" | "h6"
"h1"
asChild
boolean
No default value
size
Responsive<enum>
"6"
weight
Responsive<"light" | "regular" | "medium" | "bold">
No default value
align
Responsive<"left" | "center" | "right">
No default value
trim
Responsive<"normal" | "start" | "end" | "both">
No default value
truncate
boolean
No default value
wrap
Responsive<"wrap" | "nowrap" | "pretty" | "balance">
No default value
color
enum
No default value
highContrast
boolean
No default value

Examples
As another element
Use the as prop to change the heading level. This prop is purely semantic and does not change the visual appearance.
Level 1
Level 2
Level 3
<Heading as="h1">Level 1</Heading>

<Heading as="h2">Level 2</Heading>

<Heading as="h3">Level 3</Heading>

Size
Use the size prop to control the size of the heading. The prop also provides correct line height and corrective letter spacing—as text size increases, the relative line height and letter spacing decrease.
Heading sizes match 
Text
 sizes. However, the line heights are set a bit tighter as headings tend to be shorter than running text.
The quick brown fox jumps over the lazy dog
The quick brown fox jumps over the lazy dog
The quick brown fox jumps over the lazy dog
The quick brown fox jumps over the lazy dog
The quick brown fox jumps over the lazy dog
The quick brown fox jumps over the lazy dog
The quick brown fox jumps over the lazy dog
The quick brown fox jumps over the lazy dog
The quick brown fox jumps over the lazy dog
<Flex direction="column" gap="3">

	<Heading size="1">The quick brown fox jumps over the lazy dog</Heading>

	<Heading size="2">The quick brown fox jumps over the lazy dog</Heading>

	<Heading size="3">The quick brown fox jumps over the lazy dog</Heading>

	<Heading size="4">The quick brown fox jumps over the lazy dog</Heading>

	<Heading size="5">The quick brown fox jumps over the lazy dog</Heading>

	<Heading size="6">The quick brown fox jumps over the lazy dog</Heading>

	<Heading size="7">The quick brown fox jumps over the lazy dog</Heading>

	<Heading size="8">The quick brown fox jumps over the lazy dog</Heading>

	<Heading size="9">The quick brown fox jumps over the lazy dog</Heading>

</Flex>

Weight
Use the weight prop to set the text weight.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
<Heading weight="regular">

 The quick brown fox jumps over the lazy dog.

</Heading>



<Heading weight="medium">

 The quick brown fox jumps over the lazy dog.

</Heading>



<Heading weight="bold">

 The quick brown fox jumps over the lazy dog.

</Heading>

Align
Use the align prop to set text alignment.
Left-aligned
Center-aligned
Right-aligned
<Heading align="left">Left-aligned</Heading>

<Heading align="center">Center-aligned</Heading>

<Heading align="right">Right-aligned</Heading>

Trim
Use the trim prop to trim the leading space at the start, end, or both sides of the text box.
The prop works similarly to the upcoming 
half-leading control
 spec, but uses a common 
negative margin workaround
 under the hood for cross-browser support.
Without trim
With trim
<Flex direction="column" gap="3">

	<Heading
		trim="normal"
		style={{
			background: "var(--gray-a2)",
			borderTop: "1px dashed var(--gray-a7)",
			borderBottom: "1px dashed var(--gray-a7)",
		}}
	>

		Without trim

	</Heading>

	<Heading
		trim="both"
		style={{
			background: "var(--gray-a2)",
			borderTop: "1px dashed var(--gray-a7)",
			borderBottom: "1px dashed var(--gray-a7)",
		}}
	>

		With trim

	</Heading>

</Flex>

Trimming the leading is useful when dialing in vertical spacing in cards or other “boxy” components. Otherwise, padding looks larger on top and bottom than on the sides.
Without trim
The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant.
With trim
The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant.
<Flex direction="column" gap="3">

	<Box
		style={{
			background: "var(--gray-a2)",
			border: "1px dashed var(--gray-a7)",
		}}
		p="4"
	>

		<Heading mb="1" size="3">

			Without trim

		</Heading>

		<Text>

			The goal of typography is to relate font size, line height, and line width

			in a proportional way that maximizes beauty and makes reading easier and

			more pleasant.

		</Text>

	</Box>



	<Box
		p="4"
		style={{
			background: "var(--gray-a2)",
			border: "1px dashed var(--gray-a7)",
		}}
	>

		<Heading mb="1" size="3" trim="start">

			With trim

		</Heading>

		<Text trim="end">

			The goal of typography is to relate font size, line height, and line width

			in a proportional way that maximizes beauty and makes reading easier and

			more pleasant.

		</Text>

	</Box>

</Flex>

The default trim values are configured for the system font stack that’s used by Radix Themes. If you are using custom fonts, you can 
adjust
 the trim values using the corresponding CSS variables.
.radix-themes {

	--default-leading-trim-start: 0.42em;

	--default-leading-trim-end: 0.36em;

	--heading-leading-trim-start: 0.42em;

	--heading-leading-trim-end: 0.36em;

}

Truncate
Use the truncate prop to truncate text with an ellipsis when it overflows its container.
The quick brown fox jumps over the lazy dog
<Flex maxWidth="300px">

	<Heading truncate>The quick brown fox jumps over the lazy dog</Heading>

</Flex>

Wrap
Use the wrap prop to control text wrapping.
The quick brown fox jumps over the lazy dog
<Flex maxWidth="300px">

	<Heading wrap="nowrap">The quick brown fox jumps over the lazy dog</Heading>

</Flex>

The quick brown fox jumps over the lazy dog
<Flex maxWidth="300px">

	<Heading wrap="balance">The quick brown fox jumps over the lazy dog</Heading>

</Flex>

The quick brown fox jumps over the lazy dog
<Flex maxWidth="300px">

	<Heading wrap="pretty">The quick brown fox jumps over the lazy dog</Heading>

</Flex>

text-wrap: pretty is an experimental value that is 
not yet supported in all browsers
. However, it can be treated as a progressive enhancement for browsers that do support it.
Color
Use the color prop to assign a specific 
color
. The text colors are designed to achieve at least Lc 60 APCA contrast over common background colors.
The quick brown fox jumps over the lazy dog
The quick brown fox jumps over the lazy dog
The quick brown fox jumps over the lazy dog
The quick brown fox jumps over the lazy dog
<Flex direction="column">

	<Heading color="indigo">The quick brown fox jumps over the lazy dog</Heading>

	<Heading color="cyan">The quick brown fox jumps over the lazy dog</Heading>

	<Heading color="orange">The quick brown fox jumps over the lazy dog</Heading>

	<Heading color="crimson">The quick brown fox jumps over the lazy dog</Heading>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
<Flex direction="column">

	<Heading color="gray">The quick brown fox jumps over the lazy dog.</Heading>

	<Heading color="gray" highContrast>

		The quick brown fox jumps over the lazy dog.

	</Heading>

</Flex>

Quick nav
API Reference
Examples
As another element
Size
Weight
Align
Trim
Truncate
Wrap
Color
High-contrast
Previous
Text
Next
Blockquote
Edit this page on GitHub.
Heading – Radix Themes
Blockquote
Block-level quotation from another source.
View source
Report an issue
View in Playground
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
<Blockquote>

	Perfect typography is certainly the most elusive of all arts. Sculpture in

	stone alone comes near it in obstinacy.

</Blockquote>

API Reference
This component is based on the blockquote element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<enum>
No default value
weight
Responsive<"light" | "regular" | "medium" | "bold">
No default value
color
enum
No default value
highContrast
boolean
No default value
truncate
boolean
No default value
wrap
Responsive<"wrap" | "nowrap" | "pretty" | "balance">
No default value

Examples
Size
Use the size prop to control the size.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
<Flex direction="column" gap="5">

	<Box maxWidth="300px">

		<Blockquote size="1">

			Perfect typography is certainly the most elusive of all arts. Sculpture in

			stone alone comes near it in obstinacy.

		</Blockquote>

	</Box>

	<Box maxWidth="350px">

		<Blockquote size="2">

			Perfect typography is certainly the most elusive of all arts. Sculpture in

			stone alone comes near it in obstinacy.

		</Blockquote>

	</Box>

	<Box maxWidth="400px">

		<Blockquote size="3">

			Perfect typography is certainly the most elusive of all arts. Sculpture in

			stone alone comes near it in obstinacy.

		</Blockquote>

	</Box>

	<Box maxWidth="450px">

		<Blockquote size="4">

			Perfect typography is certainly the most elusive of all arts. Sculpture in

			stone alone comes near it in obstinacy.

		</Blockquote>

	</Box>

	<Box maxWidth="500px">

		<Blockquote size="5">

			Perfect typography is certainly the most elusive of all arts. Sculpture in

			stone alone comes near it in obstinacy.

		</Blockquote>

	</Box>

	<Box maxWidth="550px">

		<Blockquote size="6">

			Perfect typography is certainly the most elusive of all arts. Sculpture in

			stone alone comes near it in obstinacy.

		</Blockquote>

	</Box>

	<Box maxWidth="600px">

		<Blockquote size="7">

			Perfect typography is certainly the most elusive of all arts. Sculpture in

			stone alone comes near it in obstinacy.

		</Blockquote>

	</Box>

	<Box maxWidth="650px">

		<Blockquote size="8">

			Perfect typography is certainly the most elusive of all arts. Sculpture in

			stone alone comes near it in obstinacy.

		</Blockquote>

	</Box>

	<Box maxWidth="1000px">

		<Blockquote size="9">

			Perfect typography is certainly the most elusive of all arts. Sculpture in

			stone alone comes near it in obstinacy.

		</Blockquote>

	</Box>

</Flex>

Weight
Use the weight prop to set the text weight.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
<Flex direction="column" gap="3" maxWidth="500px">

	<Blockquote weight="regular">

		Perfect typography is certainly the most elusive of all arts. Sculpture in

		stone alone comes near it in obstinacy.

	</Blockquote>



	<Blockquote weight="medium">

		Perfect typography is certainly the most elusive of all arts. Sculpture in

		stone alone comes near it in obstinacy.

	</Blockquote>



	<Blockquote weight="bold">

		Perfect typography is certainly the most elusive of all arts. Sculpture in

		stone alone comes near it in obstinacy.

	</Blockquote>

</Flex>

Color
Use the color prop to assign a specific 
color
.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
<Flex direction="column" gap="3" maxWidth="500px">

	<Blockquote color="indigo">

		Perfect typography is certainly the most elusive of all arts. Sculpture in

		stone alone comes near it in obstinacy.

	</Blockquote>

	<Blockquote color="cyan">

		Perfect typography is certainly the most elusive of all arts. Sculpture in

		stone alone comes near it in obstinacy.

	</Blockquote>

	<Blockquote color="orange">

		Perfect typography is certainly the most elusive of all arts. Sculpture in

		stone alone comes near it in obstinacy.

	</Blockquote>

	<Blockquote color="crimson">

		Perfect typography is certainly the most elusive of all arts. Sculpture in

		stone alone comes near it in obstinacy.

	</Blockquote>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
<Flex direction="column" gap="3" maxWidth="500px">

	<Blockquote color="gray">

		Perfect typography is certainly the most elusive of all arts. Sculpture in

		stone alone comes near it in obstinacy.

	</Blockquote>

	<Blockquote color="gray" highContrast>

		Perfect typography is certainly the most elusive of all arts. Sculpture in

		stone alone comes near it in obstinacy.

	</Blockquote>

</Flex>

Truncate
Use the truncate prop to truncate text with an ellipsis when it overflows its container.
Perfect typography is certainly the most elusive of all arts. Sculpture in stone alone comes near it in obstinacy.
<Flex maxWidth="500px">

	<Blockquote truncate>

		Perfect typography is certainly the most elusive of all arts. Sculpture in

		stone alone comes near it in obstinacy.

	</Blockquote>

</Flex>

Quick nav
API Reference
Examples
Size
Weight
Color
High-contrast
Truncate
Previous
Heading
Next
Code
Edit this page on GitHub.
Blockquote – Radix Themes
Code
Marks text to signify a short fragment of computer code.
View source
Report an issue
View in Playground
console.log()
<Code>console.log()</Code>

API Reference
This component is based on the code element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<enum>
No default value
variant
"solid" | "soft" | "outline" | "ghost"
"soft"
weight
Responsive<"light" | "regular" | "medium" | "bold">
No default value
color
enum
No default value
highContrast
boolean
No default value
truncate
boolean
No default value
wrap
Responsive<"wrap" | "nowrap" | "pretty" | "balance">
No default value

Examples
Size
Use the size prop to control text size. This prop also provides correct line height and corrective letter spacing—as text size increases, the relative line height and letter spacing decrease.
console.log()console.log()console.log()console.log()console.log()console.log()console.log()console.log()console.log()
<Flex direction="column" gap="3" align="start">

	<Code size="1">console.log()</Code>

	<Code size="2">console.log()</Code>

	<Code size="3">console.log()</Code>

	<Code size="4">console.log()</Code>

	<Code size="5">console.log()</Code>

	<Code size="6">console.log()</Code>

	<Code size="7">console.log()</Code>

	<Code size="8">console.log()</Code>

	<Code size="9">console.log()</Code>

</Flex>

Variant
Use the variant prop to control the visual style.
console.log()console.log()console.log()console.log()
<Flex direction="column" align="start" gap="2">

	<Code variant="solid">console.log()</Code>

	<Code variant="soft">console.log()</Code>

	<Code variant="outline">console.log()</Code>

	<Code variant="ghost">console.log()</Code>

</Flex>

Color
Use the color prop to assign a specific 
color
.
console.log()console.log()console.log()console.log()
<Flex direction="column" align="start" gap="2">

	<Code color="indigo">console.log()</Code>

	<Code color="crimson">console.log()</Code>

	<Code color="cyan">console.log()</Code>

	<Code color="orange">console.log()</Code>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
console.log()console.log()console.log()console.log()
console.log()console.log()console.log()console.log()
<Flex gap="3">

	<Flex direction="column" align="start" gap="2">

		<Code color="gray" variant="solid">

			console.log()

		</Code>

		<Code color="gray" variant="soft">

			console.log()

		</Code>

		<Code color="gray" variant="outline">

			console.log()

		</Code>

		<Code color="gray" variant="ghost">

			console.log()

		</Code>

	</Flex>



	<Flex direction="column" align="start" gap="2">

		<Code color="gray" variant="solid" highContrast>

			console.log()

		</Code>

		<Code color="gray" variant="soft" highContrast>

			console.log()

		</Code>

		<Code color="gray" variant="outline" highContrast>

			console.log()

		</Code>

		<Code color="gray" variant="ghost" highContrast>

			console.log()

		</Code>

	</Flex>

</Flex>

Weight
Use the weight prop to set the text weight.
console.log()console.log()
<Flex direction="column" gap="2" align="start">

	<Code weight="regular">console.log()</Code>

	<Code weight="bold">console.log()</Code>

</Flex>

Truncate
Use the truncate prop to truncate text with an ellipsis when it overflows its container.
linear-gradient(red, orange, yellow, green, blue);
<Flex maxWidth="200px">

	<Code truncate>linear-gradient(red, orange, yellow, green, blue);</Code>

</Flex>

Quick nav
API Reference
Examples
Size
Variant
Color
High-contrast
Weight
Truncate
Previous
Blockquote
Next
Em
Edit this page on GitHub.
Code – Radix Themes
Em
Marks text to stress emphasis.
View source
Report an issue
View in Playground
We had to do something about it.
<Text>

	We <Em>had</Em> to do something about it.

</Text>

API Reference
This component is based on the em element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
truncate
boolean
No default value
wrap
Responsive<"wrap" | "nowrap" | "pretty" | "balance">
No default value

Examples
Truncate
Use the truncate prop to truncate text with an ellipsis when it overflows its container.
The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant.
<Flex maxWidth="300px">

	<Em truncate>

		The goal of typography is to relate font size, line height, and line width

		in a proportional way that maximizes beauty and makes reading easier and

		more pleasant.

	</Em>

</Flex>

Quick nav
API Reference
Examples
Truncate
Previous
Code
Next
Kbd
Edit this page on GitHub.
Em – Radix Themes
Kbd
Represents keyboard input or a hotkey.
View source
Report an issue
View in Playground
<Kbd>Shift + Tab</Kbd>

API Reference
This component is based on the kbd element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<enum>
No default value

Examples
Size
Use the size prop to control text size.
<Flex direction="column" align="start" gap="3">

	<Kbd size="1">Shift + Tab</Kbd>

	<Kbd size="2">Shift + Tab</Kbd>

	<Kbd size="3">Shift + Tab</Kbd>

	<Kbd size="4">Shift + Tab</Kbd>

	<Kbd size="5">Shift + Tab</Kbd>

	<Kbd size="6">Shift + Tab</Kbd>

	<Kbd size="7">Shift + Tab</Kbd>

	<Kbd size="8">Shift + Tab</Kbd>

	<Kbd size="9">Shift + Tab</Kbd>

</Flex>

Quick nav
API Reference
Examples
Size
Previous
Em
Next
Link
Edit this page on GitHub.
Kbd – Radix Themes
Link
Semantic element for navigation between pages.
View source
Report an issue
View in Playground
Sign up
<Link href="#">Sign up</Link>

API Reference
This component is based on the a element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<enum>
No default value
weight
Responsive<"light" | "regular" | "medium" | "bold">
No default value
trim
Responsive<"normal" | "start" | "end" | "both">
No default value
truncate
boolean
No default value
wrap
Responsive<"wrap" | "nowrap" | "pretty" | "balance">
No default value
underline
"auto" | "always" | "hover" | "none"
"auto"
color
enum
No default value
highContrast
boolean
No default value

Examples
Size
Use the size prop to control the size of the link. The prop also provides correct line height and corrective letter spacing—as text size increases, the relative line height and letter spacing decrease.
Sign up
Sign up
Sign up
Sign up
Sign up
Sign up
Sign up
Sign up
Sign up
<Flex direction="column" gap="3">

	<Link href="#" size="1">

		Sign up

	</Link>

	<Link href="#" size="2">

		Sign up

	</Link>

	<Link href="#" size="3">

		Sign up

	</Link>

	<Link href="#" size="4">

		Sign up

	</Link>

	<Link href="#" size="5">

		Sign up

	</Link>

	<Link href="#" size="6">

		Sign up

	</Link>

	<Link href="#" size="7">

		Sign up

	</Link>

	<Link href="#" size="8">

		Sign up

	</Link>

	<Link href="#" size="9">

		Sign up

	</Link>

</Flex>

Weight
Use the weight prop to set the text weight.
Sign up
Sign up
Sign up
<Flex direction="column">

	<Link href="#" weight="regular">

		Sign up

	</Link>

	<Link href="#" weight="medium">

		Sign up

	</Link>

	<Link href="#" weight="bold">

		Sign up

	</Link>

</Flex>

Truncate
Use the truncate prop to truncate text with an ellipsis when it overflows its container.
Sign up to the newsletter
<Flex maxWidth="150px">

	<Link href="#" truncate>

		Sign up to the newsletter

	</Link>

</Flex>

Color
Use the color prop to assign a specific 
color
.
Sign up
Sign up
Sign up
Sign up
<Flex direction="column">

	<Link href="#" color="indigo">

		Sign up

	</Link>

	<Link href="#" color="cyan">

		Sign up

	</Link>

	<Link href="#" color="orange">

		Sign up

	</Link>

	<Link href="#" color="crimson">

		Sign up

	</Link>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
Sign up
Sign up
<Flex direction="column">

	<Link href="#" color="gray">

		Sign up

	</Link>

	<Link href="#" color="gray" highContrast>

		Sign up

	</Link>

</Flex>

Underline
Use the underline prop to manage the visibility of the underline affordance.
Sign up
Sign up
<Flex direction="column">

	<Link href="#" underline="hover">

		Sign up

	</Link>

	<Link href="#" underline="always">

		Sign up

	</Link>

</Flex>

Quick nav
API Reference
Examples
Size
Weight
Truncate
Color
High-contrast
Underline
Previous
Kbd
Next
Quote
Edit this page on GitHub.
Link – Radix Themes
Quote
Short inline quotation.
View source
Report an issue
View in Playground
His famous quote, Styles come and go. Good design is a language, not a style, elegantly summs up Massimo’s philosophy of design.
<Text>

	His famous quote,{" "}

	<Quote>Styles come and go. Good design is a language, not a style</Quote>,

	elegantly summs up Massimo’s philosophy of design.

</Text>

API Reference
This component is based on the q element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
truncate
boolean
No default value
wrap
Responsive<"wrap" | "nowrap" | "pretty" | "balance">
No default value

Examples
Truncate
Use the truncate prop to truncate text with an ellipsis when it overflows its container.
The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant.
<Flex maxWidth="300px">

	<Quote truncate>

		The goal of typography is to relate font size, line height, and line width

		in a proportional way that maximizes beauty and makes reading easier and

		more pleasant.

	</Quote>

</Flex>

Quick nav
API Reference
Examples
Truncate
Previous
Link
Next
Strong
Edit this page on GitHub.
Quote – Radix Themes

Strong
Marks text to signify strong importance.
View source
Report an issue
View in Playground
The most important thing to remember is, stay positive.
<Text>

	The most important thing to remember is, <Strong>stay positive</Strong>.

</Text>

API Reference
This component is based on the strong element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
truncate
boolean
No default value
wrap
Responsive<"wrap" | "nowrap" | "pretty" | "balance">
No default value

Examples
Truncate
Use the truncate prop to truncate text with an ellipsis when it overflows its container.
The goal of typography is to relate font size, line height, and line width in a proportional way that maximizes beauty and makes reading easier and more pleasant.
<Flex maxWidth="300px">

	<Strong truncate>

		The goal of typography is to relate font size, line height, and line width

		in a proportional way that maximizes beauty and makes reading easier and

		more pleasant.

	</Strong>

</Flex>

Quick nav
API Reference
Examples
Truncate
Previous
Quote
Next
Alert Dialog
Edit this page on GitHub.
Strong – Radix Themes
Alert Dialog
Modal confirmation dialog that interrupts the user and expects a response.
View source
Report an issue
View in Playground
<AlertDialog.Root>

	<AlertDialog.Trigger>

		<Button color="red">Revoke access</Button>

	</AlertDialog.Trigger>

	<AlertDialog.Content maxWidth="450px">

		<AlertDialog.Title>Revoke access</AlertDialog.Title>

		<AlertDialog.Description size="2">

			Are you sure? This application will no longer be accessible and any

			existing sessions will be expired.

		</AlertDialog.Description>



		<Flex gap="3" mt="4" justify="end">

			<AlertDialog.Cancel>

				<Button variant="soft" color="gray">

					Cancel

				</Button>

			</AlertDialog.Cancel>

			<AlertDialog.Action>

				<Button variant="solid" color="red">

					Revoke access

				</Button>

			</AlertDialog.Action>

		</Flex>

	</AlertDialog.Content>

</AlertDialog.Root>

API Reference
This component inherits parts and props from the 
Alert Dialog primitive
 and is visually identical to 
Dialog
, though with differing semantics and behavior.
Root
Contains all the parts of the dialog.
Trigger
Wraps the control that will open the dialog.
Content
Contains the content of the dialog. This component is based on the div element.
Prop
Type
Default
asChild
boolean
No default value
align
"start" | "center"
"center"
size
Responsive<"1" | "2" | "3" | "4">
"3"
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
"600px"
height
Responsive<string>
No default value
minHeight
Responsive<string>
No default value
maxHeight
Responsive<string>
No default value

Title
An accessible title that is announced when the dialog is opened. This part is based on the 
Heading
 component with a pre-defined font size and leading trim on top.
Description
An optional accessible description that is announced when the dialog is opened. This part is based on the 
Text
 component with a pre-defined font size.
If you want to remove the description entirely, remove this part and pass aria-describedby={undefined} to Content.
Action
Wraps the control that will close the dialog. This should be distinguished visually from the Cancel control.
Cancel
Wraps the control that will close the dialog. This should be distinguished visually from the Action control.
Examples
Size
Use the size prop to control size of the dialog. It will affect the padding and border-radius of the Content. Use it in conjunction with the width, minWidth and maxWidth props to control the width of the dialog.
<Flex gap="4" align="center">

	<AlertDialog.Root>

		<AlertDialog.Trigger>

			<Button variant="soft">Size 1</Button>

		</AlertDialog.Trigger>

		<AlertDialog.Content size="1" maxWidth="300px">

			<Text as="p" trim="both" size="1">

				The quick brown fox jumps over the lazy dog.

			</Text>

		</AlertDialog.Content>

	</AlertDialog.Root>



	<AlertDialog.Root>

		<AlertDialog.Trigger>

			<Button variant="soft">Size 2</Button>

		</AlertDialog.Trigger>

		<AlertDialog.Content size="2" maxWidth="400px">

			<Text as="p" trim="both" size="2">

				The quick brown fox jumps over the lazy dog.

			</Text>

		</AlertDialog.Content>

	</AlertDialog.Root>



	<AlertDialog.Root>

		<AlertDialog.Trigger>

			<Button variant="soft">Size 3</Button>

		</AlertDialog.Trigger>

		<AlertDialog.Content size="3" maxWidth="500px">

			<Text as="p" trim="both" size="3">

				The quick brown fox jumps over the lazy dog.

			</Text>

		</AlertDialog.Content>

	</AlertDialog.Root>



	<AlertDialog.Root>

		<AlertDialog.Trigger>

			<Button variant="soft">Size 4</Button>

		</AlertDialog.Trigger>

		<AlertDialog.Content size="4">

			<Text as="p" trim="both" size="4">

				The quick brown fox jumps over the lazy dog.

			</Text>

		</AlertDialog.Content>

	</AlertDialog.Root>

</Flex>

With inset content
Use the 
Inset
 component to align content flush with the sides of the dialog.
<AlertDialog.Root>

	<AlertDialog.Trigger>

		<Button color="red">Delete users</Button>

	</AlertDialog.Trigger>

	<AlertDialog.Content maxWidth="500px">

		<AlertDialog.Title>Delete Users</AlertDialog.Title>

		<AlertDialog.Description size="2">

			Are you sure you want to delete these users? This action is permanent and

			cannot be undone.

		</AlertDialog.Description>



		<Inset side="x" my="5">

			<Table.Root>

				<Table.Header>

					<Table.Row>

						<Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>

						<Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>

						<Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>

					</Table.Row>

				</Table.Header>



				<Table.Body>

					<Table.Row>

						<Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>

						<Table.Cell>danilo@example.com</Table.Cell>

						<Table.Cell>Developer</Table.Cell>

					</Table.Row>



					<Table.Row>

						<Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>

						<Table.Cell>zahra@example.com</Table.Cell>

						<Table.Cell>Admin</Table.Cell>

					</Table.Row>

				</Table.Body>

			</Table.Root>

		</Inset>



		<Flex gap="3" justify="end">

			<AlertDialog.Cancel>

				<Button variant="soft" color="gray">

					Cancel

				</Button>

			</AlertDialog.Cancel>

			<AlertDialog.Action>

				<Button color="red">Delete users</Button>

			</AlertDialog.Action>

		</Flex>

	</AlertDialog.Content>

</AlertDialog.Root>

Quick nav
API Reference
Root
Trigger
Content
Title
Description
Action
Cancel
Examples
Size
With inset content
Previous
Strong
Next
Aspect Ratio
Edit this page on GitHub.
Alert Dialog – Radix Themes
Aspect Ratio
Displays content within a desired ratio.
View source
Report an issue
View in Playground

<AspectRatio ratio={16 / 8}>

	<img
		src="https://images.unsplash.com/photo-1479030160180-b1860951d696?&auto=format&fit=crop&w=1200&q=80"
		alt="A house in a forest"
		style={{
			objectFit: "cover",
			width: "100%",
			height: "100%",
			borderRadius: "var(--radius-2)",
		}}
	/>

</AspectRatio>

API Reference
This component inherits props from the 
Aspect Ratio primitive
.
Quick nav
API Reference
Previous
Alert Dialog
Next
Avatar
Edit this page on GitHub.
Aspect Ratio – Radix Themes
Overview
Theme
Layout
Typography
Components
Utilities
Avatar
Profile picture, user initials or fallback icon.
View source
Report an issue
View in Playground
<Flex gap="2">

	<Avatar
		src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
		fallback="A"
	/>

	<Avatar fallback="A" />

</Flex>

API Reference
This component inherits props from the 
Avatar primitive
.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<enum>
"3"
variant
"solid" | "soft"
"soft"
color
enum
No default value
highContrast
boolean
No default value
radius
"none" | "small" | "medium" | "large" | "full"
No default value
fallback*
ReactNode
No default value

Examples
Size
Use the size prop to control the size of the avatar.
<Flex align="center" gap="4">

	<Avatar
		size="1"
		src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
		fallback="A"
	/>

	<Avatar
		size="2"
		src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
		fallback="A"
	/>

	<Avatar
		size="3"
		src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
		fallback="A"
	/>

	<Avatar
		size="4"
		src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
		fallback="A"
	/>

	<Avatar
		size="5"
		src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
		fallback="A"
	/>

	<Avatar
		size="6"
		src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
		fallback="A"
	/>

	<Avatar
		size="7"
		src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
		fallback="A"
	/>

	<Avatar
		size="8"
		src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
		fallback="A"
	/>

</Flex>

Variant
Use the variant prop to control the visual style of the avatar.
<Flex gap="2">

	<Avatar variant="solid" fallback="A" />

	<Avatar variant="soft" fallback="A" />

</Flex>

Color
Use the color prop to assign a specific 
color
.
<Flex gap="2">

	<Avatar variant="solid" color="indigo" fallback="A" />

	<Avatar variant="solid" color="cyan" fallback="A" />

	<Avatar variant="solid" color="orange" fallback="A" />

	<Avatar variant="solid" color="crimson" fallback="A" />

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
<Grid rows="2" gap="2" display="inline-grid" flow="column">

	<Avatar variant="solid" color="indigo" fallback="A" />

	<Avatar variant="solid" color="indigo" fallback="A" highContrast />

	<Avatar variant="solid" color="cyan" fallback="A" />

	<Avatar variant="solid" color="cyan" fallback="A" highContrast />

	<Avatar variant="solid" color="orange" fallback="A" />

	<Avatar variant="solid" color="orange" fallback="A" highContrast />

	<Avatar variant="solid" color="crimson" fallback="A" />

	<Avatar variant="solid" color="crimson" fallback="A" highContrast />

	<Avatar variant="solid" color="gray" fallback="A" />

	<Avatar variant="solid" color="gray" fallback="A" highContrast />

</Grid>

Radius
Use the radius prop to assign a specific radius value.
<Flex gap="2">

	<Avatar radius="none" fallback="A" />

	<Avatar radius="large" fallback="A" />

	<Avatar radius="full" fallback="A" />

</Flex>

Fallback
Use the fallback prop to modify the rendered fallback element.
<Flex gap="2">

	<Avatar fallback="A" />

	<Avatar fallback="AB" />

	<Avatar
		fallback={
			<Box width="24px" height="24px">
				<svg viewBox="0 0 64 64" fill="currentColor">
					<path d="M41.5 14c4.687 0 8.5 4.038 8.5 9s-3.813 9-8.5 9S33 27.962 33 23 36.813 14 41.5 14zM56.289 43.609C57.254 46.21 55.3 49 52.506 49c-2.759 0-11.035 0-11.035 0 .689-5.371-4.525-10.747-8.541-13.03 2.388-1.171 5.149-1.834 8.07-1.834C48.044 34.136 54.187 37.944 56.289 43.609zM37.289 46.609C38.254 49.21 36.3 52 33.506 52c-5.753 0-17.259 0-23.012 0-2.782 0-4.753-2.779-3.783-5.392 2.102-5.665 8.245-9.472 15.289-9.472S35.187 40.944 37.289 46.609zM21.5 17c4.687 0 8.5 4.038 8.5 9s-3.813 9-8.5 9S13 30.962 13 26 16.813 17 21.5 17z" />
				</svg>
			</Box>
		}
	/>

</Flex>

Quick nav
API Reference
Examples
Size
Variant
Color
High-contrast
Radius
Fallback
Previous
Aspect Ratio
Next
Badge
Edit this page on GitHub.
Avatar – Radix Themes
Badge
Stylized badge element.
View source
Report an issue
View in Playground
In progressIn reviewComplete
<Flex gap="2">

	<Badge color="orange">In progress</Badge>

	<Badge color="blue">In review</Badge>

	<Badge color="green">Complete</Badge>

</Flex>

API Reference
This component is based on the span element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3">
"1"
variant
"solid" | "soft" | "surface" | "outline"
"soft"
color
enum
No default value
highContrast
boolean
No default value
radius
"none" | "small" | "medium" | "large" | "full"
No default value

Examples
Size
Use the size prop to control the size.
NewNewNew
<Flex align="center" gap="2">

	<Badge size="1" color="indigo">

		New

	</Badge>

	<Badge size="2" color="indigo">

		New

	</Badge>

	<Badge size="3" color="indigo">

		New

	</Badge>

</Flex>

Variant
Use the variant prop to control the visual style.
NewNewNewNew
<Flex gap="2">

	<Badge variant="solid" color="indigo">

		New

	</Badge>

	<Badge variant="soft" color="indigo">

		New

	</Badge>

	<Badge variant="surface" color="indigo">

		New

	</Badge>

	<Badge variant="outline" color="indigo">

		New

	</Badge>

</Flex>

Color
Use the color prop to assign a specific 
color
.
NewNewNewNew
<Flex gap="2">

	<Badge color="indigo">New</Badge>

	<Badge color="cyan">New</Badge>

	<Badge color="orange">New</Badge>

	<Badge color="crimson">New</Badge>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
NewNewNewNew
NewNewNewNew
<Flex direction="column" gap="2">

	<Flex gap="2">

		<Badge color="gray" variant="solid">

			New

		</Badge>

		<Badge color="gray" variant="soft">

			New

		</Badge>

		<Badge color="gray" variant="surface">

			New

		</Badge>

		<Badge color="gray" variant="outline">

			New

		</Badge>

	</Flex>

	<Flex gap="2">

		<Badge color="gray" variant="solid" highContrast>

			New

		</Badge>

		<Badge color="gray" variant="soft" highContrast>

			New

		</Badge>

		<Badge color="gray" variant="surface" highContrast>

			New

		</Badge>

		<Badge color="gray" variant="outline" highContrast>

			New

		</Badge>

	</Flex>

</Flex>

Radius
Use the radius prop to assign a specific radius value.
NewNewNew
<Flex gap="2">

	<Badge variant="solid" radius="none" color="indigo">

		New

	</Badge>

	<Badge variant="solid" radius="large" color="indigo">

		New

	</Badge>

	<Badge variant="solid" radius="full" color="indigo">

		New

	</Badge>

</Flex>

Quick nav
API Reference
Examples
Size
Variant
Color
High-contrast
Radius
Previous
Avatar
Next
Button
Edit this page on GitHub.
Badge – Radix Themes
Button
Trigger an action or event, such as submitting a form or displaying a dialog.
View source
Report an issue
View in Playground
<Button>

	<BookmarkIcon /> Bookmark

</Button>

API Reference
This component is based on the button element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3" | "4">
"2"
variant
enum
"solid"
color
enum
No default value
highContrast
boolean
No default value
radius
"none" | "small" | "medium" | "large" | "full"
No default value
loading
boolean
false

Examples
Size
Use the size prop to control the size of the button.
<Flex gap="3" align="center">

	<Button size="1" variant="soft">

		Edit profile

	</Button>

	<Button size="2" variant="soft">

		Edit profile

	</Button>

	<Button size="3" variant="soft">

		Edit profile

	</Button>

</Flex>

Variant
Use the variant prop to control the visual style of the button.
<Flex align="center" gap="3">

	<Button variant="classic">Edit profile</Button>

	<Button variant="solid">Edit profile</Button>

	<Button variant="soft">Edit profile</Button>

	<Button variant="surface">Edit profile</Button>

	<Button variant="outline">Edit profile</Button>

</Flex>

Ghost
Use the ghost variant to display a button without chrome. Ghost buttons behave like text in layout, as they use a negative margin to optically align themselves against their siblings while maintaining the padding in active and hover states.
<Button variant="ghost">Edit profile</Button>

Color
Use the color prop to assign a specific 
color
.
<Flex gap="3">

	<Button color="indigo" variant="soft">

		Edit profile

	</Button>

	<Button color="cyan" variant="soft">

		Edit profile

	</Button>

	<Button color="orange" variant="soft">

		Edit profile

	</Button>

	<Button color="crimson" variant="soft">

		Edit profile

	</Button>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
<Flex direction="column" gap="3">

	<Flex gap="3">

		<Button color="gray" variant="classic">

			Edit profile

		</Button>

		<Button color="gray" variant="solid">

			Edit profile

		</Button>

		<Button color="gray" variant="soft">

			Edit profile

		</Button>

		<Button color="gray" variant="surface">

			Edit profile

		</Button>

		<Button color="gray" variant="outline">

			Edit profile

		</Button>

	</Flex>

	<Flex gap="3">

		<Button color="gray" variant="classic" highContrast>

			Edit profile

		</Button>

		<Button color="gray" variant="solid" highContrast>

			Edit profile

		</Button>

		<Button color="gray" variant="soft" highContrast>

			Edit profile

		</Button>

		<Button color="gray" variant="surface" highContrast>

			Edit profile

		</Button>

		<Button color="gray" variant="outline" highContrast>

			Edit profile

		</Button>

	</Flex>

</Flex>

Radius
Use the radius prop to assign a specific radius value.
<Flex gap="3">

	<Button radius="none" variant="soft">

		Edit profile

	</Button>

	<Button radius="large" variant="soft">

		Edit profile

	</Button>

	<Button radius="full" variant="soft">

		Edit profile

	</Button>

</Flex>

With icons
You can nest icons directly inside the button. An appropriate gap is provided automatically.
<Flex gap="3">

	<Button variant="classic">

		<BookmarkIcon /> Bookmark

	</Button>

	<Button variant="solid">

		<BookmarkIcon /> Bookmark

	</Button>

	<Button variant="soft">

		<BookmarkIcon /> Bookmark

	</Button>

	<Button variant="surface">

		<BookmarkIcon /> Bookmark

	</Button>

	<Button variant="outline">

		<BookmarkIcon /> Bookmark

	</Button>

</Flex>

Loading
Use the loading prop to display a loading spinner in place of button content, preserving the original size of the button in its normal state. The button will be disabled while loading.
<Flex gap="3">

	<Button loading variant="classic">

		Bookmark

	</Button>

	<Button loading variant="solid">

		Bookmark

	</Button>

	<Button loading variant="soft">

		Bookmark

	</Button>

	<Button loading variant="surface">

		Bookmark

	</Button>

	<Button loading variant="outline">

		Bookmark

	</Button>

</Flex>

If you have an icon inside the button, you can use the button’s disabled state and wrap the icon in a standalone 
Spinner
 to achieve a more sophisticated design.
<Flex gap="3">

	<Button disabled variant="classic">

		<Spinner loading>

			<BookmarkIcon />

		</Spinner>

		Bookmark

	</Button>

	<Button disabled variant="solid">

		<Spinner loading>

			<BookmarkIcon />

		</Spinner>

		Bookmark

	</Button>

	<Button disabled variant="soft">

		<Spinner loading>

			<BookmarkIcon />

		</Spinner>

		Bookmark

	</Button>

	<Button disabled variant="surface">

		<Spinner loading>

			<BookmarkIcon />

		</Spinner>

		Bookmark

	</Button>

	<Button disabled variant="outline">

		<Spinner loading>

			<BookmarkIcon />

		</Spinner>

		Bookmark

	</Button>

</Flex>

Quick nav
API Reference
Examples
Size
Variant
Color
High-contrast
Radius
With icons
Loading
Previous
Badge
Next
Callout
Edit this page on GitHub.
Button – Radix Themes
Callout
Short message to attract user’s attention.
View source
Report an issue
View in Playground
You will need admin privileges to install and access this application.
<Callout.Root>

	<Callout.Icon>

		<InfoCircledIcon />

	</Callout.Icon>

	<Callout.Text>

		You will need admin privileges to install and access this application.

	</Callout.Text>

</Callout.Root>

API Reference
Root
Groups Icon and Text parts. This component is based on the div element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3">
"2"
variant
"soft" | "surface" | "outline"
"soft"
color
enum
No default value
highContrast
boolean
No default value

Icon
Provides width and height for the icon associated with the callout. This component is based on the div element.
Text
Renders the callout text. This component is based on the p element.
Examples
Size
Use the size prop to control the size.
You will need admin privileges to install and access this application.
You will need admin privileges to install and access this application.
You will need admin privileges to install and access this application.
<Flex direction="column" gap="3" align="start">

	<Callout.Root size="1">

		<Callout.Icon>

			<InfoCircledIcon />

		</Callout.Icon>

		<Callout.Text>

			You will need admin privileges to install and access this application.

		</Callout.Text>

	</Callout.Root>



	<Callout.Root size="2">

		<Callout.Icon>

			<InfoCircledIcon />

		</Callout.Icon>

		<Callout.Text>

			You will need admin privileges to install and access this application.

		</Callout.Text>

	</Callout.Root>



	<Callout.Root size="3">

		<Callout.Icon>

			<InfoCircledIcon />

		</Callout.Icon>

		<Callout.Text>

			You will need admin privileges to install and access this application.

		</Callout.Text>

	</Callout.Root>

</Flex>

Variant
Use the variant prop to control the visual style.
You will need 
admin privileges
 to install and access this application.
You will need 
admin privileges
 to install and access this application.
You will need 
admin privileges
 to install and access this application.
<Flex direction="column" gap="3">

	<Callout.Root variant="soft">

		<Callout.Icon>

			<InfoCircledIcon />

		</Callout.Icon>

		<Callout.Text>

			You will need <Link href="#">admin privileges</Link> to install and access

			this application.

		</Callout.Text>

	</Callout.Root>



	<Callout.Root variant="surface">

		<Callout.Icon>

			<InfoCircledIcon />

		</Callout.Icon>

		<Callout.Text>

			You will need <Link href="#">admin privileges</Link> to install and access

			this application.

		</Callout.Text>

	</Callout.Root>



	<Callout.Root variant="outline">

		<Callout.Icon>

			<InfoCircledIcon />

		</Callout.Icon>

		<Callout.Text>

			You will need <Link href="#">admin privileges</Link> to install and access

			this application.

		</Callout.Text>

	</Callout.Root>

</Flex>

Color
Use the color prop to assign a specific 
color
.
You will need 
admin privileges
 to install and access this application.
You will need 
admin privileges
 to install and access this application.
You will need 
admin privileges
 to install and access this application.
<Flex direction="column" gap="3">

	<Callout.Root color="blue">

		<Callout.Icon>

			<InfoCircledIcon />

		</Callout.Icon>

		<Callout.Text>

			You will need <Link href="#">admin privileges</Link> to install and access

			this application.

		</Callout.Text>

	</Callout.Root>



	<Callout.Root color="green">

		<Callout.Icon>

			<InfoCircledIcon />

		</Callout.Icon>

		<Callout.Text>

			You will need <Link href="#">admin privileges</Link> to install and access

			this application.

		</Callout.Text>

	</Callout.Root>



	<Callout.Root color="red">

		<Callout.Icon>

			<InfoCircledIcon />

		</Callout.Icon>

		<Callout.Text>

			You will need <Link href="#">admin privileges</Link> to install and access

			this application.

		</Callout.Text>

	</Callout.Root>

</Flex>

High-contrast
Use the HighContrast prop to add additional contrast.
An update to Radix Themes is available. See what’s new in version 3.2.0.
An update to Radix Themes is available. See what’s new in version 3.2.0.
<Flex direction="column" gap="3">

	<Callout.Root color="gray" variant="soft">

		<Callout.Icon>

			<InfoCircledIcon />

		</Callout.Icon>

		<Callout.Text>

			An update to Radix Themes is available. See what’s new in version 3.2.0.

		</Callout.Text>

	</Callout.Root>



	<Callout.Root color="gray" variant="soft" highContrast>

		<Callout.Icon>

			<InfoCircledIcon />

		</Callout.Icon>

		<Callout.Text>

			An update to Radix Themes is available. See what’s new in version 3.2.0.

		</Callout.Text>

	</Callout.Root>

</Flex>

As alert
Add a native 
WAI-ARIAalertrole
 to the callout when the user’s immediate attention is required, like when an error message appears. The screen reader will be interrupted, announcing the new content immediately.
Access denied. Please contact the network administrator to view this page.
<Callout.Root color="red" role="alert">

	<Callout.Icon>

		<ExclamationTriangleIcon />

	</Callout.Icon>

	<Callout.Text>

		Access denied. Please contact the network administrator to view this page.

	</Callout.Text>

</Callout.Root>

Quick nav
API Reference
Root
Icon
Text
Examples
Size
Variant
Color
High-contrast
As alert
Previous
Button
Next
Card
Edit this page on GitHub.
Callout – Radix Themes
Card
Container that groups related content and actions.
View source
Report an issue
View in Playground
Teodros Girmay
Engineering
<Box maxWidth="240px">

	<Card>

		<Flex gap="3" align="center">

			<Avatar
				size="3"
				src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
				radius="full"
				fallback="T"
			/>

			<Box>

				<Text as="div" size="2" weight="bold">

					Teodros Girmay

				</Text>

				<Text as="div" size="2" color="gray">

					Engineering

				</Text>

			</Box>

		</Flex>

	</Card>

</Box>

API Reference
This component is based on the div element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3" | "4" | "5">
"1"
variant
"surface" | "classic" | "ghost"
"surface"

Examples
As another element
Use the asChild prop to render the card as a link or a button. This prop adds styles for the interactive states, like hover and focus.
Quick start
Start building your next project in minutes
<Box maxWidth="350px">

	<Card asChild>

		<a href="#">

			<Text as="div" size="2" weight="bold">

				Quick start

			</Text>

			<Text as="div" color="gray" size="2">

				Start building your next project in minutes

			</Text>

		</a>

	</Card>

</Box>

Size
Use the size prop to control the size.
Teodros Girmay
Engineering
Teodros Girmay
Engineering
Teodros Girmay
Engineering
<Flex gap="3" direction="column">

	<Box width="350px">

		<Card size="1">

			<Flex gap="3" align="center">

				<Avatar size="3" radius="full" fallback="T" color="indigo" />

				<Box>

					<Text as="div" size="2" weight="bold">

						Teodros Girmay

					</Text>

					<Text as="div" size="2" color="gray">

						Engineering

					</Text>

				</Box>

			</Flex>

		</Card>

	</Box>



	<Box width="400px">

		<Card size="2">

			<Flex gap="4" align="center">

				<Avatar size="4" radius="full" fallback="T" color="indigo" />

				<Box>

					<Text as="div" weight="bold">

						Teodros Girmay

					</Text>

					<Text as="div" color="gray">

						Engineering

					</Text>

				</Box>

			</Flex>

		</Card>

	</Box>



	<Box width="500px">

		<Card size="3">

			<Flex gap="4" align="center">

				<Avatar size="5" radius="full" fallback="T" color="indigo" />

				<Box>

					<Text as="div" size="4" weight="bold">

						Teodros Girmay

					</Text>

					<Text as="div" size="4" color="gray">

						Engineering

					</Text>

				</Box>

			</Flex>

		</Card>

	</Box>

</Flex>

Variant
Use the variant prop to control the visual style.
Quick start
Start building your next project in minutes
Quick start
Start building your next project in minutes
<Flex direction="column" gap="3" maxWidth="350px">

	<Card variant="surface">

		<Text as="div" size="2" weight="bold">

			Quick start

		</Text>

		<Text as="div" color="gray" size="2">

			Start building your next project in minutes

		</Text>

	</Card>



	<Card variant="classic">

		<Text as="div" size="2" weight="bold">

			Quick start

		</Text>

		<Text as="div" color="gray" size="2">

			Start building your next project in minutes

		</Text>

	</Card>

</Flex>

With inset content
Use the 
Inset
 component to align content flush with the sides of the card.

Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed.
<Box maxWidth="240px">

	<Card size="2">

		<Inset clip="padding-box" side="top" pb="current">

			<img
				src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
				alt="Bold typography"
				style={{
					display: "block",
					objectFit: "cover",
					width: "100%",
					height: 140,
					backgroundColor: "var(--gray-5)",
				}}
			/>

		</Inset>

		<Text as="p" size="3">

			<Strong>Typography</Strong> is the art and technique of arranging type to

			make written language legible, readable and appealing when displayed.

		</Text>

	</Card>

</Box>

Quick nav
API Reference
Examples
As another element
Size
Variant
With inset content
Previous
Callout
Next
Checkbox
Edit this page on GitHub.
Card – Radix Themes

Overview
Theme
Layout
Typography
Components
Utilities
Checkbox
Base input element to toggle an option on and off.
View source
Report an issue
View in Playground
Agree to Terms and Conditions
<Text as="label" size="2">

	<Flex gap="2">

		<Checkbox defaultChecked />

		Agree to Terms and Conditions

	</Flex>

</Text>

API Reference
This component inherits props from the 
Checkbox primitive
 and supports 
common margin props
.
Prop
Type
Default
size
Responsive<"1" | "2" | "3">
"2"
variant
"classic" | "surface" | "soft"
"surface"
color
enum
No default value
highContrast
boolean
No default value

Examples
Size
Use the size prop to control the size of the checkbox.
<Flex align="center" gap="2">

	<Checkbox size="1" defaultChecked />

	<Checkbox size="2" defaultChecked />

	<Checkbox size="3" defaultChecked />

</Flex>

Variant
Use the variant prop to control the visual style of the checkbox.
<Flex align="center" gap="4">

	<Flex gap="2">

		<Checkbox variant="surface" defaultChecked />

		<Checkbox variant="surface" />

	</Flex>



	<Flex gap="2">

		<Checkbox variant="classic" defaultChecked />

		<Checkbox variant="classic" />

	</Flex>



	<Flex gap="2">

		<Checkbox variant="soft" defaultChecked />

		<Checkbox variant="soft" />

	</Flex>

</Flex>

Color
Use the color prop to assign a specific 
color
.
<Flex gap="2">

	<Checkbox color="indigo" defaultChecked />

	<Checkbox color="cyan" defaultChecked />

	<Checkbox color="orange" defaultChecked />

	<Checkbox color="crimson" defaultChecked />

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
<Grid columns="5" display="inline-grid" gap="2">

	<Checkbox color="indigo" defaultChecked />

	<Checkbox color="cyan" defaultChecked />

	<Checkbox color="orange" defaultChecked />

	<Checkbox color="crimson" defaultChecked />

	<Checkbox color="gray" defaultChecked />



	<Checkbox color="indigo" defaultChecked highContrast />

	<Checkbox color="cyan" defaultChecked highContrast />

	<Checkbox color="orange" defaultChecked highContrast />

	<Checkbox color="crimson" defaultChecked highContrast />

	<Checkbox color="gray" defaultChecked highContrast />

</Grid>

Alignment
Composing Checkbox within Text automatically centers it with the first line of text.
Agree to Terms and Conditions
Agree to Terms and Conditions
Agree to Terms and Conditions
<Flex direction="column" gap="3">

	<Text as="label" size="2">

		<Flex as="span" gap="2">

			<Checkbox size="1" defaultChecked /> Agree to Terms and Conditions

		</Flex>

	</Text>



	<Text as="label" size="3">

		<Flex as="span" gap="2">

			<Checkbox size="2" defaultChecked /> Agree to Terms and Conditions

		</Flex>

	</Text>



	<Text as="label" size="4">

		<Flex as="span" gap="2">

			<Checkbox size="3" defaultChecked /> Agree to Terms and Conditions

		</Flex>

	</Text>

</Flex>

It is automatically well-aligned with multi-line text too.
I understand that these documents are confidential and cannot be shared with a third party.
<Box maxWidth="300px">

	<Text as="label" size="3">

		<Flex as="span" gap="2">

			<Checkbox defaultChecked /> I understand that these documents are

			confidential and cannot be shared with a third party.

		</Flex>

	</Text>

</Box>

Disabled
Use the native disabled attribute to create a disabled checkbox.
Not checked
Checked
Not checked
Checked
<Flex direction="column" gap="2">

	<Text as="label" size="2">

		<Flex as="span" gap="2">

			<Checkbox />

			Not checked

		</Flex>

	</Text>



	<Text as="label" size="2">

		<Flex as="span" gap="2">

			<Checkbox defaultChecked />

			Checked

		</Flex>

	</Text>



	<Text as="label" size="2" color="gray">

		<Flex as="span" gap="2">

			<Checkbox disabled />

			Not checked

		</Flex>

	</Text>



	<Text as="label" size="2" color="gray">

		<Flex as="span" gap="2">

			<Checkbox disabled defaultChecked />

			Checked

		</Flex>

	</Text>

</Flex>

Indeterminate
Use the "indeterminate" value to create an indeterminate checkbox.
<Flex gap="2">

	<Checkbox defaultChecked="indeterminate" />

	<Checkbox checked="indeterminate" />

</Flex>

Quick nav
API Reference
Examples
Size
Variant
Color
High-contrast
Alignment
Disabled
Indeterminate
Previous
Card
Next
Checkbox Group
Edit this page on GitHub.
Checkbox – Radix Themes
Checkbox Group
Set of interactive buttons where multiple options can be selected at a time.
View source
Report an issue
View in Playground
Fun
Serious
Smart
<CheckboxGroup.Root defaultValue={["1"]} name="example">

	<CheckboxGroup.Item value="1">Fun</CheckboxGroup.Item>

	<CheckboxGroup.Item value="2">Serious</CheckboxGroup.Item>

	<CheckboxGroup.Item value="3">Smart</CheckboxGroup.Item>

</CheckboxGroup.Root>

API Reference
This component is based on the div element and supports 
common margin props
.
Root
Contains all the parts of a checkbox group.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3">
"2"
variant
"classic" | "surface" | "soft"
"surface"
color
enum
No default value
highContrast
boolean
No default value

Item
An item in the group that can be checked.
Examples
Size
Use the size prop to control the checkbox size.
<Flex align="center" gap="2">

	<CheckboxGroup.Root size="1" defaultValue="1">

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>



	<CheckboxGroup.Root size="2" defaultValue="1">

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>



	<CheckboxGroup.Root size="3" defaultValue="1">

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>

</Flex>

Variant
Use the variant prop to control the visual style of the checkboxes.
<Flex gap="2">

	<Flex direction="column" asChild gap="2">

		<CheckboxGroup.Root variant="surface" defaultValue="1">

			<CheckboxGroup.Item value="1" />

			<CheckboxGroup.Item value="2" />

		</CheckboxGroup.Root>

	</Flex>



	<Flex direction="column" asChild gap="2">

		<CheckboxGroup.Root variant="classic" defaultValue="1">

			<CheckboxGroup.Item value="1" />

			<CheckboxGroup.Item value="2" />

		</CheckboxGroup.Root>

	</Flex>



	<Flex direction="column" asChild gap="2">

		<CheckboxGroup.Root variant="soft" defaultValue="1">

			<CheckboxGroup.Item value="1" />

			<CheckboxGroup.Item value="2" />

		</CheckboxGroup.Root>

	</Flex>

</Flex>

Color
Use the color prop to assign a specific 
color
.
<Flex gap="2">

	<CheckboxGroup.Root color="indigo" defaultValue="1">

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>



	<CheckboxGroup.Root color="cyan" defaultValue="1">

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>



	<CheckboxGroup.Root color="orange" defaultValue="1">

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>



	<CheckboxGroup.Root color="crimson" defaultValue="1">

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
<Grid rows="2" gap="2" display="inline-grid" flow="column">

	<CheckboxGroup.Root color="indigo" defaultValue="1">

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>



	<CheckboxGroup.Root color="indigo" defaultValue="1" highContrast>

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>



	<CheckboxGroup.Root color="cyan" defaultValue="1">

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>



	<CheckboxGroup.Root color="cyan" defaultValue="1" highContrast>

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>



	<CheckboxGroup.Root color="orange" defaultValue="1">

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>



	<CheckboxGroup.Root color="orange" defaultValue="1" highContrast>

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>



	<CheckboxGroup.Root color="crimson" defaultValue="1">

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>



	<CheckboxGroup.Root color="crimson" defaultValue="1" highContrast>

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>



	<CheckboxGroup.Root color="gray" defaultValue="1">

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>



	<CheckboxGroup.Root color="gray" defaultValue="1" highContrast>

		<CheckboxGroup.Item value="1" />

	</CheckboxGroup.Root>

</Grid>

Alignment
Composing CheckboxGroup.Item within Text automatically centers it with the first line of text.
Default
Compact
Default
Compact
Default
Compact
<Flex direction="column" gap="3">

	<CheckboxGroup.Root size="1" defaultValue="1">

		<Text as="label" size="2">

			<Flex gap="2">

				<CheckboxGroup.Item value="1" /> Default

			</Flex>

		</Text>



		<Text as="label" size="2">

			<Flex gap="2">

				<CheckboxGroup.Item value="2" /> Compact

			</Flex>

		</Text>

	</CheckboxGroup.Root>



	<CheckboxGroup.Root size="2" defaultValue="1">

		<Text as="label" size="3">

			<Flex gap="2">

				<CheckboxGroup.Item value="1" /> Default

			</Flex>

		</Text>



		<Text as="label" size="3">

			<Flex gap="2">

				<CheckboxGroup.Item value="2" /> Compact

			</Flex>

		</Text>

	</CheckboxGroup.Root>



	<CheckboxGroup.Root size="3" defaultValue="1">

		<Text as="label" size="4">

			<Flex gap="2">

				<CheckboxGroup.Item value="1" /> Default

			</Flex>

		</Text>



		<Text as="label" size="4">

			<Flex gap="2">

				<CheckboxGroup.Item value="2" /> Compact

			</Flex>

		</Text>

	</CheckboxGroup.Root>

</Flex>

It is automatically well-aligned with multi-line text too.
Disabled
Use the native disabled attribute to create a disabled checkbox.
Off
On
Off
On
<Flex direction="column" gap="2">

	<CheckboxGroup.Root defaultValue="2">

		<CheckboxGroup.Item value="1">Off</CheckboxGroup.Item>

		<CheckboxGroup.Item value="2">On</CheckboxGroup.Item>

	</CheckboxGroup.Root>



	<CheckboxGroup.Root defaultValue="2">

		<CheckboxGroup.Item value="1" disabled>

			Off

		</CheckboxGroup.Item>

		<CheckboxGroup.Item value="2" disabled>

			On

		</CheckboxGroup.Item>

	</CheckboxGroup.Root>

</Flex>

Quick nav
API Reference
Root
Item
Examples
Size
Variant
Color
High-contrast
Alignment
Disabled
Previous
Checkbox
Next
Checkbox Cards
Edit this page on GitHub.
Checkbox Group – Radix Themes
Checkbox Cards
Set of interactive cards where multiple options can be selected at a time.
View source
Report an issue
View in Playground
A1 KeyboardUS Layout
Pro MouseZero-lag wireless
Lightning MatWireless charging
<Box maxWidth="600px">

	<CheckboxCards.Root defaultValue={["1"]} columns={{ initial: "1", sm: "3" }}>

		<CheckboxCards.Item value="1">

			<Flex direction="column" width="100%">

				<Text weight="bold">A1 Keyboard</Text>

				<Text>US Layout</Text>

			</Flex>

		</CheckboxCards.Item>

		<CheckboxCards.Item value="2">

			<Flex direction="column" width="100%">

				<Text weight="bold">Pro Mouse</Text>

				<Text>Zero-lag wireless</Text>

			</Flex>

		</CheckboxCards.Item>

		<CheckboxCards.Item value="3">

			<Flex direction="column" width="100%">

				<Text weight="bold">Lightning Mat</Text>

				<Text>Wireless charging</Text>

			</Flex>

		</CheckboxCards.Item>

	</CheckboxCards.Root>

</Box>

API Reference
This component is based on the div element and supports 
common margin props
.
Root
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3">
"2"
variant
"surface" | "classic"
"surface"
color
enum
No default value
highContrast
boolean
No default value
columns
Responsive<enum | string>
"repeat(auto-fit, minmax(200px, 1fr))"
gap
Responsive<enum | string>
"4"

Item
An item in the group that can be checked.
Examples
Size
Use the size prop to control the size.
Agree to Terms
Agree to Terms
Agree to Terms
<Flex align="center" gap="3">

	<CheckboxCards.Root defaultValue={["1"]} size="1">

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>



	<CheckboxCards.Root defaultValue={["1"]} size="2">

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>



	<CheckboxCards.Root defaultValue={["1"]} size="3">

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>

</Flex>

Variant
Use the variant prop to control the visual style.
Agree to Terms
Agree to Terms
<Flex direction="column" gap="3" maxWidth="200px">

	<CheckboxCards.Root defaultValue={["1"]} variant="surface">

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>



	<CheckboxCards.Root defaultValue={["1"]} variant="classic">

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>

</Flex>

Color
Use the color prop to assign a specific 
color
.
Agree to Terms
Agree to Terms
Agree to Terms
Agree to Terms
<Flex direction="column" gap="3" maxWidth="200px">

	<CheckboxCards.Root defaultValue={["1"]} color="indigo">

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>



	<CheckboxCards.Root defaultValue={["1"]} color="cyan">

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>



	<CheckboxCards.Root defaultValue={["1"]} color="orange">

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>



	<CheckboxCards.Root defaultValue={["1"]} color="crimson">

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
Agree to Terms
Agree to Terms
Agree to Terms
Agree to Terms
Agree to Terms
Agree to Terms
Agree to Terms
Agree to Terms
<Grid columns="2" gap="3" display="inline-grid">

	<CheckboxCards.Root defaultValue={["1"]} color="indigo">

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>



	<CheckboxCards.Root defaultValue={["1"]} color="indigo" highContrast>

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>



	<CheckboxCards.Root defaultValue={["1"]} color="cyan">

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>



	<CheckboxCards.Root defaultValue={["1"]} color="cyan" highContrast>

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>



	<CheckboxCards.Root defaultValue={["1"]} color="orange">

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>



	<CheckboxCards.Root defaultValue={["1"]} color="orange" highContrast>

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>



	<CheckboxCards.Root defaultValue={["1"]} color="crimson">

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>



	<CheckboxCards.Root defaultValue={["1"]} color="crimson" highContrast>

		<CheckboxCards.Item value="1">Agree to Terms</CheckboxCards.Item>

	</CheckboxCards.Root>

</Grid>

Disabled
Off
On
Off
On
<Flex direction="column" gap="4" maxWidth="450px">

	<CheckboxCards.Root columns="2" defaultValue="2">

		<CheckboxCards.Item value="1">Off</CheckboxCards.Item>

		<CheckboxCards.Item value="2">On</CheckboxCards.Item>

	</CheckboxCards.Root>



	<CheckboxCards.Root columns="2" defaultValue="2">

		<CheckboxCards.Item value="1" disabled>

			Off

		</CheckboxCards.Item>

		<CheckboxCards.Item value="2" disabled>

			On

		</CheckboxCards.Item>

	</CheckboxCards.Root>

</Flex>

Quick nav
API Reference
Root
Item
Examples
Size
Variant
Color
High-contrast
Disabled
Previous
Checkbox Group
Next
Context Menu
Edit this page on GitHub.
Checkbox Cards – Radix Themes
Context Menu
Menu representing a set of actions, displayed at the point of right click or long press.
View source
Report an issue
View in Playground
Right-click here
<ContextMenu.Root>

	<ContextMenu.Trigger>

		<RightClickZone style={{ height: 150 }} />

	</ContextMenu.Trigger>

	<ContextMenu.Content>

		<ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>

		<ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>

		<ContextMenu.Separator />

		<ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>



		<ContextMenu.Sub>

			<ContextMenu.SubTrigger>More</ContextMenu.SubTrigger>

			<ContextMenu.SubContent>

				<ContextMenu.Item>Move to project…</ContextMenu.Item>

				<ContextMenu.Item>Move to folder…</ContextMenu.Item>

				<ContextMenu.Separator />

				<ContextMenu.Item>Advanced options…</ContextMenu.Item>

			</ContextMenu.SubContent>

		</ContextMenu.Sub>



		<ContextMenu.Separator />

		<ContextMenu.Item>Share</ContextMenu.Item>

		<ContextMenu.Item>Add to favorites</ContextMenu.Item>

		<ContextMenu.Separator />

		<ContextMenu.Item shortcut="⌘ ⌫" color="red">

			Delete

		</ContextMenu.Item>

	</ContextMenu.Content>

</ContextMenu.Root>

API Reference
This component inherits props from the 
Context Menu primitive
.
Root
Contains all the parts of a context menu.
Trigger
Wraps the element that will open the context menu.
Content
The component that pops out when the context menu is open.
Prop
Type
Default
size
Responsive<"1" | "2">
"2"
variant
"solid" | "soft"
"solid"
color
enum
No default value
highContrast
boolean
No default value

Label
Used to render a label. It won't be focusable using arrow keys.
Item
The component that contains the context menu items.
Prop
Type
Default
asChild
boolean
No default value
color
enum
No default value
shortcut
string
No default value

Group
Used to group multiple Item parts.
RadioGroup
Used to group multiple RadioItem parts.
RadioItem
An item that can be controlled and rendered like a radio.
Prop
Type
Default
color
enum
No default value

CheckboxItem
An item that can be controlled and rendered like a checkbox.
Prop
Type
Default
color
enum
No default value
shortcut
string
No default value

Sub
Contains all the parts of a submenu.
SubTrigger
An item that opens a submenu. Must be rendered inside ContextMenu.Sub.
SubContent
The component that pops out when a submenu is open. Must be rendered inside ContextMenu.Sub.
Examples
Size
Use the size prop to control the size.
Size oneRight-click here
Size twoRight-click here
<Grid columns="2" gap="3">

	<ContextMenu.Root>

		<ContextMenu.Trigger>

			<RightClickZone title="Size one" />

		</ContextMenu.Trigger>

		<ContextMenu.Content size="1">

			<ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>

			<ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>

			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>



			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ ⌫" color="red">

				Delete

			</ContextMenu.Item>

		</ContextMenu.Content>

	</ContextMenu.Root>



	<ContextMenu.Root>

		<ContextMenu.Trigger>

			<RightClickZone title="Size two" />

		</ContextMenu.Trigger>

		<ContextMenu.Content size="2">

			<ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>

			<ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>

			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>



			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ ⌫" color="red">

				Delete

			</ContextMenu.Item>

		</ContextMenu.Content>

	</ContextMenu.Root>

</Grid>

Variant
Use the variant prop to customize the visual style of the context menu.
SolidRight-click here
SoftRight-click here
<Grid columns="2" gap="3">

	<ContextMenu.Root>

		<ContextMenu.Trigger>

			<RightClickZone title="Solid" />

		</ContextMenu.Trigger>

		<ContextMenu.Content variant="solid">

			<ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>

			<ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>

			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>



			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ ⌫" color="red">

				Delete

			</ContextMenu.Item>

		</ContextMenu.Content>

	</ContextMenu.Root>



	<ContextMenu.Root>

		<ContextMenu.Trigger>

			<RightClickZone title="Soft" />

		</ContextMenu.Trigger>

		<ContextMenu.Content variant="soft">

			<ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>

			<ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>

			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>



			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ ⌫" color="red">

				Delete

			</ContextMenu.Item>

		</ContextMenu.Content>

	</ContextMenu.Root>

</Grid>

Color
Use the color prop to assign a specific 
color
. You can also pass color to a specific item to override for semantic reasons (i.e. a destructive action).
IndigoRight-click here
CyanRight-click here
OrangeRight-click here
CrimsonRight-click here
<Grid columns="2" gap="3">

	<ContextMenu.Root>

		<ContextMenu.Trigger>

			<RightClickZone title="Indigo" />

		</ContextMenu.Trigger>

		<ContextMenu.Content color="indigo">

			<ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>

			<ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>

			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>



			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ ⌫" color="red">

				Delete

			</ContextMenu.Item>

		</ContextMenu.Content>

	</ContextMenu.Root>



	<ContextMenu.Root>

		<ContextMenu.Trigger>

			<RightClickZone title="Cyan" />

		</ContextMenu.Trigger>

		<ContextMenu.Content color="cyan">

			<ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>

			<ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>

			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>



			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ ⌫" color="red">

				Delete

			</ContextMenu.Item>

		</ContextMenu.Content>

	</ContextMenu.Root>



	<ContextMenu.Root>

		<ContextMenu.Trigger>

			<RightClickZone title="Orange" />

		</ContextMenu.Trigger>

		<ContextMenu.Content color="orange">

			<ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>

			<ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>

			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>



			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ ⌫" color="red">

				Delete

			</ContextMenu.Item>

		</ContextMenu.Content>

	</ContextMenu.Root>



	<ContextMenu.Root>

		<ContextMenu.Trigger>

			<RightClickZone title="Crimson" />

		</ContextMenu.Trigger>

		<ContextMenu.Content color="crimson">

			<ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>

			<ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>

			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>



			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ ⌫" color="red">

				Delete

			</ContextMenu.Item>

		</ContextMenu.Content>

	</ContextMenu.Root>

</Grid>

High-contrast
Use the highContrast prop to increase color contrast with the background.
StandardRight-click here
High-contrastRight-click here
<Grid columns="2" gap="3">

	<ContextMenu.Root>

		<ContextMenu.Trigger>

			<RightClickZone title="Standard" />

		</ContextMenu.Trigger>

		<ContextMenu.Content color="gray">

			<ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>

			<ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>

			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>

		</ContextMenu.Content>

	</ContextMenu.Root>



	<ContextMenu.Root>

		<ContextMenu.Trigger>

			<RightClickZone title="High-contrast" />

		</ContextMenu.Trigger>

		<ContextMenu.Content color="gray" highContrast>

			<ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>

			<ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>

			<ContextMenu.Separator />

			<ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>

		</ContextMenu.Content>

	</ContextMenu.Root>

</Grid>

Quick nav
API Reference
Root
Trigger
Content
Label
Item
Group
RadioGroup
RadioItem
CheckboxItem
Sub
SubTrigger
SubContent
Examples
Size
Variant
Color
High-contrast
Previous
Checkbox Cards
Next
Data List
Edit this page on GitHub.
Context Menu – Radix Themes
Data List
Displays metadata as a list of key-value pairs.
View source
Report an issue
View in Playground
Status
Authorized
ID
u_2J89JSA4GJ
Name
Vlad Moroz
Email
vlad@workos.com
Company
WorkOS
<DataList.Root>

	<DataList.Item align="center">

		<DataList.Label minWidth="88px">Status</DataList.Label>

		<DataList.Value>

			<Badge color="jade" variant="soft" radius="full">

				Authorized

			</Badge>

		</DataList.Value>

	</DataList.Item>

	<DataList.Item>

		<DataList.Label minWidth="88px">ID</DataList.Label>

		<DataList.Value>

			<Flex align="center" gap="2">

				<Code variant="ghost">u_2J89JSA4GJ</Code>

				<IconButton
					size="1"
					aria-label="Copy value"
					color="gray"
					variant="ghost"
				>

					<CopyIcon />

				</IconButton>

			</Flex>

		</DataList.Value>

	</DataList.Item>

	<DataList.Item>

		<DataList.Label minWidth="88px">Name</DataList.Label>

		<DataList.Value>Vlad Moroz</DataList.Value>

	</DataList.Item>

	<DataList.Item>

		<DataList.Label minWidth="88px">Email</DataList.Label>

		<DataList.Value>

			<Link href="mailto:vlad@workos.com">vlad@workos.com</Link>

		</DataList.Value>

	</DataList.Item>

	<DataList.Item>

		<DataList.Label minWidth="88px">Company</DataList.Label>

		<DataList.Value>

			<Link target="_blank" href="https://workos.com">

				WorkOS

			</Link>

		</DataList.Value>

	</DataList.Item>

</DataList.Root>

API Reference
This component is based on the dl element and supports 
common margin props
.
Root
Contains all the parts of the data list.
Prop
Type
Default
orientation
Responsive<"horizontal" | "vertical">
"horizontal"
size
Responsive<"1" | "2" | "3">
"2"
trim
Responsive<"normal" | "start" | "end" | "both">
No default value

Item
Wraps a key-value pair.
Prop
Type
Default
align
Responsive<enum>
No default value

Label
Contains the key of the key-value pair.
Prop
Type
Default
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
No default value
color
enum
No default value
highContrast
boolean
No default value

Value
Contains the value of the key-value pair.
Examples
Orientation
Use the orientation prop to change the way the data list is layed-out.
Name
Vlad Moroz
Email
vlad@workos.com
Company
WorkOS
<DataList.Root orientation={{ initial: "vertical", sm: "horizontal" }}>

	<DataList.Item>

		<DataList.Label minWidth="88px">Name</DataList.Label>

		<DataList.Value>Vlad Moroz</DataList.Value>

	</DataList.Item>

	<DataList.Item>

		<DataList.Label minWidth="88px">Email</DataList.Label>

		<DataList.Value>

			<Link href="mailto:vlad@workos.com">vlad@workos.com</Link>

		</DataList.Value>

	</DataList.Item>

	<DataList.Item>

		<DataList.Label minWidth="88px">Company</DataList.Label>

		<DataList.Value>

			<Link target="_blank" href="https://workos.com">

				WorkOS

			</Link>

		</DataList.Value>

	</DataList.Item>

</DataList.Root>

Size
Use the size prop to change the size of the data list.
Name
Vlad Moroz
Email
vlad@workos.com
Company
WorkOS
Name
Vlad Moroz
Email
vlad@workos.com
Company
WorkOS
Name
Vlad Moroz
Email
vlad@workos.com
Company
WorkOS
<Flex direction="column" gap="6">

	<DataList.Root size="1">

		<DataList.Item>

			<DataList.Label minWidth="88px">Name</DataList.Label>

			<DataList.Value>Vlad Moroz</DataList.Value>

		</DataList.Item>

		<DataList.Item>

			<DataList.Label minWidth="88px">Email</DataList.Label>

			<DataList.Value>

				<Link href="mailto:vlad@workos.com">vlad@workos.com</Link>

			</DataList.Value>

		</DataList.Item>

		<DataList.Item>

			<DataList.Label minWidth="88px">Company</DataList.Label>

			<DataList.Value>

				<Link target="_blank" href="https://workos.com">

					WorkOS

				</Link>

			</DataList.Value>

		</DataList.Item>

	</DataList.Root>



	<DataList.Root size="2">

		<DataList.Item>

			<DataList.Label minWidth="88px">Name</DataList.Label>

			<DataList.Value>Vlad Moroz</DataList.Value>

		</DataList.Item>

		<DataList.Item>

			<DataList.Label minWidth="88px">Email</DataList.Label>

			<DataList.Value>

				<Link href="mailto:vlad@workos.com">vlad@workos.com</Link>

			</DataList.Value>

		</DataList.Item>

		<DataList.Item>

			<DataList.Label minWidth="88px">Company</DataList.Label>

			<DataList.Value>

				<Link target="_blank" href="https://workos.com">

					WorkOS

				</Link>

			</DataList.Value>

		</DataList.Item>

	</DataList.Root>



	<DataList.Root size="3">

		<DataList.Item>

			<DataList.Label minWidth="88px">Name</DataList.Label>

			<DataList.Value>Vlad Moroz</DataList.Value>

		</DataList.Item>

		<DataList.Item>

			<DataList.Label minWidth="88px">Email</DataList.Label>

			<DataList.Value>

				<Link href="mailto:vlad@workos.com">vlad@workos.com</Link>

			</DataList.Value>

		</DataList.Item>

		<DataList.Item>

			<DataList.Label minWidth="88px">Company</DataList.Label>

			<DataList.Value>

				<Link target="_blank" href="https://workos.com">

					WorkOS

				</Link>

			</DataList.Value>

		</DataList.Item>

	</DataList.Root>

</Flex>

Color
Use the color prop on the Label part to assign a specific 
color
.
Name
Indigo
Name
Cyan
Name
Orange
Name
Crimson
<DataList.Root orientation="vertical">

	<DataList.Item>

		<DataList.Label color="indigo">Name</DataList.Label>

		<DataList.Value>Indigo</DataList.Value>

	</DataList.Item>

	<DataList.Item>

		<DataList.Label color="cyan">Name</DataList.Label>

		<DataList.Value>Cyan</DataList.Value>

	</DataList.Item>

	<DataList.Item>

		<DataList.Label color="orange">Name</DataList.Label>

		<DataList.Value>Orange</DataList.Value>

	</DataList.Item>

	<DataList.Item>

		<DataList.Label color="crimson">Name</DataList.Label>

		<DataList.Value>Crimson</DataList.Value>

	</DataList.Item>

</DataList.Root>

High-contrast
Use the highContrast prop increase color contrast with the background.
Name
Indigo
Name
Cyan
Name
Orange
Name
Crimson
Name
Indigo
Name
Cyan
Name
Orange
Name
Crimson
<Flex gap="9">

	<DataList.Root orientation="vertical">

		<DataList.Item>

			<DataList.Label color="indigo">Name</DataList.Label>

			<DataList.Value>Indigo</DataList.Value>

		</DataList.Item>

		<DataList.Item>

			<DataList.Label color="cyan">Name</DataList.Label>

			<DataList.Value>Cyan</DataList.Value>

		</DataList.Item>

		<DataList.Item>

			<DataList.Label color="orange">Name</DataList.Label>

			<DataList.Value>Orange</DataList.Value>

		</DataList.Item>

		<DataList.Item>

			<DataList.Label color="crimson">Name</DataList.Label>

			<DataList.Value>Crimson</DataList.Value>

		</DataList.Item>

	</DataList.Root>



	<DataList.Root orientation="vertical">

		<DataList.Item>

			<DataList.Label color="indigo" highContrast>

				Name

			</DataList.Label>

			<DataList.Value>Indigo</DataList.Value>

		</DataList.Item>

		<DataList.Item>

			<DataList.Label color="cyan" highContrast>

				Name

			</DataList.Label>

			<DataList.Value>Cyan</DataList.Value>

		</DataList.Item>

		<DataList.Item>

			<DataList.Label color="orange" highContrast>

				Name

			</DataList.Label>

			<DataList.Value>Orange</DataList.Value>

		</DataList.Item>

		<DataList.Item>

			<DataList.Label color="crimson" highContrast>

				Name

			</DataList.Label>

			<DataList.Value>Crimson</DataList.Value>

		</DataList.Item>

	</DataList.Root>

</Flex>

Quick nav
API Reference
Root
Item
Label
Value
Examples
Orientation
Size
Color
High-contrast
Previous
Context Menu
Next
Dialog
Edit this page on GitHub.
Data List – Radix Themes
Dialog
Modal dialog window displayed above the page.
View source
Report an issue
View in Playground
<Dialog.Root>

	<Dialog.Trigger>

		<Button>Edit profile</Button>

	</Dialog.Trigger>



	<Dialog.Content maxWidth="450px">

		<Dialog.Title>Edit profile</Dialog.Title>

		<Dialog.Description size="2" mb="4">

			Make changes to your profile.

		</Dialog.Description>



		<Flex direction="column" gap="3">

			<label>

				<Text as="div" size="2" mb="1" weight="bold">

					Name

				</Text>

				<TextField.Root
					defaultValue="Freja Johnsen"
					placeholder="Enter your full name"
				/>

			</label>

			<label>

				<Text as="div" size="2" mb="1" weight="bold">

					Email

				</Text>

				<TextField.Root
					defaultValue="freja@example.com"
					placeholder="Enter your email"
				/>

			</label>

		</Flex>



		<Flex gap="3" mt="4" justify="end">

			<Dialog.Close>

				<Button variant="soft" color="gray">

					Cancel

				</Button>

			</Dialog.Close>

			<Dialog.Close>

				<Button>Save</Button>

			</Dialog.Close>

		</Flex>

	</Dialog.Content>

</Dialog.Root>

API Reference
This component inherits props from the 
Dialog primitive
.
Note that this dialog is designed around the modal pattern, so the modal prop is unavailable.
Root
Contains all the parts of a dialog.
Trigger
Wraps the control that will open the dialog.
Content
Contains the content of the dialog. This component is based on the div element.
Prop
Type
Default
asChild
boolean
No default value
align
"start" | "center"
"center"
size
Responsive<"1" | "2" | "3" | "4">
"3"
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
"600px"
height
Responsive<string>
No default value
minHeight
Responsive<string>
No default value
maxHeight
Responsive<string>
No default value

Title
An accessible title that is announced when the dialog is opened. This part is based on the 
Heading
 component with a pre-defined font size and leading trim on top.
Description
An optional accessible description that is announced when the dialog is opened. This part is based on the 
Text
 component with a pre-defined font size.
If you want to remove the description entirely, remove this part and pass aria-describedby={undefined} to Content.
Close
Wraps the control that will close the dialog.
Examples
Size
Use the size prop to control size of the dialog. It will affect the padding and border-radius of the Content. Use it in conjunction with the width, minWidth and maxWidth props to control the width of the dialog.
<Flex gap="4" align="center">

	<Dialog.Root>

		<Dialog.Trigger>

			<Button variant="soft">Size 1</Button>

		</Dialog.Trigger>

		<Dialog.Content size="1" maxWidth="300px">

			<Text as="p" trim="both" size="1">

				The quick brown fox jumps over the lazy dog.

			</Text>

		</Dialog.Content>

	</Dialog.Root>



	<Dialog.Root>

		<Dialog.Trigger>

			<Button variant="soft">Size 2</Button>

		</Dialog.Trigger>

		<Dialog.Content size="2" maxWidth="400px">

			<Text as="p" trim="both" size="2">

				The quick brown fox jumps over the lazy dog.

			</Text>

		</Dialog.Content>

	</Dialog.Root>



	<Dialog.Root>

		<Dialog.Trigger>

			<Button variant="soft">Size 3</Button>

		</Dialog.Trigger>

		<Dialog.Content size="3" maxWidth="500px">

			<Text as="p" trim="both" size="3">

				The quick brown fox jumps over the lazy dog.

			</Text>

		</Dialog.Content>

	</Dialog.Root>



	<Dialog.Root>

		<Dialog.Trigger>

			<Button variant="soft">Size 4</Button>

		</Dialog.Trigger>

		<Dialog.Content size="4">

			<Text as="p" trim="both" size="4">

				The quick brown fox jumps over the lazy dog.

			</Text>

		</Dialog.Content>

	</Dialog.Root>

</Flex>

With inset content
Use the 
Inset
 component to align content flush with the sides of the dialog.
<Dialog.Root>

	<Dialog.Trigger>

		<Button>View users</Button>

	</Dialog.Trigger>

	<Dialog.Content>

		<Dialog.Title>Users</Dialog.Title>

		<Dialog.Description>

			The following users have access to this project.

		</Dialog.Description>



		<Inset side="x" my="5">

			<Table.Root>

				<Table.Header>

					<Table.Row>

						<Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>

						<Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>

						<Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>

					</Table.Row>

				</Table.Header>



				<Table.Body>

					<Table.Row>

						<Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>

						<Table.Cell>danilo@example.com</Table.Cell>

						<Table.Cell>Developer</Table.Cell>

					</Table.Row>



					<Table.Row>

						<Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>

						<Table.Cell>zahra@example.com</Table.Cell>

						<Table.Cell>Admin</Table.Cell>

					</Table.Row>

				</Table.Body>

			</Table.Root>

		</Inset>



		<Flex gap="3" justify="end">

			<Dialog.Close>

				<Button variant="soft" color="gray">

					Close

				</Button>

			</Dialog.Close>

		</Flex>

	</Dialog.Content>

</Dialog.Root>

Quick nav
API Reference
Root
Trigger
Content
Title
Description
Close
Examples
Size
With inset content
Previous
Data List
Next
Dropdown Menu
Edit this page on GitHub.
Dialog – Radix Themes
Dropdown Menu
Menu representing a set of actions, triggered by a button.
View source
Report an issue
View in Playground
<DropdownMenu.Root>

	<DropdownMenu.Trigger>

		<Button variant="soft">

			Options

			<DropdownMenu.TriggerIcon />

		</Button>

	</DropdownMenu.Trigger>

	<DropdownMenu.Content>

		<DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>

		<DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>

		<DropdownMenu.Separator />

		<DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>



		<DropdownMenu.Sub>

			<DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>

			<DropdownMenu.SubContent>

				<DropdownMenu.Item>Move to project…</DropdownMenu.Item>

				<DropdownMenu.Item>Move to folder…</DropdownMenu.Item>



				<DropdownMenu.Separator />

				<DropdownMenu.Item>Advanced options…</DropdownMenu.Item>

			</DropdownMenu.SubContent>

		</DropdownMenu.Sub>



		<DropdownMenu.Separator />

		<DropdownMenu.Item>Share</DropdownMenu.Item>

		<DropdownMenu.Item>Add to favorites</DropdownMenu.Item>

		<DropdownMenu.Separator />

		<DropdownMenu.Item shortcut="⌘ ⌫" color="red">

			Delete

		</DropdownMenu.Item>

	</DropdownMenu.Content>

</DropdownMenu.Root>

API Reference
This component inherits props from the 
Dropdown Menu primitive
.
Root
Contains all the parts of a dropdown menu.
Trigger
Wraps the control that will open the dropdown menu.
Trigger Icon
An optional icon part.
Content
The component that pops out when the dropdown menu is open.
Prop
Type
Default
size
Responsive<"1" | "2">
"2"
variant
"solid" | "soft"
"solid"
color
enum
No default value
highContrast
boolean
No default value

Label
Used to render a label. It won't be focusable using arrow keys.
Item
The component that contains the dropdown menu items.
Prop
Type
Default
asChild
boolean
No default value
color
enum
No default value
shortcut
string
No default value

Group
Used to group multiple Item parts.
RadioGroup
Used to group multiple RadioItem parts.
RadioItem
An item that can be controlled and rendered like a radio.
Prop
Type
Default
color
enum
No default value

CheckboxItem
An item that can be controlled and rendered like a checkbox.
Prop
Type
Default
color
enum
No default value
shortcut
string
No default value

Sub
Contains all the parts of a submenu.
SubTrigger
An item that opens a submenu. Must be rendered inside DropdownMenu.Sub.
SubContent
The component that pops out when a submenu is open. Must be rendered inside DropdownMenu.Sub.
Examples
Size
Use the size prop to control the size.
<Flex gap="3" align="center">

	<DropdownMenu.Root>

		<DropdownMenu.Trigger>

			<Button variant="soft" size="1">

				Options

				<DropdownMenu.TriggerIcon />

			</Button>

		</DropdownMenu.Trigger>

		<DropdownMenu.Content size="1">

			<DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>

			<DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>



			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ ⌫" color="red">

				Delete

			</DropdownMenu.Item>

		</DropdownMenu.Content>

	</DropdownMenu.Root>



	<DropdownMenu.Root>

		<DropdownMenu.Trigger>

			<Button variant="soft" size="2">

				Options

				<DropdownMenu.TriggerIcon />

			</Button>

		</DropdownMenu.Trigger>

		<DropdownMenu.Content size="2">

			<DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>

			<DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>



			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ ⌫" color="red">

				Delete

			</DropdownMenu.Item>

		</DropdownMenu.Content>

	</DropdownMenu.Root>

</Flex>

Variant
Use the variant prop to customize the visual style of the dropdown menu.
<Flex gap="3" align="center">

	<DropdownMenu.Root>

		<DropdownMenu.Trigger>

			<Button variant="solid">

				Options

				<DropdownMenu.TriggerIcon />

			</Button>

		</DropdownMenu.Trigger>

		<DropdownMenu.Content variant="solid">

			<DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>

			<DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>



			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ ⌫" color="red">

				Delete

			</DropdownMenu.Item>

		</DropdownMenu.Content>

	</DropdownMenu.Root>



	<DropdownMenu.Root>

		<DropdownMenu.Trigger>

			<Button variant="soft">

				Options

				<DropdownMenu.TriggerIcon />

			</Button>

		</DropdownMenu.Trigger>

		<DropdownMenu.Content variant="soft">

			<DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>

			<DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>



			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ ⌫" color="red">

				Delete

			</DropdownMenu.Item>

		</DropdownMenu.Content>

	</DropdownMenu.Root>

</Flex>

Color
Use the color prop to assign a specific 
color
. You can also pass color to a specific item to override for semantic reasons (ie. destruction action).
<Flex gap="3">

	<DropdownMenu.Root>

		<DropdownMenu.Trigger>

			<Button variant="soft" color="indigo">

				Options

				<DropdownMenu.TriggerIcon />

			</Button>

		</DropdownMenu.Trigger>

		<DropdownMenu.Content variant="soft" color="indigo">

			<DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>

			<DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

		</DropdownMenu.Content>

	</DropdownMenu.Root>



	<DropdownMenu.Root>

		<DropdownMenu.Trigger>

			<Button variant="soft" color="cyan">

				Options

				<DropdownMenu.TriggerIcon />

			</Button>

		</DropdownMenu.Trigger>

		<DropdownMenu.Content variant="soft" color="cyan">

			<DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>

			<DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

		</DropdownMenu.Content>

	</DropdownMenu.Root>



	<DropdownMenu.Root>

		<DropdownMenu.Trigger>

			<Button variant="soft" color="orange">

				Options

				<DropdownMenu.TriggerIcon />

			</Button>

		</DropdownMenu.Trigger>

		<DropdownMenu.Content variant="soft" color="orange">

			<DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>

			<DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

		</DropdownMenu.Content>

	</DropdownMenu.Root>



	<DropdownMenu.Root>

		<DropdownMenu.Trigger>

			<Button variant="soft" color="crimson">

				Options

				<DropdownMenu.TriggerIcon />

			</Button>

		</DropdownMenu.Trigger>

		<DropdownMenu.Content variant="soft" color="crimson">

			<DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>

			<DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

		</DropdownMenu.Content>

	</DropdownMenu.Root>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
<Grid columns="2" gap="3" display="inline-grid">

	<DropdownMenu.Root>

		<DropdownMenu.Trigger>

			<Button color="gray">

				Options

				<DropdownMenu.TriggerIcon />

			</Button>

		</DropdownMenu.Trigger>

		<DropdownMenu.Content color="gray">

			<DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>

			<DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

		</DropdownMenu.Content>

	</DropdownMenu.Root>



	<DropdownMenu.Root>

		<DropdownMenu.Trigger>

			<Button color="gray" highContrast>

				Options

				<DropdownMenu.TriggerIcon />

			</Button>

		</DropdownMenu.Trigger>

		<DropdownMenu.Content color="gray" highContrast>

			<DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>

			<DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

		</DropdownMenu.Content>

	</DropdownMenu.Root>



	<DropdownMenu.Root>

		<DropdownMenu.Trigger>

			<Button color="gray" variant="soft">

				Options

				<DropdownMenu.TriggerIcon />

			</Button>

		</DropdownMenu.Trigger>

		<DropdownMenu.Content color="gray" variant="soft">

			<DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>

			<DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

		</DropdownMenu.Content>

	</DropdownMenu.Root>



	<DropdownMenu.Root>

		<DropdownMenu.Trigger>

			<Button color="gray" variant="soft" highContrast>

				Options

				<DropdownMenu.TriggerIcon />

			</Button>

		</DropdownMenu.Trigger>

		<DropdownMenu.Content color="gray" variant="soft" highContrast>

			<DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>

			<DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>

			<DropdownMenu.Separator />

			<DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

		</DropdownMenu.Content>

	</DropdownMenu.Root>

</Grid>

Quick nav
API Reference
Root
Trigger
Trigger Icon
Content
Label
Item
Group
RadioGroup
RadioItem
CheckboxItem
Sub
SubTrigger
SubContent
Examples
Size
Variant
Color
High-contrast
Previous
Dialog
Next
Hover Card
Edit this page on GitHub.
Dropdown Menu – Radix Themes
Hover Card
For sighted users to preview content available behind a link.
View source
Report an issue
View in Playground
Follow 
@radix_ui
 for updates.
<Text>

	Follow{" "}

	<HoverCard.Root>

		<HoverCard.Trigger>

			<Link href="https://twitter.com/radix_ui" target="_blank">

				@radix_ui

			</Link>

		</HoverCard.Trigger>

		<HoverCard.Content maxWidth="300px">

			<Flex gap="4">

				<Avatar
					size="3"
					fallback="R"
					radius="full"
					src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
				/>

				<Box>

					<Heading size="3" as="h3">

						Radix

					</Heading>

					<Text as="div" size="2" color="gray" mb="2">

						@radix_ui

					</Text>

					<Text as="div" size="2">

						React components, icons, and colors for building high-quality,

						accessible UI.

					</Text>

				</Box>

			</Flex>

		</HoverCard.Content>

	</HoverCard.Root>{" "}

	for updates.

</Text>

API Reference
This component inherits props from the 
Hover Card primitive
.
Root
Contains all the parts of the hover card.
Trigger
Wraps the link that will open the hover card.
Content
Contains the content of the open hover card. This component is based on the div element.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3">
"2"
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
"480px"
height
Responsive<string>
No default value
minHeight
Responsive<string>
No default value
maxHeight
Responsive<string>
No default value

Examples
Size
Use the size prop to control the size.
Size 1
Size 2
Size 3
<Flex gap="4">

	<HoverCard.Root>

		<HoverCard.Trigger>

			<Link href="#">Size 1</Link>

		</HoverCard.Trigger>

		<HoverCard.Content size="1" maxWidth="240px">

			<Text as="div" size="1" trim="both">

				<Strong>Typography</Strong> is the art and technique of arranging type

				to make written language legible, readable and appealing when displayed.

			</Text>

		</HoverCard.Content>

	</HoverCard.Root>



	<HoverCard.Root>

		<HoverCard.Trigger>

			<Link href="#">Size 2</Link>

		</HoverCard.Trigger>

		<HoverCard.Content size="2" maxWidth="280px">

			<Text as="div" size="2" trim="both">

				<Strong>Typography</Strong> is the art and technique of arranging type

				to make written language legible, readable and appealing when displayed.

			</Text>

		</HoverCard.Content>

	</HoverCard.Root>



	<HoverCard.Root>

		<HoverCard.Trigger>

			<Link href="#">Size 3</Link>

		</HoverCard.Trigger>

		<HoverCard.Content size="3" maxWidth="320px">

			<Text as="div" size="3" trim="both">

				<Strong>Typography</Strong> is the art and technique of arranging type

				to make written language legible, readable and appealing when displayed.

			</Text>

		</HoverCard.Content>

	</HoverCard.Root>

</Flex>

With inset content
Use the 
Inset
 component to align content flush with the sides of the hover card.
Technology revolutionized 
typography
 in the latter twentieth century.
<Text>

	Technology revolutionized{" "}

	<HoverCard.Root>

		<HoverCard.Trigger>

			<Link href="#">typography</Link>

		</HoverCard.Trigger>



		<HoverCard.Content width="450px">

			<Flex>

				<Box asChild flexShrink="0">

					<Inset side="left" pr="current">

						<img
							src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?&auto=format&fit=crop&w=300&q=90"
							alt="Bold typography"
							style={{
								display: "block",
								objectFit: "cover",
								height: "100%",
								width: 150,
								backgroundColor: "var(--gray-5)",
							}}
						/>

					</Inset>

				</Box>



				<Text size="2" as="p">

					<Strong>Typography</Strong> is the art and technique of arranging type

					to make written language legible, readable and appealing when

					displayed. The arrangement of type involves selecting typefaces, point

					sizes, line lengths, line-spacing (leading), and letter-spacing

					(tracking)…

				</Text>

			</Flex>

		</HoverCard.Content>

	</HoverCard.Root>{" "}

	in the latter twentieth century.

</Text>

Quick nav
API Reference
Root
Trigger
Content
Examples
Size
With inset content
Previous
Dropdown Menu
Next
Icon Button
Edit this page on GitHub.
Hover Card – Radix Themes
Icon Button
Button designed specifically for usage with a single icon.
View source
Report an issue
View in Playground
<IconButton>

	<MagnifyingGlassIcon width="18" height="18" />

</IconButton>

API Reference
This component is based on the button element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3" | "4">
"2"
variant
enum
"solid"
color
enum
No default value
highContrast
boolean
No default value
radius
"none" | "small" | "medium" | "large" | "full"
No default value
loading
boolean
false

Examples
Size
Use the size prop to control the size of the button.
<Flex align="center" gap="3">

	<IconButton size="1" variant="soft">

		<MagnifyingGlassIcon width="15" height="15" />

	</IconButton>



	<IconButton size="2" variant="soft">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>



	<IconButton size="3" variant="soft">

		<MagnifyingGlassIcon width="22" height="22" />

	</IconButton>

</Flex>

Variant
Use the variant prop to control the visual style of the button.
<Flex gap="3">

	<IconButton variant="classic">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

	<IconButton variant="solid">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

	<IconButton variant="soft">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

	<IconButton variant="surface">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

	<IconButton variant="outline">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

</Flex>

Ghost
Use the ghost variant to display a button without chrome. Ghost buttons behave like text in layout, as they use a negative margin to optically align themselves against their siblings while maintaining the padding in active and hover states.
<IconButton variant="ghost">

	<MagnifyingGlassIcon width="18" height="18" />

</IconButton>

Color
Use the color prop to assign a specific 
color
.
<Flex gap="3">

	<IconButton color="crimson" variant="soft">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

	<IconButton color="indigo" variant="soft">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

	<IconButton color="grass" variant="soft">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

	<IconButton color="orange" variant="soft">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
<Flex direction="column" gap="3">

	<Flex gap="3">

		<IconButton color="gray" variant="classic">

			<MagnifyingGlassIcon width="18" height="18" />

		</IconButton>

		<IconButton color="gray" variant="solid">

			<MagnifyingGlassIcon width="18" height="18" />

		</IconButton>

		<IconButton color="gray" variant="soft">

			<MagnifyingGlassIcon width="18" height="18" />

		</IconButton>

		<IconButton color="gray" variant="surface">

			<MagnifyingGlassIcon width="18" height="18" />

		</IconButton>

		<IconButton color="gray" variant="outline">

			<MagnifyingGlassIcon width="18" height="18" />

		</IconButton>

	</Flex>

	<Flex gap="3">

		<IconButton color="gray" variant="classic" highContrast>

			<MagnifyingGlassIcon width="18" height="18" />

		</IconButton>

		<IconButton color="gray" variant="solid" highContrast>

			<MagnifyingGlassIcon width="18" height="18" />

		</IconButton>

		<IconButton color="gray" variant="soft" highContrast>

			<MagnifyingGlassIcon width="18" height="18" />

		</IconButton>

		<IconButton color="gray" variant="surface" highContrast>

			<MagnifyingGlassIcon width="18" height="18" />

		</IconButton>

		<IconButton color="gray" variant="outline" highContrast>

			<MagnifyingGlassIcon width="18" height="18" />

		</IconButton>

	</Flex>

</Flex>

Radius
Use the radius prop to assign a specific radius value.
<Flex gap="3">

	<IconButton radius="none" variant="soft">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

	<IconButton radius="large" variant="soft">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

	<IconButton radius="full" variant="soft">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

</Flex>

Loading
Use the loading prop to display a loading spinner in place of button content. The button will be disabled while loading.
<Flex gap="3">

	<IconButton loading variant="classic">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

	<IconButton loading variant="solid">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

	<IconButton loading variant="soft">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

	<IconButton loading variant="surface">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

	<IconButton loading variant="outline">

		<MagnifyingGlassIcon width="18" height="18" />

	</IconButton>

</Flex>

Quick nav
API Reference
Examples
Size
Variant
Color
High-contrast
Radius
Loading
Previous
Hover Card
Next
Inset
Edit this page on GitHub.
Icon Button – Radix Themes
Inset
Applies a negative margin to allow content to bleed into the surrounding container.
View source
Report an issue
View in Playground

Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed.
<Box maxWidth="240px">

	<Card size="2">

		<Inset clip="padding-box" side="top" pb="current">

			<img
				src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
				alt="Bold typography"
				style={{
					display: "block",
					objectFit: "cover",
					width: "100%",
					height: 140,
					backgroundColor: "var(--gray-5)",
				}}
			/>

		</Inset>

		<Text as="p" size="3">

			<Strong>Typography</Strong> is the art and technique of arranging type to

			make written language legible, readable and appealing when displayed.

		</Text>

	</Card>

</Box>

API Reference
This component is based on the div element and supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
side
Responsive<enum>
"all"
clip
Responsive<"border-box" | "padding-box">
"border-box"
p
Responsive<"current" | "0">
No default value
px
Responsive<"current" | "0">
No default value
py
Responsive<"current" | "0">
No default value
pt
Responsive<"current" | "0">
No default value
pr
Responsive<"current" | "0">
No default value
pb
Responsive<"current" | "0">
No default value
pl
Responsive<"current" | "0">
No default value

Quick nav
API Reference
Previous
Icon Button
Next
Popover
Edit this page on GitHub.
Inset – Radix Themes
Popover
Floating element for displaying rich content, triggered by a button.
View source
Report an issue
View in Playground
<Popover.Root>

	<Popover.Trigger>

		<Button variant="soft">

			<ChatBubbleIcon width="16" height="16" />

			Comment

		</Button>

	</Popover.Trigger>

	<Popover.Content width="360px">

		<Flex gap="3">

			<Avatar
				size="2"
				src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
				fallback="A"
				radius="full"
			/>

			<Box flexGrow="1">

				<TextArea placeholder="Write a comment…" style={{ height: 80 }} />

				<Flex gap="3" mt="3" justify="between">

					<Flex align="center" gap="2" asChild>

						<Text as="label" size="2">

							<Checkbox />

							<Text>Send to group</Text>

						</Text>

					</Flex>



					<Popover.Close>

						<Button size="1">Comment</Button>

					</Popover.Close>

				</Flex>

			</Box>

		</Flex>

	</Popover.Content>

</Popover.Root>

API Reference
This component inherits props from the 
Popover primitive
.
Root
Contains all the parts of a popover.
Trigger
Wraps the control that will open the popover.
Content
Contains content to be rendered in the open popover. This component is based on the div element.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3" | "4">
"2"
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
"480px"
height
Responsive<string>
No default value
minHeight
Responsive<string>
No default value
maxHeight
Responsive<string>
No default value

Close
Wraps the control that will close the popover.
Examples
Size
Use the size prop to control size of the popover. It will affect the padding and border-radius of the Content. Use it in conjunction with the width/minWidth/maxWidth and height/minHeight/maxHeight props to control the size of the popover.
<Flex gap="4" align="center">

	<Popover.Root>

		<Popover.Trigger>

			<Button variant="soft">Size 1</Button>

		</Popover.Trigger>

		<Popover.Content size="1" maxWidth="300px">

			<Text as="p" trim="both" size="1">

				The quick brown fox jumps over the lazy dog.

			</Text>

		</Popover.Content>

	</Popover.Root>



	<Popover.Root>

		<Popover.Trigger>

			<Button variant="soft">Size 2</Button>

		</Popover.Trigger>

		<Popover.Content size="2" maxWidth="400px">

			<Text as="p" trim="both" size="2">

				The quick brown fox jumps over the lazy dog.

			</Text>

		</Popover.Content>

	</Popover.Root>



	<Popover.Root>

		<Popover.Trigger>

			<Button variant="soft">Size 3</Button>

		</Popover.Trigger>

		<Popover.Content size="3" maxWidth="500px">

			<Text as="p" trim="both" size="3">

				The quick brown fox jumps over the lazy dog.

			</Text>

		</Popover.Content>

	</Popover.Root>



	<Popover.Root>

		<Popover.Trigger>

			<Button variant="soft">Size 4</Button>

		</Popover.Trigger>

		<Popover.Content size="4">

			<Text as="p" trim="both" size="4">

				The quick brown fox jumps over the lazy dog.

			</Text>

		</Popover.Content>

	</Popover.Root>

</Flex>

With inset content
Use the 
Inset
 component to align content flush with the sides of the popover.
<Popover.Root>

	<Popover.Trigger>

		<Button variant="soft">

			<Share2Icon width="16" height="16" />

			Share image

		</Button>

	</Popover.Trigger>

	<Popover.Content width="360px">

		<Grid columns="130px 1fr">

			<Inset side="left" pr="current">

				<img
					src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?&auto=format&fit=crop&w=400&q=80"
					style={{ objectFit: "cover", width: "100%", height: "100%" }}
				/>

			</Inset>



			<div>

				<Heading size="2" mb="1">

					Share this image

				</Heading>

				<Text as="p" size="2" mb="4" color="gray">

					Minimalistic 3D rendering wallpaper.

				</Text>



				<Flex direction="column" align="stretch">

					<Popover.Close>

						<Button size="1" variant="soft">

							<Link1Icon width="16" height="16" />

							Copy link

						</Button>

					</Popover.Close>

				</Flex>

			</div>

		</Grid>

	</Popover.Content>

</Popover.Root>

Quick nav
API Reference
Root
Trigger
Content
Close
Examples
Size
With inset content
Previous
Inset
Next
Progress
Edit this page on GitHub.
Popover – Radix Themes
Progress
Displays a progress bar related to a task.
View source
Report an issue
View in Playground
<Box maxWidth="300px">

	<Progress />

</Box>

API Reference
This component inherits props from the 
Progress primitive
 and supports 
common margin props
.
Prop
Type
Default
size
Responsive<"1" | "2" | "3">
"2"
variant
"classic" | "surface" | "soft"
"surface"
color
enum
No default value
highContrast
boolean
No default value
radius
"none" | "small" | "medium" | "large" | "full"
No default value
duration
string
No default value

Examples
Size
Use the size prop to control the size.
<Flex direction="column" gap="4" maxWidth="300px">

	<Progress value={25} size="1" />

	<Progress value={50} size="2" />

	<Progress value={75} size="3" />

</Flex>

Variant
Use the variant prop to control the visual style.
<Flex direction="column" gap="4" maxWidth="300px">

	<Progress value={25} variant="classic" />

	<Progress value={50} variant="surface" />

	<Progress value={75} variant="soft" />

</Flex>

Color
Use the color prop to assign a specific 
color
.
<Flex direction="column" gap="4" maxWidth="300px">

	<Progress value={20} color="indigo" />

	<Progress value={40} color="cyan" />

	<Progress value={60} color="orange" />

	<Progress value={80} color="crimson" />

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
<Grid columns="2" gap="4">

	<Progress value={10} color="indigo" />

	<Progress value={10} color="indigo" highContrast />

	<Progress value={30} color="cyan" />

	<Progress value={30} color="cyan" highContrast />

	<Progress value={50} color="orange" />

	<Progress value={50} color="orange" highContrast />

	<Progress value={70} color="crimson" />

	<Progress value={70} color="crimson" highContrast />

	<Progress value={90} color="gray" />

	<Progress value={90} color="gray" highContrast />

</Grid>

Radius
Use the radius prop to assign a specific radius value.
<Flex direction="column" gap="4" maxWidth="300px">

	<Progress value={25} radius="none" />

	<Progress value={50} radius="small" />

	<Progress value={75} radius="full" />

</Flex>

With controlled value
Use the value prop to provide a precise indication of the task progress.
<Progress value={75} />

With custom duration
Use the duration prop to indicate an approximate duration of an indeterminate task. Once the duration times out, the progress bar will start an indeterminate animation.
<Progress duration="30s" />

When an approximate duration can be estimated, the Progress component is still useful over 
Spinner
, which doesn’t provide any visual cues towards the progress of the task.
Quick nav
API Reference
Examples
Size
Variant
Color
High-contrast
Radius
With controlled value
With custom duration
Previous
Popover
Next
Radio
Edit this page on GitHub.
Progress – Radix Themes
Radio
Standalone radio button that can be used in any layout.
View source
Report an issue
View in Playground
Default
Comfortable
Compact
<Flex align="start" direction="column" gap="1">

	<Flex asChild gap="2">

		<Text as="label" size="2">

			<Radio name="example" value="1" defaultChecked />

			Default

		</Text>

	</Flex>



	<Flex asChild gap="2">

		<Text as="label" size="2">

			<Radio name="example" value="2" />

			Comfortable

		</Text>

	</Flex>



	<Flex asChild gap="2">

		<Text as="label" size="2">

			<Radio name="example" value="3" />

			Compact

		</Text>

	</Flex>

</Flex>

API Reference
This component inherits props from the 
Radio Group primitive
 and supports 
common margin props
.
Root
Contains all the parts of a radio group.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3">
"2"
variant
"classic" | "surface" | "soft"
"surface"
color
enum
No default value
highContrast
boolean
No default value

Item
An item in the group that can be checked.
Examples
Size
Use the size prop to control the radio button size.
<Flex align="center" gap="4">

	<Flex gap="2">

		<Radio size="1" name="size-1" value="1" defaultChecked />

		<Radio size="1" name="size-1" value="2" />

	</Flex>



	<Flex gap="2">

		<Radio size="2" name="size-2" value="1" defaultChecked />

		<Radio size="2" name="size-2" value="2" />

	</Flex>



	<Flex gap="2">

		<Radio size="3" name="size-3" value="1" defaultChecked />

		<Radio size="3" name="size-3" value="2" />

	</Flex>

</Flex>

Variant
Use the variant prop to control the visual style of the radio buttons.
<Flex align="center" gap="4">

	<Flex gap="2">

		<Radio variant="surface" name="surface" value="1" defaultChecked />

		<Radio variant="surface" name="surface" value="2" />

	</Flex>



	<Flex gap="2">

		<Radio variant="classic" name="classic" value="1" defaultChecked />

		<Radio variant="classic" name="classic" value="2" />

	</Flex>



	<Flex gap="2">

		<Radio variant="soft" name="soft" value="1" defaultChecked />

		<Radio variant="soft" name="soft" value="2" />

	</Flex>

</Flex>

Color
Use the color prop to assign a specific 
color
.
<Flex as="span" gap="2">

	<Radio color="indigo" defaultChecked />

	<Radio color="cyan" defaultChecked />

	<Radio color="orange" defaultChecked />

	<Radio color="crimson" defaultChecked />

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
<Grid columns="5" display="inline-grid" gap="2">

	<Radio color="indigo" defaultChecked />

	<Radio color="cyan" defaultChecked />

	<Radio color="orange" defaultChecked />

	<Radio color="crimson" defaultChecked />

	<Radio color="gray" defaultChecked />



	<Radio color="indigo" defaultChecked highContrast />

	<Radio color="cyan" defaultChecked highContrast />

	<Radio color="orange" defaultChecked highContrast />

	<Radio color="crimson" defaultChecked highContrast />

	<Radio color="gray" defaultChecked highContrast />

</Grid>

Alignment
Composing Radio within Text automatically centers it with the first line of text. It is automatically well-aligned with multi-line text too.
Default
Compact
Default
Compact
Default
Compact
<Flex direction="column" gap="3">

	<Flex align="start" direction="column" gap="1">

		<Flex asChild gap="2">

			<Text as="label" size="2">

				<Radio size="1" name="alignment-1" value="1" defaultChecked />

				Default

			</Text>

		</Flex>

		<Flex asChild gap="2">

			<Text as="label" size="2">

				<Radio size="1" name="alignment-1" value="2" />

				Compact

			</Text>

		</Flex>

	</Flex>



	<Flex align="start" direction="column" gap="1">

		<Flex asChild gap="2">

			<Text as="label" size="3">

				<Radio size="2" name="alignment-2" value="1" defaultChecked />

				Default

			</Text>

		</Flex>

		<Flex asChild gap="2">

			<Text as="label" size="3">

				<Radio size="2" name="alignment-2" value="2" />

				Compact

			</Text>

		</Flex>

	</Flex>



	<Flex align="start" direction="column" gap="1">

		<Flex asChild gap="2">

			<Text as="label" size="4">

				<Radio size="3" name="alignment-3" value="1" defaultChecked />

				Default

			</Text>

		</Flex>

		<Flex asChild gap="2">

			<Text as="label" size="4">

				<Radio size="3" name="alignment-3" value="2" />

				Compact

			</Text>

		</Flex>

	</Flex>

</Flex>

Disabled
Use the native disabled attribute to create a disabled radio button.
On
Off
On
Off
<Flex direction="column" gap="3">

	<Flex align="start" direction="column" gap="1">

		<Flex asChild gap="2">

			<Text as="label" size="2">

				<Radio name="enabled" value="1" defaultChecked />

				On

			</Text>

		</Flex>

		<Flex asChild gap="2">

			<Text as="label" size="2">

				<Radio name="enabled" value="2" />

				Off

			</Text>

		</Flex>

	</Flex>



	<Flex align="start" direction="column" gap="1">

		<Flex asChild gap="2">

			<Text as="label" size="2" color="gray">

				<Radio disabled name="disabled" value="1" defaultChecked />

				On

			</Text>

		</Flex>

		<Flex asChild gap="2">

			<Text as="label" size="2" color="gray">

				<Radio disabled name="disabled" value="2" />

				Off

			</Text>

		</Flex>

	</Flex>

</Flex>

Quick nav
API Reference
Root
Item
Examples
Size
Variant
Color
High-contrast
Alignment
Disabled
Previous
Progress
Next
Radio Group
Edit this page on GitHub.
Radio – Radix Themes
Radio Group
Set of interactive radio buttons where only one can be selected at a time.
View source
Report an issue
View in Playground
Default
Comfortable
Compact
<RadioGroup.Root defaultValue="1" name="example">

	<RadioGroup.Item value="1">Default</RadioGroup.Item>

	<RadioGroup.Item value="2">Comfortable</RadioGroup.Item>

	<RadioGroup.Item value="3">Compact</RadioGroup.Item>

</RadioGroup.Root>

API Reference
This component inherits props from the 
Radio Group primitive
 and supports 
common margin props
.
Root
Contains all the parts of a radio group.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3">
"2"
variant
"classic" | "surface" | "soft"
"surface"
color
enum
No default value
highContrast
boolean
No default value

Item
An item in the group that can be checked.
Examples
Size
Use the size prop to control the radiobutton size.
<Flex align="center" gap="2">

	<RadioGroup.Root size="1" defaultValue="1">

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>



	<RadioGroup.Root size="2" defaultValue="1">

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>



	<RadioGroup.Root size="3" defaultValue="1">

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>

</Flex>

Variant
Use the variant prop to control the visual style of the radio buttons.
<Flex gap="2">

	<Flex direction="column" asChild gap="2">

		<RadioGroup.Root variant="surface" defaultValue="1">

			<RadioGroup.Item value="1" />

			<RadioGroup.Item value="2" />

		</RadioGroup.Root>

	</Flex>



	<Flex direction="column" asChild gap="2">

		<RadioGroup.Root variant="classic" defaultValue="1">

			<RadioGroup.Item value="1" />

			<RadioGroup.Item value="2" />

		</RadioGroup.Root>

	</Flex>



	<Flex direction="column" asChild gap="2">

		<RadioGroup.Root variant="soft" defaultValue="1">

			<RadioGroup.Item value="1" />

			<RadioGroup.Item value="2" />

		</RadioGroup.Root>

	</Flex>

</Flex>

Color
Use the color prop to assign a specific 
color
.
<Flex gap="2">

	<RadioGroup.Root color="indigo" defaultValue="1">

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>



	<RadioGroup.Root color="cyan" defaultValue="1">

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>



	<RadioGroup.Root color="orange" defaultValue="1">

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>



	<RadioGroup.Root color="crimson" defaultValue="1">

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
<Grid rows="2" gap="2" display="inline-grid" flow="column">

	<RadioGroup.Root color="indigo" defaultValue="1">

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>



	<RadioGroup.Root color="indigo" defaultValue="1" highContrast>

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>



	<RadioGroup.Root color="cyan" defaultValue="1">

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>



	<RadioGroup.Root color="cyan" defaultValue="1" highContrast>

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>



	<RadioGroup.Root color="orange" defaultValue="1">

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>



	<RadioGroup.Root color="orange" defaultValue="1" highContrast>

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>



	<RadioGroup.Root color="crimson" defaultValue="1">

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>



	<RadioGroup.Root color="crimson" defaultValue="1" highContrast>

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>



	<RadioGroup.Root color="gray" defaultValue="1">

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>



	<RadioGroup.Root color="gray" defaultValue="1" highContrast>

		<RadioGroup.Item value="1" />

	</RadioGroup.Root>

</Grid>

Alignment
Composing RadioGroup.Item within Text automatically centers it with the first line of text.
Default
Compact
Default
Compact
Default
Compact
<Flex direction="column" gap="3">

	<RadioGroup.Root size="1" defaultValue="1">

		<Text as="label" size="2">

			<Flex gap="2">

				<RadioGroup.Item value="1" /> Default

			</Flex>

		</Text>



		<Text as="label" size="2">

			<Flex gap="2">

				<RadioGroup.Item value="2" /> Compact

			</Flex>

		</Text>

	</RadioGroup.Root>



	<RadioGroup.Root size="2" defaultValue="1">

		<Text as="label" size="3">

			<Flex gap="2">

				<RadioGroup.Item value="1" /> Default

			</Flex>

		</Text>



		<Text as="label" size="3">

			<Flex gap="2">

				<RadioGroup.Item value="2" /> Compact

			</Flex>

		</Text>

	</RadioGroup.Root>



	<RadioGroup.Root size="3" defaultValue="1">

		<Text as="label" size="4">

			<Flex gap="2">

				<RadioGroup.Item value="1" /> Default

			</Flex>

		</Text>



		<Text as="label" size="4">

			<Flex gap="2">

				<RadioGroup.Item value="2" /> Compact

			</Flex>

		</Text>

	</RadioGroup.Root>

</Flex>

It is automatically well-aligned with multi-line text too.
Disabled
Use the native disabled attribute to create a disabled radiobutton.
Off
On
Off
On
<Flex direction="column" gap="2">

	<RadioGroup.Root defaultValue="2">

		<RadioGroup.Item value="1">Off</RadioGroup.Item>

		<RadioGroup.Item value="2">On</RadioGroup.Item>

	</RadioGroup.Root>



	<RadioGroup.Root defaultValue="2">

		<RadioGroup.Item value="1" disabled>

			Off

		</RadioGroup.Item>

		<RadioGroup.Item value="2" disabled>

			On

		</RadioGroup.Item>

	</RadioGroup.Root>

</Flex>

Quick nav
API Reference
Root
Item
Examples
Size
Variant
Color
High-contrast
Alignment
Disabled
Previous
Radio
Next
Radio Cards
Edit this page on GitHub.
Radio Group – Radix Themes
Radio Cards
Set of interactive cards where only one can be selected at a time.
View source
Report an issue
View in Playground
8-core CPU32 GB RAM
6-core CPU24 GB RAM
4-core CPU16 GB RAM
<Box maxWidth="600px">

	<RadioCards.Root defaultValue="1" columns={{ initial: "1", sm: "3" }}>

		<RadioCards.Item value="1">

			<Flex direction="column" width="100%">

				<Text weight="bold">8-core CPU</Text>

				<Text>32 GB RAM</Text>

			</Flex>

		</RadioCards.Item>

		<RadioCards.Item value="2">

			<Flex direction="column" width="100%">

				<Text weight="bold">6-core CPU</Text>

				<Text>24 GB RAM</Text>

			</Flex>

		</RadioCards.Item>

		<RadioCards.Item value="3">

			<Flex direction="column" width="100%">

				<Text weight="bold">4-core CPU</Text>

				<Text>16 GB RAM</Text>

			</Flex>

		</RadioCards.Item>

	</RadioCards.Root>

</Box>

API Reference
This component inherits props from the 
Radio Group primitive
 and supports 
common margin props
.
Root
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3">
"2"
variant
"surface" | "classic"
"surface"
color
enum
No default value
highContrast
boolean
No default value
columns
Responsive<enum | string>
"repeat(auto-fit, minmax(160px, 1fr))"
gap
Responsive<enum | string>
"4"

Item
An item in the group that can be checked.
Examples
Size
Use the size prop to control the size.
8-core CPU
8-core CPU
8-core CPU
<Flex align="center" gap="3">

	<RadioCards.Root size="1">

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>



	<RadioCards.Root size="2">

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>



	<RadioCards.Root size="3">

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>

</Flex>

Variant
Use the variant prop to control the visual style.
8-core CPU
8-core CPU
<Flex direction="column" gap="3" maxWidth="200px">

	<RadioCards.Root variant="surface">

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>



	<RadioCards.Root variant="classic">

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>

</Flex>

Color
Use the color prop to assign a specific 
color
.
8-core CPU
8-core CPU
8-core CPU
8-core CPU
<Flex direction="column" gap="3" maxWidth="200px">

	<RadioCards.Root defaultValue="1" color="indigo">

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>



	<RadioCards.Root defaultValue="1" color="cyan">

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>



	<RadioCards.Root defaultValue="1" color="orange">

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>



	<RadioCards.Root defaultValue="1" color="crimson">

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
8-core CPU
8-core CPU
8-core CPU
8-core CPU
8-core CPU
8-core CPU
8-core CPU
8-core CPU
<Grid columns="2" gap="3" display="inline-grid">

	<RadioCards.Root defaultValue="1" color="indigo">

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>



	<RadioCards.Root defaultValue="1" color="indigo" highContrast>

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>



	<RadioCards.Root defaultValue="1" color="cyan">

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>



	<RadioCards.Root defaultValue="1" color="cyan" highContrast>

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>



	<RadioCards.Root defaultValue="1" color="orange">

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>



	<RadioCards.Root defaultValue="1" color="orange" highContrast>

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>



	<RadioCards.Root defaultValue="1" color="crimson">

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>



	<RadioCards.Root defaultValue="1" color="crimson" highContrast>

		<RadioCards.Item value="1">8-core CPU</RadioCards.Item>

	</RadioCards.Root>

</Grid>

Disabled
Off
On
Off
On
<Flex direction="column" gap="4" maxWidth="450px">

	<RadioCards.Root columns="2" defaultValue="2">

		<RadioCards.Item value="1">Off</RadioCards.Item>

		<RadioCards.Item value="2">On</RadioCards.Item>

	</RadioCards.Root>



	<RadioCards.Root columns="2" defaultValue="2">

		<RadioCards.Item value="1" disabled>

			Off

		</RadioCards.Item>

		<RadioCards.Item value="2" disabled>

			On

		</RadioCards.Item>

	</RadioCards.Root>

</Flex>

Quick nav
API Reference
Root
Item
Examples
Size
Variant
Color
High-contrast
Disabled
Previous
Radio Group
Next
Scroll Area
Edit this page on GitHub.
Radio Cards – Radix Themes
Scroll Area
Custom-styled scrollable area using native functionality.
View source
Report an issue
View in Playground
Principles of the typographic craft
Three fundamental aspects of typography are legibility, readability, and aesthetics. Although in a non-technical sense “legible” and “readable” are often used synonymously, typographically they are separate but related concepts.
Legibility describes how easily individual characters can be distinguished from one another. It is described by Walter Tracy as “the quality of being decipherable and recognisable”. For instance, if a “b” and an “h”, or a “3” and an “8”, are difficult to distinguish at small sizes, this is a problem of legibility.
Typographers are concerned with legibility insofar as it is their job to select the correct font to use. Brush Script is an example of a font containing many characters that might be difficult to distinguish. The selection of cases influences the legibility of typography because using only uppercase letters (all-caps) reduces legibility.
<ScrollArea type="always" scrollbars="vertical" style={{ height: 180 }}>

	<Box p="2" pr="8">

		<Heading size="4" mb="2" trim="start">

			Principles of the typographic craft

		</Heading>

		<Flex direction="column" gap="4">

			<Text as="p">

				Three fundamental aspects of typography are legibility, readability, and

				aesthetics. Although in a non-technical sense “legible” and “readable”

				are often used synonymously, typographically they are separate but

				related concepts.

			</Text>



			<Text as="p">

				Legibility describes how easily individual characters can be

				distinguished from one another. It is described by Walter Tracy as “the

				quality of being decipherable and recognisable”. For instance, if a “b”

				and an “h”, or a “3” and an “8”, are difficult to distinguish at small

				sizes, this is a problem of legibility.

			</Text>



			<Text as="p">

				Typographers are concerned with legibility insofar as it is their job to

				select the correct font to use. Brush Script is an example of a font

				containing many characters that might be difficult to distinguish. The

				selection of cases influences the legibility of typography because using

				only uppercase letters (all-caps) reduces legibility.

			</Text>

		</Flex>

	</Box>

</ScrollArea>

API Reference
This component inherits props from the ScrollArea primitive 
Root
 and 
Viewport
 parts. It supports 
common margin props
.
Prop
Type
Default
asChild
boolean
No default value
size
Responsive<"1" | "2" | "3">
"1"
radius
"none" | "small" | "medium" | "large" | "full"
No default value
scrollbars
"vertical" | "horizontal" | "both"
"both"

Examples
Size
Use the size prop to control the size of the scrollbar handles.
<Flex direction="column" gap="2">

	<ScrollArea
		size="1"
		type="always"
		scrollbars="horizontal"
		style={{ width: 300, height: 12 }}
	>

		<Box width="800px" height="1px" />

	</ScrollArea>



	<ScrollArea
		size="2"
		type="always"
		scrollbars="horizontal"
		style={{ width: 350, height: 16 }}
	>

		<Box width="900px" height="1px" />

	</ScrollArea>



	<ScrollArea
		size="3"
		type="always"
		scrollbars="horizontal"
		style={{ width: 400, height: 20 }}
	>

		<Box width="1000px" height="1px" />

	</ScrollArea>

</Flex>

Radius
Use the radius prop to assign a specific radius to the handles.
<Flex direction="column" gap="3">

	<ScrollArea
		radius="none"
		type="always"
		scrollbars="horizontal"
		style={{ width: 350, height: 20 }}
	>

		<Box width="800px" height="1px" />

	</ScrollArea>



	<ScrollArea
		radius="full"
		type="always"
		scrollbars="horizontal"
		style={{ width: 350, height: 20 }}
	>

		<Box width="800px" height="1px" />

	</ScrollArea>

</Flex>

Scrollbars
Use the scrollbars prop to limit scrollable axes.
Three fundamental aspects of typography are legibility, readability, and aesthetics. Although in a non-technical sense "legible" and "readable" are often used synonymously, typographically they are separate but related concepts.Legibility describes how easily individual characters can be distinguished from one another. It is described by Walter Tracy as "the quality of being decipherable and recognisable". For instance, if a "b" and an "h", or a "3" and an "8", are difficult to distinguish at small sizes, this is a problem of legibility.
Three fundamental aspects of typography are legibility, readability, and aesthetics. Although in a non-technical sense "legible" and "readable" are often used synonymously, typographically they are separate but related concepts.Legibility describes how easily individual characters can be distinguished from one another. It is described by Walter Tracy as "the quality of being decipherable and recognisable". For instance, if a "b" and an "h", or a "3" and an "8", are difficult to distinguish at small sizes, this is a problem of legibility.
<Grid columns="2" gap="2">

	<ScrollArea type="always" scrollbars="vertical" style={{ height: 150 }}>

		<Flex p="2" pr="8" direction="column" gap="4">

			<Text size="2" trim="both">

				Three fundamental aspects of typography are legibility, readability, and

				aesthetics. Although in a non-technical sense "legible" and "readable"

				are often used synonymously, typographically they are separate but

				related concepts.

			</Text>



			<Text size="2" trim="both">

				Legibility describes how easily individual characters can be

				distinguished from one another. It is described by Walter Tracy as "the

				quality of being decipherable and recognisable". For instance, if a "b"

				and an "h", or a "3" and an "8", are difficult to distinguish at small

				sizes, this is a problem of legibility.

			</Text>

		</Flex>

	</ScrollArea>



	<ScrollArea type="always" scrollbars="horizontal" style={{ height: 150 }}>

		<Flex gap="4" p="2" width="700px">

			<Text size="2" trim="both">

				Three fundamental aspects of typography are legibility, readability, and

				aesthetics. Although in a non-technical sense "legible" and "readable"

				are often used synonymously, typographically they are separate but

				related concepts.

			</Text>



			<Text size="2" trim="both">

				Legibility describes how easily individual characters can be

				distinguished from one another. It is described by Walter Tracy as "the

				quality of being decipherable and recognisable". For instance, if a "b"

				and an "h", or a "3" and an "8", are difficult to distinguish at small

				sizes, this is a problem of legibility.

			</Text>

		</Flex>

	</ScrollArea>

</Flex>

Quick nav
API Reference
Examples
Size
Radius
Scrollbars
Previous
Radio Cards
Next
Segmented Control
Edit this page on GitHub.
Scroll Area – Radix Themes
Segmented Control
Toggle buttons for switching between different values or views.
View source
Report an issue
View in Playground
<SegmentedControl.Root defaultValue="inbox">

	<SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>

	<SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>

	<SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>

</SegmentedControl.Root>

API Reference
This component inherits props and functionality from the 
Toggle Group primitive
. It supports 
common margin props
.
Root
Contains the items of the control.
Prop
Type
Default
disabled
boolean
false
size
Responsive<"1" | "2" | "3">
"2"
variant
"surface" | "classic"
"surface"
radius
"none" | "small" | "medium" | "large" | "full"
No default value

Item
Represents individual values of the control.
Examples
Size
Use the size prop to control the size of the control.
<Flex align="start" direction="column" gap="4">

	<SegmentedControl.Root defaultValue="inbox" size="1">

		<SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>

		<SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>

		<SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>

	</SegmentedControl.Root>



	<SegmentedControl.Root defaultValue="inbox" size="2">

		<SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>

		<SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>

		<SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>

	</SegmentedControl.Root>



	<SegmentedControl.Root defaultValue="inbox" size="3">

		<SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>

		<SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>

		<SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>

	</SegmentedControl.Root>

</Flex>

Variant
Use the variant prop to control the visual style of the control.
<Flex align="start" direction="column" gap="4">

	<SegmentedControl.Root defaultValue="inbox" variant="surface">

		<SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>

		<SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>

		<SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>

	</SegmentedControl.Root>



	<SegmentedControl.Root defaultValue="inbox" variant="classic">

		<SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>

		<SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>

		<SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>

	</SegmentedControl.Root>

</Flex>

Radius
Use the radius prop to assign a specific radius value.
<Flex align="start" direction="column" gap="4">

	<SegmentedControl.Root defaultValue="inbox" radius="none">

		<SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>

		<SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>

		<SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>

	</SegmentedControl.Root>



	<SegmentedControl.Root defaultValue="inbox" radius="small">

		<SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>

		<SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>

		<SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>

	</SegmentedControl.Root>



	<SegmentedControl.Root defaultValue="inbox" radius="medium">

		<SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>

		<SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>

		<SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>

	</SegmentedControl.Root>



	<SegmentedControl.Root defaultValue="inbox" radius="large">

		<SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>

		<SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>

		<SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>

	</SegmentedControl.Root>



	<SegmentedControl.Root defaultValue="inbox" radius="full">

		<SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>

		<SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>

		<SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>

	</SegmentedControl.Root>

</Flex>

Quick nav
API Reference
Root
Item
Examples
Size
Variant
Radius
Previous
Scroll Area
Next
Select
Edit this page on GitHub.
Segmented Control – Radix Themes
Select
Displays a list of options for the user to pick from—triggered by a button.
View source
Report an issue
View in Playground
<Select.Root defaultValue="apple">

	<Select.Trigger />

	<Select.Content>

		<Select.Group>

			<Select.Label>Fruits</Select.Label>

			<Select.Item value="orange">Orange</Select.Item>

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="grape" disabled>

				Grape

			</Select.Item>

		</Select.Group>

		<Select.Separator />

		<Select.Group>

			<Select.Label>Vegetables</Select.Label>

			<Select.Item value="carrot">Carrot</Select.Item>

			<Select.Item value="potato">Potato</Select.Item>

		</Select.Group>

	</Select.Content>

</Select.Root>

API Reference
Root
Contains all the parts of a select. It inherits props from the Select primitive 
Root
 part.
Prop
Type
Default
size
Responsive<"1" | "2" | "3">
"2"

Trigger
The button that toggles the select. This component inherits props from the Select primitive 
Trigger
 and 
Value
 parts. It supports 
common margin props
.
Prop
Type
Default
variant
"classic" | "surface" | "soft" | "ghost"
"surface"
color
enum
No default value
radius
"none" | "small" | "medium" | "large" | "full"
No default value
placeholder
string
No default value

Content
The component that pops out when the select is open. It inherits props from the 
Select.Portal primitive
 and 
Select.Content primitive
 parts.
Prop
Type
Default
variant
"solid" | "soft"
"solid"
color
enum
No default value
highContrast
boolean
No default value

Item
The component that contains the select items. It inherits props from the 
Select.Item primitive
 part.
Group
Used to group multiple items. It inherits props from the 
Select.Group primitive
 part. Use in conjunction with Select.Label to ensure good accessibility via automatic labelling.
Label
Used to render the label of a group, it isn't focusable using arrow keys. It inherits props from the 
Select.Label primitive
 part.
Separator
Used to visually separate items in the Select. It inherits props from the 
Select.Separator primitive
 part.
Examples
Size
Use the size prop to control the size.
<Flex gap="3" align="center">

	<Select.Root size="1" defaultValue="apple">

		<Select.Trigger />

		<Select.Content>

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>



	<Select.Root size="2" defaultValue="apple">

		<Select.Trigger />

		<Select.Content>

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>



	<Select.Root size="3" defaultValue="apple">

		<Select.Trigger />

		<Select.Content>

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>

</Flex>

Variant
Use the variant prop on Trigger and Content to customize the visual style.
<Flex gap="3" align="center">

	<Select.Root defaultValue="apple">

		<Select.Trigger variant="surface" />

		<Select.Content>

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>



	<Select.Root defaultValue="apple">

		<Select.Trigger variant="classic" />

		<Select.Content>

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>



	<Select.Root defaultValue="apple">

		<Select.Trigger variant="soft" />

		<Select.Content>

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>

</Flex>

Ghost
Use the ghost trigger variant to render the trigger without a visually containing element. Ghost triggers behave differently in layout as they use a negative margin to optically align themselves against their siblings while maintaining their padded active and hover states.
<Flex gap="3" align="center">

	<Select.Root defaultValue="apple">

		<Select.Trigger variant="surface" />

		<Select.Content>

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>



	<Select.Root defaultValue="apple">

		<Select.Trigger variant="ghost" />

		<Select.Content>

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>

</Flex>

Color
Use the color prop on Trigger and Content to assign a specific color value.
<Flex gap="3">

	<Select.Root defaultValue="apple">

		<Select.Trigger color="indigo" variant="soft" />

		<Select.Content color="indigo">

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>



	<Select.Root defaultValue="apple">

		<Select.Trigger color="cyan" variant="soft" />

		<Select.Content color="cyan">

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>



	<Select.Root defaultValue="apple">

		<Select.Trigger color="orange" variant="soft" />

		<Select.Content color="orange">

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>



	<Select.Root defaultValue="apple">

		<Select.Trigger color="crimson" variant="soft" />

		<Select.Content color="crimson">

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>

</Flex>

High-contrast
Use the highContrast prop on Content to increase item contrast.
<Flex gap="3">

	<Select.Root defaultValue="apple">

		<Select.Trigger color="gray" />

		<Select.Content color="gray" variant="solid">

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>



	<Select.Root defaultValue="apple">

		<Select.Trigger color="gray" />

		<Select.Content color="gray" variant="solid" highContrast>

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>

</Flex>

Radius
Use the radius prop to assign a specific radius value.
<Flex gap="3">

	<Select.Root defaultValue="apple">

		<Select.Trigger radius="none" />

		<Select.Content>

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>



	<Select.Root defaultValue="apple">

		<Select.Trigger radius="large" />

		<Select.Content>

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>



	<Select.Root defaultValue="apple">

		<Select.Trigger radius="full" />

		<Select.Content>

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="orange">Orange</Select.Item>

		</Select.Content>

	</Select.Root>

</Flex>

Placeholder
Use the placeholder prop to create a Trigger that doesn’t need an initial value.
<Select.Root>

	<Select.Trigger placeholder="Pick a fruit" />

	<Select.Content>

		<Select.Group>

			<Select.Label>Fruits</Select.Label>

			<Select.Item value="orange">Orange</Select.Item>

			<Select.Item value="apple">Apple</Select.Item>

			<Select.Item value="grape" disabled>

				Grape

			</Select.Item>

		</Select.Group>

		<Select.Separator />

		<Select.Group>

			<Select.Label>Vegetables</Select.Label>

			<Select.Item value="carrot">Carrot</Select.Item>

			<Select.Item value="potato">Potato</Select.Item>

		</Select.Group>

	</Select.Content>

</Select.Root>

Position
Set position="popper" prop to position the select menu below the trigger.
<Select.Root defaultValue="apple">

	<Select.Trigger />

	<Select.Content position="popper">

		<Select.Item value="apple">Apple</Select.Item>

		<Select.Item value="orange">Orange</Select.Item>

	</Select.Content>

</Select.Root>

With SSR
When using server-side rendering, you might notice a layout shift after hydration. This is because Trigger executes client-side code to display the selected item’s text. To avoid that layout shift, you can render it manually by mapping values.
() => {

	const data = {

		apple: "Apple",

		orange: "Orange",

	};

	const [value, setValue] = React.useState("apple");

	return (

		<Select.Root value={value} onValueChange={setValue}>

			<Select.Trigger>{data[value]}</Select.Trigger>

			<Select.Content>

				<Select.Item value="apple">Apple</Select.Item>

				<Select.Item value="orange">Orange</Select.Item>

			</Select.Content>

		</Select.Root>

	);

};

With an icon
You can customise how Trigger renders the value by controlling its children manually. For example, you can render an icon next to the selected item’s text.
() => {

	const data = {

		light: { label: "Light", icon: <SunIcon /> },

		dark: { label: "Dark", icon: <MoonIcon /> },

	};

	const [value, setValue] = React.useState("light");

	return (

		<Flex direction="column" maxWidth="160px">

			<Select.Root value={value} onValueChange={setValue}>

				<Select.Trigger>

					<Flex as="span" align="center" gap="2">

						{data[value].icon}

						{data[value].label}

					</Flex>

				</Select.Trigger>

				<Select.Content position="popper">

					<Select.Item value="light">Light</Select.Item>

					<Select.Item value="dark">Dark</Select.Item>

				</Select.Content>

			</Select.Root>

		</Flex>

	);

};

Quick nav
API Reference
Root
Trigger
Content
Item
Group
Label
Separator
Examples
Size
Variant
Color
High-contrast
Radius
Placeholder
Position
With SSR
With an icon
Previous
Segmented Control
Next
Separator
Edit this page on GitHub.
Select – Radix Themes
Separator
Visually or semantically separates content.
View source
Report an issue
View in Playground
Tools for building high-quality, accessible UI.
Themes
Primitives
Icons
Colors
<Text size="2">

	Tools for building high-quality, accessible UI.

	<Separator my="3" size="4" />

	<Flex gap="3" align="center">

		Themes

		<Separator orientation="vertical" />

		Primitives

		<Separator orientation="vertical" />

		Icons

		<Separator orientation="vertical" />

		Colors

	</Flex>

</Text>

API Reference
This component inherits props from the 
Separator primitive
 and supports 
common margin props
.
Prop
Type
Default
orientation
Responsive<"horizontal" | "vertical">
"horizontal"
size
Responsive<"1" | "2" | "3" | "4">
"1"
color
enum
"gray"
decorative
boolean
true

Examples
Size
Use the size prop to control the size of the separator. The largest step takes full width or height of the container.
<Flex direction="column" gap="4">

	<Separator orientation="horizontal" size="1" />

	<Separator orientation="horizontal" size="2" />

	<Separator orientation="horizontal" size="3" />

	<Separator orientation="horizontal" size="4" />

</Flex>

<Flex align="center" gap="4" height="96px">

	<Separator orientation="vertical" size="1" />

	<Separator orientation="vertical" size="2" />

	<Separator orientation="vertical" size="3" />

	<Separator orientation="vertical" size="4" />

</Flex>

Color
Use the color prop to assign a specific 
color
.
<Flex direction="column" gap="3">

	<Separator color="indigo" size="4" />

	<Separator color="cyan" size="4" />

	<Separator color="orange" size="4" />

	<Separator color="crimson" size="4" />

</Flex>

Orientation
Use the orientation prop to control whether the separator is horizontal or vertical.
<Flex align="center" gap="4">

	<Separator orientation="horizontal" />

	<Separator orientation="vertical" />

</Flex>

Quick nav
API Reference
Examples
Size
Color
Orientation
Previous
Select
Next
Skeleton
Edit this page on GitHub.
Separator – Radix Themes
Skeleton
Replaces content with same shape placeholder that indicates a loading state.
View source
Report an issue
View in Playground
<Skeleton>Loading</Skeleton>

API Reference
This component is based on the span element and supports 
common margin props
.
Prop
Type
Default
loading
boolean
true
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
No default value
height
Responsive<string>
No default value
minHeight
Responsive<string>
No default value
maxHeight
Responsive<string>
No default value

Examples
Size
Use the width and height props to manually control the size of the skeleton.
<Skeleton width="48px" height="48px" />

With children
Use the loading prop to control whether the skeleton or its children are displayed. Skeleton preserves the dimensions of children when they are hidden and disables interactive elements.
<Flex gap="4">

	<Skeleton loading={true}>

		<Switch defaultChecked />

	</Skeleton>



	<Skeleton loading={false}>

		<Switch defaultChecked />

	</Skeleton>

</Flex>

With text
When using Skeleton with text, you’d usually wrap the text node itself rather than the parent element. This ensures that the text is replaced with a placeholder of the same size:
<Container size="1">

	<Flex direction="column" gap="2">

		<Text>

			<Skeleton>Lorem ipsum dolor sit amet.</Skeleton>

		</Text>



		<Skeleton>

			<Text>Lorem ipsum dolor sit amet</Text>

		</Skeleton>

	</Flex>

</Container>

The difference is especially noticeable when wrapping longer paragraphs:
<Container size="1">

	<Flex direction="column" gap="3">

		<Text>

			<Skeleton>

				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque

				felis tellus, efficitur id convallis a, viverra eget libero. Nam magna

				erat, fringilla sed commodo sed, aliquet nec magna.

			</Skeleton>

		</Text>



		<Skeleton>

			<Text>

				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque

				felis tellus, efficitur id convallis a, viverra eget libero. Nam magna

				erat, fringilla sed commodo sed, aliquet nec magna.

			</Text>

		</Skeleton>

	</Flex>

</Container>

Quick nav
API Reference
Examples
Size
With children
With text
Previous
Separator
Next
Slider
Edit this page on GitHub.
Skeleton – Radix Themes
Slider
Provides user selection from a range of values.
View source
Report an issue
View in Playground
<Slider defaultValue={[50]} />

API Reference
This component inherits props from the 
Slider primitive
 and supports 
common margin props
.
Prop
Type
Default
size
Responsive<"1" | "2" | "3">
"2"
variant
"classic" | "surface" | "soft"
"surface"
color
enum
No default value
highContrast
boolean
No default value
radius
"none" | "small" | "medium" | "large" | "full"
No default value

Examples
Size
Use the size prop to control the size.
<Flex direction="column" gap="4" maxWidth="300px">

	<Slider defaultValue={[25]} size="1" />

	<Slider defaultValue={[50]} size="2" />

	<Slider defaultValue={[75]} size="3" />

</Flex>

Variant
Use the variant prop to control the visual style.
<Flex direction="column" gap="4" maxWidth="300px">

	<Slider defaultValue={[25]} variant="surface" />

	<Slider defaultValue={[50]} variant="classic" />

	<Slider defaultValue={[75]} variant="soft" />

</Flex>

Color
Use the color prop to assign a specific 
color
.
<Flex direction="column" gap="4" maxWidth="300px">

	<Slider defaultValue={[20]} color="indigo" />

	<Slider defaultValue={[40]} color="cyan" />

	<Slider defaultValue={[60]} color="orange" />

	<Slider defaultValue={[80]} color="crimson" />

</Flex>

High-contrast
Use the highContrast prop to increase color contrast in light mode.
<Grid columns="2" gap="4">

	<Slider defaultValue={[10]} color="indigo" />

	<Slider defaultValue={[10]} color="indigo" highContrast />

	<Slider defaultValue={[30]} color="cyan" />

	<Slider defaultValue={[30]} color="cyan" highContrast />

	<Slider defaultValue={[50]} color="orange" />

	<Slider defaultValue={[50]} color="orange" highContrast />

	<Slider defaultValue={[70]} color="crimson" />

	<Slider defaultValue={[70]} color="crimson" highContrast />

	<Slider defaultValue={[90]} color="gray" />

	<Slider defaultValue={[90]} color="gray" highContrast />

</Grid>

Radius
Use the radius prop to assign a specific radius value.
<Flex direction="column" gap="4" maxWidth="300px">

	<Slider defaultValue={[25]} radius="none" />

	<Slider defaultValue={[50]} radius="small" />

	<Slider defaultValue={[75]} radius="full" />

</Flex>

Range
Provide multiple values to create a range slider.
<Slider defaultValue={[25, 75]} />

Quick nav
API Reference
Examples
Size
Variant
Color
High-contrast
Radius
Range
Previous
Skeleton
Next
Spinner
Edit this page on GitHub.
Slider – Radix Themes
Spinner
Displays an animated loading indicator.
View source
Report an issue
View in Playground
<Spinner />

API Reference
This component is based on the span element and supports 
common margin props
.
Prop
Type
Default
size
Responsive<"1" | "2" | "3">
"2"
loading
boolean
true

Examples
Size
Use the size prop to control the size of the spinner.
<Flex align="center" gap="4">

	<Spinner size="1" />

	<Spinner size="2" />

	<Spinner size="3" />

</Flex>

With children
Use the loading prop to control whether the spinner or its children are displayed. Spinner preserves the dimensions of children when they are hidden and disables interactive elements.
<Flex gap="4">

	<Spinner loading={true}>

		<Switch defaultChecked />

	</Spinner>



	<Spinner loading={false}>

		<Switch defaultChecked />

	</Spinner>

</Flex>

With buttons
Buttons
 have their own loading prop that automatically composes a spinner.
<Button loading>Bookmark</Button>

If you have an icon inside the button, you can use the button’s disabled state and wrap the icon in a standalone <Spinner> to achieve a more sophisticated design.
<Button disabled>

	<Spinner loading>

		<BookmarkIcon />

	</Spinner>

	Bookmark

</Button>

Quick nav
API Reference
Examples
Size
With children
With buttons
Previous
Slider
Next
Switch
Edit this page on GitHub.
Spinner – Radix Themes
Switch
Toggle switch alternative to the checkbox.
View source
Report an issue
View in Playground
<Switch defaultChecked />

API Reference
This component inherits props from the 
Switch primitive
 and supports 
common margin props
.
Prop
Type
Default
size
Responsive<"1" | "2" | "3">
"2"
variant
"classic" | "surface" | "soft"
"surface"
color
enum
No default value
highContrast
boolean
No default value
radius
"none" | "small" | "medium" | "large" | "full"
No default value

Examples
Size
Use the size prop to control the size of the switch.
<Flex align="center" gap="2">

	<Switch size="1" defaultChecked />

	<Switch size="2" defaultChecked />

	<Switch size="3" defaultChecked />

</Flex>

Variant
Use the variant prop to control the visual style of the switch.
<Flex gap="2">

	<Flex direction="column" gap="3">

		<Switch variant="surface" />

		<Switch variant="classic" />

		<Switch variant="soft" />

	</Flex>



	<Flex direction="column" gap="3">

		<Switch variant="surface" defaultChecked />

		<Switch variant="classic" defaultChecked />

		<Switch variant="soft" defaultChecked />

	</Flex>

</Flex>

Color
Use the color prop to assign a specific 
color
.
<Flex gap="2">

	<Switch color="indigo" defaultChecked />

	<Switch color="cyan" defaultChecked />

	<Switch color="orange" defaultChecked />

	<Switch color="crimson" defaultChecked />

</Flex>

High-contrast
Use the highContrast prop to increase color contrast in light mode.
<Grid rows="2" gapX="2" gapY="3" display="inline-grid" flow="column">

	<Switch color="indigo" defaultChecked />

	<Switch color="indigo" defaultChecked highContrast />

	<Switch color="cyan" defaultChecked />

	<Switch color="cyan" defaultChecked highContrast />

	<Switch color="orange" defaultChecked />

	<Switch color="orange" defaultChecked highContrast />

	<Switch color="crimson" defaultChecked />

	<Switch color="crimson" defaultChecked highContrast />

	<Switch color="gray" defaultChecked />

	<Switch color="gray" defaultChecked highContrast />

</Grid>

Radius
Use the radius prop to assign a specific radius value.
<Flex gap="3">

	<Switch radius="none" defaultChecked />

	<Switch radius="small" defaultChecked />

	<Switch radius="full" defaultChecked />

</Flex>

Alignment
Composing Switch within Text automatically centers it with the first line of text.
Sync settings
Sync settings
Sync settings
<Flex direction="column" gap="3">

	<Text as="label" size="2">

		<Flex gap="2">

			<Switch size="1" defaultChecked /> Sync settings

		</Flex>

	</Text>



	<Text as="label" size="3">

		<Flex gap="2">

			<Switch size="2" defaultChecked /> Sync settings

		</Flex>

	</Text>



	<Text as="label" size="4">

		<Flex gap="2">

			<Switch size="3" defaultChecked /> Sync settings

		</Flex>

	</Text>

</Flex>

It is automatically well-aligned with multi-line text too.
Disabled
Use the native disabled attribute to create a disabled switch.
Off
On
On
Off
<Flex direction="column" gap="2">

	<Text as="label" size="2">

		<Flex gap="2">

			<Switch size="1" />

			Off

		</Flex>

	</Text>



	<Text as="label" size="2">

		<Flex gap="2">

			<Switch size="1" defaultChecked />

			On

		</Flex>

	</Text>



	<Text as="label" size="2" color="gray">

		<Flex gap="2">

			<Switch size="1" disabled />

			On

		</Flex>

	</Text>



	<Text as="label" size="2" color="gray">

		<Flex gap="2">

			<Switch size="1" disabled defaultChecked />

			Off

		</Flex>

	</Text>

</Flex>

Quick nav
API Reference
Examples
Size
Variant
Color
High-contrast
Radius
Alignment
Disabled
Previous
Spinner
Next
Table
Edit this page on GitHub.
Switch – Radix Themes
Table
Semantic table element for presenting data.
View source
Report an issue
View in Playground
Full name
Email
Group
Danilo Sousa
danilo@example.com
Developer
Zahra Ambessa
zahra@example.com
Admin
Jasper Eriksson
jasper@example.com
Developer

<Table.Root>

	<Table.Header>

		<Table.Row>

			<Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>

			<Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>

			<Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>

		</Table.Row>

	</Table.Header>



	<Table.Body>

		<Table.Row>

			<Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>

			<Table.Cell>danilo@example.com</Table.Cell>

			<Table.Cell>Developer</Table.Cell>

		</Table.Row>



		<Table.Row>

			<Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>

			<Table.Cell>zahra@example.com</Table.Cell>

			<Table.Cell>Admin</Table.Cell>

		</Table.Row>



		<Table.Row>

			<Table.RowHeaderCell>Jasper Eriksson</Table.RowHeaderCell>

			<Table.Cell>jasper@example.com</Table.Cell>

			<Table.Cell>Developer</Table.Cell>

		</Table.Row>

	</Table.Body>

</Table.Root>

API Reference
Root
Groups the Header and Body parts. This component is based on the table element and supports 
common margin props
.
Prop
Type
Default
size
Responsive<"1" | "2" | "3">
"2"
variant
"surface" | "ghost"
"ghost"
layout
Responsive<"auto" | "fixed">
No default value

Header
Contains the column headings for the table, based on the thead element.
Body
Displays the table data. This component is based on the tbody element.
Row
A row of table cells. Based on the tr element.
Prop
Type
Default
align
Responsive<"start" | "center" | "end" | "baseline">
No default value

Cell
A basic table cell. This component is based on the td element, but uses justify instead of align to control how horizontal space is distributed within the table cell.
Prop
Type
Default
justify
Responsive<"start" | "center" | "end">
No default value
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
No default value
p
Responsive<enum | string>
No default value
px
Responsive<enum | string>
No default value
py
Responsive<enum | string>
No default value
pt
Responsive<enum | string>
No default value
pr
Responsive<enum | string>
No default value
pb
Responsive<enum | string>
No default value
pl
Responsive<enum | string>
No default value

ColumnHeaderCell
The header of a table column. Based on the th element and provides the same props interface as the Cell part.
Prop
Type
Default
justify
Responsive<"start" | "center" | "end">
No default value
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
No default value
p
Responsive<enum | string>
No default value
px
Responsive<enum | string>
No default value
py
Responsive<enum | string>
No default value
pt
Responsive<enum | string>
No default value
pr
Responsive<enum | string>
No default value
pb
Responsive<enum | string>
No default value
pl
Responsive<enum | string>
No default value

RowHeaderCell
The header of a table row. Based on the th element and provides the same props interface as the Cell part.
Prop
Type
Default
justify
Responsive<"start" | "center" | "end">
No default value
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
No default value
p
Responsive<enum | string>
No default value
px
Responsive<enum | string>
No default value
py
Responsive<enum | string>
No default value
pt
Responsive<enum | string>
No default value
pr
Responsive<enum | string>
No default value
pb
Responsive<enum | string>
No default value
pl
Responsive<enum | string>
No default value

Examples
Size
Use the size prop to control how large the text and padding of the table cells should be.
Full name
Email
Danilo Sousa
danilo@example.com
Zahra Ambessa
zahra@example.com


Full name
Email
Danilo Sousa
danilo@example.com
Zahra Ambessa
zahra@example.com


Full name
Email
Danilo Sousa
danilo@example.com
Zahra Ambessa
zahra@example.com

<Flex direction="column" gap="5" maxWidth="350px">

	<Table.Root size="1">

		<Table.Header>

			<Table.Row>

				<Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>

				<Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>

			</Table.Row>

		</Table.Header>



		<Table.Body>

			<Table.Row>

				<Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>

				<Table.Cell>danilo@example.com</Table.Cell>

			</Table.Row>

			<Table.Row>

				<Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>

				<Table.Cell>zahra@example.com</Table.Cell>

			</Table.Row>

		</Table.Body>

	</Table.Root>



	<Table.Root size="2">

		<Table.Header>

			<Table.Row>

				<Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>

				<Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>

			</Table.Row>

		</Table.Header>



		<Table.Body>

			<Table.Row>

				<Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>

				<Table.Cell>danilo@example.com</Table.Cell>

			</Table.Row>

			<Table.Row>

				<Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>

				<Table.Cell>zahra@example.com</Table.Cell>

			</Table.Row>

		</Table.Body>

	</Table.Root>



	<Table.Root size="3">

		<Table.Header>

			<Table.Row>

				<Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>

				<Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>

			</Table.Row>

		</Table.Header>



		<Table.Body>

			<Table.Row>

				<Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>

				<Table.Cell>danilo@example.com</Table.Cell>

			</Table.Row>

			<Table.Row>

				<Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>

				<Table.Cell>zahra@example.com</Table.Cell>

			</Table.Row>

		</Table.Body>

	</Table.Root>

</Flex>

With a backplate
Use variant="surface" to add a visually enclosed backplate to the table.
Full name
Email
Group
Danilo Sousa
danilo@example.com
Developer
Zahra Ambessa
zahra@example.com
Admin
Jasper Eriksson
jasper@example.com
Developer

<Table.Root variant="surface">

	<Table.Header>

		<Table.Row>

			<Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>

			<Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>

			<Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>

		</Table.Row>

	</Table.Header>



	<Table.Body>

		<Table.Row>

			<Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>

			<Table.Cell>danilo@example.com</Table.Cell>

			<Table.Cell>Developer</Table.Cell>

		</Table.Row>



		<Table.Row>

			<Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>

			<Table.Cell>zahra@example.com</Table.Cell>

			<Table.Cell>Admin</Table.Cell>

		</Table.Row>



		<Table.Row>

			<Table.RowHeaderCell>Jasper Eriksson</Table.RowHeaderCell>

			<Table.Cell>jasper@example.com</Table.Cell>

			<Table.Cell>Developer</Table.Cell>

		</Table.Row>

	</Table.Body>

</Table.Root>

Quick nav
API Reference
Root
Header
Body
Row
Cell
ColumnHeaderCell
RowHeaderCell
Examples
Size
With a backplate
Previous
Switch
Next
Tabs
Edit this page on GitHub.
Table – Radix Themes
Tabs
Set of content sections to be displayed one at a time.
View source
Report an issue
View in Playground
Make changes to your account.
<Tabs.Root defaultValue="account">

	<Tabs.List>

		<Tabs.Trigger value="account">Account</Tabs.Trigger>

		<Tabs.Trigger value="documents">Documents</Tabs.Trigger>

		<Tabs.Trigger value="settings">Settings</Tabs.Trigger>

	</Tabs.List>



	<Box pt="3">

		<Tabs.Content value="account">

			<Text size="2">Make changes to your account.</Text>

		</Tabs.Content>



		<Tabs.Content value="documents">

			<Text size="2">Access and update your documents.</Text>

		</Tabs.Content>



		<Tabs.Content value="settings">

			<Text size="2">Edit your profile or update contact information.</Text>

		</Tabs.Content>

	</Box>

</Tabs.Root>

API Reference
This component inherits props from the 
Tabs primitive
 and supports 
common margin props
.
Root
Contains all component parts.
Prop
Type
Default
asChild
boolean
No default value

List
Contains the triggers that sit alongside the active content.
Prop
Type
Default
size
Responsive<"1" | "2">
"2"
wrap
Responsive<"nowrap" | "wrap" | "wrap-reverse">
No default value
justify
Responsive<"start" | "center" | "end">
No default value
color
enum
No default value
highContrast
boolean
No default value

Trigger
The button that activates its associated content.
Content
Contains the content associated with each trigger.
Examples
Size
Use the size prop to control the size of the tab list.
<Flex direction="column" gap="4" pb="2">

	<Tabs.Root defaultValue="account">

		<Tabs.List size="1">

			<Tabs.Trigger value="account">Account</Tabs.Trigger>

			<Tabs.Trigger value="documents">Documents</Tabs.Trigger>

			<Tabs.Trigger value="settings">Settings</Tabs.Trigger>

		</Tabs.List>

	</Tabs.Root>



	<Tabs.Root defaultValue="account">

		<Tabs.List size="2">

			<Tabs.Trigger value="account">Account</Tabs.Trigger>

			<Tabs.Trigger value="documents">Documents</Tabs.Trigger>

			<Tabs.Trigger value="settings">Settings</Tabs.Trigger>

		</Tabs.List>

	</Tabs.Root>

</Flex>

Color
Use the color prop to assign a specific 
color
 to the tab list.
<Flex direction="column" gap="4" pb="2">

	<Tabs.Root defaultValue="account">

		<Tabs.List color="indigo">

			<Tabs.Trigger value="account">Account</Tabs.Trigger>

			<Tabs.Trigger value="documents">Documents</Tabs.Trigger>

			<Tabs.Trigger value="settings">Settings</Tabs.Trigger>

		</Tabs.List>

	</Tabs.Root>



	<Tabs.Root defaultValue="account">

		<Tabs.List color="cyan">

			<Tabs.Trigger value="account">Account</Tabs.Trigger>

			<Tabs.Trigger value="documents">Documents</Tabs.Trigger>

			<Tabs.Trigger value="settings">Settings</Tabs.Trigger>

		</Tabs.List>

	</Tabs.Root>



	<Tabs.Root defaultValue="account">

		<Tabs.List color="orange">

			<Tabs.Trigger value="account">Account</Tabs.Trigger>

			<Tabs.Trigger value="documents">Documents</Tabs.Trigger>

			<Tabs.Trigger value="settings">Settings</Tabs.Trigger>

		</Tabs.List>

	</Tabs.Root>



	<Tabs.Root defaultValue="account">

		<Tabs.List color="crimson">

			<Tabs.Trigger value="account">Account</Tabs.Trigger>

			<Tabs.Trigger value="documents">Documents</Tabs.Trigger>

			<Tabs.Trigger value="settings">Settings</Tabs.Trigger>

		</Tabs.List>

	</Tabs.Root>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.
<Flex direction="column" gap="4" pb="2">

	<Tabs.Root defaultValue="account">

		<Tabs.List color="gray">

			<Tabs.Trigger value="account">Account</Tabs.Trigger>

			<Tabs.Trigger value="documents">Documents</Tabs.Trigger>

			<Tabs.Trigger value="settings">Settings</Tabs.Trigger>

		</Tabs.List>

	</Tabs.Root>



	<Tabs.Root defaultValue="account">

		<Tabs.List color="gray" highContrast>

			<Tabs.Trigger value="account">Account</Tabs.Trigger>

			<Tabs.Trigger value="documents">Documents</Tabs.Trigger>

			<Tabs.Trigger value="settings">Settings</Tabs.Trigger>

		</Tabs.List>

	</Tabs.Root>

</Flex>

Navigation
Tabs should not be used for page navigation. Use 
Tab Nav
 instead, which is designed for this purpose and has equivalent styles.
Quick nav
API Reference
Root
List
Trigger
Content
Examples
Size
Color
High-contrast
Navigation
Previous
Table
Next
Tab Nav
Edit this page on GitHub.
Tabs – Radix Themes
Tab Nav
Navigation menu with links styled as tabs.
View source
Report an issue
View in Playground






<TabNav.Root>

	<TabNav.Link href="#" active>

		Account

	</TabNav.Link>

	<TabNav.Link href="#">Documents</TabNav.Link>

	<TabNav.Link href="#">Settings</TabNav.Link>

</TabNav.Root>

API Reference
This component is based on the 
Navigation Menu primitive
 and supports 
common margin props
.
Root
Contains the navigation menu links.
Prop
Type
Default
size
Responsive<"1" | "2">
"2"
wrap
Responsive<"nowrap" | "wrap" | "wrap-reverse">
No default value
justify
Responsive<"start" | "center" | "end">
No default value
color
enum
No default value
highContrast
boolean
No default value

Link
An individual navigation menu link.
Prop
Type
Default
asChild
boolean
No default value
active
boolean
false

Examples
Size
Use the size prop to control the size of the tabs.












<Flex direction="column" gap="4" pb="2">

	<TabNav.Root size="1">

		<TabNav.Link href="#" active>

			Account

		</TabNav.Link>

		<TabNav.Link href="#">Documents</TabNav.Link>

		<TabNav.Link href="#">Settings</TabNav.Link>

	</TabNav.Root>



	<TabNav.Root size="2">

		<TabNav.Link href="#" active>

			Account

		</TabNav.Link>

		<TabNav.Link href="#">Documents</TabNav.Link>

		<TabNav.Link href="#">Settings</TabNav.Link>

	</TabNav.Root>

</Flex>

Color
Use the color prop to assign a specific 
color
 to the tab list.
























<Flex direction="column" gap="4" pb="2">

	<TabNav.Root color="indigo">

		<TabNav.Link href="#" active>

			Account

		</TabNav.Link>

		<TabNav.Link href="#">Documents</TabNav.Link>

		<TabNav.Link href="#">Settings</TabNav.Link>

	</TabNav.Root>



	<TabNav.Root color="cyan">

		<TabNav.Link href="#" active>

			Account

		</TabNav.Link>

		<TabNav.Link href="#">Documents</TabNav.Link>

		<TabNav.Link href="#">Settings</TabNav.Link>

	</TabNav.Root>



	<TabNav.Root color="orange">

		<TabNav.Link href="#" active>

			Account

		</TabNav.Link>

		<TabNav.Link href="#">Documents</TabNav.Link>

		<TabNav.Link href="#">Settings</TabNav.Link>

	</TabNav.Root>



	<TabNav.Root color="crimson">

		<TabNav.Link href="#" active>

			Account

		</TabNav.Link>

		<TabNav.Link href="#">Documents</TabNav.Link>

		<TabNav.Link href="#">Settings</TabNav.Link>

	</TabNav.Root>

</Flex>

High-contrast
Use the highContrast prop to increase color contrast with the background.












<Flex direction="column" gap="4" pb="2">

	<TabNav.Root color="gray">

		<TabNav.Link href="#" active>

			Account

		</TabNav.Link>

		<TabNav.Link href="#">Documents</TabNav.Link>

		<TabNav.Link href="#">Settings</TabNav.Link>

	</TabNav.Root>



	<TabNav.Root color="gray" highContrast>

		<TabNav.Link href="#" active>

			Account

		</TabNav.Link>

		<TabNav.Link href="#">Documents</TabNav.Link>

		<TabNav.Link href="#">Settings</TabNav.Link>

	</TabNav.Root>

</Flex>

With router links
Use the asChild prop to compose TabNav.Link with your app’s router link component.
<TabNav.Root>

	<TabNav.Link asChild active={pathname === "/account"}>

		<NextLink href="/account">Account</NextLink>

	</TabNav.Link>

	<TabNav.Link asChild active={pathname === "/documents"}>

		<NextLink href="/documents">Documents</NextLink>

	</TabNav.Link>

	<TabNav.Link asChild active={pathname === "/settings"}>

		<NextLink href="/settings">Settings</NextLink>

	</TabNav.Link>

</TabNav.Root>

Quick nav
API Reference
Root
Link
Examples
Size
Color
High-contrast
With router links
Previous
Tabs
Next
Text Area
Edit this page on GitHub.
Tab Nav – Radix Themes
Text Area
Captures multi-line user input.
View source
Report an issue
View in Playground
<TextArea placeholder="Reply to comment…" />

API Reference
This component is based on the textarea element and supports 
common margin props
.
Prop
Type
Default
size
Responsive<"1" | "2" | "3">
"2"
variant
"classic" | "surface" | "soft"
"surface"
resize
Responsive<"none" | "vertical" | "horizontal" | "both">
No default value
color
enum
No default value
radius
"none" | "small" | "medium" | "large" | "full"
No default value

Examples
Size
Use the size prop to control the size.
<Flex direction="column" gap="3">

	<Box maxWidth="200px">

		<TextArea size="1" placeholder="Reply to comment…" />

	</Box>

	<Box maxWidth="250px">

		<TextArea size="2" placeholder="Reply to comment…" />

	</Box>

	<Box maxWidth="300px">

		<TextArea size="3" placeholder="Reply to comment…" />

	</Box>

</Flex>

Variant
Use the variant prop to control the visual style.
<Flex direction="column" gap="3" maxWidth="250px">

	<TextArea variant="surface" placeholder="Reply to comment…" />

	<TextArea variant="classic" placeholder="Reply to comment…" />

	<TextArea variant="soft" placeholder="Reply to comment…" />

</Flex>

Color
Use the color prop to assign a specific 
color
.
<Flex direction="column" gap="3" maxWidth="250px">

	<TextArea color="blue" variant="soft" placeholder="Reply to comment…" />

	<TextArea color="green" variant="soft" placeholder="Reply to comment…" />

	<TextArea color="red" variant="soft" placeholder="Reply to comment…" />

</Flex>

Radius
Use the radius prop to assign a specific radius value.
<Flex direction="column" gap="3" maxWidth="250px">

	<TextArea radius="none" placeholder="Search the docs…" />

	<TextArea radius="large" placeholder="Search the docs…" />

	<TextArea radius="full" placeholder="Search the docs…" />

</Flex>

Resize
Use the resize prop to enable resizing on one or both axis.
<Flex direction="column" gap="3" maxWidth="250px">

	<TextArea resize="none" placeholder="Search the docs…" />

	<TextArea resize="vertical" placeholder="Search the docs…" />

	<TextArea resize="horizontal" placeholder="Search the docs…" />

	<TextArea resize="both" placeholder="Search the docs…" />

</Flex>

Quick nav
API Reference
Examples
Size
Variant
Color
Radius
Resize
Previous
Tab Nav
Next
Text Field
Edit this page on GitHub.
Text Area – Radix Themes
Text Field
Captures user input with an optional slot for buttons and icons.
View source
Report an issue
View in Playground
<TextField.Root placeholder="Search the docs…">

	<TextField.Slot>

		<MagnifyingGlassIcon height="16" width="16" />

	</TextField.Slot>

</TextField.Root>

API Reference
Root
Groups Slot and Input parts. This component is based on the div element and supports 
common margin props
.
Prop
Type
Default
size
Responsive<"1" | "2" | "3">
"2"
variant
"classic" | "surface" | "soft"
"surface"
color
enum
No default value
radius
"none" | "small" | "medium" | "large" | "full"
No default value

Slot
Contains icons or buttons associated with an Input.
Prop
Type
Default
side
"left" | "right"
No default value
color
enum
No default value
gap
Responsive<enum | string>
No default value
px
Responsive<enum | string>
No default value
pl
Responsive<enum | string>
No default value
pr
Responsive<enum | string>
No default value

Examples
Size
Use the size prop to control the size.
<Flex direction="column" gap="3">

	<Box maxWidth="200px">

		<TextField.Root size="1" placeholder="Search the docs…" />

	</Box>

	<Box maxWidth="250px">

		<TextField.Root size="2" placeholder="Search the docs…" />

	</Box>

	<Box maxWidth="300px">

		<TextField.Root size="3" placeholder="Search the docs…" />

	</Box>

</Flex>

Use matching component sizes when composing Text Field with buttons. However, don’t use size 1 inputs with buttons—at this size, there is not enough vertical space to nest other interactive elements.
<Flex direction="column" gap="3" maxWidth="400px">

	<Box maxWidth="200px">

		<TextField.Root placeholder="Search the docs…" size="1">

			<TextField.Slot>

				<MagnifyingGlassIcon height="16" width="16" />

			</TextField.Slot>

		</TextField.Root>

	</Box>



	<Box maxWidth="250px">

		<TextField.Root placeholder="Search the docs…" size="2">

			<TextField.Slot>

				<MagnifyingGlassIcon height="16" width="16" />

			</TextField.Slot>

			<TextField.Slot>

				<IconButton size="1" variant="ghost">

					<DotsHorizontalIcon height="14" width="14" />

				</IconButton>

			</TextField.Slot>

		</TextField.Root>

	</Box>



	<Box maxWidth="300px">

		<TextField.Root placeholder="Search the docs…" size="3">

			<TextField.Slot>

				<MagnifyingGlassIcon height="16" width="16" />

			</TextField.Slot>

			<TextField.Slot pr="3">

				<IconButton size="2" variant="ghost">

					<DotsHorizontalIcon height="16" width="16" />

				</IconButton>

			</TextField.Slot>

		</TextField.Root>

	</Box>

</Flex>

Variant
Use the variant prop to control the visual style.
<Flex direction="column" gap="3" maxWidth="250px">

	<TextField.Root variant="surface" placeholder="Search the docs…" />

	<TextField.Root variant="classic" placeholder="Search the docs…" />

	<TextField.Root variant="soft" placeholder="Search the docs…" />

</Flex>

Color
Use the color prop to assign a specific 
color
.
<Flex direction="column" gap="3" maxWidth="250px">

	<TextField.Root
		color="indigo"
		variant="soft"
		placeholder="Search the docs…"
	/>

	<TextField.Root color="green" variant="soft" placeholder="Search the docs…" />

	<TextField.Root color="red" variant="soft" placeholder="Search the docs…" />

</Flex>

Radius
Use the radius prop to assign a specific radius value.
<Flex direction="column" gap="3" maxWidth="250px">

	<TextField.Root radius="none" placeholder="Search the docs…" />

	<TextField.Root radius="large" placeholder="Search the docs…" />

	<TextField.Root radius="full" placeholder="Search the docs…" />

</Flex>

Quick nav
API Reference
Root
Slot
Examples
Size
Variant
Color
Radius
Previous
Text Area
Next
Tooltip
Edit this page on GitHub.
Text Field – Radix Themes
Overview
Theme
Layout
Typography
Components
Utilities
Tooltip
Floating element that provides a control with contextual information via pointer or focus.
View source
Report an issue
View in Playground
<Tooltip content="Add to library">

	<IconButton radius="full">

		<PlusIcon />

	</IconButton>

</Tooltip>

API Reference
This component inherits and merges props from the Radix Tooltip primitive 
Root
, 
Portal
 and 
Content
 parts. It supports 
common margin props
.
Prop
Type
Default
content*
ReactNode
No default value
width
Responsive<string>
No default value
minWidth
Responsive<string>
No default value
maxWidth
Responsive<string>
"360px"

Quick nav
API Reference
Previous
Text Field
Next
Accessible Icon
Edit this page on GitHub.
Tooltip – Radix Themes
Reset
Removes default browser styles from any component.
View source
Report an issue
API Reference
Reset component is used to aggressively reset browser styles on a specific element.
It renders a 
Slot primitive
 that:
Accepts a single React element as its child
Removes opinionated browser styles
Sets idiomatic layout defaults, like display: block for images or width: stretch for inputs
Sets the 
cursor
 style according to your theme settings
Adds box-sizing: border-box
Examples
Anchor
Anchor
<Reset>

	<a href="#">Anchor</a>

</Reset>

Abbreviation
ABR
<Reset>

	<abbr title="Abbreviation">ABR</abbr>

</Reset>

Address
Address
<Reset>

	<address>Address</address>

</Reset>

Article
Article
<Reset>

	<article>Article</article>

</Reset>

Aside
Aside content
<Reset>

	<aside>Aside content</aside>

</Reset>

Bold
Bold text
<Reset>

	<b>Bold text</b>

</Reset>

Bi-directional isolation
Bi-directional isolation
<Reset>

	<bdi>Bi-directional isolation</bdi>

</Reset>

Bi-directional override
Bi-directional override
<Reset>

	<bdo>Bi-directional override</bdo>

</Reset>

Block quote
Block quote
<Reset>

	<blockquote>Block quote</blockquote>

</Reset>

Button
Button
<Reset>

	<button>Button</button>

</Reset>

Citation
Citation
<Reset>

	<cite>Citation</cite>

</Reset>

Code
Computer code
<Reset>

	<code>Computer code</code>

</Reset>

Data
Machine-readable equivalent
<Reset>

	<data>Machine-readable equivalent</data>

</Reset>

Deleted text
Deleted text
<Reset>

	<del>Deleted text</del>

</Reset>

Details
Summary for a details element
<Reset>

	<details>

		<summary>Summary for a details element</summary>

		Additional details

	</details>

</Reset>

Definition
Definition
<Reset>

	<dfn>Definition</dfn>

</Reset>

Div
Div
<Reset>

	<div>Div</div>

</Reset>

Emphasized text
Emphasized text
<Reset>

	<em>Emphasized text</em>

</Reset>

Fieldset
Fieldset
<Reset>

	<fieldset>Fieldset</fieldset>

</Reset>

Figure
Figure
<Reset>

	<figure>Figure</figure>

</Reset>

Figure caption
Figure caption
<Reset>

	<figcaption>Figure caption</figcaption>

</Reset>

Footer
Footer
<Reset>

	<footer>Footer</footer>

</Reset>

Form
Form
<Reset>

	<form>Form</form>

</Reset>

Heading
Heading
<Reset>

	<h1>Heading</h1>

</Reset>

Header
Header
<Reset>

	<header>Header</header>

</Reset>

Italic text
Italic text
<Reset>

	<i>Italic text</i>

</Reset>

Inline frame
When reset, <iframe> elements get display: block and width: stretch.
<Reset>

	<iframe src="https://example.com" />

</Reset>

Image
When reset, <img> elements get display: block and max-width: 100%.

<Reset>

	<img src="https://images.unsplash.com/photo-1556825578-5813abf36e34?q=80&w=3864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />

</Reset>

Input
When reset, textual <input> types get display: block and width: stretch.
<Reset>

	<input placeholder="Input control" />

</Reset>

Inserted text
Inserted text
<Reset>

	<ins>Inserted text</ins>

</Reset>

Keyboard input
Keyboard input
<Reset>

	<kbd>Keyboard input</kbd>

</Reset>

Label
Label
<Reset>

	<label>Label</label>

</Reset>

Legend
Legend
<Reset>

	<legend>Legend</legend>

</Reset>

List item
List item
<Reset>

	<li>List item</li>

</Reset>

Main
Main
<Reset>

	<main>Main</main>

</Reset>

Marked text
Marked text
<Reset>

	<mark>Marked text</mark>

</Reset>

Navigation
Navigation
<Reset>

	<nav>Navigation</nav>

</Reset>

Ordered list
Coffee
Tea
Milk
<Reset>

	<ol>

		<li>Coffee</li>

		<li>Tea</li>

		<li>Milk</li>

	</ol>

</Reset>

Output
Output
<Reset>

	<output>Output</output>

</Reset>

Paragraph
Paragraph
<Reset>

	<p>Paragraph</p>

</Reset>

Preformatted text
Preformatted text: "    "
<Reset>

	<pre>{'Preformatted text: "    "'}</pre>

</Reset>

Quote
Quote
<Reset>

	<q>Quote</q>

</Reset>

Strikethrough text
Strikethrough text
<Reset>

	<s>Strikethrough text</s>

</Reset>

Sample output
Sample output
<Reset>

	<samp>Sample output</samp>

</Reset>

Section
Section
<Reset>

	<section>Section</section>

</Reset>

Select
Option 1Option 2Option 3Option 4
<Reset>

	<select>

		<option value="1">Option 1</option>

		<option value="2">Option 2</option>

		<option value="3">Option 3</option>

		<option value="4">Option 4</option>

	</select>

</Reset>

Small text
Small text
<Reset>

	<small>Small text</small>

</Reset>

Span
Span
<Reset>

	<span>Span</span>

</Reset>

Strong text
Strong text
<Reset>

	<strong>Strong text</strong>

</Reset>

Subscript text
Subscript text
<Reset>

	<sub>Subscript text</sub>

</Reset>

Superscript text
Superscript text
<Reset>

	<sup>Superscript text</sup>

</Reset>

SVG
When reset, <svg> elements get display: block, max-width: 100%, and flex-shrink: 0.
<Reset>

	<svg
		width="76"
		height="24"
		viewBox="0 0 76 24"
		fill="currentcolor"
		xmlns="http://www.w3.org/2000/svg"
	>

		<path d="M43.9022 20.0061H46.4499C46.2647 19.0375 46.17 18.1161 46.17 17.0058V12.3753C46.17 9.25687 44.3893 7.72127 41.1943 7.72127C38.3003 7.72127 36.3324 9.23324 36.0777 11.8083H38.9254C39.0181 10.698 39.8052 9.96561 41.1017 9.96561C42.4446 9.96561 43.3243 10.6743 43.3243 12.1391V12.7061L39.8052 13.1077C37.4206 13.3912 35.5684 14.3834 35.5684 16.7931C35.5684 18.9666 37.2353 20.2659 39.5274 20.2659C41.4027 20.2659 42.9845 19.4863 43.6401 18.1161C43.6689 18.937 43.9022 20.0061 43.9022 20.0061ZM40.3377 18.1634C39.157 18.1634 38.5087 17.5727 38.5087 16.6278C38.5087 15.3757 39.4579 15.0922 40.7082 14.9268L43.3243 14.6197V15.352C43.3243 17.242 41.8658 18.1634 40.3377 18.1634ZM56.2588 20.0061H59.176V3H56.2125V9.96561C55.6569 8.76075 54.3141 7.72127 52.4851 7.72127C49.3058 7.72127 47.099 10.2963 47.099 14.0054C47.099 17.7381 49.3058 20.2896 52.4851 20.2896C54.2678 20.2896 55.68 19.2973 56.2588 18.0925V20.0061ZM56.282 14.218C56.282 16.5569 55.1938 18.0689 53.3185 18.0689C51.3969 18.0689 50.1856 16.486 50.1856 14.0054C50.1856 11.5485 51.3969 9.94198 53.3185 9.94198C55.1938 9.94198 56.282 11.454 56.282 13.7928V14.218ZM60.9066 5.97304H64.0553V3.01996H60.9066V5.97304ZM60.9992 20.0061H63.9627V8.00476H60.9992V20.0061ZM67.6638 20.0061L70.6041 15.8954L73.5212 20.0061H76.9246L72.3636 13.7219L76.5542 8.00476H73.3823L70.7661 11.7138L68.1731 8.00476H64.7697L69.0066 13.8637L64.4919 20.0061H67.6638Z" />

		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M24.9132 20V14.0168H28.7986L32.4513 20H35.7006L31.6894 13.5686C33.5045 12.986 35.0955 11.507 35.0955 9.01961C35.0955 5.7479 32.7994 4 28.9571 4H22V20H24.9132ZM24.9132 6.35294V11.6863H28.821C31.0395 11.6863 32.1599 10.7675 32.1599 9.01961C32.1599 7.27171 30.9395 6.35294 28.621 6.35294H24.9132Z"
		/>

		<path d="M7 23C3.13401 23 0 19.6422 0 15.5C0 11.3578 3.13401 8 7 8V23Z" />

		<path d="M7 0H0V7H7V0Z" />

		<path d="M11.5 7C13.433 7 15 5.433 15 3.5C15 1.567 13.433 0 11.5 0C9.56704 0 8 1.567 8 3.5C8 5.433 9.56704 7 11.5 7Z" />

	</svg>

</Reset>

Table
Column header
Column header
Row header
Cell data
Row header
Cell data
Row header
Cell data

<Reset>

	<table>

		<Reset>

			<caption>Table caption</caption>

		</Reset>



		<Reset>

			<thead>

				<Reset>

					<tr>

						<Reset>

							<th scope="col">Column header</th>

						</Reset>

						<Reset>

							<th scope="col">Column header</th>

						</Reset>

					</tr>

				</Reset>

			</thead>

		</Reset>



		<Reset>

			<tbody>

				<Reset>

					<tr>

						<Reset>

							<th scope="row">Row header</th>

						</Reset>

						<Reset>

							<td>Cell data</td>

						</Reset>

					</tr>

				</Reset>

				<Reset>

					<tr>

						<Reset>

							<th scope="row">Row header</th>

						</Reset>

						<Reset>

							<td>Cell data</td>

						</Reset>

					</tr>

				</Reset>

			</tbody>

		</Reset>



		<Reset>

			<tfoot>

				<Reset>

					<tr>

						<Reset>

							<th scope="row">Row header</th>

						</Reset>

						<Reset>

							<td>Cell data</td>

						</Reset>

					</tr>

				</Reset>

			</tfoot>

		</Reset>

	</table>

</Reset>

Text area
<Reset>

	<textarea placeholder="Text area" />

</Reset>

Time
Time
<Reset>

	<time dateTime="2021-01-01">Time</time>

</Reset>

Unarticulated annotation
Unarticulated annotation
<Reset>

	<u>Unarticulated annotation</u>

</Reset>

Unordered list
Coffee
Tea
Milk
<Reset>

	<ul>

		<li>Coffee</li>

		<li>Tea</li>

		<li>Milk</li>

	</ul>

</Reset>

Variable
Variable
<Reset>

	<var>Variable</var>

</Reset>

Quick nav
API Reference
Examples
Anchor
Abbreviation
Address
Article
Aside
Bold
Bi-directional isolation
Bi-directional override
Block quote
Button
Citation
Code
Data
Deleted text
Details
Definition
Div
Emphasized text
Fieldset
Figure
Figure caption
Footer
Form
Heading
Header
Italic text
Inline frame
Image
Input
Inserted text
Keyboard input
Label
Legend
List item
Main
Marked text
Navigation
Ordered list
Output
Paragraph
Preformatted text
Quote
Strikethrough text
Sample output
Section
Select
Small text
Span
Strong text
Subscript text
Superscript text
SVG
Table
Text area
Time
Unarticulated annotation
Unordered list
Variable
Previous
Portal
Next
Slot
Edit this page on GitHub.
Reset – Radix Themes


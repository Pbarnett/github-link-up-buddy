# React Reference Overview 2

## Document Overview

This extended reference document focuses on the substantial components and DOM hooks available in React:

- **Built-in React DOM Hooks**: Details on using hooks specific to browser environments.
- **Form Management**: Instructions on managing forms and user interactions within React.
- **HTML Components**: Guidance on using HTML components and metadata within React.
- **Server Rendering**: Best practices for rendering React on the server side.

Access the relevant sections as needed for troubleshooting and advanced usage.
API Reference
Built-in React DOM Hooks
The react-dom package contains Hooks that are only supported for web applications (which run in the browser DOM environment). These Hooks are not supported in non-browser environments like iOS, Android, or Windows applications. If you are looking for Hooks that are supported in web browsers and other environments see the React Hooks page. This page lists all the Hooks in the react-dom package.

Form Hooks 
Forms let you create interactive controls for submitting information.  To manage forms in your components, use one of these Hooks:
useFormStatus allows you to make updates to the UI based on the status of a form.
function Form({ action }) {
 async function increment(n) {
   return n + 1;
 }
 const [count, incrementFormAction] = useActionState(increment, 0);
 return (
   <form action={action}>
     <button formAction={incrementFormAction}>Count: {count}</button>
     <Button />
   </form>
 );
}

function Button() {
 const { pending } = useFormStatus();
 return (
   <button disabled={pending} type="submit">
     Submit
   </button>
 );
}
NextuseFormStatus

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Form Hooks
useFormStatus

React DOM Components
React supports all of the browser built-in HTML and SVG components.

Common components 
All of the built-in browser components support some props and events.
Common components (e.g. <div>)
This includes React-specific props like ref and dangerouslySetInnerHTML.

Form components 
These built-in browser components accept user input:
<input>
<select>
<textarea>
They are special in React because passing the value prop to them makes them controlled.

Resource and Metadata Components 
These built-in browser components let you load external resources or annotate the document with metadata:
<link>
<meta>
<script>
<style>
<title>
They are special in React because React can render them into the document head, suspend while resources are loading, and enact other behaviors that are described on the reference page for each specific component.

All HTML components 
React supports all built-in browser HTML components. This includes:
<aside>
<audio>
<b>
<base>
<bdi>
<bdo>
<blockquote>
<body>
<br>
<button>
<canvas>
<caption>
<cite>
<code>
<col>
<colgroup>
<data>
<datalist>
<dd>
<del>
<details>
<dfn>
<dialog>
<div>
<dl>
<dt>
<em>
<embed>
<fieldset>
<figcaption>
<figure>
<footer>
<form>
<h1>
<head>
<header>
<hgroup>
<hr>
<html>
<i>
<iframe>
<img>
<input>
<ins>
<kbd>
<label>
<legend>
<li>
<link>
<main>
<map>
<mark>
<menu>
<meta>
<meter>
<nav>
<noscript>
<object>
<ol>
<optgroup>
<option>
<output>
<p>
<picture>
<pre>
<progress>
<q>
<rp>
<rt>
<ruby>
<s>
<samp>
<script>
<section>
<select>
<slot>
<small>
<source>
<span>
<strong>
<style>
<sub>
<summary>
<sup>
<table>
<tbody>
<td>
<template>
<textarea>
<tfoot>
<th>
<thead>
<time>
<title>
<tr>
<track>
<u>
<ul>
<var>
<video>
<wbr>
Note
Similar to the DOM standard, React uses a camelCase convention for prop names. For example, you’ll write tabIndex instead of tabindex. You can convert existing HTML to JSX with an online converter.

Custom HTML elements 
If you render a tag with a dash, like <my-element>, React will assume you want to render a custom HTML element. In React, rendering custom elements works differently from rendering built-in browser tags:
All custom element props are serialized to strings and are always set using attributes.
Custom elements accept class rather than className, and for rather than htmlFor.
If you render a built-in browser HTML element with an is attribute, it will also be treated as a custom element.
Note
A future version of React will include more comprehensive support for custom elements.
You can try it by upgrading React packages to the most recent experimental version:
react@experimental
react-dom@experimental
Experimental versions of React may contain bugs. Don’t use them in production.

All SVG components 
React supports all built-in browser SVG components. This includes:
<a>
<animate>
<animateMotion>
<animateTransform>
<circle>
<clipPath>
<defs>
<desc>
<discard>
<ellipse>
<feBlend>
<feColorMatrix>
<feComponentTransfer>
<feComposite>
<feConvolveMatrix>
<feDiffuseLighting>
<feDisplacementMap>
<feDistantLight>
<feDropShadow>
<feFlood>
<feFuncA>
<feFuncB>
<feFuncG>
<feFuncR>
<feGaussianBlur>
<feImage>
<feMerge>
<feMergeNode>
<feMorphology>
<feOffset>
<fePointLight>
<feSpecularLighting>
<feSpotLight>
<feTile>
<feTurbulence>
<filter>
<foreignObject>
<g>
<hatch>
<hatchpath>
<image>
<line>
<linearGradient>
<marker>
<mask>
<metadata>
<mpath>
<path>
<pattern>
<polygon>
<polyline>
<radialGradient>
<rect>
<script>
<set>
<stop>
<style>
<svg>
<switch>
<symbol>
<text>
<textPath>
<title>
<tspan>
<use>
<view>
Note
Similar to the DOM standard, React uses a camelCase convention for prop names. For example, you’ll write tabIndex instead of tabindex. You can convert existing SVG to JSX with an online converter.
Namespaced attributes also have to be written without the colon:
xlink:actuate becomes xlinkActuate.
xlink:arcrole becomes xlinkArcrole.
xlink:href becomes xlinkHref.
xlink:role becomes xlinkRole.
xlink:show becomes xlinkShow.
xlink:title becomes xlinkTitle.
xlink:type becomes xlinkType.
xml:base becomes xmlBase.
xml:lang becomes xmlLang.
xml:space becomes xmlSpace.
xmlns:xlink becomes xmlnsXlink.
PrevioususeFormStatus
NextCommon (e.g. <div>)

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Common components
Form components
Resource and Metadata Components
All HTML components
Custom HTML elements
All SVG components
React DOM Components – React
Common components (e.g. <div>)
All built-in browser components, such as <div>, support some common props and events.
Reference
Common components (e.g. <div>)
ref callback function
React event object
AnimationEvent handler function
ClipboardEvent handler function
CompositionEvent handler function
DragEvent handler function
FocusEvent handler function
Event handler function
InputEvent handler function
KeyboardEvent handler function
MouseEvent handler function
PointerEvent handler function
TouchEvent handler function
TransitionEvent handler function
UIEvent handler function
WheelEvent handler function
Usage
Applying CSS styles
Manipulating a DOM node with a ref
Dangerously setting the inner HTML
Handling mouse events
Handling pointer events
Handling focus events
Handling keyboard events

Reference 
Common components (e.g. <div>) 
<div className="wrapper">Some content</div>
See more examples below.
Props 
These special React props are supported for all built-in components:
children: A React node (an element, a string, a number, a portal, an empty node like null, undefined and booleans, or an array of other React nodes). Specifies the content inside the component. When you use JSX, you will usually specify the children prop implicitly by nesting tags like <div><span /></div>.
dangerouslySetInnerHTML: An object of the form { __html: '<p>some html</p>' } with a raw HTML string inside. Overrides the innerHTML property of the DOM node and displays the passed HTML inside. This should be used with extreme caution! If the HTML inside isn’t trusted (for example, if it’s based on user data), you risk introducing an XSS vulnerability. Read more about using dangerouslySetInnerHTML.
ref: A ref object from useRef or createRef, or a ref callback function, or a string for legacy refs. Your ref will be filled with the DOM element for this node. Read more about manipulating the DOM with refs.
suppressContentEditableWarning: A boolean. If true, suppresses the warning that React shows for elements that both have children and contentEditable={true} (which normally do not work together). Use this if you’re building a text input library that manages the contentEditable content manually.
suppressHydrationWarning: A boolean. If you use server rendering, normally there is a warning when the server and the client render different content. In some rare cases (like timestamps), it is very hard or impossible to guarantee an exact match. If you set suppressHydrationWarning to true, React will not warn you about mismatches in the attributes and the content of that element. It only works one level deep, and is intended to be used as an escape hatch. Don’t overuse it. Read about suppressing hydration errors.
style: An object with CSS styles, for example { fontWeight: 'bold', margin: 20 }. Similarly to the DOM style property, the CSS property names need to be written as camelCase, for example fontWeight instead of font-weight. You can pass strings or numbers as values. If you pass a number, like width: 100, React will automatically append px (“pixels”) to the value unless it’s a unitless property. We recommend using style only for dynamic styles where you don’t know the style values ahead of time. In other cases, applying plain CSS classes with className is more efficient. Read more about className and style.
These standard DOM props are also supported for all built-in components:
accessKey: A string. Specifies a keyboard shortcut for the element. Not generally recommended.
aria-*: ARIA attributes let you specify the accessibility tree information for this element. See ARIA attributes for a complete reference. In React, all ARIA attribute names are exactly the same as in HTML.
autoCapitalize: A string. Specifies whether and how the user input should be capitalized.
className: A string. Specifies the element’s CSS class name. Read more about applying CSS styles.
contentEditable: A boolean. If true, the browser lets the user edit the rendered element directly. This is used to implement rich text input libraries like Lexical. React warns if you try to pass React children to an element with contentEditable={true} because React will not be able to update its content after user edits.
data-*: Data attributes let you attach some string data to the element, for example data-fruit="banana". In React, they are not commonly used because you would usually read data from props or state instead.
dir: Either 'ltr' or 'rtl'. Specifies the text direction of the element.
draggable: A boolean. Specifies whether the element is draggable. Part of HTML Drag and Drop API.
enterKeyHint: A string. Specifies which action to present for the enter key on virtual keyboards.
htmlFor: A string. For <label> and <output>, lets you associate the label with some control. Same as for HTML attribute. React uses the standard DOM property names (htmlFor) instead of HTML attribute names.
hidden: A boolean or a string. Specifies whether the element should be hidden.
id: A string. Specifies a unique identifier for this element, which can be used to find it later or connect it with other elements. Generate it with useId to avoid clashes between multiple instances of the same component.
is: A string. If specified, the component will behave like a custom element.
inputMode: A string. Specifies what kind of keyboard to display (for example, text, number or telephone).
itemProp: A string. Specifies which property the element represents for structured data crawlers.
lang: A string. Specifies the language of the element.
onAnimationEnd: An AnimationEvent handler function. Fires when a CSS animation completes.
onAnimationEndCapture: A version of onAnimationEnd that fires in the capture phase.
onAnimationIteration: An AnimationEvent handler function. Fires when an iteration of a CSS animation ends, and another one begins.
onAnimationIterationCapture: A version of onAnimationIteration that fires in the capture phase.
onAnimationStart: An AnimationEvent handler function. Fires when a CSS animation starts.
onAnimationStartCapture: onAnimationStart, but fires in the capture phase.
onAuxClick: A MouseEvent handler function. Fires when a non-primary pointer button was clicked.
onAuxClickCapture: A version of onAuxClick that fires in the capture phase.
onBeforeInput: An InputEvent handler function. Fires before the value of an editable element is modified. React does not yet use the native beforeinput event, and instead attempts to polyfill it using other events.
onBeforeInputCapture: A version of onBeforeInput that fires in the capture phase.
onBlur: A FocusEvent handler function. Fires when an element lost focus. Unlike the built-in browser blur event, in React the onBlur event bubbles.
onBlurCapture: A version of onBlur that fires in the capture phase.
onClick: A MouseEvent handler function. Fires when the primary button was clicked on the pointing device.
onClickCapture: A version of onClick that fires in the capture phase.
onCompositionStart: A CompositionEvent handler function. Fires when an input method editor starts a new composition session.
onCompositionStartCapture: A version of onCompositionStart that fires in the capture phase.
onCompositionEnd: A CompositionEvent handler function. Fires when an input method editor completes or cancels a composition session.
onCompositionEndCapture: A version of onCompositionEnd that fires in the capture phase.
onCompositionUpdate: A CompositionEvent handler function. Fires when an input method editor receives a new character.
onCompositionUpdateCapture: A version of onCompositionUpdate that fires in the capture phase.
onContextMenu: A MouseEvent handler function. Fires when the user tries to open a context menu.
onContextMenuCapture: A version of onContextMenu that fires in the capture phase.
onCopy: A ClipboardEvent handler function. Fires when the user tries to copy something into the clipboard.
onCopyCapture: A version of onCopy that fires in the capture phase.
onCut: A ClipboardEvent handler function. Fires when the user tries to cut something into the clipboard.
onCutCapture: A version of onCut that fires in the capture phase.
onDoubleClick: A MouseEvent handler function. Fires when the user clicks twice. Corresponds to the browser dblclick event.
onDoubleClickCapture: A version of onDoubleClick that fires in the capture phase.
onDrag: A DragEvent handler function. Fires while the user is dragging something.
onDragCapture: A version of onDrag that fires in the capture phase.
onDragEnd: A DragEvent handler function. Fires when the user stops dragging something.
onDragEndCapture: A version of onDragEnd that fires in the capture phase.
onDragEnter: A DragEvent handler function. Fires when the dragged content enters a valid drop target.
onDragEnterCapture: A version of onDragEnter that fires in the capture phase.
onDragOver: A DragEvent handler function. Fires on a valid drop target while the dragged content is dragged over it. You must call e.preventDefault() here to allow dropping.
onDragOverCapture: A version of onDragOver that fires in the capture phase.
onDragStart: A DragEvent handler function. Fires when the user starts dragging an element.
onDragStartCapture: A version of onDragStart that fires in the capture phase.
onDrop: A DragEvent handler function. Fires when something is dropped on a valid drop target.
onDropCapture: A version of onDrop that fires in the capture phase.
onFocus: A FocusEvent handler function. Fires when an element receives focus. Unlike the built-in browser focus event, in React the onFocus event bubbles.
onFocusCapture: A version of onFocus that fires in the capture phase.
onGotPointerCapture: A PointerEvent handler function. Fires when an element programmatically captures a pointer.
onGotPointerCaptureCapture: A version of onGotPointerCapture that fires in the capture phase.
onKeyDown: A KeyboardEvent handler function. Fires when a key is pressed.
onKeyDownCapture: A version of onKeyDown that fires in the capture phase.
onKeyPress: A KeyboardEvent handler function. Deprecated. Use onKeyDown or onBeforeInput instead.
onKeyPressCapture: A version of onKeyPress that fires in the capture phase.
onKeyUp: A KeyboardEvent handler function. Fires when a key is released.
onKeyUpCapture: A version of onKeyUp that fires in the capture phase.
onLostPointerCapture: A PointerEvent handler function. Fires when an element stops capturing a pointer.
onLostPointerCaptureCapture: A version of onLostPointerCapture that fires in the capture phase.
onMouseDown: A MouseEvent handler function. Fires when the pointer is pressed down.
onMouseDownCapture: A version of onMouseDown that fires in the capture phase.
onMouseEnter: A MouseEvent handler function. Fires when the pointer moves inside an element. Does not have a capture phase. Instead, onMouseLeave and onMouseEnter propagate from the element being left to the one being entered.
onMouseLeave: A MouseEvent handler function. Fires when the pointer moves outside an element. Does not have a capture phase. Instead, onMouseLeave and onMouseEnter propagate from the element being left to the one being entered.
onMouseMove: A MouseEvent handler function. Fires when the pointer changes coordinates.
onMouseMoveCapture: A version of onMouseMove that fires in the capture phase.
onMouseOut: A MouseEvent handler function. Fires when the pointer moves outside an element, or if it moves into a child element.
onMouseOutCapture: A version of onMouseOut that fires in the capture phase.
onMouseUp: A MouseEvent handler function. Fires when the pointer is released.
onMouseUpCapture: A version of onMouseUp that fires in the capture phase.
onPointerCancel: A PointerEvent handler function. Fires when the browser cancels a pointer interaction.
onPointerCancelCapture: A version of onPointerCancel that fires in the capture phase.
onPointerDown: A PointerEvent handler function. Fires when a pointer becomes active.
onPointerDownCapture: A version of onPointerDown that fires in the capture phase.
onPointerEnter: A PointerEvent handler function. Fires when a pointer moves inside an element. Does not have a capture phase. Instead, onPointerLeave and onPointerEnter propagate from the element being left to the one being entered.
onPointerLeave: A PointerEvent handler function. Fires when a pointer moves outside an element. Does not have a capture phase. Instead, onPointerLeave and onPointerEnter propagate from the element being left to the one being entered.
onPointerMove: A PointerEvent handler function. Fires when a pointer changes coordinates.
onPointerMoveCapture: A version of onPointerMove that fires in the capture phase.
onPointerOut: A PointerEvent handler function. Fires when a pointer moves outside an element, if the pointer interaction is cancelled, and a few other reasons.
onPointerOutCapture: A version of onPointerOut that fires in the capture phase.
onPointerUp: A PointerEvent handler function. Fires when a pointer is no longer active.
onPointerUpCapture: A version of onPointerUp that fires in the capture phase.
onPaste: A ClipboardEvent handler function. Fires when the user tries to paste something from the clipboard.
onPasteCapture: A version of onPaste that fires in the capture phase.
onScroll: An Event handler function. Fires when an element has been scrolled. This event does not bubble.
onScrollCapture: A version of onScroll that fires in the capture phase.
onSelect: An Event handler function. Fires after the selection inside an editable element like an input changes. React extends the onSelect event to work for contentEditable={true} elements as well. In addition, React extends it to fire for empty selection and on edits (which may affect the selection).
onSelectCapture: A version of onSelect that fires in the capture phase.
onTouchCancel: A TouchEvent handler function. Fires when the browser cancels a touch interaction.
onTouchCancelCapture: A version of onTouchCancel that fires in the capture phase.
onTouchEnd: A TouchEvent handler function. Fires when one or more touch points are removed.
onTouchEndCapture: A version of onTouchEnd that fires in the capture phase.
onTouchMove: A TouchEvent handler function. Fires one or more touch points are moved.
onTouchMoveCapture: A version of onTouchMove that fires in the capture phase.
onTouchStart: A TouchEvent handler function. Fires when one or more touch points are placed.
onTouchStartCapture: A version of onTouchStart that fires in the capture phase.
onTransitionEnd: A TransitionEvent handler function. Fires when a CSS transition completes.
onTransitionEndCapture: A version of onTransitionEnd that fires in the capture phase.
onWheel: A WheelEvent handler function. Fires when the user rotates a wheel button.
onWheelCapture: A version of onWheel that fires in the capture phase.
role: A string. Specifies the element role explicitly for assistive technologies.
slot: A string. Specifies the slot name when using shadow DOM. In React, an equivalent pattern is typically achieved by passing JSX as props, for example <Layout left={<Sidebar />} right={<Content />} />.
spellCheck: A boolean or null. If explicitly set to true or false, enables or disables spellchecking.
tabIndex: A number. Overrides the default Tab button behavior. Avoid using values other than -1 and 0.
title: A string. Specifies the tooltip text for the element.
translate: Either 'yes' or 'no'. Passing 'no' excludes the element content from being translated.
You can also pass custom attributes as props, for example mycustomprop="someValue". This can be useful when integrating with third-party libraries. The custom attribute name must be lowercase and must not start with on. The value will be converted to a string. If you pass null or undefined, the custom attribute will be removed.
These events fire only for the <form> elements:
onReset: An Event handler function. Fires when a form gets reset.
onResetCapture: A version of onReset that fires in the capture phase.
onSubmit: An Event handler function. Fires when a form gets submitted.
onSubmitCapture: A version of onSubmit that fires in the capture phase.
These events fire only for the <dialog> elements. Unlike browser events, they bubble in React:
onCancel: An Event handler function. Fires when the user tries to dismiss the dialog.
onCancelCapture: A version of onCancel that fires in the capture phase.
onClose: An Event handler function. Fires when a dialog has been closed.
onCloseCapture: A version of onClose that fires in the capture phase.
These events fire only for the <details> elements. Unlike browser events, they bubble in React:
onToggle: An Event handler function. Fires when the user toggles the details.
onToggleCapture: A version of onToggle that fires in the capture phase.
These events fire for <img>, <iframe>, <object>, <embed>, <link>, and SVG <image> elements. Unlike browser events, they bubble in React:
onLoad: An Event handler function. Fires when the resource has loaded.
onLoadCapture: A version of onLoad that fires in the capture phase.
onError: An Event handler function. Fires when the resource could not be loaded.
onErrorCapture: A version of onError that fires in the capture phase.
These events fire for resources like <audio> and <video>. Unlike browser events, they bubble in React:
onAbort: An Event handler function. Fires when the resource has not fully loaded, but not due to an error.
onAbortCapture: A version of onAbort that fires in the capture phase.
onCanPlay: An Event handler function. Fires when there’s enough data to start playing, but not enough to play to the end without buffering.
onCanPlayCapture: A version of onCanPlay that fires in the capture phase.
onCanPlayThrough: An Event handler function. Fires when there’s enough data that it’s likely possible to start playing without buffering until the end.
onCanPlayThroughCapture: A version of onCanPlayThrough that fires in the capture phase.
onDurationChange: An Event handler function. Fires when the media duration has updated.
onDurationChangeCapture: A version of onDurationChange that fires in the capture phase.
onEmptied: An Event handler function. Fires when the media has become empty.
onEmptiedCapture: A version of onEmptied that fires in the capture phase.
onEncrypted: An Event handler function. Fires when the browser encounters encrypted media.
onEncryptedCapture: A version of onEncrypted that fires in the capture phase.
onEnded: An Event handler function. Fires when the playback stops because there’s nothing left to play.
onEndedCapture: A version of onEnded that fires in the capture phase.
onError: An Event handler function. Fires when the resource could not be loaded.
onErrorCapture: A version of onError that fires in the capture phase.
onLoadedData: An Event handler function. Fires when the current playback frame has loaded.
onLoadedDataCapture: A version of onLoadedData that fires in the capture phase.
onLoadedMetadata: An Event handler function. Fires when metadata has loaded.
onLoadedMetadataCapture: A version of onLoadedMetadata that fires in the capture phase.
onLoadStart: An Event handler function. Fires when the browser started loading the resource.
onLoadStartCapture: A version of onLoadStart that fires in the capture phase.
onPause: An Event handler function. Fires when the media was paused.
onPauseCapture: A version of onPause that fires in the capture phase.
onPlay: An Event handler function. Fires when the media is no longer paused.
onPlayCapture: A version of onPlay that fires in the capture phase.
onPlaying: An Event handler function. Fires when the media starts or restarts playing.
onPlayingCapture: A version of onPlaying that fires in the capture phase.
onProgress: An Event handler function. Fires periodically while the resource is loading.
onProgressCapture: A version of onProgress that fires in the capture phase.
onRateChange: An Event handler function. Fires when playback rate changes.
onRateChangeCapture: A version of onRateChange that fires in the capture phase.
onResize: An Event handler function. Fires when video changes size.
onResizeCapture: A version of onResize that fires in the capture phase.
onSeeked: An Event handler function. Fires when a seek operation completes.
onSeekedCapture: A version of onSeeked that fires in the capture phase.
onSeeking: An Event handler function. Fires when a seek operation starts.
onSeekingCapture: A version of onSeeking that fires in the capture phase.
onStalled: An Event handler function. Fires when the browser is waiting for data but it keeps not loading.
onStalledCapture: A version of onStalled that fires in the capture phase.
onSuspend: An Event handler function. Fires when loading the resource was suspended.
onSuspendCapture: A version of onSuspend that fires in the capture phase.
onTimeUpdate: An Event handler function. Fires when the current playback time updates.
onTimeUpdateCapture: A version of onTimeUpdate that fires in the capture phase.
onVolumeChange: An Event handler function. Fires when the volume has changed.
onVolumeChangeCapture: A version of onVolumeChange that fires in the capture phase.
onWaiting: An Event handler function. Fires when the playback stopped due to temporary lack of data.
onWaitingCapture: A version of onWaiting that fires in the capture phase.
Caveats 
You cannot pass both children and dangerouslySetInnerHTML at the same time.
Some events (like onAbort and onLoad) don’t bubble in the browser, but bubble in React.

ref callback function 
Instead of a ref object (like the one returned by useRef), you may pass a function to the ref attribute.
<div ref={(node) => {
 console.log('Attached', node);

 return () => {
   console.log('Clean up', node)
 }
}}>
See an example of using the ref callback.
When the <div> DOM node is added to the screen, React will call your ref callback with the DOM node as the argument. When that <div> DOM node is removed, React will call your the cleanup function returned from the callback.
React will also call your ref callback whenever you pass a different ref callback. In the above example, (node) => { ... } is a different function on every render. When your component re-renders, the previous function will be called with null as the argument, and the next function will be called with the DOM node.
Parameters 
node: A DOM node. React will pass you the DOM node when the ref gets attached. Unless you pass the same function reference for the ref callback on every render, the callback will get temporarily cleanup and re-create during every re-render of the component.
Note
React 19 added cleanup functions for ref callbacks. 
To support backwards compatibility, if a cleanup function is not returned from the ref callback, node will be called with null when the ref is detached. This behavior will be removed in a future version.
Returns 
optional cleanup function: When the ref is detached, React will call the cleanup function. If a function is not returned by the ref callback, React will call the callback again with null as the argument when the ref gets detached. This behavior will be removed in a future version.
Caveats 
When Strict Mode is on, React will run one extra development-only setup+cleanup cycle before the first real setup. This is a stress-test that ensures that your cleanup logic “mirrors” your setup logic and that it stops or undoes whatever the setup is doing. If this causes a problem, implement the cleanup function.
When you pass a different ref callback, React will call the previous callback’s cleanup function if provided. If no cleanup function is defined, the ref callback will be called with null as the argument. The next function will be called with the DOM node.

React event object 
Your event handlers will receive a React event object. It is also sometimes known as a “synthetic event”.
<button onClick={e => {
 console.log(e); // React event object
}} />
It conforms to the same standard as the underlying DOM events, but fixes some browser inconsistencies.
Some React events do not map directly to the browser’s native events. For example in onMouseLeave, e.nativeEvent will point to a mouseout event. The specific mapping is not part of the public API and may change in the future. If you need the underlying browser event for some reason, read it from e.nativeEvent.
Properties 
React event objects implement some of the standard Event properties:
bubbles: A boolean. Returns whether the event bubbles through the DOM.
cancelable: A boolean. Returns whether the event can be canceled.
currentTarget: A DOM node. Returns the node to which the current handler is attached in the React tree.
defaultPrevented: A boolean. Returns whether preventDefault was called.
eventPhase: A number. Returns which phase the event is currently in.
isTrusted: A boolean. Returns whether the event was initiated by user.
target: A DOM node. Returns the node on which the event has occurred (which could be a distant child).
timeStamp: A number. Returns the time when the event occurred.
Additionally, React event objects provide these properties:
nativeEvent: A DOM Event. The original browser event object.
Methods 
React event objects implement some of the standard Event methods:
preventDefault(): Prevents the default browser action for the event.
stopPropagation(): Stops the event propagation through the React tree.
Additionally, React event objects provide these methods:
isDefaultPrevented(): Returns a boolean value indicating whether preventDefault was called.
isPropagationStopped(): Returns a boolean value indicating whether stopPropagation was called.
persist(): Not used with React DOM. With React Native, call this to read event’s properties after the event.
isPersistent(): Not used with React DOM. With React Native, returns whether persist has been called.
Caveats 
The values of currentTarget, eventPhase, target, and type reflect the values your React code expects. Under the hood, React attaches event handlers at the root, but this is not reflected in React event objects. For example, e.currentTarget may not be the same as the underlying e.nativeEvent.currentTarget. For polyfilled events, e.type (React event type) may differ from e.nativeEvent.type (underlying type).

AnimationEvent handler function 
An event handler type for the CSS animation events.
<div
 onAnimationStart={e => console.log('onAnimationStart')}
 onAnimationIteration={e => console.log('onAnimationIteration')}
 onAnimationEnd={e => console.log('onAnimationEnd')}
/>
Parameters 
e: A React event object with these extra AnimationEvent properties:
animationName
elapsedTime
pseudoElement

ClipboardEvent handler function 
An event handler type for the Clipboard API events.
<input
 onCopy={e => console.log('onCopy')}
 onCut={e => console.log('onCut')}
 onPaste={e => console.log('onPaste')}
/>
Parameters 
e: A React event object with these extra ClipboardEvent properties:
clipboardData

CompositionEvent handler function 
An event handler type for the input method editor (IME) events.
<input
 onCompositionStart={e => console.log('onCompositionStart')}
 onCompositionUpdate={e => console.log('onCompositionUpdate')}
 onCompositionEnd={e => console.log('onCompositionEnd')}
/>
Parameters 
e: A React event object with these extra CompositionEvent properties:
data

DragEvent handler function 
An event handler type for the HTML Drag and Drop API events.
<>
 <div
   draggable={true}
   onDragStart={e => console.log('onDragStart')}
   onDragEnd={e => console.log('onDragEnd')}
 >
   Drag source
 </div>

 <div
   onDragEnter={e => console.log('onDragEnter')}
   onDragLeave={e => console.log('onDragLeave')}
   onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
   onDrop={e => console.log('onDrop')}
 >
   Drop target
 </div>
</>
Parameters 
e: A React event object with these extra DragEvent properties:
dataTransfer
It also includes the inherited MouseEvent properties:
altKey
button
buttons
ctrlKey
clientX
clientY
getModifierState(key)
metaKey
movementX
movementY
pageX
pageY
relatedTarget
screenX
screenY
shiftKey
It also includes the inherited UIEvent properties:
detail
view

FocusEvent handler function 
An event handler type for the focus events.
<input
 onFocus={e => console.log('onFocus')}
 onBlur={e => console.log('onBlur')}
/>
See an example.
Parameters 
e: A React event object with these extra FocusEvent properties:
relatedTarget
It also includes the inherited UIEvent properties:
detail
view

Event handler function 
An event handler type for generic events.
Parameters 
e: A React event object with no additional properties.

InputEvent handler function 
An event handler type for the onBeforeInput event.
<input onBeforeInput={e => console.log('onBeforeInput')} />
Parameters 
e: A React event object with these extra InputEvent properties:
data

KeyboardEvent handler function 
An event handler type for keyboard events.
<input
 onKeyDown={e => console.log('onKeyDown')}
 onKeyUp={e => console.log('onKeyUp')}
/>
See an example.
Parameters 
e: A React event object with these extra KeyboardEvent properties:
altKey
charCode
code
ctrlKey
getModifierState(key)
key
keyCode
locale
metaKey
location
repeat
shiftKey
which
It also includes the inherited UIEvent properties:
detail
view

MouseEvent handler function 
An event handler type for mouse events.
<div
 onClick={e => console.log('onClick')}
 onMouseEnter={e => console.log('onMouseEnter')}
 onMouseOver={e => console.log('onMouseOver')}
 onMouseDown={e => console.log('onMouseDown')}
 onMouseUp={e => console.log('onMouseUp')}
 onMouseLeave={e => console.log('onMouseLeave')}
/>
See an example.
Parameters 
e: A React event object with these extra MouseEvent properties:
altKey
button
buttons
ctrlKey
clientX
clientY
getModifierState(key)
metaKey
movementX
movementY
pageX
pageY
relatedTarget
screenX
screenY
shiftKey
It also includes the inherited UIEvent properties:
detail
view

PointerEvent handler function 
An event handler type for pointer events.
<div
 onPointerEnter={e => console.log('onPointerEnter')}
 onPointerMove={e => console.log('onPointerMove')}
 onPointerDown={e => console.log('onPointerDown')}
 onPointerUp={e => console.log('onPointerUp')}
 onPointerLeave={e => console.log('onPointerLeave')}
/>
See an example.
Parameters 
e: A React event object with these extra PointerEvent properties:
height
isPrimary
pointerId
pointerType
pressure
tangentialPressure
tiltX
tiltY
twist
width
It also includes the inherited MouseEvent properties:
altKey
button
buttons
ctrlKey
clientX
clientY
getModifierState(key)
metaKey
movementX
movementY
pageX
pageY
relatedTarget
screenX
screenY
shiftKey
It also includes the inherited UIEvent properties:
detail
view

TouchEvent handler function 
An event handler type for touch events.
<div
 onTouchStart={e => console.log('onTouchStart')}
 onTouchMove={e => console.log('onTouchMove')}
 onTouchEnd={e => console.log('onTouchEnd')}
 onTouchCancel={e => console.log('onTouchCancel')}
/>
Parameters 
e: A React event object with these extra TouchEvent properties:
altKey
ctrlKey
changedTouches
getModifierState(key)
metaKey
shiftKey
touches
targetTouches
It also includes the inherited UIEvent properties:
detail
view

TransitionEvent handler function 
An event handler type for the CSS transition events.
<div
 onTransitionEnd={e => console.log('onTransitionEnd')}
/>
Parameters 
e: A React event object with these extra TransitionEvent properties:
elapsedTime
propertyName
pseudoElement

UIEvent handler function 
An event handler type for generic UI events.
<div
 onScroll={e => console.log('onScroll')}
/>
Parameters 
e: A React event object with these extra UIEvent properties:
detail
view

WheelEvent handler function 
An event handler type for the onWheel event.
<div
 onWheel={e => console.log('onWheel')}
/>
Parameters 
e: A React event object with these extra WheelEvent properties:
deltaMode
deltaX
deltaY
deltaZ
It also includes the inherited MouseEvent properties:
altKey
button
buttons
ctrlKey
clientX
clientY
getModifierState(key)
metaKey
movementX
movementY
pageX
pageY
relatedTarget
screenX
screenY
shiftKey
It also includes the inherited UIEvent properties:
detail
view

Usage 
Applying CSS styles 
In React, you specify a CSS class with className. It works like the class attribute in HTML:
<img className="avatar" />
Then you write the CSS rules for it in a separate CSS file:
/* In your CSS */
.avatar {
 border-radius: 50%;
}
React does not prescribe how you add CSS files. In the simplest case, you’ll add a <link> tag to your HTML. If you use a build tool or a framework, consult its documentation to learn how to add a CSS file to your project.
Sometimes, the style values depend on data. Use the style attribute to pass some styles dynamically:
<img
 className="avatar"
 style={{
   width: user.imageSize,
   height: user.imageSize
 }}
/>
In the above example, style={{}} is not a special syntax, but a regular {} object inside the style={ } JSX curly braces. We recommend only using the style attribute when your styles depend on JavaScript variables.
App.jsAvatar.js
Reset
Fork
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}


Deep Dive
How to apply multiple CSS classes conditionally? 
Show Details





















Manipulating a DOM node with a ref 
Sometimes, you’ll need to get the browser DOM node associated with a tag in JSX. For example, if you want to focus an <input> when a button is clicked, you need to call focus() on the browser <input> DOM node.
To obtain the browser DOM node for a tag, declare a ref and pass it as the ref attribute to that tag:
import { useRef } from 'react';

export default function Form() {
 const inputRef = useRef(null);
 // ...
 return (
   <input ref={inputRef} />
   // ...
React will put the DOM node into inputRef.current after it’s been rendered to the screen.
App.js
DownloadReset
Fork
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}


Show more
Read more about manipulating DOM with refs and check out more examples.
For more advanced use cases, the ref attribute also accepts a callback function.

Dangerously setting the inner HTML 
You can pass a raw HTML string to an element like so:
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
This is dangerous. As with the underlying DOM innerHTML property, you must exercise extreme caution! Unless the markup is coming from a completely trusted source, it is trivial to introduce an XSS vulnerability this way.
For example, if you use a Markdown library that converts Markdown to HTML, you trust that its parser doesn’t contain bugs, and the user only sees their own input, you can display the resulting HTML like this:
package.jsonApp.jsMarkdownPreview.js
Reset
Fork
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // This is ONLY safe because the output HTML
  // is shown to the same user, and because you
  // trust this Markdown parser to not have bugs.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}


Show more
The {__html} object should be created as close to where the HTML is generated as possible, like the above example does in the renderMarkdownToHTML function. This ensures that all raw HTML being used in your code is explicitly marked as such, and that only variables that you expect to contain HTML are passed to dangerouslySetInnerHTML. It is not recommended to create the object inline like <div dangerouslySetInnerHTML={{__html: markup}} />.
To see why rendering arbitrary HTML is dangerous, replace the code above with this:
const post = {
 // Imagine this content is stored in the database.
 content: `<img src="" onerror='alert("you were hacked")'>`
};

export default function MarkdownPreview() {
 // 🔴 SECURITY HOLE: passing untrusted input to dangerouslySetInnerHTML
 const markup = { __html: post.content };
 return <div dangerouslySetInnerHTML={markup} />;
}
The code embedded in the HTML will run. A hacker could use this security hole to steal user information or to perform actions on their behalf. Only use dangerouslySetInnerHTML with trusted and sanitized data.

Handling mouse events 
This example shows some common mouse events and when they fire.
App.js
DownloadReset
Fork
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (first button)')}
        onMouseDown={e => console.log('onMouseDown (first button)')}
        onMouseEnter={e => console.log('onMouseEnter (first button)')}
        onMouseLeave={e => console.log('onMouseLeave (first button)')}
        onMouseOver={e => console.log('onMouseOver (first button)')}
        onMouseUp={e => console.log('onMouseUp (first button)')}
      >
        First button
      </button>
      <button
        onClick={e => console.log('onClick (second button)')}
        onMouseDown={e => console.log('onMouseDown (second button)')}
        onMouseEnter={e => console.log('onMouseEnter (second button)')}
        onMouseLeave={e => console.log('onMouseLeave (second button)')}
        onMouseOver={e => console.log('onMouseOver (second button)')}
        onMouseUp={e => console.log('onMouseUp (second button)')}
      >
        Second button
      </button>
    </div>
  );
}


Show more

Handling pointer events 
This example shows some common pointer events and when they fire.
App.js
DownloadReset
Fork
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (first child)')}
        onPointerEnter={e => console.log('onPointerEnter (first child)')}
        onPointerLeave={e => console.log('onPointerLeave (first child)')}
        onPointerMove={e => console.log('onPointerMove (first child)')}
        onPointerUp={e => console.log('onPointerUp (first child)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        First child
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (second child)')}
        onPointerEnter={e => console.log('onPointerEnter (second child)')}
        onPointerLeave={e => console.log('onPointerLeave (second child)')}
        onPointerMove={e => console.log('onPointerMove (second child)')}
        onPointerUp={e => console.log('onPointerUp (second child)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Second child
      </div>
    </div>
  );
}


Show more

Handling focus events 
In React, focus events bubble. You can use the currentTarget and relatedTarget to differentiate if the focusing or blurring events originated from outside of the parent element. The example shows how to detect focusing a child, focusing the parent element, and how to detect focus entering or leaving the whole subtree.
App.js
DownloadReset
Fork
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left parent');
        }
      }}
    >
      <label>
        First name:
        <input name="firstName" />
      </label>
      <label>
        Last name:
        <input name="lastName" />
      </label>
    </div>
  );
}


Show more

Handling keyboard events 
This example shows some common keyboard events and when they fire.
App.js
DownloadReset
Fork
export default function KeyboardExample() {
  return (
    <label>
      First name:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}


PreviousComponents
Next<form>

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
Common components (e.g. <div>)
ref callback function
React event object
AnimationEvent handler function
ClipboardEvent handler function
CompositionEvent handler function
DragEvent handler function
FocusEvent handler function
Event handler function
InputEvent handler function
KeyboardEvent handler function
MouseEvent handler function
PointerEvent handler function
TouchEvent handler function
TransitionEvent handler function
UIEvent handler function
WheelEvent handler function
Usage
Applying CSS styles
Manipulating a DOM node with a ref
Dangerously setting the inner HTML
Handling mouse events
Handling pointer events
Handling focus events
Handling keyboard events
Common components (e.g. <div>) – React
<form>
The built-in browser <form> component lets you create interactive controls for submitting information.
<form action={search}>
   <input name="query" />
   <button type="submit">Search</button>
</form>
Reference
<form>
Usage
Handle form submission on the client
Handle form submission with a Server Function
Display a pending state during form submission
Optimistically updating form data
Handling form submission errors
Display a form submission error without JavaScript
Handling multiple submission types

Reference 
<form> 
To create interactive controls for submitting information, render the built-in browser <form> component.
<form action={search}>
   <input name="query" />
   <button type="submit">Search</button>
</form>
See more examples below.
Props 
<form> supports all common element props.
action: a URL or function. When a URL is passed to action the form will behave like the HTML form component. When a function is passed to action the function will handle the form submission. The function passed to action may be async and will be called with a single argument containing the form data of the submitted form. The action prop can be overridden by a formAction attribute on a <button>, <input type="submit">, or <input type="image"> component.
Caveats 
When a function is passed to action or formAction the HTTP method will be POST regardless of value of the method prop.

Usage 
Handle form submission on the client 
Pass a function to the action prop of form to run the function when the form is submitted. formData will be passed to the function as an argument so you can access the data submitted by the form. This differs from the conventional HTML action, which only accepts URLs. After the action function succeeds, all uncontrolled field elements in the form are reset.
App.js
DownloadReset
Fork
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}


Handle form submission with a Server Function 
Render a <form> with an input and submit button. Pass a Server Function (a function marked with 'use server') to the action prop of form to run the function when the form is submitted.
Passing a Server Function to <form action> allow users to submit forms without JavaScript enabled or before the code has loaded. This is beneficial to users who have a slow connection, device, or have JavaScript disabled and is similar to the way forms work when a URL is passed to the action prop.
You can use hidden form fields to provide data to the <form>’s action. The Server Function will be called with the hidden form field data as an instance of FormData.
import { updateCart } from './lib.js';

function AddToCart({productId}) {
 async function addToCart(formData) {
   'use server'
   const productId = formData.get('productId')
   await updateCart(productId)
 }
 return (
   <form action={addToCart}>
       <input type="hidden" name="productId" value={productId} />
       <button type="submit">Add to Cart</button>
   </form>

 );
}
In lieu of using hidden form fields to provide data to the <form>’s action, you can call the bind method to supply it with extra arguments. This will bind a new argument (productId) to the function in addition to the formData that is passed as an argument to the function.
import { updateCart } from './lib.js';

function AddToCart({productId}) {
 async function addToCart(productId, formData) {
   "use server";
   await updateCart(productId)
 }
 const addProductToCart = addToCart.bind(null, productId);
 return (
   <form action={addProductToCart}>
     <button type="submit">Add to Cart</button>
   </form>
 );
}
When <form> is rendered by a Server Component, and a Server Function is passed to the <form>’s action prop, the form is progressively enhanced.
Display a pending state during form submission 
To display a pending state when a form is being submitted, you can call the useFormStatus Hook in a component rendered in a <form> and read the pending property returned.
Here, we use the pending property to indicate the form is submitting.
App.js
Reset
Fork
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}


Show more
To learn more about the useFormStatus Hook see the reference documentation.
Optimistically updating form data 
The useOptimistic Hook provides a way to optimistically update the user interface before a background operation, like a network request, completes. In the context of forms, this technique helps to make apps feel more responsive. When a user submits a form, instead of waiting for the server’s response to reflect the changes, the interface is immediately updated with the expected outcome.
For example, when a user types a message into the form and hits the “Send” button, the useOptimistic Hook allows the message to immediately appear in the list with a “Sending…” label, even before the message is actually sent to a server. This “optimistic” approach gives the impression of speed and responsiveness. The form then attempts to truly send the message in the background. Once the server confirms the message has been received, the “Sending…” label is removed.
App.jsactions.js
Reset
Fork
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}


Show more
Handling form submission errors 
In some cases the function called by a <form>’s action prop throws an error. You can handle these errors by wrapping <form> in an Error Boundary. If the function called by a <form>’s action prop throws an error, the fallback for the error boundary will be displayed.
App.js
Reset
Fork
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("search error");
  }
  return (
    <ErrorBoundary
      fallback={<p>There was an error while submitting the form</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>
  );
}


Show more
Display a form submission error without JavaScript 
Displaying a form submission error message before the JavaScript bundle loads for progressive enhancement requires that:
<form> be rendered by a Server Component
the function passed to the <form>’s action prop be a Server Function
the useActionState Hook be used to display the error message
useActionState takes two parameters: a Server Function and an initial state. useActionState returns two values, a state variable and an action. The action returned by useActionState should be passed to the action prop of the form. The state variable returned by useActionState can be used to display an error message. The value returned by the Server Function passed to useActionState will be used to update the state variable.
App.js
Reset
Fork
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`Added "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}


Show more
Learn more about updating state from a form action with the useActionState docs
Handling multiple submission types 
Forms can be designed to handle multiple submission actions based on the button pressed by the user. Each button inside a form can be associated with a distinct action or behavior by setting the formAction prop.
When a user taps a specific button, the form is submitted, and a corresponding action, defined by that button’s attributes and action, is executed. For instance, a form might submit an article for review by default but have a separate button with formAction set to save the article as a draft.
App.js
DownloadReset
Fork
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' was published with the '${button}' button`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Your draft of '${content}' has been saved!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}


Show more
PreviousCommon (e.g. <div>)
Next<input>

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
<form>
Usage
Handle form submission on the client
Handle form submission with a Server Function
Display a pending state during form submission
Optimistically updating form data
Handling form submission errors
Display a form submission error without JavaScript
Handling multiple submission types
<form> – React
<input>
The built-in browser <input> component lets you render different kinds of form inputs.
<input />
Reference
<input>
Usage
Displaying inputs of different types
Providing a label for an input
Providing an initial value for an input
Reading the input values when submitting a form
Controlling an input with a state variable
Optimizing re-rendering on every keystroke
Troubleshooting
My text input doesn’t update when I type into it
My checkbox doesn’t update when I click on it
My input caret jumps to the beginning on every keystroke
I’m getting an error: “A component is changing an uncontrolled input to be controlled”

Reference 
<input> 
To display an input, render the built-in browser <input> component.
<input name="myInput" />
See more examples below.
Props 
<input> supports all common element props.
formAction: A string or function. Overrides the parent <form action> for type="submit" and type="image". When a URL is passed to action the form will behave like a standard HTML form. When a function is passed to formAction the function will handle the form submission. See <form action>.
You can make an input controlled by passing one of these props:
checked: A boolean. For a checkbox input or a radio button, controls whether it is selected.
value: A string. For a text input, controls its text. (For a radio button, specifies its form data.)
When you pass either of them, you must also pass an onChange handler that updates the passed value.
These <input> props are only relevant for uncontrolled inputs:
defaultChecked: A boolean. Specifies the initial value for type="checkbox" and type="radio" inputs.
defaultValue: A string. Specifies the initial value for a text input.
These <input> props are relevant both for uncontrolled and controlled inputs:
accept: A string. Specifies which filetypes are accepted by a type="file" input.
alt: A string. Specifies the alternative image text for a type="image" input.
capture: A string. Specifies the media (microphone, video, or camera) captured by a type="file" input.
autoComplete: A string. Specifies one of the possible autocomplete behaviors.
autoFocus: A boolean. If true, React will focus the element on mount.
dirname: A string. Specifies the form field name for the element’s directionality.
disabled: A boolean. If true, the input will not be interactive and will appear dimmed.
children: <input> does not accept children.
form: A string. Specifies the id of the <form> this input belongs to. If omitted, it’s the closest parent form.
formAction: A string. Overrides the parent <form action> for type="submit" and type="image".
formEnctype: A string. Overrides the parent <form enctype> for type="submit" and type="image".
formMethod: A string. Overrides the parent <form method> for type="submit" and type="image".
formNoValidate: A string. Overrides the parent <form noValidate> for type="submit" and type="image".
formTarget: A string. Overrides the parent <form target> for type="submit" and type="image".
height: A string. Specifies the image height for type="image".
list: A string. Specifies the id of the <datalist> with the autocomplete options.
max: A number. Specifies the maximum value of numerical and datetime inputs.
maxLength: A number. Specifies the maximum length of text and other inputs.
min: A number. Specifies the minimum value of numerical and datetime inputs.
minLength: A number. Specifies the minimum length of text and other inputs.
multiple: A boolean. Specifies whether multiple values are allowed for <type="file" and type="email".
name: A string. Specifies the name for this input that’s submitted with the form.
onChange: An Event handler function. Required for controlled inputs. Fires immediately when the input’s value is changed by the user (for example, it fires on every keystroke). Behaves like the browser input event.
onChangeCapture: A version of onChange that fires in the capture phase.
onInput: An Event handler function. Fires immediately when the value is changed by the user. For historical reasons, in React it is idiomatic to use onChange instead which works similarly.
onInputCapture: A version of onInput that fires in the capture phase.
onInvalid: An Event handler function. Fires if an input fails validation on form submit. Unlike the built-in invalid event, the React onInvalid event bubbles.
onInvalidCapture: A version of onInvalid that fires in the capture phase.
onSelect: An Event handler function. Fires after the selection inside the <input> changes. React extends the onSelect event to also fire for empty selection and on edits (which may affect the selection).
onSelectCapture: A version of onSelect that fires in the capture phase.
pattern: A string. Specifies the pattern that the value must match.
placeholder: A string. Displayed in a dimmed color when the input value is empty.
readOnly: A boolean. If true, the input is not editable by the user.
required: A boolean. If true, the value must be provided for the form to submit.
size: A number. Similar to setting width, but the unit depends on the control.
src: A string. Specifies the image source for a type="image" input.
step: A positive number or an 'any' string. Specifies the distance between valid values.
type: A string. One of the input types.
width: A string. Specifies the image width for a type="image" input.
Caveats 
Checkboxes need checked (or defaultChecked), not value (or defaultValue).
If a text input receives a string value prop, it will be treated as controlled.
If a checkbox or a radio button receives a boolean checked prop, it will be treated as controlled.
An input can’t be both controlled and uncontrolled at the same time.
An input cannot switch between being controlled or uncontrolled over its lifetime.
Every controlled input needs an onChange event handler that synchronously updates its backing value.

Usage 
Displaying inputs of different types 
To display an input, render an <input> component. By default, it will be a text input. You can pass type="checkbox" for a checkbox, type="radio" for a radio button, or one of the other input types.
App.js
DownloadReset
Fork
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}


Show more

Providing a label for an input 
Typically, you will place every <input> inside a <label> tag. This tells the browser that this label is associated with that input. When the user clicks the label, the browser will automatically focus the input. It’s also essential for accessibility: a screen reader will announce the label caption when the user focuses the associated input.
If you can’t nest <input> into a <label>, associate them by passing the same ID to <input id> and <label htmlFor>. To avoid conflicts between multiple instances of one component, generate such an ID with useId.
App.js
DownloadReset
Fork
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Your first name:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Your age:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}


Show more

Providing an initial value for an input 
You can optionally specify the initial value for any input. Pass it as the defaultValue string for text inputs. Checkboxes and radio buttons should specify the initial value with the defaultChecked boolean instead.
App.js
DownloadReset
Fork
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true} 
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}


Show more

Reading the input values when submitting a form 
Add a <form> around your inputs with a <button type="submit"> inside. It will call your <form onSubmit> event handler. By default, the browser will send the form data to the current URL and refresh the page. You can override that behavior by calling e.preventDefault(). Read the form data with new FormData(e.target).
App.js
DownloadReset
Fork
export default function MyForm() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Submit form</button>
    </form>
  );
}


Show more
Note
Give a name to every <input>, for example <input name="firstName" defaultValue="Taylor" />. The name you specified will be used as a key in the form data, for example { firstName: "Taylor" }.
Pitfall
By default, a <button> inside a <form> without a type attribute will submit it. This can be surprising! If you have your own custom Button React component, consider using <button type="button"> instead of <button> (with no type). Then, to be explicit, use <button type="submit"> for buttons that are supposed to submit the form.

Controlling an input with a state variable 
An input like <input /> is uncontrolled. Even if you pass an initial value like <input defaultValue="Initial text" />, your JSX only specifies the initial value. It does not control what the value should be right now.
To render a controlled input, pass the value prop to it (or checked for checkboxes and radios). React will force the input to always have the value you passed. Usually, you would do this by declaring a state variable:
function Form() {
 const [firstName, setFirstName] = useState(''); // Declare a state variable...
 // ...
 return (
   <input
     value={firstName} // ...force the input's value to match the state variable...
     onChange={e => setFirstName(e.target.value)} // ... and update the state variable on any edits!
   />
 );
}
A controlled input makes sense if you needed state anyway—for example, to re-render your UI on every edit:
function Form() {
 const [firstName, setFirstName] = useState('');
 return (
   <>
     <label>
       First name:
       <input value={firstName} onChange={e => setFirstName(e.target.value)} />
     </label>
     {firstName !== '' && <p>Your name is {firstName}.</p>}
     ...
It’s also useful if you want to offer multiple ways to adjust the input state (for example, by clicking a button):
function Form() {
 // ...
 const [age, setAge] = useState('');
 const ageAsNumber = Number(age);
 return (
   <>
     <label>
       Age:
       <input
         value={age}
         onChange={e => setAge(e.target.value)}
         type="number"
       />
       <button onClick={() => setAge(ageAsNumber + 10)}>
         Add 10 years
       </button>
The value you pass to controlled components should not be undefined or null. If you need the initial value to be empty (such as with the firstName field below), initialize your state variable to an empty string ('').
App.js
DownloadReset
Fork
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        First name:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
      </label>
      {firstName !== '' &&
        <p>Your name is {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Your age is {ageAsNumber}.</p>
      }
    </>
  );
}


Show more
Pitfall
If you pass value without onChange, it will be impossible to type into the input. When you control an input by passing some value to it, you force it to always have the value you passed. So if you pass a state variable as a value but forget to update that state variable synchronously during the onChange event handler, React will revert the input after every keystroke back to the value that you specified.

Optimizing re-rendering on every keystroke 
When you use a controlled input, you set the state on every keystroke. If the component containing your state re-renders a large tree, this can get slow. There’s a few ways you can optimize re-rendering performance.
For example, suppose you start with a form that re-renders all page content on every keystroke:
function App() {
 const [firstName, setFirstName] = useState('');
 return (
   <>
     <form>
       <input value={firstName} onChange={e => setFirstName(e.target.value)} />
     </form>
     <PageContent />
   </>
 );
}
Since <PageContent /> doesn’t rely on the input state, you can move the input state into its own component:
function App() {
 return (
   <>
     <SignupForm />
     <PageContent />
   </>
 );
}

function SignupForm() {
 const [firstName, setFirstName] = useState('');
 return (
   <form>
     <input value={firstName} onChange={e => setFirstName(e.target.value)} />
   </form>
 );
}
This significantly improves performance because now only SignupForm re-renders on every keystroke.
If there is no way to avoid re-rendering (for example, if PageContent depends on the search input’s value), useDeferredValue lets you keep the controlled input responsive even in the middle of a large re-render.

Troubleshooting 
My text input doesn’t update when I type into it 
If you render an input with value but no onChange, you will see an error in the console:
// 🔴 Bug: controlled text input with no onChange handler
<input value={something} />
Console
You provided a value prop to a form field without an onChange handler. This will render a read-only field. If the field should be mutable use defaultValue. Otherwise, set either onChange or readOnly.
As the error message suggests, if you only wanted to specify the initial value, pass defaultValue instead:
// ✅ Good: uncontrolled input with an initial value
<input defaultValue={something} />
If you want to control this input with a state variable, specify an onChange handler:
// ✅ Good: controlled input with onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
If the value is intentionally read-only, add a readOnly prop to suppress the error:
// ✅ Good: readonly controlled input without on change
<input value={something} readOnly={true} />

My checkbox doesn’t update when I click on it 
If you render a checkbox with checked but no onChange, you will see an error in the console:
// 🔴 Bug: controlled checkbox with no onChange handler
<input type="checkbox" checked={something} />
Console
You provided a checked prop to a form field without an onChange handler. This will render a read-only field. If the field should be mutable use defaultChecked. Otherwise, set either onChange or readOnly.
As the error message suggests, if you only wanted to specify the initial value, pass defaultChecked instead:
// ✅ Good: uncontrolled checkbox with an initial value
<input type="checkbox" defaultChecked={something} />
If you want to control this checkbox with a state variable, specify an onChange handler:
// ✅ Good: controlled checkbox with onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
Pitfall
You need to read e.target.checked rather than e.target.value for checkboxes.
If the checkbox is intentionally read-only, add a readOnly prop to suppress the error:
// ✅ Good: readonly controlled input without on change
<input type="checkbox" checked={something} readOnly={true} />

My input caret jumps to the beginning on every keystroke 
If you control an input, you must update its state variable to the input’s value from the DOM during onChange.
You can’t update it to something other than e.target.value (or e.target.checked for checkboxes):
function handleChange(e) {
 // 🔴 Bug: updating an input to something other than e.target.value
 setFirstName(e.target.value.toUpperCase());
}
You also can’t update it asynchronously:
function handleChange(e) {
 // 🔴 Bug: updating an input asynchronously
 setTimeout(() => {
   setFirstName(e.target.value);
 }, 100);
}
To fix your code, update it synchronously to e.target.value:
function handleChange(e) {
 // ✅ Updating a controlled input to e.target.value synchronously
 setFirstName(e.target.value);
}
If this doesn’t fix the problem, it’s possible that the input gets removed and re-added from the DOM on every keystroke. This can happen if you’re accidentally resetting state on every re-render, for example if the input or one of its parents always receives a different key attribute, or if you nest component function definitions (which is not supported and causes the “inner” component to always be considered a different tree).

I’m getting an error: “A component is changing an uncontrolled input to be controlled” 
If you provide a value to the component, it must remain a string throughout its lifetime.
You cannot pass value={undefined} first and later pass value="some string" because React won’t know whether you want the component to be uncontrolled or controlled. A controlled component should always receive a string value, not null or undefined.
If your value is coming from an API or a state variable, it might be initialized to null or undefined. In that case, either set it to an empty string ('') initially, or pass value={someValue ?? ''} to ensure value is a string.
Similarly, if you pass checked to a checkbox, ensure it’s always a boolean.
Previous<form>
Next<option>

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
<input>
Usage
Displaying inputs of different types
Providing a label for an input
Providing an initial value for an input
Reading the input values when submitting a form
Controlling an input with a state variable
Optimizing re-rendering on every keystroke
Troubleshooting
My text input doesn’t update when I type into it
My checkbox doesn’t update when I click on it
My input caret jumps to the beginning on every keystroke
I’m getting an error: “A component is changing an uncontrolled input to be controlled”
<input> – React
<option>
The built-in browser <option> component lets you render an option inside a <select> box.
<select>
 <option value="someOption">Some option</option>
 <option value="otherOption">Other option</option>
</select>
Reference
<option>
Usage
Displaying a select box with options

Reference 
<option> 
The built-in browser <option> component lets you render an option inside a <select> box.
<select>
 <option value="someOption">Some option</option>
 <option value="otherOption">Other option</option>
</select>
See more examples below.
Props 
<option> supports all common element props.
Additionally, <option> supports these props:
disabled: A boolean. If true, the option will not be selectable and will appear dimmed.
label: A string. Specifies the meaning of the option. If not specified, the text inside the option is used.
value: The value to be used when submitting the parent <select> in a form if this option is selected.
Caveats 
React does not support the selected attribute on <option>. Instead, pass this option’s value to the parent <select defaultValue> for an uncontrolled select box, or <select value> for a controlled select.

Usage 
Displaying a select box with options 
Render a <select> with a list of <option> components inside to display a select box. Give each <option> a value representing the data to be submitted with the form.
Read more about displaying a <select> with a list of <option> components.
App.js
DownloadReset
Fork
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}


Previous<input>
Next<progress>

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
<option>
Usage
Displaying a select box with options
<option> – React
<progress>
The built-in browser <progress> component lets you render a progress indicator.
<progress value={0.5} />
Reference
<progress>
Usage
Controlling a progress indicator

Reference 
<progress> 
To display a progress indicator, render the built-in browser <progress> component.
<progress value={0.5} />
See more examples below.
Props 
<progress> supports all common element props.
Additionally, <progress> supports these props:
max: A number. Specifies the maximum value. Defaults to 1.
value: A number between 0 and max, or null for indeterminate progress. Specifies how much was done.

Usage 
Controlling a progress indicator 
To display a progress indicator, render a <progress> component. You can pass a number value between 0 and the max value you specify. If you don’t pass a max value, it will assumed to be 1 by default.
If the operation is not ongoing, pass value={null} to put the progress indicator into an indeterminate state.
App.js
DownloadReset
Fork
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
13
export default function App() {
 return (
   <>
     <progress value={0} />
     <progress value={0.5} />
     <progress value={0.7} />
     <progress value={75} max={100} />
     <progress value={1} />
     <progress value={null} />
   </>
 );
}

Previous<option>
Next<select>

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
<progress>
Usage
Controlling a progress indicator
<progress> – React
<select>
The built-in browser <select> component lets you render a select box with options.
<select>
 <option value="someOption">Some option</option>
 <option value="otherOption">Other option</option>
</select>
Reference
<select>
Usage
Displaying a select box with options
Providing a label for a select box
Providing an initially selected option
Enabling multiple selection
Reading the select box value when submitting a form
Controlling a select box with a state variable

Reference 
<select> 
To display a select box, render the built-in browser <select> component.
<select>
 <option value="someOption">Some option</option>
 <option value="otherOption">Other option</option>
</select>
See more examples below.
Props 
<select> supports all common element props.
You can make a select box controlled by passing a value prop:
value: A string (or an array of strings for multiple={true}). Controls which option is selected. Every value string match the value of some <option> nested inside the <select>.
When you pass value, you must also pass an onChange handler that updates the passed value.
If your <select> is uncontrolled, you may pass the defaultValue prop instead:
defaultValue: A string (or an array of strings for multiple={true}). Specifies the initially selected option.
These <select> props are relevant both for uncontrolled and controlled select boxes:
autoComplete: A string. Specifies one of the possible autocomplete behaviors.
autoFocus: A boolean. If true, React will focus the element on mount.
children: <select> accepts <option>, <optgroup>, and <datalist> components as children. You can also pass your own components as long as they eventually render one of the allowed components. If you pass your own components that eventually render <option> tags, each <option> you render must have a value.
disabled: A boolean. If true, the select box will not be interactive and will appear dimmed.
form: A string. Specifies the id of the <form> this select box belongs to. If omitted, it’s the closest parent form.
multiple: A boolean. If true, the browser allows multiple selection.
name: A string. Specifies the name for this select box that’s submitted with the form.
onChange: An Event handler function. Required for controlled select boxes. Fires immediately when the user picks a different option. Behaves like the browser input event.
onChangeCapture: A version of onChange that fires in the capture phase.
onInput: An Event handler function. Fires immediately when the value is changed by the user. For historical reasons, in React it is idiomatic to use onChange instead which works similarly.
onInputCapture: A version of onInput that fires in the capture phase.
onInvalid: An Event handler function. Fires if an input fails validation on form submit. Unlike the built-in invalid event, the React onInvalid event bubbles.
onInvalidCapture: A version of onInvalid that fires in the capture phase.
required: A boolean. If true, the value must be provided for the form to submit.
size: A number. For multiple={true} selects, specifies the preferred number of initially visible items.
Caveats 
Unlike in HTML, passing a selected attribute to <option> is not supported. Instead, use <select defaultValue> for uncontrolled select boxes and <select value> for controlled select boxes.
If a select box receives a value prop, it will be treated as controlled.
A select box can’t be both controlled and uncontrolled at the same time.
A select box cannot switch between being controlled or uncontrolled over its lifetime.
Every controlled select box needs an onChange event handler that synchronously updates its backing value.

Usage 
Displaying a select box with options 
Render a <select> with a list of <option> components inside to display a select box. Give each <option> a value representing the data to be submitted with the form.
App.js
DownloadReset
Fork
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}



Providing a label for a select box 
Typically, you will place every <select> inside a <label> tag. This tells the browser that this label is associated with that select box. When the user clicks the label, the browser will automatically focus the select box. It’s also essential for accessibility: a screen reader will announce the label caption when the user focuses the select box.
If you can’t nest <select> into a <label>, associate them by passing the same ID to <select id> and <label htmlFor>. To avoid conflicts between multiple instances of one component, generate such an ID with useId.
App.js
DownloadReset
Fork
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Pick a fruit:
        <select name="selectedFruit">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Pick a vegetable:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Cucumber</option>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
    </>
  );
}


Show more

Providing an initially selected option 
By default, the browser will select the first <option> in the list. To select a different option by default, pass that <option>’s value as the defaultValue to the <select> element.
App.js
DownloadReset
Fork
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}


Pitfall
Unlike in HTML, passing a selected attribute to an individual <option> is not supported.

Enabling multiple selection 
Pass multiple={true} to the <select> to let the user select multiple options. In that case, if you also specify defaultValue to choose the initially selected options, it must be an array.
App.js
DownloadReset
Fork
export default function FruitPicker() {
  return (
    <label>
      Pick some fruits:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}


Show more

Reading the select box value when submitting a form 
Add a <form> around your select box with a <button type="submit"> inside. It will call your <form onSubmit> event handler. By default, the browser will send the form data to the current URL and refresh the page. You can override that behavior by calling e.preventDefault(). Read the form data with new FormData(e.target).
App.js
DownloadReset
Fork
export default function EditPost() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });
    // You can generate a URL out of it, as the browser does by default:
    console.log(new URLSearchParams(formData).toString());
    // You can work with it as a plain object.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) This doesn't include multiple select values
    // Or you can get an array of name-value pairs.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Pick your favorite fruit:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <label>
        Pick all your favorite vegetables:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}


Show more
Note
Give a name to your <select>, for example <select name="selectedFruit" />. The name you specified will be used as a key in the form data, for example { selectedFruit: "orange" }.
If you use <select multiple={true}>, the FormData you’ll read from the form will include each selected value as a separate name-value pair. Look closely at the console logs in the example above.
Pitfall
By default, any <button> inside a <form> will submit it. This can be surprising! If you have your own custom Button React component, consider returning <button type="button"> instead of <button>. Then, to be explicit, use <button type="submit"> for buttons that are supposed to submit the form.

Controlling a select box with a state variable 
A select box like <select /> is uncontrolled. Even if you pass an initially selected value like <select defaultValue="orange" />, your JSX only specifies the initial value, not the value right now.
To render a controlled select box, pass the value prop to it. React will force the select box to always have the value you passed. Typically, you will control a select box by declaring a state variable:
function FruitPicker() {
 const [selectedFruit, setSelectedFruit] = useState('orange'); // Declare a state variable...
 // ...
 return (
   <select
     value={selectedFruit} // ...force the select's value to match the state variable...
     onChange={e => setSelectedFruit(e.target.value)} // ... and update the state variable on any change!
   >
     <option value="apple">Apple</option>
     <option value="banana">Banana</option>
     <option value="orange">Orange</option>
   </select>
 );
}
This is useful if you want to re-render some part of the UI in response to every selection.
App.js
DownloadReset
Fork
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Pick a fruit:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label>
        Pick all your favorite vegetables:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <p>Your favorite fruit: {selectedFruit}</p>
      <p>Your favorite vegetables: {selectedVegs.join(', ')}</p>
    </>
  );
}


Show more
Pitfall
If you pass value without onChange, it will be impossible to select an option. When you control a select box by passing some value to it, you force it to always have the value you passed. So if you pass a state variable as a value but forget to update that state variable synchronously during the onChange event handler, React will revert the select box after every keystroke back to the value that you specified.
Unlike in HTML, passing a selected attribute to an individual <option> is not supported.
Previous<progress>
Next<textarea>

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
<select>
Usage
Displaying a select box with options
Providing a label for a select box
Providing an initially selected option
Enabling multiple selection
Reading the select box value when submitting a form
Controlling a select box with a state variable
<select> – React
<textarea>
The built-in browser <textarea> component lets you render a multiline text input.
<textarea />
Reference
<textarea>
Usage
Displaying a text area
Providing a label for a text area
Providing an initial value for a text area
Reading the text area value when submitting a form
Controlling a text area with a state variable
Troubleshooting
My text area doesn’t update when I type into it
My text area caret jumps to the beginning on every keystroke
I’m getting an error: “A component is changing an uncontrolled input to be controlled”

Reference 
<textarea> 
To display a text area, render the built-in browser <textarea> component.
<textarea name="postContent" />
See more examples below.
Props 
<textarea> supports all common element props.
You can make a text area controlled by passing a value prop:
value: A string. Controls the text inside the text area.
When you pass value, you must also pass an onChange handler that updates the passed value.
If your <textarea> is uncontrolled, you may pass the defaultValue prop instead:
defaultValue: A string. Specifies the initial value for a text area.
These <textarea> props are relevant both for uncontrolled and controlled text areas:
autoComplete: Either 'on' or 'off'. Specifies the autocomplete behavior.
autoFocus: A boolean. If true, React will focus the element on mount.
children: <textarea> does not accept children. To set the initial value, use defaultValue.
cols: A number. Specifies the default width in average character widths. Defaults to 20.
disabled: A boolean. If true, the input will not be interactive and will appear dimmed.
form: A string. Specifies the id of the <form> this input belongs to. If omitted, it’s the closest parent form.
maxLength: A number. Specifies the maximum length of text.
minLength: A number. Specifies the minimum length of text.
name: A string. Specifies the name for this input that’s submitted with the form.
onChange: An Event handler function. Required for controlled text areas. Fires immediately when the input’s value is changed by the user (for example, it fires on every keystroke). Behaves like the browser input event.
onChangeCapture: A version of onChange that fires in the capture phase.
onInput: An Event handler function. Fires immediately when the value is changed by the user. For historical reasons, in React it is idiomatic to use onChange instead which works similarly.
onInputCapture: A version of onInput that fires in the capture phase.
onInvalid: An Event handler function. Fires if an input fails validation on form submit. Unlike the built-in invalid event, the React onInvalid event bubbles.
onInvalidCapture: A version of onInvalid that fires in the capture phase.
onSelect: An Event handler function. Fires after the selection inside the <textarea> changes. React extends the onSelect event to also fire for empty selection and on edits (which may affect the selection).
onSelectCapture: A version of onSelect that fires in the capture phase.
placeholder: A string. Displayed in a dimmed color when the text area value is empty.
readOnly: A boolean. If true, the text area is not editable by the user.
required: A boolean. If true, the value must be provided for the form to submit.
rows: A number. Specifies the default height in average character heights. Defaults to 2.
wrap: Either 'hard', 'soft', or 'off'. Specifies how the text should be wrapped when submitting a form.
Caveats 
Passing children like <textarea>something</textarea> is not allowed. Use defaultValue for initial content.
If a text area receives a string value prop, it will be treated as controlled.
A text area can’t be both controlled and uncontrolled at the same time.
A text area cannot switch between being controlled or uncontrolled over its lifetime.
Every controlled text area needs an onChange event handler that synchronously updates its backing value.

Usage 
Displaying a text area 
Render <textarea> to display a text area. You can specify its default size with the rows and cols attributes, but by default the user will be able to resize it. To disable resizing, you can specify resize: none in the CSS.
App.js
DownloadReset
Fork
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}



Providing a label for a text area 
Typically, you will place every <textarea> inside a <label> tag. This tells the browser that this label is associated with that text area. When the user clicks the label, the browser will focus the text area. It’s also essential for accessibility: a screen reader will announce the label caption when the user focuses the text area.
If you can’t nest <textarea> into a <label>, associate them by passing the same ID to <textarea id> and <label htmlFor>. To avoid conflicts between instances of one component, generate such an ID with useId.
App.js
DownloadReset
Fork
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}


Show more

Providing an initial value for a text area 
You can optionally specify the initial value for the text area. Pass it as the defaultValue string.
App.js
DownloadReset
Fork
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}


Pitfall
Unlike in HTML, passing initial text like <textarea>Some content</textarea> is not supported.

Reading the text area value when submitting a form 
Add a <form> around your textarea with a <button type="submit"> inside. It will call your <form onSubmit> event handler. By default, the browser will send the form data to the current URL and refresh the page. You can override that behavior by calling e.preventDefault(). Read the form data with new FormData(e.target).
App.js
DownloadReset
Fork
export default function EditPost() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
    </form>
  );
}


Show more
Note
Give a name to your <textarea>, for example <textarea name="postContent" />. The name you specified will be used as a key in the form data, for example { postContent: "Your post" }.
Pitfall
By default, any <button> inside a <form> will submit it. This can be surprising! If you have your own custom Button React component, consider returning <button type="button"> instead of <button>. Then, to be explicit, use <button type="submit"> for buttons that are supposed to submit the form.

Controlling a text area with a state variable 
A text area like <textarea /> is uncontrolled. Even if you pass an initial value like <textarea defaultValue="Initial text" />, your JSX only specifies the initial value, not the value right now.
To render a controlled text area, pass the value prop to it. React will force the text area to always have the value you passed. Typically, you will control a text area by declaring a state variable:
function NewPost() {
 const [postContent, setPostContent] = useState(''); // Declare a state variable...
 // ...
 return (
   <textarea
     value={postContent} // ...force the input's value to match the state variable...
     onChange={e => setPostContent(e.target.value)} // ... and update the state variable on any edits!
   />
 );
}
This is useful if you want to re-render some part of the UI in response to every keystroke.
package.jsonApp.jsMarkdownPreview.js
Reset
Fork
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "devDependencies": {}
}
Pitfall
If you pass value without onChange, it will be impossible to type into the text area. When you control a text area by passing some value to it, you force it to always have the value you passed. So if you pass a state variable as a value but forget to update that state variable synchronously during the onChange event handler, React will revert the text area after every keystroke back to the value that you specified.

Troubleshooting 
My text area doesn’t update when I type into it 
If you render a text area with value but no onChange, you will see an error in the console:
// 🔴 Bug: controlled text area with no onChange handler
<textarea value={something} />
Console
You provided a value prop to a form field without an onChange handler. This will render a read-only field. If the field should be mutable use defaultValue. Otherwise, set either onChange or readOnly.
As the error message suggests, if you only wanted to specify the initial value, pass defaultValue instead:
// ✅ Good: uncontrolled text area with an initial value
<textarea defaultValue={something} />
If you want to control this text area with a state variable, specify an onChange handler:
// ✅ Good: controlled text area with onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
If the value is intentionally read-only, add a readOnly prop to suppress the error:
// ✅ Good: readonly controlled text area without on change
<textarea value={something} readOnly={true} />

My text area caret jumps to the beginning on every keystroke 
If you control a text area, you must update its state variable to the text area’s value from the DOM during onChange.
You can’t update it to something other than e.target.value:
function handleChange(e) {
 // 🔴 Bug: updating an input to something other than e.target.value
 setFirstName(e.target.value.toUpperCase());
}
You also can’t update it asynchronously:
function handleChange(e) {
 // 🔴 Bug: updating an input asynchronously
 setTimeout(() => {
   setFirstName(e.target.value);
 }, 100);
}
To fix your code, update it synchronously to e.target.value:
function handleChange(e) {
 // ✅ Updating a controlled input to e.target.value synchronously
 setFirstName(e.target.value);
}
If this doesn’t fix the problem, it’s possible that the text area gets removed and re-added from the DOM on every keystroke. This can happen if you’re accidentally resetting state on every re-render. For example, this can happen if the text area or one of its parents always receives a different key attribute, or if you nest component definitions (which is not allowed in React and causes the “inner” component to remount on every render).

I’m getting an error: “A component is changing an uncontrolled input to be controlled” 
If you provide a value to the component, it must remain a string throughout its lifetime.
You cannot pass value={undefined} first and later pass value="some string" because React won’t know whether you want the component to be uncontrolled or controlled. A controlled component should always receive a string value, not null or undefined.
If your value is coming from an API or a state variable, it might be initialized to null or undefined. In that case, either set it to an empty string ('') initially, or pass value={someValue ?? ''} to ensure value is a string.
Previous<select>
Next<link>

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
<textarea>
Usage
Displaying a text area
Providing a label for a text area
Providing an initial value for a text area
Reading the text area value when submitting a form
Controlling a text area with a state variable
Troubleshooting
My text area doesn’t update when I type into it
My text area caret jumps to the beginning on every keystroke
I’m getting an error: “A component is changing an uncontrolled input to be controlled”
<textarea> – React
<link>
The built-in browser <link> component lets you use external resources such as stylesheets or annotate the document with link metadata.
<link rel="icon" href="favicon.ico" />
Reference
<link>
Usage
Linking to related resources
Linking to a stylesheet
Controlling stylesheet precedence
Deduplicated stylesheet rendering
Annotating specific items within the document with links

Reference 
<link> 
To link to external resources such as stylesheets, fonts, and icons, or to annotate the document with link metadata, render the built-in browser <link> component. You can render <link> from any component and React will in most cases place the corresponding DOM element in the document head.
<link rel="icon" href="favicon.ico" />
See more examples below.
Props 
<link> supports all common element props.
rel: a string, required. Specifies the relationship to the resource. React treats links with rel="stylesheet" differently from other links.
These props apply when rel="stylesheet":
precedence: a string. Tells React where to rank the <link> DOM node relative to others in the document <head>, which determines which stylesheet can override the other. React will infer that precedence values it discovers first are “lower” and precedence values it discovers later are “higher”. Many style systems can work fine using a single precedence value because style rules are atomic. Stylesheets with the same precedence go together whether they are <link> or inline <style> tags or loaded using preinit functions.
media: a string. Restricts the stylesheet to a certain media query.
title: a string. Specifies the name of an alternative stylesheet.
These props apply when rel="stylesheet" but disable React’s special treatment of stylesheets:
disabled: a boolean. Disables the stylesheet.
onError: a function. Called when the stylesheet fails to load.
onLoad: a function. Called when the stylesheet finishes being loaded.
These props apply when rel="preload" or rel="modulepreload":
as: a string. The type of resource. Its possible values are audio, document, embed, fetch, font, image, object, script, style, track, video, worker.
imageSrcSet: a string. Applicable only when as="image". Specifies the source set of the image.
imageSizes: a string. Applicable only when as="image". Specifies the sizes of the image.
These props apply when rel="icon" or rel="apple-touch-icon":
sizes: a string. The sizes of the icon.
These props apply in all cases:
href: a string. The URL of the linked resource.
crossOrigin: a string. The CORS policy to use. Its possible values are anonymous and use-credentials. It is required when as is set to "fetch".
referrerPolicy: a string. The Referrer header to send when fetching. Its possible values are no-referrer-when-downgrade (the default), no-referrer, origin, origin-when-cross-origin, and unsafe-url.
fetchPriority: a string. Suggests a relative priority for fetching the resource. The possible values are auto (the default), high, and low.
hrefLang: a string. The language of the linked resource.
integrity: a string. A cryptographic hash of the resource, to verify its authenticity.
type: a string. The MIME type of the linked resource.
Props that are not recommended for use with React:
blocking: a string. If set to "render", instructs the browser not to render the page until the stylesheet is loaded. React provides more fine-grained control using Suspense.
Special rendering behavior 
React will always place the DOM element corresponding to the <link> component within the document’s <head>, regardless of where in the React tree it is rendered. The <head> is the only valid place for <link> to exist within the DOM, yet it’s convenient and keeps things composable if a component representing a specific page can render <link> components itself.
There are a few exceptions to this:
If the <link> has a rel="stylesheet" prop, then it has to also have a precedence prop to get this special behavior. This is because the order of stylesheets within the document is significant, so React needs to know how to order this stylesheet relative to others, which you specify using the precedence prop. If the precedence prop is omitted, there is no special behavior.
If the <link> has an itemProp prop, there is no special behavior, because in this case it doesn’t apply to the document but instead represents metadata about a specific part of the page.
If the <link> has an onLoad or onError prop, because in that case you are managing the loading of the linked resource manually within your React component.
Special behavior for stylesheets 
In addition, if the <link> is to a stylesheet (namely, it has rel="stylesheet" in its props), React treats it specially in the following ways:
The component that renders <link> will suspend while the stylesheet is loading.
If multiple components render links to the same stylesheet, React will de-duplicate them and only put a single link into the DOM. Two links are considered the same if they have the same href prop.
There are two exception to this special behavior:
If the link doesn’t have a precedence prop, there is no special behavior, because the order of stylesheets within the document is significant, so React needs to know how to order this stylesheet relative to others, which you specify using the precedence prop.
If you supply any of the onLoad, onError, or disabled props, there is no special behavior, because these props indicate that you are managing the loading of the stylesheet manually within your component.
This special treatment comes with two caveats:
React will ignore changes to props after the link has been rendered. (React will issue a warning in development if this happens.)
React may leave the link in the DOM even after the component that rendered it has been unmounted.

Usage 
Linking to related resources 
You can annotate the document with links to related resources such as an icon, canonical URL, or pingback. React will place this metadata within the document <head> regardless of where in the React tree it is rendered.
App.jsShowRenderedHTML.js
Reset
Fork
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>My Blog</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}


Linking to a stylesheet 
If a component depends on a certain stylesheet in order to be displayed correctly, you can render a link to that stylesheet within the component. Your component will suspend while the stylesheet is loading. You must supply the precedence prop, which tells React where to place this stylesheet relative to others — stylesheets with higher precedence can override those with lower precedence.
Note
When you want to use a stylesheet, it can be beneficial to call the preinit function. Calling this function may allow the browser to start fetching the stylesheet earlier than if you just render a <link> component, for example by sending an HTTP Early Hints response.
App.jsShowRenderedHTML.js
Reset
Fork
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </ShowRenderedHTML>
  );
}


Controlling stylesheet precedence 
Stylesheets can conflict with each other, and when they do, the browser goes with the one that comes later in the document. React lets you control the order of stylesheets with the precedence prop. In this example, three components render stylesheets, and the ones with the same precedence are grouped together in the <head>.
App.jsShowRenderedHTML.js
Reset
Fork
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      <ThirdComponent/>
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="first" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="second" />;
}

function ThirdComponent() {
  return <link rel="stylesheet" href="third.css" precedence="first" />;
}


Show more
Note the precedence values themselves are arbitrary and their naming is up to you. React will infer that precedence values it discovers first are “lower” and precedence values it discovers later are “higher”.
Deduplicated stylesheet rendering 
If you render the same stylesheet from multiple components, React will place only a single <link> in the document head.
App.jsShowRenderedHTML.js
Reset
Fork
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <Component />
      <Component />
      ...
    </ShowRenderedHTML>
  );
}

function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}


Annotating specific items within the document with links 
You can use the <link> component with the itemProp prop to annotate specific items within the document with links to related resources. In this case, React will not place these annotations within the document <head> but will place them like any other React component.
<section itemScope>
 <h3>Annotating specific items</h3>
 <link itemProp="author" href="http://example.com/" />
 <p>...</p>
</section>
Previous<textarea>
Next<meta>

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
<link>
Usage
Linking to related resources
Linking to a stylesheet
Controlling stylesheet precedence
Deduplicated stylesheet rendering
Annotating specific items within the document with links
<link> – React
<meta>
The built-in browser <meta> component lets you add metadata to the document.
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
Reference
<meta>
Usage
Annotating the document with metadata
Annotating specific items within the document with metadata

Reference 
<meta> 
To add document metadata, render the built-in browser <meta> component. You can render <meta> from any component and React will always place the corresponding DOM element in the document head.
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
See more examples below.
Props 
<meta> supports all common element props.
It should have exactly one of the following props: name, httpEquiv, charset, itemProp. The <meta> component does something different depending on which of these props is specified.
name: a string. Specifies the kind of metadata to be attached to the document.
charset: a string. Specifies the character set used by the document. The only valid value is "utf-8".
httpEquiv: a string. Specifies a directive for processing the document.
itemProp: a string. Specifies metadata about a particular item within the document rather than the document as a whole.
content: a string. Specifies the metadata to be attached when used with the name or itemProp props or the behavior of the directive when used with the httpEquiv prop.
Special rendering behavior 
React will always place the DOM element corresponding to the <meta> component within the document’s <head>, regardless of where in the React tree it is rendered. The <head> is the only valid place for <meta> to exist within the DOM, yet it’s convenient and keeps things composable if a component representing a specific page can render <meta> components itself.
There is one exception to this: if <meta> has an itemProp prop, there is no special behavior, because in this case it doesn’t represent metadata about the document but rather metadata about a specific part of the page.

Usage 
Annotating the document with metadata 
You can annotate the document with metadata such as keywords, a summary, or the author’s name. React will place this metadata within the document <head> regardless of where in the React tree it is rendered.
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="API reference for the <meta> component in React DOM" />
You can render the <meta> component from any component. React will put a <meta> DOM node in the document <head>.
App.jsShowRenderedHTML.js
Reset
Fork
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="A site map for the React website" />
      <h1>Site Map</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}


Annotating specific items within the document with metadata 
You can use the <meta> component with the itemProp prop to annotate specific items within the document with metadata. In this case, React will not place these annotations within the document <head> but will place them like any other React component.
<section itemScope>
 <h3>Annotating specific items</h3>
 <meta itemProp="description" content="API reference for using <meta> with itemProp" />
 <p>...</p>
</section>
Previous<link>
Next<script>

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
<meta>
Usage
Annotating the document with metadata
Annotating specific items within the document with metadata
<meta> – React
<script>
The built-in browser <script> component lets you add a script to your document.
<script> alert("hi!") </script>
Reference
<script>
Usage
Rendering an external script
Rendering an inline script

Reference 
<script> 
To add inline or external scripts to your document, render the built-in browser <script> component. You can render <script> from any component and React will in certain cases place the corresponding DOM element in the document head and de-duplicate identical scripts.
<script> alert("hi!") </script>
<script src="script.js" />
See more examples below.
Props 
<script> supports all common element props.
It should have either children or a src prop.
children: a string. The source code of an inline script.
src: a string. The URL of an external script.
Other supported props:
async: a boolean. Allows the browser to defer execution of the script until the rest of the document has been processed — the preferred behavior for performance.
crossOrigin: a string. The CORS policy to use. Its possible values are anonymous and use-credentials.
fetchPriority: a string. Lets the browser rank scripts in priority when fetching multiple scripts at the same time. Can be "high", "low", or "auto" (the default).
integrity: a string. A cryptographic hash of the script, to verify its authenticity.
noModule: a boolean. Disables the script in browsers that support ES modules — allowing for a fallback script for browsers that do not.
nonce: a string. A cryptographic nonce to allow the resource when using a strict Content Security Policy.
referrer: a string. Says what Referer header to send when fetching the script and any resources that the script fetches in turn.
type: a string. Says whether the script is a classic script, ES module, or import map.
Props that disable React’s special treatment of scripts:
onError: a function. Called when the script fails to load.
onLoad: a function. Called when the script finishes being loaded.
Props that are not recommended for use with React:
blocking: a string. If set to "render", instructs the browser not to render the page until the scriptsheet is loaded. React provides more fine-grained control using Suspense.
defer: a string. Prevents the browser from executing the script until the document is done loading. Not compatible with streaming server-rendered components. Use the async prop instead.
Special rendering behavior 
React can move <script> components to the document’s <head> and de-duplicate identical scripts.
To opt into this behavior, provide the src and async={true} props. React will de-duplicate scripts if they have the same src. The async prop must be true to allow scripts to be safely moved.
This special treatment comes with two caveats:
React will ignore changes to props after the script has been rendered. (React will issue a warning in development if this happens.)
React may leave the script in the DOM even after the component that rendered it has been unmounted. (This has no effect as scripts just execute once when they are inserted into the DOM.)

Usage 
Rendering an external script 
If a component depends on certain scripts in order to be displayed correctly, you can render a <script> within the component.
However, the component might be committed before the script has finished loading.
You can start depending on the script content once the load event is fired e.g. by using the onLoad prop.
React will de-duplicate scripts that have the same src, inserting only one of them into the DOM even if multiple components render it.
App.jsShowRenderedHTML.js
Reset
Fork
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" onLoad={() => console.log('script loaded')} />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}


Show more
Note
When you want to use a script, it can be beneficial to call the preinit function. Calling this function may allow the browser to start fetching the script earlier than if you just render a <script> component, for example by sending an HTTP Early Hints response.
Rendering an inline script 
To include an inline script, render the <script> component with the script source code as its children. Inline scripts are not de-duplicated or moved to the document <head>.
App.jsShowRenderedHTML.js
Reset
Fork
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>My Website</h1>
      <Tracking />
      <p>Welcome</p>
    </ShowRenderedHTML>
  );
}


Show more
Previous<meta>
Next<style>

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
<script>
Usage
Rendering an external script
Rendering an inline script
<script> – React
<style>
The built-in browser <style> component lets you add inline CSS stylesheets to your document.
<style>{` p { color: red; } `}</style>
Reference
<style>
Usage
Rendering an inline CSS stylesheet

Reference 
<style> 
To add inline styles to your document, render the built-in browser <style> component. You can render <style> from any component and React will in certain cases place the corresponding DOM element in the document head and de-duplicate identical styles.
<style>{` p { color: red; } `}</style>
See more examples below.
Props 
<style> supports all common element props.
children: a string, required. The contents of the stylesheet.
precedence: a string. Tells React where to rank the <style> DOM node relative to others in the document <head>, which determines which stylesheet can override the other. React will infer that precedence values it discovers first are “lower” and precedence values it discovers later are “higher”. Many style systems can work fine using a single precedence value because style rules are atomic. Stylesheets with the same precedence go together whether they are <link> or inline <style> tags or loaded using preinit functions.
href: a string. Allows React to de-duplicate styles that have the same href.
media: a string. Restricts the stylesheet to a certain media query.
nonce: a string. A cryptographic nonce to allow the resource when using a strict Content Security Policy.
title: a string. Specifies the name of an alternative stylesheet.
Props that are not recommended for use with React:
blocking: a string. If set to "render", instructs the browser not to render the page until the stylesheet is loaded. React provides more fine-grained control using Suspense.
Special rendering behavior 
React can move <style> components to the document’s <head>, de-duplicate identical stylesheets, and suspend while the stylesheet is loading.
To opt into this behavior, provide the href and precedence props. React will de-duplicate styles if they have the same href. The precedence prop tells React where to rank the <style> DOM node relative to others in the document <head>, which determines which stylesheet can override the other.
This special treatment comes with two caveats:
React will ignore changes to props after the style has been rendered. (React will issue a warning in development if this happens.)
React will drop all extraneous props when using the precedence prop (beyond href and precedence).
React may leave the style in the DOM even after the component that rendered it has been unmounted.

Usage 
Rendering an inline CSS stylesheet 
If a component depends on certain CSS styles in order to be displayed correctly, you can render an inline stylesheet within the component.
The href prop should uniquely identify the stylesheet, because React will de-duplicate stylesheets that have the same href.
If you supply a precedence prop, React will reorder inline stylesheets based on the order these values appear in the component tree.
Inline stylesheets will not trigger Suspense boundaries while they’re loading.
Even if they load async resources like fonts or images.
App.jsShowRenderedHTML.js
Reset
Fork
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}


Show more
Previous<script>
Next<title>

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
<style>
Usage
Rendering an inline CSS stylesheet
<style> – React
<title>
The built-in browser <title> component lets you specify the title of the document.
<title>My Blog</title>
Reference
<title>
Usage
Set the document title
Use variables in the title

Reference 
<title> 
To specify the title of the document, render the built-in browser <title> component. You can render <title> from any component and React will always place the corresponding DOM element in the document head.
<title>My Blog</title>
See more examples below.
Props 
<title> supports all common element props.
children: <title> accepts only text as a child. This text will become the title of the document. You can also pass your own components as long as they only render text.
Special rendering behavior 
React will always place the DOM element corresponding to the <title> component within the document’s <head>, regardless of where in the React tree it is rendered. The <head> is the only valid place for <title> to exist within the DOM, yet it’s convenient and keeps things composable if a component representing a specific page can render its <title> itself.
There are two exception to this:
If <title> is within an <svg> component, then there is no special behavior, because in this context it doesn’t represent the document’s title but rather is an accessibility annotation for that SVG graphic.
If the <title> has an itemProp prop, there is no special behavior, because in this case it doesn’t represent the document’s title but rather metadata about a specific part of the page.
Pitfall
Only render a single <title> at a time. If more than one component renders a <title> tag at the same time, React will place all of those titles in the document head. When this happens, the behavior of browsers and search engines is undefined.

Usage 
Set the document title 
Render the <title> component from any component with text as its children. React will put a <title> DOM node in the document <head>.
App.jsShowRenderedHTML.js
Reset
Fork
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>My Site: Contact Us</title>
      <h1>Contact Us</h1>
      <p>Email us at support@example.com</p>
    </ShowRenderedHTML>
  );
}


Use variables in the title 
The children of the <title> component must be a single string of text. (Or a single number or a single object with a toString method.) It might not be obvious, but using JSX curly braces like this:
<title>Results page {pageNumber}</title> // 🔴 Problem: This is not a single string
… actually causes the <title> component to get a two-element array as its children (the string "Results page" and the value of pageNumber). This will cause an error. Instead, use string interpolation to pass <title> a single string:
<title>{`Results page ${pageNumber}`}</title>
Previous<style>
NextAPIs

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
<title>
Usage
Set the document title
Use variables in the title
<title> – React
React DOM APIs
The react-dom package contains methods that are only supported for the web applications (which run in the browser DOM environment). They are not supported for React Native.

APIs 
These APIs can be imported from your components. They are rarely used:
createPortal lets you render child components in a different part of the DOM tree.
flushSync lets you force React to flush a state update and update the DOM synchronously.
Resource Preloading APIs 
These APIs can be used to make apps faster by pre-loading resources such as scripts, stylesheets, and fonts as soon as you know you need them, for example before navigating to another page where the resources will be used.
React-based frameworks frequently handle resource loading for you, so you might not have to call these APIs yourself. Consult your framework’s documentation for details.
prefetchDNS lets you prefetch the IP address of a DNS domain name that you expect to connect to.
preconnect lets you connect to a server you expect to request resources from, even if you don’t know what resources you’ll need yet.
preload lets you fetch a stylesheet, font, image, or external script that you expect to use.
preloadModule lets you fetch an ESM module that you expect to use.
preinit lets you fetch and evaluate an external script or fetch and insert a stylesheet.
preinitModule lets you fetch and evaluate an ESM module.

Entry points 
The react-dom package provides two additional entry points:
react-dom/client contains APIs to render React components on the client (in the browser).
react-dom/server contains APIs to render React components on the server.

Removed APIs 
These APIs were removed in React 19:
findDOMNode: see alternatives.
hydrate: use hydrateRoot instead.
render: use createRoot instead.
unmountComponentAtNode: use root.unmount() instead.
renderToNodeStream: use react-dom/server APIs instead.
renderToStaticNodeStream: use react-dom/server APIs instead.
Previous<title>
NextcreatePortal

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
APIs
Resource Preloading APIs
Entry points
Removed APIs
React DOM APIs – React
createPortal
createPortal lets you render some children into a different part of the DOM.
<div>
 <SomeComponent />
 {createPortal(children, domNode, key?)}
</div>
Reference
createPortal(children, domNode, key?)
Usage
Rendering to a different part of the DOM
Rendering a modal dialog with a portal
Rendering React components into non-React server markup
Rendering React components into non-React DOM nodes

Reference 
createPortal(children, domNode, key?) 
To create a portal, call createPortal, passing some JSX, and the DOM node where it should be rendered:
import { createPortal } from 'react-dom';

// ...

<div>
 <p>This child is placed in the parent div.</p>
 {createPortal(
   <p>This child is placed in the document body.</p>,
   document.body
 )}
</div>
See more examples below.
A portal only changes the physical placement of the DOM node. In every other way, the JSX you render into a portal acts as a child node of the React component that renders it. For example, the child can access the context provided by the parent tree, and events bubble up from children to parents according to the React tree.
Parameters 
children: Anything that can be rendered with React, such as a piece of JSX (e.g. <div /> or <SomeComponent />), a Fragment (<>...</>), a string or a number, or an array of these.
domNode: Some DOM node, such as those returned by document.getElementById(). The node must already exist. Passing a different DOM node during an update will cause the portal content to be recreated.
optional key: A unique string or number to be used as the portal’s key.
Returns 
createPortal returns a React node that can be included into JSX or returned from a React component. If React encounters it in the render output, it will place the provided children inside the provided domNode.
Caveats 
Events from portals propagate according to the React tree rather than the DOM tree. For example, if you click inside a portal, and the portal is wrapped in <div onClick>, that onClick handler will fire. If this causes issues, either stop the event propagation from inside the portal, or move the portal itself up in the React tree.

Usage 
Rendering to a different part of the DOM 
Portals let your components render some of their children into a different place in the DOM. This lets a part of your component “escape” from whatever containers it may be in. For example, a component can display a modal dialog or a tooltip that appears above and outside of the rest of the page.
To create a portal, render the result of createPortal with some JSX and the DOM node where it should go:
import { createPortal } from 'react-dom';

function MyComponent() {
 return (
   <div style={{ border: '2px solid black' }}>
     <p>This child is placed in the parent div.</p>
     {createPortal(
       <p>This child is placed in the document body.</p>,
       document.body
     )}
   </div>
 );
}
React will put the DOM nodes for the JSX you passed inside of the DOM node you provided.
Without a portal, the second <p> would be placed inside the parent <div>, but the portal “teleported” it into the document.body:
App.js
DownloadReset
Fork
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}


Notice how the second paragraph visually appears outside the parent <div> with the border. If you inspect the DOM structure with developer tools, you’ll see that the second <p> got placed directly into the <body>:
<body>
 <div id="root">
   ...
     <div style="border: 2px solid black">
       <p>This child is placed inside the parent div.</p>
     </div>
   ...
 </div>
 <p>This child is placed in the document body.</p>
</body>
A portal only changes the physical placement of the DOM node. In every other way, the JSX you render into a portal acts as a child node of the React component that renders it. For example, the child can access the context provided by the parent tree, and events still bubble up from children to parents according to the React tree.

Rendering a modal dialog with a portal 
You can use a portal to create a modal dialog that floats above the rest of the page, even if the component that summons the dialog is inside a container with overflow: hidden or other styles that interfere with the dialog.
In this example, the two containers have styles that disrupt the modal dialog, but the one rendered into a portal is unaffected because, in the DOM, the modal is not contained within the parent JSX elements.
App.jsNoPortalExample.jsPortalExample.jsModalContent.js
Reset
Fork
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}


Pitfall
It’s important to make sure that your app is accessible when using portals. For instance, you may need to manage keyboard focus so that the user can move the focus in and out of the portal in a natural way.
Follow the WAI-ARIA Modal Authoring Practices when creating modals. If you use a community package, ensure that it is accessible and follows these guidelines.

Rendering React components into non-React server markup 
Portals can be useful if your React root is only part of a static or server-rendered page that isn’t built with React. For example, if your page is built with a server framework like Rails, you can create areas of interactivity within static areas such as sidebars. Compared with having multiple separate React roots, portals let you treat the app as a single React tree with shared state even though its parts render to different parts of the DOM.
index.jsindex.htmlApp.js
Reset
Fork
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>This part is rendered by React</p>;
}

function SidebarContent() {
  return <p>This part is also rendered by React!</p>;
}


Show more

Rendering React components into non-React DOM nodes 
You can also use a portal to manage the content of a DOM node that’s managed outside of React. For example, suppose you’re integrating with a non-React map widget and you want to render React content inside a popup. To do this, declare a popupContainer state variable to store the DOM node you’re going to render into:
const [popupContainer, setPopupContainer] = useState(null);
When you create the third-party widget, store the DOM node returned by the widget so you can render into it:
useEffect(() => {
 if (mapRef.current === null) {
   const map = createMapWidget(containerRef.current);
   mapRef.current = map;
   const popupDiv = addPopupToMapWidget(map);
   setPopupContainer(popupDiv);
 }
}, []);
This lets you use createPortal to render React content into popupContainer once it becomes available:
return (
 <div style={{ width: 250, height: 250 }} ref={containerRef}>
   {popupContainer !== null && createPortal(
     <p>Hello from React!</p>,
     popupContainer
   )}
 </div>
);
Here is a complete example you can play with:
App.jsmap-widget.js
Reset
Fork
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Hello from React!</p>,
        popupContainer
      )}
    </div>
  );
}


Show more
PreviousAPIs
NextflushSync

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
createPortal(children, domNode, key?)
Usage
Rendering to a different part of the DOM
Rendering a modal dialog with a portal
Rendering React components into non-React server markup
Rendering React components into non-React DOM nodes
createPortal – React
flushSync
Pitfall
Using flushSync is uncommon and can hurt the performance of your app.
flushSync lets you force React to flush any updates inside the provided callback synchronously. This ensures that the DOM is updated immediately.
flushSync(callback)
Reference
flushSync(callback)
Usage
Flushing updates for third-party integrations

Reference 
flushSync(callback) 
Call flushSync to force React to flush any pending work and update the DOM synchronously.
import { flushSync } from 'react-dom';

flushSync(() => {
 setSomething(123);
});
Most of the time, flushSync can be avoided. Use flushSync as last resort.
See more examples below.
Parameters 
callback: A function. React will immediately call this callback and flush any updates it contains synchronously. It may also flush any pending updates, or Effects, or updates inside of Effects. If an update suspends as a result of this flushSync call, the fallbacks may be re-shown.
Returns 
flushSync returns undefined.
Caveats 
flushSync can significantly hurt performance. Use sparingly.
flushSync may force pending Suspense boundaries to show their fallback state.
flushSync may run pending Effects and synchronously apply any updates they contain before returning.
flushSync may flush updates outside the callback when necessary to flush the updates inside the callback. For example, if there are pending updates from a click, React may flush those before flushing the updates inside the callback.

Usage 
Flushing updates for third-party integrations 
When integrating with third-party code such as browser APIs or UI libraries, it may be necessary to force React to flush updates. Use flushSync to force React to flush any state updates inside the callback synchronously:
flushSync(() => {
 setSomething(123);
});
// By this line, the DOM is updated.
This ensures that, by the time the next line of code runs, React has already updated the DOM.
Using flushSync is uncommon, and using it often can significantly hurt the performance of your app. If your app only uses React APIs, and does not integrate with third-party libraries, flushSync should be unnecessary.
However, it can be helpful for integrating with third-party code like browser APIs.
Some browser APIs expect results inside of callbacks to be written to the DOM synchronously, by the end of the callback, so the browser can do something with the rendered DOM. In most cases, React handles this for you automatically. But in some cases it may be necessary to force a synchronous update.
For example, the browser onbeforeprint API allows you to change the page immediately before the print dialog opens. This is useful for applying custom print styles that allow the document to display better for printing. In the example below, you use flushSync inside of the onbeforeprint callback to immediately “flush” the React state to the DOM. Then, by the time the print dialog opens, isPrinting displays “yes”:
App.js
DownloadReset
Fork
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}


Show more
Without flushSync, the print dialog will display isPrinting as “no”. This is because React batches the updates asynchronously and the print dialog is displayed before the state is updated.
Pitfall
flushSync can significantly hurt performance, and may unexpectedly force pending Suspense boundaries to show their fallback state.
Most of the time, flushSync can be avoided, so use flushSync as a last resort.
PreviouscreatePortal
Nextpreconnect

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
flushSync(callback)
Usage
Flushing updates for third-party integrations
flushSync – React
preconnect
preconnect lets you eagerly connect to a server that you expect to load resources from.
preconnect("https://example.com");
Reference
preconnect(href)
Usage
Preconnecting when rendering
Preconnecting in an event handler

Reference 
preconnect(href) 
To preconnect to a host, call the preconnect function from react-dom.
import { preconnect } from 'react-dom';

function AppRoot() {
 preconnect("https://example.com");
 // ...
}
See more examples below.
The preconnect function provides the browser with a hint that it should open a connection to the given server. If the browser chooses to do so, this can speed up the loading of resources from that server.
Parameters 
href: a string. The URL of the server you want to connect to.
Returns 
preconnect returns nothing.
Caveats 
Multiple calls to preconnect with the same server have the same effect as a single call.
In the browser, you can call preconnect in any situation: while rendering a component, in an Effect, in an event handler, and so on.
In server-side rendering or when rendering Server Components, preconnect only has an effect if you call it while rendering a component or in an async context originating from rendering a component. Any other calls will be ignored.
If you know the specific resources you’ll need, you can call other functions instead that will start loading the resources right away.
There is no benefit to preconnecting to the same server the webpage itself is hosted from because it’s already been connected to by the time the hint would be given.

Usage 
Preconnecting when rendering 
Call preconnect when rendering a component if you know that its children will load external resources from that host.
import { preconnect } from 'react-dom';

function AppRoot() {
 preconnect("https://example.com");
 return ...;
}
Preconnecting in an event handler 
Call preconnect in an event handler before transitioning to a page or state where external resources will be needed. This gets the process started earlier than if you call it during the rendering of the new page or state.
import { preconnect } from 'react-dom';

function CallToAction() {
 const onClick = () => {
   preconnect('http://example.com');
   startWizard();
 }
 return (
   <button onClick={onClick}>Start Wizard</button>
 );
}
PreviousflushSync
NextprefetchDNS

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
preconnect(href)
Usage
Preconnecting when rendering
Preconnecting in an event handler
preconnect – React
prefetchDNS
prefetchDNS lets you eagerly look up the IP of a server that you expect to load resources from.
prefetchDNS("https://example.com");
Reference
prefetchDNS(href)
Usage
Prefetching DNS when rendering
Prefetching DNS in an event handler

Reference 
prefetchDNS(href) 
To look up a host, call the prefetchDNS function from react-dom.
import { prefetchDNS } from 'react-dom';

function AppRoot() {
 prefetchDNS("https://example.com");
 // ...
}
See more examples below.
The prefetchDNS function provides the browser with a hint that it should look up the IP address of a given server. If the browser chooses to do so, this can speed up the loading of resources from that server.
Parameters 
href: a string. The URL of the server you want to connect to.
Returns 
prefetchDNS returns nothing.
Caveats 
Multiple calls to prefetchDNS with the same server have the same effect as a single call.
In the browser, you can call prefetchDNS in any situation: while rendering a component, in an Effect, in an event handler, and so on.
In server-side rendering or when rendering Server Components, prefetchDNS only has an effect if you call it while rendering a component or in an async context originating from rendering a component. Any other calls will be ignored.
If you know the specific resources you’ll need, you can call other functions instead that will start loading the resources right away.
There is no benefit to prefetching the same server the webpage itself is hosted from because it’s already been looked up by the time the hint would be given.
Compared with preconnect, prefetchDNS may be better if you are speculatively connecting to a large number of domains, in which case the overhead of preconnections might outweigh the benefit.

Usage 
Prefetching DNS when rendering 
Call prefetchDNS when rendering a component if you know that its children will load external resources from that host.
import { prefetchDNS } from 'react-dom';

function AppRoot() {
 prefetchDNS("https://example.com");
 return ...;
}
Prefetching DNS in an event handler 
Call prefetchDNS in an event handler before transitioning to a page or state where external resources will be needed. This gets the process started earlier than if you call it during the rendering of the new page or state.
import { prefetchDNS } from 'react-dom';

function CallToAction() {
 const onClick = () => {
   prefetchDNS('http://example.com');
   startWizard();
 }
 return (
   <button onClick={onClick}>Start Wizard</button>
 );
}
Previouspreconnect
Nextpreinit

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
prefetchDNS(href)
Usage
Prefetching DNS when rendering
Prefetching DNS in an event handler
prefetchDNS – React
preinit
Note
React-based frameworks frequently handle resource loading for you, so you might not have to call this API yourself. Consult your framework’s documentation for details.
preinit lets you eagerly fetch and evaluate a stylesheet or external script.
preinit("https://example.com/script.js", {as: "script"});
Reference
preinit(href, options)
Usage
Preiniting when rendering
Preiniting in an event handler

Reference 
preinit(href, options) 
To preinit a script or stylesheet, call the preinit function from react-dom.
import { preinit } from 'react-dom';

function AppRoot() {
 preinit("https://example.com/script.js", {as: "script"});
 // ...
}
See more examples below.
The preinit function provides the browser with a hint that it should start downloading and executing the given resource, which can save time. Scripts that you preinit are executed when they finish downloading. Stylesheets that you preinit are inserted into the document, which causes them to go into effect right away.
Parameters 
href: a string. The URL of the resource you want to download and execute.
options: an object. It contains the following properties:
as: a required string. The type of resource. Its possible values are script and style.
precedence: a string. Required with stylesheets. Says where to insert the stylesheet relative to others. Stylesheets with higher precedence can override those with lower precedence. The possible values are reset, low, medium, high.
crossOrigin: a string. The CORS policy to use. Its possible values are anonymous and use-credentials.
integrity: a string. A cryptographic hash of the resource, to verify its authenticity.
nonce: a string. A cryptographic nonce to allow the resource when using a strict Content Security Policy.
fetchPriority: a string. Suggests a relative priority for fetching the resource. The possible values are auto (the default), high, and low.
Returns 
preinit returns nothing.
Caveats 
Multiple calls to preinit with the same href have the same effect as a single call.
In the browser, you can call preinit in any situation: while rendering a component, in an Effect, in an event handler, and so on.
In server-side rendering or when rendering Server Components, preinit only has an effect if you call it while rendering a component or in an async context originating from rendering a component. Any other calls will be ignored.

Usage 
Preiniting when rendering 
Call preinit when rendering a component if you know that it or its children will use a specific resource, and you’re OK with the resource being evaluated and thereby taking effect immediately upon being downloaded.
Examples of preiniting
1. Preiniting an external script2. Preiniting a stylesheet
Example 1 of 2: Preiniting an external script 
import { preinit } from 'react-dom';

function AppRoot() {
 preinit("https://example.com/script.js", {as: "script"});
 return ...;
}
If you want the browser to download the script but not to execute it right away, use preload instead. If you want to load an ESM module, use preinitModule.
Next Example
Preiniting in an event handler 
Call preinit in an event handler before transitioning to a page or state where external resources will be needed. This gets the process started earlier than if you call it during the rendering of the new page or state.
import { preinit } from 'react-dom';

function CallToAction() {
 const onClick = () => {
   preinit("https://example.com/wizardStyles.css", {as: "style"});
   startWizard();
 }
 return (
   <button onClick={onClick}>Start Wizard</button>
 );
}
PreviousprefetchDNS
NextpreinitModule

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
preinit(href, options)
Usage
Preiniting when rendering
Preiniting in an event handler
preinit – React
preinitModule
Note
React-based frameworks frequently handle resource loading for you, so you might not have to call this API yourself. Consult your framework’s documentation for details.
preinitModule lets you eagerly fetch and evaluate an ESM module.
preinitModule("https://example.com/module.js", {as: "script"});
Reference
preinitModule(href, options)
Usage
Preloading when rendering
Preloading in an event handler

Reference 
preinitModule(href, options) 
To preinit an ESM module, call the preinitModule function from react-dom.
import { preinitModule } from 'react-dom';

function AppRoot() {
 preinitModule("https://example.com/module.js", {as: "script"});
 // ...
}
See more examples below.
The preinitModule function provides the browser with a hint that it should start downloading and executing the given module, which can save time. Modules that you preinit are executed when they finish downloading.
Parameters 
href: a string. The URL of the module you want to download and execute.
options: an object. It contains the following properties:
as: a required string. It must be 'script'.
crossOrigin: a string. The CORS policy to use. Its possible values are anonymous and use-credentials.
integrity: a string. A cryptographic hash of the module, to verify its authenticity.
nonce: a string. A cryptographic nonce to allow the module when using a strict Content Security Policy.
Returns 
preinitModule returns nothing.
Caveats 
Multiple calls to preinitModule with the same href have the same effect as a single call.
In the browser, you can call preinitModule in any situation: while rendering a component, in an Effect, in an event handler, and so on.
In server-side rendering or when rendering Server Components, preinitModule only has an effect if you call it while rendering a component or in an async context originating from rendering a component. Any other calls will be ignored.

Usage 
Preloading when rendering 
Call preinitModule when rendering a component if you know that it or its children will use a specific module and you’re OK with the module being evaluated and thereby taking effect immediately upon being downloaded.
import { preinitModule } from 'react-dom';

function AppRoot() {
 preinitModule("https://example.com/module.js", {as: "script"});
 return ...;
}
If you want the browser to download the module but not to execute it right away, use preloadModule instead. If you want to preinit a script that isn’t an ESM module, use preinit.
Preloading in an event handler 
Call preinitModule in an event handler before transitioning to a page or state where the module will be needed. This gets the process started earlier than if you call it during the rendering of the new page or state.
import { preinitModule } from 'react-dom';

function CallToAction() {
 const onClick = () => {
   preinitModule("https://example.com/module.js", {as: "script"});
   startWizard();
 }
 return (
   <button onClick={onClick}>Start Wizard</button>
 );
}
Previouspreinit
Nextpreload

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
preinitModule(href, options)
Usage
Preloading when rendering
Preloading in an event handler
preinitModule – React
preload
Note
React-based frameworks frequently handle resource loading for you, so you might not have to call this API yourself. Consult your framework’s documentation for details.
preload lets you eagerly fetch a resource such as a stylesheet, font, or external script that you expect to use.
preload("https://example.com/font.woff2", {as: "font"});
Reference
preload(href, options)
Usage
Preloading when rendering
Preloading in an event handler

Reference 
preload(href, options) 
To preload a resource, call the preload function from react-dom.
import { preload } from 'react-dom';

function AppRoot() {
 preload("https://example.com/font.woff2", {as: "font"});
 // ...
}
See more examples below.
The preload function provides the browser with a hint that it should start downloading the given resource, which can save time.
Parameters 
href: a string. The URL of the resource you want to download.
options: an object. It contains the following properties:
as: a required string. The type of resource. Its possible values are audio, document, embed, fetch, font, image, object, script, style, track, video, worker.
crossOrigin: a string. The CORS policy to use. Its possible values are anonymous and use-credentials. It is required when as is set to "fetch".
referrerPolicy: a string. The Referrer header to send when fetching. Its possible values are no-referrer-when-downgrade (the default), no-referrer, origin, origin-when-cross-origin, and unsafe-url.
integrity: a string. A cryptographic hash of the resource, to verify its authenticity.
type: a string. The MIME type of the resource.
nonce: a string. A cryptographic nonce to allow the resource when using a strict Content Security Policy.
fetchPriority: a string. Suggests a relative priority for fetching the resource. The possible values are auto (the default), high, and low.
imageSrcSet: a string. For use only with as: "image". Specifies the source set of the image.
imageSizes: a string. For use only with as: "image". Specifies the sizes of the image.
Returns 
preload returns nothing.
Caveats 
Multiple equivalent calls to preload have the same effect as a single call. Calls to preload are considered equivalent according to the following rules:
Two calls are equivalent if they have the same href, except:
If as is set to image, two calls are equivalent if they have the same href, imageSrcSet, and imageSizes.
In the browser, you can call preload in any situation: while rendering a component, in an Effect, in an event handler, and so on.
In server-side rendering or when rendering Server Components, preload only has an effect if you call it while rendering a component or in an async context originating from rendering a component. Any other calls will be ignored.

Usage 
Preloading when rendering 
Call preload when rendering a component if you know that it or its children will use a specific resource.
Examples of preloading
1. Preloading an external script2. Preloading a stylesheet3. Preloading a font4. Preloading an image
Example 1 of 4: Preloading an external script 
import { preload } from 'react-dom';

function AppRoot() {
 preload("https://example.com/script.js", {as: "script"});
 return ...;
}
If you want the browser to start executing the script immediately (rather than just downloading it), use preinit instead. If you want to load an ESM module, use preloadModule.
Next Example
Preloading in an event handler 
Call preload in an event handler before transitioning to a page or state where external resources will be needed. This gets the process started earlier than if you call it during the rendering of the new page or state.
import { preload } from 'react-dom';

function CallToAction() {
 const onClick = () => {
   preload("https://example.com/wizardStyles.css", {as: "style"});
   startWizard();
 }
 return (
   <button onClick={onClick}>Start Wizard</button>
 );
}
PreviouspreinitModule
NextpreloadModule

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
preload(href, options)
Usage
Preloading when rendering
Preloading in an event handler
preload – React
preloadModule
Note
React-based frameworks frequently handle resource loading for you, so you might not have to call this API yourself. Consult your framework’s documentation for details.
preloadModule lets you eagerly fetch an ESM module that you expect to use.
preloadModule("https://example.com/module.js", {as: "script"});
Reference
preloadModule(href, options)
Usage
Preloading when rendering
Preloading in an event handler

Reference 
preloadModule(href, options) 
To preload an ESM module, call the preloadModule function from react-dom.
import { preloadModule } from 'react-dom';

function AppRoot() {
 preloadModule("https://example.com/module.js", {as: "script"});
 // ...
}
See more examples below.
The preloadModule function provides the browser with a hint that it should start downloading the given module, which can save time.
Parameters 
href: a string. The URL of the module you want to download.
options: an object. It contains the following properties:
as: a required string. It must be 'script'.
crossOrigin: a string. The CORS policy to use. Its possible values are anonymous and use-credentials.
integrity: a string. A cryptographic hash of the module, to verify its authenticity.
nonce: a string. A cryptographic nonce to allow the module when using a strict Content Security Policy.
Returns 
preloadModule returns nothing.
Caveats 
Multiple calls to preloadModule with the same href have the same effect as a single call.
In the browser, you can call preloadModule in any situation: while rendering a component, in an Effect, in an event handler, and so on.
In server-side rendering or when rendering Server Components, preloadModule only has an effect if you call it while rendering a component or in an async context originating from rendering a component. Any other calls will be ignored.

Usage 
Preloading when rendering 
Call preloadModule when rendering a component if you know that it or its children will use a specific module.
import { preloadModule } from 'react-dom';

function AppRoot() {
 preloadModule("https://example.com/module.js", {as: "script"});
 return ...;
}
If you want the browser to start executing the module immediately (rather than just downloading it), use preinitModule instead. If you want to load a script that isn’t an ESM module, use preload.
Preloading in an event handler 
Call preloadModule in an event handler before transitioning to a page or state where the module will be needed. This gets the process started earlier than if you call it during the rendering of the new page or state.
import { preloadModule } from 'react-dom';

function CallToAction() {
 const onClick = () => {
   preloadModule("https://example.com/module.js", {as: "script"});
   startWizard();
 }
 return (
   <button onClick={onClick}>Start Wizard</button>
 );
}
Previouspreload
NextClient APIs

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
preloadModule(href, options)
Usage
Preloading when rendering
Preloading in an event handler
preloadModule – React
Client React DOM APIs
The react-dom/client APIs let you render React components on the client (in the browser). These APIs are typically used at the top level of your app to initialize your React tree. A framework may call them for you. Most of your components don’t need to import or use them.

Client APIs 
createRoot lets you create a root to display React components inside a browser DOM node.
hydrateRoot lets you display React components inside a browser DOM node whose HTML content was previously generated by react-dom/server.

Browser support 
React supports all popular browsers, including Internet Explorer 9 and above. Some polyfills are required for older browsers such as IE 9 and IE 10.
PreviouspreloadModule
NextcreateRoot

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Client APIs
Browser support
Client React DOM APIs – React
createRoot
createRoot lets you create a root to display React components inside a browser DOM node.
const root = createRoot(domNode, options?)
Reference
createRoot(domNode, options?)
root.render(reactNode)
root.unmount()
Usage
Rendering an app fully built with React
Rendering a page partially built with React
Updating a root component
Error logging in production
Troubleshooting
I’ve created a root, but nothing is displayed
I’m getting an error: “You passed a second argument to root.render”
I’m getting an error: “Target container is not a DOM element”
I’m getting an error: “Functions are not valid as a React child.”
My server-rendered HTML gets re-created from scratch

Reference 
createRoot(domNode, options?) 
Call createRoot to create a React root for displaying content inside a browser DOM element.
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
React will create a root for the domNode, and take over managing the DOM inside it. After you’ve created a root, you need to call root.render to display a React component inside of it:
root.render(<App />);
An app fully built with React will usually only have one createRoot call for its root component. A page that uses “sprinkles” of React for parts of the page may have as many separate roots as needed.
See more examples below.
Parameters 
domNode: A DOM element. React will create a root for this DOM element and allow you to call functions on the root, such as render to display rendered React content.
optional options: An object with options for this React root.
optional onCaughtError: Callback called when React catches an error in an Error Boundary. Called with the error caught by the Error Boundary, and an errorInfo object containing the componentStack.
optional onUncaughtError: Callback called when an error is thrown and not caught by an Error Boundary. Called with the error that was thrown, and an errorInfo object containing the componentStack.
optional onRecoverableError: Callback called when React automatically recovers from errors. Called with an error React throws, and an errorInfo object containing the componentStack. Some recoverable errors may include the original error cause as error.cause.
optional identifierPrefix: A string prefix React uses for IDs generated by useId. Useful to avoid conflicts when using multiple roots on the same page.
Returns 
createRoot returns an object with two methods: render and unmount.
Caveats 
If your app is server-rendered, using createRoot() is not supported. Use hydrateRoot() instead.
You’ll likely have only one createRoot call in your app. If you use a framework, it might do this call for you.
When you want to render a piece of JSX in a different part of the DOM tree that isn’t a child of your component (for example, a modal or a tooltip), use createPortal instead of createRoot.

root.render(reactNode) 
Call root.render to display a piece of JSX (“React node”) into the React root’s browser DOM node.
root.render(<App />);
React will display <App /> in the root, and take over managing the DOM inside it.
See more examples below.
Parameters 
reactNode: A React node that you want to display. This will usually be a piece of JSX like <App />, but you can also pass a React element constructed with createElement(), a string, a number, null, or undefined.
Returns 
root.render returns undefined.
Caveats 
The first time you call root.render, React will clear all the existing HTML content inside the React root before rendering the React component into it.
If your root’s DOM node contains HTML generated by React on the server or during the build, use hydrateRoot() instead, which attaches the event handlers to the existing HTML.
If you call render on the same root more than once, React will update the DOM as necessary to reflect the latest JSX you passed. React will decide which parts of the DOM can be reused and which need to be recreated by “matching it up” with the previously rendered tree. Calling render on the same root again is similar to calling the set function on the root component: React avoids unnecessary DOM updates.
Although rendering is synchronous once it starts, root.render(...) is not. This means code after root.render() may run before any effects (useLayoutEffect, useEffect) of that specific render are fired. This is usually fine and rarely needs adjustment. In rare cases where effect timing matters, you can wrap root.render(...) in flushSync to ensure the initial render runs fully synchronously.
const root = createRoot(document.getElementById('root'));
root.render(<App />);
// 🚩 The HTML will not include the rendered <App /> yet:
console.log(document.body.innerHTML);

root.unmount() 
Call root.unmount to destroy a rendered tree inside a React root.
root.unmount();
An app fully built with React will usually not have any calls to root.unmount.
This is mostly useful if your React root’s DOM node (or any of its ancestors) may get removed from the DOM by some other code. For example, imagine a jQuery tab panel that removes inactive tabs from the DOM. If a tab gets removed, everything inside it (including the React roots inside) would get removed from the DOM as well. In that case, you need to tell React to “stop” managing the removed root’s content by calling root.unmount. Otherwise, the components inside the removed root won’t know to clean up and free up global resources like subscriptions.
Calling root.unmount will unmount all the components in the root and “detach” React from the root DOM node, including removing any event handlers or state in the tree.
Parameters 
root.unmount does not accept any parameters.
Returns 
root.unmount returns undefined.
Caveats 
Calling root.unmount will unmount all the components in the tree and “detach” React from the root DOM node.
Once you call root.unmount you cannot call root.render again on the same root. Attempting to call root.render on an unmounted root will throw a “Cannot update an unmounted root” error. However, you can create a new root for the same DOM node after the previous root for that node has been unmounted.

Usage 
Rendering an app fully built with React 
If your app is fully built with React, create a single root for your entire app.
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
Usually, you only need to run this code once at startup. It will:
Find the browser DOM node defined in your HTML.
Display the React component for your app inside.
index.jsindex.htmlApp.js
Reset
Fork
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);


If your app is fully built with React, you shouldn’t need to create any more roots, or to call root.render again.
From this point on, React will manage the DOM of your entire app. To add more components, nest them inside the App component. When you need to update the UI, each of your components can do this by using state. When you need to display extra content like a modal or a tooltip outside the DOM node, render it with a portal.
Note
When your HTML is empty, the user sees a blank page until the app’s JavaScript code loads and runs:
<div id="root"></div>
This can feel very slow! To solve this, you can generate the initial HTML from your components on the server or during the build. Then your visitors can read text, see images, and click links before any of the JavaScript code loads. We recommend using a framework that does this optimization out of the box. Depending on when it runs, this is called server-side rendering (SSR) or static site generation (SSG).
Pitfall
Apps using server rendering or static generation must call hydrateRoot instead of createRoot. React will then hydrate (reuse) the DOM nodes from your HTML instead of destroying and re-creating them.

Rendering a page partially built with React 
If your page isn’t fully built with React, you can call createRoot multiple times to create a root for each top-level piece of UI managed by React. You can display different content in each root by calling root.render.
Here, two different React components are rendered into two DOM nodes defined in the index.html file:
index.jsindex.htmlComponents.js
Reset
Fork
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);


You could also create a new DOM node with document.createElement() and add it to the document manually.
const domNode = document.createElement('div');
const root = createRoot(domNode);
root.render(<Comment />);
document.body.appendChild(domNode); // You can add it anywhere in the document
To remove the React tree from the DOM node and clean up all the resources used by it, call root.unmount.
root.unmount();
This is mostly useful if your React components are inside an app written in a different framework.

Updating a root component 
You can call render more than once on the same root. As long as the component tree structure matches up with what was previously rendered, React will preserve the state. Notice how you can type in the input, which means that the updates from repeated render calls every second in this example are not destructive:
index.jsApp.js
Reset
Fork
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);


It is uncommon to call render multiple times. Usually, your components will update state instead.
Error logging in production 
By default, React will log all errors to the console. To implement your own error reporting, you can provide the optional error handler root options onUncaughtError, onCaughtError and onRecoverableError:
import { createRoot } from "react-dom/client";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
 onCaughtError: (error, errorInfo) => {
   if (error.message !== "Known error") {
     reportCaughtError({
       error,
       componentStack: errorInfo.componentStack,
     });
   }
 },
});
The onCaughtError option is a function called with two arguments:
The error that was thrown.
An errorInfo object that contains the componentStack of the error.
Together with onUncaughtError and onRecoverableError, you can can implement your own error reporting system:
index.jsreportError.jsApp.js
Reset
Fork
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
  // Keep in mind to remove these options in development to leverage
  // React's default handlers or implement your own overlay for development.
  // The handlers are only specfied unconditionally here for demonstration purposes.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
root.render(<App />);


Show more
Troubleshooting 
I’ve created a root, but nothing is displayed 
Make sure you haven’t forgotten to actually render your app into the root:
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
Until you do that, nothing is displayed.

I’m getting an error: “You passed a second argument to root.render” 
A common mistake is to pass the options for createRoot to root.render(...):
Console
Warning: You passed a second argument to root.render(…) but it only accepts one argument.
To fix, pass the root options to createRoot(...), not root.render(...):
// 🚩 Wrong: root.render only takes one argument.
root.render(App, {onUncaughtError});

// ✅ Correct: pass options to createRoot.
const root = createRoot(container, {onUncaughtError});
root.render(<App />);

I’m getting an error: “Target container is not a DOM element” 
This error means that whatever you’re passing to createRoot is not a DOM node.
If you’re not sure what’s happening, try logging it:
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
For example, if domNode is null, it means that getElementById returned null. This will happen if there is no node in the document with the given ID at the time of your call. There may be a few reasons for it:
The ID you’re looking for might differ from the ID you used in the HTML file. Check for typos!
Your bundle’s <script> tag cannot “see” any DOM nodes that appear after it in the HTML.
Another common way to get this error is to write createRoot(<App />) instead of createRoot(domNode).

I’m getting an error: “Functions are not valid as a React child.” 
This error means that whatever you’re passing to root.render is not a React component.
This may happen if you call root.render with Component instead of <Component />:
// 🚩 Wrong: App is a function, not a Component.
root.render(App);

// ✅ Correct: <App /> is a component.
root.render(<App />);
Or if you pass a function to root.render, instead of the result of calling it:
// 🚩 Wrong: createApp is a function, not a component.
root.render(createApp);

// ✅ Correct: call createApp to return a component.
root.render(createApp());

My server-rendered HTML gets re-created from scratch 
If your app is server-rendered and includes the initial HTML generated by React, you might notice that creating a root and calling root.render deletes all that HTML, and then re-creates all the DOM nodes from scratch. This can be slower, resets focus and scroll positions, and may lose other user input.
Server-rendered apps must use hydrateRoot instead of createRoot:
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
 document.getElementById('root'),
 <App />
);
Note that its API is different. In particular, usually there will be no further root.render call.
PreviousClient APIs
NexthydrateRoot

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
createRoot(domNode, options?)
root.render(reactNode)
root.unmount()
Usage
Rendering an app fully built with React
Rendering a page partially built with React
Updating a root component
Error logging in production
Troubleshooting
I’ve created a root, but nothing is displayed
I’m getting an error: “You passed a second argument to root.render”
I’m getting an error: “Target container is not a DOM element”
I’m getting an error: “Functions are not valid as a React child.”
My server-rendered HTML gets re-created from scratch
createRoot – React
hydrateRoot
hydrateRoot lets you display React components inside a browser DOM node whose HTML content was previously generated by react-dom/server.
const root = hydrateRoot(domNode, reactNode, options?)
Reference
hydrateRoot(domNode, reactNode, options?)
root.render(reactNode)
root.unmount()
Usage
Hydrating server-rendered HTML
Hydrating an entire document
Suppressing unavoidable hydration mismatch errors
Handling different client and server content
Updating a hydrated root component
Error logging in production
Troubleshooting
I’m getting an error: “You passed a second argument to root.render”

Reference 
hydrateRoot(domNode, reactNode, options?) 
Call hydrateRoot to “attach” React to existing HTML that was already rendered by React in a server environment.
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
React will attach to the HTML that exists inside the domNode, and take over managing the DOM inside it. An app fully built with React will usually only have one hydrateRoot call with its root component.
See more examples below.
Parameters 
domNode: A DOM element that was rendered as the root element on the server.
reactNode: The “React node” used to render the existing HTML. This will usually be a piece of JSX like <App /> which was rendered with a ReactDOM Server method such as renderToPipeableStream(<App />).
optional options: An object with options for this React root.
optional onCaughtError: Callback called when React catches an error in an Error Boundary. Called with the error caught by the Error Boundary, and an errorInfo object containing the componentStack.
optional onUncaughtError: Callback called when an error is thrown and not caught by an Error Boundary. Called with the error that was thrown and an errorInfo object containing the componentStack.
optional onRecoverableError: Callback called when React automatically recovers from errors. Called with the error React throws, and an errorInfo object containing the componentStack. Some recoverable errors may include the original error cause as error.cause.
optional identifierPrefix: A string prefix React uses for IDs generated by useId. Useful to avoid conflicts when using multiple roots on the same page. Must be the same prefix as used on the server.
Returns 
hydrateRoot returns an object with two methods: render and unmount.
Caveats 
hydrateRoot() expects the rendered content to be identical with the server-rendered content. You should treat mismatches as bugs and fix them.
In development mode, React warns about mismatches during hydration. There are no guarantees that attribute differences will be patched up in case of mismatches. This is important for performance reasons because in most apps, mismatches are rare, and so validating all markup would be prohibitively expensive.
You’ll likely have only one hydrateRoot call in your app. If you use a framework, it might do this call for you.
If your app is client-rendered with no HTML rendered already, using hydrateRoot() is not supported. Use createRoot() instead.

root.render(reactNode) 
Call root.render to update a React component inside a hydrated React root for a browser DOM element.
root.render(<App />);
React will update <App /> in the hydrated root.
See more examples below.
Parameters 
reactNode: A “React node” that you want to update. This will usually be a piece of JSX like <App />, but you can also pass a React element constructed with createElement(), a string, a number, null, or undefined.
Returns 
root.render returns undefined.
Caveats 
If you call root.render before the root has finished hydrating, React will clear the existing server-rendered HTML content and switch the entire root to client rendering.

root.unmount() 
Call root.unmount to destroy a rendered tree inside a React root.
root.unmount();
An app fully built with React will usually not have any calls to root.unmount.
This is mostly useful if your React root’s DOM node (or any of its ancestors) may get removed from the DOM by some other code. For example, imagine a jQuery tab panel that removes inactive tabs from the DOM. If a tab gets removed, everything inside it (including the React roots inside) would get removed from the DOM as well. You need to tell React to “stop” managing the removed root’s content by calling root.unmount. Otherwise, the components inside the removed root won’t clean up and free up resources like subscriptions.
Calling root.unmount will unmount all the components in the root and “detach” React from the root DOM node, including removing any event handlers or state in the tree.
Parameters 
root.unmount does not accept any parameters.
Returns 
root.unmount returns undefined.
Caveats 
Calling root.unmount will unmount all the components in the tree and “detach” React from the root DOM node.
Once you call root.unmount you cannot call root.render again on the root. Attempting to call root.render on an unmounted root will throw a “Cannot update an unmounted root” error.

Usage 
Hydrating server-rendered HTML 
If your app’s HTML was generated by react-dom/server, you need to hydrate it on the client.
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
This will hydrate the server HTML inside the browser DOM node with the React component for your app. Usually, you will do it once at startup. If you use a framework, it might do this behind the scenes for you.
To hydrate your app, React will “attach” your components’ logic to the initial generated HTML from the server. Hydration turns the initial HTML snapshot from the server into a fully interactive app that runs in the browser.
index.jsindex.htmlApp.js
Reset
Fork
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);


You shouldn’t need to call hydrateRoot again or to call it in more places. From this point on, React will be managing the DOM of your application. To update the UI, your components will use state instead.
Pitfall
The React tree you pass to hydrateRoot needs to produce the same output as it did on the server.
This is important for the user experience. The user will spend some time looking at the server-generated HTML before your JavaScript code loads. Server rendering creates an illusion that the app loads faster by showing the HTML snapshot of its output. Suddenly showing different content breaks that illusion. This is why the server render output must match the initial render output on the client.
The most common causes leading to hydration errors include:
Extra whitespace (like newlines) around the React-generated HTML inside the root node.
Using checks like typeof window !== 'undefined' in your rendering logic.
Using browser-only APIs like window.matchMedia in your rendering logic.
Rendering different data on the server and the client.
React recovers from some hydration errors, but you must fix them like other bugs. In the best case, they’ll lead to a slowdown; in the worst case, event handlers can get attached to the wrong elements.

Hydrating an entire document 
Apps fully built with React can render the entire document as JSX, including the <html> tag:
function App() {
 return (
   <html>
     <head>
       <meta charSet="utf-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       <link rel="stylesheet" href="/styles.css"></link>
       <title>My app</title>
     </head>
     <body>
       <Router />
     </body>
   </html>
 );
}
To hydrate the entire document, pass the document global as the first argument to hydrateRoot:
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);

Suppressing unavoidable hydration mismatch errors 
If a single element’s attribute or text content is unavoidably different between the server and the client (for example, a timestamp), you may silence the hydration mismatch warning.
To silence hydration warnings on an element, add suppressHydrationWarning={true}:
index.jsindex.htmlApp.js
Reset
Fork
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}


This only works one level deep, and is intended to be an escape hatch. Don’t overuse it. React will not attempt to patch mismatched text content.

Handling different client and server content 
If you intentionally need to render something different on the server and the client, you can do a two-pass rendering. Components that render something different on the client can read a state variable like isClient, which you can set to true in an Effect:
index.jsindex.htmlApp.js
Reset
Fork
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}


This way the initial render pass will render the same content as the server, avoiding mismatches, but an additional pass will happen synchronously right after hydration.
Pitfall
This approach makes hydration slower because your components have to render twice. Be mindful of the user experience on slow connections. The JavaScript code may load significantly later than the initial HTML render, so rendering a different UI immediately after hydration may also feel jarring to the user.

Updating a hydrated root component 
After the root has finished hydrating, you can call root.render to update the root React component. Unlike with createRoot, you don’t usually need to do this because the initial content was already rendered as HTML.
If you call root.render at some point after hydration, and the component tree structure matches up with what was previously rendered, React will preserve the state. Notice how you can type in the input, which means that the updates from repeated render calls every second in this example are not destructive:
index.jsindex.htmlApp.js
Reset
Fork
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);


It is uncommon to call root.render on a hydrated root. Usually, you’ll update state inside one of the components instead.
Error logging in production 
By default, React will log all errors to the console. To implement your own error reporting, you can provide the optional error handler root options onUncaughtError, onCaughtError and onRecoverableError:
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
 onCaughtError: (error, errorInfo) => {
   if (error.message !== "Known error") {
     reportCaughtError({
       error,
       componentStack: errorInfo.componentStack,
     });
   }
 },
});
The onCaughtError option is a function called with two arguments:
The error that was thrown.
An errorInfo object that contains the componentStack of the error.
Together with onUncaughtError and onRecoverableError, you can implement your own error reporting system:
index.jsreportError.jsApp.js
Reset
Fork
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
hydrateRoot(container, <App />, {
  // Keep in mind to remove these options in development to leverage
  // React's default handlers or implement your own overlay for development.
  // The handlers are only specfied unconditionally here for demonstration purposes.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});


Show more
Troubleshooting 
I’m getting an error: “You passed a second argument to root.render” 
A common mistake is to pass the options for hydrateRoot to root.render(...):
Console
Warning: You passed a second argument to root.render(…) but it only accepts one argument.
To fix, pass the root options to hydrateRoot(...), not root.render(...):
// 🚩 Wrong: root.render only takes one argument.
root.render(App, {onUncaughtError});

// ✅ Correct: pass options to createRoot.
const root = hydrateRoot(container, <App />, {onUncaughtError});
PreviouscreateRoot
NextServer APIs

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
hydrateRoot(domNode, reactNode, options?)
root.render(reactNode)
root.unmount()
Usage
Hydrating server-rendered HTML
Hydrating an entire document
Suppressing unavoidable hydration mismatch errors
Handling different client and server content
Updating a hydrated root component
Error logging in production
Troubleshooting
I’m getting an error: “You passed a second argument to root.render”
hydrateRoot – React
Server React DOM APIs
The react-dom/server APIs let you server-side render React components to HTML. These APIs are only used on the server at the top level of your app to generate the initial HTML. A framework may call them for you. Most of your components don’t need to import or use them.

Server APIs for Node.js Streams 
These methods are only available in the environments with Node.js Streams:
renderToPipeableStream renders a React tree to a pipeable Node.js Stream.

Server APIs for Web Streams 
These methods are only available in the environments with Web Streams, which includes browsers, Deno, and some modern edge runtimes:
renderToReadableStream renders a React tree to a Readable Web Stream.

Legacy Server APIs for non-streaming environments 
These methods can be used in the environments that don’t support streams:
renderToString renders a React tree to a string.
renderToStaticMarkup renders a non-interactive React tree to a string.
They have limited functionality compared to the streaming APIs.
PrevioushydrateRoot
NextrenderToPipeableStream

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Server APIs for Node.js Streams
Server APIs for Web Streams
Legacy Server APIs for non-streaming environments
Server React DOM APIs – React
renderToPipeableStream
renderToPipeableStream renders a React tree to a pipeable Node.js Stream.
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
Reference
renderToPipeableStream(reactNode, options?)
Usage
Rendering a React tree as HTML to a Node.js Stream
Streaming more content as it loads
Specifying what goes into the shell
Logging crashes on the server
Recovering from errors inside the shell
Recovering from errors outside the shell
Setting the status code
Handling different errors in different ways
Waiting for all content to load for crawlers and static generation
Aborting server rendering
Note
This API is specific to Node.js. Environments with Web Streams, like Deno and modern edge runtimes, should use renderToReadableStream instead.

Reference 
renderToPipeableStream(reactNode, options?) 
Call renderToPipeableStream to render your React tree as HTML into a Node.js Stream.
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
 bootstrapScripts: ['/main.js'],
 onShellReady() {
   response.setHeader('content-type', 'text/html');
   pipe(response);
 }
});
On the client, call hydrateRoot to make the server-generated HTML interactive.
See more examples below.
Parameters 
reactNode: A React node you want to render to HTML. For example, a JSX element like <App />. It is expected to represent the entire document, so the App component should render the <html> tag.
optional options: An object with streaming options.
optional bootstrapScriptContent: If specified, this string will be placed in an inline <script> tag.
optional bootstrapScripts: An array of string URLs for the <script> tags to emit on the page. Use this to include the <script> that calls hydrateRoot. Omit it if you don’t want to run React on the client at all.
optional bootstrapModules: Like bootstrapScripts, but emits <script type="module"> instead.
optional identifierPrefix: A string prefix React uses for IDs generated by useId. Useful to avoid conflicts when using multiple roots on the same page. Must be the same prefix as passed to hydrateRoot.
optional namespaceURI: A string with the root namespace URI for the stream. Defaults to regular HTML. Pass 'http://www.w3.org/2000/svg' for SVG or 'http://www.w3.org/1998/Math/MathML' for MathML.
optional nonce: A nonce string to allow scripts for script-src Content-Security-Policy.
optional onAllReady: A callback that fires when all rendering is complete, including both the shell and all additional content. You can use this instead of onShellReady for crawlers and static generation. If you start streaming here, you won’t get any progressive loading. The stream will contain the final HTML.
optional onError: A callback that fires whenever there is a server error, whether recoverable or not. By default, this only calls console.error. If you override it to log crash reports, make sure that you still call console.error. You can also use it to adjust the status code before the shell is emitted.
optional onShellReady: A callback that fires right after the initial shell has been rendered. You can set the status code and call pipe here to start streaming. React will stream the additional content after the shell along with the inline <script> tags that replace the HTML loading fallbacks with the content.
optional onShellError: A callback that fires if there was an error rendering the initial shell. It receives the error as an argument. No bytes were emitted from the stream yet, and neither onShellReady nor onAllReady will get called, so you can output a fallback HTML shell.
optional progressiveChunkSize: The number of bytes in a chunk. Read more about the default heuristic.
Returns 
renderToPipeableStream returns an object with two methods:
pipe outputs the HTML into the provided Writable Node.js Stream. Call pipe in onShellReady if you want to enable streaming, or in onAllReady for crawlers and static generation.
abort lets you abort server rendering and render the rest on the client.

Usage 
Rendering a React tree as HTML to a Node.js Stream 
Call renderToPipeableStream to render your React tree as HTML into a Node.js Stream:
import { renderToPipeableStream } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
 const { pipe } = renderToPipeableStream(<App />, {
   bootstrapScripts: ['/main.js'],
   onShellReady() {
     response.setHeader('content-type', 'text/html');
     pipe(response);
   }
 });
});
Along with the root component, you need to provide a list of bootstrap <script> paths. Your root component should return the entire document including the root <html> tag.
For example, it might look like this:
export default function App() {
 return (
   <html>
     <head>
       <meta charSet="utf-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       <link rel="stylesheet" href="/styles.css"></link>
       <title>My app</title>
     </head>
     <body>
       <Router />
     </body>
   </html>
 );
}
React will inject the doctype and your bootstrap <script> tags into the resulting HTML stream:
<!DOCTYPE html>
<html>
 <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
On the client, your bootstrap script should hydrate the entire document with a call to hydrateRoot:
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
This will attach event listeners to the server-generated HTML and make it interactive.
Deep Dive
Reading CSS and JS asset paths from the build output 
Show Details













































Streaming more content as it loads 
Streaming allows the user to start seeing the content even before all the data has loaded on the server. For example, consider a profile page that shows a cover, a sidebar with friends and photos, and a list of posts:
function ProfilePage() {
 return (
   <ProfileLayout>
     <ProfileCover />
     <Sidebar>
       <Friends />
       <Photos />
     </Sidebar>
     <Posts />
   </ProfileLayout>
 );
}
Imagine that loading data for <Posts /> takes some time. Ideally, you’d want to show the rest of the profile page content to the user without waiting for the posts. To do this, wrap Posts in a <Suspense> boundary:
function ProfilePage() {
 return (
   <ProfileLayout>
     <ProfileCover />
     <Sidebar>
       <Friends />
       <Photos />
     </Sidebar>
     <Suspense fallback={<PostsGlimmer />}>
       <Posts />
     </Suspense>
   </ProfileLayout>
 );
}
This tells React to start streaming the HTML before Posts loads its data. React will send the HTML for the loading fallback (PostsGlimmer) first, and then, when Posts finishes loading its data, React will send the remaining HTML along with an inline <script> tag that replaces the loading fallback with that HTML. From the user’s perspective, the page will first appear with the PostsGlimmer, later replaced by the Posts.
You can further nest <Suspense> boundaries to create a more granular loading sequence:
function ProfilePage() {
 return (
   <ProfileLayout>
     <ProfileCover />
     <Suspense fallback={<BigSpinner />}>
       <Sidebar>
         <Friends />
         <Photos />
       </Sidebar>
       <Suspense fallback={<PostsGlimmer />}>
         <Posts />
       </Suspense>
     </Suspense>
   </ProfileLayout>
 );
}
In this example, React can start streaming the page even earlier. Only ProfileLayout and ProfileCover must finish rendering first because they are not wrapped in any <Suspense> boundary. However, if Sidebar, Friends, or Photos need to load some data, React will send the HTML for the BigSpinner fallback instead. Then, as more data becomes available, more content will continue to be revealed until all of it becomes visible.
Streaming does not need to wait for React itself to load in the browser, or for your app to become interactive. The HTML content from the server will get progressively revealed before any of the <script> tags load.
Read more about how streaming HTML works.
Note
Only Suspense-enabled data sources will activate the Suspense component. They include:
Data fetching with Suspense-enabled frameworks like Relay and Next.js
Lazy-loading component code with lazy
Reading the value of a Promise with use
Suspense does not detect when data is fetched inside an Effect or event handler.
The exact way you would load data in the Posts component above depends on your framework. If you use a Suspense-enabled framework, you’ll find the details in its data fetching documentation.
Suspense-enabled data fetching without the use of an opinionated framework is not yet supported. The requirements for implementing a Suspense-enabled data source are unstable and undocumented. An official API for integrating data sources with Suspense will be released in a future version of React.

Specifying what goes into the shell 
The part of your app outside of any <Suspense> boundaries is called the shell:
function ProfilePage() {
 return (
   <ProfileLayout>
     <ProfileCover />
     <Suspense fallback={<BigSpinner />}>
       <Sidebar>
         <Friends />
         <Photos />
       </Sidebar>
       <Suspense fallback={<PostsGlimmer />}>
         <Posts />
       </Suspense>
     </Suspense>
   </ProfileLayout>
 );
}
It determines the earliest loading state that the user may see:
<ProfileLayout>
 <ProfileCover />
 <BigSpinner />
</ProfileLayout>
If you wrap the whole app into a <Suspense> boundary at the root, the shell will only contain that spinner. However, that’s not a pleasant user experience because seeing a big spinner on the screen can feel slower and more annoying than waiting a bit more and seeing the real layout. This is why usually you’ll want to place the <Suspense> boundaries so that the shell feels minimal but complete—like a skeleton of the entire page layout.
The onShellReady callback fires when the entire shell has been rendered. Usually, you’ll start streaming then:
const { pipe } = renderToPipeableStream(<App />, {
 bootstrapScripts: ['/main.js'],
 onShellReady() {
   response.setHeader('content-type', 'text/html');
   pipe(response);
 }
});
By the time onShellReady fires, components in nested <Suspense> boundaries might still be loading data.

Logging crashes on the server 
By default, all errors on the server are logged to console. You can override this behavior to log crash reports:
const { pipe } = renderToPipeableStream(<App />, {
 bootstrapScripts: ['/main.js'],
 onShellReady() {
   response.setHeader('content-type', 'text/html');
   pipe(response);
 },
 onError(error) {
   console.error(error);
   logServerCrashReport(error);
 }
});
If you provide a custom onError implementation, don’t forget to also log errors to the console like above.

Recovering from errors inside the shell 
In this example, the shell contains ProfileLayout, ProfileCover, and PostsGlimmer:
function ProfilePage() {
 return (
   <ProfileLayout>
     <ProfileCover />
     <Suspense fallback={<PostsGlimmer />}>
       <Posts />
     </Suspense>
   </ProfileLayout>
 );
}
If an error occurs while rendering those components, React won’t have any meaningful HTML to send to the client. Override onShellError to send a fallback HTML that doesn’t rely on server rendering as the last resort:
const { pipe } = renderToPipeableStream(<App />, {
 bootstrapScripts: ['/main.js'],
 onShellReady() {
   response.setHeader('content-type', 'text/html');
   pipe(response);
 },
 onShellError(error) {
   response.statusCode = 500;
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Something went wrong</h1>');
 },
 onError(error) {
   console.error(error);
   logServerCrashReport(error);
 }
});
If there is an error while generating the shell, both onError and onShellError will fire. Use onError for error reporting and use onShellError to send the fallback HTML document. Your fallback HTML does not have to be an error page. Instead, you may include an alternative shell that renders your app on the client only.

Recovering from errors outside the shell 
In this example, the <Posts /> component is wrapped in <Suspense> so it is not a part of the shell:
function ProfilePage() {
 return (
   <ProfileLayout>
     <ProfileCover />
     <Suspense fallback={<PostsGlimmer />}>
       <Posts />
     </Suspense>
   </ProfileLayout>
 );
}
If an error happens in the Posts component or somewhere inside it, React will try to recover from it:
It will emit the loading fallback for the closest <Suspense> boundary (PostsGlimmer) into the HTML.
It will “give up” on trying to render the Posts content on the server anymore.
When the JavaScript code loads on the client, React will retry rendering Posts on the client.
If retrying rendering Posts on the client also fails, React will throw the error on the client. As with all the errors thrown during rendering, the closest parent error boundary determines how to present the error to the user. In practice, this means that the user will see a loading indicator until it is certain that the error is not recoverable.
If retrying rendering Posts on the client succeeds, the loading fallback from the server will be replaced with the client rendering output. The user will not know that there was a server error. However, the server onError callback and the client onRecoverableError callbacks will fire so that you can get notified about the error.

Setting the status code 
Streaming introduces a tradeoff. You want to start streaming the page as early as possible so that the user can see the content sooner. However, once you start streaming, you can no longer set the response status code.
By dividing your app into the shell (above all <Suspense> boundaries) and the rest of the content, you’ve already solved a part of this problem. If the shell errors, you’ll get the onShellError callback which lets you set the error status code. Otherwise, you know that the app may recover on the client, so you can send “OK”.
const { pipe } = renderToPipeableStream(<App />, {
 bootstrapScripts: ['/main.js'],
 onShellReady() {
   response.statusCode = 200;
   response.setHeader('content-type', 'text/html');
   pipe(response);
 },
 onShellError(error) {
   response.statusCode = 500;
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Something went wrong</h1>');
 },
 onError(error) {
   console.error(error);
   logServerCrashReport(error);
 }
});
If a component outside the shell (i.e. inside a <Suspense> boundary) throws an error, React will not stop rendering. This means that the onError callback will fire, but you will still get onShellReady instead of onShellError. This is because React will try to recover from that error on the client, as described above.
However, if you’d like, you can use the fact that something has errored to set the status code:
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
 bootstrapScripts: ['/main.js'],
 onShellReady() {
   response.statusCode = didError ? 500 : 200;
   response.setHeader('content-type', 'text/html');
   pipe(response);
 },
 onShellError(error) {
   response.statusCode = 500;
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Something went wrong</h1>');
 },
 onError(error) {
   didError = true;
   console.error(error);
   logServerCrashReport(error);
 }
});
This will only catch errors outside the shell that happened while generating the initial shell content, so it’s not exhaustive. If knowing whether an error occurred for some content is critical, you can move it up into the shell.

Handling different errors in different ways 
You can create your own Error subclasses and use the instanceof operator to check which error is thrown. For example, you can define a custom NotFoundError and throw it from your component. Then your onError, onShellReady, and onShellError callbacks can do something different depending on the error type:
let didError = false;
let caughtError = null;

function getStatusCode() {
 if (didError) {
   if (caughtError instanceof NotFoundError) {
     return 404;
   } else {
     return 500;
   }
 } else {
   return 200;
 }
}

const { pipe } = renderToPipeableStream(<App />, {
 bootstrapScripts: ['/main.js'],
 onShellReady() {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   pipe(response);
 },
 onShellError(error) {
  response.statusCode = getStatusCode();
  response.setHeader('content-type', 'text/html');
  response.send('<h1>Something went wrong</h1>');
 },
 onError(error) {
   didError = true;
   caughtError = error;
   console.error(error);
   logServerCrashReport(error);
 }
});
Keep in mind that once you emit the shell and start streaming, you can’t change the status code.

Waiting for all content to load for crawlers and static generation 
Streaming offers a better user experience because the user can see the content as it becomes available.
However, when a crawler visits your page, or if you’re generating the pages at the build time, you might want to let all of the content load first and then produce the final HTML output instead of revealing it progressively.
You can wait for all the content to load using the onAllReady callback:
let didError = false;
let isCrawler = // ... depends on your bot detection strategy ...

const { pipe } = renderToPipeableStream(<App />, {
 bootstrapScripts: ['/main.js'],
 onShellReady() {
   if (!isCrawler) {
     response.statusCode = didError ? 500 : 200;
     response.setHeader('content-type', 'text/html');
     pipe(response);
   }
 },
 onShellError(error) {
   response.statusCode = 500;
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Something went wrong</h1>');
 },
 onAllReady() {
   if (isCrawler) {
     response.statusCode = didError ? 500 : 200;
     response.setHeader('content-type', 'text/html');
     pipe(response);     
   }
 },
 onError(error) {
   didError = true;
   console.error(error);
   logServerCrashReport(error);
 }
});
A regular visitor will get a stream of progressively loaded content. A crawler will receive the final HTML output after all the data loads. However, this also means that the crawler will have to wait for all data, some of which might be slow to load or error. Depending on your app, you could choose to send the shell to the crawlers too.

Aborting server rendering 
You can force the server rendering to “give up” after a timeout:
const { pipe, abort } = renderToPipeableStream(<App />, {
 // ...
});

setTimeout(() => {
 abort();
}, 10000);
React will flush the remaining loading fallbacks as HTML, and will attempt to render the rest on the client.
PreviousServer APIs
NextrenderToReadableStream

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
renderToPipeableStream(reactNode, options?)
Usage
Rendering a React tree as HTML to a Node.js Stream
Streaming more content as it loads
Specifying what goes into the shell
Logging crashes on the server
Recovering from errors inside the shell
Recovering from errors outside the shell
Setting the status code
Handling different errors in different ways
Waiting for all content to load for crawlers and static generation
Aborting server rendering
renderToPipeableStream – React

renderToReadableStream
renderToReadableStream renders a React tree to a Readable Web Stream.
const stream = await renderToReadableStream(reactNode, options?)
Reference
renderToReadableStream(reactNode, options?)
Usage
Rendering a React tree as HTML to a Readable Web Stream
Streaming more content as it loads
Specifying what goes into the shell
Logging crashes on the server
Recovering from errors inside the shell
Recovering from errors outside the shell
Setting the status code
Handling different errors in different ways
Waiting for all content to load for crawlers and static generation
Aborting server rendering
Note
This API depends on Web Streams. For Node.js, use renderToPipeableStream instead.

Reference 
renderToReadableStream(reactNode, options?) 
Call renderToReadableStream to render your React tree as HTML into a Readable Web Stream.
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
 const stream = await renderToReadableStream(<App />, {
   bootstrapScripts: ['/main.js']
 });
 return new Response(stream, {
   headers: { 'content-type': 'text/html' },
 });
}
On the client, call hydrateRoot to make the server-generated HTML interactive.
See more examples below.
Parameters 
reactNode: A React node you want to render to HTML. For example, a JSX element like <App />. It is expected to represent the entire document, so the App component should render the <html> tag.
optional options: An object with streaming options.
optional bootstrapScriptContent: If specified, this string will be placed in an inline <script> tag.
optional bootstrapScripts: An array of string URLs for the <script> tags to emit on the page. Use this to include the <script> that calls hydrateRoot. Omit it if you don’t want to run React on the client at all.
optional bootstrapModules: Like bootstrapScripts, but emits <script type="module"> instead.
optional identifierPrefix: A string prefix React uses for IDs generated by useId. Useful to avoid conflicts when using multiple roots on the same page. Must be the same prefix as passed to hydrateRoot.
optional namespaceURI: A string with the root namespace URI for the stream. Defaults to regular HTML. Pass 'http://www.w3.org/2000/svg' for SVG or 'http://www.w3.org/1998/Math/MathML' for MathML.
optional nonce: A nonce string to allow scripts for script-src Content-Security-Policy.
optional onError: A callback that fires whenever there is a server error, whether recoverable or not. By default, this only calls console.error. If you override it to log crash reports, make sure that you still call console.error. You can also use it to adjust the status code before the shell is emitted.
optional progressiveChunkSize: The number of bytes in a chunk. Read more about the default heuristic.
optional signal: An abort signal that lets you abort server rendering and render the rest on the client.
Returns 
renderToReadableStream returns a Promise:
If rendering the shell is successful, that Promise will resolve to a Readable Web Stream.
If rendering the shell fails, the Promise will be rejected. Use this to output a fallback shell.
The returned stream has an additional property:
allReady: A Promise that resolves when all rendering is complete, including both the shell and all additional content. You can await stream.allReady before returning a response for crawlers and static generation. If you do that, you won’t get any progressive loading. The stream will contain the final HTML.

Usage 
Rendering a React tree as HTML to a Readable Web Stream 
Call renderToReadableStream to render your React tree as HTML into a Readable Web Stream:
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
 const stream = await renderToReadableStream(<App />, {
   bootstrapScripts: ['/main.js']
 });
 return new Response(stream, {
   headers: { 'content-type': 'text/html' },
 });
}
Along with the root component, you need to provide a list of bootstrap <script> paths. Your root component should return the entire document including the root <html> tag.
For example, it might look like this:
export default function App() {
 return (
   <html>
     <head>
       <meta charSet="utf-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       <link rel="stylesheet" href="/styles.css"></link>
       <title>My app</title>
     </head>
     <body>
       <Router />
     </body>
   </html>
 );
}
React will inject the doctype and your bootstrap <script> tags into the resulting HTML stream:
<!DOCTYPE html>
<html>
 <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
On the client, your bootstrap script should hydrate the entire document with a call to hydrateRoot:
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
This will attach event listeners to the server-generated HTML and make it interactive.
Deep Dive
Reading CSS and JS asset paths from the build output 
Show Details










































Streaming more content as it loads 
Streaming allows the user to start seeing the content even before all the data has loaded on the server. For example, consider a profile page that shows a cover, a sidebar with friends and photos, and a list of posts:
function ProfilePage() {
 return (
   <ProfileLayout>
     <ProfileCover />
     <Sidebar>
       <Friends />
       <Photos />
     </Sidebar>
     <Posts />
   </ProfileLayout>
 );
}
Imagine that loading data for <Posts /> takes some time. Ideally, you’d want to show the rest of the profile page content to the user without waiting for the posts. To do this, wrap Posts in a <Suspense> boundary:
function ProfilePage() {
 return (
   <ProfileLayout>
     <ProfileCover />
     <Sidebar>
       <Friends />
       <Photos />
     </Sidebar>
     <Suspense fallback={<PostsGlimmer />}>
       <Posts />
     </Suspense>
   </ProfileLayout>
 );
}
This tells React to start streaming the HTML before Posts loads its data. React will send the HTML for the loading fallback (PostsGlimmer) first, and then, when Posts finishes loading its data, React will send the remaining HTML along with an inline <script> tag that replaces the loading fallback with that HTML. From the user’s perspective, the page will first appear with the PostsGlimmer, later replaced by the Posts.
You can further nest <Suspense> boundaries to create a more granular loading sequence:
function ProfilePage() {
 return (
   <ProfileLayout>
     <ProfileCover />
     <Suspense fallback={<BigSpinner />}>
       <Sidebar>
         <Friends />
         <Photos />
       </Sidebar>
       <Suspense fallback={<PostsGlimmer />}>
         <Posts />
       </Suspense>
     </Suspense>
   </ProfileLayout>
 );
}
In this example, React can start streaming the page even earlier. Only ProfileLayout and ProfileCover must finish rendering first because they are not wrapped in any <Suspense> boundary. However, if Sidebar, Friends, or Photos need to load some data, React will send the HTML for the BigSpinner fallback instead. Then, as more data becomes available, more content will continue to be revealed until all of it becomes visible.
Streaming does not need to wait for React itself to load in the browser, or for your app to become interactive. The HTML content from the server will get progressively revealed before any of the <script> tags load.
Read more about how streaming HTML works.
Note
Only Suspense-enabled data sources will activate the Suspense component. They include:
Data fetching with Suspense-enabled frameworks like Relay and Next.js
Lazy-loading component code with lazy
Reading the value of a Promise with use
Suspense does not detect when data is fetched inside an Effect or event handler.
The exact way you would load data in the Posts component above depends on your framework. If you use a Suspense-enabled framework, you’ll find the details in its data fetching documentation.
Suspense-enabled data fetching without the use of an opinionated framework is not yet supported. The requirements for implementing a Suspense-enabled data source are unstable and undocumented. An official API for integrating data sources with Suspense will be released in a future version of React.

Specifying what goes into the shell 
The part of your app outside of any <Suspense> boundaries is called the shell:
function ProfilePage() {
 return (
   <ProfileLayout>
     <ProfileCover />
     <Suspense fallback={<BigSpinner />}>
       <Sidebar>
         <Friends />
         <Photos />
       </Sidebar>
       <Suspense fallback={<PostsGlimmer />}>
         <Posts />
       </Suspense>
     </Suspense>
   </ProfileLayout>
 );
}
It determines the earliest loading state that the user may see:
<ProfileLayout>
 <ProfileCover />
 <BigSpinner />
</ProfileLayout>
If you wrap the whole app into a <Suspense> boundary at the root, the shell will only contain that spinner. However, that’s not a pleasant user experience because seeing a big spinner on the screen can feel slower and more annoying than waiting a bit more and seeing the real layout. This is why usually you’ll want to place the <Suspense> boundaries so that the shell feels minimal but complete—like a skeleton of the entire page layout.
The async call to renderToReadableStream will resolve to a stream as soon as the entire shell has been rendered. Usually, you’ll start streaming then by creating and returning a response with that stream:
async function handler(request) {
 const stream = await renderToReadableStream(<App />, {
   bootstrapScripts: ['/main.js']
 });
 return new Response(stream, {
   headers: { 'content-type': 'text/html' },
 });
}
By the time the stream is returned, components in nested <Suspense> boundaries might still be loading data.

Logging crashes on the server 
By default, all errors on the server are logged to console. You can override this behavior to log crash reports:
async function handler(request) {
 const stream = await renderToReadableStream(<App />, {
   bootstrapScripts: ['/main.js'],
   onError(error) {
     console.error(error);
     logServerCrashReport(error);
   }
 });
 return new Response(stream, {
   headers: { 'content-type': 'text/html' },
 });
}
If you provide a custom onError implementation, don’t forget to also log errors to the console like above.

Recovering from errors inside the shell 
In this example, the shell contains ProfileLayout, ProfileCover, and PostsGlimmer:
function ProfilePage() {
 return (
   <ProfileLayout>
     <ProfileCover />
     <Suspense fallback={<PostsGlimmer />}>
       <Posts />
     </Suspense>
   </ProfileLayout>
 );
}
If an error occurs while rendering those components, React won’t have any meaningful HTML to send to the client. Wrap your renderToReadableStream call in a try...catch to send a fallback HTML that doesn’t rely on server rendering as the last resort:
async function handler(request) {
 try {
   const stream = await renderToReadableStream(<App />, {
     bootstrapScripts: ['/main.js'],
     onError(error) {
       console.error(error);
       logServerCrashReport(error);
     }
   });
   return new Response(stream, {
     headers: { 'content-type': 'text/html' },
   });
 } catch (error) {
   return new Response('<h1>Something went wrong</h1>', {
     status: 500,
     headers: { 'content-type': 'text/html' },
   });
 }
}
If there is an error while generating the shell, both onError and your catch block will fire. Use onError for error reporting and use the catch block to send the fallback HTML document. Your fallback HTML does not have to be an error page. Instead, you may include an alternative shell that renders your app on the client only.

Recovering from errors outside the shell 
In this example, the <Posts /> component is wrapped in <Suspense> so it is not a part of the shell:
function ProfilePage() {
 return (
   <ProfileLayout>
     <ProfileCover />
     <Suspense fallback={<PostsGlimmer />}>
       <Posts />
     </Suspense>
   </ProfileLayout>
 );
}
If an error happens in the Posts component or somewhere inside it, React will try to recover from it:
It will emit the loading fallback for the closest <Suspense> boundary (PostsGlimmer) into the HTML.
It will “give up” on trying to render the Posts content on the server anymore.
When the JavaScript code loads on the client, React will retry rendering Posts on the client.
If retrying rendering Posts on the client also fails, React will throw the error on the client. As with all the errors thrown during rendering, the closest parent error boundary determines how to present the error to the user. In practice, this means that the user will see a loading indicator until it is certain that the error is not recoverable.
If retrying rendering Posts on the client succeeds, the loading fallback from the server will be replaced with the client rendering output. The user will not know that there was a server error. However, the server onError callback and the client onRecoverableError callbacks will fire so that you can get notified about the error.

Setting the status code 
Streaming introduces a tradeoff. You want to start streaming the page as early as possible so that the user can see the content sooner. However, once you start streaming, you can no longer set the response status code.
By dividing your app into the shell (above all <Suspense> boundaries) and the rest of the content, you’ve already solved a part of this problem. If the shell errors, your catch block will run which lets you set the error status code. Otherwise, you know that the app may recover on the client, so you can send “OK”.
async function handler(request) {
 try {
   const stream = await renderToReadableStream(<App />, {
     bootstrapScripts: ['/main.js'],
     onError(error) {
       console.error(error);
       logServerCrashReport(error);
     }
   });
   return new Response(stream, {
     status: 200,
     headers: { 'content-type': 'text/html' },
   });
 } catch (error) {
   return new Response('<h1>Something went wrong</h1>', {
     status: 500,
     headers: { 'content-type': 'text/html' },
   });
 }
}
If a component outside the shell (i.e. inside a <Suspense> boundary) throws an error, React will not stop rendering. This means that the onError callback will fire, but your code will continue running without getting into the catch block. This is because React will try to recover from that error on the client, as described above.
However, if you’d like, you can use the fact that something has errored to set the status code:
async function handler(request) {
 try {
   let didError = false;
   const stream = await renderToReadableStream(<App />, {
     bootstrapScripts: ['/main.js'],
     onError(error) {
       didError = true;
       console.error(error);
       logServerCrashReport(error);
     }
   });
   return new Response(stream, {
     status: didError ? 500 : 200,
     headers: { 'content-type': 'text/html' },
   });
 } catch (error) {
   return new Response('<h1>Something went wrong</h1>', {
     status: 500,
     headers: { 'content-type': 'text/html' },
   });
 }
}
This will only catch errors outside the shell that happened while generating the initial shell content, so it’s not exhaustive. If knowing whether an error occurred for some content is critical, you can move it up into the shell.

Handling different errors in different ways 
You can create your own Error subclasses and use the instanceof operator to check which error is thrown. For example, you can define a custom NotFoundError and throw it from your component. Then you can save the error in onError and do something different before returning the response depending on the error type:
async function handler(request) {
 let didError = false;
 let caughtError = null;

 function getStatusCode() {
   if (didError) {
     if (caughtError instanceof NotFoundError) {
       return 404;
     } else {
       return 500;
     }
   } else {
     return 200;
   }
 }

 try {
   const stream = await renderToReadableStream(<App />, {
     bootstrapScripts: ['/main.js'],
     onError(error) {
       didError = true;
       caughtError = error;
       console.error(error);
       logServerCrashReport(error);
     }
   });
   return new Response(stream, {
     status: getStatusCode(),
     headers: { 'content-type': 'text/html' },
   });
 } catch (error) {
   return new Response('<h1>Something went wrong</h1>', {
     status: getStatusCode(),
     headers: { 'content-type': 'text/html' },
   });
 }
}
Keep in mind that once you emit the shell and start streaming, you can’t change the status code.

Waiting for all content to load for crawlers and static generation 
Streaming offers a better user experience because the user can see the content as it becomes available.
However, when a crawler visits your page, or if you’re generating the pages at the build time, you might want to let all of the content load first and then produce the final HTML output instead of revealing it progressively.
You can wait for all the content to load by awaiting the stream.allReady Promise:
async function handler(request) {
 try {
   let didError = false;
   const stream = await renderToReadableStream(<App />, {
     bootstrapScripts: ['/main.js'],
     onError(error) {
       didError = true;
       console.error(error);
       logServerCrashReport(error);
     }
   });
   let isCrawler = // ... depends on your bot detection strategy ...
   if (isCrawler) {
     await stream.allReady;
   }
   return new Response(stream, {
     status: didError ? 500 : 200,
     headers: { 'content-type': 'text/html' },
   });
 } catch (error) {
   return new Response('<h1>Something went wrong</h1>', {
     status: 500,
     headers: { 'content-type': 'text/html' },
   });
 }
}
A regular visitor will get a stream of progressively loaded content. A crawler will receive the final HTML output after all the data loads. However, this also means that the crawler will have to wait for all data, some of which might be slow to load or error. Depending on your app, you could choose to send the shell to the crawlers too.

Aborting server rendering 
You can force the server rendering to “give up” after a timeout:
async function handler(request) {
 try {
   const controller = new AbortController();
   setTimeout(() => {
     controller.abort();
   }, 10000);

   const stream = await renderToReadableStream(<App />, {
     signal: controller.signal,
     bootstrapScripts: ['/main.js'],
     onError(error) {
       didError = true;
       console.error(error);
       logServerCrashReport(error);
     }
   });
   // ...
React will flush the remaining loading fallbacks as HTML, and will attempt to render the rest on the client.
PreviousrenderToPipeableStream
NextrenderToStaticMarkup

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
renderToReadableStream(reactNode, options?)
Usage
Rendering a React tree as HTML to a Readable Web Stream
Streaming more content as it loads
Specifying what goes into the shell
Logging crashes on the server
Recovering from errors inside the shell
Recovering from errors outside the shell
Setting the status code
Handling different errors in different ways
Waiting for all content to load for crawlers and static generation
Aborting server rendering
renderToReadableStream – React
renderToStaticMarkup
renderToStaticMarkup renders a non-interactive React tree to an HTML string.
const html = renderToStaticMarkup(reactNode, options?)
Reference
renderToStaticMarkup(reactNode, options?)
Usage
Rendering a non-interactive React tree as HTML to a string

Reference 
renderToStaticMarkup(reactNode, options?) 
On the server, call renderToStaticMarkup to render your app to HTML.
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
It will produce non-interactive HTML output of your React components.
See more examples below.
Parameters 
reactNode: A React node you want to render to HTML. For example, a JSX node like <Page />.
optional options: An object for server render.
optional identifierPrefix: A string prefix React uses for IDs generated by useId. Useful to avoid conflicts when using multiple roots on the same page.
Returns 
An HTML string.
Caveats 
renderToStaticMarkup output cannot be hydrated.
renderToStaticMarkup has limited Suspense support. If a component suspends, renderToStaticMarkup immediately sends its fallback as HTML.
renderToStaticMarkup works in the browser, but using it in the client code is not recommended. If you need to render a component to HTML in the browser, get the HTML by rendering it into a DOM node.

Usage 
Rendering a non-interactive React tree as HTML to a string 
Call renderToStaticMarkup to render your app to an HTML string which you can send with your server response:
import { renderToStaticMarkup } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
 const html = renderToStaticMarkup(<Page />);
 response.send(html);
});
This will produce the initial non-interactive HTML output of your React components.
Pitfall
This method renders non-interactive HTML that cannot be hydrated.  This is useful if you want to use React as a simple static page generator, or if you’re rendering completely static content like emails.
Interactive apps should use renderToString on the server and hydrateRoot on the client.
PreviousrenderToReadableStream
NextrenderToString

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
renderToStaticMarkup(reactNode, options?)
Usage
Rendering a non-interactive React tree as HTML to a string
renderToStaticMarkup – React
renderToString
Pitfall
renderToString does not support streaming or waiting for data. See the alternatives.
renderToString renders a React tree to an HTML string.
const html = renderToString(reactNode, options?)
Reference
renderToString(reactNode, options?)
Usage
Rendering a React tree as HTML to a string
Alternatives
Migrating from renderToString to a streaming render on the server
Migrating from renderToString to a static prerender on the server
Removing renderToString from the client code
Troubleshooting
When a component suspends, the HTML always contains a fallback

Reference 
renderToString(reactNode, options?) 
On the server, call renderToString to render your app to HTML.
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
On the client, call hydrateRoot to make the server-generated HTML interactive.
See more examples below.
Parameters 
reactNode: A React node you want to render to HTML. For example, a JSX node like <App />.
optional options: An object for server render.
optional identifierPrefix: A string prefix React uses for IDs generated by useId. Useful to avoid conflicts when using multiple roots on the same page. Must be the same prefix as passed to hydrateRoot.
Returns 
An HTML string.
Caveats 
renderToString has limited Suspense support. If a component suspends, renderToString immediately sends its fallback as HTML.
renderToString works in the browser, but using it in the client code is not recommended.

Usage 
Rendering a React tree as HTML to a string 
Call renderToString to render your app to an HTML string which you can send with your server response:
import { renderToString } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
 const html = renderToString(<App />);
 response.send(html);
});
This will produce the initial non-interactive HTML output of your React components. On the client, you will need to call hydrateRoot to hydrate that server-generated HTML and make it interactive.
Pitfall
renderToString does not support streaming or waiting for data. See the alternatives.

Alternatives 
Migrating from renderToString to a streaming render on the server 
renderToString returns a string immediately, so it does not support streaming content as it loads.
When possible, we recommend using these fully-featured alternatives:
If you use Node.js, use renderToPipeableStream.
If you use Deno or a modern edge runtime with Web Streams, use renderToReadableStream.
You can continue using renderToString if your server environment does not support streams.

Migrating from renderToString to a static prerender on the server 
renderToString returns a string immediately, so it does not support waiting for data to load for static HTML generation.
We recommend using these fully-featured alternatives:
If you use Node.js, use prerenderToNodeStream.
If you use Deno or a modern edge runtime with Web Streams, use prerender.
You can continue using renderToString if your static site generation environment does not support streams.

Removing renderToString from the client code 
Sometimes, renderToString is used on the client to convert some component to HTML.
// 🚩 Unnecessary: using renderToString on the client
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // For example, "<svg>...</svg>"
Importing react-dom/server on the client unnecessarily increases your bundle size and should be avoided. If you need to render some component to HTML in the browser, use createRoot and read HTML from the DOM:
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
 root.render(<MyIcon />);
});
console.log(div.innerHTML); // For example, "<svg>...</svg>"
The flushSync call is necessary so that the DOM is updated before reading its innerHTML property.

Troubleshooting 
When a component suspends, the HTML always contains a fallback 
renderToString does not fully support Suspense.
If some component suspends (for example, because it’s defined with lazy or fetches data), renderToString will not wait for its content to resolve. Instead, renderToString will find the closest <Suspense> boundary above it and render its fallback prop in the HTML. The content will not appear until the client code loads.
To solve this, use one of the recommended streaming solutions. For server side rendering, they can stream content in chunks as it resolves on the server so that the user sees the page being progressively filled in before the client code loads. For static site generation, they can wait for all the content to resolve before generating the static HTML.
PreviousrenderToStaticMarkup
NextStatic APIs

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
renderToString(reactNode, options?)
Usage
Rendering a React tree as HTML to a string
Alternatives
Migrating from renderToString to a streaming render on the server
Migrating from renderToString to a static prerender on the server
Removing renderToString from the client code
Troubleshooting
When a component suspends, the HTML always contains a fallback
renderToString – React
Static React DOM APIs
The react-dom/static APIs let you generate static HTML for React components. They have limited functionality compared to the streaming APIs. A framework may call them for you. Most of your components don’t need to import or use them.

Static APIs for Web Streams 
These methods are only available in the environments with Web Streams, which includes browsers, Deno, and some modern edge runtimes:
prerender renders a React tree to static HTML with a Readable Web Stream.

Static APIs for Node.js Streams 
These methods are only available in the environments with Node.js Streams:
prerenderToNodeStream renders a React tree to static HTML with a Node.js Stream.
prerender
prerender renders a React tree to a static HTML string using a Web Stream.
const {prelude} = await prerender(reactNode, options?)
Reference
prerender(reactNode, options?)
Usage
Rendering a React tree to a stream of static HTML
Rendering a React tree to a string of static HTML
Waiting for all data to load
Aborting prerendering
Troubleshooting
My stream doesn’t start until the entire app is rendered
Note
This API depends on Web Streams. For Node.js, use prerenderToNodeStream instead.

Reference 
prerender(reactNode, options?) 
Call prerender to render your app to static HTML.
import { prerender } from 'react-dom/static';

async function handler(request) {
 const {prelude} = await prerender(<App />, {
   bootstrapScripts: ['/main.js']
 });
 return new Response(prelude, {
   headers: { 'content-type': 'text/html' },
 });
}
On the client, call hydrateRoot to make the server-generated HTML interactive.
See more examples below.
Parameters 
reactNode: A React node you want to render to HTML. For example, a JSX node like <App />. It is expected to represent the entire document, so the App component should render the <html> tag.
optional options: An object with static generation options.
optional bootstrapScriptContent: If specified, this string will be placed in an inline <script> tag.
optional bootstrapScripts: An array of string URLs for the <script> tags to emit on the page. Use this to include the <script> that calls hydrateRoot. Omit it if you don’t want to run React on the client at all.
optional bootstrapModules: Like bootstrapScripts, but emits <script type="module"> instead.
optional identifierPrefix: A string prefix React uses for IDs generated by useId. Useful to avoid conflicts when using multiple roots on the same page. Must be the same prefix as passed to hydrateRoot.
optional namespaceURI: A string with the root namespace URI for the stream. Defaults to regular HTML. Pass 'http://www.w3.org/2000/svg' for SVG or 'http://www.w3.org/1998/Math/MathML' for MathML.
optional onError: A callback that fires whenever there is a server error, whether recoverable or not. By default, this only calls console.error. If you override it to log crash reports, make sure that you still call console.error. You can also use it to adjust the status code before the shell is emitted.
optional progressiveChunkSize: The number of bytes in a chunk. Read more about the default heuristic.
optional signal: An abort signal that lets you abort prerendering and render the rest on the client.
Returns 
prerender returns a Promise:
If rendering the is successful, the Promise will resolve to an object containing:
prelude: a Web Stream of HTML. You can use this stream to send a response in chunks, or you can read the entire stream into a string.
If rendering fails, the Promise will be rejected. Use this to output a fallback shell.
Caveats 
nonce is not an available option when prerendering. Nonces must be unique per request and if you use nonces to secure your application with CSP it would be inappropriate and insecure to include the nonce value in the prerender itself.
Note
When should I use prerender? 
The static prerender API is used for static server-side generation (SSG). Unlike renderToString, prerender waits for all data to load before resolving. This makes it suitable for generating static HTML for a full page, including data that needs to be fetched using Suspense. To stream content as it loads, use a streaming server-side render (SSR) API like renderToReadableStream.

Usage 
Rendering a React tree to a stream of static HTML 
Call prerender to render your React tree to static HTML into a Readable Web Stream::
import { prerender } from 'react-dom/static';

async function handler(request) {
 const {prelude} = await prerender(<App />, {
   bootstrapScripts: ['/main.js']
 });
 return new Response(prelude, {
   headers: { 'content-type': 'text/html' },
 });
}
Along with the root component, you need to provide a list of bootstrap <script> paths. Your root component should return the entire document including the root <html> tag.
For example, it might look like this:
export default function App() {
 return (
   <html>
     <head>
       <meta charSet="utf-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       <link rel="stylesheet" href="/styles.css"></link>
       <title>My app</title>
     </head>
     <body>
       <Router />
     </body>
   </html>
 );
}
React will inject the doctype and your bootstrap <script> tags into the resulting HTML stream:
<!DOCTYPE html>
<html>
 <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
On the client, your bootstrap script should hydrate the entire document with a call to hydrateRoot:
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
This will attach event listeners to the static server-generated HTML and make it interactive.
Deep Dive
Reading CSS and JS asset paths from the build output 
Show Details










































Rendering a React tree to a string of static HTML 
Call prerender to render your app to a static HTML string:
import { prerender } from 'react-dom/static';

async function renderToString() {
 const {prelude} = await prerender(<App />, {
   bootstrapScripts: ['/main.js']
 });

 const reader = prelude.getReader();
 let content = '';
 while (true) {
   const {done, value} = await reader.read();
   if (done) {
     return content;
   }
   content += Buffer.from(value).toString('utf8');
 }
}
This will produce the initial non-interactive HTML output of your React components. On the client, you will need to call hydrateRoot to hydrate that server-generated HTML and make it interactive.

Waiting for all data to load 
prerender waits for all data to load before finishing the static HTML generation and resolving. For example, consider a profile page that shows a cover, a sidebar with friends and photos, and a list of posts:
function ProfilePage() {
 return (
   <ProfileLayout>
     <ProfileCover />
     <Sidebar>
       <Friends />
       <Photos />
     </Sidebar>
     <Suspense fallback={<PostsGlimmer />}>
       <Posts />
     </Suspense>
   </ProfileLayout>
 );
}
Imagine that <Posts /> needs to load some data, which takes some time. Ideally, you’d want wait for the posts to finish so it’s included in the HTML. To do this, you can use Suspense to suspend on the data, and prerender will wait for the suspended content to finish before resolving to the static HTML.
Note
Only Suspense-enabled data sources will activate the Suspense component. They include:
Data fetching with Suspense-enabled frameworks like Relay and Next.js
Lazy-loading component code with lazy
Reading the value of a Promise with use
Suspense does not detect when data is fetched inside an Effect or event handler.
The exact way you would load data in the Posts component above depends on your framework. If you use a Suspense-enabled framework, you’ll find the details in its data fetching documentation.
Suspense-enabled data fetching without the use of an opinionated framework is not yet supported. The requirements for implementing a Suspense-enabled data source are unstable and undocumented. An official API for integrating data sources with Suspense will be released in a future version of React.

Aborting prerendering 
You can force the prerender to “give up” after a timeout:
async function renderToString() {
 const controller = new AbortController();
 setTimeout(() => {
   controller.abort()
 }, 10000);

 try {
   // the prelude will contain all the HTML that was prerendered
   // before the controller aborted.
   const {prelude} = await prerender(<App />, {
     signal: controller.signal,
   });
   //...
Any Suspense boundaries with incomplete children will be included in the prelude in the fallback state.

Troubleshooting 
My stream doesn’t start until the entire app is rendered 
The prerender response waits for the entire app to finish rendering, including waiting for all Suspense boundaries to resolve, before resolving. It is designed for static site generation (SSG) ahead of time and does not support streaming more content as it loads.
To stream content as it loads, use a streaming server render API like renderToReadableStream.
PreviousStatic APIs
NextprerenderToNodeStream

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
prerender(reactNode, options?)
Usage
Rendering a React tree to a stream of static HTML
Rendering a React tree to a string of static HTML
Waiting for all data to load
Aborting prerendering
Troubleshooting
My stream doesn’t start until the entire app is rendered
prerender – React
prerenderToNodeStream
prerenderToNodeStream renders a React tree to a static HTML string using a Node.js Stream..
const {prelude} = await prerenderToNodeStream(reactNode, options?)
Reference
prerenderToNodeStream(reactNode, options?)
Usage
Rendering a React tree to a stream of static HTML
Rendering a React tree to a string of static HTML
Waiting for all data to load
Aborting prerendering
Troubleshooting
My stream doesn’t start until the entire app is rendered
Note
This API is specific to Node.js. Environments with Web Streams, like Deno and modern edge runtimes, should use prerender instead.

Reference 
prerenderToNodeStream(reactNode, options?) 
Call prerenderToNodeStream to render your app to static HTML.
import { prerenderToNodeStream } from 'react-dom/static';

// The route handler syntax depends on your backend framework
app.use('/', async (request, response) => {
 const { prelude } = await prerenderToNodeStream(<App />, {
   bootstrapScripts: ['/main.js'],
 });

 response.setHeader('Content-Type', 'text/plain');
 prelude.pipe(response);
});
On the client, call hydrateRoot to make the server-generated HTML interactive.
See more examples below.
Parameters 
reactNode: A React node you want to render to HTML. For example, a JSX node like <App />. It is expected to represent the entire document, so the App component should render the <html> tag.
optional options: An object with static generation options.
optional bootstrapScriptContent: If specified, this string will be placed in an inline <script> tag.
optional bootstrapScripts: An array of string URLs for the <script> tags to emit on the page. Use this to include the <script> that calls hydrateRoot. Omit it if you don’t want to run React on the client at all.
optional bootstrapModules: Like bootstrapScripts, but emits <script type="module"> instead.
optional identifierPrefix: A string prefix React uses for IDs generated by useId. Useful to avoid conflicts when using multiple roots on the same page. Must be the same prefix as passed to hydrateRoot.
optional namespaceURI: A string with the root namespace URI for the stream. Defaults to regular HTML. Pass 'http://www.w3.org/2000/svg' for SVG or 'http://www.w3.org/1998/Math/MathML' for MathML.
optional onError: A callback that fires whenever there is a server error, whether recoverable or not. By default, this only calls console.error. If you override it to log crash reports, make sure that you still call console.error. You can also use it to adjust the status code before the shell is emitted.
optional progressiveChunkSize: The number of bytes in a chunk. Read more about the default heuristic.
optional signal: An abort signal that lets you abort prerendering and render the rest on the client.
Returns 
prerenderToNodeStream returns a Promise:
If rendering the is successful, the Promise will resolve to an object containing:
prelude: a Node.js Stream. of HTML. You can use this stream to send a response in chunks, or you can read the entire stream into a string.
If rendering fails, the Promise will be rejected. Use this to output a fallback shell.
Caveats 
nonce is not an available option when prerendering. Nonces must be unique per request and if you use nonces to secure your application with CSP it would be inappropriate and insecure to include the nonce value in the prerender itself.
Note
When should I use prerenderToNodeStream? 
The static prerenderToNodeStream API is used for static server-side generation (SSG). Unlike renderToString, prerenderToNodeStream waits for all data to load before resolving. This makes it suitable for generating static HTML for a full page, including data that needs to be fetched using Suspense. To stream content as it loads, use a streaming server-side render (SSR) API like renderToReadableStream.

Usage 
Rendering a React tree to a stream of static HTML 
Call prerenderToNodeStream to render your React tree to static HTML into a Node.js Stream.:
import { prerenderToNodeStream } from 'react-dom/static';

// The route handler syntax depends on your backend framework
app.use('/', async (request, response) => {
 const { prelude } = await prerenderToNodeStream(<App />, {
   bootstrapScripts: ['/main.js'],
 });

 response.setHeader('Content-Type', 'text/plain');
 prelude.pipe(response);
});
Along with the root component, you need to provide a list of bootstrap <script> paths. Your root component should return the entire document including the root <html> tag.
For example, it might look like this:
export default function App() {
 return (
   <html>
     <head>
       <meta charSet="utf-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       <link rel="stylesheet" href="/styles.css"></link>
       <title>My app</title>
     </head>
     <body>
       <Router />
     </body>
   </html>
 );
}
React will inject the doctype and your bootstrap <script> tags into the resulting HTML stream:
<!DOCTYPE html>
<html>
 <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
On the client, your bootstrap script should hydrate the entire document with a call to hydrateRoot:
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
This will attach event listeners to the static server-generated HTML and make it interactive.
Deep Dive
Reading CSS and JS asset paths from the build output 
Show Details










































Rendering a React tree to a string of static HTML 
Call prerenderToNodeStream to render your app to a static HTML string:
import { prerenderToNodeStream } from 'react-dom/static';

async function renderToString() {
 const {prelude} = await prerenderToNodeStream(<App />, {
   bootstrapScripts: ['/main.js']
 });

 return new Promise((resolve, reject) => {
   let data = '';
   prelude.on('data', chunk => {
     data += chunk;
   });
   prelude.on('end', () => resolve(data));
   prelude.on('error', reject);
 });
}
This will produce the initial non-interactive HTML output of your React components. On the client, you will need to call hydrateRoot to hydrate that server-generated HTML and make it interactive.

Waiting for all data to load 
prerenderToNodeStream waits for all data to load before finishing the static HTML generation and resolving. For example, consider a profile page that shows a cover, a sidebar with friends and photos, and a list of posts:
function ProfilePage() {
 return (
   <ProfileLayout>
     <ProfileCover />
     <Sidebar>
       <Friends />
       <Photos />
     </Sidebar>
     <Suspense fallback={<PostsGlimmer />}>
       <Posts />
     </Suspense>
   </ProfileLayout>
 );
}
Imagine that <Posts /> needs to load some data, which takes some time. Ideally, you’d want wait for the posts to finish so it’s included in the HTML. To do this, you can use Suspense to suspend on the data, and prerenderToNodeStream will wait for the suspended content to finish before resolving to the static HTML.
Note
Only Suspense-enabled data sources will activate the Suspense component. They include:
Data fetching with Suspense-enabled frameworks like Relay and Next.js
Lazy-loading component code with lazy
Reading the value of a Promise with use
Suspense does not detect when data is fetched inside an Effect or event handler.
The exact way you would load data in the Posts component above depends on your framework. If you use a Suspense-enabled framework, you’ll find the details in its data fetching documentation.
Suspense-enabled data fetching without the use of an opinionated framework is not yet supported. The requirements for implementing a Suspense-enabled data source are unstable and undocumented. An official API for integrating data sources with Suspense will be released in a future version of React.

Aborting prerendering 
You can force the prerender to “give up” after a timeout:
async function renderToString() {
 const controller = new AbortController();
 setTimeout(() => {
   controller.abort()
 }, 10000);

 try {
   // the prelude will contain all the HTML that was prerendered
   // before the controller aborted.
   const {prelude} = await prerenderToNodeStream(<App />, {
     signal: controller.signal,
   });
   //...
Any Suspense boundaries with incomplete children will be included in the prelude in the fallback state.

Troubleshooting 
My stream doesn’t start until the entire app is rendered 
The prerenderToNodeStream response waits for the entire app to finish rendering, including waiting for all Suspense boundaries to resolve, before resolving. It is designed for static site generation (SSG) ahead of time and does not support streaming more content as it loads.
To stream content as it loads, use a streaming server render API like renderToPipeableStream.
Previousprerender

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
prerenderToNodeStream(reactNode, options?)
Usage
Rendering a React tree to a stream of static HTML
Rendering a React tree to a string of static HTML
Waiting for all data to load
Aborting prerendering
Troubleshooting
My stream doesn’t start until the entire app is rendered
prerenderToNodeStream – React
Rules of React
Just as different programming languages have their own ways of expressing concepts, React has its own idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications.
Components and Hooks must be pure
React calls Components and Hooks
Rules of Hooks

Note
To learn more about expressing UIs with React, we recommend reading Thinking in React.
This section describes the rules you need to follow to write idiomatic React code. Writing idiomatic React code can help you write well organized, safe, and composable applications. These properties make your app more resilient to changes and makes it easier to work with other developers, libraries, and tools.
These rules are known as the Rules of React. They are rules – and not just guidelines – in the sense that if they are broken, your app likely has bugs. Your code also becomes unidiomatic and harder to understand and reason about.
We strongly recommend using Strict Mode alongside React’s ESLint plugin to help your codebase follow the Rules of React. By following the Rules of React, you’ll be able to find and address these bugs and keep your application maintainable.

Components and Hooks must be pure 
Purity in Components and Hooks is a key rule of React that makes your app predictable, easy to debug, and allows React to automatically optimize your code.
Components must be idempotent – React components are assumed to always return the same output with respect to their inputs – props, state, and context.
Side effects must run outside of render – Side effects should not run in render, as React can render components multiple times to create the best possible user experience.
Props and state are immutable – A component’s props and state are immutable snapshots with respect to a single render. Never mutate them directly.
Return values and arguments to Hooks are immutable – Once values are passed to a Hook, you should not modify them. Like props in JSX, values become immutable when passed to a Hook.
Values are immutable after being passed to JSX – Don’t mutate values after they’ve been used in JSX. Move the mutation before the JSX is created.

React calls Components and Hooks 
React is responsible for rendering components and hooks when necessary to optimize the user experience. It is declarative: you tell React what to render in your component’s logic, and React will figure out how best to display it to your user.
Never call component functions directly – Components should only be used in JSX. Don’t call them as regular functions.
Never pass around hooks as regular values – Hooks should only be called inside of components. Never pass it around as a regular value.

Rules of Hooks 
Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called. You need to follow the Rules of Hooks when using them.
Only call Hooks at the top level – Don’t call Hooks inside loops, conditions, or nested functions. Instead, always use Hooks at the top level of your React function, before any early returns.
Only call Hooks from React functions – Don’t call Hooks from regular JavaScript functions.
NextComponents and Hooks must be pure

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Components and Hooks must be pure
React calls Components and Hooks
Rules of Hooks
Rules of React – React
Components and Hooks must be pure
Pure functions only perform a calculation and nothing more. It makes your code easier to understand, debug, and allows React to automatically optimize your components and Hooks correctly.
Note
This reference page covers advanced topics and requires familiarity with the concepts covered in the Keeping Components Pure page.
Why does purity matter?
Components and Hooks must be idempotent
Side effects must run outside of render
When is it okay to have mutation?
Props and state are immutable
Don’t mutate Props
Don’t mutate State
Return values and arguments to Hooks are immutable
Values are immutable after being passed to JSX
Why does purity matter? 
One of the key concepts that makes React, React is purity. A pure component or hook is one that is:
Idempotent – You always get the same result every time you run it with the same inputs – props, state, context for component inputs; and arguments for hook inputs.
Has no side effects in render – Code with side effects should run separately from rendering. For example as an event handler – where the user interacts with the UI and causes it to update; or as an Effect – which runs after render.
Does not mutate non-local values: Components and Hooks should never modify values that aren’t created locally in render.
When render is kept pure, React can understand how to prioritize which updates are most important for the user to see first. This is made possible because of render purity: since components don’t have side effects in render, React can pause rendering components that aren’t as important to update, and only come back to them later when it’s needed.
Concretely, this means that rendering logic can be run multiple times in a way that allows React to give your user a pleasant user experience. However, if your component has an untracked side effect – like modifying the value of a global variable during render – when React runs your rendering code again, your side effects will be triggered in a way that won’t match what you want. This often leads to unexpected bugs that can degrade how your users experience your app. You can see an example of this in the Keeping Components Pure page.
How does React run your code? 
React is declarative: you tell React what to render, and React will figure out how best to display it to your user. To do this, React has a few phases where it runs your code. You don’t need to know about all of these phases to use React well. But at a high level, you should know about what code runs in render, and what runs outside of it.
Rendering refers to calculating what the next version of your UI should look like. After rendering, Effects are flushed (meaning they are run until there are no more left) and may update the calculation if the Effects have impacts on layout. React takes this new calculation and compares it to the calculation used to create the previous version of your UI, then commits just the minimum changes needed to the DOM (what your user actually sees) to catch it up to the latest version.
Deep Dive
How to tell if code runs in render 
Show Details
















Components and Hooks must be idempotent 
Components must always return the same output with respect to their inputs – props, state, and context. This is known as idempotency. Idempotency is a term popularized in functional programming. It refers to the idea that you always get the same result every time you run that piece of code with the same inputs.
This means that all code that runs during render must also be idempotent in order for this rule to hold. For example, this line of code is not idempotent (and therefore, neither is the component):
function Clock() {
 const time = new Date(); // 🔴 Bad: always returns a different result!
 return <span>{time.toLocaleString()}</span>
}
new Date() is not idempotent as it always returns the current date and changes its result every time it’s called. When you render the above component, the time displayed on the screen will stay stuck on the time that the component was rendered. Similarly, functions like Math.random() also aren’t idempotent, because they return different results every time they’re called, even when the inputs are the same.
This doesn’t mean you shouldn’t use non-idempotent functions like new Date() at all – you should just avoid using them during render. In this case, we can synchronize the latest date to this component using an Effect:
App.js
DownloadReset
Fork
import { useState, useEffect } from 'react';

function useTime() {
  // 1. Keep track of the current date's state. `useState` receives an initializer function as its
  //    initial state. It only runs once when the hook is called, so only the current date at the
  //    time the hook is called is set first.
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2. Update the current date every second using `setInterval`.
    const id = setInterval(() => {
      setTime(new Date()); // ✅ Good: non-idempotent code no longer runs in render
    }, 1000);
    // 3. Return a cleanup function so we don't leak the `setInterval` timer.
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}


Show more
By wrapping the non-idempotent new Date() call in an Effect, it moves that calculation outside of rendering.
If you don’t need to synchronize some external state with React, you can also consider using an event handler if it only needs to be updated in response to a user interaction.

Side effects must run outside of render 
Side effects should not run in render, as React can render components multiple times to create the best possible user experience.
Note
Side effects are a broader term than Effects. Effects specifically refer to code that’s wrapped in useEffect, while a side effect is a general term for code that has any observable effect other than its primary result of returning a value to the caller.
Side effects are typically written inside of event handlers or Effects. But never during render.
While render must be kept pure, side effects are necessary at some point in order for your app to do anything interesting, like showing something on the screen! The key point of this rule is that side effects should not run in render, as React can render components multiple times. In most cases, you’ll use event handlers to handle side effects. Using an event handler explicitly tells React that this code doesn’t need to run during render, keeping render pure. If you’ve exhausted all options – and only as a last resort – you can also handle side effects using useEffect.
When is it okay to have mutation? 
Local mutation 
One common example of a side effect is mutation, which in JavaScript refers to changing the value of a non-primitive value. In general, while mutation is not idiomatic in React, local mutation is absolutely fine:
function FriendList({ friends }) {
 const items = []; // ✅ Good: locally created
 for (let i = 0; i < friends.length; i++) {
   const friend = friends[i];
   items.push(
     <Friend key={friend.id} friend={friend} />
   ); // ✅ Good: local mutation is okay
 }
 return <section>{items}</section>;
}
There is no need to contort your code to avoid local mutation. Array.map could also be used here for brevity, but there is nothing wrong with creating a local array and then pushing items into it during render.
Even though it looks like we are mutating items, the key point to note is that this code only does so locally – the mutation isn’t “remembered” when the component is rendered again. In other words, items only stays around as long as the component does. Because items is always recreated every time <FriendList /> is rendered, the component will always return the same result.
On the other hand, if items was created outside of the component, it holds on to its previous values and remembers changes:
const items = []; // 🔴 Bad: created outside of the component
function FriendList({ friends }) {
 for (let i = 0; i < friends.length; i++) {
   const friend = friends[i];
   items.push(
     <Friend key={friend.id} friend={friend} />
   ); // 🔴 Bad: mutates a value created outside of render
 }
 return <section>{items}</section>;
}
When <FriendList /> runs again, we will continue appending friends to items every time that component is run, leading to multiple duplicated results. This version of <FriendList /> has observable side effects during render and breaks the rule.
Lazy initialization 
Lazy initialization is also fine despite not being fully “pure”:
function ExpenseForm() {
 SuperCalculator.initializeIfNotReady(); // ✅ Good: if it doesn't affect other components
 // Continue rendering...
}
Changing the DOM 
Side effects that are directly visible to the user are not allowed in the render logic of React components. In other words, merely calling a component function shouldn’t by itself produce a change on the screen.
function ProductDetailPage({ product }) {
 document.title = product.title; // 🔴 Bad: Changes the DOM
}
One way to achieve the desired result of updating document.title outside of render is to synchronize the component with document.
As long as calling a component multiple times is safe and doesn’t affect the rendering of other components, React doesn’t care if it’s 100% pure in the strict functional programming sense of the word. It is more important that components must be idempotent.

Props and state are immutable 
A component’s props and state are immutable snapshots. Never mutate them directly. Instead, pass new props down, and use the setter function from useState.
You can think of the props and state values as snapshots that are updated after rendering. For this reason, you don’t modify the props or state variables directly: instead you pass new props, or use the setter function provided to you to tell React that state needs to update the next time the component is rendered.
Don’t mutate Props 
Props are immutable because if you mutate them, the application will produce inconsistent output, which can be hard to debug as it may or may not work depending on the circumstances.
function Post({ item }) {
 item.url = new Url(item.url, base); // 🔴 Bad: never mutate props directly
 return <Link url={item.url}>{item.title}</Link>;
}
function Post({ item }) {
 const url = new Url(item.url, base); // ✅ Good: make a copy instead
 return <Link url={url}>{item.title}</Link>;
}
Don’t mutate State 
useState returns the state variable and a setter to update that state.
const [stateVariable, setter] = useState(0);
Rather than updating the state variable in-place, we need to update it using the setter function that is returned by useState. Changing values on the state variable doesn’t cause the component to update, leaving your users with an outdated UI. Using the setter function informs React that the state has changed, and that we need to queue a re-render to update the UI.
function Counter() {
 const [count, setCount] = useState(0);

 function handleClick() {
   count = count + 1; // 🔴 Bad: never mutate state directly
 }

 return (
   <button onClick={handleClick}>
     You pressed me {count} times
   </button>
 );
}
function Counter() {
 const [count, setCount] = useState(0);

 function handleClick() {
   setCount(count + 1); // ✅ Good: use the setter function returned by useState
 }

 return (
   <button onClick={handleClick}>
     You pressed me {count} times
   </button>
 );
}

Return values and arguments to Hooks are immutable 
Once values are passed to a hook, you should not modify them. Like props in JSX, values become immutable when passed to a hook.
function useIconStyle(icon) {
 const theme = useContext(ThemeContext);
 if (icon.enabled) {
   icon.className = computeStyle(icon, theme); // 🔴 Bad: never mutate hook arguments directly
 }
 return icon;
}
function useIconStyle(icon) {
 const theme = useContext(ThemeContext);
 const newIcon = { ...icon }; // ✅ Good: make a copy instead
 if (icon.enabled) {
   newIcon.className = computeStyle(icon, theme);
 }
 return newIcon;
}
One important principle in React is local reasoning: the ability to understand what a component or hook does by looking at its code in isolation. Hooks should be treated like “black boxes” when they are called. For example, a custom hook might have used its arguments as dependencies to memoize values inside it:
function useIconStyle(icon) {
 const theme = useContext(ThemeContext);

 return useMemo(() => {
   const newIcon = { ...icon };
   if (icon.enabled) {
     newIcon.className = computeStyle(icon, theme);
   }
   return newIcon;
 }, [icon, theme]);
}
If you were to mutate the Hook’s arguments, the custom hook’s memoization will become incorrect,  so it’s important to avoid doing that.
style = useIconStyle(icon);         // `style` is memoized based on `icon`
icon.enabled = false;               // Bad: 🔴 never mutate hook arguments directly
style = useIconStyle(icon);         // previously memoized result is returned
style = useIconStyle(icon);         // `style` is memoized based on `icon`
icon = { ...icon, enabled: false }; // Good: ✅ make a copy instead
style = useIconStyle(icon);         // new value of `style` is calculated
Similarly, it’s important to not modify the return values of Hooks, as they may have been memoized.

Values are immutable after being passed to JSX 
Don’t mutate values after they’ve been used in JSX. Move the mutation to before the JSX is created.
When you use JSX in an expression, React may eagerly evaluate the JSX before the component finishes rendering. This means that mutating values after they’ve been passed to JSX can lead to outdated UIs, as React won’t know to update the component’s output.
function Page({ colour }) {
 const styles = { colour, size: "large" };
 const header = <Header styles={styles} />;
 styles.size = "small"; // 🔴 Bad: styles was already used in the JSX above
 const footer = <Footer styles={styles} />;
 return (
   <>
     {header}
     <Content />
     {footer}
   </>
 );
}
function Page({ colour }) {
 const headerStyles = { colour, size: "large" };
 const header = <Header styles={headerStyles} />;
 const footerStyles = { colour, size: "small" }; // ✅ Good: we created a new value
 const footer = <Footer styles={footerStyles} />;
 return (
   <>
     {header}
     <Content />
     {footer}
   </>
 );
}
PreviousOverview
NextReact calls Components and Hooks

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Why does purity matter?
Components and Hooks must be idempotent
Side effects must run outside of render
When is it okay to have mutation?
Props and state are immutable
Don’t mutate Props
Don’t mutate State
Return values and arguments to Hooks are immutable
Values are immutable after being passed to JSX
Components and Hooks must be pure – React
React calls Components and Hooks
React is responsible for rendering components and Hooks when necessary to optimize the user experience. It is declarative: you tell React what to render in your component’s logic, and React will figure out how best to display it to your user.
Never call component functions directly
Never pass around Hooks as regular values
Don’t dynamically mutate a Hook
Don’t dynamically use Hooks

Never call component functions directly 
Components should only be used in JSX. Don’t call them as regular functions. React should call it.
React must decide when your component function is called during rendering. In React, you do this using JSX.
function BlogPost() {
 return <Layout><Article /></Layout>; // ✅ Good: Only use components in JSX
}
function BlogPost() {
 return <Layout>{Article()}</Layout>; // 🔴 Bad: Never call them directly
}
If a component contains Hooks, it’s easy to violate the Rules of Hooks when components are called directly in a loop or conditionally.
Letting React orchestrate rendering also allows a number of benefits:
Components become more than functions. React can augment them with features like local state through Hooks that are tied to the component’s identity in the tree.
Component types participate in reconciliation. By letting React call your components, you also tell it more about the conceptual structure of your tree. For example, when you move from rendering <Feed> to the <Profile> page, React won’t attempt to re-use them.
React can enhance your user experience. For example, it can let the browser do some work between component calls so that re-rendering a large component tree doesn’t block the main thread.
A better debugging story. If components are first-class citizens that the library is aware of, we can build rich developer tools for introspection in development.
More efficient reconciliation. React can decide exactly which components in the tree need re-rendering and skip over the ones that don’t. That makes your app faster and more snappy.

Never pass around Hooks as regular values 
Hooks should only be called inside of components or Hooks. Never pass it around as a regular value.
Hooks allow you to augment a component with React features. They should always be called as a function, and never passed around as a regular value. This enables local reasoning, or the ability for developers to understand everything a component can do by looking at that component in isolation.
Breaking this rule will cause React to not automatically optimize your component.
Don’t dynamically mutate a Hook 
Hooks should be as “static” as possible. This means you shouldn’t dynamically mutate them. For example, this means you shouldn’t write higher order Hooks:
function ChatInput() {
 const useDataWithLogging = withLogging(useData); // 🔴 Bad: don't write higher order Hooks
 const data = useDataWithLogging();
}
Hooks should be immutable and not be mutated. Instead of mutating a Hook dynamically, create a static version of the Hook with the desired functionality.
function ChatInput() {
 const data = useDataWithLogging(); // ✅ Good: Create a new version of the Hook
}

function useDataWithLogging() {
 // ... Create a new version of the Hook and inline the logic here
}
Don’t dynamically use Hooks 
Hooks should also not be dynamically used: for example, instead of doing dependency injection in a component by passing a Hook as a value:
function ChatInput() {
 return <Button useData={useDataWithLogging} /> // 🔴 Bad: don't pass Hooks as props
}
You should always inline the call of the Hook into that component and handle any logic in there.
function ChatInput() {
 return <Button />
}

function Button() {
 const data = useDataWithLogging(); // ✅ Good: Use the Hook directly
}

function useDataWithLogging() {
 // If there's any conditional logic to change the Hook's behavior, it should be inlined into
 // the Hook
}
This way, <Button /> is much easier to understand and debug. When Hooks are used in dynamic ways, it increases the complexity of your app greatly and inhibits local reasoning, making your team less productive in the long term. It also makes it easier to accidentally break the Rules of Hooks that Hooks should not be called conditionally. If you find yourself needing to mock components for tests, it’s better to mock the server instead to respond with canned data. If possible, it’s also usually more effective to test your app with end-to-end tests.
PreviousComponents and Hooks must be pure
NextRules of Hooks

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Never call component functions directly
Never pass around Hooks as regular values
Don’t dynamically mutate a Hook
Don’t dynamically use Hooks
React calls Components and Hooks – React
Rules of Hooks
Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called.
Only call Hooks at the top level
Only call Hooks from React functions

Only call Hooks at the top level 
Functions whose names start with use are called Hooks in React.
Don’t call Hooks inside loops, conditions, nested functions, or try/catch/finally blocks. Instead, always use Hooks at the top level of your React function, before any early returns. You can only call Hooks while React is rendering a function component:
✅ Call them at the top level in the body of a function component.
✅ Call them at the top level in the body of a custom Hook.
function Counter() {
 // ✅ Good: top-level in a function component
 const [count, setCount] = useState(0);
 // ...
}

function useWindowWidth() {
 // ✅ Good: top-level in a custom Hook
 const [width, setWidth] = useState(window.innerWidth);
 // ...
}
It’s not supported to call Hooks (functions starting with use) in any other cases, for example:
🔴 Do not call Hooks inside conditions or loops.
🔴 Do not call Hooks after a conditional return statement.
🔴 Do not call Hooks in event handlers.
🔴 Do not call Hooks in class components.
🔴 Do not call Hooks inside functions passed to useMemo, useReducer, or useEffect.
🔴 Do not call Hooks inside try/catch/finally blocks.
If you break these rules, you might see this error.
function Bad({ cond }) {
 if (cond) {
   // 🔴 Bad: inside a condition (to fix, move it outside!)
   const theme = useContext(ThemeContext);
 }
 // ...
}

function Bad() {
 for (let i = 0; i < 10; i++) {
   // 🔴 Bad: inside a loop (to fix, move it outside!)
   const theme = useContext(ThemeContext);
 }
 // ...
}

function Bad({ cond }) {
 if (cond) {
   return;
 }
 // 🔴 Bad: after a conditional return (to fix, move it before the return!)
 const theme = useContext(ThemeContext);
 // ...
}

function Bad() {
 function handleClick() {
   // 🔴 Bad: inside an event handler (to fix, move it outside!)
   const theme = useContext(ThemeContext);
 }
 // ...
}

function Bad() {
 const style = useMemo(() => {
   // 🔴 Bad: inside useMemo (to fix, move it outside!)
   const theme = useContext(ThemeContext);
   return createStyle(theme);
 });
 // ...
}

class Bad extends React.Component {
 render() {
   // 🔴 Bad: inside a class component (to fix, write a function component instead of a class!)
   useEffect(() => {})
   // ...
 }
}

function Bad() {
 try {
   // 🔴 Bad: inside try/catch/finally block (to fix, move it outside!)
   const [x, setX] = useState(0);
 } catch {
   const [x, setX] = useState(1);
 }
}
You can use the eslint-plugin-react-hooks plugin to catch these mistakes.
Note
Custom Hooks may call other Hooks (that’s their whole purpose). This works because custom Hooks are also supposed to only be called while a function component is rendering.

Only call Hooks from React functions 
Don’t call Hooks from regular JavaScript functions. Instead, you can:
✅ Call Hooks from React function components.
✅ Call Hooks from custom Hooks.
By following this rule, you ensure that all stateful logic in a component is clearly visible from its source code.
function FriendList() {
 const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ Not a component or custom Hook!
 const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
PreviousReact calls Components and Hooks

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Only call Hooks at the top level
Only call Hooks from React functions
Rules of Hooks – React
Server Components
React Server Components
Server Components are for use in React Server Components.
Server Components are a new type of Component that renders ahead of time, before bundling, in an environment separate from your client app or SSR server.
This separate environment is the “server” in React Server Components. Server Components can run once at build time on your CI server, or they can be run for each request using a web server.
Server Components without a Server
Server Components with a Server
Adding interactivity to Server Components
Async components with Server Components
Note
How do I build support for Server Components? 
While React Server Components in React 19 are stable and will not break between minor versions, the underlying APIs used to implement a React Server Components bundler or framework do not follow semver and may break between minors in React 19.x.
To support React Server Components as a bundler or framework, we recommend pinning to a specific React version, or using the Canary release. We will continue working with bundlers and frameworks to stabilize the APIs used to implement React Server Components in the future.
Server Components without a Server 
Server components can run at build time to read from the filesystem or fetch static content, so a web server is not required. For example, you may want to read static data from a content management system.
Without Server Components, it’s common to fetch static data on the client with an Effect:
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
 const [content, setContent] = useState('');
 // NOTE: loads *after* first page render.
 useEffect(() => {
   fetch(`/api/content/${page}`).then((data) => {
     setContent(data.content);
   });
 }, [page]);

 return <div>{sanitizeHtml(marked(content))}</div>;
}
// api.js
app.get(`/api/content/:page`, async (req, res) => {
 const page = req.params.page;
 const content = await file.readFile(`${page}.md`);
 res.send({content});
});
This pattern means users need to download and parse an additional 75K (gzipped) of libraries, and wait for a second request to fetch the data after the page loads, just to render static content that will not change for the lifetime of the page.
With Server Components, you can render these components once at build time:
import marked from 'marked'; // Not included in bundle
import sanitizeHtml from 'sanitize-html'; // Not included in bundle

async function Page({page}) {
 // NOTE: loads *during* render, when the app is built.
 const content = await file.readFile(`${page}.md`);

 return <div>{sanitizeHtml(marked(content))}</div>;
}
The rendered output can then be server-side rendered (SSR) to HTML and uploaded to a CDN. When the app loads, the client will not see the original Page component, or the expensive libraries for rendering the markdown. The client will only see the rendered output:
<div><!-- html for markdown --></div>
This means the content is visible during first page load, and the bundle does not include the expensive libraries needed to render the static content.
Note
You may notice that the Server Component above is an async function:
async function Page({page}) {
 //...
}
Async Components are a new feature of Server Components that allow you to await in render.
See Async components with Server Components below.
Server Components with a Server 
Server Components can also run on a web server during a request for a page, letting you access your data layer without having to build an API. They are rendered before your application is bundled, and can pass data and JSX as props to Client Components.
Without Server Components, it’s common to fetch dynamic data on the client in an Effect:
// bundle.js
function Note({id}) {
 const [note, setNote] = useState('');
 // NOTE: loads *after* first render.
 useEffect(() => {
   fetch(`/api/notes/${id}`).then(data => {
     setNote(data.note);
   });
 }, [id]);

 return (
   <div>
     <Author id={note.authorId} />
     <p>{note}</p>
   </div>
 );
}

function Author({id}) {
 const [author, setAuthor] = useState('');
 // NOTE: loads *after* Note renders.
 // Causing an expensive client-server waterfall.
 useEffect(() => {
   fetch(`/api/authors/${id}`).then(data => {
     setAuthor(data.author);
   });
 }, [id]);

 return <span>By: {author.name}</span>;
}
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
 const note = await db.notes.get(id);
 res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
 const author = await db.authors.get(id);
 res.send({author});
});
With Server Components, you can read the data and render it in the component:
import db from './database';

async function Note({id}) {
 // NOTE: loads *during* render.
 const note = await db.notes.get(id);
 return (
   <div>
     <Author id={note.authorId} />
     <p>{note}</p>
   </div>
 );
}

async function Author({id}) {
 // NOTE: loads *after* Note,
 // but is fast if data is co-located.
 const author = await db.authors.get(id);
 return <span>By: {author.name}</span>;
}
The bundler then combines the data, rendered Server Components and dynamic Client Components into a bundle. Optionally, that bundle can then be server-side rendered (SSR) to create the initial HTML for the page. When the page loads, the browser does not see the original Note and Author components; only the rendered output is sent to the client:
<div>
 <span>By: The React Team</span>
 <p>React 19 is...</p>
</div>
Server Components can be made dynamic by re-fetching them from a server, where they can access the data and render again. This new application architecture combines the simple “request/response” mental model of server-centric Multi-Page Apps with the seamless interactivity of client-centric Single-Page Apps, giving you the best of both worlds.
Adding interactivity to Server Components 
Server Components are not sent to the browser, so they cannot use interactive APIs like useState. To add interactivity to Server Components, you can compose them with Client Component using the "use client" directive.
Note
There is no directive for Server Components. 
A common misunderstanding is that Server Components are denoted by "use server", but there is no directive for Server Components. The "use server" directive is used for Server Functions.
For more info, see the docs for Directives.
In the following example, the Notes Server Component imports an Expandable Client Component that uses state to toggle its expanded state:
// Server Component
import Expandable from './Expandable';

async function Notes() {
 const notes = await db.notes.getAll();
 return (
   <div>
     {notes.map(note => (
       <Expandable key={note.id}>
         <p note={note} />
       </Expandable>
     ))}
   </div>
 )
}
// Client Component
"use client"

export default function Expandable({children}) {
 const [expanded, setExpanded] = useState(false);
 return (
   <div>
     <button
       onClick={() => setExpanded(!expanded)}
     >
       Toggle
     </button>
     {expanded && children}
   </div>
 )
}
This works by first rendering Notes as a Server Component, and then instructing the bundler to create a bundle for the Client Component Expandable. In the browser, the Client Components will see output of the Server Components passed as props:
<head>
 <!-- the bundle for Client Components -->
 <script src="bundle.js" />
</head>
<body>
 <div>
   <Expandable key={1}>
     <p>this is the first note</p>
   </Expandable>
   <Expandable key={2}>
     <p>this is the second note</p>
   </Expandable>
   <!--...-->
 </div>
</body>
Async components with Server Components 
Server Components introduce a new way to write Components using async/await. When you await in an async component, React will suspend and wait for the promise to resolve before resuming rendering. This works across server/client boundaries with streaming support for Suspense.
You can even create a promise on the server, and await it on the client:
// Server Component
import db from './database';

async function Page({id}) {
 // Will suspend the Server Component.
 const note = await db.notes.get(id);

 // NOTE: not awaited, will start here and await on the client.
 const commentsPromise = db.comments.get(note.id);
 return (
   <div>
     {note}
     <Suspense fallback={<p>Loading Comments...</p>}>
       <Comments commentsPromise={commentsPromise} />
     </Suspense>
   </div>
 );
}
// Client Component
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
 // NOTE: this will resume the promise from the server.
 // It will suspend until the data is available.
 const comments = use(commentsPromise);
 return comments.map(commment => <p>{comment}</p>);
}
The note content is important data for the page to render, so we await it on the server. The comments are below the fold and lower-priority, so we start the promise on the server, and wait for it on the client with the use API. This will Suspend on the client, without blocking the note content from rendering.
Since async components are not supported on the client, we await the promise with use.
NextServer Functions

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Server Components without a Server
Server Components with a Server
Adding interactivity to Server Components
Async components with Server Components
Server Components – React
Server Functions
React Server Components
Server Functions are for use in React Server Components.
Note: Until September 2024, we referred to all Server Functions as “Server Actions”. If a Server Function is passed to an action prop or called from inside an action then it is a Server Action, but not all Server Functions are Server Actions. The naming in this documentation has been updated to reflect that Server Functions can be used for multiple purposes.
Server Functions allow Client Components to call async functions executed on the server.
Note
How do I build support for Server Functions? 
While Server Functions in React 19 are stable and will not break between minor versions, the underlying APIs used to implement Server Functions in a React Server Components bundler or framework do not follow semver and may break between minors in React 19.x.
To support Server Functions as a bundler or framework, we recommend pinning to a specific React version, or using the Canary release. We will continue working with bundlers and frameworks to stabilize the APIs used to implement Server Functions in the future.
When a Server Function is defined with the "use server" directive, your framework will automatically create a reference to the Server Function, and pass that reference to the Client Component. When that function is called on the client, React will send a request to the server to execute the function, and return the result.
Server Functions can be created in Server Components and passed as props to Client Components, or they can be imported and used in Client Components.
Usage 
Creating a Server Function from a Server Component 
Server Components can define Server Functions with the "use server" directive:
// Server Component
import Button from './Button';

function EmptyNote () {
 async function createNoteAction() {
   // Server Function
   'use server';
  
   await db.notes.create();
 }

 return <Button onClick={createNoteAction}/>;
}
When React renders the EmptyNote Server Component, it will create a reference to the createNoteAction function, and pass that reference to the Button Client Component. When the button is clicked, React will send a request to the server to execute the createNoteAction function with the reference provided:
"use client";

export default function Button({onClick}) {
 console.log(onClick);
 // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
 return <button onClick={() => onClick()}>Create Empty Note</button>
}
For more, see the docs for "use server".
Importing Server Functions from Client Components 
Client Components can import Server Functions from files that use the "use server" directive:
"use server";

export async function createNote() {
 await db.notes.create();
}
When the bundler builds the EmptyNote Client Component, it will create a reference to the createNote function in the bundle. When the button is clicked, React will send a request to the server to execute the createNote function using the reference provided:
"use client";
import {createNote} from './actions';

function EmptyNote() {
 console.log(createNote);
 // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
 <button onClick={() => createNote()} />
}
For more, see the docs for "use server".
Server Functions with Actions 
Server Functions can be called from Actions on the client:
"use server";

export async function updateName(name) {
 if (!name) {
   return {error: 'Name is required'};
 }
 await db.users.updateName(name);
}
"use client";

import {updateName} from './actions';

function UpdateName() {
 const [name, setName] = useState('');
 const [error, setError] = useState(null);

 const [isPending, startTransition] = useTransition();

 const submitAction = async () => {
   startTransition(async () => {
     const {error} = await updateName(name);
     if (error) {
       setError(error);
     } else {
       setName('');
     }
   })
 }

 return (
   <form action={submitAction}>
     <input type="text" name="name" disabled={isPending}/>
     {error && <span>Failed: {error}</span>}
   </form>
 )
}
This allows you to access the isPending state of the Server Function by wrapping it in an Action on the client.
For more, see the docs for Calling a Server Function outside of <form>
Server Functions with Form Actions 
Server Functions work with the new Form features in React 19.
You can pass a Server Function to a Form to automatically submit the form to the server:
"use client";

import {updateName} from './actions';

function UpdateName() {
 return (
   <form action={updateName}>
     <input type="text" name="name" />
   </form>
 )
}
When the Form submission succeeds, React will automatically reset the form. You can add useActionState to access the pending state, last response, or to support progressive enhancement.
For more, see the docs for Server Functions in Forms.
Server Functions with useActionState 
You can call Server Functions with useActionState for the common case where you just need access to the action pending state and last returned response:
"use client";

import {updateName} from './actions';

function UpdateName() {
 const [state, submitAction, isPending] = useActionState(updateName, {error: null});

 return (
   <form action={submitAction}>
     <input type="text" name="name" disabled={isPending}/>
     {state.error && <span>Failed: {state.error}</span>}
   </form>
 );
}
When using useActionState with Server Functions, React will also automatically replay form submissions entered before hydration finishes. This means users can interact with your app even before the app has hydrated.
For more, see the docs for useActionState.
Progressive enhancement with useActionState 
Server Functions also support progressive enhancement with the third argument of useActionState.
"use client";

import {updateName} from './actions';

function UpdateName() {
 const [, submitAction] = useActionState(updateName, null, `/name/update`);

 return (
   <form action={submitAction}>
     ...
   </form>
 );
}
When the permalink is provided to useActionState, React will redirect to the provided URL if the form is submitted before the JavaScript bundle loads.
For more, see the docs for useActionState.
PreviousServer Components
NextDirectives

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Usage
Creating a Server Function from a Server Component
Importing Server Functions from Client Components
Server Functions with Actions
Server Functions with Form Actions
Server Functions with useActionState
Progressive enhancement with useActionState
Server Functions – React
Directives
React Server Components
Directives are for use in React Server Components.
Directives provide instructions to bundlers compatible with React Server Components.

Source code directives 
'use client' lets you mark what code runs on the client.
'use server' marks server-side functions that can be called from client-side code.
'use client'
React Server Components
'use client' is for use with React Server Components.
'use client' lets you mark what code runs on the client.
Reference
'use client'
How 'use client' marks client code
When to use 'use client'
Serializable types returned by Server Components
Usage
Building with interactivity and state
Using client APIs
Using third-party libraries

Reference 
'use client' 
Add 'use client' at the top of a file to mark the module and its transitive dependencies as client code.
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
 const date = formatDate(timestamp);
 // ...
 const editButton = <Button />;
 // ...
}
When a file marked with 'use client' is imported from a Server Component, compatible bundlers will treat the module import as a boundary between server-run and client-run code.
As dependencies of RichTextEditor, formatDate and Button will also be evaluated on the client regardless of whether their modules contain a 'use client' directive. Note that a single module may be evaluated on the server when imported from server code and on the client when imported from client code.
Caveats 
'use client' must be at the very beginning of a file, above any imports or other code (comments are OK). They must be written with single or double quotes, but not backticks.
When a 'use client' module is imported from another client-rendered module, the directive has no effect.
When a component module contains a 'use client' directive, any usage of that component is guaranteed to be a Client Component. However, a component can still be evaluated on the client even if it does not have a 'use client' directive.
A component usage is considered a Client Component if it is defined in module with 'use client' directive or when it is a transitive dependency of a module that contains a 'use client' directive. Otherwise, it is a Server Component.
Code that is marked for client evaluation is not limited to components. All code that is a part of the Client module sub-tree is sent to and run by the client.
When a server evaluated module imports values from a 'use client' module, the values must either be a React component or supported serializable prop values to be passed to a Client Component. Any other use case will throw an exception.
How 'use client' marks client code 
In a React app, components are often split into separate files, or modules.
For apps that use React Server Components, the app is server-rendered by default. 'use client' introduces a server-client boundary in the module dependency tree, effectively creating a subtree of Client modules.
To better illustrate this, consider the following React Server Components app.
App.jsFancyText.jsInspirationGenerator.jsCopyright.jsinspirations.js
Reset
Fork
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}


In the module dependency tree of this example app, the 'use client' directive in InspirationGenerator.js marks that module and all of its transitive dependencies as Client modules. The subtree starting at InspirationGenerator.js is now marked as Client modules.

'use client' segments the module dependency tree of the React Server Components app, marking InspirationGenerator.js and all of its dependencies as client-rendered.
During render, the framework will server-render the root component and continue through the render tree, opting-out of evaluating any code imported from client-marked code.
The server-rendered portion of the render tree is then sent to the client. The client, with its client code downloaded, then completes rendering the rest of the tree.

The render tree for the React Server Components app. InspirationGenerator and its child component FancyText are components exported from client-marked code and considered Client Components.
We introduce the following definitions:
Client Components are components in a render tree that are rendered on the client.
Server Components are components in a render tree that are rendered on the server.
Working through the example app, App, FancyText and Copyright are all server-rendered and considered Server Components. As InspirationGenerator.js and its transitive dependencies are marked as client code, the component InspirationGenerator and its child component FancyText are Client Components.
Deep Dive
How is FancyText both a Server and a Client Component? 
Show Details

















Deep Dive
Why is Copyright a Server Component? 
Show Details

When to use 'use client' 
With 'use client', you can determine when components are Client Components. As Server Components are default, here is a brief overview of the advantages and limitations to Server Components to determine when you need to mark something as client rendered.
For simplicity, we talk about Server Components, but the same principles apply to all code in your app that is server run.
Advantages of Server Components 
Server Components can reduce the amount of code sent and run by the client. Only Client modules are bundled and evaluated by the client.
Server Components benefit from running on the server. They can access the local filesystem and may experience low latency for data fetches and network requests.
Limitations of Server Components 
Server Components cannot support interaction as event handlers must be registered and triggered by a client.
For example, event handlers like onClick can only be defined in Client Components.
Server Components cannot use most Hooks.
When Server Components are rendered, their output is essentially a list of components for the client to render. Server Components do not persist in memory after render and cannot have their own state.
Serializable types returned by Server Components 
As in any React app, parent components pass data to child components. As they are rendered in different environments, passing data from a Server Component to a Client Component requires extra consideration.
Prop values passed from a Server Component to Client Component must be serializable.
Serializable props include:
Primitives
string
number
bigint
boolean
undefined
null
symbol, only symbols registered in the global Symbol registry via Symbol.for
Iterables containing serializable values
String
Array
Map
Set
TypedArray and ArrayBuffer
Date
Plain objects: those created with object initializers, with serializable properties
Functions that are Server Functions
Client or Server Component elements (JSX)
Promises
Notably, these are not supported:
Functions that are not exported from client-marked modules or marked with 'use server'
Classes
Objects that are instances of any class (other than the built-ins mentioned) or objects with a null prototype
Symbols not registered globally, ex. Symbol('my new symbol')
Usage 
Building with interactivity and state 
App.js
DownloadReset
Fork
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}


Show more
As Counter requires both the useState Hook and event handlers to increment or decrement the value, this component must be a Client Component and will require a 'use client' directive at the top.
In contrast, a component that renders UI without interaction will not need to be a Client Component.
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
 const initialValue = await readFile('/path/to/counter_value');
 return <Counter initialValue={initialValue} />
}
For example, Counter’s parent component, CounterContainer, does not require 'use client' as it is not interactive and does not use state. In addition, CounterContainer must be a Server Component as it reads from the local file system on the server, which is possible only in a Server Component.
There are also components that don’t use any server or client-only features and can be agnostic to where they render. In our earlier example, FancyText is one such component.
export default function FancyText({title, text}) {
 return title
   ? <h1 className='fancy title'>{text}</h1>
   : <h3 className='fancy cursive'>{text}</h3>
}
In this case, we don’t add the 'use client' directive, resulting in FancyText’s output (rather than its source code) to be sent to the browser when referenced from a Server Component. As demonstrated in the earlier Inspirations app example, FancyText is used as both a Server or Client Component, depending on where it is imported and used.
But if FancyText’s HTML output was large relative to its source code (including dependencies), it might be more efficient to force it to always be a Client Component. Components that return a long SVG path string are one case where it may be more efficient to force a component to be a Client Component.
Using client APIs 
Your React app may use client-specific APIs, such as the browser’s APIs for web storage, audio and video manipulation, and device hardware, among others.
In this example, the component uses DOM APIs to manipulate a canvas element. Since those APIs are only available in the browser, it must be marked as a Client Component.
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
 const ref = useRef(null);
 useLayoutEffect(() => {
   const canvas = ref.current;
   const context = canvas.getContext('2d');
   context.reset();
   context.beginPath();
   context.arc(100, 75, 50, 0, 2 * Math.PI);
   context.stroke();
 });
 return <canvas ref={ref} />;
}
Using third-party libraries 
Often in a React app, you’ll leverage third-party libraries to handle common UI patterns or logic.
These libraries may rely on component Hooks or client APIs. Third-party components that use any of the following React APIs must run on the client:
createContext
react and react-dom Hooks, excluding use and useId
forwardRef
memo
startTransition
If they use client APIs, ex. DOM insertion or native platform views
If these libraries have been updated to be compatible with React Server Components, then they will already include 'use client' markers of their own, allowing you to use them directly from your Server Components. If a library hasn’t been updated, or if a component needs props like event handlers that can only be specified on the client, you may need to add your own Client Component file in between the third-party Client Component and your Server Component where you’d like to use it.
PreviousDirectives
Next'use server'

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
'use client'
How 'use client' marks client code
When to use 'use client'
Serializable types returned by Server Components
Usage
Building with interactivity and state
Using client APIs
Using third-party libraries
'use client' directive – React
'use server'
React Server Components
'use server' is for use with using React Server Components.
'use server' marks server-side functions that can be called from client-side code.
Reference
'use server'
Security considerations
Serializable arguments and return values
Usage
Server Functions in forms
Calling a Server Function outside of <form>

Reference 
'use server' 
Add 'use server' at the top of an async function body to mark the function as callable by the client. We call these functions Server Functions.
async function addToCart(data) {
 'use server';
 // ...
}
When calling a Server Function on the client, it will make a network request to the server that includes a serialized copy of any arguments passed. If the Server Function returns a value, that value will be serialized and returned to the client.
Instead of individually marking functions with 'use server', you can add the directive to the top of a file to mark all exports within that file as Server Functions that can be used anywhere, including imported in client code.
Caveats 
'use server' must be at the very beginning of their function or module; above any other code including imports (comments above directives are OK). They must be written with single or double quotes, not backticks.
'use server' can only be used in server-side files. The resulting Server Functions can be passed to Client Components through props. See supported types for serialization.
To import a Server Functions from client code, the directive must be used on a module level.
Because the underlying network calls are always asynchronous, 'use server' can only be used on async functions.
Always treat arguments to Server Functions as untrusted input and authorize any mutations. See security considerations.
Server Functions should be called in a Transition. Server Functions passed to <form action> or formAction will automatically be called in a transition.
Server Functions are designed for mutations that update server-side state; they are not recommended for data fetching. Accordingly, frameworks implementing Server Functions typically process one action at a time and do not have a way to cache the return value.
Security considerations 
Arguments to Server Functions are fully client-controlled. For security, always treat them as untrusted input, and make sure to validate and escape arguments as appropriate.
In any Server Function, make sure to validate that the logged-in user is allowed to perform that action.
Under Construction
To prevent sending sensitive data from a Server Function, there are experimental taint APIs to prevent unique values and objects from being passed to client code.
See experimental_taintUniqueValue and experimental_taintObjectReference.
Serializable arguments and return values 
Since client code calls the Server Function over the network, any arguments passed will need to be serializable.
Here are supported types for Server Function arguments:
Primitives
string
number
bigint
boolean
undefined
null
symbol, only symbols registered in the global Symbol registry via Symbol.for
Iterables containing serializable values
String
Array
Map
Set
TypedArray and ArrayBuffer
Date
FormData instances
Plain objects: those created with object initializers, with serializable properties
Functions that are Server Functions
Promises
Notably, these are not supported:
React elements, or JSX
Functions, including component functions or any other function that is not a Server Function
Classes
Objects that are instances of any class (other than the built-ins mentioned) or objects with a null prototype
Symbols not registered globally, ex. Symbol('my new symbol')
Events from event handlers
Supported serializable return values are the same as serializable props for a boundary Client Component.
Usage 
Server Functions in forms 
The most common use case of Server Functions will be calling functions that mutate data. On the browser, the HTML form element is the traditional approach for a user to submit a mutation. With React Server Components, React introduces first-class support for Server Functions as Actions in forms.
Here is a form that allows a user to request a username.
// App.js

async function requestUsername(formData) {
 'use server';
 const username = formData.get('username');
 // ...
}

export default function App() {
 return (
   <form action={requestUsername}>
     <input type="text" name="username" />
     <button type="submit">Request</button>
   </form>
 );
}
In this example requestUsername is a Server Function passed to a <form>. When a user submits this form, there is a network request to the server function requestUsername. When calling a Server Function in a form, React will supply the form’s FormData as the first argument to the Server Function.
By passing a Server Function to the form action, React can progressively enhance the form. This means that forms can be submitted before the JavaScript bundle is loaded.
Handling return values in forms 
In the username request form, there might be the chance that a username is not available. requestUsername should tell us if it fails or not.
To update the UI based on the result of a Server Function while supporting progressive enhancement, use useActionState.
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
 const username = formData.get('username');
 if (canRequest(username)) {
   // ...
   return 'successful';
 }
 return 'failed';
}
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
 const [state, action] = useActionState(requestUsername, null, 'n/a');

 return (
   <>
     <form action={action}>
       <input type="text" name="username" />
       <button type="submit">Request</button>
     </form>
     <p>Last submission request returned: {state}</p>
   </>
 );
}
Note that like most Hooks, useActionState can only be called in client code.
Calling a Server Function outside of <form> 
Server Functions are exposed server endpoints and can be called anywhere in client code.
When using a Server Function outside a form, call the Server Function in a Transition, which allows you to display a loading indicator, show optimistic state updates, and handle unexpected errors. Forms will automatically wrap Server Functions in transitions.
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
 const [isPending, startTransition] = useTransition();
 const [likeCount, setLikeCount] = useState(0);

 const onClick = () => {
   startTransition(async () => {
     const currentCount = await incrementLike();
     setLikeCount(currentCount);
   });
 };

 return (
   <>
     <p>Total Likes: {likeCount}</p>
     <button onClick={onClick} disabled={isPending}>Like</button>;
   </>
 );
}
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
 likeCount++;
 return likeCount;
}
To read a Server Function return value, you’ll need to await the promise returned.
Previous'use client'

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
'use server'
Security considerations
Serializable arguments and return values
Usage
Server Functions in forms
Calling a Server Function outside of <form>
'use server' directive – React
Legacy React APIs
These APIs are exported from the react package, but they are not recommended for use in newly written code. See the linked individual API pages for the suggested alternatives.

Legacy APIs 
Children lets you manipulate and transform the JSX received as the children prop. See alternatives.
cloneElement lets you create a React element using another element as a starting point. See alternatives.
Component lets you define a React component as a JavaScript class. See alternatives.
createElement lets you create a React element. Typically, you’ll use JSX instead.
createRef creates a ref object which can contain arbitrary value. See alternatives.
forwardRef lets your component expose a DOM node to parent component with a ref.
isValidElement checks whether a value is a React element. Typically used with cloneElement.
PureComponent is similar to Component, but it skip re-renders with same props. See alternatives.

Removed APIs 
These APIs were removed in React 19:
createFactory: use JSX instead.
Class Components: static contextTypes: use static contextType instead.
Class Components: static childContextTypes: use static contextType instead.
Class Components: static getChildContext: use Context instead.
Class Components: static propTypes: use a type system like TypeScript instead.
Class Components: this.refs: use createRef instead.
NextChildren

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Legacy APIs
Removed APIs
Legacy React APIs – React
Children
Pitfall
Using Children is uncommon and can lead to fragile code. See common alternatives.
Children lets you manipulate and transform the JSX you received as the children prop.
const mappedChildren = Children.map(children, child =>
 <div className="Row">
   {child}
 </div>
);
Reference
Children.count(children)
Children.forEach(children, fn, thisArg?)
Children.map(children, fn, thisArg?)
Children.only(children)
Children.toArray(children)
Usage
Transforming children
Running some code for each child
Counting children
Converting children to an array
Alternatives
Exposing multiple components
Accepting an array of objects as a prop
Calling a render prop to customize rendering
Troubleshooting
I pass a custom component, but the Children methods don’t show its render result

Reference 
Children.count(children) 
Call Children.count(children) to count the number of children in the children data structure.
import { Children } from 'react';

function RowList({ children }) {
 return (
   <>
     <h1>Total rows: {Children.count(children)}</h1>
     ...
   </>
 );
}
See more examples below.
Parameters 
children: The value of the children prop received by your component.
Returns 
The number of nodes inside these children.
Caveats 
Empty nodes (null, undefined, and Booleans), strings, numbers, and React elements count as individual nodes. Arrays don’t count as individual nodes, but their children do. The traversal does not go deeper than React elements: they don’t get rendered, and their children aren’t traversed. Fragments don’t get traversed.

Children.forEach(children, fn, thisArg?) 
Call Children.forEach(children, fn, thisArg?) to run some code for each child in the children data structure.
import { Children } from 'react';

function SeparatorList({ children }) {
 const result = [];
 Children.forEach(children, (child, index) => {
   result.push(child);
   result.push(<hr key={index} />);
 });
 // ...
See more examples below.
Parameters 
children: The value of the children prop received by your component.
fn: The function you want to run for each child, similar to the array forEach method callback. It will be called with the child as the first argument and its index as the second argument. The index starts at 0 and increments on each call.
optional thisArg: The this value with which the fn function should be called. If omitted, it’s undefined.
Returns 
Children.forEach returns undefined.
Caveats 
Empty nodes (null, undefined, and Booleans), strings, numbers, and React elements count as individual nodes. Arrays don’t count as individual nodes, but their children do. The traversal does not go deeper than React elements: they don’t get rendered, and their children aren’t traversed. Fragments don’t get traversed.

Children.map(children, fn, thisArg?) 
Call Children.map(children, fn, thisArg?) to map or transform each child in the children data structure.
import { Children } from 'react';

function RowList({ children }) {
 return (
   <div className="RowList">
     {Children.map(children, child =>
       <div className="Row">
         {child}
       </div>
     )}
   </div>
 );
}
See more examples below.
Parameters 
children: The value of the children prop received by your component.
fn: The mapping function, similar to the array map method callback. It will be called with the child as the first argument and its index as the second argument. The index starts at 0 and increments on each call. You need to return a React node from this function. This may be an empty node (null, undefined, or a Boolean), a string, a number, a React element, or an array of other React nodes.
optional thisArg: The this value with which the fn function should be called. If omitted, it’s undefined.
Returns 
If children is null or undefined, returns the same value.
Otherwise, returns a flat array consisting of the nodes you’ve returned from the fn function. The returned array will contain all nodes you returned except for null and undefined.
Caveats 
Empty nodes (null, undefined, and Booleans), strings, numbers, and React elements count as individual nodes. Arrays don’t count as individual nodes, but their children do. The traversal does not go deeper than React elements: they don’t get rendered, and their children aren’t traversed. Fragments don’t get traversed.
If you return an element or an array of elements with keys from fn, the returned elements’ keys will be automatically combined with the key of the corresponding original item from children. When you return multiple elements from fn in an array, their keys only need to be unique locally amongst each other.

Children.only(children) 
Call Children.only(children) to assert that children represent a single React element.
function Box({ children }) {
 const element = Children.only(children);
 // ...
Parameters 
children: The value of the children prop received by your component.
Returns 
If children is a valid element, returns that element.
Otherwise, throws an error.
Caveats 
This method always throws if you pass an array (such as the return value of Children.map) as children. In other words, it enforces that children is a single React element, not that it’s an array with a single element.

Children.toArray(children) 
Call Children.toArray(children) to create an array out of the children data structure.
import { Children } from 'react';

export default function ReversedList({ children }) {
 const result = Children.toArray(children);
 result.reverse();
 // ...
Parameters 
children: The value of the children prop received by your component.
Returns 
Returns a flat array of elements in children.
Caveats 
Empty nodes (null, undefined, and Booleans) will be omitted in the returned array. The returned elements’ keys will be calculated from the original elements’ keys and their level of nesting and position. This ensures that flattening the array does not introduce changes in behavior.

Usage 
Transforming children 
To transform the children JSX that your component receives as the children prop, call Children.map:
import { Children } from 'react';

function RowList({ children }) {
 return (
   <div className="RowList">
     {Children.map(children, child =>
       <div className="Row">
         {child}
       </div>
     )}
   </div>
 );
}
In the example above, the RowList wraps every child it receives into a <div className="Row"> container. For example, let’s say the parent component passes three <p> tags as the children prop to RowList:
<RowList>
 <p>This is the first item.</p>
 <p>This is the second item.</p>
 <p>This is the third item.</p>
</RowList>
Then, with the RowList implementation above, the final rendered result will look like this:
<div className="RowList">
 <div className="Row">
   <p>This is the first item.</p>
 </div>
 <div className="Row">
   <p>This is the second item.</p>
 </div>
 <div className="Row">
   <p>This is the third item.</p>
 </div>
</div>
Children.map is similar to to transforming arrays with map(). The difference is that the children data structure is considered opaque. This means that even if it’s sometimes an array, you should not assume it’s an array or any other particular data type. This is why you should use Children.map if you need to transform it.
App.jsRowList.js
Reset
Fork
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}


Deep Dive
Why is the children prop not always an array? 
Show Details
Pitfall
The children data structure does not include rendered output of the components you pass as JSX. In the example below, the children received by the RowList only contains two items rather than three:
<p>This is the first item.</p>
<MoreRows />
This is why only two row wrappers are generated in this example:
App.jsRowList.js
Reset
Fork
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </>
  );
}


Show more
There is no way to get the rendered output of an inner component like <MoreRows /> when manipulating children. This is why it’s usually better to use one of the alternative solutions.

Running some code for each child 
Call Children.forEach to iterate over each child in the children data structure. It does not return any value and is similar to the array forEach method. You can use it to run custom logic like constructing your own array.
App.jsSeparatorList.js
Reset
Fork
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Remove the last separator
  return result;
}


Pitfall
As mentioned earlier, there is no way to get the rendered output of an inner component when manipulating children. This is why it’s usually better to use one of the alternative solutions.

Counting children 
Call Children.count(children) to calculate the number of children.
App.jsRowList.js
Reset
Fork
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}


Show more
Pitfall
As mentioned earlier, there is no way to get the rendered output of an inner component when manipulating children. This is why it’s usually better to use one of the alternative solutions.

Converting children to an array 
Call Children.toArray(children) to turn the children data structure into a regular JavaScript array. This lets you manipulate the array with built-in array methods like filter, sort, or reverse.
App.jsReversedList.js
Reset
Fork
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}


Pitfall
As mentioned earlier, there is no way to get the rendered output of an inner component when manipulating children. This is why it’s usually better to use one of the alternative solutions.

Alternatives 
Note
This section describes alternatives to the Children API (with capital C) that’s imported like this:
import { Children } from 'react';
Don’t confuse it with using the children prop (lowercase c), which is good and encouraged.
Exposing multiple components 
Manipulating children with the Children methods often leads to fragile code. When you pass children to a component in JSX, you don’t usually expect the component to manipulate or transform the individual children.
When you can, try to avoid using the Children methods. For example, if you want every child of RowList to be wrapped in <div className="Row">, export a Row component, and manually wrap every row into it like this:
App.jsRowList.js
Reset
Fork
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </RowList>
  );
}


Show more
Unlike using Children.map, this approach does not wrap every child automatically. However, this approach has a significant benefit compared to the earlier example with Children.map because it works even if you keep extracting more components. For example, it still works if you extract your own MoreRows component:
App.jsRowList.js
Reset
Fork
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </>
  );
}


Show more
This wouldn’t work with Children.map because it would “see” <MoreRows /> as a single child (and a single row).

Accepting an array of objects as a prop 
You can also explicitly pass an array as a prop. For example, this RowList accepts a rows array as a prop:
App.jsRowList.js
Reset
Fork
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>This is the first item.</p> },
      { id: 'second', content: <p>This is the second item.</p> },
      { id: 'third', content: <p>This is the third item.</p> }
    ]} />
  );
}


Since rows is a regular JavaScript array, the RowList component can use built-in array methods like map on it.
This pattern is especially useful when you want to be able to pass more information as structured data together with children. In the below example, the TabSwitcher component receives an array of objects as the tabs prop:
App.jsTabSwitcher.js
Reset
Fork
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>This is the first item.</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>This is the second item.</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>This is the third item.</p>
      }
    ]} />
  );
}


Show more
Unlike passing the children as JSX, this approach lets you associate some extra data like header with each item. Because you are working with the tabs directly, and it is an array, you do not need the Children methods.

Calling a render prop to customize rendering 
Instead of producing JSX for every single item, you can also pass a function that returns JSX, and call that function when necessary. In this example, the App component passes a renderContent function to the TabSwitcher component. The TabSwitcher component calls renderContent only for the selected tab:
App.jsTabSwitcher.js
Reset
Fork
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>This is the {tabId} item.</p>;
      }}
    />
  );
}


A prop like renderContent is called a render prop because it is a prop that specifies how to render a piece of the user interface. However, there is nothing special about it: it is a regular prop which happens to be a function.
Render props are functions, so you can pass information to them. For example, this RowList component passes the id and the index of each row to the renderRow render prop, which uses index to highlight even rows:
App.jsRowList.js
Reset
Fork
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>This is the {id} item.</p>
          </Row> 
        );
      }}
    />
  );
}


Show more
This is another example of how parent and child components can cooperate without manipulating the children.

Troubleshooting 
I pass a custom component, but the Children methods don’t show its render result 
Suppose you pass two children to RowList like this:
<RowList>
 <p>First item</p>
 <MoreRows />
</RowList>
If you do Children.count(children) inside RowList, you will get 2. Even if MoreRows renders 10 different items, or if it returns null, Children.count(children) will still be 2. From the RowList’s perspective, it only “sees” the JSX it has received. It does not “see” the internals of the MoreRows component.
The limitation makes it hard to extract a component. This is why alternatives are preferred to using Children.
PreviousLegacy React APIs
NextcloneElement

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
Children.count(children)
Children.forEach(children, fn, thisArg?)
Children.map(children, fn, thisArg?)
Children.only(children)
Children.toArray(children)
Usage
Transforming children
Running some code for each child
Counting children
Converting children to an array
Alternatives
Exposing multiple components
Accepting an array of objects as a prop
Calling a render prop to customize rendering
Troubleshooting
I pass a custom component, but the Children methods don’t show its render result
Children – React
cloneElement
Pitfall
Using cloneElement is uncommon and can lead to fragile code. See common alternatives.
cloneElement lets you create a new React element using another element as a starting point.
const clonedElement = cloneElement(element, props, ...children)
Reference
cloneElement(element, props, ...children)
Usage
Overriding props of an element
Alternatives
Passing data with a render prop
Passing data through context
Extracting logic into a custom Hook

Reference 
cloneElement(element, props, ...children) 
Call cloneElement to create a React element based on the element, but with different props and children:
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
 <Row title="Cabbage">
   Hello
 </Row>,
 { isHighlighted: true },
 'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
See more examples below.
Parameters 
element: The element argument must be a valid React element. For example, it could be a JSX node like <Something />, the result of calling createElement, or the result of another cloneElement call.
props: The props argument must either be an object or null. If you pass null, the cloned element will retain all of the original element.props. Otherwise, for every prop in the props object, the returned element will “prefer” the value from props over the value from element.props. The rest of the props will be filled from the original element.props. If you pass props.key or props.ref, they will replace the original ones.
optional ...children: Zero or more child nodes. They can be any React nodes, including React elements, strings, numbers, portals, empty nodes (null, undefined, true, and false), and arrays of React nodes. If you don’t pass any ...children arguments, the original element.props.children will be preserved.
Returns 
cloneElement returns a React element object with a few properties:
type: Same as element.type.
props: The result of shallowly merging element.props with the overriding props you have passed.
ref: The original element.ref, unless it was overridden by props.ref.
key: The original element.key, unless it was overridden by props.key.
Usually, you’ll return the element from your component or make it a child of another element. Although you may read the element’s properties, it’s best to treat every element as opaque after it’s created, and only render it.
Caveats 
Cloning an element does not modify the original element.
You should only pass children as multiple arguments to cloneElement if they are all statically known, like cloneElement(element, null, child1, child2, child3). If your children are dynamic, pass the entire array as the third argument: cloneElement(element, null, listItems). This ensures that React will warn you about missing keys for any dynamic lists. For static lists this is not necessary because they never reorder.
cloneElement makes it harder to trace the data flow, so try the alternatives instead.

Usage 
Overriding props of an element 
To override the props of some React element, pass it to cloneElement with the props you want to override:
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
 <Row title="Cabbage" />,
 { isHighlighted: true }
);
Here, the resulting cloned element will be <Row title="Cabbage" isHighlighted={true} />.
Let’s walk through an example to see when it’s useful.
Imagine a List component that renders its children as a list of selectable rows with a “Next” button that changes which row is selected. The List component needs to render the selected Row differently, so it clones every <Row> child that it has received, and adds an extra isHighlighted: true or isHighlighted: false prop:
export default function List({ children }) {
 const [selectedIndex, setSelectedIndex] = useState(0);
 return (
   <div className="List">
     {Children.map(children, (child, index) =>
       cloneElement(child, {
         isHighlighted: index === selectedIndex
       })
     )}
Let’s say the original JSX received by List looks like this:
<List>
 <Row title="Cabbage" />
 <Row title="Garlic" />
 <Row title="Apple" />
</List>
By cloning its children, the List can pass extra information to every Row inside. The result looks like this:
<List>
 <Row
   title="Cabbage"
   isHighlighted={true}
 />
 <Row
   title="Garlic"
   isHighlighted={false}
 />
 <Row
   title="Apple"
   isHighlighted={false}
 />
</List>
Notice how pressing “Next” updates the state of the List, and highlights a different row:
App.jsList.jsRow.jsdata.js
Reset
Fork
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}


Show more
To summarize, the List cloned the <Row /> elements it received and added an extra prop to them.
Pitfall
Cloning children makes it hard to tell how the data flows through your app. Try one of the alternatives.

Alternatives 
Passing data with a render prop 
Instead of using cloneElement, consider accepting a render prop like renderItem. Here, List receives renderItem as a prop. List calls renderItem for every item and passes isHighlighted as an argument:
export default function List({ items, renderItem }) {
 const [selectedIndex, setSelectedIndex] = useState(0);
 return (
   <div className="List">
     {items.map((item, index) => {
       const isHighlighted = index === selectedIndex;
       return renderItem(item, isHighlighted);
     })}
The renderItem prop is called a “render prop” because it’s a prop that specifies how to render something. For example, you can pass a renderItem implementation that renders a <Row> with the given isHighlighted value:
<List
 items={products}
 renderItem={(product, isHighlighted) =>
   <Row
     key={product.id}
     title={product.title}
     isHighlighted={isHighlighted}
   />
 }
/>
The end result is the same as with cloneElement:
<List>
 <Row
   title="Cabbage"
   isHighlighted={true}
 />
 <Row
   title="Garlic"
   isHighlighted={false}
 />
 <Row
   title="Apple"
   isHighlighted={false}
 />
</List>
However, you can clearly trace where the isHighlighted value is coming from.
App.jsList.jsRow.jsdata.js
Reset
Fork
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}


Show more
This pattern is preferred to cloneElement because it is more explicit.

Passing data through context 
Another alternative to cloneElement is to pass data through context.
For example, you can call createContext to define a HighlightContext:
export const HighlightContext = createContext(false);
Your List component can wrap every item it renders into a HighlightContext provider:
export default function List({ items, renderItem }) {
 const [selectedIndex, setSelectedIndex] = useState(0);
 return (
   <div className="List">
     {items.map((item, index) => {
       const isHighlighted = index === selectedIndex;
       return (
         <HighlightContext key={item.id} value={isHighlighted}>
           {renderItem(item)}
         </HighlightContext>
       );
     })}
With this approach, Row does not need to receive an isHighlighted prop at all. Instead, it reads the context:
export default function Row({ title }) {
 const isHighlighted = useContext(HighlightContext);
 // ...
This allows the calling component to not know or worry about passing isHighlighted to <Row>:
<List
 items={products}
 renderItem={product =>
   <Row title={product.title} />
 }
/>
Instead, List and Row coordinate the highlighting logic through context.
App.jsList.jsRow.jsHighlightContext.jsdata.js
Reset
Fork
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}


Show more
Learn more about passing data through context.

Extracting logic into a custom Hook 
Another approach you can try is to extract the “non-visual” logic into your own Hook, and use the information returned by your Hook to decide what to render. For example, you could write a useList custom Hook like this:
import { useState } from 'react';

export default function useList(items) {
 const [selectedIndex, setSelectedIndex] = useState(0);

 function onNext() {
   setSelectedIndex(i =>
     (i + 1) % items.length
   );
 }

 const selected = items[selectedIndex];
 return [selected, onNext];
}
Then you could use it like this:
export default function App() {
 const [selected, onNext] = useList(products);
 return (
   <div className="List">
     {products.map(product =>
       <Row
         key={product.id}
         title={product.title}
         isHighlighted={selected === product}
       />
     )}
     <hr />
     <button onClick={onNext}>
       Next
     </button>
   </div>
 );
}
The data flow is explicit, but the state is inside the useList custom Hook that you can use from any component:
App.jsuseList.jsRow.jsdata.js
Reset
Fork
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}


Show more
This approach is particularly useful if you want to reuse this logic between different components.
PreviousChildren
NextComponent

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
cloneElement(element, props, ...children)
Usage
Overriding props of an element
Alternatives
Passing data with a render prop
Passing data through context
Extracting logic into a custom Hook
cloneElement – React
Component
Pitfall
We recommend defining components as functions instead of classes. See how to migrate.
Component is the base class for the React components defined as JavaScript classes. Class components are still supported by React, but we don’t recommend using them in new code.
class Greeting extends Component {
 render() {
   return <h1>Hello, {this.props.name}!</h1>;
 }
}
Reference
Component
context
props
state
constructor(props)
componentDidCatch(error, info)
componentDidMount()
componentDidUpdate(prevProps, prevState, snapshot?)
componentWillMount()
componentWillReceiveProps(nextProps)
componentWillUpdate(nextProps, nextState)
componentWillUnmount()
forceUpdate(callback?)
getSnapshotBeforeUpdate(prevProps, prevState)
render()
setState(nextState, callback?)
shouldComponentUpdate(nextProps, nextState, nextContext)
UNSAFE_componentWillMount()
UNSAFE_componentWillReceiveProps(nextProps, nextContext)
UNSAFE_componentWillUpdate(nextProps, nextState)
static contextType
static defaultProps
static getDerivedStateFromError(error)
static getDerivedStateFromProps(props, state)
Usage
Defining a class component
Adding state to a class component
Adding lifecycle methods to a class component
Catching rendering errors with an error boundary
Alternatives
Migrating a simple component from a class to a function
Migrating a component with state from a class to a function
Migrating a component with lifecycle methods from a class to a function
Migrating a component with context from a class to a function

Reference 
Component 
To define a React component as a class, extend the built-in Component class and define a render method:
import { Component } from 'react';

class Greeting extends Component {
 render() {
   return <h1>Hello, {this.props.name}!</h1>;
 }
}
Only the render method is required, other methods are optional.
See more examples below.

context 
The context of a class component is available as this.context. It is only available if you specify which context you want to receive using static contextType.
A class component can only read one context at a time.
class Button extends Component {
 static contextType = ThemeContext;

 render() {
   const theme = this.context;
   const className = 'button-' + theme;
   return (
     <button className={className}>
       {this.props.children}
     </button>
   );
 }
}
Note
Reading this.context in class components is equivalent to useContext in function components.
See how to migrate.

props 
The props passed to a class component are available as this.props.
class Greeting extends Component {
 render() {
   return <h1>Hello, {this.props.name}!</h1>;
 }
}

<Greeting name="Taylor" />
Note
Reading this.props in class components is equivalent to declaring props in function components.
See how to migrate.

state 
The state of a class component is available as this.state. The state field must be an object. Do not mutate the state directly. If you wish to change the state, call setState with the new state.
class Counter extends Component {
 state = {
   age: 42,
 };

 handleAgeChange = () => {
   this.setState({
     age: this.state.age + 1
   });
 };

 render() {
   return (
     <>
       <button onClick={this.handleAgeChange}>
       Increment age
       </button>
       <p>You are {this.state.age}.</p>
     </>
   );
 }
}
Note
Defining state in class components is equivalent to calling useState in function components.
See how to migrate.

constructor(props) 
The constructor runs before your class component mounts (gets added to the screen). Typically, a constructor is only used for two purposes in React. It lets you declare state and bind your class methods to the class instance:
class Counter extends Component {
 constructor(props) {
   super(props);
   this.state = { counter: 0 };
   this.handleClick = this.handleClick.bind(this);
 }

 handleClick() {
   // ...
 }
If you use modern JavaScript syntax, constructors are rarely needed. Instead, you can rewrite this code above using the public class field syntax which is supported both by modern browsers and tools like Babel:
class Counter extends Component {
 state = { counter: 0 };

 handleClick = () => {
   // ...
 }
A constructor should not contain any side effects or subscriptions.
Parameters 
props: The component’s initial props.
Returns 
constructor should not return anything.
Caveats 
Do not run any side effects or subscriptions in the constructor. Instead, use componentDidMount for that.
Inside a constructor, you need to call super(props) before any other statement. If you don’t do that, this.props will be undefined while the constructor runs, which can be confusing and cause bugs.
Constructor is the only place where you can assign this.state directly. In all other methods, you need to use this.setState() instead. Do not call setState in the constructor.
When you use server rendering, the constructor will run on the server too, followed by the render method. However, lifecycle methods like componentDidMount or componentWillUnmount will not run on the server.
When Strict Mode is on, React will call constructor twice in development and then throw away one of the instances. This helps you notice the accidental side effects that need to be moved out of the constructor.
Note
There is no exact equivalent for constructor in function components. To declare state in a function component, call useState. To avoid recalculating the initial state, pass a function to useState.

componentDidCatch(error, info) 
If you define componentDidCatch, React will call it when some child component (including distant children) throws an error during rendering. This lets you log that error to an error reporting service in production.
Typically, it is used together with static getDerivedStateFromError which lets you update state in response to an error and display an error message to the user. A component with these methods is called an error boundary.
See an example.
Parameters 
error: The error that was thrown. In practice, it will usually be an instance of Error but this is not guaranteed because JavaScript allows to throw any value, including strings or even null.
info: An object containing additional information about the error. Its componentStack field contains a stack trace with the component that threw, as well as the names and source locations of all its parent components. In production, the component names will be minified. If you set up production error reporting, you can decode the component stack using sourcemaps the same way as you would do for regular JavaScript error stacks.
Returns 
componentDidCatch should not return anything.
Caveats 
In the past, it was common to call setState inside componentDidCatch in order to update the UI and display the fallback error message. This is deprecated in favor of defining static getDerivedStateFromError.
Production and development builds of React slightly differ in the way componentDidCatch handles errors. In development, the errors will bubble up to window, which means that any window.onerror or window.addEventListener('error', callback) will intercept the errors that have been caught by componentDidCatch. In production, instead, the errors will not bubble up, which means any ancestor error handler will only receive errors not explicitly caught by componentDidCatch.
Note
There is no direct equivalent for componentDidCatch in function components yet. If you’d like to avoid creating class components, write a single ErrorBoundary component like above and use it throughout your app. Alternatively, you can use the react-error-boundary package which does that for you.

componentDidMount() 
If you define the componentDidMount method, React will call it when your component is added (mounted) to the screen. This is a common place to start data fetching, set up subscriptions, or manipulate the DOM nodes.
If you implement componentDidMount, you usually need to implement other lifecycle methods to avoid bugs. For example, if componentDidMount reads some state or props, you also have to implement componentDidUpdate to handle their changes, and componentWillUnmount to clean up whatever componentDidMount was doing.
class ChatRoom extends Component {
 state = {
   serverUrl: 'https://localhost:1234'
 };

 componentDidMount() {
   this.setupConnection();
 }

 componentDidUpdate(prevProps, prevState) {
   if (
     this.props.roomId !== prevProps.roomId ||
     this.state.serverUrl !== prevState.serverUrl
   ) {
     this.destroyConnection();
     this.setupConnection();
   }
 }

 componentWillUnmount() {
   this.destroyConnection();
 }

 // ...
}
See more examples.
Parameters 
componentDidMount does not take any parameters.
Returns 
componentDidMount should not return anything.
Caveats 
When Strict Mode is on, in development React will call componentDidMount, then immediately call componentWillUnmount, and then call componentDidMount again. This helps you notice if you forgot to implement componentWillUnmount or if its logic doesn’t fully “mirror” what componentDidMount does.
Although you may call setState immediately in componentDidMount, it’s best to avoid that when you can. It will trigger an extra rendering, but it will happen before the browser updates the screen. This guarantees that even though the render will be called twice in this case, the user won’t see the intermediate state. Use this pattern with caution because it often causes performance issues. In most cases, you should be able to assign the initial state in the constructor instead. It can, however, be necessary for cases like modals and tooltips when you need to measure a DOM node before rendering something that depends on its size or position.
Note
For many use cases, defining componentDidMount, componentDidUpdate, and componentWillUnmount together in class components is equivalent to calling useEffect in function components. In the rare cases where it’s important for the code to run before browser paint, useLayoutEffect is a closer match.
See how to migrate.

componentDidUpdate(prevProps, prevState, snapshot?) 
If you define the componentDidUpdate method, React will call it immediately after your component has been re-rendered with updated props or state.  This method is not called for the initial render.
You can use it to manipulate the DOM after an update. This is also a common place to do network requests as long as you compare the current props to previous props (e.g. a network request may not be necessary if the props have not changed). Typically, you’d use it together with componentDidMount and componentWillUnmount:
class ChatRoom extends Component {
 state = {
   serverUrl: 'https://localhost:1234'
 };

 componentDidMount() {
   this.setupConnection();
 }

 componentDidUpdate(prevProps, prevState) {
   if (
     this.props.roomId !== prevProps.roomId ||
     this.state.serverUrl !== prevState.serverUrl
   ) {
     this.destroyConnection();
     this.setupConnection();
   }
 }

 componentWillUnmount() {
   this.destroyConnection();
 }

 // ...
}
See more examples.
Parameters 
prevProps: Props before the update. Compare prevProps to this.props to determine what changed.
prevState: State before the update. Compare prevState to this.state to determine what changed.
snapshot: If you implemented getSnapshotBeforeUpdate, snapshot will contain the value you returned from that method. Otherwise, it will be undefined.
Returns 
componentDidUpdate should not return anything.
Caveats 
componentDidUpdate will not get called if shouldComponentUpdate is defined and returns false.
The logic inside componentDidUpdate should usually be wrapped in conditions comparing this.props with prevProps, and this.state with prevState. Otherwise, there’s a risk of creating infinite loops.
Although you may call setState immediately in componentDidUpdate, it’s best to avoid that when you can. It will trigger an extra rendering, but it will happen before the browser updates the screen. This guarantees that even though the render will be called twice in this case, the user won’t see the intermediate state. This pattern often causes performance issues, but it may be necessary for rare cases like modals and tooltips when you need to measure a DOM node before rendering something that depends on its size or position.
Note
For many use cases, defining componentDidMount, componentDidUpdate, and componentWillUnmount together in class components is equivalent to calling useEffect in function components. In the rare cases where it’s important for the code to run before browser paint, useLayoutEffect is a closer match.
See how to migrate.

componentWillMount() 
Deprecated
This API has been renamed from componentWillMount to UNSAFE_componentWillMount. The old name has been deprecated. In a future major version of React, only the new name will work.
Run the rename-unsafe-lifecycles codemod to automatically update your components.

componentWillReceiveProps(nextProps) 
Deprecated
This API has been renamed from componentWillReceiveProps to UNSAFE_componentWillReceiveProps. The old name has been deprecated. In a future major version of React, only the new name will work.
Run the rename-unsafe-lifecycles codemod to automatically update your components.

componentWillUpdate(nextProps, nextState) 
Deprecated
This API has been renamed from componentWillUpdate to UNSAFE_componentWillUpdate. The old name has been deprecated. In a future major version of React, only the new name will work.
Run the rename-unsafe-lifecycles codemod to automatically update your components.

componentWillUnmount() 
If you define the componentWillUnmount method, React will call it before your component is removed (unmounted) from the screen. This is a common place to cancel data fetching or remove subscriptions.
The logic inside componentWillUnmount should “mirror” the logic inside componentDidMount. For example, if componentDidMount sets up a subscription, componentWillUnmount should clean up that subscription. If the cleanup logic in your componentWillUnmount reads some props or state, you will usually also need to implement componentDidUpdate to clean up resources (such as subscriptions) corresponding to the old props and state.
class ChatRoom extends Component {
 state = {
   serverUrl: 'https://localhost:1234'
 };

 componentDidMount() {
   this.setupConnection();
 }

 componentDidUpdate(prevProps, prevState) {
   if (
     this.props.roomId !== prevProps.roomId ||
     this.state.serverUrl !== prevState.serverUrl
   ) {
     this.destroyConnection();
     this.setupConnection();
   }
 }

 componentWillUnmount() {
   this.destroyConnection();
 }

 // ...
}
See more examples.
Parameters 
componentWillUnmount does not take any parameters.
Returns 
componentWillUnmount should not return anything.
Caveats 
When Strict Mode is on, in development React will call componentDidMount, then immediately call componentWillUnmount, and then call componentDidMount again. This helps you notice if you forgot to implement componentWillUnmount or if its logic doesn’t fully “mirror” what componentDidMount does.
Note
For many use cases, defining componentDidMount, componentDidUpdate, and componentWillUnmount together in class components is equivalent to calling useEffect in function components. In the rare cases where it’s important for the code to run before browser paint, useLayoutEffect is a closer match.
See how to migrate.

forceUpdate(callback?) 
Forces a component to re-render.
Usually, this is not necessary. If your component’s render method only reads from this.props, this.state, or this.context, it will re-render automatically when you call setState inside your component or one of its parents. However, if your component’s render method reads directly from an external data source, you have to tell React to update the user interface when that data source changes. That’s what forceUpdate lets you do.
Try to avoid all uses of forceUpdate and only read from this.props and this.state in render.
Parameters 
optional callback If specified, React will call the callback you’ve provided after the update is committed.
Returns 
forceUpdate does not return anything.
Caveats 
If you call forceUpdate, React will re-render without calling shouldComponentUpdate.
Note
Reading an external data source and forcing class components to re-render in response to its changes with forceUpdate has been superseded by useSyncExternalStore in function components.

getSnapshotBeforeUpdate(prevProps, prevState) 
If you implement getSnapshotBeforeUpdate, React will call it immediately before React updates the DOM. It enables your component to capture some information from the DOM (e.g. scroll position) before it is potentially changed. Any value returned by this lifecycle method will be passed as a parameter to componentDidUpdate.
For example, you can use it in a UI like a chat thread that needs to preserve its scroll position during updates:
class ScrollingList extends React.Component {
 constructor(props) {
   super(props);
   this.listRef = React.createRef();
 }

 getSnapshotBeforeUpdate(prevProps, prevState) {
   // Are we adding new items to the list?
   // Capture the scroll position so we can adjust scroll later.
   if (prevProps.list.length < this.props.list.length) {
     const list = this.listRef.current;
     return list.scrollHeight - list.scrollTop;
   }
   return null;
 }

 componentDidUpdate(prevProps, prevState, snapshot) {
   // If we have a snapshot value, we've just added new items.
   // Adjust scroll so these new items don't push the old ones out of view.
   // (snapshot here is the value returned from getSnapshotBeforeUpdate)
   if (snapshot !== null) {
     const list = this.listRef.current;
     list.scrollTop = list.scrollHeight - snapshot;
   }
 }

 render() {
   return (
     <div ref={this.listRef}>{/* ...contents... */}</div>
   );
 }
}
In the above example, it is important to read the scrollHeight property directly in getSnapshotBeforeUpdate. It is not safe to read it in render, UNSAFE_componentWillReceiveProps, or UNSAFE_componentWillUpdate because there is a potential time gap between these methods getting called and React updating the DOM.
Parameters 
prevProps: Props before the update. Compare prevProps to this.props to determine what changed.
prevState: State before the update. Compare prevState to this.state to determine what changed.
Returns 
You should return a snapshot value of any type that you’d like, or null. The value you returned will be passed as the third argument to componentDidUpdate.
Caveats 
getSnapshotBeforeUpdate will not get called if shouldComponentUpdate is defined and returns false.
Note
At the moment, there is no equivalent to getSnapshotBeforeUpdate for function components. This use case is very uncommon, but if you have the need for it, for now you’ll have to write a class component.

render() 
The render method is the only required method in a class component.
The render method should specify what you want to appear on the screen, for example:
import { Component } from 'react';

class Greeting extends Component {
 render() {
   return <h1>Hello, {this.props.name}!</h1>;
 }
}
React may call render at any moment, so you shouldn’t assume that it runs at a particular time. Usually, the render method should return a piece of JSX, but a few other return types (like strings) are supported. To calculate the returned JSX, the render method can read this.props, this.state, and this.context.
You should write the render method as a pure function, meaning that it should return the same result if props, state, and context are the same. It also shouldn’t contain side effects (like setting up subscriptions) or interact with the browser APIs. Side effects should happen either in event handlers or methods like componentDidMount.
Parameters 
render does not take any parameters.
Returns 
render can return any valid React node. This includes React elements such as <div />, strings, numbers, portals, empty nodes (null, undefined, true, and false), and arrays of React nodes.
Caveats 
render should be written as a pure function of props, state, and context. It should not have side effects.
render will not get called if shouldComponentUpdate is defined and returns false.
When Strict Mode is on, React will call render twice in development and then throw away one of the results. This helps you notice the accidental side effects that need to be moved out of the render method.
There is no one-to-one correspondence between the render call and the subsequent componentDidMount or componentDidUpdate call. Some of the render call results may be discarded by React when it’s beneficial.

setState(nextState, callback?) 
Call setState to update the state of your React component.
class Form extends Component {
 state = {
   name: 'Taylor',
 };

 handleNameChange = (e) => {
   const newName = e.target.value;
   this.setState({
     name: newName
   });
 }

 render() {
   return (
     <>
       <input value={this.state.name} onChange={this.handleNameChange} />
       <p>Hello, {this.state.name}.</p>
     </>
   );
 }
}
setState enqueues changes to the component state. It tells React that this component and its children need to re-render with the new state. This is the main way you’ll update the user interface in response to interactions.
Pitfall
Calling setState does not change the current state in the already executing code:
function handleClick() {
 console.log(this.state.name); // "Taylor"
 this.setState({
   name: 'Robin'
 });
 console.log(this.state.name); // Still "Taylor"!
}
It only affects what this.state will return starting from the next render.
You can also pass a function to setState. It lets you update state based on the previous state:
 handleIncreaseAge = () => {
   this.setState(prevState => {
     return {
       age: prevState.age + 1
     };
   });
 }
You don’t have to do this, but it’s handy if you want to update state multiple times during the same event.
Parameters 
nextState: Either an object or a function.
If you pass an object as nextState, it will be shallowly merged into this.state.
If you pass a function as nextState, it will be treated as an updater function. It must be pure, should take the pending state and props as arguments, and should return the object to be shallowly merged into this.state. React will put your updater function in a queue and re-render your component. During the next render, React will calculate the next state by applying all of the queued updaters to the previous state.
optional callback: If specified, React will call the callback you’ve provided after the update is committed.
Returns 
setState does not return anything.
Caveats 
Think of setState as a request rather than an immediate command to update the component. When multiple components update their state in response to an event, React will batch their updates and re-render them together in a single pass at the end of the event. In the rare case that you need to force a particular state update to be applied synchronously, you may wrap it in flushSync, but this may hurt performance.
setState does not update this.state immediately. This makes reading this.state right after calling setState a potential pitfall. Instead, use componentDidUpdate or the setState callback argument, either of which are guaranteed to fire after the update has been applied. If you need to set the state based on the previous state, you can pass a function to nextState as described above.
Note
Calling setState in class components is similar to calling a set function in function components.
See how to migrate.

shouldComponentUpdate(nextProps, nextState, nextContext) 
If you define shouldComponentUpdate, React will call it to determine whether a re-render can be skipped.
If you are confident you want to write it by hand, you may compare this.props with nextProps and this.state with nextState and return false to tell React the update can be skipped.
class Rectangle extends Component {
 state = {
   isHovered: false
 };

 shouldComponentUpdate(nextProps, nextState) {
   if (
     nextProps.position.x === this.props.position.x &&
     nextProps.position.y === this.props.position.y &&
     nextProps.size.width === this.props.size.width &&
     nextProps.size.height === this.props.size.height &&
     nextState.isHovered === this.state.isHovered
   ) {
     // Nothing has changed, so a re-render is unnecessary
     return false;
   }
   return true;
 }

 // ...
}
React calls shouldComponentUpdate before rendering when new props or state are being received. Defaults to true. This method is not called for the initial render or when forceUpdate is used.
Parameters 
nextProps: The next props that the component is about to render with. Compare nextProps to this.props to determine what changed.
nextState: The next state that the component is about to render with. Compare nextState to this.state to determine what changed.
nextContext: The next context that the component is about to render with. Compare nextContext to this.context to determine what changed. Only available if you specify static contextType.
Returns 
Return true if you want the component to re-render. That’s the default behavior.
Return false to tell React that re-rendering can be skipped.
Caveats 
This method only exists as a performance optimization. If your component breaks without it, fix that first.
Consider using PureComponent instead of writing shouldComponentUpdate by hand. PureComponent shallowly compares props and state, and reduces the chance that you’ll skip a necessary update.
We do not recommend doing deep equality checks or using JSON.stringify in shouldComponentUpdate. It makes performance unpredictable and dependent on the data structure of every prop and state. In the best case, you risk introducing multi-second stalls to your application, and in the worst case you risk crashing it.
Returning false does not prevent child components from re-rendering when their state changes.
Returning false does not guarantee that the component will not re-render. React will use the return value as a hint but it may still choose to re-render your component if it makes sense to do for other reasons.
Note
Optimizing class components with shouldComponentUpdate is similar to optimizing function components with memo. Function components also offer more granular optimization with useMemo.

UNSAFE_componentWillMount() 
If you define UNSAFE_componentWillMount, React will call it immediately after the constructor. It only exists for historical reasons and should not be used in any new code. Instead, use one of the alternatives:
To initialize state, declare state as a class field or set this.state inside the constructor.
If you need to run a side effect or set up a subscription, move that logic to componentDidMount instead.
See examples of migrating away from unsafe lifecycles.
Parameters 
UNSAFE_componentWillMount does not take any parameters.
Returns 
UNSAFE_componentWillMount should not return anything.
Caveats 
UNSAFE_componentWillMount will not get called if the component implements static getDerivedStateFromProps or getSnapshotBeforeUpdate.
Despite its naming, UNSAFE_componentWillMount does not guarantee that the component will get mounted if your app uses modern React features like Suspense. If a render attempt is suspended (for example, because the code for some child component has not loaded yet), React will throw the in-progress tree away and attempt to construct the component from scratch during the next attempt. This is why this method is “unsafe”. Code that relies on mounting (like adding a subscription) should go into componentDidMount.
UNSAFE_componentWillMount is the only lifecycle method that runs during server rendering. For all practical purposes, it is identical to constructor, so you should use the constructor for this type of logic instead.
Note
Calling setState inside UNSAFE_componentWillMount in a class component to initialize state is equivalent to passing that state as the initial state to useState in a function component.

UNSAFE_componentWillReceiveProps(nextProps, nextContext) 
If you define UNSAFE_componentWillReceiveProps, React will call it when the component receives new props. It only exists for historical reasons and should not be used in any new code. Instead, use one of the alternatives:
If you need to run a side effect (for example, fetch data, run an animation, or reinitialize a subscription) in response to prop changes, move that logic to componentDidUpdate instead.
If you need to avoid re-computing some data only when a prop changes, use a memoization helper instead.
If you need to “reset” some state when a prop changes, consider either making a component fully controlled or fully uncontrolled with a key instead.
If you need to “adjust” some state when a prop changes, check whether you can compute all the necessary information from props alone during rendering. If you can’t, use static getDerivedStateFromProps instead.
See examples of migrating away from unsafe lifecycles.
Parameters 
nextProps: The next props that the component is about to receive from its parent component. Compare nextProps to this.props to determine what changed.
nextContext: The next context that the component is about to receive from the closest provider. Compare nextContext to this.context to determine what changed. Only available if you specify static contextType.
Returns 
UNSAFE_componentWillReceiveProps should not return anything.
Caveats 
UNSAFE_componentWillReceiveProps will not get called if the component implements static getDerivedStateFromProps or getSnapshotBeforeUpdate.
Despite its naming, UNSAFE_componentWillReceiveProps does not guarantee that the component will receive those props if your app uses modern React features like Suspense. If a render attempt is suspended (for example, because the code for some child component has not loaded yet), React will throw the in-progress tree away and attempt to construct the component from scratch during the next attempt. By the time of the next render attempt, the props might be different. This is why this method is “unsafe”. Code that should run only for committed updates (like resetting a subscription) should go into componentDidUpdate.
UNSAFE_componentWillReceiveProps does not mean that the component has received different props than the last time. You need to compare nextProps and this.props yourself to check if something changed.
React doesn’t call UNSAFE_componentWillReceiveProps with initial props during mounting. It only calls this method if some of component’s props are going to be updated. For example, calling setState doesn’t generally trigger UNSAFE_componentWillReceiveProps inside the same component.
Note
Calling setState inside UNSAFE_componentWillReceiveProps in a class component to “adjust” state is equivalent to calling the set function from useState during rendering in a function component.

UNSAFE_componentWillUpdate(nextProps, nextState) 
If you define UNSAFE_componentWillUpdate, React will call it before rendering with the new props or state. It only exists for historical reasons and should not be used in any new code. Instead, use one of the alternatives:
If you need to run a side effect (for example, fetch data, run an animation, or reinitialize a subscription) in response to prop or state changes, move that logic to componentDidUpdate instead.
If you need to read some information from the DOM (for example, to save the current scroll position) so that you can use it in componentDidUpdate later, read it inside getSnapshotBeforeUpdate instead.
See examples of migrating away from unsafe lifecycles.
Parameters 
nextProps: The next props that the component is about to render with. Compare nextProps to this.props to determine what changed.
nextState: The next state that the component is about to render with. Compare nextState to this.state to determine what changed.
Returns 
UNSAFE_componentWillUpdate should not return anything.
Caveats 
UNSAFE_componentWillUpdate will not get called if shouldComponentUpdate is defined and returns false.
UNSAFE_componentWillUpdate will not get called if the component implements static getDerivedStateFromProps or getSnapshotBeforeUpdate.
It’s not supported to call setState (or any method that leads to setState being called, like dispatching a Redux action) during componentWillUpdate.
Despite its naming, UNSAFE_componentWillUpdate does not guarantee that the component will update if your app uses modern React features like Suspense. If a render attempt is suspended (for example, because the code for some child component has not loaded yet), React will throw the in-progress tree away and attempt to construct the component from scratch during the next attempt. By the time of the next render attempt, the props and state might be different. This is why this method is “unsafe”. Code that should run only for committed updates (like resetting a subscription) should go into componentDidUpdate.
UNSAFE_componentWillUpdate does not mean that the component has received different props or state than the last time. You need to compare nextProps with this.props and nextState with this.state yourself to check if something changed.
React doesn’t call UNSAFE_componentWillUpdate with initial props and state during mounting.
Note
There is no direct equivalent to UNSAFE_componentWillUpdate in function components.

static contextType 
If you want to read this.context from your class component, you must specify which context it needs to read. The context you specify as the static contextType must be a value previously created by createContext.
class Button extends Component {
 static contextType = ThemeContext;

 render() {
   const theme = this.context;
   const className = 'button-' + theme;
   return (
     <button className={className}>
       {this.props.children}
     </button>
   );
 }
}
Note
Reading this.context in class components is equivalent to useContext in function components.
See how to migrate.

static defaultProps 
You can define static defaultProps to set the default props for the class. They will be used for undefined and missing props, but not for null props.
For example, here is how you define that the color prop should default to 'blue':
class Button extends Component {
 static defaultProps = {
   color: 'blue'
 };

 render() {
   return <button className={this.props.color}>click me</button>;
 }
}
If the color prop is not provided or is undefined, it will be set by default to 'blue':
<>
 {/* this.props.color is "blue" */}
 <Button />

 {/* this.props.color is "blue" */}
 <Button color={undefined} />

 {/* this.props.color is null */}
 <Button color={null} />

 {/* this.props.color is "red" */}
 <Button color="red" />
</>
Note
Defining defaultProps in class components is similar to using default values in function components.

static getDerivedStateFromError(error) 
If you define static getDerivedStateFromError, React will call it when a child component (including distant children) throws an error during rendering. This lets you display an error message instead of clearing the UI.
Typically, it is used together with componentDidCatch which lets you send the error report to some analytics service. A component with these methods is called an error boundary.
See an example.
Parameters 
error: The error that was thrown. In practice, it will usually be an instance of Error but this is not guaranteed because JavaScript allows to throw any value, including strings or even null.
Returns 
static getDerivedStateFromError should return the state telling the component to display the error message.
Caveats 
static getDerivedStateFromError should be a pure function. If you want to perform a side effect (for example, to call an analytics service), you need to also implement componentDidCatch.
Note
There is no direct equivalent for static getDerivedStateFromError in function components yet. If you’d like to avoid creating class components, write a single ErrorBoundary component like above and use it throughout your app. Alternatively, use the react-error-boundary package which does that.

static getDerivedStateFromProps(props, state) 
If you define static getDerivedStateFromProps, React will call it right before calling render, both on the initial mount and on subsequent updates. It should return an object to update the state, or null to update nothing.
This method exists for rare use cases where the state depends on changes in props over time. For example, this Form component resets the email state when the userID prop changes:
class Form extends Component {
 state = {
   email: this.props.defaultEmail,
   prevUserID: this.props.userID
 };

 static getDerivedStateFromProps(props, state) {
   // Any time the current user changes,
   // Reset any parts of state that are tied to that user.
   // In this simple example, that's just the email.
   if (props.userID !== state.prevUserID) {
     return {
       prevUserID: props.userID,
       email: props.defaultEmail
     };
   }
   return null;
 }

 // ...
}
Note that this pattern requires you to keep a previous value of the prop (like userID) in state (like prevUserID).
Pitfall
Deriving state leads to verbose code and makes your components difficult to think about. Make sure you’re familiar with simpler alternatives:
If you need to perform a side effect (for example, data fetching or an animation) in response to a change in props, use componentDidUpdate method instead.
If you want to re-compute some data only when a prop changes, use a memoization helper instead.
If you want to “reset” some state when a prop changes, consider either making a component fully controlled or fully uncontrolled with a key instead.
Parameters 
props: The next props that the component is about to render with.
state: The next state that the component is about to render with.
Returns 
static getDerivedStateFromProps return an object to update the state, or null to update nothing.
Caveats 
This method is fired on every render, regardless of the cause. This is different from UNSAFE_componentWillReceiveProps, which only fires when the parent causes a re-render and not as a result of a local setState.
This method doesn’t have access to the component instance. If you’d like, you can reuse some code between static getDerivedStateFromProps and the other class methods by extracting pure functions of the component props and state outside the class definition.
Note
Implementing static getDerivedStateFromProps in a class component is equivalent to calling the set function from useState during rendering in a function component.

Usage 
Defining a class component 
To define a React component as a class, extend the built-in Component class and define a render method:
import { Component } from 'react';

class Greeting extends Component {
 render() {
   return <h1>Hello, {this.props.name}!</h1>;
 }
}
React will call your render method whenever it needs to figure out what to display on the screen. Usually, you will return some JSX from it. Your render method should be a pure function: it should only calculate the JSX.
Similarly to function components, a class component can receive information by props from its parent component. However, the syntax for reading props is different. For example, if the parent component renders <Greeting name="Taylor" />, then you can read the name prop from this.props, like this.props.name:
App.js
DownloadReset
Fork
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}


Show more
Note that Hooks (functions starting with use, like useState) are not supported inside class components.
Pitfall
We recommend defining components as functions instead of classes. See how to migrate.

Adding state to a class component 
To add state to a class, assign an object to a property called state. To update state, call this.setState.
App.js
DownloadReset
Fork
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}


Show more
Pitfall
We recommend defining components as functions instead of classes. See how to migrate.

Adding lifecycle methods to a class component 
There are a few special methods you can define on your class.
If you define the componentDidMount method, React will call it when your component is added (mounted) to the screen. React will call componentDidUpdate after your component re-renders due to changed props or state. React will call componentWillUnmount after your component has been removed (unmounted) from the screen.
If you implement componentDidMount, you usually need to implement all three lifecycles to avoid bugs. For example, if componentDidMount reads some state or props, you also have to implement componentDidUpdate to handle their changes, and componentWillUnmount to clean up whatever componentDidMount was doing.
For example, this ChatRoom component keeps a chat connection synchronized with props and state:
App.jsChatRoom.jschat.js
Reset
Fork
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}


Show more
Note that in development when Strict Mode is on, React will call componentDidMount, immediately call componentWillUnmount, and then call componentDidMount again. This helps you notice if you forgot to implement componentWillUnmount or if its logic doesn’t fully “mirror” what componentDidMount does.
Pitfall
We recommend defining components as functions instead of classes. See how to migrate.

Catching rendering errors with an error boundary 
By default, if your application throws an error during rendering, React will remove its UI from the screen. To prevent this, you can wrap a part of your UI into an error boundary. An error boundary is a special component that lets you display some fallback UI instead of the part that crashed—for example, an error message.
To implement an error boundary component, you need to provide static getDerivedStateFromError which lets you update state in response to an error and display an error message to the user. You can also optionally implement componentDidCatch to add some extra logic, for example, to log the error to an analytics service.
With captureOwnerStack you can include the Owner Stack during development.
import * as React from 'react';

class ErrorBoundary extends React.Component {
 constructor(props) {
   super(props);
   this.state = { hasError: false };
 }

 static getDerivedStateFromError(error) {
   // Update state so the next render will show the fallback UI.
   return { hasError: true };
 }

 componentDidCatch(error, info) {
   logErrorToMyService(
     error,
     // Example "componentStack":
     //   in ComponentThatThrows (created by App)
     //   in ErrorBoundary (created by App)
     //   in div (created by App)
     //   in App
     info.componentStack,
     // Warning: `captureOwnerStack` is not available in production.
     React.captureOwnerStack(),
   );
 }

 render() {
   if (this.state.hasError) {
     // You can render any custom fallback UI
     return this.props.fallback;
   }

   return this.props.children;
 }
}
Then you can wrap a part of your component tree with it:
<ErrorBoundary fallback={<p>Something went wrong</p>}>
 <Profile />
</ErrorBoundary>
If Profile or its child component throws an error, ErrorBoundary will “catch” that error, display a fallback UI with the error message you’ve provided, and send a production error report to your error reporting service.
You don’t need to wrap every component into a separate error boundary. When you think about the granularity of error boundaries, consider where it makes sense to display an error message. For example, in a messaging app, it makes sense to place an error boundary around the list of conversations. It also makes sense to place one around every individual message. However, it wouldn’t make sense to place a boundary around every avatar.
Note
There is currently no way to write an error boundary as a function component. However, you don’t have to write the error boundary class yourself. For example, you can use react-error-boundary instead.

Alternatives 
Migrating a simple component from a class to a function 
Typically, you will define components as functions instead.
For example, suppose you’re converting this Greeting class component to a function:
App.js
DownloadReset
Fork
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}


Show more
Define a function called Greeting. This is where you will move the body of your render function.
function Greeting() {
 // ... move the code from the render method here ...
}
Instead of this.props.name, define the name prop using the destructuring syntax and read it directly:
function Greeting({ name }) {
 return <h1>Hello, {name}!</h1>;
}
Here is a complete example:
App.js
DownloadReset
Fork
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}



Migrating a component with state from a class to a function 
Suppose you’re converting this Counter class component to a function:
App.js
DownloadReset
Fork
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}


Show more
Start by declaring a function with the necessary state variables:
import { useState } from 'react';

function Counter() {
 const [name, setName] = useState('Taylor');
 const [age, setAge] = useState(42);
 // ...
Next, convert the event handlers:
function Counter() {
 const [name, setName] = useState('Taylor');
 const [age, setAge] = useState(42);

 function handleNameChange(e) {
   setName(e.target.value);
 }

 function handleAgeChange() {
   setAge(age + 1);
 }
 // ...
Finally, replace all references starting with this with the variables and functions you defined in your component. For example, replace this.state.age with age, and replace this.handleNameChange with handleNameChange.
Here is a fully converted component:
App.js
DownloadReset
Fork
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  )
}


Show more

Migrating a component with lifecycle methods from a class to a function 
Suppose you’re converting this ChatRoom class component with lifecycle methods to a function:
App.jsChatRoom.jschat.js
Reset
Fork
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}


Show more
First, verify that your componentWillUnmount does the opposite of componentDidMount. In the above example, that’s true: it disconnects the connection that componentDidMount sets up. If such logic is missing, add it first.
Next, verify that your componentDidUpdate method handles changes to any props and state you’re using in componentDidMount. In the above example, componentDidMount calls setupConnection which reads this.state.serverUrl and this.props.roomId. This is why componentDidUpdate checks whether this.state.serverUrl and this.props.roomId have changed, and resets the connection if they did. If your componentDidUpdate logic is missing or doesn’t handle changes to all relevant props and state, fix that first.
In the above example, the logic inside the lifecycle methods connects the component to a system outside of React (a chat server). To connect a component to an external system, describe this logic as a single Effect:
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
 const [serverUrl, setServerUrl] = useState('https://localhost:1234');

 useEffect(() => {
   const connection = createConnection(serverUrl, roomId);
   connection.connect();
   return () => {
     connection.disconnect();
   };
 }, [serverUrl, roomId]);

 // ...
}
This useEffect call is equivalent to the logic in the lifecycle methods above. If your lifecycle methods do multiple unrelated things, split them into multiple independent Effects. Here is a complete example you can play with:
App.jsChatRoom.jschat.js
Reset
Fork
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}


Show more
Note
If your component does not synchronize with any external systems, you might not need an Effect.

Migrating a component with context from a class to a function 
In this example, the Panel and Button class components read context from this.context:
App.js
DownloadReset
Fork
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );    
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}


Show more
When you convert them to function components, replace this.context with useContext calls:
App.js
DownloadReset
Fork
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}


Show more
PreviouscloneElement
NextcreateElement

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
Component
context
props
state
constructor(props)
componentDidCatch(error, info)
componentDidMount()
componentDidUpdate(prevProps, prevState, snapshot?)
componentWillMount()
componentWillReceiveProps(nextProps)
componentWillUpdate(nextProps, nextState)
componentWillUnmount()
forceUpdate(callback?)
getSnapshotBeforeUpdate(prevProps, prevState)
render()
setState(nextState, callback?)
shouldComponentUpdate(nextProps, nextState, nextContext)
UNSAFE_componentWillMount()
UNSAFE_componentWillReceiveProps(nextProps, nextContext)
UNSAFE_componentWillUpdate(nextProps, nextState)
static contextType
static defaultProps
static getDerivedStateFromError(error)
static getDerivedStateFromProps(props, state)
Usage
Defining a class component
Adding state to a class component
Adding lifecycle methods to a class component
Catching rendering errors with an error boundary
Alternatives
Migrating a simple component from a class to a function
Migrating a component with state from a class to a function
Migrating a component with lifecycle methods from a class to a function
Migrating a component with context from a class to a function
Component – React
Component
Pitfall
We recommend defining components as functions instead of classes. See how to migrate.
Component is the base class for the React components defined as JavaScript classes. Class components are still supported by React, but we don’t recommend using them in new code.
class Greeting extends Component {
 render() {
   return <h1>Hello, {this.props.name}!</h1>;
 }
}
Reference
Component
context
props
state
constructor(props)
componentDidCatch(error, info)
componentDidMount()
componentDidUpdate(prevProps, prevState, snapshot?)
componentWillMount()
componentWillReceiveProps(nextProps)
componentWillUpdate(nextProps, nextState)
componentWillUnmount()
forceUpdate(callback?)
getSnapshotBeforeUpdate(prevProps, prevState)
render()
setState(nextState, callback?)
shouldComponentUpdate(nextProps, nextState, nextContext)
UNSAFE_componentWillMount()
UNSAFE_componentWillReceiveProps(nextProps, nextContext)
UNSAFE_componentWillUpdate(nextProps, nextState)
static contextType
static defaultProps
static getDerivedStateFromError(error)
static getDerivedStateFromProps(props, state)
Usage
Defining a class component
Adding state to a class component
Adding lifecycle methods to a class component
Catching rendering errors with an error boundary
Alternatives
Migrating a simple component from a class to a function
Migrating a component with state from a class to a function
Migrating a component with lifecycle methods from a class to a function
Migrating a component with context from a class to a function

Reference 
Component 
To define a React component as a class, extend the built-in Component class and define a render method:
import { Component } from 'react';

class Greeting extends Component {
 render() {
   return <h1>Hello, {this.props.name}!</h1>;
 }
}
Only the render method is required, other methods are optional.
See more examples below.

context 
The context of a class component is available as this.context. It is only available if you specify which context you want to receive using static contextType.
A class component can only read one context at a time.
class Button extends Component {
 static contextType = ThemeContext;

 render() {
   const theme = this.context;
   const className = 'button-' + theme;
   return (
     <button className={className}>
       {this.props.children}
     </button>
   );
 }
}
Note
Reading this.context in class components is equivalent to useContext in function components.
See how to migrate.

props 
The props passed to a class component are available as this.props.
class Greeting extends Component {
 render() {
   return <h1>Hello, {this.props.name}!</h1>;
 }
}

<Greeting name="Taylor" />
Note
Reading this.props in class components is equivalent to declaring props in function components.
See how to migrate.

state 
The state of a class component is available as this.state. The state field must be an object. Do not mutate the state directly. If you wish to change the state, call setState with the new state.
class Counter extends Component {
 state = {
   age: 42,
 };

 handleAgeChange = () => {
   this.setState({
     age: this.state.age + 1
   });
 };

 render() {
   return (
     <>
       <button onClick={this.handleAgeChange}>
       Increment age
       </button>
       <p>You are {this.state.age}.</p>
     </>
   );
 }
}
Note
Defining state in class components is equivalent to calling useState in function components.
See how to migrate.

constructor(props) 
The constructor runs before your class component mounts (gets added to the screen). Typically, a constructor is only used for two purposes in React. It lets you declare state and bind your class methods to the class instance:
class Counter extends Component {
 constructor(props) {
   super(props);
   this.state = { counter: 0 };
   this.handleClick = this.handleClick.bind(this);
 }

 handleClick() {
   // ...
 }
If you use modern JavaScript syntax, constructors are rarely needed. Instead, you can rewrite this code above using the public class field syntax which is supported both by modern browsers and tools like Babel:
class Counter extends Component {
 state = { counter: 0 };

 handleClick = () => {
   // ...
 }
A constructor should not contain any side effects or subscriptions.
Parameters 
props: The component’s initial props.
Returns 
constructor should not return anything.
Caveats 
Do not run any side effects or subscriptions in the constructor. Instead, use componentDidMount for that.
Inside a constructor, you need to call super(props) before any other statement. If you don’t do that, this.props will be undefined while the constructor runs, which can be confusing and cause bugs.
Constructor is the only place where you can assign this.state directly. In all other methods, you need to use this.setState() instead. Do not call setState in the constructor.
When you use server rendering, the constructor will run on the server too, followed by the render method. However, lifecycle methods like componentDidMount or componentWillUnmount will not run on the server.
When Strict Mode is on, React will call constructor twice in development and then throw away one of the instances. This helps you notice the accidental side effects that need to be moved out of the constructor.
Note
There is no exact equivalent for constructor in function components. To declare state in a function component, call useState. To avoid recalculating the initial state, pass a function to useState.

componentDidCatch(error, info) 
If you define componentDidCatch, React will call it when some child component (including distant children) throws an error during rendering. This lets you log that error to an error reporting service in production.
Typically, it is used together with static getDerivedStateFromError which lets you update state in response to an error and display an error message to the user. A component with these methods is called an error boundary.
See an example.
Parameters 
error: The error that was thrown. In practice, it will usually be an instance of Error but this is not guaranteed because JavaScript allows to throw any value, including strings or even null.
info: An object containing additional information about the error. Its componentStack field contains a stack trace with the component that threw, as well as the names and source locations of all its parent components. In production, the component names will be minified. If you set up production error reporting, you can decode the component stack using sourcemaps the same way as you would do for regular JavaScript error stacks.
Returns 
componentDidCatch should not return anything.
Caveats 
In the past, it was common to call setState inside componentDidCatch in order to update the UI and display the fallback error message. This is deprecated in favor of defining static getDerivedStateFromError.
Production and development builds of React slightly differ in the way componentDidCatch handles errors. In development, the errors will bubble up to window, which means that any window.onerror or window.addEventListener('error', callback) will intercept the errors that have been caught by componentDidCatch. In production, instead, the errors will not bubble up, which means any ancestor error handler will only receive errors not explicitly caught by componentDidCatch.
Note
There is no direct equivalent for componentDidCatch in function components yet. If you’d like to avoid creating class components, write a single ErrorBoundary component like above and use it throughout your app. Alternatively, you can use the react-error-boundary package which does that for you.

componentDidMount() 
If you define the componentDidMount method, React will call it when your component is added (mounted) to the screen. This is a common place to start data fetching, set up subscriptions, or manipulate the DOM nodes.
If you implement componentDidMount, you usually need to implement other lifecycle methods to avoid bugs. For example, if componentDidMount reads some state or props, you also have to implement componentDidUpdate to handle their changes, and componentWillUnmount to clean up whatever componentDidMount was doing.
class ChatRoom extends Component {
 state = {
   serverUrl: 'https://localhost:1234'
 };

 componentDidMount() {
   this.setupConnection();
 }

 componentDidUpdate(prevProps, prevState) {
   if (
     this.props.roomId !== prevProps.roomId ||
     this.state.serverUrl !== prevState.serverUrl
   ) {
     this.destroyConnection();
     this.setupConnection();
   }
 }

 componentWillUnmount() {
   this.destroyConnection();
 }

 // ...
}
See more examples.
Parameters 
componentDidMount does not take any parameters.
Returns 
componentDidMount should not return anything.
Caveats 
When Strict Mode is on, in development React will call componentDidMount, then immediately call componentWillUnmount, and then call componentDidMount again. This helps you notice if you forgot to implement componentWillUnmount or if its logic doesn’t fully “mirror” what componentDidMount does.
Although you may call setState immediately in componentDidMount, it’s best to avoid that when you can. It will trigger an extra rendering, but it will happen before the browser updates the screen. This guarantees that even though the render will be called twice in this case, the user won’t see the intermediate state. Use this pattern with caution because it often causes performance issues. In most cases, you should be able to assign the initial state in the constructor instead. It can, however, be necessary for cases like modals and tooltips when you need to measure a DOM node before rendering something that depends on its size or position.
Note
For many use cases, defining componentDidMount, componentDidUpdate, and componentWillUnmount together in class components is equivalent to calling useEffect in function components. In the rare cases where it’s important for the code to run before browser paint, useLayoutEffect is a closer match.
See how to migrate.

componentDidUpdate(prevProps, prevState, snapshot?) 
If you define the componentDidUpdate method, React will call it immediately after your component has been re-rendered with updated props or state.  This method is not called for the initial render.
You can use it to manipulate the DOM after an update. This is also a common place to do network requests as long as you compare the current props to previous props (e.g. a network request may not be necessary if the props have not changed). Typically, you’d use it together with componentDidMount and componentWillUnmount:
class ChatRoom extends Component {
 state = {
   serverUrl: 'https://localhost:1234'
 };

 componentDidMount() {
   this.setupConnection();
 }

 componentDidUpdate(prevProps, prevState) {
   if (
     this.props.roomId !== prevProps.roomId ||
     this.state.serverUrl !== prevState.serverUrl
   ) {
     this.destroyConnection();
     this.setupConnection();
   }
 }

 componentWillUnmount() {
   this.destroyConnection();
 }

 // ...
}
See more examples.
Parameters 
prevProps: Props before the update. Compare prevProps to this.props to determine what changed.
prevState: State before the update. Compare prevState to this.state to determine what changed.
snapshot: If you implemented getSnapshotBeforeUpdate, snapshot will contain the value you returned from that method. Otherwise, it will be undefined.
Returns 
componentDidUpdate should not return anything.
Caveats 
componentDidUpdate will not get called if shouldComponentUpdate is defined and returns false.
The logic inside componentDidUpdate should usually be wrapped in conditions comparing this.props with prevProps, and this.state with prevState. Otherwise, there’s a risk of creating infinite loops.
Although you may call setState immediately in componentDidUpdate, it’s best to avoid that when you can. It will trigger an extra rendering, but it will happen before the browser updates the screen. This guarantees that even though the render will be called twice in this case, the user won’t see the intermediate state. This pattern often causes performance issues, but it may be necessary for rare cases like modals and tooltips when you need to measure a DOM node before rendering something that depends on its size or position.
Note
For many use cases, defining componentDidMount, componentDidUpdate, and componentWillUnmount together in class components is equivalent to calling useEffect in function components. In the rare cases where it’s important for the code to run before browser paint, useLayoutEffect is a closer match.
See how to migrate.

componentWillMount() 
Deprecated
This API has been renamed from componentWillMount to UNSAFE_componentWillMount. The old name has been deprecated. In a future major version of React, only the new name will work.
Run the rename-unsafe-lifecycles codemod to automatically update your components.

componentWillReceiveProps(nextProps) 
Deprecated
This API has been renamed from componentWillReceiveProps to UNSAFE_componentWillReceiveProps. The old name has been deprecated. In a future major version of React, only the new name will work.
Run the rename-unsafe-lifecycles codemod to automatically update your components.

componentWillUpdate(nextProps, nextState) 
Deprecated
This API has been renamed from componentWillUpdate to UNSAFE_componentWillUpdate. The old name has been deprecated. In a future major version of React, only the new name will work.
Run the rename-unsafe-lifecycles codemod to automatically update your components.

componentWillUnmount() 
If you define the componentWillUnmount method, React will call it before your component is removed (unmounted) from the screen. This is a common place to cancel data fetching or remove subscriptions.
The logic inside componentWillUnmount should “mirror” the logic inside componentDidMount. For example, if componentDidMount sets up a subscription, componentWillUnmount should clean up that subscription. If the cleanup logic in your componentWillUnmount reads some props or state, you will usually also need to implement componentDidUpdate to clean up resources (such as subscriptions) corresponding to the old props and state.
class ChatRoom extends Component {
 state = {
   serverUrl: 'https://localhost:1234'
 };

 componentDidMount() {
   this.setupConnection();
 }

 componentDidUpdate(prevProps, prevState) {
   if (
     this.props.roomId !== prevProps.roomId ||
     this.state.serverUrl !== prevState.serverUrl
   ) {
     this.destroyConnection();
     this.setupConnection();
   }
 }

 componentWillUnmount() {
   this.destroyConnection();
 }

 // ...
}
See more examples.
Parameters 
componentWillUnmount does not take any parameters.
Returns 
componentWillUnmount should not return anything.
Caveats 
When Strict Mode is on, in development React will call componentDidMount, then immediately call componentWillUnmount, and then call componentDidMount again. This helps you notice if you forgot to implement componentWillUnmount or if its logic doesn’t fully “mirror” what componentDidMount does.
Note
For many use cases, defining componentDidMount, componentDidUpdate, and componentWillUnmount together in class components is equivalent to calling useEffect in function components. In the rare cases where it’s important for the code to run before browser paint, useLayoutEffect is a closer match.
See how to migrate.

forceUpdate(callback?) 
Forces a component to re-render.
Usually, this is not necessary. If your component’s render method only reads from this.props, this.state, or this.context, it will re-render automatically when you call setState inside your component or one of its parents. However, if your component’s render method reads directly from an external data source, you have to tell React to update the user interface when that data source changes. That’s what forceUpdate lets you do.
Try to avoid all uses of forceUpdate and only read from this.props and this.state in render.
Parameters 
optional callback If specified, React will call the callback you’ve provided after the update is committed.
Returns 
forceUpdate does not return anything.
Caveats 
If you call forceUpdate, React will re-render without calling shouldComponentUpdate.
Note
Reading an external data source and forcing class components to re-render in response to its changes with forceUpdate has been superseded by useSyncExternalStore in function components.

getSnapshotBeforeUpdate(prevProps, prevState) 
If you implement getSnapshotBeforeUpdate, React will call it immediately before React updates the DOM. It enables your component to capture some information from the DOM (e.g. scroll position) before it is potentially changed. Any value returned by this lifecycle method will be passed as a parameter to componentDidUpdate.
For example, you can use it in a UI like a chat thread that needs to preserve its scroll position during updates:
class ScrollingList extends React.Component {
 constructor(props) {
   super(props);
   this.listRef = React.createRef();
 }

 getSnapshotBeforeUpdate(prevProps, prevState) {
   // Are we adding new items to the list?
   // Capture the scroll position so we can adjust scroll later.
   if (prevProps.list.length < this.props.list.length) {
     const list = this.listRef.current;
     return list.scrollHeight - list.scrollTop;
   }
   return null;
 }

 componentDidUpdate(prevProps, prevState, snapshot) {
   // If we have a snapshot value, we've just added new items.
   // Adjust scroll so these new items don't push the old ones out of view.
   // (snapshot here is the value returned from getSnapshotBeforeUpdate)
   if (snapshot !== null) {
     const list = this.listRef.current;
     list.scrollTop = list.scrollHeight - snapshot;
   }
 }

 render() {
   return (
     <div ref={this.listRef}>{/* ...contents... */}</div>
   );
 }
}
In the above example, it is important to read the scrollHeight property directly in getSnapshotBeforeUpdate. It is not safe to read it in render, UNSAFE_componentWillReceiveProps, or UNSAFE_componentWillUpdate because there is a potential time gap between these methods getting called and React updating the DOM.
Parameters 
prevProps: Props before the update. Compare prevProps to this.props to determine what changed.
prevState: State before the update. Compare prevState to this.state to determine what changed.
Returns 
You should return a snapshot value of any type that you’d like, or null. The value you returned will be passed as the third argument to componentDidUpdate.
Caveats 
getSnapshotBeforeUpdate will not get called if shouldComponentUpdate is defined and returns false.
Note
At the moment, there is no equivalent to getSnapshotBeforeUpdate for function components. This use case is very uncommon, but if you have the need for it, for now you’ll have to write a class component.

render() 
The render method is the only required method in a class component.
The render method should specify what you want to appear on the screen, for example:
import { Component } from 'react';

class Greeting extends Component {
 render() {
   return <h1>Hello, {this.props.name}!</h1>;
 }
}
React may call render at any moment, so you shouldn’t assume that it runs at a particular time. Usually, the render method should return a piece of JSX, but a few other return types (like strings) are supported. To calculate the returned JSX, the render method can read this.props, this.state, and this.context.
You should write the render method as a pure function, meaning that it should return the same result if props, state, and context are the same. It also shouldn’t contain side effects (like setting up subscriptions) or interact with the browser APIs. Side effects should happen either in event handlers or methods like componentDidMount.
Parameters 
render does not take any parameters.
Returns 
render can return any valid React node. This includes React elements such as <div />, strings, numbers, portals, empty nodes (null, undefined, true, and false), and arrays of React nodes.
Caveats 
render should be written as a pure function of props, state, and context. It should not have side effects.
render will not get called if shouldComponentUpdate is defined and returns false.
When Strict Mode is on, React will call render twice in development and then throw away one of the results. This helps you notice the accidental side effects that need to be moved out of the render method.
There is no one-to-one correspondence between the render call and the subsequent componentDidMount or componentDidUpdate call. Some of the render call results may be discarded by React when it’s beneficial.

setState(nextState, callback?) 
Call setState to update the state of your React component.
class Form extends Component {
 state = {
   name: 'Taylor',
 };

 handleNameChange = (e) => {
   const newName = e.target.value;
   this.setState({
     name: newName
   });
 }

 render() {
   return (
     <>
       <input value={this.state.name} onChange={this.handleNameChange} />
       <p>Hello, {this.state.name}.</p>
     </>
   );
 }
}
setState enqueues changes to the component state. It tells React that this component and its children need to re-render with the new state. This is the main way you’ll update the user interface in response to interactions.
Pitfall
Calling setState does not change the current state in the already executing code:
function handleClick() {
 console.log(this.state.name); // "Taylor"
 this.setState({
   name: 'Robin'
 });
 console.log(this.state.name); // Still "Taylor"!
}
It only affects what this.state will return starting from the next render.
You can also pass a function to setState. It lets you update state based on the previous state:
 handleIncreaseAge = () => {
   this.setState(prevState => {
     return {
       age: prevState.age + 1
     };
   });
 }
You don’t have to do this, but it’s handy if you want to update state multiple times during the same event.
Parameters 
nextState: Either an object or a function.
If you pass an object as nextState, it will be shallowly merged into this.state.
If you pass a function as nextState, it will be treated as an updater function. It must be pure, should take the pending state and props as arguments, and should return the object to be shallowly merged into this.state. React will put your updater function in a queue and re-render your component. During the next render, React will calculate the next state by applying all of the queued updaters to the previous state.
optional callback: If specified, React will call the callback you’ve provided after the update is committed.
Returns 
setState does not return anything.
Caveats 
Think of setState as a request rather than an immediate command to update the component. When multiple components update their state in response to an event, React will batch their updates and re-render them together in a single pass at the end of the event. In the rare case that you need to force a particular state update to be applied synchronously, you may wrap it in flushSync, but this may hurt performance.
setState does not update this.state immediately. This makes reading this.state right after calling setState a potential pitfall. Instead, use componentDidUpdate or the setState callback argument, either of which are guaranteed to fire after the update has been applied. If you need to set the state based on the previous state, you can pass a function to nextState as described above.
Note
Calling setState in class components is similar to calling a set function in function components.
See how to migrate.

shouldComponentUpdate(nextProps, nextState, nextContext) 
If you define shouldComponentUpdate, React will call it to determine whether a re-render can be skipped.
If you are confident you want to write it by hand, you may compare this.props with nextProps and this.state with nextState and return false to tell React the update can be skipped.
class Rectangle extends Component {
 state = {
   isHovered: false
 };

 shouldComponentUpdate(nextProps, nextState) {
   if (
     nextProps.position.x === this.props.position.x &&
     nextProps.position.y === this.props.position.y &&
     nextProps.size.width === this.props.size.width &&
     nextProps.size.height === this.props.size.height &&
     nextState.isHovered === this.state.isHovered
   ) {
     // Nothing has changed, so a re-render is unnecessary
     return false;
   }
   return true;
 }

 // ...
}
React calls shouldComponentUpdate before rendering when new props or state are being received. Defaults to true. This method is not called for the initial render or when forceUpdate is used.
Parameters 
nextProps: The next props that the component is about to render with. Compare nextProps to this.props to determine what changed.
nextState: The next state that the component is about to render with. Compare nextState to this.state to determine what changed.
nextContext: The next context that the component is about to render with. Compare nextContext to this.context to determine what changed. Only available if you specify static contextType.
Returns 
Return true if you want the component to re-render. That’s the default behavior.
Return false to tell React that re-rendering can be skipped.
Caveats 
This method only exists as a performance optimization. If your component breaks without it, fix that first.
Consider using PureComponent instead of writing shouldComponentUpdate by hand. PureComponent shallowly compares props and state, and reduces the chance that you’ll skip a necessary update.
We do not recommend doing deep equality checks or using JSON.stringify in shouldComponentUpdate. It makes performance unpredictable and dependent on the data structure of every prop and state. In the best case, you risk introducing multi-second stalls to your application, and in the worst case you risk crashing it.
Returning false does not prevent child components from re-rendering when their state changes.
Returning false does not guarantee that the component will not re-render. React will use the return value as a hint but it may still choose to re-render your component if it makes sense to do for other reasons.
Note
Optimizing class components with shouldComponentUpdate is similar to optimizing function components with memo. Function components also offer more granular optimization with useMemo.

UNSAFE_componentWillMount() 
If you define UNSAFE_componentWillMount, React will call it immediately after the constructor. It only exists for historical reasons and should not be used in any new code. Instead, use one of the alternatives:
To initialize state, declare state as a class field or set this.state inside the constructor.
If you need to run a side effect or set up a subscription, move that logic to componentDidMount instead.
See examples of migrating away from unsafe lifecycles.
Parameters 
UNSAFE_componentWillMount does not take any parameters.
Returns 
UNSAFE_componentWillMount should not return anything.
Caveats 
UNSAFE_componentWillMount will not get called if the component implements static getDerivedStateFromProps or getSnapshotBeforeUpdate.
Despite its naming, UNSAFE_componentWillMount does not guarantee that the component will get mounted if your app uses modern React features like Suspense. If a render attempt is suspended (for example, because the code for some child component has not loaded yet), React will throw the in-progress tree away and attempt to construct the component from scratch during the next attempt. This is why this method is “unsafe”. Code that relies on mounting (like adding a subscription) should go into componentDidMount.
UNSAFE_componentWillMount is the only lifecycle method that runs during server rendering. For all practical purposes, it is identical to constructor, so you should use the constructor for this type of logic instead.
Note
Calling setState inside UNSAFE_componentWillMount in a class component to initialize state is equivalent to passing that state as the initial state to useState in a function component.

UNSAFE_componentWillReceiveProps(nextProps, nextContext) 
If you define UNSAFE_componentWillReceiveProps, React will call it when the component receives new props. It only exists for historical reasons and should not be used in any new code. Instead, use one of the alternatives:
If you need to run a side effect (for example, fetch data, run an animation, or reinitialize a subscription) in response to prop changes, move that logic to componentDidUpdate instead.
If you need to avoid re-computing some data only when a prop changes, use a memoization helper instead.
If you need to “reset” some state when a prop changes, consider either making a component fully controlled or fully uncontrolled with a key instead.
If you need to “adjust” some state when a prop changes, check whether you can compute all the necessary information from props alone during rendering. If you can’t, use static getDerivedStateFromProps instead.
See examples of migrating away from unsafe lifecycles.
Parameters 
nextProps: The next props that the component is about to receive from its parent component. Compare nextProps to this.props to determine what changed.
nextContext: The next context that the component is about to receive from the closest provider. Compare nextContext to this.context to determine what changed. Only available if you specify static contextType.
Returns 
UNSAFE_componentWillReceiveProps should not return anything.
Caveats 
UNSAFE_componentWillReceiveProps will not get called if the component implements static getDerivedStateFromProps or getSnapshotBeforeUpdate.
Despite its naming, UNSAFE_componentWillReceiveProps does not guarantee that the component will receive those props if your app uses modern React features like Suspense. If a render attempt is suspended (for example, because the code for some child component has not loaded yet), React will throw the in-progress tree away and attempt to construct the component from scratch during the next attempt. By the time of the next render attempt, the props might be different. This is why this method is “unsafe”. Code that should run only for committed updates (like resetting a subscription) should go into componentDidUpdate.
UNSAFE_componentWillReceiveProps does not mean that the component has received different props than the last time. You need to compare nextProps and this.props yourself to check if something changed.
React doesn’t call UNSAFE_componentWillReceiveProps with initial props during mounting. It only calls this method if some of component’s props are going to be updated. For example, calling setState doesn’t generally trigger UNSAFE_componentWillReceiveProps inside the same component.
Note
Calling setState inside UNSAFE_componentWillReceiveProps in a class component to “adjust” state is equivalent to calling the set function from useState during rendering in a function component.

UNSAFE_componentWillUpdate(nextProps, nextState) 
If you define UNSAFE_componentWillUpdate, React will call it before rendering with the new props or state. It only exists for historical reasons and should not be used in any new code. Instead, use one of the alternatives:
If you need to run a side effect (for example, fetch data, run an animation, or reinitialize a subscription) in response to prop or state changes, move that logic to componentDidUpdate instead.
If you need to read some information from the DOM (for example, to save the current scroll position) so that you can use it in componentDidUpdate later, read it inside getSnapshotBeforeUpdate instead.
See examples of migrating away from unsafe lifecycles.
Parameters 
nextProps: The next props that the component is about to render with. Compare nextProps to this.props to determine what changed.
nextState: The next state that the component is about to render with. Compare nextState to this.state to determine what changed.
Returns 
UNSAFE_componentWillUpdate should not return anything.
Caveats 
UNSAFE_componentWillUpdate will not get called if shouldComponentUpdate is defined and returns false.
UNSAFE_componentWillUpdate will not get called if the component implements static getDerivedStateFromProps or getSnapshotBeforeUpdate.
It’s not supported to call setState (or any method that leads to setState being called, like dispatching a Redux action) during componentWillUpdate.
Despite its naming, UNSAFE_componentWillUpdate does not guarantee that the component will update if your app uses modern React features like Suspense. If a render attempt is suspended (for example, because the code for some child component has not loaded yet), React will throw the in-progress tree away and attempt to construct the component from scratch during the next attempt. By the time of the next render attempt, the props and state might be different. This is why this method is “unsafe”. Code that should run only for committed updates (like resetting a subscription) should go into componentDidUpdate.
UNSAFE_componentWillUpdate does not mean that the component has received different props or state than the last time. You need to compare nextProps with this.props and nextState with this.state yourself to check if something changed.
React doesn’t call UNSAFE_componentWillUpdate with initial props and state during mounting.
Note
There is no direct equivalent to UNSAFE_componentWillUpdate in function components.

static contextType 
If you want to read this.context from your class component, you must specify which context it needs to read. The context you specify as the static contextType must be a value previously created by createContext.
class Button extends Component {
 static contextType = ThemeContext;

 render() {
   const theme = this.context;
   const className = 'button-' + theme;
   return (
     <button className={className}>
       {this.props.children}
     </button>
   );
 }
}
Note
Reading this.context in class components is equivalent to useContext in function components.
See how to migrate.

static defaultProps 
You can define static defaultProps to set the default props for the class. They will be used for undefined and missing props, but not for null props.
For example, here is how you define that the color prop should default to 'blue':
class Button extends Component {
 static defaultProps = {
   color: 'blue'
 };

 render() {
   return <button className={this.props.color}>click me</button>;
 }
}
If the color prop is not provided or is undefined, it will be set by default to 'blue':
<>
 {/* this.props.color is "blue" */}
 <Button />

 {/* this.props.color is "blue" */}
 <Button color={undefined} />

 {/* this.props.color is null */}
 <Button color={null} />

 {/* this.props.color is "red" */}
 <Button color="red" />
</>
Note
Defining defaultProps in class components is similar to using default values in function components.

static getDerivedStateFromError(error) 
If you define static getDerivedStateFromError, React will call it when a child component (including distant children) throws an error during rendering. This lets you display an error message instead of clearing the UI.
Typically, it is used together with componentDidCatch which lets you send the error report to some analytics service. A component with these methods is called an error boundary.
See an example.
Parameters 
error: The error that was thrown. In practice, it will usually be an instance of Error but this is not guaranteed because JavaScript allows to throw any value, including strings or even null.
Returns 
static getDerivedStateFromError should return the state telling the component to display the error message.
Caveats 
static getDerivedStateFromError should be a pure function. If you want to perform a side effect (for example, to call an analytics service), you need to also implement componentDidCatch.
Note
There is no direct equivalent for static getDerivedStateFromError in function components yet. If you’d like to avoid creating class components, write a single ErrorBoundary component like above and use it throughout your app. Alternatively, use the react-error-boundary package which does that.

static getDerivedStateFromProps(props, state) 
If you define static getDerivedStateFromProps, React will call it right before calling render, both on the initial mount and on subsequent updates. It should return an object to update the state, or null to update nothing.
This method exists for rare use cases where the state depends on changes in props over time. For example, this Form component resets the email state when the userID prop changes:
class Form extends Component {
 state = {
   email: this.props.defaultEmail,
   prevUserID: this.props.userID
 };

 static getDerivedStateFromProps(props, state) {
   // Any time the current user changes,
   // Reset any parts of state that are tied to that user.
   // In this simple example, that's just the email.
   if (props.userID !== state.prevUserID) {
     return {
       prevUserID: props.userID,
       email: props.defaultEmail
     };
   }
   return null;
 }

 // ...
}
Note that this pattern requires you to keep a previous value of the prop (like userID) in state (like prevUserID).
Pitfall
Deriving state leads to verbose code and makes your components difficult to think about. Make sure you’re familiar with simpler alternatives:
If you need to perform a side effect (for example, data fetching or an animation) in response to a change in props, use componentDidUpdate method instead.
If you want to re-compute some data only when a prop changes, use a memoization helper instead.
If you want to “reset” some state when a prop changes, consider either making a component fully controlled or fully uncontrolled with a key instead.
Parameters 
props: The next props that the component is about to render with.
state: The next state that the component is about to render with.
Returns 
static getDerivedStateFromProps return an object to update the state, or null to update nothing.
Caveats 
This method is fired on every render, regardless of the cause. This is different from UNSAFE_componentWillReceiveProps, which only fires when the parent causes a re-render and not as a result of a local setState.
This method doesn’t have access to the component instance. If you’d like, you can reuse some code between static getDerivedStateFromProps and the other class methods by extracting pure functions of the component props and state outside the class definition.
Note
Implementing static getDerivedStateFromProps in a class component is equivalent to calling the set function from useState during rendering in a function component.

Usage 
Defining a class component 
To define a React component as a class, extend the built-in Component class and define a render method:
import { Component } from 'react';

class Greeting extends Component {
 render() {
   return <h1>Hello, {this.props.name}!</h1>;
 }
}
React will call your render method whenever it needs to figure out what to display on the screen. Usually, you will return some JSX from it. Your render method should be a pure function: it should only calculate the JSX.
Similarly to function components, a class component can receive information by props from its parent component. However, the syntax for reading props is different. For example, if the parent component renders <Greeting name="Taylor" />, then you can read the name prop from this.props, like this.props.name:
App.js
DownloadReset
Fork
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}


Show more
Note that Hooks (functions starting with use, like useState) are not supported inside class components.
Pitfall
We recommend defining components as functions instead of classes. See how to migrate.

Adding state to a class component 
To add state to a class, assign an object to a property called state. To update state, call this.setState.
App.js
DownloadReset
Fork
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}


Show more
Pitfall
We recommend defining components as functions instead of classes. See how to migrate.

Adding lifecycle methods to a class component 
There are a few special methods you can define on your class.
If you define the componentDidMount method, React will call it when your component is added (mounted) to the screen. React will call componentDidUpdate after your component re-renders due to changed props or state. React will call componentWillUnmount after your component has been removed (unmounted) from the screen.
If you implement componentDidMount, you usually need to implement all three lifecycles to avoid bugs. For example, if componentDidMount reads some state or props, you also have to implement componentDidUpdate to handle their changes, and componentWillUnmount to clean up whatever componentDidMount was doing.
For example, this ChatRoom component keeps a chat connection synchronized with props and state:
App.jsChatRoom.jschat.js
Reset
Fork
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}


Show more
Note that in development when Strict Mode is on, React will call componentDidMount, immediately call componentWillUnmount, and then call componentDidMount again. This helps you notice if you forgot to implement componentWillUnmount or if its logic doesn’t fully “mirror” what componentDidMount does.
Pitfall
We recommend defining components as functions instead of classes. See how to migrate.

Catching rendering errors with an error boundary 
By default, if your application throws an error during rendering, React will remove its UI from the screen. To prevent this, you can wrap a part of your UI into an error boundary. An error boundary is a special component that lets you display some fallback UI instead of the part that crashed—for example, an error message.
To implement an error boundary component, you need to provide static getDerivedStateFromError which lets you update state in response to an error and display an error message to the user. You can also optionally implement componentDidCatch to add some extra logic, for example, to log the error to an analytics service.
With captureOwnerStack you can include the Owner Stack during development.
import * as React from 'react';

class ErrorBoundary extends React.Component {
 constructor(props) {
   super(props);
   this.state = { hasError: false };
 }

 static getDerivedStateFromError(error) {
   // Update state so the next render will show the fallback UI.
   return { hasError: true };
 }

 componentDidCatch(error, info) {
   logErrorToMyService(
     error,
     // Example "componentStack":
     //   in ComponentThatThrows (created by App)
     //   in ErrorBoundary (created by App)
     //   in div (created by App)
     //   in App
     info.componentStack,
     // Warning: `captureOwnerStack` is not available in production.
     React.captureOwnerStack(),
   );
 }

 render() {
   if (this.state.hasError) {
     // You can render any custom fallback UI
     return this.props.fallback;
   }

   return this.props.children;
 }
}
Then you can wrap a part of your component tree with it:
<ErrorBoundary fallback={<p>Something went wrong</p>}>
 <Profile />
</ErrorBoundary>
If Profile or its child component throws an error, ErrorBoundary will “catch” that error, display a fallback UI with the error message you’ve provided, and send a production error report to your error reporting service.
You don’t need to wrap every component into a separate error boundary. When you think about the granularity of error boundaries, consider where it makes sense to display an error message. For example, in a messaging app, it makes sense to place an error boundary around the list of conversations. It also makes sense to place one around every individual message. However, it wouldn’t make sense to place a boundary around every avatar.
Note
There is currently no way to write an error boundary as a function component. However, you don’t have to write the error boundary class yourself. For example, you can use react-error-boundary instead.

Alternatives 
Migrating a simple component from a class to a function 
Typically, you will define components as functions instead.
For example, suppose you’re converting this Greeting class component to a function:
App.js
DownloadReset
Fork
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}


Show more
Define a function called Greeting. This is where you will move the body of your render function.
function Greeting() {
 // ... move the code from the render method here ...
}
Instead of this.props.name, define the name prop using the destructuring syntax and read it directly:
function Greeting({ name }) {
 return <h1>Hello, {name}!</h1>;
}
Here is a complete example:
App.js
DownloadReset
Fork
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}



Migrating a component with state from a class to a function 
Suppose you’re converting this Counter class component to a function:
App.js
DownloadReset
Fork
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}


Show more
Start by declaring a function with the necessary state variables:
import { useState } from 'react';

function Counter() {
 const [name, setName] = useState('Taylor');
 const [age, setAge] = useState(42);
 // ...
Next, convert the event handlers:
function Counter() {
 const [name, setName] = useState('Taylor');
 const [age, setAge] = useState(42);

 function handleNameChange(e) {
   setName(e.target.value);
 }

 function handleAgeChange() {
   setAge(age + 1);
 }
 // ...
Finally, replace all references starting with this with the variables and functions you defined in your component. For example, replace this.state.age with age, and replace this.handleNameChange with handleNameChange.
Here is a fully converted component:
App.js
DownloadReset
Fork
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  )
}


Show more

Migrating a component with lifecycle methods from a class to a function 
Suppose you’re converting this ChatRoom class component with lifecycle methods to a function:
App.jsChatRoom.jschat.js
Reset
Fork
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}


Show more
First, verify that your componentWillUnmount does the opposite of componentDidMount. In the above example, that’s true: it disconnects the connection that componentDidMount sets up. If such logic is missing, add it first.
Next, verify that your componentDidUpdate method handles changes to any props and state you’re using in componentDidMount. In the above example, componentDidMount calls setupConnection which reads this.state.serverUrl and this.props.roomId. This is why componentDidUpdate checks whether this.state.serverUrl and this.props.roomId have changed, and resets the connection if they did. If your componentDidUpdate logic is missing or doesn’t handle changes to all relevant props and state, fix that first.
In the above example, the logic inside the lifecycle methods connects the component to a system outside of React (a chat server). To connect a component to an external system, describe this logic as a single Effect:
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
 const [serverUrl, setServerUrl] = useState('https://localhost:1234');

 useEffect(() => {
   const connection = createConnection(serverUrl, roomId);
   connection.connect();
   return () => {
     connection.disconnect();
   };
 }, [serverUrl, roomId]);

 // ...
}
This useEffect call is equivalent to the logic in the lifecycle methods above. If your lifecycle methods do multiple unrelated things, split them into multiple independent Effects. Here is a complete example you can play with:
App.jsChatRoom.jschat.js
Reset
Fork
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}


Show more
Note
If your component does not synchronize with any external systems, you might not need an Effect.

Migrating a component with context from a class to a function 
In this example, the Panel and Button class components read context from this.context:
App.js
DownloadReset
Fork
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );    
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}


Show more
When you convert them to function components, replace this.context with useContext calls:
App.js
DownloadReset
Fork
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}


Show more
PreviouscloneElement
NextcreateElement

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
Component
context
props
state
constructor(props)
componentDidCatch(error, info)
componentDidMount()
componentDidUpdate(prevProps, prevState, snapshot?)
componentWillMount()
componentWillReceiveProps(nextProps)
componentWillUpdate(nextProps, nextState)
componentWillUnmount()
forceUpdate(callback?)
getSnapshotBeforeUpdate(prevProps, prevState)
render()
setState(nextState, callback?)
shouldComponentUpdate(nextProps, nextState, nextContext)
UNSAFE_componentWillMount()
UNSAFE_componentWillReceiveProps(nextProps, nextContext)
UNSAFE_componentWillUpdate(nextProps, nextState)
static contextType
static defaultProps
static getDerivedStateFromError(error)
static getDerivedStateFromProps(props, state)
Usage
Defining a class component
Adding state to a class component
Adding lifecycle methods to a class component
Catching rendering errors with an error boundary
Alternatives
Migrating a simple component from a class to a function
Migrating a component with state from a class to a function
Migrating a component with lifecycle methods from a class to a function
Migrating a component with context from a class to a function
Component – React
createElement
createElement lets you create a React element. It serves as an alternative to writing JSX.
const element = createElement(type, props, ...children)
Reference
createElement(type, props, ...children)
Usage
Creating an element without JSX

Reference 
createElement(type, props, ...children) 
Call createElement to create a React element with the given type, props, and children.
import { createElement } from 'react';

function Greeting({ name }) {
 return createElement(
   'h1',
   { className: 'greeting' },
   'Hello'
 );
}
See more examples below.
Parameters 
type: The type argument must be a valid React component type. For example, it could be a tag name string (such as 'div' or 'span'), or a React component (a function, a class, or a special component like Fragment).
props: The props argument must either be an object or null. If you pass null, it will be treated the same as an empty object. React will create an element with props matching the props you have passed. Note that ref and key from your props object are special and will not be available as element.props.ref and element.props.key on the returned element. They will be available as element.ref and element.key.
optional ...children: Zero or more child nodes. They can be any React nodes, including React elements, strings, numbers, portals, empty nodes (null, undefined, true, and false), and arrays of React nodes.
Returns 
createElement returns a React element object with a few properties:
type: The type you have passed.
props: The props you have passed except for ref and key.
ref: The ref you have passed. If missing, null.
key: The key you have passed, coerced to a string. If missing, null.
Usually, you’ll return the element from your component or make it a child of another element. Although you may read the element’s properties, it’s best to treat every element as opaque after it’s created, and only render it.
Caveats 
You must treat React elements and their props as immutable and never change their contents after creation. In development, React will freeze the returned element and its props property shallowly to enforce this.
When you use JSX, you must start a tag with a capital letter to render your own custom component. In other words, <Something /> is equivalent to createElement(Something), but <something /> (lowercase) is equivalent to createElement('something') (note it’s a string, so it will be treated as a built-in HTML tag).
You should only pass children as multiple arguments to createElement if they are all statically known, like createElement('h1', {}, child1, child2, child3). If your children are dynamic, pass the entire array as the third argument: createElement('ul', {}, listItems). This ensures that React will warn you about missing keys for any dynamic lists. For static lists this is not necessary because they never reorder.

Usage 
Creating an element without JSX 
If you don’t like JSX or can’t use it in your project, you can use createElement as an alternative.
To create an element without JSX, call createElement with some type, props, and children:
import { createElement } from 'react';

function Greeting({ name }) {
 return createElement(
   'h1',
   { className: 'greeting' },
   'Hello ',
   createElement('i', null, name),
   '. Welcome!'
 );
}
The children are optional, and you can pass as many as you need (the example above has three children). This code will display a <h1> header with a greeting. For comparison, here is the same example rewritten with JSX:
function Greeting({ name }) {
 return (
   <h1 className="greeting">
     Hello <i>{name}</i>. Welcome!
   </h1>
 );
}
To render your own React component, pass a function like Greeting as the type instead of a string like 'h1':
export default function App() {
 return createElement(Greeting, { name: 'Taylor' });
}
With JSX, it would look like this:
export default function App() {
 return <Greeting name="Taylor" />;
}
Here is a complete example written with createElement:
App.js
DownloadReset
Fork
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}


Show more
And here is the same example written using JSX:
App.js
DownloadReset
Fork
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}


Both coding styles are fine, so you can use whichever one you prefer for your project. The main benefit of using JSX compared to createElement is that it’s easy to see which closing tag corresponds to which opening tag.
Deep Dive
What is a React element, exactly? 
Show Details








PreviousComponent
NextcreateRef

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
createElement(type, props, ...children)
Usage
Creating an element without JSX
createElement – React
createRef
Pitfall
createRef is mostly used for class components. Function components typically rely on useRef instead.
createRef creates a ref object which can contain arbitrary value.
class MyInput extends Component {
 inputRef = createRef();
 // ...
}
Reference
createRef()
Usage
Declaring a ref in a class component
Alternatives
Migrating from a class with createRef to a function with useRef

Reference 
createRef() 
Call createRef to declare a ref inside a class component.
import { createRef, Component } from 'react';

class MyComponent extends Component {
 intervalRef = createRef();
 inputRef = createRef();
 // ...
See more examples below.
Parameters 
createRef takes no parameters.
Returns 
createRef returns an object with a single property:
current: Initially, it’s set to the null. You can later set it to something else. If you pass the ref object to React as a ref attribute to a JSX node, React will set its current property.
Caveats 
createRef always returns a different object. It’s equivalent to writing { current: null } yourself.
In a function component, you probably want useRef instead which always returns the same object.
const ref = useRef() is equivalent to const [ref, _] = useState(() => createRef(null)).

Usage 
Declaring a ref in a class component 
To declare a ref inside a class component, call createRef and assign its result to a class field:
import { Component, createRef } from 'react';

class Form extends Component {
 inputRef = createRef();

 // ...
}
If you now pass ref={this.inputRef} to an <input> in your JSX, React will populate this.inputRef.current with the input DOM node. For example, here is how you make a button that focuses the input:
App.js
DownloadReset
Fork
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}


Show more
Pitfall
createRef is mostly used for class components. Function components typically rely on useRef instead.

Alternatives 
Migrating from a class with createRef to a function with useRef 
We recommend using function components instead of class components in new code. If you have some existing class components using createRef, here is how you can convert them. This is the original code:
App.js
DownloadReset
Fork
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}


Show more
When you convert this component from a class to a function, replace calls to createRef with calls to useRef:
App.js
DownloadReset
Fork
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}


Show more
PreviouscreateElement
NextforwardRef

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
createRef()
Usage
Declaring a ref in a class component
Alternatives
Migrating from a class with createRef to a function with useRef
createRef – React
forwardRef
Deprecated
In React 19, forwardRef is no longer necessary. Pass ref as a prop instead.
forwardRef will be deprecated in a future release. Learn more here.
forwardRef lets your component expose a DOM node to parent component with a ref.
const SomeComponent = forwardRef(render)
Reference
forwardRef(render)
render function
Usage
Exposing a DOM node to the parent component
Forwarding a ref through multiple components
Exposing an imperative handle instead of a DOM node
Troubleshooting
My component is wrapped in forwardRef, but the ref to it is always null

Reference 
forwardRef(render) 
Call forwardRef() to let your component receive a ref and forward it to a child component:
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
 // ...
});
See more examples below.
Parameters 
render: The render function for your component. React calls this function with the props and ref that your component received from its parent. The JSX you return will be the output of your component.
Returns 
forwardRef returns a React component that you can render in JSX. Unlike React components defined as plain functions, a component returned by forwardRef is also able to receive a ref prop.
Caveats 
In Strict Mode, React will call your render function twice in order to help you find accidental impurities. This is development-only behavior and does not affect production. If your render function is pure (as it should be), this should not affect the logic of your component. The result from one of the calls will be ignored.

render function 
forwardRef accepts a render function as an argument. React calls this function with props and ref:
const MyInput = forwardRef(function MyInput(props, ref) {
 return (
   <label>
     {props.label}
     <input ref={ref} />
   </label>
 );
});
Parameters 
props: The props passed by the parent component.
ref:  The ref attribute passed by the parent component. The ref can be an object or a function. If the parent component has not passed a ref, it will be null. You should either pass the ref you receive to another component, or pass it to useImperativeHandle.
Returns 
forwardRef returns a React component that you can render in JSX. Unlike React components defined as plain functions, the component returned by forwardRef is able to take a ref prop.

Usage 
Exposing a DOM node to the parent component 
By default, each component’s DOM nodes are private. However, sometimes it’s useful to expose a DOM node to the parent—for example, to allow focusing it. To opt in, wrap your component definition into forwardRef():
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
 const { label, ...otherProps } = props;
 return (
   <label>
     {label}
     <input {...otherProps} />
   </label>
 );
});
You will receive a ref as the second argument after props. Pass it to the DOM node that you want to expose:
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
 const { label, ...otherProps } = props;
 return (
   <label>
     {label}
     <input {...otherProps} ref={ref} />
   </label>
 );
});
This lets the parent Form component access the <input> DOM node exposed by MyInput:
function Form() {
 const ref = useRef(null);

 function handleClick() {
   ref.current.focus();
 }

 return (
   <form>
     <MyInput label="Enter your name:" ref={ref} />
     <button type="button" onClick={handleClick}>
       Edit
     </button>
   </form>
 );
}
This Form component passes a ref to MyInput. The MyInput component forwards that ref to the <input> browser tag. As a result, the Form component can access that <input> DOM node and call focus() on it.
Keep in mind that exposing a ref to the DOM node inside your component makes it harder to change your component’s internals later. You will typically expose DOM nodes from reusable low-level components like buttons or text inputs, but you won’t do it for application-level components like an avatar or a comment.
Examples of forwarding a ref
1. Focusing a text input2. Playing and pausing a video
Example 1 of 2: Focusing a text input 
Clicking the button will focus the input. The Form component defines a ref and passes it to the MyInput component. The MyInput component forwards that ref to the browser <input>. This lets the Form component focus the <input>.
App.jsMyInput.js
Reset
Fork
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}


Show more
Next Example

Forwarding a ref through multiple components 
Instead of forwarding a ref to a DOM node, you can forward it to your own component like MyInput:
const FormField = forwardRef(function FormField(props, ref) {
 // ...
 return (
   <>
     <MyInput ref={ref} />
     ...
   </>
 );
});
If that MyInput component forwards a ref to its <input>, a ref to FormField will give you that <input>:
function Form() {
 const ref = useRef(null);

 function handleClick() {
   ref.current.focus();
 }

 return (
   <form>
     <FormField label="Enter your name:" ref={ref} isRequired={true} />
     <button type="button" onClick={handleClick}>
       Edit
     </button>
   </form>
 );
}
The Form component defines a ref and passes it to FormField. The FormField component forwards that ref to MyInput, which forwards it to a browser <input> DOM node. This is how Form accesses that DOM node.
App.jsFormField.jsMyInput.js
Reset
Fork
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}


Show more

Exposing an imperative handle instead of a DOM node 
Instead of exposing an entire DOM node, you can expose a custom object, called an imperative handle, with a more constrained set of methods. To do this, you’d need to define a separate ref to hold the DOM node:
const MyInput = forwardRef(function MyInput(props, ref) {
 const inputRef = useRef(null);

 // ...

 return <input {...props} ref={inputRef} />;
});
Pass the ref you received to useImperativeHandle and specify the value you want to expose to the ref:
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
 const inputRef = useRef(null);

 useImperativeHandle(ref, () => {
   return {
     focus() {
       inputRef.current.focus();
     },
     scrollIntoView() {
       inputRef.current.scrollIntoView();
     },
   };
 }, []);

 return <input {...props} ref={inputRef} />;
});
If some component gets a ref to MyInput, it will only receive your { focus, scrollIntoView } object instead of the DOM node. This lets you limit the information you expose about your DOM node to the minimum.
App.jsMyInput.js
Reset
Fork
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}


Show more
Read more about using imperative handles.
Pitfall
Do not overuse refs. You should only use refs for imperative behaviors that you can’t express as props: for example, scrolling to a node, focusing a node, triggering an animation, selecting text, and so on.
If you can express something as a prop, you should not use a ref. For example, instead of exposing an imperative handle like { open, close } from a Modal component, it is better to take isOpen as a prop like <Modal isOpen={isOpen} />. Effects can help you expose imperative behaviors via props.

Troubleshooting 
My component is wrapped in forwardRef, but the ref to it is always null 
This usually means that you forgot to actually use the ref that you received.
For example, this component doesn’t do anything with its ref:
const MyInput = forwardRef(function MyInput({ label }, ref) {
 return (
   <label>
     {label}
     <input />
   </label>
 );
});
To fix it, pass the ref down to a DOM node or another component that can accept a ref:
const MyInput = forwardRef(function MyInput({ label }, ref) {
 return (
   <label>
     {label}
     <input ref={ref} />
   </label>
 );
});
The ref to MyInput could also be null if some of the logic is conditional:
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
 return (
   <label>
     {label}
     {showInput && <input ref={ref} />}
   </label>
 );
});
If showInput is false, then the ref won’t be forwarded to any node, and a ref to MyInput will remain empty. This is particularly easy to miss if the condition is hidden inside another component, like Panel in this example:
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
 return (
   <label>
     {label}
     <Panel isExpanded={showInput}>
       <input ref={ref} />
     </Panel>
   </label>
 );
});
PreviouscreateRef
NextisValidElement

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
forwardRef(render)
render function
Usage
Exposing a DOM node to the parent component
Forwarding a ref through multiple components
Exposing an imperative handle instead of a DOM node
Troubleshooting
My component is wrapped in forwardRef, but the ref to it is always null
forwardRef – React
isValidElement
isValidElement checks whether a value is a React element.
const isElement = isValidElement(value)
Reference
isValidElement(value)
Usage
Checking if something is a React element

Reference 
isValidElement(value) 
Call isValidElement(value) to check whether value is a React element.
import { isValidElement, createElement } from 'react';

// ✅ React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Not React elements
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
See more examples below.
Parameters 
value: The value you want to check. It can be any a value of any type.
Returns 
isValidElement returns true if the value is a React element. Otherwise, it returns false.
Caveats 
Only JSX tags and objects returned by createElement are considered to be React elements. For example, even though a number like 42 is a valid React node (and can be returned from a component), it is not a valid React element. Arrays and portals created with createPortal are also not considered to be React elements.

Usage 
Checking if something is a React element 
Call isValidElement to check if some value is a React element.
React elements are:
Values produced by writing a JSX tag
Values produced by calling createElement
For React elements, isValidElement returns true:
import { isValidElement, createElement } from 'react';

// ✅ JSX tags are React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Values returned by createElement are React elements
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
Any other values, such as strings, numbers, or arbitrary objects and arrays, are not React elements.
For them, isValidElement returns false:
// ❌ These are *not* React elements
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
It is very uncommon to need isValidElement. It’s mostly useful if you’re calling another API that only accepts elements (like cloneElement does) and you want to avoid an error when your argument is not a React element.
Unless you have some very specific reason to add an isValidElement check, you probably don’t need it.
Deep Dive
React elements vs React nodes 
Show Details
















PreviousforwardRef
NextPureComponent

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
isValidElement(value)
Usage
Checking if something is a React element
isValidElement – React
PureComponent
Pitfall
We recommend defining components as functions instead of classes. See how to migrate.
PureComponent is similar to Component but it skips re-renders for same props and state. Class components are still supported by React, but we don’t recommend using them in new code.
class Greeting extends PureComponent {
 render() {
   return <h1>Hello, {this.props.name}!</h1>;
 }
}
Reference
PureComponent
Usage
Skipping unnecessary re-renders for class components
Alternatives
Migrating from a PureComponent class component to a function

Reference 
PureComponent 
To skip re-rendering a class component for same props and state, extend PureComponent instead of Component:
import { PureComponent } from 'react';

class Greeting extends PureComponent {
 render() {
   return <h1>Hello, {this.props.name}!</h1>;
 }
}
PureComponent is a subclass of Component and supports all the Component APIs. Extending PureComponent is equivalent to defining a custom shouldComponentUpdate method that shallowly compares props and state.
See more examples below.

Usage 
Skipping unnecessary re-renders for class components 
React normally re-renders a component whenever its parent re-renders. As an optimization, you can create a component that React will not re-render when its parent re-renders so long as its new props and state are the same as the old props and state. Class components can opt into this behavior by extending PureComponent:
class Greeting extends PureComponent {
 render() {
   return <h1>Hello, {this.props.name}!</h1>;
 }
}
A React component should always have pure rendering logic. This means that it must return the same output if its props, state, and context haven’t changed. By using PureComponent, you are telling React that your component complies with this requirement, so React doesn’t need to re-render as long as its props and state haven’t changed. However, your component will still re-render if a context that it’s using changes.
In this example, notice that the Greeting component re-renders whenever name is changed (because that’s one of its props), but not when address is changed (because it’s not passed to Greeting as a prop):
App.js
DownloadReset
Fork
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}


Console (2)
Greeting was rendered at 10:37:43 PM
Greeting was rendered at 10:37:43 PM
Show more
Pitfall
We recommend defining components as functions instead of classes. See how to migrate.

Alternatives 
Migrating from a PureComponent class component to a function 
We recommend using function components instead of class components in new code. If you have some existing class components using PureComponent, here is how you can convert them. This is the original code:
App.js
DownloadReset
Fork
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}


Show more
When you convert this component from a class to a function, wrap it in memo:
App.js
DownloadReset
Fork
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}


Show more
Note
Unlike PureComponent, memo does not compare the new and the old state. In function components, calling the set function with the same state already prevents re-renders by default, even without memo.
PreviousisValidElement

Copyright © Meta Platforms, Inc
uwu?
Learn React
Quick Start
Installation
Describing the UI
Adding Interactivity
Managing State
Escape Hatches
API Reference
React APIs
React DOM APIs
Community
Code of Conduct
Meet the Team
Docs Contributors
Acknowledgements
More
Blog
React Native
Privacy
Terms
On this page
Overview
Reference
PureComponent
Usage
Skipping unnecessary re-renders for class components
Alternatives
Migrating from a PureComponent class component to a function
PureComponent – React


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
14
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
14
15
16
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
14
15
16
17
18
19
20
21
22
23
24
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
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
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
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
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
Example 2 of 4: Preloading a stylesheet 
import { preload } from 'react-dom';

function AppRoot() {
 preload("https://example.com/style.css", {as: "style"});
 return ...;
}
If you want the stylesheet to be inserted into the document immediately (which means the browser will start parsing it immediately rather than just downloading it), use preinit instead.
Next Example
Example 3 of 4: Preloading a font 
import { preload } from 'react-dom';

function AppRoot() {
 preload("https://example.com/style.css", {as: "style"});
 preload("https://example.com/font.woff2", {as: "font"});
 return ...;
}
If you preload a stylesheet, it’s smart to also preload any fonts that the stylesheet refers to. That way, the browser can start downloading the font before it’s downloaded and parsed the stylesheet.
Next Example
4. Preloading an image

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

lient React DOM APIs
The react-dom/client APIs let you render React components on the client (in the browser). These APIs are typically used at the top level of your app to initialize your React tree. A framework may call them for you. Most of your components don’t need to import or use them.

Client APIs 
createRoot lets you create a root to display React components inside a browser DOM node.
hydrateRoot lets you display React components inside a browser DOM node whose HTML content was previously generated by react-dom/server.

Browser support 
React supports all popular browsers, including Internet Explorer 9 and above. Some polyfills are required for older browsers such as IE 9 and IE 10.
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
1
2
3
4
5
6
7
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
14
15
16
17
18
19
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
1
2
3
4
5
6
7
8
9
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
1
2
3
4
5
6
7
8
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
14
15
16
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
14
15
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
14
15
16
17
18
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

Console (2)
Recoverable Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  <App>
+   <button onClick={function onClick}>
-   Server content before hydration.
    ...

    at throwOnHydrationMismatch (https://786946de.sandpack-bundler-4bw.pages.dev/node_modules/react-dom/cjs/react-dom-client.development.js:11:106063)
    at beginWork (https://786946de.sandpack-bundler-4bw.pages.dev/node_modules/react-dom/cjs/react-dom-client.development.js:11:272443)
    at runWithFiberInDEV (https://786946de.sandpack-bundler-4bw.pages.dev/node_modules/react-dom/cjs/react-dom-client.development.js:11:19643)
    at performUnitOfWork (https://786946de.sandpack-bundler-4bw.pages.dev/node_modules/react-dom/cjs/react-dom-client.development.js:11:384335)
    at workLoopSync (https://786946de.sandpack-bundler-4bw.pages.dev/node_modules/react-dom/cjs/react-dom-client.development.js:11:380104)
    at renderRootSync (https://786946de.sandpack-bundler-4bw.pages.dev/node_modules/react-dom/cjs/react-dom-client.development.js:11:379580)
    at performWorkOnRoot (https://786946de.sandpack-bundler-4bw.pages.dev/node_modules/react-dom/cjs/react-dom-client.development.js:11:366905)
    at performWorkOnRootViaSchedulerTask (https://786946de.sandpack-bundler-4bw.pages.dev/node_modules/react-dom/cjs/react-dom-client.development.js:11:414241)
    at MessagePort.performWorkUntilDeadline (https://786946de.sandpack-bundler-4bw.pages.dev/node_modules/scheduler/cjs/scheduler.development.js:9:704) Component Stack:
Component Stack:  
    at button (<anonymous>)
    at App (https://786946de.sandpack-bundler-4bw.pages.dev/src/App.js:46:79)
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
Hide Details
The final asset URLs (like JavaScript and CSS files) are often hashed after the build. For example, instead of styles.css you might end up with styles.123456.css. Hashing static asset filenames guarantees that every distinct build of the same asset will have a different filename. This is useful because it lets you safely enable long-term caching for static assets: a file with a certain name would never change content.
However, if you don’t know the asset URLs until after the build, there’s no way for you to put them in the source code. For example, hardcoding "/styles.css" into JSX like earlier wouldn’t work. To keep them out of your source code, your root component can read the real filenames from a map passed as a prop:
export default function App({ assetMap }) {
 return (
   <html>
     <head>
       <title>My app</title>
       <link rel="stylesheet" href={assetMap['styles.css']}></link>
     </head>
     ...
   </html>
 );
}
On the server, render <App assetMap={assetMap} /> and pass your assetMap with the asset URLs:
// You'd need to get this JSON from your build tooling, e.g. read it from the build output.
const assetMap = {
 'styles.css': '/styles.123456.css',
 'main.js': '/main.123456.js'
};

async function handler(request) {
 const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
   bootstrapScripts: [assetMap['/main.js']]
 });
 return new Response(stream, {
   headers: { 'content-type': 'text/html' },
 });
}
Since your server is now rendering <App assetMap={assetMap} />, you need to render it with assetMap on the client too to avoid hydration errors. You can serialize and pass assetMap to the client like this:
// You'd need to get this JSON from your build tooling.
const assetMap = {
 'styles.css': '/styles.123456.css',
 'main.js': '/main.123456.js'
};

async function handler(request) {
 const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
   // Careful: It's safe to stringify() this because this data isn't user-generated.
   bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
   bootstrapScripts: [assetMap['/main.js']],
 });
 return new Response(stream, {
   headers: { 'content-type': 'text/html' },
 });
}
In the example above, the bootstrapScriptContent option adds an extra inline <script> tag that sets the global window.assetMap variable on the client. This lets the client code read the same assetMap:
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
Both client and server render App with the same assetMap prop, so there are no hydration errors.

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
Hide Details
The final asset URLs (like JavaScript and CSS files) are often hashed after the build. For example, instead of styles.css you might end up with styles.123456.css. Hashing static asset filenames guarantees that every distinct build of the same asset will have a different filename. This is useful because it lets you safely enable long-term caching for static assets: a file with a certain name would never change content.
However, if you don’t know the asset URLs until after the build, there’s no way for you to put them in the source code. For example, hardcoding "/styles.css" into JSX like earlier wouldn’t work. To keep them out of your source code, your root component can read the real filenames from a map passed as a prop:
export default function App({ assetMap }) {
 return (
   <html>
     <head>
       <title>My app</title>
       <link rel="stylesheet" href={assetMap['styles.css']}></link>
     </head>
     ...
   </html>
 );
}
On the server, render <App assetMap={assetMap} /> and pass your assetMap with the asset URLs:
// You'd need to get this JSON from your build tooling, e.g. read it from the build output.
const assetMap = {
 'styles.css': '/styles.123456.css',
 'main.js': '/main.123456.js'
};

async function handler(request) {
 const {prelude} = await prerender(<App assetMap={assetMap} />, {
   bootstrapScripts: [assetMap['/main.js']]
 });
 return new Response(prelude, {
   headers: { 'content-type': 'text/html' },
 });
}
Since your server is now rendering <App assetMap={assetMap} />, you need to render it with assetMap on the client too to avoid hydration errors. You can serialize and pass assetMap to the client like this:
// You'd need to get this JSON from your build tooling.
const assetMap = {
 'styles.css': '/styles.123456.css',
 'main.js': '/main.123456.js'
};

async function handler(request) {
 const {prelude} = await prerender(<App assetMap={assetMap} />, {
   // Careful: It's safe to stringify() this because this data isn't user-generated.
   bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
   bootstrapScripts: [assetMap['/main.js']],
 });
 return new Response(prelude, {
   headers: { 'content-type': 'text/html' },
 });
}
In the example above, the bootstrapScriptContent option adds an extra inline <script> tag that sets the global window.assetMap variable on the client. This lets the client code read the same assetMap:
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
Both client and server render App with the same assetMap prop, so there are no hydration errors.

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
Hide Details
The final asset URLs (like JavaScript and CSS files) are often hashed after the build. For example, instead of styles.css you might end up with styles.123456.css. Hashing static asset filenames guarantees that every distinct build of the same asset will have a different filename. This is useful because it lets you safely enable long-term caching for static assets: a file with a certain name would never change content.
However, if you don’t know the asset URLs until after the build, there’s no way for you to put them in the source code. For example, hardcoding "/styles.css" into JSX like earlier wouldn’t work. To keep them out of your source code, your root component can read the real filenames from a map passed as a prop:
export default function App({ assetMap }) {
 return (
   <html>
     <head>
       <title>My app</title>
       <link rel="stylesheet" href={assetMap['styles.css']}></link>
     </head>
     ...
   </html>
 );
}
On the server, render <App assetMap={assetMap} /> and pass your assetMap with the asset URLs:
// You'd need to get this JSON from your build tooling, e.g. read it from the build output.
const assetMap = {
 'styles.css': '/styles.123456.css',
 'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
 const { prelude } = await prerenderToNodeStream(<App />, {
   bootstrapScripts: [assetMap['/main.js']]
 });

 response.setHeader('Content-Type', 'text/html');
 prelude.pipe(response);
});
Since your server is now rendering <App assetMap={assetMap} />, you need to render it with assetMap on the client too to avoid hydration errors. You can serialize and pass assetMap to the client like this:
// You'd need to get this JSON from your build tooling.
const assetMap = {
 'styles.css': '/styles.123456.css',
 'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
 const { prelude } = await prerenderToNodeStream(<App />, {
   // Careful: It's safe to stringify() this because this data isn't user-generated.
   bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
   bootstrapScripts: [assetMap['/main.js']],
 });

 response.setHeader('Content-Type', 'text/html');
 prelude.pipe(response);
});
In the example above, the bootstrapScriptContent option adds an extra inline <script> tag that sets the global window.assetMap variable on the client. This lets the client code read the same assetMap:
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
Both client and server render App with the same assetMap prop, so there are no hydration errors.

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
Hide Details
One quick heuristic to tell if code runs during render is to examine where it is: if it’s written at the top level like in the example below, there’s a good chance it runs during render.
function Dropdown() {
 const selectedItems = new Set(); // created during render
 // ...
}
Event handlers and Effects don’t run in render:
function Dropdown() {
 const selectedItems = new Set();
 const onSelect = (item) => {
   // this code is in an event handler, so it's only run when the user triggers this
   selectedItems.add(item);
 }
}
function Dropdown() {
 const selectedItems = new Set();
 useEffect(() => {
   // this code is inside of an Effect, so it only runs after rendering
   logForAnalytics(selectedItems);
 }, [selectedItems]);
}

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
14
15
16
17
18
19
20
21
22
23
24
25
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
Directives
React Server Components
Directives are for use in React Server Components.
Directives provide instructions to bundlers compatible with React Server Components.

Source code directives 
'use client' lets you mark what code runs on the client.
'use server' marks server-side functions that can be called from client-side code.
PreviousServer Functions
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
14
15
16
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
Hide Details
By the above definitions, the component FancyText is both a Server and Client Component, how can that be?
First, let’s clarify that the term “component” is not very precise. Here are just two ways “component” can be understood:
A “component” can refer to a component definition. In most cases this will be a function.
// This is a definition of a component
function MyComponent() {
 return <p>My Component</p>
}
A “component” can also refer to a component usage of its definition.
import MyComponent from './MyComponent';

function App() {
 // This is a usage of a component
 return <MyComponent />;
}
Often, the imprecision is not important when explaining concepts, but in this case it is.
When we talk about Server or Client Components, we are referring to component usages.
If the component is defined in a module with a 'use client' directive, or the component is imported and called in a Client Component, then the component usage is a Client Component.
Otherwise, the component usage is a Server Component.

A render tree illustrates component usages.
Back to the question of FancyText, we see that the component definition does not have a 'use client' directive and it has two usages.
The usage of FancyText as a child of App, marks that usage as a Server Component. When FancyText is imported and called under InspirationGenerator, that usage of FancyText is a Client Component as InspirationGenerator contains a 'use client' directive.
This means that the component definition for FancyText will both be evaluated on the server and also downloaded by the client to render its Client Component usage.
Deep Dive
Why is Copyright a Server Component? 
Hide Details
Because Copyright is rendered as a child of the Client Component InspirationGenerator, you might be surprised that it is a Server Component.
Recall that 'use client' defines the boundary between server and client code on the module dependency tree, not the render tree.

'use client' defines the boundary between server and client code on the module dependency tree.
In the module dependency tree, we see that App.js imports and calls Copyright from the Copyright.js module. As Copyright.js does not contain a 'use client' directive, the component usage is rendered on the server. App is rendered on the server as it is the root component.
Client Components can render Server Components because you can pass JSX as props. In this case, InspirationGenerator receives Copyright as children. However, the InspirationGenerator module never directly imports the Copyright module nor calls the component, all of that is done by App. In fact, the Copyright component is fully executed before InspirationGenerator starts rendering.
The takeaway is that a parent-child render relationship between components does not guarantee the same render environment.
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
14
15
16
17
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
14
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
14
15
16
17
18
19
20
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
14
15
16
17
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
1
2
3
4
5
6
7
8
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
14
15
16
17
18
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
14
15
16
17
18
19
20
21
22
23
24
25
26
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
14
15
16
17
18
19
20
21
22
23
24
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
14
15
16
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
14
15
16
17
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
14
15
16
17
18
19
20
21
22
23
24
25
26
27
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
Greeting was rendered at 10:06:08 AM
Greeting was rendered at 10:06:08 AM
Show more
Pitfall
We recommend defining components as functions instead of classes. See how to migrate.

Alternatives 
Migrating from a PureComponent class component to a function 
We recommend using function components instead of class components in new code. If you have some existing class components using PureComponent, here is how you can convert them. This is the original code:
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
14
15
16
17
18
19
20
21
22
23
24
25
26
27
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
Greeting was rendered at 10:06:10 AM
Greeting was rendered at 10:06:10 AM
Show more
When you convert this component from a class to a function, wrap it in memo:
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
14
15
16
17
18
19
20
21
22
23
24
25
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


Console (2)
Greeting was rendered at 10:06:10 AM
Greeting was rendered at 10:06:10 AM
Show more
Note
Unlike PureComponent, memo does not compare the new and the old state. In function components, calling the set function with the same state already prevents re-renders by default, even without memo.



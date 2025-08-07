# React Reference Overview

## Document Overview

This document serves as a reference for React APIs and related concepts. Use this guide for efficient troubleshooting and exploration of functionalities:

- **React API**: Reference for core React functions and components.
- **Hooks**: Explore built-in hooks and how they enhance component features.
- **React DOM**: Specifics for web applications utilizing React DOM.
- **Rules of React**: Guidelines and idioms for writing optimal React code.
- **Legacy APIs**: Understand deprecated features and newer alternatives.

Refer to these sections based on your needs.
React Reference Overview
This section provides detailed reference documentation for working with React. For an introduction to React, please visit the Learn section.
The React reference documentation is broken down into functional subsections:
React 
Programmatic React features:
Hooks - Use different React features from your components.
Components - Built-in components that you can use in your JSX.
APIs - APIs that are useful for defining components.
Directives - Provide instructions to bundlers compatible with React Server Components.
React DOM 
React-dom contains features that are only supported for web applications (which run in the browser DOM environment). This section is broken into the following:
Hooks - Hooks for web applications which run in the browser DOM environment.
Components - React supports all of the browser built-in HTML and SVG components.
APIs - The react-dom package contains methods supported only in web applications.
Client APIs - The react-dom/client APIs let you render React components on the client (in the browser).
Server APIs - The react-dom/server APIs let you render React components to HTML on the server.
Rules of React 
React has idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications:
Components and Hooks must be pure – Purity makes your code easier to understand, debug, and allows React to automatically optimize your components and hooks correctly.
React calls Components and Hooks – React is responsible for rendering components and hooks when necessary to optimize the user experience.
Rules of Hooks – Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called.
Legacy APIs 
Legacy APIs - Exported from the react package, but not recommended for use in newly written code.
NextHooks

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
React
React DOM
Rules of React
Legacy APIs
API Reference
Built-in React Hooks
Hooks let you use different React features from your components. You can either use the built-in Hooks or combine them to build your own. This page lists all built-in Hooks in React.

State Hooks 
State lets a component “remember” information like user input. For example, a form component can use state to store the input value, while an image gallery component can use state to store the selected image index.
To add state to a component, use one of these Hooks:
useState declares a state variable that you can update directly.
useReducer declares a state variable with the update logic inside a reducer function.
function ImageGallery() {
 const [index, setIndex] = useState(0);
 // ...

Context Hooks 
Context lets a component receive information from distant parents without passing it as props. For example, your app’s top-level component can pass the current UI theme to all components below, no matter how deep.
useContext reads and subscribes to a context.
function Button() {
 const theme = useContext(ThemeContext);
 // ...

Ref Hooks 
Refs let a component hold some information that isn’t used for rendering, like a DOM node or a timeout ID. Unlike with state, updating a ref does not re-render your component. Refs are an “escape hatch” from the React paradigm. They are useful when you need to work with non-React systems, such as the built-in browser APIs.
useRef declares a ref. You can hold any value in it, but most often it’s used to hold a DOM node.
useImperativeHandle lets you customize the ref exposed by your component. This is rarely used.
function Form() {
 const inputRef = useRef(null);
 // ...

Effect Hooks 
Effects let a component connect to and synchronize with external systems. This includes dealing with network, browser DOM, animations, widgets written using a different UI library, and other non-React code.
useEffect connects a component to an external system.
function ChatRoom({ roomId }) {
 useEffect(() => {
   const connection = createConnection(roomId);
   connection.connect();
   return () => connection.disconnect();
 }, [roomId]);
 // ...
Effects are an “escape hatch” from the React paradigm. Don’t use Effects to orchestrate the data flow of your application. If you’re not interacting with an external system, you might not need an Effect.
There are two rarely used variations of useEffect with differences in timing:
useLayoutEffect fires before the browser repaints the screen. You can measure layout here.
useInsertionEffect fires before React makes changes to the DOM. Libraries can insert dynamic CSS here.

Performance Hooks 
A common way to optimize re-rendering performance is to skip unnecessary work. For example, you can tell React to reuse a cached calculation or to skip a re-render if the data has not changed since the previous render.
To skip calculations and unnecessary re-rendering, use one of these Hooks:
useMemo lets you cache the result of an expensive calculation.
useCallback lets you cache a function definition before passing it down to an optimized component.
function TodoList({ todos, tab, theme }) {
 const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
 // ...
}
Sometimes, you can’t skip re-rendering because the screen actually needs to update. In that case, you can improve performance by separating blocking updates that must be synchronous (like typing into an input) from non-blocking updates which don’t need to block the user interface (like updating a chart).
To prioritize rendering, use one of these Hooks:
useTransition lets you mark a state transition as non-blocking and allow other updates to interrupt it.
useDeferredValue lets you defer updating a non-critical part of the UI and let other parts update first.

Other Hooks 
These Hooks are mostly useful to library authors and aren’t commonly used in the application code.
useDebugValue lets you customize the label React DevTools displays for your custom Hook.
useId lets a component associate a unique ID with itself. Typically used with accessibility APIs.
useSyncExternalStore lets a component subscribe to an external store.
useActionState allows you to manage state of actions.

Your own Hooks 
You can also define your own custom Hooks as JavaScript functions.
PreviousOverview
NextuseActionState

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
State Hooks
Context Hooks
Ref Hooks
Effect Hooks
Performance Hooks
Other Hooks
Your own Hooks
Built-in React Hooks – React
useActionState
useActionState is a Hook that allows you to update state based on the result of a form action.
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
Note
In earlier React Canary versions, this API was part of React DOM and called useFormState.
Reference
useActionState(action, initialState, permalink?)
Usage
Using information returned by a form action
Troubleshooting
My action can no longer read the submitted form data

Reference 
useActionState(action, initialState, permalink?) 
Call useActionState at the top level of your component to create component state that is updated when a form action is invoked. You pass useActionState an existing form action function as well as an initial state, and it returns a new action that you use in your form, along with the latest form state and whether the Action is still pending. The latest form state is also passed to the function that you provided.
import { useActionState } from "react";

async function increment(previousState, formData) {
 return previousState + 1;
}

function StatefulForm({}) {
 const [state, formAction] = useActionState(increment, 0);
 return (
   <form>
     {state}
     <button formAction={formAction}>Increment</button>
   </form>
 )
}
The form state is the value returned by the action when the form was last submitted. If the form has not yet been submitted, it is the initial state that you pass.
If used with a Server Function, useActionState allows the server’s response from submitting the form to be shown even before hydration has completed.
See more examples below.
Parameters 
fn: The function to be called when the form is submitted or button pressed. When the function is called, it will receive the previous state of the form (initially the initialState that you pass, subsequently its previous return value) as its initial argument, followed by the arguments that a form action normally receives.
initialState: The value you want the state to be initially. It can be any serializable value. This argument is ignored after the action is first invoked.
optional permalink: A string containing the unique page URL that this form modifies. For use on pages with dynamic content (eg: feeds) in conjunction with progressive enhancement: if fn is a server function and the form is submitted before the JavaScript bundle loads, the browser will navigate to the specified permalink URL, rather than the current page’s URL. Ensure that the same form component is rendered on the destination page (including the same action fn and permalink) so that React knows how to pass the state through. Once the form has been hydrated, this parameter has no effect.
Returns 
useActionState returns an array with the following values:
The current state. During the first render, it will match the initialState you have passed. After the action is invoked, it will match the value returned by the action.
A new action that you can pass as the action prop to your form component or formAction prop to any button component within the form. The action can also be called manually within startTransition.
The isPending flag that tells you whether there is a pending Transition.
Caveats 
When used with a framework that supports React Server Components, useActionState lets you make forms interactive before JavaScript has executed on the client. When used without Server Components, it is equivalent to component local state.
The function passed to useActionState receives an extra argument, the previous or initial state, as its first argument. This makes its signature different than if it were used directly as a form action without using useActionState.

Usage 
Using information returned by a form action 
Call useActionState at the top level of your component to access the return value of an action from the last time a form was submitted.
import { useActionState } from 'react';
import { action } from './actions.js';

function MyComponent() {
 const [state, formAction] = useActionState(action, null);
 // ...
 return (
   <form action={formAction}>
     {/* ... */}
   </form>
 );
}
useActionState returns an array with the following items:
The current state of the form, which is initially set to the initial state you provided, and after the form is submitted is set to the return value of the action you provided.
A new action that you pass to <form> as its action prop or call manually within startTransition.
A pending state that you can utilise while your action is processing.
When the form is submitted, the action function that you provided will be called. Its return value will become the new current state of the form.
The action that you provide will also receive a new first argument, namely the current state of the form. The first time the form is submitted, this will be the initial state you provided, while with subsequent submissions, it will be the return value from the last time the action was called. The rest of the arguments are the same as if useActionState had not been used.
function action(currentState, formData) {
 // ...
 return 'next state';
}
Display information after submitting a form
1. Display form errors2. Display structured information after submitting a form
Example 1 of 2: Display form errors 
To display messages such as an error message or toast that’s returned by a Server Function, wrap the action in a call to useActionState.
App.jsactions.js
Reset
Fork
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {isPending ? "Loading..." : message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}


Show more
Next Example
Troubleshooting 
My action can no longer read the submitted form data 
When you wrap an action with useActionState, it gets an extra argument as its first argument. The submitted form data is therefore its second argument instead of its first as it would usually be. The new first argument that gets added is the current state of the form.
function action(currentState, formData) {
 // ...
}
PreviousHooks
NextuseCallback

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
useActionState(action, initialState, permalink?)
Usage
Using information returned by a form action
Troubleshooting
My action can no longer read the submitted form data
useActionState – React
useCallback
useCallback is a React Hook that lets you cache a function definition between re-renders.
const cachedFn = useCallback(fn, dependencies)
Reference
useCallback(fn, dependencies)
Usage
Skipping re-rendering of components
Updating state from a memoized callback
Preventing an Effect from firing too often
Optimizing a custom Hook
Troubleshooting
Every time my component renders, useCallback returns a different function
I need to call useCallback for each list item in a loop, but it’s not allowed

Reference 
useCallback(fn, dependencies) 
Call useCallback at the top level of your component to cache a function definition between re-renders:
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
 const handleSubmit = useCallback((orderDetails) => {
   post('/product/' + productId + '/buy', {
     referrer,
     orderDetails,
   });
 }, [productId, referrer]);
See more examples below.
Parameters 
fn: The function value that you want to cache. It can take any arguments and return any values. React will return (not call!) your function back to you during the initial render. On next renders, React will give you the same function again if the dependencies have not changed since the last render. Otherwise, it will give you the function that you have passed during the current render, and store it in case it can be reused later. React will not call your function. The function is returned to you so you can decide when and whether to call it.
dependencies: The list of all reactive values referenced inside of the fn code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is configured for React, it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like [dep1, dep2, dep3]. React will compare each dependency with its previous value using the Object.is comparison algorithm.
Returns 
On the initial render, useCallback returns the fn function you have passed.
During subsequent renders, it will either return an already stored fn  function from the last render (if the dependencies haven’t changed), or return the fn function you have passed during this render.
Caveats 
useCallback is a Hook, so you can only call it at the top level of your component or your own Hooks. You can’t call it inside loops or conditions. If you need that, extract a new component and move the state into it.
React will not throw away the cached function unless there is a specific reason to do that. For example, in development, React throws away the cache when you edit the file of your component. Both in development and in production, React will throw away the cache if your component suspends during the initial mount. In the future, React may add more features that take advantage of throwing away the cache—for example, if React adds built-in support for virtualized lists in the future, it would make sense to throw away the cache for items that scroll out of the virtualized table viewport. This should match your expectations if you rely on useCallback as a performance optimization. Otherwise, a state variable or a ref may be more appropriate.

Usage 
Skipping re-rendering of components 
When you optimize rendering performance, you will sometimes need to cache the functions that you pass to child components. Let’s first look at the syntax for how to do this, and then see in which cases it’s useful.
To cache a function between re-renders of your component, wrap its definition into the useCallback Hook:
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
 const handleSubmit = useCallback((orderDetails) => {
   post('/product/' + productId + '/buy', {
     referrer,
     orderDetails,
   });
 }, [productId, referrer]);
 // ...
You need to pass two things to useCallback:
A function definition that you want to cache between re-renders.
A list of dependencies including every value within your component that’s used inside your function.
On the initial render, the returned function you’ll get from useCallback will be the function you passed.
On the following renders, React will compare the dependencies with the dependencies you passed during the previous render. If none of the dependencies have changed (compared with Object.is), useCallback will return the same function as before. Otherwise, useCallback will return the function you passed on this render.
In other words, useCallback caches a function between re-renders until its dependencies change.
Let’s walk through an example to see when this is useful.
Say you’re passing a handleSubmit function down from the ProductPage to the ShippingForm component:
function ProductPage({ productId, referrer, theme }) {
 // ...
 return (
   <div className={theme}>
     <ShippingForm onSubmit={handleSubmit} />
   </div>
 );
You’ve noticed that toggling the theme prop freezes the app for a moment, but if you remove <ShippingForm /> from your JSX, it feels fast. This tells you that it’s worth trying to optimize the ShippingForm component.
By default, when a component re-renders, React re-renders all of its children recursively. This is why, when ProductPage re-renders with a different theme, the ShippingForm component also re-renders. This is fine for components that don’t require much calculation to re-render. But if you verified a re-render is slow, you can tell ShippingForm to skip re-rendering when its props are the same as on last render by wrapping it in memo:
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
 // ...
});
With this change, ShippingForm will skip re-rendering if all of its props are the same as on the last render. This is when caching a function becomes important! Let’s say you defined handleSubmit without useCallback:
function ProductPage({ productId, referrer, theme }) {
 // Every time the theme changes, this will be a different function...
 function handleSubmit(orderDetails) {
   post('/product/' + productId + '/buy', {
     referrer,
     orderDetails,
   });
 }

 return (
   <div className={theme}>
     {/* ... so ShippingForm's props will never be the same, and it will re-render every time */}
     <ShippingForm onSubmit={handleSubmit} />
   </div>
 );
}
In JavaScript, a function () {} or () => {} always creates a different function, similar to how the {} object literal always creates a new object. Normally, this wouldn’t be a problem, but it means that ShippingForm props will never be the same, and your memo optimization won’t work. This is where useCallback comes in handy:
function ProductPage({ productId, referrer, theme }) {
 // Tell React to cache your function between re-renders...
 const handleSubmit = useCallback((orderDetails) => {
   post('/product/' + productId + '/buy', {
     referrer,
     orderDetails,
   });
 }, [productId, referrer]); // ...so as long as these dependencies don't change...

 return (
   <div className={theme}>
     {/* ...ShippingForm will receive the same props and can skip re-rendering */}
     <ShippingForm onSubmit={handleSubmit} />
   </div>
 );
}
By wrapping handleSubmit in useCallback, you ensure that it’s the same function between the re-renders (until dependencies change). You don’t have to wrap a function in useCallback unless you do it for some specific reason. In this example, the reason is that you pass it to a component wrapped in memo, and this lets it skip re-rendering. There are other reasons you might need useCallback which are described further on this page.
Note
You should only rely on useCallback as a performance optimization. If your code doesn’t work without it, find the underlying problem and fix it first. Then you may add useCallback back.
Deep Dive
How is useCallback related to useMemo? 
Show Details




























Deep Dive
Should you add useCallback everywhere? 
Show Details














The difference between useCallback and declaring a function directly
1. Skipping re-rendering with useCallback and memo2. Always re-rendering a component
Example 1 of 2: Skipping re-rendering with useCallback and memo 
In this example, the ShippingForm component is artificially slowed down so that you can see what happens when a React component you’re rendering is genuinely slow. Try incrementing the counter and toggling the theme.
Incrementing the counter feels slow because it forces the slowed down ShippingForm to re-render. That’s expected because the counter has changed, and so you need to reflect the user’s new choice on the screen.
Next, try toggling the theme. Thanks to useCallback together with memo, it’s fast despite the artificial slowdown! ShippingForm skipped re-rendering because the handleSubmit function has not changed. The handleSubmit function has not changed because both productId and referrer (your useCallback dependencies) haven’t changed since last render.
App.jsProductPage.jsShippingForm.js
Reset
Fork
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}


Show more
Next Example

Updating state from a memoized callback 
Sometimes, you might need to update state based on previous state from a memoized callback.
This handleAddTodo function specifies todos as a dependency because it computes the next todos from it:
function TodoList() {
 const [todos, setTodos] = useState([]);

 const handleAddTodo = useCallback((text) => {
   const newTodo = { id: nextId++, text };
   setTodos([...todos, newTodo]);
 }, [todos]);
 // ...
You’ll usually want memoized functions to have as few dependencies as possible. When you read some state only to calculate the next state, you can remove that dependency by passing an updater function instead:
function TodoList() {
 const [todos, setTodos] = useState([]);

 const handleAddTodo = useCallback((text) => {
   const newTodo = { id: nextId++, text };
   setTodos(todos => [...todos, newTodo]);
 }, []); // ✅ No need for the todos dependency
 // ...
Here, instead of making todos a dependency and reading it inside, you pass an instruction about how to update the state (todos => [...todos, newTodo]) to React. Read more about updater functions.

Preventing an Effect from firing too often 
Sometimes, you might want to call a function from inside an Effect:
function ChatRoom({ roomId }) {
 const [message, setMessage] = useState('');

 function createOptions() {
   return {
     serverUrl: 'https://localhost:1234',
     roomId: roomId
   };
 }

 useEffect(() => {
   const options = createOptions();
   const connection = createConnection(options);
   connection.connect();
   // ...
This creates a problem. Every reactive value must be declared as a dependency of your Effect. However, if you declare createOptions as a dependency, it will cause your Effect to constantly reconnect to the chat room:
 useEffect(() => {
   const options = createOptions();
   const connection = createConnection(options);
   connection.connect();
   return () => connection.disconnect();
 }, [createOptions]); // 🔴 Problem: This dependency changes on every render
 // ...
To solve this, you can wrap the function you need to call from an Effect into useCallback:
function ChatRoom({ roomId }) {
 const [message, setMessage] = useState('');

 const createOptions = useCallback(() => {
   return {
     serverUrl: 'https://localhost:1234',
     roomId: roomId
   };
 }, [roomId]); // ✅ Only changes when roomId changes

 useEffect(() => {
   const options = createOptions();
   const connection = createConnection(options);
   connection.connect();
   return () => connection.disconnect();
 }, [createOptions]); // ✅ Only changes when createOptions changes
 // ...
This ensures that the createOptions function is the same between re-renders if the roomId is the same. However, it’s even better to remove the need for a function dependency. Move your function inside the Effect:
function ChatRoom({ roomId }) {
 const [message, setMessage] = useState('');

 useEffect(() => {
   function createOptions() { // ✅ No need for useCallback or function dependencies!
     return {
       serverUrl: 'https://localhost:1234',
       roomId: roomId
     };
   }

   const options = createOptions();
   const connection = createConnection(options);
   connection.connect();
   return () => connection.disconnect();
 }, [roomId]); // ✅ Only changes when roomId changes
 // ...
Now your code is simpler and doesn’t need useCallback. Learn more about removing Effect dependencies.

Optimizing a custom Hook 
If you’re writing a custom Hook, it’s recommended to wrap any functions that it returns into useCallback:
function useRouter() {
 const { dispatch } = useContext(RouterStateContext);

 const navigate = useCallback((url) => {
   dispatch({ type: 'navigate', url });
 }, [dispatch]);

 const goBack = useCallback(() => {
   dispatch({ type: 'back' });
 }, [dispatch]);

 return {
   navigate,
   goBack,
 };
}
This ensures that the consumers of your Hook can optimize their own code when needed.

Troubleshooting 
Every time my component renders, useCallback returns a different function 
Make sure you’ve specified the dependency array as a second argument!
If you forget the dependency array, useCallback will return a new function every time:
function ProductPage({ productId, referrer }) {
 const handleSubmit = useCallback((orderDetails) => {
   post('/product/' + productId + '/buy', {
     referrer,
     orderDetails,
   });
 }); // 🔴 Returns a new function every time: no dependency array
 // ...
This is the corrected version passing the dependency array as a second argument:
function ProductPage({ productId, referrer }) {
 const handleSubmit = useCallback((orderDetails) => {
   post('/product/' + productId + '/buy', {
     referrer,
     orderDetails,
   });
 }, [productId, referrer]); // ✅ Does not return a new function unnecessarily
 // ...
If this doesn’t help, then the problem is that at least one of your dependencies is different from the previous render. You can debug this problem by manually logging your dependencies to the console:
 const handleSubmit = useCallback((orderDetails) => {
   // ..
 }, [productId, referrer]);

 console.log([productId, referrer]);
You can then right-click on the arrays from different re-renders in the console and select “Store as a global variable” for both of them. Assuming the first one got saved as temp1 and the second one got saved as temp2, you can then use the browser console to check whether each dependency in both arrays is the same:
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
When you find which dependency is breaking memoization, either find a way to remove it, or memoize it as well.

I need to call useCallback for each list item in a loop, but it’s not allowed 
Suppose the Chart component is wrapped in memo. You want to skip re-rendering every Chart in the list when the ReportList component re-renders. However, you can’t call useCallback in a loop:
function ReportList({ items }) {
 return (
   <article>
     {items.map(item => {
       // 🔴 You can't call useCallback in a loop like this:
       const handleClick = useCallback(() => {
         sendReport(item)
       }, [item]);

       return (
         <figure key={item.id}>
           <Chart onClick={handleClick} />
         </figure>
       );
     })}
   </article>
 );
}
Instead, extract a component for an individual item, and put useCallback there:
function ReportList({ items }) {
 return (
   <article>
     {items.map(item =>
       <Report key={item.id} item={item} />
     )}
   </article>
 );
}

function Report({ item }) {
 // ✅ Call useCallback at the top level:
 const handleClick = useCallback(() => {
   sendReport(item)
 }, [item]);

 return (
   <figure>
     <Chart onClick={handleClick} />
   </figure>
 );
}
Alternatively, you could remove useCallback in the last snippet and instead wrap Report itself in memo. If the item prop does not change, Report will skip re-rendering, so Chart will skip re-rendering too:
function ReportList({ items }) {
 // ...
}

const Report = memo(function Report({ item }) {
 function handleClick() {
   sendReport(item);
 }

 return (
   <figure>
     <Chart onClick={handleClick} />
   </figure>
 );
});
PrevioususeActionState
NextuseContext

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
useCallback(fn, dependencies)
Usage
Skipping re-rendering of components
Updating state from a memoized callback
Preventing an Effect from firing too often
Optimizing a custom Hook
Troubleshooting
Every time my component renders, useCallback returns a different function
I need to call useCallback for each list item in a loop, but it’s not allowed
useCallback – React
useContext
useContext is a React Hook that lets you read and subscribe to context from your component.
const value = useContext(SomeContext)
Reference
useContext(SomeContext)
Usage
Passing data deeply into the tree
Updating data passed via context
Specifying a fallback default value
Overriding context for a part of the tree
Optimizing re-renders when passing objects and functions
Troubleshooting
My component doesn’t see the value from my provider
I am always getting undefined from my context although the default value is different

Reference 
useContext(SomeContext) 
Call useContext at the top level of your component to read and subscribe to context.
import { useContext } from 'react';

function MyComponent() {
 const theme = useContext(ThemeContext);
 // ...
See more examples below.
Parameters 
SomeContext: The context that you’ve previously created with createContext. The context itself does not hold the information, it only represents the kind of information you can provide or read from components.
Returns 
useContext returns the context value for the calling component. It is determined as the value passed to the closest SomeContext above the calling component in the tree. If there is no such provider, then the returned value will be the defaultValue you have passed to createContext for that context. The returned value is always up-to-date. React automatically re-renders components that read some context if it changes.
Caveats 
useContext() call in a component is not affected by providers returned from the same component. The corresponding <Context> needs to be above the component doing the useContext() call.
React automatically re-renders all the children that use a particular context starting from the provider that receives a different value. The previous and the next values are compared with the Object.is comparison. Skipping re-renders with memo does not prevent the children receiving fresh context values.
If your build system produces duplicates modules in the output (which can happen with symlinks), this can break context. Passing something via context only works if SomeContext that you use to provide context and SomeContext that you use to read it are exactly the same object, as determined by a === comparison.

Usage 
Passing data deeply into the tree 
Call useContext at the top level of your component to read and subscribe to context.
import { useContext } from 'react';

function Button() {
 const theme = useContext(ThemeContext);
 // ...
useContext returns the context value for the context you passed. To determine the context value, React searches the component tree and finds the closest context provider above for that particular context.
To pass context to a Button, wrap it or one of its parent components into the corresponding context provider:
function MyPage() {
 return (
   <ThemeContext value="dark">
     <Form />
   </ThemeContext>
 );
}

function Form() {
 // ... renders buttons inside ...
}
It doesn’t matter how many layers of components there are between the provider and the Button. When a Button anywhere inside of Form calls useContext(ThemeContext), it will receive "dark" as the value.
Pitfall
useContext() always looks for the closest provider above the component that calls it. It searches upwards and does not consider providers in the component from which you’re calling useContext().
App.js
DownloadReset
Fork
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

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


Show more

Updating data passed via context 
Often, you’ll want the context to change over time. To update context, combine it with state. Declare a state variable in the parent component, and pass the current state down as the context value to the provider.
function MyPage() {
 const [theme, setTheme] = useState('dark');
 return (
   <ThemeContext value={theme}>
     <Form />
     <Button onClick={() => {
       setTheme('light');
     }}>
       Switch to light theme
     </Button>
   </ThemeContext>
 );
}
Now any Button inside of the provider will receive the current theme value. If you call setTheme to update the theme value that you pass to the provider, all Button components will re-render with the new 'light' value.
Examples of updating context
1. Updating a value via context2. Updating an object via context3. Multiple contexts4. Extracting providers to a component5. Scaling up with context and a reducer
Example 1 of 5: Updating a value via context 
In this example, the MyApp component holds a state variable which is then passed to the ThemeContext provider. Checking the “Dark mode” checkbox updates the state. Changing the provided value re-renders all the components using that context.
App.js
DownloadReset
Fork
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </ThemeContext>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

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


Show more
Note that value="dark" passes the "dark" string, but value={theme} passes the value of the JavaScript theme variable with JSX curly braces. Curly braces also let you pass context values that aren’t strings.
Next Example

Specifying a fallback default value 
If React can’t find any providers of that particular context in the parent tree, the context value returned by useContext() will be equal to the default value that you specified when you created that context:
const ThemeContext = createContext(null);
The default value never changes. If you want to update context, use it with state as described above.
Often, instead of null, there is some more meaningful value you can use as a default, for example:
const ThemeContext = createContext('light');
This way, if you accidentally render some component without a corresponding provider, it won’t break. This also helps your components work well in a test environment without setting up a lot of providers in the tests.
In the example below, the “Toggle theme” button is always light because it’s outside any theme context provider and the default context theme value is 'light'. Try editing the default theme to be 'dark'.
App.js
DownloadReset
Fork
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext value={theme}>
        <Form />
      </ThemeContext>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Toggle theme
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

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

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}


Show more

Overriding context for a part of the tree 
You can override the context for a part of the tree by wrapping that part in a provider with a different value.
<ThemeContext value="dark">
 ...
 <ThemeContext value="light">
   <Footer />
 </ThemeContext>
 ...
</ThemeContext>
You can nest and override providers as many times as you need.
Examples of overriding context
1. Overriding a theme2. Automatically nested headings
Example 1 of 2: Overriding a theme 
Here, the button inside the Footer receives a different context value ("light") than the buttons outside ("dark").
App.js
DownloadReset
Fork
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext value="light">
        <Footer />
      </ThemeContext>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Settings</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
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


Show more
Next Example

Optimizing re-renders when passing objects and functions 
You can pass any values via context, including objects and functions.
function MyApp() {
 const [currentUser, setCurrentUser] = useState(null);

 function login(response) {
   storeCredentials(response.credentials);
   setCurrentUser(response.user);
 }

 return (
   <AuthContext value={{ currentUser, login }}>
     <Page />
   </AuthContext>
 );
}
Here, the context value is a JavaScript object with two properties, one of which is a function. Whenever MyApp re-renders (for example, on a route update), this will be a different object pointing at a different function, so React will also have to re-render all components deep in the tree that call useContext(AuthContext).
In smaller apps, this is not a problem. However, there is no need to re-render them if the underlying data, like currentUser, has not changed. To help React take advantage of that fact, you may wrap the login function with useCallback and wrap the object creation into useMemo. This is a performance optimization:
import { useCallback, useMemo } from 'react';

function MyApp() {
 const [currentUser, setCurrentUser] = useState(null);

 const login = useCallback((response) => {
   storeCredentials(response.credentials);
   setCurrentUser(response.user);
 }, []);

 const contextValue = useMemo(() => ({
   currentUser,
   login
 }), [currentUser, login]);

 return (
   <AuthContext value={contextValue}>
     <Page />
   </AuthContext>
 );
}
As a result of this change, even if MyApp needs to re-render, the components calling useContext(AuthContext) won’t need to re-render unless currentUser has changed.
Read more about useMemo and useCallback.

Troubleshooting 
My component doesn’t see the value from my provider 
There are a few common ways that this can happen:
You’re rendering <SomeContext> in the same component (or below) as where you’re calling useContext(). Move <SomeContext> above and outside the component calling useContext().
You may have forgotten to wrap your component with <SomeContext>, or you might have put it in a different part of the tree than you thought. Check whether the hierarchy is right using React DevTools.
You might be running into some build issue with your tooling that causes SomeContext as seen from the providing component and SomeContext as seen by the reading component to be two different objects. This can happen if you use symlinks, for example. You can verify this by assigning them to globals like window.SomeContext1 and window.SomeContext2 and then checking whether window.SomeContext1 === window.SomeContext2 in the console. If they’re not the same, fix that issue on the build tool level.
I am always getting undefined from my context although the default value is different 
You might have a provider without a value in the tree:
// 🚩 Doesn't work: no value prop
<ThemeContext>
  <Button />
</ThemeContext>
If you forget to specify value, it’s like passing value={undefined}.
You may have also mistakingly used a different prop name by mistake:
// 🚩 Doesn't work: prop should be called "value"
<ThemeContext theme={theme}>
  <Button />
</ThemeContext>
In both of these cases you should see a warning from React in the console. To fix them, call the prop value:
// ✅ Passing the value prop
<ThemeContext value={theme}>
  <Button />
</ThemeContext>
Note that the default value from your createContext(defaultValue) call is only used if there is no matching provider above at all. If there is a <SomeContext value={undefined}> component somewhere in the parent tree, the component calling useContext(SomeContext) will receive undefined as the context value.
PrevioususeCallback
NextuseDebugValue

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
useContext(SomeContext)
Usage
Passing data deeply into the tree
Updating data passed via context
Specifying a fallback default value
Overriding context for a part of the tree
Optimizing re-renders when passing objects and functions
Troubleshooting
My component doesn’t see the value from my provider
I am always getting undefined from my context although the default value is different
useContext – React
useDebugValue
useDebugValue is a React Hook that lets you add a label to a custom Hook in React DevTools.
useDebugValue(value, format?)
Reference
useDebugValue(value, format?)
Usage
Adding a label to a custom Hook
Deferring formatting of a debug value

Reference 
useDebugValue(value, format?) 
Call useDebugValue at the top level of your custom Hook to display a readable debug value:
import { useDebugValue } from 'react';

function useOnlineStatus() {
 // ...
 useDebugValue(isOnline ? 'Online' : 'Offline');
 // ...
}
See more examples below.
Parameters 
value: The value you want to display in React DevTools. It can have any type.
optional format: A formatting function. When the component is inspected, React DevTools will call the formatting function with the value as the argument, and then display the returned formatted value (which may have any type). If you don’t specify the formatting function, the original value itself will be displayed.
Returns 
useDebugValue does not return anything.
Usage 
Adding a label to a custom Hook 
Call useDebugValue at the top level of your custom Hook to display a readable debug value for React DevTools.
import { useDebugValue } from 'react';

function useOnlineStatus() {
 // ...
 useDebugValue(isOnline ? 'Online' : 'Offline');
 // ...
}
This gives components calling useOnlineStatus a label like OnlineStatus: "Online" when you inspect them:

Without the useDebugValue call, only the underlying data (in this example, true) would be displayed.
App.jsuseOnlineStatus.js
Reset
Fork
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}


Show more
Note
Don’t add debug values to every custom Hook. It’s most valuable for custom Hooks that are part of shared libraries and that have a complex internal data structure that’s difficult to inspect.

Deferring formatting of a debug value 
You can also pass a formatting function as the second argument to useDebugValue:
useDebugValue(date, date => date.toDateString());
Your formatting function will receive the debug value as a parameter and should return a formatted display value. When your component is inspected, React DevTools will call this function and display its result.
This lets you avoid running potentially expensive formatting logic unless the component is actually inspected. For example, if date is a Date value, this avoids calling toDateString() on it for every render.
PrevioususeContext
NextuseDeferredValue

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
useDebugValue(value, format?)
Usage
Adding a label to a custom Hook
Deferring formatting of a debug value
useDebugValue – React
useDeferredValue
useDeferredValue is a React Hook that lets you defer updating a part of the UI.
const deferredValue = useDeferredValue(value)
Reference
useDeferredValue(value, initialValue?)
Usage
Showing stale content while fresh content is loading
Indicating that the content is stale
Deferring re-rendering for a part of the UI

Reference 
useDeferredValue(value, initialValue?) 
Call useDeferredValue at the top level of your component to get a deferred version of that value.
import { useState, useDeferredValue } from 'react';

function SearchPage() {
 const [query, setQuery] = useState('');
 const deferredQuery = useDeferredValue(query);
 // ...
}
See more examples below.
Parameters 
value: The value you want to defer. It can have any type.
optional initialValue: A value to use during the initial render of a component. If this option is omitted, useDeferredValue will not defer during the initial render, because there’s no previous version of value that it can render instead.
Returns 
currentValue: During the initial render, the returned deferred value will be the initialValue, or the same as the value you provided. During updates, React will first attempt a re-render with the old value (so it will return the old value), and then try another re-render in the background with the new value (so it will return the updated value).
Caveats 
When an update is inside a Transition, useDeferredValue always returns the new value and does not spawn a deferred render, since the update is already deferred.
The values you pass to useDeferredValue should either be primitive values (like strings and numbers) or objects created outside of rendering. If you create a new object during rendering and immediately pass it to useDeferredValue, it will be different on every render, causing unnecessary background re-renders.
When useDeferredValue receives a different value (compared with Object.is), in addition to the current render (when it still uses the previous value), it schedules a re-render in the background with the new value. The background re-render is interruptible: if there’s another update to the value, React will restart the background re-render from scratch. For example, if the user is typing into an input faster than a chart receiving its deferred value can re-render, the chart will only re-render after the user stops typing.
useDeferredValue is integrated with <Suspense>. If the background update caused by a new value suspends the UI, the user will not see the fallback. They will see the old deferred value until the data loads.
useDeferredValue does not by itself prevent extra network requests.
There is no fixed delay caused by useDeferredValue itself. As soon as React finishes the original re-render, React will immediately start working on the background re-render with the new deferred value. Any updates caused by events (like typing) will interrupt the background re-render and get prioritized over it.
The background re-render caused by useDeferredValue does not fire Effects until it’s committed to the screen. If the background re-render suspends, its Effects will run after the data loads and the UI updates.

Usage 
Showing stale content while fresh content is loading 
Call useDeferredValue at the top level of your component to defer updating some part of your UI.
import { useState, useDeferredValue } from 'react';

function SearchPage() {
 const [query, setQuery] = useState('');
 const deferredQuery = useDeferredValue(query);
 // ...
}
During the initial render, the deferred value will be the same as the value you provided.
During updates, the deferred value will “lag behind” the latest value. In particular, React will first re-render without updating the deferred value, and then try to re-render with the newly received value in the background.
Let’s walk through an example to see when this is useful.
Note
This example assumes you use a Suspense-enabled data source:
Data fetching with Suspense-enabled frameworks like Relay and Next.js
Lazy-loading component code with lazy
Reading the value of a Promise with use
Learn more about Suspense and its limitations.
In this example, the SearchResults component suspends while fetching the search results. Try typing "a", waiting for the results, and then editing it to "ab". The results for "a" get replaced by the loading fallback.
App.jsSearchResults.js
Reset
Fork
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}


Show more
A common alternative UI pattern is to defer updating the list of results and to keep showing the previous results until the new results are ready. Call useDeferredValue to pass a deferred version of the query down:
export default function App() {
 const [query, setQuery] = useState('');
 const deferredQuery = useDeferredValue(query);
 return (
   <>
     <label>
       Search albums:
       <input value={query} onChange={e => setQuery(e.target.value)} />
     </label>
     <Suspense fallback={<h2>Loading...</h2>}>
       <SearchResults query={deferredQuery} />
     </Suspense>
   </>
 );
}
The query will update immediately, so the input will display the new value. However, the deferredQuery will keep its previous value until the data has loaded, so SearchResults will show the stale results for a bit.
Enter "a" in the example below, wait for the results to load, and then edit the input to "ab". Notice how instead of the Suspense fallback, you now see the stale result list until the new results have loaded:
App.jsSearchResults.js
Reset
Fork
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}


Show more
Deep Dive
How does deferring a value work under the hood? 
Show Details

Indicating that the content is stale 
In the example above, there is no indication that the result list for the latest query is still loading. This can be confusing to the user if the new results take a while to load. To make it more obvious to the user that the result list does not match the latest query, you can add a visual indication when the stale result list is displayed:
<div style={{
 opacity: query !== deferredQuery ? 0.5 : 1,
}}>
 <SearchResults query={deferredQuery} />
</div>
With this change, as soon as you start typing, the stale result list gets slightly dimmed until the new result list loads. You can also add a CSS transition to delay dimming so that it feels gradual, like in the example below:
App.jsSearchResults.js
Reset
Fork
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}


Show more

Deferring re-rendering for a part of the UI 
You can also apply useDeferredValue as a performance optimization. It is useful when a part of your UI is slow to re-render, there’s no easy way to optimize it, and you want to prevent it from blocking the rest of the UI.
Imagine you have a text field and a component (like a chart or a long list) that re-renders on every keystroke:
function App() {
 const [text, setText] = useState('');
 return (
   <>
     <input value={text} onChange={e => setText(e.target.value)} />
     <SlowList text={text} />
   </>
 );
}
First, optimize SlowList to skip re-rendering when its props are the same. To do this, wrap it in memo:
const SlowList = memo(function SlowList({ text }) {
 // ...
});
However, this only helps if the SlowList props are the same as during the previous render. The problem you’re facing now is that it’s slow when they’re different, and when you actually need to show different visual output.
Concretely, the main performance problem is that whenever you type into the input, the SlowList receives new props, and re-rendering its entire tree makes the typing feel janky. In this case, useDeferredValue lets you prioritize updating the input (which must be fast) over updating the result list (which is allowed to be slower):
function App() {
 const [text, setText] = useState('');
 const deferredText = useDeferredValue(text);
 return (
   <>
     <input value={text} onChange={e => setText(e.target.value)} />
     <SlowList text={deferredText} />
   </>
 );
}
This does not make re-rendering of the SlowList faster. However, it tells React that re-rendering the list can be deprioritized so that it doesn’t block the keystrokes. The list will “lag behind” the input and then “catch up”. Like before, React will attempt to update the list as soon as possible, but will not block the user from typing.
The difference between useDeferredValue and unoptimized re-rendering
1. Deferred re-rendering of the list2. Unoptimized re-rendering of the list
Example 1 of 2: Deferred re-rendering of the list 
In this example, each item in the SlowList component is artificially slowed down so that you can see how useDeferredValue lets you keep the input responsive. Type into the input and notice that typing feels snappy while the list “lags behind” it.
App.jsSlowList.js
Reset
Fork
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}


Next Example
Pitfall
This optimization requires SlowList to be wrapped in memo. This is because whenever the text changes, React needs to be able to re-render the parent component quickly. During that re-render, deferredText still has its previous value, so SlowList is able to skip re-rendering (its props have not changed). Without memo, it would have to re-render anyway, defeating the point of the optimization.
Deep Dive
How is deferring a value different from debouncing and throttling? 
Show Details




PrevioususeDebugValue
NextuseEffect

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
useDeferredValue(value, initialValue?)
Usage
Showing stale content while fresh content is loading
Indicating that the content is stale
Deferring re-rendering for a part of the UI
useDeferredValue – React
API Reference
Hooks
useEffect
useEffect is a React Hook that lets you synchronize a component with an external system.
useEffect(setup, dependencies?)
Reference
useEffect(setup, dependencies?)
Usage
Connecting to an external system
Wrapping Effects in custom Hooks
Controlling a non-React widget
Fetching data with Effects
Specifying reactive dependencies
Updating state based on previous state from an Effect
Removing unnecessary object dependencies
Removing unnecessary function dependencies
Reading the latest props and state from an Effect
Displaying different content on the server and the client
Troubleshooting
My Effect runs twice when the component mounts
My Effect runs after every re-render
My Effect keeps re-running in an infinite cycle
My cleanup logic runs even though my component didn’t unmount
My Effect does something visual, and I see a flicker before it runs

Reference 
useEffect(setup, dependencies?) 
Call useEffect at the top level of your component to declare an Effect:
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

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
See more examples below.
Parameters 
setup: The function with your Effect’s logic. Your setup function may also optionally return a cleanup function. When your component is added to the DOM, React will run your setup function. After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. After your component is removed from the DOM, React will run your cleanup function.
optional dependencies: The list of all reactive values referenced inside of the setup code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is configured for React, it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like [dep1, dep2, dep3]. React will compare each dependency with its previous value using the Object.is comparison. If you omit this argument, your Effect will re-run after every re-render of the component. See the difference between passing an array of dependencies, an empty array, and no dependencies at all.
Returns 
useEffect returns undefined.
Caveats 
useEffect is a Hook, so you can only call it at the top level of your component or your own Hooks. You can’t call it inside loops or conditions. If you need that, extract a new component and move the state into it.
If you’re not trying to synchronize with some external system, you probably don’t need an Effect.
When Strict Mode is on, React will run one extra development-only setup+cleanup cycle before the first real setup. This is a stress-test that ensures that your cleanup logic “mirrors” your setup logic and that it stops or undoes whatever the setup is doing. If this causes a problem, implement the cleanup function.
If some of your dependencies are objects or functions defined inside the component, there is a risk that they will cause the Effect to re-run more often than needed. To fix this, remove unnecessary object and function dependencies. You can also extract state updates and non-reactive logic outside of your Effect.
If your Effect wasn’t caused by an interaction (like a click), React will generally let the browser paint the updated screen first before running your Effect. If your Effect is doing something visual (for example, positioning a tooltip), and the delay is noticeable (for example, it flickers), replace useEffect with useLayoutEffect.
If your Effect is caused by an interaction (like a click), React may run your Effect before the browser paints the updated screen. This ensures that the result of the Effect can be observed by the event system. Usually, this works as expected. However, if you must defer the work until after paint, such as an alert(), you can use setTimeout. See reactwg/react-18/128 for more information.
Even if your Effect was caused by an interaction (like a click), React may allow the browser to repaint the screen before processing the state updates inside your Effect. Usually, this works as expected. However, if you must block the browser from repainting the screen, you need to replace useEffect with useLayoutEffect.
Effects only run on the client. They don’t run during server rendering.

Usage 
Connecting to an external system 
Some components need to stay connected to the network, some browser API, or a third-party library, while they are displayed on the page. These systems aren’t controlled by React, so they are called external.
To connect your component to some external system, call useEffect at the top level of your component:
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

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
You need to pass two arguments to useEffect:
A setup function with setup code that connects to that system.
It should return a cleanup function with cleanup code that disconnects from that system.
A list of dependencies including every value from your component used inside of those functions.
React calls your setup and cleanup functions whenever it’s necessary, which may happen multiple times:
Your setup code runs when your component is added to the page (mounts).
After every re-render of your component where the dependencies have changed:
First, your cleanup code runs with the old props and state.
Then, your setup code runs with the new props and state.
Your cleanup code runs one final time after your component is removed from the page (unmounts).
Let’s illustrate this sequence for the example above.
When the ChatRoom component above gets added to the page, it will connect to the chat room with the initial serverUrl and roomId. If either serverUrl or roomId change as a result of a re-render (say, if the user picks a different chat room in a dropdown), your Effect will disconnect from the previous room, and connect to the next one. When the ChatRoom component is removed from the page, your Effect will disconnect one last time.
To help you find bugs, in development React runs setup and cleanup one extra time before the setup. This is a stress-test that verifies your Effect’s logic is implemented correctly. If this causes visible issues, your cleanup function is missing some logic. The cleanup function should stop or undo whatever the setup function was doing. The rule of thumb is that the user shouldn’t be able to distinguish between the setup being called once (as in production) and a setup → cleanup → setup sequence (as in development). See common solutions.
Try to write every Effect as an independent process and think about a single setup/cleanup cycle at a time. It shouldn’t matter whether your component is mounting, updating, or unmounting. When your cleanup logic correctly “mirrors” the setup logic, your Effect is resilient to running setup and cleanup as often as needed.
Note
An Effect lets you keep your component synchronized with some external system (like a chat service). Here, external system means any piece of code that’s not controlled by React, such as:
A timer managed with setInterval() and clearInterval().
An event subscription using window.addEventListener() and window.removeEventListener().
A third-party animation library with an API like animation.start() and animation.reset().
If you’re not connecting to any external system, you probably don’t need an Effect.
Examples of connecting to an external system
1. Connecting to a chat server2. Listening to a global browser event3. Triggering an animation4. Controlling a modal dialog5. Tracking element visibility
Example 1 of 5: Connecting to a chat server 
In this example, the ChatRoom component uses an Effect to stay connected to an external system defined in chat.js. Press “Open chat” to make the ChatRoom component appear. This sandbox runs in development mode, so there is an extra connect-and-disconnect cycle, as explained here. Try changing the roomId and serverUrl using the dropdown and the input, and see how the Effect re-connects to the chat. Press “Close chat” to see the Effect disconnect one last time.
App.jschat.js
Reset
Fork
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
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

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}


Show more
Next Example

Wrapping Effects in custom Hooks 
Effects are an “escape hatch”: you use them when you need to “step outside React” and when there is no better built-in solution for your use case. If you find yourself often needing to manually write Effects, it’s usually a sign that you need to extract some custom Hooks for common behaviors your components rely on.
For example, this useChatRoom custom Hook “hides” the logic of your Effect behind a more declarative API:
function useChatRoom({ serverUrl, roomId }) {
 useEffect(() => {
   const options = {
     serverUrl: serverUrl,
     roomId: roomId
   };
   const connection = createConnection(options);
   connection.connect();
   return () => connection.disconnect();
 }, [roomId, serverUrl]);
}
Then you can use it from any component like this:
function ChatRoom({ roomId }) {
 const [serverUrl, setServerUrl] = useState('https://localhost:1234');

 useChatRoom({
   roomId: roomId,
   serverUrl: serverUrl
 });
 // ...
There are also many excellent custom Hooks for every purpose available in the React ecosystem.
Learn more about wrapping Effects in custom Hooks.
Examples of wrapping Effects in custom Hooks
1. Custom useChatRoom Hook2. Custom useWindowListener Hook3. Custom useIntersectionObserver Hook
Example 1 of 3: Custom useChatRoom Hook 
This example is identical to one of the earlier examples, but the logic is extracted to a custom Hook.
App.jsuseChatRoom.jschat.js
Reset
Fork
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

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

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}


Show more
Next Example

Controlling a non-React widget 
Sometimes, you want to keep an external system synchronized to some prop or state of your component.
For example, if you have a third-party map widget or a video player component written without React, you can use an Effect to call methods on it that make its state match the current state of your React component. This Effect creates an instance of a MapWidget class defined in map-widget.js. When you change the zoomLevel prop of the Map component, the Effect calls the setZoom() on the class instance to keep it synchronized:
App.jsMap.jsmap-widget.js
Reset
Fork
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}


Show more
In this example, a cleanup function is not needed because the MapWidget class manages only the DOM node that was passed to it. After the Map React component is removed from the tree, both the DOM node and the MapWidget class instance will be automatically garbage-collected by the browser JavaScript engine.

Fetching data with Effects 
You can use an Effect to fetch data for your component. Note that if you use a framework, using your framework’s data fetching mechanism will be a lot more efficient than writing Effects manually.
If you want to fetch data from an Effect manually, your code might look like this:
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
 const [person, setPerson] = useState('Alice');
 const [bio, setBio] = useState(null);

 useEffect(() => {
   let ignore = false;
   setBio(null);
   fetchBio(person).then(result => {
     if (!ignore) {
       setBio(result);
     }
   });
   return () => {
     ignore = true;
   };
 }, [person]);

 // ...
Note the ignore variable which is initialized to false, and is set to true during cleanup. This ensures your code doesn’t suffer from “race conditions”: network responses may arrive in a different order than you sent them.
App.js
Reset
Fork
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}


Show more
You can also rewrite using the async / await syntax, but you still need to provide a cleanup function:
App.js
Reset
Fork
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}


Show more
Writing data fetching directly in Effects gets repetitive and makes it difficult to add optimizations like caching and server rendering later. It’s easier to use a custom Hook—either your own or maintained by the community.
Deep Dive
What are good alternatives to data fetching in Effects? 
Show Details













Specifying reactive dependencies 
Notice that you can’t “choose” the dependencies of your Effect. Every reactive value used by your Effect’s code must be declared as a dependency. Your Effect’s dependency list is determined by the surrounding code:
function ChatRoom({ roomId }) { // This is a reactive value
 const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // This is a reactive value too

 useEffect(() => {
   const connection = createConnection(serverUrl, roomId); // This Effect reads these reactive values
   connection.connect();
   return () => connection.disconnect();
 }, [serverUrl, roomId]); // ✅ So you must specify them as dependencies of your Effect
 // ...
}
If either serverUrl or roomId change, your Effect will reconnect to the chat using the new values.
Reactive values include props and all variables and functions declared directly inside of your component. Since roomId and serverUrl are reactive values, you can’t remove them from the dependencies. If you try to omit them and your linter is correctly configured for React, the linter will flag this as a mistake you need to fix:
function ChatRoom({ roomId }) {
 const [serverUrl, setServerUrl] = useState('https://localhost:1234');

 useEffect(() => {
   const connection = createConnection(serverUrl, roomId);
   connection.connect();
   return () => connection.disconnect();
 }, []); // 🔴 React Hook useEffect has missing dependencies: 'roomId' and 'serverUrl'
 // ...
}
To remove a dependency, you need to “prove” to the linter that it doesn’t need to be a dependency. For example, you can move serverUrl out of your component to prove that it’s not reactive and won’t change on re-renders:
const serverUrl = 'https://localhost:1234'; // Not a reactive value anymore

function ChatRoom({ roomId }) {
 useEffect(() => {
   const connection = createConnection(serverUrl, roomId);
   connection.connect();
   return () => connection.disconnect();
 }, [roomId]); // ✅ All dependencies declared
 // ...
}
Now that serverUrl is not a reactive value (and can’t change on a re-render), it doesn’t need to be a dependency. If your Effect’s code doesn’t use any reactive values, its dependency list should be empty ([]):
const serverUrl = 'https://localhost:1234'; // Not a reactive value anymore
const roomId = 'music'; // Not a reactive value anymore

function ChatRoom() {
 useEffect(() => {
   const connection = createConnection(serverUrl, roomId);
   connection.connect();
   return () => connection.disconnect();
 }, []); // ✅ All dependencies declared
 // ...
}
An Effect with empty dependencies doesn’t re-run when any of your component’s props or state change.
Pitfall
If you have an existing codebase, you might have some Effects that suppress the linter like this:
useEffect(() => {
 // ...
 // 🔴 Avoid suppressing the linter like this:
 // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
When dependencies don’t match the code, there is a high risk of introducing bugs. By suppressing the linter, you “lie” to React about the values your Effect depends on. Instead, prove they’re unnecessary.
Examples of passing reactive dependencies
1. Passing a dependency array2. Passing an empty dependency array3. Passing no dependency array at all
Example 1 of 3: Passing a dependency array 
If you specify the dependencies, your Effect runs after the initial render and after re-renders with changed dependencies.
useEffect(() => {
 // ...
}, [a, b]); // Runs again if a or b are different
In the below example, serverUrl and roomId are reactive values, so they both must be specified as dependencies. As a result, selecting a different room in the dropdown or editing the server URL input causes the chat to re-connect. However, since message isn’t used in the Effect (and so it isn’t a dependency), editing the message doesn’t re-connect to the chat.
App.jschat.js
Reset
Fork
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

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
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}


Show more
Next Example

Updating state based on previous state from an Effect 
When you want to update state based on previous state from an Effect, you might run into a problem:
function Counter() {
 const [count, setCount] = useState(0);

 useEffect(() => {
   const intervalId = setInterval(() => {
     setCount(count + 1); // You want to increment the counter every second...
   }, 1000)
   return () => clearInterval(intervalId);
 }, [count]); // 🚩 ... but specifying `count` as a dependency always resets the interval.
 // ...
}
Since count is a reactive value, it must be specified in the list of dependencies. However, that causes the Effect to cleanup and setup again every time the count changes. This is not ideal.
To fix this, pass the c => c + 1 state updater to setCount:
App.js
DownloadReset
Fork
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Pass a state updater
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Now count is not a dependency

  return <h1>{count}</h1>;
}


Now that you’re passing c => c + 1 instead of count + 1, your Effect no longer needs to depend on count. As a result of this fix, it won’t need to cleanup and setup the interval again every time the count changes.

Removing unnecessary object dependencies 
If your Effect depends on an object or a function created during rendering, it might run too often. For example, this Effect re-connects after every render because the options object is different for every render:
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
 const [message, setMessage] = useState('');

 const options = { // 🚩 This object is created from scratch on every re-render
   serverUrl: serverUrl,
   roomId: roomId
 };

 useEffect(() => {
   const connection = createConnection(options); // It's used inside the Effect
   connection.connect();
   return () => connection.disconnect();
 }, [options]); // 🚩 As a result, these dependencies are always different on a re-render
 // ...
Avoid using an object created during rendering as a dependency. Instead, create the object inside the Effect:
App.jschat.js
Reset
Fork
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}


Show more
Now that you create the options object inside the Effect, the Effect itself only depends on the roomId string.
With this fix, typing into the input doesn’t reconnect the chat. Unlike an object which gets re-created, a string like roomId doesn’t change unless you set it to another value. Read more about removing dependencies.

Removing unnecessary function dependencies 
If your Effect depends on an object or a function created during rendering, it might run too often. For example, this Effect re-connects after every render because the createOptions function is different for every render:
function ChatRoom({ roomId }) {
 const [message, setMessage] = useState('');

 function createOptions() { // 🚩 This function is created from scratch on every re-render
   return {
     serverUrl: serverUrl,
     roomId: roomId
   };
 }

 useEffect(() => {
   const options = createOptions(); // It's used inside the Effect
   const connection = createConnection();
   connection.connect();
   return () => connection.disconnect();
 }, [createOptions]); // 🚩 As a result, these dependencies are always different on a re-render
 // ...
By itself, creating a function from scratch on every re-render is not a problem. You don’t need to optimize that. However, if you use it as a dependency of your Effect, it will cause your Effect to re-run after every re-render.
Avoid using a function created during rendering as a dependency. Instead, declare it inside the Effect:
App.jschat.js
Reset
Fork
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}


Show more
Now that you define the createOptions function inside the Effect, the Effect itself only depends on the roomId string. With this fix, typing into the input doesn’t reconnect the chat. Unlike a function which gets re-created, a string like roomId doesn’t change unless you set it to another value. Read more about removing dependencies.

Reading the latest props and state from an Effect 
Under Construction
This section describes an experimental API that has not yet been released in a stable version of React.
By default, when you read a reactive value from an Effect, you have to add it as a dependency. This ensures that your Effect “reacts” to every change of that value. For most dependencies, that’s the behavior you want.
However, sometimes you’ll want to read the latest props and state from an Effect without “reacting” to them. For example, imagine you want to log the number of the items in the shopping cart for every page visit:
function Page({ url, shoppingCart }) {
 useEffect(() => {
   logVisit(url, shoppingCart.length);
 }, [url, shoppingCart]); // ✅ All dependencies declared
 // ...
}
What if you want to log a new page visit after every url change, but not if only the shoppingCart changes? You can’t exclude shoppingCart from dependencies without breaking the reactivity rules. However, you can express that you don’t want a piece of code to “react” to changes even though it is called from inside an Effect. Declare an Effect Event with the useEffectEvent Hook, and move the code reading shoppingCart inside of it:
function Page({ url, shoppingCart }) {
 const onVisit = useEffectEvent(visitedUrl => {
   logVisit(visitedUrl, shoppingCart.length)
 });

 useEffect(() => {
   onVisit(url);
 }, [url]); // ✅ All dependencies declared
 // ...
}
Effect Events are not reactive and must always be omitted from dependencies of your Effect. This is what lets you put non-reactive code (where you can read the latest value of some props and state) inside of them. By reading shoppingCart inside of onVisit, you ensure that shoppingCart won’t re-run your Effect.
Read more about how Effect Events let you separate reactive and non-reactive code.

Displaying different content on the server and the client 
If your app uses server rendering (either directly or via a framework), your component will render in two different environments. On the server, it will render to produce the initial HTML. On the client, React will run the rendering code again so that it can attach your event handlers to that HTML. This is why, for hydration to work, your initial render output must be identical on the client and the server.
In rare cases, you might need to display different content on the client. For example, if your app reads some data from localStorage, it can’t possibly do that on the server. Here is how you could implement this:
function MyComponent() {
 const [didMount, setDidMount] = useState(false);

 useEffect(() => {
   setDidMount(true);
 }, []);

 if (didMount) {
   // ... return client-only JSX ...
 }  else {
   // ... return initial JSX ...
 }
}
While the app is loading, the user will see the initial render output. Then, when it’s loaded and hydrated, your Effect will run and set didMount to true, triggering a re-render. This will switch to the client-only render output. Effects don’t run on the server, so this is why didMount was false during the initial server render.
Use this pattern sparingly. Keep in mind that users with a slow connection will see the initial content for quite a bit of time—potentially, many seconds—so you don’t want to make jarring changes to your component’s appearance. In many cases, you can avoid the need for this by conditionally showing different things with CSS.

Troubleshooting 
My Effect runs twice when the component mounts 
When Strict Mode is on, in development, React runs setup and cleanup one extra time before the actual setup.
This is a stress-test that verifies your Effect’s logic is implemented correctly. If this causes visible issues, your cleanup function is missing some logic. The cleanup function should stop or undo whatever the setup function was doing. The rule of thumb is that the user shouldn’t be able to distinguish between the setup being called once (as in production) and a setup → cleanup → setup sequence (as in development).
Read more about how this helps find bugs and how to fix your logic.

My Effect runs after every re-render 
First, check that you haven’t forgotten to specify the dependency array:
useEffect(() => {
 // ...
}); // 🚩 No dependency array: re-runs after every render!
If you’ve specified the dependency array but your Effect still re-runs in a loop, it’s because one of your dependencies is different on every re-render.
You can debug this problem by manually logging your dependencies to the console:
 useEffect(() => {
   // ..
 }, [serverUrl, roomId]);

 console.log([serverUrl, roomId]);
You can then right-click on the arrays from different re-renders in the console and select “Store as a global variable” for both of them. Assuming the first one got saved as temp1 and the second one got saved as temp2, you can then use the browser console to check whether each dependency in both arrays is the same:
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
When you find the dependency that is different on every re-render, you can usually fix it in one of these ways:
Updating state based on previous state from an Effect
Removing unnecessary object dependencies
Removing unnecessary function dependencies
Reading the latest props and state from an Effect
As a last resort (if these methods didn’t help), wrap its creation with useMemo or useCallback (for functions).

My Effect keeps re-running in an infinite cycle 
If your Effect runs in an infinite cycle, these two things must be true:
Your Effect is updating some state.
That state leads to a re-render, which causes the Effect’s dependencies to change.
Before you start fixing the problem, ask yourself whether your Effect is connecting to some external system (like DOM, network, a third-party widget, and so on). Why does your Effect need to set state? Does it synchronize with that external system? Or are you trying to manage your application’s data flow with it?
If there is no external system, consider whether removing the Effect altogether would simplify your logic.
If you’re genuinely synchronizing with some external system, think about why and under what conditions your Effect should update the state. Has something changed that affects your component’s visual output? If you need to keep track of some data that isn’t used by rendering, a ref (which doesn’t trigger re-renders) might be more appropriate. Verify your Effect doesn’t update the state (and trigger re-renders) more than needed.
Finally, if your Effect is updating the state at the right time, but there is still a loop, it’s because that state update leads to one of the Effect’s dependencies changing. Read how to debug dependency changes.

My cleanup logic runs even though my component didn’t unmount 
The cleanup function runs not only during unmount, but before every re-render with changed dependencies. Additionally, in development, React runs setup+cleanup one extra time immediately after component mounts.
If you have cleanup code without corresponding setup code, it’s usually a code smell:
useEffect(() => {
 // 🔴 Avoid: Cleanup logic without corresponding setup logic
 return () => {
   doSomething();
 };
}, []);
Your cleanup logic should be “symmetrical” to the setup logic, and should stop or undo whatever setup did:
 useEffect(() => {
   const connection = createConnection(serverUrl, roomId);
   connection.connect();
   return () => {
     connection.disconnect();
   };
 }, [serverUrl, roomId]);
Learn how the Effect lifecycle is different from the component’s lifecycle.

My Effect does something visual, and I see a flicker before it runs 
If your Effect must block the browser from painting the screen, replace useEffect with useLayoutEffect. Note that this shouldn’t be needed for the vast majority of Effects. You’ll only need this if it’s crucial to run your Effect before the browser paint: for example, to measure and position a tooltip before the user sees it.
PrevioususeDeferredValue
NextuseId

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
useEffect(setup, dependencies?)
Usage
Connecting to an external system
Wrapping Effects in custom Hooks
Controlling a non-React widget
Fetching data with Effects
Specifying reactive dependencies
Updating state based on previous state from an Effect
Removing unnecessary object dependencies
Removing unnecessary function dependencies
Reading the latest props and state from an Effect
Displaying different content on the server and the client
Troubleshooting
My Effect runs twice when the component mounts
My Effect runs after every re-render
My Effect keeps re-running in an infinite cycle
My cleanup logic runs even though my component didn’t unmount
My Effect does something visual, and I see a flicker before it runs
useEffect – React
useId
useId is a React Hook for generating unique IDs that can be passed to accessibility attributes.
const id = useId()
Reference
useId()
Usage
Generating unique IDs for accessibility attributes
Generating IDs for several related elements
Specifying a shared prefix for all generated IDs
Using the same ID prefix on the client and the server

Reference 
useId() 
Call useId at the top level of your component to generate a unique ID:
import { useId } from 'react';

function PasswordField() {
 const passwordHintId = useId();
 // ...
See more examples below.
Parameters 
useId does not take any parameters.
Returns 
useId returns a unique ID string associated with this particular useId call in this particular component.
Caveats 
useId is a Hook, so you can only call it at the top level of your component or your own Hooks. You can’t call it inside loops or conditions. If you need that, extract a new component and move the state into it.
useId should not be used to generate keys in a list. Keys should be generated from your data.
useId currently cannot be used in async Server Components.

Usage 
Pitfall
Do not call useId to generate keys in a list. Keys should be generated from your data.
Generating unique IDs for accessibility attributes 
Call useId at the top level of your component to generate a unique ID:
import { useId } from 'react';

function PasswordField() {
 const passwordHintId = useId();
 // ...
You can then pass the generated ID to different attributes:
<>
 <input type="password" aria-describedby={passwordHintId} />
 <p id={passwordHintId}>
</>
Let’s walk through an example to see when this is useful.
HTML accessibility attributes like aria-describedby let you specify that two tags are related to each other. For example, you can specify that an element (like an input) is described by another element (like a paragraph).
In regular HTML, you would write it like this:
<label>
 Password:
 <input
   type="password"
   aria-describedby="password-hint"
 />
</label>
<p id="password-hint">
 The password should contain at least 18 characters
</p>
However, hardcoding IDs like this is not a good practice in React. A component may be rendered more than once on the page—but IDs have to be unique! Instead of hardcoding an ID, generate a unique ID with useId:
import { useId } from 'react';

function PasswordField() {
 const passwordHintId = useId();
 return (
   <>
     <label>
       Password:
       <input
         type="password"
         aria-describedby={passwordHintId}
       />
     </label>
     <p id={passwordHintId}>
       The password should contain at least 18 characters
     </p>
   </>
 );
}
Now, even if PasswordField appears multiple times on the screen, the generated IDs won’t clash.
App.js
DownloadReset
Fork
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
      <PasswordField />
    </>
  );
}


Show more
Watch this video to see the difference in the user experience with assistive technologies.
Pitfall
With server rendering, useId requires an identical component tree on the server and the client. If the trees you render on the server and the client don’t match exactly, the generated IDs won’t match.
Deep Dive
Why is useId better than an incrementing counter? 
Show Details

Generating IDs for several related elements 
If you need to give IDs to multiple related elements, you can call useId to generate a shared prefix for them:
App.js
DownloadReset
Fork
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}


This lets you avoid calling useId for every single element that needs a unique ID.

Specifying a shared prefix for all generated IDs 
If you render multiple independent React applications on a single page, pass identifierPrefix as an option to your createRoot or hydrateRoot calls. This ensures that the IDs generated by the two different apps never clash because every identifier generated with useId will start with the distinct prefix you’ve specified.
index.jsindex.htmlApp.js
Reset
Fork
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);



Using the same ID prefix on the client and the server 
If you render multiple independent React apps on the same page, and some of these apps are server-rendered, make sure that the identifierPrefix you pass to the hydrateRoot call on the client side is the same as the identifierPrefix you pass to the server APIs such as renderToPipeableStream.
// Server
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(
 <App />,
 { identifierPrefix: 'react-app1' }
);
// Client
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(
 domNode,
 reactNode,
 { identifierPrefix: 'react-app1' }
);
You do not need to pass identifierPrefix if you only have one React app on the page.
PrevioususeEffect
NextuseImperativeHandle

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
useId()
Usage
Generating unique IDs for accessibility attributes
Generating IDs for several related elements
Specifying a shared prefix for all generated IDs
Using the same ID prefix on the client and the server
useId – React
useImperativeHandle
useImperativeHandle is a React Hook that lets you customize the handle exposed as a ref.
useImperativeHandle(ref, createHandle, dependencies?)
Reference
useImperativeHandle(ref, createHandle, dependencies?)
Usage
Exposing a custom ref handle to the parent component
Exposing your own imperative methods

Reference 
useImperativeHandle(ref, createHandle, dependencies?) 
Call useImperativeHandle at the top level of your component to customize the ref handle it exposes:
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
 useImperativeHandle(ref, () => {
   return {
     // ... your methods ...
   };
 }, []);
 // ...
See more examples below.
Parameters 
ref: The ref you received as a prop to the MyInput component.
createHandle: A function that takes no arguments and returns the ref handle you want to expose. That ref handle can have any type. Usually, you will return an object with the methods you want to expose.
optional dependencies: The list of all reactive values referenced inside of the createHandle code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is configured for React, it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like [dep1, dep2, dep3]. React will compare each dependency with its previous value using the Object.is comparison. If a re-render resulted in a change to some dependency, or if you omitted this argument, your createHandle function will re-execute, and the newly created handle will be assigned to the ref.
Note
Starting with React 19, ref is available as a prop. In React 18 and earlier, it was necessary to get the ref from forwardRef.
Returns 
useImperativeHandle returns undefined.

Usage 
Exposing a custom ref handle to the parent component 
To expose a DOM node to the parent element, pass in the ref prop to the node.
function MyInput({ ref }) {
 return <input ref={ref} />;
};
With the code above, a ref to MyInput will receive the <input> DOM node. However, you can expose a custom value instead. To customize the exposed handle, call useImperativeHandle at the top level of your component:
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
 useImperativeHandle(ref, () => {
   return {
     // ... your methods ...
   };
 }, []);

 return <input />;
};
Note that in the code above, the ref is no longer passed to the <input>.
For example, suppose you don’t want to expose the entire <input> DOM node, but you want to expose two of its methods: focus and scrollIntoView. To do this, keep the real browser DOM in a separate ref. Then use useImperativeHandle to expose a handle with only the methods that you want the parent component to call:
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
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

 return <input ref={inputRef} />;
};
Now, if the parent component gets a ref to MyInput, it will be able to call the focus and scrollIntoView methods on it. However, it will not have full access to the underlying <input> DOM node.
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

Exposing your own imperative methods 
The methods you expose via an imperative handle don’t have to match the DOM methods exactly. For example, this Post component exposes a scrollAndFocusAddComment method via an imperative handle. This lets the parent Page scroll the list of comments and focus the input field when you click the button:
App.jsPost.jsCommentList.jsAddComment.js
Reset
Fork
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Write a comment
      </button>
      <Post ref={postRef} />
    </>
  );
}


Show more
Pitfall
Do not overuse refs. You should only use refs for imperative behaviors that you can’t express as props: for example, scrolling to a node, focusing a node, triggering an animation, selecting text, and so on.
If you can express something as a prop, you should not use a ref. For example, instead of exposing an imperative handle like { open, close } from a Modal component, it is better to take isOpen as a prop like <Modal isOpen={isOpen} />. Effects can help you expose imperative behaviors via props.
PrevioususeId
NextuseInsertionEffect

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
useImperativeHandle(ref, createHandle, dependencies?)
Usage
Exposing a custom ref handle to the parent component
Exposing your own imperative methods
useImperativeHandle – React
useInsertionEffect
Pitfall
useInsertionEffect is for CSS-in-JS library authors. Unless you are working on a CSS-in-JS library and need a place to inject the styles, you probably want useEffect or useLayoutEffect instead.
useInsertionEffect allows inserting elements into the DOM before any layout Effects fire.
useInsertionEffect(setup, dependencies?)
Reference
useInsertionEffect(setup, dependencies?)
Usage
Injecting dynamic styles from CSS-in-JS libraries

Reference 
useInsertionEffect(setup, dependencies?) 
Call useInsertionEffect to insert styles before any Effects fire that may need to read layout:
import { useInsertionEffect } from 'react';

// Inside your CSS-in-JS library
function useCSS(rule) {
 useInsertionEffect(() => {
   // ... inject <style> tags here ...
 });
 return rule;
}
See more examples below.
Parameters 
setup: The function with your Effect’s logic. Your setup function may also optionally return a cleanup function. When your component is added to the DOM, but before any layout Effects fire, React will run your setup function. After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. When your component is removed from the DOM, React will run your cleanup function.
optional dependencies: The list of all reactive values referenced inside of the setup code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is configured for React, it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like [dep1, dep2, dep3]. React will compare each dependency with its previous value using the Object.is comparison algorithm. If you don’t specify the dependencies at all, your Effect will re-run after every re-render of the component.
Returns 
useInsertionEffect returns undefined.
Caveats 
Effects only run on the client. They don’t run during server rendering.
You can’t update state from inside useInsertionEffect.
By the time useInsertionEffect runs, refs are not attached yet.
useInsertionEffect may run either before or after the DOM has been updated. You shouldn’t rely on the DOM being updated at any particular time.
Unlike other types of Effects, which fire cleanup for every Effect and then setup for every Effect, useInsertionEffect will fire both cleanup and setup one component at a time. This results in an “interleaving” of the cleanup and setup functions.

Usage 
Injecting dynamic styles from CSS-in-JS libraries 
Traditionally, you would style React components using plain CSS.
// In your JS file:
<button className="success" />

// In your CSS file:
.success { color: green; }
Some teams prefer to author styles directly in JavaScript code instead of writing CSS files. This usually requires using a CSS-in-JS library or a tool. There are three common approaches to CSS-in-JS:
Static extraction to CSS files with a compiler
Inline styles, e.g. <div style={{ opacity: 1 }}>
Runtime injection of <style> tags
If you use CSS-in-JS, we recommend a combination of the first two approaches (CSS files for static styles, inline styles for dynamic styles). We don’t recommend runtime <style> tag injection for two reasons:
Runtime injection forces the browser to recalculate the styles a lot more often.
Runtime injection can be very slow if it happens at the wrong time in the React lifecycle.
The first problem is not solvable, but useInsertionEffect helps you solve the second problem.
Call useInsertionEffect to insert the styles before any layout Effects fire:
// Inside your CSS-in-JS library
let isInserted = new Set();
function useCSS(rule) {
 useInsertionEffect(() => {
   // As explained earlier, we don't recommend runtime injection of <style> tags.
   // But if you have to do it, then it's important to do in useInsertionEffect.
   if (!isInserted.has(rule)) {
     isInserted.add(rule);
     document.head.appendChild(getStyleForRule(rule));
   }
 });
 return rule;
}

function Button() {
 const className = useCSS('...');
 return <div className={className} />;
}
Similarly to useEffect, useInsertionEffect does not run on the server. If you need to collect which CSS rules have been used on the server, you can do it during rendering:
let collectedRulesSet = new Set();

function useCSS(rule) {
 if (typeof window === 'undefined') {
   collectedRulesSet.add(rule);
 }
 useInsertionEffect(() => {
   // ...
 });
 return rule;
}
Read more about upgrading CSS-in-JS libraries with runtime injection to useInsertionEffect.
Deep Dive
How is this better than injecting styles during rendering or useLayoutEffect? 
Show Details
PrevioususeImperativeHandle
NextuseLayoutEffect

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
useInsertionEffect(setup, dependencies?)
Usage
Injecting dynamic styles from CSS-in-JS libraries
useInsertionEffect – React
useLayoutEffect
Pitfall
useLayoutEffect can hurt performance. Prefer useEffect when possible.
useLayoutEffect is a version of useEffect that fires before the browser repaints the screen.
useLayoutEffect(setup, dependencies?)
Reference
useLayoutEffect(setup, dependencies?)
Usage
Measuring layout before the browser repaints the screen
Troubleshooting
I’m getting an error: “useLayoutEffect does nothing on the server”

Reference 
useLayoutEffect(setup, dependencies?) 
Call useLayoutEffect to perform the layout measurements before the browser repaints the screen:
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
 const ref = useRef(null);
 const [tooltipHeight, setTooltipHeight] = useState(0);

 useLayoutEffect(() => {
   const { height } = ref.current.getBoundingClientRect();
   setTooltipHeight(height);
 }, []);
 // ...
See more examples below.
Parameters 
setup: The function with your Effect’s logic. Your setup function may also optionally return a cleanup function. Before your component is added to the DOM, React will run your setup function. After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. Before your component is removed from the DOM, React will run your cleanup function.
optional dependencies: The list of all reactive values referenced inside of the setup code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is configured for React, it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like [dep1, dep2, dep3]. React will compare each dependency with its previous value using the Object.is comparison. If you omit this argument, your Effect will re-run after every re-render of the component.
Returns 
useLayoutEffect returns undefined.
Caveats 
useLayoutEffect is a Hook, so you can only call it at the top level of your component or your own Hooks. You can’t call it inside loops or conditions. If you need that, extract a component and move the Effect there.
When Strict Mode is on, React will run one extra development-only setup+cleanup cycle before the first real setup. This is a stress-test that ensures that your cleanup logic “mirrors” your setup logic and that it stops or undoes whatever the setup is doing. If this causes a problem, implement the cleanup function.
If some of your dependencies are objects or functions defined inside the component, there is a risk that they will cause the Effect to re-run more often than needed. To fix this, remove unnecessary object and function dependencies. You can also extract state updates and non-reactive logic outside of your Effect.
Effects only run on the client. They don’t run during server rendering.
The code inside useLayoutEffect and all state updates scheduled from it block the browser from repainting the screen. When used excessively, this makes your app slow. When possible, prefer useEffect.
If you trigger a state update inside useLayoutEffect, React will execute all remaining Effects immediately including useEffect.

Usage 
Measuring layout before the browser repaints the screen 
Most components don’t need to know their position and size on the screen to decide what to render. They only return some JSX. Then the browser calculates their layout (position and size) and repaints the screen.
Sometimes, that’s not enough. Imagine a tooltip that appears next to some element on hover. If there’s enough space, the tooltip should appear above the element, but if it doesn’t fit, it should appear below. In order to render the tooltip at the right final position, you need to know its height (i.e. whether it fits at the top).
To do this, you need to render in two passes:
Render the tooltip anywhere (even with a wrong position).
Measure its height and decide where to place the tooltip.
Render the tooltip again in the correct place.
All of this needs to happen before the browser repaints the screen. You don’t want the user to see the tooltip moving. Call useLayoutEffect to perform the layout measurements before the browser repaints the screen:
function Tooltip() {
 const ref = useRef(null);
 const [tooltipHeight, setTooltipHeight] = useState(0); // You don't know real height yet

 useLayoutEffect(() => {
   const { height } = ref.current.getBoundingClientRect();
   setTooltipHeight(height); // Re-render now that you know the real height
 }, []);

 // ...use tooltipHeight in the rendering logic below...
}
Here’s how this works step by step:
Tooltip renders with the initial tooltipHeight = 0 (so the tooltip may be wrongly positioned).
React places it in the DOM and runs the code in useLayoutEffect.
Your useLayoutEffect measures the height of the tooltip content and triggers an immediate re-render.
Tooltip renders again with the real tooltipHeight (so the tooltip is correctly positioned).
React updates it in the DOM, and the browser finally displays the tooltip.
Hover over the buttons below and see how the tooltip adjusts its position depending on whether it fits:
App.jsButtonWithTooltip.jsTooltip.jsTooltipContainer.js
Reset
Fork
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Measured tooltip height: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}


Show more
Notice that even though the Tooltip component has to render in two passes (first, with tooltipHeight initialized to 0 and then with the real measured height), you only see the final result. This is why you need useLayoutEffect instead of useEffect for this example. Let’s look at the difference in detail below.
useLayoutEffect vs useEffect
1. useLayoutEffect blocks the browser from repainting2. useEffect does not block the browser
Example 1 of 2: useLayoutEffect blocks the browser from repainting 
React guarantees that the code inside useLayoutEffect and any state updates scheduled inside it will be processed before the browser repaints the screen. This lets you render the tooltip, measure it, and re-render the tooltip again without the user noticing the first extra render. In other words, useLayoutEffect blocks the browser from painting.
App.jsButtonWithTooltip.jsTooltip.jsTooltipContainer.js
Reset
Fork
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}


Show more
Next Example
Note
Rendering in two passes and blocking the browser hurts performance. Try to avoid this when you can.

Troubleshooting 
I’m getting an error: “useLayoutEffect does nothing on the server” 
The purpose of useLayoutEffect is to let your component use layout information for rendering:
Render the initial content.
Measure the layout before the browser repaints the screen.
Render the final content using the layout information you’ve read.
When you or your framework uses server rendering, your React app renders to HTML on the server for the initial render. This lets you show the initial HTML before the JavaScript code loads.
The problem is that on the server, there is no layout information.
In the earlier example, the useLayoutEffect call in the Tooltip component lets it position itself correctly (either above or below content) depending on the content height. If you tried to render Tooltip as a part of the initial server HTML, this would be impossible to determine. On the server, there is no layout yet! So, even if you rendered it on the server, its position would “jump” on the client after the JavaScript loads and runs.
Usually, components that rely on layout information don’t need to render on the server anyway. For example, it probably doesn’t make sense to show a Tooltip during the initial render. It is triggered by a client interaction.
However, if you’re running into this problem, you have a few different options:
Replace useLayoutEffect with useEffect. This tells React that it’s okay to display the initial render result without blocking the paint (because the original HTML will become visible before your Effect runs).
Alternatively, mark your component as client-only. This tells React to replace its content up to the closest <Suspense> boundary with a loading fallback (for example, a spinner or a glimmer) during server rendering.
Alternatively, you can render a component with useLayoutEffect only after hydration. Keep a boolean isMounted state that’s initialized to false, and set it to true inside a useEffect call. Your rendering logic can then be like return isMounted ? <RealContent /> : <FallbackContent />. On the server and during the hydration, the user will see FallbackContent which should not call useLayoutEffect. Then React will replace it with RealContent which runs on the client only and can include useLayoutEffect calls.
If you synchronize your component with an external data store and rely on useLayoutEffect for different reasons than measuring layout, consider useSyncExternalStore instead which supports server rendering.
PrevioususeInsertionEffect
NextuseMemo

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
useLayoutEffect(setup, dependencies?)
Usage
Measuring layout before the browser repaints the screen
Troubleshooting
I’m getting an error: “useLayoutEffect does nothing on the server”
useLayoutEffect – React
useMemo
useMemo is a React Hook that lets you cache the result of a calculation between re-renders.
const cachedValue = useMemo(calculateValue, dependencies)
Reference
useMemo(calculateValue, dependencies)
Usage
Skipping expensive recalculations
Skipping re-rendering of components
Preventing an Effect from firing too often
Memoizing a dependency of another Hook
Memoizing a function
Troubleshooting
My calculation runs twice on every re-render
My useMemo call is supposed to return an object, but returns undefined
Every time my component renders, the calculation in useMemo re-runs
I need to call useMemo for each list item in a loop, but it’s not allowed

Reference 
useMemo(calculateValue, dependencies) 
Call useMemo at the top level of your component to cache a calculation between re-renders:
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
 const visibleTodos = useMemo(
   () => filterTodos(todos, tab),
   [todos, tab]
 );
 // ...
}
See more examples below.
Parameters 
calculateValue: The function calculating the value that you want to cache. It should be pure, should take no arguments, and should return a value of any type. React will call your function during the initial render. On next renders, React will return the same value again if the dependencies have not changed since the last render. Otherwise, it will call calculateValue, return its result, and store it so it can be reused later.
dependencies: The list of all reactive values referenced inside of the calculateValue code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is configured for React, it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like [dep1, dep2, dep3]. React will compare each dependency with its previous value using the Object.is comparison.
Returns 
On the initial render, useMemo returns the result of calling calculateValue with no arguments.
During next renders, it will either return an already stored value from the last render (if the dependencies haven’t changed), or call calculateValue again, and return the result that calculateValue has returned.
Caveats 
useMemo is a Hook, so you can only call it at the top level of your component or your own Hooks. You can’t call it inside loops or conditions. If you need that, extract a new component and move the state into it.
In Strict Mode, React will call your calculation function twice in order to help you find accidental impurities. This is development-only behavior and does not affect production. If your calculation function is pure (as it should be), this should not affect your logic. The result from one of the calls will be ignored.
React will not throw away the cached value unless there is a specific reason to do that. For example, in development, React throws away the cache when you edit the file of your component. Both in development and in production, React will throw away the cache if your component suspends during the initial mount. In the future, React may add more features that take advantage of throwing away the cache—for example, if React adds built-in support for virtualized lists in the future, it would make sense to throw away the cache for items that scroll out of the virtualized table viewport. This should be fine if you rely on useMemo solely as a performance optimization. Otherwise, a state variable or a ref may be more appropriate.
Note
Caching return values like this is also known as memoization, which is why this Hook is called useMemo.

Usage 
Skipping expensive recalculations 
To cache a calculation between re-renders, wrap it in a useMemo call at the top level of your component:
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
 const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
 // ...
}
You need to pass two things to useMemo:
A calculation function that takes no arguments, like () =>, and returns what you wanted to calculate.
A list of dependencies including every value within your component that’s used inside your calculation.
On the initial render, the value you’ll get from useMemo will be the result of calling your calculation.
On every subsequent render, React will compare the dependencies with the dependencies you passed during the last render. If none of the dependencies have changed (compared with Object.is), useMemo will return the value you already calculated before. Otherwise, React will re-run your calculation and return the new value.
In other words, useMemo caches a calculation result between re-renders until its dependencies change.
Let’s walk through an example to see when this is useful.
By default, React will re-run the entire body of your component every time that it re-renders. For example, if this TodoList updates its state or receives new props from its parent, the filterTodos function will re-run:
function TodoList({ todos, tab, theme }) {
 const visibleTodos = filterTodos(todos, tab);
 // ...
}
Usually, this isn’t a problem because most calculations are very fast. However, if you’re filtering or transforming a large array, or doing some expensive computation, you might want to skip doing it again if data hasn’t changed. If both todos and tab are the same as they were during the last render, wrapping the calculation in useMemo like earlier lets you reuse visibleTodos you’ve already calculated before.
This type of caching is called memoization.
Note
You should only rely on useMemo as a performance optimization. If your code doesn’t work without it, find the underlying problem and fix it first. Then you may add useMemo to improve performance.
Deep Dive
How to tell if a calculation is expensive? 
Show Details






Deep Dive
Should you add useMemo everywhere? 
Show Details
















The difference between useMemo and calculating a value directly
1. Skipping recalculation with useMemo2. Always recalculating a value
Example 1 of 2: Skipping recalculation with useMemo 
In this example, the filterTodos implementation is artificially slowed down so that you can see what happens when some JavaScript function you’re calling during rendering is genuinely slow. Try switching the tabs and toggling the theme.
Switching the tabs feels slow because it forces the slowed down filterTodos to re-execute. That’s expected because the tab has changed, and so the entire calculation needs to re-run. (If you’re curious why it runs twice, it’s explained here.)
Toggle the theme. Thanks to useMemo, it’s fast despite the artificial slowdown! The slow filterTodos call was skipped because both todos and tab (which you pass as dependencies to useMemo) haven’t changed since the last render.
App.jsTodoList.jsutils.js
Reset
Fork
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}


Show more
Next Example

Skipping re-rendering of components 
In some cases, useMemo can also help you optimize performance of re-rendering child components. To illustrate this, let’s say this TodoList component passes the visibleTodos as a prop to the child List component:
export default function TodoList({ todos, tab, theme }) {
 // ...
 return (
   <div className={theme}>
     <List items={visibleTodos} />
   </div>
 );
}
You’ve noticed that toggling the theme prop freezes the app for a moment, but if you remove <List /> from your JSX, it feels fast. This tells you that it’s worth trying to optimize the List component.
By default, when a component re-renders, React re-renders all of its children recursively. This is why, when TodoList re-renders with a different theme, the List component also re-renders. This is fine for components that don’t require much calculation to re-render. But if you’ve verified that a re-render is slow, you can tell List to skip re-rendering when its props are the same as on last render by wrapping it in memo:
import { memo } from 'react';

const List = memo(function List({ items }) {
 // ...
});
With this change, List will skip re-rendering if all of its props are the same as on the last render. This is where caching the calculation becomes important! Imagine that you calculated visibleTodos without useMemo:
export default function TodoList({ todos, tab, theme }) {
 // Every time the theme changes, this will be a different array...
 const visibleTodos = filterTodos(todos, tab);
 return (
   <div className={theme}>
     {/* ... so List's props will never be the same, and it will re-render every time */}
     <List items={visibleTodos} />
   </div>
 );
}
In the above example, the filterTodos function always creates a different array, similar to how the {} object literal always creates a new object. Normally, this wouldn’t be a problem, but it means that List props will never be the same, and your memo optimization won’t work. This is where useMemo comes in handy:
export default function TodoList({ todos, tab, theme }) {
 // Tell React to cache your calculation between re-renders...
 const visibleTodos = useMemo(
   () => filterTodos(todos, tab),
   [todos, tab] // ...so as long as these dependencies don't change...
 );
 return (
   <div className={theme}>
     {/* ...List will receive the same props and can skip re-rendering */}
     <List items={visibleTodos} />
   </div>
 );
}
By wrapping the visibleTodos calculation in useMemo, you ensure that it has the same value between the re-renders (until dependencies change). You don’t have to wrap a calculation in useMemo unless you do it for some specific reason. In this example, the reason is that you pass it to a component wrapped in memo, and this lets it skip re-rendering. There are a few other reasons to add useMemo which are described further on this page.
Deep Dive
Memoizing individual JSX nodes 
Show Details








The difference between skipping re-renders and always re-rendering
1. Skipping re-rendering with useMemo and memo2. Always re-rendering a component
Example 1 of 2: Skipping re-rendering with useMemo and memo 
In this example, the List component is artificially slowed down so that you can see what happens when a React component you’re rendering is genuinely slow. Try switching the tabs and toggling the theme.
Switching the tabs feels slow because it forces the slowed down List to re-render. That’s expected because the tab has changed, and so you need to reflect the user’s new choice on the screen.
Next, try toggling the theme. Thanks to useMemo together with memo, it’s fast despite the artificial slowdown! The List skipped re-rendering because the visibleTodos array has not changed since the last render. The visibleTodos array has not changed because both todos and tab (which you pass as dependencies to useMemo) haven’t changed since the last render.
App.jsTodoList.jsList.jsutils.js
Reset
Fork
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}


Show more
Next Example

Preventing an Effect from firing too often 
Sometimes, you might want to use a value inside an Effect:
function ChatRoom({ roomId }) {
 const [message, setMessage] = useState('');

 const options = {
   serverUrl: 'https://localhost:1234',
   roomId: roomId
 }

 useEffect(() => {
   const connection = createConnection(options);
   connection.connect();
   // ...
This creates a problem. Every reactive value must be declared as a dependency of your Effect. However, if you declare options as a dependency, it will cause your Effect to constantly reconnect to the chat room:
 useEffect(() => {
   const connection = createConnection(options);
   connection.connect();
   return () => connection.disconnect();
 }, [options]); // 🔴 Problem: This dependency changes on every render
 // ...
To solve this, you can wrap the object you need to call from an Effect in useMemo:
function ChatRoom({ roomId }) {
 const [message, setMessage] = useState('');

 const options = useMemo(() => {
   return {
     serverUrl: 'https://localhost:1234',
     roomId: roomId
   };
 }, [roomId]); // ✅ Only changes when roomId changes

 useEffect(() => {
   const connection = createConnection(options);
   connection.connect();
   return () => connection.disconnect();
 }, [options]); // ✅ Only changes when options changes
 // ...
This ensures that the options object is the same between re-renders if useMemo returns the cached object.
However, since useMemo is performance optimization, not a semantic guarantee, React may throw away the cached value if there is a specific reason to do that. This will also cause the effect to re-fire, so it’s even better to remove the need for a function dependency by moving your object inside the Effect:
function ChatRoom({ roomId }) {
 const [message, setMessage] = useState('');

 useEffect(() => {
   const options = { // ✅ No need for useMemo or object dependencies!
     serverUrl: 'https://localhost:1234',
     roomId: roomId
   }
  
   const connection = createConnection(options);
   connection.connect();
   return () => connection.disconnect();
 }, [roomId]); // ✅ Only changes when roomId changes
 // ...
Now your code is simpler and doesn’t need useMemo. Learn more about removing Effect dependencies.
Memoizing a dependency of another Hook 
Suppose you have a calculation that depends on an object created directly in the component body:
function Dropdown({ allItems, text }) {
 const searchOptions = { matchMode: 'whole-word', text };

 const visibleItems = useMemo(() => {
   return searchItems(allItems, searchOptions);
 }, [allItems, searchOptions]); // 🚩 Caution: Dependency on an object created in the component body
 // ...
Depending on an object like this defeats the point of memoization. When a component re-renders, all of the code directly inside the component body runs again. The lines of code creating the searchOptions object will also run on every re-render. Since searchOptions is a dependency of your useMemo call, and it’s different every time, React knows the dependencies are different, and recalculate searchItems every time.
To fix this, you could memoize the searchOptions object itself before passing it as a dependency:
function Dropdown({ allItems, text }) {
 const searchOptions = useMemo(() => {
   return { matchMode: 'whole-word', text };
 }, [text]); // ✅ Only changes when text changes

 const visibleItems = useMemo(() => {
   return searchItems(allItems, searchOptions);
 }, [allItems, searchOptions]); // ✅ Only changes when allItems or searchOptions changes
 // ...
In the example above, if the text did not change, the searchOptions object also won’t change. However, an even better fix is to move the searchOptions object declaration inside of the useMemo calculation function:
function Dropdown({ allItems, text }) {
 const visibleItems = useMemo(() => {
   const searchOptions = { matchMode: 'whole-word', text };
   return searchItems(allItems, searchOptions);
 }, [allItems, text]); // ✅ Only changes when allItems or text changes
 // ...
Now your calculation depends on text directly (which is a string and can’t “accidentally” become different).

Memoizing a function 
Suppose the Form component is wrapped in memo. You want to pass a function to it as a prop:
export default function ProductPage({ productId, referrer }) {
 function handleSubmit(orderDetails) {
   post('/product/' + productId + '/buy', {
     referrer,
     orderDetails
   });
 }

 return <Form onSubmit={handleSubmit} />;
}
Just as {} creates a different object, function declarations like function() {} and expressions like () => {} produce a different function on every re-render. By itself, creating a new function is not a problem. This is not something to avoid! However, if the Form component is memoized, presumably you want to skip re-rendering it when no props have changed. A prop that is always different would defeat the point of memoization.
To memoize a function with useMemo, your calculation function would have to return another function:
export default function Page({ productId, referrer }) {
 const handleSubmit = useMemo(() => {
   return (orderDetails) => {
     post('/product/' + productId + '/buy', {
       referrer,
       orderDetails
     });
   };
 }, [productId, referrer]);

 return <Form onSubmit={handleSubmit} />;
}
This looks clunky! Memoizing functions is common enough that React has a built-in Hook specifically for that. Wrap your functions into useCallback instead of useMemo to avoid having to write an extra nested function:
export default function Page({ productId, referrer }) {
 const handleSubmit = useCallback((orderDetails) => {
   post('/product/' + productId + '/buy', {
     referrer,
     orderDetails
   });
 }, [productId, referrer]);

 return <Form onSubmit={handleSubmit} />;
}
The two examples above are completely equivalent. The only benefit to useCallback is that it lets you avoid writing an extra nested function inside. It doesn’t do anything else. Read more about useCallback.

Troubleshooting 
My calculation runs twice on every re-render 
In Strict Mode, React will call some of your functions twice instead of once:
function TodoList({ todos, tab }) {
 // This component function will run twice for every render.

 const visibleTodos = useMemo(() => {
   // This calculation will run twice if any of the dependencies change.
   return filterTodos(todos, tab);
 }, [todos, tab]);

 // ...
This is expected and shouldn’t break your code.
This development-only behavior helps you keep components pure. React uses the result of one of the calls, and ignores the result of the other call. As long as your component and calculation functions are pure, this shouldn’t affect your logic. However, if they are accidentally impure, this helps you notice and fix the mistake.
For example, this impure calculation function mutates an array you received as a prop:
 const visibleTodos = useMemo(() => {
   // 🚩 Mistake: mutating a prop
   todos.push({ id: 'last', text: 'Go for a walk!' });
   const filtered = filterTodos(todos, tab);
   return filtered;
 }, [todos, tab]);
React calls your function twice, so you’d notice the todo is added twice. Your calculation shouldn’t change any existing objects, but it’s okay to change any new objects you created during the calculation. For example, if the filterTodos function always returns a different array, you can mutate that array instead:
 const visibleTodos = useMemo(() => {
   const filtered = filterTodos(todos, tab);
   // ✅ Correct: mutating an object you created during the calculation
   filtered.push({ id: 'last', text: 'Go for a walk!' });
   return filtered;
 }, [todos, tab]);
Read keeping components pure to learn more about purity.
Also, check out the guides on updating objects and updating arrays without mutation.

My useMemo call is supposed to return an object, but returns undefined 
This code doesn’t work:
 // 🔴 You can't return an object from an arrow function with () => {
 const searchOptions = useMemo(() => {
   matchMode: 'whole-word',
   text: text
 }, [text]);
In JavaScript, () => { starts the arrow function body, so the { brace is not a part of your object. This is why it doesn’t return an object, and leads to mistakes. You could fix it by adding parentheses like ({ and }):
 // This works, but is easy for someone to break again
 const searchOptions = useMemo(() => ({
   matchMode: 'whole-word',
   text: text
 }), [text]);
However, this is still confusing and too easy for someone to break by removing the parentheses.
To avoid this mistake, write a return statement explicitly:
 // ✅ This works and is explicit
 const searchOptions = useMemo(() => {
   return {
     matchMode: 'whole-word',
     text: text
   };
 }, [text]);

Every time my component renders, the calculation in useMemo re-runs 
Make sure you’ve specified the dependency array as a second argument!
If you forget the dependency array, useMemo will re-run the calculation every time:
function TodoList({ todos, tab }) {
 // 🔴 Recalculates every time: no dependency array
 const visibleTodos = useMemo(() => filterTodos(todos, tab));
 // ...
This is the corrected version passing the dependency array as a second argument:
function TodoList({ todos, tab }) {
 // ✅ Does not recalculate unnecessarily
 const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
 // ...
If this doesn’t help, then the problem is that at least one of your dependencies is different from the previous render. You can debug this problem by manually logging your dependencies to the console:
 const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
 console.log([todos, tab]);
You can then right-click on the arrays from different re-renders in the console and select “Store as a global variable” for both of them. Assuming the first one got saved as temp1 and the second one got saved as temp2, you can then use the browser console to check whether each dependency in both arrays is the same:
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
When you find which dependency breaks memoization, either find a way to remove it, or memoize it as well.

I need to call useMemo for each list item in a loop, but it’s not allowed 
Suppose the Chart component is wrapped in memo. You want to skip re-rendering every Chart in the list when the ReportList component re-renders. However, you can’t call useMemo in a loop:
function ReportList({ items }) {
 return (
   <article>
     {items.map(item => {
       // 🔴 You can't call useMemo in a loop like this:
       const data = useMemo(() => calculateReport(item), [item]);
       return (
         <figure key={item.id}>
           <Chart data={data} />
         </figure>
       );
     })}
   </article>
 );
}
Instead, extract a component for each item and memoize data for individual items:
function ReportList({ items }) {
 return (
   <article>
     {items.map(item =>
       <Report key={item.id} item={item} />
     )}
   </article>
 );
}

function Report({ item }) {
 // ✅ Call useMemo at the top level:
 const data = useMemo(() => calculateReport(item), [item]);
 return (
   <figure>
     <Chart data={data} />
   </figure>
 );
}
Alternatively, you could remove useMemo and instead wrap Report itself in memo. If the item prop does not change, Report will skip re-rendering, so Chart will skip re-rendering too:
function ReportList({ items }) {
 // ...
}

const Report = memo(function Report({ item }) {
 const data = calculateReport(item);
 return (
   <figure>
     <Chart data={data} />
   </figure>
 );
});
PrevioususeLayoutEffect
NextuseOptimistic

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
useMemo(calculateValue, dependencies)
Usage
Skipping expensive recalculations
Skipping re-rendering of components
Preventing an Effect from firing too often
Memoizing a dependency of another Hook
Memoizing a function
Troubleshooting
My calculation runs twice on every re-render
My useMemo call is supposed to return an object, but returns undefined
Every time my component renders, the calculation in useMemo re-runs
I need to call useMemo for each list item in a loop, but it’s not allowed
useMemo – React
useOptimistic
useOptimistic is a React Hook that lets you optimistically update the UI.
 const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
Reference
useOptimistic(state, updateFn)
Usage
Optimistically updating forms

Reference 
useOptimistic(state, updateFn) 
useOptimistic is a React Hook that lets you show a different state while an async action is underway. It accepts some state as an argument and returns a copy of that state that can be different during the duration of an async action such as a network request. You provide a function that takes the current state and the input to the action, and returns the optimistic state to be used while the action is pending.
This state is called the “optimistic” state because it is usually used to immediately present the user with the result of performing an action, even though the action actually takes time to complete.
import { useOptimistic } from 'react';

function AppContainer() {
 const [optimisticState, addOptimistic] = useOptimistic(
   state,
   // updateFn
   (currentState, optimisticValue) => {
     // merge and return new state
     // with optimistic value
   }
 );
}
See more examples below.
Parameters 
state: the value to be returned initially and whenever no action is pending.
updateFn(currentState, optimisticValue): a function that takes the current state and the optimistic value passed to addOptimistic and returns the resulting optimistic state. It must be a pure function. updateFn takes in two parameters. The currentState and the optimisticValue. The return value will be the merged value of the currentState and optimisticValue.
Returns 
optimisticState: The resulting optimistic state. It is equal to state unless an action is pending, in which case it is equal to the value returned by updateFn.
addOptimistic: addOptimistic is the dispatching function to call when you have an optimistic update. It takes one argument, optimisticValue, of any type and will call the updateFn with state and optimisticValue.

Usage 
Optimistically updating forms 
The useOptimistic Hook provides a way to optimistically update the user interface before a background operation, like a network request, completes. In the context of forms, this technique helps to make apps feel more responsive. When a user submits a form, instead of waiting for the server’s response to reflect the changes, the interface is immediately updated with the expected outcome.
For example, when a user types a message into the form and hits the “Send” button, the useOptimistic Hook allows the message to immediately appear in the list with a “Sending…” label, even before the message is actually sent to a server. This “optimistic” approach gives the impression of speed and responsiveness. The form then attempts to truly send the message in the background. Once the server confirms the message has been received, the “Sending…” label is removed.
App.jsactions.js
Reset
Fork
import { useOptimistic, useState, useRef, startTransition } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessageAction }) {
  const formRef = useRef();
  function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    startTransition(async () => {
      await sendMessageAction(formData);
    });
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      {
        text: newMessage,
        sending: true
      },
      ...state,
    ]
  );

  return (
    <>
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessageAction(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    startTransition(() => {
      setMessages((messages) => [{ text: sentMessage }, ...messages]);
    })
  }
  return <Thread messages={messages} sendMessageAction={sendMessageAction} />;
}


Show more
PrevioususeMemo
NextuseReducer

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
useOptimistic(state, updateFn)
Usage
Optimistically updating forms
useOptimistic – React
useReducer
useReducer is a React Hook that lets you add a reducer to your component.
const [state, dispatch] = useReducer(reducer, initialArg, init?)
Reference
useReducer(reducer, initialArg, init?)
dispatch function
Usage
Adding a reducer to a component
Writing the reducer function
Avoiding recreating the initial state
Troubleshooting
I’ve dispatched an action, but logging gives me the old state value
I’ve dispatched an action, but the screen doesn’t update
A part of my reducer state becomes undefined after dispatching
My entire reducer state becomes undefined after dispatching
I’m getting an error: “Too many re-renders”
My reducer or initializer function runs twice

Reference 
useReducer(reducer, initialArg, init?) 
Call useReducer at the top level of your component to manage its state with a reducer.
import { useReducer } from 'react';

function reducer(state, action) {
 // ...
}

function MyComponent() {
 const [state, dispatch] = useReducer(reducer, { age: 42 });
 // ...
See more examples below.
Parameters 
reducer: The reducer function that specifies how the state gets updated. It must be pure, should take the state and action as arguments, and should return the next state. State and action can be of any types.
initialArg: The value from which the initial state is calculated. It can be a value of any type. How the initial state is calculated from it depends on the next init argument.
optional init: The initializer function that should return the initial state. If it’s not specified, the initial state is set to initialArg. Otherwise, the initial state is set to the result of calling init(initialArg).
Returns 
useReducer returns an array with exactly two values:
The current state. During the first render, it’s set to init(initialArg) or initialArg (if there’s no init).
The dispatch function that lets you update the state to a different value and trigger a re-render.
Caveats 
useReducer is a Hook, so you can only call it at the top level of your component or your own Hooks. You can’t call it inside loops or conditions. If you need that, extract a new component and move the state into it.
The dispatch function has a stable identity, so you will often see it omitted from Effect dependencies, but including it will not cause the Effect to fire. If the linter lets you omit a dependency without errors, it is safe to do. Learn more about removing Effect dependencies.
In Strict Mode, React will call your reducer and initializer twice in order to help you find accidental impurities. This is development-only behavior and does not affect production. If your reducer and initializer are pure (as they should be), this should not affect your logic. The result from one of the calls is ignored.

dispatch function 
The dispatch function returned by useReducer lets you update the state to a different value and trigger a re-render. You need to pass the action as the only argument to the dispatch function:
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
 dispatch({ type: 'incremented_age' });
 // ...
React will set the next state to the result of calling the reducer function you’ve provided with the current state and the action you’ve passed to dispatch.
Parameters 
action: The action performed by the user. It can be a value of any type. By convention, an action is usually an object with a type property identifying it and, optionally, other properties with additional information.
Returns 
dispatch functions do not have a return value.
Caveats 
The dispatch function only updates the state variable for the next render. If you read the state variable after calling the dispatch function, you will still get the old value that was on the screen before your call.
If the new value you provide is identical to the current state, as determined by an Object.is comparison, React will skip re-rendering the component and its children. This is an optimization. React may still need to call your component before ignoring the result, but it shouldn’t affect your code.
React batches state updates. It updates the screen after all the event handlers have run and have called their set functions. This prevents multiple re-renders during a single event. In the rare case that you need to force React to update the screen earlier, for example to access the DOM, you can use flushSync.

Usage 
Adding a reducer to a component 
Call useReducer at the top level of your component to manage state with a reducer.
import { useReducer } from 'react';

function reducer(state, action) {
 // ...
}

function MyComponent() {
 const [state, dispatch] = useReducer(reducer, { age: 42 });
 // ...
useReducer returns an array with exactly two items:
The current state of this state variable, initially set to the initial state you provided.
The dispatch function that lets you change it in response to interaction.
To update what’s on the screen, call dispatch with an object representing what the user did, called an action:
function handleClick() {
 dispatch({ type: 'incremented_age' });
}
React will pass the current state and the action to your reducer function. Your reducer will calculate and return the next state. React will store that next state, render your component with it, and update the UI.
App.js
DownloadReset
Fork
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}


Show more
useReducer is very similar to useState, but it lets you move the state update logic from event handlers into a single function outside of your component. Read more about choosing between useState and useReducer.

Writing the reducer function 
A reducer function is declared like this:
function reducer(state, action) {
 // ...
}
Then you need to fill in the code that will calculate and return the next state. By convention, it is common to write it as a switch statement. For each case in the switch, calculate and return some next state.
function reducer(state, action) {
 switch (action.type) {
   case 'incremented_age': {
     return {
       name: state.name,
       age: state.age + 1
     };
   }
   case 'changed_name': {
     return {
       name: action.nextName,
       age: state.age
     };
   }
 }
 throw Error('Unknown action: ' + action.type);
}
Actions can have any shape. By convention, it’s common to pass objects with a type property identifying the action. It should include the minimal necessary information that the reducer needs to compute the next state.
function Form() {
 const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });

 function handleButtonClick() {
   dispatch({ type: 'incremented_age' });
 }

 function handleInputChange(e) {
   dispatch({
     type: 'changed_name',
     nextName: e.target.value
   });
 }
 // ...
The action type names are local to your component. Each action describes a single interaction, even if that leads to multiple changes in data. The shape of the state is arbitrary, but usually it’ll be an object or an array.
Read extracting state logic into a reducer to learn more.
Pitfall
State is read-only. Don’t modify any objects or arrays in state:
function reducer(state, action) {
 switch (action.type) {
   case 'incremented_age': {
     // 🚩 Don't mutate an object in state like this:
     state.age = state.age + 1;
     return state;
   }
Instead, always return new objects from your reducer:
function reducer(state, action) {
 switch (action.type) {
   case 'incremented_age': {
     // ✅ Instead, return a new object
     return {
       ...state,
       age: state.age + 1
     };
   }
Read updating objects in state and updating arrays in state to learn more.
Basic useReducer examples
1. Form (object)2. Todo list (array)3. Writing concise update logic with Immer
Example 1 of 3: Form (object) 
In this example, the reducer manages a state object with two fields: name and age.
App.js
DownloadReset
Fork
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    }); 
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Increment age
      </button>
      <p>Hello, {state.name}. You are {state.age}.</p>
    </>
  );
}


Show more
Next Example

Avoiding recreating the initial state 
React saves the initial state once and ignores it on the next renders.
function createInitialState(username) {
 // ...
}

function TodoList({ username }) {
 const [state, dispatch] = useReducer(reducer, createInitialState(username));
 // ...
Although the result of createInitialState(username) is only used for the initial render, you’re still calling this function on every render. This can be wasteful if it’s creating large arrays or performing expensive calculations.
To solve this, you may pass it as an initializer function to useReducer as the third argument instead:
function createInitialState(username) {
 // ...
}

function TodoList({ username }) {
 const [state, dispatch] = useReducer(reducer, username, createInitialState);
 // ...
Notice that you’re passing createInitialState, which is the function itself, and not createInitialState(), which is the result of calling it. This way, the initial state does not get re-created after initialization.
In the above example, createInitialState takes a username argument. If your initializer doesn’t need any information to compute the initial state, you may pass null as the second argument to useReducer.
The difference between passing an initializer and passing the initial state directly
1. Passing the initializer function2. Passing the initial state directly
Example 1 of 2: Passing the initializer function 
This example passes the initializer function, so the createInitialState function only runs during initialization. It does not run when component re-renders, such as when you type into the input.
TodoList.js
Reset
Fork
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}


Show more
Next Example

Troubleshooting 
I’ve dispatched an action, but logging gives me the old state value 
Calling the dispatch function does not change state in the running code:
function handleClick() {
 console.log(state.age);  // 42

 dispatch({ type: 'incremented_age' }); // Request a re-render with 43
 console.log(state.age);  // Still 42!

 setTimeout(() => {
   console.log(state.age); // Also 42!
 }, 5000);
}
This is because states behaves like a snapshot. Updating state requests another render with the new state value, but does not affect the state JavaScript variable in your already-running event handler.
If you need to guess the next state value, you can calculate it manually by calling the reducer yourself:
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }

I’ve dispatched an action, but the screen doesn’t update 
React will ignore your update if the next state is equal to the previous state, as determined by an Object.is comparison. This usually happens when you change an object or an array in state directly:
function reducer(state, action) {
 switch (action.type) {
   case 'incremented_age': {
     // 🚩 Wrong: mutating existing object
     state.age++;
     return state;
   }
   case 'changed_name': {
     // 🚩 Wrong: mutating existing object
     state.name = action.nextName;
     return state;
   }
   // ...
 }
}
You mutated an existing state object and returned it, so React ignored the update. To fix this, you need to ensure that you’re always updating objects in state and updating arrays in state instead of mutating them:
function reducer(state, action) {
 switch (action.type) {
   case 'incremented_age': {
     // ✅ Correct: creating a new object
     return {
       ...state,
       age: state.age + 1
     };
   }
   case 'changed_name': {
     // ✅ Correct: creating a new object
     return {
       ...state,
       name: action.nextName
     };
   }
   // ...
 }
}

A part of my reducer state becomes undefined after dispatching 
Make sure that every case branch copies all of the existing fields when returning the new state:
function reducer(state, action) {
 switch (action.type) {
   case 'incremented_age': {
     return {
       ...state, // Don't forget this!
       age: state.age + 1
     };
   }
   // ...
Without ...state above, the returned next state would only contain the age field and nothing else.

My entire reducer state becomes undefined after dispatching 
If your state unexpectedly becomes undefined, you’re likely forgetting to return state in one of the cases, or your action type doesn’t match any of the case statements. To find why, throw an error outside the switch:
function reducer(state, action) {
 switch (action.type) {
   case 'incremented_age': {
     // ...
   }
   case 'edited_name': {
     // ...
   }
 }
 throw Error('Unknown action: ' + action.type);
}
You can also use a static type checker like TypeScript to catch such mistakes.

I’m getting an error: “Too many re-renders” 
You might get an error that says: Too many re-renders. React limits the number of renders to prevent an infinite loop. Typically, this means that you’re unconditionally dispatching an action during render, so your component enters a loop: render, dispatch (which causes a render), render, dispatch (which causes a render), and so on. Very often, this is caused by a mistake in specifying an event handler:
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
If you can’t find the cause of this error, click on the arrow next to the error in the console and look through the JavaScript stack to find the specific dispatch function call responsible for the error.

My reducer or initializer function runs twice 
In Strict Mode, React will call your reducer and initializer functions twice. This shouldn’t break your code.
This development-only behavior helps you keep components pure. React uses the result of one of the calls, and ignores the result of the other call. As long as your component, initializer, and reducer functions are pure, this shouldn’t affect your logic. However, if they are accidentally impure, this helps you notice the mistakes.
For example, this impure reducer function mutates an array in state:
function reducer(state, action) {
 switch (action.type) {
   case 'added_todo': {
     // 🚩 Mistake: mutating state
     state.todos.push({ id: nextId++, text: action.text });
     return state;
   }
   // ...
 }
}
Because React calls your reducer function twice, you’ll see the todo was added twice, so you’ll know that there is a mistake. In this example, you can fix the mistake by replacing the array instead of mutating it:
function reducer(state, action) {
 switch (action.type) {
   case 'added_todo': {
     // ✅ Correct: replacing with new state
     return {
       ...state,
       todos: [
         ...state.todos,
         { id: nextId++, text: action.text }
       ]
     };
   }
   // ...
 }
}
Now that this reducer function is pure, calling it an extra time doesn’t make a difference in behavior. This is why React calling it twice helps you find mistakes. Only component, initializer, and reducer functions need to be pure. Event handlers don’t need to be pure, so React will never call your event handlers twice.
Read keeping components pure to learn more.
PrevioususeOptimistic
NextuseRef

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
useReducer(reducer, initialArg, init?)
dispatch function
Usage
Adding a reducer to a component
Writing the reducer function
Avoiding recreating the initial state
Troubleshooting
I’ve dispatched an action, but logging gives me the old state value
I’ve dispatched an action, but the screen doesn’t update
A part of my reducer state becomes undefined after dispatching
My entire reducer state becomes undefined after dispatching
I’m getting an error: “Too many re-renders”
My reducer or initializer function runs twice
useReducer – React
useRef
useRef is a React Hook that lets you reference a value that’s not needed for rendering.
const ref = useRef(initialValue)
Reference
useRef(initialValue)
Usage
Referencing a value with a ref
Manipulating the DOM with a ref
Avoiding recreating the ref contents
Troubleshooting
I can’t get a ref to a custom component

Reference 
useRef(initialValue) 
Call useRef at the top level of your component to declare a ref.
import { useRef } from 'react';

function MyComponent() {
 const intervalRef = useRef(0);
 const inputRef = useRef(null);
 // ...
See more examples below.
Parameters 
initialValue: The value you want the ref object’s current property to be initially. It can be a value of any type. This argument is ignored after the initial render.
Returns 
useRef returns an object with a single property:
current: Initially, it’s set to the initialValue you have passed. You can later set it to something else. If you pass the ref object to React as a ref attribute to a JSX node, React will set its current property.
On the next renders, useRef will return the same object.
Caveats 
You can mutate the ref.current property. Unlike state, it is mutable. However, if it holds an object that is used for rendering (for example, a piece of your state), then you shouldn’t mutate that object.
When you change the ref.current property, React does not re-render your component. React is not aware of when you change it because a ref is a plain JavaScript object.
Do not write or read ref.current during rendering, except for initialization. This makes your component’s behavior unpredictable.
In Strict Mode, React will call your component function twice in order to help you find accidental impurities. This is development-only behavior and does not affect production. Each ref object will be created twice, but one of the versions will be discarded. If your component function is pure (as it should be), this should not affect the behavior.

Usage 
Referencing a value with a ref 
Call useRef at the top level of your component to declare one or more refs.
import { useRef } from 'react';

function Stopwatch() {
 const intervalRef = useRef(0);
 // ...
useRef returns a ref object with a single current property initially set to the initial value you provided.
On the next renders, useRef will return the same object. You can change its current property to store information and read it later. This might remind you of state, but there is an important difference.
Changing a ref does not trigger a re-render. This means refs are perfect for storing information that doesn’t affect the visual output of your component. For example, if you need to store an interval ID and retrieve it later, you can put it in a ref. To update the value inside the ref, you need to manually change its current property:
function handleStartClick() {
 const intervalId = setInterval(() => {
   // ...
 }, 1000);
 intervalRef.current = intervalId;
}
Later, you can read that interval ID from the ref so that you can call clear that interval:
function handleStopClick() {
 const intervalId = intervalRef.current;
 clearInterval(intervalId);
}
By using a ref, you ensure that:
You can store information between re-renders (unlike regular variables, which reset on every render).
Changing it does not trigger a re-render (unlike state variables, which trigger a re-render).
The information is local to each copy of your component (unlike the variables outside, which are shared).
Changing a ref does not trigger a re-render, so refs are not appropriate for storing information you want to display on the screen. Use state for that instead. Read more about choosing between useRef and useState.
Examples of referencing a value with useRef
1. Click counter2. A stopwatch
Example 1 of 2: Click counter 
This component uses a ref to keep track of how many times the button was clicked. Note that it’s okay to use a ref instead of state here because the click count is only read and written in an event handler.
App.js
DownloadReset
Fork
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}


Show more
If you show {ref.current} in the JSX, the number won’t update on click. This is because setting ref.current does not trigger a re-render. Information that’s used for rendering should be state instead.
Next Example
Pitfall
Do not write or read ref.current during rendering.
React expects that the body of your component behaves like a pure function:
If the inputs (props, state, and context) are the same, it should return exactly the same JSX.
Calling it in a different order or with different arguments should not affect the results of other calls.
Reading or writing a ref during rendering breaks these expectations.
function MyComponent() {
 // ...
 // 🚩 Don't write a ref during rendering
 myRef.current = 123;
 // ...
 // 🚩 Don't read a ref during rendering
 return <h1>{myOtherRef.current}</h1>;
}
You can read or write refs from event handlers or effects instead.
function MyComponent() {
 // ...
 useEffect(() => {
   // ✅ You can read or write refs in effects
   myRef.current = 123;
 });
 // ...
 function handleClick() {
   // ✅ You can read or write refs in event handlers
   doSomething(myOtherRef.current);
 }
 // ...
}
If you have to read or write something during rendering, use state instead.
When you break these rules, your component might still work, but most of the newer features we’re adding to React will rely on these expectations. Read more about keeping your components pure.

Manipulating the DOM with a ref 
It’s particularly common to use a ref to manipulate the DOM. React has built-in support for this.
First, declare a ref object with an initial value of null:
import { useRef } from 'react';

function MyComponent() {
 const inputRef = useRef(null);
 // ...
Then pass your ref object as the ref attribute to the JSX of the DOM node you want to manipulate:
 // ...
 return <input ref={inputRef} />;
After React creates the DOM node and puts it on the screen, React will set the current property of your ref object to that DOM node. Now you can access the <input>’s DOM node and call methods like focus():
 function handleClick() {
   inputRef.current.focus();
 }
React will set the current property back to null when the node is removed from the screen.
Read more about manipulating the DOM with refs.
Examples of manipulating the DOM with useRef
1. Focusing a text input2. Scrolling an image into view3. Playing and pausing a video4. Exposing a ref to your own component
Example 1 of 4: Focusing a text input 
In this example, clicking the button will focus the input:
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
Next Example

Avoiding recreating the ref contents 
React saves the initial ref value once and ignores it on the next renders.
function Video() {
 const playerRef = useRef(new VideoPlayer());
 // ...
Although the result of new VideoPlayer() is only used for the initial render, you’re still calling this function on every render. This can be wasteful if it’s creating expensive objects.
To solve it, you may initialize the ref like this instead:
function Video() {
 const playerRef = useRef(null);
 if (playerRef.current === null) {
   playerRef.current = new VideoPlayer();
 }
 // ...
Normally, writing or reading ref.current during render is not allowed. However, it’s fine in this case because the result is always the same, and the condition only executes during initialization so it’s fully predictable.
Deep Dive
How to avoid null checks when initializing useRef later 
Show Details













Troubleshooting 
I can’t get a ref to a custom component 
If you try to pass a ref to your own component like this:
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
You might get an error in the console:
Console
TypeError: Cannot read properties of null
By default, your own components don’t expose refs to the DOM nodes inside them.
To fix this, find the component that you want to get a ref to:
export default function MyInput({ value, onChange }) {
 return (
   <input
     value={value}
     onChange={onChange}
   />
 );
}
And then add ref to the list of props your component accepts and pass ref as a prop to the relevent child built-in component like this:
function MyInput({ value, onChange, ref }) {
 return (
   <input
     value={value}
     onChange={onChange}
     ref={ref}
   />
 );
};

export default MyInput;
Then the parent component can get a ref to it.
Read more about accessing another component’s DOM nodes.
PrevioususeReducer
NextuseState

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
useRef(initialValue)
Usage
Referencing a value with a ref
Manipulating the DOM with a ref
Avoiding recreating the ref contents
Troubleshooting
I can’t get a ref to a custom component
useRef – React
useState
useState is a React Hook that lets you add a state variable to your component.
const [state, setState] = useState(initialState)
Reference
useState(initialState)
set functions, like setSomething(nextState)
Usage
Adding state to a component
Updating state based on the previous state
Updating objects and arrays in state
Avoiding recreating the initial state
Resetting state with a key
Storing information from previous renders
Troubleshooting
I’ve updated the state, but logging gives me the old value
I’ve updated the state, but the screen doesn’t update
I’m getting an error: “Too many re-renders”
My initializer or updater function runs twice
I’m trying to set state to a function, but it gets called instead

Reference 
useState(initialState) 
Call useState at the top level of your component to declare a state variable.
import { useState } from 'react';

function MyComponent() {
 const [age, setAge] = useState(28);
 const [name, setName] = useState('Taylor');
 const [todos, setTodos] = useState(() => createTodos());
 // ...
The convention is to name state variables like [something, setSomething] using array destructuring.
See more examples below.
Parameters 
initialState: The value you want the state to be initially. It can be a value of any type, but there is a special behavior for functions. This argument is ignored after the initial render.
If you pass a function as initialState, it will be treated as an initializer function. It should be pure, should take no arguments, and should return a value of any type. React will call your initializer function when initializing the component, and store its return value as the initial state. See an example below.
Returns 
useState returns an array with exactly two values:
The current state. During the first render, it will match the initialState you have passed.
The set function that lets you update the state to a different value and trigger a re-render.
Caveats 
useState is a Hook, so you can only call it at the top level of your component or your own Hooks. You can’t call it inside loops or conditions. If you need that, extract a new component and move the state into it.
In Strict Mode, React will call your initializer function twice in order to help you find accidental impurities. This is development-only behavior and does not affect production. If your initializer function is pure (as it should be), this should not affect the behavior. The result from one of the calls will be ignored.

set functions, like setSomething(nextState) 
The set function returned by useState lets you update the state to a different value and trigger a re-render. You can pass the next state directly, or a function that calculates it from the previous state:
const [name, setName] = useState('Edward');

function handleClick() {
 setName('Taylor');
 setAge(a => a + 1);
 // ...
Parameters 
nextState: The value that you want the state to be. It can be a value of any type, but there is a special behavior for functions.
If you pass a function as nextState, it will be treated as an updater function. It must be pure, should take the pending state as its only argument, and should return the next state. React will put your updater function in a queue and re-render your component. During the next render, React will calculate the next state by applying all of the queued updaters to the previous state. See an example below.
Returns 
set functions do not have a return value.
Caveats 
The set function only updates the state variable for the next render. If you read the state variable after calling the set function, you will still get the old value that was on the screen before your call.
If the new value you provide is identical to the current state, as determined by an Object.is comparison, React will skip re-rendering the component and its children. This is an optimization. Although in some cases React may still need to call your component before skipping the children, it shouldn’t affect your code.
React batches state updates. It updates the screen after all the event handlers have run and have called their set functions. This prevents multiple re-renders during a single event. In the rare case that you need to force React to update the screen earlier, for example to access the DOM, you can use flushSync.
The set function has a stable identity, so you will often see it omitted from Effect dependencies, but including it will not cause the Effect to fire. If the linter lets you omit a dependency without errors, it is safe to do. Learn more about removing Effect dependencies.
Calling the set function during rendering is only allowed from within the currently rendering component. React will discard its output and immediately attempt to render it again with the new state. This pattern is rarely needed, but you can use it to store information from the previous renders. See an example below.
In Strict Mode, React will call your updater function twice in order to help you find accidental impurities. This is development-only behavior and does not affect production. If your updater function is pure (as it should be), this should not affect the behavior. The result from one of the calls will be ignored.

Usage 
Adding state to a component 
Call useState at the top level of your component to declare one or more state variables.
import { useState } from 'react';

function MyComponent() {
 const [age, setAge] = useState(42);
 const [name, setName] = useState('Taylor');
 // ...
The convention is to name state variables like [something, setSomething] using array destructuring.
useState returns an array with exactly two items:
The current state of this state variable, initially set to the initial state you provided.
The set function that lets you change it to any other value in response to interaction.
To update what’s on the screen, call the set function with some next state:
function handleClick() {
 setName('Robin');
}
React will store the next state, render your component again with the new values, and update the UI.
Pitfall
Calling the set function does not change the current state in the already executing code:
function handleClick() {
 setName('Robin');
 console.log(name); // Still "Taylor"!
}
It only affects what useState will return starting from the next render.
Basic useState examples
1. Counter (number)2. Text field (string)3. Checkbox (boolean)4. Form (two variables)
Example 1 of 4: Counter (number) 
In this example, the count state variable holds a number. Clicking the button increments it.
App.js
DownloadReset
Fork
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}


Next Example

Updating state based on the previous state 
Suppose the age is 42. This handler calls setAge(age + 1) three times:
function handleClick() {
 setAge(age + 1); // setAge(42 + 1)
 setAge(age + 1); // setAge(42 + 1)
 setAge(age + 1); // setAge(42 + 1)
}
However, after one click, age will only be 43 rather than 45! This is because calling the set function does not update the age state variable in the already running code. So each setAge(age + 1) call becomes setAge(43).
To solve this problem, you may pass an updater function to setAge instead of the next state:
function handleClick() {
 setAge(a => a + 1); // setAge(42 => 43)
 setAge(a => a + 1); // setAge(43 => 44)
 setAge(a => a + 1); // setAge(44 => 45)
}
Here, a => a + 1 is your updater function. It takes the pending state and calculates the next state from it.
React puts your updater functions in a queue. Then, during the next render, it will call them in the same order:
a => a + 1 will receive 42 as the pending state and return 43 as the next state.
a => a + 1 will receive 43 as the pending state and return 44 as the next state.
a => a + 1 will receive 44 as the pending state and return 45 as the next state.
There are no other queued updates, so React will store 45 as the current state in the end.
By convention, it’s common to name the pending state argument for the first letter of the state variable name, like a for age. However, you may also call it like prevAge or something else that you find clearer.
React may call your updaters twice in development to verify that they are pure.
Deep Dive
Is using an updater always preferred? 
Show Details
The difference between passing an updater and passing the next state directly
1. Passing the updater function2. Passing the next state directly
Example 1 of 2: Passing the updater function 
This example passes the updater function, so the “+3” button works.
App.js
DownloadReset
Fork
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}


Show more
Next Example

Updating objects and arrays in state 
You can put objects and arrays into state. In React, state is considered read-only, so you should replace it rather than mutate your existing objects. For example, if you have a form object in state, don’t mutate it:
// 🚩 Don't mutate an object in state like this:
form.firstName = 'Taylor';
Instead, replace the whole object by creating a new one:
// ✅ Replace state with a new object
setForm({
 ...form,
 firstName: 'Taylor'
});
Read updating objects in state and updating arrays in state to learn more.
Examples of objects and arrays in state
1. Form (object)2. Form (nested object)3. List (array)4. Writing concise update logic with Immer
Example 1 of 4: Form (object) 
In this example, the form state variable holds an object. Each input has a change handler that calls setForm with the next state of the entire form. The { ...form } spread syntax ensures that the state object is replaced rather than mutated.
App.js
DownloadReset
Fork
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}


Show more
Next Example

Avoiding recreating the initial state 
React saves the initial state once and ignores it on the next renders.
function TodoList() {
 const [todos, setTodos] = useState(createInitialTodos());
 // ...
Although the result of createInitialTodos() is only used for the initial render, you’re still calling this function on every render. This can be wasteful if it’s creating large arrays or performing expensive calculations.
To solve this, you may pass it as an initializer function to useState instead:
function TodoList() {
 const [todos, setTodos] = useState(createInitialTodos);
 // ...
Notice that you’re passing createInitialTodos, which is the function itself, and not createInitialTodos(), which is the result of calling it. If you pass a function to useState, React will only call it during initialization.
React may call your initializers twice in development to verify that they are pure.
The difference between passing an initializer and passing the initial state directly
1. Passing the initializer function2. Passing the initial state directly
Example 1 of 2: Passing the initializer function 
This example passes the initializer function, so the createInitialTodos function only runs during initialization. It does not run when component re-renders, such as when you type into the input.
App.js
DownloadReset
Fork
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}


Show more
Next Example

Resetting state with a key 
You’ll often encounter the key attribute when rendering lists. However, it also serves another purpose.
You can reset a component’s state by passing a different key to a component. In this example, the Reset button changes the version state variable, which we pass as a key to the Form. When the key changes, React re-creates the Form component (and all of its children) from scratch, so its state gets reset.
Read preserving and resetting state to learn more.
App.js
DownloadReset
Fork
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}


Show more

Storing information from previous renders 
Usually, you will update state in event handlers. However, in rare cases you might want to adjust state in response to rendering — for example, you might want to change a state variable when a prop changes.
In most cases, you don’t need this:
If the value you need can be computed entirely from the current props or other state, remove that redundant state altogether. If you’re worried about recomputing too often, the useMemo Hook can help.
If you want to reset the entire component tree’s state, pass a different key to your component.
If you can, update all the relevant state in the event handlers.
In the rare case that none of these apply, there is a pattern you can use to update state based on the values that have been rendered so far, by calling a set function while your component is rendering.
Here’s an example. This CountLabel component displays the count prop passed to it:
export default function CountLabel({ count }) {
 return <h1>{count}</h1>
}
Say you want to show whether the counter has increased or decreased since the last change. The count prop doesn’t tell you this — you need to keep track of its previous value. Add the prevCount state variable to track it. Add another state variable called trend to hold whether the count has increased or decreased. Compare prevCount with count, and if they’re not equal, update both prevCount and trend. Now you can show both the current count prop and how it has changed since the last render.
App.jsCountLabel.js
Reset
Fork
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}


Show more
Note that if you call a set function while rendering, it must be inside a condition like prevCount !== count, and there must be a call like setPrevCount(count) inside of the condition. Otherwise, your component would re-render in a loop until it crashes. Also, you can only update the state of the currently rendering component like this. Calling the set function of another component during rendering is an error. Finally, your set call should still update state without mutation — this doesn’t mean you can break other rules of pure functions.
This pattern can be hard to understand and is usually best avoided. However, it’s better than updating state in an effect. When you call the set function during render, React will re-render that component immediately after your component exits with a return statement, and before rendering the children. This way, children don’t need to render twice. The rest of your component function will still execute (and the result will be thrown away). If your condition is below all the Hook calls, you may add an early return; to restart rendering earlier.

Troubleshooting 
I’ve updated the state, but logging gives me the old value 
Calling the set function does not change state in the running code:
function handleClick() {
 console.log(count);  // 0

 setCount(count + 1); // Request a re-render with 1
 console.log(count);  // Still 0!

 setTimeout(() => {
   console.log(count); // Also 0!
 }, 5000);
}
This is because states behaves like a snapshot. Updating state requests another render with the new state value, but does not affect the count JavaScript variable in your already-running event handler.
If you need to use the next state, you can save it in a variable before passing it to the set function:
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1

I’ve updated the state, but the screen doesn’t update 
React will ignore your update if the next state is equal to the previous state, as determined by an Object.is comparison. This usually happens when you change an object or an array in state directly:
obj.x = 10;  // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
You mutated an existing obj object and passed it back to setObj, so React ignored the update. To fix this, you need to ensure that you’re always replacing objects and arrays in state instead of mutating them:
// ✅ Correct: creating a new object
setObj({
 ...obj,
 x: 10
});

I’m getting an error: “Too many re-renders” 
You might get an error that says: Too many re-renders. React limits the number of renders to prevent an infinite loop. Typically, this means that you’re unconditionally setting state during render, so your component enters a loop: render, set state (which causes a render), render, set state (which causes a render), and so on. Very often, this is caused by a mistake in specifying an event handler:
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
If you can’t find the cause of this error, click on the arrow next to the error in the console and look through the JavaScript stack to find the specific set function call responsible for the error.

My initializer or updater function runs twice 
In Strict Mode, React will call some of your functions twice instead of once:
function TodoList() {
 // This component function will run twice for every render.

 const [todos, setTodos] = useState(() => {
   // This initializer function will run twice during initialization.
   return createTodos();
 });

 function handleClick() {
   setTodos(prevTodos => {
     // This updater function will run twice for every click.
     return [...prevTodos, createTodo()];
   });
 }
 // ...
This is expected and shouldn’t break your code.
This development-only behavior helps you keep components pure. React uses the result of one of the calls, and ignores the result of the other call. As long as your component, initializer, and updater functions are pure, this shouldn’t affect your logic. However, if they are accidentally impure, this helps you notice the mistakes.
For example, this impure updater function mutates an array in state:
setTodos(prevTodos => {
 // 🚩 Mistake: mutating state
 prevTodos.push(createTodo());
});
Because React calls your updater function twice, you’ll see the todo was added twice, so you’ll know that there is a mistake. In this example, you can fix the mistake by replacing the array instead of mutating it:
setTodos(prevTodos => {
 // ✅ Correct: replacing with new state
 return [...prevTodos, createTodo()];
});
Now that this updater function is pure, calling it an extra time doesn’t make a difference in behavior. This is why React calling it twice helps you find mistakes. Only component, initializer, and updater functions need to be pure. Event handlers don’t need to be pure, so React will never call your event handlers twice.
Read keeping components pure to learn more.

I’m trying to set state to a function, but it gets called instead 
You can’t put a function into state like this:
const [fn, setFn] = useState(someFunction);

function handleClick() {
 setFn(someOtherFunction);
}
Because you’re passing a function, React assumes that someFunction is an initializer function, and that someOtherFunction is an updater function, so it tries to call them and store the result. To actually store a function, you have to put () => before them in both cases. Then React will store the functions you pass.
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
 setFn(() => someOtherFunction);
}
PrevioususeRef
NextuseSyncExternalStore

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
useState(initialState)
set functions, like setSomething(nextState)
Usage
Adding state to a component
Updating state based on the previous state
Updating objects and arrays in state
Avoiding recreating the initial state
Resetting state with a key
Storing information from previous renders
Troubleshooting
I’ve updated the state, but logging gives me the old value
I’ve updated the state, but the screen doesn’t update
I’m getting an error: “Too many re-renders”
My initializer or updater function runs twice
I’m trying to set state to a function, but it gets called instead
useState – React
useSyncExternalStore
useSyncExternalStore is a React Hook that lets you subscribe to an external store.
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
Reference
useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
Usage
Subscribing to an external store
Subscribing to a browser API
Extracting the logic to a custom Hook
Adding support for server rendering
Troubleshooting
I’m getting an error: “The result of getSnapshot should be cached”
My subscribe function gets called after every re-render

Reference 
useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?) 
Call useSyncExternalStore at the top level of your component to read a value from an external data store.
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
 const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
 // ...
}
It returns the snapshot of the data in the store. You need to pass two functions as arguments:
The subscribe function should subscribe to the store and return a function that unsubscribes.
The getSnapshot function should read a snapshot of the data from the store.
See more examples below.
Parameters 
subscribe: A function that takes a single callback argument and subscribes it to the store. When the store changes, it should invoke the provided callback, which will cause React to re-call getSnapshot and (if needed) re-render the component. The subscribe function should return a function that cleans up the subscription.
getSnapshot: A function that returns a snapshot of the data in the store that’s needed by the component. While the store has not changed, repeated calls to getSnapshot must return the same value. If the store changes and the returned value is different (as compared by Object.is), React re-renders the component.
optional getServerSnapshot: A function that returns the initial snapshot of the data in the store. It will be used only during server rendering and during hydration of server-rendered content on the client. The server snapshot must be the same between the client and the server, and is usually serialized and passed from the server to the client. If you omit this argument, rendering the component on the server will throw an error.
Returns 
The current snapshot of the store which you can use in your rendering logic.
Caveats 
The store snapshot returned by getSnapshot must be immutable. If the underlying store has mutable data, return a new immutable snapshot if the data has changed. Otherwise, return a cached last snapshot.
If a different subscribe function is passed during a re-render, React will re-subscribe to the store using the newly passed subscribe function. You can prevent this by declaring subscribe outside the component.
If the store is mutated during a non-blocking Transition update, React will fall back to performing that update as blocking. Specifically, for every Transition update, React will call getSnapshot a second time just before applying changes to the DOM. If it returns a different value than when it was called originally, React will restart the update from scratch, this time applying it as a blocking update, to ensure that every component on screen is reflecting the same version of the store.
It’s not recommended to suspend a render based on a store value returned by useSyncExternalStore. The reason is that mutations to the external store cannot be marked as non-blocking Transition updates, so they will trigger the nearest Suspense fallback, replacing already-rendered content on screen with a loading spinner, which typically makes a poor UX.
For example, the following are discouraged:
const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));


function ShoppingApp() {
 const selectedProductId = useSyncExternalStore(...);


 // ❌ Calling `use` with a Promise dependent on `selectedProductId`

  const data = use(fetchItem(selectedProductId))


  // ❌ Conditionally rendering a lazy component based on `selectedProductId`

  return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;

}

Usage 
Subscribing to an external store 
Most of your React components will only read data from their props, state, and context. However, sometimes a component needs to read some data from some store outside of React that changes over time. This includes:
Third-party state management libraries that hold state outside of React.
Browser APIs that expose a mutable value and events to subscribe to its changes.
Call useSyncExternalStore at the top level of your component to read a value from an external data store.
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
 const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
 // ...
}
It returns the snapshot of the data in the store. You need to pass two functions as arguments:
The subscribe function should subscribe to the store and return a function that unsubscribes.
The getSnapshot function should read a snapshot of the data from the store.
React will use these functions to keep your component subscribed to the store and re-render it on changes.
For example, in the sandbox below, todosStore is implemented as an external store that stores data outside of React. The TodosApp component connects to that external store with the useSyncExternalStore Hook.
App.jstodoStore.js
Reset
Fork
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}


Show more
Note
When possible, we recommend using built-in React state with useState and useReducer instead. The useSyncExternalStore API is mostly useful if you need to integrate with existing non-React code.

Subscribing to a browser API 
Another reason to add useSyncExternalStore is when you want to subscribe to some value exposed by the browser that changes over time. For example, suppose that you want your component to display whether the network connection is active. The browser exposes this information via a property called navigator.onLine.
This value can change without React’s knowledge, so you should read it with useSyncExternalStore.
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
 const isOnline = useSyncExternalStore(subscribe, getSnapshot);
 // ...
}
To implement the getSnapshot function, read the current value from the browser API:
function getSnapshot() {
 return navigator.onLine;
}
Next, you need to implement the subscribe function. For example, when navigator.onLine changes, the browser fires the online and offline events on the window object. You need to subscribe the callback argument to the corresponding events, and then return a function that cleans up the subscriptions:
function subscribe(callback) {
 window.addEventListener('online', callback);
 window.addEventListener('offline', callback);
 return () => {
   window.removeEventListener('online', callback);
   window.removeEventListener('offline', callback);
 };
}
Now React knows how to read the value from the external navigator.onLine API and how to subscribe to its changes. Disconnect your device from the network and notice that the component re-renders in response:
App.js
DownloadReset
Fork
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}


Show more

Extracting the logic to a custom Hook 
Usually you won’t write useSyncExternalStore directly in your components. Instead, you’ll typically call it from your own custom Hook. This lets you use the same external store from different components.
For example, this custom useOnlineStatus Hook tracks whether the network is online:
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
 const isOnline = useSyncExternalStore(subscribe, getSnapshot);
 return isOnline;
}

function getSnapshot() {
 // ...
}

function subscribe(callback) {
 // ...
}
Now different components can call useOnlineStatus without repeating the underlying implementation:
App.jsuseOnlineStatus.js
Reset
Fork
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}


Show more

Adding support for server rendering 
If your React app uses server rendering, your React components will also run outside the browser environment to generate the initial HTML. This creates a few challenges when connecting to an external store:
If you’re connecting to a browser-only API, it won’t work because it does not exist on the server.
If you’re connecting to a third-party data store, you’ll need its data to match between the server and client.
To solve these issues, pass a getServerSnapshot function as the third argument to useSyncExternalStore:
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
 const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
 return isOnline;
}

function getSnapshot() {
 return navigator.onLine;
}

function getServerSnapshot() {
 return true; // Always show "Online" for server-generated HTML
}

function subscribe(callback) {
 // ...
}
The getServerSnapshot function is similar to getSnapshot, but it runs only in two situations:
It runs on the server when generating the HTML.
It runs on the client during hydration, i.e. when React takes the server HTML and makes it interactive.
This lets you provide the initial snapshot value which will be used before the app becomes interactive. If there is no meaningful initial value for the server rendering, omit this argument to force rendering on the client.
Note
Make sure that getServerSnapshot returns the same exact data on the initial client render as it returned on the server. For example, if getServerSnapshot returned some prepopulated store content on the server, you need to transfer this content to the client. One way to do this is to emit a <script> tag during server rendering that sets a global like window.MY_STORE_DATA, and read from that global on the client in getServerSnapshot. Your external store should provide instructions on how to do that.

Troubleshooting 
I’m getting an error: “The result of getSnapshot should be cached” 
This error means your getSnapshot function returns a new object every time it’s called, for example:
function getSnapshot() {
 // 🔴 Do not return always different objects from getSnapshot
 return {
   todos: myStore.todos
 };
}
React will re-render the component if getSnapshot return value is different from the last time. This is why, if you always return a different value, you will enter an infinite loop and get this error.
Your getSnapshot object should only return a different object if something has actually changed. If your store contains immutable data, you can return that data directly:
function getSnapshot() {
 // ✅ You can return immutable data
 return myStore.todos;
}
If your store data is mutable, your getSnapshot function should return an immutable snapshot of it. This means it does need to create new objects, but it shouldn’t do this for every single call. Instead, it should store the last calculated snapshot, and return the same snapshot as the last time if the data in the store has not changed. How you determine whether mutable data has changed depends on your mutable store.

My subscribe function gets called after every re-render 
This subscribe function is defined inside a component so it is different on every re-render:
function ChatIndicator() {
 // 🚩 Always a different function, so React will resubscribe on every re-render
 function subscribe() {
   // ...
 }

 const isOnline = useSyncExternalStore(subscribe, getSnapshot);

 // ...
}
React will resubscribe to your store if you pass a different subscribe function between re-renders. If this causes performance issues and you’d like to avoid resubscribing, move the subscribe function outside:
// ✅ Always the same function, so React won't need to resubscribe
function subscribe() {
 // ...
}

function ChatIndicator() {
 const isOnline = useSyncExternalStore(subscribe, getSnapshot);
 // ...
}
Alternatively, wrap subscribe into useCallback to only resubscribe when some argument changes:
function ChatIndicator({ userId }) {
 // ✅ Same function as long as userId doesn't change
 const subscribe = useCallback(() => {
   // ...
 }, [userId]);

 const isOnline = useSyncExternalStore(subscribe, getSnapshot);

 // ...
}
PrevioususeState
NextuseTransition

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
useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
Usage
Subscribing to an external store
Subscribing to a browser API
Extracting the logic to a custom Hook
Adding support for server rendering
Troubleshooting
I’m getting an error: “The result of getSnapshot should be cached”
My subscribe function gets called after every re-render
useSyncExternalStore – React
useTransition
useTransition is a React Hook that lets you render a part of the UI in the background.
const [isPending, startTransition] = useTransition()
Reference
useTransition()
startTransition(action)
Usage
Perform non-blocking updates with Actions
Exposing action prop from components
Displaying a pending visual state
Preventing unwanted loading indicators
Building a Suspense-enabled router
Displaying an error to users with an error boundary
Troubleshooting
Updating an input in a Transition doesn’t work
React doesn’t treat my state update as a Transition
React doesn’t treat my state update after await as a Transition
I want to call useTransition from outside a component
The function I pass to startTransition executes immediately
My state updates in Transitions are out of order

Reference 
useTransition() 
Call useTransition at the top level of your component to mark some state updates as Transitions.
import { useTransition } from 'react';

function TabContainer() {
 const [isPending, startTransition] = useTransition();
 // ...
}
See more examples below.
Parameters 
useTransition does not take any parameters.
Returns 
useTransition returns an array with exactly two items:
The isPending flag that tells you whether there is a pending Transition.
The startTransition function that lets you mark updates as a Transition.

startTransition(action) 
The startTransition function returned by useTransition lets you mark an update as a Transition.
function TabContainer() {
 const [isPending, startTransition] = useTransition();
 const [tab, setTab] = useState('about');

 function selectTab(nextTab) {
   startTransition(() => {
     setTab(nextTab);
   });
 }
 // ...
}
Note
Functions called in startTransition are called “Actions”. 
The function passed to startTransition is called an “Action”. By convention, any callback called inside startTransition (such as a callback prop) should be named action or include the “Action” suffix:
function SubmitButton({ submitAction }) {
 const [isPending, startTransition] = useTransition();

 return (
   <button
     disabled={isPending}
     onClick={() => {
       startTransition(async () => {
         await submitAction();
       });
     }}
   >
     Submit
   </button>
 );
}
Parameters 
action: A function that updates some state by calling one or more set functions. React calls action immediately with no parameters and marks all state updates scheduled synchronously during the action function call as Transitions. Any async calls that are awaited in the action will be included in the Transition, but currently require wrapping any set functions after the await in an additional startTransition (see Troubleshooting). State updates marked as Transitions will be non-blocking and will not display unwanted loading indicators.
Returns 
startTransition does not return anything.
Caveats 
useTransition is a Hook, so it can only be called inside components or custom Hooks. If you need to start a Transition somewhere else (for example, from a data library), call the standalone startTransition instead.
You can wrap an update into a Transition only if you have access to the set function of that state. If you want to start a Transition in response to some prop or a custom Hook value, try useDeferredValue instead.
The function you pass to startTransition is called immediately, marking all state updates that happen while it executes as Transitions. If you try to perform state updates in a setTimeout, for example, they won’t be marked as Transitions.
You must wrap any state updates after any async requests in another startTransition to mark them as Transitions. This is a known limitation that we will fix in the future (see Troubleshooting).
The startTransition function has a stable identity, so you will often see it omitted from Effect dependencies, but including it will not cause the Effect to fire. If the linter lets you omit a dependency without errors, it is safe to do. Learn more about removing Effect dependencies.
A state update marked as a Transition will be interrupted by other state updates. For example, if you update a chart component inside a Transition, but then start typing into an input while the chart is in the middle of a re-render, React will restart the rendering work on the chart component after handling the input update.
Transition updates can’t be used to control text inputs.
If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that may be removed in a future release.
Usage 
Perform non-blocking updates with Actions 
Call useTransition at the top of your component to create Actions, and access the pending state:
import {useState, useTransition} from 'react';

function CheckoutForm() {
 const [isPending, startTransition] = useTransition();
 // ...
}
useTransition returns an array with exactly two items:
The isPending flag that tells you whether there is a pending Transition.
The startTransition function that lets you create an Action.
To start a Transition, pass a function to startTransition like this:
import {useState, useTransition} from 'react';
import {updateQuantity} from './api';

function CheckoutForm() {
 const [isPending, startTransition] = useTransition();
 const [quantity, setQuantity] = useState(1);

 function onSubmit(newQuantity) {
   startTransition(async function () {
     const savedQuantity = await updateQuantity(newQuantity);
     startTransition(() => {
       setQuantity(savedQuantity);
     });
   });
 }
 // ...
}
The function passed to startTransition is called the “Action”. You can update state and (optionally) perform side effects within an Action, and the work will be done in the background without blocking user interactions on the page. A Transition can include multiple Actions, and while a Transition is in progress, your UI stays responsive. For example, if the user clicks a tab but then changes their mind and clicks another tab, the second click will be immediately handled without waiting for the first update to finish.
To give the user feedback about in-progress Transitions, the isPending state switches to true at the first call to startTransition, and stays true until all Actions complete and the final state is shown to the user. Transitions ensure side effects in Actions to complete in order to prevent unwanted loading indicators, and you can provide immediate feedback while the Transition is in progress with useOptimistic.
The difference between Actions and regular event handling
1. Updating the quantity in an Action2. Updating the quantity without an Action
Example 1 of 2: Updating the quantity in an Action 
In this example, the updateQuantity function simulates a request to the server to update the item’s quantity in the cart. This function is artificially slowed down so that it takes at least a second to complete the request.
Update the quantity multiple times quickly. Notice that the pending “Total” state is shown while any requests are in progress, and the “Total” updates only after the final request is complete. Because the update is in an Action, the “quantity” can continue to be updated while the request is in progress.
App.jsItem.jsTotal.jsapi.js
Reset
Fork
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const updateQuantityAction = async newQuantity => {
    // To access the pending state of a transition,
    // call startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}


Show more
This is a basic example to demonstrate how Actions work, but this example does not handle requests completing out of order. When updating the quantity multiple times, it’s possible for the previous requests to finish after later requests causing the quantity to update out of order. This is a known limitation that we will fix in the future (see Troubleshooting below).
For common use cases, React provides built-in abstractions such as:
useActionState
<form> actions
Server Functions
These solutions handle request ordering for you. When using Transitions to build your own custom hooks or libraries that manage async state transitions, you have greater control over the request ordering, but you must handle it yourself.
Next Example

Exposing action prop from components 
You can expose an action prop from a component to allow a parent to call an Action.
For example, this TabButton component wraps its onClick logic in an action prop:
export default function TabButton({ action, children, isActive }) {
 const [isPending, startTransition] = useTransition();
 if (isActive) {
   return <b>{children}</b>
 }
 return (
   <button onClick={() => {
     startTransition(async () => {
       // await the action that's passed in.
       // This allows it to be either sync or async.
       await action();
     });
   }}>
     {children}
   </button>
 );
}
Because the parent component updates its state inside the action, that state update gets marked as a Transition. This means you can click on “Posts” and then immediately click “Contact” and it does not block user interactions:
App.jsTabButton.jsAboutTab.jsPostsTab.jsContactTab.js
Reset
Fork
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={async () => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async. 
        await action();
      });
    }}>
      {children}
    </button>
  );
}


Show more
Note
When exposing an action prop from a component, you should await it inside the transition.
This allows the action callback to be either synchronous or asynchronous without requiring an additional startTransition to wrap the await in the action.

Displaying a pending visual state 
You can use the isPending boolean value returned by useTransition to indicate to the user that a Transition is in progress. For example, the tab button can have a special “pending” visual state:
function TabButton({ action, children, isActive }) {
 const [isPending, startTransition] = useTransition();
 // ...
 if (isPending) {
   return <b className="pending">{children}</b>;
 }
 // ...
Notice how clicking “Posts” now feels more responsive because the tab button itself updates right away:
App.jsTabButton.jsAboutTab.jsPostsTab.jsContactTab.js
Reset
Fork
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}


Show more

Preventing unwanted loading indicators 
In this example, the PostsTab component fetches some data using use. When you click the “Posts” tab, the PostsTab component suspends, causing the closest loading fallback to appear:
App.jsTabButton.js
Reset
Fork
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}


Show more
Hiding the entire tab container to show a loading indicator leads to a jarring user experience. If you add useTransition to TabButton, you can instead display the pending state in the tab button instead.
Notice that clicking “Posts” no longer replaces the entire tab container with a spinner:
App.jsTabButton.js
Reset
Fork
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}


Show more
Read more about using Transitions with Suspense.
Note
Transitions only “wait” long enough to avoid hiding already revealed content (like the tab container). If the Posts tab had a nested <Suspense> boundary, the Transition would not “wait” for it.

Building a Suspense-enabled router 
If you’re building a React framework or a router, we recommend marking page navigations as Transitions.
function Router() {
 const [page, setPage] = useState('/');
 const [isPending, startTransition] = useTransition();

 function navigate(url) {
   startTransition(() => {
     setPage(url);
   });
 }
 // ...
This is recommended for three reasons:
Transitions are interruptible, which lets the user click away without waiting for the re-render to complete.
Transitions prevent unwanted loading indicators, which lets the user avoid jarring jumps on navigation.
Transitions wait for all pending actions which lets the user wait for side effects to complete before the new page is shown.
Here is a simplified router example using Transitions for navigations.
App.jsLayout.jsIndexPage.jsArtistPage.jsAlbums.jsBiography.jsPanel.js
Reset
Fork
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}


Show more
Note
Suspense-enabled routers are expected to wrap the navigation updates into Transitions by default.

Displaying an error to users with an error boundary 
If a function passed to startTransition throws an error, you can display an error to your user with an error boundary. To use an error boundary, wrap the component where you are calling the useTransition in an error boundary. Once the function passed to startTransition errors, the fallback for the error boundary will be displayed.
AddCommentContainer.js
Reset
Fork
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // For demonstration purposes to show Error Boundary
  if (comment == null) {
    throw new Error("Example Error: An error thrown to trigger error boundary");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Intentionally not passing a comment
          // so error gets thrown
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}


Show more

Troubleshooting 
Updating an input in a Transition doesn’t work 
You can’t use a Transition for a state variable that controls an input:
const [text, setText] = useState('');
// ...
function handleChange(e) {
 // ❌ Can't use Transitions for controlled input state
 startTransition(() => {
   setText(e.target.value);
 });
}
// ...
return <input value={text} onChange={handleChange} />;
This is because Transitions are non-blocking, but updating an input in response to the change event should happen synchronously. If you want to run a Transition in response to typing, you have two options:
You can declare two separate state variables: one for the input state (which always updates synchronously), and one that you will update in a Transition. This lets you control the input using the synchronous state, and pass the Transition state variable (which will “lag behind” the input) to the rest of your rendering logic.
Alternatively, you can have one state variable, and add useDeferredValue which will “lag behind” the real value. It will trigger non-blocking re-renders to “catch up” with the new value automatically.

React doesn’t treat my state update as a Transition 
When you wrap a state update in a Transition, make sure that it happens during the startTransition call:
startTransition(() => {
 // ✅ Setting state *during* startTransition call
 setPage('/about');
});
The function you pass to startTransition must be synchronous. You can’t mark an update as a Transition like this:
startTransition(() => {
 // ❌ Setting state *after* startTransition call
 setTimeout(() => {
   setPage('/about');
 }, 1000);
});
Instead, you could do this:
setTimeout(() => {
 startTransition(() => {
   // ✅ Setting state *during* startTransition call
   setPage('/about');
 });
}, 1000);

React doesn’t treat my state update after await as a Transition 
When you use await inside a startTransition function, the state updates that happen after the await are not marked as Transitions. You must wrap state updates after each await in a startTransition call:
startTransition(async () => {
 await someAsyncFunction();
 // ❌ Not using startTransition after await
 setPage('/about');
});
However, this works instead:
startTransition(async () => {
 await someAsyncFunction();
 // ✅ Using startTransition *after* await
 startTransition(() => {
   setPage('/about');
 });
});
This is a JavaScript limitation due to React losing the scope of the async context. In the future, when AsyncContext is available, this limitation will be removed.

I want to call useTransition from outside a component 
You can’t call useTransition outside a component because it’s a Hook. In this case, use the standalone startTransition method instead. It works the same way, but it doesn’t provide the isPending indicator.

The function I pass to startTransition executes immediately 
If you run this code, it will print 1, 2, 3:
console.log(1);
startTransition(() => {
 console.log(2);
 setPage('/about');
});
console.log(3);
It is expected to print 1, 2, 3. The function you pass to startTransition does not get delayed. Unlike with the browser setTimeout, it does not run the callback later. React executes your function immediately, but any state updates scheduled while it is running are marked as Transitions. You can imagine that it works like this:
// A simplified version of how React works

let isInsideTransition = false;

function startTransition(scope) {
 isInsideTransition = true;
 scope();
 isInsideTransition = false;
}

function setState() {
 if (isInsideTransition) {
   // ... schedule a Transition state update ...
 } else {
   // ... schedule an urgent state update ...
 }
}
My state updates in Transitions are out of order 
If you await inside startTransition, you might see the updates happen out of order.
In this example, the updateQuantity function simulates a request to the server to update the item’s quantity in the cart. This function artificially returns the every other request after the previous to simulate race conditions for network requests.
Try updating the quantity once, then update it quickly multiple times. You might see the incorrect total:
App.jsItem.jsTotal.jsapi.js
Reset
Fork
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);
  
  const updateQuantityAction = newQuantity => {
    setClientQuantity(newQuantity);

    // Access the pending state of the transition,
    // by wrapping in startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}


Show more
When clicking multiple times, it’s possible for previous requests to finish after later requests. When this happens, React currently has no way to know the intended order. This is because the updates are scheduled asynchronously, and React loses context of the order across the async boundary.
This is expected, because Actions within a Transition do not guarantee execution order. For common use cases, React provides higher-level abstractions like useActionState and <form> actions that handle ordering for you. For advanced use cases, you’ll need to implement your own queuing and abort logic to handle this.
Example of useActionState handling execution order:
App.jsItem.jsTotal.jsapi.js
Reset
Fork
import { useState, useActionState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);
  const [quantity, updateQuantityAction, isPending] = useActionState(
    async (prevState, payload) => {
      setClientQuantity(payload);
      const savedQuantity = await updateQuantity(payload);
      return savedQuantity; // Return the new quantity to update the state
    },
    1 // Initial quantity
  );

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}


Show more
PrevioususeSyncExternalStore
NextComponents

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
useTransition()
startTransition(action)
Usage
Perform non-blocking updates with Actions
Exposing action prop from components
Displaying a pending visual state
Preventing unwanted loading indicators
Building a Suspense-enabled router
Displaying an error to users with an error boundary
Troubleshooting
Updating an input in a Transition doesn’t work
React doesn’t treat my state update as a Transition
React doesn’t treat my state update after await as a Transition
I want to call useTransition from outside a component
The function I pass to startTransition executes immediately
My state updates in Transitions are out of order
useTransition – React
Built-in React Components
React exposes a few built-in components that you can use in your JSX.

Built-in components 
<Fragment>, alternatively written as <>...</>, lets you group multiple JSX nodes together.
<Profiler> lets you measure rendering performance of a React tree programmatically.
<Suspense> lets you display a fallback while the child components are loading.
<StrictMode> enables extra development-only checks that help you find bugs early.

Your own components 
You can also define your own components as JavaScript functions.
PrevioususeTransition

<Fragment> (<>...</>)
<Fragment>, often used via <>...</> syntax, lets you group elements without a wrapper node.
<>
 <OneChild />
 <AnotherChild />
</>
Reference
<Fragment>
Usage
Returning multiple elements
Assigning multiple elements to a variable
Grouping elements with text
Rendering a list of Fragments

Reference 
<Fragment> 
Wrap elements in <Fragment> to group them together in situations where you need a single element. Grouping elements in Fragment has no effect on the resulting DOM; it is the same as if the elements were not grouped. The empty JSX tag <></> is shorthand for <Fragment></Fragment> in most cases.
Props 
optional key: Fragments declared with the explicit <Fragment> syntax may have keys.
Caveats 
If you want to pass key to a Fragment, you can’t use the <>...</> syntax. You have to explicitly import Fragment from 'react' and render <Fragment key={yourKey}>...</Fragment>.
React does not reset state when you go from rendering <><Child /></> to [<Child />] or back, or when you go from rendering <><Child /></> to <Child /> and back. This only works a single level deep: for example, going from <><><Child /></></> to <Child /> resets the state. See the precise semantics here.

Usage 
Returning multiple elements 
Use Fragment, or the equivalent <>...</> syntax, to group multiple elements together. You can use it to put multiple elements in any place where a single element can go. For example, a component can only return one element, but by using a Fragment you can group multiple elements together and then return them as a group:
function Post() {
 return (
   <>
     <PostTitle />
     <PostBody />
   </>
 );
}
Fragments are useful because grouping elements with a Fragment has no effect on layout or styles, unlike if you wrapped the elements in another container like a DOM element. If you inspect this example with the browser tools, you’ll see that all <h1> and <article> DOM nodes appear as siblings without wrappers around them:
App.js
DownloadReset
Fork
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}


Show more
Deep Dive
How to write a Fragment without the special syntax? 
Show Details










Assigning multiple elements to a variable 
Like any other element, you can assign Fragment elements to variables, pass them as props, and so on:
function CloseDialog() {
 const buttons = (
   <>
     <OKButton />
     <CancelButton />
   </>
 );
 return (
   <AlertDialog buttons={buttons}>
     Are you sure you want to leave this page?
   </AlertDialog>
 );
}

Grouping elements with text 
You can use Fragment to group text together with components:
function DateRangePicker({ start, end }) {
 return (
   <>
     From
     <DatePicker date={start} />
     to
     <DatePicker date={end} />
   </>
 );
}

Rendering a list of Fragments 
Here’s a situation where you need to write Fragment explicitly instead of using the <></> syntax. When you render multiple elements in a loop, you need to assign a key to each element. If the elements within the loop are Fragments, you need to use the normal JSX element syntax in order to provide the key attribute:
function Blog() {
 return posts.map(post =>
   <Fragment key={post.id}>
     <PostTitle title={post.title} />
     <PostBody body={post.body} />
   </Fragment>
 );
}
You can inspect the DOM to verify that there are no wrapper elements around the Fragment children:
App.js
DownloadReset
Fork
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}


Show more
PreviousComponents
Next<Profiler>

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
<Fragment>
Usage
Returning multiple elements
Assigning multiple elements to a variable
Grouping elements with text
Rendering a list of Fragments
<Fragment> (<>...</>) – React
<Profiler>
<Profiler> lets you measure rendering performance of a React tree programmatically.
<Profiler id="App" onRender={onRender}>
 <App />
</Profiler>
Reference
<Profiler>
onRender callback
Usage
Measuring rendering performance programmatically
Measuring different parts of the application

Reference 
<Profiler> 
Wrap a component tree in a <Profiler> to measure its rendering performance.
<Profiler id="App" onRender={onRender}>
 <App />
</Profiler>
Props 
id: A string identifying the part of the UI you are measuring.
onRender: An onRender callback that React calls every time components within the profiled tree update. It receives information about what was rendered and how much time it took.
Caveats 
Profiling adds some additional overhead, so it is disabled in the production build by default. To opt into production profiling, you need to enable a special production build with profiling enabled.

onRender callback 
React will call your onRender callback with information about what was rendered.
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
 // Aggregate or log render timings...
}
Parameters 
id: The string id prop of the <Profiler> tree that has just committed. This lets you identify which part of the tree was committed if you are using multiple profilers.
phase: "mount", "update" or "nested-update". This lets you know whether the tree has just been mounted for the first time or re-rendered due to a change in props, state, or Hooks.
actualDuration: The number of milliseconds spent rendering the <Profiler> and its descendants for the current update. This indicates how well the subtree makes use of memoization (e.g. memo and useMemo). Ideally this value should decrease significantly after the initial mount as many of the descendants will only need to re-render if their specific props change.
baseDuration: The number of milliseconds estimating how much time it would take to re-render the entire <Profiler> subtree without any optimizations. It is calculated by summing up the most recent render durations of each component in the tree. This value estimates a worst-case cost of rendering (e.g. the initial mount or a tree with no memoization). Compare actualDuration against it to see if memoization is working.
startTime: A numeric timestamp for when React began rendering the current update.
commitTime: A numeric timestamp for when React committed the current update. This value is shared between all profilers in a commit, enabling them to be grouped if desirable.

Usage 
Measuring rendering performance programmatically 
Wrap the <Profiler> component around a React tree to measure its rendering performance.
<App>
 <Profiler id="Sidebar" onRender={onRender}>
   <Sidebar />
 </Profiler>
 <PageContent />
</App>
It requires two props: an id (string) and an onRender callback (function) which React calls any time a component within the tree “commits” an update.
Pitfall
Profiling adds some additional overhead, so it is disabled in the production build by default. To opt into production profiling, you need to enable a special production build with profiling enabled.
Note
<Profiler> lets you gather measurements programmatically. If you’re looking for an interactive profiler, try the Profiler tab in React Developer Tools. It exposes similar functionality as a browser extension.

Measuring different parts of the application 
You can use multiple <Profiler> components to measure different parts of your application:
<App>
 <Profiler id="Sidebar" onRender={onRender}>
   <Sidebar />
 </Profiler>
 <Profiler id="Content" onRender={onRender}>
   <Content />
 </Profiler>
</App>
You can also nest <Profiler> components:
<App>
 <Profiler id="Sidebar" onRender={onRender}>
   <Sidebar />
 </Profiler>
 <Profiler id="Content" onRender={onRender}>
   <Content>
     <Profiler id="Editor" onRender={onRender}>
       <Editor />
     </Profiler>
     <Preview />
   </Content>
 </Profiler>
</App>
Although <Profiler> is a lightweight component, it should be used only when necessary. Each use adds some CPU and memory overhead to an application.

Previous<Fragment> (<>)
Next<StrictMode>

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
<Profiler>
onRender callback
Usage
Measuring rendering performance programmatically
Measuring different parts of the application
<Profiler> – React
<StrictMode>
<StrictMode> lets you find common bugs in your components early during development.
<StrictMode>
 <App />
</StrictMode>
Reference
<StrictMode>
Usage
Enabling Strict Mode for entire app
Enabling Strict Mode for a part of the app
Fixing bugs found by double rendering in development
Fixing bugs found by re-running Effects in development
Fixing bugs found by re-running ref callbacks in development
Fixing deprecation warnings enabled by Strict Mode

Reference 
<StrictMode> 
Use StrictMode to enable additional development behaviors and warnings for the component tree inside:
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
 <StrictMode>
   <App />
 </StrictMode>
);
See more examples below.
Strict Mode enables the following development-only behaviors:
Your components will re-render an extra time to find bugs caused by impure rendering.
Your components will re-run Effects an extra time to find bugs caused by missing Effect cleanup.
Your components will re-run refs callbacks an extra time to find bugs caused by missing ref cleanup.
Your components will be checked for usage of deprecated APIs.
Props 
StrictMode accepts no props.
Caveats 
There is no way to opt out of Strict Mode inside a tree wrapped in <StrictMode>. This gives you confidence that all components inside <StrictMode> are checked. If two teams working on a product disagree whether they find the checks valuable, they need to either reach consensus or move <StrictMode> down in the tree.

Usage 
Enabling Strict Mode for entire app 
Strict Mode enables extra development-only checks for the entire component tree inside the <StrictMode> component. These checks help you find common bugs in your components early in the development process.
To enable Strict Mode for your entire app, wrap your root component with <StrictMode> when you render it:
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
 <StrictMode>
   <App />
 </StrictMode>
);
We recommend wrapping your entire app in Strict Mode, especially for newly created apps. If you use a framework that calls createRoot for you, check its documentation for how to enable Strict Mode.
Although the Strict Mode checks only run in development, they help you find bugs that already exist in your code but can be tricky to reliably reproduce in production. Strict Mode lets you fix bugs before your users report them.
Note
Strict Mode enables the following checks in development:
Your components will re-render an extra time to find bugs caused by impure rendering.
Your components will re-run Effects an extra time to find bugs caused by missing Effect cleanup.
Your components will re-run ref callbacks an extra time to find bugs caused by missing ref cleanup.
Your components will be checked for usage of deprecated APIs.
All of these checks are development-only and do not impact the production build.

Enabling Strict Mode for a part of the app 
You can also enable Strict Mode for any part of your application:
import { StrictMode } from 'react';

function App() {
 return (
   <>
     <Header />
     <StrictMode>
       <main>
         <Sidebar />
         <Content />
       </main>
     </StrictMode>
     <Footer />
   </>
 );
}
In this example, Strict Mode checks will not run against the Header and Footer components. However, they will run on Sidebar and Content, as well as all of the components inside them, no matter how deep.
Note
When StrictMode is enabled for a part of the app, React will only enable behaviors that are possible in production. For example, if <StrictMode> is not enabled at the root of the app, it will not re-run Effects an extra time on initial mount, since this would cause child effects to double fire without the parent effects, which cannot happen in production.

Fixing bugs found by double rendering in development 
React assumes that every component you write is a pure function. This means that React components you write must always return the same JSX given the same inputs (props, state, and context).
Components breaking this rule behave unpredictably and cause bugs. To help you find accidentally impure code, Strict Mode calls some of your functions (only the ones that should be pure) twice in development. This includes:
Your component function body (only top-level logic, so this doesn’t include code inside event handlers)
Functions that you pass to useState, set functions, useMemo, or useReducer
Some class component methods like constructor, render, shouldComponentUpdate (see the whole list)
If a function is pure, running it twice does not change its behavior because a pure function produces the same result every time. However, if a function is impure (for example, it mutates the data it receives), running it twice tends to be noticeable (that’s what makes it impure!) This helps you spot and fix the bug early.
Here is an example to illustrate how double rendering in Strict Mode helps you find bugs early.
This StoryTray component takes an array of stories and adds one last “Create Story” item at the end:
index.jsApp.jsStoryTray.js
Reset
Fork
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}


There is a mistake in the code above. However, it is easy to miss because the initial output appears correct.
This mistake will become more noticeable if the StoryTray component re-renders multiple times. For example, let’s make the StoryTray re-render with a different background color whenever you hover over it:
index.jsApp.jsStoryTray.js
Reset
Fork
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}


Show more
Notice how every time you hover over the StoryTray component, “Create Story” gets added to the list again. The intention of the code was to add it once at the end. But StoryTray directly modifies the stories array from the props. Every time StoryTray renders, it adds “Create Story” again at the end of the same array. In other words, StoryTray is not a pure function—running it multiple times produces different results.
To fix this problem, you can make a copy of the array, and modify that copy instead of the original one:
export default function StoryTray({ stories }) {
 const items = stories.slice(); // Clone the array
 // ✅ Good: Pushing into a new array
 items.push({ id: 'create', label: 'Create Story' });
This would make the StoryTray function pure. Each time it is called, it would only modify a new copy of the array, and would not affect any external objects or variables. This solves the bug, but you had to make the component re-render more often before it became obvious that something is wrong with its behavior.
In the original example, the bug wasn’t obvious. Now let’s wrap the original (buggy) code in <StrictMode>:
index.jsApp.jsStoryTray.js
Reset
Fork
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}


Strict Mode always calls your rendering function twice, so you can see the mistake right away (“Create Story” appears twice). This lets you notice such mistakes early in the process. When you fix your component to render in Strict Mode, you also fix many possible future production bugs like the hover functionality from before:
index.jsApp.jsStoryTray.js
Reset
Fork
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Clone the array
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}


Show more
Without Strict Mode, it was easy to miss the bug until you added more re-renders. Strict Mode made the same bug appear right away. Strict Mode helps you find bugs before you push them to your team and to your users.
Read more about keeping components pure.
Note
If you have React DevTools installed, any console.log calls during the second render call will appear slightly dimmed. React DevTools also offers a setting (off by default) to suppress them completely.

Fixing bugs found by re-running Effects in development 
Strict Mode can also help find bugs in Effects.
Every Effect has some setup code and may have some cleanup code. Normally, React calls setup when the component mounts (is added to the screen) and calls cleanup when the component unmounts (is removed from the screen). React then calls cleanup and setup again if its dependencies changed since the last render.
When Strict Mode is on, React will also run one extra setup+cleanup cycle in development for every Effect. This may feel surprising, but it helps reveal subtle bugs that are hard to catch manually.
Here is an example to illustrate how re-running Effects in Strict Mode helps you find bugs early.
Consider this example that connects a component to a chat:
index.jsApp.jschat.js
Reset
Fork
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);


There is an issue with this code, but it might not be immediately clear.
To make the issue more obvious, let’s implement a feature. In the example below, roomId is not hardcoded. Instead, the user can select the roomId that they want to connect to from a dropdown. Click “Open chat” and then select different chat rooms one by one. Keep track of the number of active connections in the console:
index.jsApp.jschat.js
Reset
Fork
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);


You’ll notice that the number of open connections always keeps growing. In a real app, this would cause performance and network problems. The issue is that your Effect is missing a cleanup function:
 useEffect(() => {
   const connection = createConnection(serverUrl, roomId);
   connection.connect();
   return () => connection.disconnect();
 }, [roomId]);
Now that your Effect “cleans up” after itself and destroys the outdated connections, the leak is solved. However, notice that the problem did not become visible until you’ve added more features (the select box).
In the original example, the bug wasn’t obvious. Now let’s wrap the original (buggy) code in <StrictMode>:
index.jsApp.jschat.js
Reset
Fork
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);


With Strict Mode, you immediately see that there is a problem (the number of active connections jumps to 2). Strict Mode runs an extra setup+cleanup cycle for every Effect. This Effect has no cleanup logic, so it creates an extra connection but doesn’t destroy it. This is a hint that you’re missing a cleanup function.
Strict Mode lets you notice such mistakes early in the process. When you fix your Effect by adding a cleanup function in Strict Mode, you also fix many possible future production bugs like the select box from before:
index.jsApp.jschat.js
Reset
Fork
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);


Notice how the active connection count in the console doesn’t keep growing anymore.
Without Strict Mode, it was easy to miss that your Effect needed cleanup. By running setup → cleanup → setup instead of setup for your Effect in development, Strict Mode made the missing cleanup logic more noticeable.
Read more about implementing Effect cleanup.

Fixing bugs found by re-running ref callbacks in development 
Strict Mode can also help find bugs in callbacks refs.
Every callback ref has some setup code and may have some cleanup code. Normally, React calls setup when the element is created (is added to the DOM) and calls cleanup when the element is removed (is removed from the DOM).
When Strict Mode is on, React will also run one extra setup+cleanup cycle in development for every callback ref. This may feel surprising, but it helps reveal subtle bugs that are hard to catch manually.
Consider this example, which allows you to select an animal and then scroll to one of them. Notice when you switch from “Cats” to “Dogs”, the console logs show that the number of animals in the list keeps growing, and the “Scroll to” buttons stop working:
index.jsApp.js
Reset
Fork
import { useRef, useState } from "react";

export default function AnimalFriends() {
  const itemsRef = useRef([]);
  const [animalList, setAnimalList] = useState(setupAnimalList);
  const [animal, setAnimal] = useState('cat');

  function scrollToAnimal(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  
  const animals = animalList.filter(a => a.type === animal)
  
  return (
    <>
      <nav>
        <button onClick={() => setAnimal('cat')}>Cats</button>
        <button onClick={() => setAnimal('dog')}>Dogs</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{animals.map((animal, index) => (
          <button key={animal.src} onClick={() => scrollToAnimal(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {animals.map((animal) => (
              <li
                key={animal.src}
                ref={(node) => {
                  const list = itemsRef.current;
                  const item = {animal: animal, node}; 
                  list.push(item);
                  console.log(`✅ Adding animal to the map. Total animals: ${list.length}`);
                  if (list.length > 10) {
                    console.log('❌ Too many animals in the list!');
                  }
                  return () => {
                    // 🚩 No cleanup, this is a bug!
                  }
                }}
              >
                <img src={animal.src} />
              </li>
            ))}
          
        </ul>
      </div>
    </>
  );
}

function setupAnimalList() {
  const animalList = [];
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'cat', src: "https://loremflickr.com/320/240/cat?lock=" + i});
  }
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'dog', src: "https://loremflickr.com/320/240/dog?lock=" + i});
  }

  return animalList;
}


Show more
This is a production bug! Since the ref callback doesn’t remove animals from the list in the cleanup, the list of animals keeps growing. This is a memory leak that can cause performance problems in a real app, and breaks the behavior of the app.
The issue is the ref callback doesn’t cleanup after itself:
<li
 ref={node => {
   const list = itemsRef.current;
   const item = {animal, node};
   list.push(item);
   return () => {
     // 🚩 No cleanup, this is a bug!
   }
 }}
</li>
Now let’s wrap the original (buggy) code in <StrictMode>:
index.jsApp.js
Reset
Fork
import { useRef, useState } from "react";

export default function AnimalFriends() {
  const itemsRef = useRef([]);
  const [animalList, setAnimalList] = useState(setupAnimalList);
  const [animal, setAnimal] = useState('cat');

  function scrollToAnimal(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  
  const animals = animalList.filter(a => a.type === animal)
  
  return (
    <>
      <nav>
        <button onClick={() => setAnimal('cat')}>Cats</button>
        <button onClick={() => setAnimal('dog')}>Dogs</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{animals.map((animal, index) => (
          <button key={animal.src} onClick={() => scrollToAnimal(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {animals.map((animal) => (
              <li
                key={animal.src}
                ref={(node) => {
                  const list = itemsRef.current;
                  const item = {animal: animal, node} 
                  list.push(item);
                  console.log(`✅ Adding animal to the map. Total animals: ${list.length}`);
                  if (list.length > 10) {
                    console.log('❌ Too many animals in the list!');
                  }
                  return () => {
                    // 🚩 No cleanup, this is a bug!
                  }
                }}
              >
                <img src={animal.src} />
              </li>
            ))}
          
        </ul>
      </div>
    </>
  );
}

function setupAnimalList() {
  const animalList = [];
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'cat', src: "https://loremflickr.com/320/240/cat?lock=" + i});
  }
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'dog', src: "https://loremflickr.com/320/240/dog?lock=" + i});
  }

  return animalList;
}


Show more
With Strict Mode, you immediately see that there is a problem. Strict Mode runs an extra setup+cleanup cycle for every callback ref. This callback ref has no cleanup logic, so it adds refs but doesn’t remove them. This is a hint that you’re missing a cleanup function.
Strict Mode lets you eagerly find mistakes in callback refs. When you fix your callback by adding a cleanup function in Strict Mode, you also fix many possible future production bugs like the “Scroll to” bug from before:
index.jsApp.js
Reset
Fork
import { useRef, useState } from "react";

export default function AnimalFriends() {
  const itemsRef = useRef([]);
  const [animalList, setAnimalList] = useState(setupAnimalList);
  const [animal, setAnimal] = useState('cat');

  function scrollToAnimal(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  
  const animals = animalList.filter(a => a.type === animal)
  
  return (
    <>
      <nav>
        <button onClick={() => setAnimal('cat')}>Cats</button>
        <button onClick={() => setAnimal('dog')}>Dogs</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{animals.map((animal, index) => (
          <button key={animal.src} onClick={() => scrollToAnimal(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {animals.map((animal) => (
              <li
                key={animal.src}
                ref={(node) => {
                  const list = itemsRef.current;
                  const item = {animal, node};
                  list.push({animal: animal, node});
                  console.log(`✅ Adding animal to the map. Total animals: ${list.length}`);
                  if (list.length > 10) {
                    console.log('❌ Too many animals in the list!');
                  }
                  return () => {
                    list.splice(list.indexOf(item));
                    console.log(`❌ Removing animal from the map. Total animals: ${itemsRef.current.length}`);
                  }
                }}
              >
                <img src={animal.src} />
              </li>
            ))}
          
        </ul>
      </div>
    </>
  );
}

function setupAnimalList() {
  const animalList = [];
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'cat', src: "https://loremflickr.com/320/240/cat?lock=" + i});
  }
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'dog', src: "https://loremflickr.com/320/240/dog?lock=" + i});
  }

  return animalList;
}


Show more
Now on inital mount in StrictMode, the ref callbacks are all setup, cleaned up, and setup again:
...
✅ Adding animal to the map. Total animals: 10
...
❌ Removing animal from the map. Total animals: 0
...
✅ Adding animal to the map. Total animals: 10
This is expected. Strict Mode confirms that the ref callbacks are cleaned up correctly, so the size never grows above the expected amount. After the fix, there are no memory leaks, and all the features work as expected.
Without Strict Mode, it was easy to miss the bug until you clicked around to app to notice broken features. Strict Mode made the bugs appear right away, before you push them to production.

Fixing deprecation warnings enabled by Strict Mode 
React warns if some component anywhere inside a <StrictMode> tree uses one of these deprecated APIs:
UNSAFE_ class lifecycle methods like UNSAFE_componentWillMount. See alternatives.
These APIs are primarily used in older class components so they rarely appear in modern apps.
Previous<Profiler>
Next<Suspense>

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
<StrictMode>
Usage
Enabling Strict Mode for entire app
Enabling Strict Mode for a part of the app
Fixing bugs found by double rendering in development
Fixing bugs found by re-running Effects in development
Fixing bugs found by re-running ref callbacks in development
Fixing deprecation warnings enabled by Strict Mode
<StrictMode> – React
 <Suspense>
<Suspense> lets you display a fallback until its children have finished loading.
<Suspense fallback={<Loading />}>
 <SomeComponent />
</Suspense>
Reference
<Suspense>
Usage
Displaying a fallback while content is loading
Revealing content together at once
Revealing nested content as it loads
Showing stale content while fresh content is loading
Preventing already revealed content from hiding
Indicating that a Transition is happening
Resetting Suspense boundaries on navigation
Providing a fallback for server errors and client-only content
Troubleshooting
How do I prevent the UI from being replaced by a fallback during an update?

Reference 
<Suspense> 
Props 
children: The actual UI you intend to render. If children suspends while rendering, the Suspense boundary will switch to rendering fallback.
fallback: An alternate UI to render in place of the actual UI if it has not finished loading. Any valid React node is accepted, though in practice, a fallback is a lightweight placeholder view, such as a loading spinner or skeleton. Suspense will automatically switch to fallback when children suspends, and back to children when the data is ready. If fallback suspends while rendering, it will activate the closest parent Suspense boundary.
Caveats 
React does not preserve any state for renders that got suspended before they were able to mount for the first time. When the component has loaded, React will retry rendering the suspended tree from scratch.
If Suspense was displaying content for the tree, but then it suspended again, the fallback will be shown again unless the update causing it was caused by startTransition or useDeferredValue.
If React needs to hide the already visible content because it suspended again, it will clean up layout Effects in the content tree. When the content is ready to be shown again, React will fire the layout Effects again. This ensures that Effects measuring the DOM layout don’t try to do this while the content is hidden.
React includes under-the-hood optimizations like Streaming Server Rendering and Selective Hydration that are integrated with Suspense. Read an architectural overview and watch a technical talk to learn more.

Usage 
Displaying a fallback while content is loading 
You can wrap any part of your application with a Suspense boundary:
<Suspense fallback={<Loading />}>
 <Albums />
</Suspense>
React will display your loading fallback until all the code and data needed by the children has been loaded.
In the example below, the Albums component suspends while fetching the list of albums. Until it’s ready to render, React switches the closest Suspense boundary above to show the fallback—your Loading component. Then, when the data loads, React hides the Loading fallback and renders the Albums component with data.
ArtistPage.jsAlbums.js
Reset
Fork
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}


Show more
Note
Only Suspense-enabled data sources will activate the Suspense component. They include:
Data fetching with Suspense-enabled frameworks like Relay and Next.js
Lazy-loading component code with lazy
Reading the value of a cached Promise with use
Suspense does not detect when data is fetched inside an Effect or event handler.
The exact way you would load data in the Albums component above depends on your framework. If you use a Suspense-enabled framework, you’ll find the details in its data fetching documentation.
Suspense-enabled data fetching without the use of an opinionated framework is not yet supported. The requirements for implementing a Suspense-enabled data source are unstable and undocumented. An official API for integrating data sources with Suspense will be released in a future version of React.

Revealing content together at once 
By default, the whole tree inside Suspense is treated as a single unit. For example, even if only one of these components suspends waiting for some data, all of them together will be replaced by the loading indicator:
<Suspense fallback={<Loading />}>
 <Biography />
 <Panel>
   <Albums />
 </Panel>
</Suspense>
Then, after all of them are ready to be displayed, they will all appear together at once.
In the example below, both Biography and Albums fetch some data. However, because they are grouped under a single Suspense boundary, these components always “pop in” together at the same time.
ArtistPage.jsPanel.jsBiography.jsAlbums.js
Reset
Fork
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}


Show more
Components that load data don’t have to be direct children of the Suspense boundary. For example, you can move Biography and Albums into a new Details component. This doesn’t change the behavior. Biography and Albums share the same closest parent Suspense boundary, so their reveal is coordinated together.
<Suspense fallback={<Loading />}>
 <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
 return (
   <>
     <Biography artistId={artistId} />
     <Panel>
       <Albums artistId={artistId} />
     </Panel>
   </>
 );
}

Revealing nested content as it loads 
When a component suspends, the closest parent Suspense component shows the fallback. This lets you nest multiple Suspense components to create a loading sequence. Each Suspense boundary’s fallback will be filled in as the next level of content becomes available. For example, you can give the album list its own fallback:
<Suspense fallback={<BigSpinner />}>
 <Biography />
 <Suspense fallback={<AlbumsGlimmer />}>
   <Panel>
     <Albums />
   </Panel>
 </Suspense>
</Suspense>
With this change, displaying the Biography doesn’t need to “wait” for the Albums to load.
The sequence will be:
If Biography hasn’t loaded yet, BigSpinner is shown in place of the entire content area.
Once Biography finishes loading, BigSpinner is replaced by the content.
If Albums hasn’t loaded yet, AlbumsGlimmer is shown in place of Albums and its parent Panel.
Finally, once Albums finishes loading, it replaces AlbumsGlimmer.
ArtistPage.jsPanel.jsBiography.jsAlbums.js
Reset
Fork
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}


Show more
Suspense boundaries let you coordinate which parts of your UI should always “pop in” together at the same time, and which parts should progressively reveal more content in a sequence of loading states. You can add, move, or delete Suspense boundaries in any place in the tree without affecting the rest of your app’s behavior.
Don’t put a Suspense boundary around every component. Suspense boundaries should not be more granular than the loading sequence that you want the user to experience. If you work with a designer, ask them where the loading states should be placed—it’s likely that they’ve already included them in their design wireframes.

Showing stale content while fresh content is loading 
In this example, the SearchResults component suspends while fetching the search results. Type "a", wait for the results, and then edit it to "ab". The results for "a" will get replaced by the loading fallback.
App.jsSearchResults.js
Reset
Fork
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}


Show more
A common alternative UI pattern is to defer updating the list and to keep showing the previous results until the new results are ready. The useDeferredValue Hook lets you pass a deferred version of the query down:
export default function App() {
 const [query, setQuery] = useState('');
 const deferredQuery = useDeferredValue(query);
 return (
   <>
     <label>
       Search albums:
       <input value={query} onChange={e => setQuery(e.target.value)} />
     </label>
     <Suspense fallback={<h2>Loading...</h2>}>
       <SearchResults query={deferredQuery} />
     </Suspense>
   </>
 );
}
The query will update immediately, so the input will display the new value. However, the deferredQuery will keep its previous value until the data has loaded, so SearchResults will show the stale results for a bit.
To make it more obvious to the user, you can add a visual indication when the stale result list is displayed:
<div style={{
 opacity: query !== deferredQuery ? 0.5 : 1
}}>
 <SearchResults query={deferredQuery} />
</div>
Enter "a" in the example below, wait for the results to load, and then edit the input to "ab". Notice how instead of the Suspense fallback, you now see the dimmed stale result list until the new results have loaded:
App.js
Reset
Fork
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}


Show more
Note
Both deferred values and Transitions let you avoid showing Suspense fallback in favor of inline indicators. Transitions mark the whole update as non-urgent so they are typically used by frameworks and router libraries for navigation. Deferred values, on the other hand, are mostly useful in application code where you want to mark a part of UI as non-urgent and let it “lag behind” the rest of the UI.

Preventing already revealed content from hiding 
When a component suspends, the closest parent Suspense boundary switches to showing the fallback. This can lead to a jarring user experience if it was already displaying some content. Try pressing this button:
App.jsLayout.jsIndexPage.jsArtistPage.jsAlbums.jsBiography.jsPanel.js
Reset
Fork
import { Suspense, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    setPage(url);
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}


Show more
When you pressed the button, the Router component rendered ArtistPage instead of IndexPage. A component inside ArtistPage suspended, so the closest Suspense boundary started showing the fallback. The closest Suspense boundary was near the root, so the whole site layout got replaced by BigSpinner.
To prevent this, you can mark the navigation state update as a Transition with startTransition:
function Router() {
 const [page, setPage] = useState('/');

 function navigate(url) {
   startTransition(() => {
     setPage(url);     
   });
 }
 // ...
This tells React that the state transition is not urgent, and it’s better to keep showing the previous page instead of hiding any already revealed content. Now clicking the button “waits” for the Biography to load:
App.jsLayout.jsIndexPage.jsArtistPage.jsAlbums.jsBiography.jsPanel.js
Reset
Fork
import { Suspense, startTransition, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}


Show more
A Transition doesn’t wait for all content to load. It only waits long enough to avoid hiding already revealed content. For example, the website Layout was already revealed, so it would be bad to hide it behind a loading spinner. However, the nested Suspense boundary around Albums is new, so the Transition doesn’t wait for it.
Note
Suspense-enabled routers are expected to wrap the navigation updates into Transitions by default.

Indicating that a Transition is happening 
In the above example, once you click the button, there is no visual indication that a navigation is in progress. To add an indicator, you can replace startTransition with useTransition which gives you a boolean isPending value. In the example below, it’s used to change the website header styling while a Transition is happening:
App.jsLayout.jsIndexPage.jsArtistPage.jsAlbums.jsBiography.jsPanel.js
Reset
Fork
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}


Show more

Resetting Suspense boundaries on navigation 
During a Transition, React will avoid hiding already revealed content. However, if you navigate to a route with different parameters, you might want to tell React it is different content. You can express this with a key:
<ProfilePage key={queryParams.id} />
Imagine you’re navigating within a user’s profile page, and something suspends. If that update is wrapped in a Transition, it will not trigger the fallback for already visible content. That’s the expected behavior.
However, now imagine you’re navigating between two different user profiles. In that case, it makes sense to show the fallback. For example, one user’s timeline is different content from another user’s timeline. By specifying a key, you ensure that React treats different users’ profiles as different components, and resets the Suspense boundaries during navigation. Suspense-integrated routers should do this automatically.

Providing a fallback for server errors and client-only content 
If you use one of the streaming server rendering APIs (or a framework that relies on them), React will also use your <Suspense> boundaries to handle errors on the server. If a component throws an error on the server, React will not abort the server render. Instead, it will find the closest <Suspense> component above it and include its fallback (such as a spinner) into the generated server HTML. The user will see a spinner at first.
On the client, React will attempt to render the same component again. If it errors on the client too, React will throw the error and display the closest error boundary. However, if it does not error on the client, React will not display the error to the user since the content was eventually displayed successfully.
You can use this to opt out some components from rendering on the server. To do this, throw an error in the server environment and then wrap them in a <Suspense> boundary to replace their HTML with fallbacks:
<Suspense fallback={<Loading />}>
 <Chat />
</Suspense>

function Chat() {
 if (typeof window === 'undefined') {
   throw Error('Chat should only render on the client.');
 }
 // ...
}
The server HTML will include the loading indicator. It will be replaced by the Chat component on the client.

Troubleshooting 
How do I prevent the UI from being replaced by a fallback during an update? 
Replacing visible UI with a fallback creates a jarring user experience. This can happen when an update causes a component to suspend, and the nearest Suspense boundary is already showing content to the user.
To prevent this from happening, mark the update as non-urgent using startTransition. During a Transition, React will wait until enough data has loaded to prevent an unwanted fallback from appearing:
function handleNextPageClick() {
 // If this update suspends, don't hide the already displayed content
 startTransition(() => {
   setCurrentPage(currentPage + 1);
 });
}
This will avoid hiding existing content. However, any newly rendered Suspense boundaries will still immediately display fallbacks to avoid blocking the UI and let the user see the content as it becomes available.
React will only prevent unwanted fallbacks during non-urgent updates. It will not delay a render if it’s the result of an urgent update. You must opt in with an API like startTransition or useDeferredValue.
If your router is integrated with Suspense, it should wrap its updates into startTransition automatically.
Previous<StrictMode>
Next<Activity>

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
<Suspense>
Usage
Displaying a fallback while content is loading
Revealing content together at once
Revealing nested content as it loads
Showing stale content while fresh content is loading
Preventing already revealed content from hiding
Indicating that a Transition is happening
Resetting Suspense boundaries on navigation
Providing a fallback for server errors and client-only content
Troubleshooting
How do I prevent the UI from being replaced by a fallback during an update?
<Suspense> – React
<Activity>
Experimental Feature
This API is experimental and is not available in a stable version of React yet.
You can try it by upgrading React packages to the most recent experimental version:
react@experimental
react-dom@experimental
eslint-plugin-react-hooks@experimental
Experimental versions of React may contain bugs. Don’t use them in production.
<Activity> lets you hide and show part of the UI.
<Activity mode={mode}>
 <Page />
</Activity>
Reference
<Activity>
Usage
Pre-render part of the UI
Keeping state for part of the UI
Troubleshooting
Effects don’t mount when an Activity is hidden
My hidden Activity is not rendered in SSR

Reference 
<Activity> 
Wrap a part of the UI in <Activity> to manage its visibility state:
import {unstable_Activity as Activity} from 'react';

<Activity mode={isVisible ? 'visible' : 'hidden'}>
 <Page />
</Activity>
When “hidden”, the children of <Activity /> are not visible on the page. If a new <Activity> mounts as “hidden” then it pre-renders the content at lower priority without blocking the visible content on the page, but it does not mount by creating Effects. When a “visible” Activity switches to “hidden” it conceptually unmounts by destroying all the Effects, but saves its state. This allows fast switching between “visible” and “hidden” states without recreating the state for a “hidden” Activity.
In the future, “hidden” Activities may automatically destroy state based on resources like memory.
Props 
children: The actual UI you intend to render.
optional mode: Either “visible” or “hidden”. Defaults to “visible”. When “hidden”, updates to the children are deferred to lower priority. The component will not create Effects until the Activity is switched to “visible”. If a “visible” Activity switches to “hidden”, the Effects will be destroyed.
Caveats 
While hidden, the children of <Activity> are hidden on the page.
<Activity> will unmount all Effects when switching from “visible” to “hidden” without destroying React or DOM state. This means Effects that are expected to run only once on mount will run again when switching from “hidden” to “visible”. Conceptually, “hidden” Activities are unmounted, but they are not destroyed either. We recommend using <StrictMode> to catch any unexpected side-effects from this behavior.
When used with <ViewTransition>, hidden activities that reveal in a transition will activate an “enter” animation. Visible Activities hidden in a transition will activate an “exit” animation.
Parts of the UI wrapped in <Activity mode="hidden"> are not included in the SSR response.
Parts of the UI wrapped in <Activity mode="visible"> will hydrate at a lower priority than other content.

Usage 
Pre-render part of the UI 
You can pre-render part of the UI using <Activity mode="hidden">:
<Activity mode={tab === "posts" ? "visible" : "hidden"}>
 <PostsTab />
</Activity>
When an Activity is rendered with mode="hidden", the children are not visible on the page, but are rendered at lower priority than the visible content on the page.
When the mode later switches to “visible”, the pre-rendered children will mount and become visible. This can be used to prepare parts of the UI the user is likely to interact with next to reduce loading times.
In the following example from useTransition, the PostsTab component fetches some data using use. When you click the “Posts” tab, the PostsTab component suspends, causing the button loading state to appear:
App.jsTabButton.js
Reset
Fork
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}


Show more
In this example, the user needs to wait for the posts to load when clicking on the “Posts” tab.
We can reduce the delay for the “Posts” tab by pre-rendering the inactive Tabs with a hidden <Activity>:
App.jsTabButton.js
Reset
Fork
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}


Show more

Keeping state for part of the UI 
You can keep state for parts of the UI by switching <Activity> from “visible” to “hidden”:
<Activity mode={tab === "posts" ? "visible" : "hidden"}>
 <PostsTab />
</Activity>
When an Activity switches from mode="visible" to “hidden”, the children will become hidden on the page, and unmount by destroying all Effects, but will keep their React and DOM state.
When the mode later switches to “visible”, the saved state will be re-used when mounting the children by creating all the Effects. This can be used to keep state in parts of the UI the user is likely to interact with again to maintain DOM or React state.
In the following example from useTransition, the ContactTab includes a <textarea> with a draft message to send. If you enter some text and change to a different tab, then when you click the “Contact” tab again, the draft message is lost:
App.jsTabButton.js
Reset
Fork
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}


Show more
This results in losing DOM state the user has input. We can keep the state for the Contact tab by hiding the inactive Tabs with <Activity>:
App.jsTabButton.js
Reset
Fork
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}


Show more

Troubleshooting 
Effects don’t mount when an Activity is hidden 
When an <Activity> is “hidden”, all Effects are unmounted. Conceptually, the component is unmounted, but React saves the state for later.
This is a feature of Activity because it means subscriptions won’t be subscribed for hidden parts of the UI, reducing the amount of work for hidden content. It also means cleanup, such as pausing a video (which would be expected if you unmounted without Activity) will fire. When an Activity switches to “visible”, it will mount by creating the Effects, which will subscribe and play the video.
Consider the following example, where a different video is played for each button:
App.js
Reset
Fork
import { useState, useRef, useEffect } from 'react';
import './checker.js';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    const videoRef = ref.current;
    videoRef.play();
    
    return () => {
      videoRef.pause();
    }
  }, []);

  return <video ref={ref} src={src} muted loop playsInline/>;
}

export default function App() {
  const [video, setVideo] = useState(1);
  return (
    <>
      <div>
        <button onClick={() => setVideo(1)}>Big Buck Bunny</button>
        <button onClick={() => setVideo(2)}>Elephants Dream</button>
      </div>
      {video === 1 &&
        <VideoPlayer key={1}
          // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />

      }
      {video === 2 && 
        <VideoPlayer key={2}
          // 'Elephants Dream' by Orange Open Movie Project Studio, licensed under CC-3.0, hosted by archive.org
          src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
        />
      }
    </>
  );
}


Show more
Whenever you change videos and come back, the video re-loads from the beginning. To maintain the state, you may try to render both videos, and hide the inactive video in display: none. However, this will cause both videos to play at the same time:
App.js
Reset
Fork
import { useState, useRef, useEffect } from 'react';
import VideoChecker from './checker.js';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    const videoRef = ref.current;
    videoRef.play();
    
    return () => {
      videoRef.pause();
    }
  }, []);

  return <video ref={ref} src={src} muted loop playsInline/>;
}

export default function App() {
  const [video, setVideo] = useState(1);
  return (
    <>
      <div>
        <button onClick={() => setVideo(1)}>Big Buck Bunny</button>
        <button onClick={() => setVideo(2)}>Elephants Dream</button>
      </div>
      <div style={{display: video === 1 ? 'block' : 'none'}}>
        <VideoPlayer
          // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />

      </div>
      <div style={{display: video === 2 ? 'block' : 'none'}}>
        <VideoPlayer
          // 'Elephants Dream' by Orange Open Movie Project Studio, licensed under CC-3.0, hosted by archive.org
          src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
        />
      </div>
      <VideoChecker />
    </>
  );
}


Show more
This is similar to what would happen if Activity mounted Effects when hidden. Similarly, if Activity didn’t unmount Effects when hiding, the videos would continue to play in the background.
Activity solves this by not creating Effects when first rendered as “hidden” and destroying all Effects when switching from “visible” to “hidden”:
App.js
Reset
Fork
import { useState, useRef, useEffect, unstable_Activity as Activity } from 'react';
import VideoChecker from './checker.js';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    const videoRef = ref.current;
    videoRef.play();
    
    return () => {
      videoRef.pause();
    }
  }, []);

  return <video ref={ref} src={src} muted loop playsInline/>;
}

export default function App() {
  const [video, setVideo] = useState(1);
  return (
    <>
      <div>
        <button onClick={() => setVideo(1)}>Big Buck Bunny</button>
        <button onClick={() => setVideo(2)}>Elephants Dream</button>
      </div>
      <Activity mode={video === 1 ? 'visible' : 'hidden'}>
        <VideoPlayer
          // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />
      </Activity>
      <Activity mode={video === 2 ? 'visible' : 'hidden'}>
        <VideoPlayer
          // 'Elephants Dream' by Orange Open Movie Project Studio, licensed under CC-3.0, hosted by archive.org
          src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
        />
      </Activity>
      <VideoChecker />
    </>
  );
}


Show more
For this reason, it’s best to think of Activity conceptually as “unmounting” and “remounting” the component, but saving the React or DOM state for later. In practice, this works as expected if you have followed the You Might Not Need an Effect guide. To eagerly find problematic Effects, we recommend adding <StrictMode> which will eagerly perform Activity unmounts and mounts to catch any unexpected side-effects.
My hidden Activity is not rendered in SSR 
When you use <Activity mode="hidden"> during server-side rendering, the content of the Activity will not be included in the SSR response. This is because the content is not visible on the page and is not needed for the initial render. If you need to include the content in the SSR response, you can use a different approach like useDeferredValue to defer rendering of the content.
Previous<Suspense>
Next<ViewTransition>

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
<Activity>
Usage
Pre-render part of the UI
Keeping state for part of the UI
Troubleshooting
Effects don’t mount when an Activity is hidden
My hidden Activity is not rendered in SSR
<Activity> – React
<ViewTransition>
Experimental Feature
This API is experimental and is not available in a stable version of React yet.
You can try it by upgrading React packages to the most recent experimental version:
react@experimental
react-dom@experimental
eslint-plugin-react-hooks@experimental
Experimental versions of React may contain bugs. Don’t use them in production.
<ViewTransition> lets you animate elements that update inside a Transition.
import {unstable_ViewTransition as ViewTransition} from 'react';

<ViewTransition>
 <div>...</div>
</ViewTransition>
Reference
<ViewTransition>
View Transition Class
Styling View Transitions
Usage
Animating an element on enter/exit
Animating a shared element
Animating reorder of items in a list
Animating from Suspense content
Opting-out of an animation
Customizing animations
Customizing animations with types
Building View Transition enabled routers
Troubleshooting
My <ViewTransition> is not activating
I’m getting an error “There are two <ViewTransition name=%s> components with the same name mounted at the same time.”

Reference 
<ViewTransition> 
Wrap elements in <ViewTransition> to animate them when they update inside a Transition. React uses the following heuristics to determine if a View Transition activates for an animation:
enter: If a ViewTransition itself gets inserted in this Transition, then this will activate.
exit: If a ViewTransition itself gets deleted in this Transition, then this will activate.
update: If a ViewTransition has any DOM mutations inside it that React is doing (such as a prop changing) or if the ViewTransition boundary itself changes size or position due to an immediate sibling. If there are nested ViewTransition then the mutation applies to them and not the parent.
share: If a named ViewTransition is inside a deleted subtree and another named ViewTransition with the same name is part of an inserted subtree in the same Transition, they form a Shared Element Transition, and it animates from the deleted one to the inserted one.
By default, <ViewTransition> animates with a smooth cross-fade (the browser default view transition). You can customize the animation by providing a View Transition Class to the <ViewTransition> component. You can  customize animations for each kind of trigger (see Styling View Transitions).
Deep Dive
How does <ViewTransition> work? 
Show Details










Props 
By default, <ViewTransition> animates with a smooth cross-fade. You can customize the animation, or specify a shared element transition, with these props:
optional enter: A string or object. The View Transition Class to apply when enter is activated.
optional exit: A string or object. The View Transition Class to apply when exit is activated.
optional update: A string or object. The View Transition Class to apply when an update is activated.
optional share: A string or object. The View Transition Class to apply when a shared element is activated.
optional default: A string or object. The View Transition Class used when no other matching activation prop is found.
optional name: A string or object. The name of the View Transition used for shared element transitions. If not provided, React will use a unique name for each View Transition to prevent unexpected animations.
Callback 
These callbacks allow you to adjust the animation imperatively using the animate APIs:
optional onEnter: A function. React calls onEnter after an “enter” animation.
optional onExit: A function. React calls onExit after an “exit” animation.
optional onShare: A function. React calls onShare after a “share” animation.
optional onUpdate: A function. React calls onUpdate after an “update” animation.
Each callback receives as arguments:
element: The DOM element that was animated.
types: The Transition Types included in the animation.
View Transition Class 
The View Transition Class is the CSS class name(s) applied by React during the transition when the ViewTransition activates. It can be a string or an object.
string: the class added on the child elements when activated. If 'none' is provided, no class will be added.
object: the class added on the child elements will be the key matching View Transition type added with addTransitionType. The object can also specify a default to use if no matching type is found.
The value 'none' can be used to prevent a View Transition from activating for a specific trigger.
Styling View Transitions 
Note
In many early examples of View Transitions around the web, you’ll have seen using a view-transition-name and then style it using ::view-transition-...(my-name) selectors. We don’t recommend that for styling. Instead, we normally recommend using a View Transition Class instead.
To customize the animation for a <ViewTransition> you can provide a View Transition Class to one of the activation props. The View Transition Class is a CSS class name that React applies to the child elements when the ViewTransition activates.
For example, to customize an “enter” animation, provide a class name to the enter prop:
<ViewTransition enter="slide-in">
When the <ViewTransition> activates an “enter” animation, React will add the class name slide-in. Then you can refer to this class using view transition pseudo selectors to build reusable animations:
::view-transition-group(.slide-in) {

}
::view-transition-old(.slide-in) {

}
::view-transition-new(.slide-in) {

}
In the future, CSS libraries may add built-in animations using View Transition Classes to make this easier to use.
Caveats 
By default, setState updates immediately and does not activate <ViewTransition>, only updates wrapped in a Transition. You can also use <Suspense> to opt-in to a Transition to reveal content.
<ViewTransition> creates an image that can be moved around, scaled and cross-faded. Unlike Layout Animations you may have seen in React Native or Motion, this means that not every individual Element inside of it animates its position. This can lead to better performance and a more continuous feeling, smooth animation compared to animating every individual piece. However, it can also lose continuity in things that should be moving by themselves. So you might have to add more <ViewTransition> boundaries manually as a result.
Many users may prefer not having animations on the page. React doesn’t automatically disable animations for this case. We recommend that using the @media (prefers-reduced-motion) media query to disable animations or tone them down based on user preference. In the future, CSS libraries may have this built-in to their presets.
Currently, <ViewTransition> only works in the DOM. We’re working on adding support for React Native and other platforms.

Usage 
Animating an element on enter/exit 
Enter/Exit Transitions trigger when a <ViewTransition> is added or removed by a component in a transition:
function Child() {
 return <ViewTransition>Hi</ViewTransition>
}

function Parent() {
 const [show, setShow] = useState();
 if (show) {
   return <Child />;
 }
 return null;
}
When setShow is called, show switches to true and the Child component is rendered. When setShow is called inside startTransition, and Child renders a ViewTransition before any other DOM nodes, an enter animation is triggered.
When show switches back to false, an exit animation is triggered.
App.js
Reset
Fork
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition>
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}


Show more
Pitfall
<ViewTransition> only activates if it is placed before any DOM node. If Child instead looked like this, no animation would trigger:
function Component() {
 return (
   <div>
     <ViewTransition>Hi</ViewTransition>
   </div>
 );
}

Animating a shared element 
Normally, we don’t recommend assigning a name to a <ViewTransition> and instead let React assign it an automatic name. The reason you might want to assign a name is to animate between completely different components when one tree unmounts and another tree mounts at the same time. To preserve continuity.
<ViewTransition name={UNIQUE_NAME}>
 <Child />
</ViewTransition>
When one tree unmounts and another mounts, if there’s a pair where the same name exists in the unmounting tree and the mounting tree, they trigger the “share” animation on both. It animates from the unmounting side to the mounting side.
Unlike an exit/enter animation this can be deeply inside the deleted/mounted tree. If a <ViewTransition> would also be eligible for exit/enter, then the “share” animation takes precedence.
If Transition first unmounts one side and then leads to a <Suspense> fallback being shown before eventually the new name being mounted, then no shared element transition happens.
App.jsVideo.js
Reset
Fork
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from "react";
import {Video, Thumbnail, FullscreenVideo} from "./Video";
import videos from "./data";

export default function Component() {
  const [fullscreen, setFullscreen] = useState(false);
  if (fullscreen) {
    return <FullscreenVideo
      video={videos[0]}
      onExit={() => startTransition(() => setFullscreen(false))}
    />
  }
  return <Video
    video={videos[0]}
    onClick={() => startTransition(() => setFullscreen(true))}
  />
}


Show more
Note
If either the mounted or unmounted side of a pair is outside the viewport, then no pair is formed. This ensures that it doesn’t fly in or out of the viewport when something is scrolled. Instead it’s treated as a regular enter/exit by itself.
This does not happen if the same Component instance changes position, which triggers an “update”. Those animate regardless if one position is outside the viewport.
There’s currently a quirk where if a deeply nested unmounted <ViewTransition> is inside the viewport but the mounted side is not within the viewport, then the unmounted side animates as its own “exit” animation even if it’s deeply nested instead of as part of the parent animation.
Pitfall
It’s important that there’s only one thing with the same name mounted at a time in the entire app. Therefore it’s important to use unique namespaces for the name to avoid conflicts. To ensure you can do this you might want to add a constant in a separate module that you import.
export const MY_NAME = "my-globally-unique-name";
import {MY_NAME} from './shared-name';
...
<ViewTransition name={MY_NAME}>

Animating reorder of items in a list 
items.map(item => <Component key={item.id} item={item} />)
When reordering a list, without updating the content, the “update” animation triggers on each <ViewTransition> in the list if they’re outside a DOM node. Similar to enter/exit animations.
This means that this will trigger the animation on this <ViewTransition>:
function Component() {
 return <ViewTransition><div>...</div></ViewTransition>;
}
App.js
Reset
Fork
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from "react";
import {Video} from "./Video";
import videos from "./data";

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <div className="listContainer">
        {orderedVideos.map((video, i) => {
          return (
            <ViewTransition key={video.title}>
              <Video video={video} />
            </ViewTransition>
          );
        })}
      </div>
    </>
  );
}


Show more
However, this wouldn’t animate each individual item:
function Component() {
 return <div><ViewTransition>...</ViewTransition></div>;
}
Instead, any parent <ViewTransition> would cross-fade. If there is no parent <ViewTransition> then there’s no animation in that case.
App.js
Reset
Fork
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from "react";
import {Video} from "./Video";
import videos from "./data";

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <ViewTransition>
        <div className="listContainer">
          {orderedVideos.map((video, i) => {
            return <Video video={video} key={video.title} />;
          })}
        </div>
      </ViewTransition>
    </>
  );
}


Show more
This means you might want to avoid wrapper elements in lists where you want to allow the Component to control its own reorder animation:
items.map(item => <div><Component key={item.id} item={item} /></div>)
The above rule also applies if one of the items updates to resize, which then causes the siblings to resize, it’ll also animate its sibling <ViewTransition> but only if they’re immediate siblings.
This means that during an update, which causes a lot of re-layout, it doesn’t individually animate every <ViewTransition> on the page. That would lead to a lot of noisy animations which distracts from the actual change. Therefore React is more conservative about when an individual animation triggers.
Pitfall
It’s important to properly use keys to preserve identity when reordering lists. It might seem like you could use “name”, shared element transitions, to animate reorders but that would not trigger if one side was outside the viewport. To animate a reorder you often want to show that it went to a position outside the viewport.

Animating from Suspense content 
Just like any Transition, React waits for data and new CSS (<link rel="stylesheet" precedence="...">) before running the animation. In addition to this, ViewTransitions also wait up to 500ms for new fonts to load before starting the animation to avoid them flickering in later. For the same reason, an image wrapped in ViewTransition will wait for the image to load.
If it’s inside a new Suspense boundary instance, then the fallback is shown first. After the Suspense boundary fully loads, it triggers the <ViewTransition> to animate the reveal to the content.
Currently, this only happens for client-side Transition. In the future, this will also animate Suspense boundary for streaming SSR when content from the server suspends during the initial load.
There are two ways to animate Suspense boundaries depending on where you place the <ViewTransition>:
Update:
<ViewTransition>
 <Suspense fallback={<A />}>
   <B />
 </Suspense>
</ViewTransition>
In this scenario when the content goes from A to B, it’ll be treated as an “update” and apply that class if appropriate. Both A and B will get the same view-transition-name and therefore they’re acting as a cross-fade by default.
App.js
Reset
Fork
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition,
  Suspense
} from 'react';
import {Video, VideoPlaceholder} from "./Video";
import {useLazyVideoData} from "./data"

function LazyVideo() {
  const video = useLazyVideoData();
  return (
    <Video video={video}/>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}


Show more
Enter/Exit:
<Suspense fallback={<ViewTransition><A /></ViewTransition>}>
 <ViewTransition><B /></ViewTransition>
</Suspense>
In this scenario, these are two separate ViewTransition instances each with their own view-transition-name. This will be treated as an “exit” of the <A> and an “enter” of the <B>.
You can achieve different effects depending on where you choose to place the <ViewTransition> boundary.

Opting-out of an animation 
Sometimes you’re wrapping a large existing component, like a whole page, and you want to animate some updates, such as changing the theme. However, you don’t want it to opt-in all updates inside the whole page to cross-fade when they’re updating. Especially if you’re incrementally adding more animations.
You can use the class “none” to opt-out of an animation. By wrapping your children in a “none” you can disable animations for updates to them while the parent still triggers.
<ViewTransition>
 <div className={theme}>
   <ViewTransition update="none">
     {children}
   </ViewTransition>
 </div>
</ViewTransition>
This will only animate if the theme changes and not if only the children update. The children can still opt-in again with their own <ViewTransition> but at least it’s manual again.

Customizing animations 
By default, <ViewTransition> includes the default cross-fade from the browser.
To customize animations, you can provide props to the <ViewTransition> component to specify which animations to use, based on how the <ViewTransition> activates.
For example, we can slow down the default cross fade animation:
<ViewTransition default="slow-fade">
 <Video />
</ViewTransition>
And define slow-fade in CSS using view transition classes:
::view-transition-old(.slow-fade) {
   animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
   animation-duration: 500ms;
}
App.js
Reset
Fork
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition default="slow-fade">
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}


Show more
In addition to setting the default, you can also provide configurations for enter, exit, update, and share animations.
App.js
Reset
Fork
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition enter="slide-in" exit="slide-out">
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}


Show more
Customizing animations with types 
You can use the addTransitionType API to add a class name to the child elements when a specific transition type is activated for a specific activation trigger. This allows you to customize the animation for each type of transition.
For example, to customize the animation for all forward and backward navigations:
<ViewTransition default={{
 'navigation-back': 'slide-right',
 'navigation-forward': 'slide-left',
}}>
 <div>...</div>
</ViewTransition>

// in your router:
startTransition(() => {
 addTransitionType('navigation-' + navigationType);
});
When the ViewTransition activates a “navigation-back” animation, React will add the class name “slide-right”. When the ViewTransition activates a “navigation-forward” animation, React will add the class name “slide-left”.
In the future, routers and other libraries may add support for standard view-transition types and styles.
App.js
Reset
Fork
import {
  unstable_ViewTransition as ViewTransition,
  unstable_addTransitionType as addTransitionType,
  useState,
  startTransition,
} from "react";
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition enter={
        {
          "add-video-back": "slide-in-back",
          "add-video-forward": "slide-in-forward"
        }
      }
      exit={
        {
          "remove-video-back": "slide-in-forward",
          "remove-video-forward": "slide-in-back"
        }
      }>
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType("remove-video-back")
              } else {
                addTransitionType("add-video-back")
              }
              setShowItem((prev) => !prev);
            });
          }}
        >⬅️</button>
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType("remove-video-forward")
              } else {
                addTransitionType("add-video-forward")
              }
              setShowItem((prev) => !prev);
            });
          }}
        >➡️</button>
      </div>
      {showItem ? <Item /> : null}
    </>
  );
}


Show more
Building View Transition enabled routers 
React waits for any pending Navigation to finish to ensure that scroll restoration happens within the animation. If the Navigation is blocked on React, your router must unblock in useLayoutEffect since useEffect would lead to a deadlock.
If a startTransition is started from the legacy popstate event, such as during a “back”-navigation then it must finish synchronously to ensure scroll and form restoration works correctly. This is in conflict with running a View Transition animation. Therefore, React will skip animations from popstate. Therefore animations won’t run for the back button. You can fix this by upgrading your router to use the Navigation API.

Troubleshooting 
My <ViewTransition> is not activating 
<ViewTransition> only activates if it is placed is before any DOM node:
function Component() {
 return (
   <div>
     <ViewTransition>Hi</ViewTransition>
   </div>
 );
}
To fix, ensure that the <ViewTransition> comes before any other DOM nodes:
function Component() {
 return (
   <ViewTransition>
     <div>Hi</div>
   </ViewTransition>
 );
}
I’m getting an error “There are two <ViewTransition name=%s> components with the same name mounted at the same time.” 
This error occurs when two <ViewTransition> components with the same name are mounted at the same time:
function Item() {
 // 🚩 All items will get the same "name".
 return <ViewTransition name="item">...</ViewTransition>;
}

function ItemList({items}) {
 return (
   <>
     {item.map(item => <Item key={item.id} />)}
   </>
 );
}
This will cause the View Transition to error. In development, React detects this issue to surface it and logs two errors:
Console
There are two <ViewTransition name=%s> components with the same name mounted at the same time. This is not supported and will cause View Transitions to error. Try to use a more unique name e.g. by using a namespace prefix and adding the id of an item to the name. at Item at ItemList
The existing <ViewTransition name=%s> duplicate has this stack trace. at Item at ItemList
To fix, ensure that there’s only one <ViewTransition> with the same name mounted at a time in the entire app by ensuring the name is unique, or adding an id to the name:
function Item({id}) {
 // ✅ All items will get the same "name".
 return <ViewTransition name={`item-${id}`}>...</ViewTransition>;
}

function ItemList({items}) {
 return (
   <>
     {item.map(item => <Item key={item.id} item={item} />)}
   </>
 );
}
Previous<Activity>
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
<ViewTransition>
View Transition Class
Styling View Transitions
Usage
Animating an element on enter/exit
Animating a shared element
Animating reorder of items in a list
Animating from Suspense content
Opting-out of an animation
Customizing animations
Customizing animations with types
Building View Transition enabled routers
Troubleshooting
My <ViewTransition> is not activating
I’m getting an error “There are two <ViewTransition name=%s> components with the same name mounted at the same time.”
<ViewTransition> – React

Built-in React APIs
In addition to Hooks and Components, the react package exports a few other APIs that are useful for defining components. This page lists all the remaining modern React APIs.

createContext lets you define and provide context to the child components. Used with useContext.
lazy lets you defer loading a component’s code until it’s rendered for the first time.
memo lets your component skip re-renders with same props. Used with useMemo and useCallback.
startTransition lets you mark a state update as non-urgent. Similar to useTransition.
act lets you wrap renders and interactions in tests to ensure updates have processed before making assertions.

Resource APIs 
Resources can be accessed by a component without having them as part of their state. For example, a component can read a message from a Promise or read styling information from a context.
To read a value from a resource, use this API:
use lets you read the value of a resource like a Promise or context.
function MessageComponent({ messagePromise }) {
 const message = use(messagePromise);
 const theme = use(ThemeContext);
 // ...
}
Previous<ViewTransition>
Nextact

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
Resource APIs
Built-in React APIs – React
act
act is a test helper to apply pending React updates before making assertions.
await act(async actFn)
To prepare a component for assertions, wrap the code rendering it and performing updates inside an await act() call. This makes your test run closer to how React works in the browser.
Note
You might find using act() directly a bit too verbose. To avoid some of the boilerplate, you could use a library like React Testing Library, whose helpers are wrapped with act().
Reference
await act(async actFn)
Usage
Rendering components in tests
Dispatching events in tests
Troubleshooting
I’m getting an error: “The current testing environment is not configured to support act”(…)”

Reference 
await act(async actFn) 
When writing UI tests, tasks like rendering, user events, or data fetching can be considered as “units” of interaction with a user interface. React provides a helper called act() that makes sure all updates related to these “units” have been processed and applied to the DOM before you make any assertions.
The name act comes from the Arrange-Act-Assert pattern.
it ('renders with button disabled', async () => {
 await act(async () => {
   root.render(<TestComponent />)
 });
 expect(container.querySelector('button')).toBeDisabled();
});
Note
We recommend using act with await and an async function. Although the sync version works in many cases, it doesn’t work in all cases and due to the way React schedules updates internally, it’s difficult to predict when you can use the sync version.
We will deprecate and remove the sync version in the future.
Parameters 
async actFn: An async function wrapping renders or interactions for components being tested. Any updates triggered within the actFn, are added to an internal act queue, which are then flushed together to process and apply any changes to the DOM. Since it is async, React will also run any code that crosses an async boundary, and flush any updates scheduled.
Returns 
act does not return anything.
Usage 
When testing a component, you can use act to make assertions about its output.
For example, let’s say we have this Counter component, the usage examples below show how to test it:
function Counter() {
 const [count, setCount] = useState(0);
 const handleClick = () => {
   setCount(prev => prev + 1);
 }

 useEffect(() => {
   document.title = `You clicked ${count} times`;
 }, [count]);

 return (
   <div>
     <p>You clicked {count} times</p>
     <button onClick={handleClick}>
       Click me
     </button>
   </div>
 )
}
Rendering components in tests 
To test the render output of a component, wrap the render inside act():
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it('can render and update a counter', async () => {
 container = document.createElement('div');
 document.body.appendChild(container);

 // ✅ Render the component inside act().
 await act(() => {
   ReactDOMClient.createRoot(container).render(<Counter />);
 });

 const button = container.querySelector('button');
 const label = container.querySelector('p');
 expect(label.textContent).toBe('You clicked 0 times');
 expect(document.title).toBe('You clicked 0 times');
});
Here, we create a container, append it to the document, and render the Counter component inside act(). This ensures that the component is rendered and its effects are applied before making assertions.
Using act ensures that all updates have been applied before we make assertions.
Dispatching events in tests 
To test events, wrap the event dispatch inside act():
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it.only('can render and update a counter', async () => {
 const container = document.createElement('div');
 document.body.appendChild(container);

 await act( async () => {
   ReactDOMClient.createRoot(container).render(<Counter />);
 });

 // ✅ Dispatch the event inside act().
 await act(async () => {
   button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
 });

 const button = container.querySelector('button');
 const label = container.querySelector('p');
 expect(label.textContent).toBe('You clicked 1 times');
 expect(document.title).toBe('You clicked 1 times');
});
Here, we render the component with act, and then dispatch the event inside another act(). This ensures that all updates from the event are applied before making assertions.
Pitfall
Don’t forget that dispatching DOM events only works when the DOM container is added to the document. You can use a library like React Testing Library to reduce the boilerplate code.
Troubleshooting 
I’m getting an error: “The current testing environment is not configured to support act”(…)” 
Using act requires setting global.IS_REACT_ACT_ENVIRONMENT=true in your test environment. This is to ensure that act is only used in the correct environment.
If you don’t set the global, you will see an error like this:
Console
Warning: The current testing environment is not configured to support act(…)
To fix, add this to your global setup file for React tests:
global.IS_REACT_ACT_ENVIRONMENT=true
Note
In testing frameworks like React Testing Library, IS_REACT_ACT_ENVIRONMENT is already set for you.
PreviousAPIs
Nextcache

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
await act(async actFn)
Usage
Rendering components in tests
Dispatching events in tests
Troubleshooting
I’m getting an error: “The current testing environment is not configured to support act”(…)”
act – React
cache
React Server Components
cache is only for use with React Server Components.
cache lets you cache the result of a data fetch or computation.
const cachedFn = cache(fn);
Reference
cache(fn)
Usage
Cache an expensive computation
Share a snapshot of data
Preload data
Troubleshooting
My memoized function still runs even though I’ve called it with the same arguments

Reference 
cache(fn) 
Call cache outside of any components to create a version of the function with caching.
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
 const report = getMetrics(data);
 // ...
}
When getMetrics is first called with data, getMetrics will call calculateMetrics(data) and store the result in cache. If getMetrics is called again with the same data, it will return the cached result instead of calling calculateMetrics(data) again.
See more examples below.
Parameters 
fn: The function you want to cache results for. fn can take any arguments and return any value.
Returns 
cache returns a cached version of fn with the same type signature. It does not call fn in the process.
When calling cachedFn with given arguments, it first checks if a cached result exists in the cache. If a cached result exists, it returns the result. If not, it calls fn with the arguments, stores the result in the cache, and returns the result. The only time fn is called is when there is a cache miss.
Note
The optimization of caching return values based on inputs is known as memoization. We refer to the function returned from cache as a memoized function.
Caveats 
React will invalidate the cache for all memoized functions for each server request.
Each call to cache creates a new function. This means that calling cache with the same function multiple times will return different memoized functions that do not share the same cache.
cachedFn will also cache errors. If fn throws an error for certain arguments, it will be cached, and the same error is re-thrown when cachedFn is called with those same arguments.
cache is for use in Server Components only.

Usage 
Cache an expensive computation 
Use cache to skip duplicate work.
import {cache} from 'react';
import calculateUserMetrics from 'lib/user';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({user}) {
 const metrics = getUserMetrics(user);
 // ...
}

function TeamReport({users}) {
 for (let user in users) {
   const metrics = getUserMetrics(user);
   // ...
 }
 // ...
}
If the same user object is rendered in both Profile and TeamReport, the two components can share work and only call calculateUserMetrics once for that user.
Assume Profile is rendered first. It will call getUserMetrics, and check if there is a cached result. Since it is the first time getUserMetrics is called with that user, there will be a cache miss. getUserMetrics will then call calculateUserMetrics with that user and write the result to cache.
When TeamReport renders its list of users and reaches the same user object, it will call getUserMetrics and read the result from cache.
Pitfall
Calling different memoized functions will read from different caches. 
To access the same cache, components must call the same memoized function.
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
 // 🚩 Wrong: Calling `cache` in component creates new `getWeekReport` for each render
 const getWeekReport = cache(calculateWeekReport);
 const report = getWeekReport(cityData);
 // ...
}
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 Wrong: `getWeekReport` is only accessible for `Precipitation` component.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
 const report = getWeekReport(cityData);
 // ...
}
In the above example, Precipitation and Temperature each call cache to create a new memoized function with their own cache look-up. If both components render for the same cityData, they will do duplicate work to call calculateWeekReport.
In addition, Temperature creates a new memoized function each time the component is rendered which doesn’t allow for any cache sharing.
To maximize cache hits and reduce work, the two components should call the same memoized function to access the same cache. Instead, define the memoized function in a dedicated module that can be import-ed across components.
// getWeekReport.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
	const report = getWeekReport(cityData);
 // ...
}
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
 const report = getWeekReport(cityData);
 // ...
}
Here, both components call the same memoized function exported from ./getWeekReport.js to read and write to the same cache.
Share a snapshot of data 
To share a snapshot of data between components, call cache with a data-fetching function like fetch. When multiple components make the same data fetch, only one request is made and the data returned is cached and shared across components. All components refer to the same snapshot of data across the server render.
import {cache} from 'react';
import {fetchTemperature} from './api.js';

const getTemperature = cache(async (city) => {
	return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}

async function MinimalWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
If AnimatedWeatherCard and MinimalWeatherCard both render for the same city, they will receive the same snapshot of data from the memoized function.
If AnimatedWeatherCard and MinimalWeatherCard supply different city arguments to getTemperature, then fetchTemperature will be called twice and each call site will receive different data.
The city acts as a cache key.
Note
Asynchronous rendering is only supported for Server Components.
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
Preload data 
By caching a long-running data fetch, you can kick off asynchronous work prior to rendering the component.
const getUser = cache(async (id) => {
 return await db.user.query(id);
});

async function Profile({id}) {
 const user = await getUser(id);
 return (
   <section>
     <img src={user.profilePic} />
     <h2>{user.name}</h2>
   </section>
 );
}

function Page({id}) {
 // ✅ Good: start fetching the user data
 getUser(id);
 // ... some computational work
 return (
   <>
     <Profile id={id} />
   </>
 );
}
When rendering Page, the component calls getUser but note that it doesn’t use the returned data. This early getUser call kicks off the asynchronous database query that occurs while Page is doing other computational work and rendering children.
When rendering Profile, we call getUser again. If the initial getUser call has already returned and cached the user data, when Profile asks and waits for this data, it can simply read from the cache without requiring another remote procedure call. If the initial data request hasn’t been completed, preloading data in this pattern reduces delay in data-fetching.
Deep Dive
Caching asynchronous work 
Show Details











Pitfall
Calling a memoized function outside of a component will not use the cache. 
import {cache} from 'react';

const getUser = cache(async (userId) => {
 return await db.user.query(userId);
});

// 🚩 Wrong: Calling memoized function outside of component will not memoize.
getUser('demo-id');

async function DemoProfile() {
 // ✅ Good: `getUser` will memoize.
 const user = await getUser('demo-id');
 return <Profile user={user} />;
}
React only provides cache access to the memoized function in a component. When calling getUser outside of a component, it will still evaluate the function but not read or update the cache.
This is because cache access is provided through a context which is only accessible from a component.
Deep Dive
When should I use cache, memo, or useMemo? 
Show Details
















































Troubleshooting 
My memoized function still runs even though I’ve called it with the same arguments 
See prior mentioned pitfalls
Calling different memoized functions will read from different caches.
Calling a memoized function outside of a component will not use the cache.
If none of the above apply, it may be a problem with how React checks if something exists in cache.
If your arguments are not primitives (ex. objects, functions, arrays), ensure you’re passing the same object reference.
When calling a memoized function, React will look up the input arguments to see if a result is already cached. React will use shallow equality of the arguments to determine if there is a cache hit.
import {cache} from 'react';

const calculateNorm = cache((vector) => {
 // ...
});

function MapMarker(props) {
 // 🚩 Wrong: props is an object that changes every render.
 const length = calculateNorm(props);
 // ...
}

function App() {
 return (
   <>
     <MapMarker x={10} y={10} z={10} />
     <MapMarker x={10} y={10} z={10} />
   </>
 );
}
In this case the two MapMarkers look like they’re doing the same work and calling calculateNorm with the same value of {x: 10, y: 10, z:10}. Even though the objects contain the same values, they are not the same object reference as each component creates its own props object.
React will call Object.is on the input to verify if there is a cache hit.
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
 // ...
});

function MapMarker(props) {
 // ✅ Good: Pass primitives to memoized function
 const length = calculateNorm(props.x, props.y, props.z);
 // ...
}

function App() {
 return (
   <>
     <MapMarker x={10} y={10} z={10} />
     <MapMarker x={10} y={10} z={10} />
   </>
 );
}
One way to address this could be to pass the vector dimensions to calculateNorm. This works because the dimensions themselves are primitives.
Another solution may be to pass the vector object itself as a prop to the component. We’ll need to pass the same object to both component instances.
import {cache} from 'react';

const calculateNorm = cache((vector) => {
 // ...
});

function MapMarker(props) {
 // ✅ Good: Pass the same `vector` object
 const length = calculateNorm(props.vector);
 // ...
}

function App() {
 const vector = [10, 10, 10];
 return (
   <>
     <MapMarker vector={vector} />
     <MapMarker vector={vector} />
   </>
 );
}
Previousact
NextcaptureOwnerStack

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
cache(fn)
Usage
Cache an expensive computation
Share a snapshot of data
Preload data
Troubleshooting
My memoized function still runs even though I’ve called it with the same arguments
cache – React
captureOwnerStack
captureOwnerStack reads the current Owner Stack in development and returns it as a string if available.
const stack = captureOwnerStack();
Reference
captureOwnerStack()
Usage
Enhance a custom error overlay
Troubleshooting
The Owner Stack is null
captureOwnerStack is not available

Reference 
captureOwnerStack() 
Call captureOwnerStack to get the current Owner Stack.
import * as React from 'react';

function Component() {
 if (process.env.NODE_ENV !== 'production') {
   const ownerStack = React.captureOwnerStack();
   console.log(ownerStack);
 }
}
Parameters 
captureOwnerStack does not take any parameters.
Returns 
captureOwnerStack returns string | null.
Owner Stacks are available in
Component render
Effects (e.g. useEffect)
React’s event handlers (e.g. <button onClick={...} />)
React error handlers (React Root options onCaughtError, onRecoverableError, and onUncaughtError)
If no Owner Stack is available, null is returned (see Troubleshooting: The Owner Stack is null).
Caveats 
Owner Stacks are only available in development. captureOwnerStack will always return null outside of development.
Deep Dive
Owner Stack vs Component Stack 
Show Details





Usage 
Enhance a custom error overlay 
import { captureOwnerStack } from "react";
import { instrumentedConsoleError } from "./errorOverlay";

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
 originalConsoleError.apply(console, args);
 const ownerStack = captureOwnerStack();
 onConsoleError({
   // Keep in mind that in a real application, console.error can be
   // called with multiple arguments which you should account for.
   consoleMessage: args[0],
   ownerStack,
 });
};
If you intercept console.error calls to highlight them in an error overlay, you can call captureOwnerStack to include the Owner Stack.
index.jserrorOverlay.jsApp.js
Reset
Fork
import { captureOwnerStack } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import { onConsoleError } from "./errorOverlay";
import './styles.css';

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Keep in mind that in a real application, console.error can be
    // called with multiple arguments which you should account for.
    consoleMessage: args[0],
    ownerStack,
  });
};

const container = document.getElementById("root");
createRoot(container).render(<App />);


Show more
Troubleshooting 
The Owner Stack is null 
The call of captureOwnerStack happened outside of a React controlled function e.g. in a setTimeout callback, after a fetch call or in a custom DOM event handler. During render, Effects, React event handlers, and React error handlers (e.g. hydrateRoot#options.onCaughtError) Owner Stacks should be available.
In the example below, clicking the button will log an empty Owner Stack because captureOwnerStack was called during a custom DOM event handler. The Owner Stack must be captured earlier e.g. by moving the call of captureOwnerStack into the Effect body.
App.js
DownloadReset
Fork
import {captureOwnerStack, useEffect} from 'react';

export default function App() {
  useEffect(() => {
    // Should call `captureOwnerStack` here.
    function handleEvent() {
      // Calling it in a custom DOM event handler is too late.
      // The Owner Stack will be `null` at this point.
      console.log('Owner Stack: ', captureOwnerStack());
    }

    document.addEventListener('click', handleEvent);

    return () => {
      document.removeEventListener('click', handleEvent);
    }
  })

  return <button>Click me to see that Owner Stacks are not available in custom DOM event handlers</button>;
}


Show more
captureOwnerStack is not available 
captureOwnerStack is only exported in development builds. It will be undefined in production builds. If captureOwnerStack is used in files that are bundled for production and development, you should conditionally access it from a namespace import.
// Don't use named imports of `captureOwnerStack` in files that are bundled for development and production.
import {captureOwnerStack} from 'react';
// Use a namespace import instead and access `captureOwnerStack` conditionally.
import * as React from 'react';

if (process.env.NODE_ENV !== 'production') {
 const ownerStack = React.captureOwnerStack();
 console.log('Owner Stack', ownerStack);
}
Previouscache
NextcreateContext

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
captureOwnerStack()
Usage
Enhance a custom error overlay
Troubleshooting
The Owner Stack is null
captureOwnerStack is not available
captureOwnerStack – React
createContext
createContext lets you create a context that components can provide or read.
const SomeContext = createContext(defaultValue)
Reference
createContext(defaultValue)
SomeContext Provider
SomeContext.Consumer
Usage
Creating context
Importing and exporting context from a file
Troubleshooting
I can’t find a way to change the context value

Reference 
createContext(defaultValue) 
Call createContext outside of any components to create a context.
import { createContext } from 'react';

const ThemeContext = createContext('light');
See more examples below.
Parameters 
defaultValue: The value that you want the context to have when there is no matching context provider in the tree above the component that reads context. If you don’t have any meaningful default value, specify null. The default value is meant as a “last resort” fallback. It is static and never changes over time.
Returns 
createContext returns a context object.
The context object itself does not hold any information. It represents which context other components read or provide. Typically, you will use SomeContext in components above to specify the context value, and call useContext(SomeContext) in components below to read it. The context object has a few properties:
SomeContext lets you provide the context value to components.
SomeContext.Consumer is an alternative and rarely used way to read the context value.
SomeContext.Provider is a legacy way to provide the context value before React 19.

SomeContext Provider 
Wrap your components into a context provider to specify the value of this context for all components inside:
function App() {
 const [theme, setTheme] = useState('light');
 // ...
 return (
   <ThemeContext value={theme}>
     <Page />
   </ThemeContext>
 );
}
Note
Starting in React 19, you can render <SomeContext> as a provider.
In older versions of React, use <SomeContext.Provider>.
Props 
value: The value that you want to pass to all the components reading this context inside this provider, no matter how deep. The context value can be of any type. A component calling useContext(SomeContext) inside of the provider receives the value of the innermost corresponding context provider above it.

SomeContext.Consumer 
Before useContext existed, there was an older way to read context:
function Button() {
 // 🟡 Legacy way (not recommended)
 return (
   <ThemeContext.Consumer>
     {theme => (
       <button className={theme} />
     )}
   </ThemeContext.Consumer>
 );
}
Although this older way still works, newly written code should read context with useContext() instead:
function Button() {
 // ✅ Recommended way
 const theme = useContext(ThemeContext);
 return <button className={theme} />;
}
Props 
children: A function. React will call the function you pass with the current context value determined by the same algorithm as useContext() does, and render the result you return from this function. React will also re-run this function and update the UI whenever the context from the parent components changes.

Usage 
Creating context 
Context lets components pass information deep down without explicitly passing props.
Call createContext outside any components to create one or more contexts.
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
createContext returns a context object. Components can read context by passing it to useContext():
function Button() {
 const theme = useContext(ThemeContext);
 // ...
}

function Profile() {
 const currentUser = useContext(AuthContext);
 // ...
}
By default, the values they receive will be the default values you have specified when creating the contexts. However, by itself this isn’t useful because the default values never change.
Context is useful because you can provide other, dynamic values from your components:
function App() {
 const [theme, setTheme] = useState('dark');
 const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

 // ...

 return (
   <ThemeContext value={theme}>
     <AuthContext value={currentUser}>
       <Page />
     </AuthContext>
   </ThemeContext>
 );
}
Now the Page component and any components inside it, no matter how deep, will “see” the passed context values. If the passed context values change, React will re-render the components reading the context as well.
Read more about reading and providing context and see examples.

Importing and exporting context from a file 
Often, components in different files will need access to the same context. This is why it’s common to declare contexts in a separate file. Then you can use the export statement to make context available for other files:
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
Components declared in other files can then use the import statement to read or provide this context:
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
 const theme = useContext(ThemeContext);
 // ...
}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
 // ...
 return (
   <ThemeContext value={theme}>
     <AuthContext value={currentUser}>
       <Page />
     </AuthContext>
   </ThemeContext>
 );
}
This works similar to importing and exporting components.

Troubleshooting 
I can’t find a way to change the context value 
Code like this specifies the default context value:
const ThemeContext = createContext('light');
This value never changes. React only uses this value as a fallback if it can’t find a matching provider above.
To make context change over time, add state and wrap components in a context provider.
PreviouscaptureOwnerStack
Nextlazy

API Reference
APIs
memo
memo lets you skip re-rendering a component when its props are unchanged.
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
Reference
memo(Component, arePropsEqual?)
Usage
Skipping re-rendering when props are unchanged
Updating a memoized component using state
Updating a memoized component using a context
Minimizing props changes
Specifying a custom comparison function
Troubleshooting
My component re-renders when a prop is an object, array, or function

Reference 
memo(Component, arePropsEqual?) 
Wrap a component in memo to get a memoized version of that component. This memoized version of your component will usually not be re-rendered when its parent component is re-rendered as long as its props have not changed. But React may still re-render it: memoization is a performance optimization, not a guarantee.
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
 // ...
});
See more examples below.
Parameters 
Component: The component that you want to memoize. The memo does not modify this component, but returns a new, memoized component instead. Any valid React component, including functions and forwardRef components, is accepted.
optional arePropsEqual: A function that accepts two arguments: the component’s previous props, and its new props. It should return true if the old and new props are equal: that is, if the component will render the same output and behave in the same way with the new props as with the old. Otherwise it should return false. Usually, you will not specify this function. By default, React will compare each prop with Object.is.
Returns 
memo returns a new React component. It behaves the same as the component provided to memo except that React will not always re-render it when its parent is being re-rendered unless its props have changed.

Usage 
Skipping re-rendering when props are unchanged 
React normally re-renders a component whenever its parent re-renders. With memo, you can create a component that React will not re-render when its parent re-renders so long as its new props are the same as the old props. Such a component is said to be memoized.
To memoize a component, wrap it in memo and use the value that it returns in place of your original component:
const Greeting = memo(function Greeting({ name }) {
 return <h1>Hello, {name}!</h1>;
});

export default Greeting;
A React component should always have pure rendering logic. This means that it must return the same output if its props, state, and context haven’t changed. By using memo, you are telling React that your component complies with this requirement, so React doesn’t need to re-render as long as its props haven’t changed. Even with memo, your component will re-render if its own state changes or if a context that it’s using changes.
In this example, notice that the Greeting component re-renders whenever name is changed (because that’s one of its props), but not when address is changed (because it’s not passed to Greeting as a prop):
App.js
DownloadReset
Fork
import { memo, useState } from 'react';

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

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});


Console (2)
Greeting was rendered at 9:26:46 PM
Greeting was rendered at 9:26:46 PM
Show more
Note
You should only rely on memo as a performance optimization. If your code doesn’t work without it, find the underlying problem and fix it first. Then you may add memo to improve performance.
Deep Dive
Should you add memo everywhere? 
Show Details











Updating a memoized component using state 
Even when a component is memoized, it will still re-render when its own state changes. Memoization only has to do with props that are passed to the component from its parent.
App.js
DownloadReset
Fork
import { memo, useState } from 'react';

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

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}


Show more
If you set a state variable to its current value, React will skip re-rendering your component even without memo. You may still see your component function being called an extra time, but the result will be discarded.

Updating a memoized component using a context 
Even when a component is memoized, it will still re-render when a context that it’s using changes. Memoization only has to do with props that are passed to the component from its parent.
App.js
DownloadReset
Fork
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark'); 
  }

  return (
    <ThemeContext value={theme}>
      <button onClick={handleClick}>
        Switch theme
      </button>
      <Greeting name="Taylor" />
    </ThemeContext>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
  );
});


Show more
To make your component re-render only when a part of some context changes, split your component in two. Read what you need from the context in the outer component, and pass it down to a memoized child as a prop.

Minimizing props changes 
When you use memo, your component re-renders whenever any prop is not shallowly equal to what it was previously. This means that React compares every prop in your component with its previous value using the Object.is comparison. Note that Object.is(3, 3) is true, but Object.is({}, {}) is false.
To get the most out of memo, minimize the times that the props change. For example, if the prop is an object, prevent the parent component from re-creating that object every time by using useMemo:
function Page() {
 const [name, setName] = useState('Taylor');
 const [age, setAge] = useState(42);

 const person = useMemo(
   () => ({ name, age }),
   [name, age]
 );

 return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
 // ...
});
A better way to minimize props changes is to make sure the component accepts the minimum necessary information in its props. For example, it could accept individual values instead of a whole object:
function Page() {
 const [name, setName] = useState('Taylor');
 const [age, setAge] = useState(42);
 return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
 // ...
});
Even individual values can sometimes be projected to ones that change less frequently. For example, here a component accepts a boolean indicating the presence of a value rather than the value itself:
function GroupsLanding({ person }) {
 const hasGroups = person.groups !== null;
 return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
 // ...
});
When you need to pass a function to memoized component, either declare it outside your component so that it never changes, or useCallback to cache its definition between re-renders.

Specifying a custom comparison function 
In rare cases it may be infeasible to minimize the props changes of a memoized component. In that case, you can provide a custom comparison function, which React will use to compare the old and new props instead of using shallow equality. This function is passed as a second argument to memo. It should return true only if the new props would result in the same output as the old props; otherwise it should return false.
const Chart = memo(function Chart({ dataPoints }) {
 // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
 return (
   oldProps.dataPoints.length === newProps.dataPoints.length &&
   oldProps.dataPoints.every((oldPoint, index) => {
     const newPoint = newProps.dataPoints[index];
     return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
   })
 );
}
If you do this, use the Performance panel in your browser developer tools to make sure that your comparison function is actually faster than re-rendering the component. You might be surprised.
When you do performance measurements, make sure that React is running in the production mode.
Pitfall
If you provide a custom arePropsEqual implementation, you must compare every prop, including functions. Functions often close over the props and state of parent components. If you return true when oldProps.onClick !== newProps.onClick, your component will keep “seeing” the props and state from a previous render inside its onClick handler, leading to very confusing bugs.
Avoid doing deep equality checks inside arePropsEqual unless you are 100% sure that the data structure you’re working with has a known limited depth. Deep equality checks can become incredibly slow and can freeze your app for many seconds if someone changes the data structure later.

Troubleshooting 
My component re-renders when a prop is an object, array, or function 
React compares old and new props by shallow equality: that is, it considers whether each new prop is reference-equal to the old prop. If you create a new object or array each time the parent is re-rendered, even if the individual elements are each the same, React will still consider it to be changed. Similarly, if you create a new function when rendering the parent component, React will consider it to have changed even if the function has the same definition. To avoid this, simplify props or memoize props in the parent component.
Previouslazy
NextstartTransition

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
memo(Component, arePropsEqual?)
Usage
Skipping re-rendering when props are unchanged
Updating a memoized component using state
Updating a memoized component using a context
Minimizing props changes
Specifying a custom comparison function
Troubleshooting
My component re-renders when a prop is an object, array, or function
memo – React
startTransition
startTransition lets you render a part of the UI in the background.
startTransition(action)
Reference
startTransition(action)
Usage
Marking a state update as a non-blocking Transition

Reference 
startTransition(action) 
The startTransition function lets you mark a state update as a Transition.
import { startTransition } from 'react';

function TabContainer() {
 const [tab, setTab] = useState('about');

 function selectTab(nextTab) {
   startTransition(() => {
     setTab(nextTab);
   });
 }
 // ...
}
See more examples below.
Parameters 
action: A function that updates some state by calling one or more set functions. React calls action immediately with no parameters and marks all state updates scheduled synchronously during the action function call as Transitions. Any async calls awaited in the action will be included in the transition, but currently require wrapping any set functions after the await in an additional startTransition (see Troubleshooting). State updates marked as Transitions will be non-blocking and will not display unwanted loading indicators..
Returns 
startTransition does not return anything.
Caveats 
startTransition does not provide a way to track whether a Transition is pending. To show a pending indicator while the Transition is ongoing, you need useTransition instead.
You can wrap an update into a Transition only if you have access to the set function of that state. If you want to start a Transition in response to some prop or a custom Hook return value, try useDeferredValue instead.
The function you pass to startTransition is called immediately, marking all state updates that happen while it executes as Transitions. If you try to perform state updates in a setTimeout, for example, they won’t be marked as Transitions.
You must wrap any state updates after any async requests in another startTransition to mark them as Transitions. This is a known limitation that we will fix in the future (see Troubleshooting).
A state update marked as a Transition will be interrupted by other state updates. For example, if you update a chart component inside a Transition, but then start typing into an input while the chart is in the middle of a re-render, React will restart the rendering work on the chart component after handling the input state update.
Transition updates can’t be used to control text inputs.
If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that may be removed in a future release.

Usage 
Marking a state update as a non-blocking Transition 
You can mark a state update as a Transition by wrapping it in a startTransition call:
import { startTransition } from 'react';

function TabContainer() {
 const [tab, setTab] = useState('about');

 function selectTab(nextTab) {
   startTransition(() => {
     setTab(nextTab);
   });
 }
 // ...
}
Transitions let you keep the user interface updates responsive even on slow devices.
With a Transition, your UI stays responsive in the middle of a re-render. For example, if the user clicks a tab but then change their mind and click another tab, they can do that without waiting for the first re-render to finish.
Note
startTransition is very similar to useTransition, except that it does not provide the isPending flag to track whether a Transition is ongoing. You can call startTransition when useTransition is not available. For example, startTransition works outside components, such as from a data library.
Learn about Transitions and see examples on the useTransition page.
Previousmemo
Nextuse

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
startTransition(action)
Usage
Marking a state update as a non-blocking Transition
startTransition – React
use
use is a React API that lets you read the value of a resource like a Promise or context.
const value = use(resource);
Reference
use(resource)
Usage
Reading context with use
Streaming data from the server to the client
Dealing with rejected Promises
Troubleshooting
“Suspense Exception: This is not a real error!”

Reference 
use(resource) 
Call use in your component to read the value of a resource like a Promise or context.
import { use } from 'react';

function MessageComponent({ messagePromise }) {
 const message = use(messagePromise);
 const theme = use(ThemeContext);
 // ...
Unlike React Hooks, use can be called within loops and conditional statements like if. Like React Hooks, the function that calls use must be a Component or Hook.
When called with a Promise, the use API integrates with Suspense and error boundaries. The component calling use suspends while the Promise passed to use is pending. If the component that calls use is wrapped in a Suspense boundary, the fallback will be displayed.  Once the Promise is resolved, the Suspense fallback is replaced by the rendered components using the data returned by the use API. If the Promise passed to use is rejected, the fallback of the nearest Error Boundary will be displayed.
See more examples below.
Parameters 
resource: this is the source of the data you want to read a value from. A resource can be a Promise or a context.
Returns 
The use API returns the value that was read from the resource like the resolved value of a Promise or context.
Caveats 
The use API must be called inside a Component or a Hook.
When fetching data in a Server Component, prefer async and await over use. async and await pick up rendering from the point where await was invoked, whereas use re-renders the component after the data is resolved.
Prefer creating Promises in Server Components and passing them to Client Components over creating Promises in Client Components. Promises created in Client Components are recreated on every render. Promises passed from a Server Component to a Client Component are stable across re-renders. See this example.

Usage 
Reading context with use 
When a context is passed to use, it works similarly to useContext. While useContext must be called at the top level of your component, use can be called inside conditionals like if and loops like for. use is preferred over useContext because it is more flexible.
import { use } from 'react';

function Button() {
 const theme = use(ThemeContext);
 // ...
use returns the context value for the context you passed. To determine the context value, React searches the component tree and finds the closest context provider above for that particular context.
To pass context to a Button, wrap it or one of its parent components into the corresponding context provider.
function MyPage() {
 return (
   <ThemeContext value="dark">
     <Form />
   </ThemeContext>
 );
}

function Form() {
 // ... renders buttons inside ...
}
It doesn’t matter how many layers of components there are between the provider and the Button. When a Button anywhere inside of Form calls use(ThemeContext), it will receive "dark" as the value.
Unlike useContext, use can be called in conditionals and loops like if.
function HorizontalRule({ show }) {
 if (show) {
   const theme = use(ThemeContext);
   return <hr className={theme} />;
 }
 return false;
}
use is called from inside a if statement, allowing you to conditionally read values from a Context.
Pitfall
Like useContext, use(context) always looks for the closest context provider above the component that calls it. It searches upwards and does not consider context providers in the component from which you’re calling use(context).
App.js
DownloadReset
Fork
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}


Show more
Streaming data from the server to the client 
Data can be streamed from the server to the client by passing a Promise as a prop from a Server Component to a Client Component.
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
 const messagePromise = fetchMessage();
 return (
   <Suspense fallback={<p>waiting for message...</p>}>
     <Message messagePromise={messagePromise} />
   </Suspense>
 );
}
The Client Component then takes the Promise it received as a prop and passes it to the use API. This allows the Client Component to read the value from the Promise that was initially created by the Server Component.
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
 const messageContent = use(messagePromise);
 return <p>Here is the message: {messageContent}</p>;
}
Because Message is wrapped in Suspense, the fallback will be displayed until the Promise is resolved. When the Promise is resolved, the value will be read by the use API and the Message component will replace the Suspense fallback.
message.js
Reset
Fork
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}


Show more
Note
When passing a Promise from a Server Component to a Client Component, its resolved value must be serializable to pass between server and client. Data types like functions aren’t serializable and cannot be the resolved value of such a Promise.
Deep Dive
Should I resolve a Promise in a Server or Client Component? 
Show Details



Dealing with rejected Promises 
In some cases a Promise passed to use could be rejected. You can handle rejected Promises by either:
Displaying an error to users with an error boundary.
Providing an alternative value with Promise.catch
Pitfall
use cannot be called in a try-catch block. Instead of a try-catch block wrap your component in an Error Boundary, or provide an alternative value to use with the Promise’s .catch method.
Displaying an error to users with an error boundary 
If you’d like to display an error to your users when a Promise is rejected, you can use an error boundary. To use an error boundary, wrap the component where you are calling the use API in an error boundary. If the Promise passed to use is rejected the fallback for the error boundary will be displayed.
message.js
Reset
Fork
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<p>⌛Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}


Show more
Providing an alternative value with Promise.catch 
If you’d like to provide an alternative value when the Promise passed to use is rejected you can use the Promise’s catch method.
import { Message } from './message.js';

export default function App() {
 const messagePromise = new Promise((resolve, reject) => {
   reject();
 }).catch(() => {
   return "no new message found.";
 });

 return (
   <Suspense fallback={<p>waiting for message...</p>}>
     <Message messagePromise={messagePromise} />
   </Suspense>
 );
}
To use the Promise’s catch method, call catch on the Promise object. catch takes a single argument: a function that takes an error message as an argument. Whatever is returned by the function passed to catch will be used as the resolved value of the Promise.

Troubleshooting 
“Suspense Exception: This is not a real error!” 
You are either calling use outside of a React Component or Hook function, or calling use in a try–catch block. If you are calling use inside a try–catch block, wrap your component in an error boundary, or call the Promise’s catch to catch the error and resolve the Promise with another value. See these examples.
If you are calling use outside a React Component or Hook function, move the use call to a React Component or Hook function.
function MessageComponent({messagePromise}) {
 function download() {
   // ❌ the function calling `use` is not a Component or Hook
   const message = use(messagePromise);
   // ...
Instead, call use outside any component closures, where the function that calls use is a Component or Hook.
function MessageComponent({messagePromise}) {
 // ✅ `use` is being called from a component.
 const message = use(messagePromise);
 // ...
PreviousstartTransition
Nextexperimental_taintObjectReference

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
use(resource)
Usage
Reading context with use
Streaming data from the server to the client
Dealing with rejected Promises
Troubleshooting
“Suspense Exception: This is not a real error!”
use – React
experimental_taintObjectReference
Experimental Feature
This API is experimental and is not available in a stable version of React yet.
You can try it by upgrading React packages to the most recent experimental version:
react@experimental
react-dom@experimental
eslint-plugin-react-hooks@experimental
Experimental versions of React may contain bugs. Don’t use them in production.
This API is only available inside React Server Components.
taintObjectReference lets you prevent a specific object instance from being passed to a Client Component like a user object.
experimental_taintObjectReference(message, object);
To prevent passing a key, hash or token, see taintUniqueValue.
Reference
taintObjectReference(message, object)
Usage
Prevent user data from unintentionally reaching the client

Reference 
taintObjectReference(message, object) 
Call taintObjectReference with an object to register it with React as something that should not be allowed to be passed to the Client as is:
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
 'Do not pass ALL environment variables to the client.',
 process.env
);
See more examples below.
Parameters 
message: The message you want to display if the object gets passed to a Client Component. This message will be displayed as a part of the Error that will be thrown if the object gets passed to a Client Component.
object: The object to be tainted. Functions and class instances can be passed to taintObjectReference as object. Functions and classes are already blocked from being passed to Client Components but the React’s default error message will be replaced by what you defined in message. When a specific instance of a Typed Array is passed to taintObjectReference as object, any other copies of the Typed Array will not be tainted.
Returns 
experimental_taintObjectReference returns undefined.
Caveats 
Recreating or cloning a tainted object creates a new untainted object which may contain sensitive data. For example, if you have a tainted user object, const userInfo = {name: user.name, ssn: user.ssn} or {...user} will create new objects which are not tainted. taintObjectReference only protects against simple mistakes when the object is passed through to a Client Component unchanged.
Pitfall
Do not rely on just tainting for security. Tainting an object doesn’t prevent leaking of every possible derived value. For example, the clone of a tainted object will create a new untainted object. Using data from a tainted object (e.g. {secret: taintedObj.secret}) will create a new value or object that is not tainted. Tainting is a layer of protection; a secure app will have multiple layers of protection, well designed APIs, and isolation patterns.

Usage 
Prevent user data from unintentionally reaching the client 
A Client Component should never accept objects that carry sensitive data. Ideally, the data fetching functions should not expose data that the current user should not have access to. Sometimes mistakes happen during refactoring. To protect against these mistakes happening down the line we can “taint” the user object in our data API.
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
 const user = await db`SELECT * FROM users WHERE id = ${id}`;
 experimental_taintObjectReference(
   'Do not pass the entire user object to the client. ' +
     'Instead, pick off the specific properties you need for this use case.',
   user,
 );
 return user;
}
Now whenever anyone tries to pass this object to a Client Component, an error will be thrown with the passed in error message instead.
Deep Dive
Protecting against leaks in data fetching 
Show Details



























Previoususe
Nextexperimental_taintUniqueValue

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
taintObjectReference(message, object)
Usage
Prevent user data from unintentionally reaching the client
experimental_taintObjectReference – React
experimental_taintUniqueValue
Experimental Feature
This API is experimental and is not available in a stable version of React yet.
You can try it by upgrading React packages to the most recent experimental version:
react@experimental
react-dom@experimental
eslint-plugin-react-hooks@experimental
Experimental versions of React may contain bugs. Don’t use them in production.
This API is only available inside React Server Components.
taintUniqueValue lets you prevent unique values from being passed to Client Components like passwords, keys, or tokens.
taintUniqueValue(errMessage, lifetime, value)
To prevent passing an object containing sensitive data, see taintObjectReference.
Reference
taintUniqueValue(message, lifetime, value)
Usage
Prevent a token from being passed to Client Components

Reference 
taintUniqueValue(message, lifetime, value) 
Call taintUniqueValue with a password, token, key or hash to register it with React as something that should not be allowed to be passed to the Client as is:
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
 'Do not pass secret keys to the client.',
 process,
 process.env.SECRET_KEY
);
See more examples below.
Parameters 
message: The message you want to display if value is passed to a Client Component. This message will be displayed as a part of the Error that will be thrown if value is passed to a Client Component.
lifetime: Any object that indicates how long value should be tainted. value will be blocked from being sent to any Client Component while this object still exists. For example, passing globalThis blocks the value for the lifetime of an app. lifetime is typically an object whose properties contains value.
value: A string, bigint or TypedArray. value must be a unique sequence of characters or bytes with high entropy such as a cryptographic token, private key, hash, or a long password. value will be blocked from being sent to any Client Component.
Returns 
experimental_taintUniqueValue returns undefined.
Caveats 
Deriving new values from tainted values can compromise tainting protection. New values created by uppercasing tainted values, concatenating tainted string values into a larger string, converting tainted values to base64, substringing tainted values, and other similar transformations are not tainted unless you explicitly call taintUniqueValue on these newly created values.
Do not use taintUniqueValue to protect low-entropy values such as PIN codes or phone numbers. If any value in a request is controlled by an attacker, they could infer which value is tainted by enumerating all possible values of the secret.

Usage 
Prevent a token from being passed to Client Components 
To ensure that sensitive information such as passwords, session tokens, or other unique values do not inadvertently get passed to Client Components, the taintUniqueValue function provides a layer of protection. When a value is tainted, any attempt to pass it to a Client Component will result in an error.
The lifetime argument defines the duration for which the value remains tainted. For values that should remain tainted indefinitely, objects like globalThis or process can serve as the lifetime argument. These objects have a lifespan that spans the entire duration of your app’s execution.
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
 'Do not pass a user password to the client.',
 globalThis,
 process.env.SECRET_KEY
);
If the tainted value’s lifespan is tied to a object, the lifetime should be the object that encapsulates the value. This ensures the tainted value remains protected for the lifetime of the encapsulating object.
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
 const user = await db`SELECT * FROM users WHERE id = ${id}`;
 experimental_taintUniqueValue(
   'Do not pass a user session token to the client.',
   user,
   user.session.token
 );
 return user;
}
In this example, the user object serves as the lifetime argument. If this object gets stored in a global cache or is accessible by another request, the session token remains tainted.
Pitfall
Do not rely solely on tainting for security. Tainting a value doesn’t block every possible derived value. For example, creating a new value by upper casing a tainted string will not taint the new value.
import {experimental_taintUniqueValue} from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
 'Do not pass the password to the client.',
 globalThis,
 password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword` is not tainted
In this example, the constant password is tainted. Then password is used to create a new value uppercasePassword by calling the toUpperCase method on password. The newly created uppercasePassword is not tainted.
Other similar ways of deriving new values from tainted values like concatenating it into a larger string, converting it to base64, or returning a substring create untained values.
Tainting only protects against simple mistakes like explicitly passing secret values to the client. Mistakes in calling the taintUniqueValue like using a global store outside of React, without the corresponding lifetime object, can cause the tainted value to become untainted. Tainting is a layer of protection; a secure app will have multiple layers of protection, well designed APIs, and isolation patterns.
Deep Dive
Using server-only and taintUniqueValue to prevent leaking secrets 
Show Details



























Previousexperimental_taintObjectReference
Nextunstable_addTransitionType

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
taintUniqueValue(message, lifetime, value)
Usage
Prevent a token from being passed to Client Components
experimental_taintUniqueValue – React
unstable_addTransitionType
Experimental Feature
This API is experimental and is not available in a stable version of React yet.
You can try it by upgrading React packages to the most recent experimental version:
react@experimental
react-dom@experimental
eslint-plugin-react-hooks@experimental
Experimental versions of React may contain bugs. Don’t use them in production.
unstable_addTransitionType lets you specify the cause of a transition.
startTransition(() => {
 unstable_addTransitionType('my-transition-type');
 setState(newState);
});
Reference
addTransitionType
Usage
Adding the cause of a transition
Customize animations using browser view transition types
Customize animations using View Transition Class
Customize animations using ViewTransition events
Troubleshooting
TODO

Reference 
addTransitionType 
Parameters 
type: The type of transition to add. This can be any string.
Returns 
startTransition does not return anything.
Caveats 
If multiple transitions are combined, all Transition Types are collected. You can also add more than one type to a Transition.
Transition Types are reset after each commit. This means a <Suspense> fallback will associate the types after a startTransition, but revealing the content does not.

Usage 
Adding the cause of a transition 
Call addTransitionType inside of startTransition to indicate the cause of a transition:
import { startTransition, unstable_addTransitionType } from 'react';

function Submit({action) {
 function handleClick() {
   startTransition(() => {
     unstable_addTransitionType('submit-click');
     action();
   });
 }

 return <button onClick={handleClick}>Click me</button>;
}
When you call addTransitionType inside the scope of startTransition, React will associate submit-click as one of the causes for the Transition.
Currently, Transition Types can be used to customize different animations based on what caused the Transition. You have three different ways to choose from for how to use them:
Customize animations using browser view transition types
Customize animations using View Transition Class
Customize animations using ViewTransition events
In the future, we plan to support more use cases for using the cause of a transition.

Customize animations using browser view transition types 
When a ViewTransition activates from a transition, React adds all the Transition Types as browser view transition types to the element.
This allows you to customize different animations based on CSS scopes:
function Component() {
 return (
   <ViewTransition>
     <div>Hello</div>
   </ViewTransition>
 );
}

startTransition(() => {
 unstable_addTransitionType('my-transition-type');
 setShow(true);
});
:root:active-view-transition-type(my-transition-type) {
 &::view-transition-...(...) {
   ...
 }
}

Customize animations using View Transition Class 
You can customize animations for an activated ViewTransition based on type by passing an object to the View Transition Class:
function Component() {
 return (
   <ViewTransition enter={{
     'my-transition-type': 'my-transition-class',
   }}>
     <div>Hello</div>
   </ViewTransition>
 );
}

// ...
startTransition(() => {
 unstable_addTransitionType('my-transition-type');
 setState(newState);
});
If multiple types match, then they’re joined together. If no types match then the special “default” entry is used instead. If any type has the value “none” then that wins and the ViewTransition is disabled (not assigned a name).
These can be combined with enter/exit/update/layout/share props to match based on kind of trigger and Transition Type.
<ViewTransition enter={{
 'navigation-back': 'enter-right',
 'navigation-forward': 'enter-left',
}}
exit={{
 'navigation-back': 'exit-right',
 'navigation-forward': 'exit-left',
}}>

Customize animations using ViewTransition events 
You can imperatively customize animations for an activated ViewTransition based on type using View Transition events:
<ViewTransition onUpdate={(inst, types) => {
 if (types.includes('navigation-back')) {
   ...
 } else if (types.includes('navigation-forward')) {
   ...
 } else {
   ...
 }
}}>
This allows you to pick different imperative Animations based on the cause.

Troubleshooting 
TODO 
Previousexperimental_taintUniqueValue

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
addTransitionType
Usage
Adding the cause of a transition
Customize animations using browser view transition types
Customize animations using View Transition Class
Customize animations using ViewTransition events
Troubleshooting
TODO
unstable_addTransitionType – React





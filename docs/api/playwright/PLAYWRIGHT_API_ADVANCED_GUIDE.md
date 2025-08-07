# Playwright API Advanced Guide

<!-- This document will contain advanced Playwright API reference and patterns -->
 Frame
At every point of time, page exposes its current frame tree via the page.mainFrame() and frame.childFrames() methods.
Frame object's lifecycle is controlled by three events, dispatched on the page object:
page.on('frameattached') - fired when the frame gets attached to the page. A Frame can be attached to the page only once.
page.on('framenavigated') - fired when the frame commits navigation to a different URL.
page.on('framedetached') - fired when the frame gets detached from the page. A Frame can be detached from the page only once.
An example of dumping frame tree:
const { firefox } = require('playwright');  // Or 'chromium' or 'webkit'.

(async () => {
 const browser = await firefox.launch();
 const page = await browser.newPage();
 await page.goto('https://www.google.com/chrome/browser/canary.html');
 dumpFrameTree(page.mainFrame(), '');
 await browser.close();

 function dumpFrameTree(frame, indent) {
   console.log(indent + frame.url());
   for (const child of frame.childFrames())
     dumpFrameTree(child, indent + '  ');
 }
})();

Methods
addScriptTag
Added before v1.9 
Returns the added tag when the script's onload fires or when the script content was injected into frame.
Adds a <script> tag into the page with the desired url or content.
Usage
await frame.addScriptTag();
await frame.addScriptTag(options);
Arguments
options Object (optional)
content string (optional)#
Raw JavaScript content to be injected into frame.
path string (optional)#
Path to the JavaScript file to be injected into frame. If path is a relative path, then it is resolved relative to the current working directory.
type string (optional)#
Script type. Use 'module' in order to load a JavaScript ES6 module. See script for more details.
url string (optional)#
URL of a script to be added.
Returns
Promise<ElementHandle>#

addStyleTag
Added before v1.9 
Returns the added tag when the stylesheet's onload fires or when the CSS content was injected into frame.
Adds a <link rel="stylesheet"> tag into the page with the desired url or a <style type="text/css"> tag with the content.
Usage
await frame.addStyleTag();
await frame.addStyleTag(options);
Arguments
options Object (optional)
content string (optional)#
Raw CSS content to be injected into frame.
path string (optional)#
Path to the CSS file to be injected into frame. If path is a relative path, then it is resolved relative to the current working directory.
url string (optional)#
URL of the <link> tag.
Returns
Promise<ElementHandle>#

childFrames
Added before v1.9 
Usage
frame.childFrames();
Returns
Array<Frame>#

content
Added before v1.9 
Gets the full HTML contents of the frame, including the doctype.
Usage
await frame.content();
Returns
Promise<string>#

dragAndDrop
Added in: v1.13 
Usage
await frame.dragAndDrop(source, target);
await frame.dragAndDrop(source, target, options);
Arguments
source string#
A selector to search for an element to drag. If there are multiple elements satisfying the selector, the first will be used.
target string#
A selector to search for an element to drop onto. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
sourcePosition Object (optional) Added in: v1.14#
x number
y number
Clicks on the source element at this point relative to the top-left corner of the element's padding box. If not specified, some visible point of the element is used.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
targetPosition Object (optional) Added in: v1.14#
x number
y number
Drops on the target element at this point relative to the top-left corner of the element's padding box. If not specified, some visible point of the element is used.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

evaluate
Added before v1.9 
Returns the return value of pageFunction.
If the function passed to the frame.evaluate() returns a Promise, then frame.evaluate() would wait for the promise to resolve and return its value.
If the function passed to the frame.evaluate() returns a non-Serializable value, then frame.evaluate() returns undefined. Playwright also supports transferring some additional values that are not serializable by JSON: -0, NaN, Infinity, -Infinity.
Usage
const result = await frame.evaluate(([x, y]) => {
 return Promise.resolve(x * y);
}, [7, 8]);
console.log(result); // prints "56"
A string can also be passed in instead of a function.
console.log(await frame.evaluate('1 + 2')); // prints "3"
ElementHandle instances can be passed as an argument to the frame.evaluate():
const bodyHandle = await frame.evaluate('document.body');
const html = await frame.evaluate(([body, suffix]) =>
 body.innerHTML + suffix, [bodyHandle, 'hello'],
);
await bodyHandle.dispose();
Arguments
pageFunction function | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<Serializable>#

evaluateHandle
Added before v1.9 
Returns the return value of pageFunction as a JSHandle.
The only difference between frame.evaluate() and frame.evaluateHandle() is that frame.evaluateHandle() returns JSHandle.
If the function, passed to the frame.evaluateHandle(), returns a Promise, then frame.evaluateHandle() would wait for the promise to resolve and return its value.
Usage
// Handle for the window object
const aWindowHandle = await frame.evaluateHandle(() => Promise.resolve(window));
A string can also be passed in instead of a function.
const aHandle = await frame.evaluateHandle('document'); // Handle for the 'document'.
JSHandle instances can be passed as an argument to the frame.evaluateHandle():
const aHandle = await frame.evaluateHandle(() => document.body);
const resultHandle = await frame.evaluateHandle(([body, suffix]) =>
 body.innerHTML + suffix, [aHandle, 'hello'],
);
console.log(await resultHandle.jsonValue());
await resultHandle.dispose();
Arguments
pageFunction function | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<JSHandle>#

frameElement
Added before v1.9 
Returns the frame or iframe element handle which corresponds to this frame.
This is an inverse of elementHandle.contentFrame(). Note that returned handle actually belongs to the parent frame.
This method throws an error if the frame has been detached before frameElement() returns.
Usage
const frameElement = await frame.frameElement();
const contentFrame = await frameElement.contentFrame();
console.log(frame === contentFrame);  // -> true
Returns
Promise<ElementHandle>#

frameLocator
Added in: v1.17 
When working with iframes, you can create a frame locator that will enter the iframe and allow selecting elements in that iframe.
Usage
Following snippet locates element with text "Submit" in the iframe with id my-frame, like <iframe id="my-frame">:
const locator = frame.frameLocator('#my-iframe').getByText('Submit');
await locator.click();
Arguments
selector string#
A selector to use when resolving DOM element.
Returns
FrameLocator#

getByAltText
Added in: v1.27 
Allows locating elements by their alt text.
Usage
For example, this method will find the image by alt text "Playwright logo":
<img alt='Playwright logo'>
await page.getByAltText('Playwright logo').click();
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByLabel
Added in: v1.27 
Allows locating input elements by the text of the associated <label> or aria-labelledby element, or by the aria-label attribute.
Usage
For example, this method will find inputs by label "Username" and "Password" in the following DOM:
<input aria-label="Username">
<label for="password-input">Password:</label>
<input id="password-input">
await page.getByLabel('Username').fill('john');
await page.getByLabel('Password').fill('secret');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByPlaceholder
Added in: v1.27 
Allows locating input elements by the placeholder text.
Usage
For example, consider the following DOM structure.
<input type="email" placeholder="name@example.com" />
You can fill the input after locating it by the placeholder text:
await page
   .getByPlaceholder('name@example.com')
   .fill('playwright@microsoft.com');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByRole
Added in: v1.27 
Allows locating elements by their ARIA role, ARIA attributes and accessible name.
Usage
Consider the following DOM structure.
<h3>Sign up</h3>
<label>
 <input type="checkbox" /> Subscribe
</label>
<br/>
<button>Submit</button>
You can locate each element by it's implicit role:
await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();

await page.getByRole('checkbox', { name: 'Subscribe' }).check();

await page.getByRole('button', { name: /submit/i }).click();
Arguments
role "alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"#
Required aria role.
options Object (optional)
checked boolean (optional)#
An attribute that is usually set by aria-checked or native <input type=checkbox> controls.
Learn more about aria-checked.
disabled boolean (optional)#
An attribute that is usually set by aria-disabled or disabled.
NOTE
Unlike most other attributes, disabled is inherited through the DOM hierarchy. Learn more about aria-disabled.
exact boolean (optional) Added in: v1.28#
Whether name is matched exactly: case-sensitive and whole-string. Defaults to false. Ignored when name is a regular expression. Note that exact match still trims whitespace.
expanded boolean (optional)#
An attribute that is usually set by aria-expanded.
Learn more about aria-expanded.
includeHidden boolean (optional)#
Option that controls whether hidden elements are matched. By default, only non-hidden elements, as defined by ARIA, are matched by role selector.
Learn more about aria-hidden.
level number (optional)#
A number attribute that is usually present for roles heading, listitem, row, treeitem, with default values for <h1>-<h6> elements.
Learn more about aria-level.
name string | RegExp (optional)#
Option to match the accessible name. By default, matching is case-insensitive and searches for a substring, use exact to control this behavior.
Learn more about accessible name.
pressed boolean (optional)#
An attribute that is usually set by aria-pressed.
Learn more about aria-pressed.
selected boolean (optional)#
An attribute that is usually set by aria-selected.
Learn more about aria-selected.
Returns
Locator#
Details
Role selector does not replace accessibility audits and conformance tests, but rather gives early feedback about the ARIA guidelines.
Many html elements have an implicitly defined role that is recognized by the role selector. You can find all the supported roles here. ARIA guidelines do not recommend duplicating implicit roles and attributes by setting role and/or aria-* attributes to default values.

getByTestId
Added in: v1.27 
Locate element by the test id.
Usage
Consider the following DOM structure.
<button data-testid="directions">Itinéraire</button>
You can locate the element by it's test id:
await page.getByTestId('directions').click();
Arguments
testId string | RegExp#
Id to locate the element by.
Returns
Locator#
Details
By default, the data-testid attribute is used as a test id. Use selectors.setTestIdAttribute() to configure a different test id attribute if necessary.
// Set custom test id attribute from @playwright/test config:
import { defineConfig } from '@playwright/test';

export default defineConfig({
 use: {
   testIdAttribute: 'data-pw'
 },
});

getByText
Added in: v1.27 
Allows locating elements that contain given text.
See also locator.filter() that allows to match by another criteria, like an accessible role, and then filter by the text content.
Usage
Consider the following DOM structure:
<div>Hello <span>world</span></div>
<div>Hello</div>
You can locate by text substring, exact string, or a regular expression:
// Matches <span>
page.getByText('world');

// Matches first <div>
page.getByText('Hello world');

// Matches second <div>
page.getByText('Hello', { exact: true });

// Matches both <div>s
page.getByText(/Hello/);

// Matches second <div>
page.getByText(/^hello$/i);
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#
Details
Matching by text always normalizes whitespace, even with exact match. For example, it turns multiple spaces into one, turns line breaks into spaces and ignores leading and trailing whitespace.
Input elements of the type button and submit are matched by their value instead of the text content. For example, locating by text "Log in" matches <input type=button value="Log in">.

getByTitle
Added in: v1.27 
Allows locating elements by their title attribute.
Usage
Consider the following DOM structure.
<span title='Issues count'>25 issues</span>
You can check the issues count after locating it by the title text:
await expect(page.getByTitle('Issues count')).toHaveText('25 issues');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

goto
Added before v1.9 
Returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the last redirect.
The method will throw an error if:
there's an SSL error (e.g. in case of self-signed certificates).
target URL is invalid.
the timeout is exceeded during navigation.
the remote server does not respond or is unreachable.
the main resource failed to load.
The method will not throw an error when any valid HTTP status code is returned by the remote server, including 404 "Not Found" and 500 "Internal Server Error". The status code for such responses can be retrieved by calling response.status().
NOTE
The method either throws an error or returns a main resource response. The only exceptions are navigation to about:blank or navigation to the same URL with a different hash, which would succeed and return null.
NOTE
Headless mode doesn't support navigation to a PDF document. See the upstream issue.
Usage
await frame.goto(url);
await frame.goto(url, options);
Arguments
url string#
URL to navigate frame to. The url should include scheme, e.g. https://.
options Object (optional)
referer string (optional)#
Referer header value. If provided it will take preference over the referer header value set by page.setExtraHTTPHeaders().
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<null | Response>#

isDetached
Added before v1.9 
Returns true if the frame has been detached, or false otherwise.
Usage
frame.isDetached();
Returns
boolean#

isEnabled
Added before v1.9 
Returns whether the element is enabled.
Usage
await frame.isEnabled(selector);
await frame.isEnabled(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

locator
Added in: v1.14 
The method returns an element locator that can be used to perform actions on this page / frame. Locator is resolved to the element immediately before performing an action, so a series of actions on the same locator can in fact be performed on different DOM elements. That would happen if the DOM structure between those actions has changed.
Learn more about locators.
Learn more about locators.
Usage
frame.locator(selector);
frame.locator(selector, options);
Arguments
selector string#
A selector to use when resolving DOM element.
options Object (optional)
has Locator (optional)#
Narrows down the results of the method to those which contain elements matching this relative locator. For example, article that has text=Playwright matches <article><div>Playwright</div></article>.
Inner locator must be relative to the outer locator and is queried starting with the outer locator match, not the document root. For example, you can find content that has div in <article><content><div>Playwright</div></content></article>. However, looking for content that has article div will fail, because the inner locator must be relative and should not use any elements outside the content.
Note that outer and inner locators must belong to the same frame. Inner locator must not contain FrameLocators.
hasNot Locator (optional) Added in: v1.33#
Matches elements that do not contain an element that matches an inner locator. Inner locator is queried against the outer one. For example, article that does not have div matches <article><span>Playwright</span></article>.
Note that outer and inner locators must belong to the same frame. Inner locator must not contain FrameLocators.
hasNotText string | RegExp (optional) Added in: v1.33#
Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element. When passed a string, matching is case-insensitive and searches for a substring.
hasText string | RegExp (optional)#
Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a string, matching is case-insensitive and searches for a substring. For example, "Playwright" matches <article><div>Playwright</div></article>.
Returns
Locator#

name
Added before v1.9 
Returns frame's name attribute as specified in the tag.
If the name is empty, returns the id attribute instead.
NOTE
This value is calculated once when the frame is created, and will not update if the attribute is changed later.
Usage
frame.name();
Returns
string#

page
Added before v1.9 
Returns the page containing this frame.
Usage
frame.page();
Returns
Page#

parentFrame
Added before v1.9 
Parent frame, if any. Detached frames and main frames return null.
Usage
frame.parentFrame();
Returns
null | Frame#

setContent
Added before v1.9 
This method internally calls document.write(), inheriting all its specific characteristics and behaviors.
Usage
await frame.setContent(html);
await frame.setContent(html, options);
Arguments
html string#
HTML markup to assign to the page.
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<void>#

title
Added before v1.9 
Returns the page title.
Usage
await frame.title();
Returns
Promise<string>#

url
Added before v1.9 
Returns frame's url.
Usage
frame.url();
Returns
string#

waitForFunction
Added before v1.9 
Returns when the pageFunction returns a truthy value, returns that value.
Usage
The frame.waitForFunction() can be used to observe viewport size change:
const { firefox } = require('playwright');  // Or 'chromium' or 'webkit'.

(async () => {
 const browser = await firefox.launch();
 const page = await browser.newPage();
 const watchDog = page.mainFrame().waitForFunction('window.innerWidth < 100');
 await page.setViewportSize({ width: 50, height: 50 });
 await watchDog;
 await browser.close();
})();
To pass an argument to the predicate of frame.waitForFunction function:
const selector = '.foo';
await frame.waitForFunction(selector => !!document.querySelector(selector), selector);
Arguments
pageFunction function | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
options Object (optional)
polling number | "raf" (optional)#
If polling is 'raf', then pageFunction is constantly executed in requestAnimationFrame callback. If polling is a number, then it is treated as an interval in milliseconds at which the function would be executed. Defaults to raf.
timeout number (optional)#
Maximum time to wait for in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<JSHandle>#

waitForLoadState
Added before v1.9 
Waits for the required load state to be reached.
This returns when the frame reaches a required load state, load by default. The navigation must have been committed when this method is called. If current document has already reached the required state, resolves immediately.
NOTE
Most of the time, this method is not needed because Playwright auto-waits before every action.
Usage
await frame.click('button'); // Click triggers navigation.
await frame.waitForLoadState(); // Waits for 'load' state by default.
Arguments
state "load" | "domcontentloaded" | "networkidle" (optional)#
Optional load state to wait for, defaults to load. If the state has been already reached while loading current document, the method resolves immediately. Can be one of:
'load' - wait for the load event to be fired.
'domcontentloaded' - wait for the DOMContentLoaded event to be fired.
'networkidle' - DISCOURAGED wait until there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

waitForURL
Added in: v1.11 
Waits for the frame to navigate to the given URL.
Usage
await frame.click('a.delayed-navigation'); // Clicking the link will indirectly cause a navigation
await frame.waitForURL('**/target.html');
Arguments
url string | RegExp | function(URL):boolean#
A glob pattern, regex pattern or predicate receiving URL to match while waiting for the navigation. Note that if the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly equal to the string.
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<void>#

Deprecated
$
Added in: v1.9 
DISCOURAGED
Use locator-based frame.locator() instead. Read more about locators.
Returns the ElementHandle pointing to the frame element.
CAUTION
The use of ElementHandle is discouraged, use Locator objects and web-first assertions instead.
The method finds an element matching the specified selector within the frame. If no elements match the selector, returns null.
Usage
await frame.$(selector);
await frame.$(selector, options);
Arguments
selector string#
A selector to query for.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
Returns
Promise<null | ElementHandle>#

$$
Added in: v1.9 
DISCOURAGED
Use locator-based frame.locator() instead. Read more about locators.
Returns the ElementHandles pointing to the frame elements.
CAUTION
The use of ElementHandle is discouraged, use Locator objects instead.
The method finds all elements matching the specified selector within the frame. If no elements match the selector, returns empty array.
Usage
await frame.$$(selector);
Arguments
selector string#
A selector to query for.
Returns
Promise<Array<ElementHandle>>#

$eval
Added in: v1.9 
DISCOURAGED
This method does not wait for the element to pass the actionability checks and therefore can lead to the flaky tests. Use locator.evaluate(), other Locator helper methods or web-first assertions instead.
Returns the return value of pageFunction.
The method finds an element matching the specified selector within the frame and passes it as a first argument to pageFunction. If no elements match the selector, the method throws an error.
If pageFunction returns a Promise, then frame.$eval() would wait for the promise to resolve and return its value.
Usage
const searchValue = await frame.$eval('#search', el => el.value);
const preloadHref = await frame.$eval('link[rel=preload]', el => el.href);
const html = await frame.$eval('.main-container', (e, suffix) => e.outerHTML + suffix, 'hello');
Arguments
selector string#
A selector to query for.
pageFunction function(Element) | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
Returns
Promise<Serializable>#

$$eval
Added in: v1.9 
DISCOURAGED
In most cases, locator.evaluateAll(), other Locator helper methods and web-first assertions do a better job.
Returns the return value of pageFunction.
The method finds all elements matching the specified selector within the frame and passes an array of matched elements as a first argument to pageFunction.
If pageFunction returns a Promise, then frame.$$eval() would wait for the promise to resolve and return its value.
Usage
const divsCounts = await frame.$$eval('div', (divs, min) => divs.length >= min, 10);
Arguments
selector string#
A selector to query for.
pageFunction function(Array<Element>) | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<Serializable>#

check
Added before v1.9 
DISCOURAGED
Use locator-based locator.check() instead. Read more about locators.
This method checks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Ensure that matched element is a checkbox or a radio input. If not, this method throws. If the element is already checked, this method returns immediately.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now checked. If not, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await frame.check(selector);
await frame.check(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional) Added in: v1.11#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

click
Added before v1.9 
DISCOURAGED
Use locator-based locator.click() instead. Read more about locators.
This method clicks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element, or the specified position.
Wait for initiated navigations to either succeed or fail, unless noWaitAfter option is set.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await frame.click(selector);
await frame.click(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
button "left" | "right" | "middle" (optional)#
Defaults to left.
clickCount number (optional)#
defaults to 1. See UIEvent.detail.
delay number (optional)#
Time to wait between mousedown and mouseup in milliseconds. Defaults to 0.
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option will default to true in the future.
Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating to inaccessible pages. Defaults to false.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#

dblclick
Added before v1.9 
DISCOURAGED
Use locator-based locator.dblclick() instead. Read more about locators.
This method double clicks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to double click in the center of the element, or the specified position. if the first click of the dblclick() triggers a navigation event, this method will throw.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
NOTE
frame.dblclick() dispatches two click events and a single dblclick event.
Usage
await frame.dblclick(selector);
await frame.dblclick(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
button "left" | "right" | "middle" (optional)#
Defaults to left.
delay number (optional)#
Time to wait between mousedown and mouseup in milliseconds. Defaults to 0.
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#

dispatchEvent
Added before v1.9 
DISCOURAGED
Use locator-based locator.dispatchEvent() instead. Read more about locators.
The snippet below dispatches the click event on the element. Regardless of the visibility state of the element, click is dispatched. This is equivalent to calling element.click().
Usage
await frame.dispatchEvent('button#submit', 'click');
Under the hood, it creates an instance of an event based on the given type, initializes it with eventInit properties and dispatches it on the element. Events are composed, cancelable and bubble by default.
Since eventInit is event-specific, please refer to the events documentation for the lists of initial properties:
DeviceMotionEvent
DeviceOrientationEvent
DragEvent
Event
FocusEvent
KeyboardEvent
MouseEvent
PointerEvent
TouchEvent
WheelEvent
You can also specify JSHandle as the property value if you want live objects to be passed into the event:
// Note you can only create DataTransfer in Chromium and Firefox
const dataTransfer = await frame.evaluateHandle(() => new DataTransfer());
await frame.dispatchEvent('#source', 'dragstart', { dataTransfer });
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
type string#
DOM event type: "click", "dragstart", etc.
eventInit EvaluationArgument (optional)#
Optional event-specific initialization properties.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

fill
Added before v1.9 
DISCOURAGED
Use locator-based locator.fill() instead. Read more about locators.
This method waits for an element matching selector, waits for actionability checks, focuses the element, fills it and triggers an input event after filling. Note that you can pass an empty string to clear the input field.
If the target element is not an <input>, <textarea> or [contenteditable] element, this method throws an error. However, if the element is inside the <label> element that has an associated control, the control will be filled instead.
To send fine-grained keyboard events, use locator.pressSequentially().
Usage
await frame.fill(selector, value);
await frame.fill(selector, value, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
value string#
Value to fill for the <input>, <textarea> or [contenteditable] element.
options Object (optional)
force boolean (optional) Added in: v1.13#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

focus
Added before v1.9 
DISCOURAGED
Use locator-based locator.focus() instead. Read more about locators.
This method fetches an element with selector and focuses it. If there's no element matching selector, the method waits until a matching element appears in the DOM.
Usage
await frame.focus(selector);
await frame.focus(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

getAttribute
Added before v1.9 
DISCOURAGED
Use locator-based locator.getAttribute() instead. Read more about locators.
Returns element attribute value.
Usage
await frame.getAttribute(selector, name);
await frame.getAttribute(selector, name, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
name string#
Attribute name to get the value for.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<null | string>#

hover
Added before v1.9 
DISCOURAGED
Use locator-based locator.hover() instead. Read more about locators.
This method hovers over an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to hover over the center of the element, or the specified position.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await frame.hover(selector);
await frame.hover(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional) Added in: v1.28#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#

innerHTML
Added before v1.9 
DISCOURAGED
Use locator-based locator.innerHTML() instead. Read more about locators.
Returns element.innerHTML.
Usage
await frame.innerHTML(selector);
await frame.innerHTML(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<string>#

innerText
Added before v1.9 
DISCOURAGED
Use locator-based locator.innerText() instead. Read more about locators.
Returns element.innerText.
Usage
await frame.innerText(selector);
await frame.innerText(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<string>#

inputValue
Added in: v1.13 
DISCOURAGED
Use locator-based locator.inputValue() instead. Read more about locators.
Returns input.value for the selected <input> or <textarea> or <select> element.
Throws for non-input elements. However, if the element is inside the <label> element that has an associated control, returns the value of the control.
Usage
await frame.inputValue(selector);
await frame.inputValue(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<string>#

isChecked
Added before v1.9 
DISCOURAGED
Use locator-based locator.isChecked() instead. Read more about locators.
Returns whether the element is checked. Throws if the element is not a checkbox or radio input.
Usage
await frame.isChecked(selector);
await frame.isChecked(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

isDisabled
Added before v1.9 
DISCOURAGED
Use locator-based locator.isDisabled() instead. Read more about locators.
Returns whether the element is disabled, the opposite of enabled.
Usage
await frame.isDisabled(selector);
await frame.isDisabled(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

isEditable
Added before v1.9 
DISCOURAGED
Use locator-based locator.isEditable() instead. Read more about locators.
Returns whether the element is editable.
Usage
await frame.isEditable(selector);
await frame.isEditable(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

isHidden
Added before v1.9 
DISCOURAGED
Use locator-based locator.isHidden() instead. Read more about locators.
Returns whether the element is hidden, the opposite of visible. selector that does not match any elements is considered hidden.
Usage
await frame.isHidden(selector);
await frame.isHidden(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
DEPRECATED
This option is ignored. frame.isHidden() does not wait for the element to become hidden and returns immediately.
Returns
Promise<boolean>#

isVisible
Added before v1.9 
DISCOURAGED
Use locator-based locator.isVisible() instead. Read more about locators.
Returns whether the element is visible. selector that does not match any elements is considered not visible.
Usage
await frame.isVisible(selector);
await frame.isVisible(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
DEPRECATED
This option is ignored. frame.isVisible() does not wait for the element to become visible and returns immediately.
Returns
Promise<boolean>#

press
Added before v1.9 
DISCOURAGED
Use locator-based locator.press() instead. Read more about locators.
key can specify the intended keyboardEvent.key value or a single character to generate the text for. A superset of the key values can be found here. Examples of the keys are:
F1 - F12, Digit0- Digit9, KeyA- KeyZ, Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape, ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight, ArrowUp, etc.
Following modification shortcuts are also supported: Shift, Control, Alt, Meta, ShiftLeft, ControlOrMeta. ControlOrMeta resolves to Control on Windows and Linux and to Meta on macOS.
Holding down Shift will type the text that corresponds to the key in the upper case.
If key is a single character, it is case-sensitive, so the values a and A will generate different respective texts.
Shortcuts such as key: "Control+o", key: "Control++ or key: "Control+Shift+T" are supported as well. When specified with the modifier, modifier is pressed and being held while the subsequent key is being pressed.
Usage
await frame.press(selector, key);
await frame.press(selector, key, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
key string#
Name of the key to press or a character to generate, such as ArrowLeft or a.
options Object (optional)
delay number (optional)#
Time to wait between keydown and keyup in milliseconds. Defaults to 0.
noWaitAfter boolean (optional)#
DEPRECATED
This option will default to true in the future.
Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating to inaccessible pages. Defaults to false.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

selectOption
Added before v1.9 
DISCOURAGED
Use locator-based locator.selectOption() instead. Read more about locators.
This method waits for an element matching selector, waits for actionability checks, waits until all specified options are present in the <select> element and selects these options.
If the target element is not a <select> element, this method throws an error. However, if the element is inside the <label> element that has an associated control, the control will be used instead.
Returns the array of option values that have been successfully selected.
Triggers a change and input event once all the provided options have been selected.
Usage
// Single selection matching the value or label
frame.selectOption('select#colors', 'blue');

// single selection matching both the value and the label
frame.selectOption('select#colors', { label: 'Blue' });

// multiple selection
frame.selectOption('select#colors', 'red', 'green', 'blue');
Arguments
selector string#
A selector to query for.
values null | string | ElementHandle | Array<string> | Object | Array<ElementHandle> | Array<Object>#
value string (optional)
Matches by option.value. Optional.
label string (optional)
Matches by option.label. Optional.
index number (optional)
Matches by the index. Optional.
Options to select. If the <select> has the multiple attribute, all matching options are selected, otherwise only the first option matching one of the passed options is selected. String values are matching both values and labels. Option is considered matching if all specified properties match.
options Object (optional)
force boolean (optional) Added in: v1.13#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<Array<string>>#

setChecked
Added in: v1.15 
DISCOURAGED
Use locator-based locator.setChecked() instead. Read more about locators.
This method checks or unchecks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Ensure that matched element is a checkbox or a radio input. If not, this method throws.
If the element already has the right checked state, this method returns immediately.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now checked or unchecked. If not, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await frame.setChecked(selector, checked);
await frame.setChecked(selector, checked, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
checked boolean#
Whether to check or uncheck the checkbox.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional)#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

setInputFiles
Added before v1.9 
DISCOURAGED
Use locator-based locator.setInputFiles() instead. Read more about locators.
Sets the value of the file input to these file paths or files. If some of the filePaths are relative paths, then they are resolved relative to the current working directory. For empty array, clears the selected files.
This method expects selector to point to an input element. However, if the element is inside the <label> element that has an associated control, targets the control instead.
Usage
await frame.setInputFiles(selector, files);
await frame.setInputFiles(selector, files, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
files string | Array<string> | Object | Array<Object>#
name string
File name
mimeType string
File type
buffer Buffer
File content
options Object (optional)
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

tap
Added before v1.9 
DISCOURAGED
Use locator-based locator.tap() instead. Read more about locators.
This method taps an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.touchscreen to tap the center of the element, or the specified position.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
NOTE
frame.tap() requires that the hasTouch option of the browser context be set to true.
Usage
await frame.tap(selector);
await frame.tap(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#

textContent
Added before v1.9 
DISCOURAGED
Use locator-based locator.textContent() instead. Read more about locators.
Returns element.textContent.
Usage
await frame.textContent(selector);
await frame.textContent(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<null | string>#

type
Added before v1.9 
DEPRECATED
In most cases, you should use locator.fill() instead. You only need to press keys one by one if there is special keyboard handling on the page - in this case use locator.pressSequentially().
Sends a keydown, keypress/input, and keyup event for each character in the text. frame.type can be used to send fine-grained keyboard events. To fill values in form fields, use frame.fill().
To press a special key, like Control or ArrowDown, use keyboard.press().
Usage
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
text string#
A text to type into a focused element.
options Object (optional)
delay number (optional)#
Time to wait between key presses in milliseconds. Defaults to 0.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

uncheck
Added before v1.9 
DISCOURAGED
Use locator-based locator.uncheck() instead. Read more about locators.
This method checks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Ensure that matched element is a checkbox or a radio input. If not, this method throws. If the element is already unchecked, this method returns immediately.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now unchecked. If not, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await frame.uncheck(selector);
await frame.uncheck(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional) Added in: v1.11#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

waitForNavigation
Added before v1.9 
DEPRECATED
This method is inherently racy, please use frame.waitForURL() instead.
Waits for the frame navigation and returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the last redirect. In case of navigation to a different anchor or navigation due to History API usage, the navigation will resolve with null.
Usage
This method waits for the frame to navigate to a new URL. It is useful for when you run code which will indirectly cause the frame to navigate. Consider this example:
// Start waiting for navigation before clicking. Note no await.
const navigationPromise = page.waitForNavigation();
await page.getByText('Navigate after timeout').click();
await navigationPromise;
NOTE
Usage of the History API to change the URL is considered a navigation.
Arguments
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
url string | RegExp | function(URL):boolean (optional)#
A glob pattern, regex pattern or predicate receiving URL to match while waiting for the navigation. Note that if the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly equal to the string.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<null | Response>#

waitForSelector
Added before v1.9 
DISCOURAGED
Use web assertions that assert visibility or a locator-based locator.waitFor() instead. Read more about locators.
Returns when element specified by selector satisfies state option. Returns null if waiting for hidden or detached.
NOTE
Playwright automatically waits for element to be ready before performing an action. Using Locator objects and web-first assertions make the code wait-for-selector-free.
Wait for the selector to satisfy state option (either appear/disappear from dom, or become visible/hidden). If at the moment of calling the method selector already satisfies the condition, the method will return immediately. If the selector doesn't satisfy the condition for the timeout milliseconds, the function will throw.
Usage
This method works across navigations:
const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.

(async () => {
 const browser = await chromium.launch();
 const page = await browser.newPage();
 for (const currentURL of ['https://google.com', 'https://bbc.com']) {
   await page.goto(currentURL);
   const element = await page.mainFrame().waitForSelector('img');
   console.log('Loaded image: ' + await element.getAttribute('src'));
 }
 await browser.close();
})();
Arguments
selector string#
A selector to query for.
options Object (optional)
state "attached" | "detached" | "visible" | "hidden" (optional)#
Defaults to 'visible'. Can be either:
'attached' - wait for element to be present in DOM.
'detached' - wait for element to not be present in DOM.
'visible' - wait for element to have non-empty bounding box and no visibility:hidden. Note that element without any content or with display:none has an empty bounding box and is not considered visible.
'hidden' - wait for element to be either detached from DOM, or have an empty bounding box or visibility:hidden. This is opposite to the 'visible' option.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<null | ElementHandle>#

waitForTimeout
Added before v1.9 
DISCOURAGED
Never wait for timeout in production. Tests that wait for time are inherently flaky. Use Locator actions and web assertions that wait automatically.
Waits for the given timeout in milliseconds.
Note that frame.waitForTimeout() should only be used for debugging. Tests using the timer in production are going to be flaky. Use signals such as network events, selectors becoming visible and others instead.
Usage
await frame.waitForTimeout(timeout);
Arguments
timeout number#
A timeout to wait for
Returns
Promise<void>#
Previous
FileChooser
Next
FrameLocator
Methods
addScriptTag
addStyleTag
childFrames
content
dragAndDrop
evaluate
evaluateHandle
frameElement
frameLocator
getByAltText
getByLabel
getByPlaceholder
getByRole
getByTestId
getByText
getByTitle
goto
isDetached
isEnabled
locator
name
page
parentFrame
setContent
title
url
waitForFunction
waitForLoadState
waitForURL
Deprecated
$
$$
$eval
$$eval
check
click
dblclick
dispatchEvent
fill
focus
getAttribute
hover
innerHTML
innerText
inputValue
isChecked
isDisabled
isEditable
isHidden
isVisible
press
selectOption
setChecked
setInputFiles
tap
textContent
type
uncheck
waitForNavigation
waitForSelector
waitForTimeout
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
FrameLocator
FrameLocator represents a view to the iframe on the page. It captures the logic sufficient to retrieve the iframe and locate elements in that iframe. FrameLocator can be created with either locator.contentFrame(), page.frameLocator() or locator.frameLocator() method.
const locator = page.locator('#my-frame').contentFrame().getByText('Submit');
await locator.click();
Strictness
Frame locators are strict. This means that all operations on frame locators will throw if more than one element matches a given selector.
// Throws if there are several frames in DOM:
await page.locator('.result-frame').contentFrame().getByRole('button').click();

// Works because we explicitly tell locator to pick the first frame:
await page.locator('.result-frame').contentFrame().first().getByRole('button').click();
Converting Locator to FrameLocator
If you have a Locator object pointing to an iframe it can be converted to FrameLocator using locator.contentFrame().
Converting FrameLocator to Locator
If you have a FrameLocator object it can be converted to Locator pointing to the same iframe using frameLocator.owner().

Methods
frameLocator
Added in: v1.17 
When working with iframes, you can create a frame locator that will enter the iframe and allow selecting elements in that iframe.
Usage
frameLocator.frameLocator(selector);
Arguments
selector string#
A selector to use when resolving DOM element.
Returns
FrameLocator#

getByAltText
Added in: v1.27 
Allows locating elements by their alt text.
Usage
For example, this method will find the image by alt text "Playwright logo":
<img alt='Playwright logo'>
await page.getByAltText('Playwright logo').click();
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByLabel
Added in: v1.27 
Allows locating input elements by the text of the associated <label> or aria-labelledby element, or by the aria-label attribute.
Usage
For example, this method will find inputs by label "Username" and "Password" in the following DOM:
<input aria-label="Username">
<label for="password-input">Password:</label>
<input id="password-input">
await page.getByLabel('Username').fill('john');
await page.getByLabel('Password').fill('secret');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByPlaceholder
Added in: v1.27 
Allows locating input elements by the placeholder text.
Usage
For example, consider the following DOM structure.
<input type="email" placeholder="name@example.com" />
You can fill the input after locating it by the placeholder text:
await page
   .getByPlaceholder('name@example.com')
   .fill('playwright@microsoft.com');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByRole
Added in: v1.27 
Allows locating elements by their ARIA role, ARIA attributes and accessible name.
Usage
Consider the following DOM structure.
<h3>Sign up</h3>
<label>
 <input type="checkbox" /> Subscribe
</label>
<br/>
<button>Submit</button>
You can locate each element by it's implicit role:
await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();

await page.getByRole('checkbox', { name: 'Subscribe' }).check();

await page.getByRole('button', { name: /submit/i }).click();
Arguments
role "alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"#
Required aria role.
options Object (optional)
checked boolean (optional)#
An attribute that is usually set by aria-checked or native <input type=checkbox> controls.
Learn more about aria-checked.
disabled boolean (optional)#
An attribute that is usually set by aria-disabled or disabled.
NOTE
Unlike most other attributes, disabled is inherited through the DOM hierarchy. Learn more about aria-disabled.
exact boolean (optional) Added in: v1.28#
Whether name is matched exactly: case-sensitive and whole-string. Defaults to false. Ignored when name is a regular expression. Note that exact match still trims whitespace.
expanded boolean (optional)#
An attribute that is usually set by aria-expanded.
Learn more about aria-expanded.
includeHidden boolean (optional)#
Option that controls whether hidden elements are matched. By default, only non-hidden elements, as defined by ARIA, are matched by role selector.
Learn more about aria-hidden.
level number (optional)#
A number attribute that is usually present for roles heading, listitem, row, treeitem, with default values for <h1>-<h6> elements.
Learn more about aria-level.
name string | RegExp (optional)#
Option to match the accessible name. By default, matching is case-insensitive and searches for a substring, use exact to control this behavior.
Learn more about accessible name.
pressed boolean (optional)#
An attribute that is usually set by aria-pressed.
Learn more about aria-pressed.
selected boolean (optional)#
An attribute that is usually set by aria-selected.
Learn more about aria-selected.
Returns
Locator#
Details
Role selector does not replace accessibility audits and conformance tests, but rather gives early feedback about the ARIA guidelines.
Many html elements have an implicitly defined role that is recognized by the role selector. You can find all the supported roles here. ARIA guidelines do not recommend duplicating implicit roles and attributes by setting role and/or aria-* attributes to default values.

getByTestId
Added in: v1.27 
Locate element by the test id.
Usage
Consider the following DOM structure.
<button data-testid="directions">Itinéraire</button>
You can locate the element by it's test id:
await page.getByTestId('directions').click();
Arguments
testId string | RegExp#
Id to locate the element by.
Returns
Locator#
Details
By default, the data-testid attribute is used as a test id. Use selectors.setTestIdAttribute() to configure a different test id attribute if necessary.
// Set custom test id attribute from @playwright/test config:
import { defineConfig } from '@playwright/test';

export default defineConfig({
 use: {
   testIdAttribute: 'data-pw'
 },
});

getByText
Added in: v1.27 
Allows locating elements that contain given text.
See also locator.filter() that allows to match by another criteria, like an accessible role, and then filter by the text content.
Usage
Consider the following DOM structure:
<div>Hello <span>world</span></div>
<div>Hello</div>
You can locate by text substring, exact string, or a regular expression:
// Matches <span>
page.getByText('world');

// Matches first <div>
page.getByText('Hello world');

// Matches second <div>
page.getByText('Hello', { exact: true });

// Matches both <div>s
page.getByText(/Hello/);

// Matches second <div>
page.getByText(/^hello$/i);
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#
Details
Matching by text always normalizes whitespace, even with exact match. For example, it turns multiple spaces into one, turns line breaks into spaces and ignores leading and trailing whitespace.
Input elements of the type button and submit are matched by their value instead of the text content. For example, locating by text "Log in" matches <input type=button value="Log in">.

getByTitle
Added in: v1.27 
Allows locating elements by their title attribute.
Usage
Consider the following DOM structure.
<span title='Issues count'>25 issues</span>
You can check the issues count after locating it by the title text:
await expect(page.getByTitle('Issues count')).toHaveText('25 issues');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

locator
Added in: v1.17 
The method finds an element matching the specified selector in the locator's subtree. It also accepts filter options, similar to locator.filter() method.
Learn more about locators.
Usage
frameLocator.locator(selectorOrLocator);
frameLocator.locator(selectorOrLocator, options);
Arguments
selectorOrLocator string | Locator#
A selector or locator to use when resolving DOM element.
options Object (optional)
has Locator (optional)#
Narrows down the results of the method to those which contain elements matching this relative locator. For example, article that has text=Playwright matches <article><div>Playwright</div></article>.
Inner locator must be relative to the outer locator and is queried starting with the outer locator match, not the document root. For example, you can find content that has div in <article><content><div>Playwright</div></content></article>. However, looking for content that has article div will fail, because the inner locator must be relative and should not use any elements outside the content.
Note that outer and inner locators must belong to the same frame. Inner locator must not contain FrameLocators.
hasNot Locator (optional) Added in: v1.33#
Matches elements that do not contain an element that matches an inner locator. Inner locator is queried against the outer one. For example, article that does not have div matches <article><span>Playwright</span></article>.
Note that outer and inner locators must belong to the same frame. Inner locator must not contain FrameLocators.
hasNotText string | RegExp (optional) Added in: v1.33#
Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element. When passed a string, matching is case-insensitive and searches for a substring.
hasText string | RegExp (optional)#
Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a string, matching is case-insensitive and searches for a substring. For example, "Playwright" matches <article><div>Playwright</div></article>.
Returns
Locator#

owner
Added in: v1.43 
Returns a Locator object pointing to the same iframe as this frame locator.
Useful when you have a FrameLocator object obtained somewhere, and later on would like to interact with the iframe element.
For a reverse operation, use locator.contentFrame().
Usage
const frameLocator = page.locator('iframe[name="embedded"]').contentFrame();
// ...
const locator = frameLocator.owner();
await expect(locator).toBeVisible();
Returns
Locator#

Deprecated
first
Added in: v1.17 
DEPRECATED
Use locator.first() followed by locator.contentFrame() instead.
Returns locator to the first matching frame.
Usage
frameLocator.first();
Returns
FrameLocator#

last
Added in: v1.17 
DEPRECATED
Use locator.last() followed by locator.contentFrame() instead.
Returns locator to the last matching frame.
Usage
frameLocator.last();
Returns
FrameLocator#

nth
Added in: v1.17 
DEPRECATED
Use locator.nth() followed by locator.contentFrame() instead.
Returns locator to the n-th matching frame. It's zero based, nth(0) selects the first frame.
Usage
frameLocator.nth(index);
Arguments
index number#
Returns
FrameLocator#
Previous
Frame
Next
JSHandle
Methods
frameLocator
getByAltText
getByLabel
getByPlaceholder
getByRole
getByTestId
getByText
getByTitle
locator
owner
Deprecated
first
last
nth
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
JSHandle
JSHandle represents an in-page JavaScript object. JSHandles can be created with the page.evaluateHandle() method.
const windowHandle = await page.evaluateHandle(() => window);
// ...
JSHandle prevents the referenced JavaScript object being garbage collected unless the handle is exposed with jsHandle.dispose(). JSHandles are auto-disposed when their origin frame gets navigated or the parent context gets destroyed.
JSHandle instances can be used as an argument in page.$eval(), page.evaluate() and page.evaluateHandle() methods.

Methods
asElement
Added before v1.9 
Returns either null or the object handle itself, if the object handle is an instance of ElementHandle.
Usage
jsHandle.asElement();
Returns
null | ElementHandle#

dispose
Added before v1.9 
The jsHandle.dispose method stops referencing the element handle.
Usage
await jsHandle.dispose();
Returns
Promise<void>#

evaluate
Added before v1.9 
Returns the return value of pageFunction.
This method passes this handle as the first argument to pageFunction.
If pageFunction returns a Promise, then handle.evaluate would wait for the promise to resolve and return its value.
Usage
const tweetHandle = await page.$('.tweet .retweets');
expect(await tweetHandle.evaluate(node => node.innerText)).toBe('10 retweets');
Arguments
pageFunction function | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<Serializable>#

evaluateHandle
Added before v1.9 
Returns the return value of pageFunction as a JSHandle.
This method passes this handle as the first argument to pageFunction.
The only difference between jsHandle.evaluate and jsHandle.evaluateHandle is that jsHandle.evaluateHandle returns JSHandle.
If the function passed to the jsHandle.evaluateHandle returns a Promise, then jsHandle.evaluateHandle would wait for the promise to resolve and return its value.
See page.evaluateHandle() for more details.
Usage
await jsHandle.evaluateHandle(pageFunction);
await jsHandle.evaluateHandle(pageFunction, arg);
Arguments
pageFunction function | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<JSHandle>#

getProperties
Added before v1.9 
The method returns a map with own property names as keys and JSHandle instances for the property values.
Usage
const handle = await page.evaluateHandle(() => ({ window, document }));
const properties = await handle.getProperties();
const windowHandle = properties.get('window');
const documentHandle = properties.get('document');
await handle.dispose();
Returns
Promise<Map<string, JSHandle>>#

getProperty
Added before v1.9 
Fetches a single property from the referenced object.
Usage
await jsHandle.getProperty(propertyName);
Arguments
propertyName string#
property to get
Returns
Promise<JSHandle>#

jsonValue
Added before v1.9 
Returns a JSON representation of the object. If the object has a toJSON function, it will not be called.
NOTE
The method will return an empty JSON object if the referenced object is not stringifiable. It will throw an error if the object has circular references.
Usage
await jsHandle.jsonValue();
Returns
Promise<Serializable>#
Previous
FrameLocator
Next
Keyboard
Methods
asElement
dispose
evaluate
evaluateHandle
getProperties
getProperty
jsonValue
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Keyboard
Keyboard provides an api for managing a virtual keyboard. The high level api is keyboard.type(), which takes raw characters and generates proper keydown, keypress/input, and keyup events on your page.
For finer control, you can use keyboard.down(), keyboard.up(), and keyboard.insertText() to manually fire events as if they were generated from a real keyboard.
An example of holding down Shift in order to select and delete some text:
await page.keyboard.type('Hello World!');
await page.keyboard.press('ArrowLeft');

await page.keyboard.down('Shift');
for (let i = 0; i < ' World'.length; i++)
 await page.keyboard.press('ArrowLeft');
await page.keyboard.up('Shift');

await page.keyboard.press('Backspace');
// Result text will end up saying 'Hello!'
An example of pressing uppercase A
await page.keyboard.press('Shift+KeyA');
// or
await page.keyboard.press('Shift+A');
An example to trigger select-all with the keyboard
await page.keyboard.press('ControlOrMeta+A');

Methods
down
Added before v1.9 
Dispatches a keydown event.
key can specify the intended keyboardEvent.key value or a single character to generate the text for. A superset of the key values can be found here. Examples of the keys are:
F1 - F12, Digit0- Digit9, KeyA- KeyZ, Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape, ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight, ArrowUp, etc.
Following modification shortcuts are also supported: Shift, Control, Alt, Meta, ShiftLeft, ControlOrMeta. ControlOrMeta resolves to Control on Windows and Linux and to Meta on macOS.
Holding down Shift will type the text that corresponds to the key in the upper case.
If key is a single character, it is case-sensitive, so the values a and A will generate different respective texts.
If key is a modifier key, Shift, Meta, Control, or Alt, subsequent key presses will be sent with that modifier active. To release the modifier key, use keyboard.up().
After the key is pressed once, subsequent calls to keyboard.down() will have repeat set to true. To release the key, use keyboard.up().
NOTE
Modifier keys DO influence keyboard.down. Holding down Shift will type the text in upper case.
Usage
await keyboard.down(key);
Arguments
key string#
Name of the key to press or a character to generate, such as ArrowLeft or a.
Returns
Promise<void>#

insertText
Added before v1.9 
Dispatches only input event, does not emit the keydown, keyup or keypress events.
Usage
page.keyboard.insertText('嗨');
NOTE
Modifier keys DO NOT effect keyboard.insertText. Holding down Shift will not type the text in upper case.
Arguments
text string#
Sets input to the specified text value.
Returns
Promise<void>#

press
Added before v1.9 
TIP
In most cases, you should use locator.press() instead.
key can specify the intended keyboardEvent.key value or a single character to generate the text for. A superset of the key values can be found here. Examples of the keys are:
F1 - F12, Digit0- Digit9, KeyA- KeyZ, Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape, ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight, ArrowUp, etc.
Following modification shortcuts are also supported: Shift, Control, Alt, Meta, ShiftLeft, ControlOrMeta. ControlOrMeta resolves to Control on Windows and Linux and to Meta on macOS.
Holding down Shift will type the text that corresponds to the key in the upper case.
If key is a single character, it is case-sensitive, so the values a and A will generate different respective texts.
Shortcuts such as key: "Control+o", key: "Control++ or key: "Control+Shift+T" are supported as well. When specified with the modifier, modifier is pressed and being held while the subsequent key is being pressed.
Usage
const page = await browser.newPage();
await page.goto('https://keycode.info');
await page.keyboard.press('A');
await page.screenshot({ path: 'A.png' });
await page.keyboard.press('ArrowLeft');
await page.screenshot({ path: 'ArrowLeft.png' });
await page.keyboard.press('Shift+O');
await page.screenshot({ path: 'O.png' });
await browser.close();
Shortcut for keyboard.down() and keyboard.up().
Arguments
key string#
Name of the key to press or a character to generate, such as ArrowLeft or a.
options Object (optional)
delay number (optional)#
Time to wait between keydown and keyup in milliseconds. Defaults to 0.
Returns
Promise<void>#

type
Added before v1.9 
CAUTION
In most cases, you should use locator.fill() instead. You only need to press keys one by one if there is special keyboard handling on the page - in this case use locator.pressSequentially().
Sends a keydown, keypress/input, and keyup event for each character in the text.
To press a special key, like Control or ArrowDown, use keyboard.press().
Usage
await page.keyboard.type('Hello'); // Types instantly
await page.keyboard.type('World', { delay: 100 }); // Types slower, like a user
NOTE
Modifier keys DO NOT effect keyboard.type. Holding down Shift will not type the text in upper case.
NOTE
For characters that are not on a US keyboard, only an input event will be sent.
Arguments
text string#
A text to type into a focused element.
options Object (optional)
delay number (optional)#
Time to wait between key presses in milliseconds. Defaults to 0.
Returns
Promise<void>#

up
Added before v1.9 
Dispatches a keyup event.
Usage
await keyboard.up(key);
Arguments
key string#
Name of the key to press or a character to generate, such as ArrowLeft or a.
Returns
Promise<void>#
Previous
JSHandle
Next
Locator
Methods
down
insertText
press
type
up
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Locator
Locators are the central piece of Playwright's auto-waiting and retry-ability. In a nutshell, locators represent a way to find element(s) on the page at any moment. A locator can be created with the page.locator() method.
Learn more about locators.

Methods
all
Added in: v1.29 
When the locator points to a list of elements, this returns an array of locators, pointing to their respective elements.
NOTE
locator.all() does not wait for elements to match the locator, and instead immediately returns whatever is present in the page.
When the list of elements changes dynamically, locator.all() will produce unpredictable and flaky results.
When the list of elements is stable, but loaded dynamically, wait for the full list to finish loading before calling locator.all().
Usage
for (const li of await page.getByRole('listitem').all())
 await li.click();
Returns
Promise<Array<Locator>>#

allInnerTexts
Added in: v1.14 
Returns an array of node.innerText values for all matching nodes.
ASSERTING TEXT
If you need to assert text on the page, prefer expect(locator).toHaveText() with useInnerText option to avoid flakiness. See assertions guide for more details.
Usage
const texts = await page.getByRole('link').allInnerTexts();
Returns
Promise<Array<string>>#

allTextContents
Added in: v1.14 
Returns an array of node.textContent values for all matching nodes.
ASSERTING TEXT
If you need to assert text on the page, prefer expect(locator).toHaveText() to avoid flakiness. See assertions guide for more details.
Usage
const texts = await page.getByRole('link').allTextContents();
Returns
Promise<Array<string>>#

and
Added in: v1.34 
Creates a locator that matches both this locator and the argument locator.
Usage
The following example finds a button with a specific title.
const button = page.getByRole('button').and(page.getByTitle('Subscribe'));
Arguments
locator Locator#
Additional locator to match.
Returns
Locator#

ariaSnapshot
Added in: v1.49 
Captures the aria snapshot of the given element. Read more about aria snapshots and expect(locator).toMatchAriaSnapshot() for the corresponding assertion.
Usage
await page.getByRole('link').ariaSnapshot();
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<string>#
Details
This method captures the aria snapshot of the given element. The snapshot is a string that represents the state of the element and its children. The snapshot can be used to assert the state of the element in the test, or to compare it to state in the future.
The ARIA snapshot is represented using YAML markup language:
The keys of the objects are the roles and optional accessible names of the elements.
The values are either text content or an array of child elements.
Generic static text can be represented with the text key.
Below is the HTML markup and the respective ARIA snapshot:
<ul aria-label="Links">
 <li><a href="/">Home</a></li>
 <li><a href="/about">About</a></li>
<ul>
- list "Links":
 - listitem:
   - link "Home"
 - listitem:
   - link "About"

blur
Added in: v1.28 
Calls blur on the element.
Usage
await locator.blur();
await locator.blur(options);
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

boundingBox
Added in: v1.14 
This method returns the bounding box of the element matching the locator, or null if the element is not visible. The bounding box is calculated relative to the main frame viewport - which is usually the same as the browser window.
Usage
const box = await page.getByRole('button').boundingBox();
await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<null | Object>#
x number
the x coordinate of the element in pixels.
y number
the y coordinate of the element in pixels.
width number
the width of the element in pixels.
height number
the height of the element in pixels.
Details
Scrolling affects the returned bounding box, similarly to Element.getBoundingClientRect. That means x and/or y may be negative.
Elements from child frames return the bounding box relative to the main frame, unlike the Element.getBoundingClientRect.
Assuming the page is static, it is safe to use bounding box coordinates to perform input. For example, the following snippet should click the center of the element.

check
Added in: v1.14 
Ensure that checkbox or radio element is checked.
Usage
await page.getByRole('checkbox').check();
Arguments
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#
Details
Performs the following steps:
Ensure that element is a checkbox or a radio input. If not, this method throws. If the element is already checked, this method returns immediately.
Wait for actionability checks on the element, unless force option is set.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now checked. If not, this method throws.
If the element is detached from the DOM at any moment during the action, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.

clear
Added in: v1.28 
Clear the input field.
Usage
await page.getByRole('textbox').clear();
Arguments
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#
Details
This method waits for actionability checks, focuses the element, clears it and triggers an input event after clearing.
If the target element is not an <input>, <textarea> or [contenteditable] element, this method throws an error. However, if the element is inside the <label> element that has an associated control, the control will be cleared instead.

click
Added in: v1.14 
Click an element.
Usage
Click a button:
await page.getByRole('button').click();
Shift-right-click at a specific position on a canvas:
await page.locator('canvas').click({
 button: 'right',
 modifiers: ['Shift'],
 position: { x: 23, y: 32 },
});
Arguments
options Object (optional)
button "left" | "right" | "middle" (optional)#
Defaults to left.
clickCount number (optional)#
defaults to 1. See UIEvent.detail.
delay number (optional)#
Time to wait between mousedown and mouseup in milliseconds. Defaults to 0.
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option will default to true in the future.
Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating to inaccessible pages. Defaults to false.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#
Details
This method clicks the element by performing the following steps:
Wait for actionability checks on the element, unless force option is set.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element, or the specified position.
Wait for initiated navigations to either succeed or fail, unless noWaitAfter option is set.
If the element is detached from the DOM at any moment during the action, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.

contentFrame
Added in: v1.43 
Returns a FrameLocator object pointing to the same iframe as this locator.
Useful when you have a Locator object obtained somewhere, and later on would like to interact with the content inside the frame.
For a reverse operation, use frameLocator.owner().
Usage
const locator = page.locator('iframe[name="embedded"]');
// ...
const frameLocator = locator.contentFrame();
await frameLocator.getByRole('button').click();
Returns
FrameLocator#

count
Added in: v1.14 
Returns the number of elements matching the locator.
ASSERTING COUNT
If you need to assert the number of elements on the page, prefer expect(locator).toHaveCount() to avoid flakiness. See assertions guide for more details.
Usage
const count = await page.getByRole('listitem').count();
Returns
Promise<number>#

dblclick
Added in: v1.14 
Double-click an element.
Usage
await locator.dblclick();
await locator.dblclick(options);
Arguments
options Object (optional)
button "left" | "right" | "middle" (optional)#
Defaults to left.
delay number (optional)#
Time to wait between mousedown and mouseup in milliseconds. Defaults to 0.
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#
Details
This method double clicks the element by performing the following steps:
Wait for actionability checks on the element, unless force option is set.
Scroll the element into view if needed.
Use page.mouse to double click in the center of the element, or the specified position.
If the element is detached from the DOM at any moment during the action, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
NOTE
element.dblclick() dispatches two click events and a single dblclick event.

describe
Added in: v1.53 
Describes the locator, description is used in the trace viewer and reports. Returns the locator pointing to the same element.
Usage
const button = page.getByTestId('btn-sub').describe('Subscribe button');
await button.click();
Arguments
description string#
Locator description.
Returns
Locator#

dispatchEvent
Added in: v1.14 
Programmatically dispatch an event on the matching element.
Usage
await locator.dispatchEvent('click');
Arguments
type string#
DOM event type: "click", "dragstart", etc.
eventInit EvaluationArgument (optional)#
Optional event-specific initialization properties.
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#
Details
The snippet above dispatches the click event on the element. Regardless of the visibility state of the element, click is dispatched. This is equivalent to calling element.click().
Under the hood, it creates an instance of an event based on the given type, initializes it with eventInit properties and dispatches it on the element. Events are composed, cancelable and bubble by default.
Since eventInit is event-specific, please refer to the events documentation for the lists of initial properties:
DeviceMotionEvent
DeviceOrientationEvent
DragEvent
Event
FocusEvent
KeyboardEvent
MouseEvent
PointerEvent
TouchEvent
WheelEvent
You can also specify JSHandle as the property value if you want live objects to be passed into the event:
const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
await locator.dispatchEvent('dragstart', { dataTransfer });

dragTo
Added in: v1.18 
Drag the source element towards the target element and drop it.
Usage
const source = page.locator('#source');
const target = page.locator('#target');

await source.dragTo(target);
// or specify exact positions relative to the top-left corners of the elements:
await source.dragTo(target, {
 sourcePosition: { x: 34, y: 7 },
 targetPosition: { x: 10, y: 20 },
});
Arguments
target Locator#
Locator of the element to drag to.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
sourcePosition Object (optional)#
x number
y number
Clicks on the source element at this point relative to the top-left corner of the element's padding box. If not specified, some visible point of the element is used.
targetPosition Object (optional)#
x number
y number
Drops on the target element at this point relative to the top-left corner of the element's padding box. If not specified, some visible point of the element is used.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#
Details
This method drags the locator to another target locator or target position. It will first move to the source element, perform a mousedown, then move to the target element or position and perform a mouseup.

evaluate
Added in: v1.14 
Execute JavaScript code in the page, taking the matching element as an argument.
Usage
Passing argument to pageFunction:
const result = await page.getByTestId('myId').evaluate((element, [x, y]) => {
 return element.textContent + ' ' + x * y;
}, [7, 8]);
console.log(result); // prints "myId text 56"
Arguments
pageFunction function | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds to wait for the locator before evaluating. Note that after locator is resolved, evaluation itself is not limited by the timeout. Defaults to 0 - no timeout.
Returns
Promise<Serializable>#
Details
Returns the return value of pageFunction, called with the matching element as a first argument, and arg as a second argument.
If pageFunction returns a Promise, this method will wait for the promise to resolve and return its value.
If pageFunction throws or rejects, this method throws.

evaluateAll
Added in: v1.14 
Execute JavaScript code in the page, taking all matching elements as an argument.
Usage
const locator = page.locator('div');
const moreThanTen = await locator.evaluateAll((divs, min) => divs.length > min, 10);
Arguments
pageFunction function | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<Serializable>#
Details
Returns the return value of pageFunction, called with an array of all matching elements as a first argument, and arg as a second argument.
If pageFunction returns a Promise, this method will wait for the promise to resolve and return its value.
If pageFunction throws or rejects, this method throws.

evaluateHandle
Added in: v1.14 
Execute JavaScript code in the page, taking the matching element as an argument, and return a JSHandle with the result.
Usage
await locator.evaluateHandle(pageFunction);
await locator.evaluateHandle(pageFunction, arg, options);
Arguments
pageFunction function | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds to wait for the locator before evaluating. Note that after locator is resolved, evaluation itself is not limited by the timeout. Defaults to 0 - no timeout.
Returns
Promise<JSHandle>#
Details
Returns the return value of pageFunction as aJSHandle, called with the matching element as a first argument, and arg as a second argument.
The only difference between locator.evaluate() and locator.evaluateHandle() is that locator.evaluateHandle() returns JSHandle.
If pageFunction returns a Promise, this method will wait for the promise to resolve and return its value.
If pageFunction throws or rejects, this method throws.
See page.evaluateHandle() for more details.

fill
Added in: v1.14 
Set a value to the input field.
Usage
await page.getByRole('textbox').fill('example value');
Arguments
value string#
Value to set for the <input>, <textarea> or [contenteditable] element.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#
Details
This method waits for actionability checks, focuses the element, fills it and triggers an input event after filling. Note that you can pass an empty string to clear the input field.
If the target element is not an <input>, <textarea> or [contenteditable] element, this method throws an error. However, if the element is inside the <label> element that has an associated control, the control will be filled instead.
To send fine-grained keyboard events, use locator.pressSequentially().

filter
Added in: v1.22 
This method narrows existing locator according to the options, for example filters by text. It can be chained to filter multiple times.
Usage
const rowLocator = page.locator('tr');
// ...
await rowLocator
   .filter({ hasText: 'text in column 1' })
   .filter({ has: page.getByRole('button', { name: 'column 2 button' }) })
   .screenshot();
Arguments
options Object (optional)
has Locator (optional)#
Narrows down the results of the method to those which contain elements matching this relative locator. For example, article that has text=Playwright matches <article><div>Playwright</div></article>.
Inner locator must be relative to the outer locator and is queried starting with the outer locator match, not the document root. For example, you can find content that has div in <article><content><div>Playwright</div></content></article>. However, looking for content that has article div will fail, because the inner locator must be relative and should not use any elements outside the content.
Note that outer and inner locators must belong to the same frame. Inner locator must not contain FrameLocators.
hasNot Locator (optional) Added in: v1.33#
Matches elements that do not contain an element that matches an inner locator. Inner locator is queried against the outer one. For example, article that does not have div matches <article><span>Playwright</span></article>.
Note that outer and inner locators must belong to the same frame. Inner locator must not contain FrameLocators.
hasNotText string | RegExp (optional) Added in: v1.33#
Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element. When passed a string, matching is case-insensitive and searches for a substring.
hasText string | RegExp (optional)#
Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a string, matching is case-insensitive and searches for a substring. For example, "Playwright" matches <article><div>Playwright</div></article>.
visible boolean (optional) Added in: v1.51#
Only matches visible or invisible elements.
Returns
Locator#

first
Added in: v1.14 
Returns locator to the first matching element.
Usage
locator.first();
Returns
Locator#

focus
Added in: v1.14 
Calls focus on the matching element.
Usage
await locator.focus();
await locator.focus(options);
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

frameLocator
Added in: v1.17 
When working with iframes, you can create a frame locator that will enter the iframe and allow locating elements in that iframe:
Usage
const locator = page.frameLocator('iframe').getByText('Submit');
await locator.click();
Arguments
selector string#
A selector to use when resolving DOM element.
Returns
FrameLocator#

getAttribute
Added in: v1.14 
Returns the matching element's attribute value.
ASSERTING ATTRIBUTES
If you need to assert an element's attribute, prefer expect(locator).toHaveAttribute() to avoid flakiness. See assertions guide for more details.
Usage
await locator.getAttribute(name);
await locator.getAttribute(name, options);
Arguments
name string#
Attribute name to get the value for.
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<null | string>#

getByAltText
Added in: v1.27 
Allows locating elements by their alt text.
Usage
For example, this method will find the image by alt text "Playwright logo":
<img alt='Playwright logo'>
await page.getByAltText('Playwright logo').click();
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByLabel
Added in: v1.27 
Allows locating input elements by the text of the associated <label> or aria-labelledby element, or by the aria-label attribute.
Usage
For example, this method will find inputs by label "Username" and "Password" in the following DOM:
<input aria-label="Username">
<label for="password-input">Password:</label>
<input id="password-input">
await page.getByLabel('Username').fill('john');
await page.getByLabel('Password').fill('secret');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByPlaceholder
Added in: v1.27 
Allows locating input elements by the placeholder text.
Usage
For example, consider the following DOM structure.
<input type="email" placeholder="name@example.com" />
You can fill the input after locating it by the placeholder text:
await page
   .getByPlaceholder('name@example.com')
   .fill('playwright@microsoft.com');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByRole
Added in: v1.27 
Allows locating elements by their ARIA role, ARIA attributes and accessible name.
Usage
Consider the following DOM structure.
<h3>Sign up</h3>
<label>
 <input type="checkbox" /> Subscribe
</label>
<br/>
<button>Submit</button>
You can locate each element by it's implicit role:
await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();

await page.getByRole('checkbox', { name: 'Subscribe' }).check();

await page.getByRole('button', { name: /submit/i }).click();
Arguments
role "alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"#
Required aria role.
options Object (optional)
checked boolean (optional)#
An attribute that is usually set by aria-checked or native <input type=checkbox> controls.
Learn more about aria-checked.
disabled boolean (optional)#
An attribute that is usually set by aria-disabled or disabled.
NOTE
Unlike most other attributes, disabled is inherited through the DOM hierarchy. Learn more about aria-disabled.
exact boolean (optional) Added in: v1.28#
Whether name is matched exactly: case-sensitive and whole-string. Defaults to false. Ignored when name is a regular expression. Note that exact match still trims whitespace.
expanded boolean (optional)#
An attribute that is usually set by aria-expanded.
Learn more about aria-expanded.
includeHidden boolean (optional)#
Option that controls whether hidden elements are matched. By default, only non-hidden elements, as defined by ARIA, are matched by role selector.
Learn more about aria-hidden.
level number (optional)#
A number attribute that is usually present for roles heading, listitem, row, treeitem, with default values for <h1>-<h6> elements.
Learn more about aria-level.
name string | RegExp (optional)#
Option to match the accessible name. By default, matching is case-insensitive and searches for a substring, use exact to control this behavior.
Learn more about accessible name.
pressed boolean (optional)#
An attribute that is usually set by aria-pressed.
Learn more about aria-pressed.
selected boolean (optional)#
An attribute that is usually set by aria-selected.
Learn more about aria-selected.
Returns
Locator#
Details
Role selector does not replace accessibility audits and conformance tests, but rather gives early feedback about the ARIA guidelines.
Many html elements have an implicitly defined role that is recognized by the role selector. You can find all the supported roles here. ARIA guidelines do not recommend duplicating implicit roles and attributes by setting role and/or aria-* attributes to default values.

getByTestId
Added in: v1.27 
Locate element by the test id.
Usage
Consider the following DOM structure.
<button data-testid="directions">Itinéraire</button>
You can locate the element by it's test id:
await page.getByTestId('directions').click();
Arguments
testId string | RegExp#
Id to locate the element by.
Returns
Locator#
Details
By default, the data-testid attribute is used as a test id. Use selectors.setTestIdAttribute() to configure a different test id attribute if necessary.
// Set custom test id attribute from @playwright/test config:
import { defineConfig } from '@playwright/test';

export default defineConfig({
 use: {
   testIdAttribute: 'data-pw'
 },
});

getByText
Added in: v1.27 
Allows locating elements that contain given text.
See also locator.filter() that allows to match by another criteria, like an accessible role, and then filter by the text content.
Usage
Consider the following DOM structure:
<div>Hello <span>world</span></div>
<div>Hello</div>
You can locate by text substring, exact string, or a regular expression:
// Matches <span>
page.getByText('world');

// Matches first <div>
page.getByText('Hello world');

// Matches second <div>
page.getByText('Hello', { exact: true });

// Matches both <div>s
page.getByText(/Hello/);

// Matches second <div>
page.getByText(/^hello$/i);
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#
Details
Matching by text always normalizes whitespace, even with exact match. For example, it turns multiple spaces into one, turns line breaks into spaces and ignores leading and trailing whitespace.
Input elements of the type button and submit are matched by their value instead of the text content. For example, locating by text "Log in" matches <input type=button value="Log in">.

getByTitle
Added in: v1.27 
Allows locating elements by their title attribute.
Usage
Consider the following DOM structure.
<span title='Issues count'>25 issues</span>
You can check the issues count after locating it by the title text:
await expect(page.getByTitle('Issues count')).toHaveText('25 issues');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

highlight
Added in: v1.20 
Highlight the corresponding element(s) on the screen. Useful for debugging, don't commit the code that uses locator.highlight().
Usage
await locator.highlight();
Returns
Promise<void>#

hover
Added in: v1.14 
Hover over the matching element.
Usage
await page.getByRole('link').hover();
Arguments
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional) Added in: v1.28#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#
Details
This method hovers over the element by performing the following steps:
Wait for actionability checks on the element, unless force option is set.
Scroll the element into view if needed.
Use page.mouse to hover over the center of the element, or the specified position.
If the element is detached from the DOM at any moment during the action, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.

innerHTML
Added in: v1.14 
Returns the element.innerHTML.
Usage
await locator.innerHTML();
await locator.innerHTML(options);
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<string>#

innerText
Added in: v1.14 
Returns the element.innerText.
ASSERTING TEXT
If you need to assert text on the page, prefer expect(locator).toHaveText() with useInnerText option to avoid flakiness. See assertions guide for more details.
Usage
await locator.innerText();
await locator.innerText(options);
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<string>#

inputValue
Added in: v1.14 
Returns the value for the matching <input> or <textarea> or <select> element.
ASSERTING VALUE
If you need to assert input value, prefer expect(locator).toHaveValue() to avoid flakiness. See assertions guide for more details.
Usage
const value = await page.getByRole('textbox').inputValue();
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<string>#
Details
Throws elements that are not an input, textarea or a select. However, if the element is inside the <label> element that has an associated control, returns the value of the control.

isChecked
Added in: v1.14 
Returns whether the element is checked. Throws if the element is not a checkbox or radio input.
ASSERTING CHECKED STATE
If you need to assert that checkbox is checked, prefer expect(locator).toBeChecked() to avoid flakiness. See assertions guide for more details.
Usage
const checked = await page.getByRole('checkbox').isChecked();
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

isDisabled
Added in: v1.14 
Returns whether the element is disabled, the opposite of enabled.
ASSERTING DISABLED STATE
If you need to assert that an element is disabled, prefer expect(locator).toBeDisabled() to avoid flakiness. See assertions guide for more details.
Usage
const disabled = await page.getByRole('button').isDisabled();
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

isEditable
Added in: v1.14 
Returns whether the element is editable. If the target element is not an <input>, <textarea>, <select>, [contenteditable] and does not have a role allowing [aria-readonly], this method throws an error.
ASSERTING EDITABLE STATE
If you need to assert that an element is editable, prefer expect(locator).toBeEditable() to avoid flakiness. See assertions guide for more details.
Usage
const editable = await page.getByRole('textbox').isEditable();
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

isEnabled
Added in: v1.14 
Returns whether the element is enabled.
ASSERTING ENABLED STATE
If you need to assert that an element is enabled, prefer expect(locator).toBeEnabled() to avoid flakiness. See assertions guide for more details.
Usage
const enabled = await page.getByRole('button').isEnabled();
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

isHidden
Added in: v1.14 
Returns whether the element is hidden, the opposite of visible.
ASSERTING VISIBILITY
If you need to assert that element is hidden, prefer expect(locator).toBeHidden() to avoid flakiness. See assertions guide for more details.
Usage
const hidden = await page.getByRole('button').isHidden();
Arguments
options Object (optional)
timeout number (optional)#
DEPRECATED
This option is ignored. locator.isHidden() does not wait for the element to become hidden and returns immediately.
Returns
Promise<boolean>#

isVisible
Added in: v1.14 
Returns whether the element is visible.
ASSERTING VISIBILITY
If you need to assert that element is visible, prefer expect(locator).toBeVisible() to avoid flakiness. See assertions guide for more details.
Usage
const visible = await page.getByRole('button').isVisible();
Arguments
options Object (optional)
timeout number (optional)#
DEPRECATED
This option is ignored. locator.isVisible() does not wait for the element to become visible and returns immediately.
Returns
Promise<boolean>#

last
Added in: v1.14 
Returns locator to the last matching element.
Usage
const banana = await page.getByRole('listitem').last();
Returns
Locator#

locator
Added in: v1.14 
The method finds an element matching the specified selector in the locator's subtree. It also accepts filter options, similar to locator.filter() method.
Learn more about locators.
Usage
locator.locator(selectorOrLocator);
locator.locator(selectorOrLocator, options);
Arguments
selectorOrLocator string | Locator#
A selector or locator to use when resolving DOM element.
options Object (optional)
has Locator (optional)#
Narrows down the results of the method to those which contain elements matching this relative locator. For example, article that has text=Playwright matches <article><div>Playwright</div></article>.
Inner locator must be relative to the outer locator and is queried starting with the outer locator match, not the document root. For example, you can find content that has div in <article><content><div>Playwright</div></content></article>. However, looking for content that has article div will fail, because the inner locator must be relative and should not use any elements outside the content.
Note that outer and inner locators must belong to the same frame. Inner locator must not contain FrameLocators.
hasNot Locator (optional) Added in: v1.33#
Matches elements that do not contain an element that matches an inner locator. Inner locator is queried against the outer one. For example, article that does not have div matches <article><span>Playwright</span></article>.
Note that outer and inner locators must belong to the same frame. Inner locator must not contain FrameLocators.
hasNotText string | RegExp (optional) Added in: v1.33#
Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element. When passed a string, matching is case-insensitive and searches for a substring.
hasText string | RegExp (optional)#
Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a string, matching is case-insensitive and searches for a substring. For example, "Playwright" matches <article><div>Playwright</div></article>.
Returns
Locator#

nth
Added in: v1.14 
Returns locator to the n-th matching element. It's zero based, nth(0) selects the first element.
Usage
const banana = await page.getByRole('listitem').nth(2);
Arguments
index number#
Returns
Locator#

or
Added in: v1.33 
Creates a locator matching all elements that match one or both of the two locators.
Note that when both locators match something, the resulting locator will have multiple matches, potentially causing a locator strictness violation.
Usage
Consider a scenario where you'd like to click on a "New email" button, but sometimes a security settings dialog shows up instead. In this case, you can wait for either a "New email" button, or a dialog and act accordingly.
NOTE
If both "New email" button and security dialog appear on screen, the "or" locator will match both of them, possibly throwing the "strict mode violation" error. In this case, you can use locator.first() to only match one of them.
const newEmail = page.getByRole('button', { name: 'New' });
const dialog = page.getByText('Confirm security settings');
await expect(newEmail.or(dialog).first()).toBeVisible();
if (await dialog.isVisible())
 await page.getByRole('button', { name: 'Dismiss' }).click();
await newEmail.click();
Arguments
locator Locator#
Alternative locator to match.
Returns
Locator#

page
Added in: v1.19 
A page this locator belongs to.
Usage
locator.page();
Returns
Page#

press
Added in: v1.14 
Focuses the matching element and presses a combination of the keys.
Usage
await page.getByRole('textbox').press('Backspace');
Arguments
key string#
Name of the key to press or a character to generate, such as ArrowLeft or a.
options Object (optional)
delay number (optional)#
Time to wait between keydown and keyup in milliseconds. Defaults to 0.
noWaitAfter boolean (optional)#
DEPRECATED
This option will default to true in the future.
Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating to inaccessible pages. Defaults to false.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#
Details
Focuses the element, and then uses keyboard.down() and keyboard.up().
key can specify the intended keyboardEvent.key value or a single character to generate the text for. A superset of the key values can be found here. Examples of the keys are:
F1 - F12, Digit0- Digit9, KeyA- KeyZ, Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape, ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight, ArrowUp, etc.
Following modification shortcuts are also supported: Shift, Control, Alt, Meta, ShiftLeft, ControlOrMeta. ControlOrMeta resolves to Control on Windows and Linux and to Meta on macOS.
Holding down Shift will type the text that corresponds to the key in the upper case.
If key is a single character, it is case-sensitive, so the values a and A will generate different respective texts.
Shortcuts such as key: "Control+o", key: "Control++ or key: "Control+Shift+T" are supported as well. When specified with the modifier, modifier is pressed and being held while the subsequent key is being pressed.

pressSequentially
Added in: v1.38 
TIP
In most cases, you should use locator.fill() instead. You only need to press keys one by one if there is special keyboard handling on the page.
Focuses the element, and then sends a keydown, keypress/input, and keyup event for each character in the text.
To press a special key, like Control or ArrowDown, use locator.press().
Usage
await locator.pressSequentially('Hello'); // Types instantly
await locator.pressSequentially('World', { delay: 100 }); // Types slower, like a user
An example of typing into a text field and then submitting the form:
const locator = page.getByLabel('Password');
await locator.pressSequentially('my password');
await locator.press('Enter');
Arguments
text string#
String of characters to sequentially press into a focused element.
options Object (optional)
delay number (optional)#
Time to wait between key presses in milliseconds. Defaults to 0.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

screenshot
Added in: v1.14 
Take a screenshot of the element matching the locator.
Usage
await page.getByRole('link').screenshot();
Disable animations and save screenshot to a file:
await page.getByRole('link').screenshot({ animations: 'disabled', path: 'link.png' });
Arguments
options Object (optional)
animations "disabled" | "allow" (optional)#
When set to "disabled", stops CSS animations, CSS transitions and Web Animations. Animations get different treatment depending on their duration:
finite animations are fast-forwarded to completion, so they'll fire transitionend event.
infinite animations are canceled to initial state, and then played over after the screenshot.
Defaults to "allow" that leaves animations untouched.
caret "hide" | "initial" (optional)#
When set to "hide", screenshot will hide text caret. When set to "initial", text caret behavior will not be changed. Defaults to "hide".
mask Array<Locator> (optional)#
Specify locators that should be masked when the screenshot is taken. Masked elements will be overlaid with a pink box #FF00FF (customized by maskColor) that completely covers its bounding box. The mask is also applied to invisible elements, see Matching only visible elements to disable that.
maskColor string (optional) Added in: v1.35#
Specify the color of the overlay box for masked elements, in CSS color format. Default color is pink #FF00FF.
omitBackground boolean (optional)#
Hides default white background and allows capturing screenshots with transparency. Not applicable to jpeg images. Defaults to false.
path string (optional)#
The file path to save the image to. The screenshot type will be inferred from file extension. If path is a relative path, then it is resolved relative to the current working directory. If no path is provided, the image won't be saved to the disk.
quality number (optional)#
The quality of the image, between 0-100. Not applicable to png images.
scale "css" | "device" (optional)#
When set to "css", screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using "device" option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.
Defaults to "device".
style string (optional) Added in: v1.41#
Text of the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies to the inner frames.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
type "png" | "jpeg" (optional)#
Specify screenshot type, defaults to png.
Returns
Promise<Buffer>#
Details
This method captures a screenshot of the page, clipped to the size and position of a particular element matching the locator. If the element is covered by other elements, it will not be actually visible on the screenshot. If the element is a scrollable container, only the currently scrolled content will be visible on the screenshot.
This method waits for the actionability checks, then scrolls element into view before taking a screenshot. If the element is detached from DOM, the method throws an error.
Returns the buffer with the captured screenshot.

scrollIntoViewIfNeeded
Added in: v1.14 
This method waits for actionability checks, then tries to scroll element into view, unless it is completely visible as defined by IntersectionObserver's ratio.
See scrolling for alternative ways to scroll.
Usage
await locator.scrollIntoViewIfNeeded();
await locator.scrollIntoViewIfNeeded(options);
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

selectOption
Added in: v1.14 
Selects option or options in <select>.
Usage
<select multiple>
 <option value="red">Red</option>
 <option value="green">Green</option>
 <option value="blue">Blue</option>
</select>
// single selection matching the value or label
element.selectOption('blue');

// single selection matching the label
element.selectOption({ label: 'Blue' });

// multiple selection for red, green and blue options
element.selectOption(['red', 'green', 'blue']);
Arguments
values null | string | ElementHandle | Array<string> | Object | Array<ElementHandle> | Array<Object>#
value string (optional)
Matches by option.value. Optional.
label string (optional)
Matches by option.label. Optional.
index number (optional)
Matches by the index. Optional.
Options to select. If the <select> has the multiple attribute, all matching options are selected, otherwise only the first option matching one of the passed options is selected. String values are matching both values and labels. Option is considered matching if all specified properties match.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<Array<string>>#
Details
This method waits for actionability checks, waits until all specified options are present in the <select> element and selects these options.
If the target element is not a <select> element, this method throws an error. However, if the element is inside the <label> element that has an associated control, the control will be used instead.
Returns the array of option values that have been successfully selected.
Triggers a change and input event once all the provided options have been selected.

selectText
Added in: v1.14 
This method waits for actionability checks, then focuses the element and selects all its text content.
If the element is inside the <label> element that has an associated control, focuses and selects text in the control instead.
Usage
await locator.selectText();
await locator.selectText(options);
Arguments
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

setChecked
Added in: v1.15 
Set the state of a checkbox or a radio element.
Usage
await page.getByRole('checkbox').setChecked(true);
Arguments
checked boolean#
Whether to check or uncheck the checkbox.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#
Details
This method checks or unchecks an element by performing the following steps:
Ensure that matched element is a checkbox or a radio input. If not, this method throws.
If the element already has the right checked state, this method returns immediately.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now checked or unchecked. If not, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.

setInputFiles
Added in: v1.14 
Upload file or multiple files into <input type=file>. For inputs with a [webkitdirectory] attribute, only a single directory path is supported.
Usage
// Select one file
await page.getByLabel('Upload file').setInputFiles(path.join(__dirname, 'myfile.pdf'));

// Select multiple files
await page.getByLabel('Upload files').setInputFiles([
 path.join(__dirname, 'file1.txt'),
 path.join(__dirname, 'file2.txt'),
]);

// Select a directory
await page.getByLabel('Upload directory').setInputFiles(path.join(__dirname, 'mydir'));

// Remove all the selected files
await page.getByLabel('Upload file').setInputFiles([]);

// Upload buffer from memory
await page.getByLabel('Upload file').setInputFiles({
 name: 'file.txt',
 mimeType: 'text/plain',
 buffer: Buffer.from('this is test')
});
Arguments
files string | Array<string> | Object | Array<Object>#
name string
File name
mimeType string
File type
buffer Buffer
File content
options Object (optional)
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#
Details
Sets the value of the file input to these file paths or files. If some of the filePaths are relative paths, then they are resolved relative to the current working directory. For empty array, clears the selected files.
This method expects Locator to point to an input element. However, if the element is inside the <label> element that has an associated control, targets the control instead.

tap
Added in: v1.14 
Perform a tap gesture on the element matching the locator. For examples of emulating other gestures by manually dispatching touch events, see the emulating legacy touch events page.
Usage
await locator.tap();
await locator.tap(options);
Arguments
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#
Details
This method taps the element by performing the following steps:
Wait for actionability checks on the element, unless force option is set.
Scroll the element into view if needed.
Use page.touchscreen to tap the center of the element, or the specified position.
If the element is detached from the DOM at any moment during the action, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
NOTE
element.tap() requires that the hasTouch option of the browser context be set to true.

textContent
Added in: v1.14 
Returns the node.textContent.
ASSERTING TEXT
If you need to assert text on the page, prefer expect(locator).toHaveText() to avoid flakiness. See assertions guide for more details.
Usage
await locator.textContent();
await locator.textContent(options);
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<null | string>#

uncheck
Added in: v1.14 
Ensure that checkbox or radio element is unchecked.
Usage
await page.getByRole('checkbox').uncheck();
Arguments
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#
Details
This method unchecks the element by performing the following steps:
Ensure that element is a checkbox or a radio input. If not, this method throws. If the element is already unchecked, this method returns immediately.
Wait for actionability checks on the element, unless force option is set.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now unchecked. If not, this method throws.
If the element is detached from the DOM at any moment during the action, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.

waitFor
Added in: v1.16 
Returns when element specified by locator satisfies the state option.
If target element already satisfies the condition, the method returns immediately. Otherwise, waits for up to timeout milliseconds until the condition is met.
Usage
const orderSent = page.locator('#order-sent');
await orderSent.waitFor();
Arguments
options Object (optional)
state "attached" | "detached" | "visible" | "hidden" (optional)#
Defaults to 'visible'. Can be either:
'attached' - wait for element to be present in DOM.
'detached' - wait for element to not be present in DOM.
'visible' - wait for element to have non-empty bounding box and no visibility:hidden. Note that element without any content or with display:none has an empty bounding box and is not considered visible.
'hidden' - wait for element to be either detached from DOM, or have an empty bounding box or visibility:hidden. This is opposite to the 'visible' option.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

Deprecated
elementHandle
Added in: v1.14 
DISCOURAGED
Always prefer using Locators and web assertions over ElementHandles because latter are inherently racy.
Resolves given locator to the first matching DOM element. If there are no matching elements, waits for one. If multiple elements match the locator, throws.
Usage
await locator.elementHandle();
await locator.elementHandle(options);
Arguments
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<ElementHandle>#

elementHandles
Added in: v1.14 
DISCOURAGED
Always prefer using Locators and web assertions over ElementHandles because latter are inherently racy.
Resolves given locator to all matching DOM elements. If there are no matching elements, returns an empty list.
Usage
await locator.elementHandles();
Returns
Promise<Array<ElementHandle>>#

type
Added in: v1.14 
DEPRECATED
In most cases, you should use locator.fill() instead. You only need to press keys one by one if there is special keyboard handling on the page - in this case use locator.pressSequentially().
Focuses the element, and then sends a keydown, keypress/input, and keyup event for each character in the text.
To press a special key, like Control or ArrowDown, use locator.press().
Usage
Arguments
text string#
A text to type into a focused element.
options Object (optional)
delay number (optional)#
Time to wait between key presses in milliseconds. Defaults to 0.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#
Previous
Keyboard
Next
Logger
Methods
all
allInnerTexts
allTextContents
and
ariaSnapshot
blur
boundingBox
check
clear
click
contentFrame
count
dblclick
describe
dispatchEvent
dragTo
evaluate
evaluateAll
evaluateHandle
fill
filter
first
focus
frameLocator
getAttribute
getByAltText
getByLabel
getByPlaceholder
getByRole
getByTestId
getByText
getByTitle
highlight
hover
innerHTML
innerText
inputValue
isChecked
isDisabled
isEditable
isEnabled
isHidden
isVisible
last
locator
nth
or
page
press
pressSequentially
screenshot
scrollIntoViewIfNeeded
selectOption
selectText
setChecked
setInputFiles
tap
textContent
uncheck
waitFor
Deprecated
elementHandle
elementHandles
type
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Skip to main content

Playwright
DocsAPINode.js
Community
API reference
Playwright Test
Playwright Library
Classes
APIRequest
APIRequestContext
APIResponse
Accessibility
Browser
BrowserContext
BrowserServer
BrowserType
CDPSession
Clock
ConsoleMessage
Coverage
Dialog
Download
ElementHandle
FileChooser
Frame
FrameLocator
JSHandle
Keyboard
Locator
Logger
Mouse
Page
Request
Response
Route
Selectors
TimeoutError
Touchscreen
Tracing
Video
WebError
WebSocket
WebSocketRoute
Worker
Assertions
APIResponseAssertions
GenericAssertions
LocatorAssertions
PageAssertions
SnapshotAssertions
Test Runner
Fixtures
FullConfig
FullProject
Location
Playwright Test
TestConfig
TestInfo
TestInfoError
TestOptions
TestProject
TestStepInfo
WorkerInfo
Test Reporter
Reporter
Suite
TestCase
TestError
TestResult
TestStep
Experimental
Android
AndroidDevice
AndroidInput
AndroidSocket
AndroidWebView
Electron
ElectronApplication


API reference
Classes
Logger
Logger
DEPRECATED
This class is deprecated. The logs pumped through this class are incomplete. Please use tracing instead.
Playwright generates a lot of logs and they are accessible via the pluggable logger sink.
const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.

(async () => {
 const browser = await chromium.launch({
   logger: {
     isEnabled: (name, severity) => name === 'api',
     log: (name, severity, message, args) => console.log(`${name} ${message}`)
   }
 });
 // ...
})();

Methods
isEnabled
Added before v1.9 
Determines whether sink is interested in the logger with the given name and severity.
Usage
logger.isEnabled(name, severity);
Arguments
name string#
logger name
severity "verbose" | "info" | "warning" | "error"#
Returns
boolean#

log
Added before v1.9 
Usage
logger.log(name, severity, message, args, hints);
Arguments
name string#
logger name
severity "verbose" | "info" | "warning" | "error"#
message string | Error#
log message format
args Array<Object>#
message arguments
hints Object#
color string (optional)
Optional preferred logger color.
optional formatting hints
Previous
Locator
Next
Mouse
Methods
isEnabled
log
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Mouse
The Mouse class operates in main-frame CSS pixels relative to the top-left corner of the viewport.
TIP
If you want to debug where the mouse moved, you can use the Trace viewer or Playwright Inspector. A red dot showing the location of the mouse will be shown for every mouse action.
Every page object has its own Mouse, accessible with page.mouse.
// Using ‘page.mouse’ to trace a 100x100 square.
await page.mouse.move(0, 0);
await page.mouse.down();
await page.mouse.move(0, 100);
await page.mouse.move(100, 100);
await page.mouse.move(100, 0);
await page.mouse.move(0, 0);
await page.mouse.up();

Methods
click
Added before v1.9 
Shortcut for mouse.move(), mouse.down(), mouse.up().
Usage
await mouse.click(x, y);
await mouse.click(x, y, options);
Arguments
x number#
X coordinate relative to the main frame's viewport in CSS pixels.
y number#
Y coordinate relative to the main frame's viewport in CSS pixels.
options Object (optional)
button "left" | "right" | "middle" (optional)#
Defaults to left.
clickCount number (optional)#
defaults to 1. See UIEvent.detail.
delay number (optional)#
Time to wait between mousedown and mouseup in milliseconds. Defaults to 0.
Returns
Promise<void>#

dblclick
Added before v1.9 
Shortcut for mouse.move(), mouse.down(), mouse.up(), mouse.down() and mouse.up().
Usage
await mouse.dblclick(x, y);
await mouse.dblclick(x, y, options);
Arguments
x number#
X coordinate relative to the main frame's viewport in CSS pixels.
y number#
Y coordinate relative to the main frame's viewport in CSS pixels.
options Object (optional)
button "left" | "right" | "middle" (optional)#
Defaults to left.
delay number (optional)#
Time to wait between mousedown and mouseup in milliseconds. Defaults to 0.
Returns
Promise<void>#

down
Added before v1.9 
Dispatches a mousedown event.
Usage
await mouse.down();
await mouse.down(options);
Arguments
options Object (optional)
button "left" | "right" | "middle" (optional)#
Defaults to left.
clickCount number (optional)#
defaults to 1. See UIEvent.detail.
Returns
Promise<void>#

move
Added before v1.9 
Dispatches a mousemove event.
Usage
await mouse.move(x, y);
await mouse.move(x, y, options);
Arguments
x number#
X coordinate relative to the main frame's viewport in CSS pixels.
y number#
Y coordinate relative to the main frame's viewport in CSS pixels.
options Object (optional)
steps number (optional)#
Defaults to 1. Sends intermediate mousemove events.
Returns
Promise<void>#

up
Added before v1.9 
Dispatches a mouseup event.
Usage
await mouse.up();
await mouse.up(options);
Arguments
options Object (optional)
button "left" | "right" | "middle" (optional)#
Defaults to left.
clickCount number (optional)#
defaults to 1. See UIEvent.detail.
Returns
Promise<void>#

wheel
Added in: v1.15 
Dispatches a wheel event. This method is usually used to manually scroll the page. See scrolling for alternative ways to scroll.
NOTE
Wheel events may cause scrolling if they are not handled, and this method does not wait for the scrolling to finish before returning.
Usage
await mouse.wheel(deltaX, deltaY);
Arguments
deltaX number#
Pixels to scroll horizontally.
deltaY number#
Pixels to scroll vertically.
Returns
Promise<void>#
Previous
Logger
Next
Page
Methods
click
dblclick
down
move
up
wheel
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Page
Page provides methods to interact with a single tab in a Browser, or an extension background page in Chromium. One Browser instance might have multiple Page instances.
This example creates a page, navigates it to a URL, and then saves a screenshot:
const { webkit } = require('playwright');  // Or 'chromium' or 'firefox'.

(async () => {
 const browser = await webkit.launch();
 const context = await browser.newContext();
 const page = await context.newPage();
 await page.goto('https://example.com');
 await page.screenshot({ path: 'screenshot.png' });
 await browser.close();
})();
The Page class emits various events (described below) which can be handled using any of Node's native EventEmitter methods, such as on, once or removeListener.
This example logs a message for a single page load event:
page.once('load', () => console.log('Page loaded!'));
To unsubscribe from events use the removeListener method:
function logRequest(interceptedRequest) {
 console.log('A request was made:', interceptedRequest.url());
}
page.on('request', logRequest);
// Sometime later...
page.removeListener('request', logRequest);

Methods
addInitScript
Added before v1.9 
Adds a script which would be evaluated in one of the following scenarios:
Whenever the page is navigated.
Whenever the child frame is attached or navigated. In this case, the script is evaluated in the context of the newly attached frame.
The script is evaluated after the document was created but before any of its scripts were run. This is useful to amend the JavaScript environment, e.g. to seed Math.random.
Usage
An example of overriding Math.random before the page loads:
// preload.js
Math.random = () => 42;
// In your playwright script, assuming the preload.js file is in same directory
await page.addInitScript({ path: './preload.js' });
await page.addInitScript(mock => {
 window.mock = mock;
}, mock);
NOTE
The order of evaluation of multiple scripts installed via browserContext.addInitScript() and page.addInitScript() is not defined.
Arguments
script function | string | Object#
path string (optional)
Path to the JavaScript file. If path is a relative path, then it is resolved relative to the current working directory. Optional.
content string (optional)
Raw script content. Optional.
Script to be evaluated in the page.
arg Serializable (optional)#
Optional argument to pass to script (only supported when passing a function).
Returns
Promise<void>#

addLocatorHandler
Added in: v1.42 
When testing a web page, sometimes unexpected overlays like a "Sign up" dialog appear and block actions you want to automate, e.g. clicking a button. These overlays don't always show up in the same way or at the same time, making them tricky to handle in automated tests.
This method lets you set up a special function, called a handler, that activates when it detects that overlay is visible. The handler's job is to remove the overlay, allowing your test to continue as if the overlay wasn't there.
Things to keep in mind:
When an overlay is shown predictably, we recommend explicitly waiting for it in your test and dismissing it as a part of your normal test flow, instead of using page.addLocatorHandler().
Playwright checks for the overlay every time before executing or retrying an action that requires an actionability check, or before performing an auto-waiting assertion check. When overlay is visible, Playwright calls the handler first, and then proceeds with the action/assertion. Note that the handler is only called when you perform an action/assertion - if the overlay becomes visible but you don't perform any actions, the handler will not be triggered.
After executing the handler, Playwright will ensure that overlay that triggered the handler is not visible anymore. You can opt-out of this behavior with noWaitAfter.
The execution time of the handler counts towards the timeout of the action/assertion that executed the handler. If your handler takes too long, it might cause timeouts.
You can register multiple handlers. However, only a single handler will be running at a time. Make sure the actions within a handler don't depend on another handler.
WARNING
Running the handler will alter your page state mid-test. For example it will change the currently focused element and move the mouse. Make sure that actions that run after the handler are self-contained and do not rely on the focus and mouse state being unchanged.
For example, consider a test that calls locator.focus() followed by keyboard.press(). If your handler clicks a button between these two actions, the focused element most likely will be wrong, and key press will happen on the unexpected element. Use locator.press() instead to avoid this problem.
Another example is a series of mouse actions, where mouse.move() is followed by mouse.down(). Again, when the handler runs between these two actions, the mouse position will be wrong during the mouse down. Prefer self-contained actions like locator.click() that do not rely on the state being unchanged by a handler.
Usage
An example that closes a "Sign up to the newsletter" dialog when it appears:
// Setup the handler.
await page.addLocatorHandler(page.getByText('Sign up to the newsletter'), async () => {
 await page.getByRole('button', { name: 'No thanks' }).click();
});

// Write the test as usual.
await page.goto('https://example.com');
await page.getByRole('button', { name: 'Start here' }).click();
An example that skips the "Confirm your security details" page when it is shown:
// Setup the handler.
await page.addLocatorHandler(page.getByText('Confirm your security details'), async () => {
 await page.getByRole('button', { name: 'Remind me later' }).click();
});

// Write the test as usual.
await page.goto('https://example.com');
await page.getByRole('button', { name: 'Start here' }).click();
An example with a custom callback on every actionability check. It uses a <body> locator that is always visible, so the handler is called before every actionability check. It is important to specify noWaitAfter, because the handler does not hide the <body> element.
// Setup the handler.
await page.addLocatorHandler(page.locator('body'), async () => {
 await page.evaluate(() => window.removeObstructionsForTestIfNeeded());
}, { noWaitAfter: true });

// Write the test as usual.
await page.goto('https://example.com');
await page.getByRole('button', { name: 'Start here' }).click();
Handler takes the original locator as an argument. You can also automatically remove the handler after a number of invocations by setting times:
await page.addLocatorHandler(page.getByLabel('Close'), async locator => {
 await locator.click();
}, { times: 1 });
Arguments
locator Locator#
Locator that triggers the handler.
handler function(Locator):Promise<Object>#
Function that should be run once locator appears. This function should get rid of the element that blocks actions like click.
options Object (optional)
noWaitAfter boolean (optional) Added in: v1.44#
By default, after calling the handler Playwright will wait until the overlay becomes hidden, and only then Playwright will continue with the action/assertion that triggered the handler. This option allows to opt-out of this behavior, so that overlay can stay visible after the handler has run.
times number (optional) Added in: v1.44#
Specifies the maximum number of times this handler should be called. Unlimited by default.
Returns
Promise<void>#

addScriptTag
Added before v1.9 
Adds a <script> tag into the page with the desired url or content. Returns the added tag when the script's onload fires or when the script content was injected into frame.
Usage
await page.addScriptTag();
await page.addScriptTag(options);
Arguments
options Object (optional)
content string (optional)#
Raw JavaScript content to be injected into frame.
path string (optional)#
Path to the JavaScript file to be injected into frame. If path is a relative path, then it is resolved relative to the current working directory.
type string (optional)#
Script type. Use 'module' in order to load a JavaScript ES6 module. See script for more details.
url string (optional)#
URL of a script to be added.
Returns
Promise<ElementHandle>#

addStyleTag
Added before v1.9 
Adds a <link rel="stylesheet"> tag into the page with the desired url or a <style type="text/css"> tag with the content. Returns the added tag when the stylesheet's onload fires or when the CSS content was injected into frame.
Usage
await page.addStyleTag();
await page.addStyleTag(options);
Arguments
options Object (optional)
content string (optional)#
Raw CSS content to be injected into frame.
path string (optional)#
Path to the CSS file to be injected into frame. If path is a relative path, then it is resolved relative to the current working directory.
url string (optional)#
URL of the <link> tag.
Returns
Promise<ElementHandle>#

bringToFront
Added before v1.9 
Brings page to front (activates tab).
Usage
await page.bringToFront();
Returns
Promise<void>#

close
Added before v1.9 
If runBeforeUnload is false, does not run any unload handlers and waits for the page to be closed. If runBeforeUnload is true the method will run unload handlers, but will not wait for the page to close.
By default, page.close() does not run beforeunload handlers.
NOTE
if runBeforeUnload is passed as true, a beforeunload dialog might be summoned and should be handled manually via page.on('dialog') event.
Usage
await page.close();
await page.close(options);
Arguments
options Object (optional)
reason string (optional) Added in: v1.40#
The reason to be reported to the operations interrupted by the page closure.
runBeforeUnload boolean (optional)#
Defaults to false. Whether to run the before unload page handlers.
Returns
Promise<void>#

content
Added before v1.9 
Gets the full HTML contents of the page, including the doctype.
Usage
await page.content();
Returns
Promise<string>#

context
Added before v1.9 
Get the browser context that the page belongs to.
Usage
page.context();
Returns
BrowserContext#

dragAndDrop
Added in: v1.13 
This method drags the source element to the target element. It will first move to the source element, perform a mousedown, then move to the target element and perform a mouseup.
Usage
await page.dragAndDrop('#source', '#target');
// or specify exact positions relative to the top-left corners of the elements:
await page.dragAndDrop('#source', '#target', {
 sourcePosition: { x: 34, y: 7 },
 targetPosition: { x: 10, y: 20 },
});
Arguments
source string#
A selector to search for an element to drag. If there are multiple elements satisfying the selector, the first will be used.
target string#
A selector to search for an element to drop onto. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
sourcePosition Object (optional) Added in: v1.14#
x number
y number
Clicks on the source element at this point relative to the top-left corner of the element's padding box. If not specified, some visible point of the element is used.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
targetPosition Object (optional) Added in: v1.14#
x number
y number
Drops on the target element at this point relative to the top-left corner of the element's padding box. If not specified, some visible point of the element is used.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

emulateMedia
Added before v1.9 
This method changes the CSS media type through the media argument, and/or the 'prefers-colors-scheme' media feature, using the colorScheme argument.
Usage
await page.evaluate(() => matchMedia('screen').matches);
// → true
await page.evaluate(() => matchMedia('print').matches);
// → false

await page.emulateMedia({ media: 'print' });
await page.evaluate(() => matchMedia('screen').matches);
// → false
await page.evaluate(() => matchMedia('print').matches);
// → true

await page.emulateMedia({});
await page.evaluate(() => matchMedia('screen').matches);
// → true
await page.evaluate(() => matchMedia('print').matches);
// → false
await page.emulateMedia({ colorScheme: 'dark' });
await page.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches);
// → true
await page.evaluate(() => matchMedia('(prefers-color-scheme: light)').matches);
// → false
Arguments
options Object (optional)
colorScheme null | "light" | "dark" | "no-preference" (optional) Added in: v1.9#
Emulates prefers-colors-scheme media feature, supported values are 'light' and 'dark'. Passing null disables color scheme emulation. 'no-preference' is deprecated.
contrast null | "no-preference" | "more" (optional) Added in: v1.51#
Emulates 'prefers-contrast' media feature, supported values are 'no-preference', 'more'. Passing null disables contrast emulation.
forcedColors null | "active" | "none" (optional) Added in: v1.15#
Emulates 'forced-colors' media feature, supported values are 'active' and 'none'. Passing null disables forced colors emulation.
media null | "screen" | "print" (optional) Added in: v1.9#
Changes the CSS media type of the page. The only allowed values are 'screen', 'print' and null. Passing null disables CSS media emulation.
reducedMotion null | "reduce" | "no-preference" (optional) Added in: v1.12#
Emulates 'prefers-reduced-motion' media feature, supported values are 'reduce', 'no-preference'. Passing null disables reduced motion emulation.
Returns
Promise<void>#

evaluate
Added before v1.9 
Returns the value of the pageFunction invocation.
If the function passed to the page.evaluate() returns a Promise, then page.evaluate() would wait for the promise to resolve and return its value.
If the function passed to the page.evaluate() returns a non-Serializable value, then page.evaluate() resolves to undefined. Playwright also supports transferring some additional values that are not serializable by JSON: -0, NaN, Infinity, -Infinity.
Usage
Passing argument to pageFunction:
const result = await page.evaluate(([x, y]) => {
 return Promise.resolve(x * y);
}, [7, 8]);
console.log(result); // prints "56"
A string can also be passed in instead of a function:
console.log(await page.evaluate('1 + 2')); // prints "3"
const x = 10;
console.log(await page.evaluate(`1 + ${x}`)); // prints "11"
ElementHandle instances can be passed as an argument to the page.evaluate():
const bodyHandle = await page.evaluate('document.body');
const html = await page.evaluate<string, HTMLElement>(([body, suffix]) =>
 body.innerHTML + suffix, [bodyHandle, 'hello']
);
await bodyHandle.dispose();
Arguments
pageFunction function | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<Serializable>#

evaluateHandle
Added before v1.9 
Returns the value of the pageFunction invocation as a JSHandle.
The only difference between page.evaluate() and page.evaluateHandle() is that page.evaluateHandle() returns JSHandle.
If the function passed to the page.evaluateHandle() returns a Promise, then page.evaluateHandle() would wait for the promise to resolve and return its value.
Usage
// Handle for the window object.
const aWindowHandle = await page.evaluateHandle(() => Promise.resolve(window));
A string can also be passed in instead of a function:
const aHandle = await page.evaluateHandle('document'); // Handle for the 'document'
JSHandle instances can be passed as an argument to the page.evaluateHandle():
const aHandle = await page.evaluateHandle(() => document.body);
const resultHandle = await page.evaluateHandle(body => body.innerHTML, aHandle);
console.log(await resultHandle.jsonValue());
await resultHandle.dispose();
Arguments
pageFunction function | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<JSHandle>#

exposeBinding
Added before v1.9 
The method adds a function called name on the window object of every frame in this page. When called, the function executes callback and returns a Promise which resolves to the return value of callback. If the callback returns a Promise, it will be awaited.
The first argument of the callback function contains information about the caller: { browserContext: BrowserContext, page: Page, frame: Frame }.
See browserContext.exposeBinding() for the context-wide version.
NOTE
Functions installed via page.exposeBinding() survive navigations.
Usage
An example of exposing page URL to all frames in a page:
const { webkit } = require('playwright');  // Or 'chromium' or 'firefox'.

(async () => {
 const browser = await webkit.launch({ headless: false });
 const context = await browser.newContext();
 const page = await context.newPage();
 await page.exposeBinding('pageURL', ({ page }) => page.url());
 await page.setContent(`
   <script>
     async function onClick() {
       document.querySelector('div').textContent = await window.pageURL();
     }
   </script>
   <button onclick="onClick()">Click me</button>
   <div></div>
 `);
 await page.click('button');
})();
Arguments
name string#
Name of the function on the window object.
callback function#
Callback function that will be called in the Playwright's context.
options Object (optional)
handle boolean (optional)#
DEPRECATED
This option will be removed in the future.
Whether to pass the argument as a handle, instead of passing by value. When passing a handle, only one argument is supported. When passing by value, multiple arguments are supported.
Returns
Promise<void>#

exposeFunction
Added before v1.9 
The method adds a function called name on the window object of every frame in the page. When called, the function executes callback and returns a Promise which resolves to the return value of callback.
If the callback returns a Promise, it will be awaited.
See browserContext.exposeFunction() for context-wide exposed function.
NOTE
Functions installed via page.exposeFunction() survive navigations.
Usage
An example of adding a sha256 function to the page:
const { webkit } = require('playwright');  // Or 'chromium' or 'firefox'.
const crypto = require('crypto');

(async () => {
 const browser = await webkit.launch({ headless: false });
 const page = await browser.newPage();
 await page.exposeFunction('sha256', text =>
   crypto.createHash('sha256').update(text).digest('hex'),
 );
 await page.setContent(`
   <script>
     async function onClick() {
       document.querySelector('div').textContent = await window.sha256('PLAYWRIGHT');
     }
   </script>
   <button onclick="onClick()">Click me</button>
   <div></div>
 `);
 await page.click('button');
})();
Arguments
name string#
Name of the function on the window object
callback function#
Callback function which will be called in Playwright's context.
Returns
Promise<void>#

frame
Added before v1.9 
Returns frame matching the specified criteria. Either name or url must be specified.
Usage
const frame = page.frame('frame-name');
const frame = page.frame({ url: /.*domain.*/ });
Arguments
frameSelector string | Object#
name string (optional)
Frame name specified in the iframe's name attribute. Optional.
url string | RegExp | function(URL):boolean (optional)
A glob pattern, regex pattern or predicate receiving frame's url as a URL object. Optional.
Frame name or other frame lookup options.
Returns
null | Frame#

frameLocator
Added in: v1.17 
When working with iframes, you can create a frame locator that will enter the iframe and allow selecting elements in that iframe.
Usage
Following snippet locates element with text "Submit" in the iframe with id my-frame, like <iframe id="my-frame">:
const locator = page.frameLocator('#my-iframe').getByText('Submit');
await locator.click();
Arguments
selector string#
A selector to use when resolving DOM element.
Returns
FrameLocator#

frames
Added before v1.9 
An array of all frames attached to the page.
Usage
page.frames();
Returns
Array<Frame>#

getByAltText
Added in: v1.27 
Allows locating elements by their alt text.
Usage
For example, this method will find the image by alt text "Playwright logo":
<img alt='Playwright logo'>
await page.getByAltText('Playwright logo').click();
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByLabel
Added in: v1.27 
Allows locating input elements by the text of the associated <label> or aria-labelledby element, or by the aria-label attribute.
Usage
For example, this method will find inputs by label "Username" and "Password" in the following DOM:
<input aria-label="Username">
<label for="password-input">Password:</label>
<input id="password-input">
await page.getByLabel('Username').fill('john');
await page.getByLabel('Password').fill('secret');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByPlaceholder
Added in: v1.27 
Allows locating input elements by the placeholder text.
Usage
For example, consider the following DOM structure.
<input type="email" placeholder="name@example.com" />
You can fill the input after locating it by the placeholder text:
await page
   .getByPlaceholder('name@example.com')
   .fill('playwright@microsoft.com');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

getByRole
Added in: v1.27 
Allows locating elements by their ARIA role, ARIA attributes and accessible name.
Usage
Consider the following DOM structure.
<h3>Sign up</h3>
<label>
 <input type="checkbox" /> Subscribe
</label>
<br/>
<button>Submit</button>
You can locate each element by it's implicit role:
await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();

await page.getByRole('checkbox', { name: 'Subscribe' }).check();

await page.getByRole('button', { name: /submit/i }).click();
Arguments
role "alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"#
Required aria role.
options Object (optional)
checked boolean (optional)#
An attribute that is usually set by aria-checked or native <input type=checkbox> controls.
Learn more about aria-checked.
disabled boolean (optional)#
An attribute that is usually set by aria-disabled or disabled.
NOTE
Unlike most other attributes, disabled is inherited through the DOM hierarchy. Learn more about aria-disabled.
exact boolean (optional) Added in: v1.28#
Whether name is matched exactly: case-sensitive and whole-string. Defaults to false. Ignored when name is a regular expression. Note that exact match still trims whitespace.
expanded boolean (optional)#
An attribute that is usually set by aria-expanded.
Learn more about aria-expanded.
includeHidden boolean (optional)#
Option that controls whether hidden elements are matched. By default, only non-hidden elements, as defined by ARIA, are matched by role selector.
Learn more about aria-hidden.
level number (optional)#
A number attribute that is usually present for roles heading, listitem, row, treeitem, with default values for <h1>-<h6> elements.
Learn more about aria-level.
name string | RegExp (optional)#
Option to match the accessible name. By default, matching is case-insensitive and searches for a substring, use exact to control this behavior.
Learn more about accessible name.
pressed boolean (optional)#
An attribute that is usually set by aria-pressed.
Learn more about aria-pressed.
selected boolean (optional)#
An attribute that is usually set by aria-selected.
Learn more about aria-selected.
Returns
Locator#
Details
Role selector does not replace accessibility audits and conformance tests, but rather gives early feedback about the ARIA guidelines.
Many html elements have an implicitly defined role that is recognized by the role selector. You can find all the supported roles here. ARIA guidelines do not recommend duplicating implicit roles and attributes by setting role and/or aria-* attributes to default values.

getByTestId
Added in: v1.27 
Locate element by the test id.
Usage
Consider the following DOM structure.
<button data-testid="directions">Itinéraire</button>
You can locate the element by it's test id:
await page.getByTestId('directions').click();
Arguments
testId string | RegExp#
Id to locate the element by.
Returns
Locator#
Details
By default, the data-testid attribute is used as a test id. Use selectors.setTestIdAttribute() to configure a different test id attribute if necessary.
// Set custom test id attribute from @playwright/test config:
import { defineConfig } from '@playwright/test';

export default defineConfig({
 use: {
   testIdAttribute: 'data-pw'
 },
});

getByText
Added in: v1.27 
Allows locating elements that contain given text.
See also locator.filter() that allows to match by another criteria, like an accessible role, and then filter by the text content.
Usage
Consider the following DOM structure:
<div>Hello <span>world</span></div>
<div>Hello</div>
You can locate by text substring, exact string, or a regular expression:
// Matches <span>
page.getByText('world');

// Matches first <div>
page.getByText('Hello world');

// Matches second <div>
page.getByText('Hello', { exact: true });

// Matches both <div>s
page.getByText(/Hello/);

// Matches second <div>
page.getByText(/^hello$/i);
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#
Details
Matching by text always normalizes whitespace, even with exact match. For example, it turns multiple spaces into one, turns line breaks into spaces and ignores leading and trailing whitespace.
Input elements of the type button and submit are matched by their value instead of the text content. For example, locating by text "Log in" matches <input type=button value="Log in">.

getByTitle
Added in: v1.27 
Allows locating elements by their title attribute.
Usage
Consider the following DOM structure.
<span title='Issues count'>25 issues</span>
You can check the issues count after locating it by the title text:
await expect(page.getByTitle('Issues count')).toHaveText('25 issues');
Arguments
text string | RegExp#
Text to locate the element for.
options Object (optional)
exact boolean (optional)#
Whether to find an exact match: case-sensitive and whole-string. Default to false. Ignored when locating by a regular expression. Note that exact match still trims whitespace.
Returns
Locator#

goBack
Added before v1.9 
Returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the last redirect. If cannot go back, returns null.
Navigate to the previous page in history.
Usage
await page.goBack();
await page.goBack(options);
Arguments
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<null | Response>#

goForward
Added before v1.9 
Returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the last redirect. If cannot go forward, returns null.
Navigate to the next page in history.
Usage
await page.goForward();
await page.goForward(options);
Arguments
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<null | Response>#

goto
Added before v1.9 
Returns the main resource response. In case of multiple redirects, the navigation will resolve with the first non-redirect response.
The method will throw an error if:
there's an SSL error (e.g. in case of self-signed certificates).
target URL is invalid.
the timeout is exceeded during navigation.
the remote server does not respond or is unreachable.
the main resource failed to load.
The method will not throw an error when any valid HTTP status code is returned by the remote server, including 404 "Not Found" and 500 "Internal Server Error". The status code for such responses can be retrieved by calling response.status().
NOTE
The method either throws an error or returns a main resource response. The only exceptions are navigation to about:blank or navigation to the same URL with a different hash, which would succeed and return null.
NOTE
Headless mode doesn't support navigation to a PDF document. See the upstream issue.
Usage
await page.goto(url);
await page.goto(url, options);
Arguments
url string#
URL to navigate page to. The url should include scheme, e.g. https://. When a baseURL via the context options was provided and the passed URL is a path, it gets merged via the new URL() constructor.
options Object (optional)
referer string (optional)#
Referer header value. If provided it will take preference over the referer header value set by page.setExtraHTTPHeaders().
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<null | Response>#

isClosed
Added before v1.9 
Indicates that the page has been closed.
Usage
page.isClosed();
Returns
boolean#

locator
Added in: v1.14 
The method returns an element locator that can be used to perform actions on this page / frame. Locator is resolved to the element immediately before performing an action, so a series of actions on the same locator can in fact be performed on different DOM elements. That would happen if the DOM structure between those actions has changed.
Learn more about locators.
Usage
page.locator(selector);
page.locator(selector, options);
Arguments
selector string#
A selector to use when resolving DOM element.
options Object (optional)
has Locator (optional)#
Narrows down the results of the method to those which contain elements matching this relative locator. For example, article that has text=Playwright matches <article><div>Playwright</div></article>.
Inner locator must be relative to the outer locator and is queried starting with the outer locator match, not the document root. For example, you can find content that has div in <article><content><div>Playwright</div></content></article>. However, looking for content that has article div will fail, because the inner locator must be relative and should not use any elements outside the content.
Note that outer and inner locators must belong to the same frame. Inner locator must not contain FrameLocators.
hasNot Locator (optional) Added in: v1.33#
Matches elements that do not contain an element that matches an inner locator. Inner locator is queried against the outer one. For example, article that does not have div matches <article><span>Playwright</span></article>.
Note that outer and inner locators must belong to the same frame. Inner locator must not contain FrameLocators.
hasNotText string | RegExp (optional) Added in: v1.33#
Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element. When passed a string, matching is case-insensitive and searches for a substring.
hasText string | RegExp (optional)#
Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a string, matching is case-insensitive and searches for a substring. For example, "Playwright" matches <article><div>Playwright</div></article>.
Returns
Locator#

mainFrame
Added before v1.9 
The page's main frame. Page is guaranteed to have a main frame which persists during navigations.
Usage
page.mainFrame();
Returns
Frame#

opener
Added before v1.9 
Returns the opener for popup pages and null for others. If the opener has been closed already the returns null.
Usage
await page.opener();
Returns
Promise<null | Page>#

pause
Added in: v1.9 
Pauses script execution. Playwright will stop executing the script and wait for the user to either press 'Resume' button in the page overlay or to call playwright.resume() in the DevTools console.
User can inspect selectors or perform manual steps while paused. Resume will continue running the original script from the place it was paused.
NOTE
This method requires Playwright to be started in a headed mode, with a falsy headless option.
Usage
await page.pause();
Returns
Promise<void>#

pdf
Added before v1.9 
Returns the PDF buffer.
page.pdf() generates a pdf of the page with print css media. To generate a pdf with screen media, call page.emulateMedia() before calling page.pdf():
NOTE
By default, page.pdf() generates a pdf with modified colors for printing. Use the -webkit-print-color-adjust property to force rendering of exact colors.
Usage
// Generates a PDF with 'screen' media type.
await page.emulateMedia({ media: 'screen' });
await page.pdf({ path: 'page.pdf' });
The width, height, and margin options accept values labeled with units. Unlabeled values are treated as pixels.
A few examples:
page.pdf({width: 100}) - prints with width set to 100 pixels
page.pdf({width: '100px'}) - prints with width set to 100 pixels
page.pdf({width: '10cm'}) - prints with width set to 10 centimeters.
All possible units are:
px - pixel
in - inch
cm - centimeter
mm - millimeter
The format options are:
Letter: 8.5in x 11in
Legal: 8.5in x 14in
Tabloid: 11in x 17in
Ledger: 17in x 11in
A0: 33.1in x 46.8in
A1: 23.4in x 33.1in
A2: 16.54in x 23.4in
A3: 11.7in x 16.54in
A4: 8.27in x 11.7in
A5: 5.83in x 8.27in
A6: 4.13in x 5.83in
NOTE
headerTemplate and footerTemplate markup have the following limitations: > 1. Script tags inside templates are not evaluated. > 2. Page styles are not visible inside templates.
Arguments
options Object (optional)
displayHeaderFooter boolean (optional)#
Display header and footer. Defaults to false.
footerTemplate string (optional)#
HTML template for the print footer. Should use the same format as the headerTemplate.
format string (optional)#
Paper format. If set, takes priority over width or height options. Defaults to 'Letter'.
headerTemplate string (optional)#
HTML template for the print header. Should be valid HTML markup with following classes used to inject printing values into them:
'date' formatted print date
'title' document title
'url' document location
'pageNumber' current page number
'totalPages' total pages in the document
height string | number (optional)#
Paper height, accepts values labeled with units.
landscape boolean (optional)#
Paper orientation. Defaults to false.
margin Object (optional)#
top string | number (optional)
Top margin, accepts values labeled with units. Defaults to 0.
right string | number (optional)
Right margin, accepts values labeled with units. Defaults to 0.
bottom string | number (optional)
Bottom margin, accepts values labeled with units. Defaults to 0.
left string | number (optional)
Left margin, accepts values labeled with units. Defaults to 0.
Paper margins, defaults to none.
outline boolean (optional) Added in: v1.42#
Whether or not to embed the document outline into the PDF. Defaults to false.
pageRanges string (optional)#
Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the empty string, which means print all pages.
path string (optional)#
The file path to save the PDF to. If path is a relative path, then it is resolved relative to the current working directory. If no path is provided, the PDF won't be saved to the disk.
preferCSSPageSize boolean (optional)#
Give any CSS @page size declared in the page priority over what is declared in width and height or format options. Defaults to false, which will scale the content to fit the paper size.
printBackground boolean (optional)#
Print background graphics. Defaults to false.
scale number (optional)#
Scale of the webpage rendering. Defaults to 1. Scale amount must be between 0.1 and 2.
tagged boolean (optional) Added in: v1.42#
Whether or not to generate tagged (accessible) PDF. Defaults to false.
width string | number (optional)#
Paper width, accepts values labeled with units.
Returns
Promise<Buffer>#

reload
Added before v1.9 
This method reloads the current page, in the same way as if the user had triggered a browser refresh. Returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the last redirect.
Usage
await page.reload();
await page.reload(options);
Arguments
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<null | Response>#

removeAllListeners
Added in: v1.47 
Removes all the listeners of the given type (or all registered listeners if no type given). Allows to wait for async listeners to complete or to ignore subsequent errors from these listeners.
Usage
page.on('request', async request => {
 const response = await request.response();
 const body = await response.body();
 console.log(body.byteLength);
});
await page.goto('https://playwright.dev', { waitUntil: 'domcontentloaded' });
// Waits for all the reported 'request' events to resolve.
await page.removeAllListeners('request', { behavior: 'wait' });
Arguments
type string (optional)#
options Object (optional)
behavior "wait" | "ignoreErrors" | "default" (optional)#
Specifies whether to wait for already running listeners and what to do if they throw errors:
'default' - do not wait for current listener calls (if any) to finish, if the listener throws, it may result in unhandled error
'wait' - wait for current listener calls (if any) to finish
'ignoreErrors' - do not wait for current listener calls (if any) to finish, all errors thrown by the listeners after removal are silently caught
Returns
Promise<void>#

removeLocatorHandler
Added in: v1.44 
Removes all locator handlers added by page.addLocatorHandler() for a specific locator.
Usage
await page.removeLocatorHandler(locator);
Arguments
locator Locator#
Locator passed to page.addLocatorHandler().
Returns
Promise<void>#

requestGC
Added in: v1.48 
Request the page to perform garbage collection. Note that there is no guarantee that all unreachable objects will be collected.
This is useful to help detect memory leaks. For example, if your page has a large object 'suspect' that might be leaked, you can check that it does not leak by using a WeakRef.
// 1. In your page, save a WeakRef for the "suspect".
await page.evaluate(() => globalThis.suspectWeakRef = new WeakRef(suspect));
// 2. Request garbage collection.
await page.requestGC();
// 3. Check that weak ref does not deref to the original object.
expect(await page.evaluate(() => !globalThis.suspectWeakRef.deref())).toBe(true);
Usage
await page.requestGC();
Returns
Promise<void>#

route
Added before v1.9 
Routing provides the capability to modify network requests that are made by a page.
Once routing is enabled, every request matching the url pattern will stall unless it's continued, fulfilled or aborted.
NOTE
The handler will only be called for the first url if the response is a redirect.
NOTE
page.route() will not intercept requests intercepted by Service Worker. See this issue. We recommend disabling Service Workers when using request interception by setting serviceWorkers to 'block'.
NOTE
page.route() will not intercept the first request of a popup page. Use browserContext.route() instead.
Usage
An example of a naive handler that aborts all image requests:
const page = await browser.newPage();
await page.route('**/*.{png,jpg,jpeg}', route => route.abort());
await page.goto('https://example.com');
await browser.close();
or the same snippet using a regex pattern instead:
const page = await browser.newPage();
await page.route(/(\.png$)|(\.jpg$)/, route => route.abort());
await page.goto('https://example.com');
await browser.close();
It is possible to examine the request to decide the route action. For example, mocking all requests that contain some post data, and leaving all other requests as is:
await page.route('/api/**', async route => {
 if (route.request().postData().includes('my-string'))
   await route.fulfill({ body: 'mocked-data' });
 else
   await route.continue();
});
Page routes take precedence over browser context routes (set up with browserContext.route()) when request matches both handlers.
To remove a route with its handler you can use page.unroute().
NOTE
Enabling routing disables http cache.
Arguments
url string | RegExp | function(URL):boolean#
A glob pattern, regex pattern, or predicate that receives a URL to match during routing. If baseURL is set in the context options and the provided URL is a string that does not start with *, it is resolved using the new URL() constructor.
handler function(Route, Request):Promise<Object> | Object#
handler function to route the request.
options Object (optional)
times number (optional) Added in: v1.15#
How often a route should be used. By default it will be used every time.
Returns
Promise<void>#

routeFromHAR
Added in: v1.23 
If specified the network requests that are made in the page will be served from the HAR file. Read more about Replaying from HAR.
Playwright will not serve requests intercepted by Service Worker from the HAR file. See this issue. We recommend disabling Service Workers when using request interception by setting serviceWorkers to 'block'.
Usage
await page.routeFromHAR(har);
await page.routeFromHAR(har, options);
Arguments
har string#
Path to a HAR file with prerecorded network data. If path is a relative path, then it is resolved relative to the current working directory.
options Object (optional)
notFound "abort" | "fallback" (optional)#
If set to 'abort' any request not found in the HAR file will be aborted.
If set to 'fallback' missing requests will be sent to the network.
Defaults to abort.
update boolean (optional)#
If specified, updates the given HAR with the actual network information instead of serving from file. The file is written to disk when browserContext.close() is called.
updateContent "embed" | "attach" (optional) Added in: v1.32#
Optional setting to control resource content management. If attach is specified, resources are persisted as separate files or entries in the ZIP archive. If embed is specified, content is stored inline the HAR file.
updateMode "full" | "minimal" (optional) Added in: v1.32#
When set to minimal, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to minimal.
url string | RegExp (optional)#
A glob pattern, regular expression or predicate to match the request URL. Only requests with URL matching the pattern will be served from the HAR file. If not specified, all requests are served from the HAR file.
Returns
Promise<void>#

routeWebSocket
Added in: v1.48 
This method allows to modify websocket connections that are made by the page.
Note that only WebSockets created after this method was called will be routed. It is recommended to call this method before navigating the page.
Usage
Below is an example of a simple mock that responds to a single message. See WebSocketRoute for more details and examples.
await page.routeWebSocket('/ws', ws => {
 ws.onMessage(message => {
   if (message === 'request')
     ws.send('response');
 });
});
Arguments
url string | RegExp | function(URL):boolean#
Only WebSockets with the url matching this pattern will be routed. A string pattern can be relative to the baseURL context option.
handler function(WebSocketRoute):Promise<Object> | Object#
Handler function to route the WebSocket.
Returns
Promise<void>#

screenshot
Added before v1.9 
Returns the buffer with the captured screenshot.
Usage
await page.screenshot();
await page.screenshot(options);
Arguments
options Object (optional)
animations "disabled" | "allow" (optional)#
When set to "disabled", stops CSS animations, CSS transitions and Web Animations. Animations get different treatment depending on their duration:
finite animations are fast-forwarded to completion, so they'll fire transitionend event.
infinite animations are canceled to initial state, and then played over after the screenshot.
Defaults to "allow" that leaves animations untouched.
caret "hide" | "initial" (optional)#
When set to "hide", screenshot will hide text caret. When set to "initial", text caret behavior will not be changed. Defaults to "hide".
clip Object (optional)#
x number
x-coordinate of top-left corner of clip area
y number
y-coordinate of top-left corner of clip area
width number
width of clipping area
height number
height of clipping area
An object which specifies clipping of the resulting image.
fullPage boolean (optional)#
When true, takes a screenshot of the full scrollable page, instead of the currently visible viewport. Defaults to false.
mask Array<Locator> (optional)#
Specify locators that should be masked when the screenshot is taken. Masked elements will be overlaid with a pink box #FF00FF (customized by maskColor) that completely covers its bounding box. The mask is also applied to invisible elements, see Matching only visible elements to disable that.
maskColor string (optional) Added in: v1.35#
Specify the color of the overlay box for masked elements, in CSS color format. Default color is pink #FF00FF.
omitBackground boolean (optional)#
Hides default white background and allows capturing screenshots with transparency. Not applicable to jpeg images. Defaults to false.
path string (optional)#
The file path to save the image to. The screenshot type will be inferred from file extension. If path is a relative path, then it is resolved relative to the current working directory. If no path is provided, the image won't be saved to the disk.
quality number (optional)#
The quality of the image, between 0-100. Not applicable to png images.
scale "css" | "device" (optional)#
When set to "css", screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using "device" option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.
Defaults to "device".
style string (optional) Added in: v1.41#
Text of the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies to the inner frames.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
type "png" | "jpeg" (optional)#
Specify screenshot type, defaults to png.
Returns
Promise<Buffer>#

setContent
Added before v1.9 
This method internally calls document.write(), inheriting all its specific characteristics and behaviors.
Usage
await page.setContent(html);
await page.setContent(html, options);
Arguments
html string#
HTML markup to assign to the page.
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<void>#

setDefaultNavigationTimeout
Added before v1.9 
This setting will change the default maximum navigation time for the following methods and related shortcuts:
page.goBack()
page.goForward()
page.goto()
page.reload()
page.setContent()
page.waitForNavigation()
page.waitForURL()
NOTE
page.setDefaultNavigationTimeout() takes priority over page.setDefaultTimeout(), browserContext.setDefaultTimeout() and browserContext.setDefaultNavigationTimeout().
Usage
page.setDefaultNavigationTimeout(timeout);
Arguments
timeout number#
Maximum navigation time in milliseconds

setDefaultTimeout
Added before v1.9 
This setting will change the default maximum time for all the methods accepting timeout option.
NOTE
page.setDefaultNavigationTimeout() takes priority over page.setDefaultTimeout().
Usage
page.setDefaultTimeout(timeout);
Arguments
timeout number#
Maximum time in milliseconds. Pass 0 to disable timeout.

setExtraHTTPHeaders
Added before v1.9 
The extra HTTP headers will be sent with every request the page initiates.
NOTE
page.setExtraHTTPHeaders() does not guarantee the order of headers in the outgoing requests.
Usage
await page.setExtraHTTPHeaders(headers);
Arguments
headers Object<string, string>#
An object containing additional HTTP headers to be sent with every request. All header values must be strings.
Returns
Promise<void>#

setViewportSize
Added before v1.9 
In the case of multiple pages in a single browser, each page can have its own viewport size. However, browser.newContext() allows to set viewport size (and more) for all pages in the context at once.
page.setViewportSize() will resize the page. A lot of websites don't expect phones to change size, so you should set the viewport size before navigating to the page. page.setViewportSize() will also reset screen size, use browser.newContext() with screen and viewport parameters if you need better control of these properties.
Usage
const page = await browser.newPage();
await page.setViewportSize({
 width: 640,
 height: 480,
});
await page.goto('https://example.com');
Arguments
viewportSize Object#
width number
page width in pixels.
height number
page height in pixels.
Returns
Promise<void>#

title
Added before v1.9 
Returns the page's title.
Usage
await page.title();
Returns
Promise<string>#

unroute
Added before v1.9 
Removes a route created with page.route(). When handler is not specified, removes all routes for the url.
Usage
await page.unroute(url);
await page.unroute(url, handler);
Arguments
url string | RegExp | function(URL):boolean#
A glob pattern, regex pattern or predicate receiving URL to match while routing.
handler function(Route, Request):Promise<Object> | Object (optional)#
Optional handler function to route the request.
Returns
Promise<void>#

unrouteAll
Added in: v1.41 
Removes all routes created with page.route() and page.routeFromHAR().
Usage
await page.unrouteAll();
await page.unrouteAll(options);
Arguments
options Object (optional)
behavior "wait" | "ignoreErrors" | "default" (optional)#
Specifies whether to wait for already running handlers and what to do if they throw errors:
'default' - do not wait for current handler calls (if any) to finish, if unrouted handler throws, it may result in unhandled error
'wait' - wait for current handler calls (if any) to finish
'ignoreErrors' - do not wait for current handler calls (if any) to finish, all errors thrown by the handlers after unrouting are silently caught
Returns
Promise<void>#

url
Added before v1.9 
Usage
page.url();
Returns
string#

video
Added before v1.9 
Video object associated with this page.
Usage
page.video();
Returns
null | Video#

viewportSize
Added before v1.9 
Usage
page.viewportSize();
Returns
null | Object#
width number
page width in pixels.
height number
page height in pixels.

waitForEvent
Added before v1.9 
Waits for event to fire and passes its value into the predicate function. Returns when the predicate returns truthy value. Will throw an error if the page is closed before the event is fired. Returns the event data value.
Usage
// Start waiting for download before clicking. Note no await.
const downloadPromise = page.waitForEvent('download');
await page.getByText('Download file').click();
const download = await downloadPromise;
Arguments
event string#
Event name, same one typically passed into *.on(event).
optionsOrPredicate function | Object (optional)#
predicate function
Receives the event data and resolves to truthy value when the waiting should resolve.
timeout number (optional)
Maximum time to wait for in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Either a predicate that receives an event or an options object. Optional.
options Object (optional)
predicate function (optional)#
Receives the event data and resolves to truthy value when the waiting should resolve.
Returns
Promise<Object>#

waitForFunction
Added before v1.9 
Returns when the pageFunction returns a truthy value. It resolves to a JSHandle of the truthy value.
Usage
The page.waitForFunction() can be used to observe viewport size change:
const { webkit } = require('playwright');  // Or 'chromium' or 'firefox'.

(async () => {
 const browser = await webkit.launch();
 const page = await browser.newPage();
 const watchDog = page.waitForFunction(() => window.innerWidth < 100);
 await page.setViewportSize({ width: 50, height: 50 });
 await watchDog;
 await browser.close();
})();
To pass an argument to the predicate of page.waitForFunction() function:
const selector = '.foo';
await page.waitForFunction(selector => !!document.querySelector(selector), selector);
Arguments
pageFunction function | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
options Object (optional)
polling number | "raf" (optional)#
If polling is 'raf', then pageFunction is constantly executed in requestAnimationFrame callback. If polling is a number, then it is treated as an interval in milliseconds at which the function would be executed. Defaults to raf.
timeout number (optional)#
Maximum time to wait for in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<JSHandle>#

waitForLoadState
Added before v1.9 
Returns when the required load state has been reached.
This resolves when the page reaches a required load state, load by default. The navigation must have been committed when this method is called. If current document has already reached the required state, resolves immediately.
NOTE
Most of the time, this method is not needed because Playwright auto-waits before every action.
Usage
await page.getByRole('button').click(); // Click triggers navigation.
await page.waitForLoadState(); // The promise resolves after 'load' event.
const popupPromise = page.waitForEvent('popup');
await page.getByRole('button').click(); // Click triggers a popup.
const popup = await popupPromise;
await popup.waitForLoadState('domcontentloaded'); // Wait for the 'DOMContentLoaded' event.
console.log(await popup.title()); // Popup is ready to use.
Arguments
state "load" | "domcontentloaded" | "networkidle" (optional)#
Optional load state to wait for, defaults to load. If the state has been already reached while loading current document, the method resolves immediately. Can be one of:
'load' - wait for the load event to be fired.
'domcontentloaded' - wait for the DOMContentLoaded event to be fired.
'networkidle' - DISCOURAGED wait until there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

waitForRequest
Added before v1.9 
Waits for the matching request and returns it. See waiting for event for more details about events.
Usage
// Start waiting for request before clicking. Note no await.
const requestPromise = page.waitForRequest('https://example.com/resource');
await page.getByText('trigger request').click();
const request = await requestPromise;

// Alternative way with a predicate. Note no await.
const requestPromise = page.waitForRequest(request =>
 request.url() === 'https://example.com' && request.method() === 'GET',
);
await page.getByText('trigger request').click();
const request = await requestPromise;
Arguments
urlOrPredicate string | RegExp | function(Request):boolean | Promise<boolean>#
Request URL string, regex or predicate receiving Request object.
options Object (optional)
timeout number (optional)#
Maximum wait time in milliseconds, defaults to 30 seconds, pass 0 to disable the timeout. The default value can be changed by using the page.setDefaultTimeout() method.
Returns
Promise<Request>#

waitForResponse
Added before v1.9 
Returns the matched response. See waiting for event for more details about events.
Usage
// Start waiting for response before clicking. Note no await.
const responsePromise = page.waitForResponse('https://example.com/resource');
await page.getByText('trigger response').click();
const response = await responsePromise;

// Alternative way with a predicate. Note no await.
const responsePromise = page.waitForResponse(response =>
 response.url() === 'https://example.com' && response.status() === 200
     && response.request().method() === 'GET'
);
await page.getByText('trigger response').click();
const response = await responsePromise;
Arguments
urlOrPredicate string | RegExp | function(Response):boolean | Promise<boolean>#
Request URL string, regex or predicate receiving Response object. When a baseURL via the context options was provided and the passed URL is a path, it gets merged via the new URL() constructor.
options Object (optional)
timeout number (optional)#
Maximum wait time in milliseconds, defaults to 30 seconds, pass 0 to disable the timeout. The default value can be changed by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<Response>#

waitForURL
Added in: v1.11 
Waits for the main frame to navigate to the given URL.
Usage
await page.click('a.delayed-navigation'); // Clicking the link will indirectly cause a navigation
await page.waitForURL('**/target.html');
Arguments
url string | RegExp | function(URL):boolean#
A glob pattern, regex pattern or predicate receiving URL to match while waiting for the navigation. Note that if the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly equal to the string.
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<void>#

workers
Added before v1.9 
This method returns all of the dedicated WebWorkers associated with the page.
NOTE
This does not contain ServiceWorkers
Usage
page.workers();
Returns
Array<Worker>#

Properties
clock
Added in: v1.45 
Playwright has ability to mock clock and passage of time.
Usage
page.clock
Type
Clock

coverage
Added before v1.9 
NOTE
Only available for Chromium atm.
Browser-specific Coverage implementation. See Coverage for more details.
Usage
page.coverage
Type
Coverage

keyboard
Added before v1.9 
Usage
page.keyboard
Type
Keyboard

mouse
Added before v1.9 
Usage
page.mouse
Type
Mouse

request
Added in: v1.16 
API testing helper associated with this page. This method returns the same instance as browserContext.request on the page's context. See browserContext.request for more details.
Usage
page.request
Type
APIRequestContext

touchscreen
Added before v1.9 
Usage
page.touchscreen
Type
Touchscreen

Events
on('close')
Added before v1.9 
Emitted when the page closes.
Usage
page.on('close', data => {});
Event data
Page

on('console')
Added before v1.9 
Emitted when JavaScript within the page calls one of console API methods, e.g. console.log or console.dir.
The arguments passed into console.log are available on the ConsoleMessage event handler argument.
Usage
page.on('console', async msg => {
 const values = [];
 for (const arg of msg.args())
   values.push(await arg.jsonValue());
 console.log(...values);
});
await page.evaluate(() => console.log('hello', 5, { foo: 'bar' }));
Event data
ConsoleMessage

on('crash')
Added before v1.9 
Emitted when the page crashes. Browser pages might crash if they try to allocate too much memory. When the page crashes, ongoing and subsequent operations will throw.
The most common way to deal with crashes is to catch an exception:
try {
 // Crash might happen during a click.
 await page.click('button');
 // Or while waiting for an event.
 await page.waitForEvent('popup');
} catch (e) {
 // When the page crashes, exception message contains 'crash'.
}
Usage
page.on('crash', data => {});
Event data
Page

on('dialog')
Added before v1.9 
Emitted when a JavaScript dialog appears, such as alert, prompt, confirm or beforeunload. Listener must either dialog.accept() or dialog.dismiss() the dialog - otherwise the page will freeze waiting for the dialog, and actions like click will never finish.
Usage
page.on('dialog', dialog => dialog.accept());
NOTE
When no page.on('dialog') or browserContext.on('dialog') listeners are present, all dialogs are automatically dismissed.
Event data
Dialog

on('domcontentloaded')
Added in: v1.9 
Emitted when the JavaScript DOMContentLoaded event is dispatched.
Usage
page.on('domcontentloaded', data => {});
Event data
Page

on('download')
Added before v1.9 
Emitted when attachment download started. User can access basic file operations on downloaded content via the passed Download instance.
Usage
page.on('download', data => {});
Event data
Download

on('filechooser')
Added in: v1.9 
Emitted when a file chooser is supposed to appear, such as after clicking the <input type=file>. Playwright can respond to it via setting the input files using fileChooser.setFiles() that can be uploaded after that.
page.on('filechooser', async fileChooser => {
 await fileChooser.setFiles(path.join(__dirname, '/tmp/myfile.pdf'));
});
Usage
page.on('filechooser', data => {});
Event data
FileChooser

on('frameattached')
Added in: v1.9 
Emitted when a frame is attached.
Usage
page.on('frameattached', data => {});
Event data
Frame

on('framedetached')
Added in: v1.9 
Emitted when a frame is detached.
Usage
page.on('framedetached', data => {});
Event data
Frame

on('framenavigated')
Added in: v1.9 
Emitted when a frame is navigated to a new url.
Usage
page.on('framenavigated', data => {});
Event data
Frame

on('load')
Added before v1.9 
Emitted when the JavaScript load event is dispatched.
Usage
page.on('load', data => {});
Event data
Page

on('pageerror')
Added in: v1.9 
Emitted when an uncaught exception happens within the page.
// Log all uncaught errors to the terminal
page.on('pageerror', exception => {
 console.log(`Uncaught exception: "${exception}"`);
});

// Navigate to a page with an exception.
await page.goto('data:text/html,<script>throw new Error("Test")</script>');
Usage
page.on('pageerror', data => {});
Event data
Error

on('popup')
Added before v1.9 
Emitted when the page opens a new tab or window. This event is emitted in addition to the browserContext.on('page'), but only for popups relevant to this page.
The earliest moment that page is available is when it has navigated to the initial url. For example, when opening a popup with window.open('http://example.com'), this event will fire when the network request to "http://example.com" is done and its response has started loading in the popup. If you would like to route/listen to this network request, use browserContext.route() and browserContext.on('request') respectively instead of similar methods on the Page.
// Start waiting for popup before clicking. Note no await.
const popupPromise = page.waitForEvent('popup');
await page.getByText('open the popup').click();
const popup = await popupPromise;
console.log(await popup.evaluate('location.href'));
NOTE
Use page.waitForLoadState() to wait until the page gets to a particular state (you should not need it in most cases).
Usage
page.on('popup', data => {});
Event data
Page

on('request')
Added before v1.9 
Emitted when a page issues a request. The request object is read-only. In order to intercept and mutate requests, see page.route() or browserContext.route().
Usage
page.on('request', data => {});
Event data
Request

on('requestfailed')
Added in: v1.9 
Emitted when a request fails, for example by timing out.
page.on('requestfailed', request => {
 console.log(request.url() + ' ' + request.failure().errorText);
});
NOTE
HTTP Error responses, such as 404 or 503, are still successful responses from HTTP standpoint, so request will complete with page.on('requestfinished') event and not with page.on('requestfailed'). A request will only be considered failed when the client cannot get an HTTP response from the server, e.g. due to network error net::ERR_FAILED.
Usage
page.on('requestfailed', data => {});
Event data
Request

on('requestfinished')
Added in: v1.9 
Emitted when a request finishes successfully after downloading the response body. For a successful response, the sequence of events is request, response and requestfinished.
Usage
page.on('requestfinished', data => {});
Event data
Request

on('response')
Added before v1.9 
Emitted when response status and headers are received for a request. For a successful response, the sequence of events is request, response and requestfinished.
Usage
page.on('response', data => {});
Event data
Response

on('websocket')
Added in: v1.9 
Emitted when WebSocket request is sent.
Usage
page.on('websocket', data => {});
Event data
WebSocket

on('worker')
Added before v1.9 
Emitted when a dedicated WebWorker is spawned by the page.
Usage
page.on('worker', data => {});
Event data
Worker

Deprecated
$
Added in: v1.9 
DISCOURAGED
Use locator-based page.locator() instead. Read more about locators.
The method finds an element matching the specified selector within the page. If no elements match the selector, the return value resolves to null. To wait for an element on the page, use locator.waitFor().
Usage
await page.$(selector);
await page.$(selector, options);
Arguments
selector string#
A selector to query for.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
Returns
Promise<null | ElementHandle>#

$$
Added in: v1.9 
DISCOURAGED
Use locator-based page.locator() instead. Read more about locators.
The method finds all elements matching the specified selector within the page. If no elements match the selector, the return value resolves to [].
Usage
await page.$$(selector);
Arguments
selector string#
A selector to query for.
Returns
Promise<Array<ElementHandle>>#

$eval
Added in: v1.9 
DISCOURAGED
This method does not wait for the element to pass actionability checks and therefore can lead to the flaky tests. Use locator.evaluate(), other Locator helper methods or web-first assertions instead.
The method finds an element matching the specified selector within the page and passes it as a first argument to pageFunction. If no elements match the selector, the method throws an error. Returns the value of pageFunction.
If pageFunction returns a Promise, then page.$eval() would wait for the promise to resolve and return its value.
Usage
const searchValue = await page.$eval('#search', el => el.value);
const preloadHref = await page.$eval('link[rel=preload]', el => el.href);
const html = await page.$eval('.main-container', (e, suffix) => e.outerHTML + suffix, 'hello');
// In TypeScript, this example requires an explicit type annotation (HTMLLinkElement) on el:
const preloadHrefTS = await page.$eval('link[rel=preload]', (el: HTMLLinkElement) => el.href);
Arguments
selector string#
A selector to query for.
pageFunction function(Element) | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
Returns
Promise<Serializable>#

$$eval
Added in: v1.9 
DISCOURAGED
In most cases, locator.evaluateAll(), other Locator helper methods and web-first assertions do a better job.
The method finds all elements matching the specified selector within the page and passes an array of matched elements as a first argument to pageFunction. Returns the result of pageFunction invocation.
If pageFunction returns a Promise, then page.$$eval() would wait for the promise to resolve and return its value.
Usage
const divCounts = await page.$$eval('div', (divs, min) => divs.length >= min, 10);
Arguments
selector string#
A selector to query for.
pageFunction function(Array<Element>) | string#
Function to be evaluated in the page context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<Serializable>#

accessibility
Added before v1.9 
DEPRECATED
This property is discouraged. Please use other libraries such as Axe if you need to test page accessibility. See our Node.js guide for integration with Axe.
Usage
page.accessibility
Type
Accessibility

check
Added before v1.9 
DISCOURAGED
Use locator-based locator.check() instead. Read more about locators.
This method checks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Ensure that matched element is a checkbox or a radio input. If not, this method throws. If the element is already checked, this method returns immediately.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now checked. If not, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await page.check(selector);
await page.check(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional) Added in: v1.11#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

click
Added before v1.9 
DISCOURAGED
Use locator-based locator.click() instead. Read more about locators.
This method clicks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element, or the specified position.
Wait for initiated navigations to either succeed or fail, unless noWaitAfter option is set.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await page.click(selector);
await page.click(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
button "left" | "right" | "middle" (optional)#
Defaults to left.
clickCount number (optional)#
defaults to 1. See UIEvent.detail.
delay number (optional)#
Time to wait between mousedown and mouseup in milliseconds. Defaults to 0.
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option will default to true in the future.
Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating to inaccessible pages. Defaults to false.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#

dblclick
Added before v1.9 
DISCOURAGED
Use locator-based locator.dblclick() instead. Read more about locators.
This method double clicks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to double click in the center of the element, or the specified position.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
NOTE
page.dblclick() dispatches two click events and a single dblclick event.
Usage
await page.dblclick(selector);
await page.dblclick(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
button "left" | "right" | "middle" (optional)#
Defaults to left.
delay number (optional)#
Time to wait between mousedown and mouseup in milliseconds. Defaults to 0.
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#

dispatchEvent
Added before v1.9 
DISCOURAGED
Use locator-based locator.dispatchEvent() instead. Read more about locators.
The snippet below dispatches the click event on the element. Regardless of the visibility state of the element, click is dispatched. This is equivalent to calling element.click().
Usage
await page.dispatchEvent('button#submit', 'click');
Under the hood, it creates an instance of an event based on the given type, initializes it with eventInit properties and dispatches it on the element. Events are composed, cancelable and bubble by default.
Since eventInit is event-specific, please refer to the events documentation for the lists of initial properties:
DeviceMotionEvent
DeviceOrientationEvent
DragEvent
Event
FocusEvent
KeyboardEvent
MouseEvent
PointerEvent
TouchEvent
WheelEvent
You can also specify JSHandle as the property value if you want live objects to be passed into the event:
// Note you can only create DataTransfer in Chromium and Firefox
const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
await page.dispatchEvent('#source', 'dragstart', { dataTransfer });
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
type string#
DOM event type: "click", "dragstart", etc.
eventInit EvaluationArgument (optional)#
Optional event-specific initialization properties.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

fill
Added before v1.9 
DISCOURAGED
Use locator-based locator.fill() instead. Read more about locators.
This method waits for an element matching selector, waits for actionability checks, focuses the element, fills it and triggers an input event after filling. Note that you can pass an empty string to clear the input field.
If the target element is not an <input>, <textarea> or [contenteditable] element, this method throws an error. However, if the element is inside the <label> element that has an associated control, the control will be filled instead.
To send fine-grained keyboard events, use locator.pressSequentially().
Usage
await page.fill(selector, value);
await page.fill(selector, value, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
value string#
Value to fill for the <input>, <textarea> or [contenteditable] element.
options Object (optional)
force boolean (optional) Added in: v1.13#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

focus
Added before v1.9 
DISCOURAGED
Use locator-based locator.focus() instead. Read more about locators.
This method fetches an element with selector and focuses it. If there's no element matching selector, the method waits until a matching element appears in the DOM.
Usage
await page.focus(selector);
await page.focus(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

getAttribute
Added before v1.9 
DISCOURAGED
Use locator-based locator.getAttribute() instead. Read more about locators.
Returns element attribute value.
Usage
await page.getAttribute(selector, name);
await page.getAttribute(selector, name, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
name string#
Attribute name to get the value for.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<null | string>#

hover
Added before v1.9 
DISCOURAGED
Use locator-based locator.hover() instead. Read more about locators.
This method hovers over an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to hover over the center of the element, or the specified position.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await page.hover(selector);
await page.hover(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional) Added in: v1.28#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#

innerHTML
Added before v1.9 
DISCOURAGED
Use locator-based locator.innerHTML() instead. Read more about locators.
Returns element.innerHTML.
Usage
await page.innerHTML(selector);
await page.innerHTML(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<string>#

innerText
Added before v1.9 
DISCOURAGED
Use locator-based locator.innerText() instead. Read more about locators.
Returns element.innerText.
Usage
await page.innerText(selector);
await page.innerText(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<string>#

inputValue
Added in: v1.13 
DISCOURAGED
Use locator-based locator.inputValue() instead. Read more about locators.
Returns input.value for the selected <input> or <textarea> or <select> element.
Throws for non-input elements. However, if the element is inside the <label> element that has an associated control, returns the value of the control.
Usage
await page.inputValue(selector);
await page.inputValue(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<string>#

isChecked
Added before v1.9 
DISCOURAGED
Use locator-based locator.isChecked() instead. Read more about locators.
Returns whether the element is checked. Throws if the element is not a checkbox or radio input.
Usage
await page.isChecked(selector);
await page.isChecked(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

isDisabled
Added before v1.9 
DISCOURAGED
Use locator-based locator.isDisabled() instead. Read more about locators.
Returns whether the element is disabled, the opposite of enabled.
Usage
await page.isDisabled(selector);
await page.isDisabled(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

isEditable
Added before v1.9 
DISCOURAGED
Use locator-based locator.isEditable() instead. Read more about locators.
Returns whether the element is editable.
Usage
await page.isEditable(selector);
await page.isEditable(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

isEnabled
Added before v1.9 
DISCOURAGED
Use locator-based locator.isEnabled() instead. Read more about locators.
Returns whether the element is enabled.
Usage
await page.isEnabled(selector);
await page.isEnabled(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<boolean>#

isHidden
Added before v1.9 
DISCOURAGED
Use locator-based locator.isHidden() instead. Read more about locators.
Returns whether the element is hidden, the opposite of visible. selector that does not match any elements is considered hidden.
Usage
await page.isHidden(selector);
await page.isHidden(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
DEPRECATED
This option is ignored. page.isHidden() does not wait for the element to become hidden and returns immediately.
Returns
Promise<boolean>#

isVisible
Added before v1.9 
DISCOURAGED
Use locator-based locator.isVisible() instead. Read more about locators.
Returns whether the element is visible. selector that does not match any elements is considered not visible.
Usage
await page.isVisible(selector);
await page.isVisible(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
DEPRECATED
This option is ignored. page.isVisible() does not wait for the element to become visible and returns immediately.
Returns
Promise<boolean>#

press
Added before v1.9 
DISCOURAGED
Use locator-based locator.press() instead. Read more about locators.
Focuses the element, and then uses keyboard.down() and keyboard.up().
key can specify the intended keyboardEvent.key value or a single character to generate the text for. A superset of the key values can be found here. Examples of the keys are:
F1 - F12, Digit0- Digit9, KeyA- KeyZ, Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape, ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight, ArrowUp, etc.
Following modification shortcuts are also supported: Shift, Control, Alt, Meta, ShiftLeft, ControlOrMeta. ControlOrMeta resolves to Control on Windows and Linux and to Meta on macOS.
Holding down Shift will type the text that corresponds to the key in the upper case.
If key is a single character, it is case-sensitive, so the values a and A will generate different respective texts.
Shortcuts such as key: "Control+o", key: "Control++ or key: "Control+Shift+T" are supported as well. When specified with the modifier, modifier is pressed and being held while the subsequent key is being pressed.
Usage
const page = await browser.newPage();
await page.goto('https://keycode.info');
await page.press('body', 'A');
await page.screenshot({ path: 'A.png' });
await page.press('body', 'ArrowLeft');
await page.screenshot({ path: 'ArrowLeft.png' });
await page.press('body', 'Shift+O');
await page.screenshot({ path: 'O.png' });
await browser.close();
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
key string#
Name of the key to press or a character to generate, such as ArrowLeft or a.
options Object (optional)
delay number (optional)#
Time to wait between keydown and keyup in milliseconds. Defaults to 0.
noWaitAfter boolean (optional)#
DEPRECATED
This option will default to true in the future.
Actions that initiate navigations are waiting for these navigations to happen and for pages to start loading. You can opt out of waiting via setting this flag. You would only need this option in the exceptional cases such as navigating to inaccessible pages. Defaults to false.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

selectOption
Added before v1.9 
DISCOURAGED
Use locator-based locator.selectOption() instead. Read more about locators.
This method waits for an element matching selector, waits for actionability checks, waits until all specified options are present in the <select> element and selects these options.
If the target element is not a <select> element, this method throws an error. However, if the element is inside the <label> element that has an associated control, the control will be used instead.
Returns the array of option values that have been successfully selected.
Triggers a change and input event once all the provided options have been selected.
Usage
// Single selection matching the value or label
page.selectOption('select#colors', 'blue');

// single selection matching the label
page.selectOption('select#colors', { label: 'Blue' });

// multiple selection
page.selectOption('select#colors', ['red', 'green', 'blue']);

Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
values null | string | ElementHandle | Array<string> | Object | Array<ElementHandle> | Array<Object>#
value string (optional)
Matches by option.value. Optional.
label string (optional)
Matches by option.label. Optional.
index number (optional)
Matches by the index. Optional.
Options to select. If the <select> has the multiple attribute, all matching options are selected, otherwise only the first option matching one of the passed options is selected. String values are matching both values and labels. Option is considered matching if all specified properties match.
options Object (optional)
force boolean (optional) Added in: v1.13#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<Array<string>>#

setChecked
Added in: v1.15 
DISCOURAGED
Use locator-based locator.setChecked() instead. Read more about locators.
This method checks or unchecks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Ensure that matched element is a checkbox or a radio input. If not, this method throws.
If the element already has the right checked state, this method returns immediately.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now checked or unchecked. If not, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await page.setChecked(selector, checked);
await page.setChecked(selector, checked, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
checked boolean#
Whether to check or uncheck the checkbox.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional)#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional)#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

setInputFiles
Added before v1.9 
DISCOURAGED
Use locator-based locator.setInputFiles() instead. Read more about locators.
Sets the value of the file input to these file paths or files. If some of the filePaths are relative paths, then they are resolved relative to the current working directory. For empty array, clears the selected files. For inputs with a [webkitdirectory] attribute, only a single directory path is supported.
This method expects selector to point to an input element. However, if the element is inside the <label> element that has an associated control, targets the control instead.
Usage
await page.setInputFiles(selector, files);
await page.setInputFiles(selector, files, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
files string | Array<string> | Object | Array<Object>#
name string
File name
mimeType string
File type
buffer Buffer
File content
options Object (optional)
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

tap
Added before v1.9 
DISCOURAGED
Use locator-based locator.tap() instead. Read more about locators.
This method taps an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.touchscreen to tap the center of the element, or the specified position.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
NOTE
page.tap() the method will throw if hasTouch option of the browser context is false.
Usage
await page.tap(selector);
await page.tap(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
modifiers Array<"Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift"> (optional)#
Modifier keys to press. Ensures that only these modifiers are pressed during the operation, and then restores current modifiers back. If not specified, currently pressed modifiers are used. "ControlOrMeta" resolves to "Control" on Windows and Linux and to "Meta" on macOS.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional)#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it. Note that keyboard modifiers will be pressed regardless of trial to allow testing elements which are only visible when those keys are pressed.
Returns
Promise<void>#

textContent
Added before v1.9 
DISCOURAGED
Use locator-based locator.textContent() instead. Read more about locators.
Returns element.textContent.
Usage
await page.textContent(selector);
await page.textContent(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<null | string>#

type
Added before v1.9 
DEPRECATED
In most cases, you should use locator.fill() instead. You only need to press keys one by one if there is special keyboard handling on the page - in this case use locator.pressSequentially().
Sends a keydown, keypress/input, and keyup event for each character in the text. page.type can be used to send fine-grained keyboard events. To fill values in form fields, use page.fill().
To press a special key, like Control or ArrowDown, use keyboard.press().
Usage
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
text string#
A text to type into a focused element.
options Object (optional)
delay number (optional)#
Time to wait between key presses in milliseconds. Defaults to 0.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<void>#

uncheck
Added before v1.9 
DISCOURAGED
Use locator-based locator.uncheck() instead. Read more about locators.
This method unchecks an element matching selector by performing the following steps:
Find an element matching selector. If there is none, wait until a matching element is attached to the DOM.
Ensure that matched element is a checkbox or a radio input. If not, this method throws. If the element is already unchecked, this method returns immediately.
Wait for actionability checks on the matched element, unless force option is set. If the element is detached during the checks, the whole action is retried.
Scroll the element into view if needed.
Use page.mouse to click in the center of the element.
Ensure that the element is now unchecked. If not, this method throws.
When all steps combined have not finished during the specified timeout, this method throws a TimeoutError. Passing zero timeout disables this.
Usage
await page.uncheck(selector);
await page.uncheck(selector, options);
Arguments
selector string#
A selector to search for an element. If there are multiple elements satisfying the selector, the first will be used.
options Object (optional)
force boolean (optional)#
Whether to bypass the actionability checks. Defaults to false.
noWaitAfter boolean (optional)#
DEPRECATED
This option has no effect.
This option has no effect.
position Object (optional) Added in: v1.11#
x number
y number
A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of the element.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
trial boolean (optional) Added in: v1.11#
When set, this method only performs the actionability checks and skips the action. Defaults to false. Useful to wait until the element is ready for the action without performing it.
Returns
Promise<void>#

waitForNavigation
Added before v1.9 
DEPRECATED
This method is inherently racy, please use page.waitForURL() instead.
Waits for the main frame navigation and returns the main resource response. In case of multiple redirects, the navigation will resolve with the response of the last redirect. In case of navigation to a different anchor or navigation due to History API usage, the navigation will resolve with null.
Usage
This resolves when the page navigates to a new URL or reloads. It is useful for when you run code which will indirectly cause the page to navigate. e.g. The click target has an onclick handler that triggers navigation from a setTimeout. Consider this example:
// Start waiting for navigation before clicking. Note no await.
const navigationPromise = page.waitForNavigation();
await page.getByText('Navigate after timeout').click();
await navigationPromise;
NOTE
Usage of the History API to change the URL is considered a navigation.
Arguments
options Object (optional)
timeout number (optional)#
Maximum operation time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via navigationTimeout option in the config, or by using the browserContext.setDefaultNavigationTimeout(), browserContext.setDefaultTimeout(), page.setDefaultNavigationTimeout() or page.setDefaultTimeout() methods.
url string | RegExp | function(URL):boolean (optional)#
A glob pattern, regex pattern or predicate receiving URL to match while waiting for the navigation. Note that if the parameter is a string without wildcard characters, the method will wait for navigation to URL that is exactly equal to the string.
waitUntil "load" | "domcontentloaded" | "networkidle" | "commit" (optional)#
When to consider operation succeeded, defaults to load. Events can be either:
'domcontentloaded' - consider operation to be finished when the DOMContentLoaded event is fired.
'load' - consider operation to be finished when the load event is fired.
'networkidle' - DISCOURAGED consider operation to be finished when there are no network connections for at least 500 ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
'commit' - consider operation to be finished when network response is received and the document started loading.
Returns
Promise<null | Response>#

waitForSelector
Added before v1.9 
DISCOURAGED
Use web assertions that assert visibility or a locator-based locator.waitFor() instead. Read more about locators.
Returns when element specified by selector satisfies state option. Returns null if waiting for hidden or detached.
NOTE
Playwright automatically waits for element to be ready before performing an action. Using Locator objects and web-first assertions makes the code wait-for-selector-free.
Wait for the selector to satisfy state option (either appear/disappear from dom, or become visible/hidden). If at the moment of calling the method selector already satisfies the condition, the method will return immediately. If the selector doesn't satisfy the condition for the timeout milliseconds, the function will throw.
Usage
This method works across navigations:
const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.

(async () => {
 const browser = await chromium.launch();
 const page = await browser.newPage();
 for (const currentURL of ['https://google.com', 'https://bbc.com']) {
   await page.goto(currentURL);
   const element = await page.waitForSelector('img');
   console.log('Loaded image: ' + await element.getAttribute('src'));
 }
 await browser.close();
})();
Arguments
selector string#
A selector to query for.
options Object (optional)
state "attached" | "detached" | "visible" | "hidden" (optional)#
Defaults to 'visible'. Can be either:
'attached' - wait for element to be present in DOM.
'detached' - wait for element to not be present in DOM.
'visible' - wait for element to have non-empty bounding box and no visibility:hidden. Note that element without any content or with display:none has an empty bounding box and is not considered visible.
'hidden' - wait for element to be either detached from DOM, or have an empty bounding box or visibility:hidden. This is opposite to the 'visible' option.
strict boolean (optional) Added in: v1.14#
When true, the call requires selector to resolve to a single element. If given selector resolves to more than one element, the call throws an exception.
timeout number (optional)#
Maximum time in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Returns
Promise<null | ElementHandle>#

waitForTimeout
Added before v1.9 
DISCOURAGED
Never wait for timeout in production. Tests that wait for time are inherently flaky. Use Locator actions and web assertions that wait automatically.
Waits for the given timeout in milliseconds.
Note that page.waitForTimeout() should only be used for debugging. Tests using the timer in production are going to be flaky. Use signals such as network events, selectors becoming visible and others instead.
Usage
// wait for 1 second
await page.waitForTimeout(1000);
Arguments
timeout number#
A timeout to wait for
Returns
Promise<void>#
Previous
Mouse
Next
Request
Methods
addInitScript
addLocatorHandler
addScriptTag
addStyleTag
bringToFront
close
content
context
dragAndDrop
emulateMedia
evaluate
evaluateHandle
exposeBinding
exposeFunction
frame
frameLocator
frames
getByAltText
getByLabel
getByPlaceholder
getByRole
getByTestId
getByText
getByTitle
goBack
goForward
goto
isClosed
locator
mainFrame
opener
pause
pdf
reload
removeAllListeners
removeLocatorHandler
requestGC
route
routeFromHAR
routeWebSocket
screenshot
setContent
setDefaultNavigationTimeout
setDefaultTimeout
setExtraHTTPHeaders
setViewportSize
title
unroute
unrouteAll
url
video
viewportSize
waitForEvent
waitForFunction
waitForLoadState
waitForRequest
waitForResponse
waitForURL
workers
Properties
clock
coverage
keyboard
mouse
request
touchscreen
Events
on('close')
on('console')
on('crash')
on('dialog')
on('domcontentloaded')
on('download')
on('filechooser')
on('frameattached')
on('framedetached')
on('framenavigated')
on('load')
on('pageerror')
on('popup')
on('request')
on('requestfailed')
on('requestfinished')
on('response')
on('websocket')
on('worker')
Deprecated
$
$$
$eval
$$eval
accessibility
check
click
dblclick
dispatchEvent
fill
focus
getAttribute
hover
innerHTML
innerText
inputValue
isChecked
isDisabled
isEditable
isEnabled
isHidden
isVisible
press
selectOption
setChecked
setInputFiles
tap
textContent
type
uncheck
waitForNavigation
waitForSelector
waitForTimeout
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Request
Whenever the page sends a request for a network resource the following sequence of events are emitted by Page:
page.on('request') emitted when the request is issued by the page.
page.on('response') emitted when/if the response status and headers are received for the request.
page.on('requestfinished') emitted when the response body is downloaded and the request is complete.
If request fails at some point, then instead of 'requestfinished' event (and possibly instead of 'response' event), the page.on('requestfailed') event is emitted.
note
HTTP Error responses, such as 404 or 503, are still successful responses from HTTP standpoint, so request will complete with 'requestfinished' event.
If request gets a 'redirect' response, the request is successfully finished with the requestfinished event, and a new request is issued to a redirected url.

Methods
allHeaders
Added in: v1.15 
An object with all the request HTTP headers associated with this request. The header names are lower-cased.
Usage
await request.allHeaders();
Returns
Promise<Object<string, string>>#

failure
Added before v1.9 
The method returns null unless this request has failed, as reported by requestfailed event.
Usage
Example of logging of all the failed requests:
page.on('requestfailed', request => {
 console.log(request.url() + ' ' + request.failure().errorText);
});
Returns
null | Object#
errorText string
Human-readable error message, e.g. 'net::ERR_FAILED'.

frame
Added before v1.9 
Returns the Frame that initiated this request.
Usage
const frameUrl = request.frame().url();
Returns
Frame#
Details
Note that in some cases the frame is not available, and this method will throw.
When request originates in the Service Worker. You can use request.serviceWorker() to check that.
When navigation request is issued before the corresponding frame is created. You can use request.isNavigationRequest() to check that.
Here is an example that handles all the cases:
if (request.serviceWorker())
 console.log(`request ${request.url()} from a service worker`);
else if (request.isNavigationRequest())
 console.log(`request ${request.url()} is a navigation request`);
else
 console.log(`request ${request.url()} from a frame ${request.frame().url()}`);

headerValue
Added in: v1.15 
Returns the value of the header matching the name. The name is case-insensitive.
Usage
await request.headerValue(name);
Arguments
name string#
Name of the header.
Returns
Promise<null | string>#

headers
Added before v1.9 
An object with the request HTTP headers. The header names are lower-cased. Note that this method does not return security-related headers, including cookie-related ones. You can use request.allHeaders() for complete list of headers that include cookie information.
Usage
request.headers();
Returns
Object<string, string>#

headersArray
Added in: v1.15 
An array with all the request HTTP headers associated with this request. Unlike request.allHeaders(), header names are NOT lower-cased. Headers with multiple entries, such as Set-Cookie, appear in the array multiple times.
Usage
await request.headersArray();
Returns
Promise<Array<Object>>#
name string
Name of the header.
value string
Value of the header.

isNavigationRequest
Added before v1.9 
Whether this request is driving frame's navigation.
Some navigation requests are issued before the corresponding frame is created, and therefore do not have request.frame() available.
Usage
request.isNavigationRequest();
Returns
boolean#

method
Added before v1.9 
Request's method (GET, POST, etc.)
Usage
request.method();
Returns
string#

postData
Added before v1.9 
Request's post body, if any.
Usage
request.postData();
Returns
null | string#

postDataBuffer
Added before v1.9 
Request's post body in a binary form, if any.
Usage
request.postDataBuffer();
Returns
null | Buffer#

postDataJSON
Added before v1.9 
Returns parsed request's body for form-urlencoded and JSON as a fallback if any.
When the response is application/x-www-form-urlencoded then a key/value object of the values will be returned. Otherwise it will be parsed as JSON.
Usage
request.postDataJSON();
Returns
null | Serializable#

redirectedFrom
Added before v1.9 
Request that was redirected by the server to this one, if any.
When the server responds with a redirect, Playwright creates a new Request object. The two requests are connected by redirectedFrom() and redirectedTo() methods. When multiple server redirects has happened, it is possible to construct the whole redirect chain by repeatedly calling redirectedFrom().
Usage
For example, if the website http://example.com redirects to https://example.com:
const response = await page.goto('http://example.com');
console.log(response.request().redirectedFrom().url()); // 'http://example.com'
If the website https://google.com has no redirects:
const response = await page.goto('https://google.com');
console.log(response.request().redirectedFrom()); // null
Returns
null | Request#

redirectedTo
Added before v1.9 
New request issued by the browser if the server responded with redirect.
Usage
This method is the opposite of request.redirectedFrom():
console.log(request.redirectedFrom().redirectedTo() === request); // true
Returns
null | Request#

resourceType
Added before v1.9 
Contains the request's resource type as it was perceived by the rendering engine. ResourceType will be one of the following: document, stylesheet, image, media, font, script, texttrack, xhr, fetch, eventsource, websocket, manifest, other.
Usage
request.resourceType();
Returns
string#

response
Added before v1.9 
Returns the matching Response object, or null if the response was not received due to error.
Usage
await request.response();
Returns
Promise<null | Response>#

serviceWorker
Added in: v1.24 
The Service Worker that is performing the request.
Usage
request.serviceWorker();
Returns
null | Worker#
Details
This method is Chromium only. It's safe to call when using other browsers, but it will always be null.
Requests originated in a Service Worker do not have a request.frame() available.

sizes
Added in: v1.15 
Returns resource size information for given request.
Usage
await request.sizes();
Returns
Promise<Object>#
requestBodySize number
Size of the request body (POST data payload) in bytes. Set to 0 if there was no body.
requestHeadersSize number
Total number of bytes from the start of the HTTP request message until (and including) the double CRLF before the body.
responseBodySize number
Size of the received response body (encoded) in bytes.
responseHeadersSize number
Total number of bytes from the start of the HTTP response message until (and including) the double CRLF before the body.

timing
Added before v1.9 
Returns resource timing information for given request. Most of the timing values become available upon the response, responseEnd becomes available when request finishes. Find more information at Resource Timing API.
Usage
const requestFinishedPromise = page.waitForEvent('requestfinished');
await page.goto('http://example.com');
const request = await requestFinishedPromise;
console.log(request.timing());
Returns
Object#
startTime number
Request start time in milliseconds elapsed since January 1, 1970 00:00:00 UTC
domainLookupStart number
Time immediately before the browser starts the domain name lookup for the resource. The value is given in milliseconds relative to startTime, -1 if not available.
domainLookupEnd number
Time immediately after the browser starts the domain name lookup for the resource. The value is given in milliseconds relative to startTime, -1 if not available.
connectStart number
Time immediately before the user agent starts establishing the connection to the server to retrieve the resource. The value is given in milliseconds relative to startTime, -1 if not available.
secureConnectionStart number
Time immediately before the browser starts the handshake process to secure the current connection. The value is given in milliseconds relative to startTime, -1 if not available.
connectEnd number
Time immediately before the user agent starts establishing the connection to the server to retrieve the resource. The value is given in milliseconds relative to startTime, -1 if not available.
requestStart number
Time immediately before the browser starts requesting the resource from the server, cache, or local resource. The value is given in milliseconds relative to startTime, -1 if not available.
responseStart number
Time immediately after the browser receives the first byte of the response from the server, cache, or local resource. The value is given in milliseconds relative to startTime, -1 if not available.
responseEnd number
Time immediately after the browser receives the last byte of the resource or immediately before the transport connection is closed, whichever comes first. The value is given in milliseconds relative to startTime, -1 if not available.

url
Added before v1.9 
URL of the request.
Usage
request.url();
Returns
string#
Response
Response class represents responses which are received by page.

Methods
allHeaders
Added in: v1.15 
An object with all the response HTTP headers associated with this response.
Usage
await response.allHeaders();
Returns
Promise<Object<string, string>>#

body
Added before v1.9 
Returns the buffer with response body.
Usage
await response.body();
Returns
Promise<Buffer>#

finished
Added before v1.9 
Waits for this response to finish, returns always null.
Usage
await response.finished();
Returns
Promise<null | Error>#

frame
Added before v1.9 
Returns the Frame that initiated this response.
Usage
response.frame();
Returns
Frame#

fromServiceWorker
Added in: v1.23 
Indicates whether this Response was fulfilled by a Service Worker's Fetch Handler (i.e. via FetchEvent.respondWith).
Usage
response.fromServiceWorker();
Returns
boolean#

headerValue
Added in: v1.15 
Returns the value of the header matching the name. The name is case-insensitive. If multiple headers have the same name (except set-cookie), they are returned as a list separated by , . For set-cookie, the \n separator is used. If no headers are found, null is returned.
Usage
await response.headerValue(name);
Arguments
name string#
Name of the header.
Returns
Promise<null | string>#

headerValues
Added in: v1.15 
Returns all values of the headers matching the name, for example set-cookie. The name is case-insensitive.
Usage
await response.headerValues(name);
Arguments
name string#
Name of the header.
Returns
Promise<Array<string>>#

headers
Added before v1.9 
An object with the response HTTP headers. The header names are lower-cased. Note that this method does not return security-related headers, including cookie-related ones. You can use response.allHeaders() for complete list of headers that include cookie information.
Usage
response.headers();
Returns
Object<string, string>#

headersArray
Added in: v1.15 
An array with all the request HTTP headers associated with this response. Unlike response.allHeaders(), header names are NOT lower-cased. Headers with multiple entries, such as Set-Cookie, appear in the array multiple times.
Usage
await response.headersArray();
Returns
Promise<Array<Object>>#
name string
Name of the header.
value string
Value of the header.

json
Added before v1.9 
Returns the JSON representation of response body.
This method will throw if the response body is not parsable via JSON.parse.
Usage
await response.json();
Returns
Promise<Serializable>#

ok
Added before v1.9 
Contains a boolean stating whether the response was successful (status in the range 200-299) or not.
Usage
response.ok();
Returns
boolean#

request
Added before v1.9 
Returns the matching Request object.
Usage
response.request();
Returns
Request#

securityDetails
Added in: v1.13 
Returns SSL and other security information.
Usage
await response.securityDetails();
Returns
Promise<null | Object>#
issuer string (optional)
Common Name component of the Issuer field. from the certificate. This should only be used for informational purposes. Optional.
protocol string (optional)
The specific TLS protocol used. (e.g. TLS 1.3). Optional.
subjectName string (optional)
Common Name component of the Subject field from the certificate. This should only be used for informational purposes. Optional.
validFrom number (optional)
Unix timestamp (in seconds) specifying when this cert becomes valid. Optional.
validTo number (optional)
Unix timestamp (in seconds) specifying when this cert becomes invalid. Optional.

serverAddr
Added in: v1.13 
Returns the IP address and port of the server.
Usage
await response.serverAddr();
Returns
Promise<null | Object>#
ipAddress string
IPv4 or IPV6 address of the server.
port number

status
Added before v1.9 
Contains the status code of the response (e.g., 200 for a success).
Usage
response.status();
Returns
number#

statusText
Added before v1.9 
Contains the status text of the response (e.g. usually an "OK" for a success).
Usage
response.statusText();
Returns
string#

text
Added before v1.9 
Returns the text representation of response body.
Usage
await response.text();
Returns
Promise<string>#

url
Added before v1.9 
Contains the URL of the response.
Usage
response.url();
Returns
string#
Previous
Request
Next
Route
Methods
allHeaders
body
finished
frame
fromServiceWorker
headerValue
headerValues
headers
headersArray
json
ok
request
securityDetails
serverAddr
status
statusText
text
url
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Route
Whenever a network route is set up with page.route() or browserContext.route(), the Route object allows to handle the route.
Learn more about networking.

Methods
abort
Added before v1.9 
Aborts the route's request.
Usage
await route.abort();
await route.abort(errorCode);
Arguments
errorCode string (optional)#
Optional error code. Defaults to failed, could be one of the following:
'aborted' - An operation was aborted (due to user action)
'accessdenied' - Permission to access a resource, other than the network, was denied
'addressunreachable' - The IP address is unreachable. This usually means that there is no route to the specified host or network.
'blockedbyclient' - The client chose to block the request.
'blockedbyresponse' - The request failed because the response was delivered along with requirements which are not met ('X-Frame-Options' and 'Content-Security-Policy' ancestor checks, for instance).
'connectionaborted' - A connection timed out as a result of not receiving an ACK for data sent.
'connectionclosed' - A connection was closed (corresponding to a TCP FIN).
'connectionfailed' - A connection attempt failed.
'connectionrefused' - A connection attempt was refused.
'connectionreset' - A connection was reset (corresponding to a TCP RST).
'internetdisconnected' - The Internet connection has been lost.
'namenotresolved' - The host name could not be resolved.
'timedout' - An operation timed out.
'failed' - A generic failure occurred.
Returns
Promise<void>#

continue
Added before v1.9 
Sends route's request to the network with optional overrides.
Usage
await page.route('**/*', async (route, request) => {
 // Override headers
 const headers = {
   ...request.headers(),
   foo: 'foo-value', // set "foo" header
   bar: undefined, // remove "bar" header
 };
 await route.continue({ headers });
});
Arguments
options Object (optional)
headers Object<string, string> (optional)#
If set changes the request HTTP headers. Header values will be converted to a string.
method string (optional)#
If set changes the request method (e.g. GET or POST).
postData string | Buffer | Serializable (optional)#
If set changes the post data of request.
url string (optional)#
If set changes the request URL. New URL must have same protocol as original one.
Returns
Promise<void>#
Details
The headers option applies to both the routed request and any redirects it initiates. However, url, method, and postData only apply to the original request and are not carried over to redirected requests.
route.continue() will immediately send the request to the network, other matching handlers won't be invoked. Use route.fallback() If you want next matching handler in the chain to be invoked.
WARNING
The Cookie header cannot be overridden using this method. If a value is provided, it will be ignored, and the cookie will be loaded from the browser's cookie store. To set custom cookies, use browserContext.addCookies().

fallback
Added in: v1.23 
Continues route's request with optional overrides. The method is similar to route.continue() with the difference that other matching handlers will be invoked before sending the request.
Usage
When several routes match the given pattern, they run in the order opposite to their registration. That way the last registered route can always override all the previous ones. In the example below, request will be handled by the bottom-most handler first, then it'll fall back to the previous one and in the end will be aborted by the first registered route.
await page.route('**/*', async route => {
 // Runs last.
 await route.abort();
});
await page.route('**/*', async route => {
 // Runs second.
 await route.fallback();
});
await page.route('**/*', async route => {
 // Runs first.
 await route.fallback();
});
Registering multiple routes is useful when you want separate handlers to handle different kinds of requests, for example API calls vs page resources or GET requests vs POST requests as in the example below.
// Handle GET requests.
await page.route('**/*', async route => {
 if (route.request().method() !== 'GET') {
   await route.fallback();
   return;
 }
 // Handling GET only.
 // ...
});


// Handle POST requests.
await page.route('**/*', async route => {
 if (route.request().method() !== 'POST') {
   await route.fallback();
   return;
 }
 // Handling POST only.
 // ...
});
One can also modify request while falling back to the subsequent handler, that way intermediate route handler can modify url, method, headers and postData of the request.
await page.route('**/*', async (route, request) => {
 // Override headers
 const headers = {
   ...request.headers(),
   foo: 'foo-value', // set "foo" header
   bar: undefined, // remove "bar" header
 };
 await route.fallback({ headers });
});
Use route.continue() to immediately send the request to the network, other matching handlers won't be invoked in that case.
Arguments
options Object (optional)
headers Object<string, string> (optional)#
If set changes the request HTTP headers. Header values will be converted to a string.
method string (optional)#
If set changes the request method (e.g. GET or POST).
postData string | Buffer | Serializable (optional)#
If set changes the post data of request.
url string (optional)#
If set changes the request URL. New URL must have same protocol as original one. Changing the URL won't affect the route matching, all the routes are matched using the original request URL.
Returns
Promise<void>#

fetch
Added in: v1.29 
Performs the request and fetches result without fulfilling it, so that the response could be modified and then fulfilled.
Usage
await page.route('https://dog.ceo/api/breeds/list/all', async route => {
 const response = await route.fetch();
 const json = await response.json();
 json.message['big_red_dog'] = [];
 await route.fulfill({ response, json });
});
Arguments
options Object (optional)
headers Object<string, string> (optional)#
If set changes the request HTTP headers. Header values will be converted to a string.
maxRedirects number (optional) Added in: v1.31#
Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is exceeded. Defaults to 20. Pass 0 to not follow redirects.
maxRetries number (optional) Added in: v1.46#
Maximum number of times network errors should be retried. Currently only ECONNRESET error is retried. Does not retry based on HTTP response codes. An error will be thrown if the limit is exceeded. Defaults to 0 - no retries.
method string (optional)#
If set changes the request method (e.g. GET or POST).
postData string | Buffer | Serializable (optional)#
Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string and content-type header will be set to application/json if not explicitly set. Otherwise the content-type header will be set to application/octet-stream if not explicitly set.
timeout number (optional) Added in: v1.33#
Request timeout in milliseconds. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
url string (optional)#
If set changes the request URL. New URL must have same protocol as original one.
Returns
Promise<APIResponse>#
Details
Note that headers option will apply to the fetched request as well as any redirects initiated by it. If you want to only apply headers to the original request, but not to redirects, look into route.continue() instead.

fulfill
Added before v1.9 
Fulfills route's request with given response.
Usage
An example of fulfilling all requests with 404 responses:
await page.route('**/*', async route => {
 await route.fulfill({
   status: 404,
   contentType: 'text/plain',
   body: 'Not Found!'
 });
});
An example of serving static file:
await page.route('**/xhr_endpoint', route => route.fulfill({ path: 'mock_data.json' }));
Arguments
options Object (optional)
body string | Buffer (optional)#
Response body.
contentType string (optional)#
If set, equals to setting Content-Type response header.
headers Object<string, string> (optional)#
Response headers. Header values will be converted to a string.
json Serializable (optional) Added in: v1.29#
JSON response. This method will set the content type to application/json if not set.
path string (optional)#
File path to respond with. The content type will be inferred from file extension. If path is a relative path, then it is resolved relative to the current working directory.
response APIResponse (optional) Added in: v1.15#
APIResponse to fulfill route's request with. Individual fields of the response (such as headers) can be overridden using fulfill options.
status number (optional)#
Response status code, defaults to 200.
Returns
Promise<void>#

request
Added before v1.9 
A request to be routed.
Usage
route.request();
Returns
Request#
Previous
Response
Next
Selectors
Methods
abort
continue
fallback
fetch
fulfill
request
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Selectors
Selectors can be used to install custom selector engines. See extensibility for more information.

Methods
register
Added before v1.9 
Selectors must be registered before creating the page.
Usage
An example of registering selector engine that queries elements based on a tag name:
const { selectors, firefox } = require('@playwright/test');  // Or 'chromium' or 'webkit'.


(async () => {
 // Must be a function that evaluates to a selector engine instance.
 const createTagNameEngine = () => ({
   // Returns the first element matching given selector in the root's subtree.
   query(root, selector) {
     return root.querySelector(selector);
   },


   // Returns all elements matching given selector in the root's subtree.
   queryAll(root, selector) {
     return Array.from(root.querySelectorAll(selector));
   }
 });


 // Register the engine. Selectors will be prefixed with "tag=".
 await selectors.register('tag', createTagNameEngine);


 const browser = await firefox.launch();
 const page = await browser.newPage();
 await page.setContent(`<div><button>Click me</button></div>`);


 // Use the selector prefixed with its name.
 const button = page.locator('tag=button');
 // We can combine it with built-in locators.
 await page.locator('tag=div').getByText('Click me').click();
 // Can use it in any methods supporting selectors.
 const buttonCount = await page.locator('tag=button').count();


 await browser.close();
})();
Arguments
name string#
Name that is used in selectors as a prefix, e.g. {name: 'foo'} enables foo=myselectorbody selectors. May only contain [a-zA-Z0-9_] characters.
script function | string | Object#
path string (optional)
Path to the JavaScript file. If path is a relative path, then it is resolved relative to the current working directory. Optional.
content string (optional)
Raw script content. Optional.
Script that evaluates to a selector engine instance. The script is evaluated in the page context.
options Object (optional)
contentScript boolean (optional)#
Whether to run this selector engine in isolated JavaScript environment. This environment has access to the same DOM, but not any JavaScript objects from the frame's scripts. Defaults to false. Note that running as a content script is not guaranteed when this engine is used together with other registered engines.
Returns
Promise<void>#

setTestIdAttribute
Added in: v1.27 
Defines custom attribute name to be used in page.getByTestId(). data-testid is used by default.
Usage
selectors.setTestIdAttribute(attributeName);
Arguments
attributeName string#
Test id attribute name.
Previous
Route
Next
TimeoutError
Methods
register
setTestIdAttribute
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
TimeoutError
extends: Error
TimeoutError is emitted whenever certain operations are terminated due to timeout, e.g. locator.waitFor() or browserType.launch().
const playwright = require('playwright');


(async () => {
 const browser = await playwright.chromium.launch();
 const context = await browser.newContext();
 const page = await context.newPage();
 try {
   await page.locator('text=Foo').click({
     timeout: 100,
   });
 } catch (error) {
   if (error instanceof playwright.errors.TimeoutError)
     console.log('Timeout!');
 }
 await browser.close();
})();
Previous
Selectors
Next
Touchscreen
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Touchscreen
The Touchscreen class operates in main-frame CSS pixels relative to the top-left corner of the viewport. Methods on the touchscreen can only be used in browser contexts that have been initialized with hasTouch set to true.
This class is limited to emulating tap gestures. For examples of other gestures simulated by manually dispatching touch events, see the emulating legacy touch events page.

Methods
tap
Added before v1.9 
Dispatches a touchstart and touchend event with a single touch at the position (x,y).
NOTE
page.tap() the method will throw if hasTouch option of the browser context is false.
Usage
await touchscreen.tap(x, y);
Arguments
x number#
X coordinate relative to the main frame's viewport in CSS pixels.
y number#
Y coordinate relative to the main frame's viewport in CSS pixels.
Returns
Promise<void>#
Previous
TimeoutError
Next
Tracing
Methods
tap
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Tracing
API for collecting and saving Playwright traces. Playwright traces can be opened in Trace Viewer after Playwright script runs.
NOTE
You probably want to enable tracing in your config file instead of using context.tracing.
The context.tracing API captures browser operations and network activity, but it doesn't record test assertions (like expect calls). We recommend enabling tracing through Playwright Test configuration, which includes those assertions and provides a more complete trace for debugging test failures.
Start recording a trace before performing actions. At the end, stop tracing and save it to a file.
const browser = await chromium.launch();
const context = await browser.newContext();
await context.tracing.start({ screenshots: true, snapshots: true });
const page = await context.newPage();
await page.goto('https://playwright.dev');
expect(page.url()).toBe('https://playwright.dev');
await context.tracing.stop({ path: 'trace.zip' });

Methods
group
Added in: v1.49 
CAUTION
Use test.step instead when available.
Creates a new group within the trace, assigning any subsequent API calls to this group, until tracing.groupEnd() is called. Groups can be nested and will be visible in the trace viewer.
Usage
// use test.step instead
await test.step('Log in', async () => {
 // ...
});
Arguments
name string#
Group name shown in the trace viewer.
options Object (optional)
location Object (optional)#
file string
line number (optional)
column number (optional)
Specifies a custom location for the group to be shown in the trace viewer. Defaults to the location of the tracing.group() call.
Returns
Promise<void>#

groupEnd
Added in: v1.49 
Closes the last group created by tracing.group().
Usage
await tracing.groupEnd();
Returns
Promise<void>#

start
Added in: v1.12 
Start tracing.
NOTE
You probably want to enable tracing in your config file instead of using Tracing.start.
The context.tracing API captures browser operations and network activity, but it doesn't record test assertions (like expect calls). We recommend enabling tracing through Playwright Test configuration, which includes those assertions and provides a more complete trace for debugging test failures.
Usage
await context.tracing.start({ screenshots: true, snapshots: true });
const page = await context.newPage();
await page.goto('https://playwright.dev');
expect(page.url()).toBe('https://playwright.dev');
await context.tracing.stop({ path: 'trace.zip' });
Arguments
options Object (optional)
name string (optional)#
If specified, intermediate trace files are going to be saved into the files with the given name prefix inside the tracesDir directory specified in browserType.launch(). To specify the final trace zip file name, you need to pass path option to tracing.stop() instead.
screenshots boolean (optional)#
Whether to capture screenshots during tracing. Screenshots are used to build a timeline preview.
snapshots boolean (optional)#
If this option is true tracing will
capture DOM snapshot on every action
record network activity
sources boolean (optional) Added in: v1.17#
Whether to include source files for trace actions.
title string (optional) Added in: v1.17#
Trace name to be shown in the Trace Viewer.
Returns
Promise<void>#

startChunk
Added in: v1.15 
Start a new trace chunk. If you'd like to record multiple traces on the same BrowserContext, use tracing.start() once, and then create multiple trace chunks with tracing.startChunk() and tracing.stopChunk().
Usage
await context.tracing.start({ screenshots: true, snapshots: true });
const page = await context.newPage();
await page.goto('https://playwright.dev');


await context.tracing.startChunk();
await page.getByText('Get Started').click();
// Everything between startChunk and stopChunk will be recorded in the trace.
await context.tracing.stopChunk({ path: 'trace1.zip' });


await context.tracing.startChunk();
await page.goto('http://example.com');
// Save a second trace file with different actions.
await context.tracing.stopChunk({ path: 'trace2.zip' });
Arguments
options Object (optional)
name string (optional) Added in: v1.32#
If specified, intermediate trace files are going to be saved into the files with the given name prefix inside the tracesDir directory specified in browserType.launch(). To specify the final trace zip file name, you need to pass path option to tracing.stopChunk() instead.
title string (optional) Added in: v1.17#
Trace name to be shown in the Trace Viewer.
Returns
Promise<void>#

stop
Added in: v1.12 
Stop tracing.
Usage
await tracing.stop();
await tracing.stop(options);
Arguments
options Object (optional)
path string (optional)#
Export trace into the file with the given path.
Returns
Promise<void>#

stopChunk
Added in: v1.15 
Stop the trace chunk. See tracing.startChunk() for more details about multiple trace chunks.
Usage
await tracing.stopChunk();
await tracing.stopChunk(options);
Arguments
options Object (optional)
path string (optional)#
Export trace collected since the last tracing.startChunk() call into the file with the given path.
Returns
Promise<void>#
Previous
Touchscreen
Next
Video
Methods
group
groupEnd
start
startChunk
stop
stopChunk
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Video
When browser context is created with the recordVideo option, each page has a video object associated with it.
console.log(await page.video().path());

Methods
delete
Added in: v1.11 
Deletes the video file. Will wait for the video to finish if necessary.
Usage
await video.delete();
Returns
Promise<void>#

path
Added before v1.9 
Returns the file system path this video will be recorded to. The video is guaranteed to be written to the filesystem upon closing the browser context. This method throws when connected remotely.
Usage
await video.path();
Returns
Promise<string>#

saveAs
Added in: v1.11 
Saves the video to a user-specified path. It is safe to call this method while the video is still in progress, or after the page has closed. This method waits until the page is closed and the video is fully saved.
Usage
await video.saveAs(path);
Arguments
path string#
Path where the video should be saved.
Returns
Promise<void>#
Previous
Tracing
Next
WebError
Methods
delete
path
saveAs
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
WebError
WebError class represents an unhandled exception thrown in the page. It is dispatched via the browserContext.on('weberror') event.
// Log all uncaught errors to the terminal
context.on('weberror', webError => {
 console.log(`Uncaught exception: "${webError.error()}"`);
});


// Navigate to a page with an exception.
await page.goto('data:text/html,<script>throw new Error("Test")</script>');

Methods
error
Added in: v1.38 
Unhandled error that was thrown.
Usage
webError.error();
Returns
Error#

page
Added in: v1.38 
The page that produced this unhandled exception, if any.
Usage
webError.page();
Returns
null | Page#
Previous
Video
Next
WebSocket
Methods
error
page
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
WebSocket
The WebSocket class represents WebSocket connections within a page. It provides the ability to inspect and manipulate the data being transmitted and received.
If you want to intercept or modify WebSocket frames, consider using WebSocketRoute.

Methods
isClosed
Added before v1.9 
Indicates that the web socket has been closed.
Usage
webSocket.isClosed();
Returns
boolean#

url
Added before v1.9 
Contains the URL of the WebSocket.
Usage
webSocket.url();
Returns
string#

waitForEvent
Added before v1.9 
Waits for event to fire and passes its value into the predicate function. Returns when the predicate returns truthy value. Will throw an error if the webSocket is closed before the event is fired. Returns the event data value.
Usage
await webSocket.waitForEvent(event);
await webSocket.waitForEvent(event, optionsOrPredicate, options);
Arguments
event string#
Event name, same one would pass into webSocket.on(event).
optionsOrPredicate function | Object (optional)#
predicate function
Receives the event data and resolves to truthy value when the waiting should resolve.
timeout number (optional)
Maximum time to wait for in milliseconds. Defaults to 0 - no timeout. The default value can be changed via actionTimeout option in the config, or by using the browserContext.setDefaultTimeout() or page.setDefaultTimeout() methods.
Either a predicate that receives an event or an options object. Optional.
options Object (optional)
predicate function (optional)#
Receives the event data and resolves to truthy value when the waiting should resolve.
Returns
Promise<Object>#

Events
on('close')
Added before v1.9 
Fired when the websocket closes.
Usage
webSocket.on('close', data => {});
Event data
WebSocket

on('framereceived')
Added in: v1.9 
Fired when the websocket receives a frame.
Usage
webSocket.on('framereceived', data => {});
Event data
Object
payload string | Buffer
frame payload

on('framesent')
Added in: v1.9 
Fired when the websocket sends a frame.
Usage
webSocket.on('framesent', data => {});
Event data
Object
payload string | Buffer
frame payload

on('socketerror')
Added in: v1.9 
Fired when the websocket has an error.
Usage
webSocket.on('socketerror', data => {});
Event data
string
Previous
WebError
Next
WebSocketRoute
Methods
isClosed
url
waitForEvent
Events
on('close')
on('framereceived')
on('framesent')
on('socketerror')
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
WebSocketRoute
Whenever a WebSocket route is set up with page.routeWebSocket() or browserContext.routeWebSocket(), the WebSocketRoute object allows to handle the WebSocket, like an actual server would do.
Mocking
By default, the routed WebSocket will not connect to the server. This way, you can mock entire communication over the WebSocket. Here is an example that responds to a "request" with a "response".
await page.routeWebSocket('wss://example.com/ws', ws => {
 ws.onMessage(message => {
   if (message === 'request')
     ws.send('response');
 });
});
Since we do not call webSocketRoute.connectToServer() inside the WebSocket route handler, Playwright assumes that WebSocket will be mocked, and opens the WebSocket inside the page automatically.
Here is another example that handles JSON messages:
await page.routeWebSocket('wss://example.com/ws', ws => {
 ws.onMessage(message => {
   const json = JSON.parse(message);
   if (json.request === 'question')
     ws.send(JSON.stringify({ response: 'answer' }));
 });
});
Intercepting
Alternatively, you may want to connect to the actual server, but intercept messages in-between and modify or block them. Calling webSocketRoute.connectToServer() returns a server-side WebSocketRoute instance that you can send messages to, or handle incoming messages.
Below is an example that modifies some messages sent by the page to the server. Messages sent from the server to the page are left intact, relying on the default forwarding.
await page.routeWebSocket('/ws', ws => {
 const server = ws.connectToServer();
 ws.onMessage(message => {
   if (message === 'request')
     server.send('request2');
   else
     server.send(message);
 });
});
After connecting to the server, all messages are forwarded between the page and the server by default.
However, if you call webSocketRoute.onMessage() on the original route, messages from the page to the server will not be forwarded anymore, but should instead be handled by the handler.
Similarly, calling webSocketRoute.onMessage() on the server-side WebSocket will stop forwarding messages from the server to the page, and handler should take care of them.
The following example blocks some messages in both directions. Since it calls webSocketRoute.onMessage() in both directions, there is no automatic forwarding at all.
await page.routeWebSocket('/ws', ws => {
 const server = ws.connectToServer();
 ws.onMessage(message => {
   if (message !== 'blocked-from-the-page')
     server.send(message);
 });
 server.onMessage(message => {
   if (message !== 'blocked-from-the-server')
     ws.send(message);
 });
});

Methods
close
Added in: v1.48 
Closes one side of the WebSocket connection.
Usage
await webSocketRoute.close();
await webSocketRoute.close(options);
Arguments
options Object (optional)
code number (optional)#
Optional close code.
reason string (optional)#
Optional close reason.
Returns
Promise<void>#

connectToServer
Added in: v1.48 
By default, routed WebSocket does not connect to the server, so you can mock entire WebSocket communication. This method connects to the actual WebSocket server, and returns the server-side WebSocketRoute instance, giving the ability to send and receive messages from the server.
Once connected to the server:
Messages received from the server will be automatically forwarded to the WebSocket in the page, unless webSocketRoute.onMessage() is called on the server-side WebSocketRoute.
Messages sent by the WebSocket.send() call in the page will be automatically forwarded to the server, unless webSocketRoute.onMessage() is called on the original WebSocketRoute.
See examples at the top for more details.
Usage
webSocketRoute.connectToServer();
Returns
WebSocketRoute#

onClose
Added in: v1.48 
Allows to handle WebSocket.close.
By default, closing one side of the connection, either in the page or on the server, will close the other side. However, when webSocketRoute.onClose() handler is set up, the default forwarding of closure is disabled, and handler should take care of it.
Usage
webSocketRoute.onClose(handler);
Arguments
handler function(number | [undefined]):Promise<Object> | Object#
Function that will handle WebSocket closure. Received an optional close code and an optional close reason.

onMessage
Added in: v1.48 
This method allows to handle messages that are sent by the WebSocket, either from the page or from the server.
When called on the original WebSocket route, this method handles messages sent from the page. You can handle this messages by responding to them with webSocketRoute.send(), forwarding them to the server-side connection returned by webSocketRoute.connectToServer() or do something else.
Once this method is called, messages are not automatically forwarded to the server or to the page - you should do that manually by calling webSocketRoute.send(). See examples at the top for more details.
Calling this method again will override the handler with a new one.
Usage
webSocketRoute.onMessage(handler);
Arguments
handler function(string):Promise<Object> | Object#
Function that will handle messages.

send
Added in: v1.48 
Sends a message to the WebSocket. When called on the original WebSocket, sends the message to the page. When called on the result of webSocketRoute.connectToServer(), sends the message to the server. See examples at the top for more details.
Usage
webSocketRoute.send(message);
Arguments
message string | Buffer#
Message to send.

url
Added in: v1.48 
URL of the WebSocket created in the page.
Usage
webSocketRoute.url();
Returns
string#
Previous
WebSocket
Next
Worker
Methods
close
connectToServer
onClose
onMessage
send
url
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Worker
The Worker class represents a WebWorker. worker event is emitted on the page object to signal a worker creation. close event is emitted on the worker object when the worker is gone.
page.on('worker', worker => {
 console.log('Worker created: ' + worker.url());
 worker.on('close', worker => console.log('Worker destroyed: ' + worker.url()));
});


console.log('Current workers:');
for (const worker of page.workers())
 console.log('  ' + worker.url());

Methods
evaluate
Added before v1.9 
Returns the return value of pageFunction.
If the function passed to the worker.evaluate() returns a Promise, then worker.evaluate() would wait for the promise to resolve and return its value.
If the function passed to the worker.evaluate() returns a non-Serializable value, then worker.evaluate() returns undefined. Playwright also supports transferring some additional values that are not serializable by JSON: -0, NaN, Infinity, -Infinity.
Usage
await worker.evaluate(pageFunction);
await worker.evaluate(pageFunction, arg);
Arguments
pageFunction function | string#
Function to be evaluated in the worker context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<Serializable>#

evaluateHandle
Added before v1.9 
Returns the return value of pageFunction as a JSHandle.
The only difference between worker.evaluate() and worker.evaluateHandle() is that worker.evaluateHandle() returns JSHandle.
If the function passed to the worker.evaluateHandle() returns a Promise, then worker.evaluateHandle() would wait for the promise to resolve and return its value.
Usage
await worker.evaluateHandle(pageFunction);
await worker.evaluateHandle(pageFunction, arg);
Arguments
pageFunction function | string#
Function to be evaluated in the worker context.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<JSHandle>#

url
Added before v1.9 
Usage
worker.url();
Returns
string#

Events
on('close')
Added before v1.9 
Emitted when this dedicated WebWorker is terminated.
Usage
worker.on('close', data => {});
Event data
Worker
Previous
WebSocketRoute
Next
APIResponseAssertions
Methods
evaluate
evaluateHandle
url
Events
on('close')
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
APIResponseAssertions
The APIResponseAssertions class provides assertion methods that can be used to make assertions about the APIResponse in the tests.
import { test, expect } from '@playwright/test';


test('navigates to login', async ({ page }) => {
 // ...
 const response = await page.request.get('https://playwright.dev');
 await expect(response).toBeOK();
});

Methods
toBeOK
Added in: v1.18 
Ensures the response status code is within 200..299 range.
Usage
await expect(response).toBeOK();
Returns
Promise<void>#

Properties
not
Added in: v1.20 
Makes the assertion check for the opposite condition. For example, this code tests that the response status is not successful:
await expect(response).not.toBeOK();
Usage
expect(response).not
Type
APIResponseAssertions
Previous
Worker
Next
GenericAssertions
Methods
toBeOK
Properties
not
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
GenericAssertions
The GenericAssertions class provides assertion methods that can be used to make assertions about any values in the tests. A new instance of GenericAssertions is created by calling expect():
import { test, expect } from '@playwright/test';


test('assert a value', async ({ page }) => {
 const value = 1;
 expect(value).toBe(2);
});

Methods
any
Added in: v1.9 
expect.any() matches any object instance created from the constructor or a corresponding primitive type. Use it inside expect(value).toEqual() to perform pattern matching.
Usage
// Match instance of a class.
class Example {}
expect(new Example()).toEqual(expect.any(Example));


// Match any number.
expect({ prop: 1 }).toEqual({ prop: expect.any(Number) });


// Match any string.
expect('abc').toEqual(expect.any(String));
Arguments
constructor Function#
Constructor of the expected object like ExampleClass, or a primitive boxed type like Number.

anything
Added in: v1.9 
expect.anything() matches everything except null and undefined. Use it inside expect(value).toEqual() to perform pattern matching.
Usage
const value = { prop: 1 };
expect(value).toEqual({ prop: expect.anything() });
expect(value).not.toEqual({ otherProp: expect.anything() });

arrayContaining
Added in: v1.9 
expect.arrayContaining() matches an array that contains all of the elements in the expected array, in any order. Note that received array may be a superset of the expected array and contain some extra elements.
Use this method inside expect(value).toEqual() to perform pattern matching.
Usage
expect([1, 2, 3]).toEqual(expect.arrayContaining([3, 1]));
expect([1, 2, 3]).not.toEqual(expect.arrayContaining([1, 4]));
Arguments
expected Array<Object>#
Expected array that is a subset of the received value.

closeTo
Added in: v1.9 
Compares floating point numbers for approximate equality. Use this method inside expect(value).toEqual() to perform pattern matching. When just comparing two numbers, prefer expect(value).toBeCloseTo().
Usage
expect({ prop: 0.1 + 0.2 }).not.toEqual({ prop: 0.3 });
expect({ prop: 0.1 + 0.2 }).toEqual({ prop: expect.closeTo(0.3, 5) });
Arguments
expected number#
Expected value.
numDigits number (optional)#
The number of decimal digits after the decimal point that must be equal.

objectContaining
Added in: v1.9 
expect.objectContaining() matches an object that contains and matches all of the properties in the expected object. Note that received object may be a superset of the expected object and contain some extra properties.
Use this method inside expect(value).toEqual() to perform pattern matching. Object properties can be matchers to further relax the expectation. See examples.
Usage
// Assert some of the properties.
expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ foo: 1 }));


// Matchers can be used on the properties as well.
expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ bar: expect.any(Number) }));


// Complex matching of sub-properties.
expect({
 list: [1, 2, 3],
 obj: { prop: 'Hello world!', another: 'some other value' },
 extra: 'extra',
}).toEqual(expect.objectContaining({
 list: expect.arrayContaining([2, 3]),
 obj: expect.objectContaining({ prop: expect.stringContaining('Hello') }),
}));
Arguments
expected Object#
Expected object pattern that contains a subset of the properties.

stringContaining
Added in: v1.9 
expect.stringContaining() matches a string that contains the expected substring. Use this method inside expect(value).toEqual() to perform pattern matching.
Usage
expect('Hello world!').toEqual(expect.stringContaining('Hello'));
Arguments
expected string#
Expected substring.

stringMatching
Added in: v1.9 
expect.stringMatching() matches a received string that in turn matches the expected pattern. Use this method inside expect(value).toEqual() to perform pattern matching.
Usage
expect('123ms').toEqual(expect.stringMatching(/\d+m?s/));


// Inside another matcher.
expect({
 status: 'passed',
 time: '123ms',
}).toEqual({
 status: expect.stringMatching(/passed|failed/),
 time: expect.stringMatching(/\d+m?s/),
});
Arguments
expected string | RegExp#
Pattern that expected string should match.

toBe
Added in: v1.9 
Compares value with expected by calling Object.is. This method compares objects by reference instead of their contents, similarly to the strict equality operator ===.
Usage
const value = { prop: 1 };
expect(value).toBe(value);
expect(value).not.toBe({});
expect(value.prop).toBe(1);
Arguments
expected Object#
Expected value.

toBeCloseTo
Added in: v1.9 
Compares floating point numbers for approximate equality. Use this method instead of expect(value).toBe() when comparing floating point numbers.
Usage
expect(0.1 + 0.2).not.toBe(0.3);
expect(0.1 + 0.2).toBeCloseTo(0.3, 5);
Arguments
expected number#
Expected value.
numDigits number (optional)#
The number of decimal digits after the decimal point that must be equal.

toBeDefined
Added in: v1.9 
Ensures that value is not undefined.
Usage
const value = null;
expect(value).toBeDefined();

toBeFalsy
Added in: v1.9 
Ensures that value is false in a boolean context, one of false, 0, '', null, undefined or NaN. Use this method when you don't care about the specific value.
Usage
const value = null;
expect(value).toBeFalsy();

toBeGreaterThan
Added in: v1.9 
Ensures that value > expected for number or big integer values.
Usage
const value = 42;
expect(value).toBeGreaterThan(1);
Arguments
expected number | [bigint]#
The value to compare to.

toBeGreaterThanOrEqual
Added in: v1.9 
Ensures that value >= expected for number or big integer values.
Usage
const value = 42;
expect(value).toBeGreaterThanOrEqual(42);
Arguments
expected number | [bigint]#
The value to compare to.

toBeInstanceOf
Added in: v1.9 
Ensures that value is an instance of a class. Uses instanceof operator.
Usage
expect(page).toBeInstanceOf(Page);


class Example {}
expect(new Example()).toBeInstanceOf(Example);
Arguments
expected Function#
The class or constructor function.

toBeLessThan
Added in: v1.9 
Ensures that value < expected for number or big integer values.
Usage
const value = 42;
expect(value).toBeLessThan(100);
Arguments
expected number | [bigint]#
The value to compare to.

toBeLessThanOrEqual
Added in: v1.9 
Ensures that value <= expected for number or big integer values.
Usage
const value = 42;
expect(value).toBeLessThanOrEqual(42);
Arguments
expected number | [bigint]#
The value to compare to.

toBeNaN
Added in: v1.9 
Ensures that value is NaN.
Usage
const value = NaN;
expect(value).toBeNaN();

toBeNull
Added in: v1.9 
Ensures that value is null.
Usage
const value = null;
expect(value).toBeNull();

toBeTruthy
Added in: v1.9 
Ensures that value is true in a boolean context, anything but false, 0, '', null, undefined or NaN. Use this method when you don't care about the specific value.
Usage
const value = { example: 'value' };
expect(value).toBeTruthy();

toBeUndefined
Added in: v1.9 
Ensures that value is undefined.
Usage
const value = undefined;
expect(value).toBeUndefined();

toContain(expected)
Added in: v1.9 
Ensures that string value contains an expected substring. Comparison is case-sensitive.
Usage
const value = 'Hello, World';
expect(value).toContain('World');
expect(value).toContain(',');
Arguments
expected string#
Expected substring.

toContain(expected)
Added in: v1.9 
Ensures that value is an Array or Set and contains an expected item.
Usage
const value = [1, 2, 3];
expect(value).toContain(2);
expect(new Set(value)).toContain(2);
Arguments
expected Object#
Expected value in the collection.

toContainEqual
Added in: v1.9 
Ensures that value is an Array or Set and contains an item equal to the expected.
For objects, this method recursively checks equality of all fields, rather than comparing objects by reference as performed by expect(value).toContain().
For primitive values, this method is equivalent to expect(value).toContain().
Usage
const value = [
 { example: 1 },
 { another: 2 },
 { more: 3 },
];
expect(value).toContainEqual({ another: 2 });
expect(new Set(value)).toContainEqual({ another: 2 });
Arguments
expected Object#
Expected value in the collection.

toEqual
Added in: v1.9 
Compares contents of the value with contents of expected, performing "deep equality" check.
For objects, this method recursively checks equality of all fields, rather than comparing objects by reference as performed by expect(value).toBe().
For primitive values, this method is equivalent to expect(value).toBe().
Usage
const value = { prop: 1 };
expect(value).toEqual({ prop: 1 });
Non-strict equality
expect(value).toEqual() performs deep equality check that compares contents of the received and expected values. To ensure two objects reference the same instance, use expect(value).toBe() instead.
expect(value).toEqual() ignores undefined properties and array items, and does not insist on object types being equal. For stricter matching, use expect(value).toStrictEqual().
Pattern matching
expect(value).toEqual() can be also used to perform pattern matching on objects, arrays and primitive types, with the help of the following matchers:
expect(value).any()
expect(value).anything()
expect(value).arrayContaining()
expect(value).closeTo()
expect(value).objectContaining()
expect(value).stringContaining()
expect(value).stringMatching()
Here is an example that asserts some of the values inside a complex object:
expect({
 list: [1, 2, 3],
 obj: { prop: 'Hello world!', another: 'some other value' },
 extra: 'extra',
}).toEqual(expect.objectContaining({
 list: expect.arrayContaining([2, 3]),
 obj: expect.objectContaining({ prop: expect.stringContaining('Hello') }),
}));
Arguments
expected Object#
Expected value.

toHaveLength
Added in: v1.9 
Ensures that value has a .length property equal to expected. Useful for arrays and strings.
Usage
expect('Hello, World').toHaveLength(12);
expect([1, 2, 3]).toHaveLength(3);
Arguments
expected number#
Expected length.

toHaveProperty
Added in: v1.9 
Ensures that property at provided keyPath exists on the object and optionally checks that property is equal to the expected. Equality is checked recursively, similarly to expect(value).toEqual().
Usage
const value = {
 a: {
   b: [42],
 },
 c: true,
};
expect(value).toHaveProperty('a.b');
expect(value).toHaveProperty('a.b', [42]);
expect(value).toHaveProperty('a.b[0]', 42);
expect(value).toHaveProperty('c');
expect(value).toHaveProperty('c', true);
Arguments
keyPath string#
Path to the property. Use dot notation a.b to check nested properties and indexed a[2] notation to check nested array items.
expected Object (optional)#
Optional expected value to compare the property to.

toMatch
Added in: v1.9 
Ensures that string value matches a regular expression.
Usage
const value = 'Is 42 enough?';
expect(value).toMatch(/Is \d+ enough/);
Arguments
expected RegExp | string#
Regular expression to match against.

toMatchObject
Added in: v1.9 
Compares contents of the value with contents of expected, performing "deep equality" check. Allows extra properties to be present in the value, unlike expect(value).toEqual(), so you can check just a subset of object properties.
When comparing arrays, the number of items must match, and each item is checked recursively.
Usage
const value = {
 a: 1,
 b: 2,
 c: true,
};
expect(value).toMatchObject({ a: 1, c: true });
expect(value).toMatchObject({ b: 2, c: true });


expect([{ a: 1, b: 2 }]).toMatchObject([{ a: 1 }]);
Arguments
expected Object | Array#
The expected object value to match against.

toStrictEqual
Added in: v1.9 
Compares contents of the value with contents of expected and their types.
Differences from expect(value).toEqual():
Keys with undefined properties are checked. For example, { a: undefined, b: 2 } does not match { b: 2 }.
Array sparseness is checked. For example, [, 1] does not match [undefined, 1].
Object types are checked to be equal. For example, a class instance with fields a and b will not equal a literal object with fields a and b.
Usage
const value = { prop: 1 };
expect(value).toStrictEqual({ prop: 1 });
Arguments
expected Object#
Expected value.

toThrow
Added in: v1.9 
Calls the function and ensures it throws an error.
Optionally compares the error with expected. Allowed expected values:
Regular expression - error message should match the pattern.
String - error message should include the substring.
Error object - error message should be equal to the message property of the object.
Error class - error object should be an instance of the class.
Usage
expect(() => {
 throw new Error('Something bad');
}).toThrow();


expect(() => {
 throw new Error('Something bad');
}).toThrow(/something/);


expect(() => {
 throw new Error('Something bad');
}).toThrow(Error);
Arguments
expected Object (optional)#
Expected error message or error object.

toThrowError
Added in: v1.9 
An alias for expect(value).toThrow().
Usage
expect(() => {
 throw new Error('Something bad');
}).toThrowError();
Arguments
expected Object (optional)#
Expected error message or error object.

Properties
not
Added in: v1.9 
Makes the assertion check for the opposite condition. For example, the following code passes:
const value = 1;
expect(value).not.toBe(2);
Usage
expect(value).not
Type
GenericAssertions
Previous
APIResponseAssertions
Next
LocatorAssertions
Methods
any
anything
arrayContaining
closeTo
objectContaining
stringContaining
stringMatching
toBe
toBeCloseTo
toBeDefined
toBeFalsy
toBeGreaterThan
toBeGreaterThanOrEqual
toBeInstanceOf
toBeLessThan
toBeLessThanOrEqual
toBeNaN
toBeNull
toBeTruthy
toBeUndefined
toContain(expected)
toContain(expected)
toContainEqual
toEqual
toHaveLength
toHaveProperty
toMatch
toMatchObject
toStrictEqual
toThrow
toThrowError
Properties
not
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
LocatorAssertions
The LocatorAssertions class provides assertion methods that can be used to make assertions about the Locator state in the tests.
import { test, expect } from '@playwright/test';


test('status becomes submitted', async ({ page }) => {
 // ...
 await page.getByRole('button').click();
 await expect(page.locator('.status')).toHaveText('Submitted');
});

Methods
toBeAttached
Added in: v1.33 
Ensures that Locator points to an element that is connected to a Document or a ShadowRoot.
Usage
await expect(page.getByText('Hidden text')).toBeAttached();
Arguments
options Object (optional)
attached boolean (optional)#
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toBeChecked
Added in: v1.20 
Ensures the Locator points to a checked input.
Usage
const locator = page.getByLabel('Subscribe to newsletter');
await expect(locator).toBeChecked();
Arguments
options Object (optional)
checked boolean (optional) Added in: v1.18#
Provides state to assert for. Asserts for input to be checked by default. This option can't be used when indeterminate is set to true.
indeterminate boolean (optional) Added in: v1.50#
Asserts that the element is in the indeterminate (mixed) state. Only supported for checkboxes and radio buttons. This option can't be true when checked is provided.
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toBeDisabled
Added in: v1.20 
Ensures the Locator points to a disabled element. Element is disabled if it has "disabled" attribute or is disabled via 'aria-disabled'. Note that only native control elements such as HTML button, input, select, textarea, option, optgroup can be disabled by setting "disabled" attribute. "disabled" attribute on other elements is ignored by the browser.
Usage
const locator = page.locator('button.submit');
await expect(locator).toBeDisabled();
Arguments
options Object (optional)
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toBeEditable
Added in: v1.20 
Ensures the Locator points to an editable element.
Usage
const locator = page.getByRole('textbox');
await expect(locator).toBeEditable();
Arguments
options Object (optional)
editable boolean (optional) Added in: v1.26#
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toBeEmpty
Added in: v1.20 
Ensures the Locator points to an empty editable element or to a DOM node that has no text.
Usage
const locator = page.locator('div.warning');
await expect(locator).toBeEmpty();
Arguments
options Object (optional)
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toBeEnabled
Added in: v1.20 
Ensures the Locator points to an enabled element.
Usage
const locator = page.locator('button.submit');
await expect(locator).toBeEnabled();
Arguments
options Object (optional)
enabled boolean (optional) Added in: v1.26#
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toBeFocused
Added in: v1.20 
Ensures the Locator points to a focused DOM node.
Usage
const locator = page.getByRole('textbox');
await expect(locator).toBeFocused();
Arguments
options Object (optional)
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toBeHidden
Added in: v1.20 
Ensures that Locator either does not resolve to any DOM node, or resolves to a non-visible one.
Usage
const locator = page.locator('.my-element');
await expect(locator).toBeHidden();
Arguments
options Object (optional)
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toBeInViewport
Added in: v1.31 
Ensures the Locator points to an element that intersects viewport, according to the intersection observer API.
Usage
const locator = page.getByRole('button');
// Make sure at least some part of element intersects viewport.
await expect(locator).toBeInViewport();
// Make sure element is fully outside of viewport.
await expect(locator).not.toBeInViewport();
// Make sure that at least half of the element intersects viewport.
await expect(locator).toBeInViewport({ ratio: 0.5 });
Arguments
options Object (optional)
ratio number (optional)#
The minimal ratio of the element to intersect viewport. If equals to 0, then element should intersect viewport at any positive ratio. Defaults to 0.
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toBeVisible
Added in: v1.20 
Ensures that Locator points to an attached and visible DOM node.
To check that at least one element from the list is visible, use locator.first().
Usage
// A specific element is visible.
await expect(page.getByText('Welcome')).toBeVisible();


// At least one item in the list is visible.
await expect(page.getByTestId('todo-item').first()).toBeVisible();


// At least one of the two elements is visible, possibly both.
await expect(
   page.getByRole('button', { name: 'Sign in' })
       .or(page.getByRole('button', { name: 'Sign up' }))
       .first()
).toBeVisible();
Arguments
options Object (optional)
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
visible boolean (optional) Added in: v1.26#
Returns
Promise<void>#

toContainClass
Added in: v1.52 
Ensures the Locator points to an element with given CSS classes. All classes from the asserted value, separated by spaces, must be present in the Element.classList in any order.
Usage
<div class='middle selected row' id='component'></div>
const locator = page.locator('#component');
await expect(locator).toContainClass('middle selected row');
await expect(locator).toContainClass('selected');
await expect(locator).toContainClass('row middle');
When an array is passed, the method asserts that the list of elements located matches the corresponding list of expected class lists. Each element's class attribute is matched against the corresponding class in the array:
<div class='list'>
 <div class='component inactive'></div>
 <div class='component active'></div>
 <div class='component inactive'></div>
</div>
const locator = page.locator('.list > .component');
await expect(locator).toContainClass(['inactive', 'active', 'inactive']);
Arguments
expected string | Array<string>#
A string containing expected class names, separated by spaces, or a list of such strings to assert multiple elements.
options Object (optional)
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toContainText
Added in: v1.20 
Ensures the Locator points to an element that contains the given text. All nested elements will be considered when computing the text content of the element. You can use regular expressions for the value as well.
Usage
const locator = page.locator('.title');
await expect(locator).toContainText('substring');
await expect(locator).toContainText(/\d messages/);
If you pass an array as an expected value, the expectations are:
Locator resolves to a list of elements.
Elements from a subset of this list contain text from the expected array, respectively.
The matching subset of elements has the same order as the expected array.
Each text value from the expected array is matched by some element from the list.
For example, consider the following list:
<ul>
 <li>Item Text 1</li>
 <li>Item Text 2</li>
 <li>Item Text 3</li>
</ul>
Let's see how we can use the assertion:
// ✓ Contains the right items in the right order
await expect(page.locator('ul > li')).toContainText(['Text 1', 'Text 3']);


// ✖ Wrong order
await expect(page.locator('ul > li')).toContainText(['Text 3', 'Text 2']);


// ✖ No item contains this text
await expect(page.locator('ul > li')).toContainText(['Some 33']);


// ✖ Locator points to the outer list element, not to the list items
await expect(page.locator('ul')).toContainText(['Text 3']);
Arguments
expected string | RegExp | Array<string | RegExp> Added in: v1.18#
Expected substring or RegExp or a list of those.
options Object (optional)
ignoreCase boolean (optional) Added in: v1.23#
Whether to perform case-insensitive match. ignoreCase option takes precedence over the corresponding regular expression flag if specified.
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
useInnerText boolean (optional) Added in: v1.18#
Whether to use element.innerText instead of element.textContent when retrieving DOM node text.
Returns
Promise<void>#
Details
When expected parameter is a string, Playwright will normalize whitespaces and line breaks both in the actual text and in the expected string before matching. When regular expression is used, the actual text is matched as is.

toHaveAccessibleDescription
Added in: v1.44 
Ensures the Locator points to an element with a given accessible description.
Usage
const locator = page.getByTestId('save-button');
await expect(locator).toHaveAccessibleDescription('Save results to disk');
Arguments
description string | RegExp#
Expected accessible description.
options Object (optional)
ignoreCase boolean (optional)#
Whether to perform case-insensitive match. ignoreCase option takes precedence over the corresponding regular expression flag if specified.
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveAccessibleErrorMessage
Added in: v1.50 
Ensures the Locator points to an element with a given aria errormessage.
Usage
const locator = page.getByTestId('username-input');
await expect(locator).toHaveAccessibleErrorMessage('Username is required.');
Arguments
errorMessage string | RegExp#
Expected accessible error message.
options Object (optional)
ignoreCase boolean (optional)#
Whether to perform case-insensitive match. ignoreCase option takes precedence over the corresponding regular expression flag if specified.
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveAccessibleName
Added in: v1.44 
Ensures the Locator points to an element with a given accessible name.
Usage
const locator = page.getByTestId('save-button');
await expect(locator).toHaveAccessibleName('Save to disk');
Arguments
name string | RegExp#
Expected accessible name.
options Object (optional)
ignoreCase boolean (optional)#
Whether to perform case-insensitive match. ignoreCase option takes precedence over the corresponding regular expression flag if specified.
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveAttribute(name, value)
Added in: v1.20 
Ensures the Locator points to an element with given attribute.
Usage
const locator = page.locator('input');
await expect(locator).toHaveAttribute('type', 'text');
Arguments
name string Added in: v1.18#
Attribute name.
value string | RegExp Added in: v1.18#
Expected attribute value.
options Object (optional)
ignoreCase boolean (optional) Added in: v1.40#
Whether to perform case-insensitive match. ignoreCase option takes precedence over the corresponding regular expression flag if specified.
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveAttribute(name)
Added in: v1.39 
Ensures the Locator points to an element with given attribute. The method will assert attribute presence.
const locator = page.locator('input');
// Assert attribute existence.
await expect(locator).toHaveAttribute('disabled');
await expect(locator).not.toHaveAttribute('open');
Usage
await expect(locator).toHaveAttribute(name);
await expect(locator).toHaveAttribute(name, options);
Arguments
name string#
Attribute name.
options Object (optional)
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveClass
Added in: v1.20 
Ensures the Locator points to an element with given CSS classes. When a string is provided, it must fully match the element's class attribute. To match individual classes use expect(locator).toContainClass().
Usage
<div class='middle selected row' id='component'></div>
const locator = page.locator('#component');
await expect(locator).toHaveClass('middle selected row');
await expect(locator).toHaveClass(/(^|\s)selected(\s|$)/);
When an array is passed, the method asserts that the list of elements located matches the corresponding list of expected class values. Each element's class attribute is matched against the corresponding string or regular expression in the array:
const locator = page.locator('.list > .component');
await expect(locator).toHaveClass(['component', 'component selected', 'component']);
Arguments
expected string | RegExp | Array<string | RegExp> Added in: v1.18#
Expected class or RegExp or a list of those.
options Object (optional)
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveCount
Added in: v1.20 
Ensures the Locator resolves to an exact number of DOM nodes.
Usage
const list = page.locator('list > .component');
await expect(list).toHaveCount(3);
Arguments
count number Added in: v1.18#
Expected count.
options Object (optional)
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveCSS
Added in: v1.20 
Ensures the Locator resolves to an element with the given computed CSS style.
Usage
const locator = page.getByRole('button');
await expect(locator).toHaveCSS('display', 'flex');
Arguments
name string Added in: v1.18#
CSS property name.
value string | RegExp Added in: v1.18#
CSS property value.
options Object (optional)
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveId
Added in: v1.20 
Ensures the Locator points to an element with the given DOM Node ID.
Usage
const locator = page.getByRole('textbox');
await expect(locator).toHaveId('lastname');
Arguments
id string | RegExp Added in: v1.18#
Element id.
options Object (optional)
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveJSProperty
Added in: v1.20 
Ensures the Locator points to an element with given JavaScript property. Note that this property can be of a primitive type as well as a plain serializable JavaScript object.
Usage
const locator = page.locator('.component');
await expect(locator).toHaveJSProperty('loaded', true);
Arguments
name string Added in: v1.18#
Property name.
value Object Added in: v1.18#
Property value.
options Object (optional)
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveRole
Added in: v1.44 
Ensures the Locator points to an element with a given ARIA role.
Note that role is matched as a string, disregarding the ARIA role hierarchy. For example, asserting a superclass role "checkbox" on an element with a subclass role "switch" will fail.
Usage
const locator = page.getByTestId('save-button');
await expect(locator).toHaveRole('button');
Arguments
role "alert" | "alertdialog" | "application" | "article" | "banner" | "blockquote" | "button" | "caption" | "cell" | "checkbox" | "code" | "columnheader" | "combobox" | "complementary" | "contentinfo" | "definition" | "deletion" | "dialog" | "directory" | "document" | "emphasis" | "feed" | "figure" | "form" | "generic" | "grid" | "gridcell" | "group" | "heading" | "img" | "insertion" | "link" | "list" | "listbox" | "listitem" | "log" | "main" | "marquee" | "math" | "meter" | "menu" | "menubar" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "navigation" | "none" | "note" | "option" | "paragraph" | "presentation" | "progressbar" | "radio" | "radiogroup" | "region" | "row" | "rowgroup" | "rowheader" | "scrollbar" | "search" | "searchbox" | "separator" | "slider" | "spinbutton" | "status" | "strong" | "subscript" | "superscript" | "switch" | "tab" | "table" | "tablist" | "tabpanel" | "term" | "textbox" | "time" | "timer" | "toolbar" | "tooltip" | "tree" | "treegrid" | "treeitem"#
Required aria role.
options Object (optional)
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveScreenshot(name)
Added in: v1.23 
This function will wait until two consecutive locator screenshots yield the same result, and then compare the last screenshot with the expectation.
Usage
const locator = page.getByRole('button');
await expect(locator).toHaveScreenshot('image.png');
Note that screenshot assertions only work with Playwright test runner.
Arguments
name string | Array<string>#
Snapshot name.
options Object (optional)
animations "disabled" | "allow" (optional)#
When set to "disabled", stops CSS animations, CSS transitions and Web Animations. Animations get different treatment depending on their duration:
finite animations are fast-forwarded to completion, so they'll fire transitionend event.
infinite animations are canceled to initial state, and then played over after the screenshot.
Defaults to "disabled" that disables animations.
caret "hide" | "initial" (optional)#
When set to "hide", screenshot will hide text caret. When set to "initial", text caret behavior will not be changed. Defaults to "hide".
mask Array<Locator> (optional)#
Specify locators that should be masked when the screenshot is taken. Masked elements will be overlaid with a pink box #FF00FF (customized by maskColor) that completely covers its bounding box. The mask is also applied to invisible elements, see Matching only visible elements to disable that.
maskColor string (optional) Added in: v1.35#
Specify the color of the overlay box for masked elements, in CSS color format. Default color is pink #FF00FF.
maxDiffPixelRatio number (optional)#
An acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1. Default is configurable with TestConfig.expect. Unset by default.
maxDiffPixels number (optional)#
An acceptable amount of pixels that could be different. Default is configurable with TestConfig.expect. Unset by default.
omitBackground boolean (optional)#
Hides default white background and allows capturing screenshots with transparency. Not applicable to jpeg images. Defaults to false.
scale "css" | "device" (optional)#
When set to "css", screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using "device" option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.
Defaults to "css".
stylePath string | Array<string> (optional) Added in: v1.41#
File name containing the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies to the inner frames.
threshold number (optional)#
An acceptable perceived color difference in the YIQ color space between the same pixel in compared images, between zero (strict) and one (lax), default is configurable with TestConfig.expect. Defaults to 0.2.
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveScreenshot(options)
Added in: v1.23 
This function will wait until two consecutive locator screenshots yield the same result, and then compare the last screenshot with the expectation.
Usage
const locator = page.getByRole('button');
await expect(locator).toHaveScreenshot();
Note that screenshot assertions only work with Playwright test runner.
Arguments
options Object (optional)
animations "disabled" | "allow" (optional)#
When set to "disabled", stops CSS animations, CSS transitions and Web Animations. Animations get different treatment depending on their duration:
finite animations are fast-forwarded to completion, so they'll fire transitionend event.
infinite animations are canceled to initial state, and then played over after the screenshot.
Defaults to "disabled" that disables animations.
caret "hide" | "initial" (optional)#
When set to "hide", screenshot will hide text caret. When set to "initial", text caret behavior will not be changed. Defaults to "hide".
mask Array<Locator> (optional)#
Specify locators that should be masked when the screenshot is taken. Masked elements will be overlaid with a pink box #FF00FF (customized by maskColor) that completely covers its bounding box. The mask is also applied to invisible elements, see Matching only visible elements to disable that.
maskColor string (optional) Added in: v1.35#
Specify the color of the overlay box for masked elements, in CSS color format. Default color is pink #FF00FF.
maxDiffPixelRatio number (optional)#
An acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1. Default is configurable with TestConfig.expect. Unset by default.
maxDiffPixels number (optional)#
An acceptable amount of pixels that could be different. Default is configurable with TestConfig.expect. Unset by default.
omitBackground boolean (optional)#
Hides default white background and allows capturing screenshots with transparency. Not applicable to jpeg images. Defaults to false.
scale "css" | "device" (optional)#
When set to "css", screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using "device" option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.
Defaults to "css".
stylePath string | Array<string> (optional) Added in: v1.41#
File name containing the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies to the inner frames.
threshold number (optional)#
An acceptable perceived color difference in the YIQ color space between the same pixel in compared images, between zero (strict) and one (lax), default is configurable with TestConfig.expect. Defaults to 0.2.
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveText
Added in: v1.20 
Ensures the Locator points to an element with the given text. All nested elements will be considered when computing the text content of the element. You can use regular expressions for the value as well.
Usage
const locator = page.locator('.title');
await expect(locator).toHaveText(/Welcome, Test User/);
await expect(locator).toHaveText(/Welcome, .*/);
If you pass an array as an expected value, the expectations are:
Locator resolves to a list of elements.
The number of elements equals the number of expected values in the array.
Elements from the list have text matching expected array values, one by one, in order.
For example, consider the following list:
<ul>
 <li>Text 1</li>
 <li>Text 2</li>
 <li>Text 3</li>
</ul>
Let's see how we can use the assertion:
// ✓ Has the right items in the right order
await expect(page.locator('ul > li')).toHaveText(['Text 1', 'Text 2', 'Text 3']);


// ✖ Wrong order
await expect(page.locator('ul > li')).toHaveText(['Text 3', 'Text 2', 'Text 1']);


// ✖ Last item does not match
await expect(page.locator('ul > li')).toHaveText(['Text 1', 'Text 2', 'Text']);


// ✖ Locator points to the outer list element, not to the list items
await expect(page.locator('ul')).toHaveText(['Text 1', 'Text 2', 'Text 3']);
Arguments
expected string | RegExp | Array<string | RegExp> Added in: v1.18#
Expected string or RegExp or a list of those.
options Object (optional)
ignoreCase boolean (optional) Added in: v1.23#
Whether to perform case-insensitive match. ignoreCase option takes precedence over the corresponding regular expression flag if specified.
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
useInnerText boolean (optional) Added in: v1.18#
Whether to use element.innerText instead of element.textContent when retrieving DOM node text.
Returns
Promise<void>#
Details
When expected parameter is a string, Playwright will normalize whitespaces and line breaks both in the actual text and in the expected string before matching. When regular expression is used, the actual text is matched as is.

toHaveValue
Added in: v1.20 
Ensures the Locator points to an element with the given input value. You can use regular expressions for the value as well.
Usage
const locator = page.locator('input[type=number]');
await expect(locator).toHaveValue(/[0-9]/);
Arguments
value string | RegExp Added in: v1.18#
Expected value.
options Object (optional)
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveValues
Added in: v1.23 
Ensures the Locator points to multi-select/combobox (i.e. a select with the multiple attribute) and the specified values are selected.
Usage
For example, given the following element:
<select id="favorite-colors" multiple>
 <option value="R">Red</option>
 <option value="G">Green</option>
 <option value="B">Blue</option>
</select>
const locator = page.locator('id=favorite-colors');
await locator.selectOption(['R', 'G']);
await expect(locator).toHaveValues([/R/, /G/]);
Arguments
values Array<string | RegExp>#
Expected options currently selected.
options Object (optional)
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toMatchAriaSnapshot(expected)
Added in: v1.49 
Asserts that the target element matches the given accessibility snapshot.
Usage
await page.goto('https://demo.playwright.dev/todomvc/');
await expect(page.locator('body')).toMatchAriaSnapshot(`
 - heading "todos"
 - textbox "What needs to be done?"
`);
Arguments
expected string#
options Object (optional)
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toMatchAriaSnapshot(options)
Added in: v1.50 
Asserts that the target element matches the given accessibility snapshot.
Snapshot is stored in a separate .aria.yml file in a location configured by expect.toMatchAriaSnapshot.pathTemplate and/or snapshotPathTemplate properties in the configuration file.
Usage
await expect(page.locator('body')).toMatchAriaSnapshot();
await expect(page.locator('body')).toMatchAriaSnapshot({ name: 'body.aria.yml' });
Arguments
options Object (optional)
name string (optional)#
Name of the snapshot to store in the snapshot folder corresponding to this test. Generates sequential names if not specified.
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

Properties
not
Added in: v1.20 
Makes the assertion check for the opposite condition. For example, this code tests that the Locator doesn't contain text "error":
await expect(locator).not.toContainText('error');
Usage
expect(locator).not
Type
LocatorAssertions
Previous
GenericAssertions
Next
PageAssertions
Methods
toBeAttached
toBeChecked
toBeDisabled
toBeEditable
toBeEmpty
toBeEnabled
toBeFocused
toBeHidden
toBeInViewport
toBeVisible
toContainClass
toContainText
toHaveAccessibleDescription
toHaveAccessibleErrorMessage
toHaveAccessibleName
toHaveAttribute(name, value)
toHaveAttribute(name)
toHaveClass
toHaveCount
toHaveCSS
toHaveId
toHaveJSProperty
toHaveRole
toHaveScreenshot(name)
toHaveScreenshot(options)
toHaveText
toHaveValue
toHaveValues
toMatchAriaSnapshot(expected)
toMatchAriaSnapshot(options)
Properties
not
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Skip to main content

Playwright
DocsAPINode.js
Community
API reference
Playwright Test
Playwright Library
Classes
APIRequest
APIRequestContext
APIResponse
Accessibility
Browser
BrowserContext
BrowserServer
BrowserType
CDPSession
Clock
ConsoleMessage
Coverage
Dialog
Download
ElementHandle
FileChooser
Frame
FrameLocator
JSHandle
Keyboard
Locator
Logger
Mouse
Page
Request
Response
Route
Selectors
TimeoutError
Touchscreen
Tracing
Video
WebError
WebSocket
WebSocketRoute
Worker
Assertions
APIResponseAssertions
GenericAssertions
LocatorAssertions
PageAssertions
SnapshotAssertions
Test Runner
Fixtures
FullConfig
FullProject
Location
Playwright Test
TestConfig
TestInfo
TestInfoError
TestOptions
TestProject
TestStepInfo
WorkerInfo
Test Reporter
Reporter
Suite
TestCase
TestError
TestResult
TestStep
Experimental
Android
AndroidDevice
AndroidInput
AndroidSocket
AndroidWebView
Electron
ElectronApplication


API reference
Assertions
PageAssertions
PageAssertions
The PageAssertions class provides assertion methods that can be used to make assertions about the Page state in the tests.
import { test, expect } from '@playwright/test';


test('navigates to login', async ({ page }) => {
 // ...
 await page.getByText('Sign in').click();
 await expect(page).toHaveURL(/.*\/login/);
});

Methods
toHaveScreenshot(name)
Added in: v1.23 
This function will wait until two consecutive page screenshots yield the same result, and then compare the last screenshot with the expectation.
Usage
await expect(page).toHaveScreenshot('image.png');
Note that screenshot assertions only work with Playwright test runner.
Arguments
name string | Array<string>#
Snapshot name.
options Object (optional)
animations "disabled" | "allow" (optional)#
When set to "disabled", stops CSS animations, CSS transitions and Web Animations. Animations get different treatment depending on their duration:
finite animations are fast-forwarded to completion, so they'll fire transitionend event.
infinite animations are canceled to initial state, and then played over after the screenshot.
Defaults to "disabled" that disables animations.
caret "hide" | "initial" (optional)#
When set to "hide", screenshot will hide text caret. When set to "initial", text caret behavior will not be changed. Defaults to "hide".
clip Object (optional)#
x number
x-coordinate of top-left corner of clip area
y number
y-coordinate of top-left corner of clip area
width number
width of clipping area
height number
height of clipping area
An object which specifies clipping of the resulting image.
fullPage boolean (optional)#
When true, takes a screenshot of the full scrollable page, instead of the currently visible viewport. Defaults to false.
mask Array<Locator> (optional)#
Specify locators that should be masked when the screenshot is taken. Masked elements will be overlaid with a pink box #FF00FF (customized by maskColor) that completely covers its bounding box. The mask is also applied to invisible elements, see Matching only visible elements to disable that.
maskColor string (optional) Added in: v1.35#
Specify the color of the overlay box for masked elements, in CSS color format. Default color is pink #FF00FF.
maxDiffPixelRatio number (optional)#
An acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1. Default is configurable with TestConfig.expect. Unset by default.
maxDiffPixels number (optional)#
An acceptable amount of pixels that could be different. Default is configurable with TestConfig.expect. Unset by default.
omitBackground boolean (optional)#
Hides default white background and allows capturing screenshots with transparency. Not applicable to jpeg images. Defaults to false.
scale "css" | "device" (optional)#
When set to "css", screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using "device" option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.
Defaults to "css".
stylePath string | Array<string> (optional) Added in: v1.41#
File name containing the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies to the inner frames.
threshold number (optional)#
An acceptable perceived color difference in the YIQ color space between the same pixel in compared images, between zero (strict) and one (lax), default is configurable with TestConfig.expect. Defaults to 0.2.
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveScreenshot(options)
Added in: v1.23 
This function will wait until two consecutive page screenshots yield the same result, and then compare the last screenshot with the expectation.
Usage
await expect(page).toHaveScreenshot();
Note that screenshot assertions only work with Playwright test runner.
Arguments
options Object (optional)
animations "disabled" | "allow" (optional)#
When set to "disabled", stops CSS animations, CSS transitions and Web Animations. Animations get different treatment depending on their duration:
finite animations are fast-forwarded to completion, so they'll fire transitionend event.
infinite animations are canceled to initial state, and then played over after the screenshot.
Defaults to "disabled" that disables animations.
caret "hide" | "initial" (optional)#
When set to "hide", screenshot will hide text caret. When set to "initial", text caret behavior will not be changed. Defaults to "hide".
clip Object (optional)#
x number
x-coordinate of top-left corner of clip area
y number
y-coordinate of top-left corner of clip area
width number
width of clipping area
height number
height of clipping area
An object which specifies clipping of the resulting image.
fullPage boolean (optional)#
When true, takes a screenshot of the full scrollable page, instead of the currently visible viewport. Defaults to false.
mask Array<Locator> (optional)#
Specify locators that should be masked when the screenshot is taken. Masked elements will be overlaid with a pink box #FF00FF (customized by maskColor) that completely covers its bounding box. The mask is also applied to invisible elements, see Matching only visible elements to disable that.
maskColor string (optional) Added in: v1.35#
Specify the color of the overlay box for masked elements, in CSS color format. Default color is pink #FF00FF.
maxDiffPixelRatio number (optional)#
An acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1. Default is configurable with TestConfig.expect. Unset by default.
maxDiffPixels number (optional)#
An acceptable amount of pixels that could be different. Default is configurable with TestConfig.expect. Unset by default.
omitBackground boolean (optional)#
Hides default white background and allows capturing screenshots with transparency. Not applicable to jpeg images. Defaults to false.
scale "css" | "device" (optional)#
When set to "css", screenshot will have a single pixel per each css pixel on the page. For high-dpi devices, this will keep screenshots small. Using "device" option will produce a single pixel per each device pixel, so screenshots of high-dpi devices will be twice as large or even larger.
Defaults to "css".
stylePath string | Array<string> (optional) Added in: v1.41#
File name containing the stylesheet to apply while making the screenshot. This is where you can hide dynamic elements, make elements invisible or change their properties to help you creating repeatable screenshots. This stylesheet pierces the Shadow DOM and applies to the inner frames.
threshold number (optional)#
An acceptable perceived color difference in the YIQ color space between the same pixel in compared images, between zero (strict) and one (lax), default is configurable with TestConfig.expect. Defaults to 0.2.
timeout number (optional)#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveTitle
Added in: v1.20 
Ensures the page has the given title.
Usage
await expect(page).toHaveTitle(/.*checkout/);
Arguments
titleOrRegExp string | RegExp Added in: v1.18#
Expected title or RegExp.
options Object (optional)
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

toHaveURL
Added in: v1.20 
Ensures the page is navigated to the given URL.
Usage
// Check for the page URL to be 'https://playwright.dev/docs/intro' (including query string)
await expect(page).toHaveURL('https://playwright.dev/docs/intro');


// Check for the page URL to contain 'doc', followed by an optional 's', followed by '/'
await expect(page).toHaveURL(/docs?\//);


// Check for the predicate to be satisfied
// For example: verify query strings
await expect(page).toHaveURL(url => {
 const params = url.searchParams;
 return params.has('search') && params.has('options') && params.get('id') === '5';
});
Arguments
url string | RegExp | function(URL):boolean Added in: v1.18#
Expected URL string, RegExp, or predicate receiving URL to match. When baseURL is provided via the context options and the url argument is a string, the two values are merged via the new URL() constructor and used for the comparison against the current browser URL.
options Object (optional)
ignoreCase boolean (optional) Added in: v1.44#
Whether to perform case-insensitive match. ignoreCase option takes precedence over the corresponding regular expression parameter if specified. A provided predicate ignores this flag.
timeout number (optional) Added in: v1.18#
Time to retry the assertion for in milliseconds. Defaults to timeout in TestConfig.expect.
Returns
Promise<void>#

Properties
not
Added in: v1.20 
Makes the assertion check for the opposite condition. For example, this code tests that the page URL doesn't contain "error":
await expect(page).not.toHaveURL('error');
Usage
expect(page).not
Type
PageAssertions
Previous
LocatorAssertions
Next
SnapshotAssertions
Methods
toHaveScreenshot(name)
toHaveScreenshot(options)
toHaveTitle
toHaveURL
Properties
not
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
SnapshotAssertions
Playwright provides methods for comparing page and element screenshots with expected values stored in files.
expect(screenshot).toMatchSnapshot('landing-page.png');

Methods
toMatchSnapshot(name)
Added in: v1.22 
CAUTION
To compare screenshots, use expect(page).toHaveScreenshot() instead.
Ensures that passed value, either a string or a Buffer, matches the expected snapshot stored in the test snapshots directory.
Usage
// Basic usage.
expect(await page.screenshot()).toMatchSnapshot('landing-page.png');


// Pass options to customize the snapshot comparison and have a generated name.
expect(await page.screenshot()).toMatchSnapshot('landing-page.png', {
 maxDiffPixels: 27, // allow no more than 27 different pixels.
});


// Configure image matching threshold.
expect(await page.screenshot()).toMatchSnapshot('landing-page.png', { threshold: 0.3 });


// Bring some structure to your snapshot files by passing file path segments.
expect(await page.screenshot()).toMatchSnapshot(['landing', 'step2.png']);
expect(await page.screenshot()).toMatchSnapshot(['landing', 'step3.png']);
Learn more about visual comparisons.
Note that matching snapshots only work with Playwright test runner.
Arguments
name string | Array<string>#
Snapshot name.
options Object (optional)
maxDiffPixelRatio number (optional)#
An acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1. Default is configurable with TestConfig.expect. Unset by default.
maxDiffPixels number (optional)#
An acceptable amount of pixels that could be different. Default is configurable with TestConfig.expect. Unset by default.
threshold number (optional)#
An acceptable perceived color difference in the YIQ color space between the same pixel in compared images, between zero (strict) and one (lax), default is configurable with TestConfig.expect. Defaults to 0.2.

toMatchSnapshot(options)
Added in: v1.22 
CAUTION
To compare screenshots, use expect(page).toHaveScreenshot() instead.
Ensures that passed value, either a string or a Buffer, matches the expected snapshot stored in the test snapshots directory.
Usage
// Basic usage and the file name is derived from the test name.
expect(await page.screenshot()).toMatchSnapshot();


// Pass options to customize the snapshot comparison and have a generated name.
expect(await page.screenshot()).toMatchSnapshot({
 maxDiffPixels: 27, // allow no more than 27 different pixels.
});


// Configure image matching threshold and snapshot name.
expect(await page.screenshot()).toMatchSnapshot({
 name: 'landing-page.png',
 threshold: 0.3,
});
Learn more about visual comparisons.
Note that matching snapshots only work with Playwright test runner.
Arguments
options Object (optional)
maxDiffPixelRatio number (optional)#
An acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1. Default is configurable with TestConfig.expect. Unset by default.
maxDiffPixels number (optional)#
An acceptable amount of pixels that could be different. Default is configurable with TestConfig.expect. Unset by default.
name string | Array<string> (optional)#
Snapshot name. If not passed, the test name and ordinals are used when called multiple times.
threshold number (optional)#
An acceptable perceived color difference in the YIQ color space between the same pixel in compared images, between zero (strict) and one (lax), default is configurable with TestConfig.expect. Defaults to 0.2.
Previous
PageAssertions
Next
Fixtures
Methods
toMatchSnapshot(name)
toMatchSnapshot(options)
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Fixtures
Playwright Test is based on the concept of the test fixtures. Test fixtures are used to establish environment for each test, giving the test everything it needs and nothing else.
Playwright Test looks at each test declaration, analyses the set of fixtures the test needs and prepares those fixtures specifically for the test. Values prepared by the fixtures are merged into a single object that is available to the test, hooks, annotations and other fixtures as a first parameter.
import { test, expect } from '@playwright/test';


test('basic test', async ({ page }) => {
 // ...
});
Given the test above, Playwright Test will set up the page fixture before running the test, and tear it down after the test has finished. page fixture provides a Page object that is available to the test.
Playwright Test comes with builtin fixtures listed below, and you can add your own fixtures as well. Playwright Test also provides options to configure fixtures.browser, fixtures.context and fixtures.page.

Properties
browser
Added in: v1.10 
Browser instance is shared between all tests in the same worker - this makes testing efficient. However, each test runs in an isolated BrowserContext and gets a fresh environment.
Learn how to configure browser and see available options.
Usage
test.beforeAll(async ({ browser }) => {
 const page = await browser.newPage();
 // ...
});
Type
Browser

browserName
Added in: v1.10 
Name of the browser that runs tests. Defaults to 'chromium'. Useful to annotate tests based on the browser.
Usage
test('skip this test in Firefox', async ({ page, browserName }) => {
 test.skip(browserName === 'firefox', 'Still working on it');
 // ...
});
Type
"chromium" | "firefox" | "webkit"

context
Added in: v1.10 
Isolated BrowserContext instance, created for each test. Since contexts are isolated between each other, every test gets a fresh environment, even when multiple tests run in a single Browser for maximum efficiency.
Learn how to configure context and see available options.
Default fixtures.page belongs to this context.
Usage
test('example test', async ({ page, context }) => {
 await context.route('*external.com/*', route => route.abort());
 // ...
});
Type
BrowserContext

page
Added in: v1.10 
Isolated Page instance, created for each test. Pages are isolated between tests due to fixtures.context isolation.
This is the most common fixture used in a test.
Usage
import { test, expect } from '@playwright/test';


test('basic test', async ({ page }) => {
 await page.goto('/signin');
 await page.getByLabel('User Name').fill('user');
 await page.getByLabel('Password').fill('password');
 await page.getByText('Sign in').click();
 // ...
});
Type
Page

request
Added in: v1.10 
Isolated APIRequestContext instance for each test.
Usage
import { test, expect } from '@playwright/test';


test('basic test', async ({ request }) => {
 await request.post('/signin', {
   data: {
     username: 'user',
     password: 'password'
   }
 });
 // ...
});
Type
APIRequestContext
Previous
SnapshotAssertions
FullConfig
Resolved configuration which is accessible via testInfo.config and is passed to the test reporters. To see the format of Playwright configuration file, please see TestConfig instead.

Properties
configFile
Added in: v1.20 
Path to the configuration file used to run the tests. The value is an empty string if no config file was used.
Usage
fullConfig.configFile
Type
string

forbidOnly
Added in: v1.10 
See testConfig.forbidOnly.
Usage
fullConfig.forbidOnly
Type
boolean

fullyParallel
Added in: v1.20 
See testConfig.fullyParallel.
Usage
fullConfig.fullyParallel
Type
boolean

globalSetup
Added in: v1.10 
See testConfig.globalSetup.
Usage
fullConfig.globalSetup
Type
null | string

globalTeardown
Added in: v1.10 
See testConfig.globalTeardown.
Usage
fullConfig.globalTeardown
Type
null | string

globalTimeout
Added in: v1.10 
See testConfig.globalTimeout.
Usage
fullConfig.globalTimeout
Type
number

grep
Added in: v1.10 
See testConfig.grep.
Usage
fullConfig.grep
Type
RegExp | Array<RegExp>

grepInvert
Added in: v1.10 
See testConfig.grepInvert.
Usage
fullConfig.grepInvert
Type
null | RegExp | Array<RegExp>

maxFailures
Added in: v1.10 
See testConfig.maxFailures.
Usage
fullConfig.maxFailures
Type
number

metadata
Added in: v1.10 
See testConfig.metadata.
Usage
fullConfig.metadata
Type
Metadata

preserveOutput
Added in: v1.10 
See testConfig.preserveOutput.
Usage
fullConfig.preserveOutput
Type
"always" | "never" | "failures-only"

projects
Added in: v1.10 
List of resolved projects.
Usage
fullConfig.projects
Type
Array<FullProject>

quiet
Added in: v1.10 
See testConfig.quiet.
Usage
fullConfig.quiet
Type
boolean

reportSlowTests
Added in: v1.10 
See testConfig.reportSlowTests.
Usage
fullConfig.reportSlowTests
Type
null | Object
max number
The maximum number of slow test files to report.
threshold number
Test file duration in milliseconds that is considered slow.

reporter
Added in: v1.10 
See testConfig.reporter.
Usage
fullConfig.reporter
Type
string | Array<Object> | "list" | "dot" | "line" | "github" | "json" | "junit" | "null" | "html"
0 string
Reporter name or module or file path
1 Object
An object with reporter options if any

rootDir
Added in: v1.20 
Base directory for all relative paths used in the reporters.
Usage
fullConfig.rootDir
Type
string

shard
Added in: v1.10 
See testConfig.shard.
Usage
fullConfig.shard
Type
null | Object
total number
The total number of shards.
current number
The index of the shard to execute, one-based.

updateSnapshots
Added in: v1.10 
See testConfig.updateSnapshots.
Usage
fullConfig.updateSnapshots
Type
"all" | "changed" | "missing" | "none"

updateSourceMethod
Added in: v1.50 
See testConfig.updateSourceMethod.
Usage
fullConfig.updateSourceMethod
Type
"overwrite" | "3way" | "patch"

version
Added in: v1.20 
Playwright version.
Usage
fullConfig.version
Type
string

webServer
Added in: v1.10 
See testConfig.webServer.
Usage
fullConfig.webServer
Type
null | Object

workers
Added in: v1.10 
See testConfig.workers.
Usage
fullConfig.workers
Type
number
FullProject
Runtime representation of the test project configuration. It is accessible in the tests via testInfo.project and workerInfo.project and is passed to the test reporters. To see the format of the project in the Playwright configuration file please see TestProject instead.

Properties
dependencies
Added in: v1.31 
See testProject.dependencies.
Usage
fullProject.dependencies
Type
Array<string>

grep
Added in: v1.10 
See testProject.grep.
Usage
fullProject.grep
Type
RegExp | Array<RegExp>

grepInvert
Added in: v1.10 
See testProject.grepInvert.
Usage
fullProject.grepInvert
Type
null | RegExp | Array<RegExp>

metadata
Added in: v1.10 
See testProject.metadata.
Usage
fullProject.metadata
Type
Metadata

name
Added in: v1.10 
See testProject.name.
Usage
fullProject.name
Type
string

outputDir
Added in: v1.10 
See testProject.outputDir.
Usage
fullProject.outputDir
Type
string

repeatEach
Added in: v1.10 
See testProject.repeatEach.
Usage
fullProject.repeatEach
Type
number

retries
Added in: v1.10 
See testProject.retries.
Usage
fullProject.retries
Type
number

snapshotDir
Added in: v1.10 
See testProject.snapshotDir.
Usage
fullProject.snapshotDir
Type
string

teardown
Added in: v1.34 
See testProject.teardown.
Usage
fullProject.teardown
Type
string

testDir
Added in: v1.10 
See testProject.testDir.
Usage
fullProject.testDir
Type
string

testIgnore
Added in: v1.10 
See testProject.testIgnore.
Usage
fullProject.testIgnore
Type
string | RegExp | Array<string | RegExp>

testMatch
Added in: v1.10 
See testProject.testMatch.
Usage
fullProject.testMatch
Type
string | RegExp | Array<string | RegExp>

timeout
Added in: v1.10 
See testProject.timeout.
Usage
fullProject.timeout
Type
number

use
Added in: v1.10 
See testProject.use.
Usage
fullProject.use
Type
Fixtures
Location
Represents a location in the source code where TestCase or Suite is defined.

Properties
column
Added in: v1.10 
Column number in the source file.
Usage
location.column
Type
number

file
Added in: v1.10 
Path to the source file.
Usage
location.file
Type
string

line
Added in: v1.10 
Line number in the source file.
Usage
location.line
Type
number
Previous
FullProject
Next
Playwright Test
Properties
column
file
line
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Playwright Test
Playwright Test provides a test function to declare tests and expect function to write assertions.
import { test, expect } from '@playwright/test';


test('basic test', async ({ page }) => {
 await page.goto('https://playwright.dev/');
 const name = await page.innerText('.navbar__title');
 expect(name).toBe('Playwright');
});

Methods
test
Added in: v1.10 
Declares a test.
test(title, body)
test(title, details, body)
Usage
import { test, expect } from '@playwright/test';


test('basic test', async ({ page }) => {
 await page.goto('https://playwright.dev/');
 // ...
});
Tags
You can tag tests by providing additional test details. Alternatively, you can include tags in the test title. Note that each tag must start with @ symbol.
import { test, expect } from '@playwright/test';


test('basic test', {
 tag: '@smoke',
}, async ({ page }) => {
 await page.goto('https://playwright.dev/');
 // ...
});


test('another test @smoke', async ({ page }) => {
 await page.goto('https://playwright.dev/');
 // ...
});
Test tags are displayed in the test report, and are available to a custom reporter via TestCase.tags property.
You can also filter tests by their tags during test execution:
in the command line;
in the config with testConfig.grep and testProject.grep;
Learn more about tagging.
Annotations
You can annotate tests by providing additional test details.
import { test, expect } from '@playwright/test';


test('basic test', {
 annotation: {
   type: 'issue',
   description: 'https://github.com/microsoft/playwright/issues/23180',
 },
}, async ({ page }) => {
 await page.goto('https://playwright.dev/');
 // ...
});
Test annotations are displayed in the test report, and are available to a custom reporter via TestCase.annotations property.
You can also add annotations during runtime by manipulating testInfo.annotations.
Learn more about test annotations.
Arguments
title string#
Test title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
Annotation type, for example 'issue'.
description string (optional)
Optional annotation description, for example an issue url.
Additional test details.
body function(Fixtures, TestInfo)#
Test body that takes one or two arguments: an object with fixtures and optional TestInfo.

test.afterAll
Added in: v1.10 
Declares an afterAll hook that is executed once per worker after all tests.
When called in the scope of a test file, runs after all tests in the file. When called inside a test.describe() group, runs after all tests in the group.
Usage
test.afterAll(async () => {
 console.log('Done with tests');
 // ...
});
Alternatively, you can declare a hook with a title.
test.afterAll('Teardown', async () => {
 console.log('Done with tests');
 // ...
});
Arguments
title string (optional) Added in: v1.38#
Hook title.
hookFunction function(Fixtures, TestInfo)#
Hook function that takes one or two arguments: an object with worker fixtures and optional TestInfo.
Details
When multiple afterAll hooks are added, they will run in the order of their registration.
Note that worker process is restarted on test failures, and afterAll hook runs again in the new worker. Learn more about workers and failures.
Playwright will continue running all applicable hooks even if some of them have failed.
test.afterAll(hookFunction)
test.afterAll(title, hookFunction)

test.afterEach
Added in: v1.10 
Declares an afterEach hook that is executed after each test.
When called in the scope of a test file, runs after each test in the file. When called inside a test.describe() group, runs after each test in the group.
You can access all the same Fixtures as the test body itself, and also the TestInfo object that gives a lot of useful information. For example, you can check whether the test succeeded or failed.
test.afterEach(hookFunction)
test.afterEach(title, hookFunction)
Usage
example.spec.ts
import { test, expect } from '@playwright/test';


test.afterEach(async ({ page }) => {
 console.log(`Finished ${test.info().title} with status ${test.info().status}`);


 if (test.info().status !== test.info().expectedStatus)
   console.log(`Did not run as expected, ended up at ${page.url()}`);
});


test('my test', async ({ page }) => {
 // ...
});
Alternatively, you can declare a hook with a title.
example.spec.ts
test.afterEach('Status check', async ({ page }) => {
 if (test.info().status !== test.info().expectedStatus)
   console.log(`Did not run as expected, ended up at ${page.url()}`);
});
Arguments
title string (optional) Added in: v1.38#
Hook title.
hookFunction function(Fixtures, TestInfo)#
Hook function that takes one or two arguments: an object with fixtures and optional TestInfo.
Details
When multiple afterEach hooks are added, they will run in the order of their registration.
Playwright will continue running all applicable hooks even if some of them have failed.

test.beforeAll
Added in: v1.10 
Declares a beforeAll hook that is executed once per worker process before all tests.
When called in the scope of a test file, runs before all tests in the file. When called inside a test.describe() group, runs before all tests in the group.
You can use test.afterAll() to teardown any resources set up in beforeAll.
test.beforeAll(hookFunction)
test.beforeAll(title, hookFunction)
Usage
example.spec.ts
import { test, expect } from '@playwright/test';


test.beforeAll(async () => {
 console.log('Before tests');
});


test.afterAll(async () => {
 console.log('After tests');
});


test('my test', async ({ page }) => {
 // ...
});
Alternatively, you can declare a hook with a title.
example.spec.ts
test.beforeAll('Setup', async () => {
 console.log('Before tests');
});
Arguments
title string (optional) Added in: v1.38#
Hook title.
hookFunction function(Fixtures, TestInfo)#
Hook function that takes one or two arguments: an object with worker fixtures and optional TestInfo.
Details
When multiple beforeAll hooks are added, they will run in the order of their registration.
Note that worker process is restarted on test failures, and beforeAll hook runs again in the new worker. Learn more about workers and failures.
Playwright will continue running all applicable hooks even if some of them have failed.

test.beforeEach
Added in: v1.10 
Declares a beforeEach hook that is executed before each test.
When called in the scope of a test file, runs before each test in the file. When called inside a test.describe() group, runs before each test in the group.
You can access all the same Fixtures as the test body itself, and also the TestInfo object that gives a lot of useful information. For example, you can navigate the page before starting the test.
You can use test.afterEach() to teardown any resources set up in beforeEach.
test.beforeEach(hookFunction)
test.beforeEach(title, hookFunction)
Usage
example.spec.ts
import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }) => {
 console.log(`Running ${test.info().title}`);
 await page.goto('https://my.start.url/');
});


test('my test', async ({ page }) => {
 expect(page.url()).toBe('https://my.start.url/');
});
Alternatively, you can declare a hook with a title.
example.spec.ts
test.beforeEach('Open start URL', async ({ page }) => {
 console.log(`Running ${test.info().title}`);
 await page.goto('https://my.start.url/');
});
Arguments
title string (optional) Added in: v1.38#
Hook title.
hookFunction function(Fixtures, TestInfo)#
Hook function that takes one or two arguments: an object with fixtures and optional TestInfo.
Details
When multiple beforeEach hooks are added, they will run in the order of their registration.
Playwright will continue running all applicable hooks even if some of them have failed.

test.describe
Added in: v1.10 
Declares a group of tests.
test.describe(title, callback)
test.describe(callback)
test.describe(title, details, callback)
Usage
You can declare a group of tests with a title. The title will be visible in the test report as a part of each test's title.
test.describe('two tests', () => {
 test('one', async ({ page }) => {
   // ...
 });


 test('two', async ({ page }) => {
   // ...
 });
});
Anonymous group
You can also declare a test group without a title. This is convenient to give a group of tests a common option with test.use().
test.describe(() => {
 test.use({ colorScheme: 'dark' });


 test('one', async ({ page }) => {
   // ...
 });


 test('two', async ({ page }) => {
   // ...
 });
});
Tags
You can tag all tests in a group by providing additional details. Note that each tag must start with @ symbol.
import { test, expect } from '@playwright/test';


test.describe('two tagged tests', {
 tag: '@smoke',
}, () => {
 test('one', async ({ page }) => {
   // ...
 });


 test('two', async ({ page }) => {
   // ...
 });
});
Learn more about tagging.
Annotations
You can annotate all tests in a group by providing additional details.
import { test, expect } from '@playwright/test';


test.describe('two annotated tests', {
 annotation: {
   type: 'issue',
   description: 'https://github.com/microsoft/playwright/issues/23180',
 },
}, () => {
 test('one', async ({ page }) => {
   // ...
 });


 test('two', async ({ page }) => {
   // ...
 });
});
Learn more about test annotations.
Arguments
title string (optional)#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
Additional details for all tests in the group.
callback function#
A callback that is run immediately when calling test.describe(). Any tests declared in this callback will belong to the group.

test.describe.configure
Added in: v1.10 
Configures the enclosing scope. Can be executed either on the top level or inside a describe. Configuration applies to the entire scope, regardless of whether it run before or after the test declaration.
Learn more about the execution modes here.
Usage
Running tests in parallel.
// Run all the tests in the file concurrently using parallel workers.
test.describe.configure({ mode: 'parallel' });
test('runs in parallel 1', async ({ page }) => {});
test('runs in parallel 2', async ({ page }) => {});


Running tests in order, retrying each failed test independently.
This is the default mode. It can be useful to set it explicitly to override project configuration that uses fullyParallel.
// Tests in this file run in order. Retries, if any, run independently.
test.describe.configure({ mode: 'default' });
test('runs first', async ({ page }) => {});
test('runs second', async ({ page }) => {});


Running tests serially, retrying from the start. If one of the serial tests fails, all subsequent tests are skipped.
NOTE
Running serially is not recommended. It is usually better to make your tests isolated, so they can be run independently.
// Annotate tests as inter-dependent.
test.describe.configure({ mode: 'serial' });
test('runs first', async ({ page }) => {});
test('runs second', async ({ page }) => {});


Configuring retries and timeout for each test.
// Each test in the file will be retried twice and have a timeout of 20 seconds.
test.describe.configure({ retries: 2, timeout: 20_000 });
test('runs first', async ({ page }) => {});
test('runs second', async ({ page }) => {});


Run multiple describes in parallel, but tests inside each describe in order.
test.describe.configure({ mode: 'parallel' });

test.describe('A, runs in parallel with B', () => {
  test.describe.configure({ mode: 'default' });
  test('in order A1', async ({ page }) => {});
  test('in order A2', async ({ page }) => {});
});

test.describe('B, runs in parallel with A', () => {
  test.describe.configure({ mode: 'default' });
  test('in order B1', async ({ page }) => {});
  test('in order B2', async ({ page }) => {});
});


Arguments
options Object (optional)
mode "default" | "parallel" | "serial" (optional)#
Execution mode. Learn more about the execution modes here.
retries number (optional) Added in: v1.28#
The number of retries for each test.
timeout number (optional) Added in: v1.28#
Timeout for each test in milliseconds. Overrides testProject.timeout and testConfig.timeout.

test.describe.fixme
Added in: v1.25 
Declares a test group similarly to test.describe(). Tests in this group are marked as "fixme" and will not be executed.
test.describe.fixme(title, callback)
test.describe.fixme(callback)
test.describe.fixme(title, details, callback)
Usage
test.describe.fixme('broken tests that should be fixed', () => {
 test('example', async ({ page }) => {
   // This test will not run
 });
});
You can also omit the title.
test.describe.fixme(() => {
 // ...
});
Arguments
title string (optional)#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for details description.
callback function#
A callback that is run immediately when calling test.describe.fixme(). Any tests added in this callback will belong to the group, and will not be run.

test.describe.only
Added in: v1.10 
Declares a focused group of tests. If there are some focused tests or suites, all of them will be run but nothing else.
test.describe.only(title, callback)
test.describe.only(callback)
test.describe.only(title, details, callback)
Usage
test.describe.only('focused group', () => {
 test('in the focused group', async ({ page }) => {
   // This test will run
 });
});
test('not in the focused group', async ({ page }) => {
 // This test will not run
});
You can also omit the title.
test.describe.only(() => {
 // ...
});
Arguments
title string (optional)#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for details description.
callback function#
A callback that is run immediately when calling test.describe.only(). Any tests added in this callback will belong to the group.

test.describe.skip
Added in: v1.10 
Declares a skipped test group, similarly to test.describe(). Tests in the skipped group are never run.
test.describe.skip(title, callback)
test.describe.skip(title)
test.describe.skip(title, details, callback)
Usage
test.describe.skip('skipped group', () => {
 test('example', async ({ page }) => {
   // This test will not run
 });
});
You can also omit the title.
test.describe.skip(() => {
 // ...
});
Arguments
title string#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for details description.
callback function#
A callback that is run immediately when calling test.describe.skip(). Any tests added in this callback will belong to the group, and will not be run.

test.extend
Added in: v1.10 
Extends the test object by defining fixtures and/or options that can be used in the tests.
Usage
First define a fixture and/or an option.
TypeScript
JavaScript
import { test as base } from '@playwright/test';
import { TodoPage } from './todo-page';


export type Options = { defaultItem: string };


// Extend basic test by providing a "defaultItem" option and a "todoPage" fixture.
export const test = base.extend<Options & { todoPage: TodoPage }>({
 // Define an option and provide a default value.
 // We can later override it in the config.
 defaultItem: ['Do stuff', { option: true }],


 // Define a fixture. Note that it can use built-in fixture "page"
 // and a new option "defaultItem".
 todoPage: async ({ page, defaultItem }, use) => {
   const todoPage = new TodoPage(page);
   await todoPage.goto();
   await todoPage.addToDo(defaultItem);
   await use(todoPage);
   await todoPage.removeAll();
 },
});
Then use the fixture in the test.
example.spec.ts
import { test } from './my-test';


test('test 1', async ({ todoPage }) => {
 await todoPage.addToDo('my todo');
 // ...
});
Configure the option in config file.
TypeScript
JavaScript
playwright.config.ts
import { defineConfig } from '@playwright/test';
import type { Options } from './my-test';


export default defineConfig<Options>({
 projects: [
   {
     name: 'shopping',
     use: { defaultItem: 'Buy milk' },
   },
   {
     name: 'wellbeing',
     use: { defaultItem: 'Exercise!' },
   },
 ]
});
Learn more about fixtures and parametrizing tests.
Arguments
fixtures Object#
An object containing fixtures and/or options. Learn more about fixtures format.
Returns
Test#

test.fail
Added in: v1.10 
Marks a test as "should fail". Playwright runs this test and ensures that it is actually failing. This is useful for documentation purposes to acknowledge that some functionality is broken until it is fixed.
To declare a "failing" test:
test.fail(title, body)
test.fail(title, details, body)
To annotate test as "failing" at runtime:
test.fail(condition, description)
test.fail(callback, description)
test.fail()
Usage
You can declare a test as failing, so that Playwright ensures it actually fails.
import { test, expect } from '@playwright/test';


test.fail('not yet ready', async ({ page }) => {
 // ...
});
If your test fails in some configurations, but not all, you can mark the test as failing inside the test body based on some condition. We recommend passing a description argument in this case.
import { test, expect } from '@playwright/test';


test('fail in WebKit', async ({ page, browserName }) => {
 test.fail(browserName === 'webkit', 'This feature is not implemented for Mac yet');
 // ...
});
You can mark all tests in a file or test.describe() group as "should fail" based on some condition with a single test.fail(callback, description) call.
import { test, expect } from '@playwright/test';


test.fail(({ browserName }) => browserName === 'webkit', 'not implemented yet');


test('fail in WebKit 1', async ({ page }) => {
 // ...
});
test('fail in WebKit 2', async ({ page }) => {
 // ...
});
You can also call test.fail() without arguments inside the test body to always mark the test as failed. We recommend declaring a failing test with test.fail(title, body) instead.
import { test, expect } from '@playwright/test';


test('less readable', async ({ page }) => {
 test.fail();
 // ...
});
Arguments
title string (optional) Added in: v1.42#
Test title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test() for test details description.
body function(Fixtures, TestInfo) (optional) Added in: v1.42#
Test body that takes one or two arguments: an object with fixtures and optional TestInfo.
condition boolean (optional)#
Test is marked as "should fail" when the condition is true.
callback function(Fixtures):boolean (optional)#
A function that returns whether to mark as "should fail", based on test fixtures. Test or tests are marked as "should fail" when the return value is true.
description string (optional)#
Optional description that will be reflected in a test report.

test.fail.only
Added in: v1.49 
You can use test.fail.only to focus on a specific test that is expected to fail. This is particularly useful when debugging a failing test or working on a specific issue.
To declare a focused "failing" test:
test.fail.only(title, body)
test.fail.only(title, details, body)
Usage
You can declare a focused failing test, so that Playwright runs only this test and ensures it actually fails.
import { test, expect } from '@playwright/test';


test.fail.only('focused failing test', async ({ page }) => {
 // This test is expected to fail
});
test('not in the focused group', async ({ page }) => {
 // This test will not run
});
Arguments
title string (optional)#
Test title.
details Object (optional)#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for test details description.
body function(Fixtures, TestInfo) (optional)#
Test body that takes one or two arguments: an object with fixtures and optional TestInfo.

test.fixme
Added in: v1.10 
Mark a test as "fixme", with the intention to fix it. Playwright will not run the test past the test.fixme() call.
To declare a "fixme" test:
test.fixme(title, body)
test.fixme(title, details, body)
To annotate test as "fixme" at runtime:
test.fixme(condition, description)
test.fixme(callback, description)
test.fixme()
Usage
You can declare a test as to be fixed, and Playwright will not run it.
import { test, expect } from '@playwright/test';


test.fixme('to be fixed', async ({ page }) => {
 // ...
});
If your test should be fixed in some configurations, but not all, you can mark the test as "fixme" inside the test body based on some condition. We recommend passing a description argument in this case. Playwright will run the test, but abort it immediately after the test.fixme call.
import { test, expect } from '@playwright/test';


test('to be fixed in Safari', async ({ page, browserName }) => {
 test.fixme(browserName === 'webkit', 'This feature breaks in Safari for some reason');
 // ...
});
You can mark all tests in a file or test.describe() group as "fixme" based on some condition with a single test.fixme(callback, description) call.
import { test, expect } from '@playwright/test';


test.fixme(({ browserName }) => browserName === 'webkit', 'Should figure out the issue');


test('to be fixed in Safari 1', async ({ page }) => {
 // ...
});
test('to be fixed in Safari 2', async ({ page }) => {
 // ...
});
You can also call test.fixme() without arguments inside the test body to always mark the test as failed. We recommend using test.fixme(title, body) instead.
import { test, expect } from '@playwright/test';


test('less readable', async ({ page }) => {
 test.fixme();
 // ...
});
Arguments
title string (optional)#
Test title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test() for test details description.
body function(Fixtures, TestInfo) (optional)#
Test body that takes one or two arguments: an object with fixtures and optional TestInfo.
condition boolean (optional)#
Test is marked as "should fail" when the condition is true.
callback function(Fixtures):boolean (optional)#
A function that returns whether to mark as "should fail", based on test fixtures. Test or tests are marked as "should fail" when the return value is true.
description string (optional)#
Optional description that will be reflected in a test report.

test.info
Added in: v1.10 
Returns information about the currently running test. This method can only be called during the test execution, otherwise it throws.
Usage
test('example test', async ({ page }) => {
 // ...
 await test.info().attach('screenshot', {
   body: await page.screenshot(),
   contentType: 'image/png',
 });
});
Returns
TestInfo#

test.only
Added in: v1.10 
Declares a focused test. If there are some focused tests or suites, all of them will be run but nothing else.
test.only(title, body)
test.only(title, details, body)
Usage
test.only('focus this test', async ({ page }) => {
 // Run only focused tests in the entire project.
});
Arguments
title string#
Test title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test() for test details description.
body function(Fixtures, TestInfo)#
Test body that takes one or two arguments: an object with fixtures and optional TestInfo.

test.setTimeout
Added in: v1.10 
Changes the timeout for the test. Zero means no timeout. Learn more about various timeouts.
Timeout for the currently running test is available through testInfo.timeout.
Usage
Changing test timeout.
test('very slow test', async ({ page }) => {
 test.setTimeout(120000);
  // ...
});


Changing timeout from a slow beforeEach hook. Note that this affects the test timeout that is shared with beforeEach hooks.
test.beforeEach(async ({ page }, testInfo) => {
 // Extend timeout for all tests running this hook by 30 seconds.
  test.setTimeout(testInfo.timeout + 30000);
});


Changing timeout for a beforeAll or afterAll hook. Note this affects the hook's timeout, not the test timeout.
test.beforeAll(async () => {
 // Set timeout for this hook.
  test.setTimeout(60000);
});


Changing timeout for all tests in a test.describe() group.
test.describe('group', () => {
 // Applies to all tests in this group.
  test.describe.configure({ timeout: 60000 });

  test('test one', async () => { /* ... */ });
  test('test two', async () => { /* ... */ });
  test('test three', async () => { /* ... */ });
});


Arguments
timeout number#
Timeout in milliseconds.

test.skip
Added in: v1.10 
Skip a test. Playwright will not run the test past the test.skip() call.
Skipped tests are not supposed to be ever run. If you intend to fix the test, use test.fixme() instead.
To declare a skipped test:
test.skip(title, body)
test.skip(title, details, body)
To skip a test at runtime:
test.skip(condition, description)
test.skip(callback, description)
test.skip()
Usage
You can declare a skipped test, and Playwright will not run it.
import { test, expect } from '@playwright/test';


test.skip('never run', async ({ page }) => {
 // ...
});
If your test should be skipped in some configurations, but not all, you can skip the test inside the test body based on some condition. We recommend passing a description argument in this case. Playwright will run the test, but abort it immediately after the test.skip call.
import { test, expect } from '@playwright/test';


test('Safari-only test', async ({ page, browserName }) => {
 test.skip(browserName !== 'webkit', 'This feature is Safari-only');
 // ...
});
You can skip all tests in a file or test.describe() group based on some condition with a single test.skip(callback, description) call.
import { test, expect } from '@playwright/test';


test.skip(({ browserName }) => browserName !== 'webkit', 'Safari-only');


test('Safari-only test 1', async ({ page }) => {
 // ...
});
test('Safari-only test 2', async ({ page }) => {
 // ...
});
You can also call test.skip() without arguments inside the test body to always mark the test as failed. We recommend using test.skip(title, body) instead.
import { test, expect } from '@playwright/test';


test('less readable', async ({ page }) => {
 test.skip();
 // ...
});
Arguments
title string (optional)#
Test title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test() for test details description.
body function(Fixtures, TestInfo) (optional)#
Test body that takes one or two arguments: an object with fixtures and optional TestInfo.
condition boolean (optional)#
Test is marked as "should fail" when the condition is true.
callback function(Fixtures):boolean (optional)#
A function that returns whether to mark as "should fail", based on test fixtures. Test or tests are marked as "should fail" when the return value is true.
description string (optional)#
Optional description that will be reflected in a test report.

test.slow
Added in: v1.10 
Marks a test as "slow". Slow test will be given triple the default timeout.
Note that test.slow() cannot be used in a beforeAll or afterAll hook. Use test.setTimeout() instead.
test.slow()
test.slow(condition, description)
test.slow(callback, description)
Usage
You can mark a test as slow by calling test.slow() inside the test body.
import { test, expect } from '@playwright/test';


test('slow test', async ({ page }) => {
 test.slow();
 // ...
});
If your test is slow in some configurations, but not all, you can mark it as slow based on a condition. We recommend passing a description argument in this case.
import { test, expect } from '@playwright/test';


test('slow in Safari', async ({ page, browserName }) => {
 test.slow(browserName === 'webkit', 'This feature is slow in Safari');
 // ...
});
You can mark all tests in a file or test.describe() group as "slow" based on some condition by passing a callback.
import { test, expect } from '@playwright/test';


test.slow(({ browserName }) => browserName === 'webkit', 'all tests are slow in Safari');


test('slow in Safari 1', async ({ page }) => {
 // ...
});
test('fail in Safari 2', async ({ page }) => {
 // ...
});
Arguments
condition boolean (optional)#
Test is marked as "slow" when the condition is true.
callback function(Fixtures):boolean (optional)#
A function that returns whether to mark as "slow", based on test fixtures. Test or tests are marked as "slow" when the return value is true.
description string (optional)#
Optional description that will be reflected in a test report.

test.step
Added in: v1.10 
Declares a test step that is shown in the report.
Usage
import { test, expect } from '@playwright/test';


test('test', async ({ page }) => {
 await test.step('Log in', async () => {
   // ...
 });


 await test.step('Outer step', async () => {
   // ...
   // You can nest steps inside each other.
   await test.step('Inner step', async () => {
     // ...
   });
 });
});
Arguments
title string#
Step name.
body function(TestStepInfo):Promise<Object>#
Step body.
options Object (optional)
box boolean (optional) Added in: v1.39#
Whether to box the step in the report. Defaults to false. When the step is boxed, errors thrown from the step internals point to the step call site. See below for more details.
location Location (optional) Added in: v1.48#
Specifies a custom location for the step to be shown in test reports and trace viewer. By default, location of the test.step() call is shown.
timeout number (optional) Added in: v1.50#
The maximum time, in milliseconds, allowed for the step to complete. If the step does not complete within the specified timeout, the test.step() method will throw a TimeoutError. Defaults to 0 (no timeout).
Returns
Promise<Object>#
Details
The method returns the value returned by the step callback.
import { test, expect } from '@playwright/test';


test('test', async ({ page }) => {
 const user = await test.step('Log in', async () => {
   // ...
   return 'john';
 });
 expect(user).toBe('john');
});
Decorator
You can use TypeScript method decorators to turn a method into a step. Each call to the decorated method will show up as a step in the report.
function step(target: Function, context: ClassMethodDecoratorContext) {
 return function replacementMethod(...args: any) {
   const name = this.constructor.name + '.' + (context.name as string);
   return test.step(name, async () => {
     return await target.call(this, ...args);
   });
 };
}


class LoginPage {
 constructor(readonly page: Page) {}


 @step
 async login() {
   const account = { username: 'Alice', password: 's3cr3t' };
   await this.page.getByLabel('Username or email address').fill(account.username);
   await this.page.getByLabel('Password').fill(account.password);
   await this.page.getByRole('button', { name: 'Sign in' }).click();
   await expect(this.page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
 }
}


test('example', async ({ page }) => {
 const loginPage = new LoginPage(page);
 await loginPage.login();
});
Boxing
When something inside a step fails, you would usually see the error pointing to the exact action that failed. For example, consider the following login step:
async function login(page) {
 await test.step('login', async () => {
   const account = { username: 'Alice', password: 's3cr3t' };
   await page.getByLabel('Username or email address').fill(account.username);
   await page.getByLabel('Password').fill(account.password);
   await page.getByRole('button', { name: 'Sign in' }).click();
   await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
 });
}


test('example', async ({ page }) => {
 await page.goto('https://github.com/login');
 await login(page);
});
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
 ... error details omitted ...


  8 |     await page.getByRole('button', { name: 'Sign in' }).click();
>  9 |     await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
    |                                                                               ^
 10 |   });
As we see above, the test may fail with an error pointing inside the step. If you would like the error to highlight the "login" step instead of its internals, use the box option. An error inside a boxed step points to the step call site.
async function login(page) {
 await test.step('login', async () => {
   // ...
 }, { box: true });  // Note the "box" option here.
}
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
 ... error details omitted ...


 14 |   await page.goto('https://github.com/login');
> 15 |   await login(page);
    |         ^
 16 | });
You can also create a TypeScript decorator for a boxed step, similar to a regular step decorator above:
function boxedStep(target: Function, context: ClassMethodDecoratorContext) {
 return function replacementMethod(...args: any) {
   const name = this.constructor.name + '.' + (context.name as string);
   return test.step(name, async () => {
     return await target.call(this, ...args);
   }, { box: true });  // Note the "box" option here.
 };
}


class LoginPage {
 constructor(readonly page: Page) {}


 @boxedStep
 async login() {
   // ....
 }
}


test('example', async ({ page }) => {
 const loginPage = new LoginPage(page);
 await loginPage.login();  // <-- Error will be reported on this line.
});

test.step.skip
Added in: v1.50 
Mark a test step as "skip" to temporarily disable its execution, useful for steps that are currently failing and planned for a near-term fix. Playwright will not run the step. See also testStepInfo.skip().
We recommend testStepInfo.skip() instead.
Usage
You can declare a skipped step, and Playwright will not run it.
import { test, expect } from '@playwright/test';


test('my test', async ({ page }) => {
 // ...
 await test.step.skip('not yet ready', async () => {
   // ...
 });
});
Arguments
title string#
Step name.
body function():Promise<Object>#
Step body.
options Object (optional)
box boolean (optional)#
Whether to box the step in the report. Defaults to false. When the step is boxed, errors thrown from the step internals point to the step call site. See below for more details.
location Location (optional)#
Specifies a custom location for the step to be shown in test reports and trace viewer. By default, location of the test.step() call is shown.
timeout number (optional)#
Maximum time in milliseconds for the step to finish. Defaults to 0 (no timeout).
Returns
Promise<void>#

test.use
Added in: v1.10 
Specifies options or fixtures to use in a single test file or a test.describe() group. Most useful to set an option, for example set locale to configure context fixture.
Usage
import { test, expect } from '@playwright/test';


test.use({ locale: 'en-US' });


test('test with locale', async ({ page }) => {
 // Default context and page have locale as specified
});
Arguments
options TestOptions#
An object with local options.
Details
test.use can be called either in the global scope or inside test.describe. It is an error to call it within beforeEach or beforeAll.
It is also possible to override a fixture by providing a function.
import { test, expect } from '@playwright/test';


test.use({
 locale: async ({}, use) => {
   // Read locale from some configuration file.
   const locale = await fs.promises.readFile('test-locale', 'utf-8');
   await use(locale);
 },
});


test('test with locale', async ({ page }) => {
 // Default context and page have locale as specified
});

Properties
test.expect
Added in: v1.10 
expect function can be used to create test assertions. Read more about test assertions.
Usage
test('example', async ({ page }) => {
 await test.expect(page).toHaveTitle('Title');
});
Type
Object

Deprecated
test.describe.parallel
Added in: v1.10 
DISCOURAGED
See test.describe.configure() for the preferred way of configuring the execution mode.
Declares a group of tests that could be run in parallel. By default, tests in a single test file run one after another, but using test.describe.parallel() allows them to run in parallel.
test.describe.parallel(title, callback)
test.describe.parallel(callback)
test.describe.parallel(title, details, callback)
Usage
test.describe.parallel('group', () => {
 test('runs in parallel 1', async ({ page }) => {});
 test('runs in parallel 2', async ({ page }) => {});
});
Note that parallel tests are executed in separate processes and cannot share any state or global variables. Each of the parallel tests executes all relevant hooks.
You can also omit the title.
test.describe.parallel(() => {
 // ...
});
Arguments
title string (optional)#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for details description.
callback function#
A callback that is run immediately when calling test.describe.parallel(). Any tests added in this callback will belong to the group.

test.describe.parallel.only
Added in: v1.10 
DISCOURAGED
See test.describe.configure() for the preferred way of configuring the execution mode.
Declares a focused group of tests that could be run in parallel. This is similar to test.describe.parallel(), but focuses the group. If there are some focused tests or suites, all of them will be run but nothing else.
test.describe.parallel.only(title, callback)
test.describe.parallel.only(callback)
test.describe.parallel.only(title, details, callback)
Usage
test.describe.parallel.only('group', () => {
 test('runs in parallel 1', async ({ page }) => {});
 test('runs in parallel 2', async ({ page }) => {});
});
You can also omit the title.
test.describe.parallel.only(() => {
 // ...
});
Arguments
title string (optional)#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for details description.
callback function#
A callback that is run immediately when calling test.describe.parallel.only(). Any tests added in this callback will belong to the group.

test.describe.serial
Added in: v1.10 
DISCOURAGED
See test.describe.configure() for the preferred way of configuring the execution mode.
Declares a group of tests that should always be run serially. If one of the tests fails, all subsequent tests are skipped. All tests in a group are retried together.
NOTE
Using serial is not recommended. It is usually better to make your tests isolated, so they can be run independently.
test.describe.serial(title, callback)
test.describe.serial(title)
test.describe.serial(title, details, callback)
Usage
test.describe.serial('group', () => {
 test('runs first', async ({ page }) => {});
 test('runs second', async ({ page }) => {});
});
You can also omit the title.
test.describe.serial(() => {
 // ...
});
Arguments
title string (optional)#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for details description.
callback function#
A callback that is run immediately when calling test.describe.serial(). Any tests added in this callback will belong to the group.

test.describe.serial.only
Added in: v1.10 
DISCOURAGED
See test.describe.configure() for the preferred way of configuring the execution mode.
Declares a focused group of tests that should always be run serially. If one of the tests fails, all subsequent tests are skipped. All tests in a group are retried together. If there are some focused tests or suites, all of them will be run but nothing else.
NOTE
Using serial is not recommended. It is usually better to make your tests isolated, so they can be run independently.
test.describe.serial.only(title, callback)
test.describe.serial.only(title)
test.describe.serial.only(title, details, callback)
Usage
test.describe.serial.only('group', () => {
 test('runs first', async ({ page }) => {
 });
 test('runs second', async ({ page }) => {
 });
});
You can also omit the title.
test.describe.serial.only(() => {
 // ...
});
Arguments
title string#
Group title.
details Object (optional) Added in: v1.42#
tag string | Array<string> (optional)
annotation Object | Array<Object> (optional)
type string
description string (optional)
See test.describe() for details description.
callback function#
A callback that is run immediately when calling test.describe.serial.only(). Any tests added in this callback will belong to the group.
Next
Playwright Library
Methods
test
test.afterAll
test.afterEach
test.beforeAll
test.beforeEach
test.describe
test.describe.configure
test.describe.fixme
test.describe.only
test.describe.skip
test.extend
test.fail
test.fail.only
test.fixme
test.info
test.only
test.setTimeout
test.skip
test.slow
test.step
test.step.skip
test.use
Properties
test.expect
Deprecated
test.describe.parallel
test.describe.parallel.only
test.describe.serial
test.describe.serial.only
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
TestConfig
Playwright Test provides many options to configure how your tests are collected and executed, for example timeout or testDir. These options are described in the TestConfig object in the configuration file. This type describes format of the configuration file, to access resolved configuration parameters at run time use FullConfig.
Playwright Test supports running multiple test projects at the same time. Project-specific options should be put to testConfig.projects, but top-level TestConfig can also define base options shared between all projects.
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 timeout: 30000,
 globalTimeout: 600000,
 reporter: 'list',
 testDir: './tests',
});

Properties
build
Added in: v1.35 
Playwright transpiler configuration.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 build: {
   external: ['**/*bundle.js'],
 },
});
Type
Object
external Array<string> (optional)
Paths to exclude from the transpilation expressed as a list of glob patterns. Typically heavy JS bundles that your test uses are listed here.

captureGitInfo
Added in: v1.51 
These settings control whether git information is captured and stored in the config testConfig.metadata.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 captureGitInfo: { commit: true, diff: true }
});
Type
Object
commit boolean (optional)
Whether to capture commit and pull request information such as hash, author, timestamp.
diff boolean (optional)
Whether to capture commit diff.
Details
Capturing commit information is useful when you'd like to see it in your HTML (or a third party) report.
Capturing diff information is useful to enrich the report with the actual source diff. This information can be used to provide intelligent advice on how to fix the test.
NOTE
Default values for these settings depend on the environment. When tests run as a part of CI where it is safe to obtain git information, the default value is true, false otherwise.
NOTE
The structure of the git commit metadata is subject to change.

expect
Added in: v1.10 
Configuration for the expect assertion library. Learn more about various timeouts.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 expect: {
   timeout: 10000,
   toMatchSnapshot: {
     maxDiffPixels: 10,
   },
 },
});
Type
Object
timeout number (optional)
Default timeout for async expect matchers in milliseconds, defaults to 5000ms.
toHaveScreenshot Object (optional)
animations "allow" | "disabled" (optional)
See animations in page.screenshot(). Defaults to "disabled".
caret "hide" | "initial" (optional)
See caret in page.screenshot(). Defaults to "hide".
maxDiffPixels number (optional)
An acceptable amount of pixels that could be different, unset by default.
maxDiffPixelRatio number (optional)
An acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1 , unset by default.
scale "css" | "device" (optional)
See scale in page.screenshot(). Defaults to "css".
stylePath string | Array<string> (optional)
See style in page.screenshot().
threshold number (optional)
An acceptable perceived color difference between the same pixel in compared images, ranging from 0 (strict) and 1 (lax). "pixelmatch" comparator computes color difference in YIQ color space and defaults threshold value to 0.2.
pathTemplate string (optional)
A template controlling location of the screenshots. See testConfig.snapshotPathTemplate for details.
Configuration for the expect(page).toHaveScreenshot() method.
toMatchAriaSnapshot Object (optional)
pathTemplate string (optional)
A template controlling location of the aria snapshots. See testConfig.snapshotPathTemplate for details.
Configuration for the expect(locator).toMatchAriaSnapshot() method.
toMatchSnapshot Object (optional)
maxDiffPixels number (optional)
An acceptable amount of pixels that could be different, unset by default.
maxDiffPixelRatio number (optional)
An acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1 , unset by default.
threshold number (optional)
An acceptable perceived color difference between the same pixel in compared images, ranging from 0 (strict) and 1 (lax). "pixelmatch" comparator computes color difference in YIQ color space and defaults threshold value to 0.2.
Configuration for the expect(value).toMatchSnapshot() method.
toPass Object (optional)
intervals Array<number> (optional)
Probe intervals for toPass method in milliseconds.
timeout number (optional)
Timeout for toPass method in milliseconds.
Configuration for the expect(value).toPass() method.

failOnFlakyTests
Added in: v1.52 
Whether to exit with an error if any tests are marked as flaky. Useful on CI.
Also available in the command line with the --fail-on-flaky-tests option.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 failOnFlakyTests: !!process.env.CI,
});
Type
boolean

forbidOnly
Added in: v1.10 
Whether to exit with an error if any tests or groups are marked as test.only() or test.describe.only(). Useful on CI.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 forbidOnly: !!process.env.CI,
});
Type
boolean

fullyParallel
Added in: v1.20 
Playwright Test runs tests in parallel. In order to achieve that, it runs several worker processes that run at the same time. By default, test files are run in parallel. Tests in a single file are run in order, in the same worker process.
You can configure entire test run to concurrently execute all tests in all files using this option.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 fullyParallel: true,
});
Type
boolean

globalSetup
Added in: v1.10 
Path to the global setup file. This file will be required and run before all the tests. It must export a single function that takes a FullConfig argument. Pass an array of paths to specify multiple global setup files.
Learn more about global setup and teardown.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 globalSetup: './global-setup',
});
Type
string | Array<string>

globalTeardown
Added in: v1.10 
Path to the global teardown file. This file will be required and run after all the tests. It must export a single function. See also testConfig.globalSetup. Pass an array of paths to specify multiple global teardown files.
Learn more about global setup and teardown.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 globalTeardown: './global-teardown',
});
Type
string | Array<string>

globalTimeout
Added in: v1.10 
Maximum time in milliseconds the whole test suite can run. Zero timeout (default) disables this behavior. Useful on CI to prevent broken setup from running too long and wasting resources. Learn more about various timeouts.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 globalTimeout: process.env.CI ? 60 * 60 * 1000 : undefined,
});
Type
number

grep
Added in: v1.10 
Filter to only run tests with a title matching one of the patterns. For example, passing grep: /cart/ should only run tests with "cart" in the title. Also available in the command line with the -g option. The regular expression will be tested against the string that consists of the project name, the test file name, the test.describe name (if any), the test name and the test tags divided by spaces, e.g. chromium my-test.spec.ts my-suite my-test.
grep option is also useful for tagging tests.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 grep: /smoke/,
});
Type
RegExp | Array<RegExp>

grepInvert
Added in: v1.10 
Filter to only run tests with a title not matching one of the patterns. This is the opposite of testConfig.grep. Also available in the command line with the --grep-invert option.
grepInvert option is also useful for tagging tests.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 grepInvert: /manual/,
});
Type
RegExp | Array<RegExp>

ignoreSnapshots
Added in: v1.26 
Whether to skip snapshot expectations, such as expect(value).toMatchSnapshot() and await expect(page).toHaveScreenshot().
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 ignoreSnapshots: !process.env.CI,
});
Type
boolean

maxFailures
Added in: v1.10 
The maximum number of test failures for the whole test suite run. After reaching this number, testing will stop and exit with an error. Setting to zero (default) disables this behavior.
Also available in the command line with the --max-failures and -x options.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 maxFailures: process.env.CI ? 1 : 0,
});
Type
number

metadata
Added in: v1.10 
Metadata contains key-value pairs to be included in the report. For example, HTML report will display it as key-value pairs, and JSON report will include metadata serialized as json.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 metadata: { title: 'acceptance tests' },
});
Type
Metadata

name
Added in: v1.10 
Config name is visible in the report and during test execution, unless overridden by testProject.name.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 name: 'acceptance tests',
});
Type
string

outputDir
Added in: v1.10 
The output directory for files created during test execution. Defaults to <package.json-directory>/test-results.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 outputDir: './test-results',
});
Type
string
Details
This directory is cleaned at the start. When running a test, a unique subdirectory inside the testConfig.outputDir is created, guaranteeing that test running in parallel do not conflict. This directory can be accessed by testInfo.outputDir and testInfo.outputPath().
Here is an example that uses testInfo.outputPath() to create a temporary file.
import { test, expect } from '@playwright/test';
import fs from 'fs';


test('example test', async ({}, testInfo) => {
 const file = testInfo.outputPath('temporary-file.txt');
 await fs.promises.writeFile(file, 'Put some data to the file', 'utf8');
});

preserveOutput
Added in: v1.10 
Whether to preserve test output in the testConfig.outputDir. Defaults to 'always'.
'always' - preserve output for all tests;
'never' - do not preserve output for any tests;
'failures-only' - only preserve output for failed tests.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 preserveOutput: 'always',
});
Type
"always" | "never" | "failures-only"

projects
Added in: v1.10 
Playwright Test supports running multiple test projects at the same time. See TestProject for more information.
Usage
playwright.config.ts
import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
 projects: [
   { name: 'chromium', use: devices['Desktop Chrome'] }
 ]
});
Type
Array<TestProject>

quiet
Added in: v1.10 
Whether to suppress stdio and stderr output from the tests.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 quiet: !!process.env.CI,
});
Type
boolean

repeatEach
Added in: v1.10 
The number of times to repeat each test, useful for debugging flaky tests.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 repeatEach: 3,
});
Type
number

reportSlowTests
Added in: v1.10 
Whether to report slow test files. Pass null to disable this feature.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 reportSlowTests: null,
});
Type
null | Object
max number
The maximum number of slow test files to report. Defaults to 5.
threshold number
Test file duration in milliseconds that is considered slow. Defaults to 5 minutes.
Details
Test files that took more than threshold milliseconds are considered slow, and the slowest ones are reported, no more than max number of them. Passing zero as max reports all test files that exceed the threshold.

reporter
Added in: v1.10 
The list of reporters to use. Each reporter can be:
A builtin reporter name like 'list' or 'json'.
A module name like 'my-awesome-reporter'.
A relative path to the reporter like './reporters/my-awesome-reporter.js'.
You can pass options to the reporter in a tuple like ['json', { outputFile: './report.json' }].
Learn more in the reporters guide.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 reporter: 'line',
});
Type
string | Array<Object> | "list" | "dot" | "line" | "github" | "json" | "junit" | "null" | "html"
0 string
Reporter name or module or file path
1 Object
An object with reporter options if any

respectGitIgnore
Added in: v1.45 
Whether to skip entries from .gitignore when searching for test files. By default, if neither testConfig.testDir nor testProject.testDir are explicitly specified, Playwright will ignore any test files matching .gitignore entries.
Usage
testConfig.respectGitIgnore
Type
boolean

retries
Added in: v1.10 
The maximum number of retry attempts given to failed tests. By default failing tests are not retried. Learn more about test retries.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 retries: 2,
});
Type
number

shard
Added in: v1.10 
Shard tests and execute only the selected shard. Specify in the one-based form like { total: 5, current: 2 }.
Learn more about parallelism and sharding with Playwright Test.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 shard: { total: 10, current: 3 },
});
Type
null | Object
current number
The index of the shard to execute, one-based.
total number
The total number of shards.

snapshotPathTemplate
Added in: v1.28 
This option configures a template controlling location of snapshots generated by expect(page).toHaveScreenshot(), expect(locator).toMatchAriaSnapshot() and expect(value).toMatchSnapshot().
You can configure templates for each assertion separately in testConfig.expect.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 testDir: './tests',


 // Single template for all assertions
 snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',


 // Assertion-specific templates
 expect: {
   toHaveScreenshot: {
     pathTemplate: '{testDir}/__screenshots__{/projectName}/{testFilePath}/{arg}{ext}',
   },
   toMatchAriaSnapshot: {
     pathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
   },
 },
});
Type
string
Details
The value might include some "tokens" that will be replaced with actual values during test execution.
Consider the following file structure:
playwright.config.ts
tests/
└── page/
   └── page-click.spec.ts
And the following page-click.spec.ts that uses toHaveScreenshot() call:
page-click.spec.ts
import { test, expect } from '@playwright/test';


test.describe('suite', () => {
 test('test should work', async ({ page }) => {
   await expect(page).toHaveScreenshot(['foo', 'bar', 'baz.png']);
 });
});
The list of supported tokens:
{arg} - Relative snapshot path without extension. This comes from the arguments passed to toHaveScreenshot(), toMatchAriaSnapshot() or toMatchSnapshot(); if called without arguments, this will be an auto-generated snapshot name.
Value: foo/bar/baz
{ext} - Snapshot extension (with the leading dot).
Value: .png
{platform} - The value of process.platform.
{projectName} - Project's file-system-sanitized name, if any.
Value: '' (empty string).
{snapshotDir} - Project's testProject.snapshotDir.
Value: /home/playwright/tests (since snapshotDir is not provided in config, it defaults to testDir)
{testDir} - Project's testProject.testDir.
Value: /home/playwright/tests (absolute path since testDir is resolved relative to directory with config)
{testFileDir} - Directories in relative path from testDir to test file.
Value: page
{testFileName} - Test file name with extension.
Value: page-click.spec.ts
{testFilePath} - Relative path from testDir to test file.
Value: page/page-click.spec.ts
{testName} - File-system-sanitized test title, including parent describes but excluding file name.
Value: suite-test-should-work
Each token can be preceded with a single character that will be used only if this token has non-empty value.
Consider the following config:
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 snapshotPathTemplate: '__screenshots__{/projectName}/{testFilePath}/{arg}{ext}',
 testMatch: 'example.spec.ts',
 projects: [
   { use: { browserName: 'firefox' } },
   { name: 'chromium', use: { browserName: 'chromium' } },
 ],
});
In this config:
First project does not have a name, so its snapshots will be stored in <configDir>/__screenshots__/example.spec.ts/....
Second project does have a name, so its snapshots will be stored in <configDir>/__screenshots__/chromium/example.spec.ts/...
Since snapshotPathTemplate resolves to relative path, it will be resolved relative to configDir.
Forward slashes "/" can be used as path separators on any platform.

testDir
Added in: v1.10 
Directory that will be recursively scanned for test files. Defaults to the directory of the configuration file.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 testDir: './tests/playwright',
});
Type
string

testIgnore
Added in: v1.10 
Files matching one of these patterns are not executed as test files. Matching is performed against the absolute file path. Strings are treated as glob patterns.
For example, '**/test-assets/**' will ignore any files in the test-assets directory.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 testIgnore: '**/test-assets/**',
});
Type
string | RegExp | Array<string | RegExp>

testMatch
Added in: v1.10 
Only the files matching one of these patterns are executed as test files. Matching is performed against the absolute file path. Strings are treated as glob patterns.
By default, Playwright looks for files matching the following glob pattern: **/*.@(spec|test).?(c|m)[jt]s?(x). This means JavaScript or TypeScript files with ".test" or ".spec" suffix, for example login-screen.wrong-credentials.spec.ts.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 testMatch: /.*\.e2e\.js/,
});
Type
string | RegExp | Array<string | RegExp>

timeout
Added in: v1.10 
Timeout for each test in milliseconds. Defaults to 30 seconds.
This is a base timeout for all tests. In addition, each test can configure its own timeout with test.setTimeout(). Learn more about various timeouts.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 timeout: 5 * 60 * 1000,
});
Type
number

tsconfig
Added in: v1.49 
Path to a single tsconfig applicable to all imported files. By default, tsconfig for each imported file is looked up separately. Note that tsconfig property has no effect while the configuration file or any of its dependencies are loaded. Ignored when --tsconfig command line option is specified.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 tsconfig: './tsconfig.test.json',
});
Type
string

updateSnapshots
Added in: v1.10 
Whether to update expected snapshots with the actual results produced by the test run. Defaults to 'missing'.
'all' - All tests that are executed will update snapshots.
'changed' - All tests that are executed will update snapshots that did not match. Matching snapshots will not be updated.
'missing' - Missing snapshots are created, for example when authoring a new test and running it for the first time. This is the default.
'none' - No snapshots are updated.
Learn more about snapshots.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 updateSnapshots: 'missing',
});
Type
"all" | "changed" | "missing" | "none"

updateSourceMethod
Added in: v1.50 
Defines how to update snapshots in the source code.
'patch' - Create a unified diff file that can be used to update the source code later. This is the default.
'3way' - Generate merge conflict markers in source code. This allows user to manually pick relevant changes, as if they are resolving a merge conflict in the IDE.
'overwrite' - Overwrite the source code with the new snapshot values.
Usage
testConfig.updateSourceMethod
Type
"overwrite" | "3way" | "patch"

use
Added in: v1.10 
Global options for all tests, for example testOptions.browserName. Learn more about configuration and see available options.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   browserName: 'chromium',
 },
});
Type
TestOptions

webServer
Added in: v1.10 
Launch a development web server (or multiple) during the tests.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
 webServer: {
   command: 'npm run start',
   url: 'http://localhost:3000',
   timeout: 120 * 1000,
   reuseExistingServer: !process.env.CI,
 },
 use: {
   baseURL: 'http://localhost:3000/',
 },
});
Now you can use a relative path when navigating the page:
test.spec.ts
import { test } from '@playwright/test';


test('test', async ({ page }) => {
 // This will result in http://localhost:3000/foo
 await page.goto('/foo');
});
Multiple web servers (or background processes) can be launched:
playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
 webServer: [
   {
     command: 'npm run start',
     url: 'http://localhost:3000',
     name: 'Frontend',
     timeout: 120 * 1000,
     reuseExistingServer: !process.env.CI,
   },
   {
     command: 'npm run backend',
     url: 'http://localhost:3333',
     name: 'Backend',
     timeout: 120 * 1000,
     reuseExistingServer: !process.env.CI,
   }
 ],
 use: {
   baseURL: 'http://localhost:3000',
 },
});
Type
Object | Array<Object>
command string
Shell command to start. For example npm run start..
cwd string (optional)
Current working directory of the spawned process, defaults to the directory of the configuration file.
env Object<string, string> (optional)
Environment variables to set for the command, process.env by default.
gracefulShutdown Object (optional)
signal "SIGINT" | "SIGTERM"
timeout number
How to shut down the process. If unspecified, the process group is forcefully SIGKILLed. If set to { signal: 'SIGTERM', timeout: 500 }, the process group is sent a SIGTERM signal, followed by SIGKILL if it doesn't exit within 500ms. You can also use SIGINT as the signal instead. A 0 timeout means no SIGKILL will be sent. Windows doesn't support SIGTERM and SIGINT signals, so this option is ignored on Windows. Note that shutting down a Docker container requires SIGTERM.
ignoreHTTPSErrors boolean (optional)
Whether to ignore HTTPS errors when fetching the url. Defaults to false.
name string (optional)
Specifies a custom name for the web server. This name will be prefixed to log messages. Defaults to [WebServer].
port number (optional)
The port that your http server is expected to appear on. It does wait until it accepts connections. Either port or url should be specified.
reuseExistingServer boolean (optional)
If true, it will re-use an existing server on the port or url when available. If no server is running on that port or url, it will run the command to start a new server. If false, it will throw if an existing process is listening on the port or url. This should be commonly set to !process.env.CI to allow the local dev server when running tests locally.
stderr "pipe" | "ignore" (optional)
Whether to pipe the stderr of the command to the process stderr or ignore it. Defaults to "pipe".
stdout "pipe" | "ignore" (optional)
If "pipe", it will pipe the stdout of the command to the process stdout. If "ignore", it will ignore the stdout of the command. Default to "ignore".
timeout number (optional)
How long to wait for the process to start up and be available in milliseconds. Defaults to 60000.
url string (optional)
The url on your http server that is expected to return a 2xx, 3xx, 400, 401, 402, or 403 status code when the server is ready to accept connections. Redirects (3xx status codes) are being followed and the new location is checked. Either port or url should be specified.
Details
If the port is specified, Playwright Test will wait for it to be available on 127.0.0.1 or ::1, before running the tests. If the url is specified, Playwright Test will wait for the URL to return a 2xx, 3xx, 400, 401, 402, or 403 status code before running the tests.
For continuous integration, you may want to use the reuseExistingServer: !process.env.CI option which does not use an existing server on the CI. To see the stdout, you can set the DEBUG=pw:webserver environment variable.
The port (but not the url) gets passed over to Playwright as a testOptions.baseURL. For example port 8080 produces baseURL equal http://localhost:8080. If webServer is specified as an array, you must explicitly configure the baseURL (even if it only has one entry).
NOTE
It is also recommended to specify testOptions.baseURL in the config, so that tests could use relative urls.

workers
Added in: v1.10 
The maximum number of concurrent worker processes to use for parallelizing tests. Can also be set as percentage of logical CPU cores, e.g. '50%'.
Playwright Test uses worker processes to run tests. There is always at least one worker process, but more can be used to speed up test execution.
Defaults to half of the number of logical CPU cores. Learn more about parallelism and sharding with Playwright Test.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 workers: 3,
});
Type
number | string

Deprecated
snapshotDir
Added in: v1.10 
DISCOURAGED
Use testConfig.snapshotPathTemplate to configure snapshot paths.
The base directory, relative to the config file, for snapshot files created with toMatchSnapshot. Defaults to testConfig.testDir.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 snapshotDir: './snapshots',
});
Type
string
Details
The directory for each test can be accessed by testInfo.snapshotDir and testInfo.snapshotPath().
This path will serve as the base directory for each test file snapshot directory. Setting snapshotDir to 'snapshots', the testInfo.snapshotDir would resolve to snapshots/a.spec.js-snapshots.
Previous
Playwright Test
Next
TestInfo
Properties
build
captureGitInfo
expect
failOnFlakyTests
forbidOnly
fullyParallel
globalSetup
globalTeardown
globalTimeout
grep
grepInvert
ignoreSnapshots
maxFailures
metadata
name
outputDir
preserveOutput
projects
quiet
repeatEach
reportSlowTests
reporter
respectGitIgnore
retries
shard
snapshotPathTemplate
testDir
testIgnore
testMatch
timeout
tsconfig
updateSnapshots
updateSourceMethod
use
webServer
workers
Deprecated
snapshotDir
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
TestInfo
TestInfo contains information about currently running test. It is available to test functions, test.beforeEach(), test.afterEach(), test.beforeAll() and test.afterAll() hooks, and test-scoped fixtures. TestInfo provides utilities to control test execution: attach files, update test timeout, determine which test is currently running and whether it was retried, etc.
import { test, expect } from '@playwright/test';


test('basic test', async ({ page }, testInfo) => {
 expect(testInfo.title).toBe('basic test');
 await page.screenshot(testInfo.outputPath('screenshot.png'));
});

Methods
attach
Added in: v1.10 
Attach a value or a file from disk to the current test. Some reporters show test attachments. Either path or body must be specified, but not both.
For example, you can attach a screenshot to the test:
import { test, expect } from '@playwright/test';


test('basic test', async ({ page }, testInfo) => {
 await page.goto('https://playwright.dev');
 const screenshot = await page.screenshot();
 await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
});
Or you can attach files returned by your APIs:
import { test, expect } from '@playwright/test';
import { download } from './my-custom-helpers';


test('basic test', async ({}, testInfo) => {
 const tmpPath = await download('a');
 await testInfo.attach('downloaded', { path: tmpPath });
});
NOTE
testInfo.attach() automatically takes care of copying attached files to a location that is accessible to reporters. You can safely remove the attachment after awaiting the attach call.
Usage
await testInfo.attach(name);
await testInfo.attach(name, options);
Arguments
name string#
Attachment name. The name will also be sanitized and used as the prefix of file name when saving to disk.
options Object (optional)
body string | Buffer (optional)#
Attachment body. Mutually exclusive with path.
contentType string (optional)#
Content type of this attachment to properly present in the report, for example 'application/json' or 'image/png'. If omitted, content type is inferred based on the path, or defaults to text/plain for string attachments and application/octet-stream for Buffer attachments.
path string (optional)#
Path on the filesystem to the attached file. Mutually exclusive with body.
Returns
Promise<void>#

fail()
Added in: v1.10 
Marks the currently running test as "should fail". Playwright Test runs this test and ensures that it is actually failing. This is useful for documentation purposes to acknowledge that some functionality is broken until it is fixed. This is similar to test.fail().
Usage
testInfo.fail();

fail(condition)
Added in: v1.10 
Conditionally mark the currently running test as "should fail" with an optional description. This is similar to test.fail().
Usage
testInfo.fail(condition);
testInfo.fail(condition, description);
Arguments
condition boolean#
Test is marked as "should fail" when the condition is true.
description string (optional)#
Optional description that will be reflected in a test report.

fixme()
Added in: v1.10 
Mark a test as "fixme", with the intention to fix it. Test is immediately aborted. This is similar to test.fixme().
Usage
testInfo.fixme();

fixme(condition)
Added in: v1.10 
Conditionally mark the currently running test as "fixme" with an optional description. This is similar to test.fixme().
Usage
testInfo.fixme(condition);
testInfo.fixme(condition, description);
Arguments
condition boolean#
Test is marked as "fixme" when the condition is true.
description string (optional)#
Optional description that will be reflected in a test report.

outputPath
Added in: v1.10 
Returns a path inside the testInfo.outputDir where the test can safely put a temporary file. Guarantees that tests running in parallel will not interfere with each other.
import { test, expect } from '@playwright/test';
import fs from 'fs';


test('example test', async ({}, testInfo) => {
 const file = testInfo.outputPath('dir', 'temporary-file.txt');
 await fs.promises.writeFile(file, 'Put some data to the dir/temporary-file.txt', 'utf8');
});
Note that pathSegments accepts path segments to the test output directory such as testInfo.outputPath('relative', 'path', 'to', 'output'). However, this path must stay within the testInfo.outputDir directory for each test (i.e. test-results/a-test-title), otherwise it will throw.
Usage
testInfo.outputPath(...pathSegments);
Arguments
...pathSegments Array<string>#
Path segments to append at the end of the resulting path.
Returns
string#

setTimeout
Added in: v1.10 
Changes the timeout for the currently running test. Zero means no timeout. Learn more about various timeouts.
Timeout is usually specified in the configuration file, but it could be useful to change the timeout in certain scenarios:
import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }, testInfo) => {
 // Extend timeout for all tests running this hook by 30 seconds.
 testInfo.setTimeout(testInfo.timeout + 30000);
});
Usage
testInfo.setTimeout(timeout);
Arguments
timeout number#
Timeout in milliseconds.

skip()
Added in: v1.10 
Unconditionally skip the currently running test. Test is immediately aborted. This is similar to test.skip().
Usage
testInfo.skip();

skip(condition)
Added in: v1.10 
Conditionally skips the currently running test with an optional description. This is similar to test.skip().
Usage
testInfo.skip(condition);
testInfo.skip(condition, description);
Arguments
condition boolean#
A skip condition. Test is skipped when the condition is true.
description string (optional)#
Optional description that will be reflected in a test report.

slow()
Added in: v1.10 
Marks the currently running test as "slow", giving it triple the default timeout. This is similar to test.slow().
Usage
testInfo.slow();

slow(condition)
Added in: v1.10 
Conditionally mark the currently running test as "slow" with an optional description, giving it triple the default timeout. This is similar to test.slow().
Usage
testInfo.slow(condition);
testInfo.slow(condition, description);
Arguments
condition boolean#
Test is marked as "slow" when the condition is true.
description string (optional)#
Optional description that will be reflected in a test report.

snapshotPath
Added in: v1.10 
Returns a path to a snapshot file with the given name. Pass kind to obtain a specific path:
kind: 'screenshot' for expect(page).toHaveScreenshot();
kind: 'aria' for expect(locator).toMatchAriaSnapshot();
kind: 'snapshot' for expect(value).toMatchSnapshot().
Usage
await expect(page).toHaveScreenshot('header.png');
// Screenshot assertion above expects screenshot at this path:
const screenshotPath = test.info().snapshotPath('header.png', { kind: 'screenshot' });


await expect(page.getByRole('main')).toMatchAriaSnapshot({ name: 'main.aria.yml' });
// Aria snapshot assertion above expects snapshot at this path:
const ariaSnapshotPath = test.info().snapshotPath('main.aria.yml', { kind: 'aria' });


expect('some text').toMatchSnapshot('snapshot.txt');
// Snapshot assertion above expects snapshot at this path:
const snapshotPath = test.info().snapshotPath('snapshot.txt');


expect('some text').toMatchSnapshot(['dir', 'subdir', 'snapshot.txt']);
// Snapshot assertion above expects snapshot at this path:
const nestedPath = test.info().snapshotPath('dir', 'subdir', 'snapshot.txt');
Arguments
...name Array<string>#
The name of the snapshot or the path segments to define the snapshot file path. Snapshots with the same name in the same test file are expected to be the same.
When passing kind, multiple name segments are not supported.
options Object (optional)
kind "snapshot" | "screenshot" | "aria" (optional) Added in: v1.53#
The snapshot kind controls which snapshot path template is used. See testConfig.snapshotPathTemplate for more details. Defaults to 'snapshot'.
Returns
string#

Properties
annotations
Added in: v1.10 
The list of annotations applicable to the current test. Includes annotations from the test, annotations from all test.describe() groups the test belongs to and file-level annotations for the test file.
Learn more about test annotations.
Usage
testInfo.annotations
Type
Array<Object>
type string
Annotation type, for example 'skip' or 'fail'.
description string (optional)
Optional description.
location Location (optional)
Optional location in the source where the annotation is added.

attachments
Added in: v1.10 
The list of files or buffers attached to the current test. Some reporters show test attachments.
To add an attachment, use testInfo.attach() instead of directly pushing onto this array.
Usage
testInfo.attachments
Type
Array<Object>
name string
Attachment name.
contentType string
Content type of this attachment to properly present in the report, for example 'application/json' or 'image/png'.
path string (optional)
Optional path on the filesystem to the attached file.
body Buffer (optional)
Optional attachment body used instead of a file.

column
Added in: v1.10 
Column number where the currently running test is declared.
Usage
testInfo.column
Type
number

config
Added in: v1.10 
Processed configuration from the configuration file.
Usage
testInfo.config
Type
FullConfig

duration
Added in: v1.10 
The number of milliseconds the test took to finish. Always zero before the test finishes, either successfully or not. Can be used in test.afterEach() hook.
Usage
testInfo.duration
Type
number

error
Added in: v1.10 
First error thrown during test execution, if any. This is equal to the first element in testInfo.errors.
Usage
testInfo.error
Type
TestInfoError

errors
Added in: v1.10 
Errors thrown during test execution, if any.
Usage
testInfo.errors
Type
Array<TestInfoError>

expectedStatus
Added in: v1.10 
Expected status for the currently running test. This is usually 'passed', except for a few cases:
'skipped' for skipped tests, e.g. with test.skip();
'failed' for tests marked as failed with test.fail().
Expected status is usually compared with the actual testInfo.status:
import { test, expect } from '@playwright/test';


test.afterEach(async ({}, testInfo) => {
 if (testInfo.status !== testInfo.expectedStatus)
   console.log(`${testInfo.title} did not run as expected!`);
});
Usage
testInfo.expectedStatus
Type
"passed" | "failed" | "timedOut" | "skipped" | "interrupted"

file
Added in: v1.10 
Absolute path to a file where the currently running test is declared.
Usage
testInfo.file
Type
string

fn
Added in: v1.10 
Test function as passed to test(title, testFunction).
Usage
testInfo.fn
Type
function

line
Added in: v1.10 
Line number where the currently running test is declared.
Usage
testInfo.line
Type
number

outputDir
Added in: v1.10 
Absolute path to the output directory for this specific test run. Each test run gets its own directory so they cannot conflict.
Usage
testInfo.outputDir
Type
string

parallelIndex
Added in: v1.10 
The index of the worker between 0 and workers - 1. It is guaranteed that workers running at the same time have a different parallelIndex. When a worker is restarted, for example after a failure, the new worker process has the same parallelIndex.
Also available as process.env.TEST_PARALLEL_INDEX. Learn more about parallelism and sharding with Playwright Test.
Usage
testInfo.parallelIndex
Type
number

project
Added in: v1.10 
Processed project configuration from the configuration file.
Usage
testInfo.project
Type
FullProject

repeatEachIndex
Added in: v1.10 
Specifies a unique repeat index when running in "repeat each" mode. This mode is enabled by passing --repeat-each to the command line.
Usage
testInfo.repeatEachIndex
Type
number

retry
Added in: v1.10 
Specifies the retry number when the test is retried after a failure. The first test run has testInfo.retry equal to zero, the first retry has it equal to one, and so on. Learn more about retries.
import { test, expect } from '@playwright/test';


test.beforeEach(async ({}, testInfo) => {
 // You can access testInfo.retry in any hook or fixture.
 if (testInfo.retry > 0)
   console.log(`Retrying!`);
});


test('my test', async ({ page }, testInfo) => {
 // Here we clear some server-side state when retrying.
 if (testInfo.retry)
   await cleanSomeCachesOnTheServer();
 // ...
});
Usage
testInfo.retry
Type
number

snapshotDir
Added in: v1.10 
Absolute path to the snapshot output directory for this specific test. Each test suite gets its own directory so they cannot conflict.
This property does not account for the testProject.snapshotPathTemplate configuration.
Usage
testInfo.snapshotDir
Type
string

snapshotSuffix
Added in: v1.10 
NOTE
Use of testInfo.snapshotSuffix is discouraged. Please use testConfig.snapshotPathTemplate to configure snapshot paths.
Suffix used to differentiate snapshots between multiple test configurations. For example, if snapshots depend on the platform, you can set testInfo.snapshotSuffix equal to process.platform. In this case expect(value).toMatchSnapshot(snapshotName) will use different snapshots depending on the platform. Learn more about snapshots.
Usage
testInfo.snapshotSuffix
Type
string

status
Added in: v1.10 
Actual status for the currently running test. Available after the test has finished in test.afterEach() hook and fixtures.
Status is usually compared with the testInfo.expectedStatus:
import { test, expect } from '@playwright/test';


test.afterEach(async ({}, testInfo) => {
 if (testInfo.status !== testInfo.expectedStatus)
   console.log(`${testInfo.title} did not run as expected!`);
});
Usage
testInfo.status
Type
"passed" | "failed" | "timedOut" | "skipped" | "interrupted"

tags
Added in: v1.43 
Tags that apply to the test. Learn more about tags.
NOTE
Any changes made to this list while the test is running will not be visible to test reporters.
Usage
testInfo.tags
Type
Array<string>

testId
Added in: v1.32 
Test id matching the test case id in the reporter API.
Usage
testInfo.testId
Type
string

timeout
Added in: v1.10 
Timeout in milliseconds for the currently running test. Zero means no timeout. Learn more about various timeouts.
Timeout is usually specified in the configuration file
import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }, testInfo) => {
 // Extend timeout for all tests running this hook by 30 seconds.
 testInfo.setTimeout(testInfo.timeout + 30000);
});
Usage
testInfo.timeout
Type
number

title
Added in: v1.10 
The title of the currently running test as passed to test(title, testFunction).
Usage
testInfo.title
Type
string

titlePath
Added in: v1.10 
The full title path starting with the test file name.
Usage
testInfo.titlePath
Type
Array<string>

workerIndex
Added in: v1.10 
The unique index of the worker process that is running the test. When a worker is restarted, for example after a failure, the new worker process gets a new unique workerIndex.
Also available as process.env.TEST_WORKER_INDEX. Learn more about parallelism and sharding with Playwright Test.
Usage
testInfo.workerIndex
Type
number
Previous
TestConfig
Next
TestInfoError
Methods
attach
fail()
fail(condition)
fixme()
fixme(condition)
outputPath
setTimeout
skip()
skip(condition)
slow()
slow(condition)
snapshotPath
Properties
annotations
attachments
column
config
duration
error
errors
expectedStatus
file
fn
line
outputDir
parallelIndex
project
repeatEachIndex
retry
snapshotDir
snapshotSuffix
status
tags
testId
timeout
title
titlePath
workerIndex
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
TestInfoError
Information about an error thrown during test execution.

Properties
cause
Added in: v1.49 
Error cause. Set when there is a cause for the error. Will be undefined if there is no cause or if the cause is not an instance of Error.
Usage
testInfoError.cause
Type
TestInfoError

message
Added in: v1.10 
Error message. Set when Error (or its subclass) has been thrown.
Usage
testInfoError.message
Type
string

stack
Added in: v1.10 
Error stack. Set when Error (or its subclass) has been thrown.
Usage
testInfoError.stack
Type
string

value
Added in: v1.10 
The value that was thrown. Set when anything except the Error (or its subclass) has been thrown.
Usage
testInfoError.value
Type
string
Previous
TestInfo
Next
TestOptions
Properties
cause
message
stack
value
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
TestOptions
Playwright Test provides many options to configure test environment, Browser, BrowserContext and more.
These options are usually provided in the configuration file through testConfig.use and testProject.use.
playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
 use: {
   headless: false,
   viewport: { width: 1280, height: 720 },
   ignoreHTTPSErrors: true,
   video: 'on-first-retry',
 },
});
Alternatively, with test.use() you can override some options for a file.
example.spec.ts
import { test, expect } from '@playwright/test';


// Run tests in this file with portrait-like viewport.
test.use({ viewport: { width: 600, height: 900 } });


test('my portrait test', async ({ page }) => {
 // ...
});

Properties
acceptDownloads
Added in: v1.10 
Whether to automatically download all the attachments. Defaults to true where all the downloads are accepted.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   acceptDownloads: false,
 },
});
Type
boolean

actionTimeout
Added in: v1.10 
Default timeout for each Playwright action in milliseconds, defaults to 0 (no timeout).
This is a default timeout for all Playwright actions, same as configured via page.setDefaultTimeout().
Usage
import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
 use: {
   /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
   actionTimeout: 0,
 },
});
Learn more about various timeouts.
Type
number

baseURL
Added in: v1.10 
When using page.goto(), page.route(), page.waitForURL(), page.waitForRequest(), or page.waitForResponse() it takes the base URL in consideration by using the URL() constructor for building the corresponding URL. Unset by default. Examples:
baseURL: http://localhost:3000 and navigating to /bar.html results in http://localhost:3000/bar.html
baseURL: http://localhost:3000/foo/ and navigating to ./bar.html results in http://localhost:3000/foo/bar.html
baseURL: http://localhost:3000/foo (without trailing slash) and navigating to ./bar.html results in http://localhost:3000/bar.html
Usage
import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
 use: {
   /* Base URL to use in actions like `await page.goto('/')`. */
   baseURL: 'http://localhost:3000',
 },
});
Type
string

browserName
Added in: v1.10 
Name of the browser that runs tests. Defaults to 'chromium'. Most of the time you should set browserName in your TestConfig:
Usage
playwright.config.ts
import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
 use: {
   browserName: 'firefox',
 },
});
Type
"chromium" | "firefox" | "webkit"

bypassCSP
Added in: v1.10 
Toggles bypassing page's Content-Security-Policy. Defaults to false.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   bypassCSP: true,
 }
});
Type
boolean

channel
Added in: v1.10 
Browser distribution channel.
Use "chromium" to opt in to new headless mode.
Use "chrome", "chrome-beta", "chrome-dev", "chrome-canary", "msedge", "msedge-beta", "msedge-dev", or "msedge-canary" to use branded Google Chrome and Microsoft Edge.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 projects: [
   {
     name: 'Microsoft Edge',
     use: {
       ...devices['Desktop Edge'],
       channel: 'msedge'
     },
   },
 ]
});
Type
string

clientCertificates
Added in: 1.46 
TLS Client Authentication allows the server to request a client certificate and verify it.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   clientCertificates: [{
     origin: 'https://example.com',
     certPath: './cert.pem',
     keyPath: './key.pem',
     passphrase: 'mysecretpassword',
   }],
 },
});
Type
Array<Object>
origin string
Exact origin that the certificate is valid for. Origin includes https protocol, a hostname and optionally a port.
certPath string (optional)
Path to the file with the certificate in PEM format.
cert Buffer (optional)
Direct value of the certificate in PEM format.
keyPath string (optional)
Path to the file with the private key in PEM format.
key Buffer (optional)
Direct value of the private key in PEM format.
pfxPath string (optional)
Path to the PFX or PKCS12 encoded private key and certificate chain.
pfx Buffer (optional)
Direct value of the PFX or PKCS12 encoded private key and certificate chain.
passphrase string (optional)
Passphrase for the private key (PEM or PFX).
Details
An array of client certificates to be used. Each certificate object must have either both certPath and keyPath, a single pfxPath, or their corresponding direct value equivalents (cert and key, or pfx). Optionally, passphrase property should be provided if the certificate is encrypted. The origin property should be provided with an exact match to the request origin that the certificate is valid for.
NOTE
When using WebKit on macOS, accessing localhost will not pick up client certificates. You can make it work by replacing localhost with local.playwright.

colorScheme
Added in: v1.10 
Emulates prefers-colors-scheme media feature, supported values are 'light' and 'dark'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'light'.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   colorScheme: 'dark',
 },
});
Type
null | "light" | "dark" | "no-preference"

connectOptions
Added in: v1.10 
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   connectOptions: {
     wsEndpoint: 'ws://localhost:5678',
   },
 },
});
When connect options are specified, default fixtures.browser, fixtures.context and fixtures.page use the remote browser instead of launching a browser locally, and any launch options like testOptions.headless or testOptions.channel are ignored.
Type
void | Object
wsEndpoint string
A browser websocket endpoint to connect to.
headers void | Object<string, string> (optional)
Additional HTTP headers to be sent with web socket connect request. Optional.
timeout number (optional)
Timeout in milliseconds for the connection to be established. Optional, defaults to no timeout.
exposeNetwork string (optional)
Option to expose network available on the connecting client to the browser being connected to. See browserType.connect() for more details.

contextOptions
Added in: v1.10 
Options used to create the context, as passed to browser.newContext(). Specific options like testOptions.viewport take priority over this.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   contextOptions: {
     reducedMotion: 'reduce',
   },
 },
});
Type
Object

deviceScaleFactor
Added in: v1.10 
Specify device scale factor (can be thought of as dpr). Defaults to 1. Learn more about emulating devices with device scale factor.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   viewport: { width: 2560, height: 1440 },
   deviceScaleFactor: 2,
 },
});
Type
number

extraHTTPHeaders
Added in: v1.10 
An object containing additional HTTP headers to be sent with every request. Defaults to none.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   extraHTTPHeaders: {
     'X-My-Header': 'value',
   },
 },
});
Type
Object<string, string>

geolocation
Added in: v1.10 
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   geolocation: { longitude: 12.492507, latitude: 41.889938 },
 },
});
Learn more about geolocation.
Type
Object
latitude number
Latitude between -90 and 90.
longitude number
Longitude between -180 and 180.
accuracy number (optional)
Non-negative accuracy value. Defaults to 0.

hasTouch
Added in: v1.10 
Specifies if viewport supports touch events. Defaults to false. Learn more about mobile emulation.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   hasTouch: true
 },
});
Type
boolean

headless
Added in: v1.10 
Whether to run browser in headless mode. More details for Chromium and Firefox. Defaults to true unless the devtools option is true.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   headless: false
 },
});
Type
boolean

httpCredentials
Added in: v1.10 
Credentials for HTTP authentication. If no origin is specified, the username and password are sent to any servers upon unauthorized responses.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   httpCredentials: {
     username: 'user',
     password: 'pass',
   },
 },
});
Type
Object
username string
password string
origin string (optional)
Restrain sending http credentials on specific origin (scheme://host:port).
send "unauthorized" | "always" (optional)
This option only applies to the requests sent from corresponding APIRequestContext and does not affect requests sent from the browser. 'always' - Authorization header with basic authentication credentials will be sent with the each API request. 'unauthorized - the credentials are only sent when 401 (Unauthorized) response with WWW-Authenticate header is received. Defaults to 'unauthorized'.

ignoreHTTPSErrors
Added in: v1.10 
Whether to ignore HTTPS errors when sending network requests. Defaults to false.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   ignoreHTTPSErrors: true,
 },
});
Type
boolean

isMobile
Added in: v1.10 
Whether the meta viewport tag is taken into account and touch events are enabled. isMobile is a part of device, so you don't actually need to set it manually. Defaults to false and is not supported in Firefox. Learn more about mobile emulation.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   isMobile: false,
 },
});
Type
boolean

javaScriptEnabled
Added in: v1.10 
Whether or not to enable JavaScript in the context. Defaults to true. Learn more about disabling JavaScript.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   javaScriptEnabled: false,
 },
});
Type
boolean

launchOptions
Added in: v1.10 
Options used to launch the browser, as passed to browserType.launch(). Specific options testOptions.headless and testOptions.channel take priority over this.
WARNING
Use custom browser args at your own risk, as some of them may break Playwright functionality.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 projects: [
   {
     name: 'chromium',
     use: {
       ...devices['Desktop Chrome'],
       launchOptions: {
         args: ['--start-maximized']
       }
     }
   }
 ]
});
Type
Object

locale
Added in: v1.10 
Specify user locale, for example en-GB, de-DE, etc. Locale will affect navigator.language value, Accept-Language request header value as well as number and date formatting rules. Defaults to en-US. Learn more about emulation in our emulation guide.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   locale: 'it-IT',
 },
});
Type
string

navigationTimeout
Added in: v1.10 
Timeout for each navigation action in milliseconds. Defaults to 0 (no timeout).
This is a default navigation timeout, same as configured via page.setDefaultNavigationTimeout().
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   navigationTimeout: 3000,
 },
});
Learn more about various timeouts.
Type
number

offline
Added in: v1.10 
Whether to emulate network being offline. Defaults to false. Learn more about network emulation.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   offline: true
 },
});
Type
boolean

permissions
Added in: v1.10 
A list of permissions to grant to all pages in this context. See browserContext.grantPermissions() for more details. Defaults to none.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   permissions: ['notifications'],
 },
});
Type
Array<string>

proxy
Added in: v1.10 
Network proxy settings.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   proxy: {
     server: 'http://myproxy.com:3128',
     bypass: 'localhost',
   },
 },
});
Type
Object
server string
Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example http://myproxy.com:3128 or socks5://myproxy.com:3128. Short form myproxy.com:3128 is considered an HTTP proxy.
bypass string (optional)
Optional comma-separated domains to bypass proxy, for example ".com, chromium.org, .domain.com".
username string (optional)
Optional username to use if HTTP proxy requires authentication.
password string (optional)
Optional password to use if HTTP proxy requires authentication.

screenshot
Added in: v1.10 
Whether to automatically capture a screenshot after each test. Defaults to 'off'.
'off': Do not capture screenshots.
'on': Capture screenshot after each test.
'only-on-failure': Capture screenshot after each test failure.
'on-first-failure': Capture screenshot after each test's first failure.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   screenshot: 'only-on-failure',
 },
});
Learn more about automatic screenshots.
Type
Object | "off" | "on" | "only-on-failure" | "on-first-failure"
mode "off" | "on" | "only-on-failure" | "on-first-failure"
Automatic screenshot mode.
fullPage boolean (optional)
When true, takes a screenshot of the full scrollable page, instead of the currently visible viewport. Defaults to false.
omitBackground boolean (optional)
Hides default white background and allows capturing screenshots with transparency. Not applicable to jpeg images. Defaults to false.

serviceWorkers
Added in: v1.10 
Whether to allow sites to register Service workers. Defaults to 'allow'.
'allow': Service Workers can be registered.
'block': Playwright will block all registration of Service Workers.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   serviceWorkers: 'allow'
 },
});
Type
"allow" | "block"

storageState
Added in: v1.10 
Learn more about storage state and auth.
Populates context with given storage state. This option can be used to initialize context with logged-in information obtained via browserContext.storageState().
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   storageState: 'storage-state.json',
 },
});
Type
string | Object
cookies Array<Object>
name string
value string
domain string
Domain and path are required. For the cookie to apply to all subdomains as well, prefix domain with a dot, like this: ".example.com"
path string
Domain and path are required
expires number
Unix time in seconds.
httpOnly boolean
secure boolean
sameSite "Strict" | "Lax" | "None"
sameSite flag
Cookies to set for context
origins Array<Object>
origin string
localStorage Array<Object>
name string
value string
localStorage to set for context
Details
When storage state is set up in the config, it is possible to reset storage state for a file:
not-signed-in.spec.ts
import { test } from '@playwright/test';


// Reset storage state for this file to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });


test('not signed in test', async ({ page }) => {
 // ...
});

testIdAttribute
Added in: v1.27 
Custom attribute to be used in page.getByTestId(). data-testid is used by default.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   testIdAttribute: 'pw-test-id',
 },
});

timezoneId
Added in: v1.10 
Changes the timezone of the context. See ICU's metaZones.txt for a list of supported timezone IDs. Defaults to the system timezone.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   timezoneId: 'Europe/Rome',
 },
});
Type
string

trace
Added in: v1.10 
Whether to record trace for each test. Defaults to 'off'.
'off': Do not record trace.
'on': Record trace for each test.
'on-first-retry': Record trace only when retrying a test for the first time.
'on-all-retries': Record trace only when retrying a test.
'retain-on-failure': Record trace for each test. When test run passes, remove the recorded trace.
'retain-on-first-failure': Record trace for the first run of each test, but not for retries. When test run passes, remove the recorded trace.
For more control, pass an object that specifies mode and trace features to enable.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   trace: 'on-first-retry'
 },
});
Learn more about recording trace.
Type
Object | "off" | "on" | "retain-on-failure" | "on-first-retry" | "retain-on-first-failure"
mode "off" | "on" | "retain-on-failure" | "on-first-retry" | "on-all-retries" | "retain-on-first-failure"
Trace recording mode.
attachments boolean (optional)
Whether to include test attachments. Defaults to true. Optional.
screenshots boolean (optional)
Whether to capture screenshots during tracing. Screenshots are used to build a timeline preview. Defaults to true. Optional.
snapshots boolean (optional)
Whether to capture DOM snapshot on every action. Defaults to true. Optional.
sources boolean (optional)
Whether to include source files for trace actions. Defaults to true. Optional.

userAgent
Added in: v1.10 
Specific user agent to use in this context.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   userAgent: 'some custom ua',
 },
});
Type
string

video
Added in: v1.10 
Whether to record video for each test. Defaults to 'off'.
'off': Do not record video.
'on': Record video for each test.
'retain-on-failure': Record video for each test, but remove all videos from successful test runs.
'on-first-retry': Record video only when retrying a test for the first time.
To control video size, pass an object with mode and size properties. If video size is not specified, it will be equal to testOptions.viewport scaled down to fit into 800x800. If viewport is not configured explicitly the video size defaults to 800x450. Actual picture of each page will be scaled down if necessary to fit the specified size.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   video: 'on-first-retry',
 },
});
Learn more about recording video.
Type
Object | "off" | "on" | "retain-on-failure" | "on-first-retry"
mode "off" | "on" | "retain-on-failure" | "on-first-retry"
Video recording mode.
size Object (optional)
width number
height number
Size of the recorded video. Optional.

viewport
Added in: v1.10 
Emulates consistent viewport for each page. Defaults to an 1280x720 viewport. Use null to disable the consistent viewport emulation. Learn more about viewport emulation.
NOTE
The null value opts out from the default presets, makes viewport depend on the host window size defined by the operating system. It makes the execution of the tests non-deterministic.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 use: {
   viewport: { width: 100, height: 100 },
 },
});
Type
null | Object
width number
page width in pixels.
height number
page height in pixels.
Previous
TestInfoError
Next
TestProject
Properties
acceptDownloads
actionTimeout
baseURL
browserName
bypassCSP
channel
clientCertificates
colorScheme
connectOptions
contextOptions
deviceScaleFactor
extraHTTPHeaders
geolocation
hasTouch
headless
httpCredentials
ignoreHTTPSErrors
isMobile
javaScriptEnabled
launchOptions
locale
navigationTimeout
offline
permissions
proxy
screenshot
serviceWorkers
storageState
testIdAttribute
timezoneId
trace
userAgent
video
viewport
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
TestProject
Playwright Test supports running multiple test projects at the same time. This is useful for running tests in multiple configurations. For example, consider running tests against multiple browsers. This type describes format of a project in the configuration file, to access resolved configuration parameters at run time use FullProject.
TestProject encapsulates configuration specific to a single project. Projects are configured in testConfig.projects specified in the configuration file. Note that all properties of TestProject are available in the top-level TestConfig, in which case they are shared between all projects.
Here is an example configuration that runs every test in Chromium, Firefox and WebKit, both Desktop and Mobile versions.
playwright.config.ts
import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
 // Options shared for all projects.
 timeout: 30000,
 use: {
   ignoreHTTPSErrors: true,
 },


 // Options specific to each project.
 projects: [
   {
     name: 'chromium',
     use: devices['Desktop Chrome'],
   },
   {
     name: 'firefox',
     use: devices['Desktop Firefox'],
   },
   {
     name: 'webkit',
     use: devices['Desktop Safari'],
   },
   {
     name: 'Mobile Chrome',
     use: devices['Pixel 5'],
   },
   {
     name: 'Mobile Safari',
     use: devices['iPhone 12'],
   },
 ],
});

Properties
dependencies
Added in: v1.31 
List of projects that need to run before any test in this project runs. Dependencies can be useful for configuring the global setup actions in a way that every action is in a form of a test. Passing --no-deps argument ignores the dependencies and behaves as if they were not specified.
Using dependencies allows global setup to produce traces and other artifacts, see the setup steps in the test report, etc.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 projects: [
   {
     name: 'setup',
     testMatch: /global.setup\.ts/,
   },
   {
     name: 'chromium',
     use: devices['Desktop Chrome'],
     dependencies: ['setup'],
   },
   {
     name: 'firefox',
     use: devices['Desktop Firefox'],
     dependencies: ['setup'],
   },
   {
     name: 'webkit',
     use: devices['Desktop Safari'],
     dependencies: ['setup'],
   },
 ],
});
Type
Array<string>

expect
Added in: v1.10 
Configuration for the expect assertion library.
Use testConfig.expect to change this option for all projects.
Usage
testProject.expect
Type
Object
timeout number (optional)
Default timeout for async expect matchers in milliseconds, defaults to 5000ms.
toHaveScreenshot Object (optional)
threshold number (optional)
an acceptable perceived color difference between the same pixel in compared images, ranging from 0 (strict) and 1 (lax). "pixelmatch" comparator computes color difference in YIQ color space and defaults threshold value to 0.2.
maxDiffPixels number (optional)
an acceptable amount of pixels that could be different, unset by default.
maxDiffPixelRatio number (optional)
an acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1 , unset by default.
animations "allow" | "disabled" (optional)
See animations in page.screenshot(). Defaults to "disabled".
caret "hide" | "initial" (optional)
See caret in page.screenshot(). Defaults to "hide".
scale "css" | "device" (optional)
See scale in page.screenshot(). Defaults to "css".
stylePath string | Array<string> (optional)
See style in page.screenshot().
pathTemplate string (optional)
A template controlling location of the screenshots. See testProject.snapshotPathTemplate for details.
Configuration for the expect(page).toHaveScreenshot() method.
toMatchAriaSnapshot Object (optional)
pathTemplate string (optional)
A template controlling location of the aria snapshots. See testProject.snapshotPathTemplate for details.
Configuration for the expect(locator).toMatchAriaSnapshot() method.
toMatchSnapshot Object (optional)
threshold number (optional)
an acceptable perceived color difference between the same pixel in compared images, ranging from 0 (strict) and 1 (lax). "pixelmatch" comparator computes color difference in YIQ color space and defaults threshold value to 0.2.
maxDiffPixels number (optional)
an acceptable amount of pixels that could be different, unset by default.
maxDiffPixelRatio number (optional)
an acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1 , unset by default.
Configuration for the expect(value).toMatchSnapshot() method.
toPass Object (optional)
timeout number (optional)
timeout for toPass method in milliseconds.
intervals Array<number> (optional)
probe intervals for toPass method in milliseconds.
Configuration for the expect(value).toPass() method.

fullyParallel
Added in: v1.10 
Playwright Test runs tests in parallel. In order to achieve that, it runs several worker processes that run at the same time. By default, test files are run in parallel. Tests in a single file are run in order, in the same worker process.
You can configure entire test project to concurrently run all tests in all files using this option.
Usage
testProject.fullyParallel
Type
boolean

grep
Added in: v1.10 
Filter to only run tests with a title matching one of the patterns. For example, passing grep: /cart/ should only run tests with "cart" in the title. Also available globally and in the command line with the -g option. The regular expression will be tested against the string that consists of the project name, the test file name, the test.describe name (if any), the test name and the test tags divided by spaces, e.g. chromium my-test.spec.ts my-suite my-test.
grep option is also useful for tagging tests.
Usage
testProject.grep
Type
RegExp | Array<RegExp>

grepInvert
Added in: v1.10 
Filter to only run tests with a title not matching one of the patterns. This is the opposite of testProject.grep. Also available globally and in the command line with the --grep-invert option.
grepInvert option is also useful for tagging tests.
Usage
testProject.grepInvert
Type
RegExp | Array<RegExp>

ignoreSnapshots
Added in: v1.44 
Whether to skip snapshot expectations, such as expect(value).toMatchSnapshot() and await expect(page).toHaveScreenshot().
Usage
The following example will only perform screenshot assertions on Chromium.
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 projects: [
   {
     name: 'chromium',
     use: devices['Desktop Chrome'],
   },
   {
     name: 'firefox',
     use: devices['Desktop Firefox'],
     ignoreSnapshots: true,
   },
   {
     name: 'webkit',
     use: devices['Desktop Safari'],
     ignoreSnapshots: true,
   },
 ],
});
Type
boolean

metadata
Added in: v1.10 
Metadata that will be put directly to the test report serialized as JSON.
Usage
testProject.metadata
Type
Metadata

name
Added in: v1.10 
Project name is visible in the report and during test execution.
WARNING
Playwright executes the configuration file multiple times. Do not dynamically produce non-stable values in your configuration.
Usage
testProject.name
Type
string

outputDir
Added in: v1.10 
The output directory for files created during test execution. Defaults to <package.json-directory>/test-results.
This directory is cleaned at the start. When running a test, a unique subdirectory inside the testProject.outputDir is created, guaranteeing that test running in parallel do not conflict. This directory can be accessed by testInfo.outputDir and testInfo.outputPath().
Here is an example that uses testInfo.outputPath() to create a temporary file.
import { test, expect } from '@playwright/test';
import fs from 'fs';


test('example test', async ({}, testInfo) => {
 const file = testInfo.outputPath('temporary-file.txt');
 await fs.promises.writeFile(file, 'Put some data to the file', 'utf8');
});
Use testConfig.outputDir to change this option for all projects.
Usage
testProject.outputDir
Type
string

repeatEach
Added in: v1.10 
The number of times to repeat each test, useful for debugging flaky tests.
Use testConfig.repeatEach to change this option for all projects.
Usage
testProject.repeatEach
Type
number

respectGitIgnore
Added in: v1.45 
Whether to skip entries from .gitignore when searching for test files. By default, if neither testConfig.testDir nor testProject.testDir are explicitly specified, Playwright will ignore any test files matching .gitignore entries. This option allows to override that behavior.
Usage
testProject.respectGitIgnore
Type
boolean

retries
Added in: v1.10 
The maximum number of retry attempts given to failed tests. Learn more about test retries.
Use test.describe.configure() to change the number of retries for a specific file or a group of tests.
Use testConfig.retries to change this option for all projects.
Usage
testProject.retries
Type
number

snapshotDir
Added in: v1.10 
The base directory, relative to the config file, for snapshot files created with toMatchSnapshot. Defaults to testProject.testDir.
The directory for each test can be accessed by testInfo.snapshotDir and testInfo.snapshotPath().
This path will serve as the base directory for each test file snapshot directory. Setting snapshotDir to 'snapshots', the testInfo.snapshotDir would resolve to snapshots/a.spec.js-snapshots.
Usage
testProject.snapshotDir
Type
string

snapshotPathTemplate
Added in: v1.28 
This option configures a template controlling location of snapshots generated by expect(page).toHaveScreenshot(), expect(locator).toMatchAriaSnapshot() and expect(value).toMatchSnapshot().
You can configure templates for each assertion separately in testConfig.expect.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 testDir: './tests',


 // Single template for all assertions
 snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',


 // Assertion-specific templates
 expect: {
   toHaveScreenshot: {
     pathTemplate: '{testDir}/__screenshots__{/projectName}/{testFilePath}/{arg}{ext}',
   },
   toMatchAriaSnapshot: {
     pathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
   },
 },
});
Type
string
Details
The value might include some "tokens" that will be replaced with actual values during test execution.
Consider the following file structure:
playwright.config.ts
tests/
└── page/
   └── page-click.spec.ts
And the following page-click.spec.ts that uses toHaveScreenshot() call:
page-click.spec.ts
import { test, expect } from '@playwright/test';


test.describe('suite', () => {
 test('test should work', async ({ page }) => {
   await expect(page).toHaveScreenshot(['foo', 'bar', 'baz.png']);
 });
});
The list of supported tokens:
{arg} - Relative snapshot path without extension. This comes from the arguments passed to toHaveScreenshot(), toMatchAriaSnapshot() or toMatchSnapshot(); if called without arguments, this will be an auto-generated snapshot name.
Value: foo/bar/baz
{ext} - Snapshot extension (with the leading dot).
Value: .png
{platform} - The value of process.platform.
{projectName} - Project's file-system-sanitized name, if any.
Value: '' (empty string).
{snapshotDir} - Project's testProject.snapshotDir.
Value: /home/playwright/tests (since snapshotDir is not provided in config, it defaults to testDir)
{testDir} - Project's testProject.testDir.
Value: /home/playwright/tests (absolute path since testDir is resolved relative to directory with config)
{testFileDir} - Directories in relative path from testDir to test file.
Value: page
{testFileName} - Test file name with extension.
Value: page-click.spec.ts
{testFilePath} - Relative path from testDir to test file.
Value: page/page-click.spec.ts
{testName} - File-system-sanitized test title, including parent describes but excluding file name.
Value: suite-test-should-work
Each token can be preceded with a single character that will be used only if this token has non-empty value.
Consider the following config:
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 snapshotPathTemplate: '__screenshots__{/projectName}/{testFilePath}/{arg}{ext}',
 testMatch: 'example.spec.ts',
 projects: [
   { use: { browserName: 'firefox' } },
   { name: 'chromium', use: { browserName: 'chromium' } },
 ],
});
In this config:
First project does not have a name, so its snapshots will be stored in <configDir>/__screenshots__/example.spec.ts/....
Second project does have a name, so its snapshots will be stored in <configDir>/__screenshots__/chromium/example.spec.ts/...
Since snapshotPathTemplate resolves to relative path, it will be resolved relative to configDir.
Forward slashes "/" can be used as path separators on any platform.

teardown
Added in: v1.34 
Name of a project that needs to run after this and all dependent projects have finished. Teardown is useful to cleanup any resources acquired by this project.
Passing --no-deps argument ignores testProject.teardown and behaves as if it was not specified.
Usage
A common pattern is a "setup" dependency that has a corresponding "teardown":
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 projects: [
   {
     name: 'setup',
     testMatch: /global.setup\.ts/,
     teardown: 'teardown',
   },
   {
     name: 'teardown',
     testMatch: /global.teardown\.ts/,
   },
   {
     name: 'chromium',
     use: devices['Desktop Chrome'],
     dependencies: ['setup'],
   },
   {
     name: 'firefox',
     use: devices['Desktop Firefox'],
     dependencies: ['setup'],
   },
   {
     name: 'webkit',
     use: devices['Desktop Safari'],
     dependencies: ['setup'],
   },
 ],
});
Type
string

testDir
Added in: v1.10 
Directory that will be recursively scanned for test files. Defaults to the directory of the configuration file.
Each project can use a different directory. Here is an example that runs smoke tests in three browsers and all other tests in stable Chrome browser.
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 projects: [
   {
     name: 'Smoke Chromium',
     testDir: './smoke-tests',
     use: {
       browserName: 'chromium',
     }
   },
   {
     name: 'Smoke WebKit',
     testDir: './smoke-tests',
     use: {
       browserName: 'webkit',
     }
   },
   {
     name: 'Smoke Firefox',
     testDir: './smoke-tests',
     use: {
       browserName: 'firefox',
     }
   },
   {
     name: 'Chrome Stable',
     testDir: './',
     use: {
       browserName: 'chromium',
       channel: 'chrome',
     }
   },
 ],
});
Use testConfig.testDir to change this option for all projects.
Usage
testProject.testDir
Type
string

testIgnore
Added in: v1.10 
Files matching one of these patterns are not executed as test files. Matching is performed against the absolute file path. Strings are treated as glob patterns.
For example, '**/test-assets/**' will ignore any files in the test-assets directory.
Use testConfig.testIgnore to change this option for all projects.
Usage
testProject.testIgnore
Type
string | RegExp | Array<string | RegExp>

testMatch
Added in: v1.10 
Only the files matching one of these patterns are executed as test files. Matching is performed against the absolute file path. Strings are treated as glob patterns.
By default, Playwright looks for files matching the following glob pattern: **/*.@(spec|test).?(c|m)[jt]s?(x). This means JavaScript or TypeScript files with ".test" or ".spec" suffix, for example login-screen.wrong-credentials.spec.ts.
Use testConfig.testMatch to change this option for all projects.
Usage
testProject.testMatch
Type
string | RegExp | Array<string | RegExp>

timeout
Added in: v1.10 
Timeout for each test in milliseconds. Defaults to 30 seconds.
This is a base timeout for all tests. Each test can configure its own timeout with test.setTimeout(). Each file or a group of tests can configure the timeout with test.describe.configure().
Use testConfig.timeout to change this option for all projects.
Usage
testProject.timeout
Type
number

use
Added in: v1.10 
Options for all tests in this project, for example testOptions.browserName. Learn more about configuration and see available options.
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 projects: [
   {
     name: 'Chromium',
     use: {
       browserName: 'chromium',
     },
   },
 ],
});
Use testConfig.use to change this option for all projects.
Usage
testProject.use
Type
TestOptions

workers
Added in: v1.52 
The maximum number of concurrent worker processes to use for parallelizing tests from this project. Can also be set as percentage of logical CPU cores, e.g. '50%'.
This could be useful, for example, when all tests from a project share a single resource like a test account, and therefore cannot be executed in parallel. Limiting workers to one for such a project will prevent simultaneous use of the shared resource.
Note that the global testConfig.workers limit applies to the total number of worker processes. However, Playwright will limit the number of workers used for this project by the value of testProject.workers.
By default, there is no limit per project. See testConfig.workers for the default of the total worker limit.
Usage
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 workers: 10,  // total workers limit


 projects: [
   {
     name: 'runs in parallel',
   },
   {
     name: 'one at a time',
     workers: 1,  // workers limit for this project
   },
 ],
});
Type
number | string
Previous
TestOptions
Next
TestStepInfo
Properties
dependencies
expect
fullyParallel
grep
grepInvert
ignoreSnapshots
metadata
name
outputDir
repeatEach
respectGitIgnore
retries
snapshotDir
snapshotPathTemplate
teardown
testDir
testIgnore
testMatch
timeout
use
workers
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
TestStepInfo
TestStepInfo contains information about currently running test step. It is passed as an argument to the step function. TestStepInfo provides utilities to control test step execution.
import { test, expect } from '@playwright/test';


test('basic test', async ({ page, browserName }) => {
 await test.step('check some behavior', async step => {
   step.skip(browserName === 'webkit', 'The feature is not available in WebKit');
   // ... rest of the step code
 });
});

Methods
attach
Added in: v1.51 
Attach a value or a file from disk to the current test step. Some reporters show test step attachments. Either path or body must be specified, but not both. Calling this method will attribute the attachment to the step, as opposed to testInfo.attach() which stores all attachments at the test level.
For example, you can attach a screenshot to the test step:
import { test, expect } from '@playwright/test';


test('basic test', async ({ page }) => {
 await page.goto('https://playwright.dev');
 await test.step('check page rendering', async step => {
   const screenshot = await page.screenshot();
   await step.attach('screenshot', { body: screenshot, contentType: 'image/png' });
 });
});
Or you can attach files returned by your APIs:
import { test, expect } from '@playwright/test';
import { download } from './my-custom-helpers';


test('basic test', async ({}) => {
 await test.step('check download behavior', async step => {
   const tmpPath = await download('a');
   await step.attach('downloaded', { path: tmpPath });
 });
});
NOTE
testStepInfo.attach() automatically takes care of copying attached files to a location that is accessible to reporters. You can safely remove the attachment after awaiting the attach call.
Usage
await testStepInfo.attach(name);
await testStepInfo.attach(name, options);
Arguments
name string#
Attachment name. The name will also be sanitized and used as the prefix of file name when saving to disk.
options Object (optional)
body string | Buffer (optional)#
Attachment body. Mutually exclusive with path.
contentType string (optional)#
Content type of this attachment to properly present in the report, for example 'application/json' or 'image/png'. If omitted, content type is inferred based on the path, or defaults to text/plain for string attachments and application/octet-stream for Buffer attachments.
path string (optional)#
Path on the filesystem to the attached file. Mutually exclusive with body.
Returns
Promise<void>#

skip()
Added in: v1.51 
Abort the currently running step and mark it as skipped. Useful for steps that are currently failing and planned for a near-term fix.
Usage
import { test, expect } from '@playwright/test';


test('my test', async ({ page }) => {
 await test.step('check expectations', async step => {
   step.skip();
   // step body below will not run
   // ...
 });
});

skip(condition)
Added in: v1.51 
Conditionally abort the currently running step and mark it as skipped with an optional description. Useful for steps that should not be executed in some cases.
Usage
import { test, expect } from '@playwright/test';


test('my test', async ({ page, isMobile }) => {
 await test.step('check desktop expectations', async step => {
   step.skip(isMobile, 'not present in the mobile layout');
   // step body below will not run
   // ...
 });
});
Arguments
condition boolean#
A skip condition. Test step is skipped when the condition is true.
description string (optional)#
Optional description that will be reflected in a test report.
Previous
TestProject
Next
WorkerInfo
Methods
attach
skip()
skip(condition)
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
WorkerInfo
WorkerInfo contains information about the worker that is running tests and is available to worker-scoped fixtures. WorkerInfo is a subset of TestInfo that is available in many other places.

Properties
config
Added in: v1.10 
Processed configuration from the configuration file.
Usage
workerInfo.config
Type
FullConfig

parallelIndex
Added in: v1.10 
The index of the worker between 0 and workers - 1. It is guaranteed that workers running at the same time have a different parallelIndex. When a worker is restarted, for example after a failure, the new worker process has the same parallelIndex.
Also available as process.env.TEST_PARALLEL_INDEX. Learn more about parallelism and sharding with Playwright Test.
Usage
workerInfo.parallelIndex
Type
number

project
Added in: v1.10 
Processed project configuration from the configuration file.
Usage
workerInfo.project
Type
FullProject

workerIndex
Added in: v1.10 
The unique index of the worker process that is running the test. When a worker is restarted, for example after a failure, the new worker process gets a new unique workerIndex.
Also available as process.env.TEST_WORKER_INDEX. Learn more about parallelism and sharding with Playwright Test.
Usage
workerInfo.workerIndex
Type
number
Previous
TestStepInfo
Next
Reporter
Properties
config
parallelIndex
project
workerIndex
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Reporter
Test runner notifies the reporter about various events during test execution. All methods of the reporter are optional.
You can create a custom reporter by implementing a class with some of the reporter methods. Make sure to export this class as default.
TypeScript
JavaScript
my-awesome-reporter.ts
import type {
 Reporter, FullConfig, Suite, TestCase, TestResult, FullResult
} from '@playwright/test/reporter';


class MyReporter implements Reporter {
 constructor(options: { customOption?: string } = {}) {
   console.log(`my-awesome-reporter setup with customOption set to ${options.customOption}`);
 }


 onBegin(config: FullConfig, suite: Suite) {
   console.log(`Starting the run with ${suite.allTests().length} tests`);
 }


 onTestBegin(test: TestCase) {
   console.log(`Starting test ${test.title}`);
 }


 onTestEnd(test: TestCase, result: TestResult) {
   console.log(`Finished test ${test.title}: ${result.status}`);
 }


 onEnd(result: FullResult) {
   console.log(`Finished the run: ${result.status}`);
 }
}
export default MyReporter;
Now use this reporter with testConfig.reporter. Learn more about using reporters.
playwright.config.ts
import { defineConfig } from '@playwright/test';


export default defineConfig({
 reporter: [['./my-awesome-reporter.ts', { customOption: 'some value' }]],
});
Here is a typical order of reporter calls:
reporter.onBegin() is called once with a root suite that contains all other suites and tests. Learn more about suites hierarchy.
reporter.onTestBegin() is called for each test run. It is given a TestCase that is executed, and a TestResult that is almost empty. Test result will be populated while the test runs (for example, with steps and stdio) and will get final status once the test finishes.
reporter.onStepBegin() and reporter.onStepEnd() are called for each executed step inside the test. When steps are executed, test run has not finished yet.
reporter.onTestEnd() is called when test run has finished. By this time, TestResult is complete and you can use testResult.status, testResult.error and more.
reporter.onEnd() is called once after all tests that should run had finished.
reporter.onExit() is called immediately before the test runner exits.
Additionally, reporter.onStdOut() and reporter.onStdErr() are called when standard output is produced in the worker process, possibly during a test execution, and reporter.onError() is called when something went wrong outside of the test execution.
If your custom reporter does not print anything to the terminal, implement reporter.printsToStdio() and return false. This way, Playwright will use one of the standard terminal reporters in addition to your custom reporter to enhance user experience.
Merged report API notes
When merging multiple blob reports via merge-reports CLI command, the same Reporter API is called to produce final reports and all existing reporters should work without any changes. There some subtle differences though which might affect some custom reporters.
Projects from different shards are always kept as separate TestProject objects. E.g. if project 'Desktop Chrome' was sharded across 5 machines then there will be 5 instances of projects with the same name in the config passed to reporter.onBegin().

Methods
onBegin
Added in: v1.10 
Called once before running tests. All tests have been already discovered and put into a hierarchy of Suites.
Usage
reporter.onBegin(config, suite);
Arguments
config FullConfig#
Resolved configuration.
suite Suite#
The root suite that contains all projects, files and test cases.

onEnd
Added in: v1.10 
Called after all tests have been run, or testing has been interrupted. Note that this method may return a Promise and Playwright Test will await it. Reporter is allowed to override the status and hence affect the exit code of the test runner.
Usage
await reporter.onEnd(result);
Arguments
result Object#
status "passed" | "failed" | "timedout" | "interrupted"
Test run status.
startTime Date
Test run start wall time.
duration number
Test run duration in milliseconds.
Result of the full test run, status can be one of:
'passed' - Everything went as expected.
'failed' - Any test has failed.
'timedout' - The testConfig.globalTimeout has been reached.
'interrupted' - Interrupted by the user.
Returns
Promise<Object>#
status "passed" | "failed" | "timedout" | "interrupted" (optional)

onError
Added in: v1.10 
Called on some global error, for example unhandled exception in the worker process.
Usage
reporter.onError(error);
Arguments
error TestError#
The error.

onExit
Added in: v1.33 
Called immediately before test runner exists. At this point all the reporters have received the reporter.onEnd() signal, so all the reports should be build. You can run the code that uploads the reports in this hook.
Usage
await reporter.onExit();
Returns
Promise<void>#

onStdErr
Added in: v1.10 
Called when something has been written to the standard error in the worker process.
Usage
reporter.onStdErr(chunk, test, result);
Arguments
chunk string | Buffer#
Output chunk.
test void | TestCase#
Test that was running. Note that output may happen when no test is running, in which case this will be void.
result void | TestResult#
Result of the test run, this object gets populated while the test runs.

onStdOut
Added in: v1.10 
Called when something has been written to the standard output in the worker process.
Usage
reporter.onStdOut(chunk, test, result);
Arguments
chunk string | Buffer#
Output chunk.
test void | TestCase#
Test that was running. Note that output may happen when no test is running, in which case this will be void.
result void | TestResult#
Result of the test run, this object gets populated while the test runs.

onStepBegin
Added in: v1.10 
Called when a test step started in the worker process.
Usage
reporter.onStepBegin(test, result, step);
Arguments
test TestCase#
Test that the step belongs to.
result TestResult#
Result of the test run, this object gets populated while the test runs.
step TestStep#
Test step instance that has started.

onStepEnd
Added in: v1.10 
Called when a test step finished in the worker process.
Usage
reporter.onStepEnd(test, result, step);
Arguments
test TestCase#
Test that the step belongs to.
result TestResult#
Result of the test run.
step TestStep#
Test step instance that has finished.

onTestBegin
Added in: v1.10 
Called after a test has been started in the worker process.
Usage
reporter.onTestBegin(test, result);
Arguments
test TestCase#
Test that has been started.
result TestResult#
Result of the test run, this object gets populated while the test runs.

onTestEnd
Added in: v1.10 
Called after a test has been finished in the worker process.
Usage
reporter.onTestEnd(test, result);
Arguments
test TestCase#
Test that has been finished.
result TestResult#
Result of the test run.

printsToStdio
Added in: v1.10 
Whether this reporter uses stdio for reporting. When it does not, Playwright Test could add some output to enhance user experience. If your reporter does not print to the terminal, it is strongly recommended to return false.
Usage
reporter.printsToStdio();
Returns
boolean#
Previous
WorkerInfo
Next
Suite
Methods
onBegin
onEnd
onError
onExit
onStdErr
onStdOut
onStepBegin
onStepEnd
onTestBegin
onTestEnd
printsToStdio
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Suite
Suite is a group of tests. All tests in Playwright Test form the following hierarchy:
Root suite has a child suite for each FullProject.
Project suite #1. Has a child suite for each test file in the project.
File suite #1
TestCase #1
TestCase #2
Suite corresponding to a test.describe() group
TestCase #1 in a group
TestCase #2 in a group
< more test cases ... >
File suite #2
< more file suites ... >
Project suite #2
< more project suites ... >
Reporter is given a root suite in the reporter.onBegin() method.

Methods
allTests
Added in: v1.10 
Returns the list of all test cases in this suite and its descendants, as opposite to suite.tests.
Usage
suite.allTests();
Returns
Array<TestCase>#

entries
Added in: v1.44 
Test cases and suites defined directly in this suite. The elements are returned in their declaration order. You can differentiate between various entry types by using testCase.type and suite.type.
Usage
suite.entries();
Returns
Array<TestCase | Suite>#

project
Added in: v1.10 
Configuration of the project this suite belongs to, or void for the root suite.
Usage
suite.project();
Returns
FullProject | [undefined]#

titlePath
Added in: v1.10 
Returns a list of titles from the root down to this suite.
Usage
suite.titlePath();
Returns
Array<string>#

Properties
location
Added in: v1.10 
Location in the source where the suite is defined. Missing for root and project suites.
Usage
suite.location
Type
Location

parent
Added in: v1.10 
Parent suite, missing for the root suite.
Usage
suite.parent
Type
Suite

suites
Added in: v1.10 
Child suites. See Suite for the hierarchy of suites.
Usage
suite.suites
Type
Array<Suite>

tests
Added in: v1.10 
Test cases in the suite. Note that only test cases defined directly in this suite are in the list. Any test cases defined in nested test.describe() groups are listed in the child suite.suites.
Usage
suite.tests
Type
Array<TestCase>

title
Added in: v1.10 
Suite title.
Empty for root suite.
Project name for project suite.
File path for file suite.
Title passed to test.describe() for a group suite.
Usage
suite.title
Type
string

type
Added in: v1.44 
Returns the type of the suite. The Suites form the following hierarchy: root -> project -> file -> describe -> ...describe -> test.
Usage
suite.type
Type
"root" | "project" | "file" | "describe"
Previous
Reporter
Next
TestCase
Methods
allTests
entries
project
titlePath
Properties
location
parent
suites
tests
title
type
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
TestCase
TestCase corresponds to every test() call in a test file. When a single test() is running in multiple projects or repeated multiple times, it will have multiple TestCase objects in corresponding projects' suites.

Methods
ok
Added in: v1.10 
Whether the test is considered running fine. Non-ok tests fail the test run with non-zero exit code.
Usage
testCase.ok();
Returns
boolean#

outcome
Added in: v1.10 
Testing outcome for this test. Note that outcome is not the same as testResult.status:
Test that is expected to fail and actually fails is 'expected'.
Test that passes on a second retry is 'flaky'.
Usage
testCase.outcome();
Returns
"skipped" | "expected" | "unexpected" | "flaky"#

titlePath
Added in: v1.10 
Returns a list of titles from the root down to this test.
Usage
testCase.titlePath();
Returns
Array<string>#

Properties
annotations
Added in: v1.10 
testResult.annotations of the last test run.
Usage
testCase.annotations
Type
Array<Object>
type string
Annotation type, for example 'skip' or 'fail'.
description string (optional)
Optional description.
location Location (optional)
Optional location in the source where the annotation is added.

expectedStatus
Added in: v1.10 
Expected test status.
Tests marked as test.skip() or test.fixme() are expected to be 'skipped'.
Tests marked as test.fail() are expected to be 'failed'.
Other tests are expected to be 'passed'.
See also testResult.status for the actual status.
Usage
testCase.expectedStatus
Type
"passed" | "failed" | "timedOut" | "skipped" | "interrupted"

id
Added in: v1.25 
A test ID that is computed based on the test file name, test title and project name. The ID is unique within Playwright session.
Usage
testCase.id
Type
string

location
Added in: v1.10 
Location in the source where the test is defined.
Usage
testCase.location
Type
Location

parent
Added in: v1.10 
Suite this test case belongs to.
Usage
testCase.parent
Type
Suite

repeatEachIndex
Added in: v1.10 
Contains the repeat index when running in "repeat each" mode. This mode is enabled by passing --repeat-each to the command line.
Usage
testCase.repeatEachIndex
Type
number

results
Added in: v1.10 
Results for each run of this test.
Usage
testCase.results
Type
Array<TestResult>

retries
Added in: v1.10 
The maximum number of retries given to this test in the configuration.
Learn more about test retries.
Usage
testCase.retries
Type
number

tags
Added in: v1.42 
The list of tags defined on the test or suite via test() or test.describe(), as well as @-tokens extracted from test and suite titles.
Learn more about test tags.
Usage
testCase.tags
Type
Array<string>

timeout
Added in: v1.10 
The timeout given to the test. Affected by testConfig.timeout, testProject.timeout, test.setTimeout(), test.slow() and testInfo.setTimeout().
Usage
testCase.timeout
Type
number

title
Added in: v1.10 
Test title as passed to the test() call.
Usage
testCase.title
Type
string

type
Added in: v1.44 
Returns "test". Useful for detecting test cases in suite.entries().
Usage
testCase.type
Type
"test"
Previous
Suite
Next
TestError
Methods
ok
outcome
titlePath
Properties
annotations
expectedStatus
id
location
parent
repeatEachIndex
results
retries
tags
timeout
title
type
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
TestError
Information about an error thrown during test execution.

Properties
cause
Added in: v1.49 
Error cause. Set when there is a cause for the error. Will be undefined if there is no cause or if the cause is not an instance of Error.
Usage
testError.cause
Type
TestError

location
Added in: v1.30 
Error location in the source code.
Usage
testError.location
Type
Location

message
Added in: v1.10 
Error message. Set when Error (or its subclass) has been thrown.
Usage
testError.message
Type
string

snippet
Added in: v1.33 
Source code snippet with highlighted error.
Usage
testError.snippet
Type
string

stack
Added in: v1.10 
Error stack. Set when Error (or its subclass) has been thrown.
Usage
testError.stack
Type
string

value
Added in: v1.10 
The value that was thrown. Set when anything except the Error (or its subclass) has been thrown.
Usage
testError.value
Type
string
Previous
TestCase
Next
TestResult
Properties
cause
location
message
snippet
stack
value
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
TestResult
A result of a single TestCase run.

Properties
annotations
Added in: v1.52 
The list of annotations applicable to the current test. Includes:
annotations defined on the test or suite via test() and test.describe();
annotations implicitly added by methods test.skip(), test.fixme() and test.fail();
annotations appended to testInfo.annotations during the test execution.
Annotations are available during test execution through testInfo.annotations.
Learn more about test annotations.
Usage
testResult.annotations
Type
Array<Object>
type string
Annotation type, for example 'skip' or 'fail'.
description string (optional)
Optional description.
location Location (optional)
Optional location in the source where the annotation is added.

attachments
Added in: v1.10 
The list of files or buffers attached during the test execution through testInfo.attachments.
Usage
testResult.attachments
Type
Array<Object>
name string
Attachment name.
contentType string
Content type of this attachment to properly present in the report, for example 'application/json' or 'image/png'.
path string (optional)
Optional path on the filesystem to the attached file.
body Buffer (optional)
Optional attachment body used instead of a file.

duration
Added in: v1.10 
Running time in milliseconds.
Usage
testResult.duration
Type
number

error
Added in: v1.10 
First error thrown during test execution, if any. This is equal to the first element in testResult.errors.
Usage
testResult.error
Type
TestError

errors
Added in: v1.10 
Errors thrown during the test execution.
Usage
testResult.errors
Type
Array<TestError>

parallelIndex
Added in: v1.30 
The index of the worker between 0 and workers - 1. It is guaranteed that workers running at the same time have a different parallelIndex.
Usage
testResult.parallelIndex
Type
number

retry
Added in: v1.10 
When test is retried multiple times, each retry attempt is given a sequential number.
Learn more about test retries.
Usage
testResult.retry
Type
number

startTime
Added in: v1.10 
Start time of this particular test run.
Usage
testResult.startTime
Type
Date

status
Added in: v1.10 
The status of this test result. See also testCase.expectedStatus.
Usage
testResult.status
Type
"passed" | "failed" | "timedOut" | "skipped" | "interrupted"

stderr
Added in: v1.10 
Anything written to the standard error during the test run.
Usage
testResult.stderr
Type
Array<string | Buffer>

stdout
Added in: v1.10 
Anything written to the standard output during the test run.
Usage
testResult.stdout
Type
Array<string | Buffer>

steps
Added in: v1.10 
List of steps inside this test run.
Usage
testResult.steps
Type
Array<TestStep>

workerIndex
Added in: v1.10 
Index of the worker where the test was run. If the test was not run a single time, for example when the user interrupted testing, the only result will have a workerIndex equal to -1.
Learn more about parallelism and sharding with Playwright Test.
Usage
testResult.workerIndex
Type
number
Previous
TestError
Next
TestStep
Properties
annotations
attachments
duration
error
errors
parallelIndex
retry
startTime
status
stderr
stdout
steps
workerIndex
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
TestStep
Represents a step in the [TestRun].

Methods
titlePath
Added in: v1.10 
Returns a list of step titles from the root step down to this step.
Usage
testStep.titlePath();
Returns
Array<string>#

Properties
annotations
Added in: v1.51 
The list of annotations applicable to the current test step.
Usage
testStep.annotations
Type
Array<Object>
type string
Annotation type, for example 'skip'.
description string (optional)
Optional description.
location Location (optional)
Optional location in the source where the annotation is added.

attachments
Added in: v1.50 
The list of files or buffers attached in the step execution through testInfo.attach().
Usage
testStep.attachments
Type
Array<Object>
name string
Attachment name.
contentType string
Content type of this attachment to properly present in the report, for example 'application/json' or 'image/png'.
path string (optional)
Optional path on the filesystem to the attached file.
body Buffer (optional)
Optional attachment body used instead of a file.

category
Added in: v1.10 
Step category to differentiate steps with different origin and verbosity. Built-in categories are:
expect for expect calls
fixture for fixtures setup and teardown
hook for hooks initialization and teardown
pw:api for Playwright API calls.
test.step for test.step API calls.
test.attach for test attachmen calls.
Usage
testStep.category
Type
string

duration
Added in: v1.10 
Running time in milliseconds.
Usage
testStep.duration
Type
number

error
Added in: v1.10 
Error thrown during the step execution, if any.
Usage
testStep.error
Type
TestError

location
Added in: v1.10 
Optional location in the source where the step is defined.
Usage
testStep.location
Type
Location

parent
Added in: v1.10 
Parent step, if any.
Usage
testStep.parent
Type
TestStep

startTime
Added in: v1.10 
Start time of this particular test step.
Usage
testStep.startTime
Type
Date

steps
Added in: v1.10 
List of steps inside this step.
Usage
testStep.steps
Type
Array<TestStep>

title
Added in: v1.10 
User-friendly test step title.
Usage
testStep.title
Type
string
Previous
TestResult
Next
Android
Methods
titlePath
Properties
annotations
attachments
category
duration
error
location
parent
startTime
steps
title
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Android
Playwright has experimental support for Android automation. This includes Chrome for Android and Android WebView.
Requirements
Android device or AVD Emulator.
ADB daemon running and authenticated with your device. Typically running adb devices is all you need to do.
Chrome 87 or newer installed on the device
"Enable command line on non-rooted devices" enabled in chrome://flags.
Known limitations
Raw USB operation is not yet supported, so you need ADB.
Device needs to be awake to produce screenshots. Enabling "Stay awake" developer mode will help.
We didn't run all the tests against the device, so not everything works.
How to run
An example of the Android automation script would be:
const { _android: android } = require('playwright');


(async () => {
 // Connect to the device.
 const [device] = await android.devices();
 console.log(`Model: ${device.model()}`);
 console.log(`Serial: ${device.serial()}`);
 // Take screenshot of the whole device.
 await device.screenshot({ path: 'device.png' });


 {
   // --------------------- WebView -----------------------


   // Launch an application with WebView.
   await device.shell('am force-stop org.chromium.webview_shell');
   await device.shell('am start org.chromium.webview_shell/.WebViewBrowserActivity');
   // Get the WebView.
   const webview = await device.webView({ pkg: 'org.chromium.webview_shell' });


   // Fill the input box.
   await device.fill({
     res: 'org.chromium.webview_shell:id/url_field',
   }, 'github.com/microsoft/playwright');
   await device.press({
     res: 'org.chromium.webview_shell:id/url_field',
   }, 'Enter');


   // Work with WebView's page as usual.
   const page = await webview.page();
   await page.waitForNavigation({ url: /.*microsoft\/playwright.*/ });
   console.log(await page.title());
 }


 {
   // --------------------- Browser -----------------------


   // Launch Chrome browser.
   await device.shell('am force-stop com.android.chrome');
   const context = await device.launchBrowser();


   // Use BrowserContext as usual.
   const page = await context.newPage();
   await page.goto('https://webkit.org/');
   console.log(await page.evaluate(() => window.location.href));
   await page.screenshot({ path: 'page.png' });


   await context.close();
 }


 // Close the device.
 await device.close();
})();

Methods
connect
Added in: v1.28 
This methods attaches Playwright to an existing Android device. Use android.launchServer() to launch a new Android server instance.
Usage
await android.connect(wsEndpoint);
await android.connect(wsEndpoint, options);
Arguments
wsEndpoint string#
A browser websocket endpoint to connect to.
options Object (optional)
headers Object<string, string> (optional)#
Additional HTTP headers to be sent with web socket connect request. Optional.
slowMo number (optional)#
Slows down Playwright operations by the specified amount of milliseconds. Useful so that you can see what is going on. Defaults to 0.
timeout number (optional)#
Maximum time in milliseconds to wait for the connection to be established. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
Returns
Promise<AndroidDevice>#

devices
Added in: v1.9 
Returns the list of detected Android devices.
Usage
await android.devices();
await android.devices(options);
Arguments
options Object (optional)
host string (optional) Added in: v1.22#
Optional host to establish ADB server connection. Default to 127.0.0.1.
omitDriverInstall boolean (optional) Added in: v1.21#
Prevents automatic playwright driver installation on attach. Assumes that the drivers have been installed already.
port number (optional) Added in: v1.20#
Optional port to establish ADB server connection. Default to 5037.
Returns
Promise<Array<AndroidDevice>>#

launchServer
Added in: v1.28 
Launches Playwright Android server that clients can connect to. See the following example:
Usage
Server Side:
const { _android } = require('playwright');


(async () => {
 const browserServer = await _android.launchServer({
   // If you have multiple devices connected and want to use a specific one.
   // deviceSerialNumber: '<deviceSerialNumber>',
 });
 const wsEndpoint = browserServer.wsEndpoint();
 console.log(wsEndpoint);
})();
Client Side:
const { _android } = require('playwright');


(async () => {
 const device = await _android.connect('<wsEndpoint>');


 console.log(device.model());
 console.log(device.serial());
 await device.shell('am force-stop com.android.chrome');
 const context = await device.launchBrowser();


 const page = await context.newPage();
 await page.goto('https://webkit.org/');
 console.log(await page.evaluate(() => window.location.href));
 await page.screenshot({ path: 'page-chrome-1.png' });


 await context.close();
})();
Arguments
options Object (optional)
adbHost string (optional)#
Optional host to establish ADB server connection. Default to 127.0.0.1.
adbPort number (optional)#
Optional port to establish ADB server connection. Default to 5037.
deviceSerialNumber string (optional)#
Optional device serial number to launch the browser on. If not specified, it will throw if multiple devices are connected.
host string (optional) Added in: v1.45#
Host to use for the web socket. It is optional and if it is omitted, the server will accept connections on the unspecified IPv6 address (::) when IPv6 is available, or the unspecified IPv4 address (0.0.0.0) otherwise. Consider hardening it with picking a specific interface.
omitDriverInstall boolean (optional)#
Prevents automatic playwright driver installation on attach. Assumes that the drivers have been installed already.
port number (optional)#
Port to use for the web socket. Defaults to 0 that picks any available port.
wsPath string (optional)#
Path at which to serve the Android Server. For security, this defaults to an unguessable string.
WARNING
Any process or web page (including those running in Playwright) with knowledge of the wsPath can take control of the OS user. For this reason, you should use an unguessable token when using this option.
Returns
Promise<BrowserServer>#

setDefaultTimeout
Added in: v1.9 
This setting will change the default maximum time for all the methods accepting timeout option.
Usage
android.setDefaultTimeout(timeout);
Arguments
timeout number#
Maximum time in milliseconds
Previous
TestStep
Next
AndroidDevice
Methods
connect
devices
launchServer
setDefaultTimeout
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
AndroidDevice
AndroidDevice represents a connected device, either real hardware or emulated. Devices can be obtained using android.devices().

Methods
close
Added in: v1.9 
Disconnects from the device.
Usage
await androidDevice.close();
Returns
Promise<void>#

drag
Added in: v1.9 
Drags the widget defined by selector towards dest point.
Usage
await androidDevice.drag(selector, dest);
await androidDevice.drag(selector, dest, options);
Arguments
selector [AndroidSelector]#
Selector to drag.
dest Object#
x number
y number
Point to drag to.
options Object (optional)
speed number (optional)#
Optional speed of the drag in pixels per second.
timeout number (optional)#
Maximum time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the androidDevice.setDefaultTimeout() method.
Returns
Promise<void>#

fill
Added in: v1.9 
Fills the specific selector input box with text.
Usage
await androidDevice.fill(selector, text);
await androidDevice.fill(selector, text, options);
Arguments
selector [AndroidSelector]#
Selector to fill.
text string#
Text to be filled in the input box.
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the androidDevice.setDefaultTimeout() method.
Returns
Promise<void>#

fling
Added in: v1.9 
Flings the widget defined by selector in the specified direction.
Usage
await androidDevice.fling(selector, direction);
await androidDevice.fling(selector, direction, options);
Arguments
selector [AndroidSelector]#
Selector to fling.
direction "down" | "up" | "left" | "right"#
Fling direction.
options Object (optional)
speed number (optional)#
Optional speed of the fling in pixels per second.
timeout number (optional)#
Maximum time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the androidDevice.setDefaultTimeout() method.
Returns
Promise<void>#

info
Added in: v1.9 
Returns information about a widget defined by selector.
Usage
await androidDevice.info(selector);
Arguments
selector [AndroidSelector]#
Selector to return information about.
Returns
Promise<[AndroidElementInfo]>#

installApk
Added in: v1.9 
Installs an apk on the device.
Usage
await androidDevice.installApk(file);
await androidDevice.installApk(file, options);
Arguments
file string | Buffer#
Either a path to the apk file, or apk file content.
options Object (optional)
args Array<string> (optional)#
Optional arguments to pass to the shell:cmd package install call. Defaults to -r -t -S.
Returns
Promise<void>#

launchBrowser
Added in: v1.9 
Launches Chrome browser on the device, and returns its persistent context.
Usage
await androidDevice.launchBrowser();
await androidDevice.launchBrowser(options);
Arguments
options Object (optional)
acceptDownloads boolean (optional)#
Whether to automatically download all the attachments. Defaults to true where all the downloads are accepted.
args Array<string> (optional) Added in: v1.29#
WARNING
Use custom browser args at your own risk, as some of them may break Playwright functionality.
Additional arguments to pass to the browser instance. The list of Chromium flags can be found here.
baseURL string (optional)#
When using page.goto(), page.route(), page.waitForURL(), page.waitForRequest(), or page.waitForResponse() it takes the base URL in consideration by using the URL() constructor for building the corresponding URL. Unset by default. Examples:
baseURL: http://localhost:3000 and navigating to /bar.html results in http://localhost:3000/bar.html
baseURL: http://localhost:3000/foo/ and navigating to ./bar.html results in http://localhost:3000/foo/bar.html
baseURL: http://localhost:3000/foo (without trailing slash) and navigating to ./bar.html results in http://localhost:3000/bar.html
bypassCSP boolean (optional)#
Toggles bypassing page's Content-Security-Policy. Defaults to false.
colorScheme null | "light" | "dark" | "no-preference" (optional)#
Emulates prefers-colors-scheme media feature, supported values are 'light' and 'dark'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'light'.
contrast null | "no-preference" | "more" (optional)#
Emulates 'prefers-contrast' media feature, supported values are 'no-preference', 'more'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'no-preference'.
deviceScaleFactor number (optional)#
Specify device scale factor (can be thought of as dpr). Defaults to 1. Learn more about emulating devices with device scale factor.
extraHTTPHeaders Object<string, string> (optional)#
An object containing additional HTTP headers to be sent with every request. Defaults to none.
forcedColors null | "active" | "none" (optional)#
Emulates 'forced-colors' media feature, supported values are 'active', 'none'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'none'.
geolocation Object (optional)#
latitude number
Latitude between -90 and 90.
longitude number
Longitude between -180 and 180.
accuracy number (optional)
Non-negative accuracy value. Defaults to 0.
hasTouch boolean (optional)#
Specifies if viewport supports touch events. Defaults to false. Learn more about mobile emulation.
httpCredentials Object (optional)#
username string
password string
origin string (optional)
Restrain sending http credentials on specific origin (scheme://host:port).
send "unauthorized" | "always" (optional)
This option only applies to the requests sent from corresponding APIRequestContext and does not affect requests sent from the browser. 'always' - Authorization header with basic authentication credentials will be sent with the each API request. 'unauthorized - the credentials are only sent when 401 (Unauthorized) response with WWW-Authenticate header is received. Defaults to 'unauthorized'.
Credentials for HTTP authentication. If no origin is specified, the username and password are sent to any servers upon unauthorized responses.
ignoreHTTPSErrors boolean (optional)#
Whether to ignore HTTPS errors when sending network requests. Defaults to false.
isMobile boolean (optional)#
Whether the meta viewport tag is taken into account and touch events are enabled. isMobile is a part of device, so you don't actually need to set it manually. Defaults to false and is not supported in Firefox. Learn more about mobile emulation.
javaScriptEnabled boolean (optional)#
Whether or not to enable JavaScript in the context. Defaults to true. Learn more about disabling JavaScript.
locale string (optional)#
Specify user locale, for example en-GB, de-DE, etc. Locale will affect navigator.language value, Accept-Language request header value as well as number and date formatting rules. Defaults to the system default locale. Learn more about emulation in our emulation guide.
logger Logger (optional)#
DEPRECATED
The logs received by the logger are incomplete. Please use tracing instead.
Logger sink for Playwright logging.
offline boolean (optional)#
Whether to emulate network being offline. Defaults to false. Learn more about network emulation.
permissions Array<string> (optional)#
A list of permissions to grant to all pages in this context. See browserContext.grantPermissions() for more details. Defaults to none.
pkg string (optional)#
Optional package name to launch instead of default Chrome for Android.
proxy Object (optional) Added in: v1.29#
server string
Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example http://myproxy.com:3128 or socks5://myproxy.com:3128. Short form myproxy.com:3128 is considered an HTTP proxy.
bypass string (optional)
Optional comma-separated domains to bypass proxy, for example ".com, chromium.org, .domain.com".
username string (optional)
Optional username to use if HTTP proxy requires authentication.
password string (optional)
Optional password to use if HTTP proxy requires authentication.
Network proxy settings.
recordHar Object (optional)#
omitContent boolean (optional)
Optional setting to control whether to omit request content from the HAR. Defaults to false. Deprecated, use content policy instead.
content "omit" | "embed" | "attach" (optional)
Optional setting to control resource content management. If omit is specified, content is not persisted. If attach is specified, resources are persisted as separate files or entries in the ZIP archive. If embed is specified, content is stored inline the HAR file as per HAR specification. Defaults to attach for .zip output files and to embed for all other file extensions.
path string
Path on the filesystem to write the HAR file to. If the file name ends with .zip, content: 'attach' is used by default.
mode "full" | "minimal" (optional)
When set to minimal, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to full.
urlFilter string | RegExp (optional)
A glob or regex pattern to filter requests that are stored in the HAR. When a baseURL via the context options was provided and the passed URL is a path, it gets merged via the new URL() constructor. Defaults to none.
Enables HAR recording for all pages into recordHar.path file. If not specified, the HAR is not recorded. Make sure to await browserContext.close() for the HAR to be saved.
recordVideo Object (optional)#
dir string
Path to the directory to put videos into.
size Object (optional)
width number
Video frame width.
height number
Video frame height.
Optional dimensions of the recorded videos. If not specified the size will be equal to viewport scaled down to fit into 800x800. If viewport is not configured explicitly the video size defaults to 800x450. Actual picture of each page will be scaled down if necessary to fit the specified size.
Enables video recording for all pages into recordVideo.dir directory. If not specified videos are not recorded. Make sure to await browserContext.close() for videos to be saved.
reducedMotion null | "reduce" | "no-preference" (optional)#
Emulates 'prefers-reduced-motion' media feature, supported values are 'reduce', 'no-preference'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'no-preference'.
screen Object (optional)#
width number
page width in pixels.
height number
page height in pixels.
Emulates consistent window screen size available inside web page via window.screen. Is only used when the viewport is set.
serviceWorkers "allow" | "block" (optional)#
Whether to allow sites to register Service workers. Defaults to 'allow'.
'allow': Service Workers can be registered.
'block': Playwright will block all registration of Service Workers.
strictSelectors boolean (optional)#
If set to true, enables strict selectors mode for this context. In the strict selectors mode all operations on selectors that imply single target DOM element will throw when more than one element matches the selector. This option does not affect any Locator APIs (Locators are always strict). Defaults to false. See Locator to learn more about the strict mode.
timezoneId string (optional)#
Changes the timezone of the context. See ICU's metaZones.txt for a list of supported timezone IDs. Defaults to the system timezone.
userAgent string (optional)#
Specific user agent to use in this context.
videoSize Object (optional)#
DEPRECATED
Use recordVideo instead.
width number
Video frame width.
height number
Video frame height.
videosPath string (optional)#
DEPRECATED
Use recordVideo instead.
viewport null | Object (optional)#
width number
page width in pixels.
height number
page height in pixels.
Emulates consistent viewport for each page. Defaults to an 1280x720 viewport. Use null to disable the consistent viewport emulation. Learn more about viewport emulation.
NOTE
The null value opts out from the default presets, makes viewport depend on the host window size defined by the operating system. It makes the execution of the tests non-deterministic.
Returns
Promise<BrowserContext>#

longTap
Added in: v1.9 
Performs a long tap on the widget defined by selector.
Usage
await androidDevice.longTap(selector);
await androidDevice.longTap(selector, options);
Arguments
selector [AndroidSelector]#
Selector to tap on.
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the androidDevice.setDefaultTimeout() method.
Returns
Promise<void>#

model
Added in: v1.9 
Device model.
Usage
androidDevice.model();
Returns
string#

open
Added in: v1.9 
Launches a process in the shell on the device and returns a socket to communicate with the launched process.
Usage
await androidDevice.open(command);
Arguments
command string#
Shell command to execute.
Returns
Promise<AndroidSocket>#

pinchClose
Added in: v1.9 
Pinches the widget defined by selector in the closing direction.
Usage
await androidDevice.pinchClose(selector, percent);
await androidDevice.pinchClose(selector, percent, options);
Arguments
selector [AndroidSelector]#
Selector to pinch close.
percent number#
The size of the pinch as a percentage of the widget's size.
options Object (optional)
speed number (optional)#
Optional speed of the pinch in pixels per second.
timeout number (optional)#
Maximum time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the androidDevice.setDefaultTimeout() method.
Returns
Promise<void>#

pinchOpen
Added in: v1.9 
Pinches the widget defined by selector in the open direction.
Usage
await androidDevice.pinchOpen(selector, percent);
await androidDevice.pinchOpen(selector, percent, options);
Arguments
selector [AndroidSelector]#
Selector to pinch open.
percent number#
The size of the pinch as a percentage of the widget's size.
options Object (optional)
speed number (optional)#
Optional speed of the pinch in pixels per second.
timeout number (optional)#
Maximum time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the androidDevice.setDefaultTimeout() method.
Returns
Promise<void>#

press
Added in: v1.9 
Presses the specific key in the widget defined by selector.
Usage
await androidDevice.press(selector, key);
await androidDevice.press(selector, key, options);
Arguments
selector [AndroidSelector]#
Selector to press the key in.
key [AndroidKey]#
The key to press.
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the androidDevice.setDefaultTimeout() method.
Returns
Promise<void>#

push
Added in: v1.9 
Copies a file to the device.
Usage
await androidDevice.push(file, path);
await androidDevice.push(file, path, options);
Arguments
file string | Buffer#
Either a path to the file, or file content.
path string#
Path to the file on the device.
options Object (optional)
mode number (optional)#
Optional file mode, defaults to 644 (rw-r--r--).
Returns
Promise<void>#

screenshot
Added in: v1.9 
Returns the buffer with the captured screenshot of the device.
Usage
await androidDevice.screenshot();
await androidDevice.screenshot(options);
Arguments
options Object (optional)
path string (optional)#
The file path to save the image to. If path is a relative path, then it is resolved relative to the current working directory. If no path is provided, the image won't be saved to the disk.
Returns
Promise<Buffer>#

scroll
Added in: v1.9 
Scrolls the widget defined by selector in the specified direction.
Usage
await androidDevice.scroll(selector, direction, percent);
await androidDevice.scroll(selector, direction, percent, options);
Arguments
selector [AndroidSelector]#
Selector to scroll.
direction "down" | "up" | "left" | "right"#
Scroll direction.
percent number#
Distance to scroll as a percentage of the widget's size.
options Object (optional)
speed number (optional)#
Optional speed of the scroll in pixels per second.
timeout number (optional)#
Maximum time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the androidDevice.setDefaultTimeout() method.
Returns
Promise<void>#

serial
Added in: v1.9 
Device serial number.
Usage
androidDevice.serial();
Returns
string#

setDefaultTimeout
Added in: v1.9 
This setting will change the default maximum time for all the methods accepting timeout option.
Usage
androidDevice.setDefaultTimeout(timeout);
Arguments
timeout number#
Maximum time in milliseconds

shell
Added in: v1.9 
Executes a shell command on the device and returns its output.
Usage
await androidDevice.shell(command);
Arguments
command string#
Shell command to execute.
Returns
Promise<Buffer>#

swipe
Added in: v1.9 
Swipes the widget defined by selector in the specified direction.
Usage
await androidDevice.swipe(selector, direction, percent);
await androidDevice.swipe(selector, direction, percent, options);
Arguments
selector [AndroidSelector]#
Selector to swipe.
direction "down" | "up" | "left" | "right"#
Swipe direction.
percent number#
Distance to swipe as a percentage of the widget's size.
options Object (optional)
speed number (optional)#
Optional speed of the swipe in pixels per second.
timeout number (optional)#
Maximum time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the androidDevice.setDefaultTimeout() method.
Returns
Promise<void>#

tap
Added in: v1.9 
Taps on the widget defined by selector.
Usage
await androidDevice.tap(selector);
await androidDevice.tap(selector, options);
Arguments
selector [AndroidSelector]#
Selector to tap on.
options Object (optional)
duration number (optional)#
Optional duration of the tap in milliseconds.
timeout number (optional)#
Maximum time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the androidDevice.setDefaultTimeout() method.
Returns
Promise<void>#

wait
Added in: v1.9 
Waits for the specific selector to either appear or disappear, depending on the state.
Usage
await androidDevice.wait(selector);
await androidDevice.wait(selector, options);
Arguments
selector [AndroidSelector]#
Selector to wait for.
options Object (optional)
state "gone" (optional)#
Optional state. Can be either:
default - wait for element to be present.
'gone' - wait for element to not be present.
timeout number (optional)#
Maximum time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the androidDevice.setDefaultTimeout() method.
Returns
Promise<void>#

waitForEvent
Added in: v1.9 
Waits for event to fire and passes its value into the predicate function. Returns when the predicate returns truthy value.
Usage
await androidDevice.waitForEvent(event);
await androidDevice.waitForEvent(event, optionsOrPredicate);
Arguments
event string#
Event name, same one typically passed into *.on(event).
optionsOrPredicate function | Object (optional)#
predicate function
receives the event data and resolves to truthy value when the waiting should resolve.
timeout number (optional)
maximum time to wait for in milliseconds. Defaults to 30000 (30 seconds). Pass 0 to disable timeout. The default value can be changed by using the androidDevice.setDefaultTimeout().
Either a predicate that receives an event or an options object. Optional.
Returns
Promise<Object>#

webView
Added in: v1.9 
This method waits until AndroidWebView matching the selector is opened and returns it. If there is already an open AndroidWebView matching the selector, returns immediately.
Usage
await androidDevice.webView(selector);
await androidDevice.webView(selector, options);
Arguments
selector Object#
pkg string (optional)
Optional Package identifier.
socketName string (optional)
Optional webview socket name.
options Object (optional)
timeout number (optional)#
Maximum time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the androidDevice.setDefaultTimeout() method.
Returns
Promise<AndroidWebView>#

webViews
Added in: v1.9 
Currently open WebViews.
Usage
androidDevice.webViews();
Returns
Array<AndroidWebView>#

Properties
input
Added in: v1.9 
Usage
androidDevice.input
Type
AndroidInput

Events
on('close')
Added in: v1.28 
Emitted when the device connection gets closed.
Usage
androidDevice.on('close', data => {});
Event data
AndroidDevice

on('webview')
Added in: v1.9 
Emitted when a new WebView instance is detected.
Usage
androidDevice.on('webview', data => {});
Event data
AndroidWebView
Previous
Android
Next
AndroidInput
Methods
close
drag
fill
fling
info
installApk
launchBrowser
longTap
model
open
pinchClose
pinchOpen
press
push
screenshot
scroll
serial
setDefaultTimeout
shell
swipe
tap
wait
waitForEvent
webView
webViews
Properties
input
Events
on('close')
on('webview')
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
AndroidInput

Methods
drag
Added in: v1.9 
Performs a drag between from and to points.
Usage
await androidInput.drag(from, to, steps);
Arguments
from Object#
x number
y number
The start point of the drag.
to Object#
x number
y number
The end point of the drag.
steps number#
The number of steps in the drag. Each step takes 5 milliseconds to complete.
Returns
Promise<void>#

press
Added in: v1.9 
Presses the key.
Usage
await androidInput.press(key);
Arguments
key [AndroidKey]#
Key to press.
Returns
Promise<void>#

swipe
Added in: v1.9 
Swipes following the path defined by segments.
Usage
await androidInput.swipe(from, segments, steps);
Arguments
from Object#
x number
y number
The point to start swiping from.
segments Array<Object>#
x number
y number
Points following the from point in the swipe gesture.
steps number#
The number of steps for each segment. Each step takes 5 milliseconds to complete, so 100 steps means half a second per each segment.
Returns
Promise<void>#

tap
Added in: v1.9 
Taps at the specified point.
Usage
await androidInput.tap(point);
Arguments
point Object#
x number
y number
The point to tap at.
Returns
Promise<void>#

type
Added in: v1.9 
Types text into currently focused widget.
Usage
await androidInput.type(text);
Arguments
text string#
Text to type.
Returns
Promise<void>#
Previous
AndroidDevice
Next
AndroidSocket
Methods
drag
press
swipe
tap
type
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
AndroidSocket
AndroidSocket is a way to communicate with a process launched on the AndroidDevice. Use androidDevice.open() to open a socket.

Methods
close
Added in: v1.9 
Closes the socket.
Usage
await androidSocket.close();
Returns
Promise<void>#

write
Added in: v1.9 
Writes some data to the socket.
Usage
await androidSocket.write(data);
Arguments
data Buffer#
Data to write.
Returns
Promise<void>#

Events
on('close')
Added in: v1.9 
Emitted when the socket is closed.
Usage
androidSocket.on('close', data => {});

on('data')
Added in: v1.9 
Emitted when data is available to read from the socket.
Usage
androidSocket.on('data', data => {});
Event data
Buffer
Previous
AndroidInput
Next
AndroidWebView
Methods
close
write
Events
on('close')
on('data')
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
AndroidWebView
AndroidWebView represents a WebView open on the AndroidDevice. WebView is usually obtained using androidDevice.webView().

Methods
page
Added in: v1.9 
Connects to the WebView and returns a regular Playwright Page to interact with.
Usage
await androidWebView.page();
Returns
Promise<Page>#

pid
Added in: v1.9 
WebView process PID.
Usage
androidWebView.pid();
Returns
number#

pkg
Added in: v1.9 
WebView package identifier.
Usage
androidWebView.pkg();
Returns
string#

Events
on('close')
Added in: v1.9 
Emitted when the WebView is closed.
Usage
androidWebView.on('close', data => {});
Previous
AndroidSocket
Next
Electron
Methods
page
pid
pkg
Events
on('close')
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
Electron
Playwright has experimental support for Electron automation. You can access electron namespace via:
const { _electron } = require('playwright');
An example of the Electron automation script would be:
const { _electron: electron } = require('playwright');


(async () => {
 // Launch Electron app.
 const electronApp = await electron.launch({ args: ['main.js'] });


 // Evaluation expression in the Electron context.
 const appPath = await electronApp.evaluate(async ({ app }) => {
   // This runs in the main Electron process, parameter here is always
   // the result of the require('electron') in the main app script.
   return app.getAppPath();
 });
 console.log(appPath);


 // Get the first window that the app opens, wait if necessary.
 const window = await electronApp.firstWindow();
 // Print the title.
 console.log(await window.title());
 // Capture a screenshot.
 await window.screenshot({ path: 'intro.png' });
 // Direct Electron console to Node terminal.
 window.on('console', console.log);
 // Click button.
 await window.click('text=Click me');
 // Exit app.
 await electronApp.close();
})();
Supported Electron versions are:
v12.2.0+
v13.4.0+
v14+
Known issues:
If you are not able to launch Electron and it will end up in timeouts during launch, try the following:
Ensure that nodeCliInspect (FuseV1Options.EnableNodeCliInspectArguments) fuse is not set to false.

Methods
launch
Added in: v1.9 
Launches electron application specified with the executablePath.
Usage
await electron.launch();
await electron.launch(options);
Arguments
options Object (optional)
acceptDownloads boolean (optional) Added in: v1.12#
Whether to automatically download all the attachments. Defaults to true where all the downloads are accepted.
args Array<string> (optional)#
Additional arguments to pass to the application when launching. You typically pass the main script name here.
bypassCSP boolean (optional) Added in: v1.12#
Toggles bypassing page's Content-Security-Policy. Defaults to false.
colorScheme null | "light" | "dark" | "no-preference" (optional) Added in: v1.12#
Emulates prefers-colors-scheme media feature, supported values are 'light' and 'dark'. See page.emulateMedia() for more details. Passing null resets emulation to system defaults. Defaults to 'light'.
cwd string (optional)#
Current working directory to launch application from.
env Object<string, string> (optional)#
Specifies environment variables that will be visible to Electron. Defaults to process.env.
executablePath string (optional)#
Launches given Electron application. If not specified, launches the default Electron executable installed in this package, located at node_modules/.bin/electron.
extraHTTPHeaders Object<string, string> (optional) Added in: v1.12#
An object containing additional HTTP headers to be sent with every request. Defaults to none.
geolocation Object (optional) Added in: v1.12#
latitude number
Latitude between -90 and 90.
longitude number
Longitude between -180 and 180.
accuracy number (optional)
Non-negative accuracy value. Defaults to 0.
httpCredentials Object (optional) Added in: v1.12#
username string
password string
origin string (optional)
Restrain sending http credentials on specific origin (scheme://host:port).
send "unauthorized" | "always" (optional)
This option only applies to the requests sent from corresponding APIRequestContext and does not affect requests sent from the browser. 'always' - Authorization header with basic authentication credentials will be sent with the each API request. 'unauthorized - the credentials are only sent when 401 (Unauthorized) response with WWW-Authenticate header is received. Defaults to 'unauthorized'.
Credentials for HTTP authentication. If no origin is specified, the username and password are sent to any servers upon unauthorized responses.
ignoreHTTPSErrors boolean (optional) Added in: v1.12#
Whether to ignore HTTPS errors when sending network requests. Defaults to false.
locale string (optional) Added in: v1.12#
Specify user locale, for example en-GB, de-DE, etc. Locale will affect navigator.language value, Accept-Language request header value as well as number and date formatting rules. Defaults to the system default locale. Learn more about emulation in our emulation guide.
offline boolean (optional) Added in: v1.12#
Whether to emulate network being offline. Defaults to false. Learn more about network emulation.
recordHar Object (optional) Added in: v1.12#
omitContent boolean (optional)
Optional setting to control whether to omit request content from the HAR. Defaults to false. Deprecated, use content policy instead.
content "omit" | "embed" | "attach" (optional)
Optional setting to control resource content management. If omit is specified, content is not persisted. If attach is specified, resources are persisted as separate files or entries in the ZIP archive. If embed is specified, content is stored inline the HAR file as per HAR specification. Defaults to attach for .zip output files and to embed for all other file extensions.
path string
Path on the filesystem to write the HAR file to. If the file name ends with .zip, content: 'attach' is used by default.
mode "full" | "minimal" (optional)
When set to minimal, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies, security and other types of HAR information that are not used when replaying from HAR. Defaults to full.
urlFilter string | RegExp (optional)
A glob or regex pattern to filter requests that are stored in the HAR. When a baseURL via the context options was provided and the passed URL is a path, it gets merged via the new URL() constructor. Defaults to none.
Enables HAR recording for all pages into recordHar.path file. If not specified, the HAR is not recorded. Make sure to await browserContext.close() for the HAR to be saved.
recordVideo Object (optional) Added in: v1.12#
dir string
Path to the directory to put videos into.
size Object (optional)
width number
Video frame width.
height number
Video frame height.
Optional dimensions of the recorded videos. If not specified the size will be equal to viewport scaled down to fit into 800x800. If viewport is not configured explicitly the video size defaults to 800x450. Actual picture of each page will be scaled down if necessary to fit the specified size.
Enables video recording for all pages into recordVideo.dir directory. If not specified videos are not recorded. Make sure to await browserContext.close() for videos to be saved.
timeout number (optional) Added in: v1.15#
Maximum time in milliseconds to wait for the application to start. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
timezoneId string (optional) Added in: v1.12#
Changes the timezone of the context. See ICU's metaZones.txt for a list of supported timezone IDs. Defaults to the system timezone.
tracesDir string (optional) Added in: v1.36#
If specified, traces are saved into this directory.
Returns
Promise<ElectronApplication>#
Previous
AndroidWebView
Next
ElectronApplication
Methods
launch
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft
ElectronApplication
Electron application representation. You can use electron.launch() to obtain the application instance. This instance you can control main electron process as well as work with Electron windows:
const { _electron: electron } = require('playwright');


(async () => {
 // Launch Electron app.
 const electronApp = await electron.launch({ args: ['main.js'] });


 // Evaluation expression in the Electron context.
 const appPath = await electronApp.evaluate(async ({ app }) => {
   // This runs in the main Electron process, parameter here is always
   // the result of the require('electron') in the main app script.
   return app.getAppPath();
 });
 console.log(appPath);


 // Get the first window that the app opens, wait if necessary.
 const window = await electronApp.firstWindow();
 // Print the title.
 console.log(await window.title());
 // Capture a screenshot.
 await window.screenshot({ path: 'intro.png' });
 // Direct Electron console to Node terminal.
 window.on('console', console.log);
 // Click button.
 await window.click('text=Click me');
 // Exit app.
 await electronApp.close();
})();

Methods
browserWindow
Added in: v1.11 
Returns the BrowserWindow object that corresponds to the given Playwright page.
Usage
await electronApplication.browserWindow(page);
Arguments
page Page#
Page to retrieve the window for.
Returns
Promise<JSHandle>#

close
Added in: v1.9 
Closes Electron application.
Usage
await electronApplication.close();
Returns
Promise<void>#

context
Added in: v1.9 
This method returns browser context that can be used for setting up context-wide routing, etc.
Usage
electronApplication.context();
Returns
BrowserContext#

evaluate
Added in: v1.9 
Returns the return value of pageFunction.
If the function passed to the electronApplication.evaluate() returns a Promise, then electronApplication.evaluate() would wait for the promise to resolve and return its value.
If the function passed to the electronApplication.evaluate() returns a non-Serializable value, then electronApplication.evaluate() returns undefined. Playwright also supports transferring some additional values that are not serializable by JSON: -0, NaN, Infinity, -Infinity.
Usage
await electronApplication.evaluate(pageFunction);
await electronApplication.evaluate(pageFunction, arg);
Arguments
pageFunction function | Electron#
Function to be evaluated in the main Electron process.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<Serializable>#

evaluateHandle
Added in: v1.9 
Returns the return value of pageFunction as a JSHandle.
The only difference between electronApplication.evaluate() and electronApplication.evaluateHandle() is that electronApplication.evaluateHandle() returns JSHandle.
If the function passed to the electronApplication.evaluateHandle() returns a Promise, then electronApplication.evaluateHandle() would wait for the promise to resolve and return its value.
Usage
await electronApplication.evaluateHandle(pageFunction);
await electronApplication.evaluateHandle(pageFunction, arg);
Arguments
pageFunction function | Electron#
Function to be evaluated in the main Electron process.
arg EvaluationArgument (optional)#
Optional argument to pass to pageFunction.
Returns
Promise<JSHandle>#

firstWindow
Added in: v1.9 
Convenience method that waits for the first application window to be opened.
Usage
const electronApp = await electron.launch({
 args: ['main.js']
});
const window = await electronApp.firstWindow();
// ...
Arguments
options Object (optional)
timeout number (optional) Added in: v1.33#
Maximum time to wait for in milliseconds. Defaults to 30000 (30 seconds). Pass 0 to disable timeout. The default value can be changed by using the browserContext.setDefaultTimeout().
Returns
Promise<Page>#

process
Added in: v1.21 
Returns the main process for this Electron Application.
Usage
electronApplication.process();
Returns
ChildProcess#

waitForEvent
Added in: v1.9 
Waits for event to fire and passes its value into the predicate function. Returns when the predicate returns truthy value. Will throw an error if the application is closed before the event is fired. Returns the event data value.
Usage
const windowPromise = electronApp.waitForEvent('window');
await mainWindow.click('button');
const window = await windowPromise;
Arguments
event string#
Event name, same one typically passed into *.on(event).
optionsOrPredicate function | Object (optional)#
predicate function
receives the event data and resolves to truthy value when the waiting should resolve.
timeout number (optional)
maximum time to wait for in milliseconds. Defaults to 30000 (30 seconds). Pass 0 to disable timeout. The default value can be changed by using the browserContext.setDefaultTimeout().
Either a predicate that receives an event or an options object. Optional.
Returns
Promise<Object>#

windows
Added in: v1.9 
Convenience method that returns all the opened windows.
Usage
electronApplication.windows();
Returns
Array<Page>#

Events
on('close')
Added in: v1.9 
This event is issued when the application process has been terminated.
Usage
electronApplication.on('close', data => {});

on('console')
Added in: v1.42 
Emitted when JavaScript within the Electron main process calls one of console API methods, e.g. console.log or console.dir.
The arguments passed into console.log are available on the ConsoleMessage event handler argument.
Usage
electronApp.on('console', async msg => {
 const values = [];
 for (const arg of msg.args())
   values.push(await arg.jsonValue());
 console.log(...values);
});
await electronApp.evaluate(() => console.log('hello', 5, { foo: 'bar' }));
Event data
ConsoleMessage

on('window')
Added in: v1.9 
This event is issued for every window that is created and loaded in Electron. It contains a Page that can be used for Playwright automation.
Usage
electronApplication.on('window', data => {});
Event data
Page
Previous
Electron
Methods
browserWindow
close
context
evaluate
evaluateHandle
firstWindow
process
waitForEvent
windows
Events
on('close')
on('console')
on('window')
Learn
Getting started
Playwright Training
Learn Videos
Feature Videos
Community
Stack Overflow
Discord
Twitter
LinkedIn
More
GitHub
YouTube
Blog
Ambassadors
Copyright © 2025 Microsoft


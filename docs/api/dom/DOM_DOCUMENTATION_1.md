Description
Document
When a member returns an object of type document (e.g., the ownerDocument property of an element returns the document to which it belongs), this object is the root document object itself. The DOM document Reference chapter describes the document object.
Node
Every object located within a document is a node of some kind. In an HTML document, an object can be an element node but also a text node or attribute node.
Element
The element type is based on node. It refers to an element or a node of type element returned by a member of the DOM API. Rather than saying, for example, that the document.createElement() method returns an object reference to a node, we just say that this method returns the element that has just been created in the DOM. element objects implement the DOM Element interface and also the more basic Node interface, both of which are included together in this reference. In an HTML document, elements are further enhanced by the HTML DOM API's HTMLElement interface as well as other interfaces describing capabilities of specific kinds of elements (for instance, HTMLTableElement for <table> elements).
NodeList
A nodeList is an array of elements, like the kind that is returned by the method document.querySelectorAll(). Items in a nodeList are accessed by index in either of two ways:
list.item(1)
list[1]
These two are equivalent. In the first, item() is the single method on the nodeList object. The latter uses the typical array syntax to fetch the second item in the list.
Attr
When an attribute is returned by a member (e.g., by the createAttribute() method), it is an object reference that exposes a special (albeit small) interface for attributes. Attributes are nodes in the DOM just like elements are, though you may rarely use them as such.
NamedNodeMap
A namedNodeMap is like an array, but the items are accessed by name or index, though this latter case is merely a convenience for enumeration, as they are in no particular order in the list. A namedNodeMap has an item() method for this purpose, and you can also add and remove items from a namedNodeMap.

There are also some common terminology considerations to keep in mind. It's common to refer to any Attr node as an attribute, for example, and to refer to an array of DOM nodes as a nodeList. You'll find these terms and others to be introduced and used throughout the documentation.
DOM interfaces
This guide is about the objects and the actual things you can use to manipulate the DOM hierarchy. There are many points where understanding how these work can be confusing. For example, the object representing the HTML form element gets its name property from the HTMLFormElement interface but its className property from the HTMLElement interface. In both cases, the property you want is in that form object.
But the relationship between objects and the interfaces that they implement in the DOM can be confusing, and so this section attempts to say a little something about the actual interfaces in the DOM specification and how they are made available.
Interfaces and objects
Many objects implement several different interfaces. The table object, for example, implements a specialized HTMLTableElement interface, which includes such methods as createCaption and insertRow. But since it's also an HTML element, table implements the Element interface described in the DOM Element Reference chapter. And finally, since an HTML element is also, as far as the DOM is concerned, a node in the tree of nodes that make up the object model for an HTML or XML page, the table object also implements the more basic Node interface, from which Element derives.
When you get a reference to a table object, as in the following example, you routinely use all three of these interfaces interchangeably on the object, perhaps without knowing it.
js
Copy to Clipboard
const table = document.getElementById("table");
const tableAttrs = table.attributes; // Node/Element interface
for (const attr of tableAttrs) {
  // HTMLTableElement interface: border attribute
  if (attr.nodeName.toLowerCase() === "border") {
    table.border = "1";
  }
}
// HTMLTableElement interface: summary attribute
table.summary = "note: increased border";

Core interfaces in the DOM
This section lists some of the most commonly-used interfaces in the DOM. The idea is not to describe what these APIs do here but to give you an idea of the sorts of methods and properties you will see very often as you use the DOM. These common APIs are used in the longer examples in the DOM Examples chapter at the end of this book.
The document and window objects are the objects whose interfaces you generally use most often in DOM programming. In simple terms, the window object represents something like the browser, and the document object is the root of the document itself. Element inherits from the generic Node interface, and together these two interfaces provide many of the methods and properties you use on individual elements. These elements may also have specific interfaces for dealing with the kind of data those elements hold, as in the table object example in the previous section.
The following is a brief list of common APIs in web and XML page scripting using the DOM.
document.querySelector()
document.querySelectorAll()
document.createElement()
Element.innerHTML
Element.setAttribute()
Element.getAttribute()
EventTarget.addEventListener()
HTMLElement.style
Node.appendChild()
window.onload
window.scrollTo()
Examples
Setting text content
This example uses a <div> element containing a <textarea> and two <button> elements. When the user clicks the first button we set some text in the <textarea>. When the user clicks the second button we clear the text. We use:
Document.querySelector() to access the <textarea> and the button
EventTarget.addEventListener() to listen for button clicks
Node.textContent to set and clear the text.
HTML
html
Copy to Clipboard
play
<div class="container">
  <textarea class="story"></textarea>
  <button id="set-text" type="button">Set text content</button>
  <button id="clear-text" type="button">Clear text content</button>
</div>

CSS
css
Copy to Clipboard
play
.container {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}

button {
  width: 200px;
}

JavaScript
js
Copy to Clipboard
play
const story = document.body.querySelector(".story");

const setText = document.body.querySelector("#set-text");
setText.addEventListener("click", () => {
  story.textContent = "It was a dark and stormy night...";
});

const clearText = document.body.querySelector("#clear-text");
clearText.addEventListener("click", () => {
  story.textContent = "";
});

Result
play
Adding a child element
This example uses a <div> element containing a <div> and two <button> elements. When the user clicks the first button we create a new element and add it as a child of the <div>. When the user clicks the second button we remove the child element. We use:
Document.querySelector() to access the <div> and the buttons
EventTarget.addEventListener() to listen for button clicks
Document.createElement to create the element
Node.appendChild() to add the child
Node.removeChild() to remove the child.
HTML
html
Copy to Clipboard
play
<div class="container">
  <div class="parent">parent</div>
  <button id="add-child" type="button">Add a child</button>
  <button id="remove-child" type="button">Remove child</button>
</div>

CSS
css
Copy to Clipboard
play
.container {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}

button {
  width: 100px;
}

div.parent {
  border: 1px solid black;
  padding: 5px;
  width: 100px;
  height: 100px;
}

div.child {
  border: 1px solid red;
  margin: 10px;
  padding: 5px;
  width: 80px;
  height: 60px;
  box-sizing: border-box;
}

JavaScript
js
Copy to Clipboard
play
const parent = document.body.querySelector(".parent");

const addChild = document.body.querySelector("#add-child");
addChild.addEventListener("click", () => {
  // Only add a child if we don't already have one
  // in addition to the text node "parent"
  if (parent.childNodes.length > 1) {
    return;
  }
  const child = document.createElement("div");
  child.classList.add("child");
  child.textContent = "child";
  parent.appendChild(child);
});

const removeChild = document.body.querySelector("#remove-child");
removeChild.addEventListener("click", () => {
  const child = document.body.querySelector(".child");
  parent.removeChild(child);
});

Result
play

Using the Document Object Model
The Document Object Model (DOM) is an API for manipulating DOM trees of HTML and XML documents (among other tree-like documents). This API is at the root of the description of a page and serves as a base for scripting on the web.
What is a DOM tree?
A DOM tree is a tree structure whose nodes represent an HTML or XML document's contents. Each HTML or XML document has a DOM tree representation. For example, consider the following document:
html
Copy to Clipboard
<html lang="en">
  <head>
    <title>My Document</title>
  </head>
  <body>
    <h1>Header</h1>
    <p>Paragraph</p>
  </body>
</html>

It has a DOM tree that looks like this:

Although the above tree is similar to the above document's DOM tree, it's not identical, as the actual DOM tree preserves whitespace.
When a web browser parses an HTML document, it builds a DOM tree and then uses it to display the document.
What does the Document API do?
The Document API, also sometimes called the DOM API, allows you to modify a DOM tree in any way you want. It enables you to create any HTML or XML document from scratch or to change any contents of a given HTML or XML document. Web page authors can edit the DOM of a document using JavaScript to access the document property of the global object. This document object implements the Document interface.
Reading and modifying the tree
Suppose the author wants to change the header of the above document and write two paragraphs instead of one. The following script would do the job:
HTML
html
Copy to Clipboard
play
<html lang="en">
  <head>
    <title>My Document</title>
  </head>
  <body>
    <input type="button" value="Change this document." />
    <h2>Header</h2>
    <p>Paragraph</p>
  </body>
</html>

JavaScript
js
Copy to Clipboard
play
document.querySelector("input").addEventListener("click", () => {
  // document.getElementsByTagName("h2") returns a NodeList of the <h2>
  // elements in the document, and the first is number 0:
  const header = document.getElementsByTagName("h2").item(0);

  // The firstChild of the header is a Text node:
  header.firstChild.data = "A dynamic document";

  // Now header is "A dynamic document".

  // Access the first paragraph
  const para = document.getElementsByTagName("p").item(0);
  para.firstChild.data = "This is the first paragraph.";

  // Create a new Text node for the second paragraph
  const newText = document.createTextNode("This is the second paragraph.");

  // Create a new Element to be the second paragraph
  const newElement = document.createElement("p");

  // Put the text in the paragraph
  newElement.appendChild(newText);

  // Put the paragraph on the end of the document by appending it to
  // the body (which is the parent of para)
  para.parentNode.appendChild(newElement);
});

play
Creating a tree
You can create the above tree entirely in JavaScript too.
js
Copy to Clipboard
const root = document.createElement("html");
root.lang = "en";

const head = document.createElement("head");
const title = document.createElement("title");
title.appendChild(document.createTextNode("My Document"));
head.appendChild(title);

const body = document.createElement("body");
const header = document.createElement("h1");
header.appendChild(document.createTextNode("Header"));
const paragraph = document.createElement("p");
paragraph.appendChild(document.createTextNode("Paragraph"));
body.appendChild(header);
body.appendChild(paragraph);

root.appendChild(head);
root.appendChild(body);

How can I learn more?
Now that you are familiar with the basic concepts of the DOM, you may want to learn more about the fundamental features of the Document API by reading how to traverse an HTML table with JavaScript and DOM interfaces.

Attribute reflection
An attribute extends an HTML, XML, SVG or other element, changing its behavior or providing metadata.
Many attributes are reflected in the corresponding DOM interface. This means that the value of the attribute can be read or written directly in JavaScript through a property on the corresponding interface, and vice versa. The reflected properties offer a more natural programming approach than getting and setting attribute values using the getAttribute() and setAttribute() methods of the Element interface.
This guide provides an overview of reflected attributes and how they are used.
Attribute getter/setter
First let's see the default mechanism for getting and setting an attribute, which can be used whether or not the attribute is reflected. To get the attribute you call the getAttribute() method of the Element interface, specifying the attribute name. To set the attribute you call the setAttribute() methods, specifying the attribute name and new value.
Consider the following HTML:
html
Copy to Clipboard
<input placeholder="Original placeholder" />

To get and set the placeholder attribute:
js
Copy to Clipboard
const input = document.querySelector("input");

// Get the placeholder attribute
let attr = input.getAttribute("placeholder");

// Set the placeholder attribute
input.setAttribute("placeholder", "Modified placeholder");

Reflected attributes
For an <input> the placeholder attribute is reflected by the HTMLInputElement.placeholder property. Given the same HTML as before:
html
Copy to Clipboard
<input placeholder="Original placeholder" />

The same operation can be performed more naturally using the placeholder property:
js
Copy to Clipboard
const input = document.querySelector("input");

// Get the placeholder attribute
let attr = input.placeholder;

// Set the placeholder attribute
input.placeholder = "Modified placeholder";

Note that the name of the reflected attribute and the property are the same: placeholder. This is not always the case: properties are usually named following the camelCase convention. This is particularly true for multi-word attribute names that contain a characters that are not allowed in a property name, such as the hyphen. For example the aria-checked attribute is reflected by the ariaChecked property.
Boolean reflected attributes
Boolean attributes are a little different than others in that they don't have to be declared with a name and a value. For example, the checkbox <input> element below has the checked attribute, and will be checked on display:
html
Copy to Clipboard
<input type="checkbox" checked />

The Element.getAttribute() will return "" if the input is checked or null if it is not. The corresponding HTMLInputElement.checked property returns true or false for the checked state. Otherwise boolean reflected attributes are the same as any other reflected attributes.
Enumerated reflected attributes
In HTML, enumerated attributes are attributes with a limited, predefined set of text values. For example, the global HTML dir attribute has three valid values: ltr, rtl, and auto.
html
Copy to Clipboard
<p dir="rtl">Right to left</p>

Like for HTML tag names, HTML enumerated attributes and their values are case-insensitive, so LTR, RTL, and AUTO will also work.
html
Copy to Clipboard
<p dir="RTL">Right to left</p>

The IDL-reflected property, HTMLElement.dir, always returns a canonical value as provided in the specification (lowercased values in this example). Setting the value also serializes it to the canonical form.
js
Copy to Clipboard
const pElement = document.querySelector("p");
console.log(pElement.dir); // "rtl"
pElement.dir = "RTL";
console.log(pElement.dir); // "rtl"

Alternatively, you can use the getAttribute() method of the Element interface. It will get the attribute value from HTML without modifications.
js
Copy to Clipboard
const pElement = document.querySelector("p");
console.log(pElement.getAttribute("dir")); // "RTL"

Reflected element references
Note: This section applies to reflected ARIA attributes that contain element references. The same considerations are likely to apply to other/future attributes that reflect element references.
Some attributes take element references as values: either an element id value or a space-separated string of element id values. These id values refer to other elements which are related to the attribute, or that contain information needed by the attribute. These attributes are reflected by a corresponding property as an array of HTMLElement-derived object instances that match the id values, with some caveats.
For example, the aria-labelledby attribute lists the id values of elements that contain the accessible name for an element in their inner text. The HTML below shows this for an <input> that has a label defined in <span> elements with id values of label_1, label_2, and label_3:
html
Copy to Clipboard
<span id="label_1">(Label 1 Text)</span>
<span id="label_2">(Label 2 Text)</span>
<input aria-labelledby="label_1 label_2 label_3" />

This attribute is reflected by Element.ariaLabelledByElements property, which returns the array of elements that have the corresponding id values. The attribute and corresponding property can be returned as shown:
js
Copy to Clipboard
const inputElement = document.querySelector("input");

console.log(inputElement.getAttribute("aria-labelledby"));
// "label_1 label_2 label_3"

console.log(inputElement.ariaLabelledByElements);
// [HTMLSpanElement, HTMLSpanElement]

The first thing to note from the code above is that the attribute and the property contain different numbers of elements — the property doesn't directly reflect the attribute because the reference label_3 does not have a corresponding element. It is also possible that a reference will not match because the id is out of scope for the element. This can happen if the referenced element is not in the same DOM or shadow DOM as the element, since ids are only only valid in the scope in which they are declared.
We can iterate the elements in the property array, in this case to get the accessible name from their inner text (this is more natural than using the attribute, because we don't have to first get the element references and then use them to find the elements, and we only have to work with elements that we know to be available in the current scope):
js
Copy to Clipboard
const inputElement = document.querySelector("input");
const accessibleName = inputElement.ariaLabelledByElements
  .map((e) => e.textContent.trim())
  .join(" ");
console.log(accessibleName);
// (Label 1 Text) (Label 2 Text)

Setting the property and attribute
For normal reflected properties, updates to the property are reflected in the corresponding attribute and vice versa. For reflected element references this is not the case. Instead, setting the property clears (unsets) the attribute, so that the property and attribute no longer reflect each other. For example, given the following HTML:
html
Copy to Clipboard
<span id="label_1">(Label 1 Text)</span>
<span id="label_2">(Label 2 Text)</span>
<input aria-labelledby="label_1 label_2" />

The initial value of the aria-labelledby is "label_1 label_2", but if we set it from the DOM API, the attribute is reset to "":
js
Copy to Clipboard
const inputElement = document.querySelector("input");

let attributeValue = inputElement.getAttribute("aria-labelledby");
console.log(attributeValue);
// "label_1 label_2"

// Set attribute using the reflected property
inputElement.ariaLabelledByElements = document.querySelectorAll("span");

attributeValue = inputElement.getAttribute("aria-labelledby");
console.log(attributeValue);
// ""

This makes sense because you could otherwise assign elements to the property that don't have an id reference, and hence can't be represented in the attribute.
Setting the attribute value restores the relationship between the attribute and the property. Continuing the example from above:
js
Copy to Clipboard
inputElement.setAttribute("aria-labelledby", "input1");

attributeValue = inputElement.getAttribute("aria-labelledby");
console.log(attributeValue);
// "label_1"

// Set attribute using the reflected property
console.log(inputElement.ariaLabelledByElements);
// [HTMLSpanElement] - for `label_1`

The array returned by the property is static, so you can't modify the returned array to cause changes to the corresponding attribute. When an array is assigned to the property it is copied, so any changes to the attribute will not be reflected in a previously returned property array.
Element id reference scope
Attribute element references can only refer to other elements that are in the same DOM or Shadow DOM, because element ids are only valid in the scope in which they are declared.
We can see this in the following code. The aria-labelledby attribute of the <input> element references the elements with ids label_1, label_2, and label_3. However label_3 is not a valid id in this case because it is not defined in the same scope as the <input> element. As a result the label will only come from the elements with ids label_1 and label_2.
html
Copy to Clipboard
<div id="in_dom">
  <span id="label_3">(Label 3 Text)</span>
</div>
<div id="host">
  <template shadowrootmode="open">
    <span id="label_1">(Label 1 Text)</span>
    <input aria-labelledby="label_1 label_2 label_3" />
    <span id="label_2">(Label 2 Text)</span>
  </template>
</div>

Reflected element reference scope
When using the instance properties reflected from ARIA element references, such as Element.ariaLabelledByElements for aria-labelledby, the scoping rules are a little different. To be in scope a target element must be in the same DOM as the referencing element, or a parent DOM. Elements in other DOMs, including shadow DOMs that are children or peers of the referring DOM, are out of scope.
The example below shows the case where an element in a parent DOM (label_3) is set as a target, along with the elements with ids label_1 and label_2 which are declared in the same shadow root. This works because all the target elements are in scope for the referencing element.
html
Copy to Clipboard
<div id="in_dom">
  <span id="label_3">(Label 3 Text)</span>
</div>
<div id="host">
  <template shadowrootmode="open">
    <span id="label_1">(Label 1 Text)</span>
    <input id="input" />
    <span id="label_2">(Label 2 Text)</span>
  </template>
</div>

js
Copy to Clipboard
const host = document.getElementById("host");
const input = host.shadowRoot.getElementById("input");
input.ariaLabelledByElements = [
  host.shadowRoot.getElementById("label_1"),
  host.shadowRoot.getElementById("label_2"),
  document.getElementById("label_3"),
];

The equivalent code with an element in the DOM referencing another in the shadow DOM would not work, because target elements that are in nested shadow DOMs are not in scope:
html
Copy to Clipboard
<div id="in_dom">
  <span id="label_1">(Label 1 Text)</span>
  <input id="input" />
  <span id="label_2">(Label 2 Text)</span>
</div>
<div id="host">
  <template shadowrootmode="open">
    <span id="label_3">(Label 3 Text)</span>
  </template>
</div>

js
Copy to Clipboard
const host = document.getElementById("host");
const input = document.getElementById("input");
input.ariaLabelledByElements = [
  host.shadowRoot.getElementById("label_3"),
  document.getElementById("label_1"),
  document.getElementById("label_2"),
];

Note that an element may initially be "in scope" and then moved out of scope into a nested shadow root. In this case the referenced element will still be listed in the attribute, but will not be returned in the property. Note however that if the element is moved back into scope, it will again be present in the reflected property.
Summary of the attribute/property relationship
The relationship between attributes containing element references and their corresponding property is as follows:
Attribute element id references are only in-scope for target elements declared in the same DOM or shadow DOM as the element.
Properties that reflect ARIA element references can target elements in the same scope or a parent scope. Elements in nested scopes are not accessible.
Setting the property clears the attribute and the property and attribute no longer reflect each other. If the attributes is read, with Element.getAttribute(), the value is "".
Setting the attribute, with Element.setAttribute(), also sets the property and restores the "reflection relationship".
Setting the attribute with a value reference that is subsequently moved out of scope will result in removal of the corresponding element from the property array. Note however that the attribute still contains the reference, and if the element is moved back in-scope the property will again include the element (i.e., the relationship is restored).
Traversing an HTML table with JavaScript and DOM Interfaces
This article is an overview of some powerful, fundamental DOM level 1 methods and how to use them from JavaScript. You will learn how to create, access and control, and remove HTML elements dynamically. The DOM methods presented here are not specific to HTML; they also apply to XML. The demonstrations provided here will work fine in any modern browser.
Note: The DOM methods presented here are part of the Document Object Model (Core) level 1 specification. DOM level 1 includes both methods for generic document access and manipulation (DOM 1 Core) as well as methods specific to HTML documents (DOM 1 HTML).
Creating an HTML table dynamically
Example
In this example we add a new table to the page when a button is clicked.
HTML
html
Copy to Clipboard
play
<input type="button" value="Generate a table" />

JavaScript
js
Copy to Clipboard
play
function generateTable() {
  // creates a <table> element and a <tbody> element
  const tbl = document.createElement("table");
  const tblBody = document.createElement("tbody");

  // creating all cells
  for (let i = 0; i < 2; i++) {
    // creates a table row
    const row = document.createElement("tr");

    for (let j = 0; j < 2; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      const cell = document.createElement("td");
      const cellText = document.createTextNode(`cell in row ${i}, column ${j}`);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  document.body.appendChild(tbl);
  // sets the border attribute of tbl to '2'
  tbl.setAttribute("border", "2");
}

document
  .querySelector("input[type='button']")
  .addEventListener("click", generateTable);

Result
play
Explanation
Note the order in which we created the elements and the text node:
First we created the <table> element.
Next, we created the <tbody> element, which is a child of the <table> element.
Next, we used a loop to create the <tr> elements, which are children of the <tbody> element.
For each <tr> element, we used a loop to create the <td> elements, which are children of <tr> elements.
For each <td> element, we then created the text node with the table cell's text.
Once we have created the <table>, <tbody>, <tr>, and <td> elements, and then the text node, we then append each object to its parent in the opposite order:
First, we attach each text node to its parent <td> element using
js
Copy to Clipboard
cell.appendChild(cellText);


Next, we attach each <td> element to its parent <tr> element using
js
Copy to Clipboard
row.appendChild(cell);


Next, we attach each <tr> element to the parent <tbody> element using
js
Copy to Clipboard
tblBody.appendChild(row);


Next, we attach the <tbody> element to its parent <table> element using
js
Copy to Clipboard
tbl.appendChild(tblBody);


Next, we attach the <table> element to its parent <body> element using
js
Copy to Clipboard
document.body.appendChild(tbl);


Remember this technique. You will use it frequently in programming for the W3C DOM. First, you create elements from the top down; then you attach the children to the parents from the bottom up.
Here's the HTML markup generated by the JavaScript code:
html
Copy to Clipboard
<table border="2">
  <tbody>
    <tr>
      <td>cell is row 0 column 0</td>
      <td>cell is row 0 column 1</td>
    </tr>
    <tr>
      <td>cell is row 1 column 0</td>
      <td>cell is row 1 column 1</td>
    </tr>
  </tbody>
</table>

Here's the DOM object tree generated by the code for the <table> element and its child elements:

You can build this table and its internal child elements by using just a few DOM methods. Remember to keep in mind the tree model for the structures you are planning to create; this will make it easier to write the necessary code. In the <table> tree of Figure 1 the element <table> has one child: the element <tbody>. <tbody> has two children. Each <tbody>'s child (<tr>) has two children (<td>). Finally, each <td> has one child: a text node.
Setting the background color of a paragraph
Example
In this example we change the background color of a paragraph when a button is clicked.
HTML
html
Copy to Clipboard
play
<body>
  <input type="button" value="Set paragraph background color" />
  <p>hi</p>
  <p>hello</p>
</body>

JavaScript
js
Copy to Clipboard
play
function setBackground() {
  // now, get all the p elements in the document
  const paragraphs = document.getElementsByTagName("p");

  // get the second paragraph from the list
  const secondParagraph = paragraphs[1];

  // set the inline style
  secondParagraph.style.background = "red";
}

document.querySelector("input").addEventListener("click", setBackground);

Result
play
Explanation
getElementsByTagName(tagNameValue) is a method available in any DOM Element or the root Document element. When called, it returns an array with all of the element's descendants matching the tag name. The first element of the list is located at position [0] in the array.
We've performed following steps:
First, we get all the p elements in the document:
js
Copy to Clipboard
const paragraphs = document.getElementsByTagName("p");


Then we get the second paragraph element from the list of p elements:
js
Copy to Clipboard
const secondParagraph = paragraphs[1];

Finally, we set background color to red using the style property of the paragraph object:
js
Copy to Clipboard
secondParagraph.style.background = "red";


Creating TextNodes with document.createTextNode("..")
Use the document object to invoke the createTextNode method and create your text node. You just need to pass the text content. The return value is an object that represents the text node.
js
Copy to Clipboard
myTextNode = document.createTextNode("world");

This means that you have created a node of the type TEXT_NODE (a piece of text) whose text data is "world", and myTextNode is your reference to this node object. To insert this text into your HTML page, you need to make this text node a child of some other node element.
Inserting Elements with appendChild(..)
So, by calling secondParagraph.appendChild(node_element), you are making the element a new child of the second <p> element.
js
Copy to Clipboard
secondParagraph.appendChild(myTextNode);

After testing this sample, note that the words hello and world are together: helloworld. So visually, when you see the HTML page it seems like the two text nodes hello and world are a single node, but remember that in the document model, there are two nodes. The second node is a new node of type TEXT_NODE, and it is the second child of the second <p> tag. The following figure shows the recently created Text Node object inside the document tree.

Note: createTextNode() and appendChild() is a simple way to include white space between the words hello and world. Another important note is that the appendChild method will append the child after the last child, just like the word world has been added after the word hello. So if you want to append a text node between hello and world, you will need to use insertBefore instead of appendChild.
Creating New Elements with the document object and the createElement(..) method
You can create new HTML elements or any other element you want with createElement. For example, if you want to create a new <p> element as a child of the <body> element, you can use the myBody in the previous example and append a new element node. To create a node call document.createElement("tagname"). For example:
js
Copy to Clipboard
myNewPTagNode = document.createElement("p");
myBody.appendChild(myNewPTagNode);


Removing nodes with the removeChild(..) method
Nodes can be removed. The following code removes text node myTextNode (containing the word "world") from the second <p> element, secondParagraph.
js
Copy to Clipboard
secondParagraph.removeChild(myTextNode);

Text node myTextNode (containing the word "world") still exists. The following code attaches myTextNode to the recently created <p> element, myNewPTagNode.
js
Copy to Clipboard
myNewPTagNode.appendChild(myTextNode);

The final state for the modified object tree looks like this:

Creating a table dynamically
The following figure shows the table object tree structure for the table created in the sample.
Reviewing the HTML Table structure

Creating element nodes and inserting them into the document tree
The basic steps to create the table are:
Get the body object (first item of the document object).
Create all the elements.
Finally, append each child according to the table structure (as in the above figure).
Note: At the end of the script, there is a new line of code. The table's border property was set using another DOM method, setAttribute(). setAttribute() has two arguments: the attribute name and the attribute value. You can set any attribute of any element using the setAttribute method.
js
Copy to Clipboard
// get the reference for the body
const myBody = document.getElementsByTagName("body")[0];

// creates <table> and <tbody> elements
const myTable = document.createElement("table");
const myTableBody = document.createElement("tbody");

// creating all cells
for (let j = 0; j < 3; j++) {
  // creates a <tr> element
  const myCurrentRow = document.createElement("tr");

  for (let i = 0; i < 4; i++) {
    // creates a <td> element
    const myCurrentCell = document.createElement("td");
    // creates a Text Node
    const currentText = document.createTextNode(
      `cell is row ${j}, column ${i}`,
    );
    // appends the Text Node we created into the cell <td>
    myCurrentCell.appendChild(currentText);
    // appends the cell <td> into the row <tr>
    myCurrentRow.appendChild(myCurrentCell);
  }
  // appends the row <tr> into <tbody>
  myTableBody.appendChild(myCurrentRow);
}

// appends <tbody> into <table>
myTable.appendChild(myTableBody);
// appends <table> into <body>
myBody.appendChild(myTable);
// sets the border attribute of myTable to 2;
myTable.setAttribute("border", "2");

Manipulating the table with DOM and CSS
Getting a text node from the table
This example introduces two new DOM attributes. First it uses the childNodes attribute to get the list of child nodes of myCell. The childNodes list includes all child nodes, regardless of what their name or type is. Like getElementsByTagName(), it returns a list of nodes.
The differences are that (a) getElementsByTagName() only returns elements of the specified tag name; and (b) childNodes includes all descendants at any level, not just immediate children.
Once you have the returned list, use [x] method to retrieve the desired child item. This example stores in myCellText the text node of the second cell in the second row of the table.
Then, to display the results in this example, it creates a new text node whose content is the data of myCellText, and appends it as a child of the <body> element.
Note: If your object is a text node, you can use the data attribute and retrieve the text content of the node.
js
Copy to Clipboard
const myBody = document.getElementsByTagName("body")[0];
const myTable = myBody.getElementsByTagName("table")[0];
const myTableBody = myTable.getElementsByTagName("tbody")[0];
const myRow = myTableBody.getElementsByTagName("tr")[1];
const myCell = myRow.getElementsByTagName("td")[1];

// first item element of the childNodes list of myCell
const myCellText = myCell.childNodes[0];

// content of currentText is the data content of myCellText
const currentText = document.createTextNode(myCellText.data);
myBody.appendChild(currentText);

Getting an attribute value
At the end of sample1 there is a call to setAttribute on the myTable object. This call was used to set the border property of the table. To retrieve the value of the attribute, use the getAttribute method:
js
Copy to Clipboard
myTable.getAttribute("border");

Hiding a column by changing style properties
Once you have the object in your JavaScript variable, you can set style properties directly. The following code is a modified version in which each cell of the second column is hidden and each cell of the first column is changed to have a red background. Note that the style property was set directly.
js
Copy to Clipboard
const myBody = document.getElementsByTagName("body")[0];
const myTable = document.createElement("table");
const myTableBody = document.createElement("tbody");

for (let row = 0; row < 2; row++) {
  const myCurrentRow = document.createElement("tr");
  for (let col = 0; col < 2; col++) {
    const myCurrentCell = document.createElement("td");
    const currentText = document.createTextNode(`cell is: ${row}${col}`);
    myCurrentCell.appendChild(currentText);
    myCurrentRow.appendChild(myCurrentCell);
    // set the cell background color
    // if the column is 0. If the column is 1 hide the cell
    if (col === 0) {
      myCurrentCell.style.background = "rgb(255 0 0)";
    } else {
      myCurrentCell.style.display = "none";
    }
  }
  myTableBody.appendChild(myCurrentRow);
}
myTable.appendChild(myTableBody);
myBody.appendChild(myTable);
Locating DOM elements using selectors
The Selectors API provides methods that make it quick and easy to retrieve Element nodes from the DOM by matching against a set of selectors. This is much faster than past techniques, wherein it was necessary to, for example, use a loop in JavaScript code to locate the specific items you needed to find.
The NodeSelector interface
This specification adds two new methods to any objects implementing the Document, DocumentFragment, or Element interfaces:
querySelector()
Returns the first matching Element node within the node's subtree. If no matching node is found, null is returned.
querySelectorAll()
Returns a NodeList containing all matching Element nodes within the node's subtree, or an empty NodeList if no matches are found.
Note: The NodeList returned by querySelectorAll() is not live, which means that changes in the DOM are not reflected in the collection. This is different from other DOM querying methods that return live node lists.
You may find examples and details by reading the documentation for the Element.querySelector() and Element.querySelectorAll() methods.
Selectors
The selector methods accept selectors to determine what element or elements should be returned. This includes selector lists so you can group multiple selectors in a single query.
To protect the user's privacy, some pseudo-classes are not supported or behave differently. For example :visited will return no matches and :link is treated as :any-link.
Only elements can be selected, so pseudo-classes are not supported.
Examples
To select all paragraph (p) elements in a document whose classes include warning or note, you can do the following:
js
Copy to Clipboard
const special = document.querySelectorAll("p.warning, p.note");

You can also query by ID. For example:
js
Copy to Clipboard
const el = document.querySelector("#main, #basic, #exclamation");

After executing the above code, el contains the first element in the document whose ID is one of main, basic, or exclamation.
See also
Selectors specification
CSS Selectors
Element.querySelector()
Element.querySelectorAll()
Document.querySelector()
Document.querySelectorAll()
Transforming with XSLT
One noticeable trend in W3C standards has been the effort to separate content from style. This would allow the same style to be reused for multiple content, as well as simplify maintenance and allow a quick (only modify one file) way to change the look of content.
CSS (Cascade Style Sheets) was one of the first ways proposed by the W3C. CSS is a way to apply style rules to a web document. These style rules define how the document (the content) should be laid out. However, it has several limitations, such as lack of programming structures and ability to create complex layout models. CSS also has limited support for changing the position of an element.
XSL (Extensible Stylesheet Language) Transformations are composed of two parts: XSL elements, which allow the transformation of an XML tree into another markup tree and XPath, a selection language for trees. XSLT takes an XML document (the content) and creates a brand new document based on the rules in the XSL stylesheet. This allows XSLT to add, remove and reorganize elements from the original XML document and thus allows more fine-grain control of the resulting document's structure.
Transformations in XSLT are based on rules that consist of templates. Each template matches (using XPath) a certain fragment of the input XML document and then applies the substitution part on that fragment to create the new resulting document.
Basic example
This first example demonstrates the basics of setting up an XSLT transformation in a browser. The example takes an XML document that contains information about an article (title, list of authors and body text) and presents it in a human-readable form.
The XML document (example.xml) is shown below.
xml
Copy to Clipboard
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="example.xsl"?>
<Article>
  <Title>My Article</Title>
  <Authors>
    <Author>Mr. Foo</Author>
    <Author>Mr. Bar</Author>
  </Authors>
  <Body>This is my article text.</Body>
</Article>

The ?xml-stylesheet processing instruction in the XML file specifies the XSLT stylesheet to apply in its href attribute.
This XSL stylesheet file (example.xsl) is shown below:
xml
Copy to Clipboard
<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="text"/>

  <xsl:template match="/">
    Article - <xsl:value-of select="/Article/Title"/>
    Authors: <xsl:apply-templates select="/Article/Authors/Author"/>
  </xsl:template>

  <xsl:template match="Author">
    - <xsl:value-of select="." />
  </xsl:template>

</xsl:stylesheet>

An XSLT stylesheet starts with the xsl:stylesheet element, which contains all the templates used to create the final output. The example above has two templates - one that matches the root node and one that matches Author nodes. The template that matches the root node outputs the article's title and then says to process all templates (via apply-templates) that match Author nodes which are children of the Authors node.
To try out the example:
Create a directory in your file system and inside it create the files example.xml and example.xsl listed above
Start a local server in the directory containing the files. This allows you to browse the files in the directory as though they were hosted on the internet.
Warning: Opening the XML file directly from the file system will not work, because loading the stylesheet from the file system is a cross-origin request, and will be disallowed by default. Hosting the XML and stylesheet on the same local server ensures that they have the same origin.
Open example.xml from the browser.
The browser output is then as shown below:
Browser Output :

    Article - My Article
    Authors:
    - Mr. Foo
    - Mr. Bar


Generating HTML
One common application of XSLT in the browser is transforming XML into HTML on the client. This example will transform the input document (example2.xml), which contains information about an article, into an HTML document.
The <body> element of the article now contains HTML elements (a <b> and <u> tag). The XML document contains both HTML elements and XML elements, but only one namespace is needed, namely for the XML elements. Since there is no HTML namespace, and using the XHTML namespace would force the XSL to create an XML document that would not behave like an HTML document, the xsl:output in the XSL Stylesheet will make sure the resulting document will be handled as HTML. For the XML elements, our own namespace is needed, http://devedge.netscape.com/2002/de, and it is given the prefix myNS (xmlns:myNS="http://devedge.netscape.com/2002/de").
XML file
xml
Copy to Clipboard
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="example2.xsl"?>
  <myNS:Article xmlns:myNS="http://devedge.netscape.com/2002/de">
    <myNS:Title>My Article</myNS:Title>
    <myNS:Authors>
      <myNS:Author company="Foopy Corp.">Mr. Foo</myNS:Author>
      <myNS:Author>Mr. Bar</myNS:Author>
    </myNS:Authors>
    <myNS:Body>
      The <b>rain</b> in <u>Spain</u> stays mainly in the plains.
    </myNS:Body>
  </myNS:Article>

The XSL Stylesheet used will need to have two namespaces - one for the XSLT elements and one for our own XML elements used in the XML document. The output of the XSL Stylesheet is set to HTML by using the xsl:output element. By setting the output to be HTML and not having a namespace on the resulting elements (colored in blue), those elements will be treated as HTML elements.
XSL stylesheet with 2 namespaces
xml
Copy to Clipboard
<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:myNS="http://devedge.netscape.com/2002/de">

  <xsl:output method="html"/>
  …
</xsl:stylesheet version="1.0">

A template matching the root node of the XML document is created and used to create the basic structure of the HTML page.
Creating the basic HTML document
xml
Copy to Clipboard
…
<xsl:template match="/">
<html>

  <head>

    <title>
      <xsl:value-of select="/myNS:Article/myNS:Title"/>
    </title>

    <style>
      .myBox {margin:10px 155px 0 50px; border: 1px dotted #639ACE; padding:0 5px 0 5px;}
    </style>

  </head>

  <body>
    <p class="myBox">
      <span class="title">
        <xsl:value-of select="/myNS:Article/myNS:Title"/>
      </span> </br>

      Authors:   <br />
        <xsl:apply-templates select="/myNS:Article/myNS:Authors/myNS:Author"/>
    </p>

    <p class="myBox">
      <xsl:apply-templates select="//myNS:Body"/>
    </p>

  </body>

</html>
</xsl:template>
…

Three more xsl:template's are needed to complete the example. The first xsl:template is used for the author nodes, while the second one processes the body node. The third template has a general matching rule which will match any node and any attribute. It is needed in order to preserve the HTML elements in the XML document, since it matches all of them and copies them out into the HTML document the transformation creates.
Final 3 templates
xml
Copy to Clipboard
…
<xsl:template match="myNS:Author">
    --   <xsl:value-of select="." />

  <xsl:if test="@company">
    ::   <b>  <xsl:value-of select="@company" />  </b>
  </xsl:if>

  <br />
</xsl:template>

xml
Copy to Clipboard
<xsl:template match="myNS:Body">
  <xsl:copy>
    <xsl:apply-templates select="@*|node()"/>
  </xsl:copy>
</xsl:template>

<xsl:template match="@*|node()">
  <xsl:copy>
    <xsl:apply-templates select="@*|node()"/>
  </xsl:copy>
</xsl:template>
…

The final XSLT stylesheet looks as follows:
Final XSLT stylesheet
xml
Copy to Clipboard
<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:myNS="http://devedge.netscape.com/2002/de">

  <xsl:output method="html" />

  <xsl:template match="/">
    <html>

      <head>

        <title>
          <xsl:value-of select="/myNS:Article/myNS:Title"/>
        </title>

        <style>
          .myBox {margin:10px 155px 0 50px; border: 1px dotted #639ACE; padding:0 5px 0 5px;}
        </style>

      </head>

      <body>
        <p class="myBox">
          <span class="title">
            <xsl:value-of select="/myNS:Article/myNS:Title"/>
          </span> <br />

          Authors:   <br />
            <xsl:apply-templates select="/myNS:Article/myNS:Authors/myNS:Author"/>
          </p>

        <p class="myBox">
          <xsl:apply-templates select="//myNS:Body"/>
        </p>

      </body>

    </html>
  </xsl:template>

  <xsl:template match="myNS:Author">
      --   <xsl:value-of select="." />

    <xsl:if test="@company">
      ::   <b>  <xsl:value-of select="@company" />  </b>
    </xsl:if>

    <br />
  </xsl:template>

  <xsl:template match="myNS:Body">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="@*|node()">
      <xsl:copy>
        <xsl:apply-templates select="@*|node()"/>
      </xsl:copy>
  </xsl:template>
</xsl:stylesheet>
ntroduction to events
Previous


Overview: Dynamic scripting with JavaScript


Next


Events are things that happen in the system you are programming, which the system tells you about so your code can react to them. For example, if the user clicks a button on a webpage, you might want to react to that action by displaying an information box. In this article, we discuss some important concepts surrounding events, and look at the fundamentals of how they work in browsers.
Prerequisites:
An understanding of HTML and the fundamentals of CSS, familiarity with JavaScript basics as covered in previous lessons.
Learning outcomes:
What events are — a signal fired by the browser when something significant happens, which the developer can run some code in response to.
Setting up event handlers using addEventListener() (and removeEventListener()) and event handler properties.
Inline event handler attributes, and why you shouldn't use them.
Event objects.


What is an event?
Events are things that happen in the system you are programming — the system produces (or "fires") a signal of some kind when an event occurs, and provides a mechanism by which an action can be automatically taken (that is, some code running) when the event occurs. Events are fired inside the browser window, and tend to be attached to a specific item that resides in it. This might be a single element, a set of elements, the HTML document loaded in the current tab, or the entire browser window. There are many different types of events that can occur.
For example:
The user selects, clicks, or hovers the cursor over a certain element.
The user presses a key on the keyboard.
The user resizes or closes the browser window.
A web page finishes loading.
A form is submitted.
A video is played, paused, or ends.
An error occurs.
You can gather from this (and from glancing at the MDN event reference) that there are a lot of events that can be fired.
To react to an event, you attach an event listener to it. This is a code feature that listens out for the event firing. When the event fires, an event handler function (referenced by, or contained inside the event listener) is called to respond to the event firing. When such a block of code is set up to run in response to an event, we say we are registering an event handler.
An example: handling a click event
In the following example, we have a single <button> in the page:
html
Copy to Clipboard
play
<button>Change color</button>
Then we have some JavaScript. We'll look at this in more detail in the next section, but for now we can just say: it adds an event listener to the button's "click" event, and the contained handler function reacts to the event by setting the page background to a random color:
js
Copy to Clipboard
play
const btn = document.querySelector("button");

function random(number) {
  return Math.floor(Math.random() * (number + 1));
}

btn.addEventListener("click", () => {
  const rndCol = `rgb(${random(255)} ${random(255)} ${random(255)})`;
  document.body.style.backgroundColor = rndCol;
});
The example output is as follows. Try clicking the button:
play
Using addEventListener()
As we saw in the last example, objects that can fire events have an addEventListener() method, and this is the recommended mechanism for adding event listeners.
Let's take a closer look at the code from the last example:
js
Copy to Clipboard
const btn = document.querySelector("button");

function random(number) {
  return Math.floor(Math.random() * (number + 1));
}

btn.addEventListener("click", () => {
  const rndCol = `rgb(${random(255)} ${random(255)} ${random(255)})`;
  document.body.style.backgroundColor = rndCol;
});
The HTML <button> element will fire a click event when the user clicks it. We call the addEventListener() method on it to add an event listener; this takes two parameters:
the string "click", to indicate that we want to listen to the click event. Buttons can fire lots of other events, such as "mouseover" when the user moves their mouse over the button, or "keydown" when the user presses a key and the button is focused.
a function to call when the event happens. In our case, the defined anonymous function generates a random RGB color and sets the background-color of the page <body> to that color.
You could also create a separate named function, and reference that in the second parameter of addEventListener(), like this:
js
Copy to Clipboard
const btn = document.querySelector("button");

function random(number) {
  return Math.floor(Math.random() * (number + 1));
}

function changeBackground() {
  const rndCol = `rgb(${random(255)} ${random(255)} ${random(255)})`;
  document.body.style.backgroundColor = rndCol;
}

btn.addEventListener("click", changeBackground);
Listening for other events
There are many different events that can be fired by a button element. Let's experiment.
First, make a local copy of random-color-addeventlistener.html, and open it in your browser. It's just a copy of the simple random color example we've played with already. Now try changing click to the following different values in turn, and observing the results in the example:
focus and blur — The color changes when the button is focused and unfocused; try pressing the tab to focus on the button and press the tab again to focus away from the button. These are often used to display information about filling in form fields when they are focused, or to display an error message if a form field is filled with an incorrect value.
dblclick — The color changes only when the button is double-clicked.
mouseover and mouseout — The color changes when the mouse pointer hovers over the button, or when the pointer moves off the button, respectively.
Some events, such as click, are available on nearly any element. Others are more specific and only useful in certain situations: for example, the play event is only available on elements that have play functionality, such as <video>.
Removing listeners
If you've added an event listener using addEventListener(), you can remove it again if desired. The most common way to do this is by using the removeEventListener() method. For example, the following line would remove the click event handler we saw previously:
js
Copy to Clipboard
btn.removeEventListener("click", changeBackground);
For simple, small programs, cleaning up old, unused event handlers isn't necessary, but for larger, more complex programs, it can improve efficiency. Also, the ability to remove event handlers allows you to have the same button performing different actions in different circumstances: all you have to do is add or remove handlers.
Adding multiple listeners for a single event
By making more than one call to addEventListener(), providing different handlers, you can have multiple handler functions running in response to a single event:
js
Copy to Clipboard
myElement.addEventListener("click", functionA);
myElement.addEventListener("click", functionB);
Both functions would now run when the element is clicked.
Other event listener mechanisms
We recommend that you use addEventListener() to register event handlers. It's the most powerful method and scales best with more complex programs. However, there are two other ways of registering event handlers that you might see: event handler properties and inline event handlers.
Event handler properties
Objects (such as buttons) that can fire events also usually have properties whose name is on followed by the name of an event. For example, elements have a property onclick. This is called an event handler property. To listen for the event, you can assign the handler function to the property.
For example, we could rewrite the random color example like this:
js
Copy to Clipboard
const btn = document.querySelector("button");

function random(number) {
  return Math.floor(Math.random() * (number + 1));
}

btn.onclick = () => {
  const rndCol = `rgb(${random(255)} ${random(255)} ${random(255)})`;
  document.body.style.backgroundColor = rndCol;
};
You can also set the handler property to a named function:
js
Copy to Clipboard
const btn = document.querySelector("button");

function random(number) {
  return Math.floor(Math.random() * (number + 1));
}

function bgChange() {
  const rndCol = `rgb(${random(255)} ${random(255)} ${random(255)})`;
  document.body.style.backgroundColor = rndCol;
}

btn.onclick = bgChange;
Event handler properties have disadvantages compared to addEventListener(). One of the most significant is that you can't add more than one listener for a single event. The following pattern doesn't work, because any subsequent attempts to set the property value will overwrite earlier ones:
js
Copy to Clipboard
element.onclick = function1;
element.onclick = function2;
Inline event handlers — don't use these
You might also see a pattern like this in your code:
html
Copy to Clipboard
<button onclick="bgChange()">Press me</button>


js
Copy to Clipboard
function bgChange() {
  const rndCol = `rgb(${random(255)} ${random(255)} ${random(255)})`;
  document.body.style.backgroundColor = rndCol;
}
The earliest method of registering event handlers found on the Web involved event handler HTML attributes (or inline event handlers) like the one shown above — the attribute value contains the JavaScript code you want to run when the event occurs. The above example invokes a function defined inside a <script> element on the same page, but you could also insert JavaScript directly inside the attribute, for example:
html
Copy to Clipboard
<button onclick="alert('Hello, this is my old-fashioned event handler!');">
  Press me
</button>
You can find HTML attribute equivalents for many of the event handler properties; however, you shouldn't use these — they are considered bad practice. It might seem easy to use an event handler attribute if you are doing something really quick, but they quickly become unmanageable and inefficient.
For a start, it is not a good idea to mix up your HTML and your JavaScript, as it becomes hard to read. Keeping your JavaScript separate is a good practice, and if it is in a separate file you can apply it to multiple HTML documents.
Even in a single file, inline event handlers are not a good idea. One button is OK, but what if you had 100 buttons? You'd have to add 100 attributes to the file; it would quickly turn into a maintenance nightmare. With JavaScript, you could easily add an event handler function to all the buttons on the page no matter how many there were, using something like this:
js
Copy to Clipboard
const buttons = document.querySelectorAll("button");

for (const button of buttons) {
  button.addEventListener("click", bgChange);
}
Finally, many common server configurations will disallow inline JavaScript, as a security measure.
You should never use the HTML event handler attributes — those are outdated, and using them is bad practice.
Event objects
Sometimes, inside an event handler function, you'll see a parameter specified with a name such as event, evt, or e. This is called the event object, and it is automatically passed to event handlers to provide extra features and information. For example, let's rewrite our random color example to include an event object:
js
Copy to Clipboard
const btn = document.querySelector("button");

function random(number) {
  return Math.floor(Math.random() * (number + 1));
}

function bgChange(e) {
  const rndCol = `rgb(${random(255)} ${random(255)} ${random(255)})`;
  e.target.style.backgroundColor = rndCol;
  console.log(e);
}

btn.addEventListener("click", bgChange);
Note: You can find the full source code for this example on GitHub (also see it running live).
Here you can see we are including an event object, e, in the function, and in the function setting a background color style on e.target — which is the button itself. The target property of the event object is always a reference to the element the event occurred upon. So, in this example, we are setting a random background color on the button, not the page.
Note: You can use any name you like for the event object — you just need to choose a name that you can reference inside the event handler function. e, evt, and event are commonly used by developers because they are short and easy to remember. It's always good to be consistent — with yourself, and with others if possible.
Extra properties of event objects
Most event objects have a standard set of properties and methods available on the event object; see the Event object reference for a full list.
Some event objects add extra properties that are relevant to that particular type of event. For example, the keydown event fires when the user presses a key. Its event object is a KeyboardEvent, which is a specialized Event object with a key property that tells you which key was pressed:
html
Copy to Clipboard
play
<input id="textBox" type="text" />
<div id="output"></div>


js
Copy to Clipboard
play
const textBox = document.querySelector("#textBox");
const output = document.querySelector("#output");
textBox.addEventListener("keydown", (event) => {
  output.textContent = `You pressed "${event.key}".`;
});
Try typing into the text box and see the output:
play
Preventing default behavior
Sometimes, you'll come across a situation where you want to prevent an event from doing what it does by default. The most common example is that of a web form, for example, a custom registration form. When you fill in the details and click the submit button, the natural behavior is for the data to be submitted to a specified page on the server for processing, and the browser to be redirected to a "success message" page of some kind (or the same page, if another is not specified).
The trouble comes when the user has not submitted the data correctly — as a developer, you want to prevent the submission to the server and give an error message saying what's wrong and what needs to be done to put things right. Some browsers support automatic form data validation features, but since many don't, you are advised to not rely on those and implement your own validation checks. Let's look at an example.
First, a simple HTML form that requires you to enter your first and last name:
html
Copy to Clipboard
<form action="#">
  <div>
    <label for="fname">First name: </label>
    <input id="fname" type="text" />
  </div>
  <div>
    <label for="lname">Last name: </label>
    <input id="lname" type="text" />
  </div>
  <div>
    <input id="submit" type="submit" />
  </div>
</form>
<p></p>
Now some JavaScript — here we implement a basic check inside a handler for the submit event (the submit event is fired on a form when it is submitted) that tests whether the text fields are empty. If they are, we call the preventDefault() function on the event object — which stops the form submission — and then display an error message in the paragraph below our form to tell the user what's wrong:
js
Copy to Clipboard
const form = document.querySelector("form");
const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const para = document.querySelector("p");

form.addEventListener("submit", (e) => {
  if (fname.value === "" || lname.value === "") {
    e.preventDefault();
    para.textContent = "You need to fill in both names!";
  }
});
Obviously, this is pretty weak form validation — it wouldn't stop the user from validating the form with spaces or numbers entered into the fields, for example — but it is OK for example purposes.
You can see the full example running live — try it out there. For the full source code, see preventdefault-validation.html.
It's not just web pages
Events are not unique to JavaScript — most programming languages have some kind of event model, and the way the model works often differs from JavaScript's way. In fact, the event model in JavaScript for web pages differs from the event model for JavaScript as it is used in other environments.
For example, Node.js is a very popular JavaScript runtime that enables developers to use JavaScript to build network and server-side applications. The Node.js event model relies on listeners to listen for events and emitters to emit events periodically — it doesn't sound that different, but the code is quite different, making use of functions like on() to register an event listener, and once() to register an event listener that unregisters after it has run once. The Node.js HTTP connect event docs provide a good example.
You can also use JavaScript to build cross-browser add-ons — browser functionality enhancements — using a technology called WebExtensions. The event model is similar to the web events model, but a bit different — event listener properties are written in camel case (such as onMessage rather than onmessage), and need to be combined with the addListener function. See the runtime.onMessage page for an example.
You don't need to understand anything about other such environments at this stage in your learning; we just wanted to make it clear that events can differ in different programming environments.
Summary
In this chapter we've learned what events are, how to listen for events, and how to respond to them.
You've seen by now that elements in a web page can be nested inside other elements. For example, in the Preventing default behavior example, we have some text boxes, placed inside <div> elements, which in turn are placed inside a <form> element. What happens when a click event listener is attached to the <form> element, and the user clicks inside one of the text boxes? The associated event handler function is still fired via a process called event bubbling, which is covered in the next lesson.
Previous


Event bubbling
Previous


Overview: Dynamic scripting with JavaScript


Next


We've seen that a web page is composed of elements — headings, paragraphs of text, images, buttons, and so on — and that you can listen for events that happen to these elements. For example, you could add a listener to a button, and it will run when the user clicks the button.
We've also seen that these elements can be nested inside each other: for example, a <button> could be placed inside a <div> element. In this case we'd call the <div> element a parent element, and the <button> a child element.
In this chapter we'll look at event bubbling — this is what happens when you add an event listener to a parent element, and the user clicks the child element.
Prerequisites:
An understanding of HTML and the fundamentals of CSS, familiarity with JavaScript basics as covered in previous lessons.
Learning outcomes:
Event delegation, achieved via event bubbling or event capture.
Stopping event delegation with stopPropagation().
Accessing event targets from the event object.

Introducing event bubbling
Let's introduce and define event bubbling by way of an example.
Setting a listener on a parent element
Consider a web page like this:
html
Copy to Clipboard
play
<div id="container">
  <button>Click me!</button>
</div>
<pre id="output"></pre>

Here the button is inside another element, a <div> element. We say that the <div> element here is the parent of the element it contains. What happens if we add a click event handler to the parent, then click the button?
js
Copy to Clipboard
play
const output = document.querySelector("#output");
function handleClick(e) {
  output.textContent += `You clicked on a ${e.currentTarget.tagName} element\n`;
}


const container = document.querySelector("#container");
container.addEventListener("click", handleClick);

play
You'll see that the parent fires a click event when the user clicks the button:
You clicked on a DIV element

This makes sense: the button is inside the <div>, so when you click the button you're also implicitly clicking the element it is inside.
Bubbling example
What happens if we add event listeners to the button and the parent?
html
Copy to Clipboard
play
<body>
  <div id="container">
    <button>Click me!</button>
  </div>
  <pre id="output"></pre>
</body>

Let's try adding click event handlers to the button, its parent (the <div>), and the <body> element that contains both of them:
js
Copy to Clipboard
play
const output = document.querySelector("#output");
function handleClick(e) {
  output.textContent += `You clicked on a ${e.currentTarget.tagName} element\n`;
}


const container = document.querySelector("#container");
const button = document.querySelector("button");


document.body.addEventListener("click", handleClick);
container.addEventListener("click", handleClick);
button.addEventListener("click", handleClick);

play
You'll see that all three elements fire a click event when the user clicks the button:
You clicked on a BUTTON element
You clicked on a DIV element
You clicked on a BODY element

In this case:
the click on the button fires first.
followed by the click on its parent (the <div> element).
followed by the click on the <div> element's parent (the <body> element).
We describe this by saying that the event bubbles up from the innermost element that was clicked.
This behavior can be useful and can also cause unexpected problems. In the next sections, we'll see a problem that it causes, and find the solution.
Video player example
In this example our page contains a video, which is hidden initially, and a button labeled "Display video". We want the following interaction:
When the user clicks the "Display video" button, show the box containing the video, but don't start playing the video yet.
When the user clicks on the video, start playing the video.
When the user clicks anywhere in the box outside the video, hide the box.
The HTML looks like this:
html
Copy to Clipboard
play
<button>Display video</button>


<div class="hidden">
  <video>
    <source src="/shared-assets/videos/flower.webm" type="video/webm" />
    <p>
      Your browser doesn't support HTML video. Here is a
      <a href="rabbit320.mp4">link to the video</a> instead.
    </p>
  </video>
</div>

It includes:
a <button> element.
a <div> element which initially has a class="hidden" attribute.
a <video> element nested inside the <div> element.
We're using CSS to hide elements with the "hidden" class set.
The JavaScript looks like this:
js
Copy to Clipboard
play
const btn = document.querySelector("button");
const box = document.querySelector("div");
const video = document.querySelector("video");


btn.addEventListener("click", () => box.classList.remove("hidden"));
video.addEventListener("click", () => video.play());
box.addEventListener("click", () => box.classList.add("hidden"));

This adds three 'click' event listeners:
one on the <button>, which shows the <div> that contains the <video>.
one on the <video>, which starts playing the video.
one on the <div>, which hides the video.
Let's see how this works:
play
You should see that when you click the button, the box and the video it contains are shown. But then when you click the video, the video starts to play, but the box is hidden again!
The video is inside the <div> — it is part of it — so clicking the video runs both the event handlers, causing this behavior.
Fixing the problem with stopPropagation()
As we saw in the last section, event bubbling can sometimes create problems, but there is a way to prevent it. The Event object has a function available on it called stopPropagation() which, when called inside an event handler, prevents the event from bubbling up to any other elements.
We can fix our current problem by changing the JavaScript to this:
js
Copy to Clipboard
play
const btn = document.querySelector("button");
const box = document.querySelector("div");
const video = document.querySelector("video");


btn.addEventListener("click", () => box.classList.remove("hidden"));


video.addEventListener("click", (event) => {
  event.stopPropagation();
  video.play();
});


box.addEventListener("click", () => box.classList.add("hidden"));

All we're doing here is calling stopPropagation() on the event object in the handler for the <video> element's 'click' event. This will stop that event from bubbling up to the box. Now try clicking the button and then the video:
play
Event capture
An alternative form of event propagation is event capture. This is like event bubbling but the order is reversed: instead of the event firing first on the innermost element targeted, and then on successively less nested elements, the event fires first on the least nested element, and then on successively more nested elements, until the target is reached.
Event capture is disabled by default. To enable it you have to pass the capture option in addEventListener().
This example is just like the bubbling example we saw earlier, except that we have used the capture option:
html
Copy to Clipboard
play
<body>
  <div id="container">
    <button>Click me!</button>
  </div>
  <pre id="output"></pre>
</body>

js
Copy to Clipboard
play
const output = document.querySelector("#output");
function handleClick(e) {
  output.textContent += `You clicked on a ${e.currentTarget.tagName} element\n`;
}


const container = document.querySelector("#container");
const button = document.querySelector("button");


document.body.addEventListener("click", handleClick, { capture: true });
container.addEventListener("click", handleClick, { capture: true });
button.addEventListener("click", handleClick);

play
In this case, the order of messages is reversed: the <body> event handler fires first, followed by the <div> event handler, followed by the <button> event handler:
You clicked on a BODY element
You clicked on a DIV element
You clicked on a BUTTON element

Why bother with both capturing and bubbling? In the bad old days, when browsers were much less cross-compatible than now, Netscape only used event capturing, and Internet Explorer used only event bubbling. When the W3C decided to try to standardize the behavior and reach a consensus, they ended up with this system that included both, which is what modern browsers implement.
By default almost all event handlers are registered in the bubbling phase, and this makes more sense most of the time.
Event delegation
In the last section, we looked at a problem caused by event bubbling and how to fix it. Event bubbling isn't just annoying, though: it can be very useful. In particular, it enables event delegation. In this practice, when we want some code to run when the user interacts with any one of a large number of child elements, we set the event listener on their parent and have events that happen on them bubble up to their parent rather than having to set the event listener on every child individually.
Let's go back to our first example, where we set the background color of the whole page when the user clicked a button. Suppose that instead, the page is divided into 16 tiles, and we want to set each tile to a random color when the user clicks that tile.
Here's the HTML:
html
Copy to Clipboard
play
<div id="container">
  <div class="tile"></div>
  <div class="tile"></div>
  <div class="tile"></div>
  <div class="tile"></div>
  <div class="tile"></div>
  <div class="tile"></div>
  <div class="tile"></div>
  <div class="tile"></div>
  <div class="tile"></div>
  <div class="tile"></div>
  <div class="tile"></div>
  <div class="tile"></div>
  <div class="tile"></div>
  <div class="tile"></div>
  <div class="tile"></div>
  <div class="tile"></div>
</div>

We have a little CSS, to set the size and position of the tiles:
css
Copy to Clipboard
play
#container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 100px;
}

Now in JavaScript, we could add a click event handler for every tile. But a much simpler and more efficient option is to set the click event handler on the parent, and rely on event bubbling to ensure that the handler is executed when the user clicks on a tile:
js
Copy to Clipboard
play
function random(number) {
  return Math.floor(Math.random() * number);
}


function bgChange() {
  const rndCol = `rgb(${random(255)} ${random(255)} ${random(255)})`;
  return rndCol;
}


const container = document.querySelector("#container");


container.addEventListener("click", (event) => {
  event.target.style.backgroundColor = bgChange();
});

The output is as follows (try clicking around on it):
play
Note: In this example, we're using event.target to get the element that was the target of the event (that is, the innermost element). If we wanted to access the element that handled this event (in this case the container) we could use event.currentTarget.
Note: See useful-eventtarget.html for the full source code; also see it running live here.
target and currentTarget
If you look closely at the examples we've introduced in this page, you'll see that we're using two different properties of the event object to access the element that was clicked. In Setting a listener on a parent element we're using event.currentTarget. However, in Event delegation, we're using event.target.
The difference is that target refers to the element on which the event was initially fired, while currentTarget refers to the element to which this event handler has been attached.
While target remains the same while an event bubbles up, currentTarget will be different for event handlers that are attached to different elements in the hierarchy.
We can see this if we slightly adapt the Bubbling example above. We're using the same HTML as before:
html
Copy to Clipboard
play
<body>
  <div id="container">
    <button>Click me!</button>
  </div>
  <pre id="output"></pre>
</body>

The JavaScript is almost the same, except we're logging both target and currentTarget:
js
Copy to Clipboard
play
const output = document.querySelector("#output");
function handleClick(e) {
  const logTarget = `Target: ${e.target.tagName}`;
  const logCurrentTarget = `Current target: ${e.currentTarget.tagName}`;
  output.textContent += `${logTarget}, ${logCurrentTarget}\n`;
}


const container = document.querySelector("#container");
const button = document.querySelector("button");


document.body.addEventListener("click", handleClick);
container.addEventListener("click", handleClick);
button.addEventListener("click", handleClick);

Note that when we click the button, target is the button element every time, whether the event handler is attached to the button itself, to the <div>, or to the <body>. However currentTarget identifies the element whose event handler we are currently running:
play
The target property is commonly used in event delegation, as in our Event delegation example above.
Test your skills!
You've reached the end of this article, but can you remember the most important information? To verify you've retained this information before you move on — see Test your skills: Events.
Summary
You should now know all you need to know about web events at this early stage. As mentioned, events are not really part of the core JavaScript — they are defined in browser Web APIs.
Also, it is important to understand that the different contexts in which JavaScript is used have different event models — from Web APIs to other areas such as browser WebExtensions and Node.js (server-side JavaScript). We are not expecting you to understand all of these areas now, but it certainly helps to understand the basics of events as you forge ahead with learning web development.
Next up, you'll find a challenge that will test your understanding of the last few topics.

Challenge: Image gallery
Previous


Overview: Dynamic scripting with JavaScript


Next


Now that we've looked at the fundamental building blocks of JavaScript, we'll test your knowledge of loops, functions, conditionals and events by getting you to build a fairly common item you'll see on a lot of websites — a JavaScript-powered image gallery.
Starting point
To start this challenge, you should go and grab the ZIP file for the example, unzip it somewhere on your computer, and do the exercise locally to begin with.
Alternatively, you could use an online editor such as CodePen or JSFiddle.
Note: If you get stuck, you can reach out to us in one of our communication channels.
Project brief
You have been provided with some HTML, CSS and image assets and a few lines of JavaScript code; you need to write the necessary JavaScript to turn this into a working program. The HTML body looks like this:
html
Copy to Clipboard
<h1>Image gallery example</h1>

<div class="full-img">
  <img
    class="displayed-img"
    src="images/pic1.jpg"
    alt="Closeup of a blue human eye" />
  <div class="overlay"></div>
  <button class="dark">Darken</button>
</div>

<div class="thumb-bar"></div>
The example looks like this:

The most interesting parts of the example's CSS file:
It absolutely positions the three elements inside the full-img <div> — the <img> in which the full-sized image is displayed, an empty <div> that is sized to be the same size as the <img> and put right over the top of it (this is used to apply a darkening effect to the image via a semi-transparent background color), and a <button> that is used to control the darkening effect.
It sets the width of any images inside the thumb-bar <div> (so-called "thumbnail" images) to 20%, and floats them to the left so they sit next to one another on a line.
Your JavaScript needs to:
Declare a const array listing the filenames of each image, such as 'pic1.jpg'.
Declare a const object listing the alternative text for each image.
Loop through the array of filenames, and for each one, insert an <img> element inside the thumb-bar <div> that embeds that image in the page along with its alternative text.
Add a click event listener to each <img> inside the thumb-bar <div> so that, when they are clicked, the corresponding image and alternative text are displayed in the displayed-img <img> element.
Add a click event listener to the <button> so that when it is clicked, a darken effect is applied to the full-size image. When it is clicked again, the darken effect is removed again.
To give you more of an idea, have a look at the finished example (no peeking at the source code!)
Steps to complete
The following sections describe what you need to do.
Declare an array of image filenames
You need to create an array listing the filenames of all the images to include in the gallery. The array should be declared as a constant.
Looping through the images
We've already provided you with lines that store a reference to the thumb-bar <div> inside a constant called thumbBar, create a new <img> element, set its src and alt attributes to a placeholder value xxx, and append this new <img> element inside thumbBar.
You need to:
Put the section of code below the "Looping through images" comment inside a loop that loops through all the filenames in the array.
In each loop iteration, replace the xxx placeholder values with a string that will equal the path to the image and alt attributes in each case. Set the value of the src and alt attributes to these values in each case. Remember that the image is inside the images directory, and its name is pic1.jpg, pic2.jpg, etc.
Adding a click event listener to each thumbnail image
In each loop iteration, you need to add a click event listener to the current newImage — this listener should find the value of the src attribute of the current image. Set the src attribute value of the displayed-img <img> to the src value passed in as a parameter. Then do the same for the alt attribute.
Alternatively, you can add one event listener to the thumb bar.
Writing a handler that runs the darken/lighten button
That just leaves our darken/lighten <button> — we've already provided a line that stores a reference to the <button> in a constant called btn. You need to add a click event listener that:
Checks the current class name set on the <button> — you can again achieve this by using getAttribute().
If the class name is "dark", changes the <button> class to "light" (using setAttribute()), its text content to "Lighten", and the background-color of the overlay <div> to "rgb(0 0 0 / 50%)".
If the class name is not "dark", changes the <button> class to "dark", its text content back to "Darken", and the background-color of the overlay <div> to "rgb(0 0 0 / 0%)".
The following lines provide a basis for achieving the changes stipulated in points 2 and 3 above.
js
Copy to Clipboard
btn.setAttribute("class", xxx);
btn.textContent = xxx;
overlay.style.backgroundColor = xxx;
Hints and tips
You don't need to edit the HTML or CSS in any way.
Previous


JavaScript object basics
Previous


Overview: Dynamic scripting with JavaScript


Next


In this article, we'll look at fundamental JavaScript object syntax, and revisit some JavaScript features that we've already seen earlier in the course, reiterating the fact that many of the features you've already dealt with are objects.
Prerequisites:
An understanding of HTML and the fundamentals of CSS, familiarity with JavaScript basics as covered in previous lessons.
Learning outcomes:
Understand that in JavaScript most things are objects, and you've probably used objects every time you've touched JavaScript.
Basic syntax: Object literals, properties and methods, nesting objects and arrays in objects.
Using constructors to create a new object.
Object scope, and this.
Accessing properties and methods — bracket and dot syntax.

Object basics
An object is a collection of related data and/or functionality. These usually consist of several variables and functions (which are called properties and methods when they are inside objects). Let's work through an example to understand what they look like.
To begin with, make a local copy of our oojs.html file. This contains very little — a <script> element for us to write our source code into. We'll use this as a basis for exploring basic object syntax. While working with this example you should have your developer tools JavaScript console open and ready to type in some commands.
As with many things in JavaScript, creating an object often begins with defining and initializing a variable. Try entering the following line below the JavaScript code that's already in your file, then saving and refreshing:
js
Copy to Clipboard
const person = {};

Now open your browser's JavaScript console, enter person into it, and press Enter/Return. You should get a result similar to one of the below lines:
[object Object]
Object { }
{ }

Congratulations, you've just created your first object. Job done! But this is an empty object, so we can't really do much with it. Let's update the JavaScript object in our file to look like this:
js
Copy to Clipboard
const person = {
  name: ["Bob", "Smith"],
  age: 32,
  bio: function () {
    console.log(`${this.name[0]} ${this.name[1]} is ${this.age} years old.`);
  },
  introduceSelf: function () {
    console.log(`Hi! I'm ${this.name[0]}.`);
  },
};

After saving and refreshing, try entering some of the following into the JavaScript console on your browser devtools:
js
Copy to Clipboard
person.name;
person.name[0];
person.age;
person.bio();
// "Bob Smith is 32 years old."
person.introduceSelf();
// "Hi! I'm Bob."

You have now got some data and functionality inside your object, and are now able to access them with some nice simple syntax!
So what is going on here? Well, an object is made up of multiple members, each of which has a name (e.g., name and age above), and a value (e.g., ['Bob', 'Smith'] and 32). Each name/value pair must be separated by a comma, and the name and value in each case are separated by a colon. The syntax always follows this pattern:
js
Copy to Clipboard
const objectName = {
  member1Name: member1Value,
  member2Name: member2Value,
  member3Name: member3Value,
};

The value of an object member can be pretty much anything — in our person object we've got a number, an array, and two functions. The first two items are data items, and are referred to as the object's properties. The last two items are functions that allow the object to do something with that data, and are referred to as the object's methods.
When the object's members are functions there's a simpler syntax. Instead of bio: function () we can write bio(). Like this:
js
Copy to Clipboard
const person = {
  name: ["Bob", "Smith"],
  age: 32,
  bio() {
    console.log(`${this.name[0]} ${this.name[1]} is ${this.age} years old.`);
  },
  introduceSelf() {
    console.log(`Hi! I'm ${this.name[0]}.`);
  },
};

From now on, we'll use this shorter syntax.
An object like this is referred to as an object literal — we've literally written out the object contents as we've come to create it. This is different compared to objects instantiated from classes, which we'll look at later on.
It is very common to create an object using an object literal when you want to transfer a series of structured, related data items in some manner, for example sending a request to the server to be put into a database. Sending a single object is much more efficient than sending several items individually, and it is easier to work with than an array, when you want to identify individual items by name.
Dot notation
Above, you accessed the object's properties and methods using dot notation. The object name (person) acts as the namespace — it must be entered first to access anything inside the object. Next you write a dot, then the item you want to access — this can be the name of a simple property, an item of an array property, or a call to one of the object's methods, for example:
js
Copy to Clipboard
person.age;
person.bio();

Objects as object properties
An object property can itself be an object. For example, try changing the name member from
js
Copy to Clipboard
const person = {
  name: ["Bob", "Smith"],
};

to
js
Copy to Clipboard
const person = {
  name: {
    first: "Bob",
    last: "Smith",
  },
  // …
};

To access these items you just need to chain the extra step onto the end with another dot. Try these in the JS console:
js
Copy to Clipboard
person.name.first;
person.name.last;

If you do this, you'll also need to go through your method code and change any instances of
js
Copy to Clipboard
name[0];
name[1];

to
js
Copy to Clipboard
name.first;
name.last;

Otherwise, your methods will no longer work.
Bracket notation
Bracket notation provides an alternative way to access object properties. Instead of using dot notation like this:
js
Copy to Clipboard
person.age;
person.name.first;

You can instead use square brackets:
js
Copy to Clipboard
person["age"];
person["name"]["first"];

This looks very similar to how you access the items in an array, and it is basically the same thing — instead of using an index number to select an item, you are using the name associated with each member's value. It is no wonder that objects are sometimes called associative arrays — they map strings to values in the same way that arrays map numbers to values.
Dot notation is generally preferred over bracket notation because it is more succinct and easier to read. However there are some cases where you have to use square brackets. For example, if an object property name is held in a variable, then you can't use dot notation to access the value, but you can access the value using bracket notation.
In the example below, the logProperty() function can use person[propertyName] to retrieve the value of the property named in propertyName.
js
Copy to Clipboard
const person = {
  name: ["Bob", "Smith"],
  age: 32,
};


function logProperty(propertyName) {
  console.log(person[propertyName]);
}


logProperty("name");
// ["Bob", "Smith"]
logProperty("age");
// 32

Setting object members
So far we've only looked at retrieving (or getting) object members — you can also set (update) the value of object members by declaring the member you want to set (using dot or bracket notation), like this:
js
Copy to Clipboard
person.age = 45;
person["name"]["last"] = "Cratchit";

Try entering the above lines, and then getting the members again to see how they've changed, like so:
js
Copy to Clipboard
person.age;
person["name"]["last"];

Setting members doesn't just stop at updating the values of existing properties and methods; you can also create completely new members. Try these in the JS console:
js
Copy to Clipboard
person["eyes"] = "hazel";
person.farewell = function () {
  console.log("Bye everybody!");
};

You can now test out your new members:
js
Copy to Clipboard
person["eyes"];
person.farewell();
// "Bye everybody!"

One useful aspect of bracket notation is that it can be used to set not only member values dynamically, but member names too. Let's say we wanted users to be able to store custom value types in their people data, by typing the member name and value into two text inputs. We could get those values like this:
js
Copy to Clipboard
const myDataName = nameInput.value;
const myDataValue = nameValue.value;

We could then add this new member name and value to the person object like this:
js
Copy to Clipboard
person[myDataName] = myDataValue;

To test this, try adding the following lines into your code, just below the closing curly brace of the person object:
js
Copy to Clipboard
const myDataName = "height";
const myDataValue = "1.75m";
person[myDataName] = myDataValue;

Now try saving and refreshing, and entering the following into your text input:
js
Copy to Clipboard
person.height;

Adding a property to an object using the method above isn't possible with dot notation, which can only accept a literal member name, not a variable value pointing to a name.
What is "this"?
You may have noticed something slightly strange in our methods. Look at this one for example:
js
Copy to Clipboard
const person = {
  // …
  introduceSelf() {
    console.log(`Hi! I'm ${this.name[0]}.`);
  },
};

You are probably wondering what "this" is. The this keyword typically refers to the current object the code is being executed in. In the context of an object method, this refers to the object that the method was called on.
Let's illustrate what we mean with a simplified pair of person objects:
js
Copy to Clipboard
const person1 = {
  name: "Chris",
  introduceSelf() {
    console.log(`Hi! I'm ${this.name}.`);
  },
};


const person2 = {
  name: "Deepti",
  introduceSelf() {
    console.log(`Hi! I'm ${this.name}.`);
  },
};

In this case, person1.introduceSelf() outputs "Hi! I'm Chris."; person2.introduceSelf() outputs "Hi! I'm Deepti." This happens because when the method is called, this refers to the object on which the method is called, which allows the same method definition to work for multiple objects.
This isn't hugely useful when you are writing out object literals by hand, as using the object's name (person1 and person2) leads to the exact same result, but it will be essential when we start using constructors to create more than one object from a single object definition, and that's the subject of the next section.
Introducing constructors
Using object literals is fine when you only need to create one object, but if you have to create more than one, as in the previous section, they're seriously inadequate. We have to write out the same code for every object we create, and if we want to change some properties of the object - like adding a height property - then we have to remember to update every object.
We would like a way to define the "shape" of an object — the set of methods and the properties it can have — and then create as many objects as we like, just updating the values for the properties that are different.
The first version of this is just a function:
js
Copy to Clipboard
function createPerson(name) {
  const obj = {};
  obj.name = name;
  obj.introduceSelf = function () {
    console.log(`Hi! I'm ${this.name}.`);
  };
  return obj;
}

This function creates and returns a new object each time we call it. The object will have two members:
a property name
a method introduceSelf().
Note that createPerson() takes a parameter name to set the value of the name property, but the value of the introduceSelf() method will be the same for all objects created using this function. This is a very common pattern for creating objects.
Now we can create as many objects as we like, reusing the definition:
js
Copy to Clipboard
const salva = createPerson("Salva");
salva.introduceSelf();
// "Hi! I'm Salva."


const frankie = createPerson("Frankie");
frankie.introduceSelf();
// "Hi! I'm Frankie."

This works fine but is a bit long-winded: we have to create an empty object, initialize it, and return it. A better way is to use a constructor. A constructor is just a function called using the new keyword. When you call a constructor, it will:
create a new object
bind this to the new object, so you can refer to this in your constructor code
run the code in the constructor
return the new object.
Constructors, by convention, start with a capital letter and are named for the type of object they create. So we could rewrite our example like this:
js
Copy to Clipboard
function Person(name) {
  this.name = name;
  this.introduceSelf = function () {
    console.log(`Hi! I'm ${this.name}.`);
  };
}

To call Person() as a constructor, we use new:
js
Copy to Clipboard
const salva = new Person("Salva");
salva.introduceSelf();
// "Hi! I'm Salva."


const frankie = new Person("Frankie");
frankie.introduceSelf();
// "Hi! I'm Frankie."

You've been using objects all along
As you've been going through these examples, you have probably been thinking that the dot notation you've been using is very familiar. That's because you've been using it throughout the course! Every time we've been working through an example that uses a built-in browser API or JavaScript object, we've been using objects, because such features are built using exactly the same kind of object structures that we've been looking at here, albeit more complex ones than in our own basic custom examples.
So when you used string methods like:
js
Copy to Clipboard
myString.split(",");

You were using a method available on a String object. Every time you create a string in your code, that string is automatically created as an instance of String, and therefore has several common methods and properties available on it.
When you accessed the document object model using lines like this:
js
Copy to Clipboard
const myDiv = document.createElement("div");
const myVideo = document.querySelector("video");

You were using methods available on a Document object. For each webpage loaded, an instance of Document is created, called document, which represents the entire page's structure, content, and other features such as its URL. Again, this means that it has several common methods and properties available on it.
The same is true of pretty much any other built-in object or API you've been using — Array, Math, and so on.
Note that built in objects and APIs don't always create object instances automatically. As an example, the Notifications API — which allows modern browsers to fire system notifications — requires you to instantiate a new object instance using the constructor for each notification you want to fire. Try entering the following into your JavaScript console:
js
Copy to Clipboard
const myNotification = new Notification("Hello!");

Test your skills!
You've reached the end of this article, but can you remember the most important information? You can find some further tests to verify that you've retained this information before you move on — see Test your skills: Object basics.
Summary
You should now have a good idea of how to work with objects in JavaScript — including creating your own simple objects. You should also appreciate that objects are very useful as structures for storing related data and functionality — if you tried to keep track of all the properties and methods in our person object as separate variables and functions, it would be inefficient and frustrating, and we'd run the risk of clashing with other variables and functions that have the same names. Objects let us keep the information safely locked away in their own package, out of harm's way.
In the next article we'll look at DOM scripting, which unlocks a large amount of fundamental browser API functionality.
Previous


Overview: Dynamic scripting with JavaScript


Next


Help improve MDN
Was this page helpful to you?
Yes
No
Learn how to contribute.

DOM scripting introduction
Previous


Overview: Dynamic scripting with JavaScript


Next


When writing web pages and apps, one of the most common things you'll want to do is change the document structure in some way. This is usually done by manipulating the Document Object Model (DOM) via a set of built-in browser APIs for controlling HTML and styling information. In this article we'll introduce you to DOM scripting.
Prerequisites:
An understanding of HTML and the fundamentals of CSS, familiarity with JavaScript basics as covered in previous lessons.
Learning outcomes:
What the DOM is — the browser's internal representation of the document's HTML structure as a hierarchy of objects.
The important parts of a web browser as represented in JavaScript — Navigator, Window, and Document.
How DOM nodes exist relative to each other in the DOM tree — root, parent, child, sibling, and descendant.
Getting references to DOM nodes, creating new nodes, adding and removing nodes and attributes.
Manipulating CSS styles with JavaScript.


The important parts of a web browser
Web browsers are very complicated pieces of software with a lot of moving parts, many of which can't be controlled or manipulated by a web developer using JavaScript. You might think that such limitations are a bad thing, but browsers are locked down for good reasons, mostly centering around security. Imagine if a website could get access to your stored passwords or other sensitive information, and log into websites as if it were you?
Despite the limitations, Web APIs still give us access to a lot of functionality that enable us to do a great many things with web pages. There are a few really obvious bits you'll reference regularly in your code — consider the following diagram, which represents the main parts of a browser directly involved in viewing web pages:

The window represents the browser tab that a web page is loaded into; this is represented in JavaScript by the Window object. Using methods available on this object you can do things like return the window's size (see Window.innerWidth and Window.innerHeight), manipulate the document loaded into that window, store data specific to that document on the client-side (for example using a local database or other storage mechanism), attach an event handler to the current window, and more.
The navigator represents the state and identity of the browser as it exists on the web. In JavaScript, this is represented by the Navigator object. You can use this object to retrieve things like the user's preferred language, a media stream from the user's webcam, etc.
The document (represented by the DOM in browsers) is the actual page loaded into the window, and is represented in JavaScript by the Document object. You can use this object to return and manipulate information on the HTML and CSS that comprises the document, for example get a reference to an element in the DOM, change its text content, apply new styles to it, create new elements and add them to the current element as children, or even delete it altogether.
In this article we'll focus mostly on manipulating the document, but we'll show a few other useful bits besides.
The document object model
Let's provide a brief recap on the Document Object Model (DOM), which we also looked at earlier in the course. The document currently loaded in each one of your browser tabs is represented by a DOM. This is a "tree structure" representation created by the browser that enables the HTML structure to be easily accessed by programming languages — for example the browser itself uses it to apply styling and other information to the correct elements as it renders a page, and developers like you can manipulate the DOM with JavaScript after the page has been rendered.
Note: Scrimba's The Document Object Model MDN learning partner provides a handy walkthrough of the "DOM" term and what it means.
We have created an example page at dom-example.html (see it live also). Try opening this up in your browser — it is a very simple page containing a <section> element inside which you can find an image, and a paragraph with a link inside. The HTML source code looks like this:
html
Copy to Clipboard
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <title>Simple DOM example</title>
  </head>
  <body>
    <section>
      <img
        src="dinosaur.png"
        alt="A red Tyrannosaurus Rex: A two legged dinosaur
        standing upright like a human, with small arms, and a
        large head with lots of sharp teeth." />
      <p>
        Here we will add a link to the
        <a href="https://www.mozilla.org/">Mozilla homepage</a>
      </p>
    </section>
  </body>
</html>
The DOM on the other hand looks like this:

Note: This DOM tree diagram was created using Ian Hickson's Live DOM viewer.
Each entry in the tree is called a node. You can see in the diagram above that some nodes represent elements (identified as HTML, HEAD, META and so on) and others represent text (identified as #text). There are other types of nodes as well, but these are the main ones you'll encounter.
Nodes are also referred to by their position in the tree relative to other nodes:
Root node: The top node in the tree, which in the case of HTML is always the HTML node (other markup vocabularies like SVG and custom XML will have different root elements).
Child node: A node directly inside another node. For example, IMG is a child of SECTION in the above example.
Descendant node: A node anywhere inside another node. For example, IMG is a child of SECTION in the above example, and it is also a descendant. IMG is not a child of BODY, as it is two levels below it in the tree, but it is a descendant of BODY.
Parent node: A node which has another node inside it. For example, BODY is the parent node of SECTION in the above example.
Sibling nodes: Nodes that sit on the same level under the same parent node in the DOM tree. For example, IMG and P are siblings in the above example.
It is useful to familiarize yourself with this terminology before working with the DOM, as a number of the code terms you'll come across make use of them. You'll also come across them in CSS (for example, descendant selector, child selector).
Doing some basic DOM manipulation
To start learning about DOM manipulation, let's begin with a practical example.
Take a local copy of the dom-example.html page and the image that goes along with it.
Add a <script></script> element just above the closing </body> tag.
To manipulate an element inside the DOM, you first need to select it and store a reference to it inside a variable. Inside your script element, add the following line:
js
Copy to Clipboard
const link = document.querySelector("a");


Now we have the element reference stored in a variable, we can start to manipulate it using properties and methods available to it (these are defined on interfaces like HTMLAnchorElement in the case of <a> element, its more general parent interface HTMLElement, and Node — which represents all nodes in a DOM). First of all, let's change the text inside the link by updating the value of the Node.textContent property. Add the following line below the previous one:
js
Copy to Clipboard
link.textContent = "Mozilla Developer Network";


We should also change the URL the link is pointing to, so that it doesn't go to the wrong place when it is clicked on. Add the following line, again at the bottom:
js
Copy to Clipboard
link.href = "https://developer.mozilla.org";


Note that, as with many things in JavaScript, there are many ways to select an element and store a reference to it in a variable. Document.querySelector() is the recommended modern approach. It is convenient because it allows you to select elements using CSS selectors. The above querySelector() call will match the first <a> element that appears in the document. If you wanted to match and do things to multiple elements, you could use Document.querySelectorAll(), which matches every element in the document that matches the selector, and stores references to them in an array-like object called a NodeList.
There are older methods available for grabbing element references, such as:
Document.getElementById(), which selects an element with a given id attribute value, e.g., <p id="myId">My paragraph</p>. The ID is passed to the function as a parameter, i.e., const elementRef = document.getElementById('myId').
Document.getElementsByTagName(), which returns an array-like object containing all the elements on the page of a given type, for example <p>s, <a>s, etc. The element type is passed to the function as a parameter, i.e., const elementRefArray = document.getElementsByTagName('p').
These two work better in older browsers than the modern methods like querySelector(), but are not as convenient. Have a look and see what others you can find!
Creating and placing new nodes
The above has given you a little taste of what you can do, but let's go further and look at how we can create new elements.
Going back to the current example, let's start by grabbing a reference to our <section> element — add the following code at the bottom of your existing script (do the same with the other lines too):
js
Copy to Clipboard
const sect = document.querySelector("section");


Now let's create a new paragraph using Document.createElement() and give it some text content in the same way as before:
js
Copy to Clipboard
const para = document.createElement("p");
para.textContent = "We hope you enjoyed the ride.";


You can now append the new paragraph at the end of the section using Node.appendChild():
js
Copy to Clipboard
sect.appendChild(para);


Finally for this part, let's add a text node to the paragraph the link sits inside, to round off the sentence nicely. First we will create the text node using Document.createTextNode():
js
Copy to Clipboard
const text = document.createTextNode(
  " — the premier source for web development knowledge.",
);


Now we'll grab a reference to the paragraph the link is inside, and append the text node to it:
js
Copy to Clipboard
const linkPara = document.querySelector("p");
linkPara.appendChild(text);


That's most of what you need for adding nodes to the DOM — you'll make a lot of use of these methods when building dynamic interfaces (we'll look at some examples later).
Moving and removing elements
There may be times when you want to move nodes, or delete them from the DOM altogether. This is perfectly possible.
If we wanted to move the paragraph with the link inside it to the bottom of the section, we could do this:
js
Copy to Clipboard
sect.appendChild(linkPara);
This moves the paragraph down to the bottom of the section. You might have thought it would make a second copy of it, but this is not the case — linkPara is a reference to the one and only copy of that paragraph. If you wanted to make a copy and add that as well, you'd need to use Node.cloneNode() instead.
Removing a node is pretty simple as well, at least when you have a reference to the node to be removed and its parent. In our current case, we just use Node.removeChild(), like this:
js
Copy to Clipboard
sect.removeChild(linkPara);
When you want to remove a node based only on a reference to itself, which is fairly common, you can use Element.remove():
js
Copy to Clipboard
linkPara.remove();
This method is not supported in older browsers. They have no method to tell a node to remove itself, so you'd have to do the following:
js
Copy to Clipboard
linkPara.parentNode.removeChild(linkPara);
Have a go at adding the above lines to your code.
Manipulating styles
It is possible to manipulate CSS styles via JavaScript in a variety of ways.
To start with, you can get a list of all the stylesheets attached to a document using Document.styleSheets, which returns an array-like object with CSSStyleSheet objects. You can then add/remove styles as wished. However, we're not going to expand on those features because they are a somewhat archaic and difficult way to manipulate style. There are much easier ways.
The first way is to add inline styles directly onto elements you want to dynamically style. This is done with the HTMLElement.style property, which contains inline styling information for each element in the document. You can set properties of this object to directly update element styles.
As an example, try adding these lines to our ongoing example:
js
Copy to Clipboard
para.style.color = "white";
para.style.backgroundColor = "black";
para.style.padding = "10px";
para.style.width = "250px";
para.style.textAlign = "center";


Reload the page and you'll see that the styles have been applied to the paragraph. If you look at that paragraph in your browser's Page Inspector/DOM inspector, you'll see that these lines are indeed adding inline styles to the document:
html
Copy to Clipboard
<p
  style="color: white; background-color: black; padding: 10px; width: 250px; text-align: center;">
  We hope you enjoyed the ride.
</p>


Note: Notice how the JavaScript property versions of the CSS styles are written in lower camel case whereas the CSS versions are hyphenated (kebab-case) (e.g., backgroundColor versus background-color). Make sure you don't get these mixed up, otherwise it won't work.
There is another common way to dynamically manipulate styles on your document, which we'll look at now.
Delete the previous five lines you added to the JavaScript.
Add the following inside your HTML <head>:
html
Copy to Clipboard
<style>
  .highlight {
    color: white;
    background-color: black;
    padding: 10px;
    width: 250px;
    text-align: center;
  }
</style>


Now we'll turn to a very useful method for general HTML manipulation — Element.setAttribute() — this takes two arguments, the attribute you want to set on the element, and the value you want to set it to. In this case we will set a class name of highlight on our paragraph:
js
Copy to Clipboard
para.setAttribute("class", "highlight");


Refresh your page, and you'll see no change — the CSS is still applied to the paragraph, but this time by giving it a class that is selected by our CSS rule, not as inline CSS styles.
Which method you choose is up to you; both have their advantages and disadvantages. The first method takes less setup and is good for simple uses, whereas the second method is more purist (no mixing CSS and JavaScript, no inline styles, which are seen as a bad practice). As you start building larger and more involved apps, you will probably start using the second method more, but it is really up to you.
At this point, we haven't really done anything useful! There is no point using JavaScript to create static content — you might as well just write it into your HTML and not use JavaScript. It is more complex than HTML, and creating your content with JavaScript also has other issues attached to it (such as not being readable by search engines).
In the next section we will look at a more practical use of DOM APIs.
Note: You can find our finished version of the dom-example.html demo on GitHub (see it live also).
Creating a dynamic shopping list
In this exercise we want you to build a dynamic shopping list that allows you to add items using a form input and button. When you add enter an item and press the button:
The item should appear in the list.
Each item should be given a button that can be pressed to delete that item off the list.
The input should be emptied and focused, ready for you to enter another item.
The finished demo will look something like the following — try it out before you build it!
play
To complete the exercise, follow the steps below, and make sure that the list behaves as described above.
To start with, download a copy of our shopping-list.html starting file and make a copy of it somewhere. You'll see that it has some minimal CSS, a div with a label, input, and button, and an empty list and <script> element. You'll be making all your additions inside the script.
Create three variables that hold references to the list (<ul>), <input>, and <button> elements.
Create a function that will run in response to the button being clicked.
Inside the function body, start off by storing the current value of the input element in a variable.
Next, empty the input element by setting its value to an empty string — "".
Create three new elements — a list item (<li>), <span>, and <button>, and store them in variables.
Append the span and the button as children of the list item.
Set the text content of the span to the input element value you saved earlier, and the text content of the button to 'Delete'.
Append the list item as a child of the list.
Attach an event handler to the delete button so that, when clicked, it will delete the entire list item (<li>...</li>).
Finally, use the focus() method to focus the input element ready for entering the next shopping list item.
Summary
We have reached the end of our study of document and DOM manipulation. At this point you should understand what the important parts of a web browser are with respect to controlling documents and other aspects of the user's web experience. Most importantly, you should understand what the Document Object Model is, and how to manipulate it to create useful functionality.
See also
There are lots more features you can use to manipulate your documents. Check out some of our references and see what you can discover:
Document
Window
Node
HTMLElement, HTMLInputElement, HTMLImageElement, etc.
DOM Scripting, explainers.dev
Previous


Making network requests with JavaScript
Previous


Overview: Dynamic scripting with JavaScript


Next


Another very common task in modern websites and applications is making network requests to retrieve individual data items from the server to update sections of a webpage without having to load an entire new page. This seemingly small detail has had a huge impact on the performance and behavior of sites, so in this article, we'll explain the concept and look at technologies that make it possible: in particular, the Fetch API.
Prerequisites:
An understanding of HTML and the fundamentals of CSS, familiarity with JavaScript basics as covered in previous lessons.
Learning outcomes:
Asynchronous network requests, which is by far the most common asynchronous JavaScript use case on the web.
Common types of resources that are fetched from the network: JSON, media assets, data from RESTful APIs.
How to use fetch() to implement asynchronous network requests.


What is the problem here?
A web page consists of an HTML page and (usually) various other files, such as stylesheets, scripts, and images. The basic model of page loading on the Web is that your browser makes one or more HTTP requests to the server for the files needed to display the page, and the server responds with the requested files. If you visit another page, the browser requests the new files, and the server responds with them.

This model works perfectly well for many sites. But consider a website that's very data-driven. For example, a library website like the Vancouver Public Library. Among other things you could think of a site like this as a user interface to a database. It might let you search for a particular genre of book, or might show you recommendations for books you might like, based on books you've previously borrowed. When you do this, it needs to update the page with the new set of books to display. But note that most of the page content — including items like the page header, sidebar, and footer — stays the same.
The trouble with the traditional model here is that we'd have to fetch and load the entire page, even when we only need to update one part of it. This is inefficient and can result in a poor user experience.
So instead of the traditional model, many websites use JavaScript APIs to request data from the server and update the page content without a page load. So when the user searches for a new product, the browser only requests the data which is needed to update the page — the set of new books to display, for instance.

The main API here is the Fetch API. This enables JavaScript running in a page to make an HTTP request to a server to retrieve specific resources. When the server provides them, the JavaScript can use the data to update the page, typically by using DOM manipulation APIs. The data requested is often JSON, which is a good format for transferring structured data, but can also be HTML or just text.
This is a common pattern for data-driven sites such as Amazon, YouTube, eBay, and so on. With this model:
Page updates are a lot quicker and you don't have to wait for the page to refresh, meaning that the site feels faster and more responsive.
Less data is downloaded on each update, meaning less wasted bandwidth. This may not be such a big issue on a desktop on a broadband connection, but it's a major issue on mobile devices and in countries that don't have ubiquitous fast internet service.
Note: In the early days, this general technique was known as Asynchronous JavaScript and XML (AJAX), because it tended to request XML data. This is normally not the case these days (you'd be more likely to request JSON), but the result is still the same, and the term "AJAX" is still often used to describe the technique.
To speed things up even further, some sites also store assets and data on the user's computer when they are first requested, meaning that on subsequent visits they use the local versions instead of downloading fresh copies every time the page is first loaded. The content is only reloaded from the server when it has been updated.
The Fetch API
In this section we'll walk through a couple of examples of the Fetch API.
The examples below are of a certain level of complexity, and show how to use the Fetch API in some real world contexts. If you have never used fetch before, you might want to start by working through Scrimba's First fetch MDN learning partner interactive tutorial, which provides a very simple intro walkthrough.
Fetching text content
For this example, we'll request data out of a few different text files and use them to populate a content area.
This series of files will act as our fake database; in a real application, we'd be more likely to use a server-side language like PHP, Python, or Node to request our data from a database. Here, however, we want to keep it simple and concentrate on the client-side part of this.
To begin this example, make a local copy of fetch-start.html and the four text files — verse1.txt, verse2.txt, verse3.txt, and verse4.txt — in a new directory on your computer. In this example, we will fetch a different verse of the poem (which you may well recognize) when it's selected in the drop-down menu.
Just inside the <script> element, add the following code. This stores references to the <select> and <pre> elements and adds a listener to the <select> element, so that when the user selects a new value, the new value is passed to the function named updateDisplay() as a parameter.
js
Copy to Clipboard
const verseChoose = document.querySelector("select");
const poemDisplay = document.querySelector("pre");


verseChoose.addEventListener("change", () => {
  const verse = verseChoose.value;
  updateDisplay(verse);
});
Let's define our updateDisplay() function. First of all, put the following beneath your previous code block — this is the empty shell of the function.
js
Copy to Clipboard
function updateDisplay(verse) {


}
We'll start our function by constructing a relative URL pointing to the text file we want to load, as we'll need it later. The value of the <select> element at any time is the same as the text inside the selected <option> (unless you specify a different value in a value attribute) — so for example "Verse 1". The corresponding verse text file is "verse1.txt", and is in the same directory as the HTML file, therefore just the file name will do.
However, web servers tend to be case-sensitive, and the file name doesn't have a space in it. To convert "Verse 1" to "verse1.txt" we need to convert the 'V' to lower case, remove the space, and add ".txt" on the end. This can be done with replace(), toLowerCase(), and template literal. Add the following lines inside your updateDisplay() function:
js
Copy to Clipboard
verse = verse.replace(" ", "").toLowerCase();
const url = `${verse}.txt`;
Finally we're ready to use the Fetch API:
js
Copy to Clipboard
// Call `fetch()`, passing in the URL.
fetch(url)
  // fetch() returns a promise. When we have received a response from the server,
  // the promise's `then()` handler is called with the response.
  .then((response) => {
    // Our handler throws an error if the request did not succeed.
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    // Otherwise (if the response succeeded), our handler fetches the response
    // as text by calling response.text(), and immediately returns the promise
    // returned by `response.text()`.
    return response.text();
  })
  // When response.text() has succeeded, the `then()` handler is called with
  // the text, and we copy it into the `poemDisplay` box.
  .then((text) => {
    poemDisplay.textContent = text;
  })
  // Catch any errors that might happen, and display a message
  // in the `poemDisplay` box.
  .catch((error) => {
    poemDisplay.textContent = `Could not fetch verse: ${error}`;
  });
There's quite a lot to unpack in here.
First, the entry point to the Fetch API is a global function called fetch(), that takes the URL as a parameter (it takes another optional parameter for custom settings, but we're not using that here).
Next, fetch() is an asynchronous API which returns a Promise. If you don't know what that is, read the module on asynchronous JavaScript, and in particular the lesson on promises, then come back here. You'll find that article also talks about the fetch() API!
So because fetch() returns a promise, we pass a function into the then() method of the returned promise. This method will be called when the HTTP request has received a response from the server. In the handler, we check that the request succeeded, and throw an error if it didn't. Otherwise, we call response.text(), to get the response body as text.
It turns out that response.text() is also asynchronous, so we return the promise it returns, and pass a function into the then() method of this new promise. This function will be called when the response text is ready, and inside it we will update our <pre> block with the text.
Finally, we chain a catch() handler at the end, to catch any errors thrown in either of the asynchronous functions we called or their handlers.
One problem with the example as it stands is that it won't show any of the poem when it first loads. To fix this, add the following two lines at the bottom of your code (just above the closing </script> tag) to load verse 1 by default, and make sure the <select> element always shows the correct value:
js
Copy to Clipboard
updateDisplay("Verse 1");
verseChoose.value = "Verse 1";
Serving your example from a server
Modern browsers will not run HTTP requests if you just run the example from a local file. This is because of security restrictions (for more on web security, read Website security).
To get around this, we need to test the example by running it through a local web server. To find out how to do this, see How do you set up a local testing server?.
The can store
In this example we have created a sample site called The Can Store — it's a fictional supermarket that only sells canned goods. You can find this example live on GitHub, and see the source code.

By default, the site displays all the products, but you can use the form controls in the left-hand column to filter them by category, or search term, or both.
There is quite a lot of complex code that deals with filtering the products by category and search terms, manipulating strings so the data displays correctly in the UI, etc. We won't discuss all of it in the article, but you can find extensive comments in the code (see can-script.js).
We will, however, explain the Fetch code.
The first block that uses Fetch can be found at the start of the JavaScript:
js
Copy to Clipboard
fetch("products.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then((json) => initialize(json))
  .catch((err) => console.error(`Fetch problem: ${err.message}`));
The fetch() function returns a promise. If this completes successfully, the function inside the first .then() block contains the response returned from the network.
Inside this function we:
check that the server didn't return an error (such as 404 Not Found). If it did, we throw the error.
call json() on the response. This will retrieve the data as a JSON object. We return the promise returned by response.json().
Next we pass a function into the then() method of that returned promise. This function will be passed an object containing the response data as JSON, which we pass into the initialize() function. It is initialize() which starts the process of displaying all the products in the user interface.
To handle errors, we chain a .catch() block onto the end of the chain. This runs if the promise fails for some reason. Inside it, we include a function that is passed as a parameter, an err object. This err object can be used to report the nature of the error that has occurred, in this case we do it with a simple console.error().
However, a complete website would handle this error more gracefully by displaying a message on the user's screen and perhaps offering options to remedy the situation, but we don't need anything more than a simple console.error().
You can test the failure case yourself:
Make a local copy of the example files.
Run the code through a web server (as described above, in Serving your example from a server).
Modify the path to the file being fetched, to something like 'produc.json' (make sure it is misspelled).
Now load the index file in your browser (via localhost:8000) and look in your browser developer console. You'll see a message similar to "Fetch problem: HTTP error: 404".
The second Fetch block can be found inside the fetchBlob() function:
js
Copy to Clipboard
fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.blob();
  })
  .then((blob) => showProduct(blob, product))
  .catch((err) => console.error(`Fetch problem: ${err.message}`));
This works in much the same way as the previous one, except that instead of using json(), we use blob(). In this case we want to return our response as an image file, and the data format we use for that is Blob (the term is an abbreviation of "Binary Large Object" and can basically be used to represent large file-like objects, such as images or video files).
Once we've successfully received our blob, we pass it into our showProduct() function, which displays it.
The XMLHttpRequest API
Sometimes, especially in older code, you'll see another API called XMLHttpRequest (often abbreviated as "XHR") used to make HTTP requests. This predated Fetch, and was really the first API widely used to implement AJAX. We recommend you use Fetch if you can: it's a simpler API and has more features than XMLHttpRequest. We won't go through an example that uses XMLHttpRequest, but we will show you what the XMLHttpRequest version of our first can store request would look like:
js
Copy to Clipboard
const request = new XMLHttpRequest();


try {
  request.open("GET", "products.json");


  request.responseType = "json";


  request.addEventListener("load", () => initialize(request.response));
  request.addEventListener("error", () => console.error("XHR error"));


  request.send();
} catch (error) {
  console.error(`XHR error ${request.status}`);
}
There are five stages to this:
Create a new XMLHttpRequest object.
Call its open() method to initialize it.
Add an event listener to its load event, which fires when the response has completed successfully. In the listener we call initialize() with the data.
Add an event listener to its error event, which fires when the request encounters an error
Send the request.
We also have to wrap the whole thing in the try...catch block, to handle any errors thrown by open() or send().
Hopefully you think the Fetch API is an improvement over this. In particular, see how we have to handle errors in two different places.
Summary
This article shows how to start working with Fetch to fetch data from the server.
See also
There are however a lot of different subjects discussed in this article, which has only really scratched the surface. For a lot more detail on these subjects, try the following articles:
Using Fetch
Promises
Working with JSON data
An overview of HTTP
Server-side website programming
Previous


Overview: Dynamic scripting with JavaScript




Working with JSON
Previous


Overview: Dynamic scripting with JavaScript


Next


JavaScript Object Notation (JSON) is a standard text-based format for representing structured data based on JavaScript object syntax. It is commonly used for transmitting data in web applications (e.g., sending some data from the server to the client, so it can be displayed on a web page, or vice versa). You'll come across it quite often, so in this article, we give you all you need to work with JSON using JavaScript, including parsing JSON so you can access data within it, and creating JSON.
Prerequisites:
An understanding of HTML and the fundamentals of CSS, familiarity with JavaScript basics as covered in previous lessons.
Learning outcomes:
What JSON is — a very commonly used data format based on JavaScript object syntax.
That JSON can also contain arrays.
Retrieve JSON as a JavaScript object using mechanisms available in Web APIs (for example, Response.json() in the Fetch API).
Access values inside JSON data using bracket and dot syntax.
Converting between objects and text using JSON.parse() and JSON.stringify().

No, really, what is JSON?
JSON is a text-based data format following JavaScript object syntax. It represents structured data as a string, which is useful when you want to transmit data across a network. Even though it closely resembles JavaScript object literal syntax, it can be used independently from JavaScript. Many programming environments feature the ability to read (parse) and generate JSON. In JavaScript, the methods for parsing and generating JSON are provided by the JSON object.
Note: Converting a string to a native object is called deserialization, while converting a native object to a string so it can be transmitted across the network is called serialization.
A JSON string can be stored in its own file, which is basically just a text file with an extension of .json, and a MIME type of application/json.
JSON structure
As described above, JSON is a string whose format very much resembles JavaScript object literal format. The following is a valid JSON string representing an object. Note that it is also a valid JavaScript object literal — just with some more syntax restrictions.
json
Copy to Clipboard
{
  "squadName": "Super hero squad",
  "homeTown": "Metro City",
  "formed": 2016,
  "secretBase": "Super tower",
  "active": true,
  "members": [
    {
      "name": "Molecule Man",
      "age": 29,
      "secretIdentity": "Dan Jukes",
      "powers": ["Radiation resistance", "Turning tiny", "Radiation blast"]
    },
    {
      "name": "Madame Uppercut",
      "age": 39,
      "secretIdentity": "Jane Wilson",
      "powers": [
        "Million tonne punch",
        "Damage resistance",
        "Superhuman reflexes"
      ]
    },
    {
      "name": "Eternal Flame",
      "age": 1000000,
      "secretIdentity": "Unknown",
      "powers": [
        "Immortality",
        "Heat Immunity",
        "Inferno",
        "Teleportation",
        "Interdimensional travel"
      ]
    }
  ]
}

If you load this JSON in your JavaScript program as a string, you can parse it into a normal object and then access the data inside it using the same dot/bracket notation we looked at in the JavaScript object basics article. For example:
js
Copy to Clipboard
superHeroes.homeTown;
superHeroes.members[1].powers[2];

First, we have the variable name — superHeroes.
Inside that, we want to access the members property, so we use .members.
members contains an array populated by objects. We want to access the second object inside the array, so we use [1].
Inside this object, we want to access the powers property, so we use .powers.
Inside the powers property is an array containing the selected hero's superpowers. We want the third one, so we use [2].
The key takeaway is that there's really nothing special about working with JSON; after you've parsed it into a JavaScript object, you work with it just like you would with an object declared using the same object literal syntax.
Note: We've made the JSON seen above available inside a variable in our JSONTest.html example (see the source code). Try loading this up and then accessing data inside the variable via your browser's JavaScript console.
Arrays as JSON
Above we mentioned that JSON text basically looks like a JavaScript object inside a string. We can also convert arrays to/from JSON. The below example is perfectly valid JSON:
json
Copy to Clipboard
[
  {
    "name": "Molecule Man",
    "age": 29,
    "secretIdentity": "Dan Jukes",
    "powers": ["Radiation resistance", "Turning tiny", "Radiation blast"]
  },
  {
    "name": "Madame Uppercut",
    "age": 39,
    "secretIdentity": "Jane Wilson",
    "powers": [
      "Million tonne punch",
      "Damage resistance",
      "Superhuman reflexes"
    ]
  }
]

You have to access array items (in its parsed version) by starting with an array index, for example superHeroes[0].powers[0].
The JSON can also contain a single primitive. For example, 29, "Dan Jukes", or true are all valid JSON.
JSON syntax restrictions
As mentioned earlier, any JSON is a valid JavaScript literal (object, array, number, etc.). The converse is not true, though—not all JavaScript object literals are valid JSON.
JSON can only contain serializable data types. This means:
For primitives, JSON can contain string literals, number literals, true, false, and null. Notably, it cannot contain undefined, NaN, or Infinity.
For non-primitives, JSON can contain object literals and arrays, but not functions or any other object types, such as Date, Set, and Map. The objects and arrays inside JSON need to further contain valid JSON data types.
Strings must be enclosed in double quotes, not single quotes.
Numbers must be written in decimal notation.
Each property of an object must be in the form of "key": value. Property names must be string literals enclosed in double quotes. Special JavaScript syntax, such as methods, is not allowed because methods are functions, and functions are not valid JSON data types.
Objects and arrays cannot contain trailing commas.
Comments are not allowed in JSON.
Even a single misplaced comma or colon can make a JSON file invalid and cause it to fail. You should be careful to validate any data you are attempting to use (although computer-generated JSON is less likely to include errors, as long as the generator program is working correctly). You can validate JSON using an application like JSONLint or JSON-validate
Note: Now you've read through this section, you might also want to supplement your learning with Scrimba's JSON review MDN learning partner interactive tutorial, which provides some useful guidance around basic JSON syntax and how to view JSON request data inside your browser's devtools.
Working through a JSON example
So, let's work through an example to show how we could make use of some JSON formatted data on a website.
Getting started
To begin with, make local copies of our heroes.html and style.css files. The latter contains some simple CSS to style our page, while the former contains some very simple body HTML, plus a <script> element to contain the JavaScript code we will be writing in this exercise:
html
Copy to Clipboard
<header>
...
</header>

<section>
...
</section>

<script>
// JavaScript goes here
</script>

We have made our JSON data available on our GitHub, at https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json.
We are going to load the JSON into our script, and use some nifty DOM manipulation to display it, like this:

Top-level function
The top-level function looks like this:
js
Copy to Clipboard
async function populate() {
  const requestURL =
    "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json";
  const request = new Request(requestURL);

  const response = await fetch(request);
  const superHeroes = await response.json();

  populateHeader(superHeroes);
  populateHeroes(superHeroes);
}

To obtain the JSON, we use an API called Fetch. This API allows us to make network requests to retrieve resources from a server via JavaScript (e.g., images, text, JSON, even HTML snippets), meaning that we can update small sections of content without having to reload the entire page.
In our function, the first four lines use the Fetch API to fetch the JSON from the server:
we declare the requestURL variable to store the GitHub URL
we use the URL to initialize a new Request object.
we make the network request using the fetch() function, and this returns a Response object
we retrieve the response as JSON using the json() function of the Response object.
Note: The fetch() API is asynchronous. You can learn about asynchronous functions in detail in our Asynchronous JavaScript module, but for now, we'll just say that we need to add the keyword async before the name of the function that uses the fetch API, and add the keyword await before the calls to any asynchronous functions.
After all that, the superHeroes variable will contain the JavaScript object based on the JSON. We are then passing that object to two function calls — the first one fills the <header> with the correct data, while the second one creates an information card for each hero on the team, and inserts it into the <section>.
Populating the header
Now that we've retrieved the JSON data and converted it into a JavaScript object, let's make use of it by writing the two functions we referenced above. First of all, add the following function definition below the previous code:
js
Copy to Clipboard
function populateHeader(obj) {
  const header = document.querySelector("header");
  const myH1 = document.createElement("h1");
  myH1.textContent = obj.squadName;
  header.appendChild(myH1);

  const myPara = document.createElement("p");
  myPara.textContent = `Hometown: ${obj.homeTown} // Formed: ${obj.formed}`;
  header.appendChild(myPara);
}

Here we first create an h1 element with createElement(), set its textContent to equal the squadName property of the object, then append it to the header using appendChild(). We then do a very similar operation with a paragraph: create it, set its text content and append it to the header. The only difference is that its text is set to a template literal containing both the homeTown and formed properties of the object.
Creating the hero information cards
Next, add the following function at the bottom of the code, which creates and displays the superhero cards:
js
Copy to Clipboard
function populateHeroes(obj) {
  const section = document.querySelector("section");
  const heroes = obj.members;

  for (const hero of heroes) {
    const myArticle = document.createElement("article");
    const myH2 = document.createElement("h2");
    const myPara1 = document.createElement("p");
    const myPara2 = document.createElement("p");
    const myPara3 = document.createElement("p");
    const myList = document.createElement("ul");

    myH2.textContent = hero.name;
    myPara1.textContent = `Secret identity: ${hero.secretIdentity}`;
    myPara2.textContent = `Age: ${hero.age}`;
    myPara3.textContent = "Superpowers:";

    const superPowers = hero.powers;
    for (const power of superPowers) {
      const listItem = document.createElement("li");
      listItem.textContent = power;
      myList.appendChild(listItem);
    }

    myArticle.appendChild(myH2);
    myArticle.appendChild(myPara1);
    myArticle.appendChild(myPara2);
    myArticle.appendChild(myPara3);
    myArticle.appendChild(myList);

    section.appendChild(myArticle);
  }
}

To start with, we store the members property of the JavaScript object in a new variable. This array contains multiple objects that contain the information for each hero.
Next, we use a for...of loop to iterate through each object in the array. For each one, we:
Create several new elements: an <article>, an <h2>, three <p>s, and a <ul>.
Set the <h2> to contain the current hero's name.
Fill the three paragraphs with their secretIdentity, age, and a line saying "Superpowers:" to introduce the information in the list.
Store the powers property in another new constant called superPowers — this contains an array that lists the current hero's superpowers.
Use another for...of loop to loop through the current hero's superpowers — for each one we create an <li> element, put the superpower inside it, then put the listItem inside the <ul> element (myList) using appendChild().
The very last thing we do is to append the <h2>, <p>s, and <ul> inside the <article> (myArticle), then append the <article> inside the <section>. The order in which things are appended is important, as this is the order they will be displayed inside the HTML.
Note: If you are having trouble getting the example to work, try referring to our heroes-finished.html source code (see it running live also.)
Note: If you are having trouble following the dot/bracket notation we are using to access the JavaScript object, it can help to have the superheroes.json file open in another tab or your text editor, and refer to it as you look at our JavaScript. You should also refer back to our JavaScript object basics article for more information on dot and bracket notation.
Calling the top-level function
Finally, we need to call our top-level populate() function:
js
Copy to Clipboard
populate();

Converting between objects and text
The above example was simple in terms of accessing the JavaScript object, because we converted the network response directly into a JavaScript object using response.json().
But sometimes we aren't so lucky — sometimes we receive a raw JSON string, and we need to convert it to an object ourselves. And when we want to send a JavaScript object across the network, we need to convert it to JSON (a string) before sending it. Luckily, these two problems are so common in web development that a built-in JSON object is available in browsers, which contains the following two methods:
parse(): Accepts a JSON string as a parameter, and returns the corresponding JavaScript object.
stringify(): Accepts an object as a parameter, and returns the equivalent JSON string.
You can see the first one in action in our heroes-finished-json-parse.html example (see the source code) — this does exactly the same thing as the example we built up earlier, except that:
we retrieve the response as text rather than JSON, by calling the text() method of the response
we then use parse() to convert the text to a JavaScript object.
The key snippet of code is here:
js
Copy to Clipboard
async function populate() {
  const requestURL =
    "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json";
  const request = new Request(requestURL);

  const response = await fetch(request);
  const superHeroesText = await response.text();

  const superHeroes = JSON.parse(superHeroesText);
  populateHeader(superHeroes);
  populateHeroes(superHeroes);
}

As you might guess, stringify() works the opposite way. Try entering the following lines into your browser's JavaScript console one by one to see it in action:
js
Copy to Clipboard
let myObj = { name: "Chris", age: 38 };
myObj;
let myString = JSON.stringify(myObj);
myString;

Here we're creating a JavaScript object, then checking what it contains, then converting it to a JSON string using stringify() — saving the return value in a new variable — then checking it again.
Test your skills!
You've reached the end of this article, but can you remember the most important information? You can find some further tests to verify that you've retained this information before you move on — see Test your skills: JSON.
Summary
In this lesson, we've introduced you to using JSON in your programs, including how to create and parse JSON, and how to access data locked inside it. In the next article, we'll look at practical techniques for debugging JavaScript and handling errors.
See also
JSON reference
Fetch API overview
Using Fetch
HTTP request methods









JavaScript debugging and error handling
Previous


Overview: Dynamic scripting with JavaScript


Next


In this lesson, we will return to the subject of debugging JavaScript (which we first looked at in What went wrong?). Here we will delve deeper into techniques for tracking down errors, but also look at how to code defensively and handle errors in your code, avoiding problems in the first place.
Prerequisites:
An understanding of HTML and the fundamentals of CSS, familiarity with JavaScript basics as covered in previous lessons.
Learning outcomes:
Using browser developer tools to inspect the JavaScript running on your page and see what errors it is generating.
Using console.log() and console.error() for debugging.
Advanced JavaScript debugging with browser devtools.
Error handling with conditionals, try...catch, and throw.

Recap on types of JavaScript error
Earlier in the module, in What went wrong?, we looked broadly at the kinds of error that can occur in JavaScript programs, and said that they can be roughly broken down into two types — syntax errors and logic errors. We also helped you to make sense of some common types of JavaScript error message, and showed you how to do some simple debugging using console.log() statements.
In this article, we will go a bit deeper into the tools you have available for tracking down errors, and also look at ways to prevent errors in the first place.
Linting your code
You should make sure your code is valid first before trying to track down specific errors. Make use of the W3C's Markup validation service, CSS validation service, and a JavaScript linter such as ESLint to make sure your code is valid. This will likely shake out a bunch of errors, allowing you to concentrate on the errors that remain.
Code editor plugins
It is not very convenient to have to copy and paste your code over to a web page to check its validity over and over again. We'd recommend installing a linter plugin on your code editor, so that you can get errors reported to you are you write your code. Try searching for ESLint in your code editor's plugins or extensions list, and installing it.
Common JavaScript problems
There are a number of common JavaScript problems that you will want to be mindful of, such as:
Basic syntax and logic problems (again, check out Troubleshooting JavaScript).
Making sure variables, etc. are defined in the correct scope, and you are not running into conflicts between items declared in different places (see Function scope and conflicts).
Confusion about this, in terms of what scope it applies to, and therefore if its value is what you intended. You can read What is "this"? for a light introduction; you should also study examples like this one, which shows a typical pattern of saving a this scope to a separate variable, then using that variable in nested functions so you can be sure you are applying functionality to the correct this scope.
Incorrectly using functions inside loops that iterate with a global variable (more generally "getting the scope wrong").
For example, in bad-for-loop.html (see source code), we loop through 10 iterations using a variable defined with var, each time creating a paragraph and adding an onclick event handler to it. When clicked, we want each one to display an alert message containing its number (the value of i at the time it was created). Instead they all report i as 11 — because the for loop does all its iterating before nested functions are invoked.
The easiest solution is to declare the iteration variable with let instead of var—the value of i associated with the function is then unique to each iteration. See good-for-loop.html (see the source code also) for a version that works.
Making sure asynchronous operations have completed before trying to use the values they return. This usually means understanding how to use promises: using await appropriately or running the code to handle the result of an asynchronous call in the promise's then() handler. See How to use promises for an introduction to this topic.
Note: Buggy JavaScript Code: The 10 Most Common Mistakes JavaScript Developers Make has some nice discussions of these common mistakes and more.
The Browser JavaScript console
Browser developer tools have many useful features for helping to debug JavaScript. For a start, the JavaScript console will report errors in your code.
Make a local copy of our fetch-broken example (see the source code also).
If you look at the console, you'll see an error message. The exact wording is browser-dependent, but it will be something like: "Uncaught TypeError: heroes is not iterable", and the referenced line number is 25. If we look at the source code, the relevant code section is this:
js
Copy to Clipboard
function showHeroes(jsonObj) {
  const heroes = jsonObj["members"];

  for (const hero of heroes) {
    // …
  }
}

So the code falls over as soon as we try to use jsonObj (which as you might expect, is supposed to be a JSON object). This is supposed to be fetched from an external .json file using the following fetch() call:
js
Copy to Clipboard
const requestURL =
  "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json";

const response = fetch(requestURL);
populateHeader(response);
showHeroes(response);

But this fails.
The Console API
You may already know what is wrong with this code, but let's explore it some more to show how you could investigate this. We'll start with the Console API, which allows JavaScript code to interact with the browser's JavaScript console. It has a number of features available; you've already encountered console.log(), which prints a custom message to the console.
Try adding a console.log() call to log the return value of fetch(), like this:
js
Copy to Clipboard
const requestURL =
  "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json";

const response = fetch(requestURL);
console.log(`Response value: ${response}`);
populateHeader(response);
showHeroes(response);

Refresh the page in the browser. This time, before the error message, you'll see a new message logged to the console:
Response value: [object Promise]

The console.log() output shows that the return value of fetch() is not the JSON data, it's a Promise. The fetch() function is asynchronous: it returns a Promise that is fulfilled only when the actual response has been received from the network. Before we can use the response, we have to wait for the Promise to be fulfilled.
console.error() and call stacks
As a brief digression, lets try using a different console method to report the error — console.error(). In your code, replace
js
Copy to Clipboard
console.log(`Response value: ${response}`);

with
js
Copy to Clipboard
console.error(`Response value: ${response}`);

Save your code and refresh the browser and you'll now see the message reported as an error, with the same color and icon as the uncaught error below it. In addition, there will now be a expand/collapse arrow next to the message. If you press this, you'll see a single line telling you the line in the JavaScript file the error originated from. In fact, the uncaught error line also has this, but it has two lines:
showHeroes http://localhost:7800/js-debug-test/index.js:25
<anonymous> http://localhost:7800/js-debug-test/index.js:10

This means that the error is coming from the showHeroes() function, line 25, as we noted earlier. If you look at your code, you'll see that the anonymous call on line 10 is the line that is calling showHeroes(). These lines are referred to as a call stack, and can be really useful when trying to track down the source of an error involving lots of different locations in your code.
The console.error() call isn't all that useful in this case, but it can be useful for generating a call stack if one is not already available.
Fixing the error
Anyway, let's get back to trying to fix our error. We can access the response from the fulfilled Promise by chaining the then() method onto the end of the fetch() call. We can then pass the resulting response value into the functions that accept it, like this:
js
Copy to Clipboard
fetch(requestURL).then((response) => {
  populateHeader(response);
  showHeroes(response);
});

Save and refresh, and see if your code is working. Spoiler alert — the above change has not fixed the problem. Unfortunately, we still have the same error!
Note: To summarize, any time something is not working and a value does not appear to be what it is meant to be at some point in your code, you can use console.log(), console.error(), or another similar function to print out the value and see what is happening.
Using the JavaScript debugger
Let's investigate this problem further using a more sophisticated feature of browser developer tools: the JavaScript debugger as it is called in Firefox.
Note: Similar tools are available in other browsers; the Sources tab in Chrome, Debugger in Safari (see Safari Web Development Tools), etc.
In Firefox, the Debugger tab looks like this:

On the left, you can select the script you want to debug (in this case we have only one).
The center panel shows the code in the selected script.
The right-hand panel shows useful details pertaining to the current environment — Breakpoints, Callstack and currently active Scopes.
The main feature of such tools is the ability to add breakpoints to code — these are points where the execution of the code stops, and at that point you can examine the environment in its current state and see what is going on.
Let's explore using breakpoints:
The error is being thrown at the same line as before — for (const hero of heroes) { — line 26 in the screenshot below. Click on this line in the center panel to add a breakpoint to it (you'll see a blue arrow appear over the top of it).
Now refresh the page (Cmd/Ctrl + R) — the browser will pause execution of the code on that line. At this point, the right-hand side will update to show the following:

Under Breakpoints, you'll see the details of the breakpoint you have set.
Under Call Stack, you'll see a few entries — this is basically the same as the callstack we looked at earlier in the console.error() section. Call Stack shows a list of the functions that were invoked to cause the current function to be invoked. At the top, we have showHeroes(), the function we are currently in, and second we have onload, which stores the event handler function containing the call to showHeroes().
Under Scopes, you'll see the currently active scope for the function we are looking at. We only have three — showHeroes, block, and Window (the global scope). Each scope can be expanded to show the values of variables inside the scope when execution of the code was stopped.
We can find out some very useful information in here:
Expand the showHeroes scope — you can see from this that the heroes variable is undefined, indicating that accessing the members property of jsonObj (first line of the function) didn't work.
You can also see that the jsonObj variable is storing a Response object, not a JSON object.
The argument to showHeroes() is the value the fetch() promise was fulfilled with. So this promise is not in the JSON format: it is a Response object. There's an extra step needed to retrieve the content of the response as a JSON object.
We'd like you to try fixing this problem yourself. To get you started, see the documentation for the Response object. If you get stuck, you can find the fixed source code at https://github.com/mdn/learning-area/tree/main/tools-testing/cross-browser-testing/javascript/fetch-fixed.
Note: The debugger tab has many other useful features that we've not discussed here, for example conditional breakpoints and watch expressions. For a lot more information, see the Debugger page.
Handling JavaScript errors in your code
HTML and CSS are permissive — errors and unrecognized features can often be handled due to the nature of the languages. For example, CSS will ignore unrecognized properties, and the rest of the code will often just work. JavaScript is not as permissive as HTML and CSS however — if the JavaScript engine encounters mistakes or unrecognized syntax, it will often throw errors.
Let's explore a common strategy for handling JavaScript errors in your code. The following sections are designed to be followed by making a copy of the below template file as handling-errors.html on your local machine, adding the code snippets in between the opening and closing <script> and </script> tags, then opening the file in a browser and looking at the output in the devtools JavaScript console.
html
Copy to Clipboard
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Handling JS errors</title>
  </head>
  <body>
    <script>
      // Code goes below this line
    </script>
  </body>
</html>

Conditionals
A common use of JavaScript conditionals is to handle errors. Conditionals allow you to run different code depending on the value of a variable. Often you will want to use this defensively, to avoid throwing an error if the value does not exist or is of the wrong type, or to capture an error if the value would cause an incorrect result to be returned, which could cause problems later on.
Let's look at an example. Say we have a function that takes as an argument equal to the user's height in inches and returns their height in meters, to 2 decimal places. This could look like so:
js
Copy to Clipboard
function inchesToMeters(num) {
  const mVal = (num * 2.54) / 100;
  const m2dp = mVal.toFixed(2);
  return m2dp;
}

In your example file's <script> element, declare a const called height and assign it a value of 70:
js
Copy to Clipboard
const height = 70;


Copy the above function below the previous line.
Call the function, passing it the height constant as its argument, and log the return value to the console:
js
Copy to Clipboard
console.log(inchesToMeters(height));


Load the example in a browser and look at the devtools JavaScript console. You should see a value of 1.78 logged to it.
So this works fine in isolation. But what happens if the provided data is missing or not correct? Try out these scenarios:
If you change the height value to "70" (that is, 70 expressed as a string), the example should ... still work fine. This is because the calculation on the first line of the string coerces the value into a number data type. This is OK in a simple case like this, but in more complex code the wrong data can lead to all kind of bugs, some of them subtle and hard to detect!
If you change height to a value that can't be coerced to a number, like "70 inches" or ["Bob", 70], or NaN, the example should return the result as NaN. This could cause all kind of problems, for example if you want to include the user's height somewhere in the website user interface.
If you remove the height value altogether (comment it out by adding // at the start of the line), the console will show an error along the lines of "Uncaught ReferenceError: height is not defined", the likes of which could bring your application grinding to a halt.
Obviously, none of these outcomes are great. How do we defend against bad data?
Let's add a conditional inside our function to test whether the data is good before we try to do the calculation. Try replacing your current function with the following:
js
Copy to Clipboard
function inchesToMeters(num) {
  if (typeof num !== "number" || Number.isNaN(num)) {
    console.log("A number was not provided. Please correct the input.");
    return undefined;
  }
  const mVal = (num * 2.54) / 100;
  const m2dp = mVal.toFixed(2);
  return m2dp;
}


Now if you try the first two scenarios again, you'll see our slightly more useful message returned, to give you an idea of what needs to be done to fix the problem. You could put anything in there that you like, including trying to run code to correct the value of num, but this is not advised — this function has one simple purpose, and you should handle correcting the value somewhere else in the system.
Note: In the if() statement, we first test whether the data type of num is "number" using the typeof operator, but we also test whether Number.isNaN(num) returns false. We have to do this to defend against the specific case of num being set to NaN, because typeof NaN still returns "number"!
However, if you try the third scenario again, you will still get the "Uncaught ReferenceError: height is not defined" error thrown at you. You can't fix the fact that a value is not available from inside a function that is trying to use the value.
How do we handle this? Well, it's probably better to get our function to return a custom error when it doesn't receive the correct data. We'll look at how to do that first, then we'll handle all the errors together.
Throwing custom errors
You can throw a custom error at any point in your code using the throw statement, coupled with the Error() constructor. Let's see this in action.
In your function, replace the console.log() line inside the else block of your function with the following line:
js
Copy to Clipboard
throw new Error("A number was not provided. Please correct the input.");


Run your example again, but make sure num is set to a bad (that is, non-number) value. This time, you should see your custom error thrown, along with a useful call stack to help you locate the source of the error (although note that the message still tells us that the error is "uncaught", or "unhandled"). OK, so errors are annoying, but this is way more useful than running the function successfully and returning a non-number value that could cause problems later on.
So, how do we handle all those errors then?
try...catch
The try...catch statement is specially designed to handle errors. It has the following structure:
js
Copy to Clipboard
try {
  // Run some code
} catch (error) {
  // Handle any errors
}

Inside the try block, you try running some code. If this code runs without an error being thrown, all is well, and the catch block is ignored. However, if an error is thrown the catch block is run, which provides access to the Error object representing the error, and allows you to run code to handle it.
Let's use try...catch in our code.
Replace the console.log() line that calls the inchesToMeters() function at the end of your script with the following block. We are now running our console.log() line inside a try block, and handling any errors that it returns inside a corresponding catch block.
js
Copy to Clipboard
try {
  console.log(inchesToMeters(height));
} catch (error) {
  console.error(error);
  console.log("Insert code to handle the error");
}


Save and refresh, and you should now see two things:
The error message and call stack as before, but this time, without a label of "uncaught", or "unhandled".
The logged message "Insert code to handle the error".
Now try updating num to a good (number) value, and you'll see the result of the calculation logged, with no error message.
This is significant — any thrown errors are no longer unhandled, so they won't bring the application crashing to a halt. You can run whatever code you like to handle the error. Above we are just logging a message, but for example you could call whatever function was run earlier to ask the user to enter their height, this time asking them to correct the input error. You could even use an if...else statement to run different error handling code depending on what type of error is returned.
Feature detection
Feature detection is useful when you are planning to use new JavaScript features that might not be supported in all browsers. Test for the feature, and then conditionally run code to provide an acceptable experience both in browsers that do and don't support the feature. As a quick example, the Geolocation API (which exposes available location data for the device the web browser is running on) has a main entry point for its use — a geolocation property available on the global Navigator object. Therefore, you can detect whether the browser supports geolocation or not by using a similar if() structure to what we saw earlier:
js
Copy to Clipboard
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    // show the location on a map, perhaps using the Google Maps API
  });
} else {
  // Give the user a choice of static maps instead
}

You can find some more feature detection examples in Alternatives to UA sniffing.
Finding help
There are many other issues you'll encounter with JavaScript (and HTML and CSS!), making knowledge of how to find answers online invaluable.
Among the best sources of support information are MDN (that's where you are now!), stackoverflow.com, and caniuse.com.
To use the Mozilla Developer Network (MDN), most people do a search engine search of the technology they are trying to find information on, plus the term "mdn", for example, "mdn HTML video".
caniuse.com provides support information, along with a few useful external resource links. For example, see https://caniuse.com/#search=video (you just have to enter the feature you are searching for into the text box).
stackoverflow.com (SO) is a forum site where you can ask questions and have fellow developers share their solutions, look up previous posts, and help other developers. You are advised to look and see if there is an answer to your question already, before posting a new question. For example, we searched for "disabling autofocus on HTML dialog" on SO, and very quickly came up with Disable showModal auto-focusing using HTML attributes.
Aside from that, try searching your favorite search engine for an answer to your problem. It is often useful to search for specific error messages if you have them — other developers will be likely to have had the same problems as you.
Summary
So that's JavaScript debugging and error handling. Simple huh? Maybe not so simple, but this article should at least give you a start, and some ideas on how to tackle the JavaScript-related problems you will come across.
That's it for the Dynamic scripting with JavaScript module; congratulations on reaching the end! In the next module we'll help you explore JavaScript frameworks and libraries.
Test your skills: JavaScript
This page lists JavaScript tests you can try so you can verify if you've understood the content in this module.
Test your JavaScript skills by topic
Test your skills: Arrays
The aim of this skill test is to help you assess whether you've understood our Arrays article.
Test your skills: Conditionals
The aim of this skill test is to help you assess whether you've understood our Making decisions in your code — conditionals article.
Test your skills: Events
The aim of this skill test is to help you assess whether you've understood our Introduction to events article.
Test your skills: Functions
The aim of this skill test is to help you assess whether you've understood our Functions — reusable blocks of code, Build your own function, and Function return values articles.
Test your skills: JSON
The aim of this skill test is to help you assess whether you've understood our Working with JSON article.
Test your skills: Loops
The aim of this skill test is to help you assess whether you've understood our Looping code article.
Test your skills: Math
The aim of the tests on this page is to help you assess whether you've understood the Basic math in JavaScript — numbers and operators article.
Test your skills: Object basics
The aim of this skill test is to help you assess whether you've understood our JavaScript object basics article.
Test your skills: Strings
The aim of this skill test is to help you assess whether you've understood our Handling text — strings in JavaScript and Useful string methods articles.
Test your skills: Variables
The aim of this skill test is to help you assess whether you've understood our Storing the information you need — Variables article.
See also
Dynamic scripting with JavaScript
JavaScript frameworks and libraries
Overview: Core learning modules


Next


JavaScript frameworks are an essential part of modern front-end web development, providing developers with tried and tested tools for building scalable, interactive web applications. Many modern companies use frameworks as a standard part of their tooling, so many front-end development jobs now require framework experience. In this set of articles, we are aiming to give you a comfortable starting point to help you begin learning frameworks.
As an aspiring front-end developer, it can be hard to work out where to begin when learning frameworks — there are so many frameworks to choose from, new ones appear all the time, they mostly work in a similar way but do some things differently, and there are some specific things to be careful about when using frameworks.
We are not aiming to exhaustively teach you everything you need to know about React/ReactDOM, or Vue, or some other specific framework; the framework teams' own docs (and other resources) do that job already. Instead, we want to back up and first answer more fundamental questions such as:
Why should I use a framework? What problems do they solve for me?
What questions should I ask when trying to choose a framework? Do I even need to use a framework?
What features do frameworks have? How do they work in general, and how do frameworks' implementations of these features differ?
How do they relate to "vanilla" JavaScript or HTML?
After that, we'll provide some tutorials covering the essentials React, a popular framework choice, to provide you with enough context and familiarity to start going into greater depth yourself. We want you to go forward and learn about frameworks in a pragmatic way that doesn't forget about web platform fundamental best practices such as accessibility.
We also provide some tutorials covering the basics of other framework choices, for those who want to make a different choice to React.
Note: Scrimba's Libraries/Frameworks MDN learning partner interactive tutorial provides a useful summary of frameworks versus libraries, a brief history of libraries and frameworks on the web, and some background information specifically on React.
Prerequisites
You should really learn the basics of the core web languages first before attempting to move on to learning client-side frameworks — HTML, CSS, and especially JavaScript.
Your code will be richer and more professional as a result, and you'll be able to troubleshoot problems with more confidence if you understand the fundamental web platform features that the frameworks are building on top of.
Introductory tutorials
Introduction to client-side frameworks
We begin our look at frameworks with a general overview of the area, looking at a brief history of JavaScript and frameworks, why frameworks exist and what they give us, how to start thinking about choosing a framework to learn, and what alternatives there are to client-side frameworks.
Framework main features
Each major JavaScript framework has a different approach to updating the DOM, handling browser events, and providing an enjoyable developer experience. This article will explore the main features of "the big 4" frameworks, looking at how frameworks tend to work from a high level and the differences between them.
React tutorials
Note: React tutorials last tested in January 2023, with React/ReactDOM 18.2.0 and create-react-app 5.0.1.
If you need to check your code against our version, you can find a finished version of the sample React app code in our todo-react repository. For a running live version, see https://mdn.github.io/todo-react/.
Getting started with React
In this article we will say hello to React. We'll discover a little bit of detail about its background and use cases, set up a basic React toolchain on our local computer, and create and play with a simple starter app, learning a bit about how React works in the process.
Beginning our React ToDo app
Let's say that we've been tasked with creating a proof-of-concept in React – an app that allows users to add, edit, and delete tasks they want to work on, and also mark tasks as complete without deleting them. This article will walk you through putting the basic App component structure and styling in place, ready for individual component definition and interactivity, which we'll add later.
Componentizing our React app
At this point, our app is a monolith. Before we can make it do things, we need to break it apart into manageable, descriptive components. React doesn't have any hard rules for what is and isn't a component – that's up to you! In this article, we will show you a sensible way to break our app up into components.
React interactivity: Events and state
With our component plan worked out, it's now time to start updating our app from a completely static UI to one that actually allows us to interact and change things. In this article we'll do this, digging into events and state along the way.
React interactivity: Editing, filtering, conditional rendering
As we near the end of our React journey (for now at least), we'll add the finishing touches to the main areas of functionality in our Todo list app. This includes allowing you to edit existing tasks and filtering the list of tasks between all, completed, and incomplete tasks. We'll look at conditional UI rendering along the way.
Accessibility in React
In our final tutorial article, we'll focus on (pun intended) accessibility, including focus management in React, which can improve usability and reduce confusion for both keyboard-only and screen reader users.
React resources
Our final article provides you with a list of React resources that you can use to go further in your learning.
Other framework choices
Ember tutorials
Note: Ember tutorials last tested in May 2020, with Ember/Ember CLI version 3.18.0.
If you need to check your code against our version, you can find a finished version of the sample Ember app code in the ember-todomvc-tutorial repository. For a running live version, see https://nullvoxpopuli.github.io/ember-todomvc-tutorial/ (this also includes a few additional features not covered in the tutorial).
Getting started with Ember
In our first Ember article we will look at how Ember works and what it's useful for, install the Ember toolchain locally, create a sample app, and then do some initial setup to get it ready for development.
Ember app structure and componentization
In this article we'll get right on with planning out the structure of our TodoMVC Ember app, adding in the HTML for it, and then breaking that HTML structure into components.
Ember interactivity: Events, classes and state
At this point we'll start adding some interactivity to our app, providing the ability to add and display new todo items. Along the way, we'll look at using events in Ember, creating component classes to contain JavaScript code to control interactive features, and setting up a service to keep track of the data state of our app.
Ember Interactivity: Footer functionality, conditional rendering
Now it's time to start tackling the footer functionality in our app. Here we'll get the todo counter to update to show the correct number of todos still to complete, and correctly apply styling to completed todos (i.e., where the checkbox has been checked). We'll also wire up our "Clear completed" button. Along the way, we'll learn about using conditional rendering in our templates.
Routing in Ember
In this article we learn about routing or URL-based filtering as it is sometimes referred to. We'll use it to provide a unique URL for each of the three todo views — "All", "Active", and "Completed".
Ember resources and troubleshooting
Our final Ember article provides you with a list of resources that you can use to go further in your learning, plus some useful troubleshooting and other information.
Vue tutorials
Note: Vue tutorial last tested in January 2023, with Vue 3.2.45.
If you need to check your code against our version, you can find a finished version of the sample Vue app code in our todo-vue repository. For a running live version, see https://mdn.github.io/todo-vue/.
Getting started with Vue
Now let's introduce Vue, the third of our frameworks. In this article, we'll look at a little bit of Vue background, learn how to install it and create a new project, study the high-level structure of the whole project and an individual component, see how to run the project locally, and get it prepared to start building our example.
Creating our first Vue component
Now it's time to dive deeper into Vue, and create our own custom component — we'll start by creating a component to represent each item in the todo list. Along the way, we'll learn about a few important concepts such as calling components inside other components, passing data to them via props and saving data state.
Rendering a list of Vue components
At this point we've got a fully working component; we're now ready to add multiple ToDoItem components to our app. In this article we'll look at adding a set of todo item data to our App.vue component, which we'll then loop through and display inside ToDoItem components using the v-for directive.
Adding a new todo form: Vue events, methods, and models
We now have sample data in place and a loop that takes each bit of data and renders it inside a ToDoItem in our app. What we really need next is the ability to allow our users to enter their own todo items into the app, and for that, we'll need a text <input>, an event to fire when the data is submitted, a method to fire upon submission to add the data and rerender the list, and a model to control the data. This is what we'll cover in this article.
Styling Vue components with CSS
The time has finally come to make our app look a bit nicer. In this article, we'll explore the different ways of styling Vue components with CSS.
Using Vue computed properties
In this article we'll add a counter that displays the number of completed todo items, using a feature of Vue called computed properties. These work similarly to methods but only re-run when one of their dependencies changes.
Vue conditional rendering: editing existing todos
Now it is time to add one of the major parts of functionality that we're still missing — the ability to edit existing todo items. To do this, we will take advantage of Vue's conditional rendering capabilities — namely v-if and v-else — to allow us to toggle between the existing todo item view and an edit view where you can update todo item labels. We'll also look at adding functionality to delete todo items.
Vue refs and lifecycle methods for focus management
We are nearly done with Vue. The last bit of functionality to look at is focus management, or put another way, how we can improve our app's keyboard accessibility. We'll look at using Vue refs to handle this — an advanced feature that allows you to have direct access to the underlying DOM nodes below the virtual DOM, or direct access from one component to the internal DOM structure of a child component.
Vue resources
Now we'll round off our study of Vue by giving you a list of resources that you can use to go further in your learning, plus some other useful tips.
Svelte tutorials
Note: Svelte tutorials last tested in August 2020, with Svelte 3.24.1.
If you need to check your code against our version, you can find a finished version of the sample Svelte app code as it should be after each article, in our mdn-svelte-tutorial repo. For a running live version, see our Svelte REPL at https://svelte.dev/repl/378dd79e0dfe4486a8f10823f3813190?version=3.23.2.
Getting started with Svelte
In this article we'll provide a quick introduction to the Svelte framework. We will see how Svelte works and what sets it apart from the rest of the frameworks and tools we've seen so far. Then we will learn how to set up our development environment, create a sample app, understand the structure of the project, and see how to run it locally and build it for production.
Starting our Svelte Todo list app
Now that we have a basic understanding of how things work in Svelte, we can start building our example app: a todo list. In this article we will first have a look at the desired functionality of our app, then we'll create a Todos.svelte component and put static markup and styles in place, leaving everything ready to start developing our To-Do list app features, which we'll go on to in subsequent articles.
Dynamic behavior in Svelte: working with variables and props
Now that we have our markup and styles ready we can start developing the required features for our Svelte To-Do list app. In this article we'll be using variables and props to make our app dynamic, allowing us to add and delete todos, mark them as complete, and filter them by status.
Componentizing our Svelte app
The central objective of this article is to look at how to break our app into manageable components and share information between them. We'll componentize our app, then add more functionality to allow users to update existing components.
Advanced Svelte: Reactivity, lifecycle, accessibility
In this article we will add the app's final features and further componentize our app. We will learn how to deal with reactivity issues related to updating objects and arrays. To avoid common pitfalls, we'll have to dig a little deeper into Svelte's reactivity system. We'll also look at solving some accessibility focus issues, and more besides.
Working with Svelte stores
In this article we will show another way to handle state management in Svelte — Stores. Stores are global data repositories that hold values. Components can subscribe to stores and receive notifications when their values change.
TypeScript support in Svelte
We will now learn how to use TypeScript in Svelte applications. First we'll learn what TypeScript is and what benefits it can bring us. Then we'll see how to configure our project to work with TypeScript files. Finally we will go over our app and see what modifications we have to make to fully take advantage of TypeScript features.
Deployment and next steps
In this final article we will look at how to deploy your application and get it online, and also share some of the resources that you should go on to, to continue your Svelte learning journey.
Angular tutorials
Note: Angular tutorials last tested in April 2021, with Angular CLI (NG) 11.2.5.
Getting started with Angular
In this article we look at what Angular has to offer, install the prerequisites and set up a sample app, and look at Angular's basic architecture.
Beginning our Angular todo list app
At this point, we are ready to start creating our to-do list application using Angular. The finished application will display a list of to-do items and includes editing, deleting, and adding features. In this article you will get to know your application structure, and work up to displaying a basic list of to-do items.
Styling our Angular app
Now that we've got our basic application structure set up and started displaying something useful, let's switch gears and spend an article looking at how Angular handles styling of applications.
Creating an item component
Components provide a way for you to organize your application. This article walks you through creating a component to handle the individual items in the list, and adding check, edit, and delete functionality. The Angular event model is covered here.
Filtering our to-do items
Now let's move on to adding functionality to allow users to filter their to-do items, so they can view active, completed, or all items.
Building Angular applications and further resources
This final Angular article covers how to build an app ready for production, and provides further resources for you to continue your learning journey.
Which frameworks did we choose?
We cover five frameworks in our tutorials — Angular, Ember, React/ReactDOM, Svelte, and Vue:
They are popular choices that will be around for a while — like with any software tool, it is good to stick with actively-developed choices that are likely to not be discontinued next week, and which will be desirable additions to your skill set when looking for a job.
They have strong communities and good documentation. It is very important to be able to get help with learning a complex subject, especially when you are just starting out.
We don't have the resources to cover all modern frameworks. That list would be very difficult to keep up-to-date anyway, as new ones appear all the time.
As a beginner, trying to choose what to focus on out of the huge number of choices available is a very real problem. Keeping the list short is therefore helpful.
We want to say this upfront — we've not chosen the frameworks we are focusing on because we think they are the best, or because we endorse them in any way. We just think they score highly on the above criteria.
ntroduction to client-side frameworks
Overview: JavaScript frameworks and libraries


Next


We begin our look at frameworks with a general overview of the area, looking at a brief history of JavaScript and frameworks, why frameworks exist and what they give us, how to start thinking about choosing a framework to learn, and what alternatives there are to client-side frameworks.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages.
Learning outcomes:
What third-party code is and how client-side JavaScript frameworks came to exist.
What problems frameworks solve, what alternatives there are, and how to go about choosing one.
The difference between libraries and frameworks.
When frameworks should and shouldn't be used.

The emergence of libraries and frameworks
When JavaScript debuted in 1996, it added occasional interactivity and excitement to a web that was, up until then, composed of static documents. The web became not just a place to read things, but to do things. JavaScript's popularity steadily increased. Developers who worked with JavaScript wrote tools to solve the problems they faced, and packaged them into reusable packages called libraries, so they could share their solutions with others. This shared ecosystem of libraries helped shape the growth of the web, and eventually gave way to frameworks.
A framework is a library that offers opinions about how software gets built. These opinions allow for predictability and homogeneity in an application; predictability allows the software to scale to an enormous size and still be maintainable; predictability and maintainability are essential for the health and longevity of software. The advent of modern JavaScript frameworks has made it much easier to build highly dynamic, interactive applications.
JavaScript frameworks power much of the impressive software on the modern web – including many of the websites you likely use every day.
What frameworks are out there?
There are many frameworks out there, but currently the "big four" are considered to be the following.
Ember
Ember was initially released in December 2011 as a continuation of work that started in the SproutCore project. It is an older framework that has fewer users than more modern alternatives such as React and Vue, but it still enjoys a fair amount of popularity due to its stability, community support, and some clever coding principles.
Angular
Angular is an open-source web application framework led by the Angular Team at Google and by a community of individuals and corporations. It is a complete rewrite from the same team that built AngularJS. Angular was officially released on the 14th of September 2016.
Angular is a component-based framework which uses declarative HTML templates. At build time, transparently to developers, the framework's compiler translates the templates to optimized JavaScript instructions. Angular uses TypeScript, a superset of JavaScript that we'll look at in a little more detail in the next chapter.
Vue
After working on and learning from the original AngularJS project, Evan You released Vue in 2014. Vue is the youngest of the big four, but has enjoyed a recent uptick in popularity.
Vue, like AngularJS, extends HTML with some of its own code. Apart from that, it mainly relies on modern, standard JavaScript.
React
Facebook released React in 2013. By this point, it had already been using React to solve many of its problems internally. Technically, React itself is not a framework; it's a library for rendering UI components. React is used in combination with other libraries to make applications — React and React Native enable developers to make mobile applications; React and ReactDOM enable them to make web applications, etc.
Because React and ReactDOM are so often used together, React is colloquially understood as a JavaScript framework. As you read through this module, we will be working with that colloquial understanding.
React extends JavaScript with HTML-like syntax, known as JSX.
Why do frameworks exist?
We've discussed the environment that inspired the creation of frameworks, but not really why developers felt the need to make them. Exploring the why requires first examining the challenges of software development.
Consider a common kind of application: A to-do list creator, which we'll look at implementing using a variety of frameworks in future chapters. This application should allow users to do things like render a list of tasks, add a new task, and delete a task; and it must do this while reliably tracking and updating the data underlying the application. In software development, this underlying data is known as state.
Each of our goals is theoretically simple in isolation. We can iterate over the data to render it; we can add to an object to make a new task; we can use an identifier to find, edit, or delete a task. When we remember that the application has to let the user do all of these things through the browser, some cracks start to show. The real problem is this: every time we change our application's state, we need to update the UI to match.
We can examine the difficulty of this problem by looking at just one feature of our to-do list app: rendering a list of tasks.
The verbosity of DOM changes
Building HTML elements and rendering them in the browser at the appropriate time takes a surprising amount of code. Let's say that our state is a key-value store containing the taskName (controlled by the text input) and the list of tasks:
js
Copy to Clipboard
play
const state = {
  taskName: "",
  tasks: [
    {
      id: "todo-0",
      name: "Learn some frameworks!",
    },
  ],
};

How do we show one of those tasks to our users? We want to represent each task as a list item – an HTML <li> element inside of an unordered list element (a <ul>). How do we make it? That could look something like this:
js
Copy to Clipboard
play
function buildTodoItemEl(id, name) {
  const item = document.createElement("li");
  const span = document.createElement("span");

  span.textContent = name;

  item.id = id;
  item.appendChild(span);
  item.appendChild(buildDeleteButtonEl(id));

  return item;
}

Here, we use the document.createElement() method to make our <li>, and several more lines of code to create the properties and child elements it needs.
The previous snippet references another build function: buildDeleteButtonEl(). It follows a similar pattern to the one we used to build a list item element:
js
Copy to Clipboard
play
function buildDeleteButtonEl(id) {
  const button = document.createElement("button");
  button.setAttribute("type", "button");
  button.addEventListener("click", () => {
    state.tasks = state.tasks.filter((t) => t.id !== id);
    renderTodoList();
  });
  button.textContent = "Delete";

  return button;
}

The interesting part to note is that every time we update the state, we need to manually call renderTodoList so our state gets synced to the screen. The code that will render our items on the page might read something like this:
js
Copy to Clipboard
play
function renderTodoList() {
  const frag = document.createDocumentFragment();
  state.tasks.forEach((task) => {
    const item = buildTodoItemEl(task.id, task.name);
    frag.appendChild(item);
  });

  while (todoListEl.lastChild) {
    todoListEl.removeChild(todoListEl.lastChild);
  }
  todoListEl.appendChild(frag);
}

We've now got almost thirty lines of code dedicated just to the UI – just to render something in the DOM – and at no point do we add classes that we could use later to style our list-items!
If you are curious, we have a full running demo below. You can click the "Play" button to view the source code in the playground.
play
Working directly with the DOM, as in this example, requires understanding many things about how the DOM works: how to make elements; how to change their properties; how to put elements inside of each other; how to get them on the page. None of this code actually handles user interactions, or addresses adding or deleting a task. If we add those features, we have to remember to update our UI at the right time and in the right way.
JavaScript frameworks were created to make this kind of work a lot easier — they exist to provide a better developer experience. They don't bring brand-new powers to JavaScript; they give you easier access to JavaScript's powers so you can build for today's web.
Read more about the JavaScript features used in this section:
Array.forEach()
Document.createDocumentFragment()
Document.createElement()
Element.setAttribute()
Node.appendChild()
Node.removeChild()
Node.textContent
Another way to build UIs
Every JavaScript framework offers a way to write user interfaces more declaratively. That is, they allow you to write code that describes how your UI should look, and the framework makes it happen in the DOM behind the scenes.
The vanilla JavaScript approach to building out new DOM elements in repetition was difficult to understand at a glance. By contrast, the following block of code illustrates the way you might use Vue to describe our list of tasks:
html
Copy to Clipboard
<ul>
  <li v-for="task in tasks" v-bind:key="task.id">
    <span>{{task.name}}</span>
    <button type="button">Delete</button>
  </li>
</ul>

That's it. This snippet reduces almost thirty lines of code down to six lines. If the curly braces and v- attributes here are unfamiliar to you, that's okay; you'll learn about Vue-specific syntax later on in the module. The thing to take away here is that this code looks like the UI it represents, whereas the vanilla JavaScript code does not.
Thanks to Vue, we didn't have to write our own functions for building the UI; the framework will handle that for us in an optimized, efficient way. Our only role here was to describe to Vue what each item should look like. Developers who are familiar with Vue can quickly work out what is going on when they join our project. Vue is not alone in this: using a framework improves team as well as individual efficiency.
It's possible to do things similar to this in vanilla JavaScript. Template literal strings make it easy to write strings of HTML that represent what the final element would look like. That might be a useful idea for something as simple as our to-do list application, but it's not maintainable for large applications that manage thousands of records of data, and could render just as many unique elements in a user interface.
Other things frameworks give us
Let's look at some of the other advantages offered by frameworks. As we've alluded to before, the advantages of frameworks are achievable in vanilla JavaScript, but using a framework takes away all of the cognitive load of having to solve these problems yourself.
Tooling
Because each of the frameworks in this module have a large, active community, each framework's ecosystem provides tooling that improves the developer experience. These tools make it easy to add things like testing (to ensure that your application behaves as it should) or linting (to ensure that your code is error-free and stylistically consistent).
Note: If you want to find out more details about web tooling concepts, check out our Client-side tooling overview.
Compartmentalization
Most major frameworks encourage developers to abstract the different parts of their user interfaces into components — maintainable, reusable chunks of code that can communicate with one another. All the code related to a given component can live in one file (or a couple of specific files) so that you as a developer know exactly where to go to make changes to that component. In a vanilla JavaScript app, you'd have to create your own set of conventions to achieve this in an efficient, scalable way. Many JavaScript developers, if left to their own devices, could end up with all the code related to one part of the UI being spread out all over a file — or in another file altogether.
Routing
The most essential feature of the web is that it allows users to navigate from one page to another – it is, after all, a network of interlinked documents. When you follow a link on this very website, your browser communicates with a server and fetches new content to display for you. As it does so, the URL in your address bar changes. You can save this new URL and come back to the page later on, or share it with others so they can easily find the same page. Your browser remembers your navigation history and allows you to navigate back and forth, too. This is called server-side routing.
Modern web applications typically do not fetch and render new HTML files — they load a single HTML shell, and continually update the DOM inside it (referred to as single page apps, or SPAs) without navigating users to new addresses on the web. Each new pseudo-webpage is usually called a view, and by default, no routing is done.
When an SPA is complex enough, and renders enough unique views, it's important to bring routing functionality into your application. People are used to being able to link to specific pages in an application, travel forward and backward in their navigation history, etc., and their experience suffers when these standard web features are broken. When routing is handled by a client application in this fashion, it is aptly called client-side routing.
It's possible to make a router using the native capabilities of JavaScript and the browser, but popular, actively developed frameworks have companion libraries that make routing a more intuitive part of the development process.
Things to consider when using frameworks
Being an effective web developer means using the most appropriate tools for the job. JavaScript frameworks make front-end application development easy, but they are not a silver bullet that will solve all problems. This section talks about some of the things you should consider when using frameworks. Bear in mind that you might not need a framework at all — beware that you don't end up using a framework just for the sake of it.
Familiarity with the tool
Just like vanilla JavaScript, frameworks take time to learn and have their quirks. Before you decide to use a framework for a project, be sure you have time to learn enough of its features for it to be useful to you rather than it working against you, and be sure that your teammates are comfortable with it as well.
Overengineering
If your web development project is a personal portfolio with a few pages, and those pages have little or no interactive capability, a framework (and all of its JavaScript) may not be necessary at all. That said, frameworks are not monolithic, and some of them are better suited to small projects than others. In an article for Smashing Magazine, Sarah Drasner writes about how Vue can replace jQuery as a tool for making small portions of a webpage interactive.
Larger code base and abstraction
Frameworks allow you to write more declarative code – and sometimes less code overall – by dealing with the DOM interactions for you, behind the scenes. This abstraction is great for your experience as a developer, but it isn't free. In order to translate what you write into DOM changes, frameworks have to run their own code, which in turn makes your final piece of software larger and more computationally expensive to operate.
Some extra code is inevitable, and a framework that supports tree-shaking (removal of any code that isn't actually used in the app during the build process) will allow you to keep your applications small, but this is still a factor you need to keep in mind when considering your app's performance, especially on more network/storage-constrained devices, like mobile phones.
The abstraction of frameworks affects not only your JavaScript, but also your relationship with the very nature of the web. No matter how you build for the web, the end result, the layer that your users ultimately interact with, is HTML. Writing your whole application in JavaScript can make you lose sight of HTML and the purpose of its various tags, and lead you to produce an HTML document that is un-semantic and inaccessible. In fact, it's possible to write a fragile application that depends entirely on JavaScript and will not function without it.
Frameworks are not the source of our problems. With the wrong priorities, any application can be fragile, bloated, and inaccessible. Frameworks do, however, amplify our priorities as developers. If your priority is to make a complex web app, it's easy to do that. However, if your priorities don't carefully guard performance and accessibility, frameworks will amplify your fragility, your bloat, and your inaccessibility. Modern developer priorities, amplified by frameworks, have inverted the structure of the web in many places. Instead of a robust, content-first network of documents, the web now often puts JavaScript first and user experience last.
Accessibility on a framework-driven web
Let's build on what we said in the previous section, and talk a bit more about accessibility. Making user interfaces accessible always requires some thought and effort, and frameworks can complicate that process. You often have to employ advanced framework APIs to access native browser features like ARIA live regions or focus management.
In some cases, framework applications create accessibility barriers that do not exist for traditional websites. The biggest example of this is in client-side routing, as mentioned earlier.
With traditional (server-side) routing, navigating the web has predictable results. The browser knows to set focus to the top of the page and assistive technologies will announce the title of the page. These things happen every time you navigate to a new page.
With client-side routing, your browser is not loading new web pages, so it doesn't know that it should automatically adjust focus or announce a new page title. Framework authors have devoted immense time and labor to writing JavaScript that recreates these features, and even then, no framework has done so perfectly.
The upshot is that you should consider accessibility from the very start of every web project, but bear in mind that abstracted codebases that use frameworks are more likely to suffer from major accessibility issues if you don't.
How to choose a framework
Each of the frameworks discussed in this module takes different approaches to web application development. Each is regularly improving or changing, and each has its pros and cons. Choosing the right framework is a team- and project-dependent process, and you should do your own research to uncover what suits your needs. That said, we've identified a few questions you can ask in order to research your options more effectively:
What browsers does the framework support?
What domain-specific languages does the framework utilize?
Does the framework have a strong community and good docs (and other support) available?
The table in this section provides a glanceable summary of the current browser support offered by each framework, as well as the domain-specific languages with which it can be used.
Broadly, domain-specific languages (DSLs) are programming languages relevant in specific areas of software development. In the context of frameworks, DSLs are variations on JavaScript or HTML that make it easier to develop with that framework. Crucially, none of the frameworks require a developer to use a specific DSL, but they have almost all been designed with a specific DSL in mind. Choosing not to employ a framework's preferred DSL will mean you miss out on features that would otherwise improve your developer experience.
You should seriously consider the support matrix and DSLs of a framework when making a choice for any new project. Mismatched browser support can be a barrier to your users; mismatched DSL support can be a barrier to you and your teammates.
Framework
Browser support
Preferred DSL
Supported DSLs
Citation
Angular
Modern
TypeScript
HTML-based; TypeScript
official docs
React
Modern
JSX
JSX; TypeScript
official docs
Vue
Modern (IE9+ in Vue 2)
HTML-based
HTML-based, JSX, Pug
official docs
Ember
Modern (IE9+ in Ember version 2.18)
Handlebars
Handlebars, TypeScript
official docs

Note: DSLs we've described as "HTML-based" do not have official names. They are not really true DSLs, but they are non-standard HTML, so we believe they are worth highlighting.
Does the framework have a strong community?
This is perhaps the hardest metric to measure because community size does not correlate directly to easy-to-access numbers. You can check a project's number of GitHub stars or weekly npm downloads to get an idea of its popularity, but sometimes the best thing to do is search a few forums or talk to other developers. It is not just about the community's size, but also how welcoming and inclusive it is, and how good the available documentation is.
Opinions on the web
Don't just take our word on this matter — there are discussions all over the web. The Wikimedia Foundation recently chose to use Vue for its front-end, and posted a request for comments (RFC) on framework adoption. Eric Gardner, the author of the RFC, took time to outline the needs of the Wikimedia project and why certain frameworks were good choices for the team. This RFC serves as a great example of the kind of research you should do for yourself when planning to use a front-end framework.
The State of JavaScript survey is a helpful collection of feedback from JavaScript developers. It covers many topics related to JavaScript, including data about both the use of frameworks and developer sentiment toward them. Currently, there are several years of data available, allowing you to get a sense of a framework's popularity.
The Vue team has exhaustively compared Vue to other popular frameworks. There may be some bias in this comparison (which they note), but it's a valuable resource nonetheless.
Alternatives to client-side frameworks
If you're looking for tools to expedite the web development process, and you know your project isn't going to require intensive client-side JavaScript, you could reach for one of a handful of other solutions for building the web:
A content management system
Server-side rendering
A static site generator
Content management systems
Content-management systems (CMSes) are any tools that allow a user to create content for the web without directly writing code themselves. They're a good solution for large projects, especially projects that require input from content writers who have limited coding ability, or for programmers who want to save time. They do, however, require a significant amount of time to set up, and utilizing a CMS means that you surrender at least some measure of control over the final output of your website. For example: if your chosen CMS doesn't author accessible content by default, it's often difficult to improve this.
A few popular CMS systems include WordPress, Joomla, and Drupal.
Server-side rendering
Server-side rendering (SSR) is an application architecture in which it is the server's job to render a single-page application. This is the opposite of client-side rendering, which is the most common and most straightforward way to build a JavaScript application. Server-side rendering is easier on the client's device because you're only sending a rendered HTML file to them, but it can be difficult to set up compared to a client-side-rendered application.
All of the frameworks covered in this module support server-side rendering as well as client-side rendering. Check out Next.js for React, Nuxt for Vue (yes, it is confusing, and no, these projects are not related!), FastBoot for Ember, and Angular Universal for Angular.
Note: Some SSR solutions are written and maintained by the community, whereas some are "official" solutions provided by the framework's maintainer.
Static site generators
Static site generators are programs that dynamically generate all the webpages of a multi-page website — including any relevant CSS or JavaScript — so that they can be published in any number of places. The publishing host could be a GitHub pages branch, a Netlify instance, or any private server of your choosing, for example. There are a number of advantages of this approach, mostly around performance (your user's device isn't building the page with JavaScript; it's already complete) and security (static pages have fewer attack vectors). These sites can still utilize JavaScript where they need to, but they are not dependent upon it. Static site generators take time to learn, just like any other tool, which can be a barrier to your development process.
Static sites can have as few or as many unique pages as you want. Just as frameworks empower you to quickly write client-side JavaScript applications, static site generators allow you a way to quickly create HTML files you would otherwise have written individually. Like frameworks, static site generators allow developers to write components that define common pieces of your web pages, and to compose those components together to create a final page. In the context of static site generators, these components are called templates. Web pages built by static site generators can even be home to framework applications: if you want one specific page of your statically-generated website to boot up a React application when your user visits it for example, you can do that.
Static site generators have been around for quite a long time, and they are under constant optimization and innovation. A range of choices exist, including Astro, Eleventy, Hugo, Jekyll, and Gatsby, which build on various technology stacks and provide distinctive features. Other options, such as Docusaurus and VitePress, use client-side frameworks instead of templates, but generate similarly optimized static files.
If you'd like to learn more about static site generators on the whole, check out Tatiana Mac's Beginner's guide to Eleventy. In the first article of the series, they explain what a static site generator is, and how it relates to other means of publishing web content.
Summary
And that brings us to the end of our introduction to frameworks — we've not taught you any code yet, but hopefully we've given you a useful background on why you'd use frameworks in the first place and how to go about choosing one, and made you excited to learn more and get stuck in!
Our next article goes down to a lower level, looking at the specific kinds of features frameworks tend to offer, and why they work as they do.
Framework main features
Previous


Overview: JavaScript frameworks and libraries


Next


Each major JavaScript framework has a different approach to updating the DOM, handling browser events, and providing an enjoyable developer experience. This article will explore the main features of "the big 4" frameworks, looking at how frameworks tend to work from a high level, and the differences between them.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages.
Learning outcomes:
Understand the main features provided by JavaScript frameworks.

Domain-specific languages
Most frameworks allow you to use domain-specific languages (DSLs) in order to build your applications. In particular, React has popularized the use of JSX for writing its components, while Ember utilizes Handlebars. Unlike HTML, these languages know how to read data variables, and this data can be used to streamline the process of writing your UI.
Angular apps often make heavy use of TypeScript. TypeScript is not concerned with the writing of user interfaces, but it is a domain-specific language, and has significant differences to vanilla JavaScript.
DSLs can't be read by the browser directly; they must be transformed into JavaScript or HTML first. Framework tooling generally includes the required tools to handle this step, or can be adjusted to include this step. While it is possible to build framework apps without using these domain-specific languages, embracing them will streamline your development process and make it easier to find help from the communities around those frameworks.
JSX
JSX, which stands for JavaScript and XML, is an extension of JavaScript that brings HTML-like syntax to a JavaScript environment. It was invented by the React team for use in React applications, but can be used to develop other applications — like Vue apps, for instance.
The following shows a simple JSX example:
jsx
Copy to Clipboard
const subject = "World";
const header = (
  <header>
    <h1>Hello, {subject}!</h1>
  </header>
);

This expression represents an HTML <header> element with an <h1> element inside. The curly braces around {subject} tell the application to read the value of the subject constant and insert it into our <h1>.
When used with React, the JSX from the previous snippet would be compiled into this:
js
Copy to Clipboard
const subject = "World";
const header = React.createElement(
  "header",
  null,
  React.createElement("h1", null, "Hello, ", subject, "!"),
);

When ultimately rendered by the browser, the above snippet will produce HTML that looks like this:
html
Copy to Clipboard
<header>
  <h1>Hello, World!</h1>
</header>

Handlebars
The Handlebars templating language is not specific to Ember applications, but it is heavily utilized in Ember apps. Handlebars code resembles HTML, but it has the option of pulling data in from elsewhere. This data can be used to influence the HTML that an application ultimately builds.
Like JSX, Handlebars uses curly braces to inject the value of a variable. Handlebars uses a double-pair of curly braces, instead of a single pair.
Given this Handlebars template:
html
Copy to Clipboard
<header>
  <h1>Hello, {{subject}}!</h1>
</header>

And this data:
json
Copy to Clipboard
{
  "subject": "World"
}

Handlebars will build HTML like this:
html
Copy to Clipboard
<header>
  <h1>Hello, World!</h1>
</header>

TypeScript
TypeScript is a superset of JavaScript, meaning it extends JavaScript — all JavaScript code is valid TypeScript, but not the other way around. TypeScript is useful for the strictness it allows developers to enforce on their code. For instance, consider a function add(), which takes integers a and b and returns their sum.
In JavaScript, that function could be written like this:
js
Copy to Clipboard
function add(a, b) {
  return a + b;
}

This code might be trivial for someone accustomed to JavaScript, but it could still be clearer. JavaScript lets us use the + operator to concatenate strings together, so this function would technically still work if a and b were strings — it just might not give you the result you'd expect. What if we wanted to only allow numbers to be passed into this function? TypeScript makes that possible:
ts
Copy to Clipboard
function add(a: number, b: number) {
  return a + b;
}

The : number written after each parameter here tells TypeScript that both a and b must be numbers. If we were to use this function and pass '2' into it as an argument, TypeScript would raise an error during compilation, and we would be forced to fix our mistake. We could write our own JavaScript that raises these errors for us, but it would make our source code significantly more verbose. It probably makes more sense to let TypeScript handle such checks for us.
Writing components
As mentioned in the previous lesson, most frameworks have some kind of component model. React components can be written with JSX, Ember components with Handlebars, and Angular and Vue components with a templating syntax that lightly extends HTML.
Regardless of their opinions on how components should be written, each framework's components offer a way to describe the external properties they may need, the internal state that the component should manage, and the events a user can trigger on the component's markup.
The code snippets in the rest of this section will use React as an example, and are written with JSX.
Properties
Properties, or props, are external data that a component needs in order to render. Suppose you're building a website for an online magazine, and you need to be sure that each contributing writer gets credit for their work. You might create an AuthorCredit component to go with each article. This component needs to display a portrait of the author and a short byline about them. In order to know what image to render, and what byline to print, AuthorCredit needs to accept some props.
A React representation of this AuthorCredit component might look something like this:
jsx
Copy to Clipboard
function AuthorCredit(props) {
  return (
    <figure>
      <img src={props.src} alt={props.alt} />
      <figcaption>{props.byline}</figcaption>
    </figure>
  );
}

{props.src}, {props.alt}, and {props.byline} represent where our props will be inserted into the component. To render this component, we would write code like this in the place where we want it rendered (which will probably be inside another component):
jsx
Copy to Clipboard
<AuthorCredit
  src="./assets/zelda.png"
  alt="Portrait of Zelda Schiff"
  byline="Zelda Schiff is editor-in-chief of the Library Times."
/>

This will ultimately render the following <figure> element in the browser, with its structure as defined in the AuthorCredit component, and its content as defined in the props included on the AuthorCredit component call:
html
Copy to Clipboard
<figure>
  <img src="assets/zelda.png" alt="Portrait of Zelda Schiff" />
  <figcaption>Zelda Schiff is editor-in-chief of the Library Times.</figcaption>
</figure>

State
We talked about the concept of state in the previous chapter — a robust state-handling mechanism is key to an effective framework, and each component may have data that needs its state controlled. This state will persist in some way as long as the component is in use. Like props, state can be used to affect how a component is rendered.
As an example, consider a button that counts how many times it has been clicked. This component should be responsible for tracking its own count state, and could be written like this:
jsx
Copy to Clipboard
function CounterButton() {
  const [count] = useState(0);
  return <button>Clicked {count} times</button>;
}

useState() is a React hook which, given an initial data value, will keep track of that value as it is updated. The code will be initially rendered like so in the browser:
html
Copy to Clipboard
<button>Clicked 0 times</button>

The useState() call keeps track of the count value in a robust way across the app, without you needing to write code to do that yourself.
Events
In order to be interactive, components need ways to respond to browser events, so our applications can respond to our users. Frameworks each provide their own syntax for listening to browser events, which reference the names of the equivalent native browser events.
In React, listening for the click event requires a special property, onClick. Let's update our CounterButton code from above to allow it to count clicks:
jsx
Copy to Clipboard
function CounterButton() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
  );
}

In this version we are using additional useState() functionality to create a special setCount() function, which we can invoke to update the value of count. We call this function inside the onClick event handler to set count to whatever its current value is, plus one.
Styling components
Each framework offers a way to define styles for your components — or for the application as a whole. Although each framework's approach to defining the styles of a component is slightly different, all of them give you multiple ways to do so. With the addition of some helper modules, you can style your framework apps in Sass or Less, or transpile your CSS stylesheets with PostCSS.
Handling dependencies
All major frameworks provide mechanisms for handling dependencies — using components inside other components, sometimes with multiple hierarchy levels. As with other features, the exact mechanism will differ between frameworks, but the end result is the same. Components tend to import components into other components using the standard JavaScript module syntax, or at least something similar.
Components in components
One key benefit of component-based UI architecture is that components can be composed together. Just like you can write HTML tags inside each other to build a website, you can use components inside other components to build a web application. Each framework allows you to write components that utilize (and thus depend on) other components.
For example, our AuthorCredit React component might be utilized inside an Article component. That means that Article would need to import AuthorCredit.
js
Copy to Clipboard
import AuthorCredit from "./components/AuthorCredit";

Once that's done, AuthorCredit could be used inside the Article component like this:
jsx
Copy to Clipboard
<Article>
  <AuthorCredit />
</Article>

Dependency injection
Real-world applications can often involve component structures with multiple levels of nesting. An AuthorCredit component nested many levels deep might, for some reason, need data from the very root level of our application.
Let's say that the magazine site we're building is structured like this:
jsx
Copy to Clipboard
<App>
  <Home>
    <Article>
      <AuthorCredit {/* props */} />
    </Article>
  </Home>
</App>

Our App component has data that our AuthorCredit component needs. We could rewrite Home and Article so that they know to pass props down, but this could get tedious if there are many, many levels between the origin and destination of our data. It's also excessive: Home and Article don't actually make use of the author's portrait or byline, but if we want to get that information into the AuthorCredit, we will need to change Home and Article to accommodate it.
The problem of passing data through many layers of components is called prop drilling, and it's not ideal for large applications.
To circumvent prop drilling, frameworks provide functionality known as dependency injection, which is a way to get certain data directly to the components that need it, without passing it through intervening levels. Each framework implements dependency injection under a different name, and in a different way, but the effect is ultimately the same.
Angular calls this process dependency injection; Vue has provide() and inject() component methods; React has a Context API; Ember shares state through services.
Lifecycle
In the context of a framework, a component's lifecycle is a collection of phases a component goes through from the time it is appended to the DOM and then rendered by the browser (often called mounting) to the time that it is removed from the DOM (often called unmounting). Each framework names these lifecycle phases differently, and not all give developers access to the same phases. All of the frameworks follow the same general model: they allow developers to perform certain actions when the component mounts, when it renders, when it unmounts, and at many phases in between these.
The render phase is the most crucial to understand, because it is repeated the most times as your user interacts with your application. It's run every time the browser needs to render something new, whether that new information is an addition to what's in the browser, a deletion, or an edit of what's there.
This diagram of a React component's lifecycle offers a general overview of the concept.
Rendering elements
Just as with lifecycles, frameworks take different-but-similar approaches to how they render your applications. All of them track the current rendered version of your browser's DOM, and each makes slightly different decisions about how the DOM should change as components in your application re-render. Because frameworks make these decisions for you, you typically don't interact with the DOM yourself. This abstraction away from the DOM is more complex and more memory-intensive than updating the DOM yourself, but without it, frameworks could not allow you to program in the declarative way they're known for.
The Virtual DOM is an approach whereby information about your browser's DOM is stored in JavaScript memory. Your application updates this copy of the DOM, then compares it to the "real" DOM — the DOM that is actually rendered for your users — in order to decide what to render. The application builds a "diff" to compare the differences between the updated virtual DOM and the currently rendered DOM, and uses that diff to apply updates to the real DOM. Both React and Vue utilize a virtual DOM model, but they do not apply the exact same logic when diffing or rendering.
You can read more about the Virtual DOM in the React docs.
The Incremental DOM is similar to the virtual DOM in that it builds a DOM diff to decide what to render, but different in that it doesn't create a complete copy of the DOM in JavaScript memory. It ignores the parts of the DOM that do not need to be changed. Angular is the only framework discussed so far in this module that uses an incremental DOM.
You can read more about the Incremental DOM on the Auth0 blog.
The Glimmer VM is unique to Ember. It is not a virtual DOM nor an incremental DOM; it is a separate process through which Ember's templates are transpiled into a kind of "byte code" that is easier and faster to read than JavaScript.
Routing
As mentioned in the previous chapter, routing is an important part of the web experience. To avoid a broken experience in sufficiently complex apps with lots of views, each of the frameworks covered in this module provides a library (or more than one library) that helps developers implement client-side routing in their applications.
Testing
All applications benefit from test coverage that ensures your software continues to behave in the way that you'd expect, and web applications are no different. Each framework's ecosystem provides tooling that facilitates the writing of tests. Testing tools are not built into the frameworks themselves, but the command-line interface tools used to generate framework apps give you access to the appropriate testing tools.
Each framework has extensive tools in its ecosystem, with capabilities for unit and integration testing alike.
Testing Library is a suite of testing utilities that has tools for many JavaScript environments, including React, Vue, and Angular. The Ember docs cover the testing of Ember apps.
Here's a quick test for our CounterButton written with the help of React Testing Library — it tests a number of things, such as the button's existence, and whether the button is displaying the correct text after being clicked 0, 1, and 2 times:
jsx
Copy to Clipboard
import { fireEvent, render, screen } from "@testing-library/react";

import CounterButton from "./CounterButton";

it("Renders a semantic button with an initial state of 0", () => {
  render(<CounterButton />);
  const btn = screen.getByRole("button");

  expect(btn).toBeInTheDocument();
  expect(btn).toHaveTextContent("Clicked 0 times");
});

it("Increments the count when clicked", () => {
  render(<CounterButton />);
  const btn = screen.getByRole("button");

  fireEvent.click(btn);
  expect(btn).toHaveTextContent("Clicked 1 times");

  fireEvent.click(btn);
  expect(btn).toHaveTextContent("Clicked 2 times");
});

Summary
At this point you should have more of an idea about the actual languages, features, and tools you'll be using as you create applications with frameworks. I'm sure you're enthusiastic to get going and actually do some coding, and that's what you are going to do next!
Getting started with React
Previous


Overview: JavaScript frameworks and libraries


Next


In this article we will say hello to React. We'll discover a little bit of detail about its background and use cases, set up a basic React toolchain on our local computer, and create and play with a simple starter app — learning a bit about how React works in the process.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages, and the terminal/command line.
Learning outcomes:
Set up a local React development environment, create a start app, and understand the basics of how it works.

Hello React
As its official tagline states, React is a library for building user interfaces. React is not a framework – it's not even exclusive to the web. It's used with other libraries to render to certain environments. For instance, React Native can be used to build mobile applications.
To build for the web, developers use React in tandem with ReactDOM. React and ReactDOM are often discussed in the same spaces as — and utilized to solve the same problems as — other true web development frameworks. When we refer to React as a "framework", we're working with that colloquial understanding.
React's primary goal is to minimize the bugs that occur when developers are building UIs. It does this through the use of components — self-contained, logical pieces of code that describe a portion of the user interface. These components can be composed together to create a full UI, and React abstracts away much of the rendering work, leaving you to concentrate on the UI design.
Use cases
Unlike the other frameworks covered in this module, React does not enforce strict rules around code conventions or file organization. This allows teams to set conventions that work best for them, and to adopt React in any way they would like to. React can handle a single button, a few pieces of an interface, or an app's entire user interface.
While React can be used for small pieces of an interface, it's not as easy to "drop into" an application as a library like jQuery, or even a framework like Vue — it is more approachable when you build your entire app with React.
In addition, many of the developer-experience benefits of a React app, such as writing interfaces with JSX, require a compilation process. Adding a compiler like Babel to a website makes the code on it run slowly, so developers often set up such tooling with a build step. React arguably has a heavy tooling requirement, but it can be learned.
This article is going to focus on the use case of using React to render the entire user interface of an application with the support of Vite, a modern front-end build tool.
How does React use JavaScript?
React utilizes features of modern JavaScript for many of its patterns. Its biggest departure from JavaScript comes with the use of JSX syntax. JSX extends JavaScript's syntax so that HTML-like code can live alongside it. For example:
jsx
Copy to Clipboard
const heading = <h1>Mozilla Developer Network</h1>;

This heading constant is known as a JSX expression. React can use it to render that <h1> tag in our app.
Suppose we wanted to wrap our heading in a <header> tag, for semantic reasons? The JSX approach allows us to nest our elements within each other, just like we do with HTML:
jsx
Copy to Clipboard
const header = (
  <header>
    <h1>Mozilla Developer Network</h1>
  </header>
);

Note: The parentheses in the previous snippet aren't unique to JSX, and don't have any effect on your application. They're a signal to you (and your computer) that the multiple lines of code inside are part of the same expression. You could just as well write the header expression like this:
jsx
Copy to Clipboard
const header = <header>
  <h1>Mozilla Developer Network</h1>
</header>;

However, this looks kind of awkward, because the <header> tag that starts the expression is not indented to the same position as its corresponding closing tag.
Of course, your browser can't read JSX without help. When compiled (using a tool like Babel or Parcel), our header expression would look like this:
jsx
Copy to Clipboard
const header = React.createElement(
  "header",
  null,
  React.createElement("h1", null, "Mozilla Developer Network"),
);

It's possible to skip the compilation step and use React.createElement() to write your UI yourself. In doing this, however, you lose the declarative benefit of JSX, and your code becomes harder to read. Compilation is an extra step in the development process, but many developers in the React community think that the readability of JSX is worthwhile. Plus, modern front-end development almost always involves a build process anyway — you have to downlevel modern syntax to be compatible with older browsers, and you may want to minify your code to optimize loading performance. Popular tooling like Babel already comes with JSX support out-of-the-box, so you don't have to configure compilation yourself unless you want to.
Because JSX is a blend of HTML and JavaScript, some developers find it intuitive. Others say that its blended nature makes it confusing. Once you're comfortable with it, however, it will allow you to build user interfaces more quickly and intuitively, and allow others to better understand your codebase at a glance.
To read more about JSX, check out the React team's Writing Markup with JSX article.
Setting up your first React app
There are many ways to create a new React application. We're going to use Vite to create a new application via the command line.
It's possible to add React to an existing project by copying some <script> elements into an HTML file, but using Vite will allow you to spend more time building your app and less time fussing with setup.
Note: You can start writing React code without doing any local setup by working through Scrimba's First React Code MDN learning partner scrim. Feel free to give it a try before continuing.
Requirements
In order to use Vite, you need to have Node.js installed. As of Vite 5.0, at least Node version 18 or later is required, and it's a good idea to run the latest long term support (LTS) version when you can. As of 24th October 2023, Node 20 is the latest LTS version. Node includes npm (the Node package manager).
To check your version of Node, run the following in your terminal:
bash
Copy to Clipboard
node -v

If Node is installed, you'll see a version number. If it isn't, you'll see an error message. To install Node, follow the instructions on the Node.js website.
You may use the Yarn package manager as an alternative to npm but we'll assume you're using npm in this set of tutorials. See Package management basics for more information on npm and yarn.
If you're using Windows, you will need to install some software to give you parity with Unix/macOS terminal in order to use the terminal commands mentioned in this tutorial. Gitbash (which comes as part of the git for Windows toolset) or Windows Subsystem for Linux (WSL) are both suitable. See Command line crash course for more information on these, and on terminal commands in general.
Also bear in mind that React and ReactDOM produce apps that only work on a fairly modern set of browsers like Firefox, Microsoft Edge, Safari, or Chrome when working through these tutorials.
See the following for more information:
"About npm" on the npm blog
"Introducing npx" on the npm blog
Vite's documentation
Initializing your app
The npm package manager comes with a create command that allows you to create new projects from templates. We can use it to create a new app from Vite's standard React template. Make sure you cd to the place you'd like your app to live on your machine, then run the following in your terminal:
bash
Copy to Clipboard
npm create vite@latest moz-todo-react -- --template react

This creates a moz-todo-react directory using Vite's react template.
Note: The -- is necessary to pass arguments to npm commands such as create, and the --template react argument tells Vite to use its React template.
Your terminal will have printed some messages if this command was successful. You should see text prompting you to cd to your new directory, install the app's dependencies, and run the app locally. Let's start with two of those commands. Run the following in your terminal:
bash
Copy to Clipboard
cd moz-todo-react && npm install

Once the process is complete, we need to start a local development server to run our app. Here, we're going to add some command line flags to Vite's default suggestion to open the app in our browser as soon as the server starts, and use port 3000.
Run the following in your terminal:
bash
Copy to Clipboard
npm run dev -- --open --port 3000

Once the server starts, you should see a new browser tab containing your React app:

Application structure
Vite gives us everything we need to develop a React application. Its initial file structure looks like this:
moz-todo-react
├── README.md
├── index.html
├── node_modules
├── package-lock.json
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── assets
│   │   └── react.svg
│   ├── index.css
│   └── main.jsx
└── vite.config.js

index.html is the most important top-level file. Vite injects your code into this file so that your browser can run it. You won't need to edit this file during our tutorial, but you should change the text inside the <title> element in this file to reflect the title of your application. Accurate page titles are important for accessibility.
The public directory contains static files that will be served directly to your browser without being processed by Vite's build tooling. Right now, it only contains a Vite logo.
The src directory is where we'll spend most of our time, as it's where the source code for our application lives. You'll notice that some JavaScript files in this directory end in the extension .jsx. This extension is necessary for any file that contains JSX – it tells Vite to turn the JSX syntax into JavaScript that your browser can understand. The src/assets directory contains the React logo you saw in the browser.
The package.json and package-lock.json files contain metadata about our project. These files are not unique to React applications: Vite populated package.json for us, and npm created package-lock.json for when we installed the app's dependencies. You don't need to understand these files at all to complete this tutorial. However, if you'd like to learn more about them, you can read about package.json and package-lock.json in the npm docs. We also talk about package.json in our Package management basics tutorial.
Customizing our dev script
Before we move on, you might want to change your package.json file a little bit so that you don't have to pass the --open and --port flags every time you run npm run dev. Open package.json in your text editor and find the scripts object. Change the "dev" key so that it looks like this:
diff
Copy to Clipboard
- "dev": "vite",
+ "dev": "vite --open --port 3000",

With this in place, your app will open in your browser at http://localhost:3000 every time you run npm run dev.
Note: You don't need the extra -- here because we're passing arguments directly to vite, rather than to a pre-defined npm script.
Exploring our first React component — <App />
In React, a component is a reusable module that renders a part of our overall application. Components can be big or small, but they are usually clearly defined: they serve a single, obvious purpose.
Let's open src/App.jsx, since our browser is prompting us to edit it. This file contains our first component, <App />:
jsx
Copy to Clipboard
import { useState } from "react";
import viteLogo from "/vite.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

The App.jsx file consists of three main parts: some import statements at the top, the App() function in the middle, and an export statement at the bottom. Most React components follow this pattern.
Import statements
The import statements at the top of the file allow App.jsx to use code that has been defined elsewhere. Let's look at these statements more closely.
jsx
Copy to Clipboard
import { useState } from "react";
import viteLogo from "/vite.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";

The first statement imports the useState hook from the react library. Hooks are a way of using React's features inside a component. We'll talk more about hooks later in this tutorial.
After that, we import reactLogo and viteLogo. Note that their import paths start with ./ and / respectively and that they end with the .svg extension at the end. This tells us that these imports are local, referencing our own files rather than npm packages.
The final statement imports the CSS related to our <App /> component. Note that there is no variable name and no from directive. This is called a side-effect import — it doesn't import any value into the JavaScript file, but it tells Vite to add the referenced CSS file to the final code output, so that it can be used in the browser.
The App() function
After the imports, we have a function named App(), which defines the structure of the App component. Whereas most of the JavaScript community prefers lower camel case names like helloWorld, React components use Pascal case (or upper camel case) variable names, like HelloWorld, to make it clear that a given JSX element is a React component and not a regular HTML tag. If you were to rename the App() function to app(), your browser would throw an error.
Let's look at App() more closely.
jsx
Copy to Clipboard
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

The App() function returns a JSX expression. This expression defines what your browser ultimately renders to the DOM.
Just under the return keyword is a special bit of syntax: <>. This is a fragment. React components have to return a single JSX element, and fragments allow us to do that without rendering arbitrary <div>s in the browser. You'll see fragments in many React applications.
The export statement
There's one more line of code after the App() function:
jsx
Copy to Clipboard
export default App;

This export statement makes our App() function available to other modules. We'll talk more about this later.
Moving on to main
Let's open src/main.jsx, because that's where the <App /> component is being used. This file is the entry point for our app, and it initially looks like this:
jsx
Copy to Clipboard
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

As with App.jsx, the file starts by importing all the JavaScript modules and other assets it needs to run.
The first two statements import StrictMode and createRoot from the react and react-dom libraries because they are referenced later in the file. We don't write a path or extension when importing these libraries because they are not local files. In fact, they are listed as dependencies in our package.json file. Be careful of this distinction as you work through this lesson!
We then import our App() function and index.css, which holds global styles that are applied to our whole app.
We then call the createRoot() function, which defines the root node of our application. This takes as an argument the DOM element inside which we want our React app to be rendered. In this case, that's the DOM element with an ID of root. Finally, we chain the render() method onto the createRoot() call, passing it the JSX expression that we want to render inside our root. By writing <App /> as this JSX expression, we're telling React to call the App() function, which renders the App component inside the root node.
Note: <App /> is rendered inside a special <React.StrictMode> component. This component helps developers catch potential problems in their code.
You can read up on these React APIs, if you'd like:
ReactDOM.createRoot()
React.StrictMode
Starting fresh
Before we start building our app, we're going to delete some of the boilerplate code that Vite provided for us.
First, as an experiment, change the <h1> element in App.jsx so that it reads "Hello, World!", then save your file. You'll notice that this change is immediately rendered in the development server running at http://localhost:3000 in your browser. Bear this in mind as you work on your app.
We won't be using the rest of the code! Replace the contents of App.jsx with the following:
jsx
Copy to Clipboard
import "./App.css";

function App() {
  return (
    <>
      <header>
        <h1>Hello, World!</h1>
      </header>
    </>
  );
}

export default App;

Practice with JSX
Next, we'll use our JavaScript skills to get a bit more comfortable writing JSX and working with data in React. We'll talk about how to add attributes to JSX elements, how to write comments, how to render content from variables and other expressions, and how to pass data into components with props.
Adding attributes to JSX elements
JSX elements can have attributes, just like HTML elements. Try adding a <button> below the <h1> element in your App.jsx file, like this:
jsx
Copy to Clipboard
<button type="button">Click me!</button>

When you save your file, you'll see a button with the words Click me!. The button doesn't do anything yet, but we'll learn about adding interactivity to our app soon.
Some attributes are different than their HTML counterparts. For example, the class attribute in HTML translates to className in JSX. This is because class is a reserved word in JavaScript, and JSX is a JavaScript extension. If you wanted to add a primary class to your button, you'd write it like this:
jsx
Copy to Clipboard
<button type="button" className="primary">
  Click me!
</button>

JavaScript expressions as content
Unlike HTML, JSX allows us to write variables and other JavaScript expressions right alongside our other content. Let's declare a variable called subject just above the App() function in your App.jsx file:
jsx
Copy to Clipboard
const subject = "React";
function App() {
  // code omitted for brevity
}

Next, replace the word "World" in the <h1> element with {subject}:
jsx
Copy to Clipboard
<h1>Hello, {subject}!</h1>

Save your file and check your browser. You should see "Hello, React!" rendered.
The curly braces around subject are another feature of JSX's syntax. The curly braces tell React that we want to read the value of the subject variable, rather than render the literal string "subject". You can put any valid JavaScript expression inside curly braces in JSX; React will evaluate it and render the result of the expression as the final content. Following is a series of examples, with comments above explaining what each expression will render:
jsx
Copy to Clipboard
{/* Hello, React :)! */}
<h1>Hello, {`${subject} :)`}!</h1>
{/* Hello, REACT */}
<h1>Hello, {subject.toUpperCase()}</h1>
{/* Hello, 4! */}
<h1>Hello, {2 + 2}!</h1>

Even comments in JSX are written inside curly braces! This is because curly braces can contain a single JavaScript expression, and comments are valid as part of a JavaScript expression (and get ignored). You can use both /* block comment syntax */ and // line comment syntax (with a trailing new line) inside curly braces.
Component props
Props are a means of passing data into a React component. Their syntax is identical to that of attributes, in fact: prop="value". The difference is that whereas attributes are passed into plain elements, props are passed into React components.
In React, the flow of data is unidirectional: props can only be passed from parent components down to child components.
Let's open main.jsx and give our <App /> component its first prop.
Add a prop of subject to the <App /> component call, with a value of Clarice. When you are done, it should look something like this:
jsx
Copy to Clipboard
<App subject="Clarice" />

Back in App.jsx, let's revisit the App() function. Change the signature of App() so that it accepts props as a parameter and log props to the console so you can inspect it. Also delete the subject const; we don't need it anymore. Your App.jsx file should look like this:
jsx
Copy to Clipboard
function App(props) {
  console.log(props);
  return (
    <>
      {
        // code omitted for brevity
      }
    </>
  );
}

Save your file and check your browser. You'll see a blank background with no content. This is because we're trying to read a subject variable that's no longer defined. Fix this by commenting out the <h1>Hello {subject}!</h1> line.
Note: If your code editor understands how to parse JSX (most modern editors do!), you can use its built-in commenting shortcut — Ctrl + / (on Windows) or Cmd + / (on macOS) — to create comments more quickly.
Save the file with that line commented out. This time, you should see your "Click me!" button rendered by itself. If you open your browser's developer console, you'll see a message that looks like this:
Object { subject: "Clarice" }

The object property subject corresponds to the subject prop we added to our <App /> component call, and the string Clarice corresponds to its value. Component props in React are always collected into objects in this fashion.
Let's use this subject prop to fix the error in our app. Uncomment the <h1>Hello, {subject}!</h1> line and change it to <h1>Hello, {props.subject}!</h1>, then delete the console.log() statement. Your code should look like this:
jsx
Copy to Clipboard
function App(props) {
  return (
    <>
      <header>
        <h1>Hello, {props.subject}!</h1>
        <button type="button" className="primary">
          Click me!
        </button>
      </header>
    </>
  );
}

When you save, the app should now greet you with "Hello, Clarice!". If you return to main.jsx, edit the value of subject, and save, your text will change.
For additional practice, you could try adding an additional greeting prop to the <App /> component call inside main.jsx and using it alongside the subject prop inside App.jsx.
Summary
This brings us to the end of our initial look at React, including how to install it locally, creating a starter app, and how the basics work. In the next article, we'll start building our first proper application — a todo list. Before we do that, however, let's recap some of the things we've learned.
In React:
Components can import modules they need and must export themselves at the bottom of their files.
Component functions are named with PascalCase.
You can render JavaScript expressions in JSX by putting them between curly braces, like {so}.
Some JSX attributes are different than HTML attributes so that they don't conflict with JavaScript reserved words. For example, class in HTML translates to className in JSX.
Props are written just like attributes inside component calls and are passed into components.
See also
Learn React MDN learning partner
Scrimba's Learn React course is the ultimate React 101 — the perfect starting point for any React beginner. Learn the basics of modern React by solving 140+ interactive coding challenges and building eight fun projects.
Beginning our React ToDo app
Previous


Overview: JavaScript frameworks and libraries


Next


Let's say that we've been tasked with creating a proof-of-concept in React – an app that allows users to add, edit, and delete tasks they want to work on, and also mark tasks as complete without deleting them. This article will walk you through the basic structure and styling of such an application, ready for individual component definition and interactivity, which we'll add later.
Note: If you need to check your code against our version, you can find a finished version of the sample React app code in our todo-react repository. For a running live version, see https://mdn.github.io/todo-react/.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages, and the terminal/command line.
Learning outcomes:
Familiarity with our todo list case study, and getting the basic App structure and styling in place.


Our app's user stories
In software development, a user story is an actionable goal from the perspective of the user. Defining user stories before we begin our work will help us focus our work. Our app should fulfill the following stories:
As a user, I can
read a list of tasks.
add a task using the mouse or keyboard.
mark any task as completed, using the mouse or keyboard.
delete any task, using the mouse or keyboard.
edit any task, using the mouse or keyboard.
view a specific subset of tasks: All tasks, only the active task, or only the completed tasks.
We'll tackle these stories one-by-one.
Pre-project housekeeping
Vite has given us some code that we won't be using at all for our project. The following terminal commands will delete it to make way for our new project. Make sure you're starting in the app's root directory!
bash
Copy to Clipboard
# Move into the src directory
cd src
# Delete the App.css file and the React logo provided by Vite
rm App.css assets/react.svg
# Empty the contents of App.jsx and index.css
echo -n > App.jsx && echo -n > index.css
# Move back up to the root of the project
cd ..
Note: If you stopped your server to do the terminal tasks mentioned above, you'll have to start it again using npm run dev.
Project starter code
As a starting point for this project, we're going to provide two things: an App() function to replace the one you just deleted, and some CSS to style your app.
The JSX
Copy the following snippet to your clipboard, then paste it into App.jsx:
jsx
Copy to Clipboard
function App(props) {
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <form>
        <h2 className="label-wrapper">
          <label htmlFor="new-todo-input" className="label__lg">
            What needs to be done?
          </label>
        </h2>
        <input
          type="text"
          id="new-todo-input"
          className="input input__lg"
          name="text"
          autoComplete="off"
        />
        <button type="submit" className="btn btn__primary btn__lg">
          Add
        </button>
      </form>
      <div className="filters btn-group stack-exception">
        <button type="button" className="btn toggle-btn" aria-pressed="true">
          <span className="visually-hidden">Show </span>
          <span>all</span>
          <span className="visually-hidden"> tasks</span>
        </button>
        <button type="button" className="btn toggle-btn" aria-pressed="false">
          <span className="visually-hidden">Show </span>
          <span>Active</span>
          <span className="visually-hidden"> tasks</span>
        </button>
        <button type="button" className="btn toggle-btn" aria-pressed="false">
          <span className="visually-hidden">Show </span>
          <span>Completed</span>
          <span className="visually-hidden"> tasks</span>
        </button>
      </div>
      <h2 id="list-heading">3 tasks remaining</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        <li className="todo stack-small">
          <div className="c-cb">
            <input id="todo-0" type="checkbox" defaultChecked />
            <label className="todo-label" htmlFor="todo-0">
              Eat
            </label>
          </div>
          <div className="btn-group">
            <button type="button" className="btn">
              Edit <span className="visually-hidden">Eat</span>
            </button>
            <button type="button" className="btn btn__danger">
              Delete <span className="visually-hidden">Eat</span>
            </button>
          </div>
        </li>
        <li className="todo stack-small">
          <div className="c-cb">
            <input id="todo-1" type="checkbox" />
            <label className="todo-label" htmlFor="todo-1">
              Sleep
            </label>
          </div>
          <div className="btn-group">
            <button type="button" className="btn">
              Edit <span className="visually-hidden">Sleep</span>
            </button>
            <button type="button" className="btn btn__danger">
              Delete <span className="visually-hidden">Sleep</span>
            </button>
          </div>
        </li>
        <li className="todo stack-small">
          <div className="c-cb">
            <input id="todo-2" type="checkbox" />
            <label className="todo-label" htmlFor="todo-2">
              Repeat
            </label>
          </div>
          <div className="btn-group">
            <button type="button" className="btn">
              Edit <span className="visually-hidden">Repeat</span>
            </button>
            <button type="button" className="btn btn__danger">
              Delete <span className="visually-hidden">Repeat</span>
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default App;
Now open index.html and change the <title> element's text to TodoMatic. This way, it will match the <h1> at the top of our app.
html
Copy to Clipboard
<title>TodoMatic</title>
When your browser refreshes, you should see something like this:

It's ugly, and doesn't function yet, but that's okay — we'll style it in a moment. First, consider the JSX we have, and how it corresponds to our user stories:
We have a <form> element, with an <input type="text"> for writing out a new task, and a button to submit the form.
We have an array of buttons that will be used to filter our tasks.
We have a heading that tells us how many tasks remain.
We have our 3 tasks, arranged in an unordered list. Each task is a list item (<li>), and has buttons to edit and delete it and a checkbox to check it off as done.
The form will allow us to make tasks; the buttons will let us filter them; the heading and list are our way to read them. The UI for editing a task is conspicuously absent for now. That's okay – we'll write that later.
Accessibility features
You may notice some unusual markup here. For example:
jsx
Copy to Clipboard
<button type="button" className="btn toggle-btn" aria-pressed="true">
  <span className="visually-hidden">Show </span>
  <span>all</span>
  <span className="visually-hidden"> tasks</span>
</button>
Here, aria-pressed tells assistive technology (like screen readers) that the button can be in one of two states: pressed or unpressed. Think of these as analogs for on and off. Setting a value of "true" means that the button is pressed by default.
The class visually-hidden has no effect yet, because we have not included any CSS. Once we have put our styles in place, though, any element with this class will be hidden from sighted users and still available to assistive technology users — this is because these words are not needed by sighted users; they are there to provide more information about what the button does for assistive technology users that do not have the extra visual context to help them.
Further down, you can find our <ul> element:
html
Copy to Clipboard
<ul
  role="list"
  className="todo-list stack-large stack-exception"
  aria-labelledby="list-heading">
  …
</ul>
The role attribute helps assistive technology explain what kind of element a tag represents. A <ul> is treated like a list by default, but the styles we're about to add will break that functionality. This role will restore the "list" meaning to the <ul> element. If you want to learn more about why this is necessary, you can check out Scott O'Hara's article, "Fixing Lists".
The aria-labelledby attribute tells assistive technologies that we're treating our list heading as the label that describes the purpose of the list beneath it. Making this association gives the list a more informative context, which could help assistive technology users better understand the list's purpose.
Finally, the labels and inputs in our list items have some attributes unique to JSX:
jsx
Copy to Clipboard
<div className="c-cb">
  <input id="todo-0" type="checkbox" defaultChecked />
  <label className="todo-label" htmlFor="todo-0">
    Eat
  </label>
</div>
The defaultChecked attribute in the <input /> tag tells React to check this checkbox initially. If we were to use checked, as we would in regular HTML, React would log some warnings into our browser console relating to handling events on the checkbox, which we want to avoid. Don't worry too much about this for now — we will cover this later on when we get to using events.
The htmlFor attribute corresponds to the for attribute used in HTML. We cannot use for as an attribute in JSX because for is a reserved word, so React uses htmlFor instead.
A note on boolean attributes in JSX
The defaultChecked attribute in the previous section is a boolean attribute – an attribute whose value is either true or false. Like in HTML, a boolean attribute is true if it's present and false if it's absent; the assignment on the right-hand side of the expression is optional. You can explicitly set its value by passing it in curly braces – for example, defaultChecked={true} or defaultChecked={false}.
Because JSX is JavaScript, there's a gotcha to be aware of with boolean attributes: writing defaultChecked="false" will set a string value of "false" rather than a boolean value. Non-empty strings are truthy, so React will consider defaultChecked to be true and check the checkbox by default. This is not what we want, so we should avoid it.
If you'd like, you can practice writing boolean attributes with another attribute you may have seen before, hidden, which prevents elements from being rendered on the page. Try adding hidden to the <h1> element in App.jsx to see what happens, then try explicitly setting its value to {false}. Note, again, that writing hidden="false" results in a truthy value so the <h1> will hide. Don't forget to remove this code when you're done.
Note: The aria-pressed attribute used in our earlier code snippet has a value of "true" because aria-pressed is not a true boolean attribute in the way checked is.
Implementing our styles
Paste the following CSS code into src/index.css:
css
Copy to Clipboard
/* Resets */
*,
*::before,
*::after {
  box-sizing: border-box;
}
*:focus-visible {
  outline: 3px dashed #228bec;
  outline-offset: 0;
}
html {
  font: 62.5% / 1.15 sans-serif;
}
h1,
h2 {
  margin-bottom: 0;
}
ul {
  list-style: none;
  padding: 0;
}
button {
  -moz-osx-font-smoothing: inherit;
  -webkit-font-smoothing: inherit;
  appearance: none;
  background: transparent;
  border: none;
  color: inherit;
  font: inherit;
  line-height: normal;
  margin: 0;
  overflow: visible;
  padding: 0;
  width: auto;
}
button::-moz-focus-inner {
  border: 0;
}
button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
}
button,
input {
  overflow: visible;
}
input[type="text"] {
  border-radius: 0;
}
body {
  background-color: #f5f5f5;
  color: #4d4d4d;
  font:
    1.6rem/1.25 Arial,
    sans-serif;
  margin: 0 auto;
  max-width: 68rem;
  width: 100%;
}
@media screen and (width >= 620px) {
  body {
    font-size: 1.9rem;
    line-height: 1.31579;
  }
}
/* End resets */
/* Global styles */
.form-group > input[type="text"] {
  display: inline-block;
  margin-top: 0.4rem;
}
.btn {
  border: 0.2rem solid #4d4d4d;
  cursor: pointer;
  padding: 0.8rem 1rem 0.7rem;
  text-transform: capitalize;
}
.btn.toggle-btn {
  border-color: #d3d3d3;
  border-width: 1px;
}
.btn.toggle-btn[aria-pressed="true"] {
  border-color: #4d4d4d;
  text-decoration: underline;
}
.btn__danger {
  background-color: #ca3c3c;
  border-color: #bd2130;
  color: #fff;
}
.btn__filter {
  border-color: lightgrey;
}
.btn__primary {
  background-color: #000;
  color: #fff;
}
.btn-group {
  display: flex;
  justify-content: space-between;
}
.btn-group > * {
  flex: 1 1 49%;
}
.btn-group > * + * {
  margin-left: 0.8rem;
}
.label-wrapper {
  flex: 0 0 100%;
  margin: 0;
  text-align: center;
}
.visually-hidden {
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;
}
[class*="stack"] > * {
  margin-bottom: 0;
  margin-top: 0;
}
.stack-small > * + * {
  margin-top: 1.25rem;
}
.stack-large > * + * {
  margin-top: 2.5rem;
}
@media screen and (width >= 550px) {
  .stack-small > * + * {
    margin-top: 1.4rem;
  }
  .stack-large > * + * {
    margin-top: 2.8rem;
  }
}
.stack-exception {
  margin-top: 1.2rem;
}
/* End global styles */
/* General app styles */
.todoapp {
  background: #fff;
  box-shadow:
    0 2px 4px 0 rgb(0 0 0 / 20%),
    0 2.5rem 5rem 0 rgb(0 0 0 / 10%);
  margin: 2rem 0 4rem 0;
  padding: 1rem;
  position: relative;
}
@media screen and (width >= 550px) {
  .todoapp {
    padding: 4rem;
  }
}
.todoapp > * {
  margin-left: auto;
  margin-right: auto;
  max-width: 50rem;
}
.todoapp > form {
  max-width: 100%;
}
.todoapp > h1 {
  display: block;
  margin: 0;
  margin-bottom: 1rem;
  max-width: 100%;
  text-align: center;
}
.label__lg {
  line-height: 1.01567;
  font-weight: 300;
  margin-bottom: 1rem;
  padding: 0.8rem;
  text-align: center;
}
.input__lg {
  border: 2px solid #000;
  padding: 2rem;
}
.input__lg:focus-visible {
  border-color: #4d4d4d;
  box-shadow: inset 0 0 0 2px;
}
[class*="__lg"] {
  display: inline-block;
  font-size: 1.9rem;
  width: 100%;
}
[class*="__lg"]:not(:last-child) {
  margin-bottom: 1rem;
}
@media screen and (width >= 620px) {
  [class*="__lg"] {
    font-size: 2.4rem;
  }
}
/* End general app styles */
/* Todo item styles */
.todo {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.todo > * {
  flex: 0 0 100%;
}
.todo-text {
  border: 2px solid #565656;
  min-height: 4.4rem;
  padding: 0.4rem 0.8rem;
  width: 100%;
}
.todo-text:focus-visible {
  box-shadow: inset 0 0 0 2px;
}
/* End todo item styles */
/* Checkbox styles */
.c-cb {
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  clear: left;
  display: block;
  font-family: Arial, sans-serif;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.25;
  min-height: 44px;
  padding-left: 40px;
  position: relative;
}
.c-cb > label::before,
.c-cb > input[type="checkbox"] {
  box-sizing: border-box;
  height: 44px;
  left: -2px;
  top: -2px;
  width: 44px;
}
.c-cb > input[type="checkbox"] {
  -webkit-font-smoothing: antialiased;
  cursor: pointer;
  margin: 0;
  opacity: 0;
  position: absolute;
  z-index: 1;
}
.c-cb > label {
  cursor: pointer;
  display: inline-block;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  margin-bottom: 0;
  padding: 8px 15px 5px;
  touch-action: manipulation;
}
.c-cb > label::before {
  background: transparent;
  border: 2px solid currentcolor;
  content: "";
  position: absolute;
}
.c-cb > input[type="checkbox"]:focus-visible + label::before {
  border-width: 4px;
  outline: 3px dashed #228bec;
}
.c-cb > label::after {
  background: transparent;
  border: solid;
  border-width: 0 0 5px 5px;
  border-top-color: transparent;
  box-sizing: content-box;
  content: "";
  height: 7px;
  left: 9px;
  opacity: 0;
  position: absolute;
  top: 11px;
  transform: rotate(-45deg);
  width: 18px;
}
.c-cb > input[type="checkbox"]:checked + label::after {
  opacity: 1;
}
/* End checkbox styles */
Save and look back at your browser, and your app should now have reasonable styling.
Summary
Now our todo list app actually looks a bit more like a real app! The problem is: it doesn't actually do anything. We'll start fixing that in the next chapter!
Previous





Componentizing our React app
Previous


Overview: JavaScript frameworks and libraries


Next


At this point, our app is a monolith. Before we can make it do things, we need to break it apart into manageable, descriptive components. React doesn't have any hard rules for what is and isn't a component – that's up to you! In this article we will show you a sensible way to break our app up into components.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages, and the terminal/command line.
Learning outcomes:
A sensible way of breaking our todo list app into components.


Defining our first component
Defining a component can seem tricky until you have some practice, but the gist is:
If it represents an obvious "chunk" of your app, it's probably a component
If it gets reused often, it's probably a component.
That second bullet is especially valuable: making a component out of common UI elements allows you to change your code in one place and see those changes everywhere that component is used. You don't have to break everything out into components right away, either. Let's take the second bullet point as inspiration and make a component out of the most reused, most important piece of the UI: a todo list item.
Make a <Todo />
Before we can make a component, we should create a new file for it. In fact, we should make a directory just for our components. Make sure you're in the root of your app before you run these commands!
bash
Copy to Clipboard
# create a `components` directory
mkdir src/components
# within `components`, create a file called `Todo.jsx`
touch src/components/Todo.jsx
Don't forget to restart your development server if you stopped it to run the previous commands!
Let's add a Todo() function in Todo.jsx. Here, we define a function and export it:
jsx
Copy to Clipboard
function Todo() {}

export default Todo;
This is OK so far, but our component should return something useful! Go back to src/App.jsx, copy the first <li> from inside the unordered list, and paste it into Todo.jsx so that it reads like this:
jsx
Copy to Clipboard
function Todo() {
  return (
    <li className="todo stack-small">
      <div className="c-cb">
        <input id="todo-0" type="checkbox" defaultChecked />
        <label className="todo-label" htmlFor="todo-0">
          Eat
        </label>
      </div>
      <div className="btn-group">
        <button type="button" className="btn">
          Edit <span className="visually-hidden">Eat</span>
        </button>
        <button type="button" className="btn btn__danger">
          Delete <span className="visually-hidden">Eat</span>
        </button>
      </div>
    </li>
  );
}

export default Todo;
Now we have something we can use. In App.jsx, add the following line at the top of the file to import Todo:
jsx
Copy to Clipboard
import Todo from "./components/Todo";
With this component imported, you can replace all of the <li> elements in App.jsx with <Todo /> component calls. Your <ul> should read like this:
jsx
Copy to Clipboard
<ul
  role="list"
  className="todo-list stack-large stack-exception"
  aria-labelledby="list-heading">
  <Todo />
  <Todo />
  <Todo />
</ul>
When you return to your app, you'll notice something unfortunate: your list now repeats the first task three times!

We don't only want to eat; we have other things to — well — to do. Next we'll look at how we can make different component calls render unique content.
Make a unique <Todo />
Components are powerful because they let us re-use pieces of our UI, and refer to one place for the source of that UI. The problem is, we don't typically want to reuse all of each component; we want to reuse most parts, and change small pieces. This is where props come in.
What's in a name?
In order to track the names of tasks we want to complete, we should ensure that each <Todo /> component renders a unique name.
In App.jsx, give each <Todo /> a name prop. Let's use the names of our tasks that we had before:
jsx
Copy to Clipboard
<ul
  role="list"
  className="todo-list stack-large stack-exception"
  aria-labelledby="list-heading">
  <Todo name="Eat" />
  <Todo name="Sleep" />
  <Todo name="Repeat" />
</ul>
When your browser refreshes, you will see… the exact same thing as before. We gave our <Todo /> some props, but we aren't using them yet. Let's go back to Todo.jsx and remedy that.
First modify your Todo() function definition so that it takes props as a parameter. You can console.log() your props if you'd like to check that they are being received by the component correctly.
Once you're confident that your component is getting its props, you can replace every occurrence of Eat with your name prop by reading props.name. Remember: props.name is a JSX expression, so you'll need to wrap it in curly braces.
Putting all that together, your Todo() function should read like this:
jsx
Copy to Clipboard
function Todo(props) {
  return (
    <li className="todo stack-small">
      <div className="c-cb">
        <input id="todo-0" type="checkbox" defaultChecked={true} />
        <label className="todo-label" htmlFor="todo-0">
          {props.name}
        </label>
      </div>
      <div className="btn-group">
        <button type="button" className="btn">
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        <button type="button" className="btn btn__danger">
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </li>
  );
}

export default Todo;
Now your browser should show three unique tasks. Another problem remains though: they're all still checked by default.

Is it completed?
In our original static list, only Eat was checked. Once again, we want to reuse most of the UI that makes up a <Todo /> component, but change one thing. That's a good job for another prop! Give your first <Todo /> call a boolean prop of completed, and leave the other two as they are.
jsx
Copy to Clipboard
<ul
  role="list"
  className="todo-list stack-large stack-exception"
  aria-labelledby="list-heading">
  <Todo name="Eat" completed />
  <Todo name="Sleep" />
  <Todo name="Repeat" />
</ul>
As before, we must go back to Todo.jsx to actually use these props. Change the defaultChecked attribute on the <input /> so that its value is equal to the completed prop. Once you're done, the Todo component's <input /> element will read like this:
jsx
Copy to Clipboard
<input id="todo-0" type="checkbox" defaultChecked={props.completed} />
And your browser should update to show only Eat being checked:

If you change each <Todo /> component's completed prop, your browser will check or uncheck the equivalent rendered checkboxes accordingly.
Gimme some id, please
We have still another problem: our <Todo /> component gives every task an id attribute of todo-0. This is bad for a couple of reasons:
id attributes must be unique (they are used as unique identifiers for document fragments, by CSS, JavaScript, etc.).
When ids are not unique, the functionality of label elements can break.
The second problem is affecting our app right now. If you click on the word "Sleep" next to the second checkbox, you'll notice the "Eat" checkbox toggles instead of the "Sleep" checkbox. This is because every checkbox's <label> element has an htmlFor attribute of todo-0. The <label>s only acknowledge the first element with a given id attribute, which causes the problem you see when clicking on the other labels.
We had unique id attributes before we created the <Todo /> component. Let's bring them back, following the format of todo-i, where i gets larger by one every time. Update the Todo component instances inside App.jsx to add in id props, as follows:
jsx
Copy to Clipboard
<ul
  role="list"
  className="todo-list stack-large stack-exception"
  aria-labelledby="list-heading">
  <Todo name="Eat" id="todo-0" completed />
  <Todo name="Sleep" id="todo-1" />
  <Todo name="Repeat" id="todo-2" />
</ul>
Note: The completed prop is last here because it is a boolean with no assignment. This is purely a stylistic convention. The order of props does not matter because props are JavaScript objects, and JavaScript objects are unordered.
Now go back to Todo.jsx and make use of the id prop. It needs to replace the <input /> element's id attribute value, as well as its <label>'s htmlFor attribute value:
jsx
Copy to Clipboard
<div className="c-cb">
  <input id={props.id} type="checkbox" defaultChecked={props.completed} />
  <label className="todo-label" htmlFor={props.id}>
    {props.name}
  </label>
</div>
With these fixes in place, clicking on the labels next to each checkbox will do what we expect – check and uncheck the checkboxes next to those labels.
So far, so good?
We're making good use of React so far, but we could do better! Our code is repetitive. The three lines that render our <Todo /> component are almost identical, with only one difference: the value of each prop.
We can clean up our code with one of JavaScript's core abilities: iteration. To use iteration, we should first re-think our tasks.
Tasks as data
Each of our tasks currently contains three pieces of information: its name, whether it has been checked, and its unique ID. This data translates nicely to an object. Since we have more than one task, an array of objects would work well in representing this data.
In src/main.jsx, declare a new const beneath the final import, but above ReactDOM.createRoot():
jsx
Copy to Clipboard
const DATA = [
  { id: "todo-0", name: "Eat", completed: true },
  { id: "todo-1", name: "Sleep", completed: false },
  { id: "todo-2", name: "Repeat", completed: false },
];
Note: If your text editor has an ESLint plugin, you may see a warning on this DATA const. This warning comes from the ESLint configuration supplied by the Vite template we used, and it doesn't apply to this code. You can safely suppress the warning by adding // eslint-disable-next-line to the line above the DATA const.
Next, we'll pass DATA to <App /> as a prop, called tasks. Update your <App /> component call inside src/main.jsx to read like this:
jsx
Copy to Clipboard
<App tasks={DATA} />
The DATA array is now available inside the App component as props.tasks. You can console.log() it to check, if you'd like.
Note: ALL_CAPS constant names have no special meaning in JavaScript; they're a convention that tells other developers "this data will never change after being defined here".
Rendering with iteration
To render our array of objects, we have to turn each object into a <Todo /> component. JavaScript gives us an array method for transforming items into something else: Array.prototype.map().
Inside App.jsx, create a new const above the App() function's return statement called taskList. Let's start by transforming each task in the props.tasks array into its name. The ?. operator lets us perform optional chaining to check if props.tasks is undefined or null before attempting to create a new array of task names:
jsx
Copy to Clipboard
const taskList = props.tasks?.map((task) => task.name);
Let's try replacing all the children of the <ul> with taskList:
jsx
Copy to Clipboard
<ul
  role="list"
  className="todo-list stack-large stack-exception"
  aria-labelledby="list-heading">
  {taskList}
</ul>
This gets us some of the way towards showing all the components again, but we've got more work to do: the browser currently renders each task's name as plain text. We're missing our HTML structure — the <li> and its checkboxes and buttons!

To fix this, we need to return a <Todo /> component from our map() function — remember that JSX is JavaScript, so we can use it alongside any other, more familiar JavaScript syntax. Let's try the following instead of what we have already:
jsx
Copy to Clipboard
const taskList = props.tasks?.map((task) => <Todo />);
Look again at your app; now our tasks look more like they used to, but they're missing the names of the tasks themselves. Remember that each task we map over contains the id, name, and completed properties we want to pass into our <Todo /> component. If we put that knowledge together, we get code like this:
jsx
Copy to Clipboard
const taskList = props.tasks?.map((task) => (
  <Todo id={task.id} name={task.name} completed={task.completed} />
));
Now the app looks like it did before, and our code is less repetitive.
Unique keys
Now that React is rendering our tasks out of an array, it has to keep track of which one is which in order to render them properly. React tries to do its own guesswork to keep track of things, but we can help it out by passing a key prop to our <Todo /> components. key is a special prop that's managed by React – you cannot use the word key for any other purpose.
Because keys should be unique, we're going to re-use the id of each task object as its key. Update your taskList constant like so:
jsx
Copy to Clipboard
const taskList = props.tasks?.map((task) => (
  <Todo
    id={task.id}
    name={task.name}
    completed={task.completed}
    key={task.id}
  />
));
You should always pass a unique key to anything you render with iteration. Nothing obvious will change in your browser, but if you do not use unique keys, React will log warnings to your console and your app may behave strangely!
Componentizing the rest of the app
Now that we've got our most important component sorted out, we can turn the rest of our app into components. Remembering that components are either obvious pieces of UI, reused pieces of UI, or both, we can make two more components:
<Form />
<FilterButton />
Since we know we need both, we can batch some of the file creation work together in one terminal command. Run this command in your terminal, taking care that you're in the root directory of your app:
bash
Copy to Clipboard
touch src/components/{Form,FilterButton}.jsx
The <Form />
Open components/Form.jsx and do the following:
Declare a Form() function and export it at the end of the file.
Copy the <form> tags and everything between them from inside App.jsx, and paste them inside Form()'s return statement.
Your Form.jsx file should read like this:
jsx
Copy to Clipboard
function Form() {
  return (
    <form>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;
The <FilterButton />
Do the same things you did to create Form.jsx inside FilterButton.jsx, but call the component FilterButton() and copy the HTML for the first button inside <div className="filters btn-group stack-exception"> from App.jsx into the return statement.
The file should read like this:
jsx
Copy to Clipboard
function FilterButton() {
  return (
    <button type="button" className="btn toggle-btn" aria-pressed="true">
      <span className="visually-hidden">Show </span>
      <span>all </span>
      <span className="visually-hidden"> tasks</span>
    </button>
  );
}

export default FilterButton;
Note: You might notice that we are making the same mistake here as we first made for the <Todo /> component, in that each button will be the same. That's fine! We're going to fix up this component later on, in Back to the filter buttons.
Importing all our components
Let's make use of our new components. Add some more import statements to the top of App.jsx and reference the components we've just made. Then, update the return statement of App() so that it renders our components.
When you're done, App.jsx will read like this:
jsx
Copy to Clipboard
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";

function App(props) {
  const taskList = props.tasks?.map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
    />
  ));
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form />
      <div className="filters btn-group stack-exception">
        <FilterButton />
        <FilterButton />
        <FilterButton />
      </div>
      <h2 id="list-heading">3 tasks remaining</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;
With this in place, your React app should render basically the same as it did before, but using your shiny new components.
Summary
And that's it for this article — we've gone into depth on how to break up your app nicely into components and render them efficiently. Next we'll look at handling events in React, and start adding some interactivity.
Previous

React interactivity: Events and state
Previous


Overview: JavaScript frameworks and libraries


Next


With our component plan worked out, it's now time to start updating our app from a completely static UI to one that actually allows us to interact and change things. In this article we'll do this, digging into events and state along the way, and ending up with an app in which we can successfully add and delete tasks, and toggle tasks as completed.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages, and the terminal/command line.
Learning outcomes:
Handling events and state in React, and using those to start making the case study app interactive.


Handling events
If you've only written vanilla JavaScript before now, you might be used to having a separate JavaScript file in which you query for some DOM nodes and attach listeners to them. For example, an HTML file might have a button in it, like this:
html
Copy to Clipboard
<button type="button">Say hi!</button>
And a JavaScript file might have some code like this:
js
Copy to Clipboard
const btn = document.querySelector("button");

btn.addEventListener("click", () => {
  alert("hi!");
});
In JSX, the code that describes the UI lives right alongside our event listeners:
jsx
Copy to Clipboard
<button type="button" onClick={() => alert("hi!")}>
  Say hi!
</button>
In this example, we're adding an onClick attribute to the <button> element. The value of that attribute is a function that triggers an alert. This may seem counter to best practice advice about not writing event listeners in HTML, but remember: JSX is not HTML.
The onClick attribute has special meaning here: it tells React to run a given function when the user clicks on the button. There are a couple of other things to note:
The camel-cased nature of onClick is important — JSX will not recognize onclick (again, it is already used in JavaScript for a specific purpose, which is related but different — standard onclick handler properties).
All browser events follow this format in JSX – on, followed by the name of the event.
Let's apply this to our app, starting in the Form.jsx component.
Handling form submission
At the top of the Form() component function (i.e., just below the function Form() { line), create a function named handleSubmit(). This function should prevent the default behavior of the submit event. After that, it should trigger an alert(), which can say whatever you'd like. It should end up looking something like this:
jsx
Copy to Clipboard
function handleSubmit(event) {
  event.preventDefault();
  alert("Hello, world!");
}
To use this function, add an onSubmit attribute to the <form> element, and set its value to the handleSubmit function:
jsx
Copy to Clipboard
<form onSubmit={handleSubmit}>{/* … */}</form>
Now if you head back to your browser and click on the "Add" button, your browser will show you an alert dialog with the words "Hello, world!" — or whatever you chose to write there.
Callback props
In React applications, interactivity is rarely confined to just one component: events that happen in one component will affect other parts of the app. When we start giving ourselves the power to make new tasks, things that happen in the <Form /> component will affect the list rendered in <App />.
We want our handleSubmit() function to ultimately help us create a new task, so we need a way to pass information from <Form /> to <App />. We can't pass data from child to parent in the same way as we pass data from parent to child using standard props. Instead, we can write a function in <App /> that will expect some data from our form as an input, then pass that function to <Form /> as a prop. This function-as-a-prop is called a callback prop. Once we have our callback prop, we can call it inside <Form /> to send the right data to <App />.
Handling form submission via callbacks
Inside the App() function in App.jsx, create a function named addTask() which has a single parameter of name:
jsx
Copy to Clipboard
function addTask(name) {
  alert(name);
}
Next, pass addTask() into <Form /> as a prop. The prop can have whatever name you want, but pick a name you'll understand later. Something like addTask works, because it matches the name of the function as well as what the function will do. Your <Form /> component call should be updated as follows:
jsx
Copy to Clipboard
<Form addTask={addTask} />
To use this prop, we must change the signature of the Form() function in Form.jsx so that it accepts props as a parameter:
jsx
Copy to Clipboard
function Form(props) {
  // …
}
Finally, we can use this prop inside the handleSubmit() function in your <Form /> component! Update it as follows:
jsx
Copy to Clipboard
function handleSubmit(event) {
  event.preventDefault();
  props.addTask("Say hello!");
}
Clicking on the "Add" button in your browser will prove that the addTask() callback function works, but it'd be nice if we could get the alert to show us what we're typing in our input field! This is what we'll do next.
Aside: a note on naming conventions
We passed the addTask() function into the <Form /> component as the prop addTask so that the relationship between the addTask() function and the addTask prop would remain as clear as possible. Keep in mind, though, that prop names do not need to be anything in particular. We could have passed addTask() into <Form /> under any other name, such as this:
diff
Copy to Clipboard
- <Form addTask={addTask} />
+ <Form onSubmit={addTask} />
This would make the addTask() function available to the <Form /> component as the prop onSubmit. That prop could be used in Form.jsx like this:
diff
Copy to Clipboard
function handleSubmit(event) {
 event.preventDefault();
- props.addTask("Say hello!");
+ props.onSubmit("Say hello!");
}
Here, the on prefix tells us that the prop is a callback function; Submit is our clue that a submit event will trigger this function.
While callback props often match the names of familiar event handlers, like onSubmit or onClick, they can be named just about anything that helps make their meaning clear. A hypothetical <Menu /> component might include a callback function that runs when the menu is opened, as well as a separate callback function that runs when it's closed:
jsx
Copy to Clipboard
<Menu onOpen={() => console.log("Hi!")} onClose={() => console.log("Bye!")} />
This on* naming convention is very common in the React ecosystem, so keep it in mind as you continue your learning. For the sake of clarity, we're going to stick with addTask and similar prop names for the rest of this tutorial. If you changed any prop names while reading this section, be sure to change them back before continuing!
Persisting and changing data with state
So far, we've used props to pass data through our components and this has served us just fine. Now that we're dealing with interactivity, however, we need the ability to create new data, retain it, and update it later. Props are not the right tool for this job because they are immutable — a component cannot change or create its own props.
This is where state comes in. If we think of props as a way to communicate between components, we can think of state as a way to give components "memory" – information they can hold onto and update as needed.
React provides a special function for introducing state to a component, aptly named useState().
Note: useState() is part of a special category of functions called hooks, each of which can be used to add new functionality to a component. We'll learn about other hooks later on.
To use useState(), we need to import it from the React module. Add the following line to the top of your Form.jsx file, above the Form() function definition:
jsx
Copy to Clipboard
import { useState } from "react";
useState() takes a single argument that determines the initial value of the state. This argument can be a string, a number, an array, an object, or any other JavaScript data type. useState() returns an array containing two items. The first item is the current value of the state; the second item is a function that can be used to update the state.
Let's create a name state. Write the following above your handleSubmit() function, inside Form():
jsx
Copy to Clipboard
const [name, setName] = useState("Learn React");
Several things are happening in this line of code:
We are defining a name constant with the value "Learn React".
We are defining a function whose job it is to modify name, called setName().
useState() returns these two things in an array, so we are using array destructuring to capture them both in separate variables.
Reading state
You can see the name state in action right away. Add a value attribute to the form's input, and set its value to name. Your browser will render "Learn React" inside the input.
jsx
Copy to Clipboard
<input
  type="text"
  id="new-todo-input"
  className="input input__lg"
  name="text"
  autoComplete="off"
  value={name}
/>
Change "Learn React" to an empty string once you're done; this is what we want for our initial state:
jsx
Copy to Clipboard
const [name, setName] = useState("");
Reading user input
Before we can change the value of name, we need to capture a user's input as they type. For this, we can listen to the onChange event. Let's write a handleChange() function, and listen for it on the <input /> element.
jsx
Copy to Clipboard
// near the top of the `Form` component
function handleChange() {
  console.log("Typing!");
}

// …

// Down in the return statement
<input
  type="text"
  id="new-todo-input"
  className="input input__lg"
  name="text"
  autoComplete="off"
  value={name}
  onChange={handleChange}
/>;
Currently, our input's value will not change when you try to enter text into it, but your browser will log the word "Typing!" to the JavaScript console, so we know our event listener is attached to the input.
To read the user's keystrokes, we must access the input's value property. We can do this by reading the event object that handleChange() receives when it's called. event, in turn, has a target property, which represents the element that fired the change event. That's our input. So, event.target.value is the text inside the input.
You can console.log() this value to see it in your browser's console. Try updating the handleChange() function as follows, and typing in the input to see the result in your console:
jsx
Copy to Clipboard
function handleChange(event) {
  console.log(event.target.value);
}
Updating state
Logging isn't enough — we want to actually store what the user types and render it in the input! Change your console.log() call to setName(), as shown below:
jsx
Copy to Clipboard
function handleChange(event) {
  setName(event.target.value);
}
Now when you type in the input, your keystrokes will fill out the input, as you might expect.
We have one more step: we need to change our handleSubmit() function so that it calls props.addTask with name as an argument. Remember our callback prop? This will serve to send the task back to the App component, so we can add it to our list of tasks at some later date. As a matter of good practice, you should clear the input after your form is submitted, so we'll call setName() again with an empty string to do so:
jsx
Copy to Clipboard
function handleSubmit(event) {
  event.preventDefault();
  props.addTask(name);
  setName("");
}
At last, you can type something into the input field in your browser and click Add — whatever you typed will appear in an alert dialog.
Your Form.jsx file should now read like this:
jsx
Copy to Clipboard
import { useState } from "react";

function Form(props) {
  const [name, setName] = useState("");

  function handleChange(event) {
    setName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.addTask(name);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;
Note: You'll notice that you are able to submit empty tasks by just pressing the Add button without entering a task name. Can you think of a way to prevent this? As a hint, you probably need to add some kind of check into the handleSubmit() function.
Putting it all together: Adding a task
Now that we've practiced with events, callback props, and hooks, we're ready to write functionality that will allow a user to add a new task from their browser.
Tasks as state
We need to import useState into App.jsx so that we can store our tasks in state. Add the following to the top of your App.jsx file:
jsx
Copy to Clipboard
import { useState } from "react";
We want to pass props.tasks into the useState() hook – this will preserve its initial state. Add the following right at the top of your App() function definition:
jsx
Copy to Clipboard
const [tasks, setTasks] = useState(props.tasks);
Now, we can change our taskList mapping so that it is the result of mapping tasks, instead of props.tasks. Your taskList constant declaration should now look like so:
jsx
Copy to Clipboard
const taskList = tasks?.map((task) => (
  <Todo
    id={task.id}
    name={task.name}
    completed={task.completed}
    key={task.id}
  />
));
Adding a task
We've now got a setTasks hook that we can use in our addTask() function to update our list of tasks. There's one problem however: we can't just pass the name argument of addTask() into setTasks, because tasks is an array of objects and name is a string. If we tried to do this, the array would be replaced with the string.
First of all, we need to put name into an object that has the same structure as our existing tasks. Inside of the addTask() function, we will make a newTask object to add to the array.
We then need to make a new array with this new task added to it and then update the state of the tasks data to this new state. To do this, we can use spread syntax to copy the existing array, and add our object at the end. We then pass this array into setTasks() to update the state.
Putting that all together, your addTask() function should read like so:
jsx
Copy to Clipboard
function addTask(name) {
  const newTask = { id: "id", name, completed: false };
  setTasks([...tasks, newTask]);
}
Now you can use the browser to add a task to our data! Type anything into the form and click "Add" (or press the Enter key) and you'll see your new todo item appear in the UI!
However, we have another problem: our addTask() function is giving each task the same id. This is bad for accessibility, and makes it impossible for React to tell future tasks apart with the key prop. In fact, React will give you a warning in your DevTools console — "Warning: Encountered two children with the same key…"
We need to fix this. Making unique identifiers is a hard problem – one for which the JavaScript community has written some helpful libraries. We'll use nanoid because it's tiny and it works.
Make sure you're in the root directory of your application and run the following terminal command:
bash
Copy to Clipboard
npm install nanoid
Note: If you're using yarn, you'll need the following instead: yarn add nanoid.
Now we can use nanoid to create unique IDs for our new tasks. First of all, import it by including the following line at the top of App.jsx:
jsx
Copy to Clipboard
import { nanoid } from "nanoid";
Now let's update addTask() so that each task ID becomes a prefix todo- plus a unique string generated by nanoid. Update your newTask constant declaration to this:
jsx
Copy to Clipboard
const newTask = { id: `todo-${nanoid()}`, name, completed: false };
Save everything, and try your app again — now you can add tasks without getting that warning about duplicate IDs.
Detour: counting tasks
Now that we can add new tasks, you may notice a problem: our heading reads "3 tasks remaining" no matter how many tasks we have! We can fix this by counting the length of taskList and changing the text of our heading accordingly.
Add this inside your App() definition, before the return statement:
jsx
Copy to Clipboard
const headingText = `${taskList.length} tasks remaining`;
This is almost right, except that if our list ever contains a single task, the heading will still use the word "tasks". We can make this a variable, too. Update the code you just added as follows:
jsx
Copy to Clipboard
const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
const headingText = `${taskList.length} ${tasksNoun} remaining`;
Now you can replace the list heading's text content with the headingText variable. Update your <h2> like so:
jsx
Copy to Clipboard
<h2 id="list-heading">{headingText}</h2>
Save the file, go back to your browser, and try adding some tasks: the count should now update as expected.
Completing a task
You might notice that, when you click on a checkbox, it checks and unchecks appropriately. As a feature of HTML, the browser knows how to remember which checkbox inputs are checked or unchecked without our help. This feature hides a problem, however: toggling a checkbox doesn't change the state in our React application. This means that the browser and our app are now out-of-sync. We have to write our own code to put the browser back in sync with our app.
Proving the bug
Before we fix the problem, let's observe it happening.
We'll start by writing a toggleTaskCompleted() function in our App() component. This function will have an id parameter, but we're not going to use it yet. For now, we'll log the first task in the array to the console – we're going to inspect what happens when we check or uncheck it in our browser:
Add this just above your taskList constant declaration:
jsx
Copy to Clipboard
function toggleTaskCompleted(id) {
  console.log(tasks[0]);
}
Next, we'll add toggleTaskCompleted to the props of each <Todo /> component rendered inside our taskList; update it like so:
jsx
Copy to Clipboard
const taskList = tasks.map((task) => (
  <Todo
    id={task.id}
    name={task.name}
    completed={task.completed}
    key={task.id}
    toggleTaskCompleted={toggleTaskCompleted}
  />
));
Next, go over to your Todo.jsx component and add an onChange handler to your <input /> element, which should use an anonymous function to call props.toggleTaskCompleted() with a parameter of props.id. The <input /> should now look like this:
jsx
Copy to Clipboard
<input
  id={props.id}
  type="checkbox"
  defaultChecked={props.completed}
  onChange={() => props.toggleTaskCompleted(props.id)}
/>
Save everything and return to your browser and notice that our first task, Eat, is checked. Open your JavaScript console, then click on the checkbox next to Eat. It unchecks, as we expect. Your JavaScript console, however, will log something like this:
Object { id: "task-0", name: "Eat", completed: true }
The checkbox unchecks in the browser, but our console tells us that Eat is still completed. We will fix that next!
Synchronizing the browser with our data
Let's revisit our toggleTaskCompleted() function in App.jsx. We want it to change the completed property of only the task that was toggled, and leave all the others alone. To do this, we'll map() over the task list and just change the one we completed.
Update your toggleTaskCompleted() function to the following:
jsx
Copy to Clipboard
function toggleTaskCompleted(id) {
  const updatedTasks = tasks.map((task) => {
    // if this task has the same ID as the edited task
    if (id === task.id) {
      // use object spread to make a new object
      // whose `completed` prop has been inverted
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  setTasks(updatedTasks);
}
Here, we define an updatedTasks constant that maps over the original tasks array. If the task's id property matches the id provided to the function, we use object spread syntax to create a new object, and toggle the completed property of that object before returning it. If it doesn't match, we return the original object.
Then we call setTasks() with this new array in order to update our state.
Deleting a task
Deleting a task will follow a similar pattern to toggling its completed state: we need to define a function for updating our state, then pass that function into <Todo /> as a prop and call it when the right event happens.
The deleteTask callback prop
Here we'll start by writing a deleteTask() function in your App component. Like toggleTaskCompleted(), this function will take an id parameter, and we will log that id to the console to start with. Add the following below toggleTaskCompleted():
jsx
Copy to Clipboard
function deleteTask(id) {
  console.log(id);
}
Next, add another callback prop to our array of <Todo /> components:
jsx
Copy to Clipboard
const taskList = tasks.map((task) => (
  <Todo
    id={task.id}
    name={task.name}
    completed={task.completed}
    key={task.id}
    toggleTaskCompleted={toggleTaskCompleted}
    deleteTask={deleteTask}
  />
));
In Todo.jsx, we want to call props.deleteTask() when the "Delete" button is pressed. deleteTask() needs to know the ID of the task that called it, so it can delete the correct task from the state.
Update the "Delete" button inside Todo.jsx, like so:
jsx
Copy to Clipboard
<button
  type="button"
  className="btn btn__danger"
  onClick={() => props.deleteTask(props.id)}>
  Delete <span className="visually-hidden">{props.name}</span>
</button>
Now when you click on any of the "Delete" buttons in the app, your browser console should log the ID of the related task.
At this point, your Todo.jsx file should look like this:
jsx
Copy to Clipboard
function Todo(props) {
  return (
    <li className="todo stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
        </label>
      </div>
      <div className="btn-group">
        <button type="button" className="btn">
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}>
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </li>
  );
}

export default Todo;
Deleting tasks from state and UI
Now that we know deleteTask() is invoked correctly, we can call our setTasks() hook in deleteTask() to actually delete that task from the app's state as well as visually in the app UI. Since setTasks() expects an array as an argument, we should provide it with a new array that copies the existing tasks, excluding the task whose ID matches the one passed into deleteTask().
This is a perfect opportunity to use Array.prototype.filter(). We can test each task, and exclude a task from the new array if its id prop matches the id argument passed into deleteTask().
Update the deleteTask() function inside your App.jsx file as follows:
jsx
Copy to Clipboard
function deleteTask(id) {
  const remainingTasks = tasks.filter((task) => id !== task.id);
  setTasks(remainingTasks);
}
Try your app out again. Now you should be able to delete a task from your app!
At this point, your App.jsx file should look like this:
jsx
Copy to Clipboard
import { useState } from "react";
import { nanoid } from "nanoid";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";

function App(props) {
  function addTask(name) {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  const [tasks, setTasks] = useState(props.tasks);
  const taskList = tasks?.map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
    />
  ));

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        <FilterButton />
        <FilterButton />
        <FilterButton />
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;
Summary
That's enough for one article. Here we've given you the lowdown on how React deals with events and handles state, and implemented functionality to add tasks, delete tasks, and toggle tasks as completed. We are nearly there. In the next article we'll implement functionality to edit existing tasks and filter the list of tasks between all, completed, and incomplete tasks. We'll look at conditional UI rendering along the way.
Previous




React interactivity: Editing, filtering, conditional rendering
Previous


Overview: JavaScript frameworks and libraries


Next


As we near the end of our React journey (for now at least), we'll add the finishing touches to the main areas of functionality in our Todo list app. This includes allowing you to edit existing tasks, and filtering the list of tasks between all, completed, and incomplete tasks. We'll look at conditional UI rendering along the way.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages, and the terminal/command line.
Learning outcomes:
Conditional rendering in React, and implementing list filtering and an editing UI in our app.

Editing the name of a task
We don't have a user interface for editing the name of a task yet. We'll get to that in a moment. To start with, we can at least implement an editTask() function in App.jsx. It'll be similar to deleteTask() because it'll take an id to find its target object, but it'll also take a newName property containing the name to update the task to. We'll use Array.prototype.map() instead of Array.prototype.filter() because we want to return a new array with some changes, instead of deleting something from the array.
Add the editTask() function inside your <App /> component, in the same place as the other functions:
jsx
Copy to Clipboard
function editTask(id, newName) {
  const editedTaskList = tasks.map((task) => {
    // if this task has the same ID as the edited task
    if (id === task.id) {
      // Copy the task and update its name
      return { ...task, name: newName };
    }
    // Return the original task if it's not the edited task
    return task;
  });
  setTasks(editedTaskList);
}

Pass editTask into our <Todo /> components as a prop in the same way we did with deleteTask:
jsx
Copy to Clipboard
const taskList = tasks.map((task) => (
  <Todo
    id={task.id}
    name={task.name}
    completed={task.completed}
    key={task.id}
    toggleTaskCompleted={toggleTaskCompleted}
    deleteTask={deleteTask}
    editTask={editTask}
  />
));

Now open Todo.jsx. We're going to do some refactoring.
A UI for editing
In order to allow users to edit a task, we have to provide a user interface for them to do so. First, import useState into the <Todo /> component like we did before with the <App /> component:
jsx
Copy to Clipboard
import { useState } from "react";

We'll use this to set an isEditing state with a default value of false. Add the following line just inside the top of your <Todo /> component definition:
jsx
Copy to Clipboard
const [isEditing, setEditing] = useState(false);

Next, we're going to rethink the <Todo /> component. From now on, we want it to display one of two possible "templates", rather than the single template it has used so far:
The "view" template, when we are just viewing a todo; this is what we've used in the tutorial thus far.
The "editing" template, when we are editing a todo. We're about to create this.
Copy this block of code into the Todo() function, beneath your useState() hook but above the return statement:
jsx
Copy to Clipboard
const editingTemplate = (
  <form className="stack-small">
    <div className="form-group">
      <label className="todo-label" htmlFor={props.id}>
        New name for {props.name}
      </label>
      <input id={props.id} className="todo-text" type="text" />
    </div>
    <div className="btn-group">
      <button type="button" className="btn todo-cancel">
        Cancel
        <span className="visually-hidden">renaming {props.name}</span>
      </button>
      <button type="submit" className="btn btn__primary todo-edit">
        Save
        <span className="visually-hidden">new name for {props.name}</span>
      </button>
    </div>
  </form>
);
const viewTemplate = (
  <div className="stack-small">
    <div className="c-cb">
      <input
        id={props.id}
        type="checkbox"
        defaultChecked={props.completed}
        onChange={() => props.toggleTaskCompleted(props.id)}
      />
      <label className="todo-label" htmlFor={props.id}>
        {props.name}
      </label>
    </div>
    <div className="btn-group">
      <button type="button" className="btn">
        Edit <span className="visually-hidden">{props.name}</span>
      </button>
      <button
        type="button"
        className="btn btn__danger"
        onClick={() => props.deleteTask(props.id)}>
        Delete <span className="visually-hidden">{props.name}</span>
      </button>
    </div>
  </div>
);

We've now got the two different template structures — "edit" and "view" — defined inside two separate constants. This means that the return statement of <Todo /> is now repetitious — it also contains a definition of the "view" template. We can clean this up by using conditional rendering to determine which template the component returns, and is therefore rendered in the UI.
Conditional rendering
In JSX, we can use a condition to change what is rendered by the browser. To write a condition in JSX, we can use a ternary operator.
In the case of our <Todo /> component, our condition is "Is this task being edited?" Change the return statement inside Todo() so that it reads like so:
jsx
Copy to Clipboard
return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;

Your browser should render all your tasks just like before. To see the editing template, you will have to change the default isEditing state from false to true in your code for now; we will look at making the edit button toggle this in the next section!
Toggling the <Todo /> templates
At long last, we are ready to make our final core feature interactive. To start with, we want to call setEditing() with a value of true when a user presses the "Edit" button in our viewTemplate, so that we can switch templates.
Update the "Edit" button in the viewTemplate like so:
jsx
Copy to Clipboard
<button type="button" className="btn" onClick={() => setEditing(true)}>
  Edit <span className="visually-hidden">{props.name}</span>
</button>

Now we'll add the same onClick handler to the "Cancel" button in the editingTemplate, but this time we'll set isEditing to false so that it switches us back to the view template.
Update the "Cancel" button in the editingTemplate like so:
jsx
Copy to Clipboard
<button
  type="button"
  className="btn todo-cancel"
  onClick={() => setEditing(false)}>
  Cancel
  <span className="visually-hidden">renaming {props.name}</span>
</button>

With this code in place, you should be able to press the "Edit" and "Cancel" buttons in your todo items to toggle between templates.


The next step is to actually make the editing functionality work.
Editing from the UI
Much of what we're about to do will mirror the work we did in Form.jsx: as the user types in our new input field, we need to track the text they enter; once they submit the form, we need to use a callback prop to update our state with the new name of the task.
We'll start by making a new hook for storing and setting the new name. Still in Todo.jsx, put the following underneath the existing hook:
jsx
Copy to Clipboard
const [newName, setNewName] = useState("");

Next, create a handleChange() function that will set the new name; put this underneath the hooks but before the templates:
jsx
Copy to Clipboard
function handleChange(e) {
  setNewName(e.target.value);
}

Now we'll update our editingTemplate's <input /> field, setting a value attribute of newName, and binding our handleChange() function to its onChange event. Update it as follows:
jsx
Copy to Clipboard
<input
  id={props.id}
  className="todo-text"
  type="text"
  value={newName}
  onChange={handleChange}
/>

Finally, we need to create a function to handle the edit form's onSubmit event. Add the following just below handleChange():
jsx
Copy to Clipboard
function handleSubmit(e) {
  e.preventDefault();
  props.editTask(props.id, newName);
  setNewName("");
  setEditing(false);
}

Remember that our editTask() callback prop needs the ID of the task we're editing as well as its new name.
Bind this function to the form's submit event by adding the following onSubmit handler to the editingTemplate's <form>:
jsx
Copy to Clipboard
<form className="stack-small" onSubmit={handleSubmit}>
  {/* … */}
</form>

You should now be able to edit a task in your browser. At this point, your Todo.jsx file should look like this:
jsx
Copy to Clipboard
function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  function handleChange(e) {
    setNewName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.editTask(props.id, newName);
    setNewName("");
    setEditing(false);
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}>
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
        </label>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => {
            setEditing(true);
          }}>
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}>
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}

export default Todo;

Back to the filter buttons
Now that our main features are complete, we can think about our filter buttons. Currently, they repeat the "All" label, and they have no functionality! We will be reapplying some skills we used in our <Todo /> component to:
Create a hook for storing the active filter.
Render an array of <FilterButton /> elements that allow users to change the active filter between all, completed, and incomplete.
Adding a filter hook
Add a new hook to your App() function that reads and sets a filter. We want the default filter to be All because all of our tasks should be shown initially:
jsx
Copy to Clipboard
const [filter, setFilter] = useState("All");

Defining our filters
Our goal right now is two-fold:
Each filter should have a unique name.
Each filter should have a unique behavior.
A JavaScript object would be a great way to relate names to behaviors: each key is the name of a filter; each property is the behavior associated with that name.
At the top of App.jsx, beneath our imports but above our App() function, let's add an object called FILTER_MAP:
jsx
Copy to Clipboard
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

The values of FILTER_MAP are functions that we will use to filter the tasks data array:
The All filter shows all tasks, so we return true for all tasks.
The Active filter shows tasks whose completed prop is false.
The Completed filter shows tasks whose completed prop is true.
Beneath our previous addition, add the following — here we are using the Object.keys() method to collect an array of FILTER_NAMES:
jsx
Copy to Clipboard
const FILTER_NAMES = Object.keys(FILTER_MAP);

Note: We are defining these constants outside our App() function because if they were defined inside it, they would be recalculated every time the <App /> component re-renders, and we don't want that. This information will never change no matter what our application does.
Rendering the filters
Now that we have the FILTER_NAMES array, we can use it to render all three of our filters. Inside the App() function we can create a constant called filterList, which we will use to map over our array of names and return a <FilterButton /> component. Remember, we need keys here, too.
Add the following underneath your taskList constant declaration:
jsx
Copy to Clipboard
const filterList = FILTER_NAMES.map((name) => (
  <FilterButton key={name} name={name} />
));

Now we'll replace the three repeated <FilterButton />s in App.jsx with this filterList. Replace the following:
jsx
Copy to Clipboard
<div className="filters btn-group stack-exception">
  <FilterButton />
  <FilterButton />
  <FilterButton />
</div>

With this:
jsx
Copy to Clipboard
<div className="filters btn-group stack-exception">{filterList}</div>

This won't work yet. We've got a bit more work to do first.
Interactive filters
To make our filter buttons interactive, we should consider what props they need to utilize.
We know that the <FilterButton /> should report whether it is currently pressed, and it should be pressed if its name matches the current value of our filter state.
We know that the <FilterButton /> needs a callback to set the active filter. We can make direct use of our setFilter hook.
Update your filterList constant as follows:
jsx
Copy to Clipboard
const filterList = FILTER_NAMES.map((name) => (
  <FilterButton
    key={name}
    name={name}
    isPressed={name === filter}
    setFilter={setFilter}
  />
));

In the same way as we did earlier with our <Todo /> component, we now have to update FilterButton.jsx to utilize the props we have given it. Do each of the following, and remember to use curly braces to read these variables!
Replace all with {props.name}.
Set the value of aria-pressed to {props.isPressed}.
Add an onClick handler that calls props.setFilter() with the filter's name.
With all of that done, your FilterButton.jsx file should read like this:
jsx
Copy to Clipboard
function FilterButton(props) {
  return (
    <button
      type="button"
      className="btn toggle-btn"
      aria-pressed={props.isPressed}
      onClick={() => props.setFilter(props.name)}>
      <span className="visually-hidden">Show </span>
      <span>{props.name}</span>
      <span className="visually-hidden"> tasks</span>
    </button>
  );
}

export default FilterButton;

Visit your browser again. You should see that the different buttons have been given their respective names. When you press a filter button, you should see its text take on a new outline — this tells you it has been selected. And if you look at your DevTool's Page Inspector while clicking the buttons, you'll see the aria-pressed attribute values change accordingly.

However, our buttons still don't actually filter the todos in the UI! Let's finish this off.
Filtering tasks in the UI
Right now, our taskList constant in App() maps over the tasks state and returns a new <Todo /> component for all of them. This is not what we want! A task should only render if it is included in the results of applying the selected filter. Before we map over the tasks state, we should filter it (with Array.prototype.filter()) to eliminate objects we don't want to render.
Update your taskList like so:
jsx
Copy to Clipboard
const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

In order to decide which callback function to use in Array.prototype.filter(), we access the value in FILTER_MAP that corresponds to the key of our filter state. When filter is All, for example, FILTER_MAP[filter] will evaluate to () => true.
Choosing a filter in your browser will now remove the tasks that do not meet its criteria. The count in the heading above the list will also change to reflect the list!

Summary
So that's it — our app is now functionally complete. However, now that we've implemented all of our features, we can make a few improvements to ensure that a wider range of users can use our app. Our next article rounds things off for our React tutorials by looking at including focus management in React, which can improve usability and reduce confusion for both keyboard-only and screen reader users.

Accessibility in React
Previous


Overview: JavaScript frameworks and libraries


Next


In our final tutorial article, we'll focus on (pun intended) accessibility, including focus management in React, which can improve usability and reduce confusion for both keyboard-only and screen reader users.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages, and the terminal/command line.
Learning outcomes:
Implementing keyboard accessibility in React.

Including keyboard users
At this point, we've implemented all the features we set out to implement. Users can add a new task, check and uncheck tasks, delete tasks, or edit task names. Also, they can filter their task list by all, active, or completed tasks.
Or, at least, they can do all of these things with a mouse. Unfortunately, these features are not very accessible to keyboard-only users. Let's explore this now.
Exploring the keyboard usability problem
Start by clicking on the input at the top of our app, as if you're going to add a new task. You'll see a thick, dashed outline around that input. This outline is your visual indicator that the browser is currently focused on this element. Press the Tab key, and you will see the outline appear around the "Add" button beneath the input. This shows you that the browser's focus has moved.
Press Tab a few more times, and you will see this dashed focus indicator move between each of the filter buttons. Keep going until the focus indicator is around the first "Edit" button. Press Enter.
The <Todo /> component will switch templates, as we designed, and you'll see a form that lets us edit the name of the task.
But where did our focus indicator go?
When we switch between templates in our <Todo /> component, we completely remove the elements from the old template and replace them with the elements from the new template. That means the element that we were focused on no longer exists, so there's no visual cue as to where the browser's focus is. This could confuse a wide variety of users — particularly users who rely on the keyboard, or users who use assistive technology.
To improve the experience for keyboard and assistive technology users, we should manage the browser's focus ourselves.
Aside: a note on our focus indicator
If you click the "All", "Active", or "Completed" filter buttons with your mouse, you won't see a visible focus indicator, but you will do if you move between them with the Tab key on your keyboard. Don't worry — your code isn't broken!
Our CSS file uses the :focus-visible pseudo-class to provide custom styling for the focus indicator, and the browser uses a set of internal rules to determine when to show it to the user. Generally, the browser will show a focus indicator in response to keyboard input, and might show it in response to mouse input. <button> elements don't show a focus indicator in response to mouse input, while <input> elements do.
The behavior of :focus-visible is more selective than the older :focus pseudo-class, with which you might be more familiar. :focus shows a focus indicator in many more situations, and you can use it instead of or in combination with :focus-visible if you prefer.
Focusing between templates
When a user changes the <Todo /> template from viewing to editing, we should focus on the <input> used to rename it; when they change back from editing to viewing, we should move focus back to the "Edit" button.
Targeting our elements
Up to this point, we've been writing JSX components and letting React build the resulting DOM behind the scenes. Most of the time, we don't need to target specific elements in the DOM because we can use React's state and props to control what gets rendered. To manage focus, however, we do need to be able to target specific DOM elements.
This is where the useRef() hook comes in.
First, change the import statement at the top of Todo.jsx so that it includes useRef:
jsx
Copy to Clipboard
import { useRef, useState } from "react";

useRef() creates an object with a single property: current. Refs can store any values we want them to, and we can look up those values later. We can even store references to DOM elements, which is exactly what we're going to do here.
Next, create two new constants beneath the useState() hooks in your Todo() function. Each should be a ref – one for the "Edit" button in the view template and one for the edit field in the editing template.
jsx
Copy to Clipboard
const editFieldRef = useRef(null);
const editButtonRef = useRef(null);

These refs have a default value of null to make it clear that they'll be empty until they're attached to their DOM elements. To attach them to their elements, we'll add the special ref attribute to each element's JSX, and set the values of those attributes to the appropriately named ref objects.
Update the <input> in your editing template so that it reads like this:
jsx
Copy to Clipboard
<input
  id={props.id}
  className="todo-text"
  type="text"
  value={newName}
  onChange={handleChange}
  ref={editFieldRef}
/>

Update the "Edit" button in your view template so that it reads like this:
jsx
Copy to Clipboard
<button
  type="button"
  className="btn"
  onClick={() => setEditing(true)}
  ref={editButtonRef}>
  Edit <span className="visually-hidden">{props.name}</span>
</button>

Doing this will populate our editFieldRef and editButtonRef with references to the DOM elements they're attached to, but only after React has rendered the component. Test that out for yourself: add the following line somewhere in the body of your Todo() function, below where editButtonRef is initialized:
jsx
Copy to Clipboard
console.log(editButtonRef.current);

You'll see that the value of editButtonRef.current is null when the component first renders, but if you click an "Edit" button, it will log the <button> element to the console. This is because the ref is populated only after the component renders, and clicking the "Edit" button causes the component to re-render. Be sure to delete this log before moving on.
Note: Your logs will appear 6 times because we have 3 instances of <Todo /> in our app and React renders our components twice in development.
We're getting closer! To take advantage of our newly referenced elements, we need to use another React hook: useEffect().
Implementing useEffect()
useEffect() is so named because it runs any side-effects that we'd like to add to the render process but which can't be run inside the main function body. useEffect() runs right after a component renders, meaning the DOM elements we referenced in the previous section will be available for us to use.
Change the import statement of Todo.jsx again to add useEffect:
jsx
Copy to Clipboard
import { useEffect, useRef, useState } from "react";

useEffect() takes a function as an argument; this function is executed after the component renders. To demonstrate this, put the following useEffect() call just above the return statement in the body of Todo(), and pass a function into it that logs the words "side effect" to your console:
jsx
Copy to Clipboard
useEffect(() => {
  console.log("side effect");
});

To illustrate the difference between the main render process and code run inside useEffect(), add another log – put this one below the previous addition:
jsx
Copy to Clipboard
console.log("main render");

Now, open the app in your browser. You should see both messages in your console, with each one repeating multiple times. Note how "main render" logged first, and "side effect" logged second, even though the "side effect" log appears first in the code.
main render                                     Todo.jsx
side effect                                     Todo.jsx

Again, the logs are ordered this way because code inside useEffect() runs after the component renders. This takes some getting used to, just keep it in mind as you move forward. For now, delete console.log("main render") and we'll move on to implementing our focus management.
Focusing on our editing field
Now that we know our useEffect() hook works, we can manage focus with it. As a reminder, we want to focus on the editing field when we switch to the editing template.
Update your existing useEffect() hook so that it reads like this:
jsx
Copy to Clipboard
useEffect(() => {
  if (isEditing) {
    editFieldRef.current.focus();
  }
}, [isEditing]);

These changes make it so that, if isEditing is true, React reads the current value of the editFieldRef and moves browser focus to it. We also pass an array into useEffect() as a second argument. This array is a list of values useEffect() should depend on. With these values included, useEffect() will only run when one of those values changes. We only want to change focus when the value of isEditing changes.
Try it now: use the Tab key to navigate to one of the "Edit" buttons, then press Enter. You should see the <Todo /> component switch to its editing template, and the browser focus indicator should appear around the <input> element!
Moving focus back to the edit button
At first glance, getting React to move focus back to our "Edit" button when the edit is saved or cancelled appears deceptively easy. Surely we could add a condition to our useEffect to focus on the edit button if isEditing is false? Let's try it now — update your useEffect() call like so:
jsx
Copy to Clipboard
useEffect(() => {
  if (isEditing) {
    editFieldRef.current.focus();
  } else {
    editButtonRef.current.focus();
  }
}, [isEditing]);

This kind of works. If you use your keyboard to trigger the "Edit" button (remember: Tab to it and press Enter), you'll see that your focus moves between the Edit <input> and "Edit" button as you start and end an edit. However, you may have noticed a new problem — the "Edit" button in the final <Todo /> component is focused immediately on page load before we even interact with the app!
Our useEffect() hook is behaving exactly as we designed it: it runs as soon as the component renders, sees that isEditing is false, and focuses the "Edit" button. There are three instances of <Todo />, and focus is given to the "Edit" button of the one that renders last.
We need to refactor our approach so that focus changes only when isEditing changes from one value to another.
More robust focus management
To meet our refined criteria, we need to know not just the value of isEditing, but also when that value has changed. To do that, we need to be able to read the previous value of the isEditing constant. Using pseudocode, our logic should be something like this:
jsx
Copy to Clipboard
if (wasNotEditingBefore && isEditingNow) {
  focusOnEditField();
} else if (wasEditingBefore && isNotEditingNow) {
  focusOnEditButton();
}

The React team has discussed ways to get a component's previous state, and provided an example hook we can use for the job.
Enter usePrevious()
Paste the following code near the top of Todo.jsx, above your Todo() function.
jsx
Copy to Clipboard
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

usePrevious() is a custom hook that tracks a value across renders. It:
Uses the useRef() hook to create an empty ref.
Returns the ref's current value to the component that called it.
Calls useEffect() and updates the value stored in ref.current after each rendering of the calling component.
The behavior of useEffect() is key to this functionality. Because ref.current is updated inside a useEffect() call, it's always one step behind whatever value is in the component's main render cycle – hence the name usePrevious().
Using usePrevious()
Now we can define a wasEditing constant to track the previous value of isEditing; this is achieved by calling usePrevious with isEditing as an argument. Add the following inside Todo(), below the useRef lines:
jsx
Copy to Clipboard
const wasEditing = usePrevious(isEditing);

You can see how usePrevious() behaves by adding a console log beneath this line:
jsx
Copy to Clipboard
console.log(wasEditing);

In this log, the current value of wasEditing will always be the previous value of isEditing. Click on the "Edit" and "Cancel" button a few times to watch it change, then delete this log when you're ready to move on.
With this wasEditing constant, we can update our useEffect() hook to implement the pseudocode we discussed before:
jsx
Copy to Clipboard
useEffect(() => {
  if (!wasEditing && isEditing) {
    editFieldRef.current.focus();
  } else if (wasEditing && !isEditing) {
    editButtonRef.current.focus();
  }
}, [wasEditing, isEditing]);

Note that the logic of useEffect() now depends on wasEditing, so we provide it in the array of dependencies.
Try using your keyboard to activate the "Edit" and "Cancel" buttons in the <Todo /> component; you'll see the browser focus indicator move appropriately, without the problem we discussed at the start of this section.
Focusing when the user deletes a task
There's one last keyboard experience gap: when a user deletes a task from the list, the focus vanishes. We're going to follow a pattern similar to our previous changes: we'll make a new ref, and utilize our usePrevious() hook, so that we can focus on the list heading whenever a user deletes a task.
Why the list heading?
Sometimes, the place we want to send our focus to is obvious: when we toggled our <Todo /> templates, we had an origin point to "go back" to — the "Edit" button. In this case however, since we're completely removing elements from the DOM, we have no place to go back to. The next best thing is an intuitive location somewhere nearby. The list heading is our best choice because it's close to the list item the user will delete, and focusing on it will tell the user how many tasks are left.
Creating our ref
Import the useRef() and useEffect() hooks into App.jsx — you'll need them both below:
jsx
Copy to Clipboard
import { useState, useRef, useEffect } from "react";

Next, declare a new ref inside the App() function, just above the return statement:
jsx
Copy to Clipboard
const listHeadingRef = useRef(null);

Prepare the heading
Heading elements like our <h2> are not usually focusable. This isn't a problem — we can make any element programmatically focusable by adding the attribute tabindex="-1" to it. This means only focusable with JavaScript. You can't press Tab to focus on an element with a tabindex of -1 the same way you could do with a <button> or <a> element (this can be done using tabindex="0", but that's not appropriate in this case).
Let's add the tabindex attribute — written as tabIndex in JSX — to the heading above our list of tasks, along with our listHeadingRef:
jsx
Copy to Clipboard
<h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
  {headingText}
</h2>

Note: The tabindex attribute is excellent for accessibility edge cases, but you should take great care not to overuse it. Only apply a tabindex to an element when you're sure that making it focusable will benefit your user somehow. In most cases, you should utilize elements that can naturally take focus, such as buttons, anchors, and inputs. Irresponsible usage of tabindex could have a profoundly negative impact on keyboard and screen reader users!
Getting previous state
We want to focus on the element associated with our ref (via the ref attribute) only when our user deletes a task from their list. That's going to require the usePrevious() hook we used earlier on. Add it to the top of your App.jsx file, just below the imports:
jsx
Copy to Clipboard
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

Now add the following, above the return statement inside the App() function:
jsx
Copy to Clipboard
const prevTaskLength = usePrevious(tasks.length);

Here we are invoking usePrevious() to track the previous length of the tasks array.
Note: Since we're now utilizing usePrevious() in two files, it might be more efficient to move the usePrevious() function into its own file, export it from that file, and import it where you need it. Try doing this as an exercise once you've got to the end.
Using useEffect() to control our heading focus
Now that we've stored how many tasks we previously had, we can set up a useEffect() hook to run when our number of tasks changes, which will focus the heading if the number of tasks we have now is less than it previously was — that is, we deleted a task!
Add the following into the body of your App() function, just below your previous additions:
jsx
Copy to Clipboard
useEffect(() => {
  if (tasks.length < prevTaskLength) {
    listHeadingRef.current.focus();
  }
}, [tasks.length, prevTaskLength]);

We only try to focus on our list heading if we have fewer tasks now than we did before. The dependencies passed into this hook ensure it will only try to re-run when either of those values (the number of current tasks, or the number of previous tasks) changes.
Now, when you use your keyboard to delete a task in your browser, you will see our dashed focus outline appear around the heading above the list.
Finished!
You've just finished building a React app from the ground up! Congratulations! The skills you've learned here will be a great foundation to build on as you continue working with React.
Most of the time, you can be an effective contributor to a React project even if all you do is think carefully about components and their state and props. Remember to always write the best HTML you can.
useRef() and useEffect() are somewhat advanced features, and you should be proud of yourself for using them! Look out for opportunities to practice them more, because doing so will allow you to create inclusive experiences for users. Remember: our app would have been inaccessible to keyboard users without them!
Note: If you need to check your code against our version, you can find a finished version of the sample React app code in our todo-react repository. For a running live version, see https://mdn.github.io/todo-react/.
In the very last article we'll present you with a list of React resources that you can use to go further in your learning.
Previous


Overview: JavaScript frameworks and libraries


Next


Help improve MDN
Was this page helpful to you?
Yes
No
Learn how to contribute.
This page was last modified on Apr 11, 2025 by MDN contributors.
View this page on GitHub • Report a problem with this content
Your blueprint for a better internet.
MDN on Bluesky


MDN on Mastodon


MDN on X (formerly Twitter)


MDN on GitHub


MDN Blog RSS Feed


MDN
About
Blog
Careers
Advertise with us
Support
Product help
Report an issue
Our communities
MDN Community
MDN Forum
MDN Chat
Developers
Web Technologies
Learn Web Development
MDN Plus
Hacks Blog
Website Privacy Notice
Cookies
Legal
Community Participation Guidelines
Visit Mozilla Corporation’s not-for-profit parent, the Mozilla Foundation.
Portions of this content are ©1998–2025 by individual mozilla.org contributors. Content available under a Creative Commons license.
React resources
Previous


Overview: JavaScript frameworks and libraries


Next


Our final article provides you with a list of React resources that you can use to go further in your learning.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages, and the terminal/command line.
Learning outcomes:
Familiarity with further resources for learning more about React.

Component-level styles
While we kept all the CSS for our tutorial in a single index.css file, it's common for React applications to define per-component stylesheets. In an application powered by Vite, this can be done by creating a CSS file and importing it into its corresponding component module.
For example: we could have written a dedicated Form.css file to house the CSS related to the <Form /> component, then imported the styles into Form.jsx, like this:
jsx
Copy to Clipboard
import Form from "./Form";
import "./Form.css";

This approach makes it easy to identify and manage the CSS that belongs to a specific component and distinguish it from your app-wide styles. However, it also fragments your stylesheet across your codebase, and this fragmentation might not be worthwhile. For larger applications with hundreds of unique views and lots of moving parts, it makes sense to use component-level styles and thereby limit the amount of irrelevant code that's sent to your user at any one time.
You can read more about this and other approaches to styling React components in the Smashing Magazine article, Styling Components In React.
React DevTools
We used console.log() to check on the state and props of our application in this tutorial, and you'll also have seen some of the useful warnings and error message that React gives you both in the CLI and your browser's JavaScript console. But there's more we can do here.
The React DevTools utility allows you to inspect the internals of your React application directly in the browser. It adds a new panel to your browser's developer tools that allows you to inspect the state and props of various components, and even edit state and props to make immediate changes to your application.
This screenshot shows our finished application as it appears in React DevTools:

On the left, we see all of the components that make up our application, including unique keys for the items that are rendered from arrays. On the right, we see the props and hooks that our App component uses. Notice, too, that the Form, FilterButton, and Todo components are indented to the right – this indicates that App is their parent. This view is great for understanding parent/child relationships at a glance and is invaluable for understanding more complex apps.
React DevTools is available in several forms:
A Chrome browser extension.
A Firefox browser extension.
A Microsoft Edge browser extension.
A stand-alone application you can install with npm or Yarn.
Try installing one of these, and then using it to inspect the app you've just built!
You can read more about React DevTools in the React docs.
The useReducer() hook
In this tutorial, we used the useState() hook to manage state across a small collection of event handler functions. This was fine for learning purposes, but it left our state management logic tied to our component's event handlers – especially those of the <Todo /> component.
The useReducer() hook offers developers a way to consolidate different-but-related state management logic into a single function. It's a bit more complex than useState(), but it's a good tool to have in your belt. You can read more about useReducer() in the React docs.
The Context API
The application that we built in this tutorial utilized component props to pass data from its App component to the child components that needed it. Most of the time, props are an appropriate method for sharing data; for complex, deeply nested applications, however, they're not always best.
React provides the Context API as a way to provide data to components that need it without passing props down the component tree. There's also a useContext hook that facilitates this.
If you'd like to try this API for yourself, Smashing Magazine has written an introductory article about React context.
Class components
Although this tutorial doesn't mention them, it is possible to build React components using JavaScript classes – these are called class components. Until the arrival of hooks, classes were the only way to bring state into components or manage rendering side effects. They're still the only way to handle certain edge-cases, and they're common in legacy React projects. The official React docs maintain a reference for the Component base class, but recommend using hooks to manage state and side effects.
Testing
Libraries such as React Testing Library make it possible to write unit tests for React components. There are many ways to run these tests. The testing framework Vitest is built on top of Vite, and is a great companion to your Vite-powered React applications. Jest is another popular testing framework that can be used with React.
Routing
While routing is traditionally handled by a server and not an application on the user's computer, it is possible to configure a web application to read and update the browser's location, and render certain user interfaces. This is called client-side routing. It's possible to create many unique routes for your application (such as /home, /dashboard, or /login).
React Router is the most popular and most robust client-side routing library for React. It allows developers to define the routes of their application, and associate components with those routes . It also provides a number of useful hooks and components for managing the browser's location and history.
Note: Client-side routing can make your application feel fast, but it poses a number of accessibility problems, especially for people who rely on assistive technology. You can read more about this in Marcy Sutton's article, "The Implications of Client-Side Routing".

Advanced JavaScript objects
Overview: Extension modules


Next


In JavaScript, most things are objects, from core JavaScript features like arrays to the browser APIs built on top of JavaScript. You can also create your own objects to encapsulate related functions and variables into efficient packages and act as handy data containers.
Having a deeper knowledge of how JavaScript objects work is useful as you build confidence with web development, start to build more complex apps, and create your own libraries. This module will help you by providing JavaScript object theory and object-oriented programming practice.
Prerequisites
Before starting this module, You should really have learnt the fundamentals of JavaScript, especially JavaScript object basics. It would also be helpful to have some familiarity with HTML and CSS.
Note: If you are working on a computer, tablet, or another device where you can't create files, you can try running the code in an online editor such as CodePen or JSFiddle.
Tutorials and challenges
Object prototypes
Prototypes are the mechanism by which JavaScript objects inherit features from one another, and they work differently from inheritance mechanisms in classical object-oriented programming languages. In this article, we explore how prototype chains work.
Object-oriented programming
In this article, we'll describe some of the basic principles of "classical" object-oriented programming, and look at the ways it is different from the prototype model in JavaScript.
Classes in JavaScript
JavaScript provides some features for people wanting to implement "classical" object-oriented programs, and in this article, we'll describe these features.
Object building practice
In previous articles we looked at all the essential JavaScript object theory and syntax details, giving you a solid base to start from. In this article we dive into a practical exercise, giving you some more practice in building custom JavaScript objects, which produce something fun and colorful — some colored bouncing balls.
Adding features to our bouncing balls demo Challenge
In this challenge, you are expected to use the bouncing balls demo from the previous article as a starting point, and add some new and interesting features to it.
See also
Learn JavaScript
An excellent resource for aspiring web developers — Learn JavaScript in an interactive environment, with short lessons and interactive tests, guided by automated assessment. The first 40 lessons are free, and the complete course is available for a small one-time payment.

Object prototypes
Overview: Advanced JavaScript objects


Next


Prototypes are the mechanism by which JavaScript objects inherit features from one another. In this article, we explain what a prototype is, how prototype chains work, and how a prototype for an object can be set.
Prerequisites:
Familiarity with JavaScript basics (especially Object basics).
Learning outcomes:
The JavaScript prototype chain.
The concept of shadowing properties.
Setting prototypes.
The concepts of prototypes and inheritance.

The prototype chain
In the browser's console, try creating an object literal:
js
Copy to Clipboard
const myObject = {
  city: "Madrid",
  greet() {
    console.log(`Greetings from ${this.city}`);
  },
};

myObject.greet(); // Greetings from Madrid

This is an object with one data property, city, and one method, greet(). If you type the object's name followed by a period into the console, like myObject., then the console will pop up a list of all the properties available to this object. You'll see that as well as city and greet, there are lots of other properties!
__defineGetter__
__defineSetter__
__lookupGetter__
__lookupSetter__
__proto__
city
constructor
greet
hasOwnProperty
isPrototypeOf
propertyIsEnumerable
toLocaleString
toString
valueOf

Try accessing one of them:
js
Copy to Clipboard
myObject.toString(); // "[object Object]"

It works (even if it's not obvious what toString() does).
What are these extra properties, and where do they come from?
Every object in JavaScript has a built-in property, which is called its prototype. The prototype is itself an object, so the prototype will have its own prototype, making what's called a prototype chain. The chain ends when we reach a prototype that has null for its own prototype.
Note: The property of an object that points to its prototype is not called prototype. Its name is not standard, but in practice all browsers use __proto__. The standard way to access an object's prototype is the Object.getPrototypeOf() method.
When you try to access a property of an object: if the property can't be found in the object itself, the prototype is searched for the property. If the property still can't be found, then the prototype's prototype is searched, and so on until either the property is found, or the end of the chain is reached, in which case undefined is returned.
So when we call myObject.toString(), the browser:
looks for toString in myObject
can't find it there, so looks in the prototype object of myObject for toString
finds it there, and calls it.
What is the prototype for myObject? To find out, we can use the function Object.getPrototypeOf():
js
Copy to Clipboard
Object.getPrototypeOf(myObject); // Object { }

This is an object called Object.prototype, and it is the most basic prototype, that all objects have by default. The prototype of Object.prototype is null, so it's at the end of the prototype chain:

The prototype of an object is not always Object.prototype. Try this:
js
Copy to Clipboard
const myDate = new Date();
let object = myDate;

do {
  object = Object.getPrototypeOf(object);
  console.log(object);
} while (object);

// Date.prototype
// Object { }
// null

This code creates a Date object, then walks up the prototype chain, logging the prototypes. It shows us that the prototype of myDate is a Date.prototype object, and the prototype of that is Object.prototype.

In fact, when you call familiar methods, like myDate2.getTime(), you are calling a method that's defined on Date.prototype.
Shadowing properties
What happens if you define a property in an object, when a property with the same name is defined in the object's prototype? Let's see:
js
Copy to Clipboard
const myDate = new Date(1995, 11, 17);

console.log(myDate.getTime()); // 819129600000

myDate.getTime = function () {
  console.log("something else!");
};

myDate.getTime(); // 'something else!'

This should be predictable, given the description of the prototype chain. When we call getTime() the browser first looks in myDate for a property with that name, and only checks the prototype if myDate does not define it. So when we add getTime() to myDate, then the version in myDate is called.
This is called "shadowing" the property.
Setting a prototype
There are various ways of setting an object's prototype in JavaScript, and here we'll describe two: Object.create() and constructors.
Using Object.create
The Object.create() method creates a new object and allows you to specify an object that will be used as the new object's prototype.
Here's an example:
js
Copy to Clipboard
const personPrototype = {
  greet() {
    console.log("hello!");
  },
};

const carl = Object.create(personPrototype);
carl.greet(); // hello!

Here we create an object personPrototype, which has a greet() method. We then use Object.create() to create a new object with personPrototype as its prototype. Now we can call greet() on the new object, and the prototype provides its implementation.
Using a constructor
In JavaScript, all functions have a property named prototype. When you call a function as a constructor, this property is set as the prototype of the newly constructed object (by convention, in the property named __proto__).
So if we set the prototype of a constructor, we can ensure that all objects created with that constructor are given that prototype:
js
Copy to Clipboard
const personPrototype = {
  greet() {
    console.log(`hello, my name is ${this.name}!`);
  },
};

function Person(name) {
  this.name = name;
}

Object.assign(Person.prototype, personPrototype);
// or
// Person.prototype.greet = personPrototype.greet;

Here we create:
an object personPrototype, which has a greet() method
a Person() constructor function which initializes the name of the person to create.
We then put the methods defined in personPrototype onto the Person function's prototype property using Object.assign.
After this code, objects created using Person() will get Person.prototype as their prototype, which automatically contains the greet method.
js
Copy to Clipboard
const reuben = new Person("Reuben");
reuben.greet(); // hello, my name is Reuben!

This also explains why we said earlier that the prototype of myDate is called Date.prototype: it's the prototype property of the Date constructor.
Own properties
The objects we create using the Person constructor above have two properties:
a name property, which is set in the constructor, so it appears directly on Person objects
a greet() method, which is set in the prototype.
It's common to see this pattern, in which methods are defined on the prototype, but data properties are defined in the constructor. That's because methods are usually the same for every object we create, while we often want each object to have its own value for its data properties (just as here where every person has a different name).
Properties that are defined directly in the object, like name here, are called own properties, and you can check whether a property is an own property using the static Object.hasOwn() method:
js
Copy to Clipboard
const irma = new Person("Irma");

console.log(Object.hasOwn(irma, "name")); // true
console.log(Object.hasOwn(irma, "greet")); // false

Note: You can also use the non-static Object.hasOwnProperty() method here, but we recommend that you use Object.hasOwn() if you can.
Prototypes and inheritance
Prototypes are a powerful and very flexible feature of JavaScript, making it possible to reuse code and combine objects.
In particular they support a version of inheritance. Inheritance is a feature of object-oriented programming languages that lets programmers express the idea that some objects in a system are more specialized versions of other objects.
For example, if we're modeling a school, we might have professors and students: they are both people, so have some features in common (for example, they both have names), but each might add extra features (for example, professors have a subject that they teach), or might implement the same feature in different ways. In an OOP system we might say that professors and students both inherit from people.
You can see how in JavaScript, if Professor and Student objects can have Person prototypes, then they can inherit the common properties, while adding and redefining those properties which need to differ.
In the next article we'll discuss inheritance along with the other main features of object-oriented programming languages, and see how JavaScript supports them.
Summary
This article has covered JavaScript object prototypes, including how prototype object chains allow objects to inherit features from one another, the prototype property and how it can be used to add methods to constructors, and other related topics.
In the next article we'll look at the concepts underlying object-oriented programming.
Overview: Advanced JavaScript objects



Object-oriented programming
Previous


Overview: Advanced JavaScript objects


Next


Object-oriented programming (OOP) is a programming paradigm fundamental to many programming languages, including Java and C++. In this article, we'll provide an overview of the basic concepts of OOP. We'll describe three main concepts: classes and instances, inheritance, and encapsulation. For now, we'll describe these concepts without reference to JavaScript in particular, so all the examples are given in pseudocode.
Note: To be precise, the features described here are of a particular style of OOP called class-based or "classical" OOP. When people talk about OOP, this is generally the type that they mean.
After that, in JavaScript, we'll look at how constructors and the prototype chain relate to these OOP concepts, and how they differ. In the next article, we'll look at some additional features of JavaScript that make it easier to implement object-oriented programs.
Prerequisites:
Familiarity with JavaScript basics (especially Object basics) and object-oriented JavaScript concepts covered in previous lessons in this module.
Learning outcomes:
Object-oriented programming (OOP) concepts: Classes, instances, inheritance, and encapsulation.
How these OOP concepts apply to JavaScript, and what the differences are between it and a language like Java or C++.

Object-oriented programming is about modeling a system as a collection of objects, where each object represents some particular aspect of the system. Objects contain both functions (or methods) and data. An object provides a public interface to other code that wants to use it but maintains its own private, internal state; other parts of the system don't have to care about what is going on inside the object.
Classes and instances
When we model a problem in terms of objects in OOP, we create abstract definitions representing the types of objects we want to have in our system. For example, if we were modeling a school, we might want to have objects representing professors. Every professor has some properties in common: they all have a name and a subject that they teach. Additionally, every professor can do certain things: they can all grade a paper and they can introduce themselves to their students at the start of the year, for example.
So Professor could be a class in our system. The definition of the class lists the data and methods that every professor has.
In pseudocode, a Professor class could be written like this:
class Professor
    properties
        name
        teaches
    methods
        grade(paper)
        introduceSelf()

This defines a Professor class with:
two data properties: name and teaches
two methods: grade() to grade a paper and introduceSelf() to introduce themselves.
On its own, a class doesn't do anything: it's a kind of template for creating concrete objects of that type. Each concrete professor we create is called an instance of the Professor class. The process of creating an instance is performed by a special function called a constructor. We pass values to the constructor for any internal state that we want to initialize in the new instance.
Generally, the constructor is written out as part of the class definition, and it usually has the same name as the class itself:
class Professor
    properties
        name
        teaches
    constructor
        Professor(name, teaches)
    methods
        grade(paper)
        introduceSelf()

This constructor takes two parameters, so we can initialize the name and teaches properties when we create a new concrete professor.
Now that we have a constructor, we can create some professors. Programming languages often use the keyword new to signal that a constructor is being called.
js
Copy to Clipboard
walsh = new Professor("Walsh", "Psychology");
lillian = new Professor("Lillian", "Poetry");


walsh.teaches; // 'Psychology'
walsh.introduceSelf(); // 'My name is Professor Walsh and I will be your Psychology professor.'


lillian.teaches; // 'Poetry'
lillian.introduceSelf(); // 'My name is Professor Lillian and I will be your Poetry professor.'

This creates two objects, both instances of the Professor class.
Inheritance
Suppose in our school we also want to represent students. Unlike professors, students can't grade papers, don't teach a particular subject, and belong to a particular year.
However, students do have a name and may also want to introduce themselves, so we might write out the definition of a student class like this:
class Student
    properties
        name
        year
    constructor
        Student(name, year)
    methods
        introduceSelf()

It would be helpful if we could represent the fact that students and professors share some properties, or more accurately, the fact that on some level, they are the same kind of thing. Inheritance lets us do this.
We start by observing that students and professors are both people, and people have names and want to introduce themselves. We can model this by defining a new class Person, where we define all the common properties of people. Then, Professor and Student can both derive from Person, adding their extra properties:
class Person
    properties
        name
    constructor
        Person(name)
    methods
        introduceSelf()


class Professor : extends Person
    properties
        teaches
    constructor
        Professor(name, teaches)
    methods
        grade(paper)
        introduceSelf()


class Student : extends Person
    properties
        year
    constructor
        Student(name, year)
    methods
        introduceSelf()

In this case, we would say that Person is the superclass or parent class of both Professor and Student. Conversely, Professor and Student are subclasses or child classes of Person.
You might notice that introduceSelf() is defined in all three classes. The reason for this is that while all people want to introduce themselves, the way they do so is different:
js
Copy to Clipboard
walsh = new Professor("Walsh", "Psychology");
walsh.introduceSelf(); // 'My name is Professor Walsh and I will be your Psychology professor.'


summers = new Student("Summers", 1);
summers.introduceSelf(); // 'My name is Summers and I'm in the first year.'

We might have a default implementation of introduceSelf() for people who aren't students or professors:
js
Copy to Clipboard
pratt = new Person("Pratt");
pratt.introduceSelf(); // 'My name is Pratt.'

This feature - when a method has the same name but a different implementation in different classes - is called polymorphism. When a method in a subclass replaces the superclass's implementation, we say that the subclass overrides the version in the superclass.
Encapsulation
Objects provide an interface to other code that wants to use them but maintain their own internal state. The object's internal state is kept private, meaning that it can only be accessed by the object's own methods, not from other objects. Keeping an object's internal state private, and generally making a clear division between its public interface and its private internal state, is called encapsulation.
This is a useful feature because it enables the programmer to change the internal implementation of an object without having to find and update all the code that uses it: it creates a kind of firewall between this object and the rest of the system.
For example, suppose students are allowed to study archery if they are in the second year or above. We could implement this just by exposing the student's year property, and other code could examine that to decide whether the student can take the course:
js
Copy to Clipboard
if (student.year > 1) {
  // allow the student into the class
}

The problem is, if we decide to change the criteria for allowing students to study archery - for example by also requiring the parent or guardian to give their permission - we'd need to update every place in our system that performs this test. It would be better to have a canStudyArchery() method on Student objects, that implements the logic in one place:
class Student : extends Person
    properties
       year
    constructor
       Student(name, year)
    methods
       introduceSelf()
       canStudyArchery() { return this.year > 1 }

js
Copy to Clipboard
if (student.canStudyArchery()) {
  // allow the student into the class
}

That way, if we want to change the rules about studying archery, we only have to update the Student class, and all the code using it will still work.
In many OOP languages, we can prevent other code from accessing an object's internal state by marking some properties as private. This will generate an error if code outside the object tries to access them:
class Student : extends Person
    properties
       private year
    constructor
        Student(name, year)
    methods
       introduceSelf()
       canStudyArchery() { return this.year > 1 }


student = new Student('Weber', 1)
student.year // error: 'year' is a private property of Student

In languages that don't enforce access like this, programmers use naming conventions, such as starting the name with an underscore, to indicate that the property should be considered private.
OOP and JavaScript
In this article, we've described some of the basic features of class-based object-oriented programming as implemented in languages like Java and C++.
In the two previous articles, we looked at a couple of core JavaScript features: constructors and prototypes. These features certainly have some relation to some of the OOP concepts described above.
constructors in JavaScript provide us with something like a class definition, enabling us to define the "shape" of an object, including any methods it contains, in a single place. But prototypes can be used here, too. For example, if a method is defined on a constructor's prototype property, then all objects created using that constructor get that method via their prototype, and we don't need to define it in the constructor.
the prototype chain seems like a natural way to implement inheritance. For example, if we can have a Student object whose prototype is Person, then it can inherit name and override introduceSelf().
But it's worth understanding the differences between these features and the "classical" OOP concepts described above. We'll highlight a couple of them here.
First, in class-based OOP, classes and objects are two separate constructs, and objects are always created as instances of classes. Also, there is a distinction between the feature used to define a class (the class syntax itself) and the feature used to instantiate an object (a constructor). In JavaScript, we can and often do create objects without any separate class definition, either using a function or an object literal. This can make working with objects much more lightweight than it is in classical OOP.
Second, although a prototype chain looks like an inheritance hierarchy and behaves like it in some ways, it's different in others. When a subclass is instantiated, a single object is created which combines properties defined in the subclass with properties defined further up the hierarchy. With prototyping, each level of the hierarchy is represented by a separate object, and they are linked together via the __proto__ property. The prototype chain's behavior is less like inheritance and more like delegation. Delegation is a programming pattern where an object, when asked to perform a task, can perform the task itself or ask another object (its delegate) to perform the task on its behalf. In many ways, delegation is a more flexible way of combining objects than inheritance (for one thing, it's possible to change or completely replace the delegate at run time).
That said, constructors and prototypes can be used to implement class-based OOP patterns in JavaScript. But using them directly to implement features like inheritance is tricky, so JavaScript provides extra features, layered on top of the prototype model, that map more directly to the concepts of class-based OOP. These extra features are the subject of the next article.
Summary
This article has described the basic features of class-based object oriented programming, and briefly looked at how JavaScript constructors and prototypes compare with these concepts.
In the next article, we'll look at the features JavaScript provides to support class-based object-oriented programming.
Classes in JavaScript
Previous


Overview: Advanced JavaScript objects


Next


In the last article, we introduced some basic concepts of object-oriented programming (OOP), and discussed an example where we used OOP principles to model professors and students in a school.
We also talked about how it's possible to use prototypes and constructors to implement a model like this, and that JavaScript also provides features that map more closely to classical OOP concepts.
In this article, we'll go through these features. It's worth keeping in mind that the features described here are not a new way of combining objects: under the hood, they still use prototypes. They're just a way to make it easier to set up a prototype chain.
Prerequisites:
Familiarity with JavaScript basics (especially Object basics) and object-oriented JavaScript concepts covered in previous lessons in this module.
Learning outcomes:
Creating classes in JavaScript.
Creating constructors in JavaScript.
Inheritance and encapsulation in JavaScript.

Classes and constructors
You can declare a class using the class keyword. Here's a class declaration for our Person from the previous article:
js
Copy to Clipboard
class Person {
  name;


  constructor(name) {
    this.name = name;
  }


  introduceSelf() {
    console.log(`Hi! I'm ${this.name}`);
  }
}

This declares a class called Person, with:
a name property.
a constructor that takes a name parameter that is used to initialize the new object's name property
an introduceSelf() method that can refer to the object's properties using this.
The name; declaration is optional: you could omit it, and the line this.name = name; in the constructor will create the name property before initializing it. However, listing properties explicitly in the class declaration might make it easier for people reading your code to see which properties are part of this class.
You could also initialize the property to a default value when you declare it, with a line like name = '';.
The constructor is defined using the constructor keyword. Just like a constructor outside a class definition, it will:
create a new object
bind this to the new object, so you can refer to this in your constructor code
run the code in the constructor
return the new object.
Given the class declaration code above, you can create and use a new Person instance like this:
js
Copy to Clipboard
const giles = new Person("Giles");


giles.introduceSelf(); // Hi! I'm Giles

Note that we call the constructor using the name of the class, Person in this example.
Omitting constructors
If you don't need to do any special initialization, you can omit the constructor, and a default constructor will be generated for you:
js
Copy to Clipboard
class Animal {
  sleep() {
    console.log("zzzzzzz");
  }
}


const spot = new Animal();


spot.sleep(); // 'zzzzzzz'

Inheritance
Given our Person class above, let's define the Professor subclass.
js
Copy to Clipboard
class Professor extends Person {
  teaches;


  constructor(name, teaches) {
    super(name);
    this.teaches = teaches;
  }


  introduceSelf() {
    console.log(
      `My name is ${this.name}, and I will be your ${this.teaches} professor.`,
    );
  }


  grade(paper) {
    const grade = Math.floor(Math.random() * (5 - 1) + 1);
    console.log(grade);
  }
}

We use the extends keyword to say that this class inherits from another class.
The Professor class adds a new property teaches, so we declare that.
Since we want to set teaches when a new Professor is created, we define a constructor, which takes the name and teaches as arguments. The first thing this constructor does is call the superclass constructor using super(), passing up the name parameter. The superclass constructor takes care of setting name. After that, the Professor constructor sets the teaches property.
Note: If a subclass has any of its own initialization to do, it must first call the superclass constructor using super(), passing up any parameters that the superclass constructor is expecting.
We've also overridden the introduceSelf() method from the superclass, and added a new method grade(), to grade a paper (our professor isn't very good, and just assigns random grades to papers).
With this declaration we can now create and use professors:
js
Copy to Clipboard
const walsh = new Professor("Walsh", "Psychology");
walsh.introduceSelf(); // 'My name is Walsh, and I will be your Psychology professor'


walsh.grade("my paper"); // some random grade

Encapsulation
Finally, let's see how to implement encapsulation in JavaScript. In the last article we discussed how we would like to make the year property of Student private, so we could change the rules about archery classes without breaking any code that uses the Student class.
Here's a declaration of the Student class that does just that:
js
Copy to Clipboard
class Student extends Person {
  #year;


  constructor(name, year) {
    super(name);
    this.#year = year;
  }


  introduceSelf() {
    console.log(`Hi! I'm ${this.name}, and I'm in year ${this.#year}.`);
  }


  canStudyArchery() {
    return this.#year > 1;
  }
}

In this class declaration, #year is a private field. We can construct a Student object, and it can use #year internally, but if code outside the object tries to access #year the browser throws an error:
js
Copy to Clipboard
const summers = new Student("Summers", 2);


summers.introduceSelf(); // Hi! I'm Summers, and I'm in year 2.
summers.canStudyArchery(); // true


summers.#year; // SyntaxError

Note: Code run in the Chrome console can access private elements outside the class. This is a DevTools-only relaxation of the JavaScript syntax restriction.
Private fields must be declared in the class declaration, and their names start with #.
Private methods
You can have private methods as well as private fields. Just like private fields, private methods' names start with #, and they can only be called by the object's own methods:
js
Copy to Clipboard
class Example {
  somePublicMethod() {
    this.#somePrivateMethod();
  }


  #somePrivateMethod() {
    console.log("You called me?");
  }
}


const myExample = new Example();


myExample.somePublicMethod(); // 'You called me?'


myExample.#somePrivateMethod(); // SyntaxError

Test your skills!
You've reached the end of this article, but can you remember the most important information? You can find some further tests to verify that you've retained this information before you move on — see Test your skills: Object-oriented JavaScript.
Summary
In this article, we've gone through the main tools available in JavaScript for writing object-oriented programs. We haven't covered everything here, but this should be enough to get you started. Our article on Classes is a good place to learn more.


Object building practice
Previous


Overview: Advanced JavaScript objects


Next


In previous articles we looked at all the essential JavaScript object theory and syntax details, giving you a solid base to start from. In this article we dive into a practical exercise, giving you some more practice in building custom JavaScript objects, with a fun and colorful result.
Prerequisites:
Familiarity with JavaScript basics (especially Object basics) and object-oriented JavaScript concepts covered in previous lessons in this module.
Learning outcomes:
Practice using objects and object-oriented techniques in a real-world context.

Let's bounce some balls
In this article we will write a classic "bouncing balls" demo, to show you how useful objects can be in JavaScript. Our little balls will bounce around on the screen, and change color when they touch each other. The finished example will look a little something like this:

This example will make use of the Canvas API for drawing the balls to the screen, and the requestAnimationFrame API for animating the whole display — you don't need to have any previous knowledge of these APIs, and we hope that by the time you've finished this article you'll be interested in exploring them more. Along the way, we'll make use of some nifty objects, and show you a couple of nice techniques like bouncing balls off walls, and checking whether they have hit each other (otherwise known as collision detection).
Getting started
To begin with, make local copies of our index.html, style.css, and main.js files. These contain the following, respectively:
A very simple HTML document featuring an h1 element, a <canvas> element to draw our balls on, and elements to apply our CSS and JavaScript to our HTML.
Some very simple styles, which mainly serve to style and position the <h1>, and get rid of any scrollbars or margin around the edge of the page (so that it looks nice and neat).
Some JavaScript that serves to set up the <canvas> element and provide a general function that we're going to use.
The first part of the script looks like so:
js
Copy to Clipboard
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

This script gets a reference to the <canvas> element, then calls the getContext() method on it to give us a context on which we can start to draw. The resulting constant (ctx) is the object that directly represents the drawing area of the canvas and allows us to draw 2D shapes on it.
Next, we set constants called width and height, and the width and height of the canvas element (represented by the canvas.width and canvas.height properties) to equal the width and height of the browser viewport (the area which the webpage appears on — this can be gotten from the Window.innerWidth and Window.innerHeight properties).
Note that we are chaining multiple assignments together, to get the variables all set quicker — this is perfectly OK.
Then we have two helper functions:
js
Copy to Clipboard
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function randomRGB() {
  return `rgb(${random(0, 255)} ${random(0, 255)} ${random(0, 255)})`;
}

The random() function takes two numbers as arguments, and returns a random number in the range between the two. The randomRGB() function generates a random color represented as an rgb() string.
Modeling a ball in our program
Our program will feature lots of balls bouncing around the screen. Since these balls will all behave in the same way, it makes sense to represent them with an object. Let's start by adding the following class definition to the bottom of our code.
js
Copy to Clipboard
class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }
}

So far this class only contains a constructor, in which we can initialize the properties each ball needs in order to function in our program:
x and y coordinates — the horizontal and vertical coordinates where the ball starts on the screen. This can range between 0 (top left hand corner) to the width and height of the browser viewport (bottom right-hand corner).
horizontal and vertical velocity (velX and velY) — each ball is given a horizontal and vertical velocity; in real terms these values are regularly added to the x/y coordinate values when we animate the balls, to move them by this much on each frame.
color — each ball gets a color.
size — each ball gets a size — this is its radius, in pixels.
This handles the properties, but what about the methods? We want to get our balls to actually do something in our program.
Drawing the ball
First add the following draw() method to the Ball class:
js
Copy to Clipboard
class Ball {
  // …
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

Using this function, we can tell the ball to draw itself onto the screen, by calling a series of members of the 2D canvas context we defined earlier (ctx). The context is like the paper, and now we want to command our pen to draw something on it:
First, we use beginPath() to state that we want to draw a shape on the paper.
Next, we use fillStyle to define what color we want the shape to be — we set it to our ball's color property.
Next, we use the arc() method to trace an arc shape on the paper. Its parameters are:
The x and y position of the arc's center — we are specifying the ball's x and y properties.
The radius of the arc — in this case, the ball's size property.
The last two parameters specify the start and end number of degrees around the circle that the arc is drawn between. Here we specify 0 degrees, and 2 * PI, which is the equivalent of 360 degrees in radians (annoyingly, you have to specify this in radians). That gives us a complete circle. If you had specified only 1 * PI, you'd get a semi-circle (180 degrees).
Last of all, we use the fill() method, which basically states "finish drawing the path we started with beginPath(), and fill the area it takes up with the color we specified earlier in fillStyle."
You can start testing your object out already.
Save the code so far, and load the HTML file in a browser.
Open the browser's JavaScript console, and then refresh the page so that the canvas size changes to the smaller visible viewport that remains when the console opens.
Type in the following to create a new ball instance:
js
Copy to Clipboard
const testBall = new Ball(50, 100, 4, 4, "blue", 10);


Try calling its members:
js
Copy to Clipboard
testBall.x;
testBall.size;
testBall.color;
testBall.draw();


When you enter the last line, you should see the ball draw itself somewhere on the canvas.
Updating the ball's data
We can draw the ball in position, but to actually move the ball, we need an update function of some kind. Add the following code inside the class definition for Ball:
js
Copy to Clipboard
class Ball {
  // …
  update() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }


    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }


    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }


    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }


    this.x += this.velX;
    this.y += this.velY;
  }
}

The first four parts of the function check whether the ball has reached the edge of the canvas. If it has, we reverse the polarity of the relevant velocity to make the ball travel in the opposite direction. So for example, if the ball was traveling upwards (negative velY), then the vertical velocity is changed so that it starts to travel downwards instead (positive velY).
In the four cases, we are checking to see:
if the x coordinate is greater than the width of the canvas (the ball is going off the right edge).
if the x coordinate is smaller than 0 (the ball is going off the left edge).
if the y coordinate is greater than the height of the canvas (the ball is going off the bottom edge).
if the y coordinate is smaller than 0 (the ball is going off the top edge).
In each case, we include the size of the ball in the calculation because the x/y coordinates are in the center of the ball, but we want the edge of the ball to bounce off the perimeter — we don't want the ball to go halfway off the screen before it starts to bounce back.
The last two lines add the velX value to the x coordinate, and the velY value to the y coordinate — the ball is in effect moved each time this method is called.
This will do for now; let's get on with some animation!
Animating the ball
Now let's make this fun. We are now going to start adding balls to the canvas, and animating them.
First, we need to create somewhere to store all our balls and then populate it. The following will do this job — add it to the bottom of your code now:
js
Copy to Clipboard
const balls = [];


while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size,
  );


  balls.push(ball);
}

The while loop creates a new instance of our Ball() using random values generated with our random() and randomRGB() functions, then push()es it onto the end of our balls array, but only while the number of balls in the array is less than 25. So when we have 25 balls in the array, no more balls will be pushed. You can try varying the number in balls.length < 25 to get more or fewer balls in the array. Depending on how much processing power your computer/browser has, specifying several thousand balls might slow down the animation rather a lot!
Next, add the following to the bottom of your code:
js
Copy to Clipboard
function loop() {
  ctx.fillStyle = "rgb(0 0 0 / 25%)";
  ctx.fillRect(0, 0, width, height);


  for (const ball of balls) {
    ball.draw();
    ball.update();
  }


  requestAnimationFrame(loop);
}

All programs that animate things generally involve an animation loop, which serves to update the information in the program and then render the resulting view on each frame of the animation; this is the basis for most games and other such programs. Our loop() function does the following:
Sets the canvas fill color to semi-transparent black, then draws a rectangle of the color across the whole width and height of the canvas, using fillRect() (the four parameters provide a start coordinate, and a width and height for the rectangle drawn). This serves to cover up the previous frame's drawing before the next one is drawn. If you don't do this, you'll just see long snakes worming their way around the canvas instead of balls moving! The color of the fill is set to semi-transparent, rgb(0 0 0 / 25%), to allow the previous few frames to shine through slightly, producing the little trails behind the balls as they move. If you changed 0.25 to 1, you won't see them at all any more. Try varying this number to see the effect it has.
Loops through all the balls in the balls array, and runs each ball's draw() and update() function to draw each one on the screen, then do the necessary updates to position and velocity in time for the next frame.
Runs the function again using the requestAnimationFrame() method — when this method is repeatedly run and passed the same function name, it runs that function a set number of times per second to create a smooth animation. This is generally done recursively — which means that the function is calling itself every time it runs, so it runs over and over again.
Finally, add the following line to the bottom of your code — we need to call the function once to get the animation started.
js
Copy to Clipboard
loop();

That's it for the basics — try saving and refreshing to test your bouncing balls out!
Adding collision detection
Now for a bit of fun, let's add some collision detection to our program, so our balls know when they have hit another ball.
First, add the following method definition to your Ball class.
js
Copy to Clipboard
class Ball {
  // …
  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);


        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

This method is a little complex, so don't worry if you don't understand exactly how it works for now. An explanation follows:
For each ball, we need to check every other ball to see if it has collided with the current ball. To do this, we start another for...of loop to loop through all the balls in the balls[] array.
Immediately inside the for loop, we use an if statement to check whether the current ball being looped through is the same ball as the one we are currently checking. We don't want to check whether a ball has collided with itself! To do this, we check whether the current ball (i.e., the ball whose collisionDetect method is being invoked) is the same as the loop ball (i.e., the ball that is being referred to by the current iteration of the for loop in the collisionDetect method). We then use ! to negate the check, so that the code inside the if statement only runs if they are not the same.
We then use a common algorithm to check the collision of two circles. We are basically checking whether any of the two circle's areas overlap. This is explained further in 2D collision detection.
If a collision is detected, the code inside the inner if statement is run. In this case, we only set the color property of both the circles to a new random color. We could have done something far more complex, like get the balls to bounce off each other realistically, but that would have been far more complex to implement. For such physics simulations, developers tend to use a games or physics libraries such as PhysicsJS, matter.js, Phaser, etc.
You also need to call this method in each frame of the animation. Update your loop() function to call ball.collisionDetect() after ball.update():
js
Copy to Clipboard
function loop() {
  ctx.fillStyle = "rgb(0 0 0 / 25%)";
  ctx.fillRect(0, 0, width, height);


  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }


  requestAnimationFrame(loop);
}

Save and refresh the demo again, and you'll see your balls change color when they collide!
Note: If you have trouble getting this example to work, try comparing your JavaScript code against our finished version (also see it running live).
Summary
We hope you had fun writing your own real-world random bouncing balls example, using various object and object-oriented techniques from throughout the module! This should have given you some useful practice in using objects, and good real-world context.
That's it for object lessons — all that remains now is for you to test your skills in the module challenge.
See also
Canvas tutorial — a beginner's 2D canvas tutorial.
requestAnimationFrame()
2D collision detection
3D collision detection
2D breakout game using pure JavaScript — a great beginner's tutorial showing how to build a 2D game.
2D breakout game using Phaser — explains the basics of building a 2D game using a JavaScript game library.
Challenge: Adding features to our bouncing balls demo
Previous


Overview: Advanced JavaScript objects


In this challenge, you are expected to use the bouncing balls demo from the previous article as a starting point, and add some new and interesting features to it.
Starting point
To start this challenge, make a local copy of index-finished.html, style.css, and main-finished.js from our last article in a new directory in your local computer.
Alternatively, you could use an online editor such as CodePen or JSFiddle. If the online editor you are using doesn't have a separate JavaScript panel, you can put it inline in a <script> element inside the HTML page.
Note: If you get stuck, you can reach out to us in one of our communication channels.
Hints and tips
A couple of pointers before you get started.
This challenge is quite difficult. Read all of the instructions before you start coding, and take each step slowly and carefully.
It might be a good idea to save a separate copy of the demo after you get each stage working, so you can refer back to it if you find yourself in trouble later on.
Project brief
Our bouncy ball demo is fun, but now we want to make it a little bit more interactive by adding a user-controlled evil circle, which will eat the balls if it catches them. We also want to test your object-building skills by creating a generic Shape() object that our balls and evil circle can inherit from. Finally, we want to add a score counter to track the number of balls left to capture.
The following screenshot gives you an idea of what the finished program should look like:

To give you more of an idea, have a look at the finished example (no peeking at the source code!)
Steps to complete
The following sections describe what you need to do.
Create a Shape class
First of all, create a new Shape class. This has only a constructor. The Shape constructor should define the x, y, velX, and velY properties in the same way as the Ball() constructor did originally, but not the color and size properties.
The Ball class should be made to derive from Shape using extends. The constructor for Ball should:
take the same arguments as before: x, y, velX, velY, size, and color
call the Shape constructor using super(), passing in the x, y, velX, and velY arguments
initialize its own color and size properties from the parameters it is given.
Note: Make sure to create the Shape class above the existing Ball class, otherwise you'll get some error like: "Uncaught ReferenceError: Cannot access 'Shape' before initialization"
The Ball constructor should define a new property called exists, which is used to track whether the balls exist in the program (have not been eaten by the evil circle). This should be a boolean (true/false), initialized to true in the constructor.
The collisionDetect() method of the Ball class needs a small update. A ball needs to be considered for collision detection only if the exists property is true. So, replace the existing collisionDetect() code with the following code:
js
Copy to Clipboard
class Ball {
  // …
  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);


        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
  // …
}

As discussed above, the only addition is to check if the ball exists — by using ball.exists in the if conditional.
The ball draw() and update() method definitions should be able to stay exactly the same as they were before.
At this point, try reloading the code — it should work just the same as it did before, with our redesigned objects.
Defining EvilCircle
Now it's time to meet the bad guy — the EvilCircle()! Our game is only going to involve one evil circle, but we are still going to define it using a constructor that inherits from Shape(), to give you some practice. You might want to add another circle to the app later on that can be controlled by another player, or have several computer-controlled evil circles. You're probably not going to take over the world with a single evil circle, but it will do for this challenge.
Create a definition for an EvilCircle class. It should inherit from Shape using extends.
EvilCircle constructor
The constructor for EvilCircle should:
be passed just x, y arguments
pass the x, y arguments up to the Shape superclass along with values for velX and velY hardcoded to 20. You should do this with code like super(x, y, 20, 20);
set color to white and size to 10.
Finally, the constructor should set up the code enabling the user to move the evil circle around the screen:
js
Copy to Clipboard
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "a":
      this.x -= this.velX;
      break;
    case "d":
      this.x += this.velX;
      break;
    case "w":
      this.y -= this.velY;
      break;
    case "s":
      this.y += this.velY;
      break;
  }
});

This adds a keydown event listener to the window object so that when a key is pressed, the event object's key property is consulted to see which key is pressed. If it is one of the four specified keys, then the evil circle will move left/right/up/down.
Defining methods for EvilCircle
The EvilCircle class should have three methods, as described below.
draw()
This method has the same purpose as the draw() method for Ball: it draws the object instance on the canvas. The draw() method for EvilCircle will work in a very similar way, so you can start by copying the draw() method for Ball. You should then make the following changes:
We want the evil circle to not be filled in, but rather just have an outer line (stroke). You can achieve this by updating fillStyle and fill() to strokeStyle and stroke() respectively.
We also want to make the stroke a bit thicker, so you can see the evil circle a bit more easily. This can be achieved by setting a value for lineWidth somewhere after the beginPath() call (3 will do).
checkBounds()
This method will do the same thing as the first part of the update() method for Ball — look to see whether the evil circle is going to go off the edge of the screen, and stop it from doing so. Again, you can mostly just copy the update() method for Ball, but there are a few changes you should make:
Get rid of the last two lines — we don't want to automatically update the evil circle's position on every frame, because we will be moving it in some other way, as you'll see below.
Inside the if () statements, if the tests return true we don't want to update velX/velY; we want to instead change the value of x/y so the evil circle is bounced back onto the screen slightly. Adding or subtracting (as appropriate) the evil circle's size property would make sense.
collisionDetect()
This method will act in a very similar way to the collisionDetect() method for Ball method, so you can use a copy of that as the basis of this new method. But there are a couple of differences:
In the outer if statement, you no longer need to check whether the current ball in the iteration is the same as the ball that is doing the checking — because it is no longer a ball, it is the evil circle! Instead, you need to do a test to see if the ball being checked exists (with which property could you do this with?). If it doesn't exist, it has already been eaten by the evil circle, so there is no need to check it again.
In the inner if statement, you no longer want to make the objects change color when a collision is detected — instead, you want to set any balls that collide with the evil circle to not exist any more (again, how do you think you'd do that?).
Bringing the evil circle into the program
Now we've defined the evil circle, we need to actually make it appear in our scene. To do this, you need to make some changes to the loop() function.
First of all, create a new evil circle object instance (specifying the necessary parameters). You only need to do this once, not on every iteration of the loop.
At the point where you loop through every ball and call the draw(), update(), and collisionDetect() functions for each one, make it so that these functions are only called if the current ball exists.
Call the evil circle instance's draw(), checkBounds(), and collisionDetect() methods on every iteration of the loop.
Implementing the score counter
To implement the score counter, follow the following steps:
In your HTML file, add a <p> element just below the h1 element containing the text "Ball count: ".
In your CSS file, add the following rule at the bottom:
css
Copy to Clipboard
p {
  position: absolute;
  margin: 0;
  top: 35px;
  right: 5px;
  color: #aaa;
}


In your JavaScript, make the following updates:
Create a variable that stores a reference to the paragraph.
Keep a count of the number of balls on screen in some way.
Increment the count and display the updated number of balls each time a ball is added to the scene.
Decrement the count and display the updated number of balls each time the evil circle eats a ball (causes it not to exist).
Test your skills: Advanced JavaScript objects
This page lists tests to help you assess your understanding of Advanced JavaScript objects.
Test your skills in advanced JavaScript objects by topic
Test your skills: Object-oriented JavaScript
The aim of this skill test is to help you assess whether you've understood our Classes in JavaScript article.
Test your skills: Object-oriented JavaScript
The aim of this skill test is to help you assess whether you've understood our Classes in JavaScript article.
Note: To get help, read our Test your skills usage guide. You can also reach out to us using one of our communication channels.
OOJS 1
In this task we provide you with the start of a definition for a Shape class. It has three properties: name, sides, and sideLength. This class only models shapes for which all sides are the same length, like a square or an equilateral triangle.
To complete the task:
Add a constructor to this class. The constructor takes arguments for the name, sides, and sideLength properties, and initializes them.
Add a new method calcPerimeter() method to the class, which calculates its perimeter (the length of the shape's outer edge) and logs the result to the console.
Create a new instance of the Shape class called square. Give it a name of square, 4 sides, and a sideLength of 5.
Call your calcPerimeter() method on the instance, to see whether it logs the calculation result to the browser's console as expected.
Create a new instance of Shape called triangle, with a name of triangle, 3 sides and a sideLength of 3.
Call triangle.calcPerimeter() to check that it works OK.
js
Copy to Clipboard
play
class Shape {
  name;
  sides;
  sideLength;
}

play
Click here to show the solution
OOJS 2
Now it's time to add some inheritance into the mix.
To complete the task:
Create a Square class that inherits from Shape.
Add a calcArea() method to Square that calculates its area.
Set up the Square constructor so that the name property of Square object instances is automatically set to square, and the sides property is automatically set to 4. When invoking the constructor, you should therefore just need to provide the sideLength property.
Create an instance of the Square class called square with appropriate property values, and call its calcPerimeter() and calcArea() methods to show that it works OK.
js
Copy to Clipboard
play
class Shape {
  name;
  sides;
  sideLength;


  constructor(name, sides, sideLength) {
    this.name = name;
    this.sides = sides;
    this.sideLength = sideLength;
  }


  calcPerimeter() {
    console.log(
      `The ${this.name}'s perimeter length is ${this.sides * this.sideLength}.`,
    );
  }
}


// Don't edit the code above here!


// Add your code here

play
Click here to show the solution
Your finished JS could look something like this:
js
Copy to Clipboard
// ...
// Don't edit the code above here!


class Square extends Shape {
  constructor(sideLength) {
    super("square", 4, sideLength);
  }


  calcArea() {
    console.log(
      `The ${this.name}'s area is ${this.sideLength * this.sideLength} squared.`,
    );
  }
}


const square = new Square(4);


square.calcPerimeter();
square.calcArea();

Help improve MDN
Was this page helpful to you?
Yes
No
Learn how to contribute.
This page was last modified on Jul 23, 2025 by MDN contributors.
View this page on GitHub • Report a problem with this content
Your blueprint for a better internet.
MDN on Bluesky


MDN on Mastodon


MDN on X (formerly Twitter)


MDN on GitHub


MDN Blog RSS Feed


MDN
About
Blog
Careers
Advertise with us
Support
Product help
Report an issue
Our communities
MDN Community
MDN Forum
MDN Chat
Developers
Web Technologies
Learn Web Development
MDN Plus
Hacks Blog
Website Privacy Notice
Cookies
Legal
Community Participation Guidelines
Visit Mozilla Corporation’s not-for-profit parent, the Mozilla Foundation.
Portions of this content are ©1998–2025 by individual mozilla.org contributors. Content available under a Creative Commons license.
Client-side web APIs
Overview: Extension modules


Next


Application Programming Interfaces (APIs) are programming features for manipulating different aspects of the browser and operating system the site is running on, or manipulating data from other websites or services. This module covers common aspects of some of the most common classes of Web APIs that we haven't previously covered in any kind of detail, providing a useful grounding for those who want to go deeper into browser API usage.
Prerequisites
Before starting this module, You should really have learnt the fundamentals of JavaScript, especially JavaScript object basics and core API coverage such as DOM scripting and Network requests.
It would also be helpful to have some familiarity with HTML and CSS.
Note: If you are working on a computer, tablet, or another device where you can't create files, you can try running the code in an online editor such as CodePen or JSFiddle.
Tutorials
Introduction to web APIs
First up, we'll start by looking at APIs from a high level — what are they, how do they work, how do you use them in your code, and how are they structured? We'll also take a look at what the different main classes of APIs are, and what kind of uses they have.
Video and audio APIs
HTML comes with elements for embedding rich media in documents — <video> and <audio> — which in turn come with their own APIs for controlling playback, seeking, etc. This article shows you how to do common tasks such as creating custom playback controls.
Drawing graphics
The browser contains some very powerful graphics programming tools, from the Scalable Vector Graphics (SVG) language, to APIs for drawing on HTML <canvas> elements, (see The Canvas API and WebGL). This article provides an introduction to the Canvas API, and further resources to allow you to learn more.
Client-side storage
Modern web browsers feature a number of different technologies that allow you to store data related to websites and retrieve it when necessary allowing you to persist data long term, save sites offline, and more. This article explains the very basics of how these work.
Third party APIs
The APIs we've covered so far are built into the browser, but not all APIs are. Many large websites and services such as Google Maps, Facebook, PayPal, etc. provide APIs allowing developers to make use of their data or services (e.g., displaying custom Google Maps on your site, or using Facebook login to log in your users). This article looks at the difference between browser APIs and 3rd party APIs and shows some typical uses of the latter.
Overview: Extension modules




Introduction to web APIs
Overview: Client-side web APIs


Next


First up, we'll start by looking at APIs from a high level — what are they, how do they work, how to use them in your code, and how are they structured? We'll also take a look at what the different main classes of APIs are, and what kind of uses they have.
Prerequisites:
Familiarity with HTML, CSS, and JavaScript, especially JavaScript object basics and core API coverage such as DOM scripting and Network requests.
Learning outcomes:
What Web APIs are, and what you can do with them.
How APIs are used.

What are APIs?
Application Programming Interfaces (APIs) are constructs made available in programming languages to allow developers to create complex functionality more easily. They abstract more complex code away from you, providing some easier syntax to use in its place.
As a real-world example, think about the electricity supply in your house, apartment, or other dwellings. If you want to use an appliance in your house, you plug it into a plug socket and it works. You don't try to wire it directly into the power supply — to do so would be really inefficient and, if you are not an electrician, difficult and dangerous to attempt.

Image source: Overloaded plug socket by The Clear Communication People, on Flickr.
In the same way, if you want to say, program some 3D graphics, it is a lot easier to do it using an API written in a higher-level language such as JavaScript or Python, rather than try to directly write low-level code (say C or C++) that directly controls the computer's GPU or other graphics functions.
Note: See also the API glossary entry for further description.
APIs in client-side JavaScript
Client-side JavaScript, in particular, has many APIs available to it — these are not part of the JavaScript language itself, rather they are built on top of the core JavaScript language, providing you with extra superpowers to use in your JavaScript code. They generally fall into two categories:
Browser APIs are built into your web browser and are able to expose data from the browser and surrounding computer environment and do useful complex things with it. For example, the Web Audio API provides JavaScript constructs for manipulating audio in the browser — taking an audio track, altering its volume, applying effects to it, etc. In the background, the browser is actually using some complex lower-level code (e.g., C++ or Rust) to do the actual audio processing. But again, this complexity is abstracted away from you by the API.
Third-party APIs are not built into the browser by default, and you generally have to retrieve their code and information from somewhere on the Web. For example, the Google Maps API allows you to do things like display an interactive map to your office on your website. It provides a special set of constructs you can use to query the Google Maps service and return specific information.

Relationship between JavaScript, APIs, and other JavaScript tools
So above, we talked about what client-side JavaScript APIs are, and how they relate to the JavaScript language. Let's recap this to make it clearer, and also mention where other JavaScript tools fit in:
JavaScript — A high-level scripting language built into browsers that allows you to implement functionality on web pages/apps. Note that JavaScript is also available in other programming environments, such as Node.
Browser APIs — constructs built into the browser that sit on top of the JavaScript language and allow you to implement functionality more easily.
Third-party APIs — constructs built into third-party platforms (e.g., Disqus, Facebook) that allow you to use some of those platform's functionality in your own web pages (for example, display your Disqus comments on a web page).
JavaScript libraries — Usually one or more JavaScript files containing custom functions that you can attach to your web page to speed up or enable writing common functionality. Examples include jQuery, Mootools and React.
JavaScript frameworks — The next step up from libraries, JavaScript frameworks (e.g., Angular and Ember) tend to be packages of HTML, CSS, JavaScript, and other technologies that you install and then use to write an entire web application from scratch. The key difference between a library and a framework is "Inversion of Control". When calling a method from a library, the developer is in control. With a framework, the control is inverted: the framework calls the developer's code.
What can APIs do?
There are a huge number of APIs available in modern browsers that allow you to do a wide variety of things in your code. You can see this by taking a look at the MDN APIs index page.
Common browser APIs
In particular, the most common categories of browser APIs you'll use (and which we'll cover in this module in greater detail) are:
APIs for manipulating documents loaded into the browser. The most obvious example is the DOM (Document Object Model) API, which allows you to manipulate HTML and CSS — creating, removing and changing HTML, dynamically applying new styles to your page, etc. Every time you see a popup window appear on a page or some new content displayed, for example, that's the DOM in action. Find out more about these types of API in DOM scripting introduction.
APIs that fetch data from the server to update small sections of a webpage on their own are very commonly used. This seemingly small detail has had a huge impact on the performance and behavior of sites — if you just need to update a stock listing or list of available new stories, doing it instantly without having to reload the whole entire page from the server can make the site or app feel much more responsive and "snappy". The main API used for this is the Fetch API, although older code might still use the XMLHttpRequest API. You may also come across the term AJAX, which describes this technique. Find out more about such APIs in Making network requests with JavaScript.
APIs for drawing and manipulating graphics are widely supported in browsers — the most popular ones are Canvas and WebGL, which allow you to programmatically update the pixel data contained in an HTML <canvas> element to create 2D and 3D scenes. For example, you might draw shapes such as rectangles or circles, import an image onto the canvas, and apply a filter to it such as sepia or grayscale using the Canvas API, or create a complex 3D scene with lighting and textures using WebGL. Such APIs are often combined with APIs for creating animation loops (such as window.requestAnimationFrame()) and others to make constantly updating scenes like cartoons and games.
Audio and Video APIs like HTMLMediaElement, the Web Audio API, and WebRTC allow you to do really interesting things with multimedia such as creating custom UI controls for playing audio and video, displaying text tracks like captions and subtitles along with your videos, grabbing video from your web camera to be manipulated via a canvas (see above) or displayed on someone else's computer in a web conference, or adding effects to audio tracks (such as gain, distortion, panning, etc.).
Device APIs enable you to interact with device hardware: for example, accessing the device GPS to find the user's position using the Geolocation API.
Client-side storage APIs enable you to store data on the client-side, so you can create an app that will save its state between page loads, and perhaps even work when the device is offline. There are several options available, e.g., simple name/value storage with the Web Storage API, and more complex database storage with the IndexedDB API.
Common third-party APIs
Third-party APIs come in a large variety; some of the more popular ones that you are likely to make use of sooner or later are:
Map APIs, like Mapquest and the Google Maps API, which allow you to do all sorts of things with maps on your web pages.
The Facebook suite of APIs, which enables you to use various parts of the Facebook ecosystem to benefit your app, such as by providing app login using Facebook login, accepting in-app payments, rolling out targeted ad campaigns, etc.
The Telegram APIs, which allows you to embed content from Telegram channels on your website, in addition to providing support for bots.
The YouTube API, which allows you to embed YouTube videos on your site, search YouTube, build playlists, and more.
The Pinterest API, which provides tools to manage Pinterest boards and pins to include them in your website.
The Twilio API, which provides a framework for building voice and video call functionality into your app, sending SMS/MMS from your apps, and more.
The Disqus API, which provides a commenting platform that can be integrated into your site.
The Mastodon API, which enables you to manipulate features of the Mastodon social network programmatically.
The IFTTT API, which enables integrating multiple APIs through one platform.
How do APIs work?
Different JavaScript APIs work in slightly different ways, but generally, they have common features and similar themes to how they work.
They are based on objects
Your code interacts with APIs using one or more JavaScript objects, which serve as containers for the data the API uses (contained in object properties), and the functionality the API makes available (contained in object methods).
Note: If you are not already familiar with how objects work, you should go back and work through our JavaScript objects module before continuing.
Let's return to the example of the Web Audio API — this is a fairly complex API, which consists of a number of objects. The most obvious ones are:
AudioContext, which represents an audio graph that can be used to manipulate audio playing inside the browser, and has a number of methods and properties available to manipulate that audio.
MediaElementAudioSourceNode, which represents an <audio> element containing sound you want to play and manipulate inside the audio context.
AudioDestinationNode, which represents the destination of the audio, i.e., the device on your computer that will actually output it — usually your speakers or headphones.
So how do these objects interact? If you look at our simple web audio example (see it live also), you'll first see the following HTML:
html
Copy to Clipboard
<audio src="outfoxing.mp3"></audio>


<button class="paused">Play</button>
<br />
<input type="range" min="0" max="1" step="0.01" value="1" class="volume" />

We, first of all, include an <audio> element with which we embed an MP3 into the page. We don't include any default browser controls. Next, we include a <button> that we'll use to play and stop the music, and an <input> element of type range, which we'll use to adjust the volume of the track while it's playing.
Next, let's look at the JavaScript for this example.
We start by creating an AudioContext instance inside which to manipulate our track:
js
Copy to Clipboard
const audioCtx = new AudioContext();

Next, we create constants that store references to our <audio>, <button>, and <input> elements, and use the AudioContext.createMediaElementSource() method to create a MediaElementAudioSourceNode representing the source of our audio — the <audio> element will be played from:
js
Copy to Clipboard
const audioElement = document.querySelector("audio");
const playBtn = document.querySelector("button");
const volumeSlider = document.querySelector(".volume");


const audioSource = audioCtx.createMediaElementSource(audioElement);

Next up we include a couple of event handlers that serve to toggle between play and pause when the button is pressed and reset the display back to the beginning when the song has finished playing:
js
Copy to Clipboard
// play/pause audio
playBtn.addEventListener("click", () => {
  // check if context is in suspended state (autoplay policy)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }


  // if track is stopped, play it
  if (playBtn.getAttribute("class") === "paused") {
    audioElement.play();
    playBtn.setAttribute("class", "playing");
    playBtn.textContent = "Pause";
    // if track is playing, stop it
  } else if (playBtn.getAttribute("class") === "playing") {
    audioElement.pause();
    playBtn.setAttribute("class", "paused");
    playBtn.textContent = "Play";
  }
});


// if track ends
audioElement.addEventListener("ended", () => {
  playBtn.setAttribute("class", "paused");
  playBtn.textContent = "Play";
});

Note: Some of you may notice that the play() and pause() methods being used to play and pause the track are not part of the Web Audio API; they are part of the HTMLMediaElement API, which is different but closely-related.
Next, we create a GainNode object using the AudioContext.createGain() method, which can be used to adjust the volume of audio fed through it, and create another event handler that changes the value of the audio graph's gain (volume) whenever the slider value is changed:
js
Copy to Clipboard
// volume
const gainNode = audioCtx.createGain();


volumeSlider.addEventListener("input", () => {
  gainNode.gain.value = volumeSlider.value;
});

The final thing to do to get this to work is to connect the different nodes in the audio graph up, which is done using the AudioNode.connect() method available on every node type:
js
Copy to Clipboard
audioSource.connect(gainNode).connect(audioCtx.destination);

The audio starts in the source, which is then connected to the gain node so the audio's volume can be adjusted. The gain node is then connected to the destination node so the sound can be played on your computer (the AudioContext.destination property represents whatever is the default AudioDestinationNode available on your computer's hardware, e.g., your speakers).
They have recognizable entry points
When using an API, you should make sure you know where the entry point is for the API. In The Web Audio API, this is pretty simple — it is the AudioContext object, which needs to be used to do any audio manipulation whatsoever.
The Document Object Model (DOM) API also has a simple entry point — its features tend to be found hanging off the Document object, or an instance of an HTML element that you want to affect in some way, for example:
js
Copy to Clipboard
const em = document.createElement("em"); // create a new em element
const para = document.querySelector("p"); // reference an existing p element
em.textContent = "Hello there!"; // give em some text content
para.appendChild(em); // embed em inside para

The Canvas API also relies on getting a context object to use to manipulate things, although in this case, it's a graphical context rather than an audio context. Its context object is created by getting a reference to the <canvas> element you want to draw on, and then calling its HTMLCanvasElement.getContext() method:
js
Copy to Clipboard
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

Anything that we want to do to the canvas is then achieved by calling properties and methods of the context object (which is an instance of CanvasRenderingContext2D), for example:
js
Copy to Clipboard
Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

Note: You can see this code in action in our bouncing balls demo (see it running live also).
They often use events to handle changes in state
We already discussed events earlier on in the course in our Introduction to events article, which looks in detail at what client-side web events are and how they are used in your code. If you are not already familiar with how client-side web API events work, you should go and read this article first before continuing.
Some web APIs contain no events, but most contain at least a few. The handler properties that allow us to run functions when events fire are generally listed in our reference material in separate "Event handlers" sections.
We already saw a number of event handlers in use in our Web Audio API example above:
js
Copy to Clipboard
// play/pause audio
playBtn.addEventListener("click", () => {
  // check if context is in suspended state (autoplay policy)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }


  // if track is stopped, play it
  if (playBtn.getAttribute("class") === "paused") {
    audioElement.play();
    playBtn.setAttribute("class", "playing");
    playBtn.textContent = "Pause";
    // if track is playing, stop it
  } else if (playBtn.getAttribute("class") === "playing") {
    audioElement.pause();
    playBtn.setAttribute("class", "paused");
    playBtn.textContent = "Play";
  }
});


// if track ends
audioElement.addEventListener("ended", () => {
  playBtn.setAttribute("class", "paused");
  playBtn.textContent = "Play";
});

They have additional security mechanisms where appropriate
WebAPI features are subject to the same security considerations as JavaScript and other web technologies (for example same-origin policy), but they sometimes have additional security mechanisms in place. For example, some of the more modern WebAPIs will only work on pages served over HTTPS due to them transmitting potentially sensitive data (examples include Service Workers and Push).
In addition, some WebAPIs request permission to be enabled from the user once calls to them are made in your code. As an example, the Notifications API asks for permission using a pop-up dialog box:

The Web Audio and HTMLMediaElement APIs are subject to a security mechanism called autoplay policy — this basically means that you can't automatically play audio when a page loads — you've got to allow your users to initiate audio play through a control like a button. This is done because autoplaying audio is usually really annoying and we really shouldn't be subjecting our users to it.
Note: Depending on how strict the browser is, such security mechanisms might even stop the example from working locally, i.e., if you load the local example file in your browser instead of running it from a web server. At the time of writing, our Web Audio API example wouldn't work locally on Google Chrome — we had to upload it to GitHub before it would work.
Summary
At this point, you should have a good idea of what APIs are, how they work, and what you can do with them in your JavaScript code. You are probably excited to start actually doing some fun things with specific APIs, so let's go! Next up, we'll look at video and audio APIs.
Drawing graphics
Previous


Overview: Client-side web APIs


Next


The browser contains some very powerful graphics programming tools, from the Scalable Vector Graphics (SVG) language, to APIs for drawing on HTML <canvas> elements, (see The Canvas API and WebGL). This article provides an introduction to canvas, and further resources to allow you to learn more.
Prerequisites:
Familiarity with HTML, CSS, and JavaScript, especially JavaScript object basics and core API coverage such as DOM scripting and Network requests.
Learning outcomes:
The concepts and use cases enabled by the APIs covered in this lesson.
Basic syntax and usage of <canvas> and associated APIs.
Using timers and requestAnimationFrame() to set up animation loops.


Graphics on the Web
The Web was originally just text, which was very boring, so images were introduced — first via the <img> element and later via CSS properties such as background-image, and SVG.
This however was still not enough. While you could use CSS and JavaScript to animate (and otherwise manipulate) SVG vector images — as they are represented by markup — there was still no way to do the same for bitmap images, and the tools available were rather limited. The Web still had no way to effectively create animations, games, 3D scenes, and other requirements commonly handled by lower level languages such as C++ or Java.
The situation started to improve when browsers began to support the <canvas> element and associated Canvas API in 2004. As you'll see below, canvas provides some useful tools for creating 2D animations, games, data visualizations, and other types of applications, especially when combined with some of the other APIs the web platform provides, but can be difficult or impossible to make accessible
The below example shows a simple 2D canvas-based bouncing balls animation that we originally met in our Introducing JavaScript objects module:
Around 2006–2007, Mozilla started work on an experimental 3D canvas implementation. This became WebGL, which gained traction among browser vendors, and was standardized around 2009–2010. WebGL allows you to create real 3D graphics inside your web browser; the below example shows a simple rotating WebGL cube:
This article will focus mainly on 2D canvas, as raw WebGL code is very complex. We will however show how to use a WebGL library to create a 3D scene more easily, and you can find a tutorial covering raw WebGL elsewhere — see Getting started with WebGL.
Active learning: Getting started with a <canvas>
If you want to create a 2D or 3D scene on a web page, you need to start with an HTML <canvas> element. This element is used to define the area on the page into which the image will be drawn. This is as simple as including the element on the page:
html
Copy to Clipboard
<canvas width="320" height="240"></canvas>
This will create a canvas on the page with a size of 320 by 240 pixels.
You should put some fallback content inside the <canvas> tags. This should describe the canvas content to users of browsers that don't support canvas, or users of screen readers.
html
Copy to Clipboard
<canvas width="320" height="240">
  <p>Description of the canvas for those unable to view it.</p>
</canvas>
The fallback should provide useful alternative content to the canvas content. For example, if you are rendering a constantly updating graph of stock prices, the fallback content could be a static image of the latest stock graph, with alt text saying what the prices are in text or a list of links to individual stock pages.
Note: Canvas content is not accessible to screen readers. Include descriptive text as the value of the aria-label attribute directly on the canvas element itself or include fallback content placed within the opening and closing <canvas> tags. Canvas content is not part of the DOM, but nested fallback content is.
Creating and sizing our canvas
Let's start by creating our own canvas that we draw future experiments on to.
First make a local copy of the 0_canvas_start directory. It contains three files:
"index.html"
"script.js"
"style.css"
Open "index.html", and add the following code into it, just below the opening <body> tag:
html
Copy to Clipboard
<canvas class="myCanvas">
  <p>Add suitable fallback here.</p>
</canvas>
We have added a class to the <canvas> element so it will be easier to select if we have multiple canvases on the page, but we have removed the width and height attributes for now (you could add them back in if you wanted, but we will set them using JavaScript in a below section). Canvases with no explicit width and height default to 300 pixels wide by 150 pixels high.
Now open "script.js" and add the following lines of JavaScript:
js
Copy to Clipboard
const canvas = document.querySelector(".myCanvas");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
Here we have stored a reference to the canvas in the canvas constant. In the second line we set both a new constant width and the canvas' width property equal to Window.innerWidth (which gives us the viewport width). In the third line we set both a new constant height and the canvas' height property equal to Window.innerHeight (which gives us the viewport height). So now we have a canvas that fills the entire width and height of the browser window!
You'll also see that we are chaining assignments together with multiple equals signs — this is allowed in JavaScript, and it is a good technique if you want to make multiple variables all equal to the same value. We wanted to make the canvas width and height easily accessible in the width/height variables, as they are useful values to have available for later (for example, if you want to draw something exactly halfway across the width of the canvas).
Note: You should generally set the size of the image using HTML attributes or DOM properties, as explained above. You could use CSS, but the trouble then is that the sizing is done after the canvas has rendered, and just like any other image (the rendered canvas is just an image), the image could become pixelated/distorted.
Getting the canvas context and final setup
We need to do one final thing before we can consider our canvas template finished. To draw onto the canvas we need to get a special reference to the drawing area called a context. This is done using the HTMLCanvasElement.getContext() method, which for basic usage takes a single string as a parameter representing the type of context you want to retrieve.
In this case we want a 2d canvas, so add the following JavaScript line below the others in "script.js":
js
Copy to Clipboard
const ctx = canvas.getContext("2d");
Note: Other context values you could choose include webgl for WebGL, webgl2 for WebGL 2, etc., but we won't need those in this article.
So that's it — our canvas is now primed and ready for drawing on! The ctx variable now contains a CanvasRenderingContext2D object, and all drawing operations on the canvas will involve manipulating this object.
Let's do one last thing before we move on. We'll color the canvas background black to give you a first taste of the canvas API. Add the following lines at the bottom of your JavaScript:
js
Copy to Clipboard
ctx.fillStyle = "rgb(0 0 0)";
ctx.fillRect(0, 0, width, height);
Here we are setting a fill color using the canvas' fillStyle property (this takes color values just like CSS properties do), then drawing a rectangle that covers the entire area of the canvas with the fillRect method (the first two parameters are the coordinates of the rectangle's top left-hand corner; the last two are the width and height you want the rectangle drawn at — we told you those width and height variables would be useful)!
OK, our template is done and it's time to move on.
2D canvas basics
As we said above, all drawing operations are done by manipulating a CanvasRenderingContext2D object (in our case, ctx). Many operations need to be given coordinates to pinpoint exactly where to draw something — the top left of the canvas is point (0, 0), the horizontal (x) axis runs from left to right, and the vertical (y) axis runs from top to bottom.

Drawing shapes tends to be done using the rectangle shape primitive, or by tracing a line along a certain path and then filling in the shape. Below we'll show how to do both.
Simple rectangles
Let's start with some simple rectangles.
First of all, take a copy of your newly coded canvas template (or make a local copy of the 1_canvas_template directory if you didn't follow the above steps).
Next, add the following lines to the bottom of your JavaScript:
js
Copy to Clipboard
ctx.fillStyle = "rgb(255 0 0)";
ctx.fillRect(50, 50, 100, 150);
If you save and refresh, you should see a red rectangle has appeared on your canvas. Its top left corner is 50 pixels away from the top and left of the canvas edge (as defined by the first two parameters), and it is 100 pixels wide and 150 pixels tall (as defined by the third and fourth parameters).
Let's add another rectangle into the mix — a green one this time. Add the following at the bottom of your JavaScript:
js
Copy to Clipboard
ctx.fillStyle = "rgb(0 255 0)";
ctx.fillRect(75, 75, 100, 100);
Save and refresh, and you'll see your new rectangle. This raises an important point: graphics operations like drawing rectangles, lines, and so forth are performed in the order in which they occur. Think of it like painting a wall, where each coat of paint overlaps and may even hide what's underneath. You can't do anything to change this, so you have to think carefully about the order in which you draw the graphics.
Note that you can draw semi-transparent graphics by specifying a semi-transparent color, for example by using rgb(). The "alpha channel" defines the amount of transparency the color has. The higher its value, the more it will obscure whatever's behind it. Add the following to your code:
js
Copy to Clipboard
ctx.fillStyle = "rgb(255 0 255 / 75%)";
ctx.fillRect(25, 100, 175, 50);


Now try drawing some more rectangles of your own; have fun!
Strokes and line widths
So far we've looked at drawing filled rectangles, but you can also draw rectangles that are just outlines (called strokes in graphic design). To set the color you want for your stroke, you use the strokeStyle property; drawing a stroke rectangle is done using strokeRect.
Add the following to the previous example, again below the previous JavaScript lines:
js
Copy to Clipboard
ctx.strokeStyle = "rgb(255 255 255)";
ctx.strokeRect(25, 25, 175, 200);


The default width of strokes is 1 pixel; you can adjust the lineWidth property value to change this (it takes a number representing the number of pixels wide the stroke is). Add the following line in between the previous two lines:
js
Copy to Clipboard
ctx.lineWidth = 5;


Now you should see that your white outline has become much thicker! That's it for now. At this point your example should look like this:
Note: The finished code is available on GitHub as 2_canvas_rectangles.
Drawing paths
If you want to draw anything more complex than a rectangle, you need to draw a path. Basically, this involves writing code to specify exactly what path the pen should move along on your canvas to trace the shape you want to draw. Canvas includes functions for drawing straight lines, circles, Bézier curves, and more.
Let's start the section off by making a fresh copy of our canvas template (1_canvas_template), in which to draw the new example.
We'll be using some common methods and properties across all of the below sections:
beginPath() — start drawing a path at the point where the pen currently is on the canvas. On a new canvas, the pen starts out at (0, 0).
moveTo() — move the pen to a different point on the canvas, without recording or tracing the line; the pen "jumps" to the new position.
fill() — draw a filled shape by filling in the path you've traced so far.
stroke() — draw an outline shape by drawing a stroke along the path you've drawn so far.
You can also use features like lineWidth and fillStyle/strokeStyle with paths as well as rectangles.
A typical, simple path-drawing operation would look something like so:
js
Copy to Clipboard
ctx.fillStyle = "rgb(255 0 0)";
ctx.beginPath();
ctx.moveTo(50, 50);
// draw your path
ctx.fill();
Drawing lines
Let's draw an equilateral triangle on the canvas.
First of all, add the following helper function to the bottom of your code. This converts degree values to radians, which is useful because whenever you need to provide an angle value in JavaScript, it will nearly always be in radians, but humans usually think in degrees.
js
Copy to Clipboard
function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}


Next, start off your path by adding the following below your previous addition; here we set a color for our triangle, start drawing a path, and then move the pen to (50, 50) without drawing anything. That's where we'll start drawing our triangle.
js
Copy to Clipboard
ctx.fillStyle = "rgb(255 0 0)";
ctx.beginPath();
ctx.moveTo(50, 50);


Now add the following lines at the bottom of your script:
js
Copy to Clipboard
ctx.lineTo(150, 50);
const triHeight = 50 * Math.tan(degToRad(60));
ctx.lineTo(100, 50 + triHeight);
ctx.lineTo(50, 50);
ctx.fill();
Let's run through this in order:
First we draw a line across to (150, 50) — our path now goes 100 pixels to the right along the x axis.
Second, we work out the height of our equilateral triangle, using a bit of simple trigonometry. Basically, we are drawing the triangle pointing downwards. The angles in an equilateral triangle are always 60 degrees; to work out the height we can split it down the middle into two right-angled triangles, which will each have angles of 90 degrees, 60 degrees, and 30 degrees. In terms of the sides:
The longest side is called the hypotenuse
The side next to the 60 degree angle is called the adjacent — which we know is 50 pixels, as it is half of the line we just drew.
The side opposite the 60 degree angle is called the opposite, which is the height of the triangle we want to calculate.

One of the basic trigonometric formulae states that the length of the adjacent multiplied by the tangent of the angle is equal to the opposite, hence we come up with 50 * Math.tan(degToRad(60)). We use our degToRad() function to convert 60 degrees to radians, as Math.tan() expects an input value in radians.
With the height calculated, we draw another line to (100, 50 + triHeight). The X coordinate is simple; it must be halfway between the previous two X values we set. The Y value on the other hand must be 50 plus the triangle height, as we know the top of the triangle is 50 pixels from the top of the canvas.
The next line draws a line back to the starting point of the triangle.
Last of all, we run ctx.fill() to end the path and fill in the shape.
Drawing circles
Now let's look at how to draw a circle in canvas. This is accomplished using the arc() method, which draws all or part of a circle at a specified point.
Let's add an arc to our canvas — add the following to the bottom of your code:
js
Copy to Clipboard
ctx.fillStyle = "rgb(0 0 255)";
ctx.beginPath();
ctx.arc(150, 106, 50, degToRad(0), degToRad(360), false);
ctx.fill();
arc() takes six parameters. The first two specify the position of the arc's center (X and Y, respectively). The third is the circle's radius, the fourth and fifth are the start and end angles at which to draw the circle (so specifying 0 and 360 degrees gives us a full circle), and the sixth parameter defines whether the circle should be drawn counterclockwise (anticlockwise) or clockwise (false is clockwise).
Note: 0 degrees is horizontally to the right.
Let's try adding another arc:
js
Copy to Clipboard
ctx.fillStyle = "yellow";
ctx.beginPath();
ctx.arc(200, 106, 50, degToRad(-45), degToRad(45), true);
ctx.lineTo(200, 106);
ctx.fill();
The pattern here is very similar, but with two differences:
We have set the last parameter of arc() to true, meaning that the arc is drawn counterclockwise, which means that even though the arc is specified as starting at -45 degrees and ending at 45 degrees, we draw the arc around the 270 degrees not inside this portion. If you were to change true to false and then re-run the code, only the 90 degree slice of the circle would be drawn.
Before calling fill(), we draw a line to the center of the circle. This means that we get the rather nice Pac-Man-style cutout rendered. If you removed this line (try it!) then re-ran the code, you'd get just an edge of the circle chopped off between the start and end point of the arc. This illustrates another important point of the canvas — if you try to fill an incomplete path (i.e., one that is not closed), the browser fills in a straight line between the start and end point and then fills it in.
That's it for now; your final example should look like this:
Note: The finished code is available on GitHub as 3_canvas_paths.
Note: To find out more about advanced path drawing features such as Bézier curves, check out our Drawing shapes with canvas tutorial.
Text
Canvas also has features for drawing text. Let's explore these briefly. Start by making another fresh copy of our canvas template (1_canvas_template) in which to draw the new example.
Text is drawn using two methods:
fillText() — draws filled text.
strokeText() — draws outline (stroke) text.
Both of these take three properties in their basic usage: the text string to draw and the X and Y coordinates of the point to start drawing the text at. This works out as the bottom left corner of the text box (literally, the box surrounding the text you draw), which might confuse you as other drawing operations tend to start from the top left corner — bear this in mind.
There are also a number of properties to help control text rendering such as font, which lets you specify font family, size, etc. It takes as its value the same syntax as the CSS font property.
Canvas content is not accessible to screen readers. Text painted to the canvas is not available to the DOM, but must be made available to be accessible. In this example, we include the text as the value for aria-label.
Try adding the following block to the bottom of your JavaScript:
js
Copy to Clipboard
ctx.strokeStyle = "white";
ctx.lineWidth = 1;
ctx.font = "36px arial";
ctx.strokeText("Canvas text", 50, 50);


ctx.fillStyle = "red";
ctx.font = "48px georgia";
ctx.fillText("Canvas text", 50, 150);


canvas.setAttribute("aria-label", "Canvas text");
Here we draw two lines of text, one outline and the other stroke. The final example should look like so:
Note: The finished code is available on GitHub as 4_canvas_text.
Have a play and see what you can come up with! You can find more information on the options available for canvas text at Drawing text.
Drawing images onto canvas
It is possible to render external images onto your canvas. These can be simple images, frames from videos, or the content of other canvases. For the moment we'll just look at the case of using some simple images on our canvas.
As before, make another fresh copy of our canvas template (1_canvas_template) in which to draw the new example.
Images are drawn onto canvas using the drawImage() method. The simplest version takes three parameters — a reference to the image you want to render, and the X and Y coordinates of the image's top left corner.
Let's start by getting an image source to embed in our canvas. Add the following lines to the bottom of your JavaScript:
js
Copy to Clipboard
const image = new Image();
image.src = "firefox.png";
Here we create a new HTMLImageElement object using the Image() constructor. The returned object is the same type as that which is returned when you grab a reference to an existing <img> element. We then set its src attribute to equal our Firefox logo image. At this point, the browser starts loading the image.
We could now try to embed the image using drawImage(), but we need to make sure the image file has been loaded first, otherwise the code will fail. We can achieve this using the load event, which will only be fired when the image has finished loading. Add the following block below the previous one:
js
Copy to Clipboard
image.addEventListener("load", () => ctx.drawImage(image, 20, 20));
If you load your example in the browser now, you should see the image embedded in the canvas.
But there's more! What if we want to display only a part of the image, or to resize it? We can do both with the more complex version of drawImage(). Update your ctx.drawImage() line like so:
js
Copy to Clipboard
ctx.drawImage(image, 20, 20, 185, 175, 50, 50, 185, 175);


The first parameter is the image reference, as before.
Parameters 2 and 3 define the coordinates of the top left corner of the area you want to cut out of the loaded image, relative to the top-left corner of the image itself. Nothing to the left of the first parameter or above the second will be drawn.
Parameters 4 and 5 define the width and height of the area we want to cut out from the original image we loaded.
Parameters 6 and 7 define the coordinates at which you want to draw the top-left corner of the cut-out portion of the image, relative to the top-left corner of the canvas.
Parameters 8 and 9 define the width and height to draw the cut-out area of the image. In this case, we have specified the same dimensions as the original slice, but you could resize it by specifying different values.
When the image is meaningfully updated, the accessible description must also be updated.
js
Copy to Clipboard
canvas.setAttribute("aria-label", "Firefox Logo");


The final example should look like so:
Note: The finished code is available on GitHub as 5_canvas_images.
Loops and animations
We have so far covered some very basic uses of 2D canvas, but really you won't experience the full power of canvas unless you update or animate it in some way. After all, canvas does provide scriptable images! If you aren't going to change anything, then you might as well just use static images and save yourself all the work.
Creating a loop
Playing with loops in canvas is rather fun — you can run canvas commands inside a for (or other type of) loop just like any other JavaScript code.
Let's build an example.
Make another fresh copy of our canvas template (1_canvas_template) and open it in your code editor.
Add the following line to the bottom of your JavaScript. This contains a new method, translate(), which moves the origin point of the canvas:
js
Copy to Clipboard
ctx.translate(width / 2, height / 2);
This causes the coordinate origin (0, 0) to be moved to the center of the canvas, rather than being at the top left corner. This is very useful in many situations, like this one, where we want our design to be drawn relative to the center of the canvas.
Now add the following code to the bottom of the JavaScript:
js
Copy to Clipboard
function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}


function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


let length = 250;
let moveOffset = 20;


for (let i = 0; i < length; i++) {}
Here we are implementing the same degToRad() function we saw in the triangle example above, a rand() function that returns a random number between given lower and upper bounds, length and moveOffset variables (which we'll find out more about later), and an empty for loop.
The idea here is that we'll draw something on the canvas inside the for loop, and iterate on it each time so we can create something interesting. Add the following code inside your for loop:
js
Copy to Clipboard
ctx.fillStyle = `rgb(${255 - length} 0 ${255 - length} / 90%)`;
ctx.beginPath();
ctx.moveTo(moveOffset, moveOffset);
ctx.lineTo(moveOffset + length, moveOffset);
const triHeight = (length / 2) * Math.tan(degToRad(60));
ctx.lineTo(moveOffset + length / 2, moveOffset + triHeight);
ctx.lineTo(moveOffset, moveOffset);
ctx.fill();


length--;
moveOffset += 0.7;
ctx.rotate(degToRad(5));
So on each iteration, we:
Set the fillStyle to be a shade of slightly transparent purple, which changes each time based on the value of length. As you'll see later the length gets smaller each time the loop runs, so the effect here is that the color gets brighter with each successive triangle drawn.
Begin the path.
Move the pen to a coordinate of (moveOffset, moveOffset); This variable defines how far we want to move each time we draw a new triangle.
Draw a line to a coordinate of (moveOffset+length, moveOffset). This draws a line of length length parallel to the X axis.
Calculate the triangle's height, as before.
Draw a line to the downward-pointing corner of the triangle, then draw a line back to the start of the triangle.
Call fill() to fill in the triangle.
Update the variables that describe the sequence of triangles, so we can be ready to draw the next one. We decrease the length value by 1, so the triangles get smaller each time; increase moveOffset by a small amount so each successive triangle is slightly further away, and use another new function, rotate(), which allows us to rotate the entire canvas! We rotate it by 5 degrees before drawing the next triangle.
That's it! The final example should look like so:
At this point, we'd like to encourage you to play with the example and make it your own! For example:
Draw rectangles or arcs instead of triangles, or even embed images.
Play with the length and moveOffset values.
Introduce some random numbers using that rand() function we included above but didn't use.
Note: The finished code is available on GitHub as 6_canvas_for_loop.
Animations
The loop example we built above was fun, but really you need a constant loop that keeps going and going for any serious canvas applications (such as games and real time visualizations). If you think of your canvas as being like a movie, you really want the display to update on each frame to show the updated view, with an ideal refresh rate of 60 frames per second so that movement appears nice and smooth to the human eye.
There are a few JavaScript functions that will allow you to run functions repeatedly, several times a second, the best one for our purposes here being window.requestAnimationFrame(). It takes one parameter — the name of the function you want to run for each frame. The next time the browser is ready to update the screen, your function will get called. If that function draws the new update to your animation, then calls requestAnimationFrame() again just before the end of the function, the animation loop will continue to run. The loop ends when you stop calling requestAnimationFrame() or if you call window.cancelAnimationFrame() after calling requestAnimationFrame() but before the frame is called.
Note: It's good practice to call cancelAnimationFrame() from your main code when you're done using the animation, to ensure that no updates are still waiting to be run.
The browser works out complex details such as making the animation run at a consistent speed, and not wasting resources animating things that can't be seen.
To see how it works, let's quickly look again at our Bouncing Balls example (see it live, and also see the source code). The code for the loop that keeps everything moving looks like this:
js
Copy to Clipboard
function loop() {
  ctx.fillStyle = "rgb(0 0 0 / 25%)";
  ctx.fillRect(0, 0, width, height);


  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }


  requestAnimationFrame(loop);
}


loop();
We run the loop() function once at the bottom of the code to start the cycle, drawing the first animation frame; the loop() function then takes charge of calling requestAnimationFrame(loop) to run the next frame of the animation, again and again.
Note that on each frame we are completely clearing the canvas and redrawing everything. For every ball present we draw it, update its position, and check to see if it is colliding with any other balls. Once you've drawn a graphic to a canvas, there's no way to manipulate that graphic individually like you can with DOM elements. You can't move each ball around on the canvas, because once it's drawn, it's part of the canvas, and is not an individual accessible element or object. Instead, you have to erase and redraw, either by erasing the entire frame and redrawing everything, or by having code that knows exactly what parts need to be erased and only erases and redraws the minimum area of the canvas necessary.
Optimizing animation of graphics is an entire specialty of programming, with lots of clever techniques available. Those are beyond what we need for our example, though!
In general, the process of doing a canvas animation involves the following steps:
Clear the canvas contents (e.g., with fillRect() or clearRect()).
Save state (if necessary) using save() — this is needed when you want to save settings you've updated on the canvas before continuing, which is useful for more advanced applications.
Draw the graphics you are animating.
Restore the settings you saved in step 2, using restore()
Call requestAnimationFrame() to schedule drawing of the next frame of the animation.
Note: We won't cover save() and restore() here, but they are explained nicely in our Transformations tutorial (and the ones that follow it).
A simple character animation
Now let's create our own simple animation — we'll get a character from a certain rather awesome retro computer game to walk across the screen.
Make another fresh copy of our canvas template (1_canvas_template) and open it in your code editor.
Update the inner HTML to reflect the image:
html
Copy to Clipboard
<canvas class="myCanvas">
  <p>A man walking.</p>
</canvas>


At the bottom of the JavaScript, add the following line to once again make the coordinate origin sit in the middle of the canvas:
js
Copy to Clipboard
ctx.translate(width / 2, height / 2);


Now let's create a new HTMLImageElement object, set its src to the image we want to load, and add an onload event handler that will cause the draw() function to fire when the image is loaded:
js
Copy to Clipboard
const image = new Image();
image.src = "walk-right.png";
image.onload = draw;


Now we'll add some variables to keep track of the position the sprite is to be drawn on the screen, and the sprite number we want to display.
js
Copy to Clipboard
let sprite = 0;
let posX = 0;
Let's explain the spritesheet image (which we have respectfully borrowed from Mike Thomas' Walking cycle using CSS animation CodePen). The image looks like this:

It contains six sprites that make up the whole walking sequence — each one is 102 pixels wide and 148 pixels high. To display each sprite cleanly we will have to use drawImage() to chop out a single sprite image from the spritesheet and display only that part, like we did above with the Firefox logo. The X coordinate of the slice will have to be a multiple of 102, and the Y coordinate will always be 0. The slice size will always be 102 by 148 pixels.
Now let's insert an empty draw() function at the bottom of the code, ready for filling up with some code:
js
Copy to Clipboard
function draw() {}


The rest of the code in this section goes inside draw(). First, add the following line, which clears the canvas to prepare for drawing each frame. Notice that we have to specify the top-left corner of the rectangle as -(width/2), -(height/2) because we specified the origin position as width/2, height/2 earlier on.
js
Copy to Clipboard
ctx.fillRect(-(width / 2), -(height / 2), width, height);


Next, we'll draw our image using drawImage — the 9-parameter version. Add the following:
js
Copy to Clipboard
ctx.drawImage(image, sprite * 102, 0, 102, 148, 0 + posX, -74, 102, 148);
As you can see:
We specify image as the image to embed.
Parameters 2 and 3 specify the top-left corner of the slice to cut out of the source image, with the X value as sprite multiplied by 102 (where sprite is the sprite number between 0 and 5) and the Y value always 0.
Parameters 4 and 5 specify the size of the slice to cut out — 102 pixels by 148 pixels.
Parameters 6 and 7 specify the top-left corner of the box into which to draw the slice on the canvas — the X position is 0 + posX, meaning that we can alter the drawing position by altering the posX value.
Parameters 8 and 9 specify the size of the image on the canvas. We just want to keep its original size, so we specify 102 and 148 as the width and height.
Now we'll alter the sprite value after each draw — well, after some of them anyway. Add the following block to the bottom of the draw() function:
js
Copy to Clipboard
if (posX % 13 === 0) {
  if (sprite === 5) {
    sprite = 0;
  } else {
    sprite++;
  }
}
We are wrapping the whole block in if (posX % 13 === 0) { }. We use the modulo (%) operator (also known as the remainder operator) to check whether the posX value can be exactly divided by 13 with no remainder. If so, we move on to the next sprite by incrementing sprite (wrapping to 0 after we're done with sprite #5). This effectively means that we are only updating the sprite on every 13th frame, or roughly about 5 frames a second (requestAnimationFrame() calls us at up to 60 frames per second if possible). We are deliberately slowing down the frame rate because we only have six sprites to work with, and if we display one every 60th of a second, our character will move way too fast!
Inside the outer block we use an if...else statement to check whether the sprite value is at 5 (the last sprite, given that the sprite numbers run from 0 to 5). If we are showing the last sprite already, we reset sprite back to 0; if not we just increment it by 1.
Next we need to work out how to change the posX value on each frame — add the following code block just below your last one.
js
Copy to Clipboard
if (posX > width / 2) {
  let newStartPos = -(width / 2 + 102);
  posX = Math.ceil(newStartPos);
  console.log(posX);
} else {
  posX += 2;
}
We are using another if...else statement to see if the value of posX has become greater than width/2, which means our character has walked off the right edge of the screen. If so, we calculate a position that would put the character just to the left of the left side of the screen.
If our character hasn't yet walked off the edge of the screen, we increment posX by 2. This will make him move a little bit to the right the next time we draw him.
Finally, we need to make the animation loop by calling requestAnimationFrame() at the bottom of the draw() function:
js
Copy to Clipboard
window.requestAnimationFrame(draw);


That's it! The final example should look like so:
Note: The finished code is available on GitHub as 7_canvas_walking_animation.
A simple drawing application
As a final animation example, we'd like to show you a very simple drawing application, to illustrate how the animation loop can be combined with user input (like mouse movement, in this case). We won't get you to walk through and build this one; we'll just explore the most interesting parts of the code.
The example can be found on GitHub as 8_canvas_drawing_app, and you can play with it live below:
Let's look at the most interesting parts. First of all, we keep track of the mouse's X and Y coordinates and whether it is being clicked or not with three variables: curX, curY, and pressed. When the mouse moves, we fire a function set as the onmousemove event handler, which captures the current X and Y values. We also use onmousedown and onmouseup event handlers to change the value of pressed to true when the mouse button is pressed, and back to false again when it is released.
js
Copy to Clipboard
let curX;
let curY;
let pressed = false;


// update mouse pointer coordinates
document.addEventListener("mousemove", (e) => {
  curX = e.pageX;
  curY = e.pageY;
});


canvas.addEventListener("mousedown", () => (pressed = true));


canvas.addEventListener("mouseup", () => (pressed = false));
When the "Clear canvas" button is pressed, we run a simple function that clears the whole canvas back to black, the same way we've seen before:
js
Copy to Clipboard
clearBtn.addEventListener("click", () => {
  ctx.fillStyle = "rgb(0 0 0)";
  ctx.fillRect(0, 0, width, height);
});
The drawing loop is pretty simple this time around — if pressed is true, we draw a circle with a fill style equal to the value in the color picker, and a radius equal to the value set in the range input. We have to draw the circle 85 pixels above where we measured it from, because the vertical measurement is taken from the top of the viewport, but we are drawing the circle relative to the top of the canvas, which starts below the 85 pixel-high toolbar. If we drew it with just curY as the y coordinate, it would appear 85 pixels lower than the mouse position.
js
Copy to Clipboard
function draw() {
  if (pressed) {
    ctx.fillStyle = colorPicker.value;
    ctx.beginPath();
    ctx.arc(
      curX,
      curY - 85,
      sizePicker.value,
      degToRad(0),
      degToRad(360),
      false,
    );
    ctx.fill();
  }


  requestAnimationFrame(draw);
}


draw();
All <input> types are well supported. If a browser doesn't support an input type, it will fall back to a plain text fields.
WebGL
It's now time to leave 2D behind, and take a quick look at 3D canvas. 3D canvas content is specified using the WebGL API, which is a completely separate API from the 2D canvas API, even though they both render onto <canvas> elements.
WebGL is based on OpenGL (Open Graphics Library), and allows you to communicate directly with the computer's GPU. As such, writing raw WebGL is closer to low level languages such as C++ than regular JavaScript; it is quite complex but incredibly powerful.
Using a library
Because of its complexity, most people write 3D graphics code using a third party JavaScript library such as Three.js, PlayCanvas, or Babylon.js. Most of these work in a similar way, providing functionality to create primitive and custom shapes, position viewing cameras and lighting, covering surfaces with textures, and more. They handle the WebGL for you, letting you work on a higher level.
Yes, using one of these means learning another new API (a third party one, in this case), but they are a lot simpler than coding raw WebGL.
Recreating our cube
Let's look at an example of how to create something with a WebGL library. We'll choose Three.js, as it is one of the most popular ones. In this tutorial we'll create the 3D spinning cube we saw earlier.
To start with, make a local copy of threejs-cube/index.html in a new folder, then save a copy of metal003.png in the same folder. This is the image we'll use as a surface texture for the cube later on.
Next, create a new file called script.js, again in the same folder as before.
Next, you need to have the Three.js library installed. You can follow the environment setup steps described in the Building up a basic demo with Three.js so that you have Three.js working as expected.
Now we've got three.js attached to our page, we can start to write JavaScript that makes use of it into script.js. Let's start by creating a new scene — add the following into your script.js file:
js
Copy to Clipboard
const scene = new THREE.Scene();
The Scene() constructor creates a new scene, which represents the whole 3D world we are trying to display.
Next, we need a camera so we can see the scene. In 3D imagery terms, the camera represents a viewer's position in the world. To create a camera, add the following lines next:
js
Copy to Clipboard
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 5;
The PerspectiveCamera() constructor takes four arguments:
The field of view: How wide the area in front of the camera is that should be visible onscreen, in degrees.
The aspect ratio: Usually, this is the ratio of the scene's width divided by the scene's height. Using another value will distort the scene (which might be what you want, but usually isn't).
The near plane: How close to the camera objects can be before we stop rendering them to the screen. Think about how when you move your fingertip closer and closer to the space between your eyes, eventually you can't see it anymore.
The far plane: How far away things are from the camera before they are no longer rendered.
We also set the camera's position to be 5 distance units out of the Z axis, which, like in CSS, is out of the screen towards you, the viewer.
The third vital ingredient is a renderer. This is an object that renders a given scene, as viewed through a given camera. We'll create one for now using the WebGLRenderer() constructor, but we'll not use it till later. Add the following lines next:
js
Copy to Clipboard
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
The first line creates a new renderer, the second line sets the size at which the renderer will draw the camera's view, and the third line appends the <canvas> element created by the renderer to the document's <body>. Now anything the renderer draws will be displayed in our window.
Next, we want to create the cube we'll display on the canvas. Add the following chunk of code at the bottom of your JavaScript:
js
Copy to Clipboard
let cube;


const loader = new THREE.TextureLoader();


loader.load("metal003.png", (texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);


  const geometry = new THREE.BoxGeometry(2.4, 2.4, 2.4);
  const material = new THREE.MeshLambertMaterial({ map: texture });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);


  draw();
});
There's a bit more to take in here, so let's go through it in stages:
We first create a cube global variable so we can access our cube from anywhere in the code.
Next, we create a new TextureLoader object, then call load() on it. load() takes two parameters in this case (although it can take more): the texture we want to load (our PNG), and a function that will run when the texture has loaded.
Inside this function we use properties of the texture object to specify that we want a 2 x 2 repeat of the image wrapped around all sides of the cube. Next, we create a new BoxGeometry object and a new MeshLambertMaterial object, and bring them together in a Mesh to create our cube. An object typically requires a geometry (what shape it is) and a material (what its surface looks like).
Last of all, we add our cube to the scene, then call our draw() function to start off the animation.
Before we get to defining draw(), we'll add a couple of lights to the scene, to liven things up a bit; add the following blocks next:
js
Copy to Clipboard
const light = new THREE.AmbientLight("rgb(255 255 255)"); // soft white light
scene.add(light);


const spotLight = new THREE.SpotLight("rgb(255 255 255)");
spotLight.position.set(100, 1000, 1000);
spotLight.castShadow = true;
scene.add(spotLight);
An AmbientLight object is a kind of soft light that lightens the whole scene a bit, like the sun when you are outside. The SpotLight object, on the other hand, is a directional beam of light, more like a flashlight/torch (or a spotlight, in fact).
Last of all, let's add our draw() function to the bottom of the code:
js
Copy to Clipboard
function draw() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);


  requestAnimationFrame(draw);
}
This is fairly intuitive; on each frame, we rotate our cube slightly on its X and Y axes, then render the scene as viewed by our camera, then finally call requestAnimationFrame() to schedule drawing our next frame.
Let's have another quick look at what the finished product should look like:
You can find the finished code on GitHub.
Note: In our GitHub repo you can also find another interesting 3D cube example — Three.js Video Cube (see it live also). This uses getUserMedia() to take a video stream from a computer web cam and project it onto the side of the cube as a texture!
Summary
At this point, you should have a useful idea of the basics of graphics programming using Canvas and WebGL and what you can do with these APIs, as well as a good idea of where to go for further information. Have fun!
See also
Here we have covered only the real basics of canvas — there is so much more to learn! The below articles will take you further.
Canvas tutorial — A very detailed tutorial series explaining what you should know about 2D canvas in much more detail than was covered here. Essential reading.
WebGL tutorial — A series that teaches the basics of raw WebGL programming.
Building up a basic demo with Three.js — basic Three.js tutorial. We also have equivalent guides for PlayCanvas or Babylon.js.
Game development — the landing page for web games development on MDN. There are some really useful tutorials and techniques available here related to 2D and 3D canvas — see the Techniques and Tutorials menu options.
Examples
Violent theremin — Uses the Web Audio API to generate sound, and canvas to generate a pretty visualization to go along with it.
Voice change-o-matic — Uses a canvas to visualize real-time audio data from the Web Audio API.
Previous


Client-side storage
Previous


Overview: Client-side web APIs


Next


Modern web browsers support a number of ways for websites to store data on the user's computer — with the user's permission — then retrieve it when necessary. This lets you persist data for long-term storage, save sites or documents for offline use, retain user-specific settings for your site, and more. This article explains the very basics of how these work.
Prerequisites:
Familiarity with HTML, CSS, and JavaScript, especially JavaScript object basics and core API coverage such as DOM scripting and Network requests.
Learning outcomes:
The concepts of client-side storage and what the key technologies are to enable it — Web Storage API, cookies, Cache API, and the IndexedDB API.
Key use cases — maintaining state across reloads, persisting login and user personalization data, and local/offline working.
Using Web Storage for simple key-value pair storage, controlled by JavaScript.
Using IndexedDB to store more complex, structured data.
Using the Cache API and service workers for offline use-cases.

Client-side storage?
Elsewhere in the MDN learning area, we talked about the difference between static sites and dynamic sites. Most major modern websites are dynamic — they store data on the server using some kind of database (server-side storage), then run server-side code to retrieve needed data, insert it into static page templates, and serve the resulting HTML to the client to be displayed by the user's browser.
Client-side storage works on similar principles, but has different uses. It consists of JavaScript APIs that allow you to store data on the client (i.e., on the user's machine) and then retrieve it when needed. This has many distinct uses, such as:
Personalizing site preferences (e.g., showing a user's choice of custom widgets, color scheme, or font size).
Persisting previous site activity (e.g., storing the contents of a shopping cart from a previous session, remembering if a user was previously logged in).
Saving data and assets locally so a site will be quicker (and potentially less expensive) to download, or be usable without a network connection.
Saving web application generated documents locally for use offline
Often client-side and server-side storage are used together. For example, you could download a batch of music files (perhaps used by a web game or music player application), store them inside a client-side database, and play them as needed. The user would only have to download the music files once — on subsequent visits they would be retrieved from the database instead.
Note: There are limits to the amount of data you can store using client-side storage APIs (possibly both per individual API and cumulatively); the exact limit varies depending on the browser and possibly based on user settings. See Browser storage quotas and eviction criteria for more information.
Old school: Cookies
The concept of client-side storage has been around for a long time. Since the early days of the web, sites have used cookies to store information to personalize user experience on websites. They're the earliest form of client-side storage commonly used on the web.
These days, there are easier mechanisms available for storing client-side data, therefore we won't be teaching you how to use cookies in this article. However, this does not mean cookies are completely useless on the modern-day web — they are still used commonly to store data related to user personalization and state, e.g., session IDs and access tokens. For more information on cookies see our Using HTTP cookies article.
New school: Web Storage and IndexedDB
The "easier" features we mentioned above are as follows:
The Web Storage API provides a mechanism for storing and retrieving smaller, data items consisting of a name and a corresponding value. This is useful when you just need to store some simple data, like the user's name, whether they are logged in, what color to use for the background of the screen, etc.
The IndexedDB API provides the browser with a complete database system for storing complex data. This can be used for things from complete sets of customer records to even complex data types like audio or video files.
You'll learn more about these APIs below.
The Cache API
The Cache API is designed for storing HTTP responses to specific requests, and is very useful for doing things like storing website assets offline so the site can subsequently be used without a network connection. Cache is usually used in combination with the Service Worker API, although it doesn't have to be.
The use of Cache and Service Workers is an advanced topic, and we won't be covering it in great detail in this article, although we will show an example in the Offline asset storage section below.
Storing simple data — web storage
The Web Storage API is very easy to use — you store simple name/value pairs of data (limited to strings, numbers, etc.) and retrieve these values when needed.
Basic syntax
Let's show you how:
First, go to our web storage blank template on GitHub (open this in a new tab).
Open the JavaScript console of your browser's developer tools.
All of your web storage data is contained within two object-like structures inside the browser: sessionStorage and localStorage. The first one persists data for as long as the browser is open (the data is lost when the browser is closed) and the second one persists data even after the browser is closed and then opened again. We'll use the second one in this article as it is generally more useful.
The Storage.setItem() method allows you to save a data item in storage — it takes two parameters: the name of the item, and its value. Try typing this into your JavaScript console (change the value to your own name, if you wish!):
js
Copy to Clipboard
localStorage.setItem("name", "Chris");


The Storage.getItem() method takes one parameter — the name of a data item you want to retrieve — and returns the item's value. Now type these lines into your JavaScript console:
js
Copy to Clipboard
let myName = localStorage.getItem("name");
myName;
Upon typing in the second line, you should see that the myName variable now contains the value of the name data item.
The Storage.removeItem() method takes one parameter — the name of a data item you want to remove — and removes that item out of web storage. Type the following lines into your JavaScript console:
js
Copy to Clipboard
localStorage.removeItem("name");
myName = localStorage.getItem("name");
myName;
The third line should now return null — the name item no longer exists in the web storage.
The data persists!
One key feature of web storage is that the data persists between page loads (and even when the browser is shut down, in the case of localStorage). Let's look at this in action.
Open our web storage blank template again, but this time in a different browser to the one you've got this tutorial open in! This will make it easier to deal with.
Type these lines into the browser's JavaScript console:
js
Copy to Clipboard
localStorage.setItem("name", "Chris");
let myName = localStorage.getItem("name");
myName;
You should see the name item returned.
Now close down the browser and open it up again.
Enter the following lines again:
js
Copy to Clipboard
let myName = localStorage.getItem("name");
myName;
You should see that the value is still available, even though the browser has been closed and then opened again.
Separate storage for each domain
There is a separate data store for each domain (each separate web address loaded in the browser). You will see that if you load two websites (say google.com and amazon.com) and try storing an item on one website, it won't be available to the other website.
This makes sense — you can imagine the security issues that would arise if websites could see each other's data!
A more involved example
Let's apply this new-found knowledge by writing a working example to give you an idea of how web storage can be used. Our example will allow you to enter a name, after which the page will update to give you a personalized greeting. This state will also persist across page/browser reloads, because the name is stored in web storage.
You can find the example HTML at personal-greeting.html — this contains a website with a header, content, and footer, and a form for entering your name.

Let's build up the example, so you can understand how it works.
First, make a local copy of our personal-greeting.html file in a new directory on your computer.
Next, note how our HTML references a JavaScript file called index.js, with a line like <script src="index.js" defer></script>. We need to create this and write our JavaScript code into it. Create an index.js file in the same directory as your HTML file.
We'll start off by creating references to all the HTML features we need to manipulate in this example — we'll create them all as constants, as these references do not need to change in the lifecycle of the app. Add the following lines to your JavaScript file:
js
Copy to Clipboard
// create needed constants
const rememberDiv = document.querySelector(".remember");
const forgetDiv = document.querySelector(".forget");
const form = document.querySelector("form");
const nameInput = document.querySelector("#entername");
const submitBtn = document.querySelector("#submitname");
const forgetBtn = document.querySelector("#forgetname");


const h1 = document.querySelector("h1");
const personalGreeting = document.querySelector(".personal-greeting");


Next up, we need to include a small event listener to stop the form from actually submitting itself when the submit button is pressed, as this is not the behavior we want. Add this snippet below your previous code:
js
Copy to Clipboard
// Stop the form from submitting when a button is pressed
form.addEventListener("submit", (e) => e.preventDefault());


Now we need to add an event listener, the handler function of which will run when the "Say hello" button is clicked. The comments explain in detail what each bit does, but in essence here we are taking the name the user has entered into the text input box and saving it in web storage using setItem(), then running a function called nameDisplayCheck() that will handle updating the actual website text. Add this to the bottom of your code:
js
Copy to Clipboard
// run function when the 'Say hello' button is clicked
submitBtn.addEventListener("click", () => {
  // store the entered name in web storage
  localStorage.setItem("name", nameInput.value);
  // run nameDisplayCheck() to sort out displaying the personalized greetings and updating the form display
  nameDisplayCheck();
});


At this point we also need an event handler to run a function when the "Forget" button is clicked — this is only displayed after the "Say hello" button has been clicked (the two form states toggle back and forth). In this function we remove the name item from web storage using removeItem(), then again run nameDisplayCheck() to update the display. Add this to the bottom:
js
Copy to Clipboard
// run function when the 'Forget' button is clicked
forgetBtn.addEventListener("click", () => {
  // Remove the stored name from web storage
  localStorage.removeItem("name");
  // run nameDisplayCheck() to sort out displaying the generic greeting again and updating the form display
  nameDisplayCheck();
});


It is now time to define the nameDisplayCheck() function itself. Here we check whether the name item has been stored in web storage by using localStorage.getItem('name') as a conditional test. If the name has been stored, this call will evaluate to true; if not, the call will evaluate to false. If the call evaluates to true, we display a personalized greeting, display the "forget" part of the form, and hide the "Say hello" part of the form. If the call evaluates to false, we display a generic greeting and do the opposite. Again, put the following code at the bottom:
js
Copy to Clipboard
// define the nameDisplayCheck() function
function nameDisplayCheck() {
  // check whether the 'name' data item is stored in web Storage
  if (localStorage.getItem("name")) {
    // If it is, display personalized greeting
    const name = localStorage.getItem("name");
    h1.textContent = `Welcome, ${name}`;
    personalGreeting.textContent = `Welcome to our website, ${name}! We hope you have fun while you are here.`;
    // hide the 'remember' part of the form and show the 'forget' part
    forgetDiv.style.display = "block";
    rememberDiv.style.display = "none";
  } else {
    // if not, display generic greeting
    h1.textContent = "Welcome to our website ";
    personalGreeting.textContent =
      "Welcome to our website. We hope you have fun while you are here.";
    // hide the 'forget' part of the form and show the 'remember' part
    forgetDiv.style.display = "none";
    rememberDiv.style.display = "block";
  }
}


Last but not least, we need to run the nameDisplayCheck() function when the page is loaded. If we don't do this, then the personalized greeting will not persist across page reloads. Add the following to the bottom of your code:
js
Copy to Clipboard
nameDisplayCheck();


Your example is finished — well done! All that remains now is to save your code and test your HTML page in a browser. You can see our finished version running live here.
Note: There is another, slightly more complex example to explore at Using the Web Storage API.
Note: In the line <script src="index.js" defer></script> of the source for our finished version, the defer attribute specifies that the contents of the <script> element will not execute until the page has finished loading.
Storing complex data — IndexedDB
The IndexedDB API (sometimes abbreviated IDB) is a complete database system available in the browser in which you can store complex related data, the types of which aren't limited to simple values like strings or numbers. You can store videos, images, and pretty much anything else in an IndexedDB instance.
The IndexedDB API allows you to create a database, then create object stores within that database. Object stores are like tables in a relational database, and each object store can contain a number of objects. To learn more about the IndexedDB API, see Using IndexedDB.
However, this does come at a cost: IndexedDB is much more complex to use than the Web Storage API. In this section, we'll really only scratch the surface of what it is capable of, but we will give you enough to get started.
Working through a note storage example
Here we'll run you through an example that allows you to store notes in your browser and view and delete them whenever you like, getting you to build it up for yourself and explaining the most fundamental parts of IDB as we go along.
The app looks something like this:

Each note has a title and some body text, each individually editable. The JavaScript code we'll go through below has detailed comments to help you understand what's going on.
Getting started
First of all, make local copies of our index.html, style.css, and index-start.js files into a new directory on your local machine.
Have a look at the files. You'll see that the HTML defines a website with a header and footer, as well as a main content area that contains a place to display notes, and a form for entering new notes into the database. The CSS provides some styling to make it clearer what is going on. The JavaScript file contains five declared constants containing references to the <ul> element the notes will be displayed in, the title and body <input> elements, the <form> itself, and the <button>.
Rename your JavaScript file to index.js. You are now ready to start adding code to it.
Database initial setup
Now let's look at what we have to do in the first place, to actually set up a database.
Below the constant declarations, add the following lines:
js
Copy to Clipboard
// Create an instance of a db object for us to store the open database in
let db;
Here we are declaring a variable called db — this will later be used to store an object representing our database. We will use this in a few places, so we've declared it globally here to make things easier.
Next, add the following:
js
Copy to Clipboard
// Open our database; it is created if it doesn't already exist
// (see the upgradeneeded handler below)
const openRequest = window.indexedDB.open("notes_db", 1);
This line creates a request to open version 1 of a database called notes_db. If this doesn't already exist, it will be created for you by subsequent code. You will see this request pattern used very often throughout IndexedDB. Database operations take time. You don't want to hang the browser while you wait for the results, so database operations are asynchronous, meaning that instead of happening immediately, they will happen at some point in the future, and you get notified when they're done.
To handle this in IndexedDB, you create a request object (which can be called anything you like — we called it openRequest here, so it is obvious what it is for). You then use event handlers to run code when the request completes, fails, etc., which you'll see in use below.
Note: The version number is important. If you want to upgrade your database (for example, by changing the table structure), you have to run your code again with an increased version number, different schema specified inside the upgradeneeded handler (see below), etc. We won't cover upgrading databases in this tutorial.
Now add the following event handlers just below your previous addition:
js
Copy to Clipboard
// error handler signifies that the database didn't open successfully
openRequest.addEventListener("error", () =>
  console.error("Database failed to open"),
);


// success handler signifies that the database opened successfully
openRequest.addEventListener("success", () => {
  console.log("Database opened successfully");


  // Store the opened database object in the db variable. This is used a lot below
  db = openRequest.result;


  // Run the displayData() function to display the notes already in the IDB
  displayData();
});
The error event handler will run if the system comes back saying that the request failed. This allows you to respond to this problem. In our example, we just print a message to the JavaScript console.
The success event handler will run if the request returns successfully, meaning the database was successfully opened. If this is the case, an object representing the opened database becomes available in the openRequest.result property, allowing us to manipulate the database. We store this in the db variable we created earlier for later use. We also run a function called displayData(), which displays the data in the database inside the <ul>. We run it now so that the notes already in the database are displayed as soon as the page loads. You'll see displayData() defined later on.
Finally for this section, we'll add probably the most important event handler for setting up the database: upgradeneeded. This handler runs if the database has not already been set up, or if the database is opened with a bigger version number than the existing stored database (when performing an upgrade). Add the following code, below your previous handler:
js
Copy to Clipboard
// Set up the database tables if this has not already been done
openRequest.addEventListener("upgradeneeded", (e) => {
  // Grab a reference to the opened database
  db = e.target.result;


  // Create an objectStore in our database to store notes and an auto-incrementing key
  // An objectStore is similar to a 'table' in a relational database
  const objectStore = db.createObjectStore("notes_os", {
    keyPath: "id",
    autoIncrement: true,
  });


  // Define what data items the objectStore will contain
  objectStore.createIndex("title", "title", { unique: false });
  objectStore.createIndex("body", "body", { unique: false });


  console.log("Database setup complete");
});
This is where we define the schema (structure) of our database; that is, the set of columns (or fields) it contains. Here we first grab a reference to the existing database from the result property of the event's target (e.target.result), which is the request object. This is equivalent to the line db = openRequest.result; inside the success event handler, but we need to do this separately here because the upgradeneeded event handler (if needed) will run before the success event handler, meaning that the db value wouldn't be available if we didn't do this.
We then use IDBDatabase.createObjectStore() to create a new object store inside our opened database called notes_os. This is equivalent to a single table in a conventional database system. We've given it the name notes, and also specified an autoIncrement key field called id — in each new record this will automatically be given an incremented value — the developer doesn't need to set this explicitly. Being the key, the id field will be used to uniquely identify records, such as when deleting or displaying a record.
We also create two other indexes (fields) using the IDBObjectStore.createIndex() method: title (which will contain a title for each note), and body (which will contain the body text of the note).
So with this database schema set up, when we start adding records to the database, each one will be represented as an object along these lines:
json
Copy to Clipboard
{
  "title": "Buy milk",
  "body": "Need both cows milk and soy.",
  "id": 8
}

Adding data to the database
Now let's look at how we can add records to the database. This will be done using the form on our page.
Below your previous event handler, add the following line, which sets up a submit event handler that runs a function called addData() when the form is submitted (when the submit <button> is pressed leading to a successful form submission):
js
Copy to Clipboard
// Create a submit event handler so that when the form is submitted the addData() function is run
form.addEventListener("submit", addData);

Now let's define the addData() function. Add this below your previous line:
js
Copy to Clipboard
// Define the addData() function
function addData(e) {
  // prevent default - we don't want the form to submit in the conventional way
  e.preventDefault();


  // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
  const newItem = { title: titleInput.value, body: bodyInput.value };


  // open a read/write db transaction, ready for adding the data
  const transaction = db.transaction(["notes_os"], "readwrite");


  // call an object store that's already been added to the database
  const objectStore = transaction.objectStore("notes_os");


  // Make a request to add our newItem object to the object store
  const addRequest = objectStore.add(newItem);


  addRequest.addEventListener("success", () => {
    // Clear the form, ready for adding the next entry
    titleInput.value = "";
    bodyInput.value = "";
  });


  // Report on the success of the transaction completing, when everything is done
  transaction.addEventListener("complete", () => {
    console.log("Transaction completed: database modification finished.");


    // update the display of data to show the newly added item, by running displayData() again.
    displayData();
  });


  transaction.addEventListener("error", () =>
    console.log("Transaction not opened due to error"),
  );
}

This is quite complex; breaking it down, we:
Run Event.preventDefault() on the event object to stop the form actually submitting in the conventional manner (this would cause a page refresh and spoil the experience).
Create an object representing a record to enter into the database, populating it with values from the form inputs. Note that we don't have to explicitly include an id value — as we explained earlier, this is auto-populated.
Open a readwrite transaction against the notes_os object store using the IDBDatabase.transaction() method. This transaction object allows us to access the object store so we can do something to it, e.g., add a new record.
Access the object store using the IDBTransaction.objectStore() method, saving the result in the objectStore variable.
Add the new record to the database using IDBObjectStore.add(). This creates a request object, in the same fashion as we've seen before.
Add a bunch of event handlers to the request and the transaction objects to run code at critical points in the lifecycle. Once the request has succeeded, we clear the form inputs ready for entering the next note. Once the transaction has completed, we run the displayData() function again to update the display of notes on the page.
Displaying the data
We've referenced displayData() twice in our code already, so we'd probably better define it. Add this to your code, below the previous function definition:
js
Copy to Clipboard
// Define the displayData() function
function displayData() {
  // Here we empty the contents of the list element each time the display is updated
  // If you didn't do this, you'd get duplicates listed each time a new note is added
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }


  // Open our object store and then get a cursor - which iterates through all the
  // different data items in the store
  const objectStore = db.transaction("notes_os").objectStore("notes_os");
  objectStore.openCursor().addEventListener("success", (e) => {
    // Get a reference to the cursor
    const cursor = e.target.result;


    // If there is still another data item to iterate through, keep running this code
    if (cursor) {
      // Create a list item, h3, and p to put each data item inside when displaying it
      // structure the HTML fragment, and append it inside the list
      const listItem = document.createElement("li");
      const h3 = document.createElement("h3");
      const para = document.createElement("p");


      listItem.appendChild(h3);
      listItem.appendChild(para);
      list.appendChild(listItem);


      // Put the data from the cursor inside the h3 and para
      h3.textContent = cursor.value.title;
      para.textContent = cursor.value.body;


      // Store the ID of the data item inside an attribute on the listItem, so we know
      // which item it corresponds to. This will be useful later when we want to delete items
      listItem.setAttribute("data-note-id", cursor.value.id);


      // Create a button and place it inside each listItem
      const deleteBtn = document.createElement("button");
      listItem.appendChild(deleteBtn);
      deleteBtn.textContent = "Delete";


      // Set an event handler so that when the button is clicked, the deleteItem()
      // function is run
      deleteBtn.addEventListener("click", deleteItem);


      // Iterate to the next item in the cursor
      cursor.continue();
    } else {
      // Again, if list item is empty, display a 'No notes stored' message
      if (!list.firstChild) {
        const listItem = document.createElement("li");
        listItem.textContent = "No notes stored.";
        list.appendChild(listItem);
      }
      // if there are no more cursor items to iterate through, say so
      console.log("Notes all displayed");
    }
  });
}

Again, let's break this down:
First, we empty out the <ul> element's content, before then filling it with the updated content. If you didn't do this, you'd end up with a huge list of duplicated content being added to with each update.
Next, we get a reference to the notes_os object store using IDBDatabase.transaction() and IDBTransaction.objectStore() like we did in addData(), except here we are chaining them together in one line.
The next step is to use the IDBObjectStore.openCursor() method to open a request for a cursor — this is a construct that can be used to iterate over the records in an object store. We chain a success event handler onto the end of this line to make the code more concise — when the cursor is successfully returned, the handler is run.
We get a reference to the cursor itself (an IDBCursor object) using const cursor = e.target.result.
Next, we check to see if the cursor contains a record from the datastore (if (cursor){ }) — if so, we create a DOM fragment, populate it with the data from the record, and insert it into the page (inside the <ul> element). We also include a delete button that, when clicked, will delete that note by running the deleteItem() function, which we will look at in the next section.
At the end of the if block, we use the IDBCursor.continue() method to advance the cursor to the next record in the datastore, and run the content of the if block again. If there is another record to iterate to, this causes it to be inserted into the page, and then continue() is run again, and so on.
When there are no more records to iterate over, cursor will return undefined, and therefore the else block will run instead of the if block. This block checks whether any notes were inserted into the <ul> — if not, it inserts a message to say no note was stored.
Deleting a note
As stated above, when a note's delete button is pressed, the note is deleted. This is achieved by the deleteItem() function, which looks like so:
js
Copy to Clipboard
// Define the deleteItem() function
function deleteItem(e) {
  // retrieve the name of the task we want to delete. We need
  // to convert it to a number before trying to use it with IDB; IDB key
  // values are type-sensitive.
  const noteId = Number(e.target.parentNode.getAttribute("data-note-id"));


  // open a database transaction and delete the task, finding it using the id we retrieved above
  const transaction = db.transaction(["notes_os"], "readwrite");
  const objectStore = transaction.objectStore("notes_os");
  const deleteRequest = objectStore.delete(noteId);


  // report that the data item has been deleted
  transaction.addEventListener("complete", () => {
    // delete the parent of the button
    // which is the list item, so it is no longer displayed
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    console.log(`Note ${noteId} deleted.`);


    // Again, if list item is empty, display a 'No notes stored' message
    if (!list.firstChild) {
      const listItem = document.createElement("li");
      listItem.textContent = "No notes stored.";
      list.appendChild(listItem);
    }
  });
}

The first part of this could use some explaining — we retrieve the ID of the record to be deleted using Number(e.target.parentNode.getAttribute('data-note-id')) — recall that the ID of the record was saved in a data-note-id attribute on the <li> when it was first displayed. We do however need to pass the attribute through the global built-in Number() object as it is of datatype string, and therefore wouldn't be recognized by the database, which expects a number.
We then get a reference to the object store using the same pattern we've seen previously, and use the IDBObjectStore.delete() method to delete the record from the database, passing it the ID.
When the database transaction is complete, we delete the note's <li> from the DOM, and again do the check to see if the <ul> is now empty, inserting a note as appropriate.
So that's it! Your example should now work.
If you are having trouble with it, feel free to check it against our live example (see the source code also).
Storing complex data via IndexedDB
As we mentioned above, IndexedDB can be used to store more than just text strings. You can store just about anything you want, including complex objects such as video or image blobs. And it isn't much more difficult to achieve than any other type of data.
To demonstrate how to do it, we've written another example called IndexedDB video store (see it running live here also). When you first run the example, it downloads all the videos from the network, stores them in an IndexedDB database, and then displays the videos in the UI inside <video> elements. The second time you run it, it finds the videos in the database and gets them from there instead before displaying them — this makes subsequent loads much quicker and less bandwidth-hungry.
Let's walk through the most interesting parts of the example. We won't look at it all — a lot of it is similar to the previous example, and the code is well-commented.
For this example, we've stored the names of the videos to fetch in an array of objects:
js
Copy to Clipboard
const videos = [
  { name: "crystal" },
  { name: "elf" },
  { name: "frog" },
  { name: "monster" },
  { name: "pig" },
  { name: "rabbit" },
];


To start with, once the database is successfully opened we run an init() function. This loops through the different video names, trying to load a record identified by each name from the videos database.
If each video is found in the database (checked by seeing whether request.result evaluates to true — if the record is not present, it will be undefined), its video files (stored as blobs) and the video name are passed straight to the displayVideo() function to place them in the UI. If not, the video name is passed to the fetchVideoFromNetwork() function to, you guessed it, fetch the video from the network.
js
Copy to Clipboard
function init() {
  // Loop through the video names one by one
  for (const video of videos) {
    // Open transaction, get object store, and get() each video by name
    const objectStore = db.transaction("videos_os").objectStore("videos_os");
    const request = objectStore.get(video.name);
    request.addEventListener("success", () => {
      // If the result exists in the database (is not undefined)
      if (request.result) {
        // Grab the videos from IDB and display them using displayVideo()
        console.log("taking videos from IDB");
        displayVideo(
          request.result.mp4,
          request.result.webm,
          request.result.name,
        );
      } else {
        // Fetch the videos from the network
        fetchVideoFromNetwork(video);
      }
    });
  }
}


The following snippet is taken from inside fetchVideoFromNetwork() — here we fetch MP4 and WebM versions of the video using two separate fetch() requests. We then use the Response.blob() method to extract each response's body as a blob, giving us an object representation of the videos that can be stored and displayed later on.
We have a problem here though — these two requests are both asynchronous, but we only want to try to display or store the video when both promises have fulfilled. Fortunately there is a built-in method that handles such a problem — Promise.all(). This takes one argument — references to all the individual promises you want to check for fulfillment placed in an array — and returns a promise which is fulfilled when all the individual promises are fulfilled.
Inside the then() handler for this promise, we call the displayVideo() function like we did before to display the videos in the UI, then we also call the storeVideo() function to store those videos inside the database.
js
Copy to Clipboard
// Fetch the MP4 and WebM versions of the video using the fetch() function,
// then expose their response bodies as blobs
const mp4Blob = fetch(`videos/${video.name}.mp4`).then((response) =>
  response.blob(),
);
const webmBlob = fetch(`videos/${video.name}.webm`).then((response) =>
  response.blob(),
);


// Only run the next code when both promises have fulfilled
Promise.all([mp4Blob, webmBlob]).then((values) => {
  // display the video fetched from the network with displayVideo()
  displayVideo(values[0], values[1], video.name);
  // store it in the IDB using storeVideo()
  storeVideo(values[0], values[1], video.name);
});


Let's look at storeVideo() first. This is very similar to the pattern you saw in the previous example for adding data to the database — we open a readwrite transaction and get a reference to our videos_os object store, create an object representing the record to add to the database, then add it using IDBObjectStore.add().
js
Copy to Clipboard
// Define the storeVideo() function
function storeVideo(mp4, webm, name) {
  // Open transaction, get object store; make it a readwrite so we can write to the IDB
  const objectStore = db
    .transaction(["videos_os"], "readwrite")
    .objectStore("videos_os");


  // Add the record to the IDB using add()
  const request = objectStore.add({ mp4, webm, name });


  request.addEventListener("success", () =>
    console.log("Record addition attempt finished"),
  );
  request.addEventListener("error", () => console.error(request.error));
}


Finally, we have displayVideo(), which creates the DOM elements needed to insert the video in the UI and then appends them to the page. The most interesting parts of this are those shown below — to actually display our video blobs in a <video> element, we need to create object URLs (internal URLs that point to the video blobs stored in memory) using the URL.createObjectURL() method. Once that is done, we can set the object URLs to be the values of our <source> element's src attributes, and it works fine.
js
Copy to Clipboard
// Define the displayVideo() function
function displayVideo(mp4Blob, webmBlob, title) {
  // Create object URLs out of the blobs
  const mp4URL = URL.createObjectURL(mp4Blob);
  const webmURL = URL.createObjectURL(webmBlob);


  // Create DOM elements to embed video in the page
  const article = document.createElement("article");
  const h2 = document.createElement("h2");
  h2.textContent = title;
  const video = document.createElement("video");
  video.controls = true;
  const source1 = document.createElement("source");
  source1.src = mp4URL;
  source1.type = "video/mp4";
  const source2 = document.createElement("source");
  source2.src = webmURL;
  source2.type = "video/webm";


  // Embed DOM elements into page
  section.appendChild(article);
  article.appendChild(h2);
  article.appendChild(video);
  video.appendChild(source1);
  video.appendChild(source2);
}


Offline asset storage
The above example already shows how to create an app that will store large assets in an IndexedDB database, avoiding the need to download them more than once. This is already a great improvement to the user experience, but there is still one thing missing — the main HTML, CSS, and JavaScript files still need to be downloaded each time the site is accessed, meaning that it won't work when there is no network connection.

This is where Service workers and the closely-related Cache API come in.
A service worker is a JavaScript file that is registered against a particular origin (website, or part of a website at a certain domain) when it is accessed by a browser. When registered, it can control pages available at that origin. It does this by sitting between a loaded page and the network and intercepting network requests aimed at that origin.
When it intercepts a request, it can do anything you wish to it (see use case ideas), but the classic example is saving the network responses offline and then providing those in response to a request instead of the responses from the network. In effect, it allows you to make a website work completely offline.
The Cache API is another client-side storage mechanism, with a bit of a difference — it is designed to save HTTP responses, and so works very well with service workers.
A service worker example
Let's look at an example, to give you a bit of an idea of what this might look like. We have created another version of the video store example we saw in the previous section — this functions identically, except that it also saves the HTML, CSS, and JavaScript in the Cache API via a service worker, allowing the example to run offline!
See IndexedDB video store with service worker running live, and also see the source code.
Registering the service worker
The first thing to note is that there's an extra bit of code placed in the main JavaScript file (see index.js). First, we do a feature detection test to see if the serviceWorker member is available in the Navigator object. If this returns true, then we know that at least the basics of service workers are supported. Inside here we use the ServiceWorkerContainer.register() method to register a service worker contained in the sw.js file against the origin it resides at, so it can control pages in the same directory as it, or subdirectories. When its promise fulfills, the service worker is deemed registered.
js
Copy to Clipboard
// Register service worker to control making site work offline
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(
      "/learning-area/javascript/apis/client-side-storage/cache-sw/video-store-offline/sw.js",
    )
    .then(() => console.log("Service Worker Registered"));
}

Note: The given path to the sw.js file is relative to the site origin, not the JavaScript file that contains the code. The service worker is at https://mdn.github.io/learning-area/javascript/apis/client-side-storage/cache-sw/video-store-offline/sw.js. The origin is https://mdn.github.io, and therefore the given path has to be /learning-area/javascript/apis/client-side-storage/cache-sw/video-store-offline/sw.js. If you wanted to host this example on your own server, you'd have to change this accordingly. This is rather confusing, but it has to work this way for security reasons.
Installing the service worker
The next time any page under the service worker's control is accessed (e.g., when the example is reloaded), the service worker is installed against that page, meaning that it will start controlling it. When this occurs, an install event is fired against the service worker; you can write code inside the service worker itself that will respond to the installation.
Let's look at an example, in the sw.js file (the service worker). You'll see that the install listener is registered against self. This self keyword is a way to refer to the global scope of the service worker from inside the service worker file.
Inside the install handler, we use the ExtendableEvent.waitUntil() method, available on the event object, to signal that the browser shouldn't complete installation of the service worker until after the promise inside it has fulfilled successfully.
Here is where we see the Cache API in action. We use the CacheStorage.open() method to open a new cache object in which responses can be stored (similar to an IndexedDB object store). This promise fulfills with a Cache object representing the video-store cache. We then use the Cache.addAll() method to fetch a series of assets and add their responses to the cache.
js
Copy to Clipboard
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open("video-store")
      .then((cache) =>
        cache.addAll([
          "/learning-area/javascript/apis/client-side-storage/cache-sw/video-store-offline/",
          "/learning-area/javascript/apis/client-side-storage/cache-sw/video-store-offline/index.html",
          "/learning-area/javascript/apis/client-side-storage/cache-sw/video-store-offline/index.js",
          "/learning-area/javascript/apis/client-side-storage/cache-sw/video-store-offline/style.css",
        ]),
      ),
  );
});

That's it for now, installation done.
Responding to further requests
With the service worker registered and installed against our HTML page, and the relevant assets all added to our cache, we are nearly ready to go. There is only one more thing to do: write some code to respond to further network requests.
This is what the second bit of code in sw.js does. We add another listener to the service worker global scope, which runs the handler function when the fetch event is raised. This happens whenever the browser makes a request for an asset in the directory the service worker is registered against.
Inside the handler, we first log the URL of the requested asset. We then provide a custom response to the request, using the FetchEvent.respondWith() method.
Inside this block, we use CacheStorage.match() to check whether a matching request (i.e., matches the URL) can be found in any cache. This promise fulfills with the matching response if a match is found, or undefined if it isn't.
If a match is found, we return it as the custom response. If not, we fetch() the response from the network and return that instead.
js
Copy to Clipboard
self.addEventListener("fetch", (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});

And that is it for our service worker. There is a whole load more you can do with them — for a lot more detail, see the service worker cookbook. Many thanks to Paul Kinlan for his article Adding a Service Worker and Offline into your Web App, which inspired this example.
Testing the example offline
To test our service worker example, you'll need to load it a couple of times to make sure it is installed. Once this is done, you can:
Try unplugging your network/turning your Wi-Fi off.
Select File > Work Offline if you are using Firefox.
Go to the devtools, then choose Application > Service Workers, then check the Offline checkbox if you are using Chrome.
If you refresh your example page again, you should still see it load just fine. Everything is stored offline — the page assets in a cache, and the videos in an IndexedDB database.
Summary
That's it for now. We hope you've found our rundown of client-side storage technologies useful.
See also
Web storage API
IndexedDB API
Cookies
Service worker API


Third-party APIs
Previous


Overview: Client-side web APIs


The APIs we've covered so far are built into the browser, but not all APIs are. Many large websites and services such as Google Maps, Twitter, Facebook, PayPal, etc. provide APIs allowing developers to make use of their data (e.g., displaying your twitter stream on your blog) or services (e.g., using Facebook login to log in your users). This article looks at the difference between browser APIs and 3rd party APIs and shows some typical uses of the latter.
Prerequisites:
Familiarity with HTML, CSS, and JavaScript, especially JavaScript object basics and core API coverage such as DOM scripting and Network requests.
Learning outcomes:
The concepts behind third-party APIs and associated patterns such as API keys.
Using a third-party map API.
Using a RESTful API.
Using Google's YouTube APIs.

What are third party APIs?
Third party APIs are APIs provided by third parties — generally companies such as Facebook, Twitter, or Google — to allow you to access their functionality via JavaScript and use it on your site. One of the most obvious examples is using mapping APIs to display custom maps on your pages.
Let's look at a Simple Mapquest API example, and use it to illustrate how third-party APIs differ from browser APIs.
They are found on third-party servers
Browser APIs are built into the browser — you can access them from JavaScript immediately. For example, the Web Audio API we saw in the Introductory article is accessed using the native AudioContext object. For example:
js
Copy to Clipboard
const audioCtx = new AudioContext();
// …
const audioElement = document.querySelector("audio");
// …
const audioSource = audioCtx.createMediaElementSource(audioElement);
// etc.

Third party APIs, on the other hand, are located on third party servers. To access them from JavaScript you first need to connect to the API functionality and make it available on your page. This typically involves first linking to a JavaScript library available on the server via a <script> element, as seen in our Mapquest example:
html
Copy to Clipboard
<script
  src="https://api.mqcdn.com/sdk/mapquest-js/v1.3.2/mapquest.js"
  defer></script>
<link
  rel="stylesheet"
  href="https://api.mqcdn.com/sdk/mapquest-js/v1.3.2/mapquest.css" />

You can then start using the objects available in that library. For example:
js
Copy to Clipboard
const map = L.mapquest.map("map", {
  center: [53.480759, -2.242631],
  layers: L.mapquest.tileLayer("map"),
  zoom: 12,
});

Here we are creating a variable to store the map information in, then creating a new map using the mapquest.map() method, which takes as its parameters the ID of a <div> element you want to display the map in ('map'), and an options object containing the details of the particular map we want to display. In this case we specify the coordinates of the center of the map, a map layer of type map to show (created using the mapquest.tileLayer() method), and the default zoom level.
This is all the information the Mapquest API needs to plot a simple map. The server you are connecting to handles all the complicated stuff, like displaying the correct map tiles for the area being shown, etc.
Note: Some APIs handle access to their functionality slightly differently, requiring the developer to make an HTTP request to a specific URL pattern to retrieve data. These are called RESTful APIs — we'll show an example later on.
They usually require API keys
Security for browser APIs tends to be handled by permission prompts, as discussed in our first article. The purpose of these is so that the user knows what is going on in the websites they visit and is less likely to fall victim to someone using an API in a malicious way.
Third party APIs have a slightly different permissions system — they tend to use developer keys to allow developers access to the API functionality, which is more to protect the API vendor than the user.
You'll find a line similar to the following in the Mapquest API example:
js
Copy to Clipboard
L.mapquest.key = "YOUR-API-KEY-HERE";

This line specifies an API or developer key to use in your application — the developer of the application must apply to get a key, and then include it in their code to be allowed access to the API's functionality. In our example we've just provided a placeholder.
Note: When creating your own examples, you'll use your own API key in place of any placeholder.
Other APIs may require that you include the key in a slightly different way, but the pattern is relatively similar for most of them.
Requiring a key enables the API provider to hold users of the API accountable for their actions. When the developer has registered for a key, they are then known to the API provider, and action can be taken if they start to do anything malicious with the API (such as tracking people's location or trying to spam the API with loads of requests to stop it working, for example). The easiest action would be to just revoke their API privileges.
Extending the Mapquest example
Let's add some more functionality to the Mapquest example to show how to use some other features of the API.
To start this section, make yourself a copy of the mapquest starter file, in a new directory. If you've already cloned the examples repository, you'll already have a copy of this file, which you can find in the javascript/apis/third-party-apis/mapquest/start directory.
Next, you need to go to the Mapquest developer site, create an account, and then create a developer key to use with your example. (At the time of writing, it was called a "consumer key" on the site, and the key creation process also asked for an optional "callback URL". You don't need to fill in a URL here: just leave it blank.)
Open up your starting file, and replace the API key placeholder with your key.
Changing the type of map
There are a number of different types of map that can be shown with the Mapquest API. To do this, find the following line:
js
Copy to Clipboard
layers: L.mapquest.tileLayer("map"),

Try changing 'map' to 'hybrid' to show a hybrid-style map. Try some other values too. The tileLayer reference page shows the different available options, plus a lot more information.
Adding different controls
The map has a number of different controls available; by default it just shows a zoom control. You can expand the controls available using the map.addControl() method; add this to your code:
js
Copy to Clipboard
map.addControl(L.mapquest.control());

The mapquest.control() method just creates a simple full-featured control set, and it is placed in the top-right-hand corner by default. You can adjust the position by specifying an options object as a parameter for the control containing a position property, the value of which is a string specifying a position for the control. Try this, for example:
js
Copy to Clipboard
map.addControl(L.mapquest.control({ position: "bottomright" }));

There are other types of control available, for example mapquest.searchControl() and mapquest.satelliteControl(), and some are quite complex and powerful. Have a play around and see what you can come up with.
Adding a custom marker
Adding a marker (icon) at a certain point on the map is easy — you just use the L.marker() method (which seems to be documented in the related Leaflet.js docs). Add the following code to your example, again inside window.onload:
js
Copy to Clipboard
L.marker([53.480759, -2.242631], {
  icon: L.mapquest.icons.marker({
    primaryColor: "#22407F",
    secondaryColor: "#3B5998",
    shadow: true,
    size: "md",
    symbol: "A",
  }),
})
  .bindPopup("This is Manchester!")
  .addTo(map);

As you can see, this at its simplest takes two parameters, an array containing the coordinates at which to display the marker, and an options object containing an icon property that defines the icon to display at that point.
The icon is defined using an mapquest.icons.marker() method, which as you can see contains information such as color and size of marker.
Onto the end of the first method call we chain .bindPopup('This is Manchester!'), which defines content to display when the marker is clicked.
Finally, we chain .addTo(map) to the end of the chain to actually add the marker to the map.
Have a play with the other options shown in the documentation and see what you can come up with! Mapquest provides some pretty advanced functionality, such as directions, searching, etc.
Note: If you have trouble getting the example to work, check your code against our finished version.
A RESTful API — NYTimes
Now let's look at another API example — the New York Times API. This API allows you to retrieve New York Times news story information and display it on your site. This type of API is known as a RESTful API — instead of getting data using the features of a JavaScript library like we did with Mapquest, we get data by making HTTP requests to specific URLs, with data like search terms and other properties encoded in the URL (often as URL parameters). This is a common pattern you'll encounter with APIs.
Below we'll take you through an exercise to show you how to use the NYTimes API, which also provides a more general set of steps to follow that you can use as an approach for working with new APIs.
Find the documentation
When you want to use a third party API, it is essential to find out where the documentation is, so you can find out what features the API has, how you use them, etc. The New York Times API documentation is at https://developer.nytimes.com/.
Get a developer key
Most APIs require you to use some kind of developer key, for reasons of security and accountability. To sign up for an NYTimes API key, following the instructions at https://developer.nytimes.com/get-started.
Let's request a key for the Article Search API — create a new app, selecting this as the API you want to use (fill in a name and description, toggle the switch under the "Article Search API" to the on position, and then click "Create").
Get the API key from the resulting page.
Now, to start the example off, make a copy of all the files in the nytimes/start directory. If you've already cloned the examples repository, you'll already have a copy of these files, which you can find in the javascript/apis/third-party-apis/nytimes/start directory. Initially the script.js file contains a number of variables needed for the setup of the example; below we'll fill in the required functionality.
The app will end up allowing you to type in a search term and optional start and end dates, which it will then use to query the Article Search API and display the search results.

Connect the API to your app
First, you'll need to make a connection between the API and your app. In the case of this API, you need to include the API key as a get parameter every time you request data from the service at the correct URL.
Find the following line:
js
Copy to Clipboard
const key = "INSERT-YOUR-API-KEY-HERE";
Replace the existing API key with the actual API key you got in the previous section.
Add the following line to your JavaScript, below the // Event listeners to control the functionality comment. This runs a function called submitSearch() when the form is submitted (the button is pressed).
js
Copy to Clipboard
searchForm.addEventListener("submit", submitSearch);


Now add the submitSearch() and fetchResults() function definitions, below the previous line:
js
Copy to Clipboard
function submitSearch(e) {
  pageNumber = 0;
  fetchResults(e);
}


function fetchResults(e) {
  // Use preventDefault() to stop the form submitting
  e.preventDefault();


  // Assemble the full URL
  let url = `${baseURL}?api-key=${key}&page=${pageNumber}&q=${searchTerm.value}&fq=document_type:("article")`;


  if (startDate.value !== "") {
    url = `${url}&begin_date=${startDate.value}`;
  }


  if (endDate.value !== "") {
    url = `${url}&end_date=${endDate.value}`;
  }
}


submitSearch() sets the page number back to 0 to begin with, then calls fetchResults(). This first calls preventDefault() on the event object, to stop the form actually submitting (which would break the example). Next, we use some string manipulation to assemble the full URL that we will make the request to. We start off by assembling the parts we deem as mandatory for this demo:
The base URL (taken from the baseURL variable).
The API key, which has to be specified in the api-key URL parameter (the value is taken from the key variable).
The page number, which has to be specified in the page URL parameter (the value is taken from the pageNumber variable).
The search term, which has to be specified in the q URL parameter (the value is taken from the value of the searchTerm text <input>).
The document type to return results for, as specified in an expression passed in via the fq URL parameter. In this case, we want to return articles.
Next, we use a couple of if () statements to check whether the startDate and endDate elements have had values filled in on them. If they do, we append their values to the URL, specified in begin_date and end_date URL parameters respectively.
So, a complete URL would end up looking something like this:
url
Copy to Clipboard
https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=YOUR-API-KEY-HERE&page=0&q=cats&fq=document_type:("article")&begin_date=20170301&end_date=20170312

Note: You can find more details of what URL parameters can be included at the NYTimes developer docs.
Note: The example has rudimentary form data validation — the search term field has to be filled in before the form can be submitted (achieved using the required attribute), and the date fields have pattern attributes specified, which means they won't submit unless their values consist of 8 numbers (pattern="[0-9]{8}"). See Form data validation for more details on how these work.
Requesting data from the API
Now we've constructed our URL, let's make a request to it. We'll do this using the Fetch API.
Add the following code block inside the fetchResults() function, just above the closing curly brace:
js
Copy to Clipboard
// Use fetch() to make the request to the API
fetch(url)
  .then((response) => response.json())
  .then((json) => displayResults(json))
  .catch((error) => console.error(`Error fetching data: ${error.message}`));

Here we run the request by passing our url variable to fetch(), convert the response body to JSON using the json() function, then pass the resulting JSON to the displayResults() function so the data can be displayed in our UI. We also catch and log any errors that might be thrown.
Displaying the data
OK, let's look at how we'll display the data. Add the following function below your fetchResults() function.
js
Copy to Clipboard
function displayResults(json) {
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }


  const articles = json.response.docs;


  nav.style.display = articles.length === 10 ? "block" : "none";


  if (articles.length === 0) {
    const para = document.createElement("p");
    para.textContent = "No results returned.";
    section.appendChild(para);
  } else {
    for (const current of articles) {
      const article = document.createElement("article");
      const heading = document.createElement("h2");
      const link = document.createElement("a");
      const img = document.createElement("img");
      const para = document.createElement("p");
      const keywordPara = document.createElement("p");
      keywordPara.classList.add("keywords");


      console.log(current);


      link.href = current.web_url;
      link.textContent = current.headline.main;
      para.textContent = current.snippet;
      keywordPara.textContent = "Keywords: ";
      for (const keyword of current.keywords) {
        const span = document.createElement("span");
        span.textContent = `${keyword.value} `;
        keywordPara.appendChild(span);
      }


      if (current.multimedia.length > 0) {
        img.src = `http://www.nytimes.com/${current.multimedia[0].url}`;
        img.alt = current.headline.main;
      }


      article.appendChild(heading);
      heading.appendChild(link);
      article.appendChild(img);
      article.appendChild(para);
      article.appendChild(keywordPara);
      section.appendChild(article);
    }
  }
}

There's a lot of code here; let's explain it step by step:
The while loop is a common pattern used to delete all of the contents of a DOM element, in this case, the <section> element. We keep checking to see if the <section> has a first child, and if it does, we remove the first child. The loop ends when <section> no longer has any children.
Next, we set the articles variable to equal json.response.docs — this is the array holding all the objects that represent the articles returned by the search. This is done purely to make the following code a bit simpler.
The first if () block checks to see if 10 articles are returned (the API returns up to 10 articles at a time.) If so, we display the <nav> that contains the Previous 10/Next 10 pagination buttons. If fewer than 10 articles are returned, they will all fit on one page, so we don't need to show the pagination buttons. We will wire up the pagination functionality in the next section.
The next if () block checks to see if no articles are returned. If so, we don't try to display any — we create a <p> containing the text "No results returned." and insert it into the <section>.
If some articles are returned, we, first of all, create all the elements that we want to use to display each news story, insert the right contents into each one, and then insert them into the DOM at the appropriate places. To work out which properties in the article objects contained the right data to show, we consulted the Article Search API reference (see NYTimes APIs). Most of these operations are fairly obvious, but a few are worth calling out:
We used a for...of loop to go through all the keywords associated with each article, and insert each one inside its own <span>, inside a <p>. This was done to make it easy to style each one.
We used an if () block (if (current.multimedia.length > 0) { }) to check whether each article has any images associated with it, as some stories don't. We display the first image only if it exists; otherwise, an error would be thrown.
Wiring up the pagination buttons
To make the pagination buttons work, we will increment (or decrement) the value of the pageNumber variable, and then re-rerun the fetch request with the new value included in the page URL parameter. This works because the NYTimes API only returns 10 results at a time — if more than 10 results are available, it will return the first 10 (0-9) if the page URL parameter is set to 0 (or not included at all — 0 is the default value), the next 10 (10-19) if it is set to 1, and so on.
This allows us to write a simplistic pagination function.
Below the existing addEventListener() call, add these two new ones, which cause the nextPage() and previousPage() functions to be invoked when the relevant buttons are clicked:
js
Copy to Clipboard
nextBtn.addEventListener("click", nextPage);
previousBtn.addEventListener("click", previousPage);


Below your previous addition, let's define the two functions — add this code now:
js
Copy to Clipboard
function nextPage(e) {
  pageNumber++;
  fetchResults(e);
}


function previousPage(e) {
  if (pageNumber > 0) {
    pageNumber--;
  } else {
    return;
  }
  fetchResults(e);
}
The first function increments the pageNumber variable, then run the fetchResults() function again to display the next page's results.
The second function works nearly exactly the same way in reverse, but we also have to take the extra step of checking that pageNumber is not already zero before decrementing it — if the fetch request runs with a minus page URL parameter, it could cause errors. If the pageNumber is already 0, we return out of the function — if we are already at the first page, we don't need to load the same results again.
Note: You can find our finished NYTimes API example code on GitHub (also see it running live here).
YouTube example
We also built another example for you to study and learn from — see our YouTube video search example. This uses two related APIs:
The YouTube Data API to search for YouTube videos and return results.
The YouTube IFrame Player API to display the returned video examples inside IFrame video players so you can watch them.
This example is interesting because it shows two related third-party APIs being used together to build an app. The first one is a RESTful API, while the second one works more like Mapquest (with API-specific methods, etc.). It is worth noting however that both of the APIs require a JavaScript library to be applied to the page. The RESTful API has functions available to handle making the HTTP requests and returning the results.

We are not going to say too much more about this example in the article — the source code has detailed comments inserted inside it to explain how it works.
To get it running, you'll need to:
Read the YouTube Data API Overview documentation.
Make sure you visit the Enabled APIs page, and in the list of APIs, make sure the status is ON for the YouTube Data API v3.
Get an API key from Google Cloud.
Find the string ENTER-API-KEY-HERE in the source code, and replace it with your API key.
Run the example through a web server. It won't work if you just run it directly in the browser (i.e., via a file:// URL).
Summary
This article has given you a useful introduction to using third-party APIs to add functionality to your websites.
Asynchronous JavaScript
Overview: Extension modules


Next


In this module, we take a look at asynchronous JavaScript, why it is important, and how it can be used to effectively handle potential blocking operations, such as fetching resources from a server.
Prerequisites
Asynchronous JavaScript is a fairly advanced topic, and you are advised to work through Dynamic scripting with JavaScript modules before attempting this.
Note: If you are working on a computer, tablet, or another device where you can't create files, you can try running the code in an online editor such as CodePen or JSFiddle.
Tutorials and challenges
Introducing asynchronous JavaScript
In this article, we'll learn about synchronous and asynchronous programming, why we often need to use asynchronous techniques, and the problems related to the way asynchronous functions have historically been implemented in JavaScript.
How to use promises
Here we'll introduce promises and show how to use promise-based APIs. We'll also introduce the async and await keywords.
Implementing a promise-based API
This article will outline how to implement your own promise-based API.
Introducing workers
Workers enable you to run certain tasks in a separate thread to keep your main code responsive. In this article, we'll rewrite a long-running synchronous function to use a worker.
Sequencing animations Challenge
This challenge asks you to use promises to play a set of animations in a particular sequence.
See also
Asynchronous Programming from the fantastic Eloquent JavaScript online book by Marijn Haverbeke.






Introducing asynchronous JavaScript
Overview: Asynchronous JavaScript


Next


In this article, we'll explain what asynchronous programming is, why we need it, and briefly discuss some of the ways asynchronous functions have historically been implemented in JavaScript.
Prerequisites:
A solid understanding of JavaScript fundamentals.
Learning outcomes:
To gain familiarity with what asynchronous JavaScript is, how it differs from synchronous JavaScript, and why we need it.
What synchronous programming is, and why it can sometimes be problematic.
How asynchronous programming aims to solve these problems.
Event handlers and callback functions, and how they relate to asynchronous programming.

Asynchronous programming is a technique that enables your program to start a potentially long-running task and still be able to be responsive to other events while that task runs, rather than having to wait until that task has finished. Once that task has finished, your program is presented with the result.
Many functions provided by browsers, especially the most interesting ones, can potentially take a long time, and therefore, are asynchronous. For example:
Making HTTP requests using fetch()
Accessing a user's camera or microphone using getUserMedia()
Asking a user to select files using showOpenFilePicker()
So even though you may not have to implement your own asynchronous functions very often, you are very likely to need to use them correctly.
In this article, we'll start by looking at the problem with long-running synchronous functions, which make asynchronous programming a necessity.
Synchronous programming
Consider the following code:
js
Copy to Clipboard
const name = "Miriam";
const greeting = `Hello, my name is ${name}!`;
console.log(greeting);
// "Hello, my name is Miriam!"

This code:
Declares a string called name.
Declares another string called greeting, which uses name.
Outputs the greeting to the JavaScript console.
We should note here that the browser effectively steps through the program one line at a time, in the order we wrote it. At each point, the browser waits for the line to finish its work before going on to the next line. It has to do this because each line depends on the work done in the preceding lines.
That makes this a synchronous program. It would still be synchronous even if we called a separate function, like this:
js
Copy to Clipboard
function makeGreeting(name) {
  return `Hello, my name is ${name}!`;
}


const name = "Miriam";
const greeting = makeGreeting(name);
console.log(greeting);
// "Hello, my name is Miriam!"

Here, makeGreeting() is a synchronous function because the caller has to wait for the function to finish its work and return a value before the caller can continue.
A long-running synchronous function
What if the synchronous function takes a long time?
The program below uses a very inefficient algorithm to generate multiple large prime numbers when a user clicks the "Generate primes" button. The higher the number of primes a user specifies, the longer the operation will take.
html
Copy to Clipboard
play
<label for="quota">Number of primes:</label>
<input type="text" id="quota" name="quota" value="1000000" />


<button id="generate">Generate primes</button>
<button id="reload">Reload</button>


<div id="output"></div>

js
Copy to Clipboard
play
const MAX_PRIME = 1000000;


function isPrime(n) {
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return n > 1;
}


const random = (max) => Math.floor(Math.random() * max);


function generatePrimes(quota) {
  const primes = [];
  while (primes.length < quota) {
    const candidate = random(MAX_PRIME);
    if (isPrime(candidate)) {
      primes.push(candidate);
    }
  }
  return primes;
}


const quota = document.querySelector("#quota");
const output = document.querySelector("#output");


document.querySelector("#generate").addEventListener("click", () => {
  const primes = generatePrimes(quota.value);
  output.textContent = `Finished generating ${quota.value} primes!`;
});


document.querySelector("#reload").addEventListener("click", () => {
  document.location.reload();
});

play
Try clicking "Generate primes". Depending on how fast your computer is, it will probably take a few seconds before the program displays the "Finished!" message.
The trouble with long-running synchronous functions
The next example is just like the last one, except we added a text box for you to type in. This time, click "Generate primes", and try typing in the text box immediately after.
You'll find that while our generatePrimes() function is running, our program is completely unresponsive: you can't type anything, click anything, or do anything else.
play
The reason for this is that this JavaScript program is single-threaded. A thread is a sequence of instructions that a program follows. Because the program consists of a single thread, it can only do one thing at a time: so if it is waiting for our long-running synchronous call to return, it can't do anything else.
What we need is a way for our program to:
Start a long-running operation by calling a function.
Have that function start the operation and return immediately, so that our program can still be responsive to other events.
Have the function execute the operation in a way that does not block the main thread, for example by starting a new thread.
Notify us with the result of the operation when it eventually completes.
That's precisely what asynchronous functions enable us to do. The rest of this module explains how they are implemented in JavaScript.
Event handlers
The description we just saw of asynchronous functions might remind you of event handlers, and if it does, you'd be right. Event handlers are really a form of asynchronous programming: you provide a function (the event handler) that will be called, not right away, but whenever the event happens. If "the event" is "the asynchronous operation has completed", then that event could be used to notify the caller about the result of an asynchronous function call.
Some early asynchronous APIs used events in just this way. The XMLHttpRequest API enables you to make HTTP requests to a remote server using JavaScript. Since this can take a long time, it's an asynchronous API, and you get notified about the progress and eventual completion of a request by attaching event listeners to the XMLHttpRequest object.
The following example shows this in action. Press "Click to start request" to send a request. We create a new XMLHttpRequest and listen for its loadend event. The handler logs a "Finished!" message along with the status code.
After adding the event listener we send the request. Note that after this, we can log "Started XHR request": that is, our program can continue to run while the request is going on, and our event handler will be called when the request is complete.
html
Copy to Clipboard
play
<button id="xhr">Click to start request</button>
<button id="reload">Reload</button>


<pre readonly class="event-log"></pre>

js
Copy to Clipboard
play
const log = document.querySelector(".event-log");


document.querySelector("#xhr").addEventListener("click", () => {
  log.textContent = "";


  const xhr = new XMLHttpRequest();


  xhr.addEventListener("loadend", () => {
    log.textContent = `${log.textContent}Finished with status: ${xhr.status}`;
  });


  xhr.open(
    "GET",
    "https://raw.githubusercontent.com/mdn/content/main/files/en-us/_wikihistory.json",
  );
  xhr.send();
  log.textContent = `${log.textContent}Started XHR request\n`;
});


document.querySelector("#reload").addEventListener("click", () => {
  log.textContent = "";
  document.location.reload();
});

play
This is an event handler just the same as handlers for user actions such as the user clicking a button. This time, however, the event is a change in the state of an object.
Callbacks
An event handler is a particular type of callback. A callback is just a function that's passed into another function, with the expectation that the callback will be called at the appropriate time. As we just saw, callbacks used to be the main way asynchronous functions were implemented in JavaScript.
However, callback-based code can get hard to understand when the callback itself has to call functions that accept a callback. This is a common situation if you need to perform some operation that breaks down into a series of asynchronous functions. For example, consider the following:
js
Copy to Clipboard
function doStep1(init) {
  return init + 1;
}


function doStep2(init) {
  return init + 2;
}


function doStep3(init) {
  return init + 3;
}


function doOperation() {
  let result = 0;
  result = doStep1(result);
  result = doStep2(result);
  result = doStep3(result);
  console.log(`result: ${result}`);
}


doOperation();

Here we have a single operation that's split into three steps, where each step depends on the last step. In our example, the first step adds 1 to the input, the second adds 2, and the third adds 3. Starting with an input of 0, the end result is 6 (0 + 1 + 2 + 3). As a synchronous program, this is very straightforward. But what if we implemented the steps using callbacks?
js
Copy to Clipboard
function doStep1(init, callback) {
  const result = init + 1;
  callback(result);
}


function doStep2(init, callback) {
  const result = init + 2;
  callback(result);
}


function doStep3(init, callback) {
  const result = init + 3;
  callback(result);
}


function doOperation() {
  doStep1(0, (result1) => {
    doStep2(result1, (result2) => {
      doStep3(result2, (result3) => {
        console.log(`result: ${result3}`);
      });
    });
  });
}


doOperation();

Because we have to call callbacks inside callbacks, we get a deeply nested doOperation() function, which is much harder to read and debug. This is sometimes called "callback hell" or the "pyramid of doom" (because the indentation looks like a pyramid on its side).
When we nest callbacks like this, it can also get very hard to handle errors: often you have to handle errors at each level of the "pyramid", instead of having error handling only once at the top level.
For these reasons, most modern asynchronous APIs don't use callbacks. Instead, the foundation of asynchronous programming in JavaScript is the Promise, and that's the subject of the next article.





How to use promises
Previous


Overview: Asynchronous JavaScript


Next


Promises are the foundation of asynchronous programming in modern JavaScript. A promise is an object returned by an asynchronous function, which represents the current state of the operation. At the time the promise is returned to the caller, the operation often isn't finished, but the promise object provides methods to handle the eventual success or failure of the operation.
Prerequisites:
A solid understanding of JavaScript fundamentals and asynchronous concepts, as covered in previous lessons in this module.
Learning outcomes:
The concepts and fundamentals of using promises in JavaScript.
Chaining and combining promises.
Handling errors in promises.
async and await: how they relate to promises, and why they are useful.


In the previous article, we talked about the use of callbacks to implement asynchronous functions. With that design, you call the asynchronous function, passing in your callback function. The function returns immediately and calls your callback when the operation is finished.
With a promise-based API, the asynchronous function starts the operation and returns a Promise object. You can then attach handlers to this promise object, and these handlers will be executed when the operation has succeeded or failed.
Using the fetch() API
Note: In this article, we will explore promises by copying code samples from the page into your browser's JavaScript console. To set this up:
open a browser tab and visit https://example.org
in that tab, open the JavaScript console in your browser's developer tools
when we show an example, copy it into the console. You will have to reload the page each time you enter a new example, or the console will complain that you have redeclared fetchPromise.
In this example, we'll download the JSON file from https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json, and log some information about it.
To do this, we'll make an HTTP request to the server. In an HTTP request, we send a request message to a remote server, and it sends us back a response. In this case, we'll send a request to get a JSON file from the server. Remember in the last article, where we made HTTP requests using the XMLHttpRequest API? Well, in this article, we'll use the fetch() API, which is the modern, promise-based replacement for XMLHttpRequest.
Copy this into your browser's JavaScript console:
js
Copy to Clipboard
const fetchPromise = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
);

console.log(fetchPromise);

fetchPromise.then((response) => {
  console.log(`Received response: ${response.status}`);
});

console.log("Started request…");
Here we are:
calling the fetch() API, and assigning the return value to the fetchPromise variable
immediately after, logging the fetchPromise variable. This should output something like: Promise { <state>: "pending" }, telling us that we have a Promise object, and it has a state whose value is "pending". The "pending" state means that the fetch operation is still going on.
passing a handler function into the Promise's then() method. When (and if) the fetch operation succeeds, the promise will call our handler, passing in a Response object, which contains the server's response.
logging a message that we have started the request.
The complete output should be something like:
Promise { <state>: "pending" }
Started request…
Received response: 200
Note that Started request… is logged before we receive the response. Unlike a synchronous function, fetch() returns while the request is still going on, enabling our program to stay responsive. The response shows the 200 (OK) status code, meaning that our request succeeded.
This probably seems a lot like the example in the last article, where we added event handlers to the XMLHttpRequest object. Instead of that, we're passing a handler into the then() method of the returned promise.
Chaining promises
With the fetch() API, once you get a Response object, you need to call another function to get the response data. In this case, we want to get the response data as JSON, so we would call the json() method of the Response object. It turns out that json() is also asynchronous. So this is a case where we have to call two successive asynchronous functions.
Try this:
js
Copy to Clipboard
const fetchPromise = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
);

fetchPromise.then((response) => {
  const jsonPromise = response.json();
  jsonPromise.then((data) => {
    console.log(data[0].name);
  });
});
In this example, as before, we add a then() handler to the promise returned by fetch(). But this time, our handler calls response.json(), and then passes a new then() handler into the promise returned by response.json().
This should log "baked beans" (the name of the first product listed in "products.json").
But wait! Remember the last article, where we said that by calling a callback inside another callback, we got successively more nested levels of code? And we said that this "callback hell" made our code hard to understand? Isn't this just the same, only with then() calls?
It is, of course. But the elegant feature of promises is that then() itself returns a promise, which will be completed with the result of the function passed to it. This means that we can (and certainly should) rewrite the above code like this:
js
Copy to Clipboard
const fetchPromise = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
);

fetchPromise
  .then((response) => response.json())
  .then((data) => {
    console.log(data[0].name);
  });
Instead of calling the second then() inside the handler for the first then(), we can return the promise returned by json(), and call the second then() on that return value. This is called promise chaining and means we can avoid ever-increasing levels of indentation when we need to make consecutive asynchronous function calls.
Before we move on to the next step, there's one more piece to add. We need to check that the server accepted and was able to handle the request, before we try to read it. We'll do this by checking the status code in the response and throwing an error if it wasn't "OK":
js
Copy to Clipboard
const fetchPromise = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
);

fetchPromise
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data[0].name);
  });
Catching errors
This brings us to the last piece: how do we handle errors? The fetch() API can throw an error for many reasons (for example, because there was no network connectivity or the URL was malformed in some way) and we are throwing an error ourselves if the server returned an error.
In the last article, we saw that error handling can get very difficult with nested callbacks, making us handle errors at every nesting level.
To support error handling, Promise objects provide a catch() method. This is a lot like then(): you call it and pass in a handler function. However, while the handler passed to then() is called when the asynchronous operation succeeds, the handler passed to catch() is called when the asynchronous operation fails.
If you add catch() to the end of a promise chain, then it will be called when any of the asynchronous function calls fail. So you can implement an operation as several consecutive asynchronous function calls, and have a single place to handle all errors.
Try this version of our fetch() code. We've added an error handler using catch(), and also modified the URL so the request will fail.
js
Copy to Clipboard
const fetchPromise = fetch(
  "bad-scheme://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
);

fetchPromise
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data[0].name);
  })
  .catch((error) => {
    console.error(`Could not get products: ${error}`);
  });
Try running this version: you should see the error logged by our catch() handler.
Promise terminology
Promises come with some quite specific terminology that it's worth getting clear about.
First, a promise can be in one of three states:
pending: the promise has been created, and the asynchronous function it's associated with has not succeeded or failed yet. This is the state your promise is in when it's returned from a call to fetch(), and the request is still being made.
fulfilled: the asynchronous function has succeeded. When a promise is fulfilled, its then() handler is called.
rejected: the asynchronous function has failed. When a promise is rejected, its catch() handler is called.
Note that what "succeeded" or "failed" means here is up to the API in question. For example, fetch() rejects the returned promise if (among other reasons) a network error prevented the request being sent, but fulfills the promise if the server sent a response, even if the response was an error like 404 Not Found.
Sometimes, we use the term settled to cover both fulfilled and rejected.
A promise is resolved if it is settled, or if it has been "locked in" to follow the state of another promise.
The article Let's talk about how to talk about promises gives a great explanation of the details of this terminology.
Combining multiple promises
The promise chain is what you need when your operation consists of several asynchronous functions, and you need each one to complete before starting the next one. But there are other ways you might need to combine asynchronous function calls, and the Promise API provides some helpers for them.
Sometimes, you need all the promises to be fulfilled, but they don't depend on each other. In a case like that, it's much more efficient to start them all off together, then be notified when they have all fulfilled. The Promise.all() method is what you need here. It takes an array of promises and returns a single promise.
The promise returned by Promise.all() is:
fulfilled when and if all the promises in the array are fulfilled. In this case, the then() handler is called with an array of all the responses, in the same order that the promises were passed into all().
rejected when and if any of the promises in the array are rejected. In this case, the catch() handler is called with the error thrown by the promise that rejected.
For example:
js
Copy to Clipboard
const fetchPromise1 = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
);
const fetchPromise2 = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/not-found",
);
const fetchPromise3 = fetch(
  "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json",
);

Promise.all([fetchPromise1, fetchPromise2, fetchPromise3])
  .then((responses) => {
    for (const response of responses) {
      console.log(`${response.url}: ${response.status}`);
    }
  })
  .catch((error) => {
    console.error(`Failed to fetch: ${error}`);
  });
Here, we're making three fetch() requests to three different URLs. If they all succeed, we will log the response status of each one. If any of them fail, then we're logging the failure.
With the URLs we've provided, all the requests should be fulfilled, although for the second, the server will return 404 (Not Found) instead of 200 (OK) because the requested file does not exist. So the output should be:
https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json: 200
https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/not-found: 404
https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json: 200
If we try the same code with a badly formed URL, like this:
js
Copy to Clipboard
const fetchPromise1 = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
);
const fetchPromise2 = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/not-found",
);
const fetchPromise3 = fetch(
  "bad-scheme://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json",
);

Promise.all([fetchPromise1, fetchPromise2, fetchPromise3])
  .then((responses) => {
    for (const response of responses) {
      console.log(`${response.url}: ${response.status}`);
    }
  })
  .catch((error) => {
    console.error(`Failed to fetch: ${error}`);
  });
Then we can expect the catch() handler to run, and we should see something like:
Failed to fetch: TypeError: Failed to fetch
Sometimes, you might need any one of a set of promises to be fulfilled, and don't care which one. In that case, you want Promise.any(). This is like Promise.all(), except that it is fulfilled as soon as any of the array of promises is fulfilled, or rejected if all of them are rejected:
js
Copy to Clipboard
const fetchPromise1 = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
);
const fetchPromise2 = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/not-found",
);
const fetchPromise3 = fetch(
  "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json",
);

Promise.any([fetchPromise1, fetchPromise2, fetchPromise3])
  .then((response) => {
    console.log(`${response.url}: ${response.status}`);
  })
  .catch((error) => {
    console.error(`Failed to fetch: ${error}`);
  });
Note that in this case we can't predict which fetch request will complete first.
These are just two of the extra Promise functions for combining multiple promises. To learn about the rest, see the Promise reference documentation.
async and await
The async keyword gives you a simpler way to work with asynchronous promise-based code. Adding async at the start of a function makes it an async function:
js
Copy to Clipboard
async function myFunction() {
  // This is an async function
}
Inside an async function, you can use the await keyword before a call to a function that returns a promise. This makes the code wait at that point until the promise is settled, at which point the fulfilled value of the promise is treated as a return value, or the rejected value is thrown.
This enables you to write code that uses asynchronous functions but looks like synchronous code. For example, we could use it to rewrite our fetch example:
js
Copy to Clipboard
async function fetchProducts() {
  try {
    // after this line, our function will wait for the `fetch()` call to be settled
    // the `fetch()` call will either return a Response or throw an error
    const response = await fetch(
      "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    // after this line, our function will wait for the `response.json()` call to be settled
    // the `response.json()` call will either return the parsed JSON object or throw an error
    const data = await response.json();
    console.log(data[0].name);
  } catch (error) {
    console.error(`Could not get products: ${error}`);
  }
}

fetchProducts();
Here, we are calling await fetch(), and instead of getting a Promise, our caller gets back a fully complete Response object, just as if fetch() were a synchronous function!
We can even use a try...catch block for error handling, exactly as we would if the code were synchronous.
Note though that async functions always return a promise, so you can't do something like:
js
Copy to Clipboard
async function fetchProducts() {
  try {
    const response = await fetch(
      "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Could not get products: ${error}`);
  }
}

const promise = fetchProducts();
console.log(promise[0].name); // "promise" is a Promise object, so this will not work
Instead, you'd need to do something like:
js
Copy to Clipboard
async function fetchProducts() {
  const response = await fetch(
    "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
  );
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

const promise = fetchProducts();
promise
  .then((data) => {
    console.log(data[0].name);
  })
  .catch((error) => {
    console.error(`Could not get products: ${error}`);
  });
Here, we moved the try...catch back to the catch handler on the returned promise. This means our then handler doesn't have to deal with the case where an error got caught inside the fetchProducts function, causing data to be undefined. Handle errors as the last step of your promise chain.
Also, note that you can only use await inside an async function, unless your code is in a JavaScript module. That means you can't do this in a normal script:
js
Copy to Clipboard
try {
  // using await outside an async function is only allowed in a module
  const response = await fetch(
    "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
  );
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const data = await response.json();
  console.log(data[0].name);
} catch (error) {
  console.error(`Could not get products: ${error}`);
  throw error;
}
You'll probably use async functions a lot where you might otherwise use promise chains, and they make working with promises much more intuitive.
Keep in mind that just like a promise chain, await forces asynchronous operations to be completed in series. This is necessary if the result of the next operation depends on the result of the last one, but if that's not the case then something like Promise.all() will be more performant.
Summary
Promises are the foundation of asynchronous programming in modern JavaScript. They make it easier to express and reason about sequences of asynchronous operations without deeply nested callbacks, and they support a style of error handling that is similar to the synchronous try...catch statement.
The async and await keywords make it easier to build an operation from a series of consecutive asynchronous function calls, avoiding the need to create explicit promise chains, and allowing you to write code that looks just like synchronous code.
Promises work in the latest versions of all modern browsers; the only place where promise support will be a problem is in Opera Mini and IE11 and earlier versions.
We didn't touch on all features of promises in this article, just the most interesting and useful ones. As you start to learn more about promises, you'll come across more features and techniques.
Many modern Web APIs are promise-based, including WebRTC, Web Audio API, Media Capture and Streams API, and many more.
See also
Promise()
Using promises
We have a problem with promises by Nolan Lawson
Let's talk about how to talk about promises
Previous
How to implement a promise-based API
Previous


Overview: Asynchronous JavaScript


Next


In the last article we discussed how to use APIs that return promises. In this article we'll look at the other side — how to implement APIs that return promises. This is a much less common task than using promise-based APIs, but it's still worth knowing about.
Prerequisites:
A solid understanding of JavaScript fundamentals and asynchronous concepts, as covered in previous lessons in this module.
Learning outcomes:
Understand how to implement promise-based APIs.


Generally, when you implement a promise-based API, you'll be wrapping an asynchronous operation, which might use events, or plain callbacks, or a message-passing model. You'll arrange for a Promise object to handle the success or failure of that operation properly.
Implementing an alarm() API
In this example we'll implement a promise-based alarm API, called alarm(). It will take as arguments the name of the person to wake up and a delay in milliseconds to wait before waking the person up. After the delay, the function will send a "Wake up!" message, including the name of the person we need to wake up.
Wrapping setTimeout()
We'll use the setTimeout() API to implement our alarm() function. The setTimeout() API takes as arguments a callback function and a delay, given in milliseconds. When setTimeout() is called, it starts a timer set to the given delay, and when the time expires, it calls the given function.
In the example below, we call setTimeout() with a callback function and a delay of 1000 milliseconds:
html
Copy to Clipboard
play
<button id="set-alarm">Set alarm</button>
<div id="output"></div>


js
Copy to Clipboard
play
const output = document.querySelector("#output");
const button = document.querySelector("#set-alarm");


function setAlarm() {
  setTimeout(() => {
    output.textContent = "Wake up!";
  }, 1000);
}


button.addEventListener("click", setAlarm);


play
The Promise() constructor
Our alarm() function will return a Promise that is fulfilled when the timer expires. It will pass a "Wake up!" message into the then() handler, and will reject the promise if the caller supplies a negative delay value.
The key component here is the Promise() constructor. The Promise() constructor takes a single function as an argument. We'll call this function the executor. When you create a new promise you supply the implementation of the executor.
This executor function itself takes two arguments, which are both also functions, and which are conventionally called resolve and reject. In your executor implementation, you call the underlying asynchronous function. If the asynchronous function succeeds, you call resolve, and if it fails, you call reject. If the executor function throws an error, reject is called automatically. You can pass a single parameter of any type into resolve and reject.
So we can implement alarm() like this:
js
Copy to Clipboard
function alarm(person, delay) {
  return new Promise((resolve, reject) => {
    if (delay < 0) {
      reject(new Error("Alarm delay must not be negative"));
      return;
    }
    setTimeout(() => {
      resolve(`Wake up, ${person}!`);
    }, delay);
  });
}
This function creates and returns a new Promise. Inside the executor for the promise, we:
check that delay is not negative, and call reject, passing in a custom error if it is.
call setTimeout(), passing a callback and delay. The callback will be called when the timer expires, and in the callback we call resolve, passing in our "Wake up!" message.
Using the alarm() API
This part should be quite familiar from the last article. We can call alarm(), and on the returned promise call then() and catch() to set handlers for promise fulfillment and rejection.
js
Copy to Clipboard
play
const name = document.querySelector("#name");
const delay = document.querySelector("#delay");
const button = document.querySelector("#set-alarm");
const output = document.querySelector("#output");


function alarm(person, delay) {
  return new Promise((resolve, reject) => {
    if (delay < 0) {
      reject(new Error("Alarm delay must not be negative"));
      return;
    }
    setTimeout(() => {
      resolve(`Wake up, ${person}!`);
    }, delay);
  });
}


button.addEventListener("click", () => {
  alarm(name.value, delay.value)
    .then((message) => (output.textContent = message))
    .catch((error) => (output.textContent = `Couldn't set alarm: ${error}`));
});


play
Try setting different values for "Name" and "Delay". Try setting a negative value for "Delay".
Using async and await with the alarm() API
Since alarm() returns a Promise, we can do everything with it that we could do with any other promise: promise chaining, Promise.all(), and async / await:
js
Copy to Clipboard
play
const name = document.querySelector("#name");
const delay = document.querySelector("#delay");
const button = document.querySelector("#set-alarm");
const output = document.querySelector("#output");


function alarm(person, delay) {
  return new Promise((resolve, reject) => {
    if (delay < 0) {
      reject(new Error("Alarm delay must not be negative"));
      return;
    }
    setTimeout(() => {
      resolve(`Wake up, ${person}!`);
    }, delay);
  });
}


button.addEventListener("click", async () => {
  try {
    const message = await alarm(name.value, delay.value);
    output.textContent = message;
  } catch (error) {
    output.textContent = `Couldn't set alarm: ${error}`;
  }
});


play
See also
Promise() constructor
Using promises
Previous




Introducing workers
Previous


Overview: Asynchronous JavaScript


Next


In this final article in our "Asynchronous JavaScript" module, we'll introduce workers, which enable you to run some tasks in a separate thread of execution.
Prerequisites:
A solid understanding of JavaScript fundamentals and asynchronous concepts, as covered in previous lessons in this module.
Learning outcomes:
How to use dedicated web workers, and why.
Understand the purpose of other types of web worker, such as shared and service workers.

In the first article of this module, we saw what happens when you have a long-running synchronous task in your program — the whole window becomes totally unresponsive. Fundamentally, the reason for this is that the program is single-threaded. A thread is a sequence of instructions that a program follows. Because the program consists of a single thread, it can only do one thing at a time: so if it is waiting for our long-running synchronous call to return, it can't do anything else.
Workers give you the ability to run some tasks in a different thread, so you can start the task, then continue with other processing (such as handling user actions).
One concern from all this is that if multiple threads can have access to the same shared data, it's possible for them to change it independently and unexpectedly (with respect to each other). This can cause bugs that are hard to find.
To avoid these problems on the web, your main code and your worker code never get direct access to each other's variables, and can only truly "share" data in very specific cases. Workers and the main code run in completely separate worlds, and only interact by sending each other messages. In particular, this means that workers can't access the DOM (the window, document, page elements, and so on).
There are three different sorts of workers:
dedicated workers
shared workers
service workers
In this article, we'll walk through an example of the first sort of worker, then briefly discuss the other two.
Using web workers
Remember in the first article, where we had a page that calculated prime numbers? We're going to use a worker to run the prime-number calculation, so our page stays responsive to user actions.
The synchronous prime generator
Let's first take another look at the JavaScript in our previous example:
js
Copy to Clipboard
function generatePrimes(quota) {
  function isPrime(n) {
    for (let c = 2; c <= Math.sqrt(n); ++c) {
      if (n % c === 0) {
        return false;
      }
    }
    return true;
  }


  const primes = [];
  const maximum = 1000000;


  while (primes.length < quota) {
    const candidate = Math.floor(Math.random() * (maximum + 1));
    if (isPrime(candidate)) {
      primes.push(candidate);
    }
  }


  return primes;
}


document.querySelector("#generate").addEventListener("click", () => {
  const quota = document.querySelector("#quota").value;
  const primes = generatePrimes(quota);
  document.querySelector("#output").textContent =
    `Finished generating ${quota} primes!`;
});


document.querySelector("#reload").addEventListener("click", () => {
  document.querySelector("#user-input").value =
    'Try typing in here immediately after pressing "Generate primes"';
  document.location.reload();
});

In this program, after we call generatePrimes(), the program becomes totally unresponsive.
Prime generation with a worker
For this example, start by making a local copy of the files at https://github.com/mdn/learning-area/tree/main/javascript/asynchronous/workers/start. There are four files in this directory:
index.html
style.css
main.js
generate.js
The "index.html" file and the "style.css" files are already complete:
html
Copy to Clipboard
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Prime numbers</title>
    <script src="main.js" defer></script>
    <link href="style.css" rel="stylesheet" />
  </head>


  <body>
    <label for="quota">Number of primes:</label>
    <input type="text" id="quota" name="quota" value="1000000" />


    <button id="generate">Generate primes</button>
    <button id="reload">Reload</button>


    <textarea id="user-input" rows="5" cols="62">
Try typing in here immediately after pressing "Generate primes"
    </textarea>


    <div id="output"></div>
  </body>
</html>

css
Copy to Clipboard
textarea {
  display: block;
  margin: 1rem 0;
}

The "main.js" and "generate.js" files are empty. We're going to add the main code to "main.js", and the worker code to "generate.js".
So first, we can see that the worker code is kept in a separate script from the main code. We can also see, looking at "index.html" above, that only the main code is included in a <script> element.
Now copy the following code into "main.js":
js
Copy to Clipboard
// Create a new worker, giving it the code in "generate.js"
const worker = new Worker("./generate.js");


// When the user clicks "Generate primes", send a message to the worker.
// The message command is "generate", and the message also contains "quota",
// which is the number of primes to generate.
document.querySelector("#generate").addEventListener("click", () => {
  const quota = document.querySelector("#quota").value;
  worker.postMessage({
    command: "generate",
    quota,
  });
});


// When the worker sends a message back to the main thread,
// update the output box with a message for the user, including the number of
// primes that were generated, taken from the message data.
worker.addEventListener("message", (message) => {
  document.querySelector("#output").textContent =
    `Finished generating ${message.data} primes!`;
});


document.querySelector("#reload").addEventListener("click", () => {
  document.querySelector("#user-input").value =
    'Try typing in here immediately after pressing "Generate primes"';
  document.location.reload();
});

First, we're creating the worker using the Worker() constructor. We pass it a URL pointing to the worker script. As soon as the worker is created, the worker script is executed.
Next, as in the synchronous version, we add a click event handler to the "Generate primes" button. But now, rather than calling a generatePrimes() function, we send a message to the worker using worker.postMessage(). This message can take an argument, and in this case, we're passing a JSON object containing two properties:
command: a string identifying the thing we want the worker to do (in case our worker could do more than one thing)
quota: the number of primes to generate.
Next, we add a message event handler to the worker. This is so the worker can tell us when it has finished, and pass us any resulting data. Our handler takes the data from the data property of the message, and writes it to the output element (the data is exactly the same as quota, so this is a bit pointless, but it shows the principle).
Finally, we implement the click event handler for the "Reload" button. This is exactly the same as in the synchronous version.
Now for the worker code. Copy the following code into "generate.js":
js
Copy to Clipboard
// Listen for messages from the main thread.
// If the message command is "generate", call `generatePrimes()`
addEventListener("message", (message) => {
  if (message.data.command === "generate") {
    generatePrimes(message.data.quota);
  }
});


// Generate primes (very inefficiently)
function generatePrimes(quota) {
  function isPrime(n) {
    for (let c = 2; c <= Math.sqrt(n); ++c) {
      if (n % c === 0) {
        return false;
      }
    }
    return true;
  }


  const primes = [];
  const maximum = 1000000;


  while (primes.length < quota) {
    const candidate = Math.floor(Math.random() * (maximum + 1));
    if (isPrime(candidate)) {
      primes.push(candidate);
    }
  }


  // When we have finished, send a message to the main thread,
  // including the number of primes we generated.
  postMessage(primes.length);
}

Remember that this runs as soon as the main script creates the worker.
The first thing the worker does is start listening for messages from the main script. It does this using addEventListener(), which is a global function in a worker. Inside the message event handler, the data property of the event contains a copy of the argument passed from the main script. If the main script passed the generate command, we call generatePrimes(), passing in the quota value from the message event.
The generatePrimes() function is just like the synchronous version, except instead of returning a value, we send a message to the main script when we are done. We use the postMessage() function for this, which like addEventListener() is a global function in a worker. As we already saw, the main script is listening for this message and will update the DOM when the message is received.
Note: To run this site, you'll have to run a local web server, because file:// URLs are not allowed to load workers. See How do you set up a local testing server? to find out how. With that done, you should be able to click "Generate primes" and have your main page stay responsive.
If you have any problems creating or running the example, you can review the finished version and try it live.
Other types of workers
The worker we just created was what's called a dedicated worker. This means it's used by a single script instance.
There are other types of workers, though:
Shared workers can be shared by several different scripts running in different windows.
Service workers act like proxy servers, caching resources so that web applications can work when the user is offline. They're a key component of Progressive Web Apps.
Summary
In this article we've introduced web workers, which enable a web application to offload tasks to a separate thread. The main thread and the worker don't directly share any variables, but communicate by sending messages, which are received by the other side as message events.
Workers can be an effective way to keep the main application responsive, although they can't access all the APIs that the main application can, and in particular can't access the DOM.
See also
Using web workers
Using service workers
Web workers API













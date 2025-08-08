--- TypeScript Cheat Sheet: Control Flow Analysis ---

Key points
CFA nearly always takes a union and reduces the number of types inside the union based on logic in your code.
A function with a return type describing the CFA change for a new scope when it is true.
A function describing CFA changes affecting the current scope, because it throws instead of returning false.
Most of the time CFA works inside natural JavaScript boolean logic, but there are ways to define your own functions which affect how TypeScript narrows types.
Most narrowing comes from expressions inside if statements, where different type operators narrow inside the new scope.

Control Flow Analysis
const input = getUserInput()
input
if (typeof input === "string") {
  input
}
// string | number
// string

const input = getUserInput()
input
if (input instanceof Array) {
  input
}
// number | number[]
// number[]

const input = getUserInput()
input
if (Array.isArray(input)) {
  input
}
// number | number[]
// number[]

const input = getUserInput()
input
if ("error" in input) {
  input
}
// string | { error: ... }
// { error: ... }

If Statements
typeof (for primitives)
instanceof (for classes)
type‑guard functions (for anything)
"property" in object

type Responses =
  | { status: 200, data: any }
  | { status: 301, to: string }
  | { status: 400, error: Error }

function assertResponse(obj: any): asserts obj is SuccessResponse {
  if (!(obj instanceof SuccessResponse)) {
    throw new Error("Not a success!")
  }
}

const response = getResponse()
response
switch (response.status) {
  case 200: return response.data
  case 301: return redirect(response.to)
  case 400: return response.error
}

const res = getResponse()
res
assertResponse(res)
res
// SuccessResponse | ErrorResponse
// SuccessResponse

All members of the union have the same property name, CFA can discriminate on that.

Discriminated Unions

Assertion Functions
A function describing CFA changes affecting the current scope, because it throws instead of returning false.

function assertResponse(obj: any): asserts obj is SuccessResponse {
  if (!(obj instanceof SuccessResponse)) {
    throw new Error("Not a success!")
  }
}

Usage
const res = getResponse()
res
assertResponse(res)
res
// SuccessResponse

Expressions
Narrowing also occurs on the same line as code, when doing boolean operations.

const input = getUserInput()
input
const inputLength = (typeof input === "string" && input.length) || input
// input: string
// string | number

Assignment

Type Guards
function isErrorResponse(obj: Response): obj is APIErrorResponse {
  return obj instanceof APIErrorResponse
}

const response = getResponse()
response
if (isErrorResponse(response)) {
  response
}
// Response | APIErrorResponse
// APIErrorResponse

Usage
Subfields in objects are treated as though they can be mutated, and during assignment the type will be ‘widened’ to a non‑literal version. The prefix ‘as const’ locks all types to their literal versions.

let data: string | number = ...
data
data = "Hello"
data // string | number
// string

const response = getResponse()
const isSuccessResponse = response instanceof SuccessResponse
if (isSuccessResponse)
  response.data // SuccessResponse

const data1 = { name: "Zagreus" }
const data2 = { name: "Zagreus" } as const

typeof data1 = { name: string }
typeof data2 = { name: "Zagreus" }

Tracks through related variables
Narrowing types using ‘as const’

Assignment

Return type position describes what the assertion is


plaintext
Copy
Edit
--- TypeScript Cheat Sheet: Interface ---

Key points
Used to describe the shape of objects, and can be extended by others.
Almost everything in JavaScript is an object and interface is built to match their runtime behavior.

interface JSONResponse extends Response, HTTPAble {
  version: number;
  payloadSize: number;
  outOfStock?: boolean;
  update: (retryTimes: number) => void;
  update(retryTimes: number): void;
  (): JSONResponse;
  new(s: string): JSONResponse;
  [key: string]: number;
  readonly body: string;
}

Common Syntax

Built‑in Type Primitives:
  boolean, string, number, undefined, null, any, unknown, never, void, bigint, symbol

Common Built‑in JS Objects:
  Date, Error, Array, Map, Set, RegExp, Promise

Type Literals:
  Object: { field: string }
  Function: (arg: number) => string
  Arrays: string[] or Array<string>
  Tuple: [string, number]

Avoid:
interface Ruler {
  get size(): number
  set size(value: number | string)
}
const r: Ruler = ...
r.size = 12
r.size = "36"

Get & Set
Objects can have custom getters or setters.
interface Ruler {
  get size(): number
  set size(value: number | string)
}
Usage:
const r: Ruler = ...
r.size = 12
r.size = "36"

Extension via merging:
interface APICall {
  data: Response
}
interface APICall {
  error: Error
}

Class conformance:
interface Syncable { sync(): void }
class Account implements Syncable { ... }

Overloads:
A callable interface can have multiple definitions for different sets of parameters.
interface Expect {
  (matcher: boolean): string
  (matcher: string): boolean
}

Generics:
Declare a type which can change in your interface.
interface APICall<Response> {
  data: Response
}
Usage:
const api: APICall<ArtworkCall> = ...
api.data // Artwork

interface APICall<Response extends { status: number }> {
  data: Response
}
const api2: APICall<ArtworkCall> = ...
api2.data.status // number

--- TypeScript Cheat Sheet: Class ---

TypeScript

Cheat Sheet
Key points
A TypeScript class has a few type‑specific extensions to ES2015 JavaScript
classes, and one or two runtime additions.
Parameters to the new ABC come
from the constructor function.
The prefix private is a type‑only
addition, and has no effect at
runtime. Code outside of the class
can reach into the item in the
following case:
Vs #private which is runtime
private and has enforcement
inside the JavaScript engine that it
is only accessible inside the class:
The value of ‘this’ inside a function
depends on how the function is
called. It is not guaranteed to
always be the class instance which
you may be used to in other
languages.

You can use ‘this parameters’, use
the bind function, or arrow
functions to work around the issue
when it occurs.
Surprise, a class can be used as
both a type or a value.
So, be careful to not do this:
Class
class ABC { ... }

const abc = new ABC()
class Bag { private item: any }
Vs #private which is runtime
private and has enforcement
inside the JavaScript engine that
it is only accessible inside the class:
class Bag { #item: any }
const a: Bag = new Bag()
class C implements Bag {}

Creating a class instance
private x vs #private
‘this’ in classes
Type and Value
class extends implements
get
set
private
protected
static
static
static

User Account {
  id: string;
  displayName?: boolean;
  name!: string;
  #attributes: Map<any, any>;
  roles = [];
  createdAt = new Date();
  constructor(id: , email: ) {
    super(id);
    this.email = email;
    ...
  };
  setName(name: string) { this.name = name }
  verifyName = (name: string) => { ... }
  sync(): Promise<{ ... }>
  sync(cb: ((result: string) => void)): void
  sync(cb?: ((result: string) => void)): void | Promise<{ ... }> { ... }
  accountID() { }
  accountID(value: string) { }
  #userCount = 0;
  registerUser(user: User) { ... }
  { this.#userCount = -1 }
}

Updatable Serializable
"user"
string string
,
id
setName
verifyName = displayName
name!
#attributes
roles
readonly createdAt
constructor
sync
sync
sync
makeRequest
handleRequest
this
// A field
// An optional field
// A ‘trust me, it’s there’ field
// A private field
// A field with a default
// A readonly field with a default

Common Syntax  •  Subclasses  •  this class
Ensures that the class
conforms to a set of
interfaces or types
The code called on ‘new’
In this code is checked against
the fields to ensure it is set up correctly
strict: true

Type  •  Value
Ways to describe class
methods (and arrow
function fields)
Private access is just to this class, protected
allows subclasses. Only used for type
checking, public is the default.
Static fields / methods
Static blocks for setting up static
vars. ‘this’ refers to the static class
A function with 2
overload definitions
Getters and setters

abstract class
abstract Animal {
  abstract getName(): string;
  printName() {
    console.log("Hello, " + this.getName());
  }
}
class Dog extends Animal { getName(): string { ... } }

Abstract Classes
A class can be declared as not implementable, but as existing to 
be subclassed in the type system. As can members of the class.

import { Syncable, triggersSync, preferCache, required } from "mylib";
class User {
  @triggersSync()
  save() { ... }
  @preferCache(false)
  get displayName() { ... }
  update(@required info: Partial<User>) { ... }
}

"mylib"
Syncable
triggersSync
preferCache
required
save
update

Decorators and Attributes
You can use decorators on classes, class methods, accessors, property and 
parameters to methods.

class Location {
  constructor(public x: number, public y: number) {}
}
const loc = new Location(20, 40);
loc.x // 20
loc.y // 40

Parameter Properties
A TypeScript specific extension to classes which 
automatically set an instance field to the input parameter.

Generics
Declare a type which can
change in your class
methods.
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}
const stringBox = new Box("a package")

Type  •  Type  •  "a package"
contents
constructor
Class type parameter
Used here

These features are TypeScript specific language extensions which may 
never make it to JavaScript with the current syntax. :contentReference[oaicite:1]{index=1}

--- TypeScript Cheat Sheet: Type ---

TypeScript

Cheat Sheet
Key points
Full name is “type alias” and are used
to provide names to type literals
Supports more rich type-system
features than interfaces.
These features are great for building libraries, describing existing
JavaScript code and you may find you rarely reach for them in
mostly TypeScript applications.
^ Interfaces can only describe
object shape
^ Interfaces can be extended by
^ s
interface comparison checks
can be faster.
Much like how you can create
variables with the same name in
different scopes, a type has
similar semantics.
TypeScript includes a lot of
global types which will help you
do common tasks in the type
system. Check the site for them.
A tuple is a special‑cased array with known
types at specific indexes.
Terser for saving space, see Interface Cheat Sheet for
more info, everything but ‘static’ matches.

Type  •  Type vs Interface
Think of Types Like Variables
Build with Utility Types

type JSONResponse = {
  version: number;
  payloadSize: number;
  outOfStock?: boolean;
  update: (retryTimes: number) => void;
  update(retryTimes: number): void;
  (): JSONResponse;
  [key: string]: number;
  new (s: string): JSONResponse;
  readonly body: string;
}

version
payloadSize
outOfStock
update
update
key
body
/** In bytes */
// Field
// Attached docs
//
// Optional
// Arrow func field
// Function
// Type is callable
// Accepts any index
// Newable
// Readonly property

Object Literal Syntax
Primitive Type  •  Union Type  •  Object Literal Type
Tuple Type  •  Type from Value  •  Type from Func Return
Type from Module  •  Intersection Types  •  Type Indexing
Conditional Types  •  Template Union Types  •  Mapped Types

Describes a type which is one of many options,
for example a list of known strings.
Useful for documentation mainly. Re‑use the type from an existing JavaScript
runtime value via the typeof operator.
Re‑use the return value from a function as a type.
A way to merge/extend types
A way to extract and name from
a subset of a type.
Acts as “if statements” inside the type system. Created
via generics, and then commonly used to reduce the
number of options in a type union.
A template string can be used to combine and
manipulate text inside the type system.
Acts like a map statement for the type system, allowing
an input type to change the structure of the new type.

type Size =
  "small" | "medium" | "large"

const data = { ... }
type Data = typeof data

function createFixtures() { ... }
type Fixtures = ReturnType<typeof createFixtures>
test(fixture: Fixtures) {}

const data: import("./data").data

type Location = { x: number } & { y: number }
// { x: number, y: number }

type Response = { data: { ... } }
type Data = Response["data"]
// { ... }

type T extends U ? X : Y  // Conditional Types

type Animals = Bird | Dog | Ant | Wolf;
type FourLegs = HasFourLegs<Animals>
// Dog | Wolf

type HasFourLegs<Animal> =
  Animal extends { legs: 4 } ? Animal : never

type SupportedLangs = "en" | "pt" | "zh";
type FooterLocaleIDs = "header" | "footer";
type AllLocaleIDs =
  `${SupportedLangs}_${FooterLocaleIDs}`
// "en_header" | "en_footer"
// "pt_header" | "pt_footer"
// "zh_header" | "zh_footer"

type Artist = { name: string, bio: string }
type Subscriber<Type> = {
  [Property in keyof Type]: (newValue: Type[Property]) => void
}
type ArtistSub = Subscriber<Artist>
// { name: (nv: string) => void, bio: (nv: string) => void }

Loop through each field
in the type generic
parameter “Type”
Sets type as a function with
original type as param

type Data = [
  location: Location,
  timestamp: string
];

type Location = {
  x: number;
  y: number;
};

type SanitizedInput = string;
type MissingNo = 404;
// declaring it multiple times
:contentReference[oaicite:3]{index=3}










TypeScript for the New Programmer
Congratulations on choosing TypeScript as one of your first languages — you’re already making good decisions!
You’ve probably already heard that TypeScript is a “flavor” or “variant” of JavaScript. The relationship between TypeScript (TS) and JavaScript (JS) is rather unique among modern programming languages, so learning more about this relationship will help you understand how TypeScript adds to JavaScript.
What is JavaScript? A Brief History
JavaScript (also known as ECMAScript) started its life as a simple scripting language for browsers. At the time it was invented, it was expected to be used for short snippets of code embedded in a web page — writing more than a few dozen lines of code would have been somewhat unusual. Due to this, early web browsers executed such code pretty slowly. Over time, though, JS became more and more popular, and web developers started using it to create interactive experiences.
Web browser developers responded to this increased JS usage by optimizing their execution engines (dynamic compilation) and extending what could be done with it (adding APIs), which in turn made web developers use it even more. On modern websites, your browser is frequently running applications that span hundreds of thousands of lines of code. This is the long and gradual growth of “the web”, starting as a simple network of static pages, and evolving into a platform for rich applications of all kinds.
More than this, JS has become popular enough to be used outside the context of browsers, such as implementing JS servers using node.js. The “run anywhere” nature of JS makes it an attractive choice for cross-platform development. There are many developers these days that use only JavaScript to program their entire stack!
To summarize, we have a language that was designed for quick uses, and then grew to a full-fledged tool to write applications with millions of lines. Every language has its own quirks — oddities and surprises, and JavaScript’s humble beginning makes it have many of these. Some examples:
JavaScript’s equality operator (==) coerces its operands, leading to unexpected behavior:
if ("" == 0) {
  // It is! But why??
}
if (1 < x < 3) {
  // True for *any* value of x!
}
JavaScript also allows accessing properties which aren’t present:
const obj = { width: 10, height: 15 };
// Why is this NaN? Spelling is hard!
const area = obj.width * obj.heigth;
Most programming languages would throw an error when these sorts of errors occur, some would do so during compilation — before any code is running. When writing small programs, such quirks are annoying but manageable; when writing applications with hundreds or thousands of lines of code, these constant surprises are a serious problem.
TypeScript: A Static Type Checker
We said earlier that some languages wouldn’t allow those buggy programs to run at all. Detecting errors in code without running it is referred to as static checking. Determining what’s an error and what’s not based on the kinds of values being operated on is known as static type checking.
TypeScript checks a program for errors before execution, and does so based on the kinds of values, making it a static type checker. For example, the last example above has an error because of the type of obj. Here’s the error TypeScript found:
const obj = { width: 10, height: 15 };
const area = obj.width * obj.heigth;
Property 'heigth' does not exist on type '{ width: number; height: number; }'. Did you mean 'height'?
Try
A Typed Superset of JavaScript
How does TypeScript relate to JavaScript, though?
Syntax
TypeScript is a language that is a superset of JavaScript: JS syntax is therefore legal TS. Syntax refers to the way we write text to form a program. For example, this code has a syntax error because it’s missing a ):
let a = (4
')' expected.
Try
TypeScript doesn’t consider any JavaScript code to be an error because of its syntax. This means you can take any working JavaScript code and put it in a TypeScript file without worrying about exactly how it is written.
Types
However, TypeScript is a typed superset, meaning that it adds rules about how different kinds of values can be used. The earlier error about obj.heigth was not a syntax error: it is an error of using some kind of value (a type) in an incorrect way.
As another example, this is JavaScript code that you can run in your browser, and it will log a value:
console.log(4 / []);
This syntactically-legal program logs Infinity. TypeScript, though, considers division of number by an array to be a nonsensical operation, and will issue an error:
console.log(4 / []);
The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
Try
It’s possible you really did intend to divide a number by an array, perhaps just to see what happens, but most of the time, though, this is a programming mistake. TypeScript’s type checker is designed to allow correct programs through while still catching as many common errors as possible. (Later, we’ll learn about settings you can use to configure how strictly TypeScript checks your code.)
If you move some code from a JavaScript file to a TypeScript file, you might see type errors depending on how the code is written. These may be legitimate problems with the code, or TypeScript being overly conservative. Throughout this guide we’ll demonstrate how to add various TypeScript syntax to eliminate such errors.
Runtime Behavior
TypeScript is also a programming language that preserves the runtime behavior of JavaScript. For example, dividing by zero in JavaScript produces Infinity instead of throwing a runtime exception. As a principle, TypeScript never changes the runtime behavior of JavaScript code.
This means that if you move code from JavaScript to TypeScript, it is guaranteed to run the same way, even if TypeScript thinks that the code has type errors.
Keeping the same runtime behavior as JavaScript is a foundational promise of TypeScript because it means you can easily transition between the two languages without worrying about subtle differences that might make your program stop working.
Erased Types
Roughly speaking, once TypeScript’s compiler is done with checking your code, it erases the types to produce the resulting “compiled” code. This means that once your code is compiled, the resulting plain JS code has no type information.
This also means that TypeScript never changes the behavior of your program based on the types it inferred. The bottom line is that while you might see type errors during compilation, the type system itself has no bearing on how your program works when it runs.
Finally, TypeScript doesn’t provide any additional runtime libraries. Your programs will use the same standard library (or external libraries) as JavaScript programs, so there’s no additional TypeScript-specific framework to learn.
Learning JavaScript and TypeScript
We frequently see the question “Should I learn JavaScript or TypeScript?“.
The answer is that you can’t learn TypeScript without learning JavaScript! TypeScript shares syntax and runtime behavior with JavaScript, so anything you learn about JavaScript is helping you learn TypeScript at the same time.
There are many, many resources available for programmers to learn JavaScript; you should not ignore these resources if you’re writing TypeScript. For example, there are about 20 times more StackOverflow questions tagged javascript than typescript, but all of the javascript questions also apply to TypeScript.
If you find yourself searching for something like “how to sort a list in TypeScript”, remember: TypeScript is JavaScript’s runtime with a compile-time type checker. The way you sort a list in TypeScript is the same way you do so in JavaScript. If you find a resource that uses TypeScript directly, that’s great too, but don’t limit yourself to thinking you need TypeScript-specific answers for everyday questions about how to accomplish runtime tasks.
Next Steps
This was a brief overview of the syntax and tools used in everyday TypeScript. From here, you can:
Learn some of the JavaScript fundamentals, we recommend either:
Microsoft’s JavaScript Resources or
JavaScript guide at the Mozilla Web Docs
Continue to TypeScript for JavaScript Programmers
Read the full Handbook from start to finish
Explore the Playground examples
TypeScript for JavaScript Programmers
TypeScript stands in an unusual relationship to JavaScript. TypeScript offers all of JavaScript’s features, and an additional layer on top of these: TypeScript’s type system.
For example, JavaScript provides language primitives like string and number, but it doesn’t check that you’ve consistently assigned these. TypeScript does.
This means that your existing working JavaScript code is also TypeScript code. The main benefit of TypeScript is that it can highlight unexpected behavior in your code, lowering the chance of bugs.
This tutorial provides a brief overview of TypeScript, focusing on its type system.
Types by Inference
TypeScript knows the JavaScript language and will generate types for you in many cases. For example in creating a variable and assigning it to a particular value, TypeScript will use the value as its type.
let helloWorld = "Hello World";
      
let helloWorld: string
Try
By understanding how JavaScript works, TypeScript can build a type-system that accepts JavaScript code but has types. This offers a type-system without needing to add extra characters to make types explicit in your code. That’s how TypeScript knows that helloWorld is a string in the above example.
You may have written JavaScript in Visual Studio Code, and had editor auto-completion. Visual Studio Code uses TypeScript under the hood to make it easier to work with JavaScript.
Defining Types
You can use a wide variety of design patterns in JavaScript. However, some design patterns make it difficult for types to be inferred automatically (for example, patterns that use dynamic programming). To cover these cases, TypeScript supports an extension of the JavaScript language, which offers places for you to tell TypeScript what the types should be.
For example, to create an object with an inferred type which includes name: string and id: number, you can write:
const user = {
 name: "Hayes",
 id: 0,
};
Try
You can explicitly describe this object’s shape using an interface declaration:
interface User {
 name: string;
 id: number;
}
Try
You can then declare that a JavaScript object conforms to the shape of your new interface by using syntax like : TypeName after a variable declaration:
const user: User = {
 name: "Hayes",
 id: 0,
};
Try
If you provide an object that doesn’t match the interface you have provided, TypeScript will warn you:
interface User {
 name: string;
 id: number;
}
 
const user: User = {
 username: "Hayes",
Object literal may only specify known properties, and 'username' does not exist in type 'User'.
 id: 0,
};
Try
Since JavaScript supports classes and object-oriented programming, so does TypeScript. You can use an interface declaration with classes:
interface User {
 name: string;
 id: number;
}
 
class UserAccount {
 name: string;
 id: number;
 
 constructor(name: string, id: number) {
   this.name = name;
   this.id = id;
 }
}
 
const user: User = new UserAccount("Murphy", 1);
Try
You can use interfaces to annotate parameters and return values to functions:
function deleteUser(user: User) {
 // ...
}
 
function getAdminUser(): User {
 //...
}
Try
There is already a small set of primitive types available in JavaScript: boolean, bigint, null, number, string, symbol, and undefined, which you can use in an interface. TypeScript extends this list with a few more, such as any (allow anything), unknown (ensure someone using this type declares what the type is), never (it’s not possible that this type could happen), and void (a function which returns undefined or has no return value).
You’ll see that there are two syntaxes for building types: Interfaces and Types. You should prefer interface. Use type when you need specific features.
Composing Types
With TypeScript, you can create complex types by combining simple ones. There are two popular ways to do so: unions and generics.
Unions
With a union, you can declare that a type could be one of many types. For example, you can describe a boolean type as being either true or false:
type MyBool = true | false;
Try
Note: If you hover over MyBool above, you’ll see that it is classed as boolean. That’s a property of the Structural Type System. More on this below.
A popular use-case for union types is to describe the set of string or number literals that a value is allowed to be:
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type PositiveOddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
Try
Unions provide a way to handle different types too. For example, you may have a function that takes an array or a string:
function getLength(obj: string | string[]) {
 return obj.length;
}
Try
To learn the type of a variable, use typeof:
Type
Predicate
string
typeof s === "string"
number
typeof n === "number"
boolean
typeof b === "boolean"
undefined
typeof undefined === "undefined"
function
typeof f === "function"
array
Array.isArray(a)

For example, you can make a function return different values depending on whether it is passed a string or an array:
function wrapInArray(obj: string | string[]) {
 if (typeof obj === "string") {
   return [obj];
          
(parameter) obj: string
 }
 return obj;
}
Try
Generics
Generics provide variables to types. A common example is an array. An array without generics could contain anything. An array with generics can describe the values that the array contains.
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;
You can declare your own types that use generics:
interface Backpack<Type> {
 add: (obj: Type) => void;
 get: () => Type;
}
 
// This line is a shortcut to tell TypeScript there is a
// constant called `backpack`, and to not worry about where it came from.
declare const backpack: Backpack<string>;
 
// object is a string, because we declared it above as the variable part of Backpack.
const object = backpack.get();
 
// Since the backpack variable is a string, you can't pass a number to the add function.
backpack.add(23);
Argument of type 'number' is not assignable to parameter of type 'string'.
Try
Structural Type System
One of TypeScript’s core principles is that type checking focuses on the shape that values have. This is sometimes called “duck typing” or “structural typing”.
In a structural type system, if two objects have the same shape, they are considered to be of the same type.
interface Point {
 x: number;
 y: number;
}
 
function logPoint(p: Point) {
 console.log(`${p.x}, ${p.y}`);
}
 
// logs "12, 26"
const point = { x: 12, y: 26 };
logPoint(point);
Try
The point variable is never declared to be a Point type. However, TypeScript compares the shape of point to the shape of Point in the type-check. They have the same shape, so the code passes.
The shape-matching only requires a subset of the object’s fields to match.
const point3 = { x: 12, y: 26, z: 89 };
logPoint(point3); // logs "12, 26"
 
const rect = { x: 33, y: 3, width: 30, height: 80 };
logPoint(rect); // logs "33, 3"
 
const color = { hex: "#187ABF" };
logPoint(color);
Argument of type '{ hex: string; }' is not assignable to parameter of type 'Point'.
  Type '{ hex: string; }' is missing the following properties from type 'Point': x, y
Try
There is no difference between how classes and objects conform to shapes:
class VirtualPoint {
 x: number;
 y: number;
 
 constructor(x: number, y: number) {
   this.x = x;
   this.y = y;
 }
}
 
const newVPoint = new VirtualPoint(13, 56);
logPoint(newVPoint); // logs "13, 56"
Try
If the object or class has all the required properties, TypeScript will say they match, regardless of the implementation details.
Next Steps
This was a brief overview of the syntax and tools used in everyday TypeScript. From here, you can:
Read the full Handbook from start to finish
Explore the Playground examples
TypeScript for Functional Programmers
TypeScript began its life as an attempt to bring traditional object-oriented types to JavaScript so that the programmers at Microsoft could bring traditional object-oriented programs to the web. As it has developed, TypeScript’s type system has evolved to model code written by native JavaScripters. The resulting system is powerful, interesting and messy.
This introduction is designed for working Haskell or ML programmers who want to learn TypeScript. It describes how the type system of TypeScript differs from Haskell’s type system. It also describes unique features of TypeScript’s type system that arise from its modelling of JavaScript code.
This introduction does not cover object-oriented programming. In practice, object-oriented programs in TypeScript are similar to those in other popular languages with OO features.
Prerequisites
In this introduction, I assume you know the following:
How to program in JavaScript, the good parts.
Type syntax of a C-descended language.
If you need to learn the good parts of JavaScript, read JavaScript: The Good Parts. You may be able to skip the book if you know how to write programs in a call-by-value lexically scoped language with lots of mutability and not much else. R4RS Scheme is a good example.
The C++ Programming Language is a good place to learn about C-style type syntax. Unlike C++, TypeScript uses postfix types, like so: x: string instead of string x.
Concepts not in Haskell
Built-in types
JavaScript defines 8 built-in types:
Type
Explanation
Number
a double-precision IEEE 754 floating point.
String
an immutable UTF-16 string.
BigInt
integers in the arbitrary precision format.
Boolean
true and false.
Symbol
a unique value usually used as a key.
Null
equivalent to the unit type.
Undefined
also equivalent to the unit type.
Object
similar to records.

See the MDN page for more detail.
TypeScript has corresponding primitive types for the built-in types:
number
string
bigint
boolean
symbol
null
undefined
object
Other important TypeScript types
Type
Explanation
unknown
the top type.
never
the bottom type.
object literal
e.g. { property: Type }
void
for functions with no documented return value
T[]
mutable arrays, also written Array<T>
[T, T]
tuples, which are fixed-length but mutable
(t: T) => U
functions

Notes:
Function syntax includes parameter names. This is pretty hard to get used to!
let fst: (a: any, b: any) => any = (a, b) => a;
// or more precisely:
let fst: <T, U>(a: T, b: U) => T = (a, b) => a;
Object literal type syntax closely mirrors object literal value syntax:
let o: { n: number; xs: object[] } = { n: 1, xs: [] };
[T, T] is a subtype of T[]. This is different than Haskell, where tuples are not related to lists.
Boxed types
JavaScript has boxed equivalents of primitive types that contain the methods that programmers associate with those types. TypeScript reflects this with, for example, the difference between the primitive type number and the boxed type Number. The boxed types are rarely needed, since their methods return primitives.
(1).toExponential();
// equivalent to
Number.prototype.toExponential.call(1);
Note that calling a method on a numeric literal requires it to be in parentheses to aid the parser.
Gradual typing
TypeScript uses the type any whenever it can’t tell what the type of an expression should be. Compared to Dynamic, calling any a type is an overstatement. It just turns off the type checker wherever it appears. For example, you can push any value into an any[] without marking the value in any way:
// with "noImplicitAny": false in tsconfig.json, anys: any[]
const anys = [];
anys.push(1);
anys.push("oh no");
anys.push({ anything: "goes" });
Try
And you can use an expression of type any anywhere:
anys.map(anys[1]); // oh no, "oh no" is not a function
any is contagious, too — if you initialize a variable with an expression of type any, the variable has type any too.
let sepsis = anys[0] + anys[1]; // this could mean anything
To get an error when TypeScript produces an any, use "noImplicitAny": true, or "strict": true in tsconfig.json.
Structural typing
Structural typing is a familiar concept to most functional programmers, although Haskell and most MLs are not structurally typed. Its basic form is pretty simple:
// @strict: false
let o = { x: "hi", extra: 1 }; // ok
let o2: { x: string } = o; // ok
Here, the object literal { x: "hi", extra: 1 } has a matching literal type { x: string, extra: number }. That type is assignable to { x: string } since it has all the required properties and those properties have assignable types. The extra property doesn’t prevent assignment, it just makes it a subtype of { x: string }.
Named types just give a name to a type; for assignability purposes there’s no difference between the type alias One and the interface type Two below. They both have a property p: string. (Type aliases behave differently from interfaces with respect to recursive definitions and type parameters, however.)
type One = { p: string };
interface Two {
 p: string;
}
class Three {
 p = "Hello";
}
 
let x: One = { p: "hi" };
let two: Two = x;
two = new Three();
Try
Unions
In TypeScript, union types are untagged. In other words, they are not discriminated unions like data in Haskell. However, you can often discriminate types in a union using built-in tags or other properties.
function start(
 arg: string | string[] | (() => string) | { s: string }
): string {
 // this is super common in JavaScript
 if (typeof arg === "string") {
   return commonCase(arg);
 } else if (Array.isArray(arg)) {
   return arg.map(commonCase).join(",");
 } else if (typeof arg === "function") {
   return commonCase(arg());
 } else {
   return commonCase(arg.s);
 }
 
 function commonCase(s: string): string {
   // finally, just convert a string to another string
   return s;
 }
}
Try
string, Array and Function have built-in type predicates, conveniently leaving the object type for the else branch. It is possible, however, to generate unions that are difficult to differentiate at runtime. For new code, it’s best to build only discriminated unions.
The following types have built-in predicates:
Type
Predicate
string
typeof s === "string"
number
typeof n === "number"
bigint
typeof m === "bigint"
boolean
typeof b === "boolean"
symbol
typeof g === "symbol"
undefined
typeof undefined === "undefined"
function
typeof f === "function"
array
Array.isArray(a)
object
typeof o === "object"

Note that functions and arrays are objects at runtime, but have their own predicates.
Intersections
In addition to unions, TypeScript also has intersections:
type Combined = { a: number } & { b: string };
type Conflicting = { a: number } & { a: string };
Try
Combined has two properties, a and b, just as if they had been written as one object literal type. Intersection and union are recursive in case of conflicts, so Conflicting.a: number & string.
Unit types
Unit types are subtypes of primitive types that contain exactly one primitive value. For example, the string "foo" has the type "foo". Since JavaScript has no built-in enums, it is common to use a set of well-known strings instead. Unions of string literal types allow TypeScript to type this pattern:
declare function pad(s: string, n: number, direction: "left" | "right"): string;
pad("hi", 10, "left");
Try
When needed, the compiler widens — converts to a supertype — the unit type to the primitive type, such as "foo" to string. This happens when using mutability, which can hamper some uses of mutable variables:
let s = "right";
pad("hi", 10, s); // error: 'string' is not assignable to '"left" | "right"'
Argument of type 'string' is not assignable to parameter of type '"left" | "right"'.
Try
Here’s how the error happens:
"right": "right"
s: string because "right" widens to string on assignment to a mutable variable.
string is not assignable to "left" | "right"
You can work around this with a type annotation for s, but that in turn prevents assignments to s of variables that are not of type "left" | "right".
let s: "left" | "right" = "right";
pad("hi", 10, s);
Try
Concepts similar to Haskell
Contextual typing
TypeScript has some obvious places where it can infer types, like variable declarations:
let s = "I'm a string!";
Try
But it also infers types in a few other places that you may not expect if you’ve worked with other C-syntax languages:
declare function map<T, U>(f: (t: T) => U, ts: T[]): U[];
let sns = map((n) => n.toString(), [1, 2, 3]);
Try
Here, n: number in this example also, despite the fact that T and U have not been inferred before the call. In fact, after [1,2,3] has been used to infer T=number, the return type of n => n.toString() is used to infer U=string, causing sns to have the type string[].
Note that inference will work in any order, but intellisense will only work left-to-right, so TypeScript prefers to declare map with the array first:
declare function map<T, U>(ts: T[], f: (t: T) => U): U[];
Try
Contextual typing also works recursively through object literals, and on unit types that would otherwise be inferred as string or number. And it can infer return types from context:
declare function run<T>(thunk: (t: T) => void): T;
let i: { inference: string } = run((o) => {
 o.inference = "INSERT STATE HERE";
});
Try
The type of o is determined to be { inference: string } because
Declaration initializers are contextually typed by the declaration’s type: { inference: string }.
The return type of a call uses the contextual type for inferences, so the compiler infers that T={ inference: string }.
Arrow functions use the contextual type to type their parameters, so the compiler gives o: { inference: string }.
And it does so while you are typing, so that after typing o., you get completions for the property inference, along with any other properties you’d have in a real program. Altogether, this feature can make TypeScript’s inference look a bit like a unifying type inference engine, but it is not.
Type aliases
Type aliases are mere aliases, just like type in Haskell. The compiler will attempt to use the alias name wherever it was used in the source code, but does not always succeed.
type Size = [number, number];
let x: Size = [101.1, 999.9];
Try
The closest equivalent to newtype is a tagged intersection:
type FString = string & { __compileTimeOnly: any };
An FString is just like a normal string, except that the compiler thinks it has a property named __compileTimeOnly that doesn’t actually exist. This means that FString can still be assigned to string, but not the other way round.
Discriminated Unions
The closest equivalent to data is a union of types with discriminant properties, normally called discriminated unions in TypeScript:
type Shape =
 | { kind: "circle"; radius: number }
 | { kind: "square"; x: number }
 | { kind: "triangle"; x: number; y: number };
Unlike Haskell, the tag, or discriminant, is just a property in each object type. Each variant has an identical property with a different unit type. This is still a normal union type; the leading | is an optional part of the union type syntax. You can discriminate the members of the union using normal JavaScript code:
type Shape =
 | { kind: "circle"; radius: number }
 | { kind: "square"; x: number }
 | { kind: "triangle"; x: number; y: number };
 
function area(s: Shape) {
 if (s.kind === "circle") {
   return Math.PI * s.radius * s.radius;
 } else if (s.kind === "square") {
   return s.x * s.x;
 } else {
   return (s.x * s.y) / 2;
 }
}
Try
Note that the return type of area is inferred to be number because TypeScript knows the function is total. If some variant is not covered, the return type of area will be number | undefined instead.
Also, unlike Haskell, common properties show up in any union, so you can usefully discriminate multiple members of the union:
function height(s: Shape) {
 if (s.kind === "circle") {
   return 2 * s.radius;
 } else {
   // s.kind: "square" | "triangle"
   return s.x;
 }
}
Try
Type Parameters
Like most C-descended languages, TypeScript requires declaration of type parameters:
function liftArray<T>(t: T): Array<T> {
 return [t];
}
There is no case requirement, but type parameters are conventionally single uppercase letters. Type parameters can also be constrained to a type, which behaves a bit like type class constraints:
function firstish<T extends { length: number }>(t1: T, t2: T): T {
 return t1.length > t2.length ? t1 : t2;
}
TypeScript can usually infer type arguments from a call based on the type of the arguments, so type arguments are usually not needed.
Because TypeScript is structural, it doesn’t need type parameters as much as nominal systems. Specifically, they are not needed to make a function polymorphic. Type parameters should only be used to propagate type information, such as constraining parameters to be the same type:
function length<T extends ArrayLike<unknown>>(t: T): number {}
function length(t: ArrayLike<unknown>): number {}
In the first length, T is not necessary; notice that it’s only referenced once, so it’s not being used to constrain the type of the return value or other parameters.
Higher-kinded types
TypeScript does not have higher kinded types, so the following is not legal:
function length<T extends ArrayLike<unknown>, U>(m: T<U>) {}
Point-free programming
Point-free programming — heavy use of currying and function composition — is possible in JavaScript, but can be verbose. In TypeScript, type inference often fails for point-free programs, so you’ll end up specifying type parameters instead of value parameters. The result is so verbose that it’s usually better to avoid point-free programming.
Module system
JavaScript’s modern module syntax is a bit like Haskell’s, except that any file with import or export is implicitly a module:
import { value, Type } from "npm-package";
import { other, Types } from "./local-package";
import * as prefix from "../lib/third-package";
You can also import commonjs modules — modules written using node.js’ module system:
import f = require("single-function-package");
You can export with an export list:
export { f };
function f() {
 return g();
}
function g() {} // g is not exported
Or by marking each export individually:
export function f() { return g() }
function g() { }
The latter style is more common but both are allowed, even in the same file.
readonly and const
In JavaScript, mutability is the default, although it allows variable declarations with const to declare that the reference is immutable. The referent is still mutable:
const a = [1, 2, 3];
a.push(102); // ):
a[0] = 101; // D:
TypeScript additionally has a readonly modifier for properties.
interface Rx {
 readonly x: number;
}
let rx: Rx = { x: 1 };
rx.x = 12; // error
It also ships with a mapped type Readonly<T> that makes all properties readonly:
interface X {
 x: number;
}
let rx: Readonly<X> = { x: 1 };
rx.x = 12; // error
And it has a specific ReadonlyArray<T> type that removes side-affecting methods and prevents writing to indices of the array, as well as special syntax for this type:
let a: ReadonlyArray<number> = [1, 2, 3];
let b: readonly number[] = [1, 2, 3];
a.push(102); // error
b[0] = 101; // error
You can also use a const-assertion, which operates on arrays and object literals:
let a = [1, 2, 3] as const;
a.push(102); // error
a[0] = 101; // error
However, none of these options are the default, so they are not consistently used in TypeScript code.
Next Steps
This doc is a high level overview of the syntax and types you would use in everyday code. From here you should:
Read the full Handbook from start to finish
Explore the Playground examples
TypeScript Tooling in 5 minutes
Let’s get started by building a simple web application with TypeScript.
Installing TypeScript
There are two main ways to add TypeScript to your project:
Via npm (the Node.js package manager)
By installing TypeScript’s Visual Studio plugins
Visual Studio 2017 and Visual Studio 2015 Update 3 include TypeScript language support by default but does not include the TypeScript compiler, tsc. If you didn’t install TypeScript with Visual Studio, you can still download it.
For npm users:
> npm install -g typescript
Building your first TypeScript file
In your editor, type the following JavaScript code in greeter.ts:
function greeter(person) {
 return "Hello, " + person;
}
 
let user = "Jane User";
 
document.body.textContent = greeter(user);
Try
Compiling your code
We used a .ts extension, but this code is just JavaScript. You could have copy/pasted this straight out of an existing JavaScript app.
At the command line, run the TypeScript compiler:
tsc greeter.ts
The result will be a file greeter.js which contains the same JavaScript that you fed in. We’re up and running using TypeScript in our JavaScript app!
Now we can start taking advantage of some of the new tools TypeScript offers. Add a : string type annotation to the ‘person’ function parameter as shown here:
function greeter(person: string) {
 return "Hello, " + person;
}
 
let user = "Jane User";
 
document.body.textContent = greeter(user);
Try
Type annotations
Type annotations in TypeScript are lightweight ways to record the intended contract of the function or variable. In this case, we intend the greeter function to be called with a single string parameter. We can try changing the call greeter to pass an array instead:
function greeter(person: string) {
 return "Hello, " + person;
}
 
let user = [0, 1, 2];
 
document.body.textContent = greeter(user);
Argument of type 'number[]' is not assignable to parameter of type 'string'.
Try
Re-compiling, you’ll now see an error:
error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
Similarly, try removing all the arguments to the greeter call. TypeScript will let you know that you have called this function with an unexpected number of arguments. In both cases, TypeScript can offer static analysis based on both the structure of your code, and the type annotations you provide.
Notice that although there were errors, the greeter.js file is still created. You can use TypeScript even if there are errors in your code. But in this case, TypeScript is warning that your code will likely not run as expected.
Interfaces
Let’s develop our sample further. Here we use an interface that describes objects that have a firstName and lastName field. In TypeScript, two types are compatible if their internal structure is compatible. This allows us to implement an interface just by having the shape the interface requires, without an explicit implements clause.
interface Person {
 firstName: string;
 lastName: string;
}
 
function greeter(person: Person) {
 return "Hello, " + person.firstName + " " + person.lastName;
}
 
let user = { firstName: "Jane", lastName: "User" };
 
document.body.textContent = greeter(user);
Try
Classes
Finally, let’s extend the example one last time with classes. TypeScript supports new features in JavaScript, like support for class-based object-oriented programming.
Here we’re going to create a Student class with a constructor and a few public fields. Notice that classes and interfaces play well together, letting the programmer decide on the right level of abstraction.
Also of note, the use of public on parameters to the constructor is a shorthand that allows us to automatically create properties with that name.
class Student {
 fullName: string;
 constructor(
   public firstName: string,
   public middleInitial: string,
   public lastName: string
 ) {
   this.fullName = firstName + " " + middleInitial + " " + lastName;
 }
}
 
interface Person {
 firstName: string;
 lastName: string;
}
 
function greeter(person: Person) {
 return "Hello, " + person.firstName + " " + person.lastName;
}
 
let user = new Student("Jane", "M.", "User");
 
document.body.textContent = greeter(user);
Try
Re-run tsc greeter.ts and you’ll see the generated JavaScript is the same as the earlier code. Classes in TypeScript are just a shorthand for the same prototype-based OO that is frequently used in JavaScript.
Running your TypeScript web app
Now type the following in greeter.html:
<!DOCTYPE html>
<html>
 <head>
   <title>TypeScript Greeter</title>
 </head>
 <body>
   <script src="greeter.js"></script>
 </body>
</html>
Open greeter.html in the browser to run your first simple TypeScript web application!
Optional: Open greeter.ts in Visual Studio, or copy the code into the TypeScript playground. You can hover over identifiers to see their types. Notice that in some cases these types are inferred automatically for you. Re-type the last line, and see completion lists and parameter help based on the types of the DOM elements. Put your cursor on the reference to the greeter function, and hit F12 to go to its definition. Notice, too, that you can right-click on a symbol and use refactoring to rename it.
The type information provided works together with the tools to work with JavaScript at application scale. For more examples of what’s possible in TypeScript, see the Samples section of the website.

The TypeScript Handbook
About this Handbook
Over 20 years after its introduction to the programming community, JavaScript is now one of the most widespread cross-platform languages ever created. Starting as a small scripting language for adding trivial interactivity to webpages, JavaScript has grown to be a language of choice for both frontend and backend applications of every size. While the size, scope, and complexity of programs written in JavaScript has grown exponentially, the ability of the JavaScript language to express the relationships between different units of code has not. Combined with JavaScript’s rather peculiar runtime semantics, this mismatch between language and program complexity has made JavaScript development a difficult task to manage at scale.
The most common kinds of errors that programmers write can be described as type errors: a certain kind of value was used where a different kind of value was expected. This could be due to simple typos, a failure to understand the API surface of a library, incorrect assumptions about runtime behavior, or other errors. The goal of TypeScript is to be a static typechecker for JavaScript programs - in other words, a tool that runs before your code runs (static) and ensures that the types of the program are correct (typechecked).
If you are coming to TypeScript without a JavaScript background, with the intention of TypeScript being your first language, we recommend you first start reading the documentation on either the Microsoft Learn JavaScript tutorial or read JavaScript at the Mozilla Web Docs. If you have experience in other languages, you should be able to pick up JavaScript syntax quite quickly by reading the handbook.
How is this Handbook Structured
The handbook is split into two sections:
The Handbook
The TypeScript Handbook is intended to be a comprehensive document that explains TypeScript to everyday programmers. You can read the handbook by going from top to bottom in the left-hand navigation.
You should expect each chapter or page to provide you with a strong understanding of the given concepts. The TypeScript Handbook is not a complete language specification, but it is intended to be a comprehensive guide to all of the language’s features and behaviors.
A reader who completes the walkthrough should be able to:
Read and understand commonly-used TypeScript syntax and patterns
Explain the effects of important compiler options
Correctly predict type system behavior in most cases
In the interests of clarity and brevity, the main content of the Handbook will not explore every edge case or minutiae of the features being covered. You can find more details on particular concepts in the reference articles.
Reference Files
The reference section below the handbook in the navigation is built to provide a richer understanding of how a particular part of TypeScript works. You can read it top-to-bottom, but each section aims to provide a deeper explanation of a single concept - meaning there is no aim for continuity.
Non-Goals
The Handbook is also intended to be a concise document that can be comfortably read in a few hours. Certain topics won’t be covered in order to keep things short.
Specifically, the Handbook does not fully introduce core JavaScript basics like functions, classes, and closures. Where appropriate, we’ll include links to background reading that you can use to read up on those concepts.
The Handbook also isn’t intended to be a replacement for a language specification. In some cases, edge cases or formal descriptions of behavior will be skipped in favor of high-level, easier-to-understand explanations. Instead, there are separate reference pages that more precisely and formally describe many aspects of TypeScript’s behavior. The reference pages are not intended for readers unfamiliar with TypeScript, so they may use advanced terminology or reference topics you haven’t read about yet.
Finally, the Handbook won’t cover how TypeScript interacts with other tools, except where necessary. Topics like how to configure TypeScript with webpack, rollup, parcel, react, babel, closure, lerna, rush, bazel, preact, vue, angular, svelte, jquery, yarn, or npm are out of scope - you can find these resources elsewhere on the web.
Get Started
Before getting started with The Basics, we recommend reading one of the following introductory pages. These introductions are intended to highlight key similarities and differences between TypeScript and your favored programming language, and clear up common misconceptions specific to those languages.
TypeScript for the New Programmer
TypeScript for JavaScript Programmers
TypeScript for Java/C# Programmers
TypeScript for Functional Programmers
Otherwise, jump to The Basics.
On this page
About this Handbook
How is this Handbook Structured
Non-Goals
Get Started
Is this page helpful?
YesNo
The Basics
Welcome to the first page of the handbook. If this is your first experience with TypeScript - you may want to start at one of the 'Getting Started' guides
Each and every value in JavaScript has a set of behaviors you can observe from running different operations. That sounds abstract, but as a quick example, consider some operations we might run on a variable named message.
// Accessing the property 'toLowerCase'
// on 'message' and then calling it
message.toLowerCase();
// Calling 'message'
message();
If we break this down, the first runnable line of code accesses a property called toLowerCase and then calls it. The second one tries to call message directly.
But assuming we don’t know the value of message - and that’s pretty common - we can’t reliably say what results we’ll get from trying to run any of this code. The behavior of each operation depends entirely on what value we had in the first place.
Is message callable?
Does it have a property called toLowerCase on it?
If it does, is toLowerCase even callable?
If both of these values are callable, what do they return?
The answers to these questions are usually things we keep in our heads when we write JavaScript, and we have to hope we got all the details right.
Let’s say message was defined in the following way.
const message = "Hello World!";
As you can probably guess, if we try to run message.toLowerCase(), we’ll get the same string only in lower-case.
What about that second line of code? If you’re familiar with JavaScript, you’ll know this fails with an exception:
TypeError: message is not a function
It’d be great if we could avoid mistakes like this.
When we run our code, the way that our JavaScript runtime chooses what to do is by figuring out the type of the value - what sorts of behaviors and capabilities it has. That’s part of what that TypeError is alluding to - it’s saying that the string "Hello World!" cannot be called as a function.
For some values, such as the primitives string and number, we can identify their type at runtime using the typeof operator. But for other things like functions, there’s no corresponding runtime mechanism to identify their types. For example, consider this function:
function fn(x) {
 return x.flip();
}
We can observe by reading the code that this function will only work if given an object with a callable flip property, but JavaScript doesn’t surface this information in a way that we can check while the code is running. The only way in pure JavaScript to tell what fn does with a particular value is to call it and see what happens. This kind of behavior makes it hard to predict what the code will do before it runs, which means it’s harder to know what your code is going to do while you’re writing it.
Seen in this way, a type is the concept of describing which values can be passed to fn and which will crash. JavaScript only truly provides dynamic typing - running the code to see what happens.
The alternative is to use a static type system to make predictions about what the code is expected to do before it runs.
Static type-checking
Think back to that TypeError we got earlier from trying to call a string as a function. Most people don’t like to get any sorts of errors when running their code - those are considered bugs! And when we write new code, we try our best to avoid introducing new bugs.
If we add just a bit of code, save our file, re-run the code, and immediately see the error, we might be able to isolate the problem quickly; but that’s not always the case. We might not have tested the feature thoroughly enough, so we might never actually run into a potential error that would be thrown! Or if we were lucky enough to witness the error, we might have ended up doing large refactorings and adding a lot of different code that we’re forced to dig through.
Ideally, we could have a tool that helps us find these bugs before our code runs. That’s what a static type-checker like TypeScript does. Static type systems describe the shapes and behaviors of what our values will be when we run our programs. A type-checker like TypeScript uses that information and tells us when things might be going off the rails.
const message = "hello!";
 
message();
This expression is not callable.
  Type 'String' has no call signatures.
Try
Running that last sample with TypeScript will give us an error message before we run the code in the first place.
Non-exception Failures
So far we’ve been discussing certain things like runtime errors - cases where the JavaScript runtime tells us that it thinks something is nonsensical. Those cases come up because the ECMAScript specification has explicit instructions on how the language should behave when it runs into something unexpected.
For example, the specification says that trying to call something that isn’t callable should throw an error. Maybe that sounds like “obvious behavior”, but you could imagine that accessing a property that doesn’t exist on an object should throw an error too. Instead, JavaScript gives us different behavior and returns the value undefined:
const user = {
 name: "Daniel",
 age: 26,
};
user.location; // returns undefined
Ultimately, a static type system has to make the call over what code should be flagged as an error in its system, even if it’s “valid” JavaScript that won’t immediately throw an error. In TypeScript, the following code produces an error about location not being defined:
const user = {
 name: "Daniel",
 age: 26,
};
 
user.location;
Property 'location' does not exist on type '{ name: string; age: number; }'.
Try
While sometimes that implies a trade-off in what you can express, the intent is to catch legitimate bugs in our programs. And TypeScript catches a lot of legitimate bugs.
For example: typos,
const announcement = "Hello World!";
 
// How quickly can you spot the typos?
announcement.toLocaleLowercase();
announcement.toLocalLowerCase();
 
// We probably meant to write this...
announcement.toLocaleLowerCase();
Try
uncalled functions,
function flipCoin() {
 // Meant to be Math.random()
 return Math.random < 0.5;
Operator '<' cannot be applied to types '() => number' and 'number'.
}
Try
or basic logic errors.
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
 // ...
} else if (value === "b") {
This comparison appears to be unintentional because the types '"a"' and '"b"' have no overlap.
 // Oops, unreachable
}
Try
Types for Tooling
TypeScript can catch bugs when we make mistakes in our code. That’s great, but TypeScript can also prevent us from making those mistakes in the first place.
The type-checker has information to check things like whether we’re accessing the right properties on variables and other properties. Once it has that information, it can also start suggesting which properties you might want to use.
That means TypeScript can be leveraged for editing code too, and the core type-checker can provide error messages and code completion as you type in the editor. That’s part of what people often refer to when they talk about tooling in TypeScript.
import express from "express";
const app = express();
 
app.get("/", function (req, res) {
 res.sen
         
send
sendDate
sendfile
sendFile
sendStatus
});
 
app.listen(3000);
Try
TypeScript takes tooling seriously, and that goes beyond completions and errors as you type. An editor that supports TypeScript can deliver “quick fixes” to automatically fix errors, refactorings to easily re-organize code, and useful navigation features for jumping to definitions of a variable, or finding all references to a given variable. All of this is built on top of the type-checker and is fully cross-platform, so it’s likely that your favorite editor has TypeScript support available.
tsc, the TypeScript compiler
We’ve been talking about type-checking, but we haven’t yet used our type-checker. Let’s get acquainted with our new friend tsc, the TypeScript compiler. First we’ll need to grab it via npm.
npm install -g typescript
This installs the TypeScript Compiler tsc globally. You can use npx or similar tools if you’d prefer to run tsc from a local node_modules package instead.
Now let’s move to an empty folder and try writing our first TypeScript program: hello.ts:
// Greets the world.
console.log("Hello world!");
Try
Notice there are no frills here; this “hello world” program looks identical to what you’d write for a “hello world” program in JavaScript. And now let’s type-check it by running the command tsc which was installed for us by the typescript package.
tsc hello.ts
Tada!
Wait, “tada” what exactly? We ran tsc and nothing happened! Well, there were no type errors, so we didn’t get any output in our console since there was nothing to report.
But check again - we got some file output instead. If we look in our current directory, we’ll see a hello.js file next to hello.ts. That’s the output from our hello.ts file after tsc compiles or transforms it into a plain JavaScript file. And if we check the contents, we’ll see what TypeScript spits out after it processes a .ts file:
// Greets the world.
console.log("Hello world!");
In this case, there was very little for TypeScript to transform, so it looks identical to what we wrote. The compiler tries to emit clean readable code that looks like something a person would write. While that’s not always so easy, TypeScript indents consistently, is mindful of when our code spans across different lines of code, and tries to keep comments around.
What about if we did introduce a type-checking error? Let’s rewrite hello.ts:
// This is an industrial-grade general-purpose greeter function:
function greet(person, date) {
 console.log(`Hello ${person}, today is ${date}!`);
}
 
greet("Brendan");
Try
If we run tsc hello.ts again, notice that we get an error on the command line!
Expected 2 arguments, but got 1.
TypeScript is telling us we forgot to pass an argument to the greet function, and rightfully so. So far we’ve only written standard JavaScript, and yet type-checking was still able to find problems with our code. Thanks TypeScript!
Emitting with Errors
One thing you might not have noticed from the last example was that our hello.js file changed again. If we open that file up then we’ll see that the contents still basically look the same as our input file. That might be a bit surprising given the fact that tsc reported an error about our code, but this is based on one of TypeScript’s core values: much of the time, you will know better than TypeScript.
To reiterate from earlier, type-checking code limits the sorts of programs you can run, and so there’s a tradeoff on what sorts of things a type-checker finds acceptable. Most of the time that’s okay, but there are scenarios where those checks get in the way. For example, imagine yourself migrating JavaScript code over to TypeScript and introducing type-checking errors. Eventually you’ll get around to cleaning things up for the type-checker, but that original JavaScript code was already working! Why should converting it over to TypeScript stop you from running it?
So TypeScript doesn’t get in your way. Of course, over time, you may want to be a bit more defensive against mistakes, and make TypeScript act a bit more strictly. In that case, you can use the noEmitOnError compiler option. Try changing your hello.ts file and running tsc with that flag:
tsc --noEmitOnError hello.ts
You’ll notice that hello.js never gets updated.
Explicit Types
Up until now, we haven’t told TypeScript what person or date are. Let’s edit the code to tell TypeScript that person is a string, and that date should be a Date object. We’ll also use the toDateString() method on date.
function greet(person: string, date: Date) {
 console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
Try
What we did was add type annotations on person and date to describe what types of values greet can be called with. You can read that signature as ”greet takes a person of type string, and a date of type Date“.
With this, TypeScript can tell us about other cases where greet might have been called incorrectly. For example…
function greet(person: string, date: Date) {
 console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
 
greet("Maddison", Date());
Argument of type 'string' is not assignable to parameter of type 'Date'.
Try
Huh? TypeScript reported an error on our second argument, but why?
Perhaps surprisingly, calling Date() in JavaScript returns a string. On the other hand, constructing a Date with new Date() actually gives us what we were expecting.
Anyway, we can quickly fix up the error:
function greet(person: string, date: Date) {
 console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
 
greet("Maddison", new Date());
Try
Keep in mind, we don’t always have to write explicit type annotations. In many cases, TypeScript can even just infer (or “figure out”) the types for us even if we omit them.
let msg = "hello there!";
  
let msg: string
Try
Even though we didn’t tell TypeScript that msg had the type string it was able to figure that out. That’s a feature, and it’s best not to add annotations when the type system would end up inferring the same type anyway.
Note: The message bubble inside the previous code sample is what your editor would show if you had hovered over the word.
Erased Types
Let’s take a look at what happens when we compile the above function greet with tsc to output JavaScript:
"use strict";
function greet(person, date) {
   console.log("Hello ".concat(person, ", today is ").concat(date.toDateString(), "!"));
}
greet("Maddison", new Date());
 
Try
Notice two things here:
Our person and date parameters no longer have type annotations.
Our “template string” - that string that used backticks (the ` character) - was converted to plain strings with concatenations.
More on that second point later, but let’s now focus on that first point. Type annotations aren’t part of JavaScript (or ECMAScript to be pedantic), so there really aren’t any browsers or other runtimes that can just run TypeScript unmodified. That’s why TypeScript needs a compiler in the first place - it needs some way to strip out or transform any TypeScript-specific code so that you can run it. Most TypeScript-specific code gets erased away, and likewise, here our type annotations were completely erased.
Remember: Type annotations never change the runtime behavior of your program.
Downleveling
One other difference from the above was that our template string was rewritten from
`Hello ${person}, today is ${date.toDateString()}!`;
to
"Hello ".concat(person, ", today is ").concat(date.toDateString(), "!");
Why did this happen?
Template strings are a feature from a version of ECMAScript called ECMAScript 2015 (a.k.a. ECMAScript 6, ES2015, ES6, etc. - don’t ask). TypeScript has the ability to rewrite code from newer versions of ECMAScript to older ones such as ECMAScript 3 or ECMAScript 5 (a.k.a. ES5). This process of moving from a newer or “higher” version of ECMAScript down to an older or “lower” one is sometimes called downleveling.
By default TypeScript targets ES5, an extremely old version of ECMAScript. We could have chosen something a little bit more recent by using the target option. Running with --target es2015 changes TypeScript to target ECMAScript 2015, meaning code should be able to run wherever ECMAScript 2015 is supported. So running tsc --target es2015 hello.ts gives us the following output:
function greet(person, date) {
 console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet("Maddison", new Date());
While the default target is ES5, the great majority of current browsers support ES2015. Most developers can therefore safely specify ES2015 or above as a target, unless compatibility with certain ancient browsers is important.
Strictness
Different users come to TypeScript looking for different things in a type-checker. Some people are looking for a more loose opt-in experience which can help validate only some parts of their program, and still have decent tooling. This is the default experience with TypeScript, where types are optional, inference takes the most lenient types, and there’s no checking for potentially null/undefined values. Much like how tsc emits in the face of errors, these defaults are put in place to stay out of your way. If you’re migrating existing JavaScript, that might be a desirable first step.
In contrast, a lot of users prefer to have TypeScript validate as much as it can straight away, and that’s why the language provides strictness settings as well. These strictness settings turn static type-checking from a switch (either your code is checked or not) into something closer to a dial. The further you turn this dial up, the more TypeScript will check for you. This can require a little extra work, but generally speaking it pays for itself in the long run, and enables more thorough checks and more accurate tooling. When possible, a new codebase should always turn these strictness checks on.
TypeScript has several type-checking strictness flags that can be turned on or off, and all of our examples will be written with all of them enabled unless otherwise stated. The strict flag in the CLI, or "strict": true in a tsconfig.json toggles them all on simultaneously, but we can opt out of them individually. The two biggest ones you should know about are noImplicitAny and strictNullChecks.
noImplicitAny
Recall that in some places, TypeScript doesn’t try to infer types for us and instead falls back to the most lenient type: any. This isn’t the worst thing that can happen - after all, falling back to any is just the plain JavaScript experience anyway.
However, using any often defeats the purpose of using TypeScript in the first place. The more typed your program is, the more validation and tooling you’ll get, meaning you’ll run into fewer bugs as you code. Turning on the noImplicitAny flag will issue an error on any variables whose type is implicitly inferred as any.
strictNullChecks
By default, values like null and undefined are assignable to any other type. This can make writing some code easier, but forgetting to handle null and undefined is the cause of countless bugs in the world - some consider it a billion dollar mistake! The strictNullChecks flag makes handling null and undefined more explicit, and spares us from worrying about whether we forgot to handle null and undefined.


Everyday Types
In this chapter, we’ll cover some of the most common types of values you’ll find in JavaScript code, and explain the corresponding ways to describe those types in TypeScript. This isn’t an exhaustive list, and future chapters will describe more ways to name and use other types.
Types can also appear in many more places than just type annotations. As we learn about the types themselves, we’ll also learn about the places where we can refer to these types to form new constructs.
We’ll start by reviewing the most basic and common types you might encounter when writing JavaScript or TypeScript code. These will later form the core building blocks of more complex types.
The primitives: string, number, and boolean
JavaScript has three very commonly used primitives: string, number, and boolean. Each has a corresponding type in TypeScript. As you might expect, these are the same names you’d see if you used the JavaScript typeof operator on a value of those types:
string represents string values like "Hello, world"
number is for numbers like 42. JavaScript does not have a special runtime value for integers, so there’s no equivalent to int or float - everything is simply number
boolean is for the two values true and false
The type names String, Number, and Boolean (starting with capital letters) are legal, but refer to some special built-in types that will very rarely appear in your code. Always use string, number, or boolean for types.
Arrays
To specify the type of an array like [1, 2, 3], you can use the syntax number[]; this syntax works for any type (e.g. string[] is an array of strings, and so on). You may also see this written as Array<number>, which means the same thing. We’ll learn more about the syntax T<U> when we cover generics.
Note that [number] is a different thing; refer to the section on Tuples.
any
TypeScript also has a special type, any, that you can use whenever you don’t want a particular value to cause typechecking errors.
When a value is of type any, you can access any properties of it (which will in turn be of type any), call it like a function, assign it to (or from) a value of any type, or pretty much anything else that’s syntactically legal:
let obj: any = { x: 0 };
// None of the following lines of code will throw compiler errors.
// Using `any` disables all further type checking, and it is assumed
// you know the environment better than TypeScript.
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
Try
The any type is useful when you don’t want to write out a long type just to convince TypeScript that a particular line of code is okay.
noImplicitAny
When you don’t specify a type, and TypeScript can’t infer it from context, the compiler will typically default to any.
You usually want to avoid this, though, because any isn’t type-checked. Use the compiler flag noImplicitAny to flag any implicit any as an error.
Type Annotations on Variables
When you declare a variable using const, var, or let, you can optionally add a type annotation to explicitly specify the type of the variable:
let myName: string = "Alice";
Try
TypeScript doesn’t use “types on the left”-style declarations like int x = 0; Type annotations will always go after the thing being typed.
In most cases, though, this isn’t needed. Wherever possible, TypeScript tries to automatically infer the types in your code. For example, the type of a variable is inferred based on the type of its initializer:
// No type annotation needed -- 'myName' inferred as type 'string'
let myName = "Alice";
Try
For the most part you don’t need to explicitly learn the rules of inference. If you’re starting out, try using fewer type annotations than you think - you might be surprised how few you need for TypeScript to fully understand what’s going on.
Functions
Functions are the primary means of passing data around in JavaScript. TypeScript allows you to specify the types of both the input and output values of functions.
Parameter Type Annotations
When you declare a function, you can add type annotations after each parameter to declare what types of parameters the function accepts. Parameter type annotations go after the parameter name:
// Parameter type annotation
function greet(name: string) {
 console.log("Hello, " + name.toUpperCase() + "!!");
}
Try
When a parameter has a type annotation, arguments to that function will be checked:
// Would be a runtime error if executed!
greet(42);
Argument of type 'number' is not assignable to parameter of type 'string'.
Try
Even if you don’t have type annotations on your parameters, TypeScript will still check that you passed the right number of arguments.
Return Type Annotations
You can also add return type annotations. Return type annotations appear after the parameter list:
function getFavoriteNumber(): number {
 return 26;
}
Try
Much like variable type annotations, you usually don’t need a return type annotation because TypeScript will infer the function’s return type based on its return statements. The type annotation in the above example doesn’t change anything. Some codebases will explicitly specify a return type for documentation purposes, to prevent accidental changes, or just for personal preference.
Functions Which Return Promises
If you want to annotate the return type of a function which returns a promise, you should use the Promise type:
async function getFavoriteNumber(): Promise<number> {
 return 26;
}
Try
Anonymous Functions
Anonymous functions are a little bit different from function declarations. When a function appears in a place where TypeScript can determine how it’s going to be called, the parameters of that function are automatically given types.
Here’s an example:
const names = ["Alice", "Bob", "Eve"];
 
// Contextual typing for function - parameter s inferred to have type string
names.forEach(function (s) {
 console.log(s.toUpperCase());
});
 
// Contextual typing also applies to arrow functions
names.forEach((s) => {
 console.log(s.toUpperCase());
});
Try
Even though the parameter s didn’t have a type annotation, TypeScript used the types of the forEach function, along with the inferred type of the array, to determine the type s will have.
This process is called contextual typing because the context that the function occurred within informs what type it should have.
Similar to the inference rules, you don’t need to explicitly learn how this happens, but understanding that it does happen can help you notice when type annotations aren’t needed. Later, we’ll see more examples of how the context that a value occurs in can affect its type.
Object Types
Apart from primitives, the most common sort of type you’ll encounter is an object type. This refers to any JavaScript value with properties, which is almost all of them! To define an object type, we simply list its properties and their types.
For example, here’s a function that takes a point-like object:
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
 console.log("The coordinate's x value is " + pt.x);
 console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
Try
Here, we annotated the parameter with a type with two properties - x and y - which are both of type number. You can use , or ; to separate the properties, and the last separator is optional either way.
The type part of each property is also optional. If you don’t specify a type, it will be assumed to be any.
Optional Properties
Object types can also specify that some or all of their properties are optional. To do this, add a ? after the property name:
function printName(obj: { first: string; last?: string }) {
 // ...
}
// Both OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
Try
In JavaScript, if you access a property that doesn’t exist, you’ll get the value undefined rather than a runtime error. Because of this, when you read from an optional property, you’ll have to check for undefined before using it.
function printName(obj: { first: string; last?: string }) {
 // Error - might crash if 'obj.last' wasn't provided!
 console.log(obj.last.toUpperCase());
'obj.last' is possibly 'undefined'.
 if (obj.last !== undefined) {
   // OK
   console.log(obj.last.toUpperCase());
 }
 
 // A safe alternative using modern JavaScript syntax:
 console.log(obj.last?.toUpperCase());
}
Try
Union Types
TypeScript’s type system allows you to build new types out of existing ones using a large variety of operators. Now that we know how to write a few types, it’s time to start combining them in interesting ways.
Defining a Union Type
The first way to combine types you might see is a union type. A union type is a type formed from two or more other types, representing values that may be any one of those types. We refer to each of these types as the union’s members.
Let’s write a function that can operate on strings or numbers:
function printId(id: number | string) {
 console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });
Argument of type '{ myID: number; }' is not assignable to parameter of type 'string | number'.
Try
The separator of the union members is allowed before the first element, so you could also write this:
function printTextOrNumberOrBool(
 textOrNumberOrBool:
   | string
   | number
   | boolean
) {
 console.log(textOrNumberOrBool);
}
Try
Working with Union Types
It’s easy to provide a value matching a union type - simply provide a type matching any of the union’s members. If you have a value of a union type, how do you work with it?
TypeScript will only allow an operation if it is valid for every member of the union. For example, if you have the union string | number, you can’t use methods that are only available on string:
function printId(id: number | string) {
 console.log(id.toUpperCase());
Property 'toUpperCase' does not exist on type 'string | number'.
  Property 'toUpperCase' does not exist on type 'number'.
}
Try
The solution is to narrow the union with code, the same as you would in JavaScript without type annotations. Narrowing occurs when TypeScript can deduce a more specific type for a value based on the structure of the code.
For example, TypeScript knows that only a string value will have a typeof value "string":
function printId(id: number | string) {
 if (typeof id === "string") {
   // In this branch, id is of type 'string'
   console.log(id.toUpperCase());
 } else {
   // Here, id is of type 'number'
   console.log(id);
 }
}
Try
Another example is to use a function like Array.isArray:
function welcomePeople(x: string[] | string) {
 if (Array.isArray(x)) {
   // Here: 'x' is 'string[]'
   console.log("Hello, " + x.join(" and "));
 } else {
   // Here: 'x' is 'string'
   console.log("Welcome lone traveler " + x);
 }
}
Try
Notice that in the else branch, we don’t need to do anything special - if x wasn’t a string[], then it must have been a string.
Sometimes you’ll have a union where all the members have something in common. For example, both arrays and strings have a slice method. If every member in a union has a property in common, you can use that property without narrowing:
// Return type is inferred as number[] | string
function getFirstThree(x: number[] | string) {
 return x.slice(0, 3);
}
Try
It might be confusing that a union of types appears to have the intersection of those types’ properties. This is not an accident - the name union comes from type theory. The union number | string is composed by taking the union of the values from each type. Notice that given two sets with corresponding facts about each set, only the intersection of those facts applies to the union of the sets themselves. For example, if we had a room of tall people wearing hats, and another room of Spanish speakers wearing hats, after combining those rooms, the only thing we know about every person is that they must be wearing a hat.
Type Aliases
We’ve been using object types and union types by writing them directly in type annotations. This is convenient, but it’s common to want to use the same type more than once and refer to it by a single name.
A type alias is exactly that - a name for any type. The syntax for a type alias is:
type Point = {
 x: number;
 y: number;
};
 
// Exactly the same as the earlier example
function printCoord(pt: Point) {
 console.log("The coordinate's x value is " + pt.x);
 console.log("The coordinate's y value is " + pt.y);
}
 
printCoord({ x: 100, y: 100 });
Try
You can actually use a type alias to give a name to any type at all, not just an object type. For example, a type alias can name a union type:
type ID = number | string;
Try
Note that aliases are only aliases - you cannot use type aliases to create different/distinct “versions” of the same type. When you use the alias, it’s exactly as if you had written the aliased type. In other words, this code might look illegal, but is OK according to TypeScript because both types are aliases for the same type:
type UserInputSanitizedString = string;
 
function sanitizeInput(str: string): UserInputSanitizedString {
 return sanitize(str);
}
 
// Create a sanitized input
let userInput = sanitizeInput(getInput());
 
// Can still be re-assigned with a string though
userInput = "new input";
Try
Interfaces
An interface declaration is another way to name an object type:
interface Point {
 x: number;
 y: number;
}
 
function printCoord(pt: Point) {
 console.log("The coordinate's x value is " + pt.x);
 console.log("The coordinate's y value is " + pt.y);
}
 
printCoord({ x: 100, y: 100 });
Try
Just like when we used a type alias above, the example works just as if we had used an anonymous object type. TypeScript is only concerned with the structure of the value we passed to printCoord - it only cares that it has the expected properties. Being concerned only with the structure and capabilities of types is why we call TypeScript a structurally typed type system.
Differences Between Type Aliases and Interfaces
Type aliases and interfaces are very similar, and in many cases you can choose between them freely. Almost all features of an interface are available in type, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.
Interface
Type
Extending an interface
interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;
       
Extending a type via intersections
type Animal = {
  name: string;
}

type Bear = Animal & { 
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;
       
Adding new fields to an existing interface
interface Window {
  title: string;
}

interface Window {
  ts: TypeScriptAPI;
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
       
A type cannot be changed after being created
type Window = {
  title: string;
}

type Window = {
  ts: TypeScriptAPI;
}

 // Error: Duplicate identifier 'Window'.

       

You’ll learn more about these concepts in later chapters, so don’t worry if you don’t understand all of these right away.
Prior to TypeScript version 4.2, type alias names may appear in error messages, sometimes in place of the equivalent anonymous type (which may or may not be desirable). Interfaces will always be named in error messages.
Type aliases may not participate in declaration merging, but interfaces can.
Interfaces may only be used to declare the shapes of objects, not rename primitives.
Interface names will always appear in their original form in error messages, but only when they are used by name.
Using interfaces with extends can often be more performant for the compiler than type aliases with intersections
For the most part, you can choose based on personal preference, and TypeScript will tell you if it needs something to be the other kind of declaration. If you would like a heuristic, use interface until you need to use features from type.
Type Assertions
Sometimes you will have information about the type of a value that TypeScript can’t know about.
For example, if you’re using document.getElementById, TypeScript only knows that this will return some kind of HTMLElement, but you might know that your page will always have an HTMLCanvasElement with a given ID.
In this situation, you can use a type assertion to specify a more specific type:
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
Try
Like a type annotation, type assertions are removed by the compiler and won’t affect the runtime behavior of your code.
You can also use the angle-bracket syntax (except if the code is in a .tsx file), which is equivalent:
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
Try
Reminder: Because type assertions are removed at compile-time, there is no runtime checking associated with a type assertion. There won’t be an exception or null generated if the type assertion is wrong.
TypeScript only allows type assertions which convert to a more specific or less specific version of a type. This rule prevents “impossible” coercions like:
const x = "hello" as number;
Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
Try
Sometimes this rule can be too conservative and will disallow more complex coercions that might be valid. If this happens, you can use two assertions, first to any (or unknown, which we’ll introduce later), then to the desired type:
const a = expr as any as T;
Try
Literal Types
In addition to the general types string and number, we can refer to specific strings and numbers in type positions.
One way to think about this is to consider how JavaScript comes with different ways to declare a variable. Both var and let allow for changing what is held inside the variable, and const does not. This is reflected in how TypeScript creates types for literals.
let changingString = "Hello World";
changingString = "Olá Mundo";
// Because `changingString` can represent any possible string, that
// is how TypeScript describes it in the type system
changingString;
    
let changingString: string
 
const constantString = "Hello World";
// Because `constantString` can only represent 1 possible string, it
// has a literal type representation
constantString;
    
const constantString: "Hello World"
Try
By themselves, literal types aren’t very valuable:
let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
Type '"howdy"' is not assignable to type '"hello"'.
Try
It’s not much use to have a variable that can only have one value!
But by combining literals into unions, you can express a much more useful concept - for example, functions that only accept a certain set of known values:
function printText(s: string, alignment: "left" | "right" | "center") {
 // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
Try
Numeric literal types work the same way:
function compare(a: string, b: string): -1 | 0 | 1 {
 return a === b ? 0 : a > b ? 1 : -1;
}
Try
Of course, you can combine these with non-literal types:
interface Options {
 width: number;
}
function configure(x: Options | "auto") {
 // ...
}
configure({ width: 100 });
configure("auto");
configure("automatic");
Argument of type '"automatic"' is not assignable to parameter of type 'Options | "auto"'.
Try
There’s one more kind of literal type: boolean literals. There are only two boolean literal types, and as you might guess, they are the types true and false. The type boolean itself is actually just an alias for the union true | false.
Literal Inference
When you initialize a variable with an object, TypeScript assumes that the properties of that object might change values later. For example, if you wrote code like this:
const obj = { counter: 0 };
if (someCondition) {
 obj.counter = 1;
}
Try
TypeScript doesn’t assume the assignment of 1 to a field which previously had 0 is an error. Another way of saying this is that obj.counter must have the type number, not 0, because types are used to determine both reading and writing behavior.
The same applies to strings:
declare function handleRequest(url: string, method: "GET" | "POST"): void;
 
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
Try
In the above example req.method is inferred to be string, not "GET". Because code can be evaluated between the creation of req and the call of handleRequest which could assign a new string like "GUESS" to req.method, TypeScript considers this code to have an error.
There are two ways to work around this.
You can change the inference by adding a type assertion in either location:
// Change 1:
const req = { url: "https://example.com", method: "GET" as "GET" };
// Change 2
handleRequest(req.url, req.method as "GET");
Try
Change 1 means “I intend for req.method to always have the literal type "GET"”, preventing the possible assignment of "GUESS" to that field after. Change 2 means “I know for other reasons that req.method has the value "GET"“.
You can use as const to convert the entire object to be type literals:
const req = { url: "https://example.com", method: "GET" } as const;
handleRequest(req.url, req.method);
Try
The as const suffix acts like const but for the type system, ensuring that all properties are assigned the literal type instead of a more general version like string or number.
null and undefined
JavaScript has two primitive values used to signal absent or uninitialized value: null and undefined.
TypeScript has two corresponding types by the same names. How these types behave depends on whether you have the strictNullChecks option on.
strictNullChecks off
With strictNullChecks off, values that might be null or undefined can still be accessed normally, and the values null and undefined can be assigned to a property of any type. This is similar to how languages without null checks (e.g. C#, Java) behave. The lack of checking for these values tends to be a major source of bugs; we always recommend people turn strictNullChecks on if it’s practical to do so in their codebase.
strictNullChecks on
With strictNullChecks on, when a value is null or undefined, you will need to test for those values before using methods or properties on that value. Just like checking for undefined before using an optional property, we can use narrowing to check for values that might be null:
function doSomething(x: string | null) {
 if (x === null) {
   // do nothing
 } else {
   console.log("Hello, " + x.toUpperCase());
 }
}
Try
Non-null Assertion Operator (Postfix !)
TypeScript also has a special syntax for removing null and undefined from a type without doing any explicit checking. Writing ! after any expression is effectively a type assertion that the value isn’t null or undefined:
function liveDangerously(x?: number | null) {
 // No error
 console.log(x!.toFixed());
}
Try
Just like other type assertions, this doesn’t change the runtime behavior of your code, so it’s important to only use ! when you know that the value can’t be null or undefined.
Enums
Enums are a feature added to JavaScript by TypeScript which allows for describing a value which could be one of a set of possible named constants. Unlike most TypeScript features, this is not a type-level addition to JavaScript but something added to the language and runtime. Because of this, it’s a feature which you should know exists, but maybe hold off on using unless you are sure. You can read more about enums in the Enum reference page.
Less Common Primitives
It’s worth mentioning the rest of the primitives in JavaScript which are represented in the type system. Though we will not go into depth here.
bigint
From ES2020 onwards, there is a primitive in JavaScript used for very large integers, BigInt:
// Creating a bigint via the BigInt function
const oneHundred: bigint = BigInt(100);
 
// Creating a BigInt via the literal syntax
const anotherHundred: bigint = 100n;
Try
You can learn more about BigInt in the TypeScript 3.2 release notes.
symbol
There is a primitive in JavaScript used to create a globally unique reference via the function Symbol():
const firstName = Symbol("name");
const secondName = Symbol("name");
 
if (firstName === secondName) {
This comparison appears to be unintentional because the types 'typeof firstName' and 'typeof secondName' have no overlap.
 // Can't ever happen
}
Try
You can learn more about them in Symbols reference page.
Narrowing
Imagine we have a function called padLeft.
function padLeft(padding: number | string, input: string): string {
 throw new Error("Not implemented yet!");
}
Try
If padding is a number, it will treat that as the number of spaces we want to prepend to input. If padding is a string, it should just prepend padding to input. Let’s try to implement the logic for when padLeft is passed a number for padding.
function padLeft(padding: number | string, input: string): string {
 return " ".repeat(padding) + input;
Argument of type 'string | number' is not assignable to parameter of type 'number'.
  Type 'string' is not assignable to type 'number'.
}
Try
Uh-oh, we’re getting an error on padding. TypeScript is warning us that we’re passing a value with type number | string to the repeat function, which only accepts a number, and it’s right. In other words, we haven’t explicitly checked if padding is a number first, nor are we handling the case where it’s a string, so let’s do exactly that.
function padLeft(padding: number | string, input: string): string {
 if (typeof padding === "number") {
   return " ".repeat(padding) + input;
 }
 return padding + input;
}
Try
If this mostly looks like uninteresting JavaScript code, that’s sort of the point. Apart from the annotations we put in place, this TypeScript code looks like JavaScript. The idea is that TypeScript’s type system aims to make it as easy as possible to write typical JavaScript code without bending over backwards to get type safety.
While it might not look like much, there’s actually a lot going on under the covers here. Much like how TypeScript analyzes runtime values using static types, it overlays type analysis on JavaScript’s runtime control flow constructs like if/else, conditional ternaries, loops, truthiness checks, etc., which can all affect those types.
Within our if check, TypeScript sees typeof padding === "number" and understands that as a special form of code called a type guard. TypeScript follows possible paths of execution that our programs can take to analyze the most specific possible type of a value at a given position. It looks at these special checks (called type guards) and assignments, and the process of refining types to more specific types than declared is called narrowing. In many editors we can observe these types as they change, and we’ll even do so in our examples.
function padLeft(padding: number | string, input: string): string {
 if (typeof padding === "number") {
   return " ".repeat(padding) + input;
                      
(parameter) padding: number
 }
 return padding + input;
         
(parameter) padding: string
}
Try
There are a couple of different constructs TypeScript understands for narrowing.
typeof type guards
As we’ve seen, JavaScript supports a typeof operator which can give very basic information about the type of values we have at runtime. TypeScript expects this to return a certain set of strings:
"string"
"number"
"bigint"
"boolean"
"symbol"
"undefined"
"object"
"function"
Like we saw with padLeft, this operator comes up pretty often in a number of JavaScript libraries, and TypeScript can understand it to narrow types in different branches.
In TypeScript, checking against the value returned by typeof is a type guard. Because TypeScript encodes how typeof operates on different values, it knows about some of its quirks in JavaScript. For example, notice that in the list above, typeof doesn’t return the string null. Check out the following example:
function printAll(strs: string | string[] | null) {
 if (typeof strs === "object") {
   for (const s of strs) {
'strs' is possibly 'null'.
     console.log(s);
   }
 } else if (typeof strs === "string") {
   console.log(strs);
 } else {
   // do nothing
 }
}
Try
In the printAll function, we try to check if strs is an object to see if it’s an array type (now might be a good time to reinforce that arrays are object types in JavaScript). But it turns out that in JavaScript, typeof null is actually "object"! This is one of those unfortunate accidents of history.
Users with enough experience might not be surprised, but not everyone has run into this in JavaScript; luckily, TypeScript lets us know that strs was only narrowed down to string[] | null instead of just string[].
This might be a good segue into what we’ll call “truthiness” checking.
Truthiness narrowing
Truthiness might not be a word you’ll find in the dictionary, but it’s very much something you’ll hear about in JavaScript.
In JavaScript, we can use any expression in conditionals, &&s, ||s, if statements, Boolean negations (!), and more. As an example, if statements don’t expect their condition to always have the type boolean.
function getUsersOnlineMessage(numUsersOnline: number) {
 if (numUsersOnline) {
   return `There are ${numUsersOnline} online now!`;
 }
 return "Nobody's here. :(";
}
Try
In JavaScript, constructs like if first “coerce” their conditions to booleans to make sense of them, and then choose their branches depending on whether the result is true or false. Values like
0
NaN
"" (the empty string)
0n (the bigint version of zero)
null
undefined
all coerce to false, and other values get coerced to true. You can always coerce values to booleans by running them through the Boolean function, or by using the shorter double-Boolean negation. (The latter has the advantage that TypeScript infers a narrow literal boolean type true, while inferring the first as type boolean.)
// both of these result in 'true'
Boolean("hello"); // type: boolean, value: true
!!"world"; // type: true,    value: true
This kind of expression is always truthy.
Try
It’s fairly popular to leverage this behavior, especially for guarding against values like null or undefined. As an example, let’s try using it for our printAll function.
function printAll(strs: string | string[] | null) {
 if (strs && typeof strs === "object") {
   for (const s of strs) {
     console.log(s);
   }
 } else if (typeof strs === "string") {
   console.log(strs);
 }
}
Try
You’ll notice that we’ve gotten rid of the error above by checking if strs is truthy. This at least prevents us from dreaded errors when we run our code like:
TypeError: null is not iterable
Keep in mind though that truthiness checking on primitives can often be error prone. As an example, consider a different attempt at writing printAll
function printAll(strs: string | string[] | null) {
 // !!!!!!!!!!!!!!!!
 //  DON'T DO THIS!
 //   KEEP READING
 // !!!!!!!!!!!!!!!!
 if (strs) {
   if (typeof strs === "object") {
     for (const s of strs) {
       console.log(s);
     }
   } else if (typeof strs === "string") {
     console.log(strs);
   }
 }
}
Try
We wrapped the entire body of the function in a truthy check, but this has a subtle downside: we may no longer be handling the empty string case correctly.
TypeScript doesn’t hurt us here at all, but this behavior is worth noting if you’re less familiar with JavaScript. TypeScript can often help you catch bugs early on, but if you choose to do nothing with a value, there’s only so much that it can do without being overly prescriptive. If you want, you can make sure you handle situations like these with a linter.
One last word on narrowing by truthiness is that Boolean negations with ! filter out from negated branches.
function multiplyAll(
 values: number[] | undefined,
 factor: number
): number[] | undefined {
 if (!values) {
   return values;
 } else {
   return values.map((x) => x * factor);
 }
}
Try
Equality narrowing
TypeScript also uses switch statements and equality checks like ===, !==, ==, and != to narrow types. For example:
function example(x: string | number, y: string | boolean) {
 if (x === y) {
   // We can now call any 'string' method on 'x' or 'y'.
   x.toUpperCase();
        
(method) String.toUpperCase(): string
   y.toLowerCase();
        
(method) String.toLowerCase(): string
 } else {
   console.log(x);
             
(parameter) x: string | number
   console.log(y);
             
(parameter) y: string | boolean
 }
}
Try
When we checked that x and y are both equal in the above example, TypeScript knew their types also had to be equal. Since string is the only common type that both x and y could take on, TypeScript knows that x and y must be strings in the first branch.
Checking against specific literal values (as opposed to variables) works also. In our section about truthiness narrowing, we wrote a printAll function which was error-prone because it accidentally didn’t handle empty strings properly. Instead we could have done a specific check to block out nulls, and TypeScript still correctly removes null from the type of strs.
function printAll(strs: string | string[] | null) {
 if (strs !== null) {
   if (typeof strs === "object") {
     for (const s of strs) {
                     
(parameter) strs: string[]
       console.log(s);
     }
   } else if (typeof strs === "string") {
     console.log(strs);
                 
(parameter) strs: string
   }
 }
}
Try
JavaScript’s looser equality checks with == and != also get narrowed correctly. If you’re unfamiliar, checking whether something == null actually not only checks whether it is specifically the value null - it also checks whether it’s potentially undefined. The same applies to == undefined: it checks whether a value is either null or undefined.
interface Container {
 value: number | null | undefined;
}
 
function multiplyValue(container: Container, factor: number) {
 // Remove both 'null' and 'undefined' from the type.
 if (container.value != null) {
   console.log(container.value);
                         
(property) Container.value: number
 
   // Now we can safely multiply 'container.value'.
   container.value *= factor;
 }
}
Try
The in operator narrowing
JavaScript has an operator for determining if an object or its prototype chain has a property with a name: the in operator. TypeScript takes this into account as a way to narrow down potential types.
For example, with the code: "value" in x. where "value" is a string literal and x is a union type. The “true” branch narrows x’s types which have either an optional or required property value, and the “false” branch narrows to types which have an optional or missing property value.
type Fish = { swim: () => void };
type Bird = { fly: () => void };
 
function move(animal: Fish | Bird) {
 if ("swim" in animal) {
   return animal.swim();
 }
 
 return animal.fly();
}
Try
To reiterate, optional properties will exist in both sides for narrowing. For example, a human could both swim and fly (with the right equipment) and thus should show up in both sides of the in check:
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };
 
function move(animal: Fish | Bird | Human) {
 if ("swim" in animal) {
   animal;
    
(parameter) animal: Fish | Human
 } else {
   animal;
    
(parameter) animal: Bird | Human
 }
}
Try
instanceof narrowing
JavaScript has an operator for checking whether or not a value is an “instance” of another value. More specifically, in JavaScript x instanceof Foo checks whether the prototype chain of x contains Foo.prototype. While we won’t dive deep here, and you’ll see more of this when we get into classes, they can still be useful for most values that can be constructed with new. As you might have guessed, instanceof is also a type guard, and TypeScript narrows in branches guarded by instanceofs.
function logValue(x: Date | string) {
 if (x instanceof Date) {
   console.log(x.toUTCString());
             
(parameter) x: Date
 } else {
   console.log(x.toUpperCase());
             
(parameter) x: string
 }
}
Try
Assignments
As we mentioned earlier, when we assign to any variable, TypeScript looks at the right side of the assignment and narrows the left side appropriately.
let x = Math.random() < 0.5 ? 10 : "hello world!";
 
let x: string | number
x = 1;
 
console.log(x);
         
let x: number
x = "goodbye!";
 
console.log(x);
         
let x: string
Try
Notice that each of these assignments is valid. Even though the observed type of x changed to number after our first assignment, we were still able to assign a string to x. This is because the declared type of x - the type that x started with - is string | number, and assignability is always checked against the declared type.
If we’d assigned a boolean to x, we’d have seen an error since that wasn’t part of the declared type.
let x = Math.random() < 0.5 ? 10 : "hello world!";
 
let x: string | number
x = 1;
 
console.log(x);
         
let x: number
x = true;
Type 'boolean' is not assignable to type 'string | number'.
 
console.log(x);
         
let x: string | number
Try
Control flow analysis
Up until this point, we’ve gone through some basic examples of how TypeScript narrows within specific branches. But there’s a bit more going on than just walking up from every variable and looking for type guards in ifs, whiles, conditionals, etc. For example
function padLeft(padding: number | string, input: string) {
 if (typeof padding === "number") {
   return " ".repeat(padding) + input;
 }
 return padding + input;
}
Try
padLeft returns from within its first if block. TypeScript was able to analyze this code and see that the rest of the body (return padding + input;) is unreachable in the case where padding is a number. As a result, it was able to remove number from the type of padding (narrowing from string | number to string) for the rest of the function.
This analysis of code based on reachability is called control flow analysis, and TypeScript uses this flow analysis to narrow types as it encounters type guards and assignments. When a variable is analyzed, control flow can split off and re-merge over and over again, and that variable can be observed to have a different type at each point.
function example() {
 let x: string | number | boolean;
 
 x = Math.random() < 0.5;
 
 console.log(x);
           
let x: boolean
 
 if (Math.random() < 0.5) {
   x = "hello";
   console.log(x);
             
let x: string
 } else {
   x = 100;
   console.log(x);
             
let x: number
 }
 
 return x;
      
let x: string | number
}
Try
Using type predicates
We’ve worked with existing JavaScript constructs to handle narrowing so far, however sometimes you want more direct control over how types change throughout your code.
To define a user-defined type guard, we simply need to define a function whose return type is a type predicate:
function isFish(pet: Fish | Bird): pet is Fish {
 return (pet as Fish).swim !== undefined;
}
Try
pet is Fish is our type predicate in this example. A predicate takes the form parameterName is Type, where parameterName must be the name of a parameter from the current function signature.
Any time isFish is called with some variable, TypeScript will narrow that variable to that specific type if the original type is compatible.
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();
 
if (isFish(pet)) {
 pet.swim();
} else {
 pet.fly();
}
Try
Notice that TypeScript not only knows that pet is a Fish in the if branch; it also knows that in the else branch, you don’t have a Fish, so you must have a Bird.
You may use the type guard isFish to filter an array of Fish | Bird and obtain an array of Fish:
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// or, equivalently
const underWater2: Fish[] = zoo.filter(isFish) as Fish[];
 
// The predicate may need repeating for more complex examples
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
 if (pet.name === "sharkey") return false;
 return isFish(pet);
});
Try
In addition, classes can use this is Type to narrow their type.
Assertion functions
Types can also be narrowed using Assertion functions.
Discriminated unions
Most of the examples we’ve looked at so far have focused around narrowing single variables with simple types like string, boolean, and number. While this is common, most of the time in JavaScript we’ll be dealing with slightly more complex structures.
For some motivation, let’s imagine we’re trying to encode shapes like circles and squares. Circles keep track of their radiuses and squares keep track of their side lengths. We’ll use a field called kind to tell which shape we’re dealing with. Here’s a first attempt at defining Shape.
interface Shape {
 kind: "circle" | "square";
 radius?: number;
 sideLength?: number;
}
Try
Notice we’re using a union of string literal types: "circle" and "square" to tell us whether we should treat the shape as a circle or square respectively. By using "circle" | "square" instead of string, we can avoid misspelling issues.
function handleShape(shape: Shape) {
 // oops!
 if (shape.kind === "rect") {
This comparison appears to be unintentional because the types '"circle" | "square"' and '"rect"' have no overlap.
   // ...
 }
}
Try
We can write a getArea function that applies the right logic based on if it’s dealing with a circle or square. We’ll first try dealing with circles.
function getArea(shape: Shape) {
 return Math.PI * shape.radius ** 2;
'shape.radius' is possibly 'undefined'.
}
Try
Under strictNullChecks that gives us an error - which is appropriate since radius might not be defined. But what if we perform the appropriate checks on the kind property?
function getArea(shape: Shape) {
 if (shape.kind === "circle") {
   return Math.PI * shape.radius ** 2;
'shape.radius' is possibly 'undefined'.
 }
}
Try
Hmm, TypeScript still doesn’t know what to do here. We’ve hit a point where we know more about our values than the type checker does. We could try to use a non-null assertion (a ! after shape.radius) to say that radius is definitely present.
function getArea(shape: Shape) {
 if (shape.kind === "circle") {
   return Math.PI * shape.radius! ** 2;
 }
}
Try
But this doesn’t feel ideal. We had to shout a bit at the type-checker with those non-null assertions (!) to convince it that shape.radius was defined, but those assertions are error-prone if we start to move code around. Additionally, outside of strictNullChecks we’re able to accidentally access any of those fields anyway (since optional properties are just assumed to always be present when reading them). We can definitely do better.
The problem with this encoding of Shape is that the type-checker doesn’t have any way to know whether or not radius or sideLength are present based on the kind property. We need to communicate what we know to the type checker. With that in mind, let’s take another swing at defining Shape.
interface Circle {
 kind: "circle";
 radius: number;
}
 
interface Square {
 kind: "square";
 sideLength: number;
}
 
type Shape = Circle | Square;
Try
Here, we’ve properly separated Shape out into two types with different values for the kind property, but radius and sideLength are declared as required properties in their respective types.
Let’s see what happens here when we try to access the radius of a Shape.
function getArea(shape: Shape) {
 return Math.PI * shape.radius ** 2;
Property 'radius' does not exist on type 'Shape'.
  Property 'radius' does not exist on type 'Square'.
}
Try
Like with our first definition of Shape, this is still an error. When radius was optional, we got an error (with strictNullChecks enabled) because TypeScript couldn’t tell whether the property was present. Now that Shape is a union, TypeScript is telling us that shape might be a Square, and Squares don’t have radius defined on them! Both interpretations are correct, but only the union encoding of Shape will cause an error regardless of how strictNullChecks is configured.
But what if we tried checking the kind property again?
function getArea(shape: Shape) {
 if (shape.kind === "circle") {
   return Math.PI * shape.radius ** 2;
                    
(parameter) shape: Circle
 }
}
Try
That got rid of the error! When every type in a union contains a common property with literal types, TypeScript considers that to be a discriminated union, and can narrow out the members of the union.
In this case, kind was that common property (which is what’s considered a discriminant property of Shape). Checking whether the kind property was "circle" got rid of every type in Shape that didn’t have a kind property with the type "circle". That narrowed shape down to the type Circle.
The same checking works with switch statements as well. Now we can try to write our complete getArea without any pesky ! non-null assertions.
function getArea(shape: Shape) {
 switch (shape.kind) {
   case "circle":
     return Math.PI * shape.radius ** 2;
                      
(parameter) shape: Circle
   case "square":
     return shape.sideLength ** 2;
            
(parameter) shape: Square
 }
}
Try
The important thing here was the encoding of Shape. Communicating the right information to TypeScript - that Circle and Square were really two separate types with specific kind fields - was crucial. Doing that lets us write type-safe TypeScript code that looks no different than the JavaScript we would’ve written otherwise. From there, the type system was able to do the “right” thing and figure out the types in each branch of our switch statement.
As an aside, try playing around with the above example and remove some of the return keywords. You’ll see that type-checking can help avoid bugs when accidentally falling through different clauses in a switch statement.
Discriminated unions are useful for more than just talking about circles and squares. They’re good for representing any sort of messaging scheme in JavaScript, like when sending messages over the network (client/server communication), or encoding mutations in a state management framework.
The never type
When narrowing, you can reduce the options of a union to a point where you have removed all possibilities and have nothing left. In those cases, TypeScript will use a never type to represent a state which shouldn’t exist.
Exhaustiveness checking
The never type is assignable to every type; however, no type is assignable to never (except never itself). This means you can use narrowing and rely on never turning up to do exhaustive checking in a switch statement.
For example, adding a default to our getArea function which tries to assign the shape to never will not raise an error when every possible case has been handled.
type Shape = Circle | Square;
 
function getArea(shape: Shape) {
 switch (shape.kind) {
   case "circle":
     return Math.PI * shape.radius ** 2;
   case "square":
     return shape.sideLength ** 2;
   default:
     const _exhaustiveCheck: never = shape;
     return _exhaustiveCheck;
 }
}
Try
Adding a new member to the Shape union, will cause a TypeScript error:
interface Triangle {
 kind: "triangle";
 sideLength: number;
}
 
type Shape = Circle | Square | Triangle;
 
function getArea(shape: Shape) {
 switch (shape.kind) {
   case "circle":
     return Math.PI * shape.radius ** 2;
   case "square":
     return shape.sideLength ** 2;
   default:
     const _exhaustiveCheck: never = shape;
Type 'Triangle' is not assignable to type 'never'.
     return _exhaustiveCheck;
 }
}
Try
On this page
typeof type guards
Truthiness narrowing
Equality narrowing
The in operator narrowing
instanceof narrowing
Assignments
Control flow analysis
Using type predicates
Assertion functions
Discriminated unions
The never type
Exhaustiveness checking
Is this page helpful?
YesNo
More on Functions
Functions are the basic building block of any application, whether they’re local functions, imported from another module, or methods on a class. They’re also values, and just like other values, TypeScript has many ways to describe how functions can be called. Let’s learn about how to write types that describe functions.
Function Type Expressions
The simplest way to describe a function is with a function type expression. These types are syntactically similar to arrow functions:
function greeter(fn: (a: string) => void) {
 fn("Hello, World");
}
 
function printToConsole(s: string) {
 console.log(s);
}
 
greeter(printToConsole);
Try
The syntax (a: string) => void means “a function with one parameter, named a, of type string, that doesn’t have a return value”. Just like with function declarations, if a parameter type isn’t specified, it’s implicitly any.
Note that the parameter name is required. The function type (string) => void means “a function with a parameter named string of type any“!
Of course, we can use a type alias to name a function type:
type GreetFunction = (a: string) => void;
function greeter(fn: GreetFunction) {
 // ...
}
Try
Call Signatures
In JavaScript, functions can have properties in addition to being callable. However, the function type expression syntax doesn’t allow for declaring properties. If we want to describe something callable with properties, we can write a call signature in an object type:
type DescribableFunction = {
 description: string;
 (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
 console.log(fn.description + " returned " + fn(6));
}
 
function myFunc(someArg: number) {
 return someArg > 3;
}
myFunc.description = "default description";
 
doSomething(myFunc);
Try
Note that the syntax is slightly different compared to a function type expression - use : between the parameter list and the return type rather than =>.
Construct Signatures
JavaScript functions can also be invoked with the new operator. TypeScript refers to these as constructors because they usually create a new object. You can write a construct signature by adding the new keyword in front of a call signature:
type SomeConstructor = {
 new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
 return new ctor("hello");
}
Try
Some objects, like JavaScript’s Date object, can be called with or without new. You can combine call and construct signatures in the same type arbitrarily:
interface CallOrConstruct {
 (n?: number): string;
 new (s: string): Date;
}
 
function fn(ctor: CallOrConstruct) {
 // Passing an argument of type `number` to `ctor` matches it against
 // the first definition in the `CallOrConstruct` interface.
 console.log(ctor(10));
             
(parameter) ctor: CallOrConstruct
(n?: number) => string
 
 // Similarly, passing an argument of type `string` to `ctor` matches it
 // against the second definition in the `CallOrConstruct` interface.
 console.log(new ctor("10"));
                 
(parameter) ctor: CallOrConstruct
new (s: string) => Date
}
 
fn(Date);
Try
Generic Functions
It’s common to write a function where the types of the input relate to the type of the output, or where the types of two inputs are related in some way. Let’s consider for a moment a function that returns the first element of an array:
function firstElement(arr: any[]) {
 return arr[0];
}
Try
This function does its job, but unfortunately has the return type any. It’d be better if the function returned the type of the array element.
In TypeScript, generics are used when we want to describe a correspondence between two values. We do this by declaring a type parameter in the function signature:
function firstElement<Type>(arr: Type[]): Type | undefined {
 return arr[0];
}
Try
By adding a type parameter Type to this function and using it in two places, we’ve created a link between the input of the function (the array) and the output (the return value). Now when we call it, a more specific type comes out:
// s is of type 'string'
const s = firstElement(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
// u is of type undefined
const u = firstElement([]);
Try
Inference
Note that we didn’t have to specify Type in this sample. The type was inferred - chosen automatically - by TypeScript.
We can use multiple type parameters as well. For example, a standalone version of map would look like this:
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
 return arr.map(func);
}
 
// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
Try
Note that in this example, TypeScript could infer both the type of the Input type parameter (from the given string array), as well as the Output type parameter based on the return value of the function expression (number).
Constraints
We’ve written some generic functions that can work on any kind of value. Sometimes we want to relate two values, but can only operate on a certain subset of values. In this case, we can use a constraint to limit the kinds of types that a type parameter can accept.
Let’s write a function that returns the longer of two values. To do this, we need a length property that’s a number. We constrain the type parameter to that type by writing an extends clause:
function longest<Type extends { length: number }>(a: Type, b: Type) {
 if (a.length >= b.length) {
   return a;
 } else {
   return b;
 }
}
 
// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
Try
There are a few interesting things to note in this example. We allowed TypeScript to infer the return type of longest. Return type inference also works on generic functions.
Because we constrained Type to { length: number }, we were allowed to access the .length property of the a and b parameters. Without the type constraint, we wouldn’t be able to access those properties because the values might have been some other type without a length property.
The types of longerArray and longerString were inferred based on the arguments. Remember, generics are all about relating two or more values with the same type!
Finally, just as we’d like, the call to longest(10, 100) is rejected because the number type doesn’t have a .length property.
Working with Constrained Values
Here’s a common error when working with generic constraints:
function minimumLength<Type extends { length: number }>(
 obj: Type,
 minimum: number
): Type {
 if (obj.length >= minimum) {
   return obj;
 } else {
   return { length: minimum };
Type '{ length: number; }' is not assignable to type 'Type'.
  '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.
 }
}
Try
It might look like this function is OK - Type is constrained to { length: number }, and the function either returns Type or a value matching that constraint. The problem is that the function promises to return the same kind of object as was passed in, not just some object matching the constraint. If this code were legal, you could write code that definitely wouldn’t work:
// 'arr' gets value { length: 6 }
const arr = minimumLength([1, 2, 3], 6);
// and crashes here because arrays have
// a 'slice' method, but not the returned object!
console.log(arr.slice(0));
Try
Specifying Type Arguments
TypeScript can usually infer the intended type arguments in a generic call, but not always. For example, let’s say you wrote a function to combine two arrays:
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
 return arr1.concat(arr2);
}
Try
Normally it would be an error to call this function with mismatched arrays:
const arr = combine([1, 2, 3], ["hello"]);
Type 'string' is not assignable to type 'number'.
Try
If you intended to do this, however, you could manually specify Type:
const arr = combine<string | number>([1, 2, 3], ["hello"]);
Try
Guidelines for Writing Good Generic Functions
Writing generic functions is fun, and it can be easy to get carried away with type parameters. Having too many type parameters or using constraints where they aren’t needed can make inference less successful, frustrating callers of your function.
Push Type Parameters Down
Here are two ways of writing a function that appear similar:
function firstElement1<Type>(arr: Type[]) {
 return arr[0];
}
 
function firstElement2<Type extends any[]>(arr: Type) {
 return arr[0];
}
 
// a: number (good)
const a = firstElement1([1, 2, 3]);
// b: any (bad)
const b = firstElement2([1, 2, 3]);
Try
These might seem identical at first glance, but firstElement1 is a much better way to write this function. Its inferred return type is Type, but firstElement2’s inferred return type is any because TypeScript has to resolve the arr[0] expression using the constraint type, rather than “waiting” to resolve the element during a call.
Rule: When possible, use the type parameter itself rather than constraining it
Use Fewer Type Parameters
Here’s another pair of similar functions:
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
 return arr.filter(func);
}
 
function filter2<Type, Func extends (arg: Type) => boolean>(
 arr: Type[],
 func: Func
): Type[] {
 return arr.filter(func);
}
Try
We’ve created a type parameter Func that doesn’t relate two values. That’s always a red flag, because it means callers wanting to specify type arguments have to manually specify an extra type argument for no reason. Func doesn’t do anything but make the function harder to read and reason about!
Rule: Always use as few type parameters as possible
Type Parameters Should Appear Twice
Sometimes we forget that a function might not need to be generic:
function greet<Str extends string>(s: Str) {
 console.log("Hello, " + s);
}
 
greet("world");
Try
We could just as easily have written a simpler version:
function greet(s: string) {
 console.log("Hello, " + s);
}
Try
Remember, type parameters are for relating the types of multiple values. If a type parameter is only used once in the function signature, it’s not relating anything. This includes the inferred return type; for example, if Str was part of the inferred return type of greet, it would be relating the argument and return types, so would be used twice despite appearing only once in the written code.
Rule: If a type parameter only appears in one location, strongly reconsider if you actually need it
Optional Parameters
Functions in JavaScript often take a variable number of arguments. For example, the toFixed method of number takes an optional digit count:
function f(n: number) {
 console.log(n.toFixed()); // 0 arguments
 console.log(n.toFixed(3)); // 1 argument
}
Try
We can model this in TypeScript by marking the parameter as optional with ?:
function f(x?: number) {
 // ...
}
f(); // OK
f(10); // OK
Try
Although the parameter is specified as type number, the x parameter will actually have the type number | undefined because unspecified parameters in JavaScript get the value undefined.
You can also provide a parameter default:
function f(x = 10) {
 // ...
}
Try
Now in the body of f, x will have type number because any undefined argument will be replaced with 10. Note that when a parameter is optional, callers can always pass undefined, as this simply simulates a “missing” argument:
// All OK
f();
f(10);
f(undefined);
Try
Optional Parameters in Callbacks
Once you’ve learned about optional parameters and function type expressions, it’s very easy to make the following mistakes when writing functions that invoke callbacks:
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
 for (let i = 0; i < arr.length; i++) {
   callback(arr[i], i);
 }
}
Try
What people usually intend when writing index? as an optional parameter is that they want both of these calls to be legal:
myForEach([1, 2, 3], (a) => console.log(a));
myForEach([1, 2, 3], (a, i) => console.log(a, i));
Try
What this actually means is that callback might get invoked with one argument. In other words, the function definition says that the implementation might look like this:
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
 for (let i = 0; i < arr.length; i++) {
   // I don't feel like providing the index today
   callback(arr[i]);
 }
}
Try
In turn, TypeScript will enforce this meaning and issue errors that aren’t really possible:
myForEach([1, 2, 3], (a, i) => {
 console.log(i.toFixed());
'i' is possibly 'undefined'.
});
Try
In JavaScript, if you call a function with more arguments than there are parameters, the extra arguments are simply ignored. TypeScript behaves the same way. Functions with fewer parameters (of the same types) can always take the place of functions with more parameters.
Rule: When writing a function type for a callback, never write an optional parameter unless you intend to call the function without passing that argument
Function Overloads
Some JavaScript functions can be called in a variety of argument counts and types. For example, you might write a function to produce a Date that takes either a timestamp (one argument) or a month/day/year specification (three arguments).
In TypeScript, we can specify a function that can be called in different ways by writing overload signatures. To do this, write some number of function signatures (usually two or more), followed by the body of the function:
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
 if (d !== undefined && y !== undefined) {
   return new Date(y, mOrTimestamp, d);
 } else {
   return new Date(mOrTimestamp);
 }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
Try
In this example, we wrote two overloads: one accepting one argument, and another accepting three arguments. These first two signatures are called the overload signatures.
Then, we wrote a function implementation with a compatible signature. Functions have an implementation signature, but this signature can’t be called directly. Even though we wrote a function with two optional parameters after the required one, it can’t be called with two parameters!
Overload Signatures and the Implementation Signature
This is a common source of confusion. Often people will write code like this and not understand why there is an error:
function fn(x: string): void;
function fn() {
 // ...
}
// Expected to be able to call with zero arguments
fn();
Expected 1 arguments, but got 0.
Try
Again, the signature used to write the function body can’t be “seen” from the outside.
The signature of the implementation is not visible from the outside. When writing an overloaded function, you should always have two or more signatures above the implementation of the function.
The implementation signature must also be compatible with the overload signatures. For example, these functions have errors because the implementation signature doesn’t match the overloads in a correct way:
function fn(x: boolean): void;
// Argument type isn't right
function fn(x: string): void;
This overload signature is not compatible with its implementation signature.
function fn(x: boolean) {}
Try
function fn(x: string): string;
// Return type isn't right
function fn(x: number): boolean;
This overload signature is not compatible with its implementation signature.
function fn(x: string | number) {
 return "oops";
}
Try
Writing Good Overloads
Like generics, there are a few guidelines you should follow when using function overloads. Following these principles will make your function easier to call, easier to understand, and easier to implement.
Let’s consider a function that returns the length of a string or an array:
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
 return x.length;
}
Try
This function is fine; we can invoke it with strings or arrays. However, we can’t invoke it with a value that might be a string or an array, because TypeScript can only resolve a function call to a single overload:
len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]);
No overload matches this call.
  Overload 1 of 2, '(s: string): number', gave the following error.
    Argument of type 'number[] | "hello"' is not assignable to parameter of type 'string'.
      Type 'number[]' is not assignable to type 'string'.
  Overload 2 of 2, '(arr: any[]): number', gave the following error.
    Argument of type 'number[] | "hello"' is not assignable to parameter of type 'any[]'.
      Type 'string' is not assignable to type 'any[]'.
Try
Because both overloads have the same argument count and same return type, we can instead write a non-overloaded version of the function:
function len(x: any[] | string) {
 return x.length;
}
Try
This is much better! Callers can invoke this with either sort of value, and as an added bonus, we don’t have to figure out a correct implementation signature.
Always prefer parameters with union types instead of overloads when possible
Declaring this in a Function
TypeScript will infer what the this should be in a function via code flow analysis, for example in the following:
const user = {
 id: 123,
 
 admin: false,
 becomeAdmin: function () {
   this.admin = true;
 },
};
Try
TypeScript understands that the function user.becomeAdmin has a corresponding this which is the outer object user. this, heh, can be enough for a lot of cases, but there are a lot of cases where you need more control over what object this represents. The JavaScript specification states that you cannot have a parameter called this, and so TypeScript uses that syntax space to let you declare the type for this in the function body.
interface DB {
 filterUsers(filter: (this: User) => boolean): User[];
}
 
const db = getDB();
const admins = db.filterUsers(function (this: User) {
 return this.admin;
});
Try
This pattern is common with callback-style APIs, where another object typically controls when your function is called. Note that you need to use function and not arrow functions to get this behavior:
interface DB {
 filterUsers(filter: (this: User) => boolean): User[];
}
 
const db = getDB();
const admins = db.filterUsers(() => this.admin);
The containing arrow function captures the global value of 'this'.
Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.
Try
Other Types to Know About
There are some additional types you’ll want to recognize that appear often when working with function types. Like all types, you can use them everywhere, but these are especially relevant in the context of functions.
void
void represents the return value of functions which don’t return a value. It’s the inferred type any time a function doesn’t have any return statements, or doesn’t return any explicit value from those return statements:
// The inferred return type is void
function noop() {
 return;
}
Try
In JavaScript, a function that doesn’t return any value will implicitly return the value undefined. However, void and undefined are not the same thing in TypeScript. There are further details at the end of this chapter.
void is not the same as undefined.
object
The special type object refers to any value that isn’t a primitive (string, number, bigint, boolean, symbol, null, or undefined). This is different from the empty object type { }, and also different from the global type Object. It’s very likely you will never use Object.
object is not Object. Always use object!
Note that in JavaScript, function values are objects: They have properties, have Object.prototype in their prototype chain, are instanceof Object, you can call Object.keys on them, and so on. For this reason, function types are considered to be objects in TypeScript.
unknown
The unknown type represents any value. This is similar to the any type, but is safer because it’s not legal to do anything with an unknown value:
function f1(a: any) {
 a.b(); // OK
}
function f2(a: unknown) {
 a.b();
'a' is of type 'unknown'.
}
Try
This is useful when describing function types because you can describe functions that accept any value without having any values in your function body.
Conversely, you can describe a function that returns a value of unknown type:
function safeParse(s: string): unknown {
 return JSON.parse(s);
}
 
// Need to be careful with 'obj'!
const obj = safeParse(someRandomString);
Try
never
Some functions never return a value:
function fail(msg: string): never {
 throw new Error(msg);
}
Try
The never type represents values which are never observed. In a return type, this means that the function throws an exception or terminates execution of the program.
never also appears when TypeScript determines there’s nothing left in a union.
function fn(x: string | number) {
 if (typeof x === "string") {
   // do something
 } else if (typeof x === "number") {
   // do something else
 } else {
   x; // has type 'never'!
 }
}
Try
Function
The global type Function describes properties like bind, call, apply, and others present on all function values in JavaScript. It also has the special property that values of type Function can always be called; these calls return any:
function doSomething(f: Function) {
 return f(1, 2, 3);
}
Try
This is an untyped function call and is generally best avoided because of the unsafe any return type.
If you need to accept an arbitrary function but don’t intend to call it, the type () => void is generally safer.
Rest Parameters and Arguments
Background Reading:
Rest Parameters
Spread Syntax
Rest Parameters
In addition to using optional parameters or overloads to make functions that can accept a variety of fixed argument counts, we can also define functions that take an unbounded number of arguments using rest parameters.
A rest parameter appears after all other parameters, and uses the ... syntax:
function multiply(n: number, ...m: number[]) {
 return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
Try
In TypeScript, the type annotation on these parameters is implicitly any[] instead of any, and any type annotation given must be of the form Array<T> or T[], or a tuple type (which we’ll learn about later).
Rest Arguments
Conversely, we can provide a variable number of arguments from an iterable object (for example, an array) using the spread syntax. For example, the push method of arrays takes any number of arguments:
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);
Try
Note that in general, TypeScript does not assume that arrays are immutable. This can lead to some surprising behavior:
// Inferred type is number[] -- "an array with zero or more numbers",
// not specifically two numbers
const args = [8, 5];
const angle = Math.atan2(...args);
A spread argument must either have a tuple type or be passed to a rest parameter.
Try
The best fix for this situation depends a bit on your code, but in general a const context is the most straightforward solution:
// Inferred as 2-length tuple
const args = [8, 5] as const;
// OK
const angle = Math.atan2(...args);
Try
Using rest arguments may require turning on downlevelIteration when targeting older runtimes.
Parameter Destructuring
Background Reading:
Destructuring Assignment
You can use parameter destructuring to conveniently unpack objects provided as an argument into one or more local variables in the function body. In JavaScript, it looks like this:
function sum({ a, b, c }) {
 console.log(a + b + c);
}
sum({ a: 10, b: 3, c: 9 });
The type annotation for the object goes after the destructuring syntax:
function sum({ a, b, c }: { a: number; b: number; c: number }) {
 console.log(a + b + c);
}
Try
This can look a bit verbose, but you can use a named type here as well:
// Same as prior example
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
 console.log(a + b + c);
}
Try
Assignability of Functions
Return type void
The void return type for functions can produce some unusual, but expected behavior.
Contextual typing with a return type of void does not force functions to not return something. Another way to say this is a contextual function type with a void return type (type voidFunc = () => void), when implemented, can return any other value, but it will be ignored.
Thus, the following implementations of the type () => void are valid:
type voidFunc = () => void;
 
const f1: voidFunc = () => {
 return true;
};
 
const f2: voidFunc = () => true;
 
const f3: voidFunc = function () {
 return true;
};
Try
And when the return value of one of these functions is assigned to another variable, it will retain the type of void:
const v1 = f1();
 
const v2 = f2();
 
const v3 = f3();
Try
This behavior exists so that the following code is valid even though Array.prototype.push returns a number and the Array.prototype.forEach method expects a function with a return type of void.
const src = [1, 2, 3];
const dst = [0];
 
src.forEach((el) => dst.push(el));
Try
There is one other special case to be aware of, when a literal function definition has a void return type, that function must not return anything.
function f2(): void {
 // @ts-expect-error
 return true;
}
 
const f3 = function (): void {
 // @ts-expect-error
 return true;
};
Try
For more on void please refer to these other documentation entries:
FAQ - “Why are functions returning non-void assignable to function returning void?”
Object Types
In JavaScript, the fundamental way that we group and pass around data is through objects. In TypeScript, we represent those through object types.
As we’ve seen, they can be anonymous:
function greet(person: { name: string; age: number }) {
 return "Hello " + person.name;
}
Try
or they can be named by using either an interface:
interface Person {
 name: string;
 age: number;
}
 
function greet(person: Person) {
 return "Hello " + person.name;
}
Try
or a type alias:
type Person = {
 name: string;
 age: number;
};
 
function greet(person: Person) {
 return "Hello " + person.name;
}
Try
In all three examples above, we’ve written functions that take objects that contain the property name (which must be a string) and age (which must be a number).
Quick Reference
We have cheat-sheets available for both type and interface, if you want a quick look at the important every-day syntax at a glance.
Property Modifiers
Each property in an object type can specify a couple of things: the type, whether the property is optional, and whether the property can be written to.
Optional Properties
Much of the time, we’ll find ourselves dealing with objects that might have a property set. In those cases, we can mark those properties as optional by adding a question mark (?) to the end of their names.
interface PaintOptions {
 shape: Shape;
 xPos?: number;
 yPos?: number;
}
 
function paintShape(opts: PaintOptions) {
 // ...
}
 
const shape = getShape();
paintShape({ shape });
paintShape({ shape, xPos: 100 });
paintShape({ shape, yPos: 100 });
paintShape({ shape, xPos: 100, yPos: 100 });
Try
In this example, both xPos and yPos are considered optional. We can choose to provide either of them, so every call above to paintShape is valid. All optionality really says is that if the property is set, it better have a specific type.
We can also read from those properties - but when we do under strictNullChecks, TypeScript will tell us they’re potentially undefined.
function paintShape(opts: PaintOptions) {
 let xPos = opts.xPos;
                 
(property) PaintOptions.xPos?: number | undefined
 let yPos = opts.yPos;
                 
(property) PaintOptions.yPos?: number | undefined
 // ...
}
Try
In JavaScript, even if the property has never been set, we can still access it - it’s just going to give us the value undefined. We can just handle undefined specially by checking for it.
function paintShape(opts: PaintOptions) {
 let xPos = opts.xPos === undefined ? 0 : opts.xPos;
     
let xPos: number
 let yPos = opts.yPos === undefined ? 0 : opts.yPos;
     
let yPos: number
 // ...
}
Try
Note that this pattern of setting defaults for unspecified values is so common that JavaScript has syntax to support it.
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
 console.log("x coordinate at", xPos);
                                
(parameter) xPos: number
 console.log("y coordinate at", yPos);
                                
(parameter) yPos: number
 // ...
}
Try
Here we used a destructuring pattern for paintShape’s parameter, and provided default values for xPos and yPos. Now xPos and yPos are both definitely present within the body of paintShape, but optional for any callers to paintShape.
Note that there is currently no way to place type annotations within destructuring patterns. This is because the following syntax already means something different in JavaScript.
function draw({ shape: Shape, xPos: number = 100 /*...*/ }) {
 render(shape);
Cannot find name 'shape'. Did you mean 'Shape'?
 render(xPos);
Cannot find name 'xPos'.
}
Try
In an object destructuring pattern, shape: Shape means “grab the property shape and redefine it locally as a variable named Shape.” Likewise xPos: number creates a variable named number whose value is based on the parameter’s xPos.
readonly Properties
Properties can also be marked as readonly for TypeScript. While it won’t change any behavior at runtime, a property marked as readonly can’t be written to during type-checking.
interface SomeType {
 readonly prop: string;
}
 
function doSomething(obj: SomeType) {
 // We can read from 'obj.prop'.
 console.log(`prop has the value '${obj.prop}'.`);
 
 // But we can't re-assign it.
 obj.prop = "hello";
Cannot assign to 'prop' because it is a read-only property.
}
Try
Using the readonly modifier doesn’t necessarily imply that a value is totally immutable - or in other words, that its internal contents can’t be changed. It just means the property itself can’t be re-written to.
interface Home {
 readonly resident: { name: string; age: number };
}
 
function visitForBirthday(home: Home) {
 // We can read and update properties from 'home.resident'.
 console.log(`Happy birthday ${home.resident.name}!`);
 home.resident.age++;
}
 
function evict(home: Home) {
 // But we can't write to the 'resident' property itself on a 'Home'.
 home.resident = {
Cannot assign to 'resident' because it is a read-only property.
   name: "Victor the Evictor",
   age: 42,
 };
}
Try
It’s important to manage expectations of what readonly implies. It’s useful to signal intent during development time for TypeScript on how an object should be used. TypeScript doesn’t factor in whether properties on two types are readonly when checking whether those types are compatible, so readonly properties can also change via aliasing.
interface Person {
 name: string;
 age: number;
}
 
interface ReadonlyPerson {
 readonly name: string;
 readonly age: number;
}
 
let writablePerson: Person = {
 name: "Person McPersonface",
 age: 42,
};
 
// works
let readonlyPerson: ReadonlyPerson = writablePerson;
 
console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'
Try
Using mapping modifiers, you can remove readonly attributes.
Index Signatures
Sometimes you don’t know all the names of a type’s properties ahead of time, but you do know the shape of the values.
In those cases you can use an index signature to describe the types of possible values, for example:
interface StringArray {
 [index: number]: string;
}
 
const myArray: StringArray = getStringArray();
const secondItem = myArray[1];
        
const secondItem: string
Try
Above, we have a StringArray interface which has an index signature. This index signature states that when a StringArray is indexed with a number, it will return a string.
Only some types are allowed for index signature properties: string, number, symbol, template string patterns, and union types consisting only of these.
It is possible to support multiple types of indexers...
While string index signatures are a powerful way to describe the “dictionary” pattern, they also enforce that all properties match their return type. This is because a string index declares that obj.property is also available as obj["property"]. In the following example, name’s type does not match the string index’s type, and the type checker gives an error:
interface NumberDictionary {
 [index: string]: number;
 
 length: number; // ok
 name: string;
Property 'name' of type 'string' is not assignable to 'string' index type 'number'.
}
Try
However, properties of different types are acceptable if the index signature is a union of the property types:
interface NumberOrStringDictionary {
 [index: string]: number | string;
 length: number; // ok, length is a number
 name: string; // ok, name is a string
}
Try
Finally, you can make index signatures readonly in order to prevent assignment to their indices:
interface ReadonlyStringArray {
 readonly [index: number]: string;
}
 
let myArray: ReadonlyStringArray = getReadOnlyStringArray();
myArray[2] = "Mallory";
Index signature in type 'ReadonlyStringArray' only permits reading.
Try
You can’t set myArray[2] because the index signature is readonly.
Excess Property Checks
Where and how an object is assigned a type can make a difference in the type system. One of the key examples of this is in excess property checking, which validates the object more thoroughly when it is created and assigned to an object type during creation.
interface SquareConfig {
 color?: string;
 width?: number;
}
 
function createSquare(config: SquareConfig): { color: string; area: number } {
 return {
   color: config.color || "red",
   area: config.width ? config.width * config.width : 20,
 };
}
 
let mySquare = createSquare({ colour: "red", width: 100 });
Object literal may only specify known properties, but 'colour' does not exist in type 'SquareConfig'. Did you mean to write 'color'?
Try
Notice the given argument to createSquare is spelled colour instead of color. In plain JavaScript, this sort of thing fails silently.
You could argue that this program is correctly typed, since the width properties are compatible, there’s no color property present, and the extra colour property is insignificant.
However, TypeScript takes the stance that there’s probably a bug in this code. Object literals get special treatment and undergo excess property checking when assigning them to other variables, or passing them as arguments. If an object literal has any properties that the “target type” doesn’t have, you’ll get an error:
let mySquare = createSquare({ colour: "red", width: 100 });
Object literal may only specify known properties, but 'colour' does not exist in type 'SquareConfig'. Did you mean to write 'color'?
Try
Getting around these checks is actually really simple. The easiest method is to just use a type assertion:
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
Try
However, a better approach might be to add a string index signature if you’re sure that the object can have some extra properties that are used in some special way. If SquareConfig can have color and width properties with the above types, but could also have any number of other properties, then we could define it like so:
interface SquareConfig {
 color?: string;
 width?: number;
 [propName: string]: unknown;
}
Try
Here we’re saying that SquareConfig can have any number of properties, and as long as they aren’t color or width, their types don’t matter.
One final way to get around these checks, which might be a bit surprising, is to assign the object to another variable: Since assigning squareOptions won’t undergo excess property checks, the compiler won’t give you an error:
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
Try
The above workaround will work as long as you have a common property between squareOptions and SquareConfig. In this example, it was the property width. It will however, fail if the variable does not have any common object property. For example:
let squareOptions = { colour: "red" };
let mySquare = createSquare(squareOptions);
Type '{ colour: string; }' has no properties in common with type 'SquareConfig'.
Try
Keep in mind that for simple code like above, you probably shouldn’t be trying to “get around” these checks. For more complex object literals that have methods and hold state, you might need to keep these techniques in mind, but a majority of excess property errors are actually bugs.
That means if you’re running into excess property checking problems for something like option bags, you might need to revise some of your type declarations. In this instance, if it’s okay to pass an object with both a color or colour property to createSquare, you should fix up the definition of SquareConfig to reflect that.
Extending Types
It’s pretty common to have types that might be more specific versions of other types. For example, we might have a BasicAddress type that describes the fields necessary for sending letters and packages in the U.S.
interface BasicAddress {
 name?: string;
 street: string;
 city: string;
 country: string;
 postalCode: string;
}
Try
In some situations that’s enough, but addresses often have a unit number associated with them if the building at an address has multiple units. We can then describe an AddressWithUnit.
interface AddressWithUnit {
 name?: string;
 unit: string;
 street: string;
 city: string;
 country: string;
 postalCode: string;
}
Try
This does the job, but the downside here is that we had to repeat all the other fields from BasicAddress when our changes were purely additive. Instead, we can extend the original BasicAddress type and just add the new fields that are unique to AddressWithUnit.
interface BasicAddress {
 name?: string;
 street: string;
 city: string;
 country: string;
 postalCode: string;
}
 
interface AddressWithUnit extends BasicAddress {
 unit: string;
}
Try
The extends keyword on an interface allows us to effectively copy members from other named types, and add whatever new members we want. This can be useful for cutting down the amount of type declaration boilerplate we have to write, and for signaling intent that several different declarations of the same property might be related. For example, AddressWithUnit didn’t need to repeat the street property, and because street originates from BasicAddress, a reader will know that those two types are related in some way.
interfaces can also extend from multiple types.
interface Colorful {
 color: string;
}
 
interface Circle {
 radius: number;
}
 
interface ColorfulCircle extends Colorful, Circle {}
 
const cc: ColorfulCircle = {
 color: "red",
 radius: 42,
};
Try
Intersection Types
interfaces allowed us to build up new types from other types by extending them. TypeScript provides another construct called intersection types that is mainly used to combine existing object types.
An intersection type is defined using the & operator.
interface Colorful {
 color: string;
}
interface Circle {
 radius: number;
}
 
type ColorfulCircle = Colorful & Circle;
Try
Here, we’ve intersected Colorful and Circle to produce a new type that has all the members of Colorful and Circle.
function draw(circle: Colorful & Circle) {
 console.log(`Color was ${circle.color}`);
 console.log(`Radius was ${circle.radius}`);
}
 
// okay
draw({ color: "blue", radius: 42 });
 
// oops
draw({ color: "red", raidus: 42 });
Object literal may only specify known properties, but 'raidus' does not exist in type 'Colorful & Circle'. Did you mean to write 'radius'?
Try
Interface Extension vs. Intersection
We just looked at two ways to combine types which are similar, but are actually subtly different. With interfaces, we could use an extends clause to extend from other types, and we were able to do something similar with intersections and name the result with a type alias. The principal difference between the two is how conflicts are handled, and that difference is typically one of the main reasons why you’d pick one over the other between an interface and a type alias of an intersection type.
If interfaces are defined with the same name, TypeScript will attempt to merge them if the properties are compatible. If the properties are not compatible (i.e., they have the same property name but different types), TypeScript will raise an error.
In the case of intersection types, properties with different types will be merged automatically. When the type is used later, TypeScript will expect the property to satisfy both types simultaneously, which may produce unexpected results.
For example, the following code will throw an error because the properties are incompatible:
interface Person {
 name: string;
}
interface Person {
 name: number;
}
In contrast, the following code will compile, but it results in a never type:
interface Person1 {
 name: string;
}
 
interface Person2 {
 name: number;
}
 
type Staff = Person1 & Person2
 
declare const staffer: Staff;
staffer.name;
       
(property) name: never
Try
In this case, Staff would require the name property to be both a string and a number, which results in property being of type never.
Generic Object Types
Let’s imagine a Box type that can contain any value - strings, numbers, Giraffes, whatever.
interface Box {
 contents: any;
}
Try
Right now, the contents property is typed as any, which works, but can lead to accidents down the line.
We could instead use unknown, but that would mean that in cases where we already know the type of contents, we’d need to do precautionary checks, or use error-prone type assertions.
interface Box {
 contents: unknown;
}
 
let x: Box = {
 contents: "hello world",
};
 
// we could check 'x.contents'
if (typeof x.contents === "string") {
 console.log(x.contents.toLowerCase());
}
 
// or we could use a type assertion
console.log((x.contents as string).toLowerCase());
Try
One type safe approach would be to instead scaffold out different Box types for every type of contents.
interface NumberBox {
 contents: number;
}
 
interface StringBox {
 contents: string;
}
 
interface BooleanBox {
 contents: boolean;
}
Try
But that means we’ll have to create different functions, or overloads of functions, to operate on these types.
function setContents(box: StringBox, newContents: string): void;
function setContents(box: NumberBox, newContents: number): void;
function setContents(box: BooleanBox, newContents: boolean): void;
function setContents(box: { contents: any }, newContents: any) {
 box.contents = newContents;
}
Try
That’s a lot of boilerplate. Moreover, we might later need to introduce new types and overloads. This is frustrating, since our box types and overloads are all effectively the same.
Instead, we can make a generic Box type which declares a type parameter.
interface Box<Type> {
 contents: Type;
}
Try
You might read this as “A Box of Type is something whose contents have type Type”. Later on, when we refer to Box, we have to give a type argument in place of Type.
let box: Box<string>;
Try
Think of Box as a template for a real type, where Type is a placeholder that will get replaced with some other type. When TypeScript sees Box<string>, it will replace every instance of Type in Box<Type> with string, and end up working with something like { contents: string }. In other words, Box<string> and our earlier StringBox work identically.
interface Box<Type> {
 contents: Type;
}
interface StringBox {
 contents: string;
}
 
let boxA: Box<string> = { contents: "hello" };
boxA.contents;
      
(property) Box<string>.contents: string
 
let boxB: StringBox = { contents: "world" };
boxB.contents;
      
(property) StringBox.contents: string
Try
Box is reusable in that Type can be substituted with anything. That means that when we need a box for a new type, we don’t need to declare a new Box type at all (though we certainly could if we wanted to).
interface Box<Type> {
 contents: Type;
}
 
interface Apple {
 // ....
}
 
// Same as '{ contents: Apple }'.
type AppleBox = Box<Apple>;
Try
This also means that we can avoid overloads entirely by instead using generic functions.
function setContents<Type>(box: Box<Type>, newContents: Type) {
 box.contents = newContents;
}
Try
It is worth noting that type aliases can also be generic. We could have defined our new Box<Type> interface, which was:
interface Box<Type> {
 contents: Type;
}
Try
by using a type alias instead:
type Box<Type> = {
 contents: Type;
};
Try
Since type aliases, unlike interfaces, can describe more than just object types, we can also use them to write other kinds of generic helper types.
type OrNull<Type> = Type | null;
 
type OneOrMany<Type> = Type | Type[];
 
type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
         
type OneOrManyOrNull<Type> = OneOrMany<Type> | null
 
type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
             
type OneOrManyOrNullStrings = OneOrMany<string> | null
Try
We’ll circle back to type aliases in just a little bit.
The Array Type
Generic object types are often some sort of container type that work independently of the type of elements they contain. It’s ideal for data structures to work this way so that they’re re-usable across different data types.
It turns out we’ve been working with a type just like that throughout this handbook: the Array type. Whenever we write out types like number[] or string[], that’s really just a shorthand for Array<number> and Array<string>.
function doSomething(value: Array<string>) {
 // ...
}
 
let myArray: string[] = ["hello", "world"];
 
// either of these work!
doSomething(myArray);
doSomething(new Array("hello", "world"));
Try
Much like the Box type above, Array itself is a generic type.
interface Array<Type> {
 /**
  * Gets or sets the length of the array.
  */
 length: number;
 
 /**
  * Removes the last element from an array and returns it.
  */
 pop(): Type | undefined;
 
 /**
  * Appends new elements to an array, and returns the new length of the array.
  */
 push(...items: Type[]): number;
 
 // ...
}
Try
Modern JavaScript also provides other data structures which are generic, like Map<K, V>, Set<T>, and Promise<T>. All this really means is that because of how Map, Set, and Promise behave, they can work with any sets of types.
The ReadonlyArray Type
The ReadonlyArray is a special type that describes arrays that shouldn’t be changed.
function doStuff(values: ReadonlyArray<string>) {
 // We can read from 'values'...
 const copy = values.slice();
 console.log(`The first value is ${values[0]}`);
 
 // ...but we can't mutate 'values'.
 values.push("hello!");
Property 'push' does not exist on type 'readonly string[]'.
}
Try
Much like the readonly modifier for properties, it’s mainly a tool we can use for intent. When we see a function that returns ReadonlyArrays, it tells us we’re not meant to change the contents at all, and when we see a function that consumes ReadonlyArrays, it tells us that we can pass any array into that function without worrying that it will change its contents.
Unlike Array, there isn’t a ReadonlyArray constructor that we can use.
new ReadonlyArray("red", "green", "blue");
'ReadonlyArray' only refers to a type, but is being used as a value here.
Try
Instead, we can assign regular Arrays to ReadonlyArrays.
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
Try
Just as TypeScript provides a shorthand syntax for Array<Type> with Type[], it also provides a shorthand syntax for ReadonlyArray<Type> with readonly Type[].
function doStuff(values: readonly string[]) {
 // We can read from 'values'...
 const copy = values.slice();
 console.log(`The first value is ${values[0]}`);
 
 // ...but we can't mutate 'values'.
 values.push("hello!");
Property 'push' does not exist on type 'readonly string[]'.
}
Try
One last thing to note is that unlike the readonly property modifier, assignability isn’t bidirectional between regular Arrays and ReadonlyArrays.
let x: readonly string[] = [];
let y: string[] = [];
 
x = y;
y = x;
The type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.
Try
Tuple Types
A tuple type is another sort of Array type that knows exactly how many elements it contains, and exactly which types it contains at specific positions.
type StringNumberPair = [string, number];
Try
Here, StringNumberPair is a tuple type of string and number. Like ReadonlyArray, it has no representation at runtime, but is significant to TypeScript. To the type system, StringNumberPair describes arrays whose 0 index contains a string and whose 1 index contains a number.
function doSomething(pair: [string, number]) {
 const a = pair[0];
     
const a: string
 const b = pair[1];
     
const b: number
 // ...
}
 
doSomething(["hello", 42]);
Try
If we try to index past the number of elements, we’ll get an error.
function doSomething(pair: [string, number]) {
 // ...
 
 const c = pair[2];
Tuple type '[string, number]' of length '2' has no element at index '2'.
}
Try
We can also destructure tuples using JavaScript’s array destructuring.
function doSomething(stringHash: [string, number]) {
 const [inputString, hash] = stringHash;
 
 console.log(inputString);
                
const inputString: string
 
 console.log(hash);
             
const hash: number
}
Try
Tuple types are useful in heavily convention-based APIs, where each element’s meaning is “obvious”. This gives us flexibility in whatever we want to name our variables when we destructure them. In the above example, we were able to name elements 0 and 1 to whatever we wanted.
However, since not every user holds the same view of what’s obvious, it may be worth reconsidering whether using objects with descriptive property names may be better for your API.
Other than those length checks, simple tuple types like these are equivalent to types which are versions of Arrays that declare properties for specific indexes, and that declare length with a numeric literal type.
interface StringNumberPair {
 // specialized properties
 length: 2;
 0: string;
 1: number;
 
 // Other 'Array<string | number>' members...
 slice(start?: number, end?: number): Array<string | number>;
}
Try
Another thing you may be interested in is that tuples can have optional properties by writing out a question mark (? after an element’s type). Optional tuple elements can only come at the end, and also affect the type of length.
type Either2dOr3d = [number, number, number?];
 
function setCoordinate(coord: Either2dOr3d) {
 const [x, y, z] = coord;
            
const z: number | undefined
 
 console.log(`Provided coordinates had ${coord.length} dimensions`);
                                                
(property) length: 2 | 3
}
Try
Tuples can also have rest elements, which have to be an array/tuple type.
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
Try
StringNumberBooleans describes a tuple whose first two elements are string and number respectively, but which may have any number of booleans following.
StringBooleansNumber describes a tuple whose first element is string and then any number of booleans and ending with a number.
BooleansStringNumber describes a tuple whose starting elements are any number of booleans and ending with a string then a number.
A tuple with a rest element has no set “length” - it only has a set of well-known elements in different positions.
const a: StringNumberBooleans = ["hello", 1];
const b: StringNumberBooleans = ["beautiful", 2, true];
const c: StringNumberBooleans = ["world", 3, true, false, true, false, true];
Try
Why might optional and rest elements be useful? Well, it allows TypeScript to correspond tuples with parameter lists. Tuples types can be used in rest parameters and arguments, so that the following:
function readButtonInput(...args: [string, number, ...boolean[]]) {
 const [name, version, ...input] = args;
 // ...
}
Try
is basically equivalent to:
function readButtonInput(name: string, version: number, ...input: boolean[]) {
 // ...
}
Try
This is handy when you want to take a variable number of arguments with a rest parameter, and you need a minimum number of elements, but you don’t want to introduce intermediate variables.
readonly Tuple Types
One final note about tuple types - tuple types have readonly variants, and can be specified by sticking a readonly modifier in front of them - just like with array shorthand syntax.
function doSomething(pair: readonly [string, number]) {
 // ...
}
Try
As you might expect, writing to any property of a readonly tuple isn’t allowed in TypeScript.
function doSomething(pair: readonly [string, number]) {
 pair[0] = "hello!";
Cannot assign to '0' because it is a read-only property.
}
Try
Tuples tend to be created and left un-modified in most code, so annotating types as readonly tuples when possible is a good default. This is also important given that array literals with const assertions will be inferred with readonly tuple types.
let point = [3, 4] as const;
 
function distanceFromOrigin([x, y]: [number, number]) {
 return Math.sqrt(x ** 2 + y ** 2);
}
 
distanceFromOrigin(point);
Argument of type 'readonly [3, 4]' is not assignable to parameter of type '[number, number]'.
  The type 'readonly [3, 4]' is 'readonly' and cannot be assigned to the mutable type '[number, number]'.
Try
Here, distanceFromOrigin never modifies its elements, but expects a mutable tuple. Since point’s type was inferred as readonly [3, 4], it won’t be compatible with [number, number] since that type can’t guarantee point’s elements won’t be mutated.
Creating Types from Types
TypeScript’s type system is very powerful because it allows expressing types in terms of other types.
The simplest form of this idea is generics. Additionally, we have a wide variety of type operators available to use. It’s also possible to express types in terms of values that we already have.
By combining various type operators, we can express complex operations and values in a succinct, maintainable way. In this section we’ll cover ways to express a new type in terms of an existing type or value.
Generics - Types which take parameters
Keyof Type Operator - Using the keyof operator to create new types
Typeof Type Operator - Using the typeof operator to create new types
Indexed Access Types - Using Type['a'] syntax to access a subset of a type
Conditional Types - Types which act like if statements in the type system
Mapped Types - Creating types by mapping each property in an existing type
Template Literal Types - Mapped types which change properties via template literal strings
Generics
A major part of software engineering is building components that not only have well-defined and consistent APIs, but are also reusable. Components that are capable of working on the data of today as well as the data of tomorrow will give you the most flexible capabilities for building up large software systems.
In languages like C# and Java, one of the main tools in the toolbox for creating reusable components is generics, that is, being able to create a component that can work over a variety of types rather than a single one. This allows users to consume these components and use their own types.
Hello World of Generics
To start off, let’s do the “hello world” of generics: the identity function. The identity function is a function that will return back whatever is passed in. You can think of this in a similar way to the echo command.
Without generics, we would either have to give the identity function a specific type:
function identity(arg: number): number {
 return arg;
}
Try
Or, we could describe the identity function using the any type:
function identity(arg: any): any {
 return arg;
}
Try
While using any is certainly generic in that it will cause the function to accept any and all types for the type of arg, we actually are losing the information about what that type was when the function returns. If we passed in a number, the only information we have is that any type could be returned.
Instead, we need a way of capturing the type of the argument in such a way that we can also use it to denote what is being returned. Here, we will use a type variable, a special kind of variable that works on types rather than values.
function identity<Type>(arg: Type): Type {
 return arg;
}
Try
We’ve now added a type variable Type to the identity function. This Type allows us to capture the type the user provides (e.g. number), so that we can use that information later. Here, we use Type again as the return type. On inspection, we can now see the same type is used for the argument and the return type. This allows us to traffic that type information in one side of the function and out the other.
We say that this version of the identity function is generic, as it works over a range of types. Unlike using any, it’s also just as precise (i.e., it doesn’t lose any information) as the first identity function that used numbers for the argument and return type.
Once we’ve written the generic identity function, we can call it in one of two ways. The first way is to pass all of the arguments, including the type argument, to the function:
let output = identity<string>("myString");
    
let output: string
Try
Here we explicitly set Type to be string as one of the arguments to the function call, denoted using the <> around the arguments rather than ().
The second way is also perhaps the most common. Here we use type argument inference — that is, we want the compiler to set the value of Type for us automatically based on the type of the argument we pass in:
let output = identity("myString");
    
let output: string
Try
Notice that we didn’t have to explicitly pass the type in the angle brackets (<>); the compiler just looked at the value "myString", and set Type to its type. While type argument inference can be a helpful tool to keep code shorter and more readable, you may need to explicitly pass in the type arguments as we did in the previous example when the compiler fails to infer the type, as may happen in more complex examples.
Working with Generic Type Variables
When you begin to use generics, you’ll notice that when you create generic functions like identity, the compiler will enforce that you use any generically typed parameters in the body of the function correctly. That is, that you actually treat these parameters as if they could be any and all types.
Let’s take our identity function from earlier:
function identity<Type>(arg: Type): Type {
 return arg;
}
Try
What if we want to also log the length of the argument arg to the console with each call? We might be tempted to write this:
function loggingIdentity<Type>(arg: Type): Type {
 console.log(arg.length);
Property 'length' does not exist on type 'Type'.
 return arg;
}
Try
When we do, the compiler will give us an error that we’re using the .length member of arg, but nowhere have we said that arg has this member. Remember, we said earlier that these type variables stand in for any and all types, so someone using this function could have passed in a number instead, which does not have a .length member.
Let’s say that we’ve actually intended this function to work on arrays of Type rather than Type directly. Since we’re working with arrays, the .length member should be available. We can describe this just like we would create arrays of other types:
function loggingIdentity<Type>(arg: Type[]): Type[] {
 console.log(arg.length);
 return arg;
}
Try
You can read the type of loggingIdentity as “the generic function loggingIdentity takes a type parameter Type, and an argument arg which is an array of Types, and returns an array of Types.” If we passed in an array of numbers, we’d get an array of numbers back out, as Type would bind to number. This allows us to use our generic type variable Type as part of the types we’re working with, rather than the whole type, giving us greater flexibility.
We can alternatively write the sample example this way:
function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
 console.log(arg.length); // Array has a .length, so no more error
 return arg;
}
Try
You may already be familiar with this style of type from other languages. In the next section, we’ll cover how you can create your own generic types like Array<Type>.
Generic Types
In previous sections, we created generic identity functions that worked over a range of types. In this section, we’ll explore the type of the functions themselves and how to create generic interfaces.
The type of generic functions is just like those of non-generic functions, with the type parameters listed first, similarly to function declarations:
function identity<Type>(arg: Type): Type {
 return arg;
}
 
let myIdentity: <Type>(arg: Type) => Type = identity;
Try
We could also have used a different name for the generic type parameter in the type, so long as the number of type variables and how the type variables are used line up.
function identity<Type>(arg: Type): Type {
 return arg;
}
 
let myIdentity: <Input>(arg: Input) => Input = identity;
Try
We can also write the generic type as a call signature of an object literal type:
function identity<Type>(arg: Type): Type {
 return arg;
}
 
let myIdentity: { <Type>(arg: Type): Type } = identity;
Try
Which leads us to writing our first generic interface. Let’s take the object literal from the previous example and move it to an interface:
interface GenericIdentityFn {
 <Type>(arg: Type): Type;
}
 
function identity<Type>(arg: Type): Type {
 return arg;
}
 
let myIdentity: GenericIdentityFn = identity;
Try
In a similar example, we may want to move the generic parameter to be a parameter of the whole interface. This lets us see what type(s) we’re generic over (e.g. Dictionary<string> rather than just Dictionary). This makes the type parameter visible to all the other members of the interface.
interface GenericIdentityFn<Type> {
 (arg: Type): Type;
}
 
function identity<Type>(arg: Type): Type {
 return arg;
}
 
let myIdentity: GenericIdentityFn<number> = identity;
Try
Notice that our example has changed to be something slightly different. Instead of describing a generic function, we now have a non-generic function signature that is a part of a generic type. When we use GenericIdentityFn, we now will also need to specify the corresponding type argument (here: number), effectively locking in what the underlying call signature will use. Understanding when to put the type parameter directly on the call signature and when to put it on the interface itself will be helpful in describing what aspects of a type are generic.
In addition to generic interfaces, we can also create generic classes. Note that it is not possible to create generic enums and namespaces.
Generic Classes
A generic class has a similar shape to a generic interface. Generic classes have a generic type parameter list in angle brackets (<>) following the name of the class.
class GenericNumber<NumType> {
 zeroValue: NumType;
 add: (x: NumType, y: NumType) => NumType;
}
 
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
 return x + y;
};
Try
This is a pretty literal use of the GenericNumber class, but you may have noticed that nothing is restricting it to only use the number type. We could have instead used string or even more complex objects.
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) {
 return x + y;
};
 
console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
Try
Just as with interface, putting the type parameter on the class itself lets us make sure all of the properties of the class are working with the same type.
As we cover in our section on classes, a class has two sides to its type: the static side and the instance side. Generic classes are only generic over their instance side rather than their static side, so when working with classes, static members can not use the class’s type parameter.
Generic Constraints
If you remember from an earlier example, you may sometimes want to write a generic function that works on a set of types where you have some knowledge about what capabilities that set of types will have. In our loggingIdentity example, we wanted to be able to access the .length property of arg, but the compiler could not prove that every type had a .length property, so it warns us that we can’t make this assumption.
function loggingIdentity<Type>(arg: Type): Type {
 console.log(arg.length);
Property 'length' does not exist on type 'Type'.
 return arg;
}
Try
Instead of working with any and all types, we’d like to constrain this function to work with any and all types that also  have the .length property. As long as the type has this member, we’ll allow it, but it’s required to have at least this member. To do so, we must list our requirement as a constraint on what Type can be.
To do so, we’ll create an interface that describes our constraint. Here, we’ll create an interface that has a single .length property and then we’ll use this interface and the extends keyword to denote our constraint:
interface Lengthwise {
 length: number;
}
 
function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
 console.log(arg.length); // Now we know it has a .length property, so no more error
 return arg;
}
Try
Because the generic function is now constrained, it will no longer work over any and all types:
loggingIdentity(3);
Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.
Try
Instead, we need to pass in values whose type has all the required properties:
loggingIdentity({ length: 10, value: 3 });
Try
Using Type Parameters in Generic Constraints
You can declare a type parameter that is constrained by another type parameter. For example, here we’d like to get a property from an object given its name. We’d like to ensure that we’re not accidentally grabbing a property that does not exist on the obj, so we’ll place a constraint between the two types:
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
 return obj[key];
}
 
let x = { a: 1, b: 2, c: 3, d: 4 };
 
getProperty(x, "a");
getProperty(x, "m");
Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
Try
Using Class Types in Generics
When creating factories in TypeScript using generics, it is necessary to refer to class types by their constructor functions. For example,
function create<Type>(c: { new (): Type }): Type {
 return new c();
}
Try
A more advanced example uses the prototype property to infer and constrain relationships between the constructor function and the instance side of class types.
class BeeKeeper {
 hasMask: boolean = true;
}
 
class ZooKeeper {
 nametag: string = "Mikle";
}
 
class Animal {
 numLegs: number = 4;
}
 
class Bee extends Animal {
 numLegs = 6;
 keeper: BeeKeeper = new BeeKeeper();
}
 
class Lion extends Animal {
 keeper: ZooKeeper = new ZooKeeper();
}
 
function createInstance<A extends Animal>(c: new () => A): A {
 return new c();
}
 
createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
Try
This pattern is used to power the mixins design pattern.
Generic Parameter Defaults
By declaring a default for a generic type parameter, you make it optional to specify the corresponding type argument. For example, a function which creates a new HTMLElement. Calling the function with no arguments generates a HTMLDivElement; calling the function with an element as the first argument generates an element of the argument’s type. You can optionally pass a list of children as well. Previously you would have to define the function as:
declare function create(): Container<HTMLDivElement, HTMLDivElement[]>;
declare function create<T extends HTMLElement>(element: T): Container<T, T[]>;
declare function create<T extends HTMLElement, U extends HTMLElement>(
 element: T,
 children: U[]
): Container<T, U[]>;
Try
With generic parameter defaults we can reduce it to:
declare function create<T extends HTMLElement = HTMLDivElement, U extends HTMLElement[] = T[]>(
 element?: T,
 children?: U
): Container<T, U>;
 
const div = create();
    
const div: Container<HTMLDivElement, HTMLDivElement[]>
 
const p = create(new HTMLParagraphElement());
   
const p: Container<HTMLParagraphElement, HTMLParagraphElement[]>
Try
A generic parameter default follows the following rules:
A type parameter is deemed optional if it has a default.
Required type parameters must not follow optional type parameters.
Default types for a type parameter must satisfy the constraint for the type parameter, if it exists.
When specifying type arguments, you are only required to specify type arguments for the required type parameters. Unspecified type parameters will resolve to their default types.
If a default type is specified and inference cannot choose a candidate, the default type is inferred.
A class or interface declaration that merges with an existing class or interface declaration may introduce a default for an existing type parameter.
A class or interface declaration that merges with an existing class or interface declaration may introduce a new type parameter as long as it specifies a default.
Variance Annotations
This is an advanced feature for solving a very specific problem, and should only be used in situations where you’ve identified a reason to use it
Covariance and contravariance are type theory terms that describe what the relationship between two generic types is. Here’s a brief primer on the concept.
For example, if you have an interface representing an object that can make a certain type:
interface Producer<T> {
 make(): T;
}
We can use a Producer<Cat> where a Producer<Animal> is expected, because a Cat is an Animal. This relationship is called covariance: the relationship from Producer<T> to Producer<U> is the same as the relationship from T to U.
Conversely, if you have an interface that can consume a certain type:
interface Consumer<T> {
 consume: (arg: T) => void;
}
Then we can use a Consumer<Animal> where a Consumer<Cat> is expected, because any function that is capable of accepting an Animal must also be capable of accepting a Cat. This relationship is called contravariance: the relationship from Consumer<T> to Consumer<U> is the same as the relationship from U to T. Note the reversal of direction as compared to covariance! This is why contravariance “cancels itself out” but covariance doesn’t.
In a structural type system like TypeScript’s, covariance and contravariance are naturally emergent behaviors that follow from the definition of types. Even in the absence of generics, we would see covariant (and contravariant) relationships:
interface AnimalProducer {
 make(): Animal;
}
// A CatProducer can be used anywhere an
// Animal producer is expected
interface CatProducer {
 make(): Cat;
}
TypeScript has a structural type system, so when comparing two types, e.g. to see if a Producer<Cat> can be used where a Producer<Animal> is expected, the usual algorithm would be structurally expand both of those definitions, and compare their structures. However, variance allows for an extremely useful optimization: if Producer<T> is covariant on T, then we can simply check Cat and Animal instead, as we know they’ll have the same relationship as Producer<Cat> and Producer<Animal>.
Note that this logic can only be used when we’re examining two instantiations of the same type. If we have a Producer<T> and a FastProducer<U>, there’s no guarantee that T and U necessarily refer to the same positions in these types, so this check will always be performed structurally.
Because variance is a naturally emergent property of structural types, TypeScript automatically infers the variance of every generic type. In extremely rare cases involving certain kinds of circular types, this measurement can be inaccurate. If this happens, you can add a variance annotation to a type parameter to force a particular variance:
// Contravariant annotation
interface Consumer<in T> {
 consume: (arg: T) => void;
}
// Covariant annotation
interface Producer<out T> {
 make(): T;
}
// Invariant annotation
interface ProducerConsumer<in out T> {
 consume: (arg: T) => void;
 make(): T;
}
Only do this if you are writing the same variance that should occur structurally.
Never write a variance annotation that doesn’t match the structural variance!
It’s critical to reinforce that variance annotations are only in effect during an instantiation-based comparison. They have no effect during a structural comparison. For example, you can’t use variance annotations to “force” a type to be actually invariant:
// DON'T DO THIS - variance annotation
// does not match structural behavior
interface Producer<in out T> {
 make(): T;
}
// Not a type error -- this is a structural
// comparison, so variance annotations are
// not in effect
const p: Producer<string | number> = {
   make(): number {
       return 42;
   }
}
Here, the object literal’s make function returns number, which we might expect to cause an error because number isn’t string | number. However, this isn’t an instantiation-based comparison, because the object literal is an anonymous type, not a Producer<string | number>.
Variance annotations don’t change structural behavior and are only consulted in specific situations
It’s very important to only write variance annotations if you absolutely know why you’re doing it, what their limitations are, and when they aren’t in effect. Whether TypeScript uses an instantiation-based comparison or structural comparison is not a specified behavior and may change from version to version for correctness or performance reasons, so you should only ever write variance annotations when they match the structural behavior of a type. Don’t use variance annotations to try to “force” a particular variance; this will cause unpredictable behavior in your code.
Do NOT write variance annotations unless they match the structural behavior of a type
Remember, TypeScript can automatically infer variance from your generic types. It’s almost never necessary to write a variance annotation, and you should only do so when you’ve identified a specific need. Variance annotations do not change the structural behavior of a type, and depending on the situation, you might see a structural comparison made when you expected an instantiation-based comparison. Variance annotations can’t be used to modify how types behave in these structural contexts, and shouldn’t be written unless the annotation is the same as the structural definition. Because this is difficult to get right, and TypeScript can correctly infer variance in the vast majority of cases, you should not find yourself writing variance annotations in normal code.
Don’t try to use variance annotations to change typechecking behavior; this is not what they are for
You may find temporary variance annotations useful in a “type debugging” situation, because variance annotations are checked. TypeScript will issue an error if the annotated variance is identifiably wrong:
// Error, this interface is definitely contravariant on T
interface Foo<out T> {
 consume: (arg: T) => void;
}
However, variance annotations are allowed to be stricter (e.g. in out is valid if the actual variance is covariant). Be sure to remove your variance annotations once you’re done debugging.
Lastly, if you’re trying to maximize your typechecking performance, and have run a profiler, and have identified a specific type that’s slow, and have identified variance inference specifically is slow, and have carefully validated the variance annotation you want to write, you may see a small performance benefit in extraordinarily complex types by adding variance annotations.
Don’t try to use variance annotations to change typechecking behavior; this is not what they are for
Keyof Type Operator
The keyof type operator
The keyof operator takes an object type and produces a string or numeric literal union of its keys. The following type P is the same type as type P = "x" | "y":
type Point = { x: number; y: number };
type P = keyof Point;
  
type P = keyof Point
Try
If the type has a string or number index signature, keyof will return those types instead:
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
  
type A = number
 
type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
  
type M = string | number
Try
Note that in this example, M is string | number — this is because JavaScript object keys are always coerced to a string, so obj[0] is always the same as obj["0"].
keyof types become especially useful when combined with mapped types, which we’ll learn more about later.
Typeof Type Operator
The typeof type operator
JavaScript already has a typeof operator you can use in an expression context:
// Prints "string"
console.log(typeof "Hello world");
Try
TypeScript adds a typeof operator you can use in a type context to refer to the type of a variable or property:
let s = "hello";
let n: typeof s;
 
let n: string
Try
This isn’t very useful for basic types, but combined with other type operators, you can use typeof to conveniently express many patterns. For an example, let’s start by looking at the predefined type ReturnType<T>. It takes a function type and produces its return type:
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;
  
type K = boolean
Try
If we try to use ReturnType on a function name, we see an instructive error:
function f() {
 return { x: 10, y: 3 };
}
type P = ReturnType<f>;
'f' refers to a value, but is being used as a type here. Did you mean 'typeof f'?
Try
Remember that values and types aren’t the same thing. To refer to the type that the value f has, we use typeof:
function f() {
 return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
  
type P = {
    x: number;
    y: number;
}
Try
Limitations
TypeScript intentionally limits the sorts of expressions you can use typeof on.
Specifically, it’s only legal to use typeof on identifiers (i.e. variable names) or their properties. This helps avoid the confusing trap of writing code you think is executing, but isn’t:
// Meant to use = ReturnType<typeof msgbox>
let shouldContinue: typeof msgbox("Are you sure you want to continue?");
',' expected.
Indexed Access Types
We can use an indexed access type to look up a specific property on another type:
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];
   
type Age = number
Try
The indexing type is itself a type, so we can use unions, keyof, or other types entirely:
type I1 = Person["age" | "name"];
   
type I1 = string | number
 
type I2 = Person[keyof Person];
   
type I2 = string | number | boolean
 
type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];
   
type I3 = string | boolean
Try
You’ll even see an error if you try to index a property that doesn’t exist:
type I1 = Person["alve"];
Property 'alve' does not exist on type 'Person'.
Try
Another example of indexing with an arbitrary type is using number to get the type of an array’s elements. We can combine this with typeof to conveniently capture the element type of an array literal:
const MyArray = [
 { name: "Alice", age: 15 },
 { name: "Bob", age: 23 },
 { name: "Eve", age: 38 },
];
 
type Person = typeof MyArray[number];
     
type Person = {
    name: string;
    age: number;
}
type Age = typeof MyArray[number]["age"];
   
type Age = number
// Or
type Age2 = Person["age"];
    
type Age2 = number
Try
You can only use types when indexing, meaning you can’t use a const to make a variable reference:
const key = "age";
type Age = Person[key];
Type 'key' cannot be used as an index type.
'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?
Try
However, you can use a type alias for a similar style of refactor:
type key = "age";
type Age = Person[key];
Try
On this page
Is this page helpful?
YesNo
Conditional Types
At the heart of most useful programs, we have to make decisions based on input. JavaScript programs are no different, but given the fact that values can be easily introspected, those decisions are also based on the types of the inputs. Conditional types help describe the relation between the types of inputs and outputs.
interface Animal {
 live(): void;
}
interface Dog extends Animal {
 woof(): void;
}
 
type Example1 = Dog extends Animal ? number : string;
      
type Example1 = number
 
type Example2 = RegExp extends Animal ? number : string;
      
type Example2 = string
Try
Conditional types take a form that looks a little like conditional expressions (condition ? trueExpression : falseExpression) in JavaScript:
 SomeType extends OtherType ? TrueType : FalseType;
Try
When the type on the left of the extends is assignable to the one on the right, then you’ll get the type in the first branch (the “true” branch); otherwise you’ll get the type in the latter branch (the “false” branch).
From the examples above, conditional types might not immediately seem useful - we can tell ourselves whether or not Dog extends Animal and pick number or string! But the power of conditional types comes from using them with generics.
For example, let’s take the following createLabel function:
interface IdLabel {
 id: number /* some fields */;
}
interface NameLabel {
 name: string /* other fields */;
}
 
function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
 throw "unimplemented";
}
Try
These overloads for createLabel describe a single JavaScript function that makes a choice based on the types of its inputs. Note a few things:
If a library has to make the same sort of choice over and over throughout its API, this becomes cumbersome.
We have to create three overloads: one for each case when we’re sure of the type (one for string and one for number), and one for the most general case (taking a string | number). For every new type createLabel can handle, the number of overloads grows exponentially.
Instead, we can encode that logic in a conditional type:
type NameOrId<T extends number | string> = T extends number
 ? IdLabel
 : NameLabel;
Try
We can then use that conditional type to simplify our overloads down to a single function with no overloads.
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
 throw "unimplemented";
}
 
let a = createLabel("typescript");
 
let a: NameLabel
 
let b = createLabel(2.8);
 
let b: IdLabel
 
let c = createLabel(Math.random() ? "hello" : 42);
let c: NameLabel | IdLabel
Try
Conditional Type Constraints
Often, the checks in a conditional type will provide us with some new information. Just like narrowing with type guards can give us a more specific type, the true branch of a conditional type will further constrain generics by the type we check against.
For example, let’s take the following:
type MessageOf<T> = T["message"];
Type '"message"' cannot be used to index type 'T'.
Try
In this example, TypeScript errors because T isn’t known to have a property called message. We could constrain T, and TypeScript would no longer complain:
type MessageOf<T extends { message: unknown }> = T["message"];
 
interface Email {
 message: string;
}
 
type EmailMessageContents = MessageOf<Email>;
            
type EmailMessageContents = string
Try
However, what if we wanted MessageOf to take any type, and default to something like never if a message property isn’t available? We can do this by moving the constraint out and introducing a conditional type:
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
 
interface Email {
 message: string;
}
 
interface Dog {
 bark(): void;
}
 
type EmailMessageContents = MessageOf<Email>;
            
type EmailMessageContents = string
 
type DogMessageContents = MessageOf<Dog>;
           
type DogMessageContents = never
Try
Within the true branch, TypeScript knows that T will have a message property.
As another example, we could also write a type called Flatten that flattens array types to their element types, but leaves them alone otherwise:
type Flatten<T> = T extends any[] ? T[number] : T;
 
// Extracts out the element type.
type Str = Flatten<string[]>;
   
type Str = string
 
// Leaves the type alone.
type Num = Flatten<number>;
   
type Num = number
Try
When Flatten is given an array type, it uses an indexed access with number to fetch out string[]’s element type. Otherwise, it just returns the type it was given.
Inferring Within Conditional Types
We just found ourselves using conditional types to apply constraints and then extract out types. This ends up being such a common operation that conditional types make it easier.
Conditional types provide us with a way to infer from types we compare against in the true branch using the infer keyword. For example, we could have inferred the element type in Flatten instead of fetching it out “manually” with an indexed access type:
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
Try
Here, we used the infer keyword to declaratively introduce a new generic type variable named Item instead of specifying how to retrieve the element type of Type within the true branch. This frees us from having to think about how to dig through and probing apart the structure of the types we’re interested in.
We can write some useful helper type aliases using the infer keyword. For example, for simple cases, we can extract the return type out from function types:
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
 ? Return
 : never;
 
type Num = GetReturnType<() => number>;
   
type Num = number
 
type Str = GetReturnType<(x: string) => string>;
   
type Str = string
 
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
    
type Bools = boolean[]
Try
When inferring from a type with multiple call signatures (such as the type of an overloaded function), inferences are made from the last signature (which, presumably, is the most permissive catch-all case). It is not possible to perform overload resolution based on a list of argument types.
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;
 
type T1 = ReturnType<typeof stringOrNum>;
   
type T1 = string | number
Try
Distributive Conditional Types
When conditional types act on a generic type, they become distributive when given a union type. For example, take the following:
type ToArray<Type> = Type extends any ? Type[] : never;
Try
If we plug a union type into ToArray, then the conditional type will be applied to each member of that union.
type ToArray<Type> = Type extends any ? Type[] : never;
 
type StrArrOrNumArr = ToArray<string | number>;
         
type StrArrOrNumArr = string[] | number[]
Try
What happens here is that ToArray distributes on:
 string | number;
Try
and maps over each member type of the union, to what is effectively:
 ToArray<string> | ToArray<number>;
Try
which leaves us with:
 string[] | number[];
Try
Typically, distributivity is the desired behavior. To avoid that behavior, you can surround each side of the extends keyword with square brackets.
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
 
// 'ArrOfStrOrNum' is no longer a union.
type ArrOfStrOrNum = ToArrayNonDist<string | number>;
        
type ArrOfStrOrNum = (string | number)[]
Try
On this page
Conditional Type Constraints
Inferring Within Conditional Types
Distributive Conditional Types
Is this page helpful?
YesNo
Mapped Types
When you don’t want to repeat yourself, sometimes a type needs to be based on another type.
Mapped types build on the syntax for index signatures, which are used to declare the types of properties which have not been declared ahead of time:
type OnlyBoolsAndHorses = {
 [key: string]: boolean | Horse;
};
 
const conforms: OnlyBoolsAndHorses = {
 del: true,
 rodney: false,
};
Try
A mapped type is a generic type which uses a union of PropertyKeys (frequently created via a keyof) to iterate through keys to create a type:
type OptionsFlags<Type> = {
 [Property in keyof Type]: boolean;
};
Try
In this example, OptionsFlags will take all the properties from the type Type and change their values to be a boolean.
type Features = {
 darkMode: () => void;
 newUserProfile: () => void;
};
 
type FeatureOptions = OptionsFlags<Features>;
         
type FeatureOptions = {
    darkMode: boolean;
    newUserProfile: boolean;
}
Try
Mapping Modifiers
There are two additional modifiers which can be applied during mapping: readonly and ? which affect mutability and optionality respectively.
You can remove or add these modifiers by prefixing with - or +. If you don’t add a prefix, then + is assumed.
// Removes 'readonly' attributes from a type's properties
type CreateMutable<Type> = {
 -readonly [Property in keyof Type]: Type[Property];
};
 
type LockedAccount = {
 readonly id: string;
 readonly name: string;
};
 
type UnlockedAccount = CreateMutable<LockedAccount>;
         
type UnlockedAccount = {
    id: string;
    name: string;
}
Try
// Removes 'optional' attributes from a type's properties
type Concrete<Type> = {
 [Property in keyof Type]-?: Type[Property];
};
 
type MaybeUser = {
 id: string;
 name?: string;
 age?: number;
};
 
type User = Concrete<MaybeUser>;
    
type User = {
    id: string;
    name: string;
    age: number;
}
Try
Key Remapping via as
In TypeScript 4.1 and onwards, you can re-map keys in mapped types with an as clause in a mapped type:
type MappedTypeWithNewProperties<Type> = {
   [Properties in keyof Type as NewKeyType]: Type[Properties]
}
You can leverage features like template literal types to create new property names from prior ones:
type Getters<Type> = {
   [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};
 
interface Person {
   name: string;
   age: number;
   location: string;
}
 
type LazyPerson = Getters<Person>;
       
type LazyPerson = {
    getName: () => string;
    getAge: () => number;
    getLocation: () => string;
}
Try
You can filter out keys by producing never via a conditional type:
// Remove the 'kind' property
type RemoveKindField<Type> = {
   [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};
 
interface Circle {
   kind: "circle";
   radius: number;
}
 
type KindlessCircle = RemoveKindField<Circle>;
         
type KindlessCircle = {
    radius: number;
}
Try
You can map over arbitrary unions, not just unions of string | number | symbol, but unions of any type:
type EventConfig<Events extends { kind: string }> = {
   [E in Events as E["kind"]]: (event: E) => void;
}
 
type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };
 
type Config = EventConfig<SquareEvent | CircleEvent>
     
type Config = {
    square: (event: SquareEvent) => void;
    circle: (event: CircleEvent) => void;
}
Try
Further Exploration
Mapped types work well with other features in this type manipulation section, for example here is a mapped type using a conditional type which returns either a true or false depending on whether an object has the property pii set to the literal true:
type ExtractPII<Type> = {
 [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};
 
type DBFields = {
 id: { format: "incrementing" };
 name: { type: string; pii: true };
};
 
type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
               
type ObjectsNeedingGDPRDeletion = {
    id: false;
    name: true;
}
Try
On this page
Mapping Modifiers
Key Remapping via as
Further Exploration
Is this page helpful?
YesNo
Template Literal Types
Template literal types build on string literal types, and have the ability to expand into many strings via unions.
They have the same syntax as template literal strings in JavaScript, but are used in type positions. When used with concrete literal types, a template literal produces a new string literal type by concatenating the contents.
type World = "world";
 
type Greeting = `hello ${World}`;
      
type Greeting = "hello world"
Try
When a union is used in the interpolated position, the type is the set of every possible string literal that could be represented by each union member:
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
 
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
        
type AllLocaleIDs = "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
Try
For each interpolated position in the template literal, the unions are cross multiplied:
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";
 
type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
          
type LocaleMessageIDs = "en_welcome_email_id" | "en_email_heading_id" | "en_footer_title_id" | "en_footer_sendoff_id" | "ja_welcome_email_id" | "ja_email_heading_id" | "ja_footer_title_id" | "ja_footer_sendoff_id" | "pt_welcome_email_id" | "pt_email_heading_id" | "pt_footer_title_id" | "pt_footer_sendoff_id"
Try
We generally recommend that people use ahead-of-time generation for large string unions, but this is useful in smaller cases.
String Unions in Types
The power in template literals comes when defining a new string based on information inside a type.
Consider the case where a function (makeWatchedObject) adds a new function called on() to a passed object. In JavaScript, its call might look like: makeWatchedObject(baseObject). We can imagine the base object as looking like:
const passedObject = {
 firstName: "Saoirse",
 lastName: "Ronan",
 age: 26,
};
Try
The on function that will be added to the base object expects two arguments, an eventName (a string) and a callback (a function).
The eventName should be of the form attributeInThePassedObject + "Changed"; thus, firstNameChanged as derived from the attribute firstName in the base object.
The callback function, when called:
Should be passed a value of the type associated with the name attributeInThePassedObject; thus, since firstName is typed as string, the callback for the firstNameChanged event expects a string to be passed to it at call time. Similarly events associated with age should expect to be called with a number argument
Should have void return type (for simplicity of demonstration)
The naive function signature of on() might thus be: on(eventName: string, callback: (newValue: any) => void). However, in the preceding description, we identified important type constraints that we’d like to document in our code. Template Literal types let us bring these constraints into our code.
const person = makeWatchedObject({
 firstName: "Saoirse",
 lastName: "Ronan",
 age: 26,
});
 
// makeWatchedObject has added `on` to the anonymous Object
 
person.on("firstNameChanged", (newValue) => {
 console.log(`firstName was changed to ${newValue}!`);
});
Try
Notice that on listens on the event "firstNameChanged", not just "firstName". Our naive specification of on() could be made more robust if we were to ensure that the set of eligible event names was constrained by the union of attribute names in the watched object with “Changed” added at the end. While we are comfortable with doing such a calculation in JavaScript i.e. Object.keys(passedObject).map(x => `${x}Changed`), template literals inside the type system provide a similar approach to string manipulation:
type PropEventSource<Type> = {
   on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};
 
/// Create a "watched object" with an `on` method
/// so that you can watch for changes to properties.
declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;
Try
With this, we can build something that errors when given the wrong property:
const person = makeWatchedObject({
 firstName: "Saoirse",
 lastName: "Ronan",
 age: 26
});
 
person.on("firstNameChanged", () => {});
 
// Prevent easy human error (using the key instead of the event name)
person.on("firstName", () => {});
Argument of type '"firstName"' is not assignable to parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.
 
// It's typo-resistant
person.on("frstNameChanged", () => {});
Argument of type '"frstNameChanged"' is not assignable to parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.
Try
Inference with Template Literals
Notice that we did not benefit from all the information provided in the original passed object. Given change of a firstName (i.e. a firstNameChanged event), we should expect that the callback will receive an argument of type string. Similarly, the callback for a change to age should receive a number argument. We’re naively using any to type the callback’s argument. Again, template literal types make it possible to ensure an attribute’s data type will be the same type as that attribute’s callback’s first argument.
The key insight that makes this possible is this: we can use a function with a generic such that:
The literal used in the first argument is captured as a literal type
That literal type can be validated as being in the union of valid attributes in the generic
The type of the validated attribute can be looked up in the generic’s structure using Indexed Access
This typing information can then be applied to ensure the argument to the callback function is of the same type
type PropEventSource<Type> = {
   on<Key extends string & keyof Type>
       (eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void): void;
};
 
declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;
 
const person = makeWatchedObject({
 firstName: "Saoirse",
 lastName: "Ronan",
 age: 26
});
 
person.on("firstNameChanged", newName => {
                              
(parameter) newName: string
   console.log(`new name is ${newName.toUpperCase()}`);
});
 
person.on("ageChanged", newAge => {
                        
(parameter) newAge: number
   if (newAge < 0) {
       console.warn("warning! negative age");
   }
})
Try
Here we made on into a generic method.
When a user calls with the string "firstNameChanged", TypeScript will try to infer the right type for Key. To do that, it will match Key against the content before "Changed" and infer the string "firstName". Once TypeScript figures that out, the on method can fetch the type of firstName on the original object, which is string in this case. Similarly, when called with "ageChanged", TypeScript finds the type for the property age which is number.
Inference can be combined in different ways, often to deconstruct strings, and reconstruct them in different ways.
Intrinsic String Manipulation Types
To help with string manipulation, TypeScript includes a set of types which can be used in string manipulation. These types come built-in to the compiler for performance and can’t be found in the .d.ts files included with TypeScript.
Uppercase<StringType>
Converts each character in the string to the uppercase version.
Example
type Greeting = "Hello, world"
type ShoutyGreeting = Uppercase<Greeting>
         
type ShoutyGreeting = "HELLO, WORLD"
 
type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`
type MainID = ASCIICacheKey<"my_app">
     
type MainID = "ID-MY_APP"
Try
Lowercase<StringType>
Converts each character in the string to the lowercase equivalent.
Example
type Greeting = "Hello, world"
type QuietGreeting = Lowercase<Greeting>
        
type QuietGreeting = "hello, world"
 
type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`
type MainID = ASCIICacheKey<"MY_APP">
     
type MainID = "id-my_app"
Try
Capitalize<StringType>
Converts the first character in the string to an uppercase equivalent.
Example
type LowercaseGreeting = "hello, world";
type Greeting = Capitalize<LowercaseGreeting>;
      
type Greeting = "Hello, world"
Try
Uncapitalize<StringType>
Converts the first character in the string to a lowercase equivalent.
Example
type UppercaseGreeting = "HELLO WORLD";
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
            
type UncomfortableGreeting = "hELLO WORLD"
Try
Technical details on the intrinsic string manipulation types
The code, as of TypeScript 4.1, for these intrinsic functions uses the JavaScript string runtime functions directly for manipulation and are not locale aware.
function applyStringMapping(symbol: Symbol, str: string) {
    switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
        case IntrinsicTypeKind.Uppercase: return str.toUpperCase();
        case IntrinsicTypeKind.Lowercase: return str.toLowerCase();
        case IntrinsicTypeKind.Capitalize: return str.charAt(0).toUpperCase() + str.slice(1);
        case IntrinsicTypeKind.Uncapitalize: return str.charAt(0).toLowerCase() + str.slice(1);
    }
    return str;
}
On this page
String Unions in Types
Inference with Template Literals
Intrinsic String Manipulation Types
Uppercase<StringType>
Lowercase<StringType>
Capitalize<StringType>
Uncapitalize<StringType>
Is this page helpful?
YesNo
Previous
Mapped Types
Generating types by re-using an existing type.
The TypeScript docs are an open source project. Help us improve these pages by sending a Pull Request ❤
Contributors to this page:
SHOTSGHSPP6+
Last updated: Jul 28, 2025

This page loaded in 0.84 seconds.
Customize
Site Colours:
SystemAlways LightAlways Dark
Code Font:
CascadiaCascadia (ligatures)ConsolasDank MonoFira CodeJetBrains MonoOpenDyslexicSF MonoSource Code Pro
Popular Documentation Pages
Everyday Types
All of the common types in TypeScript
Creating Types from Types
Techniques to make more elegant types
More on Functions
How to provide types to functions in JavaScript
More on Objects
How to provide a type shape to JavaScript objects
Narrowing
How TypeScript infers types based on runtime behavior
Variable Declarations
How to create and type JavaScript variables
TypeScript in 5 minutes
An overview of building a TypeScript web app
TSConfig Options
All the configuration options for a project
Classes
How to provide types to JavaScript ES6 classes
Made with ♥ in Redmond, Boston, SF & Dublin

© 2012-2025 Microsoft
PrivacyTerms of Use
Using TypeScript
Get Started
Download
Community
Playground
TSConfig Ref
Code Samples
Why TypeScript
Design
Community
Get Help
Blog
GitHub Repo
Community Chat
@TypeScript
Mastodon
Stack Overflow
Web Repo
Classes
Background Reading:
Classes (MDN)
TypeScript offers full support for the class keyword introduced in ES2015.
As with other JavaScript language features, TypeScript adds type annotations and other syntax to allow you to express relationships between classes and other types.
Class Members
Here’s the most basic class - an empty one:
class Point {}
Try
This class isn’t very useful yet, so let’s start adding some members.
Fields
A field declaration creates a public writeable property on a class:
class Point {
 x: number;
 y: number;
}
 
const pt = new Point();
pt.x = 0;
pt.y = 0;
Try
As with other locations, the type annotation is optional, but will be an implicit any if not specified.
Fields can also have initializers; these will run automatically when the class is instantiated:
class Point {
 x = 0;
 y = 0;
}
 
const pt = new Point();
// Prints 0, 0
console.log(`${pt.x}, ${pt.y}`);
Try
Just like with const, let, and var, the initializer of a class property will be used to infer its type:
const pt = new Point();
pt.x = "0";
Type 'string' is not assignable to type 'number'.
Try
--strictPropertyInitialization
The strictPropertyInitialization setting controls whether class fields need to be initialized in the constructor.
class BadGreeter {
 name: string;
Property 'name' has no initializer and is not definitely assigned in the constructor.
}
Try
class GoodGreeter {
 name: string;
 
 constructor() {
   this.name = "hello";
 }
}
Try
Note that the field needs to be initialized in the constructor itself. TypeScript does not analyze methods you invoke from the constructor to detect initializations, because a derived class might override those methods and fail to initialize the members.
If you intend to definitely initialize a field through means other than the constructor (for example, maybe an external library is filling in part of your class for you), you can use the definite assignment assertion operator, !:
class OKGreeter {
 // Not initialized, but no error
 name!: string;
}
Try
readonly
Fields may be prefixed with the readonly modifier. This prevents assignments to the field outside of the constructor.
class Greeter {
 readonly name: string = "world";
 
 constructor(otherName?: string) {
   if (otherName !== undefined) {
     this.name = otherName;
   }
 }
 
 err() {
   this.name = "not ok";
Cannot assign to 'name' because it is a read-only property.
 }
}
const g = new Greeter();
g.name = "also not ok";
Cannot assign to 'name' because it is a read-only property.
Try
Constructors
Background Reading:
Constructor (MDN)
Class constructors are very similar to functions. You can add parameters with type annotations, default values, and overloads:
class Point {
 x: number;
 y: number;
 
 // Normal signature with defaults
 constructor(x = 0, y = 0) {
   this.x = x;
   this.y = y;
 }
}
Try
class Point {
 x: number = 0;
 y: number = 0;
 
 // Constructor overloads
 constructor(x: number, y: number);
 constructor(xy: string);
 constructor(x: string | number, y: number = 0) {
   // Code logic here
 }
}
Try
There are just a few differences between class constructor signatures and function signatures:
Constructors can’t have type parameters - these belong on the outer class declaration, which we’ll learn about later
Constructors can’t have return type annotations - the class instance type is always what’s returned
Super Calls
Just as in JavaScript, if you have a base class, you’ll need to call super(); in your constructor body before using any this. members:
class Base {
 k = 4;
}
 
class Derived extends Base {
 constructor() {
   // Prints a wrong value in ES5; throws exception in ES6
   console.log(this.k);
'super' must be called before accessing 'this' in the constructor of a derived class.
   super();
 }
}
Try
Forgetting to call super is an easy mistake to make in JavaScript, but TypeScript will tell you when it’s necessary.
Methods
Background Reading:
Method definitions
A function property on a class is called a method. Methods can use all the same type annotations as functions and constructors:
class Point {
 x = 10;
 y = 10;
 
 scale(n: number): void {
   this.x *= n;
   this.y *= n;
 }
}
Try
Other than the standard type annotations, TypeScript doesn’t add anything else new to methods.
Note that inside a method body, it is still mandatory to access fields and other methods via this.. An unqualified name in a method body will always refer to something in the enclosing scope:
let x: number = 0;
 
class C {
 x: string = "hello";
 
 m() {
   // This is trying to modify 'x' from line 1, not the class property
   x = "world";
Type 'string' is not assignable to type 'number'.
 }
}
Try
Getters / Setters
Classes can also have accessors:
class C {
 _length = 0;
 get length() {
   return this._length;
 }
 set length(value) {
   this._length = value;
 }
}
Try
Note that a field-backed get/set pair with no extra logic is very rarely useful in JavaScript. It’s fine to expose public fields if you don’t need to add additional logic during the get/set operations.
TypeScript has some special inference rules for accessors:
If get exists but no set, the property is automatically readonly
If the type of the setter parameter is not specified, it is inferred from the return type of the getter
Since TypeScript 4.3, it is possible to have accessors with different types for getting and setting.
class Thing {
 _size = 0;
 
 get size(): number {
   return this._size;
 }
 
 set size(value: string | number | boolean) {
   let num = Number(value);
 
   // Don't allow NaN, Infinity, etc
 
   if (!Number.isFinite(num)) {
     this._size = 0;
     return;
   }
 
   this._size = num;
 }
}
Try
Index Signatures
Classes can declare index signatures; these work the same as Index Signatures for other object types:
class MyClass {
 [s: string]: boolean | ((s: string) => boolean);
 
 check(s: string) {
   return this[s] as boolean;
 }
}
Try
Because the index signature type needs to also capture the types of methods, it’s not easy to usefully use these types. Generally it’s better to store indexed data in another place instead of on the class instance itself.
Class Heritage
Like other languages with object-oriented features, classes in JavaScript can inherit from base classes.
implements Clauses
You can use an implements clause to check that a class satisfies a particular interface. An error will be issued if a class fails to correctly implement it:
interface Pingable {
 ping(): void;
}
 
class Sonar implements Pingable {
 ping() {
   console.log("ping!");
 }
}
 
class Ball implements Pingable {
Class 'Ball' incorrectly implements interface 'Pingable'.
  Property 'ping' is missing in type 'Ball' but required in type 'Pingable'.
 pong() {
   console.log("pong!");
 }
}
Try
Classes may also implement multiple interfaces, e.g. class C implements A, B {.
Cautions
It’s important to understand that an implements clause is only a check that the class can be treated as the interface type. It doesn’t change the type of the class or its methods at all. A common source of error is to assume that an implements clause will change the class type - it doesn’t!
interface Checkable {
 check(name: string): boolean;
}
 
class NameChecker implements Checkable {
 check(s) {
Parameter 's' implicitly has an 'any' type.
   // Notice no error here
   return s.toLowerCase() === "ok";
               
any
 }
}
Try
In this example, we perhaps expected that s’s type would be influenced by the name: string parameter of check. It is not - implements clauses don’t change how the class body is checked or its type inferred.
Similarly, implementing an interface with an optional property doesn’t create that property:
interface A {
 x: number;
 y?: number;
}
class C implements A {
 x = 0;
}
const c = new C();
c.y = 10;
Property 'y' does not exist on type 'C'.
Try
extends Clauses
Background Reading:
extends keyword (MDN)
Classes may extend from a base class. A derived class has all the properties and methods of its base class, and can also define additional members.
class Animal {
 move() {
   console.log("Moving along!");
 }
}
 
class Dog extends Animal {
 woof(times: number) {
   for (let i = 0; i < times; i++) {
     console.log("woof!");
   }
 }
}
 
const d = new Dog();
// Base class method
d.move();
// Derived class method
d.woof(3);
Try
Overriding Methods
Background Reading:
super keyword (MDN)
A derived class can also override a base class field or property. You can use the super. syntax to access base class methods. Note that because JavaScript classes are a simple lookup object, there is no notion of a “super field”.
TypeScript enforces that a derived class is always a subtype of its base class.
For example, here’s a legal way to override a method:
class Base {
 greet() {
   console.log("Hello, world!");
 }
}
 
class Derived extends Base {
 greet(name?: string) {
   if (name === undefined) {
     super.greet();
   } else {
     console.log(`Hello, ${name.toUpperCase()}`);
   }
 }
}
 
const d = new Derived();
d.greet();
d.greet("reader");
Try
It’s important that a derived class follow its base class contract. Remember that it’s very common (and always legal!) to refer to a derived class instance through a base class reference:
// Alias the derived instance through a base class reference
const b: Base = d;
// No problem
b.greet();
Try
What if Derived didn’t follow Base’s contract?
class Base {
 greet() {
   console.log("Hello, world!");
 }
}
 
class Derived extends Base {
 // Make this parameter required
 greet(name: string) {
Property 'greet' in type 'Derived' is not assignable to the same property in base type 'Base'.
  Type '(name: string) => void' is not assignable to type '() => void'.
    Target signature provides too few arguments. Expected 1 or more, but got 0.
   console.log(`Hello, ${name.toUpperCase()}`);
 }
}
Try
If we compiled this code despite the error, this sample would then crash:
const b: Base = new Derived();
// Crashes because "name" will be undefined
b.greet();
Try
Type-only Field Declarations
When target >= ES2022 or useDefineForClassFields is true, class fields are initialized after the parent class constructor completes, overwriting any value set by the parent class. This can be a problem when you only want to re-declare a more accurate type for an inherited field. To handle these cases, you can write declare to indicate to TypeScript that there should be no runtime effect for this field declaration.
interface Animal {
 dateOfBirth: any;
}
 
interface Dog extends Animal {
 breed: any;
}
 
class AnimalHouse {
 resident: Animal;
 constructor(animal: Animal) {
   this.resident = animal;
 }
}
 
class DogHouse extends AnimalHouse {
 // Does not emit JavaScript code,
 // only ensures the types are correct
 declare resident: Dog;
 constructor(dog: Dog) {
   super(dog);
 }
}
Try
Initialization Order
The order that JavaScript classes initialize can be surprising in some cases. Let’s consider this code:
class Base {
 name = "base";
 constructor() {
   console.log("My name is " + this.name);
 }
}
 
class Derived extends Base {
 name = "derived";
}
 
// Prints "base", not "derived"
const d = new Derived();
Try
What happened here?
The order of class initialization, as defined by JavaScript, is:
The base class fields are initialized
The base class constructor runs
The derived class fields are initialized
The derived class constructor runs
This means that the base class constructor saw its own value for name during its own constructor, because the derived class field initializations hadn’t run yet.
Inheriting Built-in Types
Note: If you don’t plan to inherit from built-in types like Array, Error, Map, etc. or your compilation target is explicitly set to ES6/ES2015 or above, you may skip this section
In ES2015, constructors which return an object implicitly substitute the value of this for any callers of super(...). It is necessary for generated constructor code to capture any potential return value of super(...) and replace it with this.
As a result, subclassing Error, Array, and others may no longer work as expected. This is due to the fact that constructor functions for Error, Array, and the like use ECMAScript 6’s new.target to adjust the prototype chain; however, there is no way to ensure a value for new.target when invoking a constructor in ECMAScript 5. Other downlevel compilers generally have the same limitation by default.
For a subclass like the following:
class MsgError extends Error {
 constructor(m: string) {
   super(m);
 }
 sayHello() {
   return "hello " + this.message;
 }
}
Try
you may find that:
methods may be undefined on objects returned by constructing these subclasses, so calling sayHello will result in an error.
instanceof will be broken between instances of the subclass and their instances, so (new MsgError()) instanceof MsgError will return false.
As a recommendation, you can manually adjust the prototype immediately after any super(...) calls.
class MsgError extends Error {
 constructor(m: string) {
   super(m);
 
   // Set the prototype explicitly.
   Object.setPrototypeOf(this, MsgError.prototype);
 }
 
 sayHello() {
   return "hello " + this.message;
 }
}
Try
However, any subclass of MsgError will have to manually set the prototype as well. For runtimes that don’t support Object.setPrototypeOf, you may instead be able to use __proto__.
Unfortunately, these workarounds will not work on Internet Explorer 10 and prior. One can manually copy methods from the prototype onto the instance itself (i.e. MsgError.prototype onto this), but the prototype chain itself cannot be fixed.
Member Visibility
You can use TypeScript to control whether certain methods or properties are visible to code outside the class.
public
The default visibility of class members is public. A public member can be accessed anywhere:
class Greeter {
 public greet() {
   console.log("hi!");
 }
}
const g = new Greeter();
g.greet();
Try
Because public is already the default visibility modifier, you don’t ever need to write it on a class member, but might choose to do so for style/readability reasons.
protected
protected members are only visible to subclasses of the class they’re declared in.
class Greeter {
 public greet() {
   console.log("Hello, " + this.getName());
 }
 protected getName() {
   return "hi";
 }
}
 
class SpecialGreeter extends Greeter {
 public howdy() {
   // OK to access protected member here
   console.log("Howdy, " + this.getName());
 }
}
const g = new SpecialGreeter();
g.greet(); // OK
g.getName();
Property 'getName' is protected and only accessible within class 'Greeter' and its subclasses.
Try
Exposure of protected members
Derived classes need to follow their base class contracts, but may choose to expose a subtype of base class with more capabilities. This includes making protected members public:
class Base {
 protected m = 10;
}
class Derived extends Base {
 // No modifier, so default is 'public'
 m = 15;
}
const d = new Derived();
console.log(d.m); // OK
Try
Note that Derived was already able to freely read and write m, so this doesn’t meaningfully alter the “security” of this situation. The main thing to note here is that in the derived class, we need to be careful to repeat the protected modifier if this exposure isn’t intentional.
Cross-hierarchy protected access
TypeScript doesn’t allow accessing protected members of a sibling class in a class hierarchy:
class Base {
 protected x: number = 1;
}
class Derived1 extends Base {
 protected x: number = 5;
}
class Derived2 extends Base {
 f1(other: Derived2) {
   other.x = 10;
 }
 f2(other: Derived1) {
   other.x = 10;
Property 'x' is protected and only accessible within class 'Derived1' and its subclasses.
 }
}
Try
This is because accessing x in Derived2 should only be legal from Derived2’s subclasses, and Derived1 isn’t one of them. Moreover, if accessing x through a Derived1 reference is illegal (which it certainly should be!), then accessing it through a base class reference should never improve the situation.
See also Why Can’t I Access A Protected Member From A Derived Class? which explains more of C#‘s reasoning on the same topic.
private
private is like protected, but doesn’t allow access to the member even from subclasses:
class Base {
 private x = 0;
}
const b = new Base();
// Can't access from outside the class
console.log(b.x);
Property 'x' is private and only accessible within class 'Base'.
Try
class Derived extends Base {
 showX() {
   // Can't access in subclasses
   console.log(this.x);
Property 'x' is private and only accessible within class 'Base'.
 }
}
Try
Because private members aren’t visible to derived classes, a derived class can’t increase their visibility:
class Base {
 private x = 0;
}
class Derived extends Base {
Class 'Derived' incorrectly extends base class 'Base'.
  Property 'x' is private in type 'Base' but not in type 'Derived'.
 x = 1;
}
Try
Cross-instance private access
Different OOP languages disagree about whether different instances of the same class may access each others’ private members. While languages like Java, C#, C++, Swift, and PHP allow this, Ruby does not.
TypeScript does allow cross-instance private access:
class A {
 private x = 10;
 
 public sameAs(other: A) {
   // No error
   return other.x === this.x;
 }
}
Try
Caveats
Like other aspects of TypeScript’s type system, private and protected are only enforced during type checking.
This means that JavaScript runtime constructs like in or simple property lookup can still access a private or protected member:
class MySafe {
 private secretKey = 12345;
}
Try
// In a JavaScript file...
const s = new MySafe();
// Will print 12345
console.log(s.secretKey);
private also allows access using bracket notation during type checking. This makes private-declared fields potentially easier to access for things like unit tests, with the drawback that these fields are soft private and don’t strictly enforce privacy.
class MySafe {
 private secretKey = 12345;
}
 
const s = new MySafe();
 
// Not allowed during type checking
console.log(s.secretKey);
Property 'secretKey' is private and only accessible within class 'MySafe'.
 
// OK
console.log(s["secretKey"]);
Try
Unlike TypeScripts’s private, JavaScript’s private fields (#) remain private after compilation and do not provide the previously mentioned escape hatches like bracket notation access, making them hard private.
class Dog {
 #barkAmount = 0;
 personality = "happy";
 
 constructor() {}
}
Try
"use strict";
class Dog {
   #barkAmount = 0;
   personality = "happy";
   constructor() { }
}
 
Try
When compiling to ES2021 or less, TypeScript will use WeakMaps in place of #.
"use strict";
var _Dog_barkAmount;
class Dog {
   constructor() {
       _Dog_barkAmount.set(this, 0);
       this.personality = "happy";
   }
}
_Dog_barkAmount = new WeakMap();
 
Try
If you need to protect values in your class from malicious actors, you should use mechanisms that offer hard runtime privacy, such as closures, WeakMaps, or private fields. Note that these added privacy checks during runtime could affect performance.
Static Members
Background Reading:
Static Members (MDN)
Classes may have static members. These members aren’t associated with a particular instance of the class. They can be accessed through the class constructor object itself:
class MyClass {
 static x = 0;
 static printX() {
   console.log(MyClass.x);
 }
}
console.log(MyClass.x);
MyClass.printX();
Try
Static members can also use the same public, protected, and private visibility modifiers:
class MyClass {
 private static x = 0;
}
console.log(MyClass.x);
Property 'x' is private and only accessible within class 'MyClass'.
Try
Static members are also inherited:
class Base {
 static getGreeting() {
   return "Hello world";
 }
}
class Derived extends Base {
 myGreeting = Derived.getGreeting();
}
Try
Special Static Names
It’s generally not safe/possible to overwrite properties from the Function prototype. Because classes are themselves functions that can be invoked with new, certain static names can’t be used. Function properties like name, length, and call aren’t valid to define as static members:
class S {
 static name = "S!";
Static property 'name' conflicts with built-in property 'Function.name' of constructor function 'S'.
}
Try
Why No Static Classes?
TypeScript (and JavaScript) don’t have a construct called static class the same way as, for example, C# does.
Those constructs only exist because those languages force all data and functions to be inside a class; because that restriction doesn’t exist in TypeScript, there’s no need for them. A class with only a single instance is typically just represented as a normal object in JavaScript/TypeScript.
For example, we don’t need a “static class” syntax in TypeScript because a regular object (or even top-level function) will do the job just as well:
// Unnecessary "static" class
class MyStaticClass {
 static doSomething() {}
}
 
// Preferred (alternative 1)
function doSomething() {}
 
// Preferred (alternative 2)
const MyHelperObject = {
 dosomething() {},
};
Try
static Blocks in Classes
Static blocks allow you to write a sequence of statements with their own scope that can access private fields within the containing class. This means that we can write initialization code with all the capabilities of writing statements, no leakage of variables, and full access to our class’s internals.
class Foo {
   static #count = 0;
 
   get count() {
       return Foo.#count;
   }
 
   static {
       try {
           const lastInstances = loadLastInstances();
           Foo.#count += lastInstances.length;
       }
       catch {}
   }
}
Try
Generic Classes
Classes, much like interfaces, can be generic. When a generic class is instantiated with new, its type parameters are inferred the same way as in a function call:
class Box<Type> {
 contents: Type;
 constructor(value: Type) {
   this.contents = value;
 }
}
 
const b = new Box("hello!");
   
const b: Box<string>
Try
Classes can use generic constraints and defaults the same way as interfaces.
Type Parameters in Static Members
This code isn’t legal, and it may not be obvious why:
class Box<Type> {
 static defaultValue: Type;
Static members cannot reference class type parameters.
}
Try
Remember that types are always fully erased! At runtime, there’s only one Box.defaultValue property slot. This means that setting Box<string>.defaultValue (if that were possible) would also change Box<number>.defaultValue - not good. The static members of a generic class can never refer to the class’s type parameters.
this at Runtime in Classes
Background Reading:
this keyword (MDN)
It’s important to remember that TypeScript doesn’t change the runtime behavior of JavaScript, and that JavaScript is somewhat famous for having some peculiar runtime behaviors.
JavaScript’s handling of this is indeed unusual:
class MyClass {
 name = "MyClass";
 getName() {
   return this.name;
 }
}
const c = new MyClass();
const obj = {
 name: "obj",
 getName: c.getName,
};
 
// Prints "obj", not "MyClass"
console.log(obj.getName());
Try
Long story short, by default, the value of this inside a function depends on how the function was called. In this example, because the function was called through the obj reference, its value of this was obj rather than the class instance.
This is rarely what you want to happen! TypeScript provides some ways to mitigate or prevent this kind of error.
Arrow Functions
Background Reading:
Arrow functions (MDN)
If you have a function that will often be called in a way that loses its this context, it can make sense to use an arrow function property instead of a method definition:
class MyClass {
 name = "MyClass";
 getName = () => {
   return this.name;
 };
}
const c = new MyClass();
const g = c.getName;
// Prints "MyClass" instead of crashing
console.log(g());
Try
This has some trade-offs:
The this value is guaranteed to be correct at runtime, even for code not checked with TypeScript
This will use more memory, because each class instance will have its own copy of each function defined this way
You can’t use super.getName in a derived class, because there’s no entry in the prototype chain to fetch the base class method from
this parameters
In a method or function definition, an initial parameter named this has special meaning in TypeScript. These parameters are erased during compilation:
// TypeScript input with 'this' parameter
function fn(this: SomeType, x: number) {
 /* ... */
}
Try
// JavaScript output
function fn(x) {
 /* ... */
}
TypeScript checks that calling a function with a this parameter is done so with a correct context. Instead of using an arrow function, we can add a this parameter to method definitions to statically enforce that the method is called correctly:
class MyClass {
 name = "MyClass";
 getName(this: MyClass) {
   return this.name;
 }
}
const c = new MyClass();
// OK
c.getName();
 
// Error, would crash
const g = c.getName;
console.log(g());
The 'this' context of type 'void' is not assignable to method's 'this' of type 'MyClass'.
Try
This method makes the opposite trade-offs of the arrow function approach:
JavaScript callers might still use the class method incorrectly without realizing it
Only one function per class definition gets allocated, rather than one per class instance
Base method definitions can still be called via super.
this Types
In classes, a special type called this refers dynamically to the type of the current class. Let’s see how this is useful:
class Box {
 contents: string = "";
 set(value: string) {
 (method) Box.set(value: string): this
   this.contents = value;
   return this;
 }
}
Try
Here, TypeScript inferred the return type of set to be this, rather than Box. Now let’s make a subclass of Box:
class ClearableBox extends Box {
 clear() {
   this.contents = "";
 }
}
 
const a = new ClearableBox();
const b = a.set("hello");
   
const b: ClearableBox
Try
You can also use this in a parameter type annotation:
class Box {
 content: string = "";
 sameAs(other: this) {
   return other.content === this.content;
 }
}
Try
This is different from writing other: Box — if you have a derived class, its sameAs method will now only accept other instances of that same derived class:
class Box {
 content: string = "";
 sameAs(other: this) {
   return other.content === this.content;
 }
}
 
class DerivedBox extends Box {
 otherContent: string = "?";
}
 
const base = new Box();
const derived = new DerivedBox();
derived.sameAs(base);
Argument of type 'Box' is not assignable to parameter of type 'DerivedBox'.
  Property 'otherContent' is missing in type 'Box' but required in type 'DerivedBox'.
Try
this-based type guards
You can use this is Type in the return position for methods in classes and interfaces. When mixed with a type narrowing (e.g. if statements) the type of the target object would be narrowed to the specified Type.
class FileSystemObject {
 isFile(): this is FileRep {
   return this instanceof FileRep;
 }
 isDirectory(): this is Directory {
   return this instanceof Directory;
 }
 isNetworked(): this is Networked & this {
   return this.networked;
 }
 constructor(public path: string, private networked: boolean) {}
}
 
class FileRep extends FileSystemObject {
 constructor(path: string, public content: string) {
   super(path, false);
 }
}
 
class Directory extends FileSystemObject {
 children: FileSystemObject[];
}
 
interface Networked {
 host: string;
}
 
const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo");
 
if (fso.isFile()) {
 fso.content;
 const fso: FileRep
} else if (fso.isDirectory()) {
 fso.children;
 const fso: Directory
} else if (fso.isNetworked()) {
 fso.host;
 const fso: Networked & FileSystemObject
}
Try
A common use-case for a this-based type guard is to allow for lazy validation of a particular field. For example, this case removes an undefined from the value held inside box when hasValue has been verified to be true:
class Box<T> {
 value?: T;
 
 hasValue(): this is { value: T } {
   return this.value !== undefined;
 }
}
 
const box = new Box<string>();
box.value = "Gameboy";
 
box.value;
   
(property) Box<string>.value?: string
 
if (box.hasValue()) {
 box.value;
     
(property) value: string
}
Try
Parameter Properties
TypeScript offers special syntax for turning a constructor parameter into a class property with the same name and value. These are called parameter properties and are created by prefixing a constructor argument with one of the visibility modifiers public, private, protected, or readonly. The resulting field gets those modifier(s):
class Params {
 constructor(
   public readonly x: number,
   protected y: number,
   private z: number
 ) {
   // No body necessary
 }
}
const a = new Params(1, 2, 3);
console.log(a.x);
           
(property) Params.x: number
console.log(a.z);
Property 'z' is private and only accessible within class 'Params'.
Try
Class Expressions
Background Reading:
Class expressions (MDN)
Class expressions are very similar to class declarations. The only real difference is that class expressions don’t need a name, though we can refer to them via whatever identifier they ended up bound to:
const someClass = class<Type> {
 content: Type;
 constructor(value: Type) {
   this.content = value;
 }
};
 
const m = new someClass("Hello, world");
   
const m: someClass<string>
Try
Constructor Signatures
JavaScript classes are instantiated with the new operator. Given the type of a class itself, the InstanceType utility type models this operation.
class Point {
 createdAt: number;
 x: number;
 y: number
 constructor(x: number, y: number) {
   this.createdAt = Date.now()
   this.x = x;
   this.y = y;
 }
}
type PointInstance = InstanceType<typeof Point>
 
function moveRight(point: PointInstance) {
 point.x += 5;
}
 
const point = new Point(3, 4);
moveRight(point);
point.x; // => 8
Try
abstract Classes and Members
Classes, methods, and fields in TypeScript may be abstract.
An abstract method or abstract field is one that hasn’t had an implementation provided. These members must exist inside an abstract class, which cannot be directly instantiated.
The role of abstract classes is to serve as a base class for subclasses which do implement all the abstract members. When a class doesn’t have any abstract members, it is said to be concrete.
Let’s look at an example:
abstract class Base {
 abstract getName(): string;
 
 printName() {
   console.log("Hello, " + this.getName());
 }
}
 
const b = new Base();
Cannot create an instance of an abstract class.
Try
We can’t instantiate Base with new because it’s abstract. Instead, we need to make a derived class and implement the abstract members:
class Derived extends Base {
 getName() {
   return "world";
 }
}
 
const d = new Derived();
d.printName();
Try
Notice that if we forget to implement the base class’s abstract members, we’ll get an error:
class Derived extends Base {
Non-abstract class 'Derived' does not implement inherited abstract member getName from class 'Base'.
 // forgot to do anything
}
Try
Abstract Construct Signatures
Sometimes you want to accept some class constructor function that produces an instance of a class which derives from some abstract class.
For example, you might want to write this code:
function greet(ctor: typeof Base) {
 const instance = new ctor();
Cannot create an instance of an abstract class.
 instance.printName();
}
Try
TypeScript is correctly telling you that you’re trying to instantiate an abstract class. After all, given the definition of greet, it’s perfectly legal to write this code, which would end up constructing an abstract class:
// Bad!
greet(Base);
Try
Instead, you want to write a function that accepts something with a construct signature:
function greet(ctor: new () => Base) {
 const instance = new ctor();
 instance.printName();
}
greet(Derived);
greet(Base);
Argument of type 'typeof Base' is not assignable to parameter of type 'new () => Base'.
  Cannot assign an abstract constructor type to a non-abstract constructor type.
Try
Now TypeScript correctly tells you about which class constructor functions can be invoked - Derived can because it’s concrete, but Base cannot.
Relationships Between Classes
In most cases, classes in TypeScript are compared structurally, the same as other types.
For example, these two classes can be used in place of each other because they’re identical:
class Point1 {
 x = 0;
 y = 0;
}
 
class Point2 {
 x = 0;
 y = 0;
}
 
// OK
const p: Point1 = new Point2();
Try
Similarly, subtype relationships between classes exist even if there’s no explicit inheritance:
class Person {
 name: string;
 age: number;
}
 
class Employee {
 name: string;
 age: number;
 salary: number;
}
 
// OK
const p: Person = new Employee();
Try
This sounds straightforward, but there are a few cases that seem stranger than others.
Empty classes have no members. In a structural type system, a type with no members is generally a supertype of anything else. So if you write an empty class (don’t!), anything can be used in place of it:
class Empty {}
 
function fn(x: Empty) {
 // can't do anything with 'x', so I won't
}
 
// All OK!
fn(window);
fn({});
fn(fn);
Modules
JavaScript has a long history of different ways to handle modularizing code. Having been around since 2012, TypeScript has implemented support for a lot of these formats, but over time the community and the JavaScript specification has converged on a format called ES Modules (or ES6 modules). You might know it as the import/export syntax.
ES Modules was added to the JavaScript spec in 2015, and by 2020 had broad support in most web browsers and JavaScript runtimes.
For focus, the handbook will cover both ES Modules and its popular pre-cursor CommonJS module.exports = syntax, and you can find information about the other module patterns in the reference section under Modules.
How JavaScript Modules are Defined
In TypeScript, just as in ECMAScript 2015, any file containing a top-level import or export is considered a module.
Conversely, a file without any top-level import or export declarations is treated as a script whose contents are available in the global scope (and therefore to modules as well).
Modules are executed within their own scope, not in the global scope. This means that variables, functions, classes, etc. declared in a module are not visible outside the module unless they are explicitly exported using one of the export forms. Conversely, to consume a variable, function, class, interface, etc. exported from a different module, it has to be imported using one of the import forms.
Non-modules
Before we start, it’s important to understand what TypeScript considers a module. The JavaScript specification declares that any JavaScript files without an import declaration, export, or top-level await should be considered a script and not a module.
Inside a script file variables and types are declared to be in the shared global scope, and it’s assumed that you’ll either use the outFile compiler option to join multiple input files into one output file, or use multiple <script> tags in your HTML to load these files (in the correct order!).
If you have a file that doesn’t currently have any imports or exports, but you want to be treated as a module, add the line:
export {};
Try
which will change the file to be a module exporting nothing. This syntax works regardless of your module target.
Modules in TypeScript
Additional Reading:
Impatient JS (Modules)
MDN: JavaScript Modules
There are three main things to consider when writing module-based code in TypeScript:
Syntax: What syntax do I want to use to import and export things?
Module Resolution: What is the relationship between module names (or paths) and files on disk?
Module Output Target: What should my emitted JavaScript module look like?
ES Module Syntax
A file can declare a main export via export default:
// @filename: hello.ts
export default function helloWorld() {
 console.log("Hello, world!");
}
Try
This is then imported via:
import helloWorld from "./hello.js";
helloWorld();
Try
In addition to the default export, you can have more than one export of variables and functions via the export by omitting default:
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;
 
export class RandomNumberGenerator {}
 
export function absolute(num: number) {
 if (num < 0) return num * -1;
 return num;
}
Try
These can be used in another file via the import syntax:
import { pi, phi, absolute } from "./maths.js";
 
console.log(pi);
const absPhi = absolute(phi);
      
const absPhi: number
Try
Additional Import Syntax
An import can be renamed using a format like import {old as new}:
import { pi as π } from "./maths.js";
 
console.log(π);
         
(alias) var π: number
import π
Try
You can mix and match the above syntax into a single import:
// @filename: maths.ts
export const pi = 3.14;
export default class RandomNumberGenerator {}
 
// @filename: app.ts
import RandomNumberGenerator, { pi as π } from "./maths.js";
 
RandomNumberGenerator;
       
(alias) class RandomNumberGenerator
import RandomNumberGenerator
 
console.log(π);
         
(alias) const π: 3.14
import π
Try
You can take all of the exported objects and put them into a single namespace using * as name:
// @filename: app.ts
import * as math from "./maths.js";
 
console.log(math.pi);
const positivePhi = math.absolute(math.phi);
        
const positivePhi: number
Try
You can import a file and not include any variables into your current module via import "./file":
// @filename: app.ts
import "./maths.js";
 
console.log("3.14");
Try
In this case, the import does nothing. However, all of the code in maths.ts was evaluated, which could trigger side-effects which affect other objects.
TypeScript Specific ES Module Syntax
Types can be exported and imported using the same syntax as JavaScript values:
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
 
export interface Dog {
 breeds: string[];
 yearOfBirth: number;
}
 
// @filename: app.ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
Try
TypeScript has extended the import syntax with two concepts for declaring an import of a type:
import type
Which is an import statement which can only import types:
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";
 
// @filename: valid.ts
import type { Cat, Dog } from "./animal.js";
export type Animals = Cat | Dog;
 
// @filename: app.ts
import type { createCatName } from "./animal.js";
const name = createCatName();
'createCatName' cannot be used as a value because it was imported using 'import type'.
Try
Inline type imports
TypeScript 4.5 also allows for individual imports to be prefixed with type to indicate that the imported reference is a type:
// @filename: app.ts
import { createCatName, type Cat, type Dog } from "./animal.js";
 
export type Animals = Cat | Dog;
const name = createCatName();
Try
Together these allow a non-TypeScript transpiler like Babel, swc or esbuild to know what imports can be safely removed.
ES Module Syntax with CommonJS Behavior
TypeScript has ES Module syntax which directly correlates to a CommonJS and AMD require. Imports using ES Module are for most cases the same as the require from those environments, but this syntax ensures you have a 1 to 1 match in your TypeScript file with the CommonJS output:
import fs = require("fs");
const code = fs.readFileSync("hello.ts", "utf8");
Try
You can learn more about this syntax in the modules reference page.
CommonJS Syntax
CommonJS is the format which most modules on npm are delivered in. Even if you are writing using the ES Modules syntax above, having a brief understanding of how CommonJS syntax works will help you debug easier.
Exporting
Identifiers are exported via setting the exports property on a global called module.
function absolute(num: number) {
 if (num < 0) return num * -1;
 return num;
}
 
module.exports = {
 pi: 3.14,
 squareTwo: 1.41,
 phi: 1.61,
 absolute,
};
Try
Then these files can be imported via a require statement:
const maths = require("./maths");
maths.pi;
    
any
Try
Or you can simplify a bit using the destructuring feature in JavaScript:
const { squareTwo } = require("./maths");
squareTwo;
 
const squareTwo: any
Try
CommonJS and ES Modules interop
There is a mis-match in features between CommonJS and ES Modules regarding the distinction between a default import and a module namespace object import. TypeScript has a compiler flag to reduce the friction between the two different sets of constraints with esModuleInterop.
TypeScript’s Module Resolution Options
Module resolution is the process of taking a string from the import or require statement, and determining what file that string refers to.
TypeScript includes two resolution strategies: Classic and Node. Classic, the default when the compiler option module is not commonjs, is included for backwards compatibility. The Node strategy replicates how Node.js works in CommonJS mode, with additional checks for .ts and .d.ts.
There are many TSConfig flags which influence the module strategy within TypeScript: moduleResolution, baseUrl, paths, rootDirs.
For the full details on how these strategies work, you can consult the Module Resolution reference page.
TypeScript’s Module Output Options
There are two options which affect the emitted JavaScript output:
target which determines which JS features are downleveled (converted to run in older JavaScript runtimes) and which are left intact
module which determines what code is used for modules to interact with each other
Which target you use is determined by the features available in the JavaScript runtime you expect to run the TypeScript code in. That could be: the oldest web browser you support, the lowest version of Node.js you expect to run on or could come from unique constraints from your runtime - like Electron for example.
All communication between modules happens via a module loader, the compiler option module determines which one is used. At runtime the module loader is responsible for locating and executing all dependencies of a module before executing it.
For example, here is a TypeScript file using ES Modules syntax, showcasing a few different options for module:
import { valueOfPi } from "./constants.js";
 
export const twoPi = valueOfPi * 2;
Try
ES2020
import { valueOfPi } from "./constants.js";
export const twoPi = valueOfPi * 2;
 
Try
CommonJS
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoPi = void 0;
const constants_js_1 = require("./constants.js");
exports.twoPi = constants_js_1.valueOfPi * 2;
 
Try
UMD
(function (factory) {
   if (typeof module === "object" && typeof module.exports === "object") {
       var v = factory(require, exports);
       if (v !== undefined) module.exports = v;
   }
   else if (typeof define === "function" && define.amd) {
       define(["require", "exports", "./constants.js"], factory);
   }
})(function (require, exports) {
   "use strict";
   Object.defineProperty(exports, "__esModule", { value: true });
   exports.twoPi = void 0;
   const constants_js_1 = require("./constants.js");
   exports.twoPi = constants_js_1.valueOfPi * 2;
});
 
Try
Note that ES2020 is effectively the same as the original index.ts.
You can see all of the available options and what their emitted JavaScript code looks like in the TSConfig Reference for module.
TypeScript namespaces
TypeScript has its own module format called namespaces which pre-dates the ES Modules standard. This syntax has a lot of useful features for creating complex definition files, and still sees active use in DefinitelyTyped. While not deprecated, the majority of the features in namespaces exist in ES Modules and we recommend you use that to align with JavaScript’s direction. You can learn more about namespaces in the namespaces reference page.
Utility Types
TypeScript provides several utility types to facilitate common type transformations. These utilities are available globally.
Awaited<Type>
Released: 4.5
This type is meant to model operations like await in async functions, or the .then() method on Promises - specifically, the way that they recursively unwrap Promises.
Example
type A = Awaited<Promise<string>>;
  
type A = string
 
type B = Awaited<Promise<Promise<number>>>;
  
type B = number
 
type C = Awaited<boolean | Promise<number>>;
  
type C = number | boolean
Try
Partial<Type>
Released:
2.1
Constructs a type with all properties of Type set to optional. This utility will return a type that represents all subsets of a given type.
Example
interface Todo {
 title: string;
 description: string;
}
 
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
 return { ...todo, ...fieldsToUpdate };
}
 
const todo1 = {
 title: "organize desk",
 description: "clear clutter",
};
 
const todo2 = updateTodo(todo1, {
 description: "throw out trash",
});
Try
Required<Type>
Released:
2.8
Constructs a type consisting of all properties of Type set to required. The opposite of Partial.
Example
interface Props {
 a?: number;
 b?: string;
}
 
const obj: Props = { a: 5 };
 
const obj2: Required<Props> = { a: 5 };
Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.
Try
Readonly<Type>
Released:
2.1
Constructs a type with all properties of Type set to readonly, meaning the properties of the constructed type cannot be reassigned.
Example
interface Todo {
 title: string;
}
 
const todo: Readonly<Todo> = {
 title: "Delete inactive users",
};
 
todo.title = "Hello";
Cannot assign to 'title' because it is a read-only property.
Try
This utility is useful for representing assignment expressions that will fail at runtime (i.e. when attempting to reassign properties of a frozen object).
Object.freeze
function freeze<Type>(obj: Type): Readonly<Type>;
Record<Keys, Type>
Released:
2.1
Constructs an object type whose property keys are Keys and whose property values are Type. This utility can be used to map the properties of a type to another type.
Example
type CatName = "miffy" | "boris" | "mordred";
 
interface CatInfo {
 age: number;
 breed: string;
}
 
const cats: Record<CatName, CatInfo> = {
 miffy: { age: 10, breed: "Persian" },
 boris: { age: 5, breed: "Maine Coon" },
 mordred: { age: 16, breed: "British Shorthair" },
};
 
cats.boris;
const cats: Record<CatName, CatInfo>
Try
Pick<Type, Keys>
Released:
2.1
Constructs a type by picking the set of properties Keys (string literal or union of string literals) from Type.
Example
interface Todo {
 title: string;
 description: string;
 completed: boolean;
}
 
type TodoPreview = Pick<Todo, "title" | "completed">;
 
const todo: TodoPreview = {
 title: "Clean room",
 completed: false,
};
 
todo;
const todo: TodoPreview
Try
Omit<Type, Keys>
Released:
3.5
Constructs a type by picking all properties from Type and then removing Keys (string literal or union of string literals). The opposite of Pick.
Example
interface Todo {
 title: string;
 description: string;
 completed: boolean;
 createdAt: number;
}
 
type TodoPreview = Omit<Todo, "description">;
 
const todo: TodoPreview = {
 title: "Clean room",
 completed: false,
 createdAt: 1615544252770,
};
 
todo;
const todo: TodoPreview
 
type TodoInfo = Omit<Todo, "completed" | "createdAt">;
 
const todoInfo: TodoInfo = {
 title: "Pick up kids",
 description: "Kindergarten closes at 5pm",
};
 
todoInfo;
 
const todoInfo: TodoInfo
Try
Exclude<UnionType, ExcludedMembers>
Released:
2.8
Constructs a type by excluding from UnionType all union members that are assignable to ExcludedMembers.
Example
type T0 = Exclude<"a" | "b" | "c", "a">;
   
type T0 = "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
   
type T1 = "c"
type T2 = Exclude<string | number | (() => void), Function>;
   
type T2 = string | number
 
type Shape =
 | { kind: "circle"; radius: number }
 | { kind: "square"; x: number }
 | { kind: "triangle"; x: number; y: number };
 
type T3 = Exclude<Shape, { kind: "circle" }>
   
type T3 = {
    kind: "square";
    x: number;
} | {
    kind: "triangle";
    x: number;
    y: number;
}
Try
Extract<Type, Union>
Released:
2.8
Constructs a type by extracting from Type all union members that are assignable to Union.
Example
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
   
type T0 = "a"
type T1 = Extract<string | number | (() => void), Function>;
   
type T1 = () => void
 
type Shape =
 | { kind: "circle"; radius: number }
 | { kind: "square"; x: number }
 | { kind: "triangle"; x: number; y: number };
 
type T2 = Extract<Shape, { kind: "circle" }>
   
type T2 = {
    kind: "circle";
    radius: number;
}
Try
NonNullable<Type>
Released:
2.8
Constructs a type by excluding null and undefined from Type.
Example
type T0 = NonNullable<string | number | undefined>;
   
type T0 = string | number
type T1 = NonNullable<string[] | null | undefined>;
   
type T1 = string[]
Try
Parameters<Type>
Released:
3.1
Constructs a tuple type from the types used in the parameters of a function type Type.
For overloaded functions, this will be the parameters of the last signature; see Inferring Within Conditional Types.
Example
declare function f1(arg: { a: number; b: string }): void;
 
type T0 = Parameters<() => string>;
   
type T0 = []
type T1 = Parameters<(s: string) => void>;
   
type T1 = [s: string]
type T2 = Parameters<<T>(arg: T) => T>;
   
type T2 = [arg: unknown]
type T3 = Parameters<typeof f1>;
   
type T3 = [arg: {
    a: number;
    b: string;
}]
type T4 = Parameters<any>;
   
type T4 = unknown[]
type T5 = Parameters<never>;
   
type T5 = never
type T6 = Parameters<string>;
Type 'string' does not satisfy the constraint '(...args: any) => any'.
   
type T6 = never
type T7 = Parameters<Function>;
Type 'Function' does not satisfy the constraint '(...args: any) => any'.
  Type 'Function' provides no match for the signature '(...args: any): any'.
   
type T7 = never
Try
ConstructorParameters<Type>
Released:
3.1
Constructs a tuple or array type from the types of a constructor function type. It produces a tuple type with all the parameter types (or the type never if Type is not a function).
Example
type T0 = ConstructorParameters<ErrorConstructor>;
   
type T0 = [message?: string]
type T1 = ConstructorParameters<FunctionConstructor>;
   
type T1 = string[]
type T2 = ConstructorParameters<RegExpConstructor>;
   
type T2 = [pattern: string | RegExp, flags?: string]
class C {
 constructor(a: number, b: string) {}
}
type T3 = ConstructorParameters<typeof C>;
   
type T3 = [a: number, b: string]
type T4 = ConstructorParameters<any>;
   
type T4 = unknown[]
 
type T5 = ConstructorParameters<Function>;
Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
  Type 'Function' provides no match for the signature 'new (...args: any): any'.
   
type T5 = never
Try
ReturnType<Type>
Released:
2.8
Constructs a type consisting of the return type of function Type.
For overloaded functions, this will be the return type of the last signature; see Inferring Within Conditional Types.
Example
declare function f1(): { a: number; b: string };
 
type T0 = ReturnType<() => string>;
   
type T0 = string
type T1 = ReturnType<(s: string) => void>;
   
type T1 = void
type T2 = ReturnType<<T>() => T>;
   
type T2 = unknown
type T3 = ReturnType<<T extends U, U extends number[]>() => T>;
   
type T3 = number[]
type T4 = ReturnType<typeof f1>;
   
type T4 = {
    a: number;
    b: string;
}
type T5 = ReturnType<any>;
   
type T5 = any
type T6 = ReturnType<never>;
   
type T6 = never
type T7 = ReturnType<string>;
Type 'string' does not satisfy the constraint '(...args: any) => any'.
   
type T7 = any
type T8 = ReturnType<Function>;
Type 'Function' does not satisfy the constraint '(...args: any) => any'.
  Type 'Function' provides no match for the signature '(...args: any): any'.
   
type T8 = any
Try
InstanceType<Type>
Released:
2.8
Constructs a type consisting of the instance type of a constructor function in Type.
Example
class C {
 x = 0;
 y = 0;
}
 
type T0 = InstanceType<typeof C>;
   
type T0 = C
type T1 = InstanceType<any>;
   
type T1 = any
type T2 = InstanceType<never>;
   
type T2 = never
type T3 = InstanceType<string>;
Type 'string' does not satisfy the constraint 'abstract new (...args: any) => any'.
   
type T3 = any
type T4 = InstanceType<Function>;
Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
  Type 'Function' provides no match for the signature 'new (...args: any): any'.
   
type T4 = any
Try
NoInfer<Type>
Released:
5.4
Blocks inferences to the contained type. Other than blocking inferences, NoInfer<Type> is identical to Type.
Example
function createStreetLight<C extends string>(
 colors: C[],
 defaultColor?: NoInfer<C>,
) {
 // ...
}
createStreetLight(["red", "yellow", "green"], "red");  // OK
createStreetLight(["red", "yellow", "green"], "blue");  // Error
ThisParameterType<Type>
Released:
3.3
Extracts the type of the this parameter for a function type, or unknown if the function type has no this parameter.
Example
function toHex(this: Number) {
 return this.toString(16);
}
 
function numberToString(n: ThisParameterType<typeof toHex>) {
 return toHex.apply(n);
}
Try
OmitThisParameter<Type>
Released:
3.3
Removes the this parameter from Type. If Type has no explicitly declared this parameter, the result is simply Type. Otherwise, a new function type with no this parameter is created from Type. Generics are erased and only the last overload signature is propagated into the new function type.
Example
function toHex(this: Number) {
 return this.toString(16);
}
 
const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);
 
console.log(fiveToHex());
Try
ThisType<Type>
Released:
2.3
This utility does not return a transformed type. Instead, it serves as a marker for a contextual this type. Note that the noImplicitThis flag must be enabled to use this utility.
Example
type ObjectDescriptor<D, M> = {
 data?: D;
 methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};
 
function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
 let data: object = desc.data || {};
 let methods: object = desc.methods || {};
 return { ...data, ...methods } as D & M;
}
 
let obj = makeObject({
 data: { x: 0, y: 0 },
 methods: {
   moveBy(dx: number, dy: number) {
     this.x += dx; // Strongly typed this
     this.y += dy; // Strongly typed this
   },
 },
});
 
obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
Try
In the example above, the methods object in the argument to makeObject has a contextual type that includes ThisType<D & M> and therefore the type of this in methods within the methods object is { x: number, y: number } & { moveBy(dx: number, dy: number): void }. Notice how the type of the methods property simultaneously is an inference target and a source for the this type in methods.
The ThisType<T> marker interface is simply an empty interface declared in lib.d.ts. Beyond being recognized in the contextual type of an object literal, the interface acts like any empty interface.
Intrinsic String Manipulation Types
Uppercase<StringType>
Lowercase<StringType>
Capitalize<StringType>
Uncapitalize<StringType>
To help with string manipulation around template string literals, TypeScript includes a set of types which can be used in string manipulation within the type system. You can find those in the Template Literal Types documentation.
Decorators
NOTE  This document refers to an experimental stage 2 decorators implementation. Stage 3 decorator support is available since Typescript 5.0. See: Decorators in Typescript 5.0
Introduction
With the introduction of Classes in TypeScript and ES6, there now exist certain scenarios that require additional features to support annotating or modifying classes and class members. Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members.
Further Reading (stage 2): A Complete Guide to TypeScript Decorators
To enable experimental support for decorators, you must enable the experimentalDecorators compiler option either on the command line or in your tsconfig.json:
Command Line:
tsc --target ES5 --experimentalDecorators
tsconfig.json:
{
 "compilerOptions": {
   "target": "ES5",
   "experimentalDecorators": true
 }
}
Decorators
A Decorator is a special kind of declaration that can be attached to a class declaration, method, accessor, property, or parameter. Decorators use the form @expression, where expression must evaluate to a function that will be called at runtime with information about the decorated declaration.
For example, given the decorator @sealed we might write the sealed function as follows:
function sealed(target) {
 // do something with 'target' ...
}
Decorator Factories
If we want to customize how a decorator is applied to a declaration, we can write a decorator factory. A Decorator Factory is simply a function that returns the expression that will be called by the decorator at runtime.
We can write a decorator factory in the following fashion:
function color(value: string) {
 // this is the decorator factory, it sets up
 // the returned decorator function
 return function (target) {
   // this is the decorator
   // do something with 'target' and 'value'...
 };
}
Decorator Composition
Multiple decorators can be applied to a declaration, for example on a single line:
@f @g x
Try
On multiple lines:
@f
@g
x
Try
When multiple decorators apply to a single declaration, their evaluation is similar to function composition in mathematics. In this model, when composing functions f and g, the resulting composite (f ∘ g)(x) is equivalent to f(g(x)).
As such, the following steps are performed when evaluating multiple decorators on a single declaration in TypeScript:
The expressions for each decorator are evaluated top-to-bottom.
The results are then called as functions from bottom-to-top.
If we were to use decorator factories, we can observe this evaluation order with the following example:
function first() {
 console.log("first(): factory evaluated");
 return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
   console.log("first(): called");
 };
}
 
function second() {
 console.log("second(): factory evaluated");
 return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
   console.log("second(): called");
 };
}
 
class ExampleClass {
 @first()
 @second()
 method() {}
}
Try
Which would print this output to the console:
first(): factory evaluated
second(): factory evaluated
second(): called
first(): called
Decorator Evaluation
There is a well defined order to how decorators applied to various declarations inside of a class are applied:
Parameter Decorators, followed by Method, Accessor, or Property Decorators are applied for each instance member.
Parameter Decorators, followed by Method, Accessor, or Property Decorators are applied for each static member.
Parameter Decorators are applied for the constructor.
Class Decorators are applied for the class.
Class Decorators
A Class Decorator is declared just before a class declaration. The class decorator is applied to the constructor of the class and can be used to observe, modify, or replace a class definition. A class decorator cannot be used in a declaration file, or in any other ambient context (such as on a declare class).
The expression for the class decorator will be called as a function at runtime, with the constructor of the decorated class as its only argument.
If the class decorator returns a value, it will replace the class declaration with the provided constructor function.
NOTE  Should you choose to return a new constructor function, you must take care to maintain the original prototype. The logic that applies decorators at runtime will not do this for you.
The following is an example of a class decorator (@sealed) applied to a BugReport class:
@sealed
class BugReport {
 type = "report";
 title: string;
 
 constructor(t: string) {
   this.title = t;
 }
}
Try
We can define the @sealed decorator using the following function declaration:
function sealed(constructor: Function) {
 Object.seal(constructor);
 Object.seal(constructor.prototype);
}
When @sealed is executed, it will seal both the constructor and its prototype, and will therefore prevent any further functionality from being added to or removed from this class during runtime by accessing BugReport.prototype or by defining properties on BugReport itself (note that ES2015 classes are really just syntactic sugar to prototype-based constructor functions). This decorator does not prevent classes from sub-classing BugReport.
Next we have an example of how to override the constructor to set new defaults.
function reportableClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
 return class extends constructor {
   reportingURL = "http://www...";
 };
}
 
@reportableClassDecorator
class BugReport {
 type = "report";
 title: string;
 
 constructor(t: string) {
   this.title = t;
 }
}
 
const bug = new BugReport("Needs dark mode");
console.log(bug.title); // Prints "Needs dark mode"
console.log(bug.type); // Prints "report"
 
// Note that the decorator _does not_ change the TypeScript type
// and so the new property `reportingURL` is not known
// to the type system:
bug.reportingURL;
Property 'reportingURL' does not exist on type 'BugReport'.
Try
Method Decorators
A Method Decorator is declared just before a method declaration. The decorator is applied to the Property Descriptor for the method, and can be used to observe, modify, or replace a method definition. A method decorator cannot be used in a declaration file, on an overload, or in any other ambient context (such as in a declare class).
The expression for the method decorator will be called as a function at runtime, with the following three arguments:
Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
The name of the member.
The Property Descriptor for the member.
NOTE  The Property Descriptor will be undefined if your script target is less than ES5.
If the method decorator returns a value, it will be used as the Property Descriptor for the method.
NOTE  The return value is ignored if your script target is less than ES5.
The following is an example of a method decorator (@enumerable) applied to a method on the Greeter class:
class Greeter {
 greeting: string;
 constructor(message: string) {
   this.greeting = message;
 }
 
 @enumerable(false)
 greet() {
   return "Hello, " + this.greeting;
 }
}
Try
We can define the @enumerable decorator using the following function declaration:
function enumerable(value: boolean) {
 return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
   descriptor.enumerable = value;
 };
}
Try
The @enumerable(false) decorator here is a decorator factory. When the @enumerable(false) decorator is called, it modifies the enumerable property of the property descriptor.
Accessor Decorators
An Accessor Decorator is declared just before an accessor declaration. The accessor decorator is applied to the Property Descriptor for the accessor and can be used to observe, modify, or replace an accessor’s definitions. An accessor decorator cannot be used in a declaration file, or in any other ambient context (such as in a declare class).
NOTE  TypeScript disallows decorating both the get and set accessor for a single member. Instead, all decorators for the member must be applied to the first accessor specified in document order. This is because decorators apply to a Property Descriptor, which combines both the get and set accessor, not each declaration separately.
The expression for the accessor decorator will be called as a function at runtime, with the following three arguments:
Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
The name of the member.
The Property Descriptor for the member.
NOTE  The Property Descriptor will be undefined if your script target is less than ES5.
If the accessor decorator returns a value, it will be used as the Property Descriptor for the member.
NOTE  The return value is ignored if your script target is less than ES5.
The following is an example of an accessor decorator (@configurable) applied to a member of the Point class:
class Point {
 private _x: number;
 private _y: number;
 constructor(x: number, y: number) {
   this._x = x;
   this._y = y;
 }
 
 @configurable(false)
 get x() {
   return this._x;
 }
 
 @configurable(false)
 get y() {
   return this._y;
 }
}
Try
We can define the @configurable decorator using the following function declaration:
function configurable(value: boolean) {
 return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
   descriptor.configurable = value;
 };
}
Property Decorators
A Property Decorator is declared just before a property declaration. A property decorator cannot be used in a declaration file, or in any other ambient context (such as in a declare class).
The expression for the property decorator will be called as a function at runtime, with the following two arguments:
Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
The name of the member.
NOTE  A Property Descriptor is not provided as an argument to a property decorator due to how property decorators are initialized in TypeScript. This is because there is currently no mechanism to describe an instance property when defining members of a prototype, and no way to observe or modify the initializer for a property. The return value is ignored too. As such, a property decorator can only be used to observe that a property of a specific name has been declared for a class.
We can use this information to record metadata about the property, as in the following example:
class Greeter {
 @format("Hello, %s")
 greeting: string;
 constructor(message: string) {
   this.greeting = message;
 }
 greet() {
   let formatString = getFormat(this, "greeting");
   return formatString.replace("%s", this.greeting);
 }
}
We can then define the @format decorator and getFormat functions using the following function declarations:
import "reflect-metadata";
const formatMetadataKey = Symbol("format");
function format(formatString: string) {
 return Reflect.metadata(formatMetadataKey, formatString);
}
function getFormat(target: any, propertyKey: string) {
 return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}
The @format("Hello, %s") decorator here is a decorator factory. When @format("Hello, %s") is called, it adds a metadata entry for the property using the Reflect.metadata function from the reflect-metadata library. When getFormat is called, it reads the metadata value for the format.
NOTE  This example requires the reflect-metadata library. See Metadata for more information about the reflect-metadata library.
Parameter Decorators
A Parameter Decorator is declared just before a parameter declaration. The parameter decorator is applied to the function for a class constructor or method declaration. A parameter decorator cannot be used in a declaration file, an overload, or in any other ambient context (such as in a declare class).
The expression for the parameter decorator will be called as a function at runtime, with the following three arguments:
Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
The name of the member.
The ordinal index of the parameter in the function’s parameter list.
NOTE  A parameter decorator can only be used to observe that a parameter has been declared on a method.
The return value of the parameter decorator is ignored.
The following is an example of a parameter decorator (@required) applied to parameter of a member of the BugReport class:
class BugReport {
 type = "report";
 title: string;
 
 constructor(t: string) {
   this.title = t;
 }
 
 @validate
 print(@required verbose: boolean) {
   if (verbose) {
     return `type: ${this.type}\ntitle: ${this.title}`;
   } else {
    return this.title;
   }
 }
}
Try
We can then define the @required and @validate decorators using the following function declarations:
import "reflect-metadata";
const requiredMetadataKey = Symbol("required");
 
function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
 let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
 existingRequiredParameters.push(parameterIndex);
 Reflect.defineMetadata( requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}
 
function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
 let method = descriptor.value!;
 
 descriptor.value = function () {
   let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
   if (requiredParameters) {
     for (let parameterIndex of requiredParameters) {
       if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
         throw new Error("Missing required argument.");
       }
     }
   }
   return method.apply(this, arguments);
 };
}
Try
The @required decorator adds a metadata entry that marks the parameter as required. The @validate decorator then wraps the existing print method in a function that validates the arguments before invoking the original method.
NOTE  This example requires the reflect-metadata library. See Metadata for more information about the reflect-metadata library.
Metadata
Some examples use the reflect-metadata library which adds a polyfill for an experimental metadata API. This library is not yet part of the ECMAScript (JavaScript) standard. However, once decorators are officially adopted as part of the ECMAScript standard these extensions will be proposed for adoption.
You can install this library via npm:
npm i reflect-metadata --save
TypeScript includes experimental support for emitting certain types of metadata for declarations that have decorators. To enable this experimental support, you must set the emitDecoratorMetadata compiler option either on the command line or in your tsconfig.json:
Command Line:
tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata
tsconfig.json:
{
 "compilerOptions": {
   "target": "ES5",
   "experimentalDecorators": true,
   "emitDecoratorMetadata": true
 }
}
When enabled, as long as the reflect-metadata library has been imported, additional design-time type information will be exposed at runtime.
We can see this in action in the following example:
import "reflect-metadata";
 
class Point {
 constructor(public x: number, public y: number) {}
}
 
class Line {
 private _start: Point;
 private _end: Point;
 
 @validate
 set start(value: Point) {
   this._start = value;
 }
 
 get start() {
   return this._start;
 }
 
 @validate
 set end(value: Point) {
   this._end = value;
 }
 
 get end() {
   return this._end;
 }
}
 
function validate<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
 let set = descriptor.set!;
  descriptor.set = function (value: T) {
   let type = Reflect.getMetadata("design:type", target, propertyKey);
 
   if (!(value instanceof type)) {
     throw new TypeError(`Invalid type, got ${typeof value} not ${type.name}.`);
   }
 
   set.call(this, value);
 };
}
 
const line = new Line()
line.start = new Point(0, 0)
 
// @ts-ignore
// line.end = {}
 
// Fails at runtime with:
// > Invalid type, got object not Point
 
Try
The TypeScript compiler will inject design-time type information using the @Reflect.metadata decorator. You could consider it the equivalent of the following TypeScript:
class Line {
 private _start: Point;
 private _end: Point;
 @validate
 @Reflect.metadata("design:type", Point)
 set start(value: Point) {
   this._start = value;
 }
 get start() {
   return this._start;
 }
 @validate
 @Reflect.metadata("design:type", Point)
 set end(value: Point) {
   this._end = value;
 }
 get end() {
   return this._end;
 }
}
NOTE  Decorator metadata is an experimental feature and may introduce breaking changes in future releases.
Declaration Merging
Introduction
Some of the unique concepts in TypeScript describe the shape of JavaScript objects at the type level. One example that is especially unique to TypeScript is the concept of ‘declaration merging’. Understanding this concept will give you an advantage when working with existing JavaScript. It also opens the door to more advanced abstraction concepts.
For the purposes of this article, “declaration merging” means that the compiler merges two separate declarations declared with the same name into a single definition. This merged definition has the features of both of the original declarations. Any number of declarations can be merged; it’s not limited to just two declarations.
Basic Concepts
In TypeScript, a declaration creates entities in at least one of three groups: namespace, type, or value. Namespace-creating declarations create a namespace, which contains names that are accessed using a dotted notation. Type-creating declarations do just that: they create a type that is visible with the declared shape and bound to the given name. Lastly, value-creating declarations create values that are visible in the output JavaScript.
Declaration Type
Namespace
Type
Value
Namespace
X


X
Class


X
X
Enum


X
X
Interface


X


Type Alias


X


Function




X
Variable




X

Understanding what is created with each declaration will help you understand what is merged when you perform a declaration merge.
Merging Interfaces
The simplest, and perhaps most common, type of declaration merging is interface merging. At the most basic level, the merge mechanically joins the members of both declarations into a single interface with the same name.
interface Box {
 height: number;
 width: number;
}
interface Box {
 scale: number;
}
let box: Box = { height: 5, width: 6, scale: 10 };
Non-function members of the interfaces should be unique. If they are not unique, they must be of the same type. The compiler will issue an error if the interfaces both declare a non-function member of the same name, but of different types.
For function members, each function member of the same name is treated as describing an overload of the same function. Of note, too, is that in the case of interface A merging with later interface A, the second interface will have a higher precedence than the first.
That is, in the example:
interface Cloner {
 clone(animal: Animal): Animal;
}
interface Cloner {
 clone(animal: Sheep): Sheep;
}
interface Cloner {
 clone(animal: Dog): Dog;
 clone(animal: Cat): Cat;
}
The three interfaces will merge to create a single declaration as so:
interface Cloner {
 clone(animal: Dog): Dog;
 clone(animal: Cat): Cat;
 clone(animal: Sheep): Sheep;
 clone(animal: Animal): Animal;
}
Notice that the elements of each group maintains the same order, but the groups themselves are merged with later overload sets ordered first.
One exception to this rule is specialized signatures. If a signature has a parameter whose type is a single string literal type (e.g. not a union of string literals), then it will be bubbled toward the top of its merged overload list.
For instance, the following interfaces will merge together:
interface Document {
 createElement(tagName: any): Element;
}
interface Document {
 createElement(tagName: "div"): HTMLDivElement;
 createElement(tagName: "span"): HTMLSpanElement;
}
interface Document {
 createElement(tagName: string): HTMLElement;
 createElement(tagName: "canvas"): HTMLCanvasElement;
}
The resulting merged declaration of Document will be the following:
interface Document {
 createElement(tagName: "canvas"): HTMLCanvasElement;
 createElement(tagName: "div"): HTMLDivElement;
 createElement(tagName: "span"): HTMLSpanElement;
 createElement(tagName: string): HTMLElement;
 createElement(tagName: any): Element;
}
Merging Namespaces
Similarly to interfaces, namespaces of the same name will also merge their members. Since namespaces create both a namespace and a value, we need to understand how both merge.
To merge the namespaces, type definitions from exported interfaces declared in each namespace are themselves merged, forming a single namespace with merged interface definitions inside.
To merge the namespace value, at each declaration site, if a namespace already exists with the given name, it is further extended by taking the existing namespace and adding the exported members of the second namespace to the first.
The declaration merge of Animals in this example:
namespace Animals {
 export class Zebra {}
}
namespace Animals {
 export interface Legged {
   numberOfLegs: number;
 }
 export class Dog {}
}
is equivalent to:
namespace Animals {
 export interface Legged {
   numberOfLegs: number;
 }
 export class Zebra {}
 export class Dog {}
}
This model of namespace merging is a helpful starting place, but we also need to understand what happens with non-exported members. Non-exported members are only visible in the original (un-merged) namespace. This means that after merging, merged members that came from other declarations cannot see non-exported members.
We can see this more clearly in this example:
namespace Animal {
 let haveMuscles = true;
 export function animalsHaveMuscles() {
   return haveMuscles;
 }
}
namespace Animal {
 export function doAnimalsHaveMuscles() {
   return haveMuscles; // Error, because haveMuscles is not accessible here
 }
}
Because haveMuscles is not exported, only the animalsHaveMuscles function that shares the same un-merged namespace can see the symbol. The doAnimalsHaveMuscles function, even though it’s part of the merged Animal namespace can not see this un-exported member.
Merging Namespaces with Classes, Functions, and Enums
Namespaces are flexible enough to also merge with other types of declarations. To do so, the namespace declaration must follow the declaration it will merge with. The resulting declaration has properties of both declaration types. TypeScript uses this capability to model some of the patterns in JavaScript as well as other programming languages.
Merging Namespaces with Classes
This gives the user a way of describing inner classes.
class Album {
 label: Album.AlbumLabel;
}
namespace Album {
 export class AlbumLabel {}
}
The visibility rules for merged members is the same as described in the Merging Namespaces section, so we must export the AlbumLabel class for the merged class to see it. The end result is a class managed inside of another class. You can also use namespaces to add more static members to an existing class.
In addition to the pattern of inner classes, you may also be familiar with the JavaScript practice of creating a function and then extending the function further by adding properties onto the function. TypeScript uses declaration merging to build up definitions like this in a type-safe way.
function buildLabel(name: string): string {
 return buildLabel.prefix + name + buildLabel.suffix;
}
namespace buildLabel {
 export let suffix = "";
 export let prefix = "Hello, ";
}
console.log(buildLabel("Sam Smith"));
Similarly, namespaces can be used to extend enums with static members:
enum Color {
 red = 1,
 green = 2,
 blue = 4,
}
namespace Color {
 export function mixColor(colorName: string) {
   if (colorName == "yellow") {
     return Color.red + Color.green;
   } else if (colorName == "white") {
     return Color.red + Color.green + Color.blue;
   } else if (colorName == "magenta") {
     return Color.red + Color.blue;
   } else if (colorName == "cyan") {
     return Color.green + Color.blue;
   }
 }
}
Disallowed Merges
Not all merges are allowed in TypeScript. Currently, classes can not merge with other classes or with variables. For information on mimicking class merging, see the Mixins in TypeScript section.
Module Augmentation
Although JavaScript modules do not support merging, you can patch existing objects by importing and then updating them. Let’s look at a toy Observable example:
// observable.ts
export class Observable<T> {
 // ... implementation left as an exercise for the reader ...
}
// map.ts
import { Observable } from "./observable";
Observable.prototype.map = function (f) {
 // ... another exercise for the reader
};
This works fine in TypeScript too, but the compiler doesn’t know about Observable.prototype.map. You can use module augmentation to tell the compiler about it:
// observable.ts
export class Observable<T> {
 // ... implementation left as an exercise for the reader ...
}
// map.ts
import { Observable } from "./observable";
declare module "./observable" {
 interface Observable<T> {
   map<U>(f: (x: T) => U): Observable<U>;
 }
}
Observable.prototype.map = function (f) {
 // ... another exercise for the reader
};
// consumer.ts
import { Observable } from "./observable";
import "./map";
let o: Observable<number>;
o.map((x) => x.toFixed());
The module name is resolved the same way as module specifiers in import/export. See Modules for more information. Then the declarations in an augmentation are merged as if they were declared in the same file as the original.
However, there are two limitations to keep in mind:
You can’t declare new top-level declarations in the augmentation — just patches to existing declarations.
Default exports also cannot be augmented, only named exports (since you need to augment an export by its exported name, and default is a reserved word - see #14080 for details)
Global augmentation
You can also add declarations to the global scope from inside a module:
// observable.ts
export class Observable<T> {
 // ... still no implementation ...
}
declare global {
 interface Array<T> {
   toObservable(): Observable<T>;
 }
}
Array.prototype.toObservable = function () {
 // ...
};
Global augmentations have the same behavior and limits as module augmentations.
Enums
Enums are one of the few features TypeScript has which is not a type-level extension of JavaScript.
Enums allow a developer to define a set of named constants. Using enums can make it easier to document intent, or create a set of distinct cases. TypeScript provides both numeric and string-based enums.
Numeric enums
We’ll first start off with numeric enums, which are probably more familiar if you’re coming from other languages. An enum can be defined using the enum keyword.
enum Direction {
 Up = 1,
 Down,
 Left,
 Right,
}
Try
Above, we have a numeric enum where Up is initialized with 1. All of the following members are auto-incremented from that point on. In other words, Direction.Up has the value 1, Down has 2, Left has 3, and Right has 4.
If we wanted, we could leave off the initializers entirely:
enum Direction {
 Up,
 Down,
 Left,
 Right,
}
Try
Here, Up would have the value 0, Down would have 1, etc. This auto-incrementing behavior is useful for cases where we might not care about the member values themselves, but do care that each value is distinct from other values in the same enum.
Using an enum is simple: just access any member as a property off of the enum itself, and declare types using the name of the enum:
enum UserResponse {
 No = 0,
 Yes = 1,
}
 
function respond(recipient: string, message: UserResponse): void {
 // ...
}
 
respond("Princess Caroline", UserResponse.Yes);
Try
Numeric enums can be mixed in computed and constant members (see below). The short story is, enums without initializers either need to be first, or have to come after numeric enums initialized with numeric constants or other constant enum members. In other words, the following isn’t allowed:
enum E {
 A = getSomeValue(),
 B,
Enum member must have initializer.
}
Try
String enums
String enums are a similar concept, but have some subtle runtime differences as documented below. In a string enum, each member has to be constant-initialized with a string literal, or with another string enum member.
enum Direction {
 Up = "UP",
 Down = "DOWN",
 Left = "LEFT",
 Right = "RIGHT",
}
Try
While string enums don’t have auto-incrementing behavior, string enums have the benefit that they “serialize” well. In other words, if you were debugging and had to read the runtime value of a numeric enum, the value is often opaque - it doesn’t convey any useful meaning on its own (though reverse mapping can often help). String enums allow you to give a meaningful and readable value when your code runs, independent of the name of the enum member itself.
Heterogeneous enums
Technically enums can be mixed with string and numeric members, but it’s not clear why you would ever want to do so:
enum BooleanLikeHeterogeneousEnum {
 No = 0,
 Yes = "YES",
}
Try
Unless you’re really trying to take advantage of JavaScript’s runtime behavior in a clever way, it’s advised that you don’t do this.
Computed and constant members
Each enum member has a value associated with it which can be either constant or computed. An enum member is considered constant if:
It is the first member in the enum and it has no initializer, in which case it’s assigned the value 0:
// E.X is constant:
enum E {
  X,
}
Try
It does not have an initializer and the preceding enum member was a numeric constant. In this case the value of the current enum member will be the value of the preceding enum member plus one.
// All enum members in 'E1' and 'E2' are constant.
 
enum E1 {
  X,
  Y,
  Z,
}
 
enum E2 {
  A = 1,
  B,
  C,
}
Try
The enum member is initialized with a constant enum expression. A constant enum expression is a subset of TypeScript expressions that can be fully evaluated at compile time. An expression is a constant enum expression if it is:
a literal enum expression (basically a string literal or a numeric literal)
a reference to previously defined constant enum member (which can originate from a different enum)
a parenthesized constant enum expression
one of the +, -, ~ unary operators applied to constant enum expression
+, -, *, /, %, <<, >>, >>>, &, |, ^ binary operators with constant enum expressions as operands
It is a compile time error for constant enum expressions to be evaluated to NaN or Infinity.
In all other cases enum member is considered computed.
enum FileAccess {
 // constant members
 None,
 Read = 1 << 1,
 Write = 1 << 2,
 ReadWrite = Read | Write,
 // computed member
 G = "123".length,
}
Try
Union enums and enum member types
There is a special subset of constant enum members that aren’t calculated: literal enum members. A literal enum member is a constant enum member with no initialized value, or with values that are initialized to
any string literal (e.g. "foo", "bar", "baz")
any numeric literal (e.g. 1, 100)
a unary minus applied to any numeric literal (e.g. -1, -100)
When all members in an enum have literal enum values, some special semantics come into play.
The first is that enum members also become types as well! For example, we can say that certain members can only have the value of an enum member:
enum ShapeKind {
 Circle,
 Square,
}
 
interface Circle {
 kind: ShapeKind.Circle;
 radius: number;
}
 
interface Square {
 kind: ShapeKind.Square;
 sideLength: number;
}
 
let c: Circle = {
 kind: ShapeKind.Square,
Type 'ShapeKind.Square' is not assignable to type 'ShapeKind.Circle'.
 radius: 100,
};
Try
The other change is that enum types themselves effectively become a union of each enum member. With union enums, the type system is able to leverage the fact that it knows the exact set of values that exist in the enum itself. Because of that, TypeScript can catch bugs where we might be comparing values incorrectly. For example:
enum E {
 Foo,
 Bar,
}
 
function f(x: E) {
 if (x !== E.Foo || x !== E.Bar) {
This comparison appears to be unintentional because the types 'E.Foo' and 'E.Bar' have no overlap.
   //
 }
}
Try
In that example, we first checked whether x was not E.Foo. If that check succeeds, then our || will short-circuit, and the body of the ‘if’ will run. However, if the check didn’t succeed, then x can only be E.Foo, so it doesn’t make sense to see whether it’s not equal to E.Bar.
Enums at runtime
Enums are real objects that exist at runtime. For example, the following enum
enum E {
 X,
 Y,
 Z,
}
Try
can actually be passed around to functions
enum E {
 X,
 Y,
 Z,
}
 
function f(obj: { X: number }) {
 return obj.X;
}
 
// Works, since 'E' has a property named 'X' which is a number.
f(E);
Try
Enums at compile time
Even though Enums are real objects that exist at runtime, the keyof keyword works differently than you might expect for typical objects. Instead, use keyof typeof to get a Type that represents all Enum keys as strings.
enum LogLevel {
 ERROR,
 WARN,
 INFO,
 DEBUG,
}
 
/**
* This is equivalent to:
* type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
*/
type LogLevelStrings = keyof typeof LogLevel;
 
function printImportant(key: LogLevelStrings, message: string) {
 const num = LogLevel[key];
 if (num <= LogLevel.WARN) {
   console.log("Log level key is:", key);
   console.log("Log level value is:", num);
   console.log("Log level message is:", message);
 }
}
printImportant("ERROR", "This is a message");
Try
Reverse mappings
In addition to creating an object with property names for members, numeric enums members also get a reverse mapping from enum values to enum names. For example, in this example:
enum Enum {
 A,
}
 
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
Try
TypeScript compiles this down to the following JavaScript:
"use strict";
var Enum;
(function (Enum) {
   Enum[Enum["A"] = 0] = "A";
})(Enum || (Enum = {}));
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
 
Try
In this generated code, an enum is compiled into an object that stores both forward (name -> value) and reverse (value -> name) mappings. References to other enum members are always emitted as property accesses and never inlined.
Keep in mind that string enum members do not get a reverse mapping generated at all.
const enums
In most cases, enums are a perfectly valid solution. However sometimes requirements are tighter. To avoid paying the cost of extra generated code and additional indirection when accessing enum values, it’s possible to use const enums. Const enums are defined using the const modifier on our enums:
const enum Enum {
 A = 1,
 B = A * 2,
}
Try
Const enums can only use constant enum expressions and unlike regular enums they are completely removed during compilation. Const enum members are inlined at use sites. This is possible since const enums cannot have computed members.
const enum Direction {
 Up,
 Down,
 Left,
 Right,
}
 
let directions = [
 Direction.Up,
 Direction.Down,
 Direction.Left,
 Direction.Right,
];
Try
in generated code will become
"use strict";
let directions = [
   0 /* Direction.Up */,
   1 /* Direction.Down */,
   2 /* Direction.Left */,
   3 /* Direction.Right */,
];
 
Try
Const enum pitfalls
Inlining enum values is straightforward at first, but comes with subtle implications. These pitfalls pertain to ambient const enums only (basically const enums in .d.ts files) and sharing them between projects, but if you are publishing or consuming .d.ts files, these pitfalls likely apply to you, because tsc --declaration transforms .ts files into .d.ts files.
For the reasons laid out in the isolatedModules documentation, that mode is fundamentally incompatible with ambient const enums. This means if you publish ambient const enums, downstream consumers will not be able to use isolatedModules and those enum values at the same time.
You can easily inline values from version A of a dependency at compile time, and import version B at runtime. Version A and B’s enums can have different values, if you are not very careful, resulting in surprising bugs, like taking the wrong branches of if statements. These bugs are especially pernicious because it is common to run automated tests at roughly the same time as projects are built, with the same dependency versions, which misses these bugs completely.
importsNotUsedAsValues: "preserve" will not elide imports for const enums used as values, but ambient const enums do not guarantee that runtime .js files exist. The unresolvable imports cause errors at runtime. The usual way to unambiguously elide imports, type-only imports, does not allow const enum values, currently.
Here are two approaches to avoiding these pitfalls:
Do not use const enums at all. You can easily ban const enums with the help of a linter. Obviously this avoids any issues with const enums, but prevents your project from inlining its own enums. Unlike inlining enums from other projects, inlining a project’s own enums is not problematic and has performance implications.
Do not publish ambient const enums, by deconstifying them with the help of preserveConstEnums. This is the approach taken internally by the TypeScript project itself. preserveConstEnums emits the same JavaScript for const enums as plain enums. You can then safely strip the const modifier from .d.ts files in a build step.
This way downstream consumers will not inline enums from your project, avoiding the pitfalls above, but a project can still inline its own enums, unlike banning const enums entirely.
Ambient enums
Ambient enums are used to describe the shape of already existing enum types.
declare enum Enum {
 A = 1,
 B,
 C = 2,
}
Try
One important difference between ambient and non-ambient enums is that, in regular enums, members that don’t have an initializer will be considered constant if its preceding enum member is considered constant. By contrast, an ambient (and non-const) enum member that does not have an initializer is always considered computed.
Objects vs Enums
In modern TypeScript, you may not need an enum when an object with as const could suffice:
const enum EDirection {
 Up,
 Down,
 Left,
 Right,
}
 
const ODirection = {
 Up: 0,
 Down: 1,
 Left: 2,
 Right: 3,
} as const;
 
EDirection.Up;
         
(enum member) EDirection.Up = 0
 
ODirection.Up;
         
(property) Up: 0
 
// Using the enum as a parameter
function walk(dir: EDirection) {}
 
// It requires an extra line to pull out the values
type Direction = typeof ODirection[keyof typeof ODirection];
function run(dir: Direction) {}
 
walk(EDirection.Left);
run(ODirection.Right);
Try
The biggest argument in favour of this format over TypeScript’s enum is that it keeps your codebase aligned with the state of JavaScript, and when/if enums are added to JavaScript then you can move to the additional syntax.
Iterators and Generators
Iterables
An object is deemed iterable if it has an implementation for the Symbol.iterator property. Some built-in types like Array, Map, Set, String, Int32Array, Uint32Array, etc. have their Symbol.iterator property already implemented. Symbol.iterator function on an object is responsible for returning the list of values to iterate on.
Iterable interface
Iterable is a type we can use if we want to take in types listed above which are iterable. Here is an example:
function toArray<X>(xs: Iterable<X>): X[] {
 return [...xs]
}
for..of statements
for..of loops over an iterable object, invoking the Symbol.iterator property on the object. Here is a simple for..of loop on an array:
let someArray = [1, "string", false];
for (let entry of someArray) {
 console.log(entry); // 1, "string", false
}
for..of vs. for..in statements
Both for..of and for..in statements iterate over lists; the values iterated on are different though, for..in returns a list of keys on the object being iterated, whereas for..of returns a list of values of the numeric properties of the object being iterated.
Here is an example that demonstrates this distinction:
let list = [4, 5, 6];
for (let i in list) {
 console.log(i); // "0", "1", "2",
}
for (let i of list) {
 console.log(i); // 4, 5, 6
}
Another distinction is that for..in operates on any object; it serves as a way to inspect properties on this object. for..of on the other hand, is mainly interested in values of iterable objects. Built-in objects like Map and Set implement Symbol.iterator property allowing access to stored values.
let pets = new Set(["Cat", "Dog", "Hamster"]);
pets["species"] = "mammals";
for (let pet in pets) {
 console.log(pet); // "species"
}
for (let pet of pets) {
 console.log(pet); // "Cat", "Dog", "Hamster"
}
Code generation
Targeting ES5
When targeting an ES5-compliant engine, iterators are only allowed on values of Array type. It is an error to use for..of loops on non-Array values, even if these non-Array values implement the Symbol.iterator property.
The compiler will generate a simple for loop for a for..of loop, for instance:
let numbers = [1, 2, 3];
for (let num of numbers) {
 console.log(num);
}
will be generated as:
var numbers = [1, 2, 3];
for (var _i = 0; _i < numbers.length; _i++) {
 var num = numbers[_i];
 console.log(num);
}
Targeting ECMAScript 2015 and higher
When targeting an ECMAScript 2015-compliant engine, the compiler will generate for..of loops to target the built-in iterator implementation in the engine.
JSX
JSX is an embeddable XML-like syntax. It is meant to be transformed into valid JavaScript, though the semantics of that transformation are implementation-specific. JSX rose to popularity with the React framework, but has since seen other implementations as well. TypeScript supports embedding, type checking, and compiling JSX directly to JavaScript.
Basic usage
In order to use JSX you must do two things.
Name your files with a .tsx extension
Enable the jsx option
TypeScript ships with several JSX modes: preserve, react (classic runtime), react-jsx (automatic runtime), react-jsxdev (automatic development runtime), and react-native. The preserve mode will keep the JSX as part of the output to be further consumed by another transform step (e.g. Babel). Additionally the output will have a .jsx file extension. The react mode will emit React.createElement, does not need to go through a JSX transformation before use, and the output will have a .js file extension. The react-native mode is the equivalent of preserve in that it keeps all JSX, but the output will instead have a .js file extension.
Mode
Input
Output
Output File Extension
preserve
<div />
<div />
.jsx
react
<div />
React.createElement("div")
.js
react-native
<div />
<div />
.js
react-jsx
<div />
_jsx("div", {}, void 0);
.js
react-jsxdev
<div />
_jsxDEV("div", {}, void 0, false, {...}, this);
.js

You can specify this mode using either the jsx command line flag or the corresponding option jsx in your tsconfig.json file.
*Note: You can specify the JSX factory function to use when targeting react JSX emit with jsxFactory option (defaults to React.createElement)
The as operator
Recall how to write a type assertion:
const foo = <Foo>bar;
This asserts the variable bar to have the type Foo. Since TypeScript also uses angle brackets for type assertions, combining it with JSX’s syntax would introduce certain parsing difficulties. As a result, TypeScript disallows angle bracket type assertions in .tsx files.
Since the above syntax cannot be used in .tsx files, an alternate type assertion operator should be used: as. The example can easily be rewritten with the as operator.
const foo = bar as Foo;
The as operator is available in both .ts and .tsx files, and is identical in behavior to the angle-bracket type assertion style.
Type Checking
In order to understand type checking with JSX, you must first understand the difference between intrinsic elements and value-based elements. Given a JSX expression <expr />, expr may either refer to something intrinsic to the environment (e.g. a div or span in a DOM environment) or to a custom component that you’ve created. This is important for two reasons:
For React, intrinsic elements are emitted as strings (React.createElement("div")), whereas a component you’ve created is not (React.createElement(MyComponent)).
The types of the attributes being passed in the JSX element should be looked up differently. Intrinsic element attributes should be known intrinsically whereas components will likely want to specify their own set of attributes.
TypeScript uses the same convention that React does for distinguishing between these. An intrinsic element always begins with a lowercase letter, and a value-based element always begins with an uppercase letter.
The JSX namespace
JSX in TypeScript is typed by the JSX namespace. The JSX namespace may be defined in various places, depending on the jsx compiler option.
The jsx options preserve, react, and react-native use the type definitions for classic runtime. This means a variable needs to be in scope that’s determined by the jsxFactory compiler option. The JSX namespace should be specified on the top-most identifier of the JSX factory. For example, React uses the default factory React.createElement. This means its JSX namespace should be defined as React.JSX.
export function createElement(): any;
export namespace JSX {
 // …
}
And the user should always import React as React.
import * as React from 'react';
Preact uses the JSX factory h. That means its types should be defined as the h.JSX.
export function h(props: any): any;
export namespace h.JSX {
 // …
}
The user should use a named import to import h.
import { h } from 'preact';
For the jsx options react-jsx and react-jsxdev, the JSX namespace should be exported from the matching entry points. For react-jsx this is ${jsxImportSource}/jsx-runtime. For react-jsxdev, this is ${jsxImportSource}/jsx-dev-runtime. Since these don’t use a file extension, you must use the exports field in package.json map in order to support ESM users.
{
 "exports": {
   "./jsx-runtime": "./jsx-runtime.js",
   "./jsx-dev-runtime": "./jsx-dev-runtime.js",
 }
}
Then in jsx-runtime.d.ts and jsx-dev-runtime.d.ts:
export namespace JSX {
 // …
}
Note that while exporting the JSX namespace is sufficient for type checking, the production runtime needs the jsx, jsxs, and Fragment exports at runtime, and the development runtime needs jsxDEV and Fragment. Ideally you add types for those too.
If the JSX namespace isn’t available in the appropriate location, both the classic and the automatic runtime fall back to the global JSX namespace.
Intrinsic elements
Intrinsic elements are looked up on the special interface JSX.IntrinsicElements. By default, if this interface is not specified, then anything goes and intrinsic elements will not be type checked. However, if this interface is present, then the name of the intrinsic element is looked up as a property on the JSX.IntrinsicElements interface. For example:
declare namespace JSX {
 interface IntrinsicElements {
   foo: any;
 }
}
<foo />; // ok
<bar />; // error
In the above example, <foo /> will work fine but <bar /> will result in an error since it has not been specified on JSX.IntrinsicElements.
Note: You can also specify a catch-all string indexer on JSX.IntrinsicElements as follows:
declare namespace JSX {
 interface IntrinsicElements {
   [elemName: string]: any;
 }
}
Value-based elements
Value-based elements are simply looked up by identifiers that are in scope.
import MyComponent from "./myComponent";
<MyComponent />; // ok
<SomeOtherComponent />; // error
There are two ways to define a value-based element:
Function Component (FC)
Class Component
Because these two types of value-based elements are indistinguishable from each other in a JSX expression, first TS tries to resolve the expression as a Function Component using overload resolution. If the process succeeds, then TS finishes resolving the expression to its declaration. If the value fails to resolve as a Function Component, TS will then try to resolve it as a class component. If that fails, TS will report an error.
Function Component
As the name suggests, the component is defined as a JavaScript function where its first argument is a props object. TS enforces that its return type must be assignable to JSX.Element.
interface FooProp {
 name: string;
 X: number;
 Y: number;
}
declare function AnotherComponent(prop: { name: string });
function ComponentFoo(prop: FooProp) {
 return <AnotherComponent name={prop.name} />;
}
const Button = (prop: { value: string }, context: { color: string }) => (
 <button />
);
Because a Function Component is simply a JavaScript function, function overloads may be used here as well:
interface ClickableProps {
 children: JSX.Element[] | JSX.Element;
}
 
interface HomeProps extends ClickableProps {
 home: JSX.Element;
}
 
interface SideProps extends ClickableProps {
 side: JSX.Element | string;
}
 
function MainButton(prop: HomeProps): JSX.Element;
function MainButton(prop: SideProps): JSX.Element;
function MainButton(prop: ClickableProps): JSX.Element {
 // ...
}
Try
Note: Function Components were formerly known as Stateless Function Components (SFC). As Function Components can no longer be considered stateless in recent versions of react, the type SFC and its alias StatelessComponent were deprecated.
Class Component
It is possible to define the type of a class component. However, to do so it is best to understand two new terms: the element class type and the element instance type.
Given <Expr />, the element class type is the type of Expr. So in the example above, if MyComponent was an ES6 class the class type would be that class’s constructor and statics. If MyComponent was a factory function, the class type would be that function.
Once the class type is established, the instance type is determined by the union of the return types of the class type’s construct or call signatures (whichever is present). So again, in the case of an ES6 class, the instance type would be the type of an instance of that class, and in the case of a factory function, it would be the type of the value returned from the function.
class MyComponent {
 render() {}
}
// use a construct signature
const myComponent = new MyComponent();
// element class type => MyComponent
// element instance type => { render: () => void }
function MyFactoryFunction() {
 return {
   render: () => {},
 };
}
// use a call signature
const myComponent = MyFactoryFunction();
// element class type => MyFactoryFunction
// element instance type => { render: () => void }
The element instance type is interesting because it must be assignable to JSX.ElementClass or it will result in an error. By default JSX.ElementClass is {}, but it can be augmented to limit the use of JSX to only those types that conform to the proper interface.
declare namespace JSX {
 interface ElementClass {
   render: any;
 }
}
class MyComponent {
 render() {}
}
function MyFactoryFunction() {
 return { render: () => {} };
}
<MyComponent />; // ok
<MyFactoryFunction />; // ok
class NotAValidComponent {}
function NotAValidFactoryFunction() {
 return {};
}
<NotAValidComponent />; // error
<NotAValidFactoryFunction />; // error
Attribute type checking
The first step to type checking attributes is to determine the element attributes type. This is slightly different between intrinsic and value-based elements.
For intrinsic elements, it is the type of the property on JSX.IntrinsicElements
declare namespace JSX {
 interface IntrinsicElements {
   foo: { bar?: boolean };
 }
}
// element attributes type for 'foo' is '{bar?: boolean}'
<foo bar />;
For value-based elements, it is a bit more complex. It is determined by the type of a property on the element instance type that was previously determined. Which property to use is determined by JSX.ElementAttributesProperty. It should be declared with a single property. The name of that property is then used. As of TypeScript 2.8, if JSX.ElementAttributesProperty is not provided, the type of first parameter of the class element’s constructor or Function Component’s call will be used instead.
declare namespace JSX {
 interface ElementAttributesProperty {
   props; // specify the property name to use
 }
}
class MyComponent {
 // specify the property on the element instance type
 props: {
   foo?: string;
 };
}
// element attributes type for 'MyComponent' is '{foo?: string}'
<MyComponent foo="bar" />;
The element attribute type is used to type check the attributes in the JSX. Optional and required properties are supported.
declare namespace JSX {
 interface IntrinsicElements {
   foo: { requiredProp: string; optionalProp?: number };
 }
}
<foo requiredProp="bar" />; // ok
<foo requiredProp="bar" optionalProp={0} />; // ok
<foo />; // error, requiredProp is missing
<foo requiredProp={0} />; // error, requiredProp should be a string
<foo requiredProp="bar" unknownProp />; // error, unknownProp does not exist
<foo requiredProp="bar" some-unknown-prop />; // ok, because 'some-unknown-prop' is not a valid identifier
Note: If an attribute name is not a valid JS identifier (like a data-* attribute), it is not considered to be an error if it is not found in the element attributes type.
Additionally, the JSX.IntrinsicAttributes interface can be used to specify extra properties used by the JSX framework which are not generally used by the components’ props or arguments - for instance key in React. Specializing further, the generic JSX.IntrinsicClassAttributes<T> type may also be used to specify the same kind of extra attributes just for class components (and not Function Components). In this type, the generic parameter corresponds to the class instance type. In React, this is used to allow the ref attribute of type Ref<T>. Generally speaking, all of the properties on these interfaces should be optional, unless you intend that users of your JSX framework need to provide some attribute on every tag.
The spread operator also works:
const props = { requiredProp: "bar" };
<foo {...props} />; // ok
const badProps = {};
<foo {...badProps} />; // error
Children Type Checking
In TypeScript 2.3, TS introduced type checking of children. children is a special property in an element attributes type where child JSXExpressions are taken to be inserted into the attributes. Similar to how TS uses JSX.ElementAttributesProperty to determine the name of props, TS uses JSX.ElementChildrenAttribute to determine the name of children within those props. JSX.ElementChildrenAttribute should be declared with a single property.
declare namespace JSX {
 interface ElementChildrenAttribute {
   children: {}; // specify children name to use
 }
}
<div>
 <h1>Hello</h1>
</div>;
<div>
 <h1>Hello</h1>
 World
</div>;
const CustomComp = (props) => <div>{props.children}</div>
<CustomComp>
 <div>Hello World</div>
 {"This is just a JS expression..." + 1000}
</CustomComp>
You can specify the type of children like any other attribute. This will override the default type from, e.g. the React typings if you use them.
interface PropsType {
 children: JSX.Element
 name: string
}
class Component extends React.Component<PropsType, {}> {
 render() {
   return (
     <h2>
       {this.props.children}
     </h2>
   )
 }
}
// OK
<Component name="foo">
 <h1>Hello World</h1>
</Component>
// Error: children is of type JSX.Element not array of JSX.Element
<Component name="bar">
 <h1>Hello World</h1>
 <h2>Hello World</h2>
</Component>
// Error: children is of type JSX.Element not array of JSX.Element or string.
<Component name="baz">
 <h1>Hello</h1>
 World
</Component>
The JSX result type
By default the result of a JSX expression is typed as any. You can customize the type by specifying the JSX.Element interface. However, it is not possible to retrieve type information about the element, attributes or children of the JSX from this interface. It is a black box.
The JSX function return type
By default, function components must return JSX.Element | null. However, this doesn’t always represent runtime behaviour. As of TypeScript 5.1, you can specify JSX.ElementType to override what is a valid JSX component type. Note that this doesn’t define what props are valid. The type of props is always defined by the first argument of the component that’s passed. The default looks something like this:
namespace JSX {
   export type ElementType =
       // All the valid lowercase tags
       | keyof IntrinsicElements
       // Function components
       | (props: any) => Element
       // Class components
       | new (props: any) => ElementClass;
   export interface IntrinsicAttributes extends /*...*/ {}
   export type Element = /*...*/;
   export type ElementClass = /*...*/;
}
Embedding Expressions
JSX allows you to embed expressions between tags by surrounding the expressions with curly braces ({ }).
const a = (
 <div>
   {["foo", "bar"].map((i) => (
     <span>{i / 2}</span>
   ))}
 </div>
);
The above code will result in an error since you cannot divide a string by a number. The output, when using the preserve option, looks like:
const a = (
 <div>
   {["foo", "bar"].map(function (i) {
     return <span>{i / 2}</span>;
   })}
 </div>
);
React integration
To use JSX with React you should use the React typings. These typings define the JSX namespace appropriately for use with React.
/// <reference path="react.d.ts" />
interface Props {
 foo: string;
}
class MyComponent extends React.Component<Props, {}> {
 render() {
   return <span>{this.props.foo}</span>;
 }
}
<MyComponent foo="bar" />; // ok
<MyComponent foo={0} />; // error
Configuring JSX
There are multiple compiler flags which can be used to customize your JSX, which work as both a compiler flag and via inline per-file pragmas. To learn more see their tsconfig reference pages:
jsxFactory
jsxFragmentFactory
jsxImportSource
Mixins
Along with traditional OO hierarchies, another popular way of building up classes from reusable components is to build them by combining simpler partial classes. You may be familiar with the idea of mixins or traits for languages like Scala, and the pattern has also reached some popularity in the JavaScript community.
How Does A Mixin Work?
The pattern relies on using generics with class inheritance to extend a base class. TypeScript’s best mixin support is done via the class expression pattern. You can read more about how this pattern works in JavaScript here.
To get started, we’ll need a class which will have the mixins applied on top of:
class Sprite {
 name = "";
 x = 0;
 y = 0;
 
 constructor(name: string) {
   this.name = name;
 }
}
Try
Then you need a type and a factory function which returns a class expression extending the base class.
// To get started, we need a type which we'll use to extend
// other classes from. The main responsibility is to declare
// that the type being passed in is a class.
 
type Constructor = new (...args: any[]) => {};
 
// This mixin adds a scale property, with getters and setters
// for changing it with an encapsulated private property:
 
function Scale<TBase extends Constructor>(Base: TBase) {
 return class Scaling extends Base {
   // Mixins may not declare private/protected properties
   // however, you can use ES2020 private fields
   _scale = 1;
 
   setScale(scale: number) {
     this._scale = scale;
   }
 
   get scale(): number {
     return this._scale;
   }
 };
}
Try
With these all set up, then you can create a class which represents the base class with mixins applied:
// Compose a new class from the Sprite class,
// with the Mixin Scale applier:
const EightBitSprite = Scale(Sprite);
 
const flappySprite = new EightBitSprite("Bird");
flappySprite.setScale(0.8);
console.log(flappySprite.scale);
Try
Constrained Mixins
In the above form, the mixin’s have no underlying knowledge of the class which can make it hard to create the design you want.
To model this, we modify the original constructor type to accept a generic argument.
// This was our previous constructor:
type Constructor = new (...args: any[]) => {};
// Now we use a generic version which can apply a constraint on
// the class which this mixin is applied to
type GConstructor<T = {}> = new (...args: any[]) => T;
Try
This allows for creating classes which only work with constrained base classes:
type Positionable = GConstructor<{ setPos: (x: number, y: number) => void }>;
type Spritable = GConstructor<Sprite>;
type Loggable = GConstructor<{ print: () => void }>;
Try
Then you can create mixins which only work when you have a particular base to build on:
function Jumpable<TBase extends Positionable>(Base: TBase) {
 return class Jumpable extends Base {
   jump() {
     // This mixin will only work if it is passed a base
     // class which has setPos defined because of the
     // Positionable constraint.
     this.setPos(0, 20);
   }
 };
}
Try
Alternative Pattern
Previous versions of this document recommended a way to write mixins where you created both the runtime and type hierarchies separately, then merged them at the end:
// Each mixin is a traditional ES class
class Jumpable {
 jump() {}
}
 
class Duckable {
 duck() {}
}
 
// Including the base
class Sprite {
 x = 0;
 y = 0;
}
 
// Then you create an interface which merges
// the expected mixins with the same name as your base
interface Sprite extends Jumpable, Duckable {}
// Apply the mixins into the base class via
// the JS at runtime
applyMixins(Sprite, [Jumpable, Duckable]);
 
let player = new Sprite();
player.jump();
console.log(player.x, player.y);
 
// This can live anywhere in your codebase:
function applyMixins(derivedCtor: any, constructors: any[]) {
 constructors.forEach((baseCtor) => {
   Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
     Object.defineProperty(
       derivedCtor.prototype,
       name,
       Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
         Object.create(null)
     );
   });
 });
}
Try
This pattern relies less on the compiler, and more on your codebase to ensure both runtime and type-system are correctly kept in sync.
Constraints
The mixin pattern is supported natively inside the TypeScript compiler by code flow analysis. There are a few cases where you can hit the edges of the native support.
Decorators and Mixins #4881
You cannot use decorators to provide mixins via code flow analysis:
// A decorator function which replicates the mixin pattern:
const Pausable = (target: typeof Player) => {
 return class Pausable extends target {
   shouldFreeze = false;
 };
};
 
@Pausable
class Player {
 x = 0;
 y = 0;
}
 
// The Player class does not have the decorator's type merged:
const player = new Player();
player.shouldFreeze;
Property 'shouldFreeze' does not exist on type 'Player'.
 
// The runtime aspect could be manually replicated via
// type composition or interface merging.
type FreezablePlayer = Player & { shouldFreeze: boolean };
 
const playerTwo = (new Player() as unknown) as FreezablePlayer;
playerTwo.shouldFreeze;
Try
Static Property Mixins #17829
More of a gotcha than a constraint. The class expression pattern creates singletons, so they can’t be mapped at the type system to support different variable types.
You can work around this by using functions to return your classes which differ based on a generic:
function base<T>() {
 class Base {
   static prop: T;
 }
 return Base;
}
 
function derived<T>() {
 class Derived extends base<T>() {
   static anotherProp: T;
 }
 return Derived;
}
 
class Spec extends derived<string>() {}
 
Spec.prop; // string
Spec.anotherProp; // string
Namespaces
A note about terminology: It’s important to note that in TypeScript 1.5, the nomenclature has changed. “Internal modules” are now “namespaces”. “External modules” are now simply “modules”, as to align with ECMAScript 2015’s terminology, (namely that module X { is equivalent to the now-preferred namespace X {).
This post outlines the various ways to organize your code using namespaces (previously “internal modules”) in TypeScript. As we alluded in our note about terminology, “internal modules” are now referred to as “namespaces”. Additionally, anywhere the module keyword was used when declaring an internal module, the namespace keyword can and should be used instead. This avoids confusing new users by overloading them with similarly named terms.
First steps
Let’s start with the program we’ll be using as our example throughout this page. We’ve written a small set of simplistic string validators, as you might write to check a user’s input on a form in a webpage or check the format of an externally-provided data file.
Validators in a single file
interface StringValidator {
 isAcceptable(s: string): boolean;
}
let lettersRegexp = /^[A-Za-z]+$/;
let numberRegexp = /^[0-9]+$/;
class LettersOnlyValidator implements StringValidator {
 isAcceptable(s: string) {
   return lettersRegexp.test(s);
 }
}
class ZipCodeValidator implements StringValidator {
 isAcceptable(s: string) {
   return s.length === 5 && numberRegexp.test(s);
 }
}
// Some samples to try
let strings = ["Hello", "98052", "101"];
// Validators to use
let validators: { [s: string]: StringValidator } = {};
validators["ZIP code"] = new ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidator();
// Show whether each string passed each validator
for (let s of strings) {
 for (let name in validators) {
   let isMatch = validators[name].isAcceptable(s);
   console.log(`'${s}' ${isMatch ? "matches" : "does not match"} '${name}'.`);
 }
}
Namespacing
As we add more validators, we’re going to want to have some kind of organization scheme so that we can keep track of our types and not worry about name collisions with other objects. Instead of putting lots of different names into the global namespace, let’s wrap up our objects into a namespace.
In this example, we’ll move all validator-related entities into a namespace called Validation. Because we want the interfaces and classes here to be visible outside the namespace, we preface them with export. Conversely, the variables lettersRegexp and numberRegexp are implementation details, so they are left unexported and will not be visible to code outside the namespace. In the test code at the bottom of the file, we now need to qualify the names of the types when used outside the namespace, e.g. Validation.LettersOnlyValidator.
Namespaced Validators
namespace Validation {
 export interface StringValidator {
   isAcceptable(s: string): boolean;
 }
 const lettersRegexp = /^[A-Za-z]+$/;
 const numberRegexp = /^[0-9]+$/;
 export class LettersOnlyValidator implements StringValidator {
   isAcceptable(s: string) {
     return lettersRegexp.test(s);
   }
 }
 export class ZipCodeValidator implements StringValidator {
   isAcceptable(s: string) {
     return s.length === 5 && numberRegexp.test(s);
   }
 }
}
// Some samples to try
let strings = ["Hello", "98052", "101"];
// Validators to use
let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();
// Show whether each string passed each validator
for (let s of strings) {
 for (let name in validators) {
   console.log(
     `"${s}" - ${
       validators[name].isAcceptable(s) ? "matches" : "does not match"
     } ${name}`
   );
 }
}
Splitting Across Files
As our application grows, we’ll want to split the code across multiple files to make it easier to maintain.
Multi-file namespaces
Here, we’ll split our Validation namespace across many files. Even though the files are separate, they can each contribute to the same namespace and can be consumed as if they were all defined in one place. Because there are dependencies between files, we’ll add reference tags to tell the compiler about the relationships between the files. Our test code is otherwise unchanged.
Validation.ts
namespace Validation {
 export interface StringValidator {
   isAcceptable(s: string): boolean;
 }
}
LettersOnlyValidator.ts
/// <reference path="Validation.ts" />
namespace Validation {
 const lettersRegexp = /^[A-Za-z]+$/;
 export class LettersOnlyValidator implements StringValidator {
   isAcceptable(s: string) {
     return lettersRegexp.test(s);
   }
 }
}
ZipCodeValidator.ts
/// <reference path="Validation.ts" />
namespace Validation {
 const numberRegexp = /^[0-9]+$/;
 export class ZipCodeValidator implements StringValidator {
   isAcceptable(s: string) {
     return s.length === 5 && numberRegexp.test(s);
   }
 }
}
Test.ts
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />
// Some samples to try
let strings = ["Hello", "98052", "101"];
// Validators to use
let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();
// Show whether each string passed each validator
for (let s of strings) {
 for (let name in validators) {
   console.log(
     `"${s}" - ${
       validators[name].isAcceptable(s) ? "matches" : "does not match"
     } ${name}`
   );
 }
}
Once there are multiple files involved, we’ll need to make sure all of the compiled code gets loaded. There are two ways of doing this.
First, we can use concatenated output using the outFile option to compile all of the input files into a single JavaScript output file:
tsc --outFile sample.js Test.ts
The compiler will automatically order the output file based on the reference tags present in the files. You can also specify each file individually:
tsc --outFile sample.js Validation.ts LettersOnlyValidator.ts ZipCodeValidator.ts Test.ts
Alternatively, we can use per-file compilation (the default) to emit one JavaScript file for each input file. If multiple JS files get produced, we’ll need to use <script> tags on our webpage to load each emitted file in the appropriate order, for example:
MyTestPage.html (excerpt)
<script src="Validation.js" type="text/javascript" />
<script src="LettersOnlyValidator.js" type="text/javascript" />
<script src="ZipCodeValidator.js" type="text/javascript" />
<script src="Test.js" type="text/javascript" />
Aliases
Another way that you can simplify working with namespaces is to use import q = x.y.z to create shorter names for commonly-used objects. Not to be confused with the import x = require("name") syntax used to load modules, this syntax simply creates an alias for the specified symbol. You can use these sorts of imports (commonly referred to as aliases) for any kind of identifier, including objects created from module imports.
namespace Shapes {
 export namespace Polygons {
   export class Triangle {}
   export class Square {}
 }
}
import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // Same as 'new Shapes.Polygons.Square()'
Notice that we don’t use the require keyword; instead we assign directly from the qualified name of the symbol we’re importing. This is similar to using var, but also works on the type and namespace meanings of the imported symbol. Importantly, for values, import is a distinct reference from the original symbol, so changes to an aliased var will not be reflected in the original variable.
Working with Other JavaScript Libraries
To describe the shape of libraries not written in TypeScript, we need to declare the API that the library exposes. Because most JavaScript libraries expose only a few top-level objects, namespaces are a good way to represent them.
We call declarations that don’t define an implementation “ambient”. Typically these are defined in .d.ts files. If you’re familiar with C/C++, you can think of these as .h files. Let’s look at a few examples.
Ambient Namespaces
The popular library D3 defines its functionality in a global object called d3. Because this library is loaded through a <script> tag (instead of a module loader), its declaration uses namespaces to define its shape. For the TypeScript compiler to see this shape, we use an ambient namespace declaration. For example, we could begin writing it as follows:
D3.d.ts (simplified excerpt)
declare namespace D3 {
 export interface Selectors {
   select: {
     (selector: string): Selection;
     (element: EventTarget): Selection;
   };
 }
 export interface Event {
   x: number;
   y: number;
 }
 export interface Base extends Selectors {
   event: Event;
 }
}
declare var d3: D3.Base;
On this page
First steps
Validators in a single file
Namespacing
Namespaced Validators
Splitting Across Files
Multi-file namespaces
Aliases
Working with Other JavaScript Libraries
Ambient Namespaces
Is this page helpful?
YesNo
Namespaces and Modules
This post outlines the various ways to organize your code using modules and namespaces in TypeScript. We’ll also go over some advanced topics of how to use namespaces and modules, and address some common pitfalls when using them in TypeScript.
See the Modules documentation for more information about ES Modules. See the Namespaces documentation for more information about TypeScript namespaces.
Note: In very old versions of TypeScript namespaces were called ‘Internal Modules’, these pre-date JavaScript module systems.
Using Modules
Modules can contain both code and declarations.
Modules also have a dependency on a module loader (such as CommonJs/Require.js) or a runtime which supports ES Modules. Modules provide for better code reuse, stronger isolation and better tooling support for bundling.
It is also worth noting that, for Node.js applications, modules are the default and we recommended modules over namespaces in modern code.
Starting with ECMAScript 2015, modules are native part of the language, and should be supported by all compliant engine implementations. Thus, for new projects modules would be the recommended code organization mechanism.
Using Namespaces
Namespaces are a TypeScript-specific way to organize code.
Namespaces are simply named JavaScript objects in the global namespace. This makes namespaces a very simple construct to use. Unlike modules, they can span multiple files, and can be concatenated using outFile. Namespaces can be a good way to structure your code in a Web Application, with all dependencies included as <script> tags in your HTML page.
Just like all global namespace pollution, it can be hard to identify component dependencies, especially in a large application.
Pitfalls of Namespaces and Modules
In this section we’ll describe various common pitfalls in using namespaces and modules, and how to avoid them.
/// <reference>-ing a module
A common mistake is to try to use the /// <reference ... /> syntax to refer to a module file, rather than using an import statement. To understand the distinction, we first need to understand how the compiler can locate the type information for a module based on the path of an import (e.g. the ... in import x from "...";, import x = require("...");, etc.) path.
The compiler will try to find a .ts, .tsx, and then a .d.ts with the appropriate path. If a specific file could not be found, then the compiler will look for an ambient module declaration. Recall that these need to be declared in a .d.ts file.
myModules.d.ts
// In a .d.ts file or .ts file that is not a module:
declare module "SomeModule" {
  export function fn(): string;
}
myOtherModule.ts
/// <reference path="myModules.d.ts" />
import * as m from "SomeModule";
The reference tag here allows us to locate the declaration file that contains the declaration for the ambient module. This is how the node.d.ts file that several of the TypeScript samples use is consumed.
Needless Namespacing
If you’re converting a program from namespaces to modules, it can be easy to end up with a file that looks like this:
shapes.ts
export namespace Shapes {
  export class Triangle {
    /* ... */
  }
  export class Square {
    /* ... */
  }
}
The top-level namespace here Shapes wraps up Triangle and Square for no reason. This is confusing and annoying for consumers of your module:
shapeConsumer.ts
import * as shapes from "./shapes";
let t = new shapes.Shapes.Triangle(); // shapes.Shapes?
A key feature of modules in TypeScript is that two different modules will never contribute names to the same scope. Because the consumer of a module decides what name to assign it, there’s no need to proactively wrap up the exported symbols in a namespace.
To reiterate why you shouldn’t try to namespace your module contents, the general idea of namespacing is to provide logical grouping of constructs and to prevent name collisions. Because the module file itself is already a logical grouping, and its top-level name is defined by the code that imports it, it’s unnecessary to use an additional module layer for exported objects.
Here’s a revised example:
shapes.ts
export class Triangle {
  /* ... */
}
export class Square {
  /* ... */
}
shapeConsumer.ts
import * as shapes from "./shapes";
let t = new shapes.Triangle();
Trade-offs of Modules
Just as there is a one-to-one correspondence between JS files and modules, TypeScript has a one-to-one correspondence between module source files and their emitted JS files. One effect of this is that it’s not possible to concatenate multiple module source files depending on the module system you target. For instance, you can’t use the outFile option while targeting commonjs or umd, but with TypeScript 1.8 and later, it’s possible to use outFile when targeting amd or system.
Symbols
Starting with ECMAScript 2015, symbol is a primitive data type, just like number and string.
symbol values are created by calling the Symbol constructor.
let sym1 = Symbol();
let sym2 = Symbol("key"); // optional string key
Symbols are immutable, and unique.
let sym2 = Symbol("key");
let sym3 = Symbol("key");
sym2 === sym3; // false, symbols are unique
Just like strings, symbols can be used as keys for object properties.
const sym = Symbol();
let obj = {
 [sym]: "value",
};
console.log(obj[sym]); // "value"
Symbols can also be combined with computed property declarations to declare object properties and class members.
const getClassNameSymbol = Symbol();
class C {
 [getClassNameSymbol]() {
   return "C";
 }
}
let c = new C();
let className = c[getClassNameSymbol](); // "C"
unique symbol
To enable treating symbols as unique literals a special type unique symbol is available. unique symbol is a subtype of symbol, and are produced only from calling Symbol() or Symbol.for(), or from explicit type annotations. This type is only allowed on const declarations and readonly static properties, and in order to reference a specific unique symbol, you’ll have to use the typeof operator. Each reference to a unique symbol implies a completely unique identity that’s tied to a given declaration.
declare const sym1: unique symbol;
 
// sym2 can only be a constant reference.
let sym2: unique symbol = Symbol();
A variable whose type is a 'unique symbol' type must be 'const'.
 
// Works - refers to a unique symbol, but its identity is tied to 'sym1'.
let sym3: typeof sym1 = sym1;
 
// Also works.
class C {
 static readonly StaticSymbol: unique symbol = Symbol();
}
Try
Because each unique symbol has a completely separate identity, no two unique symbol types are assignable or comparable to each other.
const sym2 = Symbol();
const sym3 = Symbol();
 
if (sym2 === sym3) {
This comparison appears to be unintentional because the types 'typeof sym2' and 'typeof sym3' have no overlap.
 // ...
}
Try
Well-known Symbols
In addition to user-defined symbols, there are well-known built-in symbols. Built-in symbols are used to represent internal language behaviors.
Here is a list of well-known symbols:
Symbol.asyncIterator
A method that returns async iterator for an object, compatible to be used with for await..of loop.
Symbol.hasInstance
A method that determines if a constructor object recognizes an object as one of the constructor’s instances. Called by the semantics of the instanceof operator.
Symbol.isConcatSpreadable
A Boolean value indicating that an object should be flattened to its array elements by Array.prototype.concat.
Symbol.iterator
A method that returns the default iterator for an object. Called by the semantics of the for-of statement.
Symbol.match
A regular expression method that matches the regular expression against a string. Called by the String.prototype.match method.
Symbol.replace
A regular expression method that replaces matched substrings of a string. Called by the String.prototype.replace method.
Symbol.search
A regular expression method that returns the index within a string that matches the regular expression. Called by the String.prototype.search method.
Symbol.species
A function valued property that is the constructor function that is used to create derived objects.
Symbol.split
A regular expression method that splits a string at the indices that match the regular expression. Called by the String.prototype.split method.
Symbol.toPrimitive
A method that converts an object to a corresponding primitive value. Called by the ToPrimitive abstract operation.
Symbol.toStringTag
A String value that is used in the creation of the default string description of an object. Called by the built-in method Object.prototype.toString.
Symbol.unscopables
An Object whose own property names are property names that are excluded from the ‘with’ environment bindings of the associated objects.
Triple-Slash Directives
Triple-slash directives are single-line comments containing a single XML tag. The contents of the comment are used as compiler directives.
Triple-slash directives are only valid at the top of their containing file. A triple-slash directive can only be preceded by single or multi-line comments, including other triple-slash directives. If they are encountered following a statement or a declaration they are treated as regular single-line comments, and hold no special meaning.
As of TypeScript 5.5, the compiler does not generate reference directives, and does not emit handwritten triple-slash directives to output files unless those directives are marked as preserve="true".
/// <reference path="..." />
The /// <reference path="..." /> directive is the most common of this group. It serves as a declaration of dependency between files.
Triple-slash references instruct the compiler to include additional files in the compilation process.
They also serve as a method to order the output when using out or outFile. Files are emitted to the output file location in the same order as the input after preprocessing pass.
Preprocessing input files
The compiler performs a preprocessing pass on input files to resolve all triple-slash reference directives. During this process, additional files are added to the compilation.
The process starts with a set of root files; these are the file names specified on the command-line or in the files list in the tsconfig.json file. These root files are preprocessed in the same order they are specified. Before a file is added to the list, all triple-slash references in it are processed, and their targets included. Triple-slash references are resolved in a depth-first manner, in the order they have been seen in the file.
A triple-slash reference path is resolved relative to the containing file, if a relative path is used.
Errors
It is an error to reference a file that does not exist. It is an error for a file to have a triple-slash reference to itself.
Using --noResolve
If the compiler flag noResolve is specified, triple-slash references are ignored; they neither result in adding new files, nor change the order of the files provided.
/// <reference types="..." />
Similar to a /// <reference path="..." /> directive, which serves as a declaration of dependency, a /// <reference types="..." /> directive declares a dependency on a package.
The process of resolving these package names is similar to the process of resolving module names in an import statement. An easy way to think of triple-slash-reference-types directives are as an import for declaration packages.
For example, including /// <reference types="node" /> in a declaration file declares that this file uses names declared in @types/node/index.d.ts; and thus, this package needs to be included in the compilation along with the declaration file.
For declaring a dependency on an @types package in a .ts file, use types on the command line or in your tsconfig.json instead. See using @types, typeRoots and types in tsconfig.json files for more details.
/// <reference lib="..." />
This directive allows a file to explicitly include an existing built-in lib file.
Built-in lib files are referenced in the same fashion as the lib compiler option in tsconfig.json (e.g. use lib="es2015" and not lib="lib.es2015.d.ts", etc.).
For declaration file authors who rely on built-in types, e.g. DOM APIs or built-in JS run-time constructors like Symbol or Iterable, triple-slash-reference lib directives are recommended. Previously these .d.ts files had to add forward/duplicate declarations of such types.
For example, adding /// <reference lib="es2017.string" /> to one of the files in a compilation is equivalent to compiling with --lib es2017.string.
/// <reference lib="es2017.string" />
"foo".padStart(4);
/// <reference no-default-lib="true"/>
This directive marks a file as a default library. You will see this comment at the top of lib.d.ts and its different variants.
This directive instructs the compiler to not include the default library (i.e. lib.d.ts) in the compilation. The impact here is similar to passing noLib on the command line.
Also note that when passing skipDefaultLibCheck, the compiler will only skip checking files with /// <reference no-default-lib="true"/>.
/// <amd-module />
By default AMD modules are generated anonymous. This can lead to problems when other tools are used to process the resulting modules, such as bundlers (e.g. r.js).
The amd-module directive allows passing an optional module name to the compiler:
amdModule.ts
/// <amd-module name="NamedModule"/>
export class C {}
Will result in assigning the name NamedModule to the module as part of calling the AMD define:
amdModule.js
define("NamedModule", ["require", "exports"], function (require, exports) {
 var C = (function () {
   function C() {}
   return C;
 })();
 exports.C = C;
});
/// <amd-dependency />
Note: this directive has been deprecated. Use import "moduleName"; statements instead.
/// <amd-dependency path="x" /> informs the compiler about a non-TS module dependency that needs to be injected in the resulting module’s require call.
The amd-dependency directive can also have an optional name property; this allows passing an optional name for an amd-dependency:
/// <amd-dependency path="legacy/moduleA" name="moduleA"/>
declare var moduleA: MyType;
moduleA.callStuff();
Generated JS code:
define(["require", "exports", "legacy/moduleA"], function (
 require,
 exports,
 moduleA
) {
 moduleA.callStuff();
});
preserve="true"
Triple-slash directives can be marked with preserve="true" to prevent the compiler from removing them from the output.
For example, these will be erased in the output:
/// <reference path="..." />
/// <reference types="..." />
/// <reference lib="..." />
But these will be preserved:
/// <reference path="..." preserve="true" />
/// <reference types="..." preserve="true" />
/// <reference lib="..." preserve="true" />
Type Compatibility
Type compatibility in TypeScript is based on structural subtyping. Structural typing is a way of relating types based solely on their members. This is in contrast with nominal typing. Consider the following code:
interface Pet {
 name: string;
}
class Dog {
 name: string;
}
let pet: Pet;
// OK, because of structural typing
pet = new Dog();
In nominally-typed languages like C# or Java, the equivalent code would be an error because the Dog class does not explicitly describe itself as being an implementer of the Pet interface.
TypeScript’s structural type system was designed based on how JavaScript code is typically written. Because JavaScript widely uses anonymous objects like function expressions and object literals, it’s much more natural to represent the kinds of relationships found in JavaScript libraries with a structural type system instead of a nominal one.
A Note on Soundness
TypeScript’s type system allows certain operations that can’t be known at compile-time to be safe. When a type system has this property, it is said to not be “sound”. The places where TypeScript allows unsound behavior were carefully considered, and throughout this document we’ll explain where these happen and the motivating scenarios behind them.
Starting out
The basic rule for TypeScript’s structural type system is that x is compatible with y if y has at least the same members as x. For example consider the following code involving an interface named Pet which has a name property:
interface Pet {
 name: string;
}
let pet: Pet;
// dog's inferred type is { name: string; owner: string; }
let dog = { name: "Lassie", owner: "Rudd Weatherwax" };
pet = dog;
To check whether dog can be assigned to pet, the compiler checks each property of pet to find a corresponding compatible property in dog. In this case, dog must have a member called name that is a string. It does, so the assignment is allowed.
The same rule for assignment is used when checking function call arguments:
interface Pet {
 name: string;
}
let dog = { name: "Lassie", owner: "Rudd Weatherwax" };
function greet(pet: Pet) {
 console.log("Hello, " + pet.name);
}
greet(dog); // OK
Note that dog has an extra owner property, but this does not create an error. Only members of the target type (Pet in this case) are considered when checking for compatibility. This comparison process proceeds recursively, exploring the type of each member and sub-member.
Be aware, however, that object literals may only specify known properties. For example, because we have explicitly specified that dog is of type Pet, the following code is invalid:
let dog: Pet = { name: "Lassie", owner: "Rudd Weatherwax" }; // Error
Comparing two functions
While comparing primitive types and object types is relatively straightforward, the question of what kinds of functions should be considered compatible is a bit more involved. Let’s start with a basic example of two functions that differ only in their parameter lists:
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;
y = x; // OK
x = y; // Error
To check if x is assignable to y, we first look at the parameter list. Each parameter in x must have a corresponding parameter in y with a compatible type. Note that the names of the parameters are not considered, only their types. In this case, every parameter of x has a corresponding compatible parameter in y, so the assignment is allowed.
The second assignment is an error, because y has a required second parameter that x does not have, so the assignment is disallowed.
You may be wondering why we allow ‘discarding’ parameters like in the example y = x. The reason for this assignment to be allowed is that ignoring extra function parameters is actually quite common in JavaScript. For example, Array#forEach provides three parameters to the callback function: the array element, its index, and the containing array. Nevertheless, it’s very useful to provide a callback that only uses the first parameter:
let items = [1, 2, 3];
// Don't force these extra parameters
items.forEach((item, index, array) => console.log(item));
// Should be OK!
items.forEach((item) => console.log(item));
Now let’s look at how return types are treated, using two functions that differ only by their return type:
let x = () => ({ name: "Alice" });
let y = () => ({ name: "Alice", location: "Seattle" });
x = y; // OK
y = x; // Error, because x() lacks a location property
The type system enforces that the source function’s return type be a subtype of the target type’s return type.
Function Parameter Bivariance
When comparing the types of function parameters, assignment succeeds if either the source parameter is assignable to the target parameter, or vice versa. This is unsound because a caller might end up being given a function that takes a more specialized type, but invokes the function with a less specialized type. In practice, this sort of error is rare, and allowing this enables many common JavaScript patterns. A brief example:
enum EventType {
 Mouse,
 Keyboard,
}
interface Event {
 timestamp: number;
}
interface MyMouseEvent extends Event {
 x: number;
 y: number;
}
interface MyKeyEvent extends Event {
 keyCode: number;
}
function listenEvent(eventType: EventType, handler: (n: Event) => void) {
 /* ... */
}
// Unsound, but useful and common
listenEvent(EventType.Mouse, (e: MyMouseEvent) => console.log(e.x + "," + e.y));
// Undesirable alternatives in presence of soundness
listenEvent(EventType.Mouse, (e: Event) =>
 console.log((e as MyMouseEvent).x + "," + (e as MyMouseEvent).y)
);
listenEvent(EventType.Mouse, ((e: MyMouseEvent) =>
 console.log(e.x + "," + e.y)) as (e: Event) => void);
// Still disallowed (clear error). Type safety enforced for wholly incompatible types
listenEvent(EventType.Mouse, (e: number) => console.log(e));
You can have TypeScript raise errors when this happens via the compiler flag strictFunctionTypes.
Optional Parameters and Rest Parameters
When comparing functions for compatibility, optional and required parameters are interchangeable. Extra optional parameters of the source type are not an error, and optional parameters of the target type without corresponding parameters in the source type are not an error.
When a function has a rest parameter, it is treated as if it were an infinite series of optional parameters.
This is unsound from a type system perspective, but from a runtime point of view the idea of an optional parameter is generally not well-enforced since passing undefined in that position is equivalent for most functions.
The motivating example is the common pattern of a function that takes a callback and invokes it with some predictable (to the programmer) but unknown (to the type system) number of arguments:
function invokeLater(args: any[], callback: (...args: any[]) => void) {
 /* ... Invoke callback with 'args' ... */
}
// Unsound - invokeLater "might" provide any number of arguments
invokeLater([1, 2], (x, y) => console.log(x + ", " + y));
// Confusing (x and y are actually required) and undiscoverable
invokeLater([1, 2], (x?, y?) => console.log(x + ", " + y));
Functions with overloads
When a function has overloads, each overload in the target type must be matched by a compatible signature on the source type. This ensures that the source function can be called in all the same cases as the target function.
Enums
Enums are compatible with numbers, and numbers are compatible with enums. Enum values from different enum types are considered incompatible. For example,
enum Status {
 Ready,
 Waiting,
}
enum Color {
 Red,
 Blue,
 Green,
}
let status = Status.Ready;
status = Color.Green; // Error
Classes
Classes work similarly to object literal types and interfaces with one exception: they have both a static and an instance type. When comparing two objects of a class type, only members of the instance are compared. Static members and constructors do not affect compatibility.
class Animal {
 feet: number;
 constructor(name: string, numFeet: number) {}
}
class Size {
 feet: number;
 constructor(numFeet: number) {}
}
let a: Animal;
let s: Size;
a = s; // OK
s = a; // OK
Private and protected members in classes
Private and protected members in a class affect their compatibility. When an instance of a class is checked for compatibility, if the target type contains a private member, then the source type must also contain a private member that originated from the same class. Likewise, the same applies for an instance with a protected member. This allows a class to be assignment compatible with its super class, but not with classes from a different inheritance hierarchy which otherwise have the same shape.
Generics
Because TypeScript is a structural type system, type parameters only affect the resulting type when consumed as part of the type of a member. For example,
interface Empty<T> {}
let x: Empty<number>;
let y: Empty<string>;
x = y; // OK, because y matches structure of x
In the above, x and y are compatible because their structures do not use the type argument in a differentiating way. Changing this example by adding a member to Empty<T> shows how this works:
interface NotEmpty<T> {
 data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;
x = y; // Error, because x and y are not compatible
In this way, a generic type that has its type arguments specified acts just like a non-generic type.
For generic types that do not have their type arguments specified, compatibility is checked by specifying any in place of all unspecified type arguments. The resulting types are then checked for compatibility, just as in the non-generic case.
For example,
let identity = function <T>(x: T): T {
 // ...
};
let reverse = function <U>(y: U): U {
 // ...
};
identity = reverse; // OK, because (x: any) => any matches (y: any) => any
Advanced Topics
Subtype vs Assignment
So far, we’ve used “compatible”, which is not a term defined in the language spec. In TypeScript, there are two kinds of compatibility: subtype and assignment. These differ only in that assignment extends subtype compatibility with rules to allow assignment to and from any, and to and from enum with corresponding numeric values.
Different places in the language use one of the two compatibility mechanisms, depending on the situation. For practical purposes, type compatibility is dictated by assignment compatibility, even in the cases of the implements and extends clauses.
any, unknown, object, void, undefined, null, and never assignability
The following table summarizes assignability between some abstract types. Rows indicate what each is assignable to, columns indicate what is assignable to them. A ”✓” indicates a combination that is compatible only when strictNullChecks is off.


any
unknown
object
void
undefined
null
never
any →


✓
✓
✓
✓
✓
✕
unknown →
✓


✕
✕
✕
✕
✕
object →
✓
✓


✕
✕
✕
✕
void →
✓
✓
✕


✕
✕
✕
undefined →
✓
✓
✓
✓


✓
✕
null →
✓
✓
✓
✓
✓


✕
never →
✓
✓
✓
✓
✓
✓



Reiterating The Basics:
Everything is assignable to itself.
any and unknown are the same in terms of what is assignable to them, different in that unknown is not assignable to anything except any.
unknown and never are like inverses of each other. Everything is assignable to unknown, never is assignable to everything. Nothing is assignable to never, unknown is not assignable to anything (except any).
void is not assignable to or from anything, with the following exceptions: any, unknown, never, undefined, and null (if strictNullChecks is off, see table for details).
When strictNullChecks is off, null and undefined are similar to never: assignable to most types, most types are not assignable to them. They are assignable to each other.
When strictNullChecks is on, null and undefined behave more like void: not assignable to or from anything, except for any, unknown, and void (undefined is always assignable to void).
Type Inference
In TypeScript, there are several places where type inference is used to provide type information when there is no explicit type annotation. For example, in this code
let x = 3;
 
let x: number
Try
The type of the x variable is inferred to be number. This kind of inference takes place when initializing variables and members, setting parameter default values, and determining function return types.
In most cases, type inference is straightforward. In the following sections, we’ll explore some of the nuances in how types are inferred.
Best common type
When a type inference is made from several expressions, the types of those expressions are used to calculate a “best common type”. For example,
let x = [0, 1, null];
 
let x: (number | null)[]
Try
To infer the type of x in the example above, we must consider the type of each array element. Here we are given two choices for the type of the array: number and null. The best common type algorithm considers each candidate type, and picks the type that is compatible with all the other candidates.
Because the best common type has to be chosen from the provided candidate types, there are some cases where types share a common structure, but no one type is the super type of all candidate types. For example:
let zoo = [new Rhino(), new Elephant(), new Snake()];
  
let zoo: (Rhino | Elephant | Snake)[]
Try
Ideally, we may want zoo to be inferred as an Animal[], but because there is no object that is strictly of type Animal in the array, we make no inference about the array element type. To correct this, explicitly provide the type when no one type is a super type of all other candidates:
let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
  
let zoo: Animal[]
Try
When no best common type is found, the resulting inference is the union array type, (Rhino | Elephant | Snake)[].
Contextual Typing
Type inference also works in “the other direction” in some cases in TypeScript. This is known as “contextual typing”. Contextual typing occurs when the type of an expression is implied by its location. For example:
window.onmousedown = function (mouseEvent) {
 console.log(mouseEvent.button);
 console.log(mouseEvent.kangaroo);
Property 'kangaroo' does not exist on type 'MouseEvent'.
};
Try
Here, the TypeScript type checker used the type of the Window.onmousedown function to infer the type of the function expression on the right hand side of the assignment. When it did so, it was able to infer the type of the mouseEvent parameter, which does contain a button property, but not a kangaroo property.
This works because window already has onmousedown declared in its type:
// Declares there is a global variable called 'window'
declare var window: Window & typeof globalThis;
// Which is declared as (simplified):
interface Window extends GlobalEventHandlers {
 // ...
}
// Which defines a lot of known handler events
interface GlobalEventHandlers {
 onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
 // ...
}
TypeScript is smart enough to infer types in other contexts as well:
window.onscroll = function (uiEvent) {
 console.log(uiEvent.button);
Property 'button' does not exist on type 'Event'.
};
Try
Based on the fact that the above function is being assigned to Window.onscroll, TypeScript knows that uiEvent is a UIEvent, and not a MouseEvent like the previous example. UIEvent objects contain no button property, and so TypeScript will throw an error.
If this function were not in a contextually typed position, the function’s argument would implicitly have type any, and no error would be issued (unless you are using the noImplicitAny option):
const handler = function (uiEvent) {
 console.log(uiEvent.button); // <- OK
};
Try
We can also explicitly give type information to the function’s argument to override any contextual type:
window.onscroll = function (uiEvent: any) {
 console.log(uiEvent.button); // <- Now, no error is given
};
Try
However, this code will log undefined, since uiEvent has no property called button.
Contextual typing applies in many cases. Common cases include arguments to function calls, right hand sides of assignments, type assertions, members of object and array literals, and return statements. The contextual type also acts as a candidate type in best common type. For example:
function createZoo(): Animal[] {
 return [new Rhino(), new Elephant(), new Snake()];
}
Try
In this example, best common type has a set of four candidates: Animal, Rhino, Elephant, and Snake. Of these, Animal can be chosen by the best common type algorithm.
Variable Declaration
let and const are two relatively new concepts for variable declarations in JavaScript. As we mentioned earlier, let is similar to var in some respects, but allows users to avoid some of the common “gotchas” that users run into in JavaScript.
const is an augmentation of let in that it prevents re-assignment to a variable.
With TypeScript being an extension of JavaScript, the language naturally supports let and const. Here we’ll elaborate more on these new declarations and why they’re preferable to var.
If you’ve used JavaScript offhandedly, the next section might be a good way to refresh your memory. If you’re intimately familiar with all the quirks of var declarations in JavaScript, you might find it easier to skip ahead.
var declarations
Declaring a variable in JavaScript has always traditionally been done with the var keyword.
var a = 10;
As you might’ve figured out, we just declared a variable named a with the value 10.
We can also declare a variable inside of a function:
function f() {
 var message = "Hello, world!";
 return message;
}
and we can also access those same variables within other functions:
function f() {
 var a = 10;
 return function g() {
   var b = a + 1;
   return b;
 };
}
var g = f();
g(); // returns '11'
In this above example, g captured the variable a declared in f. At any point that g gets called, the value of a will be tied to the value of a in f. Even if g is called once f is done running, it will be able to access and modify a.
function f() {
 var a = 1;
 a = 2;
 var b = g();
 a = 3;
 return b;
 function g() {
   return a;
 }
}
f(); // returns '2'
Scoping rules
var declarations have some odd scoping rules for those used to other languages. Take the following example:
function f(shouldInitialize: boolean) {
 if (shouldInitialize) {
   var x = 10;
 }
 return x;
}
f(true); // returns '10'
f(false); // returns 'undefined'
Some readers might do a double-take at this example. The variable x was declared within the if block, and yet we were able to access it from outside that block. That’s because var declarations are accessible anywhere within their containing function, module, namespace, or global scope - all which we’ll go over later on - regardless of the containing block. Some people call this var-scoping or function-scoping. Parameters are also function scoped.
These scoping rules can cause several types of mistakes. One problem they exacerbate is the fact that it is not an error to declare the same variable multiple times:
function sumMatrix(matrix: number[][]) {
 var sum = 0;
 for (var i = 0; i < matrix.length; i++) {
   var currentRow = matrix[i];
   for (var i = 0; i < currentRow.length; i++) {
     sum += currentRow[i];
   }
 }
 return sum;
}
Maybe it was easy to spot out for some experienced JavaScript developers, but the inner for-loop will accidentally overwrite the variable i because i refers to the same function-scoped variable. As experienced developers know by now, similar sorts of bugs slip through code reviews and can be an endless source of frustration.
Variable capturing quirks
Take a quick second to guess what the output of the following snippet is:
for (var i = 0; i < 10; i++) {
 setTimeout(function () {
   console.log(i);
 }, 100 * i);
}
For those unfamiliar, setTimeout will try to execute a function after a certain number of milliseconds (though waiting for anything else to stop running).
Ready? Take a look:
10
10
10
10
10
10
10
10
10
10
Many JavaScript developers are intimately familiar with this behavior, but if you’re surprised, you’re certainly not alone. Most people expect the output to be
0
1
2
3
4
5
6
7
8
9
Remember what we mentioned earlier about variable capturing? Every function expression we pass to setTimeout actually refers to the same i from the same scope.
Let’s take a minute to consider what that means. setTimeout will run a function after some number of milliseconds, but only after the for loop has stopped executing; By the time the for loop has stopped executing, the value of i is 10. So each time the given function gets called, it will print out 10!
A common work around is to use an IIFE - an Immediately Invoked Function Expression - to capture i at each iteration:
for (var i = 0; i < 10; i++) {
 // capture the current state of 'i'
 // by invoking a function with its current value
 (function (i) {
   setTimeout(function () {
     console.log(i);
   }, 100 * i);
 })(i);
}
This odd-looking pattern is actually pretty common. The i in the parameter list actually shadows the i declared in the for loop, but since we named them the same, we didn’t have to modify the loop body too much.
let declarations
By now you’ve figured out that var has some problems, which is precisely why let statements were introduced. Apart from the keyword used, let statements are written the same way var statements are.
let hello = "Hello!";
The key difference is not in the syntax, but in the semantics, which we’ll now dive into.
Block-scoping
When a variable is declared using let, it uses what some call lexical-scoping or block-scoping. Unlike variables declared with var whose scopes leak out to their containing function, block-scoped variables are not visible outside of their nearest containing block or for-loop.
function f(input: boolean) {
 let a = 100;
 if (input) {
   // Still okay to reference 'a'
   let b = a + 1;
   return b;
 }
 // Error: 'b' doesn't exist here
 return b;
}
Here, we have two local variables a and b. a’s scope is limited to the body of f while b’s scope is limited to the containing if statement’s block.
Variables declared in a catch clause also have similar scoping rules.
try {
 throw "oh no!";
} catch (e) {
 console.log("Oh well.");
}
// Error: 'e' doesn't exist here
console.log(e);
Another property of block-scoped variables is that they can’t be read or written to before they’re actually declared. While these variables are “present” throughout their scope, all points up until their declaration are part of their temporal dead zone. This is just a sophisticated way of saying you can’t access them before the let statement, and luckily TypeScript will let you know that.
a++; // illegal to use 'a' before it's declared;
let a;
Something to note is that you can still capture a block-scoped variable before it’s declared. The only catch is that it’s illegal to call that function before the declaration. If targeting ES2015, a modern runtime will throw an error; however, right now TypeScript is permissive and won’t report this as an error.
function foo() {
 // okay to capture 'a'
 return a;
}
// illegal call 'foo' before 'a' is declared
// runtimes should throw an error here
foo();
let a;
For more information on temporal dead zones, see relevant content on the Mozilla Developer Network.
Re-declarations and Shadowing
With var declarations, we mentioned that it didn’t matter how many times you declared your variables; you just got one.
function f(x) {
 var x;
 var x;
 if (true) {
   var x;
 }
}
In the above example, all declarations of x actually refer to the same x, and this is perfectly valid. This often ends up being a source of bugs. Thankfully, let declarations are not as forgiving.
let x = 10;
let x = 20; // error: can't re-declare 'x' in the same scope
The variables don’t necessarily need to both be block-scoped for TypeScript to tell us that there’s a problem.
function f(x) {
 let x = 100; // error: interferes with parameter declaration
}
function g() {
 let x = 100;
 var x = 100; // error: can't have both declarations of 'x'
}
That’s not to say that a block-scoped variable can never be declared with a function-scoped variable. The block-scoped variable just needs to be declared within a distinctly different block.
function f(condition, x) {
 if (condition) {
   let x = 100;
   return x;
 }
 return x;
}
f(false, 0); // returns '0'
f(true, 0); // returns '100'
The act of introducing a new name in a more nested scope is called shadowing. It is a bit of a double-edged sword in that it can introduce certain bugs on its own in the event of accidental shadowing, while also preventing certain bugs. For instance, imagine we had written our earlier sumMatrix function using let variables.
function sumMatrix(matrix: number[][]) {
 let sum = 0;
 for (let i = 0; i < matrix.length; i++) {
   var currentRow = matrix[i];
   for (let i = 0; i < currentRow.length; i++) {
     sum += currentRow[i];
   }
 }
 return sum;
}
This version of the loop will actually perform the summation correctly because the inner loop’s i shadows i from the outer loop.
Shadowing should usually be avoided in the interest of writing clearer code. While there are some scenarios where it may be fitting to take advantage of it, you should use your best judgement.
Block-scoped variable capturing
When we first touched on the idea of variable capturing with var declaration, we briefly went into how variables act once captured. To give a better intuition of this, each time a scope is run, it creates an “environment” of variables. That environment and its captured variables can exist even after everything within its scope has finished executing.
function theCityThatAlwaysSleeps() {
 let getCity;
 if (true) {
   let city = "Seattle";
   getCity = function () {
     return city;
   };
 }
 return getCity();
}
Because we’ve captured city from within its environment, we’re still able to access it despite the fact that the if block finished executing.
Recall that with our earlier setTimeout example, we ended up needing to use an IIFE to capture the state of a variable for every iteration of the for loop. In effect, what we were doing was creating a new variable environment for our captured variables. That was a bit of a pain, but luckily, you’ll never have to do that again in TypeScript.
let declarations have drastically different behavior when declared as part of a loop. Rather than just introducing a new environment to the loop itself, these declarations sort of create a new scope per iteration. Since this is what we were doing anyway with our IIFE, we can change our old setTimeout example to just use a let declaration.
for (let i = 0; i < 10; i++) {
 setTimeout(function () {
   console.log(i);
 }, 100 * i);
}
and as expected, this will print out
0
1
2
3
4
5
6
7
8
9
const declarations
const declarations are another way of declaring variables.
const numLivesForCat = 9;
They are like let declarations but, as their name implies, their value cannot be changed once they are bound. In other words, they have the same scoping rules as let, but you can’t re-assign to them.
This should not be confused with the idea that the values they refer to are immutable.
const numLivesForCat = 9;
const kitty = {
 name: "Aurora",
 numLives: numLivesForCat,
};
// Error
kitty = {
 name: "Danielle",
 numLives: numLivesForCat,
};
// all "okay"
kitty.name = "Rory";
kitty.name = "Kitty";
kitty.name = "Cat";
kitty.numLives--;
Unless you take specific measures to avoid it, the internal state of a const variable is still modifiable. Fortunately, TypeScript allows you to specify that members of an object are readonly. The chapter on Interfaces has the details.
let vs. const
Given that we have two types of declarations with similar scoping semantics, it’s natural to find ourselves asking which one to use. Like most broad questions, the answer is: it depends.
Applying the principle of least privilege, all declarations other than those you plan to modify should use const. The rationale is that if a variable didn’t need to get written to, others working on the same codebase shouldn’t automatically be able to write to the object, and will need to consider whether they really need to reassign to the variable. Using const also makes code more predictable when reasoning about flow of data.
Use your best judgement, and if applicable, consult the matter with the rest of your team.
The majority of this handbook uses let declarations.
Destructuring
Another ECMAScript 2015 feature that TypeScript has is destructuring. For a complete reference, see the article on the Mozilla Developer Network. In this section, we’ll give a short overview.
Array destructuring
The simplest form of destructuring is array destructuring assignment:
let input = [1, 2];
let [first, second] = input;
console.log(first); // outputs 1
console.log(second); // outputs 2
This creates two new variables named first and second. This is equivalent to using indexing, but is much more convenient:
first = input[0];
second = input[1];
Destructuring works with already-declared variables as well:
// swap variables
[first, second] = [second, first];
And with parameters to a function:
function f([first, second]: [number, number]) {
 console.log(first);
 console.log(second);
}
f([1, 2]);
You can create a variable for the remaining items in a list using the syntax ...:
let [first, ...rest] = [1, 2, 3, 4];
console.log(first); // outputs 1
console.log(rest); // outputs [ 2, 3, 4 ]
Of course, since this is JavaScript, you can just ignore trailing elements you don’t care about:
let [first] = [1, 2, 3, 4];
console.log(first); // outputs 1
Or other elements:
let [, second, , fourth] = [1, 2, 3, 4];
console.log(second); // outputs 2
console.log(fourth); // outputs 4
Tuple destructuring
Tuples may be destructured like arrays; the destructuring variables get the types of the corresponding tuple elements:
let tuple: [number, string, boolean] = [7, "hello", true];
let [a, b, c] = tuple; // a: number, b: string, c: boolean
It’s an error to destructure a tuple beyond the range of its elements:
let [a, b, c, d] = tuple; // Error, no element at index 3
As with arrays, you can destructure the rest of the tuple with ..., to get a shorter tuple:
let [a, ...bc] = tuple; // bc: [string, boolean]
let [a, b, c, ...d] = tuple; // d: [], the empty tuple
Or ignore trailing elements, or other elements:
let [a] = tuple; // a: number
let [, b] = tuple; // b: string
Object destructuring
You can also destructure objects:
let o = {
 a: "foo",
 b: 12,
 c: "bar",
};
let { a, b } = o;
This creates new variables a and b from o.a and o.b. Notice that you can skip c if you don’t need it.
Like array destructuring, you can have assignment without declaration:
({ a, b } = { a: "baz", b: 101 });
Notice that we had to surround this statement with parentheses. JavaScript normally parses a { as the start of block.
You can create a variable for the remaining items in an object using the syntax ...:
let { a, ...passthrough } = o;
let total = passthrough.b + passthrough.c.length;
Property renaming
You can also give different names to properties:
let { a: newName1, b: newName2 } = o;
Here the syntax starts to get confusing. You can read a: newName1 as ”a as newName1”. The direction is left-to-right, as if you had written:
let newName1 = o.a;
let newName2 = o.b;
Confusingly, the colon here does not indicate the type. The type, if you specify it, still needs to be written after the entire destructuring:
let { a: newName1, b: newName2 }: { a: string; b: number } = o;
Default values
Default values let you specify a default value in case a property is undefined:
function keepWholeObject(wholeObject: { a: string; b?: number }) {
 let { a, b = 1001 } = wholeObject;
}
In this example the b? indicates that b is optional, so it may be undefined. keepWholeObject now has a variable for wholeObject as well as the properties a and b, even if b is undefined.
Function declarations
Destructuring also works in function declarations. For simple cases this is straightforward:
type C = { a: string; b?: number };
function f({ a, b }: C): void {
 // ...
}
But specifying defaults is more common for parameters, and getting defaults right with destructuring can be tricky. First of all, you need to remember to put the pattern before the default value.
function f({ a = "", b = 0 } = {}): void {
 // ...
}
f();
The snippet above is an example of type inference, explained earlier in the handbook.
Then, you need to remember to give a default for optional properties on the destructured property instead of the main initializer. Remember that C was defined with b optional:
function f({ a, b = 0 } = { a: "" }): void {
 // ...
}
f({ a: "yes" }); // ok, default b = 0
f(); // ok, default to { a: "" }, which then defaults b = 0
f({}); // error, 'a' is required if you supply an argument
Use destructuring with care. As the previous example demonstrates, anything but the simplest destructuring expression is confusing. This is especially true with deeply nested destructuring, which gets really hard to understand even without piling on renaming, default values, and type annotations. Try to keep destructuring expressions small and simple. You can always write the assignments that destructuring would generate yourself.
Spread
The spread operator is the opposite of destructuring. It allows you to spread an array into another array, or an object into another object. For example:
let first = [1, 2];
let second = [3, 4];
let bothPlus = [0, ...first, ...second, 5];
This gives bothPlus the value [0, 1, 2, 3, 4, 5]. Spreading creates a shallow copy of first and second. They are not changed by the spread.
You can also spread objects:
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { ...defaults, food: "rich" };
Now search is { food: "rich", price: "$$", ambiance: "noisy" }. Object spreading is more complex than array spreading. Like array spreading, it proceeds from left-to-right, but the result is still an object. This means that properties that come later in the spread object overwrite properties that come earlier. So if we modify the previous example to spread at the end:
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { food: "rich", ...defaults };
Then the food property in defaults overwrites food: "rich", which is not what we want in this case.
Object spread also has a couple of other surprising limits. First, it only includes an objects’ own, enumerable properties. Basically, that means you lose methods when you spread instances of an object:
class C {
 p = 12;
 m() {}
}
let c = new C();
let clone = { ...c };
clone.p; // ok
clone.m(); // error!
Second, the TypeScript compiler doesn’t allow spreads of type parameters from generic functions. That feature is expected in future versions of the language.
using declarations
using declarations are an upcoming feature for JavaScript that are part of the Stage 3 Explicit Resource Management proposal. A using declaration is much like a const declaration, except that it couples the lifetime of the value bound to the declaration with the scope of the variable.
When control exits the block containing a using declaration, the [Symbol.dispose]() method of the declared value is executed, which allows that value to perform cleanup:
function f() {
 using x = new C();
 doSomethingWith(x);
} // `x[Symbol.dispose]()` is called
At runtime, this has an effect roughly equivalent to the following:
function f() {
 const x = new C();
 try {
   doSomethingWith(x);
 }
 finally {
   x[Symbol.dispose]();
 }
}
using declarations are extremely useful for avoiding memory leaks when working with JavaScript objects that hold on to native references like file handles
{
 using file = await openFile();
 file.write(text);
 doSomethingThatMayThrow();
} // `file` is disposed, even if an error is thrown
or scoped operations like tracing
function f() {
 using activity = new TraceActivity("f"); // traces entry into function
 // ...
} // traces exit of function
Unlike var, let, and const, using declarations do not support destructuring.
null and undefined
It’s important to note that the value can be null or undefined, in which case nothing is disposed at the end of the block:
{
 using x = b ? new C() : null;
 // ...
}
which is roughly equivalent to:
{
 const x = b ? new C() : null;
 try {
   // ...
 }
 finally {
   x?.[Symbol.dispose]();
 }
}
This allows you to conditionally acquire resources when declaring a using declaration without the need for complex branching or repetition.
Defining a disposable resource
You can indicate the classes or objects you produce are disposable by implementing the Disposable interface:
// from the default lib:
interface Disposable {
 [Symbol.dispose](): void;
}
// usage:
class TraceActivity implements Disposable {
 readonly name: string;
 constructor(name: string) {
   this.name = name;
   console.log(`Entering: ${name}`);
 }
 [Symbol.dispose](): void {
   console.log(`Exiting: ${name}`);
 }
}
function f() {
 using _activity = new TraceActivity("f");
 console.log("Hello world!");
}
f();
// prints:
//   Entering: f
//   Hello world!
//   Exiting: f
await using declarations
Some resources or operations may have cleanup that needs to be performed asynchronously. To accommodate this, the Explicit Resource Management proposal also introduces the await using declaration:
async function f() {
 await using x = new C();
} // `await x[Symbol.asyncDispose]()` is invoked
An await using declaration invokes, and awaits, its value’s [Symbol.asyncDispose]() method as control leaves the containing block. This allows for asynchronous cleanup, such as a database transaction performing a rollback or commit, or a file stream flushing any pending writes to storage before it is closed.
As with await, await using can only be used in an async function or method, or at the top level of a module.
Defining an asynchronously disposable resource
Just as using relies on objects that are Disposable, an await using relies on objects that are AsyncDisposable:
// from the default lib:
interface AsyncDisposable {
 [Symbol.asyncDispose]: PromiseLike<void>;
}
// usage:
class DatabaseTransaction implements AsyncDisposable {
 public success = false;
 private db: Database | undefined;
 private constructor(db: Database) {
   this.db = db;
 }
 static async create(db: Database) {
   await db.execAsync("BEGIN TRANSACTION");
   return new DatabaseTransaction(db);
 }
 async [Symbol.asyncDispose]() {
   if (this.db) {
     const db = this.db:
     this.db = undefined;
     if (this.success) {
       await db.execAsync("COMMIT TRANSACTION");
     }
     else {
       await db.execAsync("ROLLBACK TRANSACTION");
     }
   }
 }
}
async function transfer(db: Database, account1: Account, account2: Account, amount: number) {
 using tx = await DatabaseTransaction.create(db);
 if (await debitAccount(db, account1, amount)) {
   await creditAccount(db, account2, amount);
 }
 // if an exception is thrown before this line, the transaction will roll back
 tx.success = true;
 // now the transaction will commit
}
await using vs await
The await keyword that is part of the await using declaration only indicates that the disposal of the resource is await-ed. It does not await the value itself:
{
 await using x = getResourceSynchronously();
} // performs `await x[Symbol.asyncDispose]()`
{
 await using y = await getResourceAsynchronously();
} // performs `await y[Symbol.asyncDispose]()`
await using and return
It’s important to note that there is a small caveat with this behavior if you are using an await using declaration in an async function that returns a Promise without first await-ing it:
function g() {
 return Promise.reject("error!");
}
async function f() {
 await using x = new C();
 return g(); // missing an `await`
}
Because the returned promise isn’t await-ed, it’s possible that the JavaScript runtime may report an unhandled rejection since execution pauses while await-ing the asynchronous disposal of x, without having subscribed to the returned promise. This is not a problem that is unique to await using, however, as this can also occur in an async function that uses try..finally:
async function f() {
 try {
   return g(); // also reports an unhandled rejection
 }
 finally {
   await somethingElse();
 }
}
To avoid this situation, it is recommended that you await your return value if it may be a Promise:
async function f() {
 await using x = new C();
 return await g();
}
using and await using in for and for..of statements
Both using and await using can be used in a for statement:
for (using x = getReader(); !x.eof; x.next()) {
 // ...
}
In this case, the lifetime of x is scoped to the entire for statement and is only disposed when control leaves the loop due to break, return, throw, or when the loop condition is false.
In addition to for statements, both declarations can also be used in for..of statements:
function * g() {
 yield createResource1();
 yield createResource2();
}
for (using x of g()) {
 // ...
}
Here, x is disposed at the end of each iteration of the loop, and is then reinitialized with the next value. This is especially useful when consuming resources produced one at a time by a generator.
using and await using in older runtimes
using and await using declarations can be used when targeting older ECMAScript editions as long as you are using a compatible polyfill for Symbol.dispose/Symbol.asyncDispose, such as the one provided by default in recent editions of NodeJS.
Modules - Introduction
This document is divided into four sections:
The first section develops the theory behind how TypeScript approaches modules. If you want to be able to write the correct module-related compiler options for any situation, reason about how to integrate TypeScript with other tools, or understand how TypeScript processes dependency packages, this is the place to start. While there are guides and reference pages on these topics, building an understanding of these fundamentals will make reading the guides easier, and give you a mental framework for dealing with real-world problems not specifically covered here.
The guides show how to accomplish specific real-world tasks, starting with picking the right compilation settings for a new project. The guides are a good place to start both for beginners who want to get up and running as quickly as possible and for experts who already have a good grasp of the theory but want concrete guidance on a complicated task.
The reference section provides a more detailed look at the syntaxes and configurations presented in previous sections.
The appendices cover complicated topics that deserve additional explanation in more detail than the theory or reference sections allow.
Modules - Theory
Scripts and modules in JavaScript
In the early days of JavaScript, when the language only ran in browsers, there were no modules, but it was still possible to split the JavaScript for a web page into multiple files by using multiple script tags in HTML:
<html>
 <head>
   <script src="a.js"></script>
   <script src="b.js"></script>
 </head>
 <body></body>
</html>
This approach had some downsides, especially as web pages grew larger and more complex. In particular, all scripts loaded onto the same page share the same scope—appropriately called the “global scope”—meaning the scripts had to be very careful not to overwrite each others’ variables and functions.
Any system that solves this problem by giving files their own scope while still providing a way to make bits of code available to other files can be called a “module system.” (It may sound obvious to say that each file in a module system is called a “module,” but the term is often used to contrast with script files, which run outside a module system, in a global scope.)
There are many module systems, and TypeScript supports emitting several, but this documentation will focus on the two most important systems today: ECMAScript modules (ESM) and CommonJS (CJS).
ECMAScript Modules (ESM) is the module system built into the language, supported in modern browsers and in Node.js since v12. It uses dedicated import and export syntax:
// a.js
export default "Hello from a.js";
// b.js
import a from "./a.js";
console.log(a); // 'Hello from a.js'
CommonJS (CJS) is the module system that originally shipped in Node.js, before ESM was part of the language specification. It’s still supported in Node.js alongside ESM. It uses plain JavaScript objects and functions named exports and require:
// a.js
exports.message = "Hello from a.js";
// b.js
const a = require("./a");
console.log(a.message); // 'Hello from a.js'
Accordingly, when TypeScript detects that a file is a CommonJS or ECMAScript module, it starts by assuming that file will have its own scope. Beyond that, though, the compiler’s job gets a little more complicated.
TypeScript’s job concerning modules
The TypeScript compiler’s chief goal is to prevent certain kinds of runtime errors by catching them at compile time. With or without modules involved, the compiler needs to know about the code’s intended runtime environment—what globals are available, for example. When modules are involved, there are several additional questions the compiler needs to answer in order to do its job. Let’s use a few lines of input code as an example to think about all the information needed to analyze it:
import sayHello from "greetings";
sayHello("world");
To check this file, the compiler needs to know the type of sayHello (is it a function that can accept one string argument?), which opens quite a few additional questions:
Will the module system load this TypeScript file directly, or will it load a JavaScript file that I (or another compiler) generate from this TypeScript file?
What kind of module does the module system expect to find, given the file name it will load and its location on disk?
If output JavaScript is being emitted, how will the module syntax present in this file be transformed in the output code?
Where will the module system look to find the module specified by "greetings"? Will the lookup succeed?
What kind of module is the file resolved by that lookup?
Does the module system allow the kind of module detected in (2) to reference the kind of module detected in (5) with the syntax decided in (3)?
Once the "greetings" module has been analyzed, what piece of that module is bound to sayHello?
Notice that all of these questions depend on characteristics of the host—the system that ultimately consumes the output JavaScript (or raw TypeScript, as the case may be) to direct its module loading behavior, typically either a runtime (like Node.js) or bundler (like Webpack).
The ECMAScript specification defines how ESM imports and exports link up with each other, but it doesn’t specify how the file lookup in (4), known as module resolution, happens, and it doesn’t say anything about other module systems like CommonJS. So runtimes and bundlers, especially those that want to support both ESM and CJS, have a lot of freedom to design their own rules. Consequently, the way TypeScript should answer the questions above can vary dramatically depending on where the code is intended to run. There’s no single right answer, so the compiler must be told the rules through configuration options.
The other key idea to keep in mind is that TypeScript almost always thinks about these questions in terms of its output JavaScript files, not its input TypeScript (or JavaScript!) files. Today, some runtimes and bundlers support loading TypeScript files directly, and in those cases, it doesn’t make sense to think about separate input and output files. Most of this document discusses cases where TypeScript files are compiled to JavaScript files, which in turn are loaded by the runtime module system. Examining these cases is essential for building an understanding of the compiler’s options and behavior—it’s easier to start there and simplify when thinking about esbuild, Bun, and other TypeScript-first runtimes and bundlers. So for now, we can summarize TypeScript’s job when it comes to modules in terms of output files:
Understand the rules of the host enough
to compile files into a valid output module format,
to ensure that imports in those outputs will resolve successfully, and
to know what type to assign to imported names.
Who is the host?
Before we move on, it’s worth making sure we’re on the same page about the term host, because it will come up frequently. We defined it before as “the system that ultimately consumes the output code to direct its module loading behavior.” In other words, it’s the system outside of TypeScript that TypeScript’s module analysis tries to model:
When the output code (whether produced by tsc or a third-party transpiler) is run directly in a runtime like Node.js, the runtime is the host.
When there is no “output code” because a runtime consumes TypeScript files directly, the runtime is still the host.
When a bundler consumes TypeScript inputs or outputs and produces a bundle, the bundler is the host, because it looked at the original set of imports/requires, looked up what files they referenced, and produced a new file or set of files where the original imports and requires are erased or transformed beyond recognition. (That bundle itself might comprise modules, and the runtime that runs it will be its host, but TypeScript doesn’t know about anything that happens post-bundler.)
If another transpiler, optimizer, or formatter runs on TypeScript’s outputs, it’s not a host that TypeScript cares about, as long as it leaves the imports and exports it sees alone.
When loading modules in a web browser, the behaviors TypeScript needs to model are actually split between the web server and the module system running in the browser. The browser’s JavaScript engine (or a script-based module-loading framework like RequireJS) controls what module formats are accepted, while the web server decides what file to send when one module triggers a request to load another.
The TypeScript compiler itself is not a host, because it does not provide any behavior related to modules beyond trying to model other hosts.
The module output format
In any project, the first question about modules we need to answer is what kinds of modules the host expects, so TypeScript can set its output format for each file to match. Sometimes, the host only supports one kind of module—ESM in the browser, or CJS in Node.js v11 and earlier, for example. Node.js v12 and later accepts both CJS and ES modules, but uses file extensions and package.json files to determine what format each file should be, and throws an error if the file’s contents don’t match the expected format.
The module compiler option provides this information to the compiler. Its primary purpose is to control the module format of any JavaScript that gets emitted during compilation, but it also serves to inform the compiler about how the module kind of each file should be detected, how different module kinds are allowed to import each other, and whether features like import.meta and top-level await are available. So, even if a TypeScript project is using noEmit, choosing the right setting for module still matters. As we established earlier, the compiler needs an accurate understanding of the module system so it can type check (and provide IntelliSense for) imports. See Choosing compiler options for guidance on choosing the right module setting for your project.
The available module settings are
node16: Reflects the module system of Node.js v16+, which supports ES modules and CJS modules side-by-side with particular interoperability and detection rules.
node18: Reflects the module system of Node.js v18+, which adds support for import attributes.
nodenext: A moving target reflecting the latest Node.js versions as Node.js’s module system evolves. As of TypeScript 5.8, nodenext supports require of ECMAScript modules.
es2015: Reflects the ES2015 language specification for JavaScript modules (the version that first introduced import and export to the language).
es2020: Adds support for import.meta and export * as ns from "mod" to es2015.
es2022: Adds support for top-level await to es2020.
esnext: Currently identical to es2022, but will be a moving target reflecting the latest ECMAScript specifications, as well as module-related Stage 3+ proposals that are expected to be included in upcoming specification versions.
commonjs, system, amd, and umd: Each emits everything in the module system named, and assumes everything can be successfully imported into that module system. These are no longer recommended for new projects and will not be covered in detail by this documentation.
Node.js’s rules for module format detection and interoperability make it incorrect to specify module as esnext or commonjs for projects that run in Node.js, even if all files emitted by tsc are ESM or CJS, respectively. The only correct module settings for projects that intend to run in Node.js are node16 and nodenext. While the emitted JavaScript for an all-ESM Node.js project might look identical between compilations using esnext and nodenext, the type checking can differ. See the reference section on nodenext for more details.
Module format detection
Node.js understands both ES modules and CJS modules, but the format of each file is determined by its file extension and the type field of the first package.json file found in a search of the file’s directory and all ancestor directories:
.mjs and .cjs files are always interpreted as ES modules and CJS modules, respectively.
.js files are interpreted as ES modules if the nearest package.json file contains a type field with the value "module". If there is no package.json file, or if the type field is missing or has any other value, .js files are interpreted as CJS modules.
If a file is determined to be an ES module by these rules, Node.js will not inject the CommonJS module and require objects into the file’s scope during evaluation, so a file that tries to use them will cause a crash. Conversely, if a file is determined to be a CJS module, import and export declarations in the file will cause a syntax error crash.
When the module compiler option is set to node16, node18, or nodenext, TypeScript applies this same algorithm to the project’s input files to determine the module kind of each corresponding output file. Let’s look at how module formats are detected in an example project that uses --module nodenext:
Input file name
Contents
Output file name
Module kind
Reason
/package.json
{}






/main.mts


/main.mjs
ESM
File extension
/utils.cts


/utils.cjs
CJS
File extension
/example.ts


/example.js
CJS
No "type": "module" in package.json
/node_modules/pkg/package.json
{ "type": "module" }






/node_modules/pkg/index.d.ts




ESM
"type": "module" in package.json
/node_modules/pkg/index.d.cts




CJS
File extension

When the input file extension is .mts or .cts, TypeScript knows to treat that file as an ES module or CJS module, respectively, because Node.js will treat the output .mjs file as an ES module or the output .cjs file as a CJS module. When the input file extension is .ts, TypeScript has to consult the nearest package.json file to determine the module format, because this is what Node.js will do when it encounters the output .js file. (Notice that the same rules apply to the .d.cts and .d.ts declaration files in the pkg dependency: though they will not produce an output file as part of this compilation, the presence of a .d.ts file implies the existence of a corresponding .js file—perhaps created when the author of the pkg library ran tsc on an input .ts file of their own—which Node.js must interpret as an ES module, due to its .js extension and the presence of the "type": "module" field in /node_modules/pkg/package.json. Declaration files are covered in more detail in a later section.)
The detected module format of input files is used by TypeScript to ensure it emits the output syntax that Node.js expects in each output file. If TypeScript were to emit /example.js with import and export statements in it, Node.js would crash when parsing the file. If TypeScript were to emit /main.mjs with require calls, Node.js would crash during evaluation. Beyond emit, the module format is also used to determine rules for type checking and module resolution, which we’ll discuss in the following sections.
As of TypeScript 5.6, other --module modes (like esnext and commonjs) also respect format-specific file extensions (.mts and .cts) as a file-level override for the emit format. For example, a file named main.mts will emit ESM syntax into main.mjs even if --module is set to commonjs.
It’s worth mentioning again that TypeScript’s behavior in --module node16, --module node18, and --module nodenext is entirely motivated by Node.js’s behavior. Since TypeScript’s goal is to catch potential runtime errors at compile time, it needs a very accurate model of what will happen at runtime. This fairly complex set of rules for module kind detection is necessary for checking code that will run in Node.js, but may be overly strict or just incorrect if applied to non-Node.js hosts.
Input module syntax
It’s important to note that the input module syntax seen in input source files is somewhat decoupled from the output module syntax emitted to JS files. That is, a file with an ESM import:
import { sayHello } from "greetings";
sayHello("world");
might be emitted in ESM format exactly as-is, or might be emitted as CommonJS:
Object.defineProperty(exports, "__esModule", { value: true });
const greetings_1 = require("greetings");
(0, greetings_1.sayHello)("world");
depending on the module compiler option (and any applicable module format detection rules, if the module option supports more than one kind of module). In general, this means that looking at the contents of an input file isn’t enough to determine whether it’s an ES module or a CJS module.
Today, most TypeScript files are authored using ESM syntax (import and export statements) regardless of the output format. This is largely a legacy of the long road ESM has taken to widespread support. ECMAScript modules were standardized in 2015, were supported in most browsers by 2017, and landed in Node.js v12 in 2019. During much of this window, it was clear that ESM was the future of JavaScript modules, but very few runtimes could consume it. Tools like Babel made it possible for JavaScript to be authored in ESM and downleveled to another module format that could be used in Node.js or browsers. TypeScript followed suit, adding support for ES module syntax and softly discouraging the use of the original CommonJS-inspired import fs = require("fs") syntax in the 1.5 release.
The upside of this “author ESM, output anything” strategy was that TypeScript could use standard JavaScript syntax, making the authoring experience familiar to newcomers, and (theoretically) making it easy for projects to start targeting ESM outputs in the future. There are three significant downsides, which became fully apparent only after ESM and CJS modules were allowed to coexist and interoperate in Node.js:
Early assumptions about how ESM/CJS interoperability would work in Node.js turned out to be wrong, and today, interoperability rules differ between Node.js and bundlers. Consequently, the configuration space for modules in TypeScript is large.
When the syntax in input files all looks like ESM, it’s easy for an author or code reviewer to lose track of what kind of module a file is at runtime. And because of Node.js’s interoperability rules, what kind of module each file is became very important.
When input files are written in ESM, the syntax in type declaration outputs (.d.ts files) looks like ESM too. But because the corresponding JavaScript files could have been emitted in any module format, TypeScript can’t tell what kind of module a file is just by looking at the contents of its type declarations. And again, because of the nature of ESM/CJS interoperability, TypeScript has to know what kind of module everything is in order to provide correct types and prevent imports that will crash.
In TypeScript 5.0, a new compiler option called verbatimModuleSyntax was introduced to help TypeScript authors know exactly how their import and export statements will be emitted. When enabled, the flag requires imports and exports in input files to be written in the form that will undergo the least amount of transformation before emit. So if a file will be emitted as ESM, imports and exports must be written in ESM syntax; if a file will be emitted as CJS, it must be written in the CommonJS-inspired TypeScript syntax (import fs = require("fs") and export = {}). This setting is particularly recommended for Node.js projects that use mostly ESM, but have a select few CJS files. It is not recommended for projects that currently target CJS, but may want to target ESM in the future.
ESM and CJS interoperability
Can an ES module import a CommonJS module? If so, does a default import link to exports or exports.default? Can a CommonJS module require an ES module? CommonJS isn’t part of the ECMAScript specification, so runtimes, bundlers, and transpilers have been free to make up their own answers to these questions since ESM was standardized in 2015, and as such no standard set of interoperability rules exist. Today, most runtimes and bundlers broadly fall into one of three categories:
ESM-only. Some runtimes, like browser engines, only support what’s actually a part of the language: ECMAScript Modules.
Bundler-like. Before any major JavaScript engine could run ES modules, Babel allowed developers to write them by transpiling them to CommonJS. The way these ESM-transpiled-to-CJS files interacted with hand-written-CJS files implied a set of permissive interoperability rules that have become the de facto standard for bundlers and transpilers.
Node.js. Until Node.js v22.12.0, CommonJS modules could not load ES modules synchronously (with require); they could only load them asynchronously with dynamic import() calls. ES modules can default-import CJS modules, which always binds to exports. (This means that a default import of a Babel-like CJS output with __esModule behaves differently between Node.js and some bundlers.)
TypeScript needs to know which of these rule sets to assume in order to provide correct types on (particularly default) imports and to error on imports that will crash at runtime. When the module compiler option is set to node16, node18, or nodenext, Node.js’s version-specific rules are enforced.1 All other module settings, combined with the esModuleInterop option, result in bundler-like interop in TypeScript. (While using --module esnext does prevent you from writing CommonJS modules, it does not prevent you from importing them as dependencies. There’s currently no TypeScript setting that can guard against an ES module importing a CommonJS module, as would be appropriate for direct-to-browser code.)
Module specifiers are not transformed by default
While the module compiler option can transform imports and exports in input files to different module formats in output files, the module specifier (the string from which you import, or pass to require) is emitted as-written. For example, an input like:
import { add } from "./math.mjs";
add(1, 2);
might be emitted as either:
import { add } from "./math.mjs";
add(1, 2);
or:
const math_1 = require("./math.mjs");
math_1.add(1, 2);
depending on the module compiler option, but the module specifier will be "./math.mjs" either way. By default, module specifiers must be written in a way that works for the code’s target runtime or bundler, and it’s TypeScript’s job to understand those output-relative specifiers. The process of finding the file referenced by a module specifier is called module resolution.
TypeScript 5.7 introduced the --rewriteRelativeImportExtensions option, which transforms relative module specifiers with .ts, .tsx, .mts, or .cts extensions to their JavaScript equivalents in output files. This option is useful for creating TypeScript files that can be run directly in Node.js during development and still be compiled to JavaScript outputs for distribution or production use.
This documentation was written before the introduction of --rewriteRelativeImportExtensions, and the mental model it presents is built around modeling the behavior of the host module system operating on its input files, whether that’s a bundler operating on TypeScript files or a runtime operating on .js outputs. With --rewriteRelativeImportExtensions, the way to apply that mental model is to apply it twice: once to the runtime or bundler processing the TypeScript input files directly, and once again to the runtime or bundler processing the transformed outputs. Most of this documentation assumes that only the input files or only the output files will be loaded, but the principles it presents can be extended to the case where both are loaded.
Module resolution
Let’s return to our first example and review what we’ve learned about it so far:
import sayHello from "greetings";
sayHello("world");
So far, we’ve discussed how the host’s module system and TypeScript’s module compiler option might impact this code. We know that the input syntax looks like ESM, but the output format depends on the module compiler option, potentially the file extension, and package.json "type" field. We also know that what sayHello gets bound to, and even whether the import is even allowed, may vary depending on the module kinds of this file and the target file. But we haven’t yet discussed how to find the target file.
Module resolution is host-defined
While the ECMAScript specification defines how to parse and interpret import and export statements, it leaves module resolution up to the host. If you’re creating a hot new JavaScript runtime, you’re free to create a module resolution scheme like:
import monkey from "🐒"; // Looks for './eats/bananas.js'
import cow from "🐄";    // Looks for './eats/grass.js'
import lion from "🦁";   // Looks for './eats/you.js'
and still claim to implement “standards-compliant ESM.” Needless to say, TypeScript would have no idea what types to assign to monkey, cow, and lion without built-in knowledge of this runtime’s module resolution algorithm. Just as module informs the compiler about the host’s expected module format, moduleResolution, along with a few customization options, specify the algorithm the host uses to resolve module specifiers to files. This also clarifies why TypeScript doesn’t modify import specifiers during emit: the relationship between an import specifier and a file on disk (if one even exists) is host-defined, and TypeScript is not a host.
The available moduleResolution options are:
classic: TypeScript’s oldest module resolution mode, this is unfortunately the default when module is set to anything other than commonjs, node16, or nodenext. It was probably made to provide best-effort resolution for a wide range of RequireJS configurations. It should not be used for new projects (or even old projects that don’t use RequireJS or another AMD module loader), and is scheduled for deprecation in TypeScript 6.0.
node10: Formerly known as node, this is the unfortunate default when module is set to commonjs. It’s a pretty good model of Node.js versions older than v12, and sometimes it’s a passable approximation of how most bundlers do module resolution. It supports looking up packages from node_modules, loading directory index.js files, and omitting .js extensions in relative module specifiers. Because Node.js v12 introduced different module resolution rules for ES modules, though, it’s a very bad model of modern versions of Node.js. It should not be used for new projects.
node16: This is the counterpart of --module node16 and --module node18 and is set by default with that module setting. Node.js v12 and later support both ESM and CJS, each of which uses its own module resolution algorithm. In Node.js, module specifiers in import statements and dynamic import() calls are not allowed to omit file extensions or /index.js suffixes, while module specifiers in require calls are. This module resolution mode understands and enforces this restriction where necessary, as determined by the module format detection rules instated by --module node16/node18. (For node16 and nodenext, module and moduleResolution go hand-in-hand: setting one to node16 or nodenext while setting the other to something else is an error.)
nodenext: Currently identical to node16, this is the counterpart of --module nodenext and is set by default with that module setting. It’s intended to be a forward-looking mode that will support new Node.js module resolution features as they’re added.
bundler: Node.js v12 introduced some new module resolution features for importing npm packages—the "exports" and "imports" fields of package.json—and many bundlers adopted those features without also adopting the stricter rules for ESM imports. This module resolution mode provides a base algorithm for code targeting a bundler. It supports package.json "exports" and "imports" by default, but can be configured to ignore them. It requires setting module to esnext.
TypeScript imitates the host’s module resolution, but with types
Remember the three components of TypeScript’s job concerning modules?
Compile files into a valid output module format
Ensure that imports in those outputs will resolve successfully
Know what type to assign to imported names.
Module resolution is needed to accomplish last two. But when we spend most of our time working in input files, it can be easy to forget about (2)—that a key component of module resolution is validating that the imports or require calls in the output files, containing the same module specifiers as the input files, will actually work at runtime. Let’s look at a new example with multiple files:
// @Filename: math.ts
export function add(a: number, b: number) {
 return a + b;
}
// @Filename: main.ts
import { add } from "./math";
add(1, 2);
When we see the import from "./math", it might be tempting to think, “This is how one TypeScript file refers to another. The compiler follows this (extensionless) path in order to assign a type to add.”

This isn’t entirely wrong, but the reality is deeper. The resolution of "./math" (and subsequently, the type of add) need to reflect the reality of what happens at runtime to the output files. A more robust way to think about this process would look like this:

This model makes it clear that for TypeScript, module resolution is mostly a matter of accurately modeling the host’s module resolution algorithm between output files, with a little bit of remapping applied to find type information. Let’s look at another example that appears unintuitive through the lens of the simple model, but makes perfect sense with the robust model:
// @moduleResolution: node16
// @rootDir: src
// @outDir: dist
// @Filename: src/math.mts
export function add(a: number, b: number) {
 return a + b;
}
// @Filename: src/main.mts
import { add } from "./math.mjs";
add(1, 2);
Node.js ESM import declarations use a strict module resolution algorithm that requires relative paths to include file extensions. When we only think about input files, it’s a little strange that "./math.mjs" seems to resolve to math.mts. Since we’re using an outDir to put compiled outputs in a different directory, math.mjs doesn’t even exist next to main.mts! Why should this resolve? With our new mental model, it’s no problem:

Understanding this mental model may not immediately eliminate the strangeness of seeing output file extensions in input files, and it’s natural to think in terms of shortcuts: "./math.mjs" refers to the input file math.mts. I have to write the output extension, but the compiler knows to look for .mts when I write .mjs. This shortcut is even how the compiler works internally, but the more robust mental model explains why module resolution in TypeScript works this way: given the constraint that the module specifier in the output file will be the same as the module specifier in the input file, this is the only process that accomplishes our two goals of validating output files and assigning types.
The role of declaration files
In the previous example, we saw the “remapping” part of module resolution working between input and output files. But what happens when we import library code? Even if the library was written in TypeScript, it may not have published its source code. If we can’t rely on mapping the library’s JavaScript files back to a TypeScript file, we can verify that our import works at runtime, but how do we accomplish our second goal of assigning types?
This is where declaration files (.d.ts, .d.mts, etc.) come into play. The best way to understand how declaration files are interpreted is to understand where they come from. When you run tsc --declaration on an input file, you get one output JavaScript file and one output declaration file:

Because of this relationship, the compiler assumes that wherever it sees a declaration file, there is a corresponding JavaScript file that is perfectly described by the type information in the declaration file. For performance reasons, in every module resolution mode, the compiler always looks for TypeScript and declaration files first, and if it finds one, it doesn’t continue looking for the corresponding JavaScript file. If it finds a TypeScript input file, it knows a JavaScript file will exist after compilation, and if it finds a declaration file, it knows a compilation (perhaps someone else’s) already happened and created a JavaScript file at the same time as the declaration file.
The declaration file tells the compiler not only that a JavaScript file exists, but also what its name and extension are:
Declaration file extension
JavaScript file extension
TypeScript file extension
.d.ts
.js
.ts
.d.ts
.js
.tsx
.d.mts
.mjs
.mts
.d.cts
.cjs
.cts
.d.*.ts
.*



The last row expresses that non-JS files can be typed with the allowArbitraryExtensions compiler option to support cases where the module system supports importing non-JS files as JavaScript objects. For example, a file named styles.css can be represented by a declaration file named styles.d.css.ts.
“But wait! Plenty of declaration files are written by hand, not generated by tsc. Ever heard of DefinitelyTyped?” you might object. And it’s true—hand-writing declaration files, or even moving/copying/renaming them to represent outputs of an external build tool, is a dangerous, error-prone venture. DefinitelyTyped contributors and authors of typed libraries not using tsc to generate both JavaScript and declaration files should ensure that every JavaScript file has a sibling declaration file with the same name and matching extension. Breaking from this structure can lead to false-positive TypeScript errors for end users. The npm package @arethetypeswrong/cli can help catch and explain these errors before they’re published.
Module resolution for bundlers, TypeScript runtimes, and Node.js loaders
So far, we’ve really emphasized the distinction between input files and output files. Recall that when specifying a file extension on a relative module specifier, TypeScript typically makes you use the output file extension:
// @Filename: src/math.ts
export function add(a: number, b: number) {
 return a + b;
}
// @Filename: src/main.ts
import { add } from "./math.ts";
//                  ^^^^^^^^^^^
// An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled.
This restriction applies since TypeScript won’t rewrite the extension to .js, and if "./math.ts" appears in an output JS file, that import won’t resolve to another JS file at runtime. TypeScript really wants to prevent you from generating an unsafe output JS file. But what if there is no output JS file? What if you’re in one of these situations:
You’re bundling this code, the bundler is configured to transpile TypeScript files in-memory, and it will eventually consume and erase all the imports you’ve written to produce a bundle.
You’re running this code directly in a TypeScript runtime like Deno or Bun.
You’re using ts-node, tsx, or another transpiling loader for Node.
In these cases, you can turn on noEmit (or emitDeclarationOnly) and allowImportingTsExtensions to disable emitting unsafe JavaScript files and silence the error on .ts-extensioned imports.
With or without allowImportingTsExtensions, it’s still important to pick the most appropriate moduleResolution setting for the module resolution host. For bundlers and the Bun runtime, it’s bundler. These module resolvers were inspired by Node.js, but didn’t adopt the strict ESM resolution algorithm that disables extension searching that Node.js applies to imports. The bundler module resolution setting reflects this, enabling package.json "exports" support like node16—nodenext, while always allowing extensionless imports. See Choosing compiler options for more guidance.
Module resolution for libraries
When compiling an app, you choose the moduleResolution option for a TypeScript project based on who the module resolution host is. When compiling a library, you don’t know where the output code will run, but you’d like it to run in as many places as possible. Using "module": "node18" (along with the implied "moduleResolution": "node16") is the best bet for maximizing the compatibility of the output JavaScript’s module specifiers, since it will force you to comply with Node.js’s stricter rules for import module resolution. Let’s look at what would happen if a library were to compile with "moduleResolution": "bundler" (or worse, "node10"):
export * from "./utils";
Assuming ./utils.ts (or ./utils/index.ts) exists, a bundler would be fine with this code, so "moduleResolution": "bundler" doesn’t complain. Compiled with "module": "esnext", the output JavaScript for this export statement will look exactly the same as the input. If that JavaScript were published to npm, it would be usable by projects that use a bundler, but it would cause an error when run in Node.js:
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../node_modules/dependency/utils' imported from .../node_modules/dependency/index.js
Did you mean to import ./utils.js?
On the other hand, if we had written:
export * from "./utils.js";
This would produce output that works both in Node.js and in bundlers.
In short, "moduleResolution": "bundler" is infectious, allowing code that only works in bundlers to be produced. Likewise, "moduleResolution": "nodenext" is only checking that the output works in Node.js, but in most cases, module code that works in Node.js will work in other runtimes and in bundlers.
Of course, this guidance can only apply in cases where the library ships outputs from tsc. If the library is being bundled before shipping, "moduleResolution": "bundler" may be acceptable. Any build tool that changes the module format or module specifiers to produce the final build of the library bears the responsibility of ensuring the safety and compatibility of the product’s module code, and tsc can no longer contribute to that task, since it can’t know what module code will exist at runtime.

In Node.js v22.12.0 and later, a require of an ES module is allowed, but only if the resolved module and its top-level imports don’t use top-level await. TypeScript does not try to enforce this rule, as it lacks the ability to tell from a declaration file whether the corresponding JavaScript file contains top-level await.↩
Modules - Choosing Compiler Options
I’m writing an app
A single tsconfig.json can only represent a single environment, both in terms of what globals are available and in terms of how modules behave. If your app contains server code, DOM code, web worker code, test code, and code to be shared by all of those, each of those should have its own tsconfig.json, connected with project references. Then, use this guide once for each tsconfig.json. For library-like projects within an app, especially ones that need to run in multiple runtime environments, use the “I’m writing a library” section.
I’m using a bundler
In addition to adopting the following settings, it’s also recommended not to set { "type": "module" } or use .mts files in bundler projects for now. Some bundlers adopt different ESM/CJS interop behavior under these circumstances, which TypeScript cannot currently analyze with "moduleResolution": "bundler". See issue #54102 for more information.
{
 "compilerOptions": {
   // This is not a complete template; it only
   // shows relevant module-related settings.
   // Be sure to set other important options
   // like `target`, `lib`, and `strict`.
   // Required
   "module": "esnext",
   "moduleResolution": "bundler",
   "esModuleInterop": true,
   // Consult your bundler’s documentation
   "customConditions": ["module"],
   // Recommended
   "noEmit": true, // or `emitDeclarationOnly`
   "allowImportingTsExtensions": true,
   "allowArbitraryExtensions": true,
   "verbatimModuleSyntax": true, // or `isolatedModules`
 }
}
I’m compiling and running the outputs in Node.js
Remember to set "type": "module" or use .mts files if you intend to emit ES modules.
{
 "compilerOptions": {
   // This is not a complete template; it only
   // shows relevant module-related settings.
   // Be sure to set other important options
   // like `target`, `lib`, and `strict`.
   // Required
   "module": "nodenext",
   // Implied by `"module": "nodenext"`:
   // "moduleResolution": "nodenext",
   // "esModuleInterop": true,
   // "target": "esnext",
   // Recommended
   "verbatimModuleSyntax": true,
 }
}
I’m using ts-node
ts-node attempts to be compatible with the same code and the same tsconfig.json settings that can be used to compile and run the JS outputs in Node.js. Refer to ts-node documentation for more details.
I’m using tsx
Whereas ts-node makes minimal modifications to Node.js’s module system by default, tsx behaves more like a bundler, allowing extensionless/index module specifiers and arbitrary mixing of ESM and CJS. Use the same settings for tsx as you would for a bundler.
I’m writing ES modules for the browser, with no bundler or module compiler
TypeScript does not currently have options dedicated to this scenario, but you can approximate them by using a combination of the nodenext ESM module resolution algorithm and paths as a substitute for URL and import map support.
// tsconfig.json
{
 "compilerOptions": {
   // This is not a complete template; it only
   // shows relevant module-related settings.
   // Be sure to set other important options
   // like `target`, `lib`, and `strict`.
   // Combined with `"type": "module"` in a local package.json,
   // this enforces including file extensions on relative path imports.
   "module": "nodenext",
   "paths": {
     // Point TS to local types for remote URLs:
     "https://esm.sh/lodash@4.17.21": ["./node_modules/@types/lodash/index.d.ts"],
     // Optional: point bare specifier imports to an empty file
     // to prohibit importing from node_modules specifiers not listed here:
     "*": ["./empty-file.ts"]
   }
 }
}
This setup allows explicitly listed HTTPS imports to use locally-installed type declaration files, while erroring on imports that would normally resolve in node_modules:
import {} from "lodash";
//             ^^^^^^^^
// File '/project/empty-file.ts' is not a module. ts(2306)
Alternatively, you can use import maps to explicitly map a list of bare specifiers to URLs in the browser, while relying on nodenext’s default node_modules lookups, or on paths, to direct TypeScript to type declaration files for those bare specifier imports:
<script type="importmap">
{
 "imports": {
   "lodash": "https://esm.sh/lodash@4.17.21"
 }
}
</script>
import {} from "lodash";
// Browser: https://esm.sh/lodash@4.17.21
// TypeScript: ./node_modules/@types/lodash/index.d.ts
I’m writing a library
Choosing compilation settings as a library author is a fundamentally different process from choosing settings as an app author. When writing an app, settings are chosen that reflect the runtime environment or bundler—typically a single entity with known behavior. When writing a library, you would ideally check your code under all possible library consumer compilation settings. Since this is impractical, you can instead use the strictest possible settings, since satisfying those tends to satisfy all others.
{
 "compilerOptions": {
   "module": "node18",
   "target": "es2020", // set to the *lowest* target you support
   "strict": true,
   "verbatimModuleSyntax": true,
   "declaration": true,
   "sourceMap": true,
   "declarationMap": true,
   "rootDir": "src",
   "outDir": "dist"
 }
}
Let’s examine why we picked each of these settings:
module: "node18". When a codebase is compatible with Node.js’s module system, it almost always works in bundlers as well. If you’re using a third-party emitter to emit ESM outputs, ensure that you set "type": "module" in your package.json so TypeScript checks your code as ESM, which uses a stricter module resolution algorithm in Node.js than CommonJS does. As an example, let’s look at what would happen if a library were to compile with "moduleResolution": "bundler":
export * from "./utils";
Assuming ./utils.ts (or ./utils/index.ts) exists, a bundler would be fine with this code, so "moduleResolution": "bundler" doesn’t complain. Compiled with "module": "esnext", the output JavaScript for this export statement will look exactly the same as the input. If that JavaScript were published to npm, it would be usable by projects that use a bundler, but it would cause an error when run in Node.js:
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../node_modules/dependency/utils' imported from .../node_modules/dependency/index.js
Did you mean to import ./utils.js?
On the other hand, if we had written:
export * from "./utils.js";
This would produce output that works both in Node.js and in bundlers.
In short, "moduleResolution": "bundler" is infectious, allowing code that only works in bundlers to be produced. Likewise, "moduleResolution": "nodenext" is only checking that the output works in Node.js, but in most cases, module code that works in Node.js will work in other runtimes and in bundlers.
target: "es2020". Setting this value to the lowest ECMAScript version that you intend to support ensures the emitted code will not use language features introduced in a later version. Since target also implies a corresponding value for lib, this also ensures you don’t access globals that may not be available in older environments.
strict: true. Without this, you may write type-level code that ends up in your output .d.ts files and errors when a consumer compiles with strict enabled. For example, this extends clause:
export interface Super {
  foo: string;
}
export interface Sub extends Super {
  foo: string | undefined;
}
is only an error under strictNullChecks. On the other hand, it’s very difficult to write code that errors only when strict is disabled, so it’s highly recommended for libraries to compile with strict.
verbatimModuleSyntax: true. This setting protects against a few module-related pitfalls that can cause problems for library consumers. First, it prevents writing any import statements that could be interpreted ambiguously based on the user’s value of esModuleInterop or allowSyntheticDefaultImports. Previously, it was often suggested that libraries compile without esModuleInterop, since its use in libraries could force users to adopt it too. However, it’s also possible to write imports that only work without esModuleInterop, so neither value for the setting guarantees portability for libraries. verbatimModuleSyntax does provide such a guarantee.1 Second, it prevents the use of export default in modules that will be emitted as CommonJS, which can require bundler users and Node.js ESM users to consume the module differently. See the appendix on ESM/CJS Interop for more details.
declaration: true emits type declaration files alongside the output JavaScript. This is needed for consumers of the library to have any type information.
sourceMap: true and declarationMap: true emit source maps for the output JavaScript and type declaration files, respectively. These are only useful if the library also ships its source (.ts) files. By shipping source maps and source files, consumers of the library will be able to debug the library code somewhat more easily. By shipping declaration maps and source files, consumers will be able to see the original TypeScript sources when they run Go To Definition on imports from the libraries. Both of these represent a tradeoff between developer experience and library size, so it’s up to you whether to include them.
rootDir: "src" and outDir: "dist". Using a separate output directory is always a good idea, but it’s necessary for libraries that publish their input files. Otherwise, extension substitution will cause the library’s consumers to load the library’s .ts files instead of .d.ts files, causing type errors and performance problems.
Considerations for bundling libraries
If you’re using a bundler to emit your library, then all your (non-externalized) imports will be processed by the bundler with known behavior, not by your users’ unknowable environments. In this case, you can use "module": "esnext" and "moduleResolution": "bundler", but only with two caveats:
TypeScript cannot model module resolution when some files are bundled and some are externalized. When bundling libraries with dependencies, it’s common to bundle the first-party library source code into a single file, but leave imports of external dependencies as real imports in the bundled output. This essentially means module resolution is split between the bundler and the end user’s environment. To model this in TypeScript, you would want to process bundled imports with "moduleResolution": "bundler" and externalized imports with "moduleResolution": "nodenext" (or with multiple options to check that everything will work in a range of end-user environments). But TypeScript cannot be configured to use two different module resolution settings in the same compilation. As a consequence, using "moduleResolution": "bundler" may allow imports of externalized dependencies that would work in a bundler but are unsafe in Node.js. On the other hand, using "moduleResolution": "nodenext" may impose overly strict requirements on bundled imports.
You must ensure that your declaration files get bundled as well. Recall the first rule of declaration files: every declaration file represents exactly one JavaScript file. If you use "moduleResolution": "bundler" and use a bundler to emit an ESM bundle while using tsc to emit many individual declaration files, your declaration files may cause errors when consumed under "module": "nodenext". For example, an input file like:
import { Component } from "./extensionless-relative-import";
will have its import erased by the JS bundler, but produce a declaration file with an identical import statement. That import statement, however, will contain an invalid module specifier in Node.js, since it’s missing a file extension. For Node.js users, TypeScript will error on the declaration file and infect types referencing Component with any, assuming the dependency will crash at runtime.
If your TypeScript bundler does not produce bundled declaration files, use "moduleResolution": "nodenext" to ensure that the imports preserved in your declaration files will be compatible with end-users’ TypeScript settings. Even better, consider not bundling your library.
Notes on dual-emit solutions
A single TypeScript compilation (whether emitting or just type checking) assumes that each input file will only produce one output file. Even if tsc isn’t emitting anything, the type checking it performs on imported names rely on knowledge about how the output file will behave at runtime, based on the module- and emit-related options set in the tsconfig.json. While third-party emitters are generally safe to use in combination with tsc type checking as long as tsc can be configured to understand what the other emitter will emit, any solution that emits two different sets of outputs with different module formats while only type checking once leaves (at least) one of the outputs unchecked. Because external dependencies may expose different APIs to CommonJS and ESM consumers, there’s no configuration you can use to guarantee in a single compilation that both outputs will be type-safe. In practice, most dependencies follow best practices and dual-emit outputs work. Running tests and static analysis against all output bundles before publishing significantly reduces the chance of a serious problem going unnoticed.

verbatimModuleSyntax can only work when the JS emitter emits the same module kind as tsc would given the tsconfig.json, source file extension, and package.json "type". The option works by enforcing that the import/require written is identical to the import/require emitted. Any configuration that produces both an ESM and a CJS output from the same source file is fundamentally incompatible with verbatimModuleSyntax, since its whole purpose is to prevent you from writing import anywhere that a require would be emitted. verbatimModuleSyntax can also be defeated by configuring a third-party emitter to emit a different module kind than tsc would—for example, by setting "module": "esnext" in tsconfig.json while configuring Babel to emit CommonJS.↩
Modules - Reference
Module syntax
The TypeScript compiler recognizes standard ECMAScript module syntax in TypeScript and JavaScript files and many forms of CommonJS syntax in JavaScript files.
There are also a few TypeScript-specific syntax extensions that can be used in TypeScript files and/or JSDoc comments.
Importing and exporting TypeScript-specific declarations
Type aliases, interfaces, enums, and namespaces can be exported from a module with an export modifier, like any standard JavaScript declaration:
// Standard JavaScript syntax...
export function f() {}
// ...extended to type declarations
export type SomeType = /* ... */;
export interface SomeInterface { /* ... */ }
They can also be referenced in named exports, even alongside references to standard JavaScript declarations:
export { f, SomeType, SomeInterface };
Exported types (and other TypeScript-specific declarations) can be imported with standard ECMAScript imports:
import { f, SomeType, SomeInterface } from "./module.js";
When using namespace imports or exports, exported types are available on the namespace when referenced in a type position:
import * as mod from "./module.js";
mod.f();
mod.SomeType; // Property 'SomeType' does not exist on type 'typeof import("./module.js")'
let x: mod.SomeType; // Ok
Type-only imports and exports
When emitting imports and exports to JavaScript, by default, TypeScript automatically elides (does not emit) imports that are only used in type positions and exports that only refer to types. Type-only imports and exports can be used to force this behavior and make the elision explicit. Import declarations written with import type, export declarations written with export type { ... }, and import or export specifiers prefixed with the type keyword are all guaranteed to be elided from the output JavaScript.
// @Filename: main.ts
import { f, type SomeInterface } from "./module.js";
import type { SomeType } from "./module.js";
class C implements SomeInterface {
 constructor(p: SomeType) {
   f();
 }
}
export type { C };
// @Filename: main.js
import { f } from "./module.js";
class C {
 constructor(p) {
   f();
 }
}
Even values can be imported with import type, but since they won’t exist in the output JavaScript, they can only be used in non-emitting positions:
import type { f } from "./module.js";
f(); // 'f' cannot be used as a value because it was imported using 'import type'
let otherFunction: typeof f = () => {}; // Ok
A type-only import declaration may not declare both a default import and named bindings, since it appears ambiguous whether type applies to the default import or to the entire import declaration. Instead, split the import declaration into two, or use default as a named binding:
import type fs, { BigIntOptions } from "fs";
//          ^^^^^^^^^^^^^^^^^^^^^
// Error: A type-only import can specify a default import or named bindings, but not both.
import type { default as fs, BigIntOptions } from "fs"; // Ok
import() types
TypeScript provides a type syntax similar to JavaScript’s dynamic import for referencing the type of a module without writing an import declaration:
// Access an exported type:
type WriteFileOptions = import("fs").WriteFileOptions;
// Access the type of an exported value:
type WriteFileFunction = typeof import("fs").writeFile;
This is especially useful in JSDoc comments in JavaScript files, where it’s not possible to import types otherwise:
/** @type {import("webpack").Configuration} */
module.exports = {
 // ...
}
export = and import = require()
When emitting CommonJS modules, TypeScript files can use a direct analog of module.exports = ... and const mod = require("...") JavaScript syntax:
// @Filename: main.ts
import fs = require("fs");
export = fs.readFileSync("...");
// @Filename: main.js
"use strict";
const fs = require("fs");
module.exports = fs.readFileSync("...");
This syntax was used over its JavaScript counterparts since variable declarations and property assignments could not refer to TypeScript types, whereas special TypeScript syntax could:
// @Filename: a.ts
interface Options { /* ... */ }
module.exports = Options; // Error: 'Options' only refers to a type, but is being used as a value here.
export = Options; // Ok
// @Filename: b.ts
const Options = require("./a");
const options: Options = { /* ... */ }; // Error: 'Options' refers to a value, but is being used as a type here.
// @Filename: c.ts
import Options = require("./a");
const options: Options = { /* ... */ }; // Ok
Ambient modules
TypeScript supports a syntax in script (non-module) files for declaring a module that exists in the runtime but has no corresponding file. These ambient modules usually represent runtime-provided modules, like "fs" or "path" in Node.js:
declare module "path" {
 export function normalize(p: string): string;
 export function join(...paths: any[]): string;
 export var sep: string;
}
Once an ambient module is loaded into a TypeScript program, TypeScript will recognize imports of the declared module in other files:
// 👇 Ensure the ambient module is loaded -
//    may be unnecessary if path.d.ts is included
//    by the project tsconfig.json somehow.
/// <reference path="path.d.ts" />
import { normalize, join } from "path";
Ambient module declarations are easy to confuse with module augmentations since they use identical syntax. This module declaration syntax becomes a module augmentation when the file is a module, meaning it has a top-level import or export statement (or is affected by --moduleDetection force or auto):
// Not an ambient module declaration anymore!
export {};
declare module "path" {
 export function normalize(p: string): string;
 export function join(...paths: any[]): string;
 export var sep: string;
}
Ambient modules may use imports inside the module declaration body to refer to other modules without turning the containing file into a module (which would make the ambient module declaration a module augmentation):
declare module "m" {
 // Moving this outside "m" would totally change the meaning of the file!
 import { SomeType } from "other";
 export function f(): SomeType;
}
A pattern ambient module contains a single * wildcard character in its name, matching zero or more characters in import paths. This can be useful for declaring modules provided by custom loaders:
declare module "*.html" {
 const content: string;
 export default content;
}
The module compiler option
This section discusses the details of each module compiler option value. See the Module output format theory section for more background on what the option is and how it fits into the overall compilation process. In brief, the module compiler option was historically only used to control the output module format of emitted JavaScript files. The more recent node16, node18, and nodenext values, however, describe a wide range of characteristics of Node.js’s module system, including what module formats are supported, how the module format of each file is determined, and how different module formats interoperate.
node16, node18, nodenext
Node.js supports both CommonJS and ECMAScript modules, with specific rules for which format each file can be and how the two formats are allowed to interoperate. node16, node18, and nodenext describe the full range of behavior for Node.js’s dual-format module system, and emit files in either CommonJS or ESM format. This is different from every other module option, which are runtime-agnostic and force all output files into a single format, leaving it to the user to ensure the output is valid for their runtime.
A common misconception is that node16—nodenext only emit ES modules. In reality, these modes describe versions of Node.js that support ES modules, not just projects that use ES modules. Both ESM and CommonJS emit are supported, based on the detected module format of each file. Because they are the only module options that reflect the complexities of Node.js’s dual module system, they are the only correct module options for all apps and libraries that are intended to run in Node.js v12 or later, whether they use ES modules or not.
The fixed-version node16 and node18 modes represent the module system behavior stabilized in their respective Node.js versions, while the nodenext mode changes with the latest stable versions of Node.js. The following table summarizes the current differences between the three modes:


target
moduleResolution
import assertions
import attributes
JSON imports
require(esm)
node16
es2022
node16
❌
❌
no restrictions
❌
node18
es2022
node16
✅
✅
needs type "json"
❌
nodenext
esnext
nodenext
❌
✅
needs type "json"
✅

Module format detection
.mts/.mjs/.d.mts files are always ES modules.
.cts/.cjs/.d.cts files are always CommonJS modules.
.ts/.tsx/.js/.jsx/.d.ts files are ES modules if the nearest ancestor package.json file contains "type": "module", otherwise CommonJS modules.
The detected module format of input .ts/.tsx/.mts/.cts files determines the module format of the emitted JavaScript files. So, for example, a project consisting entirely of .ts files will emit all CommonJS modules by default under --module nodenext, and can be made to emit all ES modules by adding "type": "module" to the project package.json.
Interoperability rules
When an ES module references a CommonJS module:
The module.exports of the CommonJS module is available as a default import to the ES module.
Properties (other than default) of the CommonJS module’s module.exports may or may not be available as named imports to the ES module. Node.js attempts to make them available via static analysis. TypeScript cannot know from a declaration file whether that static analysis will succeed, and optimistically assumes it will. This limits TypeScript’s ability to catch named imports that may crash at runtime. See #54018 for more details.
When a CommonJS module references an ES module:
In node16 and node18, require cannot reference an ES module. For TypeScript, this includes import statements in files that are detected to be CommonJS modules, since those import statements will be transformed to require calls in the emitted JavaScript.
In nodenext, to reflect the behavior of Node.js v22.12.0 and later, require can reference an ES module. In Node.js, an error is thrown if the ES module, or any of its imported modules, uses top-level await. TypeScript does not attempt to detect this case and will not emit a compile-time error. The result of the require call is the module’s Module Namespace Object, i.e., the same as the result of an await import() of the same module (but without the need to await anything).
A dynamic import() call can always be used to import an ES module. It returns a Promise of the module’s Module Namespace Object (what you’d get from import * as ns from "./module.js" from another ES module).
Emit
The emit format of each file is determined by the detected module format of each file. ESM emit is similar to --module esnext, but has a special transformation for import x = require("..."), which is not allowed in --module esnext:
// @Filename: main.ts
import x = require("mod");
// @Filename: main.js
import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
const x = __require("mod");
CommonJS emit is similar to --module commonjs, but dynamic import() calls are not transformed. Emit here is shown with esModuleInterop enabled:
// @Filename: main.ts
import fs from "fs"; // transformed
const dynamic = import("mod"); // not transformed
// @Filename: main.js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
   return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs")); // transformed
const dynamic = import("mod"); // not transformed
Implied and enforced options
--module nodenext implies and enforces --moduleResolution nodenext.
--module node18 or node16 implies and enforces --moduleResolution node16.
--module nodenext implies --target esnext.
--module node18 or node16 implies --target es2022.
--module nodenext or node18 or node16 implies --esModuleInterop.
Summary
node16, node18, and nodenext are the only correct module options for all apps and libraries that are intended to run in Node.js v12 or later, whether they use ES modules or not.
node16, node18, and nodenext emit files in either CommonJS or ESM format, based on the detected module format of each file.
Node.js’s interoperability rules between ESM and CJS are reflected in type checking.
ESM emit transforms import x = require("...") to a require call constructed from a createRequire import.
CommonJS emit leaves dynamic import() calls untransformed, so CommonJS modules can asynchronously import ES modules.
preserve
In --module preserve (added in TypeScript 5.4), ECMAScript imports and exports written in input files are preserved in the output, and CommonJS-style import x = require("...") and export = ... statements are emitted as CommonJS require and module.exports. In other words, the format of each individual import or export statement is preserved, rather than being coerced into a single format for the whole compilation (or even a whole file).
While it’s rare to need to mix imports and require calls in the same file, this module mode best reflects the capabilities of most modern bundlers, as well as the Bun runtime.
Why care about TypeScript’s module emit with a bundler or with Bun, where you’re likely also setting noEmit? TypeScript’s type checking and module resolution behavior are affected by the module format that it would emit. Setting module gives TypeScript information about how your bundler or runtime will process imports and exports, which ensures that the types you see on imported values accurately reflect what will happen at runtime or after bundling. See --moduleResolution bundler for more discussion.
Examples
// @Filename: main.ts
import x, { y, z } from "mod";
import mod = require("mod");
const dynamic = import("mod");
export const e1 = 0;
export default "default export";
// @Filename: main.js
import x, { y, z } from "mod";
const mod = require("mod");
const dynamic = import("mod");
export const e1 = 0;
export default "default export";
Implied and enforced options
--module preserve implies --moduleResolution bundler.
--module preserve implies --esModuleInterop.
The option --esModuleInterop is enabled by default in --module preserve only for its type checking behavior. Since imports never transform into require calls in --module preserve, --esModuleInterop does not affect the emitted JavaScript.
es2015, es2020, es2022, esnext
Summary
Use esnext with --moduleResolution bundler for bundlers, Bun, and tsx.
Do not use for Node.js. Use node16, node18, or nodenext with "type": "module" in package.json to emit ES modules for Node.js.
import mod = require("mod") is not allowed in non-declaration files.
es2020 adds support for import.meta properties.
es2022 adds support for top-level await.
esnext is a moving target that may include support for Stage 3 proposals to ECMAScript modules.
Emitted files are ES modules, but dependencies may be any format.
Examples
// @Filename: main.ts
import x, { y, z } from "mod";
import * as mod from "mod";
const dynamic = import("mod");
console.log(x, y, z, mod, dynamic);
export const e1 = 0;
export default "default export";
// @Filename: main.js
import x, { y, z } from "mod";
import * as mod from "mod";
const dynamic = import("mod");
console.log(x, y, z, mod, dynamic);
export const e1 = 0;
export default "default export";
commonjs
Summary
You probably shouldn’t use this. Use node16, node18, or nodenext to emit CommonJS modules for Node.js.
Emitted files are CommonJS modules, but dependencies may be any format.
Dynamic import() is transformed to a Promise of a require() call.
esModuleInterop affects the output code for default and namespace imports.
Examples
Output is shown with esModuleInterop: false.
// @Filename: main.ts
import x, { y, z } from "mod";
import * as mod from "mod";
const dynamic = import("mod");
console.log(x, y, z, mod, dynamic);
export const e1 = 0;
export default "default export";
// @Filename: main.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.e1 = void 0;
const mod_1 = require("mod");
const mod = require("mod");
const dynamic = Promise.resolve().then(() => require("mod"));
console.log(mod_1.default, mod_1.y, mod_1.z, mod);
exports.e1 = 0;
exports.default = "default export";
// @Filename: main.ts
import mod = require("mod");
console.log(mod);
export = {
   p1: true,
   p2: false
};
// @Filename: main.js
"use strict";
const mod = require("mod");
console.log(mod);
module.exports = {
   p1: true,
   p2: false
};
system
Summary
Designed for use with the SystemJS module loader.
Examples
// @Filename: main.ts
import x, { y, z } from "mod";
import * as mod from "mod";
const dynamic = import("mod");
console.log(x, y, z, mod, dynamic);
export const e1 = 0;
export default "default export";
// @Filename: main.js
System.register(["mod"], function (exports_1, context_1) {
   "use strict";
   var mod_1, mod, dynamic, e1;
   var __moduleName = context_1 && context_1.id;
   return {
       setters: [
           function (mod_1_1) {
               mod_1 = mod_1_1;
               mod = mod_1_1;
           }
       ],
       execute: function () {
           dynamic = context_1.import("mod");
           console.log(mod_1.default, mod_1.y, mod_1.z, mod, dynamic);
           exports_1("e1", e1 = 0);
           exports_1("default", "default export");
       }
   };
});
amd
Summary
Designed for AMD loaders like RequireJS.
You probably shouldn’t use this. Use a bundler instead.
Emitted files are AMD modules, but dependencies may be any format.
Supports outFile.
Examples
// @Filename: main.ts
import x, { y, z } from "mod";
import * as mod from "mod";
const dynamic = import("mod");
console.log(x, y, z, mod, dynamic);
export const e1 = 0;
export default "default export";
// @Filename: main.js
define(["require", "exports", "mod", "mod"], function (require, exports, mod_1, mod) {
   "use strict";
   Object.defineProperty(exports, "__esModule", { value: true });
   exports.e1 = void 0;
   const dynamic = new Promise((resolve_1, reject_1) => { require(["mod"], resolve_1, reject_1); });
   console.log(mod_1.default, mod_1.y, mod_1.z, mod, dynamic);
   exports.e1 = 0;
   exports.default = "default export";
});
umd
Summary
Designed for AMD or CommonJS loaders.
Does not expose a global variable like most other UMD wrappers.
You probably shouldn’t use this. Use a bundler instead.
Emitted files are UMD modules, but dependencies may be any format.
Examples
// @Filename: main.ts
import x, { y, z } from "mod";
import * as mod from "mod";
const dynamic = import("mod");
console.log(x, y, z, mod, dynamic);
export const e1 = 0;
export default "default export";
// @Filename: main.js
(function (factory) {
   if (typeof module === "object" && typeof module.exports === "object") {
       var v = factory(require, exports);
       if (v !== undefined) module.exports = v;
   }
   else if (typeof define === "function" && define.amd) {
       define(["require", "exports", "mod", "mod"], factory);
   }
})(function (require, exports) {
   "use strict";
   var __syncRequire = typeof module === "object" && typeof module.exports === "object";
   Object.defineProperty(exports, "__esModule", { value: true });
   exports.e1 = void 0;
   const mod_1 = require("mod");
   const mod = require("mod");
   const dynamic = __syncRequire ? Promise.resolve().then(() => require("mod")) : new Promise((resolve_1, reject_1) => { require(["mod"], resolve_1, reject_1); });
   console.log(mod_1.default, mod_1.y, mod_1.z, mod, dynamic);
   exports.e1 = 0;
   exports.default = "default export";
});
The moduleResolution compiler option
This section describes module resolution features and processes shared by multiple moduleResolution modes, then specifies the details of each mode. See the Module resolution theory section for more background on what the option is and how it fits into the overall compilation process. In brief, moduleResolution controls how TypeScript resolves module specifiers (string literals in import/export/require statements) to files on disk, and should be set to match the module resolver used by the target runtime or bundler.
Common features and processes
File extension substitution
TypeScript always wants to resolve internally to a file that can provide type information, while ensuring that the runtime or bundler can use the same path to resolve to a file that provides a JavaScript implementation. For any module specifier that would, according to the moduleResolution algorithm specified, trigger a lookup of a JavaScript file in the runtime or bundler, TypeScript will first try to find a TypeScript implementation file or type declaration file with the same name and analagous file extension.
Runtime lookup
TypeScript lookup #1
TypeScript lookup #2
TypeScript lookup #3
TypeScript lookup #4
TypeScript lookup #5
/mod.js
/mod.ts
/mod.tsx
/mod.d.ts
/mod.js
./mod.jsx
/mod.mjs
/mod.mts
/mod.d.mts
/mod.mjs




/mod.cjs
/mod.cts
/mod.d.cts
/mod.cjs





Note that this behavior is independent of the actual module specifier written in the import. This means that TypeScript can resolve to a .ts or .d.ts file even if the module specifier explicitly uses a .js file extension:
import x from "./mod.js";
// Runtime lookup: "./mod.js"
// TypeScript lookup #1: "./mod.ts"
// TypeScript lookup #2: "./mod.d.ts"
// TypeScript lookup #3: "./mod.js"
See TypeScript imitates the host’s module resolution, but with types for an explanation of why TypeScript’s module resolution works this way.
Relative file path resolution
All of TypeScript’s moduleResolution algorithms support referencing a module by a relative path that includes a file extension (which will be substituted according to the rules above):
// @Filename: a.ts
export {};
// @Filename: b.ts
import {} from "./a.js"; // ✅ Works in every `moduleResolution`
Extensionless relative paths
In some cases, the runtime or bundler allows omitting a .js file extension from a relative path. TypeScript supports this behavior where the moduleResolution setting and the context indicate that the runtime or bundler supports it:
// @Filename: a.ts
export {};
// @Filename: b.ts
import {} from "./a";
If TypeScript determines that the runtime will perform a lookup for ./a.js given the module specifier "./a", then ./a.js will undergo extension substitution, and resolve to the file a.ts in this example.
Extensionless relative paths are not supported in import paths in Node.js, and are not always supported in file paths specified in package.json files. TypeScript currently never supports omitting a .mjs/.mts or .cjs/.cts file extension, even though some runtimes and bundlers do.
Directory modules (index file resolution)
In some cases, a directory, rather than a file, can be referenced as a module. In the simplest and most common case, this involves the runtime or bundler looking for an index.js file in a directory. TypeScript supports this behavior where the moduleResolution setting and the context indicate that the runtime or bundler supports it:
// @Filename: dir/index.ts
export {};
// @Filename: b.ts
import {} from "./dir";
If TypeScript determines that the runtime will perform a lookup for ./dir/index.js given the module specifier "./dir", then ./dir/index.js will undergo extension substitution, and resolve to the file dir/index.ts in this example.
Directory modules may also contain a package.json file, where resolution of the "main" and "types" fields are supported, and take precedence over index.js lookups. The "typesVersions" field is also supported in directory modules.
Note that directory modules are not the same as node_modules packages and only support a subset of the features available to packages, and are not supported at all in some contexts. Node.js considers them a legacy feature.
paths
Overview
TypeScript offers a way to override the compiler’s module resolution for bare specifiers with the paths compiler option. While the feature was originally designed to be used with the AMD module loader (a means of running modules in the browser before ESM existed or bundlers were widely used), it still has uses today when a runtime or bundler supports module resolution features that TypeScript does not model. For example, when running Node.js with --experimental-network-imports, you can manually specify a local type definition file for a specific https:// import:
{
 "compilerOptions": {
   "module": "nodenext",
   "paths": {
     "https://esm.sh/lodash@4.17.21": ["./node_modules/@types/lodash/index.d.ts"]
   }
 }
}
// Typed by ./node_modules/@types/lodash/index.d.ts due to `paths` entry
import { add } from "https://esm.sh/lodash@4.17.21";
It’s also common for apps built with bundlers to define convenience path aliases in their bundler configuration, and then inform TypeScript of those aliases with paths:
{
 "compilerOptions": {
   "module": "esnext",
   "moduleResolution": "bundler",
   "paths": {
     "@app/*": ["./src/*"]
   }
 }
}
paths does not affect emit
The paths option does not change the import path in the code emitted by TypeScript. Consequently, it’s very easy to create path aliases that appear to work in TypeScript but will crash at runtime:
{
 "compilerOptions": {
   "module": "nodenext",
   "paths": {
     "node-has-no-idea-what-this-is": ["./oops.ts"]
   }
 }
}
// TypeScript: ✅
// Node.js: 💥
import {} from "node-has-no-idea-what-this-is";
While it’s ok for bundled apps to set up paths, it’s very important that published libraries do not, since the emitted JavaScript will not work for consumers of the library without those users setting up the same aliases for both TypeScript and their bundler. Both libraries and apps can consider package.json "imports" as a standard replacement for convenience paths aliases.
paths should not point to monorepo packages or node_modules packages
While module specifiers that match paths aliases are bare specifiers, once the alias is resolved, module resolution proceeds on the resolved path as a relative path. Consequently, resolution features that happen for node_modules package lookups, including package.json "exports" field support, do not take effect when a paths alias is matched. This can lead to surprising behavior if paths is used to point to a node_modules package:
{
 "compilerOptions": {
   "paths": {
     "pkg": ["./node_modules/pkg/dist/index.d.ts"],
     "pkg/*": ["./node_modules/pkg/*"]
   }
 }
}
While this configuration may simulate some of the behavior of package resolution, it overrides any main, types, exports, and typesVersions the package’s package.json file defines, and imports from the package may fail at runtime.
The same caveat applies to packages referencing each other in a monorepo. Instead of using paths to make TypeScript artificially resolve "@my-scope/lib" to a sibling package, it’s best to use workspaces via npm, yarn, or pnpm to symlink your packages into node_modules, so both TypeScript and the runtime or bundler perform real node_modules package lookups. This is especially important if the monorepo packages will be published to npm—the packages will reference each other via node_modules package lookups once installed by users, and using workspaces allows you to test that behavior during local development.
Relationship to baseUrl
When baseUrl is provided, the values in each paths array are resolved relative to the baseUrl. Otherwise, they are resolved relative to the tsconfig.json file that defines them.
Wildcard substitutions
paths patterns can contain a single * wildcard, which matches any string. The * token can then be used in the file path values to substitute the matched string:
{
 "compilerOptions": {
   "paths": {
     "@app/*": ["./src/*"]
   }
 }
}
When resolving an import of "@app/components/Button", TypeScript will match on @app/*, binding * to components/Button, and then attempt to resolve the path ./src/components/Button relative to the tsconfig.json path. The remainder of this lookup will follow the same rules as any other relative path lookup according to the moduleResolution setting.
When multiple patterns match a module specifier, the pattern with the longest matching prefix before any * token is used:
{
 "compilerOptions": {
   "paths": {
     "*": ["./src/foo/one.ts"],
     "foo/*": ["./src/foo/two.ts"],
     "foo/bar": ["./src/foo/three.ts"]
   }
 }
}
When resolving an import of "foo/bar", all three paths patterns match, but the last is used because "foo/bar" is longer than "foo/" and "".
Fallbacks
Multiple file paths can be provided for a path mapping. If resolution fails for one path, the next one in the array will be attempted until resolution succeeds or the end of the array is reached.
{
 "compilerOptions": {
   "paths": {
     "*": ["./vendor/*", "./types/*"]
   }
 }
}
baseUrl
baseUrl was designed for use with AMD module loaders. If you aren’t using an AMD module loader, you probably shouldn’t use baseUrl. Since TypeScript 4.1, baseUrl is no longer required to use paths and should not be used just to set the directory paths values are resolved from.
The baseUrl compiler option can be combined with any moduleResolution mode and specifies a directory that bare specifiers (module specifiers that don’t begin with ./, ../, or /) are resolved from. baseUrl has a higher precedence than node_modules package lookups in moduleResolution modes that support them.
When performing a baseUrl lookup, resolution proceeds with the same rules as other relative path resolutions. For example, in a moduleResolution mode that supports extensionless relative paths a module specifier "some-file" may resolve to /src/some-file.ts if baseUrl is set to /src.
Resolution of relative module specifiers are never affected by the baseUrl option.
node_modules package lookups
Node.js treats module specifiers that aren’t relative paths, absolute paths, or URLs as references to packages that it looks up in node_modules subdirectories. Bundlers conveniently adopted this behavior to allow their users to use the same dependency management system, and often even the same dependencies, as they would in Node.js. All of TypeScript’s moduleResolution options except classic support node_modules lookups. (classic supports lookups in node_modules/@types when other means of resolution fail, but never looks for packages in node_modules directly.) Every node_modules package lookup has the following structure (beginning after higher precedence bare specifier rules, like paths, baseUrl, self-name imports, and package.json "imports" lookups have been exhausted):
For each ancestor directory of the importing file, if a node_modules directory exists within it:
If a directory with the same name as the package exists within node_modules:
Attempt to resolve types from the package directory.
If a result is found, return it and stop the search.
If a directory with the same name as the package exists within node_modules/@types:
Attempt to resolve types from the @types package directory.
If a result is found, return it and stop the search.
Repeat the previous search through all node_modules directories, but this time, allow JavaScript files as a result, and do not search in @types directories.
All moduleResolution modes (except classic) follow this pattern, while the details of how they resolve from a package directory, once located, differ, and are explained in the following sections.
package.json "exports"
When moduleResolution is set to node16, nodenext, or bundler, and resolvePackageJsonExports is not disabled, TypeScript follows Node.js’s package.json "exports" spec when resolving from a package directory triggered by a bare specifier node_modules package lookup.
TypeScript’s implementation for resolving a module specifier through "exports" to a file path follows Node.js exactly. Once a file path is resolved, however, TypeScript will still try multiple file extensions in order to prioritize finding types.
When resolving through conditional "exports", TypeScript always matches the "types" and "default" conditions if present. Additionally, TypeScript will match a versioned types condition in the form "types@{selector}" (where {selector} is a "typesVersions"-compatible version selector) according to the same version-matching rules implemented in "typesVersions". Other non-configurable conditions are dependent on the moduleResolution mode and specified in the following sections. Additional conditions can be configured to match with the customConditions compiler option.
Note that the presence of "exports" prevents any subpaths not explicitly listed or matched by a pattern in "exports" from being resolved.
Example: subpaths, conditions, and extension substitution
Scenario: "pkg/subpath" is requested with conditions ["types", "node", "require"] (determined by moduleResolution setting and the context that triggered the module resolution request) in a package directory with the following package.json:
{
 "name": "pkg",
 "exports": {
   ".": {
     "import": "./index.mjs",
     "require": "./index.cjs"
   },
   "./subpath": {
     "import": "./subpath/index.mjs",
     "require": "./subpath/index.cjs"
   }
 }
}
Resolution process within the package directory:
Does "exports" exist? Yes.
Does "exports" have a "./subpath" entry? Yes.
The value at exports["./subpath"] is an object—it must be specifying conditions.
Does the first condition "import" match this request? No.
Does the second condition "require" match this request? Yes.
Does the path "./subpath/index.cjs" have a recognized TypeScript file extension? No, so use extension substitution.
Via extension substitution, try the following paths, returning the first one that exists, or undefined otherwise:
./subpath/index.cts
./subpath/index.d.cts
./subpath/index.cjs
If ./subpath/index.cts or ./subpath.d.cts exists, resolution is complete. Otherwise, resolution searches node_modules/@types/pkg and other node_modules directories in an attempt to resolve types, according to the node_modules package lookups rules. If no types are found, a second pass through all node_modules resolves to ./subpath/index.cjs (assuming it exists), which counts as a successful resolution, but one that does not provide types, leading to any-typed imports and a noImplicitAny error if enabled.
Example: explicit "types" condition
Scenario: "pkg/subpath" is requested with conditions ["types", "node", "import"] (determined by moduleResolution setting and the context that triggered the module resolution request) in a package directory with the following package.json:
{
 "name": "pkg",
 "exports": {
   "./subpath": {
     "import": {
       "types": "./types/subpath/index.d.mts",
       "default": "./es/subpath/index.mjs"
     },
     "require": {
       "types": "./types/subpath/index.d.cts",
       "default": "./cjs/subpath/index.cjs"
     }
   }
 }
}
Resolution process within the package directory:
Does "exports" exist? Yes.
Does "exports" have a "./subpath" entry? Yes.
The value at exports["./subpath"] is an object—it must be specifying conditions.
Does the first condition "import" match this request? Yes.
The value at exports["./subpath"].import is an object—it must be specifying conditions.
Does the first condition "types" match this request? Yes.
Does the path "./types/subpath/index.d.mts" have a recognized TypeScript file extension? Yes, so don’t use extension substitution.
Return the path "./types/subpath/index.d.mts" if the file exists, undefined otherwise.
Example: versioned "types" condition
Scenario: using TypeScript 4.7.5, "pkg/subpath" is requested with conditions ["types", "node", "import"] (determined by moduleResolution setting and the context that triggered the module resolution request) in a package directory with the following package.json:
{
 "name": "pkg",
 "exports": {
   "./subpath": {
     "types@>=5.2": "./ts5.2/subpath/index.d.ts",
     "types@>=4.6": "./ts4.6/subpath/index.d.ts",
     "types": "./tsold/subpath/index.d.ts",
     "default": "./dist/subpath/index.js"
   }
 }
}
Resolution process within the package directory:
Does "exports" exist? Yes.
Does "exports" have a "./subpath" entry? Yes.
The value at exports["./subpath"] is an object—it must be specifying conditions.
Does the first condition "types@>=5.2" match this request? No, 4.7.5 is not greater than or equal to 5.2.
Does the second condition "types@>=4.6" match this request? Yes, 4.7.5 is greater than or equal to 4.6.
Does the path "./ts4.6/subpath/index.d.ts" have a recognized TypeScript file extension? Yes, so don’t use extension substitution.
Return the path "./ts4.6/subpath/index.d.ts" if the file exists, undefined otherwise.
Example: subpath patterns
Scenario: "pkg/wildcard.js" is requested with conditions ["types", "node", "import"] (determined by moduleResolution setting and the context that triggered the module resolution request) in a package directory with the following package.json:
{
 "name": "pkg",
 "type": "module",
 "exports": {
   "./*.js": {
     "types": "./types/*.d.ts",
     "default": "./dist/*.js"
   }
 }
}
Resolution process within the package directory:
Does "exports" exist? Yes.
Does "exports" have a "./wildcard.js" entry? No.
Does any key with a * in it match "./wildcard.js"? Yes, "./*.js" matches and sets wildcard to be the substitution.
The value at exports["./*.js"] is an object—it must be specifying conditions.
Does the first condition "types" match this request? Yes.
In ./types/*.d.ts, replace * with the substitution wildcard. ./types/wildcard.d.ts
Does the path "./types/wildcard.d.ts" have a recognized TypeScript file extension? Yes, so don’t use extension substitution.
Return the path "./types/wildcard.d.ts" if the file exists, undefined otherwise.
Example: "exports" block other subpaths
Scenario: "pkg/dist/index.js" is requested in a package directory with the following package.json:
{
 "name": "pkg",
 "main": "./dist/index.js",
 "exports": "./dist/index.js"
}
Resolution process within the package directory:
Does "exports" exist? Yes.
The value at exports is a string—it must be a file path for the package root (".").
Is the request "pkg/dist/index.js" for the package root? No, it has a subpath dist/index.js.
Resolution fails; return undefined.
Without "exports", the request could have succeeded, but the presence of "exports" prevents resolving any subpaths that cannot be matched through "exports".
package.json "typesVersions"
A node_modules package or directory module may specify a "typesVersions" field in its package.json to redirect TypeScript’s resolution process according to the TypeScript compiler version, and for node_modules packages, according to the subpath being resolved. This allows package authors to include new TypeScript syntax in one set of type definitions while providing another set for backward compatibility with older TypeScript versions (through a tool like downlevel-dts). "typesVersions" is supported in all moduleResolution modes; however, the field is not read in situations when package.json "exports" are read.
Example: redirect all requests to a subdirectory
Scenario: a module imports "pkg" using TypeScript 5.2, where node_modules/pkg/package.json is:
{
 "name": "pkg",
 "version": "1.0.0",
 "types": "./index.d.ts",
 "typesVersions": {
   ">=3.1": {
     "*": ["ts3.1/*"]
   }
 }
}
Resolution process:
(Depending on compiler options) Does "exports" exist? No.
Does "typesVersions" exist? Yes.
Is the TypeScript version >=3.1? Yes. Remember the mapping "*": ["ts3.1/*"].
Are we resolving a subpath after the package name? No, just the root "pkg".
Does "types" exist? Yes.
Does any key in "typesVersions" match ./index.d.ts? Yes, "*" matches and sets index.d.ts to be the substitution.
In ts3.1/*, replace * with the substitution ./index.d.ts: ts3.1/index.d.ts.
Does the path ./ts3.1/index.d.ts have a recognized TypeScript file extension? Yes, so don’t use extension substitution.
Return the path ./ts3.1/index.d.ts if the file exists, undefined otherwise.
Example: redirect requests for a specific file
Scenario: a module imports "pkg" using TypeScript 3.9, where node_modules/pkg/package.json is:
{
 "name": "pkg",
 "version": "1.0.0",
 "types": "./index.d.ts",
 "typesVersions": {
   "<4.0": { "index.d.ts": ["index.v3.d.ts"] }
 }
}
Resolution process:
(Depending on compiler options) Does "exports" exist? No.
Does "typesVersions" exist? Yes.
Is the TypeScript version <4.0? Yes. Remember the mapping "index.d.ts": ["index.v3.d.ts"].
Are we resolving a subpath after the package name? No, just the root "pkg".
Does "types" exist? Yes.
Does any key in "typesVersions" match ./index.d.ts? Yes, "index.d.ts" matches.
Does the path ./index.v3.d.ts have a recognized TypeScript file extension? Yes, so don’t use extension substitution.
Return the path ./index.v3.d.ts if the file exists, undefined otherwise.
package.json "main" and "types"
If a directory’s package.json "exports" field is not read (either due to compiler options, or because it is not present, or because the directory is being resolved as a directory module instead of a node_modules package) and the module specifier does not have a subpath after the package name or package.json-containing directory, TypeScript will attempt to resolve from these package.json fields, in order, in an attempt to find the main module for the package or directory:
"types"
"typings" (legacy)
"main"
The declaration file found at "types" is assumed to be an accurate representation of the implementation file found at "main". If "types" and "typings" are not present or cannot be resolved, TypeScript will read the "main" field and perform extension substitution to find a declaration file.
When publishing a typed package to npm, it’s recommended to include a "types" field even if extension substitution or package.json "exports" make it unnecessary, because npm shows a TS icon on the package registry listing only if the package.json contains a "types" field.
Package-relative file paths
If neither package.json "exports" nor package.json "typesVersions" apply, subpaths of a bare package specifier resolve relative to the package directory, according to applicable relative path resolution rules. In modes that respect [package.json "exports"], this behavior is blocked by the mere presence of the "exports" field in the package’s package.json, even if the import fails to resolve through "exports", as demonstrated in an example above. On the other hand, if the import fails to resolve through "typesVersions", a package-relative file path resolution is attempted as a fallback.
When package-relative paths are supported, they resolve under the same rules as any other relative path considering the moduleResolution mode and context. For example, in --moduleResolution nodenext, directory modules and extensionless paths are only supported in require calls, not in imports:
// @Filename: module.mts
import "pkg/dist/foo";                // ❌ import, needs `.js` extension
import "pkg/dist/foo.js";             // ✅
import foo = require("pkg/dist/foo"); // ✅ require, no extension needed
package.json "imports" and self-name imports
When moduleResolution is set to node16, nodenext, or bundler, and resolvePackageJsonImports is not disabled, TypeScript will attempt to resolve import paths beginning with # through the "imports" field of the nearest ancestor package.json of the importing file. Similarly, when package.json "exports" lookups are enabled, TypeScript will attempt to resolve import paths beginning with the current package name—that is, the value in the "name" field of the nearest ancestor package.json of the importing file—through the "exports" field of that package.json. Both of these features allow files in a package to import other files in the same package, replacing a relative import path.
TypeScript follows Node.js’s resolution algorithm for "imports" and self references exactly up until a file path is resolved. At that point, TypeScript’s resolution algorithm forks based on whether the package.json containing the "imports" or "exports" being resolved belongs to a node_modules dependency or the local project being compiled (i.e., its directory contains the tsconfig.json file for the project that contains the importing file):
If the package.json is in node_modules, TypeScript will apply extension substitution to the file path if it doesn’t already have a recognized TypeScript file extension, and check for the existence of the resulting file paths.
If the package.json is part of the local project, an additional remapping step is performed in order to find the input TypeScript implementation file that will eventually produce the output JavaScript or declaration file path that was resolved from "imports". Without this step, any compilation that resolves an "imports" path would be referencing output files from the previous compilation instead of other input files that are intended to be included in the current compilation. This remapping uses the outDir/declarationDir and rootDir from the tsconfig.json, so using "imports" usually requires an explicit rootDir to be set.
This variation allows package authors to write "imports" and "exports" fields that reference only the compilation outputs that will be published to npm, while still allowing local development to use the original TypeScript source files.
Example: local project with conditions
Scenario: "/src/main.mts" imports "#utils" with conditions ["types", "node", "import"] (determined by moduleResolution setting and the context that triggered the module resolution request) in a project directory with a tsconfig.json and package.json:
// tsconfig.json
{
 "compilerOptions": {
   "moduleResolution": "node16",
   "resolvePackageJsonImports": true,
   "rootDir": "./src",
   "outDir": "./dist"
 }
}
// package.json
{
 "name": "pkg",
 "imports": {
   "#utils": {
     "import": "./dist/utils.d.mts",
     "require": "./dist/utils.d.cts"
   }
 }
}
Resolution process:
Import path starts with #, try to resolve through "imports".
Does "imports" exist in the nearest ancestor package.json? Yes.
Does "#utils" exist in the "imports" object? Yes.
The value at imports["#utils"] is an object—it must be specifying conditions.
Does the first condition "import" match this request? Yes.
Should we attempt to map the output path to an input path? Yes, because:
Is the package.json in node_modules? No, it’s in the local project.
Is the tsconfig.json within the package.json directory? Yes.
In ./dist/utils.d.mts, replace the outDir prefix with rootDir. ./src/utils.d.mts
Replace the output extension .d.mts with the corresponding input extension .mts. ./src/utils.mts
Return the path "./src/utils.mts" if the file exists.
Otherwise, return the path "./dist/utils.d.mts" if the file exists.
Example: node_modules dependency with subpath pattern
Scenario: "/node_modules/pkg/main.mts" imports "#internal/utils" with conditions ["types", "node", "import"] (determined by moduleResolution setting and the context that triggered the module resolution request) with the package.json:
// /node_modules/pkg/package.json
{
 "name": "pkg",
 "imports": {
   "#internal/*": {
     "import": "./dist/internal/*.mjs",
     "require": "./dist/internal/*.cjs"
   }
 }
}
Resolution process:
Import path starts with #, try to resolve through "imports".
Does "imports" exist in the nearest ancestor package.json? Yes.
Does "#internal/utils" exist in the "imports" object? No, check for pattern matches.
Does any key with a * match "#internal/utils"? Yes, "#internal/*" matches and sets utils to be the substitution.
The value at imports["#internal/*"] is an object—it must be specifying conditions.
Does the first condition "import" match this request? Yes.
Should we attempt to map the output path to an input path? No, because the package.json is in node_modules.
In ./dist/internal/*.mjs, replace * with the substitution utils. ./dist/internal/utils.mjs
Does the path ./dist/internal/utils.mjs have a recognized TypeScript file extension? No, try extension substitution.
Via extension substitution, try the following paths, returning the first one that exists, or undefined otherwise:
./dist/internal/utils.mts
./dist/internal/utils.d.mts
./dist/internal/utils.mjs
node16, nodenext
These modes reflect the module resolution behavior of Node.js v12 and later. (node16 and nodenext are currently identical, but if Node.js makes significant changes to its module system in the future, node16 will be frozen while nodenext will be updated to reflect the new behavior.) In Node.js, the resolution algorithm for ECMAScript imports is significantly different from the algorithm for CommonJS require calls. For each module specifier being resolved, the syntax and the module format of the importing file are first used to determine whether the module specifier will be in an import or require in the emitted JavaScript. That information is then passed into the module resolver to determine which resolution algorithm to use (and whether to use the "import" or "require" condition for package.json "exports" or "imports").
TypeScript files that are determined to be in CommonJS format may still use import and export syntax by default, but the emitted JavaScript will use require and module.exports instead. This means that it’s common to see import statements that are resolved using the require algorithm. If this causes confusion, the verbatimModuleSyntax compiler option can be enabled, which prohibits the use of import statements that would be emitted as require calls.
Note that dynamic import() calls are always resolved using the import algorithm, according to Node.js’s behavior. However, import() types are resolved according to the format of the importing file (for backward compatibility with existing CommonJS-format type declarations):
// @Filename: module.mts
import x from "./mod.js";             // `import` algorithm due to file format (emitted as-written)
import("./mod.js");                   // `import` algorithm due to syntax (emitted as-written)
type Mod = typeof import("./mod.js"); // `import` algorithm due to file format
import mod = require("./mod");        // `require` algorithm due to syntax (emitted as `require`)
// @Filename: commonjs.cts
import x from "./mod";                // `require` algorithm due to file format (emitted as `require`)
import("./mod.js");                   // `import` algorithm due to syntax (emitted as-written)
type Mod = typeof import("./mod");    // `require` algorithm due to file format
import mod = require("./mod");        // `require` algorithm due to syntax (emitted as `require`)
Implied and enforced options
--moduleResolution node16 and nodenext must be paired with --module node16, node18, or nodenext.
Supported features
Features are listed in order of precedence.


import
require
paths
✅
✅
baseUrl
✅
✅
node_modules package lookups
✅
✅
package.json "exports"
✅ matches types, node, import
✅ matches types, node, require
package.json "imports" and self-name imports
✅ matches types, node, import
✅ matches types, node, require
package.json "typesVersions"
✅
✅
Package-relative paths
✅ when exports not present
✅ when exports not present
Full relative paths
✅
✅
Extensionless relative paths
❌
✅
Directory modules
❌
✅

bundler
--moduleResolution bundler attempts to model the module resolution behavior common to most JavaScript bundlers. In short, this means supporting all the behaviors traditionally associated with Node.js’s CommonJS require resolution algorithm like node_modules lookups, directory modules, and extensionless paths, while also supporting newer Node.js resolution features like package.json "exports" and package.json "imports".
It’s instructive to think about the similarities and differences between --moduleResolution bundler and --moduleResolution nodenext, particularly in how they decide what conditions to use when resolving package.json "exports" or "imports". Consider an import statement in a .ts file:
// index.ts
import { foo } from "pkg";
Recall that in --module nodenext --moduleResolution nodenext, the --module setting first determines whether the import will be emitted to the .js file as an import or require call, then passes that information to TypeScript’s module resolver, which decides whether to match "import" or "require" conditions in "pkg"’s package.json "exports" accordingly. Let’s assume that there’s no package.json in scope of this file. The file extension is .ts, so the output file extension will be .js, which Node.js will interpret as CommonJS, so TypeScript will emit this import as a require call. So, the module resolver will use the require condition as it resolves "exports" from "pkg".
The same process happens in --moduleResolution bundler, but the rules for deciding whether to emit an import or require call for this import statement will be different, since --moduleResolution bundler necessitates using --module esnext or --module preserve. In both of those modes, ESM import declarations always emit as ESM import declarations, so TypeScript’s module resolver will receive that information and use the "import" condition as it resolves "exports" from "pkg".
This explanation may be somewhat unintuitive, since --moduleResolution bundler is usually used in combination with --noEmit—bundlers typically process raw .ts files and perform module resolution on untransformed imports or requires. However, for consistency, TypeScript still uses the hypothetical emit decided by module to inform module resolution and type checking. This makes --module preserve the best choice whenever a runtime or bundler is operating on raw .ts files, since it implies no transformation. Under --module preserve --moduleResolution bundler, you can write imports and requires in the same file that will resolve with the import and require conditions, respectively:
// index.ts
import pkg1 from "pkg";       // Resolved with "import" condition
import pkg2 = require("pkg"); // Resolved with "require" condition
Implied and enforced options
--moduleResolution bundler must be paired with --module esnext or --module preserve.
--moduleResolution bundler implies --allowSyntheticDefaultImports.
Supported features
paths ✅
baseUrl ✅
node_modules package lookups ✅
package.json "exports" ✅ matches types, import/require depending on syntax
package.json "imports" and self-name imports ✅ matches types, import/require depending on syntax
package.json "typesVersions" ✅
Package-relative paths ✅ when exports not present
Full relative paths ✅
Extensionless relative paths ✅
Directory modules ✅
node10 (formerly known as node)
--moduleResolution node was renamed to node10 (keeping node as an alias for backward compatibility) in TypeScript 5.0. It reflects the CommonJS module resolution algorithm as it existed in Node.js versions earlier than v12. It should no longer be used.
Supported features
paths ✅
baseUrl ✅
node_modules package lookups ✅
package.json "exports" ❌
package.json "imports" and self-name imports ❌
package.json "typesVersions" ✅
Package-relative paths ✅
Full relative paths ✅
Extensionless relative paths ✅
Directory modules ✅
classic
Do not use classic.
Modules - ESM/CJS Interoperability
It’s 2015, and you’re writing an ESM-to-CJS transpiler. There’s no specification for how to do this; all you have is a specification of how ES modules are supposed to interact with each other, knowledge of how CommonJS modules interact with each other, and a knack for figuring things out. Consider an exporting ES module:
export const A = {};
export const B = {};
export default "Hello, world!";
How would you turn this into a CommonJS module? Recalling that default exports are just named exports with special syntax, there seems to be only one choice:
exports.A = {};
exports.B = {};
exports.default = "Hello, world!";
This is a nice analog, and it lets you implement a similar on the importing side:
import hello, { A, B } from "./module";
console.log(hello, A, B);
// transpiles to:
const module_1 = require("./module");
console.log(module_1.default, module_1.A, module_1.B);
So far, everything in CJS-world matches up one-to-one with everything in ESM-world. Extending the equivalence above one step further, we can see that we also have:
import * as mod from "./module";
console.log(mod.default, mod.A, mod.B);
// transpiles to:
const mod = require("./module");
console.log(mod.default, mod.A, mod.B);
You might notice that in this scheme, there’s no way to write an ESM export that produces an output where exports is assigned a function, class, or primitive:
// @Filename: exports-function.js
module.exports = function hello() {
 console.log("Hello, world!");
};
But existing CommonJS modules frequently take this form. How might an ESM import, processed with our transpiler, access this module? We just established that a namespace import (import *) transpiles to a plain require call, so we can support an input like:
import * as hello from "./exports-function";
hello();
// transpiles to:
const hello = require("./exports-function");
hello();
Our output works at runtime, but we have a compliance problem: according to the JavaScript specification, a namespace import always resolves to a Module Namespace Object, that is, an object whose members are the exports of the module. In this case, require would return the function hello, but import * can never return a function. The correspondence we assumed appears invalid.
It’s worth taking a step back here and clarifying what the goal is. As soon as modules landed in the ES2015 specification, transpilers emerged with support for downleveling ESM to CJS, allowing users to adopt the new syntax long before runtimes implemented support for it. There was even a sense that writing ESM code was a good way to “future-proof” new projects. For this to be true, there needed to be a seamless migration path from executing the transpilers’ CJS output to executing the ESM input natively once runtimes developed support for it. The goal was to find a way to downlevel ESM to CJS that would allow any or all of those transpiled outputs to be replaced by their true ESM inputs in a future runtime, with no observable change in behavior.
By following the specification, it was easy enough for transpilers to find a set of transformations that made the semantics of their transpiled CommonJS outputs match the specified semantics of their ESM inputs (arrows represent imports):

However, CommonJS modules (written as CommonJS, not as ESM transpiled to CommonJS) were already well-established in the Node.js ecosystem, so it was inevitable that modules written as ESM and transpiled to CJS would start “importing” modules written as CommonJS. The behavior for this interoperability, though, was not specified by ES2015, and didn’t yet exist in any real runtime.

Even if transpiler authors did nothing, a behavior would emerge from the existing semantics between the require calls they emitted in transpiled code and the exports defined in existing CJS modules. And to allow users to transition seamlessly from transpiled ESM to true ESM once their runtime supported it, that behavior would have to match the one the runtime chose to implement.
Guessing what interop behavior runtimes would support wasn’t limited to ESM importing “true CJS” modules either. Whether ESM would be able to recognize ESM-transpiled-from-CJS as distinct from CJS, and whether CJS would be able to require ES modules, were also unspecified. Even whether ESM imports would use the same module resolution algorithm as CJS require calls was unknowable. All these variables would have to be predicted correctly in order to give transpiler users a seamless migration path toward native ESM.
allowSyntheticDefaultImports and esModuleInterop
Let’s return to our specification compliance problem, where import * transpiles to require:
// Invalid according to the spec:
import * as hello from "./exports-function";
hello();
// but the transpilation works:
const hello = require("./exports-function");
hello();
When TypeScript first added support for writing and transpiling ES modules, the compiler addressed this problem by issuing an error on any namespace import of a module whose exports was not a namespace-like object:
import * as hello from "./exports-function";
// TS2497              ^^^^^^^^^^^^^^^^^^^^
// External module '"./exports-function"' resolves to a non-module entity
// and cannot be imported using this construct.
The only workaround was for users to go back to using the older TypeScript import syntax representing a CommonJS require:
import hello = require("./exports-function");
Forcing users to revert to non-ESM syntax was essentially an admission that “we don’t know how or if a CJS module like "./exports-function" will be accessible with ESM imports in the future, but we know it can’t be with import *, even though it will work at runtime in the transpilation scheme we’re using.” It doesn’t meet the goal of allowing this file to be migrated to real ESM without changes, but neither does the alternative of allowing the import * to link to a function. This is still the behavior in TypeScript today when allowSyntheticDefaultImports and esModuleInterop are disabled.
Unfortunately, this is a slight oversimplification—TypeScript didn’t fully avoid the compliance issue with this error, because it allowed namespace imports of functions to work, and retain their call signatures, as long as the function declaration merged with a namespace declaration—even if the namespace was empty. So while a module exporting a bare function was recognized as a “non-module entity”:
declare function $(selector: string): any;
export = $; // Cannot `import *` this 👍
A should-be-meaningless change allowed the invalid import to type check without errors:
declare namespace $ {}
declare function $(selector: string): any;
export = $; // Allowed to `import *` this and call it 😱
Meanwhile, other transpilers were coming up with a way to solve the same problem. The thought process went something like this:
To import a CJS module that exports a function or a primitive, we clearly need to use a default import. A namespace import would be illegal, and named imports don’t make sense here.
Most likely, this means that runtimes implementing ESM/CJS interop will choose to make default imports of CJS modules always link directly to the whole exports, rather than only doing so if the exports is a function or primitive.
So, a default import of a true CJS module should work just like a require call. But we’ll need a way to disambiguate true CJS modules from our transpiled CJS modules, so we can still transpile export default "hello" to exports.default = "hello" and have a default import of that module link to exports.default. Basically, a default import of one of our own transpiled modules needs to work one way (to simulate ESM-to-ESM imports), while a default import of any other existing CJS module needs to work another way (to simulate how we think ESM-to-CJS imports will work).
When we transpile an ES module to CJS, let’s add a special extra field to the output:
exports.A = {};
exports.B = {};
exports.default = "Hello, world!";
// Extra special flag!
exports.__esModule = true;
that we can check for when we transpile a default import:
// import hello from "./module";
const _mod = require("./module");
const hello = _mod.__esModule ? _mod.default : _mod;
The __esModule flag first appeared in Traceur, then in Babel, SystemJS, and Webpack shortly after. TypeScript added the allowSyntheticDefaultImports in 1.8 to allow the type checker to link default imports directly to the exports, rather than the exports.default, of any module types that lacked an export default declaration. The flag didn’t modify how imports or exports were emitted, but it allowed default imports to reflect how other transpilers would treat them. Namely, it allowed a default import to be used to resolve to “non-module entities,” where import * was an error:
// Error:
import * as hello from "./exports-function";
// Old workaround:
import hello = require("./exports-function");
// New way, with `allowSyntheticDefaultImports`:
import hello from "./exports-function";
This was usually enough to let Babel and Webpack users write code that already worked in those systems without TypeScript complaining, but it was only a partial solution, leaving a few issues unsolved:
Babel and others varied their default import behavior on whether an __esModule property was found on the target module, but allowSyntheticDefaultImports only enabled a fallback behavior when no default export was found in the target module’s types. This created an inconsistency if the target module had an __esModule flag but no default export. Transpilers and bundlers would still link a default import of such a module to its exports.default, which would be undefined, and would ideally be an error in TypeScript, since real ESM imports cause errors if they can’t be linked. But with allowSyntheticDefaultImports, TypeScript would think a default import of such an import links to the whole exports object, allowing named exports to be accessed as its properties.
allowSyntheticDefaultImports didn’t change how namespace imports were typed, creating an odd inconsistency where both could be used and would have the same type:
// @Filename: exportEqualsObject.d.ts
declare const obj: object;
export = obj;
// @Filename: main.ts
import objDefault from "./exportEqualsObject";
import * as objNamespace from "./exportEqualsObject";
// This should be true at runtime, but TypeScript gives an error:
objNamespace.default === objDefault;
//           ^^^^^^^ Property 'default' does not exist on type 'typeof import("./exportEqualsObject")'.
Most importantly, allowSyntheticDefaultImports did not change the JavaScript emitted by tsc. So while the flag enabled more accurate checking as long as the code was fed into another tool like Babel or Webpack, it created a real danger for users who were emitting --module commonjs with tsc and running in Node.js. If they encountered an error with import *, it may have appeared as if enabling allowSyntheticDefaultImports would fix it, but in fact it only silenced the build-time error while emitting code that would crash in Node.
TypeScript introduced the esModuleInterop flag in 2.7, which refined the type checking of imports to address the remaining inconsistencies between TypeScript’s analysis and the interop behavior used in existing transpilers and bundlers, and critically, adopted the same __esModule-conditional CommonJS emit that transpilers had adopted years before. (Another new emit helper for import * ensured the result was always an object, with call signatures stripped, fully resolving the specification compliance issue that the aforementioned “resolves to a non-module entity” error didn’t quite sidestep.) Finally, with the new flag enabled, TypeScript’s type checking, TypeScript’s emit, and the rest of the transpiling and bundling ecosystem were in agreement on a CJS/ESM interop scheme that was spec-legal and, perhaps, plausibly adoptable by Node.
Interop in Node.js
Node.js shipped support for ES modules unflagged in v12. Like the bundlers and transpilers began doing years before, Node.js gave CommonJS modules a “synthetic default export” of their exports object, allowing the entire module contents to be accessed with a default import from ESM:
// @Filename: export.cjs
module.exports = { hello: "world" };
// @Filename: import.mjs
import greeting from "./export.cjs";
greeting.hello; // "world"
That’s one win for seamless migration! Unfortunately, the similarities mostly end there.
No __esModule detection (the “double default” problem)
Node.js wasn’t able to respect the __esModule marker to vary its default import behavior. So a transpiled module with a “default export” behaves one way when “imported” by another transpiled module, and another way when imported by a true ES module in Node.js:
// @Filename: node_modules/dependency/index.js
exports.__esModule = true;
exports.default = function doSomething() { /*...*/ }
// @Filename: transpile-vs-run-directly.{js/mjs}
import doSomething from "dependency";
// Works after transpilation, but not a function in Node.js ESM:
doSomething();
// Doesn't exist after transpilation, but works in Node.js ESM:
doSomething.default();
While the transpiled default import only makes the synthetic default export if the target module lacks an __esModule flag, Node.js always synthesizes a default export, creating a “double default” on the transpiled module.
Unreliable named exports
In addition to making a CommonJS module’s exports object available as a default import, Node.js attempts to find properties of exports to make available as named imports. This behavior matches bundlers and transpilers when it works; however, Node.js uses syntactic analysis to synthesize named exports before any code executes, whereas transpiled modules resolve their named imports at runtime. The result is that imports from CJS modules that work in transpiled modules may not work in Node.js:
// @Filename: named-exports.cjs
exports.hello = "world";
exports["worl" + "d"] = "hello";
// @Filename: transpile-vs-run-directly.{js/mjs}
import { hello, world } from "./named-exports.cjs";
// `hello` works, but `world` is missing in Node.js 💥
import mod from "./named-exports.cjs";
mod.world;
// Accessing properties from the default always works ✅
Cannot require a true ES module before Node.js v22
True CommonJS modules can require an ESM-transpiled-to-CJS module, since they’re both CommonJS at runtime. But in Node.js versions older than v22.12.0, require crashes if it resolves to an ES module. This means published libraries cannot migrate from transpiled modules to true ESM without breaking their CommonJS (true or transpiled) consumers:
// @Filename: node_modules/dependency/index.js
export function doSomething() { /* ... */ }
// @Filename: dependent.js
import { doSomething } from "dependency";
// ✅ Works if dependent and dependency are both transpiled
// ✅ Works if dependent and dependency are both true ESM
// ✅ Works if dependent is true ESM and dependency is transpiled
// 💥 Crashes if dependent is transpiled and dependency is true ESM
Different module resolution algorithms
Node.js introduced a new module resolution algorithm for resolving ESM imports that differed significantly from the long-standing algorithm for resolving require calls. While not directly related to interop between CJS and ES modules, this difference was one more reason why a seamless migration from transpiled modules to true ESM might not be possible:
// @Filename: add.js
export function add(a, b) {
 return a + b;
}
// @Filename: math.js
export * from "./add";
//            ^^^^^^^
// Works when transpiled to CJS,
// but would have to be "./add.js"
// in Node.js ESM.
Conclusions
Clearly, a seamless migration from transpiled modules to ESM isn’t possible, at least in Node.js. Where does this leave us?
Setting the right module compiler option is critical
Since interoperability rules differ between hosts, TypeScript can’t offer correct checking behavior unless it understands what kind of module is represented by each file it sees, and what set of rules to apply to them. This is the purpose of the module compiler option. (In particular, code that is intended to run in Node.js is subject to stricter rules than code that will be processed by a bundler. The compiler’s output is not checked for Node.js compatibility unless module is set to node16, node18, or nodenext.)
Applications with CommonJS code should always enable esModuleInterop
In a TypeScript application (as opposed to a library that others may consume) where tsc is used to emit JavaScript files, whether esModuleInterop is enabled doesn’t have major consequences. The way you write imports for certain kinds of modules will change, but TypeScript’s checking and emit are in sync, so error-free code should be safe to run in either mode. The downside of leaving esModuleInterop disabled in this case is that it allows you to write JavaScript code with semantics that clearly violate the ECMAScript specification, confusing intuitions about namespace imports and making it harder to migrate to running ES modules in the future.
In an application that gets processed by a third-party transpiler or bundler, on the other hand, enabling esModuleInterop is more important. All major bundlers and transpilers use an esModuleInterop-like emit strategy, so TypeScript needs to adjust its checking to match. (The compiler always reasons about what will happen in the JavaScript files that tsc would emit, so even if another tool is being used in place of tsc, emit-affecting compiler options should still be set to match the output of that tool as closely as possible.)
allowSyntheticDefaultImports without esModuleInterop should be avoided. It changes the compiler’s checking behavior without changing the code emitted by tsc, allowing potentially unsafe JavaScript to be emitted. Additionally, the checking changes it introduces are an incomplete version of the ones introduced by esModuleInterop. Even if tsc isn’t being used for emit, it’s better to enable esModuleInterop than allowSyntheticDefaultImports.
Some people object to the inclusion of the __importDefault and __importStar helper functions included in tsc’s JavaScript output when esModuleInterop is enabled, either because it marginally increases the output size on disk or because the interop algorithm employed by the helpers seems to misrepresent Node.js’s interop behavior by checking for __esModule, leading to the hazards discussed earlier. Both of these objections can be addressed, at least partially, without accepting the flawed checking behavior exhibited with esModuleInterop disabled. First, the importHelpers compiler option can be used to import the helper functions from tslib rather than inlining them into each file that needs them. To discuss the second objection, let’s look at a final example:
// @Filename: node_modules/transpiled-dependency/index.js
exports.__esModule = true;
exports.default = function doSomething() { /* ... */ };
exports.something = "something";
// @Filename: node_modules/true-cjs-dependency/index.js
module.exports = function doSomethingElse() { /* ... */ };
// @Filename: src/sayHello.ts
export default function sayHello() { /* ... */ }
export const hello = "hello";
// @Filename: src/main.ts
import doSomething from "transpiled-dependency";
import doSomethingElse from "true-cjs-dependency";
import sayHello from "./sayHello.js";
Assume we’re compiling src to CommonJS for use in Node.js. Without allowSyntheticDefaultImports or esModuleInterop, the import of doSomethingElse from "true-cjs-dependency" is an error, and the others are not. To fix the error without changing any compiler options, you could change the import to import doSomethingElse = require("true-cjs-dependency"). However, depending on how the types for the module (not shown) are written, you may also be able to write and call a namespace import, which would be a language-level specification violation. With esModuleInterop, none of the imports shown are errors (and all are callable), but the invalid namespace import would be caught.
What would change if we decided to migrate src to true ESM in Node.js (say, add "type": "module" to our root package.json)? The first import, doSomething from "transpiled-dependency", would no longer be callable—it exhibits the “double default” problem, where we’d have to call doSomething.default() rather than doSomething(). (TypeScript understands and catches this under --module node16—nodenext.) But notably, the second import of doSomethingElse, which needed esModuleInterop to work when compiling to CommonJS, works fine in true ESM.
If there’s something to complain about here, it’s not what esModuleInterop does with the second import. The changes it makes, both allowing the default import and preventing callable namespace imports, are exactly in line with Node.js’s real ESM/CJS interop strategy, and made migration to real ESM easier. The problem, if there is one, is that esModuleInterop seems to fail at giving us a seamless migration path for the first import. But this problem was not introduced by enabling esModuleInterop; the first import was completely unaffected by it. Unfortunately, this problem cannot be solved without breaking the semantic contract between main.ts and sayHello.ts, because the CommonJS output of sayHello.ts looks structurally identical to transpiled-dependency/index.js. If esModuleInterop changed the way the transpiled import of doSomething works to be identical to the way it would work in Node.js ESM, it would change the behavior of the sayHello import in the same way, making the input code violate ESM semantics (thus still preventing the src directory from being migrated to ESM without changes).
As we’ve seen, there is no seamless migration path from transpiled modules to true ESM. But esModuleInterop is one step in the right direction. For those who still prefer to minimize module syntax transformations and the inclusion of the import helper functions, enabling verbatimModuleSyntax is a better choice than disabling esModuleInterop. verbatimModuleSyntax enforces that the import mod = require("mod") and export = ns syntax be used in CommonJS-emitting files, avoiding all the kinds of import ambiguity we’ve discussed, at the cost of ease of migration to true ESM.
Library code needs special considerations
Libraries that ship as CommonJS should avoid using default exports, since the way those transpiled exports can be accessed varies between different tools and runtimes, and some of those ways will look confusing to users. A default export, transpiled to CommonJS by tsc, is accessible in Node.js as the default property of a default import:
import pkg from "pkg";
pkg.default();
in most bundlers or transpiled ESM as the default import itself:
import pkg from "pkg";
pkg();
and in vanilla CommonJS as the default property of a require call:
const pkg = require("pkg");
pkg.default();
Users will detect a misconfigured module smell if they have to access the .default property of a default import, and if they’re trying to write code that will run both in Node.js and a bundler, they might be stuck. Some third-party TypeScript transpilers expose options that change the way default exports are emitted to mitigate this difference, but they don’t produce their own declaration (.d.ts) files, so that creates a mismatch between the runtime behavior and the type checking, further confusing and frustrating users. Instead of using default exports, libraries that need to ship as CommonJS should use export = for modules that have a single main export, or named exports for modules that have multiple exports:
- export default function doSomething() { /* ... */ }
+ export = function doSomething() { /* ... */ }
Libraries (that ship declaration files) should also take extra care to ensure the types they write are error-free under a wide range of compiler options. For example, it’s possible to write one interface that extends another in such a way that it only compiles successfully when strictNullChecks is disabled. If a library were to publish types like that, it would force all their users to disable strictNullChecks too. esModuleInterop can allow type declarations to contain similarly “infectious” default imports:
// @Filename: /node_modules/dependency/index.d.ts
import express from "express";
declare function doSomething(req: express.Request): any;
export = doSomething;
Suppose this default import only works with esModuleInterop enabled, and causes an error when a user without that option references this file. The user should probably enable esModuleInterop anyway, but it’s generally seen as bad form for libraries to make their configurations infectious like this. It would be much better for the library to ship a declaration file like:
import express = require("express");
// ...
Examples like this have led to conventional wisdom that says libraries should not enable esModuleInterop. This advice is a reasonable start, but we’ve looked at examples where the type of a namespace import changes, potentially introducing an error, when enabling esModuleInterop. So whether libraries compile with or without esModuleInterop, they run the risk of writing syntax that makes their choice infectious.
Library authors who want to go above and beyond to ensure maximum compatibility would do well to validate their declaration files against a matrix of compiler options. But using verbatimModuleSyntax completely sidesteps the issue with esModuleInterop by forcing CommonJS-emitting files to use CommonJS-style import and export syntax. Additionally, since esModuleInterop only affects CommonJS, as more libraries move to ESM-only publishing over time, the relevance of this issue will decline.
ASP.NET Core
Install ASP.NET Core and TypeScript
First, install ASP.NET Core if you need it. This quick-start guide requires Visual Studio 2015 or 2017.
Next, if your version of Visual Studio does not already have the latest TypeScript, you can install it.
Create a new project
Choose File
Choose New Project (Ctrl + Shift + N)
Search for .NET Core in the project search bar
Select ASP.NET Core Web Application and press the Next button

Name your project and solution. After select the Create button

In the last window, select the Empty template and press the Create button

Run the application and make sure that it works.

Set up the server
Open Dependencies > Manage NuGet Packages > Browse. Search and install Microsoft.AspNetCore.StaticFiles and Microsoft.TypeScript.MSBuild:

Open up your Startup.cs file and edit your Configure function to look like this:
public void Configure(IApplicationBuilder app, IHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseDefaultFiles();
    app.UseStaticFiles();
}
You may need to restart VS for the red squiggly lines below UseDefaultFiles and UseStaticFiles to disappear.
Add TypeScript
Next we will add a new folder and call it scripts.


Add TypeScript code
Right click on scripts and click New Item. Then choose TypeScript File and name the file app.ts

Add example code
Add the following code to the app.ts file.
function sayHello() {
 const compiler = (document.getElementById("compiler") as HTMLInputElement)
   .value;
 const framework = (document.getElementById("framework") as HTMLInputElement)
   .value;
 return `Hello from ${compiler} and ${framework}!`;
}
Set up the build
Configure the TypeScript compiler
First we need to tell TypeScript how to build. Right click on scripts and click New Item. Then choose TypeScript Configuration File and use the default name of tsconfig.json

Replace the contents of the tsconfig.json file with:
{
 "compilerOptions": {
   "noEmitOnError": true,
   "noImplicitAny": true,
   "sourceMap": true,
   "target": "es6"
 },
 "files": ["./app.ts"],
 "compileOnSave": true
}
noEmitOnError : Do not emit outputs if any errors were reported.
noImplicitAny : Raise error on expressions and declarations with an implied any type.
sourceMap : Generates corresponding .map file.
target : Specify ECMAScript target version.
Note: "ESNext" targets latest supported
noImplicitAny is good idea whenever you’re writing new code — you can make sure that you don’t write any untyped code by mistake. "compileOnSave" makes it easy to update your code in a running web app.
Set up NPM
We need to setup NPM so that JavaScript packages can be downloaded. Right click on the project and select New Item. Then choose NPM Configuration File and use the default name of package.json.

Inside the "devDependencies" section of the package.json file, add gulp and del
"devDependencies": {
   "gulp": "4.0.2",
   "del": "5.1.0"
}
Visual Studio should start installing gulp and del as soon as you save the file. If not, right-click package.json and then Restore Packages.
After you should see an npm folder in your solution explorer

Set up gulp
Right click on the project and click New Item. Then choose JavaScript File and use the name of gulpfile.js
/// <binding AfterBuild='default' Clean='clean' />
/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/
var gulp = require("gulp");
var del = require("del");
var paths = {
 scripts: ["scripts/**/*.js", "scripts/**/*.ts", "scripts/**/*.map"],
};
gulp.task("clean", function () {
 return del(["wwwroot/scripts/**/*"]);
});
gulp.task("default", function (done) {
   gulp.src(paths.scripts).pipe(gulp.dest("wwwroot/scripts"));
   done();
});
The first line tells Visual Studio to run the task ‘default’ after the build finishes. It will also run the ‘clean’ task when you ask Visual Studio to clean the build.
Now right-click on gulpfile.js and click Task Runner Explorer.

If ‘default’ and ‘clean’ tasks don’t show up, refresh the explorer:

Write a HTML page
Right click on the wwwroot folder (if you don’t see the folder try building the project) and add a New Item named index.html inside. Use the following code for index.html
<!DOCTYPE html>
<html>
<head>
   <meta charset="utf-8" />
   <script src="scripts/app.js"></script>
   <title></title>
</head>
<body>
   <div id="message"></div>
   <div>
       Compiler: <input id="compiler" value="TypeScript" onkeyup="document.getElementById('message').innerText = sayHello()" /><br />
       Framework: <input id="framework" value="ASP.NET" onkeyup="document.getElementById('message').innerText = sayHello()" />
   </div>
</body>
</html>
Test
Run the project
As you type on the boxes you should see the message appear/change!

Debug
In Edge, press F12 and click the Debugger tab.
Look in the first localhost folder, then scripts/app.ts
Put a breakpoint on the line with return.
Type in the boxes and confirm that the breakpoint hits in TypeScript code and that inspection works correctly.

Congrats you’ve built your own .NET Core project with a TypeScript frontend.
Gulp
This quick start guide will teach you how to build TypeScript with gulp and then add Browserify, terser, or Watchify to the gulp pipeline. This guide also shows how to add Babel functionality using Babelify.
We assume that you’re already using Node.js with npm.
Minimal project
Let’s start out with a new directory. We’ll name it proj for now, but you can change it to whatever you want.
mkdir proj
cd proj
To start, we’re going to structure our project in the following way:
proj/
  ├─ src/
  └─ dist/
TypeScript files will start out in your src folder, run through the TypeScript compiler and end up in dist.
Let’s scaffold this out:
mkdir src
mkdir dist
Initialize the project
Now we’ll turn this folder into an npm package.
npm init
You’ll be given a series of prompts. You can use the defaults except for your entry point. For your entry point, use ./dist/main.js. You can always go back and change these in the package.json file that’s been generated for you.
Install our dependencies
Now we can use npm install to install packages. First install gulp-cli globally (if you use a Unix system, you may need to prefix the npm install commands in this guide with sudo).
npm install -g gulp-cli
Then install typescript, gulp and gulp-typescript in your project’s dev dependencies. Gulp-typescript is a gulp plugin for TypeScript.
npm install --save-dev typescript gulp@4.0.0 gulp-typescript
Write a simple example
Let’s write a Hello World program. In src, create the file main.ts:
function hello(compiler: string) {
 console.log(`Hello from ${compiler}`);
}
hello("TypeScript");
In the project root, proj, create the file tsconfig.json:
{
 "files": ["src/main.ts"],
 "compilerOptions": {
   "noImplicitAny": true,
   "target": "es5"
 }
}
Create a gulpfile.js
In the project root, create the file gulpfile.js:
var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
gulp.task("default", function () {
 return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});
Test the resulting app
gulp
node dist/main.js
The program should print “Hello from TypeScript!“.
Add modules to the code
Before we get to Browserify, let’s build our code out and add modules to the mix. This is the structure you’re more likely to use for a real app.
Create a file called src/greet.ts:
export function sayHello(name: string) {
 return `Hello from ${name}`;
}
Now change the code in src/main.ts to import sayHello from greet.ts:
import { sayHello } from "./greet";
console.log(sayHello("TypeScript"));
Finally, add src/greet.ts to tsconfig.json:
{
 "files": ["src/main.ts", "src/greet.ts"],
 "compilerOptions": {
   "noImplicitAny": true,
   "target": "es5"
 }
}
Make sure that the modules work by running gulp and then testing in Node:
gulp
node dist/main.js
Notice that even though we used ES2015 module syntax, TypeScript emitted CommonJS modules that Node uses. We’ll stick with CommonJS for this tutorial, but you could set module in the options object to change this.
Browserify
Now let’s move this project from Node to the browser. To do this, we’d like to bundle all our modules into one JavaScript file. Fortunately, that’s exactly what Browserify does. Even better, it lets us use the CommonJS module system used by Node, which is the default TypeScript emit. That means our TypeScript and Node setup will transfer to the browser basically unchanged.
First, install browserify, tsify, and vinyl-source-stream. tsify is a Browserify plugin that, like gulp-typescript, gives access to the TypeScript compiler. vinyl-source-stream lets us adapt the file output of Browserify back into a format that gulp understands called vinyl.
npm install --save-dev browserify tsify vinyl-source-stream
Create a page
Create a file in src named index.html:
<!DOCTYPE html>
<html>
 <head>
   <meta charset="UTF-8" />
   <title>Hello World!</title>
 </head>
 <body>
   <p id="greeting">Loading ...</p>
   <script src="bundle.js"></script>
 </body>
</html>
Now change main.ts to update the page:
import { sayHello } from "./greet";
function showHello(divName: string, name: string) {
 const elt = document.getElementById(divName);
 elt.innerText = sayHello(name);
}
showHello("greeting", "TypeScript");
Calling showHello calls sayHello to change the paragraph’s text. Now change your gulpfile to the following:
var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var paths = {
 pages: ["src/*.html"],
};
gulp.task("copy-html", function () {
 return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});
gulp.task(
 "default",
 gulp.series(gulp.parallel("copy-html"), function () {
   return browserify({
     basedir: ".",
     debug: true,
     entries: ["src/main.ts"],
     cache: {},
     packageCache: {},
   })
     .plugin(tsify)
     .bundle()
     .pipe(source("bundle.js"))
     .pipe(gulp.dest("dist"));
 })
);
This adds the copy-html task and adds it as a dependency of default. That means any time default is run, copy-html has to run first. We’ve also changed default to call Browserify with the tsify plugin instead of gulp-typescript. Conveniently, they both allow us to pass the same options object to the TypeScript compiler.
After calling bundle we use source (our alias for vinyl-source-stream) to name our output bundle bundle.js.
Test the page by running gulp and then opening dist/index.html in a browser. You should see “Hello from TypeScript” on the page.
Notice that we specified debug: true to Browserify. This causes tsify to emit source maps inside the bundled JavaScript file. Source maps let you debug your original TypeScript code in the browser instead of the bundled JavaScript. You can test that source maps are working by opening the debugger for your browser and putting a breakpoint inside main.ts. When you refresh the page the breakpoint should pause the page and let you debug greet.ts.
Watchify, Babel, and Terser
Now that we are bundling our code with Browserify and tsify, we can add various features to our build with browserify plugins.
Watchify starts gulp and keeps it running, incrementally compiling whenever you save a file. This lets you keep an edit-save-refresh cycle going in the browser.
Babel is a hugely flexible compiler that converts ES2015 and beyond into ES5 and ES3. This lets you add extensive and customized transformations that TypeScript doesn’t support.
Terser compacts your code so that it takes less time to download.
Watchify
We’ll start with Watchify to provide background compilation:
npm install --save-dev watchify fancy-log
Now change your gulpfile to the following:
var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var tsify = require("tsify");
var fancy_log = require("fancy-log");
var paths = {
 pages: ["src/*.html"],
};
var watchedBrowserify = watchify(
 browserify({
   basedir: ".",
   debug: true,
   entries: ["src/main.ts"],
   cache: {},
   packageCache: {},
 }).plugin(tsify)
);
gulp.task("copy-html", function () {
 return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});
function bundle() {
 return watchedBrowserify
   .bundle()
   .on("error", fancy_log)
   .pipe(source("bundle.js"))
   .pipe(gulp.dest("dist"));
}
gulp.task("default", gulp.series(gulp.parallel("copy-html"), bundle));
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);
There are basically three changes here, but they require you to refactor your code a bit.
We wrapped our browserify instance in a call to watchify, and then held on to the result.
We called watchedBrowserify.on('update', bundle); so that Browserify will run the bundle function every time one of your TypeScript files changes.
We called watchedBrowserify.on('log', fancy_log); to log to the console.
Together (1) and (2) mean that we have to move our call to browserify out of the default task. And we have to give the function for default a name since both Watchify and Gulp need to call it. Adding logging with (3) is optional but very useful for debugging your setup.
Now when you run Gulp, it should start and stay running. Try changing the code for showHello in main.ts and saving it. You should see output that looks like this:
proj$ gulp
[10:34:20] Using gulpfile ~/src/proj/gulpfile.js
[10:34:20] Starting 'copy-html'...
[10:34:20] Finished 'copy-html' after 26 ms
[10:34:20] Starting 'default'...
[10:34:21] 2824 bytes written (0.13 seconds)
[10:34:21] Finished 'default' after 1.36 s
[10:35:22] 2261 bytes written (0.02 seconds)
[10:35:24] 2808 bytes written (0.05 seconds)
Terser
First install Terser. Since the point of Terser is to mangle your code, we also need to install vinyl-buffer and gulp-sourcemaps to keep sourcemaps working.
npm install --save-dev gulp-terser vinyl-buffer gulp-sourcemaps
Now change your gulpfile to the following:
var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var terser = require("gulp-terser");
var tsify = require("tsify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var paths = {
 pages: ["src/*.html"],
};
gulp.task("copy-html", function () {
 return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});
gulp.task(
 "default",
 gulp.series(gulp.parallel("copy-html"), function () {
   return browserify({
     basedir: ".",
     debug: true,
     entries: ["src/main.ts"],
     cache: {},
     packageCache: {},
   })
     .plugin(tsify)
     .bundle()
     .pipe(source("bundle.js"))
     .pipe(buffer())
     .pipe(sourcemaps.init({ loadMaps: true }))
     .pipe(terser())
     .pipe(sourcemaps.write("./"))
     .pipe(gulp.dest("dist"));
 })
);
Notice that terser itself has just one call — the calls to buffer and sourcemaps exist to make sure sourcemaps keep working. These calls give us a separate sourcemap file instead of using inline sourcemaps like before. Now you can run Gulp and check that bundle.js does get minified into an unreadable mess:
gulp
cat dist/bundle.js
Babel
First install Babelify and the Babel preset for ES2015. Like Terser, Babelify mangles code, so we’ll need vinyl-buffer and gulp-sourcemaps. By default Babelify will only process files with extensions of .js, .es, .es6 and .jsx so we need to add the .ts extension as an option to Babelify.
npm install --save-dev babelify@8 babel-core babel-preset-es2015 vinyl-buffer gulp-sourcemaps
Now change your gulpfile to the following:
var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var paths = {
 pages: ["src/*.html"],
};
gulp.task("copy-html", function () {
 return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});
gulp.task(
 "default",
 gulp.series(gulp.parallel("copy-html"), function () {
   return browserify({
     basedir: ".",
     debug: true,
     entries: ["src/main.ts"],
     cache: {},
     packageCache: {},
   })
     .plugin(tsify)
     .transform("babelify", {
       presets: ["es2015"],
       extensions: [".ts"],
     })
     .bundle()
     .pipe(source("bundle.js"))
     .pipe(buffer())
     .pipe(sourcemaps.init({ loadMaps: true }))
     .pipe(sourcemaps.write("./"))
     .pipe(gulp.dest("dist"));
 })
);
We also need to have TypeScript target ES2015. Babel will then produce ES5 from the ES2015 code that TypeScript emits. Let’s modify tsconfig.json:
{
 "files": ["src/main.ts"],
 "compilerOptions": {
   "noImplicitAny": true,
   "target": "es2015"
 }
}
Babel’s ES5 output should be very similar to TypeScript’s output for such a simple script.
DOM Manipulation
DOM Manipulation
An exploration into the HTMLElement type
In the 20+ years since its standardization, JavaScript has come a very long way. While in 2020, JavaScript can be used on servers, in data science, and even on IoT devices, it is important to remember its most popular use case: web browsers.
Websites are made up of HTML and/or XML documents. These documents are static, they do not change. The Document Object Model (DOM) is a programming interface implemented by browsers to make static websites functional. The DOM API can be used to change the document structure, style, and content. The API is so powerful that countless frontend frameworks (jQuery, React, Angular, etc.) have been developed around it to make dynamic websites even easier to develop.
TypeScript is a typed superset of JavaScript, and it ships type definitions for the DOM API. These definitions are readily available in any default TypeScript project. Of the 20,000+ lines of definitions in lib.dom.d.ts, one stands out among the rest: HTMLElement. This type is the backbone for DOM manipulation with TypeScript.
You can explore the source code for the DOM type definitions
Basic Example
Given a simplified index.html file:
<!DOCTYPE html>
<html lang="en">
 <head><title>TypeScript Dom Manipulation</title></head>
 <body>
   <div id="app"></div>
   <!-- Assume index.js is the compiled output of index.ts -->
   <script src="index.js"></script>
 </body>
</html>
Let’s explore a TypeScript script that adds a <p>Hello, World!</p> element to the #app element.
// 1. Select the div element using the id property
const app = document.getElementById("app");
// 2. Create a new <p></p> element programmatically
const p = document.createElement("p");
// 3. Add the text content
p.textContent = "Hello, World!";
// 4. Append the p element to the div element
app?.appendChild(p);
After compiling and running the index.html page, the resulting HTML will be:
<div id="app">
 <p>Hello, World!</p>
</div>
The Document Interface
The first line of the TypeScript code uses a global variable document. Inspecting the variable shows it is defined by the Document interface from the lib.dom.d.ts file. The code snippet contains calls to two methods, getElementById and createElement.
Document.getElementById
The definition for this method is as follows:
getElementById(elementId: string): HTMLElement | null;
Pass it an element id string and it will return either HTMLElement or null. This method introduces one of the most important types, HTMLElement. It serves as the base interface for every other element interface. For example, the p variable in the code example is of type HTMLParagraphElement. Also, take note that this method can return null. This is because the method can’t be certain pre-runtime if it will be able to actually find the specified element or not. In the last line of the code snippet, the new optional chaining operator is used to call appendChild.
Document.createElement
The definition for this method is (I have omitted the deprecated definition):
createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K];
createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
This is an overloaded function definition. The second overload is simplest and works a lot like the getElementById method does. Pass it any string and it will return a standard HTMLElement. This definition is what enables developers to create unique HTML element tags.
For example document.createElement('xyz') returns a <xyz></xyz> element, clearly not an element that is specified by the HTML specification.
For those interested, you can interact with custom tag elements using the document.getElementsByTagName
For the first definition of createElement, it is using some advanced generic patterns. It is best understood broken down into chunks, starting with the generic expression: <K extends keyof HTMLElementTagNameMap>. This expression defines a generic parameter K that is constrained to the keys of the interface HTMLElementTagNameMap. The map interface contains every specified HTML tag name and its corresponding type interface. For example here are the first 5 mapped values:
interface HTMLElementTagNameMap {
   "a": HTMLAnchorElement;
   "abbr": HTMLElement;
   "address": HTMLElement;
   "applet": HTMLAppletElement;
   "area": HTMLAreaElement;
       ...
}
Some elements do not exhibit unique properties and so they just return HTMLElement, but other types do have unique properties and methods so they return their specific interface (which will extend from or implement HTMLElement).
Now, for the remainder of the createElement definition: (tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K]. The first argument tagName is defined as the generic parameter K. The TypeScript interpreter is smart enough to infer the generic parameter from this argument. This means that the developer does not have to specify the generic parameter when using the method; whatever value is passed to the tagName argument will be inferred as K and thus can be used throughout the remainder of the definition. This is exactly what happens; the return value HTMLElementTagNameMap[K] takes the tagName argument and uses it to return the corresponding type. This definition is how the p variable from the code snippet gets a type of HTMLParagraphElement. And if the code was document.createElement('a'), then it would be an element of type HTMLAnchorElement.
The Node interface
The document.getElementById function returns an HTMLElement. HTMLElement interface extends the Element interface which extends the Node interface. This prototypal extension allows for all HTMLElements to utilize a subset of standard methods. In the code snippet, we use a property defined on the Node interface to append the new p element to the website.
Node.appendChild
The last line of the code snippet is app?.appendChild(p). The previous, document.getElementById, section detailed that the optional chaining operator is used here because app can potentially be null at runtime. The appendChild method is defined by:
appendChild<T extends Node>(newChild: T): T;
This method works similarly to the createElement method as the generic parameter T is inferred from the newChild argument. T is constrained to another base interface Node.
Difference between children and childNodes
Previously, this document details the HTMLElement interface extends from Element which extends from Node. In the DOM API there is a concept of children elements. For example in the following HTML, the p tags are children of the div element
<div>
 <p>Hello, World</p>
 <p>TypeScript!</p>
</div>;
const div = document.getElementsByTagName("div")[0];
div.children;
// HTMLCollection(2) [p, p]
div.childNodes;
// NodeList(2) [p, p]
After capturing the div element, the children prop will return an HTMLCollection list containing the HTMLParagraphElements. The childNodes property will return a similar NodeList list of nodes. Each p tag will still be of type HTMLParagraphElements, but the NodeList can contain additional HTML nodes that the HTMLCollection list cannot.
Modify the HTML by removing one of the p tags, but keep the text.
<div>
 <p>Hello, World</p>
 TypeScript!
</div>;
const div = document.getElementsByTagName("div")[0];
div.children;
// HTMLCollection(1) [p]
div.childNodes;
// NodeList(2) [p, text]
See how both lists change. children now only contains the <p>Hello, World</p> element, and the childNodes contains a text node rather than two p nodes. The text part of the NodeList is the literal Node containing the text TypeScript!. The children list does not contain this Node because it is not considered an HTMLElement.
The querySelector and querySelectorAll methods
Both of these methods are great tools for getting lists of dom elements that fit a more unique set of constraints. They are defined in lib.dom.d.ts as:
/**
* Returns the first element that is a descendant of node that matches selectors.
*/
querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
querySelector<E extends Element = Element>(selectors: string): E | null;
/**
* Returns all element descendants of node that match selectors.
*/
querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
The querySelectorAll definition is similar to getElementsByTagName, except it returns a new type: NodeListOf. This return type is essentially a custom implementation of the standard JavaScript list element. Arguably, replacing NodeListOf<E> with E[] would result in a very similar user experience. NodeListOf only implements the following properties and methods: length, item(index), forEach((value, key, parent) => void), and numeric indexing. Additionally, this method returns a list of elements, not nodes, which is what NodeList was returning from the .childNodes method. While this may appear as a discrepancy, take note that interface Element extends from Node.
To see these methods in action modify the existing code to:
<ul>
 <li>First :)</li>
 <li>Second!</li>
 <li>Third times a charm.</li>
</ul>;
const first = document.querySelector("li"); // returns the first li element
const all = document.querySelectorAll("li"); // returns the list of all li elements
Interested in learning more?
The best part about the lib.dom.d.ts type definitions is that they are reflective of the types annotated in the Mozilla Developer Network (MDN) documentation site. For example, the HTMLElement interface is documented by this HTMLElement page on MDN. These pages list all available properties, methods, and sometimes even examples. Another great aspect of the pages is that they provide links to the corresponding standard documents. Here is the link to the W3C Recommendation for HTMLElement.
Sources:
ECMA-262 Standard
Introduction to the DOM
Migrating from JavaScript
TypeScript doesn’t exist in a vacuum. It was built with the JavaScript ecosystem in mind, and a lot of JavaScript exists today. Converting a JavaScript codebase over to TypeScript is, while somewhat tedious, usually not challenging. In this tutorial, we’re going to look at how you might start out. We assume you’ve read enough of the handbook to write new TypeScript code.
If you’re looking to convert a React project, we recommend looking at the React Conversion Guide first.
Setting up your Directories
If you’re writing in plain JavaScript, it’s likely that you’re running your JavaScript directly, where your .js files are in a src, lib, or dist directory, and then run as desired.
If that’s the case, the files that you’ve written are going to be used as inputs to TypeScript, and you’ll run the outputs it produces. During our JS to TS migration, we’ll need to separate our input files to prevent TypeScript from overwriting them. If your output files need to reside in a specific directory, then that will be your output directory.
You might also be running some intermediate steps on your JavaScript, such as bundling or using another transpiler like Babel. In this case, you might already have a folder structure like this set up.
From this point on, we’re going to assume that your directory is set up something like this:
projectRoot
├── src
│   ├── file1.js
│   └── file2.js
├── built
└── tsconfig.json
If you have a tests folder outside of your src directory, you might have one tsconfig.json in src, and one in tests as well.
Writing a Configuration File
TypeScript uses a file called tsconfig.json for managing your project’s options, such as which files you want to include, and what sorts of checking you want to perform. Let’s create a bare-bones one for our project:
{
 "compilerOptions": {
   "outDir": "./built",
   "allowJs": true,
   "target": "es5"
 },
 "include": ["./src/**/*"]
}
Here we’re specifying a few things to TypeScript:
Read in any files it understands in the src directory (with include).
Accept JavaScript files as inputs (with allowJs).
Emit all of the output files in built (with outDir).
Translate newer JavaScript constructs down to an older version like ECMAScript 5 (using target).
At this point, if you try running tsc at the root of your project, you should see output files in the built directory. The layout of files in built should look identical to the layout of src. You should now have TypeScript working with your project.
Early Benefits
Even at this point you can get some great benefits from TypeScript understanding your project. If you open up an editor like VS Code or Visual Studio, you’ll see that you can often get some tooling support like completion. You can also catch certain bugs with options like:
noImplicitReturns which prevents you from forgetting to return at the end of a function.
noFallthroughCasesInSwitch which is helpful if you never want to forget a break statement between cases in a switch block.
TypeScript will also warn about unreachable code and labels, which you can disable with allowUnreachableCode and allowUnusedLabels respectively.
Integrating with Build Tools
You might have some more build steps in your pipeline. Perhaps you concatenate something to each of your files. Each build tool is different, but we’ll do our best to cover the gist of things.
Gulp
If you’re using Gulp in some fashion, we have a tutorial on using Gulp with TypeScript, and integrating with common build tools like Browserify, Babelify, and Uglify. You can read more there.
Webpack
Webpack integration is pretty simple. You can use ts-loader, a TypeScript loader, combined with source-map-loader for easier debugging. Simply run
npm install ts-loader source-map-loader
and merge in options from the following into your webpack.config.js file:
module.exports = {
 entry: "./src/index.ts",
 output: {
   filename: "./dist/bundle.js",
 },
 // Enable sourcemaps for debugging webpack's output.
 devtool: "source-map",
 resolve: {
   // Add '.ts' and '.tsx' as resolvable extensions.
   extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
 },
 module: {
   rules: [
     // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
     { test: /\.tsx?$/, loader: "ts-loader" },
     // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
     { test: /\.js$/, loader: "source-map-loader" },
   ],
 },
 // Other options...
};
It’s important to note that ts-loader will need to run before any other loader that deals with .js files.
You can see an example of using Webpack in our tutorial on React and Webpack.
Moving to TypeScript Files
At this point, you’re probably ready to start using TypeScript files. The first step is to rename one of your .js files to .ts. If your file uses JSX, you’ll need to rename it to .tsx.
Finished with that step? Great! You’ve successfully migrated a file from JavaScript to TypeScript!
Of course, that might not feel right. If you open that file in an editor with TypeScript support (or if you run tsc --pretty), you might see red squiggles on certain lines. You should think of these the same way you’d think of red squiggles in an editor like Microsoft Word. TypeScript will still translate your code, just like Word will still let you print your documents.
If that sounds too lax for you, you can tighten that behavior up. If, for instance, you don’t want TypeScript to compile to JavaScript in the face of errors, you can use the noEmitOnError option. In that sense, TypeScript has a dial on its strictness, and you can turn that knob up as high as you want.
If you plan on using the stricter settings that are available, it’s best to turn them on now (see Getting Stricter Checks below). For instance, if you never want TypeScript to silently infer any for a type without you explicitly saying so, you can use noImplicitAny before you start modifying your files. While it might feel somewhat overwhelming, the long-term gains become apparent much more quickly.
Weeding out Errors
Like we mentioned, it’s not unexpected to get error messages after conversion. The important thing is to actually go one by one through these and decide how to deal with the errors. Often these will be legitimate bugs, but sometimes you’ll have to explain what you’re trying to do a little better to TypeScript.
Importing from Modules
You might start out getting a bunch of errors like Cannot find name 'require'., and Cannot find name 'define'.. In these cases, it’s likely that you’re using modules. While you can just convince TypeScript that these exist by writing out
// For Node/CommonJS
declare function require(path: string): any;
or
// For RequireJS/AMD
declare function define(...args: any[]): any;
it’s better to get rid of those calls and use TypeScript syntax for imports.
First, you’ll need to enable some module system by setting TypeScript’s module option. Valid options are commonjs, amd, system, and umd.
If you had the following Node/CommonJS code:
var foo = require("foo");
foo.doStuff();
or the following RequireJS/AMD code:
define(["foo"], function (foo) {
 foo.doStuff();
});
then you would write the following TypeScript code:
import foo = require("foo");
foo.doStuff();
Getting Declaration Files
If you started converting over to TypeScript imports, you’ll probably run into errors like Cannot find module 'foo'.. The issue here is that you likely don’t have declaration files to describe your library. Luckily this is pretty easy. If TypeScript complains about a package like lodash, you can just write
npm install -S @types/lodash
If you’re using a module option other than commonjs, you’ll need to set your moduleResolution option to node.
After that, you’ll be able to import lodash with no issues, and get accurate completions.
Exporting from Modules
Typically, exporting from a module involves adding properties to a value like exports or module.exports. TypeScript allows you to use top-level export statements. For instance, if you exported a function like so:
module.exports.feedPets = function (pets) {
 // ...
};
you could write that out as the following:
export function feedPets(pets) {
 // ...
}
Sometimes you’ll entirely overwrite the exports object. This is a common pattern people use to make their modules immediately callable like in this snippet:
var express = require("express");
var app = express();
You might have previously written that like so:
function foo() {
 // ...
}
module.exports = foo;
In TypeScript, you can model this with the export = construct.
function foo() {
 // ...
}
export = foo;
Too many/too few arguments
You’ll sometimes find yourself calling a function with too many/few arguments. Typically, this is a bug, but in some cases, you might have declared a function that uses the arguments object instead of writing out any parameters:
function myCoolFunction() {
 if (arguments.length == 2 && !Array.isArray(arguments[1])) {
   var f = arguments[0];
   var arr = arguments[1];
   // ...
 }
 // ...
}
myCoolFunction(
 function (x) {
   console.log(x);
 },
 [1, 2, 3, 4]
);
myCoolFunction(
 function (x) {
   console.log(x);
 },
 1,
 2,
 3,
 4
);
In this case, we need to use TypeScript to tell any of our callers about the ways myCoolFunction can be called using function overloads.
function myCoolFunction(f: (x: number) => void, nums: number[]): void;
function myCoolFunction(f: (x: number) => void, ...nums: number[]): void;
function myCoolFunction() {
 if (arguments.length == 2 && !Array.isArray(arguments[1])) {
   var f = arguments[0];
   var arr = arguments[1];
   // ...
 }
 // ...
}
We added two overload signatures to myCoolFunction. The first checks states that myCoolFunction takes a function (which takes a number), and then a list of numbers. The second one says that it will take a function as well, and then uses a rest parameter (...nums) to state that any number of arguments after that need to be numbers.
Sequentially Added Properties
Some people find it more aesthetically pleasing to create an object and add properties immediately after like so:
var options = {};
options.color = "red";
options.volume = 11;
TypeScript will say that you can’t assign to color and volume because it first figured out the type of options as {} which doesn’t have any properties. If you instead moved the declarations into the object literal themselves, you’d get no errors:
let options = {
 color: "red",
 volume: 11,
};
You could also define the type of options and add a type assertion on the object literal.
interface Options {
 color: string;
 volume: number;
}
let options = {} as Options;
options.color = "red";
options.volume = 11;
Alternatively, you can just say options has the type any which is the easiest thing to do, but which will benefit you the least.
any, Object, and {}
You might be tempted to use Object or {} to say that a value can have any property on it because Object is, for most purposes, the most general type. However any is actually the type you want to use in those situations, since it’s the most flexible type.
For instance, if you have something that’s typed as Object you won’t be able to call methods like toLowerCase() on it. Being more general usually means you can do less with a type, but any is special in that it is the most general type while still allowing you to do anything with it. That means you can call it, construct it, access properties on it, etc. Keep in mind though, whenever you use any, you lose out on most of the error checking and editor support that TypeScript gives you.
If a decision ever comes down to Object and {}, you should prefer {}. While they are mostly the same, technically {} is a more general type than Object in certain esoteric cases.
Getting Stricter Checks
TypeScript comes with certain checks to give you more safety and analysis of your program. Once you’ve converted your codebase to TypeScript, you can start enabling these checks for greater safety.
No Implicit any
There are certain cases where TypeScript can’t figure out what certain types should be. To be as lenient as possible, it will decide to use the type any in its place. While this is great for migration, using any means that you’re not getting any type safety, and you won’t get the same tooling support you’d get elsewhere. You can tell TypeScript to flag these locations down and give an error with the noImplicitAny option.
Strict null & undefined Checks
By default, TypeScript assumes that null and undefined are in the domain of every type. That means anything declared with the type number could be null or undefined. Since null and undefined are such a frequent source of bugs in JavaScript and TypeScript, TypeScript has the strictNullChecks option to spare you the stress of worrying about these issues.
When strictNullChecks is enabled, null and undefined get their own types called null and undefined respectively. Whenever anything is possibly null, you can use a union type with the original type. So for instance, if something could be a number or null, you’d write the type out as number | null.
If you ever have a value that TypeScript thinks is possibly null/undefined, but you know better, you can use the postfix ! operator to tell it otherwise.
declare var foo: string[] | null;
foo.length; // error - 'foo' is possibly 'null'
foo!.length; // okay - 'foo!' just has type 'string[]'
As a heads up, when using strictNullChecks, your dependencies may need to be updated to use strictNullChecks as well.
No Implicit any for this
When you use the this keyword outside of classes, it has the type any by default. For instance, imagine a Point class, and imagine a function that we wish to add as a method:
class Point {
 constructor(public x, public y) {}
 getDistance(p: Point) {
   let dx = p.x - this.x;
   let dy = p.y - this.y;
   return Math.sqrt(dx ** 2 + dy ** 2);
 }
}
// ...
// Reopen the interface.
interface Point {
 distanceFromOrigin(): number;
}
Point.prototype.distanceFromOrigin = function () {
 return this.getDistance({ x: 0, y: 0 });
};
This has the same problems we mentioned above - we could easily have misspelled getDistance and not gotten an error. For this reason, TypeScript has the noImplicitThis option. When that option is set, TypeScript will issue an error when this is used without an explicit (or inferred) type. The fix is to use a this-parameter to give an explicit type in the interface or in the function itself:
Point.prototype.distanceFromOrigin = function (this: Point) {
 return this.getDistance({ x: 0, y: 0 });
};
Using Babel with TypeScript
Babel vs tsc for TypeScript
When making a modern JavaScript project, you might ask yourself what is the right way to convert files from TypeScript to JavaScript?
A lot of the time the answer is “it depends”, or “someone may have decided for you” depending on the project. If you are building your project with an existing framework like tsdx, Angular, NestJS or any framework mentioned in the Getting Started then this decision is handled for you.
However, a useful heuristic could be:
Is your build output mostly the same as your source input files? Use tsc
Do you need a build pipeline with multiple potential outputs? Use babel for transpiling and tsc for type checking
Babel for transpiling, tsc for types
This is a common pattern for projects with existing build infrastructure which may have been ported from a JavaScript codebase to TypeScript.
This technique is a hybrid approach, using Babel’s preset-typescript to generate your JS files, and then using TypeScript to do type checking and .d.ts file generation.
By using babel’s support for TypeScript, you get the ability to work with existing build pipelines and are more likely to have a faster JS emit time because Babel does not type check your code.
Type Checking and d.ts file generation
The downside to using babel is that you don’t get type checking during the transition from TS to JS. This can mean that type errors which you miss in your editor could sneak through into production code.
In addition to that, Babel cannot create .d.ts files for your TypeScript which can make it harder to work with your project if it is a library.
To fix these issues, you would probably want to set up a command to type check your project using TSC. This likely means duplicating some of your babel config into a corresponding tsconfig.json and ensuring these flags are enabled:
"compilerOptions": {
 // Ensure that .d.ts files are created by tsc, but not .js files
 "declaration": true,
 "emitDeclarationOnly": true,
 // Ensure that Babel can safely transpile files in the TypeScript project
 "isolatedModules": true
}
For more information on these flags:
isolatedModules
declaration, emitDeclarationOnly

Introduction
The Declaration Files section is designed to teach you how to write a high-quality TypeScript Declaration File. We need to assume basic familiarity with the TypeScript language in order to get started.
If you haven’t already, you should read the TypeScript Handbook to familiarize yourself with basic concepts, especially types and modules.
The most common case for learning how .d.ts files work is that you’re typing an npm package with no types. In that case, you can jump straight to Modules .d.ts.
The Declaration Files section is broken down into the following sections.
Declaration Reference
We are often faced with writing a declaration file when we only have examples of the underlying library to guide us. The Declaration Reference section shows many common API patterns and how to write declarations for each of them. This guide is aimed at the TypeScript novice who may not yet be familiar with every language construct in TypeScript.
Library Structures
The Library Structures guide helps you understand common library formats and how to write a proper declaration file for each format. If you’re editing an existing file, you probably don’t need to read this section. Authors of new declaration files are strongly encouraged to read this section to properly understand how the format of the library influences the writing of the declaration file.
In the Template section you’ll find a number of declaration files that serve as a useful starting point when writing a new file. If you already know what your structure is, see the d.ts Template section in the sidebar.
Do’s and Don’ts
Many common mistakes in declaration files can be easily avoided. The Do’s and Don’ts section identifies common errors, describes how to detect them, and how to fix them. Everyone should read this section to help themselves avoid common mistakes.
Deep Dive
For seasoned authors interested in the underlying mechanics of how declaration files work, the Deep Dive section explains many advanced concepts in declaration writing, and shows how to leverage these concepts to create cleaner and more intuitive declaration files.
Publish to npm
The Publishing section explains how to publish your declaration files to an npm package, and shows how to manage your dependent packages.
Find and Install Declaration Files
For JavaScript library users, the Consumption section offers a few simple steps to locate and install corresponding declaration files.
On this page
Declaration Reference
Library Structures
Do’s and Don’ts
Deep Dive
Publish to npm
Find and Install Declaration Files
Is this page helpful?
YesNo
Declaration Reference
The purpose of this guide is to teach you how to write a high-quality definition file. This guide is structured by showing documentation for some API, along with sample usage of that API, and explaining how to write the corresponding declaration.
These examples are ordered in approximately increasing order of complexity.
Objects with Properties
Documentation
The global variable myLib has a function makeGreeting for creating greetings, and a property numberOfGreetings indicating the number of greetings made so far.
Code
let result = myLib.makeGreeting("hello, world");
console.log("The computed greeting is:" + result);
let count = myLib.numberOfGreetings;
Declaration
Use declare namespace to describe types or values accessed by dotted notation.
declare namespace myLib {
 function makeGreeting(s: string): string;
 let numberOfGreetings: number;
}
Overloaded Functions
Documentation
The getWidget function accepts a number and returns a Widget, or accepts a string and returns a Widget array.
Code
let x: Widget = getWidget(43);
let arr: Widget[] = getWidget("all of them");
Declaration
declare function getWidget(n: number): Widget;
declare function getWidget(s: string): Widget[];
Reusable Types (Interfaces)
Documentation
When specifying a greeting, you must pass a GreetingSettings object. This object has the following properties:
1 - greeting: Mandatory string
2 - duration: Optional length of time (in milliseconds)
3 - color: Optional string, e.g. ‘#ff00ff’
Code
greet({
 greeting: "hello world",
 duration: 4000
});
Declaration
Use an interface to define a type with properties.
interface GreetingSettings {
 greeting: string;
 duration?: number;
 color?: string;
}
declare function greet(setting: GreetingSettings): void;
Reusable Types (Type Aliases)
Documentation
Anywhere a greeting is expected, you can provide a string, a function returning a string, or a Greeter instance.
Code
function getGreeting() {
 return "howdy";
}
class MyGreeter extends Greeter {}
greet("hello");
greet(getGreeting);
greet(new MyGreeter());
Declaration
You can use a type alias to make a shorthand for a type:
type GreetingLike = string | (() => string) | MyGreeter;
declare function greet(g: GreetingLike): void;
Organizing Types
Documentation
The greeter object can log to a file or display an alert. You can provide LogOptions to .log(...) and alert options to .alert(...)
Code
const g = new Greeter("Hello");
g.log({ verbose: true });
g.alert({ modal: false, title: "Current Greeting" });
Declaration
Use namespaces to organize types.
declare namespace GreetingLib {
 interface LogOptions {
   verbose?: boolean;
 }
 interface AlertOptions {
   modal: boolean;
   title?: string;
   color?: string;
 }
}
You can also create nested namespaces in one declaration:
declare namespace GreetingLib.Options {
 // Refer to via GreetingLib.Options.Log
 interface Log {
   verbose?: boolean;
 }
 interface Alert {
   modal: boolean;
   title?: string;
   color?: string;
 }
}
Classes
Documentation
You can create a greeter by instantiating the Greeter object, or create a customized greeter by extending from it.
Code
const myGreeter = new Greeter("hello, world");
myGreeter.greeting = "howdy";
myGreeter.showGreeting();
class SpecialGreeter extends Greeter {
 constructor() {
   super("Very special greetings");
 }
}
Declaration
Use declare class to describe a class or class-like object. Classes can have properties and methods as well as a constructor.
declare class Greeter {
 constructor(greeting: string);
 greeting: string;
 showGreeting(): void;
}
Global Variables
Documentation
The global variable foo contains the number of widgets present.
Code
console.log("Half the number of widgets is " + foo / 2);
Declaration
Use declare var to declare variables. If the variable is read-only, you can use declare const. You can also use declare let if the variable is block-scoped.
/** The number of widgets present */
declare var foo: number;
Global Functions
Documentation
You can call the function greet with a string to show a greeting to the user.
Code
greet("hello, world");
Declaration
Use declare function to declare functions.
declare function greet(greeting: string): void;
Library Structures
Broadly speaking, the way you structure your declaration file depends on how the library is consumed. There are many ways of offering a library for consumption in JavaScript, and you’ll need to write your declaration file to match it. This guide covers how to identify common library patterns, and how to write declaration files which correspond to that pattern.
Each type of major library structuring pattern has a corresponding file in the Templates section. You can start with these templates to help you get going faster.
Identifying Kinds of Libraries
First, we’ll review the kinds of libraries TypeScript declaration files can represent. We’ll briefly show how each kind of library is used, how it is written, and list some example libraries from the real world.
Identifying the structure of a library is the first step in writing its declaration file. We’ll give hints on how to identify structure both based on its usage and its code. Depending on the library’s documentation and organization, one might be easier than the other. We recommend using whichever is more comfortable to you.
What should you look for?
Question to ask yourself while looking at a library you are trying to type.
How do you obtain the library?
For example, can you only get it through npm or only from a CDN?
How would you import it?
Does it add a global object? Does it use require or import/export statements?
Smaller samples for different types of libraries
Modular Libraries
Almost every modern Node.js library falls into the module family. These type of libraries only work in a JS environment with a module loader. For example, express only works in Node.js and must be loaded using the CommonJS require function.
ECMAScript 2015 (also known as ES2015, ECMAScript 6, and ES6), CommonJS, and RequireJS have similar notions of importing a module. In JavaScript CommonJS (Node.js), for example, you would write
var fs = require("fs");
In TypeScript or ES6, the import keyword serves the same purpose:
import * as fs from "fs";
You’ll typically see modular libraries include one of these lines in their documentation:
var someLib = require("someLib");
or
define(..., ['someLib'], function(someLib) {
});
As with global modules, you might see these examples in the documentation of a UMD module, so be sure to check the code or documentation.
Identifying a Module Library from Code
Modular libraries will typically have at least some of the following:
Unconditional calls to require or define
Declarations like import * as a from 'b'; or export c;
Assignments to exports or module.exports
They will rarely have:
Assignments to properties of window or global
Templates For Modules
There are four templates available for modules, module.d.ts, module-class.d.ts, module-function.d.ts and module-plugin.d.ts.
You should first read module.d.ts for an overview on the way they all work.
Then use the template module-function.d.ts if your module can be called like a function:
const x = require("foo");
// Note: calling 'x' as a function
const y = x(42);
Use the template module-class.d.ts if your module can be constructed using new:
const x = require("bar");
// Note: using 'new' operator on the imported variable
const y = new x("hello");
If you have a module which when imported, makes changes to other modules use template module-plugin.d.ts:
const jest = require("jest");
require("jest-matchers-files");
Global Libraries
A global library is one that can be accessed from the global scope (i.e. without using any form of import). Many libraries simply expose one or more global variables for use. For example, if you were using jQuery, the $ variable can be used by simply referring to it:
$(() => {
 console.log("hello!");
});
You’ll usually see guidance in the documentation of a global library of how to use the library in an HTML script tag:
<script src="http://a.great.cdn.for/someLib.js"></script>
Today, most popular globally-accessible libraries are actually written as UMD libraries (see below). UMD library documentation is hard to distinguish from global library documentation. Before writing a global declaration file, make sure the library isn’t actually UMD.
Identifying a Global Library from Code
Global library code is usually extremely simple. A global “Hello, world” library might look like this:
function createGreeting(s) {
 return "Hello, " + s;
}
or like this:
// Web
window.createGreeting = function (s) {
 return "Hello, " + s;
};
// Node
global.createGreeting = function (s) {
 return "Hello, " + s;
};
// Potentially any runtime
globalThis.createGreeting = function (s) {
 return "Hello, " + s;
};
When looking at the code of a global library, you’ll usually see:
Top-level var statements or function declarations
One or more assignments to window.someName
Assumptions that DOM primitives like document or window exist
You won’t see:
Checks for, or usage of, module loaders like require or define
CommonJS/Node.js-style imports of the form var fs = require("fs");
Calls to define(...)
Documentation describing how to require or import the library
Examples of Global Libraries
Because it’s usually easy to turn a global library into a UMD library, very few popular libraries are still written in the global style. However, libraries that are small and require the DOM (or have no dependencies) may still be global.
Global Library Template
The template file global.d.ts defines an example library myLib. Be sure to read the “Preventing Name Conflicts” footnote.
UMD
A UMD module is one that can either be used as module (through an import), or as a global (when run in an environment without a module loader). Many popular libraries, such as Moment.js, are written this way. For example, in Node.js or using RequireJS, you would write:
import moment = require("moment");
console.log(moment.format());
whereas in a vanilla browser environment you would write:
console.log(moment.format());
Identifying a UMD library
UMD modules check for the existence of a module loader environment. This is an easy-to-spot pattern that looks something like this:
(function (root, factory) {
   if (typeof define === "function" && define.amd) {
       define(["libName"], factory);
   } else if (typeof module === "object" && module.exports) {
       module.exports = factory(require("libName"));
   } else {
       root.returnExports = factory(root.libName);
   }
}(this, function (b) {
If you see tests for typeof define, typeof window, or typeof module in the code of a library, especially at the top of the file, it’s almost always a UMD library.
Documentation for UMD libraries will also often demonstrate a “Using in Node.js” example showing require, and a “Using in the browser” example showing using a <script> tag to load the script.
Examples of UMD libraries
Most popular libraries are now available as UMD packages. Examples include jQuery, Moment.js, lodash, and many more.
Template
Use the module-plugin.d.ts template.
Consuming Dependencies
There are several kinds of dependencies your library might have. This section shows how to import them into the declaration file.
Dependencies on Global Libraries
If your library depends on a global library, use a /// <reference types="..." /> directive:
/// <reference types="someLib" />
function getThing(): someLib.thing;
Dependencies on Modules
If your library depends on a module, use an import statement:
import * as moment from "moment";
function getThing(): moment;
Dependencies on UMD libraries
From a Global Library
If your global library depends on a UMD module, use a /// <reference types directive:
/// <reference types="moment" />
function getThing(): moment;
From a Module or UMD Library
If your module or UMD library depends on a UMD library, use an import statement:
import * as someLib from "someLib";
Do not use a /// <reference directive to declare a dependency to a UMD library!
Footnotes
Preventing Name Conflicts
Note that it’s possible to define many types in the global scope when writing a global declaration file. We strongly discourage this as it leads to possible unresolvable name conflicts when many declaration files are in a project.
A simple rule to follow is to only declare types namespaced by whatever global variable the library defines. For example, if the library defines the global value ‘cats’, you should write
declare namespace cats {
 interface KittySettings {}
}
But not
// at top-level
interface CatsKittySettings {}
This guidance also ensures that the library can be transitioned to UMD without breaking declaration file users.
The Impact of ES6 on Module Call Signatures
Many popular libraries, such as Express, expose themselves as a callable function when imported. For example, the typical Express usage looks like this:
import exp = require("express");
var app = exp();
In ES6-compliant module loaders, the top-level object (here imported as exp) can only have properties; the top-level module object can never be callable.
The most common solution here is to define a default export for a callable/constructable object; module loaders commonly detect this situation automatically and replace the top-level object with the default export. TypeScript can handle this for you, if you have "esModuleInterop": true in your tsconfig.json.
Modules .d.ts
Comparing JavaScript to an example DTS
Common CommonJS Patterns
A module using CommonJS patterns uses module.exports to describe the exported values. For example, here is a module which exports a function and a numerical constant:
const maxInterval = 12;
function getArrayLength(arr) {
 return arr.length;
}
module.exports = {
 getArrayLength,
 maxInterval,
};
This can be described by the following .d.ts:
export function getArrayLength(arr: any[]): number;
export const maxInterval: 12;
The TypeScript playground can show you the .d.ts equivalent for JavaScript code. You can try it yourself here.
The .d.ts syntax intentionally looks like ES Modules syntax. ES Modules was ratified by TC39 in 2015 as part of ES2015 (ES6), while it has been available via transpilers for a long time, however if you have a JavaScript codebase using ES Modules:
export function getArrayLength(arr) {
 return arr.length;
}
This would have the following .d.ts equivalent:
export function getArrayLength(arr: any[]): number;
Default Exports
In CommonJS you can export any value as the default export, for example here is a regular expression module:
module.exports = /hello( world)?/;
Which can be described by the following .d.ts:
declare const helloWorld: RegExp;
export = helloWorld;
Or a number:
module.exports = 3.142;
declare const pi: number;
export = pi;
One style of exporting in CommonJS is to export a function. Because a function is also an object, then extra fields can be added and are included in the export.
function getArrayLength(arr) {
 return arr.length;
}
getArrayLength.maxInterval = 12;
module.exports = getArrayLength;
Which can be described with:
declare function getArrayLength(arr: any[]): number;
declare namespace getArrayLength {
 declare const maxInterval: 12;
}
export = getArrayLength;
See Module: Functions for details of how that works, and the Modules reference page.
Handling Many Consuming Import
There are many ways to import a module in modern consuming code:
const fastify = require("fastify");
const { fastify } = require("fastify");
import fastify = require("fastify");
import * as Fastify from "fastify";
import { fastify, FastifyInstance } from "fastify";
import fastify from "fastify";
import fastify, { FastifyInstance } from "fastify";
Covering all of these cases requires the JavaScript code to actually support all of these patterns. To support many of these patterns, a CommonJS module would need to look something like:
class FastifyInstance {}
function fastify() {
 return new FastifyInstance();
}
fastify.FastifyInstance = FastifyInstance;
// Allows for { fastify }
fastify.fastify = fastify;
// Allows for strict ES Module support
fastify.default = fastify;
// Sets the default export
module.exports = fastify;
Types in Modules
You may want to provide a type for JavaScript code which does not exist
function getArrayMetadata(arr) {
 return {
   length: getArrayLength(arr),
   firstObject: arr[0],
 };
}
module.exports = {
 getArrayMetadata,
};
This can be described with:
export type ArrayMetadata = {
 length: number;
 firstObject: any | undefined;
};
export function getArrayMetadata(arr: any[]): ArrayMetadata;
This example is a good case for using generics to provide richer type information:
export type ArrayMetadata<ArrType> = {
 length: number;
 firstObject: ArrType | undefined;
};
export function getArrayMetadata<ArrType>(
 arr: ArrType[]
): ArrayMetadata<ArrType>;
Now the type of the array propagates into the ArrayMetadata type.
The types which are exported can then be re-used by consumers of the modules using either import or import type in TypeScript code or JSDoc imports.
Namespaces in Module Code
Trying to describe the runtime relationship of JavaScript code can be tricky. When the ES Module-like syntax doesn’t provide enough tools to describe the exports then you can use namespaces.
For example, you may have complex enough types to describe that you choose to namespace them inside your .d.ts:
// This represents the JavaScript class which would be available at runtime
export class API {
 constructor(baseURL: string);
 getInfo(opts: API.InfoRequest): API.InfoResponse;
}
// This namespace is merged with the API class and allows for consumers, and this file
// to have types which are nested away in their own sections.
declare namespace API {
 export interface InfoRequest {
   id: string;
 }
 export interface InfoResponse {
   width: number;
   height: number;
 }
}
To understand how namespaces work in .d.ts files read the .d.ts deep dive.
Optional Global Usage
You can use export as namespace to declare that your module will be available in the global scope in UMD contexts:
export as namespace moduleName;
Reference Example
To give you an idea of how all these pieces can come together, here is a reference .d.ts to start with when making a new module
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>
/*~ This is the module template file. You should rename it to index.d.ts
*~ and place it in a folder with the same name as the module.
*~ For example, if you were writing a file for "super-greeter", this
*~ file should be 'super-greeter/index.d.ts'
*/
/*~ If this module is a UMD module that exposes a global variable 'myLib' when
*~ loaded outside a module loader environment, declare that global here.
*~ Otherwise, delete this declaration.
*/
export as namespace myLib;
/*~ If this module exports functions, declare them like so.
*/
export function myFunction(a: string): string;
export function myOtherFunction(a: number): number;
/*~ You can declare types that are available via importing the module */
export interface SomeType {
 name: string;
 length: number;
 extras?: string[];
}
/*~ You can declare properties of the module using const, let, or var */
export const myField: number;
Library file layout
The layout of your declaration files should mirror the layout of the library.
A library can consist of multiple modules, such as
myLib
 +---- index.js
 +---- foo.js
 +---- bar
        +---- index.js
        +---- baz.js
These could be imported as
var a = require("myLib");
var b = require("myLib/foo");
var c = require("myLib/bar");
var d = require("myLib/bar/baz");
Your declaration files should thus be
@types/myLib
 +---- index.d.ts
 +---- foo.d.ts
 +---- bar
        +---- index.d.ts
        +---- baz.d.ts
Testing your types
If you are planning on submitting these changes to DefinitelyTyped for everyone to also use, then we recommend you:
Create a new folder in node_modules/@types/[libname]
Create an index.d.ts in that folder, and copy the example in
See where your usage of the module breaks, and start to fill out the index.d.ts
When you’re happy, clone DefinitelyTyped/DefinitelyTyped and follow the instructions in the README.
Otherwise
Create a new file in the root of your source tree: [libname].d.ts
Add declare module "[libname]" { }
Add the template inside the braces of the declare module, and see where your usage breaks
Module: Plugin
For example, when you want to work with JavaScript code which extends another library.
import { greeter } from "super-greeter";
// Normal Greeter API
greeter(2);
greeter("Hello world");
// Now we extend the object with a new function at runtime
import "hyper-super-greeter";
greeter.hyperGreet();
The definition for “super-greeter”:
/*~ This example shows how to have multiple overloads for your function */
export interface GreeterFunction {
 (name: string): void
 (time: number): void
}
/*~ This example shows how to export a function specified by an interface */
export const greeter: GreeterFunction;
We can extend the existing module like the following:
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>
/*~ This is the module plugin template file. You should rename it to index.d.ts
*~ and place it in a folder with the same name as the module.
*~ For example, if you were writing a file for "super-greeter", this
*~ file should be 'super-greeter/index.d.ts'
*/
/*~ On this line, import the module which this module adds to */
import { greeter } from "super-greeter";
/*~ Here, declare the same module as the one you imported above
*~ then we expand the existing declaration of the greeter function
*/
export module "super-greeter" {
 export interface GreeterFunction {
   /** Greets even better! */
   hyperGreet(): void;
 }
}
This uses declaration merging
The Impact of ES6 on Module Plugins
Some plugins add or modify top-level exports on existing modules. While this is legal in CommonJS and other loaders, ES6 modules are considered immutable and this pattern will not be possible. Because TypeScript is loader-agnostic, there is no compile-time enforcement of this policy, but developers intending to transition to an ES6 module loader should be aware of this.
Module: Class
For example, when you want to work with JavaScript code which looks like:
const Greeter = require("super-greeter");
const greeter = new Greeter();
greeter.greet();
To handle both importing via UMD and modules:
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>
/*~ This is the module template file for class modules.
*~ You should rename it to index.d.ts and place it in a folder with the same name as the module.
*~ For example, if you were writing a file for "super-greeter", this
*~ file should be 'super-greeter/index.d.ts'
*/
// Note that ES6 modules cannot directly export class objects.
// This file should be imported using the CommonJS-style:
//   import x = require('[~THE MODULE~]');
//
// Alternatively, if --allowSyntheticDefaultImports or
// --esModuleInterop is turned on, this file can also be
// imported as a default import:
//   import x from '[~THE MODULE~]';
//
// Refer to the TypeScript documentation at
// https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
// to understand common workarounds for this limitation of ES6 modules.
/*~ If this module is a UMD module that exposes a global variable 'myClassLib' when
*~ loaded outside a module loader environment, declare that global here.
*~ Otherwise, delete this declaration.
*/
export as namespace myClassLib;
/*~ This declaration specifies that the class constructor function
*~ is the exported object from the file
*/
export = Greeter;
/*~ Write your module's methods and properties in this class */
declare class Greeter {
 constructor(customGreeting?: string);
 greet: void;
 myMethod(opts: MyClass.MyClassMethodOptions): number;
}
/*~ If you want to expose types from your module as well, you can
*~ place them in this block.
*~
*~ Note that if you decide to include this namespace, the module can be
*~ incorrectly imported as a namespace object, unless
*~ --esModuleInterop is turned on:
*~   import * as x from '[~THE MODULE~]'; // WRONG! DO NOT DO THIS!
*/
declare namespace MyClass {
 export interface MyClassMethodOptions {
   width?: number;
   height?: number;
 }
}
On this page
Is this page helpful?
YesNo
Module: Function
For example, when you want to work with JavaScript code which looks like:
import greeter from "super-greeter";
greeter(2);
greeter("Hello world");
To handle both importing via UMD and modules:
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>
/*~ This is the module template file for function modules.
*~ You should rename it to index.d.ts and place it in a folder with the same name as the module.
*~ For example, if you were writing a file for "super-greeter", this
*~ file should be 'super-greeter/index.d.ts'
*/
// Note that ES6 modules cannot directly export class objects.
// This file should be imported using the CommonJS-style:
//   import x = require('[~THE MODULE~]');
//
// Alternatively, if --allowSyntheticDefaultImports or
// --esModuleInterop is turned on, this file can also be
// imported as a default import:
//   import x from '[~THE MODULE~]';
//
// Refer to the TypeScript documentation at
// https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
// to understand common workarounds for this limitation of ES6 modules.
/*~ If this module is a UMD module that exposes a global variable 'myFuncLib' when
*~ loaded outside a module loader environment, declare that global here.
*~ Otherwise, delete this declaration.
*/
export as namespace myFuncLib;
/*~ This declaration specifies that the function
*~ is the exported object from the file
*/
export = Greeter;
/*~ This example shows how to have multiple overloads for your function */
declare function Greeter(name: string): Greeter.NamedReturnType;
declare function Greeter(length: number): Greeter.LengthReturnType;
/*~ If you want to expose types from your module as well, you can
*~ place them in this block. Often you will want to describe the
*~ shape of the return type of the function; that type should
*~ be declared in here, as this example shows.
*~
*~ Note that if you decide to include this namespace, the module can be
*~ incorrectly imported as a namespace object, unless
*~ --esModuleInterop is turned on:
*~   import * as x from '[~THE MODULE~]'; // WRONG! DO NOT DO THIS!
*/
declare namespace Greeter {
 export interface LengthReturnType {
   width: number;
   height: number;
 }
 export interface NamedReturnType {
   firstName: string;
   lastName: string;
 }
 /*~ If the module also has properties, declare them here. For example,
  *~ this declaration says that this code is legal:
  *~   import f = require('super-greeter');
  *~   console.log(f.defaultName);
  */
 export const defaultName: string;
 export let defaultLength: number;
}
Global .d.ts
Global Libraries
A global library is one that can be accessed from the global scope (i.e. without using any form of import). Many libraries simply expose one or more global variables for use. For example, if you were using jQuery, the $ variable can be used by simply referring to it:
$(() => {
 console.log("hello!");
});
You’ll usually see guidance in the documentation of a global library of how to use the library in an HTML script tag:
<script src="http://a.great.cdn.for/someLib.js"></script>
Today, most popular globally-accessible libraries are actually written as UMD libraries (see below). UMD library documentation is hard to distinguish from global library documentation. Before writing a global declaration file, make sure the library isn’t actually UMD.
Identifying a Global Library from Code
Global library code is usually extremely simple. A global “Hello, world” library might look like this:
function createGreeting(s) {
 return "Hello, " + s;
}
or like this:
window.createGreeting = function (s) {
 return "Hello, " + s;
};
When looking at the code of a global library, you’ll usually see:
Top-level var statements or function declarations
One or more assignments to window.someName
Assumptions that DOM primitives like document or window exist
You won’t see:
Checks for, or usage of, module loaders like require or define
CommonJS/Node.js-style imports of the form var fs = require("fs");
Calls to define(...)
Documentation describing how to require or import the library
Examples of Global Libraries
Because it’s usually easy to turn a global library into a UMD library, very few popular libraries are still written in the global style. However, libraries that are small and require the DOM (or have no dependencies) may still be global.
Global Library Template
You can see an example DTS below:
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>
/*~ If this library is callable (e.g. can be invoked as myLib(3)),
*~ include those call signatures here.
*~ Otherwise, delete this section.
*/
declare function myLib(a: string): string;
declare function myLib(a: number): number;
/*~ If you want the name of this library to be a valid type name,
*~ you can do so here.
*~
*~ For example, this allows us to write 'var x: myLib';
*~ Be sure this actually makes sense! If it doesn't, just
*~ delete this declaration and add types inside the namespace below.
*/
interface myLib {
 name: string;
 length: number;
 extras?: string[];
}
/*~ If your library has properties exposed on a global variable,
*~ place them here.
*~ You should also place types (interfaces and type alias) here.
*/
declare namespace myLib {
 //~ We can write 'myLib.timeout = 50;'
 let timeout: number;
 //~ We can access 'myLib.version', but not change it
 const version: string;
 //~ There's some class we can create via 'let c = new myLib.Cat(42)'
 //~ Or reference e.g. 'function f(c: myLib.Cat) { ... }
 class Cat {
   constructor(n: number);
   //~ We can read 'c.age' from a 'Cat' instance
   readonly age: number;
   //~ We can invoke 'c.purr()' from a 'Cat' instance
   purr(): void;
 }
 //~ We can declare a variable as
 //~   'var s: myLib.CatSettings = { weight: 5, name: "Maru" };'
 interface CatSettings {
   weight: number;
   name: string;
   tailLength?: number;
 }
 //~ We can write 'const v: myLib.VetID = 42;'
 //~  or 'const v: myLib.VetID = "bob";'
 type VetID = string | number;
 //~ We can invoke 'myLib.checkCat(c)' or 'myLib.checkCat(c, v);'
 function checkCat(c: Cat, s?: VetID);
}
Global: Modifying Module
Global-modifying Modules
A global-modifying module alters existing values in the global scope when they are imported. For example, there might exist a library which adds new members to String.prototype when imported. This pattern is somewhat dangerous due to the possibility of runtime conflicts, but we can still write a declaration file for it.
Identifying global-modifying modules
Global-modifying modules are generally easy to identify from their documentation. In general, they’re similar to global plugins, but need a require call to activate their effects.
You might see documentation like this:
// 'require' call that doesn't use its return value
var unused = require("magic-string-time");
/* or */
require("magic-string-time");
var x = "hello, world";
// Creates new methods on built-in types
console.log(x.startsWithHello());
var y = [1, 2, 3];
// Creates new methods on built-in types
console.log(y.reverseAndSort());
Here is an example
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>
/*~ This is the global-modifying module template file. You should rename it to index.d.ts
*~ and place it in a folder with the same name as the module.
*~ For example, if you were writing a file for "super-greeter", this
*~ file should be 'super-greeter/index.d.ts'
*/
/*~ Note: If your global-modifying module is callable or constructable, you'll
*~ need to combine the patterns here with those in the module-class or module-function
*~ template files
*/
declare global {
 /*~ Here, declare things that go in the global namespace, or augment
  *~ existing declarations in the global namespace
  */
 interface String {
   fancyFormat(opts: StringFormatOptions): string;
 }
}
/*~ If your module exports types or values, write them as usual */
export interface StringFormatOptions {
 fancinessLevel: number;
}
/*~ For example, declaring a method on the module (in addition to its global side effects) */
export function doSomething(): void;
/*~ If your module exports nothing, you'll need this line. Otherwise, delete it */
export {};
On this page
Global-modifying Modules
Identifying global-modifying modules
Is this page helpful?
YesNo
Do's and Don'ts
General Types
Number, String, Boolean, Symbol and Object
❌ Don’t ever use the types Number, String, Boolean, Symbol, or Object These types refer to non-primitive boxed objects that are almost never used appropriately in JavaScript code.
/* WRONG */
function reverse(s: String): String;
✅ Do use the types number, string, boolean, and symbol.
/* OK */
function reverse(s: string): string;
Instead of Object, use the non-primitive object type (added in TypeScript 2.2).
Generics
❌ Don’t ever have a generic type which doesn’t use its type parameter. See more details in TypeScript FAQ page.
any
❌ Don’t use any as a type unless you are in the process of migrating a JavaScript project to TypeScript. The compiler effectively treats any as “please turn off type checking for this thing”. It is similar to putting an @ts-ignore comment around every usage of the variable. This can be very helpful when you are first migrating a JavaScript project to TypeScript as you can set the type for stuff you haven’t migrated yet as any, but in a full TypeScript project you are disabling type checking for any parts of your program that use it.
In cases where you don’t know what type you want to accept, or when you want to accept anything because you will be blindly passing it through without interacting with it, you can use unknown.
Callback Types
Return Types of Callbacks
❌ Don’t use the return type any for callbacks whose value will be ignored:
/* WRONG */
function fn(x: () => any) {
 x();
}
✅ Do use the return type void for callbacks whose value will be ignored:
/* OK */
function fn(x: () => void) {
 x();
}
❔ Why: Using void is safer because it prevents you from accidentally using the return value of x in an unchecked way:
function fn(x: () => void) {
 var k = x(); // oops! meant to do something else
 k.doSomething(); // error, but would be OK if the return type had been 'any'
}
Optional Parameters in Callbacks
❌ Don’t use optional parameters in callbacks unless you really mean it:
/* WRONG */
interface Fetcher {
 getObject(done: (data: unknown, elapsedTime?: number) => void): void;
}
This has a very specific meaning: the done callback might be invoked with 1 argument or might be invoked with 2 arguments. The author probably intended to say that the callback might not care about the elapsedTime parameter, but there’s no need to make the parameter optional to accomplish this — it’s always legal to provide a callback that accepts fewer arguments.
✅ Do write callback parameters as non-optional:
/* OK */
interface Fetcher {
 getObject(done: (data: unknown, elapsedTime: number) => void): void;
}
Overloads and Callbacks
❌ Don’t write separate overloads that differ only on callback arity:
/* WRONG */
declare function beforeAll(action: () => void, timeout?: number): void;
declare function beforeAll(
 action: (done: DoneFn) => void,
 timeout?: number
): void;
✅ Do write a single overload using the maximum arity:
/* OK */
declare function beforeAll(
 action: (done: DoneFn) => void,
 timeout?: number
): void;
❔ Why: It’s always legal for a callback to disregard a parameter, so there’s no need for the shorter overload. Providing a shorter callback first allows incorrectly-typed functions to be passed in because they match the first overload.
Function Overloads
Ordering
❌ Don’t put more general overloads before more specific overloads:
/* WRONG */
declare function fn(x: unknown): unknown;
declare function fn(x: HTMLElement): number;
declare function fn(x: HTMLDivElement): string;
var myElem: HTMLDivElement;
var x = fn(myElem); // x: unknown, wat?
✅ Do sort overloads by putting the more general signatures after more specific signatures:
/* OK */
declare function fn(x: HTMLDivElement): string;
declare function fn(x: HTMLElement): number;
declare function fn(x: unknown): unknown;
var myElem: HTMLDivElement;
var x = fn(myElem); // x: string, :)
❔ Why: TypeScript chooses the first matching overload when resolving function calls. When an earlier overload is “more general” than a later one, the later one is effectively hidden and cannot be called.
Use Optional Parameters
❌ Don’t write several overloads that differ only in trailing parameters:
/* WRONG */
interface Example {
 diff(one: string): number;
 diff(one: string, two: string): number;
 diff(one: string, two: string, three: boolean): number;
}
✅ Do use optional parameters whenever possible:
/* OK */
interface Example {
 diff(one: string, two?: string, three?: boolean): number;
}
Note that this collapsing should only occur when all overloads have the same return type.
❔ Why: This is important for two reasons.
TypeScript resolves signature compatibility by seeing if any signature of the target can be invoked with the arguments of the source, and extraneous arguments are allowed. This code, for example, exposes a bug only when the signature is correctly written using optional parameters:
function fn(x: (a: string, b: number, c: number) => void) {}
var x: Example;
// When written with overloads, OK -- used first overload
// When written with optionals, correctly an error
fn(x.diff);
The second reason is when a consumer uses the “strict null checking” feature of TypeScript. Because unspecified parameters appear as undefined in JavaScript, it’s usually fine to pass an explicit undefined to a function with optional arguments. This code, for example, should be OK under strict nulls:
var x: Example;
// When written with overloads, incorrectly an error because of passing 'undefined' to 'string'
// When written with optionals, correctly OK
x.diff("something", true ? undefined : "hour");
Use Union Types
❌ Don’t write overloads that differ by type in only one argument position:
/* WRONG */
interface Moment {
 utcOffset(): number;
 utcOffset(b: number): Moment;
 utcOffset(b: string): Moment;
}
✅ Do use union types whenever possible:
/* OK */
interface Moment {
 utcOffset(): number;
 utcOffset(b: number | string): Moment;
}
Note that we didn’t make b optional here because the return types of the signatures differ.
❔ Why: This is important for people who are “passing through” a value to your function:
function fn(x: string): Moment;
function fn(x: number): Moment;
function fn(x: number | string) {
 // When written with separate overloads, incorrectly an error
 // When written with union types, correctly OK
 return moment().utcOffset(x);
}
On this page
General Types
Number, String, Boolean, Symbol and Object
Generics
any
Callback Types
Return Types of Callbacks
Optional Parameters in Callbacks
Overloads and Callbacks
Function Overloads
Ordering
Use Optional Parameters
Use Union Types
Is this page helpful?
YesNo
Deep Dive
Declaration File Theory: A Deep Dive
Structuring modules to give the exact API shape you want can be tricky. For example, we might want a module that can be invoked with or without new to produce different types, has a variety of named types exposed in a hierarchy, and has some properties on the module object as well.
By reading this guide, you’ll have the tools to write complex declaration files that expose a friendly API surface. This guide focuses on module (or UMD) libraries because the options here are more varied.
Key Concepts
You can fully understand how to make any shape of declaration by understanding some key concepts of how TypeScript works.
Types
If you’re reading this guide, you probably already roughly know what a type in TypeScript is. To be more explicit, though, a type is introduced with:
A type alias declaration (type sn = number | string;)
An interface declaration (interface I { x: number[]; })
A class declaration (class C { })
An enum declaration (enum E { A, B, C })
An import declaration which refers to a type
Each of these declaration forms creates a new type name.
Values
As with types, you probably already understand what a value is. Values are runtime names that we can reference in expressions. For example let x = 5; creates a value called x.
Again, being explicit, the following things create values:
let, const, and var declarations
A namespace or module declaration which contains a value
An enum declaration
A class declaration
An import declaration which refers to a value
A function declaration
Namespaces
Types can exist in namespaces. For example, if we have the declaration let x: A.B.C, we say that the type C comes from the A.B namespace.
This distinction is subtle and important — here, A.B is not necessarily a type or a value.
Simple Combinations: One name, multiple meanings
Given a name A, we might find up to three different meanings for A: a type, a value or a namespace. How the name is interpreted depends on the context in which it is used. For example, in the declaration let m: A.A = A;, A is used first as a namespace, then as a type name, then as a value. These meanings might end up referring to entirely different declarations!
This may seem confusing, but it’s actually very convenient as long as we don’t excessively overload things. Let’s look at some useful aspects of this combining behavior.
Built-in Combinations
Astute readers will notice that, for example, class appeared in both the type and value lists. The declaration class C { } creates two things: a type C which refers to the instance shape of the class, and a value C which refers to the constructor function of the class. Enum declarations behave similarly.
User Combinations
Let’s say we wrote a module file foo.d.ts:
export var SomeVar: { a: SomeType };
export interface SomeType {
 count: number;
}
Then consumed it:
import * as foo from "./foo";
let x: foo.SomeType = foo.SomeVar.a;
console.log(x.count);
This works well enough, but we might imagine that SomeType and SomeVar were very closely related such that you’d like them to have the same name. We can use combining to present these two different objects (the value and the type) under the same name Bar:
export var Bar: { a: Bar };
export interface Bar {
 count: number;
}
This presents a very good opportunity for destructuring in the consuming code:
import { Bar } from "./foo";
let x: Bar = Bar.a;
console.log(x.count);
Again, we’ve used Bar as both a type and a value here. Note that we didn’t have to declare the Bar value as being of the Bar type — they’re independent.
Advanced Combinations
Some kinds of declarations can be combined across multiple declarations. For example, class C { } and interface C { } can co-exist and both contribute properties to the C types.
This is legal as long as it does not create a conflict. A general rule of thumb is that values always conflict with other values of the same name unless they are declared as namespaces, types will conflict if they are declared with a type alias declaration (type s = string), and namespaces never conflict.
Let’s see how this can be used.
Adding using an interface
We can add additional members to an interface with another interface declaration:
interface Foo {
 x: number;
}
// ... elsewhere ...
interface Foo {
 y: number;
}
let a: Foo = ...;
console.log(a.x + a.y); // OK
This also works with classes:
class Foo {
 x: number;
}
// ... elsewhere ...
interface Foo {
 y: number;
}
let a: Foo = ...;
console.log(a.x + a.y); // OK
Note that we cannot add to type aliases (type s = string;) using an interface.
Adding using a namespace
A namespace declaration can be used to add new types, values, and namespaces in any way which does not create a conflict.
For example, we can add a static member to a class:
class C {}
// ... elsewhere ...
namespace C {
 export let x: number;
}
let y = C.x; // OK
Note that in this example, we added a value to the static side of C (its constructor function). This is because we added a value, and the container for all values is another value (types are contained by namespaces, and namespaces are contained by other namespaces).
We could also add a namespaced type to a class:
class C {}
// ... elsewhere ...
namespace C {
 export interface D {}
}
let y: C.D; // OK
In this example, there wasn’t a namespace C until we wrote the namespace declaration for it. The meaning C as a namespace doesn’t conflict with the value or type meanings of C created by the class.
Finally, we could perform many different merges using namespace declarations. This isn’t a particularly realistic example, but shows all sorts of interesting behavior:
namespace X {
 export interface Y {}
 export class Z {}
}
// ... elsewhere ...
namespace X {
 export var Y: number;
 export namespace Z {
   export class C {}
 }
}
type X = string;
In this example, the first block creates the following name meanings:
A value X (because the namespace declaration contains a value, Z)
A namespace X (because the namespace declaration contains a type, Y)
A type Y in the X namespace
A type Z in the X namespace (the instance shape of the class)
A value Z that is a property of the X value (the constructor function of the class)
The second block creates the following name meanings:
A value Y (of type number) that is a property of the X value
A namespace Z
A value Z that is a property of the X value
A type C in the X.Z namespace
A value C that is a property of the X.Z value
A type X
Publishing
Now that you have authored a declaration file following the steps of this guide, it is time to publish it to npm. There are two main ways you can publish your declaration files to npm:
bundling with your npm package
publishing to the @types organization on npm.
If your types are generated by your source code, publish the types with your source code. Both TypeScript and JavaScript projects can generate types via declaration.
Otherwise, we recommend submitting the types to DefinitelyTyped, which will publish them to the @types organization on npm.
Including declarations in your npm package
If your package has a main .js file, you will need to indicate the main declaration file in your package.json file as well. Set the types property to point to your bundled declaration file. For example:
{
 "name": "awesome",
 "author": "Vandelay Industries",
 "version": "1.0.0",
 "main": "./lib/main.js",
 "types": "./lib/main.d.ts"
}
Note that the "typings" field is synonymous with types, and could be used as well.
Dependencies
All dependencies are managed by npm. Make sure all the declaration packages you depend on are marked appropriately in the "dependencies" section in your package.json. For example, imagine we authored a package that used Browserify and TypeScript.
{
 "name": "browserify-typescript-extension",
 "author": "Vandelay Industries",
 "version": "1.0.0",
 "main": "./lib/main.js",
 "types": "./lib/main.d.ts",
 "dependencies": {
   "browserify": "latest",
   "@types/browserify": "latest",
   "typescript": "next"
 }
}
Here, our package depends on the browserify and typescript packages. browserify does not bundle its declaration files with its npm packages, so we needed to depend on @types/browserify for its declarations. typescript, on the other hand, packages its declaration files, so there was no need for any additional dependencies.
Our package exposes declarations from each of those, so any user of our browserify-typescript-extension package needs to have these dependencies as well. For that reason, we used "dependencies" and not "devDependencies", because otherwise our consumers would have needed to manually install those packages. If we had just written a command line application and not expected our package to be used as a library, we might have used devDependencies.
Red flags
/// <reference path="..." />
Don’t use /// <reference path="..." /> in your declaration files.
/// <reference path="../typescript/lib/typescriptServices.d.ts" />
....
Do use /// <reference types="..." /> instead.
/// <reference types="typescript" />
....
Make sure to revisit the Consuming dependencies section for more information.
Packaging dependent declarations
If your type definitions depend on another package:
Don’t combine it with yours, keep each in their own file.
Don’t copy the declarations in your package either.
Do depend on the npm type declaration package if it doesn’t package its declaration files.
Version selection with typesVersions
When TypeScript opens a package.json file to figure out which files it needs to read, it first looks at a field called typesVersions.
Folder redirects (using *)
A package.json with a typesVersions field might look like this:
{
 "name": "package-name",
 "version": "1.0.0",
 "types": "./index.d.ts",
 "typesVersions": {
   ">=3.1": { "*": ["ts3.1/*"] }
 }
}
This package.json tells TypeScript to first check the current version of TypeScript. If it’s 3.1 or later, TypeScript figures out the path you’ve imported relative to the package, and reads from the package’s ts3.1 folder.
That’s what that { "*": ["ts3.1/*"] } means - if you’re familiar with path mapping, it works exactly like that.
In the above example, if we’re importing from "package-name", TypeScript will try to resolve from [...]/node_modules/package-name/ts3.1/index.d.ts (and other relevant paths) when running in TypeScript 3.1. If we import from package-name/foo, we’ll try to look for [...]/node_modules/package-name/ts3.1/foo.d.ts and [...]/node_modules/package-name/ts3.1/foo/index.d.ts.
What if we’re not running in TypeScript 3.1 in this example? Well, if none of the fields in typesVersions get matched, TypeScript falls back to the types field, so here TypeScript 3.0 and earlier will be redirected to [...]/node_modules/package-name/index.d.ts.
File redirects
When you want to only change the resolution for a single file at a time, you can tell TypeScript the file to resolve differently by passing in the exact filenames:
{
 "name": "package-name",
 "version": "1.0.0",
 "types": "./index.d.ts",
 "typesVersions": {
   "<4.0": { "index.d.ts": ["index.v3.d.ts"] }
 }
}
On TypeScript 4.0 and above, an import for "package-name" would resolve to ./index.d.ts and for 3.9 and below "./index.v3.d.ts.
Note that redirections only affect the external API of a package; import resolution within a project is not affected by typesVersions. For example, a d.ts file in the previous example containing import * as foo from "./index" will still map to index.d.ts, not index.v3.d.ts, whereas another package importing import * as foo from "package-name" will get index.v3.d.ts.
Matching behavior
The way that TypeScript decides on whether a version of the compiler & language matches is by using Node’s semver ranges.
Multiple fields
typesVersions can support multiple fields where each field name is specified by the range to match on.
{
 "name": "package-name",
 "version": "1.0",
 "types": "./index.d.ts",
 "typesVersions": {
   ">=3.2": { "*": ["ts3.2/*"] },
   ">=3.1": { "*": ["ts3.1/*"] }
 }
}
Since ranges have the potential to overlap, determining which redirect applies is order-specific. That means in the above example, even though both the >=3.2 and the >=3.1 matchers support TypeScript 3.2 and above, reversing the order could have different behavior, so the above sample would not be equivalent to the following.
{
 "name": "package-name",
 "version": "1.0",
 "types": "./index.d.ts",
 "typesVersions": {
   // NOTE: this doesn't work!
   ">=3.1": { "*": ["ts3.1/*"] },
   ">=3.2": { "*": ["ts3.2/*"] }
 }
}
Publish to @types
Packages under the @types organization are published automatically from DefinitelyTyped using the types-publisher tool. To get your declarations published as an @types package, please submit a pull request to DefinitelyTyped. You can find more details in the contribution guidelines page.
Consumption
Downloading
Getting type declarations requires no tools apart from npm.
As an example, getting the declarations for a library like lodash takes nothing more than the following command
npm install --save-dev @types/lodash
It is worth noting that if the npm package already includes its declaration file as described in Publishing, downloading the corresponding @types package is not needed.
Consuming
From there you’ll be able to use lodash in your TypeScript code with no fuss. This works for both modules and global code.
For example, once you’ve npm install-ed your type declarations, you can use imports and write
import * as _ from "lodash";
_.padStart("Hello TypeScript!", 20, " ");
or if you’re not using modules, you can just use the global variable _.
_.padStart("Hello TypeScript!", 20, " ");
Searching
For the most part, type declaration packages should always have the same name as the package name on npm, but prefixed with @types/, but if you need, you can use the Yarn package search to find the package for your favorite library.
Note: if the declaration file you are searching for is not present, you can always contribute one back and help out the next developer looking for it. Please see the DefinitelyTyped contribution guidelines page for details.
On this page
Downloading
Consuming
Searching
Is this page helpful?
YesNo
Previous
Publishing
How to get your d.ts files to users
JS Projects Utilizing TypeScript
The type system in TypeScript has different levels of strictness when working with a codebase:
A type-system based only on inference with JavaScript code
Incremental typing in JavaScript via JSDoc
Using // @ts-check in a JavaScript file
TypeScript code
TypeScript with strict enabled
Each step represents a move towards a safer type-system, but not every project needs that level of verification.
TypeScript with JavaScript
This is when you use an editor which uses TypeScript to provide tooling like auto-complete, jump to symbol and refactoring tools like rename. The homepage has a list of editors which have TypeScript plugins.
Providing Type Hints in JS via JSDoc
In a .js file, types can often be inferred. When types can’t be inferred, they can be specified using JSDoc syntax.
JSDoc annotations that come before a declaration will be used to set the type of that declaration. For example:
/** @type {number} */
var x;
 
x = 0; // OK
x = false; // OK?!
Try
You can find the full list of supported JSDoc patterns in JSDoc Supported Types.
@ts-check
The last line of the previous code sample would raise an error in TypeScript, but it doesn’t by default in a JS project. To enable errors in your JavaScript files add: // @ts-check to the first line in your .js files to have TypeScript raise it as an error.
// @ts-check
/** @type {number} */
var x;
 
x = 0; // OK
x = false; // Not OK
Type 'boolean' is not assignable to type 'number'.
Try
If you have a lot of JavaScript files you want to add errors to then you can switch to using a jsconfig.json. You can skip checking some files by adding a // @ts-nocheck comment to files.
TypeScript may offer you errors which you disagree with, in those cases you can ignore errors on specific lines by adding // @ts-ignore or // @ts-expect-error on the preceding line.
// @ts-check
/** @type {number} */
var x;
 
x = 0; // OK
// @ts-expect-error
x = false; // Not OK
Try
To learn more about how JavaScript is interpreted by TypeScript read How TS Type Checks JS
Type Checking JavaScript Files
Here are some notable differences on how checking works in .js files compared to .ts files.
Properties are inferred from assignments in class bodies
ES2015 does not have a means for declaring properties on classes. Properties are dynamically assigned, just like object literals.
In a .js file, the compiler infers properties from property assignments inside the class body. The type of a property is the type given in the constructor, unless it’s not defined there, or the type in the constructor is undefined or null. In that case, the type is the union of the types of all the right-hand values in these assignments. Properties defined in the constructor are always assumed to exist, whereas ones defined just in methods, getters, or setters are considered optional.
class C {
 constructor() {
   this.constructorOnly = 0;
   this.constructorUnknown = undefined;
 }
 method() {
   this.constructorOnly = false;
Type 'boolean' is not assignable to type 'number'.
   this.constructorUnknown = "plunkbat"; // ok, constructorUnknown is string | undefined
   this.methodOnly = "ok"; // ok, but methodOnly could also be undefined
 }
 method2() {
   this.methodOnly = true; // also, ok, methodOnly's type is string | boolean | undefined
 }
}
Try
If properties are never set in the class body, they are considered unknown. If your class has properties that are only read from, add and then annotate a declaration in the constructor with JSDoc to specify the type. You don’t even have to give a value if it will be initialized later:
class C {
 constructor() {
   /** @type {number | undefined} */
   this.prop = undefined;
   /** @type {number | undefined} */
   this.count;
 }
}
 
let c = new C();
c.prop = 0; // OK
c.count = "string";
Type 'string' is not assignable to type 'number'.
Try
Constructor functions are equivalent to classes
Before ES2015, JavaScript used constructor functions instead of classes. The compiler supports this pattern and understands constructor functions as equivalent to ES2015 classes. The property inference rules described above work exactly the same way.
function C() {
 this.constructorOnly = 0;
 this.constructorUnknown = undefined;
}
C.prototype.method = function () {
 this.constructorOnly = false;
Type 'boolean' is not assignable to type 'number'.
 this.constructorUnknown = "plunkbat"; // OK, the type is string | undefined
};
Try
CommonJS modules are supported
In a .js file, TypeScript understands the CommonJS module format. Assignments to exports and module.exports are recognized as export declarations. Similarly, require function calls are recognized as module imports. For example:
// same as `import module "fs"`
const fs = require("fs");
// same as `export function readFile`
module.exports.readFile = function (f) {
 return fs.readFileSync(f);
};
The module support in JavaScript is much more syntactically forgiving than TypeScript’s module support. Most combinations of assignments and declarations are supported.
Classes, functions, and object literals are namespaces
Classes are namespaces in .js files. This can be used to nest classes, for example:
class C {}
C.D = class {};
Try
And, for pre-ES2015 code, it can be used to simulate static methods:
function Outer() {
 this.y = 2;
}
 
Outer.Inner = function () {
 this.yy = 2;
};
 
Outer.Inner();
Try
It can also be used to create simple namespaces:
var ns = {};
ns.C = class {};
ns.func = function () {};
 
ns;
Try
Other variants are allowed as well:
// IIFE
var ns = (function (n) {
 return n || {};
})();
ns.CONST = 1;
 
// defaulting to global
var assign =
 assign ||
 function () {
   // code goes here
 };
assign.extra = 1;
Try
Object literals are open-ended
In a .ts file, an object literal that initializes a variable declaration gives its type to the declaration. No new members can be added that were not specified in the original literal. This rule is relaxed in a .js file; object literals have an open-ended type (an index signature) that allows adding and looking up properties that were not defined originally. For instance:
var obj = { a: 1 };
obj.b = 2; // Allowed
Try
Object literals behave as if they have an index signature [x:string]: any that allows them to be treated as open maps instead of closed objects.
Like other special JS checking behaviors, this behavior can be changed by specifying a JSDoc type for the variable. For example:
/** @type {{a: number}} */
var obj = { a: 1 };
obj.b = 2;
Property 'b' does not exist on type '{ a: number; }'.
Try
null, undefined, and empty array initializers are of type any or any[]
Any variable, parameter or property that is initialized with null or undefined will have type any, even if strict null checks is turned on. Any variable, parameter or property that is initialized with [] will have type any[], even if strict null checks is turned on. The only exception is for properties that have multiple initializers as described above.
function Foo(i = null) {
 if (!i) i = 1;
 var j = undefined;
 j = 2;
 this.l = [];
}
 
var foo = new Foo();
foo.l.push(foo.i);
foo.l.push("end");
Try
Function parameters are optional by default
Since there is no way to specify optionality on parameters in pre-ES2015 JavaScript, all function parameters in .js file are considered optional. Calls with fewer arguments than the declared number of parameters are allowed.
It is important to note that it is an error to call a function with too many arguments.
For instance:
function bar(a, b) {
 console.log(a + " " + b);
}
 
bar(1); // OK, second argument considered optional
bar(1, 2);
bar(1, 2, 3); // Error, too many arguments
Expected 0-2 arguments, but got 3.
Try
JSDoc annotated functions are excluded from this rule. Use JSDoc optional parameter syntax ([ ]) to express optionality. e.g.:
/**
* @param {string} [somebody] - Somebody's name.
*/
function sayHello(somebody) {
 if (!somebody) {
   somebody = "John Doe";
 }
 console.log("Hello " + somebody);
}
 
sayHello();
Try
Var-args parameter declaration inferred from use of arguments
A function whose body has a reference to the arguments reference is implicitly considered to have a var-arg parameter (i.e. (...arg: any[]) => any). Use JSDoc var-arg syntax to specify the type of the arguments.
/** @param {...number} args */
function sum(/* numbers */) {
 var total = 0;
 for (var i = 0; i < arguments.length; i++) {
   total += arguments[i];
 }
 return total;
}
Try
Unspecified type parameters default to any
Since there is no natural syntax for specifying generic type parameters in JavaScript, an unspecified type parameter defaults to any.
In extends clause
For instance, React.Component is defined to have two type parameters, Props and State. In a .js file, there is no legal way to specify these in the extends clause. By default the type arguments will be any:
import { Component } from "react";
class MyComponent extends Component {
 render() {
   this.props.b; // Allowed, since this.props is of type any
 }
}
Use JSDoc @augments to specify the types explicitly. for instance:
import { Component } from "react";
/**
* @augments {Component<{a: number}, State>}
*/
class MyComponent extends Component {
 render() {
   this.props.b; // Error: b does not exist on {a:number}
 }
}
In JSDoc references
An unspecified type argument in JSDoc defaults to any:
/** @type{Array} */
var x = [];
 
x.push(1); // OK
x.push("string"); // OK, x is of type Array<any>
 
/** @type{Array.<number>} */
var y = [];
 
y.push(1); // OK
y.push("string"); // Error, string is not assignable to number
Try
In function calls
A call to a generic function uses the arguments to infer the type parameters. Sometimes this process fails to infer any types, mainly because of lack of inference sources; in these cases, the type parameters will default to any. For example:
var p = new Promise((resolve, reject) => {
 reject();
});
p; // Promise<any>;
To learn all of the features available in JSDoc, see the reference.
​​JSDoc Reference
The list below outlines which constructs are currently supported when using JSDoc annotations to provide type information in JavaScript files.
Note:
Any tags which are not explicitly listed below (such as @async) are not yet supported.
Only documentation tags are supported in TypeScript files. The rest of the tags are only supported in JavaScript files.
Types
@type
@import
@param (or @arg or @argument)
@returns (or @return)
@typedef
@callback
@template
@satisfies
Classes
Property Modifiers @public, @private, @protected, @readonly
@override
@extends (or @augments)
@implements
@class (or @constructor)
@this
Documentation
Documentation tags work in both TypeScript and JavaScript.
@deprecated
@see
@link
Other
@enum
@author
Other supported patterns
Unsupported patterns
Unsupported tags
The meaning is usually the same, or a superset, of the meaning of the tag given at jsdoc.app. The code below describes the differences and gives some example usage of each tag.
Note: You can use the playground to explore JSDoc support.
Types
@type
You can reference types with the “@type” tag. The type can be:
Primitive, like string or number.
Declared in a TypeScript declaration, either global or imported.
Declared in a JSDoc @typedef tag.
You can use most JSDoc type syntax and any TypeScript syntax, from the most basic like string to the most advanced, like conditional types.
/**
* @type {string}
*/
var s;
 
/** @type {Window} */
var win;
 
/** @type {PromiseLike<string>} */
var promisedString;
 
// You can specify an HTML Element with DOM properties
/** @type {HTMLElement} */
var myElement = document.querySelector(selector);
element.dataset.myData = "";
Try
@type can specify a union type — for example, something can be either a string or a boolean.
/**
* @type {string | boolean}
*/
var sb;
Try
You can specify array types using a variety of syntaxes:
/** @type {number[]} */
var ns;
/** @type {Array.<number>} */
var jsdoc;
/** @type {Array<number>} */
var nas;
Try
You can also specify object literal types. For example, an object with properties ‘a’ (string) and ‘b’ (number) uses the following syntax:
/** @type {{ a: string, b: number }} */
var var9;
Try
You can specify map-like and array-like objects using string and number index signatures, using either standard JSDoc syntax or TypeScript syntax.
/**
* A map-like object that maps arbitrary `string` properties to `number`s.
*
* @type {Object.<string, number>}
*/
var stringToNumber;
 
/** @type {Object.<number, object>} */
var arrayLike;
Try
The preceding two types are equivalent to the TypeScript types { [x: string]: number } and { [x: number]: any }. The compiler understands both syntaxes.
You can specify function types using either TypeScript or Google Closure syntax:
/** @type {function(string, boolean): number} Closure syntax */
var sbn;
/** @type {(s: string, b: boolean) => number} TypeScript syntax */
var sbn2;
Try
Or you can just use the unspecified Function type:
/** @type {Function} */
var fn7;
/** @type {function} */
var fn6;
Try
Other types from Closure also work:
/**
* @type {*} - can be 'any' type
*/
var star;
/**
* @type {?} - unknown type (same as 'any')
*/
var question;
Try
Casts
TypeScript borrows cast syntax from Google Closure. This lets you cast types to other types by adding a @type tag before any parenthesized expression.
/**
* @type {number | string}
*/
var numberOrString = Math.random() < 0.5 ? "hello" : 100;
var typeAssertedNumber = /** @type {number} */ (numberOrString);
Try
You can even cast to const just like TypeScript:
let one = /** @type {const} */(1);
Try
Import types
You can import declarations from other files using import types. This syntax is TypeScript-specific and differs from the JSDoc standard:
// @filename: types.d.ts
export type Pet = {
 name: string,
};
 
// @filename: main.js
/**
* @param {import("./types").Pet} p
*/
function walk(p) {
 console.log(`Walking ${p.name}...`);
}
Try
import types can be used to get the type of a value from a module if you don’t know the type, or if it has a large type that is annoying to type:
/**
* @type {typeof import("./accounts").userAccount}
*/
var x = require("./accounts").userAccount;
Try
@import
The @import tag can let us reference exports from other files.
/**
* @import {Pet} from "./types"
*/
 
/**
* @type {Pet}
*/
var myPet;
myPet.name;
Try
These tags don’t actually import files at runtime, and the symbols they bring into scope can only be used within JSDoc comments for type-checking.
// @filename: dog.js
export class Dog {
 woof() {
   console.log("Woof!");
 }
}
 
// @filename: main.js
/** @import { Dog } from "./dog.js" */
 
const d = new Dog(); // error!
Try
@param and @returns
@param uses the same type syntax as @type, but adds a parameter name. The parameter may also be declared optional by surrounding the name with square brackets:
// Parameters may be declared in a variety of syntactic forms
/**
* @param {string}  p1 - A string param.
* @param {string=} p2 - An optional param (Google Closure syntax)
* @param {string} [p3] - Another optional param (JSDoc syntax).
* @param {string} [p4="test"] - An optional param with a default value
* @returns {string} This is the result
*/
function stringsStringStrings(p1, p2, p3, p4) {
 // TODO
}
Try
Likewise, for the return type of a function:
/**
* @return {PromiseLike<string>}
*/
function ps() {}
 
/**
* @returns {{ a: string, b: number }} - May use '@returns' as well as '@return'
*/
function ab() {}
Try
@typedef, @callback, and @param
You can define complex types with @typedef. Similar syntax works with @param.
/**
* @typedef {Object} SpecialType - creates a new type named 'SpecialType'
* @property {string} prop1 - a string property of SpecialType
* @property {number} prop2 - a number property of SpecialType
* @property {number=} prop3 - an optional number property of SpecialType
* @prop {number} [prop4] - an optional number property of SpecialType
* @prop {number} [prop5=42] - an optional number property of SpecialType with default
*/
 
/** @type {SpecialType} */
var specialTypeObject;
specialTypeObject.prop3;
Try
You can use either object or Object on the first line.
/**
* @typedef {object} SpecialType1 - creates a new type named 'SpecialType1'
* @property {string} prop1 - a string property of SpecialType1
* @property {number} prop2 - a number property of SpecialType1
* @property {number=} prop3 - an optional number property of SpecialType1
*/
 
/** @type {SpecialType1} */
var specialTypeObject1;
Try
@param allows a similar syntax for one-off type specifications. Note that the nested property names must be prefixed with the name of the parameter:
/**
* @param {Object} options - The shape is the same as SpecialType above
* @param {string} options.prop1
* @param {number} options.prop2
* @param {number=} options.prop3
* @param {number} [options.prop4]
* @param {number} [options.prop5=42]
*/
function special(options) {
 return (options.prop4 || 1001) + options.prop5;
}
Try
@callback is similar to @typedef, but it specifies a function type instead of an object type:
/**
* @callback Predicate
* @param {string} data
* @param {number} [index]
* @returns {boolean}
*/
 
/** @type {Predicate} */
const ok = (s) => !(s.length % 2);
Try
Of course, any of these types can be declared using TypeScript syntax in a single-line @typedef:
/** @typedef {{ prop1: string, prop2: string, prop3?: number }} SpecialType */
/** @typedef {(data: string, index?: number) => boolean} Predicate */
@template
You can declare type parameters with the @template tag. This lets you make functions, classes, or types that are generic:
/**
* @template T
* @param {T} x - A generic parameter that flows through to the return type
* @returns {T}
*/
function id(x) {
 return x;
}
 
const a = id("string");
const b = id(123);
const c = id({});
Try
Use comma or multiple tags to declare multiple type parameters:
/**
* @template T,U,V
* @template W,X
*/
You can also specify a type constraint before the type parameter name. Only the first type parameter in a list is constrained:
/**
* @template {string} K - K must be a string or string literal
* @template {{ serious(): string }} Seriousalizable - must have a serious method
* @param {K} key
* @param {Seriousalizable} object
*/
function seriousalize(key, object) {
 // ????
}
Try
Finally, you can specify a default for a type parameter:
/** @template [T=object] */
class Cache {
   /** @param {T} initial */
   constructor(initial) {
   }
}
let c = new Cache()
Try
@satisfies
@satisfies provides access to the postfix operator satisfies in TypeScript. Satisfies is used to declare that a value implements a type but does not affect the type of the value.
// @ts-check
/**
* @typedef {"hello world" | "Hello, world"} WelcomeMessage
*/
 
/** @satisfies {WelcomeMessage} */
const message = "hello world"
      
const message: "hello world"
 
/** @satisfies {WelcomeMessage} */
Type '"Hello world!"' does not satisfy the expected type 'WelcomeMessage'.
const failingMessage = "Hello world!"
 
/** @type {WelcomeMessage} */
const messageUsingType = "hello world"
           
const messageUsingType: WelcomeMessage
Try
Classes
Classes can be declared as ES6 classes.
class C {
 /**
  * @param {number} data
  */
 constructor(data) {
   // property types can be inferred
   this.name = "foo";
 
   // or set explicitly
   /** @type {string | null} */
   this.title = null;
 
   // or simply annotated, if they're set elsewhere
   /** @type {number} */
   this.size;
 
   this.initialize(data); // Should error, initializer expects a string
 }
 /**
  * @param {string} s
  */
 initialize = function (s) {
   this.size = s.length;
 };
}
 
var c = new C(0);
 
// C should only be called with new, but
// because it is JavaScript, this is allowed and
// considered an 'any'.
var result = C(1);
Try
They can also be declared as constructor functions; use @constructor along with @this for this.
Property Modifiers
@public, @private, and @protected work exactly like public, private, and protected in TypeScript:
// @ts-check
 
class Car {
 constructor() {
   /** @private */
   this.identifier = 100;
 }
 
 printIdentifier() {
   console.log(this.identifier);
 }
}
 
const c = new Car();
console.log(c.identifier);
Property 'identifier' is private and only accessible within class 'Car'.
Try
@public is always implied and can be left off, but means that a property can be reached from anywhere.
@private means that a property can only be used within the containing class.
@protected means that a property can only be used within the containing class, and all derived subclasses, but not on dissimilar instances of the containing class.
@public, @private, and @protected do not work in constructor functions.
@readonly
The @readonly modifier ensures that a property is only ever written to during initialization.
// @ts-check
 
class Car {
 constructor() {
   /** @readonly */
   this.identifier = 100;
 }
 
 printIdentifier() {
   console.log(this.identifier);
 }
}
 
const c = new Car();
console.log(c.identifier);
Try
@override
@override works the same way as in TypeScript; use it on methods that override a method from a base class:
export class C {
 m() { }
}
class D extends C {
 /** @override */
 m() { }
}
Try
Set noImplicitOverride: true in tsconfig to check overrides.
@extends
When JavaScript classes extend a generic base class, there is no JavaScript syntax for passing a type argument. The @extends tag allows this:
/**
* @template T
* @extends {Set<T>}
*/
class SortableSet extends Set {
 // ...
}
Try
Note that @extends only works with classes. Currently, there is no way for a constructor function to extend a class.
@implements
In the same way, there is no JavaScript syntax for implementing a TypeScript interface. The @implements tag works just like in TypeScript:
/** @implements {Print} */
class TextBook {
 print() {
   // TODO
 }
}
Try
@constructor
The compiler infers constructor functions based on this-property assignments, but you can make checking stricter and suggestions better if you add a @constructor tag:
/**
* @constructor
* @param {number} data
*/
function C(data) {
 // property types can be inferred
 this.name = "foo";
 
 // or set explicitly
 /** @type {string | null} */
 this.title = null;
 
 // or simply annotated, if they're set elsewhere
 /** @type {number} */
 this.size;
 
 this.initialize(data);
Argument of type 'number' is not assignable to parameter of type 'string'.
}
/**
* @param {string} s
*/
C.prototype.initialize = function (s) {
 this.size = s.length;
};
 
var c = new C(0);
c.size;
 
var result = C(1);
Value of type 'typeof C' is not callable. Did you mean to include 'new'?
Try
Note: Error messages only show up in JS codebases with a JSConfig and checkJs enabled.
With @constructor, this is checked inside the constructor function C, so you will get suggestions for the initialize method and an error if you pass it a number. Your editor may also show warnings if you call C instead of constructing it.
Unfortunately, this means that constructor functions that are also callable cannot use @constructor.
@this
The compiler can usually figure out the type of this when it has some context to work with. When it doesn’t, you can explicitly specify the type of this with @this:
/**
* @this {HTMLElement}
* @param {*} e
*/
function callbackForLater(e) {
 this.clientHeight = parseInt(e); // should be fine!
}
Try
Documentation
@deprecated
When a function, method, or property is deprecated you can let users know by marking it with a /** @deprecated */ JSDoc comment. That information is surfaced in completion lists and as a suggestion diagnostic that editors can handle specially. In an editor like VS Code, deprecated values are typically displayed in a strike-through style like this.
/** @deprecated */
const apiV1 = {};
const apiV2 = {};
 
apiV;
   
apiV1
apiV2
 
 
Try
@see
@see lets you link to other names in your program:
type Box<T> = { t: T }
/** @see Box for implementation details */
type Boxify<T> = { [K in keyof T]: Box<T> };
Try
Some editors will turn Box into a link to make it easy to jump there and back.
@link
@link is like @see, except that it can be used inside other tags:
type Box<T> = { t: T }
/** @returns A {@link Box} containing the parameter. */
function box<U>(u: U): Box<U> {
 return { t: u };
}
Try
You can also link a property:
type Pet = {
 name: string
 hello: () => string
}
 
/**
* Note: you should implement the {@link Pet.hello} method of Pet.
*/
function hello(p: Pet) {
 p.hello()
}
Try
Or with an optional name:
type Pet = {
 name: string
 hello: () => string
}
 
/**
* Note: you should implement the {@link Pet.hello | hello} method of Pet.
*/
function hello(p: Pet) {
 p.hello()
}
Try
Other
@enum
The @enum tag allows you to create an object literal whose members are all of a specified type. Unlike most object literals in JavaScript, it does not allow other members. @enum is intended for compatibility with Google Closure’s @enum tag.
/** @enum {number} */
const JSDocState = {
 BeginningOfLine: 0,
 SawAsterisk: 1,
 SavingComments: 2,
};
 
JSDocState.SawAsterisk;
Try
Note that @enum is quite different from, and much simpler than, TypeScript’s enum. However, unlike TypeScript’s enums, @enum can have any type:
/** @enum {function(number): number} */
const MathFuncs = {
 add1: (n) => n + 1,
 id: (n) => -n,
 sub1: (n) => n - 1,
};
 
MathFuncs.add1;
Try
@author
You can specify the author of an item with @author:
/**
* Welcome to awesome.ts
* @author Ian Awesome <i.am.awesome@example.com>
*/
Try
Remember to surround the email address with angle brackets. Otherwise, @example will be parsed as a new tag.
Other supported patterns
var someObj = {
 /**
  * @param {string} param1 - JSDocs on property assignments work
  */
 x: function (param1) {},
};
 
/**
* As do jsdocs on variable assignments
* @return {Window}
*/
let someFunc = function () {};
 
/**
* And class methods
* @param {string} greeting The greeting to use
*/
Foo.prototype.sayHi = (greeting) => console.log("Hi!");
 
/**
* And arrow function expressions
* @param {number} x - A multiplier
*/
let myArrow = (x) => x * x;
 
/**
* Which means it works for function components in JSX too
* @param {{a: string, b: number}} props - Some param
*/
var fc = (props) => <div>{props.a.charAt(0)}</div>;
 
/**
* A parameter can be a class constructor, using Google Closure syntax.
*
* @param {{new(...args: any[]): object}} C - The class to register
*/
function registerClass(C) {}
 
/**
* @param {...string} p1 - A 'rest' arg (array) of strings. (treated as 'any')
*/
function fn10(p1) {}
 
/**
* @param {...string} p1 - A 'rest' arg (array) of strings. (treated as 'any')
*/
function fn9(p1) {
 return p1.join();
}
Try
Unsupported patterns
Postfix equals on a property type in an object literal type doesn’t specify an optional property:
/**
* @type {{ a: string, b: number= }}
*/
var wrong;
/**
* Use postfix question on the property name instead:
* @type {{ a: string, b?: number }}
*/
var right;
Try
Nullable types only have meaning if strictNullChecks is on:
/**
* @type {?number}
* With strictNullChecks: true  -- number | null
* With strictNullChecks: false -- number
*/
var nullable;
Try
The TypeScript-native syntax is a union type:
/**
* @type {number | null}
* With strictNullChecks: true  -- number | null
* With strictNullChecks: false -- number
*/
var unionNullable;
Try
Non-nullable types have no meaning and are treated just as their original type:
/**
* @type {!number}
* Just has type number
*/
var normal;
Try
Unlike JSDoc’s type system, TypeScript only allows you to mark types as containing null or not. There is no explicit non-nullability — if strictNullChecks is on, then number is not nullable. If it is off, then number is nullable.
Unsupported tags
TypeScript ignores any unsupported JSDoc tags.
The following tags have open issues to support them:
@memberof (issue #7237)
@yields (issue #23857)
@member (issue #56674)
Legacy type synonyms
A number of common types are given aliases for compatibility with old JavaScript code. Some of the aliases are the same as existing types, although most of those are rarely used. For example, String is treated as an alias for string. Even though String is a type in TypeScript, old JSDoc often uses it to mean string. Besides, in TypeScript, the capitalized versions of primitive types are wrapper types — almost always a mistake to use. So the compiler treats these types as synonyms based on usage in old JSDoc:
String -> string
Number -> number
Boolean -> boolean
Void -> void
Undefined -> undefined
Null -> null
function -> Function
array -> Array<any>
promise -> Promise<any>
Object -> any
object -> any
The last four aliases are turned off when noImplicitAny: true:
object and Object are built-in types, although Object is rarely used.
array and promise are not built-in, but might be declared somewhere in your program.
Creating .d.ts Files from .js files
With TypeScript 3.7, TypeScript added support for generating .d.ts files from JavaScript using JSDoc syntax.
This set up means you can own the editor experience of TypeScript-powered editors without porting your project to TypeScript, or having to maintain .d.ts files in your codebase. TypeScript supports most JSDoc tags, you can find the reference here.
Setting up your Project to emit .d.ts files
To add creation of .d.ts files in your project, you will need to do up-to four steps:
Add TypeScript to your dev dependencies
Add a tsconfig.json to configure TypeScript
Run the TypeScript compiler to generate the corresponding d.ts files for JS files
(optional) Edit your package.json to reference the types
Adding TypeScript
You can learn how to do this in our installation page.
TSConfig
The TSConfig is a jsonc file which configures both your compiler flags, and declare where to find files. In this case, you will want a file like the following:
{
 // Change this to match your project
 "include": ["src/**/*"],
 "compilerOptions": {
   // Tells TypeScript to read JS files, as
   // normally they are ignored as source files
   "allowJs": true,
   // Generate d.ts files
   "declaration": true,
   // This compiler run should
   // only output d.ts files
   "emitDeclarationOnly": true,
   // Types should go into this directory.
   // Removing this would place the .d.ts files
   // next to the .js files
   "outDir": "dist",
   // go to js file when using IDE functions like
   // "Go to Definition" in VSCode
   "declarationMap": true
 }
}
You can learn more about the options in the tsconfig reference. An alternative to using a TSConfig file is the CLI, this is the same behavior as a CLI command.
npx -p typescript tsc src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
Run the compiler
You can learn how to do this in our installation page. You want to make sure these files are included in your package if you have the files in your project’s .gitignore.
Editing the package.json
TypeScript replicates the node resolution for modules in a package.json, with an additional step for finding .d.ts files. Roughly, the resolution will first check the optional types field, then the "main" field, and finally will try index.d.ts in the root.
Package.json
Location of default .d.ts
No “types” field
checks “main”, then index.d.ts
“types”: “main.d.ts”
main.d.ts
“types”: “./dist/main.js”
./dist/main.d.ts

If absent, then “main” is used
Package.json
Location of default .d.ts
No “main” field
index.d.ts
“main”:“index.js”
index.d.ts
“main”:“./dist/index.js”
./dist/index.d.ts

Tips
If you’d like to write tests for your .d.ts files, try tsd or TSTyche.
Compiler Options in MSBuild
Overview
When you have an MSBuild based project which utilizes TypeScript such as an ASP.NET Core project, you can configure TypeScript in two ways. Either via a tsconfig.json or via the project settings.
Using a tsconfig.json
We recommend using a tsconfig.json for your project when possible. To add one to an existing project, add a new item to your project which is called a “TypeScript JSON Configuration File” in modern versions of Visual Studio.
The new tsconfig.json will then be used as the source of truth for TypeScript-specific build information like files and configuration. You can learn about how TSConfigs works here and there is a comprehensive reference here.
Using Project Settings
You can also define the configuration for TypeScript inside you project’s settings. This is done by editing the XML in your .csproj to define PropertyGroups which describe how the build can work:
<PropertyGroup>
 <TypeScriptNoEmitOnError>true</TypeScriptNoEmitOnError>
 <TypeScriptNoImplicitReturns>true</TypeScriptNoImplicitReturns>
</PropertyGroup>
There is a series of mappings for common TypeScript settings, these are settings which map directly to TypeScript cli options and are used to help you write a more understandable project file. You can use the TSConfig reference to get more information on what values and defaults are for each mapping.
CLI Mappings
MSBuild Config Name
TSC Flag


<TypeScriptAllowJS>
--allowJs


Allow JavaScript files to be a part of your program. Use the checkJS option to get errors from these files.
<TypeScriptRemoveComments>
--removeComments


Disable emitting comments.
<TypeScriptNoImplicitAny>
--noImplicitAny


Enable error reporting for expressions and declarations with an implied any type..
<TypeScriptGeneratesDeclarations>
--declaration


Generate .d.ts files from TypeScript and JavaScript files in your project.
<TypeScriptModuleKind>
--module


Specify what module code is generated.
<TypeScriptJSXEmit>
--jsx


Specify what JSX code is generated.
<TypeScriptOutDir>
--outDir


Specify an output folder for all emitted files.
<TypeScriptSourceMap>
--sourcemap


Create source map files for emitted JavaScript files.
<TypeScriptTarget>
--target


Set the JavaScript language version for emitted JavaScript and include compatible library declarations.
<TypeScriptNoResolve>
--noResolve


Disallow imports, requires or <reference>s from expanding the number of files TypeScript should add to a project.
<TypeScriptMapRoot>
--mapRoot


Specify the location where debugger should locate map files instead of generated locations.
<TypeScriptSourceRoot>
--sourceRoot


Specify the root path for debuggers to find the reference source code.
<TypeScriptCharset>
--charset


No longer supported. In early versions, manually set the text encoding for reading files.
<TypeScriptEmitBOM>
--emitBOM


Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.
<TypeScriptNoLib>
--noLib


Disable including any library files, including the default lib.d.ts.
<TypeScriptPreserveConstEnums>
--preserveConstEnums


Disable erasing const enum declarations in generated code.
<TypeScriptSuppressImplicitAnyIndexErrors>
--suppressImplicitAnyIndexErrors


Suppress noImplicitAny errors when indexing objects that lack index signatures.
<TypeScriptNoEmitHelpers>
--noEmitHelpers


Disable generating custom helper functions like __extends in compiled output.
<TypeScriptInlineSourceMap>
--inlineSourceMap


Include sourcemap files inside the emitted JavaScript.
<TypeScriptInlineSources>
--inlineSources


Include source code in the sourcemaps inside the emitted JavaScript.
<TypeScriptNewLine>
--newLine


Set the newline character for emitting files.
<TypeScriptIsolatedModules>
--isolatedModules


Ensure that each file can be safely transpiled without relying on other imports.
<TypeScriptEmitDecoratorMetadata>
--emitDecoratorMetadata


Emit design-type metadata for decorated declarations in source files.
<TypeScriptRootDir>
--rootDir


Specify the root folder within your source files.
<TypeScriptExperimentalDecorators>
--experimentalDecorators


Enable experimental support for TC39 stage 2 draft decorators.
<TypeScriptModuleResolution>
--moduleResolution


Specify how TypeScript looks up a file from a given module specifier.
<TypeScriptSuppressExcessPropertyErrors>
--suppressExcessPropertyErrors


Disable reporting of excess property errors during the creation of object literals.
<TypeScriptReactNamespace>
--reactNamespace


Specify the object invoked for createElement. This only applies when targeting react JSX emit.
<TypeScriptSkipDefaultLibCheck>
--skipDefaultLibCheck


Skip type checking .d.ts files that are included with TypeScript.
<TypeScriptAllowUnusedLabels>
--allowUnusedLabels


Disable error reporting for unused labels.
<TypeScriptNoImplicitReturns>
--noImplicitReturns


Enable error reporting for codepaths that do not explicitly return in a function.
<TypeScriptNoFallthroughCasesInSwitch>
--noFallthroughCasesInSwitch


Enable error reporting for fallthrough cases in switch statements.
<TypeScriptAllowUnreachableCode>
--allowUnreachableCode


Disable error reporting for unreachable code.
<TypeScriptForceConsistentCasingInFileNames>
--forceConsistentCasingInFileNames


Ensure that casing is correct in imports.
<TypeScriptAllowSyntheticDefaultImports>
--allowSyntheticDefaultImports


Allow 'import x from y' when a module doesn't have a default export.
<TypeScriptNoImplicitUseStrict>
--noImplicitUseStrict


Disable adding 'use strict' directives in emitted JavaScript files.
<TypeScriptLib>
--lib


Specify a set of bundled library declaration files that describe the target runtime environment.
<TypeScriptBaseUrl>
--baseUrl


Specify the base directory to resolve bare specifier module names.
<TypeScriptDeclarationDir>
--declarationDir


Specify the output directory for generated declaration files.
<TypeScriptNoImplicitThis>
--noImplicitThis


Enable error reporting when this is given the type any.
<TypeScriptSkipLibCheck>
--skipLibCheck


Skip type checking all .d.ts files.
<TypeScriptStrictNullChecks>
--strictNullChecks


When type checking, take into account null and undefined.
<TypeScriptNoUnusedLocals>
--noUnusedLocals


Enable error reporting when a local variables aren't read.
<TypeScriptNoUnusedParameters>
--noUnusedParameters


Raise an error when a function parameter isn't read
<TypeScriptAlwaysStrict>
--alwaysStrict


Ensure 'use strict' is always emitted.
<TypeScriptImportHelpers>
--importHelpers


Allow importing helper functions from tslib once per project, instead of including them per-file.
<TypeScriptJSXFactory>
--jsxFactory


Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'
<TypeScriptStripInternal>
--stripInternal


Disable emitting declarations that have @internal in their JSDoc comments.
<TypeScriptCheckJs>
--checkJs


Enable error reporting in type-checked JavaScript files.
<TypeScriptDownlevelIteration>
--downlevelIteration


Emit more compliant, but verbose and less performant JavaScript for iteration.
<TypeScriptStrict>
--strict


Enable all strict type checking options.
<TypeScriptNoStrictGenericChecks>
--noStrictGenericChecks


Disable strict checking of generic signatures in function types.
<TypeScriptPreserveSymlinks>
--preserveSymlinks


Disable resolving symlinks to their realpath. This correlates to the same flag in node.
<TypeScriptStrictFunctionTypes>
--strictFunctionTypes


When assigning functions, check to ensure parameters and the return values are subtype-compatible.
<TypeScriptStrictPropertyInitialization>
--strictPropertyInitialization


Check for class properties that are declared but not set in the constructor.
<TypeScriptESModuleInterop>
--esModuleInterop


Emit additional JavaScript to ease support for importing CommonJS modules. This enables allowSyntheticDefaultImports for type compatibility.
<TypeScriptEmitDeclarationOnly>
--emitDeclarationOnly


Only output d.ts files and not JavaScript files.
<TypeScriptKeyofStringsOnly>
--keyofStringsOnly


Make keyof only return strings instead of string, numbers or symbols. Legacy option.
<TypeScriptUseDefineForClassFields>
--useDefineForClassFields


Emit ECMAScript-standard-compliant class fields.
<TypeScriptDeclarationMap>
--declarationMap


Create sourcemaps for d.ts files.
<TypeScriptResolveJsonModule>
--resolveJsonModule


Enable importing .json files
<TypeScriptStrictBindCallApply>
--strictBindCallApply


Check that the arguments for bind, call, and apply methods match the original function.
<TypeScriptNoEmitOnError>
--noEmitOnError


Disable emitting files if any type checking errors are reported.

Additional Flags
Because the MSBuild system passes arguments directly to the TypeScript CLI, you can use the option TypeScriptAdditionalFlags to provide specific flags which don’t have a mapping above.
For example, this would turn on noPropertyAccessFromIndexSignature:
<TypeScriptAdditionalFlags> $(TypeScriptAdditionalFlags) --noPropertyAccessFromIndexSignature</TypeScriptAdditionalFlags>
Debug and Release Builds
You can use PropertyGroup conditions to define different sets of configurations. For example, a common task is stripping comments and sourcemaps in production. In this example, we define a debug and release property group which have different TypeScript configurations:
<PropertyGroup Condition="'$(Configuration)' == 'Debug'">
 <TypeScriptRemoveComments>false</TypeScriptRemoveComments>
 <TypeScriptSourceMap>true</TypeScriptSourceMap>
</PropertyGroup>
<PropertyGroup Condition="'$(Configuration)' == 'Release'">
 <TypeScriptRemoveComments>true</TypeScriptRemoveComments>
 <TypeScriptSourceMap>false</TypeScriptSourceMap>
</PropertyGroup>
<Import
   Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets"
   Condition="Exists('$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets')" />
ToolsVersion
The value of <TypeScriptToolsVersion>1.7</TypeScriptToolsVersion> property in the project file identifies the compiler version to use to build (1.7 in this example). This allows a project to build against the same versions of the compiler on different machines.
If TypeScriptToolsVersion is not specified, the latest compiler version installed on the machine will be used to build.
Users using newer versions of TS, will see a prompt to upgrade their project on first load.
TypeScriptCompileBlocked
If you are using a different build tool to build your project (e.g. gulp, grunt , etc.) and VS for the development and debugging experience, set <TypeScriptCompileBlocked>true</TypeScriptCompileBlocked> in your project. This should give you all the editing support, but not the build when you hit F5.
TypeScriptEnableIncrementalMSBuild (TypeScript 4.2 Beta and later)
By default, MSBuild will attempt to only run the TypeScript compiler when the project’s source files have been updated since the last compilation. However, if this behavior is causing issues, such as when TypeScript’s incremental option is enabled, set <TypeScriptEnableIncrementalMSBuild>false</TypeScriptEnableIncrementalMSBuild> to ensure the TypeScript compiler is invoked with every run of MSBuild.
tsc CLI Options
Using the CLI
Running tsc locally will compile the closest project defined by a tsconfig.json, or you can compile a set of TypeScript files by passing in a glob of files you want. When input files are specified on the command line, tsconfig.json files are ignored.
# Run a compile based on a backwards look through the fs for a tsconfig.json
tsc
# Emit JS for just the index.ts with the compiler defaults
tsc index.ts
# Emit JS for any .ts files in the folder src, with the default settings
tsc src/*.ts
# Emit files referenced in with the compiler settings from tsconfig.production.json
tsc --project tsconfig.production.json
# Emit d.ts files for a js file with showing compiler options which are booleans
tsc index.js --declaration --emitDeclarationOnly
# Emit a single .js file from two files via compiler options which take string arguments
tsc app.ts util.ts --target esnext --outfile index.js
Compiler Options
If you’re looking for more information about the compiler options in a tsconfig, check out the TSConfig Reference
CLI Commands
Flag
Type


--all
boolean


Show all compiler options.
--help
boolean


Gives local information for help on the CLI.
--init
boolean


Initializes a TypeScript project and creates a tsconfig.json file.
--listFilesOnly
boolean


Print names of files that are part of the compilation and then stop processing.
--locale
string


Set the language of the messaging from TypeScript. This does not affect emit.
--project
string


Compile the project given the path to its configuration file, or to a folder with a 'tsconfig.json'.
--showConfig
boolean


Print the final configuration instead of building.
--version
boolean


Print the compiler's version.

Build Options
Flag
Type


--build
boolean


Build one or more projects and their dependencies, if out of date
--clean
boolean


Delete the outputs of all projects.
--dry
boolean


Show what would be built (or deleted, if specified with '--clean')
--force
boolean


Build all projects, including those that appear to be up to date.
--verbose
boolean


Enable verbose logging.

Watch Options
Flag
Type


--excludeDirectories
list


Remove a list of directories from the watch process.
--excludeFiles
list


Remove a list of files from the watch mode's processing.
--fallbackPolling
fixedinterval, priorityinterval, dynamicpriority, or fixedchunksize


Specify what approach the watcher should use if the system runs out of native file watchers.
--synchronousWatchDirectory
boolean


Synchronously call callbacks and update the state of directory watchers on platforms that don`t support recursive watching natively.
--watch
boolean


Watch input files.
--watchDirectory
usefsevents, fixedpollinginterval, dynamicprioritypolling, or fixedchunksizepolling


Specify how directories are watched on systems that lack recursive file-watching functionality.
--watchFile
fixedpollinginterval, prioritypollinginterval, dynamicprioritypolling, fixedchunksizepolling, usefsevents, or usefseventsonparentdirectory


Specify how the TypeScript watch mode works.

Compiler Flags
Flag
Type
Default
--allowArbitraryExtensions
boolean
false
Enable importing files with any extension, provided a declaration file is present.
--allowImportingTsExtensions
boolean
true if rewriteRelativeImportExtensions; false otherwise.
Allow imports to include TypeScript file extensions.
--allowJs
boolean
false
Allow JavaScript files to be a part of your program. Use the checkJS option to get errors from these files.
--allowSyntheticDefaultImports
boolean
true if esModuleInterop is enabled, module is system, or moduleResolution is bundler; false otherwise.
Allow 'import x from y' when a module doesn't have a default export.
--allowUmdGlobalAccess
boolean
false
Allow accessing UMD globals from modules.
--allowUnreachableCode
boolean


Disable error reporting for unreachable code.
--allowUnusedLabels
boolean


Disable error reporting for unused labels.
--alwaysStrict
boolean
true if strict; false otherwise.
Ensure 'use strict' is always emitted.
--assumeChangesOnlyAffectDirectDependencies
boolean
false
Have recompiles in projects that use incremental and watch mode assume that changes within a file will only affect files directly depending on it.
--baseUrl
string


Specify the base directory to resolve bare specifier module names.
--charset
string
utf8
No longer supported. In early versions, manually set the text encoding for reading files.
--checkJs
boolean
false
Enable error reporting in type-checked JavaScript files.
--composite
boolean
false
Enable constraints that allow a TypeScript project to be used with project references.
--customConditions
list


Conditions to set in addition to the resolver-specific defaults when resolving imports.
--declaration
boolean
true if composite; false otherwise.
Generate .d.ts files from TypeScript and JavaScript files in your project.
--declarationDir
string


Specify the output directory for generated declaration files.
--declarationMap
boolean
false
Create sourcemaps for d.ts files.
--diagnostics
boolean
false
Output compiler performance information after building.
--disableReferencedProjectLoad
boolean
false
Reduce the number of projects loaded automatically by TypeScript.
--disableSizeLimit
boolean
false
Remove the 20mb cap on total source code size for JavaScript files in the TypeScript language server.
--disableSolutionSearching
boolean
false
Opt a project out of multi-project reference checking when editing.
--disableSourceOfProjectReferenceRedirect
boolean
false
Disable preferring source files instead of declaration files when referencing composite projects.
--downlevelIteration
boolean
false
Emit more compliant, but verbose and less performant JavaScript for iteration.
--emitBOM
boolean
false
Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.
--emitDeclarationOnly
boolean
false
Only output d.ts files and not JavaScript files.
--emitDecoratorMetadata
boolean
false
Emit design-type metadata for decorated declarations in source files.
--erasableSyntaxOnly
boolean
false
Do not allow runtime constructs that are not part of ECMAScript.
--esModuleInterop
boolean
true if module is node16, nodenext, or preserve; false otherwise.
Emit additional JavaScript to ease support for importing CommonJS modules. This enables allowSyntheticDefaultImports for type compatibility.
--exactOptionalPropertyTypes
boolean
false
Interpret optional property types as written, rather than adding undefined.
--experimentalDecorators
boolean
false
Enable experimental support for TC39 stage 2 draft decorators.
--explainFiles
boolean
false
Print files read during the compilation including why it was included.
--extendedDiagnostics
boolean
false
Output more detailed compiler performance information after building.
--forceConsistentCasingInFileNames
boolean
true
Ensure that casing is correct in imports.
--generateCpuProfile
string
profile.cpuprofile
Emit a v8 CPU profile of the compiler run for debugging.
--generateTrace
string


Generates an event trace and a list of types.
--importHelpers
boolean
false
Allow importing helper functions from tslib once per project, instead of including them per-file.
--importsNotUsedAsValues
remove, preserve, or error
remove
Specify emit/checking behavior for imports that are only used for types.
--incremental
boolean
true if composite; false otherwise.
Save .tsbuildinfo files to allow for incremental compilation of projects.
--inlineSourceMap
boolean
false
Include sourcemap files inside the emitted JavaScript.
--inlineSources
boolean
false
Include source code in the sourcemaps inside the emitted JavaScript.
--isolatedDeclarations
boolean
false
Require sufficient annotation on exports so other tools can trivially generate declaration files.
--isolatedModules
boolean
true if verbatimModuleSyntax; false otherwise.
Ensure that each file can be safely transpiled without relying on other imports.
--jsx
preserve, react, react-native, react-jsx, or react-jsxdev


Specify what JSX code is generated.
--jsxFactory
string
React.createElement
Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'.
--jsxFragmentFactory
string
React.Fragment
Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'.
--jsxImportSource
string
react
Specify module specifier used to import the JSX factory functions when using jsx: react-jsx*.
--keyofStringsOnly
boolean
false
Make keyof only return strings instead of string, numbers or symbols. Legacy option.
--lib
list


Specify a set of bundled library declaration files that describe the target runtime environment.
--libReplacement
boolean
true
Enable substitution of default lib files with custom ones.
--listEmittedFiles
boolean
false
Print the names of emitted files after a compilation.
--listFiles
boolean
false
Print all of the files read during the compilation.
--mapRoot
string


Specify the location where debugger should locate map files instead of generated locations.
--maxNodeModuleJsDepth
number
0
Specify the maximum folder depth used for checking JavaScript files from node_modules. Only applicable with allowJs.
--module
none, commonjs, amd, umd, system, es6/es2015, es2020, es2022, esnext, node16, node18, nodenext, or preserve
CommonJS if target is ES5; ES6/ES2015 otherwise.
Specify what module code is generated.
--moduleDetection
legacy, auto, or force
"auto": Treat files with imports, exports, import.meta, jsx (with jsx: react-jsx), or esm format (with module: node16+) as modules.
Specify what method is used to detect whether a file is a script or a module.
--moduleResolution
classic, node10/node, node16, nodenext, or bundler
Node10 if module is CommonJS; Node16 if module is Node16 or Node18; NodeNext if module is NodeNext; Bundler if module is Preserve; Classic otherwise.
Specify how TypeScript looks up a file from a given module specifier.
--moduleSuffixes
list


List of file name suffixes to search when resolving a module.
--newLine
crlf or lf
lf
Set the newline character for emitting files.
--noCheck
boolean
false
Disable full type checking (only critical parse and emit errors will be reported).
--noEmit
boolean
false
Disable emitting files from a compilation.
--noEmitHelpers
boolean
false
Disable generating custom helper functions like __extends in compiled output.
--noEmitOnError
boolean
false
Disable emitting files if any type checking errors are reported.
--noErrorTruncation
boolean
false
Disable truncating types in error messages.
--noFallthroughCasesInSwitch
boolean
false
Enable error reporting for fallthrough cases in switch statements.
--noImplicitAny
boolean
true if strict; false otherwise.
Enable error reporting for expressions and declarations with an implied any type.
--noImplicitOverride
boolean
false
Ensure overriding members in derived classes are marked with an override modifier.
--noImplicitReturns
boolean
false
Enable error reporting for codepaths that do not explicitly return in a function.
--noImplicitThis
boolean
true if strict; false otherwise.
Enable error reporting when this is given the type any.
--noImplicitUseStrict
boolean
false
Disable adding 'use strict' directives in emitted JavaScript files.
--noLib
boolean
false
Disable including any library files, including the default lib.d.ts.
--noPropertyAccessFromIndexSignature
boolean
false
Enforces using indexed accessors for keys declared using an indexed type.
--noResolve
boolean
false
Disallow imports, requires or <reference>s from expanding the number of files TypeScript should add to a project.
--noStrictGenericChecks
boolean
false
Disable strict checking of generic signatures in function types.
--noUncheckedIndexedAccess
boolean
false
Add undefined to a type when accessed using an index.
--noUncheckedSideEffectImports
boolean
false
Check side effect imports.
--noUnusedLocals
boolean
false
Enable error reporting when local variables aren't read.
--noUnusedParameters
boolean
false
Raise an error when a function parameter isn't read.
--out
string


Deprecated setting. Use outFile instead.
--outDir
string


Specify an output folder for all emitted files.
--outFile
string


Specify a file that bundles all outputs into one JavaScript file. If declaration is true, also designates a file that bundles all .d.ts output.
--paths
object


Specify a set of entries that re-map imports to additional lookup locations.
--plugins
list


Specify a list of language service plugins to include.
--preserveConstEnums
boolean
true if isolatedModules; false otherwise.
Disable erasing const enum declarations in generated code.
--preserveSymlinks
boolean
false
Disable resolving symlinks to their realpath. This correlates to the same flag in node.
--preserveValueImports
boolean
false
Preserve unused imported values in the JavaScript output that would otherwise be removed.
--preserveWatchOutput
boolean
false
Disable wiping the console in watch mode.
--pretty
boolean
true
Enable color and formatting in TypeScript's output to make compiler errors easier to read.
--reactNamespace
string
React
Specify the object invoked for createElement. This only applies when targeting react JSX emit.
--removeComments
boolean
false
Disable emitting comments.
--resolveJsonModule
boolean
false
Enable importing .json files.
--resolvePackageJsonExports
boolean
true when moduleResolution is node16, nodenext, or bundler; otherwise false
Use the package.json 'exports' field when resolving package imports.
--resolvePackageJsonImports
boolean
true when moduleResolution is node16, nodenext, or bundler; otherwise false
Use the package.json 'imports' field when resolving imports.
--rewriteRelativeImportExtensions
boolean
false
Rewrite .ts, .tsx, .mts, and .cts file extensions in relative import paths to their JavaScript equivalent in output files.
--rootDir
string
Computed from the list of input files.
Specify the root folder within your source files.
--rootDirs
list
Computed from the list of input files.
Allow multiple folders to be treated as one when resolving modules.
--skipDefaultLibCheck
boolean
false
Skip type checking .d.ts files that are included with TypeScript.
--skipLibCheck
boolean
false
Skip type checking all .d.ts files.
--sourceMap
boolean
false
Create source map files for emitted JavaScript files.
--sourceRoot
string


Specify the root path for debuggers to find the reference source code.
--stopBuildOnErrors
boolean


Skip building downstream projects on error in upstream project.
--strict
boolean
false
Enable all strict type-checking options.
--strictBindCallApply
boolean
true if strict; false otherwise.
Check that the arguments for bind, call, and apply methods match the original function.
--strictBuiltinIteratorReturn
boolean
true if strict; false otherwise.
Built-in iterators are instantiated with a TReturn type of undefined instead of any.
--strictFunctionTypes
boolean
true if strict; false otherwise.
When assigning functions, check to ensure parameters and the return values are subtype-compatible.
--strictNullChecks
boolean
true if strict; false otherwise.
When type checking, take into account null and undefined.
--strictPropertyInitialization
boolean
true if strict; false otherwise.
Check for class properties that are declared but not set in the constructor.
--stripInternal
boolean
false
Disable emitting declarations that have @internal in their JSDoc comments.
--suppressExcessPropertyErrors
boolean
false
Disable reporting of excess property errors during the creation of object literals.
--suppressImplicitAnyIndexErrors
boolean
false
Suppress noImplicitAny errors when indexing objects that lack index signatures.
--target
es3, es5, es6/es2015, es2016, es2017, es2018, es2019, es2020, es2021, es2022, es2023, es2024, or esnext
ES5
Set the JavaScript language version for emitted JavaScript and include compatible library declarations.
--traceResolution
boolean
false
Log paths used during the moduleResolution process.
--tsBuildInfoFile
string
.tsbuildinfo
The file to store .tsbuildinfo incremental build information in.
--typeRoots
list


Specify multiple folders that act like ./node_modules/@types.
--types
list


Specify type package names to be included without being referenced in a source file.
--useDefineForClassFields
boolean
true if target is ES2022 or higher, including ESNext; false otherwise.
Emit ECMAScript-standard-compliant class fields.
--useUnknownInCatchVariables
boolean
true if strict; false otherwise.
Default catch clause variables as unknown instead of any.
--verbatimModuleSyntax
boolean
false
Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting.

Related
Every option is fully explained in the TSConfig Reference.
Learn how to use a tsconfig.json file.
Learn how to work in an MSBuild project.
Project References
Project references allows you to structure your TypeScript programs into smaller pieces, available in TypeScript 3.0 and newer.
By doing this, you can greatly improve build times, enforce logical separation between components, and organize your code in new and better ways.
We’re also introducing a new mode for tsc, the --build flag, that works hand in hand with project references to enable faster TypeScript builds.
An Example Project
Let’s look at a fairly normal program and see how project references can help us better organize it. Imagine you have a project with two modules, converter and units, and a corresponding test file for each:
/
├── src/
│   ├── converter.ts
│   └── units.ts
├── test/
│   ├── converter-tests.ts
│   └── units-tests.ts
└── tsconfig.json
The test files import the implementation files and do some testing:
// converter-tests.ts
import * as converter from "../src/converter";
assert.areEqual(converter.celsiusToFahrenheit(0), 32);
Previously, this structure was rather awkward to work with if you used a single tsconfig file:
It was possible for the implementation files to import the test files
It wasn’t possible to build test and src at the same time without having src appear in the output folder name, which you probably don’t want
Changing just the internals in the implementation files required typechecking the tests again, even though this wouldn’t ever cause new errors
Changing just the tests required typechecking the implementation again, even if nothing changed
You could use multiple tsconfig files to solve some of those problems, but new ones would appear:
There’s no built-in up-to-date checking, so you end up always running tsc twice
Invoking tsc twice incurs more startup time overhead
tsc -w can’t run on multiple config files at once
Project references can solve all of these problems and more.
What is a Project Reference?
tsconfig.json files have a new top-level property, references. It’s an array of objects that specifies projects to reference:
{
   "compilerOptions": {
       // The usual
   },
   "references": [
       { "path": "../src" }
   ]
}
The path property of each reference can point to a directory containing a tsconfig.json file, or to the config file itself (which may have any name).
When you reference a project, new things happen:
Importing modules from a referenced project will instead load its output declaration file (.d.ts)
If the referenced project produces an outFile, the output file .d.ts file’s declarations will be visible in this project
Build mode (see below) will automatically build the referenced project if needed
By separating into multiple projects, you can greatly improve the speed of typechecking and compiling, reduce memory usage when using an editor, and improve enforcement of the logical groupings of your program.
composite
Referenced projects must have the new composite setting enabled. This setting is needed to ensure TypeScript can quickly determine where to find the outputs of the referenced project. Enabling the composite flag changes a few things:
The rootDir setting, if not explicitly set, defaults to the directory containing the tsconfig file
All implementation files must be matched by an include pattern or listed in the files array. If this constraint is violated, tsc will inform you which files weren’t specified
declaration must be turned on
declarationMap
We’ve also added support for declaration source maps. If you enable declarationMap, you’ll be able to use editor features like “Go to Definition” and Rename to transparently navigate and edit code across project boundaries in supported editors.
Caveats for Project References
Project references have a few trade-offs you should be aware of.
Because dependent projects make use of .d.ts files that are built from their dependencies, you’ll either have to check in certain build outputs or build a project after cloning it before you can navigate the project in an editor without seeing spurious errors.
When using VS Code (since TS 3.7) we have a behind-the-scenes in-memory .d.ts generation process that should be able to mitigate this, but it has some perf implications. For very large composite projects you might want to disable this using disableSourceOfProjectReferenceRedirect option.
Additionally, to preserve compatibility with existing build workflows, tsc will not automatically build dependencies unless invoked with the --build switch. Let’s learn more about --build.
Build Mode for TypeScript
A long-awaited feature is smart incremental builds for TypeScript projects. In 3.0 you can use the --build flag with tsc. This is effectively a new entry point for tsc that behaves more like a build orchestrator than a simple compiler.
Running tsc --build (tsc -b for short) will do the following:
Find all referenced projects
Detect if they are up-to-date
Build out-of-date projects in the correct order
You can provide tsc -b with multiple config file paths (e.g. tsc -b src test). Just like tsc -p, specifying the config file name itself is unnecessary if it’s named tsconfig.json.
tsc -b Commandline
You can specify any number of config files:
> tsc -b                            # Use the tsconfig.json in the current directory
> tsc -b src                        # Use src/tsconfig.json
> tsc -b foo/prd.tsconfig.json bar  # Use foo/prd.tsconfig.json and bar/tsconfig.json
Don’t worry about ordering the files you pass on the commandline - tsc will re-order them if needed so that dependencies are always built first.
There are also some flags specific to tsc -b:
--verbose: Prints out verbose logging to explain what’s going on (may be combined with any other flag)
--dry: Shows what would be done but doesn’t actually build anything
--clean: Deletes the outputs of the specified projects (may be combined with --dry)
--force: Act as if all projects are out of date
--watch: Watch mode (may not be combined with any flag except --verbose)
Caveats
Normally, tsc will produce outputs (.js and .d.ts) in the presence of syntax or type errors, unless noEmitOnError is on. Doing this in an incremental build system would be very bad - if one of your out-of-date dependencies had a new error, you’d only see it once because a subsequent build would skip building the now up-to-date project. For this reason, tsc -b effectively acts as if noEmitOnError is enabled for all projects.
If you check in any build outputs (.js, .d.ts, .d.ts.map, etc.), you may need to run a --force build after certain source control operations depending on whether your source control tool preserves timestamps between the local copy and the remote copy.
MSBuild
If you have an msbuild project, you can enable build mode by adding
   <TypeScriptBuildMode>true</TypeScriptBuildMode>
to your proj file. This will enable automatic incremental build as well as cleaning.
Note that as with tsconfig.json / -p, existing TypeScript project properties will not be respected - all settings should be managed using your tsconfig file.
Some teams have set up msbuild-based workflows wherein tsconfig files have the same implicit graph ordering as the managed projects they are paired with. If your solution is like this, you can continue to use msbuild with tsc -p along with project references; these are fully interoperable.
Guidance
Overall Structure
With more tsconfig.json files, you’ll usually want to use Configuration file inheritance to centralize your common compiler options. This way you can change a setting in one file rather than having to edit multiple files.
Another good practice is to have a “solution” tsconfig.json file that simply has references to all of your leaf-node projects and sets files to an empty array (otherwise the solution file will cause double compilation of files). Note that starting with 3.0, it is no longer an error to have an empty files array if you have at least one reference in a tsconfig.json file.
This presents a simple entry point; e.g. in the TypeScript repo we simply run tsc -b src to build all endpoints because we list all the subprojects in src/tsconfig.json
You can see these patterns in the TypeScript repo - see src/tsconfig_base.json, src/tsconfig.json, and src/tsc/tsconfig.json as key examples.
Structuring for relative modules
In general, not much is needed to transition a repo using relative modules. Simply place a tsconfig.json file in each subdirectory of a given parent folder, and add references to these config files to match the intended layering of the program. You will need to either set the outDir to an explicit subfolder of the output folder, or set the rootDir to the common root of all project folders.
Structuring for outFiles
Layout for compilations using outFile is more flexible because relative paths don’t matter as much. The TypeScript repo itself is a good reference here - we have some “library” projects and some “endpoint” projects; “endpoint” projects are kept as small as possible and pull in only the libraries they need.
Integrating with Build Tools
Babel
Install
npm install @babel/cli @babel/core @babel/preset-typescript --save-dev
.babelrc
{
 "presets": ["@babel/preset-typescript"]
}
Using Command Line Interface
./node_modules/.bin/babel --out-file bundle.js src/index.ts
package.json
{
 "scripts": {
   "build": "babel --out-file bundle.js main.ts"
 },
}
Execute Babel from the command line
npm run build
Browserify
Install
npm install tsify
Using Command Line Interface
browserify main.ts -p [ tsify --noImplicitAny ] > bundle.js
Using API
var browserify = require("browserify");
var tsify = require("tsify");
browserify()
 .add("main.ts")
 .plugin("tsify", { noImplicitAny: true })
 .bundle()
 .pipe(process.stdout);
More details: smrq/tsify
Grunt
Using grunt-ts (no longer maintained)
Install
npm install grunt-ts --save-dev
Basic Gruntfile.js
module.exports = function (grunt) {
 grunt.initConfig({
   ts: {
     default: {
       src: ["**/*.ts", "!node_modules/**/*.ts"],
     },
   },
 });
 grunt.loadNpmTasks("grunt-ts");
 grunt.registerTask("default", ["ts"]);
};
More details: TypeStrong/grunt-ts
Using grunt-browserify combined with tsify
Install
npm install grunt-browserify tsify --save-dev
Basic Gruntfile.js
module.exports = function (grunt) {
 grunt.initConfig({
   browserify: {
     all: {
       src: "src/main.ts",
       dest: "dist/main.js",
       options: {
         plugin: ["tsify"],
       },
     },
   },
 });
 grunt.loadNpmTasks("grunt-browserify");
 grunt.registerTask("default", ["browserify"]);
};
More details: jmreidy/grunt-browserify, TypeStrong/tsify
Gulp
Install
npm install gulp-typescript
Basic gulpfile.js
var gulp = require("gulp");
var ts = require("gulp-typescript");
gulp.task("default", function () {
 var tsResult = gulp.src("src/*.ts").pipe(
   ts({
     noImplicitAny: true,
     out: "output.js",
   })
 );
 return tsResult.js.pipe(gulp.dest("built/local"));
});
More details: ivogabe/gulp-typescript
Jspm
Install
npm install -g jspm@beta
Note: Currently TypeScript support in jspm is in 0.16beta
More details: TypeScriptSamples/jspm
MSBuild
Update project file to include locally installed Microsoft.TypeScript.Default.props (at the top) and Microsoft.TypeScript.targets (at the bottom) files:
<?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="4.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
 <!-- Include default props at the top -->
 <Import
     Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.Default.props"
     Condition="Exists('$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.Default.props')" />
 <!-- TypeScript configurations go here -->
 <PropertyGroup Condition="'$(Configuration)' == 'Debug'">
   <TypeScriptRemoveComments>false</TypeScriptRemoveComments>
   <TypeScriptSourceMap>true</TypeScriptSourceMap>
 </PropertyGroup>
 <PropertyGroup Condition="'$(Configuration)' == 'Release'">
   <TypeScriptRemoveComments>true</TypeScriptRemoveComments>
   <TypeScriptSourceMap>false</TypeScriptSourceMap>
 </PropertyGroup>
 <!-- Include default targets at the bottom -->
 <Import
     Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets"
     Condition="Exists('$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets')" />
</Project>
More details about defining MSBuild compiler options: Setting Compiler Options in MSBuild projects
NuGet
Right-Click -> Manage NuGet Packages
Search for Microsoft.TypeScript.MSBuild
Hit Install
When install is complete, rebuild!
More details can be found at Package Manager Dialog and using nightly builds with NuGet
Rollup
Install
npm install @rollup/plugin-typescript --save-dev
Note that both typescript and tslib are peer dependencies of this plugin that need to be installed separately.
Usage
Create a rollup.config.js configuration file and import the plugin:
// rollup.config.js
import typescript from '@rollup/plugin-typescript';
export default {
 input: 'src/index.ts',
 output: {
   dir: 'output',
   format: 'cjs'
 },
 plugins: [typescript()]
};
Svelte Compiler
Install
npm install --save-dev svelte-preprocess
Note that typescript is an optional peer dependencies of this plugin and needs to be installed separately. tslib is not provided either.
You may also consider svelte-check for CLI type checking.
Usage
Create a svelte.config.js configuration file and import the plugin:
// svelte.config.js
import preprocess from 'svelte-preprocess';
const config = {
 // Consult https://github.com/sveltejs/svelte-preprocess
 // for more information about preprocessors
 preprocess: preprocess()
};
export default config;
You can now specify that script blocks are written in TypeScript:
<script lang="ts">
Vite
Vite supports importing .ts files out-of-the-box. It only performs transpilation and not type checking. It also requires that some compilerOptions have certain values. See the Vite docs for more details.
Webpack
Install
npm install ts-loader --save-dev
Basic webpack.config.js when using Webpack 5 or 4
const path = require('path');
module.exports = {
 entry: './src/index.ts',
 module: {
   rules: [
     {
       test: /\.tsx?$/,
       use: 'ts-loader',
       exclude: /node_modules/,
     },
   ],
 },
 resolve: {
   extensions: ['.tsx', '.ts', '.js'],
 },
 output: {
   filename: 'bundle.js',
   path: path.resolve(__dirname, 'dist'),
 },
};
See more details on ts-loader here.
Alternatives:
awesome-typescript-loader
Configuring Watch
As of TypeScript 3.8 and onward, the Typescript compiler exposes configuration which controls how it watches files and directories. Prior to this version, configuration required the use of environment variables which are still available.
Background
The --watch implementation of the compiler relies on Node’s fs.watch and fs.watchFile. Each of these methods has pros and cons.
fs.watch relies on file system events to broadcast changes in the watched files and directories. The implementation of this command is OS dependent and unreliable - on many operating systems, it does not work as expected. Additionally, some operating systems limit the number of watches which can exist simultaneously (e.g. some flavors of Linux). Heavy use of fs.watch in large codebases has the potential to exceed these limits and result in undesirable behavior. However, because this implementation relies on an events-based model, CPU use is comparatively light. The compiler typically uses fs.watch to watch directories (e.g. source directories included by compiler configuration files and directories in which module resolution failed, among others). TypeScript uses these to augment potential failures in individual file watchers. However, there is a key limitation of this strategy: recursive watching of directories is supported on Windows and macOS, but not on Linux. This suggested a need for additional strategies for file and directory watching.
fs.watchFile uses polling and thus costs CPU cycles. However, fs.watchFile is by far the most reliable mechanism available to subscribe to the events from files and directories of interest. Under this strategy, the TypeScript compiler typically uses fs.watchFile to watch source files, config files, and files which appear missing based on reference statements. This means that the degree to which CPU usage will be higher when using fs.watchFile depends directly on number of files watched in the codebase.
Configuring file watching using a tsconfig.json
The suggested method of configuring watch behavior is through the new watchOptions section of tsconfig.json. We provide an example configuration below. See the following section for detailed descriptions of the settings available.
{
 // Some typical compiler options
 "compilerOptions": {
   "target": "es2020",
   "moduleResolution": "node"
   // ...
 },
 // NEW: Options for file/directory watching
 "watchOptions": {
   // Use native file system events for files and directories
   "watchFile": "useFsEvents",
   "watchDirectory": "useFsEvents",
   // Poll files for updates more frequently
   // when they're updated a lot.
   "fallbackPolling": "dynamicPriority",
   // Don't coalesce watch notification
   "synchronousWatchDirectory": true,
   // Finally, two additional settings for reducing the amount of possible
   // files to track  work from these directories
   "excludeDirectories": ["**/node_modules", "_build"],
   "excludeFiles": ["build/fileWhichChangesOften.ts"]
 }
}
For further details, see the release notes for Typescript 3.8.
Configuring file watching using environment variable TSC_WATCHFILE
Option
Description
PriorityPollingInterval
Use fs.watchFile, but use different polling intervals for source files, config files and missing files
DynamicPriorityPolling
Use a dynamic queue where frequently modified files are polled at shorter intervals, and unchanged files are polled less frequently
UseFsEvents
Use fs.watch. On operating systems that limit the number of active watches, fall back to fs.watchFile when a watcher fails to be created.
UseFsEventsWithFallbackDynamicPolling
Use fs.watch. On operating systems that limit the number of active watches, fall back to dynamic polling queues (as explained in DynamicPriorityPolling)
UseFsEventsOnParentDirectory
Use fs.watch on the parent directories of included files (yielding a compromise that results in lower CPU usage than pure fs.watchFile but potentially lower accuracy).
default (no value specified)
If environment variable TSC_NONPOLLING_WATCHER is set to true, use UseFsEventsOnParentDirectory. Otherwise, watch files using fs.watchFile with 250ms as the timeout for any file.

Configuring directory watching using environment variable TSC_WATCHDIRECTORY
For directory watches on platforms which don’t natively allow recursive directory watching (i.e. non macOS and Windows operating systems) is supported through recursively creating directory watchers for each child directory using different options selected by TSC_WATCHDIRECTORY.
NOTE: On platforms which support native recursive directory watching, the value of TSC_WATCHDIRECTORY is ignored.
Option
Description
RecursiveDirectoryUsingFsWatchFile
Use fs.watchFile to watch included directories and child directories.
RecursiveDirectoryUsingDynamicPriorityPolling
Use a dynamic polling queue to poll changes to included directories and child directories.
default (no value specified)
Use fs.watch to watch included directories and child directories.

Nightly Builds
A nightly build from the TypeScript’s main branch is published by midnight PST to npm. Here is how you can get it and use it with your tools.
Using npm
npm install -D typescript@next
Updating your IDE to use the nightly builds
You can also update your editor/IDE to use the nightly drop. You will typically need to install the package through npm. The rest of this section mostly assumes typescript@next is already installed.
Visual Studio Code
The VS Code website has documentation on selecting a workspace version of TypeScript. After installing a nightly version of TypeScript in your workspace, you can follow directions there, or simply update your workspace settings in the JSON view. A direct way to do this is to open or create your workspace’s .vscode/settings.json and add the following property:
"typescript.tsdk": "<path to your folder>/node_modules/typescript/lib"
Alternatively, if you simply want to run the nightly editing experience for JavaScript and TypeScript in Visual Studio Code without changing your workspace version, you can run the JavaScript and TypeScript Nightly Extension
Sublime Text
Update the Settings - User file with the following:
"typescript_tsdk": "<path to your folder>/node_modules/typescript/lib"
More information is available at the TypeScript Plugin for Sublime Text installation documentation.
Visual Studio 2013 and 2015
Note: Most changes do not require you to install a new version of the VS TypeScript plugin.
The nightly build currently does not include the full plugin setup, but we are working on publishing an installer on a nightly basis as well.
Download the VSDevMode.ps1 script.
Also see our wiki page on using a custom language service file.
From a PowerShell command window, run:
For VS 2015:
VSDevMode.ps1 14 -tsScript <path to your folder>/node_modules/typescript/lib
For VS 2013:
VSDevMode.ps1 12 -tsScript <path to your folder>/node_modules/typescript/lib
IntelliJ IDEA (Mac)
Go to Preferences > Languages & Frameworks > TypeScript:
TypeScript Version: If you installed with npm: /usr/local/lib/node_modules/typescript/lib
IntelliJ IDEA (Windows)
Go to File > Settings > Languages & Frameworks > TypeScript:
TypeScript Version: If you installed with npm: C:\Users\USERNAME\AppData\Roaming\npm\node_modules\typescript\lib


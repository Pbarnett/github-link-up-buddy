# NodeJS Documentation 1

Node.js v24.4.1
  Other versions 
 Options

About this documentation
Usage and example

Assertion testing
Asynchronous context tracking
Async hooks
Buffer
C++ addons
C/C++ addons with Node-API
C++ embedder API
Child processes
Cluster
Command-line options
Console
Crypto
Debugger
Deprecated APIs
Diagnostics Channel
DNS
Domain
Errors
Events
File system
Globals
HTTP
HTTP/2
HTTPS
Inspector
Internationalization
Modules: CommonJS modules
Modules: ECMAScript modules
Modules: node:module API
Modules: Packages
Modules: TypeScript
Net
OS
Path
Performance hooks
Permissions
Process
Punycode
Query strings
Readline
REPL
Report
Single executable applications
SQLite
Stream
String decoder
Test runner
Timers
TLS/SSL
Trace events
TTY
UDP/datagram
URL
Utilities
V8
VM
WASI
Web Crypto API
Web Streams API
Worker threads
Zlib

Code repository and issue tracker
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
About this documentation
Contributing
Stability index
Stability overview
JSON output
System calls and man pages
About this documentation
#
Welcome to the official API reference documentation for Node.js!
Node.js is a JavaScript runtime built on the V8 JavaScript engine.
Contributing
#
Report errors in this documentation in the issue tracker. See the contributing guide for directions on how to submit pull requests.
Stability index
#
Throughout the documentation are indications of a section's stability. Some APIs are so proven and so relied upon that they are unlikely to ever change at all. Others are brand new and experimental, or known to be hazardous.
The stability indexes are as follows:
Stability: 0 - Deprecated. The feature may emit warnings. Backward compatibility is not guaranteed.
Stability: 1 - Experimental. The feature is not subject to semantic versioning rules. Non-backward compatible changes or removal may occur in any future release. Use of the feature is not recommended in production environments.
Experimental features are subdivided into stages:
1.0 - Early development. Experimental features at this stage are unfinished and subject to substantial change.
1.1 - Active development. Experimental features at this stage are nearing minimum viability.
1.2 - Release candidate. Experimental features at this stage are hopefully ready to become stable. No further breaking changes are anticipated but may still occur in response to user feedback. We encourage user testing and feedback so that we can know that this feature is ready to be marked as stable.
Experimental features leave the experimental status typically either by graduating to stable, or are removed without a deprecation cycle.
Stability: 2 - Stable. Compatibility with the npm ecosystem is a high priority.
Stability: 3 - Legacy. Although this feature is unlikely to be removed and is still covered by semantic versioning guarantees, it is no longer actively maintained, and other alternatives are available.
Features are marked as legacy rather than being deprecated if their use does no harm, and they are widely relied upon within the npm ecosystem. Bugs found in legacy features are unlikely to be fixed.
Use caution when making use of Experimental features, particularly when authoring libraries. Users may not be aware that experimental features are being used. Bugs or behavior changes may surprise users when Experimental API modifications occur. To avoid surprises, use of an Experimental feature may need a command-line flag. Experimental features may also emit a warning.
Stability overview
#
API
Stability
Assert
(2) Stable
Async hooks
(1) Experimental
Asynchronous context tracking
(2) Stable
Buffer
(2) Stable
Child process
(2) Stable
Cluster
(2) Stable
Console
(2) Stable
Crypto
(2) Stable
Diagnostics Channel
(2) Stable
DNS
(2) Stable
Domain
(0) Deprecated
File system
(2) Stable
HTTP
(2) Stable
HTTP/2
(2) Stable
HTTPS
(2) Stable
Inspector
(2) Stable
Modules: node:module API
(1) .2 - Release candidate (asynchronous version) Stability: 1.1 - Active development (synchronous version)
Modules: CommonJS modules
(2) Stable
Modules: TypeScript
(1) .2 - Release candidate
OS
(2) Stable
Path
(2) Stable
Performance measurement APIs
(2) Stable
Punycode
(0) Deprecated
Query string
(2) Stable
Readline
(2) Stable
REPL
(2) Stable
Single executable applications
(1) .1 - Active development
SQLite
(1) .1 - Active development.
Stream
(2) Stable
String decoder
(2) Stable
Test runner
(2) Stable
Timers
(2) Stable
TLS (SSL)
(2) Stable
Trace events
(1) Experimental
TTY
(2) Stable
UDP/datagram sockets
(2) Stable
URL
(2) Stable
Util
(2) Stable
VM (executing JavaScript)
(2) Stable
Web Crypto API
(2) Stable
Web Streams API
(2) Stable
WebAssembly System Interface (WASI)
(1) Experimental
Worker threads
(2) Stable
Zlib
(2) Stable

JSON output
#
Added in: v0.6.12
Every .html document has a corresponding .json document. This is for IDEs and other utilities that consume the documentation.
System calls and man pages
#
Node.js functions which wrap a system call will document that. The docs link to the corresponding man pages which describe how the system call works.
Most Unix system calls have Windows analogues. Still, behavior differences may be unavoidable.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Usage and example
Usage
Example
Usage and example
#
Usage
#
node [options] [V8 options] [script.js | -e "script" | - ] [arguments]
Please see the Command-line options document for more information.
Example
#
An example of a web server written with Node.js which responds with 'Hello, World!':
Commands in this document start with $ or > to replicate how they would appear in a user's terminal. Do not include the $ and > characters. They are there to show the start of each command.
Lines that don't start with $ or > character show the output of the previous command.
First, make sure to have downloaded and installed Node.js. See Installing Node.js via package manager for further install information.
Now, create an empty project folder called projects, then navigate into it.
Linux and Mac:
mkdir ~/projects
cd ~/projects
copy
Windows CMD:
mkdir %USERPROFILE%\projects
cd %USERPROFILE%\projects
copy
Windows PowerShell:
mkdir $env:USERPROFILE\projects
cd $env:USERPROFILE\projects
copy
Next, create a new source file in the projects folder and call it hello-world.js.
Open hello-world.js in any preferred text editor and paste in the following content:
const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
copy
Save the file. Then, in the terminal window, to run the hello-world.js file, enter:
node hello-world.js
copy
Output like this should appear in the terminal:
Server running at http://127.0.0.1:3000/
copy
Now, open any preferred web browser and visit http://127.0.0.1:3000.
If the browser displays the string Hello, World!, that indicates the server is working.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Assert
Strict assertion mode
Legacy assertion mode
Class: assert.AssertionError
new assert.AssertionError(options)
Class: assert.CallTracker
new assert.CallTracker()
tracker.calls([fn][, exact])
tracker.getCalls(fn)
tracker.report()
tracker.reset([fn])
tracker.verify()
assert(value[, message])
assert.deepEqual(actual, expected[, message])
Comparison details
assert.deepStrictEqual(actual, expected[, message])
Comparison details
assert.doesNotMatch(string, regexp[, message])
assert.doesNotReject(asyncFn[, error][, message])
assert.doesNotThrow(fn[, error][, message])
assert.equal(actual, expected[, message])
assert.fail([message])
assert.fail(actual, expected[, message[, operator[, stackStartFn]]])
assert.ifError(value)
assert.match(string, regexp[, message])
assert.notDeepEqual(actual, expected[, message])
assert.notDeepStrictEqual(actual, expected[, message])
assert.notEqual(actual, expected[, message])
assert.notStrictEqual(actual, expected[, message])
assert.ok(value[, message])
assert.rejects(asyncFn[, error][, message])
assert.strictEqual(actual, expected[, message])
assert.throws(fn[, error][, message])
assert.partialDeepStrictEqual(actual, expected[, message])
Comparison details
Assert
#
Stability: 2 - Stable
Source Code: lib/assert.js
The node:assert module provides a set of assertion functions for verifying invariants.
Strict assertion mode
#
History

























In strict assertion mode, non-strict methods behave like their corresponding strict methods. For example, assert.deepEqual() will behave like assert.deepStrictEqual().
In strict assertion mode, error messages for objects display a diff. In legacy assertion mode, error messages for objects display the objects, often truncated.
To use strict assertion mode:
const assert = require('node:assert').strict;
copy
const assert = require('node:assert/strict');
copy
Example error diff:
const assert = require('node:assert/strict');

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
copy
To deactivate the colors, use the NO_COLOR or NODE_DISABLE_COLORS environment variables. This will also deactivate the colors in the REPL. For more on color support in terminal environments, read the tty getColorDepth() documentation.
Legacy assertion mode
#
Legacy assertion mode uses the == operator in:
assert.deepEqual()
assert.equal()
assert.notDeepEqual()
assert.notEqual()
To use legacy assertion mode:
const assert = require('node:assert');
copy
Legacy assertion mode may have surprising results, especially when using assert.deepEqual():
// WARNING: This does not throw an AssertionError in legacy assertion mode!
assert.deepEqual(/a/gi, new Date());
copy
Class: assert.AssertionError
[src]
#
Extends: <errors.Error>
Indicates the failure of an assertion. All errors thrown by the node:assert module will be instances of the AssertionError class.
new assert.AssertionError(options)
#
Added in: v0.1.21
options <Object>
message <string> If provided, the error message is set to this value.
actual <any> The actual property on the error instance.
expected <any> The expected property on the error instance.
operator <string> The operator property on the error instance.
stackStartFn <Function> If provided, the generated stack trace omits frames before this function.
A subclass of <Error> that indicates the failure of an assertion.
All instances contain the built-in Error properties (message and name) and:
actual <any> Set to the actual argument for methods such as assert.strictEqual().
expected <any> Set to the expected value for methods such as assert.strictEqual().
generatedMessage <boolean> Indicates if the message was auto-generated (true) or not.
code <string> Value is always ERR_ASSERTION to show that the error is an assertion error.
operator <string> Set to the passed in operator value.
const assert = require('node:assert');

// Generate an AssertionError to compare the error message later:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Verify error output:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
copy
Class: assert.CallTracker
#
History













Stability: 0 - Deprecated
This feature is deprecated and will be removed in a future version. Please consider using alternatives such as the mock helper function.
new assert.CallTracker()
#
Added in: v14.2.0, v12.19.0
Creates a new CallTracker object which can be used to track if functions were called a specific number of times. The tracker.verify() must be called for the verification to take place. The usual pattern would be to call it in a process.on('exit') handler.
const assert = require('node:assert');
const process = require('node:process');

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() must be called exactly 1 time before tracker.verify().
const callsfunc = tracker.calls(func, 1);

callsfunc();

// Calls tracker.verify() and verifies if all tracker.calls() functions have
// been called exact times.
process.on('exit', () => {
  tracker.verify();
});
copy
tracker.calls([fn][, exact])
#
Added in: v14.2.0, v12.19.0
fn <Function> Default: A no-op function.
exact <number> Default: 1.
Returns: <Function> A function that wraps fn.
The wrapper function is expected to be called exactly exact times. If the function has not been called exactly exact times when tracker.verify() is called, then tracker.verify() will throw an error.
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func);
copy
tracker.getCalls(fn)
#
Added in: v18.8.0, v16.18.0
fn <Function>
Returns: <Array> An array with all the calls to a tracked function.
Object <Object>
thisArg <Object>
arguments <Array> the arguments passed to the tracked function
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
copy
tracker.report()
#
Added in: v14.2.0, v12.19.0
Returns: <Array> An array of objects containing information about the wrapper functions returned by tracker.calls().
Object <Object>
message <string>
actual <number> The actual number of times the function was called.
expected <number> The number of times the function was expected to be called.
operator <string> The name of the function that is wrapped.
stack <Object> A stack trace of the function.
The arrays contains information about the expected and actual number of calls of the functions that have not been called the expected number of times.
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Returns an array containing information on callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
copy
tracker.reset([fn])
#
Added in: v18.8.0, v16.18.0
fn <Function> a tracked function to reset.
Reset calls of the call tracker. If a tracked function is passed as an argument, the calls will be reset for it. If no arguments are passed, all tracked functions will be reset.
const assert = require('node:assert');

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// Tracker was called once
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
copy
tracker.verify()
#
Added in: v14.2.0, v12.19.0
Iterates through the list of functions passed to tracker.calls() and will throw an error for functions that have not been called the expected number of times.
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Will throw an error since callsfunc() was only called once.
tracker.verify();
copy
assert(value[, message])
#
Added in: v0.5.9
value <any> The input that is checked for being truthy.
message <string> | <Error>
An alias of assert.ok().
assert.deepEqual(actual, expected[, message])
#
History





















































actual <any>
expected <any>
message <string> | <Error>
Strict assertion mode
An alias of assert.deepStrictEqual().
Legacy assertion mode
Stability: 3 - Legacy: Use assert.deepStrictEqual() instead.
Tests for deep equality between the actual and expected parameters. Consider using assert.deepStrictEqual() instead. assert.deepEqual() can have surprising results.
Deep equality means that the enumerable "own" properties of child objects are also recursively evaluated by the following rules.
Comparison details
#
Primitive values are compared with the == operator, with the exception of <NaN>. It is treated as being identical in case both sides are <NaN>.
Type tags of objects should be the same.
Only enumerable "own" properties are considered.
<Error> names, messages, causes, and errors are always compared, even if these are not enumerable properties.
Object wrappers are compared both as objects and unwrapped values.
Object properties are compared unordered.
<Map> keys and <Set> items are compared unordered.
Recursion stops when both sides differ or either side encounters a circular reference.
Implementation does not test the [[Prototype]] of objects.
<Symbol> properties are not compared.
<WeakMap> and <WeakSet> comparison does not rely on their values but only on their instances.
<RegExp> lastIndex, flags, and source are always compared, even if these are not enumerable properties.
The following example does not throw an AssertionError because the primitives are compared using the == operator.
const assert = require('node:assert');
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
copy
"Deep" equality means that the enumerable "own" properties of child objects are evaluated also:
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
copy
If the values are not equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.deepStrictEqual(actual, expected[, message])
#
History

















































actual <any>
expected <any>
message <string> | <Error>
Tests for deep equality between the actual and expected parameters. "Deep" equality means that the enumerable "own" properties of child objects are recursively evaluated also by the following rules.
Comparison details
#
Primitive values are compared using Object.is().
Type tags of objects should be the same.
[[Prototype]] of objects are compared using the === operator.
Only enumerable "own" properties are considered.
<Error> names, messages, causes, and errors are always compared, even if these are not enumerable properties. errors is also compared.
Enumerable own <Symbol> properties are compared as well.
Object wrappers are compared both as objects and unwrapped values.
Object properties are compared unordered.
<Map> keys and <Set> items are compared unordered.
Recursion stops when both sides differ or either side encounters a circular reference.
<WeakMap> and <WeakSet> instances are not compared structurally. They are only equal if they reference the same object. Any comparison between different WeakMap or WeakSet instances will result in inequality, even if they contain the same entries.
<RegExp> lastIndex, flags, and source are always compared, even if these are not enumerable properties.
const assert = require('node:assert/strict');

// This fails because 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// The following objects don't have own properties
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// Different [[Prototype]]:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Different type tags:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK because Object.is(NaN, NaN) is true.

// Different unwrapped numbers:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK because the object and the string are identical when unwrapped.

assert.deepStrictEqual(-0, -0);
// OK

// Different zeros:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, because it is the same symbol on both objects.

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   Symbol(): 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap();
const obj = {};

weakMap1.set(obj, 'value');
weakMap2.set(obj, 'value');

// Comparing different instances fails, even with same contents
assert.deepStrictEqual(weakMap1, weakMap2);
// AssertionError: Values have same structure but are not reference-equal:
//
// WeakMap {
//   <items unknown>
// }

// Comparing the same instance to itself succeeds
assert.deepStrictEqual(weakMap1, weakMap1);
// OK

const weakSet1 = new WeakSet();
const weakSet2 = new WeakSet();
weakSet1.add(obj);
weakSet2.add(obj);

// Comparing different instances fails, even with same contents
assert.deepStrictEqual(weakSet1, weakSet2);
// AssertionError: Values have same structure but are not reference-equal:
// + actual - expected
//
// WeakSet {
//   <items unknown>
// }

// Comparing the same instance to itself succeeds
assert.deepStrictEqual(weakSet1, weakSet1);
// OK
copy
If the values are not equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.doesNotMatch(string, regexp[, message])
#
History













string <string>
regexp <RegExp>
message <string> | <Error>
Expects the string input not to match the regular expression.
const assert = require('node:assert/strict');

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: The input was expected to not match the ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.doesNotMatch('I will pass', /different/);
// OK
copy
If the values do match, or if the string argument is of another type than string, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.doesNotReject(asyncFn[, error][, message])
#
Added in: v10.0.0
asyncFn <Function> | <Promise>
error <RegExp> | <Function>
message <string>
Returns: <Promise>
Awaits the asyncFn promise or, if asyncFn is a function, immediately calls the function and awaits the returned promise to complete. It will then check that the promise is not rejected.
If asyncFn is a function and it throws an error synchronously, assert.doesNotReject() will return a rejected Promise with that error. If the function does not return a promise, assert.doesNotReject() will return a rejected Promise with an ERR_INVALID_RETURN_VALUE error. In both cases the error handler is skipped.
Using assert.doesNotReject() is actually not useful because there is little benefit in catching a rejection and then rejecting it again. Instead, consider adding a comment next to the specific code path that should not reject and keep error messages as expressive as possible.
If specified, error can be a Class, <RegExp> or a validation function. See assert.throws() for more details.
Besides the async nature to await the completion behaves identically to assert.doesNotThrow().
const assert = require('node:assert/strict');

(async () => {
  await assert.doesNotReject(
    async () => {
      throw new TypeError('Wrong value');
    },
    SyntaxError,
  );
})();
copy
const assert = require('node:assert/strict');

assert.doesNotReject(Promise.reject(new TypeError('Wrong value')))
  .then(() => {
    // ...
  });
copy
assert.doesNotThrow(fn[, error][, message])
#
History

















fn <Function>
error <RegExp> | <Function>
message <string>
Asserts that the function fn does not throw an error.
Using assert.doesNotThrow() is actually not useful because there is no benefit in catching an error and then rethrowing it. Instead, consider adding a comment next to the specific code path that should not throw and keep error messages as expressive as possible.
When assert.doesNotThrow() is called, it will immediately call the fn function.
If an error is thrown and it is the same type as that specified by the error parameter, then an AssertionError is thrown. If the error is of a different type, or if the error parameter is undefined, the error is propagated back to the caller.
If specified, error can be a Class, <RegExp>, or a validation function. See assert.throws() for more details.
The following, for instance, will throw the <TypeError> because there is no matching error type in the assertion:
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
copy
However, the following will result in an AssertionError with the message 'Got unwanted exception...':
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  TypeError,
);
copy
If an AssertionError is thrown and a value is provided for the message parameter, the value of message will be appended to the AssertionError message:
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  /Wrong value/,
  'Whoops',
);
// Throws: AssertionError: Got unwanted exception: Whoops
copy
assert.equal(actual, expected[, message])
#
History

















actual <any>
expected <any>
message <string> | <Error>
Strict assertion mode
An alias of assert.strictEqual().
Legacy assertion mode
Stability: 3 - Legacy: Use assert.strictEqual() instead.
Tests shallow, coercive equality between the actual and expected parameters using the == operator. NaN is specially handled and treated as being identical if both sides are NaN.
const assert = require('node:assert');

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
copy
If the values are not equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.fail([message])
#
Added in: v0.1.21
message <string> | <Error> Default: 'Failed'
Throws an AssertionError with the provided error message or a default error message. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
const assert = require('node:assert/strict');

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
copy
Using assert.fail() with more than two arguments is possible but deprecated. See below for further details.
assert.fail(actual, expected[, message[, operator[, stackStartFn]]])
#
History













Stability: 0 - Deprecated: Use assert.fail([message]) or other assert functions instead.
actual <any>
expected <any>
message <string> | <Error>
operator <string> Default: '!='
stackStartFn <Function> Default: assert.fail
If message is falsy, the error message is set as the values of actual and expected separated by the provided operator. If just the two actual and expected arguments are provided, operator will default to '!='. If message is provided as third argument it will be used as the error message and the other arguments will be stored as properties on the thrown object. If stackStartFn is provided, all stack frames above that function will be removed from stacktrace (see Error.captureStackTrace). If no arguments are given, the default message Failed will be used.
const assert = require('node:assert/strict');

assert.fail('a', 'b');
// AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, 'fail');
// AssertionError [ERR_ASSERTION]: fail

assert.fail(1, 2, 'whoops', '>');
// AssertionError [ERR_ASSERTION]: whoops

assert.fail(1, 2, new TypeError('need array'));
// TypeError: need array
copy
In the last three cases actual, expected, and operator have no influence on the error message.
Example use of stackStartFn for truncating the exception's stacktrace:
const assert = require('node:assert/strict');

function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
//     at repl:1:1
//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
//     ...
copy
assert.ifError(value)
#
History

















value <any>
Throws value if value is not undefined or null. This is useful when testing the error argument in callbacks. The stack trace contains all frames from the error passed to ifError() including the potential new frames for ifError() itself.
const assert = require('node:assert/strict');

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

// Create some random error frames.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
//     at ifErrorFrame
//     at errorFrame
copy
assert.match(string, regexp[, message])
#
History













string <string>
regexp <RegExp>
message <string> | <Error>
Expects the string input to match the regular expression.
const assert = require('node:assert/strict');

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
copy
If the values do not match, or if the string argument is of another type than string, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.notDeepEqual(actual, expected[, message])
#
History





































actual <any>
expected <any>
message <string> | <Error>
Strict assertion mode
An alias of assert.notDeepStrictEqual().
Legacy assertion mode
Stability: 3 - Legacy: Use assert.notDeepStrictEqual() instead.
Tests for any deep inequality. Opposite of assert.deepEqual().
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
copy
If the values are deeply equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.notDeepStrictEqual(actual, expected[, message])
#
History





































actual <any>
expected <any>
message <string> | <Error>
Tests for deep strict inequality. Opposite of assert.deepStrictEqual().
const assert = require('node:assert/strict');

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
copy
If the values are deeply and strictly equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.notEqual(actual, expected[, message])
#
History

















actual <any>
expected <any>
message <string> | <Error>
Strict assertion mode
An alias of assert.notStrictEqual().
Legacy assertion mode
Stability: 3 - Legacy: Use assert.notStrictEqual() instead.
Tests shallow, coercive inequality with the != operator. NaN is specially handled and treated as being identical if both sides are NaN.
const assert = require('node:assert');

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
copy
If the values are equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.notStrictEqual(actual, expected[, message])
#
History













actual <any>
expected <any>
message <string> | <Error>
Tests strict inequality between the actual and expected parameters as determined by Object.is().
const assert = require('node:assert/strict');

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to:
//
// 1

assert.notStrictEqual(1, '1');
// OK
copy
If the values are strictly equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.ok(value[, message])
#
History













value <any>
message <string> | <Error>
Tests if value is truthy. It is equivalent to assert.equal(!!value, true, message).
If value is not truthy, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError. If no arguments are passed in at all message will be set to the string: 'No value argument passed to `assert.ok()`'.
Be aware that in the repl the error message will be different to the one thrown in a file! See below for further details.
const assert = require('node:assert/strict');

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: No value argument passed to `assert.ok()`

assert.ok(false, 'it\'s false');
// AssertionError: it's false

// In the repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// In a file (e.g. test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(0)
copy
const assert = require('node:assert');

// Using `assert()` works the same:
assert(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert(0)
copy
assert.rejects(asyncFn[, error][, message])
#
Added in: v10.0.0
asyncFn <Function> | <Promise>
error <RegExp> | <Function> | <Object> | <Error>
message <string>
Returns: <Promise>
Awaits the asyncFn promise or, if asyncFn is a function, immediately calls the function and awaits the returned promise to complete. It will then check that the promise is rejected.
If asyncFn is a function and it throws an error synchronously, assert.rejects() will return a rejected Promise with that error. If the function does not return a promise, assert.rejects() will return a rejected Promise with an ERR_INVALID_RETURN_VALUE error. In both cases the error handler is skipped.
Besides the async nature to await the completion behaves identically to assert.throws().
If specified, error can be a Class, <RegExp>, a validation function, an object where each property will be tested for, or an instance of error where each property will be tested for including the non-enumerable message and name properties.
If specified, message will be the message provided by the AssertionError if the asyncFn fails to reject.
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    {
      name: 'TypeError',
      message: 'Wrong value',
    },
  );
})();
copy
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    (err) => {
      assert.strictEqual(err.name, 'TypeError');
      assert.strictEqual(err.message, 'Wrong value');
      return true;
    },
  );
})();
copy
const assert = require('node:assert/strict');

assert.rejects(
  Promise.reject(new Error('Wrong value')),
  Error,
).then(() => {
  // ...
});
copy
error cannot be a string. If a string is provided as the second argument, then error is assumed to be omitted and the string will be used for message instead. This can lead to easy-to-miss mistakes. Please read the example in assert.throws() carefully if using a string as the second argument gets considered.
assert.strictEqual(actual, expected[, message])
#
History













actual <any>
expected <any>
message <string> | <Error>
Tests strict equality between the actual and expected parameters as determined by Object.is().
const assert = require('node:assert/strict');

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// OK

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical
copy
If the values are not strictly equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.throws(fn[, error][, message])
#
History





















fn <Function>
error <RegExp> | <Function> | <Object> | <Error>
message <string>
Expects the function fn to throw an error.
If specified, error can be a Class, <RegExp>, a validation function, a validation object where each property will be tested for strict deep equality, or an instance of error where each property will be tested for strict deep equality including the non-enumerable message and name properties. When using an object, it is also possible to use a regular expression, when validating against a string property. See below for examples.
If specified, message will be appended to the message provided by the AssertionError if the fn call fails to throw or in case the error validation fails.
Custom validation object/error instance:
const assert = require('node:assert/strict');

const err = new TypeError('Wrong value');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: 'Wrong value',
    info: {
      nested: true,
      baz: 'text',
    },
    // Only properties on the validation object will be tested for.
    // Using nested objects requires all properties to be present. Otherwise
    // the validation is going to fail.
  },
);

// Using regular expressions to validate error properties:
assert.throws(
  () => {
    throw err;
  },
  {
    // The `name` and `message` properties are strings and using regular
    // expressions on those will match against the string. If they fail, an
    // error is thrown.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // It is not possible to use regular expressions for nested properties!
      baz: 'text',
    },
    // The `reg` property contains a regular expression and only if the
    // validation object contains an identical regular expression, it is going
    // to pass.
    reg: /abc/i,
  },
);

// Fails due to the different `message` and `name` properties:
assert.throws(
  () => {
    const otherErr = new Error('Not found');
    // Copy all enumerable properties from `err` to `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // The error's `message` and `name` properties will also be checked when using
  // an error as validation object.
  err,
);
copy
Validate instanceof using constructor:
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  Error,
);
copy
Validate error message using <RegExp>:
Using a regular expression runs .toString on the error object, and will therefore also include the error name.
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  /^Error: Wrong value$/,
);
copy
Custom error validation:
The function must return true to indicate all internal validations passed. It will otherwise fail with an AssertionError.
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Avoid returning anything from validation functions besides `true`.
    // Otherwise, it's not clear what part of the validation failed. Instead,
    // throw an error about the specific validation that failed (as done in this
    // example) and add as much helpful debugging information to that error as
    // possible.
    return true;
  },
  'unexpected error',
);
copy
error cannot be a string. If a string is provided as the second argument, then error is assumed to be omitted and the string will be used for message instead. This can lead to easy-to-miss mistakes. Using the same message as the thrown error message is going to result in an ERR_AMBIGUOUS_ARGUMENT error. Please read the example below carefully if using a string as the second argument gets considered:
const assert = require('node:assert/strict');

function throwingFirst() {
  throw new Error('First');
}

function throwingSecond() {
  throw new Error('Second');
}

function notThrowing() {}

// The second argument is a string and the input function threw an Error.
// The first case will not throw as it does not match for the error message
// thrown by the input function!
assert.throws(throwingFirst, 'Second');
// In the next example the message has no benefit over the message from the
// error and since it is not clear if the user intended to actually match
// against the error message, Node.js throws an `ERR_AMBIGUOUS_ARGUMENT` error.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// The string is only used (as message) in case the function does not throw:
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Missing expected exception: Second

// If it was intended to match for the error message do this instead:
// It does not throw because the error messages match.
assert.throws(throwingSecond, /Second$/);

// If the error message does not match, an AssertionError is thrown.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
copy
Due to the confusing error-prone notation, avoid a string as the second argument.
assert.partialDeepStrictEqual(actual, expected[, message])
#
History













actual <any>
expected <any>
message <string> | <Error>
Tests for partial deep equality between the actual and expected parameters. "Deep" equality means that the enumerable "own" properties of child objects are recursively evaluated also by the following rules. "Partial" equality means that only properties that exist on the expected parameter are going to be compared.
This method always passes the same test cases as assert.deepStrictEqual(), behaving as a super set of it.
Comparison details
#
Primitive values are compared using Object.is().
Type tags of objects should be the same.
[[Prototype]] of objects are not compared.
Only enumerable "own" properties are considered.
<Error> names, messages, causes, and errors are always compared, even if these are not enumerable properties. errors is also compared.
Enumerable own <Symbol> properties are compared as well.
Object wrappers are compared both as objects and unwrapped values.
Object properties are compared unordered.
<Map> keys and <Set> items are compared unordered.
Recursion stops when both sides differ or both sides encounter a circular reference.
<WeakMap> and <WeakSet> instances are not compared structurally. They are only equal if they reference the same object. Any comparison between different WeakMap or WeakSet instances will result in inequality, even if they contain the same entries.
<RegExp> lastIndex, flags, and source are always compared, even if these are not enumerable properties.
Holes in sparse arrays are ignored.
const assert = require('node:assert');

assert.partialDeepStrictEqual(
  { a: { b: { c: 1 } } },
  { a: { b: { c: 1 } } },
);
// OK

assert.partialDeepStrictEqual(
  { a: 1, b: 2, c: 3 },
  { b: 2 },
);
// OK

assert.partialDeepStrictEqual(
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 8],
);
// OK

assert.partialDeepStrictEqual(
  new Set([{ a: 1 }, { b: 1 }]),
  new Set([{ a: 1 }]),
);
// OK

assert.partialDeepStrictEqual(
  new Map([['key1', 'value1'], ['key2', 'value2']]),
  new Map([['key2', 'value2']]),
);
// OK

assert.partialDeepStrictEqual(123n, 123n);
// OK

assert.partialDeepStrictEqual(
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [5, 4, 8],
);
// AssertionError

assert.partialDeepStrictEqual(
  { a: 1 },
  { a: 1, b: 2 },
);
// AssertionError

assert.partialDeepStrictEqual(
  { a: { b: 2 } },
  { a: { b: '2' } },
);
// AssertionError
copy
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Assert
Strict assertion mode
Legacy assertion mode
Class: assert.AssertionError
new assert.AssertionError(options)
Class: assert.CallTracker
new assert.CallTracker()
tracker.calls([fn][, exact])
tracker.getCalls(fn)
tracker.report()
tracker.reset([fn])
tracker.verify()
assert(value[, message])
assert.deepEqual(actual, expected[, message])
Comparison details
assert.deepStrictEqual(actual, expected[, message])
Comparison details
assert.doesNotMatch(string, regexp[, message])
assert.doesNotReject(asyncFn[, error][, message])
assert.doesNotThrow(fn[, error][, message])
assert.equal(actual, expected[, message])
assert.fail([message])
assert.fail(actual, expected[, message[, operator[, stackStartFn]]])
assert.ifError(value)
assert.match(string, regexp[, message])
assert.notDeepEqual(actual, expected[, message])
assert.notDeepStrictEqual(actual, expected[, message])
assert.notEqual(actual, expected[, message])
assert.notStrictEqual(actual, expected[, message])
assert.ok(value[, message])
assert.rejects(asyncFn[, error][, message])
assert.strictEqual(actual, expected[, message])
assert.throws(fn[, error][, message])
assert.partialDeepStrictEqual(actual, expected[, message])
Comparison details
Assert
#
Stability: 2 - Stable
Source Code: lib/assert.js
The node:assert module provides a set of assertion functions for verifying invariants.
Strict assertion mode
#
History

























In strict assertion mode, non-strict methods behave like their corresponding strict methods. For example, assert.deepEqual() will behave like assert.deepStrictEqual().
In strict assertion mode, error messages for objects display a diff. In legacy assertion mode, error messages for objects display the objects, often truncated.
To use strict assertion mode:
const assert = require('node:assert').strict;
copy
const assert = require('node:assert/strict');
copy
Example error diff:
const assert = require('node:assert/strict');

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
copy
To deactivate the colors, use the NO_COLOR or NODE_DISABLE_COLORS environment variables. This will also deactivate the colors in the REPL. For more on color support in terminal environments, read the tty getColorDepth() documentation.
Legacy assertion mode
#
Legacy assertion mode uses the == operator in:
assert.deepEqual()
assert.equal()
assert.notDeepEqual()
assert.notEqual()
To use legacy assertion mode:
const assert = require('node:assert');
copy
Legacy assertion mode may have surprising results, especially when using assert.deepEqual():
// WARNING: This does not throw an AssertionError in legacy assertion mode!
assert.deepEqual(/a/gi, new Date());
copy
Class: assert.AssertionError
[src]
#
Extends: <errors.Error>
Indicates the failure of an assertion. All errors thrown by the node:assert module will be instances of the AssertionError class.
new assert.AssertionError(options)
#
Added in: v0.1.21
options <Object>
message <string> If provided, the error message is set to this value.
actual <any> The actual property on the error instance.
expected <any> The expected property on the error instance.
operator <string> The operator property on the error instance.
stackStartFn <Function> If provided, the generated stack trace omits frames before this function.
A subclass of <Error> that indicates the failure of an assertion.
All instances contain the built-in Error properties (message and name) and:
actual <any> Set to the actual argument for methods such as assert.strictEqual().
expected <any> Set to the expected value for methods such as assert.strictEqual().
generatedMessage <boolean> Indicates if the message was auto-generated (true) or not.
code <string> Value is always ERR_ASSERTION to show that the error is an assertion error.
operator <string> Set to the passed in operator value.
const assert = require('node:assert');

// Generate an AssertionError to compare the error message later:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Verify error output:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
copy
Class: assert.CallTracker
#
History













Stability: 0 - Deprecated
This feature is deprecated and will be removed in a future version. Please consider using alternatives such as the mock helper function.
new assert.CallTracker()
#
Added in: v14.2.0, v12.19.0
Creates a new CallTracker object which can be used to track if functions were called a specific number of times. The tracker.verify() must be called for the verification to take place. The usual pattern would be to call it in a process.on('exit') handler.
const assert = require('node:assert');
const process = require('node:process');

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() must be called exactly 1 time before tracker.verify().
const callsfunc = tracker.calls(func, 1);

callsfunc();

// Calls tracker.verify() and verifies if all tracker.calls() functions have
// been called exact times.
process.on('exit', () => {
  tracker.verify();
});
copy
tracker.calls([fn][, exact])
#
Added in: v14.2.0, v12.19.0
fn <Function> Default: A no-op function.
exact <number> Default: 1.
Returns: <Function> A function that wraps fn.
The wrapper function is expected to be called exactly exact times. If the function has not been called exactly exact times when tracker.verify() is called, then tracker.verify() will throw an error.
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func);
copy
tracker.getCalls(fn)
#
Added in: v18.8.0, v16.18.0
fn <Function>
Returns: <Array> An array with all the calls to a tracked function.
Object <Object>
thisArg <Object>
arguments <Array> the arguments passed to the tracked function
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
copy
tracker.report()
#
Added in: v14.2.0, v12.19.0
Returns: <Array> An array of objects containing information about the wrapper functions returned by tracker.calls().
Object <Object>
message <string>
actual <number> The actual number of times the function was called.
expected <number> The number of times the function was expected to be called.
operator <string> The name of the function that is wrapped.
stack <Object> A stack trace of the function.
The arrays contains information about the expected and actual number of calls of the functions that have not been called the expected number of times.
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Returns an array containing information on callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
copy
tracker.reset([fn])
#
Added in: v18.8.0, v16.18.0
fn <Function> a tracked function to reset.
Reset calls of the call tracker. If a tracked function is passed as an argument, the calls will be reset for it. If no arguments are passed, all tracked functions will be reset.
const assert = require('node:assert');

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// Tracker was called once
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
copy
tracker.verify()
#
Added in: v14.2.0, v12.19.0
Iterates through the list of functions passed to tracker.calls() and will throw an error for functions that have not been called the expected number of times.
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Will throw an error since callsfunc() was only called once.
tracker.verify();
copy
assert(value[, message])
#
Added in: v0.5.9
value <any> The input that is checked for being truthy.
message <string> | <Error>
An alias of assert.ok().
assert.deepEqual(actual, expected[, message])
#
History





















































actual <any>
expected <any>
message <string> | <Error>
Strict assertion mode
An alias of assert.deepStrictEqual().
Legacy assertion mode
Stability: 3 - Legacy: Use assert.deepStrictEqual() instead.
Tests for deep equality between the actual and expected parameters. Consider using assert.deepStrictEqual() instead. assert.deepEqual() can have surprising results.
Deep equality means that the enumerable "own" properties of child objects are also recursively evaluated by the following rules.
Comparison details
#
Primitive values are compared with the == operator, with the exception of <NaN>. It is treated as being identical in case both sides are <NaN>.
Type tags of objects should be the same.
Only enumerable "own" properties are considered.
<Error> names, messages, causes, and errors are always compared, even if these are not enumerable properties.
Object wrappers are compared both as objects and unwrapped values.
Object properties are compared unordered.
<Map> keys and <Set> items are compared unordered.
Recursion stops when both sides differ or either side encounters a circular reference.
Implementation does not test the [[Prototype]] of objects.
<Symbol> properties are not compared.
<WeakMap> and <WeakSet> comparison does not rely on their values but only on their instances.
<RegExp> lastIndex, flags, and source are always compared, even if these are not enumerable properties.
The following example does not throw an AssertionError because the primitives are compared using the == operator.
const assert = require('node:assert');
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
copy
"Deep" equality means that the enumerable "own" properties of child objects are evaluated also:
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
copy
If the values are not equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.deepStrictEqual(actual, expected[, message])
#
History

















































actual <any>
expected <any>
message <string> | <Error>
Tests for deep equality between the actual and expected parameters. "Deep" equality means that the enumerable "own" properties of child objects are recursively evaluated also by the following rules.
Comparison details
#
Primitive values are compared using Object.is().
Type tags of objects should be the same.
[[Prototype]] of objects are compared using the === operator.
Only enumerable "own" properties are considered.
<Error> names, messages, causes, and errors are always compared, even if these are not enumerable properties. errors is also compared.
Enumerable own <Symbol> properties are compared as well.
Object wrappers are compared both as objects and unwrapped values.
Object properties are compared unordered.
<Map> keys and <Set> items are compared unordered.
Recursion stops when both sides differ or either side encounters a circular reference.
<WeakMap> and <WeakSet> instances are not compared structurally. They are only equal if they reference the same object. Any comparison between different WeakMap or WeakSet instances will result in inequality, even if they contain the same entries.
<RegExp> lastIndex, flags, and source are always compared, even if these are not enumerable properties.
const assert = require('node:assert/strict');

// This fails because 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// The following objects don't have own properties
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// Different [[Prototype]]:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Different type tags:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK because Object.is(NaN, NaN) is true.

// Different unwrapped numbers:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK because the object and the string are identical when unwrapped.

assert.deepStrictEqual(-0, -0);
// OK

// Different zeros:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, because it is the same symbol on both objects.

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   Symbol(): 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap();
const obj = {};

weakMap1.set(obj, 'value');
weakMap2.set(obj, 'value');

// Comparing different instances fails, even with same contents
assert.deepStrictEqual(weakMap1, weakMap2);
// AssertionError: Values have same structure but are not reference-equal:
//
// WeakMap {
//   <items unknown>
// }

// Comparing the same instance to itself succeeds
assert.deepStrictEqual(weakMap1, weakMap1);
// OK

const weakSet1 = new WeakSet();
const weakSet2 = new WeakSet();
weakSet1.add(obj);
weakSet2.add(obj);

// Comparing different instances fails, even with same contents
assert.deepStrictEqual(weakSet1, weakSet2);
// AssertionError: Values have same structure but are not reference-equal:
// + actual - expected
//
// WeakSet {
//   <items unknown>
// }

// Comparing the same instance to itself succeeds
assert.deepStrictEqual(weakSet1, weakSet1);
// OK
copy
If the values are not equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.doesNotMatch(string, regexp[, message])
#
History













string <string>
regexp <RegExp>
message <string> | <Error>
Expects the string input not to match the regular expression.
const assert = require('node:assert/strict');

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: The input was expected to not match the ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.doesNotMatch('I will pass', /different/);
// OK
copy
If the values do match, or if the string argument is of another type than string, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.doesNotReject(asyncFn[, error][, message])
#
Added in: v10.0.0
asyncFn <Function> | <Promise>
error <RegExp> | <Function>
message <string>
Returns: <Promise>
Awaits the asyncFn promise or, if asyncFn is a function, immediately calls the function and awaits the returned promise to complete. It will then check that the promise is not rejected.
If asyncFn is a function and it throws an error synchronously, assert.doesNotReject() will return a rejected Promise with that error. If the function does not return a promise, assert.doesNotReject() will return a rejected Promise with an ERR_INVALID_RETURN_VALUE error. In both cases the error handler is skipped.
Using assert.doesNotReject() is actually not useful because there is little benefit in catching a rejection and then rejecting it again. Instead, consider adding a comment next to the specific code path that should not reject and keep error messages as expressive as possible.
If specified, error can be a Class, <RegExp> or a validation function. See assert.throws() for more details.
Besides the async nature to await the completion behaves identically to assert.doesNotThrow().
const assert = require('node:assert/strict');

(async () => {
  await assert.doesNotReject(
    async () => {
      throw new TypeError('Wrong value');
    },
    SyntaxError,
  );
})();
copy
const assert = require('node:assert/strict');

assert.doesNotReject(Promise.reject(new TypeError('Wrong value')))
  .then(() => {
    // ...
  });
copy
assert.doesNotThrow(fn[, error][, message])
#
History

















fn <Function>
error <RegExp> | <Function>
message <string>
Asserts that the function fn does not throw an error.
Using assert.doesNotThrow() is actually not useful because there is no benefit in catching an error and then rethrowing it. Instead, consider adding a comment next to the specific code path that should not throw and keep error messages as expressive as possible.
When assert.doesNotThrow() is called, it will immediately call the fn function.
If an error is thrown and it is the same type as that specified by the error parameter, then an AssertionError is thrown. If the error is of a different type, or if the error parameter is undefined, the error is propagated back to the caller.
If specified, error can be a Class, <RegExp>, or a validation function. See assert.throws() for more details.
The following, for instance, will throw the <TypeError> because there is no matching error type in the assertion:
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
copy
However, the following will result in an AssertionError with the message 'Got unwanted exception...':
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  TypeError,
);
copy
If an AssertionError is thrown and a value is provided for the message parameter, the value of message will be appended to the AssertionError message:
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  /Wrong value/,
  'Whoops',
);
// Throws: AssertionError: Got unwanted exception: Whoops
copy
assert.equal(actual, expected[, message])
#
History

















actual <any>
expected <any>
message <string> | <Error>
Strict assertion mode
An alias of assert.strictEqual().
Legacy assertion mode
Stability: 3 - Legacy: Use assert.strictEqual() instead.
Tests shallow, coercive equality between the actual and expected parameters using the == operator. NaN is specially handled and treated as being identical if both sides are NaN.
const assert = require('node:assert');

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
copy
If the values are not equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.fail([message])
#
Added in: v0.1.21
message <string> | <Error> Default: 'Failed'
Throws an AssertionError with the provided error message or a default error message. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
const assert = require('node:assert/strict');

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
copy
Using assert.fail() with more than two arguments is possible but deprecated. See below for further details.
assert.fail(actual, expected[, message[, operator[, stackStartFn]]])
#
History













Stability: 0 - Deprecated: Use assert.fail([message]) or other assert functions instead.
actual <any>
expected <any>
message <string> | <Error>
operator <string> Default: '!='
stackStartFn <Function> Default: assert.fail
If message is falsy, the error message is set as the values of actual and expected separated by the provided operator. If just the two actual and expected arguments are provided, operator will default to '!='. If message is provided as third argument it will be used as the error message and the other arguments will be stored as properties on the thrown object. If stackStartFn is provided, all stack frames above that function will be removed from stacktrace (see Error.captureStackTrace). If no arguments are given, the default message Failed will be used.
const assert = require('node:assert/strict');

assert.fail('a', 'b');
// AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, 'fail');
// AssertionError [ERR_ASSERTION]: fail

assert.fail(1, 2, 'whoops', '>');
// AssertionError [ERR_ASSERTION]: whoops

assert.fail(1, 2, new TypeError('need array'));
// TypeError: need array
copy
In the last three cases actual, expected, and operator have no influence on the error message.
Example use of stackStartFn for truncating the exception's stacktrace:
const assert = require('node:assert/strict');

function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
//     at repl:1:1
//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
//     ...
copy
assert.ifError(value)
#
History

















value <any>
Throws value if value is not undefined or null. This is useful when testing the error argument in callbacks. The stack trace contains all frames from the error passed to ifError() including the potential new frames for ifError() itself.
const assert = require('node:assert/strict');

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

// Create some random error frames.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
//     at ifErrorFrame
//     at errorFrame
copy
assert.match(string, regexp[, message])
#
History













string <string>
regexp <RegExp>
message <string> | <Error>
Expects the string input to match the regular expression.
const assert = require('node:assert/strict');

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
copy
If the values do not match, or if the string argument is of another type than string, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.notDeepEqual(actual, expected[, message])
#
History





































actual <any>
expected <any>
message <string> | <Error>
Strict assertion mode
An alias of assert.notDeepStrictEqual().
Legacy assertion mode
Stability: 3 - Legacy: Use assert.notDeepStrictEqual() instead.
Tests for any deep inequality. Opposite of assert.deepEqual().
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
copy
If the values are deeply equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.notDeepStrictEqual(actual, expected[, message])
#
History





































actual <any>
expected <any>
message <string> | <Error>
Tests for deep strict inequality. Opposite of assert.deepStrictEqual().
const assert = require('node:assert/strict');

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
copy
If the values are deeply and strictly equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.notEqual(actual, expected[, message])
#
History

















actual <any>
expected <any>
message <string> | <Error>
Strict assertion mode
An alias of assert.notStrictEqual().
Legacy assertion mode
Stability: 3 - Legacy: Use assert.notStrictEqual() instead.
Tests shallow, coercive inequality with the != operator. NaN is specially handled and treated as being identical if both sides are NaN.
const assert = require('node:assert');

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
copy
If the values are equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.notStrictEqual(actual, expected[, message])
#
History













actual <any>
expected <any>
message <string> | <Error>
Tests strict inequality between the actual and expected parameters as determined by Object.is().
const assert = require('node:assert/strict');

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to:
//
// 1

assert.notStrictEqual(1, '1');
// OK
copy
If the values are strictly equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.ok(value[, message])
#
History













value <any>
message <string> | <Error>
Tests if value is truthy. It is equivalent to assert.equal(!!value, true, message).
If value is not truthy, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError. If no arguments are passed in at all message will be set to the string: 'No value argument passed to `assert.ok()`'.
Be aware that in the repl the error message will be different to the one thrown in a file! See below for further details.
const assert = require('node:assert/strict');

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: No value argument passed to `assert.ok()`

assert.ok(false, 'it\'s false');
// AssertionError: it's false

// In the repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// In a file (e.g. test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(0)
copy
const assert = require('node:assert');

// Using `assert()` works the same:
assert(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert(0)
copy
assert.rejects(asyncFn[, error][, message])
#
Added in: v10.0.0
asyncFn <Function> | <Promise>
error <RegExp> | <Function> | <Object> | <Error>
message <string>
Returns: <Promise>
Awaits the asyncFn promise or, if asyncFn is a function, immediately calls the function and awaits the returned promise to complete. It will then check that the promise is rejected.
If asyncFn is a function and it throws an error synchronously, assert.rejects() will return a rejected Promise with that error. If the function does not return a promise, assert.rejects() will return a rejected Promise with an ERR_INVALID_RETURN_VALUE error. In both cases the error handler is skipped.
Besides the async nature to await the completion behaves identically to assert.throws().
If specified, error can be a Class, <RegExp>, a validation function, an object where each property will be tested for, or an instance of error where each property will be tested for including the non-enumerable message and name properties.
If specified, message will be the message provided by the AssertionError if the asyncFn fails to reject.
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    {
      name: 'TypeError',
      message: 'Wrong value',
    },
  );
})();
copy
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    (err) => {
      assert.strictEqual(err.name, 'TypeError');
      assert.strictEqual(err.message, 'Wrong value');
      return true;
    },
  );
})();
copy
const assert = require('node:assert/strict');

assert.rejects(
  Promise.reject(new Error('Wrong value')),
  Error,
).then(() => {
  // ...
});
copy
error cannot be a string. If a string is provided as the second argument, then error is assumed to be omitted and the string will be used for message instead. This can lead to easy-to-miss mistakes. Please read the example in assert.throws() carefully if using a string as the second argument gets considered.
assert.strictEqual(actual, expected[, message])
#
History













actual <any>
expected <any>
message <string> | <Error>
Tests strict equality between the actual and expected parameters as determined by Object.is().
const assert = require('node:assert/strict');

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// OK

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical
copy
If the values are not strictly equal, an AssertionError is thrown with a message property set equal to the value of the message parameter. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of <Error> then it will be thrown instead of the AssertionError.
assert.throws(fn[, error][, message])
#
History





















fn <Function>
error <RegExp> | <Function> | <Object> | <Error>
message <string>
Expects the function fn to throw an error.
If specified, error can be a Class, <RegExp>, a validation function, a validation object where each property will be tested for strict deep equality, or an instance of error where each property will be tested for strict deep equality including the non-enumerable message and name properties. When using an object, it is also possible to use a regular expression, when validating against a string property. See below for examples.
If specified, message will be appended to the message provided by the AssertionError if the fn call fails to throw or in case the error validation fails.
Custom validation object/error instance:
const assert = require('node:assert/strict');

const err = new TypeError('Wrong value');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: 'Wrong value',
    info: {
      nested: true,
      baz: 'text',
    },
    // Only properties on the validation object will be tested for.
    // Using nested objects requires all properties to be present. Otherwise
    // the validation is going to fail.
  },
);

// Using regular expressions to validate error properties:
assert.throws(
  () => {
    throw err;
  },
  {
    // The `name` and `message` properties are strings and using regular
    // expressions on those will match against the string. If they fail, an
    // error is thrown.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // It is not possible to use regular expressions for nested properties!
      baz: 'text',
    },
    // The `reg` property contains a regular expression and only if the
    // validation object contains an identical regular expression, it is going
    // to pass.
    reg: /abc/i,
  },
);

// Fails due to the different `message` and `name` properties:
assert.throws(
  () => {
    const otherErr = new Error('Not found');
    // Copy all enumerable properties from `err` to `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // The error's `message` and `name` properties will also be checked when using
  // an error as validation object.
  err,
);
copy
Validate instanceof using constructor:
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  Error,
);
copy
Validate error message using <RegExp>:
Using a regular expression runs .toString on the error object, and will therefore also include the error name.
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  /^Error: Wrong value$/,
);
copy
Custom error validation:
The function must return true to indicate all internal validations passed. It will otherwise fail with an AssertionError.
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Avoid returning anything from validation functions besides `true`.
    // Otherwise, it's not clear what part of the validation failed. Instead,
    // throw an error about the specific validation that failed (as done in this
    // example) and add as much helpful debugging information to that error as
    // possible.
    return true;
  },
  'unexpected error',
);
copy
error cannot be a string. If a string is provided as the second argument, then error is assumed to be omitted and the string will be used for message instead. This can lead to easy-to-miss mistakes. Using the same message as the thrown error message is going to result in an ERR_AMBIGUOUS_ARGUMENT error. Please read the example below carefully if using a string as the second argument gets considered:
const assert = require('node:assert/strict');

function throwingFirst() {
  throw new Error('First');
}

function throwingSecond() {
  throw new Error('Second');
}

function notThrowing() {}

// The second argument is a string and the input function threw an Error.
// The first case will not throw as it does not match for the error message
// thrown by the input function!
assert.throws(throwingFirst, 'Second');
// In the next example the message has no benefit over the message from the
// error and since it is not clear if the user intended to actually match
// against the error message, Node.js throws an `ERR_AMBIGUOUS_ARGUMENT` error.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// The string is only used (as message) in case the function does not throw:
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Missing expected exception: Second

// If it was intended to match for the error message do this instead:
// It does not throw because the error messages match.
assert.throws(throwingSecond, /Second$/);

// If the error message does not match, an AssertionError is thrown.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
copy
Due to the confusing error-prone notation, avoid a string as the second argument.
assert.partialDeepStrictEqual(actual, expected[, message])
#
History













actual <any>
expected <any>
message <string> | <Error>
Tests for partial deep equality between the actual and expected parameters. "Deep" equality means that the enumerable "own" properties of child objects are recursively evaluated also by the following rules. "Partial" equality means that only properties that exist on the expected parameter are going to be compared.
This method always passes the same test cases as assert.deepStrictEqual(), behaving as a super set of it.
Comparison details
#
Primitive values are compared using Object.is().
Type tags of objects should be the same.
[[Prototype]] of objects are not compared.
Only enumerable "own" properties are considered.
<Error> names, messages, causes, and errors are always compared, even if these are not enumerable properties. errors is also compared.
Enumerable own <Symbol> properties are compared as well.
Object wrappers are compared both as objects and unwrapped values.
Object properties are compared unordered.
<Map> keys and <Set> items are compared unordered.
Recursion stops when both sides differ or both sides encounter a circular reference.
<WeakMap> and <WeakSet> instances are not compared structurally. They are only equal if they reference the same object. Any comparison between different WeakMap or WeakSet instances will result in inequality, even if they contain the same entries.
<RegExp> lastIndex, flags, and source are always compared, even if these are not enumerable properties.
Holes in sparse arrays are ignored.
const assert = require('node:assert');

assert.partialDeepStrictEqual(
  { a: { b: { c: 1 } } },
  { a: { b: { c: 1 } } },
);
// OK

assert.partialDeepStrictEqual(
  { a: 1, b: 2, c: 3 },
  { b: 2 },
);
// OK

assert.partialDeepStrictEqual(
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 8],
);
// OK

assert.partialDeepStrictEqual(
  new Set([{ a: 1 }, { b: 1 }]),
  new Set([{ a: 1 }]),
);
// OK

assert.partialDeepStrictEqual(
  new Map([['key1', 'value1'], ['key2', 'value2']]),
  new Map([['key2', 'value2']]),
);
// OK

assert.partialDeepStrictEqual(123n, 123n);
// OK

assert.partialDeepStrictEqual(
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [5, 4, 8],
);
// AssertionError

assert.partialDeepStrictEqual(
  { a: 1 },
  { a: 1, b: 2 },
);
// AssertionError

assert.partialDeepStrictEqual(
  { a: { b: 2 } },
  { a: { b: '2' } },
);
// AssertionError
copy
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Asynchronous context tracking
Introduction
Class: AsyncLocalStorage
new AsyncLocalStorage([options])
Static method: AsyncLocalStorage.bind(fn)
Static method: AsyncLocalStorage.snapshot()
asyncLocalStorage.disable()
asyncLocalStorage.getStore()
asyncLocalStorage.enterWith(store)
asyncLocalStorage.name
asyncLocalStorage.run(store, callback[, ...args])
asyncLocalStorage.exit(callback[, ...args])
Usage with async/await
Troubleshooting: Context loss
Class: AsyncResource
new AsyncResource(type[, options])
Static method: AsyncResource.bind(fn[, type[, thisArg]])
asyncResource.bind(fn[, thisArg])
asyncResource.runInAsyncScope(fn[, thisArg, ...args])
asyncResource.emitDestroy()
asyncResource.asyncId()
asyncResource.triggerAsyncId()
Using AsyncResource for a Worker thread pool
Integrating AsyncResource with EventEmitter
Asynchronous context tracking
#
Stability: 2 - Stable
Source Code: lib/async_hooks.js
Introduction
#
These classes are used to associate state and propagate it throughout callbacks and promise chains. They allow storing data throughout the lifetime of a web request or any other asynchronous duration. It is similar to thread-local storage in other languages.
The AsyncLocalStorage and AsyncResource classes are part of the node:async_hooks module:
const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks');
copy
Class: AsyncLocalStorage
#
History













This class creates stores that stay coherent through asynchronous operations.
While you can create your own implementation on top of the node:async_hooks module, AsyncLocalStorage should be preferred as it is a performant and memory safe implementation that involves significant optimizations that are non-obvious to implement.
The following example uses AsyncLocalStorage to build a simple logger that assigns IDs to incoming HTTP requests and includes them in messages logged within each request.
const http = require('node:http');
const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // Imagine any chain of async operations here
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
//   0: start
//   0: finish
//   1: start
//   1: finish
copy
Each instance of AsyncLocalStorage maintains an independent storage context. Multiple instances can safely exist simultaneously without risk of interfering with each other's data.
new AsyncLocalStorage([options])
#
History





















options <Object>
defaultValue <any> The default value to be used when no store is provided.
name <string> A name for the AsyncLocalStorage value.
Creates a new instance of AsyncLocalStorage. Store is only provided within a run() call or after an enterWith() call.
Static method: AsyncLocalStorage.bind(fn)
#
History













fn <Function> The function to bind to the current execution context.
Returns: <Function> A new function that calls fn within the captured execution context.
Binds the given function to the current execution context.
Static method: AsyncLocalStorage.snapshot()
#
History













Returns: <Function> A new function with the signature (fn: (...args) : R, ...args) : R.
Captures the current execution context and returns a function that accepts a function as an argument. Whenever the returned function is called, it calls the function passed to it within the captured context.
const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run(123, () => AsyncLocalStorage.snapshot());
const result = asyncLocalStorage.run(321, () => runInAsyncScope(() => asyncLocalStorage.getStore()));
console.log(result);  // returns 123
copy
AsyncLocalStorage.snapshot() can replace the use of AsyncResource for simple async context tracking purposes, for example:
class Foo {
  #runInAsyncScope = AsyncLocalStorage.snapshot();

  get() { return this.#runInAsyncScope(() => asyncLocalStorage.getStore()); }
}

const foo = asyncLocalStorage.run(123, () => new Foo());
console.log(asyncLocalStorage.run(321, () => foo.get())); // returns 123
copy
asyncLocalStorage.disable()
#
Added in: v13.10.0, v12.17.0
Stability: 1 - Experimental
Disables the instance of AsyncLocalStorage. All subsequent calls to asyncLocalStorage.getStore() will return undefined until asyncLocalStorage.run() or asyncLocalStorage.enterWith() is called again.
When calling asyncLocalStorage.disable(), all current contexts linked to the instance will be exited.
Calling asyncLocalStorage.disable() is required before the asyncLocalStorage can be garbage collected. This does not apply to stores provided by the asyncLocalStorage, as those objects are garbage collected along with the corresponding async resources.
Use this method when the asyncLocalStorage is not in use anymore in the current process.
asyncLocalStorage.getStore()
#
Added in: v13.10.0, v12.17.0
Returns: <any>
Returns the current store. If called outside of an asynchronous context initialized by calling asyncLocalStorage.run() or asyncLocalStorage.enterWith(), it returns undefined.
asyncLocalStorage.enterWith(store)
#
Added in: v13.11.0, v12.17.0
Stability: 1 - Experimental
store <any>
Transitions into the context for the remainder of the current synchronous execution and then persists the store through any following asynchronous calls.
Example:
const store = { id: 1 };
// Replaces previous store with the given store object
asyncLocalStorage.enterWith(store);
asyncLocalStorage.getStore(); // Returns the store object
someAsyncOperation(() => {
  asyncLocalStorage.getStore(); // Returns the same object
});
copy
This transition will continue for the entire synchronous execution. This means that if, for example, the context is entered within an event handler subsequent event handlers will also run within that context unless specifically bound to another context with an AsyncResource. That is why run() should be preferred over enterWith() unless there are strong reasons to use the latter method.
const store = { id: 1 };

emitter.on('my-event', () => {
  asyncLocalStorage.enterWith(store);
});
emitter.on('my-event', () => {
  asyncLocalStorage.getStore(); // Returns the same object
});

asyncLocalStorage.getStore(); // Returns undefined
emitter.emit('my-event');
asyncLocalStorage.getStore(); // Returns the same object
copy
asyncLocalStorage.name
#
Added in: v24.0.0
<string>
The name of the AsyncLocalStorage instance if provided.
asyncLocalStorage.run(store, callback[, ...args])
#
Added in: v13.10.0, v12.17.0
store <any>
callback <Function>
...args <any>
Runs a function synchronously within a context and returns its return value. The store is not accessible outside of the callback function. The store is accessible to any asynchronous operations created within the callback.
The optional args are passed to the callback function.
If the callback function throws an error, the error is thrown by run() too. The stacktrace is not impacted by this call and the context is exited.
Example:
const store = { id: 2 };
try {
  asyncLocalStorage.run(store, () => {
    asyncLocalStorage.getStore(); // Returns the store object
    setTimeout(() => {
      asyncLocalStorage.getStore(); // Returns the store object
    }, 200);
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Returns undefined
  // The error will be caught here
}
copy
asyncLocalStorage.exit(callback[, ...args])
#
Added in: v13.10.0, v12.17.0
Stability: 1 - Experimental
callback <Function>
...args <any>
Runs a function synchronously outside of a context and returns its return value. The store is not accessible within the callback function or the asynchronous operations created within the callback. Any getStore() call done within the callback function will always return undefined.
The optional args are passed to the callback function.
If the callback function throws an error, the error is thrown by exit() too. The stacktrace is not impacted by this call and the context is re-entered.
Example:
// Within a call to run
try {
  asyncLocalStorage.getStore(); // Returns the store object or value
  asyncLocalStorage.exit(() => {
    asyncLocalStorage.getStore(); // Returns undefined
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Returns the same object or value
  // The error will be caught here
}
copy
Usage with async/await
#
If, within an async function, only one await call is to run within a context, the following pattern should be used:
async function fn() {
  await asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set('key', value);
    return foo(); // The return value of foo will be awaited
  });
}
copy
In this example, the store is only available in the callback function and the functions called by foo. Outside of run, calling getStore will return undefined.
Troubleshooting: Context loss
#
In most cases, AsyncLocalStorage works without issues. In rare situations, the current store is lost in one of the asynchronous operations.
If your code is callback-based, it is enough to promisify it with util.promisify() so it starts working with native promises.
If you need to use a callback-based API or your code assumes a custom thenable implementation, use the AsyncResource class to associate the asynchronous operation with the correct execution context. Find the function call responsible for the context loss by logging the content of asyncLocalStorage.getStore() after the calls you suspect are responsible for the loss. When the code logs undefined, the last callback called is probably responsible for the context loss.
Class: AsyncResource
#
History









The class AsyncResource is designed to be extended by the embedder's async resources. Using this, users can easily trigger the lifetime events of their own resources.
The init hook will trigger when an AsyncResource is instantiated.
The following is an overview of the AsyncResource API.
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

// AsyncResource() is meant to be extended. Instantiating a
// new AsyncResource() also triggers init. If triggerAsyncId is omitted then
// async_hook.executionAsyncId() is used.
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Run a function in the execution context of the resource. This will
// * establish the context of the resource
// * trigger the AsyncHooks before callbacks
// * call the provided function `fn` with the supplied arguments
// * trigger the AsyncHooks after callbacks
// * restore the original execution context
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Call AsyncHooks destroy callbacks.
asyncResource.emitDestroy();

// Return the unique ID assigned to the AsyncResource instance.
asyncResource.asyncId();

// Return the trigger ID for the AsyncResource instance.
asyncResource.triggerAsyncId();
copy
new AsyncResource(type[, options])
#
type <string> The type of async event.
options <Object>
triggerAsyncId <number> The ID of the execution context that created this async event. Default: executionAsyncId().
requireManualDestroy <boolean> If set to true, disables emitDestroy when the object is garbage collected. This usually does not need to be set (even if emitDestroy is called manually), unless the resource's asyncId is retrieved and the sensitive API's emitDestroy is called with it. When set to false, the emitDestroy call on garbage collection will only take place if there is at least one active destroy hook. Default: false.
Example usage:
class DBQuery extends AsyncResource {
  constructor(db) {
    super('DBQuery');
    this.db = db;
  }

  getInfo(query, callback) {
    this.db.get(query, (err, data) => {
      this.runInAsyncScope(callback, null, err, data);
    });
  }

  close() {
    this.db = null;
    this.emitDestroy();
  }
}
copy
Static method: AsyncResource.bind(fn[, type[, thisArg]])
#
History





















fn <Function> The function to bind to the current execution context.
type <string> An optional name to associate with the underlying AsyncResource.
thisArg <any>
Binds the given function to the current execution context.
asyncResource.bind(fn[, thisArg])
#
History





















fn <Function> The function to bind to the current AsyncResource.
thisArg <any>
Binds the given function to execute to this AsyncResource's scope.
asyncResource.runInAsyncScope(fn[, thisArg, ...args])
#
Added in: v9.6.0
fn <Function> The function to call in the execution context of this async resource.
thisArg <any> The receiver to be used for the function call.
...args <any> Optional arguments to pass to the function.
Call the provided function with the provided arguments in the execution context of the async resource. This will establish the context, trigger the AsyncHooks before callbacks, call the function, trigger the AsyncHooks after callbacks, and then restore the original execution context.
asyncResource.emitDestroy()
#
Returns: <AsyncResource> A reference to asyncResource.
Call all destroy hooks. This should only ever be called once. An error will be thrown if it is called more than once. This must be manually called. If the resource is left to be collected by the GC then the destroy hooks will never be called.
asyncResource.asyncId()
#
Returns: <number> The unique asyncId assigned to the resource.
asyncResource.triggerAsyncId()
#
Returns: <number> The same triggerAsyncId that is passed to the AsyncResource constructor.
Using AsyncResource for a Worker thread pool
#
The following example shows how to use the AsyncResource class to properly provide async tracking for a Worker pool. Other resource pools, such as database connection pools, can follow a similar model.
Assuming that the task is adding two numbers, using a file named task_processor.js with the following content:
const { parentPort } = require('node:worker_threads');
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
copy
a Worker pool around it could use the following structure:
const { AsyncResource } = require('node:async_hooks');
const { EventEmitter } = require('node:events');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s are used only once.
  }
}

class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(path.resolve(__dirname, 'task_processor.js'));
    worker.on('message', (result) => {
      // In case of success: Call the callback that was passed to `runTask`,
      // remove the `TaskInfo` associated with the Worker, and mark it as free
      // again.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // In case of an uncaught exception: Call the callback that was passed to
      // `runTask` with the error.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Remove the worker from the list and start a new Worker to replace the
      // current one.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}

module.exports = WorkerPool;
copy
Without the explicit tracking added by the WorkerPoolTaskInfo objects, it would appear that the callbacks are associated with the individual Worker objects. However, the creation of the Workers is not associated with the creation of the tasks and does not provide information about when tasks were scheduled.
This pool could be used as follows:
const WorkerPool = require('./worker_pool.js');
const os = require('node:os');

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
copy
Integrating AsyncResource with EventEmitter
#
Event listeners triggered by an EventEmitter may be run in a different execution context than the one that was active when eventEmitter.on() was called.
The following example shows how to use the AsyncResource class to properly associate an event listener with the correct execution context. The same approach can be applied to a Stream or a similar event-driven class.
const { createServer } = require('node:http');
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Execution context is bound to the current outer scope.
  }));
  req.on('close', () => {
    // Execution context is bound to the scope that caused 'close' to emit.
  });
  res.end();
}).listen(3000);
copy
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Async hooks
Terminology
Overview
async_hooks.createHook(callbacks)
Error handling
Printing in AsyncHook callbacks
Class: AsyncHook
asyncHook.enable()
asyncHook.disable()
Hook callbacks
init(asyncId, type, triggerAsyncId, resource)
type
triggerAsyncId
resource
Asynchronous context example
before(asyncId)
after(asyncId)
destroy(asyncId)
promiseResolve(asyncId)
async_hooks.executionAsyncResource()
async_hooks.executionAsyncId()
async_hooks.triggerAsyncId()
async_hooks.asyncWrapProviders
Promise execution tracking
JavaScript embedder API
Class: AsyncResource
Class: AsyncLocalStorage
Async hooks
#
Stability: 1 - Experimental. Please migrate away from this API, if you can. We do not recommend using the createHook, AsyncHook, and executionAsyncResource APIs as they have usability issues, safety risks, and performance implications. Async context tracking use cases are better served by the stable AsyncLocalStorage API. If you have a use case for createHook, AsyncHook, or executionAsyncResource beyond the context tracking need solved by AsyncLocalStorage or diagnostics data currently provided by Diagnostics Channel, please open an issue at https://github.com/nodejs/node/issues describing your use case so we can create a more purpose-focused API.
Source Code: lib/async_hooks.js
We strongly discourage the use of the async_hooks API. Other APIs that can cover most of its use cases include:
AsyncLocalStorage tracks async context
process.getActiveResourcesInfo() tracks active resources
The node:async_hooks module provides an API to track asynchronous resources. It can be accessed using:
const async_hooks = require('node:async_hooks');
copy
Terminology
#
An asynchronous resource represents an object with an associated callback. This callback may be called multiple times, such as the 'connection' event in net.createServer(), or just a single time like in fs.open(). A resource can also be closed before the callback is called. AsyncHook does not explicitly distinguish between these different cases but will represent them as the abstract concept that is a resource.
If Workers are used, each thread has an independent async_hooks interface, and each thread will use a new set of async IDs.
Overview
#
Following is a simple overview of the public API.
const async_hooks = require('node:async_hooks');

// Return the ID of the current execution context.
const eid = async_hooks.executionAsyncId();

// Return the ID of the handle responsible for triggering the callback of the
// current execution scope to call.
const tid = async_hooks.triggerAsyncId();

// Create a new AsyncHook instance. All of these callbacks are optional.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Allow callbacks of this AsyncHook instance to call. This is not an implicit
// action after running the constructor, and must be explicitly run to begin
// executing callbacks.
asyncHook.enable();

// Disable listening for new asynchronous events.
asyncHook.disable();

//
// The following are the callbacks that can be passed to createHook().
//

// init() is called during object construction. The resource may not have
// completed construction when this callback runs. Therefore, all fields of the
// resource referenced by "asyncId" may not have been populated.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() is called just before the resource's callback is called. It can be
// called 0-N times for handles (such as TCPWrap), and will be called exactly 1
// time for requests (such as FSReqCallback).
function before(asyncId) { }

// after() is called just after the resource's callback has finished.
function after(asyncId) { }

// destroy() is called when the resource is destroyed.
function destroy(asyncId) { }

// promiseResolve() is called only for promise resources, when the
// resolve() function passed to the Promise constructor is invoked
// (either directly or through other means of resolving a promise).
function promiseResolve(asyncId) { }
copy
async_hooks.createHook(callbacks)
#
Added in: v8.1.0
callbacks <Object> The Hook Callbacks to register
init <Function> The init callback.
before <Function> The before callback.
after <Function> The after callback.
destroy <Function> The destroy callback.
promiseResolve <Function> The promiseResolve callback.
Returns: <AsyncHook> Instance used for disabling and enabling hooks
Registers functions to be called for different lifetime events of each async operation.
The callbacks init()/before()/after()/destroy() are called for the respective asynchronous event during a resource's lifetime.
All callbacks are optional. For example, if only resource cleanup needs to be tracked, then only the destroy callback needs to be passed. The specifics of all functions that can be passed to callbacks is in the Hook Callbacks section.
const async_hooks = require('node:async_hooks');

const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
copy
The callbacks will be inherited via the prototype chain:
class MyAsyncCallbacks {
  init(asyncId, type, triggerAsyncId, resource) { }
  destroy(asyncId) {}
}

class MyAddedCallbacks extends MyAsyncCallbacks {
  before(asyncId) { }
  after(asyncId) { }
}

const asyncHook = async_hooks.createHook(new MyAddedCallbacks());
copy
Because promises are asynchronous resources whose lifecycle is tracked via the async hooks mechanism, the init(), before(), after(), and destroy() callbacks must not be async functions that return promises.
Error handling
#
If any AsyncHook callbacks throw, the application will print the stack trace and exit. The exit path does follow that of an uncaught exception, but all 'uncaughtException' listeners are removed, thus forcing the process to exit. The 'exit' callbacks will still be called unless the application is run with --abort-on-uncaught-exception, in which case a stack trace will be printed and the application exits, leaving a core file.
The reason for this error handling behavior is that these callbacks are running at potentially volatile points in an object's lifetime, for example during class construction and destruction. Because of this, it is deemed necessary to bring down the process quickly in order to prevent an unintentional abort in the future. This is subject to change in the future if a comprehensive analysis is performed to ensure an exception can follow the normal control flow without unintentional side effects.
Printing in AsyncHook callbacks
#
Because printing to the console is an asynchronous operation, console.log() will cause AsyncHook callbacks to be called. Using console.log() or similar asynchronous operations inside an AsyncHook callback function will cause an infinite recursion. An easy solution to this when debugging is to use a synchronous logging operation such as fs.writeFileSync(file, msg, flag). This will print to the file and will not invoke AsyncHook recursively because it is synchronous.
const fs = require('node:fs');
const util = require('node:util');

function debug(...args) {
  // Use a function like this one when debugging inside an AsyncHook callback
  fs.writeFileSync('log.out', `${util.format(...args)}\n`, { flag: 'a' });
}
copy
If an asynchronous operation is needed for logging, it is possible to keep track of what caused the asynchronous operation using the information provided by AsyncHook itself. The logging should then be skipped when it was the logging itself that caused the AsyncHook callback to be called. By doing this, the otherwise infinite recursion is broken.
Class: AsyncHook
#
The class AsyncHook exposes an interface for tracking lifetime events of asynchronous operations.
asyncHook.enable()
#
Returns: <AsyncHook> A reference to asyncHook.
Enable the callbacks for a given AsyncHook instance. If no callbacks are provided, enabling is a no-op.
The AsyncHook instance is disabled by default. If the AsyncHook instance should be enabled immediately after creation, the following pattern can be used.
const async_hooks = require('node:async_hooks');

const hook = async_hooks.createHook(callbacks).enable();
copy
asyncHook.disable()
#
Returns: <AsyncHook> A reference to asyncHook.
Disable the callbacks for a given AsyncHook instance from the global pool of AsyncHook callbacks to be executed. Once a hook has been disabled it will not be called again until enabled.
For API consistency disable() also returns the AsyncHook instance.
Hook callbacks
#
Key events in the lifetime of asynchronous events have been categorized into four areas: instantiation, before/after the callback is called, and when the instance is destroyed.
init(asyncId, type, triggerAsyncId, resource)
#
asyncId <number> A unique ID for the async resource.
type <string> The type of the async resource.
triggerAsyncId <number> The unique ID of the async resource in whose execution context this async resource was created.
resource <Object> Reference to the resource representing the async operation, needs to be released during destroy.
Called when a class is constructed that has the possibility to emit an asynchronous event. This does not mean the instance must call before/after before destroy is called, only that the possibility exists.
This behavior can be observed by doing something like opening a resource then closing it before the resource can be used. The following snippet demonstrates this.
require('node:net').createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
copy
Every new resource is assigned an ID that is unique within the scope of the current Node.js instance.
type
#
The type is a string identifying the type of resource that caused init to be called. Generally, it will correspond to the name of the resource's constructor.
The type of resources created by Node.js itself can change in any Node.js release. Valid values include TLSWRAP, TCPWRAP, TCPSERVERWRAP, GETADDRINFOREQWRAP, FSREQCALLBACK, Microtask, and Timeout. Inspect the source code of the Node.js version used to get the full list.
Furthermore users of AsyncResource create async resources independent of Node.js itself.
There is also the PROMISE resource type, which is used to track Promise instances and asynchronous work scheduled by them.
Users are able to define their own type when using the public embedder API.
It is possible to have type name collisions. Embedders are encouraged to use unique prefixes, such as the npm package name, to prevent collisions when listening to the hooks.
triggerAsyncId
#
triggerAsyncId is the asyncId of the resource that caused (or "triggered") the new resource to initialize and that caused init to call. This is different from async_hooks.executionAsyncId() that only shows when a resource was created, while triggerAsyncId shows why a resource was created.
The following is a simple demonstration of triggerAsyncId:
const { createHook, executionAsyncId } = require('node:async_hooks');
const { stdout } = require('node:process');
const net = require('node:net');
const fs = require('node:fs');

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
copy
Output when hitting the server with nc localhost 8080:
TCPSERVERWRAP(5): trigger: 1 execution: 1
TCPWRAP(7): trigger: 5 execution: 0
copy
The TCPSERVERWRAP is the server which receives the connections.
The TCPWRAP is the new connection from the client. When a new connection is made, the TCPWrap instance is immediately constructed. This happens outside of any JavaScript stack. (An executionAsyncId() of 0 means that it is being executed from C++ with no JavaScript stack above it.) With only that information, it would be impossible to link resources together in terms of what caused them to be created, so triggerAsyncId is given the task of propagating what resource is responsible for the new resource's existence.
resource
#
resource is an object that represents the actual async resource that has been initialized. The API to access the object may be specified by the creator of the resource. Resources created by Node.js itself are internal and may change at any time. Therefore no API is specified for these.
In some cases the resource object is reused for performance reasons, it is thus not safe to use it as a key in a WeakMap or add properties to it.
Asynchronous context example
#
The context tracking use case is covered by the stable API AsyncLocalStorage. This example only illustrates async hooks operation but AsyncLocalStorage fits better to this use case.
The following is an example with additional information about the calls to init between the before and after calls, specifically what the callback to listen() will look like. The output formatting is slightly more elaborate to make calling context easier to see.
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');
const net = require('node:net');
const { fd } = process.stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
copy
Output from only starting the server:
TCPSERVERWRAP(5): trigger: 1 execution: 1
TickObject(6): trigger: 5 execution: 1
before:  6
  Timeout(7): trigger: 6 execution: 6
after:   6
destroy: 6
before:  7
>>> 7
  TickObject(8): trigger: 7 execution: 7
after:   7
before:  8
after:   8
copy
As illustrated in the example, executionAsyncId() and execution each specify the value of the current execution context; which is delineated by calls to before and after.
Only using execution to graph resource allocation results in the following:
 root(1)
     ^
     |
TickObject(6)
     ^
     |
 Timeout(7)
copy
The TCPSERVERWRAP is not part of this graph, even though it was the reason for console.log() being called. This is because binding to a port without a host name is a synchronous operation, but to maintain a completely asynchronous API the user's callback is placed in a process.nextTick(). Which is why TickObject is present in the output and is a 'parent' for .listen() callback.
The graph only shows when a resource was created, not why, so to track the why use triggerAsyncId. Which can be represented with the following graph:
bootstrap(1)
     |
     ˅
TCPSERVERWRAP(5)
     |
     ˅
 TickObject(6)
     |
     ˅
  Timeout(7)
copy
before(asyncId)
#
asyncId <number>
When an asynchronous operation is initiated (such as a TCP server receiving a new connection) or completes (such as writing data to disk) a callback is called to notify the user. The before callback is called just before said callback is executed. asyncId is the unique identifier assigned to the resource about to execute the callback.
The before callback will be called 0 to N times. The before callback will typically be called 0 times if the asynchronous operation was cancelled or, for example, if no connections are received by a TCP server. Persistent asynchronous resources like a TCP server will typically call the before callback multiple times, while other operations like fs.open() will call it only once.
after(asyncId)
#
asyncId <number>
Called immediately after the callback specified in before is completed.
If an uncaught exception occurs during execution of the callback, then after will run after the 'uncaughtException' event is emitted or a domain's handler runs.
destroy(asyncId)
#
asyncId <number>
Called after the resource corresponding to asyncId is destroyed. It is also called asynchronously from the embedder API emitDestroy().
Some resources depend on garbage collection for cleanup, so if a reference is made to the resource object passed to init it is possible that destroy will never be called, causing a memory leak in the application. If the resource does not depend on garbage collection, then this will not be an issue.
Using the destroy hook results in additional overhead because it enables tracking of Promise instances via the garbage collector.
promiseResolve(asyncId)
#
Added in: v8.6.0
asyncId <number>
Called when the resolve function passed to the Promise constructor is invoked (either directly or through other means of resolving a promise).
resolve() does not do any observable synchronous work.
The Promise is not necessarily fulfilled or rejected at this point if the Promise was resolved by assuming the state of another Promise.
new Promise((resolve) => resolve(true)).then((a) => {});
copy
calls the following callbacks:
init for PROMISE with id 5, trigger id: 1
  promise resolve 5      # corresponds to resolve(true)
init for PROMISE with id 6, trigger id: 5  # the Promise returned by then()
  before 6               # the then() callback is entered
  promise resolve 6      # the then() callback resolves the promise by returning
  after 6
copy
async_hooks.executionAsyncResource()
#
Added in: v13.9.0, v12.17.0
Returns: <Object> The resource representing the current execution. Useful to store data within the resource.
Resource objects returned by executionAsyncResource() are most often internal Node.js handle objects with undocumented APIs. Using any functions or properties on the object is likely to crash your application and should be avoided.
Using executionAsyncResource() in the top-level execution context will return an empty object as there is no handle or request object to use, but having an object representing the top-level can be helpful.
const { open } = require('node:fs');
const { executionAsyncId, executionAsyncResource } = require('node:async_hooks');

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(__filename, 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
copy
This can be used to implement continuation local storage without the use of a tracking Map to store the metadata:
const { createServer } = require('node:http');
const {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} = require('node:async_hooks');
const sym = Symbol('state'); // Private symbol to avoid pollution

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
copy
async_hooks.executionAsyncId()
#
History













Returns: <number> The asyncId of the current execution context. Useful to track when something calls.
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');

console.log(async_hooks.executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(async_hooks.executionAsyncId());  // 6 - open()
});
copy
The ID returned from executionAsyncId() is related to execution timing, not causality (which is covered by triggerAsyncId()):
const server = net.createServer((conn) => {
  // Returns the ID of the server, not of the new connection, because the
  // callback runs in the execution scope of the server's MakeCallback().
  async_hooks.executionAsyncId();

}).listen(port, () => {
  // Returns the ID of a TickObject (process.nextTick()) because all
  // callbacks passed to .listen() are wrapped in a nextTick().
  async_hooks.executionAsyncId();
});
copy
Promise contexts may not get precise executionAsyncIds by default. See the section on promise execution tracking.
async_hooks.triggerAsyncId()
#
Returns: <number> The ID of the resource responsible for calling the callback that is currently being executed.
const server = net.createServer((conn) => {
  // The resource that caused (or triggered) this callback to be called
  // was that of the new connection. Thus the return value of triggerAsyncId()
  // is the asyncId of "conn".
  async_hooks.triggerAsyncId();

}).listen(port, () => {
  // Even though all callbacks passed to .listen() are wrapped in a nextTick()
  // the callback itself exists because the call to the server's .listen()
  // was made. So the return value would be the ID of the server.
  async_hooks.triggerAsyncId();
});
copy
Promise contexts may not get valid triggerAsyncIds by default. See the section on promise execution tracking.
async_hooks.asyncWrapProviders
#
Added in: v17.2.0, v16.14.0
Returns: A map of provider types to the corresponding numeric id. This map contains all the event types that might be emitted by the async_hooks.init() event.
This feature suppresses the deprecated usage of process.binding('async_wrap').Providers. See: DEP0111
Promise execution tracking
#
By default, promise executions are not assigned asyncIds due to the relatively expensive nature of the promise introspection API provided by V8. This means that programs using promises or async/await will not get correct execution and trigger ids for promise callback contexts by default.
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
copy
Observe that the then() callback claims to have executed in the context of the outer scope even though there was an asynchronous hop involved. Also, the triggerAsyncId value is 0, which means that we are missing context about the resource that caused (triggered) the then() callback to be executed.
Installing async hooks via async_hooks.createHook enables promise execution tracking:
const { createHook, executionAsyncId, triggerAsyncId } = require('node:async_hooks');

createHook({ init() {} }).enable(); // forces PromiseHooks to be enabled.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
copy
In this example, adding any actual hook function enabled the tracking of promises. There are two promises in the example above; the promise created by Promise.resolve() and the promise returned by the call to then(). In the example above, the first promise got the asyncId 6 and the latter got asyncId 7. During the execution of the then() callback, we are executing in the context of promise with asyncId 7. This promise was triggered by async resource 6.
Another subtlety with promises is that before and after callbacks are run only on chained promises. That means promises not created by then()/catch() will not have the before and after callbacks fired on them. For more details see the details of the V8 PromiseHooks API.
JavaScript embedder API
#
Library developers that handle their own asynchronous resources performing tasks like I/O, connection pooling, or managing callback queues may use the AsyncResource JavaScript API so that all the appropriate callbacks are called.
Class: AsyncResource
#
The documentation for this class has moved AsyncResource.
Class: AsyncLocalStorage
#
The documentation for this class has moved AsyncLocalStorage.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Buffer
Buffers and character encodings
Buffers and TypedArrays
Buffers and iteration
Class: Blob
new buffer.Blob([sources[, options]])
blob.arrayBuffer()
blob.bytes()
blob.size
blob.slice([start[, end[, type]]])
blob.stream()
blob.text()
blob.type
Blob objects and MessageChannel
Class: Buffer
Static method: Buffer.alloc(size[, fill[, encoding]])
Static method: Buffer.allocUnsafe(size)
Static method: Buffer.allocUnsafeSlow(size)
Static method: Buffer.byteLength(string[, encoding])
Static method: Buffer.compare(buf1, buf2)
Static method: Buffer.concat(list[, totalLength])
Static method: Buffer.copyBytesFrom(view[, offset[, length]])
Static method: Buffer.from(array)
Static method: Buffer.from(arrayBuffer[, byteOffset[, length]])
Static method: Buffer.from(buffer)
Static method: Buffer.from(object[, offsetOrEncoding[, length]])
Static method: Buffer.from(string[, encoding])
Static method: Buffer.isBuffer(obj)
Static method: Buffer.isEncoding(encoding)
Class property: Buffer.poolSize
buf[index]
buf.buffer
buf.byteOffset
buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])
buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])
buf.entries()
buf.equals(otherBuffer)
buf.fill(value[, offset[, end]][, encoding])
buf.includes(value[, byteOffset][, encoding])
buf.indexOf(value[, byteOffset][, encoding])
buf.keys()
buf.lastIndexOf(value[, byteOffset][, encoding])
buf.length
buf.parent
buf.readBigInt64BE([offset])
buf.readBigInt64LE([offset])
buf.readBigUInt64BE([offset])
buf.readBigUInt64LE([offset])
buf.readDoubleBE([offset])
buf.readDoubleLE([offset])
buf.readFloatBE([offset])
buf.readFloatLE([offset])
buf.readInt8([offset])
buf.readInt16BE([offset])
buf.readInt16LE([offset])
buf.readInt32BE([offset])
buf.readInt32LE([offset])
buf.readIntBE(offset, byteLength)
buf.readIntLE(offset, byteLength)
buf.readUInt8([offset])
buf.readUInt16BE([offset])
buf.readUInt16LE([offset])
buf.readUInt32BE([offset])
buf.readUInt32LE([offset])
buf.readUIntBE(offset, byteLength)
buf.readUIntLE(offset, byteLength)
buf.subarray([start[, end]])
buf.slice([start[, end]])
buf.swap16()
buf.swap32()
buf.swap64()
buf.toJSON()
buf.toString([encoding[, start[, end]]])
buf.values()
buf.write(string[, offset[, length]][, encoding])
buf.writeBigInt64BE(value[, offset])
buf.writeBigInt64LE(value[, offset])
buf.writeBigUInt64BE(value[, offset])
buf.writeBigUInt64LE(value[, offset])
buf.writeDoubleBE(value[, offset])
buf.writeDoubleLE(value[, offset])
buf.writeFloatBE(value[, offset])
buf.writeFloatLE(value[, offset])
buf.writeInt8(value[, offset])
buf.writeInt16BE(value[, offset])
buf.writeInt16LE(value[, offset])
buf.writeInt32BE(value[, offset])
buf.writeInt32LE(value[, offset])
buf.writeIntBE(value, offset, byteLength)
buf.writeIntLE(value, offset, byteLength)
buf.writeUInt8(value[, offset])
buf.writeUInt16BE(value[, offset])
buf.writeUInt16LE(value[, offset])
buf.writeUInt32BE(value[, offset])
buf.writeUInt32LE(value[, offset])
buf.writeUIntBE(value, offset, byteLength)
buf.writeUIntLE(value, offset, byteLength)
new Buffer(array)
new Buffer(arrayBuffer[, byteOffset[, length]])
new Buffer(buffer)
new Buffer(size)
new Buffer(string[, encoding])
Class: File
new buffer.File(sources, fileName[, options])
file.name
file.lastModified
node:buffer module APIs
buffer.atob(data)
buffer.btoa(data)
buffer.isAscii(input)
buffer.isUtf8(input)
buffer.INSPECT_MAX_BYTES
buffer.kMaxLength
buffer.kStringMaxLength
buffer.resolveObjectURL(id)
buffer.transcode(source, fromEnc, toEnc)
Class: SlowBuffer
new SlowBuffer(size)
Buffer constants
buffer.constants.MAX_LENGTH
buffer.constants.MAX_STRING_LENGTH
Buffer.from(), Buffer.alloc(), and Buffer.allocUnsafe()
The --zero-fill-buffers command-line option
What makes Buffer.allocUnsafe() and Buffer.allocUnsafeSlow() "unsafe"?
Buffer
#
Stability: 2 - Stable
Source Code: lib/buffer.js
Buffer objects are used to represent a fixed-length sequence of bytes. Many Node.js APIs support Buffers.
The Buffer class is a subclass of JavaScript's <Uint8Array> class and extends it with methods that cover additional use cases. Node.js APIs accept plain <Uint8Array>s wherever Buffers are supported as well.
While the Buffer class is available within the global scope, it is still recommended to explicitly reference it via an import or require statement.
const { Buffer } = require('node:buffer');

// Creates a zero-filled Buffer of length 10.
const buf1 = Buffer.alloc(10);

// Creates a Buffer of length 10,
// filled with bytes which all have the value `1`.
const buf2 = Buffer.alloc(10, 1);

// Creates an uninitialized buffer of length 10.
// This is faster than calling Buffer.alloc() but the returned
// Buffer instance might contain old data that needs to be
// overwritten using fill(), write(), or other functions that fill the Buffer's
// contents.
const buf3 = Buffer.allocUnsafe(10);

// Creates a Buffer containing the bytes [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// Creates a Buffer containing the bytes [1, 1, 1, 1] – the entries
// are all truncated using `(value & 255)` to fit into the range 0–255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Creates a Buffer containing the UTF-8-encoded bytes for the string 'tést':
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (in hexadecimal notation)
// [116, 195, 169, 115, 116] (in decimal notation)
const buf6 = Buffer.from('tést');

// Creates a Buffer containing the Latin-1 bytes [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
copy
Buffers and character encodings
#
History

















When converting between Buffers and strings, a character encoding may be specified. If no character encoding is specified, UTF-8 will be used as the default.
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Prints: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Prints: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Prints: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Prints: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
copy
Node.js buffers accept all case variations of encoding strings that they receive. For example, UTF-8 can be specified as 'utf8', 'UTF8', or 'uTf8'.
The character encodings currently supported by Node.js are the following:
'utf8' (alias: 'utf-8'): Multi-byte encoded Unicode characters. Many web pages and other document formats use UTF-8. This is the default character encoding. When decoding a Buffer into a string that does not exclusively contain valid UTF-8 data, the Unicode replacement character U+FFFD � will be used to represent those errors.
'utf16le' (alias: 'utf-16le'): Multi-byte encoded Unicode characters. Unlike 'utf8', each character in the string will be encoded using either 2 or 4 bytes. Node.js only supports the little-endian variant of UTF-16.
'latin1': Latin-1 stands for ISO-8859-1. This character encoding only supports the Unicode characters from U+0000 to U+00FF. Each character is encoded using a single byte. Characters that do not fit into that range are truncated and will be mapped to characters in that range.
Converting a Buffer into a string using one of the above is referred to as decoding, and converting a string into a Buffer is referred to as encoding.
Node.js also supports the following binary-to-text encodings. For binary-to-text encodings, the naming convention is reversed: Converting a Buffer into a string is typically referred to as encoding, and converting a string into a Buffer as decoding.
'base64': Base64 encoding. When creating a Buffer from a string, this encoding will also correctly accept "URL and Filename Safe Alphabet" as specified in RFC 4648, Section 5. Whitespace characters such as spaces, tabs, and new lines contained within the base64-encoded string are ignored.
'base64url': base64url encoding as specified in RFC 4648, Section 5. When creating a Buffer from a string, this encoding will also correctly accept regular base64-encoded strings. When encoding a Buffer to a string, this encoding will omit padding.
'hex': Encode each byte as two hexadecimal characters. Data truncation may occur when decoding strings that do not exclusively consist of an even number of hexadecimal characters. See below for an example.
The following legacy character encodings are also supported:
'ascii': For 7-bit ASCII data only. When encoding a string into a Buffer, this is equivalent to using 'latin1'. When decoding a Buffer into a string, using this encoding will additionally unset the highest bit of each byte before decoding as 'latin1'. Generally, there should be no reason to use this encoding, as 'utf8' (or, if the data is known to always be ASCII-only, 'latin1') will be a better choice when encoding or decoding ASCII-only text. It is only provided for legacy compatibility.
'binary': Alias for 'latin1'. The name of this encoding can be very misleading, as all of the encodings listed here convert between strings and binary data. For converting between strings and Buffers, typically 'utf8' is the right choice.
'ucs2', 'ucs-2': Aliases of 'utf16le'. UCS-2 used to refer to a variant of UTF-16 that did not support characters that had code points larger than U+FFFF. In Node.js, these code points are always supported.
const { Buffer } = require('node:buffer');

Buffer.from('1ag123', 'hex');
// Prints <Buffer 1a>, data truncated when first non-hexadecimal value
// ('g') encountered.

Buffer.from('1a7', 'hex');
// Prints <Buffer 1a>, data truncated when data ends in single digit ('7').

Buffer.from('1634', 'hex');
// Prints <Buffer 16 34>, all data represented.
copy
Modern Web browsers follow the WHATWG Encoding Standard which aliases both 'latin1' and 'ISO-8859-1' to 'win-1252'. This means that while doing something like http.get(), if the returned charset is one of those listed in the WHATWG specification it is possible that the server actually returned 'win-1252'-encoded data, and using 'latin1' encoding may incorrectly decode the characters.
Buffers and TypedArrays
#
History









Buffer instances are also JavaScript <Uint8Array> and <TypedArray> instances. All <TypedArray> methods are available on Buffers. There are, however, subtle incompatibilities between the Buffer API and the <TypedArray> API.
In particular:
While TypedArray.prototype.slice() creates a copy of part of the TypedArray, Buffer.prototype.slice() creates a view over the existing Buffer without copying. This behavior can be surprising, and only exists for legacy compatibility. TypedArray.prototype.subarray() can be used to achieve the behavior of Buffer.prototype.slice() on both Buffers and other TypedArrays and should be preferred.
buf.toString() is incompatible with its TypedArray equivalent.
A number of methods, e.g. buf.indexOf(), support additional arguments.
There are two ways to create new <TypedArray> instances from a Buffer:
Passing a Buffer to a <TypedArray> constructor will copy the Buffer's contents, interpreted as an array of integers, and not as a byte sequence of the target type.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
copy
Passing the Buffer's underlying <ArrayBuffer> will create a <TypedArray> that shares its memory with the Buffer.
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
copy
It is possible to create a new Buffer that shares the same allocated memory as a <TypedArray> instance by using the TypedArray object's .buffer property in the same way. Buffer.from() behaves like new Uint8Array() in this context.
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
copy
When creating a Buffer using a <TypedArray>'s .buffer, it is possible to use only a portion of the underlying <ArrayBuffer> by passing in byteOffset and length parameters.
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
copy
The Buffer.from() and TypedArray.from() have different signatures and implementations. Specifically, the <TypedArray> variants accept a second argument that is a mapping function that is invoked on every element of the typed array:
TypedArray.from(source[, mapFn[, thisArg]])
The Buffer.from() method, however, does not support the use of a mapping function:
Buffer.from(array)
Buffer.from(buffer)
Buffer.from(arrayBuffer[, byteOffset[, length]])
Buffer.from(string[, encoding])
Buffers and iteration
#
Buffer instances can be iterated over using for..of syntax:
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
copy
Additionally, the buf.values(), buf.keys(), and buf.entries() methods can be used to create iterators.
Class: Blob
#
History













A <Blob> encapsulates immutable, raw data that can be safely shared across multiple worker threads.
new buffer.Blob([sources[, options]])
#
History













sources <string[]> | <ArrayBuffer[]> | <TypedArray[]> | <DataView[]> | <Blob[]> An array of string, <ArrayBuffer>, <TypedArray>, <DataView>, or <Blob> objects, or any mix of such objects, that will be stored within the Blob.
options <Object>
endings <string> One of either 'transparent' or 'native'. When set to 'native', line endings in string source parts will be converted to the platform native line-ending as specified by require('node:os').EOL.
type <string> The Blob content-type. The intent is for type to convey the MIME media type of the data, however no validation of the type format is performed.
Creates a new Blob object containing a concatenation of the given sources.
<ArrayBuffer>, <TypedArray>, <DataView>, and <Buffer> sources are copied into the 'Blob' and can therefore be safely modified after the 'Blob' is created.
String sources are encoded as UTF-8 byte sequences and copied into the Blob. Unmatched surrogate pairs within each string part will be replaced by Unicode U+FFFD replacement characters.
blob.arrayBuffer()
#
Added in: v15.7.0, v14.18.0
Returns: <Promise>
Returns a promise that fulfills with an <ArrayBuffer> containing a copy of the Blob data.
blob.bytes()
#
Added in: v22.3.0, v20.16.0
The blob.bytes() method returns the byte of the Blob object as a Promise<Uint8Array>.
const blob = new Blob(['hello']);
blob.bytes().then((bytes) => {
  console.log(bytes); // Outputs: Uint8Array(5) [ 104, 101, 108, 108, 111 ]
});
copy
blob.size
#
Added in: v15.7.0, v14.18.0
The total size of the Blob in bytes.
blob.slice([start[, end[, type]]])
#
Added in: v15.7.0, v14.18.0
start <number> The starting index.
end <number> The ending index.
type <string> The content-type for the new Blob
Creates and returns a new Blob containing a subset of this Blob objects data. The original Blob is not altered.
blob.stream()
#
Added in: v16.7.0
Returns: <ReadableStream>
Returns a new ReadableStream that allows the content of the Blob to be read.
blob.text()
#
Added in: v15.7.0, v14.18.0
Returns: <Promise>
Returns a promise that fulfills with the contents of the Blob decoded as a UTF-8 string.
blob.type
#
Added in: v15.7.0, v14.18.0
Type: <string>
The content-type of the Blob.
Blob objects and MessageChannel
#
Once a <Blob> object is created, it can be sent via MessagePort to multiple destinations without transferring or immediately copying the data. The data contained by the Blob is copied only when the arrayBuffer() or text() methods are called.
const { Blob } = require('node:buffer');
const { setTimeout: delay } = require('node:timers/promises');

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
copy
Class: Buffer
#
The Buffer class is a global type for dealing with binary data directly. It can be constructed in a variety of ways.
Static method: Buffer.alloc(size[, fill[, encoding]])
#
History





























size <integer> The desired length of the new Buffer.
fill <string> | <Buffer> | <Uint8Array> | <integer> A value to pre-fill the new Buffer with. Default: 0.
encoding <string> If fill is a string, this is its encoding. Default: 'utf8'.
Returns: <Buffer>
Allocates a new Buffer of size bytes. If fill is undefined, the Buffer will be zero-filled.
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
copy
If size is larger than buffer.constants.MAX_LENGTH or smaller than 0, ERR_OUT_OF_RANGE is thrown.
If fill is specified, the allocated Buffer will be initialized by calling buf.fill(fill).
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
copy
If both fill and encoding are specified, the allocated Buffer will be initialized by calling buf.fill(fill, encoding).
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
copy
Calling Buffer.alloc() can be measurably slower than the alternative Buffer.allocUnsafe() but ensures that the newly created Buffer instance contents will never contain sensitive data from previous allocations, including data that might not have been allocated for Buffers.
A TypeError will be thrown if size is not a number.
Static method: Buffer.allocUnsafe(size)
#
History





















size <integer> The desired length of the new Buffer.
Returns: <Buffer>
Allocates a new Buffer of size bytes. If size is larger than buffer.constants.MAX_LENGTH or smaller than 0, ERR_OUT_OF_RANGE is thrown.
The underlying memory for Buffer instances created in this way is not initialized. The contents of the newly created Buffer are unknown and may contain sensitive data. Use Buffer.alloc() instead to initialize Buffer instances with zeroes.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Prints (contents may vary): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00 00 00 00 00 00>
copy
A TypeError will be thrown if size is not a number.
The Buffer module pre-allocates an internal Buffer instance of size Buffer.poolSize that is used as a pool for the fast allocation of new Buffer instances created using Buffer.allocUnsafe(), Buffer.from(array), Buffer.from(string), and Buffer.concat() only when size is less than Buffer.poolSize >>> 1 (floor of Buffer.poolSize divided by two).
Use of this pre-allocated internal memory pool is a key difference between calling Buffer.alloc(size, fill) vs. Buffer.allocUnsafe(size).fill(fill). Specifically, Buffer.alloc(size, fill) will never use the internal Buffer pool, while Buffer.allocUnsafe(size).fill(fill) will use the internal Buffer pool if size is less than or equal to half Buffer.poolSize. The difference is subtle but can be important when an application requires the additional performance that Buffer.allocUnsafe() provides.
Static method: Buffer.allocUnsafeSlow(size)
#
History

















size <integer> The desired length of the new Buffer.
Returns: <Buffer>
Allocates a new Buffer of size bytes. If size is larger than buffer.constants.MAX_LENGTH or smaller than 0, ERR_OUT_OF_RANGE is thrown. A zero-length Buffer is created if size is 0.
The underlying memory for Buffer instances created in this way is not initialized. The contents of the newly created Buffer are unknown and may contain sensitive data. Use buf.fill(0) to initialize such Buffer instances with zeroes.
When using Buffer.allocUnsafe() to allocate new Buffer instances, allocations less than Buffer.poolSize >>> 1 (4KiB when default poolSize is used) are sliced from a single pre-allocated Buffer. This allows applications to avoid the garbage collection overhead of creating many individually allocated Buffer instances. This approach improves both performance and memory usage by eliminating the need to track and clean up as many individual ArrayBuffer objects.
However, in the case where a developer may need to retain a small chunk of memory from a pool for an indeterminate amount of time, it may be appropriate to create an un-pooled Buffer instance using Buffer.allocUnsafeSlow() and then copying out the relevant bits.
const { Buffer } = require('node:buffer');

// Need to keep around a few small chunks of memory.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Allocate for retained data.
    const sb = Buffer.allocUnsafeSlow(10);

    // Copy the data into the new allocation.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
copy
A TypeError will be thrown if size is not a number.
Static method: Buffer.byteLength(string[, encoding])
#
History

















string <string> | <Buffer> | <TypedArray> | <DataView> | <ArrayBuffer> | <SharedArrayBuffer> A value to calculate the length of.
encoding <string> If string is a string, this is its encoding. Default: 'utf8'.
Returns: <integer> The number of bytes contained within string.
Returns the byte length of a string when encoded using encoding. This is not the same as String.prototype.length, which does not account for the encoding that is used to convert the string into bytes.
For 'base64', 'base64url', and 'hex', this function assumes valid input. For strings that contain non-base64/hex-encoded data (e.g. whitespace), the return value might be greater than the length of a Buffer created from the string.
const { Buffer } = require('node:buffer');

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
copy
When string is a <Buffer> | <DataView> | <TypedArray> | <ArrayBuffer> | <SharedArrayBuffer>, the byte length as reported by .byteLength is returned.
Static method: Buffer.compare(buf1, buf2)
#
History













buf1 <Buffer> | <Uint8Array>
buf2 <Buffer> | <Uint8Array>
Returns: <integer> Either -1, 0, or 1, depending on the result of the comparison. See buf.compare() for details.
Compares buf1 to buf2, typically for the purpose of sorting arrays of Buffer instances. This is equivalent to calling buf1.compare(buf2).
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Prints: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (This result is equal to: [buf2, buf1].)
copy
Static method: Buffer.concat(list[, totalLength])
#
History













list <Buffer[]> | <Uint8Array[]> List of Buffer or <Uint8Array> instances to concatenate.
totalLength <integer> Total length of the Buffer instances in list when concatenated.
Returns: <Buffer>
Returns a new Buffer which is the result of concatenating all the Buffer instances in the list together.
If the list has no items, or if the totalLength is 0, then a new zero-length Buffer is returned.
If totalLength is not provided, it is calculated from the Buffer instances in list by adding their lengths.
If totalLength is provided, it is coerced to an unsigned integer. If the combined length of the Buffers in list exceeds totalLength, the result is truncated to totalLength. If the combined length of the Buffers in list is less than totalLength, the remaining space is filled with zeros.
const { Buffer } = require('node:buffer');

// Create a single `Buffer` from a list of three `Buffer` instances.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Prints: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Prints: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Prints: 42
copy
Buffer.concat() may also use the internal Buffer pool like Buffer.allocUnsafe() does.
Static method: Buffer.copyBytesFrom(view[, offset[, length]])
#
Added in: v19.8.0, v18.16.0
view <TypedArray> The <TypedArray> to copy.
offset <integer> The starting offset within view. Default: 0.
length <integer> The number of elements from view to copy. Default: view.length - offset.
Returns: <Buffer>
Copies the underlying memory of view into a new Buffer.
const u16 = new Uint16Array([0, 0xffff]);
const buf = Buffer.copyBytesFrom(u16, 1, 1);
u16[1] = 0;
console.log(buf.length); // 2
console.log(buf[0]); // 255
console.log(buf[1]); // 255
copy
Static method: Buffer.from(array)
#
Added in: v5.10.0
array <integer[]>
Returns: <Buffer>
Allocates a new Buffer using an array of bytes in the range 0 – 255. Array entries outside that range will be truncated to fit into it.
const { Buffer } = require('node:buffer');

// Creates a new Buffer containing the UTF-8 bytes of the string 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
copy
If array is an Array-like object (that is, one with a length property of type number), it is treated as if it is an array, unless it is a Buffer or a Uint8Array. This means all other TypedArray variants get treated as an Array. To create a Buffer from the bytes backing a TypedArray, use Buffer.copyBytesFrom().
A TypeError will be thrown if array is not an Array or another type appropriate for Buffer.from() variants.
Buffer.from(array) and Buffer.from(string) may also use the internal Buffer pool like Buffer.allocUnsafe() does.
Static method: Buffer.from(arrayBuffer[, byteOffset[, length]])
#
Added in: v5.10.0
arrayBuffer <ArrayBuffer> | <SharedArrayBuffer> An <ArrayBuffer>, <SharedArrayBuffer>, for example the .buffer property of a <TypedArray>.
byteOffset <integer> Index of first byte to expose. Default: 0.
length <integer> Number of bytes to expose. Default: arrayBuffer.byteLength - byteOffset.
Returns: <Buffer>
This creates a view of the <ArrayBuffer> without copying the underlying memory. For example, when passed a reference to the .buffer property of a <TypedArray> instance, the newly created Buffer will share the same allocated memory as the <TypedArray>'s underlying ArrayBuffer.
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Shares memory with `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// Changing the original Uint16Array changes the Buffer also.
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
copy
The optional byteOffset and length arguments specify a memory range within the arrayBuffer that will be shared by the Buffer.
const { Buffer } = require('node:buffer');

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Prints: 2
copy
A TypeError will be thrown if arrayBuffer is not an <ArrayBuffer> or a <SharedArrayBuffer> or another type appropriate for Buffer.from() variants.
It is important to remember that a backing ArrayBuffer can cover a range of memory that extends beyond the bounds of a TypedArray view. A new Buffer created using the buffer property of a TypedArray may extend beyond the range of the TypedArray:
const { Buffer } = require('node:buffer');

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 elements
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 elements
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Prints: <Buffer 63 64 65 66>
copy
Static method: Buffer.from(buffer)
#
Added in: v5.10.0
buffer <Buffer> | <Uint8Array> An existing Buffer or <Uint8Array> from which to copy data.
Returns: <Buffer>
Copies the passed buffer data onto a new Buffer instance.
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
copy
A TypeError will be thrown if buffer is not a Buffer or another type appropriate for Buffer.from() variants.
Static method: Buffer.from(object[, offsetOrEncoding[, length]])
#
Added in: v8.2.0
object <Object> An object supporting Symbol.toPrimitive or valueOf().
offsetOrEncoding <integer> | <string> A byte-offset or encoding.
length <integer> A length.
Returns: <Buffer>
For objects whose valueOf() function returns a value not strictly equal to object, returns Buffer.from(object.valueOf(), offsetOrEncoding, length).
const { Buffer } = require('node:buffer');

const buf = Buffer.from(new String('this is a test'));
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
copy
For objects that support Symbol.toPrimitive, returns Buffer.from(object[Symbol.toPrimitive]('string'), offsetOrEncoding).
const { Buffer } = require('node:buffer');

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
copy
A TypeError will be thrown if object does not have the mentioned methods or is not of another type appropriate for Buffer.from() variants.
Static method: Buffer.from(string[, encoding])
#
Added in: v5.10.0
string <string> A string to encode.
encoding <string> The encoding of string. Default: 'utf8'.
Returns: <Buffer>
Creates a new Buffer containing string. The encoding parameter identifies the character encoding to be used when converting string into bytes.
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Prints: this is a tést
console.log(buf2.toString());
// Prints: this is a tést
console.log(buf1.toString('latin1'));
// Prints: this is a tÃ©st
copy
A TypeError will be thrown if string is not a string or another type appropriate for Buffer.from() variants.
Buffer.from(string) may also use the internal Buffer pool like Buffer.allocUnsafe() does.
Static method: Buffer.isBuffer(obj)
#
Added in: v0.1.101
obj <Object>
Returns: <boolean>
Returns true if obj is a Buffer, false otherwise.
const { Buffer } = require('node:buffer');

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
copy
Static method: Buffer.isEncoding(encoding)
#
Added in: v0.9.1
encoding <string> A character encoding name to check.
Returns: <boolean>
Returns true if encoding is the name of a supported character encoding, or false otherwise.
const { Buffer } = require('node:buffer');

console.log(Buffer.isEncoding('utf8'));
// Prints: true

console.log(Buffer.isEncoding('hex'));
// Prints: true

console.log(Buffer.isEncoding('utf/8'));
// Prints: false

console.log(Buffer.isEncoding(''));
// Prints: false
copy
Class property: Buffer.poolSize
#
Added in: v0.11.3
<integer> Default: 8192
This is the size (in bytes) of pre-allocated internal Buffer instances used for pooling. This value may be modified.
buf[index]
#
index <integer>
The index operator [index] can be used to get and set the octet at position index in buf. The values refer to individual bytes, so the legal value range is between 0x00 and 0xFF (hex) or 0 and 255 (decimal).
This operator is inherited from Uint8Array, so its behavior on out-of-bounds access is the same as Uint8Array. In other words, buf[index] returns undefined when index is negative or greater or equal to buf.length, and buf[index] = value does not modify the buffer if index is negative or >= buf.length.
const { Buffer } = require('node:buffer');

// Copy an ASCII string into a `Buffer` one byte at a time.
// (This only works for ASCII-only strings. In general, one should use
// `Buffer.from()` to perform this conversion.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Prints: Node.js
copy
buf.buffer
#
<ArrayBuffer> The underlying ArrayBuffer object based on which this Buffer object is created.
This ArrayBuffer is not guaranteed to correspond exactly to the original Buffer. See the notes on buf.byteOffset for details.
const { Buffer } = require('node:buffer');

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
copy
buf.byteOffset
#
<integer> The byteOffset of the Buffer's underlying ArrayBuffer object.
When setting byteOffset in Buffer.from(ArrayBuffer, byteOffset, length), or sometimes when allocating a Buffer smaller than Buffer.poolSize, the buffer does not start from a zero offset on the underlying ArrayBuffer.
This can cause problems when accessing the underlying ArrayBuffer directly using buf.buffer, as other parts of the ArrayBuffer may be unrelated to the Buffer object itself.
A common issue when creating a TypedArray object that shares its memory with a Buffer is that in this case one needs to specify the byteOffset correctly:
const { Buffer } = require('node:buffer');

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
copy
buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])
#
History

















target <Buffer> | <Uint8Array> A Buffer or <Uint8Array> with which to compare buf.
targetStart <integer> The offset within target at which to begin comparison. Default: 0.
targetEnd <integer> The offset within target at which to end comparison (not inclusive). Default: target.length.
sourceStart <integer> The offset within buf at which to begin comparison. Default: 0.
sourceEnd <integer> The offset within buf at which to end comparison (not inclusive). Default: buf.length.
Returns: <integer>
Compares buf with target and returns a number indicating whether buf comes before, after, or is the same as target in sort order. Comparison is based on the actual sequence of bytes in each Buffer.
0 is returned if target is the same as buf
1 is returned if target should come before buf when sorted.
-1 is returned if target should come after buf when sorted.
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
copy
The optional targetStart, targetEnd, sourceStart, and sourceEnd arguments can be used to limit the comparison to specific ranges within target and buf respectively.
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
copy
ERR_OUT_OF_RANGE is thrown if targetStart < 0, sourceStart < 0, targetEnd > target.byteLength, or sourceEnd > source.byteLength.
buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])
#
Added in: v0.1.90
target <Buffer> | <Uint8Array> A Buffer or <Uint8Array> to copy into.
targetStart <integer> The offset within target at which to begin writing. Default: 0.
sourceStart <integer> The offset within buf from which to begin copying. Default: 0.
sourceEnd <integer> The offset within buf at which to stop copying (not inclusive). Default: buf.length.
Returns: <integer> The number of bytes copied.
Copies data from a region of buf to a region in target, even if the target memory region overlaps with buf.
TypedArray.prototype.set() performs the same operation, and is available for all TypedArrays, including Node.js Buffers, although it takes different function arguments.
const { Buffer } = require('node:buffer');

// Create two `Buffer` instances.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

// Copy `buf1` bytes 16 through 19 into `buf2` starting at byte 8 of `buf2`.
buf1.copy(buf2, 8, 16, 20);
// This is equivalent to:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
copy
const { Buffer } = require('node:buffer');

// Create a `Buffer` and copy data from one region to an overlapping region
// within the same `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
copy
buf.entries()
#
Added in: v1.1.0
Returns: <Iterator>
Creates and returns an iterator of [index, byte] pairs from the contents of buf.
const { Buffer } = require('node:buffer');

// Log the entire contents of a `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Prints:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
copy
buf.equals(otherBuffer)
#
History













otherBuffer <Buffer> | <Uint8Array> A Buffer or <Uint8Array> with which to compare buf.
Returns: <boolean>
Returns true if both buf and otherBuffer have exactly the same bytes, false otherwise. Equivalent to buf.compare(otherBuffer) === 0.
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Prints: true
console.log(buf1.equals(buf3));
// Prints: false
copy
buf.fill(value[, offset[, end]][, encoding])
#
History





























value <string> | <Buffer> | <Uint8Array> | <integer> The value with which to fill buf. Empty value (string, Uint8Array, Buffer) is coerced to 0.
offset <integer> Number of bytes to skip before starting to fill buf. Default: 0.
end <integer> Where to stop filling buf (not inclusive). Default: buf.length.
encoding <string> The encoding for value if value is a string. Default: 'utf8'.
Returns: <Buffer> A reference to buf.
Fills buf with the specified value. If the offset and end are not given, the entire buf will be filled:
const { Buffer } = require('node:buffer');

// Fill a `Buffer` with the ASCII character 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Prints: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Fill a buffer with empty string
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Prints: <Buffer 00 00 00 00 00>
copy
value is coerced to a uint32 value if it is not a string, Buffer, or integer. If the resulting integer is greater than 255 (decimal), buf will be filled with value & 255.
If the final write of a fill() operation falls on a multi-byte character, then only the bytes of that character that fit into buf are written:
const { Buffer } = require('node:buffer');

// Fill a `Buffer` with character that takes up two bytes in UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Prints: <Buffer c8 a2 c8 a2 c8>
copy
If value contains invalid characters, it is truncated; if no valid fill data remains, an exception is thrown:
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Prints: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Prints: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Throws an exception.
copy
buf.includes(value[, byteOffset][, encoding])
#
Added in: v5.3.0
value <string> | <Buffer> | <Uint8Array> | <integer> What to search for.
byteOffset <integer> Where to begin searching in buf. If negative, then offset is calculated from the end of buf. Default: 0.
encoding <string> If value is a string, this is its encoding. Default: 'utf8'.
Returns: <boolean> true if value was found in buf, false otherwise.
Equivalent to buf.indexOf() !== -1.
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
copy
buf.indexOf(value[, byteOffset][, encoding])
#
History

















value <string> | <Buffer> | <Uint8Array> | <integer> What to search for.
byteOffset <integer> Where to begin searching in buf. If negative, then offset is calculated from the end of buf. Default: 0.
encoding <string> If value is a string, this is the encoding used to determine the binary representation of the string that will be searched for in buf. Default: 'utf8'.
Returns: <integer> The index of the first occurrence of value in buf, or -1 if buf does not contain value.
If value is:
a string, value is interpreted according to the character encoding in encoding.
a Buffer or <Uint8Array>, value will be used in its entirety. To compare a partial Buffer, use buf.subarray.
a number, value will be interpreted as an unsigned 8-bit integer value between 0 and 255.
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
copy
If value is not a string, number, or Buffer, this method will throw a TypeError. If value is a number, it will be coerced to a valid byte value, an integer between 0 and 255.
If byteOffset is not a number, it will be coerced to a number. If the result of coercion is NaN or 0, then the entire buffer will be searched. This behavior matches String.prototype.indexOf().
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
copy
If value is an empty string or empty Buffer and byteOffset is less than buf.length, byteOffset will be returned. If value is empty and byteOffset is at least buf.length, buf.length will be returned.
buf.keys()
#
Added in: v1.1.0
Returns: <Iterator>
Creates and returns an iterator of buf keys (indexes).
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
copy
buf.lastIndexOf(value[, byteOffset][, encoding])
#
History













value <string> | <Buffer> | <Uint8Array> | <integer> What to search for.
byteOffset <integer> Where to begin searching in buf. If negative, then offset is calculated from the end of buf. Default: buf.length - 1.
encoding <string> If value is a string, this is the encoding used to determine the binary representation of the string that will be searched for in buf. Default: 'utf8'.
Returns: <integer> The index of the last occurrence of value in buf, or -1 if buf does not contain value.
Identical to buf.indexOf(), except the last occurrence of value is found rather than the first occurrence.
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Prints: 0
console.log(buf.lastIndexOf('buffer'));
// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Prints: 17
console.log(buf.lastIndexOf(97));
// Prints: 15 (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Prints: -1
console.log(buf.lastIndexOf('buffer', 5));
// Prints: 5
console.log(buf.lastIndexOf('buffer', 4));
// Prints: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Prints: 4
copy
If value is not a string, number, or Buffer, this method will throw a TypeError. If value is a number, it will be coerced to a valid byte value, an integer between 0 and 255.
If byteOffset is not a number, it will be coerced to a number. Any arguments that coerce to NaN, like {} or undefined, will search the whole buffer. This behavior matches String.prototype.lastIndexOf().
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
copy
If value is an empty string or empty Buffer, byteOffset will be returned.
buf.length
#
Added in: v0.1.90
<integer>
Returns the number of bytes in buf.
const { Buffer } = require('node:buffer');

// Create a `Buffer` and write a shorter string to it using UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Prints: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Prints: 1234
copy
buf.parent
#
Deprecated since: v8.0.0
Stability: 0 - Deprecated: Use buf.buffer instead.
The buf.parent property is a deprecated alias for buf.buffer.
buf.readBigInt64BE([offset])
#
Added in: v12.0.0, v10.20.0
offset <integer> Number of bytes to skip before starting to read. Must satisfy: 0 <= offset <= buf.length - 8. Default: 0.
Returns: <bigint>
Reads a signed, big-endian 64-bit integer from buf at the specified offset.
Integers read from a Buffer are interpreted as two's complement signed values.
buf.readBigInt64LE([offset])
#
Added in: v12.0.0, v10.20.0
offset <integer> Number of bytes to skip before starting to read. Must satisfy: 0 <= offset <= buf.length - 8. Default: 0.
Returns: <bigint>
Reads a signed, little-endian 64-bit integer from buf at the specified offset.
Integers read from a Buffer are interpreted as two's complement signed values.
buf.readBigUInt64BE([offset])
#
History













offset <integer> Number of bytes to skip before starting to read. Must satisfy: 0 <= offset <= buf.length - 8. Default: 0.
Returns: <bigint>
Reads an unsigned, big-endian 64-bit integer from buf at the specified offset.
This function is also available under the readBigUint64BE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Prints: 4294967295n
copy
buf.readBigUInt64LE([offset])
#
History













offset <integer> Number of bytes to skip before starting to read. Must satisfy: 0 <= offset <= buf.length - 8. Default: 0.
Returns: <bigint>
Reads an unsigned, little-endian 64-bit integer from buf at the specified offset.
This function is also available under the readBigUint64LE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Prints: 18446744069414584320n
copy
buf.readDoubleBE([offset])
#
History













offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 8. Default: 0.
Returns: <number>
Reads a 64-bit, big-endian double from buf at the specified offset.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Prints: 8.20788039913184e-304
copy
buf.readDoubleLE([offset])
#
History













offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 8. Default: 0.
Returns: <number>
Reads a 64-bit, little-endian double from buf at the specified offset.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Prints: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Throws ERR_OUT_OF_RANGE.
copy
buf.readFloatBE([offset])
#
History













offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 4. Default: 0.
Returns: <number>
Reads a 32-bit, big-endian float from buf at the specified offset.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Prints: 2.387939260590663e-38
copy
buf.readFloatLE([offset])
#
History













offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 4. Default: 0.
Returns: <number>
Reads a 32-bit, little-endian float from buf at the specified offset.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Prints: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Throws ERR_OUT_OF_RANGE.
copy
buf.readInt8([offset])
#
History













offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 1. Default: 0.
Returns: <integer>
Reads a signed 8-bit integer from buf at the specified offset.
Integers read from a Buffer are interpreted as two's complement signed values.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Prints: -1
console.log(buf.readInt8(1));
// Prints: 5
console.log(buf.readInt8(2));
// Throws ERR_OUT_OF_RANGE.
copy
buf.readInt16BE([offset])
#
History













offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 2. Default: 0.
Returns: <integer>
Reads a signed, big-endian 16-bit integer from buf at the specified offset.
Integers read from a Buffer are interpreted as two's complement signed values.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Prints: 5
copy
buf.readInt16LE([offset])
#
History













offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 2. Default: 0.
Returns: <integer>
Reads a signed, little-endian 16-bit integer from buf at the specified offset.
Integers read from a Buffer are interpreted as two's complement signed values.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Prints: 1280
console.log(buf.readInt16LE(1));
// Throws ERR_OUT_OF_RANGE.
copy
buf.readInt32BE([offset])
#
History













offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 4. Default: 0.
Returns: <integer>
Reads a signed, big-endian 32-bit integer from buf at the specified offset.
Integers read from a Buffer are interpreted as two's complement signed values.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Prints: 5
copy
buf.readInt32LE([offset])
#
History













offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 4. Default: 0.
Returns: <integer>
Reads a signed, little-endian 32-bit integer from buf at the specified offset.
Integers read from a Buffer are interpreted as two's complement signed values.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Prints: 83886080
console.log(buf.readInt32LE(1));
// Throws ERR_OUT_OF_RANGE.
copy
buf.readIntBE(offset, byteLength)
#
History













offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - byteLength.
byteLength <integer> Number of bytes to read. Must satisfy 0 < byteLength <= 6.
Returns: <integer>
Reads byteLength number of bytes from buf at the specified offset and interprets the result as a big-endian, two's complement signed value supporting up to 48 bits of accuracy.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Throws ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Throws ERR_OUT_OF_RANGE.
copy
buf.readIntLE(offset, byteLength)
#
History













offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - byteLength.
byteLength <integer> Number of bytes to read. Must satisfy 0 < byteLength <= 6.
Returns: <integer>
Reads byteLength number of bytes from buf at the specified offset and interprets the result as a little-endian, two's complement signed value supporting up to 48 bits of accuracy.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Prints: -546f87a9cbee
copy
buf.readUInt8([offset])
#
History

















offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 1. Default: 0.
Returns: <integer>
Reads an unsigned 8-bit integer from buf at the specified offset.
This function is also available under the readUint8 alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Prints: 1
console.log(buf.readUInt8(1));
// Prints: 254
console.log(buf.readUInt8(2));
// Throws ERR_OUT_OF_RANGE.
copy
buf.readUInt16BE([offset])
#
History

















offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 2. Default: 0.
Returns: <integer>
Reads an unsigned, big-endian 16-bit integer from buf at the specified offset.
This function is also available under the readUint16BE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Prints: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Prints: 3456
copy
buf.readUInt16LE([offset])
#
History

















offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 2. Default: 0.
Returns: <integer>
Reads an unsigned, little-endian 16-bit integer from buf at the specified offset.
This function is also available under the readUint16LE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Prints: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Prints: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Throws ERR_OUT_OF_RANGE.
copy
buf.readUInt32BE([offset])
#
History

















offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 4. Default: 0.
Returns: <integer>
Reads an unsigned, big-endian 32-bit integer from buf at the specified offset.
This function is also available under the readUint32BE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Prints: 12345678
copy
buf.readUInt32LE([offset])
#
History

















offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - 4. Default: 0.
Returns: <integer>
Reads an unsigned, little-endian 32-bit integer from buf at the specified offset.
This function is also available under the readUint32LE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Prints: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Throws ERR_OUT_OF_RANGE.
copy
buf.readUIntBE(offset, byteLength)
#
History

















offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - byteLength.
byteLength <integer> Number of bytes to read. Must satisfy 0 < byteLength <= 6.
Returns: <integer>
Reads byteLength number of bytes from buf at the specified offset and interprets the result as an unsigned big-endian integer supporting up to 48 bits of accuracy.
This function is also available under the readUintBE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Prints: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Throws ERR_OUT_OF_RANGE.
copy
buf.readUIntLE(offset, byteLength)
#
History

















offset <integer> Number of bytes to skip before starting to read. Must satisfy 0 <= offset <= buf.length - byteLength.
byteLength <integer> Number of bytes to read. Must satisfy 0 < byteLength <= 6.
Returns: <integer>
Reads byteLength number of bytes from buf at the specified offset and interprets the result as an unsigned, little-endian integer supporting up to 48 bits of accuracy.
This function is also available under the readUintLE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Prints: ab9078563412
copy
buf.subarray([start[, end]])
#
Added in: v3.0.0
start <integer> Where the new Buffer will start. Default: 0.
end <integer> Where the new Buffer will end (not inclusive). Default: buf.length.
Returns: <Buffer>
Returns a new Buffer that references the same memory as the original, but offset and cropped by the start and end indexes.
Specifying end greater than buf.length will return the same result as that of end equal to buf.length.
This method is inherited from TypedArray.prototype.subarray().
Modifying the new Buffer slice will modify the memory in the original Buffer because the allocated memory of the two objects overlap.
const { Buffer } = require('node:buffer');

// Create a `Buffer` with the ASCII alphabet, take a slice, and modify one byte
// from the original `Buffer`.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Prints: !bc
copy
Specifying negative indexes causes the slice to be generated relative to the end of buf rather than the beginning.
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Prints: buffe
// (Equivalent to buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Prints: buff
// (Equivalent to buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Prints: uff
// (Equivalent to buf.subarray(1, 4).)
copy
buf.slice([start[, end]])
#
History





















start <integer> Where the new Buffer will start. Default: 0.
end <integer> Where the new Buffer will end (not inclusive). Default: buf.length.
Returns: <Buffer>
Stability: 0 - Deprecated: Use buf.subarray instead.
Returns a new Buffer that references the same memory as the original, but offset and cropped by the start and end indexes.
This method is not compatible with the Uint8Array.prototype.slice(), which is a superclass of Buffer. To copy the slice, use Uint8Array.prototype.slice().
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Prints: cuffer

console.log(buf.toString());
// Prints: buffer

// With buf.slice(), the original buffer is modified.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Prints: cuffer
console.log(buf.toString());
// Also prints: cuffer (!)
copy
buf.swap16()
#
Added in: v5.10.0
Returns: <Buffer> A reference to buf.
Interprets buf as an array of unsigned 16-bit integers and swaps the byte order in-place. Throws ERR_INVALID_BUFFER_SIZE if buf.length is not a multiple of 2.
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
copy
One convenient use of buf.swap16() is to perform a fast in-place conversion between UTF-16 little-endian and UTF-16 big-endian:
const { Buffer } = require('node:buffer');

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
copy
buf.swap32()
#
Added in: v5.10.0
Returns: <Buffer> A reference to buf.
Interprets buf as an array of unsigned 32-bit integers and swaps the byte order in-place. Throws ERR_INVALID_BUFFER_SIZE if buf.length is not a multiple of 4.
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
copy
buf.swap64()
#
Added in: v6.3.0
Returns: <Buffer> A reference to buf.
Interprets buf as an array of 64-bit numbers and swaps byte order in-place. Throws ERR_INVALID_BUFFER_SIZE if buf.length is not a multiple of 8.
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
copy
buf.toJSON()
#
Added in: v0.9.2
Returns: <Object>
Returns a JSON representation of buf. JSON.stringify() implicitly calls this function when stringifying a Buffer instance.
Buffer.from() accepts objects in the format returned from this method. In particular, Buffer.from(buf.toJSON()) works like Buffer.from(buf).
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
copy
buf.toString([encoding[, start[, end]]])
#
Added in: v0.1.90
encoding <string> The character encoding to use. Default: 'utf8'.
start <integer> The byte offset to start decoding at. Default: 0.
end <integer> The byte offset to stop decoding at (not inclusive). Default: buf.length.
Returns: <string>
Decodes buf to a string according to the specified character encoding in encoding. start and end may be passed to decode only a subset of buf.
If encoding is 'utf8' and a byte sequence in the input is not valid UTF-8, then each invalid byte is replaced with the replacement character U+FFFD.
The maximum length of a string instance (in UTF-16 code units) is available as buffer.constants.MAX_STRING_LENGTH.
const { Buffer } = require('node:buffer');

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
copy
buf.values()
#
Added in: v1.1.0
Returns: <Iterator>
Creates and returns an iterator for buf values (bytes). This function is called automatically when a Buffer is used in a for..of statement.
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
copy
buf.write(string[, offset[, length]][, encoding])
#
Added in: v0.1.90
string <string> String to write to buf.
offset <integer> Number of bytes to skip before starting to write string. Default: 0.
length <integer> Maximum number of bytes to write (written bytes will not exceed buf.length - offset). Default: buf.length - offset.
encoding <string> The character encoding of string. Default: 'utf8'.
Returns: <integer> Number of bytes written.
Writes string to buf at offset according to the character encoding in encoding. The length parameter is the number of bytes to write. If buf did not contain enough space to fit the entire string, only part of string will be written. However, partially encoded characters will not be written.
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
copy
buf.writeBigInt64BE(value[, offset])
#
Added in: v12.0.0, v10.20.0
value <bigint> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy: 0 <= offset <= buf.length - 8. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as big-endian.
value is interpreted and written as a two's complement signed integer.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
copy
buf.writeBigInt64LE(value[, offset])
#
Added in: v12.0.0, v10.20.0
value <bigint> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy: 0 <= offset <= buf.length - 8. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as little-endian.
value is interpreted and written as a two's complement signed integer.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
copy
buf.writeBigUInt64BE(value[, offset])
#
History













value <bigint> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy: 0 <= offset <= buf.length - 8. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as big-endian.
This function is also available under the writeBigUint64BE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
copy
buf.writeBigUInt64LE(value[, offset])
#
History













value <bigint> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy: 0 <= offset <= buf.length - 8. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as little-endian
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
copy
This function is also available under the writeBigUint64LE alias.
buf.writeDoubleBE(value[, offset])
#
History













value <number> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 8. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as big-endian. The value must be a JavaScript number. Behavior is undefined when value is anything other than a JavaScript number.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
copy
buf.writeDoubleLE(value[, offset])
#
History













value <number> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 8. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as little-endian. The value must be a JavaScript number. Behavior is undefined when value is anything other than a JavaScript number.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
copy
buf.writeFloatBE(value[, offset])
#
History













value <number> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 4. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as big-endian. Behavior is undefined when value is anything other than a JavaScript number.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
copy
buf.writeFloatLE(value[, offset])
#
History













value <number> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 4. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as little-endian. Behavior is undefined when value is anything other than a JavaScript number.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
copy
buf.writeInt8(value[, offset])
#
History













value <integer> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 1. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset. value must be a valid signed 8-bit integer. Behavior is undefined when value is anything other than a signed 8-bit integer.
value is interpreted and written as a two's complement signed integer.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Prints: <Buffer 02 fe>
copy
buf.writeInt16BE(value[, offset])
#
History













value <integer> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 2. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as big-endian. The value must be a valid signed 16-bit integer. Behavior is undefined when value is anything other than a signed 16-bit integer.
The value is interpreted and written as a two's complement signed integer.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Prints: <Buffer 01 02>
copy
buf.writeInt16LE(value[, offset])
#
History













value <integer> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 2. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as little-endian. The value must be a valid signed 16-bit integer. Behavior is undefined when value is anything other than a signed 16-bit integer.
The value is interpreted and written as a two's complement signed integer.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
copy
buf.writeInt32BE(value[, offset])
#
History













value <integer> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 4. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as big-endian. The value must be a valid signed 32-bit integer. Behavior is undefined when value is anything other than a signed 32-bit integer.
The value is interpreted and written as a two's complement signed integer.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
copy
buf.writeInt32LE(value[, offset])
#
History













value <integer> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 4. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as little-endian. The value must be a valid signed 32-bit integer. Behavior is undefined when value is anything other than a signed 32-bit integer.
The value is interpreted and written as a two's complement signed integer.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05>
copy
buf.writeIntBE(value, offset, byteLength)
#
History













value <integer> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - byteLength.
byteLength <integer> Number of bytes to write. Must satisfy 0 < byteLength <= 6.
Returns: <integer> offset plus the number of bytes written.
Writes byteLength bytes of value to buf at the specified offset as big-endian. Supports up to 48 bits of accuracy. Behavior is undefined when value is anything other than a signed integer.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
copy
buf.writeIntLE(value, offset, byteLength)
#
History













value <integer> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - byteLength.
byteLength <integer> Number of bytes to write. Must satisfy 0 < byteLength <= 6.
Returns: <integer> offset plus the number of bytes written.
Writes byteLength bytes of value to buf at the specified offset as little-endian. Supports up to 48 bits of accuracy. Behavior is undefined when value is anything other than a signed integer.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
copy
buf.writeUInt8(value[, offset])
#
History

















value <integer> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 1. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset. value must be a valid unsigned 8-bit integer. Behavior is undefined when value is anything other than an unsigned 8-bit integer.
This function is also available under the writeUint8 alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Prints: <Buffer 03 04 23 42>
copy
buf.writeUInt16BE(value[, offset])
#
History

















value <integer> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 2. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as big-endian. The value must be a valid unsigned 16-bit integer. Behavior is undefined when value is anything other than an unsigned 16-bit integer.
This function is also available under the writeUint16BE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
copy
buf.writeUInt16LE(value[, offset])
#
History

















value <integer> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 2. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as little-endian. The value must be a valid unsigned 16-bit integer. Behavior is undefined when value is anything other than an unsigned 16-bit integer.
This function is also available under the writeUint16LE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
copy
buf.writeUInt32BE(value[, offset])
#
History

















value <integer> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 4. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as big-endian. The value must be a valid unsigned 32-bit integer. Behavior is undefined when value is anything other than an unsigned 32-bit integer.
This function is also available under the writeUint32BE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer fe ed fa ce>
copy
buf.writeUInt32LE(value[, offset])
#
History

















value <integer> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - 4. Default: 0.
Returns: <integer> offset plus the number of bytes written.
Writes value to buf at the specified offset as little-endian. The value must be a valid unsigned 32-bit integer. Behavior is undefined when value is anything other than an unsigned 32-bit integer.
This function is also available under the writeUint32LE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer ce fa ed fe>
copy
buf.writeUIntBE(value, offset, byteLength)
#
History

















value <integer> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - byteLength.
byteLength <integer> Number of bytes to write. Must satisfy 0 < byteLength <= 6.
Returns: <integer> offset plus the number of bytes written.
Writes byteLength bytes of value to buf at the specified offset as big-endian. Supports up to 48 bits of accuracy. Behavior is undefined when value is anything other than an unsigned integer.
This function is also available under the writeUintBE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
copy
buf.writeUIntLE(value, offset, byteLength)
#
History

















value <integer> Number to be written to buf.
offset <integer> Number of bytes to skip before starting to write. Must satisfy 0 <= offset <= buf.length - byteLength.
byteLength <integer> Number of bytes to write. Must satisfy 0 < byteLength <= 6.
Returns: <integer> offset plus the number of bytes written.
Writes byteLength bytes of value to buf at the specified offset as little-endian. Supports up to 48 bits of accuracy. Behavior is undefined when value is anything other than an unsigned integer.
This function is also available under the writeUintLE alias.
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
copy
new Buffer(array)
#
History





















Stability: 0 - Deprecated: Use Buffer.from(array) instead.
array <integer[]> An array of bytes to copy from.
See Buffer.from(array).
new Buffer(arrayBuffer[, byteOffset[, length]])
#
History





























Stability: 0 - Deprecated: Use Buffer.from(arrayBuffer[, byteOffset[, length]]) instead.
arrayBuffer <ArrayBuffer> | <SharedArrayBuffer> An <ArrayBuffer>, <SharedArrayBuffer> or the .buffer property of a <TypedArray>.
byteOffset <integer> Index of first byte to expose. Default: 0.
length <integer> Number of bytes to expose. Default: arrayBuffer.byteLength - byteOffset.
See Buffer.from(arrayBuffer[, byteOffset[, length]]).
new Buffer(buffer)
#
History





















Stability: 0 - Deprecated: Use Buffer.from(buffer) instead.
buffer <Buffer> | <Uint8Array> An existing Buffer or <Uint8Array> from which to copy data.
See Buffer.from(buffer).
new Buffer(size)
#
History

























Stability: 0 - Deprecated: Use Buffer.alloc() instead (also see Buffer.allocUnsafe()).
size <integer> The desired length of the new Buffer.
See Buffer.alloc() and Buffer.allocUnsafe(). This variant of the constructor is equivalent to Buffer.alloc().
new Buffer(string[, encoding])
#
History





















Stability: 0 - Deprecated: Use Buffer.from(string[, encoding]) instead.
string <string> String to encode.
encoding <string> The encoding of string. Default: 'utf8'.
See Buffer.from(string[, encoding]).
Class: File
#
History

















Extends: <Blob>
A <File> provides information about files.
new buffer.File(sources, fileName[, options])
#
Added in: v19.2.0, v18.13.0
sources <string[]> | <ArrayBuffer[]> | <TypedArray[]> | <DataView[]> | <Blob[]> | <File[]> An array of string, <ArrayBuffer>, <TypedArray>, <DataView>, <File>, or <Blob> objects, or any mix of such objects, that will be stored within the File.
fileName <string> The name of the file.
options <Object>
endings <string> One of either 'transparent' or 'native'. When set to 'native', line endings in string source parts will be converted to the platform native line-ending as specified by require('node:os').EOL.
type <string> The File content-type.
lastModified <number> The last modified date of the file. Default: Date.now().
file.name
#
Added in: v19.2.0, v18.13.0
Type: <string>
The name of the File.
file.lastModified
#
Added in: v19.2.0, v18.13.0
Type: <number>
The last modified date of the File.
node:buffer module APIs
#
While, the Buffer object is available as a global, there are additional Buffer-related APIs that are available only via the node:buffer module accessed using require('node:buffer').
buffer.atob(data)
#
Added in: v15.13.0, v14.17.0
Stability: 3 - Legacy. Use Buffer.from(data, 'base64') instead.
data <any> The Base64-encoded input string.
Decodes a string of Base64-encoded data into bytes, and encodes those bytes into a string using Latin-1 (ISO-8859-1).
The data may be any JavaScript-value that can be coerced into a string.
This function is only provided for compatibility with legacy web platform APIs and should never be used in new code, because they use strings to represent binary data and predate the introduction of typed arrays in JavaScript. For code running using Node.js APIs, converting between base64-encoded strings and binary data should be performed using Buffer.from(str, 'base64') and buf.toString('base64').
buffer.btoa(data)
#
Added in: v15.13.0, v14.17.0
Stability: 3 - Legacy. Use buf.toString('base64') instead.
data <any> An ASCII (Latin1) string.
Decodes a string into bytes using Latin-1 (ISO-8859), and encodes those bytes into a string using Base64.
The data may be any JavaScript-value that can be coerced into a string.
This function is only provided for compatibility with legacy web platform APIs and should never be used in new code, because they use strings to represent binary data and predate the introduction of typed arrays in JavaScript. For code running using Node.js APIs, converting between base64-encoded strings and binary data should be performed using Buffer.from(str, 'base64') and buf.toString('base64').
buffer.isAscii(input)
#
Added in: v19.6.0, v18.15.0
input <Buffer> | <ArrayBuffer> | <TypedArray> The input to validate.
Returns: <boolean>
This function returns true if input contains only valid ASCII-encoded data, including the case in which input is empty.
Throws if the input is a detached array buffer.
buffer.isUtf8(input)
#
Added in: v19.4.0, v18.14.0
input <Buffer> | <ArrayBuffer> | <TypedArray> The input to validate.
Returns: <boolean>
This function returns true if input contains only valid UTF-8-encoded data, including the case in which input is empty.
Throws if the input is a detached array buffer.
buffer.INSPECT_MAX_BYTES
#
Added in: v0.5.4
<integer> Default: 50
Returns the maximum number of bytes that will be returned when buf.inspect() is called. This can be overridden by user modules. See util.inspect() for more details on buf.inspect() behavior.
buffer.kMaxLength
#
Added in: v3.0.0
<integer> The largest size allowed for a single Buffer instance.
An alias for buffer.constants.MAX_LENGTH.
buffer.kStringMaxLength
#
Added in: v3.0.0
<integer> The largest length allowed for a single string instance.
An alias for buffer.constants.MAX_STRING_LENGTH.
buffer.resolveObjectURL(id)
#
History













id <string> A 'blob:nodedata:... URL string returned by a prior call to URL.createObjectURL().
Returns: <Blob>
Resolves a 'blob:nodedata:...' an associated <Blob> object registered using a prior call to URL.createObjectURL().
buffer.transcode(source, fromEnc, toEnc)
#
History













source <Buffer> | <Uint8Array> A Buffer or Uint8Array instance.
fromEnc <string> The current encoding.
toEnc <string> To target encoding.
Returns: <Buffer>
Re-encodes the given Buffer or Uint8Array instance from one character encoding to another. Returns a new Buffer instance.
Throws if the fromEnc or toEnc specify invalid character encodings or if conversion from fromEnc to toEnc is not permitted.
Encodings supported by buffer.transcode() are: 'ascii', 'utf8', 'utf16le', 'ucs2', 'latin1', and 'binary'.
The transcoding process will use substitution characters if a given byte sequence cannot be adequately represented in the target encoding. For instance:
const { Buffer, transcode } = require('node:buffer');

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
copy
Because the Euro (€) sign is not representable in US-ASCII, it is replaced with ? in the transcoded Buffer.
Class: SlowBuffer
#
Deprecated since: v6.0.0
Stability: 0 - Deprecated: Use Buffer.allocUnsafeSlow() instead.
See Buffer.allocUnsafeSlow(). This was never a class in the sense that the constructor always returned a Buffer instance, rather than a SlowBuffer instance.
new SlowBuffer(size)
#
Deprecated since: v6.0.0
size <integer> The desired length of the new SlowBuffer.
See Buffer.allocUnsafeSlow().
Buffer constants
#
Added in: v8.2.0
buffer.constants.MAX_LENGTH
#
History





















<integer> The largest size allowed for a single Buffer instance.
On 32-bit architectures, this value currently is 230 - 1 (about 1 GiB).
On 64-bit architectures, this value currently is 253 - 1 (about 8 PiB).
It reflects v8::TypedArray::kMaxLength under the hood.
This value is also available as buffer.kMaxLength.
buffer.constants.MAX_STRING_LENGTH
#
Added in: v8.2.0
<integer> The largest length allowed for a single string instance.
Represents the largest length that a string primitive can have, counted in UTF-16 code units.
This value may depend on the JS engine that is being used.
Buffer.from(), Buffer.alloc(), and Buffer.allocUnsafe()
#
In versions of Node.js prior to 6.0.0, Buffer instances were created using the Buffer constructor function, which allocates the returned Buffer differently based on what arguments are provided:
Passing a number as the first argument to Buffer() (e.g. new Buffer(10)) allocates a new Buffer object of the specified size. Prior to Node.js 8.0.0, the memory allocated for such Buffer instances is not initialized and can contain sensitive data. Such Buffer instances must be subsequently initialized by using either buf.fill(0) or by writing to the entire Buffer before reading data from the Buffer. While this behavior is intentional to improve performance, development experience has demonstrated that a more explicit distinction is required between creating a fast-but-uninitialized Buffer versus creating a slower-but-safer Buffer. Since Node.js 8.0.0, Buffer(num) and new Buffer(num) return a Buffer with initialized memory.
Passing a string, array, or Buffer as the first argument copies the passed object's data into the Buffer.
Passing an <ArrayBuffer> or a <SharedArrayBuffer> returns a Buffer that shares allocated memory with the given array buffer.
Because the behavior of new Buffer() is different depending on the type of the first argument, security and reliability issues can be inadvertently introduced into applications when argument validation or Buffer initialization is not performed.
For example, if an attacker can cause an application to receive a number where a string is expected, the application may call new Buffer(100) instead of new Buffer("100"), leading it to allocate a 100 byte buffer instead of allocating a 3 byte buffer with content "100". This is commonly possible using JSON API calls. Since JSON distinguishes between numeric and string types, it allows injection of numbers where a naively written application that does not validate its input sufficiently might expect to always receive a string. Before Node.js 8.0.0, the 100 byte buffer might contain arbitrary pre-existing in-memory data, so may be used to expose in-memory secrets to a remote attacker. Since Node.js 8.0.0, exposure of memory cannot occur because the data is zero-filled. However, other attacks are still possible, such as causing very large buffers to be allocated by the server, leading to performance degradation or crashing on memory exhaustion.
To make the creation of Buffer instances more reliable and less error-prone, the various forms of the new Buffer() constructor have been deprecated and replaced by separate Buffer.from(), Buffer.alloc(), and Buffer.allocUnsafe() methods.
Developers should migrate all existing uses of the new Buffer() constructors to one of these new APIs.
Buffer.from(array) returns a new Buffer that contains a copy of the provided octets.
Buffer.from(arrayBuffer[, byteOffset[, length]]) returns a new Buffer that shares the same allocated memory as the given <ArrayBuffer>.
Buffer.from(buffer) returns a new Buffer that contains a copy of the contents of the given Buffer.
Buffer.from(string[, encoding]) returns a new Buffer that contains a copy of the provided string.
Buffer.alloc(size[, fill[, encoding]]) returns a new initialized Buffer of the specified size. This method is slower than Buffer.allocUnsafe(size) but guarantees that newly created Buffer instances never contain old data that is potentially sensitive. A TypeError will be thrown if size is not a number.
Buffer.allocUnsafe(size) and Buffer.allocUnsafeSlow(size) each return a new uninitialized Buffer of the specified size. Because the Buffer is uninitialized, the allocated segment of memory might contain old data that is potentially sensitive.
Buffer instances returned by Buffer.allocUnsafe(), Buffer.from(string), Buffer.concat() and Buffer.from(array) may be allocated off a shared internal memory pool if size is less than or equal to half Buffer.poolSize. Instances returned by Buffer.allocUnsafeSlow() never use the shared internal memory pool.
The --zero-fill-buffers command-line option
#
Added in: v5.10.0
Node.js can be started using the --zero-fill-buffers command-line option to cause all newly-allocated Buffer instances to be zero-filled upon creation by default. Without the option, buffers created with Buffer.allocUnsafe(), Buffer.allocUnsafeSlow(), and new SlowBuffer(size) are not zero-filled. Use of this flag can have a measurable negative impact on performance. Use the --zero-fill-buffers option only when necessary to enforce that newly allocated Buffer instances cannot contain old data that is potentially sensitive.
$ node --zero-fill-buffers
> Buffer.allocUnsafe(5);
<Buffer 00 00 00 00 00>
copy
What makes Buffer.allocUnsafe() and Buffer.allocUnsafeSlow() "unsafe"?
#
When calling Buffer.allocUnsafe() and Buffer.allocUnsafeSlow(), the segment of allocated memory is uninitialized (it is not zeroed-out). While this design makes the allocation of memory quite fast, the allocated segment of memory might contain old data that is potentially sensitive. Using a Buffer created by Buffer.allocUnsafe() without completely overwriting the memory can allow this old data to be leaked when the Buffer memory is read.
While there are clear performance advantages to using Buffer.allocUnsafe(), extra care must be taken in order to avoid introducing security vulnerabilities into an application.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
C++ addons
Hello world
Context-aware addons
Worker support
Building
Linking to libraries included with Node.js
Loading addons using require()
Native abstractions for Node.js
Node-API
Addon examples
Function arguments
Callbacks
Object factory
Function factory
Wrapping C++ objects
Factory of wrapped objects
Passing wrapped objects around
C++ addons
#
Addons are dynamically-linked shared objects written in C++. The require() function can load addons as ordinary Node.js modules. Addons provide an interface between JavaScript and C/C++ libraries.
There are three options for implementing addons:
Node-API
nan (Native Abstractions for Node.js)
direct use of internal V8, libuv, and Node.js libraries
Unless there is a need for direct access to functionality which is not
exposed by Node-API, use Node-API. Refer to C/C++ addons with Node-API for more information on Node-API.
When not using Node-API, implementing addons becomes more complex, requiring
knowledge of multiple components and APIs:
V8: the C++ library Node.js uses to provide the JavaScript implementation. It provides the mechanisms for creating objects, calling functions, etc. The V8's API is documented mostly in the v8.h header file (deps/v8/include/v8.h in the Node.js source tree), and is also available online.
libuv: The C library that implements the Node.js event loop, its worker threads and all of the asynchronous behaviors of the platform. It also serves as a cross-platform abstraction library, giving easy, POSIX-like access across all major operating systems to many common system tasks, such as interacting with the file system, sockets, timers, and system events. libuv also provides a threading abstraction similar to POSIX threads for more sophisticated asynchronous addons that need to move beyond the standard event loop. Addon authors should avoid blocking the event loop with I/O or other time-intensive tasks by offloading work via libuv to non-blocking system operations, worker threads, or a custom use of libuv threads.
Internal Node.js libraries: Node.js itself exports C++ APIs that addons can use, the most important of which is the node::ObjectWrap class.
Other statically linked libraries (including OpenSSL): These other libraries are located in the deps/ directory in the Node.js source tree. Only the libuv, OpenSSL, V8, and zlib symbols are purposefully re-exported by Node.js and may be used to various extents by addons. See Linking to libraries included with Node.js for additional information.
All of the following examples are available for download and may be used as the starting-point for an addon.
Hello world
#
This "Hello world" example is a simple addon, written in C++, that is the equivalent of the following JavaScript code:
module.exports.hello = () => 'world';
copy
First, create the file hello.cc:
// hello.cc
#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "world", NewStringType::kNormal).ToLocalChecked());
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo
copy
All Node.js addons must export an initialization function following the pattern:
void Initialize(Local<Object> exports);
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
copy
There is no semi-colon after NODE_MODULE as it's not a function (see node.h).
The module_name must match the filename of the final binary (excluding the .node suffix).
In the hello.cc example, then, the initialization function is Initialize and the addon module name is addon.
When building addons with node-gyp, using the macro NODE_GYP_MODULE_NAME as the first parameter of NODE_MODULE() will ensure that the name of the final binary will be passed to NODE_MODULE().
Addons defined with NODE_MODULE() can not be loaded in multiple contexts or multiple threads at the same time.
Context-aware addons
#
There are environments in which Node.js addons may need to be loaded multiple times in multiple contexts. For example, the Electron runtime runs multiple instances of Node.js in a single process. Each instance will have its own require() cache, and thus each instance will need a native addon to behave correctly when loaded via require(). This means that the addon must support multiple initializations.
A context-aware addon can be constructed by using the macro NODE_MODULE_INITIALIZER, which expands to the name of a function which Node.js will expect to find when it loads an addon. An addon can thus be initialized as in the following example:
using namespace v8;

extern "C" NODE_MODULE_EXPORT void
NODE_MODULE_INITIALIZER(Local<Object> exports,
                        Local<Value> module,
                        Local<Context> context) {
  /* Perform addon initialization steps here. */
}
copy
Another option is to use the macro NODE_MODULE_INIT(), which will also construct a context-aware addon. Unlike NODE_MODULE(), which is used to construct an addon around a given addon initializer function, NODE_MODULE_INIT() serves as the declaration of such an initializer to be followed by a function body.
The following three variables may be used inside the function body following an invocation of NODE_MODULE_INIT():
Local<Object> exports,
Local<Value> module, and
Local<Context> context
Building a context-aware addon requires careful management of global static data to ensure stability and correctness. Since the addon may be loaded multiple times, potentially even from different threads, any global static data stored in the addon must be properly protected, and must not contain any persistent references to JavaScript objects. The reason for this is that JavaScript objects are only valid in one context, and will likely cause a crash when accessed from the wrong context or from a different thread than the one on which they were created.
The context-aware addon can be structured to avoid global static data by performing the following steps:
Define a class which will hold per-addon-instance data and which has a static member of the form
static void DeleteInstance(void* data) {
  // Cast `data` to an instance of the class and delete it.
}
copy
Heap-allocate an instance of this class in the addon initializer. This can be accomplished using the new keyword.
Call node::AddEnvironmentCleanupHook(), passing it the above-created instance and a pointer to DeleteInstance(). This will ensure the instance is deleted when the environment is torn down.
Store the instance of the class in a v8::External, and
Pass the v8::External to all methods exposed to JavaScript by passing it to v8::FunctionTemplate::New() or v8::Function::New() which creates the native-backed JavaScript functions. The third parameter of v8::FunctionTemplate::New() or v8::Function::New() accepts the v8::External and makes it available in the native callback using the v8::FunctionCallbackInfo::Data() method.
This will ensure that the per-addon-instance data reaches each binding that can be called from JavaScript. The per-addon-instance data must also be passed into any asynchronous callbacks the addon may create.
The following example illustrates the implementation of a context-aware addon:
#include <node.h>

using namespace v8;

class AddonData {
 public:
  explicit AddonData(Isolate* isolate):
      call_count(0) {
    // Ensure this per-addon-instance data is deleted at environment cleanup.
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  // Per-addon data.
  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

static void Method(const v8::FunctionCallbackInfo<v8::Value>& info) {
  // Retrieve the per-addon-instance data.
  AddonData* data =
      reinterpret_cast<AddonData*>(info.Data().As<External>()->Value());
  data->call_count++;
  info.GetReturnValue().Set((double)data->call_count);
}

// Initialize this addon to be context-aware.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  // Create a new instance of `AddonData` for this instance of the addon and
  // tie its life cycle to that of the Node.js environment.
  AddonData* data = new AddonData(isolate);

  // Wrap the data in a `v8::External` so we can pass it to the method we
  // expose.
  Local<External> external = External::New(isolate, data);

  // Expose the method `Method` to JavaScript, and make sure it receives the
  // per-addon-instance data we created above by passing `external` as the
  // third parameter to the `FunctionTemplate` constructor.
  exports->Set(context,
               String::NewFromUtf8(isolate, "method").ToLocalChecked(),
               FunctionTemplate::New(isolate, Method, external)
                  ->GetFunction(context).ToLocalChecked()).FromJust();
}
copy
Worker support
#
History









In order to be loaded from multiple Node.js environments, such as a main thread and a Worker thread, an add-on needs to either:
Be an Node-API addon, or
Be declared as context-aware using NODE_MODULE_INIT() as described above
In order to support Worker threads, addons need to clean up any resources they may have allocated when such a thread exits. This can be achieved through the usage of the AddEnvironmentCleanupHook() function:
void AddEnvironmentCleanupHook(v8::Isolate* isolate,
                               void (*fun)(void* arg),
                               void* arg);
copy
This function adds a hook that will run before a given Node.js instance shuts down. If necessary, such hooks can be removed before they are run using RemoveEnvironmentCleanupHook(), which has the same signature. Callbacks are run in last-in first-out order.
If necessary, there is an additional pair of AddEnvironmentCleanupHook() and RemoveEnvironmentCleanupHook() overloads, where the cleanup hook takes a callback function. This can be used for shutting down asynchronous resources, such as any libuv handles registered by the addon.
The following addon.cc uses AddEnvironmentCleanupHook:
// addon.cc
#include <node.h>
#include <assert.h>
#include <stdlib.h>

using node::AddEnvironmentCleanupHook;
using v8::HandleScope;
using v8::Isolate;
using v8::Local;
using v8::Object;

// Note: In a real-world application, do not rely on static/global data.
static char cookie[] = "yum yum";
static int cleanup_cb1_called = 0;
static int cleanup_cb2_called = 0;

static void cleanup_cb1(void* arg) {
  Isolate* isolate = static_cast<Isolate*>(arg);
  HandleScope scope(isolate);
  Local<Object> obj = Object::New(isolate);
  assert(!obj.IsEmpty());  // assert VM is still alive
  assert(obj->IsObject());
  cleanup_cb1_called++;
}

static void cleanup_cb2(void* arg) {
  assert(arg == static_cast<void*>(cookie));
  cleanup_cb2_called++;
}

static void sanity_check(void*) {
  assert(cleanup_cb1_called == 1);
  assert(cleanup_cb2_called == 1);
}

// Initialize this addon to be context-aware.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  AddEnvironmentCleanupHook(isolate, sanity_check, nullptr);
  AddEnvironmentCleanupHook(isolate, cleanup_cb2, cookie);
  AddEnvironmentCleanupHook(isolate, cleanup_cb1, isolate);
}
copy
Test in JavaScript by running:
// test.js
require('./build/Release/addon');
copy
Building
#
Once the source code has been written, it must be compiled into the binary addon.node file. To do so, create a file called binding.gyp in the top-level of the project describing the build configuration of the module using a JSON-like format. This file is used by node-gyp, a tool written specifically to compile Node.js addons.
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "hello.cc" ]
    }
  ]
}
copy
A version of the node-gyp utility is bundled and distributed with Node.js as part of npm. This version is not made directly available for developers to use and is intended only to support the ability to use the npm install command to compile and install addons. Developers who wish to use node-gyp directly can install it using the command npm install -g node-gyp. See the node-gyp installation instructions for more information, including platform-specific requirements.
Once the binding.gyp file has been created, use node-gyp configure to generate the appropriate project build files for the current platform. This will generate either a Makefile (on Unix platforms) or a vcxproj file (on Windows) in the build/ directory.
Next, invoke the node-gyp build command to generate the compiled addon.node file. This will be put into the build/Release/ directory.
When using npm install to install a Node.js addon, npm uses its own bundled version of node-gyp to perform this same set of actions, generating a compiled version of the addon for the user's platform on demand.
Once built, the binary addon can be used from within Node.js by pointing require() to the built addon.node module:
// hello.js
const addon = require('./build/Release/addon');

console.log(addon.hello());
// Prints: 'world'
copy
Because the exact path to the compiled addon binary can vary depending on how it is compiled (i.e. sometimes it may be in ./build/Debug/), addons can use the bindings package to load the compiled module.
While the bindings package implementation is more sophisticated in how it locates addon modules, it is essentially using a try…catch pattern similar to:
try {
  return require('./build/Release/addon.node');
} catch (err) {
  return require('./build/Debug/addon.node');
}
copy
Linking to libraries included with Node.js
#
Node.js uses statically linked libraries such as V8, libuv, and OpenSSL. All addons are required to link to V8 and may link to any of the other dependencies as well. Typically, this is as simple as including the appropriate #include <...> statements (e.g. #include <v8.h>) and node-gyp will locate the appropriate headers automatically. However, there are a few caveats to be aware of:
When node-gyp runs, it will detect the specific release version of Node.js and download either the full source tarball or just the headers. If the full source is downloaded, addons will have complete access to the full set of Node.js dependencies. However, if only the Node.js headers are downloaded, then only the symbols exported by Node.js will be available.
node-gyp can be run using the --nodedir flag pointing at a local Node.js source image. Using this option, the addon will have access to the full set of dependencies.
Loading addons using require()
#
The filename extension of the compiled addon binary is .node (as opposed to .dll or .so). The require() function is written to look for files with the .node file extension and initialize those as dynamically-linked libraries.
When calling require(), the .node extension can usually be omitted and Node.js will still find and initialize the addon. One caveat, however, is that Node.js will first attempt to locate and load modules or JavaScript files that happen to share the same base name. For instance, if there is a file addon.js in the same directory as the binary addon.node, then require('addon') will give precedence to the addon.js file and load it instead.
Native abstractions for Node.js
#
Each of the examples illustrated in this document directly use the Node.js and V8 APIs for implementing addons. The V8 API can, and has, changed dramatically from one V8 release to the next (and one major Node.js release to the next). With each change, addons may need to be updated and recompiled in order to continue functioning. The Node.js release schedule is designed to minimize the frequency and impact of such changes but there is little that Node.js can do to ensure stability of the V8 APIs.
The Native Abstractions for Node.js (or nan) provide a set of tools that addon developers are recommended to use to keep compatibility between past and future releases of V8 and Node.js. See the nan examples for an illustration of how it can be used.
Node-API
#
Stability: 2 - Stable
Node-API is an API for building native addons. It is independent from the underlying JavaScript runtime (e.g. V8) and is maintained as part of Node.js itself. This API will be Application Binary Interface (ABI) stable across versions of Node.js. It is intended to insulate addons from changes in the underlying JavaScript engine and allow modules compiled for one version to run on later versions of Node.js without recompilation. Addons are built/packaged with the same approach/tools outlined in this document (node-gyp, etc.). The only difference is the set of APIs that are used by the native code. Instead of using the V8 or Native Abstractions for Node.js APIs, the functions available in the Node-API are used.
Creating and maintaining an addon that benefits from the ABI stability provided by Node-API carries with it certain implementation considerations.
To use Node-API in the above "Hello world" example, replace the content of hello.cc with the following. All other instructions remain the same.
// hello.cc using Node-API
#include <node_api.h>

namespace demo {

napi_value Method(napi_env env, napi_callback_info args) {
  napi_value greeting;
  napi_status status;

  status = napi_create_string_utf8(env, "world", NAPI_AUTO_LENGTH, &greeting);
  if (status != napi_ok) return nullptr;
  return greeting;
}

napi_value init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;

  status = napi_create_function(env, nullptr, 0, Method, nullptr, &fn);
  if (status != napi_ok) return nullptr;

  status = napi_set_named_property(env, exports, "hello", fn);
  if (status != napi_ok) return nullptr;
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)

}  // namespace demo
copy
The functions available and how to use them are documented in C/C++ addons with Node-API.
Addon examples
#
Following are some example addons intended to help developers get started. The examples use the V8 APIs. Refer to the online V8 reference for help with the various V8 calls, and V8's Embedder's Guide for an explanation of several concepts used such as handles, scopes, function templates, etc.
Each of these examples using the following binding.gyp file:
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "addon.cc" ]
    }
  ]
}
copy
In cases where there is more than one .cc file, simply add the additional filename to the sources array:
"sources": ["addon.cc", "myexample.cc"]
copy
Once the binding.gyp file is ready, the example addons can be configured and built using node-gyp:
node-gyp configure build
copy
Function arguments
#
Addons will typically expose objects and functions that can be accessed from JavaScript running within Node.js. When functions are invoked from JavaScript, the input arguments and return value must be mapped to and from the C/C++ code.
The following example illustrates how to read function arguments passed from JavaScript and how to return a result:
// addon.cc
#include <node.h>

namespace demo {

using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// This is the implementation of the "add" method
// Input arguments are passed using the
// const FunctionCallbackInfo<Value>& args struct
void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // Check the number of arguments passed.
  if (args.Length() < 2) {
    // Throw an Error that is passed back to JavaScript
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong number of arguments").ToLocalChecked()));
    return;
  }

  // Check the argument types
  if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong arguments").ToLocalChecked()));
    return;
  }

  // Perform the operation
  double value =
      args[0].As<Number>()->Value() + args[1].As<Number>()->Value();
  Local<Number> num = Number::New(isolate, value);

  // Set the return value (using the passed in
  // FunctionCallbackInfo<Value>&)
  args.GetReturnValue().Set(num);
}

void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
copy
Once compiled, the example addon can be required and used from within Node.js:
// test.js
const addon = require('./build/Release/addon');

console.log('This should be eight:', addon.add(3, 5));
copy
Callbacks
#
It is common practice within addons to pass JavaScript functions to a C++ function and execute them from there. The following example illustrates how to invoke such callbacks:
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Null;
using v8::Object;
using v8::String;
using v8::Value;

void RunCallback(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  Local<Function> cb = Local<Function>::Cast(args[0]);
  const unsigned argc = 1;
  Local<Value> argv[argc] = {
      String::NewFromUtf8(isolate,
                          "hello world").ToLocalChecked() };
  cb->Call(context, Null(isolate), argc, argv).ToLocalChecked();
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", RunCallback);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
copy
This example uses a two-argument form of Init() that receives the full module object as the second argument. This allows the addon to completely overwrite exports with a single function instead of adding the function as a property of exports.
To test it, run the following JavaScript:
// test.js
const addon = require('./build/Release/addon');

addon((msg) => {
  console.log(msg);
// Prints: 'hello world'
});
copy
In this example, the callback function is invoked synchronously.
Object factory
#
Addons can create and return new objects from within a C++ function as illustrated in the following example. An object is created and returned with a property msg that echoes the string passed to createObject():
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<Object> obj = Object::New(isolate);
  obj->Set(context,
           String::NewFromUtf8(isolate,
                               "msg").ToLocalChecked(),
                               args[0]->ToString(context).ToLocalChecked())
           .FromJust();

  args.GetReturnValue().Set(obj);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
copy
To test it in JavaScript:
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon('hello');
const obj2 = addon('world');
console.log(obj1.msg, obj2.msg);
// Prints: 'hello world'
copy
Function factory
#
Another common scenario is creating JavaScript functions that wrap C++ functions and returning those back to JavaScript:
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void MyFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "hello world").ToLocalChecked());
}

void CreateFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Context> context = isolate->GetCurrentContext();
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, MyFunction);
  Local<Function> fn = tpl->GetFunction(context).ToLocalChecked();

  // omit this to make it anonymous
  fn->SetName(String::NewFromUtf8(
      isolate, "theFunction").ToLocalChecked());

  args.GetReturnValue().Set(fn);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateFunction);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
copy
To test:
// test.js
const addon = require('./build/Release/addon');

const fn = addon();
console.log(fn());
// Prints: 'hello world'
copy
Wrapping C++ objects
#
It is also possible to wrap C++ objects/classes in a way that allows new instances to be created using the JavaScript new operator:
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports) {
  MyObject::Init(exports);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
copy
Then, in myobject.h, the wrapper class inherits from node::ObjectWrap:
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Local<v8::Object> exports);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);

  double value_;
};

}  // namespace demo

#endif
copy
In myobject.cc, implement the various methods that are to be exposed. In the following code, the method plusOne() is exposed by adding it to the constructor's prototype:
// myobject.cc
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::ObjectTemplate;
using v8::String;
using v8::Value;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Local<Object> exports) {
  Isolate* isolate = exports->GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<ObjectTemplate> addon_data_tpl = ObjectTemplate::New(isolate);
  addon_data_tpl->SetInternalFieldCount(1);  // 1 field for the MyObject::New()
  Local<Object> addon_data =
      addon_data_tpl->NewInstance(context).ToLocalChecked();

  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New, addon_data);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Function> constructor = tpl->GetFunction(context).ToLocalChecked();
  addon_data->SetInternalField(0, constructor);
  exports->Set(context, String::NewFromUtf8(
      isolate, "MyObject").ToLocalChecked(),
      constructor).FromJust();
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons =
        args.Data().As<Object>()->GetInternalField(0)
            .As<Value>().As<Function>();
    Local<Object> result =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(result);
  }
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
copy
To build this example, the myobject.cc file must be added to the binding.gyp:
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
copy
Test it with:
// test.js
const addon = require('./build/Release/addon');

const obj = new addon.MyObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13
copy
The destructor for a wrapper object will run when the object is garbage-collected. For destructor testing, there are command-line flags that can be used to make it possible to force garbage collection. These flags are provided by the underlying V8 JavaScript engine. They are subject to change or removal at any time. They are not documented by Node.js or V8, and they should never be used outside of testing.
During shutdown of the process or worker threads destructors are not called by the JS engine. Therefore it's the responsibility of the user to track these objects and ensure proper destruction to avoid resource leaks.
Factory of wrapped objects
#
Alternatively, it is possible to use a factory pattern to avoid explicitly creating object instances using the JavaScript new operator:
const obj = addon.createObject();
// instead of:
// const obj = new addon.Object();
copy
First, the createObject() method is implemented in addon.cc:
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void InitAll(Local<Object> exports, Local<Object> module) {
  MyObject::Init(exports->GetIsolate());

  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
copy
In myobject.h, the static method NewInstance() is added to handle instantiating the object. This method takes the place of using new in JavaScript:
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Isolate* isolate);
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
copy
The implementation in myobject.cc is similar to the previous example:
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// Warning! This is not thread-safe, this addon cannot be used for worker
// threads.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
copy
Once again, to build this example, the myobject.cc file must be added to the binding.gyp:
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
copy
Test it with:
// test.js
const createObject = require('./build/Release/addon');

const obj = createObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13

const obj2 = createObject(20);
console.log(obj2.plusOne());
// Prints: 21
console.log(obj2.plusOne());
// Prints: 22
console.log(obj2.plusOne());
// Prints: 23
copy
Passing wrapped objects around
#
In addition to wrapping and returning C++ objects, it is possible to pass wrapped objects around by unwrapping them with the Node.js helper function node::ObjectWrap::Unwrap. The following examples shows a function add() that can take two MyObject objects as input arguments:
// addon.cc
#include <node.h>
#include <node_object_wrap.h>
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  MyObject* obj1 = node::ObjectWrap::Unwrap<MyObject>(
      args[0]->ToObject(context).ToLocalChecked());
  MyObject* obj2 = node::ObjectWrap::Unwrap<MyObject>(
      args[1]->ToObject(context).ToLocalChecked());

  double sum = obj1->value() + obj2->value();
  args.GetReturnValue().Set(Number::New(isolate, sum));
}

void InitAll(Local<Object> exports) {
  MyObject::Init(exports->GetIsolate());

  NODE_SET_METHOD(exports, "createObject", CreateObject);
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
copy
In myobject.h, a new public method is added to allow access to private values after unwrapping the object.
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Isolate* isolate);
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);
  inline double value() const { return value_; }

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
copy
The implementation of myobject.cc remains similar to the previous version:
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

// Warning! This is not thread-safe, this addon cannot be used for worker
// threads.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

}  // namespace demo
copy
Test it with:
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon.createObject(10);
const obj2 = addon.createObject(20);
const result = addon.add(obj1, obj2);

console.log(result);
// Prints: 30
copy
Node.js v24.4.1
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Node-API
Implications of ABI stability
Building
Build tools
node-gyp
CMake.js
Uploading precompiled binaries
node-pre-gyp
prebuild
prebuildify
Usage
Node-API version matrix
Environment life cycle APIs
napi_set_instance_data
napi_get_instance_data
Basic Node-API data types
napi_status
napi_extended_error_info
napi_env
node_api_basic_env
napi_value
napi_threadsafe_function
napi_threadsafe_function_release_mode
napi_threadsafe_function_call_mode
Node-API memory management types
napi_handle_scope
napi_escapable_handle_scope
napi_ref
napi_type_tag
napi_async_cleanup_hook_handle
Node-API callback types
napi_callback_info
napi_callback
node_api_basic_finalize
napi_finalize
napi_async_execute_callback
napi_async_complete_callback
napi_threadsafe_function_call_js
napi_cleanup_hook
napi_async_cleanup_hook
Error handling
Return values
napi_get_last_error_info
Exceptions
napi_throw
napi_throw_error
napi_throw_type_error
napi_throw_range_error
node_api_throw_syntax_error
napi_is_error
napi_create_error
napi_create_type_error
napi_create_range_error
node_api_create_syntax_error
napi_get_and_clear_last_exception
napi_is_exception_pending
napi_fatal_exception
Fatal errors
napi_fatal_error
Object lifetime management
Making handle lifespan shorter than that of the native method
napi_open_handle_scope
napi_close_handle_scope
napi_open_escapable_handle_scope
napi_close_escapable_handle_scope
napi_escape_handle
References to values with a lifespan longer than that of the native method
napi_create_reference
napi_delete_reference
napi_reference_ref
napi_reference_unref
napi_get_reference_value
Cleanup on exit of the current Node.js environment
napi_add_env_cleanup_hook
napi_remove_env_cleanup_hook
napi_add_async_cleanup_hook
napi_remove_async_cleanup_hook
Finalization on the exit of the Node.js environment
Module registration
Working with JavaScript values
Enum types
napi_key_collection_mode
napi_key_filter
napi_key_conversion
napi_valuetype
napi_typedarray_type
Object creation functions
napi_create_array
napi_create_array_with_length
napi_create_arraybuffer
napi_create_buffer
napi_create_buffer_copy
napi_create_date
napi_create_external
napi_create_external_arraybuffer
napi_create_external_buffer
napi_create_object
napi_create_symbol
node_api_symbol_for
napi_create_typedarray
node_api_create_buffer_from_arraybuffer
napi_create_dataview
Functions to convert from C types to Node-API
napi_create_int32
napi_create_uint32
napi_create_int64
napi_create_double
napi_create_bigint_int64
napi_create_bigint_uint64
napi_create_bigint_words
napi_create_string_latin1
node_api_create_external_string_latin1
napi_create_string_utf16
node_api_create_external_string_utf16
napi_create_string_utf8
Functions to create optimized property keys
node_api_create_property_key_latin1
node_api_create_property_key_utf16
node_api_create_property_key_utf8
Functions to convert from Node-API to C types
napi_get_array_length
napi_get_arraybuffer_info
napi_get_buffer_info
napi_get_prototype
napi_get_typedarray_info
napi_get_dataview_info
napi_get_date_value
napi_get_value_bool
napi_get_value_double
napi_get_value_bigint_int64
napi_get_value_bigint_uint64
napi_get_value_bigint_words
napi_get_value_external
napi_get_value_int32
napi_get_value_int64
napi_get_value_string_latin1
napi_get_value_string_utf8
napi_get_value_string_utf16
napi_get_value_uint32
Functions to get global instances
napi_get_boolean
napi_get_global
napi_get_null
napi_get_undefined
Working with JavaScript values and abstract operations
napi_coerce_to_bool
napi_coerce_to_number
napi_coerce_to_object
napi_coerce_to_string
napi_typeof
napi_instanceof
napi_is_array
napi_is_arraybuffer
napi_is_buffer
napi_is_date
napi_is_error
napi_is_typedarray
napi_is_dataview
napi_strict_equals
napi_detach_arraybuffer
napi_is_detached_arraybuffer
Working with JavaScript properties
Structures
napi_property_attributes
napi_property_descriptor
Functions
napi_get_property_names
napi_get_all_property_names
napi_set_property
napi_get_property
napi_has_property
napi_delete_property
napi_has_own_property
napi_set_named_property
napi_get_named_property
napi_has_named_property
napi_set_element
napi_get_element
napi_has_element
napi_delete_element
napi_define_properties
napi_object_freeze
napi_object_seal
Working with JavaScript functions
napi_call_function
napi_create_function
napi_get_cb_info
napi_get_new_target
napi_new_instance
Object wrap
napi_define_class
napi_wrap
napi_unwrap
napi_remove_wrap
napi_type_tag_object
napi_check_object_type_tag
napi_add_finalizer
node_api_post_finalizer
Simple asynchronous operations
napi_create_async_work
napi_delete_async_work
napi_queue_async_work
napi_cancel_async_work
Custom asynchronous operations
napi_async_init
napi_async_destroy
napi_make_callback
napi_open_callback_scope
napi_close_callback_scope
Version management
napi_get_node_version
napi_get_version
Memory management
napi_adjust_external_memory
Promises
napi_create_promise
napi_resolve_deferred
napi_reject_deferred
napi_is_promise
Script execution
napi_run_script
libuv event loop
napi_get_uv_event_loop
Asynchronous thread-safe function calls
Calling a thread-safe function
Reference counting of thread-safe functions
Deciding whether to keep the process running
napi_create_threadsafe_function
napi_get_threadsafe_function_context
napi_call_threadsafe_function
napi_acquire_threadsafe_function
napi_release_threadsafe_function
napi_ref_threadsafe_function
napi_unref_threadsafe_function
Miscellaneous utilities
node_api_get_module_file_name
Node-API
#
Stability: 2 - Stable
Node-API (formerly N-API) is an API for building native Addons. It is independent from the underlying JavaScript runtime (for example, V8) and is maintained as part of Node.js itself. This API will be Application Binary Interface (ABI) stable across versions of Node.js. It is intended to insulate addons from changes in the underlying JavaScript engine and allow modules compiled for one major version to run on later major versions of Node.js without recompilation. The ABI Stability guide provides a more in-depth explanation.
Addons are built/packaged with the same approach/tools outlined in the section titled C++ Addons. The only difference is the set of APIs that are used by the native code. Instead of using the V8 or Native Abstractions for Node.js APIs, the functions available in Node-API are used.
APIs exposed by Node-API are generally used to create and manipulate JavaScript values. Concepts and operations generally map to ideas specified in the ECMA-262 Language Specification. The APIs have the following properties:
All Node-API calls return a status code of type napi_status. This status indicates whether the API call succeeded or failed.
The API's return value is passed via an out parameter.
All JavaScript values are abstracted behind an opaque type named napi_value.
In case of an error status code, additional information can be obtained using napi_get_last_error_info. More information can be found in the error handling section Error handling.
Node-API is a C API that ensures ABI stability across Node.js versions and different compiler levels. A C++ API can be easier to use. To support using C++, the project maintains a C++ wrapper module called node-addon-api. This wrapper provides an inlinable C++ API. Binaries built with node-addon-api will depend on the symbols for the Node-API C-based functions exported by Node.js. node-addon-api is a more efficient way to write code that calls Node-API. Take, for example, the following node-addon-api code. The first section shows the node-addon-api code and the second section shows what actually gets used in the addon.
Object obj = Object::New(env);
obj["foo"] = String::New(env, "bar");
copy
napi_status status;
napi_value object, string;
status = napi_create_object(env, &object);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}


status = napi_create_string_utf8(env, "bar", NAPI_AUTO_LENGTH, &string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}


status = napi_set_named_property(env, object, "foo", string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}
copy
The end result is that the addon only uses the exported C APIs. As a result, it still gets the benefits of the ABI stability provided by the C API.
When using node-addon-api instead of the C APIs, start with the API docs for node-addon-api.
The Node-API Resource offers an excellent orientation and tips for developers just getting started with Node-API and node-addon-api. Additional media resources can be found on the Node-API Media page.
Implications of ABI stability
#
Although Node-API provides an ABI stability guarantee, other parts of Node.js do not, and any external libraries used from the addon may not. In particular, none of the following APIs provide an ABI stability guarantee across major versions:
the Node.js C++ APIs available via any of
#include <node.h>
#include <node_buffer.h>
#include <node_version.h>
#include <node_object_wrap.h>
copy
the libuv APIs which are also included with Node.js and available via
#include <uv.h>
copy
the V8 API available via
#include <v8.h>
copy
Thus, for an addon to remain ABI-compatible across Node.js major versions, it must use Node-API exclusively by restricting itself to using
#include <node_api.h>
copy
and by checking, for all external libraries that it uses, that the external library makes ABI stability guarantees similar to Node-API.
Building
#
Unlike modules written in JavaScript, developing and deploying Node.js native addons using Node-API requires an additional set of tools. Besides the basic tools required to develop for Node.js, the native addon developer requires a toolchain that can compile C and C++ code into a binary. In addition, depending upon how the native addon is deployed, the user of the native addon will also need to have a C/C++ toolchain installed.
For Linux developers, the necessary C/C++ toolchain packages are readily available. GCC is widely used in the Node.js community to build and test across a variety of platforms. For many developers, the LLVM compiler infrastructure is also a good choice.
For Mac developers, Xcode offers all the required compiler tools. However, it is not necessary to install the entire Xcode IDE. The following command installs the necessary toolchain:
xcode-select --install
copy
For Windows developers, Visual Studio offers all the required compiler tools. However, it is not necessary to install the entire Visual Studio IDE. The following command installs the necessary toolchain:
npm install --global windows-build-tools
copy
The sections below describe the additional tools available for developing and deploying Node.js native addons.
Build tools
#
Both the tools listed here require that users of the native addon have a C/C++ toolchain installed in order to successfully install the native addon.
node-gyp
#
node-gyp is a build system based on the gyp-next fork of Google's GYP tool and comes bundled with npm. GYP, and therefore node-gyp, requires that Python be installed.
Historically, node-gyp has been the tool of choice for building native addons. It has widespread adoption and documentation. However, some developers have run into limitations in node-gyp.
CMake.js
#
CMake.js is an alternative build system based on CMake.
CMake.js is a good choice for projects that already use CMake or for developers affected by limitations in node-gyp. build_with_cmake is an example of a CMake-based native addon project.
Uploading precompiled binaries
#
The three tools listed here permit native addon developers and maintainers to create and upload binaries to public or private servers. These tools are typically integrated with CI/CD build systems like Travis CI and AppVeyor to build and upload binaries for a variety of platforms and architectures. These binaries are then available for download by users who do not need to have a C/C++ toolchain installed.
node-pre-gyp
#
node-pre-gyp is a tool based on node-gyp that adds the ability to upload binaries to a server of the developer's choice. node-pre-gyp has particularly good support for uploading binaries to Amazon S3.
prebuild
#
prebuild is a tool that supports builds using either node-gyp or CMake.js. Unlike node-pre-gyp which supports a variety of servers, prebuild uploads binaries only to GitHub releases. prebuild is a good choice for GitHub projects using CMake.js.
prebuildify
#
prebuildify is a tool based on node-gyp. The advantage of prebuildify is that the built binaries are bundled with the native addon when it's uploaded to npm. The binaries are downloaded from npm and are immediately available to the module user when the native addon is installed.
Usage
#
In order to use the Node-API functions, include the file node_api.h which is located in the src directory in the node development tree:
#include <node_api.h>
copy
This will opt into the default NAPI_VERSION for the given release of Node.js. In order to ensure compatibility with specific versions of Node-API, the version can be specified explicitly when including the header:
#define NAPI_VERSION 3
#include <node_api.h>
copy
This restricts the Node-API surface to just the functionality that was available in the specified (and earlier) versions.
Some of the Node-API surface is experimental and requires explicit opt-in:
#define NAPI_EXPERIMENTAL
#include <node_api.h>
copy
In this case the entire API surface, including any experimental APIs, will be available to the module code.
Occasionally, experimental features are introduced that affect already-released and stable APIs. These features can be disabled by an opt-out:
#define NAPI_EXPERIMENTAL
#define NODE_API_EXPERIMENTAL_<FEATURE_NAME>_OPT_OUT
#include <node_api.h>
copy
where <FEATURE_NAME> is the name of an experimental feature that affects both experimental and stable APIs.
Node-API version matrix
#
Up until version 9, Node-API versions were additive and versioned independently from Node.js. This meant that any version was an extension to the previous version in that it had all of the APIs from the previous version with some additions. Each Node.js version only supported a single Node-API version. For example v18.15.0 supports only Node-API version 8. ABI stability was achieved because 8 was a strict superset of all previous versions.
As of version 9, while Node-API versions continue to be versioned independently, an add-on that ran with Node-API version 9 may need code updates to run with Node-API version 10. ABI stability is maintained, however, because Node.js versions that support Node-API versions higher than 8 will support all versions between 8 and the highest version they support and will default to providing the version 8 APIs unless an add-on opts into a higher Node-API version. This approach provides the flexibility of better optimizing existing Node-API functions while maintaining ABI stability. Existing add-ons can continue to run without recompilation using an earlier version of Node-API. If an add-on needs functionality from a newer Node-API version, changes to existing code and recompilation will be needed to use those new functions anyway.
In versions of Node.js that support Node-API version 9 and later, defining NAPI_VERSION=X and using the existing add-on initialization macros will bake in the requested Node-API version that will be used at runtime into the add-on. If NAPI_VERSION is not set it will default to 8.
This table may not be up to date in older streams, the most up to date information is in the latest API documentation in: Node-API version matrix
Node-API version
Supported In
10
v22.14.0+, 23.6.0+ and all later versions
9
v18.17.0+, 20.3.0+, 21.0.0 and all later versions
8
v12.22.0+, v14.17.0+, v15.12.0+, 16.0.0 and all later versions
7
v10.23.0+, v12.19.0+, v14.12.0+, 15.0.0 and all later versions
6
v10.20.0+, v12.17.0+, 14.0.0 and all later versions
5
v10.17.0+, v12.11.0+, 13.0.0 and all later versions
4
v10.16.0+, v11.8.0+, 12.0.0 and all later versions
3
v6.14.2*, 8.11.2+, v9.11.0+*, 10.0.0 and all later versions
2
v8.10.0+*, v9.3.0+*, 10.0.0 and all later versions
1
v8.6.0+**, v9.0.0+*, 10.0.0 and all later versions

* Node-API was experimental.
** Node.js 8.0.0 included Node-API as experimental. It was released as Node-API version 1 but continued to evolve until Node.js 8.6.0. The API is different in versions prior to Node.js 8.6.0. We recommend Node-API version 3 or later.
Each API documented for Node-API will have a header named added in:, and APIs which are stable will have the additional header Node-API version:. APIs are directly usable when using a Node.js version which supports the Node-API version shown in Node-API version: or higher. When using a Node.js version that does not support the Node-API version: listed or if there is no Node-API version: listed, then the API will only be available if #define NAPI_EXPERIMENTAL precedes the inclusion of node_api.h or js_native_api.h. If an API appears not to be available on a version of Node.js which is later than the one shown in added in: then this is most likely the reason for the apparent absence.
The Node-APIs associated strictly with accessing ECMAScript features from native code can be found separately in js_native_api.h and js_native_api_types.h. The APIs defined in these headers are included in node_api.h and node_api_types.h. The headers are structured in this way in order to allow implementations of Node-API outside of Node.js. For those implementations the Node.js specific APIs may not be applicable.
The Node.js-specific parts of an addon can be separated from the code that exposes the actual functionality to the JavaScript environment so that the latter may be used with multiple implementations of Node-API. In the example below, addon.c and addon.h refer only to js_native_api.h. This ensures that addon.c can be reused to compile against either the Node.js implementation of Node-API or any implementation of Node-API outside of Node.js.
addon_node.c is a separate file that contains the Node.js specific entry point to the addon and which instantiates the addon by calling into addon.c when the addon is loaded into a Node.js environment.
// addon.h
#ifndef _ADDON_H_
#define _ADDON_H_
#include <js_native_api.h>
napi_value create_addon(napi_env env);
#endif  // _ADDON_H_
copy
// addon.c
#include "addon.h"


#define NODE_API_CALL(env, call)                                  \
  do {                                                            \
    napi_status status = (call);                                  \
    if (status != napi_ok) {                                      \
      const napi_extended_error_info* error_info = NULL;          \
      napi_get_last_error_info((env), &error_info);               \
      const char* err_message = error_info->error_message;        \
      bool is_pending;                                            \
      napi_is_exception_pending((env), &is_pending);              \
      /* If an exception is already pending, don't rethrow it */  \
      if (!is_pending) {                                          \
        const char* message = (err_message == NULL)               \
            ? "empty error message"                               \
            : err_message;                                        \
        napi_throw_error((env), NULL, message);                   \
      }                                                           \
      return NULL;                                                \
    }                                                             \
  } while(0)


static napi_value
DoSomethingUseful(napi_env env, napi_callback_info info) {
  // Do something useful.
  return NULL;
}


napi_value create_addon(napi_env env) {
  napi_value result;
  NODE_API_CALL(env, napi_create_object(env, &result));


  napi_value exported_function;
  NODE_API_CALL(env, napi_create_function(env,
                                          "doSomethingUseful",
                                          NAPI_AUTO_LENGTH,
                                          DoSomethingUseful,
                                          NULL,
                                          &exported_function));


  NODE_API_CALL(env, napi_set_named_property(env,
                                             result,
                                             "doSomethingUseful",
                                             exported_function));


  return result;
}
copy
// addon_node.c
#include <node_api.h>
#include "addon.h"


NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  // This function body is expected to return a `napi_value`.
  // The variables `napi_env env` and `napi_value exports` may be used within
  // the body, as they are provided by the definition of `NAPI_MODULE_INIT()`.
  return create_addon(env);
}
copy
Environment life cycle APIs
#
Section 8.7 of the ECMAScript Language Specification defines the concept of an "Agent" as a self-contained environment in which JavaScript code runs. Multiple such Agents may be started and terminated either concurrently or in sequence by the process.
A Node.js environment corresponds to an ECMAScript Agent. In the main process, an environment is created at startup, and additional environments can be created on separate threads to serve as worker threads. When Node.js is embedded in another application, the main thread of the application may also construct and destroy a Node.js environment multiple times during the life cycle of the application process such that each Node.js environment created by the application may, in turn, during its life cycle create and destroy additional environments as worker threads.
From the perspective of a native addon this means that the bindings it provides may be called multiple times, from multiple contexts, and even concurrently from multiple threads.
Native addons may need to allocate global state which they use during their life cycle of an Node.js environment such that the state can be unique to each instance of the addon.
To this end, Node-API provides a way to associate data such that its life cycle is tied to the life cycle of a Node.js environment.
napi_set_instance_data
#
Added in: v12.8.0, v10.20.0 N-API version: 6
napi_status napi_set_instance_data(node_api_basic_env env,
                                   void* data,
                                   napi_finalize finalize_cb,
                                   void* finalize_hint);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] data: The data item to make available to bindings of this instance.
[in] finalize_cb: The function to call when the environment is being torn down. The function receives data so that it might free it. napi_finalize provides more details.
[in] finalize_hint: Optional hint to pass to the finalize callback during collection.
Returns napi_ok if the API succeeded.
This API associates data with the currently running Node.js environment. data can later be retrieved using napi_get_instance_data(). Any existing data associated with the currently running Node.js environment which was set by means of a previous call to napi_set_instance_data() will be overwritten. If a finalize_cb was provided by the previous call, it will not be called.
napi_get_instance_data
#
Added in: v12.8.0, v10.20.0 N-API version: 6
napi_status napi_get_instance_data(node_api_basic_env env,
                                   void** data);
copy
[in] env: The environment that the Node-API call is invoked under.
[out] data: The data item that was previously associated with the currently running Node.js environment by a call to napi_set_instance_data().
Returns napi_ok if the API succeeded.
This API retrieves data that was previously associated with the currently running Node.js environment via napi_set_instance_data(). If no data is set, the call will succeed and data will be set to NULL.
Basic Node-API data types
#
Node-API exposes the following fundamental data types as abstractions that are consumed by the various APIs. These APIs should be treated as opaque, introspectable only with other Node-API calls.
napi_status
#
Added in: v8.0.0 N-API version: 1
Integral status code indicating the success or failure of a Node-API call. Currently, the following status codes are supported.
typedef enum {
  napi_ok,
  napi_invalid_arg,
  napi_object_expected,
  napi_string_expected,
  napi_name_expected,
  napi_function_expected,
  napi_number_expected,
  napi_boolean_expected,
  napi_array_expected,
  napi_generic_failure,
  napi_pending_exception,
  napi_cancelled,
  napi_escape_called_twice,
  napi_handle_scope_mismatch,
  napi_callback_scope_mismatch,
  napi_queue_full,
  napi_closing,
  napi_bigint_expected,
  napi_date_expected,
  napi_arraybuffer_expected,
  napi_detachable_arraybuffer_expected,
  napi_would_deadlock,  /* unused */
  napi_no_external_buffers_allowed,
  napi_cannot_run_js
} napi_status;
copy
If additional information is required upon an API returning a failed status, it can be obtained by calling napi_get_last_error_info.
napi_extended_error_info
#
Added in: v8.0.0 N-API version: 1
typedef struct {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
} napi_extended_error_info;
copy
error_message: UTF8-encoded string containing a VM-neutral description of the error.
engine_reserved: Reserved for VM-specific error details. This is currently not implemented for any VM.
engine_error_code: VM-specific error code. This is currently not implemented for any VM.
error_code: The Node-API status code that originated with the last error.
See the Error handling section for additional information.
napi_env
#
napi_env is used to represent a context that the underlying Node-API implementation can use to persist VM-specific state. This structure is passed to native functions when they're invoked, and it must be passed back when making Node-API calls. Specifically, the same napi_env that was passed in when the initial native function was called must be passed to any subsequent nested Node-API calls. Caching the napi_env for the purpose of general reuse, and passing the napi_env between instances of the same addon running on different Worker threads is not allowed. The napi_env becomes invalid when an instance of a native addon is unloaded. Notification of this event is delivered through the callbacks given to napi_add_env_cleanup_hook and napi_set_instance_data.
node_api_basic_env
#
Stability: 1 - Experimental
This variant of napi_env is passed to synchronous finalizers (node_api_basic_finalize). There is a subset of Node-APIs which accept a parameter of type node_api_basic_env as their first argument. These APIs do not access the state of the JavaScript engine and are thus safe to call from synchronous finalizers. Passing a parameter of type napi_env to these APIs is allowed, however, passing a parameter of type node_api_basic_env to APIs that access the JavaScript engine state is not allowed. Attempting to do so without a cast will produce a compiler warning or an error when add-ons are compiled with flags which cause them to emit warnings and/or errors when incorrect pointer types are passed into a function. Calling such APIs from a synchronous finalizer will ultimately result in the termination of the application.
napi_value
#
This is an opaque pointer that is used to represent a JavaScript value.
napi_threadsafe_function
#
Added in: v10.6.0 N-API version: 4
This is an opaque pointer that represents a JavaScript function which can be called asynchronously from multiple threads via napi_call_threadsafe_function().
napi_threadsafe_function_release_mode
#
Added in: v10.6.0 N-API version: 4
A value to be given to napi_release_threadsafe_function() to indicate whether the thread-safe function is to be closed immediately (napi_tsfn_abort) or merely released (napi_tsfn_release) and thus available for subsequent use via napi_acquire_threadsafe_function() and napi_call_threadsafe_function().
typedef enum {
  napi_tsfn_release,
  napi_tsfn_abort
} napi_threadsafe_function_release_mode;
copy
napi_threadsafe_function_call_mode
#
Added in: v10.6.0 N-API version: 4
A value to be given to napi_call_threadsafe_function() to indicate whether the call should block whenever the queue associated with the thread-safe function is full.
typedef enum {
  napi_tsfn_nonblocking,
  napi_tsfn_blocking
} napi_threadsafe_function_call_mode;
copy
Node-API memory management types
#
napi_handle_scope
#
This is an abstraction used to control and modify the lifetime of objects created within a particular scope. In general, Node-API values are created within the context of a handle scope. When a native method is called from JavaScript, a default handle scope will exist. If the user does not explicitly create a new handle scope, Node-API values will be created in the default handle scope. For any invocations of code outside the execution of a native method (for instance, during a libuv callback invocation), the module is required to create a scope before invoking any functions that can result in the creation of JavaScript values.
Handle scopes are created using napi_open_handle_scope and are destroyed using napi_close_handle_scope. Closing the scope can indicate to the GC that all napi_values created during the lifetime of the handle scope are no longer referenced from the current stack frame.
For more details, review the Object lifetime management.
napi_escapable_handle_scope
#
Added in: v8.0.0 N-API version: 1
Escapable handle scopes are a special type of handle scope to return values created within a particular handle scope to a parent scope.
napi_ref
#
Added in: v8.0.0 N-API version: 1
This is the abstraction to use to reference a napi_value. This allows for users to manage the lifetimes of JavaScript values, including defining their minimum lifetimes explicitly.
For more details, review the Object lifetime management.
napi_type_tag
#
Added in: v14.8.0, v12.19.0 N-API version: 8
A 128-bit value stored as two unsigned 64-bit integers. It serves as a UUID with which JavaScript objects or externals can be "tagged" in order to ensure that they are of a certain type. This is a stronger check than napi_instanceof, because the latter can report a false positive if the object's prototype has been manipulated. Type-tagging is most useful in conjunction with napi_wrap because it ensures that the pointer retrieved from a wrapped object can be safely cast to the native type corresponding to the type tag that had been previously applied to the JavaScript object.
typedef struct {
  uint64_t lower;
  uint64_t upper;
} napi_type_tag;
copy
napi_async_cleanup_hook_handle
#
Added in: v14.10.0, v12.19.0
An opaque value returned by napi_add_async_cleanup_hook. It must be passed to napi_remove_async_cleanup_hook when the chain of asynchronous cleanup events completes.
Node-API callback types
#
napi_callback_info
#
Added in: v8.0.0 N-API version: 1
Opaque datatype that is passed to a callback function. It can be used for getting additional information about the context in which the callback was invoked.
napi_callback
#
Added in: v8.0.0 N-API version: 1
Function pointer type for user-provided native functions which are to be exposed to JavaScript via Node-API. Callback functions should satisfy the following signature:
typedef napi_value (*napi_callback)(napi_env, napi_callback_info);
copy
Unless for reasons discussed in Object Lifetime Management, creating a handle and/or callback scope inside a napi_callback is not necessary.
node_api_basic_finalize
#
Added in: v21.6.0, v20.12.0, v18.20.0
Stability: 1 - Experimental
Function pointer type for add-on provided functions that allow the user to be notified when externally-owned data is ready to be cleaned up because the object it was associated with has been garbage-collected. The user must provide a function satisfying the following signature which would get called upon the object's collection. Currently, node_api_basic_finalize can be used for finding out when objects that have external data are collected.
typedef void (*node_api_basic_finalize)(node_api_basic_env env,
                                      void* finalize_data,
                                      void* finalize_hint);
copy
Unless for reasons discussed in Object Lifetime Management, creating a handle and/or callback scope inside the function body is not necessary.
Since these functions may be called while the JavaScript engine is in a state where it cannot execute JavaScript code, only Node-APIs which accept a node_api_basic_env as their first parameter may be called. node_api_post_finalizer can be used to schedule Node-API calls that require access to the JavaScript engine's state to run after the current garbage collection cycle has completed.
In the case of node_api_create_external_string_latin1 and node_api_create_external_string_utf16 the env parameter may be null, because external strings can be collected during the latter part of environment shutdown.
Change History:
experimental (NAPI_EXPERIMENTAL):
Only Node-API calls that accept a node_api_basic_env as their first parameter may be called, otherwise the application will be terminated with an appropriate error message. This feature can be turned off by defining NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT.
napi_finalize
#
Added in: v8.0.0 N-API version: 1
Function pointer type for add-on provided function that allow the user to schedule a group of calls to Node-APIs in response to a garbage collection event, after the garbage collection cycle has completed. These function pointers can be used with node_api_post_finalizer.
typedef void (*napi_finalize)(napi_env env,
                              void* finalize_data,
                              void* finalize_hint);
copy
Change History:
experimental (NAPI_EXPERIMENTAL is defined):
A function of this type may no longer be used as a finalizer, except with node_api_post_finalizer. node_api_basic_finalize must be used instead. This feature can be turned off by defining NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT.
napi_async_execute_callback
#
Added in: v8.0.0 N-API version: 1
Function pointer used with functions that support asynchronous operations. Callback functions must satisfy the following signature:
typedef void (*napi_async_execute_callback)(napi_env env, void* data);
copy
Implementations of this function must avoid making Node-API calls that execute JavaScript or interact with JavaScript objects. Node-API calls should be in the napi_async_complete_callback instead. Do not use the napi_env parameter as it will likely result in execution of JavaScript.
napi_async_complete_callback
#
Added in: v8.0.0 N-API version: 1
Function pointer used with functions that support asynchronous operations. Callback functions must satisfy the following signature:
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
copy
Unless for reasons discussed in Object Lifetime Management, creating a handle and/or callback scope inside the function body is not necessary.
napi_threadsafe_function_call_js
#
Added in: v10.6.0 N-API version: 4
Function pointer used with asynchronous thread-safe function calls. The callback will be called on the main thread. Its purpose is to use a data item arriving via the queue from one of the secondary threads to construct the parameters necessary for a call into JavaScript, usually via napi_call_function, and then make the call into JavaScript.
The data arriving from the secondary thread via the queue is given in the data parameter and the JavaScript function to call is given in the js_callback parameter.
Node-API sets up the environment prior to calling this callback, so it is sufficient to call the JavaScript function via napi_call_function rather than via napi_make_callback.
Callback functions must satisfy the following signature:
typedef void (*napi_threadsafe_function_call_js)(napi_env env,
                                                 napi_value js_callback,
                                                 void* context,
                                                 void* data);
copy
[in] env: The environment to use for API calls, or NULL if the thread-safe function is being torn down and data may need to be freed.
[in] js_callback: The JavaScript function to call, or NULL if the thread-safe function is being torn down and data may need to be freed. It may also be NULL if the thread-safe function was created without js_callback.
[in] context: The optional data with which the thread-safe function was created.
[in] data: Data created by the secondary thread. It is the responsibility of the callback to convert this native data to JavaScript values (with Node-API functions) that can be passed as parameters when js_callback is invoked. This pointer is managed entirely by the threads and this callback. Thus this callback should free the data.
Unless for reasons discussed in Object Lifetime Management, creating a handle and/or callback scope inside the function body is not necessary.
napi_cleanup_hook
#
Added in: v19.2.0, v18.13.0 N-API version: 3
Function pointer used with napi_add_env_cleanup_hook. It will be called when the environment is being torn down.
Callback functions must satisfy the following signature:
typedef void (*napi_cleanup_hook)(void* data);
copy
[in] data: The data that was passed to napi_add_env_cleanup_hook.
napi_async_cleanup_hook
#
Added in: v14.10.0, v12.19.0
Function pointer used with napi_add_async_cleanup_hook. It will be called when the environment is being torn down.
Callback functions must satisfy the following signature:
typedef void (*napi_async_cleanup_hook)(napi_async_cleanup_hook_handle handle,
                                        void* data);
copy
[in] handle: The handle that must be passed to napi_remove_async_cleanup_hook after completion of the asynchronous cleanup.
[in] data: The data that was passed to napi_add_async_cleanup_hook.
The body of the function should initiate the asynchronous cleanup actions at the end of which handle must be passed in a call to napi_remove_async_cleanup_hook.
Error handling
#
Node-API uses both return values and JavaScript exceptions for error handling. The following sections explain the approach for each case.
Return values
#
All of the Node-API functions share the same error handling pattern. The return type of all API functions is napi_status.
The return value will be napi_ok if the request was successful and no uncaught JavaScript exception was thrown. If an error occurred AND an exception was thrown, the napi_status value for the error will be returned. If an exception was thrown, and no error occurred, napi_pending_exception will be returned.
In cases where a return value other than napi_ok or napi_pending_exception is returned, napi_is_exception_pending must be called to check if an exception is pending. See the section on exceptions for more details.
The full set of possible napi_status values is defined in napi_api_types.h.
The napi_status return value provides a VM-independent representation of the error which occurred. In some cases it is useful to be able to get more detailed information, including a string representing the error as well as VM (engine)-specific information.
In order to retrieve this information napi_get_last_error_info is provided which returns a napi_extended_error_info structure. The format of the napi_extended_error_info structure is as follows:
Added in: v8.0.0 N-API version: 1
typedef struct napi_extended_error_info {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
};
copy
error_message: Textual representation of the error that occurred.
engine_reserved: Opaque handle reserved for engine use only.
engine_error_code: VM specific error code.
error_code: Node-API status code for the last error.
napi_get_last_error_info returns the information for the last Node-API call that was made.
Do not rely on the content or format of any of the extended information as it is not subject to SemVer and may change at any time. It is intended only for logging purposes.
napi_get_last_error_info
#
Added in: v8.0.0 N-API version: 1
napi_status
napi_get_last_error_info(node_api_basic_env env,
                         const napi_extended_error_info** result);
copy
[in] env: The environment that the API is invoked under.
[out] result: The napi_extended_error_info structure with more information about the error.
Returns napi_ok if the API succeeded.
This API retrieves a napi_extended_error_info structure with information about the last error that occurred.
The content of the napi_extended_error_info returned is only valid up until a Node-API function is called on the same env. This includes a call to napi_is_exception_pending so it may often be necessary to make a copy of the information so that it can be used later. The pointer returned in error_message points to a statically-defined string so it is safe to use that pointer if you have copied it out of the error_message field (which will be overwritten) before another Node-API function was called.
Do not rely on the content or format of any of the extended information as it is not subject to SemVer and may change at any time. It is intended only for logging purposes.
This API can be called even if there is a pending JavaScript exception.
Exceptions
#
Any Node-API function call may result in a pending JavaScript exception. This is the case for any of the API functions, even those that may not cause the execution of JavaScript.
If the napi_status returned by a function is napi_ok then no exception is pending and no additional action is required. If the napi_status returned is anything other than napi_ok or napi_pending_exception, in order to try to recover and continue instead of simply returning immediately, napi_is_exception_pending must be called in order to determine if an exception is pending or not.
In many cases when a Node-API function is called and an exception is already pending, the function will return immediately with a napi_status of napi_pending_exception. However, this is not the case for all functions. Node-API allows a subset of the functions to be called to allow for some minimal cleanup before returning to JavaScript. In that case, napi_status will reflect the status for the function. It will not reflect previous pending exceptions. To avoid confusion, check the error status after every function call.
When an exception is pending one of two approaches can be employed.
The first approach is to do any appropriate cleanup and then return so that execution will return to JavaScript. As part of the transition back to JavaScript, the exception will be thrown at the point in the JavaScript code where the native method was invoked. The behavior of most Node-API calls is unspecified while an exception is pending, and many will simply return napi_pending_exception, so do as little as possible and then return to JavaScript where the exception can be handled.
The second approach is to try to handle the exception. There will be cases where the native code can catch the exception, take the appropriate action, and then continue. This is only recommended in specific cases where it is known that the exception can be safely handled. In these cases napi_get_and_clear_last_exception can be used to get and clear the exception. On success, result will contain the handle to the last JavaScript Object thrown. If it is determined, after retrieving the exception, the exception cannot be handled after all it can be re-thrown it with napi_throw where error is the JavaScript value to be thrown.
The following utility functions are also available in case native code needs to throw an exception or determine if a napi_value is an instance of a JavaScript Error object: napi_throw_error, napi_throw_type_error, napi_throw_range_error, node_api_throw_syntax_error and napi_is_error.
The following utility functions are also available in case native code needs to create an Error object: napi_create_error, napi_create_type_error, napi_create_range_error and node_api_create_syntax_error, where result is the napi_value that refers to the newly created JavaScript Error object.
The Node.js project is adding error codes to all of the errors generated internally. The goal is for applications to use these error codes for all error checking. The associated error messages will remain, but will only be meant to be used for logging and display with the expectation that the message can change without SemVer applying. In order to support this model with Node-API, both in internal functionality and for module specific functionality (as its good practice), the throw_ and create_ functions take an optional code parameter which is the string for the code to be added to the error object. If the optional parameter is NULL then no code will be associated with the error. If a code is provided, the name associated with the error is also updated to be:
originalName [code]
copy
where originalName is the original name associated with the error and code is the code that was provided. For example, if the code is 'ERR_ERROR_1' and a TypeError is being created the name will be:
TypeError [ERR_ERROR_1]
copy
napi_throw
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_throw(napi_env env, napi_value error);
copy
[in] env: The environment that the API is invoked under.
[in] error: The JavaScript value to be thrown.
Returns napi_ok if the API succeeded.
This API throws the JavaScript value provided.
napi_throw_error
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_throw_error(napi_env env,
                                         const char* code,
                                         const char* msg);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional error code to be set on the error.
[in] msg: C string representing the text to be associated with the error.
Returns napi_ok if the API succeeded.
This API throws a JavaScript Error with the text provided.
napi_throw_type_error
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_throw_type_error(napi_env env,
                                              const char* code,
                                              const char* msg);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional error code to be set on the error.
[in] msg: C string representing the text to be associated with the error.
Returns napi_ok if the API succeeded.
This API throws a JavaScript TypeError with the text provided.
napi_throw_range_error
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_throw_range_error(napi_env env,
                                               const char* code,
                                               const char* msg);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional error code to be set on the error.
[in] msg: C string representing the text to be associated with the error.
Returns napi_ok if the API succeeded.
This API throws a JavaScript RangeError with the text provided.
node_api_throw_syntax_error
#
Added in: v17.2.0, v16.14.0 N-API version: 9
NAPI_EXTERN napi_status node_api_throw_syntax_error(napi_env env,
                                                    const char* code,
                                                    const char* msg);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional error code to be set on the error.
[in] msg: C string representing the text to be associated with the error.
Returns napi_ok if the API succeeded.
This API throws a JavaScript SyntaxError with the text provided.
napi_is_error
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_is_error(napi_env env,
                                      napi_value value,
                                      bool* result);
copy
[in] env: The environment that the API is invoked under.
[in] value: The napi_value to be checked.
[out] result: Boolean value that is set to true if napi_value represents an error, false otherwise.
Returns napi_ok if the API succeeded.
This API queries a napi_value to check if it represents an error object.
napi_create_error
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_create_error(napi_env env,
                                          napi_value code,
                                          napi_value msg,
                                          napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional napi_value with the string for the error code to be associated with the error.
[in] msg: napi_value that references a JavaScript string to be used as the message for the Error.
[out] result: napi_value representing the error created.
Returns napi_ok if the API succeeded.
This API returns a JavaScript Error with the text provided.
napi_create_type_error
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_create_type_error(napi_env env,
                                               napi_value code,
                                               napi_value msg,
                                               napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional napi_value with the string for the error code to be associated with the error.
[in] msg: napi_value that references a JavaScript string to be used as the message for the Error.
[out] result: napi_value representing the error created.
Returns napi_ok if the API succeeded.
This API returns a JavaScript TypeError with the text provided.
napi_create_range_error
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_create_range_error(napi_env env,
                                                napi_value code,
                                                napi_value msg,
                                                napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional napi_value with the string for the error code to be associated with the error.
[in] msg: napi_value that references a JavaScript string to be used as the message for the Error.
[out] result: napi_value representing the error created.
Returns napi_ok if the API succeeded.
This API returns a JavaScript RangeError with the text provided.
node_api_create_syntax_error
#
Added in: v17.2.0, v16.14.0 N-API version: 9
NAPI_EXTERN napi_status node_api_create_syntax_error(napi_env env,
                                                     napi_value code,
                                                     napi_value msg,
                                                     napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional napi_value with the string for the error code to be associated with the error.
[in] msg: napi_value that references a JavaScript string to be used as the message for the Error.
[out] result: napi_value representing the error created.
Returns napi_ok if the API succeeded.
This API returns a JavaScript SyntaxError with the text provided.
napi_get_and_clear_last_exception
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_and_clear_last_exception(napi_env env,
                                              napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[out] result: The exception if one is pending, NULL otherwise.
Returns napi_ok if the API succeeded.
This API can be called even if there is a pending JavaScript exception.
napi_is_exception_pending
#
Added in: v8.0.0 N-API version: 1
napi_status napi_is_exception_pending(napi_env env, bool* result);
copy
[in] env: The environment that the API is invoked under.
[out] result: Boolean value that is set to true if an exception is pending.
Returns napi_ok if the API succeeded.
This API can be called even if there is a pending JavaScript exception.
napi_fatal_exception
#
Added in: v9.10.0 N-API version: 3
napi_status napi_fatal_exception(napi_env env, napi_value err);
copy
[in] env: The environment that the API is invoked under.
[in] err: The error that is passed to 'uncaughtException'.
Trigger an 'uncaughtException' in JavaScript. Useful if an async callback throws an exception with no way to recover.
Fatal errors
#
In the event of an unrecoverable error in a native addon, a fatal error can be thrown to immediately terminate the process.
napi_fatal_error
#
Added in: v8.2.0 N-API version: 1
NAPI_NO_RETURN void napi_fatal_error(const char* location,
                                     size_t location_len,
                                     const char* message,
                                     size_t message_len);
copy
[in] location: Optional location at which the error occurred.
[in] location_len: The length of the location in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[in] message: The message associated with the error.
[in] message_len: The length of the message in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
The function call does not return, the process will be terminated.
This API can be called even if there is a pending JavaScript exception.
Object lifetime management
#
As Node-API calls are made, handles to objects in the heap for the underlying VM may be returned as napi_values. These handles must hold the objects 'live' until they are no longer required by the native code, otherwise the objects could be collected before the native code was finished using them.
As object handles are returned they are associated with a 'scope'. The lifespan for the default scope is tied to the lifespan of the native method call. The result is that, by default, handles remain valid and the objects associated with these handles will be held live for the lifespan of the native method call.
In many cases, however, it is necessary that the handles remain valid for either a shorter or longer lifespan than that of the native method. The sections which follow describe the Node-API functions that can be used to change the handle lifespan from the default.
Making handle lifespan shorter than that of the native method
#
It is often necessary to make the lifespan of handles shorter than the lifespan of a native method. For example, consider a native method that has a loop which iterates through the elements in a large array:
for (int i = 0; i < 1000000; i++) {
  napi_value result;
  napi_status status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // do something with element
}
copy
This would result in a large number of handles being created, consuming substantial resources. In addition, even though the native code could only use the most recent handle, all of the associated objects would also be kept alive since they all share the same scope.
To handle this case, Node-API provides the ability to establish a new 'scope' to which newly created handles will be associated. Once those handles are no longer required, the scope can be 'closed' and any handles associated with the scope are invalidated. The methods available to open/close scopes are napi_open_handle_scope and napi_close_handle_scope.
Node-API only supports a single nested hierarchy of scopes. There is only one active scope at any time, and all new handles will be associated with that scope while it is active. Scopes must be closed in the reverse order from which they are opened. In addition, all scopes created within a native method must be closed before returning from that method.
Taking the earlier example, adding calls to napi_open_handle_scope and napi_close_handle_scope would ensure that at most a single handle is valid throughout the execution of the loop:
for (int i = 0; i < 1000000; i++) {
  napi_handle_scope scope;
  napi_status status = napi_open_handle_scope(env, &scope);
  if (status != napi_ok) {
    break;
  }
  napi_value result;
  status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // do something with element
  status = napi_close_handle_scope(env, scope);
  if (status != napi_ok) {
    break;
  }
}
copy
When nesting scopes, there are cases where a handle from an inner scope needs to live beyond the lifespan of that scope. Node-API supports an 'escapable scope' in order to support this case. An escapable scope allows one handle to be 'promoted' so that it 'escapes' the current scope and the lifespan of the handle changes from the current scope to that of the outer scope.
The methods available to open/close escapable scopes are napi_open_escapable_handle_scope and napi_close_escapable_handle_scope.
The request to promote a handle is made through napi_escape_handle which can only be called once.
napi_open_handle_scope
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_open_handle_scope(napi_env env,
                                               napi_handle_scope* result);
copy
[in] env: The environment that the API is invoked under.
[out] result: napi_value representing the new scope.
Returns napi_ok if the API succeeded.
This API opens a new scope.
napi_close_handle_scope
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_close_handle_scope(napi_env env,
                                                napi_handle_scope scope);
copy
[in] env: The environment that the API is invoked under.
[in] scope: napi_value representing the scope to be closed.
Returns napi_ok if the API succeeded.
This API closes the scope passed in. Scopes must be closed in the reverse order from which they were created.
This API can be called even if there is a pending JavaScript exception.
napi_open_escapable_handle_scope
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status
    napi_open_escapable_handle_scope(napi_env env,
                                     napi_handle_scope* result);
copy
[in] env: The environment that the API is invoked under.
[out] result: napi_value representing the new scope.
Returns napi_ok if the API succeeded.
This API opens a new scope from which one object can be promoted to the outer scope.
napi_close_escapable_handle_scope
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status
    napi_close_escapable_handle_scope(napi_env env,
                                      napi_handle_scope scope);
copy
[in] env: The environment that the API is invoked under.
[in] scope: napi_value representing the scope to be closed.
Returns napi_ok if the API succeeded.
This API closes the scope passed in. Scopes must be closed in the reverse order from which they were created.
This API can be called even if there is a pending JavaScript exception.
napi_escape_handle
#
Added in: v8.0.0 N-API version: 1
napi_status napi_escape_handle(napi_env env,
                               napi_escapable_handle_scope scope,
                               napi_value escapee,
                               napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] scope: napi_value representing the current scope.
[in] escapee: napi_value representing the JavaScript Object to be escaped.
[out] result: napi_value representing the handle to the escaped Object in the outer scope.
Returns napi_ok if the API succeeded.
This API promotes the handle to the JavaScript object so that it is valid for the lifetime of the outer scope. It can only be called once per scope. If it is called more than once an error will be returned.
This API can be called even if there is a pending JavaScript exception.
References to values with a lifespan longer than that of the native method
#
In some cases, an addon will need to be able to create and reference values with a lifespan longer than that of a single native method invocation. For example, to create a constructor and later use that constructor in a request to create instances, it must be possible to reference the constructor object across many different instance creation requests. This would not be possible with a normal handle returned as a napi_value as described in the earlier section. The lifespan of a normal handle is managed by scopes and all scopes must be closed before the end of a native method.
Node-API provides methods for creating persistent references to values. Currently Node-API only allows references to be created for a limited set of value types, including object, external, function, and symbol.
Each reference has an associated count with a value of 0 or higher, which determines whether the reference will keep the corresponding value alive. References with a count of 0 do not prevent values from being collected. Values of object (object, function, external) and symbol types are becoming 'weak' references and can still be accessed while they are not collected. Any count greater than 0 will prevent the values from being collected.
Symbol values have different flavors. The true weak reference behavior is only supported by local symbols created with the napi_create_symbol function or the JavaScript Symbol() constructor calls. Globally registered symbols created with the node_api_symbol_for function or JavaScript Symbol.for() function calls remain always strong references because the garbage collector does not collect them. The same is true for well-known symbols such as Symbol.iterator. They are also never collected by the garbage collector.
References can be created with an initial reference count. The count can then be modified through napi_reference_ref and napi_reference_unref. If an object is collected while the count for a reference is 0, all subsequent calls to get the object associated with the reference napi_get_reference_value will return NULL for the returned napi_value. An attempt to call napi_reference_ref for a reference whose object has been collected results in an error.
References must be deleted once they are no longer required by the addon. When a reference is deleted, it will no longer prevent the corresponding object from being collected. Failure to delete a persistent reference results in a 'memory leak' with both the native memory for the persistent reference and the corresponding object on the heap being retained forever.
There can be multiple persistent references created which refer to the same object, each of which will either keep the object live or not based on its individual count. Multiple persistent references to the same object can result in unexpectedly keeping alive native memory. The native structures for a persistent reference must be kept alive until finalizers for the referenced object are executed. If a new persistent reference is created for the same object, the finalizers for that object will not be run and the native memory pointed by the earlier persistent reference will not be freed. This can be avoided by calling napi_delete_reference in addition to napi_reference_unref when possible.
Change History:
Version 10 (NAPI_VERSION is defined as 10 or higher):
References can be created for all value types. The new supported value types do not support weak reference semantic and the values of these types are released when the reference count becomes 0 and cannot be accessed from the reference anymore.
napi_create_reference
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_create_reference(napi_env env,
                                              napi_value value,
                                              uint32_t initial_refcount,
                                              napi_ref* result);
copy
[in] env: The environment that the API is invoked under.
[in] value: The napi_value for which a reference is being created.
[in] initial_refcount: Initial reference count for the new reference.
[out] result: napi_ref pointing to the new reference.
Returns napi_ok if the API succeeded.
This API creates a new reference with the specified reference count to the value passed in.
napi_delete_reference
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_delete_reference(napi_env env, napi_ref ref);
copy
[in] env: The environment that the API is invoked under.
[in] ref: napi_ref to be deleted.
Returns napi_ok if the API succeeded.
This API deletes the reference passed in.
This API can be called even if there is a pending JavaScript exception.
napi_reference_ref
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_reference_ref(napi_env env,
                                           napi_ref ref,
                                           uint32_t* result);
copy
[in] env: The environment that the API is invoked under.
[in] ref: napi_ref for which the reference count will be incremented.
[out] result: The new reference count.
Returns napi_ok if the API succeeded.
This API increments the reference count for the reference passed in and returns the resulting reference count.
napi_reference_unref
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_reference_unref(napi_env env,
                                             napi_ref ref,
                                             uint32_t* result);
copy
[in] env: The environment that the API is invoked under.
[in] ref: napi_ref for which the reference count will be decremented.
[out] result: The new reference count.
Returns napi_ok if the API succeeded.
This API decrements the reference count for the reference passed in and returns the resulting reference count.
napi_get_reference_value
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_get_reference_value(napi_env env,
                                                 napi_ref ref,
                                                 napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] ref: The napi_ref for which the corresponding value is being requested.
[out] result: The napi_value referenced by the napi_ref.
Returns napi_ok if the API succeeded.
If still valid, this API returns the napi_value representing the JavaScript value associated with the napi_ref. Otherwise, result will be NULL.
Cleanup on exit of the current Node.js environment
#
While a Node.js process typically releases all its resources when exiting, embedders of Node.js, or future Worker support, may require addons to register clean-up hooks that will be run once the current Node.js environment exits.
Node-API provides functions for registering and un-registering such callbacks. When those callbacks are run, all resources that are being held by the addon should be freed up.
napi_add_env_cleanup_hook
#
Added in: v10.2.0 N-API version: 3
NODE_EXTERN napi_status napi_add_env_cleanup_hook(node_api_basic_env env,
                                                  napi_cleanup_hook fun,
                                                  void* arg);
copy
Registers fun as a function to be run with the arg parameter once the current Node.js environment exits.
A function can safely be specified multiple times with different arg values. In that case, it will be called multiple times as well. Providing the same fun and arg values multiple times is not allowed and will lead the process to abort.
The hooks will be called in reverse order, i.e. the most recently added one will be called first.
Removing this hook can be done by using napi_remove_env_cleanup_hook. Typically, that happens when the resource for which this hook was added is being torn down anyway.
For asynchronous cleanup, napi_add_async_cleanup_hook is available.
napi_remove_env_cleanup_hook
#
Added in: v10.2.0 N-API version: 3
NAPI_EXTERN napi_status napi_remove_env_cleanup_hook(node_api_basic_env env,
                                                     void (*fun)(void* arg),
                                                     void* arg);
copy
Unregisters fun as a function to be run with the arg parameter once the current Node.js environment exits. Both the argument and the function value need to be exact matches.
The function must have originally been registered with napi_add_env_cleanup_hook, otherwise the process will abort.
napi_add_async_cleanup_hook
#
History













N-API version: 8
NAPI_EXTERN napi_status napi_add_async_cleanup_hook(
    node_api_basic_env env,
    napi_async_cleanup_hook hook,
    void* arg,
    napi_async_cleanup_hook_handle* remove_handle);
copy
[in] env: The environment that the API is invoked under.
[in] hook: The function pointer to call at environment teardown.
[in] arg: The pointer to pass to hook when it gets called.
[out] remove_handle: Optional handle that refers to the asynchronous cleanup hook.
Registers hook, which is a function of type napi_async_cleanup_hook, as a function to be run with the remove_handle and arg parameters once the current Node.js environment exits.
Unlike napi_add_env_cleanup_hook, the hook is allowed to be asynchronous.
Otherwise, behavior generally matches that of napi_add_env_cleanup_hook.
If remove_handle is not NULL, an opaque value will be stored in it that must later be passed to napi_remove_async_cleanup_hook, regardless of whether the hook has already been invoked. Typically, that happens when the resource for which this hook was added is being torn down anyway.
napi_remove_async_cleanup_hook
#
History













NAPI_EXTERN napi_status napi_remove_async_cleanup_hook(
    napi_async_cleanup_hook_handle remove_handle);
copy
[in] remove_handle: The handle to an asynchronous cleanup hook that was created with napi_add_async_cleanup_hook.
Unregisters the cleanup hook corresponding to remove_handle. This will prevent the hook from being executed, unless it has already started executing. This must be called on any napi_async_cleanup_hook_handle value obtained from napi_add_async_cleanup_hook.
Finalization on the exit of the Node.js environment
#
The Node.js environment may be torn down at an arbitrary time as soon as possible with JavaScript execution disallowed, like on the request of worker.terminate(). When the environment is being torn down, the registered napi_finalize callbacks of JavaScript objects, thread-safe functions and environment instance data are invoked immediately and independently.
The invocation of napi_finalize callbacks is scheduled after the manually registered cleanup hooks. In order to ensure a proper order of addon finalization during environment shutdown to avoid use-after-free in the napi_finalize callback, addons should register a cleanup hook with napi_add_env_cleanup_hook and napi_add_async_cleanup_hook to manually release the allocated resource in a proper order.
Module registration
#
Node-API modules are registered in a manner similar to other modules except that instead of using the NODE_MODULE macro the following is used:
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
copy
The next difference is the signature for the Init method. For a Node-API module it is as follows:
napi_value Init(napi_env env, napi_value exports);
copy
The return value from Init is treated as the exports object for the module. The Init method is passed an empty object via the exports parameter as a convenience. If Init returns NULL, the parameter passed as exports is exported by the module. Node-API modules cannot modify the module object but can specify anything as the exports property of the module.
To add the method hello as a function so that it can be called as a method provided by the addon:
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor desc = {
    "hello",
    NULL,
    Method,
    NULL,
    NULL,
    NULL,
    napi_writable | napi_enumerable | napi_configurable,
    NULL
  };
  status = napi_define_properties(env, exports, 1, &desc);
  if (status != napi_ok) return NULL;
  return exports;
}
copy
To set a function to be returned by the require() for the addon:
napi_value Init(napi_env env, napi_value exports) {
  napi_value method;
  napi_status status;
  status = napi_create_function(env, "exports", NAPI_AUTO_LENGTH, Method, NULL, &method);
  if (status != napi_ok) return NULL;
  return method;
}
copy
To define a class so that new instances can be created (often used with Object wrap):
// NOTE: partial example, not all referenced code is included
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor properties[] = {
    { "value", NULL, NULL, GetValue, SetValue, NULL, napi_writable | napi_configurable, NULL },
    DECLARE_NAPI_METHOD("plusOne", PlusOne),
    DECLARE_NAPI_METHOD("multiply", Multiply),
  };


  napi_value cons;
  status =
      napi_define_class(env, "MyObject", New, NULL, 3, properties, &cons);
  if (status != napi_ok) return NULL;


  status = napi_create_reference(env, cons, 1, &constructor);
  if (status != napi_ok) return NULL;


  status = napi_set_named_property(env, exports, "MyObject", cons);
  if (status != napi_ok) return NULL;


  return exports;
}
copy
You can also use the NAPI_MODULE_INIT macro, which acts as a shorthand for NAPI_MODULE and defining an Init function:
NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  napi_value answer;
  napi_status result;


  status = napi_create_int64(env, 42, &answer);
  if (status != napi_ok) return NULL;


  status = napi_set_named_property(env, exports, "answer", answer);
  if (status != napi_ok) return NULL;


  return exports;
}
copy
The parameters env and exports are provided to the body of the NAPI_MODULE_INIT macro.
All Node-API addons are context-aware, meaning they may be loaded multiple times. There are a few design considerations when declaring such a module. The documentation on context-aware addons provides more details.
The variables env and exports will be available inside the function body following the macro invocation.
For more details on setting properties on objects, see the section on Working with JavaScript properties.
For more details on building addon modules in general, refer to the existing API.
Working with JavaScript values
#
Node-API exposes a set of APIs to create all types of JavaScript values. Some of these types are documented under Section 6 of the ECMAScript Language Specification.
Fundamentally, these APIs are used to do one of the following:
Create a new JavaScript object
Convert from a primitive C type to a Node-API value
Convert from Node-API value to a primitive C type
Get global instances including undefined and null
Node-API values are represented by the type napi_value. Any Node-API call that requires a JavaScript value takes in a napi_value. In some cases, the API does check the type of the napi_value up-front. However, for better performance, it's better for the caller to make sure that the napi_value in question is of the JavaScript type expected by the API.
Enum types
#
napi_key_collection_mode
#
Added in: v13.7.0, v12.17.0, v10.20.0 N-API version: 6
typedef enum {
  napi_key_include_prototypes,
  napi_key_own_only
} napi_key_collection_mode;
copy
Describes the Keys/Properties filter enums:
napi_key_collection_mode limits the range of collected properties.
napi_key_own_only limits the collected properties to the given object only. napi_key_include_prototypes will include all keys of the objects's prototype chain as well.
napi_key_filter
#
Added in: v13.7.0, v12.17.0, v10.20.0 N-API version: 6
typedef enum {
  napi_key_all_properties = 0,
  napi_key_writable = 1,
  napi_key_enumerable = 1 << 1,
  napi_key_configurable = 1 << 2,
  napi_key_skip_strings = 1 << 3,
  napi_key_skip_symbols = 1 << 4
} napi_key_filter;
copy
Property filter bits. They can be or'ed to build a composite filter.
napi_key_conversion
#
Added in: v13.7.0, v12.17.0, v10.20.0 N-API version: 6
typedef enum {
  napi_key_keep_numbers,
  napi_key_numbers_to_strings
} napi_key_conversion;
copy
napi_key_numbers_to_strings will convert integer indexes to strings. napi_key_keep_numbers will return numbers for integer indexes.
napi_valuetype
#
typedef enum {
  // ES6 types (corresponds to typeof)
  napi_undefined,
  napi_null,
  napi_boolean,
  napi_number,
  napi_string,
  napi_symbol,
  napi_object,
  napi_function,
  napi_external,
  napi_bigint,
} napi_valuetype;
copy
Describes the type of a napi_value. This generally corresponds to the types described in Section 6.1 of the ECMAScript Language Specification. In addition to types in that section, napi_valuetype can also represent Functions and Objects with external data.
A JavaScript value of type napi_external appears in JavaScript as a plain object such that no properties can be set on it, and no prototype.
napi_typedarray_type
#
typedef enum {
  napi_int8_array,
  napi_uint8_array,
  napi_uint8_clamped_array,
  napi_int16_array,
  napi_uint16_array,
  napi_int32_array,
  napi_uint32_array,
  napi_float32_array,
  napi_float64_array,
  napi_bigint64_array,
  napi_biguint64_array,
} napi_typedarray_type;
copy
This represents the underlying binary scalar datatype of the TypedArray. Elements of this enum correspond to Section 22.2 of the ECMAScript Language Specification.
Object creation functions
#
napi_create_array
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_array(napi_env env, napi_value* result)
copy
[in] env: The environment that the Node-API call is invoked under.
[out] result: A napi_value representing a JavaScript Array.
Returns napi_ok if the API succeeded.
This API returns a Node-API value corresponding to a JavaScript Array type. JavaScript arrays are described in Section 22.1 of the ECMAScript Language Specification.
napi_create_array_with_length
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_array_with_length(napi_env env,
                                          size_t length,
                                          napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] length: The initial length of the Array.
[out] result: A napi_value representing a JavaScript Array.
Returns napi_ok if the API succeeded.
This API returns a Node-API value corresponding to a JavaScript Array type. The Array's length property is set to the passed-in length parameter. However, the underlying buffer is not guaranteed to be pre-allocated by the VM when the array is created. That behavior is left to the underlying VM implementation. If the buffer must be a contiguous block of memory that can be directly read and/or written via C, consider using napi_create_external_arraybuffer.
JavaScript arrays are described in Section 22.1 of the ECMAScript Language Specification.
napi_create_arraybuffer
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_arraybuffer(napi_env env,
                                    size_t byte_length,
                                    void** data,
                                    napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] length: The length in bytes of the array buffer to create.
[out] data: Pointer to the underlying byte buffer of the ArrayBuffer. data can optionally be ignored by passing NULL.
[out] result: A napi_value representing a JavaScript ArrayBuffer.
Returns napi_ok if the API succeeded.
This API returns a Node-API value corresponding to a JavaScript ArrayBuffer. ArrayBuffers are used to represent fixed-length binary data buffers. They are normally used as a backing-buffer for TypedArray objects. The ArrayBuffer allocated will have an underlying byte buffer whose size is determined by the length parameter that's passed in. The underlying buffer is optionally returned back to the caller in case the caller wants to directly manipulate the buffer. This buffer can only be written to directly from native code. To write to this buffer from JavaScript, a typed array or DataView object would need to be created.
JavaScript ArrayBuffer objects are described in Section 24.1 of the ECMAScript Language Specification.
napi_create_buffer
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_buffer(napi_env env,
                               size_t size,
                               void** data,
                               napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] size: Size in bytes of the underlying buffer.
[out] data: Raw pointer to the underlying buffer. data can optionally be ignored by passing NULL.
[out] result: A napi_value representing a node::Buffer.
Returns napi_ok if the API succeeded.
This API allocates a node::Buffer object. While this is still a fully-supported data structure, in most cases using a TypedArray will suffice.
napi_create_buffer_copy
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_buffer_copy(napi_env env,
                                    size_t length,
                                    const void* data,
                                    void** result_data,
                                    napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] size: Size in bytes of the input buffer (should be the same as the size of the new buffer).
[in] data: Raw pointer to the underlying buffer to copy from.
[out] result_data: Pointer to the new Buffer's underlying data buffer. result_data can optionally be ignored by passing NULL.
[out] result: A napi_value representing a node::Buffer.
Returns napi_ok if the API succeeded.
This API allocates a node::Buffer object and initializes it with data copied from the passed-in buffer. While this is still a fully-supported data structure, in most cases using a TypedArray will suffice.
napi_create_date
#
Added in: v11.11.0, v10.17.0 N-API version: 5
napi_status napi_create_date(napi_env env,
                             double time,
                             napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] time: ECMAScript time value in milliseconds since 01 January, 1970 UTC.
[out] result: A napi_value representing a JavaScript Date.
Returns napi_ok if the API succeeded.
This API does not observe leap seconds; they are ignored, as ECMAScript aligns with POSIX time specification.
This API allocates a JavaScript Date object.
JavaScript Date objects are described in Section 20.3 of the ECMAScript Language Specification.
napi_create_external
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_external(napi_env env,
                                 void* data,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] data: Raw pointer to the external data.
[in] finalize_cb: Optional callback to call when the external value is being collected. napi_finalize provides more details.
[in] finalize_hint: Optional hint to pass to the finalize callback during collection.
[out] result: A napi_value representing an external value.
Returns napi_ok if the API succeeded.
This API allocates a JavaScript value with external data attached to it. This is used to pass external data through JavaScript code, so it can be retrieved later by native code using napi_get_value_external.
The API adds a napi_finalize callback which will be called when the JavaScript object just created has been garbage collected.
The created value is not an object, and therefore does not support additional properties. It is considered a distinct value type: calling napi_typeof() with an external value yields napi_external.
napi_create_external_arraybuffer
#
Added in: v8.0.0 N-API version: 1
napi_status
napi_create_external_arraybuffer(napi_env env,
                                 void* external_data,
                                 size_t byte_length,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] external_data: Pointer to the underlying byte buffer of the ArrayBuffer.
[in] byte_length: The length in bytes of the underlying buffer.
[in] finalize_cb: Optional callback to call when the ArrayBuffer is being collected. napi_finalize provides more details.
[in] finalize_hint: Optional hint to pass to the finalize callback during collection.
[out] result: A napi_value representing a JavaScript ArrayBuffer.
Returns napi_ok if the API succeeded.
Some runtimes other than Node.js have dropped support for external buffers. On runtimes other than Node.js this method may return napi_no_external_buffers_allowed to indicate that external buffers are not supported. One such runtime is Electron as described in this issue electron/issues/35801.
In order to maintain broadest compatibility with all runtimes you may define NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED in your addon before includes for the node-api headers. Doing so will hide the 2 functions that create external buffers. This will ensure a compilation error occurs if you accidentally use one of these methods.
This API returns a Node-API value corresponding to a JavaScript ArrayBuffer. The underlying byte buffer of the ArrayBuffer is externally allocated and managed. The caller must ensure that the byte buffer remains valid until the finalize callback is called.
The API adds a napi_finalize callback which will be called when the JavaScript object just created has been garbage collected.
JavaScript ArrayBuffers are described in Section 24.1 of the ECMAScript Language Specification.
napi_create_external_buffer
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_external_buffer(napi_env env,
                                        size_t length,
                                        void* data,
                                        napi_finalize finalize_cb,
                                        void* finalize_hint,
                                        napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] length: Size in bytes of the input buffer (should be the same as the size of the new buffer).
[in] data: Raw pointer to the underlying buffer to expose to JavaScript.
[in] finalize_cb: Optional callback to call when the ArrayBuffer is being collected. napi_finalize provides more details.
[in] finalize_hint: Optional hint to pass to the finalize callback during collection.
[out] result: A napi_value representing a node::Buffer.
Returns napi_ok if the API succeeded.
Some runtimes other than Node.js have dropped support for external buffers. On runtimes other than Node.js this method may return napi_no_external_buffers_allowed to indicate that external buffers are not supported. One such runtime is Electron as described in this issue electron/issues/35801.
In order to maintain broadest compatibility with all runtimes you may define NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED in your addon before includes for the node-api headers. Doing so will hide the 2 functions that create external buffers. This will ensure a compilation error occurs if you accidentally use one of these methods.
This API allocates a node::Buffer object and initializes it with data backed by the passed in buffer. While this is still a fully-supported data structure, in most cases using a TypedArray will suffice.
The API adds a napi_finalize callback which will be called when the JavaScript object just created has been garbage collected.
For Node.js >=4 Buffers are Uint8Arrays.
napi_create_object
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_object(napi_env env, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[out] result: A napi_value representing a JavaScript Object.
Returns napi_ok if the API succeeded.
This API allocates a default JavaScript Object. It is the equivalent of doing new Object() in JavaScript.
The JavaScript Object type is described in Section 6.1.7 of the ECMAScript Language Specification.
napi_create_symbol
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_symbol(napi_env env,
                               napi_value description,
                               napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] description: Optional napi_value which refers to a JavaScript string to be set as the description for the symbol.
[out] result: A napi_value representing a JavaScript symbol.
Returns napi_ok if the API succeeded.
This API creates a JavaScript symbol value from a UTF8-encoded C string.
The JavaScript symbol type is described in Section 19.4 of the ECMAScript Language Specification.
node_api_symbol_for
#
Added in: v17.5.0, v16.15.0 N-API version: 9
napi_status node_api_symbol_for(napi_env env,
                                const char* utf8description,
                                size_t length,
                                napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] utf8description: UTF-8 C string representing the text to be used as the description for the symbol.
[in] length: The length of the description string in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[out] result: A napi_value representing a JavaScript symbol.
Returns napi_ok if the API succeeded.
This API searches in the global registry for an existing symbol with the given description. If the symbol already exists it will be returned, otherwise a new symbol will be created in the registry.
The JavaScript symbol type is described in Section 19.4 of the ECMAScript Language Specification.
napi_create_typedarray
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_typedarray(napi_env env,
                                   napi_typedarray_type type,
                                   size_t length,
                                   napi_value arraybuffer,
                                   size_t byte_offset,
                                   napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] type: Scalar datatype of the elements within the TypedArray.
[in] length: Number of elements in the TypedArray.
[in] arraybuffer: ArrayBuffer underlying the typed array.
[in] byte_offset: The byte offset within the ArrayBuffer from which to start projecting the TypedArray.
[out] result: A napi_value representing a JavaScript TypedArray.
Returns napi_ok if the API succeeded.
This API creates a JavaScript TypedArray object over an existing ArrayBuffer. TypedArray objects provide an array-like view over an underlying data buffer where each element has the same underlying binary scalar datatype.
It's required that (length * size_of_element) + byte_offset should be <= the size in bytes of the array passed in. If not, a RangeError exception is raised.
JavaScript TypedArray objects are described in Section 22.2 of the ECMAScript Language Specification.
node_api_create_buffer_from_arraybuffer
#
Added in: v23.0.0, v22.12.0 N-API version: 10
napi_status NAPI_CDECL node_api_create_buffer_from_arraybuffer(napi_env env,
                                                              napi_value arraybuffer,
                                                              size_t byte_offset,
                                                              size_t byte_length,
                                                              napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] arraybuffer: The ArrayBuffer from which the buffer will be created.
[in] byte_offset: The byte offset within the ArrayBuffer from which to start creating the buffer.
[in] byte_length: The length in bytes of the buffer to be created from the ArrayBuffer.
[out] result: A napi_value representing the created JavaScript Buffer object.
Returns napi_ok if the API succeeded.
This API creates a JavaScript Buffer object from an existing ArrayBuffer. The Buffer object is a Node.js-specific class that provides a way to work with binary data directly in JavaScript.
The byte range [byte_offset, byte_offset + byte_length) must be within the bounds of the ArrayBuffer. If byte_offset + byte_length exceeds the size of the ArrayBuffer, a RangeError exception is raised.
napi_create_dataview
#
Added in: v8.3.0 N-API version: 1
napi_status napi_create_dataview(napi_env env,
                                 size_t byte_length,
                                 napi_value arraybuffer,
                                 size_t byte_offset,
                                 napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] length: Number of elements in the DataView.
[in] arraybuffer: ArrayBuffer underlying the DataView.
[in] byte_offset: The byte offset within the ArrayBuffer from which to start projecting the DataView.
[out] result: A napi_value representing a JavaScript DataView.
Returns napi_ok if the API succeeded.
This API creates a JavaScript DataView object over an existing ArrayBuffer. DataView objects provide an array-like view over an underlying data buffer, but one which allows items of different size and type in the ArrayBuffer.
It is required that byte_length + byte_offset is less than or equal to the size in bytes of the array passed in. If not, a RangeError exception is raised.
JavaScript DataView objects are described in Section 24.3 of the ECMAScript Language Specification.
Functions to convert from C types to Node-API
#
napi_create_int32
#
Added in: v8.4.0 N-API version: 1
napi_status napi_create_int32(napi_env env, int32_t value, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: Integer value to be represented in JavaScript.
[out] result: A napi_value representing a JavaScript number.
Returns napi_ok if the API succeeded.
This API is used to convert from the C int32_t type to the JavaScript number type.
The JavaScript number type is described in Section 6.1.6 of the ECMAScript Language Specification.
napi_create_uint32
#
Added in: v8.4.0 N-API version: 1
napi_status napi_create_uint32(napi_env env, uint32_t value, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: Unsigned integer value to be represented in JavaScript.
[out] result: A napi_value representing a JavaScript number.
Returns napi_ok if the API succeeded.
This API is used to convert from the C uint32_t type to the JavaScript number type.
The JavaScript number type is described in Section 6.1.6 of the ECMAScript Language Specification.
napi_create_int64
#
Added in: v8.4.0 N-API version: 1
napi_status napi_create_int64(napi_env env, int64_t value, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: Integer value to be represented in JavaScript.
[out] result: A napi_value representing a JavaScript number.
Returns napi_ok if the API succeeded.
This API is used to convert from the C int64_t type to the JavaScript number type.
The JavaScript number type is described in Section 6.1.6 of the ECMAScript Language Specification. Note the complete range of int64_t cannot be represented with full precision in JavaScript. Integer values outside the range of Number.MIN_SAFE_INTEGER -(2**53 - 1) - Number.MAX_SAFE_INTEGER (2**53 - 1) will lose precision.
napi_create_double
#
Added in: v8.4.0 N-API version: 1
napi_status napi_create_double(napi_env env, double value, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: Double-precision value to be represented in JavaScript.
[out] result: A napi_value representing a JavaScript number.
Returns napi_ok if the API succeeded.
This API is used to convert from the C double type to the JavaScript number type.
The JavaScript number type is described in Section 6.1.6 of the ECMAScript Language Specification.
napi_create_bigint_int64
#
Added in: v10.7.0 N-API version: 6
napi_status napi_create_bigint_int64(napi_env env,
                                     int64_t value,
                                     napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] value: Integer value to be represented in JavaScript.
[out] result: A napi_value representing a JavaScript BigInt.
Returns napi_ok if the API succeeded.
This API converts the C int64_t type to the JavaScript BigInt type.
napi_create_bigint_uint64
#
Added in: v10.7.0 N-API version: 6
napi_status napi_create_bigint_uint64(napi_env env,
                                      uint64_t value,
                                      napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] value: Unsigned integer value to be represented in JavaScript.
[out] result: A napi_value representing a JavaScript BigInt.
Returns napi_ok if the API succeeded.
This API converts the C uint64_t type to the JavaScript BigInt type.
napi_create_bigint_words
#
Added in: v10.7.0 N-API version: 6
napi_status napi_create_bigint_words(napi_env env,
                                     int sign_bit,
                                     size_t word_count,
                                     const uint64_t* words,
                                     napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] sign_bit: Determines if the resulting BigInt will be positive or negative.
[in] word_count: The length of the words array.
[in] words: An array of uint64_t little-endian 64-bit words.
[out] result: A napi_value representing a JavaScript BigInt.
Returns napi_ok if the API succeeded.
This API converts an array of unsigned 64-bit words into a single BigInt value.
The resulting BigInt is calculated as: (–1)sign_bit (words[0] × (264)0 + words[1] × (264)1 + …)
napi_create_string_latin1
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_string_latin1(napi_env env,
                                      const char* str,
                                      size_t length,
                                      napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing an ISO-8859-1-encoded string.
[in] length: The length of the string in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[out] result: A napi_value representing a JavaScript string.
Returns napi_ok if the API succeeded.
This API creates a JavaScript string value from an ISO-8859-1-encoded C string. The native string is copied.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
node_api_create_external_string_latin1
#
Added in: v20.4.0, v18.18.0 N-API version: 10
napi_status
node_api_create_external_string_latin1(napi_env env,
                                       char* str,
                                       size_t length,
                                       napi_finalize finalize_callback,
                                       void* finalize_hint,
                                       napi_value* result,
                                       bool* copied);
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing an ISO-8859-1-encoded string.
[in] length: The length of the string in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[in] finalize_callback: The function to call when the string is being collected. The function will be called with the following parameters:
[in] env: The environment in which the add-on is running. This value may be null if the string is being collected as part of the termination of the worker or the main Node.js instance.
[in] data: This is the value str as a void* pointer.
[in] finalize_hint: This is the value finalize_hint that was given to the API. napi_finalize provides more details. This parameter is optional. Passing a null value means that the add-on doesn't need to be notified when the corresponding JavaScript string is collected.
[in] finalize_hint: Optional hint to pass to the finalize callback during collection.
[out] result: A napi_value representing a JavaScript string.
[out] copied: Whether the string was copied. If it was, the finalizer will already have been invoked to destroy str.
Returns napi_ok if the API succeeded.
This API creates a JavaScript string value from an ISO-8859-1-encoded C string. The native string may not be copied and must thus exist for the entire life cycle of the JavaScript value.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
napi_create_string_utf16
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_string_utf16(napi_env env,
                                     const char16_t* str,
                                     size_t length,
                                     napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing a UTF16-LE-encoded string.
[in] length: The length of the string in two-byte code units, or NAPI_AUTO_LENGTH if it is null-terminated.
[out] result: A napi_value representing a JavaScript string.
Returns napi_ok if the API succeeded.
This API creates a JavaScript string value from a UTF16-LE-encoded C string. The native string is copied.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
node_api_create_external_string_utf16
#
Added in: v20.4.0, v18.18.0 N-API version: 10
napi_status
node_api_create_external_string_utf16(napi_env env,
                                      char16_t* str,
                                      size_t length,
                                      napi_finalize finalize_callback,
                                      void* finalize_hint,
                                      napi_value* result,
                                      bool* copied);
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing a UTF16-LE-encoded string.
[in] length: The length of the string in two-byte code units, or NAPI_AUTO_LENGTH if it is null-terminated.
[in] finalize_callback: The function to call when the string is being collected. The function will be called with the following parameters:
[in] env: The environment in which the add-on is running. This value may be null if the string is being collected as part of the termination of the worker or the main Node.js instance.
[in] data: This is the value str as a void* pointer.
[in] finalize_hint: This is the value finalize_hint that was given to the API. napi_finalize provides more details. This parameter is optional. Passing a null value means that the add-on doesn't need to be notified when the corresponding JavaScript string is collected.
[in] finalize_hint: Optional hint to pass to the finalize callback during collection.
[out] result: A napi_value representing a JavaScript string.
[out] copied: Whether the string was copied. If it was, the finalizer will already have been invoked to destroy str.
Returns napi_ok if the API succeeded.
This API creates a JavaScript string value from a UTF16-LE-encoded C string. The native string may not be copied and must thus exist for the entire life cycle of the JavaScript value.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
napi_create_string_utf8
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_string_utf8(napi_env env,
                                    const char* str,
                                    size_t length,
                                    napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing a UTF8-encoded string.
[in] length: The length of the string in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[out] result: A napi_value representing a JavaScript string.
Returns napi_ok if the API succeeded.
This API creates a JavaScript string value from a UTF8-encoded C string. The native string is copied.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
Functions to create optimized property keys
#
Many JavaScript engines including V8 use internalized strings as keys to set and get property values. They typically use a hash table to create and lookup such strings. While it adds some cost per key creation, it improves the performance after that by enabling comparison of string pointers instead of the whole strings.
If a new JavaScript string is intended to be used as a property key, then for some JavaScript engines it will be more efficient to use the functions in this section. Otherwise, use the napi_create_string_utf8 or node_api_create_external_string_utf8 series functions as there may be additional overhead in creating/storing strings with the property key creation methods.
node_api_create_property_key_latin1
#
Added in: v22.9.0, v20.18.0 N-API version: 10
napi_status NAPI_CDECL node_api_create_property_key_latin1(napi_env env,
                                                           const char* str,
                                                           size_t length,
                                                           napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing an ISO-8859-1-encoded string.
[in] length: The length of the string in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[out] result: A napi_value representing an optimized JavaScript string to be used as a property key for objects.
Returns napi_ok if the API succeeded.
This API creates an optimized JavaScript string value from an ISO-8859-1-encoded C string to be used as a property key for objects. The native string is copied. In contrast with napi_create_string_latin1, subsequent calls to this function with the same str pointer may benefit from a speedup in the creation of the requested napi_value, depending on the engine.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
node_api_create_property_key_utf16
#
Added in: v21.7.0, v20.12.0 N-API version: 10
napi_status NAPI_CDECL node_api_create_property_key_utf16(napi_env env,
                                                          const char16_t* str,
                                                          size_t length,
                                                          napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing a UTF16-LE-encoded string.
[in] length: The length of the string in two-byte code units, or NAPI_AUTO_LENGTH if it is null-terminated.
[out] result: A napi_value representing an optimized JavaScript string to be used as a property key for objects.
Returns napi_ok if the API succeeded.
This API creates an optimized JavaScript string value from a UTF16-LE-encoded C string to be used as a property key for objects. The native string is copied.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
node_api_create_property_key_utf8
#
Added in: v22.9.0, v20.18.0 N-API version: 10
napi_status NAPI_CDECL node_api_create_property_key_utf8(napi_env env,
                                                         const char* str,
                                                         size_t length,
                                                         napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing a UTF8-encoded string.
[in] length: The length of the string in two-byte code units, or NAPI_AUTO_LENGTH if it is null-terminated.
[out] result: A napi_value representing an optimized JavaScript string to be used as a property key for objects.
Returns napi_ok if the API succeeded.
This API creates an optimized JavaScript string value from a UTF8-encoded C string to be used as a property key for objects. The native string is copied.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
Functions to convert from Node-API to C types
#
napi_get_array_length
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_array_length(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing the JavaScript Array whose length is being queried.
[out] result: uint32 representing length of the array.
Returns napi_ok if the API succeeded.
This API returns the length of an array.
Array length is described in Section 22.1.4.1 of the ECMAScript Language Specification.
napi_get_arraybuffer_info
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_arraybuffer_info(napi_env env,
                                      napi_value arraybuffer,
                                      void** data,
                                      size_t* byte_length)
copy
[in] env: The environment that the API is invoked under.
[in] arraybuffer: napi_value representing the ArrayBuffer being queried.
[out] data: The underlying data buffer of the ArrayBuffer. If byte_length is 0, this may be NULL or any other pointer value.
[out] byte_length: Length in bytes of the underlying data buffer.
Returns napi_ok if the API succeeded.
This API is used to retrieve the underlying data buffer of an ArrayBuffer and its length.
WARNING: Use caution while using this API. The lifetime of the underlying data buffer is managed by the ArrayBuffer even after it's returned. A possible safe way to use this API is in conjunction with napi_create_reference, which can be used to guarantee control over the lifetime of the ArrayBuffer. It's also safe to use the returned data buffer within the same callback as long as there are no calls to other APIs that might trigger a GC.
napi_get_buffer_info
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_buffer_info(napi_env env,
                                 napi_value value,
                                 void** data,
                                 size_t* length)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing the node::Buffer or Uint8Array being queried.
[out] data: The underlying data buffer of the node::Buffer or Uint8Array. If length is 0, this may be NULL or any other pointer value.
[out] length: Length in bytes of the underlying data buffer.
Returns napi_ok if the API succeeded.
This method returns the identical data and byte_length as napi_get_typedarray_info. And napi_get_typedarray_info accepts a node::Buffer (a Uint8Array) as the value too.
This API is used to retrieve the underlying data buffer of a node::Buffer and its length.
Warning: Use caution while using this API since the underlying data buffer's lifetime is not guaranteed if it's managed by the VM.
napi_get_prototype
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_prototype(napi_env env,
                               napi_value object,
                               napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] object: napi_value representing JavaScript Object whose prototype to return. This returns the equivalent of Object.getPrototypeOf (which is not the same as the function's prototype property).
[out] result: napi_value representing prototype of the given object.
Returns napi_ok if the API succeeded.
napi_get_typedarray_info
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_typedarray_info(napi_env env,
                                     napi_value typedarray,
                                     napi_typedarray_type* type,
                                     size_t* length,
                                     void** data,
                                     napi_value* arraybuffer,
                                     size_t* byte_offset)
copy
[in] env: The environment that the API is invoked under.
[in] typedarray: napi_value representing the TypedArray whose properties to query.
[out] type: Scalar datatype of the elements within the TypedArray.
[out] length: The number of elements in the TypedArray.
[out] data: The data buffer underlying the TypedArray adjusted by the byte_offset value so that it points to the first element in the TypedArray. If the length of the array is 0, this may be NULL or any other pointer value.
[out] arraybuffer: The ArrayBuffer underlying the TypedArray.
[out] byte_offset: The byte offset within the underlying native array at which the first element of the arrays is located. The value for the data parameter has already been adjusted so that data points to the first element in the array. Therefore, the first byte of the native array would be at data - byte_offset.
Returns napi_ok if the API succeeded.
This API returns various properties of a typed array.
Any of the out parameters may be NULL if that property is unneeded.
Warning: Use caution while using this API since the underlying data buffer is managed by the VM.
napi_get_dataview_info
#
Added in: v8.3.0 N-API version: 1
napi_status napi_get_dataview_info(napi_env env,
                                   napi_value dataview,
                                   size_t* byte_length,
                                   void** data,
                                   napi_value* arraybuffer,
                                   size_t* byte_offset)
copy
[in] env: The environment that the API is invoked under.
[in] dataview: napi_value representing the DataView whose properties to query.
[out] byte_length: Number of bytes in the DataView.
[out] data: The data buffer underlying the DataView. If byte_length is 0, this may be NULL or any other pointer value.
[out] arraybuffer: ArrayBuffer underlying the DataView.
[out] byte_offset: The byte offset within the data buffer from which to start projecting the DataView.
Returns napi_ok if the API succeeded.
Any of the out parameters may be NULL if that property is unneeded.
This API returns various properties of a DataView.
napi_get_date_value
#
Added in: v11.11.0, v10.17.0 N-API version: 5
napi_status napi_get_date_value(napi_env env,
                                napi_value value,
                                double* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing a JavaScript Date.
[out] result: Time value as a double represented as milliseconds since midnight at the beginning of 01 January, 1970 UTC.
This API does not observe leap seconds; they are ignored, as ECMAScript aligns with POSIX time specification.
Returns napi_ok if the API succeeded. If a non-date napi_value is passed in it returns napi_date_expected.
This API returns the C double primitive of time value for the given JavaScript Date.
napi_get_value_bool
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_bool(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript Boolean.
[out] result: C boolean primitive equivalent of the given JavaScript Boolean.
Returns napi_ok if the API succeeded. If a non-boolean napi_value is passed in it returns napi_boolean_expected.
This API returns the C boolean primitive equivalent of the given JavaScript Boolean.
napi_get_value_double
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_double(napi_env env,
                                  napi_value value,
                                  double* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript number.
[out] result: C double primitive equivalent of the given JavaScript number.
Returns napi_ok if the API succeeded. If a non-number napi_value is passed in it returns napi_number_expected.
This API returns the C double primitive equivalent of the given JavaScript number.
napi_get_value_bigint_int64
#
Added in: v10.7.0 N-API version: 6
napi_status napi_get_value_bigint_int64(napi_env env,
                                        napi_value value,
                                        int64_t* result,
                                        bool* lossless);
copy
[in] env: The environment that the API is invoked under
[in] value: napi_value representing JavaScript BigInt.
[out] result: C int64_t primitive equivalent of the given JavaScript BigInt.
[out] lossless: Indicates whether the BigInt value was converted losslessly.
Returns napi_ok if the API succeeded. If a non-BigInt is passed in it returns napi_bigint_expected.
This API returns the C int64_t primitive equivalent of the given JavaScript BigInt. If needed it will truncate the value, setting lossless to false.
napi_get_value_bigint_uint64
#
Added in: v10.7.0 N-API version: 6
napi_status napi_get_value_bigint_uint64(napi_env env,
                                        napi_value value,
                                        uint64_t* result,
                                        bool* lossless);
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript BigInt.
[out] result: C uint64_t primitive equivalent of the given JavaScript BigInt.
[out] lossless: Indicates whether the BigInt value was converted losslessly.
Returns napi_ok if the API succeeded. If a non-BigInt is passed in it returns napi_bigint_expected.
This API returns the C uint64_t primitive equivalent of the given JavaScript BigInt. If needed it will truncate the value, setting lossless to false.
napi_get_value_bigint_words
#
Added in: v10.7.0 N-API version: 6
napi_status napi_get_value_bigint_words(napi_env env,
                                        napi_value value,
                                        int* sign_bit,
                                        size_t* word_count,
                                        uint64_t* words);
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript BigInt.
[out] sign_bit: Integer representing if the JavaScript BigInt is positive or negative.
[in/out] word_count: Must be initialized to the length of the words array. Upon return, it will be set to the actual number of words that would be needed to store this BigInt.
[out] words: Pointer to a pre-allocated 64-bit word array.
Returns napi_ok if the API succeeded.
This API converts a single BigInt value into a sign bit, 64-bit little-endian array, and the number of elements in the array. sign_bit and words may be both set to NULL, in order to get only word_count.
napi_get_value_external
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_external(napi_env env,
                                    napi_value value,
                                    void** result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript external value.
[out] result: Pointer to the data wrapped by the JavaScript external value.
Returns napi_ok if the API succeeded. If a non-external napi_value is passed in it returns napi_invalid_arg.
This API retrieves the external data pointer that was previously passed to napi_create_external().
napi_get_value_int32
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_int32(napi_env env,
                                 napi_value value,
                                 int32_t* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript number.
[out] result: C int32 primitive equivalent of the given JavaScript number.
Returns napi_ok if the API succeeded. If a non-number napi_value is passed in napi_number_expected.
This API returns the C int32 primitive equivalent of the given JavaScript number.
If the number exceeds the range of the 32 bit integer, then the result is truncated to the equivalent of the bottom 32 bits. This can result in a large positive number becoming a negative number if the value is > 231 - 1.
Non-finite number values (NaN, +Infinity, or -Infinity) set the result to zero.
napi_get_value_int64
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_int64(napi_env env,
                                 napi_value value,
                                 int64_t* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript number.
[out] result: C int64 primitive equivalent of the given JavaScript number.
Returns napi_ok if the API succeeded. If a non-number napi_value is passed in it returns napi_number_expected.
This API returns the C int64 primitive equivalent of the given JavaScript number.
number values outside the range of Number.MIN_SAFE_INTEGER -(2**53 - 1) - Number.MAX_SAFE_INTEGER (2**53 - 1) will lose precision.
Non-finite number values (NaN, +Infinity, or -Infinity) set the result to zero.
napi_get_value_string_latin1
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_string_latin1(napi_env env,
                                         napi_value value,
                                         char* buf,
                                         size_t bufsize,
                                         size_t* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript string.
[in] buf: Buffer to write the ISO-8859-1-encoded string into. If NULL is passed in, the length of the string in bytes and excluding the null terminator is returned in result.
[in] bufsize: Size of the destination buffer. When this value is insufficient, the returned string is truncated and null-terminated. If this value is zero, then the string is not returned and no changes are done to the buffer.
[out] result: Number of bytes copied into the buffer, excluding the null terminator.
Returns napi_ok if the API succeeded. If a non-string napi_value is passed in it returns napi_string_expected.
This API returns the ISO-8859-1-encoded string corresponding the value passed in.
napi_get_value_string_utf8
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_string_utf8(napi_env env,
                                       napi_value value,
                                       char* buf,
                                       size_t bufsize,
                                       size_t* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript string.
[in] buf: Buffer to write the UTF8-encoded string into. If NULL is passed in, the length of the string in bytes and excluding the null terminator is returned in result.
[in] bufsize: Size of the destination buffer. When this value is insufficient, the returned string is truncated and null-terminated. If this value is zero, then the string is not returned and no changes are done to the buffer.
[out] result: Number of bytes copied into the buffer, excluding the null terminator.
Returns napi_ok if the API succeeded. If a non-string napi_value is passed in it returns napi_string_expected.
This API returns the UTF8-encoded string corresponding the value passed in.
napi_get_value_string_utf16
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_string_utf16(napi_env env,
                                        napi_value value,
                                        char16_t* buf,
                                        size_t bufsize,
                                        size_t* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript string.
[in] buf: Buffer to write the UTF16-LE-encoded string into. If NULL is passed in, the length of the string in 2-byte code units and excluding the null terminator is returned.
[in] bufsize: Size of the destination buffer. When this value is insufficient, the returned string is truncated and null-terminated. If this value is zero, then the string is not returned and no changes are done to the buffer.
[out] result: Number of 2-byte code units copied into the buffer, excluding the null terminator.
Returns napi_ok if the API succeeded. If a non-string napi_value is passed in it returns napi_string_expected.
This API returns the UTF16-encoded string corresponding the value passed in.
napi_get_value_uint32
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_uint32(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript number.
[out] result: C primitive equivalent of the given napi_value as a uint32_t.
Returns napi_ok if the API succeeded. If a non-number napi_value is passed in it returns napi_number_expected.
This API returns the C primitive equivalent of the given napi_value as a uint32_t.
Functions to get global instances
#
napi_get_boolean
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_boolean(napi_env env, bool value, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The value of the boolean to retrieve.
[out] result: napi_value representing JavaScript Boolean singleton to retrieve.
Returns napi_ok if the API succeeded.
This API is used to return the JavaScript singleton object that is used to represent the given boolean value.
napi_get_global
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_global(napi_env env, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[out] result: napi_value representing JavaScript global object.
Returns napi_ok if the API succeeded.
This API returns the global object.
napi_get_null
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_null(napi_env env, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[out] result: napi_value representing JavaScript null object.
Returns napi_ok if the API succeeded.
This API returns the null object.
napi_get_undefined
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_undefined(napi_env env, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[out] result: napi_value representing JavaScript Undefined value.
Returns napi_ok if the API succeeded.
This API returns the Undefined object.
Working with JavaScript values and abstract operations
#
Node-API exposes a set of APIs to perform some abstract operations on JavaScript values. Some of these operations are documented under Section 7 of the ECMAScript Language Specification.
These APIs support doing one of the following:
Coerce JavaScript values to specific JavaScript types (such as number or string).
Check the type of a JavaScript value.
Check for equality between two JavaScript values.
napi_coerce_to_bool
#
Added in: v8.0.0 N-API version: 1
napi_status napi_coerce_to_bool(napi_env env,
                                napi_value value,
                                napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to coerce.
[out] result: napi_value representing the coerced JavaScript Boolean.
Returns napi_ok if the API succeeded.
This API implements the abstract operation ToBoolean() as defined in Section 7.1.2 of the ECMAScript Language Specification.
napi_coerce_to_number
#
Added in: v8.0.0 N-API version: 1
napi_status napi_coerce_to_number(napi_env env,
                                  napi_value value,
                                  napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to coerce.
[out] result: napi_value representing the coerced JavaScript number.
Returns napi_ok if the API succeeded.
This API implements the abstract operation ToNumber() as defined in Section 7.1.3 of the ECMAScript Language Specification. This function potentially runs JS code if the passed-in value is an object.
napi_coerce_to_object
#
Added in: v8.0.0 N-API version: 1
napi_status napi_coerce_to_object(napi_env env,
                                  napi_value value,
                                  napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to coerce.
[out] result: napi_value representing the coerced JavaScript Object.
Returns napi_ok if the API succeeded.
This API implements the abstract operation ToObject() as defined in Section 7.1.13 of the ECMAScript Language Specification.
napi_coerce_to_string
#
Added in: v8.0.0 N-API version: 1
napi_status napi_coerce_to_string(napi_env env,
                                  napi_value value,
                                  napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to coerce.
[out] result: napi_value representing the coerced JavaScript string.
Returns napi_ok if the API succeeded.
This API implements the abstract operation ToString() as defined in Section 7.1.13 of the ECMAScript Language Specification. This function potentially runs JS code if the passed-in value is an object.
napi_typeof
#
Added in: v8.0.0 N-API version: 1
napi_status napi_typeof(napi_env env, napi_value value, napi_valuetype* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value whose type to query.
[out] result: The type of the JavaScript value.
Returns napi_ok if the API succeeded.
napi_invalid_arg if the type of value is not a known ECMAScript type and value is not an External value.
This API represents behavior similar to invoking the typeof Operator on the object as defined in Section 12.5.5 of the ECMAScript Language Specification. However, there are some differences:
It has support for detecting an External value.
It detects null as a separate type, while ECMAScript typeof would detect object.
If value has a type that is invalid, an error is returned.
napi_instanceof
#
Added in: v8.0.0 N-API version: 1
napi_status napi_instanceof(napi_env env,
                            napi_value object,
                            napi_value constructor,
                            bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] object: The JavaScript value to check.
[in] constructor: The JavaScript function object of the constructor function to check against.
[out] result: Boolean that is set to true if object instanceof constructor is true.
Returns napi_ok if the API succeeded.
This API represents invoking the instanceof Operator on the object as defined in Section 12.10.4 of the ECMAScript Language Specification.
napi_is_array
#
Added in: v8.0.0 N-API version: 1
napi_status napi_is_array(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to check.
[out] result: Whether the given object is an array.
Returns napi_ok if the API succeeded.
This API represents invoking the IsArray operation on the object as defined in Section 7.2.2 of the ECMAScript Language Specification.
napi_is_arraybuffer
#
Added in: v8.0.0 N-API version: 1
napi_status napi_is_arraybuffer(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to check.
[out] result: Whether the given object is an ArrayBuffer.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in is an array buffer.
napi_is_buffer
#
Added in: v8.0.0 N-API version: 1
napi_status napi_is_buffer(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to check.
[out] result: Whether the given napi_value represents a node::Buffer or Uint8Array object.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in is a buffer or Uint8Array. napi_is_typedarray should be preferred if the caller needs to check if the value is a Uint8Array.
napi_is_date
#
Added in: v11.11.0, v10.17.0 N-API version: 5
napi_status napi_is_date(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to check.
[out] result: Whether the given napi_value represents a JavaScript Date object.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in is a date.
napi_is_error
#
Added in: v8.0.0 N-API version: 1
napi_status napi_is_error(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to check.
[out] result: Whether the given napi_value represents an Error object.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in is an Error.
napi_is_typedarray
#
Added in: v8.0.0 N-API version: 1
napi_status napi_is_typedarray(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to check.
[out] result: Whether the given napi_value represents a TypedArray.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in is a typed array.
napi_is_dataview
#
Added in: v8.3.0 N-API version: 1
napi_status napi_is_dataview(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to check.
[out] result: Whether the given napi_value represents a DataView.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in is a DataView.
napi_strict_equals
#
Added in: v8.0.0 N-API version: 1
napi_status napi_strict_equals(napi_env env,
                               napi_value lhs,
                               napi_value rhs,
                               bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] lhs: The JavaScript value to check.
[in] rhs: The JavaScript value to check against.
[out] result: Whether the two napi_value objects are equal.
Returns napi_ok if the API succeeded.
This API represents the invocation of the Strict Equality algorithm as defined in Section 7.2.14 of the ECMAScript Language Specification.
napi_detach_arraybuffer
#
Added in: v13.0.0, v12.16.0, v10.22.0 N-API version: 7
napi_status napi_detach_arraybuffer(napi_env env,
                                    napi_value arraybuffer)
copy
[in] env: The environment that the API is invoked under.
[in] arraybuffer: The JavaScript ArrayBuffer to be detached.
Returns napi_ok if the API succeeded. If a non-detachable ArrayBuffer is passed in it returns napi_detachable_arraybuffer_expected.
Generally, an ArrayBuffer is non-detachable if it has been detached before. The engine may impose additional conditions on whether an ArrayBuffer is detachable. For example, V8 requires that the ArrayBuffer be external, that is, created with napi_create_external_arraybuffer.
This API represents the invocation of the ArrayBuffer detach operation as defined in Section 24.1.1.3 of the ECMAScript Language Specification.
napi_is_detached_arraybuffer
#
Added in: v13.3.0, v12.16.0, v10.22.0 N-API version: 7
napi_status napi_is_detached_arraybuffer(napi_env env,
                                         napi_value arraybuffer,
                                         bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] arraybuffer: The JavaScript ArrayBuffer to be checked.
[out] result: Whether the arraybuffer is detached.
Returns napi_ok if the API succeeded.
The ArrayBuffer is considered detached if its internal data is null.
This API represents the invocation of the ArrayBuffer IsDetachedBuffer operation as defined in Section 24.1.1.2 of the ECMAScript Language Specification.
Working with JavaScript properties
#
Node-API exposes a set of APIs to get and set properties on JavaScript objects. Some of these types are documented under Section 7 of the ECMAScript Language Specification.
Properties in JavaScript are represented as a tuple of a key and a value. Fundamentally, all property keys in Node-API can be represented in one of the following forms:
Named: a simple UTF8-encoded string
Integer-Indexed: an index value represented by uint32_t
JavaScript value: these are represented in Node-API by napi_value. This can be a napi_value representing a string, number, or symbol.
Node-API values are represented by the type napi_value. Any Node-API call that requires a JavaScript value takes in a napi_value. However, it's the caller's responsibility to make sure that the napi_value in question is of the JavaScript type expected by the API.
The APIs documented in this section provide a simple interface to get and set properties on arbitrary JavaScript objects represented by napi_value.
For instance, consider the following JavaScript code snippet:
const obj = {};
obj.myProp = 123;
copy
The equivalent can be done using Node-API values with the following snippet:
napi_status status = napi_generic_failure;


// const obj = {}
napi_value obj, value;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;


// Create a napi_value for 123
status = napi_create_int32(env, 123, &value);
if (status != napi_ok) return status;


// obj.myProp = 123
status = napi_set_named_property(env, obj, "myProp", value);
if (status != napi_ok) return status;
copy
Indexed properties can be set in a similar manner. Consider the following JavaScript snippet:
const arr = [];
arr[123] = 'hello';
copy
The equivalent can be done using Node-API values with the following snippet:
napi_status status = napi_generic_failure;


// const arr = [];
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;


// Create a napi_value for 'hello'
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &value);
if (status != napi_ok) return status;


// arr[123] = 'hello';
status = napi_set_element(env, arr, 123, value);
if (status != napi_ok) return status;
copy
Properties can be retrieved using the APIs described in this section. Consider the following JavaScript snippet:
const arr = [];
const value = arr[123];
copy
The following is the approximate equivalent of the Node-API counterpart:
napi_status status = napi_generic_failure;


// const arr = []
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;


// const value = arr[123]
status = napi_get_element(env, arr, 123, &value);
if (status != napi_ok) return status;
copy
Finally, multiple properties can also be defined on an object for performance reasons. Consider the following JavaScript:
const obj = {};
Object.defineProperties(obj, {
  'foo': { value: 123, writable: true, configurable: true, enumerable: true },
  'bar': { value: 456, writable: true, configurable: true, enumerable: true },
});
copy
The following is the approximate equivalent of the Node-API counterpart:
napi_status status = napi_status_generic_failure;


// const obj = {};
napi_value obj;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;


// Create napi_values for 123 and 456
napi_value fooValue, barValue;
status = napi_create_int32(env, 123, &fooValue);
if (status != napi_ok) return status;
status = napi_create_int32(env, 456, &barValue);
if (status != napi_ok) return status;


// Set the properties
napi_property_descriptor descriptors[] = {
  { "foo", NULL, NULL, NULL, NULL, fooValue, napi_writable | napi_configurable, NULL },
  { "bar", NULL, NULL, NULL, NULL, barValue, napi_writable | napi_configurable, NULL }
}
status = napi_define_properties(env,
                                obj,
                                sizeof(descriptors) / sizeof(descriptors[0]),
                                descriptors);
if (status != napi_ok) return status;
copy
Structures
#
napi_property_attributes
#
History









typedef enum {
  napi_default = 0,
  napi_writable = 1 << 0,
  napi_enumerable = 1 << 1,
  napi_configurable = 1 << 2,


  // Used with napi_define_class to distinguish static properties
  // from instance properties. Ignored by napi_define_properties.
  napi_static = 1 << 10,


  // Default for class methods.
  napi_default_method = napi_writable | napi_configurable,


  // Default for object properties, like in JS obj[prop].
  napi_default_jsproperty = napi_writable |
                          napi_enumerable |
                          napi_configurable,
} napi_property_attributes;
copy
napi_property_attributes are flags used to control the behavior of properties set on a JavaScript object. Other than napi_static they correspond to the attributes listed in Section 6.1.7.1 of the ECMAScript Language Specification. They can be one or more of the following bitflags:
napi_default: No explicit attributes are set on the property. By default, a property is read only, not enumerable and not configurable.
napi_writable: The property is writable.
napi_enumerable: The property is enumerable.
napi_configurable: The property is configurable as defined in Section 6.1.7.1 of the ECMAScript Language Specification.
napi_static: The property will be defined as a static property on a class as opposed to an instance property, which is the default. This is used only by napi_define_class. It is ignored by napi_define_properties.
napi_default_method: Like a method in a JS class, the property is configurable and writeable, but not enumerable.
napi_default_jsproperty: Like a property set via assignment in JavaScript, the property is writable, enumerable, and configurable.
napi_property_descriptor
#
typedef struct {
  // One of utf8name or name should be NULL.
  const char* utf8name;
  napi_value name;


  napi_callback method;
  napi_callback getter;
  napi_callback setter;
  napi_value value;


  napi_property_attributes attributes;
  void* data;
} napi_property_descriptor;
copy
utf8name: Optional string describing the key for the property, encoded as UTF8. One of utf8name or name must be provided for the property.
name: Optional napi_value that points to a JavaScript string or symbol to be used as the key for the property. One of utf8name or name must be provided for the property.
value: The value that's retrieved by a get access of the property if the property is a data property. If this is passed in, set getter, setter, method and data to NULL (since these members won't be used).
getter: A function to call when a get access of the property is performed. If this is passed in, set value and method to NULL (since these members won't be used). The given function is called implicitly by the runtime when the property is accessed from JavaScript code (or if a get on the property is performed using a Node-API call). napi_callback provides more details.
setter: A function to call when a set access of the property is performed. If this is passed in, set value and method to NULL (since these members won't be used). The given function is called implicitly by the runtime when the property is set from JavaScript code (or if a set on the property is performed using a Node-API call). napi_callback provides more details.
method: Set this to make the property descriptor object's value property to be a JavaScript function represented by method. If this is passed in, set value, getter and setter to NULL (since these members won't be used). napi_callback provides more details.
attributes: The attributes associated with the particular property. See napi_property_attributes.
data: The callback data passed into method, getter and setter if this function is invoked.
Functions
#
napi_get_property_names
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_property_names(napi_env env,
                                    napi_value object,
                                    napi_value* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object from which to retrieve the properties.
[out] result: A napi_value representing an array of JavaScript values that represent the property names of the object. The API can be used to iterate over result using napi_get_array_length and napi_get_element.
Returns napi_ok if the API succeeded.
This API returns the names of the enumerable properties of object as an array of strings. The properties of object whose key is a symbol will not be included.
napi_get_all_property_names
#
Added in: v13.7.0, v12.17.0, v10.20.0 N-API version: 6
napi_get_all_property_names(napi_env env,
                            napi_value object,
                            napi_key_collection_mode key_mode,
                            napi_key_filter key_filter,
                            napi_key_conversion key_conversion,
                            napi_value* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object from which to retrieve the properties.
[in] key_mode: Whether to retrieve prototype properties as well.
[in] key_filter: Which properties to retrieve (enumerable/readable/writable).
[in] key_conversion: Whether to convert numbered property keys to strings.
[out] result: A napi_value representing an array of JavaScript values that represent the property names of the object. napi_get_array_length and napi_get_element can be used to iterate over result.
Returns napi_ok if the API succeeded.
This API returns an array containing the names of the available properties of this object.
napi_set_property
#
Added in: v8.0.0 N-API version: 1
napi_status napi_set_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value value);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object on which to set the property.
[in] key: The name of the property to set.
[in] value: The property value.
Returns napi_ok if the API succeeded.
This API set a property on the Object passed in.
napi_get_property
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object from which to retrieve the property.
[in] key: The name of the property to retrieve.
[out] result: The value of the property.
Returns napi_ok if the API succeeded.
This API gets the requested property from the Object passed in.
napi_has_property
#
Added in: v8.0.0 N-API version: 1
napi_status napi_has_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              bool* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to query.
[in] key: The name of the property whose existence to check.
[out] result: Whether the property exists on the object or not.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in has the named property.
napi_delete_property
#
Added in: v8.2.0 N-API version: 1
napi_status napi_delete_property(napi_env env,
                                 napi_value object,
                                 napi_value key,
                                 bool* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to query.
[in] key: The name of the property to delete.
[out] result: Whether the property deletion succeeded or not. result can optionally be ignored by passing NULL.
Returns napi_ok if the API succeeded.
This API attempts to delete the key own property from object.
napi_has_own_property
#
Added in: v8.2.0 N-API version: 1
napi_status napi_has_own_property(napi_env env,
                                  napi_value object,
                                  napi_value key,
                                  bool* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to query.
[in] key: The name of the own property whose existence to check.
[out] result: Whether the own property exists on the object or not.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in has the named own property. key must be a string or a symbol, or an error will be thrown. Node-API will not perform any conversion between data types.
napi_set_named_property
#
Added in: v8.0.0 N-API version: 1
napi_status napi_set_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value value);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object on which to set the property.
[in] utf8Name: The name of the property to set.
[in] value: The property value.
Returns napi_ok if the API succeeded.
This method is equivalent to calling napi_set_property with a napi_value created from the string passed in as utf8Name.
napi_get_named_property
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object from which to retrieve the property.
[in] utf8Name: The name of the property to get.
[out] result: The value of the property.
Returns napi_ok if the API succeeded.
This method is equivalent to calling napi_get_property with a napi_value created from the string passed in as utf8Name.
napi_has_named_property
#
Added in: v8.0.0 N-API version: 1
napi_status napi_has_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    bool* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to query.
[in] utf8Name: The name of the property whose existence to check.
[out] result: Whether the property exists on the object or not.
Returns napi_ok if the API succeeded.
This method is equivalent to calling napi_has_property with a napi_value created from the string passed in as utf8Name.
napi_set_element
#
Added in: v8.0.0 N-API version: 1
napi_status napi_set_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value value);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object from which to set the properties.
[in] index: The index of the property to set.
[in] value: The property value.
Returns napi_ok if the API succeeded.
This API sets an element on the Object passed in.
napi_get_element
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object from which to retrieve the property.
[in] index: The index of the property to get.
[out] result: The value of the property.
Returns napi_ok if the API succeeded.
This API gets the element at the requested index.
napi_has_element
#
Added in: v8.0.0 N-API version: 1
napi_status napi_has_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             bool* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to query.
[in] index: The index of the property whose existence to check.
[out] result: Whether the property exists on the object or not.
Returns napi_ok if the API succeeded.
This API returns if the Object passed in has an element at the requested index.
napi_delete_element
#
Added in: v8.2.0 N-API version: 1
napi_status napi_delete_element(napi_env env,
                                napi_value object,
                                uint32_t index,
                                bool* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to query.
[in] index: The index of the property to delete.
[out] result: Whether the element deletion succeeded or not. result can optionally be ignored by passing NULL.
Returns napi_ok if the API succeeded.
This API attempts to delete the specified index from object.
napi_define_properties
#
Added in: v8.0.0 N-API version: 1
napi_status napi_define_properties(napi_env env,
                                   napi_value object,
                                   size_t property_count,
                                   const napi_property_descriptor* properties);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object from which to retrieve the properties.
[in] property_count: The number of elements in the properties array.
[in] properties: The array of property descriptors.
Returns napi_ok if the API succeeded.
This method allows the efficient definition of multiple properties on a given object. The properties are defined using property descriptors (see napi_property_descriptor). Given an array of such property descriptors, this API will set the properties on the object one at a time, as defined by DefineOwnProperty() (described in Section 9.1.6 of the ECMA-262 specification).
napi_object_freeze
#
Added in: v14.14.0, v12.20.0 N-API version: 8
napi_status napi_object_freeze(napi_env env,
                               napi_value object);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to freeze.
Returns napi_ok if the API succeeded.
This method freezes a given object. This prevents new properties from being added to it, existing properties from being removed, prevents changing the enumerability, configurability, or writability of existing properties, and prevents the values of existing properties from being changed. It also prevents the object's prototype from being changed. This is described in Section 19.1.2.6 of the ECMA-262 specification.
napi_object_seal
#
Added in: v14.14.0, v12.20.0 N-API version: 8
napi_status napi_object_seal(napi_env env,
                             napi_value object);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to seal.
Returns napi_ok if the API succeeded.
This method seals a given object. This prevents new properties from being added to it, as well as marking all existing properties as non-configurable. This is described in Section 19.1.2.20 of the ECMA-262 specification.
Working with JavaScript functions
#
Node-API provides a set of APIs that allow JavaScript code to call back into native code. Node-APIs that support calling back into native code take in a callback functions represented by the napi_callback type. When the JavaScript VM calls back to native code, the napi_callback function provided is invoked. The APIs documented in this section allow the callback function to do the following:
Get information about the context in which the callback was invoked.
Get the arguments passed into the callback.
Return a napi_value back from the callback.
Additionally, Node-API provides a set of functions which allow calling JavaScript functions from native code. One can either call a function like a regular JavaScript function call, or as a constructor function.
Any non-NULL data which is passed to this API via the data field of the napi_property_descriptor items can be associated with object and freed whenever object is garbage-collected by passing both object and the data to napi_add_finalizer.
napi_call_function
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_call_function(napi_env env,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] recv: The this value passed to the called function.
[in] func: napi_value representing the JavaScript function to be invoked.
[in] argc: The count of elements in the argv array.
[in] argv: Array of napi_values representing JavaScript values passed in as arguments to the function.
[out] result: napi_value representing the JavaScript object returned.
Returns napi_ok if the API succeeded.
This method allows a JavaScript function object to be called from a native add-on. This is the primary mechanism of calling back from the add-on's native code into JavaScript. For the special case of calling into JavaScript after an async operation, see napi_make_callback.
A sample use case might look as follows. Consider the following JavaScript snippet:
function AddTwo(num) {
  return num + 2;
}
global.AddTwo = AddTwo;
copy
Then, the above function can be invoked from a native add-on using the following code:
// Get the function named "AddTwo" on the global object
napi_value global, add_two, arg;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;


status = napi_get_named_property(env, global, "AddTwo", &add_two);
if (status != napi_ok) return;


// const arg = 1337
status = napi_create_int32(env, 1337, &arg);
if (status != napi_ok) return;


napi_value* argv = &arg;
size_t argc = 1;


// AddTwo(arg);
napi_value return_val;
status = napi_call_function(env, global, add_two, argc, argv, &return_val);
if (status != napi_ok) return;


// Convert the result back to a native type
int32_t result;
status = napi_get_value_int32(env, return_val, &result);
if (status != napi_ok) return;
copy
napi_create_function
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_function(napi_env env,
                                 const char* utf8name,
                                 size_t length,
                                 napi_callback cb,
                                 void* data,
                                 napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] utf8Name: Optional name of the function encoded as UTF8. This is visible within JavaScript as the new function object's name property.
[in] length: The length of the utf8name in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[in] cb: The native function which should be called when this function object is invoked. napi_callback provides more details.
[in] data: User-provided data context. This will be passed back into the function when invoked later.
[out] result: napi_value representing the JavaScript function object for the newly created function.
Returns napi_ok if the API succeeded.
This API allows an add-on author to create a function object in native code. This is the primary mechanism to allow calling into the add-on's native code from JavaScript.
The newly created function is not automatically visible from script after this call. Instead, a property must be explicitly set on any object that is visible to JavaScript, in order for the function to be accessible from script.
In order to expose a function as part of the add-on's module exports, set the newly created function on the exports object. A sample module might look as follows:
napi_value SayHello(napi_env env, napi_callback_info info) {
  printf("Hello\n");
  return NULL;
}


napi_value Init(napi_env env, napi_value exports) {
  napi_status status;


  napi_value fn;
  status = napi_create_function(env, NULL, 0, SayHello, NULL, &fn);
  if (status != napi_ok) return NULL;


  status = napi_set_named_property(env, exports, "sayHello", fn);
  if (status != napi_ok) return NULL;


  return exports;
}


NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
copy
Given the above code, the add-on can be used from JavaScript as follows:
const myaddon = require('./addon');
myaddon.sayHello();
copy
The string passed to require() is the name of the target in binding.gyp responsible for creating the .node file.
Any non-NULL data which is passed to this API via the data parameter can be associated with the resulting JavaScript function (which is returned in the result parameter) and freed whenever the function is garbage-collected by passing both the JavaScript function and the data to napi_add_finalizer.
JavaScript Functions are described in Section 19.2 of the ECMAScript Language Specification.
napi_get_cb_info
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_cb_info(napi_env env,
                             napi_callback_info cbinfo,
                             size_t* argc,
                             napi_value* argv,
                             napi_value* thisArg,
                             void** data)
copy
[in] env: The environment that the API is invoked under.
[in] cbinfo: The callback info passed into the callback function.
[in-out] argc: Specifies the length of the provided argv array and receives the actual count of arguments. argc can optionally be ignored by passing NULL.
[out] argv: C array of napi_values to which the arguments will be copied. If there are more arguments than the provided count, only the requested number of arguments are copied. If there are fewer arguments provided than claimed, the rest of argv is filled with napi_value values that represent undefined. argv can optionally be ignored by passing NULL.
[out] thisArg: Receives the JavaScript this argument for the call. thisArg can optionally be ignored by passing NULL.
[out] data: Receives the data pointer for the callback. data can optionally be ignored by passing NULL.
Returns napi_ok if the API succeeded.
This method is used within a callback function to retrieve details about the call like the arguments and the this pointer from a given callback info.
napi_get_new_target
#
Added in: v8.6.0 N-API version: 1
napi_status napi_get_new_target(napi_env env,
                                napi_callback_info cbinfo,
                                napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] cbinfo: The callback info passed into the callback function.
[out] result: The new.target of the constructor call.
Returns napi_ok if the API succeeded.
This API returns the new.target of the constructor call. If the current callback is not a constructor call, the result is NULL.
napi_new_instance
#
Added in: v8.0.0 N-API version: 1
napi_status napi_new_instance(napi_env env,
                              napi_value cons,
                              size_t argc,
                              napi_value* argv,
                              napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] cons: napi_value representing the JavaScript function to be invoked as a constructor.
[in] argc: The count of elements in the argv array.
[in] argv: Array of JavaScript values as napi_value representing the arguments to the constructor. If argc is zero this parameter may be omitted by passing in NULL.
[out] result: napi_value representing the JavaScript object returned, which in this case is the constructed object.
This method is used to instantiate a new JavaScript value using a given napi_value that represents the constructor for the object. For example, consider the following snippet:
function MyObject(param) {
  this.param = param;
}


const arg = 'hello';
const value = new MyObject(arg);
copy
The following can be approximated in Node-API using the following snippet:
// Get the constructor function MyObject
napi_value global, constructor, arg, value;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;


status = napi_get_named_property(env, global, "MyObject", &constructor);
if (status != napi_ok) return;


// const arg = "hello"
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &arg);
if (status != napi_ok) return;


napi_value* argv = &arg;
size_t argc = 1;


// const value = new MyObject(arg)
status = napi_new_instance(env, constructor, argc, argv, &value);
copy
Returns napi_ok if the API succeeded.
Object wrap
#
Node-API offers a way to "wrap" C++ classes and instances so that the class constructor and methods can be called from JavaScript.
The napi_define_class API defines a JavaScript class with constructor, static properties and methods, and instance properties and methods that correspond to the C++ class.
When JavaScript code invokes the constructor, the constructor callback uses napi_wrap to wrap a new C++ instance in a JavaScript object, then returns the wrapper object.
When JavaScript code invokes a method or property accessor on the class, the corresponding napi_callback C++ function is invoked. For an instance callback, napi_unwrap obtains the C++ instance that is the target of the call.
For wrapped objects it may be difficult to distinguish between a function called on a class prototype and a function called on an instance of a class. A common pattern used to address this problem is to save a persistent reference to the class constructor for later instanceof checks.
napi_value MyClass_constructor = NULL;
status = napi_get_reference_value(env, MyClass::es_constructor, &MyClass_constructor);
assert(napi_ok == status);
bool is_instance = false;
status = napi_instanceof(env, es_this, MyClass_constructor, &is_instance);
assert(napi_ok == status);
if (is_instance) {
  // napi_unwrap() ...
} else {
  // otherwise...
}
copy
The reference must be freed once it is no longer needed.
There are occasions where napi_instanceof() is insufficient for ensuring that a JavaScript object is a wrapper for a certain native type. This is the case especially when wrapped JavaScript objects are passed back into the addon via static methods rather than as the this value of prototype methods. In such cases there is a chance that they may be unwrapped incorrectly.
const myAddon = require('./build/Release/my_addon.node');


// `openDatabase()` returns a JavaScript object that wraps a native database
// handle.
const dbHandle = myAddon.openDatabase();


// `query()` returns a JavaScript object that wraps a native query handle.
const queryHandle = myAddon.query(dbHandle, 'Gimme ALL the things!');


// There is an accidental error in the line below. The first parameter to
// `myAddon.queryHasRecords()` should be the database handle (`dbHandle`), not
// the query handle (`query`), so the correct condition for the while-loop
// should be
//
// myAddon.queryHasRecords(dbHandle, queryHandle)
//
while (myAddon.queryHasRecords(queryHandle, dbHandle)) {
  // retrieve records
}
copy
In the above example myAddon.queryHasRecords() is a method that accepts two arguments. The first is a database handle and the second is a query handle. Internally, it unwraps the first argument and casts the resulting pointer to a native database handle. It then unwraps the second argument and casts the resulting pointer to a query handle. If the arguments are passed in the wrong order, the casts will work, however, there is a good chance that the underlying database operation will fail, or will even cause an invalid memory access.
To ensure that the pointer retrieved from the first argument is indeed a pointer to a database handle and, similarly, that the pointer retrieved from the second argument is indeed a pointer to a query handle, the implementation of queryHasRecords() has to perform a type validation. Retaining the JavaScript class constructor from which the database handle was instantiated and the constructor from which the query handle was instantiated in napi_refs can help, because napi_instanceof() can then be used to ensure that the instances passed into queryHashRecords() are indeed of the correct type.
Unfortunately, napi_instanceof() does not protect against prototype manipulation. For example, the prototype of the database handle instance can be set to the prototype of the constructor for query handle instances. In this case, the database handle instance can appear as a query handle instance, and it will pass the napi_instanceof() test for a query handle instance, while still containing a pointer to a database handle.
To this end, Node-API provides type-tagging capabilities.
A type tag is a 128-bit integer unique to the addon. Node-API provides the napi_type_tag structure for storing a type tag. When such a value is passed along with a JavaScript object or external stored in a napi_value to napi_type_tag_object(), the JavaScript object will be "marked" with the type tag. The "mark" is invisible on the JavaScript side. When a JavaScript object arrives into a native binding, napi_check_object_type_tag() can be used along with the original type tag to determine whether the JavaScript object was previously "marked" with the type tag. This creates a type-checking capability of a higher fidelity than napi_instanceof() can provide, because such type- tagging survives prototype manipulation and addon unloading/reloading.
Continuing the above example, the following skeleton addon implementation illustrates the use of napi_type_tag_object() and napi_check_object_type_tag().
// This value is the type tag for a database handle. The command
//
//   uuidgen | sed -r -e 's/-//g' -e 's/(.{16})(.*)/0x\1, 0x\2/'
//
// can be used to obtain the two values with which to initialize the structure.
static const napi_type_tag DatabaseHandleTypeTag = {
  0x1edf75a38336451d, 0xa5ed9ce2e4c00c38
};


// This value is the type tag for a query handle.
static const napi_type_tag QueryHandleTypeTag = {
  0x9c73317f9fad44a3, 0x93c3920bf3b0ad6a
};


static napi_value
openDatabase(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value result;


  // Perform the underlying action which results in a database handle.
  DatabaseHandle* dbHandle = open_database();


  // Create a new, empty JS object.
  status = napi_create_object(env, &result);
  if (status != napi_ok) return NULL;


  // Tag the object to indicate that it holds a pointer to a `DatabaseHandle`.
  status = napi_type_tag_object(env, result, &DatabaseHandleTypeTag);
  if (status != napi_ok) return NULL;


  // Store the pointer to the `DatabaseHandle` structure inside the JS object.
  status = napi_wrap(env, result, dbHandle, NULL, NULL, NULL);
  if (status != napi_ok) return NULL;


  return result;
}


// Later when we receive a JavaScript object purporting to be a database handle
// we can use `napi_check_object_type_tag()` to ensure that it is indeed such a
// handle.


static napi_value
query(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value argv[2];
  bool is_db_handle;


  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  if (status != napi_ok) return NULL;


  // Check that the object passed as the first parameter has the previously
  // applied tag.
  status = napi_check_object_type_tag(env,
                                      argv[0],
                                      &DatabaseHandleTypeTag,
                                      &is_db_handle);
  if (status != napi_ok) return NULL;


  // Throw a `TypeError` if it doesn't.
  if (!is_db_handle) {
    // Throw a TypeError.
    return NULL;
  }
}
copy
napi_define_class
#
Added in: v8.0.0 N-API version: 1
napi_status napi_define_class(napi_env env,
                              const char* utf8name,
                              size_t length,
                              napi_callback constructor,
                              void* data,
                              size_t property_count,
                              const napi_property_descriptor* properties,
                              napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] utf8name: Name of the JavaScript constructor function. For clarity, it is recommended to use the C++ class name when wrapping a C++ class.
[in] length: The length of the utf8name in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[in] constructor: Callback function that handles constructing instances of the class. When wrapping a C++ class, this method must be a static member with the napi_callback signature. A C++ class constructor cannot be used. napi_callback provides more details.
[in] data: Optional data to be passed to the constructor callback as the data property of the callback info.
[in] property_count: Number of items in the properties array argument.
[in] properties: Array of property descriptors describing static and instance data properties, accessors, and methods on the class See napi_property_descriptor.
[out] result: A napi_value representing the constructor function for the class.
Returns napi_ok if the API succeeded.
Defines a JavaScript class, including:
A JavaScript constructor function that has the class name. When wrapping a corresponding C++ class, the callback passed via constructor can be used to instantiate a new C++ class instance, which can then be placed inside the JavaScript object instance being constructed using napi_wrap.
Properties on the constructor function whose implementation can call corresponding static data properties, accessors, and methods of the C++ class (defined by property descriptors with the napi_static attribute).
Properties on the constructor function's prototype object. When wrapping a C++ class, non-static data properties, accessors, and methods of the C++ class can be called from the static functions given in the property descriptors without the napi_static attribute after retrieving the C++ class instance placed inside the JavaScript object instance by using napi_unwrap.
When wrapping a C++ class, the C++ constructor callback passed via constructor should be a static method on the class that calls the actual class constructor, then wraps the new C++ instance in a JavaScript object, and returns the wrapper object. See napi_wrap for details.
The JavaScript constructor function returned from napi_define_class is often saved and used later to construct new instances of the class from native code, and/or to check whether provided values are instances of the class. In that case, to prevent the function value from being garbage-collected, a strong persistent reference to it can be created using napi_create_reference, ensuring that the reference count is kept >= 1.
Any non-NULL data which is passed to this API via the data parameter or via the data field of the napi_property_descriptor array items can be associated with the resulting JavaScript constructor (which is returned in the result parameter) and freed whenever the class is garbage-collected by passing both the JavaScript function and the data to napi_add_finalizer.
napi_wrap
#
Added in: v8.0.0 N-API version: 1
napi_status napi_wrap(napi_env env,
                      napi_value js_object,
                      void* native_object,
                      napi_finalize finalize_cb,
                      void* finalize_hint,
                      napi_ref* result);
copy
[in] env: The environment that the API is invoked under.
[in] js_object: The JavaScript object that will be the wrapper for the native object.
[in] native_object: The native instance that will be wrapped in the JavaScript object.
[in] finalize_cb: Optional native callback that can be used to free the native instance when the JavaScript object has been garbage-collected. napi_finalize provides more details.
[in] finalize_hint: Optional contextual hint that is passed to the finalize callback.
[out] result: Optional reference to the wrapped object.
Returns napi_ok if the API succeeded.
Wraps a native instance in a JavaScript object. The native instance can be retrieved later using napi_unwrap().
When JavaScript code invokes a constructor for a class that was defined using napi_define_class(), the napi_callback for the constructor is invoked. After constructing an instance of the native class, the callback must then call napi_wrap() to wrap the newly constructed instance in the already-created JavaScript object that is the this argument to the constructor callback. (That this object was created from the constructor function's prototype, so it already has definitions of all the instance properties and methods.)
Typically when wrapping a class instance, a finalize callback should be provided that simply deletes the native instance that is received as the data argument to the finalize callback.
The optional returned reference is initially a weak reference, meaning it has a reference count of 0. Typically this reference count would be incremented temporarily during async operations that require the instance to remain valid.
Caution: The optional returned reference (if obtained) should be deleted via napi_delete_reference ONLY in response to the finalize callback invocation. If it is deleted before then, then the finalize callback may never be invoked. Therefore, when obtaining a reference a finalize callback is also required in order to enable correct disposal of the reference.
Finalizer callbacks may be deferred, leaving a window where the object has been garbage collected (and the weak reference is invalid) but the finalizer hasn't been called yet. When using napi_get_reference_value() on weak references returned by napi_wrap(), you should still handle an empty result.
Calling napi_wrap() a second time on an object will return an error. To associate another native instance with the object, use napi_remove_wrap() first.
napi_unwrap
#
Added in: v8.0.0 N-API version: 1
napi_status napi_unwrap(napi_env env,
                        napi_value js_object,
                        void** result);
copy
[in] env: The environment that the API is invoked under.
[in] js_object: The object associated with the native instance.
[out] result: Pointer to the wrapped native instance.
Returns napi_ok if the API succeeded.
Retrieves a native instance that was previously wrapped in a JavaScript object using napi_wrap().
When JavaScript code invokes a method or property accessor on the class, the corresponding napi_callback is invoked. If the callback is for an instance method or accessor, then the this argument to the callback is the wrapper object; the wrapped C++ instance that is the target of the call can be obtained then by calling napi_unwrap() on the wrapper object.
napi_remove_wrap
#
Added in: v8.5.0 N-API version: 1
napi_status napi_remove_wrap(napi_env env,
                             napi_value js_object,
                             void** result);
copy
[in] env: The environment that the API is invoked under.
[in] js_object: The object associated with the native instance.
[out] result: Pointer to the wrapped native instance.
Returns napi_ok if the API succeeded.
Retrieves a native instance that was previously wrapped in the JavaScript object js_object using napi_wrap() and removes the wrapping. If a finalize callback was associated with the wrapping, it will no longer be called when the JavaScript object becomes garbage-collected.
napi_type_tag_object
#
Added in: v14.8.0, v12.19.0 N-API version: 8
napi_status napi_type_tag_object(napi_env env,
                                 napi_value js_object,
                                 const napi_type_tag* type_tag);
copy
[in] env: The environment that the API is invoked under.
[in] js_object: The JavaScript object or external to be marked.
[in] type_tag: The tag with which the object is to be marked.
Returns napi_ok if the API succeeded.
Associates the value of the type_tag pointer with the JavaScript object or external. napi_check_object_type_tag() can then be used to compare the tag that was attached to the object with one owned by the addon to ensure that the object has the right type.
If the object already has an associated type tag, this API will return napi_invalid_arg.
napi_check_object_type_tag
#
Added in: v14.8.0, v12.19.0 N-API version: 8
napi_status napi_check_object_type_tag(napi_env env,
                                       napi_value js_object,
                                       const napi_type_tag* type_tag,
                                       bool* result);
copy
[in] env: The environment that the API is invoked under.
[in] js_object: The JavaScript object or external whose type tag to examine.
[in] type_tag: The tag with which to compare any tag found on the object.
[out] result: Whether the type tag given matched the type tag on the object. false is also returned if no type tag was found on the object.
Returns napi_ok if the API succeeded.
Compares the pointer given as type_tag with any that can be found on js_object. If no tag is found on js_object or, if a tag is found but it does not match type_tag, then result is set to false. If a tag is found and it matches type_tag, then result is set to true.
napi_add_finalizer
#
Added in: v8.0.0 N-API version: 5
napi_status napi_add_finalizer(napi_env env,
                               napi_value js_object,
                               void* finalize_data,
                               node_api_basic_finalize finalize_cb,
                               void* finalize_hint,
                               napi_ref* result);
copy
[in] env: The environment that the API is invoked under.
[in] js_object: The JavaScript object to which the native data will be attached.
[in] finalize_data: Optional data to be passed to finalize_cb.
[in] finalize_cb: Native callback that will be used to free the native data when the JavaScript object has been garbage-collected. napi_finalize provides more details.
[in] finalize_hint: Optional contextual hint that is passed to the finalize callback.
[out] result: Optional reference to the JavaScript object.
Returns napi_ok if the API succeeded.
Adds a napi_finalize callback which will be called when the JavaScript object in js_object has been garbage-collected.
This API can be called multiple times on a single JavaScript object.
Caution: The optional returned reference (if obtained) should be deleted via napi_delete_reference ONLY in response to the finalize callback invocation. If it is deleted before then, then the finalize callback may never be invoked. Therefore, when obtaining a reference a finalize callback is also required in order to enable correct disposal of the reference.
node_api_post_finalizer
#
Added in: v21.0.0, v20.10.0, v18.19.0
Stability: 1 - Experimental
napi_status node_api_post_finalizer(node_api_basic_env env,
                                    napi_finalize finalize_cb,
                                    void* finalize_data,
                                    void* finalize_hint);
copy
[in] env: The environment that the API is invoked under.
[in] finalize_cb: Native callback that will be used to free the native data when the JavaScript object has been garbage-collected. napi_finalize provides more details.
[in] finalize_data: Optional data to be passed to finalize_cb.
[in] finalize_hint: Optional contextual hint that is passed to the finalize callback.
Returns napi_ok if the API succeeded.
Schedules a napi_finalize callback to be called asynchronously in the event loop.
Normally, finalizers are called while the GC (garbage collector) collects objects. At that point calling any Node-API that may cause changes in the GC state will be disabled and will crash Node.js.
node_api_post_finalizer helps to work around this limitation by allowing the add-on to defer calls to such Node-APIs to a point in time outside of the GC finalization.
Simple asynchronous operations
#
Addon modules often need to leverage async helpers from libuv as part of their implementation. This allows them to schedule work to be executed asynchronously so that their methods can return in advance of the work being completed. This allows them to avoid blocking overall execution of the Node.js application.
Node-API provides an ABI-stable interface for these supporting functions which covers the most common asynchronous use cases.
Node-API defines the napi_async_work structure which is used to manage asynchronous workers. Instances are created/deleted with napi_create_async_work and napi_delete_async_work.
The execute and complete callbacks are functions that will be invoked when the executor is ready to execute and when it completes its task respectively.
The execute function should avoid making any Node-API calls that could result in the execution of JavaScript or interaction with JavaScript objects. Most often, any code that needs to make Node-API calls should be made in complete callback instead. Avoid using the napi_env parameter in the execute callback as it will likely execute JavaScript.
These functions implement the following interfaces:
typedef void (*napi_async_execute_callback)(napi_env env,
                                            void* data);
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
copy
When these methods are invoked, the data parameter passed will be the addon-provided void* data that was passed into the napi_create_async_work call.
Once created the async worker can be queued for execution using the napi_queue_async_work function:
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
copy
napi_cancel_async_work can be used if the work needs to be cancelled before the work has started execution.
After calling napi_cancel_async_work, the complete callback will be invoked with a status value of napi_cancelled. The work should not be deleted before the complete callback invocation, even when it was cancelled.
napi_create_async_work
#
History













N-API version: 1
napi_status napi_create_async_work(napi_env env,
                                   napi_value async_resource,
                                   napi_value async_resource_name,
                                   napi_async_execute_callback execute,
                                   napi_async_complete_callback complete,
                                   void* data,
                                   napi_async_work* result);
copy
[in] env: The environment that the API is invoked under.
[in] async_resource: An optional object associated with the async work that will be passed to possible async_hooks init hooks.
[in] async_resource_name: Identifier for the kind of resource that is being provided for diagnostic information exposed by the async_hooks API.
[in] execute: The native function which should be called to execute the logic asynchronously. The given function is called from a worker pool thread and can execute in parallel with the main event loop thread.
[in] complete: The native function which will be called when the asynchronous logic is completed or is cancelled. The given function is called from the main event loop thread. napi_async_complete_callback provides more details.
[in] data: User-provided data context. This will be passed back into the execute and complete functions.
[out] result: napi_async_work* which is the handle to the newly created async work.
Returns napi_ok if the API succeeded.
This API allocates a work object that is used to execute logic asynchronously. It should be freed using napi_delete_async_work once the work is no longer required.
async_resource_name should be a null-terminated, UTF-8-encoded string.
The async_resource_name identifier is provided by the user and should be representative of the type of async work being performed. It is also recommended to apply namespacing to the identifier, e.g. by including the module name. See the async_hooks documentation for more information.
napi_delete_async_work
#
Added in: v8.0.0 N-API version: 1
napi_status napi_delete_async_work(napi_env env,
                                   napi_async_work work);
copy
[in] env: The environment that the API is invoked under.
[in] work: The handle returned by the call to napi_create_async_work.
Returns napi_ok if the API succeeded.
This API frees a previously allocated work object.
This API can be called even if there is a pending JavaScript exception.
napi_queue_async_work
#
Added in: v8.0.0 N-API version: 1
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
copy
[in] env: The environment that the API is invoked under.
[in] work: The handle returned by the call to napi_create_async_work.
Returns napi_ok if the API succeeded.
This API requests that the previously allocated work be scheduled for execution. Once it returns successfully, this API must not be called again with the same napi_async_work item or the result will be undefined.
napi_cancel_async_work
#
Added in: v8.0.0 N-API version: 1
napi_status napi_cancel_async_work(node_api_basic_env env,
                                   napi_async_work work);
copy
[in] env: The environment that the API is invoked under.
[in] work: The handle returned by the call to napi_create_async_work.
Returns napi_ok if the API succeeded.
This API cancels queued work if it has not yet been started. If it has already started executing, it cannot be cancelled and napi_generic_failure will be returned. If successful, the complete callback will be invoked with a status value of napi_cancelled. The work should not be deleted before the complete callback invocation, even if it has been successfully cancelled.
This API can be called even if there is a pending JavaScript exception.
Custom asynchronous operations
#
The simple asynchronous work APIs above may not be appropriate for every scenario. When using any other asynchronous mechanism, the following APIs are necessary to ensure an asynchronous operation is properly tracked by the runtime.
napi_async_init
#
Added in: v8.6.0 N-API version: 1
napi_status napi_async_init(napi_env env,
                            napi_value async_resource,
                            napi_value async_resource_name,
                            napi_async_context* result)
copy
[in] env: The environment that the API is invoked under.
[in] async_resource: Object associated with the async work that will be passed to possible async_hooks init hooks and can be accessed by async_hooks.executionAsyncResource().
[in] async_resource_name: Identifier for the kind of resource that is being provided for diagnostic information exposed by the async_hooks API.
[out] result: The initialized async context.
Returns napi_ok if the API succeeded.
The async_resource object needs to be kept alive until napi_async_destroy to keep async_hooks related API acts correctly. In order to retain ABI compatibility with previous versions, napi_async_contexts are not maintaining the strong reference to the async_resource objects to avoid introducing causing memory leaks. However, if the async_resource is garbage collected by JavaScript engine before the napi_async_context was destroyed by napi_async_destroy, calling napi_async_context related APIs like napi_open_callback_scope and napi_make_callback can cause problems like loss of async context when using the AsyncLocalStorage API.
In order to retain ABI compatibility with previous versions, passing NULL for async_resource does not result in an error. However, this is not recommended as this will result in undesirable behavior with async_hooks init hooks and async_hooks.executionAsyncResource() as the resource is now required by the underlying async_hooks implementation in order to provide the linkage between async callbacks.
napi_async_destroy
#
Added in: v8.6.0 N-API version: 1
napi_status napi_async_destroy(napi_env env,
                               napi_async_context async_context);
copy
[in] env: The environment that the API is invoked under.
[in] async_context: The async context to be destroyed.
Returns napi_ok if the API succeeded.
This API can be called even if there is a pending JavaScript exception.
napi_make_callback
#
History













N-API version: 1
NAPI_EXTERN napi_status napi_make_callback(napi_env env,
                                           napi_async_context async_context,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] async_context: Context for the async operation that is invoking the callback. This should normally be a value previously obtained from napi_async_init. In order to retain ABI compatibility with previous versions, passing NULL for async_context does not result in an error. However, this results in incorrect operation of async hooks. Potential issues include loss of async context when using the AsyncLocalStorage API.
[in] recv: The this value passed to the called function.
[in] func: napi_value representing the JavaScript function to be invoked.
[in] argc: The count of elements in the argv array.
[in] argv: Array of JavaScript values as napi_value representing the arguments to the function. If argc is zero this parameter may be omitted by passing in NULL.
[out] result: napi_value representing the JavaScript object returned.
Returns napi_ok if the API succeeded.
This method allows a JavaScript function object to be called from a native add-on. This API is similar to napi_call_function. However, it is used to call from native code back into JavaScript after returning from an async operation (when there is no other script on the stack). It is a fairly simple wrapper around node::MakeCallback.
Note it is not necessary to use napi_make_callback from within a napi_async_complete_callback; in that situation the callback's async context has already been set up, so a direct call to napi_call_function is sufficient and appropriate. Use of the napi_make_callback function may be required when implementing custom async behavior that does not use napi_create_async_work.
Any process.nextTicks or Promises scheduled on the microtask queue by JavaScript during the callback are ran before returning back to C/C++.
napi_open_callback_scope
#
Added in: v9.6.0 N-API version: 3
NAPI_EXTERN napi_status napi_open_callback_scope(napi_env env,
                                                 napi_value resource_object,
                                                 napi_async_context context,
                                                 napi_callback_scope* result)
copy
[in] env: The environment that the API is invoked under.
[in] resource_object: An object associated with the async work that will be passed to possible async_hooks init hooks. This parameter has been deprecated and is ignored at runtime. Use the async_resource parameter in napi_async_init instead.
[in] context: Context for the async operation that is invoking the callback. This should be a value previously obtained from napi_async_init.
[out] result: The newly created scope.
There are cases (for example, resolving promises) where it is necessary to have the equivalent of the scope associated with a callback in place when making certain Node-API calls. If there is no other script on the stack the napi_open_callback_scope and napi_close_callback_scope functions can be used to open/close the required scope.
napi_close_callback_scope
#
Added in: v9.6.0 N-API version: 3
NAPI_EXTERN napi_status napi_close_callback_scope(napi_env env,
                                                  napi_callback_scope scope)
copy
[in] env: The environment that the API is invoked under.
[in] scope: The scope to be closed.
This API can be called even if there is a pending JavaScript exception.
Version management
#
napi_get_node_version
#
Added in: v8.4.0 N-API version: 1
typedef struct {
  uint32_t major;
  uint32_t minor;
  uint32_t patch;
  const char* release;
} napi_node_version;


napi_status napi_get_node_version(node_api_basic_env env,
                                  const napi_node_version** version);
copy
[in] env: The environment that the API is invoked under.
[out] version: A pointer to version information for Node.js itself.
Returns napi_ok if the API succeeded.
This function fills the version struct with the major, minor, and patch version of Node.js that is currently running, and the release field with the value of process.release.name.
The returned buffer is statically allocated and does not need to be freed.
napi_get_version
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_version(node_api_basic_env env,
                             uint32_t* result);
copy
[in] env: The environment that the API is invoked under.
[out] result: The highest version of Node-API supported.
Returns napi_ok if the API succeeded.
This API returns the highest Node-API version supported by the Node.js runtime. Node-API is planned to be additive such that newer releases of Node.js may support additional API functions. In order to allow an addon to use a newer function when running with versions of Node.js that support it, while providing fallback behavior when running with Node.js versions that don't support it:
Call napi_get_version() to determine if the API is available.
If available, dynamically load a pointer to the function using uv_dlsym().
Use the dynamically loaded pointer to invoke the function.
If the function is not available, provide an alternate implementation that does not use the function.
Memory management
#
napi_adjust_external_memory
#
Added in: v8.5.0 N-API version: 1
NAPI_EXTERN napi_status napi_adjust_external_memory(node_api_basic_env env,
                                                    int64_t change_in_bytes,
                                                    int64_t* result);
copy
[in] env: The environment that the API is invoked under.
[in] change_in_bytes: The change in externally allocated memory that is kept alive by JavaScript objects.
[out] result: The adjusted value. This value should reflect the total amount of external memory with the given change_in_bytes included. The absolute value of the returned value should not be depended on. For example, implementations may use a single counter for all addons, or a counter for each addon.
Returns napi_ok if the API succeeded.
This function gives the runtime an indication of the amount of externally allocated memory that is kept alive by JavaScript objects (i.e. a JavaScript object that points to its own memory allocated by a native addon). Registering externally allocated memory may, but is not guaranteed to, trigger global garbage collections more often than it would otherwise.
This function is expected to be called in a manner such that an addon does not decrease the external memory more than it has increased the external memory.
Promises
#
Node-API provides facilities for creating Promise objects as described in Section 25.4 of the ECMA specification. It implements promises as a pair of objects. When a promise is created by napi_create_promise(), a "deferred" object is created and returned alongside the Promise. The deferred object is bound to the created Promise and is the only means to resolve or reject the Promise using napi_resolve_deferred() or napi_reject_deferred(). The deferred object that is created by napi_create_promise() is freed by napi_resolve_deferred() or napi_reject_deferred(). The Promise object may be returned to JavaScript where it can be used in the usual fashion.
For example, to create a promise and pass it to an asynchronous worker:
napi_deferred deferred;
napi_value promise;
napi_status status;


// Create the promise.
status = napi_create_promise(env, &deferred, &promise);
if (status != napi_ok) return NULL;


// Pass the deferred to a function that performs an asynchronous action.
do_something_asynchronous(deferred);


// Return the promise to JS
return promise;
copy
The above function do_something_asynchronous() would perform its asynchronous action and then it would resolve or reject the deferred, thereby concluding the promise and freeing the deferred:
napi_deferred deferred;
napi_value undefined;
napi_status status;


// Create a value with which to conclude the deferred.
status = napi_get_undefined(env, &undefined);
if (status != napi_ok) return NULL;


// Resolve or reject the promise associated with the deferred depending on
// whether the asynchronous action succeeded.
if (asynchronous_action_succeeded) {
  status = napi_resolve_deferred(env, deferred, undefined);
} else {
  status = napi_reject_deferred(env, deferred, undefined);
}
if (status != napi_ok) return NULL;


// At this point the deferred has been freed, so we should assign NULL to it.
deferred = NULL;
copy
napi_create_promise
#
Added in: v8.5.0 N-API version: 1
napi_status napi_create_promise(napi_env env,
                                napi_deferred* deferred,
                                napi_value* promise);
copy
[in] env: The environment that the API is invoked under.
[out] deferred: A newly created deferred object which can later be passed to napi_resolve_deferred() or napi_reject_deferred() to resolve resp. reject the associated promise.
[out] promise: The JavaScript promise associated with the deferred object.
Returns napi_ok if the API succeeded.
This API creates a deferred object and a JavaScript promise.
napi_resolve_deferred
#
Added in: v8.5.0 N-API version: 1
napi_status napi_resolve_deferred(napi_env env,
                                  napi_deferred deferred,
                                  napi_value resolution);
copy
[in] env: The environment that the API is invoked under.
[in] deferred: The deferred object whose associated promise to resolve.
[in] resolution: The value with which to resolve the promise.
This API resolves a JavaScript promise by way of the deferred object with which it is associated. Thus, it can only be used to resolve JavaScript promises for which the corresponding deferred object is available. This effectively means that the promise must have been created using napi_create_promise() and the deferred object returned from that call must have been retained in order to be passed to this API.
The deferred object is freed upon successful completion.
napi_reject_deferred
#
Added in: v8.5.0 N-API version: 1
napi_status napi_reject_deferred(napi_env env,
                                 napi_deferred deferred,
                                 napi_value rejection);
copy
[in] env: The environment that the API is invoked under.
[in] deferred: The deferred object whose associated promise to resolve.
[in] rejection: The value with which to reject the promise.
This API rejects a JavaScript promise by way of the deferred object with which it is associated. Thus, it can only be used to reject JavaScript promises for which the corresponding deferred object is available. This effectively means that the promise must have been created using napi_create_promise() and the deferred object returned from that call must have been retained in order to be passed to this API.
The deferred object is freed upon successful completion.
napi_is_promise
#
Added in: v8.5.0 N-API version: 1
napi_status napi_is_promise(napi_env env,
                            napi_value value,
                            bool* is_promise);
copy
[in] env: The environment that the API is invoked under.
[in] value: The value to examine
[out] is_promise: Flag indicating whether promise is a native promise object (that is, a promise object created by the underlying engine).
Script execution
#
Node-API provides an API for executing a string containing JavaScript using the underlying JavaScript engine.
napi_run_script
#
Added in: v8.5.0 N-API version: 1
NAPI_EXTERN napi_status napi_run_script(napi_env env,
                                        napi_value script,
                                        napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] script: A JavaScript string containing the script to execute.
[out] result: The value resulting from having executed the script.
This function executes a string of JavaScript code and returns its result with the following caveats:
Unlike eval, this function does not allow the script to access the current lexical scope, and therefore also does not allow to access the module scope, meaning that pseudo-globals such as require will not be available.
The script can access the global scope. Function and var declarations in the script will be added to the global object. Variable declarations made using let and const will be visible globally, but will not be added to the global object.
The value of this is global within the script.
libuv event loop
#
Node-API provides a function for getting the current event loop associated with a specific napi_env.
napi_get_uv_event_loop
#
Added in: v9.3.0, v8.10.0 N-API version: 2
NAPI_EXTERN napi_status napi_get_uv_event_loop(node_api_basic_env env,
                                               struct uv_loop_s** loop);
copy
[in] env: The environment that the API is invoked under.
[out] loop: The current libuv loop instance.
Note: While libuv has been relatively stable over time, it does not provide an ABI stability guarantee. Use of this function should be avoided. Its use may result in an addon that does not work across Node.js versions. asynchronous-thread-safe-function-calls are an alternative for many use cases.
Asynchronous thread-safe function calls
#
JavaScript functions can normally only be called from a native addon's main thread. If an addon creates additional threads, then Node-API functions that require a napi_env, napi_value, or napi_ref must not be called from those threads.
When an addon has additional threads and JavaScript functions need to be invoked based on the processing completed by those threads, those threads must communicate with the addon's main thread so that the main thread can invoke the JavaScript function on their behalf. The thread-safe function APIs provide an easy way to do this.
These APIs provide the type napi_threadsafe_function as well as APIs to create, destroy, and call objects of this type. napi_create_threadsafe_function() creates a persistent reference to a napi_value that holds a JavaScript function which can be called from multiple threads. The calls happen asynchronously. This means that values with which the JavaScript callback is to be called will be placed in a queue, and, for each value in the queue, a call will eventually be made to the JavaScript function.
Upon creation of a napi_threadsafe_function a napi_finalize callback can be provided. This callback will be invoked on the main thread when the thread-safe function is about to be destroyed. It receives the context and the finalize data given during construction, and provides an opportunity for cleaning up after the threads e.g. by calling uv_thread_join(). Aside from the main loop thread, no threads should be using the thread-safe function after the finalize callback completes.
The context given during the call to napi_create_threadsafe_function() can be retrieved from any thread with a call to napi_get_threadsafe_function_context().
Calling a thread-safe function
#
napi_call_threadsafe_function() can be used for initiating a call into JavaScript. napi_call_threadsafe_function() accepts a parameter which controls whether the API behaves blockingly. If set to napi_tsfn_nonblocking, the API behaves non-blockingly, returning napi_queue_full if the queue was full, preventing data from being successfully added to the queue. If set to napi_tsfn_blocking, the API blocks until space becomes available in the queue. napi_call_threadsafe_function() never blocks if the thread-safe function was created with a maximum queue size of 0.
napi_call_threadsafe_function() should not be called with napi_tsfn_blocking from a JavaScript thread, because, if the queue is full, it may cause the JavaScript thread to deadlock.
The actual call into JavaScript is controlled by the callback given via the call_js_cb parameter. call_js_cb is invoked on the main thread once for each value that was placed into the queue by a successful call to napi_call_threadsafe_function(). If such a callback is not given, a default callback will be used, and the resulting JavaScript call will have no arguments. The call_js_cb callback receives the JavaScript function to call as a napi_value in its parameters, as well as the void* context pointer used when creating the napi_threadsafe_function, and the next data pointer that was created by one of the secondary threads. The callback can then use an API such as napi_call_function() to call into JavaScript.
The callback may also be invoked with env and call_js_cb both set to NULL to indicate that calls into JavaScript are no longer possible, while items remain in the queue that may need to be freed. This normally occurs when the Node.js process exits while there is a thread-safe function still active.
It is not necessary to call into JavaScript via napi_make_callback() because Node-API runs call_js_cb in a context appropriate for callbacks.
Zero or more queued items may be invoked in each tick of the event loop. Applications should not depend on a specific behavior other than progress in invoking callbacks will be made and events will be invoked as time moves forward.
Reference counting of thread-safe functions
#
Threads can be added to and removed from a napi_threadsafe_function object during its existence. Thus, in addition to specifying an initial number of threads upon creation, napi_acquire_threadsafe_function can be called to indicate that a new thread will start making use of the thread-safe function. Similarly, napi_release_threadsafe_function can be called to indicate that an existing thread will stop making use of the thread-safe function.
napi_threadsafe_function objects are destroyed when every thread which uses the object has called napi_release_threadsafe_function() or has received a return status of napi_closing in response to a call to napi_call_threadsafe_function. The queue is emptied before the napi_threadsafe_function is destroyed. napi_release_threadsafe_function() should be the last API call made in conjunction with a given napi_threadsafe_function, because after the call completes, there is no guarantee that the napi_threadsafe_function is still allocated. For the same reason, do not use a thread-safe function after receiving a return value of napi_closing in response to a call to napi_call_threadsafe_function. Data associated with the napi_threadsafe_function can be freed in its napi_finalize callback which was passed to napi_create_threadsafe_function(). The parameter initial_thread_count of napi_create_threadsafe_function marks the initial number of acquisitions of the thread-safe functions, instead of calling napi_acquire_threadsafe_function multiple times at creation.
Once the number of threads making use of a napi_threadsafe_function reaches zero, no further threads can start making use of it by calling napi_acquire_threadsafe_function(). In fact, all subsequent API calls associated with it, except napi_release_threadsafe_function(), will return an error value of napi_closing.
The thread-safe function can be "aborted" by giving a value of napi_tsfn_abort to napi_release_threadsafe_function(). This will cause all subsequent APIs associated with the thread-safe function except napi_release_threadsafe_function() to return napi_closing even before its reference count reaches zero. In particular, napi_call_threadsafe_function() will return napi_closing, thus informing the threads that it is no longer possible to make asynchronous calls to the thread-safe function. This can be used as a criterion for terminating the thread. Upon receiving a return value of napi_closing from napi_call_threadsafe_function() a thread must not use the thread-safe function anymore because it is no longer guaranteed to be allocated.
Deciding whether to keep the process running
#
Similarly to libuv handles, thread-safe functions can be "referenced" and "unreferenced". A "referenced" thread-safe function will cause the event loop on the thread on which it is created to remain alive until the thread-safe function is destroyed. In contrast, an "unreferenced" thread-safe function will not prevent the event loop from exiting. The APIs napi_ref_threadsafe_function and napi_unref_threadsafe_function exist for this purpose.
Neither does napi_unref_threadsafe_function mark the thread-safe functions as able to be destroyed nor does napi_ref_threadsafe_function prevent it from being destroyed.
napi_create_threadsafe_function
#
History













N-API version: 4
NAPI_EXTERN napi_status
napi_create_threadsafe_function(napi_env env,
                                napi_value func,
                                napi_value async_resource,
                                napi_value async_resource_name,
                                size_t max_queue_size,
                                size_t initial_thread_count,
                                void* thread_finalize_data,
                                napi_finalize thread_finalize_cb,
                                void* context,
                                napi_threadsafe_function_call_js call_js_cb,
                                napi_threadsafe_function* result);
copy
[in] env: The environment that the API is invoked under.
[in] func: An optional JavaScript function to call from another thread. It must be provided if NULL is passed to call_js_cb.
[in] async_resource: An optional object associated with the async work that will be passed to possible async_hooks init hooks.
[in] async_resource_name: A JavaScript string to provide an identifier for the kind of resource that is being provided for diagnostic information exposed by the async_hooks API.
[in] max_queue_size: Maximum size of the queue. 0 for no limit.
[in] initial_thread_count: The initial number of acquisitions, i.e. the initial number of threads, including the main thread, which will be making use of this function.
[in] thread_finalize_data: Optional data to be passed to thread_finalize_cb.
[in] thread_finalize_cb: Optional function to call when the napi_threadsafe_function is being destroyed.
[in] context: Optional data to attach to the resulting napi_threadsafe_function.
[in] call_js_cb: Optional callback which calls the JavaScript function in response to a call on a different thread. This callback will be called on the main thread. If not given, the JavaScript function will be called with no parameters and with undefined as its this value. napi_threadsafe_function_call_js provides more details.
[out] result: The asynchronous thread-safe JavaScript function.
Change History:
Version 10 (NAPI_VERSION is defined as 10 or higher):
Uncaught exceptions thrown in call_js_cb are handled with the 'uncaughtException' event, instead of being ignored.
napi_get_threadsafe_function_context
#
Added in: v10.6.0 N-API version: 4
NAPI_EXTERN napi_status
napi_get_threadsafe_function_context(napi_threadsafe_function func,
                                     void** result);
copy
[in] func: The thread-safe function for which to retrieve the context.
[out] result: The location where to store the context.
This API may be called from any thread which makes use of func.
napi_call_threadsafe_function
#
History

















N-API version: 4
NAPI_EXTERN napi_status
napi_call_threadsafe_function(napi_threadsafe_function func,
                              void* data,
                              napi_threadsafe_function_call_mode is_blocking);
copy
[in] func: The asynchronous thread-safe JavaScript function to invoke.
[in] data: Data to send into JavaScript via the callback call_js_cb provided during the creation of the thread-safe JavaScript function.
[in] is_blocking: Flag whose value can be either napi_tsfn_blocking to indicate that the call should block if the queue is full or napi_tsfn_nonblocking to indicate that the call should return immediately with a status of napi_queue_full whenever the queue is full.
This API should not be called with napi_tsfn_blocking from a JavaScript thread, because, if the queue is full, it may cause the JavaScript thread to deadlock.
This API will return napi_closing if napi_release_threadsafe_function() was called with abort set to napi_tsfn_abort from any thread. The value is only added to the queue if the API returns napi_ok.
This API may be called from any thread which makes use of func.
napi_acquire_threadsafe_function
#
Added in: v10.6.0 N-API version: 4
NAPI_EXTERN napi_status
napi_acquire_threadsafe_function(napi_threadsafe_function func);
copy
[in] func: The asynchronous thread-safe JavaScript function to start making use of.
A thread should call this API before passing func to any other thread-safe function APIs to indicate that it will be making use of func. This prevents func from being destroyed when all other threads have stopped making use of it.
This API may be called from any thread which will start making use of func.
napi_release_threadsafe_function
#
Added in: v10.6.0 N-API version: 4
NAPI_EXTERN napi_status
napi_release_threadsafe_function(napi_threadsafe_function func,
                                 napi_threadsafe_function_release_mode mode);
copy
[in] func: The asynchronous thread-safe JavaScript function whose reference count to decrement.
[in] mode: Flag whose value can be either napi_tsfn_release to indicate that the current thread will make no further calls to the thread-safe function, or napi_tsfn_abort to indicate that in addition to the current thread, no other thread should make any further calls to the thread-safe function. If set to napi_tsfn_abort, further calls to napi_call_threadsafe_function() will return napi_closing, and no further values will be placed in the queue.
A thread should call this API when it stops making use of func. Passing func to any thread-safe APIs after having called this API has undefined results, as func may have been destroyed.
This API may be called from any thread which will stop making use of func.
napi_ref_threadsafe_function
#
Added in: v10.6.0 N-API version: 4
NAPI_EXTERN napi_status
napi_ref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
copy
[in] env: The environment that the API is invoked under.
[in] func: The thread-safe function to reference.
This API is used to indicate that the event loop running on the main thread should not exit until func has been destroyed. Similar to uv_ref it is also idempotent.
Neither does napi_unref_threadsafe_function mark the thread-safe functions as able to be destroyed nor does napi_ref_threadsafe_function prevent it from being destroyed. napi_acquire_threadsafe_function and napi_release_threadsafe_function are available for that purpose.
This API may only be called from the main thread.
napi_unref_threadsafe_function
#
Added in: v10.6.0 N-API version: 4
NAPI_EXTERN napi_status
napi_unref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
copy
[in] env: The environment that the API is invoked under.
[in] func: The thread-safe function to unreference.
This API is used to indicate that the event loop running on the main thread may exit before func is destroyed. Similar to uv_unref it is also idempotent.
This API may only be called from the main thread.
Miscellaneous utilities
#
node_api_get_module_file_name
#
Added in: v15.9.0, v14.18.0, v12.22.0 N-API version: 9
NAPI_EXTERN napi_status
node_api_get_module_file_name(node_api_basic_env env, const char** result);

copy
[in] env: The environment that the API is invoked under.
[out] result: A URL containing the absolute path of the location from which the add-on was loaded. For a file on the local file system it will start with file://. The string is null-terminated and owned by env and must thus not be modified or freed.
result may be an empty string if the add-on loading process fails to establish the add-on's file name during loading.
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
Node-API
Implications of ABI stability
Building
Build tools
node-gyp
CMake.js
Uploading precompiled binaries
node-pre-gyp
prebuild
prebuildify
Usage
Node-API version matrix
Environment life cycle APIs
napi_set_instance_data
napi_get_instance_data
Basic Node-API data types
napi_status
napi_extended_error_info
napi_env
node_api_basic_env
napi_value
napi_threadsafe_function
napi_threadsafe_function_release_mode
napi_threadsafe_function_call_mode
Node-API memory management types
napi_handle_scope
napi_escapable_handle_scope
napi_ref
napi_type_tag
napi_async_cleanup_hook_handle
Node-API callback types
napi_callback_info
napi_callback
node_api_basic_finalize
napi_finalize
napi_async_execute_callback
napi_async_complete_callback
napi_threadsafe_function_call_js
napi_cleanup_hook
napi_async_cleanup_hook
Error handling
Return values
napi_get_last_error_info
Exceptions
napi_throw
napi_throw_error
napi_throw_type_error
napi_throw_range_error
node_api_throw_syntax_error
napi_is_error
napi_create_error
napi_create_type_error
napi_create_range_error
node_api_create_syntax_error
napi_get_and_clear_last_exception
napi_is_exception_pending
napi_fatal_exception
Fatal errors
napi_fatal_error
Object lifetime management
Making handle lifespan shorter than that of the native method
napi_open_handle_scope
napi_close_handle_scope
napi_open_escapable_handle_scope
napi_close_escapable_handle_scope
napi_escape_handle
References to values with a lifespan longer than that of the native method
napi_create_reference
napi_delete_reference
napi_reference_ref
napi_reference_unref
napi_get_reference_value
Cleanup on exit of the current Node.js environment
napi_add_env_cleanup_hook
napi_remove_env_cleanup_hook
napi_add_async_cleanup_hook
napi_remove_async_cleanup_hook
Finalization on the exit of the Node.js environment
Module registration
Working with JavaScript values
Enum types
napi_key_collection_mode
napi_key_filter
napi_key_conversion
napi_valuetype
napi_typedarray_type
Object creation functions
napi_create_array
napi_create_array_with_length
napi_create_arraybuffer
napi_create_buffer
napi_create_buffer_copy
napi_create_date
napi_create_external
napi_create_external_arraybuffer
napi_create_external_buffer
napi_create_object
napi_create_symbol
node_api_symbol_for
napi_create_typedarray
node_api_create_buffer_from_arraybuffer
napi_create_dataview
Functions to convert from C types to Node-API
napi_create_int32
napi_create_uint32
napi_create_int64
napi_create_double
napi_create_bigint_int64
napi_create_bigint_uint64
napi_create_bigint_words
napi_create_string_latin1
node_api_create_external_string_latin1
napi_create_string_utf16
node_api_create_external_string_utf16
napi_create_string_utf8
Functions to create optimized property keys
node_api_create_property_key_latin1
node_api_create_property_key_utf16
node_api_create_property_key_utf8
Functions to convert from Node-API to C types
napi_get_array_length
napi_get_arraybuffer_info
napi_get_buffer_info
napi_get_prototype
napi_get_typedarray_info
napi_get_dataview_info
napi_get_date_value
napi_get_value_bool
napi_get_value_double
napi_get_value_bigint_int64
napi_get_value_bigint_uint64
napi_get_value_bigint_words
napi_get_value_external
napi_get_value_int32
napi_get_value_int64
napi_get_value_string_latin1
napi_get_value_string_utf8
napi_get_value_string_utf16
napi_get_value_uint32
Functions to get global instances
napi_get_boolean
napi_get_global
napi_get_null
napi_get_undefined
Working with JavaScript values and abstract operations
napi_coerce_to_bool
napi_coerce_to_number
napi_coerce_to_object
napi_coerce_to_string
napi_typeof
napi_instanceof
napi_is_array
napi_is_arraybuffer
napi_is_buffer
napi_is_date
napi_is_error
napi_is_typedarray
napi_is_dataview
napi_strict_equals
napi_detach_arraybuffer
napi_is_detached_arraybuffer
Working with JavaScript properties
Structures
napi_property_attributes
napi_property_descriptor
Functions
napi_get_property_names
napi_get_all_property_names
napi_set_property
napi_get_property
napi_has_property
napi_delete_property
napi_has_own_property
napi_set_named_property
napi_get_named_property
napi_has_named_property
napi_set_element
napi_get_element
napi_has_element
napi_delete_element
napi_define_properties
napi_object_freeze
napi_object_seal
Working with JavaScript functions
napi_call_function
napi_create_function
napi_get_cb_info
napi_get_new_target
napi_new_instance
Object wrap
napi_define_class
napi_wrap
napi_unwrap
napi_remove_wrap
napi_type_tag_object
napi_check_object_type_tag
napi_add_finalizer
node_api_post_finalizer
Simple asynchronous operations
napi_create_async_work
napi_delete_async_work
napi_queue_async_work
napi_cancel_async_work
Custom asynchronous operations
napi_async_init
napi_async_destroy
napi_make_callback
napi_open_callback_scope
napi_close_callback_scope
Version management
napi_get_node_version
napi_get_version
Memory management
napi_adjust_external_memory
Promises
napi_create_promise
napi_resolve_deferred
napi_reject_deferred
napi_is_promise
Script execution
napi_run_script
libuv event loop
napi_get_uv_event_loop
Asynchronous thread-safe function calls
Calling a thread-safe function
Reference counting of thread-safe functions
Deciding whether to keep the process running
napi_create_threadsafe_function
napi_get_threadsafe_function_context
napi_call_threadsafe_function
napi_acquire_threadsafe_function
napi_release_threadsafe_function
napi_ref_threadsafe_function
napi_unref_threadsafe_function
Miscellaneous utilities
node_api_get_module_file_name
Node-API
#
Stability: 2 - Stable
Node-API (formerly N-API) is an API for building native Addons. It is independent from the underlying JavaScript runtime (for example, V8) and is maintained as part of Node.js itself. This API will be Application Binary Interface (ABI) stable across versions of Node.js. It is intended to insulate addons from changes in the underlying JavaScript engine and allow modules compiled for one major version to run on later major versions of Node.js without recompilation. The ABI Stability guide provides a more in-depth explanation.
Addons are built/packaged with the same approach/tools outlined in the section titled C++ Addons. The only difference is the set of APIs that are used by the native code. Instead of using the V8 or Native Abstractions for Node.js APIs, the functions available in Node-API are used.
APIs exposed by Node-API are generally used to create and manipulate JavaScript values. Concepts and operations generally map to ideas specified in the ECMA-262 Language Specification. The APIs have the following properties:
All Node-API calls return a status code of type napi_status. This status indicates whether the API call succeeded or failed.
The API's return value is passed via an out parameter.
All JavaScript values are abstracted behind an opaque type named napi_value.
In case of an error status code, additional information can be obtained using napi_get_last_error_info. More information can be found in the error handling section Error handling.
Node-API is a C API that ensures ABI stability across Node.js versions and different compiler levels. A C++ API can be easier to use. To support using C++, the project maintains a C++ wrapper module called node-addon-api. This wrapper provides an inlinable C++ API. Binaries built with node-addon-api will depend on the symbols for the Node-API C-based functions exported by Node.js. node-addon-api is a more efficient way to write code that calls Node-API. Take, for example, the following node-addon-api code. The first section shows the node-addon-api code and the second section shows what actually gets used in the addon.
Object obj = Object::New(env);
obj["foo"] = String::New(env, "bar");
copy
napi_status status;
napi_value object, string;
status = napi_create_object(env, &object);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}

status = napi_create_string_utf8(env, "bar", NAPI_AUTO_LENGTH, &string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}

status = napi_set_named_property(env, object, "foo", string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}
copy
The end result is that the addon only uses the exported C APIs. As a result, it still gets the benefits of the ABI stability provided by the C API.
When using node-addon-api instead of the C APIs, start with the API docs for node-addon-api.
The Node-API Resource offers an excellent orientation and tips for developers just getting started with Node-API and node-addon-api. Additional media resources can be found on the Node-API Media page.
Implications of ABI stability
#
Although Node-API provides an ABI stability guarantee, other parts of Node.js do not, and any external libraries used from the addon may not. In particular, none of the following APIs provide an ABI stability guarantee across major versions:
the Node.js C++ APIs available via any of
#include <node.h>
#include <node_buffer.h>
#include <node_version.h>
#include <node_object_wrap.h>
copy
the libuv APIs which are also included with Node.js and available via
#include <uv.h>
copy
the V8 API available via
#include <v8.h>
copy
Thus, for an addon to remain ABI-compatible across Node.js major versions, it must use Node-API exclusively by restricting itself to using
#include <node_api.h>
copy
and by checking, for all external libraries that it uses, that the external library makes ABI stability guarantees similar to Node-API.
Building
#
Unlike modules written in JavaScript, developing and deploying Node.js native addons using Node-API requires an additional set of tools. Besides the basic tools required to develop for Node.js, the native addon developer requires a toolchain that can compile C and C++ code into a binary. In addition, depending upon how the native addon is deployed, the user of the native addon will also need to have a C/C++ toolchain installed.
For Linux developers, the necessary C/C++ toolchain packages are readily available. GCC is widely used in the Node.js community to build and test across a variety of platforms. For many developers, the LLVM compiler infrastructure is also a good choice.
For Mac developers, Xcode offers all the required compiler tools. However, it is not necessary to install the entire Xcode IDE. The following command installs the necessary toolchain:
xcode-select --install
copy
For Windows developers, Visual Studio offers all the required compiler tools. However, it is not necessary to install the entire Visual Studio IDE. The following command installs the necessary toolchain:
npm install --global windows-build-tools
copy
The sections below describe the additional tools available for developing and deploying Node.js native addons.
Build tools
#
Both the tools listed here require that users of the native addon have a C/C++ toolchain installed in order to successfully install the native addon.
node-gyp
#
node-gyp is a build system based on the gyp-next fork of Google's GYP tool and comes bundled with npm. GYP, and therefore node-gyp, requires that Python be installed.
Historically, node-gyp has been the tool of choice for building native addons. It has widespread adoption and documentation. However, some developers have run into limitations in node-gyp.
CMake.js
#
CMake.js is an alternative build system based on CMake.
CMake.js is a good choice for projects that already use CMake or for developers affected by limitations in node-gyp. build_with_cmake is an example of a CMake-based native addon project.
Uploading precompiled binaries
#
The three tools listed here permit native addon developers and maintainers to create and upload binaries to public or private servers. These tools are typically integrated with CI/CD build systems like Travis CI and AppVeyor to build and upload binaries for a variety of platforms and architectures. These binaries are then available for download by users who do not need to have a C/C++ toolchain installed.
node-pre-gyp
#
node-pre-gyp is a tool based on node-gyp that adds the ability to upload binaries to a server of the developer's choice. node-pre-gyp has particularly good support for uploading binaries to Amazon S3.
prebuild
#
prebuild is a tool that supports builds using either node-gyp or CMake.js. Unlike node-pre-gyp which supports a variety of servers, prebuild uploads binaries only to GitHub releases. prebuild is a good choice for GitHub projects using CMake.js.
prebuildify
#
prebuildify is a tool based on node-gyp. The advantage of prebuildify is that the built binaries are bundled with the native addon when it's uploaded to npm. The binaries are downloaded from npm and are immediately available to the module user when the native addon is installed.
Usage
#
In order to use the Node-API functions, include the file node_api.h which is located in the src directory in the node development tree:
#include <node_api.h>
copy
This will opt into the default NAPI_VERSION for the given release of Node.js. In order to ensure compatibility with specific versions of Node-API, the version can be specified explicitly when including the header:
#define NAPI_VERSION 3
#include <node_api.h>
copy
This restricts the Node-API surface to just the functionality that was available in the specified (and earlier) versions.
Some of the Node-API surface is experimental and requires explicit opt-in:
#define NAPI_EXPERIMENTAL
#include <node_api.h>
copy
In this case the entire API surface, including any experimental APIs, will be available to the module code.
Occasionally, experimental features are introduced that affect already-released and stable APIs. These features can be disabled by an opt-out:
#define NAPI_EXPERIMENTAL
#define NODE_API_EXPERIMENTAL_<FEATURE_NAME>_OPT_OUT
#include <node_api.h>
copy
where <FEATURE_NAME> is the name of an experimental feature that affects both experimental and stable APIs.
Node-API version matrix
#
Up until version 9, Node-API versions were additive and versioned independently from Node.js. This meant that any version was an extension to the previous version in that it had all of the APIs from the previous version with some additions. Each Node.js version only supported a single Node-API version. For example v18.15.0 supports only Node-API version 8. ABI stability was achieved because 8 was a strict superset of all previous versions.
As of version 9, while Node-API versions continue to be versioned independently, an add-on that ran with Node-API version 9 may need code updates to run with Node-API version 10. ABI stability is maintained, however, because Node.js versions that support Node-API versions higher than 8 will support all versions between 8 and the highest version they support and will default to providing the version 8 APIs unless an add-on opts into a higher Node-API version. This approach provides the flexibility of better optimizing existing Node-API functions while maintaining ABI stability. Existing add-ons can continue to run without recompilation using an earlier version of Node-API. If an add-on needs functionality from a newer Node-API version, changes to existing code and recompilation will be needed to use those new functions anyway.
In versions of Node.js that support Node-API version 9 and later, defining NAPI_VERSION=X and using the existing add-on initialization macros will bake in the requested Node-API version that will be used at runtime into the add-on. If NAPI_VERSION is not set it will default to 8.
This table may not be up to date in older streams, the most up to date information is in the latest API documentation in: Node-API version matrix
Node-API version
Supported In
10
v22.14.0+, 23.6.0+ and all later versions
9
v18.17.0+, 20.3.0+, 21.0.0 and all later versions
8
v12.22.0+, v14.17.0+, v15.12.0+, 16.0.0 and all later versions
7
v10.23.0+, v12.19.0+, v14.12.0+, 15.0.0 and all later versions
6
v10.20.0+, v12.17.0+, 14.0.0 and all later versions
5
v10.17.0+, v12.11.0+, 13.0.0 and all later versions
4
v10.16.0+, v11.8.0+, 12.0.0 and all later versions
3
v6.14.2*, 8.11.2+, v9.11.0+*, 10.0.0 and all later versions
2
v8.10.0+*, v9.3.0+*, 10.0.0 and all later versions
1
v8.6.0+**, v9.0.0+*, 10.0.0 and all later versions

* Node-API was experimental.
** Node.js 8.0.0 included Node-API as experimental. It was released as Node-API version 1 but continued to evolve until Node.js 8.6.0. The API is different in versions prior to Node.js 8.6.0. We recommend Node-API version 3 or later.
Each API documented for Node-API will have a header named added in:, and APIs which are stable will have the additional header Node-API version:. APIs are directly usable when using a Node.js version which supports the Node-API version shown in Node-API version: or higher. When using a Node.js version that does not support the Node-API version: listed or if there is no Node-API version: listed, then the API will only be available if #define NAPI_EXPERIMENTAL precedes the inclusion of node_api.h or js_native_api.h. If an API appears not to be available on a version of Node.js which is later than the one shown in added in: then this is most likely the reason for the apparent absence.
The Node-APIs associated strictly with accessing ECMAScript features from native code can be found separately in js_native_api.h and js_native_api_types.h. The APIs defined in these headers are included in node_api.h and node_api_types.h. The headers are structured in this way in order to allow implementations of Node-API outside of Node.js. For those implementations the Node.js specific APIs may not be applicable.
The Node.js-specific parts of an addon can be separated from the code that exposes the actual functionality to the JavaScript environment so that the latter may be used with multiple implementations of Node-API. In the example below, addon.c and addon.h refer only to js_native_api.h. This ensures that addon.c can be reused to compile against either the Node.js implementation of Node-API or any implementation of Node-API outside of Node.js.
addon_node.c is a separate file that contains the Node.js specific entry point to the addon and which instantiates the addon by calling into addon.c when the addon is loaded into a Node.js environment.
// addon.h
#ifndef _ADDON_H_
#define _ADDON_H_
#include <js_native_api.h>
napi_value create_addon(napi_env env);
#endif  // _ADDON_H_
copy
// addon.c
#include "addon.h"

#define NODE_API_CALL(env, call)                                  \
  do {                                                            \
    napi_status status = (call);                                  \
    if (status != napi_ok) {                                      \
      const napi_extended_error_info* error_info = NULL;          \
      napi_get_last_error_info((env), &error_info);               \
      const char* err_message = error_info->error_message;        \
      bool is_pending;                                            \
      napi_is_exception_pending((env), &is_pending);              \
      /* If an exception is already pending, don't rethrow it */  \
      if (!is_pending) {                                          \
        const char* message = (err_message == NULL)               \
            ? "empty error message"                               \
            : err_message;                                        \
        napi_throw_error((env), NULL, message);                   \
      }                                                           \
      return NULL;                                                \
    }                                                             \
  } while(0)

static napi_value
DoSomethingUseful(napi_env env, napi_callback_info info) {
  // Do something useful.
  return NULL;
}

napi_value create_addon(napi_env env) {
  napi_value result;
  NODE_API_CALL(env, napi_create_object(env, &result));

  napi_value exported_function;
  NODE_API_CALL(env, napi_create_function(env,
                                          "doSomethingUseful",
                                          NAPI_AUTO_LENGTH,
                                          DoSomethingUseful,
                                          NULL,
                                          &exported_function));

  NODE_API_CALL(env, napi_set_named_property(env,
                                             result,
                                             "doSomethingUseful",
                                             exported_function));

  return result;
}
copy
// addon_node.c
#include <node_api.h>
#include "addon.h"

NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  // This function body is expected to return a `napi_value`.
  // The variables `napi_env env` and `napi_value exports` may be used within
  // the body, as they are provided by the definition of `NAPI_MODULE_INIT()`.
  return create_addon(env);
}
copy
Environment life cycle APIs
#
Section 8.7 of the ECMAScript Language Specification defines the concept of an "Agent" as a self-contained environment in which JavaScript code runs. Multiple such Agents may be started and terminated either concurrently or in sequence by the process.
A Node.js environment corresponds to an ECMAScript Agent. In the main process, an environment is created at startup, and additional environments can be created on separate threads to serve as worker threads. When Node.js is embedded in another application, the main thread of the application may also construct and destroy a Node.js environment multiple times during the life cycle of the application process such that each Node.js environment created by the application may, in turn, during its life cycle create and destroy additional environments as worker threads.
From the perspective of a native addon this means that the bindings it provides may be called multiple times, from multiple contexts, and even concurrently from multiple threads.
Native addons may need to allocate global state which they use during their life cycle of an Node.js environment such that the state can be unique to each instance of the addon.
To this end, Node-API provides a way to associate data such that its life cycle is tied to the life cycle of a Node.js environment.
napi_set_instance_data
#
Added in: v12.8.0, v10.20.0 N-API version: 6
napi_status napi_set_instance_data(node_api_basic_env env,
                                   void* data,
                                   napi_finalize finalize_cb,
                                   void* finalize_hint);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] data: The data item to make available to bindings of this instance.
[in] finalize_cb: The function to call when the environment is being torn down. The function receives data so that it might free it. napi_finalize provides more details.
[in] finalize_hint: Optional hint to pass to the finalize callback during collection.
Returns napi_ok if the API succeeded.
This API associates data with the currently running Node.js environment. data can later be retrieved using napi_get_instance_data(). Any existing data associated with the currently running Node.js environment which was set by means of a previous call to napi_set_instance_data() will be overwritten. If a finalize_cb was provided by the previous call, it will not be called.
napi_get_instance_data
#
Added in: v12.8.0, v10.20.0 N-API version: 6
napi_status napi_get_instance_data(node_api_basic_env env,
                                   void** data);
copy
[in] env: The environment that the Node-API call is invoked under.
[out] data: The data item that was previously associated with the currently running Node.js environment by a call to napi_set_instance_data().
Returns napi_ok if the API succeeded.
This API retrieves data that was previously associated with the currently running Node.js environment via napi_set_instance_data(). If no data is set, the call will succeed and data will be set to NULL.
Basic Node-API data types
#
Node-API exposes the following fundamental data types as abstractions that are consumed by the various APIs. These APIs should be treated as opaque, introspectable only with other Node-API calls.
napi_status
#
Added in: v8.0.0 N-API version: 1
Integral status code indicating the success or failure of a Node-API call. Currently, the following status codes are supported.
typedef enum {
  napi_ok,
  napi_invalid_arg,
  napi_object_expected,
  napi_string_expected,
  napi_name_expected,
  napi_function_expected,
  napi_number_expected,
  napi_boolean_expected,
  napi_array_expected,
  napi_generic_failure,
  napi_pending_exception,
  napi_cancelled,
  napi_escape_called_twice,
  napi_handle_scope_mismatch,
  napi_callback_scope_mismatch,
  napi_queue_full,
  napi_closing,
  napi_bigint_expected,
  napi_date_expected,
  napi_arraybuffer_expected,
  napi_detachable_arraybuffer_expected,
  napi_would_deadlock,  /* unused */
  napi_no_external_buffers_allowed,
  napi_cannot_run_js
} napi_status;
copy
If additional information is required upon an API returning a failed status, it can be obtained by calling napi_get_last_error_info.
napi_extended_error_info
#
Added in: v8.0.0 N-API version: 1
typedef struct {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
} napi_extended_error_info;
copy
error_message: UTF8-encoded string containing a VM-neutral description of the error.
engine_reserved: Reserved for VM-specific error details. This is currently not implemented for any VM.
engine_error_code: VM-specific error code. This is currently not implemented for any VM.
error_code: The Node-API status code that originated with the last error.
See the Error handling section for additional information.
napi_env
#
napi_env is used to represent a context that the underlying Node-API implementation can use to persist VM-specific state. This structure is passed to native functions when they're invoked, and it must be passed back when making Node-API calls. Specifically, the same napi_env that was passed in when the initial native function was called must be passed to any subsequent nested Node-API calls. Caching the napi_env for the purpose of general reuse, and passing the napi_env between instances of the same addon running on different Worker threads is not allowed. The napi_env becomes invalid when an instance of a native addon is unloaded. Notification of this event is delivered through the callbacks given to napi_add_env_cleanup_hook and napi_set_instance_data.
node_api_basic_env
#
Stability: 1 - Experimental
This variant of napi_env is passed to synchronous finalizers (node_api_basic_finalize). There is a subset of Node-APIs which accept a parameter of type node_api_basic_env as their first argument. These APIs do not access the state of the JavaScript engine and are thus safe to call from synchronous finalizers. Passing a parameter of type napi_env to these APIs is allowed, however, passing a parameter of type node_api_basic_env to APIs that access the JavaScript engine state is not allowed. Attempting to do so without a cast will produce a compiler warning or an error when add-ons are compiled with flags which cause them to emit warnings and/or errors when incorrect pointer types are passed into a function. Calling such APIs from a synchronous finalizer will ultimately result in the termination of the application.
napi_value
#
This is an opaque pointer that is used to represent a JavaScript value.
napi_threadsafe_function
#
Added in: v10.6.0 N-API version: 4
This is an opaque pointer that represents a JavaScript function which can be called asynchronously from multiple threads via napi_call_threadsafe_function().
napi_threadsafe_function_release_mode
#
Added in: v10.6.0 N-API version: 4
A value to be given to napi_release_threadsafe_function() to indicate whether the thread-safe function is to be closed immediately (napi_tsfn_abort) or merely released (napi_tsfn_release) and thus available for subsequent use via napi_acquire_threadsafe_function() and napi_call_threadsafe_function().
typedef enum {
  napi_tsfn_release,
  napi_tsfn_abort
} napi_threadsafe_function_release_mode;
copy
napi_threadsafe_function_call_mode
#
Added in: v10.6.0 N-API version: 4
A value to be given to napi_call_threadsafe_function() to indicate whether the call should block whenever the queue associated with the thread-safe function is full.
typedef enum {
  napi_tsfn_nonblocking,
  napi_tsfn_blocking
} napi_threadsafe_function_call_mode;
copy
Node-API memory management types
#
napi_handle_scope
#
This is an abstraction used to control and modify the lifetime of objects created within a particular scope. In general, Node-API values are created within the context of a handle scope. When a native method is called from JavaScript, a default handle scope will exist. If the user does not explicitly create a new handle scope, Node-API values will be created in the default handle scope. For any invocations of code outside the execution of a native method (for instance, during a libuv callback invocation), the module is required to create a scope before invoking any functions that can result in the creation of JavaScript values.
Handle scopes are created using napi_open_handle_scope and are destroyed using napi_close_handle_scope. Closing the scope can indicate to the GC that all napi_values created during the lifetime of the handle scope are no longer referenced from the current stack frame.
For more details, review the Object lifetime management.
napi_escapable_handle_scope
#
Added in: v8.0.0 N-API version: 1
Escapable handle scopes are a special type of handle scope to return values created within a particular handle scope to a parent scope.
napi_ref
#
Added in: v8.0.0 N-API version: 1
This is the abstraction to use to reference a napi_value. This allows for users to manage the lifetimes of JavaScript values, including defining their minimum lifetimes explicitly.
For more details, review the Object lifetime management.
napi_type_tag
#
Added in: v14.8.0, v12.19.0 N-API version: 8
A 128-bit value stored as two unsigned 64-bit integers. It serves as a UUID with which JavaScript objects or externals can be "tagged" in order to ensure that they are of a certain type. This is a stronger check than napi_instanceof, because the latter can report a false positive if the object's prototype has been manipulated. Type-tagging is most useful in conjunction with napi_wrap because it ensures that the pointer retrieved from a wrapped object can be safely cast to the native type corresponding to the type tag that had been previously applied to the JavaScript object.
typedef struct {
  uint64_t lower;
  uint64_t upper;
} napi_type_tag;
copy
napi_async_cleanup_hook_handle
#
Added in: v14.10.0, v12.19.0
An opaque value returned by napi_add_async_cleanup_hook. It must be passed to napi_remove_async_cleanup_hook when the chain of asynchronous cleanup events completes.
Node-API callback types
#
napi_callback_info
#
Added in: v8.0.0 N-API version: 1
Opaque datatype that is passed to a callback function. It can be used for getting additional information about the context in which the callback was invoked.
napi_callback
#
Added in: v8.0.0 N-API version: 1
Function pointer type for user-provided native functions which are to be exposed to JavaScript via Node-API. Callback functions should satisfy the following signature:
typedef napi_value (*napi_callback)(napi_env, napi_callback_info);
copy
Unless for reasons discussed in Object Lifetime Management, creating a handle and/or callback scope inside a napi_callback is not necessary.
node_api_basic_finalize
#
Added in: v21.6.0, v20.12.0, v18.20.0
Stability: 1 - Experimental
Function pointer type for add-on provided functions that allow the user to be notified when externally-owned data is ready to be cleaned up because the object it was associated with has been garbage-collected. The user must provide a function satisfying the following signature which would get called upon the object's collection. Currently, node_api_basic_finalize can be used for finding out when objects that have external data are collected.
typedef void (*node_api_basic_finalize)(node_api_basic_env env,
                                      void* finalize_data,
                                      void* finalize_hint);
copy
Unless for reasons discussed in Object Lifetime Management, creating a handle and/or callback scope inside the function body is not necessary.
Since these functions may be called while the JavaScript engine is in a state where it cannot execute JavaScript code, only Node-APIs which accept a node_api_basic_env as their first parameter may be called. node_api_post_finalizer can be used to schedule Node-API calls that require access to the JavaScript engine's state to run after the current garbage collection cycle has completed.
In the case of node_api_create_external_string_latin1 and node_api_create_external_string_utf16 the env parameter may be null, because external strings can be collected during the latter part of environment shutdown.
Change History:
experimental (NAPI_EXPERIMENTAL):
Only Node-API calls that accept a node_api_basic_env as their first parameter may be called, otherwise the application will be terminated with an appropriate error message. This feature can be turned off by defining NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT.
napi_finalize
#
Added in: v8.0.0 N-API version: 1
Function pointer type for add-on provided function that allow the user to schedule a group of calls to Node-APIs in response to a garbage collection event, after the garbage collection cycle has completed. These function pointers can be used with node_api_post_finalizer.
typedef void (*napi_finalize)(napi_env env,
                              void* finalize_data,
                              void* finalize_hint);
copy
Change History:
experimental (NAPI_EXPERIMENTAL is defined):
A function of this type may no longer be used as a finalizer, except with node_api_post_finalizer. node_api_basic_finalize must be used instead. This feature can be turned off by defining NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT.
napi_async_execute_callback
#
Added in: v8.0.0 N-API version: 1
Function pointer used with functions that support asynchronous operations. Callback functions must satisfy the following signature:
typedef void (*napi_async_execute_callback)(napi_env env, void* data);
copy
Implementations of this function must avoid making Node-API calls that execute JavaScript or interact with JavaScript objects. Node-API calls should be in the napi_async_complete_callback instead. Do not use the napi_env parameter as it will likely result in execution of JavaScript.
napi_async_complete_callback
#
Added in: v8.0.0 N-API version: 1
Function pointer used with functions that support asynchronous operations. Callback functions must satisfy the following signature:
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
copy
Unless for reasons discussed in Object Lifetime Management, creating a handle and/or callback scope inside the function body is not necessary.
napi_threadsafe_function_call_js
#
Added in: v10.6.0 N-API version: 4
Function pointer used with asynchronous thread-safe function calls. The callback will be called on the main thread. Its purpose is to use a data item arriving via the queue from one of the secondary threads to construct the parameters necessary for a call into JavaScript, usually via napi_call_function, and then make the call into JavaScript.
The data arriving from the secondary thread via the queue is given in the data parameter and the JavaScript function to call is given in the js_callback parameter.
Node-API sets up the environment prior to calling this callback, so it is sufficient to call the JavaScript function via napi_call_function rather than via napi_make_callback.
Callback functions must satisfy the following signature:
typedef void (*napi_threadsafe_function_call_js)(napi_env env,
                                                 napi_value js_callback,
                                                 void* context,
                                                 void* data);
copy
[in] env: The environment to use for API calls, or NULL if the thread-safe function is being torn down and data may need to be freed.
[in] js_callback: The JavaScript function to call, or NULL if the thread-safe function is being torn down and data may need to be freed. It may also be NULL if the thread-safe function was created without js_callback.
[in] context: The optional data with which the thread-safe function was created.
[in] data: Data created by the secondary thread. It is the responsibility of the callback to convert this native data to JavaScript values (with Node-API functions) that can be passed as parameters when js_callback is invoked. This pointer is managed entirely by the threads and this callback. Thus this callback should free the data.
Unless for reasons discussed in Object Lifetime Management, creating a handle and/or callback scope inside the function body is not necessary.
napi_cleanup_hook
#
Added in: v19.2.0, v18.13.0 N-API version: 3
Function pointer used with napi_add_env_cleanup_hook. It will be called when the environment is being torn down.
Callback functions must satisfy the following signature:
typedef void (*napi_cleanup_hook)(void* data);
copy
[in] data: The data that was passed to napi_add_env_cleanup_hook.
napi_async_cleanup_hook
#
Added in: v14.10.0, v12.19.0
Function pointer used with napi_add_async_cleanup_hook. It will be called when the environment is being torn down.
Callback functions must satisfy the following signature:
typedef void (*napi_async_cleanup_hook)(napi_async_cleanup_hook_handle handle,
                                        void* data);
copy
[in] handle: The handle that must be passed to napi_remove_async_cleanup_hook after completion of the asynchronous cleanup.
[in] data: The data that was passed to napi_add_async_cleanup_hook.
The body of the function should initiate the asynchronous cleanup actions at the end of which handle must be passed in a call to napi_remove_async_cleanup_hook.
Error handling
#
Node-API uses both return values and JavaScript exceptions for error handling. The following sections explain the approach for each case.
Return values
#
All of the Node-API functions share the same error handling pattern. The return type of all API functions is napi_status.
The return value will be napi_ok if the request was successful and no uncaught JavaScript exception was thrown. If an error occurred AND an exception was thrown, the napi_status value for the error will be returned. If an exception was thrown, and no error occurred, napi_pending_exception will be returned.
In cases where a return value other than napi_ok or napi_pending_exception is returned, napi_is_exception_pending must be called to check if an exception is pending. See the section on exceptions for more details.
The full set of possible napi_status values is defined in napi_api_types.h.
The napi_status return value provides a VM-independent representation of the error which occurred. In some cases it is useful to be able to get more detailed information, including a string representing the error as well as VM (engine)-specific information.
In order to retrieve this information napi_get_last_error_info is provided which returns a napi_extended_error_info structure. The format of the napi_extended_error_info structure is as follows:
Added in: v8.0.0 N-API version: 1
typedef struct napi_extended_error_info {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
};
copy
error_message: Textual representation of the error that occurred.
engine_reserved: Opaque handle reserved for engine use only.
engine_error_code: VM specific error code.
error_code: Node-API status code for the last error.
napi_get_last_error_info returns the information for the last Node-API call that was made.
Do not rely on the content or format of any of the extended information as it is not subject to SemVer and may change at any time. It is intended only for logging purposes.
napi_get_last_error_info
#
Added in: v8.0.0 N-API version: 1
napi_status
napi_get_last_error_info(node_api_basic_env env,
                         const napi_extended_error_info** result);
copy
[in] env: The environment that the API is invoked under.
[out] result: The napi_extended_error_info structure with more information about the error.
Returns napi_ok if the API succeeded.
This API retrieves a napi_extended_error_info structure with information about the last error that occurred.
The content of the napi_extended_error_info returned is only valid up until a Node-API function is called on the same env. This includes a call to napi_is_exception_pending so it may often be necessary to make a copy of the information so that it can be used later. The pointer returned in error_message points to a statically-defined string so it is safe to use that pointer if you have copied it out of the error_message field (which will be overwritten) before another Node-API function was called.
Do not rely on the content or format of any of the extended information as it is not subject to SemVer and may change at any time. It is intended only for logging purposes.
This API can be called even if there is a pending JavaScript exception.
Exceptions
#
Any Node-API function call may result in a pending JavaScript exception. This is the case for any of the API functions, even those that may not cause the execution of JavaScript.
If the napi_status returned by a function is napi_ok then no exception is pending and no additional action is required. If the napi_status returned is anything other than napi_ok or napi_pending_exception, in order to try to recover and continue instead of simply returning immediately, napi_is_exception_pending must be called in order to determine if an exception is pending or not.
In many cases when a Node-API function is called and an exception is already pending, the function will return immediately with a napi_status of napi_pending_exception. However, this is not the case for all functions. Node-API allows a subset of the functions to be called to allow for some minimal cleanup before returning to JavaScript. In that case, napi_status will reflect the status for the function. It will not reflect previous pending exceptions. To avoid confusion, check the error status after every function call.
When an exception is pending one of two approaches can be employed.
The first approach is to do any appropriate cleanup and then return so that execution will return to JavaScript. As part of the transition back to JavaScript, the exception will be thrown at the point in the JavaScript code where the native method was invoked. The behavior of most Node-API calls is unspecified while an exception is pending, and many will simply return napi_pending_exception, so do as little as possible and then return to JavaScript where the exception can be handled.
The second approach is to try to handle the exception. There will be cases where the native code can catch the exception, take the appropriate action, and then continue. This is only recommended in specific cases where it is known that the exception can be safely handled. In these cases napi_get_and_clear_last_exception can be used to get and clear the exception. On success, result will contain the handle to the last JavaScript Object thrown. If it is determined, after retrieving the exception, the exception cannot be handled after all it can be re-thrown it with napi_throw where error is the JavaScript value to be thrown.
The following utility functions are also available in case native code needs to throw an exception or determine if a napi_value is an instance of a JavaScript Error object: napi_throw_error, napi_throw_type_error, napi_throw_range_error, node_api_throw_syntax_error and napi_is_error.
The following utility functions are also available in case native code needs to create an Error object: napi_create_error, napi_create_type_error, napi_create_range_error and node_api_create_syntax_error, where result is the napi_value that refers to the newly created JavaScript Error object.
The Node.js project is adding error codes to all of the errors generated internally. The goal is for applications to use these error codes for all error checking. The associated error messages will remain, but will only be meant to be used for logging and display with the expectation that the message can change without SemVer applying. In order to support this model with Node-API, both in internal functionality and for module specific functionality (as its good practice), the throw_ and create_ functions take an optional code parameter which is the string for the code to be added to the error object. If the optional parameter is NULL then no code will be associated with the error. If a code is provided, the name associated with the error is also updated to be:
originalName [code]
copy
where originalName is the original name associated with the error and code is the code that was provided. For example, if the code is 'ERR_ERROR_1' and a TypeError is being created the name will be:
TypeError [ERR_ERROR_1]
copy
napi_throw
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_throw(napi_env env, napi_value error);
copy
[in] env: The environment that the API is invoked under.
[in] error: The JavaScript value to be thrown.
Returns napi_ok if the API succeeded.
This API throws the JavaScript value provided.
napi_throw_error
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_throw_error(napi_env env,
                                         const char* code,
                                         const char* msg);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional error code to be set on the error.
[in] msg: C string representing the text to be associated with the error.
Returns napi_ok if the API succeeded.
This API throws a JavaScript Error with the text provided.
napi_throw_type_error
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_throw_type_error(napi_env env,
                                              const char* code,
                                              const char* msg);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional error code to be set on the error.
[in] msg: C string representing the text to be associated with the error.
Returns napi_ok if the API succeeded.
This API throws a JavaScript TypeError with the text provided.
napi_throw_range_error
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_throw_range_error(napi_env env,
                                               const char* code,
                                               const char* msg);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional error code to be set on the error.
[in] msg: C string representing the text to be associated with the error.
Returns napi_ok if the API succeeded.
This API throws a JavaScript RangeError with the text provided.
node_api_throw_syntax_error
#
Added in: v17.2.0, v16.14.0 N-API version: 9
NAPI_EXTERN napi_status node_api_throw_syntax_error(napi_env env,
                                                    const char* code,
                                                    const char* msg);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional error code to be set on the error.
[in] msg: C string representing the text to be associated with the error.
Returns napi_ok if the API succeeded.
This API throws a JavaScript SyntaxError with the text provided.
napi_is_error
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_is_error(napi_env env,
                                      napi_value value,
                                      bool* result);
copy
[in] env: The environment that the API is invoked under.
[in] value: The napi_value to be checked.
[out] result: Boolean value that is set to true if napi_value represents an error, false otherwise.
Returns napi_ok if the API succeeded.
This API queries a napi_value to check if it represents an error object.
napi_create_error
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_create_error(napi_env env,
                                          napi_value code,
                                          napi_value msg,
                                          napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional napi_value with the string for the error code to be associated with the error.
[in] msg: napi_value that references a JavaScript string to be used as the message for the Error.
[out] result: napi_value representing the error created.
Returns napi_ok if the API succeeded.
This API returns a JavaScript Error with the text provided.
napi_create_type_error
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_create_type_error(napi_env env,
                                               napi_value code,
                                               napi_value msg,
                                               napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional napi_value with the string for the error code to be associated with the error.
[in] msg: napi_value that references a JavaScript string to be used as the message for the Error.
[out] result: napi_value representing the error created.
Returns napi_ok if the API succeeded.
This API returns a JavaScript TypeError with the text provided.
napi_create_range_error
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_create_range_error(napi_env env,
                                                napi_value code,
                                                napi_value msg,
                                                napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional napi_value with the string for the error code to be associated with the error.
[in] msg: napi_value that references a JavaScript string to be used as the message for the Error.
[out] result: napi_value representing the error created.
Returns napi_ok if the API succeeded.
This API returns a JavaScript RangeError with the text provided.
node_api_create_syntax_error
#
Added in: v17.2.0, v16.14.0 N-API version: 9
NAPI_EXTERN napi_status node_api_create_syntax_error(napi_env env,
                                                     napi_value code,
                                                     napi_value msg,
                                                     napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] code: Optional napi_value with the string for the error code to be associated with the error.
[in] msg: napi_value that references a JavaScript string to be used as the message for the Error.
[out] result: napi_value representing the error created.
Returns napi_ok if the API succeeded.
This API returns a JavaScript SyntaxError with the text provided.
napi_get_and_clear_last_exception
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_and_clear_last_exception(napi_env env,
                                              napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[out] result: The exception if one is pending, NULL otherwise.
Returns napi_ok if the API succeeded.
This API can be called even if there is a pending JavaScript exception.
napi_is_exception_pending
#
Added in: v8.0.0 N-API version: 1
napi_status napi_is_exception_pending(napi_env env, bool* result);
copy
[in] env: The environment that the API is invoked under.
[out] result: Boolean value that is set to true if an exception is pending.
Returns napi_ok if the API succeeded.
This API can be called even if there is a pending JavaScript exception.
napi_fatal_exception
#
Added in: v9.10.0 N-API version: 3
napi_status napi_fatal_exception(napi_env env, napi_value err);
copy
[in] env: The environment that the API is invoked under.
[in] err: The error that is passed to 'uncaughtException'.
Trigger an 'uncaughtException' in JavaScript. Useful if an async callback throws an exception with no way to recover.
Fatal errors
#
In the event of an unrecoverable error in a native addon, a fatal error can be thrown to immediately terminate the process.
napi_fatal_error
#
Added in: v8.2.0 N-API version: 1
NAPI_NO_RETURN void napi_fatal_error(const char* location,
                                     size_t location_len,
                                     const char* message,
                                     size_t message_len);
copy
[in] location: Optional location at which the error occurred.
[in] location_len: The length of the location in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[in] message: The message associated with the error.
[in] message_len: The length of the message in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
The function call does not return, the process will be terminated.
This API can be called even if there is a pending JavaScript exception.
Object lifetime management
#
As Node-API calls are made, handles to objects in the heap for the underlying VM may be returned as napi_values. These handles must hold the objects 'live' until they are no longer required by the native code, otherwise the objects could be collected before the native code was finished using them.
As object handles are returned they are associated with a 'scope'. The lifespan for the default scope is tied to the lifespan of the native method call. The result is that, by default, handles remain valid and the objects associated with these handles will be held live for the lifespan of the native method call.
In many cases, however, it is necessary that the handles remain valid for either a shorter or longer lifespan than that of the native method. The sections which follow describe the Node-API functions that can be used to change the handle lifespan from the default.
Making handle lifespan shorter than that of the native method
#
It is often necessary to make the lifespan of handles shorter than the lifespan of a native method. For example, consider a native method that has a loop which iterates through the elements in a large array:
for (int i = 0; i < 1000000; i++) {
  napi_value result;
  napi_status status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // do something with element
}
copy
This would result in a large number of handles being created, consuming substantial resources. In addition, even though the native code could only use the most recent handle, all of the associated objects would also be kept alive since they all share the same scope.
To handle this case, Node-API provides the ability to establish a new 'scope' to which newly created handles will be associated. Once those handles are no longer required, the scope can be 'closed' and any handles associated with the scope are invalidated. The methods available to open/close scopes are napi_open_handle_scope and napi_close_handle_scope.
Node-API only supports a single nested hierarchy of scopes. There is only one active scope at any time, and all new handles will be associated with that scope while it is active. Scopes must be closed in the reverse order from which they are opened. In addition, all scopes created within a native method must be closed before returning from that method.
Taking the earlier example, adding calls to napi_open_handle_scope and napi_close_handle_scope would ensure that at most a single handle is valid throughout the execution of the loop:
for (int i = 0; i < 1000000; i++) {
  napi_handle_scope scope;
  napi_status status = napi_open_handle_scope(env, &scope);
  if (status != napi_ok) {
    break;
  }
  napi_value result;
  status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // do something with element
  status = napi_close_handle_scope(env, scope);
  if (status != napi_ok) {
    break;
  }
}
copy
When nesting scopes, there are cases where a handle from an inner scope needs to live beyond the lifespan of that scope. Node-API supports an 'escapable scope' in order to support this case. An escapable scope allows one handle to be 'promoted' so that it 'escapes' the current scope and the lifespan of the handle changes from the current scope to that of the outer scope.
The methods available to open/close escapable scopes are napi_open_escapable_handle_scope and napi_close_escapable_handle_scope.
The request to promote a handle is made through napi_escape_handle which can only be called once.
napi_open_handle_scope
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_open_handle_scope(napi_env env,
                                               napi_handle_scope* result);
copy
[in] env: The environment that the API is invoked under.
[out] result: napi_value representing the new scope.
Returns napi_ok if the API succeeded.
This API opens a new scope.
napi_close_handle_scope
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_close_handle_scope(napi_env env,
                                                napi_handle_scope scope);
copy
[in] env: The environment that the API is invoked under.
[in] scope: napi_value representing the scope to be closed.
Returns napi_ok if the API succeeded.
This API closes the scope passed in. Scopes must be closed in the reverse order from which they were created.
This API can be called even if there is a pending JavaScript exception.
napi_open_escapable_handle_scope
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status
    napi_open_escapable_handle_scope(napi_env env,
                                     napi_handle_scope* result);
copy
[in] env: The environment that the API is invoked under.
[out] result: napi_value representing the new scope.
Returns napi_ok if the API succeeded.
This API opens a new scope from which one object can be promoted to the outer scope.
napi_close_escapable_handle_scope
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status
    napi_close_escapable_handle_scope(napi_env env,
                                      napi_handle_scope scope);
copy
[in] env: The environment that the API is invoked under.
[in] scope: napi_value representing the scope to be closed.
Returns napi_ok if the API succeeded.
This API closes the scope passed in. Scopes must be closed in the reverse order from which they were created.
This API can be called even if there is a pending JavaScript exception.
napi_escape_handle
#
Added in: v8.0.0 N-API version: 1
napi_status napi_escape_handle(napi_env env,
                               napi_escapable_handle_scope scope,
                               napi_value escapee,
                               napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] scope: napi_value representing the current scope.
[in] escapee: napi_value representing the JavaScript Object to be escaped.
[out] result: napi_value representing the handle to the escaped Object in the outer scope.
Returns napi_ok if the API succeeded.
This API promotes the handle to the JavaScript object so that it is valid for the lifetime of the outer scope. It can only be called once per scope. If it is called more than once an error will be returned.
This API can be called even if there is a pending JavaScript exception.
References to values with a lifespan longer than that of the native method
#
In some cases, an addon will need to be able to create and reference values with a lifespan longer than that of a single native method invocation. For example, to create a constructor and later use that constructor in a request to create instances, it must be possible to reference the constructor object across many different instance creation requests. This would not be possible with a normal handle returned as a napi_value as described in the earlier section. The lifespan of a normal handle is managed by scopes and all scopes must be closed before the end of a native method.
Node-API provides methods for creating persistent references to values. Currently Node-API only allows references to be created for a limited set of value types, including object, external, function, and symbol.
Each reference has an associated count with a value of 0 or higher, which determines whether the reference will keep the corresponding value alive. References with a count of 0 do not prevent values from being collected. Values of object (object, function, external) and symbol types are becoming 'weak' references and can still be accessed while they are not collected. Any count greater than 0 will prevent the values from being collected.
Symbol values have different flavors. The true weak reference behavior is only supported by local symbols created with the napi_create_symbol function or the JavaScript Symbol() constructor calls. Globally registered symbols created with the node_api_symbol_for function or JavaScript Symbol.for() function calls remain always strong references because the garbage collector does not collect them. The same is true for well-known symbols such as Symbol.iterator. They are also never collected by the garbage collector.
References can be created with an initial reference count. The count can then be modified through napi_reference_ref and napi_reference_unref. If an object is collected while the count for a reference is 0, all subsequent calls to get the object associated with the reference napi_get_reference_value will return NULL for the returned napi_value. An attempt to call napi_reference_ref for a reference whose object has been collected results in an error.
References must be deleted once they are no longer required by the addon. When a reference is deleted, it will no longer prevent the corresponding object from being collected. Failure to delete a persistent reference results in a 'memory leak' with both the native memory for the persistent reference and the corresponding object on the heap being retained forever.
There can be multiple persistent references created which refer to the same object, each of which will either keep the object live or not based on its individual count. Multiple persistent references to the same object can result in unexpectedly keeping alive native memory. The native structures for a persistent reference must be kept alive until finalizers for the referenced object are executed. If a new persistent reference is created for the same object, the finalizers for that object will not be run and the native memory pointed by the earlier persistent reference will not be freed. This can be avoided by calling napi_delete_reference in addition to napi_reference_unref when possible.
Change History:
Version 10 (NAPI_VERSION is defined as 10 or higher):
References can be created for all value types. The new supported value types do not support weak reference semantic and the values of these types are released when the reference count becomes 0 and cannot be accessed from the reference anymore.
napi_create_reference
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_create_reference(napi_env env,
                                              napi_value value,
                                              uint32_t initial_refcount,
                                              napi_ref* result);
copy
[in] env: The environment that the API is invoked under.
[in] value: The napi_value for which a reference is being created.
[in] initial_refcount: Initial reference count for the new reference.
[out] result: napi_ref pointing to the new reference.
Returns napi_ok if the API succeeded.
This API creates a new reference with the specified reference count to the value passed in.
napi_delete_reference
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_delete_reference(napi_env env, napi_ref ref);
copy
[in] env: The environment that the API is invoked under.
[in] ref: napi_ref to be deleted.
Returns napi_ok if the API succeeded.
This API deletes the reference passed in.
This API can be called even if there is a pending JavaScript exception.
napi_reference_ref
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_reference_ref(napi_env env,
                                           napi_ref ref,
                                           uint32_t* result);
copy
[in] env: The environment that the API is invoked under.
[in] ref: napi_ref for which the reference count will be incremented.
[out] result: The new reference count.
Returns napi_ok if the API succeeded.
This API increments the reference count for the reference passed in and returns the resulting reference count.
napi_reference_unref
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_reference_unref(napi_env env,
                                             napi_ref ref,
                                             uint32_t* result);
copy
[in] env: The environment that the API is invoked under.
[in] ref: napi_ref for which the reference count will be decremented.
[out] result: The new reference count.
Returns napi_ok if the API succeeded.
This API decrements the reference count for the reference passed in and returns the resulting reference count.
napi_get_reference_value
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_get_reference_value(napi_env env,
                                                 napi_ref ref,
                                                 napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] ref: The napi_ref for which the corresponding value is being requested.
[out] result: The napi_value referenced by the napi_ref.
Returns napi_ok if the API succeeded.
If still valid, this API returns the napi_value representing the JavaScript value associated with the napi_ref. Otherwise, result will be NULL.
Cleanup on exit of the current Node.js environment
#
While a Node.js process typically releases all its resources when exiting, embedders of Node.js, or future Worker support, may require addons to register clean-up hooks that will be run once the current Node.js environment exits.
Node-API provides functions for registering and un-registering such callbacks. When those callbacks are run, all resources that are being held by the addon should be freed up.
napi_add_env_cleanup_hook
#
Added in: v10.2.0 N-API version: 3
NODE_EXTERN napi_status napi_add_env_cleanup_hook(node_api_basic_env env,
                                                  napi_cleanup_hook fun,
                                                  void* arg);
copy
Registers fun as a function to be run with the arg parameter once the current Node.js environment exits.
A function can safely be specified multiple times with different arg values. In that case, it will be called multiple times as well. Providing the same fun and arg values multiple times is not allowed and will lead the process to abort.
The hooks will be called in reverse order, i.e. the most recently added one will be called first.
Removing this hook can be done by using napi_remove_env_cleanup_hook. Typically, that happens when the resource for which this hook was added is being torn down anyway.
For asynchronous cleanup, napi_add_async_cleanup_hook is available.
napi_remove_env_cleanup_hook
#
Added in: v10.2.0 N-API version: 3
NAPI_EXTERN napi_status napi_remove_env_cleanup_hook(node_api_basic_env env,
                                                     void (*fun)(void* arg),
                                                     void* arg);
copy
Unregisters fun as a function to be run with the arg parameter once the current Node.js environment exits. Both the argument and the function value need to be exact matches.
The function must have originally been registered with napi_add_env_cleanup_hook, otherwise the process will abort.
napi_add_async_cleanup_hook
#
History













N-API version: 8
NAPI_EXTERN napi_status napi_add_async_cleanup_hook(
    node_api_basic_env env,
    napi_async_cleanup_hook hook,
    void* arg,
    napi_async_cleanup_hook_handle* remove_handle);
copy
[in] env: The environment that the API is invoked under.
[in] hook: The function pointer to call at environment teardown.
[in] arg: The pointer to pass to hook when it gets called.
[out] remove_handle: Optional handle that refers to the asynchronous cleanup hook.
Registers hook, which is a function of type napi_async_cleanup_hook, as a function to be run with the remove_handle and arg parameters once the current Node.js environment exits.
Unlike napi_add_env_cleanup_hook, the hook is allowed to be asynchronous.
Otherwise, behavior generally matches that of napi_add_env_cleanup_hook.
If remove_handle is not NULL, an opaque value will be stored in it that must later be passed to napi_remove_async_cleanup_hook, regardless of whether the hook has already been invoked. Typically, that happens when the resource for which this hook was added is being torn down anyway.
napi_remove_async_cleanup_hook
#
History













NAPI_EXTERN napi_status napi_remove_async_cleanup_hook(
    napi_async_cleanup_hook_handle remove_handle);
copy
[in] remove_handle: The handle to an asynchronous cleanup hook that was created with napi_add_async_cleanup_hook.
Unregisters the cleanup hook corresponding to remove_handle. This will prevent the hook from being executed, unless it has already started executing. This must be called on any napi_async_cleanup_hook_handle value obtained from napi_add_async_cleanup_hook.
Finalization on the exit of the Node.js environment
#
The Node.js environment may be torn down at an arbitrary time as soon as possible with JavaScript execution disallowed, like on the request of worker.terminate(). When the environment is being torn down, the registered napi_finalize callbacks of JavaScript objects, thread-safe functions and environment instance data are invoked immediately and independently.
The invocation of napi_finalize callbacks is scheduled after the manually registered cleanup hooks. In order to ensure a proper order of addon finalization during environment shutdown to avoid use-after-free in the napi_finalize callback, addons should register a cleanup hook with napi_add_env_cleanup_hook and napi_add_async_cleanup_hook to manually release the allocated resource in a proper order.
Module registration
#
Node-API modules are registered in a manner similar to other modules except that instead of using the NODE_MODULE macro the following is used:
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
copy
The next difference is the signature for the Init method. For a Node-API module it is as follows:
napi_value Init(napi_env env, napi_value exports);
copy
The return value from Init is treated as the exports object for the module. The Init method is passed an empty object via the exports parameter as a convenience. If Init returns NULL, the parameter passed as exports is exported by the module. Node-API modules cannot modify the module object but can specify anything as the exports property of the module.
To add the method hello as a function so that it can be called as a method provided by the addon:
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor desc = {
    "hello",
    NULL,
    Method,
    NULL,
    NULL,
    NULL,
    napi_writable | napi_enumerable | napi_configurable,
    NULL
  };
  status = napi_define_properties(env, exports, 1, &desc);
  if (status != napi_ok) return NULL;
  return exports;
}
copy
To set a function to be returned by the require() for the addon:
napi_value Init(napi_env env, napi_value exports) {
  napi_value method;
  napi_status status;
  status = napi_create_function(env, "exports", NAPI_AUTO_LENGTH, Method, NULL, &method);
  if (status != napi_ok) return NULL;
  return method;
}
copy
To define a class so that new instances can be created (often used with Object wrap):
// NOTE: partial example, not all referenced code is included
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor properties[] = {
    { "value", NULL, NULL, GetValue, SetValue, NULL, napi_writable | napi_configurable, NULL },
    DECLARE_NAPI_METHOD("plusOne", PlusOne),
    DECLARE_NAPI_METHOD("multiply", Multiply),
  };

  napi_value cons;
  status =
      napi_define_class(env, "MyObject", New, NULL, 3, properties, &cons);
  if (status != napi_ok) return NULL;

  status = napi_create_reference(env, cons, 1, &constructor);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "MyObject", cons);
  if (status != napi_ok) return NULL;

  return exports;
}
copy
You can also use the NAPI_MODULE_INIT macro, which acts as a shorthand for NAPI_MODULE and defining an Init function:
NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  napi_value answer;
  napi_status result;

  status = napi_create_int64(env, 42, &answer);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "answer", answer);
  if (status != napi_ok) return NULL;

  return exports;
}
copy
The parameters env and exports are provided to the body of the NAPI_MODULE_INIT macro.
All Node-API addons are context-aware, meaning they may be loaded multiple times. There are a few design considerations when declaring such a module. The documentation on context-aware addons provides more details.
The variables env and exports will be available inside the function body following the macro invocation.
For more details on setting properties on objects, see the section on Working with JavaScript properties.
For more details on building addon modules in general, refer to the existing API.
Working with JavaScript values
#
Node-API exposes a set of APIs to create all types of JavaScript values. Some of these types are documented under Section 6 of the ECMAScript Language Specification.
Fundamentally, these APIs are used to do one of the following:
Create a new JavaScript object
Convert from a primitive C type to a Node-API value
Convert from Node-API value to a primitive C type
Get global instances including undefined and null
Node-API values are represented by the type napi_value. Any Node-API call that requires a JavaScript value takes in a napi_value. In some cases, the API does check the type of the napi_value up-front. However, for better performance, it's better for the caller to make sure that the napi_value in question is of the JavaScript type expected by the API.
Enum types
#
napi_key_collection_mode
#
Added in: v13.7.0, v12.17.0, v10.20.0 N-API version: 6
typedef enum {
  napi_key_include_prototypes,
  napi_key_own_only
} napi_key_collection_mode;
copy
Describes the Keys/Properties filter enums:
napi_key_collection_mode limits the range of collected properties.
napi_key_own_only limits the collected properties to the given object only. napi_key_include_prototypes will include all keys of the objects's prototype chain as well.
napi_key_filter
#
Added in: v13.7.0, v12.17.0, v10.20.0 N-API version: 6
typedef enum {
  napi_key_all_properties = 0,
  napi_key_writable = 1,
  napi_key_enumerable = 1 << 1,
  napi_key_configurable = 1 << 2,
  napi_key_skip_strings = 1 << 3,
  napi_key_skip_symbols = 1 << 4
} napi_key_filter;
copy
Property filter bits. They can be or'ed to build a composite filter.
napi_key_conversion
#
Added in: v13.7.0, v12.17.0, v10.20.0 N-API version: 6
typedef enum {
  napi_key_keep_numbers,
  napi_key_numbers_to_strings
} napi_key_conversion;
copy
napi_key_numbers_to_strings will convert integer indexes to strings. napi_key_keep_numbers will return numbers for integer indexes.
napi_valuetype
#
typedef enum {
  // ES6 types (corresponds to typeof)
  napi_undefined,
  napi_null,
  napi_boolean,
  napi_number,
  napi_string,
  napi_symbol,
  napi_object,
  napi_function,
  napi_external,
  napi_bigint,
} napi_valuetype;
copy
Describes the type of a napi_value. This generally corresponds to the types described in Section 6.1 of the ECMAScript Language Specification. In addition to types in that section, napi_valuetype can also represent Functions and Objects with external data.
A JavaScript value of type napi_external appears in JavaScript as a plain object such that no properties can be set on it, and no prototype.
napi_typedarray_type
#
typedef enum {
  napi_int8_array,
  napi_uint8_array,
  napi_uint8_clamped_array,
  napi_int16_array,
  napi_uint16_array,
  napi_int32_array,
  napi_uint32_array,
  napi_float32_array,
  napi_float64_array,
  napi_bigint64_array,
  napi_biguint64_array,
} napi_typedarray_type;
copy
This represents the underlying binary scalar datatype of the TypedArray. Elements of this enum correspond to Section 22.2 of the ECMAScript Language Specification.
Object creation functions
#
napi_create_array
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_array(napi_env env, napi_value* result)
copy
[in] env: The environment that the Node-API call is invoked under.
[out] result: A napi_value representing a JavaScript Array.
Returns napi_ok if the API succeeded.
This API returns a Node-API value corresponding to a JavaScript Array type. JavaScript arrays are described in Section 22.1 of the ECMAScript Language Specification.
napi_create_array_with_length
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_array_with_length(napi_env env,
                                          size_t length,
                                          napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] length: The initial length of the Array.
[out] result: A napi_value representing a JavaScript Array.
Returns napi_ok if the API succeeded.
This API returns a Node-API value corresponding to a JavaScript Array type. The Array's length property is set to the passed-in length parameter. However, the underlying buffer is not guaranteed to be pre-allocated by the VM when the array is created. That behavior is left to the underlying VM implementation. If the buffer must be a contiguous block of memory that can be directly read and/or written via C, consider using napi_create_external_arraybuffer.
JavaScript arrays are described in Section 22.1 of the ECMAScript Language Specification.
napi_create_arraybuffer
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_arraybuffer(napi_env env,
                                    size_t byte_length,
                                    void** data,
                                    napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] length: The length in bytes of the array buffer to create.
[out] data: Pointer to the underlying byte buffer of the ArrayBuffer. data can optionally be ignored by passing NULL.
[out] result: A napi_value representing a JavaScript ArrayBuffer.
Returns napi_ok if the API succeeded.
This API returns a Node-API value corresponding to a JavaScript ArrayBuffer. ArrayBuffers are used to represent fixed-length binary data buffers. They are normally used as a backing-buffer for TypedArray objects. The ArrayBuffer allocated will have an underlying byte buffer whose size is determined by the length parameter that's passed in. The underlying buffer is optionally returned back to the caller in case the caller wants to directly manipulate the buffer. This buffer can only be written to directly from native code. To write to this buffer from JavaScript, a typed array or DataView object would need to be created.
JavaScript ArrayBuffer objects are described in Section 24.1 of the ECMAScript Language Specification.
napi_create_buffer
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_buffer(napi_env env,
                               size_t size,
                               void** data,
                               napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] size: Size in bytes of the underlying buffer.
[out] data: Raw pointer to the underlying buffer. data can optionally be ignored by passing NULL.
[out] result: A napi_value representing a node::Buffer.
Returns napi_ok if the API succeeded.
This API allocates a node::Buffer object. While this is still a fully-supported data structure, in most cases using a TypedArray will suffice.
napi_create_buffer_copy
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_buffer_copy(napi_env env,
                                    size_t length,
                                    const void* data,
                                    void** result_data,
                                    napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] size: Size in bytes of the input buffer (should be the same as the size of the new buffer).
[in] data: Raw pointer to the underlying buffer to copy from.
[out] result_data: Pointer to the new Buffer's underlying data buffer. result_data can optionally be ignored by passing NULL.
[out] result: A napi_value representing a node::Buffer.
Returns napi_ok if the API succeeded.
This API allocates a node::Buffer object and initializes it with data copied from the passed-in buffer. While this is still a fully-supported data structure, in most cases using a TypedArray will suffice.
napi_create_date
#
Added in: v11.11.0, v10.17.0 N-API version: 5
napi_status napi_create_date(napi_env env,
                             double time,
                             napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] time: ECMAScript time value in milliseconds since 01 January, 1970 UTC.
[out] result: A napi_value representing a JavaScript Date.
Returns napi_ok if the API succeeded.
This API does not observe leap seconds; they are ignored, as ECMAScript aligns with POSIX time specification.
This API allocates a JavaScript Date object.
JavaScript Date objects are described in Section 20.3 of the ECMAScript Language Specification.
napi_create_external
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_external(napi_env env,
                                 void* data,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] data: Raw pointer to the external data.
[in] finalize_cb: Optional callback to call when the external value is being collected. napi_finalize provides more details.
[in] finalize_hint: Optional hint to pass to the finalize callback during collection.
[out] result: A napi_value representing an external value.
Returns napi_ok if the API succeeded.
This API allocates a JavaScript value with external data attached to it. This is used to pass external data through JavaScript code, so it can be retrieved later by native code using napi_get_value_external.
The API adds a napi_finalize callback which will be called when the JavaScript object just created has been garbage collected.
The created value is not an object, and therefore does not support additional properties. It is considered a distinct value type: calling napi_typeof() with an external value yields napi_external.
napi_create_external_arraybuffer
#
Added in: v8.0.0 N-API version: 1
napi_status
napi_create_external_arraybuffer(napi_env env,
                                 void* external_data,
                                 size_t byte_length,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] external_data: Pointer to the underlying byte buffer of the ArrayBuffer.
[in] byte_length: The length in bytes of the underlying buffer.
[in] finalize_cb: Optional callback to call when the ArrayBuffer is being collected. napi_finalize provides more details.
[in] finalize_hint: Optional hint to pass to the finalize callback during collection.
[out] result: A napi_value representing a JavaScript ArrayBuffer.
Returns napi_ok if the API succeeded.
Some runtimes other than Node.js have dropped support for external buffers. On runtimes other than Node.js this method may return napi_no_external_buffers_allowed to indicate that external buffers are not supported. One such runtime is Electron as described in this issue electron/issues/35801.
In order to maintain broadest compatibility with all runtimes you may define NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED in your addon before includes for the node-api headers. Doing so will hide the 2 functions that create external buffers. This will ensure a compilation error occurs if you accidentally use one of these methods.
This API returns a Node-API value corresponding to a JavaScript ArrayBuffer. The underlying byte buffer of the ArrayBuffer is externally allocated and managed. The caller must ensure that the byte buffer remains valid until the finalize callback is called.
The API adds a napi_finalize callback which will be called when the JavaScript object just created has been garbage collected.
JavaScript ArrayBuffers are described in Section 24.1 of the ECMAScript Language Specification.
napi_create_external_buffer
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_external_buffer(napi_env env,
                                        size_t length,
                                        void* data,
                                        napi_finalize finalize_cb,
                                        void* finalize_hint,
                                        napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] length: Size in bytes of the input buffer (should be the same as the size of the new buffer).
[in] data: Raw pointer to the underlying buffer to expose to JavaScript.
[in] finalize_cb: Optional callback to call when the ArrayBuffer is being collected. napi_finalize provides more details.
[in] finalize_hint: Optional hint to pass to the finalize callback during collection.
[out] result: A napi_value representing a node::Buffer.
Returns napi_ok if the API succeeded.
Some runtimes other than Node.js have dropped support for external buffers. On runtimes other than Node.js this method may return napi_no_external_buffers_allowed to indicate that external buffers are not supported. One such runtime is Electron as described in this issue electron/issues/35801.
In order to maintain broadest compatibility with all runtimes you may define NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED in your addon before includes for the node-api headers. Doing so will hide the 2 functions that create external buffers. This will ensure a compilation error occurs if you accidentally use one of these methods.
This API allocates a node::Buffer object and initializes it with data backed by the passed in buffer. While this is still a fully-supported data structure, in most cases using a TypedArray will suffice.
The API adds a napi_finalize callback which will be called when the JavaScript object just created has been garbage collected.
For Node.js >=4 Buffers are Uint8Arrays.
napi_create_object
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_object(napi_env env, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[out] result: A napi_value representing a JavaScript Object.
Returns napi_ok if the API succeeded.
This API allocates a default JavaScript Object. It is the equivalent of doing new Object() in JavaScript.
The JavaScript Object type is described in Section 6.1.7 of the ECMAScript Language Specification.
napi_create_symbol
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_symbol(napi_env env,
                               napi_value description,
                               napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] description: Optional napi_value which refers to a JavaScript string to be set as the description for the symbol.
[out] result: A napi_value representing a JavaScript symbol.
Returns napi_ok if the API succeeded.
This API creates a JavaScript symbol value from a UTF8-encoded C string.
The JavaScript symbol type is described in Section 19.4 of the ECMAScript Language Specification.
node_api_symbol_for
#
Added in: v17.5.0, v16.15.0 N-API version: 9
napi_status node_api_symbol_for(napi_env env,
                                const char* utf8description,
                                size_t length,
                                napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] utf8description: UTF-8 C string representing the text to be used as the description for the symbol.
[in] length: The length of the description string in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[out] result: A napi_value representing a JavaScript symbol.
Returns napi_ok if the API succeeded.
This API searches in the global registry for an existing symbol with the given description. If the symbol already exists it will be returned, otherwise a new symbol will be created in the registry.
The JavaScript symbol type is described in Section 19.4 of the ECMAScript Language Specification.
napi_create_typedarray
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_typedarray(napi_env env,
                                   napi_typedarray_type type,
                                   size_t length,
                                   napi_value arraybuffer,
                                   size_t byte_offset,
                                   napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] type: Scalar datatype of the elements within the TypedArray.
[in] length: Number of elements in the TypedArray.
[in] arraybuffer: ArrayBuffer underlying the typed array.
[in] byte_offset: The byte offset within the ArrayBuffer from which to start projecting the TypedArray.
[out] result: A napi_value representing a JavaScript TypedArray.
Returns napi_ok if the API succeeded.
This API creates a JavaScript TypedArray object over an existing ArrayBuffer. TypedArray objects provide an array-like view over an underlying data buffer where each element has the same underlying binary scalar datatype.
It's required that (length * size_of_element) + byte_offset should be <= the size in bytes of the array passed in. If not, a RangeError exception is raised.
JavaScript TypedArray objects are described in Section 22.2 of the ECMAScript Language Specification.
node_api_create_buffer_from_arraybuffer
#
Added in: v23.0.0, v22.12.0 N-API version: 10
napi_status NAPI_CDECL node_api_create_buffer_from_arraybuffer(napi_env env,
                                                              napi_value arraybuffer,
                                                              size_t byte_offset,
                                                              size_t byte_length,
                                                              napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] arraybuffer: The ArrayBuffer from which the buffer will be created.
[in] byte_offset: The byte offset within the ArrayBuffer from which to start creating the buffer.
[in] byte_length: The length in bytes of the buffer to be created from the ArrayBuffer.
[out] result: A napi_value representing the created JavaScript Buffer object.
Returns napi_ok if the API succeeded.
This API creates a JavaScript Buffer object from an existing ArrayBuffer. The Buffer object is a Node.js-specific class that provides a way to work with binary data directly in JavaScript.
The byte range [byte_offset, byte_offset + byte_length) must be within the bounds of the ArrayBuffer. If byte_offset + byte_length exceeds the size of the ArrayBuffer, a RangeError exception is raised.
napi_create_dataview
#
Added in: v8.3.0 N-API version: 1
napi_status napi_create_dataview(napi_env env,
                                 size_t byte_length,
                                 napi_value arraybuffer,
                                 size_t byte_offset,
                                 napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] length: Number of elements in the DataView.
[in] arraybuffer: ArrayBuffer underlying the DataView.
[in] byte_offset: The byte offset within the ArrayBuffer from which to start projecting the DataView.
[out] result: A napi_value representing a JavaScript DataView.
Returns napi_ok if the API succeeded.
This API creates a JavaScript DataView object over an existing ArrayBuffer. DataView objects provide an array-like view over an underlying data buffer, but one which allows items of different size and type in the ArrayBuffer.
It is required that byte_length + byte_offset is less than or equal to the size in bytes of the array passed in. If not, a RangeError exception is raised.
JavaScript DataView objects are described in Section 24.3 of the ECMAScript Language Specification.
Functions to convert from C types to Node-API
#
napi_create_int32
#
Added in: v8.4.0 N-API version: 1
napi_status napi_create_int32(napi_env env, int32_t value, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: Integer value to be represented in JavaScript.
[out] result: A napi_value representing a JavaScript number.
Returns napi_ok if the API succeeded.
This API is used to convert from the C int32_t type to the JavaScript number type.
The JavaScript number type is described in Section 6.1.6 of the ECMAScript Language Specification.
napi_create_uint32
#
Added in: v8.4.0 N-API version: 1
napi_status napi_create_uint32(napi_env env, uint32_t value, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: Unsigned integer value to be represented in JavaScript.
[out] result: A napi_value representing a JavaScript number.
Returns napi_ok if the API succeeded.
This API is used to convert from the C uint32_t type to the JavaScript number type.
The JavaScript number type is described in Section 6.1.6 of the ECMAScript Language Specification.
napi_create_int64
#
Added in: v8.4.0 N-API version: 1
napi_status napi_create_int64(napi_env env, int64_t value, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: Integer value to be represented in JavaScript.
[out] result: A napi_value representing a JavaScript number.
Returns napi_ok if the API succeeded.
This API is used to convert from the C int64_t type to the JavaScript number type.
The JavaScript number type is described in Section 6.1.6 of the ECMAScript Language Specification. Note the complete range of int64_t cannot be represented with full precision in JavaScript. Integer values outside the range of Number.MIN_SAFE_INTEGER -(2**53 - 1) - Number.MAX_SAFE_INTEGER (2**53 - 1) will lose precision.
napi_create_double
#
Added in: v8.4.0 N-API version: 1
napi_status napi_create_double(napi_env env, double value, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: Double-precision value to be represented in JavaScript.
[out] result: A napi_value representing a JavaScript number.
Returns napi_ok if the API succeeded.
This API is used to convert from the C double type to the JavaScript number type.
The JavaScript number type is described in Section 6.1.6 of the ECMAScript Language Specification.
napi_create_bigint_int64
#
Added in: v10.7.0 N-API version: 6
napi_status napi_create_bigint_int64(napi_env env,
                                     int64_t value,
                                     napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] value: Integer value to be represented in JavaScript.
[out] result: A napi_value representing a JavaScript BigInt.
Returns napi_ok if the API succeeded.
This API converts the C int64_t type to the JavaScript BigInt type.
napi_create_bigint_uint64
#
Added in: v10.7.0 N-API version: 6
napi_status napi_create_bigint_uint64(napi_env env,
                                      uint64_t value,
                                      napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] value: Unsigned integer value to be represented in JavaScript.
[out] result: A napi_value representing a JavaScript BigInt.
Returns napi_ok if the API succeeded.
This API converts the C uint64_t type to the JavaScript BigInt type.
napi_create_bigint_words
#
Added in: v10.7.0 N-API version: 6
napi_status napi_create_bigint_words(napi_env env,
                                     int sign_bit,
                                     size_t word_count,
                                     const uint64_t* words,
                                     napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] sign_bit: Determines if the resulting BigInt will be positive or negative.
[in] word_count: The length of the words array.
[in] words: An array of uint64_t little-endian 64-bit words.
[out] result: A napi_value representing a JavaScript BigInt.
Returns napi_ok if the API succeeded.
This API converts an array of unsigned 64-bit words into a single BigInt value.
The resulting BigInt is calculated as: (–1)sign_bit (words[0] × (264)0 + words[1] × (264)1 + …)
napi_create_string_latin1
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_string_latin1(napi_env env,
                                      const char* str,
                                      size_t length,
                                      napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing an ISO-8859-1-encoded string.
[in] length: The length of the string in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[out] result: A napi_value representing a JavaScript string.
Returns napi_ok if the API succeeded.
This API creates a JavaScript string value from an ISO-8859-1-encoded C string. The native string is copied.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
node_api_create_external_string_latin1
#
Added in: v20.4.0, v18.18.0 N-API version: 10
napi_status
node_api_create_external_string_latin1(napi_env env,
                                       char* str,
                                       size_t length,
                                       napi_finalize finalize_callback,
                                       void* finalize_hint,
                                       napi_value* result,
                                       bool* copied);
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing an ISO-8859-1-encoded string.
[in] length: The length of the string in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[in] finalize_callback: The function to call when the string is being collected. The function will be called with the following parameters:
[in] env: The environment in which the add-on is running. This value may be null if the string is being collected as part of the termination of the worker or the main Node.js instance.
[in] data: This is the value str as a void* pointer.
[in] finalize_hint: This is the value finalize_hint that was given to the API. napi_finalize provides more details. This parameter is optional. Passing a null value means that the add-on doesn't need to be notified when the corresponding JavaScript string is collected.
[in] finalize_hint: Optional hint to pass to the finalize callback during collection.
[out] result: A napi_value representing a JavaScript string.
[out] copied: Whether the string was copied. If it was, the finalizer will already have been invoked to destroy str.
Returns napi_ok if the API succeeded.
This API creates a JavaScript string value from an ISO-8859-1-encoded C string. The native string may not be copied and must thus exist for the entire life cycle of the JavaScript value.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
napi_create_string_utf16
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_string_utf16(napi_env env,
                                     const char16_t* str,
                                     size_t length,
                                     napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing a UTF16-LE-encoded string.
[in] length: The length of the string in two-byte code units, or NAPI_AUTO_LENGTH if it is null-terminated.
[out] result: A napi_value representing a JavaScript string.
Returns napi_ok if the API succeeded.
This API creates a JavaScript string value from a UTF16-LE-encoded C string. The native string is copied.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
node_api_create_external_string_utf16
#
Added in: v20.4.0, v18.18.0 N-API version: 10
napi_status
node_api_create_external_string_utf16(napi_env env,
                                      char16_t* str,
                                      size_t length,
                                      napi_finalize finalize_callback,
                                      void* finalize_hint,
                                      napi_value* result,
                                      bool* copied);
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing a UTF16-LE-encoded string.
[in] length: The length of the string in two-byte code units, or NAPI_AUTO_LENGTH if it is null-terminated.
[in] finalize_callback: The function to call when the string is being collected. The function will be called with the following parameters:
[in] env: The environment in which the add-on is running. This value may be null if the string is being collected as part of the termination of the worker or the main Node.js instance.
[in] data: This is the value str as a void* pointer.
[in] finalize_hint: This is the value finalize_hint that was given to the API. napi_finalize provides more details. This parameter is optional. Passing a null value means that the add-on doesn't need to be notified when the corresponding JavaScript string is collected.
[in] finalize_hint: Optional hint to pass to the finalize callback during collection.
[out] result: A napi_value representing a JavaScript string.
[out] copied: Whether the string was copied. If it was, the finalizer will already have been invoked to destroy str.
Returns napi_ok if the API succeeded.
This API creates a JavaScript string value from a UTF16-LE-encoded C string. The native string may not be copied and must thus exist for the entire life cycle of the JavaScript value.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
napi_create_string_utf8
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_string_utf8(napi_env env,
                                    const char* str,
                                    size_t length,
                                    napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing a UTF8-encoded string.
[in] length: The length of the string in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[out] result: A napi_value representing a JavaScript string.
Returns napi_ok if the API succeeded.
This API creates a JavaScript string value from a UTF8-encoded C string. The native string is copied.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
Functions to create optimized property keys
#
Many JavaScript engines including V8 use internalized strings as keys to set and get property values. They typically use a hash table to create and lookup such strings. While it adds some cost per key creation, it improves the performance after that by enabling comparison of string pointers instead of the whole strings.
If a new JavaScript string is intended to be used as a property key, then for some JavaScript engines it will be more efficient to use the functions in this section. Otherwise, use the napi_create_string_utf8 or node_api_create_external_string_utf8 series functions as there may be additional overhead in creating/storing strings with the property key creation methods.
node_api_create_property_key_latin1
#
Added in: v22.9.0, v20.18.0 N-API version: 10
napi_status NAPI_CDECL node_api_create_property_key_latin1(napi_env env,
                                                           const char* str,
                                                           size_t length,
                                                           napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing an ISO-8859-1-encoded string.
[in] length: The length of the string in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[out] result: A napi_value representing an optimized JavaScript string to be used as a property key for objects.
Returns napi_ok if the API succeeded.
This API creates an optimized JavaScript string value from an ISO-8859-1-encoded C string to be used as a property key for objects. The native string is copied. In contrast with napi_create_string_latin1, subsequent calls to this function with the same str pointer may benefit from a speedup in the creation of the requested napi_value, depending on the engine.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
node_api_create_property_key_utf16
#
Added in: v21.7.0, v20.12.0 N-API version: 10
napi_status NAPI_CDECL node_api_create_property_key_utf16(napi_env env,
                                                          const char16_t* str,
                                                          size_t length,
                                                          napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing a UTF16-LE-encoded string.
[in] length: The length of the string in two-byte code units, or NAPI_AUTO_LENGTH if it is null-terminated.
[out] result: A napi_value representing an optimized JavaScript string to be used as a property key for objects.
Returns napi_ok if the API succeeded.
This API creates an optimized JavaScript string value from a UTF16-LE-encoded C string to be used as a property key for objects. The native string is copied.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
node_api_create_property_key_utf8
#
Added in: v22.9.0, v20.18.0 N-API version: 10
napi_status NAPI_CDECL node_api_create_property_key_utf8(napi_env env,
                                                         const char* str,
                                                         size_t length,
                                                         napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] str: Character buffer representing a UTF8-encoded string.
[in] length: The length of the string in two-byte code units, or NAPI_AUTO_LENGTH if it is null-terminated.
[out] result: A napi_value representing an optimized JavaScript string to be used as a property key for objects.
Returns napi_ok if the API succeeded.
This API creates an optimized JavaScript string value from a UTF8-encoded C string to be used as a property key for objects. The native string is copied.
The JavaScript string type is described in Section 6.1.4 of the ECMAScript Language Specification.
Functions to convert from Node-API to C types
#
napi_get_array_length
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_array_length(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing the JavaScript Array whose length is being queried.
[out] result: uint32 representing length of the array.
Returns napi_ok if the API succeeded.
This API returns the length of an array.
Array length is described in Section 22.1.4.1 of the ECMAScript Language Specification.
napi_get_arraybuffer_info
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_arraybuffer_info(napi_env env,
                                      napi_value arraybuffer,
                                      void** data,
                                      size_t* byte_length)
copy
[in] env: The environment that the API is invoked under.
[in] arraybuffer: napi_value representing the ArrayBuffer being queried.
[out] data: The underlying data buffer of the ArrayBuffer. If byte_length is 0, this may be NULL or any other pointer value.
[out] byte_length: Length in bytes of the underlying data buffer.
Returns napi_ok if the API succeeded.
This API is used to retrieve the underlying data buffer of an ArrayBuffer and its length.
WARNING: Use caution while using this API. The lifetime of the underlying data buffer is managed by the ArrayBuffer even after it's returned. A possible safe way to use this API is in conjunction with napi_create_reference, which can be used to guarantee control over the lifetime of the ArrayBuffer. It's also safe to use the returned data buffer within the same callback as long as there are no calls to other APIs that might trigger a GC.
napi_get_buffer_info
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_buffer_info(napi_env env,
                                 napi_value value,
                                 void** data,
                                 size_t* length)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing the node::Buffer or Uint8Array being queried.
[out] data: The underlying data buffer of the node::Buffer or Uint8Array. If length is 0, this may be NULL or any other pointer value.
[out] length: Length in bytes of the underlying data buffer.
Returns napi_ok if the API succeeded.
This method returns the identical data and byte_length as napi_get_typedarray_info. And napi_get_typedarray_info accepts a node::Buffer (a Uint8Array) as the value too.
This API is used to retrieve the underlying data buffer of a node::Buffer and its length.
Warning: Use caution while using this API since the underlying data buffer's lifetime is not guaranteed if it's managed by the VM.
napi_get_prototype
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_prototype(napi_env env,
                               napi_value object,
                               napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] object: napi_value representing JavaScript Object whose prototype to return. This returns the equivalent of Object.getPrototypeOf (which is not the same as the function's prototype property).
[out] result: napi_value representing prototype of the given object.
Returns napi_ok if the API succeeded.
napi_get_typedarray_info
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_typedarray_info(napi_env env,
                                     napi_value typedarray,
                                     napi_typedarray_type* type,
                                     size_t* length,
                                     void** data,
                                     napi_value* arraybuffer,
                                     size_t* byte_offset)
copy
[in] env: The environment that the API is invoked under.
[in] typedarray: napi_value representing the TypedArray whose properties to query.
[out] type: Scalar datatype of the elements within the TypedArray.
[out] length: The number of elements in the TypedArray.
[out] data: The data buffer underlying the TypedArray adjusted by the byte_offset value so that it points to the first element in the TypedArray. If the length of the array is 0, this may be NULL or any other pointer value.
[out] arraybuffer: The ArrayBuffer underlying the TypedArray.
[out] byte_offset: The byte offset within the underlying native array at which the first element of the arrays is located. The value for the data parameter has already been adjusted so that data points to the first element in the array. Therefore, the first byte of the native array would be at data - byte_offset.
Returns napi_ok if the API succeeded.
This API returns various properties of a typed array.
Any of the out parameters may be NULL if that property is unneeded.
Warning: Use caution while using this API since the underlying data buffer is managed by the VM.
napi_get_dataview_info
#
Added in: v8.3.0 N-API version: 1
napi_status napi_get_dataview_info(napi_env env,
                                   napi_value dataview,
                                   size_t* byte_length,
                                   void** data,
                                   napi_value* arraybuffer,
                                   size_t* byte_offset)
copy
[in] env: The environment that the API is invoked under.
[in] dataview: napi_value representing the DataView whose properties to query.
[out] byte_length: Number of bytes in the DataView.
[out] data: The data buffer underlying the DataView. If byte_length is 0, this may be NULL or any other pointer value.
[out] arraybuffer: ArrayBuffer underlying the DataView.
[out] byte_offset: The byte offset within the data buffer from which to start projecting the DataView.
Returns napi_ok if the API succeeded.
Any of the out parameters may be NULL if that property is unneeded.
This API returns various properties of a DataView.
napi_get_date_value
#
Added in: v11.11.0, v10.17.0 N-API version: 5
napi_status napi_get_date_value(napi_env env,
                                napi_value value,
                                double* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing a JavaScript Date.
[out] result: Time value as a double represented as milliseconds since midnight at the beginning of 01 January, 1970 UTC.
This API does not observe leap seconds; they are ignored, as ECMAScript aligns with POSIX time specification.
Returns napi_ok if the API succeeded. If a non-date napi_value is passed in it returns napi_date_expected.
This API returns the C double primitive of time value for the given JavaScript Date.
napi_get_value_bool
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_bool(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript Boolean.
[out] result: C boolean primitive equivalent of the given JavaScript Boolean.
Returns napi_ok if the API succeeded. If a non-boolean napi_value is passed in it returns napi_boolean_expected.
This API returns the C boolean primitive equivalent of the given JavaScript Boolean.
napi_get_value_double
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_double(napi_env env,
                                  napi_value value,
                                  double* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript number.
[out] result: C double primitive equivalent of the given JavaScript number.
Returns napi_ok if the API succeeded. If a non-number napi_value is passed in it returns napi_number_expected.
This API returns the C double primitive equivalent of the given JavaScript number.
napi_get_value_bigint_int64
#
Added in: v10.7.0 N-API version: 6
napi_status napi_get_value_bigint_int64(napi_env env,
                                        napi_value value,
                                        int64_t* result,
                                        bool* lossless);
copy
[in] env: The environment that the API is invoked under
[in] value: napi_value representing JavaScript BigInt.
[out] result: C int64_t primitive equivalent of the given JavaScript BigInt.
[out] lossless: Indicates whether the BigInt value was converted losslessly.
Returns napi_ok if the API succeeded. If a non-BigInt is passed in it returns napi_bigint_expected.
This API returns the C int64_t primitive equivalent of the given JavaScript BigInt. If needed it will truncate the value, setting lossless to false.
napi_get_value_bigint_uint64
#
Added in: v10.7.0 N-API version: 6
napi_status napi_get_value_bigint_uint64(napi_env env,
                                        napi_value value,
                                        uint64_t* result,
                                        bool* lossless);
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript BigInt.
[out] result: C uint64_t primitive equivalent of the given JavaScript BigInt.
[out] lossless: Indicates whether the BigInt value was converted losslessly.
Returns napi_ok if the API succeeded. If a non-BigInt is passed in it returns napi_bigint_expected.
This API returns the C uint64_t primitive equivalent of the given JavaScript BigInt. If needed it will truncate the value, setting lossless to false.
napi_get_value_bigint_words
#
Added in: v10.7.0 N-API version: 6
napi_status napi_get_value_bigint_words(napi_env env,
                                        napi_value value,
                                        int* sign_bit,
                                        size_t* word_count,
                                        uint64_t* words);
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript BigInt.
[out] sign_bit: Integer representing if the JavaScript BigInt is positive or negative.
[in/out] word_count: Must be initialized to the length of the words array. Upon return, it will be set to the actual number of words that would be needed to store this BigInt.
[out] words: Pointer to a pre-allocated 64-bit word array.
Returns napi_ok if the API succeeded.
This API converts a single BigInt value into a sign bit, 64-bit little-endian array, and the number of elements in the array. sign_bit and words may be both set to NULL, in order to get only word_count.
napi_get_value_external
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_external(napi_env env,
                                    napi_value value,
                                    void** result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript external value.
[out] result: Pointer to the data wrapped by the JavaScript external value.
Returns napi_ok if the API succeeded. If a non-external napi_value is passed in it returns napi_invalid_arg.
This API retrieves the external data pointer that was previously passed to napi_create_external().
napi_get_value_int32
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_int32(napi_env env,
                                 napi_value value,
                                 int32_t* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript number.
[out] result: C int32 primitive equivalent of the given JavaScript number.
Returns napi_ok if the API succeeded. If a non-number napi_value is passed in napi_number_expected.
This API returns the C int32 primitive equivalent of the given JavaScript number.
If the number exceeds the range of the 32 bit integer, then the result is truncated to the equivalent of the bottom 32 bits. This can result in a large positive number becoming a negative number if the value is > 231 - 1.
Non-finite number values (NaN, +Infinity, or -Infinity) set the result to zero.
napi_get_value_int64
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_int64(napi_env env,
                                 napi_value value,
                                 int64_t* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript number.
[out] result: C int64 primitive equivalent of the given JavaScript number.
Returns napi_ok if the API succeeded. If a non-number napi_value is passed in it returns napi_number_expected.
This API returns the C int64 primitive equivalent of the given JavaScript number.
number values outside the range of Number.MIN_SAFE_INTEGER -(2**53 - 1) - Number.MAX_SAFE_INTEGER (2**53 - 1) will lose precision.
Non-finite number values (NaN, +Infinity, or -Infinity) set the result to zero.
napi_get_value_string_latin1
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_string_latin1(napi_env env,
                                         napi_value value,
                                         char* buf,
                                         size_t bufsize,
                                         size_t* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript string.
[in] buf: Buffer to write the ISO-8859-1-encoded string into. If NULL is passed in, the length of the string in bytes and excluding the null terminator is returned in result.
[in] bufsize: Size of the destination buffer. When this value is insufficient, the returned string is truncated and null-terminated. If this value is zero, then the string is not returned and no changes are done to the buffer.
[out] result: Number of bytes copied into the buffer, excluding the null terminator.
Returns napi_ok if the API succeeded. If a non-string napi_value is passed in it returns napi_string_expected.
This API returns the ISO-8859-1-encoded string corresponding the value passed in.
napi_get_value_string_utf8
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_string_utf8(napi_env env,
                                       napi_value value,
                                       char* buf,
                                       size_t bufsize,
                                       size_t* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript string.
[in] buf: Buffer to write the UTF8-encoded string into. If NULL is passed in, the length of the string in bytes and excluding the null terminator is returned in result.
[in] bufsize: Size of the destination buffer. When this value is insufficient, the returned string is truncated and null-terminated. If this value is zero, then the string is not returned and no changes are done to the buffer.
[out] result: Number of bytes copied into the buffer, excluding the null terminator.
Returns napi_ok if the API succeeded. If a non-string napi_value is passed in it returns napi_string_expected.
This API returns the UTF8-encoded string corresponding the value passed in.
napi_get_value_string_utf16
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_string_utf16(napi_env env,
                                        napi_value value,
                                        char16_t* buf,
                                        size_t bufsize,
                                        size_t* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript string.
[in] buf: Buffer to write the UTF16-LE-encoded string into. If NULL is passed in, the length of the string in 2-byte code units and excluding the null terminator is returned.
[in] bufsize: Size of the destination buffer. When this value is insufficient, the returned string is truncated and null-terminated. If this value is zero, then the string is not returned and no changes are done to the buffer.
[out] result: Number of 2-byte code units copied into the buffer, excluding the null terminator.
Returns napi_ok if the API succeeded. If a non-string napi_value is passed in it returns napi_string_expected.
This API returns the UTF16-encoded string corresponding the value passed in.
napi_get_value_uint32
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_value_uint32(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: napi_value representing JavaScript number.
[out] result: C primitive equivalent of the given napi_value as a uint32_t.
Returns napi_ok if the API succeeded. If a non-number napi_value is passed in it returns napi_number_expected.
This API returns the C primitive equivalent of the given napi_value as a uint32_t.
Functions to get global instances
#
napi_get_boolean
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_boolean(napi_env env, bool value, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The value of the boolean to retrieve.
[out] result: napi_value representing JavaScript Boolean singleton to retrieve.
Returns napi_ok if the API succeeded.
This API is used to return the JavaScript singleton object that is used to represent the given boolean value.
napi_get_global
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_global(napi_env env, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[out] result: napi_value representing JavaScript global object.
Returns napi_ok if the API succeeded.
This API returns the global object.
napi_get_null
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_null(napi_env env, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[out] result: napi_value representing JavaScript null object.
Returns napi_ok if the API succeeded.
This API returns the null object.
napi_get_undefined
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_undefined(napi_env env, napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[out] result: napi_value representing JavaScript Undefined value.
Returns napi_ok if the API succeeded.
This API returns the Undefined object.
Working with JavaScript values and abstract operations
#
Node-API exposes a set of APIs to perform some abstract operations on JavaScript values. Some of these operations are documented under Section 7 of the ECMAScript Language Specification.
These APIs support doing one of the following:
Coerce JavaScript values to specific JavaScript types (such as number or string).
Check the type of a JavaScript value.
Check for equality between two JavaScript values.
napi_coerce_to_bool
#
Added in: v8.0.0 N-API version: 1
napi_status napi_coerce_to_bool(napi_env env,
                                napi_value value,
                                napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to coerce.
[out] result: napi_value representing the coerced JavaScript Boolean.
Returns napi_ok if the API succeeded.
This API implements the abstract operation ToBoolean() as defined in Section 7.1.2 of the ECMAScript Language Specification.
napi_coerce_to_number
#
Added in: v8.0.0 N-API version: 1
napi_status napi_coerce_to_number(napi_env env,
                                  napi_value value,
                                  napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to coerce.
[out] result: napi_value representing the coerced JavaScript number.
Returns napi_ok if the API succeeded.
This API implements the abstract operation ToNumber() as defined in Section 7.1.3 of the ECMAScript Language Specification. This function potentially runs JS code if the passed-in value is an object.
napi_coerce_to_object
#
Added in: v8.0.0 N-API version: 1
napi_status napi_coerce_to_object(napi_env env,
                                  napi_value value,
                                  napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to coerce.
[out] result: napi_value representing the coerced JavaScript Object.
Returns napi_ok if the API succeeded.
This API implements the abstract operation ToObject() as defined in Section 7.1.13 of the ECMAScript Language Specification.
napi_coerce_to_string
#
Added in: v8.0.0 N-API version: 1
napi_status napi_coerce_to_string(napi_env env,
                                  napi_value value,
                                  napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to coerce.
[out] result: napi_value representing the coerced JavaScript string.
Returns napi_ok if the API succeeded.
This API implements the abstract operation ToString() as defined in Section 7.1.13 of the ECMAScript Language Specification. This function potentially runs JS code if the passed-in value is an object.
napi_typeof
#
Added in: v8.0.0 N-API version: 1
napi_status napi_typeof(napi_env env, napi_value value, napi_valuetype* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value whose type to query.
[out] result: The type of the JavaScript value.
Returns napi_ok if the API succeeded.
napi_invalid_arg if the type of value is not a known ECMAScript type and value is not an External value.
This API represents behavior similar to invoking the typeof Operator on the object as defined in Section 12.5.5 of the ECMAScript Language Specification. However, there are some differences:
It has support for detecting an External value.
It detects null as a separate type, while ECMAScript typeof would detect object.
If value has a type that is invalid, an error is returned.
napi_instanceof
#
Added in: v8.0.0 N-API version: 1
napi_status napi_instanceof(napi_env env,
                            napi_value object,
                            napi_value constructor,
                            bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] object: The JavaScript value to check.
[in] constructor: The JavaScript function object of the constructor function to check against.
[out] result: Boolean that is set to true if object instanceof constructor is true.
Returns napi_ok if the API succeeded.
This API represents invoking the instanceof Operator on the object as defined in Section 12.10.4 of the ECMAScript Language Specification.
napi_is_array
#
Added in: v8.0.0 N-API version: 1
napi_status napi_is_array(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to check.
[out] result: Whether the given object is an array.
Returns napi_ok if the API succeeded.
This API represents invoking the IsArray operation on the object as defined in Section 7.2.2 of the ECMAScript Language Specification.
napi_is_arraybuffer
#
Added in: v8.0.0 N-API version: 1
napi_status napi_is_arraybuffer(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to check.
[out] result: Whether the given object is an ArrayBuffer.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in is an array buffer.
napi_is_buffer
#
Added in: v8.0.0 N-API version: 1
napi_status napi_is_buffer(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to check.
[out] result: Whether the given napi_value represents a node::Buffer or Uint8Array object.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in is a buffer or Uint8Array. napi_is_typedarray should be preferred if the caller needs to check if the value is a Uint8Array.
napi_is_date
#
Added in: v11.11.0, v10.17.0 N-API version: 5
napi_status napi_is_date(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to check.
[out] result: Whether the given napi_value represents a JavaScript Date object.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in is a date.
napi_is_error
#
Added in: v8.0.0 N-API version: 1
napi_status napi_is_error(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to check.
[out] result: Whether the given napi_value represents an Error object.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in is an Error.
napi_is_typedarray
#
Added in: v8.0.0 N-API version: 1
napi_status napi_is_typedarray(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to check.
[out] result: Whether the given napi_value represents a TypedArray.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in is a typed array.
napi_is_dataview
#
Added in: v8.3.0 N-API version: 1
napi_status napi_is_dataview(napi_env env, napi_value value, bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] value: The JavaScript value to check.
[out] result: Whether the given napi_value represents a DataView.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in is a DataView.
napi_strict_equals
#
Added in: v8.0.0 N-API version: 1
napi_status napi_strict_equals(napi_env env,
                               napi_value lhs,
                               napi_value rhs,
                               bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] lhs: The JavaScript value to check.
[in] rhs: The JavaScript value to check against.
[out] result: Whether the two napi_value objects are equal.
Returns napi_ok if the API succeeded.
This API represents the invocation of the Strict Equality algorithm as defined in Section 7.2.14 of the ECMAScript Language Specification.
napi_detach_arraybuffer
#
Added in: v13.0.0, v12.16.0, v10.22.0 N-API version: 7
napi_status napi_detach_arraybuffer(napi_env env,
                                    napi_value arraybuffer)
copy
[in] env: The environment that the API is invoked under.
[in] arraybuffer: The JavaScript ArrayBuffer to be detached.
Returns napi_ok if the API succeeded. If a non-detachable ArrayBuffer is passed in it returns napi_detachable_arraybuffer_expected.
Generally, an ArrayBuffer is non-detachable if it has been detached before. The engine may impose additional conditions on whether an ArrayBuffer is detachable. For example, V8 requires that the ArrayBuffer be external, that is, created with napi_create_external_arraybuffer.
This API represents the invocation of the ArrayBuffer detach operation as defined in Section 24.1.1.3 of the ECMAScript Language Specification.
napi_is_detached_arraybuffer
#
Added in: v13.3.0, v12.16.0, v10.22.0 N-API version: 7
napi_status napi_is_detached_arraybuffer(napi_env env,
                                         napi_value arraybuffer,
                                         bool* result)
copy
[in] env: The environment that the API is invoked under.
[in] arraybuffer: The JavaScript ArrayBuffer to be checked.
[out] result: Whether the arraybuffer is detached.
Returns napi_ok if the API succeeded.
The ArrayBuffer is considered detached if its internal data is null.
This API represents the invocation of the ArrayBuffer IsDetachedBuffer operation as defined in Section 24.1.1.2 of the ECMAScript Language Specification.
Working with JavaScript properties
#
Node-API exposes a set of APIs to get and set properties on JavaScript objects. Some of these types are documented under Section 7 of the ECMAScript Language Specification.
Properties in JavaScript are represented as a tuple of a key and a value. Fundamentally, all property keys in Node-API can be represented in one of the following forms:
Named: a simple UTF8-encoded string
Integer-Indexed: an index value represented by uint32_t
JavaScript value: these are represented in Node-API by napi_value. This can be a napi_value representing a string, number, or symbol.
Node-API values are represented by the type napi_value. Any Node-API call that requires a JavaScript value takes in a napi_value. However, it's the caller's responsibility to make sure that the napi_value in question is of the JavaScript type expected by the API.
The APIs documented in this section provide a simple interface to get and set properties on arbitrary JavaScript objects represented by napi_value.
For instance, consider the following JavaScript code snippet:
const obj = {};
obj.myProp = 123;
copy
The equivalent can be done using Node-API values with the following snippet:
napi_status status = napi_generic_failure;

// const obj = {}
napi_value obj, value;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Create a napi_value for 123
status = napi_create_int32(env, 123, &value);
if (status != napi_ok) return status;

// obj.myProp = 123
status = napi_set_named_property(env, obj, "myProp", value);
if (status != napi_ok) return status;
copy
Indexed properties can be set in a similar manner. Consider the following JavaScript snippet:
const arr = [];
arr[123] = 'hello';
copy
The equivalent can be done using Node-API values with the following snippet:
napi_status status = napi_generic_failure;

// const arr = [];
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// Create a napi_value for 'hello'
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &value);
if (status != napi_ok) return status;

// arr[123] = 'hello';
status = napi_set_element(env, arr, 123, value);
if (status != napi_ok) return status;
copy
Properties can be retrieved using the APIs described in this section. Consider the following JavaScript snippet:
const arr = [];
const value = arr[123];
copy
The following is the approximate equivalent of the Node-API counterpart:
napi_status status = napi_generic_failure;

// const arr = []
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// const value = arr[123]
status = napi_get_element(env, arr, 123, &value);
if (status != napi_ok) return status;
copy
Finally, multiple properties can also be defined on an object for performance reasons. Consider the following JavaScript:
const obj = {};
Object.defineProperties(obj, {
  'foo': { value: 123, writable: true, configurable: true, enumerable: true },
  'bar': { value: 456, writable: true, configurable: true, enumerable: true },
});
copy
The following is the approximate equivalent of the Node-API counterpart:
napi_status status = napi_status_generic_failure;

// const obj = {};
napi_value obj;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Create napi_values for 123 and 456
napi_value fooValue, barValue;
status = napi_create_int32(env, 123, &fooValue);
if (status != napi_ok) return status;
status = napi_create_int32(env, 456, &barValue);
if (status != napi_ok) return status;

// Set the properties
napi_property_descriptor descriptors[] = {
  { "foo", NULL, NULL, NULL, NULL, fooValue, napi_writable | napi_configurable, NULL },
  { "bar", NULL, NULL, NULL, NULL, barValue, napi_writable | napi_configurable, NULL }
}
status = napi_define_properties(env,
                                obj,
                                sizeof(descriptors) / sizeof(descriptors[0]),
                                descriptors);
if (status != napi_ok) return status;
copy
Structures
#
napi_property_attributes
#
History









typedef enum {
  napi_default = 0,
  napi_writable = 1 << 0,
  napi_enumerable = 1 << 1,
  napi_configurable = 1 << 2,

  // Used with napi_define_class to distinguish static properties
  // from instance properties. Ignored by napi_define_properties.
  napi_static = 1 << 10,

  // Default for class methods.
  napi_default_method = napi_writable | napi_configurable,

  // Default for object properties, like in JS obj[prop].
  napi_default_jsproperty = napi_writable |
                          napi_enumerable |
                          napi_configurable,
} napi_property_attributes;
copy
napi_property_attributes are flags used to control the behavior of properties set on a JavaScript object. Other than napi_static they correspond to the attributes listed in Section 6.1.7.1 of the ECMAScript Language Specification. They can be one or more of the following bitflags:
napi_default: No explicit attributes are set on the property. By default, a property is read only, not enumerable and not configurable.
napi_writable: The property is writable.
napi_enumerable: The property is enumerable.
napi_configurable: The property is configurable as defined in Section 6.1.7.1 of the ECMAScript Language Specification.
napi_static: The property will be defined as a static property on a class as opposed to an instance property, which is the default. This is used only by napi_define_class. It is ignored by napi_define_properties.
napi_default_method: Like a method in a JS class, the property is configurable and writeable, but not enumerable.
napi_default_jsproperty: Like a property set via assignment in JavaScript, the property is writable, enumerable, and configurable.
napi_property_descriptor
#
typedef struct {
  // One of utf8name or name should be NULL.
  const char* utf8name;
  napi_value name;

  napi_callback method;
  napi_callback getter;
  napi_callback setter;
  napi_value value;

  napi_property_attributes attributes;
  void* data;
} napi_property_descriptor;
copy
utf8name: Optional string describing the key for the property, encoded as UTF8. One of utf8name or name must be provided for the property.
name: Optional napi_value that points to a JavaScript string or symbol to be used as the key for the property. One of utf8name or name must be provided for the property.
value: The value that's retrieved by a get access of the property if the property is a data property. If this is passed in, set getter, setter, method and data to NULL (since these members won't be used).
getter: A function to call when a get access of the property is performed. If this is passed in, set value and method to NULL (since these members won't be used). The given function is called implicitly by the runtime when the property is accessed from JavaScript code (or if a get on the property is performed using a Node-API call). napi_callback provides more details.
setter: A function to call when a set access of the property is performed. If this is passed in, set value and method to NULL (since these members won't be used). The given function is called implicitly by the runtime when the property is set from JavaScript code (or if a set on the property is performed using a Node-API call). napi_callback provides more details.
method: Set this to make the property descriptor object's value property to be a JavaScript function represented by method. If this is passed in, set value, getter and setter to NULL (since these members won't be used). napi_callback provides more details.
attributes: The attributes associated with the particular property. See napi_property_attributes.
data: The callback data passed into method, getter and setter if this function is invoked.
Functions
#
napi_get_property_names
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_property_names(napi_env env,
                                    napi_value object,
                                    napi_value* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object from which to retrieve the properties.
[out] result: A napi_value representing an array of JavaScript values that represent the property names of the object. The API can be used to iterate over result using napi_get_array_length and napi_get_element.
Returns napi_ok if the API succeeded.
This API returns the names of the enumerable properties of object as an array of strings. The properties of object whose key is a symbol will not be included.
napi_get_all_property_names
#
Added in: v13.7.0, v12.17.0, v10.20.0 N-API version: 6
napi_get_all_property_names(napi_env env,
                            napi_value object,
                            napi_key_collection_mode key_mode,
                            napi_key_filter key_filter,
                            napi_key_conversion key_conversion,
                            napi_value* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object from which to retrieve the properties.
[in] key_mode: Whether to retrieve prototype properties as well.
[in] key_filter: Which properties to retrieve (enumerable/readable/writable).
[in] key_conversion: Whether to convert numbered property keys to strings.
[out] result: A napi_value representing an array of JavaScript values that represent the property names of the object. napi_get_array_length and napi_get_element can be used to iterate over result.
Returns napi_ok if the API succeeded.
This API returns an array containing the names of the available properties of this object.
napi_set_property
#
Added in: v8.0.0 N-API version: 1
napi_status napi_set_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value value);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object on which to set the property.
[in] key: The name of the property to set.
[in] value: The property value.
Returns napi_ok if the API succeeded.
This API set a property on the Object passed in.
napi_get_property
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object from which to retrieve the property.
[in] key: The name of the property to retrieve.
[out] result: The value of the property.
Returns napi_ok if the API succeeded.
This API gets the requested property from the Object passed in.
napi_has_property
#
Added in: v8.0.0 N-API version: 1
napi_status napi_has_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              bool* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to query.
[in] key: The name of the property whose existence to check.
[out] result: Whether the property exists on the object or not.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in has the named property.
napi_delete_property
#
Added in: v8.2.0 N-API version: 1
napi_status napi_delete_property(napi_env env,
                                 napi_value object,
                                 napi_value key,
                                 bool* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to query.
[in] key: The name of the property to delete.
[out] result: Whether the property deletion succeeded or not. result can optionally be ignored by passing NULL.
Returns napi_ok if the API succeeded.
This API attempts to delete the key own property from object.
napi_has_own_property
#
Added in: v8.2.0 N-API version: 1
napi_status napi_has_own_property(napi_env env,
                                  napi_value object,
                                  napi_value key,
                                  bool* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to query.
[in] key: The name of the own property whose existence to check.
[out] result: Whether the own property exists on the object or not.
Returns napi_ok if the API succeeded.
This API checks if the Object passed in has the named own property. key must be a string or a symbol, or an error will be thrown. Node-API will not perform any conversion between data types.
napi_set_named_property
#
Added in: v8.0.0 N-API version: 1
napi_status napi_set_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value value);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object on which to set the property.
[in] utf8Name: The name of the property to set.
[in] value: The property value.
Returns napi_ok if the API succeeded.
This method is equivalent to calling napi_set_property with a napi_value created from the string passed in as utf8Name.
napi_get_named_property
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object from which to retrieve the property.
[in] utf8Name: The name of the property to get.
[out] result: The value of the property.
Returns napi_ok if the API succeeded.
This method is equivalent to calling napi_get_property with a napi_value created from the string passed in as utf8Name.
napi_has_named_property
#
Added in: v8.0.0 N-API version: 1
napi_status napi_has_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    bool* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to query.
[in] utf8Name: The name of the property whose existence to check.
[out] result: Whether the property exists on the object or not.
Returns napi_ok if the API succeeded.
This method is equivalent to calling napi_has_property with a napi_value created from the string passed in as utf8Name.
napi_set_element
#
Added in: v8.0.0 N-API version: 1
napi_status napi_set_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value value);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object from which to set the properties.
[in] index: The index of the property to set.
[in] value: The property value.
Returns napi_ok if the API succeeded.
This API sets an element on the Object passed in.
napi_get_element
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object from which to retrieve the property.
[in] index: The index of the property to get.
[out] result: The value of the property.
Returns napi_ok if the API succeeded.
This API gets the element at the requested index.
napi_has_element
#
Added in: v8.0.0 N-API version: 1
napi_status napi_has_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             bool* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to query.
[in] index: The index of the property whose existence to check.
[out] result: Whether the property exists on the object or not.
Returns napi_ok if the API succeeded.
This API returns if the Object passed in has an element at the requested index.
napi_delete_element
#
Added in: v8.2.0 N-API version: 1
napi_status napi_delete_element(napi_env env,
                                napi_value object,
                                uint32_t index,
                                bool* result);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to query.
[in] index: The index of the property to delete.
[out] result: Whether the element deletion succeeded or not. result can optionally be ignored by passing NULL.
Returns napi_ok if the API succeeded.
This API attempts to delete the specified index from object.
napi_define_properties
#
Added in: v8.0.0 N-API version: 1
napi_status napi_define_properties(napi_env env,
                                   napi_value object,
                                   size_t property_count,
                                   const napi_property_descriptor* properties);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object from which to retrieve the properties.
[in] property_count: The number of elements in the properties array.
[in] properties: The array of property descriptors.
Returns napi_ok if the API succeeded.
This method allows the efficient definition of multiple properties on a given object. The properties are defined using property descriptors (see napi_property_descriptor). Given an array of such property descriptors, this API will set the properties on the object one at a time, as defined by DefineOwnProperty() (described in Section 9.1.6 of the ECMA-262 specification).
napi_object_freeze
#
Added in: v14.14.0, v12.20.0 N-API version: 8
napi_status napi_object_freeze(napi_env env,
                               napi_value object);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to freeze.
Returns napi_ok if the API succeeded.
This method freezes a given object. This prevents new properties from being added to it, existing properties from being removed, prevents changing the enumerability, configurability, or writability of existing properties, and prevents the values of existing properties from being changed. It also prevents the object's prototype from being changed. This is described in Section 19.1.2.6 of the ECMA-262 specification.
napi_object_seal
#
Added in: v14.14.0, v12.20.0 N-API version: 8
napi_status napi_object_seal(napi_env env,
                             napi_value object);
copy
[in] env: The environment that the Node-API call is invoked under.
[in] object: The object to seal.
Returns napi_ok if the API succeeded.
This method seals a given object. This prevents new properties from being added to it, as well as marking all existing properties as non-configurable. This is described in Section 19.1.2.20 of the ECMA-262 specification.
Working with JavaScript functions
#
Node-API provides a set of APIs that allow JavaScript code to call back into native code. Node-APIs that support calling back into native code take in a callback functions represented by the napi_callback type. When the JavaScript VM calls back to native code, the napi_callback function provided is invoked. The APIs documented in this section allow the callback function to do the following:
Get information about the context in which the callback was invoked.
Get the arguments passed into the callback.
Return a napi_value back from the callback.
Additionally, Node-API provides a set of functions which allow calling JavaScript functions from native code. One can either call a function like a regular JavaScript function call, or as a constructor function.
Any non-NULL data which is passed to this API via the data field of the napi_property_descriptor items can be associated with object and freed whenever object is garbage-collected by passing both object and the data to napi_add_finalizer.
napi_call_function
#
Added in: v8.0.0 N-API version: 1
NAPI_EXTERN napi_status napi_call_function(napi_env env,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] recv: The this value passed to the called function.
[in] func: napi_value representing the JavaScript function to be invoked.
[in] argc: The count of elements in the argv array.
[in] argv: Array of napi_values representing JavaScript values passed in as arguments to the function.
[out] result: napi_value representing the JavaScript object returned.
Returns napi_ok if the API succeeded.
This method allows a JavaScript function object to be called from a native add-on. This is the primary mechanism of calling back from the add-on's native code into JavaScript. For the special case of calling into JavaScript after an async operation, see napi_make_callback.
A sample use case might look as follows. Consider the following JavaScript snippet:
function AddTwo(num) {
  return num + 2;
}
global.AddTwo = AddTwo;
copy
Then, the above function can be invoked from a native add-on using the following code:
// Get the function named "AddTwo" on the global object
napi_value global, add_two, arg;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;

status = napi_get_named_property(env, global, "AddTwo", &add_two);
if (status != napi_ok) return;

// const arg = 1337
status = napi_create_int32(env, 1337, &arg);
if (status != napi_ok) return;

napi_value* argv = &arg;
size_t argc = 1;

// AddTwo(arg);
napi_value return_val;
status = napi_call_function(env, global, add_two, argc, argv, &return_val);
if (status != napi_ok) return;

// Convert the result back to a native type
int32_t result;
status = napi_get_value_int32(env, return_val, &result);
if (status != napi_ok) return;
copy
napi_create_function
#
Added in: v8.0.0 N-API version: 1
napi_status napi_create_function(napi_env env,
                                 const char* utf8name,
                                 size_t length,
                                 napi_callback cb,
                                 void* data,
                                 napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] utf8Name: Optional name of the function encoded as UTF8. This is visible within JavaScript as the new function object's name property.
[in] length: The length of the utf8name in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[in] cb: The native function which should be called when this function object is invoked. napi_callback provides more details.
[in] data: User-provided data context. This will be passed back into the function when invoked later.
[out] result: napi_value representing the JavaScript function object for the newly created function.
Returns napi_ok if the API succeeded.
This API allows an add-on author to create a function object in native code. This is the primary mechanism to allow calling into the add-on's native code from JavaScript.
The newly created function is not automatically visible from script after this call. Instead, a property must be explicitly set on any object that is visible to JavaScript, in order for the function to be accessible from script.
In order to expose a function as part of the add-on's module exports, set the newly created function on the exports object. A sample module might look as follows:
napi_value SayHello(napi_env env, napi_callback_info info) {
  printf("Hello\n");
  return NULL;
}

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;

  napi_value fn;
  status = napi_create_function(env, NULL, 0, SayHello, NULL, &fn);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "sayHello", fn);
  if (status != napi_ok) return NULL;

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
copy
Given the above code, the add-on can be used from JavaScript as follows:
const myaddon = require('./addon');
myaddon.sayHello();
copy
The string passed to require() is the name of the target in binding.gyp responsible for creating the .node file.
Any non-NULL data which is passed to this API via the data parameter can be associated with the resulting JavaScript function (which is returned in the result parameter) and freed whenever the function is garbage-collected by passing both the JavaScript function and the data to napi_add_finalizer.
JavaScript Functions are described in Section 19.2 of the ECMAScript Language Specification.
napi_get_cb_info
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_cb_info(napi_env env,
                             napi_callback_info cbinfo,
                             size_t* argc,
                             napi_value* argv,
                             napi_value* thisArg,
                             void** data)
copy
[in] env: The environment that the API is invoked under.
[in] cbinfo: The callback info passed into the callback function.
[in-out] argc: Specifies the length of the provided argv array and receives the actual count of arguments. argc can optionally be ignored by passing NULL.
[out] argv: C array of napi_values to which the arguments will be copied. If there are more arguments than the provided count, only the requested number of arguments are copied. If there are fewer arguments provided than claimed, the rest of argv is filled with napi_value values that represent undefined. argv can optionally be ignored by passing NULL.
[out] thisArg: Receives the JavaScript this argument for the call. thisArg can optionally be ignored by passing NULL.
[out] data: Receives the data pointer for the callback. data can optionally be ignored by passing NULL.
Returns napi_ok if the API succeeded.
This method is used within a callback function to retrieve details about the call like the arguments and the this pointer from a given callback info.
napi_get_new_target
#
Added in: v8.6.0 N-API version: 1
napi_status napi_get_new_target(napi_env env,
                                napi_callback_info cbinfo,
                                napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] cbinfo: The callback info passed into the callback function.
[out] result: The new.target of the constructor call.
Returns napi_ok if the API succeeded.
This API returns the new.target of the constructor call. If the current callback is not a constructor call, the result is NULL.
napi_new_instance
#
Added in: v8.0.0 N-API version: 1
napi_status napi_new_instance(napi_env env,
                              napi_value cons,
                              size_t argc,
                              napi_value* argv,
                              napi_value* result)
copy
[in] env: The environment that the API is invoked under.
[in] cons: napi_value representing the JavaScript function to be invoked as a constructor.
[in] argc: The count of elements in the argv array.
[in] argv: Array of JavaScript values as napi_value representing the arguments to the constructor. If argc is zero this parameter may be omitted by passing in NULL.
[out] result: napi_value representing the JavaScript object returned, which in this case is the constructed object.
This method is used to instantiate a new JavaScript value using a given napi_value that represents the constructor for the object. For example, consider the following snippet:
function MyObject(param) {
  this.param = param;
}

const arg = 'hello';
const value = new MyObject(arg);
copy
The following can be approximated in Node-API using the following snippet:
// Get the constructor function MyObject
napi_value global, constructor, arg, value;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;

status = napi_get_named_property(env, global, "MyObject", &constructor);
if (status != napi_ok) return;

// const arg = "hello"
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &arg);
if (status != napi_ok) return;

napi_value* argv = &arg;
size_t argc = 1;

// const value = new MyObject(arg)
status = napi_new_instance(env, constructor, argc, argv, &value);
copy
Returns napi_ok if the API succeeded.
Object wrap
#
Node-API offers a way to "wrap" C++ classes and instances so that the class constructor and methods can be called from JavaScript.
The napi_define_class API defines a JavaScript class with constructor, static properties and methods, and instance properties and methods that correspond to the C++ class.
When JavaScript code invokes the constructor, the constructor callback uses napi_wrap to wrap a new C++ instance in a JavaScript object, then returns the wrapper object.
When JavaScript code invokes a method or property accessor on the class, the corresponding napi_callback C++ function is invoked. For an instance callback, napi_unwrap obtains the C++ instance that is the target of the call.
For wrapped objects it may be difficult to distinguish between a function called on a class prototype and a function called on an instance of a class. A common pattern used to address this problem is to save a persistent reference to the class constructor for later instanceof checks.
napi_value MyClass_constructor = NULL;
status = napi_get_reference_value(env, MyClass::es_constructor, &MyClass_constructor);
assert(napi_ok == status);
bool is_instance = false;
status = napi_instanceof(env, es_this, MyClass_constructor, &is_instance);
assert(napi_ok == status);
if (is_instance) {
  // napi_unwrap() ...
} else {
  // otherwise...
}
copy
The reference must be freed once it is no longer needed.
There are occasions where napi_instanceof() is insufficient for ensuring that a JavaScript object is a wrapper for a certain native type. This is the case especially when wrapped JavaScript objects are passed back into the addon via static methods rather than as the this value of prototype methods. In such cases there is a chance that they may be unwrapped incorrectly.
const myAddon = require('./build/Release/my_addon.node');

// `openDatabase()` returns a JavaScript object that wraps a native database
// handle.
const dbHandle = myAddon.openDatabase();

// `query()` returns a JavaScript object that wraps a native query handle.
const queryHandle = myAddon.query(dbHandle, 'Gimme ALL the things!');

// There is an accidental error in the line below. The first parameter to
// `myAddon.queryHasRecords()` should be the database handle (`dbHandle`), not
// the query handle (`query`), so the correct condition for the while-loop
// should be
//
// myAddon.queryHasRecords(dbHandle, queryHandle)
//
while (myAddon.queryHasRecords(queryHandle, dbHandle)) {
  // retrieve records
}
copy
In the above example myAddon.queryHasRecords() is a method that accepts two arguments. The first is a database handle and the second is a query handle. Internally, it unwraps the first argument and casts the resulting pointer to a native database handle. It then unwraps the second argument and casts the resulting pointer to a query handle. If the arguments are passed in the wrong order, the casts will work, however, there is a good chance that the underlying database operation will fail, or will even cause an invalid memory access.
To ensure that the pointer retrieved from the first argument is indeed a pointer to a database handle and, similarly, that the pointer retrieved from the second argument is indeed a pointer to a query handle, the implementation of queryHasRecords() has to perform a type validation. Retaining the JavaScript class constructor from which the database handle was instantiated and the constructor from which the query handle was instantiated in napi_refs can help, because napi_instanceof() can then be used to ensure that the instances passed into queryHashRecords() are indeed of the correct type.
Unfortunately, napi_instanceof() does not protect against prototype manipulation. For example, the prototype of the database handle instance can be set to the prototype of the constructor for query handle instances. In this case, the database handle instance can appear as a query handle instance, and it will pass the napi_instanceof() test for a query handle instance, while still containing a pointer to a database handle.
To this end, Node-API provides type-tagging capabilities.
A type tag is a 128-bit integer unique to the addon. Node-API provides the napi_type_tag structure for storing a type tag. When such a value is passed along with a JavaScript object or external stored in a napi_value to napi_type_tag_object(), the JavaScript object will be "marked" with the type tag. The "mark" is invisible on the JavaScript side. When a JavaScript object arrives into a native binding, napi_check_object_type_tag() can be used along with the original type tag to determine whether the JavaScript object was previously "marked" with the type tag. This creates a type-checking capability of a higher fidelity than napi_instanceof() can provide, because such type- tagging survives prototype manipulation and addon unloading/reloading.
Continuing the above example, the following skeleton addon implementation illustrates the use of napi_type_tag_object() and napi_check_object_type_tag().
// This value is the type tag for a database handle. The command
//
//   uuidgen | sed -r -e 's/-//g' -e 's/(.{16})(.*)/0x\1, 0x\2/'
//
// can be used to obtain the two values with which to initialize the structure.
static const napi_type_tag DatabaseHandleTypeTag = {
  0x1edf75a38336451d, 0xa5ed9ce2e4c00c38
};

// This value is the type tag for a query handle.
static const napi_type_tag QueryHandleTypeTag = {
  0x9c73317f9fad44a3, 0x93c3920bf3b0ad6a
};

static napi_value
openDatabase(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value result;

  // Perform the underlying action which results in a database handle.
  DatabaseHandle* dbHandle = open_database();

  // Create a new, empty JS object.
  status = napi_create_object(env, &result);
  if (status != napi_ok) return NULL;

  // Tag the object to indicate that it holds a pointer to a `DatabaseHandle`.
  status = napi_type_tag_object(env, result, &DatabaseHandleTypeTag);
  if (status != napi_ok) return NULL;

  // Store the pointer to the `DatabaseHandle` structure inside the JS object.
  status = napi_wrap(env, result, dbHandle, NULL, NULL, NULL);
  if (status != napi_ok) return NULL;

  return result;
}

// Later when we receive a JavaScript object purporting to be a database handle
// we can use `napi_check_object_type_tag()` to ensure that it is indeed such a
// handle.

static napi_value
query(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value argv[2];
  bool is_db_handle;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  if (status != napi_ok) return NULL;

  // Check that the object passed as the first parameter has the previously
  // applied tag.
  status = napi_check_object_type_tag(env,
                                      argv[0],
                                      &DatabaseHandleTypeTag,
                                      &is_db_handle);
  if (status != napi_ok) return NULL;

  // Throw a `TypeError` if it doesn't.
  if (!is_db_handle) {
    // Throw a TypeError.
    return NULL;
  }
}
copy
napi_define_class
#
Added in: v8.0.0 N-API version: 1
napi_status napi_define_class(napi_env env,
                              const char* utf8name,
                              size_t length,
                              napi_callback constructor,
                              void* data,
                              size_t property_count,
                              const napi_property_descriptor* properties,
                              napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] utf8name: Name of the JavaScript constructor function. For clarity, it is recommended to use the C++ class name when wrapping a C++ class.
[in] length: The length of the utf8name in bytes, or NAPI_AUTO_LENGTH if it is null-terminated.
[in] constructor: Callback function that handles constructing instances of the class. When wrapping a C++ class, this method must be a static member with the napi_callback signature. A C++ class constructor cannot be used. napi_callback provides more details.
[in] data: Optional data to be passed to the constructor callback as the data property of the callback info.
[in] property_count: Number of items in the properties array argument.
[in] properties: Array of property descriptors describing static and instance data properties, accessors, and methods on the class See napi_property_descriptor.
[out] result: A napi_value representing the constructor function for the class.
Returns napi_ok if the API succeeded.
Defines a JavaScript class, including:
A JavaScript constructor function that has the class name. When wrapping a corresponding C++ class, the callback passed via constructor can be used to instantiate a new C++ class instance, which can then be placed inside the JavaScript object instance being constructed using napi_wrap.
Properties on the constructor function whose implementation can call corresponding static data properties, accessors, and methods of the C++ class (defined by property descriptors with the napi_static attribute).
Properties on the constructor function's prototype object. When wrapping a C++ class, non-static data properties, accessors, and methods of the C++ class can be called from the static functions given in the property descriptors without the napi_static attribute after retrieving the C++ class instance placed inside the JavaScript object instance by using napi_unwrap.
When wrapping a C++ class, the C++ constructor callback passed via constructor should be a static method on the class that calls the actual class constructor, then wraps the new C++ instance in a JavaScript object, and returns the wrapper object. See napi_wrap for details.
The JavaScript constructor function returned from napi_define_class is often saved and used later to construct new instances of the class from native code, and/or to check whether provided values are instances of the class. In that case, to prevent the function value from being garbage-collected, a strong persistent reference to it can be created using napi_create_reference, ensuring that the reference count is kept >= 1.
Any non-NULL data which is passed to this API via the data parameter or via the data field of the napi_property_descriptor array items can be associated with the resulting JavaScript constructor (which is returned in the result parameter) and freed whenever the class is garbage-collected by passing both the JavaScript function and the data to napi_add_finalizer.
napi_wrap
#
Added in: v8.0.0 N-API version: 1
napi_status napi_wrap(napi_env env,
                      napi_value js_object,
                      void* native_object,
                      napi_finalize finalize_cb,
                      void* finalize_hint,
                      napi_ref* result);
copy
[in] env: The environment that the API is invoked under.
[in] js_object: The JavaScript object that will be the wrapper for the native object.
[in] native_object: The native instance that will be wrapped in the JavaScript object.
[in] finalize_cb: Optional native callback that can be used to free the native instance when the JavaScript object has been garbage-collected. napi_finalize provides more details.
[in] finalize_hint: Optional contextual hint that is passed to the finalize callback.
[out] result: Optional reference to the wrapped object.
Returns napi_ok if the API succeeded.
Wraps a native instance in a JavaScript object. The native instance can be retrieved later using napi_unwrap().
When JavaScript code invokes a constructor for a class that was defined using napi_define_class(), the napi_callback for the constructor is invoked. After constructing an instance of the native class, the callback must then call napi_wrap() to wrap the newly constructed instance in the already-created JavaScript object that is the this argument to the constructor callback. (That this object was created from the constructor function's prototype, so it already has definitions of all the instance properties and methods.)
Typically when wrapping a class instance, a finalize callback should be provided that simply deletes the native instance that is received as the data argument to the finalize callback.
The optional returned reference is initially a weak reference, meaning it has a reference count of 0. Typically this reference count would be incremented temporarily during async operations that require the instance to remain valid.
Caution: The optional returned reference (if obtained) should be deleted via napi_delete_reference ONLY in response to the finalize callback invocation. If it is deleted before then, then the finalize callback may never be invoked. Therefore, when obtaining a reference a finalize callback is also required in order to enable correct disposal of the reference.
Finalizer callbacks may be deferred, leaving a window where the object has been garbage collected (and the weak reference is invalid) but the finalizer hasn't been called yet. When using napi_get_reference_value() on weak references returned by napi_wrap(), you should still handle an empty result.
Calling napi_wrap() a second time on an object will return an error. To associate another native instance with the object, use napi_remove_wrap() first.
napi_unwrap
#
Added in: v8.0.0 N-API version: 1
napi_status napi_unwrap(napi_env env,
                        napi_value js_object,
                        void** result);
copy
[in] env: The environment that the API is invoked under.
[in] js_object: The object associated with the native instance.
[out] result: Pointer to the wrapped native instance.
Returns napi_ok if the API succeeded.
Retrieves a native instance that was previously wrapped in a JavaScript object using napi_wrap().
When JavaScript code invokes a method or property accessor on the class, the corresponding napi_callback is invoked. If the callback is for an instance method or accessor, then the this argument to the callback is the wrapper object; the wrapped C++ instance that is the target of the call can be obtained then by calling napi_unwrap() on the wrapper object.
napi_remove_wrap
#
Added in: v8.5.0 N-API version: 1
napi_status napi_remove_wrap(napi_env env,
                             napi_value js_object,
                             void** result);
copy
[in] env: The environment that the API is invoked under.
[in] js_object: The object associated with the native instance.
[out] result: Pointer to the wrapped native instance.
Returns napi_ok if the API succeeded.
Retrieves a native instance that was previously wrapped in the JavaScript object js_object using napi_wrap() and removes the wrapping. If a finalize callback was associated with the wrapping, it will no longer be called when the JavaScript object becomes garbage-collected.
napi_type_tag_object
#
Added in: v14.8.0, v12.19.0 N-API version: 8
napi_status napi_type_tag_object(napi_env env,
                                 napi_value js_object,
                                 const napi_type_tag* type_tag);
copy
[in] env: The environment that the API is invoked under.
[in] js_object: The JavaScript object or external to be marked.
[in] type_tag: The tag with which the object is to be marked.
Returns napi_ok if the API succeeded.
Associates the value of the type_tag pointer with the JavaScript object or external. napi_check_object_type_tag() can then be used to compare the tag that was attached to the object with one owned by the addon to ensure that the object has the right type.
If the object already has an associated type tag, this API will return napi_invalid_arg.
napi_check_object_type_tag
#
Added in: v14.8.0, v12.19.0 N-API version: 8
napi_status napi_check_object_type_tag(napi_env env,
                                       napi_value js_object,
                                       const napi_type_tag* type_tag,
                                       bool* result);
copy
[in] env: The environment that the API is invoked under.
[in] js_object: The JavaScript object or external whose type tag to examine.
[in] type_tag: The tag with which to compare any tag found on the object.
[out] result: Whether the type tag given matched the type tag on the object. false is also returned if no type tag was found on the object.
Returns napi_ok if the API succeeded.
Compares the pointer given as type_tag with any that can be found on js_object. If no tag is found on js_object or, if a tag is found but it does not match type_tag, then result is set to false. If a tag is found and it matches type_tag, then result is set to true.
napi_add_finalizer
#
Added in: v8.0.0 N-API version: 5
napi_status napi_add_finalizer(napi_env env,
                               napi_value js_object,
                               void* finalize_data,
                               node_api_basic_finalize finalize_cb,
                               void* finalize_hint,
                               napi_ref* result);
copy
[in] env: The environment that the API is invoked under.
[in] js_object: The JavaScript object to which the native data will be attached.
[in] finalize_data: Optional data to be passed to finalize_cb.
[in] finalize_cb: Native callback that will be used to free the native data when the JavaScript object has been garbage-collected. napi_finalize provides more details.
[in] finalize_hint: Optional contextual hint that is passed to the finalize callback.
[out] result: Optional reference to the JavaScript object.
Returns napi_ok if the API succeeded.
Adds a napi_finalize callback which will be called when the JavaScript object in js_object has been garbage-collected.
This API can be called multiple times on a single JavaScript object.
Caution: The optional returned reference (if obtained) should be deleted via napi_delete_reference ONLY in response to the finalize callback invocation. If it is deleted before then, then the finalize callback may never be invoked. Therefore, when obtaining a reference a finalize callback is also required in order to enable correct disposal of the reference.
node_api_post_finalizer
#
Added in: v21.0.0, v20.10.0, v18.19.0
Stability: 1 - Experimental
napi_status node_api_post_finalizer(node_api_basic_env env,
                                    napi_finalize finalize_cb,
                                    void* finalize_data,
                                    void* finalize_hint);
copy
[in] env: The environment that the API is invoked under.
[in] finalize_cb: Native callback that will be used to free the native data when the JavaScript object has been garbage-collected. napi_finalize provides more details.
[in] finalize_data: Optional data to be passed to finalize_cb.
[in] finalize_hint: Optional contextual hint that is passed to the finalize callback.
Returns napi_ok if the API succeeded.
Schedules a napi_finalize callback to be called asynchronously in the event loop.
Normally, finalizers are called while the GC (garbage collector) collects objects. At that point calling any Node-API that may cause changes in the GC state will be disabled and will crash Node.js.
node_api_post_finalizer helps to work around this limitation by allowing the add-on to defer calls to such Node-APIs to a point in time outside of the GC finalization.
Simple asynchronous operations
#
Addon modules often need to leverage async helpers from libuv as part of their implementation. This allows them to schedule work to be executed asynchronously so that their methods can return in advance of the work being completed. This allows them to avoid blocking overall execution of the Node.js application.
Node-API provides an ABI-stable interface for these supporting functions which covers the most common asynchronous use cases.
Node-API defines the napi_async_work structure which is used to manage asynchronous workers. Instances are created/deleted with napi_create_async_work and napi_delete_async_work.
The execute and complete callbacks are functions that will be invoked when the executor is ready to execute and when it completes its task respectively.
The execute function should avoid making any Node-API calls that could result in the execution of JavaScript or interaction with JavaScript objects. Most often, any code that needs to make Node-API calls should be made in complete callback instead. Avoid using the napi_env parameter in the execute callback as it will likely execute JavaScript.
These functions implement the following interfaces:
typedef void (*napi_async_execute_callback)(napi_env env,
                                            void* data);
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
copy
When these methods are invoked, the data parameter passed will be the addon-provided void* data that was passed into the napi_create_async_work call.
Once created the async worker can be queued for execution using the napi_queue_async_work function:
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
copy
napi_cancel_async_work can be used if the work needs to be cancelled before the work has started execution.
After calling napi_cancel_async_work, the complete callback will be invoked with a status value of napi_cancelled. The work should not be deleted before the complete callback invocation, even when it was cancelled.
napi_create_async_work
#
History













N-API version: 1
napi_status napi_create_async_work(napi_env env,
                                   napi_value async_resource,
                                   napi_value async_resource_name,
                                   napi_async_execute_callback execute,
                                   napi_async_complete_callback complete,
                                   void* data,
                                   napi_async_work* result);
copy
[in] env: The environment that the API is invoked under.
[in] async_resource: An optional object associated with the async work that will be passed to possible async_hooks init hooks.
[in] async_resource_name: Identifier for the kind of resource that is being provided for diagnostic information exposed by the async_hooks API.
[in] execute: The native function which should be called to execute the logic asynchronously. The given function is called from a worker pool thread and can execute in parallel with the main event loop thread.
[in] complete: The native function which will be called when the asynchronous logic is completed or is cancelled. The given function is called from the main event loop thread. napi_async_complete_callback provides more details.
[in] data: User-provided data context. This will be passed back into the execute and complete functions.
[out] result: napi_async_work* which is the handle to the newly created async work.
Returns napi_ok if the API succeeded.
This API allocates a work object that is used to execute logic asynchronously. It should be freed using napi_delete_async_work once the work is no longer required.
async_resource_name should be a null-terminated, UTF-8-encoded string.
The async_resource_name identifier is provided by the user and should be representative of the type of async work being performed. It is also recommended to apply namespacing to the identifier, e.g. by including the module name. See the async_hooks documentation for more information.
napi_delete_async_work
#
Added in: v8.0.0 N-API version: 1
napi_status napi_delete_async_work(napi_env env,
                                   napi_async_work work);
copy
[in] env: The environment that the API is invoked under.
[in] work: The handle returned by the call to napi_create_async_work.
Returns napi_ok if the API succeeded.
This API frees a previously allocated work object.
This API can be called even if there is a pending JavaScript exception.
napi_queue_async_work
#
Added in: v8.0.0 N-API version: 1
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
copy
[in] env: The environment that the API is invoked under.
[in] work: The handle returned by the call to napi_create_async_work.
Returns napi_ok if the API succeeded.
This API requests that the previously allocated work be scheduled for execution. Once it returns successfully, this API must not be called again with the same napi_async_work item or the result will be undefined.
napi_cancel_async_work
#
Added in: v8.0.0 N-API version: 1
napi_status napi_cancel_async_work(node_api_basic_env env,
                                   napi_async_work work);
copy
[in] env: The environment that the API is invoked under.
[in] work: The handle returned by the call to napi_create_async_work.
Returns napi_ok if the API succeeded.
This API cancels queued work if it has not yet been started. If it has already started executing, it cannot be cancelled and napi_generic_failure will be returned. If successful, the complete callback will be invoked with a status value of napi_cancelled. The work should not be deleted before the complete callback invocation, even if it has been successfully cancelled.
This API can be called even if there is a pending JavaScript exception.
Custom asynchronous operations
#
The simple asynchronous work APIs above may not be appropriate for every scenario. When using any other asynchronous mechanism, the following APIs are necessary to ensure an asynchronous operation is properly tracked by the runtime.
napi_async_init
#
Added in: v8.6.0 N-API version: 1
napi_status napi_async_init(napi_env env,
                            napi_value async_resource,
                            napi_value async_resource_name,
                            napi_async_context* result)
copy
[in] env: The environment that the API is invoked under.
[in] async_resource: Object associated with the async work that will be passed to possible async_hooks init hooks and can be accessed by async_hooks.executionAsyncResource().
[in] async_resource_name: Identifier for the kind of resource that is being provided for diagnostic information exposed by the async_hooks API.
[out] result: The initialized async context.
Returns napi_ok if the API succeeded.
The async_resource object needs to be kept alive until napi_async_destroy to keep async_hooks related API acts correctly. In order to retain ABI compatibility with previous versions, napi_async_contexts are not maintaining the strong reference to the async_resource objects to avoid introducing causing memory leaks. However, if the async_resource is garbage collected by JavaScript engine before the napi_async_context was destroyed by napi_async_destroy, calling napi_async_context related APIs like napi_open_callback_scope and napi_make_callback can cause problems like loss of async context when using the AsyncLocalStorage API.
In order to retain ABI compatibility with previous versions, passing NULL for async_resource does not result in an error. However, this is not recommended as this will result in undesirable behavior with async_hooks init hooks and async_hooks.executionAsyncResource() as the resource is now required by the underlying async_hooks implementation in order to provide the linkage between async callbacks.
napi_async_destroy
#
Added in: v8.6.0 N-API version: 1
napi_status napi_async_destroy(napi_env env,
                               napi_async_context async_context);
copy
[in] env: The environment that the API is invoked under.
[in] async_context: The async context to be destroyed.
Returns napi_ok if the API succeeded.
This API can be called even if there is a pending JavaScript exception.
napi_make_callback
#
History













N-API version: 1
NAPI_EXTERN napi_status napi_make_callback(napi_env env,
                                           napi_async_context async_context,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] async_context: Context for the async operation that is invoking the callback. This should normally be a value previously obtained from napi_async_init. In order to retain ABI compatibility with previous versions, passing NULL for async_context does not result in an error. However, this results in incorrect operation of async hooks. Potential issues include loss of async context when using the AsyncLocalStorage API.
[in] recv: The this value passed to the called function.
[in] func: napi_value representing the JavaScript function to be invoked.
[in] argc: The count of elements in the argv array.
[in] argv: Array of JavaScript values as napi_value representing the arguments to the function. If argc is zero this parameter may be omitted by passing in NULL.
[out] result: napi_value representing the JavaScript object returned.
Returns napi_ok if the API succeeded.
This method allows a JavaScript function object to be called from a native add-on. This API is similar to napi_call_function. However, it is used to call from native code back into JavaScript after returning from an async operation (when there is no other script on the stack). It is a fairly simple wrapper around node::MakeCallback.
Note it is not necessary to use napi_make_callback from within a napi_async_complete_callback; in that situation the callback's async context has already been set up, so a direct call to napi_call_function is sufficient and appropriate. Use of the napi_make_callback function may be required when implementing custom async behavior that does not use napi_create_async_work.
Any process.nextTicks or Promises scheduled on the microtask queue by JavaScript during the callback are ran before returning back to C/C++.
napi_open_callback_scope
#
Added in: v9.6.0 N-API version: 3
NAPI_EXTERN napi_status napi_open_callback_scope(napi_env env,
                                                 napi_value resource_object,
                                                 napi_async_context context,
                                                 napi_callback_scope* result)
copy
[in] env: The environment that the API is invoked under.
[in] resource_object: An object associated with the async work that will be passed to possible async_hooks init hooks. This parameter has been deprecated and is ignored at runtime. Use the async_resource parameter in napi_async_init instead.
[in] context: Context for the async operation that is invoking the callback. This should be a value previously obtained from napi_async_init.
[out] result: The newly created scope.
There are cases (for example, resolving promises) where it is necessary to have the equivalent of the scope associated with a callback in place when making certain Node-API calls. If there is no other script on the stack the napi_open_callback_scope and napi_close_callback_scope functions can be used to open/close the required scope.
napi_close_callback_scope
#
Added in: v9.6.0 N-API version: 3
NAPI_EXTERN napi_status napi_close_callback_scope(napi_env env,
                                                  napi_callback_scope scope)
copy
[in] env: The environment that the API is invoked under.
[in] scope: The scope to be closed.
This API can be called even if there is a pending JavaScript exception.
Version management
#
napi_get_node_version
#
Added in: v8.4.0 N-API version: 1
typedef struct {
  uint32_t major;
  uint32_t minor;
  uint32_t patch;
  const char* release;
} napi_node_version;

napi_status napi_get_node_version(node_api_basic_env env,
                                  const napi_node_version** version);
copy
[in] env: The environment that the API is invoked under.
[out] version: A pointer to version information for Node.js itself.
Returns napi_ok if the API succeeded.
This function fills the version struct with the major, minor, and patch version of Node.js that is currently running, and the release field with the value of process.release.name.
The returned buffer is statically allocated and does not need to be freed.
napi_get_version
#
Added in: v8.0.0 N-API version: 1
napi_status napi_get_version(node_api_basic_env env,
                             uint32_t* result);
copy
[in] env: The environment that the API is invoked under.
[out] result: The highest version of Node-API supported.
Returns napi_ok if the API succeeded.
This API returns the highest Node-API version supported by the Node.js runtime. Node-API is planned to be additive such that newer releases of Node.js may support additional API functions. In order to allow an addon to use a newer function when running with versions of Node.js that support it, while providing fallback behavior when running with Node.js versions that don't support it:
Call napi_get_version() to determine if the API is available.
If available, dynamically load a pointer to the function using uv_dlsym().
Use the dynamically loaded pointer to invoke the function.
If the function is not available, provide an alternate implementation that does not use the function.
Memory management
#
napi_adjust_external_memory
#
Added in: v8.5.0 N-API version: 1
NAPI_EXTERN napi_status napi_adjust_external_memory(node_api_basic_env env,
                                                    int64_t change_in_bytes,
                                                    int64_t* result);
copy
[in] env: The environment that the API is invoked under.
[in] change_in_bytes: The change in externally allocated memory that is kept alive by JavaScript objects.
[out] result: The adjusted value. This value should reflect the total amount of external memory with the given change_in_bytes included. The absolute value of the returned value should not be depended on. For example, implementations may use a single counter for all addons, or a counter for each addon.
Returns napi_ok if the API succeeded.
This function gives the runtime an indication of the amount of externally allocated memory that is kept alive by JavaScript objects (i.e. a JavaScript object that points to its own memory allocated by a native addon). Registering externally allocated memory may, but is not guaranteed to, trigger global garbage collections more often than it would otherwise.
This function is expected to be called in a manner such that an addon does not decrease the external memory more than it has increased the external memory.
Promises
#
Node-API provides facilities for creating Promise objects as described in Section 25.4 of the ECMA specification. It implements promises as a pair of objects. When a promise is created by napi_create_promise(), a "deferred" object is created and returned alongside the Promise. The deferred object is bound to the created Promise and is the only means to resolve or reject the Promise using napi_resolve_deferred() or napi_reject_deferred(). The deferred object that is created by napi_create_promise() is freed by napi_resolve_deferred() or napi_reject_deferred(). The Promise object may be returned to JavaScript where it can be used in the usual fashion.
For example, to create a promise and pass it to an asynchronous worker:
napi_deferred deferred;
napi_value promise;
napi_status status;

// Create the promise.
status = napi_create_promise(env, &deferred, &promise);
if (status != napi_ok) return NULL;

// Pass the deferred to a function that performs an asynchronous action.
do_something_asynchronous(deferred);

// Return the promise to JS
return promise;
copy
The above function do_something_asynchronous() would perform its asynchronous action and then it would resolve or reject the deferred, thereby concluding the promise and freeing the deferred:
napi_deferred deferred;
napi_value undefined;
napi_status status;

// Create a value with which to conclude the deferred.
status = napi_get_undefined(env, &undefined);
if (status != napi_ok) return NULL;

// Resolve or reject the promise associated with the deferred depending on
// whether the asynchronous action succeeded.
if (asynchronous_action_succeeded) {
  status = napi_resolve_deferred(env, deferred, undefined);
} else {
  status = napi_reject_deferred(env, deferred, undefined);
}
if (status != napi_ok) return NULL;

// At this point the deferred has been freed, so we should assign NULL to it.
deferred = NULL;
copy
napi_create_promise
#
Added in: v8.5.0 N-API version: 1
napi_status napi_create_promise(napi_env env,
                                napi_deferred* deferred,
                                napi_value* promise);
copy
[in] env: The environment that the API is invoked under.
[out] deferred: A newly created deferred object which can later be passed to napi_resolve_deferred() or napi_reject_deferred() to resolve resp. reject the associated promise.
[out] promise: The JavaScript promise associated with the deferred object.
Returns napi_ok if the API succeeded.
This API creates a deferred object and a JavaScript promise.
napi_resolve_deferred
#
Added in: v8.5.0 N-API version: 1
napi_status napi_resolve_deferred(napi_env env,
                                  napi_deferred deferred,
                                  napi_value resolution);
copy
[in] env: The environment that the API is invoked under.
[in] deferred: The deferred object whose associated promise to resolve.
[in] resolution: The value with which to resolve the promise.
This API resolves a JavaScript promise by way of the deferred object with which it is associated. Thus, it can only be used to resolve JavaScript promises for which the corresponding deferred object is available. This effectively means that the promise must have been created using napi_create_promise() and the deferred object returned from that call must have been retained in order to be passed to this API.
The deferred object is freed upon successful completion.
napi_reject_deferred
#
Added in: v8.5.0 N-API version: 1
napi_status napi_reject_deferred(napi_env env,
                                 napi_deferred deferred,
                                 napi_value rejection);
copy
[in] env: The environment that the API is invoked under.
[in] deferred: The deferred object whose associated promise to resolve.
[in] rejection: The value with which to reject the promise.
This API rejects a JavaScript promise by way of the deferred object with which it is associated. Thus, it can only be used to reject JavaScript promises for which the corresponding deferred object is available. This effectively means that the promise must have been created using napi_create_promise() and the deferred object returned from that call must have been retained in order to be passed to this API.
The deferred object is freed upon successful completion.
napi_is_promise
#
Added in: v8.5.0 N-API version: 1
napi_status napi_is_promise(napi_env env,
                            napi_value value,
                            bool* is_promise);
copy
[in] env: The environment that the API is invoked under.
[in] value: The value to examine
[out] is_promise: Flag indicating whether promise is a native promise object (that is, a promise object created by the underlying engine).
Script execution
#
Node-API provides an API for executing a string containing JavaScript using the underlying JavaScript engine.
napi_run_script
#
Added in: v8.5.0 N-API version: 1
NAPI_EXTERN napi_status napi_run_script(napi_env env,
                                        napi_value script,
                                        napi_value* result);
copy
[in] env: The environment that the API is invoked under.
[in] script: A JavaScript string containing the script to execute.
[out] result: The value resulting from having executed the script.
This function executes a string of JavaScript code and returns its result with the following caveats:
Unlike eval, this function does not allow the script to access the current lexical scope, and therefore also does not allow to access the module scope, meaning that pseudo-globals such as require will not be available.
The script can access the global scope. Function and var declara	Dtions in the script will be added to the global object. Variable declarations made using let and const will be visible globally, but will not be added to the global object.
The value of this is global within the script.
libuv event loop
#
Node-API provides a function for getting the current event loop associated with a specific napi_env.
napi_get_uv_event_loop
#
Added in: v9.3.0, v8.10.0 N-API version: 2
NAPI_EXTERN napi_status napi_get_uv_event_loop(node_api_basic_env env,
                                               struct uv_loop_s** loop);
copy
[in] env: The environment that the API is invoked under.
[out] loop: The current libuv loop instance.
Note: While libuv has been relatively stable over time, it does not provide an ABI stability guarantee. Use of this function should be avoided. Its use may result in an addon that does not work across Node.js versions. asynchronous-thread-safe-function-calls are an alternative for many use cases.
Asynchronous thread-safe function calls
#
JavaScript functions can normally only be called from a native addon's main thread. If an addon creates additional threads, then Node-API functions that require a napi_env, napi_value, or napi_ref must not be called from those threads.
When an addon has additional threads and JavaScript functions need to be invoked based on the processing completed by those threads, those threads must communicate with the addon's main thread so that the main thread can invoke the JavaScript function on their behalf. The thread-safe function APIs provide an easy way to do this.
These APIs provide the type napi_threadsafe_function as well as APIs to create, destroy, and call objects of this type. napi_create_threadsafe_function() creates a persistent reference to a napi_value that holds a JavaScript function which can be called from multiple threads. The calls happen asynchronously. This means that values with which the JavaScript callback is to be called will be placed in a queue, and, for each value in the queue, a call will eventually be made to the JavaScript function.
Upon creation of a napi_threadsafe_function a napi_finalize callback can be provided. This callback will be invoked on the main thread when the thread-safe function is about to be destroyed. It receives the context and the finalize data given during construction, and provides an opportunity for cleaning up after the threads e.g. by calling uv_thread_join(). Aside from the main loop thread, no threads should be using the thread-safe function after the finalize callback completes.
The context given during the call to napi_create_threadsafe_function() can be retrieved from any thread with a call to napi_get_threadsafe_function_context().
Calling a thread-safe function
#
napi_call_threadsafe_function() can be used for initiating a call into JavaScript. napi_call_threadsafe_function() accepts a parameter which controls whether the API behaves blockingly. If set to napi_tsfn_nonblocking, the API behaves non-blockingly, returning napi_queue_full if the queue was full, preventing data from being successfully added to the queue. If set to napi_tsfn_blocking, the API blocks until space becomes available in the queue. napi_call_threadsafe_function() never blocks if the thread-safe function was created with a maximum queue size of 0.
napi_call_threadsafe_function() should not be called with napi_tsfn_blocking from a JavaScript thread, because, if the queue is full, it may cause the JavaScript thread to deadlock.
The actual call into JavaScript is controlled by the callback given via the call_js_cb parameter. call_js_cb is invoked on the main thread once for each value that was placed into the queue by a successful call to napi_call_threadsafe_function(). If such a callback is not given, a default callback will be used, and the resulting JavaScript call will have no arguments. The call_js_cb callback receives the JavaScript function to call as a napi_value in its parameters, as well as the void* context pointer used when creating the napi_threadsafe_function, and the next data pointer that was created by one of the secondary threads. The callback can then use an API such as napi_call_function() to call into JavaScript.
The callback may also be invoked with env and call_js_cb both set to NULL to indicate that calls into JavaScript are no longer possible, while items remain in the queue that may need to be freed. This normally occurs when the Node.js process exits while there is a thread-safe function still active.
It is not necessary to call into JavaScript via napi_make_callback() because Node-API runs call_js_cb in a context appropriate for callbacks.
Zero or more queued items may be invoked in each tick of the event loop. Applications should not depend on a specific behavior other than progress in invoking callbacks will be made and events will be invoked as time moves forward.
Reference counting of thread-safe functions
#
Threads can be added to and removed from a napi_threadsafe_function object during its existence. Thus, in addition to specifying an initial number of threads upon creation, napi_acquire_threadsafe_function can be called to indicate that a new thread will start making use of the thread-safe function. Similarly, napi_release_threadsafe_function can be called to indicate that an existing thread will stop making use of the thread-safe function.
napi_threadsafe_function objects are destroyed when every thread which uses the object has called napi_release_threadsafe_function() or has received a return status of napi_closing in response to a call to napi_call_threadsafe_function. The queue is emptied before the napi_threadsafe_function is destroyed. napi_release_threadsafe_function() should be the last API call made in conjunction with a given napi_threadsafe_function, because after the call completes, there is no guarantee that the napi_threadsafe_function is still allocated. For the same reason, do not use a thread-safe function after receiving a return value of napi_closing in response to a call to napi_call_threadsafe_function. Data associated with the napi_threadsafe_function can be freed in its napi_finalize callback which was passed to napi_create_threadsafe_function(). The parameter initial_thread_count of napi_create_threadsafe_function marks the initial number of acquisitions of the thread-safe functions, instead of calling napi_acquire_threadsafe_function multiple times at creation.
Once the number of threads making use of a napi_threadsafe_function reaches zero, no further threads can start making use of it by calling napi_acquire_threadsafe_function(). In fact, all subsequent API calls associated with it, except napi_release_threadsafe_function(), will return an error value of napi_closing.
The thread-safe function can be "aborted" by giving a value of napi_tsfn_abort to napi_release_threadsafe_function(). This will cause all subsequent APIs associated with the thread-safe function except napi_release_threadsafe_function() to return napi_closing even before its reference count reaches zero. In particular, napi_call_threadsafe_function() will return napi_closing, thus informing the threads that it is no longer possible to make asynchronous calls to the thread-safe function. This can be used as a criterion for terminating the thread. Upon receiving a return value of napi_closing from napi_call_threadsafe_function() a thread must not use the thread-safe function anymore because it is no longer guaranteed to be allocated.
Deciding whether to keep the process running
#
Similarly to libuv handles, thread-safe functions can be "referenced" and "unreferenced". A "referenced" thread-safe function will cause the event loop on the thread on which it is created to remain alive until the thread-safe function is destroyed. In contrast, an "unreferenced" thread-safe function will not prevent the event loop from exiting. The APIs napi_ref_threadsafe_function and napi_unref_threadsafe_function exist for this purpose.
Neither does napi_unref_threadsafe_function mark the thread-safe functions as able to be destroyed nor does napi_ref_threadsafe_function prevent it from being destroyed.
napi_create_threadsafe_function
#
History













N-API version: 4
NAPI_EXTERN napi_status
napi_create_threadsafe_function(napi_env env,
                                napi_value func,
                                napi_value async_resource,
                                napi_value async_resource_name,
                                size_t max_queue_size,
                                size_t initial_thread_count,
                                void* thread_finalize_data,
                                napi_finalize thread_finalize_cb,
                                void* context,
                                napi_threadsafe_function_call_js call_js_cb,
                                napi_threadsafe_function* result);
copy
[in] env: The environment that the API is invoked under.
[in] func: An optional JavaScript function to call from another thread. It must be provided if NULL is passed to call_js_cb.
[in] async_resource: An optional object associated with the async work that will be passed to possible async_hooks init hooks.
[in] async_resource_name: A JavaScript string to provide an identifier for the kind of resource that is being provided for diagnostic information exposed by the async_hooks API.
[in] max_queue_size: Maximum size of the queue. 0 for no limit.
[in] initial_thread_count: The initial number of acquisitions, i.e. the initial number of threads, including the main thread, which will be making use of this function.
[in] thread_finalize_data: Optional data to be passed to thread_finalize_cb.
[in] thread_finalize_cb: Optional function to call when the napi_threadsafe_function is being destroyed.
[in] context: Optional data to attach to the resulting napi_threadsafe_function.
[in] call_js_cb: Optional callback which calls the JavaScript function in response to a call on a different thread. This callback will be called on the main thread. If not given, the JavaScript function will be called with no parameters and with undefined as its this value. napi_threadsafe_function_call_js provides more details.
[out] result: The asynchronous thread-safe JavaScript function.
Change History:
Version 10 (NAPI_VERSION is defined as 10 or higher):
Uncaught exceptions thrown in call_js_cb are handled with the 'uncaughtException' event, instead of being ignored.
napi_get_threadsafe_function_context
#
Added in: v10.6.0 N-API version: 4
NAPI_EXTERN napi_status
napi_get_threadsafe_function_context(napi_threadsafe_function func,
                                     void** result);
copy
[in] func: The thread-safe function for which to retrieve the context.
[out] result: The location where to store the context.
This API may be called from any thread which makes use of func.
napi_call_threadsafe_function
#
History

















N-API version: 4
NAPI_EXTERN napi_status
napi_call_threadsafe_function(napi_threadsafe_function func,
                              void* data,
                              napi_threadsafe_function_call_mode is_blocking);
copy
[in] func: The asynchronous thread-safe JavaScript function to invoke.
[in] data: Data to send into JavaScript via the callback call_js_cb provided during the creation of the thread-safe JavaScript function.
[in] is_blocking: Flag whose value can be either napi_tsfn_blocking to indicate that the call should block if the queue is full or napi_tsfn_nonblocking to indicate that the call should return immediately with a status of napi_queue_full whenever the queue is full.
This API should not be called with napi_tsfn_blocking from a JavaScript thread, because, if the queue is full, it may cause the JavaScript thread to deadlock.
This API will return napi_closing if napi_release_threadsafe_function() was called with abort set to napi_tsfn_abort from any thread. The value is only added to the queue if the API returns napi_ok.
This API may be called from any thread which makes use of func.
napi_acquire_threadsafe_function
#
Added in: v10.6.0 N-API version: 4
NAPI_EXTERN napi_status
napi_acquire_threadsafe_function(napi_threadsafe_function func);
copy
[in] func: The asynchronous thread-safe JavaScript function to start making use of.
A thread should call this API before passing func to any other thread-safe function APIs to indicate that it will be making use of func. This prevents func from being destroyed when all other threads have stopped making use of it.
This API may be called from any thread which will start making use of func.
napi_release_threadsafe_function
#
Added in: v10.6.0 N-API version: 4
NAPI_EXTERN napi_status
napi_release_threadsafe_function(napi_threadsafe_function func,
                                 napi_threadsafe_function_release_mode mode);
copy
[in] func: The asynchronous thread-safe JavaScript function whose reference count to decrement.
[in] mode: Flag whose value can be either napi_tsfn_release to indicate that the current thread will make no further calls to the thread-safe function, or napi_tsfn_abort to indicate that in addition to the current thread, no other thread should make any further calls to the thread-safe function. If set to napi_tsfn_abort, further calls to napi_call_threadsafe_function() will return napi_closing, and no further values will be placed in the queue.
A thread should call this API when it stops making use of func. Passing func to any thread-safe APIs after having called this API has undefined results, as func may have been destroyed.
This API may be called from any thread which will stop making use of func.
napi_ref_threadsafe_function
#
Added in: v10.6.0 N-API version: 4
NAPI_EXTERN napi_status
napi_ref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
copy
[in] env: The environment that the API is invoked under.
[in] func: The thread-safe function to reference.
This API is used to indicate that the event loop running on the main thread should not exit until func has been destroyed. Similar to uv_ref it is also idempotent.
Neither does napi_unref_threadsafe_function mark the thread-safe functions as able to be destroyed nor does napi_ref_threadsafe_function prevent it from being destroyed. napi_acquire_threadsafe_function and napi_release_threadsafe_function are available for that purpose.
This API may only be called from the main thread.
napi_unref_threadsafe_function
#
Added in: v10.6.0 N-API version: 4
NAPI_EXTERN napi_status
napi_unref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
copy
[in] env: The environment that the API is invoked under.
[in] func: The thread-safe function to unreference.
This API is used to indicate that the event loop running on the main thread may exit before func is destroyed. Similar to uv_unref it is also idempotent.
This API may only be called from the main thread.
Miscellaneous utilities
#
node_api_get_module_file_name
#
Added in: v15.9.0, v14.18.0, v12.22.0 N-API version: 9
NAPI_EXTERN napi_status
node_api_get_module_file_name(node_api_basic_env env, const char** result);

copy
[in] env: The environment that the API is invoked under.
[out] result: A URL containing the absolute path of the location from which the add-on was loaded. For a file on the local file system it will start with file://. The string is null-terminated and owned by env and must thus not be modified or freed.
result may be an empty string if the add-on loading process fails to establish the add-on's file name during loading.
Node.js v24.4.1
  Table of contents 
 Index 
 Other versions 
 Options
Table of contents
C++ embedder API
Example embedding application
Setting up a per-process state
Setting up a per-instance state
C++ embedder API
#
Node.js provides a number of C++ APIs that can be used to execute JavaScript in a Node.js environment from other C++ software.
The documentation for these APIs can be found in src/node.h in the Node.js source tree. In addition to the APIs exposed by Node.js, some required concepts are provided by the V8 embedder API.
Because using Node.js as an embedded library is different from writing code that is executed by Node.js, breaking changes do not follow typical Node.js deprecation policy and may occur on each semver-major release without prior warning.
Example embedding application
#
The following sections will provide an overview over how to use these APIs to create an application from scratch that will perform the equivalent of node -e <code>, i.e. that will take a piece of JavaScript and run it in a Node.js-specific environment.
The full code can be found in the Node.js source tree.
Setting up a per-process state
#
Node.js requires some per-process state management in order to run:
Arguments parsing for Node.js CLI options,
V8 per-process requirements, such as a v8::Platform instance.
The following example shows how these can be set up. Some class names are from the node and v8 C++ namespaces, respectively.
int main(int argc, char** argv) {
  argv = uv_setup_args(argc, argv);
  std::vector<std::string> args(argv, argv + argc);
  // Parse Node.js CLI options, and print any errors that have occurred while
  // trying to parse them.
  std::unique_ptr<node::InitializationResult> result =
      node::InitializeOncePerProcess(args, {
        node::ProcessInitializationFlags::kNoInitializeV8,
        node::ProcessInitializationFlags::kNoInitializeNodeV8Platform
      });

  for (const std::string& error : result->errors())
    fprintf(stderr, "%s: %s\n", args[0].c_str(), error.c_str());
  if (result->early_return() != 0) {
    return result->exit_code();
  }

  // Create a v8::Platform instance. `MultiIsolatePlatform::Create()` is a way
  // to create a v8::Platform instance that Node.js can use when creating
  // Worker threads. When no `MultiIsolatePlatform` instance is present,
  // Worker threads are disabled.
  std::unique_ptr<MultiIsolatePlatform> platform =
      MultiIsolatePlatform::Create(4);
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  // See below for the contents of this function.
  int ret = RunNodeInstance(
      platform.get(), result->args(), result->exec_args());

  V8::Dispose();
  V8::DisposePlatform();

  node::TearDownOncePerProcess();
  return ret;
}
copy
Setting up a per-instance state
#
History









Node.js has a concept of a “Node.js instance”, that is commonly being referred to as node::Environment. Each node::Environment is associated with:
Exactly one v8::Isolate, i.e. one JS Engine instance,
Exactly one uv_loop_t, i.e. one event loop,
A number of v8::Contexts, but exactly one main v8::Context, and
One node::IsolateData instance that contains information that could be shared by multiple node::Environments. The embedder should make sure that node::IsolateData is shared only among node::Environments that use the same v8::Isolate, Node.js does not perform this check.
In order to set up a v8::Isolate, an v8::ArrayBuffer::Allocator needs to be provided. One possible choice is the default Node.js allocator, which can be created through node::ArrayBufferAllocator::Create(). Using the Node.js allocator allows minor performance optimizations when addons use the Node.js C++ Buffer API, and is required in order to track ArrayBuffer memory in process.memoryUsage().
Additionally, each v8::Isolate that is used for a Node.js instance needs to be registered and unregistered with the MultiIsolatePlatform instance, if one is being used, in order for the platform to know which event loop to use for tasks scheduled by the v8::Isolate.
The node::NewIsolate() helper function creates a v8::Isolate, sets it up with some Node.js-specific hooks (e.g. the Node.js error handler), and registers it with the platform automatically.
int RunNodeInstance(MultiIsolatePlatform* platform,
                    const std::vector<std::string>& args,
                    const std::vector<std::string>& exec_args) {
  int exit_code = 0;

  // Setup up a libuv event loop, v8::Isolate, and Node.js Environment.
  std::vector<std::string> errors;
  std::unique_ptr<CommonEnvironmentSetup> setup =
      CommonEnvironmentSetup::Create(platform, &errors, args, exec_args);
  if (!setup) {
    for (const std::string& err : errors)
      fprintf(stderr, "%s: %s\n", args[0].c_str(), err.c_str());
    return 1;
  }

  Isolate* isolate = setup->isolate();
  Environment* env = setup->env();

  {
    Locker locker(isolate);
    Isolate::Scope isolate_scope(isolate);
    HandleScope handle_scope(isolate);
    // The v8::Context needs to be entered when node::CreateEnvironment() and
    // node::LoadEnvironment() are being called.
    Context::Scope context_scope(setup->context());

    // Set up the Node.js instance for execution, and run code inside of it.
    // There is also a variant that takes a callback and provides it with
    // the `require` and `process` objects, so that it can manually compile
    // and run scripts as needed.
    // The `require` function inside this script does *not* access the file
    // system, and can only load built-in Node.js modules.
    // `module.createRequire()` is being used to create one that is able to
    // load files from the disk, and uses the standard CommonJS file loader
    // instead of the internal-only `require` function.
    MaybeLocal<Value> loadenv_ret = node::LoadEnvironment(
        env,
        "const publicRequire ="
        "  require('node:module').createRequire(process.cwd() + '/');"
        "globalThis.require = publicRequire;"
        "require('node:vm').runInThisContext(process.argv[1]);");

    if (loadenv_ret.IsEmpty())  // There has been a JS exception.
      return 1;

    exit_code = node::SpinEventLoop(env).FromMaybe(1);

    // node::Stop() can be used to explicitly stop the event loop and keep
    // further JavaScript from running. It can be called from any thread,
    // and will act like worker.terminate() if called from another thread.
    node::Stop(env);
  }

  return exit_code;
}
copy

